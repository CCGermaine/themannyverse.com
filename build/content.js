// Load and validate content/. Spec §2.5. Every problem is an error except an
// empty discord-open-seats link, which is a warning.
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

// Unanchored on purpose: spec §2.5 rule 7.
export const FORBIDDEN_ART = /gork|shadowsun|braeden|breeden|durock|ironfist|zymir|orso|pool|zine.?covers/i

const BASE = /^[a-z0-9]+(-[a-z0-9]+)*$/
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const STATES = ['open', 'starting', 'full', 'hidden']
const GAME_KEYS = ['type', 'id', 'name', 'system', 'tag', 'hook', 'credit', 'weekday', 'time', 'price', 'state', 'count', 'link', 'who']
const ZINE_KEYS = ['type', 'id', 'name', 'system', 'hook', 'credit', 'cover', 'cover_alt', 'link', 'newest']
const ART_KEYS = ['type', 'id', 'image', 'caption', 'alt', 'home']

// Slot-limits hard caps, raised where the approved copy deck is longer.
// The deck wins on wording. Do not edit those strings to fit the tighter cap.
const HOOK_MAX = 161 // spec 160; while-you-sleep is 161
const GAMES_INTRO_MAX = 160 // section-line hard cap is 120
const GG_LABEL_MAX = 39 // section-title hard cap is 34
const SUPPORT_LINE_MAX = 162 // section-line hard cap is 120

const str = (max, extra = {}) => ({ kind: 'string', min: 1, max, ...extra })

const SITE_SCHEMA = {
  kind: 'object',
  fields: {
    wordmark: str(18),
    person: str(40),
    skip_link: str(80),
    meta: obj({
      title: str(90),
      description: str(200),
      og_image: str(200, { pattern: /^\/og\/[\w.-]+\.png$|^https:\/\/\S+$/, patternMessage: 'must be a /og/….png path or an https URL' }),
      og_image_alt: str(500),
    }),
    analytics: obj({
      goatcounter: str(40, { min: 0, pattern: /^[a-z0-9-]*$/, patternMessage: 'must match ^[a-z0-9-]*$' }),
    }),
    nav: obj({ games: str(14), art: str(14), discord: str(14) }),
    hero: obj({
      headline: str(72),
      subhead: str(140),
      cta: str(40),
      cta_one: str(40, { tokens: ['name'] }),
      cta_all_full: str(40),
      cta_secondary: str(28),
    }),
    proof: str(48),
    open_now: obj({
      title: str(34),
      intro: str(120),
      more: str(40),
      all_full_title: str(40),
      all_full_line: str(150),
      all_full_cta: str(40),
    }),
    status: obj({
      open: str(32, { tokens: ['count'] }),
      starting: str(32, { tokens: ['count', 'who'] }),
      full: str(32),
      starting_line: str(120),
      book: str(20),
      book_hint: str(40),
      book_line: str(180),
      full_cta: str(40),
      full_secondary: str(40),
    }),
    stat_labels: obj({ system: str(8), when: str(8), price: str(8) }),
    gold_glory: obj({
      title: str(34),
      label: str(GG_LABEL_MAX),
      pitch: { kind: 'array', length: 3, item: str(160) },
      cta: str(28),
    }),
    art_teaser: obj({
      title: str(34),
      line: str(120),
      cta: str(40),
      cta_secondary: str(28),
    }),
    games_page: obj({
      title: str(34),
      intro: str(GAMES_INTRO_MAX),
      session: obj({
        heading: str(34),
        line: str(120),
        steps: { kind: 'array', length: 3, item: obj({ title: str(34), text: str(180) }) },
        cta: str(40),
      }),
      bottom: obj({ line: str(150), cta: str(40) }),
    }),
    art_page: obj({
      title: str(34),
      intro: str(120),
      zines: obj({ title: str(34), line: str(120), card_cta: str(40), store_cta: str(40) }),
      gallery: obj({
        heading: str(34),
        line: str(120),
        commissions_line: str(160),
        commissions_cta: str(40),
        instagram_cta: str(40),
        play_cta: str(40),
      }),
      dice: obj({ title: str(34), line: str(160), cta: str(40), secondary: str(28) }),
    }),
    theme_toggle: str(12),
    support: obj({ label: str(14), title: str(34), line: str(SUPPORT_LINE_MAX), small: str(120) }),
    footer: obj({ microcopy: str(90), mark: str(90) }),
    not_found: obj({ headline: str(72), line: str(150), cta: str(40) }),
    images: obj({
      hero: imageFields(),
      open_now: imageFields(),
      gold_glory_banner: imageFields(),
    }),
  },
}

