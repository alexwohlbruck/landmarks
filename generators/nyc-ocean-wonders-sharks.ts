/**
 * Ocean Wonders: Sharks!, New York Aquarium, Coney Island: procedural, CC0-1.0.
 * bun generators/nyc-ocean-wonders-sharks.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * area centroid of the OSM outline way/604729335 (building=yes,
 * tourism=aquarium, "Ocean Wonders: Sharks!"), -73.9739821 40.574026, on
 * the aquarium grounds just north of the Riegelmann Boardwalk. y = 0 is
 * the lowest ground under the footprint; elevation 0.
 *
 * The building. The New York Aquarium's shark exhibit (Wikipedia, "New
 * York Aquarium": 57,000 sq ft, broke ground January 2014, opened 30 June
 * 2018) is a long, boat-shaped hall on the boardwalk, clad all round in
 * silver aluminium panels set at slightly different angles, so the facade
 * shimmers like water or a shark's skin. Seen from the beach it reads as:
 *   1. a long low silver body, rounded at both ends, hugging the boardwalk;
 *   2. a faceted silver ribbon wall along the south face that sweeps up
 *      from west to east and wraps the east end like a ship's prow;
 *   3. two flared silver drums standing on the roof, the eastern one larger
 *      and higher, with a skylight;
 *   4. a small deep-blue drum at the west end;
 *   5. a dark recessed ground floor under the ribbon.
 *
 * Numbers:
 *   footprint: the OSM outline, used as drawn. NAIP (USGS) shows the
 *     building about 5 m further east than OSM; the features below are read
 *     off NAIP and moved 5 m west to sit in the OSM outline.
 *   drum centres and radii: measured, NAIP. West drum (3, -3), r 9 at the
 *     roof flaring to 10.5; east drum (31, 3), r 10 flaring to 11.5; blue
 *     drum: NAIP shows its ring at about (-33, 8), r 5; drawn at (-36, 6.5),
 *     r 5.3, so it stands at the west tip as the photo shows and stays inside
 *     the outline. The photo widths (21 m and 23 m, scaled from the
 *     building's 81 m length) agree.
 *   heights: estimated from "New York Aquarium Ocean Wonders shark pavilion
 *     facade" (taken 690 m due south, so nearly square-on), scaled by the
 *     building's OSM length (0.096 m per pixel at full size), measured from
 *     the boardwalk deck, plus 2.3 m for the boardwalk's height over the
 *     aquarium grounds (Mapterhorn terrain, tools/terrain.ts grid):
 *       body roof 11 m; ribbon 5.2 m at its foot, top rising 8 m (west) to
 *       14.5 m (east); west drum 15.6 m; east drum 18.5 m; blue drum 12.3 m;
 *       dark ground floor 5.2 m.
 *   The USGS NY_NewYorkCity lidar (2017) predates the building (the site
 *     shows as a construction pad), so it gives no heights.
 *   panel facets: invented, as a few bold tilts standing in for the real
 *     ~33,000 panels; they make the silver catch the light unevenly at
 *     map distance.
 *   north and west faces: no licensed photo shows them. They are drawn as
 *     plain silver walls over the dark ground floor, which is a guess.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *   "New York Aquarium Ocean Wonders shark pavilion facade", Oleg Yunakov,
 *     CC BY-SA 4.0 (from the south, at sea)
 *     https://commons.wikimedia.org/wiki/File:New_York_Aquarium_Ocean_Wonders_shark_pavilion_facade.jpg
 *   "New York Aquarium Ocean Wonders", Oleg Yunakov, CC BY-SA 4.0 (from the
 *     south-south-west, at sea)
 *     https://commons.wikimedia.org/wiki/File:New_York_Aquarium_Ocean_Wonders.jpg
 *   "New York Aquarium Aquatheater dome", Oleg Yunakov, CC BY-SA 4.0 (from
 *     the south; the building is in the middle)
 *     https://commons.wikimedia.org/wiki/File:New_York_Aquarium_Aquatheater_dome.jpg
 * Aerial: USGS NAIP orthophoto (public domain), via tools/usgs.py naip.
 * OSM: way/604729335 (ODbL).
 * No look-only sources were used.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

// OSM way/604729335 about its area centroid, metres east/north.
const OUTLINE: XY[] = [
  [-27.3, 15.3], [-22.4, 15.7], [-20.5, 10.5], [-13.2, 13.5], [-1.8, 15.9], [13.6, 17.4],
  [24.9, 17.5], [34.2, 12.9], [39.7, 6.6], [40.0, 0.3], [36.8, -9.4], [31.3, -12.3],
  [23.8, -15.8], [11.2, -18.3], [-0.8, -18.3], [-10.9, -17.6], [-19.3, -15.0], [-27.7, -15.8],
  [-32.5, -18.2], [-35.3, -0.7], [-38.1, 1.1], [-40.3, 4.4], [-41.1, 5.7], [-41.5, 12.6],
  [-37.8, 15.6], [-34.4, 17.1], [-30.3, 17.3],
]

const BODY = 11
const PLINTH = 5.2

const signedArea = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
const ccw = (r: XY[]) => (signedArea(r) < 0 ? [...r].reverse() : r)

/** Ear clipping for a simple counter-clockwise ring. */
function triangulate(r: XY[]): [number, number, number][] {
  const idx = r.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 20000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i - 1 + idx.length) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      if (cr(r[ia], r[ib], r[ic]) <= 1e-9) continue
      if (idx.some(j => j !== ia && j !== ib && j !== ic && inside(r[j], r[ia], r[ib], r[ic]))) continue
      out.push([ia, ib, ic]); idx.splice(i, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

function walls(p: Part, r: XY[], z0: number, z1: number) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}
function cap(p: Part, r: XY[], z: number, up = true) {
  for (const [a, b, c] of triangulate(r)) {
    const A: V3 = [r[a][0], r[a][1], z], B: V3 = [r[b][0], r[b][1], z], C: V3 = [r[c][0], r[c][1], z]
    if (up) p.tri(A, B, C); else p.tri(A, C, B)
  }
}
/** Offset a counter-clockwise ring outwards by d (mitred). */
function outset(r: XY[], d: number): XY[] {
  const n = r.length
  const nrm = (a: XY, b: XY): XY => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l] }
  return r.map((c, i) => {
    const n1 = nrm(r[(i - 1 + n) % n], c), n2 = nrm(c, r[(i + 1) % n])
    const k = 1 + n1[0] * n2[0] + n1[1] * n2[1]
    return [c[0] + (n1[0] + n2[0]) / Math.max(k, 0.2) * d, c[1] + (n1[1] + n2[1]) / Math.max(k, 0.2) * d] as XY
  })
}
/** Resample an open polyline into n equal steps (n + 1 points). */
function resample(pl: XY[], n: number): XY[] {
  const seg = pl.slice(1).map((b, i) => Math.hypot(b[0] - pl[i][0], b[1] - pl[i][1]))
  const total = seg.reduce((s, l) => s + l, 0)
  const out: XY[] = []
  for (let k = 0; k <= n; k++) {
    let t = (total * k) / n, i = 0
    while (i < seg.length - 1 && t > seg[i]) { t -= seg[i]; i++ }
    const f = Math.min(1, t / seg[i])
    out.push([pl[i][0] + (pl[i + 1][0] - pl[i][0]) * f, pl[i][1] + (pl[i + 1][1] - pl[i][1]) * f])
  }
  return out
}

