/**
 * Climate Pledge Arena (the 1962 Seattle Center Coliseum), Seattle Center:
 * procedural, CC0-1.0.
 * bun generators/sea-climate-pledge-arena.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the roof's edges run
 * true north-south and east-west in the lidar to within a cell). The origin
 * is the centroid of OSM way/25123756 (the outline, which includes the
 * 2021 south atrium); the roof's centre lies 1.0 m east and 11.0 m north of
 * it. y = 0 is the plaza that rings the building (37.3 m NAVD88), the lowest
 * ground the walls touch: the bowl was dug down inside, so the building
 * above ground is the roof, its buttresses and the glass walls under it.
 *
 * Paul Thiry, 1962; rebuilt 2018-21 (Populous) keeping the roof. The roof is
 * square, 124 m a side, made of four hyperbolic-paraboloid quadrants hung
 * between two crossing trusses on the axes; it is highest at the centre,
 * falls in straight lines along the axes to the middle of each edge, and
 * the edges fall straight from there to the low corners. Each truss ends in
 * a concrete tripod at the middle of a side: a strut raking out to the
 * plaza and two legs splayed along the facade.
 *
 * Measured (USGS 3DEP WA_KingCo_1_2021, 1 m surface model, heights above the
 * plaza):
 * - roof edges at x -61 / +63 and y -51 / +73 (OSM's outline agrees within
 *   a metre): 124 m square;
 * - edge height 13.0 m at the middle of each side, 9.0 m at the corners,
 *   straight between (the west and north edges read linear to 0.1 m);
 * - along the axes the roof rises in a straight line from 13.0 m at the
 *   edge to 32.9 m at 9 m from the centre (extrapolating to 36.3 m at the
 *   centre); along the diagonals it sags exactly as a bilinear patch through
 *   those three heights predicts (17.8 m modelled, 18.0 m measured at the
 *   middle of a diagonal);
 * - the crown box 16 m square, 38.4 m high with the sign frames to 39.0 m;
 * - the raking struts' upper faces from 9.8 m at the roof edge to the plaza
 *   14-15 m out (OSM's 4.5 m wide parts end 14-15 m beyond the walls);
 * - the atrium roof 7.2-7.6 m at its front wall, rising to 11.6 m where it
 *   meets the arena.
 *
 * OSM: way/25123756 (outline, stadium, 35 m), its building:parts: the roof
 * (411521517), the crown (411521531, 1352665595-98), the axis trusses and
 * buttresses (1352666108-111, 1352666989-991), the glass hall (1352647812),
 * the atrium (1270549342, 1352647807-811). All lie within the outline and
 * the model covers them all.
 *
 * From photos: the white fascia and roof margin, the dark skylight strips
 * along the axes, the perimeter columns about 18.5 m apart, the tripod's
 * proportions (struts about 4.4 m wide), the atrium's light glass front band
 * and its solar arrays, the crown box (its sign frames left out).
 *
 * Estimated: the fascia's depth (3 m at the wall line) and the margin's
 * width (8 m), the glass wall's line 4 m inside the roof edge (OSM's glass
 * hall part), the legs' feet 11.5 m either side of the middle, the crown's
 * box height under the signs, the solar arrays' layout.
 * Left out: the crown's sign frames and lettering (signage), the
 * south tripod (inside the atrium, not seen), canopies, the plaza.
 *
 * Photos (Wikimedia Commons):
 * - "Climate Pledge Arena N.jpg", Sea Cow, CC BY-SA 4.0 (aerial from the south)
 * - "Climate Pledge Arena NW.jpg", Sea Cow, CC BY-SA 4.0 (aerial from the south-east)
 * - "Climate Pledge Arena SE.jpg", Sea Cow, CC BY-SA 4.0 (aerial from the north-west)
 * - "Climate Pledge Arena NE.jpg", Sea Cow, CC BY-SA 4.0 (aerial from the south-west)
 * - "Climate Pledge Arena W.jpg", Sea Cow, CC BY-SA 4.0 (aerial from the east)
 * - "Climate Pledge Arena, Seattle.jpg", JJonahJackalope, CC BY-SA 4.0 (east side, ground)
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

const white = new Part()   // fascia, roof margin, tripods, columns, crown
const roof = new Part()    // the grey standing-seam roof
const sky = new Part()     // skylight strips and solar arrays: dark, unlit
const glassWall = new Part() // the arena's curtain wall (lit concourse)
const atrium = new Part()  // the atrium's light glass

/** A quad facing `n` (winding chosen to suit), with optional smooth normals. */
function face(p: Part, P: V3[], n: V3, N?: V3[]) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const [a, b, c, d] = dot(f, n) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  const nn = N ?? [n, n, n, n]
  p.tri(P[a], P[b], P[c], undefined, undefined, undefined, [nn[a], nn[b], nn[c]])
  p.tri(P[a], P[c], P[d], undefined, undefined, undefined, [nn[a], nn[c], nn[d]])
}
function tri(p: Part, A: V3, B: V3, C: V3, n: V3) {
  const f = cross(sub(B, A), sub(C, A))
  if (dot(f, n) >= 0) p.tri(A, B, C)
  else p.tri(A, C, B)
}
/** A box from a centre, two horizontal unit axes and half sizes. */
function box(p: Part, c: V3, d: V3, e: V3, hd: number, he: number, z0: number, z1: number) {
  const at = (u: number, v: number, z: number): V3 => [c[0] + d[0] * u + e[0] * v, c[1] + d[1] * u + e[1] * v, z]
  const corners: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  for (let i = 0; i < 4; i++) {
    const [u0, v0] = corners[i], [u1, v1] = corners[(i + 1) % 4]
    const mu = (u0 + u1) / 2, mv = (v0 + v1) / 2
    const n: V3 = [d[0] * mu + e[0] * mv, d[1] * mu + e[1] * mv, 0]
    face(p, [at(u0 * hd, v0 * he, z0), at(u1 * hd, v1 * he, z0), at(u1 * hd, v1 * he, z1), at(u0 * hd, v0 * he, z1)], unit(n))
  }
  face(p, corners.map(([u, v]) => at(u * hd, v * he, z1)), [0, 0, 1])
}
/**
 * A tapered concrete member from A to B, its section `w` across along the
 * horizontal `side` axis and `t` thick (each from the A end to the B end),
 * every long edge chamfered by `ch` so it catches a highlight. Ends capped.
 */
