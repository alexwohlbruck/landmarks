/**
 * Kaiserdom St. Bartholomäus (Frankfurt Cathedral), Domplatz, Frankfurt am
 * Main: the Gothic hall nave and long transept of the 13th-14th centuries,
 * the choir of 1315-49, and Madern Gerthener's west tower (begun 1415,
 * completed 1867-77 to his design after the fire of 1867), 95 m. Original
 * procedural geometry, CC0-1.0.
 * bun generators/frankfurt-dom.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/11018815,
 * 50.1106673, 8.6853514. The church's axis runs at 84.8 degrees (tower
 * centre to apse, OSM), so the catalog bearing is -5.2 and the church is
 * square to this frame: +x the apse, -x the tower, +y the north transept.
 *
 * Writes two levels of detail in the same frame:
 *  - models/frankfurt-dom.glb: the massing, tower stages, dome, lantern,
 *    corner turrets, gables, windows as panels in plain surrounds;
 *  - models/frankfurt-dom.detail.glb (from zoom 17): adds the tower's
 *    tracery (mullions, Y forks and eyes in every big window, the crown of
 *    gables round the octagon, the pinnacles on every buttress and gable),
 *    the dome's ribs, the gallery parapets and the buttress pinnacles of the
 *    nave and choir.
 *
 * Identity, in order: the tall red sandstone west tower, square below with
 * stepped corner buttresses and a huge west window over the portal, an
 * octagon above with tall paired belfry openings and clocks, ringed by four
 * slender corner turrets, crowned by gables and pinnacles round a pointed,
 * ribbed sandstone dome with an open lantern and spire; the steep dark slate
 * roofs of the short hall nave (with its three transverse gables to each
 * side), the very long transept with its great end gables and windows, the
 * long choir with its polygonal apse; the little spire over the crossing;
 * tall traceried windows between buttresses everywhere.
 *
 * Evidence:
 *  - plan: OSM outline way/11018815 and parts, read in the turned frame:
 *    tower base (Pfarrturm) 174503727 0-16 m, square tower 505854016 16-38 m
 *    (x -36.3..-23.4, y -6.6..6.9), octagon 505859761 38-65 m (11.2 m
 *    across), dome 505859760 65-72 m, lantern/spire 505920703 72-94 m; nave
 *    bays 505868007/8/9 (x -23.4..-1.3, y -11..13.5, 28 m, transverse
 *    gabled roofs, roof 5 m); main roof 505854015 (y -7.9..8.3, 32 m, roof
 *    9 m) from the tower to the apse; transept 505854017 (x -1.3..12.4, y
 *    -31.3..32.2, 32 m, roof 9 m); north-west annex 505875634 (12 m,
 *    skillion 6 m); crossing spire 505920704 (29-44 m). The choir's side
 *    chapels and the apse polygon from the outline.
 *  - heights: tower 95 m (published: de.wikipedia "Kaiserdom St.
 *    Bartholomäus"; OSM 94); eaves 23 m and ridges 28 / 32 m from OSM. The
 *    tower's stages are read off Dietmar Rabich's photo from the south-west
 *    (6727, near-orthographic, scaled to 95 m) and checked against OSM's
 *    part heights: square to 38, octagon lower stage to 51, belfry stage to
 *    66, crown of gables 66-71, dome 66-80, lantern 80-86, spire to 95.
 *    OSM's 72 m dome top is lower than every photo shows (the dome reads
 *    to about 80 m); the photos are followed.
 *    After review the octagon is drawn 9.6 m across its flats (OSM's part
 *    is 11.2 m across, but that includes the galleries and the turrets'
 *    feet; Rabich's photo shows the shaft about three quarters of the
 *    square's width) and the dome 7.9 m across at its foot, the corner
 *    turrets close in, and the crown bristles with a tall pinnacle at each
 *    corner (to 79 m) and one on each gable. The nave and transept were
 *    checked against OSM and Pymouss's photo from across the Main (main
 *    ridge about 33 m, scaled from the tower) and kept: the long transept
 *    (63.5 m end to end) and the 24.5 m wide nave are in OSM's outline. Window sizes, buttress
 *    depths, the side chapels' heights: estimated from the photos.
 *  - colours from the daylight photos: the dark red-brown Main sandstone, a lighter
 *    tone for tracery and pinnacles, the dark slate roofs.
 *  - night: rupp.de's night photo from the Eiserner Steg: the tower
 *    floodlit, the nave dimmer.
 *  - elevation 0.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Kaiserdom Frankfurt am Main 2021-08-17 01.jpg and 02.jpg (Leonhard
 *    Lenz, CC0): the tower's west and south faces and the south side of the
 *    nave with its gables, from the south-west.
 *    https://commons.wikimedia.org/wiki/File:Kaiserdom_Frankfurt_am_Main_2021-08-17_01.jpg
 *  - Frankfurt am Main, Kaiserdom -- 2015 -- 6727.jpg (Dietmar Rabich, CC BY-SA 4.0):
 *    the tower from the south-west, whole.
 *    https://commons.wikimedia.org/wiki/File:Frankfurt_am_Main,_Kaiserdom_--_2015_--_6727.jpg
 *  - Kaiserdom St. Bartholomäus - Frankfurt - Germany - 01.jpg (Norbert
 *    Nagel, CC BY-SA 3.0): from the south across the Main; tower, nave
 *    roof, transept gable, crossing spire.
 *    https://commons.wikimedia.org/wiki/File:Kaiserdom_St._Bartholom%C3%A4us_-_Frankfurt_-_Germany_-_01.jpg
 *  - Frankfurt am Main - Kaiserdom St. Bartholomäus 20240805-01.jpg
 *    (Pymouss, CC BY-SA 4.0): the crown, dome and lantern; the roofs.
 *    https://commons.wikimedia.org/wiki/File:Frankfurt_am_Main_-_Kaiserdom_St._Bartholom%C3%A4us_20240805-01.jpg
 * No commercial imagery, no 3D city models (Hessen LoD2 not used). No
 * look-only sources.
 *
 * Left out: crockets, cusps and foils, the sculpture of the portals, the
 * clock hands, the cloister and the buildings north of the nave (way/
 * 174503730, not part of the outline).
 *
 * Doubts: the east end and the north side are seen only from far off; the
 * side chapels of the choir and their roofs are estimated. The nave's
 * transverse gables are drawn to OSM's 28 m.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  boxF, cap, ccw, face, fac, floodWalls, gothicWindow, lathe, pane, pinnacle, spire, surround, tracery, walls, wallSlab, bar, writeLods, inset, type Fac, type XY,
} from './frankfurt-roemer'

const ID = 'frankfurt-dom'

/** A buttress on facade F at s, `w` wide: stepped out to `d` at the foot, with sloped weatherings. */
function buttress(p: Part, F: Fac, s: number, w: number, d: number, z1: number, steps = 3) {
  for (let k = 0; k < steps; k++) {
    const za = (k * z1) / steps, zb = ((k + 1) * z1) / steps, dk = d * (1 - k / (steps + 0.5)), dn = d * (1 - (k + 1) / (steps + 0.5))
    const P = F.P, s0 = s - w / 2, s1 = s + w / 2, h = Math.min(1.2, (dk - (k === steps - 1 ? 0 : dn)) * 1.2)
    const top = k === steps - 1 ? 0 : dn
    boxF(p, F, s0, s1, za, zb - h, 0, dk, k === 0)
    // the weathering: from the front edge up and back to the next stage
    face(p, [P(s0, zb - h, dk), P(s1, zb - h, dk), P(s1, zb, top), P(s0, zb, top)], F.V(0, 1, 1))
    face(p, [P(s0, zb - h, 0), P(s0, zb - h, dk), P(s0, zb, top), P(s0, zb, 0)], F.V(-1, 0, 0))
    face(p, [P(s1, zb - h, 0), P(s1, zb - h, dk), P(s1, zb, top), P(s1, zb, 0)], F.V(1, 0, 0))
  }
}