const silver = new Part(), base = new Part(), roof = new Part(), blue = new Part(), win = new Part(), glass = new Part()
const ring = ccw(OUTLINE)

// 1. The body: dark recessed ground floor, then walls in the roof grey, a
// shade darker than the silver ribbon in front of them so the ribbon's
// sweep reads (the photo shows the body behind it greyer and flatter).
const plinthRing = outset(ring, -0.6)
walls(base, plinthRing, 0, PLINTH)
cap(base, plinthRing, 0, false)
walls(roof, ring, PLINTH, BODY - 0.5)
// Bevelled roof edge.
const edge = outset(ring, -0.5)
for (let i = 0; i < ring.length; i++) {
  const j = (i + 1) % ring.length
  roof.quad([ring[i][0], ring[i][1], BODY - 0.5], [ring[j][0], ring[j][1], BODY - 0.5], [edge[j][0], edge[j][1], BODY], [edge[i][0], edge[i][1], BODY])
}
// The underside of the overhang over the recessed ground floor.
for (let i = 0; i < ring.length; i++) {
  const j = (i + 1) % ring.length
  base.quad([ring[j][0], ring[j][1], PLINTH], [ring[i][0], ring[i][1], PLINTH], [plinthRing[i][0], plinthRing[i][1], PLINTH], [plinthRing[j][0], plinthRing[j][1], PLINTH])
}
cap(roof, edge, BODY)

