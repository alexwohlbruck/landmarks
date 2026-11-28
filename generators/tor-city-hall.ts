/**
 * Toronto City Hall (1965, Viljo Revell with John B. Parkin Associates) —
 * original procedural geometry, CC0-1.0.
 * bun generators/tor-city-hall.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Bearing 343.5: the podium's long edges and Toronto's street grid
 * run 16.5 degrees west of north, so the model is built in that turned frame
 * (its +y is the podium's north edge, its -y the front on Nathan Phillips
 * Square). Anchor = centroid of the podium outline OSM way/198500761:
 * -79.383955, 43.653530. Elevation 0.
 *
 * Identity (from the photos below):
 *  1. Two curved towers of unequal height, east 99.5 m (27 floors) and west
 *     79.4 m (20 floors), in plan like two parentheses round the council
 *     chamber. Their convex outer backs are blind ribbed pale concrete with
 *     two faint horizontal seams; their concave inner faces are glass in
 *     horizontal bands, closed at the south ends by a solid concrete pier.
 *                                                (decq, vagen, pano, cntower)
 *  2. The white saucer of the council chamber between them: a shallow white
 *     dome on a thin rim, a dark glazed clerestory under the rim, an
 *     inverted concrete cone, all on the glass drum of the rotunda (the
 *     "mushroom").                                   (chamber, pano, decq)
 *  3. The two-storey podium under everything: a deep concrete fascia over a
 *     recessed glazed ground floor behind a colonnade, its roof a garden
 *     (the 2010 green roof) with paved paths.         (vagen, decq, cntower)
 *  4. The ramp lobe at the south-east corner where the east elevated
 *     walkway lands on the podium.                    (vagen, decq)
 *
 * Plan (all turned into the frame):
 *  - podium: OSM way/198500761 (building=civic, height 8), as drawn. It
 *    agrees with the City of Toronto massing polygon within about 2 m.
 *  - towers: City of Toronto 3D Massing 2025 polygons (lidar-derived), which
 *    are the union of OSM's tower parts way/27767543 + way/963504341 (west)
 *    and way/27767544 + way/963504342 (east), simplified to 0.3 m. The
 *    inner 3 m strips (963504341/342) are the glass faces; their ends step
 *    back to the concrete end piers, which the model keeps.
 *  - council chamber: massing polygon (lidar roof outline): a circle of
 *    radius 23.6 m about (-2.2, -4.1); the rotunda OSM way/963504345
 *    (radius 13.0); the low glass links to the towers OSM way/963504343
 *    and way/963504344.
 *  - green roof: OSM leisure=garden layer=1 ways 300881620-633 on the
 *    podium, drawn as muted green patches.
 * Heights:
 *  - published (Wikipedia, "Toronto City Hall"; OSM tags): east tower
 *    99.5 m / 27 floors, west tower 79.4 m / 20 floors.
 *  - measured (City of Toronto 3D Massing 2025, AVG_HEIGHT): east tower
 *    99.9, west 79.8, chamber 17.3 (an average over the dome), podium 8.1.
 *  - photo-scaled: the saucer (pano: rim to dome top 6.3 m against the 47 m
 *    rim; cone 4.7 m; chamber: drum 27 m wide, 4.2 m tall over the podium
 *    roof); dome top 24.2 m (OSM says 25, "guesstimate"); the towers'
 *    seams at about 0.3 and 0.65 of their height over the podium (decq,
 *    cntower, vagen); the podium fascia 3.1 m deep over a 5 m ground floor
 *    (vagen); the glass recess at the foot of the towers' inner faces
 *    (chamber).
 * Estimated: column spacing (7.5 m) and size, the glass panel grouping
 * (two floors per panel, 3.4 m floors), the ramp lobe's thickness.
 * Left out: the ribs on the tower backs (too fine), the clerestory struts,
 * the rooftop plant on the towers, the flagpoles, the podium's parapet.
 *
 * Ground: Mapterhorn is flat under the podium (about 4.4 m on the grid,
 * within 0.2 m), so the podium stands on y = 0 all round.
 *
 * Night: the towers' inner faces are lit offices (`window`); the rotunda
 * glows; the concrete backs and the saucer are floodlit in colour (the
 * city's lighting), drawn as a `_FLOODLIGHT` wash.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  vagen    "Toronto city hall August 2017 01.jpg", Arild Vågen, CC BY-SA 4.0
 *           https://commons.wikimedia.org/wiki/File:Toronto_city_hall_August_2017_01.jpg
 *           (from the south-east, by the ramp: west tower's glass face, the
 *           podium colonnade, the east tower's back)
 *  pano     "Toronto - ON - Rathaus und Nathan Phillips Square.jpg",
 *           Taxiarchos228, CC BY 3.0
 *           https://commons.wikimedia.org/wiki/File:Toronto_-_ON_-_Rathaus_und_Nathan_Phillips_Square.jpg
 *           (from the south-west of the square)
 *  decq     "City Hall, Toronto, Ontario.jpg", Jerome Decq, CC BY 2.0
 *           https://commons.wikimedia.org/wiki/File:City_Hall,_Toronto,_Ontario.jpg
 *           (from high in the south-west)
 *  chamber  "Toronto City Hall Council Chamber and green roof.jpg", Alaney2k,
 *           CC BY-SA 4.0
 *           https://commons.wikimedia.org/wiki/File:Toronto_City_Hall_Council_Chamber_and_green_roof.jpg
 *  cntower  "Toronto City Hall from CN Tower, Toronto, Ontario (21652093330).jpg",
 *           Ken Lund, CC BY-SA 2.0
 *           https://commons.wikimedia.org/wiki/File:Toronto_City_Hall_from_CN_Tower,_Toronto,_Ontario_(21652093330).jpg
 *           (the west tower's back and the green roof from above)
 *  north    "Ontario Superior Court of Justice and Toronto City Hall, Toronto,
 *           Ontario.jpg", Ken Lund, CC BY-SA 2.0
 *           https://commons.wikimedia.org/wiki/File:Ontario_Superior_Court_of_Justice_and_Toronto_City_Hall,_Toronto,_Ontario.jpg
 *           (the west tower's back from University Avenue)
 * Plan and heights: City of Toronto, 3D Massing 2025,
 * https://open.toronto.ca/dataset/3d-massing/ (Open Government Licence –
 * Toronto); OpenStreetMap (ODbL). No look-only sources. No commercial
 * imagery.
 *
 * Doubts: the north side of the podium is not photographed (trees); its
 * ground floor is drawn like the others. The green roof patches follow OSM,
 * not a photo of the whole roof. The OSM chamber height (25 m) is a guess;
 * 24.2 m is photo-scaled.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { revolve } from './atl-tech-tower'
import { at, capPoly, ccw, circle, offset, prism, save, smoothWall, wall, type XY } from './atl-flatiron-building'

// ── Plan, in the turned frame (see header) ──
const PODIUM: XY[] = [[55.5, 54.5], [55.5, -36.0], [54.7, -36.2], [53.6, -36.3], [53.7, -58.3], [53.7, -77.6], [51.9, -74.0], [47.7, -68.7], [43.8, -64.7], [39.6, -61.1], [34.5, -58.0], [29.6, -55.7], [25.1, -54.4], [19.1, -53.6], [5.4, -53.5], [-18.5, -53.4], [-58.7, -43.6], [-58.7, -25.2], [-58.7, 53.9]]
/** The main block (the outline less the ramp lobe south of the front). */
const BLOCK: XY[] = [[55.5, 54.5], [55.5, -36.0], [53.6, -36.3], [53.6, -53.5], [19.1, -53.6], [5.4, -53.5], [-18.5, -53.4], [-58.7, -43.6], [-58.7, -25.2], [-58.7, 53.9]]
/** The ramp lobe where the east walkway lands. */
const LOBE: XY[] = [[53.6, -53.5], [53.7, -58.3], [53.7, -77.6], [51.9, -74.0], [47.7, -68.7], [43.8, -64.7], [39.6, -61.1], [34.5, -58.0], [29.6, -55.7], [25.1, -54.4], [19.1, -53.6]]
const LINK_W: XY[] = [[-14.2, 0.0], [-14.8, -2.6], [-32.1, 4.2], [-31.1, 7.1]]
const LINK_E: XY[] = [[11.2, -4.6], [10.9, -1.7], [29.0, 4.7], [29.7, 1.8]]
const TOWER_E: XY[] = [[2.3, 38.2], [14.2, 33.2], [26.8, 25.6], [31.3, 21.7], [35.2, 17.2], [37.4, 13.8], [39.4, 9.0], [40.5, 4.0], [40.7, 0.5], [40.2, -6.2], [38.7, -12.8], [35.7, -20.6], [31.9, -28.6], [29.1, -34.0], [27.2, -35.6], [26.3, -35.6], [22.5, -31.8], [23.5, -29.6], [20.5, -28.5], [24.9, -17.0], [26.9, -7.3], [26.9, -2.4], [25.6, 4.3], [24.3, 7.6], [21.4, 12.6], [15.7, 18.7], [10.7, 22.5], [0.1, 28.3], [1.5, 30.7], [-0.4, 31.7], [0.1, 36.5], [0.9, 37.9]]
const TOWER_W: XY[] = [[-42.9, -2.0], [-42.9, 2.4], [-42.0, 7.3], [-40.3, 12.1], [-37.7, 16.4], [-33.9, 20.7], [-26.3, 27.2], [-15.2, 33.9], [-14.0, 34.4], [-13.0, 34.2], [-11.0, 28.8], [-12.9, 27.5], [-11.2, 25.0], [-20.0, 18.5], [-23.8, 14.7], [-27.7, 8.8], [-30.0, 2.9], [-30.9, -2.1], [-30.9, -7.2], [-27.6, -21.7], [-30.5, -22.3], [-30.0, -24.8], [-34.1, -27.7], [-35.3, -27.7], [-36.2, -26.9], [-41.5, -11.0]]
const GARDENS: XY[][] = [
  [[-54.9, -27.2], [-49.2, -27.1], [-48.3, -25.9], [-38.5, -25.9], [-41.9, -19.2], [-43.8, -13.7], [-45.6, -5.6], [-48.9, -5.6], [-49.0, -6.4], [-55.2, -6.4]],
  [[42.3, 11.1], [51.1, 10.7], [50.9, -19.0], [46.9, -19.1], [46.7, -18.3], [38.8, -18.6], [41.3, -12.6], [43.0, -6.2], [43.7, -0.5], [43.8, 4.1], [43.3, 8.1]],
  [[-55.1, -3.6], [-53.4, -3.5], [-53.4, -2.9], [-46.1, -2.9], [-46.2, 0.8], [-45.9, 5.8], [-44.1, 11.7], [-41.8, 16.5], [-38.6, 20.8], [-53.2, 21.0], [-53.3, 20.2], [-55.5, 20.0]],
  [[2.1, 43.3], [31.3, 43.3], [31.3, 41.2], [50.9, 40.7], [51.0, 13.6], [47.4, 13.6], [47.3, 14.9], [41.3, 14.6], [36.2, 22.2], [27.7, 29.0], [18.5, 34.7], [8.5, 39.1], [1.9, 41.7]],
  [[34.8, -40.9], [32.9, -40.3], [31.0, -40.3], [29.2, -40.9], [27.6, -42.1], [26.5, -43.6], [26.0, -45.5], [26.0, -47.4], [26.6, -49.2], [27.8, -50.7], [29.3, -51.8], [31.2, -52.4], [33.1, -52.4], [34.9, -51.8], [36.4, -50.7], [37.6, -49.1], [38.1, -47.3], [38.1, -45.4], [37.5, -43.5], [36.3, -42.0]],
  [[2.1, 45.8], [39.3, 45.9], [39.3, 43.4], [51.2, 43.5], [51.2, 49.6], [2.0, 49.5]],
  [[-55.2, 40.6], [-41.3, 40.5], [-41.3, 43.3], [-14.6, 43.0], [-14.6, 49.6], [-55.1, 50.0]],
  [[32.5, -31.0], [51.4, -31.2], [50.8, -22.1], [39.4, -22.1], [39.5, -21.1], [38.0, -21.0], [35.8, -24.9]],
  [[-54.5, 38.1], [-34.2, 38.6], [-34.0, 40.7], [-14.5, 40.5], [-14.8, 38.0], [-27.7, 29.9], [-36.5, 23.3], [-55.1, 23.3]],
  [[-55.3, -29.3], [-37.1, -29.2], [-32.7, -37.8], [-39.2, -38.0], [-39.3, -40.4], [-31.1, -40.5], [-28.4, -45.9], [-55.1, -39.1]],
  [[-29.3, -28.8], [-21.6, -35.3], [-12.5, -39.4], [-2.5, -40.9], [7.4, -39.6], [7.4, -52.6], [-25.1, -46.6], [-34.7, -28.7]],
]
const C: XY = [-2.2, -4.1] // the council chamber's axis

