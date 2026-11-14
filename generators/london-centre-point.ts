/**
 * Centre Point, 101-103 New Oxford Street, London: procedural, CC0-1.0.
 * bun generators/london-centre-point.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 346.7, the
 * slab's long axis (OSM outline way/41117907), so the long faces are the
 * model's east and west. The origin is the outline's centroid; y = 0 is the
 * street. Built 1963-66 (Richard Seifert & Partners, engineer Pell Frischmann),
 * listed Grade II (NHLE 1066213), converted to flats 2015-18 (Conran).
 *
 * Published (Wikipedia "Centre Point"; CTBUH): 117 m, 34 storeys.
 *
 * Measured, Environment Agency LIDAR Composite DSM/DTM 1 m (Open Government
 * Licence v3.0): the street round the foot is flat (6.0-6.4 m above the box's
 * lowest cell, which is the Tottenham Court Road station dig); the flat roof
 * reads 113.0 m above the street, the plant on it 115.4 m. The published
 * 117 m is a little above anything the lidar shows; the lidar is used.
 * The slab's plan matches OSM's outline within a metre.
 *
 * Plan (OSM): a slab 41.6 m long, its long faces gently convex (8.9 m from
 * the axis at mid-length, 7.3 m at the corners); each end two facets meeting
 * at a recessed glazed strip 2.2 m wide, 1.2 m deep.
 *
 * From photos:
 * - the facade: precast concrete units, one per bay and storey, whose
 *   T-shaped mullions and hooded heads make a honeycomb. Abstracted as a
 *   relief: projecting concrete bands every two storeys whose undersides
 *   rise to a gable between piers (each opening's head is the top of a
 *   hexagon, the honeycomb), proud piers every two bays (16 bays a long face,
 *   15 real), the glass 0.5 m behind the wall line;
 * - the end strips: continuous glazing, the full height;
 * - the stilted base: a ground floor glazed and set back, the first-floor
 *   slab, then tall fins (the stilts, about one a bay) to 15 m in front of
 *   a dark recessed storey, the tower's first honeycomb storey above;
 * - the crown: a deeper plain band (the lettering frieze, reading grey
 *   in shadow in every photo, so drawn in `roof`) with a projecting
 *   lip, plant on the flat roof.
 *
 * Estimated: storey grouping, fin spacing and depth, the base heights
 * (photos, scaled from the 2.98 m storey), the crown band's depth.
 * Left out: the CENTRE POINT lettering on the crown (a sign, not the
 * identity), the fountains, the glass station entrances. The lower east
 * block (Centre Point House, way/41117906, with its bridge over the road)
 * is a separate OSM building outside the tower's outline and is left to the
 * map, as asked.
 *
 * OSM: way/41117907 (the tower outline; no building:parts).
 *
 * Night: the flats' windows glow (`window`); the base glazing is
 * `entrance`; the concrete is floodlit lightly at the crown.
 *
 * Photos (Wikimedia Commons), EVIDENCE:
 * - "Centre Point.jpg", Tiia Monto, CC BY-SA 4.0 (from the south-west, base and fins)
 * - "Centre Point, London, August 2023 01.jpg", No Swan So Fine, CC BY-SA 4.0 (west face, convex roofline)
 * - "At London 2026 0166 - Centre Point.jpg", Mike Peel, CC BY-SA 4.0 (south end, the glazed strip)
 * - "Centre Point, London, UK - Flickr - John Briody Photography.jpg", John Briody, CC BY 2.0 (crown, units)
 * - "Centre Point and the BT Tower from the air - geograph.org.uk - 6255011.jpg", Thomas Nugent, CC BY-SA 2.0 (aerial from the south-east)
 * - "Centre Point - geograph.org.uk - 3255089.jpg", Andrew Wilson, CC BY-SA 2.0 (crown from the east)
 * - "Centre Point, London.jpg", Mike Peel, CC BY-SA 4.0 (the fins, looking up)
 * - "Centre Point from New Oxford Street, London (25th September 2014).JPG", Mtaylor848, CC BY-SA 4.0 (from the east)
 * - "London Centre Point Tower von SE 201008.jpg", Karlunun, CC BY-SA 4.0 (from the south-east)
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE } from './palette'

type P2 = [number, number]
const concrete = new Part()  // the precast frame, fins
const crown = new Part()     // crown band, first-floor slab, plinth lines
const win = new Part()       // glass of the flats (lit)
const roof = new Part()
const lobby = new Part()     // ground-floor glazing (entrance)

// ------------------------------------------------------------------ plan ---
const YC = 19.6, WMID = 8.9, WEND = 7.3, NSEG = 8
const w = (y: number) => WMID - (WMID - WEND) * (y / YC) ** 2
/** The wall line, counter-clockwise from above, and which points are piers. */
const ring: P2[] = [], pier: boolean[] = [], banded: boolean[] = [] // banded[i]: segment i -> i+1
const push = (p: P2, isPier: boolean, band: boolean) => { ring.push(p); pier.push(isPier); banded.push(band) }
for (let k = 0; k <= NSEG; k++) { const y = -YC + (2 * YC * k) / NSEG; push([w(y), y], true, k < NSEG) } // east face, south to north
const endPts = (s: 1 | -1) => {
  // From the corner on the +x side (s = 1, north) or -x side (s = -1, south).
  push([s * 1.6, s * 20.8], false, false)   // lip
  push([s * 1.1, s * 19.6], false, false)   // notch back
  push([-s * 1.1, s * 19.6], false, false)
  push([-s * 1.6, s * 20.8], false, true)   // lip, then the facet to the corner
}
banded[banded.length - 1] = true // east-north corner to lip
endPts(1)
for (let k = 0; k <= NSEG; k++) { const y = YC - (2 * YC * k) / NSEG; push([-w(y), y], true, k < NSEG) } // west face
banded[banded.length - 1] = true
endPts(-1)
const N = ring.length
/** Per-vertex outward normal (average of the adjoining segments' normals). */
const segN = ring.map((a, i) => {
  const b = ring[(i + 1) % N], l = Math.hypot(b[0] - a[0], b[1] - a[1])
  return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l] as P2
})
const vN = ring.map((_, i) => {
  const a = segN[(i + N - 1) % N], b = segN[i], s: P2 = [a[0] + b[0], a[1] + b[1]], l = Math.hypot(...s)
  return [s[0] / l, s[1] / l] as P2
})
/** A ring offset along the vertex normals (mitre-free; the angles are shallow). */
const off = (d: number): P2[] => ring.map((p, i) => [p[0] + vN[i][0] * d, p[1] + vN[i][1] * d])
/** The same, without the end notches, for deep offsets (the base). */
const offS = (d: number): P2[] => {
  const keep = ring.map((_, i) => pier[i] || (banded[i] !== banded[(i + N - 1) % N]))
  const pts: P2[] = []
  ring.forEach((p, i) => { if (keep[i]) pts.push([p[0] + vN[i][0] * d, p[1] + vN[i][1] * d]) })
  return pts
}

