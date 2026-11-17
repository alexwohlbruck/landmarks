/**
 * W Barcelona (Hotel Vela), Barcelona — original procedural geometry, CC0-1.0.
 * bun generators/barcelona-hotel-w.ts
 *
 * Map frame: +x east, +y north, z up, metres. BEARING 0. Origin = area
 * centroid of the OSM multipolygon relation/21282017 (lng 2.190056,
 * lat 41.368745), the hotel's whole outline: tower, glass block and podium.
 *
 * Evidence
 * - OSM relation/21282017 (outer way/908035013, two courtyard inners):
 *   building=hotel, height 98.8, 27 levels, architect Ricard Bofill,
 *   wikidata Q2648632 (checked: "W Barcelona", hotel in Barcelona,
 *   41.3686 2.1900, height 98.8). Inside it: the tower's building:part
 *   ways 1123149967–1123150013 (levels stepping down from 27 at the west
 *   end to 20 at the east end, and min_levels at the east tip where the sail
 *   curves under), relation/15019747 (the 7-level glass block west of the
 *   tower, with a courtyard), way/646553854 (6 levels, inside that block).
 *   The tower plan is traced from those parts: about 55 m east–west and 8 m
 *   wide at the blunt west end ("mast"), 22–24 m wide along the middle, with
 *   a straight south (sea) side and a gently convex north side.
 * - Published (Wikipedia ca/en): 99 m, 26 floors above the plaza, Ricardo
 *   Bofill, opened 2009, on the new breakwater at the end of Barceloneta.
 * - Mapterhorn terrain (`terrain.ts grid 2.190056 41.368745 60 15`): a
 *   plateau at about 9 m over the whole outline against 0–5 m outside. That
 *   plateau is the hotel's podium (the raised plaza with its steps, the pool
 *   deck), which the map takes out of the terrain; so the podium is modelled
 *   as a 9 m block over the outline, with its two courtyards open.
 * - Commons photos (all EVIDENCE):
 *   "Vela Hotel W Barcelona.jpg" (Bj.schoenmakers, CC BY-SA 3.0, broadside
 *   from the Barceloneta beach to the north-east: the sail profile);
 *   "W Barcelona 2013.jpg" (Felix König, CC BY 3.0, from across the harbour
 *   to the west, near level: the mast, the fins, the glass block);
 *   "Hotel vela W, Barcelona, Catalunya, España.jpg" (Iván Melenchón Serrano,
 *   CC0, from the plaza on the north: glass block, plaza steps, tip fins);
 *   "Hotel Vela (1).JPG" (Ardfern, CC BY-SA 3.0, distant from the beach);
 *   "W Barcelona (Hotel Vela) des del mar 01.jpg" (Jordiferrer, CC BY-SA
 *   4.0, from the sea).
 *
 * Sail profile (from the broadside photo): the roof line starts level at
 * the mast (98.8 m, the west end) and falls ever more steeply to the east
 * tip, where it meets the near-vertical east edge at about 60% of the height
 * (59 m), with three blade balconies just below. Fitted as
 * z = z_tip + (H − z_tip)·(1 − s^1.6)^0.6, s = 0 at the mast, 1 at the tip.
 * Two blade fins wrap the mast near the top (at 0.83 and 0.89 of the height,
 * counted on the Felix König photo).
 *
 * Estimated: the podium height (9 m, from the terrain plateau; it really
 * steps down to the beach in places), the glass block height (26 m, seven
 * storeys over the ground, from the plaza photo), the fin sizes. The tower
 * top is taken as 98.8 m above the lowest ground, not above the plaza.
 * The W logo on the mast is left out (a sign, not the landmark).
 *
 * Facade: mirrored blue glass, a light sky-blue `window` wall with pale
 * `trim` lines every three storeys (11 m); the glass block a paler green-blue
 * `window-2`. Night: rooms glow.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const BEARING = 0
const ANCHOR = { lng: 2.190056, lat: 41.368745 }
const H = 98.8
const ZTIP = 59
const PODIUM = 9
const BLOCK = 26

type P2 = [number, number]
const tower = new Part(), block = new Part(), podium = new Part(), trim = new Part(), roof = new Part()

// --- Polygon tools: area, ear clipping with holes, extrusion. ---
const area = (r: P2[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
const orient = (r: P2[], ccw: boolean) => ((area(r) > 0) === ccw ? r : [...r].reverse())
const crossP = (o: P2, a: P2, b: P2) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
function segX(a: P2, b: P2, c: P2, d: P2) {
  const d1 = crossP(c, d, a), d2 = crossP(c, d, b), d3 = crossP(a, b, c), d4 = crossP(a, b, d)
  return d1 * d2 < 0 && d3 * d4 < 0
}
/** Join holes into the outer ring with bridge edges, then ear-clip. */
function triangulate(outer: P2[], holes: P2[][] = []): P2[][] {
  let ring = orient(outer, true).slice()
  const all = [ring, ...holes]
  for (const h0 of holes) {
    const h = orient(h0, false)
    let best: [number, number, number] | null = null
    for (let i = 0; i < h.length; i++) for (let j = 0; j < ring.length; j++) {
      const a = h[i], b = ring[j]
      const d = Math.hypot(a[0] - b[0], a[1] - b[1])
      if (best && d >= best[2]) continue
      let ok = true
      for (const r of all.concat([h])) for (let k = 0; k < r.length && ok; k++) {
        const c = r[k], e = r[(k + 1) % r.length]
        if (c === a || e === a || c === b || e === b) continue
        if (segX(a, b, c, e)) ok = false
      }
      if (ok) best = [i, j, d]
    }
    if (!best) throw new Error('no bridge')
    const [i, j] = best
    const hr = [...h.slice(i), ...h.slice(0, i), h[i]]
    ring = [...ring.slice(0, j + 1), ...hr, ring[j], ...ring.slice(j + 1)]
  }
  const idx = ring.map((_, i) => i), tris: P2[][] = []
  const inTri = (p: P2, a: P2, b: P2, c: P2) => crossP(a, b, p) > 1e-9 && crossP(b, c, p) > 1e-9 && crossP(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const a = ring[idx[(k + idx.length - 1) % idx.length]], b = ring[idx[k]], c = ring[idx[(k + 1) % idx.length]]
      if (crossP(a, b, c) <= 1e-9) continue
      let empty = true
      for (const m of idx) {
        const p = ring[m]
        if (p === a || p === b || p === c) continue
        if ((p[0] === a[0] && p[1] === a[1]) || (p[0] === b[0] && p[1] === b[1]) || (p[0] === c[0] && p[1] === c[1])) continue
        if (inTri(p, a, b, c)) { empty = false; break }
      }
      if (!empty) continue
      tris.push([a, b, c]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) break
  }
  if (idx.length === 3) tris.push(idx.map((i) => ring[i]) as P2[])
  return tris
}
/** Split a ring's edges into pieces no longer than `max` m. */
function densify(r: P2[], max = 5): P2[] {
  const out: P2[] = []
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / max))
    for (let k = 0; k < n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n])
  }
  return out
}
function prism(wall: Part, top: Part, outer: P2[], holes: P2[][], z0: number, z1: number) {
  const rings = [orient(densify(outer), true), ...holes.map((h) => orient(densify(h), false))]
  for (const r of rings) for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    wall.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  for (const [a, b, c] of triangulate(outer, holes)) top.tri([a[0], a[1], z1], [b[0], b[1], z1], [c[0], c[1], z1])
}

