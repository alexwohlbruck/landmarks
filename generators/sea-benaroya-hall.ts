/**
 * Benaroya Hall, Seattle — procedural, CC0-1.0.
 * bun generators/sea-benaroya-hall.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the OSM outline's
 * centroid, on the lowest ground under the footprint (2nd Avenue at
 * University Street). Built in the block's frame: x runs from 2nd Avenue to
 * 3rd Avenue, y from University Street to Union Street; placed at bearing
 * 328.3° so those line up with the street grid.
 *
 * LMN Architects, 1998. A tall sandstone box holding the concert hall, its
 * roof sloping up toward University Street, wrapped on three sides by lower
 * lobby wings; at the University Street end the Grand Lobby, a half-drum of
 * glass three storeys tall on a granite base, under a thin overhanging roof
 * disc. Offices and the recital hall fill the Union Street end; a lower
 * stone range runs along 3rd Avenue.
 *
 * Evidence:
 * - Lidar (USGS 3DEP WA_KingCo_1_2021, 0.5 m), heights above the tile's
 *   lowest ground (2nd Avenue is 1–5 m above it, 3rd Avenue 11–16 m): the
 *   hall's roof rising from 28.5 m at its Union end to 35.5 m at its
 *   University end; the drum and the lobby wings at 28 m; the drum reaching
 *   55 m from the outline's centroid along the block; the Union end at
 *   28.5 m with a 23 m step on 2nd Avenue; the 3rd Avenue range at 23 m.
 * - OSM way/69273374 (outline) and its five building:parts: the plan, the
 *   drum's centre and radius (23.5 m), the hall box.
 * - Photos (credits in /tmp/city/sea/work/sea-benaroya-hall/credits.txt):
 *   the drum's bays (nine across the half circle, round silver columns
 *   between), three glazed storeys over a one-storey granite base, the roof
 *   disc, the tan sandstone of the hall and wings.
 * - Estimated: the drum's base height (12 m above the tile minimum, about
 *   one storey over University Street), the roof disc's overhang (1.5 m).
 * - Not modelled: the Garden of Remembrance terraces, signage, canopies.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const Z0 = 2.3 // the lowest ground under the footprint, above the lidar tile's minimum
const TAU = Math.PI * 2

const stone = new Part(), granite = new Part(), glass = new Part(), trim = new Part(), roof = new Part()

/** A flat quad wound to face along n, whatever order its corners came in (one corner pair may coincide). */
function face(p: Part, q: V3[], n: V3) {
  // Newell's normal, which survives a degenerate edge.
  const c = [0, 0, 0]
  for (let i = 0; i < q.length; i++) {
    const a = q[i], b = q[(i + 1) % q.length]
    c[0] += (a[1] - b[1]) * (a[2] + b[2]); c[1] += (a[2] - b[2]) * (a[0] + b[0]); c[2] += (a[0] - b[0]) * (a[1] + b[1])
  }
  const r = c[0] * n[0] + c[1] * n[1] + c[2] * n[2] >= 0 ? q : [q[3], q[2], q[1], q[0]]
  for (const [i, j, k] of [[0, 1, 2], [0, 2, 3]]) {
    const A = r[i], B = r[j], C = r[k]
    if (Math.hypot(B[0] - A[0], B[1] - A[1], B[2] - A[2]) < 1e-6 || Math.hypot(C[0] - B[0], C[1] - B[1], C[2] - B[2]) < 1e-6 || Math.hypot(C[0] - A[0], C[1] - A[1], C[2] - A[2]) < 1e-6) continue
    p.tri(A, B, C)
  }
}

// Block frame (u toward University, v toward 3rd Avenue) to model frame.
const P = (u: number, v: number, z: number): V3 => [v, -u, z - Z0]

/** A box over a (u, v) rectangle from the ground to z1, walls in `wall`, top in `top`. */
function block(u0: number, u1: number, v0: number, v1: number, z1: number, wall = stone, top = roof, z0 = Z0) {
  const ring = (z: number) => [P(u1, v0, z), P(u1, v1, z), P(u0, v1, z), P(u0, v0, z)]
  wall.loft([ring(z0), ring(z1)])
  top.cap(ring(z1), true)
}

// --- The Union Street end: offices and the recital hall -------------------------
block(-48, -24, -34, 15, 28.5)
block(-48, -24, -41, -34, 23)
block(-24, -14, -41, -27, 16)
// --- The 3rd Avenue range ------------------------------------------------------
block(-48, 55, 21, 30, 23)
// --- Lobby wings either side of the hall ----------------------------------------
block(-27, 31, -26, -20, 28)
block(-24, 31, 15, 21, 28)

// --- The hall: a sandstone box, its roof sloping up toward University ------------
{
  const u0 = -24, u1 = 35, v0 = -20, v1 = 14.7, za = 28.5, zb = 35.5
  const top = (u: number) => za + (zb - za) * (u - u0) / (u1 - u0)
  const bot = [P(u1, v0, Z0), P(u1, v1, Z0), P(u0, v1, Z0), P(u0, v0, Z0)]
  const tp = [P(u1, v0, top(u1)), P(u1, v1, top(u1)), P(u0, v1, top(u0)), P(u0, v0, top(u0))]
  stone.loft([bot, tp])
  roof.cap(tp, true)
  // A cornice lip round the top, so the box reads finished rather than cut.
  const lip = 0.5, zl = 1.2
  const out = (k: number): V3[] => [P(u1 + k, v0 - k, top(u1)), P(u1 + k, v1 + k, top(u1)), P(u0 - k, v1 + k, top(u0)), P(u0 - k, v0 - k, top(u0))]
  const o0 = out(lip).map((p) => [p[0], p[1], p[2] - zl] as V3), o1 = out(lip)
  trim.loft([o0, o1])
}

