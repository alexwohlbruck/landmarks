/**
 * Trolley Barn Fermentory & Food Hall, 2104 South Boulevard, South End,
 * Charlotte — procedural, CC0-1.0.
 * bun generators/clt-trolley-barn.ts
 *
 * The streetcar barn beside the Lynx Blue Line, reopened as a food hall
 * (Legion Brewing and others): a long, flat-roofed shed clad in pale
 * corrugated metal over a red-brick base, with tall multi-pane steel
 * windows, dark flat canopies over its doors on the alley side, and at the
 * north-east end, facing the plaza with the old track in its paving, a
 * two-storey black steel porch in front of a red-brick end wall, with the
 * wooden "Trolley Barn" sign on its corner.
 *
 * Model frame: bearing 33. Model +y runs along the barn to the north-east
 * (the porch end), +x to the south-east (the alley); -x is the railway side.
 * Origin: the outline's centroid.
 *
 * Evidence:
 *  - OSM: way/146307369 (outline, height 10). The barn is x -12.3..6.4,
 *    y -23.2..18.0; the porch x -8.2..6.4, y 18.0..24.2.
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 0.5 m (ground_min
 *    226.20 m NAVD88), sampled in this frame: the roof is flat at 11.0 m
 *    above the lowest ground under the footprint (the railway side); the
 *    alley, the plaza and the south-west end lie 1.8 m higher, so OSM's
 *    10 m is the alley-side height. The 2016 flight shows no porch: it was
 *    added in the renovation, so its heights come from the photos.
 *  - Photos: City Dweller 2, CC BY-SA 4.0 (Wikimedia Commons): "Trolley Barn
 *    close up Late May 2024" (the porch end and the alley side), "Trolley
 *    Barn side of building Late May 2024" (the alley side: windows,
 *    canopies, brick base), "Legion Brewing Trolley Barn Mid-April 2024" (the
 *    porch end from the plaza). denton.harryman, "20220115_trolley_barn",
 *    Flickr, CC0 (the corrugated cladding and the corner sign). USGS NAIP
 *    (plan, the white roof).
 *
 * Estimated: window sizes and pitch, canopy sizes, the porch's deck height
 * (3.9 m above the plaza) and roof (just under the barn's eave), the post
 * spacing, from the photos. No photo shows the railway side or the
 * south-west end: they are given the alley side's upper windows on plain
 * cladding. The sign carries no lettering.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

// A small kit: chamfered boxes and flat shapes on axis-aligned faces.

type F = 'S' | 'N' | 'E' | 'W'
type AZ = [number, number]
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const NRM: Record<F, V3> = { S: [0, -1, 0], N: [0, 1, 0], E: [1, 0, 0], W: [-1, 0, 0] }
const SIGN: Record<F, number> = { S: -1, N: 1, E: 1, W: -1 }
const UP: V3 = [0, 0, 1], DN: V3 = [0, 0, -1]

function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
  p.tri(a, c, d, undefined, undefined, undefined, [n, n, n])
}

/** An axis-aligned box, its top edges chamfered by b; sides = [S, E, N, W]. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, b = 0, top: Part | null = p, sides = [true, true, true, true]) {
  if (x0 > x1) [x0, x1] = [x1, x0]
  if (y0 > y1) [y0, y1] = [y1, y0]
  const zt = z1 - b
  if (sides[0]) quadN(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, zt], [x0, y0, zt], NRM.S)
  if (sides[1]) quadN(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, zt], [x1, y0, zt], NRM.E)
  if (sides[2]) quadN(p, [x1, y1, z0], [x0, y1, z0], [x0, y1, zt], [x1, y1, zt], NRM.N)
  if (sides[3]) quadN(p, [x0, y1, z0], [x0, y0, z0], [x0, y0, zt], [x0, y1, zt], NRM.W)
  if (b > 0) {
    const i0 = x0 + b, i1 = x1 - b, j0 = y0 + b, j1 = y1 - b
    quadN(p, [x0, y0, zt], [x1, y0, zt], [i1, j0, z1], [i0, j0, z1], unit([0, -1, 1]))
    quadN(p, [x1, y0, zt], [x1, y1, zt], [i1, j1, z1], [i1, j0, z1], unit([1, 0, 1]))
    quadN(p, [x1, y1, zt], [x0, y1, zt], [i0, j1, z1], [i1, j1, z1], unit([0, 1, 1]))
    quadN(p, [x0, y1, zt], [x0, y0, zt], [i0, j0, z1], [i0, j1, z1], unit([-1, 0, 1]))
    if (top) quadN(top, [i0, j0, z1], [i1, j0, z1], [i1, j1, z1], [i0, j1, z1], UP)
  } else if (top) quadN(top, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], UP)
}
/** The underside of a slab. */
function soffit(p: Part, x0: number, x1: number, y0: number, y1: number, z: number) {
  if (x0 > x1) [x0, x1] = [x1, x0]
  if (y0 > y1) [y0, y1] = [y1, y0]
  quadN(p, [x0, y0, z], [x0, y1, z], [x1, y1, z], [x1, y0, z], DN)
}

