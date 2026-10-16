/**
 * Camp North End: 301 Camp Road — procedural, CC0-1.0.
 * bun generators/clt-cne-301-camp-road.ts
 *
 * The north-east end of the Army Quartermaster Corps' Building No. 4
 * (1941–43), the shortest of the three warehouses the depot built south of
 * the Ford plant; its middle was taken down for Kinship West (2022–24) and its
 * south-west end is `clt-cne-1720-statesville`. Renovated by Camp North End
 * as shops and Free Range Brewing. A one-storey red-brick box 61 × 75 m on a
 * concrete loading-dock plinth, two corrugated-metal clerestory monitors
 * crossing its width, lower brick wings along its sides; the north-east end
 * on Camp Road opened up in big black steel windows under black steel
 * awnings, "301 CAMP" painted in white at the corner.
 *
 * Identity: the red brick box on its grey concrete plinth, the row of black
 * awnings on the Camp Road front, and the two silver monitors over the white
 * roof.
 *
 * Evidence:
 *  - OSM: the outline way/324608422 (height 8) and its 9 parts: the two
 *    monitors way/835817783, 835817787 (height 9), the main roof
 *    835814331, 835817784, 835817788 (6.9), the low wings 819519804 (5.5),
 *    835814332 (6), 835817785 (5.8) and the small block 835817786 (4).
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m (measured, NAVD88):
 *    ground 228.1–228.5 (y = 0 is 228.1); roof deck 235.4 (7.3 m); monitor
 *    tops 238.2 (10.1 m); the side wings 234.0 (5.9 m), the small block
 *    233.9. OSM's heights are about 0.5–1 m low; the lidar is followed.
 *  - Charlotte-Mecklenburg Historic Landmarks Commission survey report
 *    (2017, landmarkscommission.org/wp-content/uploads/2017/06/Ford-Motor-Co-Plant-SR.pdf),
 *    Buildings Nos. 4, 5, 6 (published): "a matched set", one storey,
 *    "brick-faced in common bond with six course headers", 180 ft wide,
 *    concrete roofs, "tall clerestory skylights ... crossing the widths of
 *    the buildings", "constructed from pressed corrugated sheet metal",
 *    15-pane windows on their short sides and sash windows along the long
 *    ones; six monitors on No. 4, which is "only about 700 feet long".
 *  - Mecklenburg County tax parcel 07903C99 (CAMP ... PROPERTY OWNER LP):
 *    built 1943, face brick.
 *  - Camp North End leasing brochure (2021, camp.nc): the name "301 Camp
 *    Road", 48,000 sq ft.
 *  - Photos (EVIDENCE), all by City Dweller 2, CC BY-SA 4.0, Wikimedia
 *    Commons:
 *      https://commons.wikimedia.org/wiki/File:301_Camp_along_Camp_Rd_Early_June_2025.jpg
 *      https://commons.wikimedia.org/wiki/File:301_Camp_artwork_Early_June_2025.jpg
 *      https://commons.wikimedia.org/wiki/File:Free_Range_Brewing_Camp_North_End_in_the_301_Camp_building_Early_June_2025.jpg
 *      https://commons.wikimedia.org/wiki/File:Wildflowers_in_front_of_301_Camp_Early_June_2025.jpg
 *      https://commons.wikimedia.org/wiki/File:Free_Range_Brewing_Late_March_2024.jpg
 *    They show the red brick, the pale coping, the grey concrete plinth about
 *    1.3 m high, the Camp Road front and the plaza side mostly glass: tall
 *    black-framed bays about two-thirds of the wall high filling each bay
 *    between brick piers, a brick band above, flat black steel canopies
 *    over them; and the long
 *    north-west wall, mostly blind brick under a mural.
 *  - Mapillary 360° photo 585774473263517 (cbreedlove, June 2022, CC BY-SA
 *    4.0) of Building No. 4's other end: the monitors are silver corrugated
 *    metal with a band of clerestory glazing.
 *  - USGS NAIP orthophoto (public domain): the white membrane roofs.
 *
 * Estimated: the bay pitch (about 7 m, photo-scaled from the 1.3 m plinth)
 * and the glazing's head height; the monitors' glazing band. The south-east
 * wings are seen only in part (the Free Range photos), so their bays repeat
 * the front's at wing height. The south-west face (towards Kinship West) is
 * unphotographed and drawn with a few windows only. Lettering, murals and
 * steps are left out.
 *
 * This file also holds the kit the south-campus models share
 * (`clt-cne-201-camp-road`, `clt-cne-701-keswick`, `clt-cne-1720-statesville`,
 * `clt-cne-1701-n-graham`, `clt-cne-gama-goat`, `clt-cne-330-camp-road`,
 * `clt-cne-bunkhouse`, `clt-cne-generals-office`), built on the north
 * campus's kit (`clt-cne-hercules-south.ts`, `clt-cne-ford-plant.ts`); its own
 * model is built only when it is run directly.
 *
 * Frame: the south warehouses' grid. y runs along the long axis (bearing
 * 39.4°), x across it (bearing 129.4°), z up, metres; placement bearing
 * 39.4. The origin is the outline's centroid, lng −80.8340930, lat 35.2457858.
 */
