/**
 * Los Angeles International Airport (LAX): the Airport Traffic Control
 * Tower, Siegel Diamond Architects with Holmes & Narver, 1996, 277 ft —
 * procedural, CC0-1.0, no textures.
 *
 *   bun generators/la-lax-control-tower.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 351 (the
 * shaft's faces and the head's cross lie about 9 degrees anticlockwise of
 * north: OSM octagon 354, lidar head 345). Anchor = centroid of the OSM
 * tower part way/534332717 (-118.403822, 33.9440004), which the lidar
 * confirms as the shaft's centre (the NAIP aerial leans the tower east).
 *
 * Identity (photos): a tall pale concrete shaft of chamfered-square plan
 * with a teal glass slot running up it; teal glazed bays round its top
 * floors; a big dark "palm crown" head, a cross of four broad arms with
 * silver tops sloping down and out, carried by white struts from the
 * shaft; the cab's teal glass and a white upper box on top. At night the
 * glazed bays and the cab glow pale green-white and the shaft is
 * floodlit (Murphy and Miwa night photos below).
 *
 * Evidence
 * - OSM: way/534332717 (building:part control_tower, height 85.8, the
 *   shaft's octagon 12.5 m across, chamfers 3.5 m), way/413226266 (the
 *   tower's base building, ele 30).
 * - Lidar: USGS 3DEP CA_LosAngeles_1_B23 (USGS LA County lidar, 2023
 *   work unit), 0.5 m grid, heights above ground_min 31.85 m (the
 *   courtyard round the foot): cab roof 85.6 (antenna 88.2), the ring
 *   at 80-84 round the cab, head centre 75.5-76, the head's cross arms
 *   reaching 13.5 m east and west and 15 m north and south (the tips are sparse in the lidar; photo ratios agree), 14 m wide, their tips 72.3-73.5; the base's
 *   east block a barrel roof 24.6 at the crest, about 20 at the eaves;
 *   the rest of the base 4.5 m and lower. Cross-checked with the 2016
 *   flight (USGS_LPC_CA_LosAngeles_2016_LAS_2018): 85.7 m.
 * - Published: 277 ft (84.4 m) to the cab roof, 1996, Siegel Diamond
 *   Architects (Wikipedia, "Los Angeles International Airport").
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Los_Angeles_International_Airport_Air_Traffic_Control_Tower_2019.jpg
 *     and _2019_2.jpg, Steven Lek, CC BY-SA 4.0 (from the departures
 *     road to the north: the head's arms, struts, the glazed bay and the
 *     slot, the barrel-roofed base block east of the foot);
 *   Los_Angeles_International_Airport,_Air_Traffic_Control_Tower_1_2018-05-20.jpg,
 *     FASTILY, CC BY-SA 4.0 (from the north-east);
 *   Control_tower_at_LAX_(6030868843).jpg, Moto "Club4AG" Miwa, CC BY 2.0
 *     (from the south across the apron);
 *   LAX_ATCT_Closeup_(2970224921).jpg and LAX_ATCT_(2145687750).jpg,
 *     John Murphy, CC BY-SA 2.0 (the head and cab);
 *   Cold_Night_at_LAX_(2144886849).jpg, John Murphy, CC BY-SA 2.0, and
 *     Control_Tower_at_LAX,_January_1st,_2011_(5315025155).jpg, Miwa,
 *     CC BY 2.0 (night: glazed bays and cab lit, shaft floodlit);
 *   LAX_LA.jpg, monkeytime, CC BY-SA 2.0 (dusk, from the Theme Building).
 *   USGS NAIP for the plan of the base.
 * - Colours: shaft pale warm grey concrete; the head's walls dark blue-
 *   grey metal, its arm tops silver; struts, cab roof and upper box white;
 *   glass teal.
 *
 * Estimated (photo-scaled against the lidar cab and head heights): the
 *   head's underside (60 m at the shaft, 68.5 m at the arm tips); the
 *   glazed bays 47-60 m, 1.4 m proud (Miwa photo, scaled 0.19 m/px from
 *   the lidar cab and rim); struts' feet at 45.5 m; the catwalks at 42.5
 *   and 53 m; the slot's width. Left out: antennas,
 *   rails, the art medallion on the shaft.
 * Doubts: the base building's west part is low and mostly hidden behind
 *   the parking structures in every photo; drawn plain. LAX's night
 *   lighting has changed over the years; the licensed night photos show
 *   the glazing lit pale green-white, not a coloured top, so it is
 *   `window` (glows warm on the map), not neon.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { clean, clip, cap, walls, inset, type XY } from './clt-terminal'

export const ANCHOR = { lng: -118.403822, lat: 33.9440004 }
export const BEARING = 351

const concrete = new Part(), glass = new Part(), dark = new Part(), top = new Part(), white = new Part()

/** A chamfered square ring (half-size h, chamfer leg c) at z, counter-clockwise. */
const cham = (h: number, c: number, z: number, cx = 0, cy = 0): V3[] => [
  [h, -h + c], [h, h - c], [h - c, h], [-h + c, h], [-h, h - c], [-h, -h + c], [-h + c, -h], [h - c, -h],
].map(([x, y]) => [cx + x, cy + y, z] as V3)
const capV = (p: Part, r: V3[], up = true) => p.cap(r, up)

