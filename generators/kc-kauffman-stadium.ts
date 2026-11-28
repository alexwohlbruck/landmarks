/**
 * Kauffman Stadium, Truman Sports Complex, Kansas City, Missouri (1973,
 * Kivett & Myers; renovated 2007-09): procedural, CC0-1.0.
 * bun generators/kc-kauffman-stadium.ts [out.glb]
 *
 * Map frame: x right, y forward, z up, metres, turned to bearing 47.3, the
 * line from home plate to the crown scoreboard (centre field). Home plate is
 * at (0.4, -32.7) in this frame; the generator works in polar coordinates
 * round it: angle 0 is centre field, positive angles run clockwise (toward
 * right field, the south-east), 180 is behind home plate.
 * Origin: the area centroid of OSM way/1351194912 (leisure=stadium),
 * -94.4805413, 39.0514489.
 *
 * Ground and elevation: y = 0 is the field. The field is 9.4 m below the
 * plaza round the stadium: lidar MO_FEMANRCS_1_2020 reads the grass at
 * 260.6 m and the plaza 128-145 m from home plate at 9.2-10.6 m above it
 * (median 9.4) all the way round. The map's terrain (Mapterhorn,
 * `terrain.ts grid`) does not have the pit: it is flat across the bowl at
 * plaza level, so the catalog elevation is -9.4 (unlike Carter-Finley,
 * whose pit the terrain has). The map fills the bowl to the plaza, so the
 * field-level seats (to 7 m) and the outfield berm and fountain basins
 * (2-8 m) lie under its ground and are left out; nothing facing up is
 * drawn below the plaza.
 *
 * Measured (lidar, 1 m grid, rays every 15 degrees from home plate;
 * 0.5 m grid over the scoreboard; heights above the field):
 *  - home plate: 18.4 m behind the pitcher's mound, which shows as a 0.3 m
 *    bump; the backstop wall 13 m behind it; the centre-field wall 125 m
 *    out (410 ft published);
 *  - the grandstand, from 58 degrees round behind home to the other side:
 *    the face of the club levels 44 m from home behind the plate, 60 m on
 *    the baselines, 96 m at the ends; the upper deck rising from 20 m to
 *    30 m in front of the roof; the roof 41-45 m, its front edge 62 m out
 *    behind home and 80-88 m on the lines, 10-16 m deep; the outer ring
 *    (concourses, ramps) roofed at 30-31 m out to the OSM outline (84-113 m);
 *  - two spiral ramps at (-58.5, -102) and (67, -102): 10.5 m radius, a
 *    3 m core, top 23 m;
 *  - the crown scoreboard: 25 m wide, its top 44 m, the crown's four tips
 *    53.0 m; the front 141 m from home; about 6.5 m deep;
 *  - the light standards behind it: two pairs of columns at (-44, 140),
 *    (-26, 148), (25, 148), (46, 140) from home, light bars at 55 m;
 *  - two light banks on the grandstand roof, about 80 degrees out, top 49.5 m.
 * Published: 37,903 seats; opened 1973; renovated 2007-09, when the
 * 105 ft x 85 ft HD board with its crown went up (Wikipedia "Kauffman
 * Stadium"); the 322 ft "water spectacular" in right-centre field.
 * Estimated: the crown's shape (four tips with balls, three scalloped dips
 * to half its height, 8.2 m tall: k8, k10 scaled to the measured width); the
 * board's V-shaped foot (k10); the club glazing band; the light bars' size
 * (k8, k9); the fountains' rear walls (k4, k9).
 *
 * Photos (evidence):
 *  k1 "Kauffman Stadium 08-31-2013.jpg", Ichabod, CC BY-SA 3.0 (aerial)
 *     https://commons.wikimedia.org/wiki/File:Kauffman_Stadium_08-31-2013.jpg
 *  k4 "Kauffman Stadium (72926816).jpg", Kelly from Parsons, Kansas, CC BY-SA 2.0 (fountains, 2007)
 *     https://commons.wikimedia.org/wiki/File:Kauffman_Stadium_(72926816).jpg
 *  k6 "Kauffman Stadium exterior.jpg", Justin Brockie (Flickr), CC BY 2.0 (the grandstand's back)
 *     https://commons.wikimedia.org/wiki/File:Kauffman_Stadium_exterior.jpg
 *  k7 "Kauffman Stadium - New Video Board.jpg", Vanguard27, public domain (the 2008 board)
 *     https://commons.wikimedia.org/wiki/File:Kauffman_Stadium_-_New_Video_Board.jpg
 *  k8 "Kauffman Stadium Pano 2.JPG", Mr.Konerko, CC BY-SA 4.0 (the gold crown, light standards)
 *     https://commons.wikimedia.org/wiki/File:Kauffman_Stadium_Pano_2.JPG
 *  k9 "Kauffman Fountains pano.JPG", Mr.Konerko, CC BY-SA 4.0 (the grandstand from the fountains)
 *     https://commons.wikimedia.org/wiki/File:Kauffman_Fountains_pano.JPG
 *  k10 "Kauffman Stadium Scoreboard", compujeramey (Flickr), CC BY 2.0 (the crown's outline)
 *     https://www.flickr.com/photos/37171504@N00/14430381546
 * Aerial: USGS NAIP (public domain): plan, ramps, roof colours.
 * Look-only (CC BY-NC-ND, not relied on): ChrisM70's Flickr crown photos.
 *
 * Colours: royal-blue seats, pale concrete, white roofs and light
 * columns, the gold crown, a charcoal board frame and recesses.
 * Left out: the field, the field-level seats, the outfield berm and the
 * fountain basins and water (below the map's ground), the outfield
 * buildings (Hall of Fame, taproom, concourse canopy: OSM's own), signs,
 * flagpoles, the 2009 outfield concourse's small structures.
 * Doubts: the fountains can only show as their rear walls at plaza level,
 * since the basins step down below the map's ground; the crown's tip
 * count is from two photos (k8 by day, k10 at night); the outer facade is
 * drawn as one dark concourse band under a white fascia.
 * Night: the board's screen and the club glazing glow (`window`).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishGlb, writeModel, lathe, triangulate, ccw, extrudeShape, flatShape, prism, capRing, type XY, type Face } from './sea-tacoma-union-station'
import { quadO, triO, box } from './nash-tennessee-state-capitol'

const HX = 0.4, HY = -32.7 // home plate in the placement frame
const PLAZA = 9.4 // the plaza over the field
const DEG = Math.PI / 180

const conc = new Part(), blue = new Part(), shade = new Part(), win = new Part(), gold = new Part(), white = new Part()

/** A point at angle a (degrees clockwise from centre field) and radius r from home plate. */
const pol = (a: number, r: number, z: number): V3 => [HX + r * Math.sin(a * DEG), HY + r * Math.cos(a * DEG), z]
/** Home-plate-centred (x, y) to the placement frame. */
const H = (x: number, y: number, z: number): V3 => [HX + x, HY + y, z]

