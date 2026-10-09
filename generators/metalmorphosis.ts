/**
 * Metalmorphosis, David Černý's mirrored head at Whitehall Corporate Center,
 * Charlotte — procedural, CC0-1.0.
 *
 *   bun generators/metalmorphosis.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres. The origin is the head's vertical
 * axis on the ground (OSM node 4880354210, amenity=fountain), and the face
 * looks along +y; the catalog's bearing (41°) turns it north-east, away from
 * Whitehall Corporate Center IV, which is how the photos taken from the plaza
 * with the building behind the head see the face.
 *
 * The real sculpture (2007) is about 7.6 m (25 ft) of polished stainless steel
 * in a reflecting pool: a head on a neck, cut into horizontal slabs that
 * motors spin apart and bring back into a face. Frame 0 is the face pose. Each
 * slab is its own glTF node (`slab-01` at the bottom to `slab-40` at the
 * crown), authored about the shared vertical axis through the origin with no
 * node transform, and one 60 s animation turns them (see the bottom).
 *
 * Each slab is a flat prism whose outline is the head's horizontal section at
 * that height (skull, cheeks, the nose, lips and brow standing proud, the eye
 * sockets set back) with its top edge chamfered so every slice shows as a
 * bright line, the way the polished slabs do.
 *
 * Evidence (rework, 2026-10):
 * - Photos: Flickr nan palmero 29980303791, 29980311451, 30063403805,
 *   29980300871 (CC BY 2.0); louisepython 17809476624 (CC BY 2.0). Profile,
 *   three-quarter and front views.
 * - Published: 7.6 m tall, about 13 t, 40-odd layers (Wikipedia, artist).
 * - USGS NAIP (public domain): the pool is round, about 14 m across, centred
 *   on the head within a metre.
 * - Measured from the profile photo (estimated, ±10%): the head is about 1.7
 *   times as deep as the neck, its back overhanging the neck by about 1.2 m,
 *   the chin at 3.0 m above the sculpture's base; the head is 4.7 m wide.
 *   The earlier model had a head barely deeper than its neck; it was widened
 *   and deepened to these proportions.
 * - Estimated from photos: the basin's polished black granite wall stands
 *   0.9 m above the paving, the water at 0.75 m; the sculpture's stepped base
 *   rises from the water. The pool is modelled because it is raised and OSM
 *   maps no water there; its water is a flat cap just under the coping.
 */
import { Part, addGltfTriangles, axisAngle, writeGlb, type ChannelSpec, type NodeSpec, type Quat, type V3 } from './mesh'
import { finish } from './palette'

const STEEL = finish('stainless', 0xcdd5dc, 0.3)
const STEP = finish('stainless-2', 0xb3bdc6, 0.3)
// Slab undersides mirror the pool and the warm paving, so they read darker and
// warmer than the sky-lit sides; that is what draws the brow, nose and lips.
const UNDER = finish('stainless-under', 0xa49c94, 0.3)
// The basin is black polished granite; pulled up to charcoal, the darkest the
// palette allows. The water is a dark slate, lighter than the stone.
const GRANITE = finish('granite-black', 0x55595f, 0.4)
const WATER = finish('pool-water', 0x7d8e98, 0.2)

/** The pool's water level, which the sculpture's own base stands at. */
const LIFT = 0.75
const PLINTH_TOP = 0.7
const TOP = 7.6
const SLABS = 40
const PITCH = (TOP - PLINTH_TOP) / SLABS
const N = 16 // outline points around a slab; 0° is +x (the right ear), 90° the face

type XY = [number, number]

/** Linear interpolation through a table of [z, value] rows. */
function table(rows: number[][], z: number): number {
  if (z <= rows[0][0]) return rows[0][1]
  for (let i = 1; i < rows.length; i++) {
    if (z <= rows[i][0]) {
      const [z0, a] = rows[i - 1], [z1, b] = rows[i]
      return a + (b - a) * (z - z0) / (z1 - z0)
    }
  }
  return rows[rows.length - 1][1]
}

// The head's sections, as [z, value]. yFront is the face (cheek) plane and
// yBack the back of the skull, both from the axis; rx is the half-width.
const yFront = [[0.6, 1.45], [2.85, 1.45], [2.95, 2.35], [3.35, 2.37], [3.45, 1.99], [3.6, 1.99], [3.7, 2.37],
  [3.9, 2.37], [4.0, 2.05], [4.1, 2.4], [4.3, 2.4], [4.4, 1.95], [5.3, 1.95], [5.6, 2.35], [5.85, 2.35], [6.0, 2.05],
  [6.4, 1.9], [6.8, 1.6]]
const yBack = [[0.6, 1.45], [2.9, 1.4], [3.2, 2.15], [3.8, 2.6], [4.6, 2.85], [5.6, 2.9]]
const rx = [[0.6, 1.6], [2.9, 1.55], [3.2, 1.9], [3.8, 2.2], [4.4, 2.32], [5.0, 2.38], [5.6, 2.38]]
/** The cheek plane: the neck's front, then the face's. */
const plane = (z: number) => table([[2.85, 1.45], [3.0, 1.95]], z)

