/**
 * Hoboken Terminal (Erie Lackawanna Terminal), Hoboken NJ — procedural, CC0-1.0, no textures.
 * bun generators/nyc-hoboken-terminal.ts
 *
 * Map frame: x = model east (the Hudson), y = model north, z up, metres.
 * Placed at bearing -1°, the train shed's tracks (the outline's dominant
 * edges). Anchor: area centroid of the OSM outline way/26808027.
 *
 * Evidence
 * - OSM way/26808027 (one outline over the whole terminal: the Bush train
 *   shed x -163…35, y -62…40.5; the head house and waiting room; the ferry
 *   building along the river at ~30°) and parts 331072207/208 (the waiting
 *   room). No heights in OSM.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), in the model frame
 *   (/tmp/city/nyc/work/nyc-hoboken-terminal/bandsE.png), above the lowest
 *   ground (-0.35 m NAVD88): the train shed 7.9 m; the head house
 *   (x 35…68, y -27…20) and the block north of it 18.5 m, the waiting
 *   room's roof (x 41…60, y -27…7) to 24.5 m; the ferry building's long
 *   ridge 20 m over eaves of ~13.5 m, 74 m deep and ~170 m along the river;
 *   the clock tower at x 64…74, y -14…-5, its roof to 62.3 m (the 2008
 *   rebuild is in the 2017 flight).
 * - Published: 1907, Kenneth Murchison, Beaux-Arts; copper-clad; the
 *   ferry slips' arched facade with "LACKAWANNA" on it; the Lincoln Bush
 *   train shed; the clock tower, removed in the 1950s and rebuilt in 2008
 *   (Wikipedia; NRHP 73001102).
 * - Photos, credits in /tmp/city/nyc/work/nyc-hoboken-terminal/photos/credits.txt:
 *   the river front (Jakub Hałun, CC BY 4.0; King of Hearts, CC BY-SA 4.0;
 *   Earnest B, CC BY-SA 3.0), the clock tower and waiting room from the
 *   tracks and the street (GK tramrunner RU, CC BY-SA 4.0), the shed from
 *   above (Andy Atzert, CC BY 2.0), the ferry facade (ThirstyNollij,
 *   CC BY-SA 4.0).
 *
 * Colours: the ferry front and the tower are painted the dark copper red of
 * the 2011 restoration with green copper trim (2023 photos); the waiting
 * room's street front is green copper, its track sides copper red.
 *
 * Estimated: the arches' size and count (two on each of the three river faces north of the tower, six in
 * all), the facade's parapet (16 m) and the sign's frieze (18.4 m), the pinnacles, the tower's
 * stages (shaft to 43.5 m, clock centre 39.5 m, belfry 46–51 m, pyramid to
 * 62.3 m, rod to 66 m, from a photo scaled to the lidar), the waiting
 * room's windows, the shed's ridge rows (one per pair of tracks).
 * Lettering: "LACKAWANNA" on the ferry front is kept, drawn as block
 * strokes, because the sign is part of the landmark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, prism, finishModel, circle } from './nyc-570-lexington'
import { archPanel, rectPanel, discPanel, band, spread, block, wallFrame, hipRoof } from './nyc-city-hall'

const red = new Part(), patina = new Part(), roof = new Part(), win = new Part(), trim = new Part(), shed = new Part()

const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const edges = (r: XY[]) => r.map((a, i) => [a, r[(i + 1) % r.length]] as [XY, XY])
const L = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])

// --- The Bush train shed: low roofs over each pair of tracks, smoke slots between ---
{
  const Y0 = -62, Y1 = 40.5, EAVE = 6.9, RIDGE = 7.9
  for (const [x0, x1, y0, y1] of [[-163.4, 35, Y0, Y1], [35, 70, Y0, -30]]) {
    // The shaded body under the roofs (the platforms' depth, read as a dark mass).
    prism({ wall: roof, win: null, roof, ring: rect(x0 + 1.2, y0 + 1.2, x1 - 0.2, y1 - 1.2), z0: 0, z1: EAVE - 0.3, facade: null, bevel: 0.2 })
    const n = Math.max(1, Math.round((y1 - y0) / 9.3)), w = (y1 - y0) / n
    for (let k = 0; k < n; k++) {
      const a = y0 + k * w + 0.4, b = y0 + (k + 1) * w - 0.4, m = (a + b) / 2
      const A0: V3 = [x0, a, EAVE], A1: V3 = [x1, a, EAVE], M0: V3 = [x0, m, RIDGE], M1: V3 = [x1, m, RIDGE], B0: V3 = [x0, b, EAVE], B1: V3 = [x1, b, EAVE]
      shed.quad(A0, A1, M1, M0); shed.quad(M0, M1, B1, B0)
      // Fascia at the ends, so the rows read from the side.
      shed.tri(A0, M0, B0); shed.tri(B1, M1, A1)
      for (const [p, q] of [[A0, A1], [B1, B0]] as [V3, V3][]) shed.quad(p, q, [q[0], q[1], q[2] - 0.6], [p[0], p[1], p[2] - 0.6])
    }
  }
}

// --- The head house and the block north of it ---
{
  const hh = rect(35, -27, 68, 20.3)
  prism({ wall: red, win: null, roof, ring: hh, z0: 0, z1: 18.5, facade: null, bevel: 0.3 })
  // The street front on Hudson Place is green copper; the track sides are painted copper red.
  rectPanel(patina, [68, 20.3], [37, 20.3], 15.5, 30.6, 0.3, 18.2, 0.04)
  band(patina, hh, 17.4, 18.5, 0.6)
  const nb = rect(17, 20.3, 37, 52.5)
  prism({ wall: red, win: null, roof, ring: nb, z0: 0, z1: 18.7, facade: null, bevel: 0.3 })
  band(patina, nb, 17.6, 18.7, 0.5)
  // Windows: tall copper-framed windows on the waiting room's walls, two rows on the north block.
  for (const [a, b] of edges(hh)) {
    const len = L(a, b)
    for (const s of spread(2, len - 2, Math.round(len / 6))) { rectPanel(win, a, b, s, 2.6, 9.0, 15.6); rectPanel(win, a, b, s, 2.0, 2.0, 6.0) }
  }
  for (const [a, b] of edges(nb)) {
    const len = L(a, b)
    for (const s of spread(2, len - 2, Math.round(len / 4.5))) { rectPanel(win, a, b, s, 1.6, 3.0, 6.5); rectPanel(win, a, b, s, 1.6, 9.0, 12.5); rectPanel(win, a, b, s, 1.6, 14.0, 16.5) }
  }
  // The waiting room's green copper hipped roof with its skylight (lidar ridge 24.5 m).
  hipRoof(patina, 41.5, -27, 60, 7.5, 18.5, 6.0)
  // The 1907 cartouche over the street front's centre.
  block(patina, 47.5, 19.8, 55.5, 21.0, 18.5, 21.0)
}

// --- The ferry building: a long gabled hall along the river, the slips' arched front on the water ---
const O: XY = [78, -27], U: XY = [0.5075, 0.8616], N: XY = [0.8616, -0.5075] // along the river (30.5°) and towards it
const P = (s: number, t: number): XY => [O[0] + s * U[0] + t * N[0], O[1] + s * U[1] + t * N[1]]
{
  const EAVE = 13.5, RIDGE = 20.0, TL = -36.5
  const river: XY[] = [P(-25, 21), P(9, 38.8), P(54, 38), P(99, 34.4), [174.5, 85.7]]
  const north: XY = [115.6, 104]
  const ring: XY[] = [...river, north, P(-25, TL)]
  prism({ wall: red, win: null, roof: null, ring, z0: 0, z1: EAVE, facade: null, bevel: 0.3 })
  // The roof: two long slopes up to a ridge on t = 0, gables at both ends.
  const stS = [-25, 9, 54, 99, 140]
  const ridge = stS.map((s) => [...P(s, 0), RIDGE] as V3)
  const riv = river.map(([x, y]) => [x, y, EAVE] as V3)
  // The landward edge: the south corner, then the north corner at the end.
  const land: V3[] = stS.map((s, i) => (i === stS.length - 1 ? [north[0], north[1], EAVE] : [...P(s, TL), EAVE]) as V3)
  for (let i = 0; i < stS.length - 1; i++) {
    roof.quad(riv[i], riv[i + 1], ridge[i + 1], ridge[i])
    roof.quad(ridge[i], ridge[i + 1], land[i + 1], land[i])
  }
  roof.tri(land[0], riv[0], ridge[0])
  roof.tri(riv[4], land[4], ridge[4])
  // The cresting along the ridge, green copper.
  for (let i = 0; i < stS.length - 1; i++) {
    const a = ridge[i], b = ridge[i + 1], h = 0.5
    const sec = (c: V3): V3[] => [[c[0] - 0.3, c[1], c[2] - 0.1], [c[0] + 0.3, c[1], c[2] - 0.1], [c[0] + 0.3, c[1], c[2] + h], [c[0] - 0.3, c[1], c[2] + h]]
    patina.sweep([sec(a), sec(b)])
  }

  // The river front: a parapet rising over the eaves, two great arches per face, green trim.
  const FACE = 16.0
  // The southernmost face, by the clock tower, is the lower green-copper end of the building.
  {
    const a = river[0], b = river[1], len = L(a, b)
    rectPanel(patina, a, b, len / 2, len - 0.4, 0.3, EAVE - 0.4, 0.08)
    for (const s of spread(2, len - 2, 6)) { rectPanel(win, a, b, s, 2.2, 2.0, 5.5, 0.14); rectPanel(win, a, b, s, 2.2, 7.5, 11.0, 0.14) }
  }
  for (let i = 1; i < river.length - 1; i++) {
    const a = river[i], b = river[i + 1], len = L(a, b)
    const f = wallFrame(a, b, 0)
    // Parapet wall standing on the front edge.
    const q = (s: number, z: number, d = 0): V3 => f.at(s, z, d)
    red.quad(q(0, EAVE), q(len, EAVE), q(len, FACE), q(0, FACE))
    red.quad(q(len, EAVE, -0.8), q(0, EAVE, -0.8), q(0, FACE, -0.8), q(len, FACE, -0.8))
    red.quad(q(0, FACE), q(len, FACE), q(len, FACE, -0.8), q(0, FACE, -0.8))
    patina.quad(q(0, FACE - 0.6, 0.35), q(len, FACE - 0.6, 0.35), q(len, FACE, 0.35), q(0, FACE, 0.35))
    patina.quad(q(0, EAVE - 1.6, 0.3), q(len, EAVE - 1.6, 0.3), q(len, EAVE - 0.8, 0.3), q(0, EAVE - 0.8, 0.3))
    // Two slips: big round arches with green rims, dark within.
    for (const s of [len * 0.27, len * 0.73]) {
      const w = Math.min(15.5, len * 0.4)
      archPanel(patina, a, b, s, w + 1.6, 0.3, 12.1, 0.15, 12)
      archPanel(win, a, b, s, w, 0.3, 11.3, 0.25, 12)
    }
    // Piers between and at the ends: proud green copper with small domed pinnacles at the corners.
    for (const s of [1.2, len / 2, len - 1.2]) {
      const c = f.at(s, 0, 0.6)
      // (the middle pier of the sign face stops under the lettering)
      block(patina, c[0] - 1.2, c[1] - 1.2, c[0] + 1.2, c[1] + 1.2, 0, i === 2 && s === len / 2 ? 13.9 : FACE + 0.4)
    }
  }
  for (const v of river.slice(1)) {
    const t = (r: number, z: number): V3[] => circle(v[0], v[1], r, 8).map(([x, y]) => [x, y, z] as V3)
    patina.loft([t(1.6, FACE), t(1.6, FACE + 1.6), t(1.9, FACE + 1.9), t(1.3, FACE + 2.0)])
    patina.loft([t(1.3, FACE + 2.0), t(1.2, FACE + 2.8), t(0.7, FACE + 3.5), t(0.1, FACE + 4.0)])
  }
  // "LACKAWANNA", centred on the middle face, in block strokes on the parapet.
  {
    const a = river[2], b = river[3], len = L(a, b)
    // The sign stands on a raised frieze over the middle of the arcade.
    const fr = wallFrame(a, b, 0)
    const q = (s: number, z: number, d = 0): V3 => fr.at(s, z, d)
    const s0f = len / 2 - 18, s1f = len / 2 + 18
    red.quad(q(s0f, FACE), q(s1f, FACE), q(s1f, 18.4), q(s0f, 18.4))
    red.quad(q(s1f, FACE, -0.8), q(s0f, FACE, -0.8), q(s0f, 18.4, -0.8), q(s1f, 18.4, -0.8))
    red.quad(q(s0f, 18.4), q(s1f, 18.4), q(s1f, 18.4, -0.8), q(s0f, 18.4, -0.8))
    red.quad(q(s0f, FACE, -0.8), q(s0f, FACE), q(s0f, 18.4), q(s0f, 18.4, -0.8))
    red.quad(q(s1f, FACE), q(s1f, FACE, -0.8), q(s1f, 18.4, -0.8), q(s1f, 18.4))
    patina.quad(q(s0f - 0.3, 17.9, 0.3), q(s1f + 0.3, 17.9, 0.3), q(s1f + 0.3, 18.6, 0.3), q(s0f - 0.3, 18.6, 0.3))
    const f = wallFrame(a, b, 0.32)
    const H = 3.2, W = 2.4, gap = 0.9, Z = 14.3, T = 0.65
    // Strokes per letter in a unit box (x 0..1, y 0..1).
    const glyph: Record<string, [number, number, number, number][]> = {
      L: [[0, 0, 0, 1], [0, 0, 1, 0]],
      A: [[0, 0, 0.5, 1], [0.5, 1, 1, 0], [0.25, 0.45, 0.75, 0.45]],
      C: [[1, 1, 0, 1], [0, 1, 0, 0], [0, 0, 1, 0]],
      K: [[0, 0, 0, 1], [0, 0.5, 1, 1], [0, 0.5, 1, 0]],
      W: [[0, 1, 0.25, 0], [0.25, 0, 0.5, 0.7], [0.5, 0.7, 0.75, 0], [0.75, 0, 1, 1]],
      N: [[0, 0, 0, 1], [0, 1, 1, 0], [1, 0, 1, 1]],
    }
    const word = 'LACKAWANNA'
    const total = word.length * W + (word.length - 1) * gap
    let s0 = (len - total) / 2
    for (const ch of word) {
      for (const [x0, y0, x1, y1] of glyph[ch]) {
        const p0 = f.at(s0 + x0 * W, Z + y0 * H), p1 = f.at(s0 + x1 * W, Z + y1 * H)
        const dx = p1[0] - p0[0], dy = p1[1] - p0[1], dz = p1[2] - p0[2], l = Math.hypot(dx, dy, dz) || 1
        // A flat bar in the wall plane, T wide, standing 0.15 m proud.
        const ax: V3 = [dx / l, dy / l, dz / l], nrm = f.n
        // side = ax × n, in the wall plane across the stroke; strokes run T/2 past their ends.
        const side: V3 = [ax[1] * nrm[2] - ax[2] * nrm[1], ax[2] * nrm[0] - ax[0] * nrm[2], ax[0] * nrm[1] - ax[1] * nrm[0]]
        // Each stroke is a bar swept along it (both windings), standing 0.3 m proud of the frieze.
        const sec = (p: V3, o: number): V3[] => [[-1, 0], [1, 0], [1, 1], [-1, 1]].map(([k, d]) =>
          [0, 1, 2].map((j) => p[j] + side[j] * k * T / 2 - ax[j] * o * T / 2 + nrm[j] * d * 0.3) as V3)
        trim.sweep([sec(p0, 1), sec(p1, -1)])
      }
      s0 += W + gap
    }
  }
}

// --- The clock tower (rebuilt 2008): a tapering copper-red shaft, clocks, an open belfry, a pyramid ---
{
  const cx = 69, cy = -9.5
  const sq = (h: number, z: number): V3[] => [[cx - h, cy - h, z], [cx + h, cy - h, z], [cx + h, cy + h, z], [cx - h, cy + h, z]]
  red.loft([sq(4.6, 0), sq(4.6, 18.5), sq(4.2, 43.5)])
  // Corner pilasters running up the shaft.
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const h0 = 4.65, h1 = 4.25
    const c = (h: number, z: number): V3[] => { const x = cx + sx * h, y = cy + sy * h; return [[x - 0.9, y - 0.9, z], [x + 0.9, y - 0.9, z], [x + 0.9, y + 0.9, z], [x - 0.9, y + 0.9, z]] }
    red.loft([c(h0, 18.5), c(h1, 43.5)])
  }
  const ring = sq(4.2, 0).map(([x, y]) => [x, y] as XY)
  band(patina, ring, 34.3, 34.9, 0.25)
  // The clock stage: a white dial with a dark ring on each face.
  for (const [a, b] of edges(ring)) {
    const len = L(a, b)
    discPanel(win, a, b, len / 2, 39.4, 2.5, 0.12, 16)
    discPanel(trim, a, b, len / 2, 39.4, 2.1, 0.18, 16)
    rectPanel(win, a, b, len / 2, 1.2, 21, 32.5, 0.1) // the vertical LACKAWANNA panel, read as a dark strip
  }
  // Cornice with small pediments, then the open belfry on four corner posts.
  const cor = sq(5.0, 43.5).map(([x, y]) => [x, y] as XY)
  prism({ wall: red, win: null, roof: red, ring: cor, z0: 43.5, z1: 46.0, facade: null, bevel: 0.25 })
  band(patina, cor, 45.4, 46.0, 0.2)
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const x = cx + sx * 2.6, y = cy + sy * 2.6
    block(red, x - 0.9, y - 0.9, x + 0.9, y + 0.9, 46.0, 51.0)
  }
  block(win, cx - 2.0, cy - 2.0, cx + 2.0, cy + 2.0, 46.0, 51.0) // the dark open interior
  const cap = sq(3.8, 51).map(([x, y]) => [x, y] as XY)
  prism({ wall: red, win: null, roof: red, ring: cap, z0: 51.0, z1: 52.2, facade: null, bevel: 0.2 })
  // Pyramid roof and rod.
  const base = sq(3.6, 52.2), apex: V3 = [cx, cy, 62.3]
  for (let i = 0; i < 4; i++) red.tri(base[i], base[(i + 1) % 4], apex)
  const rod = (r: number, z: number): V3[] => circle(cx, cy, r, 6).map(([x, y]) => [x, y, z] as V3)
  patina.loft([rod(0.18, 62.0), rod(0.05, 66.0)])
}

finishModel('Hoboken Terminal', 'nyc-hoboken-terminal', [
  { part: red, material: finish('hoboken-copper-red', 0xa77466) },
  { part: patina, material: PALETTE.patina },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: trim, material: PALETTE.trim },
  { part: shed, material: finish('hoboken-shed-roof', 0xc9cbc8) },
], { bearing: -1, osm: 'way/26808027', height: 66 }, 6500)