function beam(p: Part, A: V3, B: V3, side: V3, w: [number, number], t: [number, number], ch = 0.45) {
  const ax = unit(sub(B, A))
  const nrm = unit(cross(side, ax))
  // Octagon in (side, nrm) units of half-width / half-thickness, chamfered.
  const sect = (W: number, T: number): [number, number][] => {
    const a = W / 2, b = T / 2, c = Math.min(ch, a * 0.4, b * 0.4)
    return [[-a, -b + c], [-a + c, -b], [a - c, -b], [a, -b + c], [a, b - c], [a - c, b], [-a + c, b], [-a, b - c]]
  }
  const sA = sect(w[0], t[0]), sB = sect(w[1], t[1])
  const at = (P: V3, [u, v]: [number, number]) => add(add(P, mul(side, u)), mul(nrm, v))
  const n = sA.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const out = unit(add(mul(side, sA[i][0] + sA[j][0]), mul(nrm, sA[i][1] + sA[j][1])))
    face(p, [at(A, sA[i]), at(A, sA[j]), at(B, sB[j]), at(B, sB[i])], out)
  }
  const capA = sA.map((q) => at(A, q)), capB = sB.map((q) => at(B, q))
  for (let i = 1; i < n - 1; i++) {
    tri(p, capA[0], capA[i], capA[i + 1], mul(ax, -1))
    tri(p, capB[0], capB[i], capB[i + 1], ax)
  }
}

