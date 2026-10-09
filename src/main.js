import './style.css'
import { games } from './games'
import { startLabel } from './when'

const list = document.querySelector('#games')

function text(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function facts(game) {
  return [game.system, startLabel(game.start), game.price].filter(Boolean).map(text).join(' · ')
}

list.innerHTML = games
  .map((game) => {
    const statusClass = game.open ? 'status is-open' : 'status'
    return `<li>
      <a class="row" href="${text(game.url)}">
        <span class="row-title">${text(game.name)}</span>
        <span class="row-meta">${facts(game)} · <span class="${statusClass}">${text(game.status)}</span></span>
      </a>
    </li>`
  })
  .join('')
