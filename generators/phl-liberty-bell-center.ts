/**
 * Liberty Bell Center (2003, Bohlin Cywinski Jackson), Independence Mall,
 * Market Street between 5th and 6th, Philadelphia — original procedural
 * geometry, CC0-1.0.
 * bun generators/phl-liberty-bell-center.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/40086417,
 * 39.949869,-75.150230. The long hall runs at 9.56°, so the catalog bearing
 * is 9.56 and the hall is square to this frame; the bell chamber at its
 * south end is skewed ~28° toward Independence Hall's tower, 115 m to the
 * south-south-east.
 *
 * Identity, in order: the tall glass bell chamber at the south end, its
 * glass wall facing Independence Hall between two silver louvred steel
 * blades under a projecting louvred sunshade, the bell visible inside
 * between pale stone panels; the long, low exhibit hall behind it — brick
 * piers and full-height glass, a light steel trellis canopy along both
 * sides, a glass clerestory and a shallow grey-green metal gable roof; the
 * low brick link between them with its curved west wall. At night the hall
 * glows, the bell is lit in its chamber (floodlight on the bell and the
 * stone panels; the chamber glass itself stays glass).
 *
 * Evidence:
 *  - plan: OSM outline and parts: way/335799891 the hall (15.4 × 70.2 m,
 *    gabled), 335799894 the flat link with its curved west side, 335799893
 *    the chamber (a trapezoid: 13.8 m at the back, the 10.6 m glass end
 *    facing bearing ~156°, 18 m deep).
 *  - heights, lidar USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown 2015;
 *    the building is from 2003), above the local ground (the mall slopes
 *    ~1.2 m down to the north): hall ridge 8.2 m on the centre line, eaves
 *    6.9 m at ~1.4 m beyond the walls, trellis 4.2 m about 2 m out from
 *    both long walls, link roof 4.6 m, chamber roof 10.3 m with its blades
 *    to 11.1 m.
 *  - bays: ten bays of brick piers and glass along each long side, counted
 *    on Toadspike's photo of the east side; glass clerestory over the
 *    trellis from the same photo.
 *  - colours: brick a dark brick red, darker than the Hall's (photos);
 *    the steel frames, blades, louvres and trellis a light silver grey; the
 *    roof a grey-green zinc, sampled from USGS NAIP (#7f9b99-#8aa2a2) and
 *    pulled light; the hall glazing the palette window; the chamber clear
 *    glass, translucent, tinted (STYLE.md "Translucent glass"); the stone
 *    panels pale (palette stone); the bell in the brick colour, as bronze.
 *
 * Photos (Wikimedia Commons): Liberty_Bell_Center_South.jpg,
 * Liberty_Bell_Center_South_(front_view).jpg, Liberty_Bell_Center_SE_view.jpg,
 * Liberty_Bell_Center_East.jpg (Toadspike, CC BY-SA 4.0); Liberty_Bell
 * _Center_exterior_view_(340c08d8-...).jpg (NPS, public domain);
 * Centro_de_la_Campana_de_la_Libertad-2023_(1).jpg (Alberto-g-rovi, CC BY
 * 3.0); Independence_Park_(6315439041).jpg (InSapphoWeTrust, CC BY-SA 2.0);
 * Liberty_Bell_with_a_View_of_Independence_Hall.jpg (Christopher Martin, CC
 * BY-SA 3.0); Liberty_Bell_View_of_Independence_Hall.jpg (Blake Wylie, CC
 * BY-SA 3.0). USGS NAIP. (HABS PA-6712 records the 1976 pavilion, gone since
 * 2006, and was not used.) No commercial imagery.
 *
 * Left out: the glass fins and mullions, the louvre blades (bands instead),
 * the vines on the trellis, the trellis slats, the flagpole, the gardens.
 *
 * Doubts: the chamber's west side and the hall's north end are seen in no
 * photo here and are drawn like their opposites; the bell (0.9 m in life)
 * is drawn 1.5× so it shows through the glass.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { area, cap, lathe, save, walls, type XY } from './chi-aon-center'
import { bbox, cube, face } from './phl-independence-hall'

const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)

function build() {
  const brick = new Part(), steel = new Part(), roof = new Part(), win = new Part(), glass = new Part(), stone = new Part()

  // ---------------------------------------------------------- the hall
  const X0 = -7.2, X1 = 8.17, Y0 = -23.31, Y1 = 46.92, CX = (X0 + X1) / 2
  const EAVE = 6.9, RIDGE = 8.2, OV = 1.4, TR = 4.2
  // Glass box to the clerestory's head, then a steel band to the eaves.
  walls(win, ccw([[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]), 0, 6.5)
  walls(steel, ccw([[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]), 6.5, EAVE)
  // Gable ends.
  for (const [y, s] of [[Y0, -1], [Y1, 1]] as [number, number][]) face(steel, [[X0, y, EAVE], [X1, y, EAVE], [CX, y, RIDGE]], [0, s, 0])
  // Roof with overhangs and soffits.
  {
    const wx = X0 - OV, ex = X1 + OV, sy = Y0 - 0.8, ny = Y1 + 0.8
    face(roof, [[wx, sy, EAVE], [wx, ny, EAVE], [CX, ny, RIDGE], [CX, sy, RIDGE]], [-0.2, 0, 1])
    face(roof, [[ex, sy, EAVE], [ex, ny, EAVE], [CX, ny, RIDGE], [CX, sy, RIDGE]], [0.2, 0, 1])
    face(steel, [[wx, sy, EAVE], [ex, sy, EAVE], [ex, ny, EAVE], [wx, ny, EAVE]], [0, 0, -1])
    // A fascia along the long eaves.
    for (const [x, s] of [[wx, -1], [ex, 1]] as [number, number][]) face(steel, [[x, sy, EAVE - 0.35], [x, ny, EAVE - 0.35], [x, ny, EAVE], [x, sy, EAVE]], [s, 0, 0])
  }
  // Brick piers, ten bays a side, and the trellis canopy along both sides.
  const N = 10, step = (Y1 - Y0) / N
  for (let i = 0; i <= N; i++) {
    const y = Y0 + i * step, h = i === 0 || i === N ? 1.1 : 0.85
    const y0 = Math.max(Y0, y - h), y1 = Math.min(Y1, y + h)
    bbox(brick, brick, X0 - 0.45, y0, X0 + 0.2, y1, 0, TR + 0.25, 0.08)
    bbox(brick, brick, X1 - 0.2, y0, X1 + 0.45, y1, 0, TR + 0.25, 0.08)
  }
  for (const [x0, x1] of [[X0 - 2.2, X0 - 0.35], [X1 + 0.35, X1 + 2.2]]) {
    cube(steel, x0, Y0 + 0.4, x1, Y1 - 0.4, TR, TR + 0.32, true, true)
  }

  // ---------------------------------------------------------- the link
  {
    const link: XY[] = ccw([[-5.5, -23.31], [-5.66, -24.39], [-6.09, -25.35], [-8.32, -26.86], [-9.95, -27.91], [-11.08, -28.65], [-11.91, -29.64], [-12.78, -30.87], [-13.48, -32.58], [-13.75, -33.79], [-13.96, -35.44], [-13.76, -36.85], [-13.49, -37.94], [-12.37, -37.45], [-10.97, -36.83], [-9.07, -35.89], [-8.47, -35.6], [-9.04, -34.2], [3.47, -28.34], [3.84, -29.12], [4.29, -26.98], [5.05, -23.31]])
    walls(brick, link, 0, 4.25)
    walls(steel, link, 4.25, 4.6)
    cap(roof, link, 4.6)
  }

  // ------------------------------------------------------- the chamber
  {
    // Back (north) corners, then the glass end (south-south-east).
    const NW: XY = [-9.04, -34.2], NE: XY = [3.47, -28.34], SE: XY = [9.29, -46.08], SW: XY = [-0.4, -50.38]
    const H = 10.3, BR = 4.4
    const P = (p: XY, z: number): V3 => [p[0], p[1], z]
    // The ring NW, SW, SE, NE runs counter-clockwise; out(a, b) is the
    // outward normal of its edge a→b.
    const out = (a: XY, b: XY): V3 => [b[1] - a[1], a[0] - b[0], 0]
    const sides: [XY, XY][] = [[SE, NE], [NW, SW]] // the east and west long sides
    // Long sides: brick below, a silver louvre screen above.
    for (const [a, b] of sides) {
      const n = out(a, b)
      face(brick, [P(a, 0), P(b, 0), P(b, BR), P(a, BR)], n)
      face(steel, [P(a, BR), P(b, BR), P(b, H), P(a, H)], n)
    }
    // Back wall above the link, brick.
    face(brick, [P(NE, 4.6), P(NW, 4.6), P(NW, H), P(NE, H)], out(NE, NW))
    // The glass end, translucent, framed in steel.
    face(glass, [P(SW, 0), P(SE, 0), P(SE, H - 0.4), P(SW, H - 0.4)], out(SW, SE))
    const u: XY = [(SE[0] - SW[0]) / 10.6, (SE[1] - SW[1]) / 10.6], nrm: XY = [-u[1], u[0]] // nrm points into the chamber
    const at = (s: number, d: number): XY => [SW[0] + u[0] * s + nrm[0] * d, SW[1] + u[1] * s + nrm[1] * d]
    // Head of the glass wall.
    quadBox(steel, at(-0.2, -0.15), at(10.8, -0.15), at(10.8, 0.25), at(-0.2, 0.25), H - 0.45, H)
    cap(roof, ccw([NW, SW, SE, NE]), H)
    // The two tall blades at the glass end's corners, standing proud.
    for (const s of [-0.5, 11.1]) quadBox(steel, at(s - 0.35, -1.3), at(s + 0.35, -1.3), at(s + 0.35, 0.4), at(s - 0.35, 0.4), 0, 11.1)
    // Louvred panels hung off the blades, outside the corners.
    quadBox(steel, at(-2.3, -0.9), at(-0.85, -0.9), at(-0.85, -0.6), at(-2.3, -0.6), 4.0, 10.9)
    quadBox(steel, at(11.45, -0.9), at(12.9, -0.9), at(12.9, -0.6), at(11.45, -0.6), 3.2, 10.9)
    // The sunshade: a louvred plane over the roof, beams running out past
    // the glass end.
    quadBox(steel, at(-0.6, -1.6), at(11.2, -1.6), at(11.2, 6.0), at(-0.6, 6.0), H + 0.45, H + 0.6)
    for (let k = 0; k < 6; k++) {
      const s = 0.2 + k * 2.04
      quadBox(steel, at(s - 0.13, -2.3), at(s + 0.13, -2.3), at(s + 0.13, 7.0), at(s - 0.13, 7.0), H, H + 0.45)
    }
    // Inside: the pale stone panels either side and the bell, facing the Hall.
    for (const s of [2.4, 8.2]) quadBox(stone, at(s - 0.9, 2.8), at(s + 0.9, 2.8), at(s + 0.9, 3.2), at(s - 0.9, 3.2), 0, 5.2)
    const c = at(5.3, 2.2)
    for (const d of [-1.0, 1.0]) {
      const q = [c[0] + u[0] * d, c[1] + u[1] * d]
      quadBox(steel, [q[0] - 0.08, q[1] - 0.08], [q[0] + 0.08, q[1] - 0.08], [q[0] + 0.08, q[1] + 0.08], [q[0] - 0.08, q[1] + 0.08], 0, 2.9)
    }
    lathe(brick, c[0], c[1], [[0, 1.15], [0.82, 1.15], [0.8, 1.3], [0.62, 1.6], [0.5, 2.1], [0.45, 2.45], [0.3, 2.6], [0, 2.62]], 12)
    quadBox(brick, [c[0] - u[0] * 1.1 - nrm[0] * 0.2, c[1] - u[1] * 1.1 - nrm[1] * 0.2], [c[0] + u[0] * 1.1 - nrm[0] * 0.2, c[1] + u[1] * 1.1 - nrm[1] * 0.2], [c[0] + u[0] * 1.1 + nrm[0] * 0.2, c[1] + u[1] * 1.1 + nrm[1] * 0.2], [c[0] - u[0] * 1.1 + nrm[0] * 0.2, c[1] - u[1] * 1.1 + nrm[1] * 0.2], 2.6, 3.05)
  }

  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.8)
  return [
    { part: brick, material: { ...finish('lbc-brick', 0xa65d4a), floodlight: lit } },
    { part: steel, material: finish('lbc-steel', 0xcdd2d3) },
    { part: roof, material: finish('lbc-zinc', 0x93a6a4) },
    { part: win, material: { ...PALETTE.window, color: 0x9fb2c1 } },
    { part: glass, material: { name: 'glass', color: 0x7fc4de, roughness: 0.24, opacity: 0.3, doubleSided: true } },
    { part: stone, material: { ...PALETTE.stone, floodlight: (p: V3, n: V3) => 0.9 } },
  ]
}

/** A prism over a convex quad (any winding), with top and bottom. */
function quadBox(p: Part, a: XY | number[], b: XY | number[], c: XY | number[], d: XY | number[], z0: number, z1: number) {
  const r = ccw([a, b, c, d].map((q) => [q[0], q[1]] as XY))
  walls(p, r, z0, z1)
  cap(p, r, z1)
  cap(p, r, z0, false)
}

if (import.meta.main) await save('phl-liberty-bell-center', 'Liberty Bell Center', [39.949869, -75.15023], 9.56, build(), 5000)
