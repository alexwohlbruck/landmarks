/**
 * Trajan's Column, Rome — procedural, CC0-1.0, no textures or source mesh.
 * bun generators/rome-trajans-column.ts
 *
 * Uses the sculpting kit exported by `rome-arch-of-constantine.ts`; merge
 * that generator first.
 *
 * Map frame: x and y along the pedestal's sides, z up, metres, origin at the
 * pedestal's centre on the forum pavement. Placed at bearing 320°, so the
 * model's south face (−y) is the real south-east face: the door and the
 * dedicatory inscription, toward the Basilica Ulpia. St Peter faces the
 * model's north (north-west), away from the Vittoriano, as photo 7 shows
 * him from behind.
 *
 * Sources
 * - OSM relation/3376015 (man_made=column, building=yes, wikidata Q192784):
 *   the pedestal outline, a 5.57 m square turned 50° (sides at 50°/140°),
 *   centroid 12.484273, 41.895809; building:part ways 251621051–56, 58 and
 *   relations 3376020, 3376021, 3376030 model the column in OSM 3D (heights
 *   5.3, 6.5, 33, 33.5, 34, 37.5, 38). The assignment gave Q193146, which is
 *   another item; OSM's Q192784 is Trajan's Column.
 * - Published (Wikipedia "Trajan's Column", after Jones 1993/2000 and
 *   Lancaster 1999): pedestal with plinth 6.16 m; base 1.7 m; shaft 26.92 m;
 *   capital 1.16 m; top of the capital 35.07 m above the ground; top of the
 *   statue base 38.4 m; shaft diameter 3.695 m; the frieze winds 23 times,
 *   its band growing from about 0.9 to 1.25 m. Italian Wikipedia: four eagles
 *   at the pedestal's corners carry a laurel garland; weapons in low relief
 *   on three sides; the inscription held by Victories over the door on the
 *   side toward the Basilica Ulpia. St Peter, bronze, set up in 1587/88.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   1. "Trajan's Column HD.jpg", Livioandronico2013, CC BY-SA 4.0,
 *      https://commons.wikimedia.org/wiki/File:Trajan%27s_Column_HD.jpg
 *   2. "Trajans column from north.jpg", MatthiasKabel, CC BY-SA 3.0,
 *      https://commons.wikimedia.org/wiki/File:Trajans_column_from_north.jpg
 *   3. "Trajan's Column (48423825027).jpg", Gary Todd, public domain
 *      (the pedestal from the forum floor),
 *      https://commons.wikimedia.org/wiki/File:Trajan%27s_Column_(48423825027).jpg
 *   4. "Column Base 01.jpg", MumblerJamie, CC BY-SA 2.0 (the weapons relief),
 *      https://commons.wikimedia.org/wiki/File:Column_Base_01.jpg
 *   5. "Roma, Colonna Traiana, San Pietro.jpg", Palickap, CC BY-SA 4.0
 *      (capital, drum, statue base and St Peter),
 *      https://commons.wikimedia.org/wiki/File:Roma,_Colonna_Traiana,_San_Pietro.jpg
 *   6. "Trajan's Column-Trajan's Forum.jpg", Yair Haklai, CC BY-SA 4.0
 *      (from Piazza Venezia, the pit hiding the pedestal),
 *      https://commons.wikimedia.org/wiki/File:Trajan%27s_Column-Trajan%27s_Forum.jpg
 *   7. "Colonna Traiana Santissimo Nome di Maria dome Rome.jpg", Jebulon,
 *      CC0 (from the Vittoriano: the forum pit, St Peter from behind),
 *      https://commons.wikimedia.org/wiki/File:Colonna_Traiana_Santissimo_Nome_di_Maria_dome_Rome.jpg
 *   8. "Base de la Columna de Trajano (Colonna Traiana). Roma, Italia.jpg",
 *      Carlos Teixidor Cadenas, CC BY-SA 4.0 (weapons and the draco).
 * - Terrain: Mapterhorn z13 (z14+ not served here) shows a smooth slope of
 *   about 0.1 m per metre and no trace of the forum pit, so with the −5 m
 *   elevation `terrain.ts check` reports the pedestal's tops buried (by
 *   5.2 m at most): that is the pit the terrain doesn't draw, as intended.
 *
 * Numbers
 * - Published: everything in the list above.
 * - Measured on photo 3 (103 px/m from the 5.57 m OSM base): base course
 *   0–1.33 m, relief die 1.33–4.2 m and 5.2 m square, cornice 4.2–4.82 m,
 *   the eagle and garland block 4.82–6.16 m and 5.05 m square (scaled to the
 *   published 6.16 m). Torus 4.6 m across (photo 2, 1.25 × the shaft).
 * - Measured on photo 5 (shaft top 3.2 m): abacus 4.7 m square, 0.7 m;
 *   echinus 0.6 m; Sixtus V's drum 2.9 m across and 2.55 m tall with its
 *   cornice (35.07–37.6 m); the upper statue base 1.6–2.0 m across and
 *   1.6 m tall (to 39.2 m). St Peter 4.1 m with his halo (photos 1 and 5:
 *   as tall as 1.25 shaft diameters), and his raised keys reach 43.3 m.
 *   Lancaster's 38.4 m "to the top of the statue base" is below what photo
 *   5 shows; it may mean the drum alone. The photo was followed.
 * - Elevation −5.0 m: the forum pavement under the column is about 5 m below
 *   the streets around the pit. Measured on photo 3 (the brick retaining
 *   wall behind the column, scaled by its door taken as 2.4 m, stands 5.4 m to the
 *   railing) and photo 7 (the walkway round the curved wall runs at about
 *   the top of the pedestal). Map terrain was not used for it.
 * - Estimated: the relief depths (the fillet between turns stands 0.05 m
 *   over a 0.01 m groove; the band's figure groups up to 0.14 m, deeper
 *   than real so they read), the weapons' arrangement, the eagles' pose,
 *   St Peter's pose from photos 1, 5 and 7 (keys raised forward above the
 *   shoulder in the right hand, the book held to the body in the left, the
 *   mantle drawn across from the right hip to the left shoulder, the flat
 *   nimbus on his head that photos 5 and 7 show).
 * - Colours from photos 1 and 2: warm cream marble, the frieze honey-toned
 *   and weathered darker, with about a third of the band's cells (never
 *   two side by side) in a slightly darker stone for the shadowed ground
 *   between the figure groups;
 *   St Peter near-black green bronze (photo 1), kept at charcoal lightness.
 * - Invented: the figures inside the frieze, drawn as an irregular raised
 *   and shaded surface on each band, not as figures.
 *
 * Doubts: Peter's facing is read from one far photo (7). The pedestal's
 * north-west side is unphotographed; it carries weapons like the others.
 * The modern railing round the abacus is left out (STYLE: no railings).
 * No look-only sources were used.
 *
 * Night: the column is floodlit from the forum, so the marble carries a
 * `floodlight` wash; St Peter is not.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { add, body, box, face, lathe, mul, place, raised, tube, turn, unit } from './rome-arch-of-constantine'

const TAU = Math.PI * 2
const UP: V3 = [0, 0, 1]

const marble = new Part()    // pedestal, shaft, capital, drum
const ledge = new Part()     // the frieze's spiral ledge and the brighter mouldings
const frieze = new Part()    // the weathered relief band and the pedestal reliefs
const bronze = new Part()    // St Peter
const door = new Part()      // the door and the inscription field
const deep = new Part()      // the shadowed ground between the frieze's figures
const roof = marble          // flat tops share the marble

// ---------------------------------------------------------------- heights
const BASE = 1.33, DIE = 4.2, CORNICE = 4.82, PED = 6.16
const TORUS1 = 6.98, SHAFT1 = 33.91, ECHINUS = 34.45, ABACUS = 35.07
const DRUM1 = 37.25, DRUMTOP = 37.6, STATUE = 39.2
const HP = 5.57 / 2, HD = 5.2 / 2, HC = 5.62 / 2, HE = 5.05 / 2

// ---------------------------------------------------------------- pedestal
box(marble, -HP, HP, -HP, HP, 0, 0.35, { c: 0.12, t: 0.08 })
box(ledge, -HP + 0.1, HP - 0.1, -HP + 0.1, HP - 0.1, 0.35, BASE, { c: 0.1, t: 0.22, top: false })
box(marble, -HD, HD, -HD, HD, BASE, DIE, { c: 0.08, top: false })
box(ledge, -HC, HC, -HC, HC, DIE, CORNICE, { c: 0.15, b: 0.25, t: 0.06, bottom: true })
box(marble, -HE, HE, -HE, HE, CORNICE, PED, { c: 0.1, top: true })

/** One side of the pedestal: frame origin on the face, u along it, n out. */
type Side = { O: V3; U: V3; N: V3 }
const sides: Side[] = [
  { O: [0, -HD, 0], U: [1, 0, 0], N: [0, -1, 0] },  // south-east: door and inscription
  { O: [HD, 0, 0], U: [0, 1, 0], N: [1, 0, 0] },
  { O: [0, HD, 0], U: [-1, 0, 0], N: [0, 1, 0] },
  { O: [-HD, 0, 0], U: [0, -1, 0], N: [-1, 0, 0] },
]
const disc = (cu: number, cv: number, r: number, n = 10): [number, number][] =>
  Array.from({ length: n }, (_, i) => [cu + r * Math.cos((i / n) * TAU), cv + r * Math.sin((i / n) * TAU)])
