# themannyverse.com — Hosting

## GitHub Pages Deployment

The site is live on the GitHub Pages free tier at https://themannyverse.com. HTTPS is on. Booking stays on StartPlaying. See [Deployment Notes](deployment.md).

```text
Porkbun
      │
themannyverse.com
      │
      ▼
 four A records
      │
      ▼
GitHub Pages
      │
      ▼
┌─────────────────────────┐
│  Home                   │
│  Games                  │
│  Art & Zines            │
│  404                    │
└───────────┬─────────────┘
            │
            ▼
 StartPlaying · Discord · itch.io
```

`www.themannyverse.com` 301-redirects to the apex.

## Deployment Steps

1. **Build**: `npm run build` writes `dist/`. The content check runs first.
2. **Deploy**: GitHub Actions runs the tests, uploads `dist/` as a Pages artifact, and `deploy-pages` publishes it
3. **Serve**: GitHub Pages serves that artifact at https://themannyverse.com. An unknown path gets `404.html`.

## Branch Strategy

- `main` holds source only. `dist/` is gitignored
- There is no `gh-pages` branch. Pages serves the workflow artifact
- Work for the redesign lands on a branch. Merging to `main` deploys.

## Configuration in place

1. `public/.nojekyll` is copied into `dist/`
2. `.github/workflows/deploy.yml` tests, builds, and deploys on push to `main`
3. Pages is set to the GitHub Actions workflow
4. Custom domain themannyverse.com is on, with HTTPS

## Costs

- **GitHub**: Free (public repo, free Pages, unlimited Actions minutes for public repos)
- **GitHub Pages**: Free
- **SSL/HTTPS**: Free (GitHub Pages provides automatic SSL)
- **Domain**: themannyverse.com, already purchased (~RM50-100/year)

## First-Year Budget

| Item | Up-front Cost | Ongoing Cost |
|------|--------------|--------------|
| Domain name | ~RM50-100/year | ~RM50-100/year |
| GitHub | RM0 | RM0 |
| GitHub Pages | RM0 | RM0 |
| SSL/HTTPS | RM0 | RM0 |

**Total first-year cost: Approximately RM50-100** (the domain). Booking stays on StartPlaying.
