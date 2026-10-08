/**
 * Randy's Donuts, Inglewood (1953, Henry J. Goodwin; donut sign by
 * Bradshaw, rolled steel bars and gunite) — procedural, CC0-1.0.
 * bun generators/la-randys-donuts.ts
 *
 * Map frame: x east, y north, z up, metres, origin at the area centroid of
 * OSM way/420317805 on the ground. Placed at bearing 359°: the stand's long
 * sides run 1° west of north (OSM and LARIAC outlines agree).
 *
 * What makes it Randy's: the giant brown donut standing on its edge on the
 * roof, its face turned to the south-east (to the Manchester / La Cienega
 * corner); under it a small white drive-in stand with a glazed service front
 * to the south, an orange base band and a broad flat canopy with an orange
 * fascia and rounded corners.
 *
 * Sources:
 * - Plan: OSM way/420317805 (9.8 × 17.5 m with rounded corners) and LARIAC
 *   2020 footprint 449359808688, the same outline: that outline is the
 *   canopy, the enclosed stand sits under it.
 * - Heights (measured, LA County lidar): LARIAC 2020 footprint max 13.85 m
 *   (the donut's top); LA County DSM on a 1 m grid over USGS 3DEP ground
 *   (31.4-31.8 m across the site, flat): canopy roof 3.2-3.5 m. The donut's
 *   ridge in the DSM (1 m and 0.5 m grids; the raster is about 1 m) runs
 *   from about (-2.5, -7.8) to (3.3, -1.8), centred near (0.8, -4.8): a
 *   NE-SW plane at 42-47° from north (fits at 8, 10 and 11 m thresholds),
 *   taken as 44°. So the donut faces south-east (to the Manchester /
 *   La Cienega corner, where photos show it face-on) and north-west, over
 *   the south half of the stand. NAIP (USGS, public domain) shows the same
 *   diagonal brown shape and its shadow. DSM peak 12.5 m on that raster;
 *   the footprint maximum 13.85 m is used for the top.
 * - Published: the donut is about 32 ft (9.8-9.9 m) across (LA Conservancy,
 *   Wikipedia "Randy's Donuts"); 13.85 m top - 9.9 m = 3.95 m bottom, just
 *   clear of the 3.4 m canopy roof, as in the photos.
 * - Photos (Wikimedia Commons): Carol M. Highsmith "Randy's donuts1
 *   edit1.jpg" (public domain; from the south-east: donut face-on, glazed
 *   south front, white east wall); John Margolies LCCN2017709527-30 (public
 *   domain; south-east); Bobak Ha'Eri "2008-0914-RandysDonuts.jpg"
 *   (CC BY 3.0) and Ken Lund 14331154679 / 14331306597 (CC BY-SA 2.0;
 *   from the south across Manchester Blvd); Chris Yarzab 48011472087
 *   (CC BY 2.0; south-east, 2019 orange paint); "Randy's Donuts LAX - Feb
 *   2024" is the airport copy, not used; Sony 1992 "South Bay Los Angeles CA
 *   20210211" (124), (125), (130), (131), (133) (CC0; west wall with the
 *   diamond logo, south-east, and from the Manchester / La Cienega corner);
 *   Northwalker "Randy's Donuts LA, seen from Air on approach to LAX" (CC0;
 *   high oblique from the south).
 * - From the photos (estimated): hole diameter 0.31 of the outer diameter,
 *   so a true torus of major radius 3.24 m and tube radius 1.71 m;
 *   the enclosed stand's size under the canopy (glazed
 *   front about 2 m back from the canopy's south edge, about 1 m in on the
 *   sides); window bays; two roof posts under the donut.
 * - Colours: the donut's tan biscuit as the daylight photos show it
 *   (Highsmith, Ha'Eri), pulled to palette lightness; the orange fascia and base band of the c. 2020
 *   repaint, softened; white walls and soffit as `trim`.
 * - Left out: the "RANDY'S" / "DONUTS" lettering (block letters bent round
 *   the ring did not read as the real script at map scale), the donut's knobbly
 *   gunite texture, wall logos and menus, the floodlights, the parking lot.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const donut = new Part(), white = new Part()
const orange = new Part(), win = new Part(), roof = new Part()

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

/** A quad wound to face `hint`. */
function quad(p: Part, P: V3[], hint: V3) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  if (dot(f, hint) >= 0) { p.tri(P[0], P[1], P[2]); p.tri(P[0], P[2], P[3]) }
  else { p.tri(P[0], P[2], P[1]); p.tri(P[0], P[3], P[2]) }
}