const bar = (u0: number, v0: number, u1: number, v1: number, w: number): [number, number][] => {
  const du = u1 - u0, dv = v1 - v0, l = Math.hypot(du, dv), pu = (-dv / l) * w, pv = (du / l) * w
  return [[u0 - pu, v0 - pv], [u1 - pu, v1 - pv], [u1 + pu, v1 + pv], [u0 + pu, v0 + pv]]
}

// Weapons heaped in low relief: round shields, crossed spears, helmets and
// the Dacian draco, as on photos 4 and 8.
function weapons(s: Side, seed: number, door = false) {
  const jit = (k: number) => 0.12 * Math.sin(seed * 3.1 + k * 1.7)
  const shields: [number, number, number][] = door
    ? [[-1.85, 1.95, 0.55], [1.85, 1.95, 0.55]]
    : [[-1.75, 1.95 + jit(1), 0.55], [-0.6, 2.25, 0.5], [0.55, 2.0, 0.52], [1.7, 2.05 + jit(2), 0.55], [-1.2, 3.1, 0.45], [-0.05, 3.5, 0.48], [1.05, 3.3 + jit(3), 0.5]]
  for (const [u, v, rad] of shields) raised(frieze, s.O, s.U, UP, s.N, disc(u, v, rad, 9), 0.1, 0, 0.85)
  if (door) return
  for (const [u0, v0, u1, v1] of [[-2.3, 1.6, -0.1, 3.95], [2.3, 1.55, 0.2, 3.95]] as const)
    raised(frieze, s.O, s.U, UP, s.N, bar(u0, v0, u1, v1, 0.06), 0.13, 0, 1)
  const [hu, hv] = [-1.9 + jit(4), 3.35]
  raised(frieze, s.O, s.U, UP, s.N, [[hu - 0.4, hv - 0.2], [hu + 0.4, hv - 0.2], [hu + 0.28, hv + 0.12], [hu, hv + 0.32], [hu - 0.28, hv + 0.12]], 0.16, 0, 0.8)
  // The draco: a wolf's head on a coiling body.
  raised(frieze, s.O, s.U, UP, s.N, [[1.75, 2.95], [2.1, 3.05], [2.05, 3.5], [2.35, 3.75], [2.0, 3.95], [1.7, 3.6]], 0.12, 0, 0.9)
}
for (let k = 1; k < 4; k++) weapons(sides[k], k * 7)
// The south-east face: door below, the inscription held by two Victories.
{
  const s = sides[0]
  weapons(s, 3, true) // a shield either side of the door
  const at = (u: number, v: number, d: number): V3 => add(add(add(s.O, mul(s.U, u)), mul(UP, v)), mul(s.N, d))
  // Inscription tablet with a moulded frame, over the door.
  raised(ledge, s.O, s.U, UP, s.N, [[-1.75, 2.7], [1.75, 2.7], [1.75, 4.05], [-1.75, 4.05]], 0.14, 0, 1)
  face(door, [at(-1.55, 2.85, 0.15), at(1.55, 2.85, 0.15), at(1.55, 3.9, 0.15), at(-1.55, 3.9, 0.15)], s.N)
  // Six lines of the dedication as shallow bands.
  for (let k = 0; k < 6; k++) raised(ledge, add(s.O, mul(s.N, 0.15)), s.U, UP, s.N, [[-1.4, 3.73 - k * 0.15], [1.4, 3.73 - k * 0.15], [1.4, 3.8 - k * 0.15], [-1.4, 3.8 - k * 0.15]], 0.02, 0, 1)
  // Winged Victories holding it.
  for (const sg of [-1, 1]) {
    const v: [number, number][] = [[1.8, 2.7], [2.3, 2.75], [2.35, 3.5], [2.55, 4.0], [2.25, 3.95], [2.05, 4.1], [1.85, 3.85]]
    raised(frieze, s.O, s.U, UP, s.N, v.map(([a, b]) => [sg * a, b] as [number, number]), 0.16, 0, 0.9)
  }
  // The door: a dark leaf in a moulded frame.
  raised(ledge, s.O, s.U, UP, s.N, [[-0.72, BASE], [0.72, BASE], [0.72, 2.55], [-0.72, 2.55]], 0.1, 0, 1)
  face(door, [at(-0.55, BASE, 0.11), at(0.55, BASE, 0.11), at(0.55, 2.42, 0.11), at(-0.55, 2.42, 0.11)], s.N)
}
// The upper block's laurel garland, swagging between the corners, and the
// four eagles at the corners holding it.
for (const s of sides) {
  const P = (u: number, v: number, d: number): V3 => add(add(add([s.O[0] * HE / HD, s.O[1] * HE / HD, 0], mul(s.U, u)), mul(UP, v)), mul(s.N, d))
  const path: V3[] = Array.from({ length: 7 }, (_, i) => {
    const t = i / 6, u = -2.0 + 4.0 * t
    return P(u, 5.8 - 0.6 * Math.sin(Math.PI * t), 0.2)
  })
  tube(ledge, path, path.map((_, i) => 0.16 + 0.12 * Math.sin((Math.PI * i) / 6)), 6, { caps: false })
}
function eagle(x: number, y: number, deg: number) {
  const p = new Part()
  const Z = CORNICE
  // Body perched on the corner, breast out along the diagonal, head turned.
  const ring = (z: number, r: number, d: number) => Array.from({ length: 6 }, (_, i): V3 => {
    const a = (i / 6) * TAU
    return [d + r * Math.cos(a), d + r * 0.85 * Math.sin(a), z]
  })
  body(p, [ring(Z + 0.05, 0.2, 0.05), ring(Z + 0.55, 0.3, 0.1), ring(Z + 0.95, 0.22, 0.1), ring(Z + 1.12, 0.1, 0.12)])
  tube(p, [[0.12, 0.12, Z + 1.1], [0.2, 0.2, Z + 1.26], [0.36, 0.3, Z + 1.24]], [0.1, 0.11, 0.04], 5)
  // Wings half spread along both faces, feathered at the tips.
  for (const [ax, ay] of [[1, 0], [0, 1]] as const) {
    const n: V3 = unit([ay, ax, 0])
    const w: V3[] = ([[0.05, 1.0], [-0.55, 1.28], [-1.05, 1.15], [-0.9, 0.95], [-1.1, 0.8], [-0.85, 0.62], [-0.95, 0.45], [-0.3, 0.35]] as const)
      .map(([u, z]) => [ax * u, ay * u, Z + z] as V3)
    for (const sg of [1, -1]) face(p, w.map((q) => add(q, mul(n, sg * 0.07))), mul(n, sg))
  }
  place(ledge, p, turn(deg, [x, y, 0]), 60)
}
for (const [sx, sy, deg] of [[1, 1, 0], [-1, 1, 90], [-1, -1, 180], [1, -1, 270]] as const)
  eagle(sx * (HE - 0.12), sy * (HE - 0.12), deg)

