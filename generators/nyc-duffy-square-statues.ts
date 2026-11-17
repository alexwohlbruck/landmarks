/**
 * The two statues of Father Duffy Square, Times Square, Manhattan:
 * Charles Keck's Father Francis P. Duffy (bronze, dedicated 2 May 1937)
 * before a granite Celtic cross, and Georg J. Lober's George M. Cohan
 * (bronze, 1959) on a granite pedestal. Procedural, CC0-1.0.
 *   bun generators/nyc-duffy-square-statues.ts
 *
 * One model, one placement, for both. They are a pair: the two monuments
 * of the same small square, on its long axis 35 m apart, both facing south
 * down Times Square, in the same bronze and grey granite. One entry keeps
 * them together in the catalog and on the map instead of two dots a few
 * metres wide; the ground between them (the plaza, which the map draws) is
 * left empty. The plaza falls about 0.7 m from Duffy south to Cohan
 * (lidar), and the map stands each vertex on the ground under it, so each
 * pedestal still meets its own ground.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 29 (the
 * Manhattan grid; Duffy Square's axis), so both figures face -y, south
 * down the square. Origin: midway between the OSM artwork nodes,
 * node/2639531695 "Francis P. Duffy" (wikidata Q27919854) and
 * node/2435110791 "George M. Cohan" (Q27919856). Neither is mapped as a
 * building, so the model replaces nothing.
 *
 * Positions: Duffy's pedestal at (-1.7, 16.4), from the lidar: the cross's
 * top shows as a 5.6-5.9 m return at (-1.4..-2.0, 16.8..16.9) (USGS 3DEP
 * NY_NewYorkCity, 2017 flight, 0.5 m grid), 0.5 m from the OSM node; it
 * stands 1.2 m in front of the TKTS steps' first riser, as in t9 and d2.
 * Cohan at (2.2, -17.6), the OSM node: the lidar shows no clear return for
 * him (estimated position).
 *
 * Heights: Duffy's cross top 5.6 m above the plaza (lidar, 5.6-5.9 with
 * noise). Everything else is scaled from photos by that height and by
 * people beside the pedestals, and is estimated: Duffy's base slab 0.45 m,
 * pedestal block to 2.5 m (1.5 x 1.55 m, a little wider than the cross),
 * bronze ground plate 0.15 m, the figure 2.5 m (heroic, about 1.4x life),
 * the cross shaft 1.1 m wide and 0.5 m deep with arms 2.0 m across at
 * 4.1-4.9 m, level with the head (d1), and a solid ring of radius 0.92 m
 * filling the angles (d1, d2, t9). Cohan's pedestal 2.05 m (1.35 x 1.2 m)
 * on a low base, ground plate 0.12 m, figure 2.4 m (c1, c2, c4).
 * Poses (d1, d2): Duffy bareheaded in a belted trench coat to the knee,
 * puttees and boots, feet apart, both hands clasped at the waist holding
 * a book, a helmet on the ground by his left foot. (c1, c3): Cohan in a
 * suit, his right hand on a cane planted forward and out, his left arm
 * down holding his hat by the brim, his left foot a little forward.
 * Colours from the photos: Duffy's pedestal and cross a mid grey granite,
 * Cohan's a paler grey; bronze a dark brown lifted to a mid bronze so the
 * figures read at map lighting.
 * Night: Times Square's screens and the square's lamps light both all
 * night (c1 at dusk, t1); bronze and granite carry `_FLOODLIGHT`, the
 * south faces most.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - d1 "Father Duffy by Charles Keck (May 2023).JPG", Benoit Prieur, CC0:
 *   the figure and the cross straight on.
 *   https://commons.wikimedia.org/wiki/File:Father_Duffy_by_Charles_Keck_(May_2023).JPG
 * - d2 "Father Duffy by Charles Keck - DSC06430.JPG", Daderot, public
 *   domain: from the south-west, the pedestal, cross and steps behind.
 *   https://commons.wikimedia.org/wiki/File:Father_Duffy_by_Charles_Keck_-_DSC06430.JPG
 * - t9 "Father Duffy statue and TKTS booth risers.jpg", Beyond My Ken,
 *   CC BY-SA 3.0: straight on from the south.
 *   https://commons.wikimedia.org/wiki/File:Father_Duffy_statue_and_TKTS_booth_risers.jpg
 * - c1 "George M. Cohan Statue in Times Square - New York, NY, USA -
 *   August 18, 2015 01.jpg", Giorgio Galeotti, CC BY 4.0: the figure from
 *   the south-west at dusk, cane and hat.
 *   https://commons.wikimedia.org/wiki/File:George_M._Cohan_Statue_in_Times_Square_-_New_York,_NY,_USA_-_August_18,_2015_01.jpg
 * - c2 "George M Cohan statue and Duffy Square.jpg", Beyond My Ken, CC
 *   BY-SA 3.0: from the south, Duffy and the steps behind.
 *   https://commons.wikimedia.org/wiki/File:George_M_Cohan_statue_and_Duffy_Square.jpg
 * - c3 "George M. Cohan by Georg Lober - DSC06435.JPG", Daderot, public
 *   domain. https://commons.wikimedia.org/wiki/File:George_M._Cohan_by_Georg_Lober_-_DSC06435.JPG
 * - c4 "George M. Cohan statue in Times Square IMG 1607.JPG", Billy
 *   Hathorn, public domain.
 *   https://commons.wikimedia.org/wiki/File:George_M._Cohan_statue_in_Times_Square_IMG_1607.JPG
 *
 * Doubts: Cohan's position rests on the OSM node alone. The figures are
 * bold simplified masses: no faces, buttons, coat folds or the cross's
 * four bosses. The pedestal inscriptions are left out. Depths of the
 * pedestals are from oblique photos.
 */
