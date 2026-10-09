/**
 * SlotZilla (2014), the zip-line launch tower at the east end of the
 * Fremont Street Experience: a steel frame tower whose west face, looking
 * down Fremont Street under the canopy, is dressed as a giant slot machine,
 * with a showgirl on each side. Procedural, CC0-1.0.
 * bun generators/lv-slotzilla.ts
 *
 * Famous-sign exception (STYLE.md): the slot machine is the landmark, so
 * its marquee carries SLOTZILLA as extruded block letters, and the coins,
 * reels, lever and the two showgirls are kept as bold flat masses.
 *
 * Map frame: x east, y north, z up, metres, built turned: the model's +y is
 * the street's axis towards Las Vegas Boulevard, so the placement bearing of
 * 118° (Fremont Street's axis, from the canopy outline way/1428180251) turns
 * the slot face (-y) to look west-north-west down the street. The origin is
 * the area centroid of OSM way/1093169256.
 *
 * Measured, from OSM way/1093169256 ("Slotzilla launch tower",
 * man_made=tower): 11.9 m across the street and 17.5 m along it, the back
 * end split into two legs round a 6.2 × 3.9 m notch.
 *
 * Published (Fremont Street Experience fact sheet; Las Vegas
 * Review-Journal, 2014): 128 ft (39 m) and 12 storeys, "the world's
 * largest slot machine"; the Zipline launches from 77 ft (23.5 m), the
 * Zoomline from 114 ft (34.7 m).
 *
 * Proportions measured from photos, scaled to the published 39 m: the
 * navy base 17 m with its walk-through portal, the chrome coin tray to the
 * lower deck at 23.5 m, the red SLOTZILLA marquee, the white reel band with
 * three reels, the red top round the upper deck at 34.7 m, the beacon; the
 * showgirls about 10 m tall beside the tray; the blue lever ball on the
 * south side at reel height.
 *
 * Photos:
 * - kl2 "Slotzilla (Beginning of Zip-Line), Las Vegas, Nevada", Ken Lund,
 *   CC BY-SA 2.0, flickr.com/photos/75683070@N00/15278934258: the slot
 *   face square on from the west, by day;
 * - kl1, the same set (…/15278926868): the steel frame from the east;
 * - daryl1 "Slotzilla 1", daryl_mitchell, CC BY-SA 2.0,
 *   flickr.com/photos/49169223@N00/24156642311: the slot face from the
 *   west-north-west, raised, by day, the source of the band heights;
 * - galy "Slotzilla, Vegas", Sergiy Galyonkin, CC BY-SA 2.0,
 *   flickr.com/photos/22974618@N00/54340834257: the tray and coins;
 * - fam1 "2015-11-04 11 29 30 View northwest along Fremont Street at the
 *   southeast end of the Fremont Street Experience…", Famartin, CC BY-SA
 *   4.0 (Commons): the east side, a grey steel frame with orange boxes;
 * - "Slotzilla at the Fremont Street Experience" 1 and 2, Julian Lupyan,
 *   CC0 (Commons): the face at night.
 *
 * Estimated: the depth of the slot cabinet (7 m of the 17.5 m; the rest is
 * the open frame), the tray's slope, the frame's beam levels, the
 * showgirls' outline, all colours (pulled to the palette's lightness).
 * Left out: the palm tree, dice and flamingo sculptures on the base, the
 * video screens, the signs on the east face, the zip lines, the bridge.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, save, type XY } from './lv-wynn'
import { extrude, planeAt, triTo } from './lv-mgm-grand'

const navy = new Part()
const white = new Part()
const red = new Part()
const gold = new Part()
const steel = new Part()
const glass = new Part()

// ------------------------------------------------------------------ plan

const W = 5.94 // half the width across the street: the base and the frame
const CW = 4.7 // half the slot cabinet's width; the showgirls stand on the base beside it
const FRONT = -7.8 // the slot face
const BACK = 9.6
const CAB = -1.0 // where the slot cabinet ends and the bare frame begins
const TOP = 38.2 // roof of the cabinet and frame
const BASE = 17 // top of the navy base
const DECK = 23.5 // the Zipline deck, 77 ft

const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

// The front plane: profile x runs east (+x), profile z up, w comes out of
// the slot face towards the street (−y).
const PF = planeAt([0, FRONT], 90)
/** A flat profile on the face, standing from w0 to w1 off it. */
const onFace = (p: Part, prof: XY[], w0: number, w1: number) => extrude(PF, prof, w0, w1, () => p, p)

// ------------------------------------------------------------------ the base

