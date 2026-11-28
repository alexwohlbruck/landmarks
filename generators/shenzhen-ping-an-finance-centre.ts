/**
 * Ping An Finance Centre, Futian, Shenzhen — original procedural geometry, CC0-1.0.
 * bun generators/shenzhen-ping-an-finance-centre.ts   (writes the low model and the detail LOD)
 *
 * Also exports the small surface kit (`grid`, `rib`) that the other
 * `shenzhen-` generators of this batch import.
 *
 * The landmark's record (form, evidence, numbers, doubts) is the block comment
 * after the kit section below.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { face, prism, bar, saveLods, type Layer, type XY } from './auckland-sky-tower'
import { polyTris } from './berlin-oberbaum-bridge'

// ---- Kit (shared by the shenzhen- generators) -------------------------------------------------------------

export const nrm3 = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / l, v[1] / l, v[2] / l]
}

/**
 * A surface over a grid of points `g[k][i]`: rows k bottom to top, columns i
 * counter-clockwise seen from outside-above (so the surface faces outward).
 * `closed` joins the last column to the first. Normals are smoothed up the
 * rows; across columns only where `smooth(i)` says vertex column i is not a
 * crease. `pick(i, k)` chooses the part for quad column i, row k (null skips it).
 */
export function grid(g: V3[][], closed: boolean, pick: (i: number, k: number) => Part | null, smooth: (vi: number) => boolean = () => false) {
  const K = g.length, N = g[0].length, C = closed ? N : N - 1
  const qn: V3[][] = []
  for (let k = 0; k < K - 1; k++) {
    qn.push([])
    for (let i = 0; i < C; i++) {
      const j = (i + 1) % N
      const a = g[k][i], b = g[k][j], c = g[k + 1][j], d = g[k + 1][i]
      const e1: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]], e2: V3 = [d[0] - b[0], d[1] - b[1], d[2] - b[2]]
      qn[k].push(nrm3([e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]))
    }
  }
  const vn = (qi: number, k: number, vi: number): V3 => {
    const cols = [qi]
    if (smooth(vi) && (closed || (vi > 0 && vi < N - 1))) cols.push(vi === qi ? (vi - 1 + C) % C : vi % C)
    const s: V3 = [0, 0, 0]
    for (const c of cols) for (const kk of [k - 1, k]) if (kk >= 0 && kk < K - 1) {
      const n = qn[kk][c]
      // don't smooth across a sharp bend between rows (> ~35 deg)
      const o = qn[k < K - 1 ? Math.min(k, K - 2) : K - 2][qi]
      if (kk !== Math.min(k, K - 2) && n[0] * o[0] + n[1] * o[1] + n[2] * o[2] < 0.82) continue
      s[0] += n[0]; s[1] += n[1]; s[2] += n[2]
    }
    return nrm3(s)
  }
  for (let k = 0; k < K - 1; k++) for (let i = 0; i < C; i++) {
    const p = pick(i, k)
    if (!p) continue
    const j = (i + 1) % N
    const a = g[k][i], b = g[k][j], c = g[k + 1][j], d = g[k + 1][i]
    const na = vn(i, k, i), nb = vn(i, k, j), nc = vn(i, k + 1, j), nd = vn(i, k + 1, i)
    p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
    p.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
  }
}

/**
 * A rib standing proud of a wall, following `path` (points on the wall,
 * bottom to top) with the wall's outward horizontal normal `out` at each
 * point: `w` wide, `d` proud, sunk `e` into the wall. Sides, front and a top
 * cap; open at the bottom (it stands on the ground or the wall).
 */
export function rib(p: Part, path: V3[], out: V3[], w: number | ((k: number) => number), d: number | ((k: number) => number), e = 0.15, top = true) {
  const rows = path.map((q, k) => {
    const n = nrm3([out[k][0], out[k][1], 0]), t: V3 = [-n[1], n[0], 0]
    const W = typeof w === 'number' ? w : w(k), D = typeof d === 'number' ? d : d(k)
    const P = (s: number, r: number): V3 => [q[0] + t[0] * s + n[0] * r, q[1] + t[1] * s + n[1] * r, q[2]]
    return [P(-W / 2, -e), P(-W / 2, D), P(W / 2, D), P(W / 2, -e)]
  })
  grid(rows, false, () => p)
  if (top) {
    const r = rows[rows.length - 1]
    face(p, r, [0, 0, 1])
  }
}

