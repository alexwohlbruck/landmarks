/**
 * Caroline Wiess Law Building, Museum of Fine Arts, Houston (1001 Bissonnet
 * Street) — original procedural geometry, CC0-1.0.
 * bun generators/hou-mfah-law-building.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Bearing 0. Anchor = centroid of the OSM outline way/45776272
 * ("Caroline Weiss Law Building", wikidata Q118955205), 29.7256491,
 * -95.3904583; the lidar grid is centred on the same point.
 *
 * What it is: William Ward Watkin's neoclassical museum (1924, wings 1926)
 * facing south over its lawn, with Mies van der Rohe's Cullinan Hall (1958)
 * and Brown Pavilion (1974) filling the block behind it out to Bissonnet
 * Street in one curved hall. The OSM outline covers all of it, so the model
 * is all of it.
 *
 * Identity, in order: the long curved Mies front on Bissonnet, a band of
 * tall glass framed in black steel over a blank cream limestone base, with
 * black I-beam columns standing in front of it at each of the roof girders;
 * the six black plate girders running radially across the roof from those
 * columns (they stand ~2 m over the roof and show from above as a fan);
 * the Watkin building's Ionic loggia (six columns in antis) under a green
 * tile hipped roof, in grey-cream limestone, on the lawn side.
 *
 * Evidence:
 *  - plan and heights: USGS 3DEP lidar TX_Coastal_B1_2018 (flown 2018), 0.5 m
 *    grid, read in this frame. Street ground +0.5 over the grid minimum
 *    (Bissonnet 0.35, lawn 0.85). Measured above ground: Mies roof 12.3 m;
 *    girder tops 14.1 m (the photos read ~2-2.5 m over the fascia; drawn
 *    14.3); Watkin cornice 12.3 m, its tile slope rising ~2 m over ~3 m to a
 *    flat 14.3 m, the central block's to 14.7-15.1 (drawn 15.0); a rooftop
 *    box at x -7..1, y -17..-2.5, 16.4 m; a lower roof 11.8 m at x 15..31,
 *    y -12..-29 (drawn into the Mies roof at 12.3).
 *  - the fan: the six girder lines in the lidar meet at (-30, -100) and are
 *    6.8 degrees apart (0, 6.8 ... 34.0 deg from north); the curved front is
 *    an arc of radius 137 m about that point, from -2.8 to 36.2 deg, which
 *    lands on both OSM corners (-36.7, 37.3) and (51.1, 10.5). Inner ends of
 *    the girders read from the lidar where they stop at the older building.
 *  - Watkin front: lidar and OSM agree on a south face from (-32.5, -33)
 *    to (8.8, -45.5), bearing 107 deg. Profiles across it put the cornice of
 *    the middle 28 m (s 9..37 along the face) 2.3 m behind the end wings,
 *    which is where the loggia sits (centred s 23, under the raised central
 *    roof); the west wing x -32.5 .. -22.5 up to y 5.5; the south-east side
 *    on OSM's line at 34.5 deg.
 *  - OSM way/45776272 (building=public, 2 levels; no height tag) for the
 *    west side and its jogs, the north-east corner and the east side.
 *  - photo scaling (Barera's front photo, 21 px/m at the facade): columns
 *    ~8.6 m on a ~1.2 m stylobate, entablature ~2.4 m, centre spacing 2.95 m;
 *    Mies base wall 38% of the facade height (WhisperToMe "Law Building MFAH
 *    A"), i.e. 4.6 m, glass band 4.6-12.3 m; six glass bays per girder bay
 *    (2.7 m), the lobby glazing between 20.0 and 28.9 deg (located from that
 *    photo's camera position, 29.726206,-95.389869).
 *  - colours, sampled from the photos: Mies base limestone #d8cfc0-#dbd5bc;
 *    Watkin limestone #dbd5bc sunlit, #acaaa4 shade (drawn #ddd6c4 for
 *    both); glass #627d9b sun, #485b7d overcast (drawn #7a90a8, the lighter sunlit reading); black steel
 *    drawn charcoal #4a4f57 (STYLE's darkest); tile roof #b8c6b2 in haze
 *    (drawn #8fae96); roofs near white in NAIP (drawn #c8cbc9).
 *
 * Photos (all evidence):
 *  - "Houston May 2022 26 (Museum of Fine Arts, Houston).jpg" and "... 25",
 *    Michael Barera, CC BY-SA 4.0 (the Watkin front from the lawn, south)
 *    https://commons.wikimedia.org/wiki/File:Houston_May_2022_26_(Museum_of_Fine_Arts,_Houston).jpg
 *  - "Law Building MFAH A.jpg", "Law Building MFAH.jpg", "Law Building MFAH
 *    0.jpg", "MFAH Law A.jpg", "MFAH Law B.jpg", "MFAH Law Building.jpg",
 *    "MFAHCarolineWeissLaw.JPG", WhisperToMe, CC0 (the Mies front from
 *    Bissonnet, 2020-23; the Watkin colonnade)
 *    https://commons.wikimedia.org/wiki/File:Law_Building_MFAH_A.jpg
 *    https://commons.wikimedia.org/wiki/File:Law_Building_MFAH.jpg
 *    https://commons.wikimedia.org/wiki/File:MFAH_Law_Building.jpg
 *  - "MFA houston.jpg", Hequals2henry, CC BY-SA 3.0 (the colonnade)
 *    https://commons.wikimedia.org/wiki/File:MFA_houston.jpg
 *  - "Museum of Fine Arts, Houston - 5883048922.jpg", a rancid amoeba,
 *    CC BY-SA 2.0 (the Mies front from the west, 2011)
 *    https://commons.wikimedia.org/wiki/File:Museum_of_Fine_Arts,_Houston_-_5883048922.jpg
 *  USGS NAIP for the plan and roof colours. Published: Watkin 1924/1926,
 *  Cullinan Hall 1958, Brown Pavilion 1974 (Wikipedia, "Museum of Fine Arts,
 *  Houston"). No commercial imagery.
 *  Look-only (not used for shape): MFAHWatkinBuilding.jpg (Schlueter,
 *  historic, unclear licence).
 *
 * Left out: mullion transoms, curtains, the anthemion cresting, the
 * inscription, steps (ground), banners and the Calder in front.
 *
 * Doubts: the west and east ends of the Mies block and the back of the
 * Watkin wings are in no licensed photo and are drawn as plain limestone;
 * the rooftop box at 16.4 m is read from lidar and NAIP only (dark, two fans:
 * probably plant); the south-east end of the Watkin block follows OSM and is
 * partly hidden by oaks in the lidar; the Mies girders' inner ends are read
 * where the lidar lines stop.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { cap, inset, lathe, save, walls, type XY } from './chi-aon-center'
import { annulus } from './hou-alley-theatre'

// ---------------------------------------------------------------------------
// Small kit for the G8a MFAH models (exported).

/** Split every edge of a ring into pieces no longer than `max` metres. */
export function densify(r: XY[], max = 5): XY[] {
  const out: XY[] = []
  r.forEach((a, i) => {
    const b = r[(i + 1) % r.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / max))
    for (let k = 0; k < n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n])
  })
  return out
}

