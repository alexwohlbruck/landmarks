/**
 * GEHA Field at Arrowhead Stadium, Truman Sports Complex, Kansas City,
 * Missouri (1972, Kivett & Myers; renovated 2007-10): procedural, CC0-1.0.
 * bun generators/kc-arrowhead-stadium.ts [out.glb]
 *
 * Map frame: x right, y forward, z up, metres, turned to bearing 137.5, the
 * field's long axis (the principal axis of the lidar field floor): +y is
 * the south-east end zone, -y the north-west end zone, +x the south-west
 * sideline with the press box block, -x the north-east sideline.
 * Origin: the area centroid of OSM way/65960012 (the outer ring of
 * relation/4587811, building=stadium), -94.4840276, 39.0489163. The field
 * centre is at (-3.7, 1.0) in this frame; the generator works round it.
 *
 * Ground and elevation: y = 0 is the field. The field sits 12.5 m below
 * the parking plaza round the stadium: lidar MO_FEMANRCS_1_2020 reads the
 * turf at 256.7 m (median of first returns over the field) and the plaza
 * ring 150-165 m out at 269.25 m (268.6-271.1). The map's terrain
 * (Mapterhorn, `terrain.ts grid`) does NOT show the pit: the field isn't
 * classed as ground, so the bare earth is interpolated across the bowl at
 * plaza level. Unlike Carter-Finley the catalog elevation is therefore
 * -12.5. As at Nissan Stadium and Providence Park, the map fills the bowl
 * to the street and draws its ground there, so the lower bowl and the club
 * tier (field to 12.5 m) are the map's and are left out: nothing facing up
 * is drawn below the street; the inner club wall runs down to y = 0, out
 * of sight.
 *
 * Measured (lidar, 1 m grid, rays every 7.5 degrees from the field centre;
 * heights above the field):
 *  - field floor a rounded rectangle +-39 x +-64 m; the lower bowl's back
 *    (8 m) 66 m out at the sides, 87 m at the ends, 80 m on the diagonals;
 *  - the upper deck: its front (fascia top) at 20 m just behind that, its
 *    rim 100 m out at the sides at 40-43 m, rising to 45-47 m at the four
 *    corners (123 m out on the diagonals: the plan is a rounded square
 *    round an oval bowl) and dipping to 26-28 m over the end zones, where
 *    the upper deck is only a dozen rows: the scalloped "saddle" rim;
 *  - the concourse ring behind and under the rake: roof 20.7 m at the ends
 *    (a flat deck 104-112 m out), about 27 m at the sides, to the OSM
 *    outline (115-131 m out);
 *  - the press box block on the SW rim: 24 x 132 m in plan, roof 55 m;
 *  - four spiral ramp towers at the corners, centres (+-103.5, +-85.5) from
 *    the field centre, outer radius 16 m, a 5 m open core, top about 12 m
 *    over the plaza;
 *  - the SE video board: an oval about 28 m wide, top 45 m, with a black
 *    speaker box on top to 52.8 m; the NW board about 48 m wide with its
 *    top at 40 m and no box (2020 flight);
 *  - light banks over the four corners, tops about 55 m.
 * Published: 76,416 seats (Wikipedia "Arrowhead Stadium", OSM capacity);
 * opened 1972; the 2007-10 renovation added the press box/suite block and
 * the video boards.
 * Estimated: the club glazing band (12.5-16 m) and the fascia (16-20 m)
 * from photos a6, a7; the board heights (oval 2.5:1 from a7, a8); the
 * press box glazing bands; the light-bank panels (a2, a6, a9); the rakers'
 * spacing (one every 9 m) from a2.
 *
 * Photos (evidence):
 *  a1 "Aerial view of Arrowhead Stadium 08-31-2013 crop.jpg", Ichabod, CC BY-SA 4.0
 *     https://commons.wikimedia.org/wiki/File:Aerial_view_of_Arrowhead_Stadium_08-31-2013_crop.jpg
 *  a2 "Arrowhead Stadium exterior.jpg", Justin Brockie (Flickr), CC BY 2.0 (the raked back on its brackets)
 *     https://commons.wikimedia.org/wiki/File:Arrowhead_Stadium_exterior.jpg
 *  a4 "Arrowhead Stadium, Kansas City, Missouri, US.jpg", Ichabod, CC BY-SA 3.0 (aerial from the west)
 *     https://commons.wikimedia.org/wiki/File:Arrowhead_Stadium,_Kansas_City,_Missouri,_US.jpg
 *  a6 "Arrowhead world cup prep, May 2025.jpg", PCN02WPS, CC BY-SA 4.0 (the NE rim and light banks)
 *     https://commons.wikimedia.org/wiki/File:Arrowhead_world_cup_prep,_May_2025.jpg
 *  a7 "Arrowhead Stadium for Chiefs vs Chargers 10-22-2023 (1) (53283857054).jpg", Larry Koester, CC BY 2.0 (the SE board)
 *     https://commons.wikimedia.org/wiki/File:Arrowhead_Stadium_for_Chiefs_vs_Chargers_10-22-2023_(1)_(53283857054).jpg
 *  a8 "Arrowhead Stadium for Chiefs vs Chargers 10-22-2023 (10) (53283485226).jpg", Larry Koester, CC BY 2.0
 *     https://commons.wikimedia.org/wiki/File:Arrowhead_Stadium_for_Chiefs_vs_Chargers_10-22-2023_(10)_(53283485226).jpg
 *  a9 "Netherlands vs Tunisia - 2026 FIFA World Cup, Kansas City.jpg", CNC33, CC BY 4.0 (the press box from the NE)
 *     https://commons.wikimedia.org/wiki/File:Netherlands_vs_Tunisia_-_2026_FIFA_World_Cup,_Kansas_City.jpg
 * Aerial: USGS NAIP (public domain): plan, ramps, roof colours.
 *
 * Colours (daylight photos, pulled to the palette): red seats, pale warm
 * concrete, the upper deck's underside in shade, a charcoal fascia, board
 * frames and speaker box; slate glazing.
 * Left out: the field, the lower bowl and club tier (below the street, the
 * map's ground), the gate canopies (OSM building=roof, the map's), seats'
 * rows and aisles, the ribbon boards, lettering, the flagpoles.
 * Doubts: the NW board's size and form are from the 2020 lidar only (no
 * licensed photo shows it head on); the press box's outer facade is drawn
 * from aerials only; the concourse levels behind the rakers are drawn as
 * one dark band.
 * Night: the club glazing, the press box glazing and the board screens
 * glow (`window`).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishGlb, writeModel, lathe, type Face } from './sea-tacoma-union-station'
import { quadO, triO, box, panel } from './nash-tennessee-state-capitol'

const FX = -3.7, FY = 1.0 // the field centre in the placement frame
const STREET = 12.5 // the plaza over the field
const N = 80 // segments round the bowl (4.5 degrees: the corners fall on samples)

const conc = new Part(), red = new Part(), dark = new Part(), win = new Part(), shade = new Part()

/** Field-centred (x, y, z) to the placement frame. */
const P = (x: number, y: number, z: number): V3 => [x + FX, y + FY, z]
/** A point at polar angle th (from +y toward +x) and radius r. */
const pol = (th: number, r: number, z: number): V3 => P(r * Math.sin(th), r * Math.cos(th), z)

