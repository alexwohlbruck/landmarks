/**
 * Royal Albert Hall, Kensington Gore, London (Francis Fowke and Henry Y. D.
 * Scott, opened 1871): original procedural geometry, CC0-1.0.
 * bun generators/london-royal-albert-hall.ts
 *
 * Map frame, turned to BEARING 352.5: +y is model north = compass 352.5 deg,
 * the hall's long axis from the south porch (Prince Consort Road steps) to
 * the north porch (Kensington Gore, toward the Albert Memorial); +x is model
 * east = compass 82.5 deg; z up, metres. Origin = the area centroid of the
 * OSM outline way/372860405 (-0.177403, 51.501013), on the ground. y = 0 is
 * the pavement round the hall (lidar: 9.5 m above the box's ground_min on the
 * south side, 10.0 on the north; the site is near flat).
 *
 * What makes it the Royal Albert Hall, and how each is drawn
 * - The elliptical drum of red brick (semi-axes 36.6 x 41.7 m) with buff
 *   terracotta dressings: a rusticated buff base, ground-floor windows in
 *   buff frames, a buff string course, a tier of round-arched windows between
 *   buff pilasters, the balcony gallery ring projecting on its slab with a
 *   balustrade, a row of small upper windows, then the broad buff terracotta
 *   mosaic frieze band (the "Triumph of Arts and Sciences") and the cornice.
 * - Above the cornice a flat lead terrace, then the set-back attic drum (red
 *   brick with two buff bands and its own cornice) under the shallow glazed
 *   and wrought-iron dome: one pale silvery glass surface with 24 thin ribs
 *   in a grey metal tone close to the glass (lead review: no cream stripes),
 *   and the small central lantern. The dome profile is the lidar section
 *   (near-parabolic, z = 30.2 + 13.8 (1 - k^2)): it matches the DSM within
 *   ~0.5 m at r/a 0.2, 0.41, 0.62 and 0.83.
 * - The four porches on the axes: the north porch (two storeys, the great
 *   arched entrance in a real recess, three tall windows between columns,
 *   balustrade), the taller south porch with its pediment reaching the
 *   frieze, and the east and west carriage porches (arched carriageway in a
 *   real recess, arched window over, gabled lead roof).
 * - Night: the drum is floodlit warm (Diliff's dusk photo); brick and buff
 *   carry _FLOODLIGHT on their outward faces; windows and the porch doors
 *   glow; the dome stays dark.
 *
 * Evidence
 * - OSM (ODbL): outline way/372860405 (building=yes, Royal Albert Hall,
 *   wikidata Q193639). Parts inside it, all replaced: drum way/952279006
 *   (height 25), dome way/952279005 (43.8, roof:height 13.8), lantern
 *   way/952279004 (43-46.6), porches way/952279000 (north, 18),
 *   way/952279001 (east, 20 gabled), way/952279002 (west, 20 gabled),
 *   way/952279003 (south, 20 gabled), and the four 4 m crescents round the
 *   drum's foot way/372860406..372860409 (area railings and light wells; not
 *   drawn as solids).
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0 (composite of flights ~2000-2022). Measured above the pavement:
 *   drum cornice / terrace 24.0; attic top 29.8-30.5 (its ellipse 29 x 34.5,
 *   matching the OSM dome part); dome profile (parabolic-ish: 13.1 m above
 *   the attic at r/a = 0.41, 10.5 at 0.62, 5.6 at 0.83), crown 44, lantern
 *   46.4; north porch 16.5 (to its parapet); south porch 19-19.8 (pediment
 *   apex); east and west porches 17.4 at the eaves, 19.5 at the ridge.
 * - Published: plan ~83 x 72 m, dome 41 m high (Historic England list entry
 *   1066133; Wikipedia "Royal Albert Hall"). The OSM drum part is 83.4 x
 *   73.4 m; the lidar dome crown is 44 m over the pavement (41 m is presumably
 *   to the dome's ring or from the arena floor; the lidar was followed).
 * - Note on the dome's look: street photos taken close below it foreshorten
 *   the dome to a thin cap; the model follows the lidar section, which the
 *   aerial (Nugent) matches.
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Royal Albert Hall, London - Nov 2012.jpg", Diliff, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Royal_Albert_Hall,_London_-_Nov_2012.jpg
 *     (north front at dusk, level: every storey line, the north porch, the
 *     floodlighting);
 *   "Royal Albert Hall Rear, London, England - Diliff.jpg", Diliff, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Royal_Albert_Hall_Rear,_London,_England_-_Diliff.jpg
 *     (south front: the pedimented south porch, attic bands, dome ribs);
 *   "At Hyde Park 2023 036.jpg", Mike Peel, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:At_Hyde_Park_2023_036.jpg
 *     (north front, daylight colours: brick, buff, frieze, east/west porches);
 *   "Royal Albert Hall, Londres, Inglaterra, 2022-11-25, DD 02.jpg", Diego
 *     Delso, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Royal_Albert_Hall,_Londres,_Inglaterra,_2022-11-25,_DD_02.jpg
 *     (north porch face on: arch, columns, windows, parapet);
 *   "Royal Albert Hall from the air - geograph.org.uk - 2624007.jpg", Thomas
 *     Nugent, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:Royal_Albert_Hall_from_the_air_-_geograph.org.uk_-_2624007.jpg
 *     (from the air, south: dome ribs and glass, terrace, attic);
 *   "Kensington Museums aerial 2011 a.jpg", Andreas Praefcke, public domain,
 *     https://commons.wikimedia.org/wiki/File:Kensington_Museums_aerial_2011_a.jpg
 *     (from the air: plan, porches, roof colours).
 * - Look-only: none.
 *
 * Estimated (from the photos against the lidar): every storey line (base
 * 0-4, string course 9.3-10.3, arched windows 10.8-15.2, balcony 16.2-17.6,
 * upper windows 17.9-19.2, frieze 20.5-23.0, cornice 23.0-24.0, attic bands
 * 25.6 and 27.4), the bay count (11 per quarter between porches, ~4.1 m
 * bays), the porch openings and storey lines, the rib count (24 thin ribs; the real
 * dome has more).
 *
 * Doubts
 * - The frieze's figures, the inscription and the window tracery are left
 *   out; the frieze is one buff band.
 * - The south porch's steps down to Prince Consort Road and the Prince
 *   Albert statue are outside the outline and not drawn.
 * - The east and west porches are drawn alike from the corner views in the
 *   north photos; no face-on photo of either was used.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'

export const BEARING = 352.5
const ID = 'london-royal-albert-hall'

const TAU = Math.PI * 2
const nrm = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }

/** Two triangles with explicit (smooth) normals. */
function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n?: [V3, V3, V3, V3]) {
  p.tri(a, b, c, undefined, undefined, undefined, n && [n[0], n[1], n[2]])
  p.tri(a, c, d, undefined, undefined, undefined, n && [n[0], n[2], n[3]])
}

