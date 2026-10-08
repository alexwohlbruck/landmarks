/**
 * The Pentagon, Arlington, Virginia — procedural, CC0-1.0, no textures.
 * bun generators/dc-pentagon.ts
 *
 * Map frame: x east, y north, z up, metres. The anchor is the area centroid
 * of the OSM outline (relation/89605, outer way/8821713): lng -77.0559549,
 * lat 38.8710072, which is also the centre of the fitted pentagon to a
 * metre. The model is built with one face looking due north (side 0); the
 * real building has a corner at bearing 27.9° (fitted over its five
 * corners), so the north face really looks to 351.9° and the model is
 * placed at bearing 351.9.
 *
 * What it is: the War Department's headquarters of 1941–43 (Bergstrom and
 * Edwin), five concentric pentagonal rings, A (inside) to E (outside),
 * five storeys high, separated by four open light wells and tied together by
 * ten radial corridors, two to a face, round a five-acre pentagonal court.
 * Indiana limestone outside; long low slate roofs over the E and A rings and
 * the corridors; flat roofs over B, C and D, edged with slate slopes down
 * to the eaves along every well. From above, what identifies it
 * is the pale frame of E ring, A ring and corridors, the four dark wells
 * between the rings, bent round every corner, and the open court.
 *
 * Evidence
 * - OSM (measured), relation/89605: the outer way and 42 inner ways, fitted
 *   in each face's own frame (u along the face, v the distance from the
 *   centre). Corners at 238–241 m from the centre, so a regular pentagon of
 *   circumradius 239.2 m (apothem 193.4). Each face's middle 136 m stands
 *   2.6 m forward (v 196), and the north and north-east faces carry an
 *   entrance block 46 m wide reaching v 202.5. The court's face is at
 *   v 74.5. The light wells sit at v 92.5–101.2, 116.5–128.3, 144.2–152.5
 *   and 168.2–176.7 on all five faces to within a metre. In the middle of a
 *   face all four wells run u −53 … 53; beyond the corridors (|u| 53–68)
 *   the outer three bend round the corner into the next face, and the
 *   innermost is built over. OSM tags height 23; its building:parts give the
 *   E ring, A ring and corridors 2 m gabled roofs over 23 m.
 * - Published (Wikipedia, "The Pentagon"): 921 ft (281 m) a side, 77 ft
 *   (23.5 m) high, five floors above ground, a five-acre central plaza;
 *   Indiana limestone facades; the River Entrance on the north-east face
 *   with a portico projecting 20 ft (6 m); the Mall Entrance on the north
 *   face.
 * - Photos (Wikimedia Commons): "The Pentagon US Department of Defense
 *   building.jpg" (Master Sgt. Ken Hammond, USAF, public domain), from the
 *   south-west; "The Pentagon January 2008.jpg" (David B. Gleason, CC BY-SA
 *   2.0), the River Entrance face from the north-east; "US Navy
 *   030926-F-2828D-062 ... river entrance ...jpg" (US Navy, public domain);
 *   "Pentagon aerial 2011 - USACE-p15141coll5-515.jpeg" (Marilyn K. Aber,
 *   USACE, public domain), from the north-east; "Arlington - Pentagon from
 *   Air.jpg" and "Arlington - Pentagon from the Air.jpg" (roger4336, CC
 *   BY-SA 2.0), the light wells from the north-east.
 * - USGS NAIP orthophoto (public domain): the roof plan — pale gabled E
 *   ring, A ring and corridors, flat grey B–D rings, dark wells bent round
 *   the corners, the innermost well absent at the corners.
 * - Estimated from the photos against the 23.5 m height: five rows of
 *   windows to 19.5 m under a plain attic and cornice to 21.5 m; the slate
 *   ridges at 24 m; the middle of each face's parapet a little higher; the
 *   River and Mall porticos' ten columns on a one-storey podium; the three-
 *   column recesses at each end of every face's middle section and the
 *   recessed colonnade in the middle of the other three faces (seen on the
 *   south-west and south-east faces; assumed on the west face).
 * - Drawn coarser than real: the window grid is grouped into broad slate
 *   panels, three bays wide, one storey / two storeys / two storeys high;
 *   the small bridges across the middle of some wells, the roof plant, the
 *   corner stair towers, the court's café and the ground-floor loading
 *   docks are left out. The wells are drawn dark (walls and floor), which
 *   is how they read from above; their window walls are not drawn.
 * - Colours: limestone is the palette's stone; the slate and the flat roofs
 *   are pulled to the pale greys they show in the orthophoto (older aerials
 *   show the flat roofs tan, before the 1998–2011 renovation); the wells
 *   are a dark grey, not black, per STYLE.md's charcoal limit.
 * - The site falls about 9 m across the Pentagon reservation; y = 0 is the
 *   lowest ground and the walls run to it all round.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cylinder, qf } from './dc-white-house'
import { saveModel, type XY } from './dc-nga-west'

// ---- Plan: distances from the centre, along each face's normal (OSM).
const T36 = Math.tan(Math.PI / 5)
const OUTER = 193.4 // E ring's outer face (corner sections)
const PAVILION = 196.0 // each face's middle section
const COURT = 74.5 // A ring's face on the court
const WELLS: [number, number][] = [[92.5, 101.2], [116.5, 128.3], [144.2, 152.5], [168.2, 176.7]]
const CORR = [53, 68] // a corridor's span in u, each side of a face's middle
const MID = 68 // the middle section's half-width
// ---- Heights.
const WALL = 21.5 // cornice / eaves of every ring
const RIDGE = 24.0 // slate ridges of E ring, A ring and corridors
const ATTIC = 19.5 // top of the window storeys
const WELL_FLOOR = 0.6
const HIP = 3.2, HIP_TOP = 22.7 // the slate edges of the B, C and D roofs

/** A point in face k's frame: u along the face (clockwise), v out from the centre. */
function P(k: number, u: number, v: number, z = 0): V3 {
  const th = (k * 2 * Math.PI) / 5
  const n: XY = [Math.sin(th), Math.cos(th)], t: XY = [Math.cos(th), -Math.sin(th)]
  return [u * t[0] + v * n[0], u * t[1] + v * n[1], z]
}
const nrm = (k: number): V3 => { const th = (k * 2 * Math.PI) / 5; return [Math.sin(th), Math.cos(th), 0] }
const tan = (k: number): V3 => { const th = (k * 2 * Math.PI) / 5; return [Math.cos(th), -Math.sin(th), 0] }
const UP: V3 = [0, 0, 1]

