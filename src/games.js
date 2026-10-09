// Games on the index. Seat details and booking live on StartPlaying.
// A status word is the only seat fact this page keeps. Open tables use `open`.
// `start` is the weekly table time in Malaysia. The page prints it in the visitor's zone.

const malaysia = { timeZone: 'Asia/Kuala_Lumpur', hour: 8, minute: 0 }

export const games = [
  {
    id: 'gloaming',
    name: 'Into the Gloaming',
    system: 'Shadowdark',
    start: { ...malaysia, weekday: 'Sun' },
    price: '$20',
    status: 'Full',
    open: false,
    url: 'https://startplaying.games/adventure/cmhszv63c00lbjr04inzp1wb4?ref=cleydacnf0001mj085hsj86k0',
  },
  {
    id: 'pound-of-flesh',
    name: 'A Pound of Flesh',
    system: 'Mothership',
    start: { ...malaysia, weekday: 'Wed' },
    price: '$15',
    status: 'Full',
    open: false,
    url: 'https://startplaying.games/adventure/cmux9kldg008xkz04epoy93o3?ref=cleydacnf0001mj085hsj86k0',
  },
  {
    id: 'mythic-thursday',
    name: 'Mythic Bastionland',
    system: null,
    start: { ...malaysia, weekday: 'Fri' },
    price: '$15',
    status: 'Full',
    open: false,
    url: 'https://startplaying.games/adventure/cmuii5bfx0086jv041itiapt4?ref=cleydacnf0001mj085hsj86k0',
  },
  {
    id: 'mythic-friday',
    name: 'Mythic Bastionland',
    system: null,
    start: { ...malaysia, weekday: 'Sat' },
    price: '$15',
    status: '2 to start',
    open: true,
    url: 'https://startplaying.games/adventure/cmuii6bsh00fzl504ak9smaip?ref=cleydacnf0001mj085hsj86k0',
  },
]
