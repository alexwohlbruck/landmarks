/**
 * The U.S. Armed Forces Recruiting Station (Armed Forces Career Center),
 * Times Square, Manhattan: the stainless kiosk on the traffic island
 * between Broadway and Seventh Avenue at West 43rd Street (Architecture
 * Research Office, 1999). Procedural, CC0-1.0.
 *   bun generators/nyc-times-square-recruiting-station.ts
 *
 * What makes it itself: a small stainless box whose two long sides are
 * each one big American flag of lit tubes (since about 2018 LED bars), red
 * and white stripes with the blue field and white stars at the viewer's
 * upper left on each side; the south end is a stainless louvre screen
 * carrying the four service seals; the north end is the glazed door with
 * a video screen above it. Lit at night, the flags are the brightest thing
 * on the island.
 *
 * Correction to the brief: only the two long faces carry the flag. The
 * south end is the louvre screen with the seals and the "U.S. ARMED
 * FORCES RECRUITING STATION" letters; the north end is the entrance and a
 * screen (photos n2, n3, n4, n6 below).
 *
 * Map frame: x east, y north, z up, metres, built in the turned frame:
 * +y runs along the kiosk's long axis, bearing 22.7 (OSM way/258646144,
 * the outline's long sides). The origin is that outline's centroid
 * (-73.9862031, 40.756838); in this frame the outline is x +-1.785,
 * y +-5.86. y = 0 is the island's sidewalk; the map sets the model on its
 * terrain, so it is left at 0.
 *
 * Measured / published:
 * - Footprint length 11.7 m (OSM; lidar 11.2 m).
 * - Height: OSM height=5.5; USGS lidar (NY CMPG 2017, 0.5 m grid) puts the
 *   parapet 5.4-5.7 m over the sidewalk and the main roof about 5.1 m; a
 *   rooftop louvred plant box rises to about 7.2 m over the south half
 *   (lidar y -6.5..-3, x -1..1.5), and shows in r1, r4, n4, n7.
 * - Width: OSM draws the box 3.57 m wide, but the south screen in r1, n4
 *   and n7 is nearly as wide as it is tall (0.93 in r1), and the lidar
 *   returns are 3.5-5.2 m across with the flag cabinets. Drawn 4.6 m wide,
 *   the flag cabinets included, so the model still covers the OSM outline.
 * Estimated from the photos (r2, frontal; r3, r4, r5 oblique):
 * - the flag from 1.0 to 5.15 m, 10.8 m long (r2: 2.33:1; it runs nearly
 *   end to end), in four panels between stainless mullions; 13 stripes,
 *   the blue field seven stripes deep and 41% of the length; 50 stars in 9 rows of 6 and 5. The field is
 *   at the south end of the east face (r2, r3, r4, r5, all from the east
 *   or south-east) and the north end of the west face (w2, w3, from 7th
 *   Avenue), so it reads at the upper left from either side;
 * - a stainless base 1.0 m tall under the flag, and a stainless cornice;
 * - the south screen rising 0.35 m over the parapet (n4), four seals 0.78 m
 *   across at 3.55 m (r1, n2), its louvres drawn as four plain panels with
 *   seams (they would shimmer as lines);
 * - the north end: a glazed door and window 0.1-2.6 m (n3, r6) and a video
 *   screen 2.75-5.15 m (n3, n6).
 * Invented/left out: the lettering on the south screen (not a famous sign;
 * it would not read), the seals' artwork (gold discs), the Medal of Honor
 * plaque, the camera poles. The flag's stripes are drawn as separate bars
 * with a thin gap, as the tubes read, not as one panel.
 *
 * Night: the stripes and field are `neon-flag-red`, `neon-flag-white` and
 * `neon-flag-blue` (night photo r3: the flag glows red, white and blue on
 * a dark stainless box), the north screen is `neon-flag-white`, and the
 * entrance glazing is `entrance`, lit from inside at night (n3, n6). The
 * south screen and its seals face the square and are floodlit in r3, so
 * their south-facing surfaces carry `_FLOODLIGHT`.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - r1 "Recruiting station on Times Square.jpg", Ypsilon from Finland, CC0:
 *   the south screen at dusk, the rooftop box.
 *   https://commons.wikimedia.org/wiki/File:Recruiting_station_on_Times_Square.jpg
 * - r2 "US Armed Forces Recruiting Station Times Square (41284420372).jpg",
 *   Nan Palmero, CC BY 2.0: a long side square on, at night; the flag.
 *   https://commons.wikimedia.org/wiki/File:US_Armed_Forces_Recruiting_Station_Times_Square_(41284420372).jpg
 * - r3 "US Armed Forces Recruiting Station Times Square (41326363841).jpg",
 *   Nan Palmero, CC BY 2.0: south-east at night.
 *   https://commons.wikimedia.org/wiki/File:US_Armed_Forces_Recruiting_Station_Times_Square_(41326363841).jpg
 * - r4 "U.S. Armed Forces Recruiting Station - Times Square.jpg",
 *   PumpkinSky, CC BY-SA 3.0: south-east by day.
 *   https://commons.wikimedia.org/wiki/File:U.S._Armed_Forces_Recruiting_Station_-_Times_Square.jpg
 * - r5 "Times Square US Army Recruiting Station (New York) (43427509240).jpg",
 *   VillageHero, CC BY-SA 2.0: south-east by day.
 *   https://commons.wikimedia.org/wiki/File:Times_Square_US_Army_Recruiting_Station_(New_York)_(43427509240).jpg
 * - r6 "Times Square, "Military Island" recruiting center after "small
 *   explosion" in March 2008.jpg", Matt Sanchez, CC BY-SA 3.0: the door.
 *   https://commons.wikimedia.org/wiki/File:Times_Square,_%22Military_Island%22_recruiting_center_after_%22small_explosion%22_in_March_2008.jpg
 * - n1 "2024-06-17 10 13 20 View north-northeast from the intersection of
 *   7th Avenue and 43rd Street ...jpg", Famartin, CC BY-SA 4.0: from the
 *   south, far.
 * - n2 "New York Us armed forces recruitment station.jpg", Aviation
 *   poseidon, CC BY-SA 4.0: the south screen and seals, close.
 * - n3 "Usforces.jpg", Andrevruas, CC BY-SA 3.0: the north end at night.
 * - n4 "New York City am 20.4.2014 8.jpg", Christian Alexander Tietgen,
 *   CC BY 4.0: the south screen and its top.
 * - n6 "New York City (52766724129).jpg", Chad Davis, CC BY 2.0: the north
 *   end at night.
 * - n7 "New York City Times Square 01.jpg", Norbert Nagel, CC BY-SA 3.0:
 *   from the south.
 * - w2 "Neon American Flag (6279257769).jpg", Erik Drost, CC BY 2.0: the
 *   west face square on (the neon tubes, 2011).
 * - w3 "Times Sq Apr 2017 30.jpg", Epicgenius, CC BY-SA 4.0: the west face
 *   across 7th Avenue.
 *
 * Doubts: the width (OSM 3.57 m against ~4.6 m from photos and lidar); the
 * lidar outline sits about 2 m south of OSM's and turns ~4 degrees more,
 * the model follows OSM. No licensed photo shows the roof; the plant box's
 * plan is from lidar only. The flag's content is sometimes video over the
 * stripes (r2); drawn as the flag.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish, PALETTE } from './palette'

const red = new Part(), white = new Part(), blue = new Part(), steel = new Part(), door = new Part(), gold = new Part()

/** An axis-aligned box. */
function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, bottom = true) {
  const r = (z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  p.loft([r(z0), r(z1)])
  p.cap(r(z1), true)
  if (bottom) p.cap(r(z0), false)
}
/** A box with its four vertical edges chamfered by c, so they catch a highlight. */
function bevelBox(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, c: number) {
  const r = (z: number): V3[] => [
    [x0 + c, y0, z], [x1 - c, y0, z], [x1, y0 + c, z], [x1, y1 - c, z],
    [x1 - c, y1, z], [x0 + c, y1, z], [x0, y1 - c, z], [x0, y0 + c, z],
  ]
  p.loft([r(z0), r(z1)])
  p.cap(r(z1), true)
}
/** A flat polygon facing +x or -x (sx = +1/-1) at x, from (y, z) points listed counter-clockwise seen from +x. */
function flatX(p: Part, x: number, sx: number, pts: [number, number][]) {
  const ring = pts.map(([y, z]) => [x, y, z] as V3)
  const r = sx > 0 ? ring : [...ring].reverse()
  for (let i = 1; i < r.length - 1; i++) p.tri(r[0], r[i], r[i + 1])
}
/** A flat polygon facing -y or +y (sy) at y, from (x, z) points counter-clockwise seen from -y. */
function flatY(p: Part, y: number, sy: number, pts: [number, number][]) {
  const ring = pts.map(([x, z]) => [x, y, z] as V3)
  const r = sy < 0 ? ring : [...ring].reverse()
  for (let i = 1; i < r.length - 1; i++) p.tri(r[0], r[i], r[i + 1])
}

// ------------------------------------------------------------ body
const W = 2.3 // half-width, flag cabinets included
const LY = 5.86 // half-length (OSM)
const TOP = 5.45 // parapet
bevelBox(steel, -W, -LY, 0, W, LY, TOP, 0.12)
// cornice band, a little proud of the walls
bevelBox(steel, -W - 0.06, -LY - 0.06, TOP - 0.32, W + 0.06, LY + 0.06, TOP, 0.14)
// rooftop louvred plant box over the south half (lidar)
bevelBox(steel, -0.85, -4.9, TOP - 0.1, 0.95, -1.4, 7.1, 0.12)

// ------------------------------------------------------------ the flags
const FY0 = -5.4, FY1 = 5.4 // flag ends (south, north)
const FZ0 = 1.0, FZ1 = 5.15
const PITCH = (FZ1 - FZ0) / 13
const BAR = PITCH * 0.84 // a thin dark-ish gap between the tubes
const CW = 0.41 * (FY1 - FY0) // the blue field's length
const PROUD = 0.12
for (const sx of [1, -1]) {
  const bx = (p: Part, y0: number, z0: number, y1: number, z1: number, d = PROUD) => {
    const xa = sx * W, xo = sx * (W + d)
    box(p, Math.min(xa, xo), y0, z0, Math.max(xa, xo), y1, z1)
  }
  // the field sits at the viewer's upper left on both sides: the south end
  // on the east face, the north end on the west face (w2, w3 from 7th Ave)
  const [c0, c1] = sx > 0 ? [FY0, FY0 + CW] : [FY1 - CW, FY1]
  const [s0, s1] = sx > 0 ? [FY0 + CW, FY1] : [FY0, FY1 - CW]
  for (let i = 0; i < 13; i++) {
    const zt = FZ1 - i * PITCH - (PITCH - BAR) / 2, zb = zt - BAR
    const stripe = i % 2 === 0 ? red : white
    if (i < 7) {
      bx(blue, c0, zb, c1, zt)
      bx(stripe, s0, zb, s1, zt)
    } else bx(stripe, FY0, zb, FY1, zt)
  }
  // 50 stars on the field, in nine rows of six and five
  const ch = 7 * PITCH, cw = CW
  const R = 0.12, r = R * 0.42, xs = sx * (W + PROUD + 0.012)
  for (let row = 0; row < 9; row++) {
    const z = FZ1 - ((row + 1) * ch) / 10
    const n = row % 2 === 0 ? 6 : 5
    for (let j = 0; j < n; j++) {
      const y = c0 + ((row % 2 === 0 ? 2 * j + 1 : 2 * j + 2) * cw) / 12
      const pts: [number, number][] = []
      for (let k = 0; k < 10; k++) {
        const a = Math.PI / 2 + (k * Math.PI) / 5, rr = k % 2 === 0 ? R : r
        pts.push([y + Math.cos(a) * rr, z + Math.sin(a) * rr])
      }
      // a fan from the centre, so the concave star triangulates cleanly
      for (let k = 0; k < 10; k++) flatX(white, xs, sx, [[y, z], pts[k], pts[(k + 1) % 10]])
    }
  }
  // stainless frame: rails top and bottom, mullions between four panels, end posts
  const FD = PROUD + 0.06
  bx(steel, FY0 - 0.12, FZ1, FY1 + 0.12, FZ1 + 0.1, FD)
  bx(steel, FY0 - 0.12, FZ0 - 0.1, FY1 + 0.12, FZ0, FD)
  for (let k = 0; k <= 4; k++) {
    const y = FY0 + (k * (FY1 - FY0)) / 4
    bx(steel, y - 0.06, FZ0 - 0.1, y + 0.06, FZ1 + 0.1, FD)
  }
}

// ------------------------------------------------------------ south screen
{
  const y = -LY - 0.08
  // the louvre screen as four panels, standing a little proud and above the parapet
  box(steel, -W - 0.04, y, 0, W + 0.04, -LY, TOP + 0.35)
  for (let k = 1; k < 4; k++) {
    const x = -W + (k * 2 * W) / 4
    box(steel, x - 0.04, y - 0.05, 0.15, x + 0.04, y, TOP + 0.3)
  }
  // the four seals: gold discs
  const R = 0.39, zc = 3.55, ys = y - 0.1
  for (let s = 0; s < 4; s++) {
    const xc = (s - 1.5) * 0.98
    const ring: V3[] = []
    for (let k = 0; k < 16; k++) {
      const a = (k / 16) * 2 * Math.PI
      ring.push([xc + R * Math.cos(a), ys, zc + R * Math.sin(a)])
    }
    // face (toward -y) and a short rim back to the screen
    for (let k = 1; k < 15; k++) gold.tri(ring[0], ring[k], ring[k + 1])
    const back = ring.map(([x, , z]) => [x, y, z] as V3)
    for (let k = 0; k < 16; k++) {
      const l = (k + 1) % 16
      gold.quad(back[k], back[l], ring[l], ring[k])
    }
  }
}

// ------------------------------------------------------------ north end
{
  const y = LY + 0.04
  // the glazed door and window, set in a stainless frame
  flatY(door, y, 1, [[-W + 0.25, 0.1], [W - 0.25, 0.1], [W - 0.25, 2.6], [-W + 0.25, 2.6]])
  box(steel, -W, LY, 2.6, W, LY + 0.1, 2.75)
  box(steel, -0.05, LY, 0.1, 0.05, LY + 0.1, 2.6)
  // the video screen above
  box(white, -W + 0.2, LY, 2.85, W - 0.2, LY + 0.14, 5.05)
}

const parts = [
  { part: red, material: finish('neon-flag-red', 0xd9473f) },
  { part: white, material: finish('neon-flag-white', 0xf1ede6) },
  { part: blue, material: finish('neon-flag-blue', 0x4a68c4) },
  // the south screen and its seals are floodlit at night (r3); the rest of the box is dark
  { part: steel, material: { ...finish('stainless', 0xb4b8bb), floodlight: (p: V3, n: V3) => (n[1] < -0.5 && p[1] < -LY + 0.01 ? 0.6 : 0) } },
  { part: door, material: PALETTE.entrance },
  { part: gold, material: { ...finish('seal-gold', 0xc9a65c), floodlight: (_p: V3, n: V3) => (n[1] < -0.5 ? 0.7 : 0) } },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
let top = 0
for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) top = Math.max(top, part.pos[i])
const glb = writeGlb('Times Square Recruiting Station', parts, {
  license: 'CC0-1.0', bearing: 22.7, elevation: 0, height: top,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/258646144'],
})
if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-times-square-recruiting-station.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${top.toFixed(1)} m`)
