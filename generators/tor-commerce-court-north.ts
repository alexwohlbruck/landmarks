/**
 * Commerce Court North (the Canadian Bank of Commerce Building), Toronto
 * (1929-31, York and Sawyer with Darling and Pearson) — original procedural
 * geometry, CC0-1.0.
 * bun generators/tor-commerce-court-north.ts
 *
 * Frame: x east-north-east +, y north-north-west +, z up, metres; origin at
 * the anchor on the ground. Bearing 343.3 (the Toronto street grid; the OSM
 * outline runs true in it). Anchor = area centroid of the outline OSM
 * way/43417400: -79.3790268, 43.6485896. The tower stands at the outline's
 * north (King Street) edge; the banking-hall block runs south behind it.
 *
 * Identity (from the photos):
 *  1. A pale limestone shaft, square, with a shallow projecting bay in the
 *     middle of its east and west faces, rising from a broad stone block. (hist, spud)
 *  2. The stepped top: the shaft steps in at about 102 m and again at 111,
 *     123 and 133 m, each stage narrower, the middle of each face carried up
 *     in three bays of tall round-arched windows.          (simonp, hist)
 *  3. The top stage: three giant round-arched openings on each face (the
 *     old observation gallery) under a parapet of five piers, a low copper
 *     hipped roof behind.                                   (simonp, hist)
 *  4. The base block's great round-arched windows and the King Street
 *     entrance.                                                      (spud)
 *
 * Plan: OSM, turned into this frame: the outline way/43417400 (the base
 * block); way/306196018 (the core, 28.4 x 29 m), way/306196017 (the east
 * and west bays, 33 x 18 m), way/306196016, way/306196015 and way/306196014
 * (the stages, 25, 22 and 17.5 m across; the top one drawn 19.5 m, from the
 * massing and simonp).
 * Heights (no lidar in Canada):
 *  - published: 145 m, 34 storeys (Wikipedia, "Commerce Court").
 *  - OSM: base 32 (the lead's note: not the tower), bays 102, core 111,
 *    stages 123, 133, and 145 (way/306196014 tagged pyramidal copper from
 *    133 m; the photos show its walls and arches, not a pyramid: the walls
 *    are drawn to 142.5, the copper roof behind the parapet).
 *  - City of Toronto 3D Massing 2025 (https://open.toronto.ca/dataset/3d-massing/):
 *    base 36.6, tiers 102.1, 130.3, 139.8. Used: the base 36; OSM's tiers.
 *  - photo-scaled (hist, the base's top at 36 and the top at 145): the
 *    setbacks at about 102, 111, 123 and 136 m agree with OSM.
 *  - estimated from simonp and hist: window bays and arches (the giant
 *    arches 3.6 m wide, 7 m to the crown; the stage windows 2.2 m wide),
 *    the parapet piers 1.4 m square, 2.5 m above the parapet; the copper
 *    roof's rise (to 145.5); the base block's great arches (9 m wide, crown
 *    at 18.5 m; one on King Street over the entrance and one on each side
 *    face, from spud; their exact positions are estimated).
 *  - ground: Mapterhorn z15 near flat; elevation 0.
 *
 * Colours: the limestone a pale warm grey (spud, simonp); the windows the
 * palette slate; setback roofs grey; the hidden roof copper green (OSM
 * roof:colour #527F76).
 * Night: the offices glow (window), the King Street doors glow (entrance);
 * the crown stages carry a soft floodlight.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  spud   "The Canadian Bank of Commerce Building (Commerce Court North).jpg",
 *         Spudgun67, CC BY-SA 4.0 — the base block's corner and arched
 *         windows, the tower above.
 *         https://commons.wikimedia.org/wiki/File:The_Canadian_Bank_of_Commerce_Building_(Commerce_Court_North).jpg
 *  simonp "Commerce Court North.JPG", SimonP (English Wikipedia), CC BY-SA 3.0 —
 *         the face from King Street and every stage of the crown.
 *         https://commons.wikimedia.org/wiki/File:Commerce_Court_North.JPG
 *  hist   "CIBC Commerce Court North Tower, 1930s (F1257 s1057 it0409).jpg",
 *         Alexandra Studio, public domain — the whole tower from above.
 *         https://commons.wikimedia.org/wiki/File:CIBC_Commerce_Court_North_Tower,_1930s_(F1257_s1057_it0409).jpg
 *  tdc    "Scotia Bank Plaza as seen from Toronto Dominion Centre.jpg",
 *         Maksims Sokolov (maxergon.com), CC BY-SA 4.0 — the shaft from the south-west.
 *         https://commons.wikimedia.org/wiki/File:Scotia_Bank_Plaza_as_seen_from_Toronto_Dominion_Centre.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the base block's south and courtyard faces are unphotographed
 * here (plain stone with grouped windows); the copper roof's shape and rise;
 * the corner heads and fine Romanesque ornament are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { ccw, cornice, offset, prism, save, type XY } from './atl-flatiron-building'

const stone = new Part(), win = new Part(), roof = new Part(), copper = new Part(), door = new Part()

const OUT: XY[] = [[-22.09, -24.90], [22.10, -25.07], [22.09, 24.89], [-22.09, 25.06]]
const CORE: XY[] = [[-13.55, -4.06], [14.82, -3.95], [14.60, 24.92], [-13.78, 25.02]]
const BAYS: XY[] = [[-15.81, 1.49], [17.14, 1.61], [17.00, 19.58], [-15.95, 19.46]]
const S1: XY[] = [[-11.98, -0.89], [12.97, -0.83], [12.82, 22.91], [-12.14, 22.84]]
const S2: XY[] = [[-10.51, 0.15], [11.38, 0.19], [11.26, 21.41], [-10.62, 21.39]]
// OSM way/306196014 is 17.5 x 16.7 m; the massing (19.5 x 19.2) and simonp (the top stage about
// three quarters of the shaft's width) show it wider: drawn 1 m out all round.
const S3: XY[] = offset([[-8.32, 2.29], [9.21, 2.33], [9.10, 19.05], [-8.43, 19.01]], 1.0)
const BASE = 36, BAY_TOP = 102, CORE_TOP = 111, S1_TOP = 123, S2_TOP = 133, PARAPET = 142.5, PIER_TOP = 145, APEX = 145.5

const pip = (p: XY, poly: XY[]) => {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
const SOLIDS: [XY[], number][] = [[OUT, BASE], [CORE, CORE_TOP], [BAYS, BAY_TOP], [S1, S1_TOP], [S2, S2_TOP], [S3, PARAPET]]
/** How high the masses in front of a wall point reach (0 if none). */
const cover = (q: XY) => Math.max(0, ...SOLIDS.filter(([r]) => pip(q, r)).map(([, h]) => h))