function lut(t: number[][], x: number, col: number) {
  if (x <= t[0][0]) return t[0][col]
  for (let i = 1; i < t.length; i++) if (x <= t[i][0]) {
    const f = (x - t[i - 1][0]) / (t[i][0] - t[i - 1][0])
    return t[i - 1][col] + (t[i][col] - t[i - 1][col]) * f
  }
  return t[t.length - 1][col]
}
// The grandstand's section by |angle| (lidar): club face radius, roof front and back radius,
// roof height, outer ring radius and height
//            |a|  Rlb  R0   R1  Zroof  Ro   Zo
const SEC = [
  [58, 96, 104, 108, 24, 113, 22],
  [64, 92, 100, 104, 27, 112, 23],
  [72, 76, 88, 95, 38, 108, 24],
  [80, 68, 84, 91, 40, 104, 25],
  [90, 60, 80, 88, 41, 99, 26],
  [105, 52, 66, 84, 44, 93, 30],
  [120, 48, 63, 80, 45, 86, 30],
  [135, 44, 62, 78, 45, 84, 31],
  [150, 44, 62, 76, 45, 98, 30],
  [165, 44, 62, 75, 45, 102, 30],
  [180, 44, 62, 74, 45, 103, 31],
]
const ROOF_FROM = 70 // the roof runs round from here (|a|)
type Sec = { a: number; Rlb: number; R0: number; R1: number; Zr: number; Ro: number; Zo: number; roof: boolean }
function sec(a: number): Sec {
  const f = Math.abs(((a + 540) % 360) - 180) // |a| folded to 0..180
  const g = (c: number) => lut(SEC, f, c)
  return { a, Rlb: g(1), R0: g(2), R1: g(3), Zr: g(4), Ro: g(5), Zo: g(6), roof: f >= ROOF_FROM - 1e-6 }
}