/** Linear interpolation in a table of [x, y] sorted by x. */
function lut(t: [number, number][], x: number) {
  if (x <= t[0][0]) return t[0][1]
  for (let i = 1; i < t.length; i++) if (x <= t[i][0]) {
    const [x0, y0] = t[i - 1], [x1, y1] = t[i]
    return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0)
  }
  return t[t.length - 1][1]
}
/** The angle from the nearest end of the long axis, 0 (end) .. 90 (side). */
const fold = (thDeg: number) => { const a = ((thDeg % 180) + 180) % 180; return a <= 90 ? a : 180 - a }
/** A superellipse's radius along polar angle th. */
const se = (W: number, L: number, p: number, th: number) => 1 / ((Math.abs(Math.sin(th)) / W) ** p + (Math.abs(Math.cos(th)) / L) ** p) ** (1 / p)

// Rim of the upper deck (lidar): radius and height by angle from the end
const RIM_R: [number, number][] = [[0, 103], [15, 105], [22.5, 108], [30, 111], [37.5, 117], [45, 123], [52.5, 116], [60, 106], [67.5, 102], [75, 100], [90, 100]]
const RIM_H: [number, number][] = [[0, 27], [15, 28.5], [22.5, 32], [30, 34], [37.5, 39], [45, 46], [52.5, 43], [60, 40.5], [75, 40.5], [90, 41]]
// The concourse ring's roof
const OUT_H: [number, number][] = [[0, 20.7], [30, 21.5], [45, 23.5], [60, 25], [90, 25]]
// The OSM outline from the field centre, every 15 degrees (0 = SE end, 90 = SW side)
const OUTLINE = [124, 123, 124, 123, 130, 130, 127, 130, 131, 124, 126, 125, 126, 125, 125, 124, 124, 117, 115, 118, 124, 122, 124, 123]
const outline = (thDeg: number) => {
  const a = (((thDeg % 360) + 360) % 360) / 15, i = Math.floor(a), f = a - i
  return OUTLINE[i % 24] * (1 - f) + OUTLINE[(i + 1) % 24] * f
}

