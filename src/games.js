// games.js — Game data sourced from StartPlaying.Games listings
// Snapshot as of 2026-09-27. Prices in USD.
// Links go directly to StartPlaying for real-time seat/booking status.
// Promoted from: Obsidian Vault → themannyverse.com/TTRPG Games Data.md

export const games = [
  {
    id: 'glamming',
    name: 'INTO THE GLOAMING',
    subtitle: 'DARK & GRITTY ADVENTURE | 🏳️‍🌈+💗',
    system: 'Shadowdark RPG',
    description: 'Bandits, thieves, beasts, trolls, and evil spirits roam these lawless lands. No one\u2019s coming to save you\u2014don\u2019t go alone.',
    schedule: 'Weekly / Sunday - 8:00 AM GMT+8',
    sessionDuration: '3\u20133.5 hours',
    seatsFilled: 5,
    seatsTotal: 5,
    status: 'full',
    price: '$20',
    nextSession: 'Oct 4 / Session 37',
    url: 'https://startplaying.games/adventure/cmhszv63c00lcjr04wq58qqdz',
  },
  {
    id: 'western-reaches',
    name: 'INTO THE WESTERN REACHES',
    subtitle: 'DARK & GRITTY ADVENTURE | 🏳️‍🌈+💗',
    system: 'Shadowdark RPG',
    description: 'Bandits, thieves, beasts, trolls, and evil spirits roam these lawless lands. No one\u2019s coming to save you\u2014don\u2019t go alone.',
    schedule: 'Weekly / Wednesday - 8:00 AM GMT+8',
    sessionDuration: '3\u20133.5 hours',
    seatsFilled: 5,
    seatsTotal: 5,
    status: 'full',
    price: '$20',
    nextSession: 'Sep 30 / Session 22',
    url: 'https://startplaying.games/adventure/cmo833juj000wjs04b1ysf4c4',
  },
  {
    id: 'mythic-thursday',
    name: 'MYTHIC BASTIONLAND',
    subtitle: 'BEFORE INTO THE ODD - THURSDAY NIGHTS',
    system: 'Mythic Bastionland',
    description: 'Become a Knight of legend. Ride into a mythical realm of myth and doom, where odd seers whisper deadly secrets and wonderous beasts roam the land.',
    schedule: 'Weekly / Thursday - 8:00 AM GMT+8',
    sessionDuration: '3\u20133.5 hours',
    seatsFilled: 3,
    seatsTotal: 4,
    status: '1 seat left',
    price: '$15',
    nextSession: 'Oct 2 / Session 0',
    url: 'https://startplaying.games/adventure/cmuii5bfx0087jv04trzf80j8',
  },
  {
    id: 'mythic-friday',
    name: 'MYTHIC BASTIONLAND',
    subtitle: 'BEFORE INTO THE ODD - FRIDAY NIGHTS!',
    system: 'Mythic Bastionland',
    description: 'Become a Knight of legend. Ride into a mythical realm of myth and doom, where odd seers whisper deadly secrets and wonderous beasts roam the land.',
    schedule: 'Weekly / Friday - 8:00 AM GMT+8',
    sessionDuration: '3\u20133.5 hours',
    seatsFilled: 1,
    seatsTotal: 4,
    status: 'pending (2 needed to start)',
    price: '$15',
    nextSession: 'Oct 2 / Session 0',
    url: 'https://startplaying.games/adventure/cmuii6bsh00g0l504h1t44iqg',
  },
]

export function getAvailableGames() {
  return games.filter(g => g.seatsFilled < g.seatsTotal)
}

export function getGameById(id) {
  return games.find(g => g.id === id)
}