// ---------------------------------------------------------------------------
// The ellipse
// ---------------------------------------------------------------------------
const CX = 0.1, CY = 0.2
const A = 36.6, B = 41.7 // drum wall, semi-axes (x, y)
const NS = 40 // segments round the drum

type Ell = { a: number; b: number }
const DRUM: Ell = { a: A, b: B }
const ATTIC: Ell = { a: 29.4, b: 34.5 }

/** Outward unit normal of an ellipse at parameter t. */
const eN = (e: Ell, t: number): V3 => nrm([e.b * Math.cos(t), e.a * Math.sin(t), 0])
/** A point at parameter t, offset d along the normal, height z. */
const eP = (e: Ell, t: number, d: number, z: number): V3 => {
  const n = eN(e, t)
  return [CX + e.a * Math.cos(t) + n[0] * d, CY + e.b * Math.sin(t) + n[1] * d, z]
}
const tAt = (i: number, n = NS) => (i / n) * TAU

/** A vertical band of the wall, offset d, smooth-shaded. */
function wall(p: Part, e: Ell, z0: number, z1: number, d: number, n = NS) {
  for (let i = 0; i < n; i++) {
    const t0 = tAt(i, n), t1 = tAt(i + 1, n), n0 = eN(e, t0), n1 = eN(e, t1)
    quadN(p, eP(e, t0, d, z0), eP(e, t1, d, z0), eP(e, t1, d, z1), eP(e, t0, d, z1), [n0, n1, n1, n0])
  }
}
/** The same band facing inward (a parapet's back). */
function wallIn(p: Part, e: Ell, z0: number, z1: number, d: number, n = NS) {
  for (let i = 0; i < n; i++) {
    const t0 = tAt(i, n), t1 = tAt(i + 1, n), n0 = eN(e, t0).map((v) => -v) as V3, n1 = eN(e, t1).map((v) => -v) as V3
    quadN(p, eP(e, t1, d, z0), eP(e, t0, d, z0), eP(e, t0, d, z1), eP(e, t1, d, z1), [n1, n0, n0, n1])
  }
}
/** A horizontal annulus between offsets d0 (inner) and d1 (outer) at z, facing up or down. */
function ledge(p: Part, e: Ell, z: number, d0: number, d1: number, up: boolean, n = NS) {
  for (let i = 0; i < n; i++) {
    const t0 = tAt(i, n), t1 = tAt(i + 1, n)
    const a = eP(e, t0, d0, z), b = eP(e, t1, d0, z), c = eP(e, t1, d1, z), d = eP(e, t0, d1, z)
    if (up) p.quad(a, d, c, b)
    else p.quad(a, b, c, d)
  }
}
/** A proud band d out from the wall (d0 = 0), with its top and bottom ledges. */
function band(p: Part, e: Ell, z0: number, z1: number, d: number, d0 = 0, n = NS, under = true) {
  wall(p, e, z0, z1, d, n)
  ledge(p, e, z1, d0, d, true, n)
  if (under) ledge(p, e, z0, d0, d, false, n)
}