const IMAGE_SIZES = {
  hero: [400, 800],
  open_now: [800, 1600],
  gold_glory_banner: [800, 1600],
}

function obj(fields) {
  return { kind: 'object', fields }
}

function imageFields() {
  return obj({
    file: str(80, { pattern: BASE, patternMessage: 'must be a base name like hollow-king' }),
    alt: str(500),
  })
}

export function formatJsonError(rel, text, err) {
  const msg = String(err.message)
  const inline = msg.match(/\(line (\d+) column (\d+)\)/)
  if (inline) {
    const cleaned = msg.replace(/\s*\(line \d+ column \d+\)\s*$/, '')
    return `${rel}: line ${inline[1]}, column ${inline[2]}: ${cleaned}`
  }
  const pos = msg.match(/position (\d+)/)
  if (pos) {
    const upto = text.slice(0, Number(pos[1]))
    const lines = upto.split('\n')
    return `${rel}: line ${lines.length}, column ${lines.at(-1).length + 1}: ${msg}`
  }
  return `${rel}: ${msg}`
}

export function aboutText(md) {
  return String(md ?? '').replace(/<!--[\s\S]*?-->/g, '').replace(/\s+/g, ' ').trim()
}

export function openSeatsUrl(links) {
  return links['discord-open-seats'] || links['discord-invite']
}

export function loadContent(root = process.cwd()) {
  const errors = []
  const readJson = (name) => {
    const rel = `content/${name}`
    let text
    try {
      text = readFileSync(join(root, rel), 'utf8')
    } catch (err) {
      errors.push(`${rel}: ${err.message}`)
      return null
    }
    try {
      return JSON.parse(text)
    } catch (err) {
      errors.push(formatJsonError(rel, text, err))
      return null
    }
  }
  let about = null
  try {
    about = readFileSync(join(root, 'content/about.md'), 'utf8')
  } catch (err) {
    errors.push(`content/about.md: ${err.message}`)
  }
  return {
    root,
    list: readJson('list.json'),
    site: readJson('site.json'),
    links: readJson('links.json'),
    about,
    errors,
  }
}

export function validate(loaded, { allowLorem = false, publicDir } = {}) {
  const errors = [...(loaded.errors || [])]
  const warnings = []
  const dir = publicDir || join(loaded.root || process.cwd(), 'public')
  if (loaded.list) validateList(loaded.list, errors, { allowLorem, publicDir: dir })
  if (loaded.site) validateSite(loaded.site, errors, { allowLorem, publicDir: dir })
  if (loaded.links) validateLinks(loaded.links, errors, warnings, { allowLorem })
  if (loaded.about != null) validateAbout(loaded.about, errors, allowLorem)
  errors.push(...forbiddenArtErrors(dir))
  return { errors, warnings }
}

export function forbiddenArtErrors(publicDir) {
  const errors = []
  if (!existsSync(publicDir)) {
    errors.push(`public/: missing directory (${publicDir})`)
    return errors
  }
  walk(publicDir, '')
  return errors

  function walk(dir, rel) {
    for (const ent of readdirSync(dir, { withFileTypes: true })) {
      const next = rel ? `${rel}/${ent.name}` : ent.name
      if (ent.isDirectory()) walk(join(dir, ent.name), next)
      else if (ent.isFile() && FORBIDDEN_ART.test(next)) errors.push(`public/${next}: forbidden art file name`)
    }
  }
}

