/**
 * Torre Mare Nostrum (Edifici Gas Natural), Barcelona — original procedural
 * geometry, CC0-1.0.
 * bun generators/barcelona-torre-mare-nostrum.ts
 *
 * Map frame: +x east, +y north, z up, metres. BEARING 0. Origin = area
 * centroid of the OSM multipolygon relation/21213758 (lng 2.190511,
 * lat 41.383180), both outer rings (the tower complex and the low south
 * wing).
 *
 * Evidence
 * - OSM relation/21213758 "Edifici Gas Natural": height 85, 20 levels,
 *   Enric Miralles and Benedetta Tagliabue, 2005–2008, mirror glass;
 *   wikidata Q5338037 (checked: "Edifici Gas Natural", office skyscraper in
 *   Barcelona, 41.3833 2.1905). Its building:parts, each drawn here from its
 *   own outline and heights:
 *   way/306118990 the towers (tagged height 60, 20 levels; split here into
 *   the tall east tower, 85 m, and the lower west wing with the curved
 *   south face, 50 m: see below);
 *   way/306118991 (0–41 m) and way/306118992 (24–41 m), the block and the
 *   bridge between the towers on the south;
 *   way/306118997 (0–15 m) and way/306118996 (15–30 m): the long block whose
 *   upper half runs on 24 m west past its base as the great horizontal
 *   cantilever;
 *   way/306119003 (0–30) and the strips 306118998, 306118999, 306119000,
 *   306119001, 306119002, 306119762 (30 m, undersides at 2.5, 5, 10, 15, 20,
 *   25 m): the north wing whose soffit rises westward;
 *   way/306118993 (3 levels), 306118994 (1 level), 306118995 (4 levels):
 *   the low angled wings to the south (drawn at 4 m a level).
 * - Published (Wikipedia ca/es/en): 86 m, 20 storeys.
 * - Commons photos (all EVIDENCE):
 *   "Edifici Gas Natural - P1100469.jpg" (Pere López Brosa, CC BY-SA 4.0,
 *   distant from Park Güell: the tall tower on the left, the step down
 *   to the lower west wing on its right at 0.56 of the height, and the long
 *   lower block beyond);
 *   "Edifici Gas Natural (1).jpg" (Grzegorz Gigol, CC BY-SA 4.0, from the
 *   north: the two towers and the glass bridge, 0.29–0.55 of the height);
 *   "Barcelona - Edifici Gas Natural (Torre Mare Nostrum) 01.jpg"
 *   (Zarateman, CC0) and "Edifici Gas Natural - Barcelona (Catalunya).jpg"
 *   (Puigalder, public domain): the cantilevered blocks and their pale
 *   soffits;
 *   "Barcelona - Edifici Gas Natural (Torre Mare Nostrum) 13.jpg"
 *   (Zarateman, CC0, from the north-east with Hotel Arts for scale).
 *
 * Heights: the east tower 85 m (relation height); the west wing 50 m,
 * estimated from the Park Güell photo (its step at about 0.56 of the tall
 * tower; renders with the tall part on the west did not match it: the step
 * came out on the wrong side). The rest are OSM part heights.
 *
 * Facade: dark bronze mirror glass (as in the Park Güell photo and the
 * close-ups), a bronze-grey `window` wall (#6f675c, lighter than the
 * charcoal floor #4a4f57) with pale `trim` lines
 * every three storeys (12.75 m) on the towers; the cantilevers' undersides
 * are the pale soffit panels (`trim`). The grey louvred aluminium strips on
 * the towers' narrow faces are not drawn. Night: offices glow.
 *
 * Doubts: the split of way/306118990 into two towers, the line between
 * them and which one is tall are read from photos, not mapped; the
 * close-up photo from the north ("Edifici Gas Natural (1)") shows open sky
 * under a glass bridge between two slabs that the model does not
 * reproduce (no mapped outline for that gap); the bridge's curved glass face is
 * drawn as OSM's straight-edged part.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE } from './palette'

const BEARING = 0
const ANCHOR = { lng: 2.190511, lat: 41.38318 }
type P2 = [number, number]
const glass = new Part(), trim = new Part(), roof = new Part(), low = new Part()

// --- Polygon tools (as in barcelona-hotel-w.ts). ---
const area = (r: P2[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
const orient = (r: P2[], ccw: boolean) => ((area(r) > 0) === ccw ? r : [...r].reverse())
const crossP = (o: P2, a: P2, b: P2) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
function triangulate(outer: P2[]): P2[][] {
  const ring = orient(outer, true)
  const idx = ring.map((_, i) => i), tris: P2[][] = []
  const inTri = (p: P2, a: P2, b: P2, c: P2) => crossP(a, b, p) > 1e-9 && crossP(b, c, p) > 1e-9 && crossP(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const a = ring[idx[(k + idx.length - 1) % idx.length]], b = ring[idx[k]], c = ring[idx[(k + 1) % idx.length]]
      if (crossP(a, b, c) <= 1e-9) continue
      if (idx.some((m) => { const p = ring[m]; return p !== a && p !== b && p !== c && inTri(p, a, b, c) })) continue
      tris.push([a, b, c]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) break
  }
  if (idx.length === 3) tris.push(idx.map((i) => ring[i]) as P2[])
  return tris
}
function densify(r: P2[], max = 5): P2[] {
  const out: P2[] = []
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / max))
    for (let k = 0; k < n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n])
  }
  return out
}
/** A vertical prism on outline r from z0 to z1: walls, roof, and (when lifted) a soffit. */
function prism(wall: Part, r0: P2[], z0: number, z1: number, soffit = trim) {
  const r = orient(z0 < 0.5 ? densify(r0) : r0, true)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    wall.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  for (const [a, b, c] of triangulate(r0)) {
    roof.tri([a[0], a[1], z1], [b[0], b[1], z1], [c[0], c[1], z1])
    if (z0 > 0.5) soffit.tri([a[0], a[1], z0], [c[0], c[1], z0], [b[0], b[1], z0])
  }
}
/** Outline pushed out by d along its mitred edge normals. */
function grow(r0: P2[], d: number): P2[] {
  const r = orient(r0, true), n = r.length
  return r.map((p, i) => {
    const a = r[(i + n - 1) % n], b = r[(i + 1) % n]
    const n1 = norm2([p[1] - a[1], -(p[0] - a[0])]), n2 = norm2([b[1] - p[1], -(b[0] - p[0])])
    const m = norm2([n1[0] + n2[0], n1[1] + n2[1]])
    const k = d / Math.max(0.4, m[0] * n1[0] + m[1] * n1[1])
    return [p[0] + m[0] * k, p[1] + m[1] * k] as P2
  })
}
const norm2 = (v: P2): P2 => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
/** Pale floor-line bands on a tower's walls. */
function bands(r0: P2[], top: number, step: number) {
  const g = grow(r0, 0.15)
  for (let z = step; z < top - 3; z += step) {
    for (let i = 0; i < g.length; i++) {
      const a = g[i], b = g[(i + 1) % g.length]
      trim.quad([a[0], a[1], z - 0.35], [b[0], b[1], z - 0.35], [b[0], b[1], z + 0.35], [a[0], a[1], z + 0.35])
    }
  }
}

