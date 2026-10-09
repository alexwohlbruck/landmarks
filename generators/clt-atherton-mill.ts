/**
 * Atherton Mill (the former Parks-Cramer Company Complex), 2000 South
 * Boulevard, South End, Charlotte — procedural, CC0-1.0.
 * bun generators/clt-atherton-mill.ts
 *
 * The 1919 factory of the Parks-Cramer Company, makers of humidifiers and
 * air conditioning for the textile mills (Stuart W. Cramer coined the term),
 * extended to the 1950s and reopened in the mid-1990s as the Atherton Mill &
 * Market shops. A designated Charlotte-Mecklenburg landmark (2000, 2006 &
 * 2010 South Blvd) and on the National Register (1994, ref. 94000146;
 * Wikidata Q19461795). Not to be confused with the 1893 Atherton Cotton Mill
 * 230 m south-west (clt-atherton-cotton-mill), whose name the shops took.
 *
 * The National Register nomination (NC SHPO MK1766) describes it: "a large
 * facility with an asymmetrical plan ... primarily one story in height
 * although portions on the north side have two and three stories ... brick
 * exterior walls ... The roofs are flat, and except along the west elevation,
 * the roof line is defined by stepped parapets ... Along the west elevation
 * ... overhanging wooden eaves and exposed rafters ... Each of the four
 * production areas has a flat-roofed monitor with operable steel-sash windows
 * ... banks of large, steel-sash factory windows ... concrete lintels and
 * sills ... A brick smokestack rises from the junction of the southern and
 * mid-sections" of the shipping building on the west side, and "a new brick
 * veneer was also added to the tall mid-section on the north, east, and south
 * elevations, covering existing window openings."
 *
 * What makes it read: the long, low red-brick front on South Boulevard with
 * its bands of factory windows and the blue ATHERTON MILL sign over the
 * entrance; four long white monitors on the flat white roof; the blank,
 * three-storey brick mid-section rising behind; the two-storey brick block
 * at the Tremont corner with its glass rooftop box; the square brick stack on
 * the railway side; and the white-painted "Mill Shops" wing at the north-west
 * corner, wrapped in a brown shed-roof awning.
 *
 * Evidence:
 *  - Identity: Mecklenburg County LocalHistoricProperty layer, "Parks-Cramer
 *    Company Complex", 1919, 2000 South Bv, PID 12103169 (the parcel under
 *    the whole outline);
 *    https://hl.mecknc.gov/Properties/Designated-Historic-Landmarks/charlotte/south-inner/parks-cramer-company-complex
 *  - OSM way/432937693 (outline, name=Atherton Mill) and its building:parts
 *    way/1205364106–1205364118: the hall (106), the four monitors (107–110),
 *    the Mill Shops wing (111) and its awning (112), a canopy west of it
 *    (113), the tall mid-section (114), the two-storey block (115) and its
 *    raised roof (116), the stack (117), and a canopy (118).
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 0.5 m, sampled in this
 *    frame. Base (y = 0) is the lowest ground under the outline, 227.72 m
 *    NAVD88, on the railway (west) side; the ground rises about 1 m to South
 *    Boulevard. Heights above base: hall parapet 5.4 m; shipping wing on the
 *    west 5.7 m; monitors 7.1 m; tall mid-section 14.1 m on the deck,
 *    15.4 m on the parapet; two-storey block 10.7–10.9 m; Mills Shops wing
 *    6.8 m; the stack 16.7 m. Canopy 113 is missing in 2016 (newer).
 *  - NRHP nomination MK1766: plan sections (110 × 77, 92 × 77, 202 × 77 ft
 *    production areas; 76 × 78 ft northern section), the forms quoted above.
 *  - Photos (Wikimedia Commons): Bagatar, "2000 South Blvd.jpg", CC BY-SA 3.0
 *    (the South Blvd front, sign, monitors, stack, mid-section); City
 *    Dweller 2, CC BY-SA 4.0, April 2024: "Atherton Mill on South Blvd",
 *    "… at the corner of South Blvd and Tremont" (the two-storey block, its
 *    lintels and the glass rooftop box), "Atherton Mill sign" (the Mill Shops
 *    wing and its awning from Tremont), "… along the alley" and "… along the
 *    Light Rail" (the railway side: dark eaves, tall sash windows, concrete base).
 *    USGS NAIP (plan; white membrane roofs).
 *
 * Estimated: window sizes, pitch and the bands' extents on South Blvd (from
 * the photos); the glass rooftop box's height (3 m over the parapet, from the
 * corner photo; it postdates the lidar); the awning depth and slope; the
 * south front (no photo: loading doors and sash windows per the NRHP, with a
 * stepped parapet whose step heights are guessed); the stack's cap. No
 * lettering on the sign (a plain blue panel).
 *
 * Model frame: bearing 34 (model +y runs north-north-east, along South
 * Boulevard towards Tremont; +x is east-south-east, the South Blvd side;
 * −x is the railway side). Origin: the outline's centroid.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  BRICK, MILL_ROOF, build, clean, cap, inset, prism, quad, rect, tri, window, write,
  type Block, type Kit, type Row, type XY,
} from './clt-highland-park-mill-3'

const SIGN = finish('atherton-sign', 0x3f6a9c)
/** The brown-grey awnings, also the dark eave fascia on the railway side. */
const AWNING = finish('atherton-awning', 0x8f7f74)