// ---------------------------------------------------------------- base, torus and shaft
const R0 = 3.695 / 2, R1 = 3.25 / 2
const R = (z: number) => R0 + ((R1 - R0) * (z - TORUS1)) / (SHAFT1 - TORUS1)
// Square plinth under the torus, then the torus wound with a laurel wreath:
// a lattice of crossing leaves drawn as alternating bumps.
box(marble, -2.38, 2.38, -2.38, 2.38, PED, PED + 0.12, { c: 0.15 })
{
  const t = new Part(), n = 22, m = 6, rc = 1.92, rt = 0.42, zc = PED + 0.12 + rt
  const pt = (i: number, j: number): V3 => {
    const a = (i / n) * TAU, b = (j / m) * TAU
    const bump = (i + j) % 2 ? 0.06 : -0.02
    const r = rc + (rt + bump) * Math.cos(b)
    return [r * Math.cos(a), r * Math.sin(a), zc + (rt + bump) * Math.sin(b)]
  }
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
    const a = pt(i, j), b = pt(i + 1, j), c = pt(i + 1, j + 1), d = pt(i, j + 1)
    t.quad(a, b, c, d)
  }
  place(marble, t, undefined, 180)
}
// Apophyge: the shaft flares into its base above the torus.
lathe(marble, 0, 0, [[2.0, PED + 0.95], [R0 + 0.08, PED + 1.1], [R0, TORUS1 + 0.35]], 16, { top: false, crease: 180 })

