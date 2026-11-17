/**
 * The Ahwahnee, Yosemite Valley: procedural, CC0-1.0.
 * bun generators/yosemite-ahwahnee.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built from OSM's
 * outline about its area centroid. y = 0 is the ground; the valley floor
 * here is flat (tools/terrain.ts grid: within 2.4 m over 120 m), elevation 0.
 *
 * Opened 1927 (Gilbert Stanley Underwood). A rustic hotel of steel and
 * concrete stained to look like redwood, on a cross-shaped plan: a six-storey
 * centre, angled arms of three and four storeys, the Great Lounge block to
 * the south and the long Dining Room wing to the north-west; granite piers of
 * rough boulders rising through the walls as towers and chimneys, broad
 * eaves, slate-grey hip roofs (Wikipedia, "Ahwahnee Hotel"; NRHP).
 *
 * OSM: way/164025859 (one outline, 68 points, 4,400 m², building:levels 6).
 * Replaced. The building=roof way/1268301875 to the north (a covered
 * walkway, mostly outside the outline) is left to the map.
 * No USGS lidar covers the valley (tools/lidar.py find: none), so heights
 * are from photos and storey counts.
 *
 * Zones (the outline cut into wings, from the aerial view from Glacier Point,
 * "Ahwahnee-from-glacier-point.jpg", Eric Polk, CC BY-SA 3.0, and the
 * ground photos; storeys ~3.4 m):
 * - the centre, x -11..16, y -10..24: six storeys, eaves 22 m;
 * - the south wing, y -36..-10: five storeys, 18.5 m;
 * - the Great Lounge block at the south end, y < -36: 14 m, its south face
 *   of tall lounge windows between granite piers ("Ahwahnee Hotel
 *   (405515808).jpg", Bryce Edwards, CC BY 2.0);
 * - the west and east arms: three and four storeys, 11.5 and 14.5 m;
 * - the north (service) arm: four storeys, 14.5 m;
 * - the Dining Room wing (the north-west rectangle): one tall storey, 10 m
 *   to the eaves, a long gable roof ("Ahwahnee Hotel Half Dome.jpg", Mark
 *   James Miller, CC BY-SA 3.0).
 * Roofs: each wing's hip is raised over the convex hull of its piece of the
 * outline (the gable over its minimum rectangle), so the eaves bridge the
 * outline's small notches.
 * Estimated: every zone boundary and height, roof pitches (hips at ~30
 * degrees, up to 7.5 m high; the dining room's gable 5 m), the piers'
 * placement (at the zones' outer corners, and every ~11 m along the taller
 * wings' long faces, rising 3 m past the eaves as chimneys), window bays (2.4 m panels over two
 * storeys at a 4.2 m pitch).
 * Left out: the balconies and teal awnings, the porte-cochère, chimneys'
 * caps, the timber trusses of the dining room.
 *
 * Night: the windows glow; the walls are softly floodlit.
 *
 * Photos (Wikimedia Commons):
 * - "Ahwahnee-from-glacier-point.jpg", Eric Polk, CC BY-SA 3.0 (from above)
 * - "Ahwahnee Hotel Half Dome.jpg", Mark James Miller, CC BY-SA 3.0 (from the north-west)
 * - "Ahwahnee Hotel.jpg", Almonroth, CC BY-SA 3.0 (the south front)
 * - "Ahwahnee Hotel (405515808).jpg", Bryce Edwards, CC BY 2.0 (the lounge front)
 * - "Yosemite - Ahwahnee Hotel.jpg", Chris Dunstan, public domain
 */
import clipping from 'polygon-clipping'
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { earcut, offset, type XY } from './sf-de-young'

