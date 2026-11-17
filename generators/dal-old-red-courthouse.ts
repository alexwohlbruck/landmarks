/**
 * Old Red Courthouse (Dallas County Courthouse, 1892, M. A. Orlopp Jr.; now
 * the Old Red Museum), 100 South Houston Street, Dallas: procedural, CC0-1.0.
 * bun generators/dal-old-red-courthouse.ts
 *
 * Map frame: x east, y north, z up, metres, turned to the placement's
 * bearing 346 (the long walls of OSM way/27940349 run at 75.4 deg), so x
 * runs along the long Commerce (-y) and Main (+y) Street fronts and the
 * Houston Street end is -x. The origin is the centroid of the outline
 * way/27940349; y = 0 is the street.
 *
 * Identity, in order: the red sandstone over a rusticated grey granite base,
 * with grey stone bands; eight round turrets with steep red cones, four on
 * each long front (the corners and either side of the centre); the square
 * central clock tower with corner pinnacles, a clock on each face and a
 * striped bell roof under a white lantern; steep grey slate roofs with
 * gabled end pavilions, cross gables and dormers.
 *
 * Measured:
 * - plan: OSM way/27940349 (57.6 x 37 m) and its 33 parts
 *   way/1491921584 to way/1491921616: the turrets (round, 5.8-6.4 m
 *   across, corners at x +-25.6, y +-15.0, inner ones at x +-9.4, drawn
 *   symmetric, OSM has them 0.9 m off), the end pavilions (x to +-28.3,
 *   y +-7.1), the recessed centre of each long front with a low porch
 *   (way/1491921584 and -85), the tower (11 m square in OSM with its gallery and corner
 *   pinnacles), cross gables and hipped end roofs;
 * - heights: USGS lidar TX_Pecos_Dallas_B3_2018 (2018 flight, after the
 *   2007 restoration that rebuilt the clock tower), the street at 1.0 m
 *   over the box minimum: central ridge 30.0, end hips 27.6, turret cone
 *   tips 31.3, the porch 6.5, tower gallery 36.5, corner pinnacles to
 *   about 43-44, the tower roof and lantern to 50.3 (finial not seen).
 * Estimated from the photos: the main eave at 20.6 m, the top of the
 *   cornice (lidar reads 21-23 m on the slopes just inside the walls; set
 *   low so the slate pitches come out as steep as in the photos, 37-39 deg,
 *   under the measured ridges), the turret drums to 24.5 m, granite base to 5 m, the bands,
 *   window rows and sizes, the tower's clock stage 36.5-42.7 m, bell roof
 *   42.7-47.4 m and lantern to 51.3 m (ratios from Alon's level view,
 *   scaled between the lidar gallery and top), the dormers and the pinnacles by the gables.
 * Colours from the daylight photos (Highsmith, Fredlyfish4, Barera's view
 *   from Reunion Tower): the brown-red sandstone, #a85d52; the grey
 *   granite base and bands; the dark red cones; deep grey slate (#7c858c)
 *   with broad bands of lighter slate (drawn in the granite grey) on every
 *   roof face. The tower's domed cap is banded grey, red and cream.
 * Tower width: the shaft drawn 7.2 m and the clock stage 5.8 m square, read
 *   against the turrets (6.2 m) in Highsmith's and Alon's views; OSM's 11 m
 *   tower part and the lidar's 37 m ring include the gallery and pinnacles.
 * Facade: a panel per window or per arched opening, five rows: arched
 *   ground-floor openings in the granite, then square and arched rows
 *   alternating, on the turrets too.
 * Left out: the thin red slate stripes and orange ridge tiles,
 *   the carved griffins, finials, chimneys, the balustrades, steps.
 *
 * Night: floodlit sandstone and granite (Meyers' night photo), the
 *   windows lit, the clock faces in `trim`.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "The former Dallas County Courthouse, fondly known locally as the
 *   "Old Red Courthouse" ... LCCN2014632167.tif" and "Overhead view of the
 *   former Dallas County Courthouse ... LCCN2014632609.tif", Carol M.
 *   Highsmith, public domain
 * - "View of Old Red Museum from Reunion Tower August 2015 04.jpg",
 *   Michael Barera, CC BY-SA 4.0
 * - "Old Red from Dealey Plaza.JPG", Fredlyfish4, CC BY-SA 3.0
 * - "Dallas County Courthouse with Texas Flag.jpg", Martin Alon, CC BY-SA 4.0
 * - "Old Red Museum of Dallas County History & Culture.png", MichaelMeyers,
 *   CC BY-SA 4.0 (night)
 * - "Dallas - Old Red Museum 01.jpg", "... 02.jpg", Joe Mabel, CC BY-SA 3.0
 * - "Old Red Courthouse - panoramio.jpg", Michael Laferriere, CC BY 3.0
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the lidar has few returns on the tower roof's steep dark slate,
 * so the clock stage, bell roof and lantern split is from photos; the
 * window rows are simplified (the real fenestration varies bay to bay);
 * the east end is seen only at a distance.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archPanel, block, cap, inset, lathe, panel, rect, save, walls, type XY } from './chi-merchandise-mart'

const ANCHOR: [number, number] = [32.7786338, -96.8073129]
const BEARING = 346

const XE = 26.4, YE = 16.5 // main walls
const XP = 28.3, YP = 7.1 // end pavilions
const XN = 6.6, YN = 12.5, YPORCH = 15.7 // recessed centre and porch
const EAVE = 20.6, BASE = 5.0
const TUR: [number, number, number][] = [] // x, y, r
for (const sx of [-1, 1]) for (const sy of [-1, 1]) TUR.push([sx * 25.6, sy * 15.0, 3.1], [sx * 9.4, sy * 15.1, 3.0])
const DRUM = 24.5, CONE = 31.3
const BANDS = [8.7, 12.9, 17.1]

function build() {
  const sand = new Part(), gran = new Part(), cone = new Part(), roof = new Part(), win = new Part(), trim = new Part()

  // --- Main body ------------------------------------------------------------
  const body: XY[] = [[-XE, -YE], [-XN, -YE], [-XN, -YN], [XN, -YN], [XN, -YE], [XE, -YE], [XE, YE], [XN, YE], [XN, YN], [-XN, YN], [-XN, YE], [-XE, YE]]
  walls(gran, body, 0, BASE)
  walls(sand, body, BASE, EAVE)
  for (const sx of [-1, 1]) {
    const pav = sx > 0 ? rect(XE - 0.5, -YP, XP, YP) : rect(-XP, -YP, -XE + 0.5, YP)
    walls(gran, pav, 0, BASE)
    walls(sand, pav, BASE, 23)
  }
  // Granite bands and the cornice, as rings slightly proud of the walls.
  const ring = (p: Part, r: XY[], z0: number, z1: number) => { walls(p, r, z0, z1); cap(p, r, z0, false) }
  const out = (d: number): XY[] => inset(body, -d)
  for (const z of BANDS) ring(gran, out(0.1), z, z + 0.4)
  ring(gran, out(0.12), BASE - 0.4, BASE)
  ring(sand, out(0.3), EAVE - 0.9, EAVE)
  for (const sx of [-1, 1]) {
    const pr = (d: number) => (sx > 0 ? rect(XE, -YP - d, XP + d, YP + d) : rect(-XP - d, -YP - d, -XE, YP + d))
    for (const z of BANDS) ring(gran, pr(0.1), z, z + 0.4)
    ring(sand, pr(0.3), 22.1, 23)
  }
  // Porches in the recessed centres.
  for (const sy of [-1, 1]) {
    const r = sy > 0 ? rect(-XN, YN, XN, YPORCH) : rect(-XN, -YPORCH, XN, -YN)
    block(gran, roof, r, 0, 6.5, 0.3)
  }

  // --- Roofs ----------------------------------------------------------------
  // Slate roofs carry broad bands of lighter slate (as in Barera's view from
  // Reunion Tower), drawn in the pale granite grey laid just over each face.
  const STRIPES: [number, number][] = [[22.3, 23.5], [24.9, 26.0], [27.5, 28.5]]
  const slope = (...q: V3[]) => {
    if (q.length === 4) roof.quad(q[0], q[1], q[2], q[3]); else roof.tri(q[0], q[1], q[2])
    const e1 = [q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]], e2 = [q[2][0] - q[0][0], q[2][1] - q[0][1], q[2][2] - q[0][2]]
    let n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
    const l = Math.hypot(n[0], n[1], n[2]) || 1
    n = n.map((v) => (v / l) * 0.05)
    for (const [za, zb] of STRIPES) {
      let poly: V3[] = q
      for (const [lim, keepAbove] of [[za, true], [zb, false]] as [number, boolean][]) {
        const src = poly, outp: V3[] = []
        const inside = (p: V3) => (keepAbove ? p[2] >= lim : p[2] <= lim)
        for (let i = 0; i < src.length; i++) {
          const p = src[i], c = src[(i + 1) % src.length]
          if (inside(p)) outp.push(p)
          if (inside(p) !== inside(c)) {
            const t = (lim - p[2]) / (c[2] - p[2])
            outp.push([p[0] + (c[0] - p[0]) * t, p[1] + (c[1] - p[1]) * t, lim])
          }
        }
        poly = outp
      }
      for (let i = 1; i < poly.length - 1; i++) {
        const o = (p: V3): V3 => [p[0] + n[0], p[1] + n[1], p[2] + n[2]]
        gran.tri(o(poly[0]), o(poly[i]), o(poly[i + 1]))
      }
    }
  }
  // Hipped end blocks, ridge along y.
  for (const sx of [-1, 1]) {
    const x0 = sx * 9, x1 = sx * XE, xm = sx * 17.7
    const e: XY[] = sx > 0 ? [[x0, -YE], [x1, -YE], [x1, YE], [x0, YE]] : [[x1, -YE], [x0, -YE], [x0, YE], [x1, YE]]
    const top: XY[] = [[xm, -7.8], [xm, -7.8], [xm, 7.8], [xm, 7.8]]
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      const A: V3 = [e[i][0], e[i][1], EAVE], B: V3 = [e[j][0], e[j][1], EAVE], Cc: V3 = [top[j][0], top[j][1], 27.6], Dd: V3 = [top[i][0], top[i][1], 27.6]
      if (i % 2 === 0) slope(A, B, Cc); else slope(A, B, Cc, Dd)
    }
    cap(roof, e, EAVE, false)
  }
  // Central gabled range, ridge along x, eaves at the recessed centre line.
  {
    const XC = 17.7, RIDGE = 30
    for (const sy of [-1, 1]) {
      const a: V3 = [-XC, sy * YN, EAVE], b: V3 = [XC, sy * YN, EAVE], c: V3 = [XC, 0, RIDGE], d: V3 = [-XC, 0, RIDGE]
      if (sy < 0) slope(a, b, c, d); else slope(b, a, d, c)
    }
    for (const sx of [-1, 1]) {
      const p: V3[] = [[sx * XC, -YN, EAVE], [sx * XC, YN, EAVE], [sx * XC, 0, RIDGE]]
      if (sx > 0) sand.tri(p[0], p[1], p[2]); else sand.tri(p[1], p[0], p[2])
    }
  }
  /** A gable roof over the rectangle, ridge along its long axis `along`, with gable walls at both ends. */
  const gable = (x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, along: 'x' | 'y', ends = true, oh = 0.25) => {
    if (along === 'x') {
      const ym = (y0 + y1) / 2
      slope([x0, y0 - oh, z0], [x1, y0 - oh, z0], [x1, ym, z1], [x0, ym, z1])
      slope([x1, y1 + oh, z0], [x0, y1 + oh, z0], [x0, ym, z1], [x1, ym, z1])
      roof.quad([x0, y0 - oh, z0 - 0.01], [x0, ym, z1 - 0.01], [x1, ym, z1 - 0.01], [x1, y0 - oh, z0 - 0.01])
      roof.quad([x1, y1 + oh, z0 - 0.01], [x1, ym, z1 - 0.01], [x0, ym, z1 - 0.01], [x0, y1 + oh, z0 - 0.01])
      if (ends) {
        sand.tri([x1, y0, z0], [x1, y1, z0], [x1, ym, z1])
        sand.tri([x0, y1, z0], [x0, y0, z0], [x0, ym, z1])
      }
    } else {
      const xm = (x0 + x1) / 2
      slope([x1 + oh, y0, z0], [x1 + oh, y1, z0], [xm, y1, z1], [xm, y0, z1])
      slope([x0 - oh, y1, z0], [x0 - oh, y0, z0], [xm, y0, z1], [xm, y1, z1])
      roof.quad([x1 + oh, y0, z0 - 0.01], [xm, y0, z1 - 0.01], [xm, y1, z1 - 0.01], [x1 + oh, y1, z0 - 0.01])
      roof.quad([x0 - oh, y1, z0 - 0.01], [xm, y1, z1 - 0.01], [xm, y0, z1 - 0.01], [x0 - oh, y0, z0 - 0.01])
      if (ends) {
        sand.tri([x0, y0, z0], [x1, y0, z0], [xm, y0, z1])
        sand.tri([x1, y1, z0], [x0, y1, z0], [xm, y1, z1])
      }
    }
  }
  // End pavilions' gables, ridge along x at 28 m.
  gable(-XP, -YP, -17.7, YP, 23, 28, 'x')
  gable(17.7, -YP, XP, YP, 23, 28, 'x')
  // Cross gables over the recessed centres, ridge along y at 27.5 m.
  gable(-XN, YN - 6.5, XN, YN, EAVE, 27.5, 'y')
  gable(-XN, -YN, XN, -YN + 6.5, EAVE, 27.5, 'y')
  // Dormers on the long fronts between the turrets.
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const xc = sx * 17.45, yf = sy * YE, yb = sy * 10.5
    const [y0, y1] = sy > 0 ? [yb, yf] : [yf, yb]
    block(sand, null, rect(xc - 2.5, y0, xc + 2.5, y1), EAVE - 0.5, 24.0, 0)
    gable(xc - 2.5, y0, xc + 2.5, y1, 24.0, 26.6, 'y')
    archPanel(win, ...(sy > 0 ? [[xc + 2.5, yf], [xc - 2.5, yf]] : [[xc - 2.5, yf], [xc + 2.5, yf]]) as [XY, XY], 1.0, 4.0, 22.0, 23.6, 0.05, 8)
  }

  // --- Turrets --------------------------------------------------------------
  for (const [cx, cy, r] of TUR) {
    lathe(gran, cx, cy, [[r + 0.05, 0], [r + 0.05, BASE]], 16)
    lathe(sand, cx, cy, [[r, BASE], [r, DRUM]], 16)
    for (const z of BANDS) lathe(gran, cx, cy, [[r + 0.12, z], [r + 0.12, z + 0.4]], 16)
    lathe(sand, cx, cy, [[r + 0.3, EAVE - 0.9], [r + 0.3, EAVE]], 16)
    lathe(gran, cx, cy, [[r + 0.15, DRUM - 0.5], [r + 0.15, DRUM]], 16)
    lathe(cone, cx, cy, [[r, DRUM], [r + 0.35, DRUM]], 16)
    lathe(cone, cx, cy, [[r + 0.35, DRUM], [0, CONE]], 16)
    // windows on the outward facets
    const ox = Math.sign(cx), oy = Math.sign(cy)
    for (let k = 0; k < 16; k++) {
      const t = ((k + 0.5) / 16) * 2 * Math.PI
      const nx = Math.cos(t), ny = Math.sin(t)
      const facing = (nx * ox * (Math.abs(cx) > 20 ? 1 : 0) + ny * oy) / (Math.abs(cx) > 20 ? 1.41 : 1)
      if (facing < 0.25 || k % 2) continue
      const t0 = (k / 16) * 2 * Math.PI, t1 = ((k + 1) / 16) * 2 * Math.PI
      const a: XY = [cx + (r + 0.1) * Math.cos(t0), cy + (r + 0.1) * Math.sin(t0)], b: XY = [cx + (r + 0.1) * Math.cos(t1), cy + (r + 0.1) * Math.sin(t1)]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      panel(win, a, b, 0.2, L - 0.2, 6.0, 8.2, 0.02)
      archPanel(win, a, b, 0.2, L - 0.2, 9.5, 11.6, 0.02, 6)
      panel(win, a, b, 0.2, L - 0.2, 13.8, 16.2, 0.02)
      archPanel(win, a, b, 0.2, L - 0.2, 17.0, 19.0, 0.02, 6)
      panel(win, a, b, 0.25, L - 0.25, 22.3, 23.6, 0.02)
    }
  }

  // --- Wall windows ---------------------------------------------------------
  const nearTurret = (P: XY, pad = 0.9) => TUR.some(([x, y, r]) => Math.hypot(P[0] - x, P[1] - y) < r + pad)
  const bays = (a: XY, b: XY, pitch: number, w: number, rows: { z0: number; z1: number; arch: boolean; p?: Part }[]) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / pitch)), pt = L / n
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    for (let k = 0; k < n; k++) {
      const s = (k + 0.5) * pt
      if (nearTurret([a[0] + u[0] * s, a[1] + u[1] * s], w / 2 + 0.6)) continue
      for (const r of rows) {
        if (r.arch) archPanel(r.p ?? win, a, b, s - w / 2, s + w / 2, r.z0, r.z1 - w / 2, 0.05, 8)
        else panel(r.p ?? win, a, b, s - w / 2, s + w / 2, r.z0, r.z1, 0.05)
      }
    }
  }
  const ROWS = [
    { z0: 1.4, z1: 4.0, arch: true },
    { z0: 6.0, z1: 8.2, arch: false },
    { z0: 9.5, z1: 12.4, arch: true },
    { z0: 13.8, z1: 16.4, arch: false },
    { z0: 17.2, z1: 19.4, arch: true },
  ]
  for (const sy of [-1, 1]) {
    for (const sx of [-1, 1]) {
      // long-front sections between the corner and inner turrets
      const x0 = Math.min(sx * 12.4, sx * 22.5), x1 = Math.max(sx * 12.4, sx * 22.5), y = sy * YE
      if (sy < 0) bays([x0, y], [x1, y], 2.5, 1.4, ROWS)
      else bays([x1, y], [x0, y], 2.5, 1.4, ROWS)
    }
    // the recessed centre wall over the porch, and the cross gable's face
    const y = sy * YN
    const [a, b]: XY[] = sy < 0 ? [[-XN, y], [XN, y]] : [[XN, y], [-XN, y]]
    bays(a, b, 2.6, 1.5, ROWS.slice(2))
    bays(a, b, 2.6, 1.2, [{ z0: 22.2, z1: 24.6, arch: true }].map((r) => r))
    // porch arcade
    const yp = sy * YPORCH
    const [pa, pb]: XY[] = sy < 0 ? [[-XN, yp], [XN, yp]] : [[XN, yp], [-XN, yp]]
    for (const s of [3.3, 6.6, 9.9]) archPanel(win, pa, pb, s - 1.2, s + 1.2, 0.3, 4.0, 0.05, 8)
  }
  for (const sx of [-1, 1]) {
    // pavilion fronts, with the three-arched entrance (Houston Street at -x)
    const x = sx * XP
    const [a, b]: XY[] = sx > 0 ? [[x, -YP], [x, YP]] : [[x, YP], [x, -YP]]
    bays(a, b, 2.8, 1.5, ROWS.slice(1))
    for (const s of [YP - 3.2, YP, YP + 3.2]) archPanel(win, a, b, s - 1.25, s + 1.25, 0.3, 3.6, 0.05, 8)
    archPanel(win, a, b, YP - 2.4, YP - 0.9, 23.4, 25.0, 0.05, 6)
    archPanel(win, a, b, YP - 0.75, YP + 0.75, 23.4, 25.6, 0.05, 6)
    archPanel(win, a, b, YP + 0.9, YP + 2.4, 23.4, 25.0, 0.05, 6)
    // the short ends either side of the pavilion
    for (const sy of [-1, 1]) {
      const y0 = sy * YP, y1 = sy * 12.2
      const xe = sx * XE
      const pts: XY[] = (sx > 0) === (sy > 0) ? [[xe, y0], [xe, y1]] : [[xe, y1], [xe, y0]]
      bays(pts[0], pts[1], 2.6, 1.3, ROWS)
    }
    // pinnacles flanking the gable
    for (const sy of [-1, 1]) {
      lathe(sand, x - sx * 0.35, sy * (YP - 0.2), [[0.65, 17], [0.65, 25.4]], 10)
      lathe(gran, x - sx * 0.35, sy * (YP - 0.2), [[0.8, 25.4], [0, 27.2]], 10)
    }
  }

  // --- Clock tower ----------------------------------------------------------
  const T = 3.6, G = 36.5, C1 = 42.7
  block(sand, null, rect(-T, -T, T, T), 20, G - 0.6, 0)
  ring(gran, rect(-T - 0.12, -T - 0.12, T + 0.12, T + 0.12), 33.2, 33.6)
  block(gran, gran, rect(-T - 0.35, -T - 0.35, T + 0.35, T + 0.35), G - 0.6, G, 0.15)
  cap(gran, rect(-T - 0.35, -T - 0.35, T + 0.35, T + 0.35), G - 0.6, false)
  const S = 2.9 // clock stage
  block(sand, null, rect(-S, -S, S, S), G, C1 - 0.6, 0)
  block(gran, null, rect(-S - 0.3, -S - 0.3, S + 0.3, S + 0.3), C1 - 0.6, C1, 0)
  cap(gran, rect(-S - 0.3, -S - 0.3, S + 0.3, S + 0.3), C1 - 0.6, false)
  const faces = (h: number): [XY, XY][] => [[[-h, -h], [h, -h]], [[h, -h], [h, h]], [[h, h], [-h, h]], [[-h, h], [-h, -h]]]
  for (const [a, b] of faces(T)) {
    archPanel(win, a, b, T - 2.1, T - 0.5, 29.6, 32.0, 0.05, 8)
    archPanel(win, a, b, T + 0.5, T + 2.1, 29.6, 32.0, 0.05, 8)
  }
  for (const [a, b] of faces(S)) {
    archPanel(win, a, b, S - 1.5, S - 0.25, 37.0, 38.2, 0.05, 8)
    archPanel(win, a, b, S + 0.25, S + 1.5, 37.0, 38.2, 0.05, 8)
    // clock face: a disc
    const L = 2 * S, u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * 0.08, a[1] + u[1] * s + n[1] * 0.08, z]
    const R = 1.15, zc = 40.6
    for (let i = 0; i < 12; i++) {
      const t0 = (i / 12) * 2 * Math.PI, t1 = ((i + 1) / 12) * 2 * Math.PI
      trim.tri(P(S, zc), P(S + R * Math.cos(t0), zc + R * Math.sin(t0)), P(S + R * Math.cos(t1), zc + R * Math.sin(t1)))
    }
  }
  // corner pinnacles round the gallery
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    lathe(sand, sx * (T + 0.1), sy * (T + 0.1), [[0.75, 33], [0.75, 39.6]], 10)
    lathe(roof, sx * (T + 0.1), sy * (T + 0.1), [[0.9, 39.6], [0, 43.2]], 10)
  }
  // Striped domed cap (square in plan): grey slate, red and cream bands, then
  // the white lantern.
  const prof: [number, number][] = [[3.45, C1], [3.3, 43.4], [3.05, 44.1], [2.7, 44.8], [2.25, 45.5], [1.75, 46.2], [1.25, 46.8], [0.85, 47.4]]
  const bandsOf = [roof, cone, roof, trim, roof, cone, roof]
  const sq = (h: number) => rect(-h, -h, h, h)
  for (let i = 0; i < prof.length - 1; i++) walls(bandsOf[i], sq(prof[i][0]), prof[i][1], prof[i + 1][1], sq(prof[i + 1][0]))
  cap(roof, sq(prof[0][0]), C1, false)
  cap(roof, sq(0.85), 47.4)
  lathe(trim, 0, 0, [[0.85, 47.4], [0.85, 49.6], [1.05, 49.6], [1.05, 49.9], [0.65, 50.5], [0.0, 51.3]], 8)

  const lit = (p: number[], n: number[]) => (Math.abs(n[2]) > 0.5 ? 0 : Math.max(0, 0.55 - 0.012 * p[2]))
  return [
    { part: sand, material: { ...finish('old-red-sandstone', 0xa85d52), floodlight: lit } },
    { part: gran, material: { ...finish('old-red-granite', 0xaeaaa1), floodlight: lit } },
    { part: cone, material: finish('old-red-cone', 0x9f4c47) },
    { part: roof, material: finish('old-red-slate', 0x7c858c) },
    { part: win, material: PALETTE.window },
    { part: trim, material: PALETTE.trim },
  ]
}

if (import.meta.main) await save('dal-old-red-courthouse', 'Old Red Courthouse', ANCHOR, BEARING, build(), 6500)
