/**
 * The Carillon, Charlotte (1991, Murphy/Jahn with LS3P) — original
 * procedural geometry, CC0-1.0.
 * bun generators/carillon-charlotte.ts
 *
 * Map frame turned to the building: x runs south-east along West Trade
 * Street's cross streets, y north-east towards Trade, z up, metres. Anchor
 * 35.2285233,-80.8453018 (the centroid of OSM way/90480703); bearing 49.5°,
 * elevation 0.
 *
 * Plan: OSM's outline, an L 39.5 × 54.3 m with the plaza corner cut out on
 * Trade. Above an 18 m podium, a central gabled spine (x −7…8) runs the full
 * depth between two flat-topped wings.
 *
 * Heights (lidar, Mecklenburg 2016, USGS 3DEP NC Phase 4, 1 m; y = 0 is the
 * street, ~3.5 m above the box's lowest return; the lidar grid sits ~1.5 m
 * east and ~1.2 m north of OSM's outline and is shifted onto it):
 * - wings: flat roofs at 94 m; a one-floor-lower band (90.5 m) across both
 *   wing ends. The north-west wing runs on towards Trade and steps down
 *   there, to 87.5 m and then 82.5 m.
 * - spine: eaves 100.5 m, ridge 109.5 m (a ~50° gable along y).
 * - two needle spires on the ridge, both reaching 121.5 m: one on the Trade
 *   gable's apex, one ~10 m behind it on a stone rib across the roof.
 *   Published: 394 ft (120 m), 24 floors. OSM's height=130 is too high.
 * - a shallow curved glass bay on both gable ends, from the podium to
 *   ~90 m, topped by curved stone balconies (lidar shows both).
 *
 * What makes it recognisable, each drawn as plain geometry: the steep
 * standing-seam gable roof between flat wings; the stone-framed gable ends,
 * whose frames rise 2.5 m above the ridge to a steeper point, each holding a
 * tall pointed (lancet) window of darker glass in a pale frame; the two slim spires; the
 * full-height curved glass bay on Trade.
 *
 * Colours. The granite is a warm tan-pink. The roof is pale green-grey
 * patinated metal in every daylight photo (it only looks copper-red at
 * sunset), so it is a pale patina finish, not red-brown. Punched windows are
 * blue-grey reflective glass, a step lighter than slate; the bay and lancets
 * read lighter still. Windows are one panel per 6 m bay and three floors
 * (two floors still shimmered at 80 px).
 *
 * Estimated: the bay's projection and width (lidar, coarse), the lancet's
 * proportions and the spire piers (photos), floor height 3.9 m.
 *
 * Photos: Carillon_Tower_Charlotte.jpg (City Dweller 2, CC BY-SA 4.0,
 * Commons; the Trade bay); Carillon_Tower_cropped.jpg (James Willamor,
 * CC BY-SA 2.0, Commons); Carillon_Tower_and_TradeMark.jpg (Andrew Simpson,
 * CC BY 2.0, Commons); Flickr 2946927349 and 2946926759 (James Willamor,
 * CC BY-SA 2.0; the crown, roof colour and spires in daylight). No commercial
 * imagery or 3D tiles were used.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]
const granite = new Part(), windows = new Part(), bayGlass = new Part(), trim = new Part()
const terraces = new Part(), crown = new Part()

const FLOOR = 3.9, GROUP = 3 * FLOOR, LIFT = .04, BEV = .45
const PODIUM = 18
const S0 = -7, S1 = 8, SC = (S0 + S1) / 2
const Y0 = -25.9, Y1 = 28.4
const EAVE = 100.5, RIDGE = 109.5, SPIRE = 121.5
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return v.map(n => n / l) as V3 }

type Box = { x0: number; x1: number; y0: number; y1: number; z0: number; z1: number }
const boxes: Box[] = []
/** True if a point is buried inside another block (so no panel goes there). */
const buried = (x: number, y: number, z: number, self: Box) => boxes.some(b => b !== self &&
  x > b.x0 + .01 && x < b.x1 - .01 && y > b.y0 + .01 && y < b.y1 - .01 && z < b.z1 - .01 && z > b.z0 - .01)