// ── Heights ──
const DECK = 8.1 // podium roof
const FASCIA = 5.0 // underside of the podium's fascia
const H_E = 99.5, H_W = 79.4
const FLOOR = 3.4

const conc = new Part(), win = new Part(), white = new Part(), green = new Part(), roof = new Part(), door = new Part()

const sub2 = (a: XY, b: XY): XY => [a[0] - b[0], a[1] - b[1]]
const nrm2 = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

/** Edge i's outward normal on a counter-clockwise ring. */
const edgeN = (r: XY[], i: number): XY => { const d = nrm2(sub2(r[(i + 1) % r.length], r[i])); return [d[1], -d[0]] }

/**
 * Split a tower ring into its concave inner face (the edges that look at the
 * chamber) and its back. Returns the index range [i0, i1] of face edges.
 */
function faceRun(r: XY[]) {
  const n = r.length
  const isFace = (i: number) => {
    const a = r[i], b = r[(i + 1) % n], m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    const to = nrm2(sub2(C, m)), e = edgeN(r, i)
    return e[0] * to[0] + e[1] * to[1] > 0.35 && Math.hypot(b[0] - a[0], b[1] - a[1]) > 1.6
  }
  let best: [number, number] = [0, -1]
  for (let s = 0; s < n; s++) {
    if (!isFace(s) || isFace((s - 1 + n) % n)) continue
    let e = s
    while (isFace((e + 1) % n) && (e + 1) % n !== s) e = (e + 1) % n
    const len = ((e - s + n) % n) + 1
    if (len > ((best[1] - best[0] + n) % n) + 1 || best[1] < 0) best = [s, e]
  }
  return best
}

