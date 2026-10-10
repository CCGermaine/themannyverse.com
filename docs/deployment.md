# Deployment Notes

## Status

### GitHub Repository
- **Name**: `CCGermaine/themannyverse.com`
- **Visibility**: Public
- **Local path**: `/home/manny/Work/themannyverse.com/`
- **Default branch**: `main`
- **Live site**: `7851519`, pushed 2026-10-09. Each game shows the visitor's local day and time. Starts are 8:00 in `Asia/Kuala_Lumpur`.

### Live URLs
- **Custom domain**: https://themannyverse.com — HTTPS 200 on 2026-10-09, `last-modified` `2026-10-09 10:33:51 GMT` for commit `7851519`
- **GitHub Pages project URL**: `https://ccgermaine.github.io/themannyverse.com/` redirects to the apex

### What's deployed
The index described in [Site Sections](site-sections.md). Near-black page, yellow name, four game links, artwork and Cherating as text rows, Money For Manny, and the seven footer links. Game data is [TTRPG Games Data](games-data.md).

### CI/CD
- **Workflow**: `.github/workflows/deploy.yml`
- **Trigger**: push to `main`, or `workflow_dispatch`
- **Build**: `npm ci` then `npm run build` → `dist/`
- **Deploy**: `actions/upload-pages-artifact` then `actions/deploy-pages@v4` to the `github-pages` environment
- **Last green run**: `37918293579`, 2026-10-09, for commit `7851519`. Build 11s, deploy 36s. The previous green run was `37916150953` (`19cccab`)

The workflow does not push a `gh-pages` branch. Pages serves the uploaded artifact.

### GitHub Pages
```yaml
Build type: workflow
Source: main branch (workflow deployment)
CNAME: themannyverse.com
HTTPS: on (verified 2026-10-05)
```

### DNS records

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | themannyverse.com | 185.199.108.153 | 600 |
| A | themannyverse.com | 185.199.109.153 | 600 |
| A | themannyverse.com | 185.199.110.153 | 600 |
| A | themannyverse.com | 185.199.111.153 | 600 |
| CNAME | *.themannyverse.com | ccgermaine.github.io/themannyverse.com | 600 |
| CNAME | www.themannyverse.com | ccgermaine.github.io/themannyverse.com | 600 |
| MX | themannyverse.com | fwd1.porkbun.com (prio: 10) | 600 |
| MX | themannyverse.com | fwd2.porkbun.com (prio: 20) | 600 |
| TXT | themannyverse.com | v=spf1 include:_spf.porkbun.com ~all | 600 |

Rechecked on 2026-10-07. The four A records, both MX records, and the SPF TXT resolve. `www` and the wildcard CNAME are published, and their target `ccgermaine.github.io/themannyverse.com` is not a hostname, so those names do not resolve. The apex is the working URL.

## Technical notes

### Vite base path
`base: '/'` in `vite.config.js`. A base of `/themannyverse.com/` 404s the CSS and JS on the custom domain.

### Dev server
`npm run dev` is `http://localhost:5173` (`strictPort: true`). The old README port `5153` was wrong.

### .nojekyll
`public/.nojekyll` is copied into `dist/`.

### ALIAS record
Porkbun's ALIAS record did not resolve on public DNS. It was replaced with the four A records above. History is in [DNS Progress](dns.md).

## Project structure

```
themannyverse.com/
├── index.html
├── README.md
├── TTRPG_GAMES_DATA.md
├── vite.config.js
├── package.json
├── public/
│   ├── .nojekyll
│   ├── favicon.svg
│   └── fonts/
│       ├── protest-guerrilla-latin-400-normal.woff2
│       └── OFL.txt
├── src/
│   ├── games.js
│   ├── main.js
│   └── style.css
└── .github/workflows/
    └── deploy.yml
```

## Commands

```bash
npm run dev       # http://localhost:5173
npm run build
npm run preview
```

## Still open
- Artwork page, so that row can become a link
- Cherating page, so the packages line can become a link