const OUTLINE: XY[] = [[20.1,28.9],[24.5,28.8],[27.2,28.8],[27.2,25.8],[29.3,25.8],[29.3,12.1],[29.5,11.9],[44.4,20.5],[47.1,15.8],[47.2,15.8],[48.8,16.6],[53.1,13.5],[53.2,7.5],[52.3,7.0],[53.8,4.5],[38.8,-4.2],[26.7,-11.3],[24.3,-7.2],[20.6,-9.3],[20.7,-36.3],[24.6,-36.3],[24.6,-48.9],[20.1,-48.9],[20.1,-48.2],[15.9,-48.2],[15.9,-48.9],[10.9,-48.9],[10.9,-50.7],[8.4,-54.7],[1.9,-54.7],[-0.5,-50.8],[-0.5,-48.7],[-4.8,-48.7],[-4.8,-48.4],[-9.0,-48.4],[-9.0,-48.9],[-13.9,-48.8],[-13.9,-44.2],[-13.3,-44.2],[-13.2,-40.9],[-14.0,-40.9],[-14.0,-36.0],[-9.9,-36.0],[-9.8,-13.4],[-9.5,-13.1],[-15.3,-9.9],[-15.8,-10.8],[-43.0,4.2],[-41.1,7.4],[-46.7,10.5],[-40.6,21.4],[-35.2,18.5],[-33.8,21.1],[-34.9,47.3],[-4.4,48.6],[-3.8,34.1],[-4.8,34.1],[-3.6,2.5],[-2.0,1.5],[-2.0,3.6],[8.6,3.6],[8.6,2.2],[12.8,2.2],[16.9,4.5],[17.2,23.1],[16.5,23.1],[16.6,29.0]] as XY[]
const area = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
const ccw = (r: XY[]) => (area(r) > 0 ? r : [...r].reverse())
const open = (r: XY[]) => (r.length > 1 && r[0][0] === r.at(-1)![0] && r[0][1] === r.at(-1)![1] ? r.slice(0, -1) : r)

const walls = new Part(), stone = new Part(), roof = new Part(), win = new Part()

type Zone = { name: string; ring: XY[]; eave: number; gable?: boolean }
const R = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const rotR = (cx: number, cy: number, len: number, wid: number, deg: number): XY[] => {
  const a = (deg * Math.PI) / 180, u: XY = [Math.cos(a), Math.sin(a)], v: XY = [-u[1], u[0]]
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([s, t]) => [cx + (u[0] * s * len) / 2 + (v[0] * t * wid) / 2, cy + (u[1] * s * len) / 2 + (v[1] * t * wid) / 2])
}
// The outline in its OSM coordinates is about this model's origin already.
const ZONES: Zone[] = [
  { name: 'dining', ring: R(-40, 21.5, 2, 52), eave: 10, gable: true },
  { name: 'centre', ring: R(-11, -10, 16, 24), eave: 22 },
  { name: 'north', ring: R(16, 8, 34, 32), eave: 14.5 },
  { name: 'south', ring: R(-16, -36, 30, -10), eave: 18.5 },
  { name: 'lounge', ring: R(-16, -60, 30, -36), eave: 14 },
  { name: 'west', ring: R(-60, -20, -11, 24), eave: 11.5 },
  { name: 'east', ring: R(16, -20, 60, 8), eave: 14.5 },
]

/** The zone's pieces: the outline cut to its rectangle, less every earlier zone. */
const taken: XY[][] = []
const pieces: Array<{ z: Zone; poly: XY[] }> = []
for (const z of ZONES) {
  let p = clipping.intersection([[OUTLINE]] as any, [[z.ring]] as any) as XY[][][]
  if (taken.length) p = clipping.difference(p as any, ...taken.map((t) => [[t]] as any)) as XY[][][]
  for (const poly of p) {
    const ring = ccw(open(poly[0]))
    if (Math.abs(area(ring)) > 8) pieces.push({ z, poly: ring })
  }
  taken.push(z.ring)
}

