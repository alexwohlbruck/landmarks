/**
 * Arc de Triomf, Barcelona — original procedural geometry, CC0-1.0.
 * bun generators/barcelona-arc-de-triomf.ts
 *
 * Also exports the small kit (`kit` below) the other B6 Barcelona generators
 * use: flat walls with explicit normals, flat and smooth solids of
 * revolution, faces with holes in a wall's own coordinates, rods.
 *
 * Frame: built turned to the arch, BEARING 315.3. +y is the main front, to
 * the Passeig de Sant Joan (north-west), -y the back, to the Passeig de
 * Lluís Companys and the Ciutadella park; +x is the north-east pier. z up,
 * metres. Origin = the arch's centre of symmetry, 0.4 m from the centroid of
 * the OSM outline way/377875377.
 *
 * Evidence
 * - OSM way/377875377 (building=triumphal_arch, height 29, Q631075, Josep
 *   Vilaseca, 1888) and its parts way/1557592573 and way/1557592574 (the two
 *   piers, height 29) and way/818382565 (the span over the opening, 20-29 m).
 *   In this frame the outline runs x -14.0..14.0, y -6.3..6.3 at the
 *   turrets; the main faces at y = +-4.7; the opening 9.6 m wide at the ground (8.8 in the
 *   photos at the springing, which the model follows); the end
 *   faces at x = +-12.4 between the corner turrets.
 * - Published (ca.wikipedia "Arc de Triomf de Barcelona"): built for the 1888
 *   Universal Exposition, red brick, neo-Mudejar, about 30 m; Josep Reynes'
 *   frieze "Barcelona rep les nacions" on the front to the Passeig de Sant
 *   Joan, Josep Llimona's "La recompensa" on the back.
 * - Mapterhorn terrain (bun tools/terrain.ts grid, bearing 135.3): flat,
 *   within 0.5 m over the footprint.
 * - Commons daylight photos (EVIDENCE):
 *   "Arc de Triomf Barcelona 2013.jpg" (Felix Konig, CC BY 3.0; square on,
 *   from the Lluis Companys side: the photo the elevation is measured from);
 *   "Arc de Triomf de Barcelona (July 2022).jpg" (Maksim Sokolov
 *   (maxergon.com), CC BY-SA 4.0; level, from far down the promenade: the
 *   overall proportions);
 *   "097 Arc de Triomf (Barcelona), des del passeig de Sant Joan.jpg" (Enric,
 *   CC BY-SA 4.0; three-quarter from the north-west, the piers' depth);
 *   "Barcelona - Arc de Triomf 1888 - View NE.jpg" (Txllxt TxllxT, CC BY-SA
 *   4.0; close-up of a turret, its octagonal brick shaft, ceramic band and
 *   angel);
 *   "Arc de triomf at night.jpg" (Thingstodoinbarcelona, CC BY-SA 4.0; the
 *   whole arch floodlit).
 *
 * Measured from the photos (scaled to the OSM width of 28 m): the wall's
 * cornice at 23.4-24.3; the turrets' crowns to 28.6 (OSM 29); the opening's
 * springing at 9.6 and crown at 14.0 (a true semicircle, r 4.4: the photo's
 * 8.8 m opening, narrower than OSM's 9.6 at the ground); the stone
 * archivolt 2.15 m broad outside a 0.45 m brick reveal; the impost band
 * with its stone cap carried round the passage; the ceramic impost band at 8.6-9.6; the sculpted
 * frieze at 19.2-21.6 between the inner turrets; the turrets 2.9 m across
 * at x = +-8.6 and +-12.6, their corbelled capitals at 22.2-23.7, drums,
 * ribbed domes to 27.4 and crowns. Colours from the daylight photos, pulled
 * to the palette's lightness: orange-red brick, grey-buff stone, ochre
 * ceramic, the domes a lighter orange.
 *
 * Left out (too fine for 80 px, or the lead's brief): the bats and lions
 * beside the crest, the crowns' points, the brick diaper reliefs on the
 * spandrels, the small niches inside the passage. The figures on the
 * turrets are pale blocks on brackets; the crest is a flat shield and crown
 * on a short pedestal.
 *
 * Doubts: the back (park side) is drawn as the mirror of the front, which
 * the photos show it nearly is (only the frieze's subject differs).
 *
 * Night: the whole arch is floodlit.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { cap, lathe, onWall, rect, save, triangulate, walls, type XY } from './chi-aon-center'

// ---------------------------------------------------------------------------
// The kit

export { cap, lathe, onWall, rect, save, triangulate, walls, type XY }

/** A quad whose winding follows the given outward normal. */
export function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
  p.tri(a, c, d, undefined, undefined, undefined, [n, n, n])
}
/** A triangle whose winding follows the given outward normal. */
export function triN(p: Part, a: V3, b: V3, c: V3, n: V3) {
  p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
}
/** The face normal of a quad's first triangle, flipped to point away from `inside`. */
export function away(a: V3, b: V3, c: V3, inside: V3): V3 {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  let n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  const l = Math.hypot(...n) || 1
  n = [n[0] / l, n[1] / l, n[2] / l]
  const d = (a[0] - inside[0]) * n[0] + (a[1] - inside[1]) * n[1] + (a[2] - inside[2]) * n[2]
  return d < 0 ? [-n[0], -n[1], -n[2]] : n
}

