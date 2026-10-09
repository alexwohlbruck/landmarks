import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { axisAngle, Part } from '../generators/mesh'
import { bakePlacement, glbBounds, parseGlb, writeGlb as writeGltf } from '../src/glb'
import { box, material, place, worldVertices, writeGlb } from './helpers'

const MODELS = join(import.meta.dir, '../models')

const expectClose = (a: number[][], b: number[][], digits = 4) => {
  expect(a.length).toBe(b.length)
  a.forEach((v, i) => v.forEach((c, k) => expect(c).toBeCloseTo(b[i][k], digits)))
}

describe('bakePlacement', () => {
  // A 10 m arm pointing north from the origin, 2 m tall.
  const arm = writeGlb('arm', [{ part: box([-0.5, 0, 0], [0.5, 10, 2]), material }])

  test('turns model north to the bearing, clockwise from above', () => {
    const baked = bakePlacement(arm, { bearing: 90 })
    const [{ positions }] = worldVertices(baked)
    // Bearing 90: the arm now points east (+X), and not at all north or south.
    expect(Math.max(...positions.map((p) => p[0]))).toBeCloseTo(10, 5)
    expect(Math.max(...positions.map((p) => Math.abs(p[2])))).toBeCloseTo(0.5, 5)
  })

  test('moves every vertex exactly as Parchment places the unbaked model', () => {
    const placement = { bearing: 44.3, scale: 0.5 }
    const [{ positions: before, normals: n0 }] = worldVertices(arm)
    const [{ positions: after, normals: n1 }] = worldVertices(bakePlacement(arm, placement))
    expectClose(after, before.map((p) => place(p, placement)))
    // Normals turn with the model but are not scaled.
    expectClose(n1, n0.map((n) => place(n, { bearing: 44.3 })))
  })

  test('keeps the root free of transforms and its bounds accurate', () => {
    const baked = bakePlacement(arm, { bearing: 30, scale: 2 })
    const { json } = parseGlb(baked)
    const root = json.nodes[json.scenes[0].nodes[0]]
    expect(root.matrix ?? root.translation ?? root.rotation ?? root.scale).toBeUndefined()
    // Height is exact. The plan reach is read from an axis-aligned box's
    // corner, before and after, so each overstates the true reach by up to
    // √2 and they may differ by that much.
    const was = glbBounds(arm)
    const now = glbBounds(baked)
    expect(now.height).toBeCloseTo(was.height * 2, 4)
    expect(now.radius).toBeGreaterThan((was.radius * 2) / Math.SQRT2)
    expect(now.radius).toBeLessThan(was.radius * 2 * Math.SQRT2)
  })

  test('returns the same bytes when there is nothing to bake', () => {
    expect(bakePlacement(arm, {})).toBe(arm)
    expect(bakePlacement(arm, { bearing: 0, scale: 1 })).toBe(arm)
  })

  test('never lifts the model: its ground stays at y = 0 for the map to find', () => {
    // Elevation is published beside the model, not in it; see release.ts.
    const baked = bakePlacement(arm, { bearing: 90, elevation: 10 } as any)
    expect(Math.min(...worldVertices(baked)[0].positions.map((p) => p[1]))).toBeCloseTo(0, 6)
  })

  test('keeps a moving part moving the same way, turned', () => {
    // A 10 m arm on a pivot 20 m up, turning about north, carried east on
    // a translation channel, so both kinds of keyframe are exercised.
    const glb = writeGlb('wheel', [{ part: box([-1, -1, 0], [1, 1, 2]), material }], {}, {
      nodes: [{ name: 'arm', translation: [0, 0, 20], parts: [{ part: box([0, -0.5, -0.5], [10, 0.5, 0.5]), material }] }],
      animation: {
        name: 'turn',
        times: [0, 1, 2, 3, 4],
        channels: [
          { node: 0, path: 'rotation', values: [0, 1, 2, 3, 4].map((i) => axisAngle([0, 1, 0], (i / 4) * Math.PI * 2)) },
          { node: 0, path: 'translation', values: [[0, 0, 20], [3, 0, 20], [6, 0, 20], [3, 0, 20], [0, 0, 20]] },
        ],
      },
    })
    const placement = { bearing: 117, scale: 1.5 }
    const baked = bakePlacement(glb, placement)
    for (const k of [undefined, 0, 1, 2, 3])
      worldVertices(baked, k).forEach((part, i) =>
        expectClose(part.positions, worldVertices(glb, k)[i].positions.map((p) => place(p, placement)), 3))
  })

  test('bakes the real animated models without losing their motion', () => {
    for (const id of ['wonder-wheel', 'carowinds-skytower', 'carowinds-windseeker']) {
      const glb = new Uint8Array(readFileSync(join(MODELS, `${id}.glb`)))
      const placement = { bearing: 200, scale: 1 }
      const baked = bakePlacement(glb, placement)
      for (const k of [0, 1, 2]) {
        const before = worldVertices(glb, k).flatMap((p) => p.positions)
        const after = worldVertices(baked, k).flatMap((p) => p.positions)
        expectClose(after, before.map((p) => place(p, placement)), 2)
      }
      const was = glbBounds(glb)
      const now = glbBounds(baked)
      expect(now.height).toBeCloseTo(was.height, 3)
      expect(now.radius).toBeGreaterThan(was.radius / Math.SQRT2)
      expect(now.radius).toBeLessThan(was.radius * Math.SQRT2)
    }
  })

  test('refuses a mesh drawn both by the root and a moving node', () => {
    const glb = writeGlb('shared', [{ part: box([-1, -1, 0], [1, 1, 2]), material }], {}, {
      nodes: [{ name: 'lamp', translation: [5, 0, 0], parts: [{ part: new Part(), material }] }],
    })
    const gltf = parseGlb(glb)
    gltf.json.nodes[1].mesh = gltf.json.nodes[0].mesh
    expect(() => bakePlacement(writeGltf(gltf), { bearing: 10 })).toThrow('drawn both')
  })
})