// Arc length → parameter, for placing bays evenly along the drum.
const arcTable = (() => {
  const M = 2000, s = [0]
  let prev = eP(DRUM, 0, 0, 0)
  for (let k = 1; k <= M; k++) {
    const q = eP(DRUM, (k / M) * TAU, 0, 0)
    s.push(s[k - 1] + Math.hypot(q[0] - prev[0], q[1] - prev[1]))
    prev = q
  }
  return s
})()
const PERIM = arcTable[arcTable.length - 1]
const sOfT = (t: number) => arcTable[Math.round((((t % TAU) + TAU) % TAU) / TAU * (arcTable.length - 1))]
const tOfS = (s: number) => {
  s = ((s % PERIM) + PERIM) % PERIM
  let lo = 0, hi = arcTable.length - 1
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (arcTable[m] < s) lo = m; else hi = m }
  return (lo / (arcTable.length - 1)) * TAU
}

// ---------------------------------------------------------------------------
// A local face frame: o on the face, u along it, n out of it
// ---------------------------------------------------------------------------
type Frame = { o: V3; u: V3; n: V3 }
const F = (f: Frame, s: number, z: number, d: number): V3 => [f.o[0] + f.u[0] * s + f.n[0] * d, f.o[1] + f.u[1] * s + f.n[1] * d, f.o[2] + z]
/** Tangent frame on the ellipse at t, offset d. */
const eFrame = (e: Ell, t: number, d = 0): Frame => {
  const n = eN(e, t)
  return { o: eP(e, t, d, 0), u: [-n[1], n[0], 0], n }
}
/** Axis-aligned face frames: the face at x or y = c, normal pointing ±. */
const faceX = (x: number, out: 1 | -1): Frame => ({ o: [x, 0, 0], u: [0, out, 0], n: [out, 0, 0] })
const faceY = (y: number, out: 1 | -1): Frame => ({ o: [0, y, 0], u: [-out, 0, 0], n: [0, out, 0] })

function panel(p: Part, f: Frame, s0: number, s1: number, z0: number, z1: number, d = 0.06) {
  p.quad(F(f, s0, z0, d), F(f, s1, z0, d), F(f, s1, z1, d), F(f, s0, z1, d))
}
function archPanel(p: Part, f: Frame, sc: number, w: number, z0: number, zs: number, d = 0.06, n = 6) {
  const r = w / 2
  panel(p, f, sc - r, sc + r, z0, zs, d)
  const c = F(f, sc, zs, d)
  for (let i = 0; i < n; i++) {
    const a0 = (Math.PI * i) / n, a1 = (Math.PI * (i + 1)) / n
    p.tri(c, F(f, sc + r * Math.cos(a0), zs + r * Math.sin(a0), d), F(f, sc + r * Math.cos(a1), zs + r * Math.sin(a1), d))
  }
}
/** A block standing on a face: s0..s1, z0..z1, d0..d1 out. Front, ends, top (and soffit). */
function proud(p: Part, f: Frame, s0: number, s1: number, z0: number, z1: number, d0: number, d1: number, bottom = false, top = true) {
  const P = (s: number, z: number, d: number) => F(f, s, z, d)
  p.quad(P(s0, z0, d1), P(s1, z0, d1), P(s1, z1, d1), P(s0, z1, d1))
  if (top) p.quad(P(s0, z1, d1), P(s1, z1, d1), P(s1, z1, d0), P(s0, z1, d0))
  p.quad(P(s0, z0, d0), P(s0, z0, d1), P(s0, z1, d1), P(s0, z1, d0))
  p.quad(P(s1, z0, d1), P(s1, z0, d0), P(s1, z1, d0), P(s1, z1, d1))
  if (bottom) p.quad(P(s0, z0, d0), P(s1, z0, d0), P(s1, z0, d1), P(s0, z0, d1))
}
/** A round column standing proud of a face. */
function column(p: Part, f: Frame, s: number, z0: number, z1: number, r: number, d: number, n = 8) {
  const c = F(f, s, 0, d)
  const ring = (z: number, rr: number) => Array.from({ length: n }, (_, i): V3 => [c[0] + rr * Math.cos((i / n) * TAU), c[1] + rr * Math.sin((i / n) * TAU), z])
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, a = (i / n) * TAU, b = (j / n) * TAU
    const na: V3 = [Math.cos(a), Math.sin(a), 0], nb: V3 = [Math.cos(b), Math.sin(b), 0]
    const r0 = ring(z0, r), r1 = ring(z1, r)
    quadN(p, r0[i], r0[j], r1[j], r1[i], [na, nb, nb, na])
  }
}

