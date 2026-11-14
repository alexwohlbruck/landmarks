/**
 * Tate Modern, Bankside, London: Sir Giles Gilbert Scott's Bankside Power
 * Station (1947-63, converted by Herzog & de Meuron 2000) and the Blavatnik
 * Building / Switch House (Herzog & de Meuron, 2016). Original procedural
 * geometry, CC0-1.0.
 *   bun generators/london-tate-modern.ts
 * writes models/london-tate-modern.glb (low) and
 * models/london-tate-modern.detail.glb (adds the Switch House brick lattice).
 *
 * Frame: turned to BEARING 4.6, the power station's long axis (its river
 * front runs along model +x = compass 94.6 deg). +y is model north (compass
 * 4.6, the Thames side), z up, metres. Origin = the area centroid of the OSM
 * outline way/24642569 (-0.0995125, 51.5075455) on the ground. y = 0 is the
 * riverside walk and Sumner Street plaza (EA lidar DTM: 5.8 m AOD on both
 * sides, flat within 0.3 m; ground_min of the box is the Thames).
 *
 * The Switch House is included: OSM maps it inside the same outline
 * (way/24642569 runs round both buildings), as building:parts
 * way/542122679-542122687 (height 64.5), so replacing the outline means
 * drawing it.
 *
 * What makes it Tate Modern, and how each is drawn
 * - The long brown brick box of the power station, 164 x 73 m and 27 m tall,
 *   with a projecting stepped cornice; the river front's tall recessed window
 *   groups (three each side of the chimney, five slots each between brick
 *   fins, real recesses), the two flanking bays beside the chimney with their
 *   horizontal windows, the pier string courses.
 * - The single central square chimney, projecting from the river front,
 *   slightly tapered, with its recessed vertical channels on each face and
 *   the band of short slots below the top; corners chamfered.
 * - The glass "light beam" along the top of the boiler house: a two-storey
 *   pale green glass box, 153 m long, set back 8 m from the river front, with
 *   a few mullions and one transom.
 * - The Switch House: a vertical-walled core (30.8 x 27.3 m, 64.6 m tall)
 *   wrapped by three leaning planar facets (south, east, and north rising
 *   off the old roof) that cut its corners on the diagonal: the "twisted
 *   pyramid". Each facet is the plane fitted to the lidar (rms 1.1-1.9 m).
 *   Ribbon windows cut across facets and core at six levels; the level-10
 *   viewing gallery is a real recessed loggia behind brick piers; the brick
 *   lattice (detail model) is staggered recessed slots in every face.
 * - The turbine hall's long glazed roof ridge; the low east annex.
 * - Night: windows, slots and the light beam glow (the light beam is lit
 *   after dark); brick and the Switch House stay unlit.
 *
 * Evidence
 * - OSM (ODbL): outline way/24642569 (Tate Modern, wikidata Q193375); parts
 *   way/123075369 (main block, 25 m, brick), way/123075376 (the glass
 *   light beam, 25-34 m), way/123075366 (chimney, 25-99 m),
 *   way/1391642133 and way/1391642134 (chimney flank bays, 5-12 m),
 *   way/542253509 (east annex, 7 m), way/542122679-542122687 (Switch House
 *   facets and top, 64.5 m).
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0 (composite of flights ~2000-2022; this site's tiles post-date the
 *   Switch House's 2016 completion: its 64.6 m top and leaning facets are in
 *   it). Measured above the street: river-front parapet 27.0; turbine hall
 *   and south range 25.8-27.7 (drawn 27); light beam top 36.1, its extent
 *   x -70..83, y 16.5..34.6; chimney top 92.3 (see doubts), its top about
 *   9-10 m square; Switch House top 64.6 over x -65.8..-35, y -58.5..-31.2;
 *   the facet planes (least squares over the lidar cells, in this frame):
 *     south  z = 1.818x + 3.498y + 329.80  (rms 1.6 m)
 *     east   z = -2.945x + 1.418y + 6.16   (rms 1.9 m)
 *     north  z = -0.810x - 2.260y - 58.81  (rms 1.1 m, rising off the roof)
 *   east annex 6.6; south-east wing 17.
 * - Published: chimney 99 m (Wikipedia "Tate Modern"; "Bankside Power
 *   Station"), Switch House 64.5 m and 10 storeys (Wikipedia; Tate). The
 *   lidar chimney top is 98.1 m AOD, 92.3 m above the riverside walk; the
 *   99 m figure fits a base at the turbine hall floor (about -1 m AOD). The
 *   model follows the lidar above the street.
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Millennium Bridge and Tate Modern from St Paul's Cathedral, London.jpg",
 *     orangeaurochs, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Millennium_Bridge_and_Tate_Modern_from_St_Paul%27s_Cathedral,_London.jpg
 *     (river front from the north, high and level: every bay, group and
 *     storey line was scaled from it, 9.3 px/m);
 *   "London - Bankside - Jubilee Walkway - View SE on Tate Modern.jpg",
 *     Txllxt TxllxT, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:London_-_Bankside_-_Jubilee_Walkway_-_View_SE_on_Tate_Modern.jpg
 *     (chimney: the vertical channels and top slot band);
 *   "London - Tate Modern The Switch House (1).jpg", Fred Romero, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:London_-_Tate_Modern_The_Switch_House_(1).jpg
 *     (from the west: west end slot group, Switch House west face, gallery);
 *   "Tate Modern Switch House (27633103611).jpg", Jim Linwood, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Tate_Modern_Switch_House_(27633103611).jpg
 *     (from the south: the leaning south facet, ribbon windows, the loggia);
 *   "Tate Modern exterior 2025-09-27.jpg", kp-snaps, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Tate_Modern_exterior_2025-09-27.jpg
 *     (west end, brick colours, Switch House beyond);
 *   "Panorama of the Exterior of Tate Modern (January 2024).jpg", DiscoA340,
 *     CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Panorama_of_the_Exterior_of_Tate_Modern_(January_2024).jpg
 *     (south side: Switch House base, south range windows);
 *   "Blavatnik Building, Tate Modern - geograph.org.uk - 8008005.jpg", Philip
 *     Halling, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:Blavatnik_Building,_Tate_Modern_-_geograph.org.uk_-_8008005.jpg
 *     (the lattice and ribbon windows close up);
 *   "The Switch House, Tate Modern 2025-08-07.jpg", Alex Hoekerd, CC0,
 *     https://commons.wikimedia.org/wiki/File:The_Switch_House,_Tate_Modern_2025-08-07.jpg
 *     (lattice in raking light: staggered protruding/recessed bricks).
 * - Look-only: none.
 *
 * Estimated: the window groups (centres 9.3 +/- 35, 50.5, 66 m, 6.6 m wide,
 * 5.5-21 m up) and flank-bay windows, scaled from the St Paul's photo; the
 * west and east end groups (one each, centred, from the west photos; the
 * east end was not photographed face on); the south range windows (from the
 * panorama); the ribbon window levels and lengths on the Switch House
 * (from the south and west photos; drawn as six levels, partial lengths);
 * the gallery band 56.8-60.8 m; the lattice pitch (drawn at about 3 x 2 m,
 * far coarser than the real 1-brick pitch).
 *
 * Doubts
 * - Chimney height: the lidar's 92.3 m above the street against the
 *   published 99 m (see above). The lidar was followed.
 * - The Switch House facets are single planes fitted to the lidar; the real
 *   facets fold slightly at the ribbon windows. The south-east corner, where
 *   the south and east facets meet, is simplified to a vertical cut at
 *   x = -34.5.
 * - The red brick plinth of the west end is not drawn (one material short).
 * - The east end face was not photographed; it carries one slot group like
 *   the west end.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { writeFileSync } from 'node:fs'

export const BEARING = 4.6
const ID = 'london-tate-modern'

// ---------------------------------------------------------------------------
// Kit: planar facets with real recessed openings
// ---------------------------------------------------------------------------
type P2 = [number, number]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scl = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const subv = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const unit = (a: V3): V3 => scl(a, 1 / (Math.hypot(a[0], a[1], a[2]) || 1))

/** A convex polygon, wound so its face points along `want` (flipped if not). */
function poly(p: Part, pts: V3[], want?: V3) {
  if (pts.length < 3) return
  let q = pts
  if (want) {
    let n: V3 = [0, 0, 0]
    for (let i = 0; i < q.length; i++) n = add(n, crs(q[i], q[(i + 1) % q.length]))
    if (dot(n, want) < 0) q = [...q].reverse()
  }
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}