/** Flat polygon (any simple shape) at height z, facing up or down. */
export function flat(p: Part, poly: XY[], z: number, up = true) {
  for (const [a, b, c] of polyTris(poly)) face(p, [[a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z]], [0, 0, up ? 1 : -1])
}

export const smoothstep = (t: number) => { const u = Math.max(0, Math.min(1, t)); return u * u * (3 - 2 * u) }
/** Piecewise-linear interpolation over sorted [x, y] knots. */
export function pwl(knots: [number, number][], x: number) {
  if (x <= knots[0][0]) return knots[0][1]
  for (let i = 1; i < knots.length; i++) if (x <= knots[i][0]) {
    const [x0, y0] = knots[i - 1], [x1, y1] = knots[i]
    return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0)
  }
  return knots[knots.length - 1][1]
}

/*
 * ---- Ping An Finance Centre ---------------------------------------------------------------------------------
 *
 * Frame: bearing 0 (its faces run north-south and east-west). Origin = area
 * centroid of the OSM outline way/535860513 (114.050355 E, 22.536640 N), on
 * the ground; the tower axis is at the origin. Elevation 0.
 *
 * Form, as read from OSM and the photos:
 * - plan: a square with deep 45-degree corner chamfers (the OSM parts put the
 *   faces at +/-30 m and the chamfer legs at ~13.5 m: a 33 m face and a 19 m
 *   chamfer), held the same in proportion all the way up;
 * - the base flares out over the lowest 120 m to the OSM ground outline
 *   (+/-38 m), as the mega-columns splay to the ground;
 * - the shaft rises almost straight (61 -> 59 m across) to the crown shoulder
 *   at 467 m; the crown tapers in two stages, to 46 m at 557 m and to a
 *   12 m square at 594 m, its chamfers closing as it rises; near the top each
 *   face is open (the cancelled spire's frame: the photos look into it),
 *   drawn as a dark opening set 2 m back (579-591 m) under a steel lintel,
 *   and a low steel pyramid finishes it at 599.1 m;
 * - the eight stainless-steel corner piers: two per corner, standing proud at
 *   the edges of each chamfer, full height and up the crown's edges; the
 *   chevrons: diagonal steel members zig-zagging across each chamfer between
 *   its two piers, one V per belt interval;
 * - the faces: a pale silver-grey curtain wall with vertical steel fins, and
 *   dark two-storey belt bands at the refuge floors (~71 m apart);
 * - the PAFC Mall podium on the south (OSM way/773719239, 55 m): a plain pale
 *   grey block, part of the same complex.
 *
 * Evidence
 * - OSM, fetched 2026-11-27 with tools/osm.py: outline way/535860513 (599.1 m,
 *   117 levels, roof:height 36.9, Q1077308) and its 54 building:part ways
 *   way/1472466043-1472466096 (skillion parts at 120/407/467/557/590 m and the
 *   599.1 m pyramid top), the 63 m south entrance part way/1472466056, and the
 *   PAFC Mall way/773719239 (55 m, 11 levels).
 * - Published: 599.1 m architectural top, 115 floors above ground, KPF,
 *   completed 2017 (Wikipedia "Ping An Finance Center"; CTBUH Skyscraper Center).
 * - Photos (Wikimedia Commons, daylight):
 *   "Pingan International Finance Center2020.jpg", Charlie fong, CC BY-SA 4.0,
 *   from the west (277 deg, 1.5 km), face-on: the width, crown stages,
 *   belt bands, piers and chevrons; https://commons.wikimedia.org/wiki/File:Pingan_International_Finance_Center2020.jpg
 *   "平安金融中心 2019-12-23.jpg", Mx. Granger, CC0, from the SSE (158 deg, 380 m):
 *   base flare, chevrons, corner piers, the mall, colours;
 *   https://commons.wikimedia.org/wiki/File:%E5%B9%B3%E5%AE%89%E9%87%91%E8%9E%8D%E4%B8%AD%E5%BF%83_2019-12-23.jpg
 *   "PING AN FINANCE CENTER, SHENZHEN (17).jpg", Dinkun Chen, CC BY-SA 4.0,
 *   from the WSW (246 deg, 700 m), telephoto: the crown, its corner ridges,
 *   fins and open top openings; https://commons.wikimedia.org/wiki/File:PING_AN_FINANCE_CENTER,_SHENZHEN_(17).jpg
 *   "Ping'an International Financial Center 20160307-2.jpg", そらみみ, CC BY-SA 4.0,
 *   from the NNW (342 deg, 860 m); https://commons.wikimedia.org/wiki/File:Ping%27an_International_Financial_Center_20160307-2.jpg
 *   "PING AN FINANCE CENTER, SHENZHEN (26).jpg", Dinkun Chen, CC BY-SA 4.0,
 *   from the north (6 deg, 1.4 km); https://commons.wikimedia.org/wiki/File:PING_AN_FINANCE_CENTER,_SHENZHEN_(26).jpg
 * - No lidar, NAIP or Mapillary used (none open here).
 * - Look-only references: none.
 *
 * Numbers
 * - Published: 599.1 m top.
 * - Measured (OSM): ground outline +/-38 m with corner cuts; shaft faces
 *   +/-30 m, chamfer legs ~13.5 m; crown stages at 467, 557 and 590 m; the
 *   +/-6 m top square; the mall outline and 55 m height.
 * - Measured (photo, the west photo scaled to 599.1 m): 60 m across at the
 *   crown shoulder (y 467 m agrees with OSM), 65 m at ~85 m; crown 46 m across
 *   at 557 m, ~13 m at 590 m; belt bands at ~49, 120, 191, 262, 332, 403 and
 *   474 m.
 * - Estimated: pier width (3.2 m) and projection (1.4 m), fin spacing and
 *   depth, chevron bar size, the top openings (579-591 m) and the final pyramid (594-599.1 m), colours
 *   sampled from the west, SSE and crown photos (faces #9da0a7, belts and
 *   chamfer glass #686c77-#7e7f89, steel #bebcc1), pulled to the palette.
 * - Invented: the chevrons' exact rhythm (one V per belt interval, drawn as
 *   a zig-zag), simplified from the real bracing.
 *
 * Doubts
 * - The real corner is more intricate (faceted glass beside each pier); drawn
 *   as one chamfer between two piers.
 * - The mall's real facade is a pixelated grey cladding; drawn plain.
 * - East side seen only from far (4 km).
 *
 * Night: the faces glow as windows (`window`), the belt bands as `window-2`; the steel piers and crown edges carry the LED outline
 * lighting the tower shows at night (`neon-pa-pier`, its own silver-white).
 */