// --- Towers (way/306118990, split in two). ---
const WEST: P2[] = [[-17.2, 35.4], [-15.2, 33.1], [-12.1, 30.9], [-9.8, 29.5], [-7.4, 29.0], [-4.2, 28.6], [-0.6, 28.4], [-0.1, 36.9], [-12.4, 57.2], [-25.8, 45.8]]
const EAST: P2[] = [[-0.6, 28.4], [3.1, 29.6], [18.2, 34.1], [17.8, 36.0], [18.7, 36.3], [16.9, 42.1], [-0.1, 36.9]]
const STOREY = 85 / 20
prism(glass, WEST, 0, 50)
prism(glass, EAST, 0, 85)
bands(WEST, 50, 3 * STOREY)
bands(EAST, 85, 3 * STOREY)

// --- The south block and the bridge (way/306118991, way/306118992). ---
prism(glass, [[-5.8, 21.8], [-3.9, 19.6], [-2.5, 18.1], [-0.2, 16.5], [2.4, 15.4], [4.8, 14.9], [7.9, 14.6], [10.7, 14.5], [13.8, 14.5], [16.8, 15.0], [24.4, 17.3], [22.7, 22.9], [21.0, 22.6], [20.8, 23.6], [13.8, 23.2]], 0, 41)
prism(glass, [[-0.6, 28.4], [-4.2, 28.6], [-7.4, 29.0], [-9.8, 29.5], [-12.1, 30.9], [-15.2, 33.1], [-11.1, 28.0], [-8.4, 24.8], [-5.8, 21.8], [13.8, 23.2], [10.7, 23.8], [7.9, 24.5], [5.7, 25.2], [4.8, 25.9], [3.6, 28.2], [3.1, 29.6]], 24, 41)