// The helical frieze, 23 turns. A strip follows the helix; across it each
// pitch carries a thin fillet over a shallow groove (the real column's
// barely-raised border), then the band of relief, carved into irregular
// blocky groups of varied depth where the figures are.
const TURNS = 23, SEGS = 18
const Z0 = TORUS1 + 0.35, Z1 = SHAFT1 - 0.3
const pa = 0.95, pb = (2 * ((Z1 - Z0) / TURNS - pa))  // pitch grows from pa to pa + pb
// The ledge's height at turn fraction tau.
const zh = (tau: number) => Z0 + pa * tau + (pb * tau * tau) / (2 * TURNS)
const pitch = (tau: number) => zh(tau + 1) - zh(tau)
// Profile across one pitch: offset (fraction of the pitch), radial add.
const PROFILE: [number, number][] = [[0, 0.05], [0.06, -0.01], [0.36, 0], [0.72, 0]]
// Relief depth per cell: a hash, quantised into three depths so the band
// reads as groups of figures, ground and deep-cut gaps.
const hash = (i: number, j: number) => ((Math.sin(i * 12.9898 + j * 78.233) * 43758.5453) % 1 + 1) % 1
const relief = (i: number, j: number) => {
  const h = hash(i, j)
  return h < 0.25 ? 0.0 : h < 0.6 ? 0.08 : 0.14
}
{
  // Grid of vertices over (step along the helix, profile point); rows run
  // to TURNS * SEGS + SEGS so the last band closes under the capital.
  const steps = TURNS * SEGS
  const vert = (i: number, j: number): V3 => {
    const tau = i / SEGS
    const [o, dr0] = PROFILE[j]
    let z = zh(tau) + o * pitch(tau)
    const dr = j >= 2 ? dr0 + relief(i, j) : dr0
    // Clamp to the shaft's plain ends so the strip starts and ends level.
    z = Math.min(Math.max(z, Z0), Z1)
    const r = R(z) + (z <= Z0 + 1e-6 || z >= Z1 - 1e-6 ? 0 : dr)
    const a = (i / SEGS) * TAU
    return [r * Math.cos(a), r * Math.sin(a), z]
  }
  // Rows run a turn past both ends; there the strip clamps flat to the shaft.
  const rows: V3[][] = []
  const FIRST = -2 * SEGS, LAST = steps + SEGS
  for (let i = FIRST; i <= LAST; i++) rows.push(PROFILE.map((_, j) => vert(i, j)))
  // Normals per vertex from neighbours, so the strip welds smooth.
  const get = (i: number, j: number): V3 => {
    // j beyond the profile wraps to the next turn's first point.
    if (j >= PROFILE.length) { i += SEGS; j -= PROFILE.length }
    if (j < 0) { i -= SEGS; j += PROFILE.length }
    i = Math.max(FIRST, Math.min(LAST, i))
    return rows[i - FIRST][j]
  }
  const nrm = (i: number, j: number): V3 => {
    const du = sub3(get(i + 1, j), get(i - 1, j)), dv = sub3(get(i, j + 1), get(i, j - 1))
    let n = unit(cross3(du, dv))
    const p = get(i, j)
    if (n[0] * p[0] + n[1] * p[1] < 0) n = mul(n, -1)
    return n
  }
  for (let i = -SEGS; i < steps; i++) for (let j = 0; j < PROFILE.length; j++) {
    const a = get(i, j), b = get(i + 1, j), c = get(i + 1, j + 1), d = get(i, j + 1)
    // Skip the degenerate cells where the clamp flattened both ends.
    if (Math.abs(a[2] - d[2]) < 1e-5 && Math.abs(b[2] - c[2]) < 1e-5) continue
    // About a third of the cells, never two side by side, are the shadowed
    // ground between figure groups: a slightly darker stone, so the band
    // reads as finely carved rather than as smooth rings.
    const target = j === 0 ? marble : (i + j) % 2 === 0 && hash(i * 3 + j, 7) < 0.7 ? deep : frieze
    const na = nrm(i, j), nb = nrm(i + 1, j), nc = nrm(i + 1, j + 1), nd = nrm(i, j + 1)
    target.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
    target.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
  }
}
function sub3(a: V3, b: V3): V3 { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]] }
function cross3(a: V3, b: V3): V3 { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]] }
// Plain shaft below and above the frieze.
lathe(marble, 0, 0, [[R0, TORUS1 + 0.35], [R(Z0), Z0]], 16, { top: false, crease: 180 })
lathe(marble, 0, 0, [[R(Z1), Z1], [R1, SHAFT1]], 16, { top: false, crease: 180 })

