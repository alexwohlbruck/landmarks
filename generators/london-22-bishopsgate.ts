/**
 * 22 Bishopsgate, City of London — original procedural geometry, CC0-1.0.
 * bun generators/london-22-bishopsgate.ts
 *
 * Map frame turned to the tower's long axis: +y runs along bearing 36 (the
 * long east and west faces), +x along bearing 126, z up, metres. BEARING 36.
 * Origin = centroid of the OSM outline way/717332347.
 *
 * Evidence
 * - OSM way/717332347 (outline, 61 levels, height 278; its note says the part
 *   heights are estimates) and parts, extruded here as mapped in this frame:
 *     way/717373630  central slab, the crown, 62 levels;
 *     way/717374380  the body wrapped around it, 58 levels;
 *     way/717373629  the lower north-west wing;
 *     way/717373628  the lower south-east wing;
 *     way/717374379  the north-east block, from 12 m;
 *     way/717373627  the low entrance podium, 12 m.
 *   The OSM outline lies on the lidar footprint to within a metre or two.
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0 (the tower, finished 2020, is in it). Tier heights read on the roofs,
 *   above the lowest ground under the footprint (1.5 m above the box's
 *   ground_min, at the south-east corner): crown 280.2, body 259.2, north-west
 *   wing 220.8, south-east wing 213.1. These replace the OSM estimates
 *   (278/260/220/212), which they confirm within 2 m.
 * - Published (Wikipedia, CTBUH): 278 m, 62 storeys, PLP Architecture, 2020;
 *   the City of London's tallest building.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "22 Bishopsgate Dec 2025.jpg", Sebalston, CC0 — the stepped, faceted top,
 *     the dark louvred plant bands at the tops of the steps, pale blue-grey
 *     glass;
 *   "22 Bishopsgate 2025-02-10.jpg", Tom Page, CC BY-SA 2.0 — the facade close
 *     up: shingled glass, faceted corners, louvre panels;
 *   "22 Bishopsgate as seen from Waterloo Bridge.jpg", Thecanaryfan,
 *     CC BY-SA 4.0 — from the west, the tower over the City;
 *   "22 Bishopsgate and Leadenhall Building.jpg", Matt Brown, CC BY 2.0;
 *   "City of London as seen from The Shard, 2026.jpg", ThatsTheBoss, CC0 —
 *     from the south-south-west, standing over Leadenhall and the Scalpel.
 *
 * Measured: plan (OSM, checked on lidar), tier heights (lidar). Published:
 * 278 m, 62 storeys. Estimated: the facade's shingled folds — every wall
 * longer than 6 m is split into 2–5 broad vertical panels (~7 m), each tilted
 * out 0.8 m toward its far edge with a pale bevelled seam stepping back at the
 * fold (Tom Page's close-up; the Waterloo and Matt Brown views show them as
 * the main texture from afar); silver-grey glass (#98a2ab, the photos'
 * daylight grey pulled to palette lightness, not the earlier pale blue);
 * faint floor lines every four storeys (17.9 m); a bold 9 m dark louvre band
 * at each setback's top and the crown; the 12 m podium. Not modelled: each
 * storey's individual shingle (too fine), the entrance canopies.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const BEARING = 36
const ANCHOR = { lng: -0.0830161, lat: 51.5144222 }

const glassP = new Part()
const lines = new Part()
const louvre = new Part()
const roof = new Part()
const lobby = new Part()

type P2 = [number, number]
type Block = { poly: P2[]; z0: number; z1: number; name: string }

// OSM parts in this frame (bin/frame.py at bearing 36), heights from lidar.
const BLOCKS: Block[] = [
  { name: 'crown', z0: 0, z1: 280.2, poly: [[-2.9, 22.6], [9.6, 23.1], [10.5, 3.8], [-6.5, -35.1], [-16.6, -39.9], [-19.9, -40.3], [-20.5, -19.3], [-19.0, -16.1]] },
  { name: 'body', z0: 0, z1: 259.2, poly: [[-18.9, 8.3], [-20.4, 4.8], [-19.0, -16.1], [-2.9, 22.6], [9.6, 23.1], [10.5, 3.8], [-6.5, -35.1], [-3.9, -34.9], [7.2, -29.9], [18.4, -5.1], [17.9, 10.4], [16.6, 29.6], [7.7, 45.6], [-2.4, 45.1], [-3.4, 42.8]] },
  { name: 'nw', z0: 0, z1: 220.8, poly: [[-3.4, 42.8], [-13.8, 42.7], [-19.2, 29.9], [-18.9, 8.3]] },
  { name: 'se', z0: 0, z1: 213.1, poly: [[17.9, 10.4], [22.4, 1.5], [24.7, -3.8], [25.0, -14.5], [19.7, -25.9], [10.1, -30.1], [7.2, -29.9], [18.4, -5.1]] },
  { name: 'ne', z0: 12, z1: 259.2, poly: [[16.6, 29.6], [19.9, 36.3], [19.5, 48.1], [8.8, 47.7], [7.7, 45.6]] },
  { name: 'podium', z0: 0, z1: 12, poly: [[-16.0, -47.3], [-11.7, -53.6], [11.3, -37.2], [10.1, -30.1], [7.2, -29.9], [-3.9, -34.9], [-6.5, -35.1], [-16.6, -39.9], [-16.5, -40.6]] },
]

const area = (p: P2[]) => p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
for (const b of BLOCKS) if (area(b.poly) < 0) b.poly.reverse() // anticlockwise from above

function inside(pt: P2, poly: P2[]) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

/** Ear-clipping triangulation of a simple anticlockwise polygon. */
function earcut(poly: P2[]): [P2, P2, P2][] {
  const idx = poly.map((_, i) => i), out: [P2, P2, P2][] = []
  const cr = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 1000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const a = poly[idx[(k + idx.length - 1) % idx.length]], b = poly[idx[k]], c = poly[idx[(k + 1) % idx.length]]
      if (cr(a, b, c) <= 1e-9) continue
      const tri = [a, b, c]
      if (idx.some((m) => { const p = poly[m]; return !tri.includes(p) && inside(p, [...tri, a] as P2[]) && cr(a, b, p) > 0 && cr(b, c, p) > 0 && cr(c, a, p) > 0 })) continue
      out.push([a, b, c])
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([poly[idx[0]], poly[idx[1]], poly[idx[2]]])
  return out
}

