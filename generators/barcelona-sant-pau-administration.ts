/**
 * Sant Pau Recinte Modernista, Administration Pavilion (Edifici
 * d'Administracio), Barcelona — original procedural geometry, CC0-1.0.
 * bun generators/barcelona-sant-pau-administration.ts
 *
 * Uses the kit exported by generators/barcelona-arc-de-triomf.ts.
 *
 * Frame: not turned (BEARING 0; the hospital is laid out on the compass,
 * at 45 degrees to the Eixample): +y north, +x east, z up, metres. Origin =
 * the area centroid of the OSM relation/7422815. The building is a wide V
 * opening south to the forecourt at the top of the Avinguda de Gaudi: the
 * central pavilion with the clock tower on the axis x = -1.45, two wings at
 * 45 degrees and a pavilion at each wing's end.
 *
 * Evidence
 * - OSM relation/7422815 (Edifici d'Administracio, Lluis Domenech i
 *   Montaner, building=hospital, 7 levels, 2 underground) and its parts
 *   way/645290929-645290934 (6-7 levels, one 1-level porch). In this frame
 *   the central block x -9.6..6.9, y -0.3..19.2; the wings 12.4 m deep with
 *   their centre lines on x - y = -23.7 and x + y = 20.45; the end pavilions
 *   to x = -47.2 and 47.6.
 * - ICGC orthophoto (Institut Cartografic i Geologic de Catalunya,
 *   ortofoto_color_vigent WMS, CC BY 4.0): the plan agrees with OSM; the red
 *   tiled hipped roofs of the wings with their pale ridge strips.
 * - Published (ca.wikipedia "Hospital de la Santa Creu i Sant Pau"):
 *   Domenech i Montaner, 1905-1910 for the Administration building, red
 *   brick with stone, glazed ceramic and mosaic; UNESCO World Heritage 1997.
 * - Mapterhorn terrain (bun tools/terrain.ts grid): the site falls about
 *   5 m from the rear (north) to the forecourt (south); y = 0 is the
 *   forecourt's foot and the rear walls run down into the slope.
 * - Commons daylight photos (EVIDENCE):
 *   "Hospital de Sant Pau, Facade, Barcelona.jpg" (Julian Lupyan, CC0; the
 *   front square on: heights measured from it, scaled to OSM's 16.5 m
 *   central block);
 *   "Hospital de Sant Pau - facana 2014.JPG" (Jordiferrer, CC BY-SA 4.0; the
 *   centre, porch, windows, gable and clock tower close up);
 *   "Hospital de Sant Pau 01.jpg" (Bernard Gagnon, CC BY-SA 3.0; the
 *   precinct seen from the building's rear terrace: colours and the domed
 *   towers' type);
 *   "Hospital de Sant Pau 02.jpg" (Bernard Gagnon, CC BY-SA 3.0; a wing
 *   tower's tiled dome and ceramic band);
 *   "Hospital Sant Pau panorama.jpg" (Jesus Arpon, CC BY-SA 3.0; from the
 *   rear terrace, the two domed towers at the wings' rear ends at the
 *   panorama's edges).
 *
 * Estimated from the photos (front photo scaled to the 16.5 m centre, raised
 * a little for its upward view): wings' eaves 18, hipped roofs to 22.5; the
 * end pavilions' eaves 18.5, roofs 23.5; the central block's walls 23 and
 * its gables 30; the tower's square body to 34.6 with open arcades, the pale
 * stone clock stage to 39 and the spire to 50.5. The domed wing towers
 * (r 3): shafts to 24, ceramic band 24-26, corbelled crown, tiled bullet
 * domes to 33 and their lanterns 34.5. Colours from the daylight photos,
 * pulled to the palette's lightness: salmon-red brick, cream stone, red-
 * brown tile, the towers' turquoise ceramic.
 *
 * Left out: the sculpture, mosaics and ceramic roundels, the dormers and
 * the pinnacles (the tower keeps four bold corner ones), the porch's statues.
 *
 * Doubts: the tower and spire heights rest on a photo taken from below; the
 * domed towers' exact positions at the wings' rear ends are read from the
 * rear photos and the OSM outline's corners, not from a plan.
 *
 * Night: the facades and the tower are floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { arcPts, away, face, lathe, ngon, onWall, prismN, quadN, relief, save, triN, turned, type XY } from './barcelona-arc-de-triomf'

const brick = new Part(), stone = new Part(), tile = new Part(), ceramic = new Part(), win = new Part()
const AX = -1.45 // the axis of symmetry

/** An oriented box's plan: centre, direction of its length (unit), length and width; counter-clockwise. */
function obox(c: XY, d: XY, L: number, W: number): XY[] {
  const n: XY = [-d[1], d[0]]
  const P = (a: number, b: number): XY => [c[0] + d[0] * a + n[0] * b, c[1] + d[1] * a + n[1] * b]
  return [P(-L / 2, -W / 2), P(L / 2, -W / 2), P(L / 2, W / 2), P(-L / 2, W / 2)]
}
/** A hipped roof over a counter-clockwise rectangle (r[0]->r[1] its length), eaves z, ridge rise h, overhang o. */
function hipRoof(p: Part, r: XY[], z: number, h: number, o = 0.5) {
  const c: XY = [(r[0][0] + r[2][0]) / 2, (r[0][1] + r[2][1]) / 2]
  const L = Math.hypot(r[1][0] - r[0][0], r[1][1] - r[0][1]), W = Math.hypot(r[2][0] - r[1][0], r[2][1] - r[1][1])
  const d: XY = [(r[1][0] - r[0][0]) / L, (r[1][1] - r[0][1]) / L]
  const R = obox(c, d, L + 2 * o, W + 2 * o)
  const hw = (W + 2 * o) / 2, ext = Math.max(0, (L + 2 * o) / 2 - hw)
  const A: V3 = [c[0] - d[0] * ext, c[1] - d[1] * ext, z + h], B: V3 = [c[0] + d[0] * ext, c[1] + d[1] * ext, z + h]
  const e = R.map(([x, y]) => [x, y, z - o * 0.5] as V3)
  const inside: V3 = [c[0], c[1], z - 5]
  quadN(p, e[0], e[1], B, A, away(e[0], e[1], B, inside))
  quadN(p, e[2], e[3], A, B, away(e[2], e[3], A, inside))
  triN(p, e[1], e[2], B, away(e[1], e[2], B, inside))
  triN(p, e[3], e[0], A, away(e[3], e[0], A, inside))
  // soffit
  quadN(p, e[3], e[2], e[1], e[0], [0, 0, -1])
}
/** Window bays on wall a→b: n bays of `per` round-headed lights over the given storey bands. */
function bays(a: XY, b: XY, s0: number, s1: number, n: number, bands: [number, number][], per = 2, w = 1.1) {
  const step = (s1 - s0) / n
  for (let k = 0; k < n; k++) {
    const s = s0 + (k + 0.5) * step
    for (const [z0, z1] of bands)
      for (let j = 0; j < per; j++) {
        const sc = s + (j - (per - 1) / 2) * (w + 0.45)
        face(win, a, b, [[sc - w / 2, z0], [sc + w / 2, z0], ...arcPts(sc, z1 - w / 2, w / 2, 0, Math.PI, 6).slice(0, -1), [sc - w / 2, z1 - w / 2]], 0.06)
      }
  }
}