// ── the masses
// the cornice stays inside the outline (a neighbour abuts the west face)
prism(stone, offset(OUT, -0.5), 0, BASE, roof, 0.4)
cornice(stone, offset(OUT, -0.5), BASE - 1.2, 1.2, 0.5, roof)
prism(stone, CORE, BASE - 0.5, CORE_TOP, roof, 0.4)
prism(stone, BAYS, BASE - 0.5, BAY_TOP, roof, 0.4)
prism(stone, S1, CORE_TOP - 0.5, S1_TOP, roof, 0.4)
prism(stone, S2, S1_TOP - 0.5, S2_TOP, roof, 0.4)
prism(stone, S3, S2_TOP - 0.5, PARAPET, roof, 0.3)

// ── a wall's frame: P(s, z) is s metres along a→b, z up, just off the wall
function frame(a: XY, b: XY, out = 0.06) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const P = (s: number, z: number, o = out): V3 => [a[0] + t[0] * s + n[0] * o, a[1] + t[1] * s + n[1] * o, z]
  const front = (s: number): XY => [a[0] + t[0] * s + n[0] * 0.4, a[1] + t[1] * s + n[1] * 0.4]
  return { L, t, n, P, front }
}
function rect(p: Part, P: (s: number, z: number) => V3, s0: number, s1: number, z0: number, z1: number) {
  p.quad(P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1))
}
/** A round-headed opening: jambs from z0 to the springing, a true semicircle over. */
function arch(p: Part, P: (s: number, z: number) => V3, sc: number, w: number, z0: number, crown: number) {
  const r = w / 2, zs = crown - r, n = 10
  rect(p, P, sc - r, sc + r, z0, zs)
  const C = P(sc, zs)
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI, a1 = ((i + 1) / n) * Math.PI
    p.tri(C, P(sc + r * Math.cos(a0), zs + r * Math.sin(a0)), P(sc + r * Math.cos(a1), zs + r * Math.sin(a1)))
  }
}
const edges = (ring: XY[]) => ring.map((a, i) => [a, ring[(i + 1) % ring.length]] as [XY, XY])

// ── the shaft: bays of about 3.2 m, three storeys a band, where nothing stands in front
const SHAFT_BANDS: [number, number][] = []
for (let z = 38; z + 10 <= BAY_TOP - 1; z += 11) SHAFT_BANDS.push([z, z + 8.6])
SHAFT_BANDS.push([BAY_TOP + 1.2, CORE_TOP - 2.2])
for (const [ring, top] of [[CORE, CORE_TOP], [BAYS, BAY_TOP]] as [XY[], number][]) {
  for (const [a, b] of edges(ring)) {
    const f = frame(a, b), m = 1.2, n = Math.max(1, Math.round((f.L - 2 * m) / 3.2)), w = (f.L - 2 * m) / n
    for (let k = 0; k < n; k++) {
      const s0 = m + k * w + 0.8, s1 = m + (k + 1) * w - 0.8, lo = cover(f.front((s0 + s1) / 2))
      for (const [za, zb] of SHAFT_BANDS) if (za >= lo + 0.5 && zb <= top - 0.8) rect(win, f.P, s0, s1, za, zb)
    }
  }
}