/**
 * A storey s0..s1, z0..z1 with a round-arched opening (centre sc, width w,
 * springing zs) recessed `dep` deep: the piers either side as blocks, the
 * spandrel over the arch, its soffit, and the back panel in `back`. The body
 * behind must stop `dep` short of the face.
 */
function archedWall(wallP: Part, back: Part, f: Frame, s0: number, s1: number, z0: number, z1: number, sc: number, w: number, zs: number, dep: number, n = 8) {
  const r = w / 2, P = (s: number, z: number, d: number) => F(f, s, z, d)
  proud(wallP, f, s0, sc - r, z0, z1, -dep, 0)
  proud(wallP, f, sc + r, s1, z0, z1, -dep, 0)
  const arc = Array.from({ length: n + 1 }, (_, i) => { const a = Math.PI - (Math.PI * i) / n; return [sc + r * Math.cos(a), zs + r * Math.sin(a)] as [number, number] })
  for (let i = 0; i < n; i++) {
    const [sa, za] = arc[i], [sb, zb] = arc[i + 1]
    wallP.quad(P(sa, za, 0), P(sb, zb, 0), P(sb, z1, 0), P(sa, z1, 0))
    wallP.quad(P(sa, za, 0), P(sa, za, -dep), P(sb, zb, -dep), P(sb, zb, 0)) // soffit
  }
  archPanel(back, f, sc, w, z0, zs, -dep + 0.02, n)
}

// ---------------------------------------------------------------------------
// Materials
// ---------------------------------------------------------------------------
const lit = (zMax: number) => (p: V3, n: V3) => (p[2] < zMax ? Math.max(0, 1 - Math.abs(n[2])) * (0.55 + 0.45 * (1 - p[2] / zMax)) : 0)
const M = {
  brick: { ...finish('rah-brick', 0xb86a55), floodlight: lit(31) } as MaterialSpec,
  buff: { ...finish('rah-buff', 0xe4d0a9), floodlight: lit(31) } as MaterialSpec,
  roof: PALETTE.roof as MaterialSpec,
  glass: { name: 'glass', color: 0xcdd5d8, roughness: 0.3 } as MaterialSpec,
  window: PALETTE.window as MaterialSpec,
  frieze: { ...finish('rah-frieze', 0xbb9670), floodlight: lit(31) } as MaterialSpec,
}
const brick = new Part(), buff = new Part(), roof = new Part(), glass = new Part(), win = new Part(), frieze = new Part()
const door = win // the doors glaze like the windows and glow with them

// ---------------------------------------------------------------------------
// The drum
// ---------------------------------------------------------------------------
const Z = {
  base: 4.0, string0: 9.3, string1: 10.3, arch0: 10.8, archS: 14.2, balc0: 16.2, balc1: 16.6, rail: 17.6,
  up0: 17.9, up1: 19.2, frieze0: 20.5, frieze1: 23.0, corn: 24.0, parapet: 24.7,
  attic: 29.4, atticTop: 30.2, crown: 44.0, lantern: 46.4,
}

wall(brick, DRUM, Z.base, Z.frieze0, 0)
band(buff, DRUM, 0, Z.base, 0.35, 0, NS, false)
band(buff, DRUM, Z.string0, Z.string1, 0.4)
// balcony gallery: slab on the wall, balustrade at its edge
band(buff, DRUM, Z.balc0, Z.balc1, 1.6)
wall(buff, DRUM, Z.balc1, Z.rail, 1.5)
ledge(buff, DRUM, Z.rail, 1.25, 1.5, true)
// the frieze, leaning a touch outward, and the cornice
wall(frieze, DRUM, Z.frieze0, Z.frieze1, 0.25)
ledge(frieze, DRUM, Z.frieze0, 0, 0.25, false)
band(buff, DRUM, Z.frieze1, Z.corn, 0.95, 0.25)
// parapet and the lead terrace behind it
wall(buff, DRUM, Z.corn, Z.parapet, 0.6)
ledge(buff, DRUM, Z.parapet, 0.25, 0.6, true)
wallIn(buff, DRUM, Z.corn, Z.parapet, 0.25)
// terrace: annulus from the attic ellipse to the parapet
for (let i = 0; i < NS; i++) {
  const t0 = tAt(i), t1 = tAt(i + 1)
  roof.quad(eP(ATTIC, t0, 0, Z.corn), eP(DRUM, t0, 0.3, Z.corn), eP(DRUM, t1, 0.3, Z.corn), eP(ATTIC, t1, 0, Z.corn))
}

// the attic drum, red brick with two buff bands and a cornice
for (const [z0, z1, part] of [[Z.corn, 25.4, brick], [25.4, 26.0, buff], [26.0, 27.2, brick], [27.2, 27.8, buff], [27.8, Z.attic, brick]] as [number, number, Part][]) wall(part, ATTIC, z0, z1, 0)
band(buff, ATTIC, Z.attic, Z.atticTop, 0.5, 0, NS, false)