/** Keep the part of a convex 2D polygon with a*s + b*t <= c. */
function clip2(pg: P2[], a: number, b: number, c: number): P2[] {
  const out: P2[] = []
  for (let i = 0; i < pg.length; i++) {
    const P = pg[i], Q = pg[(i + 1) % pg.length]
    const fp = a * P[0] + b * P[1] - c, fq = a * Q[0] + b * Q[1] - c
    if (fp <= 0) out.push(P)
    if ((fp < 0 && fq > 0) || (fp > 0 && fq < 0)) {
      const k = fp / (fp - fq)
      out.push([P[0] + (Q[0] - P[0]) * k, P[1] + (Q[1] - P[1]) * k])
    }
  }
  return out
}

/** Keep the part of a convex 3D polygon with n.p <= d. */
function clip3(pg: V3[], n: V3, d: number): V3[] {
  const out: V3[] = []
  for (let i = 0; i < pg.length; i++) {
    const P = pg[i], Q = pg[(i + 1) % pg.length]
    const fp = dot(n, P) - d, fq = dot(n, Q) - d
    if (fp <= 1e-9) out.push(P)
    if ((fp < -1e-9 && fq > 1e-9) || (fp > 1e-9 && fq < -1e-9)) {
      const k = fp / (fp - fq)
      out.push(add(P, scl(subv(Q, P), k)))
    }
  }
  return out
}

