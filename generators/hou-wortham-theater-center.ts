/**
 * Wortham Theater Center (501 Texas Avenue, 1987, Morris Architects /
 * Eugene Aubry), Houston — original procedural geometry, CC0-1.0.
 * bun generators/hou-wortham-theater-center.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Built turned to the downtown grid: catalog bearing 34.8, so model
 * -y is the Texas Avenue end (south-west) and -x the Buffalo Bayou side.
 * Anchor = the centroid of the OSM outline (way/54044832),
 * 29.7633673,-95.3656831.
 *
 * Identity, in order: the great stepped arch on the Texas Avenue end, a
 * semicircle on jambs, three receding rings round a gridded glass wall,
 * with an oculus either side; the plain rose-tan brick box, 33 m high,
 * scored all round by deep horizontal channels; round oculi on every face;
 * a T plan, the arch wing (the grand foyer) reaching south to Texas Avenue
 * from the main block over the two halls.
 *
 * Brief vs photos: the brief describes "a huge glazed quarter-round or
 * semicircular arch". The photos show a full semicircular arch on vertical
 * jambs, its glass flat in the facade plane inside three stepped rings, on
 * the narrow south end; it is drawn that way. No separate fly towers read
 * over the roof: lidar shows one flat roof at 32.6 m over the street, with
 * rooftop wells, so the halls' fly towers are inside the box.
 *
 * Ground: the site falls from Texas Avenue (front) to the Buffalo Bayou
 * bank on the west. The map stands the model on the lowest Mapterhorn
 * ground of a 7x7 grid over its plan box, which is on the bayou bank by
 * the south-west corner (lidar: ~6 m below the street there). `terrain.ts
 * check` shows the Texas Avenue street drawn 6.3-6.9 m above that point,
 * so the front street is at G = 6.9 m in the model, all heights are G plus
 * the lidar height over the street, and the walls run on down to y = 0 on
 * the bayou side (photos show the building's lower floors exposed there).
 * Facade details start at G.
 *
 * Evidence:
 *  - plan and heights: USGS 3DEP lidar TX_Coastal_B1_2018 (flown 2018), 1 m
 *    grid, read in the turned frame. Roof 32.6 m over the Texas Avenue
 *    street, parapet 34.1 m (lidar 43.8 / 45.3 over the grid minimum,
 *    street 11.2). OSM height 33 agrees. A strip along the north end
 *    (x -2..46, y 49..57) is 27.6 m (lidar 38.8), drawn; roof wells left out.
 *  - OSM: outline way/54044832 (T plan; the arch wing widens to 54.6 m at
 *    its end). No building:part ways.
 *  - arch, oculi and windows scaled on Another Believer's frontal photo
 *    (facade 32.6 m = 365 px): arch outer radius 12.3 m, glass radius
 *    8.5 m, springing 18.0 m over the street (re-measured: outer radius 13.2 m,
 *    rings 1.6/1.55/1.55 m, standing 1.8/1.2/0.6 m proud: the arch casts a
 *    shadow on the wall in the photo); three rings;
 *    oculi 4.3-4.5 m across at ±16 m, centres 26 m up; tall gridded windows
 *    either side, 6 m wide, to 16.8 m. Channels 0.6 m deep-shaded bands every
 *    3.0 m (1.5-3 m on the photos; drawn at 3 m so they don't shimmer); on the
 *    arch face only the outer 6 m carry them, as in the photo; shaded with a
 *    darker brick standing for their shadow.
 *  - colour: rose-tan brick: #a38a7e sunlit, #846d62 shade (Kimpel),
 *    #ceb8a9-#d7c5b7 in hard sun on the front (Another Believer); drawn
 *    #c4a593. The arch's granite rings and the oculus rims read lighter
 *    (#eaddcf in sun), drawn #dccbbd; channel shadow #94786a. Roof pale grey from
 *    NAIP, #b9bcbc.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Wortham_Center,_Houston,_Texas,_Jan._2012.JPG, Another Believer,
 *    CC BY-SA 3.0 (frontal, the arch)
 *    https://commons.wikimedia.org/wiki/File:Wortham_Center,_Houston,_Texas,_Jan._2012.JPG
 *  - Wortham_Center.jpg, Rick Kimpel (rkimpeljr), CC BY-SA 2.0 (arch end and
 *    east side from the south-east)
 *    https://commons.wikimedia.org/wiki/File:Wortham_Center.jpg
 *  - Wortham_Center_at_Buffalo_Bayou,_Houston,_Texas.JPG, Another Believer,
 *    CC BY-SA 3.0 (west side over the bayou)
 *    https://commons.wikimedia.org/wiki/File:Wortham_Center_at_Buffalo_Bayou,_Houston,_Texas.JPG
 *  USGS NAIP for the plan and roof. Published: opened 1987 (Wikipedia,
 *  "Wortham Theater Center"). No commercial imagery.
 *
 * Left out: the brick coursing, the rooftop wells and plant, the small
 * square windows high on the east side, the canopy and entrance doors at
 * the arch's foot, the garage under Smith Street.
 *
 * Doubts: the north end and most of the east side are not in any licensed
 * photo; their oculi and windows repeat the photographed sides. Oculus and
 * window positions on the long sides are approximate. Channel spacing is a
 * count, not a measurement.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { cap, inset, panel, save, walls, type XY } from './chi-aon-center'
import { annulus } from './hou-alley-theatre'

const G = 6.9 // Texas Avenue street level above y = 0, as the map draws it
const ROOF = G + 32.6, TOP = G + 34.1 // lidar 43.8 / 45.3 over a street at 11.2
const CH = 3.0, CH0 = G + 4.6, CHH = 0.6, CHD = 0.35 // channels: pitch, first, height, depth

function build() {
  const brick = new Part(), trim = new Part(), roof = new Part(), win = new Part(), shade = new Part()
  const chans: number[] = []

  const T: XY[] = [
    [-46.5, -26], [-22.3, -26], [-22.3, -49.4], [-27.3, -54.9], [-27.2, -73.2], [27.6, -73.2],
    [27.6, -54.4], [20.6, -48.7], [20.8, -26], [44.6, -26], [46, 56.6], [-45.6, 56.8],
  ]

  // walls with horizontal channels, a coping and a sunk roof, per mass
  const mass = (R: XY[], roofZ: number, topZ: number) => {
    const IN = inset(R, CHD)
    let z = 0
    for (let k = 0; ; k++) {
      const c0 = CH0 + k * CH
      if (c0 + CHH > roofZ - 1.5) break
      walls(brick, R, z, c0)
      annulus(brick, IN, R, c0, true)
      walls(shade, IN, c0, c0 + CHH)
      annulus(shade, IN, R, c0 + CHH, false)
      if (R === T2) chans.push(c0)
      z = c0 + CHH
    }
    walls(brick, R, z, topZ - 0.4)
    walls(trim, R, topZ - 0.4, topZ, inset(R, 0.4))
    const P = inset(R, 1.2)
    annulus(trim, P, inset(R, 0.4), topZ, true)
    walls(brick, P.slice().reverse(), roofZ, topZ)
    cap(roof, P, roofZ)
  }
  // the main T, with the lower strip along the north end (lidar 5 m lower)
  const T2: XY[] = [...T.slice(0, 10), [45.9, 49], [-2, 49], [-2, 56.7], T[11]]
  mass(T2, ROOF, TOP)
  mass([[-2, 49], [45.9, 49], [46, 56.6], [-2, 56.7]], G + 27.6 - 1.5, G + 27.6)

  // ---- the arch, on the south face y = -73.2 ----
  const AX = 0.2, AY = -73.2, SPR = G + 18.0
  /** U path (jambs + semicircle) at radius r, from left foot to right foot. */
  const U = (r: number): [number, number][] => {
    const pts: [number, number][] = [[AX - r, 0], [AX - r, SPR]]
    const n = 12
    for (let i = 1; i < n; i++) { const t = Math.PI - (i / n) * Math.PI; pts.push([AX + r * Math.cos(t), SPR + r * Math.sin(t)]) }
    pts.push([AX + r, SPR], [AX + r, 0])
    return pts
  }
  const F = (x: number, z: number, out: number): V3 => [x, AY - out, z]
  /** a U-shaped band between radii r0 < r1 standing `d` proud of the face */
  const ring = (r0: number, r1: number, d: number) => {
    const a = U(r0), b = U(r1)
    for (let i = 0; i < a.length - 1; i++) {
      // front face (facing -y): CCW seen from -y, i.e. x right, z up
      trim.quad(F(a[i][0], a[i][1], d), F(a[i + 1][0], a[i + 1][1], d), F(b[i + 1][0], b[i + 1][1], d), F(b[i][0], b[i][1], d))
      // outer edge (faces away from the arch centre)
      trim.quad(F(b[i][0], b[i][1], d), F(b[i + 1][0], b[i + 1][1], d), F(b[i + 1][0], b[i + 1][1], 0), F(b[i][0], b[i][1], 0))
      // inner edge (faces the centre)
      trim.quad(F(a[i + 1][0], a[i + 1][1], d), F(a[i][0], a[i][1], d), F(a[i][0], a[i][1], 0), F(a[i + 1][0], a[i + 1][1], 0))
    }
  }
  ring(11.6, 13.2, 1.8)
  ring(10.05, 11.6, 1.2)
  ring(8.5, 10.05, 0.6)
  // the shadow each ring casts on the next, as a dark line on its inner edge
  for (const [r, d] of [[11.6, 1.2], [10.05, 0.6]] as const) {
    const a = U(r), b = U(r + 0.35)
    for (let i = 0; i < a.length - 1; i++)
      shade.quad(F(a[i][0], a[i][1], d + 0.02), F(a[i + 1][0], a[i + 1][1], d + 0.02), F(b[i + 1][0], b[i + 1][1], d + 0.02), F(b[i][0], b[i][1], d + 0.02))
  }
  // the glass: the U opening, flat in the facade
  {
    const a = U(8.5), o = 0.06
    // fill: jamb rectangle, then fan over the semicircle
    win.quad(F(AX - 8.5, G, o), F(AX + 8.5, G, o), F(AX + 8.5, SPR, o), F(AX - 8.5, SPR, o))
    for (let i = 1; i < a.length - 2; i++) win.tri(F(AX, SPR, o), F(a[i + 1][0], a[i + 1][1], o), F(a[i][0], a[i][1], o))
    // mullions: four uprights and three transoms, pale and broad
    const m = 0.22, o2 = 0.12
    for (const x of [-5.1, -1.7, 1.7, 5.1]) {
      const h = SPR + Math.sqrt(8.5 * 8.5 - x * x)
      trim.quad(F(AX + x - m, G, o2), F(AX + x + m, G, o2), F(AX + x + m, h, o2), F(AX + x - m, h, o2))
    }
    for (const zz of [G + 5.0, G + 10.5, SPR]) trim.quad(F(AX - 8.5, zz - m, o2), F(AX + 8.5, zz - m, o2), F(AX + 8.5, zz + m, o2), F(AX - 8.5, zz + m, o2))
    const zz = SPR + 5.2, hw = Math.sqrt(8.5 * 8.5 - 5.2 * 5.2)
    trim.quad(F(AX - hw, zz - m, o2), F(AX + hw, zz - m, o2), F(AX + hw, zz + m, o2), F(AX - hw, zz + m, o2))
  }

  // ---- oculi: a glass disc in a pale rim, flat on the wall ----
  const oculus = (a: XY, b: XY, s: number, zc: number, r = 2.25) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
    const Pt = (dx: number, dz: number, o: number): V3 => [a[0] + u[0] * (s + dx) + nn[0] * o, a[1] + u[1] * (s + dx) + nn[1] * o, zc + dz]
    const n = 16
    for (let i = 0; i < n; i++) {
      const t0 = (i / n) * 2 * Math.PI, t1 = ((i + 1) / n) * 2 * Math.PI
      win.tri(Pt(0, 0, 0.06), Pt(r * Math.cos(t0), r * Math.sin(t0), 0.06), Pt(r * Math.cos(t1), r * Math.sin(t1), 0.06))
      const R = r + 0.7
      trim.quad(Pt(r * Math.cos(t0), r * Math.sin(t0), 0.1), Pt(R * Math.cos(t0), R * Math.sin(t0), 0.1), Pt(R * Math.cos(t1), R * Math.sin(t1), 0.1), Pt(r * Math.cos(t1), r * Math.sin(t1), 0.1))
    }
  }
  /** a tall gridded window: a window panel with pale mullions every ~1.9 m */
  const tall = (a: XY, b: XY, s0: number, s1: number, z0: number, z1: number) => {
    // one broad dark panel (the photos' fine glazing grid is too fine to draw)
    panel(win, a, b, s0, s1, z0, z1, 0.06)
  }
  const E = (i: number): [XY, XY] => [T[i], T[(i + 1) % T.length]]
  const len = (i: number) => { const [a, b] = E(i); return Math.hypot(b[0] - a[0], b[1] - a[1]) }

  // arch face (edge 4): oculi and the tall windows either side of the arch
  {
    const [a, b] = E(4), c = AX - a[0]
    for (const sgn of [-1, 1]) {
      oculus(a, b, c + sgn * 15.8, G + 25.4)
      const s = c + sgn * 17.6
      tall(a, b, s - 3.0, s + 3.0, G + 0.4, G + 16.8)
    }
    // the channels run only along the outer 6 m of this face (photo):
    // fill them flush across the middle
    // below the springing there are none at all; two run the full width at
    // the springing (G+19 and G+21)
    for (const c0 of chans) {
      if (c0 < G + 18.3) panel(brick, a, b, 0.4, len(4) - 0.4, c0 - 0.01, c0 + CHH + 0.01, 0.0)
      else if (c0 > G + 21.5) panel(brick, a, b, 6.2, len(4) - 6.2, c0 - 0.01, c0 + CHH + 0.01, 0.0)
    }
  }
  // arch wing sides (edges 1 and 7) and the main block's south faces (0, 8)
  for (const i of [1, 7]) { const [a, b] = E(i), m = len(i) / 2; oculus(a, b, m, G + 22.5); tall(a, b, m - 1.6, m + 1.6, G + 0.4, G + 16.5) }
  for (const i of [0, 8]) { const [a, b] = E(i), m = len(i) / 2; oculus(a, b, m, G + 22.5); tall(a, b, m - 2.0, m + 2.0, G + 0.4, G + 16.5) }
  // long sides (9 east, 11 west) and the north end (10)
  for (const i of [9, 11]) { const [a, b] = E(i), L = len(i); for (const f of [0.25, 0.75]) { oculus(a, b, L * f, G + 22.5); tall(a, b, L * f - 1.6, L * f + 1.6, G + 0.4, G + 16.5) } }
  { const [a, b] = E(10), L = len(10); for (const f of [0.3, 0.7]) oculus(a, b, L * f, G + 22.5) }

  return [
    { part: brick, material: finish('wortham-brick', 0xc4a593) },
    { part: trim, material: finish('wortham-cast-stone', 0xdccbbd) },
    { part: shade, material: finish('wortham-brick-shade', 0x94786a) },
    { part: roof, material: finish('wortham-roof', 0xb9bcbc) },
    { part: win, material: PALETTE.window },
  ]
}

if (import.meta.main) await save('hou-wortham-theater-center', 'Wortham Theater Center', [29.7633673, -95.3656831], 34.8, build())
