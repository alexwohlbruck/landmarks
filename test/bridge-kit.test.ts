import { describe, expect, test } from 'bun:test'
import { along, bead } from '../generators/bridge-kit'
import { Part, type V3 } from '../generators/mesh'

const expectClose = (a: number[][], b: number[][]) => {
  expect(a.length).toBe(b.length)
  a.forEach((v, i) => v.forEach((c, k) => expect(c).toBeCloseTo(b[i][k], 4)))
}

describe('bridge kit lights', () => {
  test('along spreads points evenly by length, half a gap in from each end', () => {
    const path: V3[] = [[0, 0, 0], [0, 10, 0], [0, 10, 30]]
    const points = along(path, 4)
    expect(points).toHaveLength(4)
    // 40 m long, so a light every 10 m from 5 m in: one on the first leg, three up the second.
    expectClose(points, [[0, 5, 0], [0, 10, 5], [0, 10, 15], [0, 10, 25]])
    expect(along([[1, 2, 3]], 2)).toEqual([[1, 2, 3], [1, 2, 3]])
    expect(along([], 3)).toEqual([])
  })

  test('a bead is a closed solid of 12 faces, or 4 for a low model', () => {
    for (const [tetra, faces] of [[false, 12], [true, 4]] as const) {
      const part = new Part()
      bead(part, [5, 5, 5], 1, tetra)
      expect(part.triangles).toBe(faces)
      // Closed and wound outward: the signed volume is positive.
      let volume = 0
      for (let i = 0; i < part.pos.length; i += 9) {
        const [a, b, c] = [0, 3, 6].map((k) => part.pos.slice(i + k, i + k + 3))
        volume += a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0])
      }
      expect(volume).toBeGreaterThan(0)
    }
  })
})