// The navy base, 17 m, with the walk-through portal. Drawn as a U profile
// on the face and pushed back through the cabinet's depth.
{
  const PB = planeAt([0, CAB], 90)
  const prof: XY[] = [[-W, 0], [-2.9, 0], [-2.9, 6], [2.9, 6], [2.9, 0], [W, 0], [W, BASE], [-W, BASE]]
  extrude(PB, prof, 0, CAB - FRONT, () => navy, navy)
  // The portal's ceiling and the rim round it in white.
  onFace(white, [[-3.4, 0], [-2.9, 0], [-2.9, 6], [2.9, 6], [2.9, 0], [3.4, 0], [3.4, 6.5], [-3.4, 6.5]], 0, 0.15)
}

// ------------------------------------------------------------------ the coin tray

// Side profile in (y, z): a chrome lip bulging out of the face, the coin
// slope rising back to the lower deck at 23.5 m.
const TRAY: XY[] = [[FRONT, BASE], [FRONT - 1.2, BASE + 0.3], [FRONT - 1.9, BASE + 1.0], [FRONT - 2.0, BASE + 1.8], [FRONT - 0.2, DECK], [FRONT, DECK]]
{
  const PS = planeAt([0, 0], 0) // profile x runs north (+y), w east (+x)
  // extrude() turns the ring counter-clockwise; find the slope's edge after that.
  const area = TRAY.reduce((a, p, i) => a + p[0] * TRAY[(i + 1) % TRAY.length][1] - TRAY[(i + 1) % TRAY.length][0] * p[1], 0)
  const slope = area > 0 ? 3 : TRAY.length - 1 - 4
  extrude(PS, TRAY, -CW, CW, (i) => (i === slope ? red : white), white)
}
// Coins lying on the slope: gold discs, a few overlapping as in the photos.
{
  const a: XY = TRAY[3], b: XY = TRAY[4]
  const ty = b[0] - a[0], tz = b[1] - a[1], tl = Math.hypot(ty, tz)
  const t: V3 = [0, ty / tl, tz / tl] // up the slope
  const n: V3 = [0, -tz / tl, ty / tl] // out of the slope
  const disc = (s: number, x: number, r: number, h: number) => {
    const c: V3 = [x, a[0] + t[1] * s + n[1] * h, a[1] + t[2] * s + n[2] * h]
    const seg = 12, rim: V3[] = [], top: V3[] = []
    for (let k = 0; k < seg; k++) {
      const ang = (k / seg) * Math.PI * 2, cu = Math.cos(ang) * r, sv = Math.sin(ang) * r
      const p: V3 = [c[0] + cu, c[1] + t[1] * sv, c[2] + t[2] * sv]
      rim.push(p)
      top.push([p[0] + n[0] * 0.35, p[1] + n[1] * 0.35, p[2] + n[2] * 0.35])
    }
    const ctop: V3 = [c[0] + n[0] * 0.35, c[1] + n[1] * 0.35, c[2] + n[2] * 0.35]
    for (let k = 0; k < seg; k++) {
      const l = (k + 1) % seg
      triTo(gold, ctop, top[k], top[l], n)
      const mid: V3 = [(rim[k][0] + rim[l][0]) / 2 - c[0], (rim[k][1] + rim[l][1]) / 2 - c[1], (rim[k][2] + rim[l][2]) / 2 - c[2]]
      triTo(gold, rim[k], rim[l], top[l], mid)
      triTo(gold, rim[k], top[l], top[k], mid)
    }
  }
  // [distance up the slope, x, radius, lift]
  const COINS: [number, number, number, number][] = [
    [1.0, -3.0, 0.9, 0], [0.9, -0.6, 1.0, 0], [1.1, 1.5, 0.9, 0], [0.9, 3.5, 0.8, 0],
    [2.6, -3.6, 0.75, 0], [2.7, -1.7, 0.85, 0.1], [2.5, 0.5, 0.85, 0.2], [2.8, 3.1, 0.8, 0],
    [4.1, -2.8, 0.7, 0], [4.2, -0.8, 0.75, 0], [4.1, 1.7, 0.7, 0.1], [4.2, 3.4, 0.65, 0],
  ]
  for (const [s, x, r, h] of COINS) disc(s, x, r, h)
}

// ------------------------------------------------------------------ the cabinet

// Bands up the slot face, [z0, z1, part]: the lower deck, the marquee, the
// reels, the upper deck, the cap. Each is a box from the face back to CAB.
const BANDS: [number, number, Part][] = [
  [DECK, 26.1, white], // the lower (Zipline) deck, framed in white
  [26.1, 29.6, red], // the SLOTZILLA marquee
  [29.6, 32.6, white], // the reel band
  [32.6, 37.6, red], // round the upper (Zoomline) deck
  [37.6, TOP, white], // the cap
]
for (const [z0, z1, p] of BANDS) prism(p, p, rect(-CW, CW, FRONT, CAB), z0, z1, z1 === TOP ? 0.35 : 0, 0.3)

