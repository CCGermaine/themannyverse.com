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

## Games Summary

| Game | System | Day | Time | Seats | Price | Status |
|------|--------|-----|------|-------|-------|--------|
| INTO THE GLOAMING | Shadowdark | Sun | 8:00 AM GMT+8 | 5/5 | $20 | FULL |
| INTO THE WESTERN REACHES | Shadowdark | Wed | 8:00 AM GMT+8 | 5/5 | $20 | FULL |
| Mythic Bastionland | Mythic Bastionland | Thu | 8:00 AM GMT+8 | 3/4 | $15 | 1 SEAT LEFT |
| Mythic Bastionland | Mythic Bastionland | Fri | 8:00 AM GMT+8 | 1/4 | $15 | PENDING (2 needed) |

## Data Structure

The live data lives in `src/games.js` as a JavaScript array exported as `games`. Each entry has:
- `id` — internal key for routing/lookup
- `name` — display title
- `subtitle` — contextual subtitle
- `system` — RPG system
- `description` — game blurb
- `schedule` — weekly schedule
- `sessionDuration` — expected length
- `seatsFilled` / `seatsTotal` — current occupancy
- `status` — human-readable status
- `price` — per session cost (USD)
- `nextSession` — next scheduled session info
- `url` — direct link to StartPlaying page

## Updating

When game listings change (new sessions, seats fill, new campaigns):
1. Re-fetch from the StartPlaying URLs above
2. Update `src/games.js` with new data
3. Update this markdown document
4. Commit both together

## Planning Notes

The Obsidian vault copy at `themannyverse.com/TTRPG Games Data.md` is the planning workspace.
The code repo copy is authoritative. Both are committed together on changes.

All games use Discord for audio and Owlbear Rodeo as the VTT.
