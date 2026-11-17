/**
 * ING House ("De Schoen", now "Infinity"; Meyer en Van Schooten, 2002),
 * Amstelveenseweg by the A10, Zuidas, Amsterdam: original procedural
 * geometry, CC0-1.0.
 * bun generators/amsterdam-ing-house.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of OSM way/57856367 (building=commercial,
 * name "Infinity", old_name "ING House", wikidata Q645881, which is the ING
 * House item; BAG 0363100012068127), 52.337168, 4.855211. Bearing 85.1, the
 * outline's long walls, so model +y runs east along the building, to the
 * high end; the low "toe" points west (-y). Symmetric about x = 0.
 *
 * Identity, in order: one long volume lifted about 11 m off the ground on
 * rows of bold, raking steel stilts in V pairs; its roof sloping up from the
 * low, rounded, aluminium-clad toe in the west to the tall glass end in the
 * east ("the shoe" / "the dustbuster"); the glass double facade along the
 * sides over a silver aluminium base band with a rounded underside; the
 * window band across the toe; the glass lobby under the high end.
 *
 * Evidence
 *  - Plan: OSM way/57856367, read in this frame: x +-13.8 from y -45 to
 *    66.9; the toe narrows to a rounded tip at y -70.9 (half-width 8 at
 *    y -69). levels 10, roof:shape many.
 *  - Heights: 3D BAG (3dbag.nl, CC BY 4.0, TU Delft/3DGI), pand
 *    NL.IMBAG.Pand.0363100012068127, roof surfaces from AHN5 (2023), sampled
 *    on a 3 m grid in this frame: roof 23.9 at the toe's tip rising evenly to
 *    36.4 at y -21, a step down to 35.4 to y -5, up to 46.6 at y 0 and the
 *    high block's roof 48.2-48.4 from y 3 to the east end; plant 49.8-51.0
 *    on the middle of the high roof (x +-6, y 9..51); the long edges sample
 *    lower (the sides are chamfered at the top). Ground NAP +0.1.
 *  - Estimated from the photos (scaled to the 3D BAG roof and the vans in
 *    Guilhem Vellut's view): the underside about 11 m up under the body and
 *    the toe (the stilts are about four van-heights tall), curving up to
 *    about 13.4 m at the toe's tip with a deep rounded belly; the aluminium
 *    band about 6 m deep; the walls leaning out about
 *    1.8 m from underside to roof; stilt pairs at about 9 m spacing, from
 *    y -42 to the east end; the toe cantilevered about 25 m beyond them.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - Guilhem Vellut, "ING House @ Zuidas @ Amsterdam (20203855735).jpg"
 *      and "(19581199544).jpg", CC BY 2.0 — the toe and the north side.
 *      https://commons.wikimedia.org/wiki/File:ING_House_@_Zuidas_@_Amsterdam_(20203855735).jpg
 *      https://commons.wikimedia.org/wiki/File:ING_House_@_Zuidas_@_Amsterdam_(19581199544).jpg
 *    - FaceMePLS, "2009 ING House.jpg", CC BY 2.0 — the high glass end.
 *      https://commons.wikimedia.org/wiki/File:2009_ING_House.jpg
 *    - Steven Lek, "ING House Amsterdam 2017.jpg", CC BY-SA 4.0 — the high
 *      end from the A10. https://commons.wikimedia.org/wiki/File:ING_House_Amsterdam_2017.jpg
 *    - Pudding4brains, "ING-House - Amsterdam 20060903 01.jpg" to "05",
 *      public domain — the toe, the stilts close up, the lobby.
 *      https://commons.wikimedia.org/wiki/File:ING-House_-_Amsterdam_20060903_02.jpg
 *    - "INGHouse1.jpg", public domain — the south side and the toe.
 *      https://commons.wikimedia.org/wiki/File:INGHouse1.jpg
 *    - "ING House Amsterdam.JPG", CC BY-SA 3.0 — the toe from below.
 *      https://commons.wikimedia.org/wiki/File:ING_House_Amsterdam.JPG
 *    - Choinowski, "Infinity Amsterdam.jpg", CC BY-SA 4.0 — the high end
 *      today. https://commons.wikimedia.org/wiki/File:Infinity_Amsterdam.jpg
 *  No commercial imagery, no look-only sources. Elevation 0 (flat).
 *
 * Simplified: the stilts are drawn as one V pair per bay on each side, all
 * alike (the real ones vary in rake and grouping); the double facade is a
 * light window wall with a pale floor line every three storeys; the lobby is
 * a plain glazed box; the steel trusses under the high end, the sign and the
 * roof's glass box are left out. Doubts: the underside heights and the base
 * band depth are photo estimates; the south side has fewer photos.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, inset, rect, save, walls, type XY } from './chi-aon-center'
import { tube } from './amsterdam-johan-cruijff-arena'

/** Roof height along the building (3D BAG). */
const R = (y: number) => {
  const pts: XY[] = [[-71, 23.9], [-21, 36.4], [-4.5, 35.9], [1.5, 48.3], [67, 48.3]]
  for (let i = 0; i < pts.length - 1; i++) if (y <= pts[i + 1][0]) return pts[i][1] + ((pts[i + 1][1] - pts[i][1]) * (y - pts[i][0])) / (pts[i + 1][0] - pts[i][0])
  return pts[pts.length - 1][1]
}
/** Underside height: 11.2 m, curving up to 13.4 m at the toe's tip. */
const S = (y: number) => (y > -60 ? 11.2 : 11.2 + 2.2 * Math.pow((-60 - y) / 11, 1.5))

