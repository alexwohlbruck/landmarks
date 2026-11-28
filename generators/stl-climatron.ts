/**
 * The Climatron, Missouri Botanical Garden, St. Louis (1960, Murphy and
 * Mackey, after R. Buckminster Fuller's geodesic system) — procedural,
 * CC0-1.0, no textures.  bun generators/stl-climatron.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (a dome). Anchor
 * -90.2588704, 38.6140934: the centre of OSM way/149736800 (a 46-node
 * circle, radius 27.9–29.5 m about it).
 *
 * The building: a low geodesic dome, a segment of a sphere on a short
 * outward-leaning glazed skirt, its aluminium space frame outside the
 * glazing. The outer layer reads as big hexagons (five-sided at the
 * icosahedron's vertices, with the five-pointed star at the crown), the
 * inner layer as triangles. Glass hangs inside the frame; the tropical
 * planting shows through it.
 *
 * Measured (USGS lidar USGS_LPC_MO_StLouis_2017_LAS_2018, flown 2017–18,
 * 0.5 m grid, above the ground round the base, 4.5 m over the box's lowest
 * point; the reflecting pool's side reads 3 m lower): the crown 20.0; the
 * shell 18.2 at 10 m out, 15.2 at 16, 11.7 at 20, 8.8 at 24, 5.4 at 26 and
 * about 3 at 28. A sphere of radius 28.2 m centred 8.2 m below the ground
 * fits the upper shell within 0.7 m; it meets the skirt at 3.5 m, 25.7 m
 * out, and the skirt leans out to 28.0 m at the ground (OSM's circle).
 * Published: 175 ft (53 m) across, 70 ft (21 m) high (Missouri Botanical
 * Garden; Wikipedia, "Climatron").
 * Estimated: the geodesic frequency (6: cells about 5.5 m across, as the
 * photos show some ten cells from rim to crown), the two layers' depth
 * (0.6 m), the fifteen skirt legs, the planting.
 *
 * Glass: translucent (STYLE.md, "Translucent glass"): `glass`, pale blue at
 * 28% opacity, double-sided; the frame is bold pale aluminium bars, each a
 * crossed pair of strips (one along the shell, one radial) so it reads
 * from any side and edge-on; the canopy of the planting inside.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *   - "Climatron, Missouri Botanical Gardens.jpg", CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Climatron,_Missouri_Botanical_Gardens.jpg
 *     (the hexagon frame over the triangles, the entrance doors);
 *   - "The Climatron at the Missouri Botanical Garden - panoramio.jpg",
 *     hakkun, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:The_Climatron_at_the_Missouri_Botanical_Garden_-_panoramio.jpg;
 *   - "Climatron, WEST SEGMENT HABS MO,96-SALU,105L-3.jpg", Jet Lowe (HABS),
 *     public domain,
 *     https://commons.wikimedia.org/wiki/File:Climatron,_WEST_SEGMENT_HABS_MO,96-SALU,105L-3.jpg
 *     (the profile, the skirt and its legs, the crown star);
 *   - "Climatron INTERIOR VIEW, HABS MO,96-SALU,105L-8.jpg", Jet Lowe (HABS),
 *     public domain (the planting);
 *   - "Gfp-climatron-at-st-louis-botanical-gardens.jpg", Yinan Chen, public
 *     domain (the shell from the south-east).
 * Left out: the low entrance and service structures at the skirt (doors,
 * awnings), the reflecting pool (the map's).
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { save } from './atl-tech-tower'

const glass = new Part(), frame = new Part(), plants = new Part()
const R = 28.2, CZ = -8.2, ZRIM = 3.5, RBASE = 28.0
const F = 6 // geodesic frequency

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const norm = (a: V3): V3 => mul(a, 1 / Math.hypot(...a))
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

// ── The geodesic sphere (unit), a vertex at the crown ──────────────────────
const t = (1 + Math.sqrt(5)) / 2
const ICO: V3[] = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map((v) => norm(v as V3))
const ICOF = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]]
// turn vertex 0 to the top (+z)
const top = ICO[0]
const axis = norm(cross(top, [0, 0, 1])), ang = Math.acos(top[2])
const rot = (v: V3): V3 => { // Rodrigues
  const c = Math.cos(ang), s = Math.sin(ang), k = axis
  const d = k[0] * v[0] + k[1] * v[1] + k[2] * v[2]
  return add(add(mul(v, c), mul(cross(k, v), s)), mul(k, d * (1 - c)))
}
const verts: V3[] = [], key = new Map<string, number>()
const vid = (v: V3) => {
  const k = v.map((c) => c.toFixed(4)).join(',')
  if (!key.has(k)) { key.set(k, verts.length); verts.push(v) }
  return key.get(k)!
}
const faces: [number, number, number][] = []
for (const [ia, ib, ic] of ICOF) {
  const A = rot(ICO[ia]), B = rot(ICO[ib]), C = rot(ICO[ic])
  const P = (i: number, j: number) => vid(norm(add(add(mul(A, (F - i - j) / F), mul(B, i / F)), mul(C, j / F))))
  for (let i = 0; i < F; i++) for (let j = 0; j < F - i; j++) {
    faces.push([P(i, j), P(i + 1, j), P(i, j + 1)])
    if (i + j < F - 1) faces.push([P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)])
  }
}

// ── Clip to the dome and place it ──────────────────────────────────────────
const cut = (ZRIM - CZ) / R // the rim's height on the unit sphere
const rimR = Math.sqrt(R * R - (ZRIM - CZ) ** 2)
const place = (u: V3): V3 => {
  if (u[2] >= cut) return [u[0] * R, u[1] * R, CZ + u[2] * R]
  const h = Math.hypot(u[0], u[1]) // a vertex just under the rim drops onto it, keeping its bearing
  return [(u[0] / h) * rimR, (u[1] / h) * rimR, ZRIM]
}
const keep = faces.filter((f) => (verts[f[0]][2] + verts[f[1]][2] + verts[f[2]][2]) / 3 > cut - 0.02)
const C0: V3 = [0, 0, CZ]
const outward = (p: V3) => norm(sub(p, C0))

// glass: the shell's triangles
for (const [a, b, c] of keep) glass.tri(place(verts[a]), place(verts[b]), place(verts[c]))

/** A frame member: a strip along the shell and a radial fin, crossed. */
function member(a: V3, b: V3, w: number, d: number, off: number) {
  const m = mul(add(a, b), 0.5), n = outward(m), tt = norm(sub(b, a)), s = norm(cross(tt, n))
  const A = add(a, mul(outward(a), off)), B = add(b, mul(outward(b), off))
  frame.quad(add(A, mul(s, -w / 2)), add(B, mul(s, -w / 2)), add(B, mul(s, w / 2)), add(A, mul(s, w / 2)))
  if (d > 0) frame.quad(add(A, mul(n, -d / 2)), add(B, mul(n, -d / 2)), add(B, mul(n, d / 2)), add(A, mul(n, d / 2)))
}