/** Walls round a ring with a per-edge material, smooth along runs of the same material. */
function walls(r: XY[], pick: (i: number) => Part, z0: number, z1: number) {
  const n = r.length
  let s = 0
  while (pick(s) === pick((s - 1 + n) % n) && s < n - 1) s++ // start at a material change
  for (let k = 0; k < n;) {
    const i0 = (s + k) % n, p = pick(i0)
    let len = 1
    while (len < n && pick((i0 + len) % n) === p) len++
    const pts = Array.from({ length: len + 1 }, (_, j) => r[(i0 + j) % n])
    smoothWall(p, pts, z0, z1, false)
    k += len
  }
}

/** A V-groove seam all round a ring at height z. */
function seam(p: Part, r: XY[], z: number, d = 0.3) {
  const inner = offset(r, -d)
  p.loft([at(r, z - d), at(inner, z)])
  p.loft([at(inner, z), at(r, z + d)])
}

/** A quad wound to face `want`. */
function facing(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const n = cross(sub(b, a), sub(c, a))
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}

/** Points along a polyline by arc length. */
function polyAt(pl: XY[], s: number): XY {
  for (let i = 0; i < pl.length - 1; i++) {
    const L = Math.hypot(pl[i + 1][0] - pl[i][0], pl[i + 1][1] - pl[i][1])
    if (s <= L || i === pl.length - 2) {
      const t = Math.min(1, Math.max(0, s / L))
      return [pl[i][0] + (pl[i + 1][0] - pl[i][0]) * t, pl[i][1] + (pl[i + 1][1] - pl[i][1]) * t]
    }
    s -= L
  }
  return pl[pl.length - 1]
}
const polyLen = (pl: XY[]) => pl.slice(1).reduce((a, q, i) => a + Math.hypot(q[0] - pl[i][0], q[1] - pl[i][1]), 0)

