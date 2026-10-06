# جوزاء للتبريد والتكييف — Website

Arabic (RTL) single-page website for **JAWZA Air Conditioning** — AC, fridge & washing machine repair + motor rewinding in Riyadh, KSA.

Built with **React + Vite**, zero heavy dependencies (no UI framework), fully optimized for speed & SEO.

## Run

```bash
npm install
npm run dev      # development
npm run build    # production build -> dist/
npm run preview  # preview production build
```

## Deploy

Upload the `dist/` folder to any static host (Netlify, Vercel, Cloudflare Pages, cPanel).

Before deploying, replace the domain in:
- `index.html` (canonical, og:url, JSON-LD)
- `public/robots.txt`
- `public/sitemap.xml`

## Media pipeline (dev only)

Original client photos live in `Public-Raw`. To re-process them:

```bash
node scripts/process-media.mjs    # enhance + resize + webp -> src/assets/media
node scripts/process-videos.mjs   # compress videos -> public/videos
```

## Key features

- Native Arabic RTL (no Google Translate) — Tajawal font
- Animated hero with snowfall particles + WhatsApp booking form
- Interactive symptom checker (عطل → سبب → حل)
- Before/After drag slider, gallery lightbox, hover-play videos
- Auto testimonials carousel, FAQ accordion, Riyadh areas chips
- Floating WhatsApp + Call buttons, scroll-reveal animations
- SEO: meta, OpenGraph, Schema.org HVACBusiness JSON-LD, sitemap, robots
- Performance: lazy images, no autoplay video download, ~76KB JS gzip