// ---------------------------------------------------------------- capital, drum, statue base
// Echinus carved with egg-and-dart, a lobed swelling ring.
{
  const t = new Part()
  const ring = (z: number, r: number, lobe: number) => Array.from({ length: 24 }, (_, i): V3 => {
    const a = (i / 24) * TAU, rr = r + (i % 2 ? lobe : 0)
    return [rr * Math.cos(a), rr * Math.sin(a), z]
  })
  t.loft([ring(SHAFT1, R1 + 0.05, 0), ring(SHAFT1 + 0.25, R1 + 0.3, 0.1), ring(ECHINUS, R1 + 0.55, 0.06)])
  place(ledge, t, undefined, 180)
}
box(marble, -2.35, 2.35, -2.35, 2.35, ECHINUS, ABACUS, { b: 0.12, t: 0.06, bottom: true, top: false })
face(roof, [[-2.29, -2.29, ABACUS], [2.29, -2.29, ABACUS], [2.29, 2.29, ABACUS], [-2.29, 2.29, ABACUS]], UP)
// The drum Sixtus V set up for the statue: moulded foot, plain drum,
// cornice, a smaller moulded base and Peter's own plinth.
lathe(marble, 0, 0, [[1.6, ABACUS], [1.6, ABACUS + 0.2], [1.45, ABACUS + 0.38], [1.45, DRUM1 - 0.2], [1.55, DRUM1], [1.62, DRUM1 + 0.15], [1.6, DRUMTOP]], 16, { top: false, crease: 50 })
face(roof, Array.from({ length: 16 }, (_, i): V3 => [1.6 * Math.cos((i / 16) * TAU), 1.6 * Math.sin((i / 16) * TAU), DRUMTOP]), UP)
lathe(ledge, 0, 0, [[1.0, DRUMTOP], [1.0, DRUMTOP + 0.15], [0.85, DRUMTOP + 0.4], [0.8, STATUE - 0.4], [0.92, STATUE - 0.2], [0.98, STATUE - 0.08], [0.95, STATUE]], 14, { crease: 50 })