/** One wall a→b (outward on the right), split into ≤ `max` m pieces. */
export function wallSeg(p: Part, a: XY, b: XY, z0: number, z1: number, max = 5) {
  const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / max))
  for (let k = 0; k < n; k++) {
    const t0 = k / n, t1 = (k + 1) / n
    const A: XY = [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0]
    const B: XY = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1]
    p.quad([A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1])
  }
}

/** Walls of a ring from z0 to z1, ground-level pieces no longer than 5 m. */
export function walls5(p: Part, r: XY[], z0: number, z1: number) {
  walls(p, z0 < 2 ? densify(r) : r, z0, z1)
}

/** A box along unit direction `d` about centre c: half length hl, half width hw; returns its ring. */
export function obox(c: XY, d: XY, hl: number, hw: number): XY[] {
  const n: XY = [d[1], -d[0]] // right of d
  const P = (a: number, b: number): XY => [c[0] + d[0] * a + n[0] * b, c[1] + d[1] * a + n[1] * b]
  return ccw([P(-hl, -hw), P(-hl, hw), P(hl, hw), P(hl, -hw)])
}

/** A closed prism on ring r (CCW) from z0 to z1 with a top (and optionally a bottom). */
export function prism(side: Part, top: Part | null, r: XY[], z0: number, z1: number, bottom = false) {
  walls5(side, r, z0, z1)
  if (top) cap(top, r, z1)
  if (bottom) cap(side, r, z0, false)
}