import { Part } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { SILVER, box, quad, type XY } from './clt-cne-ford-plant'
import { BRICK, WHITE_ROOF, block, onWall, write, type Built } from './clt-cne-hercules-south'

// ---------------------------------------------------------------------------
// Kit.

export { BRICK, SILVER, WHITE_ROOF }
/** Black steel of the renovation's awnings, window frames and canopies, pulled to charcoal. */
export const STEEL = finish('cne-steel', 0x4a4f57)
/** The monitors' weathered galvanised corrugated metal (Mapillary 585774473263517), darker than the white roofs. */
export const MONITOR_GREY = finish('cne-monitor', 0xa3aab0)
/** The grey board-formed concrete of the loading-dock plinths. */
export const CONCRETE = finish('cne-concrete', 0xc9c6bf)

export type Mats = { wall: Part; trim: Part; win: Part; roof: Part; metal: Part; dark: Part }
export const mats = (): Mats => ({ wall: new Part(), trim: new Part(), win: new Part(), roof: new Part(), metal: new Part(), dark: new Part() })

/** A ring turned counter-clockwise (seen from above), as `block` wants. */
export function ccw(ring: XY[]): XY[] {
  let a = 0
  ring.forEach((p, i) => { const q = ring[(i + 1) % ring.length]; a += p[0] * q[1] - q[0] * p[1] })
  return a >= 0 ? ring : [...ring].reverse()
}
export const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** A flat-roofed brick block over a ring: walls from the ground, coping, white deck. */
export function mass(m: Mats, ring: XY[], top: number, para = 0.4, wall = m.wall) {
  block({ wall, coping: m.trim, deck: m.roof }, ccw(ring), 0, top, para)
}

/**
 * A clerestory monitor crossing the roof from x0 to x1 over y0..y1: silver
 * corrugated cladding from the deck up, a glazed band along both long sides,
 * a window bank in each end, under a white lid with a small overhang. Inset
 * `inset` from the outer walls so it never shares a face with them.
 */
export function monitor(m: Mats, x0: number, x1: number, y0: number, y1: number, deck: number, top: number, inset = 0.7) {
  x0 += inset; x1 -= inset
  box(m.metal, x0, x1, y0, y1, deck, top - 0.3, null)
  box(m.metal, x0 - 0.3, x1 + 0.3, y0 - 0.3, y1 + 0.3, top - 0.4, top, m.roof)
  const w0 = deck + 0.6, w1 = top - 0.65
  for (const [A, B] of [[[x0, y0], [x1, y0]], [[x1, y1], [x0, y1]]] as [XY, XY][]) {
    const f = onWall(A, B), n = Math.max(1, Math.round(f.L / 9)), g = 0.8, pw = (f.L - g * (n + 1)) / n
    for (let k = 0; k < n; k++) f.panel(m.win, g + k * (pw + g), g + k * (pw + g) + pw, w0, w1)
  }
  for (const [A, B] of [[[x0, y1], [x0, y0]], [[x1, y0], [x1, y1]]] as [XY, XY][]) {
    const f = onWall(A, B)
    f.panel(m.win, 1.6, f.L - 1.6, w0, w1)
  }
}