import { Part, addGltfTriangles, cross, sub, len, writeGlb, type V3, type MaterialSpec } from './mesh'
import { finish } from './palette'

const TAU = Math.PI * 2
const unit = (v: V3): V3 => v.map(n => n / (len(v) || 1)) as V3
const plus = (a: V3, b: V3): V3 => a.map((n, i) => n + b[i]) as V3
const scale = (a: V3, s: number): V3 => a.map(n => n * s) as V3
type XY = [number, number]

// ------------------------------------------------------------------ helpers
// (block, smooth, oval, body, ellipsoid and tube follow independence-square-statues.ts)

function rim(cx: number, cy: number, hx: number, hy: number, b: number): { pts: XY[]; nrm: XY[] } {
  const pts: XY[] = [
    [cx - hx + b, cy - hy], [cx + hx - b, cy - hy], [cx + hx, cy - hy + b], [cx + hx, cy + hy - b],
    [cx + hx - b, cy + hy], [cx - hx + b, cy + hy], [cx - hx, cy + hy - b], [cx - hx, cy - hy + b],
  ]
  const nrm: XY[] = [[0, -1], [0, -1], [1, 0], [1, 0], [0, 1], [0, 1], [-1, 0], [-1, 0]]
  return { pts, nrm }
}

/** A stone block with chamfered vertical and top edges, smooth-shaded. */
function block(p: Part, z0: number, z1: number, hx: number, hy = hx,
  { cx = 0, cy = 0, b = 0.08, top = [hx, hy] as XY } = {}) {
  const tb = Math.min(b, (z1 - z0) * 0.4)
  const lo = rim(cx, cy, hx, hy, b)
  const hi = rim(cx, cy, top[0], top[1], b)
  const lid = rim(cx, cy, top[0] - tb, top[1] - tb, Math.max(0.03, b - tb * 0.4))
  const tilt = (hx - top[0]) / (z1 - z0)
  const sideN = lo.nrm.map(n => unit([n[0], n[1], tilt]))
  const ring = (r: XY[], z: number): V3[] => r.map(([x, y]) => [x, y, z])
  const band = (a: V3[], na: V3[], c: V3[], nc: V3[]) => {
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8
      p.tri(a[i], a[j], c[j], undefined, undefined, undefined, [na[i], na[j], nc[j]])
      p.tri(a[i], c[j], c[i], undefined, undefined, undefined, [na[i], nc[j], nc[i]])
    }
  }
  const A = ring(lo.pts, z0), B = ring(hi.pts, z1 - tb)
  band(A, sideN, B, sideN)
  band(B, sideN, ring(lid.pts, z1), lid.pts.map(() => [0, 0, 1] as V3))
  const C = ring(lid.pts, z1)
  for (let i = 1; i < 7; i++) p.tri(C[0], C[i], C[i + 1])
}

