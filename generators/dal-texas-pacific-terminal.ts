/**
 * Texas & Pacific Passenger Terminal (1931, Wyatt C. Hedrick; Zigzag Moderne;
 * now the T&P Lofts over the T&P Station), 221 West Lancaster Avenue, Fort
 * Worth: procedural, CC0-1.0.  bun generators/dal-texas-pacific-terminal.ts
 *
 * Map frame: x east, y north, z up, metres, turned to the placement's bearing
 * 2.8 (the long walls of OSM way/421883046 run at 92.8 deg), so the long faces
 * are Lancaster Avenue (+y) and the railway side (-y). Origin: the centroid of
 * way/421883046 (the 13-storey building, tagged T&P Lofts); z = 0 the street.
 *
 * Identity, in order: the long thirteen-storey slab of buff brick with its
 * end pavilions rising above the main cornice; the stepped Zigzag Moderne
 * crowns of the pavilions with the small domed round caps on the building's
 * four outer corners; strong vertical piers and window columns, the windows
 * in pairs; the pale cast-stone two-storey base with the tall waiting-room
 * windows and the band of Zigzag ornament at the main cornice.
 *
 * Measured, USGS lidar TX_Pecos_Dallas_B3_2018 (2018 flight), over the street:
 * - main roof 48.6 (48.9-49.0 over the box minimum; the street 0.3);
 * - the slab 20.6 m deep (y -10.2..10.4) and about 69.7 m long; the lidar
 *   sits 1 m east of OSM's outline (x -33.7..36.0 against OSM's -34.3..34.2),
 *   followed here;
 * - the concourse block on the south side at 9 m is OSM way/421883047 (the
 *   station) and is not part of this model.
 * The pavilion tops returned no lidar points (likely classed as noise), so:
 * Estimated from Barera's and Renelibrary's views, scaled on the measured
 *   48.6 m roof: pavilion parapets 52.6, the stepped crown to 54.2, the round
 *   corner caps to 57.0; pavilions 9 m wide and the full depth; base two
 *   storeys to 9.5; storey groups and window columns (about 26 window columns
 *   on the long face, in pairs between piers).
 * Published: 13 storeys, 1931, Wyatt C. Hedrick, Zigzag Moderne (Wikipedia;
 *   Recorded Texas Historic Landmark plaque).
 * Facade (lead review): narrow window strips, about a quarter of each 4 m
 *   bay, with pale spandrels between three-storey groups, so the buff wall
 *   dominates as in the photos; the first pass's broad panels read as a
 *   curtain wall.
 * Colours: buff brick (#9e8f7d / #a19685 in shade, warm tan in sun), drawn
 *   #d8c9aa; windows a lighter slate (#7a8c9a) as the white-framed sashes read
 *   light; cast-stone base, piers' trim and crowns in pale stone.
 * Night: lit windows; the crowns floodlit lightly.
 * Left out: the Zigzag reliefs, the eagle panels, lettering and canopies.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "Fort Worth June 2016 01/02/03 (T&P Station).jpg", Michael Barera,
 *   CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Fort_Worth_June_2016_02_(T%26P_Station).jpg
 *   https://commons.wikimedia.org/wiki/File:Fort_Worth_June_2016_03_(T%26P_Station).jpg
 * - "Texas and Pacific Terminal Complex.jpg" and "T P Building.jpg",
 *   Renelibrary, CC BY-SA 3.0
 *   https://commons.wikimedia.org/wiki/File:Texas_and_Pacific_Terminal_Complex.jpg
 *   https://commons.wikimedia.org/wiki/File:T_P_Building.jpg
 * - "T&P Lofts.jpg" and "T&P Station Entrance.jpg", Eejjmm8888, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:T%26P_Lofts.jpg
 * - "Texas & Pacific Railway Terminal, June 2008.jpg", Justin Cozart, CC BY 2.0
 *   https://commons.wikimedia.org/wiki/File:Texas_%26_Pacific_Railway_Terminal,_June_2008.jpg
 * - "The T^P From The Mountain - panoramio.jpg", j2003af, CC BY-SA 3.0
 * Look-only (not relied on): Robert Yarnall Richie's 1930s photos of the
 *   terminal (Commons, "no restrictions" but tagged look-only by the tool);
 *   StevenM_61's Flickr photos (CC BY-NC-ND).
 * No commercial imagery.
 *
 * Doubts: the pavilion and cap heights are photo-scaled (no lidar); the
 * railway (south) face is seen only past the concourse; the window rhythm is
 * regularised into storey groups.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, lathe, panel, rect, save, walls, type XY } from './chi-merchandise-mart'

const ANCHOR: [number, number] = [32.7459164, -97.3277864]
const BEARING = 2.8

const X0 = -33.7, X1 = 36.0, Y0 = -10.2, Y1 = 10.4
const PW = 9.0 // pavilion width
const ROOF = 48.6, PAV = 52.6, CROWN = 54.2, BASE = 9.5
// Eleven storeys over the base at 3.45 m, windows grouped three storeys a
// panel (two at the top) with brick spandrels between groups.
const FL = (k: number) => 10.0 + 3.45 * k
const GROUPS: [number, number][] = [[FL(0) + 0.8, FL(3) - 1.2], [FL(3) + 0.8, FL(6) - 1.2], [FL(6) + 0.8, FL(9) - 1.2], [FL(9) + 0.8, FL(11) - 1.4]]
const SPANDRELS: [number, number][] = [[FL(3) - 1.2, FL(3) + 0.8], [FL(6) - 1.2, FL(6) + 0.8], [FL(9) - 1.2, FL(9) + 0.8]]

function box(p: Part, top: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  walls(p, rect(x0, y0, x1, y1), z0, z1)
  if (top) cap(top, rect(x0, y0, x1, y1), z1)
}

function build() {
  const brick = new Part(), stone = new Part(), win = new Part(), roof = new Part(), capm = new Part()

  const PX0 = X0 + PW, PX1 = X1 - PW
  // Base (cast stone), the brick slab and its cornice band.
  box(stone, null, X0, Y0, X1, Y1, 0, BASE)
  box(stone, stone, X0 - 0.25, Y0 - 0.25, X1 + 0.25, Y1 + 0.25, BASE - 0.3, BASE + 0.5)
  box(brick, null, PX0, Y0, PX1, Y1, BASE + 0.5, ROOF - 3.0)
  box(stone, null, PX0, Y0 - 0.1, PX1, Y1 + 0.1, ROOF - 3.0, ROOF - 0.6)
  box(stone, stone, PX0, Y0 - 0.25, PX1, Y1 + 0.25, ROOF - 0.6, ROOF)
  cap(roof, rect(PX0, Y0 + 0.4, PX1, Y1 - 0.4), ROOF + 0.02)

  // Zigzag band at the cornice: a row of stepped chevrons in brick on the stone.
  for (const [y, s] of [[Y1 + 0.12, 1], [Y0 - 0.12, -1]] as [number, number][]) {
    const n = 26, w = (PX1 - PX0) / n
    for (let k = 0; k < n; k++) {
      const x = PX0 + (k + 0.5) * w
      const P = (dx: number, z: number): V3 => [x + dx, y, z]
      const pts = [P(-w * 0.42, ROOF - 2.8), P(w * 0.42, ROOF - 2.8), P(0, ROOF - 1.0)]
      if (s > 0) brick.tri(pts[0], pts[1], pts[2]); else brick.tri(pts[1], pts[0], pts[2])
    }
  }

  // Pavilions, the full depth, standing a little proud of the long faces.
  for (const [a, b, side] of [[X0, PX0, -1], [PX1, X1, 1]] as [number, number, number][]) {
    box(brick, null, a, Y0 - 0.4, b, Y1 + 0.4, BASE + 0.5, PAV - 1.4)
    box(stone, null, a, Y0 - 0.45, b, Y1 + 0.45, PAV - 1.4, PAV)
    cap(roof, rect(a, Y0 - 0.45, b, Y1 + 0.45), PAV)
    // Stepped Zigzag crown: two set-back steps over the pavilion's middle.
    const cx = (a + b) / 2
    box(stone, roof, cx - 3.2, Y0 + 1.2, cx + 3.2, Y1 - 1.2, PAV, PAV + 0.9)
    box(stone, roof, cx - 1.8, Y0 + 3.0, cx + 1.8, Y1 - 3.0, PAV + 0.9, CROWN)
    // Piers: two on each long face, two on the end face, rising past the
    // parapet with stepped tops.
    const pier = (x: number, y: number, ax: 'x' | 'y', o: number) => {
      const hw = 0.55, d = 0.5
      const r = ax === 'x' ? rect(x - hw, Math.min(y, y + o * d), x + hw, Math.max(y, y + o * d)) : rect(Math.min(x, x + o * d), y - hw, Math.max(x, x + o * d), y + hw)
      box(stone, stone, r[0][0], r[0][1], r[2][0], r[2][1], BASE + 0.5, PAV + 0.8)
      box(stone, stone, (r[0][0] + r[2][0]) / 2 - 0.3, (r[0][1] + r[2][1]) / 2 - 0.3, (r[0][0] + r[2][0]) / 2 + 0.3, (r[0][1] + r[2][1]) / 2 + 0.3, PAV + 0.8, PAV + 2.0)
    }
    for (const dx of [-2.2, 2.2]) {
      pier(cx + dx, Y1 + 0.4, 'x', 1)
      pier(cx + dx, Y0 - 0.4, 'x', -1)
    }
    const xe = side > 0 ? X1 : X0
    for (const dy of [-3.2, 3.2]) pier(xe, dy, 'y', side)
    // Round domed caps on the outer corners.
    for (const yc of [Y0 + 1.0, Y1 - 1.0]) {
      const xc = xe - side * 1.0
      lathe(stone, xc, yc, [[1.8, PAV - 6.0], [1.8, PAV + 0.4], [2.05, PAV + 0.4], [2.05, PAV + 1.0], [1.75, PAV + 1.0], [1.75, PAV + 2.1]], 12)
      lathe(capm, xc, yc, [[1.9, PAV + 2.1], [1.8, PAV + 2.9], [1.4, PAV + 3.6], [0.7, PAV + 4.1], [0.15, PAV + 4.3], [0.15, PAV + 4.6], [0, PAV + 4.6]], 12)
    }
    // Windows: a column each side of the pier pair on the long faces, three
    // on the end face, in two- and three-storey groups.
    for (const [y, s] of [[Y1 + 0.4, 1], [Y0 - 0.4, -1]] as [number, number][]) {
      const [p, q]: XY[] = s > 0 ? [[b, y], [a, y]] : [[a, y], [b, y]]
      for (const dx of [-3.6, 0, 3.6]) {
        const sAlong = s > 0 ? b - (cx + dx) : cx + dx - a
        for (const [z0, z1] of GROUPS) panel(win, p, q, sAlong - 0.45, sAlong + 0.45, z0, z1, 0.05)
      }
    }
    const [p, q]: XY[] = side > 0 ? [[xe, Y0 - 0.4], [xe, Y1 + 0.4]] : [[xe, Y1 + 0.4], [xe, Y0 - 0.4]]
    for (const t of [5.6, 10.7, 15.8]) {
      for (const [z0, z1] of GROUPS) panel(win, p, q, t - 0.5, t + 0.5, z0, z1, 0.05)
      for (const [z0, z1] of SPANDRELS) panel(stone, p, q, t - 0.75, t + 0.75, z0, z1, 0.04)
    }
    for (const t of [4.0, 8.2, 12.6, 16.8]) panel(win, p, q, t - 1.1, t + 1.1, 1.6, 7.6, 0.45)
  }

  // Long faces of the slab: 13 bays, each a pair of window columns between
  // brick piers, in storey groups; the base's tall waiting-room windows.
  for (const [y, s] of [[Y1, 1], [Y0, -1]] as [number, number][]) {
    const [p, q]: XY[] = s > 0 ? [[PX1, y], [PX0, y]] : [[PX0, y], [PX1, y]]
    const L = PX1 - PX0, n = 13, w = L / n
    for (let k = 0; k < n; k++) {
      const c = (k + 0.5) * w
      // a narrow window strip (the real pair of sashes) and pale cast-stone
      // spandrels between the storey groups; the buff brick dominates
      for (const [z0, z1] of GROUPS) panel(win, p, q, c - 0.55, c + 0.55, z0, z1, 0.05)
      for (const [z0, z1] of SPANDRELS) panel(stone, p, q, c - 0.8, c + 0.8, z0, z1, 0.04)
      // piers between bays
      if (k > 0) {
        const x = s > 0 ? PX1 - k * w : PX0 + k * w
        box(brick, null, x - 0.35, s > 0 ? Y1 : Y0 - 0.35, x + 0.35, s > 0 ? Y1 + 0.35 : Y0, BASE + 0.5, ROOF - 3.0)
      }
    }
    // base: tall windows across the middle, smaller towards the ends
    const [bp, bq]: XY[] = s > 0 ? [[X1, y], [X0, y]] : [[X0, y], [X1, y]]
    const BL = X1 - X0
    for (let k = 0; k < 15; k++) {
      const c = 2.6 + k * ((BL - 5.2) / 14)
      const tall = c > 14 && c < BL - 14
      panel(win, bp, bq, c - 1.3, c + 1.3, tall ? 1.4 : 1.6, tall ? 8.4 : 3.6, 0.05)
      if (!tall) panel(win, bp, bq, c - 1.1, c + 1.1, 5.2, 8.0, 0.05)
    }
  }

  const lit = (p: V3, n: V3) => (p[2] > 46 && Math.abs(n[2]) < 0.6 ? 0.6 : 0)
  return [
    { part: brick, material: finish('tp-buff-brick', 0xd8c9aa) },
    { part: stone, material: { ...PALETTE.stone, floodlight: lit } },
    { part: win, material: { ...PALETTE.window, color: 0x7a8c9a } },
    { part: roof, material: PALETTE.roof },
    { part: capm, material: finish('tp-cap', 0xd9cdb6) },
  ]
}

if (import.meta.main) await save('dal-texas-pacific-terminal', 'Texas & Pacific Passenger Terminal', ANCHOR, BEARING, build(), 5000)
