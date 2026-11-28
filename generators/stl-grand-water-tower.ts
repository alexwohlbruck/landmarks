/**
 * Grand Avenue Water Tower ("Old White"), College Hill, St. Louis (1871,
 * George I. Barnett; a standpipe cased as a Corinthian column, the tallest
 * free-standing one in the world) — procedural, CC0-1.0, no textures.
 * bun generators/stl-grand-water-tower.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Anchor -90.2085226,
 * 38.6704650: the vertex centroid of OSM way/238580241 (the pedestal, an
 * irregular octagon of radius 3.1–4.2 m).
 *
 * The tower (photos): an octagonal pedestal with a cornice; the column's
 * Attic base, a plinth and two tori; a plain, slightly tapering shaft
 * painted white, two thin bands near its foot; the Corinthian capital: an
 * astragal, a bell wrapped in two rows of acanthus leaves, corner volutes
 * under a concave-sided abacus, and an iron railing round its top.
 *
 * Measured (USGS lidar USGS_LPC_MO_StLouis_2017_LAS_2018, flown 2017–18,
 * 0.5 m grid, above the ground round the pedestal, which is level): the
 * abacus 47.0–47.4 over a square about 6.6 m across; a hatch at its centre
 * 47.8; the pedestal 4–5 and the base mouldings to about 6.
 * Published: 154 ft (47 m) (St. Louis Cultural Resources Office; OSM
 * height 47).
 * Estimated from the photos (scaled from the lidar's 47.2 m abacus and its
 * 6.6 m width, "STL North Grand Water Tower.JPG" straight on at 17.6 px/m):
 * the pedestal (4.0 m), the base mouldings (4.0–6.3), the shaft (4.2 m
 * across at the foot, 3.7 under the capital), the bands (8.4, 9.8), the
 * capital (necking 41.0, leaves to 44.8, volutes 45–46.2), the railing
 * (0.8 m, drawn as a thin solid band with posts).
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *   - "STL North Grand Water Tower.JPG", Onegentlemanofverona, CC BY 3.0,
 *     https://commons.wikimedia.org/wiki/File:STL_North_Grand_Water_Tower.JPG
 *     (the whole column straight on);
 *   - "Grand Avenue Water Tower, Grand Avenue and North 20th Street, College
 *     Hill, St. Louis, MO.jpg", w_lemay, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:Grand_Avenue_Water_Tower,_Grand_Avenue_and_North_20th_Street,_College_Hill,_St._Louis,_MO.jpg
 *     (from the foot: the octagonal pedestal, the base, the capital close);
 *   - "Grand Avenue Water Tower and Bissell Street Water Tower from Grand
 *     Avenue, College Hill, St. Louis, MO.jpg", w_lemay, CC BY-SA 2.0
 *     (the column in its street; the Bissell tower behind).
 *
 * Night: floodlit white.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { revolve, save } from './atl-tech-tower'

const white = new Part(), iron = new Part(), shade = new Part()
const C: [number, number] = [-0.3, 0.0]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]

// The octagonal pedestal and its cornice.
revolve(white, C, [[3.85, 0], [3.85, 3.5], [4.05, 3.6], [4.15, 3.85], [4.0, 4.0], [3.3, 4.0]], 8, Math.PI / 8, true, false)
// The Attic base: plinth, lower torus, scotia, upper torus, fillet.
revolve(white, C, [[3.3, 4.0], [3.1, 4.0], [3.1, 4.45], [3.2, 4.75], [3.05, 5.15], [2.6, 5.3], [2.45, 5.55], [2.7, 5.8], [2.55, 6.1], [2.25, 6.2], [2.15, 6.35]], 16, 0, false, false)
// The shaft, tapering 4.2 → 3.7 m, with two bands near the foot.
revolve(white, C, [[2.1, 6.35], [2.09, 8.25], [2.16, 8.3], [2.16, 8.55], [2.09, 8.6], [2.08, 9.65], [2.15, 9.7], [2.15, 9.95], [2.08, 10.0], [1.85, 40.9]], 16, 0, false, false)
// The capital: astragal, the bell, the abacus.
revolve(white, C, [[1.85, 40.9], [2.05, 41.0], [2.05, 41.4], [1.85, 41.45]], 16, 0, false, false)
// the bell behind the leaves, in shadow, so the leaves read
revolve(shade, C, [[1.85, 41.45], [1.9, 43.0], [2.1, 44.6], [2.5, 45.6], [2.9, 46.2], [0.01, 46.2]], 16, 0, false, false)

// Acanthus: two rows of eight bold leaves, each a slab curling out from the bell.
function leaf(a: number, z0: number, z1: number, w: number, out: number) {
  const d: V3 = [Math.cos(a), Math.sin(a), 0], t: V3 = [-Math.sin(a), Math.cos(a), 0]
  const r0 = 1.95, base: V3 = [C[0] + d[0] * r0, C[1] + d[1] * r0, z0]
  const tip = add([C[0] + d[0] * (r0 + out), C[1] + d[1] * (r0 + out), z1], [0, 0, 0])
  const mid = add([C[0] + d[0] * (r0 + out * 0.45), C[1] + d[1] * (r0 + out * 0.45), (z0 + z1) * 0.5 + 0.2], [0, 0, 0])
  const L = add(base, mul(t, -w / 2)), Rr = add(base, mul(t, w / 2)), ML = add(mid, mul(t, -w * 0.55)), MR = add(mid, mul(t, w * 0.55))
  white.quad(L, Rr, MR, ML) // the leaf's face, out
  white.quad(ML, MR, tip, tip)
  white.quad(Rr, L, ML, MR) // its back
  white.quad(MR, ML, tip, tip)
}
for (let i = 0; i < 8; i++) {
  const a = (i / 8) * 2 * Math.PI + Math.PI / 8
  leaf(a, 41.4, 43.9, 1.75, 1.05)
  leaf(a + Math.PI / 8, 42.8, 45.4, 1.75, 1.3)
}
// The corner volutes: a scroll block under each corner of the abacus.
for (let i = 0; i < 4; i++) {
  const a = (i / 4) * 2 * Math.PI + Math.PI / 4
  revolve(white, [C[0] + Math.cos(a) * 3.2, C[1] + Math.sin(a) * 3.2], [[0.01, 44.7], [0.55, 44.8], [0.85, 45.45], [0.6, 46.1], [0.01, 46.2]], 10)
}
// The abacus: a square with concave sides, drawn as a square with chamfered
// corners, 6.6 m across, and its moulded edge.
{
  const h = 3.3, c = 0.7
  const ring: [number, number][] = [[-h + c, -h], [h - c, -h], [h, -h + c], [h, h - c], [h - c, h], [-h + c, h], [-h, h - c], [-h, -h + c]]
  const P = (p: [number, number], z: number, k = 1): V3 => [C[0] + p[0] * k, C[1] + p[1] * k, z]
  for (let i = 0; i < 8; i++) {
    const a = ring[i], b = ring[(i + 1) % 8]
    const n: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
    void n
    white.quad(P(a, 46.2, 0.92), P(b, 46.2, 0.92), P(b, 46.65), P(a, 46.65))
    white.quad(P(a, 46.65), P(b, 46.65), P(b, 47.2), P(a, 47.2))
  }
  for (let i = 1; i < 7; i++) white.tri(P(ring[0], 47.2), P(ring[i], 47.2), P(ring[i + 1], 47.2))
  // the railing: a thin dark band on posts round the top, and the hatch
  for (let i = 0; i < 8; i++) {
    const a = ring[i], b = ring[(i + 1) % 8]
    iron.quad(P(a, 47.75, 0.96), P(b, 47.75, 0.96), P(b, 47.95, 0.96), P(a, 47.95, 0.96))
    const q = P(a, 47.2, 0.96)
    iron.quad([q[0] - 0.06, q[1], 47.2], [q[0] + 0.06, q[1], 47.2], [q[0] + 0.06, q[1], 47.8], [q[0] - 0.06, q[1], 47.8])
  }
  revolve(white, C, [[0.9, 47.2], [0.9, 47.8], [0.01, 47.8]], 8)
}

const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.15 : 0.85)
await save('stl-grand-water-tower', 'Grand Avenue Water Tower', [
  { part: white, material: { ...finish('grand-tower-white', 0xf2f0ea), floodlight: lit } },
  { part: shade, material: finish('grand-tower-shadow', 0xbdbab1) },
  { part: iron, material: { ...finish('grand-tower-railing', 0x4a4f57), doubleSided: true } },
], { height: 47.95, anchor: [38.670465, -90.2085226], bearing: 0, osm: 'way/238580241' }, 5000)