// --- The Grand Lobby: a half-drum of glass --------------------------------------
{
  const CU = 31, CV = -2.6, R = 23.5          // centre and radius (OSM part)
  const ZB = 12, ZT = 26.2, ZR = 28           // granite base top, glass top, roof disc
  const N = 18                                  // facets round the half circle
  const at = (r: number, a: number, z: number) => P(CU + r * Math.cos(a), CV + r * Math.sin(a), z)
  const angles = Array.from({ length: N + 1 }, (_, i) => -Math.PI / 2 + (i / N) * Math.PI)
  // Smooth-shaded curved walls, one strip per band.
  const band = (p: Part, r0: number, r1: number, z0: number, z1: number) => {
    for (let i = 0; i < N; i++) {
      const a = angles[i], b = angles[i + 1]
      const na: V3 = [Math.sin(a), -Math.cos(a), 0], nb: V3 = [Math.sin(b), -Math.cos(b), 0]
      // model-frame normals: u → −y, v → x, so (cos, sin) in (u, v) is (sin, −cos) in (x, y)
      const q = [at(r0, a, z0), at(r0, b, z0), at(r1, b, z1), at(r1, a, z1)]
      p.tri(q[0], q[1], q[2], undefined, undefined, undefined, [na, nb, nb])
      p.tri(q[0], q[2], q[3], undefined, undefined, undefined, [na, nb, na])
    }
  }
  // Granite base, a little proud of the glass.
  band(granite, R + 0.6, R + 0.6, Z0, ZB)
  const ledge = (r0: number, r1: number, z: number, p: Part, up: boolean) => {
    for (let i = 0; i < N; i++) {
      const a = angles[i], b = angles[i + 1]
      const q = [at(r0, a, z), at(r0, b, z), at(r1, b, z), at(r1, a, z)]
      face(p, q, [0, 0, up ? 1 : -1])
    }
  }
  ledge(0, R + 0.6, ZB, granite, true)
  // The glass: three storeys, a pale floor band between the upper two.
  band(glass, R, R, ZB, ZT)
  band(trim, R + 0.08, R + 0.08, 18.6, 19.4)
  // Round silver columns between the nine bays.
  for (let k = 0; k <= 9; k++) {
    const a = -Math.PI / 2 + (k / 9) * Math.PI
    const c = [CU + (R + 0.35) * Math.cos(a), CV + (R + 0.35) * Math.sin(a)]
    const col: V3[][] = [ZB, ZT].map((z) => Array.from({ length: 8 }, (_, j) => {
      const t = (j / 8) * TAU
      return P(c[0] + 0.45 * Math.cos(t), c[1] + 0.45 * Math.sin(t), z)
    }))
    for (let j = 0; j < 8; j++) {
      const l = (j + 1) % 8
      const n = (jj: number): V3 => { const t = (jj / 8) * TAU; return [Math.sin(t), -Math.cos(t), 0] }
      trim.tri(col[0][j], col[0][l], col[1][l], undefined, undefined, undefined, [n(j), n(l), n(l)])
      trim.tri(col[0][j], col[1][l], col[1][j], undefined, undefined, undefined, [n(j), n(l), n(j)])
    }
  }
  // The roof disc: a thin overhanging rim over a roof that fills the drum.
  band(trim, R + 1.5, R + 1.5, ZT, ZR)
  ledge(R, R + 1.5, ZT, trim, false)
  ledge(0, R + 1.5, ZR, roof, true)
}

// --- Windows on the 3rd Avenue range: broad storey-grouped panels -----------------
// Tall glazed bays between stone piers (photo up 3rd Avenue), above the
// sidewalk, which sits 11–16 m above the tile minimum.
const windows = new Part()
for (let k = 0; k < 9; k++) {
  const u0 = -42 + k * 10.5, u1 = u0 + 6.5, v = 30.05
  face(windows, [P(u1, v, 16.5), P(u0, v, 16.5), P(u0, v, 21.5), P(u1, v, 21.5)], [1, 0, 0])
}

// --- Materials ------------------------------------------------------------------
// Tan sandstone and grey granite from daylight photos, pulled to the
// palette's lightness; the drum's glass is the window slate, its columns,
// floor band and roof rim the pale trim.
const SANDSTONE = finish('sandstone', 0xe6d7bb)
const GRANITE = finish('granite', 0xb4b3ad)
const parts = [
  { part: stone, material: SANDSTONE },
  { part: granite, material: GRANITE },
  { part: glass, material: { ...PALETTE.window, color: 0x7d91a2 } },
  { part: windows, material: PALETTE.window },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
]
// The drum's glass and the range's windows share the one window material.
glass.pos.push(...windows.pos); glass.nrm.push(...windows.nrm); glass.uv.push(...windows.uv)
const out = parts.filter((p) => p.part !== windows)
const triangles = out.reduce((n, p) => n + p.part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Benaroya Hall', out, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: 35.5 - Z0, bearing: 328.3,
})
await Bun.write(new URL('../models/sea-benaroya-hall.glb', import.meta.url), glb)
console.log(`sea-benaroya-hall.glb: ${triangles} triangles, ${glb.length} bytes`)
