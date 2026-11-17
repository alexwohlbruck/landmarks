/**
 * PSFS Building (Philadelphia Saving Fund Society, 1930-32, George Howe and
 * William Lescaze; since 2000 the Loews Philadelphia Hotel) — original
 * procedural geometry, CC0-1.0.
 * bun generators/phl-psfs-building.ts [out.glb]
 *
 * Name: OSM way/42784724 is named "Loews Philadelphia Hotel" (the hotel in
 * it); the OSM building relation/4785217 and wikidata Q1548457 name it the
 * PSFS Building, the name it is known and listed by (NHL 1976). Display name
 * "PSFS Building".
 *
 * Frame: map frame turned to the Center City grid, bearing 9.3 (the OSM
 * sides run 9.2-9.6 / 99.1-99.5). +x east-south-east (12th Street), +y
 * north-north-east (Market Street), z up, metres. Origin = area centroid of
 * the OSM outline, 39.951415, -75.160323, on the street (Market and 12th St
 * sidewalks, 6.6 m above the lidar box's ground_min, which is a stairwell).
 * The site is flat (Mapterhorn varies < 1 m under the footprint). Elevation 0.
 *
 * Identity, in order: the T of a pale office slab running back from Market
 * Street and the taller charcoal service spine across its south end; the
 * huge "PSFS" sign standing on the slab's roof, facing east and west, white
 * letters on a blue board by day, red neon at night; the slab's limestone
 * piers on the long (east and west) sides, and the cantilevered Market St
 * front where the piers stop and the window bands with dark spandrels run
 * continuously round the corner; the polished dark granite base curving
 * round the corner of 12th and Market, with the banking hall's big windows,
 * under three storeys of limestone; the lower wing on the west and the
 * five-storey block to the south.
 *
 * Evidence
 *  - OSM: outline way/42784724 and building relation/4785217 with its parts
 *    way/336594398 (spine, 150), /338481671 (slab, 139), /338426266 (128),
 *    /336594399 (min 128), /338329002 (min 139), /338329003 (28),
 *    /336594395 (21), /338426267 (33), /333012751 (28), /336594397 (20).
 *    All replaced, with the relation.
 *  - Lidar: USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown 2015), 0.5 m
 *    grid read in this frame. Measured above the street: spine x -20..20.5,
 *    y -4.5..7.5, roof 149.8, its west end stepping to 147.2 (x < -9) and
 *    143.4 (x < -15); slab x -6.9..14.8, y 7.5..46.6, roof 137-138; the sign
 *    a 1 m thick wall over the slab's west edge, y 8..45, top 147.0; the
 *    west wing (x < -6.9) 37.0; the base at the 12th St line 22.8 with the
 *    curved granite corner ~9 m; the south block 27.8, its south strip 22.7,
 *    its west strip 19.6. OSM's 128 m part over the slab's north-east is not
 *    in the lidar (the whole east half of the slab reads 136.5), so the slab
 *    is drawn level. The TV mast on the spine (lidar to ~222 m) is left out.
 *  - Published (Wikipedia "PSFS Building"; NHL nomination): 1932, 36
 *    storeys, 491 ft (150 m); Howe and Lescaze; the sign's letters 27 ft
 *    high, red neon.
 *  - Photo-measured: from AEngineer's PSFS_top.jpg (west face, near-frontal):
 *    seven pier bays of ~4.85 m from the spine and a ~5.2 m cantilevered bay
 *    at the Market St end; the sign board 37 x 7.8 m standing ~1.2 m clear of
 *    the roof. The letters traced from PSFSsign.jpg: cap height 0.94 of the
 *    board, a geometric sans with a P bowl to 48 % of the height, S of two
 *    equal circular bowls with a diagonal spine, F with its middle bar at
 *    48 %; stroke 0.078 of the cap height, drawn at 0.14 so the word holds
 *    at phone size; letters start at 5.3 / 31.5 / 60.1 / 84.9 % of the board.
 *  - Estimated: storeys (3.7 m, grouped two to a window band), the base's
 *    layers (granite to 13 m with shop windows and the banking hall glass,
 *    limestone to 22.8), the granite corner radius (7 m, from the OSM curve
 *    and the 1930 rendering), the spine's window columns, the west wing's
 *    and south block's window rows.
 *  - Colours from the daylight photos, pulled to the palette's lightness:
 *    buff-grey limestone piers and base; grey-brown spandrels and slab walls
 *    (the bands' dark spandrels); the spine's charcoal brick, also used for
 *    the dark polished granite base; the sign board's blue; the letters
 *    white with their red neon tubes on the face.
 *
 * Famous sign (STYLE.md, "Famous signs"): the PSFS sign is the building's
 * identity, so its lettering is modelled, traced from the photo and built
 * with generators/lettering.ts. Each letter is a pale body with the red
 * neon tube (`neon-psfs`) along its face, as on the real sign: white letters
 * by day, red at night (Highsmith's dusk aerial).
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  - PSFSBuilding1985.jpg, Jack E. Boucher (HABS), public domain (from the
 *    north-east, over the Reading Terminal: slab, spine, sign)
 *    https://commons.wikimedia.org/wiki/File:PSFSBuilding1985.jpg
 *  - ELEVATED VIEW SHOWING MOST OF EAST AND NORTH FACADES FROM ROOF OF
 *    READING TERMINAL (HABS PA,51-PHILA,584-36 (CT)), Jack E. Boucher, PD
 *    https://commons.wikimedia.org/wiki/File:ELEVATED_VIEW_SHOWING_MOST_OF_EAST_AND_NORTH_FACADES_FROM_ROOF_OF_READING_TERMINAL_-_Philadelphia_Saving_Fund_Society,_Twelfth_and_Market_Streets,_Philadelphia,_HABS_PA,51-PHILA,584-36_(CT).tif
 *  - ELEVATED VIEW SHOWING WEST FACADE OF BUILDING AND SURROUNDING AREA
 *    (584-38 (CT)), Jack E. Boucher, PD
 *    https://commons.wikimedia.org/wiki/File:ELEVATED_VIEW_SHOWING_WEST_FACADE_OF_BUILDING_AND_SURROUNDING_AREA_-_Philadelphia_Saving_Fund_Society,_Twelfth_and_Market_Streets,_Philadelphia,_Philadelphia_County,_PA_HABS_PA,51-PHILA,584-38_(CT).tif
 *  - ELEVATED VIEW OF UPPER FLOORS OF WEST FACADE INCLUDING "PSFS" SIGN
 *    (584-39 (CT)), Jack E. Boucher, PD
 *    https://commons.wikimedia.org/wiki/File:ELEVATED_VIEW_OF_UPPER_FLOORS_OF_WEST_FACADE_INCLUDING_%22PSFS%22_SIGN_-_Philadelphia_Saving_Fund_Society,_Twelfth_and_Market_Streets,_Philadelphia,_Philadelphia_County,_PA_HABS_PA,51-PHILA,584-39_(CT).tif
 *  - EAST FACADE AS SEEN FROM ELEVENTH AND MARKET STREETS (584-35 (CT)),
 *    Jack E. Boucher, PD
 *    https://commons.wikimedia.org/wiki/File:EAST_FACADE_AS_SEEN_FROM_ELEVENTH_AND_MARKET_STREETS_-_Philadelphia_Saving_Fund_Society,_Twelfth_and_Market_Streets,_Philadelphia,_Philadelphia_County,_PA_HABS_PA,51-PHILA,584-35_(CT).tif
 *  - OBLIQUE VIEW OF TWELFTH STREET FACADE FROM STREET LEVEL (584-14),
 *    Jack E. Boucher, PD
 *    https://commons.wikimedia.org/wiki/File:OBLIQUE_VIEW_OF_TWELFTH_STREET_FACADE_FROM_STREET_LEVEL,_LOOKING_FROM_SOUTH_TO_NORTH_-_Philadelphia_Saving_Fund_Society,_Twelfth_and_Market_Streets,_Philadelphia,_Philadelphia_HABS_PA,51-PHILA,584-14.tif
 *  - PHOTOCOPY OF RENDERING OF PSFS BUILDING BY D.E. SUTTON (584-1), PD
 *    https://commons.wikimedia.org/wiki/File:PHOTOCOPY_OF_RENDERING_OF_PSFS_BUILDING_BY_D.E._SUTTON._Date_possibly_1929_or_1930,_when_construction_started._-_Philadelphia_Saving_Fund_Society,_Twelfth_and_Market_Streets,_HABS_PA,51-PHILA,584-1.tif
 *  - SOUTH (REAR) ELEVATION OF THE PSFS BUILDING (HABS PA,51-PHILA,674-11), PD
 *    https://commons.wikimedia.org/wiki/File:SOUTH_(REAR)_ELEVATION_OF_THE_PHILADELPHIA_SAVING_FUND_SOCIETY_(PSFS)_BUILDING_WITH_MEETING_HOUSE_CORNICE_IN_FOREGROUND._-_Twelfth_Street_Meeting_House,_20_South_Twelfth_Street_HABS_PA,51-PHILA,674-11.tif
 *  - Loews_Philadelphia_Hotel_1.jpg and _2.jpg, Wobbanight, CC0 (12th and
 *    Market corner, from the north-east and north-west)
 *    https://commons.wikimedia.org/wiki/File:Loews_Philadelphia_Hotel_1.jpg
 *    https://commons.wikimedia.org/wiki/File:Loews_Philadelphia_Hotel_2.jpg
 *  - PSFS_Building_-_1200_Market_St.JPG, ProfReader, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:PSFS_Building_-_1200_Market_St.JPG
 *  - PSFS-MarketSt.JPG, Absecon 59, CC BY-SA 3.0 (from Market St, east)
 *    https://commons.wikimedia.org/wiki/File:PSFS-MarketSt.JPG
 *  - PSFS_top.jpg and PSFSsign.jpg, AEngineer, CC BY-SA 2.0 (the sign's
 *    west face; the letters)
 *    https://commons.wikimedia.org/wiki/File:PSFS_top.jpg
 *    https://commons.wikimedia.org/wiki/File:PSFSsign.jpg
 *  - Aerial view of Philadelphia, Pennsylvania LCCN2011633562.tif, Carol M.
 *    Highsmith, public domain (from City Hall at dusk: the red letters)
 *    https://commons.wikimedia.org/wiki/File:Aerial_view_of_Philadelphia,_Pennsylvania_LCCN2011633562.tif
 *  Look-only: "A592, Philadelphia ... city skyline at night from the Museum
 *  of Art, 2017.jpg", Brian W. Schaller, Free Art License (tagged look-only
 *  by the tool): the sign's red letters at night, nothing taken from it.
 *  No commercial imagery.
 *
 * Night: the hotel's windows glow (`window`); the sign's neon glows red; the
 * board, the stone and the spine stay unlit.
 *
 * Left out: the TV mast, the roof plant, mullions, the shop signs, the
 * 12th St entrance canopy, the clock.
 *
 * Doubts: the south block's faces have only the 12th St street photo and
 * the HABS rear elevation; the west wing's facade is from the elevated HABS
 * view only; the depth of the cantilever over the base (drawn 1 m).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, inset, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'
import { Pen, strokes } from './lettering'

const lime = new Part() // limestone piers, base, wings; sign letters' bodies
const span = new Part() // spandrels and slab walls; roofs
const dark = new Part() // the spine's charcoal brick and the granite base
const win = new Part()
const board = new Part()
const neon = new Part()

// ---- plan, from OSM and lidar (model frame) ----
const SX0 = -6.9, SX1 = 14.8, SY0 = 7.5, SY1 = 46.6 // the slab
const BASE = 22.8, ROOF = 137.5
const FLOOR = 3.7

/** A ring with only its north-east corner rounded (radius r, n segments). */
function roundNE(x0: number, y0: number, x1: number, y1: number, r: number, n = 5): XY[] {
  const out: XY[] = [[x0, y0], [x1, y0]]
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI / 2
    out.push([x1 - r + r * Math.cos(a), y1 - r + r * Math.sin(a)])
  }
  out.push([x0, y1])
  return out
}

