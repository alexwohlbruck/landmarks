import { describe, expect, test } from 'bun:test'
import { Part, writeGlb, type V3 } from '../generators/mesh'
import { invertedFaces } from '../src/glb'

const up: V3 = [0, 0, 1]
const square = (p: Part, z: number, normals?: V3[]) => {
  // Wound clockwise seen from above: inward for an upward-facing roof.
  const a: V3 = [0, 0, z], b: V3 = [0, 1, z], c: V3 = [1, 1, z], d: V3 = [1, 0, z]
  p.tri(a, b, c, undefined, undefined, undefined, normals)
  p.tri(a, c, d, undefined, undefined, undefined, normals)
}
const glb = (p: Part) => writeGlb('t', [{ part: p, material: { name: 'roof', color: 0x999999 } }])

describe('face winding', () => {
  test('tri winds a face to agree with explicit normals', () => {
    const p = new Part()
    square(p, 1, [up, up, up])
    expect(invertedFaces(glb(p))).toEqual([{ material: 'roof', inverted: 0, triangles: 2 }])
  })

  test('invertedFaces finds faces wound against their normals', () => {
    const p = new Part()
    square(p, 1)
    // Stored normals that disagree with the winding, as an inward-wound vault had.
    for (let i = 1; i < p.nrm.length; i += 3) p.nrm[i] = -p.nrm[i]
    expect(invertedFaces(glb(p))).toEqual([{ material: 'roof', inverted: 2, triangles: 2 }])
  })
})