// ------------------------------------------------------------ the roof ---
const RC: V3 = [1.0, 11.0, 0]     // roof centre, from the lidar edges
const H = 62                       // half side of the roof
const WALL = 58                    // glass wall's half side (OSM glass hall)
const ZC = 36.3, ZM = 13.0, ZK = 9.0 // centre, mid-edge and corner heights
const MARGIN = 8, STRIP = 2.25, CROWN = 8
/** The roof surface: a bilinear (hypar) patch per quadrant. */
const zr = (x: number, y: number) => {
  const u = Math.min(1, Math.abs(x) / H), v = Math.min(1, Math.abs(y) / H)
  return ZC * (1 - u) * (1 - v) + ZM * (u * (1 - v) + v * (1 - u)) + ZK * u * v
}
const R = (x: number, y: number, z = zr(x, y)): V3 => [RC[0] + x, RC[1] + y, z]
/** Surface normal of the patch, for smooth shading within a quadrant. */
function nr(x: number, y: number): V3 {
  const sx = Math.sign(x) || 1, sy = Math.sign(y) || 1
  const u = Math.abs(x) / H, v = Math.abs(y) / H
  const dzdu = -ZC * (1 - v) + ZM * ((1 - v) - v) + ZK * v
  const dzdv = -ZC * (1 - u) + ZM * ((1 - u) - u) + ZK * u
  return unit([-sx * dzdu / H, -sy * dzdv / H, 1])
}
{
  const brk = [0, STRIP, CROWN, 16, 24, 32, 40, 48, H - MARGIN, H]
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    for (let i = 0; i < brk.length - 1; i++) for (let j = 0; j < brk.length - 1; j++) {
      const a0 = brk[i], a1 = brk[i + 1], b0 = brk[j], b1 = brk[j + 1]
      if (a1 <= CROWN && b1 <= CROWN) continue // under the crown box
      const pts: [number, number][] = [[a0, b0], [a1, b0], [a1, b1], [a0, b1]]
      const P = pts.map(([a, b]) => R(sx * a, sy * b))
      const N = pts.map(([a, b]) => nr(sx * (a || 0.01), sy * (b || 0.01)))
      const edge = a0 >= H - MARGIN || b0 >= H - MARGIN
      const strip = !edge && (a1 <= STRIP || b1 <= STRIP)
      face(edge ? white : strip ? sky : roof, P, [0, 0, 1], N)
    }
  }
}
// The fascia: a white lip down from the roof edge, then a soffit sloping back
// to the top of the glass wall, 3 m below the edge.
// Both deepen toward the middle of each side, where the fascia folds down
// over the tripod (photos: about 2.5 m of lip there, half that at a corner).
const LIP = (t: number) => 1.2 + 1.0 * (1 - Math.min(1, Math.abs(t) / H))
const SOFFIT = (t: number) => 2.5 + 0.8 * (1 - Math.min(1, Math.abs(t) / H))
{
  const steps = [-H, -46, -31, -15.5, 0, 15.5, 31, 46, H]
  for (let side = 0; side < 4; side++) {
    // side 0: east (+x), 1: north, 2: west, 3: south; t runs along the side.
    const ang = (side * Math.PI) / 2
    const d: V3 = [Math.cos(ang), Math.sin(ang), 0], e: V3 = [-Math.sin(ang), Math.cos(ang), 0]
    const at = (r: number, t: number, dz: number): V3 => {
      const x = d[0] * r + e[0] * t, y = d[1] * r + e[1] * t
      return R(x, y, zr(d[0] * H + e[0] * t, d[1] * H + e[1] * t) + dz)
    }
    for (let k = 0; k < steps.length - 1; k++) {
      const t0 = steps[k], t1 = steps[k + 1]
      // Corners: the lip and soffit meet their neighbours on the diagonal.
      const w0 = (r: number) => (Math.abs(t0) === H ? Math.sign(t0) * r : t0)
      const w1 = (r: number) => (Math.abs(t1) === H ? Math.sign(t1) * r : t1)
      face(white, [at(H, w0(H), 0), at(H, w1(H), 0), at(H, w1(H), -LIP(t1)), at(H, w0(H), -LIP(t0))], d)
      const tm = (t0 + t1) / 2
      const sn = unit(add(mul(d, -(SOFFIT(tm) - LIP(tm))), [0, 0, -(H - WALL)]))
      face(white, [at(H, w0(H), -LIP(t0)), at(H, w1(H), -LIP(t1)), at(WALL, w1(WALL), -SOFFIT(t1)), at(WALL, w0(WALL), -SOFFIT(t0))], sn)
      // The glass wall under it, down to the plaza (along the south it stands
      // behind the atrium).
      const g = (r: number, t: number, top: boolean): V3 => {
        const p = at(r, t, -SOFFIT(Math.abs(t) === WALL ? H : t) + 0.05)
        return top ? p : [p[0], p[1], 0]
      }
      face(glassWall, [g(WALL, w0(WALL), false), g(WALL, w1(WALL), false), g(WALL, w1(WALL), true), g(WALL, w0(WALL), true)], d)
    }
  }
}

