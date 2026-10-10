# AGENTS.md

Personal site for GM Manny, live at https://themannyverse.com. Vite, plain JS, no framework.

- Dev: `npm install && npm run dev` (http://localhost:5173). Build: `npm run build`.
- Deploy: push to `main`; `.github/workflows/deploy.yml` builds `dist/` and publishes to GitHub Pages.
- Games are edited only in `src/games.js`. Keep `docs/games-data.md` in sync in the same commit.
- Technical docs live in `docs/`. Read them before changing hosting, DNS, or deployment.
- Business and marketing notes live in Christian's Obsidian vault (`~/Vault`), not here.