// The decks: dark openings set into the face.
onFace(glass, rect(-CW + 0.6, CW - 0.6, DECK + 0.1, 25.7), -0.05, 0.02)
onFace(glass, rect(-CW + 0.6, CW - 0.6, 34.3, 36.4), -0.05, 0.02)
// The three reels, red faces in white frames.
for (const cx of [-2.9, 0, 2.9]) onFace(red, rect(cx - 1.15, cx + 1.15, 30.0, 32.2), 0, 0.12)
// White rules under and over the marquee, standing proud like the real trim.
onFace(white, rect(-CW, CW, 26.1, 26.45), 0, 0.2)
onFace(white, rect(-CW, CW, 29.25, 29.6), 0, 0.2)
// The beacon on the roof.
{
  const seg = 12, ring = (r: number, z: number): V3[] => Array.from({ length: seg }, (_, k) => [Math.cos((k / seg) * 2 * Math.PI) * r, FRONT + 2.2 + Math.sin((k / seg) * 2 * Math.PI) * r, z] as V3)
  const rings = [ring(0.8, TOP), ring(0.8, TOP + 0.5), ring(0.6, TOP + 0.9)]
  red.loft(rings)
  red.cap(rings[2], true)
}

// ------------------------------------------------------------------ SLOTZILLA

/** Block capitals as strokes on a 0.6 × 1 grid. */
const GLYPHS: Record<string, number[][]> = {
  S: [[0.6, 1, 0, 1], [0, 1, 0, 0.5], [0, 0.5, 0.6, 0.5], [0.6, 0.5, 0.6, 0], [0.6, 0, 0, 0]],
  L: [[0, 1, 0, 0], [0, 0, 0.6, 0]],
  O: [[0, 0, 0, 1], [0, 1, 0.6, 1], [0.6, 1, 0.6, 0], [0.6, 0, 0, 0]],
  T: [[0, 1, 0.6, 1], [0.3, 1, 0.3, 0]],
  Z: [[0, 1, 0.6, 1], [0.6, 1, 0, 0], [0, 0, 0.6, 0]],
  I: [[0.3, 0, 0.3, 1]],
  A: [[0, 0, 0.3, 1], [0.3, 1, 0.6, 0], [0.13, 0.38, 0.47, 0.38]],
}
function stroke(p: Part, x0: number, z0: number, x1: number, z1: number, t: number, w0: number, w1: number) {
  const L = Math.hypot(x1 - x0, z1 - z0) || 1
  const ux = (x1 - x0) / L, uz = (z1 - z0) / L, nx = -uz * (t / 2), nz = ux * (t / 2), ex = ux * (t / 2), ez = uz * (t / 2)
  onFace(p, [[x0 - ex + nx, z0 - ez + nz], [x0 - ex - nx, z0 - ez - nz], [x1 + ex - nx, z1 + ez - nz], [x1 + ex + nx, z1 + ez + nz]], w0, w1)
}
{
  const str = 'SLOTZILLA', h = 2.2, sx = 0.55, step = h * 0.48, z = 26.75
  let x = -(step * (str.length - 1) + 0.6 * sx * h) / 2
  for (const ch of str) {
    for (const [a, b, c, d] of GLYPHS[ch]) stroke(gold, x + a * sx * h, z + b * h, x + c * sx * h, z + d * h, 0.34, 0, 0.18)
    x += step
  }
}

// ------------------------------------------------------------------ the lever

// On the south side of the cabinet (+x), the blue ball up at the reels.
{
  const LX = CW + 0.7, LY = FRONT + 3.5
  prism(white, white, rect(CW, LX + 0.25, LY - 0.25, LY + 0.25), 24.5, 25.2, 0, 0)
  prism(white, white, rect(LX - 0.25, LX + 0.25, LY - 0.25, LY + 0.25), 25.2, 32.6, 0, 0)
  // The ball, a 12-sided lathe.
  const seg = 12, R = 1.0, cz = 33.4
  const rings: V3[][] = []
  for (let i = 1; i < 6; i++) {
    const a = -Math.PI / 2 + (i / 6) * Math.PI, r = Math.cos(a) * R, z = cz + Math.sin(a) * R
    rings.push(Array.from({ length: seg }, (_, k) => [LX + Math.cos((k / seg) * 2 * Math.PI) * r, LY + Math.sin((k / seg) * 2 * Math.PI) * r, z] as V3))
  }
  navy.loft(rings)
  const bot: V3 = [LX, LY, cz - R], top: V3 = [LX, LY, cz + R]
  for (let k = 0; k < seg; k++) {
    const l = (k + 1) % seg
    navy.tri(bot, rings[0][l], rings[0][k])
    navy.tri(top, rings[4][k], rings[4][l])
  }
}

