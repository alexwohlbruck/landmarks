/**
 * The Fillmore Charlotte and The Underground (Mill #2 of the AvidXchange
 * Music Factory) — procedural, CC0-1.0.
 * bun generators/fillmore-charlotte.ts
 *
 * Mill #2 of the John B. Ross and Company Mill is the west arm of the
 * complex, about 170 m long up Hamilton Street from NC Music Factory
 * Boulevard. The Fillmore (2009, about 2,000 people) and The Underground
 * (2016, 750) are venues inside it, each with its own front on the Hamilton
 * Street side across the tour-bus lot; neither is a separate building.
 *
 * From south to north, as the ground falls ~7 m:
 * - the c.1920 mill: a long red-brick block under a near-flat roof behind a
 *   coped parapet, rows of tall segmental-arched windows between brick piers,
 *   one storey on the boulevard and over a raised basement further north; a
 *   flat projection at its south-west corner;
 * - the one-storey projections on the Hamilton Street side, The
 *   Underground's front with its marquee;
 * - the c.1946 section with The Fillmore's front: a long low brick wall of
 *   tall windows on a raised terrace reached by a ramp, red double doors under
 *   a dark canopy carrying THE FILLMORE in white letters, and over the roof
 *   the corrugated silver metal volume of the hall;
 * - a small taller brick block, and the plain c.1960 hall at the north end.
 *
 * Evidence:
 *  - Lidar (USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m) for every height: the
 *    c.1920 mill at 221.9–222.3 m NAVD88 (a 0.4 m gable, drawn flat), its
 *    south-west projection ~222 m, The Underground's projections ~218.4 m,
 *    the c.1946 section's deck ~218.4 m, its parapet ~219 m, with the silver volume at ~221.7 m (south
 *    part) and ~220.2 m (north part), the terrace in front of it ~214.8 m, the
 *    taller block ~221 m, the north hall ~214.6 m; ground from the lidar's
 *    ground returns (courtyard ~217 m, Hamilton Street 213–216 m, north end
 *    ~209.5 m).
 *  - Photos: FillmoreCharlotte.jpg (HangingCurve, CC BY-SA 4.0, Wikimedia
 *    Commons, 2018: the Fillmore front — brick, tall windows, red doors, dark
 *    canopy and white letters, the coped parapet, the silver volume behind);
 *    Southern_Asbestos_Company_Mills.jpg (James Willamor, CC BY-SA 3.0, 2007
 *    aerial: the long brick mill with two rows of windows on its east face, the
 *    silver metal volume, the low north hall); Greenville,_Charlotte,_NC,_USA_-
 *    _panoramio.jpg (James Willamor, CC BY-SA 3.0, 2009, from the amphitheatre:
 *    the east face, its windows and coping, the silver volume); Mapillary
 *    street panoramas on Hamilton Street (2022, CC BY-SA 4.0): the Fillmore
 *    sign facing the lot, The Underground's marquee on the projection nearer
 *    the street.
 *  - OSM: way/414800516 outlines both mills and the bridge between them; this
 *    model covers its west arm and `music-factory-mill` the rest, so both are
 *    placed at the same minzoom. (OSM puts The Fillmore's name on way/957549179,
 *    Mill #1; the photos put its door here.)
 *
 * Estimated: window counts and sizes; the canopies' sizes; the letters are a
 * plain white board (the sign is the venue's, but its letters would not read
 * at map size). Map frame: x east, y north, z up; bearing 0.
 */
import { Part, type V3 } from './mesh'
import { PALETTE } from './palette'
import { BRICK, DOORS, SILVER, plant, MILL2, MILL2_EAST, axes, build, centroid, clean, flatZ, ground, inside, quad, softBox, earcut, tri, write, lowest, type Built, type Mats, type XY, type Zone } from './music-factory-mill'