// 2. The faceted ribbon: the south face and the east prow, sweeping up eastward.
const RIBBON_PATH: XY[] = [
  [-27.7, -15.8], [-19.3, -15.0], [-10.9, -17.6], [-0.8, -18.3], [11.2, -18.3], [23.8, -15.8],
  [31.3, -12.3], [36.8, -9.4], [40.0, 0.3], [39.7, 6.6], [34.2, 12.9], [24.9, 17.5],
]
{
  const N = 20
  const pts = resample(RIBBON_PATH, N)
  // Outward normals (the path runs counter-clockwise, so outward is to the right).
  const out = pts.map((p, k) => {
    const a = pts[Math.max(0, k - 1)], b = pts[Math.min(N, k + 1)]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1])
    return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l] as XY
  })
  const top = (k: number) => {
    const t = k / N
    const rise = Math.min(1, t / 0.68) // reaches full height at the east corner
    return 8 + (14.5 - 8) * (rise * rise * (3 - 2 * rise))
  }
  const mid = (k: number) => (PLINTH + top(k)) / 2
  // Each panel column has two facets; the lean alternates column by column
  // and row by row, so neighbouring facets face slightly different ways.
  const P = (k: number, z: number, d: number): V3 => [pts[k][0] + out[k][0] * d, pts[k][1] + out[k][1] * d, z]
  for (let k = 0; k < N; k++) {
    const s = k % 2 === 0 ? 1 : -1
    const d0 = 0.35, dm0 = 0.35 + 0.25 * s, dm1 = 0.35 - 0.25 * s
    const zm0 = mid(k), zm1 = mid(k + 1)
    silver.quad(P(k, PLINTH, d0), P(k + 1, PLINTH, d0), P(k + 1, zm1, dm1), P(k, zm0, dm0))
    silver.quad(P(k, zm0, dm0), P(k + 1, zm1, dm1), P(k + 1, top(k + 1), d0), P(k, top(k), d0))
    // Ribbon top: a cap back to the body (or, above the roof, a thin coping).
    const t0 = top(k), t1 = top(k + 1)
    const back = 0.9
    silver.quad(P(k, t0, d0), P(k + 1, t1, d0), P(k + 1, t1, d0 - back), P(k, t0, d0 - back))
    if (t0 > BODY || t1 > BODY) {
      // Inner face of the parapet the ribbon makes above the roof.
      silver.quad(P(k + 1, BODY, d0 - back), P(k, BODY, d0 - back), P(k, Math.max(t0, BODY), d0 - back), P(k + 1, Math.max(t1, BODY), d0 - back))
    }
    // Underside of the ribbon over the recessed floor.
    base.quad(P(k + 1, PLINTH, d0), P(k, PLINTH, d0), P(k, PLINTH, -0.6), P(k + 1, PLINTH, -0.6))
  }
  // Glazing in the ribbon below the east drum (photo: a row of windows
  // under the drum's flare, about 9 to 12 m up).
  for (let k = 10; k < 13; k++) {
    const q = (kk: number, z: number): V3 => P(kk, z, 0.35 + 0.27)
    const a = q(k, 9), b = q(k + 1, 9), c = q(k + 1, 12), d = q(k, 12)
    const inset = (u: V3, v: V3): [V3, V3] => [[u[0] + (v[0] - u[0]) * 0.08, u[1] + (v[1] - u[1]) * 0.08, u[2]], [v[0] + (u[0] - v[0]) * 0.08, v[1] + (u[1] - v[1]) * 0.08, v[2]]]
    const [a2, b2] = inset(a, b), [d2, c2] = inset(d, c)
    win.quad(a2, b2, c2, d2)
  }
  // Close the west end of the ribbon.
  silver.quad(P(0, PLINTH, -0.6), P(0, PLINTH, 0.35), P(0, top(0), 0.35), P(0, top(0), -0.6))
  silver.quad(P(N, PLINTH, 0.35), P(N, PLINTH, -0.6), P(N, top(N), -0.6), P(N, top(N), 0.35))
}

