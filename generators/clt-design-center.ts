/**
 * Design Center of the Carolinas: the Nebel Knitting Mill (1929) and its
 * water tower, 101 W. Worthington Ave, South End, Charlotte — procedural,
 * CC0-1.0.
 * bun generators/clt-design-center.ts
 *
 * The Nebel Knitting Company's hosiery mill (NRHP, Wikidata Q19461793),
 * since the 1990s the core of the Design Center of the Carolinas and, after
 * a 2020s renovation, shops and restaurants round an open courtyard. Two tall
 * storeys of dark red-brown brick with wide steel-framed windows between
 * brick piers, a flat white roof behind a plain parapet, a slight jog at the
 * Camden Road / Worthington corner (the "1929" datestone block), and the
 * identifying feature: the mill's elevated water tank, rising from the
 * courtyard far above the roof, painted pale with "Design Center of the
 * Carolinas" on the drum (lettering not modelled).
 *
 * Evidence:
 *  - OSM: relation/16116037 (outer way/432929166, courtyard way/1191248743),
 *    building:parts way/1416657152–1416657158 (heights 4–10 m),
 *    node/5340071477 (man_made=water_tower).
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 0.5 m (ground_min
 *    219.82 m NAVD88). Base = lowest ground, on the west (Hawkins St) side;
 *    the ground rises ~2 m to Camden Rd. Heights above base: the roof deck
 *    9.7 m, parapets ~10.4 m, the south strips 5.4 m and ~4 m, the courtyard
 *    block 7.4 m, the tank's top 40.6 m. The lidar still shows a roof over
 *    the middle (~15 m) that the renovation removed; the courtyard follows
 *    OSM (and current NAIP), not the lidar.
 *  - Photos (Commons, City Dweller 2, 2024, CC BY-SA 4.0): "Design Center of
 *    the Carolinas Early April 2024" (the Camden face and the tower from the
 *    light-rail line), "Design Center at the Corner of Worthington and Camden
 *    Mid-April 2024" (the 1929 corner block), "Superica at the Design Center
 *    on Worthington Mid-April 2024" (the Worthington face: window and pier
 *    sizes). USGS NAIP for the plan, the white roof and the courtyard.
 *  - James Willamor, "Charlotte Aerial Photography - South End" (Flickr,
 *    2009, CC BY-SA 2.0) for the area from above.
 *
 * Estimated: the tank's proportions (from the 2024 photo, scaled to the lidar
 * top: bowl 30.6–33.3 m, drum to 38.9 m, roof to 40.3 m, radius 3.3 m), the
 * legs' spread, window sizes (Superica photo: ~3.3 m wide on a 4.0 m bay).
 *
 * Note: this is the same building as the plan's clt-nebel-knitting-mill.
 *
 * Model frame: bearing 30 (model +y faces 30°, toward Worthington Ave; +x is
 * the Camden Road side); metres above the base.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type Block, type Kit, type Row, type XY, MILL_ROOF, build, quad, tri, write } from './clt-highland-park-mill-3'

const NEBEL_BRICK = finish('nebel-brick', 0x9e6a5d)
const TANK = finish('tank-silver', 0xc9d3da)

/** Ground above base, from the lidar: rises ~2 m east (sd 0.3 m). */
const ground = (p: XY) => Math.max(0, (p[0] + 26) * 0.0356)

// OSM parts, in the model frame.
const WEST: XY[] = [[-25.7, 28.9], [-25.5, -19.9], [-9.7, -19.6], [-9.6, 19.8], [-7.5, 19.9], [-7.6, 29.1]]
const RING: XY[] = [[-7.5, 19.9], [-7.6, 29.1], [35.6, 29.6], [35.7, 19.8], [32.3, 19.7], [32.5, -24.9], [2.9, -25.2], [-1.8, -25.3], [-1.7, -19.4], [-9.7, -19.6], [-9.6, -14.8], [-1.9, -14.7], [5.2, -14.6], [5.2, -11.8], [14.5, -11.7], [14.4, -4.5], [14.3, 20.1], [9.0, 20.0]]
const SKILLION: XY[] = [[9.0, 20.0], [9.0, 13.7], [5.3, 13.7], [5.3, 5.7], [9.4, 5.7], [9.4, -4.5], [14.4, -4.5], [14.3, 20.1]]
const SOUTH_E: XY[] = [[-1.8, -25.3], [-1.8, -28.0], [-8.2, -28.0], [-9.8, -26.5], [-9.8, -23.2], [-9.7, -19.6], [-1.7, -19.4]]
const SOUTH_LOW: XY[] = [[-9.8, -26.5], [-25.8, -26.6], [-25.8, -24.9], [-19.3, -24.9], [-14.8, -23.3], [-9.8, -23.2]]
const SOUTH_W: XY[] = [[-9.8, -23.2], [-9.7, -19.6], [-25.5, -19.9], [-25.8, -24.9], [-19.3, -24.9], [-14.8, -23.3]]
const YARD: XY[] = [[-9.5, -6.8], [-9.6, -14.8], [-1.9, -14.7], [-2.0, -6.8]]
/** node/5340071477. */
const TANK_AT: XY = [-2.9, -1.2]

