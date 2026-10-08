/**
 * Lake Point Tower, Chicago (1968, Schipporeit and Heinrich) — original
 * procedural geometry, CC0-1.0.
 * bun generators/chi-lake-point-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the tower outline (OSM way/150408224),
 * 41.891497, -87.612315. Bearing 0: the plan is drawn as it lies.
 *
 * Identity: the only skyscraper east of Lake Shore Drive, a 70-storey
 * three-lobed (Y / trefoil) tower wrapped in a continuous, softly curving
 * dark bronze glass curtain wall with fine horizontal floor lines, a small
 * round penthouse drum on the roof, standing on a low dark podium (the
 * garage) whose roof is a 2.5-acre park.
 *
 * Abstraction: the plan is three capsule-shaped wings 19 m wide, smoothly
 * filleted where they meet, so the wall curves continuously as it does in
 * the photos. The curtain wall is `window` glass (the tower is residential
 * and lit at night) in a bronze-grey pulled light per STYLE.md but still
 * clearly "the dark one", with a slightly lighter bronze floor band every
 * five storeys in place of the real per-floor spandrels. The open
 * column-lined base storey is a dark recessed band. The podium's rooftop
 * park is a muted green roof; its trees, pool and lagoon are left out.
 *
 * Evidence:
 *  - plan: OSM way/150408224. Wing tips 35.0–35.6 m from the centroid at
 *    bearings ≈ -1°, 111° and 246° (OSM); NAIP gives -2°, 112°, 239°. The
 *    wings are drawn at -1°, 112° and 244°, 35.3 m long, 9.6 m in radius
 *    (the north wing's measured half-width), with a 7 m fillet between
 *    wings to match OSM's inner corners ≈ 19 m from the centre.
 *  - heights: roof 191 m with 69 levels on the outline; the round roof part
 *    way/284814462 (r ≈ 12.5 m) to 197.5 m. Published height 197 m, 70
 *    floors (Wikipedia). Podium relation/19385699 height 12 (OSM),
 *    roof:material grass. Base storey 12–16 m measured against the podium
 *    wall in Schwen's photo (estimate).
 *  - podium: OSM relation/19385699 outer way/150408223, as drawn. Its inner
 *    ring (a round opening ≈ 28 m across in the park, west of the tower)
 *    is not cut out of the roof; at map scale it reads as part of the park.
 *  - colour: dark bronze glass and bronze mullions (photos; OSM
 *    building:colour #4D5143), dark brown-grey podium walls.
 *
 * Photos (Wikimedia Commons): Lake_Point_Tower.jpg (Daniel Schwen, CC BY-SA
 * 4.0); 20220909_Lake_Point_Tower_from_St._Regis_Chicago.jpg (TonyTheTiger,
 * CC BY-SA 4.0); Chicago_in_2022_Lake_Point_Tower_Condominium_
 * (52059721783).jpg (Chris Rycroft, CC BY 2.0); Lake_Point_Tower,_Chicago_
 * (5215523025).jpg (JohnPickenPhoto, CC BY 2.0); Lakefront_Trail_at_Lake_
 * Point_Tower_-_Chicago,_IL_-_July_2021.jpg (AlphaBeta135, CC BY 4.0);
 * Lake_Point_Tower,_Streeterville,_Chicago,_Illinois_(11004424056).jpg (Ken
 * Lund, CC BY-SA 2.0). USGS NAIP for the plan. No commercial imagery.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const TAU = Math.PI * 2

const roof = new Part(), glass = new Part(), bronze = new Part(), dark = new Part(), podium = new Part(), garden = new Part()

// --- Plan: three filleted capsules ----------------------------------------------
const WINGS = [-1, 112, 244].map((b) => (b * Math.PI) / 180)
const ARM = 35.3, RAD = 9.6, FILLET = 7

/** Signed distance to one wing: a capsule from the centre out along bearing b. */
function capsule(p: XY, b: number) {
  const d: XY = [Math.sin(b), Math.cos(b)]
  const t = Math.max(0, Math.min(ARM - RAD, p[0] * d[0] + p[1] * d[1]))
  return Math.hypot(p[0] - d[0] * t, p[1] - d[1] * t) - RAD
}
/** Polynomial smooth minimum, which rounds the inside corners by about k. */
function smin(a: number, b: number, k: number) {
  const h = Math.max(k - Math.abs(a - b), 0) / k
  return Math.min(a, b) - (h * h * k) / 4
}
const sdf = (p: XY) => WINGS.map((b) => capsule(p, b)).reduce((a, b) => smin(a, b, FILLET))

