/**
 * Houston Police Officers' Memorial, Buffalo Bayou Park, Houston (1992,
 * Jesús Bautista Moroles). Procedural, CC0-1.0, no textures.
 * bun generators/hou-police-officers-memorial.ts
 *
 * A Greek cross of five 40 ft (12.2 m) squares, 120 ft (37 m) across, in
 * pale granite (Wikipedia, "Houston Police Officer's Memorial"). The centre
 * square is a stepped pyramid rising 12.5 ft (3.8 m) above the lawn, with a
 * pink granite box on top holding the reflecting pool, its rim carved with
 * the officers' names. Each of the four arms is the same pyramid inverted:
 * a square pit stepping down in granite-walled grass terraces.
 *
 * Note: the lead's brief described the centre as the inverted one and the
 * four arms as raised. The photos (p2, p4) and the lidar both show the
 * opposite: the raised pyramid is the centre, the four arms are sunk. The
 * model follows the photos and lidar, as does Wikipedia's description.
 *
 * Frame: x, y in the cross's own axes (turned to bearing 67.6, the OSM
 * outline's edge direction), z up, metres; written as glTF +Y up. The anchor
 * is the area centroid of OSM way/49048383 (historic=memorial, not a
 * building), -95.3830605 29.7628379.
 *
 * Ground: y = 0 is the lawn round the memorial, which the raised pyramid
 * and the pits' rims stand on. The pits themselves (2.2 m deep in the lidar)
 * are ground, and the map's terrain (Mapterhorn) already dips about 2 m in
 * each: the model does not draw the pits' grass terraces or their walls
 * below the lawn. It draws only the granite that reads above the lawn: the
 * pyramid, and the pits' coping rings. The copings are split into short
 * segments so the map's drape lets the inner rings follow the terrain down
 * into the pits, where they stand in for the stepped walls. Elevation 0.
 *
 * Measured, USGS 3DEP lidar TX_Coastal_B1_2018 (2018 flight), 0.5 m grid
 * read in this frame (tools/lidar_frame.py): lawn 2.3-2.4 m above the box's
 * ground_min; the pyramid's tiers at 3.2, 4.0, 4.7, 5.5 and 6.2 m, so 0.8,
 * 1.6, 2.3, 3.1 and 3.8 m above the lawn (the top matches the published
 * 12.5 ft); tier half-widths 6.2, 5.0, 3.6, 2.3, the top box 1.25 (p2);
 * each pit's terraces at 0.7, 1.5 and 2.2 m below the lawn, its rim about
 * 9 m across inside the 12.5 m arm, centred 12.5 m out.
 * Published: 120 ft overall, 40 ft squares, 12.5 ft height and depth
 * (Wikipedia; the lidar finds the pits 2.2 m deep, not 3.8).
 * Estimated from the photos: tier heights equal (p4: each about 0.4 of a
 * standing officer's height, 0.77 m); the pool box's rim 0.65 m wide (p1,
 * p5); the pits' copings 0.35 m proud of the lawn at the rim (p2), 0.2 m on
 * the inner rings.
 *
 * Photos (Wikimedia Commons), compared against the renders:
 * - p2 "Houston Police Department memorial.jpg", Scott Ehardt, public
 *   domain: the pyramid from the north-west with downtown behind, its
 *   tiers and stairs, the arms' copings level with the lawn;
 * - p3 "Police memorial, Houston, Texas LCCN2011633317.tif" and p4 "Police
 *   Memorial, Houston, Texas LCCN2011630462.tif", Carol M. Highsmith, public
 *   domain: the pyramid face on, an arm's terraces in front; tier heights
 *   against the officers standing on them;
 * - p1, p5 "Houston Police Officer's Memorial2.jpg" and "...Memorial1.jpg",
 *   meltedplastic, CC BY 2.0: the pink granite pool box on the top;
 * - p6 "Point - Flickr - AlphaTangoBravo - Adam Baker.jpg", Adam Baker, CC
 *   BY 2.0 (looked at for the granite's colour).
 * Colours sampled from p2, p3 and p4 in sun: the granite a light warm grey
 * (#c1bcc4 to #c4beb9 in p3/p4), lifted to the palette's lightness; the pool
 * box a pinker granite (p1, p5).
 *
 * Left out: the stairs that cut through each tier on every face (about
 * 2.5 m wide, in a pinwheel pattern in p2: too fine to read at 200 px), the
 * names, the water (a dark slab inside the box stands for the pool), the
 * grass terraces inside the pits (the map's terrain).
 *
 * Terrain: Mapterhorn counts the pyramid as ground (a 3 m hump) and shows
 * each pit as a 2 m dip. The map fills the hump from the lawn round it
 * inside the model's footprint (never above the real ground, so the pits
 * stay), and the pyramid is built to its real height from the lidar and
 * the published 12.5 ft; tools/terrain.ts check passes.
 * Doubts: the pit depth and its terraces are the terrain's, at 2 m/px; the
 * stairs are left out.
 * Night: the memorial is not floodlit in any photo found; nothing glows.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

const BEARING = 67.6
const TIER = [6.2, 5.0, 3.6, 2.3] // half-widths, lidar
const STEP = 0.77 // tier height; 5 x 0.77 = 3.85 m (published 12.5 ft)
const BOX = 1.25 // pool box half-width (p2, face on: 0.19 of the base)
const POOL = 0.65 // pool half-width inside the rim (p1, p5)
const TOP = STEP * 5
const ARM = 12.4 // arm centre from the memorial's centre (OSM squares 12.4-12.5 m)
const RIMS: [number, number, number][] = [
  // [half-width to the coping's outer edge, width, height] from the lidar's terrace edges
  [4.7, 0.6, 0.35],
  [3.6, 0.45, 0.2],
  [2.6, 0.45, 0.2],
]

const granite = new Part(), pink = new Part(), pool = new Part()

/** Points along a→b, no further than `max` apart. */
function split(a: number, b: number, max: number): number[] {
  const n = Math.max(1, Math.ceil(Math.abs(b - a) / max))
  return Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n)
}