type Ring = { th: number; R1: number; R2: number; Rc: number; R3: number; H3: number; Rs: number; R4: number; HO: number }
function ring(k: number): Ring {
  const th = (2 * Math.PI * k) / N, deg = (360 * k) / N, phi = fold(deg)
  const R1 = se(66, 87, 2.6, th) // the lower bowl's back (8 m, below the street)
  const R2 = R1 + 2 // the upper deck's fascia
  const Rc = R1 + 3.5 // the club glazing, under the overhang
  const R3 = lut(RIM_R, phi), H3 = lut(RIM_H, phi)
  const HO = lut(OUT_H, phi)
  const slope = (H3 - 20) / (R3 - R2)
  // the underside runs parallel to the rake, 1 m under the rim, down to the concourse roof
  const Rs = Math.max(R2 + 6, R3 + 0.8 - (H3 - 1 - HO) / slope)
  const R4 = Math.max(outline(deg), Rs + 2)
  return { th, R1, R2, Rc, R3, H3, Rs, R4, HO }
}

const yellow = new Part()
const CLUB0 = STREET + 1.2, CLUB1 = 16.5, SLOT = 17.4, FRONT = 20 // the club tier under the upper deck's front

function bowl() {
  const rs = Array.from({ length: N }, (_, k) => ring(k))
  for (let k = 0; k < N; k++) {
    const A = rs[k], B = rs[(k + 1) % N]
    const out: V3 = [Math.sin((A.th + B.th) / 2), Math.cos((A.th + B.th) / 2), 0]
    const inn: V3 = [-out[0], -out[1], 0]
    const q = (p: Part, ra: number, za: number, rb: number, zb: number, ra2: number, za2: number, rb2: number, zb2: number, hint: V3) =>
      quadO(p, pol(A.th, ra, za), pol(B.th, rb, zb), pol(B.th, rb2, zb2), pol(A.th, ra2, za2), hint)
    // the club seats under the overhang (yellow), the club glazing behind them, the overhang's soffit
    q(yellow, A.R1 - 1.5, CLUB0, B.R1 - 1.5, CLUB0, A.R1 + 5, CLUB1, B.R1 + 5, CLUB1, [inn[0], inn[1], 2])
    q(win, A.R1 + 5, CLUB1, B.R1 + 5, CLUB1, A.R1 + 5, SLOT, B.R1 + 5, SLOT, inn)
    q(shade, A.R1 + 5, SLOT, B.R1 + 5, SLOT, A.R1, SLOT, B.R1, SLOT, [0, 0, -1])
    // the upper deck: charcoal fascia, the red rake, the rim parapet
    q(dark, A.R1, SLOT, B.R1, SLOT, A.R1, FRONT, B.R1, FRONT, inn)
    q(red, A.R1, FRONT, B.R1, FRONT, A.R3, A.H3, B.R3, B.H3, [inn[0], inn[1], 1.5])
    q(conc, A.R3, A.H3, B.R3, B.H3, A.R3, A.H3 + 1.2, B.R3, B.H3 + 1.2, inn)
    q(conc, A.R3, A.H3 + 1.2, B.R3, B.H3 + 1.2, A.R3 + 0.8, A.H3 + 1.2, B.R3 + 0.8, B.H3 + 1.2, [0, 0, 1])
    q(conc, A.R3 + 0.8, A.H3 - 1, B.R3 + 0.8, B.H3 - 1, A.R3 + 0.8, A.H3 + 1.2, B.R3 + 0.8, B.H3 + 1.2, out)
    // the rake's underside, seen from outside, down to the concourse roof
    q(conc, A.R3 + 0.8, A.H3 - 1, B.R3 + 0.8, B.H3 - 1, A.Rs, A.HO, B.Rs, B.HO, [out[0], out[1], -1])
    // the concourse ring: its roof and outer wall (a dark band of open concourses)
    q(conc, A.Rs, A.HO, B.Rs, B.HO, A.R4, A.HO, B.R4, B.HO, [0, 0, 1])
    q(conc, A.R4, 0, B.R4, 0, A.R4, STREET + 0.8, B.R4, STREET + 0.8, out)
    q(shade, A.R4, STREET + 0.8, B.R4, STREET + 0.8, A.R4, A.HO - 1.6, B.R4, B.HO - 1.6, out)
    q(conc, A.R4, A.HO - 1.6, B.R4, B.HO - 1.6, A.R4, A.HO, B.R4, B.HO, out)
    // the inner wall of the club tier, down to the field (below the street: out of sight)
    q(conc, A.R1 - 1.5, 0, B.R1 - 1.5, 0, A.R1 - 1.5, CLUB0, B.R1 - 1.5, CLUB0, inn)
    // the rakers (a2): a curved bracket every second segment, from a foot on the plaza
    // out past the concourse wall, up under the rim and back along the rake's underside
    if (k % 2 === 0) {
      const th = A.th, t: V3 = [Math.cos(th), -Math.sin(th), 0], w = 0.45, sl = (A.H3 - 20) / (A.R3 - A.R2)
      const sz = (r: number) => A.H3 - 1 - (A.R3 + 0.8 - r) * sl
      const ri = Math.max(A.Rs + 1, A.R3 - 7), ro = A.R4 + 1.8
      const poly: [number, number][] = [[ro, STREET], [A.R4 - 0.5, STREET], [A.R4 - 0.5, A.HO], [ri, A.HO], [ri, sz(ri)], [A.R3 + 0.6, A.H3 - 1.2],
        [A.R3 + 0.6 + (ro - A.R3) * 0.45, STREET + (A.H3 - 1.2 - STREET) * 0.72], [ro - 0.6, STREET + (A.H3 - STREET) * 0.3]]
      const v = (p: [number, number], s: number): V3 => { const q = pol(th, p[0], p[1]); return [q[0] + t[0] * w * s, q[1] + t[1] * w * s, q[2]] }
      for (let i = 1; i + 1 < poly.length; i++) {
        triO(conc, v(poly[0], 1), v(poly[i], 1), v(poly[i + 1], 1), t)
        triO(conc, v(poly[0], -1), v(poly[i], -1), v(poly[i + 1], -1), [-t[0], -t[1], 0])
      }
      for (const i of [3, 5, 6, 7]) { // the edges that show: the rest lie on the plaza, in the concourse or on the soffit
        const p = poly[i], n = poly[(i + 1) % poly.length], nr = n[1] - p[1], nz = -(n[0] - p[0])
        // the edge faces away from the polygon's inside (the polygon runs clockwise in (r, z))
        const e: V3 = [out[0] * nr, out[1] * nr, nz]
        quadO(conc, v(p, -1), v(n, -1), v(n, 1), v(p, 1), [-e[0], -e[1], -e[2]])
      }
    }
  }
}