const CLUB0 = PLAZA + 0.8, CLUB1 = 15.4, FRONT = 19.5 // the club glazing and the upper deck's front

/** The rake's top end: under the roof's back where there is a roof, else the stand's top. */
const rakeEnd = (s: Sec): [number, number] => (s.roof ? [s.R1 - 1, s.Zr - 3] : [s.R1, s.Zr])
/** Where the back of the upper deck meets the outer ring's roof. */
const backFoot = (s: Sec) => (s.roof ? s.R1 - 0.35 * (s.Zr - 1 - s.Zo) : s.R1)

function grandstand() {
  const ts = [58, 62, 66, 70]
  for (let t = 75; t < 290; t += 5) ts.push(t)
  ts.push(290, 294, 298, 302)
  const ss = ts.map(sec)
  for (let k = 0; k + 1 < ss.length; k++) {
    const A = ss[k], B = ss[k + 1]
    const am = ((A.a + B.a) / 2) * DEG, out: V3 = [Math.sin(am), Math.cos(am), 0], inn: V3 = [-out[0], -out[1], 0]
    const q = (p: Part, ra: number, za: number, rb: number, zb: number, ra2: number, za2: number, rb2: number, zb2: number, hint: V3) =>
      quadO(p, pol(A.a, ra, za), pol(B.a, rb, zb), pol(B.a, rb2, zb2), pol(A.a, ra2, za2), hint)
    // the club levels' face: a glazed band under the upper deck's fascia
    q(conc, A.Rlb, 0, B.Rlb, 0, A.Rlb, CLUB0, B.Rlb, CLUB0, inn)
    q(win, A.Rlb, CLUB0, B.Rlb, CLUB0, A.Rlb, CLUB1, B.Rlb, CLUB1, inn)
    q(conc, A.Rlb, CLUB1, B.Rlb, CLUB1, A.Rlb, FRONT, B.Rlb, FRONT, inn)
    // the upper deck's blue rake
    const [ra, za] = rakeEnd(A), [rb, zb] = rakeEnd(B)
    q(blue, A.Rlb, FRONT, B.Rlb, FRONT, ra, za, rb, zb, [inn[0], inn[1], 1.5])
    const roof = A.roof && B.roof
    if (roof) {
      // the roof: white top, white fascia, a dark underside
      q(white, A.R0, A.Zr, B.R0, B.Zr, A.R1, A.Zr - 1, B.R1, B.Zr - 1, [0, 0, 1])
      q(white, A.R0, A.Zr - 1.8, B.R0, B.Zr - 1.8, A.R0, A.Zr, B.R0, B.Zr, inn)
      q(shade, A.R0, A.Zr - 1.8, B.R0, B.Zr - 1.8, ra, A.Zr - 1.8, rb, B.Zr - 1.8, [0, 0, -1])
      q(shade, ra, za, rb, zb, ra, A.Zr - 1.8, rb, B.Zr - 1.8, inn)
      // the upper deck's underside, seen from outside over the outer ring (k6)
      q(conc, A.R1, A.Zr - 1, B.R1, B.Zr - 1, backFoot(A), A.Zo, backFoot(B), B.Zo, [out[0], out[1], -0.6])
    } else {
      const ha = Math.max(A.Zr, A.Zo), hb = Math.max(B.Zr, B.Zo)
      q(conc, ra, za, rb, zb, ra, ha + 0.8, rb, hb + 0.8, inn)
      q(conc, ra, ha + 0.8, rb, hb + 0.8, ra + 0.8, ha + 0.8, rb + 0.8, hb + 0.8, [0, 0, 1])
      q(conc, ra + 0.8, A.Zo, rb + 0.8, B.Zo, ra + 0.8, ha + 0.8, rb + 0.8, hb + 0.8, out)
    }
    // the outer ring: a white roof over a dark concourse band
    const fa = roof ? backFoot(A) : A.R1 + 0.8, fb = roof ? backFoot(B) : B.R1 + 0.8
    q(white, fa, A.Zo, fb, B.Zo, A.Ro, A.Zo, B.Ro, B.Zo, [0, 0, 1])
    q(conc, A.Ro, 0, B.Ro, 0, A.Ro, PLAZA + 3.5, B.Ro, PLAZA + 3.5, out)
    q(shade, A.Ro, PLAZA + 3.5, B.Ro, PLAZA + 3.5, A.Ro, A.Zo - 2.2, B.Ro, B.Zo - 2.2, out)
    q(white, A.Ro, A.Zo - 2.2, B.Ro, B.Zo - 2.2, A.Ro, A.Zo, B.Ro, B.Zo, out)
  }
  // the two ends of the stand: a section wall each
  for (const [s, side] of [[ss[0], -1], [ss[ss.length - 1], 1]] as const) {
    const [re, ze] = rakeEnd(s)
    const poly: XY[] = [[s.Rlb, 0], [s.Ro, 0], [s.Ro, s.Zo], [re + 0.8, s.Zo], [re + 0.8, ze + 0.8], [re, ze + 0.8], [re, ze], [s.Rlb, FRONT]]
    const tn: V3 = [Math.cos(s.a * DEG) * side, -Math.sin(s.a * DEG) * side, 0]
    // tn points out of the stand: toward smaller angles at the first end, larger at the last
    const n = tn, P = ccw(poly)
    for (const [i, j, l] of triangulate(P)) {
      triO(conc, pol(s.a, P[i][0], P[i][1]), pol(s.a, P[j][0], P[j][1]), pol(s.a, P[l][0], P[l][1]), n)
    }
  }
  // where the roof stops: close its slab and the space under it
  for (const t of [70, 290]) {
    const s = sec(t), side = t < 180 ? -1 : 1
    const n: V3 = [Math.cos(t * DEG) * side, -Math.sin(t * DEG) * side, 0]
    const [re, ze] = rakeEnd(s)
    quadO(white, pol(t, s.R0, s.Zr - 1.8), pol(t, s.R0, s.Zr), pol(t, s.R1, s.Zr - 1), pol(t, re, s.Zr - 1.8), n)
    quadO(shade, pol(t, re, ze), pol(t, re, s.Zr - 1.8), pol(t, s.R1, s.Zr - 1), pol(t, s.R1, ze), n)
  }
}

