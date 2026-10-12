# Deployment Notes

## Status

### GitHub Repository
- **Name**: `CCGermaine/themannyverse.com`
- **Visibility**: Public
- **Local path**: `/home/manny/Work/themannyverse.com/`
- **Default branch**: `main`
- **Live site**: the build on `main`. The redesign launched on 2026-10-12. A local build does not publish.

### Live URLs
- **Custom domain**: https://themannyverse.com
- **www**: https://www.themannyverse.com returns **301** to the apex (rechecked 2026-10-12)
- **GitHub Pages project URL**: `https://ccgermaine.github.io/themannyverse.com/` redirects to the apex

### What's deployed
Home, Games (`/games/`), Art & Zines (`/art-zines/`), and `404.html`, plus `robots.txt` and `sitemap.xml`. Pages are prerendered from `content/`. Seats stay on StartPlaying. Support is three text links. GoatCounter is on (site code `manny` in `content/site.json`).

The Art & Zines page is part of this build. Cherating is still hidden: no page and no line.

### CI/CD
- **Workflow**: `.github/workflows/deploy.yml`
- **Trigger**: push to `main`, or `workflow_dispatch`
- **Build**: `npm ci`, `npm test`, then `npm run build` → `dist/`
- **Content check**: `prebuild` runs `npm run check` inside the build. A bad content file fails the run. Pages keeps serving the last good artifact.
- **Deploy**: `actions/upload-pages-artifact` then `actions/deploy-pages@v4` to the `github-pages` environment

The workflow does not push a `gh-pages` branch. Pages serves the uploaded artifact.

### GitHub Pages
```yaml
Build type: workflow
Source: main branch (workflow deployment)
CNAME: themannyverse.com
HTTPS: on
```

### DNS records

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | themannyverse.com | 185.199.108.153 | 600 |
| A | themannyverse.com | 185.199.109.153 | 600 |
| A | themannyverse.com | 185.199.110.153 | 600 |
| A | themannyverse.com | 185.199.111.153 | 600 |
| CNAME | *.themannyverse.com | ccgermaine.github.io/themannyverse.com | 600 |
| MX | themannyverse.com | fwd1.porkbun.com (prio: 10) | 600 |
| MX | themannyverse.com | fwd2.porkbun.com (prio: 20) | 600 |
| TXT | themannyverse.com | v=spf1 include:_spf.porkbun.com ~all | 600 |

`www.themannyverse.com` answers 301 to `https://themannyverse.com/` (checked 2026-10-12).

## Technical notes

### Vite base path
`base: '/'` in `vite.config.js`. A base of `/themannyverse.com/` 404s the CSS and JS on the custom domain.

### Dev server
`npm run dev` is `http://localhost:5173` (`strictPort: true`).

### .nojekyll
`public/.nojekyll` is copied into `dist/`.

### ALIAS record
Porkbun's ALIAS record did not resolve on public DNS. It was replaced with the four A records above. See [DNS](dns.md).

## Project structure

```
themannyverse.com/
├── index.html
├── games/index.html
├── art-zines/index.html
├── 404.html
├── README.md
├── AGENTS.md          (CLAUDE.md is a symlink to it)
├── package.json
├── vite.config.js
├── content/
│   ├── list.json
│   ├── site.json
│   ├── links.json
│   └── about.md
├── build/
│   ├── content.js
│   ├── prerender-plugin.js
│   ├── render.js
│   └── webp-size.js
├── scripts/
│   └── check-content.mjs
├── test/
├── src/
│   ├── main.js
│   ├── when.js
│   └── style.css
├── public/
│   ├── .nojekyll
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── favicon.svg
│   ├── art/
│   ├── fonts/
│   └── og/og-1200x630.png
├── docs/
└── .github/workflows/
    └── deploy.yml
```

## Commands

```bash
npm test
npm run dev       # http://localhost:5173
npm run check
npm run build
npm run preview
```

## Still open

- Cherating stays hidden until there is a package to publish
