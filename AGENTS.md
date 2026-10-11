# AGENTS.md

Personal site for GM Manny, live at https://themannyverse.com.

## Stack
Vite 8, plain JS, no framework. Pages are prerendered from content files. Node 22. Tests use `node --test`.

## Commands
- Dev: `npm install && npm run dev` (http://localhost:5173).
- Check: `npm run check`. Build: `npm run build`. Test: `npm test`.

## Content
Content lives in `content/` (list/site/links/about). `npm run check` validates. The build fails on bad content.

Visible copy only from Quill's deck. Never invent copy.

Art only from the allowed list. No AI images.

Colours only through the tokens in `src/style.css`.

## Git
Work on a branch. `main` deploys. Push only when the brief says. Never force-push. Never run `gh workflow run`.

No plan mode: write `_handoff/out/PLAN.md` and continue.

## Verify
Verify at 390 and 1440 in light and dark (see `_handoff/briefs/COMMON.md` while the redesign runs).
