/**
 * Pacific Design Center (César Pelli; Center Blue 1975, Center Green 1988,
 * Center Red 2013), West Hollywood — original procedural geometry, CC0-1.0.
 * bun generators/la-pacific-design-center.ts [out.glb]
 *
 * One model for the three buildings, since they read as one set: the Blue
 * Whale, the Green building behind it on its low blue base, the parking
 * structure that shares the Green's OSM outline, and the Red building.
 *
 * Map frame: x across the Blue Whale (+x to the south-east), y along it
 * (+y to the east-north-east), z up, metres; origin at the Blue Whale
 * outline's centroid on the lowest ground under the model. Placed at
 * bearing 63°, the Blue Whale's long axis. OSM coordinates below are
 * local east/north metres and are turned into this frame by `rot`.
 *
 * What makes it the Pacific Design Center: three glass buildings in
 * primary colours. The Blue Whale, a 161 m long blue glass block whose
 * section steps: a low eave on its north-west side, a sloped glass roof up to
 * the main roof, a barrel vault running its whole length off-centre, a
 * raised sloped glass band beside it, and a sloped glass band down to the
 * south-east wall; the flat roof between (white, per NAIP) is roof; a dark recessed ground
 * floor; a round glass escalator drum on its south-east side. The Green, a
 * square green glass block whose lower corners are cut away by big dark
 * glass facets, under a green octagonal pyramid roof, standing on a low blue
 * base. The Red, a wedge with a curved red face.
 *
 * Sources:
 * - Plan: OSM way/31439559 (Blue Whale: 161 × 74 m), way/429370081 (the
 *   Green's outline, with its parts way/535093304, the Green tower, 10
 *   levels; way/535093308, its round crown; way/535093311, the parking
 *   structure, 7 levels), way/390777734 (Center Red, 9 levels).
 * - Heights: LA County lidar surface model (3–6 m grids, in the Blue Whale's
 *   frame and square to north) over USGS 3DEP bare earth (lowest ground
 *   55 m, by the Blue Whale): Blue Whale main roof 31 m, north-west eave
 *   13 m, vault 41 m at its crown over x ≈ 0–10, a raised band 35–36 m from
 *   x 10 to 21; the Green's base 13 m, the Green 48 m, its pyramid 61 m;
 *   parking 22 m; the Red 47 m (49 m over its own lower ground the lidar
 *   shows flat). The lidar shows the Red, so it postdates 2013.
 * - Look: photos below; USGS NAIP orthophoto for the roofs (white with a
 *   wide blue glass band on the Blue Whale, the Green's green octagon).
 * - Colours: the Blue Whale's cobalt glass, the Green's emerald and the
 *   Red's scarlet, each pulled to the palette's lightness; the Green's pale
 *   bands every two floors as trim lines.
 *
 * Photos (Wikimedia Commons): p1 "Pacific Design Center from West Hollywood
 * Library" (Blervis, CC0, south-west); p2 "Pacific Design Center-(West
 * Hollywood) July 2023" (Benoît Prieur, CC0, south, the vault's end and the
 * escalator drum); p3 "Pacific Design Center-Red" (Anonymous9119, CC0); p4
 * "Pacific Design Center-Blue" (Anonymous9119, CC0, the stepped end); p5
 * "Pacific Design Center-Green" (Anonymous9119, CC0, the cut corners); p6
 * "Pacific Design Center (51017775296)" (Tony Mariotti, CC BY 2.0, all
 * three from Melrose); p7 "Highsmithpacificdesigncenterweho" (Carol M.
 * Highsmith, public domain, the Green on its blue base); p9 "Pacific Design
 * Center at Sunset - panoramio" (Glenn Cooley, CC BY 3.0, the Red).
 *
 * Estimated: the slopes between the lidar's flat steps. The lidar (3 m
 * grid) shows flat 31 m roofs out to both long walls; the photos show sloped
 * blue glass, so the slopes are drawn wider than the lidar's steps (13 m to
 * 31 m over 13 m of plan on the north-west, 26 m to 31 m over 10 m on the
 * south-east), the
 * Green's cut corners (from p5 and p7: 13 m wide at the base, closing
 * 16 m under the top), the escalator drum's height, the Red's glass bands (drawn
 * as four broad bands; the real ones are one per floor). Left out: the round
 * stair tower north of the Green (a separate OSM gap), the bridge between
 * Blue and Green, MOCA's pavilion.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const blue = new Part(), green = new Part(), red = new Part(), roof = new Part(), trim = new Part(), dark = new Part()

const BEARING = 63
const B = (BEARING * Math.PI) / 180
/** OSM local east/north → this model's frame. */
const rot = ([x, y]: XY): XY => [x * Math.cos(B) - y * Math.sin(B), x * Math.sin(B) + y * Math.cos(B)]