function validateList(list, errors, ctx) {
  const file = 'content/list.json'
  if (!list || typeof list !== 'object' || Array.isArray(list)) {
    errors.push(`${file}: must be an object`)
    return
  }
  for (const key of Object.keys(list)) {
    if (key !== 'items') errors.push(`${file} › ${key}: unknown key`)
  }
  if (!Object.hasOwn(list, 'items')) {
    errors.push(`${file} › items: missing required key`)
    return
  }
  if (!Array.isArray(list.items)) {
    errors.push(`${file} › items: must be an array`)
    return
  }
  const seen = new Map()
  const newest = []
  list.items.forEach((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      errors.push(`${file} › items[${index}]: must be an object`)
      return
    }
    const idPart = typeof item.id === 'string' ? ` (id ${JSON.stringify(item.id)})` : ''
    const path = `${file} › items[${index}]${idPart}`
    if (!Object.hasOwn(item, 'type')) {
      errors.push(`${path} › type: missing required key`)
      return
    }
    if (!['game', 'zine', 'art'].includes(item.type)) {
      errors.push(`${path} › type: must be one of game, zine, art (got ${JSON.stringify(item.type)})`)
      return
    }
    if (item.type === 'game') validateGame(item, path, errors, ctx)
    if (item.type === 'zine') validateZine(item, path, errors, ctx)
    if (item.type === 'art') validateArt(item, path, errors, ctx)
    if (typeof item.id === 'string') {
      if (seen.has(item.id)) errors.push(`${path} › id: duplicate id ${JSON.stringify(item.id)} (also items[${seen.get(item.id)}])`)
      else seen.set(item.id, index)
    }
    if (item.type === 'zine' && item.newest === true) newest.push(item.id ?? String(index))
  })
  const zines = list.items.filter((item) => item && item.type === 'zine').length
  if (zines > 0 && newest.length !== 1) {
    const listed = newest.length ? `: ${newest.join(', ')}` : ''
    errors.push(`${file} › newest: exactly one zine must be newest (got ${newest.length}${listed})`)
  }
}

function validateGame(item, path, errors, ctx) {
  rejectUnknown(item, GAME_KEYS, path, errors)
  requireKeys(item, ['type', 'id', 'name', 'system', 'tag', 'hook', 'credit', 'weekday', 'time', 'price', 'state', 'link'], path, errors)
  needString(item, 'id', path, errors, { pattern: BASE, patternMessage: 'must match ^[a-z0-9]+(-[a-z0-9]+)*$', ...ctx })
  needString(item, 'name', path, errors, { max: 24, ...ctx })
  needString(item, 'system', path, errors, { max: 30, ...ctx })
  needString(item, 'tag', path, errors, { max: 52, ...ctx })
  needString(item, 'hook', path, errors, { max: HOOK_MAX, ...ctx })
  needString(item, 'credit', path, errors, { min: 0, max: 300, ...ctx })
  if (Object.hasOwn(item, 'weekday') && !WEEKDAYS.includes(item.weekday)) {
    errors.push(`${path} › weekday: must be one of ${WEEKDAYS.join(', ')} (got ${JSON.stringify(item.weekday)})`)
  }
  if (Object.hasOwn(item, 'time') && (typeof item.time !== 'string' || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(item.time))) {
    errors.push(`${path} › time: must be HH:MM, 24-hour (got ${JSON.stringify(item.time)})`)
  }
  if (Object.hasOwn(item, 'price') && (typeof item.price !== 'string' || !/^\$\d+$/.test(item.price))) {
    errors.push(`${path} › price: must match ^\\$\\d+$ (got ${JSON.stringify(item.price)})`)
  }
  checkHttpsLink(item, path, errors, 'game', ctx.allowLorem)
  if (!Object.hasOwn(item, 'state')) return
  if (!STATES.includes(item.state)) {
    errors.push(`${path} › state: must be one of open, starting, full, hidden (got ${JSON.stringify(item.state)})`)
    return
  }
  const bookable = item.state === 'open' || item.state === 'starting'
  if (!Object.hasOwn(item, 'count')) {
    errors.push(bookable
      ? `${path} › count: must be an integer 1-12 when state is ${item.state} (missing)`
      : `${path} › count: must be null when state is ${item.state} (missing)`)
  } else if (bookable) {
    if (!Number.isInteger(item.count) || item.count < 1 || item.count > 12) {
      errors.push(`${path} › count: must be an integer 1-12 when state is ${item.state} (got ${JSON.stringify(item.count)})`)
    }
  } else if (item.count !== null) {
    errors.push(`${path} › count: must be null when state is ${item.state} (got ${JSON.stringify(item.count)})`)
  }
  if (item.state === 'starting') {
    if (!Object.hasOwn(item, 'who')) errors.push(`${path} › who: required when state is starting, 1-12 characters (missing)`)
    else needString(item, 'who', path, errors, { max: 12, ...ctx })
  } else if (Object.hasOwn(item, 'who')) {
    errors.push(`${path} › who: only allowed when state is starting`)
  }
}

