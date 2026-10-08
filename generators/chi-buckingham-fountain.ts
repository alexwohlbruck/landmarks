/**
 * Clarence Buckingham Memorial Fountain (Edward H. Bennett, sculptor Marcel
 * Loyau, 1927), Grant Park, Chicago — original procedural geometry, CC0-1.0.
 *
 *   bun generators/chi-buckingham-fountain.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the fountain's axis,
 * the centre of the OSM pool polygon way/561821879 (41.87580, -87.61897),
 * at the pool's water level. The pool is square to the street grid, so the
 * catalog bearing is 0.
 *
 * Identity: the pink marble wedding cake — a broad lower basin, a middle
 * basin, and the upper cup on its short columns — standing in a huge
 * quatrefoil pool with square corners, with the four bronze seahorse groups
 * out in the pool on the diagonals.
 *
 * Evidence:
 *  - Published (Wikipedia, "Buckingham Fountain"): Georgia pink marble;
 *    bottom pool 280 ft (85 m) across, lower basin 103 ft (31 m), middle
 *    60 ft (18 m), upper 24 ft (7.3 m); the lip of the upper basin is 25 ft
 *    (7.6 m) above the water of the lower pool; four groups of two sea horses.
 *  - OSM way/561821879 (the water): lobes of radius 25.8 m centred 16.9 m
 *    out on each axis, joined by square corners at about 30.5 m. The OSM
 *    corners differ by a metre or so between quadrants; the model takes
 *    one quadrant's average and mirrors it, as the real pool is symmetric.
 *  - USGS NAIP orthophoto: the same quatrefoil, the pale rim coping about
 *    1.3 m wide, the three basin rings, and the seahorse groups at about
 *    (±20.8, ±20.2) m.
 *  - Photos (Wikimedia Commons): Buckingham_Fountain.JPG (Adrian104, public
 *    domain); BuckinghamFountainCloseUp.jpg (CC BY-SA 3.0); Buckingham
 *    Fountain, Chicago, 1940s (Hedrich-Blessing, NBY 3093, public domain);
 *    Ken Lund's 9179522737, 9179525679, 9181736412, 9181739434 (CC BY-SA
 *    2.0); Buckingham Al Bundy Fountain Chicago (dronepicr, CC BY 3.0).
 *    Tier heights measured off the close-up against the published 7.6 m:
 *    lower lip about 2.4 m, middle lip 4.7 m, upper cup 5.6-7.6 m on
 *    short columns (also checked on Buckingham_Fountain.JPG, taken from further).
 *  - Colour: the marble reads a warm pink-tan, pulled to the palette's
 *    lightness; the seahorses are green-patinated bronze.
 *
 * Estimated: the basin wall profiles, the number and size of the urn piers
 * (eight on each of the lower two tiers), the cup's columns, the seahorse
 * forms (drawn as bold masses: chest, neck and head, coiled fish tail, and
 * the reed plinth between each pair). Left out: the pool water (the map's),
 * the rococo shells, the jets. The basins' water is drawn (see BASIN).
 */