/** The crown: above the eyes every section shrinks like an ellipsoid's. */
const CROWN = 5.6
function dome(z: number) {
  const c = CROWN, h = TOP - c + 0.08
  return z <= c ? 1 : Math.sqrt(Math.max(0, 1 - ((z - c) / h) ** 2))
}

/** Deterministic jitter, so the neck slabs sit a little unevenly, as they do. */
const jitter = (i: number, k: number) => Math.sin(i * 12.9898 + k * 78.233) * 0.5

/** A slab's outline at height z, counter-clockwise from above. */
function outline(z: number, i: number): XY[] {
  const s = dome(z)
  const w = table(rx, z) * s
  // The brow stands out from the dome; above it the face falls back with it.
  // The face plane, and what the brow, lips and chin add to it on the front
  // only, so they read as features rather than as bands round the head.
  const face = plane(z)
  const f = z <= 5.85 ? face : Math.min(face, 2.45 * s)
  const relief = Math.max(0, table(yFront, z) - face)
  const b = table(yBack, z) * s
  const neck = z < 3.0
  const pts: XY[] = []
  for (let k = 0; k < N; k++) {
    const a = (k / N) * Math.PI * 2
    const c = Math.cos(a), sn = Math.sin(a)
    // A slightly squared ellipse: a head is fuller at the cheeks than an oval.
    const e = 2.4
    const ex = Math.sign(c) * Math.abs(c) ** (2 / e), ey = Math.sign(sn) * Math.abs(sn) ** (2 / e)
    let x = w * ex, y = (sn > 0 ? f : b) * ey + (sn > 0 ? relief * sn ** 4 : 0)
    // Eye sockets: the face either side of the nose drops back.
    if (z > 5.0 && z < 5.55 && (k === 3 || k === 5)) y -= 0.45
    if (z > 5.0 && z < 5.55 && (k === 2 || k === 6)) y -= 0.15
    pts.push([x, y])
  }
  // The nose: a narrow block on the face, deepest at its tip.
  const nose = z > 4.35 && z < 5.55 ? table([[4.35, 3.0], [4.6, 2.9], [5.1, 2.5], [5.55, 2.3]], z) : 0
  if (nose) {
    const half = z < 4.7 ? 0.5 : 0.36
    const at = N / 4 // the +y point
    const yf = pts[at][1]
    pts.splice(at, 1, [half + 0.04, yf], [half, nose], [-half, nose], [-half - 0.04, yf])
  }
  {
    // Every slab sits a little off the next, as the real ones do even in the
    // face pose; the neck most, the face least, so the nose and brow line up.
    const k = neck ? 1 : 0.55
    const dx = jitter(i, 1) * 0.08 * k, dy = jitter(i, 2) * 0.06 * k, t = jitter(i, 3) * 0.05 * k
    return pts.map(([x, y]) => [x * Math.cos(t) - y * Math.sin(t) + dx, x * Math.sin(t) + y * Math.cos(t) + dy])
  }
  return pts
}

/**
 * A flat prism over a star-shaped outline, smooth round its sides. Faces
 * pointing down go to `under` when given.
 */
function prism(target: Part, pts: XY[], z0: number, z1: number, under = target) {
  const p = new Part()
  const cx = pts.reduce((s, q) => s + q[0], 0) / pts.length
  const cy = pts.reduce((s, q) => s + q[1], 0) / pts.length
  // Each slab's top edge is chamfered back, steeper than the crease angle, so
  // it catches the sky as a thin bright line: that is how the slices read.
  const BEV = 0.06, RISE = 0.035
  const inset = pts.map(([x, y]): XY => {
    const d = Math.hypot(x - cx, y - cy) || 1, k = Math.max(0, 1 - BEV / d)
    return [cx + (x - cx) * k, cy + (y - cy) * k]
  })
  const lo: V3[] = pts.map(([x, y]) => [x, y, z0 + LIFT])
  const shoulder: V3[] = pts.map(([x, y]) => [x, y, z1 + LIFT - RISE])
  const hi: V3[] = inset.map(([x, y]) => [x, y, z1 + LIFT])
  p.loft([lo, shoulder, hi])
  for (let k = 0; k < pts.length; k++) {
    const j = (k + 1) % pts.length
    p.tri([cx, cy, z1 + LIFT], hi[k], hi[j])
    p.tri([cx, cy, z0 + LIFT], lo[j], lo[k])
  }
  const smooth = new Part()
  addGltfTriangles(smooth, new Float32Array(p.pos),
    Uint32Array.from({ length: p.pos.length / 3 }, (_, i) => i), { creaseDegrees: 50 })
  // Part stores glTF space (y up), so a downward face has normal y near -1.
  for (let t = 0; t < smooth.triangles; t++) {
    const dest = smooth.nrm[t * 9 + 1] < -0.9 ? under : target
    dest.pos.push(...smooth.pos.slice(t * 9, t * 9 + 9))
    dest.nrm.push(...smooth.nrm.slice(t * 9, t * 9 + 9))
    dest.uv.push(...smooth.uv.slice(t * 6, t * 6 + 6))
  }
}