function validateZine(item, path, errors, ctx) {
  rejectUnknown(item, ZINE_KEYS, path, errors)
  requireKeys(item, ZINE_KEYS, path, errors)
  needString(item, 'id', path, errors, { pattern: BASE, patternMessage: 'must match ^[a-z0-9]+(-[a-z0-9]+)*$', ...ctx })
  needString(item, 'name', path, errors, { max: 24, ...ctx })
  needString(item, 'system', path, errors, { max: 30, ...ctx })
  needString(item, 'hook', path, errors, { max: HOOK_MAX, ...ctx })
  needString(item, 'credit', path, errors, { min: 0, max: 300, ...ctx })
  needString(item, 'cover_alt', path, errors, { max: 500, ...ctx })
  const cover = needString(item, 'cover', path, errors, { pattern: BASE, patternMessage: 'must be a base name', ...ctx })
  if (cover) requireArt(cover, [400, 800], `${path} › cover`, ctx.publicDir, errors)
  checkHttpsLink(item, path, errors, 'zine', ctx.allowLorem)
  if (Object.hasOwn(item, 'newest') && typeof item.newest !== 'boolean') {
    errors.push(`${path} › newest: must be true or false`)
  }
}

function validateArt(item, path, errors, ctx) {
  rejectUnknown(item, ART_KEYS, path, errors)
  requireKeys(item, ART_KEYS, path, errors)
  needString(item, 'id', path, errors, { pattern: BASE, patternMessage: 'must match ^[a-z0-9]+(-[a-z0-9]+)*$', ...ctx })
  needString(item, 'caption', path, errors, { max: 80, ...ctx })
  needString(item, 'alt', path, errors, { max: 500, ...ctx })
  const image = needString(item, 'image', path, errors, { pattern: BASE, patternMessage: 'must be a base name', ...ctx })
  if (image) requireArt(image, [400, 800], `${path} › image`, ctx.publicDir, errors)
  if (Object.hasOwn(item, 'home') && typeof item.home !== 'boolean') {
    errors.push(`${path} › home: must be true or false`)
  }
}

function validateSite(site, errors, ctx) {
  validateBySchema(site, SITE_SCHEMA, 'content/site.json', [], errors, ctx.allowLorem)
  if (!site || typeof site !== 'object' || Array.isArray(site)) return
  const images = site.images
  if (!images || typeof images !== 'object') return
  for (const [key, sizes] of Object.entries(IMAGE_SIZES)) {
    const file = images[key]?.file
    if (typeof file === 'string' && BASE.test(file)) {
      requireArt(file, sizes, `content/site.json › images.${key}.file`, ctx.publicDir, errors)
    }
  }
  const og = site.meta?.og_image
  if (typeof og === 'string' && og.startsWith('/')) {
    const rel = og.replace(/^\/+/, '')
    if (!existsSync(join(ctx.publicDir, rel))) errors.push(`content/site.json › meta.og_image: missing public/${rel}`)
  }
}