/** The two spiral ramps on the plaza (1973): parapet bands over open ramps round a core. */
function ramps() {
  const S = 12, R = 10.5, RI = 9.7, CORE = 3, TOP = 23
  const bands: [number, number][] = [[0, PLAZA + 1.8], [PLAZA + 3.6, PLAZA + 4.8], [PLAZA + 7.2, PLAZA + 8.4], [PLAZA + 10.8, PLAZA + 12], [TOP - 1.1, TOP]]
  for (const [x, y] of [[-58.5, -102], [67, -102]] as const) {
    for (const [z0, z1] of bands) {
      lathe(conc, x, y, [[R, z0], [R, z1]], S)
      if (z1 < TOP) lathe(conc, x, y, [[R, z1], [RI, z1]], S)
    }
    lathe(shade, x, y, [[RI, PLAZA], [RI, TOP]], S)
    lathe(white, x, y, [[R, TOP], [CORE, TOP]], S)
    lathe(shade, x, y, [[CORE, TOP], [CORE, PLAZA]], S)
  }
}

/** A box round the segment a-b (plan), hw either side, z0..z1. */
function obox(p: Part, a: XY, b: XY, hw: number, z0: number, z1: number, top: Part | null = p) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [-u[1] * hw, u[0] * hw]
  const r = ccw([[a[0] + n[0], a[1] + n[1]], [b[0] + n[0], b[1] + n[1]], [b[0] - n[0], b[1] - n[1]], [a[0] - n[0], a[1] - n[1]]])
  prism(p, top, r, z0, z1)
  capRing(p, r, z0, false)
}

