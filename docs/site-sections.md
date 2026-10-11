# themannyverse.com — Sections

Four pages, prerendered from `content/`. One h1 on each page. Dark mode follows the operating system. The header control can pin light or dark, and that choice is kept in the browser. With JavaScript off, the system setting alone decides, and the control is not shown.

In dark mode the wordmark and title bars are paper with ink text. Artwork sits on a paper card and is not inverted. Pieces that were drawn on a white ground also use multiply, so the white melts into the paper. The Gold & Glory banner stays on black.

## Every page

- Skip link, then the wordmark to `/`.
- Nav: Games `/games/`, Art & Zines `/art-zines/`, Discord. The current page is marked.
- Theme control, last in that row. On a phone it is the icon only.
- Footer: Support (Stripe, PayPal, Wise as text links, no payment scripts and no QR codes), the microcopy, the social row with Support last, the about line, then the mark.

The about line is `content/about.md`: "Professional GM, Artist, Nerd, Hubby."

## Home `/`

1. Hero. Headline, subhead, one primary button and one secondary. Proof bar. Hollow King on the right, or under the proof bar on a phone. At 390 pixels, exactly one primary button is above the fold.
2. Open seats. The bookable tables, or the all-full panel when none are bookable. Then a link to Games.
3. Gold & Glory. Banner, three short paragraphs, join button.
4. Art & Zines teaser. Two zine covers and three gallery tiles, then links to the Art page and the newest zine.
5. Footer, including Support.

The primary button depends on how many tables are bookable (`open` or `starting`). One table: grab that seat. Two or more: scroll to Open seats. None: the open-seats Discord.

## Games `/games/`

Heading "The Tables" and the intro. Then `#tables`: every game that is not `hidden`, bookable tables first, then full tables, file order inside each group. Each card is the same stat block as Home.

Then the session strip: three framed steps, and a button that scrolls back to `#tables`.

Then the bottom line. Its button goes to the open-seats Discord, not the general invite.

## Art & Zines `/art-zines/`

Heading and intro. Zines ("Tales from the Mannyverse"): cover, name linking to itch.io, system, hook, credit, and the card button, then the store button.

Gallery: every `art` item, in a grid that wraps from 14rem tiles. Commissions button to the general Discord, Instagram, and "Play in the worlds I draw" to `/games/`.

Mythic Dice: a framed block, primary button to the extension, text link to the general Discord.

## 404

`404.html` at the site root. GitHub Pages serves it for an unknown path. Headline, one line, "Back to the table" back to `/`. The page is `noindex` and has no canonical URL.

## What this replaces

History: the live page used to be one column of text rows (a name, the games, two placeholder rows, and a payment block). That index is retired. The Art & Zines page is v1, not a later version. Cherating stays hidden: no page and no line. Also out of v1: a page per game, an email list, a calendar, and player accounts.

## Later

- Cherating, when there is a package to show
- A page per game, only if StartPlaying is no longer enough
- Newsletter and a calendar
- Accounts, sheets, and campaign tools
