/**
 * Rogers Centre (SkyDome), Toronto: original procedural geometry, CC0-1.0,
 * no textures.  bun generators/tor-rogers-centre.ts
 *
 * Writes models/tor-rogers-centre.glb (low) and
 * models/tor-rogers-centre.detail.glb (from zoom 16: finer arcs, the roof
 * panels' ribs, closer base ribs).
 *
 * Map frame: x east', y north', z up, metres, turned to bearing 343 (the
 * base's straight sides, OSM way/7969701, and Toronto's street grid).
 * Anchor: the centre of the roof's circle, a least-squares fit to OSM's
 * dome part way/1104122006 (radius 102.7 m): lng -79.38916069, lat
 * 43.64156822, 5 m south of the outline's area centroid.
 *
 * Identity: the white retractable roof drawn closed: two sliding barrel
 * panels across the middle (axis north-south, arcs east-west; the southern
 * one rides 2.5 m over the northern), the rotating south cap and the fixed
 * north cap, domes tucked under the barrels' end arches; the concrete base
 * with its vertical ribs and window bands; the hotel's glass at the north.
 *
 * Evidence
 *  - OSM: outline way/7969701 (height 86, Q76318), and its parts, drawn at
 *    their OSM heights: base parts 32 m (way/1104121991, 1992, 1993, 1999,
 *    2000, 2003), hotel 53 m (1104121997), hotel wings 41 m (1996, 1998),
 *    north corner blocks 38 m (1995, 2005), south stair blocks 20 m (1988,
 *    1989, 1990), the dome part 86 m with roof:height 54 (1104122006, the
 *    roof's plan; so the springing at 32-33 m), the south walkway canopies
 *    building=roof (way/1103701207, 1103701208, drawn at 6.6-7.5 m,
 *    estimated). way/1104121994 and 1104122004 (no height, under the north
 *    cap) are replaced and covered by the roof and blocks.
 *  - Published: highest point 282 ft (86 m) above the field (mlb.com Blue
 *    Jays ballpark history); four roof panels, three moving and one fixed
 *    on the north end behind centre field (Wikipedia "Rogers Centre").
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - cn26: Chris Woodrich, "Rogers Centre from CN Tower, Toronto, Ontario,
 *      2026-06-28.jpg", CC BY-SA 4.0: the closed roof from above; panel
 *      joints read off it at y = -68, -1, +56 (of a 205 m circle).
 *      https://commons.wikimedia.org/wiki/File:Rogers_Centre_from_CN_Tower,_Toronto,_Ontario,_2026-06-28.jpg
 *    - closed: Taxiarchos228, "Rogers Centre closed.JPG", CC BY 3.0, from above.
 *      https://commons.wikimedia.org/wiki/File:Rogers_Centre_closed.JPG
 *    - openclosed: Rrburke and Taxiarchos228, "Rogers Centre open and
 *      closed.jpg", CC BY 3.0: the panels stacked over the north end.
 *      https://commons.wikimedia.org/wiki/File:Rogers_Centre_open_and_closed.jpg
 *    - cn1: Ken Lund, "Rogers Centre from CN Tower, Toronto, Ontario (29919996661).jpg", CC BY-SA 2.0.
 *      https://commons.wikimedia.org/wiki/File:Rogers_Centre_from_CN_Tower,_Toronto,_Ontario_(29919996661).jpg
 *    - ken2: Ken Lund, "Rogers Centre, Toronto, Canada (29889590712).jpg", CC BY-SA 2.0: the base facade, ribs and window bands.
 *      https://commons.wikimedia.org/wiki/File:Rogers_Centre,_Toronto,_Canada_(29889590712).jpg
 *    - sky12: booledozer, "SkyDome, 2012 12 10.jpg", CC BY-SA 2.0: a base corner, concrete colour.
 *      https://commons.wikimedia.org/wiki/File:SkyDome,_2012_12_10.jpg
 *    - hotel: Ken Lund, "Renaissance Toronto Hotel, Rogers Centre, Toronto, Ontario (29375328404).jpg", CC BY-SA 2.0: the hotel's glass.
 *      https://commons.wikimedia.org/wiki/File:Renaissance_Toronto_Hotel,_Rogers_Centre,_Toronto,_Ontario_(29375328404).jpg
 *    - baroi: Fabian Roudra Baroi, "Rogers Centre.jpg", CC BY-SA 4.0, from the south (waterfront): the barrel's end arch over the south cap.
 *      https://commons.wikimedia.org/wiki/File:Rogers_Centre.jpg
 *  No lidar or NAIP (Canada); no commercial imagery.
 *
 * Estimated / invented, and doubts:
 *  - The barrels' arc (a circular arc rising 53 m over the base's width),
 *    the crowns (86 and 83.5 m: the 2.5 m step is estimated), the caps'
 *    shape (lofted from 4 m under the barrels' end arches to the rim) and
 *    the north cap's rim rising to 55 m over the hotel are fitted by eye to
 *    cn26 and baroi. Which barrel rides higher is inferred from the panels
 *    stacking at the north end.
 *  - The base's ribs every ~9.5 m and the three window bands are a
 *    simplification of the facade in ken2/sky12; its glazed ground floor
 *    and upper openings are grouped bands, the projecting upper boxes and
 *    the "Audience" sculpture are left out. The hotel's outer face is glass
 *    from 4 m up (hotel); its windows over the field are drawn on the
 *    hotel blocks' south faces (hidden when the roof is closed).
 *  - Elevation 0: no published field depth found; Mapterhorn is flat round
 *    the site (Bremner Blvd and the north side within 1 m).
 *  - Not modelled: the CN Tower (its own landmark), the seats (hidden).
 *  - Night: the base ribs and the roof floodlit (`_FLOODLIGHT`), windows
 *    and hotel glass lit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { face, nrm3, vsub, vadd, vmul, vlerp } from './seoul-world-cup-stadium'
import { bar, writeLods, type XY } from './milan-san-siro'
import { triangulate } from './chi-aon-center'

const BEARING = 343

// OSM polygons in this frame (metres, x east', y north', origin at the
// centre of the roof's circle).
const OSM: Record<string, XY[]> = {
  'way/7969701': [[21.3,105.0],[12.0,106.5],[0.1,107.1],[-10.9,107.0],[-21.1,105.3],[-28.0,103.8],[-34.2,101.9],[-35.7,106.2],[-42.6,104.0],[-49.4,100.6],[-50.9,103.4],[-57.5,99.8],[-64.4,95.5],[-67.5,100.2],[-75.3,94.7],[-82.4,88.2],[-85.5,88.2],[-85.3,96.7],[-85.1,102.7],[-107.8,102.5],[-107.8,90.9],[-108.4,33.8],[-108.8,2.7],[-108.8,2.1],[-108.8,-7.0],[-108.6,-54.1],[-108.6,-58.9],[-98.5,-59.0],[-96.5,-62.9],[-86.5,-76.3],[-80.8,-71.1],[-72.7,-79.3],[-71.5,-80.5],[-60.2,-89.0],[-48.3,-96.0],[-35.6,-101.4],[-22.3,-105.2],[-23.5,-110.9],[-3.5,-113.2],[-0.8,-113.6],[20.2,-111.8],[18.8,-105.5],[32.3,-102.3],[45.3,-97.2],[57.2,-90.5],[68.5,-82.0],[77.6,-73.2],[84.5,-78.9],[93.9,-66.3],[95.8,-62.4],[107.4,-62.9],[107.5,-58.3],[108.8,-12.7],[108.9,-11.3],[106.4,-11.0],[106.7,-0.5],[109.0,92.8],[109.2,102.8],[96.8,103.0],[96.7,100.0],[85.7,100.1],[85.6,93.5],[85.6,87.8],[81.9,87.9],[78.6,91.0],[74.9,94.4],[71.1,97.2],[67.9,99.4],[64.8,94.6],[59.0,98.1],[51.4,102.2],[50.2,99.7],[44.1,102.4],[36.7,105.4],[35.1,101.1],[29.5,102.8]],
  'way/1104122006': [[106.7,-0.5],[101.2,-0.2],[101.5,47.3],[86.3,47.7],[80.6,47.9],[70.4,61.0],[62.1,69.6],[53.0,76.7],[42.6,82.9],[30.8,87.9],[18.7,91.4],[6.6,93.1],[-5.6,93.2],[-18.0,91.6],[-30.1,88.6],[-41.9,84.1],[-52.4,78.2],[-61.2,71.9],[-69.8,63.6],[-77.7,54.5],[-80.9,49.8],[-86.6,49.9],[-101.8,50.0],[-102.4,2.1],[-108.8,2.1],[-108.8,-7.0],[-108.6,-54.1],[-84.8,-54.5],[-75.4,-66.8],[-65.5,-76.3],[-57.0,-83.4],[-45.7,-90.1],[-33.4,-95.4],[-20.7,-98.7],[-7.9,-100.3],[4.8,-100.6],[17.7,-99.1],[30.3,-95.9],[42.5,-91.2],[53.6,-84.6],[64.0,-77.2],[73.1,-67.8],[82.5,-55.9],[105.3,-56.2],[106.2,-21.1],[106.4,-11.0]],
  'way/1104121997': [[-48.3,96.3],[-44.2,87.7],[-43.1,85.9],[-31.3,90.6],[-19.0,93.9],[-5.6,95.8],[6.5,95.7],[19.1,93.7],[31.8,90.0],[43.8,84.6],[44.8,86.4],[49.0,95.1],[40.9,98.9],[35.1,101.1],[29.5,102.8],[21.3,105.0],[12.0,106.5],[0.1,107.1],[-10.9,107.0],[-21.1,105.3],[-28.0,103.8],[-34.2,101.9],[-40.3,99.9]],
  'way/1104121996': [[35.1,101.1],[36.7,105.4],[44.1,102.4],[50.2,99.7],[57.0,95.9],[63.8,91.6],[55.8,80.4],[44.8,86.4],[49.0,95.1],[40.9,98.9]],
  'way/1104121998': [[-55.3,81.3],[-44.2,87.7],[-48.3,96.3],[-40.3,99.9],[-34.2,101.9],[-35.7,106.2],[-42.6,104.0],[-49.4,100.6],[-56.6,97.1],[-63.2,93.1]],
  'way/1104121995': [[50.2,99.7],[51.4,102.2],[59.0,98.1],[64.8,94.6],[72.1,89.0],[79.6,82.4],[85.5,76.3],[88.1,73.6],[94.1,65.7],[96.2,58.9],[89.4,56.0],[91.9,50.7],[86.3,47.7],[82.9,53.0],[75.4,63.2],[66.0,72.2],[55.8,80.4],[63.8,91.6],[57.0,95.9]],
  'way/1104122005': [[-86.6,49.9],[-92.1,52.9],[-89.3,58.0],[-96.4,61.4],[-94.0,68.4],[-85.1,78.5],[-76.4,86.9],[-64.4,95.5],[-57.5,99.8],[-50.9,103.4],[-49.4,100.6],[-56.6,97.1],[-63.2,93.1],[-55.3,81.3],[-65.9,73.5],[-75.3,64.4],[-83.4,54.4]],
  'way/1104121994': [[64.8,94.6],[67.9,99.4],[71.1,97.2],[74.9,94.4],[78.6,91.0],[81.9,87.9],[85.6,87.8],[101.8,87.5],[101.5,73.1],[96.2,73.1],[96.3,76.1],[85.5,76.3],[79.6,82.4],[72.1,89.0]],
  'way/1104122004': [[-85.1,78.5],[-95.9,78.6],[-96.0,75.3],[-101.3,75.4],[-101.0,88.6],[-85.5,88.2],[-82.4,88.2],[-75.3,94.7],[-67.5,100.2],[-64.4,95.5],[-76.4,86.9]],
  'way/1104121999': [[-86.6,49.9],[-80.9,49.8],[-77.7,54.5],[-69.8,63.6],[-61.2,71.9],[-52.4,78.2],[-41.9,84.1],[-30.1,88.6],[-18.0,91.6],[-5.6,93.2],[6.6,93.1],[18.7,91.4],[30.8,87.9],[42.6,82.9],[53.0,76.7],[62.1,69.6],[70.4,61.0],[80.6,47.9],[86.3,47.7],[82.9,53.0],[75.4,63.2],[66.0,72.2],[55.8,80.4],[44.8,86.4],[43.8,84.6],[31.8,90.0],[19.1,93.7],[6.5,95.7],[-5.6,95.8],[-19.0,93.9],[-31.3,90.6],[-43.1,85.9],[-44.2,87.7],[-55.3,81.3],[-65.9,73.5],[-75.3,64.4],[-83.4,54.4]],
  'way/1103701207': [[-23.5,-110.9],[-37.5,-107.0],[-51.0,-101.4],[-63.7,-94.0],[-75.3,-85.0],[-83.1,-77.2],[-88.1,-81.4],[-99.9,-66.0],[-101.8,-62.8],[-113.6,-62.6],[-112.9,-6.8],[-108.8,-7.0],[-108.6,-54.1],[-108.6,-58.9],[-98.5,-59.0],[-96.5,-62.9],[-86.5,-76.3],[-80.8,-71.1],[-72.7,-79.3],[-71.5,-80.5],[-60.2,-89.0],[-48.3,-96.0],[-35.6,-101.4],[-22.3,-105.2]],
  'way/1103701208': [[20.2,-111.8],[34.5,-108.1],[48.5,-102.4],[60.8,-95.4],[72.5,-86.7],[80.1,-79.3],[85.3,-83.5],[97.1,-68.5],[99.0,-65.4],[110.9,-65.6],[111.8,-12.8],[108.8,-12.7],[107.5,-58.3],[107.4,-62.9],[95.8,-62.4],[93.9,-66.3],[84.5,-78.9],[77.6,-73.2],[68.5,-82.0],[57.2,-90.5],[45.3,-97.2],[32.3,-102.3],[18.8,-105.5]],
  'way/1104121988': [[-89.7,-59.1],[-80.8,-71.1],[-86.5,-76.3],[-96.5,-62.9],[-98.5,-59.0]],
  'way/1104121989': [[95.8,-62.4],[85.8,-62.4],[77.6,-73.2],[84.5,-78.9],[93.9,-66.3]],
  'way/1104121990': [[-22.3,-105.2],[-8.8,-106.9],[5.3,-107.0],[18.8,-105.5],[20.2,-111.8],[-0.8,-113.6],[-3.5,-113.2],[-23.5,-110.9]],
  'way/1104121991': [[-108.6,-54.1],[-84.8,-54.5],[-75.4,-66.8],[-65.5,-76.3],[-57.0,-83.4],[-45.7,-90.1],[-33.4,-95.4],[-20.7,-98.7],[-7.9,-100.3],[4.8,-100.6],[17.7,-99.1],[30.3,-95.9],[42.5,-91.2],[53.6,-84.6],[64.0,-77.2],[73.1,-67.8],[82.5,-55.9],[105.3,-56.2],[106.2,-21.1],[106.4,-11.0],[108.9,-11.3],[108.8,-12.7],[107.5,-58.3],[107.4,-62.9],[95.8,-62.4],[85.8,-62.4],[77.6,-73.2],[68.5,-82.0],[57.2,-90.5],[45.3,-97.2],[32.3,-102.3],[18.8,-105.5],[5.3,-107.0],[-8.8,-106.9],[-22.3,-105.2],[-35.6,-101.4],[-48.3,-96.0],[-60.2,-89.0],[-71.5,-80.5],[-72.7,-79.3],[-80.8,-71.1],[-89.7,-59.1],[-98.5,-59.0],[-108.6,-58.9]],
  'way/1104121992': [[85.6,87.8],[85.6,93.5],[85.7,100.1],[96.7,100.0],[96.8,103.0],[109.2,102.8],[109.0,92.8],[106.7,-0.5],[101.2,-0.2],[101.5,47.3],[101.5,73.1],[101.8,87.5]],
  'way/1104121993': [[86.3,47.7],[101.5,47.3],[101.5,73.1],[96.2,73.1],[96.3,76.1],[85.5,76.3],[88.1,73.6],[94.1,65.7],[96.2,58.9],[89.4,56.0],[91.9,50.7]],
  'way/1104122000': [[-85.1,78.5],[-95.9,78.6],[-96.0,75.3],[-98.0,75.3],[-101.3,75.4],[-101.8,50.0],[-86.6,49.9],[-92.1,52.9],[-89.3,58.0],[-96.4,61.4],[-94.0,68.4]],
  'way/1104122003': [[-101.0,88.6],[-85.5,88.2],[-85.3,96.7],[-85.1,102.7],[-107.8,102.5],[-107.8,90.9],[-108.4,33.8],[-108.8,2.7],[-108.8,2.1],[-102.4,2.1],[-101.8,50.0],[-101.3,75.4]],
}

const RIM = 33 // the roof's springing, on the base's 32 m top
const BASE_H = 32
const J_S = -68, J_M = -1, J_N = 56 // panel joints along y (cn26)
const CROWN_S = 86, CROWN_N = 83.5 // the two sliding barrels (published 86 m top)

const ccw = (r: XY[]) => {
  let a = 0
  for (let i = 0; i < r.length; i++) { const [x0, y0] = r[i], [x1, y1] = r[(i + 1) % r.length]; a += x0 * y1 - x1 * y0 }
  return a < 0 ? [...r].reverse() : r
}
/** x-extent of a polygon along the line y = v (min, max). */
function xSpan(poly: XY[], v: number): [number, number] {
  let lo = Infinity, hi = -Infinity
  for (let i = 0; i < poly.length; i++) {
    const [x0, y0] = poly[i], [x1, y1] = poly[(i + 1) % poly.length]
    if ((y0 - v) * (y1 - v) > 0 || y0 === y1) continue
    const x = x0 + ((x1 - x0) * (v - y0)) / (y1 - y0)
    lo = Math.min(lo, x); hi = Math.max(hi, x)
  }
  return [lo, hi]
}
/** Resample a polyline to n points evenly by length. */
function resample(pl: XY[], n: number): XY[] {
  const L = [0]
  for (let i = 1; i < pl.length; i++) L.push(L[i - 1] + Math.hypot(pl[i][0] - pl[i - 1][0], pl[i][1] - pl[i - 1][1]))
  const out: XY[] = []
  for (let k = 0; k < n; k++) {
    const s = (L[L.length - 1] * k) / (n - 1)
    let i = 1
    while (i < L.length - 1 && L[i] < s) i++
    const t = (s - L[i - 1]) / (L[i] - L[i - 1] || 1)
    out.push([pl[i - 1][0] + (pl[i][0] - pl[i - 1][0]) * t, pl[i - 1][1] + (pl[i][1] - pl[i - 1][1]) * t])
  }
  return out
}
/** The part of a closed polygon's boundary beyond y = v (south when dir -1, north when +1), from west to east. */
function arcBeyond(poly: XY[], v: number, dir: number): XY[] {
  const r = ccw(poly), n = r.length, out: XY[] = []
  // walk the ring and keep the vertices beyond v, with the crossings
  const beyond = (p: XY) => (p[1] - v) * dir > 0
  let start = -1
  for (let i = 0; i < n; i++) if (!beyond(r[i]) && beyond(r[(i + 1) % n])) { start = i; break }
  for (let k = 0; k <= n; k++) {
    const a = r[(start + k) % n], b = r[(start + k + 1) % n]
    if (beyond(a)) out.push(a)
    if (beyond(a) !== beyond(b)) {
      const t = (v - a[1]) / (b[1] - a[1])
      out.push([a[0] + (b[0] - a[0]) * t, v])
      if (beyond(a)) break
    }
  }
  // counter-clockwise south runs west -> east already; north runs east -> west
  return dir > 0 ? out.reverse() : out
}