// ── the stages: three tall round-arched windows in the middle of each face, plain ones at the corners
for (const [ring, z0, z1] of [[S1, CORE_TOP, S1_TOP], [S2, S1_TOP, S2_TOP]] as [XY[], number, number][]) {
  for (const [a, b] of edges(ring)) {
    const f = frame(a, b), c = f.L / 2
    for (const d of [-4.4, 0, 4.4]) arch(win, f.P, c + d, 2.2, z0 + 1.5, z1 - 1.6)
    for (const s of [1.6, f.L - 1.6]) if (f.L > 20) rect(win, f.P, s - 0.6, s + 0.6, z0 + 2, z1 - 3)
  }
}
// ── the top stage: three giant arches a face, the parapet's five piers, the copper roof
for (const [a, b] of edges(S3)) {
  const f = frame(a, b), c = f.L / 2
  for (const d of [-5.0, 0, 5.0]) arch(win, f.P, c + d, 3.6, S2_TOP + 0.6, S2_TOP + 7.0)
  rect(win, f.P, c - 6.4, c + 6.4, PARAPET - 2.0, PARAPET - 1.0) // the parapet's row of small openings
  for (const s of [0.7, c - 2.5, c, c + 2.5, f.L - 0.7]) {
    const q = (u: number, v: number): XY => [a[0] + f.t[0] * (s + u) - f.n[0] * v, a[1] + f.t[1] * (s + u) - f.n[1] * v]
    prism(stone, ccw([q(-0.7, 0), q(0.7, 0), q(0.7, 1.4), q(-0.7, 1.4)]), PARAPET - 0.3, PIER_TOP, stone, 0.25)
  }
}
{
  const inset: XY[] = S3.map(([x, y]) => [x + (x < 0 ? 1.6 : -1.6), y + (y < 10 ? 1.6 : -1.6)])
  const cx = inset.reduce((s, q) => s + q[0], 0) / 4, cy = inset.reduce((s, q) => s + q[1], 0) / 4
  const ridge = 1.0 // a short ridge along y: a hipped roof
  const r0: V3 = [cx, cy - ridge, APEX], r1: V3 = [cx, cy + ridge, APEX]
  const [A, B, C, D] = inset.map(([x, y]) => [x, y, PARAPET - 0.4] as V3)
  copper.tri(A, B, r0); copper.quad(B, C, r1, r0); copper.tri(C, D, r1); copper.quad(D, A, r0, r1)
}

// ── the base block: grouped windows, the great arches and the King Street doors
const ARCHES: Record<number, number> = {} // edge index → centre s
{
  const e = edges(offset(OUT, -0.5))
  ARCHES[1] = 10.5 + 24.57 // east face, opposite the tower's middle
  ARCHES[2] = frame(e[2][0], e[2][1]).L / 2 // north face, King Street, over the entrance
  ARCHES[3] = 24.56 - 10.5 // west face
  e.forEach(([a, b], i) => {
    const f = frame(a, b), sc = ARCHES[i]
    if (sc !== undefined) arch(win, f.P, sc, 9, 7, 18.5)
    if (i === 2) rect(door, f.P, sc - 2.6, sc + 2.6, 0.2, 5.6)
    const m = 1.4, n = Math.round((f.L - 2 * m) / 5), w = (f.L - 2 * m) / n
    for (let k = 0; k < n; k++) {
      const s0 = m + k * w + 1.6, s1 = m + (k + 1) * w - 1.6, mid = (s0 + s1) / 2
      if (sc !== undefined && Math.abs(mid - sc) < 6.5) continue
      for (const [za, zb] of [[2.5, 7.5], [11, 19], [22.5, 32.5]]) rect(win, f.P, s0, s1, za, zb)
    }
  })
}

const lit = (p: V3, nrm: V3) => (p[2] > 105 && nrm[2] < 0.7 ? 0.55 : 0)
if (import.meta.main) {
  await save('tor-commerce-court-north', 'Commerce Court North', [
    { part: stone, material: { ...finish('ccn-limestone', 0xdcd3c2), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: copper, material: PALETTE.copper },
    { part: door, material: PALETTE.entrance },
  ], { anchor: [43.6485896, -79.3790268], bearing: 343.3 }, 6500)
}