// The stepped plinth: four slabs flaring out under the neck, reaching
// further towards the face than behind, as in the photos.
const plinth = new Part()
const steps = [[2.75, 2.3, 2.45], [2.45, 2.05, 2.2], [2.15, 1.85, 1.95], [1.85, 1.7, 1.75]] // front, back, half-width
steps.forEach(([f, b, w], k) => {
  const z0 = (k * PLINTH_TOP) / steps.length, z1 = ((k + 1) * PLINTH_TOP) / steps.length
  const pts: XY[] = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2
    const c = Math.cos(a), s = Math.sin(a)
    return [w * Math.sign(c) * Math.abs(c) ** 0.8, (s > 0 ? f : b) * Math.sign(s) * Math.abs(s) ** 0.8]
  })
  prism(plinth, pts, k === 0 ? 0 : z0 - 0.01, z1)
})

const nodes: NodeSpec[] = []
for (let i = 0; i < SLABS; i++) {
  const z0 = PLINTH_TOP + i * PITCH, z1 = z0 + PITCH
  const part = new Part(), under = new Part()
  prism(part, outline((z0 + z1) / 2, i), z0, z1, under)
  nodes.push({
    name: `slab-${String(i + 1).padStart(2, '0')}`,
    parts: [{ part, material: STEEL }, { part: under, material: UNDER }],
  })
}

// The pool: a round basin of polished black granite about 0.9 m high and
// 14 m across (NAIP), brim-full, the water standing just under the coping.
// The map has no polygon for it, and it is raised, so it belongs to the model.
const granite = new Part(), water = new Part()
{
  const R = 7.0, T = 0.45, H = 0.9, B = 0.08, SEG = 40
  const ring = (r: number, z: number): V3[] =>
    Array.from({ length: SEG }, (_, k) => { const a = (k / SEG) * Math.PI * 2; return [r * Math.cos(a), r * Math.sin(a), z] })
  // Outer wall, a bevel to the coping, the coping, and the inner lip down to the water.
  const outer = [ring(R, 0), ring(R, H - B), ring(R - B, H), ring(R - T + B, H), ring(R - T, H - B), ring(R - T, LIFT)]
  for (let k = 0; k < outer.length - 1; k++) {
    const smooth = new Part()
    smooth.loft([outer[k], outer[k + 1]])
    // Smooth round the drum: each corner takes the radial normal of its angle.
    for (let t = 0; t < smooth.pos.length / 3; t++) {
      const x = smooth.pos[t * 3], z = smooth.pos[t * 3 + 2]
      const l = Math.hypot(x, z) || 1, inner = k >= 3 ? -1 : 1
      const up = k === 1 || k === 3 ? 0.7 : k === 2 ? 1 : 0
      const h = Math.sqrt(Math.max(0, 1 - up * up))
      granite.pos.push(smooth.pos[t * 3], smooth.pos[t * 3 + 1], smooth.pos[t * 3 + 2])
      granite.nrm.push(inner * h * x / l, up, inner * h * z / l)
      granite.uv.push(0, 0)
    }
  }
  water.cap(ring(R - T, LIFT), true)
}

const parts = [{ part: plinth, material: STEP }, { part: granite, material: GRANITE }, { part: water, material: WATER }]

// The slabs turn. The real motors spin each slab on its own, scattering the
// face and bringing it back; here every slab makes one or two whole turns,
// some each way, and the face holds between runs. 60 s a loop (the real
// show runs at about the same pace but irregularly); keys every 1.5 s keep
// each step well under half a turn, so LINEAR quaternions turn the right way.
const LOOP = 60, KEYS = 40
const times = Array.from({ length: KEYS + 1 }, (_, i) => (i / KEYS) * LOOP)
const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t))
const channels: ChannelSpec[] = nodes.map((_, i) => {
  const turns = [1, -1, 2, -1, 1, -2, 1, -1][i % 8] * (i % 5 === 0 ? -1 : 1)
  // Start a little staggered by height, so the scatter ripples up the head.
  const t0 = 18 + (i / SLABS) * 6, t1 = t0 + 24
  const values: Quat[] = times.map((t) => axisAngle([0, 0, 1], turns * Math.PI * 2 * ease((t - t0) / (t1 - t0))))
  return { node: i, path: 'rotation', values }
})


const tris = [plinth, granite, water, ...nodes.flatMap((n) => n.parts.map((q) => q.part))].reduce((s, p) => s + p.triangles, 0)
if (tris > 5000) throw new Error(`over budget: ${tris} triangles`)
const glb = writeGlb('Metalmorphosis', parts, {
  title: 'Metalmorphosis',
  artist: 'David Černý',
  license: 'CC0-1.0',
  source: 'generators/metalmorphosis.ts',
  note: 'Frame 0 is the face pose; each of the 40 slabs is its own node turning about the vertical axis through the origin.',
}, { nodes, animation: { name: 'turn', times, channels } })
const out = process.argv[2] ?? new URL('../models/metalmorphosis.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes, ${nodes.length} slab nodes`)