const TOP = 599.1
const SHOULDER = 467, CROWN2 = 557, CROWN3 = 594, OPEN = 579, LINTEL = 591, REC = 2.0
const BELTS = [49, 120, 191, 262, 332, 403, 474]
const BELT_H = 6.5

/** Half-width (face to centre) at height z. */
function halfW(z: number) {
  if (z <= 120) return 30.5 + 7.6 * Math.pow(1 - z / 120, 1.7)
  if (z <= SHOULDER) return 30.5 - 1.0 * ((z - 120) / (SHOULDER - 120))
  if (z <= CROWN2) return pwl([[SHOULDER, 29.5], [CROWN2, 23]], z)
  return pwl([[CROWN2, 23], [CROWN3, 6.2], [TOP, 6.2]], z)
}
const CHAMF = 0.45
/** The plan octagon at z, counter-clockwise from the east face's south end; inset pulls it in. */
function oct(z: number, inset = 0): V3[] {
  const a = halfW(z) - inset, k = CHAMF * (1 - smoothstep((z - CROWN2) / (CROWN3 - CROWN2 + 4))) * (a + inset)
  const b = a - k
  return [[a, -b, z], [a, b, z], [b, a, z], [-b, a, z], [-a, b, z], [-a, -b, z], [-b, -a, z], [b, -a, z]]
}
/** Outward normal of side i of the octagon (even = face, odd = chamfer). */
const sideN = (i: number): V3 => {
  const ang = (i * Math.PI) / 4
  return [Math.cos(ang), Math.sin(ang), 0]
}

type Set = { face: Part; dark: Part; pier: Part; fin: Part; roof: Part; mall: Part }
const mk = (): Set => ({ face: new Part(), dark: new Part(), pier: new Part(), fin: new Part(), roof: new Part(), mall: new Part() })

