/**
 * Estadio Azteca (Estadio Banorte; 1966, Pedro Ramírez Vázquez and Rafael
 * Mijares Alcérreca, structure Óscar de Buen; renovated 2024–26 for the 2026
 * World Cup), Santa Úrsula, Coyoacán, Mexico City — original procedural
 * geometry, CC0-1.0, no textures.
 *   bun generators/mexico-city-estadio-azteca.ts
 *
 * State modelled: as reopened for the 2026 World Cup (drone photos of
 * May 2026): the new red membrane fascia wrapping the roof rim, the white
 * tubular roof trusses, the original raking concrete columns.
 *
 * Map frame: x east, y north, z up, metres. z = 0 is the field (the field
 * wall's foot). Anchor = area centroid of the stadium outline way/4758704
 * (19.302934, -99.150474). Bearing 6: the field's axis (OSM minimum
 * rectangle of the outline and of the field-wall ring, 5–6°).
 *
 * Identity, in order: the huge rounded-square bowl under a continuous red
 * fascia band; the ring of ~60 tall raking concrete columns, their heads
 * bending outward to carry the fascia, with the concourse floors and glazed
 * levels between them; the roof ring with radial white trusses and the
 * opening over the field; inside, the steep two-tier bowl (lower tier, the
 * glass fronts of the palcos, the steep upper tier under the roof).
 *
 * Evidence
 * - OSM: way/4758704 (leisure=stadium, the outline: 228 × 261 m), building
 *   multipolygons relation/8774593 (outline minus the field-wall ring
 *   way/630629268, 103 × 137 m) and relation/9715516 (minus way/118934910,
 *   130 × 221 m). Each ring was fitted with a symmetric superellipse in the
 *   turned frame: outline a 114, b 130.5, n 3.0 (rms 0.5 m); field wall
 *   51.4 / 68.6 / 5.2 (rms 1.0 m). The roof opening is NOT way/118934910:
 *   the May 2026 aerial (a07, below) shows the opening at 0.70 of the
 *   outline's length and 0.58 of its width, so the opening is 65 / 91 /
 *   2.6 (estimated; OSM's ring, 110 m half-length, is taken to be the lip
 *   of the upper tier). Published cantilevers ("20 to 50 m") fit the sides
 *   (49 m) but not the ends (39 m here): the photo was followed.
 * - Published (es.wikipedia "Estadio Azteca"; Excélsior / ADN40 renovation
 *   coverage 2025–26): field 9.5 m below the street ("imposible bajar más
 *   allá de los 9.5 metros", the groundwater limit) → elevation −9.5;
 *   steel roof of 1,200 t; capacity 87,000 after the renovation; new
 *   membrane façade on the upper ring with lighting (2026).
 * - Heights (estimated from photos; no lidar in Mexico, no published
 *   height): scaled from the column bay (~13 m: ~60 columns round the
 *   ~790 m perimeter, counted on a07/a08) on ProtoplasmaKid's east drone
 *   view (a08): column from the moat to the fascia foot ≈ 3 bays ≈ 40 m,
 *   fascia ≈ 0.7 bay ≈ 9–10 m. So the fascia runs from z 43 to 53 (43.5 m
 *   above the street), the roof top rises from 47 m at the opening to the
 *   rim; upper tier back 48.5 m; palcos glass 15–23.5 m; lower tier to
 *   15 m. Concourse floors at about 37, 28.5, 20 m and the street-level
 *   podium (10.3 m) from the photo's horizontal bands.
 * - Terrain: Mapterhorn has no z15 tiles here (tools/terrain.ts 404s), so
 *   the site could not be read; the Pedregal around the stadium is gently
 *   sloping. Elevation −9.5 (published field depth) puts the street-level
 *   parts on the street; the columns run on down into the moat round the
 *   stadium (visible in a07), hidden by the map below street level.
 * - Photos (Wikimedia Commons; EVIDENCE):
 *   a07 ProtoplasmaKid, "Vista aérea del Estadio Azteca - 2026 - 19.jpg",
 *     CC BY 4.0, 2026-05-14 (aerial from the east-south-east: plan, roof,
 *     opening, fascia);
 *   a08 ProtoplasmaKid, "Vista aérea del Estadio Azteca - 2026 - 02.jpg",
 *     CC BY 4.0, 2026-05-14 (east façade, columns, fascia, trusses);
 *   a00–a06 ProtoplasmaKid, "Estadio Azteca 2026 - 01…08.jpg", CC BY 4.0,
 *     2026-05-13 (night: lit concourse bands, red rim, the floodlit bowl);
 *   a09–a13 Arne Müseler, "Mexico city Estadio Azteca estadio banorte fifa
 *     world cup 2026 1–5.JPG", CC BY-SA 3.0 de, 2026-01-29 (mid-works,
 *     before the red membrane: the bowl, columns and roof from the air);
 *   a14 ProtoplasmaKid, "Estadio Azteca (detalle).jpg", CC BY-SA 4.0, 2015
 *     (the columns' heads leaning out, from the street);
 *   a15 AnatGutman, "Interior Estadio Azteca CDMX.jpg", CC0, 2017 (tiers);
 *   a17 "Estadio Azteca desde el aire 1.jpg", CC BY-SA 4.0, 2024.
 * - Look-only: none.
 * Colours from the 2026 daylight photos: red membrane #c8453c (pulled from
 *   ~#d8242a), pale concrete, pale grey roof, dark grey lower-tier seats,
 *   pale grey upper-tier seats (roof colour), white trusses and the white
 *   street-level cladding (`trim`).
 * Night: the concourse glazing is `window` (the lit bands in the night
 *   photos); the red fascia and the bowl's seats carry `_FLOODLIGHT`.
 * Left out: the "ESTADIO BANORTE" sign and logo over the east entrance
 *   (not the landmark), the LED screens, the trusses' lattice (drawn as
 *   solid A-section ribs), the access ramps between the columns, the moat
 *   and plaza, Calder's "Sol Rojo" (a separate sculpture), the pitch.
 * Doubts: all heights are photo-scaled (±3 m); the roof opening's
 *   length (photo vs OSM); the column count (60, ±4).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { quad } from './dc-nationals-park'
import { save } from './chi-aon-center'

// ---------------------------------------------------------------------------
// Shared bowl kit (also used by mexico-city-estadio-olimpico-universitario.ts).

/** A superellipse |x/a|^n + |y/b|^n = 1: radius along the ray at angle t (radians, from +x, ccw). */
export const se = (a: number, b: number, n: number) => (t: number) =>
  Math.pow(Math.pow(Math.abs(Math.cos(t)) / a, n) + Math.pow(Math.abs(Math.sin(t)) / b, n), -1 / n)

