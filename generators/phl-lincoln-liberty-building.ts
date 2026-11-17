/**
 * One South Broad (built 1932 as the Lincoln-Liberty Building, John T.
 * Windrim; later the Philadelphia National Bank / PNB Building) —
 * original procedural geometry, CC0-1.0.
 * bun generators/phl-lincoln-liberty-building.ts [out.glb]
 *
 * Name: OSM way/333204612 and relation/4846617 are named "One South
 * Broad" (alt_name "PNB Building", wikidata Q7093219), which is the name in
 * use today, so it is the display name. Also known as the Lincoln-Liberty
 * Building (its 1932 name, kept as the id) and the PNB Building.
 *
 * Frame: map frame turned to the Center City grid, bearing 9.3 (the OSM
 * outline's sides run 9.3-9.6 / 99.2-99.5). +x east-south-east (toward
 * Juniper St and the Widener Building), +y north-north-east (toward City
 * Hall / South Penn Square), z up, metres. Origin = area centroid of the
 * OSM outline, 39.951176, -75.163491, on the lowest ground under it
 * (Broad St sidewalk, 2.8 m above the lidar box's ground_min). Elevation 0.
 *
 * Identity, in order: the grey limestone Art Deco shaft on Broad Street
 * just south of City Hall, a U of 100 m wings round a recessed middle, the
 * middle and east slab stepping up to 111 and 120 m; the tall open belfry
 * crown (the carillon tower), a chamfered block with one big opening on
 * each face and narrower ones on the chamfers, a solid parapet over them.
 *
 * Clocks: no licensed photo shows clock dials on the crown. Every photo
 * (1932 rendering, 2000s, Oct 2025) shows open belfry openings with the
 * bell frame inside; the only clock is a small one over the Broad St
 * entrance in the 1932 rendering, too small for this model. So the crown
 * carries open bays, not clock faces. The PNB letters that stood on the
 * crown until the 2010s are gone in Wobbanight's Oct 2025 photo and are
 * left out.
 *
 * Evidence
 *  - OSM: outline way/333204612 (30.8 x 60.2 m, with a light-well notch on
 *    the east side) and the building relation/4846617 with its parts
 *    way/336681395 (100), /336681396 (110), /336681398 (128), /337052603
 *    (144), /336681400 (96), /336681401 (38, 9 levels), /336681402 (118),
 *    /341324299 and /341324300 (120). All replaced.
 *  - Lidar: USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown 2015), 0.5 m
 *    grid read in this frame. Measured above the Broad St sidewalk: the
 *    west middle (x -14.7..-8.8, |y| < 15) only 45.6 m (OSM's 9-level part):
 *    above it the middle is recessed 6 m behind the Broad St wings; wings
 *    100 (99.5 at the edge, 103 a little in); then setback stages with
 *    chamfered corners: the middle stage 110 (x -10..6.4, |y| < 22.5), the
 *    core 118 (x -9..10, |y| < 15), the east slab 121.5 round the light
 *    well, a plinth ~18 x 21 m at 127 hugging the crown; the crown's top
 *    144.8 (OSM 144). The crown in the lidar is ~13.5 x 17.5 m with
 *    ~3.5 m chamfers, centred ~0.7 m east of OSM's crown part; the model
 *    uses 13 x 17, centred (0.5, 0). The east light well (outside the OSM
 *    outline) has a roof at ~60 m in the lidar; it is left out.
 *  - Published (Wikipedia "One South Broad"): 1932, 28 storeys, 144 m (472
 *    ft); John T. Windrim, architect; carillon in the tower.
 *  - Photo-measured: the crown's stages from AEngineer's photo (taken from
 *    about the crown's own height, so little foreshortening): parapet 23 %,
 *    openings 42 %, the base below them 35 % of the crown from the core
 *    roof; the big openings ~23 % of a face's width.
 *  - Estimated: storey heights (3.75 m), window bays (one panel per pair of
 *    windows, 4.4 m apart, two storeys high, as on Smallbones' photo from
 *    the west), the base's tall shop windows, the crown's open bays (about
 *    60 % of each long face, from the photos).
 *  - Colours from the photos, pulled to the palette's lightness: grey
 *    limestone throughout; windows dark; the belfry's openings near black.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  - One_south_broad.jpg, AEngineer, CC BY-SA 2.0 (from a tower to the
 *    south-west, at crown height: crown, steps, wings)
 *    https://commons.wikimedia.org/wiki/File:One_south_broad.jpg
 *  - One_South_Broad_Oct_2025.jpg, Wobbanight, CC0 (from the north, over
 *    City Hall; crown without the sign)
 *    https://commons.wikimedia.org/wiki/File:One_South_Broad_Oct_2025.jpg
 *  - 1_South_Broad_top.jpg, Smallbones, CC0 (the crown close up)
 *    https://commons.wikimedia.org/wiki/File:1_South_Broad_top.jpg
 *  - 1_South_Broad_from_west.jpg, Smallbones, CC0 (the Broad St front)
 *    https://commons.wikimedia.org/wiki/File:1_South_Broad_from_west.jpg
 *  - 1_South_Broad_EVOL.jpg, Smallbones, CC0 (from LOVE Park, north)
 *    https://commons.wikimedia.org/wiki/File:1_South_Broad_EVOL.jpg
 *  - Lincoln-Liberty_Building_-_DPLA_-_36d93456e83fddd1089262b28e839273.jpg,
 *    Philip B. Wallace (architect's rendering, 1932), public domain
 *  USGS NAIP not needed (lidar gives the plan). No look-only sources; no
 *  commercial imagery.
 *
 * Night: the office windows glow (`window`), the Broad St entrance glows.
 * No licensed night photo was found, so the crown is not floodlit and its
 * openings stay dark.
 *
 * Left out: the Art Deco reliefs, the fan ornaments under the belfry, the
 * belfry's balconies and bell frame, flagpoles, rooftop plant, mullions.
 *
 * Doubts: the east and south faces have no photo of their own (built like
 * the north and west, as in the 1932 rendering); the east slab's height is
 * lidar only; the crown's exact chamfer.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, chamfer, inset, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'

const stone = new Part()
const roof = new Part()
const win = new Part()
const dark = new Part() // belfry openings
const door = new Part()

/**
 * Window panels on the edges of `r` listed in `edges`: one panel per pair of
 * windows (a bay, `bay` apart, `winW` wide) per row of two storeys, so stone
 * shows between them as piers and spandrels.
 */