// ---------------------------------------------------------------- St Peter
/**
 * St Peter, bronze, 4.1 m: a long robe with a wide hem, the mantle drawn
 * diagonally across the body from the right hip to the left shoulder and
 * falling in a fold down his left side, a bearded head, the right arm
 * raised forward holding the two great keys above shoulder height (photo
 * 5), the left arm holding the book against his body, and the flat nimbus
 * the statue wears on its head (photos 1, 5 and 7). Faces +y, feet at the
 * origin; his right hand is +x.
 */
function peter() {
  const p = new Part(), hard = new Part()
  // A ring with vertical folds: radius modulated round the body.
  const F = (z: number, rx: number, ryF: number, ryB: number, fold = 0, dx = 0, dy = 0, n = 12): V3[] =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * TAU + Math.PI / n
      const k = 1 + fold * Math.cos(5 * a + z * 1.3)
      return [dx + rx * k * Math.cos(a), dy + (Math.sin(a) > 0 ? ryF : ryB) * k * Math.sin(a), z]
    })
  // His own bronze base.
  body(p, [F(0, 0.6, 0.55, 0.55, 0, 0, 0, 8), F(0.12, 0.6, 0.55, 0.55, 0, 0, 0, 8)], { bottom: true })
  // Robe and mantle, wide at the hem, folds dying out toward the chest.
  body(p, [
    F(0.12, 0.6, 0.5, 0.48, 0.09, 0, 0.03), F(0.55, 0.53, 0.43, 0.45, 0.08, 0.02, 0.02), F(1.2, 0.48, 0.38, 0.42, 0.07, 0.04, 0.02),
    F(1.8, 0.45, 0.35, 0.38, 0.05, 0.03), F(2.3, 0.42, 0.31, 0.33, 0.03), F(2.75, 0.5, 0.31, 0.32, 0.02),
    F(2.98, 0.55, 0.28, 0.3, 0), F(3.1, 0.22, 0.16, 0.18, 0, 0, 0.02),
  ])
  // The mantle's edge drawn across the body, right hip to left shoulder,
  // and its fold falling from the left shoulder to the knee.
  tube(p, [[0.46, 0.18, 1.35], [0.2, 0.42, 1.75], [-0.12, 0.4, 2.3], [-0.42, 0.22, 2.85], [-0.5, 0.0, 3.0]], [0.1, 0.14, 0.14, 0.12, 0.1], 5, { caps: false })
  tube(p, [[-0.52, -0.05, 2.9], [-0.6, 0.05, 2.1], [-0.56, 0.12, 1.3], [-0.45, 0.2, 0.75]], [0.12, 0.17, 0.15, 0.07], 5, { caps: false })
  // Head bowed a little forward; the beard falls onto the chest.
  const H = (z: number, rx: number, ryF: number, ryB: number, dy: number): V3[] =>
    Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * TAU + Math.PI / 8
      return [rx * Math.cos(a), dy + (Math.sin(a) > 0 ? ryF : ryB) * Math.sin(a), z]
    })
  body(p, [H(2.86, 0.1, 0.08, 0.06, 0.2), H(3.02, 0.17, 0.2, 0.12, 0.12), H(3.2, 0.19, 0.24, 0.17, 0.05), H(3.42, 0.2, 0.2, 0.2, 0.02), H(3.6, 0.17, 0.16, 0.18, 0), H(3.68, 0.08, 0.08, 0.09, 0)], { bottom: true })
  // The nimbus, a thin disc set on the crown of the head.
  {
    const ring = Array.from({ length: 12 }, (_, i): V3 => [0.33 * Math.cos((i / 12) * TAU), 0.33 * Math.sin((i / 12) * TAU) - 0.02, 3.66])
    body(hard, [ring, ring.map((q) => [q[0], q[1], q[2] + 0.05] as V3)], { bottom: true })
  }
  // Right arm raised forward, the keys held up above the shoulder.
  tube(p, [[0.5, 0, 2.95], [0.66, 0.2, 2.62], [0.6, 0.52, 2.95], [0.55, 0.62, 3.2]], [0.16, 0.13, 0.11, 0.1], 5, { caps: false })
  for (const dx of [-0.07, 0.07]) tube(hard, [[0.55 + dx, 0.62, 3.05], [0.55 + dx * 1.6, 0.72, 3.9]], [0.045, 0.045], 4)
  box(hard, 0.38, 0.72, 0.62, 0.78, 3.85, 4.1)  // the bows of the keys
  box(hard, 0.4, 0.7, 0.58, 0.72, 2.9, 3.05)    // the wards
  // Left arm bent, the hand holding the book against his body.
  tube(p, [[-0.5, 0, 2.95], [-0.62, 0.06, 2.45], [-0.38, 0.36, 2.35]], [0.16, 0.13, 0.11], 5, { caps: false })
  box(hard, -0.42, -0.02, 0.24, 0.44, 2.15, 2.72)
  place(p, hard)
  return p
}
place(bronze, peter(), (p) => [p[0], p[1], p[2] + STATUE], 180)

// ---------------------------------------------------------------- write

// Floodlit from the forum floor: the pedestal and the lower shaft brightest,
// fading up the shaft; St Peter stays dark.
const lit = (p: V3, n: V3): number => (1 - 0.5 * Math.min(1, p[2] / 40)) * (n[2] > 0.7 ? 0.35 : 1)
const mat = (name: string, color: number, light = true): MaterialSpec => ({ name, color, roughness: 0.85, ...(light ? { floodlight: lit } : {}) })
const parts = [
  { part: marble, material: mat('column-marble', 0xe9dcc2) },
  { part: ledge, material: mat('white-marble', 0xeee3cd) },
  { part: frieze, material: mat('frieze-weathered', 0xd4c3a1) },
  { part: door, material: mat('door-grey', 0x9f988b) },
  { part: bronze, material: mat('bronze-patina', 0x4a5650, false) },
  { part: deep, material: mat('frieze-deep', 0xc6b492) },
]
const triangles = parts.reduce((sum, { part }) => sum + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name, part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb("Trajan's Column", parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 320, elevation: -5, footprint: [5.57, 5.57], height: 43.3,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/rome-trajans-column.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