/**
 * The outline, counter-clockwise from above, `n` points evenly spaced along
 * its length, offset outward by `grow` metres. Found by bisecting along rays
 * from the centre (the plan is star-shaped about it), then resampled.
 */
function outline(n: number, grow = 0): XY[] {
  const dense: XY[] = []
  for (let i = 0; i < 1440; i++) {
    const a = (i / 1440) * TAU
    const dir: XY = [Math.cos(a), Math.sin(a)]
    let lo = 0, hi = 60
    for (let k = 0; k < 40; k++) {
      const m = (lo + hi) / 2
      if (sdf([dir[0] * m, dir[1] * m]) < grow) lo = m
      else hi = m
    }
    dense.push([dir[0] * lo, dir[1] * lo])
  }
  const cum = [0]
  for (let i = 1; i <= dense.length; i++) {
    const a = dense[i - 1], b = dense[i % dense.length]
    cum.push(cum[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]))
  }
  const total = cum[cum.length - 1]
  const out: XY[] = []
  let j = 0
  // Start at the north wing's tip, so a point always lands on each tip.
  const start = cum[Math.round(1440 * ((Math.PI / 2 - WINGS[0]) / TAU + 1)) % 1440]
  for (let i = 0; i < n; i++) {
    const s = (start + (i / n) * total) % total
    while (!(cum[j] <= s && s <= cum[j + 1])) j = (j + 1) % dense.length
    const t = (s - cum[j]) / (cum[j + 1] - cum[j] || 1)
    const a = dense[j], b = dense[(j + 1) % dense.length]
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
  }
  return out
}

/** A vertical wall round a closed ring, with smooth horizontal normals. */
function wall(p: Part, ring: XY[], z0: number, z1: number) {
  const n = ring.length
  const nrm = ring.map((q, i) => {
    const a = ring[(i - 1 + n) % n], b = ring[(i + 1) % n]
    const ex = b[0] - a[0], ey = b[1] - a[1], l = Math.hypot(ex, ey) || 1
    return [ey / l, -ex / l, 0] as V3
  })
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a: V3 = [ring[i][0], ring[i][1], z0], b: V3 = [ring[j][0], ring[j][1], z0]
    const c: V3 = [ring[j][0], ring[j][1], z1], d: V3 = [ring[i][0], ring[i][1], z1]
    p.tri(a, b, c, undefined, undefined, undefined, [nrm[i], nrm[j], nrm[j]])
    p.tri(a, c, d, undefined, undefined, undefined, [nrm[i], nrm[j], nrm[i]])
  }
}
/** A flat cap over a star-shaped ring, fanned from the centre. */
function capStar(p: Part, ring: XY[], z: number, up: boolean, c: XY = [0, 0]) {
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n]
    const A: V3 = [a[0], a[1], z], B: V3 = [b[0], b[1], z], C: V3 = [c[0], c[1], z]
    if (up) p.tri(C, A, B)
    else p.tri(C, B, A)
  }
}
/** A flat ring between an outer ring and an inner one of the same count. */
function ledge(p: Part, outer: XY[], inner: XY[], z: number) {
  const n = outer.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    p.quad([inner[i][0], inner[i][1], z], [outer[i][0], outer[i][1], z], [outer[j][0], outer[j][1], z], [inner[j][0], inner[j][1], z])
  }
}
const circle = (r: number, n: number, c: XY = [0, 0]): XY[] =>
  Array.from({ length: n }, (_, i) => [c[0] + r * Math.cos((i / n) * TAU), c[1] + r * Math.sin((i / n) * TAU)] as XY)