/** Ear-clipping triangulation of a simple polygon. */
function earcut(poly: XY[]): [number, number, number][] {
  const idx = poly.map((_, i) => i)
  const crossz = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inTri = (p: XY, a: XY, b: XY, c: XY) => crossz(a, b, p) >= 0 && crossz(b, c, p) >= 0 && crossz(c, a, p) >= 0
  const out: [number, number, number][] = []
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const a = poly[ia], b = poly[ib], c = poly[ic]
      if (crossz(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inTri(poly[j], a, b, c))) continue
      out.push([ia, ib, ic])
      idx.splice(i, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
const signedArea = (poly: XY[]) => poly.reduce((s, p, i) => { const q = poly[(i + 1) % poly.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
const ccwOf = (poly: XY[]) => (signedArea(poly) > 0 ? poly : [...poly].reverse())

function extrude(poly: XY[], z0: number, z1: number, wall: Part, top: Part) {
  const ccw = ccwOf(poly)
  for (let i = 0; i < ccw.length; i++) {
    const a = ccw[i], b = ccw[(i + 1) % ccw.length]
    wall.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  for (const [i, j, k] of earcut(ccw)) top.tri([ccw[i][0], ccw[i][1], z1], [ccw[j][0], ccw[j][1], z1], [ccw[k][0], ccw[k][1], z1])
}

/** Horizontal bands laid on a prism's walls, just proud of them. */
function bands(poly: XY[], levels: [number, number][], part: Part, minEdge = 0) {
  const ccw = ccwOf(poly)
  for (let i = 0; i < ccw.length; i++) {
    const a = ccw[i], b = ccw[(i + 1) % ccw.length]
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
    if (l < minEdge) continue
    const nx = (dy / l) * 0.05, ny = (-dx / l) * 0.05
    for (const [z0, z1] of levels)
      part.quad([a[0] + nx, a[1] + ny, z0], [b[0] + nx, b[1] + ny, z0], [b[0] + nx, b[1] + ny, z1], [a[0] + nx, a[1] + ny, z1])
  }
}

// ---------- the Blue Whale ----------
const BLUE_OSM: XY[] = [[55.5, 69.7], [89.5, 3.5], [-54.3, -69.6], [-88.9, -2.2]]
const bw = BLUE_OSM.map(rot)
const U0 = Math.min(...bw.map((p) => p[0])), U1 = Math.max(...bw.map((p) => p[0]))
const V0 = Math.min(...bw.map((p) => p[1])), V1 = Math.max(...bw.map((p) => p[1]))
{
  // the section across the building (x, z), counter-clockwise
  const sec: XY[] = [[U0, 4], [U1, 4], [U1, 26], [U1 - 10, 31], [22.5, 31], [21, 35.5], [10, 36]]
  const VC = 5, VR = 5, VZ = 36 // the vault: centre x, radius, springing
  for (let k = 1; k < 12; k++) {
    const a = (k / 12) * Math.PI
    sec.push([VC + VR * Math.cos(a), VZ + VR * Math.sin(a)])
  }
  sec.push([0, 36], [0, 31], [U0 + 17, 31], [U0 + 4, 13.5], [U0, 13])
  // which runs are glass on the roof: the sloped faces and the vault read
  // as glass; the flat roofs are roof
  const flat = (a: XY, b: XY) => Math.abs(a[1] - b[1]) < 1e-6 && a[1] > 5
  for (let i = 0; i < sec.length; i++) {
    const a = sec[i], b = sec[(i + 1) % sec.length]
    if (a[1] === 4 && b[1] === 4) continue // the underside sits on the base
    const part = flat(a, b) ? roof : blue
    // outward for a counter-clockwise section in (x, z), swept along +y
    part.quad([a[0], V1, a[1]], [b[0], V1, b[1]], [b[0], V0, b[1]], [a[0], V0, a[1]])
  }
  // the two end walls
  for (const [i, j, k] of earcut(sec)) {
    const P = (q: XY, y: number): V3 => [q[0], y, q[1]]
    // counter-clockwise in (x, z) faces −y, so the far end is flipped
    blue.tri(P(sec[i], V0), P(sec[j], V0), P(sec[k], V0))
    blue.tri(P(sec[k], V1), P(sec[j], V1), P(sec[i], V1))
  }
  // the dark recessed ground floor
  const r = 2
  dark.quad([U0 + r, V0 + r, 0], [U1 - r, V0 + r, 0], [U1 - r, V0 + r, 4], [U0 + r, V0 + r, 4])
  dark.quad([U1 - r, V0 + r, 0], [U1 - r, V1 - r, 0], [U1 - r, V1 - r, 4], [U1 - r, V0 + r, 4])
  dark.quad([U1 - r, V1 - r, 0], [U0 + r, V1 - r, 0], [U0 + r, V1 - r, 4], [U1 - r, V1 - r, 4])
  dark.quad([U0 + r, V1 - r, 0], [U0 + r, V0 + r, 0], [U0 + r, V0 + r, 4], [U0 + r, V1 - r, 4])
  dark.quad([U0, V0, 4], [U0, V1, 4], [U1, V1, 4], [U1, V0, 4]) // soffit, facing down
}
// the escalator drum on the south-east side
{
  const c = rot([-23.4, -53.3]), R = 8.4, z1 = 29, n = 20
  const cx = U1 - 0.5, cy = c[1]
  for (let i = 0; i < n; i++) {
    const a0 = -Math.PI / 2 + (i / n) * Math.PI, a1 = -Math.PI / 2 + ((i + 1) / n) * Math.PI
    const p = (a: number, z: number): V3 => [cx + R * Math.cos(a), cy + R * Math.sin(a), z]
    const nn = (a: number): V3 => [Math.cos(a), Math.sin(a), 0]
    dark.tri(p(a0, 0), p(a1, 0), p(a1, z1), undefined, undefined, undefined, [nn(a0), nn(a1), nn(a1)])
    dark.tri(p(a0, 0), p(a1, z1), p(a0, z1), undefined, undefined, undefined, [nn(a0), nn(a1), nn(a0)])
    roof.tri([cx, cy, z1], p(a0, z1), p(a1, z1))
  }
}

// ---------- the Green building, its blue base, and the parking ----------
const GREEN_OUTLINE: XY[] = ([
  [-17.8, 36.0], [-27.0, 31.3], [-68.3, 111.6], [-12.5, 118.9], [-14.8, 120.7], [-16.3, 122.9], [-17.0, 125.0],
  [-17.3, 127.0], [-17.0, 129.0], [-16.3, 131.1], [-15.0, 133.0], [-13.4, 134.5], [-11.3, 135.5], [-9.4, 136.0],
  [-7.6, 136.1], [-5.8, 135.9], [-3.6, 134.9], [-2.2, 134.0], [-0.9, 132.6], [-0.1, 131.1], [0.6, 129.5], [0.8, 128.1],
  [0.8, 126.4], [0.5, 124.4], [0.0, 123.1], [-1.3, 121.2], [-1.2, 120.9], [26.5, 125.9],
  // (the parking structure's run of the outline is left to the parking)
  [55.5, 69.7], [37.5, 61.0], [-17.1, 34.6],
] as XY[]).map(rot)
const PARKING: XY[] = ([
  [26.3, 128.2], [16.7, 146.7], [16.0, 146.4], [14.1, 150.0], [14.9, 150.4], [13.4, 153.2], [103.1, 199.5],
  [107.8, 201.8], [105.8, 95.4], [55.5, 69.7],
] as XY[]).map(rot)
// the base: the outline less the parking, at 13 m, blue glass like the Whale
extrude(GREEN_OUTLINE, 0, 13, blue, roof)
// the parking structure: it shares the Green's OSM outline, so it is
// replaced and drawn, as a plain grey block
extrude(PARKING, 0, 22, roof, roof)

// the Green tower: a square whose lower corners are cut away by big
// triangular facets, closing up 10 m under the top
{
  const sq = ([[-29.8, 48.4], [37.5, 61.0], [26.5, 125.9], [-41.4, 114.1]] as XY[]).map(rot)
  const ring = (cut: number, z: number): V3[] => {
    const out: V3[] = []
    for (let i = 0; i < 4; i++) {
      const p = sq[i], prev = sq[(i + 3) % 4], next = sq[(i + 1) % 4]
      const toward = (q: XY, d: number): XY => {
        const l = Math.hypot(q[0] - p[0], q[1] - p[1])
        return [p[0] + ((q[0] - p[0]) * d) / l, p[1] + ((q[1] - p[1]) * d) / l]
      }
      const a = toward(prev, cut), b = toward(next, cut)
      out.push([a[0], a[1], z], [b[0], b[1], z])
    }
    return out
  }
  const sqCcw = signedArea(sq) > 0
  if (!sqCcw) sq.reverse()
  const Z0 = 13, Z1 = 32, Z2 = 48, CUT = 13, MIN = 0.4
  const r0 = ring(CUT, Z0), r1 = ring(MIN, Z1), r2 = ring(MIN, Z2)
  // faces: each ring has 8 corners; even edges (corner facets) are dark
  // glass, odd edges (the four faces) green
  for (const [lo, hi] of [[r0, r1], [r1, r2]] as [V3[], V3[]][]) {
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8
      const part = i % 2 === 0 ? dark : green
      part.quad(lo[i], lo[j], hi[j], hi[i])
    }
  }
  // pale floor bands on the faces, every two floors
  const faceBand = (z0: number, z1: number) => {
    for (let i = 1; i < 8; i += 2) {
      const j = (i + 1) % 8
      const at = (ring_: V3[], k: number) => ring_[k]
      // interpolate the face's edge between the r0→r1 rings at height z
      const lerpRing = (k: number, z: number): V3 => {
        const lo = at(r0, k), hi = at(r1, k)
        const t = Math.min(1, Math.max(0, (z - Z0) / (Z1 - Z0)))
        return [lo[0] + (hi[0] - lo[0]) * t, lo[1] + (hi[1] - lo[1]) * t, z]
      }
      const a0 = lerpRing(i, z0), b0 = lerpRing(j, z0), a1 = lerpRing(i, z1), b1 = lerpRing(j, z1)
      // nudge outward
      const dx = b0[0] - a0[0], dy = b0[1] - a0[1], l = Math.hypot(dx, dy)
      const nx = (dy / l) * 0.06, ny = (-dx / l) * 0.06
      const o = (p: V3): V3 => [p[0] + nx, p[1] + ny, p[2]]
      trim.quad(o(a0), o(b0), o(b1), o(a1))
    }
  }
  for (const z of [20.5, 29.5, 38.5]) faceBand(z, z + 1.2)
  // the roof, and the green octagonal pyramid on it
  const c: XY = [(sq[0][0] + sq[2][0]) / 2, (sq[0][1] + sq[2][1]) / 2]
  for (const [i, j, k] of earcut(r2.map((p) => [p[0], p[1]] as XY))) roof.tri(r2[i], r2[j], r2[k])
  const PR = 18, n = 8
  const rot0 = Math.atan2(sq[1][1] - sq[0][1], sq[1][0] - sq[0][0]) + Math.PI / 8
  for (let i = 0; i < n; i++) {
    const a0 = rot0 + (i / n) * 2 * Math.PI, a1 = rot0 + ((i + 1) / n) * 2 * Math.PI
    green.tri([c[0] + PR * Math.cos(a0), c[1] + PR * Math.sin(a0), Z2 + 0.05], [c[0] + PR * Math.cos(a1), c[1] + PR * Math.sin(a1), Z2 + 0.05], [c[0], c[1], 61])
  }
}

// ---------- the Red building ----------
{
  const RED: XY[] = ([
    [-44, 195], [-63, 163], [-80, 144], [-98, 130], [-110, 122], [-74, 122], [-38, 128], [-26, 132], [-25, 145],
    [-23, 145], [-20, 198],
  ] as XY[]).map(rot)
  extrude(RED, 0, 47, red, roof)
  // four glass bands with broad red between, so it reads red from a distance as in photo p6
  bands(RED, [[8, 12], [18, 22], [28, 32], [38, 42]], dark, 3)
}

// ---------- write ----------
const parts = [
  { part: blue, material: { ...PALETTE.window, color: 0x7f97cf } },
  { part: green, material: { name: 'window-2', color: 0x86bf92, roughness: 0.35 } },
  { part: red, material: finish('pdc-red', 0xd7756b) },
  { part: roof, material: PALETTE.roof },
  { part: trim, material: PALETTE.trim },
  { part: dark, material: { name: 'window-3', color: 0x5f6b7a, roughness: 0.35 } },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Pacific Design Center', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, height: 61,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/31439559', 'way/429370081', 'way/535093304', 'way/535093308', 'way/535093311', 'way/390777734'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/la-pacific-design-center.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