/** A block with bevelled vertical corners and a flat roof. */
function block(b: Box, roof: Part = terraces) {
  boxes.push(b)
  const { x0, x1, y0, y1, z0, z1 } = b
  const r = BEV
  // Each corner contributes the point before it (on the incoming edge) and
  // after it (on the outgoing edge); the bevel between them is smooth-shaded.
  const pts: XY[] = [], nrm: V3[] = []
  const C: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  const N: V3[] = [[0, -1, 0], [1, 0, 0], [0, 1, 0], [-1, 0, 0]] // edge i: C[i]→C[i+1]
  for (let i = 0; i < 4; i++) {
    const c = C[i], prev = N[(i + 3) % 4], next = N[i]
    const din: XY = [-prev[1], prev[0]] // direction of the incoming edge (CCW)
    const dout: XY = [-next[1], next[0]]
    pts.push([c[0] - din[0] * r, c[1] - din[1] * r]); nrm.push(prev)
    pts.push([c[0] + dout[0] * r, c[1] + dout[1] * r]); nrm.push(next)
  }
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length, a = pts[i], c = pts[j]
    // edges at even i are the bevels (corner point pairs), odd i the faces
    const n0 = i % 2 === 0 ? unit([nrm[i][0] * 2 + nrm[j][0], nrm[i][1] * 2 + nrm[j][1], 0]) : nrm[i]
    const n1 = i % 2 === 0 ? unit([nrm[i][0] + nrm[j][0] * 2, nrm[i][1] + nrm[j][1] * 2, 0]) : nrm[j]
    granite.tri([a[0], a[1], z0], [c[0], c[1], z0], [c[0], c[1], z1], undefined, undefined, undefined, [n0, n1, n1])
    granite.tri([a[0], a[1], z0], [c[0], c[1], z1], [a[0], a[1], z1], undefined, undefined, undefined, [n0, n1, n0])
  }
  for (let i = 1; i < pts.length - 1; i++) roof.tri([pts[0][0], pts[0][1], z1], [pts[i][0], pts[i][1], z1], [pts[i + 1][0], pts[i + 1][1], z1])
}

/**
 * Window panels on a block's four faces from zb to zt: one per ~6 m bay and
 * two floors, granite between; none where another block covers the wall.
 */
function panels(b: Box, zb: number, zt: number, skip: (face: number, s: number) => boolean = () => false) {
  const groups = Math.max(1, Math.round((zt - zb) / GROUP)), step = (zt - zb) / groups
  const faces: [XY, XY, XY][] = [
    [[b.x0, b.y0], [b.x1, b.y0], [0, -1]], [[b.x1, b.y0], [b.x1, b.y1], [1, 0]],
    [[b.x1, b.y1], [b.x0, b.y1], [0, 1]], [[b.x0, b.y1], [b.x0, b.y0], [-1, 0]],
  ]
  faces.forEach(([a, c, n], f) => {
    const L = Math.hypot(c[0] - a[0], c[1] - a[1]), d: XY = [(c[0] - a[0]) / L, (c[1] - a[1]) / L]
    const count = Math.max(1, Math.round((L - 2) / 6)), sp = (L - 2) / count, w = sp * .62
    const P = (s: number, z: number): V3 => [a[0] + d[0] * s + n[0] * LIFT, a[1] + d[1] * s + n[1] * LIFT, z]
    for (let g = 0; g < groups; g++) {
      const za = zb + g * step + .9, zc = zb + (g + 1) * step - .9
      if (zc - za < 2.5) continue
      for (let k = 0; k < count; k++) {
        const s = 1 + sp * (k + .5)
        const px = a[0] + d[0] * s - n[0] * .3, py = a[1] + d[1] * s - n[1] * .3
        if (skip(f, s) || buried(px + n[0] * .6, py + n[1] * .6, (za + zc) / 2, b)) continue
        windows.quad(P(s - w / 2, za), P(s + w / 2, za), P(s + w / 2, zc), P(s - w / 2, zc))
      }
    }
  })
}

