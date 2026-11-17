/**
 * The California Building and California Tower (Museum of Us), Balboa Park,
 * San Diego. Bertram Goodhue with Carleton Winslow, 1915, for the
 * Panama-California Exposition; Spanish Baroque / Churrigueresque.
 *
 * Also the shared kit for this builder's Balboa Park models
 * (sd-botanical-building, sd-spreckels-organ-pavilion, sd-cabrillo-bridge,
 * sd-old-globe-theatre, sd-air-and-space-museum): the helpers below are
 * exported and the model is only built when this file is run directly.
 *
 * Frame: bearing 0 (the outline's walls run within 0.5° of north). +x east,
 * +y north, z up, metres; origin at the anchor -117.15238, 32.73174, which
 * is 0.5 m from the outline's area centroid. z = 0 is the lowest ground
 * under the footprint (the west side, lidar 5.0 m above the box's
 * ground_min); the Plaza de California in front of the south facade and the
 * tower's foot are 1.2–1.3 m higher.
 *
 * What it covers: the outline way/31240096 (California Building) with its
 * parts way/459305459 (California Tower) and way/459305460 (the dome's
 * octagon). The neighbouring ranges round the Plaza de California (the west
 * range with the small tiled dome, the east colonnade, the arcade link
 * way/1454788451 east of the tower) are other buildings and are not drawn.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): the outline, the tower square
 *   (10.5 × 10.2 m at x 10.0…20.6, y −16.5…−6.3) and the dome octagon
 *   (20 m across, centre 0.6, 3.1). Tower part height=60.
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014), 0.5 m grid, read in
 *   this frame (sd-california-tower/lidar.json).
 * - USGS NAIP orthophoto: the arms are pale barrel vaults; the dome's
 *   yellow lines on blue.
 * - Published: Wikipedia "California Building" / "Museum of Us": 1915,
 *   Goodhue; the tower 198 ft (60.4 m); NRHP (El Prado complex).
 * - HABS CA-1963-A (Library of Congress, public domain): "SOUTH (MAIN)
 *   FACADE - Balboa Park, California Tower …", photo A-2.
 *   https://commons.wikimedia.org/wiki/File:SOUTH_(MAIN)_FACADE_-_Balboa_Park,_California_Tower,_Balboa_Park,_El_Prado_Area,_San_Diego,_San_Diego_County,_CA_HABS_CAL,37-SANDI,16-A-2.tif
 * Photos (evidence, Wikimedia Commons):
 * - "California Bell Tower-2.jpg", Visitor7, CC BY-SA 3.0 (tower and dome
 *   from the north-east): https://commons.wikimedia.org/wiki/File:California_Bell_Tower-2.jpg
 * - "Balboa Parks California Tower (6496231083).jpg", Leandro Neumann
 *   Ciuffo, CC BY 2.0 (the upper stages and their tiles):
 *   https://commons.wikimedia.org/wiki/File:Balboa_Parks_California_Tower_(6496231083).jpg
 * - "California Tower and San Diego Museum of Man.jpg", Intrepid88,
 *   CC BY-SA 4.0 (dome tiles, star pattern, lantern, roofs from the north):
 *   https://commons.wikimedia.org/wiki/File:California_Tower_and_San_Diego_Museum_of_Man.jpg
 * - "Balboa Park, Museum of Man tower.JPG", Ctorbann, CC BY-SA 3.0:
 *   https://commons.wikimedia.org/wiki/File:Balboa_Park,_Museum_of_Man_tower.JPG
 * - "California State Building (Museum of Man).jpg", J.olsen356,
 *   CC BY-SA 4.0 (the frontispiece):
 *   https://commons.wikimedia.org/wiki/File:California_State_Building_(Museum_of_Man).jpg
 * - "Museu do Homem San Diego 01.jpg", GualdimG, CC BY-SA 4.0 (south front
 *   in colour): https://commons.wikimedia.org/wiki/File:Museu_do_Homem_San_Diego_01.jpg
 * - "Balboa parks towers fountains night.jpg", Jon Sullivan, public domain
 *   (night: tower floodlit): https://commons.wikimedia.org/wiki/File:Balboa_parks_towers_fountains_night.jpg
 *
 * Numbers (z above the west ground; lidar heights less 5.0 m)
 * - Tower: shaft to 29 (photo-scaled from Visitor7 against the lidar's
 *   stage tops, estimated); belfry stage top 41 (lidar 46.1); second stage
 *   top 47.3 (lidar 52.3); octagonal third stage top 53.4 (lidar 58.4);
 *   tiled cupola crown 58.3 (lidar 63.3); finial 61.5 (published 198 ft
 *   above the plaza, which is 1.2 m up). Stage widths from the lidar's
 *   footprints at each level: 10.5, 7.6, 5.4, cupola 5.2 m (measured).
 * - Dome: drum r 7.6 to 23.5, dome crown 30.5, lantern top 35, finial
 *   36.4 (lidar 41.4 over the centre) — measured; the drum's height split
 *   (drum vs. octagonal base at 19) is estimated from Intrepid88's photo.
 * - Arms: walls 14.5, barrel vaults to 18.6 (lidar 19.5 / 23.6, measured).
 *   Corner blocks 11 m (lidar 14–17). The north porch 12 m (estimated).
 * - South frontispiece: 9.5 m wide, crest to 22.4 (lidar 27.4), door and
 *   window sizes scaled from the HABS photo against the 19.1 m facade
 *   (estimated).
 * Colours: stucco and cast stone from the daylight photos (warm cream, the
 * carved stone a little greyer); tiles blue #4a74ab and yellow #e0b447
 * pulled to the palette; roofs pale grey from NAIP.
 *
 * Simplified / doubts
 * - The Churrigueresque carving is drawn as a raised slab with engaged
 *   columns and two arched openings; the statues and niches are left out.
 * - The dome's tiles: eight blue gores, each with a yellow star, cream ribs
 *   and a yellow band at the foot (the lettered band). The real gores carry
 *   a compass star in a chevron frame (Intrepid88).
 * - The tower's tile panels are a yellow ground round each arch; the real
 *   panels are yellow, blue and white chequer.
 * - The roofs of the corner blocks and the west (SW) block are flat at 11 m,
 *   read from lidar; no photo shows them closely.
 * - Night: the tower and the south front are floodlit (Sullivan); the dome a
 *   little. Openings stay dark.
 */