function ringAt(c: XY, r: number, z: number, seg: number): V3[] {
  return Array.from({ length: seg }, (_, i) => { const a = (i / seg) * 2 * Math.PI; return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z] as V3 })
}
/** A smooth-shaded surface of revolution through (r, z) profile points. */
function lathe(p: Part, c: XY, prof: [number, number][], seg = 16) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    const A = ringAt(c, r0, z0, seg), B = ringAt(c, r1, z1, seg)
    const dr = r1 - r0, dz = z1 - z0, L = Math.hypot(dr, dz) || 1
    const N = (i: number): V3 => { const a = (i / seg) * 2 * Math.PI; return [Math.cos(a) * dz / L, Math.sin(a) * dz / L, -dr / L] }
    for (let i = 0; i < seg; i++) {
      const j = (i + 1) % seg
      if (r0 > 1e-3) p.tri(A[i], A[j], B[j], undefined, undefined, undefined, [N(i), N(j), N(j)])
      if (r1 > 1e-3) p.tri(A[i], B[j], B[i], undefined, undefined, undefined, [N(i), N(j), N(i)])
    }
  }
}
/** A square strut between two points. */
function strut(p: Part, a: V3, b: V3, w: number) {
  const t: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...t)
  const T: V3 = [t[0] / L, t[1] / L, t[2] / L]
  const ref: V3 = Math.abs(T[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const s1: V3 = [T[1] * ref[2] - T[2] * ref[1], T[2] * ref[0] - T[0] * ref[2], T[0] * ref[1] - T[1] * ref[0]]
  const l1 = Math.hypot(...s1), S: V3 = [s1[0] / l1, s1[1] / l1, s1[2] / l1]
  const U: V3 = [T[1] * S[2] - T[2] * S[1], T[2] * S[0] - T[0] * S[2], T[0] * S[1] - T[1] * S[0]]
  const at = (q: V3, i: number, j: number): V3 => [q[0] + (S[0] * i + U[0] * j) * w / 2, q[1] + (S[1] * i + U[1] * j) * w / 2, q[2] + (S[2] * i + U[2] * j) * w / 2]
  const ring = (q: V3) => [at(q, -1, -1), at(q, 1, -1), at(q, 1, 1), at(q, -1, 1)]
  const R0 = ring(a), R1 = ring(b)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4, m: V3 = [(R0[i][0] + R0[j][0]) / 2 - a[0], (R0[i][1] + R0[j][1]) / 2 - a[1], (R0[i][2] + R0[j][2]) / 2 - a[2]]
    quad(p, R0[i], R0[j], R1[j], R1[i], m)
  }
}