// inner layer: the triangles' edges, slim, just outside the glass
const edges = new Map<string, [number, number]>()
for (const [a, b, c] of keep) for (const [p, q] of [[a, b], [b, c], [c, a]]) edges.set(p < q ? `${p},${q}` : `${q},${p}`, [p, q])
for (const [p, q] of edges.values()) member(place(verts[p]), place(verts[q]), 0.3, 0, 0.15) // a flat strip: the inner layer only shows from outside

// outer layer: the dual cells (hexagons and pentagons), bold, 0.6 m out —
// each pair of faces sharing an edge joins their centres
const centre = (f: [number, number, number]) => norm(add(add(verts[f[0]], verts[f[1]]), verts[f[2]]))
const byEdge = new Map<string, number[]>()
keep.forEach((f, i) => { for (const [p, q] of [[f[0], f[1]], [f[1], f[2]], [f[2], f[0]]]) { const k = p < q ? `${p},${q}` : `${q},${p}`; (byEdge.get(k) ?? byEdge.set(k, []).get(k)!).push(i) } })
for (const list of byEdge.values()) {
  if (list.length !== 2) continue
  const a = centre(keep[list[0]]), b = centre(keep[list[1]])
  if (a[2] < cut + 0.01 || b[2] < cut + 0.01) continue
  member(place(a), place(b), 0.6, 0.45, 0.6)
}
// the rim ring
const N = 45
for (let i = 0; i < N; i++) {
  const a0 = (i / N) * 2 * Math.PI, a1 = ((i + 1) / N) * 2 * Math.PI
  member([Math.cos(a0) * rimR, Math.sin(a0) * rimR, ZRIM], [Math.cos(a1) * rimR, Math.sin(a1) * rimR, ZRIM], 0.7, 0.7, 0.3)
}