/** A flat top split into cells no larger than 2 m, so the map's drape can bend it. */
function top(p: Part, x0: number, x1: number, y0: number, y1: number, z: number, hole?: [number, number, number, number]) {
  const xs = split(x0, x1, 2), ys = split(y0, y1, 2)
  for (let i = 0; i < xs.length - 1; i++)
    for (let j = 0; j < ys.length - 1; j++) {
      const cx = (xs[i] + xs[i + 1]) / 2, cy = (ys[j] + ys[j + 1]) / 2
      if (hole && cx > hole[0] && cx < hole[1] && cy > hole[2] && cy < hole[3]) continue
      p.quad([xs[i], ys[j], z], [xs[i + 1], ys[j], z], [xs[i + 1], ys[j + 1], z], [xs[i], ys[j + 1], z])
    }
}

/** A vertical wall along a→b (counter-clockwise round its solid, seen from above), split every 2 m. */
function wall(p: Part, a: [number, number], b: [number, number], z0: number, z1: number) {
  const ts = split(0, 1, Math.hypot(b[0] - a[0], b[1] - a[1]) / 2 > 1 ? 2 / Math.hypot(b[0] - a[0], b[1] - a[1]) : 1)
  for (let i = 0; i < ts.length - 1; i++) {
    const P = (t: number, z: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, z]
    p.quad(P(ts[i], z0), P(ts[i + 1], z0), P(ts[i + 1], z1), P(ts[i], z1))
  }
}

/**
 * A square block centred on (cx, cy) from z0 to z1, with a small chamfer
 * round its top edge so the step catches a highlight.
 */
