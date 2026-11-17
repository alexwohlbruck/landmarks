/**
 * Star of India (built 1863 as Euterpe, Ramsey, Isle of Man; iron-hulled
 * barque), Maritime Museum of San Diego, North Harbor Drive — original
 * procedural geometry, CC0-1.0.
 * bun generators/sd-star-of-india.ts
 *
 * Map frame: x to starboard, y toward the bow, z up, metres; placed at
 * bearing 180 (bow to the south, port side against the museum's wharf on
 * Harbor Drive to the east). Origin at the area centroid of the OSM outline
 * way/170659470, 32.720276, -117.173560. z = 0 is the waterline: the
 * lidar's water returns around the hull read 0.0–0.1 m. Nothing below the
 * waterline and no water is modelled.
 *
 * Identity, in order: the three tall masts, fore and main square-rigged
 * with five yards each and the sails furled on them, the shorter mizzen
 * with its gaff and spanker boom (a barque since 1901); the long raking
 * bowsprit and jib boom; the long low black hull with its sheer rising to
 * the clipper bow and the rounded counter stern, the red boot-topping and
 * the white rail; the rigging, drawn as a few bold stays and shrouds.
 *
 * Evidence:
 *  - plan: OSM way/170659470 (64.5 m from the stern to the stem, 10.5 m in
 *    beam; the half-breadths below are its own), NAIP (USGS, 0.15 m) for
 *    the bow direction (bowsprit to the south), the mast positions (the
 *    furled course yards show white across the deck 2.6 m forward and
 *    16.5 m forward of the centroid) and the course yard span (~21 m).
 *  - published (Wikipedia, "Star of India (ship)"): length overall
 *    sparred 84.8 m, hull 62.5 m, beam 10.7 m, deck to main truck
 *    38.8 m, barque rig since 1901.
 *  - heights: lidar CA_SanDiegoQL2_2014 (0.5 m grid; the rig returns few
 *    points): waist rail 5.5–6.2 m, poop and forecastle 6.4–7.2 m, main
 *    deck ~4.6 m, mast hits to 34 m. Main truck 44 m = the published
 *    38.8 m above a 4.6 m deck plus the pole; the fore and mizzen trucks
 *    and every yard height are scaled from broadside photos against it
 *    (Ctorbann 03, Port of San Diego 150th-anniversary sail): main yards
 *    13.1, 20.7, 26.6, 33.2, 38.4 m; fore 5% lower; mizzen truck 34 m.
 *    Yard spans 21, 18, 16.5, 13, 10 m (NAIP for the course, the rest
 *    from the photos).
 *  - colours (daylight photos): the hull is black (pulled to charcoal)
 *    over a red-orange boot-topping, with a white rail and sheer line;
 *    tan varnished spars; cream furled canvas; teak deck. The brief
 *    mentioned a white band of painted gunports: no photo from 2003–2023
 *    shows one, so the model follows the photos.
 *  - night: the ship is dressed with strings of lights from the jib boom
 *    over the trucks to the stern (Andrek02, Tony Webster night photos):
 *    `lamp` beads along that line.
 *
 * Photos (Wikimedia Commons): San_Diego_Star_of_India_iron_hull_sailing_
 * ship_01–06.JPG (Ctorbann, CC BY-SA 3.0); Star_of_India_San_Diego_01.jpg
 * and _02.jpg (Andrek02, CC0); Star_of_India_150th_Anniversary_Sail_
 * (10827664403).jpg (Port of San Diego, CC BY 2.0); Star_of_India_San_
 * Diego_at_Night_6D2B4596.jpg (Tony Webster, CC BY 3.0); Starofindia.jpg
 * (CC BY-SA 2.0); Star_of_India_harbor_San_Diego.jpg (Chris Willis, CC BY
 * 2.0). No commercial imagery.
 *
 * Left out: the figurehead, ratlines, running rigging, boats and davits,
 * the deck fittings, the flags and the gangway.
 *
 * Doubts: the rig heights are photo-scaled (the lidar barely sees spars);
 * the sails are drawn furled, as the NAIP and most photos show, though the
 * museum sometimes sets or dries them. The starboard (bay) side has only
 * distant photos; it is drawn as the port side mirrored.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { cap, save, walls, type XY } from './chi-aon-center'
import { face } from './phl-independence-hall'

/** Piecewise-linear lookup. */
const pl = (t: [number, number][]) => (y: number) => {
  if (y <= t[0][0]) return t[0][1]
  for (let i = 1; i < t.length; i++) if (y <= t[i][0]) {
    const [y0, v0] = t[i - 1], [y1, v1] = t[i]
    return v0 + ((v1 - v0) * (y - y0)) / (y1 - y0)
  }
  return t[t.length - 1][1]
}

