# themannyverse.com

Personal index for Manny: a name, one line, and a list of doors. Weekly games link out to StartPlaying. Artwork and Cherating are short lines until those pages exist.

Built with Vite. Hosted on GitHub Pages at https://themannyverse.com.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Deployment

A push to `main` runs `.github/workflows/deploy.yml`. The workflow builds `dist/` and deploys that artifact to GitHub Pages.

## Where things live

- `index.html` — page shell, about line, artwork, Cherating, and footer links
- `src/main.js` — renders the game rows
- `src/games.js` — the only place a game is edited
- `src/style.css` — layout. Near-black ground, yellow `#e6ff32` for the name and an open seat
- `public/fonts/` — Protest Guerrilla, used for the name. License is `OFL.txt`

Planning notes live in the Obsidian vault at `themannyverse.com/`. `TTRPG_GAMES_DATA.md` in this repo and the vault note `TTRPG Games Data` should match `src/games.js`.