// Bays: evenly along the drum, skipping the porches on the axes.
const porchT = [0, Math.PI / 2, Math.PI, -Math.PI / 2]
const porchHalf = [9.6, 9.6, 9.6, 9.6] // arc metres either side kept clear
const quarter = PERIM / 4
const bayS: number[] = [] // arc positions of bay centres
for (let q = 0; q < 4; q++) {
  const s0 = sOfT(porchT[q]) + porchHalf[q], s1 = sOfT(porchT[(q + 1) % 4] + (q === 3 ? TAU : 0)) - porchHalf[(q + 1) % 4]
  const span = ((s1 - s0) % PERIM + PERIM) % PERIM || quarter
  const nb = 10, w = (span) / nb
  for (let k = 0; k < nb; k++) bayS.push(s0 + w * (k + 0.5))
}
const bayW = (quarter - 2 * 9.6) / 10
for (const s of bayS) {
  const t = tOfS(s), f = eFrame(DRUM, t)
  // ground-floor window in a buff frame
  panel(buff, f, -0.95, 0.95, 4.6, 8.8, 0.08)
  panel(win, f, -0.7, 0.7, 4.85, 8.55, 0.14)
  // first floor: round-arched window
  archPanel(win, f, 0, 1.7, Z.arch0, Z.archS, 0.08)
  // upper small window
  panel(win, f, -0.55, 0.55, Z.up0, Z.up1, 0.08)
  // pilaster at the bay's edge (one per bay, the last closes against the porch)
  const fe = eFrame(DRUM, tOfS(s + bayW / 2))
  proud(buff, fe, -0.32, 0.32, Z.string1, Z.balc0, 0, 0.3, false, false)
}
// the pilasters against each porch's other side
for (let q = 0; q < 4; q++) {
  const fe = eFrame(DRUM, tOfS(sOfT(porchT[q]) + porchHalf[q]))
  proud(buff, fe, -0.32, 0.32, Z.string1, Z.balc0, 0, 0.3, false, false)
}

// ---------------------------------------------------------------------------
// The dome: parabolic-ish glazed shell with raised radial ribs, and lantern
// ---------------------------------------------------------------------------
const ND = 48, RINGS = 5, RIBS = 24
const DOME: Ell = { a: ATTIC.a - 0.6, b: ATTIC.b - 0.6 }
const z0d = Z.atticTop, hD = Z.crown - Z.atticTop, rL = 0.15 // lantern ring at r/a = 0.15
const domeZ = (k: number) => z0d + hD * (1 - k * k) // near-parabolic, as the lidar section
const dome = (t: number, k: number, lift = 0): V3 => {
  const z = domeZ(k) + lift
  return [CX + DOME.a * k * Math.cos(t), CY + DOME.b * k * Math.sin(t), z]
}
const domeNormal = (t: number, k: number): V3 => {
  const e = 1e-3, p = dome(t, k), pk = dome(t, Math.min(1, k + e)), pt = dome(t + e, k)
  const dk: V3 = [pk[0] - p[0], pk[1] - p[1], pk[2] - p[2]], dt: V3 = [pt[0] - p[0], pt[1] - p[1], pt[2] - p[2]]
  const n = nrm([dt[1] * dk[2] - dt[2] * dk[1], dt[2] * dk[0] - dt[0] * dk[2], dt[0] * dk[1] - dt[1] * dk[0]])
  return n[2] < 0 ? [-n[0], -n[1], -n[2]] : n
}
const ks = Array.from({ length: RINGS + 1 }, (_, r) => 1 - (1 - rL) * (r / RINGS))
for (let i = 0; i < ND; i++) {
  const t0 = tAt(i, ND), t1 = tAt(i + 1, ND)
  for (let r = 0; r < RINGS; r++) {
    const k0 = ks[r], k1 = ks[r + 1]
    quadN(glass, dome(t0, k0), dome(t1, k0), dome(t1, k1), dome(t0, k1), [domeNormal(t0, k0), domeNormal(t1, k0), domeNormal(t1, k1), domeNormal(t0, k1)])
  }
}
// ribs: a ridge along each meridian, standing proud, a little bolder at the foot
for (let j = 0; j < RIBS; j++) {
  const t = (j / RIBS) * TAU
  for (let r = 0; r < RINGS; r++) {
    const k0 = ks[r], k1 = ks[r + 1]
    const h0 = 0.18, h1 = 0.18
    const w0 = 0.16 / (DOME.a * Math.max(k0, 0.2)), w1 = 0.16 / (DOME.a * Math.max(k1, 0.2))
    const R0 = dome(t + w0, k0), T0 = dome(t, k0, h0)
    const L1 = dome(t - w1, k1), R1 = dome(t + w1, k1), T1 = dome(t, k1, h1)
    roof.quad(dome(t - w0, k0), T0, T1, L1)
    roof.quad(T0, R0, R1, T1)
  }
  // the vent gable at the foot of each rib
  const kf = 1, w = 0.012
  const a = dome(t - w, kf), b = dome(t + w, kf), top = dome(t, kf, 0.4)
  roof.tri(a, b, top)
}
// the low ring at the dome's foot
band(roof, DOME, z0d, z0d + 0.6, 0.05, -0.3, ND, false)
// lantern: a short drum, a lead cap
{
  const LA: Ell = { a: DOME.a * rL, b: DOME.b * rL }
  const zl = domeZ(rL)
  wall(buff, LA, zl - 0.2, zl + 0.9, 0, 16)
  wall(win, LA, zl + 0.9, zl + 1.6, -0.15, 16)
  const LB: Ell = { a: LA.a + 0.3, b: LA.b + 0.3 }
  ledge(roof, LB, zl + 1.6, -0.3 - LA.a * 0, 0, false, 16)
  for (let i = 0; i < 16; i++) {
    const t0 = tAt(i, 16), t1 = tAt(i + 1, 16)
    roof.tri(eP(LB, t0, 0, zl + 1.6), eP(LB, t1, 0, zl + 1.6), [CX, CY, Z.lantern])
  }
}

