/**
 * Plaza Building, Design Center of the Carolinas, 1930 Camden Rd, South End,
 * Charlotte — procedural, CC0-1.0.
 * bun generators/clt-plaza-building.ts
 *
 * One of the mill-era brick buildings of the Design Center campus, across
 * the courtyard from the Nebel Knitting Mill (clt-design-center): a broad
 * block of red-orange brick, two storeys at its low (Doggett / Hawkins St)
 * end, flat roofs in several sections behind plain parapets, with low gabled
 * parapets trimmed in white on the courtyard and Camden Rd faces. Its Camden
 * wing holds Hawkers and Shake Shack, with Hawkers' dark steel canopy over a
 * raised deck on the courtyard; the courtyard face is "The Parachute" (1930).
 * The ground rises ~6 m from the north-west corner to Tremont Ave, so the
 * south end shows only one storey above the street.
 *
 * Evidence:
 *  - OSM: way/432929160 ("Plaza Building", commercial, 2 levels). No parts.
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 0.5 m (ground_min under
 *    the footprint 219.9 m NAVD88 = y 0, at the north-west corner). Roofs
 *    above base: the north section 10.0 m, the middle 10.4 m, the south-west
 *    9.2 m, the south-east 10.3 m; the courtyard gable 11.8 m, the corner
 *    gable over Hawkers 12.3 m. Ground: -0.4 m at the NW corner, 4.6 m on
 *    Camden Rd, 6.4 m at the south corner.
 *  - USGS NAIP (public domain): the roof sections and firewalls, dark grey.
 *  - Photos (Wikimedia Commons, City Dweller 2, CC BY-SA 4.0, April 2024):
 *    https://commons.wikimedia.org/wiki/File:Hawkers_at_the_Design_Center_Mid-April_2024.jpg (the Camden wing from the courtyard: gables, canopy, brick)
 *    https://commons.wikimedia.org/wiki/File:Parachute_and_Hawkers_at_the_Design_Center_Mid-April_2024.jpg (the courtyard face, its low gable and white band)
 *    https://commons.wikimedia.org/wiki/File:Design_Center_at_Camden_and_Tremont_Mid-April_2024.jpg (Camden Rd face looking south: gables, Shake Shack)
 *    https://commons.wikimedia.org/wiki/File:Design_Center_1930_Camden_Rd_Building_Hawkings_St_entrance_Mid-April_2024.jpg (Hawkins St side: brick colour, a gable end)
 *    https://commons.wikimedia.org/wiki/File:Design_Center_Alley_Mid-April_2024.jpg (the alley side: tall plain brick wall)
 *
 * Window treatment matches clt-design-center (the Nebel mill): two rows of
 * wide steel windows, 3.4 m on a 4.0 m bay. Estimated: the gable spans and
 * peaks on the Camden face, the canopy (4 m over the courtyard, 6 m deep),
 * the white band at the gables' feet.
 *
 * Doubts: the window bays are the Nebel treatment applied to every face;
 * photos show the Camden and courtyard faces, not the Tremont end or the
 * Hawkins St face in full. The brick here is redder and lighter than
 * Nebel's dark brick in every photo, so it gets its own finish.
 *
 * Model frame: bearing 30, as clt-design-center (model +y faces 30°, toward
 * Worthington Ave; +x is the Camden Road side); metres above the base.
 *
 * Exports the campus helpers used by clt-atrium-building.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type Block, type Kit, type Row, type XY, build, clip, quad, tri } from './clt-highland-park-mill-3'
import { facesOf, writeAtBase } from './clt-vantage-south-end'

export const CAMPUS_BRICK = finish('campus-brick', 0xb2634e)
const STEEL = finish('plaza-steel', 0x4f545b)
/** The Nebel mill's two rows of steel windows (clt-design-center). */
export const MILL_ROWS: Row[] = [{ z0: 2.4, z1: 5.5, w: 3.4 }, { z0: 6.3, z1: 9.7, w: 3.4 }]

/** A gable parapet on the wall A→B (outward normal `o`): brick triangle and a trim coping. */
export function gable(brick: Part, trim: Part, A: XY, B: XY, o: XY, z: number, peak: number, t = 0.45) {
  const M: XY = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], N: V3 = [o[0], o[1], 0], I: XY = [-o[0] * t, -o[1] * t]
  const P = (p: XY, h: number, d = 0): V3 => [p[0] + I[0] * d, p[1] + I[1] * d, h]
  tri(brick, P(A, z), P(B, z), P(M, peak), N)
  tri(brick, P(A, z, 1), P(B, z, 1), P(M, peak, 1), [-o[0], -o[1], 0])
  // Coping along both slopes, standing 0.4 m, trim-coloured.
  for (const [E, F] of [[A, M], [M, B]] as [XY, XY][]) {
    const ze = E === M ? peak : z, zf = F === M ? peak : z
    quad(trim, P(E, ze + 0.4, -0.08), P(F, zf + 0.4, -0.08), P(F, zf + 0.4, 1), P(E, ze + 0.4, 1), [0, 0, 1])
    quad(trim, P(E, ze, -0.08), P(F, zf, -0.08), P(F, zf + 0.4, -0.08), P(E, ze + 0.4, -0.08), N)
    quad(trim, P(E, ze, 1), P(F, zf, 1), P(F, zf + 0.4, 1), P(E, ze + 0.4, 1), [-o[0], -o[1], 0])
  }
}

/** Ground above base (lidar): rises south (−y) and east (+x) from the NW corner. */
const ground = (p: XY) => {
  const dx = p[0] + 44, dy = 44 - p[1]
  return Math.max(0, Math.min(6.4, -0.3 + 0.031 * dx + 0.056 * dy - 0.0004 * dx * dy))
}