const STOREY = 278 / 62
const LINE_EVERY = 4 * STOREY
const LOUVRE = 9
const FOLD = 0.8 // how far each shingled panel tilts out at its far edge

for (const b of BLOCKS) {
  const n = b.poly.length
  for (let i = 0; i < n; i++) {
    const a = b.poly[i], c = b.poly[(i + 1) % n]
    const dx = c[0] - a[0], dy = c[1] - a[1], L = Math.hypot(dx, dy)
    if (L < 0.05) continue
    const nx = dy / L, ny = -dx / L // outward for an anticlockwise ring
    // Is this wall covered by a neighbouring block? Up to how high?
    const probe: P2 = [(a[0] + c[0]) / 2 + nx * 0.4, (a[1] + c[1]) / 2 + ny * 0.4]
    let hidden = b.z0
    for (const o of BLOCKS) if (o !== b && o.z0 <= b.z0 + 0.01 && inside(probe, o.poly)) hidden = Math.max(hidden, Math.min(o.z1, b.z1))
    if (hidden >= b.z1 - 0.01) continue
    const zLo = hidden, zHi = b.z1
    if (b.name === 'podium') {
      lobby.quad([a[0], a[1], zLo], [c[0], c[1], zLo], [c[0], c[1], zHi], [a[0], a[1], zHi])
      continue
    }
    // The shingled facade: the wall is broken into 3-5 broad vertical folds, each panel tilted
    // out by FOLD toward its far end, with a narrow bevelled seam stepping back at each fold.
    const k = L < 6 ? 1 : Math.max(2, Math.min(5, Math.round(L / 7)))
    const at = (t: number, off: number): P2 => [a[0] + dx * t + nx * off, a[1] + dy * t + ny * off]
    const SEAM = Math.min(0.35, L / k / 6)
    const facets: [P2, P2][] = [], seams: [P2, P2][] = []
    for (let j = 0; j < k; j++) {
      const t0 = j / k, t1 = (j + 1) / k
      if (k === 1) { facets.push([at(t0, 0), at(t1, 0)]); continue }
      const q = at(t1 - SEAM / L, FOLD)
      facets.push([at(t0, 0), q])
      seams.push([q, at(t1, 0)])
      // close the top (and the soffit of a raised block) over the fold's wedge
      roof.tri([at(t0, 0)[0], at(t0, 0)[1], zHi], [q[0], q[1], zHi], [at(t1, 0)[0], at(t1, 0)[1], zHi])
      if (b.z0 > 0 && zLo <= b.z0 + 0.01) roof.tri([at(t0, 0)[0], at(t0, 0)[1], zLo], [at(t1, 0)[0], at(t1, 0)[1], zLo], [q[0], q[1], zLo])
    }
    const zl = zHi - LOUVRE
    const wall = (part: Part, [p0, p1]: [P2, P2], z0: number, z1: number, off = 0) => {
      const ex = p1[0] - p0[0], ey = p1[1] - p0[1], el = Math.hypot(ex, ey) || 1
      const ox = (ey / el) * off, oy = (-ex / el) * off
      part.quad([p0[0] + ox, p0[1] + oy, z0], [p1[0] + ox, p1[1] + oy, z0], [p1[0] + ox, p1[1] + oy, z1], [p0[0] + ox, p0[1] + oy, z1])
    }
    for (const f of facets) {
      wall(glassP, f, zLo, Math.max(zLo, zl))
      if (zl > zLo) wall(louvre, f, Math.max(zLo, zl), zHi)
      // Floor lines every four storeys, faint and slightly proud.
      for (let z = LINE_EVERY; z < zl - 2; z += LINE_EVERY) if (z > zLo + 1) wall(lines, f, z, z + 0.45, 0.06)
    }
    for (const sm of seams) wall(lines, sm, zLo, zHi)
  }
  // Roof cap and a soffit for the raised north-east block.
  for (const [p, q, r] of earcut(b.poly)) roof.tri([p[0], p[1], b.z1], [q[0], q[1], b.z1], [r[0], r[1], b.z1])
  if (b.z0 > 0) for (const [p, q, r] of earcut(b.poly)) roof.tri([p[0], p[1], b.z0], [r[0], r[1], b.z0], [q[0], q[1], b.z0])
}

// Rooftop parapet on the crown: a dark rim, so the top reads crisp.
{
  const b = BLOCKS[0], n = b.poly.length
  for (let i = 0; i < n; i++) {
    const a = b.poly[i], c = b.poly[(i + 1) % n]
    louvre.quad([a[0], a[1], b.z1], [c[0], c[1], b.z1], [c[0], c[1], b.z1 + 1.2], [a[0], a[1], b.z1 + 1.2])
    louvre.quad([c[0], c[1], b.z1], [a[0], a[1], b.z1], [a[0], a[1], b.z1 + 1.2], [c[0], c[1], b.z1 + 1.2])
  }
}

const parts = [
  { part: glassP, material: windowVariant(2, 0x98a2ab) },
  { part: lines, material: finish('seam', 0xc9cfd4, 0.5) },
  { part: louvre, material: finish('louvre', 0x4f565d) },
  { part: roof, material: PALETTE.roof },
  { part: lobby, material: PALETTE.entrance },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('22 Bishopsgate', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 281.4,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/717332347', 'way/717373627', 'way/717373628', 'way/717373629', 'way/717373630', 'way/717374379', 'way/717374380'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/london-22-bishopsgate.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