function earcut(pts: P2[]): [number, number, number][] {
  const idx = pts.map((_, i) => i), out: [number, number, number][] = []
  const ar = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1])
  let guard = 0
  while (idx.length > 3 && guard++ < 2000) {
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      if (ar(pts[ia], pts[ib], pts[ic]) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && ar(pts[ia], pts[ib], pts[j]) >= 0 && ar(pts[ib], pts[ic], pts[j]) >= 0 && ar(pts[ic], pts[ia], pts[j]) >= 0)) continue
      out.push([ia, ib, ic]); idx.splice(i, 1); break
    }
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}
/** A vertical prism over a counter-clockwise ring. */
function prism(p: Part, pts: P2[], z0: number, z1: number, top: Part | null = p, bottom = false) {
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  const tris = earcut(pts)
  if (top) for (const [a, b, c] of tris) top.tri([pts[a][0], pts[a][1], z1], [pts[b][0], pts[b][1], z1], [pts[c][0], pts[c][1], z1])
  if (bottom) for (const [a, b, c] of tris) p.tri([pts[a][0], pts[a][1], z0], [pts[c][0], pts[c][1], z0], [pts[b][0], pts[b][1], z0])
}
/** A box in a local frame: centre c, along t (half a), out n (from n0 to n1), z0..z1. */
function box(p: Part, c: P2, t: P2, n: P2, a: number, n0: number, n1: number, z0: number, z1: number) {
  const at = (u: number, v: number): P2 => [c[0] + t[0] * u + n[0] * v, c[1] + t[1] * u + n[1] * v]
  const pts = [at(-a, n0), at(a, n0), at(a, n1), at(-a, n1)]
  // counter-clockwise check
  const s = (pts[1][0] - pts[0][0]) * (pts[2][1] - pts[0][1]) - (pts[2][0] - pts[0][0]) * (pts[1][1] - pts[0][1])
  prism(p, s > 0 ? pts : [...pts].reverse(), z0, z1)
}

