/**
 * Audi Field, Washington (MLS, D.C. United) — procedural, CC0-1.0, no
 * textures.  bun generators/dc-audi-field.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0, since the pitch
 * (OSM way/1196917795) runs due north–south. The anchor is the area
 * centroid of the stadium outline (building=stadium relation/12361161,
 * outer way/910656537). z = 0 is the street at the lowest corner, 1 m below
 * the pitch, so the pitch sits at z = 1. The pitch itself is the map's.
 *
 * A rectangular stadium of four separate stands, each measured from the
 * DC lidar surface model (Lidar/DSM_2024, 1 m, imagery.dcgis.dc.gov):
 *   - East (main) stand: seats from the touchline up to 27 m under a flat
 *     white canopy at 29–30 m, 31 m deep, the full length of the pitch.
 *     Behind it the 15 m east building (offices, team store) with a 24 m
 *     strip, and the 23 m black-framed glass block at the north-east corner.
 *   - West stand: seats up to 20 m under a white canopy 19 m deep, tilted
 *     up toward the pitch (25 m at the front, 22 m at the back), the stand
 *     raised over the street on black raking steel (Farragutful 07–08).
 *   - South stand: steep and open, no roof, rising to 20 m, its back on the
 *     street carried on exposed black raking steel; a 10 m concourse block
 *     in front of it; the "Audi Field" sign board (28 m) on top and an
 *     A-frame light rig at each end (33.5 m).
 *   - North stand: low and open, to 15 m, with the video board on its
 *     west half (top 31 m) and two lighter rigs (27 m).
 * So the white canopy covers the two long sides only; the ends are open.
 *
 * Seats: charcoal (the stadium's seats are black and dark grey, with red
 * sideline sections and the red-and-white "D.C. UNITED" lettering in the
 * south stand). Drawn as broad bands: the lower sideline seats red, the
 * rest charcoal; the lettering is left out. Steel frames and the north-east
 * block's frame are the same charcoal, at the style's floor (#4a4f57).
 *
 * Evidence
 * - OSM: outline relation/12361161 (outer way/910656537), pitch
 *   way/1196917795. The north-east glass block stands partly outside the
 *   OSM outline (the outline notches round it), so part of it is drawn
 *   over unmapped ground.
 * - Measured: DC lidar DSM 2024 (every height and edge above); USGS NAIP.
 * - Published: opened 2018, 20,000 seats, Populous (Wikipedia).
 * - Photos (Wikimedia Commons): Duane Lempke, "Turner Construction AUDI
 *   Field Home of DC United Soccer Team Looking SW" (CC0, aerial from the
 *   north-east); Farragutful, "Audi Field DC 01–09" (CC BY-SA 4.0, the
 *   exterior from the east, south and corners); David, "Audi Field DC
 *   United" (CC BY 2.0, the south stand); GregMcCollum, "Audi Field,
 *   August 8, 2026" (CC0, interior); Rainclaw7, "Audi Field June 25th"
 *   (CC BY-SA 4.0, interior).
 * Estimated: the facade banding (glass heights) from the photos; the rigs'
 * shape; the north-west corner seating.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { add, box, mul, prism, quad, unit, type XY } from './dc-nationals-park'

const charcoal = new Part(), red = new Part(), trim = new Part(), stone = new Part(), roof = new Part(), glass = new Part()
const P0 = 1 // the pitch, 1 m above the lowest street corner

/**
 * A straight stand: plan corners front-left, front-right (on the pitch
 * side), back-right, back-left; seats rise from `zf` to `zb`. The lower
 * fraction `redTo` of the rake is red, the rest charcoal. Front wall, back
 * wall and ends close it.
 */