export function buildFillmore(): Built {
  const wall = new Part(), roof = new Part(), win = new Part(), silver = new Part(), trim = new Part(), doors = new Part()
  const m: Mats = { wall, roof, eave: trim, win }
  const ax = axes(25.5), P = MILL2
  /** A point in the arm's frame: s up the street, t across it (east +). */
  const at = (s: number, t: number) => ax.at(s, t)

  // The two fronts, placed first so the window bays leave room for them.
  const FILL_S = 68.5, FILL_T = -88.5
  DOORS.push({ p: at(FILL_S, FILL_T), r: 3.0 })
  const UNDERGROUND_DOOR: [XY, XY, number] = [[-103.2, 68.9], [-91.3, 94.6], 0.62]
  {
    const [A, B, f] = UNDERGROUND_DOOR
    DOORS.push({ p: [A[0] + (B[0] - A[0]) * f, A[1] + (B[1] - A[1]) * f], r: 2.6 })
  }

  const zones: Zone[] = []
  const add = (z: Zone) => { if (z.poly.length >= 3) zones.push(z) }
  // The c.1920 mill: tall segmental-arched windows between brick piers, two
  // rows where the ground falls away.
  add({ poly: ax.band(P, -45, 60, -88.5, 1e4), z: flatZ(222.3), rows: [[218.2, 220.9], [214.4, 216.7]], pitch: 3.9, winW: 2.1, piers: true })
  // Its flat south-west projection: steel windows, one row.
  add({ poly: ax.band(P, -45, -21.5, -1e4, -88.5), z: flatZ(222.0), rows: [[218.0, 220.6]], pitch: 4.5, square: true })
  // The one-storey projections on Hamilton Street: The Underground.
  add({ poly: ax.band(P, -21.5, 60, -1e4, -88.5), z: flatZ(218.4), rows: [[215.0, 217.4]], pitch: 6.0, winW: 2.2, square: true })
  // The c.1946 section: The Fillmore's long front of tall steel windows on
  // its terrace (the terrace is drawn below, after the walls).
  add({ poly: ax.band(P, 60, 99, -88.5, 1e4), z: flatZ(219.0), rows: [[215.4, 218.0]], pitch: 3.3, winW: 2.0, square: true })
  // The c.1960 hall at the north end: low, plain brick between pilasters.
  add({ poly: ax.band(P, 99, 200), z: flatZ(214.6), rows: [[211.0, 213.6]], pitch: 7.0, winW: 1.4, square: true, piers: true, infill: (o, row, i) => i % 3 !== 1 })
  build(zones, m, [MILL2_EAST])
  plant(roof, [[-30, 120, 214.6, 25.5], [-20, 132, 214.6, 25.5], [-58, 60, 222.3, 25.5], [-50, 48, 222.3, 25.5], [-66, 30, 222.3, 25.5], [-44, 78, 222.3, 25.5]])

  // The terrace in front of the Fillmore: a low brick plinth with a paved
  // top, its ramp folded into it (lidar ~214.8 m).
  {
    const T = ax.band(P, 60, 99, -1e4, -88.3), Z = 214.8
    for (let i = 0; i < T.length; i++) {
      const A = T[i], B = T[(i + 1) % T.length]
      quad(wall, [A[0], A[1], Math.min(ground(A), ground(B)) - 2], [B[0], B[1], Math.min(ground(A), ground(B)) - 2], [B[0], B[1], Z], [A[0], A[1], Z], [B[1] - A[1], A[0] - B[0], 0])
    }
    for (const [i, j, k] of earcut(T)) tri(roof, [T[i][0], T[i][1], Z], [T[j][0], T[j][1], Z], [T[k][0], T[k][1], Z], [0, 0, 1])
  }

  // The silver metal volume over the c.1946 section: taller at its south end
  // (lidar), seen over the parapet from Hamilton Street and the Fillmore door.
  const box = (s0: number, s1: number, t0: number, t1: number): XY[] => clean([at(s0, t0), at(s1, t0), at(s1, t1), at(s0, t1)])
  softBox(silver, box(62, 73.5, -80, -63), 217.6, 221.7, 0.3)
  softBox(silver, box(73.5, 98, -80, -63), 217.6, 220.2, 0.3)
  // On the hall's east side, by the amphitheatre lawn: a taller brick block
  // and the tall silver metal box beside it (lidar 218 m and 221 m; the 2009
  // photo from the seats). They stand just east of the OSM outline.
  softBox(wall, box(112.8, 119, -57.2, -48.8), 209, 217.8, 0.25, roof)
  softBox(trim, box(112.65, 119.15, -57.35, -48.65), 217.6, 218.1, 0.15, roof)
  softBox(silver, box(119, 131.6, -55.2, -48.4), 209, 221.1, 0.3)
  // The small taller brick block at the hall's south-west corner.
  softBox(wall, box(98.5, 105.5, -91, -84), 213, 220.7, 0.25, roof)
  softBox(trim, box(98.35, 105.65, -91.15, -83.85), 220.5, 221.0, 0.15, roof)

  /**
   * A front on wall A→B at fraction f: doors `doorW` wide and `doorH` tall
   * from `sill`, and a flat dark canopy `w` wide projecting `D`, carrying a
   * white letter board `board` tall set back on its top.
   */
  function marquee(A: XY, B: XY, f: number, w: number, sill: number, doorW: number, doorH: number, D: number, board: number, out?: XY) {
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L]
    // Outward is whichever side of the wall is outside the building.
    const mid: XY = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]
    const o: XY = out ?? (inside(P, [mid[0] + u[1], mid[1] - u[0]]) ? [-u[1], u[0]] : [u[1], -u[0]])
    const pt = (s: number, d: number, z: number): V3 => [A[0] + u[0] * s + o[0] * d, A[1] + u[1] * s + o[1] * d, z]
    const c = L * f, n: V3 = [o[0], o[1], 0]
    // Red doors, lit at night as the entrance.
    quad(doors, pt(c - doorW / 2, 0.06, sill), pt(c + doorW / 2, 0.06, sill), pt(c + doorW / 2, 0.06, sill + doorH), pt(c - doorW / 2, 0.06, sill + doorH), n)
    const slab = (d0: number, d1: number, a: number, b: number, za: number, zb: number, face: Part, rest: Part) => {
      quad(face, pt(a, d1, za), pt(b, d1, za), pt(b, d1, zb), pt(a, d1, zb), n)
      quad(rest, pt(a, d0, za), pt(a, d0, zb), pt(a, d1, zb), pt(a, d1, za), [-u[0], -u[1], 0])
      quad(rest, pt(b, d0, za), pt(b, d1, za), pt(b, d1, zb), pt(b, d0, zb), [u[0], u[1], 0])
      quad(rest, pt(a, d0, zb), pt(b, d0, zb), pt(b, d1, zb), pt(a, d1, zb), [0, 0, 1])
      quad(rest, pt(a, d0, za), pt(a, d1, za), pt(b, d1, za), pt(b, d0, za), [0, 0, -1])
    }
    // The canopy, its front a little deeper than its sides, and the board.
    const z0 = sill + doorH + 0.3
    slab(0.06, D, c - w / 2, c + w / 2, z0, z0 + 0.9, roof, roof)
    slab(D * 0.45, D * 0.45 + 0.3, c - w / 2 + 0.2, c + w / 2 - 0.2, z0 + 0.9, z0 + 0.9 + board, trim, trim)
  }
  // The Fillmore's door, at the head of its ramp on the terrace (2018 photo:
  // red double doors, the canopy over them, the letters on it).
  {
    const A = at(FILL_S - 10, FILL_T), B = at(FILL_S + 10, FILL_T)
    marquee(A, B, 0.5, 7.0, 214.9, 4.4, 2.6, 2.8, 1.3, [-ax.r[0], -ax.r[1]])
  }
  // The Underground's smaller marquee on the west projection.
  marquee(...UNDERGROUND_DOOR, 4.6, ground([-96.8, 82.8]) + 0.2, 2.4, 2.4, 1.6, 0.6)

  const anchor = centroid(MILL2), base = lowest(clean(MILL2))
  return {
    id: 'fillmore-charlotte', name: 'The Fillmore Charlotte', anchor, base, height: 222.3 - base,
    parts: [
      { part: wall, material: BRICK },
      { part: roof, material: PALETTE.roof },
      { part: win, material: PALETTE.window },
      { part: trim, material: PALETTE.trim },
      { part: silver, material: SILVER },
      // The Fillmore's red doors are its front: lit at night as the entrance.
      { part: doors, material: { ...PALETTE.entrance, color: 0xc4473e } },
    ],
  }
}

if (import.meta.main) await write(buildFillmore())