/** Ray angles round a closed curve, spaced evenly by arc length along it. */
export function arcAngles(r: (t: number) => number, K: number, t0 = 0): number[] {
  const M = 2000, pts: [number, number][] = [], acc = [0]
  for (let i = 0; i <= M; i++) { const t = t0 + (i / M) * 2 * Math.PI; pts.push([Math.cos(t) * r(t), Math.sin(t) * r(t)]) }
  for (let i = 1; i <= M; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const L = acc[M], out: number[] = []
  let j = 0
  for (let k = 0; k < K; k++) {
    const s = (k / K) * L
    while (acc[j + 1] < s) j++
    const f = (s - acc[j]) / (acc[j + 1] - acc[j] || 1)
    out.push(t0 + ((j + f) / M) * 2 * Math.PI)
  }
  return out
}

/** One profile point: radius as a function of the ray index, height, and the part of the edge to the next point. */
export type Prof = { r: (k: number) => number; z: number | ((k: number) => number); part: Part | null }

/**
 * Loft a section profile round closed rays `T`. Points are listed so the
 * outside of each edge lies left of travel in the (r, z) plane (outward and
 * up = a surface facing up and in). Smooth across rays, sharp between edges.
 */
export function loftRing(T: number[], prof: Prof[], closed = true, kRange?: [number, number]) {
  const K = T.length
  const P = (i: number, k: number): V3 => {
    const kk = closed ? ((k % K) + K) % K : Math.max(0, Math.min(K - 1, k)), r = prof[i].r(kk), z = prof[i].z
    return [Math.cos(T[kk]) * r, Math.sin(T[kk]) * r, typeof z === 'number' ? z : z(kk)]
  }
  const N = (i: number, k: number): V3 => { // outward plan normal of ring i at ray k
    const a = P(i, closed || k > 0 ? k - 1 : k), b = P(i, closed || k < K - 1 ? k + 1 : k), tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1
    return [ty / l, -tx / l, 0]
  }
  const [k0, k1] = kRange ?? [0, closed ? K : K - 1]
  for (let i = 0; i < prof.length - 1; i++) {
    const part = prof[i].part
    if (!part) continue
    for (let k = k0; k < k1; k++) {
      const a = P(i, k), b = P(i, k + 1), c = P(i + 1, k + 1), d = P(i + 1, k)
      const nrm = (kk: number, p: V3, q: V3): V3 => {
        const n = N(i, kk), dh = (q[0] - p[0]) * n[0] + (q[1] - p[1]) * n[1], dz = q[2] - p[2]
        const v: V3 = [-dz * n[0], -dz * n[1], dh], l = Math.hypot(...v) || 1
        return [v[0] / l, v[1] / l, v[2] / l]
      }
      const na = nrm(k, a, d), nb = nrm(k + 1, b, c)
      if (Math.hypot(d[0] - a[0], d[1] - a[1], d[2] - a[2]) < 1e-6 && Math.hypot(c[0] - b[0], c[1] - b[1], c[2] - b[2]) < 1e-6) continue
      quad(part, [a, b, c, d], [(na[0] + nb[0]) / 2, (na[1] + nb[1]) / 2, (na[2] + nb[2]) / 2], [na, nb, nb, na])
    }
  }
}

/** A convex hexahedron from 4 bottom and 4 top corners (same order); faces wound outward, flat shaded. */
export function hexa(p: Part, bot: V3[], top: V3[], bottom = false) {
  const c: V3 = [0, 0, 0]
  for (const q of [...bot, ...top]) for (let i = 0; i < 3; i++) c[i] += q[i] / 8
  const face = (Q: V3[]) => {
    const m: V3 = [0, 0, 0]
    for (const q of Q) for (let i = 0; i < 3; i++) m[i] += q[i] / Q.length
    quad(p, Q, [m[0] - c[0], m[1] - c[1], m[2] - c[2]])
  }
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; face([bot[i], bot[j], top[j], top[i]]) }
  face(top)
  if (bottom) face(bot)
}