// --- Tower --------------------------------------------------------------------------
const N = 63
const face = outline(N)
const inset = outline(N, -2.2)        // the recessed base storey behind its columns
const ROOF = 191, PODIUM = 12, BASE = 16
const FLOOR = (ROOF - BASE) / 66      // ≈ 2.65 m storeys above the base
const BAND = 0.75                     // a bronze floor band, every five storeys

// The dark open base storey, set back behind the wall line.
wall(dark, inset, PODIUM - 0.5, BASE)
// The soffit over it faces down.
ledge(bronze, inset, face, BASE)
// The curtain wall: glass between bronze floor bands every five storeys,
// with a deeper bronze fascia at the top.
let z = BASE
wall(bronze, face, z, z + BAND)
z += BAND
for (let k = 5; k <= 66; k += 5) {
  const top = Math.min(BASE + k * FLOOR, ROOF - 2.4)
  wall(glass, face, z, top)
  wall(bronze, face, top, top + BAND)
  z = top + BAND
}
wall(glass, face, z, ROOF - 2.4)
wall(bronze, face, ROOF - 2.4, ROOF)
// The roof: a low parapet lip round a flat roof.
const lip = outline(N, -0.6)
ledge(bronze, face, lip, ROOF)
wall(bronze, lip.slice().reverse(), ROOF - 0.8, ROOF)
capStar(roof, lip, ROOF - 0.8, true)

// The round penthouse drum (OSM roof part, r 12.5 m, to 197.5 m): dark glass
// under a bronze fascia.
const drum = circle(12.4, 24, [0.3, 0.5])
wall(glass, drum, ROOF - 0.8, 196.3)
wall(bronze, drum, 196.3, 197.5)
capStar(dark, drum, 197.5, true, [0.3, 0.5])

// --- Podium -------------------------------------------------------------------------
// OSM relation/19385699's outer way, moved from its own centroid into the
// tower's frame (−38.6 m east, +4.0 m north).
const PODIUM_RING: XY[] = ([
  [-90.5, 20.2], [-88.9, -45.6], [29.9, -42.7], [75.1, -41.3], [74.0, 23.7], [12.9, 22.5], [-8.5, 22.1],
] as XY[]).map(([x, y]) => [x - 38.6, y + 4.0])
// Bevelled top edge: the wall to 11.5 m, a 0.5 m chamfer, then the park.
const podIn = PODIUM_RING.map(([x, y]) => {
  const cx = -45, cy = -6 // roughly the podium's centre, for a small inset
  const dx = x - cx, dy = y - cy, l = Math.hypot(dx, dy)
  return [x - (dx / l) * 0.7, y - (dy / l) * 0.7] as XY
})
for (let i = 0; i < PODIUM_RING.length; i++) {
  const j = (i + 1) % PODIUM_RING.length
  const a = PODIUM_RING[i], b = PODIUM_RING[j], c = podIn[j], d = podIn[i]
  podium.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], PODIUM - 0.5], [a[0], a[1], PODIUM - 0.5])
  podium.quad([a[0], a[1], PODIUM - 0.5], [b[0], b[1], PODIUM - 0.5], [c[0], c[1], PODIUM], [d[0], d[1], PODIUM])
}
garden.cap(podIn.map(([x, y]) => [x, y, PODIUM] as V3), true)

const GLASS = { ...PALETTE.window, color: 0x67615b }
const BRONZE = finish('bronze', 0x857868)
const DARK = finish('bronze-dark', 0x4c4a48)
const PODIUM_WALL = finish('podium-concrete', 0x9a9389)
const GARDEN = finish('roof-garden', 0xa4b393)

const parts = [
  { part: glass, material: GLASS },
  { part: bronze, material: BRONZE },
  { part: dark, material: DARK },
  { part: podium, material: PODIUM_WALL },
  { part: garden, material: GARDEN },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((n, p) => n + p.part.triangles, 0)
console.log(parts.map((p) => `${p.material.name}: ${p.part.triangles}`).join('\n'))
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Lake Point Tower', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: 197.5,
})
await Bun.write(new URL('../models/chi-lake-point-tower.glb', import.meta.url), glb)
console.log(`chi-lake-point-tower.glb: ${triangles} triangles, ${glb.length} bytes`)