// ---------------------------------------------------------------------------
// Porches
// ---------------------------------------------------------------------------
/** A box between x0..x1, y0..y1, z0..z1 with chamfered vertical edges, no bottom. */
function cbox(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, c = 0.35, top = true) {
  const r = (z: number): V3[] => [
    [x0 + c, y0, z], [x1 - c, y0, z], [x1, y0 + c, z], [x1, y1 - c, z],
    [x1 - c, y1, z], [x0 + c, y1, z], [x0, y1 - c, z], [x0, y0 + c, z],
  ]
  p.loft([r(z0), r(z1)])
  if (top) p.cap(r(z1), true)
}
/** A balustrade along a face: rail on short posts with real gaps. */
function balustrade(p: Part, f: Frame, s0: number, s1: number, z0: number, h: number, d: number, posts: number) {
  proud(p, f, s0, s1, z0 + h - 0.25, z0 + h, d - 0.35, d, true)
  const step = (s1 - s0) / posts
  for (let k = 0; k <= posts; k++) {
    const s = s0 + step * k
    proud(p, f, s - 0.25, s + 0.25, z0, z0 + h - 0.25, d - 0.35, d)
  }
}

// North porch (towards Kensington Gore): x -8.1..8.0, y 40.8..50.4
{
  const x0 = -8.1, x1 = 8.0, yF = 50.4, yB = 38.5, xc = (x0 + x1) / 2, dep = 1.2
  const fN = faceY(yF, 1) // u runs toward -x
  const sc = -xc
  // body: the lower storey stops behind the arch's recess
  cbox(brick, x0, yB, x1, yF - dep, 0, 9.2, 0.35, false)
  cbox(brick, x0, yB, x1, yF, 9.2, 14.7, 0.35, false)
  // the great arch, glazed, down to the doors
  archedWall(brick, win, fN, sc - 8.05, sc + 8.05, 0, 9.2, sc, 6.3, 4.6, dep)
  // buff rusticated base on the piers, the arch's buff ring
  for (const sgn of [-1, 1]) {
    const a = sc + sgn * 3.15, b = sc + sgn * 8.25
    proud(buff, fN, Math.min(a, b), Math.max(a, b), 0, 4.0, 0, 0.2)
  }
  for (let i = 0; i < 8; i++) {
    const a0 = Math.PI - (Math.PI * i) / 8, a1 = Math.PI - (Math.PI * (i + 1)) / 8, R = 3.85
    const P = (a: number, rr: number, d: number) => F(fN, sc + rr * Math.cos(a), 4.6 + rr * Math.sin(a), d)
    buff.quad(P(a0, 3.15, 0.25), P(a1, 3.15, 0.25), P(a1, R, 0.25), P(a0, R, 0.25))
    buff.quad(P(a0, R, 0.25), P(a1, R, 0.25), P(a1, R, 0), P(a0, R, 0))
  }
  // aedicule niches either side of the arch
  for (const sgn of [-1, 1]) {
    const s = sc + sgn * 5.75
    proud(buff, fN, s - 1.3, s + 1.3, 4.6, 9.0, 0, 0.25)
    archPanel(roof, fN, s, 1.4, 5.2, 7.6, 0.31, 6)
  }
  // entablature over the ground storey
  proud(buff, fN, sc - 8.3, sc + 8.3, 9.2, 10.2, -0.1, 0.45, true)
  // upper storey: three tall windows between columns
  for (const k of [-1, 0, 1]) panel(win, fN, sc + k * 3.4 - (k === 0 ? 1.15 : 0.8), sc + k * 3.4 + (k === 0 ? 1.15 : 0.8), 10.7, 13.9, 0.06)
  for (const s of [-7.3, -5.4, -1.8, 1.8, 5.4, 7.3]) column(buff, fN, sc + s, 10.2, 14.7, 0.34, 0.4)
  proud(buff, fN, sc - 8.3, sc + 8.3, 14.7, 15.5, -0.1, 0.55, true)
  // the side faces: base, a window each storey, cornice
  for (const [x, out] of [[x0, -1], [x1, 1]] as [number, 1 | -1][]) {
    const fs = faceX(x, out), sA = out > 0 ? yB : -yF, sB = out > 0 ? yF : -yB, sm = out * 46
    proud(buff, fs, sA, sB, 0, 4.0, 0, 0.2)
    panel(win, fs, sm - 0.8, sm + 0.8, 10.7, 13.9, 0.06)
    archPanel(win, fs, sm, 1.6, 4.8, 7.4, 0.06)
    proud(buff, fs, sA, sB, 9.2, 10.2, -0.1, 0.45, true)
    proud(buff, fs, sA, sB, 14.7, 15.5, -0.1, 0.55, true)
  }
  // roof and balustraded parapet (posts with real gaps)
  roof.cap([[x0, yB, 15.5], [x1, yB, 15.5], [x1, yF, 15.5], [x0, yF, 15.5]], true)
  balustrade(buff, fN, sc - 7.9, sc + 7.9, 15.5, 1.1, 0.35, 8)
  proud(buff, fN, sc - 1.6, sc + 1.6, 15.5, 17.0, -0.4, 0.45) // central raised block
}