function build(s: Set, d: boolean) {
  // levels: flare, belts, shaft, crown
  const lv = new Set<number>([0, 8, 18, 30, 45, 62, 80, 100, 120, SHOULDER, CROWN2, 566, 573, OPEN])
  for (const b of BELTS) { lv.add(b - BELT_H / 2); lv.add(b + BELT_H / 2) }
  for (let z = 480; z < CROWN2; z += d ? 15 : 30) lv.add(z)
  if (d) for (let z = 150; z < SHOULDER; z += 35) lv.add(z)
  const levels = [...lv].filter((z) => z <= OPEN).sort((a, b) => a - b)
  // levels where the outline bends (piers and fins only need these)
  const bend = (d ? [0, 8, 18, 30, 45, 62, 80, 100, 120] : [0, 15, 35, 62, 90, 120]).concat([SHOULDER, ...levels.filter((z) => z > SHOULDER)])
  const inBelt = (z0: number, z1: number) => BELTS.some((b) => z0 >= b - BELT_H / 2 - 0.01 && z1 <= b + BELT_H / 2 + 0.01)

  // the tower skin: faces in window, chamfers and belts dark
  const rings = levels.map((z) => oct(z))
  grid(rings, true, (i, k) => (i % 2 === 0 && inBelt(levels[k], levels[k + 1]) ? s.dark : s.face), () => false)
  // belts recessed look: a thin steel sill and head across each face
  for (const b of BELTS) for (const zz of [b - BELT_H / 2, b + BELT_H / 2]) {
    if (!d && zz === b - BELT_H / 2) continue
    const r = oct(zz)
    for (let i = 0; i < 8; i += 2) {
      const a = r[i], c = r[(i + 1) % 8], n = sideN(i)
      bar(s.fin, [a[0] + n[0] * 0.3, a[1] + n[1] * 0.3, zz], [c[0] + n[0] * 0.3, c[1] + n[1] * 0.3, zz], d ? 0.8 : 1.1, 0.6, n)
    }
  }

  // ---- the crown top: the faces carry on (set back 2 m) round dark openings, a band, and a low pyramid
  const ledge0 = oct(OPEN), ledge1 = oct(OPEN, REC)
  for (let i = 0; i < 8; i++) face(s.roof, [ledge0[i], ledge0[(i + 1) % 8], ledge1[(i + 1) % 8], ledge1[i]], [0, 0, 1])
  grid([oct(OPEN, REC), oct(LINTEL, REC)], true, () => s.dark)
  const so0 = oct(LINTEL, REC), so1 = oct(LINTEL)
  for (let i = 0; i < 8; i++) face(s.pier, [so0[i], so0[(i + 1) % 8], so1[(i + 1) % 8], so1[i]], [0, 0, -1])
  grid([oct(LINTEL), oct(CROWN3)], true, () => s.pier)
  const apex = oct(CROWN3, 4.6).map((q) => [q[0], q[1], TOP] as V3)
  grid([oct(CROWN3), apex], true, () => s.pier)
  flat(s.roof, apex.map((q) => [q[0], q[1]] as XY), TOP)

  // ---- corner piers: at both edges of each chamfer, full height and up the crown edges
  const pz: number[] = [...bend, LINTEL, CROWN3]
  const PW = d ? 3.0 : 3.4, PD = d ? 1.3 : 1.5
  for (let v = 0; v < 8; v++) {
    // vertex v sits between side v-1 and side v; outward = bisector of the two side normals
    const n1 = sideN((v + 7) % 8), n2 = sideN(v)
    const out: V3 = nrm3([n1[0] + n2[0], n1[1] + n2[1], 0])
    const path = pz.map((z) => oct(z)[v])
    rib(s.pier, path, path.map(() => out), PW, (k) => PD * (1 - 0.5 * smoothstep((pz[k] - CROWN2) / (CROWN3 - CROWN2))), 0.2, true)
  }

  // ---- chevrons across each chamfer: a zig-zag between its two piers, one V per belt interval
  const marks = [0, ...BELTS, SHOULDER + 45, CROWN2]
  for (let c = 1; c < 8; c += 2) {
    const n = sideN(c)
    for (let m = 0; m < marks.length - 1; m++) {
      const z0 = marks[m] + (m === 0 ? 4 : BELT_H / 2), z1 = marks[m + 1] - BELT_H / 2
      const zm = (z0 + z1) / 2
      const L = (z: number) => { const r = oct(z); return r[c] }, R = (z: number) => { const r = oct(z); return r[(c + 1) % 8] }
      const M = (z: number): V3 => { const a = L(z), b = R(z); return [(a[0] + b[0]) / 2 + n[0] * 0.35, (a[1] + b[1]) / 2 + n[1] * 0.35, z] }
      const at = (q: V3, f: number): V3 => [q[0] + n[0] * 0.35, q[1] + n[1] * 0.35, q[2]]
      // V: from both piers at the bottom to the middle at zm, and back out to both piers at the top
      const w = d ? 0.9 : 1.4
      bar(s.pier, at(L(z0), 0), M(zm), w, 0.7, n)
      bar(s.pier, at(R(z0), 0), M(zm), w, 0.7, n)
      bar(s.pier, M(zm), at(L(z1), 0), w, 0.7, n)
      bar(s.pier, M(zm), at(R(z1), 0), w, 0.7, n)
    }
  }

  // ---- vertical steel fins on the faces (grouped: 5 per face in the low model, 15 in the detail)
  const NF = d ? 15 : 5
  for (let f = 0; f < 8; f += 2) {
    const n = sideN(f)
    for (let j = 1; j <= NF; j++) {
      const t = j / (NF + 1)
      const fz = bend.filter((z) => z <= CROWN2 + 0.01)
      const path = fz.map((z) => {
        const r = oct(z), a = r[f], b = r[(f + 1) % 8]
        return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, z] as V3
      })
      rib(s.fin, path, path.map(() => n), d ? 0.55 : 0.8, d ? 0.7 : 0.9, 0.1, true)
    }
  }

  // ---- crown faces above 557 carry a few long fins converging to the top (detail)
  if (d) for (let f = 0; f < 8; f += 2) {
    const n = sideN(f)
    for (let j = 1; j <= 5; j++) {
      const t = j / 6
      const path = [CROWN2, 566, 573, OPEN].map((z) => {
        const r = oct(z), a = r[f], b = r[(f + 1) % 8]
        return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, z] as V3
      })
      rib(s.fin, path, path.map(() => n), 0.5, 0.6, 0.1, true)
    }
  }

  // ---- the PAFC Mall podium (way/773719239), 55 m, with a chamfered top edge and grouped window bands
  prism(s.mall, MALL, 0, MALL_H)
  for (const zb of d ? [12, 23, 34, 45] : [17, 38]) ringPanels(s.dark, MALL, zb, zb + (d ? 4.5 : 6))
}