type Frame = { o: V3; u: V3; v: V3; n: V3 }
/** A facet's frame: n outward, u horizontal to the right seen from outside, v up the face. */
function frameOf(pg: V3[]): Frame {
  let n: V3 = [0, 0, 0]
  for (let i = 0; i < pg.length; i++) n = add(n, crs(pg[i], pg[(i + 1) % pg.length]))
  n = unit(n)
  let u = crs([0, 0, 1], n)
  if (Math.hypot(u[0], u[1], u[2]) < 1e-6) u = [1, 0, 0]
  u = unit(u)
  return { o: pg[0], u, v: crs(n, u), n }
}
const to2 = (f: Frame, p: V3): P2 => [dot(subv(p, f.o), f.u), dot(subv(p, f.o), f.v)]
const to3 = (f: Frame, s: number, t: number, d = 0): V3 => add(add(add(f.o, scl(f.u, s)), scl(f.v, t)), scl(f.n, d))

/** A recessed opening in facet coordinates. */
type Hole = { s0: number; s1: number; t0: number; t1: number; d: number; back: Part; side?: Part }

function inside2(pg: P2[], s: number, t: number) {
  for (let i = 0; i < pg.length; i++) {
    const P = pg[i], Q = pg[(i + 1) % pg.length]
    if ((Q[0] - P[0]) * (t - P[1]) - (Q[1] - P[1]) * (s - P[0]) < -1e-6) return false
  }
  return true
}

/**
 * A planar convex facet (counter-clockwise seen from outside) with
 * rectangular openings recessed into it: the face is cut into horizontal
 * strips at the openings' edges and each strip into cells, so the openings
 * are real holes with a back and reveals. Openings that do not fit inside
 * the facet, or overlap one already taken, are dropped.
 */
function facet(p: Part, pg3: V3[], holes: Hole[] = [], f = frameOf(pg3)) {
  const pg = pg3.map((q) => to2(f, q))
  const ok: Hole[] = []
  for (const h of holes) {
    if (!(h.s1 > h.s0 && h.t1 > h.t0)) continue
    if (![[h.s0, h.t0], [h.s1, h.t0], [h.s1, h.t1], [h.s0, h.t1]].every(([s, t]) => inside2(pg, s, t))) continue
    if (ok.some((k) => k.s0 < h.s1 && h.s0 < k.s1 && k.t0 < h.t1 && h.t0 < k.t1)) continue
    ok.push(h)
  }
  const ts = [...new Set([Math.min(...pg.map((q) => q[1])), Math.max(...pg.map((q) => q[1])), ...ok.flatMap((h) => [h.t0, h.t1])])].sort((a, b) => a - b)
  const emit = (cell: P2[]) => { if (cell.length >= 3) poly(p, cell.map(([s, t]) => to3(f, s, t)), f.n) }
  for (let i = 0; i < ts.length - 1; i++) {
    const ta = ts[i], tb = ts[i + 1]
    if (tb - ta < 1e-6) continue
    const strip = clip2(clip2(pg, 0, -1, -ta), 0, 1, tb)
    if (strip.length < 3) continue
    const act = ok.filter((h) => h.t0 <= ta + 1e-6 && h.t1 >= tb - 1e-6).sort((a, b) => a.s0 - b.s0)
    let from = -Infinity
    for (const h of act) {
      emit(clip2(from === -Infinity ? strip : clip2(strip, -1, 0, -from), 1, 0, h.s0))
      from = h.s1
    }
    emit(from === -Infinity ? strip : clip2(strip, -1, 0, -from))
  }
  for (const h of ok) recess(p, f, h)
}

/** The back and reveals of an opening. The head (facing down) is left out. */
function recess(p: Part, f: Frame, h: Hole) {
  const s = h.side ?? p
  const F = (a: number, b: number) => to3(f, a, b), B = (a: number, b: number) => to3(f, a, b, -h.d)
  poly(h.back, [B(h.s0, h.t0), B(h.s1, h.t0), B(h.s1, h.t1), B(h.s0, h.t1)], f.n)
  poly(s, [F(h.s0, h.t0), F(h.s1, h.t0), B(h.s1, h.t0), B(h.s0, h.t0)], f.v) // sill
  poly(s, [F(h.s0, h.t0), B(h.s0, h.t0), B(h.s0, h.t1), F(h.s0, h.t1)], f.u) // left reveal
  poly(s, [F(h.s1, h.t0), F(h.s1, h.t1), B(h.s1, h.t1), B(h.s1, h.t0)], scl(f.u, -1)) // right reveal
}

/** Facet-frame s for a world point, and t for a world height on that facet. */
const sAt = (f: Frame, p: V3) => dot(subv(p, f.o), f.u)
const tAtZ = (f: Frame, z: number) => (z - f.o[2]) / f.v[2]

/** A vertical wall quad from a to b (plan points, counter-clockwise round the building) between z0 and z1. */
const wallPoly = (a: P2, b: P2, z0: number, z1: number): V3[] => [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]]

