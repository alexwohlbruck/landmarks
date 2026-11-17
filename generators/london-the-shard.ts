/**
 * The Shard (Shard London Bridge), 32 London Bridge Street, London: original
 * procedural geometry, CC0-1.0.
 * bun generators/london-the-shard.ts
 *
 * Map frame, north up (BEARING 0): +x east, +y north, z up, metres. Origin =
 * the area centroid of the OSM outline way/31110737 (the outline includes the
 * two low glass wings on the east and south-east), on the ground.
 *
 * What makes it the Shard, and how each is drawn
 * - Eight sloping glass facets ("shards") on an irregular plan, each leaning in
 *   towards an apex north-west of the outline's centre. Each facet is its own
 *   surface; at every one of the eight corners the facets do not meet: one facet
 *   runs on to the corner as a fin and the next starts behind it, leaving a real
 *   recessed slot (the fissures), drawn in a darker glass that stays dark at
 *   night, so the facets still read when the curtain wall glows.
 * - The crown: above the full-width floors (Z_BODY) each facet carries on in
 *   its own plane and on the same taper, in the same opaque glass with no
 *   break, as a separate 0.9 m glass blade (edges in the same glass, ending at
 *   its own tip). Narrow slots (the fissures, carried on up a notched glass
 *   core) part the blades, and each blade closes to a point at its own height
 *   over its last 30 m. Above 260 m the plan closes faster (the photos' narrow tip), and a
 *   narrow grey steel lattice round a mast fills the top ~40 m, glimpsed
 *   between the converging tips. Blades and lattice carry _FLOODLIGHT rising
 *   to 1 above 266 m, as the real crown is lit at night.
 * - Pale, sky-reflecting glass: a light window variant, not a dark slab.
 * - The two low glass wings on the east (74 m, roof garden) and south-east
 *   (70 m), which OSM maps inside the outline.
 *
 * Evidence
 * - OSM (ODbL): outline way/31110737 (building=commercial, height 310, 95
 *   levels, wikidata Q18536); tower part way/226737912 (pyramidal, 310); eight
 *   skillion facet parts way/666124825..832 with their heights (NE 310, N 252,
 *   NW 310, W 260, SW 235, S 310, SE 254, E 290); core part way/666126950 (72
 *   levels, 252); wings way/665171689 (east, 18 levels, 74 m, grass roof) and
 *   way/665171690 (south-east, 17 levels, 70 m, metal roof). The eight base
 *   corners are the outline's corners, the notches in it taken at their middle.
 * - Published: 309.6 m to the tip, 95 storeys, highest occupied floor (level 72
 *   viewing gallery) 244 m (CTBUH Skyscraper Center; Wikipedia "The Shard").
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0 (2000s-2022 mix). The glass faces return almost nothing (and part of
 *   the composite is from the construction years: a flat 88 m return over the
 *   west side is a construction-era deck), so it gives only: the crown's
 *   highest returns at 280-296 m above the street, centred about 6 m west and
 *   5 m north of the anchor (taken as the apex the facets lean to); the east
 *   wing roof at 73-74 m and the south-east wing roof at 69-70 m (both match
 *   OSM); the street at about 3.7 m AOD all round.
 * - Photos (all CC BY-SA unless noted), opened and compared:
 *   "The Shard from the Sky Garden 2015.jpg", Colin, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:The_Shard_from_the_Sky_Garden_2015.jpg
 *     (from the NNE, 155 m up: taper, facet stops, open blades);
 *   "The Shard London June 2016.jpg", King of Hearts, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:The_Shard_London_June_2016.jpg
 *     (level, from the north across the river: taper, fissures, crown points,
 *     east wing roof garden);
 *   "The Shard from Southwark Bridge, 2017-05-27.jpg", Lewis Hulbert, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:The_Shard_from_Southwark_Bridge,_2017-05-27.jpg
 *     (level, from the WNW: taper check);
 *   "Ayuntamiento y Shard, Londres, Inglaterra, 2014-08-11, DD 076.JPG", Diego
 *     Delso, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Ayuntamiento_y_Shard,_Londres,_Inglaterra,_2014-08-11,_DD_076.JPG
 *     (from the ENE: glass colour, facet step);
 *   "The Shard from Leathermarket Gardens.jpg", Ethan Doyle White, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:The_Shard_from_Leathermarket_Gardens.jpg
 *     (from the SSE: fissure down the south-east face);
 *   "The Shard From Borough High Street.jpg", Numinosity by Gary J Wood, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:The_Shard_From_Borough_High_Street.jpg
 *     (from the WSW: west fissure with the frame inside it);
 *   "Looking up at The View From The Shard, Level 72.jpg", Colin, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Looking_up_at_The_View_From_The_Shard,_Level_72.jpg
 *     (the spire's white steel frame inside the glass);
 *   "The Shard Spire.jpg", Donnchadh H, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:The_Shard_Spire.jpg
 *     (night: the blades and frame lit white, separate pointed tips).
 *
 * Numbers
 * - Measured from the photos: the taper. In the Sky Garden photo (camera about
 *   155 m up, 784 m away; the horizon falls where that predicts) the tower's
 *   edges against the sky give widths of 43.8 m at 144 m, 39.1 at 172, 33.4 at
 *   200, 30.4 at 214, 24.8 at 243 and 18.5 at 271, against about 59 m at the
 *   base: shrink(z) = 1 - 0.00112 z - 5.2e-6 z^2 fits them within 2 m. The
 *   June 2016 photo, from the north and level, checks it from another side:
 *   its edge widths fit the model's within 2-7 px of 270 at one scale (5.6
 *   px/m, which puts the News Building's top at 75 m, as it is).
 * - Published: tip 309.6 m. OSM: facet stops, wing heights (lidar agrees).
 * - Estimated: Z_BODY 228 m (top of the full-width floors; the open frame shows in the Sky Garden and
 *   June 2016 photos); the three tallest points 309.6 (NW), 306 (S) and 304
 *   (NE) m (OSM tags all three 310; the night photo shows the middle one
 *   highest); fissure slot 2.6 m wide and 1.8 m deep, about twice the real
 *   joint, so it reads from map distance; blade thickness 0.9 m; lattice
 *   member 0.7 m; the wings' trim bands.
 * - Doubts: the facet stops are OSM's (a mapper's reading), checked only
 *   roughly against the photos; the exact plan of each fissure (which facet
 *   overlaps which) is simplified to the same arrangement at every corner; the
 *   map's terrain has a 5-6 m pit under the south-west of the footprint (the
 *   construction dig in the composite DTM), so y = 0 may land up to ~6 m below
 *   the street on most sides; terrain.ts check prints ok. The night look glows
 *   the whole curtain wall (the house rule for office glass); the real tower is
 *   darker at night, with the crown the brightest part.
 * - Anchor: the outline's area centroid, 4.7 m east-north-east of the point in
 *   the batch plan (51.50437, -0.08647).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const BEARING = 0
const ANCHOR = { lng: -0.086438, lat: 51.504408 }

const TIP = 309.6
const Z_BODY = 228
const NOTCH_W = 2.6
const NOTCH_D = 1.8
const BLADE_T = 0.9

// Base corners, anticlockwise from above, metres from the anchor. Facet k runs
// from corner k to corner k + 1.
const CORNERS: [number, number][] = [
  [27.9, 15.34], // E | NE
  [12.2, 31.29], // NE | N
  [-6.9, 42.94], // N | NW
  [-29.75, 20.94], // NW | W
  [-39.25, -3.26], // W | SW
  [-21.3, -16.06], // SW | S
  [-1.0, -29.56], // S | SE
  [16.7, -17.96], // SE | E
]
// Facet tops: NE, N, NW, W, SW, S, SE, E.
const TOPS = [304, 252, TIP, 260, 235, 306, 254, 290]
const APEX: [number, number] = [-5.7, 5.3]

// Plan width relative to the base, fitted to the Sky Garden photo (see Numbers).
const shrink = (z: number) => (1 - 0.00112 * z - 5.2e-6 * z * z) * (z > 260 ? 1 - 0.35 * ((z - 260) / 50) ** 2 : 1)

const corner = (k: number, z: number, f = 1): V3 => {
  const c = CORNERS[((k % 8) + 8) % 8], s = shrink(z) * f
  return [APEX[0] + (c[0] - APEX[0]) * s, APEX[1] + (c[1] - APEX[1]) * s, z]
}
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]
const subv = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const crossv = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]

/** Facet k's plan direction (unit, horizontal) and inward normal at height z. */
function facetAxes(k: number, z: number) {
  const a = corner(k, z), b = corner(k + 1, z)
  const dir = unit([b[0] - a[0], b[1] - a[1], 0])
  const inward: V3 = [-dir[1], dir[0], 0]
  return { dir, inward }
}
/** The outward surface normal of facet k at height z (it leans in). */
function facetNormal(k: number, z: number): V3 {
  const { dir, inward } = facetAxes(k, z)
  const dz = 2
  const m0 = lerp3(corner(k, z - dz), corner(k + 1, z - dz), 0.5), m1 = lerp3(corner(k, z + dz), corner(k + 1, z + dz), 0.5)
  let n = unit(crossv(dir, subv(m1, m0)))
  if (n[0] * inward[0] + n[1] * inward[1] > 0) n = [-n[0], -n[1], -n[2]]
  return n
}