/** A gable (wimperg) standing proud of facade F over s0..s1 from z0 to its apex z1. */
function wimperg(p: Part, F: Fac, s0: number, s1: number, z0: number, z1: number, o0: number, t: number) {
  wallSlab(p, F.a, F.b, [[s0, z0], [s1, z0], [(s0 + s1) / 2, z1]], t, o0)
}

/** A transverse or longitudinal saddle roof over rect x0..x1, y0..y1, ridge along x or y, with the gable triangles in `gable`. */
function saddle(roof: Part, gable: Part | null, x0: number, y0: number, x1: number, y1: number, eave: number, ridge: number, alongX: boolean, o = 0.4, ends: [boolean, boolean] = [true, true]) {
  if (alongX) {
    const ym = (y0 + y1) / 2, s = (ridge - eave) / ((y1 - y0) / 2), lo = eave - o * s
    face(roof, [[x0, y0 - o, lo], [x1, y0 - o, lo], [x1, ym, ridge], [x0, ym, ridge]], [0, -1, 1 / s])
    face(roof, [[x1, y1 + o, lo], [x0, y1 + o, lo], [x0, ym, ridge], [x1, ym, ridge]], [0, 1, 1 / s])
    face(roof, [[x0, y0 - o, lo], [x1, y0 - o, lo], [x1, y0, eave], [x0, y0, eave]], [0, 0, -1])
    face(roof, [[x0, y1 + o, lo], [x1, y1 + o, lo], [x1, y1, eave], [x0, y1, eave]], [0, 0, -1])
    if (gable) {
      if (ends[0]) face(gable, [[x0, y0, eave], [x0, y1, eave], [x0, ym, ridge]], [-1, 0, 0])
      if (ends[1]) face(gable, [[x1, y0, eave], [x1, y1, eave], [x1, ym, ridge]], [1, 0, 0])
    }
  } else {
    const xm = (x0 + x1) / 2, s = (ridge - eave) / ((x1 - x0) / 2), lo = eave - o * s
    face(roof, [[x0 - o, y1, lo], [x0 - o, y0, lo], [xm, y0, ridge], [xm, y1, ridge]], [-1, 0, 1 / s])
    face(roof, [[x1 + o, y0, lo], [x1 + o, y1, lo], [xm, y1, ridge], [xm, y0, ridge]], [1, 0, 1 / s])
    face(roof, [[x0 - o, y0, lo], [x0 - o, y1, lo], [x0, y1, eave], [x0, y0, eave]], [0, 0, -1])
    face(roof, [[x1 + o, y0, lo], [x1 + o, y1, lo], [x1, y1, eave], [x1, y0, eave]], [0, 0, -1])
    if (gable) {
      if (ends[0]) face(gable, [[x0, y0, eave], [x1, y0, eave], [xm, y0, ridge]], [0, -1, 0])
      if (ends[1]) face(gable, [[x0, y1, eave], [x1, y1, eave], [xm, y1, ridge]], [0, 1, 0])
    }
  }
}