/** A box with its corners chamfered by c, top capped. */
function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, c = 0.3, top = true) {
  const r = (z: number): V3[] => c > 0
    ? [[x0 + c, y0, z], [x1 - c, y0, z], [x1, y0 + c, z], [x1, y1 - c, z], [x1 - c, y1, z], [x0 + c, y1, z], [x0, y1 - c, z], [x0, y0 + c, z]]
    : [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  p.loft([r(z0), r(z1)])
  if (top) p.cap(r(z1), true)
}

/** Offset a counter-clockwise plan ring outward by d (mitred). */
function offsetRing(r: P2[], d: number): P2[] {
  const n = r.length
  return r.map((P, i) => {
    const A = r[(i - 1 + n) % n], C = r[(i + 1) % n]
    const e1 = unit([P[0] - A[0], P[1] - A[1], 0]), e2 = unit([C[0] - P[0], C[1] - P[1], 0])
    const n1: P2 = [e1[1], -e1[0]], n2: P2 = [e2[1], -e2[0]]
    const m: P2 = [n1[0] + n2[0], n1[1] + n2[1]]
    const k = d / (1 + n1[0] * n2[0] + n1[1] * n2[1])
    return [P[0] + m[0] * k, P[1] + m[1] * k] as P2
  })
}

/** A band standing proud of a plan ring by `out`, between z0 and z1 (a cornice or string course). */
function band(p: Part, r: P2[], z0: number, z1: number, out: number) {
  const o = offsetRing(r, out)
  const n = r.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    p.quad([o[i][0], o[i][1], z0], [o[j][0], o[j][1], z0], [o[j][0], o[j][1], z1], [o[i][0], o[i][1], z1])
    p.quad([r[i][0], r[i][1], z1], [o[i][0], o[i][1], z1], [o[j][0], o[j][1], z1], [r[j][0], r[j][1], z1])
    p.quad([r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], [o[j][0], o[j][1], z0], [o[i][0], o[i][1], z0])
  }
}

/** Chamfer the convex corners of a counter-clockwise plan ring by c. */
function chamfer(r: P2[], c: number): { ring: P2[]; cut: boolean[] } {
  const ring: P2[] = [], cut: boolean[] = []
  const n = r.length
  r.forEach((P, i) => {
    const A = r[(i - 1 + n) % n], C = r[(i + 1) % n]
    const convex = (P[0] - A[0]) * (C[1] - P[1]) - (P[1] - A[1]) * (C[0] - P[0]) > 0
    if (!convex) { ring.push(P); cut.push(false); return }
    const a = unit([A[0] - P[0], A[1] - P[1], 0]), b = unit([C[0] - P[0], C[1] - P[1], 0])
    ring.push([P[0] + a[0] * c, P[1] + a[1] * c]); cut.push(false)
    ring.push([P[0] + b[0] * c, P[1] + b[1] * c]); cut.push(true) // edge into this point is the chamfer
  })
  return { ring, cut }
}

/** Ear-clipping cap for a simple counter-clockwise plan ring at height z. */
function capRing(p: Part, r: P2[], z: number) {
  const idx = r.map((_, i) => i)
  const area = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const a = r[idx[(k - 1 + idx.length) % idx.length]], b = r[idx[k]], c = r[idx[(k + 1) % idx.length]]
      if (area(a, b, c) <= 1e-9) continue
      const blocked = idx.some((m) => {
        const q = r[m]
        if (q === a || q === b || q === c) return false
        return area(a, b, q) > 0 && area(b, c, q) > 0 && area(c, a, q) > 0
      })
      if (blocked) continue
      p.tri([a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z])
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) p.tri([...r[idx[0]], z] as V3, [...r[idx[1]], z] as V3, [...r[idx[2]], z] as V3)
}

// ---------------------------------------------------------------------------
// Materials
// ---------------------------------------------------------------------------
const M = {
  brick: finish('tate-brick', 0xa48b77),
  sh: finish('tate-switch-house-brick', 0x968579),
  shadow: finish('tate-brick-shadow', 0x6e5c51),
  window: PALETTE.window,
  beam: windowVariant(2, 0xa7c6bd),
  roof: PALETTE.roof,
}

