/**
 * Cloud Gate ("The Bean", Anish Kapoor, 2004-06), Millennium Park, Chicago —
 * original procedural geometry, CC0-1.0.
 *
 *   bun generators/chi-cloud-gate.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the centroid of the OSM
 * outline way/137060274 (41.882686, -87.623339), on the plaza. The outline's
 * minimum bounding box runs at 89.4° / 179.4°, so the catalog bearing is
 * 359.4 and the bean's long axis is the model's y axis.
 *
 * Identity: one smooth, seamless mirror-steel bean, longer than it is wide,
 * with the low arch you walk through from the long (east and west) sides and
 * the concave "omphalos" dimple in its underside.
 *
 * Form: a loft of closed sections across the long axis. Each section is a
 * superellipse between a bottom height and a top height, so the side view is
 * the published 20 x 10 m silhouette and the arch is simply the sections near
 * the middle starting higher. The omphalos is a dent pushed up into the
 * bottom of the middle sections. Normals come from the smooth surface, so it
 * shades as one piece of polished steel.
 *
 * Evidence:
 *  - Published (Wikipedia, "Cloud Gate"): 33 x 66 x 42 ft (10 x 20 x 13 m),
 *    arch 12 ft (3.7 m) high, omphalos apex 27 ft (8.2 m) above the ground.
 *  - OSM way/137060274: 19.5 m north-south x 14.8 m east-west, height 10.
 *    The published 13 m width is used; OSM's ring looks traced generously.
 *  - USGS NAIP orthophoto: the bean's long axis runs north-south, about
 *    17 x 13 m of lit top surface.
 *  - Photos (Flickr via Openverse): Giuseppe Milo (CC BY 2.0, flickr
 *    18495946173, from the east, long side); Bert Kaufmann (CC BY 2.0,
 *    4865734246); Ken Lund (CC BY-SA 2.0, 9179488885, 9179492567,
 *    9179495495, 9181706070, from the south-west and south); Rob Young
 *    (CC BY 2.0, 5945905545, end view); miamism (CC BY 2.0, 5610750242);
 *    Artotem (CC BY 2.0, 3823449453). The arch spans about half the length
 *    at the ground, measured off the side views.
 *  - Colour: the steel mirrors the sky and the pale plaza, so it reads as
 *    a bright pale silver; the arch underside mirrors the shaded plaza and
 *    reads darker.
 *
 * Estimated: the plan's squareness and the fullness of the top
 * (superellipse exponents), the height of the widest point (4.6 m), the
 * arch's half-span at the ground (5.0 m, about half the length) and its
 * profile, the ends kept round and full down to their ground contact,
 * the contact patches. The section bottom is set to 3.5 m so that, with the
 * rounding of the lips, the opening seen from the side crowns at the
 * published 3.7 m; the omphalos vault is kept to the inner 60% of the width,
 * so it stays a recess rather than raising the arch. Invented: nothing.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

const STEEL = finish('stainless', 0xdfe5ea, 0.3)
const UNDER = finish('stainless-under', 0xa9b1b8, 0.3)

const L = 10 // half length (y)
const W = 6.5 // half width (x)
const TOP = 10
const ZM = 4.6 // height of the widest point
const END = 4.8 // middle of the rounded ends
const CONTACT = 5.6 // the ground contact runs from the arch's foot to here
const ARCH = 3.5, ARCH_HALF = 5.0
const OMPHALOS = 8.2

const NU = 36 // around each section
const NV = 40 // along the bean

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))
const se = (t: number, p: number) => Math.pow(clamp(1 - Math.pow(Math.abs(t), p)), 1 / p)

/** Section parameters at y. */
function section(y: number) {
  const t = y / L
  const w = W * se(t, 2.7)
  // The ends are round in the side view, their middle at END above the plaza.
  const top = END + (TOP - END) * se(t, 2.5)
  // The bottom: the arch in the middle, ground contact either side of it,
  // then rounding up into the ends.
  const ay = Math.abs(y)
  const round = ay > CONTACT ? END * (1 - Math.sqrt(clamp(1 - ((ay - CONTACT) / (L - CONTACT)) ** 2))) : 0
  const arch = ay < ARCH_HALF ? ARCH * Math.pow(1 - (ay / ARCH_HALF) ** 2, 0.9) : 0
  const bottom = Math.max(round, arch)
  // The omphalos: a dent rising into the middle of the arch.
  const dent = ay < ARCH_HALF ? (OMPHALOS - ARCH) * Math.cos((ay / ARCH_HALF) * Math.PI / 2) ** 2 : 0
  return { w, top, bottom, arch, dent }
}

