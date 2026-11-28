/**
 * Bloch Building, Nelson-Atkins Museum of Art, Kansas City, Missouri
 * (Steven Holl Architects, 2007) — original procedural geometry, CC0-1.0.
 * bun generators/kc-bloch-building.ts
 *
 * The east addition: five "lenses" of translucent channel glass stepping
 * down the slope east of the 1933 building, joined by galleries under the
 * grass. Only the lenses stand above ground; the gallery roofs between
 * them are lawn and sculpture garden, left to the map. The original
 * building is kc-nelson-atkins-museum.
 *
 * Map frame: x east, y north, z up, metres, true north (bearing 0).
 * Origin: the area centroid of the five lens outlines; z = 0 on the lowest
 * ground under them (the map's terrain at the west end of lens 4/5,
 * ≈272.0 m). Every lens's walls run down to z = 0 and sink into the hill,
 * as on the real site, where the lawn climbs their uphill sides.
 *
 * Identity, from the photos:
 *  1. five separate milky glass boxes in a line down the hill, the first
 *     (north) one long and tall beside the old building, the others lower
 *     and shorter as the ground falls (NAIP; Highsmith; Nightryder84);
 *  2. the channel glass: pale grey-green, frosted, read as a solid by day,
 *     with thin metal edges and horizontal reveal lines (Nightryder84's
 *     day photo; Highsmith);
 *  3. at night every lens glows white from inside (Dean Hochman's night
 *     photo; Highsmith's dusk photos);
 *  4. lens 1's clear-glazed lobby along its west side, on the north plaza
 *     by the reflecting pool (Hochman; Yungryan07).
 *
 * Night: the channel glass is not see-through, so it is not drawn as
 * translucent `glass` (which would also stay dark at night). It is the
 * whole identity of the building after dark that the lenses glow, so the
 * walls and roofs carry a `neon` material in their pale day colour: it
 * glows near-white at night, as in Hochman's photo. The lobby glazing is
 * `window` (warm glow).
 *
 * Evidence:
 *  - OSM: relation/15394221 (building multipolygon, the museum) has four
 *    of the lenses as outers: way/98665199 (lens 2), way/98665206 (lens 3),
 *    way/98665191 (lens 4), way/98665194 (lens 5); lens 1 is
 *    way/71551994 ("Spencer Art Reference Library", building=yes). The
 *    outlines are used as drawn.
 *  - Lidar, measured: USGS 3DEP MO_FEMANRCS_1_2020 (2020 flight), 1 m
 *    grids. Roofs (NAVD88): lens 1 294.8 m, lens 2 290.2, lens 3 284.6,
 *    lens 4 283.5, lens 5 283.1. North plaza beside lens 1: 282.5. Lens
 *    1's east edge from lidar agrees with OSM within 1–2 m.
 *  - Terrain: Mapterhorn z15 (bun tools/terrain.ts grid); its DEM keeps the
 *    gallery roofs as ground, so it stands 4–7 m above the real lawn
 *    east of lenses 3–5.
 *  - Estimated from photos: the reveal line about 5.5 m below each roof;
 *    lens 1's lobby glazing 4.2 m tall above the plaza; frame sizes.
 *  - Published: Bloch Building opened 2007, about 840 ft long (Wikipedia).
 *
 * Photos (evidence):
 *  - Bloch Building Nelson-Atkins Museum Kansas City.jpg, Carol M.
 *    Highsmith, public domain,
 *    https://commons.wikimedia.org/wiki/File:Bloch_Building_Nelson-Atkins_Museum_Kansas_City.jpg
 *  - Bloch Building, Nelson-Atkins Art Museum, Kansas City, Missouri
 *    LCCN2010630149.tif, Carol M. Highsmith, public domain,
 *    https://commons.wikimedia.org/wiki/File:Bloch_Building,_Nelson-Atkins_Art_Museum,_Kansas_City,_Missouri_LCCN2010630149.tif
 *  - Bloch rooz aftabi.JPG, Nightryder84, CC BY-SA 3.0,
 *    https://commons.wikimedia.org/wiki/File:Bloch_rooz_aftabi.JPG
 *  - Nelson-atkins museum of art (32068827280).jpg, Dean Hochman, CC BY 2.0,
 *    https://commons.wikimedia.org/wiki/File:Nelson-atkins_museum_of_art_(32068827280).jpg
 *  - Exterior of Nelson-Atkins Museum of Art.jpg, Yungryan07, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Exterior_of_Nelson-Atkins_Museum_of_Art.jpg
 *  - USGS NAIP orthophoto (public domain) for plan and roofs.
 *  No commercial imagery.
 * Doubts: the lens roofs are drawn flat at one height each (the real ones
 * step a little inside); lens 2's west end follows OSM's angled outline;
 * the east faces of lenses 3–5 stand above lower real ground than the
 * map's terrain shows.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const Z0 = 272.0                         // NAVD88 height of z = 0 (the map's lowest ground under the lenses)
type P2 = [number, number]
type Lens = { name: string; way: string; roof: number; poly: P2[] }
const LENSES: Lens[] = [
  { name: 'lens 1', way: 'way/71551994', roof: 294.8, poly: [[-5.33, 51.26], [4.49, 52.51], [1.75, 77.6], [1.32, 81.49], [4.0, 128.86], [-13.9, 129.8], [-16.14, 91.09], [-7.1, 62.53]] },
  { name: 'lens 2', way: 'way/98665199', roof: 290.2, poly: [[6.01, -1.56], [-6.95, -0.85], [-17.05, -6.57], [-19.48, -7.94], [-16.41, -17.61], [-4.46, -12.85], [9.49, -12.81], [12.45, -12.8], [10.34, -1.8]] },
  { name: 'lens 3', way: 'way/98665206', roof: 284.6, poly: [[6.05, -33.17], [-13.19, -37.62], [-13.23, -45.32], [-7.43, -45.07], [5.38, -44.52], [10.12, -43.28], [12.51, -41.32], [14.08, -36.0], [7.73, -29.71]] },
  { name: 'lens 4', way: 'way/98665191', roof: 283.5, poly: [[13.61, -67.86], [-6.27, -69.76], [-7.54, -70.1], [-12.79, -71.46], [-10.71, -81.56], [-6.65, -80.51], [-3.49, -80.4], [18.04, -79.59], [23.2, -75.16], [19.28, -65.17]] },
  { name: 'lens 5', way: 'way/98665194', roof: 283.1, poly: [[-15.35, -117.64], [11.51, -121.31], [28.39, -119.85], [29.71, -119.3], [31.91, -116.8], [30.8, -111.55], [27.81, -108.35], [25.7, -105.98], [24.76, -104.4], [10.04, -107.03], [-7.14, -105.24], [-13.42, -104.59]] },
]
const PLAZA = 282.5                       // the north plaza beside lens 1

const lens = new Part(), frame = new Part(), lobby = new Part()

const area = (p: P2[]) => p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
/** Ear-clipping triangulation of a simple counter-clockwise polygon. */
function triangulate(poly: P2[]): [P2, P2, P2][] {
  const idx = poly.map((_, i) => i), out: [P2, P2, P2][] = []
  const crossz = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: P2, a: P2, b: P2, c: P2) => crossz(a, b, p) > 0 && crossz(b, c, p) > 0 && crossz(c, a, p) > 0
  let guard = 0
  while (idx.length > 3 && guard++ < 1000) {
    for (let k = 0; k < idx.length; k++) {
      const a = poly[idx[(k + idx.length - 1) % idx.length]], b = poly[idx[k]], c = poly[idx[(k + 1) % idx.length]]
      if (crossz(a, b, c) <= 1e-9) continue
      if (idx.some((j) => { const p = poly[j]; return p !== a && p !== b && p !== c && inside(p, a, b, c) })) continue
      out.push([a, b, c]); idx.splice(k, 1); break
    }
  }
  out.push([poly[idx[0]], poly[idx[1]], poly[idx[2]]])
  return out
}
/** Offset a counter-clockwise polygon outward by d (mitred). */
function grow(poly: P2[], d: number): P2[] {
  const n = poly.length
  return poly.map((p, i) => {
    const a = poly[(i + n - 1) % n], b = poly[(i + 1) % n]
    const n1 = norm2([p[1] - a[1], a[0] - p[0]]), n2 = norm2([b[1] - p[1], p[0] - b[0]])
    const m = norm2([n1[0] + n2[0], n1[1] + n2[1]]), k = d / Math.max(0.3, m[0] * n1[0] + m[1] * n1[1])
    return [p[0] + m[0] * k, p[1] + m[1] * k]
  })
}
const norm2 = (v: P2): P2 => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
/** Walls of a ccw polygon between two heights (outward), with optional top and bottom. */
function prism(p: Part, poly: P2[], z0: number, z1: number, top: boolean, bottom = false) {
  p.loft([poly.map(([x, y]): V3 => [x, y, z0]), poly.map(([x, y]): V3 => [x, y, z1])])
  if (top) for (const [a, b, c] of triangulate(poly)) p.tri([a[0], a[1], z1], [b[0], b[1], z1], [c[0], c[1], z1])
  if (bottom) for (const [a, b, c] of triangulate(poly)) p.tri([a[0], a[1], z0], [c[0], c[1], z0], [b[0], b[1], z0])
}
/** A thin band around a ccw polygon, standing 0.1 m proud of its walls. */
function band(p: Part, poly: P2[], z0: number, z1: number, d = 0.12) {
  const g = grow(poly, d)
  prism(p, g, z0, z1, false, true)
  // top of the band: a ring between the wall and the grown outline
  for (let i = 0; i < poly.length; i++) {
    const j = (i + 1) % poly.length
    p.quad([poly[i][0], poly[i][1], z1], [g[i][0], g[i][1], z1], [g[j][0], g[j][1], z1], [poly[j][0], poly[j][1], z1])
  }
}

