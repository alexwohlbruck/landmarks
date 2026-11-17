/**
 * The Bellevue (built 1902-04 as the Bellevue-Stratford Hotel, G. W. & W.
 * D. Hewitt; now The Bellevue Hotel, Unbound Collection by Hyatt, over
 * shops and offices) — original procedural geometry, CC0-1.0.
 * bun generators/phl-bellevue-stratford.ts [out.glb]
 *
 * Name: OSM way/334239470 "The Bellevue Hotel - The Unbound Collection by
 * Hyatt"; the building is known as The Bellevue, formerly the
 * Bellevue-Stratford Hotel (HABS PA-1226). Display name "The Bellevue".
 *
 * Frame: map frame turned to the Center City grid, bearing 9.7 (OSM sides
 * 9.7-9.8 / 99.6). +x east-south-east (Broad Street front), +y
 * north-north-east (Walnut Street front), z up, metres. Origin = centroid of
 * the OSM outline, 39.949088, -75.164865, on the street (Broad and Walnut
 * sidewalks, 0.4 m above the lidar box's ground_min). Elevation 0.
 *
 * Identity, in order: a square 19-storey French Renaissance block of pale
 * buff stone on the corner of Broad and Walnut; the dark slate mansard over
 * a heavy cornice, with tall steep-roofed pavilions at the four corners and
 * rows of big stone dormers between them (two-storey dormers beside each
 * pavilion); a higher ridge of roof storeys across the middle (the 18th-
 * floor ballroom). The three-storey rusticated base with arched windows,
 * the belt course under the top storeys.
 *
 * Evidence
 *  - OSM: way/334239470 (56.6 x 56.9 m, height 83.2). Replaced. The
 *    Bellevue Court Building to the west (way/342277759) is a separate
 *    building and is not.
 *  - Lidar: USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown 2015), 0.5 m
 *    grid read in this frame. Measured above the sidewalk: main cornice
 *    62.4 all round; the mansard rises to ~78-81 within 2-4 m of the faces;
 *    roof flats 81-85; the east (Broad St) corner pavilions ~85, the west
 *    ones 88-91; the middle ridge (x -26..24, |y| < 7) 89-93.
 *  - Published: 19 storeys, 1904, G. W. & W. D. Hewitt (Wikipedia
 *    "Bellevue-Stratford Hotel"; HABS PA-1226 data pages).
 *  - Estimated: storey heights (3.3 m above a 13 m base), the window bays
 *    (15 a side, counted on the HABS photos), dormer sizes and counts (5 a
 *    face between the pavilions, from HABS photos 2 and 3 and the postcard).
 *  - Colours: HABS colour photo 35 (CT) and the 1977 view: warm buff stone,
 *    dark grey slate with some copper. Pulled to the palette's lightness;
 *    the slate kept dark, as it is the roof that identifies the building.
 *
 * Photos (Wikimedia Commons, EVIDENCE, all HABS PA-1226 by Jack E. Boucher
 * unless noted, public domain):
 *  - GENERAL VIEW FROM SOUTHEAST (HABS PA,51-PHILA,344-1)
 *    https://commons.wikimedia.org/wiki/File:GENERAL_VIEW_FROM_SOUTHEAST_-_Bellevue-Stratford_Hotel,_Broad_and_Walnut_Streets,_Philadelphia,_Philadelphia_County,_PA_HABS_PA,51-PHILA,344-1.tif
 *  - UPPER STORIES AND ROOF, EAST FRONT (344-2)
 *    https://commons.wikimedia.org/wiki/File:UPPER_STORIES_AND_ROOF,_EAST_FRONT_-_Bellevue-Stratford_Hotel,_Broad_and_Walnut_Streets,_Philadelphia,_Philadelphia_County,_PA_HABS_PA,51-PHILA,344-2.tif
 *  - UPPER STORIES AND ROOF, SOUTH SIDE (344-3)
 *    https://commons.wikimedia.org/wiki/File:UPPER_STORIES_AND_ROOF,_SOUTH_SIDE_-_Bellevue-Stratford_Hotel,_Broad_and_Walnut_Streets,_Philadelphia,_Philadelphia_County,_PA_HABS_PA,51-PHILA,344-3.tif
 *  - VIEW OF BROAD STREET FACADE (344-35, colour)
 *    https://commons.wikimedia.org/wiki/File:VIEW_OF_BROAD_STREET_FACADE_-_Bellevue-Stratford_Hotel,_Broad_and_Walnut_Streets,_Philadelphia,_Philadelphia_County,_PA_HABS_PA,51-PHILA,344-35_(CT).tif
 *  - Bellevue-Stratford_Hotel_Buc1977.jpg (postcard, from the north-east),
 *    Buccaneer1977, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Bellevue-Stratford_Hotel_Buc1977.jpg
 *  No look-only sources; no commercial imagery.
 *
 * Night: hotel windows glow (`window`); the Broad St entrance glows. No
 * licensed night photo was found; the stone is not floodlit.
 *
 * Left out: the cartouches, balconies, cresting, the copper finials, fire
 * escapes, the rooftop plant and chimney, the oval bay at the south-west.
 *
 * Doubts: the west side (behind the Bellevue Court Building) has no photo;
 * built like the south side. The roof's inner layout is from the lidar only.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, inset, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'

const stone = new Part()
const trim = new Part()
const slate = new Part()
const win = new Part()
const door = new Part()

const HX = 28.3, HY = 28.5
const CORNICE = 62.4

/** A mansard over ring r from z0 to z1, drawn in `inset` at the top, flat top in `top`. */
function mansard(p: Part, top: Part | null, r: XY[], z0: number, z1: number, ins: number) {
  const r1 = inset(r, ins)
  walls(p, r, z0, z1, r1)
  if (top) cap(top, r1, z1)
  return r1
}