function stand(FL: XY, FR: XY, BR: XY, BL: XY, zf: number, zb: number, redTo = 0, back: Part = charcoal, open = false) {
  const lerp = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
  const at = (p: XY, z: number): V3 => [p[0], p[1], z]
  const inward = unit([FL[0] - BL[0] + FR[0] - BR[0], FL[1] - BL[1] + FR[1] - BR[1], 0])
  const up: V3 = add([0, 0, 1], mul(inward, (zb - zf) / Math.hypot(BL[0] - FL[0], BL[1] - FL[1])))
  const bands: [number, number, Part][] = redTo > 0 ? [[0, redTo, red], [redTo, 1, charcoal]] : [[0, 1, charcoal]]
  for (const [t0, t1, part] of bands) {
    const L0 = lerp(FL, BL, t0), R0 = lerp(FR, BR, t0), L1 = lerp(FL, BL, t1), R1 = lerp(FR, BR, t1)
    const z0 = zf + (zb - zf) * t0, z1 = zf + (zb - zf) * t1
    quad(part, [at(L0, z0), at(R0, z0), at(R1, z1), at(L1, z1)], up)
  }
  quad(charcoal, [at(FL, 0), at(FR, 0), at(FR, zf), at(FL, zf)], inward) // the pitch-side wall
  if (!open) quad(back, [at(BL, 0), at(BR, 0), at(BR, zb), at(BL, zb)], mul(inward, -1))
  else {
    // Raised on raking steel: a fascia at the top, the grey underside of
    // the seating deck sloping down toward the pitch, the concourse wall
    // beneath it, and black columns along the back.
    const zs = zb - 2.5, t = 0.4, zl = zf + (zb - zf) * t - 3
    const L = lerp(FL, BL, t), R = lerp(FR, BR, t)
    quad(charcoal, [at(BL, zs), at(BR, zs), at(BR, zb), at(BL, zb)], mul(inward, -1))
    quad(roof, [at(L, zl), at(R, zl), at(BR, zs), at(BL, zs)], add(mul(inward, -1), [0, 0, -1.2]))
    quad(charcoal, [at(L, 0), at(R, 0), at(R, zl), at(L, zl)], mul(inward, -1))
    const len = Math.hypot(BR[0] - BL[0], BR[1] - BL[1]), n = Math.max(2, Math.round(len / 9))
    const e = unit([BR[0] - BL[0], BR[1] - BL[1], 0])
    for (let i = 0; i <= n; i++) {
      const p = lerp(BL, BR, i / n), q = add([p[0], p[1], 0], mul(inward, 0.6))
      box(charcoal, add(q, [0, 0, zs / 2]), [e, inward, [0, 0, 1]], [0.45, 0.45, zs / 2])
    }
  }
  const side = unit([FR[0] - FL[0], FR[1] - FL[1], 0])
  const zbase = open ? zb - 2.5 : 0
  quad(charcoal, [at(FR, 0), at(BR, zbase), at(BR, zb), at(FR, zf)], side)
  quad(charcoal, [at(FL, 0), at(BL, zbase), at(BL, zb), at(FL, zf)], mul(side, -1))
}

/** A flat canopy slab, white on top and at its edges, charcoal beneath; the front edge may stand higher. */
function canopy(FL: XY, FR: XY, BR: XY, BL: XY, zFront: number, zBack: number, t = 1.2) {
  const at = (p: XY, z: number): V3 => [p[0], p[1], z]
  const top = [at(FL, zFront), at(FR, zFront), at(BR, zBack), at(BL, zBack)]
  const bot = [at(FL, zFront - t), at(FR, zFront - t), at(BR, zBack - t), at(BL, zBack - t)]
  quad(trim, top, [0, 0, 1])
  quad(charcoal, bot, [0, 0, -1])
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const c: V3 = [(FL[0] + FR[0] + BR[0] + BL[0]) / 4, (FL[1] + FR[1] + BR[1] + BL[1]) / 4, 0]
    const m = mul(add(top[i], top[j]), 0.5)
    quad(trim, [bot[i], bot[j], top[j], top[i]], [m[0] - c[0], m[1] - c[1], 0])
  }
}

/** A tall A-frame light rig: two raked legs and a lamp bank facing `face`. */
function rig(c: XY, face: XY, w: number, h: number, footZ: number) {
  const f = unit([face[0], face[1], 0]), s: V3 = [-f[1], f[0], 0]
  const base: V3 = [c[0], c[1], 0]
  for (const k of [-1, 1]) {
    const foot = add(add(base, mul(s, (k * w) / 2)), [0, 0, footZ])
    const head = add(add(base, mul(s, (k * w) / 6)), [0, 0, h - 3])
    const mid = mul(add(foot, head), 0.5), along = unit([head[0] - foot[0], head[1] - foot[1], head[2] - foot[2]])
    box(charcoal, mid, [f, unit(cross3(along, f)), along], [0.35, 0.35, Math.hypot(head[0] - foot[0], head[1] - foot[1], head[2] - foot[2]) / 2])
  }
  box(trim, add(base, [0, 0, h - 1.6]), [s, f, [0, 0, 1]], [w / 2 - 0.5, 0.6, 1.6], true)
}
const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

// ---------------------------------------------------------------------------
// The pitch: x −50.2…18.0, y −44.4…60.2. The outline's west wall x = −72.8,
// its south wall y = −101.8.