/** Window panels just proud of a prism's walls between z0 and z1, inset from each corner. */
function ringPanels(p: Part, poly: XY[], z0: number, z1: number) {
  const n = poly.length
  const area = poly.reduce((acc, a, i) => { const b = poly[(i + 1) % n]; return acc + a[0] * b[1] - b[0] * a[1] }, 0)
  for (let i = 0; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 8) continue
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const o: XY = area > 0 ? [u[1], -u[0]] : [-u[1], u[0]]
    const P = (s: number, z: number): V3 => [a[0] + u[0] * s + o[0] * 0.05, a[1] + u[1] * s + o[1] * 0.05, z]
    face(p, [P(2, z0), P(L - 2, z0), P(L - 2, z1), P(2, z1)], [o[0], o[1], 0])
  }
}

const MALL_H = 55
// way/773719239 in this frame (metres east/north of the anchor); its north edge is the tower's south base
const MALL: XY[] = [[-20.7, -37.9], [-27.7, -50.0], [-20.5, -78.4], [-18.4, -90.5], [-19.3, -111.2], [-0.5, -110.8], [26.8, -110.3], [45.5, -127.0], [49.1, -123.6], [57.1, -115.9], [56.0, -74.3], [20.6, -42.0], [20.6, -37.8]]

// ---- Materials and output ----------------------------------------------------------------------------------

const FACE: MaterialSpec = { ...PALETTE.window, color: 0xaab0ba }
const DARK: MaterialSpec = windowVariant(2, 0x7a808c)
const PIER: MaterialSpec = finish('neon-pa-pier', 0xd3d6dc, 0.45)
const FIN: MaterialSpec = finish('pa-steel', 0xc4c8cf, 0.5)
const ROOF: MaterialSpec = PALETTE.roof
const MALLM: MaterialSpec = finish('pa-mall', 0xc9cacd)
const layers = (s: Set): Layer[] => [
  { part: s.face, material: FACE },
  { part: s.dark, material: DARK },
  { part: s.pier, material: PIER },
  { part: s.fin, material: FIN },
  { part: s.roof, material: ROOF },
  { part: s.mall, material: MALLM },
]

if (import.meta.main) {
  const low = mk(), det = mk()
  build(low, false)
  build(det, true)
  await saveLods('shenzhen-ping-an-finance-centre', 'Ping An Finance Centre', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the OSM outline centroid, on the ground',
    bearing: 0, height: TOP,
  }, 6500)
}
