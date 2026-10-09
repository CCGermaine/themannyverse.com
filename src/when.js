// Weekly table time. `start` is a clock time in one zone. The label is that
// instant in the visitor's zone, so a US clock change shows up on its own.

function zoneParts(date, timeZone) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })
  const part = {}
  for (const piece of fmt.formatToParts(date)) {
    if (piece.type !== 'literal') part[piece.type] = piece.value
  }
  if (part.hour === '24') part.hour = '00'
  return part
}

function zoneOffsetMs(date, timeZone) {
  const part = zoneParts(date, timeZone)
  const asUtc = Date.UTC(
    Number(part.year),
    Number(part.month) - 1,
    Number(part.day),
    Number(part.hour),
    Number(part.minute),
    Number(part.second),
  )
  return asUtc - date.getTime()
}

function zonedTime(year, month, day, hour, minute, timeZone) {
  const guess = Date.UTC(year, month - 1, day, hour, minute, 0)
  const first = guess - zoneOffsetMs(new Date(guess), timeZone)
  return new Date(guess - zoneOffsetMs(new Date(first), timeZone))
}

export function nextStart(start, now = new Date()) {
  const today = zoneParts(now, start.timeZone)
  const cursor = Date.UTC(Number(today.year), Number(today.month) - 1, Number(today.day))
  for (let i = 0; i < 8; i++) {
    const day = new Date(cursor + i * 86400000)
    const instant = zonedTime(
      day.getUTCFullYear(),
      day.getUTCMonth() + 1,
      day.getUTCDate(),
      start.hour,
      start.minute,
      start.timeZone,
    )
    if (zoneParts(instant, start.timeZone).weekday !== start.weekday) continue
    if (instant.getTime() >= now.getTime()) return instant
  }
  throw new Error(`No upcoming ${start.weekday} ${start.hour}:${start.minute} in ${start.timeZone}`)
}

export function localLabel(instant, timeZone) {
  const zone = timeZone ? { timeZone } : {}
  const day = new Intl.DateTimeFormat('en-US', { ...zone, weekday: 'short' }).format(instant)
  const time = new Intl.DateTimeFormat('en-US', {
    ...zone,
    hour: 'numeric',
    minute: '2-digit',
  }).format(instant)
  return `${day} · ${time}`
}

export function startLabel(start, now = new Date(), timeZone) {
  return localLabel(nextStart(start, now), timeZone)
}
