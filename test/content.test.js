import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { FORBIDDEN_ART, formatJsonError, loadContent, validate } from '../build/content.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function loadedWith(list, extra = {}) {
  const loaded = loadContent(root)
  return { ...loaded, list, errors: [], ...extra }
}

test('JSON parse errors name the file, line, and column', () => {
  const text = '{\n  "a": 1\n  "b": 2\n}\n'
  let message = ''
  try {
    JSON.parse(text)
  } catch (err) {
    message = formatJsonError('content/list.json', text, err)
  }
  assert.match(message, /^content\/list.json: line \d+, column \d+: /)
})

test('real content passes, and rejects leftover LOREM unless allowed', () => {
  const loaded = loadContent(root)
  const open = validate(loaded, { allowLorem: true })
  assert.deepEqual(open.errors, [], open.errors.join('\n'))
  const blob = JSON.stringify(loaded.site) + JSON.stringify(loaded.list) + String(loaded.about)
  const hasLorem = blob.includes('[LOREM') || blob.includes('[PLACEHOLDER')
  const closed = validate(loaded, { allowLorem: false })
  if (hasLorem) {
    assert.ok(closed.errors.length > 0)
    assert.match(closed.errors.join('\n'), /must not contain \[LOREM or \[PLACEHOLDER/)
  } else {
    assert.deepEqual(closed.errors, [], closed.errors.join('\n'))
  }
})

test('the 16 allowed art files pass the forbidden-art guard', () => {
  const names = readdirSync(join(root, 'public/art')).filter((name) => name.endsWith('.webp')).sort()
  assert.equal(names.length, 16)
  for (const name of names) assert.equal(FORBIDDEN_ART.test(name), false, name)
  const loaded = loadContent(root)
  const { errors } = validate(loaded, { allowLorem: true })
  assert.deepEqual(errors.filter((error) => error.includes('forbidden')), [])
})

test('an empty discord-open-seats link warns and does not fail', () => {
  const loaded = loadContent(root)
  loaded.links = structuredClone(loaded.links)
  loaded.links['discord-open-seats'] = ''
  const { errors, warnings } = validate(loaded, { allowLorem: true })
  assert.deepEqual(errors, [])
  assert.match(warnings.join('\n'), /discord-open-seats: empty/)
})

const expectations = {
  'bad-state.json': /› state: must be one of open, starting, full, hidden \(got "Open"\)/,
  'bad-time.json': /› time: must be HH:MM, 24-hour \(got "8:00"\)/,
  'bad-duplicate-id.json': /› id: duplicate id "gloaming"/,
  'bad-missing-link.json': /› link: missing required key/,
  'bad-unknown-key.json': /› stat: unknown key/,
  'bad-starting.json': /› count: must be an integer 1-12 when state is starting \(missing\)/,
  'bad-two-newest.json': /exactly one zine must be newest \(got 2: while-you-sleep, fiddler-in-the-bush\)/,
  'bad-missing-image.json': /› image: missing public\/art\/no-such-art-400\.webp/,
  'bad-http-url.json': /› link: must start with https:\/\/ \(got "http:\/\/startplaying\.games\/adventure\/x\?ref=abc"\)/,
  'bad-lorem.json': /› hook: must not contain \[LOREM or \[PLACEHOLDER/,
}

test('each A3 fixture fails with its own message', () => {
  const dir = join(root, 'test/fixtures')
  const files = readdirSync(dir).filter((name) => name.startsWith('bad-') && name.endsWith('.json')).sort()
  assert.deepEqual(files, [...Object.keys(expectations), 'bad-forbidden.json'].sort())
  for (const file of files) {
    if (file === 'bad-forbidden.json') {
      const { name } = JSON.parse(readFileSync(join(dir, file), 'utf8'))
      const temp = mkdtempSync(join(tmpdir(), 'mv-art-'))
      try {
        mkdirSync(join(temp, 'art'))
        writeFileSync(join(temp, 'art', name), '')
        const { errors } = validate(loadContent(root), { allowLorem: true, publicDir: temp })
        const hit = errors.find((error) => error.includes('forbidden art file name') && error.includes(name))
        assert.ok(hit, errors.join('\n'))
      } finally {
        rmSync(temp, { recursive: true, force: true })
      }
      continue
    }
    const list = JSON.parse(readFileSync(join(dir, file), 'utf8'))
    const allowLorem = file !== 'bad-lorem.json'
    const { errors } = validate(loadedWith(list), { allowLorem })
    assert.match(errors.join('\n'), expectations[file], errors.join('\n'))
    if (file === 'bad-starting.json') {
      assert.match(errors.join('\n'), /› who: required when state is starting, 1-12 characters \(missing\)/)
    }
  }
})

test('check script follows leftover LOREM and passes when allowed', () => {
  const plain = spawnSync(process.execPath, ['scripts/check-content.mjs'], { cwd: root, encoding: 'utf8' })
  const allowed = spawnSync(process.execPath, ['scripts/check-content.mjs'], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, ALLOW_LOREM: '1' },
  })
  assert.equal(allowed.status, 0, allowed.stderr || allowed.stdout)
  const blob = readFileSync(join(root, 'content/site.json'), 'utf8') + readFileSync(join(root, 'content/list.json'), 'utf8')
  if (blob.includes('[LOREM') || blob.includes('[PLACEHOLDER')) {
    assert.notEqual(plain.status, 0)
    assert.match(plain.stderr, /\[LOREM/)
  } else {
    assert.equal(plain.status, 0, plain.stderr || plain.stdout)
  }
})
