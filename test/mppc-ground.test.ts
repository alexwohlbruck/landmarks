import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { readGlb } from '../generators/mesh'
import { mapterhorn } from '../generators/clt-mppc-mapterhorn'
import { groundContacts, modelGround } from '../web/landmark-ground'
import { entranceThresholds } from '../tools/entrances'

const church = 'clt-myers-park-presbyterian'
const load = (id: string) => readGlb(new Uint8Array(readFileSync(new URL(`../models/${id}.glb`, import.meta.url))))

function sourceGround(x: number, z: number) {
  for (const dx of [0, -0.001, 0.001]) for (const dz of [0, -0.001, 0.001]) {
    const h = mapterhorn[church][`${(x + dx).toFixed(3)},${(z + dz).toFixed(3)}`]
    if (h !== undefined) return h
  }
  throw new Error(`Missing native Mapterhorn sample at ${x},${z}`)
}

test('Myers Park church feet follow Mapterhorn, so the slope is not counted twice', () => {
  const primitives = load(church)
  const xs = primitives.flatMap(p => Array.from(p.position).filter((_, i) => i % 3 === 0))
  const zs = primitives.flatMap(p => Array.from(p.position).filter((_, i) => i % 3 === 2))
  const contacts = groundContacts(primitives.map(p => ({ ...p, node: -1 })), {
    minX: Math.min(...xs), maxX: Math.max(...xs), minZ: Math.min(...zs), maxZ: Math.max(...zs),
  })
  const own = modelGround(contacts, contacts.map(([x, , z]) => sourceGround(x, z)), 1)
  expect(own.follows).toBe(true)
  if (!own.follows) throw new Error('Main complex lost its terrain-following feet')
  const doors = entranceThresholds(primitives)
  expect(doors).toHaveLength(14)
  for (const door of doors) {
    expect(door.points.length).toBeGreaterThanOrEqual(2)
    for (const [x, y, z] of door.points) {
      const above = y - sourceGround(x, z) - own.offset
      // The east tower compensates the filled terrain; other thresholds sit
      // at the model's own ground before Parchment's normal base sink.
      expect(above).toBeGreaterThan(-0.9)
      expect(above).toBeLessThan(0.1)
    }
  }
})

test('the two Outreach Center doors start at the flat base before Mapterhorn draping', () => {
  const doors = entranceThresholds(load(`${church}-outreach-center`))
  expect(doors).toHaveLength(2)
  for (const door of doors) {
    expect(door.points.length).toBe(2)
    for (const [, y] of door.points) expect(y).toBe(0)
  }
})