const brick = new Part(), win = new Part(), trim = new Part(), roof = new Part(), sign = new Part(), awning = new Part()

/** Ground above base: low on the railway side, about 1.2 m up at South Blvd. */
const ground = (p: XY) => Math.max(0, Math.min(1.2, 0.25 + (p[0] + 30) * 0.016))
const BURY = 0.6
const kit: Kit = { win, trim, roof, ground }

/** Factory windows along a wall from A to B (outward normal to the right of A→B), with pale lintels and sills. */
function bays(A: XY, B: XY, rows: Row[], pitch: number, from = 0, to = Infinity, lintel = true) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], o: XY = [u[1], -u[0]]
  const s0 = Math.max(0, from), s1 = Math.min(L, to), count = Math.floor((s1 - s0 - 0.6) / pitch)
  const start = s0 + (s1 - s0 - count * pitch) / 2, N: V3 = [o[0], o[1], 0]
  for (let i = 0; i < count; i++) {
    const s = start + pitch * (i + 0.5), c: XY = [A[0] + u[0] * s, A[1] + u[1] * s]
    for (const r of rows) {
      if (ground(c) > r.z0 - 0.3) continue
      window(win, c, u, o, r)
      if (!lintel) continue
      const P = (w: number, z: number): V3 => [c[0] + u[0] * w + o[0] * 0.07, c[1] + u[1] * w + o[1] * 0.07, z]
      const hw = r.w / 2 + 0.22
      quad(trim, P(-hw, r.z1 + 0.04), P(hw, r.z1 + 0.04), P(hw, r.z1 + 0.55), P(-hw, r.z1 + 0.55), N)
      quad(trim, P(-hw + 0.1, r.z0 - 0.25), P(hw - 0.1, r.z0 - 0.25), P(hw - 0.1, r.z0), P(-hw + 0.1, r.z0), N)
    }
  }
}

/**
 * A band of steel-sash factory windows on a wall, `n` units of width `w`
 * at `pitch`, centred at distance `s` from A, set in one pale concrete
 * surround (as on South Blvd).
 */
function band(A: XY, B: XY, s: number, n: number, z0: number, z1: number, pitch = 2.3, w = 2.05) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], o: XY = [u[1], -u[0]]
  const c: XY = [A[0] + u[0] * s, A[1] + u[1] * s], half = (n * pitch) / 2 + 0.2
  window(trim, c, u, o, { z0: z0 - 0.22, z1: z1 + 0.22, w: 2 * half }, undefined, 0.04)
  for (let i = 0; i < n; i++) {
    const k = -n * pitch / 2 + pitch * (i + 0.5)
    window(win, [c[0] + u[0] * k, c[1] + u[1] * k], u, o, { z0, z1, w })
  }
}