export const ccw = (r: XY[]): XY[] => {
  const a = r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
  return a < 0 ? [...r].reverse() : r
}

// ---------------------------------------------------------------------------
// Law Building

const D2R = Math.PI / 180
const C: XY = [-30, -100] // centre of the Mies fan
const R = 137 // radius of the curved front
const TH_W = -2.8, TH_E = 36.2 // the front's corners, degrees from north about C
const GIRDER = 6.8 // degrees between girders
const BAY = GIRDER / 6 // six glass bays per girder bay
const P = (th: number, r = R): XY => [C[0] + r * Math.sin(th * D2R), C[1] + r * Math.cos(th * D2R)]
const DIR = (th: number): XY => [Math.sin(th * D2R), Math.cos(th * D2R)]

const MIES = 12.3, GIRD = 14.3, BASE = 4.6
const CORN = 12.3, HIP = 14.3, HIPC = 15.0, STYLO = 1.2

// Watkin front frame: s along the south face (bearing 107), d inward.
const F0: XY = [-32.5, -33]
const U: XY = [Math.sin(107 * D2R), Math.cos(107 * D2R)]
const N: XY = [-U[1], U[0]] // inward (north-north-east)
const FP = (s: number, d: number): XY => [F0[0] + U[0] * s + N[0] * d, F0[1] + U[1] * s + N[1] * d]
const FACE = 43.1, MID = 23 // the loggia's centre (lidar: the raised central roof)

