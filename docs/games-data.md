# TTRPG Games Data

`src/games.js` is the Play list. This file should match it. StartPlaying holds the long copy, the live seats, and booking.

The homepage prints a name and one facts line: system (when the title is not already the system), the visitor's local day and time, price, and a status word. Each game stores an 8:00 start in `Asia/Kuala_Lumpur`. The browser converts that weekly time, including the US clock change. An open seat is the status word in yellow. A full table stays grey.

Cover art left the page in repo commit `00faf72` (2026-10-05). Commit `7f157cc` (pushed 2026-10-07) removed `mythic-bastionland.webp` and `shadowdark-generic.webm`. Those URLs returned 404 on the live site after that deploy.

## Listings

Checked against `src/games.js` on 2026-10-09.

| Name | System on the line | Malaysia start | Price | Status | StartPlaying |
|------|--------------------|----------------|-------|--------|--------------|
| Into the Gloaming | Shadowdark | Sun 8:00 | $20 | Full | https://startplaying.games/adventure/cmhszv63c00lbjr04inzp1wb4?ref=cleydacnf0001mj085hsj86k0 |
| A Pound of Flesh | Mothership | Wed 8:00 | $15 | Full | https://startplaying.games/adventure/cmux9kldg008xkz04epoy93o3?ref=cleydacnf0001mj085hsj86k0 |
| Mythic Bastionland | title is the system | Fri 8:00 | $15 | Full | https://startplaying.games/adventure/cmuii5bfx0086jv041itiapt4?ref=cleydacnf0001mj085hsj86k0 |
| Mythic Bastionland | title is the system | Sat 8:00 | $15 | 2 to start | https://startplaying.games/adventure/cmuii6bsh00fzl504ak9smaip?ref=cleydacnf0001mj085hsj86k0 |

On 2026-10-05 the Wednesday slot was renamed A Pound of Flesh while it still used the Into the Western Reaches listing. On 2026-10-09 all four rows use the StartPlaying links in the table above. Sunday stayed Into the Gloaming.

Thursday was marked full in repo commit `7615dee` (2026-10-02). The old "1 seat left" snapshot is retired. Friday's status word is `2 to start`, and `open` is true.

## Fields in `src/games.js`

- `id` — `gloaming`, `pound-of-flesh`, `mythic-thursday`, `mythic-friday`
- `name` — the link text
- `system` — `null` on the Mythic Bastionland rows, so the line does not repeat the title
- `start` — weekly time in `Asia/Kuala_Lumpur`: weekday, hour, minute. The page shows the visitor's day and time. The two Mythic rows are Friday and Saturday morning in Malaysia, which is Thursday and Friday evening in New York before the US clock change.
- `price` — USD, per session
- `status` — the words on the page
- `open` — `true` draws the status in yellow
- `url` — StartPlaying adventure page

## Updating a table

1. Change the status word and `open` in `src/games.js`.
2. Update this file in the same pass.
3. Commit them together.

Sessions use Discord for audio and Owlbear Rodeo as the table. The game rows do not print that. The footer links to the Discord server. GM profile: https://startplaying.games/gm/manny