// ---------------------------------------------------------------- heights ---
const Z_SLAB0 = 5.4, Z_SLAB1 = 6.6, Z_STILT = 15.0, Z_TOP = 110.6, Z_ROOF = 113.0
const NBAND = 16, BAND_H = (Z_TOP - Z_STILT) / NBAND // two storeys of 2.98 m
const GLASS = -0.5, FRONT = 0.55

// --------------------------------------------------------------- the base ---
prism(lobby, offS(-2.2), 0, Z_SLAB0, null)
prism(crown, off(0.2), Z_SLAB0, Z_SLAB1, crown, true) // the first-floor slab's folded edge, drawn plain
prism(win, offS(-2.0), Z_SLAB1, Z_STILT, null)
// The stilts: fins about one a bay, from the slab to the tower's first floor.
for (let i = 0; i < N; i++) {
  const a = ring[i], b = ring[(i + 1) % N], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 3) continue
  const t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = segN[i]
  const nf = Math.max(1, Math.round(L / 2.6))
  for (let k = 0; k < nf; k++) {
    const u = ((k + 0.5) / nf) * L
    box(concrete, [a[0] + t[0] * u, a[1] + t[1] * u], t, n, 0.4, -2.0, 0.1, Z_SLAB1, Z_STILT)
  }
}

// ------------------------------------------------------------- the shaft ---
// Glass wall 0.5 m behind the wall line, full height; the roof on top.
prism(win, off(GLASS), Z_STILT, Z_TOP, null)
// Piers every two bays on the long faces and at each end facet's ends.
for (let i = 0; i < N; i++) {
  if (!pier[i] && !banded[i] && !banded[(i + N - 1) % N]) continue
  const p = ring[i], n = vN[i], t: P2 = [-n[1], n[0]]
  box(concrete, p, t, n, 0.45, GLASS - 0.05, FRONT - 0.15, Z_STILT, Z_TOP)
}
// The bands: every two storeys, continuous along each banded segment, the
// underside a shallow gable between piers, so each opening's head is the
// upper half of a hexagon.
const DROP = 1.1, BAND = 0.8
for (let b = 0; b < NBAND; b++) {
  const zt = Z_STILT + (b + 1) * BAND_H, zb = zt - BAND
  for (let i = 0; i < N; i++) {
    if (!banded[i]) continue
    const j = (i + 1) % N, A = ring[i], B = ring[j]
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]), t: P2 = [(B[0] - A[0]) / L, (B[1] - A[1]) / L]
    const nA = vN[i], nB = vN[j]
    // Points along the segment: [u, bottom z]
    const prof: [number, number][] = L > 3
      ? [[0, zb - DROP], [L / 2, zb], [L, zb - DROP]]
      : [[0, zb], [L, zb]]
    const at = (u: number, d: number, z: number): V3 => {
      const f = u / L, n: P2 = [nA[0] * (1 - f) + nB[0] * f, nA[1] * (1 - f) + nB[1] * f]
      return [A[0] + t[0] * u + n[0] * d, A[1] + t[1] * u + n[1] * d, z]
    }
    for (let k = 0; k < prof.length - 1; k++) {
      const [u0, z0] = prof[k], [u1, z1] = prof[k + 1]
      concrete.quad(at(u0, FRONT, z0), at(u1, FRONT, z1), at(u1, FRONT, zt), at(u0, FRONT, zt)) // front
      concrete.quad(at(u0, GLASS, z0), at(u1, GLASS, z1), at(u1, FRONT, z1), at(u0, FRONT, z0)) // underside
    }
    concrete.quad(at(0, FRONT, zt), at(L, FRONT, zt), at(L, GLASS, zt), at(0, GLASS, zt)) // top
    // Close the band's ends where the next segment is not banded (the glazed strip).
    if (!banded[(i + N - 1) % N]) concrete.quad(at(0, GLASS, prof[0][1]), at(0, FRONT, prof[0][1]), at(0, FRONT, zt), at(0, GLASS, zt))
    if (!banded[j]) concrete.quad(at(L, FRONT, prof[prof.length - 1][1]), at(L, GLASS, prof[prof.length - 1][1]), at(L, GLASS, zt), at(L, FRONT, zt))
  }
}

