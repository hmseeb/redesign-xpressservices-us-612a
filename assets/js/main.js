/* ==========================================================================
   Xpress Services — site scripts (vanilla JS, no dependencies)
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Sticky header state ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('primary-menu');

  function closeMenu() {
    if (!menu || !toggle) return;
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', function (e) {
      if (!menu.classList.contains('is-open')) return;
      if (menu.contains(e.target) || toggle.contains(e.target)) return;
      closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealables = document.querySelectorAll('.reveal');
  if (revealables.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
          window.setTimeout(function () { el.classList.add('is-in'); }, delay);
          io.unobserve(el);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

      revealables.forEach(function (el) { io.observe(el); });
    } else {
      revealables.forEach(function (el) { el.classList.add('is-in'); });
    }
  }

  /* ---------- Work gallery filters ---------- */
  var filterBar = document.querySelector('[data-filters]');
  if (filterBar) {
    var gallery = document.querySelector('[data-gallery]');
    var tiles = gallery ? Array.prototype.slice.call(gallery.querySelectorAll('.tile')) : [];
    var empty = document.querySelector('[data-gallery-empty]');

    var applyFilter = function (key) {
      var shown = 0;
      tiles.forEach(function (tile) {
        var cats = (tile.getAttribute('data-cat') || '').split(' ');
        var match = key === 'all' || cats.indexOf(key) !== -1;
        tile.classList.toggle('is-hidden', !match);
        if (match) {
          shown++;
          // restart the entrance animation for a snappy re-flow
          tile.style.animation = 'none';
          /* eslint-disable-next-line no-unused-expressions */
          tile.offsetHeight;
          tile.style.animation = '';
        }
      });
      if (empty) empty.hidden = shown !== 0;
    };

    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter');
      if (!btn) return;
      filterBar.querySelectorAll('.filter').forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      applyFilter(btn.getAttribute('data-filter') || 'all');
    });

    // Deep-link support: services.html#residential
    var hash = (window.location.hash || '').replace('#', '');
    if (hash) {
      var preset = filterBar.querySelector('[data-filter="' + hash.replace(/[^a-z0-9-]/gi, '') + '"]');
      if (preset) preset.click();
    }
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var start = null;
        var dur = 1100;

        var step = function (ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) window.requestAnimationFrame(step);
        };

        window.requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.4 });

    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Contact form (client-side, opens the visitor's mail app) ---------- */
  var form = document.querySelector('[data-quote-form]');
  if (form) {
    var status = form.querySelector('[data-form-status]');

    var setError = function (field, message) {
      var wrap = field.closest('.field');
      if (!wrap) return;
      wrap.classList.toggle('has-error', !!message);
      var note = wrap.querySelector('small');
      if (note) note.textContent = message || '';
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.elements.name;
      var email = form.elements.email;
      var phone = form.elements.phone;
      var service = form.elements.service;
      var message = form.elements.message;
      var ok = true;

      if (!name.value.trim()) { setError(name, 'Please tell us your name.'); ok = false; }
      else setError(name, '');

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        setError(email, 'Enter a valid email address.'); ok = false;
      } else setError(email, '');

      if (!message.value.trim()) { setError(message, 'Let us know what you need.'); ok = false; }
      else setError(message, '');

      if (!ok) {
        var firstBad = form.querySelector('.field.has-error input, .field.has-error textarea');
        if (firstBad) firstBad.focus();
        return;
      }

      var subject = 'Quote request — ' + (service.value || 'Xpress Services');
      var body = [
        'Name: ' + name.value.trim(),
        'Email: ' + email.value.trim(),
        'Phone: ' + (phone.value.trim() || 'Not provided'),
        'Service: ' + (service.value || 'Not specified'),
        '',
        message.value.trim()
      ].join('\n');

      window.location.href = 'mailto:info@xpressservices.us?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

      if (status) {
        status.textContent = 'Thanks, ' + name.value.trim().split(' ')[0] +
          '! Your email app is opening with the request ready to send. Prefer to talk? Call +1 832 235 8699.';
        status.classList.add('is-visible');
      }
      form.reset();
    });
  }

  /* ---------- Graceful image fallback ----------
     If a photo fails to load (offline, blocked host, slow CDN) we hide the broken
     <img> and let its container show a branded placeholder instead of a broken icon.
     Layout never shifts because every container has a fixed aspect-ratio.          */
  var HOLDERS = '.tile, .line-card__media, .hero__frame, .split__media';

  function markBroken(img) {
    var holder = img.closest(HOLDERS);
    if (holder) holder.classList.add('img-failed');
    img.style.display = 'none';
  }

  function watchImage(img) {
    if (img.dataset.fallbackBound) return;
    img.dataset.fallbackBound = '1';
    img.addEventListener('error', function () { markBroken(img); });
    if (img.complete && img.naturalWidth === 0) markBroken(img);
  }

  document.querySelectorAll('img').forEach(watchImage);
  window.addEventListener('load', function () {
    document.querySelectorAll('img').forEach(function (img) {
      if (img.complete && img.naturalWidth === 0) markBroken(img);
    });
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