// East stand: red lower bowl, charcoal above, under the big white canopy.
stand([21, -58], [21, 70], [58, 70], [58, -58], P0 + 1, P0 + 26, 0.4)
canopy([26, 72], [26, -60], [59.5, -60], [59.5, 72], P0 + 29.6, P0 + 29.6)
// Its south-east corner, a wedge of seats into the outline's diagonal.
stand([21, -58], [44, -58], [44, -72], [30, -80], P0 + 2, P0 + 18)
// East building: 15 m offices along the street, the 24 m strip, the
// low south-east wing, all inside the outline.
prism([[58, -14], [58, 64], [72, 70.5], [87, 72], [90, 54], [90.4, 40], [89.2, 26.2], [86.6, 15.1], [83.9, -3.1], [83.2, -11.8], [76.6, -11.7], [72.8, -14]], 0, 15, stone, roof)
prism([[58, -14], [58, 22], [65, 22], [65, -14]], 0, 24, roof, roof)
prism([[58, -14], [72.8, -14], [61.7, -52.5], [58, -52.5]], 0, 7, stone, roof)
// North-east block: a black frame round a glass box, 23 m.
prism([[50, 64], [50, 88], [80, 88], [87, 72], [72, 64]], 0, 23, charcoal, roof)
for (const [a, b] of [[[50, 66], [50, 86]], [[52, 88], [78, 88]], [[80.5, 86], [86, 73.5]]] as [XY, XY][]) {
  const e = unit([b[0] - a[0], b[1] - a[1], 0]), n: V3 = [e[1], -e[0], 0]
  const out = n[0] * (a[0] - 68) + n[1] * (a[1] - 76) > 0 ? n : mul(n, -1)
  const P = (p: XY, z: number): V3 => add([p[0], p[1], z], mul(out, 0.05))
  quad(glass, [P(a, 4), P(b, 4), P(b, 20.5), P(a, 20.5)], out)
}
// East facade glass, white brick base below it, grey panels above.
{
  const out: V3 = [1, 0, 0]
  const runs: [XY, XY][] = [[[90.4, 40], [89.2, 26.2]], [[89.2, 26.2], [86.6, 15.1]], [[86.6, 15.1], [83.9, -3.1]], [[90, 54], [90.4, 40]]]
  for (const [a, b] of runs) {
    const e = unit([b[0] - a[0], b[1] - a[1], 0]), n: V3 = [-e[1], e[0], 0]
    const o = n[0] > 0 ? n : mul(n, -1)
    const P = (p: XY, z: number): V3 => add([p[0], p[1], z], mul(o, 0.05))
    quad(glass, [P(a, 5), P(b, 5), P(b, 12.5), P(a, 12.5)], out)
  }
}

// West stand: seats to 20 m under the tilted canopy, raised on black
// raking steel over the street.
stand([-54, 70], [-54, -56], [-72.8, -56], [-72.8, 70], P0 + 1, P0 + 19, 0.45, roof, true)
canopy([-53, -58], [-53, 72], [-72.8, 72], [-72.8, -58], P0 + 24.5, P0 + 21.5)
// (Its back is open steel, as on the street: see stand().)

// South stand: steep and open; its back on black raking steel; the 10 m
// concourse block on the street in front.
stand([20, -56], [-56, -56], [-56, -84], [20, -84], P0 + 2, P0 + 20)
// The corner pieces joining it to the side stands.
stand([-54, -56], [-56, -56], [-72.8, -84], [-72.8, -56], P0 + 2, P0 + 20)
stand([20, -56], [21, -58], [30, -82], [20, -84], P0 + 2, P0 + 20)
prism([[-72.8, -86], [30, -86], [30.3, -101.8], [-72.8, -101.8]], 0, 10, stone, roof)
quad(glass, [[-70, -101.85, 3], [28, -101.85, 3], [28, -101.85, 8], [-70, -101.85, 8]], [0, -1, 0])
// Raking steel: charcoal fins down the stand's back above the concourse.
for (let x = -66; x <= 24; x += 10) quad(charcoal, [[x, -84.05, 10], [x + 1.4, -84.05, 10], [x + 1.4, -84.05, P0 + 20], [x, -84.05, P0 + 20]], [0, -1, 0])
// The "Audi Field" sign board on top, and the A-frame light rigs.
box(charcoal, [-17, -86, 24.5], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [14, 0.6, 4], true)
for (const x of [-21, -13]) box(roof, [x, -86, 22], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [0.4, 0.4, 0.8])
rig([-60.5, -86], [0, 1], 11, 34.5, P0 + 20)
rig([26, -86], [-0.3, 1], 10, 34.5, P0 + 20)

// North stand: low and open, the video board on its west half.
stand([-56, 69], [30, 69], [30, 90], [-56, 90], P0 + 1.5, P0 + 14.5, 0, stone)
stand([-72.8, 72], [-56, 69], [-56, 90], [-66, 88], P0 + 2, P0 + 12, 0, stone)
quad(glass, [[-50, 90.05, 4], [26, 90.05, 4], [26, 90.05, 9], [-50, 90.05, 9]], [0, 1, 0])
box(charcoal, [-32, 93, 25], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [13.5, 0.9, 7], true)
for (const x of [-42, -22]) box(roof, [x, 93, 9], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [0.6, 0.6, 9])
rig([-58, 93], [0.3, -1], 8, 28, 0.4)
rig([21, 80.5], [-0.3, -1], 8, 28, P0 + 8)

// ---------------------------------------------------------------------------
const parts = [
  { part: charcoal, material: finish('dc-united-charcoal', 0x50555e) },
  { part: red, material: finish('dc-united-red', 0xb04a4c) },
  { part: trim, material: PALETTE.trim },
  { part: stone, material: PALETTE.stone },
  { part: roof, material: PALETTE.roof },
  { part: glass, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Audi Field', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 0, osm: 'relation/12361161', height: 35.5,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/dc-audi-field.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