function point(u: number, y: number): V3 {
  const { w, top, bottom, arch, dent } = section(y)
  const a = (u / NU) * Math.PI * 2
  const c = Math.cos(a), s = Math.sin(a)
  // Over the arch the lower half squares off, so its outer lips come down
  // to the arch height near the sides and the underside between them is
  // the concave vault rising into the omphalos.
  const k = clamp(arch / ARCH)
  const e = s >= 0 ? 2.2 : 2.2 + 1.6 * k
  const x = w * Math.sign(c) * Math.abs(c) ** (2 / e)
  const zm = clamp(ZM + 0.15 * arch, bottom, top)
  const h = s >= 0 ? top - zm : zm - bottom
  let z = zm + h * Math.sign(s) * Math.abs(s) ** (2 / e)
  if (s < 0 && dent > 0) {
    const r = Math.abs(x) / (0.6 * Math.max(w, 1e-6))
    if (r < 1) z += dent * (1 - r * r) ** 1.6
  }
  return [x, y, z]
}

// Rows along y, denser near the ends where the bean rounds off.
const ys = Array.from({ length: NV + 1 }, (_, k) => -L * Math.cos((k / NV) * Math.PI))
const grid: V3[][] = ys.map((y) => Array.from({ length: NU }, (_, u) => point(u, y)))

const norm = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / l, v[1] / l, v[2] / l]
}
const subv = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const crossv = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

// Smooth normals from the grid: along (y) x around the section, outward.
const normals: V3[][] = grid.map((row, k) => row.map((_, u) => {
  if (k === 0) return [0, -1, 0]
  if (k === NV) return [0, 1, 0]
  const du = subv(row[(u + 1) % NU], row[(u - 1 + NU) % NU])
  const dv = subv(grid[k + 1][u], grid[k - 1][u])
  return norm(crossv(dv, du))
}))

const steel = new Part(), under = new Part()
for (let k = 0; k < NV; k++) {
  for (let u = 0; u < NU; u++) {
    const j = (u + 1) % NU
    const quad: [number, number][] = [[k, u], [k + 1, u], [k + 1, j], [k, j]]
    // The arch's underside mirrors the shaded plaza: whole quads under the
    // middle sections, on the lower part of the section.
    const ym = (ys[k] + ys[k + 1]) / 2, am = ((u + 0.5) / NU) * Math.PI * 2
    const target = Math.abs(ym) < ARCH_HALF - 0.4 && Math.sin(am) < -0.75 ? under : steel
    const tris = [[quad[0], quad[1], quad[2]], [quad[0], quad[2], quad[3]]]
    for (const tri of tris) {
      const p = tri.map(([a, b]) => grid[a][b]) as V3[]
      const n = tri.map(([a, b]) => normals[a][b]) as V3[]
      // Degenerate corners at the poles.
      if (Math.hypot(...crossv(subv(p[1], p[0]), subv(p[2], p[0]))) < 1e-9) continue
      target.tri(p[0], p[1], p[2], undefined, undefined, undefined, n)
    }
  }
}

const parts = [{ part: steel, material: STEEL }, { part: under, material: UNDER }]
const tris = parts.reduce((s, p) => s + p.part.triangles, 0)
if (tris > 5000) throw new Error(`over budget: ${tris} triangles`)
const glb = writeGlb('Cloud Gate', parts, {
  title: 'Cloud Gate',
  artist: 'Anish Kapoor',
  license: 'CC0-1.0',
  source: 'generators/chi-cloud-gate.ts',
})
const out = process.argv[2] ?? new URL('../models/chi-cloud-gate.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
