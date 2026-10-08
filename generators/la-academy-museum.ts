/**
 * Academy Museum of Motion Pictures, Wilshire Blvd at Fairfax, Los Angeles:
 * the Saban Building (former May Company, Albert C. Martin and Samuel Marx,
 * 1939) and Renzo Piano's sphere (David Geffen Theater, 2021) behind it,
 * linked by glass bridges — one model for both. Original procedural
 * geometry, CC0-1.0.
 * bun generators/la-academy-museum.ts [out.glb]
 *
 * Map frame before placement: u along Wilshire (east), v toward the north,
 * z up, metres; origin at the area centroid of the Saban outline
 * (way/426357430: -118.3607923, 34.0632679), on the ground (flat, 3DEP and
 * lidar ~50.8 m). Placed at bearing 7.8°, Wilshire's rotation here.
 *
 * Identity: the pale limestone box with the gold-tiled cylinder on the
 * Wilshire/Fairfax corner, framed by tall black granite slabs; the black
 * granite base; and the sphere, concrete below and a glass dome above.
 *
 * Sources:
 * - Plan: OSM way/426357430 (Saban, 3,862 m2; height 34.8), way/1360732450
 *   (Sphere Building, height 39.6) with its parts 1360732451 (dome, a
 *   circle ~42.6 m across), 913293589, 1113417080 (the base between the
 *   sphere and the Saban) and 1113417081.
 * - Heights: LA County lidar DSM (LARIAC, 2.5 m grid, sampled 2026): ground
 *   50.8 m; Saban south range 23.5 m, north range 28 m, central penthouse
 *   34 m; the corner frame ~29 m; a 5–8 m canopy at the corner. The lidar
 *   predates the sphere; its 39.6 m is OSM's height.
 * - Photos (Wikimedia Commons): a5 "The May Company Building 2021"
 *   (Downtowngal, CC BY-SA 4.0; the corner from the south-west across
 *   Wilshire/Fairfax: gold cylinder, black frame, window rows, black base);
 *   a6 "Academy Museum (51378465751)" (Eden, Janine and Jim, CC BY 2.0;
 *   corner from the south-east); a1 "The Sphere Academy Museum 2021" and
 *   a2 "Sphere of the Academy Museum of Motion Pictures" (Downtowngal, CC
 *   BY-SA 4.0; the sphere from the north-west and north-east: concrete
 *   lower half, glass dome, bridges and stair tower to the Saban);
 *   a3 "Academy Museum of Motion Pictures (February 2025)" (Fred
 *   Cherrygarden, CC BY-SA 4.0; the glazed north face and a bridge).
 *
 * Estimated: the cylinder (7.7 m radius, on the outline's rounded corner) and the
 * frame slabs (a5), the window panels (one per bay, two floors tall, after
 * a5's rows), the sphere's centre height (radius 21 m from OSM, top at 39.6
 * m, so it sinks a little into the ground as it seems to behind the fence
 * in a2), the glass dome starting just above the equator, the bridges'
 * levels (a1). Left out: the stair tower, the ACADEMY MUSEUM lettering on
 * the frame, the gold tiles' banding, the sphere's panel joints and the
 * dome's steel grid.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, block, capRing, ccw, offset, panel, at, type XY } from './la-lacma-geffen'

const stone = new Part(), granite = new Part(), gold = new Part(), win = new Part(), concrete = new Part(), glass = new Part()

const SABAN: XY[] = ccw([[-4.6, 26.3], [21.3, 26.4], [21.7, 25.4], [28.9, 25.4], [29.6, 25.0], [30.0, 24.4], [32.9, 5.2], [33.6, 4.8], [33.9, 1.9], [33.3, 1.2], [35.3, -12.0], [36.2, -11.9], [37.1, -12.2], [37.7, -13.1], [38.4, -16.5], [38.0, -18.6], [36.9, -21.0], [34.8, -22.8], [32.3, -23.8], [-35.0, -23.9], [-38.0, -22.9], [-40.2, -21.0], [-41.5, -18.7], [-42.1, -16.4], [-46.3, 19.8], [-46.1, 20.7], [-45.3, 21.4], [-43.9, 21.6], [-44.1, 23.3], [-43.5, 24.7], [-42.3, 25.3], [-35.1, 25.3], [-34.8, 25.9], [-33.7, 26.4], [-24.7, 26.3], [-22.0, 26.3], [-10.8, 26.4], [-9.0, 26.3]])
const LOW = 23.5, HIGH = 28, PENT = 34

// ---------- the Saban: the 23.5 m body, the 28 m north range, penthouse ----------
block(stone, concrete, SABAN, 0, LOW, 0.45)
const NORTH: XY[] = ccw([[-43.4, -5], [34.3, -5], [32.9, 5.2], [30.0, 24.4], [29.6, 25.0], [21.7, 25.4], [21.3, 26.4], [-33.7, 26.4], [-42.3, 25.3], [-43.5, 24.7], [-44.1, 23.3], [-46.3, 19.8]])
block(stone, concrete, offset(NORTH, 0.6), LOW, HIGH, 0.4)
block(concrete, concrete, [[-12, 7], [10, 7], [10, 18], [-12, 18]], HIGH, PENT, 0.4)

// ---------- facades ----------
// Street faces (Wilshire south, Fairfax west): a black granite base with
// shop windows, then two rows of window panels, two floors each (a5). The
// north face is the new glass wall onto the piazza (a3). The east face has
// the same window rows.
const CYL: XY = [-35.1, -16.4], CR = 7.7
for (let i = 0; i < SABAN.length; i++) {
  const a = SABAN[i], b = SABAN[(i + 1) % SABAN.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 9) continue
  const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L] // outward for a CCW ring: (dy, -dx)
  const south = n[1] < -0.7, west = n[0] < -0.7, north = n[1] > 0.7
  if (north) {
    // glass wall with trim lines every two floors
    panel(win, a, b, 1.2, L - 1.2, 0.8, HIGH - 1.4)
    for (const z of [7.4, 14.2, 21.0]) panel(stone, a, b, 1.2, L - 1.2, z, z + 0.7, 0.09)
    continue
  }
  // keep clear of the corner cylinder
  const dA = Math.hypot(a[0] - CYL[0], a[1] - CYL[1]), dB = Math.hypot(b[0] - CYL[0], b[1] - CYL[1])
  const s0 = dA < 12 ? 9.5 : 1.5, s1 = dB < 12 ? L - 9.5 : L - 1.5
  if (south || west) {
    panel(granite, a, b, s0 - 1.0, s1 + 1.0, 0, 5.6, 0.08)
    const bays = Math.floor((s1 - s0) / 6.5)
    const m = (s1 - s0 - bays * 6.5) / 2
    for (let k = 0; k < bays; k++) panel(win, a, b, s0 + m + k * 6.5 + 1.0, s0 + m + (k + 1) * 6.5 - 1.0, 0.8, 4.4, 0.14)
  }
  const bays = Math.floor((s1 - s0) / 6.2)
  const m = (s1 - s0 - bays * 6.2) / 2
  for (let k = 0; k < bays; k++) {
    const u0 = s0 + m + k * 6.2 + 1.3, u1 = s0 + m + (k + 1) * 6.2 - 1.3
    for (const [z0, z1] of [[7.2, 13.0], [14.6, 20.6]]) panel(win, a, b, u0, u1, z0, z1)
  }
}

// ---------- the corner: gold cylinder between black granite slabs ----------
{
  const N = 16, z0 = 5.6, z1 = 28.4
  // the cylinder: the side facing the street, on a black drum at the base
  for (let i = 0; i < N; i++) {
    const t0 = (i / N) * 2 * Math.PI, t1 = ((i + 1) / N) * 2 * Math.PI
    const p = (t: number, r: number): XY => [CYL[0] + r * Math.cos(t), CYL[1] + r * Math.sin(t)]
    const nn = (t: number): V3 => [Math.cos(t), Math.sin(t), 0]
    gold.tri(at(p(t0, CR), z0), at(p(t1, CR), z0), at(p(t1, CR), z1), undefined, undefined, undefined, [nn(t0), nn(t1), nn(t1)])
    gold.tri(at(p(t0, CR), z0), at(p(t1, CR), z1), at(p(t0, CR), z1), undefined, undefined, undefined, [nn(t0), nn(t1), nn(t0)])
    granite.quad(at(p(t0, CR + 0.4), 0), at(p(t1, CR + 0.4), 0), at(p(t1, CR + 0.4), z0), at(p(t0, CR + 0.4), z0))
    granite.quad(at(p(t0, CR + 0.4), z0), at(p(t1, CR + 0.4), z0), at(p(t1, CR), z0), at(p(t0, CR), z0))
    concrete.tri(at(CYL, z1), at(p(t0, CR), z1), at(p(t1, CR), z1))
  }
  // the two frame slabs, one on each street face beside the cylinder, their
  // tops sweeping up toward the street (a5: the concave black frame)
  const slab = (c: XY, t: XY, depth: number, w: number) => {
    // c: foot on the facade, t: unit along the facade, depth: out of the wall
    const o: XY = [-t[1], t[0]] // inward
    const P = (s: number, d: number): XY => [c[0] + t[0] * s + o[0] * d, c[1] + t[1] * s + o[1] * d]
    const ring: XY[] = ccw([P(-w, -depth), P(w, -depth), P(w, 9), P(-w, 9)])
    const zt = (p: XY) => {
      const d = (p[0] - c[0]) * o[0] + (p[1] - c[1]) * o[1]
      return d < 0 ? 32.0 : 29.0
    }
    for (let i = 0; i < 4; i++) {
      const a = ring[i], b = ring[(i + 1) % 4]
      granite.quad(at(a, 0), at(b, 0), at(b, zt(b)), at(a, zt(a)))
    }
    granite.quad(at(ring[0], zt(ring[0])), at(ring[1], zt(ring[1])), at(ring[2], zt(ring[2])), at(ring[3], zt(ring[3])))
  }
  slab([-27.4, -23.9], [1, 0], 1.8, 1.5)                      // on Wilshire, east of the cylinder
  slab([-43.2, -8.4], [0.115, -0.993], 1.8, 1.5)              // on Fairfax, north of it
}

// ---------- the sphere ----------
// Radius 21.3 m (OSM dome circle), top at 39.6 m; concrete below, a glass
// dome from just above the equator (a1, a2).
{
  const C: XY = [-7.2, 63.5], R = 21.3, ZC = 39.6 - R, NU = 16, NV = 12
  const pt = (lat: number, lon: number, r: number): V3 => [C[0] + r * Math.cos(lat) * Math.cos(lon), C[1] + r * Math.cos(lat) * Math.sin(lon), ZC + r * Math.sin(lat)]
  const nrm = (lat: number, lon: number): V3 => [Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat)]
  const latMin = Math.asin(-ZC / R) // where the sphere meets the ground
  const band = (part: Part, la0: number, la1: number, r: number) => {
    for (let i = 0; i < NU; i++) {
      const l0 = (i / NU) * 2 * Math.PI, l1 = ((i + 1) / NU) * 2 * Math.PI
      const A = pt(la0, l0, r), B = pt(la0, l1, r), Cc = pt(la1, l1, r), D = pt(la1, l0, r)
      part.tri(A, B, Cc, undefined, undefined, undefined, [nrm(la0, l0), nrm(la0, l1), nrm(la1, l1)])
      if (la1 < Math.PI / 2 - 1e-6) part.tri(A, Cc, D, undefined, undefined, undefined, [nrm(la0, l0), nrm(la1, l1), nrm(la1, l0)])
    }
  }
  const SPLIT = 0.16 // ~9° above the equator
  const lats = (a: number, b: number, n: number) => Array.from({ length: n + 1 }, (_, k) => a + (b - a) * k / n)
  const lc = lats(latMin, SPLIT, 6)
  for (let k = 0; k < lc.length - 1; k++) band(concrete, lc[k], lc[k + 1], R)
  const lg = lats(SPLIT - 0.03, Math.PI / 2, NV - 6)
  for (let k = 0; k < lg.length - 1; k++) band(glass, lg[k], lg[k + 1], R + 0.4)

  // the base between the sphere and the Saban (part 1113417080), low and
  // concrete
  block(concrete, concrete, [[-24.6, 37.6], [11.5, 37.4], [11.0, 47], [-24.5, 47]], 0, 6.0, 0.3)

  // two glass bridges from the Saban's north face to the sphere (a1, a3)
  for (const [u, z] of [[-14, 12.5], [-2, 18.5]] as [number, number][]) {
    const v0 = 26.4, v1 = 43.5, w = 2.0, h = 3.6
    const r: XY[] = [[u - w, v0], [u + w, v0], [u + w, v1], [u - w, v1]]
    for (let i = 0; i < 4; i++) {
      const a = r[i], b = r[(i + 1) % 4]
      glass.quad(at(a, z), at(b, z), at(b, z + h), at(a, z + h))
    }
    capRing(concrete, r, z + h, true)
    capRing(concrete, r, z, false)
  }
}

const parts = [
  { part: stone, material: finish('saban-limestone', 0xeee5d4) },
  { part: granite, material: finish('saban-granite', 0x4a4f57) },
  { part: gold, material: finish('saban-gold', 0xdcbd6c, 0.5) },
  { part: win, material: PALETTE.window },
  { part: concrete, material: finish('academy-concrete', 0xc9cac6) },
  { part: glass, material: { ...PALETTE.glass, color: 0xc3d3de } }, // the dome reads silvery (a1, a2)
]
if (import.meta.main) {
  const { glb, triangles } = finishModel('la-academy-museum', 'Academy Museum of Motion Pictures', parts, {
    bearing: 7.8, height: 39.6,
    replaces: ['way/426357430', 'way/1360732450', 'way/1360732451', 'way/913293589', 'way/1113417080', 'way/1113417081'],
  })
  const out = process.argv[2] ?? new URL('../models/la-academy-museum.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