/** The regular pentagon of apothem a at height z, counter-clockwise from above. */
const pent = (a: number, z: number): V3[] => [0, 4, 3, 2, 1].map((k) => P(k, -a * T36, a, z))

/** Vertical walls round a closed ring of map points, facing `out` (outward) or into the hole. */
function ringWalls(p: Part, pts: XY[], z0: number, z1: number, out: boolean) {
  // pts counter-clockwise from above.
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    const n: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
    const d: V3 = out ? n : [-n[0], -n[1], 0]
    qf(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], d)
  }
}

/** A flat quad facing up. */
const capQuad = (p: Part, a: V3, b: V3, c: V3, d: V3) => qf(p, a, b, c, d, UP)

/**
 * A solid stretch of a band between v0 and v1 on face k, from u0 to u1. An
 * end given as ±Infinity runs to the corner's mitre, where it meets the
 * same stretch of the next face.
 */
function bandQuad(k: number, u0: number, u1: number, v0: number, v1: number, z: number): V3[] {
  const lo = (v: number) => (u0 === -Infinity ? -v * T36 : u0)
  const hi = (v: number) => (u1 === Infinity ? v * T36 : u1)
  return [P(k, lo(v0), v0, z), P(k, hi(v0), v0, z), P(k, hi(v1), v1, z), P(k, lo(v1), v1, z)]
}