// --- Shaft: chamfered square 12.4 m (OSM), to the head's underside.
const SH = 6.2, SC = 2.5, Z_HEAD0 = 60
concrete.loft([cham(SH, SC, 0), cham(SH, SC, Z_HEAD0)])
/** A flush panel on face `f` (0 E, 1 N, 2 W, 3 S) of the shaft: centred `s` along the face, `w` wide. */
function onFace(p: Part, f: number, s: number, w: number, z0: number, z1: number, out: number) {
  const a = (f * Math.PI) / 2, n: XY = [Math.cos(a), Math.sin(a)], u: XY = [-n[1], n[0]]
  const P = (t: number, z: number): V3 => [n[0] * (SH + out) + u[0] * t, n[1] * (SH + out) + u[1] * t, z]
  p.quad(P(s - w / 2, z0), P(s + w / 2, z0), P(s + w / 2, z1), P(s - w / 2, z1))
}
// the teal glass slot up the north and south faces (photos), lit at night
for (const f of [1, 3]) onFace(glass, f, f === 1 ? -0.9 : 0.9, 1.1, 6, 47, 0.06)

// --- Glazed bays on the east and west faces of the top floors, under the
// head (teal, lit at night; seen on the left from both north and south).
for (const f of [0, 2]) {
  const a = (f * Math.PI) / 2, n: XY = [Math.cos(a), Math.sin(a)], u: XY = [-n[1], n[0]]
  const w = 4.2, d = 1.4, z0 = 47, z1 = Z_HEAD0
  const P = (t: number, o: number, z: number): V3 => [n[0] * (SH + o) + u[0] * t, n[1] * (SH + o) + u[1] * t, z]
  glass.quad(P(-w, d, z0), P(w, d, z0), P(w, d, z1), P(-w, d, z1))
  glass.quad(P(w, 0, z0), P(w, d, z0) , P(w, d, z1), P(w, 0, z1))
  glass.quad(P(-w, d, z0), P(-w, 0, z0), P(-w, 0, z1), P(-w, d, z1))
  concrete.quad(P(-w, 0, z0), P(w, 0, z0), P(w, d, z0), P(-w, d, z0)) // soffit
}

// --- Catwalks on the east and west faces (photos): thin slabs.
for (const [f, z] of [[0, 42.5], [2, 42.5], [0, 53], [2, 53]] as [number, number][]) {
  const a = (f * Math.PI) / 2, n: XY = [Math.cos(a), Math.sin(a)], u: XY = [-n[1], n[0]]
  const t = z > 45 ? 1.4 : 0, w = 4.6, d = 2.4 + t
  const ring: XY[] = [[-w, t], [w, t], [w, d], [-w, d]].map(([s, o]) => [n[0] * (SH + o) + u[0] * s, n[1] * (SH + o) + u[1] * s] as XY)
  walls(dark, ring, z - 0.6, z); cap(top, ring, z); cap(dark, ring, z - 0.6, false)
}