const facade = new Part(), fissure = new Part(), steel = new Part(), roof = new Part(), garden = new Part()

function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, na?: V3, nb?: V3, nc?: V3, nd?: V3) {
  if (!na) return p.quad(a, b, c, d)
  p.tri(a, b, c, undefined, undefined, undefined, [na, nb!, nc!])
  p.tri(a, c, d, undefined, undefined, undefined, [na, nc!, nd!])
}

/** The ring at height z: per corner, the notch (corner, in, in + along, along). */
function notchRing(z: number, gap = NOTCH_W, inset = 0) {
  const out: { pts: V3[] }[] = []
  for (let k = 0; k < 8; k++) {
    const c0 = corner(k, z), { dir, inward } = facetAxes(k, z)
    const toApex = unit([APEX[0] - c0[0], APEX[1] - c0[1], 0]), c = add(c0, toApex, inset)
    out.push({ pts: [c, add(c, inward, NOTCH_D), add(add(c, inward, NOTCH_D), dir, gap), add(c, dir, gap)] })
  }
  return out
}

// --- Body: z = 0 to Z_BODY, facets smooth-shaded up their height, notches flat. ---
const levels: number[] = []
for (let z = 0; z < Z_BODY; z += 12) levels.push(z)
levels.push(Z_BODY)
for (let i = 0; i + 1 < levels.length; i++) {
  const z0 = levels[i], z1 = levels[i + 1]
  const r0 = notchRing(z0), r1 = notchRing(z1)
  for (let k = 0; k < 8; k++) {
    const a0 = r0[k].pts, a1 = r1[k].pts
    // notch: corner -> in -> in+along -> along
    for (let j = 0; j < 3; j++) fissure.quad(a0[j], a0[j + 1], a1[j + 1], a1[j])
    // facet k: from its notch's outer point to the next corner
    const b0 = r0[(k + 1) % 8].pts[0], b1 = r1[(k + 1) % 8].pts[0]
    const n0 = facetNormal(k, z0), n1 = facetNormal(k, z1)
    quadN(facade, a0[3], b0, b1, a1[3], n0, n0, n1, n1)
  }
}
// --- Inner core above the body: the enclosed top floors and plant, a little
// inside the blades in the same glass, so the slots between blades and the
// faces left where a lower facet stops read as glass, not as sky. It stops at
// CORE_TOP, where the open lattice takes over.
const CORE_TOP = 278
const CORE_IN = 1.1 // the core sits just behind the blades' inner faces (0.9 m)
{
  const zs: number[] = []
  for (let z = Z_BODY - 1; z < CORE_TOP; z += 8) zs.push(z)
  zs.push(CORE_TOP)
  // Notched like the body, so the fissures run on up the core under the blade gaps.
  for (let i = 0; i + 1 < zs.length; i++) {
    const r0 = notchRing(zs[i], NOTCH_W, CORE_IN), r1 = notchRing(zs[i + 1], NOTCH_W, CORE_IN)
    for (let k = 0; k < 8; k++) {
      const a0 = r0[k].pts, a1 = r1[k].pts
      for (let j = 0; j < 3; j++) fissure.quad(a0[j], a0[j + 1], a1[j + 1], a1[j])
      facade.quad(a0[3], r0[(k + 1) % 8].pts[0], r1[(k + 1) % 8].pts[0], a1[3])
    }
  }
  const rt = notchRing(CORE_TOP, NOTCH_W, CORE_IN).flatMap((c) => c.pts)
  // A low glass pyramid over the core, so it has no flat shelf to show between the blades.
  const ct: V3 = [APEX[0], APEX[1], CORE_TOP + 10]
  for (let i = 0; i < rt.length; i++) facade.tri(ct, rt[i], rt[(i + 1) % rt.length])
  // Roof over the full-width floors at Z_BODY (only its rim shows, in the slots).
  const r = notchRing(Z_BODY).flatMap((c) => c.pts)
  const c: V3 = [APEX[0], APEX[1], Z_BODY]
  for (let i = 0; i < r.length; i++) roof.tri(c, r[i], r[(i + 1) % r.length])
}

