import { loadContent, validate } from './content.js'
import { renderArt, renderFooter, renderGames, renderHead, renderHeader, renderHome, renderNotFound } from './render.js'

export function prerenderPlugin() {
  let command = 'serve'
  let cached = null
  return {
    name: 'prerender-content',
    configResolved(config) {
      command = config.command
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const allowLorem = command !== 'build' || process.env.ALLOW_LOREM === '1'
        if (command !== 'build') cached = null
        if (!cached || cached.allowLorem !== allowLorem) {
          const loaded = loadContent()
          const { errors, warnings } = validate(loaded, { allowLorem })
          for (const warning of warnings) console.warn(warning)
          if (errors.length) throw new Error(errors.join('\n'))
          cached = { allowLorem, model: loaded }
        }
        const model = cached.model
        const page = pageFrom(html)
        const markers = {
          '<!--render:head:home-->': renderHead('home', model),
          '<!--render:head:games-->': renderHead('games', model),
          '<!--render:head:art-->': renderHead('art', model),
          '<!--render:head:404-->': renderHead('404', model),
          '<!--render:header-->': renderHeader(page, model),
          '<!--render:home-->': renderHome(model),
          '<!--render:games-->': renderGames(model),
          '<!--render:art-->': renderArt(model),
          '<!--render:404-->': renderNotFound(model),
          '<!--render:footer-->': renderFooter(model),
        }
        let out = html
        for (const [marker, value] of Object.entries(markers)) {
          if (out.includes(marker)) out = out.replaceAll(marker, value)
        }
        return out
      },
    },
  }
}

function pageFrom(html) {
  if (html.includes('<!--render:head:games-->')) return 'games'
  if (html.includes('<!--render:head:art-->')) return 'art'
  if (html.includes('<!--render:head:404-->')) return '404'
  return 'home'
}