// --- The head: a cross of four broad arms (lidar), dark walls, silver tops
// sloping down and out, the underside tapering in to the shaft.
// the east-west arms reach 13.5 m from the axis, the north-south ones 15 m
const ARM = 7.0, TIPX = 13.5, TIPY = 15.0
/** The cross outline (arm half-width, east-west tip, north-south tip), counter-clockwise. */
const cross = (k: number, z: number, arm = ARM * k, tx = TIPX * k, ty = TIPY * k): V3[] => [
  [tx, -arm], [tx, arm], [arm, arm], [arm, ty], [-arm, ty], [-arm, arm], [-tx, arm], [-tx, -arm], [-arm, -arm], [-arm, -ty], [arm, -ty], [arm, -arm],
].map(([x, y]) => [x, y, z] as V3)
const Z_RIM = 68.5, Z_TIP = 73.0, Z_CROWN = 75.8
dark.loft([cross(1, Z_HEAD0, SH, SH + 0.3, SH + 0.3), cross(1, Z_RIM - 1.5, ARM * 0.97, TIPX * 0.92, TIPY * 0.92), cross(1, Z_RIM), cross(1, Z_TIP)])
capV(dark, cross(1, Z_HEAD0, SH, SH + 0.3, SH + 0.3), false)
// the silver arm tops, rising from the tips to the crown plate round the cab
const ringTop = cross(1, Z_TIP), ringIn = cross(0.62, Z_CROWN, 7.2, 8.4, 9.6)
top.loft([ringTop, ringIn])
capV(top, ringIn)
// a white lip along the arm tops' edges
white.loft([cross(1, Z_TIP - 0.5, ARM + 0.15, TIPX + 0.15, TIPY + 0.15), cross(1, Z_TIP + 0.15, ARM + 0.15, TIPX + 0.15, TIPY + 0.15)])
white.loft([cross(1, Z_TIP + 0.15, ARM + 0.15, TIPX + 0.15, TIPY + 0.15), cross(1, Z_TIP + 0.15)])

// --- Struts: from the shaft faces up and out to the arms' outer corners.
function strut(p: Part, P: V3, Q: V3, w: number) {
  const d = [Q[0] - P[0], Q[1] - P[1], Q[2] - P[2]], L = Math.hypot(d[0], d[1], d[2])
  const t: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const ref: V3 = Math.abs(t[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const nz = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l] }
  const s = nz([t[1] * ref[2] - t[2] * ref[1], t[2] * ref[0] - t[0] * ref[2], t[0] * ref[1] - t[1] * ref[0]])
  const q = nz([t[1] * s[2] - t[2] * s[1], t[2] * s[0] - t[0] * s[2], t[0] * s[1] - t[1] * s[0]])
  const h = w / 2
  const ring = (C: V3) => [[h, h], [-h, h], [-h, -h], [h, -h]].map(([a, b]) => [C[0] + s[0] * a + q[0] * b, C[1] + s[1] * a + q[1] * b, C[2] + s[2] * a + q[2] * b] as V3)
  const r0 = ring(P), r1 = ring(Q)
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; p.quad(r0[i], r0[j], r1[j], r1[i]); p.quad(r0[i], r1[i], r1[j], r0[j]) }
}
for (let f = 0; f < 4; f++) {
  const a = (f * Math.PI) / 2, n: XY = [Math.cos(a), Math.sin(a)], u: XY = [-n[1], n[0]]
  for (const sg of [-1, 1]) {
    const foot: V3 = [n[0] * (SH + 0.3) + u[0] * sg * 4.9, n[1] * (SH + 0.3) + u[1] * sg * 4.9, 45.5]
    const TIP = f % 2 ? TIPY : TIPX
    const tip: V3 = [n[0] * (TIP + 0.2) + u[0] * sg * (ARM - 0.6), n[1] * (TIP + 0.2) + u[1] * sg * (ARM - 0.6), Z_TIP + 0.1]
    strut(white, foot, tip, 0.75)
  }
}

