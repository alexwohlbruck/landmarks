/**
 * Cairo Tower (Borg El-Qahira), Gezira Island, Cairo (Naoum Shebib,
 * 1956-61): procedural, CC0-1.0.
 * bun generators/cairo-cairo-tower.ts
 *
 * Writes two levels of detail in the same frame and materials:
 * - models/cairo-cairo-tower.glb (low, under 6,500 triangles): the lattice
 *   as its outer skin over the shadowed core, the crown, the pavilion;
 * - models/cairo-cairo-tower.detail.glb (under 40,000): the same lattice
 *   with its reveals (the bands are 0.9 m deep), the cabin's mullion piers,
 *   the pavilion's entrance steps, portal and eagle.
 *
 * Also exports the small geometry kit the other Cairo generators use
 * (`tri`, `quad`, `lathe`, `dome`, `prism`, `box`, `panel`, `save` ...).
 *
 * Frame: origin at the centre of the shaft (OSM building:part way/999697744,
 * which sits on the centre of the pavilion outline way/767933342 within
 * 0.3 m); bearing 358.8, the pavilion's sides (the outline's edges run
 * 1.2 degrees anticlockwise of the compass). +y is north: the main
 * entrance (OSM node 11438548085, entrance=main) is on the north face.
 *
 * Heights. Published: 187 m overall (en.wikipedia "Cairo Tower"); OSM gives
 * the pavilion 20 m (way/999697745), the concrete shaft 155 m
 * (way/999697744) and the mast 187 m (way/1000929041). Measured from the
 * near-orthographic telephoto "Cairotower.jpg" (Ahmedsantos), scaled by the
 * shaft's 19 m width (OSM part, 20.3 m across its polygon): the lattice
 * cells 3.4 m wide (18 round the shaft, from the LED nodes' spacing) and
 * 7.2 m tall; the lattice's
 * flared petal tips at 128.5 m; the cabin's top ring at 146 m, its two
 * window rows 136.5-140 and 141.5-145; the cabin 15.9 m across; the
 * top drum 7.5 m across to 152.5 m (OSM's 155 is this drum with its
 * railing); the mast 30 m, trumpet-footed, with a 4.6 m disc at 181 m and
 * antennas to 187. "Cairo tower on the Nile.jpg" (Kormoran, distant, level)
 * gives the same within 3 m. Shaft radius 9.35 m at the pavilion roof to
 * 9.75 m under the flare (the telephoto reads it 5% wider at the top).
 * Pavilion: OSM outline (23.4 x 24.4 m), 20 m (OSM); its north front from
 * "Cairo Tower Entrance.jpg" (LeCaire), scaled by the 23.4 m width:
 * stone frame 1.3 m, the inner portal 17 m wide and 15.2 m high, the
 * central stone panel 9.4 m with the Eagle of Saladin, glazed doors 5.6 m,
 * the steps 1.8 m high. Estimated: lattice band width (0.75 m) and depth
 * (0.9 m), the core's set-back, the cabin roof, the eagle's outline.
 *
 * Ground: the map's terrain (Mapterhorn, z12; z13-15 404 here) falls
 * about 1.5 m across the footprint from west to east; the pavilion walls
 * go down to y = 0 and its glazing starts at the steps' top, 1.8 m.
 * Elevation 0.
 *
 * Simplified or left out: the lattice's real bands are tapered and
 * slightly curved; the 2009 steel floors inside the base of the lattice;
 * the restaurant's railings and antennas but one; the entrance's
 * handrails; the pavilion's other three faces show only the stone frame
 * and glazing (no licensed photo of them was found).
 *
 * Colours from the daylight photos: the concrete is a warm sand
 * (#d6c6a6 in sun) pulled to the palette's lightness; the core seen through
 * the cells is the same concrete in shadow; the pavilion is a tan granite
 * with blue reflective glass, pulled light.
 *
 * Night: the lattice is lit by LEDs at its nodes (usually purple or
 * white) and reads floodlit: the lattice carries `_FLOODLIGHT`; the
 * restaurant windows and the pavilion glazing glow (`window`, `window-2`).
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - "Cairotower.jpg", Ahmedsantos, CC BY-SA 3.0 (telephoto at dusk, main ruler)
 *   https://commons.wikimedia.org/wiki/File:Cairotower.jpg
 * - "Cairo Tower in 2025.jpg", BavKraft, CC0 (north-west street view, crown detail)
 *   https://commons.wikimedia.org/wiki/File:Cairo_Tower_in_2025.jpg
 * - "Cairo Tower 2011.JPG", Christophe Badoux, CC BY-SA 3.0 (from the base, lattice and petals)
 *   https://commons.wikimedia.org/wiki/File:Cairo_Tower_2011.JPG
 * - "Cairo Tower Entrance.jpg", LeCaire, CC BY-SA 3.0 (north entrance front)
 *   https://commons.wikimedia.org/wiki/File:Cairo_Tower_Entrance.jpg
 * - "Cairo tower on the Nile.jpg", Kormoran, CC BY-SA 3.0 (from the east bank, distant)
 *   https://commons.wikimedia.org/wiki/File:Cairo_tower_on_the_Nile.jpg
 * - "Cairo Tower 2012.JPG", Mohamed Ouda, CC BY-SA 3.0 (night, white lighting)
 *   https://commons.wikimedia.org/wiki/File:Cairo_Tower_2012.JPG
 * Look-only: none.
 *
 * Doubts: the lattice count (18 round, from the node spacing in the
 * telephoto; counting petal tips in two other photos gave 16 to 18)
 * and its band width; the pavilion's east, south and west faces;
 * the 20 m pavilion height is OSM's (the entrance photo agrees within a
 * metre or two).
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

// ───────────────────────────── shared kit ─────────────────────────────────
// Map frame: x east, y north, z up (in the model's turned frame). Every face
// is given its outward normal; Part.tri winds it to agree.

export type XY = [number, number]
export type Mat = { part: Part; material: MaterialSpec }
export const TAU = Math.PI * 2
export const Z: V3 = [0, 0, 1]
export const norm = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / l, v[1] / l, v[2] / l]
}
export const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]

export function tri(p: Part, a: V3, b: V3, c: V3, n: V3 | V3[]) {
  const ns = Array.isArray(n[0]) ? (n as V3[]) : [n as V3, n as V3, n as V3]
  p.tri(a, b, c, [0, 0], [0, 0], [0, 0], ns)
}
export function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3 | V3[]) {
  const ns = Array.isArray(n[0]) ? (n as V3[]) : [n as V3, n as V3, n as V3, n as V3]
  tri(p, a, b, c, [ns[0], ns[1], ns[2]])
  tri(p, a, c, d, [ns[0], ns[2], ns[3]])
}
/** A convex planar polygon, fanned from its first corner. */
export function face(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) tri(p, pts[0], pts[i], pts[i + 1], n)
}

