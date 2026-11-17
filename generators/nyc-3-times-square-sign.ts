/**
 * The curved LED screen on the drum of 3 Times Square (the Thomson Reuters
 * building, 2001), at Seventh Avenue and West 42nd Street, Times Square,
 * Manhattan. Procedural, CC0-1.0.
 *   bun generators/nyc-3-times-square-sign.ts
 *
 * Which corner: the curved sign is on the round, nine-storey stone drum at
 * the building's south-east corner, Seventh Avenue at 42nd Street (the
 * north-west corner of that crossing), where the assignment's coordinate
 * (-73.98680, 40.75620) points; e4 and c1 show it there, over the Chase
 * branch, with the "W 42 St" street sign. The 43rd Street corner of the
 * building carries a different, flat-faced corner sign (t1), not modelled
 * here.
 *
 * Signage only. 3 Times Square stays the map's own OSM building: outline
 * way/266034080 (169.2 m) and its parts, of which this corner is
 *   way/1549214955  the drum: a circular arc of radius 13.10 m (bearings
 *                   88-250 from its centre, fitted residuals under 0.4 m),
 *                   9 levels, height 37.5 m, from the ground;
 *   way/1549214958, way/1549214957  the glass tower, whose south-east corner
 *                   comes down to 12.4 m from the drum's centre.
 * The model replaces nothing. Its origin is the centre of that arc
 * (-73.9870797, 40.7563699), bearing 0, so the frame is plain north-up.
 * The screen's back is at radius 13.65 m, 0.55 m outside the fitted circle
 * (0.23 m at the arc's widest bulge), and the whole sign stays 0.23 m or
 * more outside every part it stands beside and at or below the drum's
 * 37.5 m (work/nyc-3-times-square-sign/clearance.txt). The outline itself
 * reaches 1.5 m past the screen at bearings 92-110 only because it takes in
 * the tower's cantilevered crown (way/1549214953, 132-169 m), far above
 * the sign; the map draws the parts, not an outline that has parts.
 *
 * Map frame: x east, y north, z up, metres; y = 0 is the street (flat to
 * 0.3 m round the drum in the lidar).
 *
 * Measured (USGS 3DEP NY_NewYorkCity lidar, 2017 flight, 0.5 m grid): the
 * drum's roof 37 m above the street (OSM 37.5 m); its circle sits about
 * 4 m east and 2 m south of OSM's, as the block's other OSM outlines do;
 * the model follows OSM, which the map draws.
 * Estimated from the photos (e4, c1), in storeys of the stone drum:
 * - the screen from 12.0 m (over the drum's two stone storeys and cornice)
 *   to 37.0 m, round the whole drum (bearings 92-246);
 * - in it, a ticker strip at the foot (12.0-13.8 m), a lower tier to 21.6 m,
 *   a dark ledge carrying the floodlights (21.6-22.3 m) and the upper tier;
 * - the band of separate screens over the shopfronts at 4.2-6.4 m (c1),
 *   with the drum's piers between them run down to the pavement.
 * Night: every screen is `neon-*` in a colour it shows: the upper tier blue
 * (c1, 2025, the most recent licensed night view), the lower tier warm
 * orange (e4) and the ticker and the street screens white (e4, c1). The
 * frame, ledge and piers are dark charcoal. Content changes all day; these
 * colour blocks stand for it rather than any one advertisement, so there
 * is no lettering.
 *
 * Photos (EVIDENCE):
 * - e4 "Times Sq Sep 2021 74.jpg", Epicgenius, CC BY-SA 4.0: from the
 *   north-east up Seventh Avenue, the two tiers, ledge, ticker and drum.
 *   https://commons.wikimedia.org/wiki/File:Times_Sq_Sep_2021_74.jpg
 * - c1 "Chase Bank Times Square (August 2025).jpg", Busition, CC BY 4.0:
 *   night, from the south across 42nd Street, the screen's foot over the
 *   stone drum and the street screens.
 *   https://commons.wikimedia.org/wiki/File:Chase_Bank_Times_Square_(August_2025).jpg
 * - e1 "Times Sq Sep 2021 65.jpg" and e2 "Times Sq Sep 2021 91.jpg",
 *   Epicgenius, CC BY-SA 4.0: the screen under the tower from below.
 *   https://commons.wikimedia.org/wiki/File:Times_Sq_Sep_2021_65.jpg
 *   https://commons.wikimedia.org/wiki/File:Times_Sq_Sep_2021_91.jpg
 * - t2 "Reuters, 3 Times Square.jpg", Eden, Janine and Jim, CC BY 2.0: the
 *   building at dusk.
 *   https://commons.wikimedia.org/wiki/File:Reuters,_3_Times_Square.jpg
 *
 * Doubts: no licensed photo shows the drum straight on from the south-east
 * by day, so the tier heights come from oblique views (e4) and are good to
 * a storey; c1 (2025) shows only the screen's foot, so whether the ledge
 * between the tiers is still there is not certain. The screen's ends are
 * where it meets the street faces of the building; the real screen runs
 * to about the same places.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

const frame = new Part(), blue = new Part(), orange = new Part(), white = new Part()

const R_HOST = 13.1 // OSM drum (way/1549214955)
const RB = R_HOST + 0.55 // screen back: the OSM arc bulges up to 0.33 m past its fitted circle
const RF = RB + 0.6 // screen face
const A0 = 92, A1 = 246 // screen arc, bearings clockwise
const Z0 = 12.0, ZT = 13.8, ZL0 = 21.6, ZL1 = 22.3, Z1 = 37.0
const SEG = 28

const rad = (d: number) => (d * Math.PI) / 180
/** A point at bearing b (degrees), radius r, height z. */
const at = (b: number, r: number, z: number): V3 => [r * Math.sin(rad(b)), r * Math.cos(rad(b)), z]
const radial = (b: number, s = 1): V3 => [s * Math.sin(rad(b)), s * Math.cos(rad(b)), 0]

