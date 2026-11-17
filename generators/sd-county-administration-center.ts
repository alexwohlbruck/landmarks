/**
 * San Diego County Administration Center (1938; Samuel Hamill, William
 * Templeton Johnson, Richard Requa and Louis Gill; Spanish Revival with
 * Beaux-Arts and Moderne detail), 1600 Pacific Highway, on the bay —
 * original procedural geometry, CC0-1.0.
 * bun generators/sd-county-administration-center.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the area centroid of
 * the OSM outline way/26748195, 32.721946, -117.171917; bearing 0 (the
 * building is square to north within 0.3°).
 *
 * Identity, in order: the central stepped Moderne tower over the long
 * five-storey main block facing the bay, its tall shaft with the three
 * vertical window strips and blue-green tile panels on each face and the
 * flat top; the red-tile hipped roofs of the two long wings
 * either side of it; the flat-roofed end pavilions and the east wings that
 * close the courtyard on the city side; the cream stucco; the arched
 * entrances with their blue tile surrounds, and the arched top-floor
 * windows framed in tile.
 *
 * Evidence:
 *  - plan: OSM outline way/26748195 and its parts way/1154814393 (north
 *    wing, hipped tile roof), way/1154814394 (south wing) and
 *    way/1154814395 (the tower, a cross in plan, 16.7 m each way); NAIP
 *    (USGS) for the red roofs, the flat white roofs of the end pavilions and
 *    east wings, and the tree-filled courtyard to the east (not modelled).
 *  - heights: lidar CA_SanDiegoQL2_2014, 1 m grid. The ground falls from
 *    2.6 m on the bay side to 1.3 m at the north-east corner; y = 0 is
 *    taken at 1.4 m. Above that: wing eaves 19.8 m, ridges 24.0 m; tower
 *    pavilion 24.5 m; the tower's cross arms 40.8 m, its central core
 *    46.1 m (OSM's 13 levels); end pavilions 19.6 m with the lower west
 *    flanks at 15.1 m; east wings 15.2 m, the south one with a penthouse
 *    to 17.9 m.
 *  - floors (5 in the wings, OSM levels=5), bay rhythm, arched top-floor
 *    windows with tile frames, the entrance arches and the tower's three
 *    window strips with tile panels: from the photos.
 *  - colours: cream stucco (OSM building:colour E8CFCB reads pinker than
 *    any photo; the photos' warm cream is used), red clay tile, blue-green
 *    tile, slate windows; the flat roofs near-white as in NAIP (OSM
 *    roof:colour white).
 *  - the brief mentioned a tiled pyramidal or domed top to the tower: the
 *    tower is flat-topped and stepped in every photo; the coloured tile is
 *    in the window panels and the entrance arches, so that is where it is
 *    drawn.
 *  - night: the building is floodlit warm from the ground (Tony Webster's
 *    dusk photos; on some nights in colours): a floodlight wash on the
 *    stucco; the entrances glow.
 *
 * Photos (Wikimedia Commons): San_Diego_City_and_County_Administration_
 * Building.jpg (Adbar, CC BY-SA 3.0); San_Diego_City_and_Administration_
 * Building_(cropped).jpg (Business Navigatoren, CC BY-SA 3.0 de); San_Diego
 * _County_Administration_Center_(54305382019).jpg (Matt Boulton, CC BY-SA
 * 2.0); San_Diego_County_Administration_Center_2.jpg and _3.jpg (Keizers, CC BY-SA
 * 3.0); San_Diego_County_Administration_Center_(16039652862).jpg,
 * (18765671743).jpg, (19198739008).jpg and San_Diego_City_and_County_
 * Administration_Building_-_City_Hall.jpg (Tony Webster, CC BY 2.0);
 * San_Diego_Civic_Center_1.jpg (SD Dirk, CC BY 2.0); San_Diego_Civic_
 * Center_2.jpg (Edward O'Connor, CC BY-SA 2.0). No commercial imagery.
 *
 * Left out: the Guardian of Water statue and fountains, the courtyard and
 * its trees, the window grilles, inscriptions and seals, rooftop plant.
 *
 * Doubts: the east wings and the courtyard faces are seen only in distant
 * photos; their windows follow the main block's rhythm. Floor heights are
 * the eave height shared by five storeys.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, parapetRoof, rect, save, walls, type XY } from './chi-aon-center'
import { along, archOn, face, rectOn } from './phl-independence-hall'

const EAVE = 19.8, RIDGE = 24.0, PAV = 24.5, ARMS = 40.8, CORE = 46.1, END = 19.6, FLANK = 15.1, EAST = 15.2
const TX = -14.2, TY = 0.1 // tower centre

function build() {
  const stucco = new Part(), tile = new Part(), win = new Part(), blue = new Part(), roof = new Part(), door = new Part()

  /** A block with a parapeted flat roof. */
  const flat = (r: XY[], h: number, z0 = 0) => { walls(stucco, r, z0, h); parapetRoof(stucco, roof, r, h, 0.45, 0.7) }
  /** Edge k of a counter-clockwise ring. */
  const edge = (r: XY[], k: number): [XY, XY] => [r[k], r[(k + 1) % r.length]]

  /**
   * Window bays along wall a→b between s0 and s1: two panels spanning two
   * storeys each and an arched top-floor window in a tile frame, or plain
   * panels when `arched` is false.
   */
  const facade = (a: XY, b: XY, s0: number, s1: number, pitch: number, rows: [number, number][], top?: [number, number]) => {
    const n = Math.max(1, Math.round((s1 - s0) / pitch)), w = (s1 - s0) / n
    for (let i = 0; i < n; i++) {
      const c = s0 + (i + 0.5) * w, hw = Math.min(0.95, w * 0.26)
      for (const [z0, z1] of rows) rectOn(win, a, b, c, hw, z0, z1, 0.05)
      if (top) {
        archOn(blue, a, b, c, hw + 0.35, top[0] - 0.35, top[1], 0.04, 8)
        archOn(win, a, b, c, hw, top[0], top[1], 0.07, 8)
      }
    }
  }
  const ROWS: [number, number][] = [[2.3, 7.7], [9.3, 14.6]]
  const TOP: [number, number] = [16.1, 17.7]

  // ------------------------------------------------- the main wings
  // Long five-storey wings either side of the tower under hipped tile roofs.
  const wing = (y0: number, y1: number) => {
    const r = rect(-24.9, y0, -3.3, y1)
    walls(stucco, r, 0, EAVE)
    // a shallow eave overhang, then the hipped roof (ridge along y)
    const o = rect(-25.5, y0 - 0.3, -2.7, y1 + 0.3)
    cap(stucco, o, EAVE - 0.35, false)
    walls(stucco, o, EAVE - 0.35, EAVE)
    const xc = (o[0][0] + o[1][0]) / 2, hw = (o[1][0] - o[0][0]) / 2
    const R0: V3 = [xc, o[0][1] + hw * 0.9, RIDGE], R1: V3 = [xc, o[2][1] - hw * 0.9, RIDGE]
    const [p0, p1, p2, p3] = o.map(([x, y]) => [x, y, EAVE] as V3)
    face(tile, [p0, p1, R0], [0, -1, 1])
    face(tile, [p1, p2, R1, R0], [1, 0, 1])
    face(tile, [p2, p3, R1], [0, 1, 1])
    face(tile, [p3, p0, R0, R1], [-1, 0, 1])
    // windows on the bay (west) and courtyard (east) faces
    facade(...edge(r, 3), 1.0, y1 - y0 - 1.0, 4.4, ROWS, TOP)
    facade(...edge(r, 1), 1.0, y1 - y0 - 1.0, 4.4, ROWS, TOP)
  }
  wing(8.6, 49.4)
  wing(-47.8, -8.2)

  // --------------------------------------------- the tower pavilion
  const pav = rect(-25.7, -8.2, -2.5, 8.6)
  flat(pav, PAV)
  // Fluted piers either side of the entrance: two slim projecting fins.
  for (const x of [-25.7, -2.5]) for (const y of [-5.6, 5.9]) {
    const s = x < -10 ? -1 : 1
    const r: XY[] = s < 0 ? rect(x - 0.6, y - 0.8, x, y + 0.8) : rect(x, y - 0.8, x + 0.6, y + 0.8)
    walls(stucco, r, 0, PAV + 0.8); cap(stucco, r, PAV + 0.8)
  }
  // Arched entrances, west (bay) and east (courtyard), in blue tile frames.
  for (const k of [3, 1]) {
    const [a, b] = edge(pav, k), L = along(a, b).L
    archOn(blue, a, b, L / 2, 3.3, 0.6, 8.4, 0.05, 10)
    archOn(door, a, b, L / 2, 2.4, 0.6, 8.0, 0.09, 10)
    // the inscription panel and the grille above
    rectOn(stucco, a, b, L / 2, 3.6, 13.0, 15.2, 0.12)
    rectOn(win, a, b, L / 2, 1.6, 19.0, 21.6, 0.05)
    // windows beside the piers
    for (const d of [-4.4, 4.4]) rectOn(win, a, b, L / 2 + d, 0.6, 9.3, 14.6, 0.05)
  }

  // ----------------------------------------------------- the tower
  // A cross in plan (OSM) to the shoulders, the central core to the top.
  const T = (x: number, y: number): XY => [TX + x, TY + y]
  const cross: XY[] = [
    T(-5.4, -8.3), T(5.4, -8.3), T(5.4, -5.5), T(8.35, -5.5), T(8.35, 5.4), T(5.4, 5.4), T(5.4, 8.4), T(-5.4, 8.4),
    T(-5.4, 5.4), T(-8.35, 5.4), T(-8.35, -5.5), T(-5.4, -5.5),
  ]
  walls(stucco, cross, PAV, ARMS)
  parapetRoof(stucco, roof, cross, ARMS, 0.4, 0.6)
  const core = [T(-5.3, -5.3), T(5.3, -5.3), T(5.3, 5.3), T(-5.3, 5.3)]
  walls(stucco, core, ARMS - 0.6, CORE)
  parapetRoof(stucco, roof, core, CORE, 0.45, 0.8)
  // The core's top: a plain parapet with raised corner blocks, and the
  // blue tile band just under it.
  for (const [cx, cy] of [[-4.6, -4.6], [4.6, -4.6], [4.6, 4.6], [-4.6, 4.6]]) {
    const q = rect(TX + cx - 0.7, TY + cy - 0.7, TX + cx + 0.7, TY + cy + 0.7)
    walls(stucco, q, CORE, CORE + 0.9); cap(stucco, q, CORE + 0.9)
  }
  for (let k = 0; k < 4; k++) {
    const [a, b] = edge(core, k)
    // the blue tile band under the parapet
    rectOn(blue, a, b, 5.3, 4.2, CORE - 2.4, CORE - 1.3, 0.05)
  }
  // Each arm face: three tall window strips in two-storey groups with
  // blue-green tile panels between them.
  const armFaces: [XY, XY][] = [[T(-8.35, 5.4), T(-8.35, -5.5)], [T(8.35, -5.5), T(8.35, 5.4)], [T(-5.4, -8.3), T(5.4, -8.3)], [T(5.4, 8.4), T(-5.4, 8.4)]]
  for (const [a, b] of armFaces) {
    const L = along(a, b).L
    for (const d of [-2.6, 0, 2.6]) {
      for (const [z0, z1] of [[26.0, 30.4], [31.6, 35.0], [36.2, 39.4]] as [number, number][]) {
        rectOn(win, a, b, L / 2 + d, 0.7, z0, z1, 0.06)
        rectOn(blue, a, b, L / 2 + d, 0.7, z1 + 0.05, z1 + 1.1, 0.06)
      }
    }
    // the core's face above the arms carries the strips on
    rectOn(blue, a, b, L / 2, 3.4, ARMS - 0.6, ARMS - 0.2, 0.06)
  }
  for (let k = 0; k < 4; k++) {
    const [a, b] = edge(core, k)
    for (const d of [-2.6, 0, 2.6]) rectOn(win, a, b, 5.3 + d, 0.7, ARMS + 0.4, CORE - 3.0, 0.05)
  }

  // ------------------------------------------- end pavilions and wings
  for (const s of [1, -1]) {
    const yIn = s > 0 ? 49.4 : -47.8, yOut = s > 0 ? 72.9 : -71.0
    const P = rect(-24.9, Math.min(yIn, yOut), -3.1, Math.max(yIn, yOut))
    flat(P, END)
    const yf = s > 0 ? 69.3 : -68.8
    const F = rect(-33.4, Math.min(yIn, yf), -24.9, Math.max(yIn, yf))
    flat(F, FLANK)
    // windows: the pavilion's west, north/south and east faces; the flank's
    for (const k of [3, s > 0 ? 2 : 0]) {
      const [a, b] = edge(P, k), L = along(a, b).L
      facade(a, b, 1.5, L - 1.5, 3.6, [[2.3, 7.7], [9.3, 14.6], [16.0, 18.4]])
    }
    for (const k of [3, s > 0 ? 2 : 0]) {
      const [a, b] = edge(F, k), L = along(a, b).L
      facade(a, b, 1.0, L - 1.0, 3.6, [[2.3, 7.7], [9.3, 13.6]])
    }
  }
  // East wings, closing the courtyard; L-shaped, flat-roofed.
  const north: XY[] = [[-3.1, 49.5], [42.3, 49.5], [42.3, 83.9], [25.4, 83.9], [25.4, 69.3], [-3.1, 69.3]]
  const south: XY[] = [[-2.8, -68.7], [25.2, -68.7], [25.2, -83.2], [43.0, -83.2], [43.0, -47.8], [-2.8, -47.8]]
  for (const r of [north, south]) {
    walls(stucco, r, 0, EAST)
    parapetRoof(stucco, roof, r, EAST, 0.45, 0.7)
    for (let k = 0; k < r.length; k++) {
      const [a, b] = edge(r, k), L = along(a, b).L
      if (L < 8 || (a[0] < 0 && b[0] < 0)) continue // the face against the pavilion
      facade(a, b, 1.0, L - 1.0, 3.6, [[1.6, 6.6], [8.0, 13.2]])
    }
  }
  // South wing penthouse.
  flat(rect(4, -62, 32, -54), 17.9, EAST - 0.7)

  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : Math.max(0.35, 1 - p[2] / 70))
  return [
    { part: stucco, material: { ...finish('sdcac-stucco', 0xf0e2cc), floodlight: lit } },
    { part: tile, material: finish('sdcac-tile', 0xb96a50) },
    { part: win, material: PALETTE.window },
    { part: blue, material: finish('sdcac-blue-tile', 0x6f9fa6) },
    { part: roof, material: finish('sdcac-flat-roof', 0xd6d3cc) },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('sd-county-administration-center', 'San Diego County Administration Center', [32.721946, -117.171917], 0, build(), 5000)
