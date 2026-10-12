import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { loadContent } from '../build/content.js'
import { mytLabel, renderArt, renderFooter, renderGames, renderHead, renderHeader, renderHome, renderNotFound } from '../build/render.js'
import { webpSize } from '../build/webp-size.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OPEN_SEATS = 'https://discord.gg/WW7VNcGN5s'
const INVITE = 'https://discord.gg/w74xbPHEC4'

function realModel() {
  return loadContent(root)
}

function withStates(states) {
  const model = realModel()
  const items = structuredClone(model.list.items)
  let index = 0
  for (const item of items) {
    if (item.type !== 'game') continue
    const state = states[index++]
    item.state = state
    if (state === 'open' || state === 'starting') {
      item.count = item.count ?? 2
      if (state === 'starting') item.who = item.who || 'Knights'
      else delete item.who
    } else {
      item.count = null
      delete item.who
    }
  }
  return { ...model, list: { items } }
}

function cardIds(html) {
  return [...html.matchAll(/id="t-([^"]+)"/g)].map((match) => match[1])
}

function article(html, id) {
  const match = html.match(new RegExp(`<article class="stat[^"]*" id="t-${id}">[\\s\\S]*?</article>`))
  assert.ok(match, `missing card ${id}`)
  return match[0]
}

function re(text) {
  return String(text).replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&').replaceAll("'", '&#39;')
}

test('static MYT labels and image dimensions', () => {
  const model = realModel()
  const html = renderHome(model) + renderGames(model)
  assert.equal(mytLabel('Sat', '08:00'), 'Sat · 8:00 AM MYT')
  assert.match(html, /data-weekday="Sat" data-time="08:00">Sat · 8:00 AM MYT/)
  const dim = webpSize(join(root, 'public/art/hollow-king-800.webp'))
  assert.match(html, new RegExp(`width="${dim.width}" height="${dim.height}"`))
  const images = [...renderHome(model).matchAll(/<img\b[^>]*>/g)].map((match) => match[0])
  assert.ok(images.length >= 5)
  for (const image of images) {
    assert.match(image, / width="\d+"/)
    assert.match(image, / height="\d+"/)
    assert.match(image, /decoding="async"/)
  }
  const hero = images.find((image) => image.includes('hollow-king'))
  assert.doesNotMatch(hero, /loading="lazy"/)
  assert.match(images.find((image) => image.includes('gg-banner')), /loading="lazy"/)
})