// The crown scoreboard (2008): 25 m wide, its top 44 m, the crown's tips 53 m
const BX = 1.2, BY = 107.8, BW = 12.5, BD = 6.5, BTOP = 44, BFOOT = 16, BV = 12.4, CTIP = 52.4, BALL = 0.65

function scoreboard() {
  // the board: a charcoal box with a V-shaped foot, its screen to the field
  box(shade, BX - BW, BY, BX + BW, BY + BD, BFOOT, BTOP, shade, 0.3)
  const front: Face = { o: [BX, BY, 0], n: [0, -1] } // s runs along +x
  const back: Face = { o: [BX, BY + BD, 0], n: [0, 1] } // s runs along -x
  const foot: XY[] = [[-BW, BFOOT], [0, BV], [BW, BFOOT]]
  for (const [f, sgn] of [[front, 1], [back, -1]] as const) flatShape(shade, f, foot.map(([s, z]) => [s * sgn, z] as XY), 0)
  for (const [a, b] of [[foot[0], foot[1]], [foot[1], foot[2]]]) {
    const A0 = [BX + a[0], BY, a[1]] as V3, B0 = [BX + b[0], BY, b[1]] as V3
    quadO(shade, A0, B0, [B0[0], BY + BD, B0[2]], [A0[0], BY + BD, A0[2]], [0, 0, -1])
  }
  const m = 1.1
  flatShape(win, front, [[-BW + m, BTOP - m], [-BW + m, BFOOT + 0.6], [0, BV + 1.4], [BW - m, BFOOT + 0.6], [BW - m, BTOP - m]], 0.06)
  // the pedestal under it, on the berm (k4, k7)
  box(shade, BX - 5, BY + 1, BX + 5, BY + 5.5, 0, BV + 0.5, shade)
  // the gold crown: four tips joined by three semicircular scallops (k8, k10)
  const tips = [-BW, -BW / 3, BW / 3, BW], rs = (tips[1] - tips[0]) / 2
  const crown: XY[] = [[-BW, BTOP], [BW, BTOP]]
  for (let i = tips.length - 1; i >= 1; i--) {
    const c = (tips[i] + tips[i - 1]) / 2
    for (let k = 0; k <= 10; k++) {
      const t = (k / 10) * Math.PI // from the right tip, down through the dip, up to the left tip
      crown.push([c + rs * Math.cos(t), CTIP - rs * Math.sin(t)])
    }
  }
  const P = ccw(crown.filter((p, i, a) => i === 0 || Math.hypot(p[0] - a[i - 1][0], p[1] - a[i - 1][1]) > 1e-6))
  extrudeShape(gold, front, P, 1.6, 0)
  flatShape(gold, { o: [BX, BY + 1.6, 0], n: [0, 1] }, P.map(([s, z]) => [-s, z] as XY), 0)
  // a ball on each tip
  for (const s of tips) {
    const prof: [number, number][] = []
    for (let k = 0; k <= 4; k++) { const t = -Math.PI / 2 + (k / 4) * Math.PI; prof.push([Math.max(BALL * Math.cos(t), 0), CTIP + BALL * 0.6 + BALL * Math.sin(t)]) }
    lathe(gold, BX + s * (Math.abs(s) === BW ? 0.97 : 1), BY + 0.8, prof, 8)
  }
}