/**
 * A window panel following a polyline wall (outside to the right of its
 * direction) between arc lengths s0..s1 and heights z0..z1, `out` off it.
 */
function curvedPanel(p: Part, pl: XY[], s0: number, s1: number, z0: number, z1: number, out = 0.08) {
  const cum = [0]
  for (let i = 1; i < pl.length; i++) cum.push(cum[i - 1] + Math.hypot(pl[i][0] - pl[i - 1][0], pl[i][1] - pl[i - 1][1]))
  const ss = [s0, ...cum.filter((c) => c > s0 + 0.3 && c < s1 - 0.3), s1]
  const pt = (s: number): XY => {
    const q = polyAt(pl, s)
    // the normal of the edge under s
    let i = 0
    while (i < pl.length - 2 && cum[i + 1] < s) i++
    const d = nrm2(sub2(pl[i + 1], pl[i]))
    return [q[0] + d[1] * out, q[1] - d[0] * out]
  }
  for (let k = 0; k < ss.length - 1; k++) {
    const a = pt(ss[k]), b = pt(ss[k + 1])
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}

/** One tower: ring, height, seam heights. */
function tower(raw: XY[], top: number, seams: number[]) {
  const r = ccw(raw), n = r.length
  const [f0, f1] = faceRun(r)
  const inFace = (i: number) => ((i - f0 + n) % n) <= ((f1 - f0 + n) % n)
  // The glass recess at the foot of the inner face: face vertices pulled in 1.5 m.
  const LOBBY = 12.2
  const low = r.map((q, i): XY => {
    const prevFace = inFace((i - 1 + n) % n), nextFace = inFace(i)
    if (!(prevFace && nextFace)) return q
    const a = edgeN(r, (i - 1 + n) % n), b = edgeN(r, i), m = nrm2([a[0] + b[0], a[1] + b[1]])
    return [q[0] - m[0] * 1.5, q[1] - m[1] * 1.5]
  })
  walls(low, (i) => (inFace(i) ? win : conc), DECK, LOBBY)
  // The underside of the overhang over the recess.
  for (let i = 0; i < n; i++) {
    if (!inFace(i)) continue
    const j = (i + 1) % n
    const a: V3 = [r[i][0], r[i][1], LOBBY], b: V3 = [r[j][0], r[j][1], LOBBY], c: V3 = [low[j][0], low[j][1], LOBBY], d: V3 = [low[i][0], low[i][1], LOBBY]
    facing(conc, a, b, c, d, [0, 0, -1])
  }
  // The shaft, in stacked lifts with a seam between them, and a soft top edge.
  const zs = [LOBBY, ...seams, top]
  for (let k = 0; k < zs.length - 1; k++) {
    const za = k === 0 ? zs[k] : zs[k] + 0.3, zb = k === zs.length - 2 ? top - 0.7 : zs[k + 1] - 0.3
    walls(r, () => conc, za, zb)
    if (k < zs.length - 2) seam(conc, r, zs[k + 1])
  }
  const inner = offset(r, -0.7)
  conc.loft([at(r, top - 0.7), at(inner, top)])
  capPoly(roof, inner, top, true)

  // Glass bands on the inner face: one panel per bay, two floors tall, with
  // solid floors at the seams (the plant floors) and under the roof.
  const face = Array.from({ length: ((f1 - f0 + n) % n) + 2 }, (_, j) => r[(f0 + j) % n])
  const L = polyLen(face)
  const m0 = 1.2, m1 = 1.2
  const bays = Math.max(1, Math.round((L - m0 - m1) / 12)), bw = (L - m0 - m1) / bays
  const ranges: [number, number][] = []
  const stops = [LOBBY + 0.6, ...seams.flatMap((s) => [s - FLOOR / 2, s + FLOOR / 2]), top - 2.4]
  for (let k = 0; k < stops.length; k += 2) ranges.push([stops[k], stops[k + 1]])
  for (const [za, zb] of ranges) {
    const groups = Math.max(1, Math.round((zb - za) / (2 * FLOOR))), gh = (zb - za) / groups
    for (let g = 0; g < groups; g++) {
      for (let b = 0; b < bays; b++) {
        const s0 = m0 + b * bw + 0.15, s1 = m0 + (b + 1) * bw - 0.15
        curvedPanel(win, face, s0, s1, za + g * gh + 0.4, za + (g + 1) * gh - 0.4)
      }
    }
  }
}

// ── Towers ──
tower(TOWER_E, H_E, [8 + 0.24 * (H_E - 8) + 0.1, 8 + 0.61 * (H_E - 8)])
tower(TOWER_W, H_W, [8 + 0.3 * (H_W - 8), 8 + 0.68 * (H_W - 8)])

// ── Podium ──
{
  const block = ccw(BLOCK)
  // The fascia and roof deck over the whole outline (the lobe included).
  const all = ccw(PODIUM)
  prism(conc, all, FASCIA, DECK, conc, 0.4, true)
  // The recessed glazed ground floor behind the colonnade.
  const rec = offset(block, -2.6)
  wall(conc, rec, 0, FASCIA)
  for (let i = 0; i < rec.length; i++) {
    const a = rec[i], b = rec[(i + 1) % rec.length]
    const Lw = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (Lw < 3) continue
    const bays = Math.max(1, Math.round((Lw - 1) / 7.5)), w = (Lw - 1) / bays
    const t = nrm2(sub2(b, a)), nn: XY = [t[1], -t[0]]
    const P = (s: number, z: number): V3 => [a[0] + t[0] * s + nn[0] * 0.06, a[1] + t[1] * s + nn[1] * 0.06, z]
    for (let k = 0; k < bays; k++) {
      const s0 = 0.5 + k * w + 0.35, s1 = 0.5 + (k + 1) * w - 0.35
      // Doors: the main entrance, mid-front under the chamber's axis.
      const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
      const sm = a[0] + t[0] * (s0 + s1) / 2
      const front = Math.abs(nn[1] + 1) < 0.05 && mid[1] < -45
      if (front && Math.abs(sm - C[0]) < 12) {
        door.quad(P(s0, 0), P(s1, 0), P(s1, 3.2), P(s0, 3.2))
        win.quad(P(s0, 3.5), P(s1, 3.5), P(s1, FASCIA - 0.4), P(s0, FASCIA - 0.4))
      } else win.quad(P(s0, 0.3), P(s1, 0.3), P(s1, FASCIA - 0.4), P(s0, FASCIA - 0.4))
    }
  }
  // The colonnade: square columns 1.2 m in from the fascia's edge.
  const col = offset(block, -1.2)
  for (let i = 0; i < col.length; i++) {
    const a = col[i], b = col[(i + 1) % col.length], Lw = Math.hypot(b[0] - a[0], b[1] - a[1])
    const k = Math.max(1, Math.round(Lw / 7.5))
    for (let j = 0; j < k; j++) {
      const s = j / k, c: XY = [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s]
      prism(conc, circle(c, 0.5, 6, Math.PI / 6), 0, FASCIA, null, 0)
    }
  }
  // The ramp lobe rests on three round columns.
  for (const c of [[30, -55.2], [42, -59], [51, -66]] as XY[]) prism(conc, circle(c, 0.6, 8), 0, FASCIA, null, 0)
  // The green roof.
  for (const g of GARDENS) capPoly(green, ccw(g), DECK + 0.06, true)
}

// ── The ramp from the square up to the podium's front (OSM way/43605455) ──
{
  const path: XY[] = [[50.0, -126.5], [50.25, -94.2], [49.7, -89.2], [48.2, -83.6], [46.8, -80.0], [45.2, -77.2], [43.4, -74.6], [41.1, -72.1], [37.0, -68.2], [32.7, -65.2], [28.4, -63.1], [24.2, -61.4], [19.8, -60.2], [17.5, -58.6], [16.8, -55.5]]
  const cum = [0]
  for (let i = 1; i < path.length; i++) cum.push(cum[i - 1] + Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]))
  const rise = cum[12] // the OSM way's own length; the last two points are the landing
  const zAt = (i: number) => Math.min(DECK, (DECK * cum[i]) / rise)
  const W = 2.6, PAR = 1.0, T = 0.3
  const side = (d: number) => path.map((q, i): XY => {
    const a = path[Math.max(0, i - 1)], b = path[Math.min(path.length - 1, i + 1)], t = nrm2(sub2(b, a))
    return [q[0] + t[1] * d, q[1] - t[0] * d] // d > 0: to the right (west side going north)
  })
  const R = side(W), Ri = side(W - T), Lf = side(-W), Li = side(-W + T)
  const P = (r: XY[], i: number, z: number): V3 => [r[i][0], r[i][1], z]
  for (let i = 0; i < path.length - 1; i++) {
    const j = i + 1, z0 = zAt(i), z1 = zAt(j)
    facing(conc, P(Ri, i, z0), P(Li, i, z0), P(Li, j, z1), P(Ri, j, z1), [0, 0, 1]) // the walking surface
    for (const [o, n, d] of [[R, Ri, 1], [Lf, Li, -1]] as [XY[], XY[], number][]) {
      const t = nrm2(sub2(path[j], path[i])), out: V3 = [t[1] * d, -t[0] * d, 0]
      facing(conc, P(o, i, 0), P(o, j, 0), P(o, j, z1 + PAR), P(o, i, z0 + PAR), out) // the outer wall to the ground
      facing(conc, P(o, i, z0 + PAR), P(o, j, z1 + PAR), P(n, j, z1 + PAR), P(n, i, z0 + PAR), [0, 0, 1]) // parapet top
      facing(conc, P(n, i, z0), P(n, j, z1), P(n, j, z1 + PAR), P(n, i, z0 + PAR), [-out[0], -out[1], 0]) // parapet's inner face
    }
  }
}