// --- Blades: each facet carries on above the body in its own plane and on the
// same taper, the same opaque glass with no break, separated from its neighbours
// only by the narrow notch slot. Over the last TIP_RUN metres both edges close
// to a point at the facet's middle. The blade is glass through, edges included,
// so seen edge-on it is the thin edge of the same pane, ending at its own tip.
const TIP_RUN = 30
for (let k = 0; k < 8; k++) {
  const top = TOPS[k]
  // The south-west facet stops 7 m above the full-width floors: too short for a
  // blade of its own, so it ends with the body and the core carries on behind.
  if (top - Z_BODY < 12) continue
  const z0 = Z_BODY
  const run = Math.min(TIP_RUN, top - Z_BODY)
  const sect = (z: number) => {
    const f = Math.min(1, Math.max(0, (top - z) / run))
    const { dir, inward } = facetAxes(k, z)
    const ck = corner(k, z), ck1 = corner(k + 1, z)
    const s0 = add(ck, dir, NOTCH_W), m = lerp3(s0, ck1, 0.5)
    const s = lerp3(m, s0, f), e = lerp3(m, ck1, f)
    return [s, e, add(e, inward, BLADE_T), add(s, inward, BLADE_T)] as V3[]
  }
  const cuts = new Set<number>([z0, top, Math.max(z0, top - run)])
  for (let z = z0; z < top; z += 6) cuts.add(z)
  const zs = [...cuts].sort((a, b) => a - b)
  for (let i = 0; i + 1 < zs.length; i++) {
    const za = zs[i], zb = zs[i + 1]
    const [s0, e0, ei0, si0] = sect(za), [s1, e1, ei1, si1] = sect(zb)
    const na = facetNormal(k, za), nb = facetNormal(k, zb)
    quadN(facade, s0, e0, e1, s1, na, na, nb, nb) // outer face, shaded as the facet below
    facade.quad(ei0, si0, si1, ei1) // inner face
    facade.quad(e0, ei0, ei1, e1) // the pane's edges
    facade.quad(si0, s0, s1, si1)
  }
}