function validateLinks(links, errors, warnings, { allowLorem }) {
  const file = 'content/links.json'
  if (!links || typeof links !== 'object' || Array.isArray(links)) {
    errors.push(`${file}: must be an object`)
    return
  }
  const allowed = ['discord-invite', 'discord-open-seats', 'sp-profile', 'itch-store', 'mythic-dice', 'instagram', 'support', 'socials']
  for (const key of Object.keys(links)) {
    if (!allowed.includes(key)) errors.push(`${file} › ${key}: unknown key`)
  }
  for (const key of allowed) {
    if (!Object.hasOwn(links, key)) errors.push(`${file} › ${key}: missing required key`)
  }
  for (const key of ['discord-invite', 'sp-profile', 'itch-store', 'mythic-dice', 'instagram']) {
    if (Object.hasOwn(links, key)) checkUrl(links[key], `${file} › ${key}`, errors, { allowLorem })
  }
  if (Object.hasOwn(links, 'discord-open-seats')) {
    if (links['discord-open-seats'] === '') warnings.push(`${file} › discord-open-seats: empty; full-table links fall back to discord-invite`)
    else checkUrl(links['discord-open-seats'], `${file} › discord-open-seats`, errors, { allowLorem })
  }
  const supportNames = ['Stripe', 'PayPal', 'Wise']
  if (Object.hasOwn(links, 'support')) {
    if (!Array.isArray(links.support)) errors.push(`${file} › support: must be an array`)
    else {
      if (links.support.length !== supportNames.length) {
        errors.push(`${file} › support: must have ${supportNames.length} items (got ${links.support.length})`)
      }
      links.support.forEach((item, i) => {
        const path = `${file} › support[${i}]`
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
          errors.push(`${path}: must be an object`)
          return
        }
        rejectUnknown(item, ['name', 'url', 'line'], path, errors)
        requireKeys(item, ['name', 'url', 'line'], path, errors)
        if (Object.hasOwn(item, 'name') && item.name !== supportNames[i]) {
          errors.push(`${path} › name: must be ${JSON.stringify(supportNames[i] ?? 'absent')} (got ${JSON.stringify(item.name)})`)
        }
        if (Object.hasOwn(item, 'url')) checkUrl(item.url, `${path} › url`, errors, { allowLorem })
        needString(item, 'line', path, errors, { max: 90, allowLorem })
      })
    }
  }
  const socialNames = ['StartPlaying', 'Discord', 'Instagram', 'X', 'Facebook', 'itch.io', 'GitHub']
  if (Object.hasOwn(links, 'socials')) {
    if (!Array.isArray(links.socials)) errors.push(`${file} › socials: must be an array`)
    else {
      if (links.socials.length !== socialNames.length) {
        errors.push(`${file} › socials: must have ${socialNames.length} items (got ${links.socials.length})`)
      }
      links.socials.forEach((item, i) => {
        const path = `${file} › socials[${i}]`
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
          errors.push(`${path}: must be an object`)
          return
        }
        rejectUnknown(item, ['name', 'url'], path, errors)
        requireKeys(item, ['name', 'url'], path, errors)
        if (Object.hasOwn(item, 'name') && item.name !== socialNames[i]) {
          errors.push(`${path} › name: must be ${JSON.stringify(socialNames[i] ?? 'absent')} (got ${JSON.stringify(item.name)})`)
        }
        if (Object.hasOwn(item, 'url')) checkUrl(item.url, `${path} › url`, errors, { allowLorem })
      })
    }
  }
}

function validateAbout(about, errors, allowLorem) {
  if (typeof about !== 'string') {
    errors.push('content/about.md: missing file')
    return
  }
  if (!aboutText(about)) errors.push('content/about.md: must not be empty')
  if (!allowLorem && (about.includes('[LOREM') || about.includes('[PLACEHOLDER'))) {
    errors.push('content/about.md: must not contain [LOREM or [PLACEHOLDER')
  }
}

function validateBySchema(value, schema, file, parts, errors, allowLorem) {
  const path = parts.length ? `${file} › ${parts.join('.')}` : file
  if (schema.kind === 'string') {
    if (typeof value !== 'string') {
      errors.push(`${path}: must be a string`)
      return
    }
    const lorem = value.includes('[LOREM') || value.includes('[PLACEHOLDER')
    if (!allowLorem && lorem) errors.push(`${path}: must not contain [LOREM or [PLACEHOLDER`)
    if (!lorem) checkStringLimits(value, schema, path, errors)
    return
  }
  if (schema.kind === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      errors.push(`${path}: must be an object`)
      return
    }
    for (const key of Object.keys(value)) {
      if (!Object.hasOwn(schema.fields, key)) errors.push(`${file} › ${[...parts, key].join('.')}: unknown key`)
    }
    for (const [key, child] of Object.entries(schema.fields)) {
      const childParts = [...parts, key]
      if (!Object.hasOwn(value, key)) errors.push(`${file} › ${childParts.join('.')}: missing required key`)
      else validateBySchema(value[key], child, file, childParts, errors, allowLorem)
    }
    return
  }
  if (schema.kind === 'array') {
    if (!Array.isArray(value)) {
      errors.push(`${path}: must be an array`)
      return
    }
    if (schema.length != null && value.length !== schema.length) {
      errors.push(`${path}: must have ${schema.length} items (got ${value.length})`)
    }
    value.forEach((item, i) => {
      const next = parts.length ? [...parts.slice(0, -1), `${parts.at(-1)}[${i}]`] : [`[${i}]`]
      validateBySchema(item, schema.item, file, next, errors, allowLorem)
    })
  }
}