// ----------------------------------------------------- tripods, columns ---
const FOOT = 76.5                  // the raking struts' feet, from the centre
for (const side of [0, 1, 2]) {    // east, north, west; the south one is inside the atrium
  const ang = (side * Math.PI) / 2
  const d: V3 = [Math.cos(ang), Math.sin(ang), 0], e: V3 = [-Math.sin(ang), Math.cos(ang), 0]
  const P = (r: number, t: number, z: number): V3 => [RC[0] + d[0] * r + e[0] * t, RC[1] + d[1] * r + e[1] * t, z]
  // The raking strut, its upper face 9.8 m at the roof edge (lidar), 4.4 m
  // wide (OSM), as deep as the fascia, tapering toward its foot 14 m out.
  beam(white, P(55.5, 0, 12.2), P(FOOT - 1.0, 0, 1.6), e, [4.6, 4.0], [3.4, 2.4])
  box(white, P(FOOT - 1.0, 0, 0), d, e, 1.9, 2.0, 0, 1.6)
  // The two legs of the inverted V, splayed in the plane just outside the
  // glass: broad at the eave, narrowing to their feet 11.5 m either side.
  for (const s of [-1, 1]) {
    beam(white, P(WALL + 1.8, s * 2.0, 10.2), P(WALL + 1.8, s * 9.4, 1.6), d, [3.0, 2.6], [4.6, 3.6])
    box(white, P(WALL + 1.8, s * 9.8, 0), d, e, 1.3, 2.1, 0, 1.7)
  }
  // Perimeter columns just outside the glass, up to the soffit.
  for (const t of [-55, -37, -18.5, 18.5, 37, 55]) {
    const zTop = zr(d[0] * H + e[0] * t, d[1] * H + e[1] * t) - SOFFIT(t) + 0.4
    box(white, P(WALL + 1.2, t, 0), d, e, 0.55, 0.55, 0, zTop)
  }
}

// ------------------------------------------------------------ the crown ---
// A plain lantern where the trusses cross (the sign frames on it are left
// out, as signage).
{
  const C = R(0, 0, 0)
  const zBase = zr(CROWN, CROWN) - 0.5
  box(white, C, [1, 0, 0], [0, 1, 0], CROWN - 1.5, CROWN - 1.5, zBase, 34.6)
  box(roof, C, [1, 0, 0], [0, 1, 0], CROWN - 3.5, CROWN - 3.5, 34.4, 35.4)
}

