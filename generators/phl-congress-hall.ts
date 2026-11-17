/**
 * Congress Hall (Philadelphia County Courthouse, 1787-89; south extension
 * 1793), Sixth and Chestnut Streets, Philadelphia — seat of the US Congress
 * 1790-1800 — original procedural geometry, CC0-1.0.
 * bun generators/phl-congress-hall.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/40083518,
 * 39.948979,-75.150645. Its walls run at 9.1° / 99.1°, so the catalog
 * bearing is 9.1: +y is the Chestnut Street front, -x Sixth Street.
 *
 * It stands 4-5 m west of Independence Hall's west wing (a separate
 * building and model, phl-independence-hall), so the two share no wall;
 * that model's wing stops 0.4 m inside its own OSM outline, leaving the gap.
 *
 * Identity, in order: a plain two-storey red-brick block, long north-south,
 * under a grey hipped roof with three tall chimneys along each side; the
 * small white octagonal cupola with arched openings, bell roof and gilt
 * finial on the ridge, toward Chestnut Street; the pedimented north front
 * with its lunette, five bays, round-headed ground-floor windows round an
 * arched doorway and the wrought-iron balcony over it; the canted bay of the
 * 1793 extension at the south end. At night the sashes glow and the brick
 * is lit from the street.
 *
 * Evidence:
 *  - plan: OSM outline (15.9 × 30.9 m with the canted south bay), parts
 *    way/335771286 (the block) and 335771285/335771287 (the cupola, centred
 *    4.6 m north of the anchor). Lidar puts the same outline 0.6-0.9 m
 *    further south, as it does Independence Hall; OSM is kept.
 *  - heights, lidar USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown 2015)
 *    above the lowest ground (Sixth Street; Independence Square is ~1.1 m
 *    higher on the east): cornice 13.1 m, main ridge 17.1 m running from
 *    ~12 m south of the anchor to ~7.7 m north of it, the north pediment's
 *    apex 15.3 m, chimney tops 17.6 m at 6.3, -1.2 and -9.7 m along both
 *    eaves, cupola body ~21.2 m, finial 26.9 m.
 *  - bays: HABS PA-1431 (Library of Congress, public domain, 1959) sheet 2,
 *    second-floor plan: seven windows to each long side, sashes 4 ft 10 in
 *    (1.47 m) wide, positions scaled from its 93 ft 1 in wall to OSM's
 *    length. Sheet 16: the cupola's octagon, arched openings, shingled bell
 *    roof, ball and fish vane.
 *  - north front, measured on Beyond My Ken's straight-on twilight photo
 *    (facade 15.9 m wide): pediment over the middle 9.1 m with a 0.7 m
 *    lunette; upper sashes 1.5 m wide on 2.8/5.6 m centres; round-headed
 *    windows 1.64 m wide, sill 2.4, springing 5.4 m, on 2.9/6.0 m centres;
 *    arched doorway 1.9 m wide in a 2.9 m stone surround; belt course 8 m;
 *    balcony 3.75 m wide; stone base to 1 m.
 *  - colours, from the daylight photos: the warm, slightly pink red brick
 *    pulled to the palette's lightness; white cornices, sashes, belt and
 *    cupola (palette trim); grey cedar shakes on the roof and cupola bell;
 *    charcoal for the cupola's open arches.
 *
 * Photos (Wikimedia Commons): 2015_Congress_Hall_-_Philadelphia_01.JPG and
 * _02.JPG (Farragutful, CC BY-SA 4.0); Congress_Hall_SE_side.jpg and
 * Congress_Hall_West_side.jpg (Ben Franske, CC BY-SA 4.0);
 * Congress_Hall_(53590490584).jpg (ajay_suresh, CC BY 2.0);
 * Congress_Hall_at_twilght.jpg (Beyond My Ken, CC BY-SA 4.0);
 * Congress_Hall_exterior.jpg (tim eschaton, CC BY-SA 2.0);
 * Congress_Hall_-_Philadelphia_(2642813566).jpg (Reading Tom, CC BY 2.0);
 * Independence_Hall,_Congress_Hall_and_Public_Ledger_Building.jpg (Beyond
 * My Ken, CC BY-SA 4.0). HABS PA-1431 sheets 2 and 16 (public domain).
 * USGS NAIP for the roof. No commercial imagery.
 *
 * Left out: the carved panel over the door, keystones, sash bars, the
 * basement windows, the balcony's ironwork (a white slab and rail), the
 * stone steps.
 *
 * Doubts: HABS gives the long walls as 28.4 m against OSM's and the
 * lidar's ~30.5 m; OSM's is used. The south end of the roof is a steep hip
 * meeting the bay's roof, read from the lidar and one photo. The west
 * (Sixth Street) side's door positions are not modelled.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { lathe, save, walls, type XY } from './chi-aon-center'
import { archOn, bbox, face, floodWalls, ngon, rectOn, sash } from './phl-independence-hall'

function build() {
  const brick = new Part(), trim = new Part(), roof = new Part(), win = new Part(), dark = new Part()

  const X0 = -7.93, X1 = 7.93, YN = 15.73, YS = -15.0
  const CORN = 13.1, RIDGE = 17.1, O = 0.35
  // The canted south bay of 1793.
  const BW = 4.1, BF = 2.5, BY = -16.55
  const ring: XY[] = [[X0, YS], [-BW, YS], [-BF, BY], [BF, BY], [BW, YS], [X1, YS], [X1, YN], [X0, YN]]

  walls(brick, ring, 0, CORN - 0.45)
  // Stone base and the belt course.
  bandAround(trim, ring, 0, 1.0, 0.06)
  bandAround(trim, ring, 7.85, 8.15, 0.06)
  // Cornice.
  bandAround(trim, ring, CORN - 0.45, CORN, O, true)

  // Main hipped roof, ridge from y = -12 to 7.7; the bay's own roof meets
  // its steep south hip; a cross-gable behind the north pediment.
  const ex = X1 + O, wx = X0 - O, ny = YN + O, sy = YS - O
  const R0: V3 = [0, -12.0, RIDGE], R1: V3 = [0, 7.7, RIDGE]
  face(roof, [[ex, sy, CORN], [ex, ny, CORN], R1, R0], [1, 0, 1])
  face(roof, [[wx, ny, CORN], [wx, sy, CORN], R0, R1], [-1, 0, 1])
  face(roof, [[wx, ny, CORN], [ex, ny, CORN], R1], [0, 1, 1])
  face(roof, [[ex, sy, CORN], [wx, sy, CORN], R0], [0, -1, 1])
  {
    // The bay's roof: three hips up to a point on the main south hip.
    const zA = CORN + ((-14.2 - sy) / (R0[1] - sy)) * (RIDGE - CORN)
    const A: V3 = [0, -14.2, zA]
    const b: XY[] = [[-BW - O, YS - 0.1], [-BF - 0.2, BY - O], [BF + 0.2, BY - O], [BW + O, YS - 0.1]]
    for (let i = 0; i < 3; i++) face(roof, [[b[i][0], b[i][1], CORN], [b[i + 1][0], b[i + 1][1], CORN], A], [(b[i][0] + b[i + 1][0]) / 2, (b[i][1] + b[i + 1][1]) / 2 + 14.2, 1])
  }
  {
    // North pediment over the middle 9.1 m: brick tympanum, white rakes, a
    // lunette; its gable roof runs back into the hip.
    const PH = 4.55, AP = 15.3, y = YN
    const back = ny - ((AP - CORN) / (RIDGE - CORN)) * (ny - R1[1])
    face(roof, [[-PH - 0.3, ny, CORN], [0, ny, AP + 0.15], [0, back, AP + 0.15]], [-1, 0, 2])
    face(roof, [[PH + 0.3, ny, CORN], [0, ny, AP + 0.15], [0, back, AP + 0.15]], [1, 0, 2])
    face(brick, [[-PH, y, CORN], [PH, y, CORN], [0, y, AP - 0.3]], [0, 1, 0])
    // Raking cornices: white strips standing proud along both rakes.
    const f = y + 0.4
    for (const s of [-1, 1]) {
      face(trim, [[s * (PH + 0.4), f, CORN - 0.05], [0, f, AP + 0.2], [0, f, AP - 0.35], [s * (PH - 0.5), f, CORN - 0.05]], [0, 1, 0])
      face(trim, [[s * (PH + 0.4), y, CORN - 0.05], [0, y, AP + 0.2], [0, f, AP + 0.2], [s * (PH + 0.4), f, CORN - 0.05]], [s * (AP - CORN), 0, PH])
    }
    archOn(trim, [X1, YN], [X0, YN], X1, 0.85, CORN + 0.35, CORN + 0.35, 0.03, 8)
    archOn(win, [X1, YN], [X0, YN], X1, 0.68, CORN + 0.4, CORN + 0.4, 0.06, 8)
  }

  // Chimneys along both eaves.
  for (const x of [X0 + 1.0, X1 - 1.0]) for (const y of [6.3, -1.2, -9.7]) bbox(brick, brick, x - 0.45, y - 0.85, x + 0.45, y + 0.85, 12.0, 17.6, 0.08)

  // ------------------------------------------------------------ cupola
  {
    const CY = 4.6
    bbox(trim, trim, -1.45, CY - 1.45, 1.45, CY + 1.45, 15.8, 17.6, 0.08)
    const oct = ngon(0, CY, 1.55, 8)
    walls(trim, oct, 17.6, 20.6)
    for (let k = 0; k < 8; k++) archOn(dark, oct[k], oct[(k + 1) % 8], 0.593, 0.4, 18.1, 19.85, 0.03, 8)
    const ent = ngon(0, CY, 1.78, 8)
    walls(trim, ent, 20.6, 21.0)
    face(trim, ent.map(([x, y]) => [x, y, 20.6] as V3), [0, 0, -1])
    lathe(roof, 0, CY, [[1.78, 21.0], [1.5, 21.02], [1.48, 21.4], [1.25, 22.0], [0.8, 22.5], [0.35, 22.85], [0.2, 23.0]], 16, Math.PI / 8)
    lathe(trim, 0, CY, [[0.2, 23.0], [0.12, 23.8], [0.28, 24.0], [0.32, 24.25], [0.22, 24.5], [0.06, 24.6], [0.05, 26.9], [0, 26.92]], 8)
    const vane: V3[] = [[-0.55, CY, 26.2], [0.6, CY, 26.2], [0.6, CY, 26.55], [-0.55, CY, 26.55]]
    face(trim, vane, [0, -1, 0])
    face(trim, vane, [0, 1, 0])
  }

  // ------------------------------------------------------------ facades
  const LOW = [2.6, 5.6] as const, UP = [9.3, 12.1] as const
  // North front: five bays.
  {
    const a: XY = [X1, YN], b: XY = [X0, YN], s = (x: number) => X1 - x
    for (const x of [-5.6, -2.82, 0, 2.82, 5.6]) sash(trim, win, a, b, s(x), 0.76, UP[0], UP[1])
    for (const x of [-6.0, -2.94, 2.94, 6.0]) {
      archOn(trim, a, b, s(x), 1.0, LOW[0] - 0.2, LOW[1], 0.04)
      archOn(win, a, b, s(x), 0.82, LOW[0], LOW[1], 0.08)
    }
    archOn(trim, a, b, s(0), 1.45, 0.7, 4.95, 0.04)
    archOn(win, a, b, s(0), 0.95, 4.1, 4.95, 0.08)
    rectOn(trim, a, b, s(0), 0.95, 0.9, 4.05, 0.1)
    // The balcony over the door: a white slab and its railing.
    bbox(trim, trim, -1.85, YN, 1.85, YN + 0.85, 8.25, 8.45, 0.05)
    bbox(trim, trim, -1.85, YN + 0.7, 1.85, YN + 0.85, 8.45, 9.4, 0.04)
  }
  // Long sides: seven bays (HABS), round-headed below; the east side has a
  // doorway in its fourth bay.
  const SIDE = [-11.67, -7.35, -3.08, 0.93, 4.92, 9.0, 12.92]
  for (const [a, b, east] of [[[X1, YS], [X1, YN], true], [[X0, YN], [X0, YS], false]] as [XY, XY, boolean][]) {
    const s = (y: number) => (east ? y - YS : YN - y)
    SIDE.forEach((y, i) => {
      sash(trim, win, a, b, s(y), 0.74, UP[0], UP[1])
      if (east && i === 3) {
        archOn(trim, a, b, s(y), 1.15, 0.9, 4.0, 0.04)
        archOn(win, a, b, s(y), 0.8, 3.4, 4.0, 0.08)
        rectOn(trim, a, b, s(y), 0.8, 1.0, 3.35, 0.1)
      } else {
        archOn(trim, a, b, s(y), 0.95, LOW[0] - 0.2, LOW[1], 0.04)
        archOn(win, a, b, s(y), 0.76, LOW[0], LOW[1], 0.08)
      }
    })
  }
  // The bay: one window to each of its three faces; the south ends of the
  // main walls beside it are blank.
  for (const [a, b] of [[ring[1], ring[2]], [ring[2], ring[3]], [ring[3], ring[4]]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    sash(trim, win, a, b, L / 2, 0.68, UP[0], UP[1])
    archOn(trim, a, b, L / 2, 0.9, LOW[0] - 0.2, LOW[1], 0.04)
    archOn(win, a, b, L / 2, 0.72, LOW[0], LOW[1], 0.08)
  }

  return [
    { part: brick, material: { ...finish('ch-brick', 0xb66c58), floodlight: floodWalls } },
    { part: trim, material: { ...PALETTE.trim, floodlight: floodWalls } },
    { part: roof, material: finish('ch-shakes', 0x85817e) },
    { part: win, material: { ...PALETTE.window, color: 0x98a6b1 } },
    { part: dark, material: finish('ch-cupola', 0x4a4f57) },
  ]
}

/**
 * A band round a ring from z0 to z1, standing `d` proud of its walls; with
 * `top`, its upper edge is chamfered back to the wall line (a cornice).
 */