/**
 * Openings along a wall A→B (outward to its right): `n` windows of width `w`
 * spread evenly between `a0` and `a1` along it, from z0 to z1, each with a
 * flat steel awning over it when `awning` is its depth.
 */
export function windows(m: Mats, A: XY, B: XY, o: { a0?: number; a1?: number; n: number; w: number; z0: number; z1: number; awning?: number; pane?: Part }) {
  const f = onWall(A, B), a0 = o.a0 ?? 0, a1 = o.a1 ?? f.L, step = (a1 - a0) / o.n
  for (let k = 0; k < o.n; k++) {
    const c = a0 + (k + 0.5) * step
    f.panel(o.pane ?? m.win, c - o.w / 2, c + o.w / 2, o.z0, o.z1)
    if (o.awning) awningOn(m.dark, f, c - o.w / 2 - 0.4, c + o.w / 2 + 0.4, o.z1 + 0.35, o.awning)
  }
}

/** A flat slab standing out `d` from a wall, a0..a1 along it, its top at z. */
export function awningOn(p: Part, f: ReturnType<typeof onWall>, a0: number, a1: number, z: number, d: number) {
  const t = 0.4
  const P = (a: number, zz: number, o: number) => f.P(a, zz, o)
  quad(p, P(a0, z - t, d), P(a1, z - t, d), P(a1, z, d), P(a0, z, d), f.N)
  quad(p, P(a0, z, 0.05), P(a0, z, d), P(a1, z, d), P(a1, z, 0.05), [0, 0, 1])
  quad(p, P(a0, z - t, 0.05), P(a1, z - t, 0.05), P(a1, z - t, d), P(a0, z - t, d), [0, 0, -1])
  quad(p, P(a0, z - t, 0.05), P(a0, z - t, d), P(a0, z, d), P(a0, z, 0.05), [-f.N[1], f.N[0], 0])
  quad(p, P(a1, z - t, d), P(a1, z - t, 0.05), P(a1, z, 0.05), P(a1, z, d), [f.N[1], -f.N[0], 0])
}

/** The concrete dock plinth as a band on a wall, from the ground up to `h`. */
export function plinth(m: Mats, A: XY, B: XY, h: number, a0 = 0, a1?: number) {
  const f = onWall(A, B)
  f.panel(m.trim, a0, a1 ?? f.L, 0, h, 0.06)
}

/** A loading platform: a concrete slab beside the wall. */
export function platform(m: Mats, x0: number, x1: number, y0: number, y1: number, h: number) {
  box(m.trim, x0, x1, y0, y1, 0, h, m.trim)
}

/** A flat canopy on posts along one edge: dark steel fascia, a grey metal roof. */
export function shed(m: Mats, x0: number, x1: number, y0: number, y1: number, z: number, postsAtX: number | null, step = 12.2) {
  box(m.dark, x0, x1, y0, y1, z - 0.4, z, m.metal)
  if (postsAtX === null) return
  const n = Math.max(1, Math.round((y1 - y0) / step))
  for (let k = 0; k <= n; k++) {
    const y = y0 + 0.3 + ((y1 - y0 - 0.6) * k) / n
    box(m.dark, postsAtX - 0.15, postsAtX + 0.15, y - 0.15, y + 0.15, 0, z - 0.4, null)
  }
}

