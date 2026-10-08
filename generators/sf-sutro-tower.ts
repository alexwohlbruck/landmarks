/**
 * Sutro Tower, San Francisco — original procedural geometry, CC0-1.0.
 * bun generators/sf-sutro-tower.ts
 *
 * Map frame: x east, y north, z up, metres, no rotation (bearing 0): one leg
 * points due west, the other two to 60° either side of east, as OSM maps
 * them. Origin = the tower's centre (the centroid of the three leg feet), on
 * the lowest ground under the legs (254.6 m NAVD88).
 *
 * What makes it Sutro Tower: three legs that lean in from a wide base to a
 * waist two thirds of the way up and splay out again to the top; broad
 * International Orange and white bands; two box crossbars and a white
 * platform tying the legs; the wide top crossarm, a triangle of trusses
 * whose sides run on past the legs; and the "trident" of three masts.
 *
 * Evidence
 * - OSM relation/3829019 (multipolygon, outer way/581120610, inner
 *   way/1350841006; height 298) and its building:parts, the legs mapped in
 *   26 m sections (way/1350828175-183, 1350848292-296, 1350853005-014,
 *   1350855462-464) and the masts (way/1334229829, 1350860498, 1350860499):
 *   leg centres at r 26.1 m (0-26 m), narrowing by 2.65 m every 26 m to
 *   r 10.5 at 156-182 m, then r 14.1 (182-208) and 17.5 (208-232); legs
 *   3.8-4.2 m across; the masts on the leg tops from 232.25 to 298 m.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023, 0.5 m): ground under the
 *   legs 254.6-254.8 m; the lower crossbar's top at 59 m reaching r 26.4
 *   along the legs (leg centres ~24.6), the upper one's top at 119 m (r 19.2,
 *   centres ~17.8), the white platform at 168 m inside legs at r ~12 (its
 *   extent along two legs 15.0 and 11.9 m; leg centres taken as 12.3). The
 *   vertical legs return almost nothing and returns stop at 200 m, so the
 *   taper between those levels and above the waist is OSM's.
 * - Published (Wikipedia; sutrotower.com): 297.8 m (977 ft) tall, top
 *   platform 232 m above ground, completed 1973, Kline Towers.
 * - Heights read off the photos (scaled between the lidar's platform at
 *   168 m and lower crossbar at 59 m, or the published 297.8 m tip): the
 *   crossarm's deck at 211-215 m and its top chords at 222-230 m, the masts
 *   from there to the tip (68 m). OSM's 232.25 m for the masts' foot is
 *   kept only as the crossarm's upper limit.
 * - Commons daylight photos: "Sutro Tower from Grandview.jpg" (Justin Beck,
 *   CC BY 2.0; the whole tower side on: banding, both crossbars, the white
 *   platform, the crossarm 75 m across, the masts); "Sutro Tower 2020
 *   01/03/05/07.jpg" (Christopher Michel, CC BY-SA 4.0; the crossarm's
 *   triangle from below, the leg bands); "Sutro Tower in 2012.jpg"
 *   (Choinowski, CC0); "Sutro-tower-20180503.jpg" (Matt Parlmer, CC BY-SA
 *   4.0); "Sutro Tower 1 2017-06-12.jpg" (FASTILY, CC BY-SA 4.0).
 *
 * Estimated: the bands (read off the Grandview photo against the crossbars:
 *   orange 0-18, 52-59, 80-100, 112-140 and 178 m to the top), the
 *   crossbars' depth (7 m) and the crossarm's (5 m deep, its sides running
 *   13 m past each leg), the masts' banding and taper, the X-bracing drawn as one bold
 *   brace each way in each face of each panel (the real lattice and guy
 *   cables are too fine for the map), the concrete feet.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

const ANCHOR = { lng: -122.4528532, lat: 37.7552409 }
const REPLACES = ['relation/3829019', 'way/581120610', 'way/1350841006',
  ...[1350828175, 1350828176, 1350828177, 1350828178, 1350828179, 1350828180, 1350828181, 1350828182, 1350828183,
    1350848292, 1350848293, 1350848294, 1350848295, 1350848296, 1350853005, 1350853006, 1350853007, 1350853008,
    1350853009, 1350853010, 1350853011, 1350853012, 1350853013, 1350853014, 1350855462, 1350855463, 1350855464,
    1334229829, 1350860498, 1350860499].map((w) => `way/${w}`)]

const orange = new Part(), white = new Part(), concrete = new Part()
type Band = Part
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }

/** A round tube from a to b, radii r0 to r1, smooth, uncapped unless asked. */
function tube(part: Part, a: V3, b: V3, r0: number, r1: number, seg = 8, capTop = false) {
  const ax = unit(sub(b, a))
  const ref: V3 = Math.abs(ax[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const u = unit(crs(ax, ref)), v = crs(ax, u)
  const ring = (c: V3, r: number, t: number): V3 => add(c, add(mul(u, r * Math.cos(t)), mul(v, r * Math.sin(t))))
  const nrm = (t: number): V3 => add(mul(u, Math.cos(t)), mul(v, Math.sin(t)))
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * 2 * Math.PI, t1 = ((i + 1) / seg) * 2 * Math.PI
    part.tri(ring(a, r0, t0), ring(a, r0, t1), ring(b, r1, t1), undefined, undefined, undefined, [nrm(t0), nrm(t1), nrm(t1)])
    part.tri(ring(a, r0, t0), ring(b, r1, t1), ring(b, r1, t0), undefined, undefined, undefined, [nrm(t0), nrm(t1), nrm(t0)])
    if (capTop) part.tri(ring(b, r1, t0), ring(b, r1, t1), b)
  }
}
/** A horizontal box girder from a to b (plan direction), w wide, from z0 to z1, flat-shaded, closed. */
function girder(part: Part, a: [number, number], b: [number, number], w: number, z0: number, z1: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [t[1], -t[0]]
  const P = (s: number, d: number, z: number): V3 => [a[0] + t[0] * s + n[0] * d, a[1] + t[1] * s + n[1] * d, z]
  const h = w / 2
  part.quad(P(0, h, z0), P(L, h, z0), P(L, h, z1), P(0, h, z1))
  part.quad(P(L, -h, z0), P(0, -h, z0), P(0, -h, z1), P(L, -h, z1))
  part.quad(P(0, -h, z1), P(0, h, z1), P(L, h, z1), P(L, -h, z1))
  part.quad(P(0, h, z0), P(0, -h, z0), P(L, -h, z0), P(L, h, z0))
  part.quad(P(0, -h, z0), P(0, h, z0), P(0, h, z1), P(0, -h, z1))
  part.quad(P(L, h, z0), P(L, -h, z0), P(L, -h, z1), P(L, h, z1))
}

// ---- Legs -------------------------------------------------------------------
const LEG_ANG = [180, -60, 60].map((d) => (d * Math.PI) / 180)
const R0 = 27.4, WAIST = 170, RW = 12.3, TOP = 230, RT = 18.6
// Leg centre radius: OSM's feet, the lidar's crossbar and platform extents,
// OSM's leg sections above the waist.
const LEG_R: [number, number][] = [[0, R0], [55, 24.6], [115, 17.8], [WAIST, RW], [TOP, RT]]
const legR = (z: number) => {
  for (let i = 0; i < LEG_R.length - 1; i++) {
    const [z0, r0] = LEG_R[i], [z1, r1] = LEG_R[i + 1]
    if (z <= z1) return r0 + ((r1 - r0) * (z - z0)) / (z1 - z0)
  }
  return RT
}
const legAt = (k: number, z: number): V3 => [legR(z) * Math.cos(LEG_ANG[k]), legR(z) * Math.sin(LEG_ANG[k]), z]
const legRad = (z: number) => 2.1 - (0.35 * z) / TOP
// The bands as the side-on photos show them, keyed to the crossbars: orange
// at the foot, round each crossbar, and from above the platform to the top.
const BANDS: [number, number][] = [[0, 18], [52, 59], [80, 100], [112, 140], [178, 231]]
const bandOf = (z: number): Band => (BANDS.some(([a, b]) => z >= a && z < b) ? orange : white)
for (let k = 0; k < 3; k++) {
  const cuts = new Set<number>([0, 55, 115, WAIST, TOP])
  for (const [a, b] of BANDS) { if (a > 0) cuts.add(a); if (b < TOP) cuts.add(b) }
  const zs = [...cuts].sort((a, b) => a - b)
  for (let i = 0; i < zs.length - 1; i++) {
    const z0 = zs[i], z1 = zs[i + 1]
    tube(bandOf((z0 + z1) / 2), legAt(k, z0), legAt(k, z1), legRad(z0), legRad(z1), 10)
  }
  // concrete foot
  const f = legAt(k, 0)
  tube(concrete, [f[0], f[1], -0.5], [f[0], f[1], 2.2], 3.4, 3.0, 8, true)
}

// ---- Crossbars, platform, bracing --------------------------------------------
const xy = (p: V3): [number, number] => [p[0], p[1]]
/** A closed triangle of girders between the legs at height z0..z1. */
function ring(part: Part, z0: number, z1: number, w: number) {
  const zc = (z0 + z1) / 2
  for (let k = 0; k < 3; k++) {
    const a = legAt(k, zc), b = legAt((k + 1) % 3, zc)
    girder(part, xy(a), xy(b), w, z0, z1)
  }
}
ring(orange, 52, 59, 3.2) // lower crossbar (lidar top 59)
ring(orange, 112, 119, 3.2) // upper crossbar (lidar top 119)
ring(white, 165.5, 169, 2.2) // the white platform at the waist (lidar 168)
// X-bracing in each face of the three panels below the platform.
for (const [z0, z1] of [[2.5, 52], [59, 112], [119, 165.5]]) {
  for (let k = 0; k < 3; k++) {
    const l = (k + 1) % 3
    tube(white, legAt(k, z0), legAt(l, z1), 0.38, 0.38, 4)
    tube(white, legAt(l, z0), legAt(k, z1), 0.38, 0.38, 4)
  }
}

// ---- Top crossarm: a triangle of trusses whose sides run on past the legs ----
const CA0 = 225, CA1 = 230, EXT = 13
for (let k = 0; k < 3; k++) {
  const a = xy(legAt(k, TOP)), b = xy(legAt((k + 1) % 3, TOP))
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const a2: [number, number] = [a[0] - t[0] * EXT, a[1] - t[1] * EXT], b2: [number, number] = [b[0] + t[0] * EXT, b[1] + t[1] * EXT]
  // offset each side outward a little so the three cross cleanly at the legs
  const n = [t[1], -t[0]]
  const o = 0.0
  girder(orange, [a2[0] + n[0] * o, a2[1] + n[1] * o], [b2[0] + n[0] * o, b2[1] + n[1] * o], 2.4, CA0, CA1)
  // short antenna posts standing on the arm ends
  for (const e of [a2, b2]) tube(white, [e[0], e[1], CA1], [e[0], e[1], CA1 + 9], 0.5, 0.35, 6, true)
}
// a second, lower level of the crossarm: the deck between the leg tops
ring(orange, 212, 214.5, 1.6)

// ---- The three masts ---------------------------------------------------------
const MAST_TOP = 297.8
const mastBands: [number, number, Part][] = [[CA1, 246, orange], [246, 262, white], [262, 271, orange], [271, 286, white], [286, MAST_TOP - 5, orange]]
for (let k = 0; k < 3; k++) {
  const p = legAt(k, TOP)
  const r = (z: number) => 1.15 - (0.75 * (z - CA1)) / (MAST_TOP - CA1)
  for (const [z0, z1, part] of mastBands) tube(part, [p[0], p[1], z0], [p[0], p[1], z1], r(z0), r(z1), 6)
  tube(white, [p[0], p[1], MAST_TOP - 5], [p[0], p[1], MAST_TOP], r(MAST_TOP - 5), 0.12, 6, true)
}

// ---- Write -----------------------------------------------------------------
// International Orange (OSM colour #bf4e3b, photos #c25a45 in sun) pulled to the
// palette's lightness; the white bands a warm off-white; the feet concrete.
const parts = [
  { part: orange, material: finish('international-orange', 0xcc6650) },
  { part: white, material: finish('tower-white', 0xeeeae2) },
  { part: concrete, material: finish('concrete', 0xc9c6bf) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
for (const { part, material } of parts) console.log(`  ${material.name}: ${part.triangles}`)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Sutro Tower', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: MAST_TOP,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: REPLACES,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-sutro-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