/** A smooth cylindrical band, bearings b0..b1, facing out (s = 1) or in (s = -1). */
function band(p: Part, r: number, b0: number, b1: number, z0: number, z1: number, n: number, s = 1) {
  for (let i = 0; i < n; i++) {
    const c0 = b0 + ((b1 - b0) * i) / n, c1 = b0 + ((b1 - b0) * (i + 1)) / n
    const a = at(c0, r, z0), b = at(c1, r, z0), c = at(c1, r, z1), d = at(c0, r, z1)
    const N = [radial(c0, s), radial(c1, s), radial(c1, s), radial(c0, s)]
    p.tri(a, b, c, [0, 0], [0, 0], [0, 0], [N[0], N[1], N[2]])
    p.tri(a, c, d, [0, 0], [0, 0], [0, 0], [N[0], N[2], N[3]])
  }
}
/** A quad wound to face `want`. */
function qf(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}
/** A flat annulus sector at height z, facing up or down. */
function ring(p: Part, r0: number, r1: number, b0: number, b1: number, z: number, n: number, up: boolean) {
  for (let i = 0; i < n; i++) {
    const c0 = b0 + ((b1 - b0) * i) / n, c1 = b0 + ((b1 - b0) * (i + 1)) / n
    qf(p, at(c0, r0, z), at(c0, r1, z), at(c1, r1, z), at(c1, r0, z), [0, 0, up ? 1 : -1])
  }
}
/** A radial end face at bearing b, facing along the arc (+1 clockwise, -1 back). */
function end(p: Part, b: number, r0: number, r1: number, z0: number, z1: number, dir: number) {
  qf(p, at(b, r0, z0), at(b, r1, z0), at(b, r1, z1), at(b, r0, z1), [dir * Math.cos(rad(b)), -dir * Math.sin(rad(b)), 0])
}
/** A closed curved cabinet: face, back, top, bottom and ends. */
function cabinet(face: Part, r0: number, r1: number, b0: number, b1: number, z0: number, z1: number, n: number) {
  band(face, r1, b0, b1, z0, z1, n)
  band(frame, r0, b0, b1, z0, z1, n, -1)
  ring(frame, r0, r1, b0, b1, z1, n, true)
  ring(frame, r0, r1, b0, b1, z0, n, false)
  end(frame, b0, r0, r1, z0, z1, -1)
  end(frame, b1, r0, r1, z0, z1, 1)
}