/** A band round ring r projecting `out`, z0..z1, with its top. */
function band(p: Part, r: XY[], z0: number, z1: number, out: number) {
  const o = inset(r, -out)
  walls(p, o, z0, z1)
  walls(p, o, z1, z1, r)
  walls(p, r, z0, z0, o)
}

/** Window bays on every edge of r between z rows. */
function bays(r: XY[], rows: [number, number][], n: number, w: number, skip: (i: number, k: number) => boolean = () => false, out = 0.04) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const step = L / n
    for (let k = 0; k < n; k++) {
      if (skip(i, k)) continue
      const c = step * (k + 0.5)
      for (const [z0, z1] of rows) panel(win, a, b, c - w / 2, c + w / 2, z0, z1, out)
    }
  }
}

/** Round-arched windows, n a face, w wide, from z0 with the arch springing at zs. */
function archBays(r: XY[], z0: number, zs: number, n: number, w: number) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const { L, P } = onWall(a, b)
    for (let k = 0; k < n; k++) {
      const c = (L / n) * (k + 0.5), h = w / 2
      win.quad(P(c - h, z0, 0.05), P(c + h, z0, 0.05), P(c + h, zs, 0.05), P(c - h, zs, 0.05))
      for (let j = 0; j < 6; j++) {
        const t0 = (Math.PI * j) / 6, t1 = (Math.PI * (j + 1)) / 6
        win.tri(P(c, zs, 0.05), P(c + h * Math.cos(t0), zs + h * Math.sin(t0), 0.05), P(c + h * Math.cos(t1), zs + h * Math.sin(t1), 0.05))
      }
    }
  }
}

/**
 * A stone dormer standing on the cornice line of the face a→b at s (centre
 * along), w wide, from z0 to z1 with a pediment to zP, reaching `depth` back
 * into the mansard.
 */
function dormer(a: XY, b: XY, s: number, w: number, z0: number, z1: number, zP: number, depth: number, out = 0.2) {
  const { P } = onWall(a, b)
  const s0 = s - w / 2, s1 = s + w / 2, f = out, k = -depth
  // front, sides, top and pediment
  stone.quad(P(s0, z0, f), P(s1, z0, f), P(s1, z1, f), P(s0, z1, f))
  stone.quad(P(s0, z0, k), P(s0, z0, f), P(s0, z1, f), P(s0, z1, k))
  stone.quad(P(s1, z0, f), P(s1, z0, k), P(s1, z1, k), P(s1, z1, f))
  const m = (s0 + s1) / 2
  stone.tri(P(s0 - 0.25, z1, f + 0.1), P(s1 + 0.25, z1, f + 0.1), P(m, zP, f + 0.1))
  // pediment roofs
  slate.quad(P(s1 + 0.25, z1, f + 0.1), P(s1 + 0.25, z1, k), P(m, zP, k), P(m, zP, f + 0.1))
  slate.quad(P(m, zP, f + 0.1), P(m, zP, k), P(s0 - 0.25, z1, k), P(s0 - 0.25, z1, f + 0.1))
  panel(win, a, b, s - w * 0.28, s + w * 0.28, z0 + 0.8, z1 - 0.9, f + 0.04)
}