const OUTLINE: XY[] = [[-33.8, 42.0], [33.9, 42.0], [33.3, 16.6], [33.2, 13.0], [50.9, 13.0], [50.8, 9.0], [50.1, -5.1], [49.5, -21.1], [35.7, -26.7], [36.0, -18.8], [16.2, -19.7], [16.0, -22.9], [15.6, -35.1], [4.5, -35.6], [4.3, -40.5], [-4.0, -40.5], [-3.8, -42.8], [-28.9, -53.2], [-32.6, -53.5], [-34.9, -52.0], [-36.6, -48.6], [-35.7, 10.3], [-33.8, 10.3]]

function buildPlaza() {
  const brick = new Part(), win = new Part(), trim = new Part(), roof = new Part(), steel = new Part()
  const kit: Kit = { win, trim, roof: roof, ground }
  const north = clip(OUTLINE, [0, 10], [1, 0]), rest = clip(OUTLINE, [0, 10], [-1, 0])
  const mid = clip(rest, [0, -4], [1, 0]), south = clip(rest, [0, -4], [-1, 0])
  const sw = clip(south, [2, 0], [0, 1]), se = clip(south, [2, 0], [0, -1])
  const blocks: Block[] = [
    { poly: north, top: 10.4, wall: brick, rows: MILL_ROWS, pitch: 4.0 },
    { poly: mid, top: 10.8, wall: brick, rows: MILL_ROWS, pitch: 4.0 },
    { poly: sw, top: 9.6, wall: brick, rows: MILL_ROWS, pitch: 4.0 },
    { poly: se, top: 10.7, wall: brick, rows: MILL_ROWS, pitch: 4.0 },
  ]
  build(blocks, kit)

  // Gabled parapets (lidar peaks; spans from the photos).
  const F = facesOf(OUTLINE)
  const court = F.find((f) => f.o[0] > 0.9 && f.A[1] + f.B[1] > 40)!
  gable(brick, trim, court.A, court.B, court.o, 10.4, 11.8)
  gable(brick, trim, [33.4, 13.0], [50.9, 13.0], [0, 1], 10.7, 12.3)
  // Camden Rd: a gable centred on each of the face's two runs.
  for (const f of F.filter((f) => f.o[0] > 0.9 && f.A[1] + f.B[1] < 8 && f.L > 10)) {
    const s0 = f.L / 2 - 4.5, s1 = f.L / 2 + 4.5
    gable(brick, trim, [f.A[0] + f.u[0] * s0, f.A[1] + f.u[1] * s0], [f.A[0] + f.u[0] * s1, f.A[1] + f.u[1] * s1], f.o, f.A[1] > -10 ? 10.8 : 10.7, 12.0)
  }
  // White bands at the gables' feet on the courtyard faces.
  for (const [A, B, o] of [[court.A, court.B, court.o], [[50.9, 13.0], [33.4, 13.0], [0, 1]]] as [XY, XY, XY][]) {
    const N: V3 = [o[0], o[1], 0], d = 0.12
    const P = (p: XY, z: number, k = d): V3 => [p[0] + o[0] * k, p[1] + o[1] * k, z]
    quad(trim, P(A, 6.9), P(B, 6.9), P(B, 7.5), P(A, 7.5), N)
    quad(trim, P(A, 7.5, 0), P(B, 7.5, 0), P(B, 7.5), P(A, 7.5), [0, 0, 1])
  }

  // Hawkers' dark steel canopy over its deck, on the Camden wing's courtyard side.
  {
    const z = 7.4, x0 = 34.8, x1 = 50.2, y0 = 13.0, y1 = 19.0
    const V = (x: number, y: number, h: number): V3 => [x, y, h]
    quad(steel, V(x0, y0, z), V(x1, y0, z), V(x1, y1, z), V(x0, y1, z), [0, 0, 1])
    quad(steel, V(x0, y0, z - 0.5), V(x1, y0, z - 0.5), V(x1, y1, z - 0.5), V(x0, y1, z - 0.5), [0, 0, -1])
    quad(steel, V(x0, y1, z - 0.5), V(x1, y1, z - 0.5), V(x1, y1, z), V(x0, y1, z), [0, 1, 0])
    quad(steel, V(x0, y0, z - 0.5), V(x0, y1, z - 0.5), V(x0, y1, z), V(x0, y0, z), [-1, 0, 0])
    quad(steel, V(x1, y0, z - 0.5), V(x1, y1, z - 0.5), V(x1, y1, z), V(x1, y0, z), [1, 0, 0])
    for (const x of [36, 43.5, 49]) {
      const c: XY = [x, 18.6]
      for (const [a, b, n] of [[[-0.2, -0.2], [0.2, -0.2], [0, -1]], [[0.2, -0.2], [0.2, 0.2], [1, 0]], [[0.2, 0.2], [-0.2, 0.2], [0, 1]], [[-0.2, 0.2], [-0.2, -0.2], [-1, 0]]] as [XY, XY, XY][])
        quad(steel, [c[0] + a[0], c[1] + a[1], ground(c) - 0.3], [c[0] + b[0], c[1] + b[1], ground(c) - 0.3], [c[0] + b[0], c[1] + b[1], z - 0.5], [c[0] + a[0], c[1] + a[1], z - 0.5], [n[0], n[1], 0])
    }
  }

  return {
    id: 'clt-plaza-building', name: 'Plaza Building', anchor: [0, 0] as XY, height: 12.7,
    parts: [
      { part: brick, material: CAMPUS_BRICK },
      { part: roof, material: PALETTE.roof },
      { part: win, material: PALETTE.window },
      { part: trim, material: PALETTE.trim },
      { part: steel, material: STEEL },
    ],
  }
}

if (import.meta.main) await writeAtBase(buildPlaza())