/** A flat-roofed monitor: pale sides with a band of sash windows, a thin roof with shallow eaves. */
function monitor(x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  prism(trim, rect(x0, y0, x1, y1), z0, z1 - 0.25, null)
  const R = rect(x0 - 0.45, y0 - 0.45, x1 + 0.45, y1 + 0.45)
  // Pale lids: in the photos the monitors read as white strips over the deck.
  prism(trim, R, z1 - 0.25, z1, trim)
  cap(trim, R, z1 - 0.25, false)
  const row: Row = { z0: z0 + 0.45, z1: z1 - 0.55, w: 1.55 }
  // Long sides (facing ±x) and ends (±y).
  const sides: [XY, XY][] = [[[x1, y0], [x1, y1]], [[x0, y1], [x0, y0]], [[x1, y1], [x0, y1]], [[x0, y0], [x1, y0]]]
  for (const [A, B] of sides) {
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], o: XY = [u[1], -u[0]]
    const n = Math.floor((L - 0.6) / 1.9), start = (L - n * 1.9) / 2
    for (let i = 0; i < n; i++) { const s = start + 1.9 * (i + 0.5); window(win, [A[0] + u[0] * s, A[1] + u[1] * s], u, o, row) }
  }
}

/** A sloped awning strip along a wall: from `zIn` at the wall to `zOut` at `depth` outward, `t` thick. */
function awn(A: XY, B: XY, depth: number, zIn: number, zOut: number, t = 0.18) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), o: XY = [(B[1] - A[1]) / L, (A[0] - B[0]) / L]
  const a: V3 = [A[0], A[1], zIn], b: V3 = [B[0], B[1], zIn]
  const c: V3 = [B[0] + o[0] * depth, B[1] + o[1] * depth, zOut], d: V3 = [A[0] + o[0] * depth, A[1] + o[1] * depth, zOut]
  const k = (zIn - zOut) / depth, n: V3 = [o[0] * k, o[1] * k, 1]
  quad(awning, a, b, c, d, n)
  const lo = (v: V3): V3 => [v[0], v[1], v[2] - t]
  quad(awning, lo(a), lo(d), lo(c), lo(b), [0, 0, -1])
  quad(trim, lo(d), lo(c), c, d, [o[0], o[1], 0])
}

/** A square brick stack with a corbelled cap and dark mouth. */
function squareStack(c: XY, w: number, z1: number) {
  const ring = (h: number): XY[] => rect(c[0] - h, c[1] - h, c[0] + h, c[1] + h)
  prism(brick, ring(w / 2), -BURY, z1 - 0.9, null)
  prism(brick, ring(w / 2 + 0.15), z1 - 0.9, z1, null)
  cap(brick, ring(w / 2 + 0.15), z1 - 0.9, false)
  const O = ring(w / 2 + 0.15), I = ring(w / 2 - 0.3)
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; quad(trim, [O[i][0], O[i][1], z1], [O[j][0], O[j][1], z1], [I[j][0], I[j][1], z1], [I[i][0], I[i][1], z1], [0, 0, 1]) }
  cap(roof, I, z1 - 0.02)
}