// --- Podium: the raised plaza over the whole outline, courtyards open. ---
const OUTER: P2[] = [[63.1, 30.7], [38.3, 34.0], [38.4, 35.0], [38.2, 35.0], [38.4, 36.4], [11.2, 40.1], [11.0, 37.7], [-64.3, 47.7], [-62.1, 43.6], [-64.1, 42.6], [-39.3, -3.6], [-42.5, -28.3], [-44.5, -43.1], [-8.4, -47.7], [27.2, -52.3], [31.5, -42.7], [32.2, -42.6], [32.9, -42.4], [33.5, -42.3], [34.0, -42.2], [35.1, -42.0], [34.3, -36.8], [34.6, -36.2], [37.4, -36.5], [47.2, -16.1], [44.4, -15.7], [45.8, -12.7], [62.5, 23.0], [60.0, 24.1]]
const HOLES: P2[][] = [
  [[-50.8, 42.3], [-51.8, 35.2], [-33.8, 32.6], [-32.7, 39.7]],
  [[43.2, 14.5], [53.9, 13.0], [45.6, -3.7], [41.4, -3.3]],
]
prism(podium, roof, OUTER, HOLES, 0, PODIUM)

// --- The glass block west of the tower (relation/15019747), with its courtyard. ---
const BLOCK_RING: P2[] = [[-9.8, -37.6], [-10.3, -37.5], [-11.5, -36.9], [-13.8, -35.9], [-14.7, -35.5], [-16.5, -34.5], [-17.6, -33.8], [-19.0, -32.9], [-21.3, -31.0], [-19.9, -21.7], [-16.5, -20.4], [-13.1, -19.4], [-11.0, -19.0], [-7.1, -18.6], [-6.9, -17.0], [-4.2, -16.9], [-3.1, -8.3], [-39.2, -3.6], [-35.3, -10.9], [-38.8, -37.0], [-44.5, -43.1], [-8.4, -47.7], [-7.4, -40.2], [-10.1, -39.2]]
const BLOCK_HOLE: P2[] = [[-22.7, -34.3], [-22.0, -28.9], [-23.0, -28.7], [-22.3, -23.1], [-21.3, -23.2], [-20.6, -17.6], [-30.4, -16.3], [-31.6, -20.7], [-32.2, -24.8], [-32.5, -27.2], [-32.6, -29.6], [-32.6, -33.1]]
prism(block, roof, BLOCK_RING, [BLOCK_HOLE], PODIUM - 1, BLOCK)