/** A regular polygon ring, counter-clockwise; `a0` the first corner's angle. */
export const ngon = (cx: number, cy: number, r: number, n: number, a0 = Math.PI / n): XY[] =>
  Array.from({ length: n }, (_, i) => [cx + r * Math.cos(a0 + (i / n) * 2 * Math.PI), cy + r * Math.sin(a0 + (i / n) * 2 * Math.PI)] as XY)

/** A flat-shaded solid of revolution about (cx, cy) from an (r, z) profile; `seg` sides. Ends at r = 0 close it. */
export function turned(p: Part, cx: number, cy: number, prof: XY[], seg = 8, a0 = Math.PI / seg) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    if (r0 < 1e-6 && r1 < 1e-6) continue
    for (let i = 0; i < seg; i++) {
      const t0 = a0 + (i / seg) * 2 * Math.PI, t1 = a0 + ((i + 1) / seg) * 2 * Math.PI
      const P = (r: number, z: number, t: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
      const A = P(r0, z0, t0), B = P(r0, z0, t1), C = P(r1, z1, t1), D = P(r1, z1, t0)
      const tm = (t0 + t1) / 2, dr = r1 - r0, dz = z1 - z0, l = Math.hypot(dr, dz) || 1
      const n: V3 = [(dz / l) * Math.cos(tm), (dz / l) * Math.sin(tm), -dr / l]
      if (r1 < 1e-6) triN(p, A, B, C, n)
      else if (r0 < 1e-6) triN(p, A, C, D, n)
      else quadN(p, A, B, C, D, n)
    }
  }
}

/** A shape in wall a→b's own (s along, z up) coordinates, set `out` in front of it; may be concave. */
export function face(p: Part, a: XY, b: XY, pts: XY[], out = 0) {
  const ring = ccw(pts)
  const { P, n } = onWall(a, b)
  const v = ring.map(([s, z]) => P(s, z, out))
  const N: V3 = [n[0], n[1], 0]
  for (const [i, j, k] of triangulate(ring)) triN(p, v[i], v[j], v[k], N)
}
/** The ring, reversed if it runs clockwise. */
export const ccw = (pts: XY[]): XY[] => {
  const a = pts.reduce((s, q, i) => { const r = pts[(i + 1) % pts.length]; return s + q[0] * r[1] - r[0] * q[1] }, 0)
  return a >= 0 ? pts : [...pts].reverse()
}

