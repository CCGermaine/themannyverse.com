# themannyverse.com

GM Manny's site for weekly online tables, zines, and the art drawn for those games. Live at https://themannyverse.com.

Built with Vite. Four static pages (Home, Games, Art & Zines, and a 404) are prerendered from `content/`. Hosted on GitHub Pages.

## Development

```bash
npm install
npm test
npm run dev
```

Open `http://localhost:5173`.

`npm run check` validates the content files. `npm run build` runs that check, then writes `dist/`.

## Deployment

A push to `main` runs `.github/workflows/deploy.yml`. The workflow installs, tests, builds `dist/`, and deploys that artifact to GitHub Pages.

## Where things live

- `content/list.json` — games, zines, and gallery art
- `content/site.json` — page copy that is not tied to one item
- `content/links.json` — Discord, StartPlaying, itch, Support, socials
- `content/about.md` — the footer about line
- `index.html`, `games/index.html`, `art-zines/index.html`, `404.html` — page shells
- `build/` — the content check and the prerender step
- `src/style.css` — theme tokens and layout
- `src/main.js` — local times, the theme control, and the status stamp
- `src/when.js` — Malaysia start to the visitor's clock
- `public/fonts/` — self-hosted OFL fonts
- `public/art/` — exported webp
- `docs/content.md` — how to edit a table on GitHub

Concept notes live in the Obsidian vault. The site does not read the vault. The list file is the source for what the pages show.
