/**
 * Wells Fargo Plaza (1000 Louisiana; built 1983 as Allied Bank Plaza,
 * Skidmore, Owings & Merrill, Richard Keating), Houston.
 * Original procedural geometry, CC0-1.0.
 * bun generators/hou-wells-fargo-plaza.ts
 *
 * Frame: built turned to the downtown grid, BEARING 34.6: +y runs north-east,
 * +x south-east, z up, metres. Origin = centroid of the OSM outline
 * way/44821987 (-95.3683016, 29.7584357).
 *
 * What it is: a 71-storey shaft of blue-green reflective glass whose plan is
 * two halves slid past each other: each half is a rectangle with one corner
 * swept round in a big quarter circle, the south half rounded to the
 * south-east and the north half to the north-west (180-degree symmetry), so
 * a long face has a flat half and a curved half with a full-height notch
 * where they meet. It rises straight to a flat top with a small penthouse.
 *
 * Evidence
 * - OSM: outline way/44821987 (302 m, 71 levels). No building:part inside it
 *   (way/260365758 nearby is a 2 m² stray, not inside the outline).
 * - USGS 3DEP lidar TX_Coastal_B1_2018 (flight 2018), 0.5 m grid sampled in
 *   this frame (SCRATCH/work/hou-wells-fargo-plaza/lidar.json). The plaza
 *   and streets round the tower are 6.2 m above the grid's ground_min (which
 *   is in a garage ramp south of the tower); y = 0 is that plaza. Measured:
 *   the roof is one level, 297.1 m above it, over the whole outline (the
 *   lower floors do not step out: the lidar shows no setbacks); a penthouse
 *   12 x 39 m to 302.6 m. Plan from the roof mask: halves offset 6 m at the
 *   notch, half-depth 32.75 m, straight faces 20.5 m and rounded faces
 *   24 m from the centre, quarter circles of radius 28 m (a least-squares
 *   fit to the roof edge gives 29 m).
 * - Published (Wikipedia, CTBUH): 992 ft (302.4 m), 71 floors, 1983. The
 *   published height is about 5 m more than lidar measures above the plaza;
 *   it likely counts from the concourse below. The model uses the lidar.
 *   The lead's note of "stepping back in tiers" is not borne out by the
 *   lidar or the photos: the shaft is a straight extrusion.
 * - Commons daylight photos (EVIDENCE):
 *   "Wells Fargo Plaza, Houston.jpg" (Carol M. Highsmith, public domain) —
 *     aerial, the whole shaft, the flat top and penthouse;
 *   "Wells Fargo Plaza Houston TX 2014 08 03 02.JPG" (Quercus montana,
 *     CC BY-SA 4.0) — the notch and the curved half;
 *   "Wells Fargo Plaza.jpg" (Rick Kimpel, CC BY-SA 2.0) — curved corner and
 *     the notch at the top;
 *   "Gfp-texas-houston-big-skyscraper.jpg" (Yinan Chen, public domain) — the
 *     notch from below;
 *   "Wells Fargo Plaza Houston TX 2014 08 03 03.jpg" and "... 01.jpg"
 *     (Quercus montana, CC BY-SA 4.0).
 *
 * Estimated: the glass colour (the photos' teal reflective glass pulled light),
 * pale mullion lines (one floor line every six floors, vertical lines at the
 * notch and where the curves begin) in place of the real fine grid; the
 * penthouse's form.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const BEARING = 34.6
const glass = new Part(), lines = new Part(), roof = new Part()

const H = 297.1, C: XY = [2.25, -0.75], R = 28, SEG = 10

/** The outline, counter-clockwise from above; `corner` marks vertices that get a vertical line. */
const outline: XY[] = [], corner: boolean[] = []
const push = (p: XY, c = true) => { outline.push([p[0] + C[0], p[1] + C[1]]); corner.push(c) }
push([-20.5, -32.75]); push([-4, -32.75])
for (let i = 1; i < SEG; i++) { const a = -Math.PI / 2 + Math.PI / 2 * i / SEG; push([-4 + R * Math.cos(a), -4.75 + R * Math.sin(a)], false) }
push([24, -4.75]); push([24, 0]); push([20.5, 0]); push([20.5, 32.75]); push([4, 32.75])
for (let i = 1; i < SEG; i++) { const a = Math.PI / 2 + Math.PI / 2 * i / SEG; push([4 + R * Math.cos(a), 4.75 + R * Math.sin(a)], false) }
push([-24, 4.75]); push([-24, 0]); push([-20.5, 0])