/** A point on ray angle t at radius r, height z. */
export const at = (t: number, r: number, z: number): V3 => [Math.cos(t) * r, Math.sin(t) * r, z]

/** Outward plan normal of the curve r(t) at t. */
export function curveNormal(r: (t: number) => number, t: number): [number, number] {
  const e = 1e-3, a = [Math.cos(t - e) * r(t - e), Math.sin(t - e) * r(t - e)], b = [Math.cos(t + e) * r(t + e), Math.sin(t + e) * r(t + e)]
  const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty)
  return [ty / l, -tx / l]
}

// ---------------------------------------------------------------------------
// Estadio Azteca

export const ANCHOR: [number, number] = [-99.150474, 19.302934]
export const BEARING = 6

function build() {
  const concrete = new Part(), red = new Part(), roof = new Part(), white = new Part(), seats = new Part(), win = new Part()

  // Plan (OSM, fitted in the turned frame): outer edge of the fascia, field wall, roof opening.
  const RO = se(114, 130.5, 3.0)
  const RF = se(51.4, 68.6, 5.2)
  const RI = se(65, 91, 2.6) // photo-measured; OSM way/118934910 (b 110.4) is the upper tier lip
  const K = 48, KB = 40
  const T = arcAngles(RO, K)
  const TB = arcAngles(RO, KB)
  const ro = (k: number) => RO(T[k]), ri = (k: number) => RI(T[k])
  const BACK = 10.5 // the enclosure wall stands this far inside the fascia line
  const rb = (k: number) => ro(k) - BACK
  const C = (d: number) => (k: number) => ro(k) - d
  const Z = { top: 53, fasciaFoot: 41, roofIn: 47, back: 48.5 }

  // --- The bowl, from the field wall up the two tiers to the back wall.
  const SB = (s: number) => (k: number) => RF(TB[k]) + s * (RO(TB[k]) - BACK - RF(TB[k]))
  const prof: Prof[] = [{ r: SB(0), z: 0, part: concrete }, { r: SB(0), z: 2.5, part: seats }]
  const rake = (s0: number, z0: number, s1: number, z1: number, n: number, tread: Part, last: Part | null) => {
    for (let i = 1; i <= n; i++) {
      const s = s0 + ((s1 - s0) * i) / n, z = z0 + ((z1 - z0) * i) / n
      prof.push({ r: SB(s), z: z - 1.2, part: concrete }, { r: SB(s), z, part: i === n ? last : tread })
    }
  }
  rake(0, 2.5, 0.4, 15, 3, seats, concrete) // lower tier: dark grey and red seats
  prof.push({ r: SB(0.43), z: 15, part: win }) // walkway, then the glass fronts of the palcos
  prof.push({ r: SB(0.43), z: 23.5, part: concrete })
  prof.push({ r: SB(0.43), z: 25, part: concrete })
  prof.push({ r: SB(0.46), z: 25, part: seats })
  rake(0.46, 25, 1, Z.back, 4, seats, concrete) // upper tier, in the roof's shade
  prof.push({ r: SB(1), z: 50.5, part: null })
  loftRing(TB, prof)

  // --- The outside: the enclosure wall behind the columns, with the
  // concourse floors projecting as slab lips and glass between them.
  const LIP = C(8)
  const ext: Prof[] = [{ r: rb, z: 50.5, part: concrete }, { r: rb, z: 43.5, part: win }] // under the fascia: the top concourse
  for (const [z, below] of [[37.5, win], [29, win], [20.5, white]] as [number, Part][]) {
    ext.push({ r: rb, z, part: concrete }, { r: rb, z: z - 0.4, part: concrete }, { r: LIP, z: z - 0.4, part: concrete }, { r: LIP, z: z - 1.4, part: concrete }, { r: rb, z: z - 1.4, part: below })
  }
  ext.push({ r: rb, z: 10.3, part: concrete }, { r: LIP, z: 10.3, part: concrete }, { r: LIP, z: 3, part: null })
  loftRing(T, ext)

  // --- Roof: the inner edge, the roof top rising to the red fascia (which
  // leans out), its foot, and the underside back to the inner edge.
  const mixR = (f: number) => (k: number) => ri(k) + f * (ro(k) - 3 - ri(k))
  const roofProf: Prof[] = [
    { r: ri, z: Z.roofIn - 2.8, part: concrete }, // the inner edge band
    { r: ri, z: Z.roofIn, part: roof },
    { r: mixR(0.35), z: 49.6, part: roof },
    { r: mixR(0.7), z: 51.6, part: roof },
    { r: C(3), z: Z.top - 0.3, part: red }, // the membrane wraps over the rim
    { r: C(0.6), z: Z.top, part: red },
    { r: C(0), z: Z.top, part: red },
    { r: C(1.6), z: Z.fasciaFoot, part: red },
    { r: C(4.5), z: Z.fasciaFoot, part: concrete },
    { r: C(4.5), z: 50.6, part: roof },
    { r: ri, z: Z.roofIn - 2.8, part: null },
  ]
  loftRing(T, roofProf)
  const roofZ = (k: number, r: number) => { // height of the roof top along ray k
    const pts = roofProf.slice(1, 6).map((p) => [p.r(k), p.z as number])
    for (let i = 0; i < pts.length - 1; i++) if (r <= pts[i + 1][0]) return pts[i][1] + ((r - pts[i][0]) / (pts[i + 1][0] - pts[i][0])) * (pts[i + 1][1] - pts[i][1])
    return pts[pts.length - 1][1]
  }

  // --- The white tubular roof trusses: a radial truss over every column,
  // drawn as a solid A-section rib.
  const NC = 60 // columns round the bowl (photos: ~13 m bays)
  const TC = arcAngles(RO, NC, Math.PI / NC)
  const nearest = (t: number) => T.reduce((b, tt, i) => (Math.abs(Math.atan2(Math.sin(tt - t), Math.cos(tt - t))) < Math.abs(Math.atan2(Math.sin(T[b] - t), Math.cos(T[b] - t))) ? i : b), 0)
  const rib = (t: number, rA: number, rB: number, h: number, w: number, steps: number) => {
    const k = nearest(t)
    const sec = (r: number): V3[] => {
      const z = roofZ(k, r) - 0.1, nx = -Math.sin(t), ny = Math.cos(t)
      const c = at(t, r, z)
      return [[c[0] - nx * w, c[1] - ny * w, z], [c[0], c[1], z + h], [c[0] + nx * w, c[1] + ny * w, z]]
    }
    for (let i = 0; i < steps; i++) {
      const A = sec(rA + ((rB - rA) * i) / steps), B = sec(rA + ((rB - rA) * (i + 1)) / steps)
      quad(white, [A[0], B[0], B[1], A[1]], sub3(mid3(A[0], B[0]), mid3(A[2], B[2])))
      quad(white, [A[1], B[1], B[2], A[2]], sub3(mid3(A[2], B[2]), mid3(A[0], B[0])))
      if (i === 0) { const o = sub3(A[1], B[1]); quad(white, [A[0], A[1], A[2], A[2]], [o[0], o[1], 0]) }
      if (i === steps - 1) { const o = sub3(B[1], A[1]); quad(white, [B[0], B[1], B[2], B[2]], [o[0], o[1], 0]) }
    }
  }
  for (const t of TC) rib(t, RI(t) + 0.8, RO(t) - 3.2, 2.4, 0.5, 2)
  // the ring truss along the roof's inner edge
  loftRing(T, ([] as Prof[]).concat([
    { r: (k) => ri(k) + 0.3, z: Z.roofIn + 0.05, part: white },
    { r: (k) => ri(k) + 1.2, z: Z.roofIn + 2.6, part: white },
    { r: (k) => ri(k) + 2.1, z: Z.roofIn + 0.4, part: null },
  ]))

  // --- The raking concrete columns: a shaft from the moat up the facade,
  // its head bending out to carry the foot of the fascia.
  for (let c = 0; c < NC; c++) {
    const t = TC[c], [nx, ny] = curveNormal(RO, t), tx = -ny, ty = nx
    const base = at(t, RO(t), 0)
    const P = (dn: number, dt: number, z: number): V3 => [base[0] + nx * dn + tx * dt, base[1] + ny * dn + ty * dt, z]
    const lv: [number, number][] = [[3, 0], [35, 3.6], [Z.fasciaFoot, 6.6]] // z, outward lean: the raking piers
    for (let i = 0; i < lv.length - 1; i++) {
      const [z0, l0] = lv[i], [z1, l1] = lv[i + 1]
      const ring = (z: number, l: number) => [P(-9.4 + l, -0.85, z), P(-9.4 + l, 0.85, z), P(-7.2 + l, 0.85, z), P(-7.2 + l, -0.85, z)]
      hexa(concrete, ring(z0, l0), ring(z1, l1))
    }
  }

  return [
    { part: concrete, material: finish('azteca-concrete', 0xd9d5cc) },
    { part: red, material: { ...finish('azteca-red', 0xc8453c), floodlight: (_p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.7) } },
    { part: roof, material: finish('azteca-roof', 0x80868c) },
    { part: white, material: PALETTE.trim },
    { part: seats, material: { ...finish('azteca-seats', 0x70747b), floodlight: (_p: V3, n: V3) => (n[2] > 0.3 ? 0.6 : 0.3) } },
    { part: win, material: { ...PALETTE.window, color: 0x55606b } }, // darker, recessive concourse glass
  ]
}
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const mid3 = (a: V3, b: V3): V3 => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]

if (import.meta.main) {
  const parts = build()
  for (const { part, material } of parts) console.log(material.name.padEnd(18), part.triangles)
  await save('mexico-city-estadio-azteca', 'Estadio Azteca', ANCHOR, BEARING, parts, 6500)
}
