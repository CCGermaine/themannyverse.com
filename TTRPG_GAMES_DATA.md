# TTRPG Games Data — Source of Truth

This directory is the authoritative data source for game listings on themannyverse.com.

## Data Source

Real-time game data is pulled from StartPlaying.Games listings:
- https://startplaying.games/adventure/cmhszv63c00lcjr04wq58qqdz (INTO THE GLOAMING)
- https://startplaying.games/adventure/cmo833juj000wjs04b1ysf4c4 (INTO THE WESTERN REACHES)
- https://startplaying.games/adventure/cmuii5bfx0087jv04trzf80j8 (Mythic Bastionland - Thursday)
- https://startplaying.games/adventure/cmuii6bsh00g0l504h1t44iqg (Mythic Bastionland - Friday)

## Snapshot Date

2026-09-27. Prices in USD. Links go directly to StartPlaying pages for real-time seat/booking status.

## Design Decision: No Next Session Dates

The website does NOT display next session dates. Since all games are weekly, showing dates would require weekly updates just to refresh the date — an unnecessary maintenance burden. Instead, game cards show:
- The recurring schedule (e.g., "Weekly / Sunday - 8:00 AM GMT+8")
- The session duration
- Current seat availability (as a static snapshot)
- A "Join" button that links directly to the StartPlaying page for real-time status

## Game Summary

| Game | System | Day | Time | Seats | Price | Status |
|------|--------|-----|------|-------|-------|--------|
| INTO THE GLOAMING | Shadowdark RPG | Sun | 8:00 AM GMT+8 | 5/5 | $20 | FULL |
| INTO THE WESTERN REACHES | Shadowdark RPG | Wed | 8:00 AM GMT+8 | 5/5 | $20 | FULL |
| Mythic Bastionland (Thu) | Mythic Bastionland | Thu | 8:00 AM GMT+8 | 3/4 | $15 | 1 SEAT LEFT |
| Mythic Bastionland (Fri) | Mythic Bastionland | Fri | 8:00 AM GMT+8 | 1/4 | $15 | PENDING (2 needed) |

## Cover Images

All cover images are hosted in `public/art/covers/`:
- `mythic-bastionland.webp` — Static cover art (1080x607, 16:9). From local file at `~/Downloads/mythic_bastionland_cover_02.webp`.
- `shadowdark-generic.webm` — Animated cover reveal (960x540, 16:9). Converted from Shadowdark animated GIF. Animation fades in from black to reveal the torchbearer artwork.

Both Shadowdark games share the same animated cover.

## Data Structure

The live data lives in `src/games.js` as a JavaScript array exported as `games`. Each entry has:
- `id` — internal key for routing/lookup
- `name` — display title
- `subtitle` — contextual subtitle from the listing
- `system` — RPG system name
- `description` — game blurb (from StartPlaying)
- `schedule` — weekly schedule with timezone
- `sessionDuration` — expected session length
- `seatsFilled` / `seatsTotal` — current vs max seats
- `status` / `statusLabel` — programmatic status and human-readable label
- `price` — per session cost (USD)
- `url` — direct link to StartPlaying page for real-time booking
- `coverImage` — path to local cover asset (`/art/covers/...`)
- `coverType` — 'video' for animated, 'image' for static
- `ctaText` — button label ("Join")

## Updating

Seat availability and campaign dates change over time on StartPlaying. When you need to refresh:
1. Check the StartPlaying URLs above for updated seat counts/status
2. Update `src/games.js` with new `seatsFilled`, `status`, and `statusLabel` values
3. Update this markdown document
4. Commit both together

## Planning Notes

The Obsidian vault copy at `themannyverse.com/TTRPG Games Data.md` is the planning workspace.
The code repo copy is authoritative. Both are committed together on changes.

All games use Discord for audio and Owlbear Rodeo as the VTT.
