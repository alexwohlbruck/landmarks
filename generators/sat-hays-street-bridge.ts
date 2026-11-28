/**
 * Hays Street Bridge, San Antonio, Texas: two wrought-iron Phoenix-column
 * through trusses, built 1881 for the Southern Pacific and re-erected here in
 * 1910 to carry Hays Street over the railroad; closed to traffic in 1982 and
 * reopened in 2010 as a footbridge. A long Whipple (double-intersection)
 * truss over the Union Pacific tracks and a shorter one east of it, both with
 * inclined end posts and lattice portal struts, on concrete piers, with the
 * 1910 concrete approach viaduct on pier bents to the west and a ramp down to
 * the east. Original procedural geometry, CC0-1.0.
 *   bun generators/sat-hays-street-bridge.ts
 *
 * Frame: bearing 0. x east, y north, z up, metres. Origin at -98.4775,
 * 29.430209, on the bridge's line. y = 0 is the lowest ground under the
 * footprint: the pier feet run 2.6 m into the ground (the map's terrain
 * differs from the lidar bare earth by up to 1.7 m near the east ramp), so
 * y = 0 is 201.6 m NAVD88, the deepest foot, 2.6 m under the lowest lidar
 * ground (204.20, under the west approach); every height is NAVD88 less
 * that. Elevation 0.
 *
 * What the model draws: the trusses, the deck structure, the approach
 * viaduct and its pier bents, the piers, the parapets, from the west landing
 * (on the ramp way 154820958 at s 44 m, 0.6 m over the ground, closed by an
 * abutment face down into it) to the east one
 * (the end of way 320038766, s 442 m). It draws no walking surface: the
 * deck slab's top is 0.3 m under the lidar walkway, and the map draws the
 * footway (ways 1327951898 and 40841573, bridge=yes; the ramps 154820958 and
 * 320038766) on it. OSM has no man_made=bridge outline here, so `replaces`
 * is empty. Their heights: ~/landmarks-scratch/osm-ele/sat-hays-street-bridge.osc
 * and .md (ele on six nodes).
 *
 * Evidence
 * - OSM: the footway ways above, their line (the west approach bends north
 *   from x -171.6 to the ramp), Q110002771.
 * - USGS 3DEP lidar USGS_LPC_TX_Central_B2_2017_LAS_2019 (2017):
 *   `tools/bridge_ele.py measure 154820958 1327951898 40841573 320038766
 *   --every 10` (~/landmarks-scratch/satx/work/sat-hays-street-bridge/
 *   measure.txt): the walkway climbs at 4.8 % from the west landing to the
 *   long truss (s 215), at 1.7 % across it to a crest at s 321 (216.9 m),
 *   and falls at about 4.5 % to the east landing (211.8 m); and the 1 m
 *   grid (lidar.json): the long truss's bottom chord from x -32.6 to 37.4
 *   (70 m; published 225 ft), its top chord x -26..32 at 225.3 (9.7 m over
 *   the bottom chord); the short truss x 38.4..76.4 (38 m; published 130
 *   ft), top chord 224.3 (8.0 m); one pier between them; the trusses 7.5 m apart, the approach deck
 *   6.5 m wide.
 * - Published: Wikipedia "Hays Street Bridge"; Texas Historical Commission
 *   (1881 Phoenix Bridge Co.; re-erected 1910; 2010 restoration).
 * - Photos (Wikimedia Commons), EVIDENCE: "HaysStreetBridge.jpg"
 *   (SoylentPurple, CC BY-SA 3.0): both trusses side on, their panels,
 *   diagonals, end posts, the concrete approach on its bents;
 *   "Hays Street Bridge (1 of 1).jpg" (Renelibrary, CC BY-SA 4.0): the
 *   portal, the lattice struts, the rust-brown iron, the railings;
 *   "Hays Street Bridge- concrete approach.JPG" (Patrick Sparks, CC BY 3.0).
 *
 * Estimated: the panel counts (eleven in the long truss, seven in the
 * short, from the top chords' lengths),
 * the bent spacing (about 13 m), the pier shapes. Drawn thicker than real
 * for the low model: chords 0.55 m, posts and diagonals 0.35 m, at their
 * real spacing (STYLE, Bridges). No detail model.
 *
 * Night: the trusses carry pendant lamps (photo); drawn as `lamp` beads under
 * the portal and lateral struts.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { beam, report, writeGlb, type XY } from './sf-de-young'
import { block } from './sat-san-fernando-cathedral'

const iron = new Part(), concrete = new Part(), slab = new Part(), lamp = new Part()
const SINK = 2.6, OY = 1.0

// The walkway profile from the lidar: [s, walkway, ground], NAVD88 m.
const PROFILE: [number, number, number][] = [[0, 204.19, 204.14], [14, 204.40, 204.53], [24, 205.15, 205.28], [34, 205.96, 206.09], [44, 206.68, 206.06], [54, 207.17, 205.34], [64, 207.68, 204.96], [74, 208.15, 204.94], [82, 208.57, 204.20], [102, 209.49, 204.94], [112, 210.00, 205.32], [122, 210.45, 205.64], [132, 210.93, 205.78], [142, 211.43, 205.89], [161, 212.38, 206.08], [171, 212.86, 206.19], [181, 213.34, 206.41], [191, 213.82, 206.43], [201, 214.27, 206.45], [211, 214.80, 206.67], [215, 214.94, 206.71], [221, 215.21, 207.14], [231, 215.62, 207.52], [241, 215.76, 207.57], [251, 215.92, 207.65], [261, 216.05, 207.91], [271, 216.19, 208.09], [281, 216.31, 208.13], [291, 216.44, 208.14], [301, 216.58, 208.31], [311, 216.74, 208.42], [321, 216.90, 208.67], [331, 216.72, 209.04], [333, 216.64, 209.10], [343, 216.23, 209.29], [346, 216.06, 209.35], [356, 215.57, 209.58], [367, 215.11, 209.89], [377, 214.79, 209.82], [387, 214.41, 210.12], [395, 214.07, 210.38], [405, 213.59, 210.70], [415, 213.10, 211.00], [425, 212.62, 211.31], [435, 212.13, 211.52], [442, 211.83, 211.83]]
const interp = (s: number, k: 1 | 2) => {
  for (let i = 0; i + 1 < PROFILE.length; i++) {
    const a = PROFILE[i], b = PROFILE[i + 1]
    if (s <= b[0]) { const t = Math.max(0, (s - a[0]) / (b[0] - a[0])); return a[k] + (b[k] - a[k]) * t }
  }
  return PROFILE[PROFILE.length - 1][k]
}
// y = 0 is the deepest pier foot: the lowest lidar ground under the bridge less SINK
const Z0 = Math.min(...PROFILE.filter(([s]) => s >= 44).map((r) => r[2])) - SINK
const walk = (s: number) => interp(s, 1) - Z0, ground = (s: number) => interp(s, 2) - Z0

// The line: the OSM footway nodes in this frame, with their s along the ways.
const LINE: [number, number, number][] = [[-245.0, 39.0, 0], [-187.6, 10.8, 64.0], [-171.6, 2.3, 82.1], [-39.2, 2.3, 214.5], [-32.5, 2.3, 221.2], [79.4, -0.4, 333.1], [140.8, -1.1, 394.5], [189.2, -1.6, 442.9]]
const at = (s: number): XY => {
  for (let i = 0; i + 1 < LINE.length; i++) {
    const a = LINE[i], b = LINE[i + 1]
    if (s <= b[2]) { const t = (s - a[2]) / (b[2] - a[2]); return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t - OY] }
  }
  const e = LINE[LINE.length - 1]; return [e[0], e[1] - OY]
}
const dir = (s: number): XY => { const a = at(s - 0.5), b = at(s + 0.5), l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / l, (b[1] - a[1]) / l] }

const S0 = 44, S1 = 442.5 // the landings
const T1 = [221.1, 291.1], T2 = [292.1, 330.1] // the trusses, in s (lidar: bottom chords x -32.6..37.4 and 38.4..76.4)
const inTruss = (s: number) => (s >= T1[0] && s <= T1[1]) || (s >= T2[0] && s <= T2[1])

// ---- the deck structure: a slab 0.3 m under the walkway, girders under it, parapets ----
{
  const step = 4
  for (let s = S0; s < S1 - 1e-6; s += step) {
    const s1 = Math.min(S1, s + step), w0 = inTruss(s + 0.1) ? 4.2 : 3.3, w1 = inTruss(s1 - 0.1) ? 4.2 : 3.3
    const p0 = at(s), p1 = at(s1), d0 = dir(s), d1 = dir(s1)
    const n0: XY = [-d0[1], d0[0]], n1: XY = [-d1[1], d1[0]]
    const zt0 = walk(s) - 0.3, zt1 = walk(s1) - 0.3, depth = 1.1
    const L = (p: XY, n: XY, w: number, z: number): V3 => [p[0] + n[0] * w, p[1] + n[1] * w, z]
    // top, both sides, underside
    slab.quad(L(p0, n0, -w0, zt0), L(p1, n1, -w1, zt1), L(p1, n1, w1, zt1), L(p0, n0, w0, zt0))
    concrete.quad(L(p0, n0, -w0, zt0 - depth), L(p1, n1, -w1, zt1 - depth), L(p1, n1, -w1, zt1), L(p0, n0, -w0, zt0))
    concrete.quad(L(p1, n1, w1, zt1 - depth), L(p0, n0, w0, zt0 - depth), L(p0, n0, w0, zt0), L(p1, n1, w1, zt1))
    concrete.quad(L(p0, n0, w0, zt0 - depth), L(p1, n1, w1, zt1 - depth), L(p1, n1, -w1, zt1 - depth), L(p0, n0, -w0, zt0 - depth))
    // low parapets on the approaches (the railing drawn as a solid band, dark)
    if (!inTruss(s + 0.1) && !inTruss(s1 - 0.1)) for (const sg of [-1, 1]) {
      const wa = sg * (w0 - 0.1), wb = sg * (w1 - 0.1)
      const q = [L(p0, n0, wa, zt0 + 0.3), L(p1, n1, wb, zt1 + 0.3), L(p1, n1, wb, zt1 + 1.4), L(p0, n0, wa, zt0 + 1.4)]
      if (sg > 0) iron.quad(q[0], q[1], q[2], q[3]); else iron.quad(q[1], q[0], q[3], q[2])
    }
  }
  // end faces at the landings, down to the ground
  for (const [s, sg] of [[S0, -1], [S1, 1]] as [number, number][]) {
    const p = at(s), d = dir(s), n: XY = [-d[1], d[0]], zt = walk(s) - 0.3, zb = Math.max(0, Math.min(ground(s) - SINK, zt - 1.1))
    const L = (w: number, z: number): V3 => [p[0] + n[0] * w, p[1] + n[1] * w, z]
    if (sg > 0) concrete.quad(L(3.3, zb), L(-3.3, zb), L(-3.3, zt), L(3.3, zt)); else concrete.quad(L(-3.3, zb), L(3.3, zb), L(3.3, zt), L(-3.3, zt))
  }
}

// ---- pier bents under the approaches, piers at the truss ends ----
function bent(s: number, wide: boolean) {
  const p = at(s), d = dir(s), n: XY = [-d[1], d[0]], zt = walk(s) - 1.4, zg = Math.max(0, ground(s) - SINK)
  if (zt - zg < 0.6) return
  if (wide) {
    // a solid pier wall across the deck, with a cap
    const ring = (w: number, t: number): XY[] => [[p[0] - d[0] * t - n[0] * w, p[1] - d[1] * t - n[1] * w], [p[0] + d[0] * t - n[0] * w, p[1] + d[1] * t - n[1] * w], [p[0] + d[0] * t + n[0] * w, p[1] + d[1] * t + n[1] * w], [p[0] - d[0] * t + n[0] * w, p[1] - d[1] * t + n[1] * w]]
    const r = ring(4.6, 1.0), c = ring(4.9, 1.3)
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; concrete.quad([...r[i], zg], [...r[j], zg], [...r[j], zt - 0.6], [...r[i], zt - 0.6]) }
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; concrete.quad([...c[i], zt - 0.6], [...c[j], zt - 0.6], [...c[j], zt], [...c[i], zt]) }
    concrete.quad([...c[0], zt], [...c[1], zt], [...c[2], zt], [...c[3], zt])
    return
  }
  for (const w of [-2.3, 2.3]) {
    const c: V3 = [p[0] + n[0] * w, p[1] + n[1] * w, 0]
    block(concrete, c[0] - 0.4, c[0] + 0.4, c[1] - 0.4, c[1] + 0.4, zg, zt, 0.05)
  }
  beam(concrete, [p[0] - n[0] * 3.1, p[1] - n[1] * 3.1, zt - 0.4], [p[0] + n[0] * 3.1, p[1] + n[1] * 3.1, zt - 0.4], 0.9, 0.8)
}
for (const s of [52, 66, 82, 95, 108, 121, 134, 147, 160, 173, 186, 199, 212]) bent(s, false) // one at the bend (s 82)
for (const s of [T1[0], (T1[1] + T2[0]) / 2, T2[1]]) bent(s, true)
for (let s = T2[1] + 13; s < S1 - 6; s += 13) bent(s, false)

// ---- the trusses ----
function truss(sa: number, sb: number, panels: number, hTop: number, half = 3.75) {
  const L = sb - sa, pl = L / panels
  const P = (s: number, side: number, up: number): V3 => {
    const p = at(s), d = dir(s), n: XY = [-d[1], d[0]]
    return [p[0] + n[0] * side * half, p[1] + n[1] * side * half, walk(s) - 0.4 + up]
  }
  for (const side of [-1, 1]) {
    // bottom chord, top chord (between the first and last panel points), end posts
    beam(iron, P(sa, side, 0), P(sb, side, 0), 0.5, 0.6)
    beam(iron, P(sa + pl, side, hTop), P(sb - pl, side, hTop), 0.6, 0.55)
    beam(iron, P(sa, side, 0), P(sa + pl, side, hTop), 0.6, 0.55)
    beam(iron, P(sb, side, 0), P(sb - pl, side, hTop), 0.6, 0.55)
    for (let k = 1; k < panels; k++) {
      const s = sa + pl * k
      beam(iron, P(s, side, 0), P(s, side, hTop), 0.35, 0.35) // posts
      // Whipple diagonals: each runs down two panels towards the middle
      const mid = (sa + sb) / 2
      const s2 = s < mid ? s + 2 * pl : s - 2 * pl
      if (s2 > sa + 0.1 && s2 < sb - 0.1 && k !== Math.round(panels / 2)) beam(iron, P(s, side, hTop), P(s2, side, 0), 0.28, 0.28)
    }
  }
  // the portals and the top lateral struts, with a lamp under each
  for (let k = 1; k < panels; k++) {
    const s = sa + pl * k
    beam(iron, P(s, -1, hTop), P(s, 1, hTop), 0.45, 0.4)
    if (k === 1 || k === panels - 1) beam(iron, P(s, -1, hTop - 1.4), P(s, 1, hTop - 1.4), 0.4, 0.5) // the portal's lattice strut
    if (k % 2 === 1) {
      const q = P(s, 0, hTop - 1.2)
      beam(lamp, [q[0], q[1], q[2] - 0.25], [q[0], q[1], q[2] + 0.25], 0.5, 0.5)
    }
  }
  // floor beams under the deck at each panel point
  for (let k = 0; k <= panels; k++) beam(iron, P(sa + pl * k, -1, -0.6), P(sa + pl * k, 1, -0.6), 0.4, 0.6)
}
truss(T1[0], T1[1], 11, 9.7)
truss(T2[0], T2[1], 7, 8.0)

// ---------------------------------------------------------------------------
const parts = [
  { part: iron, material: finish('hays-wrought-iron', 0x86594a) },
  { part: concrete, material: finish('hays-concrete', 0xcdc8bd) },
  { part: slab, material: finish('hays-deck', 0xb4ab9d) },
  { part: lamp, material: finish('lamp-pendant', 0x4a4f57) },
]
const glb = writeGlb('Hays Street Bridge', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, anchor: [29.430209, -98.4775],
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: [],
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report('Hays Street Bridge', parts, glb, 6500)
const out = new URL('../models/sat-hays-street-bridge.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
