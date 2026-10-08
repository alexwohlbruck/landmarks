/**
 * Petersen Automotive Museum (Welton Becket 1962; facade Kohn Pedersen Fox
 * 2015), 6060 Wilshire Blvd at Fairfax, Los Angeles — original procedural
 * geometry, CC0-1.0.
 * bun generators/la-petersen.ts [out.glb]
 *
 * Map frame before placement: u along the Wilshire (north) face, v toward
 * it, z up, metres; origin at the area centroid of OSM way/913343446
 * (-118.3611471, 34.0623791), on the ground. Placed at bearing 7.8°, the
 * Wilshire face's rotation in OSM.
 *
 * A windowless red box wrapped on its Wilshire, Fairfax and east faces by
 * flowing stainless-steel ribbons that lift off the wall at the top and
 * sweep back over the roof as a canopy. The ribbons' sweep over the red is
 * the identity; they are drawn as broad bold bands (1.9 m), not lines.
 *
 * Sources:
 * - Plan: OSM way/913343446 (5,146 m2), rotated into the frame: the
 *   ribboned north block is u -24…33, v -6…43; the parking block behind it
 *   to the south. The outline is drawn to the ribbons, so the red wall sits
 *   1.3 m inside it.
 * - Heights: LA County lidar DSM (LARIAC, 2.5 m grid, sampled 2026): ground
 *   ~50.4 m; red box roof 18–20 m; ribbon crests over the roof 22–27 m,
 *   highest along the north and south edges of the north block; the
 *   parking block 13 m. OSM: height 27.8.
 * - Published (Wikipedia): ribbons of 100 tons of type 304 stainless steel in
 *   308 sections; the 1962 department store was "largely windowless".
 * - Photos (Wikimedia Commons): p1 "Petersen Automotive Museum.jpg" (David
 *   Zaitz, CC BY-SA 4.0; the Wilshire face and the Fairfax corner, from the
 *   north-west, ribbons arching over the roof); p2 "Petersen Automotive
 *   Museum (26687517802)" (Steve Ginn, CC0; the Wilshire face from the
 *   north-east); p5 "Fairfax and Wilshire, LA 2021" (Downtowngal, CC BY-SA
 *   4.0; the Fairfax face from the south); p8 "Petersen Automotive Museum
 *   Landscape Photo by Socialbilitty" (CC BY-SA 2.0; north-west at dusk).
 * - Overhead: USGS NAIP (public domain): the ribbon canopy over the north
 *   strip and the Fairfax strip of the roof; plain roof elsewhere.
 *
 * Estimated: the ribbons' waves (7 bands on the walls, a wave of ~30 m and
 * up to 2 m amplitude, read off p1 and p2; the real 308 sections are more
 * varied), the canopy (six L-shaped bands following the north-west corner,
 * from NAIP and the DSM crests), the red (photo hue, pulled to palette
 * lightness), the ground-floor glazing on Wilshire.
 * Left out: the screws and the ribbons' twists, the roof mechanical units,
 * the parking ramps.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, block, capRing, ccw, type XY } from './la-lacma-geffen'

const red = new Part(), steel = new Part(), roof = new Part(), deck = new Part(), glass = new Part()

// north block (red box), inset from the ribbon line
const U0 = -24.2, U1 = 33.4, V0 = -6.5, V1 = 42.8, IN = 1.3
const ROOF = 18.5, DECK = 12.8, TOP = 26.0

// the two street corners are rounded, concentric with the ribbons
{
  const R = 6 - IN, ring: XY[] = [[U0 + IN, V0], [U1 - IN, V0]]
  for (let i = 0; i <= 4; i++) { const t = (i / 4) * Math.PI / 2; ring.push([U1 - IN - R + R * Math.cos(t), V1 - IN - R + R * Math.sin(t)]) }
  for (let i = 0; i <= 4; i++) { const t = Math.PI / 2 + (i / 4) * Math.PI / 2; ring.push([U0 + IN + R + R * Math.cos(t), V1 - IN - R + R * Math.sin(t)]) }
  block(red, roof, ring, 0, ROOF, 0.5)
}

// the parking block behind, from the OSM outline south of the north block
const SOUTH: XY[] = [[-24.3, -6.3], [-37.8, -6.2], [-43.4, -26.5], [-41.8, -27.1], [-12.3, -35.3], [-13.4, -39.0], [23.8, -49.1], [25.0, -44.6], [32.6, -17.0], [32.6, -6.9]]
block(deck, roof, ccw(SOUTH), 0, DECK, 0.4)

// ---------- the ribbon path round the west, north and east faces ----------
// A rounded-corner polyline on the outline: up the Fairfax face, along
// Wilshire, down the east face. s is the distance along it.
function ribbonPath(off: number, r: number, step: number): { p: XY; n: XY; s: number }[] {
  const a: XY = [U0 + off, V0], b: XY = [U0 + off, V1 - off], c: XY = [U1 - off, V1 - off], d: XY = [U1 - off, V0]
  const pts: XY[] = []
  const line = (p: XY, q: XY) => {
    const L = Math.hypot(q[0] - p[0], q[1] - p[1]), n = Math.max(1, Math.round(L / step))
    for (let i = 0; i < n; i++) pts.push([p[0] + (q[0] - p[0]) * i / n, p[1] + (q[1] - p[1]) * i / n])
  }
  const arc = (cx: number, cy: number, t0: number, t1: number) => {
    for (let i = 0; i < 4; i++) { const t = t0 + (t1 - t0) * i / 4; pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]) }
  }
  line(a, [b[0], b[1] - r]); arc(b[0] + r, b[1] - r, Math.PI, Math.PI / 2)
  line([b[0] + r, b[1]], [c[0] - r, c[1]]); arc(c[0] - r, c[1] - r, Math.PI / 2, 0)
  line([c[0], c[1] - r], d); pts.push(d)
  let s = 0
  return pts.map((p, i) => {
    if (i > 0) s += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1])
    const q = pts[Math.min(i + 1, pts.length - 1)], o = pts[Math.max(i - 1, 0)]
    const t: XY = [q[0] - o[0], q[1] - o[1]], L = Math.hypot(t[0], t[1])
    return { p, n: [-t[1] / L, t[0] / L] as XY, s } // n points outward (path runs clockwise)
  })
}

/** A vertical band along the path, centre height c(s), width w, both faces. */
function wallBand(path: { p: XY; n: XY; s: number }[], c: (s: number) => number, w: number, out = 0) {
  for (let i = 0; i < path.length - 1; i++) {
    const A = path[i], B = path[i + 1]
    const pa: XY = [A.p[0] + A.n[0] * out, A.p[1] + A.n[1] * out], pb: XY = [B.p[0] + B.n[0] * out, B.p[1] + B.n[1] * out]
    const a0: V3 = [pa[0], pa[1], c(A.s) - w / 2], a1: V3 = [pa[0], pa[1], c(A.s) + w / 2]
    const b0: V3 = [pb[0], pb[1], c(B.s) - w / 2], b1: V3 = [pb[0], pb[1], c(B.s) + w / 2]
    // outward face, then the inner face
    steel.quad(b0, a0, a1, b1)
    steel.quad(a0, b0, b1, a1)
  }
}