const STERN = -31.8, STEM = 32.7
// Half-breadth at the rail (OSM outline), the sheer (rail height) and the
// deck inside the bulwarks.
const half = pl([[-31.8, 1.9], [-31.1, 3.0], [-30.3, 3.6], [-27, 4.0], [-23.3, 4.3], [-7.3, 5.0], [8, 5.2], [17.3, 4.9], [21.6, 4.6], [27, 3.6], [30.4, 2.1], [32.0, 0.9], [32.7, 0.1]])
const sheer = pl([[-31.8, 7.3], [-24, 6.7], [-10, 6.0], [10, 6.0], [24, 6.5], [32.7, 7.4]])
const deckZ = pl([[-31.8, 6.1], [-19.6, 6.1], [-18.8, 4.6], [22.6, 4.6], [23.4, 5.9], [32.7, 6.5]])
// The waterline: the counter stern overhangs, the clipper stem rakes.
const WL_AFT = -28.6, WL_FWD = 30.4
const halfWL = (y: number) => half(Math.max(WL_AFT, Math.min(WL_FWD, y))) * (y < WL_AFT + 2 ? 0.75 : y > WL_FWD - 6 ? 0.8 : 0.97)

function build() {
  const black = new Part(), red = new Part(), white = new Part(), spar = new Part(), deck = new Part(), lamp = new Part()

  // ------------------------------------------------------------- hull
  const ys = [STERN, -31.1, -30.3, -28.6, -27, -23.3, -16, -7.3, 0, 8, 17.3, 21.6, 25, 27, 29, 30.4, 31.4, 32.0, STEM]
  const BOOT = 1.5, LINE0 = 5.25, LINE1 = 5.5
  const at = (y: number, z: number, side: number): V3 => {
    // The hull's side between the waterline and the rail, blended by height.
    const yw = Math.max(WL_AFT, Math.min(WL_FWD, y)), zr = sheer(y)
    const t = Math.min(1, z / zr)
    const w = halfWL(y) + (half(y) - halfWL(y)) * Math.pow(t, 0.7)
    const yy = yw + (y - yw) * Math.pow(t, 0.9)
    return [side * w, yy, z]
  }
  const bands: [Part, number | 'rail0', number | 'rail0' | 'rail'][] = [
    [red, 0, BOOT], [black, BOOT, LINE0], [white, LINE0, LINE1], [black, LINE1, 'rail0'], [white, 'rail0', 'rail'],
  ]
  const zOf = (v: number | 'rail0' | 'rail', y: number) => (v === 'rail' ? sheer(y) : v === 'rail0' ? sheer(y) - 0.45 : Math.min(v, sheer(y) - 0.5))
  for (let i = 0; i < ys.length - 1; i++) {
    const y0 = ys[i], y1 = ys[i + 1]
    for (const side of [-1, 1]) for (const [p, a, b] of bands) {
      const za0 = zOf(a, y0), zb0 = zOf(b, y0), za1 = zOf(a, y1), zb1 = zOf(b, y1)
      face(p, [at(y0, za0, side), at(y1, za1, side), at(y1, zb1, side), at(y0, zb0, side)], [side, 0, 0])
    }
  }
  // Bulwarks' inner face (white) down to the deck, and the deck itself.
  const inner = (y: number) => Math.max(0.05, half(y) - 0.35)
  const yi = ys.slice(1, -1)
  for (let i = 0; i < yi.length - 1; i++) {
    const y0 = yi[i], y1 = yi[i + 1]
    for (const side of [-1, 1]) {
      face(white, [[side * inner(y0), y0, deckZ(y0)], [side * inner(y1), y1, deckZ(y1)], [side * inner(y1), y1, sheer(y1)], [side * inner(y0), y0, sheer(y0)]], [-side, 0, 0])
      // rail cap
      face(white, [[side * inner(y0), y0, sheer(y0)], [side * inner(y1), y1, sheer(y1)], [side * half(y1), y1, sheer(y1)], [side * half(y0), y0, sheer(y0)]], [0, 0, 1])
    }
    face(deck, [[-inner(y0), y0, deckZ(y0)], [inner(y0), y0, deckZ(y0)], [inner(y1), y1, deckZ(y1)], [-inner(y1), y1, deckZ(y1)]], [0, 0, 1])
  }
  {
    // Close the stern and stem ends of the deck well, and the rail caps there.
    const a = yi[0], b = yi[yi.length - 1]
    face(white, [[-inner(a), a, deckZ(a)], [inner(a), a, deckZ(a)], [inner(a), a, sheer(a)], [-inner(a), a, sheer(a)]], [0, 1, 0])
    face(white, [[-half(STERN), STERN, sheer(STERN)], [half(STERN), STERN, sheer(STERN)], [inner(a), a, sheer(a)], [-inner(a), a, sheer(a)]], [0, 0, 1])
    face(white, [[-inner(b), b, deckZ(b)], [inner(b), b, deckZ(b)], [inner(b), b, sheer(b)], [-inner(b), b, sheer(b)]], [0, -1, 0])
    face(white, [[-inner(b), b, sheer(b)], [inner(b), b, sheer(b)], [half(STEM), STEM, sheer(STEM)], [-half(STEM), STEM, sheer(STEM)]], [0, 0, 1])
    // The counter's underside and the stern face, black; the stem's edge.
    const s = (z: number, side: number) => at(STERN, z, side)
    face(black, [s(0, -1), s(0, 1), s(sheer(STERN), 1), s(sheer(STERN), -1)], [0, -1, 0])
    const e = (z: number, side: number) => at(STEM, z, side)
    face(black, [e(BOOT, -1), e(BOOT, 1), e(sheer(STEM), 1), e(sheer(STEM), -1)], [0, 1, 0])
    face(red, [e(0, -1), e(0, 1), e(BOOT, 1), e(BOOT, -1)], [0, 1, 0])
  }

  // -------------------------------------------------------- deck houses
  const box = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part | null = p) => {
    const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
    walls(p, r, z0, z1)
    if (top) cap(top, r, z1)
  }
  box(white, -2.2, 2.2, 5.5, 12.0, 4.6, 6.9, deck) // forward deckhouse (galley)
  box(white, -1.8, 1.8, -12.5, -8.0, 4.6, 6.6, deck) // after deckhouse
  box(white, -2.6, 2.6, -27.0, -22.5, 6.1, 7.6, deck) // the wheel shelter on the poop
  box(spar, -1.2, 1.2, -9.5, -3.0, 6.6, 6.9, null)

  // ------------------------------------------------------------ the rig
  /** A square-section spar from A to B, w0 tapering to w1. */
  const rod = (p: Part, A: V3, B: V3, w0: number, w1 = w0) => {
    const d: V3 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], L = Math.hypot(...d)
    const u: V3 = [d[0] / L, d[1] / L, d[2] / L]
    const ref: V3 = Math.abs(u[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
    let e1: V3 = [u[1] * ref[2] - u[2] * ref[1], u[2] * ref[0] - u[0] * ref[2], u[0] * ref[1] - u[1] * ref[0]]
    const l1 = Math.hypot(...e1); e1 = [e1[0] / l1, e1[1] / l1, e1[2] / l1]
    const e2: V3 = [u[1] * e1[2] - u[2] * e1[1], u[2] * e1[0] - u[0] * e1[2], u[0] * e1[1] - u[1] * e1[0]]
    const ring = (C: V3, w: number) => [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([a, b]) => [C[0] + (a * e1[0] + b * e2[0]) * w / 2, C[1] + (a * e1[1] + b * e2[1]) * w / 2, C[2] + (a * e1[2] + b * e2[2]) * w / 2] as V3)
    const ra = ring(A, w0), rb = ring(B, w1)
    for (let k = 0; k < 4; k++) {
      const j = (k + 1) % 4
      const m: V3 = [(ra[k][0] + ra[j][0]) / 2 - A[0], (ra[k][1] + ra[j][1]) / 2 - A[1], (ra[k][2] + ra[j][2]) / 2 - A[2]]
      face(p, [ra[k], ra[j], rb[j], rb[k]], m)
    }
    face(p, rb, u)
    face(p, ra, [-u[0], -u[1], -u[2]])
  }
  const DECK = 4.6
  type Mast = { y: number; top: number; yards: [number, number][] }
  const mainYards: [number, number][] = [[13.1, 21], [20.7, 18], [26.6, 16.5], [33.2, 13], [38.4, 10]]
  const masts: Mast[] = [
    { y: 16.5, top: 41.8, yards: mainYards.map(([z, s]) => [DECK + (z - DECK) * 0.95, s]) },
    { y: -2.6, top: 44.0, yards: mainYards },
    { y: -18.0, top: 34.0, yards: [] },
  ]
  for (const m of masts) {
    const lowerTop = m.yards.length ? m.yards[0][0] + 3.6 : 17.0
    rod(spar, [0, m.y, DECK - 0.2], [0, m.y, lowerTop + 1.2], 1.0, 0.8)
    rod(spar, [0, m.y + 0.2, lowerTop], [0, m.y + 0.2, m.top - 7], 0.55, 0.45)
    rod(spar, [0, m.y + 0.35, m.top - 8], [0, m.y + 0.35, m.top], 0.38, 0.22)
    // The top: a platform at the lower masthead, crosstrees higher up.
    box(spar, -2.0, 2.0, m.y - 1.3, m.y + 1.6, lowerTop, lowerTop + 0.35)
    box(spar, -1.6, 1.6, m.y - 0.3, m.y + 0.7, m.top - 9.2, m.top - 8.9)
    for (const [z, span] of m.yards) {
      const yy = m.y + 0.7
      rod(spar, [-span / 2, yy, z], [span / 2, yy, z], 0.55, 0.55)
      // The furled sail lashed on top of it, a little shorter than the yard.
      const fs = span / 2 - 0.9
      rod(white, [-fs, yy - 0.05, z + 0.55], [fs, yy - 0.05, z + 0.55], 1.0, 1.0)
    }
  }
  // Mizzen: spanker boom and gaff, the spanker furled on the boom.
  rod(spar, [0, -18.6, 8.6], [0, -34.5, 9.2], 0.4)
  rod(white, [0, -19.5, 9.15], [0, -33.0, 9.7], 0.7)
  rod(spar, [0, -18.6, 18.5], [0, -28.5, 22.6], 0.35)
  // Bowsprit and jib boom, raking up at ~17°, with the furled jibs.
  const BSP: V3 = [0, 29.0, 6.4], BSE: V3 = [0, 40.5, 10.6], JIB: V3 = [0, 51.0, 14.0]
  rod(spar, BSP, BSE, 0.8, 0.6)
  rod(spar, [0, 39.0, 10.2], JIB, 0.42, 0.3)
  rod(white, [0, 41.5, 11.4], [0, 49.5, 14.0], 0.6, 0.4)

  // ---------------------------------------------------------- rigging
  const R = 0.2 // bold enough to read at map distance
  const fore = masts[0], main = masts[1], miz = masts[2]
  const lt = (m: Mast) => (m.yards.length ? m.yards[0][0] + 3.6 : 17.0)
  // stays: jib boom and bowsprit to the fore, fore to main, main to mizzen
  rod(black, JIB, [0, fore.y + 0.35, fore.top - 1], R)
  rod(black, BSE, [0, fore.y + 0.2, fore.top - 9], R)
  rod(black, [0, 31.0, 6.8], [0, fore.y, lt(fore)], R)
  rod(black, [0, fore.y, lt(fore) - 1.0], [0, main.y + 0.2, lt(main) + 0.8], R)
  rod(black, [0, fore.y + 0.35, fore.top - 1.5], [0, main.y + 0.35, main.top - 2], R)
  rod(black, [0, main.y + 0.2, main.top - 8], [0, miz.y + 0.2, miz.top - 4], R)
  // shrouds: two sets a side for each mast, rail to the top and to the crosstrees
  for (const m of masts) for (const side of [-1, 1]) {
    const yb = m.y - 2.2, xb = side * (half(yb) - 0.1)
    rod(black, [xb, yb, sheer(yb)], [side * 1.6, m.y, lt(m)], R)
    rod(black, [xb, yb - 2.2, sheer(yb - 2.2)], [side * 1.6, m.y - 0.6, lt(m)], R)
    const yc = m.y - 6.5
    rod(black, [side * (half(yc) - 0.1), yc, sheer(yc)], [side * 0.9, m.y, m.top - 9], R)
  }

  // ------------------------------------------------------ dress lights
  const bead = (c: V3, r = 0.3) => {
    const P: V3[] = [[c[0] + r, c[1], c[2]], [c[0], c[1] + r, c[2]], [c[0] - r, c[1], c[2]], [c[0], c[1] - r, c[2]]]
    const T: V3 = [c[0], c[1], c[2] + r], B: V3 = [c[0], c[1], c[2] - r]
    for (let k = 0; k < 4; k++) {
      const a = P[k], b = P[(k + 1) % 4]
      lamp.tri(a, b, T)
      lamp.tri(b, a, B)
    }
  }
  const string = (A: V3, B: V3, step = 2.6) => {
    const L = Math.hypot(B[0] - A[0], B[1] - A[1], B[2] - A[2]), n = Math.max(1, Math.round(L / step))
    for (let k = 0; k <= n; k++) bead([A[0] + ((B[0] - A[0]) * k) / n, A[1] + ((B[1] - A[1]) * k) / n, A[2] + ((B[2] - A[2]) * k) / n])
  }
  string([0, 51.0, 14.5], [0, fore.y + 0.35, fore.top])
  string([0, fore.y + 0.35, fore.top], [0, main.y + 0.35, main.top])
  string([0, main.y + 0.35, main.top], [0, miz.y + 0.35, miz.top])
  string([0, miz.y + 0.35, miz.top], [0, STERN + 0.6, sheer(STERN) + 0.4])
  // and along the course and topsail yards of the fore and main
  for (const m of [fore, main]) for (const [z, span] of m.yards.slice(0, 3)) string([-span / 2, m.y + 0.7, z - 0.4], [span / 2, m.y + 0.7, z - 0.4], 3.0)

  return [
    { part: black, material: finish('soi-hull-black', 0x4a4f57) },
    { part: red, material: finish('soi-boot-red', 0xb75a43) },
    { part: white, material: finish('soi-white', 0xf1ece2) },
    { part: spar, material: finish('soi-spar-tan', 0xb9996f) },
    { part: deck, material: finish('soi-teak', 0xa99d8a) },
    { part: lamp, material: { name: 'lamp', color: 0x8a7a62, roughness: 0.6 } },
  ]
}

if (import.meta.main) await save('sd-star-of-india', 'Star of India', [32.720276, -117.17356], 180, build(), 5000)