// --- The long block and its great cantilever (way/306118997, way/306118996). ---
prism(glass, [[-5.8, 21.8], [-14.9, 21.0], [-16.9, 20.8], [-17.5, 20.7], [-21.9, 19.9], [-33.1, 16.8], [-21.2, 7.5], [-19.7, 7.0], [-17.2, 6.1], [-14.8, 6.0], [-13.4, 5.9], [5.8, 11.7], [16.8, 15.0], [13.8, 14.5], [10.7, 14.5], [7.9, 14.6], [4.8, 14.9], [2.4, 15.4], [-0.2, 16.5], [-2.5, 18.1], [-3.9, 19.6]], 0, 15)
prism(glass, [[-5.8, 21.8], [-14.9, 21.0], [-16.9, 20.8], [-21.9, 19.9], [-33.1, 16.8], [-57.4, 10.1], [-54.7, 1.2], [-20.1, 4.3], [-13.4, 5.9], [5.8, 11.7], [7.9, 12.3], [16.8, 15.0], [13.8, 14.5], [10.7, 14.5], [7.9, 14.6], [4.8, 14.9], [2.4, 15.4], [-0.2, 16.5], [-2.5, 18.1], [-3.9, 19.6]], 15, 30)

// --- The north wing with its rising soffit (way/306119003 and the strips). ---
prism(glass, [[-20.9, 35.2], [-22.1, 28.5], [-11.1, 28.0], [-15.2, 33.1], [-17.2, 35.4]], 0, 30)
const STRIPS: [P2[], number][] = [
  [[[-24.4, 35.1], [-25.6, 28.7], [-22.1, 28.5], [-20.9, 35.2]], 2.5],
  [[[-28.1, 35.0], [-29.1, 28.8], [-25.6, 28.7], [-24.4, 35.1]], 5],
  [[[-31.6, 34.8], [-32.5, 29.0], [-29.1, 28.8], [-28.1, 35.0]], 10],
  [[[-35.1, 34.6], [-36.0, 29.1], [-32.5, 29.0], [-31.6, 34.8]], 15],
  [[[-38.8, 34.5], [-39.7, 29.3], [-36.0, 29.1], [-35.1, 34.6]], 20],
  [[[-38.8, 34.5], [-43.3, 34.3], [-44.2, 29.5], [-39.7, 29.3]], 25],
]
for (const [r, z0] of STRIPS) prism(glass, r, z0, 30)

// --- The low angled wings to the south (306118995, 306118993, 306118994). ---
prism(low, [[3.4, 7.0], [12.0, 9.6], [11.5, 11.8], [25.2, 14.3], [41.6, -38.3], [25.4, -43.0], [15.7, -11.3], [9.7, -13.1], [19.1, -45.0], [5.7, -49.0], [1.2, -42.1], [-2.8, -34.7], [-6.0, -28.8], [-7.3, -24.3], [-7.9, -20.9], [-8.0, -17.9], [-7.5, -13.2], [-7.2, -11.8], [-6.0, -8.2], [-4.3, -5.0]], 0, 16)
prism(low, [[-4.3, -5.0], [-6.0, -8.2], [-7.2, -11.8], [-7.5, -13.2], [-8.0, -17.9], [-7.9, -20.9], [-7.3, -24.3], [-6.0, -28.8], [-2.8, -34.7], [1.2, -42.1], [5.7, -49.0], [1.5, -50.2], [-9.5, -22.5], [-9.8, -20.2], [-9.8, -18.6], [-9.3, -15.6], [-8.3, -12.7], [-7.5, -10.1], [-6.0, -7.1]], 0, 12)
prism(low, [[-7.5, -10.1], [-8.3, -12.7], [-9.3, -15.6], [-9.8, -18.6], [-9.8, -20.2], [-9.5, -22.5], [1.5, -50.2], [-2.7, -51.5], [-11.4, -30.0], [-13.6, -24.4], [-14.7, -20.7], [-14.9, -17.0], [-14.6, -13.8], [-13.7, -10.8], [-12.6, -7.9], [-10.7, -5.2], [5.8, 11.7], [3.4, 7.0], [-4.3, -5.0], [-6.0, -7.1]], 0, 4)

const parts = [
  { part: glass, material: { ...PALETTE.window, color: 0x6f675c } },
  { part: low, material: { name: 'window-2', color: 0x74706a, roughness: 0.35 } },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Torre Mare Nostrum', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 85,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: REPLACES(),
})
function REPLACES() {
  return ['relation/21213758', ...[306118990, 306118991, 306118992, 306118993, 306118994, 306118995, 306118996, 306118997, 306118998, 306118999, 306119000, 306119001, 306119002, 306119003, 306119762].map((i) => `way/${i}`)]
}
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/barcelona-torre-mare-nostrum.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