function build(detail: boolean) {
  const concrete = new Part(), cap = new Part(), barrel = new Part(), win = new Part(), glass = new Part(), deck = new Part()
  const outline = ccw(OSM['way/7969701'])
  const dome = ccw(OSM['way/1104122006'])

  // ---- the roof ---------------------------------------------------------
  const NT = detail ? 48 : 22
  const halfW = (v: number) => {
    const [a, b] = xSpan(outline, v)
    return [Math.max(a + 4, -104), Math.min(b - 4, 104)] as [number, number]
  }
  // barrel cross-section: a circular arc from the rim to the crown
  const prof = (x: number) => {
    const rho = 0.52, R = (1 + rho * rho) / (2 * rho)
    return (Math.sqrt(R * R - x * x) - (R - rho)) / rho
  }
  const barrelPts = (v: number, crown: number, xs: [number, number]) =>
    Array.from({ length: NT + 1 }, (_, k) => {
      const t = -1 + (2 * k) / NT
      const u = xs[0] + ((xs[1] - xs[0]) * (t + 1)) / 2
      return [u, v, RIM + (crown - RIM) * Math.max(0, prof(t))] as V3
    })
  const xsS = halfW(J_S), xsN = halfW(J_N)
  const xsB: [number, number] = [Math.max(xsS[0], xsN[0]), Math.min(xsS[1], xsN[1])]
  const BS0 = barrelPts(J_S, CROWN_S, xsB), BS1 = barrelPts(J_M, CROWN_S, xsB)
  const BN0 = barrelPts(J_M, CROWN_N, xsB), BN1 = barrelPts(J_N, CROWN_N, xsB)
  const smoothStrip = (p: Part, A: V3[], B: V3[], hintZ = 1) => {
    for (let k = 0; k < A.length - 1; k++) {
      const n0 = nrm3(vsub(A[k], [0, A[k][1], RIM - 120])), n1 = nrm3(vsub(A[k + 1], [0, A[k + 1][1], RIM - 120]))
      const nA: V3 = [n0[0], 0, n0[2] * hintZ], nB: V3 = [n1[0], 0, n1[2] * hintZ]
      p.tri(A[k], A[k + 1], B[k + 1], undefined, undefined, undefined, [nA, nB, nB])
      p.tri(A[k], B[k + 1], B[k], undefined, undefined, undefined, [nA, nB, nA])
    }
  }
  smoothStrip(barrel, BS0, BS1)
  smoothStrip(barrel, BN0, BN1)
  // the step where the south barrel rides over the north one
  for (let k = 0; k < NT; k++) face(barrel, [BN0[k], BN0[k + 1], BS1[k + 1], BS1[k]], [0, 1, 0])
  // the panels' ribs (detail): raised bands across the arcs every ~8 m
  if (detail) {
    for (const [v0, v1, crown] of [[J_S, J_M, CROWN_S], [J_M, J_N, CROWN_N]] as [number, number, number][]) {
      const n = Math.round((v1 - v0) / 8)
      for (let i = 1; i < n; i++) {
        const v = v0 + ((v1 - v0) * i) / n
        const pts = barrelPts(v, crown + 0.35, xsB)
        for (let k = 0; k < pts.length - 1; k++) bar(barrel, pts[k], pts[k + 1], 0.7, 0.6, [0, 1, 0], false)
      }
    }
  }
  // the caps: domes from just under the barrel's end arch down to the rim
  const capRim = (v: number) => (v <= J_N ? RIM : RIM + 22 * Math.pow(Math.min(1, (v - J_N) / 37), 1.3))
  const NS = detail ? 10 : 5
  const capOf = (J: V3[], dir: number) => {
    const xs = [J[0][0], J[J.length - 1][0]]
    const arc = arcBeyond(dome, J[0][1], dir)
    const pl: XY[] = [[xs[0], J[0][1]], ...arc, [xs[1], J[0][1]]]
    const R = resample(pl, J.length)
    const rows: V3[][] = []
    for (let s = 0; s <= NS; s++) {
      const f = s / NS
      rows.push(J.map((j, i) => {
        const p: XY = [j[0] + (R[i][0] - j[0]) * f, j[1] + (R[i][1] - j[1]) * f]
        const zr = capRim(R[i][1])
        const zt = j[2] - 4
        return [p[0], p[1], zr + (Math.max(zr, zt) - zr) * Math.pow(Math.cos((f * Math.PI) / 2), 0.85)] as V3
      }))
    }
    for (let s = 0; s < NS; s++)
      for (let k = 0; k < J.length - 1; k++) {
        const a = rows[s][k], b = rows[s][k + 1], c = rows[s + 1][k + 1], d = rows[s + 1][k]
        face(cap, [a, b, c], [0, dir * 0.4, 1])
        face(cap, [a, c, d], [0, dir * 0.4, 1])
      }
    // the barrel's end arch over the cap
    const top = rows[0]
    for (let k = 0; k < J.length - 1; k++) face(deck, [J[k], J[k + 1], top[k + 1], top[k]], [0, dir, 0])
  }
  capOf(BS0, -1)
  capOf(BN1, 1)

  // ---- the base: the concrete drum with its vertical ribs ----------------
  const n = outline.length
  // the deck between the base's edge and the roof's rim
  const rimR = ccw(dome)
  {
    // fan the annulus by angle: sample both rings along rays from the centre
    const angs = Array.from({ length: detail ? 180 : 96 }, (_, k) => (k / (detail ? 180 : 96)) * 2 * Math.PI)
    const hit = (poly: XY[], a: number) => {
      const dx = Math.cos(a), dy = Math.sin(a)
      let best = 0
      for (let i = 0; i < poly.length; i++) {
        const [x0, y0] = poly[i], [x1, y1] = poly[(i + 1) % poly.length]
        const ex = x1 - x0, ey = y1 - y0, den = dx * ey - dy * ex
        if (Math.abs(den) < 1e-9) continue
        const t = (x0 * ey - y0 * ex) / den, s = (x0 * dy - y0 * dx) / den
        if (t > 0 && s >= 0 && s <= 1) best = Math.max(best, t)
      }
      return best
    }
    for (let k = 0; k < angs.length; k++) {
      const a0 = angs[k], a1 = angs[(k + 1) % angs.length]
      const o0 = hit(outline, a0) - 0.5, o1 = hit(outline, a1) - 0.5, i0 = hit(rimR, a0), i1 = hit(rimR, a1)
      const P = (r: number, a: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]
      if (o0 > i0 + 0.5 || o1 > i1 + 0.5) face(deck, [P(i0, a0, BASE_H), P(o0, a0, BASE_H), P(o1, a1, BASE_H), P(i1, a1, BASE_H)], [0, 0, 1])
      // the roof's rim wall, from the deck up to the springing
      face(concrete, [P(i0, a0, BASE_H), P(i1, a1, BASE_H), P(i1, a1, RIM + 0.6), P(i0, a0, RIM + 0.6)], [Math.cos(a0), Math.sin(a0), 0])
    }
  }
  // walls, ribs and window bands
  const SPACING = detail ? 8.5 : 9.5
  const hotelFace = (mx: number, my: number, nx: number, ny: number) => my > 70 && ny > 0.55
  for (let i = 0; i < n; i++) {
    const a = outline[i], b = outline[(i + 1) % n]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 0.3) continue
    const tx = (b[0] - a[0]) / L, ty = (b[1] - a[1]) / L
    const nx = ty, ny = -tx // outward for a counter-clockwise ring
    const nn: V3 = [nx, ny, 0]
    face(concrete, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], BASE_H], [a[0], a[1], BASE_H]], nn)
    const hotel = hotelFace((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, nx, ny)
    const o = vmul(nn, 0.06)
    if (hotel) {
      if (L > 3) face(glass, [vadd([a[0] + tx, a[1] + ty, 4], o), vadd([b[0] - tx, b[1] - ty, 4], o), vadd([b[0] - tx, b[1] - ty, BASE_H - 1], o), vadd([a[0] + tx, a[1] + ty, BASE_H - 1], o)], nn)
      continue
    }
    const nb = Math.max(1, Math.round(L / SPACING))
    for (let k = 0; k <= nb; k++) {
      if (L < 4) break
      const f = k / nb
      const p: XY = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]
      if ((k === 0 || k === nb) && L < SPACING * 1.5) continue
      bar(concrete, [p[0] + nx * 0.7, p[1] + ny * 0.7, 0], [p[0] + nx * 0.7, p[1] + ny * 0.7, BASE_H], 1.8, 1.4, nn, true)
    }
    for (let k = 0; k < nb; k++) {
      const f0 = k / nb + 1.2 / L, f1 = (k + 1) / nb - 1.2 / L
      if (f1 <= f0) continue
      const P0: XY = [a[0] + (b[0] - a[0]) * f0, a[1] + (b[1] - a[1]) * f0], P1: XY = [a[0] + (b[0] - a[0]) * f1, a[1] + (b[1] - a[1]) * f1]
      for (const [z0, z1] of [[2.5, 9.5], [13, 19], [22.5, 28.5]] as [number, number][])
        face(win, [vadd([P0[0], P0[1], z0], o), vadd([P1[0], P1[1], z0], o), vadd([P1[0], P1[1], z1], o), vadd([P0[0], P0[1], z1], o)], nn)
    }
  }
  // the hotel and the outfield blocks over the north side (OSM heights)
  const prism = (poly: XY[], z0: number, z1: number, glassOut: boolean) => {
    const r = ccw(poly)
    for (const [i, j, k] of triangulate(r)) face(deck, [[...r[i], z1], [...r[j], z1], [...r[k], z1]] as V3[], [0, 0, 1])
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 0.2) continue
      const nn: V3 = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 0]
      face(concrete, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], nn)
      // glazing on the faces looking out (north) and, as the hotel rooms
      // do, down onto the field (south)
      if (glassOut && L > 4 && Math.abs(nn[1]) > 0.5) {
        const o = vmul(nn, 0.06), tx = (b[0] - a[0]) / L, ty = (b[1] - a[1]) / L
        face(glass, [vadd([a[0] + tx, a[1] + ty, z0 + 1], o), vadd([b[0] - tx, b[1] - ty, z0 + 1], o), vadd([b[0] - tx, b[1] - ty, z1 - 1.5], o), vadd([a[0] + tx, a[1] + ty, z1 - 1.5], o)], nn)
      }
    }
  }
  prism(OSM['way/1104121997'], BASE_H, 53, true)
  prism(OSM['way/1104121996'], BASE_H, 41, true)
  prism(OSM['way/1104121998'], BASE_H, 41, true)
  prism(OSM['way/1104121995'], BASE_H, 38, false)
  prism(OSM['way/1104122005'], BASE_H, 38, false)
  // the low parts at the south: stair blocks (20 m) and the walkway canopies
  for (const id of ['way/1104121988', 'way/1104121989', 'way/1104121990']) prism(OSM[id], 0, 20, false)
  for (const id of ['way/1103701207', 'way/1103701208']) {
    const r = ccw(OSM[id])
    for (const [i, j, k] of triangulate(r)) {
      face(deck, [[...r[i], 7.5], [...r[j], 7.5], [...r[k], 7.5]] as V3[], [0, 0, 1])
      face(concrete, [[...r[i], 6.6], [...r[j], 6.6], [...r[k], 6.6]] as V3[], [0, 0, -1])
    }
  }

  const lit = (p: V3, nr: V3) => (nr[2] > 0.3 ? 0.4 : 0.2)
  return [
    { part: concrete, material: { ...finish('rogers-concrete', 0xc4c1b9), floodlight: (_p: V3, nr: V3) => (nr[2] < 0.5 ? 0.55 : 0.2) } },
    { part: cap, material: { ...finish('rogers-roof', 0xe9ebeb), floodlight: lit } },
    { part: barrel, material: { ...finish('rogers-roof-panels', 0xd3d8db), floodlight: lit } },
    { part: win, material: { ...PALETTE.window, color: 0x5f7383 } },
    { part: glass, material: windowVariant(2, 0x7c95aa) },
    { part: deck, material: PALETTE.roof },
  ]
}

if (import.meta.main)
  await writeLods('Rogers Centre', { bearing: BEARING, elevation: 0, height: CROWN_S }, [
    { file: 'tor-rogers-centre.glb', parts: build(false), maxTris: 6500, maxBytes: 250_000 },
    { file: 'tor-rogers-centre.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1_500_000 },
  ])