// ── The council chamber ──
{
  const N = 28
  smoothWall(win, circle(C, 13.0, N), DECK, 12.3) // the rotunda's glass drum
  revolve(conc, C, [[13.0, 12.3], [20.6, 16.4]], N, 0, false, false) // the inverted cone
  smoothWall(win, circle(C, 20.6, N), 16.4, 18.0) // the clerestory under the rim
  revolve(white, C, [[20.6, 18.0], [23.6, 18.0]], N, 0, false, false) // the rim's underside
  revolve(white, C, [[23.6, 18.0], [23.6, 18.7], [22.6, 19.4], [20, 20.5], [16, 21.9], [11, 23.1], [6, 23.9], [0, 24.2]], N, 0, false, false)
  // The low glass links from the rotunda to the towers.
  for (const l of [LINK_W, LINK_E]) prism(win, ccw(l), DECK, 12.0, conc, 0.2)
}

// Night: the city's floodlighting washes the tower backs and the saucer.
const concLit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.05 : p[2] > 12 ? 0.4 : 0.15)
const domeLit = (p: V3, n: V3) => (n[2] > 0.9 ? 0.3 : 0.6)
await save('tor-city-hall', 'Toronto City Hall', [
  { part: conc, material: { ...finish('tch-concrete', 0xd9d1c3), floodlight: concLit } },
  { part: win, material: PALETTE.window },
  { part: white, material: { ...finish('tch-dome', 0xeeece6), floodlight: domeLit } },
  { part: green, material: finish('tch-green-roof', 0xa3ad8a) },
  { part: roof, material: PALETTE.roof },
  { part: door, material: PALETTE.entrance },
], { height: H_E, anchor: [43.65353, -79.383955], bearing: 343.5 }, 6500)