function facade(r: XY[], edges: number[], rows: [number, number][], bay = 4.4, winW = 2.1, end = 1.6) {
  for (const i of edges) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = Math.max(1, Math.round((L - 2 * end) / bay))
    const step = (L - 2 * end) / n
    for (let k = 0; k < n; k++) {
      const c = end + step * (k + 0.5)
      for (const [z0, z1] of rows) panel(win, a, b, c - winW / 2, c + winW / 2, z0, z1)
    }
  }
}

/** Rows of 2 storeys (3.75 m) from z0 up to z1, with 1.6 m spandrels. */
function storeyRows(z0: number, z1: number, per = 2, h = 3.75): [number, number][] {
  const out: [number, number][] = []
  for (let z = z0; z + h * per <= z1 + 0.5; z += h * per) out.push([z + 0.8, Math.min(z + h * per - 0.8, z1 - 1.0)])
  const last = out.length ? out[out.length - 1][1] + 0.7 : z0
  if (z1 - last > 3) out.push([last + 0.7, z1 - 1.2])
  return out
}

/**
 * A wall face from a to b with a recessed opening (s0..s1 along, h0..h1
 * up) `depth` deep: the face is built round the hole in `wall`, the reveals
 * in `wall`, the back in `back`.
 */
function holedFace(wall: Part, back: Part, a: XY, b: XY, z0: number, z1: number, s0: number, s1: number, h0: number, h1: number, depth: number) {
  const { L, P } = onWall(a, b)
  const q = (p: Part, A: V3, B: V3, C: V3, D: V3) => p.quad(A, B, C, D)
  q(wall, P(0, z0), P(L, z0), P(L, h0), P(0, h0))
  q(wall, P(0, h1), P(L, h1), P(L, z1), P(0, z1))
  q(wall, P(0, h0), P(s0, h0), P(s0, h1), P(0, h1))
  q(wall, P(s1, h0), P(L, h0), P(L, h1), P(s1, h1))
  const d = -depth
  // reveals, facing into the opening
  q(wall, P(s0, h0), P(s0, h0, d), P(s0, h1, d), P(s0, h1))
  q(wall, P(s1, h0, d), P(s1, h0), P(s1, h1), P(s1, h1, d))
  q(wall, P(s0, h0, d), P(s0, h0), P(s1, h0), P(s1, h0, d)) // sill, facing up
  q(wall, P(s0, h1), P(s0, h1, d), P(s1, h1, d), P(s1, h1)) // soffit, facing down
  q(back, P(s0, h0, d), P(s1, h0, d), P(s1, h1, d), P(s0, h1, d))
}

