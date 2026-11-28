/**
 * London Heathrow's air traffic control tower (NATS; Richard Rogers
 * Partnership, opened 2007), the slender mast between Terminals 3 and 5's
 * approach roads with its glass cab on top, held by cables — procedural,
 * CC0-1.0, no textures.
 * bun generators/london-heathrow-control-tower.ts
 *
 * Writes models/london-heathrow-control-tower.glb (a single level of detail).
 *
 * Map frame: x = model east, y = model north, z up, metres; bearing 0.
 * Anchor: OSM node/12886892988 (the tower, man_made=tower,
 * tower:type=aircraft_control, height 86.87), which is also the centre of
 * the mast and cab parts.
 *
 * Identifying features (photos): a white round mast with a vertical row of
 * small port holes; at its top a grey steel collar flaring out to a short
 * red-orange drum; a dark gallery platform; the cab, an inverted cone of
 * dark green glass, wider at the top, under a flat roof with antennas; three
 * pairs of steel cables from under the collar down to footings beyond the
 * base; the base building, a rounded triangle of teal glass on pilotis, two
 * storeys and a set-back top storey.
 *
 * Evidence
 * - OSM: node/12886892988 (height 86.87); way/1392144236 (the base building
 *   outline) with building:parts way/220594308 (the base, height 32 — far
 *   too tall against every photo: the base is about 15 m; used for the plan
 *   only), way/1392144239 (32–36 m), way/1392144238 (the mast, 36–82 m,
 *   4.4 m across) and way/1392144237 (the cab, 82–104 m, 19 m across); the
 *   part heights add to more than the published 87 m and are not used.
 * - Published: 87 m tall, opened 2007 (Wikipedia, "Heathrow Airport"; OSM's
 *   86.87 m).
 * - Photos (Wikimedia Commons):
 *   https://commons.wikimedia.org/wiki/File:Heathrow_Air_Traffic_Control_Tower_2009-11-15.jpg
 *     (David Jones, CC BY 2.0) side-on from Terminal 3: every height here
 *     was scaled from it against the published 87 m;
 *   https://commons.wikimedia.org/wiki/File:LHR_Control_Tower.jpg
 *     (Horocassi234, CC BY-SA 4.0) from the apron: the base building, the
 *     three cable pairs and their footings, the colours;
 *   https://commons.wikimedia.org/wiki/File:Base_of_the_Air_Traffic_Control_Tower,_Heathrow_Airport_-_geograph.org.uk_-_5566654.jpg
 *     (Ian S, CC BY-SA 2.0) the base building's glazing, pilotis and
 *     set-back top storey;
 *   https://commons.wikimedia.org/wiki/File:Control_tower_at_London_Heathrow_Airport_-_geograph.org.uk_-_3512743.jpg
 *     (Anthony Parkes, CC BY-SA 2.0) at dusk from the airfield: the lit cab.
 * - No lidar.
 *
 * Heights and widths (re-measured in review round 1 from crops of Jones's
 * photo, 15.5 px a metre, ground at 1475 px, roof at 128 px = 87 m):
 * base: recessed ground storey 0–4.5 m, glazed storey 4.5–10.8 m, white
 * slab edge, set-back glazed top storey to 15 m, white roof edge to 15.6 m,
 * 38 m across side-on (595 px; OSM's outline agrees); white mast 4.9 m
 * across (76 px) to 60 m; grey collar 60–67.2 m, its fins from 59.7 m,
 * 7.9 m across at the top; red drum 67.2–72.3 m, 8.9 m across (138 px);
 * gallery platform 72.3–74.8 m, 15.7 m across (243 px); cab 74.8–86 m,
 * 11.6 m across at the foot and 17.2 m at the top (266 px), so the cab's
 * head is about 3.5 times the mast's width in this photo (3.1 times in
 * Horocassi's); roof to 87 m. Cables 0.4 m thick (drawn); footings 30 m
 * out, beyond the base's corners (Horocassi's photo shows them 21–27 m
 * from the mast in projection), towards the base triangle's three corners.
 * Doubts: the exact cable directions (the photos agree on three pairs);
 * the mast's port holes are left out (too small).
 */
import { type V3 } from './mesh'
import { finish, windowVariant } from './palette'
import { type XY, quadN, unit, capPoly, insetRing } from './nyc-570-lexington'
import { prismRing, newMats, writeLod, drum, simplify } from './tokyo-haneda-terminal-1'
import { LHR } from './london-heathrow-terminal-5'