// --- wings and end pavilions, mirrored about the axis ---
for (const s of [1, -1]) {
  const X = (u: number) => AX + s * u
  const d: XY = [s * Math.SQRT1_2, -Math.SQRT1_2] // along the wing, outward from the centre
  const nrm: XY = [s * Math.SQRT1_2, Math.SQRT1_2] // across it, toward the rear
  // the wing's centre line is u + y = 21.9 (u = |x - AX|); t runs along it from u - y = 0
  const c0: XY = [X(10.95), 10.95]
  const c = (t: number): XY => [c0[0] + d[0] * t, c0[1] + d[1] * t]
  const t0 = 1.0, t1 = 28.5 // from inside the central block to the end pavilion (OSM)
  const wingC = c((t0 + t1) / 2)
  const wing = obox(wingC, d, t1 - t0, 12.4)
  const wr = s > 0 ? wing : [wing[1], wing[0], wing[3], wing[2]].reverse() as XY[]
  prismN(brick, wr, 0, 18, null)
  hipRoof(tile, wr, 18, 4.5)
  // ceramic-and-stone cornice band
  { const b = obox(wingC, d, t1 - t0, 12.7); prismN(stone, s > 0 ? b : [b[1], b[0], b[3], b[2]].reverse() as XY[], 17.2, 18.0, null) }
  // windows on both long faces: front (to the forecourt) and rear
  for (const side of [1, -1]) {
    const P = (t: number): XY => { const q = c(t); return [q[0] + nrm[0] * 6.2 * side, q[1] + nrm[1] * 6.2 * side] }
    let a = P(t0 + 3.5), b = P(t1)
    // keep a→b counter-clockwise (outward to the right)
    const { n } = onWall(a, b)
    if (n[0] * nrm[0] * side + n[1] * nrm[1] * side < 0) [a, b] = [b, a]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const front = (nrm[1] * side) < 0 // faces south, to the forecourt
    bays(a, b, 1.5, L - 1.5, 6, front ? [[1.2, 4.6], [6.2, 10.0], [11.2, 15.0]] : [[6.2, 10.0], [11.2, 15.0]])
  }
  // the end pavilion: a broad block across the wing's end
  const pc = c(t1 + 5.45)
  const pcc: XY = [pc[0] + nrm[0] * 3.7, pc[1] + nrm[1] * 3.7]
  const pav = obox(pcc, nrm, 23.4, 10.9)
  const pr = s > 0 ? [pav[1], pav[0], pav[3], pav[2]].reverse() as XY[] : pav
  prismN(brick, pr, 0, 18.5, null)
  hipRoof(tile, pr, 18.5, 5)
  { const b = obox(pcc, nrm, 23.7, 11.2); prismN(stone, s > 0 ? [b[1], b[0], b[3], b[2]].reverse() as XY[] : b, 17.7, 18.5, null) }
  for (let i = 0; i < 4; i++) {
    const a = pr[i], b = pr[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L > 15) bays(a, b, 1.5, L - 1.5, 4, [[6.2, 10.0], [11.2, 15.0]])
    else bays(a, b, 1.5, L - 1.5, 2, [[6.2, 10.0], [11.2, 15.0]])
  }
  // the domed tower at the wing's rear end
  const tc: XY = [X(37.0), -2.0]
  lathe(brick, tc[0], tc[1], [[3.0, 0], [3.0, 24.0]], 14)
  lathe(ceramic, tc[0], tc[1], [[3.0, 24.0], [3.15, 24.1], [3.15, 26.0], [3.0, 26.1]], 14)
  turned(stone, tc[0], tc[1], [[3.0, 26.1], [3.55, 26.4], [3.55, 27.5], [3.0, 27.6]], 14)
  lathe(tile, tc[0], tc[1], [[2.95, 27.6], [2.9, 29.2], [2.5, 31.0], [1.7, 32.4], [0.9, 33.1], [0.7, 33.2]], 14)
  turned(stone, tc[0], tc[1], [[0.95, 33.1], [0.95, 34.3], [1.1, 34.5], [0, 34.6]], 8)
  for (let k = 0; k < 4; k++) {
    const t = Math.PI / 4 + (k * Math.PI) / 2
    const a: XY = [tc[0] + 3.02 * Math.cos(t - 0.25), tc[1] + 3.02 * Math.sin(t - 0.25)], b: XY = [tc[0] + 3.02 * Math.cos(t + 0.25), tc[1] + 3.02 * Math.sin(t + 0.25)]
    face(win, a, b, [[0.1, 14], [0.66, 14], [0.66, 21.5], [0.1, 21.5]], 0.05)
  }
}