const area = (p: XY[]) => p.reduce((a, q, i) => { const r = p[(i + 1) % p.length]; return a + q[0] * r[1] - r[0] * q[1] }, 0) / 2
function triangulate(poly: XY[]): [XY, XY, XY][] {
  const p = area(poly) < 0 ? [...poly].reverse() : [...poly]
  const out: [XY, XY, XY][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (q: XY, a: XY, b: XY, c: XY) => cr(a, b, q) > 1e-9 && cr(b, c, q) > 1e-9 && cr(c, a, q) > 1e-9
  let guard = 0
  while (p.length > 3 && guard++ < 1000) {
    for (let i = 0; i < p.length; i++) {
      const a = p[(i + p.length - 1) % p.length], b = p[i], c = p[(i + 1) % p.length]
      if (cr(a, b, c) <= 1e-9) continue
      if (p.some((q) => q !== a && q !== b && q !== c && inside(q, a, b, c))) continue
      out.push([a, b, c]); p.splice(i, 1); break
    }
  }
  out.push([p[0], p[1], p[2]])
  return out
}

/** A strip on the plane over a→b (outward = right of a→b), between z0 and z1, standing `off` proud. */
function strip(part: Part, a: XY, b: XY, z0: number, z1: number, off = 0) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = (b[1] - a[1]) / L * off, ny = -(b[0] - a[0]) / L * off
  part.quad([a[0] + nx, a[1] + ny, z0], [b[0] + nx, b[1] + ny, z0], [b[0] + nx, b[1] + ny, z1], [a[0] + nx, a[1] + ny, z1])
}

const FLOOR = H / 71, LINE_EVERY = 6
const n = outline.length
for (let i = 0; i < n; i++) {
  const a = outline[i], b = outline[(i + 1) % n]
  strip(glass, a, b, 0, H)
  // floor lines every six floors, and a pale band at the top
  for (let f = LINE_EVERY; f < 71; f += LINE_EVERY) strip(lines, a, b, f * FLOOR - 0.3, f * FLOOR + 0.3, 0.06)
  strip(lines, a, b, H - 1.2, H, 0.06)
  // vertical lines at the corners and notches
  if (corner[i]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t = Math.min(0.6, L / 2) / L
    strip(lines, a, [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], 0, H, 0.06)
  }
  if (corner[(i + 1) % n]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t = 1 - Math.min(0.6, L / 2) / L
    strip(lines, [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], b, 0, H, 0.06)
  }
}
for (const [a, b, c] of triangulate(outline)) roof.tri([a[0], a[1], H], [b[0], b[1], H], [c[0], c[1], H])

// the penthouse on the roof
{
  const x0 = -9, x1 = 3, y0 = -21, y1 = 18, z0 = H, z1 = 302.6
  const ring: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  for (let i = 0; i < 4; i++) strip(roof, ring[i], ring[(i + 1) % 4], z0, z1)
  roof.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1])
}

const parts = [
  { part: glass, material: { ...PALETTE.window, color: 0x6f9a9b } },
  { part: lines, material: finish('wfp-mullion', 0xd3dfdd) },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Wells Fargo Plaza', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [29.7584357, -95.3683016], height: 302.6,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/44821987'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/hou-wells-fargo-plaza.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