/**
 * A surface of revolution about the vertical axis at (cx, cy): `prof` runs
 * from bottom to top as [r, z]. Smooth round the axis; along the profile,
 * `smooth` averages the normals of neighbouring segments (domes), otherwise
 * each segment keeps its own (sharp ledges). `facet` flat-shades each
 * side (polygonal drums); `inside` turns the faces to look at the axis.
 */
export function lathe(p: Part, cx: number, cy: number, prof: [number, number][], n: number,
  o: { smooth?: boolean; a0?: number; a1?: number; phase?: number; facet?: boolean; inside?: boolean } = {}) {
  const a0 = o.a0 ?? 0, a1 = o.a1 ?? TAU, ph = o.phase ?? 0, sg = o.inside ? -1 : 1
  const segN = prof.slice(0, -1).map((q, k) => {
    const dr = prof[k + 1][0] - q[0], dz = prof[k + 1][1] - q[1]
    const l = Math.hypot(dr, dz) || 1
    return [dz / l, -dr / l] as [number, number]
  })
  const vN = (k: number, seg: number): [number, number] => {
    if (!o.smooth) return segN[seg]
    const a = segN[Math.max(0, k - 1)], b = segN[Math.min(segN.length - 1, k)]
    const r = a[0] + b[0], z = a[1] + b[1], l = Math.hypot(r, z) || 1
    return [r / l, z / l]
  }
  const at = (r: number, z: number, t: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
  const nn = (q: [number, number], t: number): V3 => norm([sg * q[0] * Math.cos(t), sg * q[0] * Math.sin(t), sg * q[1]])
  for (let i = 0; i < n; i++) {
    const t0 = ph + a0 + ((a1 - a0) * i) / n, t1 = ph + a0 + ((a1 - a0) * (i + 1)) / n
    const tm = (t0 + t1) / 2
    for (let k = 0; k < prof.length - 1; k++) {
      const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
      if (Math.abs(r0 - r1) < 1e-9 && Math.abs(z0 - z1) < 1e-9) continue
      const A = at(r0, z0, t0), B = at(r0, z0, t1), C = at(r1, z1, t1), D = at(r1, z1, t0)
      let nA = nn(vN(k, k), t0), nB = nn(vN(k, k), t1), nC = nn(vN(k + 1, k), t1), nD = nn(vN(k + 1, k), t0)
      if (o.facet) nA = nB = nC = nD = nn(segN[k], tm)
      if (r0 < 1e-6) tri(p, A, C, D, [nA, nC, nD])
      else if (r1 < 1e-6) tri(p, A, B, C, [nA, nB, nC])
      else quad(p, A, B, C, D, [nA, nB, nC, nD])
    }
  }
}

/** A spherical cap's profile: base radius rb at zb, crown at zb + rise. */
export function domeProfile(rb: number, zb: number, rise: number, rings: number): [number, number][] {
  const R = (rb * rb + rise * rise) / (2 * rise), zc = zb + rise - R
  const t0 = Math.asin(Math.min(1, rb / R))
  const out: [number, number][] = []
  for (let k = 0; k <= rings; k++) {
    const t = t0 * (1 - k / rings)
    out.push([R * Math.sin(t), zc + R * Math.cos(t)])
  }
  out[rings][0] = 0
  return out
}
export function dome(p: Part, cx: number, cy: number, rb: number, zb: number, rise: number, n: number, rings: number, phase = 0) {
  lathe(p, cx, cy, domeProfile(rb, zb, rise, rings), n, { smooth: true, phase })
}

/** A vertical prism over a convex ring (counter-clockwise from above); `top` caps it. */
export function prism(side: Part | null, top: Part | null, ring: XY[], z0: number, z1: number | number[], bottom: Part | null = null) {
  const zt = (i: number) => (Array.isArray(z1) ? z1[i] : z1)
  if (side) for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length
    const [ax, ay] = ring[i], [bx, by] = ring[j]
    const n = norm([by - ay, -(bx - ax), 0])
    quad(side, [ax, ay, z0], [bx, by, z0], [bx, by, zt(j)], [ax, ay, zt(i)], n)
  }
  if (top) {
    const pts = ring.map(([x, y], i) => [x, y, zt(i)] as V3)
    const a = pts[0], b = pts[1], c = pts[2]
    const n = norm([(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])])
    face(top, pts, n[2] < 0 ? [-n[0], -n[1], -n[2]] : n)
  }
  if (bottom) face(bottom, ring.map(([x, y]) => [x, y, z0] as V3).reverse(), [0, 0, -1])
}
/** A box with chamfered vertical edges (chamfer b); sides to `side`, top to `top`. */
export function box(side: Part | null, top: Part | null, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, b = 0) {
  prism(side, top, chamferRect(x0, x1, y0, y1, b), z0, z1)
}
export function chamferRect(x0: number, x1: number, y0: number, y1: number, b = 0): XY[] {
  return b > 0
    ? [[x0 + b, y0], [x1 - b, y0], [x1, y0 + b], [x1, y1 - b], [x1 - b, y1], [x0 + b, y1], [x0, y1 - b], [x0, y0 + b]]
    : [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
}
/** A box turned to a horizontal direction u, centred on (cx, cy). */
export function obox(side: Part | null, top: Part | null, cx: number, cy: number, u: XY, hu: number, hv: number, z0: number, z1: number | number[]) {
  const v: XY = [-u[1], u[0]]
  const c = (su: number, sv: number): XY => [cx + u[0] * su + v[0] * sv, cy + u[1] * su + v[1] * sv]
  prism(side, top, [c(-hu, -hv), c(hu, -hv), c(hu, hv), c(-hu, hv)], z0, z1)
}
/** A regular polygon ring, counter-clockwise. */
export const ngon = (cx: number, cy: number, r: number, n: number, a0 = 0): XY[] =>
  Array.from({ length: n }, (_, i) => [cx + r * Math.cos(a0 + (TAU * i) / n), cy + r * Math.sin(a0 + (TAU * i) / n)] as XY)

/** The horizontal direction to the right of a viewer facing a wall with outward normal n. */
export const rightOf = (n: V3): V3 => [-n[1], n[0], 0]

/**
 * A flat panel on a wall: centred at `at` (on the wall, at its bottom), `w`
 * wide and `h` tall, with a round (semicircular) top when `arch` is
 * 'round', or a pointed (two-centred) one when 'pointed'. `off` is how far
 * proud of the wall it sits.
 */
export function panel(p: Part, at: V3, n: V3, w: number, h: number, arch: false | 'round' | 'pointed' | 'keel' | boolean = false, segs = 6, off = 0.06) {
  const u = rightOf(n), o = add(at, n, off)
  const P = (s: number, z: number): V3 => [o[0] + u[0] * s, o[1] + u[1] * s, o[2] + z]
  const pts = archOutline(-w / 2, w / 2, 0, h, arch === true ? 'round' : arch, segs)
  face(p, pts.map(([s, z]) => P(s, z)), n)
}

/**
 * An opening's outline in a wall's (s, z): from s0 to s1, sill z0, head at
 * zt (the apex of an arch). Counter-clockwise; convex.
 */
export function archOutline(s0: number, s1: number, z0: number, zt: number, arch: false | 'round' | 'pointed' | 'keel', segs = 6): XY[] {
  const w = s1 - s0, r = w / 2, c = (s0 + s1) / 2
  if (!arch) return [[s0, z0], [s1, z0], [s1, zt], [s0, zt]]
  if (arch === 'round') {
    const zs = zt - r
    const pts: XY[] = [[s0, z0], [s1, z0]]
    for (let i = 0; i <= segs; i++) {
      const t = (Math.PI * i) / segs
      pts.push([c + r * Math.cos(t), zs + r * Math.sin(t)])
    }
    return pts
  }
  // Pointed: two arcs of radius R = 0.85 w meeting at the apex; keel: the
  // same with straight upper legs (the Fatimid keel arch).
  const R = arch === 'keel' ? 0.62 * w : 0.85 * w
  const aR = Math.acos((r - (w - R)) / R) // the right arc's sweep from the springing
  const rise = R * Math.sin(aR), zs = zt - rise
  const pts: XY[] = [[s0, z0], [s1, z0], [s1, zs]]
  const half = Math.max(2, Math.ceil(segs / 2))
  const keelStop = arch === 'keel' ? 0.55 : 1
  for (let i = 1; i <= half; i++) {
    const a = (aR * keelStop * i) / half
    pts.push([s1 - R + R * Math.cos(a), zs + R * Math.sin(a)])
  }
  pts.push([c, zt])
  for (let i = half; i >= 1; i--) {
    const a = (aR * keelStop * i) / half
    pts.push([s0 + R - R * Math.cos(a), zs + R * Math.sin(a)])
  }
  pts.push([s0, zs])
  return pts
}

/** Write a GLB in the models directory, under the given triangle and byte limits. */
export async function save(file: string, name: string, parts: Mat[], limit: number, bytes: number, extras: Record<string, unknown>) {
  const used = parts.filter((m) => m.part.triangles > 0)
  const triangles = used.reduce((n, { part }) => n + part.triangles, 0)
  if (used.length > 6) throw new Error(`${file}: ${used.length} materials`)
  if (triangles > limit) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', ...extras })
  if (glb.length > bytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes; ` + used.map((m) => `${m.material.name} ${m.part.triangles}`).join(', '))
}

// ───────────────────────────── the tower ──────────────────────────────────

const NL = 18 // lattice cells round the shaft
const Z0 = 16.9, DZ = 3.6, ROWS = 31 // node rows: z = Z0 + j DZ; the top row is the petal tips
const ZT = Z0 + ROWS * DZ // 128.5
const ZF = 113 // where the lattice starts to flare
const BAND = 1.15, DEPTH = 0.9
/** The lattice's outer radius at height z. */
const R = (z: number) => (z <= ZF ? 9.35 + (0.4 * (z - 20)) / (ZF - 20) : 9.75 + 2.25 * Math.pow((z - ZF) / (ZT - ZF), 1.5))
const PH = TAU / NL / 4 // turn the lattice so no node sits on a face's centre line

const PAV_X = 11.7, PAV_Y = 12.2, PAV_H = 20
const CAB_R = 7.95

function build(detail: boolean): Mat[] {
  const conc = new Part() // the lattice and the crown's concrete
  const core = new Part() // the core seen through the cells, in shadow
  const gran = new Part() // the pavilion's granite
  const win = new Part() // restaurant windows
  const glaze = new Part() // the pavilion's blue glass
  const bronze = new Part() // the eagle, the mast's antenna and disc rim

  // ── The lattice: an outer skin of crossing bands (rhombus nodes and the
  // band segments between them), with the cells open onto the core.
  const pos = (th: number, z: number, d: number): V3 => {
    const r = R(z) - d
    return [r * Math.cos(th), r * Math.sin(th), z]
  }
  const radial = (th: number, z: number): V3 => {
    // outward normal of the surface of revolution r = R(z)
    const e = 0.05, dr = (R(z + e) - R(z - e)) / (2 * e)
    return norm([Math.cos(th), Math.sin(th), -dr])
  }
  // A node is (k, j) with k + j even; θ = k π / NL. In each node's (u, z)
  // tangent frame (u = arc length) the two band directions are d1, d2.
  type Node = { th: number; z: number; c: XY[] } // c: rhombus corners as (du, dz): bottom, right, top, left
  const nodes = new Map<string, Node>()
  const key = (k: number, j: number) => `${((k % (2 * NL)) + 2 * NL) % (2 * NL)},${j}`
  const half = (z: number) => (Math.PI * R(z)) / NL // half a cell's width at z
  for (let j = 0; j <= ROWS; j++) {
    const z = Z0 + j * DZ
    for (let k = 0; k < 2 * NL; k++) {
      if ((k + j) % 2) continue
      const s = half(z)
      const d1 = norm([s, DZ, 0]), d2 = norm([-s, DZ, 0])
      // band half-width measured perpendicular to the band: the rhombus
      // has its corners on the bisectors (vertical and horizontal).
      const sinA = Math.abs(d1[0] * d2[1] - d1[1] * d2[0]) // sin of the angle between bands
      const along = BAND / 2 / sinA // corner offset along each band
      const cz = along * (d1[1] + d2[1]), cu = along * (d1[0] - d2[0])
      nodes.set(key(k, j), { th: PH + (k * Math.PI) / NL, z, c: [[0, -cz], [cu, 0], [0, cz], [-cu, 0]] })
    }
  }
  const P = (nd: Node, c: XY, d = 0): V3 => pos(nd.th + c[0] / R(nd.z + c[1]), nd.z + c[1], d)
  const Nn = (nd: Node, c: XY): V3 => radial(nd.th + c[0] / R(nd.z + c[1]), nd.z + c[1])
  const skin = (a: V3, b: V3, c: V3, na: V3, nb: V3, nc: V3) => tri(conc, a, b, c, [na, nb, nc])
  const flare = (z: number) => z > ZF - 1
  for (let j = 0; j <= ROWS; j++) {
    for (let k = 0; k < 2 * NL; k++) {
      if ((k + j) % 2) continue
      const A = nodes.get(key(k, j))!
      // the rhombus
      const [b, r, t, l] = A.c
      if (j === 0) continue // inside the pavilion
      skin(P(A, b), P(A, r), P(A, t), Nn(A, b), Nn(A, r), Nn(A, t))
      skin(P(A, b), P(A, t), P(A, l), Nn(A, b), Nn(A, t), Nn(A, l))
      if (flare(A.z)) {
        // the inner face, seen through the open petals
        const inn = (c: XY) => { const n = Nn(A, c); return [-n[0], -n[1], -n[2]] as V3 }
        tri(conc, P(A, b, DEPTH), P(A, t, DEPTH), P(A, r, DEPTH), [inn(b), inn(t), inn(r)])
        tri(conc, P(A, b, DEPTH), P(A, l, DEPTH), P(A, t, DEPTH), [inn(b), inn(l), inn(t)])
      }
      if (j === ROWS) {
        // the petal tip's top edges
        for (const [c0, c1] of [[l, t], [t, r]] as [XY, XY][]) {
          const m = norm(add(add(Nn(A, c0), Nn(A, c1)), Z, 1.5))
          quad(conc, P(A, c0), P(A, c1), P(A, c1, DEPTH), P(A, c0, DEPTH), m)
        }
        continue
      }
      // the two segments up to the next row: up-right (k+1) and up-left (k-1)
      for (const dk of [1, -1]) {
        const B = nodes.get(key(k + dk, j + 1))!
        // A's upper edge on this side: top and (right or left); B's lower: bottom and (left or right)
        const aSide = dk > 0 ? A.c[1] : A.c[3], bSide = dk > 0 ? B.c[3] : B.c[1]
        // corners in the shared frame of A: B's corners shifted by the node step
        const a0 = A.c[2], a1 = aSide, b0 = bSide, b1 = B.c[0]
        // a0/b0 bound one long edge, a1/b1 the other
        const pa0 = P(A, a0), pa1 = P(A, a1), pb0 = P(B, b0), pb1 = P(B, b1)
        const na0 = Nn(A, a0), na1 = Nn(A, a1), nb0 = Nn(B, b0), nb1 = Nn(B, b1)
        skin(pa1, pb1, pb0, na1, nb1, nb0)
        skin(pa1, pb0, pa0, na1, nb0, na0)
        const fl = flare(A.z) || flare(B.z)
        if (fl) {
          const inv = (n: V3): V3 => [-n[0], -n[1], -n[2]]
          tri(conc, P(A, a1, DEPTH), P(B, b0, DEPTH), P(B, b1, DEPTH), [inv(na1), inv(nb0), inv(nb1)])
          tri(conc, P(A, a1, DEPTH), P(A, a0, DEPTH), P(B, b0, DEPTH), [inv(na1), inv(na0), inv(nb0)])
        }
        if (detail || fl) {
          // the reveals into the two cells beside this segment
          for (const [p0, p1, q0, q1] of [[a0, b0, A, B], [a1, b1, A, B]] as [XY, XY, Node, Node][]) {
            const e0 = P(q0, p0), e1 = P(q1, p1)
            const mid: V3 = [(e0[0] + e1[0]) / 2, (e0[1] + e1[1]) / 2, (e0[2] + e1[2]) / 2]
            // direction from the segment's centre line out to this edge
            const cA = P(A, [0, 0]), cB = P(B, [0, 0])
            const cm: V3 = [(cA[0] + cB[0]) / 2, (cA[1] + cB[1]) / 2, (cA[2] + cB[2]) / 2]
            const rad = norm([mid[0], mid[1], 0])
            let n: V3 = [mid[0] - cm[0], mid[1] - cm[1], mid[2] - cm[2]]
            const dot = n[0] * rad[0] + n[1] * rad[1]
            n = norm([n[0] - rad[0] * dot, n[1] - rad[1] * dot, n[2]])
            quad(conc, e0, e1, P(q1, p1, DEPTH), P(q0, p0, DEPTH), n)
          }
        }
      }
    }
  }

  // The core: the shaft seen through the cells, set back behind the bands.
  const coreProf: [number, number][] = []
  for (let z = PAV_H - 0.5; z <= ZF + 0.01; z += (ZF - PAV_H + 0.5) / 4) coreProf.push([R(z) - 1.7, z])
  lathe(core, 0, 0, coreProf, detail ? 32 : 16)
  // cap of the core under the cabin drum
  lathe(core, 0, 0, [[R(ZF) - 1.7, ZF], [CAB_R + 0.25, ZF + 2]], detail ? 32 : 16)

  // ── The crown: the cabin's solid lower drum inside the petals, two rows
  // of restaurant windows, the ring cornice, the roof, the top drum and
  // the mast with its disc.
  const CS = detail ? 32 : 16
  lathe(conc, 0, 0, [[CAB_R + 0.25, ZF + 2], [CAB_R + 0.25, 131.7], [CAB_R + 0.55, 132.1], [CAB_R, 132.4]], CS)
  const rows: [number, number][] = [[132.6, 137.6], [138.4, 143.6]]
  lathe(win, 0, 0, [[CAB_R - 0.25, 132.4], [CAB_R - 0.25, 143.8]], CS)
  lathe(conc, 0, 0, [[CAB_R, 137.6], [CAB_R + 0.15, 137.8], [CAB_R + 0.15, 138.2], [CAB_R, 138.4]], CS)
  // mullion piers between the window bays
  const NB = detail ? 24 : 16
  for (let i = 0; i < NB; i++) {
    const t = (TAU * (i + 0.5)) / NB, u: XY = [Math.cos(t), Math.sin(t)]
    for (const [z0, z1] of rows) obox(conc, null, u[0] * (CAB_R - 0.05), u[1] * (CAB_R - 0.05), u, 0.3, detail ? 0.22 : 0.3, z0 - 0.3, z1 + 0.1)
  }
  // the cornice ring and the roof
  lathe(conc, 0, 0, [[CAB_R - 0.25, 143.6], [CAB_R, 143.7], [CAB_R, 145.2], [CAB_R + 0.35, 145.3], [CAB_R + 0.35, 146.0], [CAB_R - 0.1, 146.2],
    [6.9, 146.9], [5.4, 148.0], [3.9, 148.6]], CS, { smooth: false })
  // the top drum (equipment level) with its railing posts drawn as a band
  lathe(conc, 0, 0, [[3.75, 148.5], [3.75, 151.4], [4.05, 151.6], [4.05, 152.5], [2.3, 152.5]], detail ? 20 : 12)
  // the mast: a trumpet foot, the shaft, the disc and the antenna
  lathe(conc, 0, 0, [[2.3, 152.5], [1.5, 153.4], [1.05, 155.5], [0.78, 159], [0.62, 166], [0.55, 180.7]], detail ? 16 : 10, { smooth: true })
  lathe(conc, 0, 0, [[0.55, 180.6], [2.3, 181.2], [2.35, 182.1], [1.8, 182.6], [0.3, 182.9]], detail ? 16 : 10, { smooth: false })
  lathe(bronze, 0, 0, [[0.14, 182.8], [0.1, 187], [0, 187.0]], 4)

  // ── The pavilion: a granite frame round blue glass, the north entrance.
  const X = PAV_X, Y = PAV_Y, H = PAV_H, F = 1.3, REC = 0.45
  // corner piers and the parapet band, proud of the glass
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    box(gran, gran, sx > 0 ? X - F : -X, sx > 0 ? X : -X + F, sy > 0 ? Y - F : -Y, sy > 0 ? Y : -Y + F, 0, H - 1.4, 0.15)
  }
  box(gran, null, -X, X, -Y, Y, H - 1.4, H, 0.15)
  // the roof, with a low upstand round the shaft
  face(gran, [[-X, -Y, H], [X, -Y, H], [X, Y, H], [-X, Y, H]], Z)
  // the glazed walls, set back between the piers, over a granite base course
  box(glaze, null, -X + REC, X - REC, -Y + REC, Y - REC, 1.8, H - 1.4)
  box(gran, null, -X + REC - 0.05, X - REC + 0.05, -Y + REC - 0.05, Y - REC + 0.05, 0, 1.8)

  // The north portal: a projecting frame 17 m wide and 15.2 m high, the
  // central granite panel with the eagle, the glazed doors, the steps.
  const yN = Y, pw = 8.5, ph = 15.2, pd = 1.1
  box(gran, gran, -pw, -pw + 1.0, yN - REC, yN + pd, 0, ph - 1.0, 0.1)
  box(gran, gran, pw - 1.0, pw, yN - REC, yN + pd, 0, ph - 1.0, 0.1)
  box(gran, gran, -pw, pw, yN - REC, yN + pd, ph - 1.0, ph, 0.1)
  // inner pilasters and the central panel above the doors
  for (const s of [-1, 1]) box(gran, gran, s > 0 ? 4.7 : -5.7, s > 0 ? 5.7 : -4.7, yN - REC, yN + 0.35, 0, ph - 1.0)
  box(gran, null, -4.7, 4.7, yN - REC, yN + 0.1, 5.8, ph - 1.0)
  // door glazing under the panel, on a granite infill
  box(gran, null, -4.7, 4.7, yN - REC, yN, 0, 5.8)
  face(glaze, [[-4.7, yN + 0.02, 1.8], [4.7, yN + 0.02, 1.8], [4.7, yN + 0.02, 5.8], [-4.7, yN + 0.02, 5.8]], [0, 1, 0])
  // the eagle of Saladin: wings, body and shield, in bronze, proud of the panel
  const ey = yN + 0.1, ez = 7.0, ek = 1.15
  const eg = (pts: XY[], dz = 0.25) => {
    const a2 = pts.reduce((t, a, i) => { const b = pts[(i + 1) % pts.length]; return t + a[0] * b[1] - b[0] * a[1] }, 0)
    const ring = a2 < 0 ? [...pts].reverse() : pts
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      const n = norm([0, 0, 0].map((_, k) => (k === 0 ? b[1] - a[1] : k === 2 ? -(b[0] - a[0]) : 0)) as V3)
      quad(bronze, [ek * a[0], ey, ez + ek * a[1]], [ek * b[0], ey, ez + ek * b[1]], [ek * b[0], ey + dz, ez + ek * b[1]], [ek * a[0], ey + dz, ez + ek * a[1]], n)
    }
    face(bronze, ring.map(([u, v]) => [ek * u, ey + dz, ez + ek * v] as V3), [0, 1, 0])
  }
  // wings (each a convex quad), body, head; the shield
  eg([[-0.9, 1.0], [-2.2, 2.0], [-2.5, 5.3], [-0.9, 4.8]])
  eg([[0.9, 1.0], [0.9, 4.8], [2.5, 5.3], [2.2, 2.0]])
  eg([[-0.9, 0.0], [0.9, 0.0], [1.0, 4.6], [0, 5.5], [-1.0, 4.6]], 0.4)
  eg([[-0.35, 5.4], [0.35, 5.4], [0.4, 6.4], [-0.4, 6.4]], 0.4)
  eg([[-1.6, -0.6], [1.6, -0.6], [1.6, 0], [-1.6, 0]], 0.3)

  // The steps, the full width of the portal, up to the door at 1.8 m.
  const NS = detail ? 9 : 4, SD = 4.2
  // (the lowest step stands 0.7 m, so the map's coarse terrain, 0.7 m
  // higher at the west end, doesn't swallow it)
  for (let i = 0; i < NS; i++) box(gran, gran, -X + 0.6, X - 0.6, yN - REC + 0.1, yN + pd + (SD * (NS - i)) / NS, 0, 0.7 + (1.1 * i) / (NS - 1))

  // Other faces: shallow granite pilasters splitting the glass into bays.
  for (const [n, len] of [[[0, -1, 0], X], [[1, 0, 0], Y], [[-1, 0, 0], Y]] as [V3, number][]) {
    for (const s of [-len / 3, len / 3]) {
      const u = rightOf(n), c: XY = [n[0] * (n[0] ? X : Y) + u[0] * s, n[1] * (n[1] ? Y : X) + u[1] * s]
      // a pier 0.9 m wide, from the glass out 0.35 m
      obox(gran, gran, c[0] - n[0] * 0.225, c[1] - n[1] * 0.225, [u[0], u[1]], 0.45, 0.225, 0, H - 1.4)
    }
  }

  const lattice = (p: V3, n: V3) => (n[2] > 0.8 ? 0.3 : 0.9) * (p[2] > 20 ? 1 : 0)
  return [
    { part: conc, material: { ...finish('cairo-tower-concrete', 0xe2d4b8), floodlight: lattice } },
    { part: core, material: finish('cairo-tower-shadow', 0x7d7365) },
    { part: gran, material: finish('cairo-tower-granite', 0xcdbb9f) },
    { part: win, material: PALETTE.window },
    { part: glaze, material: windowVariant(2, 0x6f93ae) },
    { part: bronze, material: { ...PALETTE.metal, color: 0x9a7f62 } },
  ]
}

if (import.meta.main) {
  const extras = { bearing: 358.8, osm: 'way/767933342', height: 187 }
  await save('cairo-cairo-tower.glb', 'Cairo Tower', build(false), 6500, 250_000, extras)
  await save('cairo-cairo-tower.detail.glb', 'Cairo Tower', build(true), 40_000, 1536 * 1024, extras)
}