// South porch: x -9.1..7.4, y -50.4..-40.7, pedimented to the frieze
{
  const x0 = -9.1, x1 = 7.4, yF = -50.4, yB = -38.5, xc = (x0 + x1) / 2, dep = 1.0
  const fS = faceY(yF, -1) // u runs toward +x
  const sc = xc
  cbox(brick, x0, yF + dep, x1, yB, 0, 8.6, 0.35, false)
  cbox(brick, x0, yF, x1, yB, 8.6, 15.6, 0.35, false)
  // ground storey: doors in a real arched recess between buff-based piers
  archedWall(brick, door, fS, sc - 8.25, sc + 8.25, 0, 8.6, sc, 4.4, 4.0, dep)
  for (const sgn of [-1, 1]) {
    const a = sc + sgn * 2.2, b = sc + sgn * 8.45
    proud(buff, fS, Math.min(a, b), Math.max(a, b), 0, 3.5, 0, 0.2)
    proud(buff, fS, sc + sgn * 5.4 - 1.2, sc + sgn * 5.4 + 1.2, 3.5, 8.4, 0, 0.25)
    archPanel(roof, fS, sc + sgn * 5.4, 1.3, 4.3, 6.8, 0.31, 6)
  }
  proud(buff, fS, sc - 8.5, sc + 8.5, 8.6, 9.4, -0.1, 0.45, true)
  // upper storey: three windows between paired pilasters
  for (const k of [-1, 0, 1]) panel(win, fS, sc + k * 3.4 - 0.9, sc + k * 3.4 + 0.9, 9.9, 14.0, 0.06)
  for (const s of [-7.6, -6.6, -5.1, -1.7, 1.7, 5.1, 6.6, 7.6]) proud(buff, fS, sc + s - 0.3, sc + s + 0.3, 9.4, 14.6, 0, 0.3)
  proud(buff, fS, sc - 8.6, sc + 8.6, 14.6, 15.6, -0.1, 0.55, true)
  for (const [x, out] of [[x0, -1], [x1, 1]] as [number, 1 | -1][]) {
    const fs = faceX(x, out), sA = out > 0 ? yF : -yB, sB = out > 0 ? yB : -yF, sm = out * -46
    proud(buff, fs, sA, sB, 0, 3.5, 0, 0.2)
    panel(win, fs, sm - 0.8, sm + 0.8, 9.9, 14.0, 0.06)
    proud(buff, fs, sA, sB, 8.6, 9.4, -0.1, 0.45, true)
    proud(buff, fs, sA, sB, 14.6, 15.6, -0.1, 0.55, true)
  }
  // pediment: a solid gable prism, buff, with a lead roof, running back into the drum
  const zp = 15.6, apex = 19.6, d0 = -12, d1 = 0.45
  const P = (s: number, z: number, d: number) => F(fS, s, z, d)
  const L = sc - 8.6, R = sc + 8.6
  buff.tri(P(L, zp, d1), P(R, zp, d1), P(sc, apex, d1))
  roof.quad(P(L, zp, d1), P(sc, apex, d1), P(sc, apex, d0), P(L, zp, d0))
  roof.quad(P(sc, apex, d1), P(R, zp, d1), P(R, zp, d0), P(sc, apex, d0))
  archPanel(win, fS, sc, 2.6, zp + 0.5, zp + 1.0, d1 + 0.06, 6) // the tympanum's lunette
}