// --- The sail. Plan as south and north edges over x; roof by the sail curve. ---
const SOUTH: P2[] = [[-21, -30.5], [-19, -32.9], [-16.5, -34.5], [-13.8, -35.9], [-10.3, -37.5], [-3.7, -39.8], [3.2, -41.6], [8.1, -42.5], [15.2, -43.3], [21.3, -43.4], [26.6, -43.1], [30.5, -42.8], [34, -41.2]]
const NORTH: P2[] = [[-21, -22.6], [-19.9, -21.7], [-16.6, -20.4], [-13.2, -19.4], [-10.1, -18.9], [-5.9, -18.5], [1.6, -18.3], [7.0, -18.6], [11.5, -19.2], [15.2, -19.8], [18.5, -20.6], [21.6, -21.3], [24.3, -22.2], [29.4, -24.0], [34, -26]]
const X0 = -21, X1 = 34
const edge = (pts: P2[], x: number) => {
  for (let i = 0; i < pts.length - 1; i++) if (x <= pts[i + 1][0]) {
    const t = (x - pts[i][0]) / (pts[i + 1][0] - pts[i][0])
    return pts[i][1] + t * (pts[i + 1][1] - pts[i][1])
  }
  return pts[pts.length - 1][1]
}
const topAt = (x: number) => {
  const s = Math.min(1, Math.max(0, (x - X0) / (X1 - X0)))
  return ZTIP + (H - ZTIP) * Math.pow(1 - Math.pow(s, 1.6), 0.6)
}
const XS: number[] = []
for (let x = X0; x < X1 - 0.01;) {
  XS.push(x)
  const s = (x - X0) / (X1 - X0)
  x += s > 0.85 ? 1.2 : s > 0.6 ? 2.2 : 3.5
}
XS.push(X1)
const sp = (x: number, z: number): V3 => [x, edge(SOUTH, x), z]
const np = (x: number, z: number): V3 => [x, edge(NORTH, x), z]
for (let i = 0; i < XS.length - 1; i++) {
  const a = XS[i], b = XS[i + 1], za = topAt(a), zb = topAt(b)
  // south wall (faces -y) and north wall (faces +y), counter-clockwise from outside
  tower.quad(sp(a, 0), sp(b, 0), sp(b, zb), sp(a, za))
  tower.quad(np(b, 0), np(a, 0), np(a, za), np(b, zb))
  // roof strip
  tower.quad(sp(a, za), sp(b, zb), np(b, zb), np(a, za))
  // pale rim along the roof edges, standing 0.6 m proud
  for (const [p, out] of [[sp, -1], [np, 1]] as [(x: number, z: number) => V3, number][]) {
    const A = p(a, za), B = p(b, zb)
    const lift = (v: V3, dz: number, dy: number): V3 => [v[0], v[1] + dy, v[2] + dz]
    if (out < 0) trim.quad(lift(A, -0.8, -0.25), lift(B, -0.8, -0.25), lift(B, 0.5, -0.25), lift(A, 0.5, -0.25))
    else trim.quad(lift(B, -0.8, 0.25), lift(A, -0.8, 0.25), lift(A, 0.5, 0.25), lift(B, 0.5, 0.25))
  }
}
// end walls: the mast (west) and the tip (east)
tower.quad(np(X0, 0), sp(X0, 0), sp(X0, topAt(X0)), np(X0, topAt(X0)))
tower.quad(sp(X1, 0), np(X1, 0), np(X1, topAt(X1)), sp(X1, topAt(X1)))

