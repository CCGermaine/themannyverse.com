# themannyverse.com — Technical Stack

## Stack

- **Build tool**: Vite 8. Pages are prerendered at build time from `content/`. There is no client framework.
- **Languages**: HTML, CSS, and JavaScript. The shipped site has no TypeScript.
- **Styling**: `src/style.css`. Colours come from the theme tokens. Light and dark share one stylesheet.
- **Fonts**: four self-hosted SIL OFL files in `public/fonts/` (Grenze Gotisch, Atkinson Hyperlegible Next, IBM Plex Mono 500 and 700). No third-party font request.
- **Tests**: `node --test` (`npm test`).
- **Version control**: Git
- **Hosting**: GitHub Pages (free tier)
- **Deployment**: GitHub Actions, Pages artifact. `npm run build` runs the content check first (`prebuild`).
- **Domain**: themannyverse.com at Porkbun, DNS to GitHub Pages. HTTPS is on. `www` 301-redirects to the apex.
- **Booking**: weekly seats stay on StartPlaying. Support is three text links (Stripe, PayPal, Wise). The page does not load their scripts.
- **Analytics**: one GoatCounter script, and only when `content/site.json` has a site code. An empty code emits nothing. Tracked links carry `data-goatcounter-click`. GoatCounter is the only third-party script.

## Rationale

Why Vite and a small prerender step, rather than Astro or a CMS:

- **Simplicity**: v1 is three pages plus a 404. The content files are JSON and one text file. A content-collection framework does not pay off yet.
- **Familiarity**: Vite is already the tool for the Mythic Dice extension.
- **A check Christian can read**: bad JSON fails the build with a file, a line, and a reason. The live site stays on the last good artifact.
- **Expandability**: more pages are more HTML shells and a render function, not a new stack.

## GitHub Pages Free Tier Constraints

### Hard Limits (must respect)
- **Published site size**: 1 GB max
- **Repo size**: 1 GB max
- **Bandwidth**: 100 GB/month
- **Build time**: 10 minutes. Vite builds in seconds.
- **Git LFS**: Not supported on Pages. Commit the webp files directly.

### Action Minutes
- **Public repos**: Unlimited Actions minutes
- **Private repos**: 2,000 minutes/month

### Key Recommendations
1. **Keep the repo public**
2. **Do not use Git LFS**
3. **Images are already exported webp**. Do not add a build-time image pipeline.
4. **Deploy via GitHub Actions**. Build `dist/` and publish the Pages artifact on push to `main`.

The shipped tree is in [Deployment Notes](deployment.md).

## Deployment Workflow

1. Develop locally with `npm run dev` (Vite on http://localhost:5173).
2. `npm test` and `npm run build`.
3. Push to `main`.
4. GitHub Actions runs `npm ci`, `npm test`, then `npm run build`.
5. `dist/` is uploaded as a Pages artifact and deployed.
6. https://themannyverse.com serves that artifact.

## Domain

themannyverse.com is registered at Porkbun. The apex uses four A records to GitHub Pages, and HTTPS is on. `www` returns 301 to the apex. The record list is in [DNS Progress](dns.md) and [Deployment Notes](deployment.md).

## What v1 does not include

- A database
- User accounts
- A shopping cart or a payment server
- A CMS
- WordPress, Wix, or Squarespace
- A paid CDN or a paid SSL certificate
- A booking service of our own (StartPlaying keeps the seats)