import { Part, addGltfTriangles, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const MARBLE = finish('pink-marble', 0xe2c4b2)
const LIP = finish('pink-marble-light', 0xf0dccd)
const DEEP = finish('pink-marble-deep', 0xcfae9c)
// The fountain's own raised basins hold water at 2-7 m, above any ground the
// map draws; a pale spray-lit water tone is what makes the tiers read from
// above (NAIP shows them pale). The pool at ground level is left to the map.
const BASIN = finish('basin-water', 0xb4cfcb, 0.4)
const BRONZE = PALETTE.patina

const marble = new Part(), lip = new Part(), deep = new Part(), bronze = new Part(), basin = new Part()
const SEG = 24 // around the big basins

type XY = [number, number]
const circle = (r: number, z: number, n = SEG, a0 = 0): V3[] =>
  Array.from({ length: n }, (_, i) => {
    const a = a0 + (i / n) * Math.PI * 2
    return [r * Math.cos(a), r * Math.sin(a), z] as V3
  })

/**
 * A round tier from a profile of [radius, z] rows, outside going up, then
 * across the top: the lip and the basin floor inside it.
 */
function tier(profile: [number, number][], lipTop: number, lipInner: number, floor: number, n = SEG) {
  marble.loft(profile.map(([r, z]) => circle(r, z, n)))
  const [rTop] = profile[profile.length - 1]
  // Bevelled lip: out to in across the top, then down inside to the floor.
  lip.loft([circle(rTop, profile[profile.length - 1][1], n), circle(rTop - 0.25, lipTop, n), circle(lipInner + 0.2, lipTop, n),
    circle(lipInner, lipTop - 0.2, n)])
  lip.loft([circle(lipInner, lipTop - 0.2, n), circle(lipInner, floor, n)])
  basin.cap(circle(lipInner, floor, n), true)
}

// Lower basin: 31 m across, lip at 2.0 m, with a plinth at the water.
tier([[16.0, 0], [16.0, 0.35], [15.5, 0.5], [15.6, 1.95], [15.8, 2.2]], 2.4, 14.9, 2.1)
// Middle basin: 18 m across on the lower basin's floor, lip at 4.5 m.
tier([[8.6, 2.09], [8.7, 3.85], [9.0, 4.45]], 4.7, 8.3, 4.4)
// The upper cup's columns: a core and four round columns.
marble.loft([circle(1.2, 4.39, 12), circle(1.2, 5.7, 12)])
for (let k = 0; k < 4; k++) {
  const a = Math.PI / 4 + (k * Math.PI) / 2
  const c = circle(0.38, 0, 10).map(([x, y]) => [x + 1.75 * Math.cos(a), y + 1.75 * Math.sin(a)] as XY)
  marble.loft([c.map(([x, y]) => [x, y, 4.39] as V3), c.map(([x, y]) => [x, y, 5.8] as V3)])
}
// The cup: a flared bowl, 7.3 m across at its lip at 7.6 m.
marble.loft([circle(2.45, 5.55, 24), circle(2.25, 5.75, 24), circle(2.55, 6.1, 24), circle(3.3, 6.85, 24), circle(3.65, 7.35, 24)])
deep.cap(circle(2.45, 5.55, 24), false)
lip.loft([circle(3.65, 7.35, 24), circle(3.6, 7.6, 24), circle(3.25, 7.6, 24), circle(3.1, 7.4, 24), circle(3.1, 7.1, 24)])
basin.cap(circle(3.1, 7.1, 24), true)

/** A rounded urn pier standing on a tier's rim, its outer face flush. */
function pier(r: number, a: number, z0: number, z1: number, w: number) {
  const cx = r * Math.cos(a), cy = r * Math.sin(a)
  const rings = [[0.5, z0], [0.5, z1 - (z1 - z0) * 0.45], [0.62, z1 - (z1 - z0) * 0.2], [0.42, z1]]
  const ring = (s: number, z: number) => circle(s * w, z, 6, a).map(([x, y]) => [cx + x, cy + y, z] as V3)
  deep.loft(rings.map(([s, z]) => ring(s, z)))
  deep.cap(ring(rings[rings.length - 1][0], z1), true)
}
for (let k = 0; k < 8; k++) {
  const a = (k * Math.PI) / 4
  pier(15.0, a, 2.35, 3.3, 1.3)
  for (const s of [-1, 1]) pier(8.3, a + Math.PI / 8 + s * 0.11, 4.65, 5.6, 1.2)
}

// The pool rim: a low coping along the quatrefoil, the water's edge inside.
const LOBE_C = 16.9, LOBE_R = 25.8, CORNER = 30.5, RIM = 1.3, RIM_H = 0.6

/** The pool's edge offset outward by `d`: one eighth, mirrored round. */
function poolRing(d: number): XY[] {
  const R = LOBE_R + d, k = CORNER + d
  // The east lobe from the x axis up to where it meets the corner's line.
  const yEnd = Math.sqrt(R * R - (k - LOBE_C) ** 2)
  const a1 = Math.atan2(yEnd, k - LOBE_C)
  const eighth: XY[] = []
  const n = 7
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * a1
    eighth.push([LOBE_C + R * Math.cos(a), R * Math.sin(a)])
  }
  eighth.push([k, k]) // the square corner, reached up the line x = k
  // Mirror across the diagonal for the north lobe's half, then round the
  // four quadrants.
  const quarter: XY[] = [...eighth, ...eighth.slice(0, -1).reverse().map(([x, y]) => [y, x] as XY)]
  const out: XY[] = []
  for (let q = 0; q < 4; q++) {
    const c = Math.cos((q * Math.PI) / 2), s = Math.sin((q * Math.PI) / 2)
    for (const [x, y] of quarter.slice(0, -1)) out.push([x * c - y * s, x * s + y * c])
  }
  return out
}
{
  const at = (pts: XY[], z: number) => pts.map(([x, y]) => [x, y, z] as V3)
  const inner = poolRing(0), outer = poolRing(RIM)
  const inB = poolRing(0.12), outB = poolRing(RIM - 0.12)
  // Outer wall and bevel, inner wall and bevel (reversed: it faces the pool).
  lip.loft([at(outer, 0), at(outer, RIM_H - 0.12), at(outB, RIM_H)])
  lip.loft([at(inner, 0), at(inner, RIM_H - 0.12)].map((r) => r.reverse()))
  lip.loft([at(inner, RIM_H - 0.12), at(inB, RIM_H)].map((r) => r.reverse()))
  const top0 = at(inB, RIM_H), top1 = at(outB, RIM_H)
  for (let i = 0; i < top0.length; i++) {
    const j = (i + 1) % top0.length
    lip.quad(top0[i], top1[i], top1[j], top0[j])
  }
}

