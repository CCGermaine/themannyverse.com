import { loadContent, validate } from '../build/content.js'

const allowLorem = process.env.ALLOW_LOREM === '1'
const loaded = loadContent()
const { errors, warnings } = validate(loaded, { allowLorem })
for (const warning of warnings) console.warn(warning)
if (errors.length) {
  for (const error of errors) console.error(error)
  process.exit(1)
}