function build() {
  const lime = new Part(), shade = new Part(), steel = new Part(), glass = new Part(), roof = new Part(), tile = new Part()

  // ---- the Watkin building: south block + west wing, an L ----
  // The south face: end wings at d 0.3, the centre (s 9..37) set back to
  // d 2.6 (lidar roof edge), the Ionic loggia cut 2.8 m into it.
  const W0 = 0.3, CB = 2.6, CS0 = 9, CS1 = 37
  const SW = FP(0, W0), SE = FP(FACE, W0), NE: XY = [20.89, -28.21]
  const J = FP(5.56, 16) // meets the west wing's east side (x -22.5)
  const K: XY = [-22.5, 5.5], L: XY = [-32.5, 5.5]
  const south: XY[] = [SW, FP(CS0, W0), FP(CS0, CB), FP(CS1, CB), FP(CS1, W0), SE]
  const L0: XY[] = [...south, NE, J, K, L]
  const flat: XY[] = [SW, FP(CS0, W0), FP(CS0 + 0.01, W0), FP(CS1 - 0.01, W0), FP(CS1, W0), SE, NE, J, K, L]
  const LS0 = MID - 8.4, LS1 = MID + 8.4, LD = CB + 2.8, ENT = 10.3
  for (const [a, b] of [[SE, NE], [NE, J], [J, K], [K, L], [L, SW]] as [XY, XY][]) wallSeg(lime, a, b, 0, CORN)
  // south face: wings, returns and the pavilion walls in limestone; the loggia in shade
  for (const [a, b] of [[SW, FP(CS0, W0)], [FP(CS0, W0), FP(CS0, CB)], [FP(CS0, CB), FP(LS0, CB)],
    [FP(LS1, CB), FP(CS1, CB)], [FP(CS1, CB), FP(CS1, W0)], [FP(CS1, W0), SE]] as [XY, XY][]) wallSeg(lime, a, b, 0, CORN)
  wallSeg(shade, FP(LS0, CB), FP(LS0, LD), 0, CORN)
  wallSeg(shade, FP(LS0, LD), FP(LS1, LD), 0, CORN)
  wallSeg(shade, FP(LS1, LD), FP(LS1, CB), 0, CORN)
  // plinth (water table) round the outline, the stylobate across the loggia
  const plO = inset(L0, -0.25)
  walls5(lime, plO, 0, STYLO)
  annulus(lime, L0, plO, STYLO)
  lime.quad([...FP(LS0, CB - 0.25), STYLO] as V3, [...FP(LS1, CB - 0.25), STYLO] as V3, [...FP(LS1, LD), STYLO] as V3, [...FP(LS0, LD), STYLO] as V3)
  // entablature over the loggia, flush with the face
  {
    const a = FP(LS0, CB), b = FP(LS1, CB), a2 = FP(LS0, LD), b2 = FP(LS1, LD)
    lime.quad([...a, ENT] as V3, [...b, ENT] as V3, [...b, CORN] as V3, [...a, CORN] as V3)
    lime.quad([...a, ENT] as V3, [...a2, ENT] as V3, [...b2, ENT] as V3, [...b, ENT] as V3)
  }
  // the loggia's door, dark glass in the back wall
  {
    const a = FP(MID - 1.4, LD - 0.05), b = FP(MID + 1.4, LD - 0.05)
    glass.quad([...a, STYLO] as V3, [...b, STYLO] as V3, [...b, STYLO + 4.2] as V3, [...a, STYLO + 4.2] as V3)
  }
  // six Ionic columns: base, shaft, capital
  for (let k = 0; k < 6; k++) {
    const [cx, cy] = FP(MID + (k - 2.5) * 2.95, CB + 0.75)
    lathe(lime, cx, cy, [[0, STYLO], [0.8, STYLO], [0.8, STYLO + 0.35], [0.64, STYLO + 0.5], [0.58, 9.3], [0.7, 9.7], [0, 9.7]], 12)
    prism(lime, lime, obox([cx, cy], U, 0.85, 0.75), 9.7, ENT)
  }
  // cornice round the whole block
  const coO = inset(L0, -0.4), coI = inset(L0, 0.3)
  walls(lime, coO, CORN - 0.6, CORN)
  annulus(lime, L0, coO, CORN - 0.6, false)
  annulus(lime, coI, coO, CORN)
  // green tile hips and the flat roof over the wings
  const hipT = inset(flat, 3.0)
  walls(tile, coI, CORN, HIP, hipT)
  cap(roof, hipT, HIP)
  // the central block's higher hip over the loggia
  {
    const c0: XY[] = [FP(CS0 + 3, CB + 0.3), FP(CS1 - 3, CB + 0.3), FP(CS1 - 3, 16), FP(CS0 + 3, 16)]
    const c1 = inset(c0, 2.7)
    walls(tile, c0, CORN, HIPC, c1)
    cap(roof, c1, HIPC)
  }

  // ---- the Mies block: Cullinan Hall and Brown Pavilion ----
  // facade angles, west to east: the corners and every glass bay between
  const ths: number[] = [TH_W]
  for (let k = Math.ceil(TH_W / BAY + 1e-6); k * BAY < TH_E - 0.3; k++) if (k * BAY > TH_W + 0.3) ths.push(k * BAY)
  ths.push(TH_E)
  const arc = ths.map(t => P(t))
  // the rest of the outline, CCW from the west corner: west side with its
  // entrance notch, along the Watkin building (0.5 m into it), east side
  const off = (p: XY, d: number): XY => [p[0] - N[0] * d, p[1] - N[1] * d]
  const rest: XY[] = [
    [-36.4, 12.3], [-31, 12.3], [-31, 5.0], [-23, 5.0], off(FP(5.0, 16), 0.5),
    off(NE, 0.5), [22.41, -29.18], [31.45, -16.17], [27.87, -13.88], [32.51, -7.03], [36.93, -10.07],
    [38.22, -8.19], [49.87, 8.74],
  ]
  const ring: XY[] = [...[...arc].reverse(), ...rest] // CCW
  // plain limestone walls on the non-curved sides
  for (let i = arc.length - 1; i < ring.length; i++) wallSeg(lime, ring[i], ring[(i + 1) % ring.length], 0, MIES)
  cap(roof, ring, MIES)

  // curved front, facet by facet (east to west keeps the outside on the right)
  const lobby = (t: number) => t > 20.0 && t < 28.9
  for (let i = ths.length - 1; i > 0; i--) {
    const ta = ths[i], tb = ths[i - 1], tm = (ta + tb) / 2
    const a = P(ta), b = P(tb)
    const a0 = P(ta, R - 0.6), b0 = P(tb, R - 0.6)
    const aO = P(ta, R + 0.06), bO = P(tb, R + 0.06)
    // base: cream limestone, or the lobby's glazing, set back under the glass band
    wallSeg(lobby(tm) ? glass : lime, a0, b0, 0, BASE)
    steel.quad([...a0, BASE] as V3, [...a, BASE] as V3, [...b, BASE] as V3, [...b0, BASE] as V3) // soffit, faces down
    // glass band, black sill and fascia
    wallSeg(glass, a, b, BASE, MIES)
    wallSeg(steel, aO, bO, BASE, BASE + 0.4)
    wallSeg(steel, aO, bO, MIES - 0.75, MIES + 0.15)
    const aI = P(ta, R - 0.35), bI = P(tb, R - 0.35)
    steel.quad([...aI, MIES + 0.15] as V3, [...bI, MIES + 0.15] as V3, [...bO, MIES + 0.15] as V3, [...aO, MIES + 0.15] as V3)
  }
  // mullions at the bay joints, I-beam columns and girders at every sixth
  for (const t of ths) {
    const k = Math.round(t / BAY)
    if (Math.abs(t - k * BAY) > 1e-6) continue
    if (k % 6 === 0) continue
    prism(steel, steel, obox(P(t, R + 0.1), DIR(t), 0.12, 0.11), BASE + 0.4, MIES - 0.75)
  }
  const inner = [105.5, 90, 88, 86, 101, 114] // where each girder meets the older building (lidar)
  for (let g = 0; g < 6; g++) {
    const t = g * GIRDER, d = DIR(t)
    // column: in front of the glass, ground to the girder top
    prism(steel, steel, obox(P(t, R + 0.32), d, 0.26, 0.26), 0, GIRD)
    // girder: a deep plate standing on the roof, running in to the old building
    const r0 = inner[g], r1 = R + 0.06
    prism(steel, steel, obox(P(t, (r0 + r1) / 2), d, (r1 - r0) / 2, 0.28), MIES, GIRD)
  }
  // rooftop plant box
  prism(roof, roof, [[-7, -17], [1, -17], [1, -2.5], [-7, -2.5]], MIES - 0.5, 16.4)

  return [
    { part: lime, material: finish('mfah-limestone', 0xddd6c4) },
    { part: steel, material: finish('mfah-steel', 0x4a4f57) },
    { part: shade, material: finish('mfah-limestone-shade', 0xb3ad9f) },
    { part: glass, material: { name: 'window', color: 0x7a90a8, roughness: 0.35 } },
    { part: roof, material: finish('mfah-roof', 0xc8cbc9) },
    { part: tile, material: finish('mfah-tile', 0x8fae96) },
  ]
}

if (import.meta.main) await save('hou-mfah-law-building', 'Caroline Wiess Law Building', [29.7256491, -95.3904583], 0, build())