// The seahorse groups: out in the pool on the diagonals, each pair rearing
// back to back across a bronze reed plinth, facing round the pool.
function ellipsoid(c: V3, r: V3, dir: XY, tilt: number, nu = 8, nv = 5) {
  // Local frame: f along `dir` (tilted up by `tilt`), s sideways, u up.
  const [dx, dy] = dir
  const f: V3 = [dx * Math.cos(tilt), dy * Math.cos(tilt), Math.sin(tilt)]
  const u: V3 = [-dx * Math.sin(tilt), -dy * Math.sin(tilt), Math.cos(tilt)]
  const s: V3 = [dy, -dx, 0]
  const pt = (i: number, j: number) => {
    const th = (i / nu) * Math.PI * 2, ph = -Math.PI / 2 + (j / nv) * Math.PI
    const a = Math.cos(ph) * Math.cos(th) * r[0], b = Math.cos(ph) * Math.sin(th) * r[1], h = Math.sin(ph) * r[2]
    const p: V3 = [c[0] + f[0] * a + s[0] * b + u[0] * h, c[1] + f[1] * a + s[1] * b + u[1] * h, c[2] + f[2] * a + s[2] * b + u[2] * h]
    // Normal of an ellipsoid: the local position over the squared radii.
    const na = Math.cos(ph) * Math.cos(th) / r[0], nb = Math.cos(ph) * Math.sin(th) / r[1], nh = Math.sin(ph) / r[2]
    const n: V3 = [f[0] * na + s[0] * nb + u[0] * nh, f[1] * na + s[1] * nb + u[1] * nh, f[2] * na + s[2] * nb + u[2] * nh]
    const l = Math.hypot(...n)
    return { p, n: [n[0] / l, n[1] / l, n[2] / l] as V3 }
  }
  for (let j = 0; j < nv; j++) {
    for (let i = 0; i < nu; i++) {
      const a = pt(i, j), b = pt(i + 1, j), cc = pt(i + 1, j + 1), d = pt(i, j + 1)
      if (j > 0) bronze.tri(a.p, d.p, b.p, undefined, undefined, undefined, [a.n, d.n, b.n])
      if (j < nv - 1) bronze.tri(b.p, d.p, cc.p, undefined, undefined, undefined, [b.n, d.n, cc.n])
    }
  }
}

for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
  const cx = 20.8 * sx, cy = 20.5 * sy
  const r = Math.hypot(cx, cy)
  const t: XY = [-cy / r, cx / r] // tangent round the pool
  // The reed plinth.
  const base = circle(1.0, 0, 10).map(([x, y]) => [cx + x, cy + y] as XY)
  bronze.loft([base.map(([x, y]) => [x, y, 0] as V3), base.map(([x, y]) => [x, y, 1.5] as V3)])
  bronze.cap(base.map(([x, y]) => [x, y, 1.5] as V3), true)
  for (const side of [1, -1]) {
    const d: XY = [t[0] * side, t[1] * side]
    const at = (along: number, z: number): V3 => [cx + d[0] * along, cy + d[1] * along, z]
    ellipsoid(at(1.6, 1.45), [1.2, 0.75, 1.0], d, 0.6) // chest, rearing
    ellipsoid(at(2.35, 2.55), [0.8, 0.4, 0.4], d, 1.0) // neck, raised
    ellipsoid(at(2.95, 3.05), [0.65, 0.32, 0.3], d, -0.45) // head, muzzle down
    ellipsoid(at(2.8, 1.05), [0.75, 0.6, 0.18], d, -0.2) // webbed forefeet
    ellipsoid(at(0.4, 0.68), [1.4, 0.55, 0.5], d, 0.3) // coiled fish tail
  }
}

/** Smooth-shade a part's curved faces, keeping its edges (bevels, lips). */
function smooth(p: Part, crease = 35) {
  const out = new Part()
  addGltfTriangles(out, new Float32Array(p.pos), Uint32Array.from({ length: p.pos.length / 3 }, (_, i) => i), { creaseDegrees: crease })
  return out
}

const parts = [
  { part: smooth(marble), material: MARBLE },
  { part: smooth(lip), material: LIP },
  { part: smooth(deep), material: DEEP },
  { part: bronze, material: BRONZE },
  { part: basin, material: BASIN },
]
const tris = parts.reduce((s, p) => s + p.part.triangles, 0)
if (tris > 6500) throw new Error(`over budget: ${tris} triangles`)
const glb = writeGlb('Buckingham Fountain', parts, {
  title: 'Clarence Buckingham Memorial Fountain',
  license: 'CC0-1.0',
  source: 'generators/chi-buckingham-fountain.ts',
})
const out = process.argv[2] ?? new URL('../models/chi-buckingham-fountain.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