function build() {
  // ---- Plan (model frame, from OSM and lidar) ----
  const X0 = -14.7, X1 = 16.1, Y0 = -30.1, Y1 = 30.1
  const WING = 100, BASE_LOW = 45.6

  // Broad St middle, 9 storeys; recessed above.
  const low = rect(X0, -14.9, -8.8, 14.6)
  block(stone, roof, low, 0, BASE_LOW, 0.4)
  facade(low, [3], [[1.5, 9.5], ...storeyRows(11, BASE_LOW)])
  // Main entrance on Broad St, under the middle.
  panel(door, low[3], low[0], 14.75 - 3, 14.75 + 3, 0, 8.5, 0.06)

  // Wings, the full width at the north and south ends.
  const south = rect(X0, Y0, X1, -14.9), north = rect(X0, 14.6, X1, Y1)
  for (const w of [south, north]) block(stone, roof, w, 0, WING, 0.45)
  const wingRows: [number, number][] = [[1.5, 9.5], ...storeyRows(11, WING)]
  facade(south, [0, 1, 3], wingRows)
  facade(north, [1, 2, 3], wingRows)
  // A low step on the wings' roofs (lidar 103 a little in from the edge).
  for (const w of [rect(-12.6, -27.5, 13.6, -16.0), rect(-12.8, 16.0, 13.0, 28.0)]) block(stone, roof, chamfer(w, 2.5), WING, WING + 3.3, 0.4)

  // The middle, behind the low Broad St part, to the wings' height; the east
  // light well notched out of it.
  const midR = rect(-8.8, -14.9, 11.6, 14.6)
  block(stone, roof, midR, 0, WING, 0.4)
  facade(midR, [3], storeyRows(BASE_LOW, WING))
  for (const r of [rect(11.6, -14.9, X1, -9.7), rect(11.6, 11.3, X1, 14.6)]) block(stone, roof, r, 0, WING, 0.3)
  facade(midR, [1], [[1.5, 9.5], ...storeyRows(11, WING)], 4.4, 2.1, 2.0)

  // The stages up to the crown, read from the lidar (above the sidewalk):
  // wings 100 (103 a little in); the middle stage 110 over x -10..6.4,
  // |y| < 22.5; the core 118 over x -9..10, |y| < 15; the east slab 121.5
  // round the light well; a chamfered plinth ~18 x 21 m at 127 hugging the
  // crown; the crown 13 x 17 m to 144.8. Each setback has chamfered corners,
  // as in the photos.
  const MID = 110, CORE = 118, PLINTH = 127
  const midStage = chamfer(rect(-10.0, -22.5, 6.4, 22.3), 2.0)
  block(stone, roof, midStage, WING - 0.5, MID, 0.45)
  facade(midStage, [1, 5, 7], storeyRows(WING, MID), 4.4, 2.1, 1.4)

  const eastS = rect(6.4, -23.2, X1, -9.7), eastN = rect(6.4, 11.3, X1, 24.7)
  for (const r of [eastS, eastN]) {
    block(stone, roof, r, WING - 0.5, 121.5, 0.45)
    facade(r, [0, 1, 2], storeyRows(WING, 121.5), 4.4, 2.1, 1.2)
  }
  const core = chamfer(rect(-9.0, -15.0, 10.0, 14.8), 2.5)
  block(stone, roof, core, MID - 0.5, CORE, 0.45)
  facade(core, [1, 3, 5, 7], storeyRows(MID, CORE), 4.4, 2.1, 1.4)

  // ---- Crown: the belfry ----
  const CX = 0.5, CY = 0
  const crownR = chamfer(rect(CX - 6.5, CY - 8.5, CX + 6.5, CY + 8.5), 3.0)
  const plinth = chamfer(rect(CX - 8.8, CY - 10.4, CX + 8.8, CY + 10.4), 3.6)
  block(stone, roof, plinth, CORE - 0.5, PLINTH - 1.6, 0.45)
  // small windows in the plinth's faces (photo: three small windows under
  // each belfry opening)
  facade(plinth, [1, 5], [[CORE + 2.0, CORE + 4.6]], 3.0, 1.0, 5.0)
  facade(plinth, [3, 7], [[CORE + 2.0, CORE + 4.6]], 3.0, 1.0, 3.5)
  // a sloped skirt from the plinth to the crown's face
  walls(stone, inset(plinth, 0.45), PLINTH - 1.6, PLINTH, crownR)
  const zB = PLINTH, zTop = 144.8
  // Big open bays taking most of each face (photos): ~60 % of the long
  // faces, ~55 % of the short ones and the chamfers, from 129.6 to 141.
  const h0 = 129.6, h1 = 141.0
  for (let i = 0; i < crownR.length; i++) {
    const a = crownR[i], b = crownR[(i + 1) % crownR.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const w = L > 8 ? 6.0 : L * 0.55
    holedFace(stone, dark, a, b, zB, zTop - 1.4, L / 2 - w / 2, L / 2 + w / 2, h0, h1, 2.2)
  }
  // The parapet: a projecting band, then a flat top.
  const capR = inset(crownR, -0.45)
  walls(stone, crownR, zTop - 1.4, zTop - 1.4, capR)
  walls(stone, capR, zTop - 1.4, zTop - 0.4)
  const topIn = inset(capR, 0.4)
  walls(stone, capR, zTop - 0.4, zTop, topIn)
  cap(roof, topIn, zTop)
  // Broad stepped piers either side of the long faces' bays, running down
  // onto the plinth (photo).
  for (const sx of [-1, 1]) {
    const x = CX + sx * 6.5
    for (const sy of [-1, 1]) {
      const y = CY + sy * 3.9
      const p = rect(x - (sx > 0 ? 0 : 0.8), y - 0.8, x + (sx > 0 ? 0.8 : 0), y + 0.8)
      block(stone, null, p, zB - 1.6, h0 + 2.0, 0.25)
      cap(stone, inset(p, 0.25), h0 + 2.0)
    }
  }

  return [
    { part: stone, material: finish('osb-limestone', 0xd6d4cc) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: { ...PALETTE.window, color: 0x66717b } },
    { part: dark, material: finish('osb-belfry', 0x3c434b) },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('phl-lincoln-liberty-building', 'One South Broad', [39.951176, -75.163491], 9.3, build())