// ---------------------------------------------------------------- podium
// The L outline as two blocks: the full-width body and the north-west arm
// that runs on to Trade beside the plaza.
const podA: Box = { x0: -19, x1: 20.5, y0: Y0, y1: 19.2, z0: 0, z1: PODIUM }
const podB: Box = { x0: -19, x1: 8, y0: 19.2 - .5, y1: Y1, z0: 0, z1: PODIUM }
block(podA); block(podB)
// Tall storefront glass between granite piers, then one window group.
for (const b of [podA, podB]) {
  const faces: [XY, XY, XY][] = [
    [[b.x0, b.y0], [b.x1, b.y0], [0, -1]], [[b.x1, b.y0], [b.x1, b.y1], [1, 0]],
    [[b.x1, b.y1], [b.x0, b.y1], [0, 1]], [[b.x0, b.y1], [b.x0, b.y0], [-1, 0]],
  ]
  for (const [a, c, n] of faces) {
    const L = Math.hypot(c[0] - a[0], c[1] - a[1]), d: XY = [(c[0] - a[0]) / L, (c[1] - a[1]) / L]
    const count = Math.max(1, Math.round((L - 2) / 6)), sp = (L - 2) / count, w = sp * .72
    for (let k = 0; k < count; k++) {
      const s = 1 + sp * (k + .5)
      const mx = a[0] + d[0] * s + n[0] * .5, my = a[1] + d[1] * s + n[1] * .5
      // skip the faces where the two podium blocks meet
      if (boxes.some(o => o !== b && mx > o.x0 && mx < o.x1 && my > o.y0 && my < o.y1)) continue
      const P = (q: number, z: number): V3 => [a[0] + d[0] * q + n[0] * LIFT, a[1] + d[1] * q + n[1] * LIFT, z]
      bayGlass.quad(P(s - w / 2, .6), P(s + w / 2, .6), P(s + w / 2, 8.5), P(s - w / 2, 8.5))
      windows.quad(P(s - w * .43, 10.2), P(s + w * .43, 10.2), P(s + w * .43, 16.4), P(s - w * .43, 16.4))
    }
  }
}

// ---------------------------------------------------------------- wings
const wingTops = (x0: number, x1: number, yEnd: number, steps: [number, number][]) => {
  // the main block and its end bands / steps, each a block from the podium
  const out: Box[] = []
  const main: Box = { x0, x1, y0: Y0 + 2.5, y1: 15.5, z0: PODIUM, z1: 94 }
  out.push(main, { x0, x1, y0: Y0, y1: Y0 + 2.5 + .3, z0: PODIUM, z1: 90.5 })
  let y = 15.5 - .3
  for (const [yy, z] of steps) { out.push({ x0, x1, y0: y, y1: Math.min(yy, yEnd), z0: PODIUM, z1: z }); y = Math.min(yy, yEnd) - .3 }
  return out
}
const wingNW = wingTops(-19, S0 + .5, Y1, [[19.2, 90.5], [22.5, 87.5], [Y1, 82.5]])
const wingSE = wingTops(S1 - .5, 20.5, 19.2, [[19.2, 90.5]])
const spine: Box = { x0: S0, x1: S1, y0: Y0, y1: Y1, z0: PODIUM, z1: EAVE }
for (const b of [...wingNW, ...wingSE, spine]) block(b)
for (const b of [...wingNW, ...wingSE]) panels(b, PODIUM, b.z1 - .6)
// The spine's flanks above the wings; its gable ends are the bays and lancets.
panels(spine, PODIUM, EAVE - .6, (f, s) => (f === 0 || f === 2) && Math.abs(s - (S1 - S0) / 2) < 6.5)
// Pale copings round every roof.
for (const b of [...wingNW, ...wingSE, podA, podB]) {
  const q = (x: number, y: number, z: number): V3 => [x, y, z]
  const { x0, x1, y0, y1, z1 } = b, e = .35
  trim.quad(q(x0 - .02, y0 - .02, z1 - e), q(x1 + .02, y0 - .02, z1 - e), q(x1 + .02, y0 - .02, z1), q(x0 - .02, y0 - .02, z1))
  trim.quad(q(x1 + .02, y0 - .02, z1 - e), q(x1 + .02, y1 + .02, z1 - e), q(x1 + .02, y1 + .02, z1), q(x1 + .02, y0 - .02, z1))
  trim.quad(q(x1 + .02, y1 + .02, z1 - e), q(x0 - .02, y1 + .02, z1 - e), q(x0 - .02, y1 + .02, z1), q(x1 + .02, y1 + .02, z1))
  trim.quad(q(x0 - .02, y1 + .02, z1 - e), q(x0 - .02, y0 - .02, z1 - e), q(x0 - .02, y0 - .02, z1), q(x0 - .02, y1 + .02, z1))
}