/** A thin flat slab standing proud of wall a→b: front face plus its edges, `d` deep, from `out`. */
export function relief(p: Part, a: XY, b: XY, pts: XY[], out: number, d: number) {
  const { P, n } = onWall(a, b)
  const N: V3 = [n[0], n[1], 0]
  const tris = triangulate(pts)
  const v = pts.map(([s, z]) => P(s, z, out + d))
  for (const [i, j, k] of tris) triN(p, v[i], v[j], v[k], N)
  for (let i = 0; i < pts.length; i++) {
    const q0 = pts[i], q1 = pts[(i + 1) % pts.length]
    const ds = q1[0] - q0[0], dz = q1[1] - q0[1], l = Math.hypot(ds, dz) || 1
    // edge normal in (s, z), outward for a counter-clockwise ring
    const es = dz / l, ez = -ds / l
    const { u } = onWall(a, b)
    const En: V3 = [u[0] * es, u[1] * es, ez]
    quadN(p, P(q0[0], q0[1], out), P(q1[0], q1[1], out), P(q1[0], q1[1], out + d), P(q0[0], q0[1], out + d), En)
  }
}

/** Points along a circular arc in (s, z): centre (sc, zc), radius r, from angle t0 to t1, n steps. */
export const arcPts = (sc: number, zc: number, r: number, t0: number, t1: number, n: number): XY[] =>
  Array.from({ length: n + 1 }, (_, k) => { const t = t0 + ((t1 - t0) * k) / n; return [sc + r * Math.cos(t), zc + r * Math.sin(t)] as XY })

/** A prism of a counter-clockwise ring with outward-wound walls, optional top and bottom caps. */
export function prismN(p: Part, r: XY[], z0: number, z1: number, top: Part | null = p, bottom: Part | null = null) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    quadN(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [(b[1] - a[1]) / l, -(b[0] - a[0]) / l, 0])
  }
  if (top) for (const [i, j, k] of triangulate(r)) triN(top, [r[i][0], r[i][1], z1], [r[j][0], r[j][1], z1], [r[k][0], r[k][1], z1], [0, 0, 1])
  if (bottom) for (const [i, j, k] of triangulate(r)) triN(bottom, [r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], [r[k][0], r[k][1], z0], [0, 0, -1])
}

/** A square-section rod (beam, lattice member) from a to b, `w` wide; `up` picks the section's orientation. */
export function beam(p: Part, a: V3, b: V3, w: number, up: V3 = [0, 0, 1]) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const L = Math.hypot(...d) || 1
  const t: V3 = [d[0] / L, d[1] / L, d[2] / L]
  let s: V3 = [t[1] * up[2] - t[2] * up[1], t[2] * up[0] - t[0] * up[2], t[0] * up[1] - t[1] * up[0]]
  if (Math.hypot(...s) < 1e-3) s = [t[1] * 0 - t[2] * 1, t[2] * 1 - t[0] * 0, 0] as V3
  if (Math.hypot(...s) < 1e-3) s = [1, 0, 0]
  const sl = Math.hypot(...s); s = [s[0] / sl, s[1] / sl, s[2] / sl]
  const q: V3 = [t[1] * s[2] - t[2] * s[1], t[2] * s[0] - t[0] * s[2], t[0] * s[1] - t[1] * s[0]]
  const h = w / 2
  const corner = (c: V3, i: number): V3 => {
    const k = [[1, 1], [-1, 1], [-1, -1], [1, -1]][i]
    return [c[0] + (s[0] * k[0] + q[0] * k[1]) * h, c[1] + (s[1] * k[0] + q[1] * k[1]) * h, c[2] + (s[2] * k[0] + q[2] * k[1]) * h]
  }
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const A = corner(a, i), B = corner(a, j), C = corner(b, j), D = corner(b, i)
    const m: V3 = [(A[0] + B[0]) / 2 - a[0], (A[1] + B[1]) / 2 - a[1], (A[2] + B[2]) / 2 - a[2]]
    quadN(p, A, B, C, D, m)
  }
  // end caps
  const e0 = [0, 1, 2, 3].map((i) => corner(a, i)), e1 = [0, 1, 2, 3].map((i) => corner(b, i))
  quadN(p, e0[0], e0[1], e0[2], e0[3], [-t[0], -t[1], -t[2]])
  quadN(p, e1[0], e1[1], e1[2], e1[3], t)
}