function bandAround(p: Part, ring: XY[], z0: number, z1: number, d: number, top = false) {
  const n = ring.length
  const off = ring.map((c, i) => {
    const a = ring[(i - 1 + n) % n], b = ring[(i + 1) % n]
    const n1 = norm([c[1] - a[1], a[0] - c[0]]), n2 = norm([b[1] - c[1], c[0] - b[0]])
    // Outward normals of a counter-clockwise ring are (dy, -dx).
    const m: XY = [n1[0] + n2[0], n1[1] + n2[1]], k = 1 + n1[0] * n2[0] + n1[1] * n2[1]
    return [c[0] + (m[0] / Math.max(k, 0.2)) * d, c[1] + (m[1] / Math.max(k, 0.2)) * d] as XY
  })
  if (top) {
    walls(p, off, z0, z1 - 0.15)
    walls(p, off, z1 - 0.15, z1, ring)
    // Soffit, facing down.
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      face(p, [[ring[i][0], ring[i][1], z0], [ring[j][0], ring[j][1], z0], [off[j][0], off[j][1], z0], [off[i][0], off[i][1], z0]], [0, 0, -1])
    }
  } else {
    walls(p, off, z0, z1)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      face(p, [[ring[i][0], ring[i][1], z1], [ring[j][0], ring[j][1], z1], [off[j][0], off[j][1], z1], [off[i][0], off[i][1], z1]], [0, 0, 1])
    }
  }
}
const norm = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

if (import.meta.main) await save('phl-congress-hall', 'Congress Hall', [39.948979, -75.150645], 9.1, build(), 5000)
