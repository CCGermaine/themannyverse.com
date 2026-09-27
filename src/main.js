import './style.css'
import { games } from './games'

function getStatusClass(status) {
  if (status === 'full') return 'status-full'
  if (status === 'pending') return 'status-pending'
  return 'status-available'
}

function renderGameCard(game) {
  const statusClass = getStatusClass(game.status)
  const seatsDisplay = `${game.seatsFilled} / ${game.seatsTotal}`

  const coverElement = game.coverType === 'video'
    ? `<video class="game-cover" autoplay muted loop playsinline><source src="${game.coverImage}" type="video/webm"></video>`
    : `<img class="game-cover" src="${game.coverImage}" alt="${game.name} cover">`

  return `
    <a href="${game.url}" class="game-card" target="_blank" rel="noopener noreferrer">
      <div class="game-cover-wrapper">
        ${coverElement}
        <span class="game-status ${statusClass}">${game.statusLabel}</span>
      </div>
      <div class="game-content">
        <h3 class="game-title">${game.name}</h3>
        <p class="game-subtitle">${game.subtitle}</p>
        <p class="game-description">${game.description}</p>
        <div class="game-details">
          <div class="game-detail">
            <span class="detail-label">SYSTEM</span>
            <span class="detail-value">${game.system}</span>
          </div>
          <div class="game-detail">
            <span class="detail-label">SCHEDULE</span>
            <span class="detail-value">${game.schedule}</span>
          </div>
          <div class="game-detail">
            <span class="detail-label">SESSION</span>
            <span class="detail-value">${game.sessionDuration}</span>
          </div>
          <div class="game-detail">
            <span class="detail-label">SEATS</span>
            <span class="detail-value">${seatsDisplay}</span>
          </div>
          <div class="game-detail game-price">
            <span class="detail-label">PRICE</span>
            <span class="detail-value">${game.price} / Session</span>
          </div>
        </div>
        <button class="game-cta">${game.ctaText}</button>
      </div>
    </a>
  `
}

document.querySelector('#app').innerHTML = `
  <main class="hero">
    <div class="hero-content">
      <p class="hero-tagline">Online TTRPGs · Live Events · Cherating Adventures · Art</p>
      <h1>Adventure Awaits Beyond The Map.</h1>
      <p>Online tabletop roleplaying adventures, strange worlds, dangerous roads and stories shaped by the people who sit around the table.</p>
      <a href="#ttrpgs" class="cta-button">Join an Adventure</a>
    </div>
  </main>

  <section id="ttrpgs" class="games-section">
    <div class="container">
      <h2 class="section-title">ENTER THE BASTION</h2>
      <p class="section-subtitle">Mythic Bastionland and other tabletop adventures, played online.</p>
      <div class="games-grid">
        ${games.map(renderGameCard).join('')}
      </div>
    </div>
  </section>
`