/** Window panels along edge i of ring r: the edge's length less `end` at each end. */
function band(r: XY[], i: number, z0: number, z1: number, end = 0.4, out = 0.05, p = win) {
  const a = r[i], b = r[(i + 1) % r.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L > 2 * end + 0.2) panel(p, a, b, end, L - end, z0, z1, out)
}

/** Window panels in bays along edge i of ring r: n bays, panels w wide. */
function bayRow(r: XY[], i: number, n: number, w: number, rows: [number, number][], s0 = 0, s1?: number) {
  const a = r[i], b = r[(i + 1) % r.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const e = s1 ?? L, step = (e - s0) / n
  for (let k = 0; k < n; k++) {
    const c = s0 + step * (k + 0.5)
    for (const [z0, z1] of rows) panel(win, a, b, c - w / 2, c + w / 2, z0, z1, 0.05)
  }
}

/** Rows of `per` storeys from z0 to z1 with a spandrel `gap` between them. */
function rows(z0: number, z1: number, per = 2, gap = 1.6): [number, number][] {
  const out: [number, number][] = []
  const h = FLOOR * per
  for (let z = z0; z + h <= z1 + 0.6; z += h) out.push([z + gap / 2, Math.min(z + h - gap / 2, z1 - 0.6)])
  return out
}

function slab() {
  const r = rect(SX0, SY0, SX1, SY1)
  // the slab's wall plane, grey-brown: what shows between piers and bands
  walls(span, r, BASE, ROOF - 0.6)
  // limestone coping round the top
  const co = inset(r, -0.15)
  walls(lime, co, ROOF - 0.6, ROOF)
  walls(lime, r, ROOF - 0.6, ROOF - 0.6, co) // underside lip
  walls(lime, co, ROOF, ROOF, inset(r, 0.5))
  cap(span, inset(r, 0.5), ROOF)

  // office storeys: 30 of 3.7 m from the base, two to a window band; the
  // top storey (the executive floor) a taller glass band.
  const TOP = BASE + 30 * FLOOR // 133.8
  const bands = rows(BASE, TOP, 2, 3.4)
  const topBand: [number, number] = [TOP + 0.5, ROOF - 1.0]

  // Long sides: piers at the column line, seven bays of ~4.85 m from the
  // spine; the last 5.15 m at the Market St end is cantilevered and has no
  // pier, so the bands run round the corner there.
  const PIER = 0.9, PROJ = 0.55
  const PITCH = 4.85
  const pierYs = Array.from({ length: 7 }, (_, k) => SY0 + PITCH * (k + 1))
  const CANT = pierYs[6] // 41.45
  for (const side of [-1, 1]) {
    const x = side > 0 ? SX1 : SX0
    for (const y of pierYs) {
      const pr = side > 0 ? rect(x - 0.1, y - PIER / 2, x + PROJ, y + PIER / 2) : rect(x - PROJ, y - PIER / 2, x + 0.1, y + PIER / 2)
      block(lime, lime, pr, BASE, ROOF, 0.12)
    }
    // window bands between the piers (and from the spine to the first pier)
    const edges: [number, number][] = []
    let y0 = SY0
    for (const y of pierYs) { edges.push([y0 + (y0 === SY0 ? 0.3 : PIER / 2), y - PIER / 2]); y0 = y }
    edges.push([CANT + PIER / 2, SY1]) // the cantilevered bay, to the corner
    // wall a→b with the outside to this side
    const a: XY = side > 0 ? [x, SY0] : [x, SY1], b: XY = side > 0 ? [x, SY1] : [x, SY0]
    for (const [e0, e1] of edges) {
      const ya = e0 + 0.15, yb = e1 >= SY1 ? SY1 : e1 - 0.15
      const s0 = side > 0 ? ya - SY0 : SY1 - yb, s1 = side > 0 ? yb - SY0 : SY1 - ya
      for (const [z0, z1] of [...bands, topBand]) panel(win, a, b, s0, s1, z0, z1, 0.05)
    }
  }
  // Market St front: continuous bands, corner to corner.
  for (const [z0, z1] of [...bands, topBand]) panel(win, [SX1, SY1], [SX0, SY1], 0, SX1 - SX0, z0, z1, 0.05)
}

function spine() {
  // x -20..20.5, y -4.5..7.5; roof 149.8, stepping to 147.2 and 143.4 at the
  // west end (lidar).
  const y0 = -4.5, y1 = 7.5
  const parts: [number, number, number][] = [[-9, 20.5, 149.8], [-15, -9, 147.2], [-20, -15, 143.4]]
  for (const [x0, x1, h] of parts) block(dark, span, rect(x0, y0, x1, y1), 0, h, 0.3)
  // window columns, one window a storey grouped two storeys to a panel
  const R = rows(FLOOR * 2, 140, 2, 1.8)
  const Rlow = rows(28, 140, 2, 1.8)
  // east end (12th St): two columns, from the ground up
  const east = rect(-20, y0, 20.5, y1)
  bayRow(east, 1, 2, 2.4, R, 1.5, 10.5)
  // west end: above the west wing / south block's west strip
  bayRow(east, 3, 2, 2.4, rows(38, 140, 2, 1.8), 1.5, 10.5)
  // south face: a column of windows near each end, above the south block
  const L = 40.5
  for (const s of [3.5, 7.0, L - 7.0, L - 3.5]) for (const [z0, z1] of Rlow) panel(win, east[0], east[1], s - 1.1, s + 1.1, z0, z1, 0.05)
  // north faces beside the slab: one column each
  for (const [s, zb] of [[L - 3.0, 24], [L - 37.0, 38]] as [number, number][])
    for (const [z0, z1] of rows(zb, 140, 2, 1.8)) panel(win, east[2], east[3], s - 1.1, s + 1.1, z0, z1, 0.05)
}

function base() {
  // The banking-hall base under the slab and along 12th St: polished dark
  // granite to 13 m, curving round the 12th and Market corner, with shop
  // windows and the banking hall's tall glass; three storeys of limestone
  // over it, set back 0.8 m, curving likewise.
  const g = roundNE(SX0, SY0, 20.3, SY1, 7, 6)
  walls(dark, g, 0, 13)
  cap(span, g, 13)
  const l = roundNE(SX0 + 0.4, SY0, 19.5, SY1 - 1.6, 6.2, 6)
  walls(lime, l, 13, BASE)
  cap(span, l, BASE)
  // glass: every edge but the west (last) and the south (first)
  for (let i = 1; i < g.length - 1; i++) {
    band(g, i, 0.9, 4.2, 0.3)
    band(g, i, 5.6, 9.8, 0.3)
  }
  // the limestone storeys: window rows along the faces (no glass on the
  // curve, which is solid in the photos)
  for (const i of [1, l.length - 2]) for (const [z0, z1] of [[14.2, 17.2], [18.6, 21.6]] as [number, number][]) band(l, i, z0, z1, 1.2)
}

function westWing() {
  // x -19.8..-6.9, y 7.5..46.6, 37 m (lidar; OSM 33). Its Market St front
  // is the same polished dark granite as the corner, with big hotel windows
  // (Wobbanight's photo from the north-west); its west side abuts a
  // neighbour of the same height and has no windows.
  const r = rect(-19.8, SY0, SX0, SY1)
  block(dark, span, r, 0, 37, 0.35)
  band(r, 2, 0.9, 4.6, 0.6)
  bayRow(r, 2, 3, 3.2, rows(6.0, 36, 2, 1.6))
  // a bulkhead on the roof (lidar 39.5)
  block(dark, span, rect(-19.4, 8.0, -15.5, 10.5), 37, 39.5, 0.2)
}

function southBlock() {
  // y -46.3..-4.5: the main block 27.8 (x -15..19.7, y > -37.5), the south
  // strip 22.7, the west strip 19.6 (lidar). Granite shop storey on 12th St,
  // limestone above with window rows.
  const main = rect(-15, -37.5, 19.7, -4.5)
  const south = rect(-15, -46.3, 19.7, -37.5)
  const west = rect(-19.9, -46.3, -15, -4.5)
  walls(dark, rect(-19.9, -46.3, 19.7, -4.5), 0, 5.0)
  block(lime, span, main, 5.0, 27.8, 0.35)
  block(lime, span, south, 5.0, 22.7, 0.35)
  block(lime, span, west, 5.0, 19.6, 0.35)
  const all = rect(-19.9, -46.3, 19.7, -4.5)
  band(all, 1, 0.9, 4.3, 0.8)
  band(all, 0, 0.9, 4.3, 0.8)
  bayRow(main, 1, 8, 2.6, rows(5.5, 27.0, 2, 1.6))
  bayRow(south, 1, 2, 2.6, rows(5.5, 22.0, 2, 1.6))
  bayRow(south, 0, 9, 2.6, rows(5.5, 22.0, 2, 1.6))
  bayRow(west, 0, 1, 2.6, rows(5.5, 19.0, 2, 1.6))
  bayRow(west, 3, 8, 2.6, rows(5.5, 19.0, 2, 1.6))
  bayRow(main, 2, 7, 2.6, rows(19.6, 27.0, 1, 1.4), 0, 34.7 - 5.0)
}

// ---- the sign ----
const W = 0.14, H2 = W / 2

/**
 * The four letters' centre-lines, cap height 1, traced from PSFSsign.jpg
 * (outer extents: P 0.61 wide with its bowl down to 0.44; S 0.55 wide; F
 * 0.51 wide with its middle bar at 0.48 and 0.44 long). The centre-lines
 * sit half a stroke inside those extents, so the letters keep their size
 * whatever the stroke.
 */
function letters(): { pen: Pen; at: number }[] {
  const top = 1 - H2
  const P = new Pen()
  const bowlB = 0.444 + H2, pr = (top - bowlB) / 2, pcx = 0.61 - H2 - pr
  P.moveTo([H2, 0]).lineTo([H2, top]).lineTo([pcx, top]).arc([pcx, top - pr], -Math.PI, 8).lineTo([H2, bowlB])
  const S = () => {
    const s = new Pen()
    const r = (0.55 - 2 * H2) / 2, cu = 0.275
    const c1: [number, number] = [cu, top - r], c2: [number, number] = [cu, H2 + r]
    const a0 = (20 * Math.PI) / 180
    s.moveTo([c1[0] + r * Math.cos(a0), c1[1] + r * Math.sin(a0)])
      .arc(c1, Math.PI - a0, 7)
      .cubicTo([H2, 0.55], [0.55 - H2, 0.45], [0.55 - H2, c2[1]], 8)
      .arc(c2, -(162 * Math.PI) / 180, 8)
    return s
  }
  const F = new Pen()
  F.moveTo([H2, 0]).lineTo([H2, top]).lineTo([0.509, top])
  F.moveTo([H2, 0.483]).lineTo([0.436, 0.483])
  const BL = 5.07 // board length in cap heights
  return [
    { pen: P, at: 0.053 * BL },
    { pen: S(), at: 0.315 * BL },
    { pen: F, at: 0.601 * BL },
    { pen: S(), at: 0.849 * BL },
  ]
}

function sign() {
  // The board over the slab's west edge (lidar x -6.5..-4, y 8..45, top
  // 147.0): 37 x 7.8 m, 1.0 m thick, on posts 1.2 m clear of the roof.
  const X0 = -6.4, X1 = -5.4, Y0 = 8.3, Y1 = 45.3, Z0 = ROOF + 1.7, Z1 = 147.0
  block(board, board, rect(X0, Y0, X1, Y1), Z0, Z1, 0.1)
  cap(board, rect(X0, Y0, X1, Y1), Z0, false)
  for (const y of [9.5, 16, 22.5, 29, 35.5, 42, 44.3]) block(dark, null, rect(X0 + 0.2, y - 0.25, X1 - 0.2, y + 0.25), ROOF - 0.2, Z0, 0)
  const capH = (Z1 - Z0) * 0.94, z0 = Z0 + (Z1 - Z0) * 0.033
  // East face: read from the east, u runs north (P at the south end, as in
  // the HABS photos from the Reading Terminal). West face: u runs south.
  const faces: ((u: number, v: number, w: number) => V3)[] = [
    (u, v, w) => [X1 + w, Y0 + u * capH, z0 + v * capH],
    (u, v, w) => [X0 - w, Y1 - u * capH, z0 + v * capH],
  ]
  for (const face of faces) {
    for (const { pen, at } of letters()) {
      const place = (u: number, v: number, w: number) => face(u + at, v, w)
      strokes(lime, pen.paths, { width: W, depth: 0.45, place })
      strokes(neon, pen.paths, { width: W * 0.4, depth: 0.12, place: (u, v, w) => place(u, v, w + 0.43) })
    }
  }
}

function build() {
  slab()
  spine()
  base()
  westWing()
  southBlock()
  sign()
  return [
    { part: lime, material: finish('psfs-limestone', 0xe2dbcc) },
    { part: span, material: finish('psfs-spandrel', 0xa29c92) },
    { part: dark, material: finish('psfs-charcoal', 0x55575c) },
    { part: win, material: { ...PALETTE.window, color: 0x788896 } },
    { part: board, material: finish('psfs-sign-blue', 0x3b6b94) },
    { part: neon, material: finish('neon-psfs', 0xd8392f) },
  ]
}

if (import.meta.main) await save('phl-psfs-building', 'PSFS Building', [39.951415, -75.160323], 9.3, build(), 6500)