function block(p: Part, cx: number, cy: number, h: number, z0: number, z1: number, inner: number, c = 0.12) {
  const ring = (k: number): [number, number][] => [[cx - k, cy - k], [cx + k, cy - k], [cx + k, cy + k], [cx - k, cy + k]]
  const o = ring(h), i = ring(h - c)
  for (let s = 0; s < 4; s++) {
    const t = (s + 1) % 4
    wall(p, o[s], o[t], z0, z1 - c)
    p.quad([o[s][0], o[s][1], z1 - c], [o[t][0], o[t][1], z1 - c], [i[t][0], i[t][1], z1], [i[s][0], i[s][1], z1])
  }
  // Only the ledge shows: the next tier up covers the rest.
  const e = h - c
  top(p, cx - e, cx + e, cy - e, cy - inner, z1)
  top(p, cx - e, cx + e, cy + inner, cy + e, z1)
  top(p, cx - e, cx - inner, cy - inner, cy + inner, z1)
  top(p, cx + inner, cx + e, cy - inner, cy + inner, z1)
}

/** A square ring (a coping) centred on (cx, cy): outer half-width h, width w, from z0 to z1. */
function ring(p: Part, cx: number, cy: number, h: number, w: number, z0: number, z1: number) {
  const sq = (k: number): [number, number][] => [[cx - k, cy - k], [cx + k, cy - k], [cx + k, cy + k], [cx - k, cy + k]]
  const o = sq(h), i = sq(h - w)
  for (let s = 0; s < 4; s++) {
    const t = (s + 1) % 4
    wall(p, o[s], o[t], z0, z1)
    wall(p, i[t], i[s], z0, z1) // the inner face looks into the ring
  }
  // The top, in four strips, each split for the drape.
  top(p, cx - h, cx + h, cy - h, cy - h + w, z1)
  top(p, cx - h, cx + h, cy + h - w, cy + h, z1)
  top(p, cx - h, cx - h + w, cy - h + w, cy + h - w, z1)
  top(p, cx + h - w, cx + h, cy - h + w, cy + h - w, z1)
}

// --- The pyramid: four granite tiers and the pink pool box -------------------
TIER.forEach((h, k) => block(granite, 0, 0, h, k * STEP, (k + 1) * STEP, TIER[k + 1] ?? BOX))
{
  const z0 = 4 * STEP, z1 = TOP
  const o: [number, number][] = [[-BOX, -BOX], [BOX, -BOX], [BOX, BOX], [-BOX, BOX]]
  const i: [number, number][] = [[-POOL, -POOL], [POOL, -POOL], [POOL, POOL], [-POOL, POOL]]
  for (let s = 0; s < 4; s++) {
    const t = (s + 1) % 4
    wall(granite, o[s], o[t], z0, z1)
    wall(pink, i[t], i[s], z1 - 0.3, z1) // the pool's inner lip
  }
  top(pink, -BOX, BOX, -BOX, BOX, z1, [-POOL, POOL, -POOL, POOL])
  // The water, 0.3 m down inside the rim.
  pool.quad([-POOL, -POOL, z1 - 0.3], [POOL, -POOL, z1 - 0.3], [POOL, POOL, z1 - 0.3], [-POOL, POOL, z1 - 0.3])
}

// --- The four arms: coping rings round each sunk pit ---------------------------
for (const [ax, ay] of [[ARM, 0], [-ARM, 0], [0, ARM], [0, -ARM]] as [number, number][])
  for (const [h, w, z] of RIMS) ring(granite, ax, ay, h, w, 0, z)

const parts = [
  { part: granite, material: finish('hpm-granite', 0xcdc7c4) },
  { part: pink, material: finish('hpm-pink-granite', 0xd2b9ad) },
  { part: pool, material: finish('hpm-pool', 0x5b6f7c, 0.3) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb("Houston Police Officers' Memorial", parts, {
  license: 'CC0-1.0', bearing: BEARING, anchor: [29.7628379, -95.3830605], height: TOP,
  frame: 'Y up, -Z along bearing 67.6, metres; origin on the lawn at the anchor',
  replaces: [],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/hou-police-officers-memorial.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