// ------------------------------------------------------------------ the showgirls

/**
 * A showgirl as flat masses on a plane beside the tray, facing the street:
 * the feather headdress, the body, the standing leg, the leg kicked up
 * towards the machine, the arm thrown up and out. `s` = −1 for the north
 * girl (left as you face the machine), +1 for the south one; profile x
 * runs away from the machine.
 */
function showgirl(s: number) {
  const x0 = s * (CW + 0.35), z0 = BASE
  const K = 1.0
  const P = (pts: XY[]): XY[] => pts.map(([x, z]) => [x0 + s * x * K, z0 + z * K])
  const flat = (p: Part, pts: XY[], d = 0.25) => onFace(p, s < 0 ? P(pts).reverse() : P(pts), 1.2 - d, 1.2 + d)
  // Headdress: a fan of plumes spreading up from the head.
  flat(red, [[0.45, 7.9], [-0.9, 10.2], [-0.8, 11.2], [-0.1, 11.8], [0.9, 11.9], [1.8, 11.3], [2.0, 10.3], [0.75, 7.9]], 0.2)
  // Head, then the costume: bodice and hips.
  flat(white, [[0.2, 7.4], [0.8, 7.4], [0.8, 8.2], [0.2, 8.2]])
  flat(red, [[0.0, 4.4], [1.05, 4.4], [1.0, 5.3], [0.8, 5.9], [1.0, 6.6], [0.95, 7.45], [0.05, 7.45], [0.0, 6.6], [0.2, 5.9], [0.05, 5.3]])
  // The arm thrown up and outwards.
  flat(white, [[0.75, 7.0], [1.1, 7.25], [2.3, 9.0], [1.95, 9.25], [0.8, 7.6]], 0.2)
  // The standing leg.
  flat(white, [[0.35, 0], [0.85, 0], [1.0, 4.5], [0.25, 4.5]])
  // The kicked leg: thigh up towards the machine to the knee, shin down.
  flat(white, [[0.0, 4.4], [0.6, 4.8], [-1.2, 6.3], [-1.6, 5.8]])
  flat(white, [[-1.65, 6.05], [-1.15, 6.2], [-0.75, 3.7], [-1.2, 3.55]])
}
showgirl(-1)
showgirl(1)

// ------------------------------------------------------------------ the frame

// Behind the cabinet the tower is bare steel: a dark core, corner columns,
// a beam round every deck level, orange equipment boxes on the east face.
const FRAME: XY[] = [[-W, CAB], [W, CAB], [W, BACK], [3.1, BACK], [3.1, 5.7], [-3.1, 5.7], [-3.1, BACK], [-W, BACK]]
const CORE: XY[] = [[-W + 0.6, CAB], [W - 0.6, CAB], [W - 0.6, BACK - 0.6], [3.7, BACK - 0.6], [3.7, 5.1], [-3.7, 5.1], [-3.7, BACK - 0.6], [-W + 0.6, BACK - 0.6]]
prism(glass, steel, CORE, 0, TOP - 0.3, 0, 0)
for (const [x, y] of [[-W, CAB], [W, CAB], [W, BACK], [3.1, BACK], [-3.1, BACK], [-W, BACK], [3.1, 5.7], [-3.1, 5.7]] as XY[]) {
  const cx = x - Math.sign(x) * 0.5, cy = y === CAB ? y + 0.5 : y === BACK ? y - 0.5 : y + 0.5
  prism(steel, steel, rect(cx - 0.5, cx + 0.5, cy - 0.5, cy + 0.5), 0, TOP, 0.2, 0.15)
}
for (const z of [8.5, BASE, DECK, 30]) prism(steel, steel, FRAME, z - 0.9, z, 0.15, 0.2)
prism(steel, steel, FRAME, TOP - 0.9, TOP, 0.3, 0.2)
// Orange boxes, two per leg on the east face at five levels.
for (const z of [9, 16, 20, 26, 33]) {
  for (const cx of [-4.5, 4.5]) prism(red, red, rect(cx - 1.0, cx + 1.0, BACK, BACK + 0.5), z, z + 2.4, 0, 0.1)
}

await save('lv-slotzilla', 'SlotZilla', [
  { part: navy, material: finish('slot-navy', 0x3e4f86) },
  { part: white, material: PALETTE.trim },
  { part: red, material: finish('slot-red', 0xbe4b4e) },
  { part: gold, material: finish('slot-gold', 0xdcb352) },
  { part: steel, material: finish('slot-steel', 0xb8bdc1) },
  { part: glass, material: finish('slot-shadow', 0x606870) },
], TOP + 0.9, 'Y up, -Z north, +X east, metres; origin at the centroid of way/1093169256; the slot face looks -Y before the bearing', 5000)