// Trim lines every three storeys on the walls, where the wall reaches.
const STOREY = H / 27
for (let z = PODIUM + 3 * STOREY; z < H - 4; z += 3 * STOREY) {
  const z0 = z - 0.3, z1 = z + 0.3
  const xs = XS.filter((x) => topAt(x) > z1 + 0.5)
  for (let i = 0; i < xs.length - 1; i++) {
    const a = xs[i], b = xs[i + 1]
    const S = (x: number, zz: number): V3 => [x, edge(SOUTH, x) - 0.15, zz], N = (x: number, zz: number): V3 => [x, edge(NORTH, x) + 0.15, zz]
    trim.quad(S(a, z0), S(b, z0), S(b, z1), S(a, z1))
    trim.quad(N(b, z0), N(a, z0), N(a, z1), N(b, z1))
  }
  if (topAt(X0) > z1) trim.quad([X0 - 0.15, edge(NORTH, X0), z0], [X0 - 0.15, edge(SOUTH, X0), z0], [X0 - 0.15, edge(SOUTH, X0), z1], [X0 - 0.15, edge(NORTH, X0), z1])
  if (topAt(X1) > z1) trim.quad([X1 + 0.15, edge(SOUTH, X1), z0], [X1 + 0.15, edge(NORTH, X1), z0], [X1 + 0.15, edge(NORTH, X1), z1], [X1 + 0.15, edge(SOUTH, X1), z1])
}

// --- Blade fins: pointed plates, 0.7 m thick. ---
function blade(pts: P2[], z: number, t = 0.7) {
  const r = orient(pts, true)
  const bot = r.map(([x, y]) => [x, y, z - t / 2] as V3), top = r.map(([x, y]) => [x, y, z + t / 2] as V3)
  trim.loft([bot, top])
  for (const [a, b, c] of triangulate(r)) {
    trim.tri([a[0], a[1], z + t / 2], [b[0], b[1], z + t / 2], [c[0], c[1], z + t / 2])
    trim.tri([a[0], a[1], z - t / 2], [c[0], c[1], z - t / 2], [b[0], b[1], z - t / 2])
  }
}
// at the tip: three blades reaching ~6 m east, just under the curve's end
for (const dz of [2.5, 5.5, 8.5]) {
  const yS = edge(SOUTH, X1), yN = edge(NORTH, X1)
  blade([[X1 - 1, yS + 1], [X1 + 6.5, (yS + yN) / 2 - 2], [X1 + 1.5, yN - 1], [X1 - 1, yN - 1]], ZTIP - dz)
}
// at the mast: two blades wrapping the west end near the top
for (const f of [0.83, 0.89]) {
  const yS = edge(SOUTH, X0), yN = edge(NORTH, X0)
  blade([[X0 + 2, yS - 2.5], [X0 - 2.5, yS + 0.5], [X0 - 2.5, yN - 0.5], [X0 + 2, yN + 2.5], [X0 + 4, yN - 0.5], [X0 + 4, yS + 0.5]], H * f, 1.0)
}

const parts = [
  { part: tower, material: { ...PALETTE.window, color: 0x86a3be } },
  { part: block, material: windowVariant(2, 0x9fbcc4) },
  { part: podium, material: PALETTE.stone },
  { part: roof, material: PALETTE.roof },
  { part: trim, material: PALETTE.trim },
]
const REPLACES = ['relation/21282017', 'way/908035013', 'relation/15019747', 'way/646553854', 'way/1123149966', 'way/1123149967', 'way/1123149968', 'way/1123149969', 'way/1123149970', 'way/1123149971', 'way/1123149972', 'way/1123149973', 'way/1123149974', 'way/1123149975', 'way/1123149976', 'way/1123149977', 'way/1123149978', 'way/1123149979', 'way/1123149980', 'way/1123149981', 'way/1123149982', 'way/1123149983', 'way/1123149984', 'way/1123149985', 'way/1123149986', 'way/1123149987', 'way/1123149988', 'way/1123149989', 'way/1123149990', 'way/1123149991', 'way/1123149992', 'way/1123149993', 'way/1123149994', 'way/1123149995', 'way/1123149996', 'way/1123149997', 'way/1123149998', 'way/1123149999', 'way/1123150000', 'way/1123150001', 'way/1123150002', 'way/1123150003', 'way/1123150004', 'way/1123150005', 'way/1123150006', 'way/1123150007', 'way/1123150008', 'way/1123150009', 'way/1123150010', 'way/1123150011', 'way/1123150012', 'way/1123150013']
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('W Barcelona', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: H,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: REPLACES,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/barcelona-hotel-w.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