// 3. The two flared drums on the roof, faceted.
function drum(cx: number, cy: number, r0: number, r1: number, z0: number, z1: number, skylight?: [number, number]) {
  const N = 16
  const at = (i: number, r: number, z: number): V3 => {
    const a = (i / N) * Math.PI * 2
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r, z]
  }
  const zm = (z0 + z1) / 2
  for (let i = 0; i < N; i++) {
    const s = i % 2 === 0 ? 1 : -1
    const rm0 = (r0 + r1) / 2 + 0.4 * s, rm1 = (r0 + r1) / 2 - 0.4 * s
    silver.quad(at(i, r0, z0), at(i + 1, r0, z0), at(i + 1, rm1, zm), at(i, rm0, zm))
    silver.quad(at(i, rm0, zm), at(i + 1, rm1, zm), at(i + 1, r1, z1), at(i, r1, z1))
    // Rim, inner parapet face and the deck inside.
    const ri = r1 - 0.7, deck = z1 - 1.3
    silver.quad(at(i, r1, z1), at(i + 1, r1, z1), at(i + 1, ri, z1), at(i, ri, z1))
    silver.quad(at(i + 1, ri, z1), at(i + 1, ri, deck), at(i, ri, deck), at(i, ri, z1))
    roof.tri([cx, cy, deck], at(i, ri, deck), at(i + 1, ri, deck))
  }
  if (skylight) {
    const [w, h] = skylight, z = z1 - 1.25
    glass.quad([cx - w / 2, cy - h / 2, z], [cx + w / 2, cy - h / 2, z], [cx + w / 2, cy + h / 2, z], [cx - w / 2, cy + h / 2, z])
  }
}
drum(3, -3, 9, 10.5, BODY, 15.6)
drum(31, 3, 10, 11.5, BODY, 18.5, [6, 9])

// 4. The blue drum at the west end, from the ground up, with a pale disc on top.
{
  const N = 14, cx = -36, cy = 6.5, r = 5.3, z1 = 12.3
  const at = (i: number, rr: number, z: number): V3 => {
    const a = (i / N) * Math.PI * 2
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, z]
  }
  for (let i = 0; i < N; i++) {
    blue.quad(at(i, r, 0), at(i + 1, r, 0), at(i + 1, r, z1 - 0.3), at(i, r, z1 - 0.3))
    blue.quad(at(i, r, z1 - 0.3), at(i + 1, r, z1 - 0.3), at(i + 1, r - 0.3, z1), at(i, r - 0.3, z1))
    blue.quad(at(i, r - 0.3, z1), at(i + 1, r - 0.3, z1), at(i + 1, 3.2, z1), at(i, 3.2, z1))
    roof.tri([cx, cy, z1 - 0.2], at(i, 3.2, z1 - 0.2), at(i + 1, 3.2, z1 - 0.2))
    blue.quad(at(i + 1, 3.2, z1), at(i + 1, 3.2, z1 - 0.2), at(i, 3.2, z1 - 0.2), at(i, 3.2, z1))
  }
}

const parts = [
  { part: silver, material: finish('ow-silver', 0xc3c9ce, 0.45) },
  { part: base, material: finish('ow-base', 0x80878e) },
  { part: roof, material: PALETTE.roof },
  { part: blue, material: finish('ow-blue', 0x4a68c2) },
  { part: win, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Ocean Wonders: Sharks!', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 18.5, osm: 'way/604729335',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-ocean-wonders-sharks.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
console.log(parts.map(({ part, material }) => `  ${material.name}: ${part.triangles}`).join('\n'))