// ── The skirt: glazing leaning out to the ground, fifteen legs ─────────────
for (let i = 0; i < N; i++) {
  const a0 = (i / N) * 2 * Math.PI, a1 = ((i + 1) / N) * 2 * Math.PI
  const P = (a: number, r: number, z: number): V3 => [Math.cos(a) * r, Math.sin(a) * r, z]
  glass.quad(P(a0, RBASE, 0), P(a1, RBASE, 0), P(a1, rimR, ZRIM), P(a0, rimR, ZRIM))
  member(P(a0, RBASE, 0.3), P(a1, RBASE, 0.3), 0.5, 0.5, 0) // sill
  member(P(a0, RBASE, 0.3), P(a0, rimR, ZRIM), 0.3, 0.3, 0.05) // mullion
}
for (let i = 0; i < 15; i++) {
  const a = (i / 15) * 2 * Math.PI + Math.PI / 30
  member([Math.cos(a) * (RBASE + 0.6), Math.sin(a) * (RBASE + 0.6), 0.5], [Math.cos(a) * rimR, Math.sin(a) * rimR, ZRIM + 0.6], 0.9, 0.9, 0)
}

// ── Inside: the tropical canopy, seen through the glass ────────────────────
/** A rounded tree crown: three rings of eight, capped top and bottom. */
function blob(c: V3, r: number, h: number) {
  const n = 6, rings: [number, number][] = [[-0.5, 0.0], [-0.3, 0.8], [0.05, 1.0], [0.35, 0.75], [0.5, 0.0]]
  const P = (k: number, i: number): V3 => { const a = (i / n) * 2 * Math.PI + k * 0.3; return [c[0] + Math.cos(a) * r * rings[k][1], c[1] + Math.sin(a) * r * rings[k][1], c[2] + h * rings[k][0]] }
  for (let k = 0; k < rings.length - 1; k++) for (let i = 0; i < n; i++) {
    const a = P(k, i), b = P(k, i + 1), cc = P(k + 1, i + 1), d = P(k + 1, i)
    if (rings[k][1] > 0) plants.tri(a, b, cc)
    if (rings[k + 1][1] > 0) plants.tri(a, cc, d)
  }
}
const TREES: [number, number, number, number][] = [
  [0, 0, 13, 7], [-12, 6, 10, 6], [11, 9, 9.5, 6], [8, -12, 10.5, 6.5], [-9, -13, 9, 6], [-19, -4, 6.5, 5], [19, -3, 6.5, 5],
  [2, 18, 7, 5], [-4, -21, 5.5, 4.5], [16, 15, 5, 4], [-15, 16, 5, 4], [0, -6, 4, 7], [21, 8, 3.5, 3.5], [-21, 9, 3.5, 3.5],
]
for (const [x, y, z, r] of TREES) blob([x, y, z], r, z * 0.9)

await save('stl-climatron', 'Climatron', [
  { part: glass, material: { name: 'glass', color: 0x9fcbe0, roughness: 0.2, opacity: 0.28, doubleSided: true } },
  { part: frame, material: { ...finish('climatron-aluminium', 0xe3e6e6), doubleSided: true } },
  { part: plants, material: finish('climatron-planting', 0x6f9a62) },
], { height: 20.6, anchor: [38.6140934, -90.2588704], bearing: 0, osm: 'way/149736800' }, 6500)
