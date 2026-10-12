// Semantic HTML for the four pages. Class names match the M4 mock so later CSS can port directly.
import { join } from 'node:path'
import { aboutText, openSeatsUrl } from './content.js'
import { webpSize } from './webp-size.js'

const ORIGIN = 'https://themannyverse.com'

const CANONICAL = {
  home: `${ORIGIN}/`,
  games: `${ORIGIN}/games/`,
  art: `${ORIGIN}/art-zines/`,
}

export function escapeAttr(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

export function escapeText(value) {
  return escapeAttr(value).replaceAll("'", '&#39;')
}

export function vis(value) {
  const text = escapeText(value)
  if (String(value).includes('[LOREM') || String(value).includes('[PLACEHOLDER')) return `<span class="lorem">${text}</span>`
  return text
}

export function mytLabel(weekday, time) {
  const [hourText, minuteText] = String(time).split(':')
  const hour = Number(hourText)
  const minute = Number(minuteText)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${weekday} · ${hour12}:${String(minute).padStart(2, '0')} ${suffix} MYT`
}

export function renderHead(page, model) {
  const { site } = model
  const title = pageTitle(page, site)
  const description = pageDescription(page, site)
  const canonical = CANONICAL[page] || ''
  const image = absoluteOg(site.meta.og_image)
  const lines = [
    `<title>${escapeText(title)}</title>`,
    `<meta name="description" content="${escapeAttr(description)}">`,
  ]
  if (canonical) lines.push(`<link rel="canonical" href="${escapeAttr(canonical)}">`)
  if (page === '404') lines.push('<meta name="robots" content="noindex">')
  lines.push(
    `<meta property="og:title" content="${escapeAttr(title)}">`,
    `<meta property="og:description" content="${escapeAttr(description)}">`,
    '<meta property="og:type" content="website">',
  )
  if (canonical) lines.push(`<meta property="og:url" content="${escapeAttr(canonical)}">`)
  lines.push(
    `<meta property="og:image" content="${escapeAttr(image)}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    `<meta property="og:image:alt" content="${escapeAttr(site.meta.og_image_alt)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="color-scheme" content="light dark">',
    '<meta name="theme-color" content="#F4EFE6" media="(prefers-color-scheme: light)">',
    '<meta name="theme-color" content="#1A1714" media="(prefers-color-scheme: dark)">',
  )
  if (page === 'home') lines.push(`<script type="application/ld+json">${jsonLd(model)}</script>`)
  return lines.join('\n')
}

export function renderHeader(page, model) {
  const { site, links } = model
  const nav = [
    anchor({ href: '/games/', text: vis(site.nav.games), current: page === 'games' }),
    anchor({ href: '/art-zines/', text: vis(site.nav.art), current: page === 'art' }),
    anchor({ href: links['discord-invite'], text: vis(site.nav.discord), event: 'discord:nav' }),
  ].join('')
  return `<a class="skip" href="#main">${vis(site.skip_link)}</a>
<header class="site-head">
  <p class="brand"><a class="wordmark" href="/">${vis(site.wordmark)}</a></p>
  <nav aria-label="Main">${nav}<button class="theme-toggle" type="button" aria-pressed="false" data-theme-toggle hidden><span class="tt-icon" aria-hidden="true"></span><span class="tt-label">${vis(site.theme_toggle)}</span></button></nav>
</header>`
}

export function renderHome(model) {
  const { site, links, list } = model
  const open = bookableGames(list.items)
  const primary = heroPrimary(open, model)
  const newest = list.items.find((item) => item.type === 'zine' && item.newest)
  const zineItems = list.items.filter((item) => item.type === 'zine')
  const gallery = list.items.filter((item) => item.type === 'art' && item.home).slice(0, 3)
  return `<section class="hero">
  <div class="hero-grid">
    <div class="hero-text">
      <h1>${vis(site.hero.headline)}</h1>
      <p class="sub">${vis(site.hero.subhead)}</p>
      <div class="ctas">
        ${anchor({ className: 'btn btn-primary', href: primary.href, event: primary.event, text: vis(primary.label) })}
        ${anchor({ className: 'btn btn-secondary', href: links['discord-invite'], event: 'discord:hero', text: vis(site.hero.cta_secondary) })}
      </div>
      <p class="proof proof-bar">${vis(site.proof)}</p>
    </div>
    <figure class="hero-art">${artImg(model, site.images.hero.file, [400, 800], '(max-width:720px) 14rem, 20rem', site.images.hero.alt, { lazy: false })}</figure>
  </div>
</section>
${openSeats(model, open)}
<section class="discord" id="gold-glory" aria-labelledby="gg-h">
  <figure class="pic gg-banner">${artImg(model, site.images.gold_glory_banner.file, [800, 1600], '(max-width:720px) 92vw, 68rem', site.images.gold_glory_banner.alt)}</figure>
  <div class="discord-text">
    <p class="kicker">${vis(site.gold_glory.title)}</p>
    <h2 class="label" id="gg-h">${vis(site.gold_glory.label)}</h2>
    <div class="pitch">${site.gold_glory.pitch.map((line) => `<p>${vis(line)}</p>`).join('')}</div>
    ${anchor({ className: 'btn btn-primary', href: links['discord-invite'], event: 'discord:gold-glory', text: vis(site.gold_glory.cta) })}
  </div>
</section>
<section class="art-zines" id="art-zines" aria-labelledby="az-h">
  <h2 class="label" id="az-h">${vis(site.art_teaser.title)}</h2>
  <p class="line">${vis(site.art_teaser.line)}</p>
  <div class="az-grid">
    <ul class="zines">${zineItems.map((zine) => homeZine(model, zine)).join('')}</ul>
    <ul class="thumbs">${gallery.map((piece) => tile(model, piece, '(max-width:720px) 30vw, 11rem')).join('')}</ul>
  </div>
  <div class="ctas">
    ${anchor({ className: 'btn btn-secondary', href: '/art-zines/', text: vis(site.art_teaser.cta) })}
    ${newest ? anchor({ className: 'btn btn-secondary', href: newest.link, event: `itch:${newest.id}`, text: vis(site.art_teaser.cta_secondary) }) : ''}
  </div>
</section>`
}

export function renderGames(model) {
  const { site } = model
  const games = orderedGames(model.list.items)
  const session = site.games_page.session
  return `<header class="page-head">
  <h1>${vis(site.games_page.title)}</h1>
  <p class="line">${vis(site.games_page.intro)}</p>
</header>
<div id="tables" class="tables">
  <h2 class="tables-label" id="tables-h">${vis(site.games_page.title)}</h2>
  ${games.map((game) => renderCard(game, model)).join('\n')}
</div>
<section class="session" aria-labelledby="session-h">
  <h2 class="label" id="session-h">${vis(session.heading)}</h2>
  <p class="line">${vis(session.line)}</p>
  <ol class="steps">${session.steps.map((step) => `<li class="step"><h3 class="bar">${vis(step.title)}</h3><p>${vis(step.text)}</p></li>`).join('')}</ol>
  ${anchor({ className: 'btn btn-primary', href: '#tables', text: vis(session.cta) })}
</section>
<section class="games-bottom">
  <p class="line">${vis(site.games_page.bottom.line)}</p>
  ${anchor({ className: 'btn btn-primary', href: openSeatsUrl(model.links), event: 'seats-alert:games-bottom', text: vis(site.games_page.bottom.cta) })}
</section>`
}

export function renderArt(model) {
  const { site, links, list } = model
  const page = site.art_page
  const zineItems = list.items.filter((item) => item.type === 'zine')
  const gallery = list.items.filter((item) => item.type === 'art')
  return `<header class="page-head">
  <h1>${vis(page.title)}</h1>
  <p class="line">${vis(page.intro)}</p>
</header>
<section class="zines-section" aria-labelledby="zines-h">
  <h2 class="label" id="zines-h">${vis(page.zines.title)}</h2>
  <p class="line">${vis(page.zines.line)}</p>
  <ul class="zines">${zineItems.map((zine) => artZine(model, zine)).join('')}</ul>
  ${anchor({ className: 'btn btn-secondary', href: links['itch-store'], event: 'itch:store', text: vis(page.zines.store_cta) })}
</section>
<section class="gallery" aria-labelledby="gal-h">
  <h2 class="label" id="gal-h">${vis(page.gallery.heading)}</h2>
  <p class="line">${vis(page.gallery.line)}</p>
  <ul class="thumbs">${gallery.map((piece) => tile(model, piece, '(max-width:720px) 45vw, 16rem')).join('')}</ul>
  <p class="line">${vis(page.gallery.commissions_line)}</p>
  <div class="ctas">
    ${anchor({ className: 'btn btn-primary', href: links['discord-invite'], event: 'discord:commissions', text: vis(page.gallery.commissions_cta) })}
    ${anchor({ className: 'btn btn-secondary', href: links.instagram, event: 'instagram:gallery', text: vis(page.gallery.instagram_cta) })}
    ${anchor({ className: 'btn btn-secondary', href: '/games/', text: vis(page.gallery.play_cta) })}
  </div>
</section>
<section class="dice" aria-labelledby="dice-h">
  <div class="dice-card">
    <h2 class="bar" id="dice-h">${vis(page.dice.title)}</h2>
    <p class="line">${vis(page.dice.line)}</p>
    <p class="dice-actions">
      ${anchor({ className: 'btn btn-primary', href: links['mythic-dice'], event: 'mythic-dice', text: vis(page.dice.cta) })}
      ${anchor({ href: links['discord-invite'], text: vis(page.dice.secondary) })}
    </p>
  </div>
</section>`
}

export function renderNotFound(model) {
  const page = model.site.not_found
  return `<section class="not-found">
  <h1>${vis(page.headline)}</h1>
  <p class="line">${vis(page.line)}</p>
  ${anchor({ className: 'btn btn-primary', href: '/', text: vis(page.cta) })}
</section>`
}

export function renderFooter(model) {
  const { site, links } = model
  const supportEvents = { Stripe: 'support:stripe', PayPal: 'support:paypal', Wise: 'support:wise' }
  const socialEvents = { Discord: 'discord:footer', Instagram: 'instagram:footer' }
  const support = links.support.map((item) => `<li>${anchor({ href: item.url, event: supportEvents[item.name] || '', text: vis(item.name) })} <span class="purpose">${vis(item.line)}</span></li>`).join('')
  const socials = links.socials.map((item) => anchor({ href: item.url, event: socialEvents[item.name] || '', text: vis(item.name) })).join('')
  const code = site.analytics?.goatcounter
  const goat = code ? `\n<script data-goatcounter="https://${code}.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>` : ''
  return `<footer class="site-foot">
  <div class="support" id="support">
    <p class="kicker">${vis(site.support.label)}</p>
    <h2 class="label-sm">${vis(site.support.title)}</h2>
    <p class="line">${vis(site.support.line)}</p>
    <ul class="support-links">${support}</ul>
    <p class="small">${vis(site.support.small)}</p>
  </div>
  <p class="micro">${vis(site.footer.microcopy)}</p>
  <nav class="socials" aria-label="Elsewhere">${socials}${anchor({ href: '#support', text: vis(site.support.label) })}</nav>
  <p class="about">${vis(aboutText(model.about))}</p>
  <p class="mark">${vis(site.footer.mark)}</p>
</footer>${goat}`
}

function openSeats(model, games) {
  const { site } = model
  let body
  if (games.length === 0) {
    body = `<div class="full-state">
    <h3 class="full-title">${vis(site.open_now.all_full_title)}</h3>
    <p class="full-msg">${vis(site.open_now.all_full_line)}</p>
    ${anchor({ className: 'btn btn-primary', href: openSeatsUrl(model.links), event: 'seats-alert:all-full', text: vis(site.open_now.all_full_cta) })}
  </div>`
  } else if (games.length === 1) {
    body = `<div class="stat-grid">${renderCard(games[0], model)}
    <figure class="pic stat-art">${artImg(model, site.images.open_now.file, [800, 1600], '(max-width:720px) 92vw, 40rem', site.images.open_now.alt)}</figure>
  </div>`
  } else {
    body = `<div class="stat-grid is-many">${games.map((game) => renderCard(game, model)).join('\n')}</div>`
  }
  return `<section class="open-now" id="open-now" aria-labelledby="on-h">
  <h2 class="label" id="on-h">${vis(site.open_now.title)}</h2>
  <p class="line">${vis(site.open_now.intro)}</p>
  ${body}
  <p class="more"><a href="/games/">${vis(site.open_now.more)}</a></p>
</section>`
}

function renderCard(game, model) {
  const { site } = model
  const bookable = game.state === 'open' || game.state === 'starting'
  const statusClass = bookable ? 'status is-open stamp' : 'status is-full stamp'
  const articleClass = bookable ? 'stat is-open-card' : 'stat'
  const seats = openSeatsUrl(model.links)
  const actions = bookable
    ? `<p class="book">${anchor({ className: 'btn btn-primary', href: game.link, event: `book:${game.id}`, text: vis(site.status.book) })} <span class="hint">${vis(site.status.book_hint)}</span></p>
      <p class="small">${vis(site.status.book_line)}</p>`
    : `<p class="book">${anchor({ className: 'btn btn-primary', href: seats, event: `seats-alert:${game.id}`, text: vis(site.status.full_cta) })} ${anchor({ href: game.link, event: `book:${game.id}`, text: vis(site.status.full_secondary) })}</p>`
  const starting = game.state === 'starting' ? `<p class="starting-line">${vis(site.status.starting_line)}</p>` : ''
  const credit = game.credit ? `<p class="credit">${vis(game.credit)}</p>` : ''
  return `<article class="${articleClass}" id="t-${escapeAttr(game.id)}">
      <h3 class="bar">${vis(game.name)}</h3>
      <p class="tag">${vis(game.tag)}</p>
      <dl class="stats">
        <div><dt>${vis(site.stat_labels.system)}</dt><dd>${vis(game.system)}</dd></div>
        <div><dt>${vis(site.stat_labels.when)}</dt><dd><time class="when" data-weekday="${escapeAttr(game.weekday)}" data-time="${escapeAttr(game.time)}">${vis(mytLabel(game.weekday, game.time))}</time></dd></div>
        <div><dt>${vis(site.stat_labels.price)}</dt><dd>${vis(game.price)}</dd></div>
      </dl>
      <p class="stamp-wrap"><span class="${statusClass}">${vis(statusText(game, site))}</span></p>
      ${starting}
      <p class="hook">${vis(game.hook)}</p>
      ${actions}
      ${credit}
    </article>`
}

function homeZine(model, zine) {
  return `<li class="zine"><figure class="zine-cover">${artImg(model, zine.cover, [400, 800], '(max-width:760px) 45vw, 13rem', zine.cover_alt)}</figure>
      <p class="zine-name">${anchor({ href: zine.link, event: `itch:${zine.id}`, text: vis(zine.name) })}</p></li>`
}

function artZine(model, zine) {
  const credit = zine.credit ? `<p class="credit">${vis(zine.credit)}</p>` : ''
  return `<li class="zine"><figure class="zine-cover">${artImg(model, zine.cover, [400, 800], '(max-width:720px) 45vw, 16rem', zine.cover_alt)}</figure>
      <h3 class="zine-name">${anchor({ href: zine.link, event: `itch:${zine.id}`, text: vis(zine.name) })}</h3>
      <p class="zine-facts">${vis(zine.system)}</p>
      <p class="zine-hook">${vis(zine.hook)}</p>
      ${credit}
      ${anchor({ className: 'btn btn-primary', href: zine.link, event: `itch:${zine.id}`, text: vis(model.site.art_page.zines.card_cta) })}</li>`
}

function tile(model, piece, sizes) {
  return `<li><figure class="pic tile">${artImg(model, piece.image, [400, 800], sizes, piece.alt)}<figcaption>${vis(piece.caption)}</figcaption></figure></li>`
}

function artImg(model, base, widths, sizes, alt, { lazy = true } = {}) {
  const artDir = join(model.root, 'public/art')
  const sized = widths.map((nominal) => {
    const file = `${base}-${nominal}.webp`
    return { file, ...webpSize(join(artDir, file)) }
  })
  const src = sized.at(-1)
  const srcset = sized.map((item) => `/art/${item.file} ${item.width}w`).join(', ')
  const loading = lazy ? ' loading="lazy"' : ''
  return `<img src="/art/${src.file}" srcset="${srcset}" sizes="${sizes}" width="${src.width}" height="${src.height}" alt="${escapeAttr(alt)}" decoding="async"${loading}>`
}

function anchor({ href, text, className = '', event = '', current = false }) {
  const cls = className ? ` class="${className}"` : ''
  const currentAttr = current ? ' aria-current="page"' : ''
  const click = event ? ` data-goatcounter-click="${escapeAttr(event)}"` : ''
  return `<a${cls} href="${escapeAttr(href)}"${currentAttr}${click}>${text}</a>`
}

function heroPrimary(games, model) {
  const { site } = model
  if (games.length === 1) {
    const game = games[0]
    return { href: game.link, label: fill(site.hero.cta_one, { name: game.name }), event: `book:${game.id}` }
  }
  if (games.length >= 2) return { href: '#open-now', label: site.hero.cta, event: '' }
  return { href: openSeatsUrl(model.links), label: site.hero.cta_all_full, event: 'seats-alert:all-full' }
}

function statusText(game, site) {
  if (game.state === 'open') return fill(site.status.open, game)
  if (game.state === 'starting') return fill(site.status.starting, game)
  return site.status.full
}

function fill(template, vars) {
  return String(template)
    .replaceAll('{name}', vars.name ?? '')
    .replaceAll('{count}', vars.count == null ? '' : String(vars.count))
    .replaceAll('{who}', vars.who ?? '')
}

function bookableGames(items) {
  return items.filter((item) => item.type === 'game' && (item.state === 'open' || item.state === 'starting'))
}

function orderedGames(items) {
  const rank = (state) => (state === 'open' || state === 'starting' ? 0 : 1)
  return items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.type === 'game' && item.state !== 'hidden')
    .sort((a, b) => rank(a.item.state) - rank(b.item.state) || a.index - b.index)
    .map(({ item }) => item)
}

function pageTitle(page, site) {
  if (page === 'home') return site.meta.title
  if (page === 'games') return `${site.games_page.title} · ${site.wordmark}`
  if (page === 'art') return `${site.art_page.title} · ${site.wordmark}`
  return `${site.not_found.headline} · ${site.wordmark}`
}

function pageDescription(page, site) {
  if (page === 'home') return site.meta.description
  if (page === 'games') return site.games_page.intro
  if (page === 'art') return site.art_page.intro
  return site.not_found.line
}

function absoluteOg(path) {
  if (path.startsWith('https://')) return path
  return `${ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`
}

function jsonLd(model) {
  const about = aboutText(model.about)
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', name: model.site.wordmark, url: `${ORIGIN}/` },
      {
        '@type': 'Person',
        name: model.site.person,
        url: `${ORIGIN}/`,
        description: about,
        sameAs: model.links.socials.map((item) => item.url),
      },
    ],
  }
  return JSON.stringify(data).replaceAll('<', '\\u003c')
}