// --- Spire lattice: a narrow steel mesh in the top 40 m, glimpsed between the shard tips. ---
function beam(p: Part, a: V3, b: V3, w = 0.7) {
  const d = unit(subv(b, a))
  const ref: V3 = Math.abs(d[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const u = unit(crossv(d, ref)), v = crossv(d, u)
  const h = w / 2
  const cs = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  const at = (p0: V3, i: number): V3 => add(add(p0, u, cs[i][0] * h), v, cs[i][1] * h)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    p.quad(at(a, i), at(a, j), at(b, j), at(b, i))
  }
}
{
  const LAT_TOP = 297
  // Lattice ring as a share of the facet ring: 0.6 at 266 m (inside the core), closing to 0.3 at its head.
  const core = (z: number) => 0.6 - 0.3 * Math.max(0, (z - 266) / (LAT_TOP - 266))
  const zs = [266, 276, 286, LAT_TOP]
  const ring = (z: number) => Array.from({ length: 8 }, (_, k) => corner(k, z, core(z)))
  for (let i = 0; i + 1 < zs.length; i++) {
    const r = ring(zs[i]), r1 = ring(zs[i + 1])
    for (let k = 0; k < 8; k++) {
      beam(steel, r[k], r1[k], 0.6) // posts
      beam(steel, r1[k], r1[(k + 1) % 8], 0.45) // ring beams
      const [a, b] = (k + i) % 2 ? [r[k], r1[(k + 1) % 8]] : [r[(k + 1) % 8], r1[k]]
      beam(steel, a, b, 0.4) // diagonals
    }
  }
  // The mast up the middle, and the posts' heads closing on it.
  const centre = (z: number): V3 => { const r = ring(z); return [r.reduce((s, p) => s + p[0], 0) / 8, r.reduce((s, p) => s + p[1], 0) / 8, z] }
  beam(steel, centre(266), centre(LAT_TOP + 5), 0.6)
  const rt = ring(LAT_TOP)
  for (let k = 0; k < 8; k++) beam(steel, rt[k], centre(LAT_TOP + 4), 0.4)
}

// --- Wings: two glass blocks against the east and south-east facets. ---
function wing(poly: [number, number][], h: number, roofPart: Part) {
  const n = poly.length
  const P = (i: number, z: number): V3 => [poly[i][0], poly[i][1], z]
  // Walls in panels no longer than ~6 m in height bands, with a steel band every 4 floors.
  const bands = [0, 4.5]
  for (let z = 4.5 + 16; z < h - 3; z += 16) bands.push(z)
  bands.push(h - 1.6, h)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    for (let b = 0; b + 1 < bands.length; b++) {
      const z0 = bands[b], z1 = bands[b + 1]
      const part = b === bands.length - 2 ? steel : facade
      part.quad(P(i, z0), P(j, z0), P(j, z1), P(i, z1))
      if (part === facade && b > 0) {
        // a 0.8 m steel floor band on the wall face, 0.05 m out
        const dir = unit([poly[j][0] - poly[i][0], poly[j][1] - poly[i][1], 0])
        const out: V3 = [dir[1] * 0.05, -dir[0] * 0.05, 0]
        steel.quad(add(P(i, z0), out), add(P(j, z0), out), add(P(j, z0 + 0.8), out), add(P(i, z0 + 0.8), out))
      }
    }
  }
  const top = poly.map((_, i) => P(i, h))
  // Parapet: roof inset 0.8 m lower.
  const c = [poly.reduce((s, p) => s + p[0], 0) / n, poly.reduce((s, p) => s + p[1], 0) / n]
  const inner = poly.map(([x, y]) => { const dx = x - c[0], dy = y - c[1], l = Math.hypot(dx, dy); return [x - (dx / l) * 1.0, y - (dy / l) * 1.0] as [number, number] })
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    steel.quad(top[i], top[j], [inner[j][0], inner[j][1], h], [inner[i][0], inner[i][1], h])
    steel.quad([inner[j][0], inner[j][1], h], [inner[i][0], inner[i][1], h], [inner[i][0], inner[i][1], h - 0.8], [inner[j][0], inner[j][1], h - 0.8])
  }
  roofPart.cap(inner.map(([x, y]) => [x, y, h - 0.8] as V3), true)
}
// East wing (way/665171689), its tower-side edge pushed 6 m into the tower.
wing([[23.0, 4.5], [14.6, -16.2], [22.3, -20.86], [34.4, -5.36]], 74, garden)
// South-east wing (way/665171690), likewise.
wing([[1.4, -24.6], [-1.0, -29.56], [4.9, -34.96], [22.5, -50.86], [31.5, -31.86], [16.0, -18.66], [13.4, -15.4]], 70, roof)

// Floodlight: the crown (blades and frame above ~265 m) is lit brilliant white at night.
const lit = (p: V3) => Math.min(1, Math.max(0, (p[2] - 258) / 8))
const parts = [
  { part: facade, material: { ...windowVariant(2, 0xa9bfd1), floodlight: lit } },
  { part: fissure, material: finish('shard-fissure', 0x5d7184, 0.35) }, // stays dark at night, so the facets still read
    { part: steel, material: { ...finish('shard-steel', 0x8f989e, 0.6), floodlight: lit } },
  { part: roof, material: PALETTE.roof },
  { part: garden, material: finish('roof-garden', 0x93a77f) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('The Shard', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: TIP,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/31110737', 'way/226737912', 'way/666126950', 'way/665171689', 'way/665171690',
    'way/666124825', 'way/666124826', 'way/666124827', 'way/666124828', 'way/666124829', 'way/666124830', 'way/666124831', 'way/666124832'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/london-the-shard.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