/** Smooth each sculpted piece separately, keeping edges at joins and caps. */
function smooth(target: Part, build: (p: Part) => void, crease = 70) {
  const p = new Part()
  build(p)
  addGltfTriangles(target, new Float32Array(p.pos),
    Uint32Array.from({ length: p.pos.length / 3 }, (_, i) => i), { creaseDegrees: crease })
}

function oval(c: V3, rx: number, ry: number, n = 12): V3[] {
  return Array.from({ length: n }, (_, i) => {
    const a = (i + 0.5) / n * TAU
    return [c[0] + rx * Math.cos(a), c[1] + ry * Math.sin(a), c[2]]
  })
}

/** A closed loft of horizontal rings, rows of [z, rx, ry, cx, cy]. */
function body(p: Part, rows: number[][], n = 12) {
  smooth(p, mesh => {
    const rings = rows.map(([z, rx, ry, cx = 0, cy = 0]) => oval([cx, cy, z], rx, ry, n))
    mesh.loft(rings)
    mesh.cap(rings[0], false)
    mesh.cap(rings[rings.length - 1], true)
  })
}

function ellipsoid(p: Part, c: V3, r: V3, n = 10, rows = 6) {
  smooth(p, mesh => {
    const rings = Array.from({ length: rows + 1 }, (_, j) => {
      const a = -Math.PI / 2 + j / rows * Math.PI
      const k = j === 0 || j === rows ? 0 : Math.cos(a)
      return oval([c[0], c[1], c[2] + r[2] * Math.sin(a)], r[0] * k, r[1] * k, n)
    })
    mesh.loft(rings)
  }, 80)
}