import { Part, cross, len, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { cbox, rect, cylinder } from './dc-white-house'
import { earcut, lathe } from './dc-nga-west'

// ===========================================================================
// Kit, shared with this builder's other Balboa Park models.

export type XY = [number, number]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (v: V3): V3 => { const l = len(v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }

/** A triangle or quad wound to face `n`. */
export function orientTo(p: Part, q: V3[], n: V3) {
  const f = cross(sub(q[1], q[0]), sub(q[2], q[0]))
  if (len(f) < 1e-10) {
    if (q.length === 4) { orientTo(p, [q[0], q[2], q[3]], n) }
    return
  }
  const fwd = dot(f, n) >= 0
  if (q.length === 3) return fwd ? p.tri(q[0], q[1], q[2]) : p.tri(q[0], q[2], q[1])
  if (fwd) p.quad(q[0], q[1], q[2], q[3])
  else p.quad(q[0], q[3], q[2], q[1])
}

/**
 * A vertical wall face: origin `o` on the wall plane at z = 0, `u` the unit
 * horizontal along it, `n` the outward normal. Points are (u, z, d) with d
 * measured outward from the plane.
 */
export type Face = { o: V3; u: V3; n: V3 }
/** The face whose outward normal points at compass angle `deg` (0 = north, 90 = east) through point (x, y). */
export function faceAt(x: number, y: number, deg: number): Face {
  const a = (deg * Math.PI) / 180
  const n: V3 = [Math.sin(a), Math.cos(a), 0]
  return { o: [x, y, 0], u: [-n[1], n[0], 0], n }
}
/** South face at y, north at y, etc. (u runs left to right seen from outside). */
export const southFace = (y: number): Face => faceAt(0, y, 180)
export const northFace = (y: number): Face => faceAt(0, y, 0)
export const eastFace = (x: number): Face => faceAt(x, 0, 90)
export const westFace = (x: number): Face => faceAt(x, 0, 270)
export function fp(F: Face, u: number, z: number, d = 0): V3 {
  return [F.o[0] + F.u[0] * u + F.n[0] * d, F.o[1] + F.u[1] * u + F.n[1] * d, z]
}

/** A flat polygon (u, z) on a face, `d` proud of it, facing out. */
export function facePoly(p: Part, F: Face, poly: XY[], d = 0.05) {
  for (const [a, b, c] of earcut(poly)) orientTo(p, [fp(F, ...poly[a], d), fp(F, ...poly[b], d), fp(F, ...poly[c], d)], F.n)
}
/** A polygon (u, z) on a face extruded from depth d0 to d1 (d1 > d0): front cap, sides, optional back. */
export function faceSlab(p: Part, F: Face, poly: XY[], d0: number, d1: number, back = false) {
  facePoly(p, F, poly, d1)
  if (back) facePoly(p, { ...F, n: [-F.n[0], -F.n[1], 0] as V3, u: [-F.u[0], -F.u[1], 0] as V3, o: fp(F, 0, 0, 2 * d0) }, poly.map(([u, z]) => [-u, z] as XY), d0)
  // sides: outward from the polygon's centroid in the face plane
  let cu = 0, cz = 0
  for (const [u, z] of poly) { cu += u; cz += z }
  cu /= poly.length; cz /= poly.length
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    const du = b[0] - a[0], dz = b[1] - a[1]
    let nu = dz, nz = -du
    if (nu * ((a[0] + b[0]) / 2 - cu) + nz * ((a[1] + b[1]) / 2 - cz) < 0) { nu = -nu; nz = -nz }
    const n: V3 = unit([F.u[0] * nu, F.u[1] * nu, nz])
    orientTo(p, [fp(F, a[0], a[1], d0), fp(F, b[0], b[1], d0), fp(F, b[0], b[1], d1), fp(F, a[0], a[1], d1)], n)
  }
}
/** A round-headed arch outline: width w centred at u, from z0, springing at zs (semicircle above). */
export function archPoly(u: number, w: number, z0: number, zs: number, seg = 8): XY[] {
  const r = w / 2
  const pts: XY[] = zs - z0 > 1e-6 ? [[u - r, z0], [u + r, z0]] : []
  for (let k = 0; k <= seg; k++) {
    const t = (Math.PI * k) / seg
    pts.push([u + r * Math.cos(t), zs + r * Math.sin(t)])
  }
  return pts
}
export const rectPoly = (u0: number, u1: number, z0: number, z1: number): XY[] => [[u0, z0], [u1, z0], [u1, z1], [u0, z1]]

/**
 * A segmental barrel vault over a rectangle, its axis along y (`ns`) or x:
 * eaves at z0 on the long sides, crown at z0 + rise. Ends closed by gable
 * walls (to `ends`, or not at all when null) that stand `lip` above the vault.
 */
export function vault(p: Part, ends: Part | null, r: { x0: number; x1: number; y0: number; y1: number }, z0: number, rise: number, ns: boolean, seg = 8, lip = 0.5, endsAt: [boolean, boolean] = [true, true]) {
  const half = ns ? (r.x1 - r.x0) / 2 : (r.y1 - r.y0) / 2
  const R = (half * half + rise * rise) / (2 * rise)
  const th = Math.asin(half / R)
  const prof: { s: number; z: number; n: [number, number] }[] = []
  for (let k = 0; k <= seg; k++) {
    const t = -th + (2 * th * k) / seg
    prof.push({ s: R * Math.sin(t), z: z0 + rise - R + R * Math.cos(t), n: [Math.sin(t), Math.cos(t)] })
  }
  const cx = (r.x0 + r.x1) / 2, cy = (r.y0 + r.y1) / 2
  const at = (s: number, z: number, a: number): V3 => (ns ? [cx + s, a, z] : [a, cy + s, z])
  const nrm = (n: [number, number]): V3 => (ns ? [n[0], 0, n[1]] : [0, n[0], n[1]])
  const a0 = ns ? r.y0 : r.x0, a1 = ns ? r.y1 : r.x1
  for (let k = 0; k < seg; k++) {
    const A = prof[k], B = prof[k + 1]
    const q: V3[] = [at(A.s, A.z, a0), at(B.s, B.z, a0), at(B.s, B.z, a1), at(A.s, A.z, a1)]
    const ns4 = [nrm(A.n), nrm(B.n), nrm(B.n), nrm(A.n)]
    p.tri(q[0], q[1], q[2], undefined, undefined, undefined, [ns4[0], ns4[1], ns4[2]])
    p.tri(q[0], q[2], q[3], undefined, undefined, undefined, [ns4[0], ns4[2], ns4[3]])
  }
  if (!ends) return
  for (const [i, aa] of [[0, a0], [1, a1]] as [number, number][]) {
    if (!endsAt[i]) continue
    const n: V3 = ns ? [0, i ? 1 : -1, 0] : [i ? 1 : -1, 0, 0]
    // gable wall: from the eaves line up round the vault, lip above it, and a little proud
    const pts: V3[] = prof.map(({ s, z }) => at(s, z + lip, aa))
    const base: V3[] = [at(-half, z0, aa), at(half, z0, aa)]
    const poly: V3[] = [base[0], base[1], ...pts.slice().reverse()]
    for (let k = 1; k < poly.length - 1; k++) orientTo(ends, [poly[0], poly[k], poly[k + 1]], n)
    // the lip's top edge
    for (let k = 0; k < seg; k++) {
      const A = pts[k], B = pts[k + 1]
      const d: V3 = ns ? [0, i ? -0.5 : 0.5, 0] : [i ? -0.5 : 0.5, 0, 0]
      const A2: V3 = [A[0] + d[0], A[1] + d[1], A[2]], B2: V3 = [B[0] + d[0], B[1] + d[1], B[2]]
      orientTo(ends, [A, B, B2, A2], unit(ns ? [prof[k].n[0], 0, prof[k].n[1]] : [0, prof[k].n[0], prof[k].n[1]]))
      // inner face of the lip, down to the vault
      const A3: V3 = [A2[0], A2[1], A2[2] - lip], B3: V3 = [B2[0], B2[1], B2[2] - lip]
      orientTo(ends, [A2, B2, B3, A3], [-n[0], -n[1], 0])
    }
  }
}

/** Points round a regular polygon of `n` sides with apothem... radius `r` to its corners. */
export function ngon(cx: number, cy: number, r: number, n: number, a0 = 0): XY[] {
  return Array.from({ length: n }, (_, k) => [cx + r * Math.cos(a0 + (2 * Math.PI * k) / n), cy + r * Math.sin(a0 + (2 * Math.PI * k) / n)] as XY)
}
/** A vertical prism over a convex or simple ring (any winding), bevelled top edge b, flat-shaded walls. */
export function ringPrism(p: Part, ring: XY[], z0: number, z1: number, top: Part | false = p, bottom = false) {
  let a = 0
  for (let i = 0; i < ring.length; i++) { const A = ring[i], B = ring[(i + 1) % ring.length]; a += A[0] * B[1] - B[0] * A[1] }
  const R = a > 0 ? ring : [...ring].reverse()
  for (let i = 0; i < R.length; i++) {
    const A = R[i], B = R[(i + 1) % R.length]
    p.quad([A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1])
  }
  if (top) for (const [i, j, k] of earcut(R)) orientTo(top, [[...R[i], z1], [...R[j], z1], [...R[k], z1]] as V3[], [0, 0, 1])
  if (bottom) for (const [i, j, k] of earcut(R)) orientTo(p, [[...R[i], z0], [...R[j], z0], [...R[k], z0]] as V3[], [0, 0, -1])
}
/** The outward faces of a regular n-gon prism (corner radius r), as Faces with u = 0 at each face's middle. */
export function ngonFaces(cx: number, cy: number, r: number, n: number, a0 = 0): { F: Face; w: number }[] {
  const pts = ngon(cx, cy, r, n, a0)
  return pts.map((A, i) => {
    const B = pts[(i + 1) % n]
    const m: XY = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]
    const n2 = unit([m[0] - cx, m[1] - cy, 0])
    return { F: { o: [m[0], m[1], 0], u: [-n2[1], n2[0], 0], n: n2 }, w: Math.hypot(B[0] - A[0], B[1] - A[1]) }
  })
}

