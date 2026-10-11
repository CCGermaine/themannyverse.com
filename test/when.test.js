import assert from 'node:assert/strict'
import test from 'node:test'
import { localLabel, nextStart } from '../src/when.js'

const start = { timeZone: 'Asia/Kuala_Lumpur', weekday: 'Sat', hour: 8, minute: 0 }

test('A5 Sat 08:00 MYT is Friday evening in New York, and follows the clock change', () => {
  const october = nextStart(start, new Date('2026-10-12T15:00:00Z'))
  const november = nextStart(start, new Date('2026-11-02T15:00:00Z'))
  assert.equal(localLabel(october, 'America/New_York', { zoneName: true }), 'Fri · 8:00 PM EDT')
  assert.equal(localLabel(november, 'America/New_York', { zoneName: true }), 'Fri · 7:00 PM EST')
  assert.equal(localLabel(october, 'America/New_York'), 'Fri · 8:00 PM')
})

test('A5 Sat 08:00 MYT stays Saturday morning in Kuala Lumpur', () => {
  const instant = nextStart(start, new Date('2026-10-12T15:00:00Z'))
  assert.equal(localLabel(instant, 'Asia/Kuala_Lumpur', { zoneName: true }), 'Sat · 8:00 AM GMT+8')
})

test('A5 a run at Sat 08:01 MYT rolls to the next week', () => {
  const onTime = nextStart(start, new Date('2026-10-17T00:00:00Z'))
  const justAfter = nextStart(start, new Date('2026-10-17T00:01:00Z'))
  assert.equal(onTime.toISOString(), '2026-10-17T00:00:00.000Z')
  assert.equal(justAfter.toISOString(), '2026-10-24T00:00:00.000Z')
  assert.equal(localLabel(justAfter, 'Asia/Kuala_Lumpur', { zoneName: true }), 'Sat · 8:00 AM GMT+8')
})