// ----------------------------------------------------------- the atrium ---
// OSM's plan (centroid frame): a shallow V in front, its point due south.
{
  // The back meets the fascia's lip along the roof edge, so its height
  // follows the edge (11.6 m at the middle, as the lidar has it).
  const back = RC[1] - H
  const L: V3 = [-55.0, -69.9, 0], F: V3 = [-0.5, -80.3, 0], Rr: V3 = [53.9, -70.6, 0]
  const BL: V3 = [-55.0, back, 0], BR: V3 = [53.9, back, 0], BM: V3 = [-0.5, back, 0]
  const zFront = 7.5
  const zB = (p: V3) => zr(p[0] - RC[0], H) - LIP(p[0] - RC[0]) - 0.1
  const top = (p: V3, z: number): V3 => [p[0], p[1], z]
  // Walls: the two front faces and the two short sides.
  for (const [a, b] of [[L, F], [F, Rr], [Rr, BR], [BL, L]] as [V3, V3][]) {
    const za = a[1] > -60 ? zB(a) : zFront, zb = b[1] > -60 ? zB(b) : zFront
    const t = unit(sub(b, a)), n: V3 = [t[1], -t[0], 0]
    face(atrium, [a, b, top(b, zb - 0.3), top(a, za - 0.3)], n)
    // A white eave band along the top.
    face(white, [top(a, za - 0.3), top(b, zb - 0.3), top(b, za === zb ? zb : zb), top(a, za)], n)
  }
  // The roof: two gently twisted facets either side of the point. A light
  // glass band along the front, the rest grey with solar arrays.
  const lerpP = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]
  for (const [front0, front1, back0, back1] of [[L, F, BL, BM], [F, Rr, BM, BR]] as V3[][]) {
    const f0 = top(front0, zFront), f1 = top(front1, zFront), b0 = top(back0, zB(back0)), b1 = top(back1, zB(back1))
    const G = 0.55 // the glass band's share of the depth
    const m0 = lerpP(f0, b0, G), m1 = lerpP(f1, b1, G)
    face(atrium, [f0, f1, m1, m0], [0, 0, 1])
    // The facets twist (the back follows the sloping fascia), so the grey
    // part is a bilinear grid fine enough for the arrays to sit on.
    const bl = (s: number, r: number) => lerpP(lerpP(m0, m1, s), lerpP(b0, b1, s), r)
    for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) {
      const s0 = i / 6, s1 = (i + 1) / 6, r0 = j / 3, r1 = (j + 1) / 3
      face(roof, [bl(s0, r0), bl(s1, r0), bl(s1, r1), bl(s0, r1)], [0, 0, 1])
    }
    // Solar arrays: three panels per facet, a hand's breadth proud.
    for (let k = 0; k < 3; k++) {
      const s0 = 0.08 + k * 0.31, s1 = s0 + 0.25
      const q = (s: number, r: number) => {
        const a = lerpP(m0, m1, s), b = lerpP(b0, b1, s)
        const p = lerpP(a, b, r)
        return [p[0], p[1], p[2] + 0.2] as V3
      }
      face(sky, [q(s0, 0.15), q(s1, 0.15), q(s1, 0.85), q(s0, 0.85)], [0, 0, 1])
    }
  }
}

// ---------------------------------------------------------------- output ---
// Colours from the daylight aerials: the fascia and tripods white (trim);
// the roof a light silver-grey, lighter than the library roof as it reads
// in every photo; the skylights a dark teal-grey; the curtain wall dark
// glass; the atrium's pale aqua glass.
const parts = [
  { part: white, material: PALETTE.trim },
  { part: roof, material: finish('arena-roof', 0xc0c3c1) },
  { part: sky, material: { name: 'glass', color: 0x5f7a80, roughness: 0.35 } },
  { part: glassWall, material: PALETTE.window },
  { part: atrium, material: windowVariant(2, 0x9ec4cc) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Climate Pledge Arena', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 35.4,
})
await Bun.write(new URL('../models/sea-climate-pledge-arena.glb', import.meta.url), glb)
console.log(`sea-climate-pledge-arena.glb: ${triangles} triangles, ${glb.length} bytes`)