export function buildAthertonMill() {
  // --- Plan (OSM building:parts in this frame) ---------------------------
  // The production hall: four bays under one flat roof, South Blvd front at x = 31.5.
  const HALL: XY[] = [[-15.6, -43.0], [31.6, -43.4], [31.5, 18.3], [-15.6, 17.8]]
  // The shipping and receiving wing along the railway, with the infill (eaves on the west).
  const SHIP: XY[] = [[-26.6, -19.5], [-15.6, -19.7], [-15.6, 17.8], [-15.7, 22.2], [-19.9, 22.3], [-19.9, 23.2], [-29.2, 22.9], [-29.2, 3.4], [-27.7, 1.3]]
  // The tall mid-section, the two-storey block at Tremont, the Mill Shops wing.
  const MID = rect(-15.7, 17.8, 8.6, 22.3)
  const NORTH = rect(-15.8, 22.3, 8.6, 46.2)
  const SHOPS = rect(-30.1, 22.9, -19.9, 46.2)

  const blocks: Block[] = [
    { poly: HALL, top: 5.4, wall: brick },
    { poly: MID, top: 15.4, wall: brick },
    { poly: NORTH, top: 10.9, wall: brick },
    { poly: SHOPS, top: 6.8, wall: trim, base: { part: brick, z: 4.0 } },
  ]
  build(blocks, kit)

  // Shipping wing: brick on a pale concrete base, a flat roof on overhanging eaves.
  build([{ poly: SHIP, top: 5.5, wall: brick, base: { part: trim, z: 0.9 }, bare: true }], kit)
  const eave = clean(inset(clean(SHIP), -0.8))
  prism(awning, eave, 5.45, 5.75, roof)
  cap(awning, eave, 5.45, false)

  // --- Roof: four monitors on the hall (OSM 107–110, lidar 7.1 m) ----------
  const deck = 5.4 - 0.55
  monitor(-8.2, -37.9, 0.7, -24.8, deck, 7.1)
  monitor(-8.1, -20.0, 0.8, 12.2, deck, 7.1)
  monitor(15.6, -37.5, 24.5, -21.1, deck, 7.1)
  monitor(15.2, -7.2, 24.2, 12.4, deck, 7.1)

  // The south front's stepped parapet (NRHP; step heights estimated).
  prism(brick, [[-2, -43.0], [18, -43.2], [18, -42.6], [-2, -42.4]], 5.3, 6.1, null)
  prism(trim, [[-2.1, -43.08], [18.1, -43.28], [18.1, -42.52], [-2.1, -42.32]], 6.1, 6.3)
  prism(brick, [[3.5, -43.05], [12.5, -43.15], [12.5, -42.55], [3.5, -42.45]], 6.1, 6.7, null)
  prism(trim, [[3.4, -43.13], [12.6, -43.23], [12.6, -42.47], [3.4, -42.37]], 6.7, 6.9)

  // Glass rooftop offices on the two-storey block: a taller box and a lower one
  // to its west, inside OSM 116's raised roof (sizes from the 2024 corner photo).
  prism(win, rect(-8.5, 30.0, 3.0, 39.0), 10.2, 13.9, null)
  prism(trim, rect(-8.7, 29.8, 3.2, 39.2), 13.9, 14.15, roof)
  prism(win, rect(-12.6, 31.0, -8.5, 38.0), 10.2, 12.6, null)
  prism(trim, rect(-12.8, 30.8, -8.5, 38.2), 12.6, 12.85, roof)

  // --- South Blvd front (x = 31.5, A = south end) --------------------------
  const SE: XY = [31.6, -43.4], NE: XY = [31.5, 18.3]
  const zs = 1.15 // sidewalk above base
  band(SE, NE, 17.5, 12, zs + 1.1, zs + 2.9)
  band(SE, NE, 52.5, 6, zs + 1.1, zs + 2.9)
  // The Atherton Mill entrance: dark doors, a black canopy and the blue sign above it.
  const door = (s: number, w: number, z1: number) => {
    const c: XY = [SE[0] + (NE[0] - SE[0]) * s / 61.7, SE[1] + (NE[1] - SE[1]) * s / 61.7]
    window(win, c, [0, 1], [1, 0], { z0: zs, z1, w })
    return c
  }
  const e1 = door(36.5, 2.6, zs + 2.6)
  prism(sign, rect(e1[0], e1[1] - 2.6, e1[0] + 1.3, e1[1] + 2.6), zs + 2.7, zs + 3.0)
  prism(sign, rect(e1[0] + 0.05, e1[1] - 2.6, e1[0] + 0.3, e1[1] + 2.6), zs + 3.0, zs + 4.15)
  const e2 = door(42.5, 2.2, zs + 2.6)
  prism(sign, rect(e2[0], e2[1] - 1.8, e2[0] + 0.9, e2[1] + 1.8), zs + 2.75, zs + 3.0)

  // --- Other faces of the hall --------------------------------------------
  // South front: loading doors and sash windows (no photo; per the NRHP).
  const SW: XY = [-15.6, -43.0]
  bays(SW, SE, [{ z0: 1.6, z1: 3.9, w: 2.4 }], 4.6, 2, 45)
  // The hall's west face south of the shipping wing (rail loading bays).
  bays([-15.6, -19.7], SW, [{ z0: 1.2, z1: 3.9, w: 2.0 }], 3.6)

  // --- Shipping wing, railway side: tall sash windows with concrete lintels -
  const tall: Row = { z0: 1.2, z1: 4.3, w: 1.6 }
  bays([-27.7, 1.3], [-26.6, -19.5], [tall], 3.2)
  bays([-29.2, 22.9], [-29.2, 3.4], [tall], 3.2, 0, 15.5)
  bays([-26.6, -19.5], [-15.6, -19.7], [tall], 3.4)

  // --- Two-storey block: two rows of tall sash windows, concrete lintels ---
  const lower: Row = { z0: 1.7, z1: 4.6, w: 1.55 }, upper: Row = { z0: 5.9, z1: 8.7, w: 1.55 }
  bays([8.6, 22.3], [8.6, 46.2], [lower, upper], 2.3)
  bays([8.6, 46.2], [-15.8, 46.2], [lower, upper], 2.9)
  bays([-15.8, 46.2], [-15.8, 22.3], [upper], 3.0)

  // --- Mill Shops wing: shop windows under a brown shed-roof awning --------
  bays([-19.9, 46.2], [-30.1, 46.2], [{ z0: 0.6, z1: 3.3, w: 2.2 }], 3.3, 0, Infinity, false)
  bays([-30.1, 46.2], [-30.1, 22.9], [{ z0: 0.6, z1: 3.3, w: 2.2 }], 3.4, 0, Infinity, false)
  awn([-19.9, 46.2], [-30.1, 46.2], 1.4, 4.3, 3.6)
  awn([-30.1, 46.2], [-30.1, 22.9], 1.4, 4.3, 3.6)
  awn([-19.9, 22.9], [-19.9, 46.2], 1.4, 4.3, 3.6)
  // The arched gable over the shop entrance (north side).
  {
    const xc = -25.6, y = 47.62, h = 1.5, w = 4.0
    const n: V3 = [0, 1, 0]
    tri(awning, [xc - w / 2, y, 3.6], [xc + w / 2, y, 3.6], [xc, y, 3.6 + h], n)
    tri(awning, [xc - w / 2, y - 1.5, 4.3], [xc - w / 2, y, 3.6], [xc, y, 3.6 + h], [-0.6, 0.4, 0.7])
    tri(awning, [xc + w / 2, y, 3.6], [xc + w / 2, y - 1.5, 4.3], [xc, y, 3.6 + h], [0.6, 0.4, 0.7])
  }
  // Canopy west of the wing (OSM 113) and the canopy east of the mid-section (118).
  prism(awning, [[-31.6, 31.4], [-33.2, 31.3], [-35.1, 46.2], [-31.6, 46.2]], 3.85, 4.1)
  prism(trim, rect(8.6, 18.2, 15.7, 22.4), 3.9, 4.15)

  // --- The stack (OSM 117; lidar 16.7 m) -----------------------------------
  squareStack([-26.6, 2.45], 2.3, 16.7)

  return {
    id: 'clt-atherton-mill', name: 'Atherton Mill', anchor: [0, 0] as XY, height: 16.7,
    parts: [
      { part: brick, material: BRICK },
      { part: roof, material: MILL_ROOF },
      { part: win, material: PALETTE.window },
      { part: trim, material: PALETTE.trim },
      { part: sign, material: SIGN },
      { part: awning, material: AWNING },
    ],
  }
}

if (import.meta.main) await write(buildAthertonMill())