function build() {
  const alu = new Part(), glassWall = new Part(), win = new Part(), trim = new Part(), roof = new Part(), steel = new Part()

  // The roof outline: long sides with a vertex at every height break, and
  // the rounded toe from OSM.
  const ys = [-45, -36, -27, -21, -13, -4.5, 1.5, 12, 24, 36, 48, 58, 66.9]
  const H = 13.8
  const toe: XY[] = [[13.8, -49.4], [13.3, -56.3], [12.4, -59.6], [10.6, -62.6], [9.3, -65.6], [8.0, -68.4], [6.0, -70.0], [3.0, -70.7], [0, -70.9]]
  // Build counter-clockwise explicitly: east side going north, then west side south, then the toe.
  const ring: XY[] = [
    ...ys.map((y) => [H, y] as XY),
    ...[...ys].reverse().map((y) => [-H, y] as XY),
    ...toe.map(([x, y]) => [-x, y] as XY),
    ...[...toe].reverse().slice(1).map(([x, y]) => [x, y] as XY),
  ]
  const n = ring.length
  const lo = inset(ring, 3.4), mid = inset(ring, 1.0)
  const P = (p: XY, z: number): V3 => [p[0], p[1], z]
  const isToe = (a: XY, b: XY) => Math.min(a[1], b[1]) < -45.5
  const G = (y: number) => S(y) + 6.0 // top of the aluminium base band

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a = ring[i], b = ring[j], la = lo[i], lb = lo[j], ma = mid[i], mb = mid[j]
    // Rounded underside edge, then the aluminium band.
    alu.quad(P(la, S(a[1])), P(lb, S(b[1])), P(mb, S(b[1]) + 3.6), P(ma, S(a[1]) + 3.6))
    alu.quad(P(ma, S(a[1]) + 3.6), P(mb, S(b[1]) + 3.6), P(b, G(b[1])), P(a, G(a[1])))
    const part = isToe(a, b) ? alu : glassWall
    part.quad(P(a, G(a[1])), P(b, G(b[1])), P(b, R(b[1]) - 0.5), P(a, R(a[1]) - 0.5))
    // A chamfered top edge.
    trim.quad(P(a, R(a[1]) - 0.5), P(b, R(b[1]) - 0.5), P(inset(ring, 0.5)[j], R(b[1])), P(inset(ring, 0.5)[i], R(a[1])))
  }
  // Roof and underside, following the height functions.
  {
    const top = inset(ring, 0.5)
    strips(roof, top, R, true)
    strips(alu, lo, S, false)
  }
  // The window band across the toe, just under its roof edge.
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, a = ring[i], b = ring[j]
    if (!isToe(a, b)) continue
    const off = (p: XY, k: number): XY => {
      const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
      return [p[0] + (dy / l) * k, p[1] - (dx / l) * k]
    }
    const A = off(a, 0.05), Bp = off(b, 0.05)
    win.quad(P(A, R(a[1]) - 6.0), P(Bp, R(b[1]) - 6.0), P(Bp, R(b[1]) - 1.4), P(A, R(a[1]) - 1.4))
  }
  // Pale floor lines on the glass, every third storey (3.6 m storeys).
  for (const side of [1, -1]) {
    const x = side * (H + 0.05)
    for (const z of [26.0, 36.8]) {
      // From where the roof has risen above the line to the east end.
      const ya = Math.max(-45, findY(z + 1.2)), yb = 66.9
      const q = [P([x, ya], z - 0.25), P([x, yb], z - 0.25), P([x, yb], z + 0.25), P([x, ya], z + 0.25)]
      if (side > 0) trim.quad(q[0], q[1], q[2], q[3])
      else trim.quad(q[1], q[0], q[3], q[2])
    }
  }
  // The same on the high east end.
  for (const z of [26.0, 36.8]) trim.quad(P([H, 66.95], z - 0.25), P([-H, 66.95], z - 0.25), P([-H, 66.95], z + 0.25), P([H, 66.95], z + 0.25))

  // Plant on the high roof.
  {
    const r = rect(-6, 9, 6, 51)
    walls(roof, r, 48.0, 50.6)
    cap(roof, r, 50.6)
  }

  // --- Stilts: a V pair on each side every 9 m, raking out to the underside.
  for (const side of [1, -1]) {
    for (let k = 0; k < 12; k++) {
      const y = -40 + k * 9.1
      // The raked tubes start 0.5 m up on a footing block, so their slanted
      // ends don't dip below the ground plane.
      const foot: V3 = [side * 9.0, y, 0.5]
      const pad = rect(side * 9.0 - 0.7, y - 0.7, side * 9.0 + 0.7, y + 0.7)
      walls(steel, pad, 0, 0.6)
      cap(steel, pad, 0.6)
      for (const dy of [-3.6, 3.6]) tube(steel, foot, [side * 11.2, y + dy, S(y + dy) + 0.4], 0.9, 6, true)
    }
  }
  // Glass lobby under the high end, and the core under the middle.
  {
    const r = rect(-7.5, 28, 7.5, 63)
    walls(win, r, 0, 10.8)
    const c = rect(-4, -20, 4, -8)
    walls(alu, c, 0, 11.4)
  }

  return [
    { part: alu, material: finish('ing-aluminium', 0xd7dbdc) },
    { part: glassWall, material: windowVariant(2, 0xa9c2cf) },
    { part: win, material: { ...PALETTE.window } },
    { part: trim, material: { ...PALETTE.trim } },
    { part: roof, material: { ...PALETTE.roof } },
    { part: steel, material: finish('ing-steel', 0xb9bec2) },
  ]
}