// --- The cab: teal glass leaning out, a white overhanging roof, the white
// upper box, one mast for the antennas.
const CH = 6.2
glass.loft([cham(CH, 1.8, Z_CROWN), cham(CH + 0.35, 1.9, 80.6)])
white.loft([cham(CH + 0.35, 1.9, 80.6), cham(CH + 0.8, 2.0, 80.9), cham(CH + 0.8, 2.0, 81.8), cham(5.4, 1.6, 81.8)])
white.loft([cham(5.4, 1.6, 81.8), cham(5.4, 1.6, 85.0), cham(5.0, 1.4, 85.6)])
capV(top, cham(5.0, 1.4, 85.6))
{
  const sq = (h: number, z: number): V3[] => [[1.5 - h, 1.5 - h, z], [1.5 + h, 1.5 - h, z], [1.5 + h, 1.5 + h, z], [1.5 - h, 1.5 + h, z]]
  white.loft([sq(0.16, 85.6), sq(0.1, 88.2)]); white.cap(sq(0.1, 88.2), true)
}

// --- The base building (OSM way/413226266): its east block under a barrel
// roof (lidar: eaves ~20, crest 24.6, axis east-west), the rest low.
const BASE: XY[] = clean([[28.1, -15.5], [28.2, 7.1], [28.2, 14.8], [14.8, 15.2], [14.6, 7.4], [10.5, 7.5], [-10.2, 8.1], [-10.6, -7.7], [9.6, -8.2], [14.0, -8.4], [13.8, -15.1]], 0.2)
{
  const low = clean(clip(BASE, 1, 0, 14.2), 0.2) // x <= 14.2
  walls(concrete, low, 0, 4.5)
  cap(top, low, 4.5)
  // east block, x 14.2..28.9, y -15.5..15.2: dark panel walls to the eaves, a barrel vault
  const x0 = 14.2, x1 = 28.2, y0 = -15.4, y1 = 15.1, ze = 20.2, zc = 24.6, seg = 8
  const prof = Array.from({ length: seg + 1 }, (_, i) => { const t = i / seg, y = y0 + (y1 - y0) * t, v = (2 * t - 1); return [y, ze + (zc - ze) * (1 - v * v)] as XY })
  walls(concrete, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 0, ze)
  for (let i = 0; i < seg; i++) {
    const [ya, za] = prof[i], [yb, zb] = prof[i + 1]
    top.quad([x0, ya, za], [x1, ya, za], [x1, yb, zb], [x0, yb, zb])
    // the gable ends
    concrete.quad([x1, ya, ze], [x1, yb, ze], [x1, yb, zb], [x1, ya, za])
    concrete.quad([x0, yb, ze], [x0, ya, ze], [x0, ya, za], [x0, yb, zb])
  }
}

const shaftLight = (p: V3, n: V3) => (n[2] > 0.6 ? 0 : p[2] > 20 && p[2] < 63 ? 0.35 + 0.6 * ((p[2] - 20) / 43) : 0)
const parts: Array<{ part: Part; material: MaterialSpec }> = [
  { part: concrete, material: { ...finish('lax-tower-concrete', 0xd6d1c7), floodlight: shaftLight } },
  { part: glass, material: { name: 'window', color: 0x7fb2b5, roughness: 0.35 } },
  { part: dark, material: finish('lax-tower-head', 0x5d6770, 0.6) },
  { part: top, material: finish('lax-tower-silver', 0xbfc5c9, 0.6) },
  { part: white, material: { ...PALETTE.trim, floodlight: (p: V3) => (p[2] > 45 ? 0.7 : 0) } },
]

if (import.meta.main) {
  const tris = parts.reduce((n, { part }) => n + part.triangles, 0)
  const glb = writeGlb('LAX Airport Traffic Control Tower', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
    bearing: BEARING, elevation: 0, height: 88.2, replaces: ['way/413226266', 'way/534332717'],
  })
  const out = new URL('../models/la-lax-control-tower.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}