/**
 * A flat convex shape on face f (the plane x = d for E/W, y = d for S/N),
 * standing o metres proud of it. Points are (a, z): a is x on S/N faces and
 * y on E/W faces, listed anticlockwise with a increasing to the right.
 */
function shape(p: Part, f: F, d: number, pts: AZ[], o = 0.04) {
  const dd = d + SIGN[f] * o
  const P = ([a, z]: AZ): V3 => (f === 'S' || f === 'N' ? [a, dd, z] : [dd, a, z])
  // On N and W faces a increases to the viewer's left, so the order flips.
  const q = f === 'N' || f === 'W' ? [...pts].reverse() : pts
  const n = NRM[f]
  for (let i = 1; i < q.length - 1; i++) p.tri(P(q[0]), P(q[i]), P(q[i + 1]), undefined, undefined, undefined, [n, n, n])
}
const rect = (p: Part, f: F, d: number, a0: number, a1: number, z0: number, z1: number, o = 0.04) => {
  if (a0 > a1) [a0, a1] = [a1, a0]
  shape(p, f, d, [[a0, z0], [a1, z0], [a1, z1], [a0, z1]], o)
}
/** A straight bar of width w on a face, from (a0, z0) to (a1, z1). */
function bar(p: Part, f: F, d: number, a0: number, z0: number, a1: number, z1: number, w: number, o = 0.08) {
  const L = Math.hypot(a1 - a0, z1 - z0), pa = (-(z1 - z0) / L) * w / 2, pz = ((a1 - a0) / L) * w / 2
  let pts: AZ[] = [[a0 - pa, z0 - pz], [a1 - pa, z1 - pz], [a1 + pa, z1 + pz], [a0 + pa, z0 + pz]]
  // Keep the winding anticlockwise whichever way the bar runs.
  const area = pts.reduce((s, [a, z], i) => { const [b, y] = pts[(i + 1) % 4]; return s + a * y - b * z }, 0)
  if (area < 0) pts = pts.reverse()
  shape(p, f, d, pts, o)
}


// ---------------------------------------------------------------------------

const metal = new Part(), brick = new Part(), win = new Part(), roof = new Part(), steel = new Part(), wood = new Part()

const X0 = -12.3, X1 = 6.4, Y0 = -23.2, Y1 = 18.0
const PX0 = -8.2, PY1 = 24.2       // the porch
const Z_ROOF = 11.0                // lidar
const G = 1.8                      // alley, plaza and south-west ground (lidar)
const Z_BASE = G + 1.3             // top of the brick base
const Z_DECK = G + 3.9, Z_PORCH = Z_ROOF - 1.2

// The shed: brick base, corrugated walls, flat roof behind a chamfered eave.
box(brick, X0, X1, Y0, Y1, 0, Z_BASE, 0, null)
box(metal, X0, X1, Y0, Y1, Z_BASE, Z_ROOF, 0.35, roof)
// The porch end wall is brick up to the porch roof.
rect(brick, 'N', Y1, PX0, X1, Z_BASE, Z_PORCH, 0.02)