// --- the lenses --------------------------------------------------------------
for (const L of LENSES) {
  if (area(L.poly) <= 0) L.poly.reverse()
  const top = L.roof - Z0
  prism(lens, L.poly, 0, top, true)
  band(frame, L.poly, top - 0.35, top + 0.12)          // the metal coping
  // The reveal line, on the two tall lenses only: on lenses 3–5 it falls
  // inside the map's terrain, which keeps the gallery roofs as ground.
  if (L.roof > 288) band(frame, L.poly, top - 5.6, top - 5.35, 0.08)
  // Corner posts where the outline turns.
  const n = L.poly.length
  for (let i = 0; i < n; i++) {
    const a = L.poly[(i + n - 1) % n], p = L.poly[i], b = L.poly[(i + 1) % n]
    const u = norm2([p[0] - a[0], p[1] - a[1]]), v = norm2([b[0] - p[0], b[1] - p[1]])
    if (u[0] * v[0] + u[1] * v[1] > 0.9) continue
    const g = grow([a, p, b], 0.1)[1], s = 0.16
    prism(frame, [[g[0] - s, g[1] - s], [g[0] + s, g[1] - s], [g[0] + s, g[1] + s], [g[0] - s, g[1] + s]], 0, top - 0.3, false)
  }
}

// Lens 1's clear lobby glazing along its west side and north end, on the plaza.
{
  const P = LENSES[0].poly, z0 = PLAZA - Z0, z1 = z0 + 4.2
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length]
    const nx = b[1] - a[1], ny = a[0] - b[0]                // outward (right of a→b)
    if (!(nx < -0.3 * Math.hypot(nx, ny) || ny > 0.3 * Math.hypot(nx, ny))) continue // west- or north-facing
    if (Math.min(a[1], b[1]) < 60) continue
    const o = norm2([nx, ny]), d = 0.05
    const A: V3 = [a[0] + o[0] * d, a[1] + o[1] * d, z0], B: V3 = [b[0] + o[0] * d, b[1] + o[1] * d, z0]
    lobby.quad(A, B, [B[0], B[1], z1], [A[0], A[1], z1])
  }
}

// --- write ------------------------------------------------------------------
const parts: Array<{ part: Part; material: MaterialSpec }> = [
  // Pale grey-green frosted channel glass by day; glows near-white at night.
  { part: lens, material: finish('neon-channel-glass', 0xd5dedc, 0.5) },
  { part: frame, material: finish('lens-frame', 0xa9b0b2, 0.5) },
  { part: lobby, material: PALETTE.window },
]
const triangles = parts.reduce((a, { part }) => a + part.triangles, 0)
console.log(parts.map(({ part, material }) => `${material.name}: ${part.triangles}`).join(', '))
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const height = Math.max(...LENSES.map((l) => l.roof)) - Z0 + 0.12
const glb = writeGlb('Bloch Building', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height, bearing: 0,
})
await Bun.write(new URL('../models/kc-bloch-building.glb', import.meta.url), glb)
console.log(`kc-bloch-building.glb: ${triangles} triangles, ${glb.length} bytes`)
