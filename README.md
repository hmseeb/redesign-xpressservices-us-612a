# Xpress Services — Website

A complete redesign of the Xpress Services website: a modern, clean and professional
marketing site for the Houston, TX home, business, car and emergency service company.

**We are here to make it happen!** — residential, commercial, car and 24/7 emergency
services, delivered by bilingual crews using non-toxic products.

## Stack

Vanilla HTML5, CSS3 and JavaScript. No build step, no dependencies, no environment
variables. Open `index.html` in a browser, or serve the folder statically:

```bash
python3 -m http.server 8000
```

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, service lines, values, featured work, why choose us, app, testimonials |
| `services.html` | All four service lines plus the filterable portfolio of every service |
| `about.html` | Company story, why choose us, how we work, payments and partnering |
| `contact.html` | Phone, email, address, socials and a quote request form |

## Structure

```
.
├── index.html
├── services.html
├── about.html
├── contact.html
└── assets/
    ├── css/styles.css   # design system + all page styles
    ├── js/main.js       # nav, scroll reveal, gallery filters, counters, form
    └── favicon.svg      # brand mark
```

## Features

- Responsive layout from 320px to large desktop, with a mobile drawer nav and a
  floating "Call Now" button on small screens.
- Filterable work gallery (All / Residential / Business / Cars / On Line / Emergencies)
  with deep links such as `services.html#cars`.
- Scroll-reveal animations and animated stat counters, both disabled automatically
  under `prefers-reduced-motion`.
- Quote form with client-side validation that hands off to the visitor's mail app —
  no backend, no third-party API.
- Semantic HTML, skip link, ARIA labelling, descriptive alt text, Open Graph/Twitter
  meta tags and JSON-LD structured data.

## Contact details used

- **Phone:** +1 832 235 8699
- **Email:** info@xpressservices.us
- **Address:** 712 Wilcrest Dr #2054, Houston, TX 77042, USA
- **Apps:** [App Store](https://apps.apple.com/us/app/xpress-services/id1601549006) ·
  [Google Play](https://play.google.com/store/apps/details?id=com.app.xpressservices23)

© Xpress Services.