// East and west carriage porches: x ±(36.1..45.4), y -7.8..8.2, gabled
for (const side of [1, -1] as const) {
  const xi = 34.6 * side, xo = 45.4 * side, y0 = -7.8, y1 = 8.2, dep = 2.2
  const fO = faceX(xo, side)
  const yc = (y0 + y1) / 2, sc = side * yc
  const lo = (x: number, y: number) => Math.min(x, y), hi = (x: number, y: number) => Math.max(x, y)
  const xr = xo - side * dep
  cbox(brick, lo(xi, xr), y0, hi(xi, xr), y1, 0, 9.2, 0.35, false)
  cbox(brick, lo(xi, xo), y0, hi(xi, xo), y1, 9.2, 15.8, 0.35, false)
  // the outer face with the carriage arch (real recess)
  archedWall(brick, door, fO, sc - 8.0, sc + 8.0, 0, 9.2, sc, 6.0, 4.0, dep)
  for (const sgn of [-1, 1]) {
    const a = sc + sgn * 3.0, b = sc + sgn * 8.2
    proud(buff, fO, Math.min(a, b), Math.max(a, b), 0, 3.6, 0, 0.25)
  }
  for (let i = 0; i < 8; i++) {
    const a0 = Math.PI - (Math.PI * i) / 8, a1 = Math.PI - (Math.PI * (i + 1)) / 8, R = 3.7
    const Q = (a: number, rr: number, d: number) => F(fO, sc + rr * Math.cos(a), 4.0 + rr * Math.sin(a), d)
    buff.quad(Q(a0, 3.0, 0.25), Q(a1, 3.0, 0.25), Q(a1, R, 0.25), Q(a0, R, 0.25))
    buff.quad(Q(a0, R, 0.25), Q(a1, R, 0.25), Q(a1, R, 0), Q(a0, R, 0))
  }
  proud(buff, fO, sc - 8.2, sc + 8.2, 9.2, 10.0, -0.1, 0.45, true)
  archPanel(win, fO, sc, 2.6, 10.6, 13.0, 0.06)
  for (const s of [-6.5, -3.0, 3.0, 6.5]) proud(buff, fO, sc + s - 0.3, sc + s + 0.3, 10.0, 15.0, 0, 0.3)
  proud(buff, fO, sc - 8.2, sc + 8.2, 15.0, 15.8, -0.1, 0.5, true)
  // north and south faces: an arched window each storey
  for (const [y, out] of [[y1, 1], [y0, -1]] as [number, 1 | -1][]) {
    const fs = faceY(y, out), s = -out * (xi + xo) / 2, a = -out * xi, b = -out * xo
    proud(buff, fs, Math.min(a, b), Math.max(a, b), 0, 3.6, 0, 0.2)
    archPanel(win, fs, s, 1.6, 5.0, 7.6, 0.06)
    archPanel(win, fs, s, 1.6, 10.8, 13.2, 0.06)
    proud(buff, fs, Math.min(a, b), Math.max(a, b), 9.2, 10.0, -0.1, 0.4, true)
    proud(buff, fs, Math.min(a, b), Math.max(a, b), 15.0, 15.8, -0.1, 0.4, true)
  }
  // gabled lead roof, ridge along x, with a buff gable on the outer face
  const ze = 15.8, zr = 19.5, xin = 33.0 * side
  const G = (x: number, y: number, z: number): V3 => [x, y, z]
  const yo0 = y0 - 0.3, yo1 = y1 + 0.3
  if (side > 0) {
    roof.quad(G(xin, yo0, ze), G(xo, yo0, ze), G(xo, yc, zr), G(xin, yc, zr))
    roof.quad(G(xin, yc, zr), G(xo, yc, zr), G(xo, yo1, ze), G(xin, yo1, ze))
    buff.tri(G(xo, yo0, ze), G(xo, yo1, ze), G(xo, yc, zr))
  } else {
    roof.quad(G(xo, yo0, ze), G(xin, yo0, ze), G(xin, yc, zr), G(xo, yc, zr))
    roof.quad(G(xo, yc, zr), G(xin, yc, zr), G(xin, yo1, ze), G(xo, yo1, ze))
    buff.tri(G(xo, yo1, ze), G(xo, yo0, ze), G(xo, yc, zr))
  }
}

// ---------------------------------------------------------------------------
const parts = [
  { part: brick, material: M.brick },
  { part: buff, material: M.buff },
  { part: roof, material: M.roof },
  { part: glass, material: M.glass },
  { part: win, material: M.window },
  { part: frieze, material: M.frieze },
]
const tris = parts.reduce((s, { part }) => s + part.triangles, 0)
const glb = writeGlb('Royal Albert Hall', parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor' })
console.log(`${ID}: ${tris} triangles, ${glb.length} bytes; ` + parts.map(({ part, material }) => `${material.name} ${part.triangles}`).join(', '))
if (!process.env.LOOSE) {
  if (tris > 6500) throw new Error('triangle budget exceeded')
  if (glb.length > 250 * 1024) throw new Error('file budget exceeded')
}
await Bun.write(new URL(`../models/${ID}.glb`, import.meta.url).pathname, glb)