/** The light standards behind the board: column pairs under light bars (k8). */
function lightStandards() {
  for (const [a, b] of [[[-44, 140], [-26, 148]], [[25, 148], [46, 140]]] as [XY, XY][]) {
    for (const [x, y] of [a, b]) box(white, HX + x - 0.75, HY + y - 0.75, HX + x + 0.75, HY + y + 0.75, 0, 52, white)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    obox(white, [HX + a[0] - u[0] * 2.5, HY + a[1] - u[1] * 2.5], [HX + b[0] + u[0] * 2.5, HY + b[1] + u[1] * 2.5], 0.9, 51.5, 55.4)
  }
  // the grandstand roof's two light banks (k9)
  for (const t of [80, 280]) {
    const s = sec(t), r = s.R0 + 2
    obox(white, (pol(t - 6.5, r, 0) as number[]).slice(0, 2) as XY, (pol(t + 6.5, r, 0) as number[]).slice(0, 2) as XY, 0.8, s.Zr + 1.6, s.Zr + 5.2)
    for (const d of [-4, 4]) { const p = pol(t + d, r, 0); box(white, p[0] - 0.4, p[1] - 0.4, p[0] + 0.4, p[1] + 0.4, s.Zr - 1.5, s.Zr + 1.6, null) }
  }
}

/** The water spectacular's rear walls at the plaza (k4, k9): the basins below them are under the map's ground. */
function fountains() {
  const walls: [number, number][] = [[10, 16], [17, 23], [24, 30], [31, 37], [38, 44], [-16, -10], [-23, -17], [-29, -24]]
  for (const [a0, a1] of walls) {
    const r0 = 138.5, r1 = 140.5, z1 = 12.3 // a parapet 1.5 m over the centre-field concourse (10.6-11 m, lidar)
    for (let a = a0; a < a1 - 1e-6; a += 3) {
      const b = Math.min(a + 3, a1)
      quadO(shade, pol(a, r0, 0), pol(b, r0, 0), pol(b, r0, z1), pol(a, r0, z1), [-Math.sin(((a + b) / 2) * DEG), -Math.cos(((a + b) / 2) * DEG), 0])
      quadO(shade, pol(a, r1, 0), pol(b, r1, 0), pol(b, r1, z1), pol(a, r1, z1), [Math.sin(((a + b) / 2) * DEG), Math.cos(((a + b) / 2) * DEG), 0])
      quadO(conc, pol(a, r0, z1), pol(b, r0, z1), pol(b, r1, z1), pol(a, r1, z1), [0, 0, 1])
    }
    for (const [a, sg] of [[a0, -1], [a1, 1]] as const) {
      const n: V3 = [Math.cos(a * DEG) * sg, -Math.sin(a * DEG) * sg, 0]
      quadO(shade, pol(a, r0, 0), pol(a, r1, 0), pol(a, r1, z1), pol(a, r0, z1), n)
    }
  }
}

function build() {
  grandstand()
  ramps()
  scoreboard()
  lightStandards()
  fountains()
  return finishGlb('Kauffman Stadium', [
    { part: conc, material: finish('ks-concrete', 0xddd8cf) },
    { part: white, material: PALETTE.trim },
    { part: blue, material: finish('ks-seats', 0x4f74a8) },
    { part: shade, material: finish('ks-charcoal', 0x585d65) },
    { part: gold, material: finish('ks-crown-gold', 0xcaa652) },
    { part: win, material: PALETTE.window },
  ], { bearing: 47.3, height: 55.4, elevation: -PLAZA, replaces: ['relation/12661405'] }, 6500)
}

if (import.meta.main) await writeModel('kc-kauffman-stadium', build())
