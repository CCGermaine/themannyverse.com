import { localLabel, nextStart } from './when.js'

const root = document.documentElement

function storedTheme() {
  if (themeToggle.memory === 'light' || themeToggle.memory === 'dark') return themeToggle.memory
  try {
    const value = localStorage.getItem('mv-theme')
    if (value === 'light' || value === 'dark') return value
  } catch {
    /* storage can throw; the in-memory choice still applies */
  }
  return null
}

function effectiveDark(mq) {
  const theme = root.getAttribute('data-theme')
  if (theme === 'dark' || theme === 'light') return theme === 'dark'
  return mq.matches
}

function themeToggle() {
  const button = document.querySelector('[data-theme-toggle]')
  if (!button) return
  const mq = matchMedia('(prefers-color-scheme: dark)')
  const apply = () => {
    const choice = storedTheme()
    if (choice === 'light' || choice === 'dark') root.setAttribute('data-theme', choice)
    else root.removeAttribute('data-theme')
    button.setAttribute('aria-pressed', String(effectiveDark(mq)))
  }
  button.hidden = false
  apply()
  button.addEventListener('click', () => {
    const next = effectiveDark(mq) ? 'light' : 'dark'
    root.setAttribute('data-theme', next)
    try {
      localStorage.setItem('mv-theme', next)
      themeToggle.memory = null
    } catch {
      themeToggle.memory = next
    }
    button.setAttribute('aria-pressed', String(next === 'dark'))
  })
  mq.addEventListener('change', apply)
}
themeToggle.memory = null

function localiseTimes() {
  for (const el of document.querySelectorAll('time.when')) {
    const [hour, minute] = el.dataset.time.split(':')
    const instant = nextStart({
      timeZone: 'Asia/Kuala_Lumpur',
      weekday: el.dataset.weekday,
      hour: Number(hour),
      minute: Number(minute),
    })
    el.dateTime = instant.toISOString()
    el.textContent = localLabel(instant, undefined, { zoneName: true })
  }
}

function inkStamps() {
  try {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!('IntersectionObserver' in window)) return
    const stamps = document.querySelectorAll('.stamp')
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('inked')
        io.unobserve(entry.target)
      }
    }, { threshold: 0.6 })
    for (const stamp of stamps) {
      stamp.classList.add('pre')
      io.observe(stamp)
    }
  } catch {
    /* leave the stamps in the inked state the HTML already shows */
  }
}

themeToggle()
localiseTimes()
inkStamps()