export function buildDesignCenter() {
  const brick = new Part(), win = new Part(), trim = new Part(), roof = new Part(), tank = new Part()
  const kit: Kit = { win, trim, roof, ground }
  // Two tall storeys of wide steel windows between brick piers.
  const mill: Row[] = [{ z0: 2.4, z1: 5.5, w: 3.4 }, { z0: 6.3, z1: 9.7, w: 3.4 }]
  const low: Row[] = [{ z0: 1.6, z1: 3.8, w: 2.6 }]
  const blocks: Block[] = [
    { poly: WEST, top: 10.4, wall: brick, rows: mill, pitch: 4.0 },
    // The 1929 corner block's Camden face is blank below and has three small
    // upper windows (corner photo); drawn below.
    { poly: RING, top: 10.4, wall: brick, rows: mill, pitch: 4.0, blank: (o, m) => o[0] > 0.9 && m[1] > 20 },
    { poly: SOUTH_W, top: 10.0, wall: brick, rows: mill, pitch: 4.0 },
    { poly: SOUTH_E, top: 5.4, wall: brick, rows: low, pitch: 3.6 },
    { poly: SOUTH_LOW, top: 4.3, wall: brick },
    { poly: YARD, top: 7.6, wall: brick, rows: low, pitch: 3.6 },
    { poly: SKILLION, top: 4.8, wall: brick, rows: low, pitch: 3.6 },
  ]
  build(blocks, kit)
  // The 1929 corner block's raised centre parapet (corner photo).
  {
    const x = 35.7, y0 = 22.2, y1 = 27.2, z0 = 10.4, z1 = 11.3, N: V3 = [1, 0, 0]
    quad(brick, [x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1], N)
    quad(trim, [x, y0, z1], [x, y1, z1], [x - 0.4, y1, z1], [x - 0.4, y0, z1], [0, 0, 1])
    quad(brick, [x - 0.4, y1, z0], [x - 0.4, y0, z0], [x - 0.4, y0, z1], [x - 0.4, y1, z1], [-1, 0, 0])
    tri(brick, [x, y0, z0], [x, y0, z1], [x - 0.4, y0, z1], [0, -1, 0])
    tri(brick, [x, y0, z0], [x - 0.4, y0, z1], [x - 0.4, y0, z0], [0, -1, 0])
    tri(brick, [x, y1, z0], [x - 0.4, y1, z1], [x, y1, z1], [0, 1, 0])
    tri(brick, [x, y1, z0], [x - 0.4, y1, z0], [x - 0.4, y1, z1], [0, 1, 0])
  }
  for (const [y, w] of [[21.6, 1.6], [24.7, 2.1], [27.8, 1.6]]) quad(win, [35.75, y - w / 2, 6.9], [35.75, y + w / 2, 6.9], [35.75, y + w / 2, 8.9], [35.75, y - w / 2, 8.9], [1, 0, 0])

  // --- The water tower.
  const [cx, cy] = TANK_AT, g0 = ground(TANK_AT)
  const BOWL = 30.6, DRUM = 33.3, EAVE = 38.9, PEAK = 40.3, R = 3.3
  // Four legs, battered in from a 9 m square to the drum, a central riser,
  // two rings of struts and the balcony.
  const legAt = (z: number): XY[] => {
    const h = 4.5 + (2.5 - 4.5) * (z - g0) / (DRUM - g0)
    return [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]]
  }
  const L0 = legAt(g0 - 0.3), L1 = legAt(DRUM)
  for (let i = 0; i < 4; i++) strut(tank, [L0[i][0], L0[i][1], g0 - 0.3], [L1[i][0], L1[i][1], DRUM], 0.9)
  for (const z of [14.0, 24.0]) {
    const Q = legAt(z)
    for (let i = 0; i < 4; i++) strut(tank, [Q[i][0], Q[i][1], z], [Q[(i + 1) % 4][0], Q[(i + 1) % 4][1], z], 0.4)
  }
  lathe(tank, TANK_AT, [[0.55, g0 - 0.3], [0.55, BOWL + 0.2]], 8)
  lathe(roof, TANK_AT, [[R + 0.7, DRUM - 0.15], [R + 0.7, DRUM + 0.15], [R, DRUM + 0.15]], 16)
  lathe(roof, TANK_AT, [[R, DRUM - 0.15], [R + 0.7, DRUM - 0.15]], 16)
  // Bowl, drum, conical roof and finial.
  lathe(tank, TANK_AT, [[0.6, BOWL], [1.9, BOWL + 0.6], [2.8, BOWL + 1.5], [R, DRUM]])
  lathe(tank, TANK_AT, [[R, DRUM], [R, EAVE]]) // drum: silver like the bowl in the 2024 photos (lead review)
  lathe(tank, TANK_AT, [[R + 0.15, EAVE], [R * 0.45, PEAK - 0.4], [0.35, PEAK], [0.0, PEAK + 0.3]])
  lathe(tank, TANK_AT, [[R, EAVE], [R + 0.15, EAVE]])

  return {
    id: 'clt-design-center', name: 'Design Center of the Carolinas', anchor: [0, 0] as XY, height: PEAK + 0.3,
    parts: [
      { part: brick, material: NEBEL_BRICK },
      { part: roof, material: MILL_ROOF },
      { part: win, material: PALETTE.window },
      { part: trim, material: PALETTE.trim },
      { part: tank, material: TANK },
    ],
  }
}

if (import.meta.main) await write(buildDesignCenter())