function checkStringLimits(value, schema, path, errors) {
  const min = schema.min ?? 1
  const max = schema.max
  if (value.length < min || (max != null && value.length > max)) {
    const range = max != null ? `${min}-${max}` : `at least ${min}`
    errors.push(`${path}: must be ${range} characters (got ${value.length})`)
  }
  if (schema.pattern && !schema.pattern.test(value)) {
    errors.push(`${path}: ${schema.patternMessage || 'does not match the required pattern'} (got ${JSON.stringify(value)})`)
  }
  const expected = schema.tokens || []
  const found = [...value.matchAll(/\{([a-z]+)\}/g)].map((match) => match[1])
  const same = found.length === expected.length && expected.every((token) => found.includes(token)) && found.every((token) => expected.includes(token))
  if (!same) {
    errors.push(expected.length
      ? `${path}: must use ${expected.map((token) => `{${token}}`).join(' and ')} and no other templates (got ${found.map((token) => `{${token}}`).join(', ') || 'none'})`
      : `${path}: unexpected template ${found.map((token) => `{${token}}`).join(', ')}`)
  }
}

function needString(item, key, path, errors, { min = 1, max = null, allowLorem, pattern, patternMessage } = {}) {
  if (!Object.hasOwn(item, key)) return null
  const value = item[key]
  if (typeof value !== 'string') {
    errors.push(`${path} › ${key}: must be a string`)
    return null
  }
  const lorem = value.includes('[LOREM') || value.includes('[PLACEHOLDER')
  if (!allowLorem && lorem) errors.push(`${path} › ${key}: must not contain [LOREM or [PLACEHOLDER`)
  if (!lorem) checkStringLimits(value, { min, max, pattern, patternMessage }, `${path} › ${key}`, errors)
  return lorem ? null : value
}

function checkHttpsLink(item, path, errors, kind, allowLorem) {
  if (!Object.hasOwn(item, 'link')) return
  const link = item.link
  if (typeof link !== 'string') {
    errors.push(`${path} › link: must be a string`)
    return
  }
  if (!allowLorem && (link.includes('[LOREM') || link.includes('[PLACEHOLDER'))) {
    errors.push(`${path} › link: must not contain [LOREM or [PLACEHOLDER`)
  }
  if (!link.startsWith('https://')) {
    errors.push(`${path} › link: must start with https:// (got ${JSON.stringify(link)})`)
    return
  }
  if (kind === 'game' && (!link.startsWith('https://startplaying.games/adventure/') || !link.includes('ref='))) {
    errors.push(`${path} › link: must be a https://startplaying.games/adventure/… link containing ref= (got ${JSON.stringify(link)})`)
  }
  if (kind === 'zine' && !link.startsWith('https://gm-manny.itch.io/')) {
    errors.push(`${path} › link: must start with https://gm-manny.itch.io/ (got ${JSON.stringify(link)})`)
  }
}

function checkUrl(value, path, errors, { allowLorem }) {
  if (typeof value !== 'string') {
    errors.push(`${path}: must be a string`)
    return
  }
  if (!allowLorem && (value.includes('[LOREM') || value.includes('[PLACEHOLDER'))) {
    errors.push(`${path}: must not contain [LOREM or [PLACEHOLDER`)
  }
  if (!value.startsWith('https://') || /\s/.test(value)) {
    errors.push(`${path}: must start with https:// (got ${JSON.stringify(value)})`)
  }
}

function requireArt(base, sizes, path, publicDir, errors) {
  if (!BASE.test(base)) return
  for (const size of sizes) {
    const rel = `art/${base}-${size}.webp`
    if (!existsSync(join(publicDir, rel))) errors.push(`${path}: missing public/${rel}`)
  }
}

function rejectUnknown(item, allowed, path, errors) {
  for (const key of Object.keys(item)) {
    if (!allowed.includes(key)) errors.push(`${path} › ${key}: unknown key`)
  }
}

function requireKeys(item, keys, path, errors) {
  for (const key of keys) {
    if (!Object.hasOwn(item, key)) errors.push(`${path} › ${key}: missing required key`)
  }
}