/** OSM way/1392144236, the base building, around the anchor. */
const BASE: XY[] = [[20.3,4.2],[20.7,7.6],[20.5,9.9],[19.7,12.6],[18.4,14.1],[16.3,15.8],[13.4,17.5],[10.2,17.7],[-10.2,18.1],[-12.5,17.5],[-15.0,16.2],[-16.8,13.4],[-17.4,10.6],[-16.6,7.2],[-4.8,-14.5],[-1.9,-17.8],[1.2,-18.3],[3.5,-18.3],[5.2,-17.6],[6.9,-16.6],[10.3,-13.6]]

const Z_BASE = 15.6, Z_MAST = 60, Z_COLLAR = 67.2, Z_DRUM = 72.3, Z_DECK = 74.8, Z_CAB = 86, Z_ROOF = 87

/** A thin round rod from a to b (a cable). */
function rod(p: import('./mesh').Part, a: V3, b: V3, r: number, n = 5) {
  const d = unit([b[0] - a[0], b[1] - a[1], b[2] - a[2]])
  const t = unit(Math.abs(d[2]) < 0.9 ? [-d[1], d[0], 0] : [1, 0, 0])
  const s: V3 = [d[1] * t[2] - d[2] * t[1], d[2] * t[0] - d[0] * t[2], d[0] * t[1] - d[1] * t[0]]
  for (let i = 0; i < n; i++) {
    const a0 = (2 * Math.PI * i) / n, a1 = (2 * Math.PI * (i + 1)) / n
    const o0: V3 = [t[0] * Math.cos(a0) + s[0] * Math.sin(a0), t[1] * Math.cos(a0) + s[1] * Math.sin(a0), t[2] * Math.cos(a0) + s[2] * Math.sin(a0)]
    const o1: V3 = [t[0] * Math.cos(a1) + s[0] * Math.sin(a1), t[1] * Math.cos(a1) + s[1] * Math.sin(a1), t[2] * Math.cos(a1) + s[2] * Math.sin(a1)]
    const P = (c: V3, o: V3): V3 => [c[0] + o[0] * r, c[1] + o[1] * r, c[2] + o[2] * r]
    quadN(p, P(a, o0), P(a, o1), P(b, o1), P(b, o0), [o0, o1, o1, o0])
  }
}