/** The deepest inset a convex-ish ring can take before folding (half its narrowest width). */
function maxInset(ring: XY[]) {
  const c: XY = [ring.reduce((s, p) => s + p[0], 0) / ring.length, ring.reduce((s, p) => s + p[1], 0) / ring.length]
  let m = Infinity
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 1e-6) continue
    m = Math.min(m, Math.abs((b[0] - a[0]) * (a[1] - c[1]) - (a[0] - c[0]) * (b[1] - a[1])) / L)
  }
  return m
}
function flatCap(p: Part, ring: XY[], z: number) {
  for (const [i, j, k] of earcut(ring)) p.tri([...ring[i], z], [...ring[j], z], [...ring[k], z])
}

/**
 * Drop jogs shorter than `min` and points where the ring runs straight on, so
 * a wing's roof follows its main walls rather than every notch in the outline.
 */
function simplify(r0: XY[], min = 2.5): XY[] {
  let r = r0
  for (let pass = 0; pass < 6; pass++) {
    const keep = r.filter((b, i) => {
      const a = r[(i + r.length - 1) % r.length], c = r[(i + 1) % r.length]
      const la = Math.hypot(b[0] - a[0], b[1] - a[1]), lc = Math.hypot(c[0] - b[0], c[1] - b[1])
      const cr = ((b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0])) / ((la * lc) || 1)
      return !(Math.abs(cr) < 0.17 || (la < min && lc < min * 4) )
    })
    if (keep.length === r.length || keep.length < 4) break
    r = keep
  }
  return ccw(r)
}
/** The deepest inset at which every edge keeps its direction (the roof hasn't folded). */
function safeInset(ring: XY[]) {
  const ok = (d: number) => {
    const t = offset(ring, -d)
    if (area(t) <= 0) return false
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length], A = t[i], B = t[(i + 1) % t.length]
      if ((b[0] - a[0]) * (B[0] - A[0]) + (b[1] - a[1]) * (B[1] - A[1]) <= 0) return false
    }
    return true
  }
  let d = 0
  for (let s = 0.25; s < 30; s += 0.25) { if (ok(s)) d = s; else break }
  return d
}

/** Convex hull (monotone chain), counter-clockwise. */
function hull(pts: XY[]): XY[] {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cr = (o: XY, a: XY, b: XY) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lo: XY[] = [], up: XY[] = []
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q) }
  for (const q of [...p].reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q) }
  return [...lo.slice(0, -1), ...up.slice(0, -1)]
}
/** The minimum-area rectangle round a convex ring (edges of the hull as candidate axes). */
function minRect(h: XY[]): XY[] {
  let best: XY[] = h, bestA = Infinity
  for (let i = 0; i < h.length; i++) {
    const a = h[i], b = h[(i + 1) % h.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 1e-6) continue
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], v: XY = [-u[1], u[0]]
    const us = h.map((p) => p[0] * u[0] + p[1] * u[1]), vs = h.map((p) => p[0] * v[0] + p[1] * v[1])
    const u0 = Math.min(...us), u1 = Math.max(...us), v0 = Math.min(...vs), v1 = Math.max(...vs)
    const A = (u1 - u0) * (v1 - v0)
    if (A < bestA) {
      bestA = A
      const P = (uu: number, vv: number): XY => [u[0] * uu + v[0] * vv, u[1] * uu + v[1] * vv]
      best = [P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)]
    }
  }
  return ccw(best)
}

