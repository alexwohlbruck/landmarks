/**
 * Städel Museum, Schaumainkai 63, Frankfurt am Main: the picture gallery
 * of 1874-78 by Oskar Sommer on the south bank of the Main, Italian
 * Renaissance revival in yellow sandstone, and the Gartenhallen of 2012
 * (schneider+schumacher), exhibition halls under the Städel Garten whose
 * only part above ground is the gently domed lawn with its round
 * skylights. Original procedural geometry, CC0-1.0.
 * bun generators/frankfurt-staedel.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the main building's OSM outline
 * way/794404905, 50.1031953, 8.6739189. The front runs at 54 degrees and
 * faces the river to the north-west, so the catalog bearing is 144: the
 * river front faces -y, the garden lies at +y behind the Gartenflügel
 * (way/232461876, not part of this model, drawn by the map).
 *
 * Identity, in order: the long two-storey sandstone front to the river,
 * arched windows below and tall windows between paired columns above,
 * under a balustrade; the off-centre portico with its porch of two
 * columns, the great arched window between pairs of Corinthian columns,
 * the Holbein and Dürer statues, the inscribed attic; the grey dome
 * behind it; the two plain ashlar end blocks; the red sandstone plinth;
 * behind, the green lawn dome of the garden halls dotted with round
 * skylights that glow at night.
 *
 * Evidence:
 *  - plan: OSM outline way/794404905 read in the turned frame: front
 *    range x -29.4..24.5 to y -19.4, portico x -9.0..4.2 out to y -22.1,
 *    end blocks x -40.9..-29.2 and 24.5..36.1, the rear block to y 27.8.
 *    The garden: way/794404904 (Städel Garten, 62 x 43 m), over the halls
 *    way/794404903 (location=underground).
 *  - heights: no OSM heights and no lidar. Scaled from the frontal photo
 *    across the river (Außenansicht, near orthographic: 77 m front = 1090
 *    px): balustrade 15.2 m, end blocks 16.2 m, portico attic 16.3 m,
 *    dome drum to 17.6 m, dome top 21.6 m, dome about 11 m across. Storey
 *    lines (plinth 1.4 m, string course 6.6-7.2 m, cornice 13.5-14 m) from
 *    the same photo and the portico photos (estimated).
 *  - the lawn dome: "a gently domed and grass-covered plane" (inexhibit,
 *    the source OSM cites); its rise, about 2.4 m at the crown, estimated
 *    from Fred Romero's photos across the garden. Skylights: 195 (as
 *    published by the museum), drawn as a 15 x 13 grid, 1.5-2.5 m across,
 *    largest towards the crown, from the night photo from above.
 *  - colours from the daylight photos: yellow-grey sandstone, the red
 *    sandstone plinth and steps, the dark grey ribbed glass-and-metal dome, grey flat roofs, the lawn.
 *  - night: the river front floodlit; windows lit; the skylights glow
 *    from the halls below (the night photo "Das Städel Museum mit Städel
 *    Garten"), so they share the window material, not dark glass.
 *  - terrain: Mapterhorn flat within 0.5 m over the site (4.1-4.7 m over
 *    the riverbank), except a single 2 m dip at the river front's east
 *    corner, which the map grounds the model on. The lawn is built on the
 *    garden's ground, 1.9 m over the model's base (terrain.ts check), with
 *    its edge run down to y = 0; elevation 0.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Städel Museum, Frankfurt am Main, Außenansicht (cropped).jpg (Städel Museum, CC BY-SA 4.0)
 *    https://commons.wikimedia.org/wiki/File:St%C3%A4del_Museum,_Frankfurt_am_Main,_Au%C3%9Fenansicht_(cropped).jpg
 *  - Frankfurt am Main, das Städel - Museum .jpg (Dguendel, CC BY 3.0)
 *    https://commons.wikimedia.org/wiki/File:Frankfurt_am_Main,_das_St%C3%A4del_-_Museum_.jpg
 *  - Das Städel Museum.jpg (Städel Museum, CC BY 4.0)
 *    https://commons.wikimedia.org/wiki/File:Das_St%C3%A4del_Museum.jpg
 *  - Frankfurt Museumsuferfest 2025 - 04 (Städel).jpg (Dr. Bernd Gross, CC BY-SA 4.0)
 *    https://commons.wikimedia.org/wiki/File:Frankfurt_Museumsuferfest_2025_-_04_(St%C3%A4del).jpg
 *  - Frankfurt am Main - Städel Museum.jpg, (1).jpg, (2).jpg (Fred Romero, CC BY 2.0)
 *    https://commons.wikimedia.org/wiki/File:Frankfurt_am_Main_-_St%C3%A4del_Museum.jpg
 *    https://commons.wikimedia.org/wiki/File:Frankfurt_am_Main_-_St%C3%A4del_Museum_(1).jpg
 *    https://commons.wikimedia.org/wiki/File:Frankfurt_am_Main_-_St%C3%A4del_Museum_(2).jpg
 *  - Das Städel Museum mit Städel Garten.jpg (Städel Museum, CC BY-SA 4.0): night, from above.
 *    https://commons.wikimedia.org/wiki/File:Das_St%C3%A4del_Museum_mit_St%C3%A4del_Garten.jpg
 *  - Staedel-Frankfurt-2013-Ffm-862-867.jpg (Simsalabimbam, CC BY-SA 3.0): river front.
 *    https://commons.wikimedia.org/wiki/File:Staedel-Frankfurt-2013-Ffm-862-867.jpg
 * No commercial imagery, no 3D city models (Hessen LoD2 not used). No
 * look-only sources.
 *
 * Left out: the inscription, rustication joints, the reliefs in the
 * portico spandrels (low blobs in the detail model), the railings and
 * sculpture in the forecourt, the Gartenflügel and Peichl's west wing
 * (separate OSM buildings), the halls' entrance and the paths across the
 * lawn.
 *
 * Doubts: every height is photo-scaled, none published. The rear block
 * and the courtyard sides are seen in no photo and drawn plain. The dome's
 * position behind the portico is estimated (it is centred on the portico
 * in the frontal photo); the gallery roof lights are drawn as two low
 * glazed ridges. The skylight grid is regularised.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  writeLods, floodWalls, prism, box, straight as S, wrect, warch, wframe, wbox, band, balustrade, column, figure, lathe, face, cap, rect, setCurve, blob, ccw, inset,
  type Mat, type XY,
} from './frankfurt-alte-oper'

export const ID = 'frankfurt-staedel'
const BEARING = 144
const ANCHOR: [number, number] = [50.1031953, 8.6739189]

const CORN = 14.0, BAL = 1.2, PAV = 16.2

function build(D: boolean): Mat[] {
  const stone = new Part(), red = new Part(), roof = new Part(), win = new Part(), lawn = new Part(), dome = new Part()
  const sky = win
  setCurve(D ? 1.2 : 2.6)
  const AN = D ? 8 : 5, SEG = D ? 10 : 5

  // ---- massing
  const FY = -19.4, PY = -22.1, PX0 = -9.0, PX1 = 4.2, PC = (PX0 + PX1) / 2
  // front range, its rear block, the end blocks (plain ashlar)
  prism(stone, rect(-29.3, FY, 24.5, 3.1), 0, CORN, false)
  const REAR: XY[] = [[-14.0, 3.0], [24.1, 3.0], [24.1, 8.0], [30.0, 8.0], [29.9, 23.1], [24.0, 23.1], [24.0, 27.8], [-14.0, 27.6]]
  prism(stone, REAR, 0, CORN - 0.6, false)
  cap(roof, REAR, CORN - 0.6)
  for (const [a, b] of [[REAR[1], REAR[2]], [REAR[2], REAR[3]], [REAR[3], REAR[4]], [REAR[4], REAR[5]], [REAR[5], REAR[6]], [REAR[6], REAR[7]], [REAR[7], REAR[0]]] as [XY, XY][]) { const w = S(a, b); band(stone, w, 0, w.L, CORN - 1.2, CORN - 0.6, 0.35); if (w.L > 8) for (let s = 2.5; s < w.L - 2; s += 3.6) { wrect(win, w, s - 0.6, s + 0.6, 2.2, 5.0, 0.05); wrect(win, w, s - 0.6, s + 0.6, 7.6, 11.0, 0.05) } }
  const LB: XY[] = [[-40.9, -23.2], [-29.3, -23.1], [-29.2, 7.2], [-40.9, 7.1]]
  const RB: XY[] = [[24.5, -22.7], [36.1, -22.7], [36.0, -14.9], [34.4, -14.9], [34.3, -1.0], [32.7, -1.0], [32.7, 4.4], [24.5, 4.4]]
  for (const r of [LB, RB]) {
    prism(stone, r, 0, PAV - 0.7)
    prism(red, inset(ccw(r), -0.12), 0, 1.4, false)
  }
  // end blocks: a plain cornice slab and a few tall windows low down
  for (const r of [LB, RB]) {
    const c = ccw(r)
    for (let i = 0; i < c.length; i++) {
      const w = S(c[i], c[(i + 1) % c.length])
      if (w.L < 3) continue
      band(stone, w, 0, w.L, PAV - 0.7, PAV, 0.25)
      if (w.L > 9) {
        const n = Math.floor((w.L - 3) / 4)
        for (let k = 0; k < n; k++) wrect(win, w, w.L / 2 + (k - (n - 1) / 2) * 4 - 0.55, w.L / 2 + (k - (n - 1) / 2) * 4 + 0.55, 1.8, 5.6, 0.05)
      }
    }
  }

  // roof: flat, with the gallery roof lights as two long glazed ridges
  cap(roof, rect(-29.0, FY + 0.3, 24.2, 2.8), CORN - 0.25)
  for (const [x0, x1] of [[-27, -10.5], [6, 22.5]]) {
    const y0 = -16, y1 = -1, ym = (y0 + y1) / 2, z0 = CORN - 0.2, z1 = CORN + 1.6
    face(roof, [[x0, y0, z0], [x1, y0, z0], [x1, ym, z1], [x0, ym, z1]], [0, -1, 1])
    face(roof, [[x0, y1, z0], [x1, y1, z0], [x1, ym, z1], [x0, ym, z1]], [0, 1, 1])
    face(roof, [[x0, y0, z0], [x0, ym, z1], [x0, y1, z0]], [-1, 0, 0])
    face(roof, [[x1, y0, z0], [x1, ym, z1], [x1, y1, z0]], [1, 0, 0])
  }

  // ---- the dome behind the portico
  const DY = -8.5, DR = 5.45
  const oct = (r: number, z: number) => Array.from({ length: 8 }, (_, k) => [PC + r * Math.cos(((k + 0.5) * Math.PI) / 4), DY + r * Math.sin(((k + 0.5) * Math.PI) / 4)] as XY)
  prism(stone, oct(DR, 0), CORN - 0.3, 17.0, false)
  prism(stone, oct(DR + 0.3, 0), 17.0, 17.6, false)
  {
    const prof: XY[] = []
    const n = D ? 8 : 5
    for (let k = 0; k <= n; k++) { const t = (k / n) * (Math.PI / 2); prof.push([DR * Math.cos(t) + 0.0001, 17.6 + 3.3 * Math.sin(t)]) }
    prof[prof.length - 1] = [1.6, 20.9]
    lathe(dome, PC, DY, [[DR + 0.3, 17.6], ...prof, [1.6, 21.25], [1.25, 21.6], [0, 21.6]], D ? 16 : 8, Math.PI / 8)
    if (D) for (let k = 0; k < 8; k++) {
      // the dome's ribs
      const a = (k * Math.PI) / 4 + Math.PI / 8
      const pts: V3[] = []
      for (let j = 0; j <= 6; j++) { const t = (j / 6) * (Math.PI / 2) * 0.93; pts.push([PC + (DR + 0.12) * Math.cos(t) * Math.cos(a), DY + (DR + 0.12) * Math.cos(t) * Math.sin(a), 17.6 + 3.42 * Math.sin(t)]) }
      for (let j = 0; j < 6; j++) {
        const A = pts[j], B = pts[j + 1], tx = -Math.sin(a) * 0.14, ty = Math.cos(a) * 0.14
        face(stone, [[A[0] - tx, A[1] - ty, A[2]], [A[0] + tx, A[1] + ty, A[2]], [B[0] + tx, B[1] + ty, B[2]], [B[0] - tx, B[1] - ty, B[2]]], [Math.cos(a), Math.sin(a), 0.6])
      }
    }
    // drum windows
    const o = oct(DR, 0)
    for (let k = 0; k < 8; k++) { const w = S(o[k], o[(k + 1) % 8]); wrect(win, w, w.L / 2 - 0.7, w.L / 2 + 0.7, 15.4, 16.6, 0.05) }
  }

  // ---- the front range's facade, either side of the portico
  const front = (s0x: number, s1x: number, n: number) => {
    const w = S([s0x, FY], [s1x, FY]), L = w.L, pitch = L / n
    wbox(red, w, 0, L, 0, 1.4, 0, 0.25, false)
    band(stone, w, 0, L, 6.6, 7.2, 0.3)
    if (D) band(stone, w, 0, L, 12.6, 13.4, 0.15, false)
    band(stone, w, 0, L, 13.4, CORN, 0.7)
    balustrade(stone, w, 0, L, CORN, BAL, -0.05, D, 0.4, pitch)
    for (let k = 0; k < n; k++) {
      const c = (k + 0.5) * pitch
      warch(win, w, c, 0.8, 2.3, 4.7, 0.05, AN)
      if (D) wframe(stone, w, c, 0.8, 2.3, 4.7, 0.25, 0.14, AN)
      wrect(win, w, c - 0.6, c + 0.6, 0.35, 1.0, 0.27)
      wrect(win, w, c - 1.0, c + 1.0, 8.2, 11.7, 0.05)
      if (D) { wbox(stone, w, c - 1.2, c + 1.2, 11.7, 12.05, 0, 0.25); wbox(stone, w, c - 1.15, c + 1.15, 7.95, 8.2, 0, 0.25) }
    }
    for (let k = 0; k <= n; k++) {
      const s = k * pitch
      if (D) {
        // paired columns on a pedestal between the windows
        const a = Math.max(0.2, s - 0.75), b = Math.min(L - 0.2, s + 0.75)
        wbox(stone, w, a, b, 7.2, 7.9, 0, 0.45)
        for (const d of [-0.36, 0.36]) {
          const ss = Math.min(L - 0.3, Math.max(0.3, s + d))
          const m = w.M(ss, 0, 0.25)
          column(stone, m[0], m[1], 7.9, 12.6, 0.2, 8, true)
        }
      } else wbox(stone, w, Math.max(0, s - 0.55), Math.min(L, s + 0.55), 7.2, 12.6, 0, 0.3, false)
    }
  }
  front(-29.3, PX0, 5)
  front(PX1, 24.5, 5)

  // ---- the portico
  const pf = S([PX0, PY], [PX1, PY]), PL = pf.L
  // ground: two rusticated piers and a porch of two columns in antis
  for (const [s0, s1] of [[0, 2.8], [PL - 2.8, PL]]) {
    box(stone, PX0 + s0, PY, PX0 + s1, FY, 0, 7.2)
  }
  wbox(red, pf, 0, PL, 0, 1.4, 0, 0.25, false)
  box(stone, PX0, PY, PX1, FY, 6.4, 7.2)
  for (const x of [PX0 + 2.8 + 7.6 / 3, PX0 + 2.8 + (2 * 7.6) / 3]) column(stone, x, PY + 0.6, 1.4, 6.4, D ? 0.38 : 0.5, SEG, D)
  // the porch's back wall: doors and glazing, lit
  const back = S([PX0 + 2.8, FY], [PX1 - 2.8, FY])
  wrect(win, back, 0.4, back.L - 0.4, 1.4, 5.9, 0.05)
  cap(stone, rect(PX0 + 2.8, PY, PX1 - 2.8, FY), 1.4)
  // steps and their red sandstone cheeks
  const NS = D ? 8 : 4
  for (let k = 0; k < NS; k++) box(stone, PX0 + 3.0, PY - 4.8 + (k * 4.8) / NS, PX1 - 3.0, PY, 0, (1.4 * (k + 1)) / NS)
  for (const [x0, x1] of [[PX0 + 1.6, PX0 + 3.0], [PX1 - 3.0, PX1 - 1.6]]) box(red, x0, PY - 4.8, x1, PY, 0, 1.9)
  // upper storey: the portico's wall, its pairs of columns, the arched window, the statues
  box(stone, PX0, PY + 0.9, PX1, FY, 7.2, 14.8)
  const pu = S([PX0, PY + 0.9], [PX1, PY + 0.9])
  band(stone, pf, 0, PL, 6.6, 7.2, 0.35)
  warch(win, pu, PL / 2, 1.25, 8.1, 11.3, 0.05, AN)
  if (D) wframe(stone, pu, PL / 2, 1.25, 8.1, 11.3, 0.3, 0.2, AN)
  for (const s of [PL / 2 - 2.0, PL / 2 + 2.0]) {
    wrect(win, pu, s - 0.4, s + 0.4, 8.3, 10.6, 0.05)
    if (D) for (const d of [-0.62, 0.62]) { const m = pu.M(s + d, 0, 0.2); column(stone, m[0], m[1], 7.9, 11.0, 0.14, 6, true) }
  }
  for (const s of [1.15, 2.35, PL - 2.35, PL - 1.15]) {
    const m = pu.M(s, 0, D ? 0.45 : 0.75)
    box(stone, m[0] - 0.6, m[1] - 0.55, m[0] + 0.6, m[1] + 0.45, 7.2, 8.0)
    column(stone, m[0], m[1], 8.0, 13.0, D ? 0.4 : 0.58, SEG, D)
  }
  // Holbein and Dürer, on brackets between the columns and the window
  for (const s of [3.5, PL - 3.5]) {
    const m = pu.M(s, 0, 0.45)
    box(stone, m[0] - 0.45, m[1] - 0.4, m[0] + 0.45, m[1] + 0.4, 8.3, 8.8)
    figure(stone, m[0], m[1], 8.8, 2.3, D ? 8 : 5, D)
  }
  if (D) for (const s of [PL / 2 - 2.35, PL / 2 + 2.35]) { const m = pu.M(s, 12.1, 0.12); blob(stone, m, 0.8, 0.12, 0.45, 6, 3) }
  // entablature with the inscription band, cornice and attic
  box(stone, PX0 - 0.1, PY - 0.15, PX1 + 0.1, FY, 13.0, 14.3)
  band(stone, pf, -0.3, PL + 0.3, 14.3, 14.8, 0.6)
  box(stone, PX0 + 0.2, PY + 0.3, PX1 - 0.2, FY, 14.8, 16.3)
  for (const s of [0.2, PL - 2.2]) { const a = pu.M(s, 0, 0.6), b = pu.M(s + 2.0, 0, -0.65); box(stone, a[0], a[1], b[0], b[1], 14.8, 16.6) }
  // portico sides: a narrow window each, and the attic balustrade carried round
  for (const [a, b] of [[[PX0, FY], [PX0, PY]], [[PX1, PY], [PX1, FY]]] as [XY, XY][]) {
    const w = S(a, b)
    band(stone, w, 0, w.L, 6.6, 7.2, 0.35)
  }

  // ---- the garden halls' lawn dome and skylights
  // G0: the garden's ground over the model's base, from `terrain.ts grid`: the
  // map grounds the model on a 2 m dip at the river front's east corner.
  const GX0 = -35.1, GX1 = 27.2, GY0 = 51.6, GY1 = 94.0, GH = 2.4, G0 = 1.9, LIP = G0 + 0.12
  const gx = (GX0 + GX1) / 2, gy = (GY0 + GY1) / 2, ax = (GX1 - GX0) / 2, ay = (GY1 - GY0) / 2
  const hgt = (x: number, y: number) => {
    // a cushion: a cosine bell over the middle 85 % of the lawn, easing out flat to the edges
    const r = Math.min(1, Math.hypot((x - gx) / (ax * 0.85), (y - gy) / (ay * 0.85)))
    return LIP + GH * Math.cos((r * Math.PI) / 2) ** 2
  }
  const nrm = (x: number, y: number): V3 => {
    const e = 0.05, dx = (hgt(x + e, y) - hgt(x - e, y)) / (2 * e), dy = (hgt(x, y + e) - hgt(x, y - e)) / (2 * e)
    const l = Math.hypot(dx, dy, 1)
    return [-dx / l, -dy / l, 1 / l]
  }
  const NX = D ? 24 : 10, NY = D ? 18 : 8
  for (let i = 0; i < NX; i++) for (let j = 0; j < NY; j++) {
    const x0 = GX0 + ((GX1 - GX0) * i) / NX, x1 = GX0 + ((GX1 - GX0) * (i + 1)) / NX
    const y0 = GY0 + ((GY1 - GY0) * j) / NY, y1 = GY0 + ((GY1 - GY0) * (j + 1)) / NY
    const P = (x: number, y: number): V3 => [x, y, hgt(x, y)]
    lawn.tri(P(x0, y0), P(x1, y0), P(x1, y1), undefined, undefined, undefined, [nrm(x0, y0), nrm(x1, y0), nrm(x1, y1)])
    lawn.tri(P(x0, y0), P(x1, y1), P(x0, y1), undefined, undefined, undefined, [nrm(x0, y0), nrm(x1, y1), nrm(x0, y1)])
  }
  // the lip round the lawn, down to the ground
  const ring: XY[] = [[GX0, GY0], [GX1, GY0], [GX1, GY1], [GX0, GY1]]
  for (let i = 0; i < 4; i++) {
    const a = ring[i], b = ring[(i + 1) % 4]
    face(lawn, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], LIP], [a[0], a[1], LIP]], [b[1] - a[1], a[0] - b[0], 0])
  }
  // skylights: 15 x 13 grid (half density, larger, in the low model)
  const CX = D ? 15 : 11, CY = D ? 13 : 9
  const px = (GX1 - GX0) / CX, py = (GY1 - GY0) / CY
  for (let i = 0; i < CX; i++) for (let j = 0; j < CY; j++) {
    const x = GX0 + px * (i + 0.5), y = GY0 + py * (j + 0.5)
    const u = (x - gx) / ax, v = (y - gy) / ay
    const r = (D ? 0.75 : 0.95) + (D ? 0.5 : 0.45) * Math.max(0, 1 - Math.hypot(u, v)) + (D ? 0.08 * Math.sin(i * 2.3 + j * 1.7) : 0)
    const n = nrm(x, y), nseg = D ? 14 : 8
    // a tangent frame on the lawn
    const t1 = [n[2], 0, -n[0]] as V3, l1 = Math.hypot(...t1), e1: V3 = [t1[0] / l1, t1[1] / l1, t1[2] / l1]
    const e2: V3 = [n[1] * e1[2] - n[2] * e1[1], n[2] * e1[0] - n[0] * e1[2], n[0] * e1[1] - n[1] * e1[0]]
    const C: V3 = [x, y, hgt(x, y) + 0.05]
    const pt = (rr: number, a: number, dz = 0): V3 => [C[0] + rr * (Math.cos(a) * e1[0] + Math.sin(a) * e2[0]) + n[0] * dz, C[1] + rr * (Math.cos(a) * e1[1] + Math.sin(a) * e2[1]) + n[1] * dz, C[2] + rr * (Math.cos(a) * e1[2] + Math.sin(a) * e2[2]) + n[2] * dz]
    for (let k = 0; k < nseg; k++) {
      const a0 = (k / nseg) * 2 * Math.PI, a1 = ((k + 1) / nseg) * 2 * Math.PI
      face(sky, [C, pt(r, a0), pt(r, a1)], n)
      if (D) {
        // a thin pale kerb round each light
        face(stone, [pt(r, a0), pt(r + 0.12, a0), pt(r + 0.12, a1), pt(r, a1)], n)
      }
    }
  }

  const sand = { ...finish('staedel-sandstone', 0xd8c59f), floodlight: (p: V3, n: V3) => (p[1] > 40 ? 0 : floodWalls(p, n)) }
  return [
    { part: stone, material: sand },
    { part: red, material: { ...finish('staedel-red-sandstone', 0xb48a72), floodlight: floodWalls } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: lawn, material: finish('staedel-lawn', 0x8fab74) },
    { part: dome, material: finish('staedel-dome-metal', 0x666d73) },
  ]
}

if (import.meta.main && process.env.STATS) for (const D of [false, true]) console.log(D, build(D).map((m) => `${m.material.name}:${m.part.triangles}`).join(' '))
else if (import.meta.main) await writeLods(ID, 'Städel Museum', ANCHOR, BEARING, build(false), build(true))