// --- the central pavilion ---
{
  const x0 = -9.6, x1 = 6.9, y0 = -0.3, y1 = 19.2, EAVE = 23, PEAK = 30
  prismN(brick, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 0, EAVE, null)
  // gables on the front and rear, roof planes between
  const xm = AX
  for (const [y, n] of [[y0, -1], [y1, 1]] as [number, number][]) triN(brick, [x0, y, EAVE], [x1, y, EAVE], [xm, y, PEAK], [0, n, 0])
  const r = 0.5
  quadN(tile, [x0 - r, y0 - r, EAVE - 0.35], [xm, y0 - r, PEAK + 0.3], [xm, y1 + r, PEAK + 0.3], [x0 - r, y1 + r, EAVE - 0.35], away([x0 - r, y0 - r, EAVE - 0.35], [xm, y0 - r, PEAK + 0.3], [xm, y1 + r, PEAK + 0.3], [xm, 9, 20]))
  quadN(tile, [x1 + r, y0 - r, EAVE - 0.35], [xm, y0 - r, PEAK + 0.3], [xm, y1 + r, PEAK + 0.3], [x1 + r, y1 + r, EAVE - 0.35], away([x1 + r, y0 - r, EAVE - 0.35], [xm, y0 - r, PEAK + 0.3], [xm, y1 + r, PEAK + 0.3], [xm, 9, 20]))
  // the front gable's stone coping and its flanking pinnacle posts
  for (const sx of [-1, 1]) {
    const xe = sx < 0 ? x0 : x1
    const a: V3 = [xe, y0 - 0.15, EAVE], b: V3 = [xm, y0 - 0.15, PEAK]
    quadN(stone, [a[0], y0 - 0.6, a[2]], [b[0], y0 - 0.6, b[2]], [b[0], y0 - 0.6, b[2] + 0.7], [a[0], y0 - 0.6, a[2] + 0.7], [0, -1, 0])
    prismN(brick, ngon(xe - sx * 0.2, y0 + 0.6, 0.9, 4, Math.PI / 4), 0, 27.5, stone)
    turned(stone, xe - sx * 0.2, y0 + 0.6, [[0.9, 27.5], [0.55, 28.5], [0, 29.2]], 4, Math.PI / 4)
  }
  const fa: XY = [x0, y0], fb: XY = [x1, y0], W = x1 - x0, cx = AX - x0
  // the porch: three stone arches at the foot of the front, a balcony over them
  relief(stone, fa, fb, [[0.8, 0], [W - 0.8, 0], [W - 0.8, 7.8], [0.8, 7.8]], 0, 1.4)
  for (const k of [-1, 0, 1]) {
    const sc = cx + k * 4.6, w = k === 0 ? 3.6 : 2.8
    face(win, fa, fb, [[sc - w / 2, 0], [sc + w / 2, 0], ...arcPts(sc, 6.6 - w / 2, w / 2, 0, Math.PI, 8).slice(0, -1), [sc - w / 2, 6.6 - w / 2]], 1.46)
  }
  // the three great windows of the first floor, the coat of arms and the gable windows
  for (const k of [-1, 0, 1]) {
    const sc = cx + k * 4.9, w = k === 0 ? 3.9 : 3.0
    relief(stone, fa, fb, [[sc - w / 2 - 0.5, 8.6], [sc + w / 2 + 0.5, 8.6], [sc + w / 2 + 0.5, 13.2], ...arcPts(sc, 13.2, w / 2 + 0.5, 0, Math.PI, 8).slice(1, -1), [sc - w / 2 - 0.5, 13.2]], 0, 0.12)
    face(win, fa, fb, [[sc - w / 2, 9.0], [sc + w / 2, 9.0], ...arcPts(sc, 13.2, w / 2, 0, Math.PI, 8).slice(0, -1), [sc - w / 2, 13.2]], 0.18)
    face(win, fa, fb, [[sc - (w - 0.4) / 2, 19.0], [sc + (w - 0.4) / 2, 19.0], ...arcPts(sc, 21.6, (w - 0.4) / 2, 0, Math.PI, 8).slice(0, -1), [sc - (w - 0.4) / 2, 21.6]], 0.06)
  }
  relief(stone, fa, fb, [[cx - 2.2, 15.4], [cx + 2.2, 15.4], [cx + 2.2, 18.2], [cx, 19.0], [cx - 2.2, 18.2]], 0, 0.2)
  relief(stone, fa, fb, [[cx - 4.0, 15.4], [cx - 2.8, 15.4], [cx - 2.8, 18.2], [cx - 4.0, 18.2]], 0, 0.12)
  relief(stone, fa, fb, [[cx + 2.8, 15.4], [cx + 4.0, 15.4], [cx + 4.0, 18.2], [cx + 2.8, 18.2]], 0, 0.12)
  // the rear: a gable window and windows in bands (the ground there is higher)
  bays([x1, y1], [x0, y1], 1, W - 1, 3, [[6.2, 10.4], [11.6, 15.6], [17.0, 21.0]], 1, 2.4)
  // side faces above the wings' roofs
  bays([x1, y0], [x1, y1], 2, y1 - y0 - 2, 3, [[19.0, 21.8]], 2, 0.9)
  bays([x0, y1], [x0, y0], 2, y1 - y0 - 2, 3, [[19.0, 21.8]], 2, 0.9)
}