/** A rounded rectangle, counter-clockwise from above. */
function rrect(x0: number, x1: number, y0: number, y1: number, r: number, z: number, n = 3): V3[] {
  const out: V3[] = []
  const cs: [number, number, number][] = [[x1 - r, y0 + r, -90], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, 90], [x0 + r, y0 + r, 180]]
  for (const [cx, cy, a0] of cs) for (let i = 0; i <= n; i++) {
    const a = ((a0 + (90 * i) / n) * Math.PI) / 180
    out.push([cx + r * Math.cos(a), cy + r * Math.sin(a), z])
  }
  return out
}
/** Walls between rings (counter-clockwise), facing out. */
function walls(p: Part, rings: V3[][]) {
  const n = rings[0].length
  for (let k = 0; k < rings.length - 1; k++) for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    p.quad(rings[k][i], rings[k][j], rings[k + 1][j], rings[k + 1][i])
  }
}
function capUp(p: Part, ring: V3[]) { for (let i = 1; i < ring.length - 1; i++) p.tri(ring[0], ring[i], ring[i + 1]) }
function capDown(p: Part, ring: V3[]) { for (let i = 1; i < ring.length - 1; i++) p.tri(ring[0], ring[i + 1], ring[i]) }

/** An axis-aligned box, closed. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const r = (z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  walls(p, [r(z0), r(z1)])
  capUp(p, r(z1))
  capDown(p, r(z0))
}

// ---------------------------------------------------------------------------
// The stand.
// Canopy: the OSM / LARIAC outline in this frame, rounded corners.
const CX0 = -4.85, CX1 = 4.85, CY0 = -8.72, CY1 = 8.78, CR = 0.75
const SOFFIT = 2.85, ROOF = 3.4
{
  const r0 = rrect(CX0, CX1, CY0, CY1, CR, SOFFIT)
  const r1 = rrect(CX0, CX1, CY0, CY1, CR, ROOF - 0.14)
  const r2 = rrect(CX0 + 0.14, CX1 - 0.14, CY0 + 0.14, CY1 - 0.14, CR - 0.14, ROOF)
  walls(orange, [r0, r1, r2]) // the fascia, with a rounded top edge
  capUp(roof, r2)
  capDown(white, r0) // the soffit
}
// The enclosed stand under it (estimated from photos).
const SX0 = -3.55, SX1 = 3.75, SY0 = -6.7, SY1 = 7.7, BASE = 0.9
{
  const ring = (z: number, o = 0) => rrect(SX0 - o, SX1 + o, SY0 - o, SY1 + o, 0.2 + o, z, 1)
  walls(orange, [ring(0, 0.04), ring(BASE, 0.04)])
  capUp(orange, ring(BASE, 0.04))
  walls(white, [ring(BASE), ring(SOFFIT)])
}
// Canopy posts at the two front corners (Highsmith, Margolies).
for (const x of [CX0 + 0.75, CX1 - 0.75]) box(white, x - 0.15, x + 0.15, CY0 + 0.7, CY0 + 1.0, 0, SOFFIT)

// Window panels, one per real window, on or just off the wall (0.04 m).
const W0 = 1.0, W1 = 2.55
function panelY(y: number, x0: number, x1: number, z0 = W0, z1 = W1) { // on a south (y = SY0) or north wall
  const s = y < 0 ? -1 : 1, yy = y + s * 0.04
  quad(win, [[x0, yy, z0], [x1, yy, z0], [x1, yy, z1], [x0, yy, z1]], [0, s, 0])
}
function panelX(x: number, y0: number, y1: number, z0 = W0, z1 = W1) { // on a west or east wall
  const s = x < 0 ? -1 : 1, xx = x + s * 0.04
  quad(win, [[xx, y0, z0], [xx, y1, z0], [xx, y1, z1], [xx, y0, z1]], [s, 0, 0])
}
// South: the glazed service front, four bays between dark posts.
{
  const n = 4, g = 0.16, a = SX0 + 0.3, b = SX1 - 0.3, w = (b - a - g * (n - 1)) / n
  for (let i = 0; i < n; i++) panelY(SY0, a + i * (w + g), a + i * (w + g) + w)
}
// West: two windows by the south corner (Sony 1992 (124)). East: one small
// window in the white wall (Highsmith). North: no photo, left plain.
panelX(SX0, SY0 + 0.35, SY0 + 1.9)
panelX(SX0, SY0 + 2.06, SY0 + 3.6)
panelX(SX1, 1.2, 2.2, 1.55, 2.35)

// ---------------------------------------------------------------------------
// The donut: a true torus standing on its edge.
const TOP = 13.85                    // LARIAC 2020 max height
const DO = 9.9                       // outer diameter, ~32 ft
const HOLE = 0.31                    // hole / outer diameter, photos
const RO = DO / 2, RI = (RO * HOLE)
const r = (RO - RI) / 2, R = RI + r  // tube radius, major radius
const C: V3 = [0.8, -4.8, TOP - RO]  // centre: DSM ridge
const PLANE = (45 * Math.PI) / 180   // 44° true + 1° for the frame's bearing
const T: V3 = [Math.sin(PLANE), Math.cos(PLANE), 0]  // along the donut, to the NE
const N: V3 = [T[1], -T[0], 0]                       // face normal, to the SE
const Z: V3 = [0, 0, 1]
const at = (u: number, v: number, w: number): V3 => add(C, add(add(mul(T, u), mul(Z, v)), mul(N, w)))
{
  const NM = 48, NT = 20
  const P = (i: number, j: number) => {
    const a = (2 * Math.PI * i) / NM, b = (2 * Math.PI * j) / NT
    const radial: V3 = add(mul(T, Math.cos(a)), mul(Z, Math.sin(a)))
    const nrm = unit(add(mul(radial, Math.cos(b)), mul(N, Math.sin(b))))
    return { p: add(add(C, mul(radial, R)), mul(nrm, r)), n: nrm }
  }
  for (let i = 0; i < NM; i++) for (let j = 0; j < NT; j++) {
    const a = P(i, j), b = P(i + 1, j), c = P(i + 1, j + 1), d = P(i, j + 1)
    const f = cross(sub(b.p, a.p), sub(c.p, a.p))
    if (dot(f, a.n) >= 0) {
      donut.tri(a.p, b.p, c.p, undefined, undefined, undefined, [a.n, b.n, c.n])
      donut.tri(a.p, c.p, d.p, undefined, undefined, undefined, [a.n, c.n, d.n])
    } else {
      donut.tri(a.p, c.p, b.p, undefined, undefined, undefined, [a.n, c.n, b.n])
      donut.tri(a.p, d.p, c.p, undefined, undefined, undefined, [a.n, d.n, c.n])
    }
  }
}
// Two roof posts carrying it, in its plane, from the roof up into the tube.
for (const s of [-3.5, 3.5]) {
  const q = at(s, 0, 0), zTop = C[2] - Math.sqrt(RO * RO - s * s) + 0.5
  const h = 0.24
  const cs: V3[] = [[-h, -h, 0], [h, -h, 0], [h, h, 0], [-h, h, 0]].map(([a, b]) => add(add(mul(T, a), mul(N, b)), [q[0], q[1], 0]) as V3)
  const ring = (z: number) => cs.map(p => [p[0], p[1], z] as V3)
  const r0 = ring(ROOF - 0.05), r1 = ring(zTop)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    quad(white, [r0[i], r0[j], r1[j], r1[i]], sub(r0[i], [q[0], q[1], r0[i][2]]))
  }
}

// ---------------------------------------------------------------------------
const parts = [
  { part: donut, material: finish('randys-donut', 0xcdab84) },
  { part: white, material: PALETTE.trim },
  { part: orange, material: finish('randys-orange', 0xdd8f5c) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb("Randy's Donuts", parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 359, osm: 'way/420317805',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/la-randys-donuts.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