function build(detail: boolean) {
  const brick = new Part(), sh = new Part(), shadow = new Part(), win = new Part(), beam = new Part(), roof = new Part()

  // -------------------------------------------------------------------------
  // The power station
  // -------------------------------------------------------------------------
  const H = 27
  const CHX = 9.3 // the chimney's (and the river front's) axis
  const MAIN: P2[] = [
    [-72.6, -13.4], [-65.7, -13.4], [-65.7, -30.8], [59.9, -30.8], [59.9, -13.0], [83.6, -13.0],
    [83.6, 34.6], [91.7, 34.6], [91.7, 42.3], [-72.6, 42.3],
  ]
  const { ring, cut } = chamfer(MAIN, 0.5)
  const groupsN = [-66, -50.5, -35, 35, 50.5, 66].map((d) => CHX + d)
  const slotGroup = (f: Frame, a: V3, n: number, w: number, z0: number, z1: number): Hole[] => {
    // n slots of width w between brick fins 0.45 wide, centred on a.
    const fin = 0.45, span = n * w + (n - 1) * fin, sc = sAt(f, a)
    return Array.from({ length: n }, (_, k) => {
      const s0 = sc - span / 2 + k * (w + fin)
      return { s0, s1: s0 + w, t0: tAtZ(f, z0), t1: tAtZ(f, z1), d: 0.9, back: win, side: brick }
    })
  }
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const pg = wallPoly(a, b, 0, H)
    const f = frameOf(pg)
    const holes: Hole[] = []
    if (!cut[(i + 1) % ring.length]) {
      const nx = f.n[0], ny = f.n[1]
      if (ny > 0.9 && a[1] > 42) {
        // River front: the window groups, and the flank bays beside the chimney.
        for (const x of groupsN) holes.push(...slotGroup(f, [x, 42.3, 0], 5, 0.95, 5.5, 21))
        for (const sgn of [-1, 1]) {
          const x0 = CHX + sgn * 6.6, x1 = CHX + sgn * 16.4
          const s0 = Math.min(sAt(f, [x0, 0, 0]), sAt(f, [x1, 0, 0])), s1 = Math.max(sAt(f, [x0, 0, 0]), sAt(f, [x1, 0, 0]))
          holes.push({ s0, s1, t0: tAtZ(f, 13.4), t1: tAtZ(f, 15.9), d: 0.5, back: win, side: brick })
          holes.push({ s0, s1, t0: tAtZ(f, 20.6), t1: tAtZ(f, 23.0), d: 0.5, back: win, side: brick })
          holes.push({ s0: s0 + 1, s1: s1 - 1, t0: tAtZ(f, 0.4), t1: tAtZ(f, 4.2), d: 0.6, back: win, side: brick })
        }
      } else if (nx < -0.9 && a[0] < -72) {
        holes.push(...slotGroup(f, [-72.6, 14.5, 0], 5, 0.95, 6, 21))
      } else if (nx > 0.9 && a[0] > 83 && a[0] < 84) {
        holes.push(...slotGroup(f, [83.6, 10.8, 0], 5, 0.95, 9, 21))
      } else if (ny < -0.9 && a[1] < -30) {
        // South range: the high row of windows east of the Switch House.
        for (let x = -9; x < 57; x += 6.6) {
          const s0 = Math.min(sAt(f, [x, 0, 0]), sAt(f, [x + 4, 0, 0]))
          holes.push({ s0, s1: s0 + 4, t0: tAtZ(f, 19.2), t1: tAtZ(f, 21.4), d: 0.5, back: win, side: brick })
        }
      }
    }
    facet(brick, pg, holes, f)
  }
  // Cornice, the pier string courses, roof.
  band(brick, ring, H - 1.3, H, 0.45)
  band(brick, ring, 0, 1.2, 0.2)
  capRing(roof, ring, H)
  // String courses over the river-front piers (between the groups), 22.3-23.
  {
    const edges = [-72.1, ...groupsN.flatMap((x) => [x - 3.7, x + 3.7]), 91.2].sort((a, b) => a - b)
    const flank = [CHX - 17, CHX + 17]
    for (let k = 0; k < edges.length - 1; k += 2) {
      let x0 = edges[k], x1 = edges[k + 1]
      if (x0 < flank[1] && x1 > flank[0]) { // split round the flank bays and chimney
        if (flank[0] - x0 > 1) box(brick, x0, 42.3 - 0.05, flank[0], 42.7, 22.2, 23.0, 0.12)
        if (x1 - flank[1] > 1) box(brick, flank[1], 42.3 - 0.05, x1, 42.7, 22.2, 23.0, 0.12)
        continue
      }
      box(brick, x0, 42.3 - 0.05, x1, 42.7, 22.2, 23.0, 0.12)
    }
  }
  // East annex (7 m) and the south-east wing (17 m).
  box(brick, 83.6, -5.5, 91.5, 34.6, 0, 6.6, 0.3)
  box(roof, 83.8, -5.3, 91.3, 34.4, 6.6, 6.9, 0.2)
  box(brick, 83.6, -13.0, 91.3, -5.5, 0, 17, 0.3)

  // The light beam: two-storey glass box on the boiler house.
  {
    const x0 = -70, x1 = 83, y0 = 16.5, y1 = 34.6, z0 = H, z1 = 36.2
    box(beam, x0, y0, x1, y1, z0, z1, 0.25, false)
    box(roof, x0 - 0.15, y0 - 0.15, x1 + 0.15, y1 + 0.15, z1, z1 + 0.5, 0.25)
    // A few mullions, one transom, the sill: pale frame proud of the glass.
    for (let x = x0 + 7.65; x < x1 - 1; x += 7.65) {
      box(roof, x - 0.18, y1 - 0.02, x + 0.18, y1 + 0.12, z0, z1, 0)
      box(roof, x - 0.18, y0 - 0.12, x + 0.18, y0 + 0.02, z0, z1, 0)
    }
    for (const z of [z0, (z0 + z1) / 2 + 0.2]) {
      box(roof, x0 - 0.1, y1 - 0.02, x1 + 0.1, y1 + 0.12, z, z + 0.35, 0)
      box(roof, x0 - 0.1, y0 - 0.12, x1 + 0.1, y0 + 0.02, z, z + 0.35, 0)
    }
  }
  // Turbine hall roof light: a long low glazed ridge.
  {
    const x0 = -60, x1 = 80, y0 = -2.6, y1 = 4.6, z0 = H, z1 = H + 1.8, ym = (y0 + y1) / 2
    beam.quad([x0, y0, z0], [x1, y0, z0], [x1, ym, z1], [x0, ym, z1])
    beam.quad([x1, y1, z0], [x0, y1, z0], [x0, ym, z1], [x1, ym, z1])
    roof.tri([x0, y1, z0], [x0, y0, z0], [x0, ym, z1])
    roof.tri([x1, y0, z0], [x1, y1, z0], [x1, ym, z1])
  }

  // The chimney: tapered square shaft with chamfered corners.
  {
    const cx = 9.1, cy = 40.2, h0 = 5.8, h1 = 4.85, top = 92.3, c = 0.45
    const ringAt = (h: number, z: number): V3[] => [
      [cx - h + c, cy - h, z], [cx + h - c, cy - h, z], [cx + h, cy - h + c, z], [cx + h, cy + h - c, z],
      [cx + h - c, cy + h, z], [cx - h + c, cy + h, z], [cx - h, cy + h - c, z], [cx - h, cy - h + c, z],
    ]
    const zc = top - 1.6 // the cap band starts here
    const hz = (z: number) => h0 + (h1 - h0) * (z / top)
    const r0 = ringAt(h0, 0), r1 = ringAt(hz(zc), zc)
    for (let k = 0; k < 8; k++) {
      const j = (k + 1) % 8
      const pg: V3[] = [r0[k], r0[j], r1[j], r1[k]]
      if (k % 2 === 1) { poly(brick, pg); continue } // chamfer strip
      const f = frameOf(pg)
      const holes: Hole[] = []
      const mid = (sAt(f, r0[k]) + sAt(f, r0[j])) / 2
      // Three vertical channels down the middle of each face.
      for (const o of [-1.5, 0, 1.5]) holes.push({ s0: mid + o - 0.38, s1: mid + o + 0.38, t0: tAtZ(f, 28), t1: tAtZ(f, 84), d: 0.45, back: shadow, side: brick })
      // The band of short slots under the top.
      for (const o of [-3.3, -2.2, -1.1, 0, 1.1, 2.2, 3.3]) {
        if (Math.abs(o) < 2) continue
        holes.push({ s0: mid + o - 0.32, s1: mid + o + 0.32, t0: tAtZ(f, 85.6), t1: tAtZ(f, 89.6), d: 0.5, back: shadow, side: brick })
      }
      holes.push({ s0: mid - 1.9, s1: mid + 1.9, t0: tAtZ(f, 85.6), t1: tAtZ(f, 89.6), d: 0.5, back: shadow, side: brick })
      facet(brick, pg, holes, f)
    }
    // Cap: a slightly proud band and the flat top.
    const capR = ringAt(hz(zc) + 0.3, zc), capT = ringAt(hz(zc) + 0.3, top)
    brick.loft([capR, capT])
    brick.cap(capT, true)
    for (let k = 0; k < 8; k++) {
      const j = (k + 1) % 8
      brick.quad(r1[k], r1[j], capR[j], capR[k])
    }
    // Entrance at the chimney's foot on the river side.
    poly(win, [[cx - 2.2, cy + h0 + 0.05, 0.3], [cx + 2.2, cy + h0 + 0.05, 0.3], [cx + 2.2, cy + h0 + 0.05, 4.4], [cx - 2.2, cy + h0 + 0.05, 4.4]], [0, 1, 0])
  }

  // -------------------------------------------------------------------------
  // The Switch House
  // -------------------------------------------------------------------------
  const X0 = -65.8, X1 = -35.0, Y0 = -58.5, Y1 = -31.2, TOP = 64.6
  // The three leaning facet planes, z = a x + b y + c (lidar fits).
  const S = [1.818, 3.498, 329.8], E = [-2.945, 1.418, 6.16], N = [-0.81, -2.26, -58.81]
  const zOf = (pl: number[], x: number, y: number) => pl[0] * x + pl[1] * y + pl[2]
  /** Half-space "below the plane": n.p <= d with n = (-a, -b, 1). */
  const below = (pl: number[]): [V3, number] => [[-pl[0], -pl[1], 1], pl[2]]
  const big = (pl: number[]): V3[] => {
    const q: P2[] = [[-120, -120], [20, -120], [20, 20], [-120, 20]]
    return q.map(([x, y]) => [x, y, zOf(pl, x, y)] as V3)
  }
  const clipAll = (pg: V3[], hs: [V3, number][]) => hs.reduce((acc, [n, d]) => clip3(acc, n, d), pg)
  /** Is a point inside the Switch House solid (strictly, by a margin)? */
  const insideSH = (q: V3, m = 0.25) => {
    const [x, y, z] = q
    if (x > X0 + m && x < X1 - m && y > Y0 + m && y < Y1 - m && z < TOP - m) return true
    if (y < Y0 - m && x > X0 + m && x < -34.5 - m && z < zOf(S, x, y) - m) return true
    if (x > X1 + m && y < Y1 - m && z < zOf(E, x, y) - m) return true
    if (y > Y1 + m && x > X0 + m && z < zOf(N, x, y) - m) return true
    return false
  }
  const hiddenInMain = (q: V3) => q[2] < H - 0.3 && q[1] > -30.8 && q[0] > -65.7

  type Face = { pg: V3[]; ribbons: boolean; loggia?: boolean }
  const faces: Face[] = []
  // Core faces, each cut to the part not inside a leaning facet.
  faces.push({ pg: clipAll([[X0, Y0, 0], [X1, Y0, 0], [X1, Y0, TOP], [X0, Y0, TOP]], [[[S[0], 0, -1], -(S[1] * Y0 + S[2])]]), ribbons: true, loggia: true })
  faces.push({ pg: clipAll([[X1, Y0, 0], [X1, Y1, 0], [X1, Y1, TOP], [X1, Y0, TOP]], [[[0, E[1], -1], -(E[0] * X1 + E[2])]]), ribbons: true, loggia: true })
  faces.push({ pg: clipAll([[X1, Y1, H - 0.3], [X0, Y1, H - 0.3], [X0, Y1, TOP], [X1, Y1, TOP]], [[[N[0], 0, -1], -(N[1] * Y1 + N[2])]]), ribbons: true, loggia: true })
  faces.push({ pg: [[X0 + 0.05, Y1, 0], [X0 + 0.05, Y0, 0], [X0 + 0.05, Y0, TOP], [X0 + 0.05, Y1, TOP]], ribbons: true, loggia: true })
  // Leaning facets.
  const zero: [V3, number] = [[0, 0, -1], 0]
  faces.push({ pg: clipAll(big(S), [zero, [[0, 1, 0], Y0], [[-1, 0, 0], -X0], [[1, 0, 0], -34.5]]), ribbons: true })
  faces.push({ pg: clipAll(big(E), [zero, [[0, 1, 0], Y1], [[-1, 0, 0], -X1], below(S)]), ribbons: true })
  faces.push({ pg: clipAll(big(N), [[[0, 0, -1], -(H - 0.3)], [[0, -1, 0], -Y1], [[-1, 0, 0], -X0]]), ribbons: true })
  // Vertical ends of the leaning facets.
  faces.push({ pg: clipAll([[-34.5, -90, 0], [-34.5, Y0, 0], [-34.5, Y0, 80], [-34.5, -90, 80]], [below(S), zero]), ribbons: false }) // south facet's east cut
  faces.push({ pg: clipAll([[0, Y1, 0], [X1, Y1, 0], [X1, Y1, 80], [0, Y1, 80]], [below(E), zero]), ribbons: false }) // east facet's north end
  faces.push({ pg: clipAll([[X0 + 0.02, -10, 0], [X0 + 0.02, Y1, 0], [X0 + 0.02, Y1, 80], [X0 + 0.02, -10, 80]], [below(N), [[0, 0, -1], -(H - 0.3)]]), ribbons: true }) // north facet's west end
  faces.push({ pg: clipAll([[X0 + 0.02, Y0, 0], [X0 + 0.02, -70, 0], [X0 + 0.02, -70, 80], [X0 + 0.02, Y0, 80]], [below(S), zero]), ribbons: false }) // south facet's west end
  // Roof and its parapet upstand.
  poly(roof, [[X0, Y0, TOP], [X1, Y0, TOP], [X1, Y1, TOP], [X0, Y1, TOP]], [0, 0, 1])

  // Ribbon windows: horizontal glazed bands at six levels, partial lengths.
  const LEVELS = [
    { z: 4.4, h: 2.4, a: 0.03, b: 0.97 },
    { z: 12.8, h: 1.3, a: 0.05, b: 0.75 },
    { z: 17.8, h: 1.2, a: 0.3, b: 0.95 },
    { z: 22.6, h: 2.0, a: 0.03, b: 0.97 },
    { z: 28.4, h: 1.2, a: 0.08, b: 0.8 },
    { z: 33.6, h: 1.2, a: 0.25, b: 0.95 },
    { z: 38.8, h: 1.2, a: 0.05, b: 0.9 },
    { z: 43.8, h: 1.2, a: 0.2, b: 0.95 },
    { z: 48.8, h: 1.2, a: 0.06, b: 0.85 },
    { z: 53.0, h: 1.0, a: 0.3, b: 0.95 },
  ]
  const GAL = { z0: 56.8, z1: 60.8 }
  for (const face of faces) {
    if (face.pg.length < 3) continue
    const f = frameOf(face.pg)
    const pg2 = face.pg.map((q) => to2(f, q))
    const holes: Hole[] = []
    const visible = (s: number, t: number) => { const q = to3(f, s, t, 0.3); return !insideSH(q, 0.05) && !hiddenInMain(q) }
    /** The s-range of the facet usable at heights z0..z1, trimmed to what is visible. */
    const span = (z0: number, z1: number, m = 0.8): [number, number] | null => {
      const t0 = tAtZ(f, z0), t1 = tAtZ(f, z1)
      const st = clip2(clip2(pg2, 0, -1, -t0), 0, 1, t1)
      if (st.length < 3) return null
      let lo = -Infinity, hi = Infinity
      for (const t of [t0, t1]) {
        const row = clip2(clip2(pg2, 0, -1, -(t - 1e-4)), 0, 1, t + 1e-4)
        if (row.length < 2) return null
        lo = Math.max(lo, Math.min(...row.map((q) => q[0])) + m)
        hi = Math.min(hi, Math.max(...row.map((q) => q[0])) - m)
      }
      // Trim to the visible part (sampled).
      const n = 40, ok: number[] = []
      for (let k = 0; k <= n; k++) {
        const s = lo + ((hi - lo) * k) / n
        if (visible(s, t0) && visible(s, t1)) ok.push(s)
      }
      if (ok.length < 2) return null
      return hi - lo > 1 ? [Math.min(...ok), Math.max(...ok)] : null
    }
    const taken: [number, number][] = [] // z ranges with openings
    if (face.ribbons) {
      for (const L of LEVELS) {
        const r = span(L.z, L.z + L.h)
        if (!r) continue
        const w = r[1] - r[0]
        const s0 = r[0] + w * L.a, s1 = r[0] + w * L.b
        if (s1 - s0 < 3) continue
        holes.push({ s0, s1, t0: tAtZ(f, L.z), t1: tAtZ(f, L.z + L.h), d: 0.7, back: win, side: roof })
        taken.push([L.z - 0.3, L.z + L.h + 0.3])
      }
    }
    if (face.loggia) {
      // The level-10 gallery: openings between brick piers, deep recess.
      const r = span(GAL.z0, GAL.z1, 1.2)
      if (r) {
        const n = Math.max(1, Math.round((r[1] - r[0]) / 3.8))
        const pitch = (r[1] - r[0]) / n
        for (let k = 0; k < n; k++) {
          const s0 = r[0] + k * pitch + 0.6, s1 = r[0] + (k + 1) * pitch - 0.6
          holes.push({ s0, s1, t0: tAtZ(f, GAL.z0), t1: tAtZ(f, GAL.z1), d: 1.6, back: win, side: sh })
        }
        taken.push([GAL.z0 - 0.3, GAL.z1 + 0.3])
      }
    }
    if (detail) {
      // The brick lattice: staggered rows of short recessed slots.
      const zs = face.pg.map((q) => q[2])
      const zmin = Math.min(...zs), zmax = Math.max(...zs)
      let row = 0
      for (let z = Math.ceil(zmin / 1.75) * 1.75 + 0.4; z + 0.55 < zmax - 1; z += 1.75, row++) {
        if (taken.some(([a, b]) => z < b && z + 0.55 > a)) continue
        const r = span(z, z + 0.55, 0.7)
        if (!r) continue
        const pitch = 3.0, off = row % 2 ? pitch / 2 : 0
        for (let s = Math.ceil((r[0] - off) / pitch) * pitch + off; s + 2.2 <= r[1]; s += pitch) {
          holes.push({ s0: s, s1: s + 2.2, t0: tAtZ(f, z), t1: tAtZ(f, z + 0.55), d: 0.3, back: shadow, side: sh })
        }
      }
    }
    facet(sh, face.pg, holes, f)
  }
  // Roof parapet and the gallery's top band edge.
  band(sh, [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]], TOP - 0.6, TOP + 0.5, 0.15)

  return [
    { part: brick, material: M.brick },
    { part: sh, material: M.sh },
    { part: shadow, material: M.shadow },
    { part: win, material: M.window },
    { part: beam, material: M.beam },
    { part: roof, material: M.roof },
  ]
}

if (import.meta.main) {
  const extras = { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor' }
  for (const [detail, file] of [[false, `models/${ID}.glb`], [true, `models/${ID}.detail.glb`]] as const) {
    const parts = build(detail)
    const tris = parts.reduce((s, { part }) => s + part.triangles, 0)
    const glb = writeGlb('Tate Modern', parts, extras)
    writeFileSync(new URL(`../${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