/**
 * A dome as a surface of revolution r(z) sampled at `rings` heights, split
 * into `seg` columns; `pick(col, ring)` chooses each quad's part, so tiles,
 * ribs and bands are drawn without overlapping geometry. Smooth normals.
 */
export function patternDome(cx: number, cy: number, prof: XY[], seg: number, pick: (col: number, ring: number) => Part, a0 = 0) {
  const nrm = prof.map((_, i) => {
    const [r0, z0] = prof[Math.max(0, i - 1)], [r1, z1] = prof[Math.min(prof.length - 1, i + 1)]
    const l = Math.hypot(z1 - z0, r1 - r0) || 1
    return [(z1 - z0) / l, -(r1 - r0) / l] as XY
  })
  for (let k = 0; k < seg; k++) {
    const a = a0 + (k / seg) * 2 * Math.PI, b = a0 + ((k + 1) / seg) * 2 * Math.PI
    const P = ([r, z]: XY, t: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
    const N = (n: XY, t: number): V3 => [n[0] * Math.cos(t), n[0] * Math.sin(t), n[1]]
    for (let i = 0; i < prof.length - 1; i++) {
      const p = pick(k, i)
      const A = P(prof[i], a), B = P(prof[i], b), C = P(prof[i + 1], b), D = P(prof[i + 1], a)
      const nA = N(nrm[i], a), nB = N(nrm[i], b), nC = N(nrm[i + 1], b), nD = N(nrm[i + 1], a)
      if (prof[i][0] > 1e-6) p.tri(A, B, C, undefined, undefined, undefined, [nA, nB, nC])
      if (prof[i + 1][0] > 1e-6) p.tri(A, C, D, undefined, undefined, undefined, [nA, nC, nD])
    }
  }
}
/** Profile points of an elliptical dome: radius r at z0 rising to z1. */
export function domeProfile(r: number, z0: number, z1: number, n = 6): XY[] {
  return Array.from({ length: n + 1 }, (_, k) => {
    const t = (Math.PI / 2) * (k / n)
    return [r * Math.cos(t), z0 + (z1 - z0) * Math.sin(t)] as XY
  })
}

export type Mat = Swatch & { floodlight?: (p: V3, n: V3) => number; doubleSided?: boolean; opacity?: number }
/** Check the budgets and write models/<id>.glb. */
export async function saveModel(id: string, name: string, parts: Array<{ part: Part; material: Mat }>, maxTris = 5000) {
  const used = parts.filter(({ part }) => part.triangles)
  const triangles = used.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${id}: triangle budget exceeded: ${triangles}`)
  if (used.length > 6) throw new Error(`${id}: ${used.length} materials`)
  const glb = writeGlb(name, used as Array<{ part: Part; material: MaterialSpec }>, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor' })
  if (glb.length > 250 * 1024) throw new Error(`${id}: file budget exceeded: ${glb.length}`)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}

/** Balboa Park's 1915 exposition stucco and cast stone, shared by the El Prado buildings. */
export const BP_STUCCO = finish('balboa-stucco', 0xece2cf)
export const BP_CAST_STONE = finish('balboa-cast-stone', 0xd8c9ae)
/** The dark of an open arch or a deep window in the stucco. */
export const BP_SHADE = finish('balboa-shade', 0x4f4a44)

// ===========================================================================
// The California Building and Tower.

function build() {
  const stucco = new Part(), stone = new Part(), roof = new Part(), blue = new Part(), yellow = new Part(), shade = new Part()

  // ---- Arms: Greek cross round the dome, barrel vaults (lidar).
  const D: XY = [0.6, 3.1]
  const WALL = 14.5, RISE = 4.1
  const S_ARM = rect(-9.2, 9.9, -19.3, D[1])
  const N_ARM = rect(-8.6, 9.8, D[1], 18.4)
  const W_ARM = rect(-16.3, D[0], -6.4, 12.6)
  const E_ARM = rect(D[0], 16.4, -6.4, 12.6)
  for (const [r, ns, ends] of [[S_ARM, true, [true, false]], [N_ARM, true, [false, true]], [W_ARM, false, [true, false]], [E_ARM, false, [false, true]]] as const) {
    cbox(stucco, r, 0, WALL, { top: false })
    vault(roof, stucco, r, WALL, RISE, ns, 8, 0.45, ends as [boolean, boolean])
    // a cornice band at the eaves
    cbox(stone, { x0: r.x0 - 0.25, x1: r.x1 + 0.25, y0: r.y0 - 0.25, y1: r.y1 + 0.25 }, WALL - 0.7, WALL - 0.1, { top: false, bottom: true })
  }
  // corner blocks and the south-west block (flat, lidar 14–17 → 11 m)
  for (const r of [rect(-16.3, -8.6, 12.6, 18.4), rect(9.8, 13.9, 12.6, 18.4), rect(13.9, 16.4, 12.6, 13.6), rect(-19.2, -9.2, -12.3, -6.4), rect(-18.5, -16.3, -6.4, -2.2)])
    cbox(stucco, r, 0, 11, { b: 0.3, top: roof })
  // north porch
  cbox(stucco, rect(-4.6, 3.4, 18.4, 22.9), 0, 12, { b: 0.4, top: roof })

  // ---- Windows: deep arched recesses in the arms' side walls and ends.
  for (const [F, us] of [
    [westFace(-16.3), [-1.5, 7.7]], [eastFace(16.4), [-1.5, 7.7]],
    [northFace(18.4), [-6.2, 6.2]],
  ] as [ReturnType<typeof faceAt>, number[]][]) {
    for (const u of us) facePoly(shade, F, archPoly(u, 1.8, 7.5, 10.3), 0.05)
  }
  for (const x of [-9.2, 9.9]) {
    const F = x < 0 ? westFace(x) : eastFace(x)
    for (const u of [-14.5, -9]) facePoly(shade, F, archPoly(x < 0 ? -u : u, 1.6, 7.5, 10.2), 0.05)
  }
  for (const F of [westFace(-19.2)]) facePoly(shade, F, archPoly(9.3, 1.6, 4.5, 6.5), 0.05)

  // ---- The south front: wall, curved gable and the frontispiece.
  const SF = southFace(-19.3)
  const xc = 0.35
  // curved gable above the vault: S-curve from the eaves to a crest, drawn on the wall plane
  const gable: XY[] = [[-9.2, WALL - 0.2], [9.9, WALL - 0.2]]
  const half = 9.55
  for (let k = 0; k <= 12; k++) {
    const t = 1 - k / 12 // right to left
    const u = xc + (t * 2 - 1) * half
    const s = Math.abs(t * 2 - 1) // 0 centre, 1 eaves
    // concave-convex Baroque profile: flat shoulders, steep middle
    const z = WALL + 0.2 + (19.6 - WALL) * (1 - s) ** 1.6 + 0.6 * Math.sin(Math.PI * s) * (s > 0.35 ? 1 : 0)
    gable.push([u, z])
  }
  faceSlab(stucco, SF, gable, -0.4, 0.15)
  // frontispiece: carved cast stone, 9.5 m wide, proud 0.9 m
  const FW = 4.75
  const front: XY[] = [[xc - FW, 0], [xc + FW, 0], [xc + FW, 17.2], [xc + 3.4, 17.6], [xc + 2.6, 19.4], [xc + 1.5, 20.4], [xc + 0.8, 22.4], [xc - 0.8, 22.4], [xc - 1.5, 20.4], [xc - 2.6, 19.4], [xc - 3.4, 17.6], [xc - FW, 17.2]]
  faceSlab(stone, SF, front, 0, 0.9)
  // door and great window, dark
  facePoly(shade, SF, archPoly(xc, 3.0, 1.3, 5.3), 0.95)
  facePoly(shade, SF, archPoly(xc, 2.8, 9.4, 13.7), 0.95)
  // engaged columns and the entablature between the two storeys
  for (const du of [-3.9, -2.4, 2.4, 3.9]) {
    const [x, y] = [xc + du, -19.3 - 1.05]
    cylinder(stone, x, y, 0.38, 1.3, 8.2, 8)
    cylinder(stone, x, y, 0.32, 9.2, 16.0, 8)
  }
  faceSlab(stone, SF, rectPoly(xc - FW - 0.3, xc + FW + 0.3, 8.2, 9.2), 0.9, 1.4)
  faceSlab(stone, SF, rectPoly(xc - FW, xc + FW, 16.0, 16.8), 0.9, 1.3)
  // the flat facade either side: small high windows
  for (const du of [-7.2, 7.4]) facePoly(shade, SF, rectPoly(xc + du - 0.6, xc + du + 0.6, 10.5, 12.0), 0.05)

  // ---- The dome over the crossing.
  const OCT = ngon(D[0], D[1], 10.4, 8, Math.PI / 8)
  ringPrism(stucco, OCT, 14, 19, roof)
  const DR = 7.6
  // drum, 16 sides, with arched windows on alternate faces
  ringPrism(stucco, ngon(D[0], D[1], DR, 16), 19, 23.5, false)
  ngonFaces(D[0], D[1], DR, 16).forEach(({ F }, i) => { if (i % 2 === 0) facePoly(shade, F, archPoly(0, 1.2, 20.0, 22.0), 0.04) })
  // cornice, the yellow lettered band, then the gored dome
  lathe(stone, D[0], D[1], [[DR, 23.5], [DR + 0.45, 23.7], [DR + 0.45, 24.1], [DR, 24.1]], 16, false)
  lathe(yellow, D[0], D[1], [[DR - 0.05, 24.1], [DR - 0.15, 25.0]], 16, false)
  const DP = domeProfile(DR - 0.15, 25.0, 30.5, 6)
  // 8 gores × 6 columns: one cream rib column, five tile columns; a yellow
  // star in the middle of each gore (a long point up and down, short ones sideways)
  patternDome(D[0], D[1], DP, 48, (c, r) => {
    const k = c % 6
    if (k === 0) return stucco
    if (k === 3 && r >= 1 && r <= 4) return yellow
    if ((k === 2 || k === 4) && r === 2) return yellow
    return blue
  }, Math.PI / 8 - Math.PI / 48)
  // lantern
  ringPrism(stucco, ngon(D[0], D[1], 1.7, 8, Math.PI / 8), 30.2, 33.4, false)
  ngonFaces(D[0], D[1], 1.7, 8, Math.PI / 8).forEach(({ F }, i) => { if (i % 2 === 0) facePoly(shade, F, archPoly(0, 0.7, 31.0, 32.4), 0.03) })
  lathe(stone, D[0], D[1], [[1.95, 33.4], [1.95, 33.8], [0.01, 33.8]], 8, false)
  lathe(yellow, D[0], D[1], [[1.5, 33.8], [1.3, 34.6], [0.7, 35.1], [0.01, 35.2]], 8, false)
  lathe(stone, D[0], D[1], [[0.3, 35.1], [0.35, 35.6], [0.12, 36.4], [0.01, 36.4]], 6, false)

  // ---- The California Tower.
  const T: XY = [15.3, -11.4]
  const SH = 5.25 // shaft half-width
  const SHAFT = 29
  cbox(stucco, rect(T[0] - SH, T[0] + SH, T[1] - SH, T[1] + SH), 0, SHAFT, { c: 0.2, top: false })
  // small windows in the shaft
  for (const deg of [0, 90, 180, 270]) {
    const F0 = faceAt(T[0] + SH * Math.sin((deg * Math.PI) / 180), T[1] + SH * Math.cos((deg * Math.PI) / 180), deg)
    if (deg !== 270) facePoly(shade, F0, rectPoly(-0.45, 0.45, 21.0, 22.4), 0.04)
    facePoly(shade, F0, rectPoly(-0.35, 0.35, 25.2, 26.2), 0.04)
  }
  // shaft-top cornice and balconies
  cbox(stone, rect(T[0] - SH - 0.35, T[0] + SH + 0.35, T[1] - SH - 0.35, T[1] + SH + 0.35), SHAFT - 1.2, SHAFT, { b: 0.2, bottom: true, top: false })
  // ---- Stage 1, the belfry: corner piers, a big arch on each face, cornice and urns.
  const S1 = 41, C1 = 4.55
  cbox(stone, rect(T[0] - C1, T[0] + C1, T[1] - C1, T[1] + C1), SHAFT, S1 - 1, { top: false })
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const x = T[0] + sx * (SH - 0.8), y = T[1] + sy * (SH - 0.8)
    cbox(stone, rect(x - 0.85, x + 0.85, y - 0.85, y + 0.85), SHAFT, S1 - 1, { c: 0.25, top: false })
  }
  for (const deg of [0, 90, 180, 270]) {
    const s = Math.sin((deg * Math.PI) / 180), c = Math.cos((deg * Math.PI) / 180)
    const F = faceAt(T[0] + C1 * s, T[1] + C1 * c, deg)
    // arched opening with a raised frame, and a balcony under it
    faceSlab(stone, F, archPoly(0, 3.6, SHAFT + 0.4, 35.6), 0, 0.25)
    facePoly(shade, F, archPoly(0, 2.6, SHAFT + 0.8, 35.6), 0.3)
    faceSlab(stone, F, rectPoly(-1.6, 1.6, SHAFT - 0.4, SHAFT + 0.5), 0, 1.0)
    // narrow side openings between pier and arch
    for (const u of [-2.95, 2.95]) facePoly(shade, F, archPoly(u, 0.6, 33.0, 35.0), 0.05)
  }
  cbox(stone, rect(T[0] - SH - 0.3, T[0] + SH + 0.3, T[1] - SH - 0.3, T[1] + SH + 0.3), S1 - 1, S1, { b: 0.25, bottom: true, top: roof })
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const x = T[0] + sx * (SH - 0.6), y = T[1] + sy * (SH - 0.6)
    lathe(stone, x, y, [[0.45, S1], [0.55, S1 + 0.5], [0.35, S1 + 1.2], [0.15, S1 + 1.8], [0.01, S1 + 1.9]], 8, false)
  }
  // ---- Stage 2: smaller square, yellow tiled panels round an arch.
  const S2 = 47.3, C2 = 3.0
  cbox(stucco, rect(T[0] - C2, T[0] + C2, T[1] - C2, T[1] + C2), S1, S2 - 0.6, { top: false })
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const x = T[0] + sx * 3.1, y = T[1] + sy * 3.1
    cbox(stone, rect(x - 0.7, x + 0.7, y - 0.7, y + 0.7), S1, S2 - 0.6, { c: 0.2, top: false })
  }
  for (const deg of [0, 90, 180, 270]) {
    const s = Math.sin((deg * Math.PI) / 180), c = Math.cos((deg * Math.PI) / 180)
    const F = faceAt(T[0] + C2 * s, T[1] + C2 * c, deg)
    facePoly(yellow, F, rectPoly(-2.4, 2.4, S1 + 0.3, S2 - 0.9), 0.04)
    facePoly(blue, F, [[0, S2 - 2.2], [0.6, S2 - 1.55], [0, S2 - 0.9], [-0.6, S2 - 1.55]], 0.07)
    faceSlab(stone, F, archPoly(0, 2.5, S1 + 0.3, 44.4), 0.04, 0.2)
    facePoly(shade, F, archPoly(0, 1.8, S1 + 0.5, 44.4), 0.25)
  }
  cbox(stone, rect(T[0] - 3.9, T[0] + 3.9, T[1] - 3.9, T[1] + 3.9), S2 - 0.6, S2, { b: 0.2, bottom: true, top: roof })
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const x = T[0] + sx * 3.4, y = T[1] + sy * 3.4
    lathe(stone, x, y, [[0.38, S2], [0.45, S2 + 0.4], [0.28, S2 + 1.0], [0.01, S2 + 1.5]], 8, false)
  }
  // ---- Stage 3: the octagonal belfry, tiled, arched on the four main faces.
  const S3 = 53.4, R3 = 2.85
  ringPrism(stucco, ngon(T[0], T[1], R3, 8, Math.PI / 8), S2, S3 - 0.5, false)
  ngonFaces(T[0], T[1], R3, 8, Math.PI / 8).forEach(({ F, w }, i) => {
    if (i % 2 === 0) {
      facePoly(yellow, F, rectPoly(-w / 2 + 0.2, w / 2 - 0.2, S2 + 0.4, S3 - 0.9), 0.03)
      facePoly(shade, F, archPoly(0, 1.2, S2 + 0.7, 51.4), 0.06)
    } else {
      facePoly(yellow, F, rectPoly(-0.35, 0.35, S2 + 0.6, S3 - 1.1), 0.03)
      facePoly(blue, F, rectPoly(-0.35, 0.35, S2 + 2.4, S2 + 3.2), 0.06)
    }
  })
  lathe(stone, T[0], T[1], [[3.05, S3 - 0.5], [3.2, S3 - 0.2], [3.2, S3], [2.6, S3]], 16, false)
  // ---- Cupola: a yellow tiled dome with a blue band, then the finial.
  lathe(yellow, T[0], T[1], [[2.6, S3], [2.6, 54.3]], 16, false)
  lathe(blue, T[0], T[1], [[2.6, 54.3], [2.62, 54.9]], 16, false)
  lathe(stone, T[0], T[1], [[2.62, 54.9], [2.85, 55.1], [2.5, 55.3]], 16, false)
  lathe(yellow, T[0], T[1], domeProfile(2.5, 55.3, 58.3, 5), 16, false)
  lathe(stone, T[0], T[1], [[0.5, 58.1], [0.55, 58.7], [0.35, 59.2], [0.12, 59.4], [0.1, 61.5], [0.01, 61.5]], 6, false)

  // ---- Night: tower and south front floodlit, dome a little.
  const lit = (p: V3, n: V3) => {
    if (n[2] > 0.7) return 0.15
    const inTower = p[0] > 9.5 && p[1] < -5.5
    if (inTower) return p[2] < 2 ? 0.3 : 0.85
    if (p[1] < -18.5) return 0.7
    if (Math.hypot(p[0] - D[0], p[1] - D[1]) < 8.5 && p[2] > 19) return 0.45
    return 0.15
  }
  return [
    { part: stucco, material: { ...BP_STUCCO, floodlight: lit } },
    { part: stone, material: { ...BP_CAST_STONE, floodlight: lit } },
    { part: roof, material: finish('california-building-roof', 0xc9c3b8) },
    { part: blue, material: { ...finish('california-tile-blue', 0x4a74ab), floodlight: lit } },
    { part: yellow, material: { ...finish('california-tile-yellow', 0xe0b447), floodlight: lit } },
    { part: shade, material: BP_SHADE },
  ]
}

if (import.meta.main) await saveModel('sd-california-tower', 'California Building and California Tower', build())
void PALETTE