function build() {
  const M = newMats(['white', 'metal', 'red', 'cab', 'base', 'roof'])

  // --- the base building (Jones's photo): a recessed ground storey on pilotis, a tall glazed
  // storey, a thin white slab edge, a slightly set-back glazed top storey and a white roof edge ---
  const ring = simplify(BASE, 0.3)
  prismRing(M.metal, insetRing(ring, 1.6), 0, 4.5, null)
  prismRing(M.base, ring, 4.5, 10.8, null)
  prismRing(M.white, insetRing(ring, -0.4), 10.8, 11.3, M.roof, M.white)
  const top = insetRing(ring, 0.6)
  prismRing(M.base, top, 11.3, Z_BASE - 0.6, null)
  prismRing(M.white, insetRing(top, -0.25), Z_BASE - 0.6, Z_BASE, M.roof)
  // pilotis along the recessed ground storey
  const pil = insetRing(ring, 0.6)
  for (let i = 0; i < pil.length; i += 2) drum(M.white, pil[i][0], pil[i][1], 0.35, 0.35, 0, 4.5, 6, null)

  // --- the mast, collar, drum, gallery and cab ---
  drum(M.white, 0, 0, 2.4, 2.4, Z_BASE - 0.5, Z_MAST, 16, null)
  // the collar: grey steel flaring from the mast to the drum
  drum(M.metal, 0, 0, 2.5, 2.6, Z_MAST, Z_MAST + 2.4, 16, null)
  drum(M.metal, 0, 0, 2.6, 3.95, Z_MAST + 2.4, Z_COLLAR, 16, M.metal)
  // three fins from the collar down the mast (the cable anchor plates), as in the photos
  for (const ang of CABLE_DIRS) {
    const c = Math.cos(ang), s = Math.sin(ang)
    const a: XY = [c * 2.2, s * 2.2], b: XY = [c * 4.1, s * 4.1], n: XY = [-s * 0.3, c * 0.3]
    prismRing(M.metal, [[a[0] - n[0], a[1] - n[1]], [b[0] - n[0], b[1] - n[1]], [b[0] + n[0], b[1] + n[1]], [a[0] + n[0], a[1] + n[1]]], Z_MAST - 0.3, Z_COLLAR, M.metal)
  }
  drum(M.red, 0, 0, 4.4, 4.4, Z_COLLAR, Z_DRUM, 16, null)
  // the gallery platform
  drum(M.metal, 0, 0, 4.4, 7.6, Z_DRUM - 0.4, Z_DRUM + 0.6, 16, null)
  drum(M.metal, 0, 0, 7.6, 7.6, Z_DRUM + 0.6, Z_DECK, 16, M.metal)
  // the cab: an inverted cone of glass, wider at the top, with a frame ring at the head
  drum(M.cab, 0, 0, 5.8, 8.4, Z_DECK, Z_CAB, 16, null)
  for (let i = 0; i < 16; i += 2) { // mullions: pale ribs on the glass
    const a0 = (2 * Math.PI * i) / 16
    const c = Math.cos(a0), s = Math.sin(a0)
    const t: XY = [-s * 0.18, c * 0.18]
    const q0: V3 = [c * 5.85, s * 5.85, Z_DECK], q1: V3 = [c * 8.45, s * 8.45, Z_CAB]
    const nn = unit([c, s, -(8.4 - 5.8) / (Z_CAB - Z_DECK)])
    quadN(M.metal, [q0[0] - t[0], q0[1] - t[1], q0[2]], [q0[0] + t[0], q0[1] + t[1], q0[2]], [q1[0] + t[0], q1[1] + t[1], q1[2]], [q1[0] - t[0], q1[1] - t[1], q1[2]], [nn, nn, nn, nn])
  }
  drum(M.metal, 0, 0, 8.6, 8.6, Z_CAB, Z_ROOF, 16, M.roof)
  // antennas on the roof
  for (const [x, y] of [[3, 2], [-3.5, 1], [0.5, -3.5]] as XY[]) drum(M.white, x, y, 0.15, 0.1, Z_ROOF, Z_ROOF + 3.5, 5, null)
  drum(M.metal, 0, 0, 1.8, 1.8, Z_ROOF, Z_ROOF + 1.2, 10, M.metal)

  // --- the cables: three pairs from under the collar to footings 26 m out ---
  for (const ang of CABLE_DIRS) {
    const c = Math.cos(ang), s = Math.sin(ang), n: XY = [-s, c]
    const foot: XY = [c * 30, s * 30]
    for (const k of [-1, 1]) {
      const top: V3 = [c * 4.2 + n[0] * k * 0.5, s * 4.2 + n[1] * k * 0.5, Z_MAST - 2]
      const bot: V3 = [foot[0] + n[0] * k * 1.0, foot[1] + n[1] * k * 1.0, 1.8]
      rod(M.metal, top, bot, 0.2)
    }
    // the footing: a sloped grey block
    const r0: XY[] = [[-2, -1.6], [2, -1.6], [2, 1.6], [-2, 1.6]].map(([u, v]) => [foot[0] + c * u + n[0] * v, foot[1] + s * u + n[1] * v] as XY)
    prismRing(M.metal, r0, 0, 1.8, M.metal)
  }

  return [
    { part: M.white, material: finish('lhr-tower-white', 0xe8eaea) },
    { part: M.metal, material: finish('lhr-tower-steel', 0x8d9297) },
    { part: M.red, material: finish('lhr-tower-red', 0xc8604a) },
    { part: M.cab, material: { name: 'window', color: 0x6f8f97, roughness: 0.35 } },
    { part: M.base, material: windowVariant(2, 0x84aaa6) },
    { part: M.roof, material: LHR.roof },
  ]
}

/** Cable directions, towards the base triangle's corners (north-east, north-west, south). */
const CABLE_DIRS = [Math.atan2(12, 19), Math.atan2(13, -16), Math.atan2(-18, 1)]

if (import.meta.main) {
  const extras = { bearing: 0, osm: 'node/12886892988', height: Z_ROOF + 3.5 }
  writeLod('Heathrow Control Tower', 'london-heathrow-control-tower.glb', build(), extras, 5000, 250_000)
}

export { capPoly }