test('A6 hero and open seats for 0, 1, and 2 bookable games', () => {
  const none = renderHome(withStates(['full', 'full', 'full', 'full']))
  assert.match(none, new RegExp(`href="${OPEN_SEATS}" data-goatcounter-click="seats-alert:all-full"`))
  assert.match(none, />Get the next open seat</)
  assert.match(none, /class="full-state"/)
  assert.match(none, /Every table&#39;s full\. For now\./)
  assert.doesNotMatch(none, /class="stat-grid/)
  assert.doesNotMatch(none, /stat-art/)
  assert.doesNotMatch(none, /Grab a seat in /)

  const one = renderHome(withStates(['full', 'full', 'full', 'starting']))
  assert.match(one, /Grab a seat in Mythic Bastionland/)
  assert.match(one, /data-goatcounter-click="book:mythic-friday"/)
  assert.match(one, /class="stat-grid"/)
  assert.match(one, /class="pic stat-art"/)
  assert.doesNotMatch(one, /class="full-state"/)
  assert.doesNotMatch(one, /is-many/)
  assert.deepEqual(cardIds(one), ['mythic-friday'])

  const two = renderHome(withStates(['full', 'full', 'starting', 'open']))
  assert.match(two, /href="#open-now"/)
  assert.match(two, /class="stat-grid is-many"/)
  assert.doesNotMatch(two, /Grab a seat in /)
  assert.doesNotMatch(two, /stat-art/)
  assert.doesNotMatch(two, /class="full-state"/)
  assert.deepEqual(cardIds(two), ['mythic-thursday', 'mythic-friday'])
})

test('A7 Discord routing', () => {
  const model = realModel()
  const home = renderHome(model)
  const games = renderGames(model)
  const art = renderArt(model)
  const header = renderHeader('games', model)
  const footer = renderFooter(model)
  const list = JSON.parse(readFileSync(join(root, 'content/list.json'), 'utf8'))

  for (const id of ['gloaming', 'pound-of-flesh', 'mythic-thursday']) {
    const card = article(games, id)
    const game = list.items.find((item) => item.id === id)
    assert.match(card, new RegExp(`href="${OPEN_SEATS}" data-goatcounter-click="seats-alert:${id}"`))
    assert.match(card, /Watch this table/)
    assert.match(card, new RegExp(`href="${re(game.link)}" data-goatcounter-click="book:${id}"`))
  }
  assert.doesNotMatch(article(games, 'mythic-friday'), /WW7VNcGN5s/)
  assert.match(games, new RegExp(`href="${OPEN_SEATS}" data-goatcounter-click="seats-alert:games-bottom"`))

  assert.match(header, new RegExp(`href="${INVITE}" data-goatcounter-click="discord:nav"`))
  assert.match(home, new RegExp(`href="${INVITE}" data-goatcounter-click="discord:hero"`))
  assert.match(home, new RegExp(`href="${INVITE}" data-goatcounter-click="discord:gold-glory"`))
  assert.match(footer, new RegExp(`href="${INVITE}" data-goatcounter-click="discord:footer"`))
  assert.match(art, new RegExp(`href="${INVITE}" data-goatcounter-click="discord:commissions"`))
  assert.match(art, new RegExp(`href="${INVITE}">Talk shop on Discord`))
  assert.doesNotMatch(home, /WW7VNcGN5s/)

  const allFull = renderHome(withStates(['full', 'full', 'full', 'full']))
  assert.match(allFull, new RegExp(`href="${OPEN_SEATS}" data-goatcounter-click="seats-alert:all-full"`))
  assert.match(allFull, new RegExp(`href="${INVITE}" data-goatcounter-click="discord:hero"`))

  const empty = withStates(['full', 'full', 'full', 'full'])
  empty.links = structuredClone(empty.links)
  empty.links['discord-open-seats'] = ''
  const routed = renderHome(empty) + renderGames(empty)
  assert.match(routed, new RegExp(`href="${INVITE}" data-goatcounter-click="seats-alert:all-full"`))
  assert.match(routed, new RegExp(`href="${INVITE}" data-goatcounter-click="seats-alert:games-bottom"`))
  assert.match(routed, new RegExp(`href="${INVITE}" data-goatcounter-click="seats-alert:gloaming"`))
  assert.doesNotMatch(routed, /WW7VNcGN5s/)
})

test('games page orders bookable tables before full ones and hides hidden games', () => {
  const model = withStates(['full', 'full', 'full', 'starting'])
  model.list.items.push({ ...model.list.items[0], id: 'hidden-game', state: 'hidden', count: null })
  delete model.list.items.at(-1).who
  const html = renderGames(model)
  assert.deepEqual(cardIds(html), ['mythic-friday', 'gloaming', 'pound-of-flesh', 'mythic-thursday'])
  assert.doesNotMatch(html, /hidden-game/)
  const heading = html.indexOf('class="tables-label"')
  assert.ok(heading !== -1 && heading < html.indexOf('<h3'), 'games list heading sits before the card titles')
})

test('A14 meta and JSON-LD', () => {
  const model = realModel()
  const pages = {
    home: 'https://themannyverse.com/',
    games: 'https://themannyverse.com/games/',
    art: 'https://themannyverse.com/art-zines/',
  }
  for (const [page, url] of Object.entries(pages)) {
    const head = renderHead(page, model)
    assert.match(head, /<title>[^<]+<\/title>/)
    assert.match(head, /name="description" content="[^"]+"/)
    assert.match(head, new RegExp(`rel="canonical" href="${url.replaceAll('/', '\\/')}"`))
    assert.match(head, /property="og:title" content="/)
    assert.match(head, /property="og:description" content="/)
    assert.match(head, /property="og:type" content="website"/)
    assert.match(head, new RegExp(`property="og:url" content="${url.replaceAll('/', '\\/')}"`))
    assert.match(head, /property="og:image" content="https:\/\/themannyverse\.com\/og\/og-1200x630\.png"/)
    assert.match(head, /property="og:image:width" content="1200"/)
    assert.match(head, /property="og:image:height" content="630"/)
    assert.match(head, /property="og:image:alt" content="/)
    assert.match(head, /name="twitter:card" content="summary_large_image"/)
    assert.doesNotMatch(head, /noindex/)
  }
  assert.match(renderHead('games', model), /<title>The Tables · The Mannyverse<\/title>/)
  assert.match(renderHead('art', model), /<title>Art &amp; Zines · The Mannyverse<\/title>/)
  const missing = renderHead('404', model)
  assert.match(missing, /<title>You&#39;ve wandered off the map\. · The Mannyverse<\/title>/)
  assert.match(missing, /name="robots" content="noindex"/)
  assert.doesNotMatch(missing, /rel="canonical"/)
  assert.doesNotMatch(missing, /ld\+json/)
  assert.doesNotMatch(renderHead('games', model), /ld\+json/)

  const home = renderHead('home', model)
  const json = home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]
  const data = JSON.parse(json)
  assert.equal(data['@graph'][0]['@type'], 'WebSite')
  assert.equal(data['@graph'][0].name, 'The Mannyverse')
  assert.equal(data['@graph'][0].url, 'https://themannyverse.com/')
  assert.equal(data['@graph'][1]['@type'], 'Person')
  assert.equal(data['@graph'][1].name, 'GM Manny')
  assert.equal(data['@graph'][1].description, 'Professional GM, Artist, Nerd, Hubby.')
  assert.ok(data['@graph'][1].sameAs.includes(INVITE))
  assert.doesNotMatch(renderFooter(model), /<script[^>]*goatcounter/)
})

test('A15 GoatCounter script and click attributes', () => {
  const pages = [
    ['home', renderHome],
    ['games', renderGames],
    ['art', renderArt],
    ['404', renderNotFound],
  ]
  const empty = realModel()
  assert.equal(empty.site.analytics.goatcounter, '')
  for (const [name, renderMain] of pages) {
    const html = renderHeader(name === 'art' ? 'art' : name === 'games' ? 'games' : name === '404' ? '404' : 'home', empty) + renderMain(empty) + renderFooter(empty)
    assert.equal((html.match(/<script\b/g) || []).length, 0, `${name} emits a script when the code is empty`)
  }

  const set = realModel()
  set.site = structuredClone(set.site)
  set.site.analytics = { goatcounter: 'themannyverse' }
  const script = '<script data-goatcounter="https://themannyverse.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>'
  const rendered = []
  for (const [name, renderMain] of pages) {
    const pageName = name === 'art' ? 'art' : name === '404' ? '404' : name === 'games' ? 'games' : 'home'
    const html = renderHeader(pageName, set) + renderMain(set) + renderFooter(set)
    assert.equal((html.match(/<script\b/g) || []).length, 1, `${name} script count`)
    assert.equal((html.match(/data-goatcounter="/g) || []).length, 1, `${name} count script`)
    assert.ok(html.includes(script), `${name} script tag`)
    rendered.push(html)
  }

  const allFull = withStates(['full', 'full', 'full', 'full'])
  allFull.site = structuredClone(allFull.site)
  allFull.site.analytics = { goatcounter: 'themannyverse' }
  rendered.push(renderHome(allFull) + renderGames(allFull))

  const clicks = new Set()
  for (const html of rendered) {
    for (const match of html.matchAll(/data-goatcounter-click="([^"]*)"/g)) clicks.add(match[1])
  }
  const expected = [
    'book:mythic-friday',
    'book:gloaming',
    'book:pound-of-flesh',
    'book:mythic-thursday',
    'seats-alert:gloaming',
    'seats-alert:pound-of-flesh',
    'seats-alert:mythic-thursday',
    'seats-alert:mythic-friday',
    'seats-alert:games-bottom',
    'seats-alert:all-full',
    'discord:nav',
    'discord:hero',
    'discord:gold-glory',
    'discord:footer',
    'discord:commissions',
    'itch:while-you-sleep',
    'itch:fiddler-in-the-bush',
    'itch:store',
    'mythic-dice',
    'instagram:gallery',
    'instagram:footer',
    'support:stripe',
    'support:paypal',
    'support:wise',
  ]
  assert.deepEqual([...clicks].sort(), [...expected].sort())
})

test('art page uses the section 9 image sizes', () => {
  const model = realModel()
  const art = renderArt(model)
  const home = renderHome(model)
  assert.match(art, /while-you-sleep[^>]*sizes="\(max-width:720px\) 45vw, 16rem"/)
  assert.match(art, /haiyum-head[^>]*sizes="\(max-width:720px\) 45vw, 16rem"/)
  assert.match(home, /while-you-sleep[^>]*sizes="\(max-width:760px\) 45vw, 13rem"/)
  assert.match(home, /haiyum-head[^>]*sizes="\(max-width:720px\) 30vw, 11rem"/)
  assert.match(art, /class="thumbs"/)
  assert.match(art, /href="\/games\/"/)
  assert.match(art, /data-goatcounter-click="mythic-dice"/)
  assert.match(art, /data-goatcounter-click="instagram:gallery"/)
  assert.match(art, /data-goatcounter-click="itch:store"/)
})

test('visible game facts, zines, and footer links are in the HTML', () => {
  const model = realModel()
  const games = renderGames(model)
  const home = renderHome(model)
  const art = renderArt(model)
  const footer = renderFooter(model)
  for (const item of model.list.items.filter((entry) => entry.type === 'game')) {
    assert.match(games, new RegExp(re(item.name)))
    assert.match(games, new RegExp(re(item.hook)))
    assert.match(games, new RegExp(re(item.price)))
    assert.match(games, new RegExp(re(item.link)))
    assert.match(games, new RegExp(mytLabel(item.weekday, item.time)))
  }
  assert.match(home, /While You Sleep/)
  assert.match(home, /Fiddler In The Bush/)
  assert.match(art, /While You Sleep/)
  assert.match(art, /https:\/\/gm-manny\.itch\.io\/fiddler-in-the-bush/)
  assert.match(footer, /https:\/\/book\.stripe\.com\/9B600jblT26f3yY9CD4AU00/)
  assert.match(footer, /https:\/\/www\.paypal\.com\/ncp\/payment\/DGEZEC82THVWC/)
  assert.match(footer, /https:\/\/wise\.com\/pay\/me\/christiancharlesg3/)
  assert.match(footer, /href="#support">Support/)
  assert.match(footer, /Professional GM, Artist, Nerd, Hubby\./)
})