/** A window panel on face k at distance v, u0..u1, z0..z1, facing out (dir 1) or to the court (−1). */
function panel(p: Part, k: number, v: number, u0: number, u1: number, z0: number, z1: number, dir: 1 | -1, d = 0.06) {
  const vv = v + dir * d
  const n = nrm(k).map((c) => c * dir) as V3
  qf(p, P(k, u0, vv, z0), P(k, u1, vv, z0), P(k, u1, vv, z1), P(k, u0, vv, z1), n)
}

/** Panels in groups across u0..u1 at the given pitch, in three storey tiers. */
const TIERS: [number, number][] = [[1.6, 3.9], [5.5, 11.2], [12.9, 18.5]]
function panelRun(p: Part, k: number, v: number, u0: number, u1: number, dir: 1 | -1, pitch = 10.6, pier = 4.6) {
  const n = Math.max(1, Math.round((u1 - u0) / pitch))
  const w = (u1 - u0) / n
  for (let i = 0; i < n; i++) {
    const a = u0 + i * w + pier / 2, b = u0 + (i + 1) * w - pier / 2
    for (const [z0, z1] of TIERS) panel(p, k, v, a, b, z0, z1, dir)
  }
}

/** A box in face k's frame. */
function faceBox(p: Part, k: number, u0: number, u1: number, v0: number, v1: number, z0: number, z1: number, top: Part | false = p) {
  const n = nrm(k), t = tan(k)
  const c = (u: number, v: number, z: number) => P(k, u, v, z)
  qf(p, c(u0, v1, z0), c(u1, v1, z0), c(u1, v1, z1), c(u0, v1, z1), n)
  qf(p, c(u0, v0, z0), c(u1, v0, z0), c(u1, v0, z1), c(u0, v0, z1), n.map((x) => -x) as V3)
  qf(p, c(u1, v0, z0), c(u1, v1, z0), c(u1, v1, z1), c(u1, v0, z1), t)
  qf(p, c(u0, v0, z0), c(u0, v1, z0), c(u0, v1, z1), c(u0, v0, z1), t.map((x) => -x) as V3)
  if (top) capQuad(top, c(u0, v0, z1), c(u1, v0, z1), c(u1, v1, z1), c(u0, v1, z1))
}

/** A round column at (u, v) of face k with a square abacus. */
function column(p: Part, k: number, u: number, v: number, r: number, z0: number, z1: number) {
  const [x, y] = P(k, u, v)
  cylinder(p, x, y, r, z0, z1 - 0.7, 10, r * 0.88)
  faceBox(p, k, u - r * 1.2, u + r * 1.2, v - r * 1.2, v + r * 1.2, z1 - 0.7, z1, false)
}

