/**
 * Festhalle, Messe Frankfurt, Ludwig-Erhard-Anlage 1, Frankfurt am Main:
 * the domed hall of 1907-09 by Friedrich von Thiersch, in its day the
 * largest domed building in Europe; red sandstone and render, a zinc
 * roof rising to an iron-and-glass dome. Original procedural geometry,
 * CC0-1.0.
 * bun generators/frankfurt-festhalle.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/1390237893,
 * 50.1118731, 8.6508558. The building's axis runs at 170 degrees (OSM
 * outline edges), so the catalog bearing is 170: the entrance front faces
 * -y (north-north-west, the Ludwig-Erhard-Anlage forecourt), +x is
 * west-south-west.
 *
 * Identity, in order: the great low dome, its upper part iron and glass
 * (dark by day, glowing at night) on a ring of small windows with a
 * glazed lantern; the broad grey zinc roof sweeping down from it to the
 * cream walls with their big round-headed windows; the red sandstone
 * entrance rotunda with its ring of columns, balustrade with urns, drum
 * with round windows and dark dome; the curved two-storey arcaded
 * colonnade either side of it; the square corner towers with their dark
 * domes and lanterns; the plain cream block on the front's east corner.
 *
 * Evidence:
 *  - plan: OSM outline way/1390237893 and its parts read in the turned
 *    frame: the lower roof 401730564 (with its curved front and back), the
 *    dome 401730566 (an ellipse 54.4 x 46.2 m about (1.4, -2.5)), the
 *    rotunda 1391815417 (r 7.3) on its ring 1390237891 (r 11) with the
 *    porch 1390237892, the colonnades 1390237890, 1077516896, 401730565,
 *    1077516897, the corner blocks 401730570/1390237889 (west tower),
 *    401730571 (east block), 401730572 and 401730573 (rear towers),
 *    551912627 (rear annex), the rear block 1390237894 and the rear
 *    colonnade 401730569. The front's two halves are mirrored about the
 *    rotunda's axis (OSM shows them symmetric within 1 m).
 *  - heights: OSM part heights where tagged: colonnades 10-11 m, rotunda
 *    ring 13 m, rotunda drum 13-17 m and dome to 22 m, the lower roof's
 *    walls 17 m, rear block 12 m, east block 15 m, cross-checked on
 *    Daniel Falke's frontal photo (rotunda ring 22 m = 460 px). The dome:
 *    OSM tags it 28 m, the photos from the forecourt and the Marriott put
 *    its crown higher; de.wikipedia gives "about 40 m" for the domed
 *    building. Drawn with the lower roof to 25.5 m, the glass dome 26.5-
 *    33.6 m and its lantern to 35.2 m (estimated between the two). Towers
 *    about 30 m to the lantern, scaled from the 2025 photos from the
 *    Maritim (estimated).
 *  - colours from the daylight photos: red sandstone, cream render, the
 *    grey-blue zinc/slate lower roof (OSM tags copper/seagreen, but the
 *    photos show grey), the darker grey glass dome, the dark grey domes of
 *    the rotunda and towers.
 *  - night: Bohao Zhao's night photo: the glass dome and lantern glow
 *    green-white (a neon material in the dome's own colour), the big
 *    windows lit, the rotunda floodlit.
 *  - terrain: the Messe forecourt is flat (Mapterhorn, within 0.5 m); the
 *    DEM rises up to 15 m over the neighbouring halls at the rear south-
 *    east corner, burying the 8 m rear annex roof by up to 3 m there in
 *    `terrain.ts check`. That is the neighbours in the DEM, not ground;
 *    elevation 0.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Festhalle (Frankfurt, GER) 2018.jpg (Daniel Falke, CC BY-SA 4.0): the rotunda, frontal.
 *    https://commons.wikimedia.org/wiki/File:Festhalle_(Frankfurt,_GER)_2018.jpg
 *  - Festhalle Frankfurt 2016.jpg (Whgler, CC BY-SA 4.0): from above, the front.
 *    https://commons.wikimedia.org/wiki/File:Festhalle_Frankfurt_2016.jpg
 *  - Festhalle Frankfurt and Messe grounds from the Maritim Hotel (2025).jpg and
 *    Festhalle and Messeturm seen from the Maritim Hotel, Frankfurt (2025).jpg
 *    (Paul Colin Hennig firstdorsal.eu, CC BY-SA 4.0)
 *    https://commons.wikimedia.org/wiki/File:Festhalle_Frankfurt_and_Messe_grounds_from_the_Maritim_Hotel_(2025).jpg
 *    https://commons.wikimedia.org/wiki/File:Festhalle_and_Messeturm_seen_from_the_Maritim_Hotel,_Frankfurt_(2025).jpg
 *  - Festhalle-ffm005.jpg (dontworry, CC BY-SA 3.0): front from the forecourt.
 *    https://commons.wikimedia.org/wiki/File:Festhalle-ffm005.jpg
 *  - Messe-Marriot-0195.jpg (Messe Frankfurt GmbH, CC BY-SA 3.0 de): from above.
 *    https://commons.wikimedia.org/wiki/File:Messe-Marriot-0195.jpg
 *  - Frankfurt Messe bei Nacht - panoramio.jpg (Bohao Zhao, CC BY 3.0): night.
 *    https://commons.wikimedia.org/wiki/File:Frankfurt_Messe_bei_Nacht_-_panoramio.jpg
 * No commercial imagery, no 3D city models (Hessen LoD2 not used). No
 * look-only sources.
 *
 * Left out: the colonnade's yellow railings, the rotunda's urns as single
 * knobs, the sculpture on the rotunda's balustrade, the flags, the glazed
 * roofs of the halls around, the fine glazing bars of the dome (radial
 * ribs only in the detail model).
 *
 * Doubts: the dome's height (above); the rear and the sides are seen only
 * from above; the towers' stages are simplified; the back colonnade and
 * rear block are drawn plain.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  writeLods, prism, box, straight as S, arc, wrect, warch, wframe, wbox, band, balustrade, column, face, cap, setCurve, lathe, ccw, arcade, walls,
  type Mat, type XY, type Wall,
} from './frankfurt-alte-oper'

export const ID = 'frankfurt-festhalle'
const BEARING = 170
const ANCHOR: [number, number] = [50.1118731, 8.6508558]

const EAVE = 17.0, RING = 27.0, BAND = 28.0, DTOP = 37.0
const DC: XY = [1.35, -2.55], DA = 27.2, DB = 23.1
const AX = 1.1 // the rotunda's axis (mirror line of the front)

// The lower roof's outline (eave), from OSM 401730564.
const FRONT: XY[] = [[-27.78, -26.0], [-24.82, -28.36], [-21.21, -30.21], [-17.14, -32.06], [-14.12, -33.0], [-10.58, -33.77], [-6.54, -34.34], [-1.86, -34.44], [2.93, -34.4], [7.55, -34.14], [12.57, -33.55], [16.52, -32.47], [19.91, -31.32], [22.68, -29.93], [28.61, -26.19]]
const BACK: XY[] = [[30.97, 21.46], [28.02, 23.21], [22.78, 26.07], [14.88, 29.43], [7.87, 30.94], [-0.5, 32.01], [-7.78, 31.5], [-15.68, 29.29], [-22.07, 26.82], [-28.53, 21.68]]
const LR: XY[] = [[-55.7, -25.9], ...FRONT, [57.3, -26.3], [57.4, 21.4], ...BACK, [-55.7, 21.8]]
// The west half of the front colonnade, mirrored for the east.
const COLW: XY[] = [[5.75, -34.24], [7.55, -34.14], [12.57, -33.55], [16.52, -32.47], [19.91, -31.32], [22.68, -29.93], [28.61, -26.19], [45.65, -26.25], [45.62, -38.26], [31.21, -38.22], [29.08, -39.68], [27.31, -40.77], [25.39, -41.71], [23.25, -42.78], [21.3, -43.55], [19.27, -44.3], [17.25, -44.91], [15.14, -45.4], [12.0, -46.01], [10.73, -38.74], [8.45, -35.95]]
const mirror = (r: XY[]): XY[] => r.map(([x, y]) => [2 * AX - x, y] as XY).reverse()

function build(D: boolean): Mat[] {
  const sand = new Part(), render = new Part(), copper = new Part(), win = new Part(), dome = new Part(), metal = new Part()
  setCurve(D ? 1.2 : 2.6)
  const AN = D ? 8 : 5, SEG = D ? 10 : 6

  // ---- the hall's walls under the lower roof, with their big round-headed windows
  const lr = ccw(LR)
  walls(render, lr, 0, EAVE)
  for (let i = 0; i < lr.length; i++) {
    const w = S(lr[i], lr[(i + 1) % lr.length])
    band(render, w, 0, w.L, EAVE - 0.6, EAVE, 0.45)
    if (w.L < 3.3) continue
    const n = Math.max(1, Math.round(w.L / 6.2)), p = w.L / n
    for (let k = 0; k < n; k++) {
      const c = (k + 0.5) * p, hw = Math.min(1.95, p / 2 - 0.5)
      warch(win, w, c, hw, 11.7, 14.6, 0.06, AN)
      if (D) {
        wframe(render, w, c, hw, 11.7, 14.6, 0.22, 0.12, AN)
        for (const f of [-1 / 3, 1 / 3]) wbox(render, w, c + f * hw * 2 - 0.08, c + f * hw * 2 + 0.08, 11.7, 14.6 + hw * Math.sqrt(1 - (f * 2) ** 2) - 0.1, 0, 0.1, false)
        wbox(render, w, c - hw, c + hw, 13.9, 14.05, 0, 0.1, false)
      }
    }
  }

  // ---- the lower roof: a polar mesh from the dome ring out to the eave
  {
    const angs: number[] = []
    const NT = D ? 72 : 20
    for (let k = 0; k < NT; k++) angs.push(-Math.PI + (k / NT) * 2 * Math.PI)
    for (const q of lr) angs.push(Math.atan2(q[1] - DC[1], q[0] - DC[0]))
    angs.sort((a, b) => a - b)
    const uniq = angs.filter((a, i) => i === 0 || a - angs[i - 1] > 1e-4)
    const rOut = (t: number) => {
      const dx = Math.cos(t), dy = Math.sin(t)
      let best = Infinity
      for (let i = 0; i < lr.length; i++) {
        const a = lr[i], b = lr[(i + 1) % lr.length]
        const ex = b[0] - a[0], ey = b[1] - a[1], den = dx * ey - dy * ex
        if (Math.abs(den) < 1e-12) continue
        const s = ((a[0] - DC[0]) * ey - (a[1] - DC[1]) * ex) / den, u = ((a[0] - DC[0]) * dy - (a[1] - DC[1]) * dx) / den
        if (s > 0 && u >= -1e-6 && u <= 1 + 1e-6) best = Math.min(best, s)
      }
      return best
    }
    const rIn = (t: number) => 1 / Math.sqrt((Math.cos(t) / DA) ** 2 + (Math.sin(t) / DB) ** 2)
    const NR = D ? 6 : 3
    const P = (t: number, f: number): V3 => {
      const r0 = rIn(t), r1 = rOut(t) + 0.45, r = r0 + (r1 - r0) * f
      return [DC[0] + r * Math.cos(t), DC[1] + r * Math.sin(t), EAVE - 0.15 + (RING - EAVE + 0.15) * (1 - f ** 1.7)]
    }
    const grid = uniq.map((t) => Array.from({ length: NR + 1 }, (_, j) => P(t, j / NR)))
    const nrm = (i: number, j: number): V3 => {
      const n = grid.length, a = grid[(i + 1) % n][j], b = grid[(i - 1 + n) % n][j], c = grid[i][Math.min(NR, j + 1)], d = grid[i][Math.max(0, j - 1)]
      const u: V3 = [a[0] - b[0], a[1] - b[1], a[2] - b[2]], v: V3 = [c[0] - d[0], c[1] - d[1], c[2] - d[2]]
      const x: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
      const l = Math.hypot(...x) || 1, sg = x[2] < 0 ? -1 : 1
      return [(sg * x[0]) / l, (sg * x[1]) / l, (sg * x[2]) / l]
    }
    for (let i = 0; i < grid.length; i++) {
      const i2 = (i + 1) % grid.length
      for (let j = 0; j < NR; j++) {
        copper.tri(grid[i][j], grid[i2][j], grid[i2][j + 1], undefined, undefined, undefined, [nrm(i, j), nrm(i2, j), nrm(i2, j + 1)])
        copper.tri(grid[i][j], grid[i2][j + 1], grid[i][j + 1], undefined, undefined, undefined, [nrm(i, j), nrm(i2, j + 1), nrm(i, j + 1)])
      }
    }
  }

  // ---- the ring of small windows and the iron-and-glass dome
  {
    const NT = D ? 48 : 20
    const E = (t: number, k: number, z: number): V3 => [DC[0] + DA * k * Math.cos(t), DC[1] + DB * k * Math.sin(t), z]
    for (let i = 0; i < NT; i++) {
      const t0 = (i / NT) * 2 * Math.PI, t1 = ((i + 1) / NT) * 2 * Math.PI, tm = (t0 + t1) / 2
      const nm: V3 = [Math.cos(tm) / DA, Math.sin(tm) / DB, 0]
      face(render, [E(t0, 1, RING - 0.3), E(t1, 1, RING - 0.3), E(t1, 1, BAND), E(t0, 1, BAND)], nm)
      // the band's small windows, glowing with the dome
      face(dome, [E(t0 + 0.02, 1.004, RING + 0.15), E(t1 - 0.02, 1.004, RING + 0.15), E(t1 - 0.02, 1.004, BAND - 0.25), E(t0 + 0.02, 1.004, BAND - 0.25)], nm)
    }
    // the glass dome: an elliptical cap from the band up to the lantern
    const prof: [number, number][] = []
    const NV = D ? 7 : 4
    for (let k = 0; k <= NV; k++) { const a = (k / NV) * (Math.PI / 2) * 0.9; prof.push([Math.cos(a) * 1.0 + 0.0, BAND + (DTOP - BAND) * Math.sin(a) / Math.sin((Math.PI / 2) * 0.9)]) }
    const KL = 0.19 // the lantern's relative radius
    prof[NV] = [KL, DTOP]
    for (let i = 0; i < NT; i++) {
      const t0 = (i / NT) * 2 * Math.PI, t1 = ((i + 1) / NT) * 2 * Math.PI
      for (let k = 0; k < NV; k++) {
        const [k0, z0] = prof[k], [k1, z1] = prof[k + 1]
        const n = (t: number, _k: number, _z: number): V3 => [Math.cos(t) / DA, Math.sin(t) / DB, Math.max(0.004, (k0 - k1) / ((z1 - z0) || 1))]
        dome.tri(E(t0, k0, z0), E(t1, k0, z0), E(t1, k1, z1), undefined, undefined, undefined, [n(t0, k0, z0), n(t1, k0, z0), n(t1, k1, z1)])
        dome.tri(E(t0, k0, z0), E(t1, k1, z1), E(t0, k1, z1), undefined, undefined, undefined, [n(t0, k0, z0), n(t1, k1, z1), n(t0, k1, z1)])
      }
      // lantern: a glazed band and a metal cap
      const nm: V3 = [Math.cos((t0 + t1) / 2) / DA, Math.sin((t0 + t1) / 2) / DB, 0]
      face(dome, [E(t0, KL, DTOP), E(t1, KL, DTOP), E(t1, KL, DTOP + 1.0), E(t0, KL, DTOP + 1.0)], nm)
      face(metal, [E(t0, KL + 0.01, DTOP + 1.0), E(t1, KL + 0.01, DTOP + 1.0), E(t1, 0, DTOP + 1.6), E(t0, 0, DTOP + 1.6)], [nm[0], nm[1], 0.1])
    }
    if (D) {
      // radial ribs over the glass, and the flagpole
      for (let i = 0; i < 32; i++) {
        const t = (i / 32) * 2 * Math.PI
        for (let k = 0; k < NV; k++) {
          const [k0, z0] = prof[k], [k1, z1] = prof[k + 1]
          const a = E(t, k0 * 1.004, z0 + 0.05), b = E(t, k1 * 1.004, z1 + 0.05), w = 0.13
          const tx = -Math.sin(t) * w, ty = Math.cos(t) * w
          face(metal, [[a[0] - tx, a[1] - ty, a[2]], [a[0] + tx, a[1] + ty, a[2]], [b[0] + tx, b[1] + ty, b[2]], [b[0] - tx, b[1] - ty, b[2]]], [Math.cos(t), Math.sin(t), 1.2])
        }
      }
      lathe(metal, DC[0], DC[1], [[0, DTOP + 1.5], [0.12, DTOP + 1.5], [0.07, DTOP + 9.5], [0, DTOP + 9.6]], 5)
    }
  }

  // ---- the front colonnades, two storeys of arcades under a balustrade
  const COLH = 10.4
  for (const half of [COLW, mirror(COLW)]) {
    const c = ccw(half)
    prism(sand, c, 0, COLH, false)
    cap(metal, c, COLH)
    // the outer face: from the tower round to the rotunda (the edges whose outward normal faces -y)
    for (let i = 0; i < c.length; i++) {
      const a = c[i], b = c[(i + 1) % c.length]
      const w = S(a, b), nrm = w.N(0)
      if (nrm[1] > -0.35 || w.L < 1.5) continue
      colonnadeFace(w)
    }
    // the terrace's balustrade along its front edge
  }
  function colonnadeFace(w: Wall) {
    const L = w.L, n = Math.max(1, Math.round(L / (D ? 3.1 : 4.2))), p = L / n
    const ops = Array.from({ length: n }, (_, k) => ({ c: (k + 0.5) * p, hw: Math.min(1.05, p / 2 - 0.35), zs: 8.3 }))
    if (D) {
      // real arcades standing 0.8 proud, dark recesses behind
      arcade(sand, (u, ww, z) => w.M(u, z, 0.8 - ww), 0, L, 0.8, 5.4, 9.2, ops, 6, false)
      arcade(sand, (u, ww, z) => w.M(u, z, 0.8 - ww), 0, L, 0.8, 0, 4.6, ops.map((o) => ({ ...o, hw: Math.min(1.1, p / 2 - 0.3), zs: 3.6 })), 6, false)
      band(sand, w, 0, L, 4.6, 5.4, 1.0)
      band(sand, w, 0, L, 9.2, 9.6, 1.05)
    } else {
      for (let k = 0; k <= n; k++) wbox(sand, w, Math.max(0, k * p - 0.3), Math.min(L, k * p + 0.3), 0, 9.4, 0, 0.35, false)
      band(sand, w, 0, L, 4.6, 5.3, 0.45)
    }
    for (const o of ops) {
      warch(win, w, o.c, o.hw, 5.5, 8.3, 0.04, AN)
      if (D) wrect(win, w, o.c - o.hw, o.c + o.hw, 0.4, 4.5, 0.04)
      else wrect(win, w, o.c - o.hw, o.c + o.hw, 0.6, 3.9, 0.04)
    }
    balustrade(sand, w, 0, L, 9.6, 0.8, D ? 1.0 : 0.4, D, 0.3, p)
  }

  // ---- the entrance rotunda
  {
    const RX = AX, RY = -44.5
    lathe(sand, RX, RY, [[0, 0], [11.0, 0], [11.0, 5.6], [10.6, 5.9], [0, 5.9]], D ? 32 : 12)
    // the drum behind the ring of columns: windows between
    lathe(sand, RX, RY, [[0, 5.9], [8.6, 5.9], [8.6, 12.3], [0, 12.3]], D ? 24 : 10)
    const NC = D ? 14 : 8
    for (let k = 0; k < NC; k++) {
      const a = Math.PI + (k / (NC - 1)) * Math.PI // the front half (towards -y)
      const cx = RX + 9.9 * Math.cos(a), cy = RY + 9.9 * Math.sin(a)
      column(sand, cx, cy, 5.9, 12.3, 0.5, SEG, D)
      if (k < NC - 1) {
        const am = Math.PI + ((k + 0.5) / (NC - 1)) * Math.PI
        const dw = arc(RX, RY, 8.6, am - 0.12, am + 0.12)
        wrect(win, dw, 0.25, dw.L - 0.25, 7.2, 11.2, 0.05)
      }
    }
    // entablature, balustrade, urns, the upper drum with oculi, the dome
    lathe(sand, RX, RY, [[0, 12.3], [10.6, 12.3], [10.9, 12.8], [11.1, 13.3], [0, 13.3]], D ? 32 : 12)
    const bw = arc(RX, RY, 10.75, Math.PI, 2 * Math.PI)
    balustrade(sand, bw, 0, bw.L, 13.3, 1.0, 0, D, 0.35, bw.L / 8)
    for (let k = 0; k <= 8; k += D ? 1 : 2) {
      const a = Math.PI + (k / 8) * Math.PI
      lathe(sand, RX + 10.6 * Math.cos(a), RY + 10.6 * Math.sin(a), [[0, 14.3], [0.3, 14.3], [0.42, 14.8], [0.25, 15.3], [0, 15.4]], D ? 8 : 5)
    }
    lathe(sand, RX, RY, [[0, 13.3], [7.3, 13.3], [7.3, 16.6], [7.6, 16.9], [7.6, 17.2], [0, 17.2]], D ? 32 : 12)
    const dw = arc(RX, RY, 7.3, Math.PI + 0.1, 2 * Math.PI - 0.1)
    for (let k = 0; k < 7; k++) { const s = (dw.L * (k + 0.5)) / 7; disc(dw, s, 15.0, 0.5) }
    const dp: [number, number][] = []
    for (let k = 0; k <= (D ? 8 : 4); k++) { const t = (k / (D ? 8 : 4)) * (Math.PI / 2); dp.push([7.4 * Math.cos(t), 17.2 + 4.6 * Math.sin(t)]) }
    dp[dp.length - 1] = [0.0, 21.8]
    lathe(metal, RX, RY, [[7.65, 17.2], ...dp.slice(1)], D ? 32 : 12)
    lathe(metal, RX, RY, [[0, 21.75], [0.6, 21.75], [0.5, 22.3], [0, 22.4]], 8)
    // the arched porch in front, a balcony on it
    box(sand, RX - 2.95, -58.9, RX + 2.95, -54.0, 0, 6.4)
    const pf = S([RX - 2.95, -58.9], [RX + 2.95, -58.9])
    warch(win, pf, pf.L / 2, 1.5, 0, 4.0, 0.06, AN)
    wframe(sand, pf, pf.L / 2, 1.5, 0, 4.0, 0.4, 0.3, AN)
    balustrade(sand, pf, 0, pf.L, 6.4, 0.9, 0, D)
    // two round medallions either side of the porch
    for (const a of [Math.PI * 1.32, Math.PI * 1.68]) { const w2 = arc(RX, RY, 11.0, a - 0.06, a + 0.06); disc(w2, w2.L / 2, 3.2, 0.75) }
  }
  function disc(w: Wall, s: number, z: number, r: number) {
    const n = D ? 12 : 8, pts: XY[] = Array.from({ length: n }, (_, k) => [s + r * Math.cos((k / n) * 2 * Math.PI), z + r * Math.sin((k / n) * 2 * Math.PI)] as XY)
    const C = w.M(s, z, 0.08)
    for (let k = 0; k < n; k++) face(win, [C, w.M(pts[k][0], pts[k][1], 0.08), w.M(pts[(k + 1) % n][0], pts[(k + 1) % n][1], 0.08)], w.N(s))
  }

  // ---- the corner towers (front west, both rear corners) and the east front block
  const TOWERS: [number, number, number, number][] = [[45.6, -39.0, 57.5, -26.3], [45.8, 21.4, 57.6, 30.7], [-55.6, 21.7, -42.6, 31.0]]
  for (const [x0, y0, x1, y1] of TOWERS) tower(x0, y0, x1, y1)
  function tower(x0: number, y0: number, x1: number, y1: number) {
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, hx = (x1 - x0) / 2, hy = (y1 - y0) / 2
    box(sand, x0, y0, x1, y1, 0, 20.5)
    const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
    for (let i = 0; i < 4; i++) {
      const w = S(r[i], r[(i + 1) % 4]), L = w.L
      // cream panels between sandstone corners, windows in them
      wrect(render, w, 1.6, L - 1.6, 6.0, 17.0, 0.04)
      for (const f of [0.35, 0.65]) { const c = L * f; if (D) wrect(win, w, c - 0.6, c + 0.6, 7.0, 9.6, 0.07); wrect(win, w, c - 0.6, c + 0.6, D ? 11.6 : 8.0, 14.2, 0.07) }
      warch(win, w, L / 2, 1.3, 0, 3.2, 0.05, AN)
      band(sand, w, 0, L, 19.6, 20.5, 0.6)
    }
    // the top stage with three arched openings a side
    const t0: XY[] = [[cx - hx + 1.0, cy - hy + 1.0], [cx + hx - 1.0, cy - hy + 1.0], [cx + hx - 1.0, cy + hy - 1.0], [cx - hx + 1.0, cy + hy - 1.0]]
    prism(sand, t0, 20.5, 24.0, false)
    for (let i = 0; i < 4; i++) {
      const w = S(t0[i], t0[(i + 1) % 4]), L = w.L
      for (const f of D ? [0.25, 0.5, 0.75] : [0.5]) warch(win, w, L * f, D ? 0.65 : 1.2, 21.0, 22.6, 0.05, AN)
      band(sand, w, 0, L, 23.5, 24.0, 0.4)
    }
    // the dark dome and its lantern
    const R = Math.min(hx, hy) - 1.0
    lathe(metal, cx, cy, [[R + 0.3, 24.0], [R, 24.6], [R * 0.92, 26.2], [R * 0.6, 27.8], [R * 0.25, 28.4], [0, 28.4]], D ? 16 : 8, Math.PI / (D ? 16 : 8))
    lathe(sand, cx, cy, [[0, 28.3], [0.9, 28.3], [0.9, 29.4], [0, 29.4]], 8)
    lathe(metal, cx, cy, [[0, 29.4], [1.1, 29.4], [0.4, 30.3], [0.05, 31.0], [0, 31.0]], 8)
  }
  // the plain cream block on the east front corner
  {
    const r: XY[] = [[-55.8, -38.6], [-42.8, -38.7], [-42.8, -25.9], [-55.8, -25.9]]
    prism(render, r, 0, 15.0)
    for (let i = 0; i < 4; i++) { const w = S(ccw(r)[i], ccw(r)[(i + 1) % 4]); band(render, w, 0, w.L, 14.4, 15.0, 0.3); for (const f of [0.3, 0.7]) wrect(win, w, w.L * f - 0.5, w.L * f + 0.5, 2.0, 4.0, 0.05) }
  }

  // ---- the rear: the colonnade band, the rear block, the annex
  const REARCOL: XY[] = [[45.78, 30.51], [32.93, 30.55], [30.52, 31.21], [22.64, 35.41], [14.75, 38.06], [5.98, 39.46], [-0.05, 39.88], [-10.8, 38.63], [-20.33, 35.7], [-24.61, 33.76], [-28.94, 31.3], [-30.53, 30.97], [-42.63, 31.0], [-42.65, 21.74], [-28.53, 21.68], ...BACK.slice().reverse().slice(1, -1), [30.97, 21.46], [45.76, 21.43]]
  prism(sand, REARCOL, 0, 11.0, false)
  cap(metal, ccw(REARCOL), 11.0)
  const RB: XY[] = [[32.78, 49.08], [-30.36, 49.09], [-30.47, 38.64], [-30.53, 30.97], [-28.94, 31.3], [-24.61, 33.76], [-20.33, 35.7], [-10.8, 38.63], [-0.05, 39.88], [5.98, 39.46], [14.75, 38.06], [22.64, 35.41], [30.52, 31.21], [32.93, 30.55]]
  prism(render, RB, 0, 12.0)
  prism(render, [[-30.47, 38.64], [-55.62, 38.76], [-55.64, 31.05], [-42.63, 31.0], [-30.53, 30.97]], 0, 8.0)
  for (const r of [REARCOL, RB]) {
    const c = ccw(r)
    for (let i = 0; i < c.length; i++) {
      const w = S(c[i], c[(i + 1) % c.length])
      if (w.L < 6 || w.N(0)[1] < 0.3) continue
      const n = Math.round(w.L / 4), p = w.L / n
      for (let k = 0; k < n; k++) { wrect(win, w, (k + 0.5) * p - 0.7, (k + 0.5) * p + 0.7, 1.5, 4.0, 0.05); wrect(win, w, (k + 0.5) * p - 0.7, (k + 0.5) * p + 0.7, 6.0, 8.6, 0.05) }
    }
  }

  const flood = (p: V3, n: V3) => (p[1] < -26 && n[2] < 0.7 ? 0.8 : 0)
  return [
    { part: sand, material: { ...finish('festhalle-sandstone', 0xbf8676), floodlight: flood } },
    { part: render, material: { ...finish('festhalle-render', 0xece3cf), floodlight: flood } },
    { part: copper, material: finish('festhalle-zinc', 0x8e989e) },
    { part: win, material: PALETTE.window },
    { part: dome, material: finish("neon-festhalle-dome", 0x6c777e, 0.3) },
    { part: metal, material: finish('festhalle-metal', 0x666d70) },
  ]
}

if (import.meta.main && process.env.STATS) for (const D of [false, true]) console.log(D, build(D).map((m) => `${m.material.name}:${m.part.triangles}`).join(' '))
else if (import.meta.main) await writeLods(ID, 'Festhalle', ANCHOR, BEARING, build(false), build(true))