// ---------------------------------------------------------------------------
// The arch

function build() {
  const brick = new Part(), stone = new Part(), ceramic = new Part(), dome = new Part()
  const D = 4.7 // main faces at y = +-D
  const XO = 12.4 // end faces
  const XI = 4.4 // the opening's sides; r of the arch (8.8 m, the photo's opening at the springing)
  const SPRING = 9.6, TOP = 24.3, CORN = 23.4
  const TX = [8.6, 12.6], TR = 1.45 // turret centres (|x|) and their octagon's apothem-ish radius

  // --- piers below the springing, and the upper block with the arch cut out ---
  for (const sx of [1, -1]) {
    const r: XY[] = sx > 0 ? rect(XI, -D, XO, D) : rect(-XO, -D, -XI, D)
    prismN(brick, r, 0, SPRING, null)
    // the plinth course
    prismN(brick, sx > 0 ? rect(XI - 0.25, -D - 0.25, XO + 0.25, D + 0.25) : rect(-XO - 0.25, -D - 0.25, -XI + 0.25, D + 0.25), 0, 3.4, brick)
  }
  // front and back faces of the upper block, with the semicircular notch
  // (wall coordinates: s runs from the left end of each face; walking the arc
  // from angle pi to 0 goes up and over it, so the ring is counter-clockwise)
  for (const [a, b] of [[[-XO, -D], [XO, -D]], [[XO, D], [-XO, D]]] as [XY, XY][])
    face(brick, a, b, [[0, SPRING], [XO - XI, SPRING], ...arcPts(XO, SPRING, XI, Math.PI, 0, 12).slice(1, -1), [XO + XI, SPRING], [2 * XO, SPRING], [2 * XO, TOP], [0, TOP]])
  // end faces and top of the upper block
  for (const sx of [1, -1]) quadN(brick, [sx * XO, -D, SPRING], [sx * XO, D, SPRING], [sx * XO, D, TOP], [sx * XO, -D, TOP], [sx, 0, 0])
  quadN(brick, [-XO, -D, TOP], [XO, -D, TOP], [XO, D, TOP], [-XO, D, TOP], [0, 0, 1])
  // the vault's soffit: faces look in, toward the axis
  {
    const pts = arcPts(0, SPRING, XI, 0, Math.PI, 12)
    for (let k = 0; k < pts.length - 1; k++) {
      const [x0, z0] = pts[k], [x1, z1] = pts[k + 1]
      const xm = (x0 + x1) / 2, zm = (z0 + z1) / 2 - SPRING, l = Math.hypot(xm, zm)
      quadN(brick, [x0, -D, z0], [x1, -D, z1], [x1, D, z1], [x0, D, z0], [-xm / l, 0, -zm / l])
    }
  }
  // the cornice round the top
  {
    const o = 0.35
    prismN(brick, rect(-XO - o, -D - o, XO + o, D + o), CORN, TOP, brick, brick)
  }

  // --- the stone archivolt, the ceramic impost band, the frieze, on both faces ---
  for (const [a, b] of [[[-XO, -D], [XO, -D]], [[XO, D], [-XO, D]]] as [XY, XY][]) {
    const R1 = XI + 2.6, R0 = XI + 0.45 // a broad stone archivolt outside a narrow brick reveal
    const inner = arcPts(XO, SPRING, R0, 0, Math.PI, 14), outer = arcPts(XO, SPRING, R1, Math.PI, 0, 14)
    // the ring as a band of quads, proud of the wall
    const { P, n, u } = onWall(a, b)
    const N: V3 = [n[0], n[1], 0], d = 0.22
    for (let k = 0; k < 14; k++) {
      const i0 = inner[k], i1 = inner[k + 1], o0 = outer[14 - k], o1 = outer[13 - k]
      quadN(stone, P(i0[0], i0[1], d), P(o0[0], o0[1], d), P(o1[0], o1[1], d), P(i1[0], i1[1], d), N)
      // its outer edge
      const tm = ((k + 0.5) / 14) * Math.PI
      quadN(stone, P(o0[0], o0[1], 0), P(o1[0], o1[1], 0), P(o1[0], o1[1], d), P(o0[0], o0[1], d), [u[0] * Math.cos(tm), u[1] * Math.cos(tm), Math.sin(tm)])
    }
    // the archivolt's legs down to the impost
    relief(stone, a, b, [[XO - R1, SPRING], [XO - R0, SPRING], [XO - R0, SPRING + 0.01], [XO - R1, SPRING + 0.01]], 0, d)
    relief(stone, a, b, [[XO + R0, SPRING], [XO + R1, SPRING], [XO + R1, SPRING + 0.01], [XO + R0, SPRING + 0.01]], 0, d)
    // keystone block
    relief(stone, a, b, [[XO - 0.7, SPRING + R1 - 0.2], [XO + 0.7, SPRING + R1 - 0.2], [XO + 0.8, SPRING + R1 + 0.5], [XO - 0.8, SPRING + R1 + 0.5]], 0, d + 0.1)
    // the sculpted frieze between the inner turrets, with its corbelled sill
    relief(stone, a, b, [[XO - 7.2, 19.2], [XO + 7.2, 19.2], [XO + 7.2, 21.6], [XO - 7.2, 21.6]], 0, 0.3)
    relief(brick, a, b, [[XO - 7.2, 18.6], [XO + 7.2, 18.6], [XO + 7.2, 19.2], [XO - 7.2, 19.2]], 0, 0.45)
    // the ceramic bands: impost (pier faces between the opening and the turrets) and under the cornice
    for (const sx of [-1, 1]) {
      const s0 = sx < 0 ? XO - TX[0] + TR : XO + XI, s1 = sx < 0 ? XO - XI : XO + TX[0] - TR
      relief(ceramic, a, b, [[s0, 8.6], [s1, 8.6], [s1, 9.6], [s0, 9.6]], 0, 0.3)
      relief(stone, a, b, [[s0, 9.6], [s1, 9.6], [s1, 10.0], [s0, 10.0]], 0, 0.45) // the impost's stone cap
    }
    relief(ceramic, a, b, [[XO - TX[0] + TR, 22.5], [XO + TX[0] - TR, 22.5], [XO + TX[0] - TR, CORN], [XO - TX[0] + TR, CORN]], 0, 0.2)
  }
  // the crest: a flat stone shield under a small crown, on a short pedestal
  prismN(stone, [[-1.0, -0.6], [1.0, -0.6], [1.0, 0.6], [-1.0, 0.6]], TOP, TOP + 0.7, stone)
  {
    const z0 = TOP + 0.7
    const sh: XY[] = [[0, z0], [0.65, z0 + 0.2], [1.0, z0 + 0.65], [1.1, z0 + 2.3], [0.6, z0 + 2.3], [0.6, z0 + 2.9], [-0.6, z0 + 2.9], [-0.6, z0 + 2.3], [-1.1, z0 + 2.3], [-1.0, z0 + 0.65], [-0.65, z0 + 0.2]]
    const front = ccw(sh.map(([x, z]) => [1.1 - x, z] as XY)) // on the +y face, s runs from x = 1.1 toward -x
    relief(stone, [1.1, 0.25], [-1.1, 0.25], front, -0.5, 0.5)
    face(stone, [-1.1, -0.25], [1.1, -0.25], sh.map(([x, z]) => [x + 1.1, z] as XY))
  }
  // the impost band carried round the passage's sides, where the arch springs
  for (const sx of [1, -1]) {
    const a: XY = sx > 0 ? [XI, D] : [-XI, -D], b: XY = sx > 0 ? [XI, -D] : [-XI, D]
    relief(ceramic, a, b, [[0, 8.6], [2 * D, 8.6], [2 * D, 9.6], [0, 9.6]], 0, 0.25)
    relief(stone, a, b, [[0, 9.6], [2 * D, 9.6], [2 * D, 10.0], [0, 10.0]], 0, 0.35)
  }
  // the ceramic impost band on the end faces
  for (const sx of [1, -1]) {
    const a: XY = sx > 0 ? [XO, -D] : [-XO, D], b: XY = sx > 0 ? [XO, D] : [-XO, -D]
    relief(ceramic, a, b, [[TR - 0.2, 8.6], [2 * D - TR + 0.2, 8.6], [2 * D - TR + 0.2, 9.6], [TR - 0.2, 9.6]], 0, 0.3)
  }

  // --- the eight turrets ---
  const prof: XY[] = [
    [TR + 0.45, 0], [TR + 0.3, 3.4], [TR, 3.6], [TR, 8.6], [TR + 0.18, 8.6], [TR + 0.18, 9.6], [TR, 9.6],
    [TR, 22.0], [TR + 0.35, 22.4], [TR + 0.35, 23.7], [TR - 0.1, 23.9], [TR - 0.1, 25.0],
  ]
  for (const sx of [1, -1]) for (const sy of [1, -1]) for (const tx of TX) {
    const cx = sx * tx, cy = sy * D
    // shaft in brick; the ceramic band and the capital share the brick part (one turned solid)
    turned(brick, cx, cy, prof.slice(0, 4), 8)
    turned(ceramic, cx, cy, prof.slice(3, 7), 8)
    turned(brick, cx, cy, prof.slice(6, 10), 8)
    turned(ceramic, cx, cy, prof.slice(9, 11), 8) // the capital's ceramic face
    turned(brick, cx, cy, prof.slice(10, 12), 8)
    // ribbed dome, smooth; then the crown, a flared cup
    const R = TR - 0.1
    lathe(dome, cx, cy, [[R, 25.0], [R * 1.02, 25.6], [R * 0.9, 26.3], [R * 0.6, 26.95], [R * 0.25, 27.3], [0.22, 27.4]], 12)
    turned(dome, cx, cy, [[0.22, 27.4], [0.32, 27.55], [0.8, 28.6], [0.6, 28.6], [0.4, 28.3], [0, 28.3]], 8)
    // the sculpted figure standing on its bracket on the turret's outer face
    const ay = cy + sy * (TR - 0.05)
    const fa: XY = sy < 0 ? [cx - 1, ay] : [cx + 1, ay], fb: XY = sy < 0 ? [cx + 1, ay] : [cx - 1, ay]
    relief(stone, fa, fb, [[0.35, 18.3], [1.65, 18.3], [1.65, 18.9], [0.35, 18.9]], 0, 0.8) // bracket
    relief(stone, fa, fb, [[0.6, 18.9], [1.4, 18.9], [1.35, 21.2], [0.65, 21.2]], 0.1, 0.55) // the figure
    relief(stone, fa, fb, [[0.75, 21.2], [1.25, 21.2], [1.2, 21.8], [0.8, 21.8]], 0.15, 0.45) // head
  }
  // the panel between each pair of turrets, standing proud with them
  for (const sx of [1, -1]) for (const sy of [1, -1]) {
    const x0 = sx * (TX[0] + TR - 0.2), x1 = sx * (TX[1] - TR + 0.2)
    const r: XY[] = sx > 0 ? rect(x0, sy > 0 ? D - 0.2 : -D - 0.5, x1, sy > 0 ? D + 0.5 : -D + 0.2) : rect(x1, sy > 0 ? D - 0.2 : -D - 0.5, x0, sy > 0 ? D + 0.5 : -D + 0.2)
    prismN(brick, r, 0, 22.4, brick)
  }

  const lit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.35 : 1)
  return [
    { part: brick, material: { ...finish('arc-brick', 0xbf6a52), floodlight: lit } },
    { part: stone, material: { ...finish('arc-stone', 0xd9cdb8), floodlight: lit } },
    { part: ceramic, material: { ...finish('arc-ceramic', 0xbf9a62), floodlight: lit } },
    { part: dome, material: { ...finish('arc-dome', 0xcc8558), floodlight: lit } },
  ]
}

if (import.meta.main) await save('barcelona-arc-de-triomf', 'Arc de Triomf', [41.391042, 2.180645], 315.3, build())
