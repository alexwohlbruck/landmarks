/**
 * The Cloud, Fashion Show Las Vegas (2003): the tilted, saucer-shaped steel
 * canopy over the mall's plaza on the Strip, held up on two banded drum
 * columns that pierce it and carry lattice masts, the south one topped by
 * the FASHION SHOW sign. Only the Cloud and its supports; the mall is the
 * map's. Procedural, CC0-1.0.
 * bun generators/lv-fashion-show-cloud.ts
 *
 * Map frame: x across, y along the Cloud's long axis, z up, metres. The
 * placement's bearing (29.3°) turns +y to the north-north-east tip. The
 * origin is the area centroid of the OSM outline (relation/19447588,
 * building:part=roof, roof:shape=round, outer way/402792174).
 *
 * Published (Wikipedia, "Fashion Show Las Vegas", Plaza and Cloud): 479 ft
 * (146 m) long and 160 ft (48.8 m) wide; "situated at an angle, its lowest
 * and highest point above the ground is 96 and 128 feet" (29.3 and 39.0 m);
 * mostly steel, held by cables.
 *
 * Measured:
 * - OSM: the outline is an ellipse 145.3 × 47.7 m on a 29.3° axis (fits
 *   x²/a² + y²/b² = 1 to within a metre); its two inner rings, ~15 m square
 *   holes where the columns pass through, centred 38.4 m north and 39.0 m
 *   south of the middle and 3–4 m east of the axis, turned 31° to it;
 * - USGS NAIP orthophoto (public domain): the same ellipse and holes;
 * - photos, for which end is high: from the Wynn frontage across the
 *   Strip (c4, c6) the south end is clearly higher and nearer; the masts
 *   rise about 9 m above the disc, the drums are about 11 m across, the
 *   underside is a shallow bowl under a thin rim, the top nearly flat.
 *
 * Photos (Wikimedia Commons):
 * - c4 "Fashion Show Mall Las Vegas 2019.jpg", Steven Lek, CC BY-SA 4.0:
 *   from the east across the Strip, south to the left;
 * - c6 "Fashionshowmall.jpg", Coolcaesar, CC BY-SA 3.0: from the east;
 * - c7 "Las Vegas Shopping P4220702.jpg", Alexander Migl, CC BY-SA 4.0:
 *   from the south-east, under the south end;
 * - c9 "Fashion Show Mall - Las Vegas.jpg", APK, CC BY-SA 4.0: square on
 *   from the east;
 * - c11 "Fashion Show Las Vegas - tomasdelcoro.jpg", Tomás Del Coro,
 *   CC BY-SA 2.0: the underside and the north column.
 *
 * Estimated: which way the tilt runs (along the long axis, south end high;
 * the photos show no cross-tilt), the bowl's depth (4.5 m) and the rim's
 * thickness (1.5 m), the drums' 11 m width (photos c6, c9, against the
 * disc's width), the masts' height (9–10 m) and the sign's size. The rim
 * follows the published heights: its top 39.0 m at the south tip, its
 * underside 29.3 m at the north tip; the bowl dips about a metre lower.
 * Left out: the cables, the column's fine louvre rings, the lettering of
 * the sign (a plain panel here), and the holes round the columns (the
 * drums fill most of them).
 *
 * The LED screens wrapping the lower columns on the Strip side are `window`,
 * so they glow at night as the real screens do.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, type XY } from './lv-wynn'
import { lathe, extrude, planeAt } from './lv-mgm-grand'

const disc = new Part()
const steel = new Part()
const mast = new Part()
const screen = new Part()

// ------------------------------------------------------------------ disc
const A = 73.0 // half-length (146 m)
const B = 24.4 // half-width (48.8 m)
const SLOPE = 0.05616 // rise per metre towards the south tip
const Z0 = 34.9 // rim top at the middle: 39.0 at the south tip; the north tip's rim bottom 29.3
const RIM = 1.5 // rim thickness
const BOWL = 4.5 // the underside's sag at the middle
const DOME = 1.2 // the top's crown at the middle

const rimZ = (y: number) => Z0 - SLOPE * y
const NA = 56 // segments round the ellipse
const NR = 6 // rings in from the rim
const at = (k: number, i: number): XY => {
  const r = Math.sin(((k / NR) * Math.PI) / 2) // rings bunched towards the rim
  const t = (i / NA) * Math.PI * 2
  return [B * r * Math.cos(t), A * r * Math.sin(t)]
}
const r2 = (p: XY) => (p[0] / B) ** 2 + (p[1] / A) ** 2
const topZ = (p: XY) => rimZ(p[1]) + DOME * (1 - r2(p))
const botZ = (p: XY) => rimZ(p[1]) - RIM - BOWL * (1 - r2(p))

for (let k = 0; k < NR; k++) {
  for (let i = 0; i < NA; i++) {
    const a = at(k, i), b = at(k, i + 1), c = at(k + 1, i + 1), d = at(k + 1, i)
    const T = (p: XY): V3 => [p[0], p[1], topZ(p)]
    const U = (p: XY): V3 => [p[0], p[1], botZ(p)]
    if (k === 0) {
      disc.tri(T(a), T(d), T(c)) // the centre is a fan
      disc.tri(U(a), U(c), U(d))
    } else {
      disc.quad(T(a), T(d), T(c), T(b))
      disc.quad(U(a), U(b), U(c), U(d))
    }
  }
}
// The rim band round the edge.
for (let i = 0; i < NA; i++) {
  const p = at(NR, i), q = at(NR, i + 1)
  disc.quad([p[0], p[1], botZ(p)], [q[0], q[1], botZ(q)], [q[0], q[1], topZ(q)], [p[0], p[1], topZ(p)])
}

// --------------------------------------------------------------- columns
const R = 5.5
const COLS: { c: XY; mast: number; sign: boolean; screen: [number, number] }[] = [
  { c: [3.0, 38.4], mast: 9, sign: false, screen: [6, 18] }, // north
  { c: [4.3, -39.0], mast: 10, sign: true, screen: [6, 21] }, // south, under the FASHION SHOW sign
]
const SEG = 16
for (const col of COLS) {
  const top = topZ(col.c)
  const bot = botZ(col.c)
  // The drum, from the ground to a collar just above the disc.
  lathe(steel, col.c, [[R, 0], [R, top + 2.4], [R - 0.5, top + 2.9], [0, top + 2.9]], SEG)
  // The angled flaps where the drum meets the underside: a square funnel
  // turned 31° to the axis, as the holes are.
  {
    const rot = (31 * Math.PI) / 180
    const sq = (h: number, z: number): V3[] =>
      [0, 1, 2, 3].map((n) => {
        const a = rot + (n * Math.PI) / 2 + Math.PI / 4
        return [col.c[0] + Math.cos(a) * h * Math.SQRT2, col.c[1] + Math.sin(a) * h * Math.SQRT2, z] as V3
      })
    const hi = sq(7.5, 0), lo = sq(R + 0.1, 0)
    for (let n = 0; n < 4; n++) {
      const m = (n + 1) % 4
      const zh = (p: V3) => botZ([p[0], p[1]]) + 0.3
      const H = (p: V3): V3 => [p[0], p[1], zh(p)]
      const L = (p: V3): V3 => [p[0], p[1], bot - 6]
      disc.quad(L(lo[n]), L(lo[m]), H(hi[m]), H(hi[n]))
    }
  }
  // The LED screen on the Strip side (+x): a curved band proud of the drum.
  {
    const [z0, z1] = col.screen
    const n = 8 // round 200° of the drum, centred on the Strip
    for (let s = 0; s < n; s++) {
      const a0 = (-100 + (s / n) * 200) * Math.PI / 180
      const a1 = (-100 + ((s + 1) / n) * 200) * Math.PI / 180
      const P = (a: number, z: number): V3 => [col.c[0] + Math.cos(a) * (R + 0.15), col.c[1] + Math.sin(a) * (R + 0.15), z]
      screen.quad(P(a0, z0), P(a1, z0), P(a1, z1), P(a0, z1))
    }
  }
  // The mast: a slim core, four chunky corner posts and three ring decks.
  const m0 = top + 2.9
  const m1 = m0 + col.mast
  lathe(mast, col.c, [[2.6, m0], [2.6, m1 - 0.6], [0, m1 - 0.6]], 8)
  for (let n = 0; n < 4; n++) {
    const a = (31 * Math.PI) / 180 + (n * Math.PI) / 2 + Math.PI / 4
    const px = col.c[0] + Math.cos(a) * 4.4, py = col.c[1] + Math.sin(a) * 4.4
    lathe(mast, [px, py], [[0.55, m0], [0.55, m1], [0, m1]], 4, Math.PI / 4)
  }
  for (const f of [0.08, 0.5, 0.92]) {
    const z = m0 + (m1 - m0) * f
    lathe(mast, col.c, [[0, z - 0.4], [5.4, z - 0.4], [5.4, z + 0.4], [0, z + 0.4]], 8, Math.PI / 8)
  }
  if (col.sign) {
    // The sign board on top, across the axis so it faces the Strip.
    const pl = planeAt(col.c, 0) // profile x runs along +y, extruded across x
    extrude(pl, [[-5.5, m1], [5.5, m1], [5.5, m1 + 3.6], [-5.5, m1 + 3.6]], -0.35, 0.35, () => steel, steel)
  }
}

const parts = [
  { part: disc, material: finish('cloud-white', 0xe9e9e6) },
  { part: steel, material: finish('cloud-steel', 0xc9ccce) },
  { part: mast, material: PALETTE.roof },
  { part: screen, material: PALETTE.window },
]
if (import.meta.main) {
  await save('lv-fashion-show-cloud', 'The Cloud, Fashion Show Las Vegas', parts, 54.4, 'Y up, -Z north, +X east, metres, origin at ground')
}