// Long sides: a tall steel window per bay high up; on the alley side,
// glazed doors under dark flat canopies in alternate bays.
{
  const n = 6, m = (Y1 - Y0) / n
  for (let i = 0; i < n; i++) {
    const a = Y0 + i * m
    for (const [f, d] of [['E', X1], ['W', X0]] as [F, number][]) rect(win, f, d, a + 1.4, a + m - 1.4, G + 4.6, Z_ROOF - 1.4)
    if (i % 2 === 1 || i === n - 1) {
      rect(win, 'E', X1, a + 1.8, a + m - 1.8, G + 0.2, G + 3.6)
      box(steel, X1, X1 + 2.6, a + 1.0, a + m - 1.0, G + 3.9, G + 4.25, 0.08)
      soffit(steel, X1, X1 + 2.6, a + 1.0, a + m - 1.0, G + 3.9)
    } else rect(win, 'E', X1, a + 2.2, a + m - 2.2, Z_BASE + 0.3, G + 3.6)
  }
}
// South-west end: two upper windows.
for (const c of [-6.5, 0.6]) rect(win, 'S', Y0, c - 2.2, c + 2.2, G + 4.6, Z_ROOF - 1.4)
// The porch end wall: shopfront glazing below, the upper-level windows above.
for (const [a, b] of [[-7.4, -2.6], [-1.6, 5.6]] as AZ[]) {
  rect(win, 'N', Y1, a, b, G + 0.2, Z_DECK - 0.5)
  rect(win, 'N', Y1, a + 0.4, b - 0.4, Z_DECK + 1.2, Z_PORCH - 1.0)
}
rect(win, 'N', Y1, -11.6, -9.0, G + 4.6, Z_ROOF - 1.4)

// The two-storey steel porch: posts, a deck, a flat roof with a dark fascia.
{
  const posts = [PX0 + 0.2, -3.3, 1.5, X1 - 0.2]
  for (const x of posts) box(steel, x - 0.2, x + 0.2, PY1 - 0.4, PY1, 0, Z_PORCH, 0)
  box(steel, PX0, X1, Y1, PY1, Z_DECK - 0.45, Z_DECK, 0, roof, [false, true, true, true])
  soffit(steel, PX0, X1, Y1, PY1, Z_DECK - 0.45)
  // A low dark band for the deck's railing, set back from the edge.
  rect(steel, 'N', PY1 - 0.3, PX0 + 0.4, X1 - 0.4, Z_DECK, Z_DECK + 1.0, 0)
  rect(steel, 'S', PY1 - 0.3, PX0 + 0.4, X1 - 0.4, Z_DECK, Z_DECK + 1.0, 0)
  box(steel, PX0 - 0.2, X1 + 0.2, Y1, PY1 + 0.2, Z_PORCH, Z_PORCH + 0.55, 0.12, roof, [false, true, true, true])
  soffit(steel, PX0 - 0.2, X1 + 0.2, Y1, PY1 + 0.2, Z_PORCH)
  // The wooden sign on the porch's alley-side corner, upper level.
  box(wood, X1 - 3.4, X1 - 0.5, PY1 + 0.0, PY1 + 0.45, Z_DECK + 0.3, Z_PORCH - 0.3, 0.1)
}

// Colours from the daylight photos: silvery-white corrugated cladding, the
// red brick base, black steel held at charcoal, the sign's pale timber.
const parts = [
  { part: metal, material: finish('barn-metal', 0xdcdfdf) },
  { part: brick, material: finish('barn-brick', 0xb97563) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: steel, material: finish('barn-steel', 0x4f555c) },
  { part: wood, material: finish('barn-sign', 0xcfa66e) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
console.log(parts.map(({ part, material }) => `${material.name}: ${part.triangles}`).join(', '))
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Trolley Barn', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 33, osm: 'way/146307369', height: Z_ROOF,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/clt-trolley-barn.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