// --- the clock tower behind the front gable ---
{
  const cx = AX, cy = 5.2, h = 3.3
  const sq: XY[] = [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]]
  prismN(brick, sq, 22, 34.6, null)
  // open arcades of the belfry: dark openings on each face
  for (let i = 0; i < 4; i++) {
    const a = sq[i], b = sq[(i + 1) % 4]
    for (const sc of [1.75, 3.3, 4.85]) face(win, a, b, [[sc - 0.55, 30.6], [sc + 0.55, 30.6], ...arcPts(sc, 33.2, 0.55, 0, Math.PI, 5).slice(0, -1), [sc - 0.55, 33.2]], 0.06)
    face(ceramic, a, b, [[0.3, 29.5], [2 * h - 0.3, 29.5], [2 * h - 0.3, 30.2], [0.3, 30.2]], 0.06)
  }
  // corbelled stone cornice, corner pinnacles
  prismN(stone, [[cx - h - 0.4, cy - h - 0.4], [cx + h + 0.4, cy - h - 0.4], [cx + h + 0.4, cy + h + 0.4], [cx - h - 0.4, cy + h + 0.4]], 34.6, 35.4, stone, stone)
  for (const [px, py] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) turned(stone, cx + px * (h - 0.1), cy + py * (h - 0.1), [[0.5, 35.4], [0.5, 36.6], [0.6, 36.8], [0, 38.6]], 4, Math.PI / 4)
  // the clock stage: an octagonal stone lantern with a clock on each face
  const oct = ngon(cx, cy, 2.3, 8, Math.PI / 8)
  prismN(stone, oct, 35.4, 39.0, null)
  for (let i = 0; i < 8; i += 2) {
    const a = oct[i], b = oct[(i + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    face(win, a, b, arcPts(L / 2, 37.3, 0.75, 0, 2 * Math.PI, 10).slice(0, -1), 0.06)
  }
  // the spire: pale stone, with a ceramic band, to the cross
  turned(stone, cx, cy, [[2.45, 39.0], [2.0, 39.6], [1.5, 42.0], [1.05, 44.5], [0.6, 47.5], [0.3, 49.0], [0.12, 50.5], [0, 50.6]], 8)
  turned(ceramic, cx, cy, [[1.5, 42.0], [1.42, 42.5], [1.3, 43.1], [1.25, 43.2]], 8)
}

const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : p[1] < 8 || p[2] > 24 ? 1 : 0.6)
await save('barcelona-sant-pau-administration', 'Sant Pau Administration Pavilion', [41.411802, 2.17434], 0, [
  { part: brick, material: { ...finish('pau-brick', 0xc77e64), floodlight: lit } as Swatch },
  { part: stone, material: { ...finish('pau-stone', 0xe4d6bb), floodlight: lit } as Swatch },
  { part: tile, material: finish('pau-tile', 0xb2654f) },
  { part: ceramic, material: { ...finish('pau-ceramic', 0x6fa5a6), floodlight: lit } as Swatch },
  { part: win, material: PALETTE.window },
])
