# themannyverse.com — Technical Stack

## Stack

- **Build tool**: Vite
- **Languages**: HTML, CSS, and JavaScript. The shipped site has no TypeScript
- **Styling**: one CSS file, no framework
- **Version control**: Git
- **Hosting**: GitHub Pages (free tier)
- **Deployment**: GitHub Actions, Pages artifact
- **Domain**: themannyverse.com at Porkbun, DNS to GitHub Pages. HTTPS is on
- **Booking**: weekly seats stay on StartPlaying. Money For Manny is three text links: Stripe, PayPal, and Wise. The page does not load their scripts

## Rationale

Why Vite + vanilla over Astro or a full SSG:

- **Simplicity**: V1 is a single-page site. The complexity of Astro's content collections doesn't pay off yet.
- **Familiarity**: Already using Vite for the mythic-dice extension. Zero learning curve.
- **AI-assisted iterative dev**: Vite's hot module replacement supports the workflow of "build a section → refine → add next section."
- **Expandability**: Vite is extremely flexible. Migration to Astro or additional pages later is straightforward.

## GitHub Pages Free Tier Constraints

### Hard Limits (must respect)
- **Published site size**: 1 GB max — generous for our needs (mythic-dice build is only 6.7MB)
- **Repo size**: 1 GB max. This repo is the page, one font, and the favicon
- **Bandwidth**: 100 GB/month — vast beyond realistic traffic needs
- **Build time**: 10 minutes — Vite builds in seconds
- **Git LFS**: Not supported on Pages — don't use it; commit binaries directly

### Action Minutes
- **Public repos**: Unlimited Actions minutes (this is what we'll use)
- **Private repos**: 2,000 minutes/month (still plenty, but public is preferred)

### Key Recommendations
1. **Keep the repo public** — unlimited Actions minutes, no cost
2. **Do not use Git LFS** — commit all images/assets directly to the repo
3. **Optimize images** — use WebP/AVIF with appropriate sizing to keep builds lean
4. **Deploy via GitHub Actions** — build `dist/` and publish the Pages artifact on push to `main`

The shipped tree is in [Deployment Notes](deployment.md). The early sketch (separate `styles/` and `scripts/` folders, a `gh-pages` branch) was not what got built.

## Deployment Workflow

1. Develop locally with `npm run dev` (Vite on http://localhost:5173)
2. Push to `main`
3. GitHub Actions runs `npm run build`
4. `dist/` is uploaded as a Pages artifact and deployed
5. https://themannyverse.com serves that artifact

## Domain

themannyverse.com is registered at Porkbun. The apex uses four A records to GitHub Pages, and HTTPS is on. The record list and the `www` CNAME that does not resolve are in [DNS Progress](dns.md) and [Deployment Notes](deployment.md).

## What We DON'T Need for V1

- Database
- User accounts
- Shopping cart
- Custom payment server
- Complicated CMS
- Dedicated backend
- WordPress/Wix/Squarespace
- CDN subscription (GitHub Pages includes global CDN)
- Paid SSL certificate (GitHub Pages handles this)
- Customer-account system
- Booking SaaS