export function out(m: Mats, id: string, name: string, height: number, bearing: number, wall: Swatch = BRICK, metal: Swatch = MONITOR_GREY): Built {
  return {
    id, name, height, bearing,
    parts: [
      { part: m.wall, material: wall },
      { part: m.trim, material: CONCRETE },
      { part: m.win, material: PALETTE.window },
      { part: m.roof, material: WHITE_ROOF },
      { part: m.metal, material: metal },
      { part: m.dark, material: STEEL },
    ],
  }
}

// ---------------------------------------------------------------------------
// 301 Camp Road.

/** Lidar levels above y = 0 (228.1 m NAVD88). */
const TOP = 7.7, DECK = 7.3, MON = 10.1, WING = 5.9, LOW = 5.8, PLINTH = 1.3

export function build301(): Built {
  const m = mats()
  // The main box: x −31.2..24.9 (west of the SE wings), y −36.4..37.8; the
  // south-west half of its north-west side is the lower wing.
  mass(m, [[-18.9, -36.4], [24.9, -36.4], [24.9, 37.8], [-31.2, 37.8], [-31.2, 0.2], [-18.9, 0.2]], TOP, TOP - DECK)
  // Wings (OSM parts, lidar 5.9 m).
  mass(m, rect(-31.4, -18.9, -36.4, 0.2), WING)
  mass(m, [[24.9, -36.4], [32.9, -36.4], [32.9, 13.7], [30.5, 13.7], [30.5, 37.8], [24.9, 37.8]], WING)
  mass(m, rect(-37.0, -31.4, -29.0, -17.8), LOW - 1.0)

  // The two monitors.
  monitor(m, -31.2, 24.9, 11.6, 26.2, DECK, MON)
  monitor(m, -18.9, 24.9, -24.4, -11.3, DECK, MON)

  // The plinth all round, and the windows. Camp Road front (NE end): pairs
  // of tall steel windows under awnings across the main box and the wing.
  for (const [A, B] of [[[30.5, 37.8], [-31.2, 37.8]], [[-31.2, 37.8], [-31.2, 0.2]], [[32.9, -36.4], [32.9, 13.7]], [[30.5, 13.7], [30.5, 37.8]], [[-31.4, -36.4], [32.9, -36.4]], [[-31.4, 0.2], [-31.4, -36.4]]] as [XY, XY][]) plinth(m, A, B, PLINTH)
  // Camp Road front (NE end) and the plaza side (SE wings): tall glazed
  // bays filling each bay between brick piers, from just over the plinth to
  // about two-thirds of the wall, a brick band above, a steel canopy over
  // each bay.
  windows(m, [24.9, 37.8], [-31.2, 37.8], { n: 8, w: 5.6, z0: PLINTH + 0.25, z1: 5.9, awning: 2.0 })
  windows(m, [30.5, 37.8], [24.9, 37.8], { n: 1, w: 4.2, z0: PLINTH + 0.25, z1: 4.7, awning: 1.8 })
  windows(m, [32.9, -36.4], [32.9, 13.7], { n: 7, w: 5.4, z0: PLINTH + 0.25, z1: 4.7, awning: 1.8 })
  windows(m, [30.5, 13.7], [30.5, 37.8], { n: 3, w: 5.4, z0: PLINTH + 0.25, z1: 4.7, awning: 1.8 })
  // North-west wall: mostly blind brick (the mural wall), a few windows.
  windows(m, [-31.2, 37.8], [-31.2, 0.2], { a0: 22, a1: 37, n: 2, w: 2.4, z0: PLINTH + 0.6, z1: 4.4 })
  // The south-west end (towards Kinship West) and the low wings: a few
  // windows, unphotographed.
  windows(m, [-18.9, -36.4], [24.9, -36.4], { n: 4, w: 3.0, z0: PLINTH + 0.4, z1: 4.6 })
  windows(m, [-31.4, -36.4], [-18.9, -36.4], { n: 1, w: 4.4, z0: PLINTH + 0.3, z1: 4.4, awning: 1.4 })

  return out(m, 'clt-cne-301-camp-road', '301 Camp Road, Camp North End', MON, 39.4)
}

if (import.meta.main) await write(build301())