/** A rounded tapered limb along a path; rings square to the path, carried by parallel transport. */
function tube(p: Part, path: V3[], widths: number[], sides = 8) {
  const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
  smooth(p, mesh => {
    let u: V3 | undefined
    const rings = path.map((c, i) => {
      const axis = unit(sub(path[Math.min(i + 1, path.length - 1)], path[Math.max(0, i - 1)]))
      const ref: V3 = u ?? (Math.abs(axis[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1])
      u = unit(sub(ref, scale(axis, dot(ref, axis))))
      const v = cross(axis, u)
      return Array.from({ length: sides }, (_, j) => {
        const a = j / sides * TAU
        return plus(c, plus(scale(u!, widths[i] * Math.cos(a)), scale(v, widths[i] * Math.sin(a))))
      })
    })
    mesh.loft(rings)
    mesh.cap(rings[0], false)
    mesh.cap(rings[rings.length - 1], true)
  })
}

/** A quad wound to face `want`. */
function face(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const n = cross(sub(b, a), sub(c, a))
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}

/** A disc standing upright in the x-z plane: centre (cx, cy, cz), radius r, depth t along y. */
function wheel(p: Part, cx: number, cy: number, cz: number, r: number, t: number, n = 16) {
  const pt = (i: number, y: number): V3 => {
    const a = i / n * TAU
    return [cx + r * Math.cos(a), y, cz + r * Math.sin(a)]
  }
  const y0 = cy - t / 2, y1 = cy + t / 2
  for (let i = 0; i < n; i++) {
    const a = (i + 0.5) / n * TAU
    face(p, pt(i, y0), pt(i + 1, y0), pt(i + 1, y1), pt(i, y1), [Math.cos(a), 0, Math.sin(a)])
    // The flat faces: pt(i) to pt(i+1) turns from +x toward +z, so seen from -y it runs counter-clockwise.
    p.tri([cx, y0, cz], pt(i, y0), pt(i + 1, y0))
    p.tri([cx, y1, cz], pt(i + 1, y1), pt(i, y1))
  }
}

/** Copy a part's triangles into another, moved by (dx, dy) in the map frame. */
function place(src: Part, dst: Part, dx: number, dy: number) {
  // Part stores glTF (x, y, z) = map (x, z, -y).
  for (let i = 0; i < src.pos.length; i += 3) dst.pos.push(src.pos[i] + dx, src.pos[i + 1], src.pos[i + 2] - dy)
  dst.nrm.push(...src.nrm)
  dst.uv.push(...src.uv)
}

// ------------------------------------------------------------------ Father Duffy
// Local frame: the pedestal centred on the origin, the figure facing -y.
const duffyStone = new Part(), duffyBronze = new Part()
{
  const g = duffyStone, b = duffyBronze
  block(g, 0, 0.45, 1.08, 1.02, { b: 0.08 })
  block(g, 0.45, 2.5, 0.76, 0.78, { b: 0.06, top: [0.72, 0.74] })
  // The cross behind the figure: shaft, arms, and the solid ring in the angles.
  const CY = 0.5
  block(g, 2.5, 5.6, 0.55, 0.25, { cy: CY, b: 0.05 })
  block(g, 4.1, 4.9, 1.0, 0.25, { cy: CY, b: 0.05 })
  wheel(g, 0, CY, 4.5, 0.92, 0.36)

  const z0 = 2.65, fy = -0.24
  block(b, 2.5, z0, 0.66, 0.42, { cy: -0.3, b: 0.04 })
  for (const s of [-1, 1]) {
    ellipsoid(b, [s * 0.17, fy - 0.1, z0 + 0.07], [0.09, 0.18, 0.08], 8, 4)
    tube(b, [[s * 0.17, fy, z0 + 0.06], [s * 0.16, fy, z0 + 0.6], [s * 0.14, fy, z0 + 1.0]], [0.1, 0.11, 0.12])
    // Arms down the coat, forearms in to the hands at the waist.
    tube(b, [[s * 0.36, fy + 0.02, z0 + 1.95], [s * 0.4, fy - 0.03, z0 + 1.5], [s * 0.12, fy - 0.24, z0 + 1.3]], [0.11, 0.1, 0.08])
  }
  // The trench coat, flaring to the knee, belted at the waist.
  body(b, [
    [z0 + 0.62, 0.42, 0.3, 0, fy + 0.02],
    [z0 + 0.95, 0.36, 0.25, 0, fy],
    [z0 + 1.3, 0.3, 0.2, 0, fy],
    [z0 + 1.45, 0.29, 0.19, 0, fy],
    [z0 + 1.8, 0.35, 0.22, 0, fy],
    [z0 + 1.98, 0.38, 0.21, 0, fy + 0.02],
    [z0 + 2.07, 0.2, 0.14, 0, fy + 0.02],
    [z0 + 2.12, 0.09, 0.09, 0, fy],
  ])
  ellipsoid(b, [0, fy - 0.02, z0 + 2.29], [0.13, 0.15, 0.18])
  ellipsoid(b, [0, fy - 0.26, z0 + 1.3], [0.17, 0.08, 0.1], 8, 4) // hands and book
  ellipsoid(b, [0.34, fy + 0.05, z0 + 0.04], [0.15, 0.15, 0.09], 8, 4) // the helmet
}

// ------------------------------------------------------------------ George M. Cohan
const cohanStone = new Part(), cohanBronze = new Part()
{
  const g = cohanStone, b = cohanBronze
  block(g, 0, 0.18, 0.85, 0.78, { b: 0.05 })
  block(g, 0.18, 2.05, 0.68, 0.6, { b: 0.06 })
  const z0 = 2.17
  block(b, 2.05, z0, 0.6, 0.48, { b: 0.04 })
  // Legs, the left (east) a little forward.
  for (const [s, fwd] of [[-1, 0.02], [1, -0.14]]) {
    ellipsoid(b, [s * 0.14, fwd - 0.1, z0 + 0.06], [0.07, 0.16, 0.07], 8, 4)
    tube(b, [[s * 0.14, fwd, z0 + 0.06], [s * 0.13, fwd * 0.6, z0 + 0.6], [s * 0.12, 0, z0 + 1.08]], [0.08, 0.095, 0.12])
  }
  body(b, [
    [z0 + 0.92, 0.27, 0.18],
    [z0 + 1.3, 0.25, 0.16],
    [z0 + 1.7, 0.29, 0.18],
    [z0 + 1.9, 0.31, 0.17],
    [z0 + 2.0, 0.18, 0.12],
    [z0 + 2.07, 0.07, 0.07],
  ])
  ellipsoid(b, [0, -0.02, z0 + 2.21], [0.11, 0.13, 0.15])
  // Right arm (west) out to the cane, planted forward and out.
  tube(b, [[-0.3, 0, z0 + 1.88], [-0.4, -0.08, z0 + 1.45], [-0.38, -0.3, z0 + 1.16]], [0.085, 0.08, 0.065])
  tube(b, [[-0.38, -0.32, z0 + 1.14], [-0.47, -0.44, z0 + 0.0]], [0.04, 0.035], 6)
  // Left arm (east) hanging, the hat held by its brim at his side.
  tube(b, [[0.3, 0, z0 + 1.88], [0.36, 0.02, z0 + 1.42], [0.35, 0.0, z0 + 1.0]], [0.085, 0.08, 0.065])
  ellipsoid(b, [0.37, 0.06, z0 + 0.84], [0.05, 0.17, 0.15], 8, 4)
}

// ------------------------------------------------------------------ assemble
// For close review renders, `bun generators/nyc-duffy-square-statues.ts duffy|cohan <out.glb>`
// writes one statue alone, centred.
const only = process.argv[2]
if (only !== undefined && (!['duffy', 'cohan'].includes(only) || !process.argv[3])) {
  console.error('usage: bun generators/nyc-duffy-square-statues.ts [duffy|cohan <out.glb>]')
  process.exit(1)
}
const DUFFY: XY = only === 'duffy' ? [0, 0] : only === 'cohan' ? [1e4, 0] : [-1.7, 16.4]
const COHAN: XY = only === 'cohan' ? [0, 0] : only === 'duffy' ? [1e4, 0] : [2.2, -17.6]
const gDuffy = new Part(), gCohan = new Part(), bronze = new Part()
place(duffyStone, gDuffy, ...DUFFY)
place(duffyBronze, bronze, ...DUFFY)
place(cohanStone, gCohan, ...COHAN)
place(cohanBronze, bronze, ...COHAN)

// Lit by the square at night: the south faces most, the tops least.
const lit = (base: number) => (_p: V3, n: V3) => Math.min(1, base + 0.35 * Math.max(0, -n[1]) - 0.2 * Math.max(0, n[2]))
const all: Array<{ part: Part; material: MaterialSpec }> = [
  { part: bronze, material: { ...finish('statue-bronze', 0x6c5a4a), floodlight: lit(0.5) } },
  { part: gDuffy, material: { ...finish('duffy-granite', 0xa2a2a0), floodlight: lit(0.35) } },
  { part: gCohan, material: { ...finish('cohan-granite', 0xc8c5be), floodlight: lit(0.35) } },
]
// In a single-statue render, drop the other statue's triangles (moved far off above).
if (only) for (const { part } of all) {
  const keep = (i: number) => Math.abs(part.pos[i * 9]) < 1e3
  const f = (arr: number[], w: number) => arr.filter((_, k) => keep(Math.floor(k / w)))
  part.pos = f(part.pos, 9); part.nrm = f(part.nrm, 9); part.uv = f(part.uv, 6)
}
const parts = all.filter(({ part }) => part.triangles > 0)
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
let top = 0
for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) top = Math.max(top, part.pos[i])
const glb = writeGlb('Father Duffy Square statues', parts, {
  license: 'CC0-1.0', bearing: 29, elevation: 0, height: top,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: [],
})
if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = only ? process.argv[3] : new URL('../models/nyc-duffy-square-statues.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${top.toFixed(1)} m`)