for (const { z, poly } of pieces) {
  const ring = poly
  // Walls.
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    walls.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], z.eave], [a[0], a[1], z.eave])
    // Windows: two-storey panels between piers on every long face.
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 6) continue
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nrm: V3 = [u[1], -u[0], 0]
    const bays = Math.max(1, Math.floor((L - 2) / 4.2)), pitch = (L - 2) / bays
    const bands: Array<[number, number]> = z.name === 'dining' ? [[1.2, 8.4]] : z.name === 'lounge' ? [[1.0, 7.6], [9.2, 12.6]] : []
    if (!bands.length) for (let s = 3.6; s + 5.6 <= z.eave - 0.8; s += 6.8) bands.push([s, s + 5.4])
    for (let k = 0; k < bays; k++) {
      const m = 1 + (k + 0.5) * pitch, w = Math.min(2.4, pitch * 0.62)
      for (const [z0, z1] of bands) {
        const P = (d: number, zz: number): V3 => [a[0] + u[0] * (m + d) + nrm[0] * 0.05, a[1] + u[1] * (m + d) + nrm[1] * 0.05, zz]
        win.tri(P(-w / 2, z0), P(w / 2, z0), P(w / 2, z1), undefined, undefined, undefined, [nrm, nrm, nrm])
        win.tri(P(-w / 2, z0), P(w / 2, z1), P(-w / 2, z1), undefined, undefined, undefined, [nrm, nrm, nrm])
      }
    }
  }
  // Roof: broad eaves, then a hip (or the dining room's gable).
  // The roof sits on a simplified ring (the walls keep every OSM corner;
  // the eaves cover the small jogs).
  const rr = z.gable ? minRect(hull(ring)) : ccw(hull(simplify(ring)))
  const eaveRing = offset(rr, 0.9)
  flatCap(roof, ccw(ring), z.eave - 0.02) // a ceiling over the walls' full plan, under the eaves
  for (let i = 0; i < rr.length; i++) {
    const a = rr[i], b = rr[(i + 1) % rr.length], A = eaveRing[i], B = eaveRing[(i + 1) % rr.length]
    roof.quad([a[0], a[1], z.eave], [A[0], A[1], z.eave - 0.35], [B[0], B[1], z.eave - 0.35], [b[0], b[1], z.eave])
  }
  if (z.gable && rr.length === 4) {
    // Ridge along the long axis, between the short edges' midpoints.
    const e = [0, 1, 2, 3].map((i) => Math.hypot(rr[(i + 1) % 4][0] - rr[i][0], rr[(i + 1) % 4][1] - rr[i][1]))
    const s0 = e[0] < e[1] ? 0 : 1
    const mid = (i: number): XY => [(eaveRing[i][0] + eaveRing[(i + 1) % 4][0]) / 2, (eaveRing[i][1] + eaveRing[(i + 1) % 4][1]) / 2]
    const ridgeZ = z.eave + 5
    const M0: V3 = [...mid(s0), ridgeZ], M1: V3 = [...mid(s0 + 2), ridgeZ]
    const E = eaveRing.map((p) => [p[0], p[1], z.eave - 0.35] as V3)
    const i0 = s0, i1 = (s0 + 1) % 4, i2 = (s0 + 2) % 4, i3 = (s0 + 3) % 4
    roof.quad(E[i1], E[i2], M1, M0)          // long slope
    roof.quad(E[i3], E[i0], M0, M1)          // other long slope
    walls.tri(E[i0], E[i1], M0)              // gable ends
    walls.tri(E[i2], E[i3], M1)
  } else {
    // A real hip: inset as far as the plan allows, pitched ~30 degrees.
    // The hull is convex, so the hip's top is the hull shrunk to a quarter
    // about its centroid; its slopes then rise ~30 degrees from the eaves.
    const c: XY = [rr.reduce((t, p) => t + p[0], 0) / rr.length, rr.reduce((t, p) => t + p[1], 0) / rr.length]
    const d = maxInset(rr) * 0.75, rise = Math.min(7.5, d * 0.58)
    const top = rr.map((p) => [c[0] + (p[0] - c[0]) * 0.25, c[1] + (p[1] - c[1]) * 0.25] as XY)
    const E = eaveRing.map((p) => [p[0], p[1], z.eave - 0.35] as V3), T = top.map((p) => [p[0], p[1], z.eave + rise] as V3)
    for (let i = 0; i < rr.length; i++) roof.quad(E[i], E[(i + 1) % rr.length], T[(i + 1) % rr.length], T[i])
    flatCap(roof, top, z.eave + rise)
  }
  // Granite piers along the long faces of the taller wings, every ~11 m,
  // rising past the eaves as chimneys (the south front in particular reads
  // as a row of rough stone towers).
  if (z.eave >= 14) {
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 16) continue
      const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
      const k = Math.max(1, Math.round(L / 11) - 1)
      for (let j = 1; j <= k; j++) {
        const m = (L * j) / (k + 1), w = 1.6, h = z.eave + 3.2
        const P = (d: number, o: number): XY => [a[0] + u[0] * (m + d) + n[0] * o, a[1] + u[1] * (m + d) + n[1] * o]
        const q = ccw([P(-w, -1.2), P(w, -1.2), P(w, 1.0), P(-w, 1.0)])
        for (let t = 0; t < 4; t++) stone.quad([...q[t], 0], [...q[(t + 1) % 4], 0], [...q[(t + 1) % 4], h], [...q[t], h])
        stone.quad([...q[0], h], [...q[1], h], [...q[2], h], [...q[3], h])
      }
    }
  }
  // Granite piers at the outer corners of the taller wings.
  if (z.eave >= 14 || z.name === 'dining') {
    for (let i = 0; i < ring.length; i++) {
      const a = ring[(i + ring.length - 1) % ring.length], b = ring[i], c = ring[(i + 1) % ring.length]
      const turn = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0])
      const la = Math.hypot(b[0] - a[0], b[1] - a[1]), lc = Math.hypot(c[0] - b[0], c[1] - b[1])
      if (turn <= 0 || la < 5 || lc < 5) continue // convex corners on real walls only
      const s = 1.6, h = z.eave + (z.name === 'dining' ? 0.5 : 1.5)
      const ua: XY = [(b[0] - a[0]) / la, (b[1] - a[1]) / la], uc: XY = [(c[0] - b[0]) / lc, (c[1] - b[1]) / lc]
      const sq: XY[] = [
        [b[0] - ua[0] * s * 1.6 - uc[0] * 0.4 + ua[1] * 0.3, b[1] - ua[1] * s * 1.6 - uc[1] * 0.4 - ua[0] * 0.3],
        [b[0] + ua[0] * 0.6 - uc[0] * 0.4, b[1] + ua[1] * 0.6 - uc[1] * 0.4],
        [b[0] + ua[0] * 0.6 + uc[0] * s * 1.6, b[1] + ua[1] * 0.6 + uc[1] * s * 1.6],
        [b[0] - ua[0] * s * 1.6 + uc[0] * s * 1.6, b[1] - ua[1] * s * 1.6 + uc[1] * s * 1.6],
      ]
      const q = ccw(sq)
      for (let j = 0; j < 4; j++) stone.quad([...q[j], 0], [...q[(j + 1) % 4], 0], [...q[(j + 1) % 4], h], [...q[j], h])
      stone.quad([...q[0], h], [...q[1], h], [...q[2], h], [...q[3], h])
    }
  }
}

// ---------------------------------------------------------------- output ---
// Colours from daylight photos: the concrete stained redwood brown, pulled
// to the palette's lightness; the granite piers pale grey; slate-grey roofs.
const lit = (_p: V3, n: V3) => (n[2] > 0.8 ? 0.2 : 0.6)
const parts: Array<{ part: Part; material: MaterialSpec }> = [
  { part: walls, material: { ...finish('ahwahnee-redwood', 0xb48463), floodlight: lit } },
  { part: stone, material: { ...finish('ahwahnee-granite', 0xcfc8bb), floodlight: lit } },
  { part: roof, material: { ...PALETTE.roof, color: 0x8c9196 } },
  { part: win, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('The Ahwahnee', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: 0, elevation: 0, height: 25,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/yosemite-ahwahnee.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${pieces.length} pieces`)