// ------------------------------------------------------------- the crown ---
// A plain band (the frieze that carries the lettering) with a projecting lip.
prism(roof, off(FRONT - 0.15), Z_TOP - 0.2, Z_ROOF - 0.5, null)
prism(crown, off(FRONT + 0.25), Z_ROOF - 0.5, Z_ROOF + 0.4, null, true)
// Parapet inner face and roof.
{
  const inner = off(-0.6)
  const rev = [...inner].reverse()
  prism(crown, rev, Z_ROOF - 0.3, Z_ROOF + 0.4, null)
  const outer = off(FRONT + 0.25)
  for (let i = 0; i < N; i++) { // parapet top
    const j = (i + 1) % N
    crown.quad([inner[i][0], inner[i][1], Z_ROOF + 0.4], [outer[i][0], outer[i][1], Z_ROOF + 0.4], [outer[j][0], outer[j][1], Z_ROOF + 0.4], [inner[j][0], inner[j][1], Z_ROOF + 0.4])
  }
  for (const [a, b, c] of earcut(inner)) roof.tri([inner[a][0], inner[a][1], Z_ROOF - 0.3], [inner[b][0], inner[b][1], Z_ROOF - 0.3], [inner[c][0], inner[c][1], Z_ROOF - 0.3])
}
// Plant on the roof (lidar 115.4 m): a central block and two lift motor rooms.
{
  const t: P2 = [0, 1], n: P2 = [1, 0]
  box(crown, [0, 0], t, n, 9.0, -4.2, 4.2, Z_ROOF - 0.3, 115.4)
  box(roof, [0, 0], t, n, 8.6, -3.8, 3.8, 115.4, 115.6)
  box(crown, [0, 11.5], t, n, 1.8, -2.0, 2.0, Z_ROOF - 0.3, 114.6)
  box(crown, [0, -11.5], t, n, 1.8, -2.0, 2.0, Z_ROOF - 0.3, 114.6)
}

// ---------------------------------------------------------------- output ---
// Colours from daylight photos: the precast is a warm off-white (stone);
// the crown and slab a touch lighter (trim); the glass reads a sky grey-blue.
const crownLit = (p: V3, n: V3) => (p[2] > Z_TOP - 1 && n[2] < 0.5 ? 0.7 : 0)
const parts = [
  { part: concrete, material: PALETTE.stone },
  { part: crown, material: { ...PALETTE.trim, floodlight: crownLit } },
  { part: win, material: { ...PALETTE.window, color: 0x9cb2c4 } },
  { part: roof, material: PALETTE.roof },
  { part: lobby, material: PALETTE.entrance },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Centre Point', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 346.7, elevation: 0, height: 115.6,
})
if (glb.length > 250_000) console.error(`Size budget exceeded: ${glb.length} bytes, ${triangles} tris`)
const out = new URL('../models/london-centre-point.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