/** An axis-aligned box in field-centred coordinates. */
const fbox = (p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top: Part | null = p, bevel = 0) =>
  box(p, x0 + FX, y0 + FY, x1 + FX, y1 + FY, z0, z1, top, bevel)

/** The press box and suite block on the south-west rim (2010). */
function pressBox() {
  const X0 = 99, X1 = 121, Y0 = -61, Y1 = 63, Z0 = 33, Z1 = 55
  fbox(conc, X0, Y0, X1, Y1, Z0, Z1, conc, 1.2)
  // the recessed storeys under it, on columns
  fbox(shade, X0 + 2.5, Y0 + 3, X1 - 2.5, Y1 - 3, 20, Z0, null)
  for (let y = Y0 + 6; y <= Y1 - 5; y += 14.4) fbox(conc, X1 - 2.2, y - 0.8, X1 - 0.6, y + 0.8, STREET, Z0, null)
  // glazing: three suite and press levels to the field (a9), two bands outside (a1)
  const L = Y1 - Y0
  const ff: Face = { o: [X0 + FX, Y1 + FY, 0], n: [-1, 0] }
  for (const [z0, z1] of [[35, 39.2], [41, 45.2], [47.4, 51.8]]) panel(win, ff, L / 2, L - 5, z0, z1, 0.06)
  panel(dark, ff, L / 2, L - 2.4, 53, 54.2, 0.06)
  const of: Face = { o: [X1 + FX, Y0 + FY, 0], n: [1, 0] }
  for (const [z0, z1] of [[36.5, 40], [45, 50.5]]) panel(win, of, L / 2, L - 6, z0, z1, 0.06)
  // plant on the roof
  for (const y of [-40, -12, 18, 44]) fbox(conc, X0 + 9, y - 3, X0 + 15, y + 3, Z1, Z1 + 2.2, conc)
}

