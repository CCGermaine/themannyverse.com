# AGENTS.md

Personal site for GM Manny, live at https://themannyverse.com.

## Stack
Vite 8, plain JS, no framework. Four pages are prerendered from content files: Home, Games, Art & Zines, and a 404. Node 22. Tests use `node --test`.

## Commands
- Dev: `npm install && npm run dev` (http://localhost:5173).
- Check: `npm run check`. Build: `npm run build`. Test: `npm test`.

## Content
Games, zines and gallery art are edited only in `content/list.json`. Site copy is `content/site.json`. Links are `content/links.json`. The about line is `content/about.md`. `npm run check` validates. The build fails on bad content. See `docs/content.md`.

Visible copy comes only from Quill's copy deck. Never invent copy.

Only art on the allowed list in `docs/content.md`. Never the forbidden list. No AI images.

Colours only through the theme tokens in `src/style.css`. Never a raw hex in component CSS.

Visual reference: `docs/site-sections.md` plus the M4 shots (390 and 1440, light and dark).

## Git
Work on a branch. `main` deploys. Push only when the brief says. Never force-push. Never run `gh workflow run`.

## Verify
Build with `npm run build` (copy slots are filled; `ALLOW_LOREM=1` is only for local drafts). Preview in the background (`npx vite preview --port 4173 --strictPort`). Playwright at 390 and 1440, light and dark, with a 60 second timeout on each action and `timeout 300` around the run. No horizontal scroll. Stop the server.