// ---------------------------------------------------------------- bays
// A shallow curved glass bay on each gable end, podium to 90 m, with stone
// bands every two floors and two curved stone balconies at the top.
const BAY_HALF = 5, BAY_OUT = 2.6, BAY_TOP = 90
const bayR = (BAY_HALF ** 2 + BAY_OUT ** 2) / (2 * BAY_OUT)
function bay(end: 1 | -1) {
  const yF = end > 0 ? Y1 : Y0
  const cy = yF - end * (bayR - BAY_OUT)
  const a0 = Math.asin((bayR - BAY_OUT) / bayR)
  const n = 10
  const arc = (r: number): [XY, V3][] => Array.from({ length: n + 1 }, (_, k) => {
    const t = a0 + (Math.PI - 2 * a0) * k / n
    const c = Math.cos(t), s = Math.sin(t)
    return [[SC + r * c, cy + end * r * s], [c, end * s, 0]]
  })
  const band = (p: Part, r: number, z0: number, z1: number, cap = false) => {
    const A = arc(r)
    for (let k = 0; k < n; k++) {
      let [[pa, na], [pb, nb]] = [A[k], A[k + 1]]
      if (end < 0) [[pa, na], [pb, nb]] = [[pb, nb], [pa, na]]
      p.tri([pa[0], pa[1], z0], [pb[0], pb[1], z0], [pb[0], pb[1], z1], undefined, undefined, undefined, [na, nb, nb])
      p.tri([pa[0], pa[1], z0], [pb[0], pb[1], z1], [pa[0], pa[1], z1], undefined, undefined, undefined, [na, nb, na])
    }
    if (cap) {
      const mid: V3 = [SC, yF, z1]
      for (let k = 0; k < n; k++) {
        const pa = A[k][0], pb = A[k + 1][0]
        if (end > 0) p.tri(mid, [pb[0], pb[1], z1], [pa[0], pa[1], z1]); else p.tri(mid, [pa[0], pa[1], z1], [pb[0], pb[1], z1])
      }
    }
  }
  band(bayGlass, bayR, PODIUM, BAY_TOP)
  for (let z = PODIUM + GROUP; z < BAY_TOP - 8; z += GROUP) band(trim, bayR + .05, z - .35, z + .35)
  band(granite, bayR + .3, BAY_TOP - 6, BAY_TOP - 4.6, true)
  band(granite, bayR + .3, BAY_TOP - .4, BAY_TOP + 1, true)
}
bay(1); bay(-1)

// ---------------------------------------------------------------- crown
// The steep gable roof, raked stone frames on both gable ends, a lancet
// window in each gable, and a stone rib with the second spire.
{
  const xL = S0 - .3, xR = S1 + .3, zE = EAVE - .3
  const nL = unit([-(RIDGE - zE), 0, SC - xL]), nR = unit([RIDGE - zE, 0, xR - SC])
  const y0 = Y0 + .6, y1 = Y1 - .6
  crown.tri([xL, y1, zE], [xL, y0, zE], [SC, y0, RIDGE], undefined, undefined, undefined, [nL, nL, nL])
  crown.tri([xL, y1, zE], [SC, y0, RIDGE], [SC, y1, RIDGE], undefined, undefined, undefined, [nL, nL, nL])
  crown.tri([xR, y0, zE], [xR, y1, zE], [SC, y1, RIDGE], undefined, undefined, undefined, [nR, nR, nR])
  crown.tri([xR, y0, zE], [SC, y1, RIDGE], [SC, y0, RIDGE], undefined, undefined, undefined, [nR, nR, nR])
  // gable walls + raked frames standing 0.8 m proud of the roof
  const frame = (y: number, out: 1 | -1, t: number) => {
    const ya = y, yb = y - out * t
    const F = (x: number, z: number, yy: number): V3 => [x, yy, z]
    const lift = .8
    // outer (gable) face triangle up to the frame's top
    const zt = RIDGE + 2.5 // the gable frame stands above the roof: a steeper, taller point
    const tri = (p: Part, a: V3, b: V3, c: V3) => out > 0 ? p.tri(a, b, c) : p.tri(b, a, c)
    tri(granite, F(S1, EAVE, ya), F(S0, EAVE, ya), F(SC, EAVE, ya))
    tri(granite, F(S1 + .3, EAVE, ya), F(S0 - .3, EAVE, ya), F(SC, zt, ya))
    // the frame's top surfaces (two rakes), from the gable face back t metres
    for (const side of [-1, 1]) {
      const xe = side < 0 ? S0 - .3 : S1 + .3
      const o: V3 = F(xe, EAVE, ya), p: V3 = F(SC, zt, ya), q: V3 = F(SC, zt, yb), r: V3 = F(xe, EAVE, yb)
      if ((side < 0) === (out > 0)) { granite.quad(o, p, q, r) } else { granite.quad(r, q, p, o) }
      // the frame's inner cheek, down to the roof surface
      const zi = (x: number) => zE + (RIDGE - zE) * (1 - Math.abs(x - SC) / (SC - xL))
      const c0: V3 = F(xe, EAVE, yb), c1: V3 = F(SC, zt, yb), c2: V3 = F(SC, zi(SC), yb)
      if ((side < 0) === (out > 0)) granite.tri(c0, c2, c1); else granite.tri(c0, c1, c2)
    }
    // The lancet: a tall pointed window of darker glass in a pale frame,
    // from the balconies to just under the frame's point.
    const lancet = (p: Part, d: number, hw: number, zb: number, zs: number, zp: number) => {
      const g = ya + out * d
      const G = (x: number, z: number): V3 => [x, g, z]
      const q = (a: V3, b: V3, c: V3, e: V3) => out > 0 ? p.quad(b, a, e, c) : p.quad(a, b, c, e)
      q(G(SC - hw, zb), G(SC + hw, zb), G(SC + hw, zs), G(SC - hw, zs))
      const head = 5
      for (let k = 0; k < head; k++) {
        const f = (t: number) => Math.sin(t * Math.PI / 2)
        const t0 = k / head, t1 = (k + 1) / head
        const zA = zs + (zp - zs) * f(t0), zB = zs + (zp - zs) * f(t1)
        const xA = hw * (1 - t0 * t0), xB = hw * (1 - t1 * t1)
        q(G(SC - xA, zA), G(SC + xA, zA), G(SC + xB, zB), G(SC - xB, zB))
      }
    }
    lancet(trim, LIFT * .5, 3.9, BAY_TOP + 1, EAVE - .5, RIDGE + 1.6)
    lancet(windows, LIFT, 3.1, BAY_TOP + 1.6, EAVE - .5, RIDGE + .6)
  }
  frame(Y1, 1, 1.4)
  frame(Y0, -1, 1.4)
}

