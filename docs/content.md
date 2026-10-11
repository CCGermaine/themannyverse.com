# Content

The site reads four files. Edit them on GitHub. There is no second copy of the game list in this doc, so this page cannot drift from the data.

| File | What it holds |
|---|---|
| `content/list.json` | Every game, zine, and gallery piece, in file order |
| `content/site.json` | Lines that are not tied to one item: nav, hero, status words, page intros, Support, footer, meta |
| `content/links.json` | Discord, StartPlaying, itch, Mythic Dice, Instagram, Support URLs, socials |
| `content/about.md` | The footer about line. Plain text. HTML comments are stripped. It is not rendered as Markdown. |

`npm run check` validates. `npm run build` runs that check first (`prebuild`). A bad file fails the build and the live site stays on the last good version.

## How to edit on GitHub

1. Open github.com/CCGermaine/themannyverse.com, then `content/list.json`, then the pencil icon.
2. Change a value inside the quotes, for example `"state": "full"` or `"count": 3`. To add a game, copy a whole `{ … },` block, give it a new `id`, and keep the commas.
3. Commit to `main`. Actions builds. A red mark means the check failed: open the run, read the one-line message, fix it, and commit again.

Weekday and time are the start in Malaysia (`Asia/Kuala_Lumpur`). The page shows the visitor's own day, clock, and zone. Status words come from `site.json`, so the list does not store the sentence "2 more Knights to start".

## `list.json` fields

`id` matches `^[a-z0-9]+(-[a-z0-9]+)*$` and is unique. Analytics events use it, so do not rename an id lightly.

| Field | Game | Zine | Art | Rule |
|---|---|---|---|---|
| `type` | yes | yes | yes | `game`, `zine`, or `art` |
| `id` | yes | yes | yes | unique |
| `name` | yes | yes | — | 1–24 characters |
| `system` | yes | yes | — | 1–30 |
| `tag` | yes | — | — | 1–52 |
| `hook` | yes | yes | — | 1–160 |
| `credit` | yes | yes | — | string. `""` prints nothing |
| `weekday` | yes | — | — | `Mon` `Tue` `Wed` `Thu` `Fri` `Sat` `Sun` |
| `time` | yes | — | — | `HH:MM`, 24 hour, Malaysia |
| `price` | yes | — | — | `$` then digits, per session |
| `state` | yes | — | — | see the state table |
| `count` | yes | — | — | integer 1–12, or `null` |
| `who` | starting only | — | — | 1–12 characters |
| `link` | yes | yes | — | `https://`. Game: a StartPlaying adventure URL that contains `ref=`. Zine: `https://gm-manny.itch.io/…` |
| `cover`, `cover_alt` | — | yes | — | `cover` is a base name. `public/art/<cover>-400.webp` and `-800.webp` must exist |
| `newest` | — | yes | — | exactly one zine is `true`. Home's "Get a zine" uses it |
| `image`, `caption`, `alt` | — | — | yes | `image` is a base name with `-400` and `-800` files. Caption is 1–80 characters |
| `home` | — | — | yes | Home shows the first three `home: true` pieces |

One example of each type. The live blocks are the file itself.

```json
{
  "type": "game",
  "id": "mythic-friday",
  "name": "Mythic Bastionland",
  "system": "Mythic Bastionland",
  "tag": "Mythic Bastionland | New Company Forming",
  "hook": "You're a Knight. Not a murder-hobo. A Knight, with an oath to keep.",
  "credit": "Mythic Bastionland by Chris McDowall.",
  "weekday": "Sat",
  "time": "08:00",
  "price": "$15",
  "state": "starting",
  "count": 2,
  "who": "Knights",
  "link": "https://startplaying.games/adventure/example?ref=cleydacnf0001mj085hsj86k0"
}
```

```json
{
  "type": "zine",
  "id": "fiddler-in-the-bush",
  "name": "Fiddler In The Bush",
  "system": "Shadowdark",
  "hook": "A lusty satyr, a stolen queen, and a lost kingdom.",
  "credit": "",
  "cover": "fiddler-in-the-bush-cover",
  "cover_alt": "Cover of the zine",
  "link": "https://gm-manny.itch.io/fiddler-in-the-bush",
  "newest": true
}
```

```json
{
  "type": "art",
  "id": "haiyum-head",
  "image": "haiyum-head",
  "caption": "Haiyum head · a session portrait",
  "alt": "Ink portrait of a head",
  "home": true
}
```

## States

| `state` | `count` | `who` | On the page |
|---|---|---|---|
| `open` | 1–12 | omit | open stamp with a filled dot, Grab a seat |
| `starting` | 1–12 | required | same, plus the starting line |
| `full` | `null` | omit | muted "Table full" with an open dot, Get the next open seat, then Watch this table |
| `hidden` | `null` | omit | kept in the file, not shown |

Games render `open` and `starting` first, in file order, then `full`, in file order.

## `links.json`

`discord-invite` is the general invite (nav, hero secondary, Join Gold & Glory, commissions, Dice secondary, footer). `discord-open-seats` is only for a full table, the all-full panel, the hero when every table is full, and the Games bottom. If `discord-open-seats` is `""`, those clicks use `discord-invite` and the check prints a warning.

Support is Stripe, PayPal, Wise, in that order. Socials are StartPlaying, Discord, Instagram, X, Facebook, itch.io, GitHub, in that order. The footer adds Support, pointing at `#support`.

## Art

Allowed: Christian's ink and colour work, the Order of the Open Door temple, the Gold & Glory banner, Lizardman warrior, Three Eyed Diva, the Fiddler cover, Dolg, and of the painted portraits only Fie Foot and Bork (allowed, not shown in v1).

Never: the ShadowSun cover, Gork, Braeden Scarred, Durock, Ironfist, Zymir, Orso, Pool, `Zine Covers.png`, or any AI image. A file under `public/` whose name matches that list fails the check.

To add a piece: export 400 and 800 wide (800 and 1600 for a full-width slot) as webp, put both files in `public/art/`, and add a list item. The base name has no width suffix.

## Five common errors

The check lists every error, then exits 1.

1. A deleted or extra comma. The message names the file, the line, and the column.
2. A state that is not exactly `open`, `starting`, `full`, or `hidden`. Example: `content/list.json › items[3] (id "mythic-friday") › state: must be one of open, starting, full, hidden (got "Open")`. An unknown key such as `"stat"` fails the same way.
3. `count` or `who` does not match the state. `full` and `hidden` need `"count": null` and no `who`. `starting` needs `count` and `who`.
4. A cover or image base name with no matching file. Example: `missing public/art/while-you-sleep-cover-400.webp`.
5. A link that is not `https://`, or a game link that is not a StartPlaying adventure URL containing `ref=`.

Copy slots that still say `[LOREM` or `[PLACEHOLDER` also fail `npm run build`. Local preview allows them.