/** The four spiral ramp towers at the corners (1972): open ramps between parapet bands. */
function ramps() {
  const S = 12, R = 16, RI = 15.1, CORE = 5
  const bands: [number, number][] = [[0, STREET + 1.2], [STREET + 3.4, STREET + 4.6], [STREET + 6.8, STREET + 8], [STREET + 10.2, STREET + 11.2]]
  const TOP = STREET + 11.2
  for (const [cx, cy] of [[104.2, -84.3], [103.2, 86.7], [-102.8, -86.3], [-103.8, 84.6]] as const) {
    const x = cx + FX, y = cy + FY
    for (const [z0, z1] of bands) {
      lathe(conc, x, y, [[R, z0], [R, z1]], S)
      if (z1 < TOP) lathe(conc, x, y, [[R, z1], [RI, z1]], S)
    }
    lathe(shade, x, y, [[RI, STREET], [RI, TOP]], S)
    lathe(conc, x, y, [[R, TOP], [CORE, TOP]], S)
    lathe(shade, x, y, [[CORE, TOP], [CORE, STREET]], S)
  }
}

/** An oval video board: a charcoal elliptical slab, its screen on the field side. */
function board(cx: number, cy: number, face: 1 | -1, a: number, b: number, zc: number, depth: number) {
  const M = 20, pts: [number, number][] = []
  for (let i = 0; i < M; i++) { const t = (2 * Math.PI * i) / M; pts.push([a * Math.cos(t), b * Math.sin(t)]) }
  const y0 = cy - depth / 2, y1 = cy + depth / 2
  const at = (p: [number, number], y: number, s = 1): V3 => P(cx + p[0] * s, y, zc + p[1] * s)
  for (let i = 0; i < M; i++) {
    const p = pts[i], q = pts[(i + 1) % M], o: V3 = [(p[0] + q[0]) / a ** 2, 0, (p[1] + q[1]) / b ** 2]
    quadO(dark, at(p, y0), at(q, y0), at(q, y1), at(p, y1), o)
    triO(dark, at([0, 0], y0), at(p, y0), at(q, y0), [0, -1, 0])
    triO(dark, at([0, 0], y1), at(p, y1), at(q, y1), [0, 1, 0])
    const ys = face > 0 ? y1 + 0.06 : y0 - 0.06
    triO(win, at([0, 0], ys), at(p, ys, 0.86), at(q, ys, 0.86), [0, face, 0])
  }
}

function boards() {
  // south-east: 28 m oval to 45 m, a black speaker box on top to 52.8 m, on a pylon from the end concourse
  board(0, 104.2, -1, 14, 5.5, 39.5, 2.4)
  fbox(dark, -4.2, 102.2, 4.2, 107, 45, 52.8, dark, 0.3)
  fbox(dark, -1.6, 104.2, 1.6, 107.4, 20.7, 34.5, null)
  // north-west: a wider oval to 40 m over the top rows (2020 lidar)
  board(0.5, -97.2, 1, 23, 6.5, 33.5, 2.4)
  for (const x of [-11, 12]) fbox(dark, x - 1.2, -98.6, x + 1.2, -96, 20.7, 27.5, null)
}

/** The light banks over the north-east rim (a2, a6). */
function lights() {
  for (const yc of [-36.5, 38.5]) {
    fbox(dark, -97.6, yc - 11, -96.4, yc + 11, 50, 54.4, dark, 0.2)
    for (const dy of [-7, 7]) fbox(dark, -97.4, yc + dy - 0.45, -96.6, yc + dy + 0.45, 40, 50, null)
  }
}

function build() {
  bowl()
  pressBox()
  ramps()
  boards()
  lights()
  return finishGlb('GEHA Field at Arrowhead Stadium', [
    { part: conc, material: finish('ah-concrete', 0xdcd6cc) },
    { part: red, material: finish('ah-seats', 0xc04a45) },
    { part: yellow, material: finish('ah-club-seats', 0xd8b44e) },
    { part: dark, material: finish('ah-charcoal', 0x4f535a) },
    { part: shade, material: finish('ah-shade', 0x7d7a76) },
    { part: win, material: PALETTE.window },
  ], { bearing: 137.5, height: 55, elevation: -STREET, replaces: ['relation/4587811'] }, 6500)
}

if (import.meta.main) await writeModel('kc-arrowhead-stadium', build())