/** A square stone pier with a pyramid cap and a slim pale needle. */
function spire(y: number) {
  const h = 1.3, z0 = RIDGE - 3, z1 = RIDGE + 4.5, zc = RIDGE + 6
  const ring = (r: number, z: number): V3[] => [[SC - r, y - r, z], [SC + r, y - r, z], [SC + r, y + r, z], [SC - r, y + r, z]]
  const lo = ring(h, z0), hi = ring(h, z1)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    granite.quad(lo[i], lo[j], hi[j], hi[i])
    granite.tri(hi[i], hi[j], [SC, y, zc])
  }
  const n0 = ring(.7, zc - .6), apex: V3 = [SC, y, SPIRE]
  for (let i = 0; i < 4; i++) trim.tri(n0[i], n0[(i + 1) % 4], apex)
}
spire(Y1 - 1.1)
spire(17.8)
// The stone rib across the roof under the second spire.
{
  const y = 17.8, t = .7, lift = .7, xL = S0 - .3, xR = S1 + .3
  const zr = (x: number) => EAVE - .3 + (RIDGE - EAVE + .3) * (1 - Math.abs(x - SC) / (SC - xL)) + lift
  for (const side of [-1, 1]) {
    const xe = side < 0 ? xL : xR
    const A: V3 = [xe, y - t, EAVE - .3], B: V3 = [SC, y - t, zr(SC)], C: V3 = [SC, y + t, zr(SC)], D: V3 = [xe, y + t, EAVE - .3]
    if (side < 0) granite.quad(A, B, C, D); else granite.quad(D, C, B, A)
    // the rib's two faces
    const B0: V3 = [SC, y - t, EAVE - .3], C0: V3 = [SC, y + t, EAVE - .3]
    if (side < 0) { granite.tri(A, B0, B); granite.tri(D, C, C0) } else { granite.tri(A, B, B0); granite.tri(D, C0, C) }
  }
}

// ---------------------------------------------------------------- write
const parts = [
  { part: granite, material: finish('carillon-granite', 0xe4cfc0) },
  // Punched windows: blue-grey reflective glass, a step lighter than slate.
  { part: windows, material: { ...PALETTE.window, color: 0x768c9f } },
  // The curved bays, lancets and storefronts read lighter.
  { part: bayGlass, material: windowVariant(2, 0xa3bacb) },
  { part: trim, material: PALETTE.trim },
  { part: terraces, material: PALETTE.roof },
  // Pale green-grey patinated standing-seam roof, as in daylight photos.
  { part: crown, material: finish('carillon-roof', 0xaabdb3) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('The Carillon', parts, {
  license: 'CC0-1.0', bearing: 49.5, elevation: 0, anchor: [35.2285233, -80.8453018], height: SPIRE,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/90480703'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/carillon-charlotte.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