function build() {
  const body = rect(-HX, -HY, HX, HY)
  // ---- the shaft ----
  block(stone, null, body, 0, CORNICE - 1.6, 0)
  // The base: three rusticated storeys, projecting a little and lighter,
  // shop windows on the ground and tall arched windows above (HABS 1, 35).
  const base = inset(body, -0.35)
  block(trim, trim, base, 0, 12.4, 0)
  band(trim, body, 12.4, 13.4, 0.55)
  const skip = (i: number, k: number) => i === 1 && (k === 9 || k === 10)
  bays(base, [[1.2, 5.0]], 15, 2.6, skip, 0.05)
  archBays(base, 6.6, 10.0, 15, 1.7)
  // Broad St entrance (the hotel's canopy), on the east front north of centre
  panel(door, base[1], base[2], 56.9 * 0.6 - 4, 56.9 * 0.6 + 4, 0, 6.0, 0.08)
  // The shaft: 11 storeys of 3.29 m, windows grouped two storeys high in
  // ten bays a face, stone piers and spandrels between; a belt course
  // part-way up and another under the upper storeys.
  const rows: [number, number][] = []
  let z = 13.4
  for (const n of [2, 2, 2]) { rows.push([z + 0.75, z + n * 3.29 - 0.75]); z += n * 3.29 }
  band(trim, body, z - 0.3, z + 0.4, 0.3)
  for (const n of [2, 3]) { rows.push([z + 0.85, z + n * 3.29 - 0.75]); z += n * 3.29 }
  bays(body, rows, 10, 2.3)
  band(trim, body, 49.6, 50.4, 0.35)
  bays(body, [[51.3, 55.0], [56.2, 59.6]], 10, 2.3)
  // the main cornice
  band(trim, body, CORNICE - 1.6, CORNICE, 0.9)

  // ---- the attic: three stone storeys over the cornice, set back a little,
  // under a lighter cornice (HABS photo 1) ----
  const ATTIC = 73.6
  const attic = inset(body, 0.5)
  walls(stone, attic, CORNICE, ATTIC - 0.8)
  bays(attic, [[CORNICE + 1.0, ATTIC - 1.8]], 10, 2.1)
  band(trim, attic, ATTIC - 0.8, ATTIC, 0.5)

  // ---- the roof ----
  // Main mansard between the pavilions, all round.
  const inner = mansard(slate, null, attic, ATTIC, 81, 3.4)
  cap(slate, inner, 81)
  // Roof storeys across the middle (the ballroom), lidar 89-93.
  const ridge = rect(-26, -7, 24, 7)
  // the ballroom storey: low stone walls (HABS photo 3) under a slate mansard
  block(stone, null, ridge, 80.5, 84.0, 0)
  band(trim, ridge, 83.4, 84.0, 0.3)
  mansard(slate, slate, ridge, 84.0, 90.5, 2.6)

  // Corner pavilions: 13 m square, steep mansards to 85 (Broad St side) and
  // 89.5 (west side), flat tops with a stone rim.
  const PW = 13
  for (const [sx, sy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]] as [number, number][]) {
    const x0 = sx > 0 ? HX - PW : -HX, y0 = sy > 0 ? HY - PW : -HY
    const r = rect(x0, y0, x0 + PW, y0 + PW)
    const top = sx > 0 ? 86 : 89.5
    const rr = inset(r, 0.5)
    const r1 = mansard(slate, null, rr, ATTIC, top - 1.2, 3.4)
    const r2 = mansard(slate, null, r1, top - 1.2, top, 0.5)
    block(trim, slate, r2, top, top + 0.6, 0.15)
    // a tall dormer on each outer face of the pavilion
    const faces: [XY, XY][] = []
    faces.push(sy < 0 ? [rr[0], rr[1]] : [rr[2], rr[3]])
    faces.push(sx > 0 ? [rr[1], rr[2]] : [rr[3], rr[0]])
    for (const [a, b] of faces) dormer(a, b, Math.hypot(b[0] - a[0], b[1] - a[1]) / 2, 4.2, ATTIC, 80.6, 84.0, 3.4)
  }

  // Dormers between the pavilions: five a face, the middle one larger.
  for (let i = 0; i < 4; i++) {
    const a = attic[i], b = attic[(i + 1) % 4]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const span = L - 2 * (PW - 0.5)
    for (let k = 0; k < 5; k++) {
      const s = PW - 0.5 + span * (k + 0.5) / 5
      const big = k === 2
      dormer(a, b, s, big ? 3.8 : 3.0, ATTIC, big ? 78.6 : 78.0, big ? 80.9 : 80.6, 3.4)
    }
  }

  return [
    { part: stone, material: finish('bellevue-stone', 0xe7dbc6) },
    { part: trim, material: PALETTE.trim },
    { part: slate, material: finish('bellevue-slate', 0x646c70) },
    { part: win, material: { ...PALETTE.window, color: 0x5e6a74 } },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('phl-bellevue-stratford', 'The Bellevue', [39.949088, -75.164865], 9.7, build())
