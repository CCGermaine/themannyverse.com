# TTRPG Games Data

`src/games.js` is the Play list. This file and the Obsidian note `TTRPG Games Data` should match it. StartPlaying holds the long copy, the live seats, and booking.

The homepage prints a name and one facts line: system (when the title is not already the system), weekday, price, and a status word. The weekday stands in for a session date, so the page does not need a weekly date edit. An open seat is the status word in yellow. A full table stays grey.

## Listings

Checked against `src/games.js` on 2026-10-05.

| Name | System on the line | Day | Price | Status | StartPlaying |
|------|--------------------|-----|-------|--------|--------------|
| Into the Gloaming | Shadowdark | Sun | $20 | Full | https://startplaying.games/adventure/cmhszv63c00lcjr04wq58qqdz |
| A Pound of Flesh | Mothership | Wed | $20 | Full | https://startplaying.games/adventure/cmo833juj000wjs04b1ysf4c4 |
| Mythic Bastionland | title is the system | Thu | $15 | Full | https://startplaying.games/adventure/cmuii5bfx0087jv04trzf80j8 |
| Mythic Bastionland | title is the system | Fri | $15 | 2 to start | https://startplaying.games/adventure/cmuii6bsh00g0l504h1t44iqg |

The Wednesday URL is the listing that was Into the Western Reaches. On 2026-10-05 that slot became A Pound of Flesh (Mothership). The Sunday listing stayed Into the Gloaming.

## Fields in `src/games.js`

- `id` — internal key
- `name` — the link text
- `system` — omitted on the page when `null` (both Mythic Bastionland rows)
- `day` — `Sun`, `Wed`, `Thu`, or `Fri`
- `price` — USD, per session
- `status` — the words on the page
- `open` — `true` draws the status in yellow
- `url` — StartPlaying adventure page

## Updating a table

1. Change the status word and `open` in `src/games.js`.
2. Update this file and the vault note `TTRPG Games Data` in the same pass.
3. Commit them together.

Sessions use Discord for audio and Owlbear Rodeo as the table. The homepage does not print that.
