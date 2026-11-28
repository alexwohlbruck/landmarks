/**
 * Goethe-Haus, Großer Hirschgraben 23-25, Frankfurt am Main: Goethe's
 * birthplace, two medieval houses joined and rebuilt 1755-56 by his father
 * into one Baroque town house; destroyed in 1944 and rebuilt 1947-51 as it
 * was. Original procedural geometry, CC0-1.0.
 * bun generators/frankfurt-goethe-haus.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/174501393,
 * 50.1112157, 8.6775754. The street front runs at 9.3 degrees (OSM), so the
 * catalog bearing is 9.3: +x is the street (Großer Hirschgraben, east), the
 * court wing at -x.
 *
 * Identity, in order: the tall narrow-fronted ochre house, its upper
 * storeys jettied a little over the street, grey stone window frames and
 * cornices, the red sandstone ground storey with the central door; the
 * steep dark slate roof with its two-storey centre dormer (Zwerchhaus) with
 * curved shoulders and a pediment with an oculus, and small dormers either
 * side; the rough rubble fire walls at both gable ends rising above the
 * roof, with the chimney.
 *
 * Evidence:
 *  - plan: OSM outline way/174501393 read in the turned frame: the front
 *    house x -4.4..7.3, y -7.6..6.1 (13.7 m front, 11.7 m deep) and the court
 *    wing x -10.9..-4.3, y 1.3..6.2. The office building behind (way/
 *    174501378) is not the Goethe-Haus and is left out.
 *  - heights: the published section (Rudolf Jung, "Goethe-Haus; Ansicht
 *    des Hofflügels und Querschnitt", public domain), 1:200 with a 10 m scale
 *    bar (0.0174 m/px): the sandstone ground storey and three upper storeys
 *    at 3.9, 7.1, 10.3 and eaves 13.6 m (review: the photo shows the three
 *    yellow storeys; the first pass had two); ridge 20 (the section's 19 m
 *    ridge raised a little to keep the roof as steep as the photo); the court
 *    wing's eaves 10.3, its roof drawn as a plain gable to 16 m. The centre
 *    dormer (one storey of three windows, a narrower one of one window, the
 *    pediment to 20.5 m), the window positions and the upright window
 *    proportions from Mylius's frontal photo (perspective-corrected); the
 *    jetties (0.15 m a storey) estimated from the section.
 *  - colours from the daylight photos: ochre render, grey stone frames,
 *    red sandstone ground storey, dark slate, the light rubble-and-render fire
 *    walls (lightened after review).
 *  - elevation 0. The street falls a little to the south (Mapterhorn,
 *    about 0.5 m across the front); the door stands 0.75 m up, on two
 *    steps, where the terrain puts the street at the door 0.55 m over the
 *    lowest corner.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Frankfurt Am Main-Goethe-Haus-Ansicht am Grossen Hirschgraben.jpg
 *    (Mylius, CC BY-SA 3.0): the street front.
 *    https://commons.wikimedia.org/wiki/File:Frankfurt_Am_Main-Goethe-Haus-Ansicht_am_Grossen_Hirschgraben.jpg
 *  - Goethe-Haus in Frankfurt am Main.jpg (Munin2005, CC BY-SA 3.0)
 *    https://commons.wikimedia.org/wiki/File:Goethe-Haus_in_Frankfurt_am_Main.jpg
 *  - Goethe-Haus FotoThalerTamas1.jpg (Thaler Tamas, CC BY-SA 4.0)
 *    https://commons.wikimedia.org/wiki/File:Goethe-Haus_FotoThalerTamas1.jpg
 *  - Goethe House Plan Cross-section.jpg (Rudolf Jung, public domain)
 *    https://commons.wikimedia.org/wiki/File:Goethe_House_Plan_Cross-section.jpg
 * No commercial imagery, no 3D city models. No look-only sources.
 *
 * Note: the house is plastered, not half-timbered; no photo shows timber
 * framing on it, so none is drawn.
 *
 * Left out: the window grilles of the ground storey, the house sign over the
 * door, the glazing bars, the rain pipes.
 *
 * Doubts: the back of the front house and the court wing are seen only in
 * the section; the court wing's mansard is drawn as a plain gable roof.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { boxF, cap, face, fac, pane, surround, walls, wallSlab, writeLods, bar, type XY } from './frankfurt-roemer'

const ID = 'frankfurt-goethe-haus'

function build() {
  const ochre = new Part(), grey = new Part(), sand = new Part(), slate = new Part(), win = new Part(), rubble = new Part()

  const X0 = -4.4, X1 = 7.3, Y0 = -7.57, Y1 = 6.1
  const EAVE = 13.6, RIDGE = 20.0, XR = (X0 + X1) / 2
  const J = [0, 0.15, 0.3, 0.45] // jetty of each upper storey over the street
  const storeys: [number, number][] = [[0, 3.9], [3.9, 7.1], [7.1, 10.3], [10.3, EAVE]]

  // The front house, storey by storey, each jettied a little further out.
  storeys.forEach(([z0, z1], i) => {
    // front and back in render (sandstone below), the party walls in rubble
    const xf = X1 + J[i]
    face(i === 0 ? sand : ochre, [[xf, Y0, z0], [xf, Y1, z0], [xf, Y1, z1], [xf, Y0, z1]], [1, 0, 0])
    face(ochre, [[X0, Y0, z0], [X0, Y1, z0], [X0, Y1, z1], [X0, Y0, z1]], [-1, 0, 0])
    face(i === 0 ? sand : rubble, [[X0, Y0, z0], [xf, Y0, z0], [xf, Y0, z1], [X0, Y0, z1]], [0, -1, 0])
    face(i === 0 ? sand : rubble, [[X0, Y1, z0], [xf, Y1, z0], [xf, Y1, z1], [X0, Y1, z1]], [0, 1, 0])
    if (i > 0) {
      // the jetty's soffit and a grey cornice band at the floor line
      face(grey, [[X1 + J[i - 1], Y0, z0], [X1 + J[i], Y0, z0], [X1 + J[i], Y1, z0], [X1 + J[i - 1], Y1, z0]], [0, 0, -1])
    }
  })
  const front = (i: number) => fac([X1 + J[i], Y0], [X1 + J[i], Y1])
  for (const i of [1, 2, 3]) boxF(grey, front(i), -0.02, front(i).L + 0.02, storeys[i][0], storeys[i][0] + 0.3, 0, 0.18)
  boxF(grey, front(3), -0.05, front(3).L + 0.05, EAVE - 0.4, EAVE, 0, 0.35)
  // corner pilaster strips, grey
  for (const i of [1, 2, 3]) for (const s of [0, front(i).L - 0.45]) boxF(grey, front(i), s, s + 0.45, storeys[i][0] + 0.3, storeys[i][1] - 0.4, 0, 0.06, false)

  // The ground storey: sandstone, three windows, the door, three windows.
  const F0 = front(0)
  const bays = [1.35, 2.95, 4.5, 6.1, 7.95, 9.95, 12.1]
  bays.forEach((s, k) => {
    if (k === 3) {
      pane(slate, F0, s, 0.7, 0.75, 3.0, 'seg', 0.05, 6)
      surround(grey, F0, s, 0.7, 0.75, 3.0, 'seg', 0.28, 0.18, 6)
      boxF(sand, F0, s - 1.0, s + 1.0, 0, 0.45, 0, 0.75) // the steps
      boxF(sand, F0, s - 0.85, s + 0.85, 0.45, 0.75, 0, 0.4)
    } else {
      const hw = k < 3 ? 0.42 : 0.52
      pane(win, F0, s, hw, 1.1, 3.4, 'flat', 0.05)
      surround(sand, F0, s, hw, 1.1, 3.4, 'flat', 0.2, 0.12, 2, 0.15)
    }
  })
  // The three upper storeys: one upright window per bay in a grey stone
  // frame with a sill.
  for (const i of [1, 2, 3]) {
    const F = front(i), [z0] = storeys[i]
    bays.forEach((s, k) => {
      const hw = k < 4 ? 0.44 : 0.55
      pane(win, F, s, hw, z0 + 0.55, z0 + 2.75, 'flat', 0.05)
      surround(grey, F, s, hw, z0 + 0.55, z0 + 2.75, 'flat', 0.15, 0.12, 2, 0.12)
    })
  }
  // Side and back walls are plain; the back has a row of windows per storey.
  {
    const B = fac([X0, Y1], [X0, Y0])
    for (const [z0] of storeys) for (const s of [2.5, 5.5, 8.5, 11.5]) pane(win, B, s, 0.5, z0 + 0.9, z0 + 2.6, 'flat', 0.04)
  }

  // The roof: a steep saddle, ridge along the street.
  const rs = (RIDGE - EAVE) / ((X1 + J[3] - X0) / 2)
  const XF = X1 + J[3], XM = (X0 + XF) / 2
  const o = 0.4
  face(slate, [[XF + o, Y0 - 0.1, EAVE - o * rs], [XF + o, Y1 + 0.1, EAVE - o * rs], [XM, Y1 + 0.1, RIDGE], [XM, Y0 - 0.1, RIDGE]], [1, 0, 1 / rs])
  face(slate, [[X0 - o, Y1 + 0.1, EAVE - o * rs], [X0 - o, Y0 - 0.1, EAVE - o * rs], [XM, Y0 - 0.1, RIDGE], [XM, Y1 + 0.1, RIDGE]], [-1, 0, 1 / rs])
  face(slate, [[XF + o, Y0 - 0.1, EAVE - o * rs], [XF + o, Y1 + 0.1, EAVE - o * rs], [XF, Y1 + 0.1, EAVE], [XF, Y0 - 0.1, EAVE]], [0, 0, -1])
  // The fire walls at both gable ends, rubble, a little above the roof, with a chimney.
  for (const [y, sgn] of [[Y0, -1], [Y1, 1]] as [number, number][]) {
    const a: XY = sgn < 0 ? [X0, y] : [XF, y], b: XY = sgn < 0 ? [XF, y] : [X0, y]
    const F = fac(a, b)
    const top = (s: number) => {
      // height of the roof line at s along this wall, plus the wall's rise above it
      const x = a[0] + (b[0] - a[0]) * (s / F.L)
      return RIDGE - Math.abs(x - XM) * rs + 0.45
    }
    const outline: XY[] = [[0, EAVE - 0.3], [F.L, EAVE - 0.3], [F.L, top(F.L)], [F.L / 2, top(F.L / 2)], [0, top(0)]]
    wallSlab(rubble, F.a, F.b, outline, 0.55, -0.45)
    // sandstone coping steps on the street side and a chimney
    const sF = sgn < 0 ? F.L - 0.5 : 0.5
    boxF(sand, F, sF - 0.5, sF + 0.5, EAVE - 0.3, EAVE + 0.5, 0.1, 0.4)
  }
  {
    const c: XY = [XM - 1.0, Y1 - 0.6]
    const r: XY[] = [[c[0] - 0.45, c[1] - 0.35], [c[0] + 0.45, c[1] - 0.35], [c[0] + 0.45, c[1] + 0.35], [c[0] - 0.45, c[1] + 0.35]]
    walls(rubble, r, 16, RIDGE + 1.4); cap(rubble, r, RIDGE + 1.4)
  }

  // The Zwerchhaus: two storeys over the eaves, curved shoulders, pediment.
  {
    const c = 5.8, w0 = 2.55, w1 = 1.55, Z1 = EAVE + 2.8, Z2 = Z1 + 2.3, Z3 = Z2 + 1.9
    const F = front(3)
    const s0 = c - w0, s1 = c + w0
    // depth back into the roof
    const D = 3.2
    const P = F.P
    // lower storey: front, cheeks, flat top under the roof
    face(ochre, [P(s0, EAVE, 0), P(s1, EAVE, 0), P(s1, Z1, 0), P(s0, Z1, 0)], F.N)
    face(ochre, [P(s0, EAVE, 0), P(s0, EAVE, -D), P(s0, Z1, -D), P(s0, Z1, 0)], F.V(-1, 0, 0))
    face(ochre, [P(s1, EAVE, 0), P(s1, EAVE, -D), P(s1, Z1, -D), P(s1, Z1, 0)], F.V(1, 0, 0))
    face(slate, [P(s0 - 0.15, Z1, 0.2), P(s1 + 0.15, Z1, 0.2), P(s1 + 0.15, Z1 + 0.5, -D), P(s0 - 0.15, Z1 + 0.5, -D)], [F.N[0], F.N[1], 3])
    // upper storey, narrower, with the shoulders curving down to the lower one
    face(ochre, [P(c - w1, Z1, 0), P(c + w1, Z1, 0), P(c + w1, Z2, 0), P(c - w1, Z2, 0)], F.N)
    for (const sg of [-1, 1]) {
      const curve: XY[] = []
      for (let k = 0; k <= 6; k++) { const t = (k / 6) * Math.PI / 2; curve.push([c + sg * (w1 + (w0 - w1) * (1 - Math.sin(t))), Z1 + (Z2 - Z1) * 0.75 * (1 - Math.cos(t))]) }
      // shoulder: a slab under the curve, from the lower storey's top to the curve
      const shoulder: XY[] = sg < 0 ? [[c - w0, Z1], [c - w1, Z1], ...[...curve].reverse().filter((q) => q[0] > c - w0 - 1e-6 && q[0] < c - w1 + 1e-6)] : [[c + w1, Z1], [c + w0, Z1], ...curve.filter((q) => q[0] < c + w0 + 1e-6 && q[0] > c + w1 - 1e-6).reverse()]
      wallSlab(ochre, F.a, F.b, shoulder, 0.5, -0.5)
      bar(grey, F, sg < 0 ? [...curve] : [...curve], 0.22, 0, 0.12)
      face(ochre, [P(c + sg * w1, Z1, 0), P(c + sg * w1, Z1, -D), P(c + sg * w1, Z2, -D), P(c + sg * w1, Z2, 0)], F.V(sg, 0, 0))
    }
    // cornice and pediment with an oculus
    boxF(grey, F, c - w1 - 0.25, c + w1 + 0.25, Z2, Z2 + 0.3, 0, 0.25)
    wallSlab(ochre, F.a, F.b, [[c - w1 - 0.2, Z2 + 0.3], [c + w1 + 0.2, Z2 + 0.3], [c, Z3]], D, -D)
    bar(grey, F, [[c - w1 - 0.35, Z2 + 0.25], [c, Z3 + 0.15], [c + w1 + 0.35, Z2 + 0.25]], 0.26, -0.1, 0.2)
    const ring: XY[] = []
    for (let k = 0; k <= 12; k++) { const t = (k / 12) * 2 * Math.PI; ring.push([c + 0.42 * Math.cos(t), Z2 + 1.05 + 0.42 * Math.sin(t)]) }
    const C = F.P(c, Z2 + 1.05, 0.05)
    for (let k = 0; k < 12; k++) face(win, [C, F.P(ring[k][0], ring[k][1], 0.05), F.P(ring[k + 1][0], ring[k + 1][1], 0.05)], F.N)
    bar(grey, F, ring, 0.14, 0, 0.1)
    // the roof over the upper storey runs back into the main roof
    face(slate, [P(c - w1 - 0.2, Z2, 0.15), P(c + w1 + 0.2, Z2, 0.15), P(c + w1 + 0.2, Z2, -D), P(c - w1 - 0.2, Z2, -D)], [0, 0, 1])
    // corner pilasters and windows: three below, one above
    for (const s of [s0, s1 - 0.35]) boxF(grey, F, s, s + 0.35, EAVE, Z1, 0, 0.08, false)
    for (const s of [c - w1, c + w1 - 0.3]) boxF(grey, F, s, s + 0.3, Z1, Z2, 0, 0.08, false)
    for (const s of [c - 1.6, c, c + 1.6]) {
      pane(win, F, s, 0.42, EAVE + 0.4, EAVE + 2.4, 'flat', 0.05)
      surround(grey, F, s, 0.42, EAVE + 0.4, EAVE + 2.4, 'flat', 0.14, 0.1, 2, 0.1)
    }
    pane(win, F, c, 0.4, Z1 + 0.3, Z1 + 1.95, 'flat', 0.05)
    surround(grey, F, c, 0.4, Z1 + 0.3, Z1 + 1.95, 'flat', 0.14, 0.1, 2, 0.1)
  }

  // Small dormers on the street slope: two low, one high.
  const dormer = (s: number, z: number, w: number, h: number) => {
    // the roof plane at height z is at x = XF - (z - EAVE) / rs
    const x = XF - (z - EAVE) / rs
    const D = h / rs + 0.3
    const A: V3 = [x, Y0 + s - w, z], B: V3 = [x, Y0 + s + w, z]
    const At: V3 = [x, Y0 + s - w, z + h], Bt: V3 = [x, Y0 + s + w, z + h], T: V3 = [x, Y0 + s, z + h + w * 0.8]
    face(grey, [A, B, Bt, T, At], [1, 0, 0])
    const Fd = fac([x, Y0 + s - w], [x, Y0 + s + w])
    pane(win, Fd, w, w * 0.62, z + 0.18, z + h - 0.15, 'flat', 0.04)
    const back = (q: V3): V3 => [q[0] - D, q[1], q[2]]
    face(slate, [At, T, back(T), back(At)], [0, -1, 1])
    face(slate, [T, Bt, back(Bt), back(T)], [0, 1, 1])
    face(slate, [A, At, back(At)], [0, -1, 0])
    face(slate, [B, Bt, back(Bt)], [0, 1, 0])
  }
  dormer(1.6, EAVE + 0.5, 0.65, 1.7)
  dormer(10.2, EAVE + 0.5, 0.7, 1.8)
  dormer(12.2, EAVE + 0.5, 0.6, 1.6)
  dormer(11.2, EAVE + 3.3, 0.45, 1.2)

  // ---- The court wing --------------------------------------------------------------
  {
    const r: XY[] = [[-10.9, 1.4], [X0, 1.3], [X0, Y1], [-10.9, 6.15]]
    walls(ochre, r, 0, 10.3)
    const S = fac(r[0], r[1])
    for (const [z0] of storeys.slice(0, 3)) for (const s of [1.4, 3.3, 5.2]) {
      pane(win, S, s, 0.5, z0 + 0.8, z0 + 2.6, 'flat', 0.05)
      surround(grey, S, s, 0.5, z0 + 0.8, z0 + 2.6, 'flat', 0.13, 0.08, 2)
    }
    const ym = 3.75, s = (16 - 10.3) / 2.4
    face(slate, [[-11.2, 1.0, 10.3 - 0.3 * s], [X0, 1.0, 10.3 - 0.3 * s], [X0, ym, 16], [-11.2, ym, 16]], [0, -1, 1 / s])
    face(slate, [[X0, 6.45, 10.3 - 0.3 * s], [-11.2, 6.45, 10.3 - 0.3 * s], [-11.2, ym, 16], [X0, ym, 16]], [0, 1, 1 / s])
    face(ochre, [[-10.9, 1.4, 10.3], [-10.9, 6.15, 10.3], [-10.9, ym, 16]], [-1, 0, 0])
    for (const sx of [1.2, 3.2]) {
      // two dormers on its south slope
      const x = -10.9 + sx * 1.6, y = 2.2
      boxF(grey, fac([x - 0.5, y], [x + 0.5, y]), 0, 1.0, 11.2, 12.6, -1.4, 0)
    }
  }

  const parts: { part: Part; material: MaterialSpec }[] = [
    { part: ochre, material: { ...finish('goethe-ochre', 0xf0da9a), floodlight: (_p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : 0.5) } },
    { part: grey, material: finish('goethe-grey-stone', 0xb3b8bd) },
    { part: sand, material: finish('goethe-sandstone', 0xc4876f) },
    { part: slate, material: finish('goethe-slate', 0x6a707a) },
    { part: win, material: PALETTE.window },
    { part: rubble, material: finish('goethe-rubble', 0xc6ae9d) },
  ]
  return parts
}

if (import.meta.main) await writeLods(ID, 'Goethe-Haus', [50.1112157, 8.6775754], 9.3, build(), null, 5000)