// ------------------------------------------------------------ the big screen
const RL = RF + 0.1 // the lips stand 0.1 m proud of the face
band(white, RF, A0, A1, Z0 + 0.2, ZT, SEG) // ticker strip
band(orange, RF, A0, A1, ZT, ZL0, SEG) // lower tier
band(blue, RF, A0, A1, ZL1, Z1 - 0.25, SEG) // upper tier
band(frame, RB, A0, A1, Z0 - 0.1, Z1 + 0.3, SEG, -1) // the cabinet's back
// the ledge between the tiers, 0.3 m proud, with its floodlight shelf
band(frame, RF + 0.3, A0, A1, ZL0, ZL1, SEG)
ring(frame, RF, RF + 0.3, A0, A1, ZL0, SEG, false)
ring(frame, RF, RF + 0.3, A0, A1, ZL1, SEG, true)
// coping and foot lips
band(frame, RL, A0, A1, Z1 - 0.25, Z1 + 0.3, SEG)
ring(frame, RF, RL, A0, A1, Z1 - 0.25, SEG, false)
ring(frame, RB, RL, A0, A1, Z1 + 0.3, SEG, true)
band(frame, RL, A0, A1, Z0 - 0.1, Z0 + 0.2, SEG)
ring(frame, RF, RL, A0, A1, Z0 + 0.2, SEG, true)
ring(frame, RB, RL, A0, A1, Z0 - 0.1, SEG, false)
end(frame, A0, RB, RF + 0.3, Z0 - 0.1, Z1 + 0.3, -1)
end(frame, A1, RB, RF + 0.3, Z0 - 0.1, Z1 + 0.3, 1)

// ------------------------------------------------------------ the street screens and piers
// Seven screens over the shopfronts (c1), 0.4 m deep, with the drum's piers
// between them carried down to the pavement.
{
  const n = 7, gap = 3, b0 = 96, b1 = 242, rs0 = RB, rs1 = RB + 0.4
  const step = (b1 - b0) / n
  for (let i = 0; i < n; i++) cabinet(white, rs0, rs1, b0 + i * step + gap / 2, b0 + (i + 1) * step - gap / 2, 4.2, 6.4, 3)
  // a dark fascia band behind and round them
  cabinet(frame, rs0, rs0 + 0.2, b0 - 1, b1 + 1, 3.9, 6.7, 14)
  const half = (0.55 / RB) * (180 / Math.PI) / 2
  for (let i = 0; i <= n; i++) {
    const b = b0 + i * step
    cabinet(frame, rs0, rs0 + 0.3, b - half, b + half, 0, 3.9, 1)
  }
}

const parts = [
  { part: blue, material: finish('neon-3ts-blue', 0x3a5bd8) },
  { part: orange, material: finish('neon-3ts-orange', 0xe2793a) },
  { part: white, material: finish('neon-3ts-white', 0xf1f3f5) },
  { part: frame, material: finish('sign-frame', 0x4a4f57) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
let top = 0, low = Infinity
for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) { top = Math.max(top, part.pos[i]); low = Math.min(low, part.pos[i]) }
if (Math.abs(low) > 1e-6) throw new Error(`Lowest point must be 0: ${low}`)
const glb = writeGlb('3 Times Square Sign', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, height: top,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: [],
})
if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-3-times-square-sign.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${top.toFixed(1)} m, lowest ${low.toFixed(2)} m`)