/**
 * A surface over a ring symmetric about x = 0, drawn as strips between
 * mirrored pairs of points, at height h(y): up (roof) or down (underside).
 */
function strips(p: Part, r: XY[], h: (y: number) => number, up: boolean) {
  const east = r.map((q, i) => i).filter((i) => r[i][0] > 0.01).sort((a, b) => r[a][1] - r[b][1])
  const mate = (i: number) => r.reduce((best, q, k) => (Math.hypot(q[0] + r[i][0], q[1] - r[i][1]) < Math.hypot(r[best][0] + r[i][0], r[best][1] - r[i][1]) ? k : best), 0)
  const V = (i: number): V3 => [r[i][0], r[i][1], h(r[i][1])]
  const tip = r.findIndex((q) => Math.abs(q[0]) <= 0.01)
  const quad = (a: V3, b: V3, c: V3, d: V3) => (up ? p.quad(a, b, c, d) : p.quad(a, d, c, b))
  for (let k = 0; k < east.length - 1; k++) {
    const e0 = east[k], e1 = east[k + 1]
    quad(V(mate(e0)), V(e0), V(e1), V(mate(e1)))
  }
  if (tip >= 0) {
    const e0 = east[0]
    if (up) p.tri(V(tip), V(e0), V(mate(e0)))
    else p.tri(V(tip), V(mate(e0)), V(e0))
  }
}

/** The y where the roof falls to height z (on the rising toe slope). */
function findY(z: number) {
  let lo = -71, hi = 67
  for (let i = 0; i < 40; i++) {
    const m = (lo + hi) / 2
    if (R(m) < z) lo = m
    else hi = m
  }
  return hi
}

if (import.meta.main) await save('amsterdam-ing-house', 'ING House', [52.337168, 4.855211], 85.1, build(), 5000)