function build() {
  const stone = new Part(), win = new Part(), flat = new Part(), slate = new Part(), well = new Part(), trim = new Part()

  // ---- Outer face and court face, all round.
  const outerXY = pent(OUTER, 0).map(([x, y]) => [x, y] as XY)
  const courtXY = pent(COURT, 0).map(([x, y]) => [x, y] as XY)
  ringWalls(stone, outerXY, 0, WALL, true)
  ringWalls(stone, courtXY, 0, WALL, false)
  // A shallow cornice round both, at the foot of the slate.
  for (const [a, dir] of [[OUTER, 1], [COURT, -1]] as const) {
    const inner = pent(a, 0).map(([x, y]) => [x, y] as XY)
    const outer = pent(a + 0.45 * dir, 0).map(([x, y]) => [x, y] as XY)
    ringWalls(trim, outer, ATTIC + 0.9, WALL - 0.2, dir === 1)
    for (let i = 0; i < 5; i++) {
      const j = (i + 1) % 5
      const q = (r: XY[], z: number, m: number): V3 => [r[m][0], r[m][1], z]
      qf(trim, q(inner, WALL - 0.2, i), q(outer, WALL - 0.2, i), q(outer, WALL - 0.2, j), q(inner, WALL - 0.2, j), UP)
      qf(trim, q(inner, ATTIC + 0.9, i), q(outer, ATTIC + 0.9, i), q(outer, ATTIC + 0.9, j), q(inner, ATTIC + 0.9, j), [0, 0, -1])
    }
  }

  // ---- Slate roofs: E ring and A ring, each a long gable that runs round the
  // whole pentagon; mitred at the corners, so the hips come for free.
  const [W1, W2, W3, W4] = WELLS
  slate.loft([pent(OUTER, WALL), pent((OUTER + W4[1]) / 2, RIDGE), pent(W4[1], WALL)])
  slate.loft([pent(W1[0], WALL), pent((W1[0] + COURT) / 2, RIDGE), pent(COURT, WALL)])
  // B, C and D: flat tops, with a slate slope down to the eaves along every well.
  const RINGS: [number, number][] = [[W1[1], W2[0]], [W2[1], W3[0]], [W3[1], W4[0]]]
  for (const [v0, v1] of RINGS) {
    slate.loft([pent(v0 + HIP, HIP_TOP), pent(v0, WALL)])
    slate.loft([pent(v1, WALL), pent(v1 - HIP, HIP_TOP)])
  }

  for (let k = 0; k < 5; k++) {
    // ---- Flat roofs of B, C and D, and the solid stretches of the well bands:
    // the corridors everywhere, and the innermost well's band beyond them.
    for (const [v0, v1] of RINGS) capQuad(flat, ...(bandQuad(k, -Infinity, Infinity, v0 + HIP, v1 - HIP, HIP_TOP) as [V3, V3, V3, V3]))
    capQuad(flat, ...(bandQuad(k, CORR[0], Infinity, W1[0], W1[1], WALL) as [V3, V3, V3, V3]))
    capQuad(flat, ...(bandQuad(k, -Infinity, -CORR[0], W1[0], W1[1], WALL) as [V3, V3, V3, V3]))
    for (const [v0, v1] of [W2, W3, W4]) for (const s of [-1, 1]) {
      const [a, b] = s < 0 ? [-CORR[1], -CORR[0]] : [CORR[0], CORR[1]]
      capQuad(flat, ...(bandQuad(k, a, b, v0, v1, WALL) as [V3, V3, V3, V3]))
    }

    // ---- The light wells: dark walls facing in, and a dark floor.
    // Middle of the face: all four, between the corridors.
    for (const [v0, v1] of WELLS) {
      const r: XY[] = [P(k, -CORR[0], v0), P(k, CORR[0], v0), P(k, CORR[0], v1), P(k, -CORR[0], v1)].map(([x, y]) => [x, y] as XY)
      ringWalls(well, ccwXY(r), WELL_FLOOR, WALL, false)
      capQuad(well, ...(r.map(([x, y]) => [x, y, WELL_FLOOR] as V3) as [V3, V3, V3, V3]))
    }
    // Round the corner between face k and face k+1: the outer three, bent.
    const k1 = (k + 1) % 5
    for (const [v0, v1] of [W2, W3, W4]) {
      const r: XY[] = [P(k, CORR[1], v0), P(k, v0 * T36, v0), P(k1, -CORR[1], v0), P(k1, -CORR[1], v1), P(k, v1 * T36, v1), P(k, CORR[1], v1)]
        .map(([x, y]) => [x, y] as XY)
      ringWalls(well, ccwXY(r), WELL_FLOOR, WALL, false)
      // floor: the two halves either side of the mitre
      capQuad(well, ...([P(k, CORR[1], v0), P(k, v0 * T36, v0), P(k, v1 * T36, v1), P(k, CORR[1], v1)].map(([x, y]) => [x, y, WELL_FLOOR] as V3) as [V3, V3, V3, V3]))
      capQuad(well, ...([P(k1, -v0 * T36, v0), P(k1, -CORR[1], v0), P(k1, -CORR[1], v1), P(k1, -v1 * T36, v1)].map(([x, y]) => [x, y, WELL_FLOOR] as V3) as [V3, V3, V3, V3]))
    }

    // ---- The corridors' slate roofs: a gable from A ring's ridge to E ring's.
    const vA = (W1[0] + COURT) / 2, vE = (OUTER + W4[1]) / 2
    for (const s of [-1, 1]) {
      const a = s * CORR[0], b = s * CORR[1], m = (a + b) / 2
      // each slope faces away from the ridge, toward its own eave
      qf(slate, P(k, a, vA, WALL), P(k, a, vE, WALL), P(k, m, vE, RIDGE), P(k, m, vA, RIDGE), tan(k).map((c) => -c * s) as V3)
      qf(slate, P(k, b, vA, WALL), P(k, b, vE, WALL), P(k, m, vE, RIDGE), P(k, m, vA, RIDGE), tan(k).map((c) => c * s) as V3)
    }

    // ---- The middle section of the face, a little forward and a little higher.
    faceBox(stone, k, -MID, MID, OUTER - 0.3, PAVILION, 0, WALL + 0.8, slate)
    // its cornice
    faceBox(trim, k, -MID - 0.4, MID + 0.4, PAVILION - 0.3, PAVILION + 0.45, ATTIC + 0.9, WALL - 0.2)

    // ---- Facade panels. Corner sections, out to each corner.
    for (const s of [-1, 1]) {
      const a = MID + 1.2, b = OUTER * T36 - 2.5
      panelRun(win, k, OUTER, s < 0 ? -b : a, s < 0 ? -a : b, 1)
    }
    // The court face.
    panelRun(win, k, COURT, -COURT * T36 + 3, COURT * T36 - 3, -1)

    // The middle section: three-column recesses near each end, and either a
    // portico (north and north-east faces) or a recessed colonnade between.
    const portico = k === 0 || k === 1
    const COL_Z0 = 4.6, COL_Z1 = ATTIC
    for (const s of [-1, 1]) {
      const c = s * 56, half = 6.2
      panel(win, k, PAVILION, c - half, c + half, COL_Z0, COL_Z1, 1, 0.06)
      for (const du of [-3.1, 0, 3.1]) column(stone, k, c + du, PAVILION + 0.9, 0.6, COL_Z0, COL_Z1)
      // windows between the recess and the colonnade / portico
      const a = portico ? 24.5 : 21.5
      panelRun(win, k, PAVILION, s < 0 ? -48.5 : a, s < 0 ? -a : 48.5, 1)
    }
    if (portico) {
      // podium, ten columns, entablature, flat roof (OSM: 46 m wide, to v 202.5)
      const V0 = PAVILION, V1 = 202.5, U = 23
      faceBox(stone, k, -U, U, V0 - 0.2, V1, 0, 4.0)
      panel(win, k, PAVILION, -U + 2, U - 2, 4.0, COL_Z1, 1, 0.06)
      for (let i = 0; i < 10; i++) column(stone, k, -U + 2.6 + (i * (2 * U - 5.2)) / 9, V1 - 1.4, 0.8, 4.0, COL_Z1)
      faceBox(trim, k, -U, U, V0 - 0.2, V1, COL_Z1, WALL + 0.8, flat)
    } else {
      panel(win, k, PAVILION, -19.5, 19.5, COL_Z0, COL_Z1, 1, 0.06)
      for (let i = 0; i < 9; i++) column(stone, k, -18 + i * 4.5, PAVILION + 0.9, 0.6, COL_Z0, COL_Z1)
    }
  }

  return [
    { part: stone, material: PALETTE.stone },
    { part: trim, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: flat, material: FLAT },
    { part: slate, material: SLATE },
    { part: well, material: WELL },
  ]
}

/** Counter-clockwise from above. */
function ccwXY(r: XY[]): XY[] {
  const a = r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
  return a < 0 ? [...r].reverse() : r
}

/** The slate of the long roofs: blue-grey, but it reads pale from above in daylight (NAIP, aerials). */
const SLATE = finish('pentagon-slate', 0xc3c9cb)
/**
 * The flat roofs of B, C and D: membrane that reads pale grey from above
 * today (NAIP); a step darker than the slate so the rings still separate.
 */
const FLAT = finish('pentagon-roof', 0xb0b7bb)
/** The light wells, five storeys deep: in shadow from every view but straight down. */
const WELL = finish('pentagon-well', 0x5b6168)

if (import.meta.main) {
  await saveModel('dc-pentagon', 'The Pentagon', build(), { source: 'generators/dc-pentagon.ts' }, 6500)
}