function build(DETAIL: boolean) {
  const stone = new Part(), light = new Part(), slate = new Part(), win = new Part(), door = new Part(), dial = new Part()

  const EAVE = 23, RIDGE = 32
  const winOpts = (hw: number, lights: number, eye = false, transoms: number[] = []) => DETAIL ? { lights, eye, transoms, w: 0.35, d: 0.25 } : { lights: 1, w: hw >= 1.4 ? 0.3 : 0, d: 0.22, n: 4 }
  const W = (F: Fac, c: number, hw: number, z0: number, zs: number, lights = 2, eye = false, transoms: number[] = []) =>
    gothicWindow(win, DETAIL ? light : stone, F, c, hw, z0, zs, 'pointed', winOpts(hw, lights, eye, transoms))

  // ---- Tower ---------------------------------------------------------------
  const TX = -29.9, TY = 0.2, TH = 6.5
  const sq: XY[] = [[TX - TH, TY - TH], [TX + TH, TY - TH], [TX + TH, TY + TH], [TX - TH, TY + TH]]
  walls(stone, sq, 0, 39)
  // The west portal's projecting porch and the base courses.
  const sides = [0, 1, 2, 3].map((k) => fac(sq[k], sq[(k + 1) % 4])) // S, E, N, W
  const [FS, , FN, FW] = sides
  boxF(stone, FW, 0, 2 * TH, 0, 1.4, 0, 0.35, false)
  boxF(stone, FS, 0, 2 * TH, 0, 1.4, 0, 0.35, false)
  boxF(stone, FN, 0, 2 * TH, 0, 1.4, 0, 0.35, false)
  // Corner buttresses: square masses at each corner, stepping back in three stages.
  const corners: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  for (const [sx, sy] of corners) {
    if (sx > 0) continue // the east corners are buried in the nave
    const cx = TX + sx * TH, cy = TY + sy * TH
    const stages: [number, number, number][] = [[0, 13, 2.4], [13, 25.6, 1.9], [25.6, 39, 1.5]]
    for (const [z0, z1, h] of stages) {
      const r: XY[] = ccw([[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]].map(([x, y]) => [x + sx * h * 0.35, y + sy * h * 0.35] as XY))
      walls(stone, r, z0, z1 - 0.9)
      const ri = inset(r, 0.45)
      walls(stone, r, z1 - 0.9, z1, ri)
      cap(stone, ri, z1)
    }
  }
  // String courses on the square.
  for (const z of [13, 25.6]) for (const F of [FS, FN, FW]) boxF(stone, F, 0, 2 * TH, z - 0.4, z, 0, 0.3)
  // The west portal: a deep pointed doorway under a wimperg.
  {
    const F = FW, c = TH
    pane(door, F, c, 1.5, 0, 3.6, 'pointed', 0.04, 8)
    for (let k = 0; k < (DETAIL ? 3 : 1); k++) surround(DETAIL ? light : stone, F, c, 1.5 + k * 0.35, 0, 3.6, 'pointed', 0.35, 0.9 - k * 0.3, 8)
    wimperg(DETAIL ? light : stone, F, c - 2.7, c + 2.7, 6.1, 10.4, 0.2, 0.35)
    if (DETAIL) for (const s of [c - 2.9, c + 2.9]) { const P = F.P(s, 0, 0.6); pinnacle(light, P[0], P[1], 0.28, 4.5, 9.8, 11.4) }
    // The great west window over it.
    W(F, c, 2.3, 9.5, 20.5, 3, true, [15.0])
    W(F, c, 1.6, 27.0, 35.4, 2, true)
  }
  // The south and north faces: a tall window each.
  for (const F of [FS, FN]) { W(F, TH, 1.6, 11.0, 21.4, 2, true); W(F, TH, 1.6, 27.0, 35.4, 2, true) }
  // The square's top: a gallery parapet.
  {
    const r = inset(sq, -0.5)
    walls(stone, r, 38.2, 39.0); cap(stone, r, 39.0)
    face(stone, r.map(([x, y]) => [x, y, 38.2] as V3), [0, 0, -1])
    if (DETAIL) {
      const ri = inset(r, 0.25)
      for (let k = 0; k < 4; k++) {
        const Fk = fac(r[k], r[(k + 1) % 4])
        boxF(light, Fk, 0, Fk.L, 39.0, 40.1, -0.25, 0)
        for (let j = 1; j < 8; j++) boxF(light, Fk, (Fk.L * j) / 8 - 0.12, (Fk.L * j) / 8 + 0.12, 40.1, 40.4, -0.25, 0)
      }
      void ri
    }
  }

  // Octagon, two stages.
  const oct = (r: number, cx = TX, cy = TY) => Array.from({ length: 8 }, (_, k) => [cx + r * Math.cos(Math.PI / 8 + (k * Math.PI) / 4), cy + r * Math.sin(Math.PI / 8 + (k * Math.PI) / 4)] as XY)
  const O = oct(5.2)
  walls(stone, O, 39, 68)
  cap(stone, O, 39)
  const ledge = (z: number, r: number, h: number) => { const R = oct(r); walls(stone, R, z - h, z); cap(stone, R, z); face(stone, R.map(([x, y]) => [x, y, z - h] as V3), [0, 0, -1]) }
  ledge(68.0, 5.6, 0.8)
  for (let k = 0; k < 8; k++) {
    const F = fac(O[k], O[(k + 1) % 8]), c = F.L / 2
    const cardinal = k % 2 === 1 // faces at 90, 180, 270, 0 (a0 = pi/8: face k centred at pi/4 + k pi/4)
    // very tall two-light openings; on the cardinal faces the clock cuts in,
    // with a short opening over it
    if (cardinal) { W(F, c, 1.15, 42.0, 52.9, 2, false, [47.5]); W(F, c, 0.95, 61.6, 63.3, 2, false) }
    else W(F, c, 1.15, 42.0, 62.9, 2, true, [52.5])
    if (cardinal) {
      const ring: XY[] = []
      for (let j = 0; j < 16; j++) { const t = (j / 16) * 2 * Math.PI; ring.push([c + 1.15 * Math.cos(t), 58.9 + 1.15 * Math.sin(t)]) }
      const C = F.P(c, 58.9, 0.08)
      for (let j = 0; j < 16; j++) face(dial, [C, F.P(ring[j][0], ring[j][1], 0.08), F.P(ring[(j + 1) % 16][0], ring[(j + 1) % 16][1], 0.08)], F.N)
      bar(DETAIL ? light : stone, F, [...ring, ring[0]], 0.22, 0, 0.18)
    }
    // The crown: a gable over each face, pinnacles between.
    wimperg(DETAIL ? light : stone, F, 0.3, F.L - 0.3, 68.0, 73.6, -0.1, 0.4)
    // the bristling crown: a tall pinnacle at every corner of the octagon
    // and one on every gable's apex
    {
      const P = F.P(0, 0, 0.15), Q = F.P(c, 0, 0.05)
      pinnacle(DETAIL ? light : stone, P[0], P[1], DETAIL ? 0.34 : 0.4, 67.2, 74.0, 79.0, Math.atan2(F.u[1], F.u[0]))
      if (DETAIL) {
        pinnacle(light, Q[0], Q[1], 0.2, 72.6, 74.6, 77.2, Math.atan2(F.u[1], F.u[0]))
        tracery(light, F, c, 1.25, 68.4, 69.4, 'pointed', 2, 0.13, 0.42)
        for (const sf of [0.22, 0.78]) { const R = F.P(F.L * sf, 0, 0.3); pinnacle(light, R[0], R[1], 0.14, 70.2, 71.6, 73.4, Math.atan2(F.u[1], F.u[0])) }
      }
    }
  }
  // Four slender corner turrets on the diagonals, from the square's corners up the octagon.
  for (const [sx, sy] of corners) {
    const cx = TX + sx * (TH - 1.9), cy = TY + sy * (TH - 1.9)
    const R = oct(0.95, cx, cy)
    walls(stone, R, 39, 66.5)
    const R2 = oct(1.15, cx, cy)
    walls(stone, R2, 66.5, 67.4); cap(stone, R2, 66.5, false)
    spire(DETAIL ? light : stone, R2, 67.4, [cx, cy, 79.5])
    if (DETAIL) {
      for (let k = 0; k < 8; k += 2) {
        const F = fac(R[k], R[(k + 1) % 8])
        pane(win, F, F.L / 2, 0.22, 43, 50, 'pointed', 0.03, 4)
        pane(win, F, F.L / 2, 0.22, 54, 62, 'pointed', 0.03, 4)
      }
      for (const z of [52, 63.5]) walls(light, oct(1.08, cx, cy), z - 0.35, z)
    }
  }
  // The pointed dome, octagonal, with ribs, then the open lantern and the spire.
  const prof: XY[] = [[3.95, 68.0], [3.9, 70.6], [3.6, 73.2], [3.0, 75.5], [2.15, 77.3], [1.5, 78.1], [1.35, 78.3]]
  {
    const rings = prof.map(([r, z]) => oct(r).map(([x, y]) => [x, y, z] as V3))
    for (let i = 0; i < rings.length - 1; i++) for (let k = 0; k < 8; k++) {
      const a = rings[i][k], b = rings[i][(k + 1) % 8], c = rings[i + 1][(k + 1) % 8], d = rings[i + 1][k]
      const mx = (a[0] + b[0]) / 2 - TX, my = (a[1] + b[1]) / 2 - TY
      face(stone, [a, b, c, d], [mx, my, (prof[i][0] - prof[i + 1][0]) / (prof[i + 1][1] - prof[i][1]) * Math.hypot(mx, my)])
    }
    if (DETAIL) {
      // ribs along the eight arrises, and a row of dormer gables
      for (let k = 0; k < 8; k++) {
        const path = prof.map(([r, z]) => { const [x, y] = oct(r + 0.12)[k]; return [x, y, z] as V3 })
        for (let i = 0; i < path.length - 1; i++) {
          const a = path[i], b = path[i + 1], t = 0.17
          const ox = -(a[1] - TY), oy = a[0] - TX, l = Math.hypot(ox, oy)
          const o: V3 = [ox / l * t, oy / l * t, 0]
          face(light, [[a[0] - o[0], a[1] - o[1], a[2]], [a[0] + o[0], a[1] + o[1], a[2]], [b[0] + o[0], b[1] + o[1], b[2]], [b[0] - o[0], b[1] - o[1], b[2]]], [a[0] - TX, a[1] - TY, 0.6])
        }
      }
    }
  }
  {
    const L = oct(1.45)
    walls(stone, oct(1.65), 78.3, 78.9); cap(stone, oct(1.65), 78.9)
    // eight slender posts with the openings between, then a cornice
    for (let k = 0; k < 8; k++) {
      const [x, y] = L[k]
      const r: XY[] = oct(0.28, x, y)
      walls(stone, r, 78.9, 84.0)
    }
    const core = oct(1.0)
    walls(win, core, 78.9, 84.0)
    const top = oct(1.65)
    walls(stone, top, 84.0, 84.8); cap(stone, top, 84.0, false)
    if (DETAIL) for (let k = 0; k < 8; k++) {
      const F = fac(top[k], top[(k + 1) % 8])
      wimperg(light, F, 0.1, F.L - 0.1, 84.8, 86.4, -0.2, 0.25)
    }
    spire(stone, oct(1.3), 84.8, [TX, TY, 94.0])
    lathe(DETAIL ? light : stone, TX, TY, [[0.0, 93.3], [0.22, 93.5], [0.12, 94.2], [0.25, 94.4], [0.05, 95.0], [0, 95.0]], 6)
  }

  // ---- The north-west annex ------------------------------------------------
  {
    const r: XY[] = [[-34.4, 6.7], [-23.5, 6.9], [-23.5, 13.4], [-34.5, 12.9]]
    walls(stone, ccw(r), 0, 8)
    face(slate, [[-34.9, 13.3, 7.6], [-23.2, 13.8, 7.6], [-23.2, 6.7, 12.5], [-34.9, 6.7, 12.5]], [0, 1, 1.4])
    face(stone, [[-34.4, 6.7, 8], [-34.5, 12.9, 8], [-34.4, 6.7, 12.3]], [-1, 0, 0])
  }

  // ---- Nave: hall with three transverse gables a side ------------------------
  const NX0 = -23.4, NX1 = -1.3, NY0 = -11.0, NY1 = 12.9
  walls(stone, [[NX0, NY0], [NX1, NY0], [NX1, NY1], [NX0, NY1]], 0, EAVE)
  const bays: [number, number][] = [[NX0, -17.2], [-17.2, -8.1], [-8.1, NX1]]
  const nS = fac([NX0, NY0], [NX1, NY0]), nN = fac([NX1, NY1], [NX0, NY1])
  for (const [x0, x1] of bays) {
    saddle(slate, stone, x0, NY0, x1, NY1, EAVE, 28.6, false, 0.3)
    const c = (x0 + x1) / 2, w = x1 - x0
    W(nS, c - NX0, Math.min(2.0, w / 2 - 1.2), 7.5, 18.5, 3, true)
    W(nN, NX1 - c, Math.min(2.0, w / 2 - 1.2), 7.5, 18.5, 3, true)
    // a small window in each gable
    pane(win, nS, c - NX0, 0.6, 24.0, 25.4, 'pointed', 0.05, 4)
    pane(win, nN, NX1 - c, 0.6, 24.0, 25.4, 'pointed', 0.05, 4)
  }
  for (const xb of [-17.2, -8.1]) {
    buttress(stone, nS, xb - NX0, 1.2, 1.6, 21.5)
    buttress(stone, nN, NX1 - xb, 1.2, 1.6, 21.5)
    if (DETAIL) for (const [F, s] of [[nS, xb - NX0], [nN, NX1 - xb]] as [Fac, number][]) {
      const P = F.P(s, 0, 0.4)
      pinnacle(light, P[0], P[1], 0.3, 21.5, 25.0, 27.2, Math.atan2(F.u[1], F.u[0]))
    }
  }
  // The main roof, from the tower to the apse.
  saddle(slate, null, NX0, -7.9, 33.8, 8.3, EAVE, RIDGE, true, 0.4)

  // ---- Transept ---------------------------------------------------------------
  const TX0 = -1.3, TX1 = 12.4, TY0 = -31.3, TY1 = 32.2
  walls(stone, [[TX0, TY0], [TX1, TY0], [TX1, TY1], [TX0, TY1]], 0, EAVE)
  saddle(slate, stone, TX0, TY0, TX1, TY1, EAVE, RIDGE, false, 0.4)
  {
    const S = fac([TX0, TY0], [TX1, TY0]), N = fac([TX1, TY1], [TX0, TY1])
    for (const F of [S, N]) {
      W(F, F.L / 2, 3.2, 6.5, 20.0, 4, true, [13.5])
      pane(win, F, F.L / 2, 0.9, 25.0, 27.0, 'pointed', 0.05, 4)
      for (const s of [0.8, F.L - 0.8]) {
        buttress(stone, F, s, 1.5, 2.2, 22.5)
        const P = F.P(s, 0, 0.5)
        if (DETAIL) pinnacle(light, P[0], P[1], 0.38, 22.5, 26.5, 29.5, Math.atan2(F.u[1], F.u[0]))
      }
      if (DETAIL) {
        // the gable's coping, stepped out a little
        bar(light, F, [[-0.3, EAVE - 0.1], [F.L / 2, RIDGE + 0.25], [F.L + 0.3, EAVE - 0.1]], 0.4, -0.2, 0.25)
      }
    }
    // The arms' side walls, east and west, two bays each.
    const E = fac([TX1, TY0], [TX1, TY1]), Wf = fac([TX0, TY1], [TX0, TY0])
    for (const [y0, y1] of [[TY0, -11.2], [13.5, TY1]]) {
      for (const k of [0.27, 0.73]) {
        const y = y0 + (y1 - y0) * k
        W(E, y - TY0, 1.6, 7.5, 18.5, 2, false)
        W(Wf, TY1 - y, 1.6, 7.5, 18.5, 2, false)
      }
      const ym = (y0 + y1) / 2
      buttress(stone, E, ym - TY0, 1.2, 1.6, 21.5)
      buttress(stone, Wf, TY1 - ym, 1.2, 1.6, 21.5)
    }
  }

  // ---- Choir ------------------------------------------------------------------
  const CX0 = 12.4, CX1 = 33.8
  const apse: XY[] = [[CX0, -7.9], [CX1, -7.9], [35.2, -6.4], [37.4, -1.4], [37.4, 3.4], [35.2, 7.6], [CX1, 8.3], [CX0, 8.3]]
  walls(stone, apse, 0, EAVE)
  // The apse roof: a half-hip round the polygon to the ridge's end.
  {
    const R: V3 = [CX1, 0.2, RIDGE]
    const ring = apse.slice(1, 7)
    for (let i = 0; i < ring.length - 1; i++) {
      const a = ring[i], b = ring[i + 1]
      const ex = b[0] - a[0], ey = b[1] - a[1]
      face(slate, [[a[0], a[1], EAVE], [b[0], b[1], EAVE], R], [ey, -ex, Math.hypot(ex, ey) * 0.6])
    }
    // windows on the apse facets
    for (let i = 1; i < ring.length - 2; i++) {
      const F = fac(ring[i], ring[i + 1])
      W(F, F.L / 2, Math.min(1.4, F.L / 2 - 0.7), 6.0, 18.5, 2, false)
    }
    for (let i = 1; i < ring.length - 1; i++) {
      const F = fac(ring[i - 1], ring[i])
      buttress(stone, F, F.L - 0.4, 1.0, 1.4, 21.0)
    }
  }
  // Side chapels along the choir, lean-to roofs, and the choir's tall windows above them.
  const CH = 11.0
  for (const [yo, yi] of [[-11.2, -7.9], [13.3, 8.3]] as [number, number][]) {
    const r: XY[] = ccw([[CX0, yo], [32.5, yo], [32.5, yi], [CX0, yi]])
    walls(stone, r, 0, CH)
    const sg = Math.sign(yo - yi)
    face(slate, [[CX0, yo + sg * 0.4, CH - 0.25], [32.9, yo + sg * 0.4, CH - 0.25], [32.9, yi, CH + 3.2], [CX0, yi, CH + 3.2]], [0, sg, 1.2])
    face(stone, [[32.5, yo, CH], [32.5, yi, CH], [32.5, yi, CH + 3.2]], [1, 0, 0])
  }
  {
    const S = fac([CX0, -7.9], [CX1, -7.9]), N = fac([CX1, 8.3], [CX0, 8.3])
    const Sc = fac([CX0, -11.2], [32.5, -11.2]), Nc = fac([32.5, 13.3], [CX0, 13.3])
    for (let k = 0; k < 4; k++) {
      const x = CX0 + 3.0 + k * 5.2
      W(S, x - CX0, 1.5, 14.8, 20.5, 2, false)
      W(N, CX1 - x, 1.5, 14.8, 20.5, 2, false)
      W(Sc, x - CX0, 1.2, 3.0, 8.3, 2, false)
      W(Nc, 32.5 - x, 1.2, 3.0, 8.3, 2, false)
      if (k > 0) {
        buttress(stone, Sc, x - 2.6 - CX0, 0.9, 1.1, 10.0, 2)
        buttress(stone, Nc, 32.5 - (x - 2.6), 0.9, 1.1, 10.0, 2)
      }
    }
    if (DETAIL) for (let k = 0; k < 5; k++) {
      // pinnacles on the choir wall between the clerestory windows
      const x = CX0 + 0.4 + k * 5.2
      for (const [F, s] of [[S, x - CX0], [N, CX1 - x]] as [Fac, number][]) {
        const P = F.P(s, 0, 0.3)
        pinnacle(light, P[0], P[1], 0.28, 20.5, 24.0, 26.2, Math.atan2(F.u[1], F.u[0]))
      }
    }
  }

  // ---- The crossing spire -------------------------------------------------------
  {
    const cx = 5.9, cy = 0.5
    const hex = Array.from({ length: 8 }, (_, k) => [cx + 1.25 * Math.cos(Math.PI / 8 + (k * Math.PI) / 4), cy + 1.25 * Math.sin(Math.PI / 8 + (k * Math.PI) / 4)] as XY)
    walls(slate, hex, 29.5, 36.5)
    if (DETAIL) for (let k = 0; k < 8; k += 2) { const F = fac(hex[k], hex[(k + 1) % 8]); pane(win, F, F.L / 2, 0.22, 33.0, 35.6, 'pointed', 0.03, 4) }
    spire(slate, hex, 36.5, [cx, cy, 44.5])
  }

  const flood = (p: V3, n: V3) => (p[0] < -20 ? floodWalls(p, n) : floodWalls(p, n) * 0.5)
  const parts: { part: Part; material: MaterialSpec }[] = [
    { part: stone, material: { ...finish('dom-sandstone', 0x9a5b4f), floodlight: flood } },
    { part: light, material: { ...finish('dom-sandstone-light', 0xae7163), floodlight: flood } },
    { part: slate, material: finish('dom-slate', 0x6c737c) },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('dom-door', 0x7a6a5a) },
    { part: dial, material: { ...PALETTE.window, name: 'window-2', color: 0x4f5d6b } },
  ]
  return parts
}

if (import.meta.main) await writeLods(ID, 'Kaiserdom St. Bartholomäus', [50.1106673, 8.6853514], -5.2, build(false), build(true))