const path = ribbonPath(0, 6, 2.4)
const total = path[path.length - 1].s
// Seven bands from 2.4 m to the top. They wave together (small phase lag
// from band to band, so they never cross), more strongly toward the
// north-west corner, as in p1; the top band rides over the parapet.
const N = 7, W = 2.1, LO = 2.8, HI = ROOF + 0.4
for (let k = 0; k < N; k++) {
  const base = LO + (HI - LO) * k / (N - 1)
  const c = (s: number) => {
    const corner = Math.exp(-(((s - 49) / 35) ** 2))           // the Fairfax/Wilshire corner
    const amp = (1.0 + 2.2 * corner) * Math.min(1, 0.45 + k * 0.18)
    // the top two bands hump up over both street corners (p1, p2)
    const lift = k >= N - 2 ? (k === N - 1 ? 4.5 : 2.5) * Math.max(0, Math.sin(2 * Math.PI * s / 60 - 3.56)) : 0
    return Math.max(W / 2 + 0.6, base + amp * Math.sin(2 * Math.PI * s / 32 + 0.4 * k) + lift)
  }
  // each band a little further out, so where two meet they overlap cleanly
  wallBand(path, c, W, 0.12 * k)
}

// ---------- the canopy over the roof ----------
// Six bands parallel to the Fairfax and Wilshire faces, inset 3–15 m, that
// leave the parapet and arch up to the 25 m crests before coming back down
// (NAIP; DSM crests 22–27 m). Flat-ish strips 1.6 m wide, both faces.
for (let k = 0; k < 6; k++) {
  const inset = 1.8 + k * 2.5
  const pp = ribbonPath(inset, Math.max(2, 7 - k * 0.6), 2.4)
  // canopy ends: along Wilshire it runs to the east third, on Fairfax to
  // the south edge; it is lowest at the ends and the corner, highest midway
  const sEnd = pp[pp.length - 1].s
  const keep = pp.filter(q => q.s < sEnd - 22 + k * 1.5)
  const L = keep[keep.length - 1].s
  // highest over the corner, back down to the parapet at both ends
  const z = (s: number) => ROOF + 0.3 + (TOP - ROOF - 0.3 - k * 0.45) * Math.pow(Math.max(0, Math.sin(Math.PI * s / L)), 0.6)
  // the bands wander in plan (NAIP), all together so they never touch
  const wob = (s: number) => 1.1 * Math.sin(2 * Math.PI * s / 26 + 0.25 * k)
  for (let i = 0; i < keep.length - 1; i++) {
    const A = keep[i], B = keep[i + 1], h = 0.75
    const pa: XY = [A.p[0] + A.n[0] * wob(A.s), A.p[1] + A.n[1] * wob(A.s)], pb: XY = [B.p[0] + B.n[0] * wob(B.s), B.p[1] + B.n[1] * wob(B.s)]
    const a0: V3 = [pa[0] - A.n[0] * h, pa[1] - A.n[1] * h, z(A.s) + 0.55], a1: V3 = [pa[0] + A.n[0] * h, pa[1] + A.n[1] * h, z(A.s) - 0.55]
    const b0: V3 = [pb[0] - B.n[0] * h, pb[1] - B.n[1] * h, z(B.s) + 0.55], b1: V3 = [pb[0] + B.n[0] * h, pb[1] + B.n[1] * h, z(B.s) - 0.55]
    steel.quad(a0, a1, b1, b0)
    steel.quad(a1, a0, b0, b1)
  }
}

// ground-floor glazing on the Wilshire face, behind the lowest band
glass.quad([U0 + IN + 6, V1 - IN + 0.05, 0.3], [U1 - IN - 6, V1 - IN + 0.05, 0.3], [U1 - IN - 6, V1 - IN + 0.05, 1.9], [U0 + IN + 6, V1 - IN + 0.05, 1.9])

const parts = [
  { part: red, material: finish('petersen-red', 0xc8483f) },
  { part: steel, material: finish('petersen-steel', 0xdfe1e3, 0.4) },
  { part: roof, material: PALETTE.roof },
  { part: deck, material: finish('petersen-deck', 0xd9d4cc) },
  { part: glass, material: PALETTE.entrance },
]
if (import.meta.main) {
  const { glb, triangles } = finishModel('la-petersen', 'Petersen Automotive Museum', parts, {
    bearing: 7.8, height: TOP, replaces: ['way/913343446'],
  })
  const out = process.argv[2] ?? new URL('../models/la-petersen.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
void capRing; void total
