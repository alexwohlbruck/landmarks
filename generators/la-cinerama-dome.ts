/**
 * Cinerama Dome (1963, Welton Becket and Associates; dome engineered after
 * R. Buckminster Fuller's geodesic system), Hollywood — original procedural
 * geometry, CC0-1.0.
 * bun generators/la-cinerama-dome.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the OSM outline's
 * centroid on the lowest ground under it. Bearing 0. Sunset Blvd runs along
 * the north (+y) side, where the entrance is.
 *
 * What makes it the Cinerama Dome: a near-hemispherical geodesic dome of
 * hexagonal concrete panels, each a shallow raised panel, so the dome reads
 * as a honeycomb of light and shade; in front of it on Sunset, a low glass
 * lobby under a long flat marquee box on slim columns.
 *
 * Sources:
 * - Plan: OSM way/423247168 (outline, 21 m, roof:shape dome) and its parts
 *   way/907828120 (the dome, a circle r ≈ 21.5 centred at (-0.6, -4.2)),
 *   way/907828122 (the entrance block on Sunset, one level) and
 *   way/907828121 (a small one-level piece on the east).
 * - Heights: LA County 2006 lidar surface model (2 m grid) over USGS 3DEP
 *   bare earth (lowest ground 108.0 m): the dome's top 21.5 m, and its
 *   section fits a sphere of radius 22.0 m centred 0.5 m below the ground
 *   (heights 19 m at r = 10, 12 m at r = 18, 9 m at r = 20, 5 m at
 *   r = 21.5) — a nearly full hemisphere. LARIAC 2020 footprint
 *   462336858052: 20.9 m. Entrance block: marquee 7.5–8 m, lobby ≈ 4 m.
 * - Panels: 316 hexagonal panels on the real dome (Wikipedia); drawn as a
 *   frequency-7 geodesic (≈ 250 panels over the dome, broader than the
 *   real ones so they read on a phone). Each is a flat hexagon with its
 *   centre raised 0.6 m, so its six faces take the light in turn, as the
 *   real panels' relief does in photos p2–p4.
 * - Marquee: photos p1–p3 (from Sunset, north): a long white box sign
 *   ≈ 24 m wide and 2.5 m deep on four columns, over a glass lobby,
 *   breeze-block screens at both ends.
 *
 * Photos (Wikimedia Commons): p1 "Hollywood Cinerama Dome" (Andreas
 * Praefcke, CC BY 3.0, from Sunset, north-west); p2 "Cinerama Dome"
 * (Codera23, CC BY-SA 4.0, from Sunset, north); p3 "Cinerama Dome front"
 * (UpdateNerd, CC0, north); p4 "Los Angeles, California (September 10, 2022)
 * - 210" (Another Believer, CC BY-SA 4.0, north-east, the panels). USGS NAIP
 * orthophoto for the plan.
 *
 * Estimated: the marquee's exact width and column places, the lobby's depth.
 * Left out: the marquee's lettering and the theatre signage.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const dome = new Part(), stone = new Part(), trim = new Part(), win = new Part(), roof = new Part()

const C: XY = [-0.6, -4.2] // dome centre
const R = 22.0, ZC = -0.5 // sphere radius and centre height
const Z_BASE = 2.0 // the panels stop on a low base ring
const FREQ = 7, RELIEF = 0.6

// ---------- the geodesic dome ----------
{
  // an icosahedron with a vertex at the top
  const ico: V3[] = [[0, 0, 1]]
  const zr = 1 / Math.sqrt(5), rr = 2 / Math.sqrt(5)
  for (let k = 0; k < 5; k++) ico.push([rr * Math.cos((k * 2 * Math.PI) / 5), rr * Math.sin((k * 2 * Math.PI) / 5), zr])
  for (let k = 0; k < 5; k++) ico.push([rr * Math.cos(((k + 0.5) * 2 * Math.PI) / 5), rr * Math.sin(((k + 0.5) * 2 * Math.PI) / 5), -zr])
  ico.push([0, 0, -1])
  const faces: [number, number, number][] = []
  for (let k = 0; k < 5; k++) {
    const a = 1 + k, b = 1 + ((k + 1) % 5), c = 6 + k, d = 6 + ((k + 1) % 5)
    faces.push([0, a, b], [a, c, b], [b, c, d], [11, d, c])
  }
  const norm = (p: V3): V3 => { const l = Math.hypot(...p); return [p[0] / l, p[1] / l, p[2] / l] }
  // subdivide every face into FREQ² triangles on the unit sphere
  const verts: V3[] = [], index = new Map<string, number>()
  const vid = (p: V3) => {
    const q = norm(p), k = q.map((v) => Math.round(v * 1e5)).join(',')
    let i = index.get(k)
    if (i === undefined) { i = verts.length; verts.push(q); index.set(k, i) }
    return i
  }
  const tris: [number, number, number][] = []
  for (const [ia, ib, ic] of faces) {
    const A = ico[ia], B = ico[ib], Cc = ico[ic]
    const P = (i: number, j: number): V3 => {
      const u = i / FREQ, v = j / FREQ, w = 1 - u - v
      return [A[0] * w + B[0] * u + Cc[0] * v, A[1] * w + B[1] * u + Cc[1] * v, A[2] * w + B[2] * u + Cc[2] * v]
    }
    for (let i = 0; i < FREQ; i++)
      for (let j = 0; j < FREQ - i; j++) {
        tris.push([vid(P(i, j)), vid(P(i + 1, j)), vid(P(i, j + 1))])
        if (j < FREQ - i - 1) tris.push([vid(P(i + 1, j)), vid(P(i + 1, j + 1)), vid(P(i, j + 1))])
      }
  }
  // each hexagon (or pentagon) panel is the ring of its triangles' centroids
  // round a vertex: walk every edge, and give each end's panel the wedge
  // between the two triangles that share it
  const centroid = tris.map(([a, b, c]) => norm([verts[a][0] + verts[b][0] + verts[c][0], verts[a][1] + verts[b][1] + verts[c][1], verts[a][2] + verts[b][2] + verts[c][2]]))
  const edges = new Map<string, number[]>()
  tris.forEach(([a, b, c], t) => {
    for (const [p, q] of [[a, b], [b, c], [c, a]]) {
      const k = p < q ? `${p},${q}` : `${q},${p}`
      const list = edges.get(k)
      if (list) list.push(t)
      else edges.set(k, [t])
    }
  })
  const world = (u: V3, r = R): V3 => [C[0] + u[0] * r, C[1] + u[1] * r, Math.max(Z_BASE, ZC + u[2] * r)]
  const emit = (a: V3, b: V3, c: V3) => {
    // wind outward
    const n = [
      (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]),
      (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]),
      (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]),
    ]
    const m = [(a[0] + b[0] + c[0]) / 3 - C[0], (a[1] + b[1] + c[1]) / 3 - C[1], (a[2] + b[2] + c[2]) / 3 - ZC]
    if (n[0] * m[0] + n[1] * m[1] + n[2] * m[2] >= 0) dome.tri(a, b, c)
    else dome.tri(a, c, b)
  }
  for (const [k, ts] of edges) {
    if (ts.length !== 2) continue
    const [p, q] = k.split(',').map(Number)
    const g0 = world(centroid[ts[0]]), g1 = world(centroid[ts[1]])
    for (const v of [p, q]) {
      if (ZC + verts[v][2] * R < Z_BASE - 1.0) continue // panels wholly below the base
      if (g0[2] <= Z_BASE && g1[2] <= Z_BASE) continue
      emit(world(verts[v], R + RELIEF), g0, g1)
    }
  }
}

// the base ring the dome stands on
{
  const n = 48, r = R - 0.05
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * 2 * Math.PI, a1 = ((i + 1) / n) * 2 * Math.PI
    const p = (a: number, z: number, rr = r): V3 => [C[0] + rr * Math.cos(a), C[1] + rr * Math.sin(a), z]
    const nn = (a: number): V3 => [Math.cos(a), Math.sin(a), 0]
    stone.tri(p(a0, 0), p(a1, 0), p(a1, Z_BASE), undefined, undefined, undefined, [nn(a0), nn(a1), nn(a1)])
    stone.tri(p(a0, 0), p(a1, Z_BASE), p(a0, Z_BASE), undefined, undefined, undefined, [nn(a0), nn(a1), nn(a0)])
    // a narrow top to the ring, under the panels' edge
    stone.quad(p(a0, Z_BASE, r - 1.2), p(a0, Z_BASE), p(a1, Z_BASE), p(a1, Z_BASE, r - 1.2))
  }
}

// ---------- the entrance block on Sunset ----------
/** Ear-clipping triangulation of a simple polygon. */
function earcut(poly: XY[]): [number, number, number][] {
  const idx = poly.map((_, i) => i)
  const crossz = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inTri = (p: XY, a: XY, b: XY, c: XY) => crossz(a, b, p) >= 0 && crossz(b, c, p) >= 0 && crossz(c, a, p) >= 0
  const out: [number, number, number][] = []
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const a = poly[ia], b = poly[ib], c = poly[ic]
      if (crossz(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inTri(poly[j], a, b, c))) continue
      out.push([ia, ib, ic])
      idx.splice(i, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
const signedArea = (poly: XY[]) => poly.reduce((s, p, i) => { const q = poly[(i + 1) % poly.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
function extrude(poly: XY[], z0: number, z1: number, wall: Part, top: Part) {
  const ccw = signedArea(poly) > 0 ? poly : [...poly].reverse()
  for (let i = 0; i < ccw.length; i++) {
    const a = ccw[i], b = ccw[(i + 1) % ccw.length]
    wall.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  for (const [i, j, k] of earcut(ccw)) top.tri([ccw[i][0], ccw[i][1], z1], [ccw[j][0], ccw[j][1], z1], [ccw[k][0], ccw[k][1], z1])
}
function box(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, wall: Part, top = wall, lip = 0.25) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  const ri: XY[] = [[x0 + lip, y0 + lip], [x1 - lip, y0 + lip], [x1 - lip, y1 - lip], [x0 + lip, y1 - lip]]
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4], ai = ri[i], bi = ri[(i + 1) % 4]
    wall.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1 - lip], [a[0], a[1], z1 - lip])
    wall.quad([a[0], a[1], z1 - lip], [b[0], b[1], z1 - lip], [bi[0], bi[1], z1], [ai[0], ai[1], z1])
  }
  if (z0 > 0.01) wall.quad([r[0][0], r[0][1], z0], [r[3][0], r[3][1], z0], [r[2][0], r[2][1], z0], [r[1][0], r[1][1], z0])
  top.quad([ri[0][0], ri[0][1], z1], [ri[1][0], ri[1][1], z1], [ri[2][0], ri[2][1], z1], [ri[3][0], ri[3][1], z1])
}

// The lobby block: OSM way/907828122's outline, one storey. Its front on
// Sunset is the glass lobby; the ends are breeze-block screens.
const ENTRY: XY[] = [
  [-10.91, 14.57], [-11.58, 16.57], [-13.43, 16.03], [-17.51, 18.95], [-17.07, 19.54], [-16.03, 20.87], [-14.38, 22.68],
  [-12.96, 24.05], [-10.97, 25.75], [-10.37, 24.92], [-6.77, 25.81], [5.29, 25.86], [9.09, 25.06], [10.0, 25.9],
  [12.66, 23.83], [14.53, 21.89], [16.55, 19.36], [12.91, 16.56], [11.61, 13.46], [7.43, 15.68], [2.86, 16.94],
  [-1.86, 17.17], [-6.53, 16.36],
]
// the glazed front sits back under the canopy; the block behind it
const LOBBY: XY[] = [
  [-10.91, 14.57], [-11.58, 16.57], [-13.43, 16.03], [-17.51, 18.95], [-15.4, 21.5], [14.8, 21.5], [16.55, 19.36],
  [12.91, 16.56], [11.61, 13.46], [7.43, 15.68], [2.86, 16.94], [-1.86, 17.17], [-6.53, 16.36],
]
extrude(LOBBY, 0, 4.0, stone, roof)
// the lobby glass across the front, under the marquee
win.quad([9.5, 21.54, 0.2], [-9.5, 21.54, 0.2], [-9.5, 21.54, 3.6], [9.5, 21.54, 3.6])
// the east piece
extrude([[15.49, 10.09], [18.31, 6.13], [20.17, 1.66], [22.62, 2.33], [22.46, 5.05], [22.0, 7.47], [21.4, 9.83], [19.75, 13.84]], 0, 4.0, stone, roof)

// The marquee: a long flat white box on four slim columns, its face to
// Sunset, its underside the canopy over the lobby's door.
const MQ_X = 12.2, MQ_Y0 = 19.0, MQ_Y1 = 25.8, MQ_Z0 = 5.4, MQ_Z1 = 8.0
box(-MQ_X, MQ_X, MQ_Y0, MQ_Y1, MQ_Z0, MQ_Z1, trim, roof, 0.25)
// a thin canopy slab under it, out to the columns
box(-MQ_X + 0.4, MQ_X - 0.4, 21.4, MQ_Y1 - 0.3, MQ_Z0 - 0.5, MQ_Z0, stone, stone, 0.1)
for (const x of [-10.4, -5.6, 5.6, 10.4]) {
  box(x - 0.45, x + 0.45, 24.0, 24.9, 0, MQ_Z0 - 0.5, stone, stone, 0.1)
}

// ---------- write ----------
const parts = [
  { part: dome, material: finish('cinerama-concrete', 0xece9e2) },
  { part: stone, material: PALETTE.stone },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Cinerama Dome', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, height: R + ZC + RELIEF,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/423247168', 'way/907828120', 'way/907828121', 'way/907828122'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/la-cinerama-dome.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
