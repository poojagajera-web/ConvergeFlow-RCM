# ConvergeFlow — marketing site

Next.js 16 (App Router, Turbopack) · React 19 · CSS Modules + design tokens · GSAP 3 + ScrollTrigger/SplitText · Lenis.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (all routes prerender as static)
npm run start
npm run lint
```

## Structure

```
src/
  app/                 layout (fonts, header/footer, Lenis), home, /demo, not-found, globals.css (tokens)
  content/
    home.ts            all home-page copy and product data
    navigation.ts      sitemap IA (ConvergeFlow_RCM_Sitemap.xlsx) + BUILT_ROUTES
  components/
    layout/            Header (mega menus, mobile sheet), Footer
    sections/          one folder-less component + CSS module per home section
    product/           live verification console, video dialog
    forms/             DemoForm (shared by home #demo and /demo)
    motion/            SmoothScroll (Lenis ↔ GSAP ticker), MotionScope (data-anim reveals), useMotion
    ui/                Button, SmartLink (hash-aware links), Logo
  lib/gsap.ts          plugin registration + shared media queries
```

## Animation conventions

- Markup opts into scroll reveals with `data-anim="fade|stagger|lines|clip|draw|count"`; `MotionScope` wraps each page so reveals start only after hydration.
- Component choreography uses `useMotion(ref, ({ motion, desktop }) => …)` — a `gsap.matchMedia` context that reverts on unmount and when reduced-motion changes.
- `prefers-reduced-motion: reduce` disables Lenis and every tween; content is never hidden without JavaScript.

## Adding sitemap pages

Navigation lists every sitemap slug. Until a page exists, links fall back to the matching home-page section. When you ship a route, add its slug to `BUILT_ROUTES` in `src/content/navigation.ts` and the header, mega menus and footer switch to it automatically.

## Open items

- The demo form validates and confirms locally only — it is not connected to a CRM, email or scheduling backend yet (the original site behaved the same way).
- Pricing, Login/client portal, Resources content and legal pages from the sitemap are not built.
