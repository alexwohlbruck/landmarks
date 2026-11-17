/**
 * Truist Plaza (303 Peachtree Street, built as SunTrust Plaza), Atlanta
 * (1992, John Portman & Associates) — original procedural geometry, CC0-1.0.
 * bun generators/atl-truist-plaza.ts
 *
 * Uses the B2 kit exported from generators/atl-westin-peachtree-plaza.ts.
 *
 * Map frame: x east, y north, z up, metres, turned to the placement's
 * bearing (1°: OSM's edges run at 1° and 91°). Anchor = centroid of the
 * tower outline OSM way/41390676 ("Truist Plaza Building", building=office,
 * height 265, 46 levels in OSM), 33.762699, -84.386554. The plan is
 * four-fold symmetric about the anchor, so it is drawn once for the north
 * face and turned through 90° steps.
 *
 * Identity: a square granite shaft whose corners stand up as four square
 * pavilions with open white-framed tops; between them each face carries a
 * central buttress that steps down outward in big notches (the white
 * ledges seen in every photo); over the middle a dark glass crown rises as
 * a stepped pyramid, each tier with raised corners, to a small white drum
 * and mast. The crown and corner piers are floodlit at night.
 *
 * Evidence:
 *  - plan: OSM way/41390676 (the outline, with the corner notches, the
 *    51 m bays and the low arms out to ±40 m), and its 114 building:part
 *    ways (all inside the outline; replaced).
 *  - heights: USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 1 m grid
 *    centred on the anchor, above ground_min 311.3 m, which is the street
 *    on the east (Peachtree Center Ave side) and matches Mapterhorn's low
 *    point under the footprint (311.4 m). Measured: drum top 262–263, crown
 *    tiers 257 (±4.5 m), 245 (±8), 233/237 (±14, corners higher), 221/225
 *    (±17, corners higher); corner pavilions 217 rim, 213 inside the rim;
 *    shaft roof 209; face buttress steps 193, 173, 142, 86; side bays 114;
 *    small bays 51; low arms 16. Published: 265 m to the top, 60 floors
 *    (Wikipedia). The mast above the drum (to 266) is an estimate from
 *    Luyken's photo.
 *  - ground: Mapterhorn falls about 6 m from the west side to the east;
 *    y = 0 is the east street; elevation 0.
 *  - colour: mid-dark warm grey granite (#75767a) with dark slate windows
 *    (#4b5864) in broad grouped panels, so the tower reads as the dark
 *    building it is in Carey, Luyken and Organicabq; the crown's dark blue-grey glass (Luyken,
 *    Carey), white frames on the pavilion tops and the drum.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Suntrust-plaza-atlanta.jpg, Connor.carey, CC BY-SA 3.0 (aerial from
 *    the south, the whole crown)
 *    https://commons.wikimedia.org/wiki/File:Suntrust-plaza-atlanta.jpg
 *  - 2013.01.26.112743 SunTrust Plaza Atlanta Georgia.jpg, Hermann Luyken,
 *    CC0 (the crown tiers and corner pavilions)
 *    https://commons.wikimedia.org/wiki/File:2013.01.26.112743_SunTrust_Plaza_Atlanta_Georgia.jpg
 *  - 2013.01.26.112538 Sun Trust Plaza Atlanta Georgia.jpg, Hermann Luyken, CC0
 *    https://commons.wikimedia.org/wiki/File:2013.01.26.112538_Sun_Trust_Plaza_Atlanta_Georgia.jpg
 *  - SunTrustHDQ.jpg, Organicabq, public domain (a full face from the
 *    street, the stepped buttress ledges)
 *    https://commons.wikimedia.org/wiki/File:SunTrustHDQ.jpg
 *  - Truist Plaza.jpg, Tyler Lahti, CC BY-SA 4.0 (the base and granite colour)
 *    https://commons.wikimedia.org/wiki/File:Truist_Plaza.jpg
 *  - Truist Plaza Atlanta (cropped).jpg, Ckerr78, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Truist_Plaza_Atlanta_(cropped).jpg
 *  - SunTrust Plaza, Atlanta.JPG, Michael Rivera, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:SunTrust_Plaza,_Atlanta.JPG
 * No look-only sources, no night photo (the night look follows the
 * published description of the floodlit crown). No commercial imagery.
 *
 * Night: the glass crown is `neon-truist-crown` (it glows in its own
 * blue-grey), and the corner pavilions, their white frames and the top of
 * the granite carry `_FLOODLIGHT`, fading in from 160 m.
 *
 * Doubts: the face's finer notches (small ledges every few floors) are
 * folded into the four big buttress steps; the glass entrance canopies and
 * the low garden wing round the base are left out (they are separate OSM
 * buildings). The south face's lidar is partly empty (shadowed), so it is
 * mirrored from the north. The night lighting is not checked against a
 * licensed night photo.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, circle, edgePanels, fan, smoothWall, save, type XY } from './atl-westin-peachtree-plaza'

const granite = new Part(), trim = new Part(), win = new Part(), roof = new Part(), crown = new Part()

const rot = (k: number, [x, y]: XY): XY => {
  const c = Math.round(Math.cos((k * Math.PI) / 2)), s = Math.round(Math.sin((k * Math.PI) / 2))
  return [x * c - y * s, x * s + y * c]
}
/** A box given in north-face coordinates, turned to face k (0 north, 1 west, 2 south, 3 east). */
function rbox(p: Part, k: number, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part = roof, bev = 0.4) {
  const a = rot(k, [x0, y0]), b = rot(k, [x1, y1])
  box(p, Math.min(a[0], b[0]), Math.max(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[1], b[1]), z0, z1, top, bev)
}
/** Panels on a north-facing wall at y, from x0 (east end) to x1 (west end), turned to face k. */
const PAN = { group: 12.4, gap: 1.1, bay: 3.4, pier: 0.75, margin: 0.5 }
function rpanels(k: number, y: number, xa: number, xb: number, z0: number, z1: number) {
  edgePanels(win, rot(k, [xa, y]), rot(k, [xb, y]), z0, z1, PAN)
}

const ROOF = 209, PAV = 213, RIM = 217, BASE = 8
const P0 = 15.5, P1 = 24.8 // corner pavilions span 15.5–24.8 m from the centre lines
const CW = 4.6 // half-width of each face's central buttress

// The shaft core, to the roof.
box(granite, -22, 22, -22, 22, 0, ROOF, roof, 0.5)

for (let k = 0; k < 4; k++) {
  // Corner pavilion (this face's east end; the four turns give all four),
  // solid to 213 with an open white frame to 217.
  rbox(granite, k, P0, P1, P0, P1, 0, PAV, roof, 0.4)
  const fr = 1.3
  rbox(trim, k, P0, P1, P1 - fr, P1, PAV, RIM, trim, 0.3)
  rbox(trim, k, P0, P1, P0, P0 + fr, PAV, RIM, trim, 0.3)
  rbox(trim, k, P0, P0 + fr, P0 + fr, P1 - fr, PAV, RIM, trim, 0.3)
  rbox(trim, k, P1 - fr, P1, P0 + fr, P1 - fr, PAV, RIM, trim, 0.3)
  // Side bays between pavilion and buttress, out to 24.5 m, to 114 m;
  // their small 51 m bays out to 27 m.
  for (const sx of [1, -1]) {
    const xa = sx > 0 ? CW : -P0, xb = sx > 0 ? P0 : -CW
    rbox(granite, k, xa, xb, 21.5, 24.5, 0, 114)
    const ba = sx > 0 ? 6.2 : -13.6, bb = sx > 0 ? 13.6 : -6.2
    rbox(granite, k, ba, bb, 24, 27, 0, 51)
  }
  // The central buttress, stepping down outward.
  const steps: [number, number, number][] = [[21.5, 23.5, 193], [23.3, 25.2, 173], [25, 27.2, 142], [27, 29.6, 86], [29.4, 40, 16]]
  for (const [y0, y1, h] of steps) rbox(granite, k, -CW, CW, y0, y1, 0, h, roof, 0.4)

  // Windows: broad panels three storeys tall on every exposed face.
  rpanels(k, P1, P1, P0, BASE, PAV - 2) // pavilions, outer faces
  rpanels(k, P1, -P0, -P1, BASE, PAV - 2)
  rpanels(k, 24.5, P0, 13.6, 51, 112) // side bays, above the small bays
  rpanels(k, 24.5, 6.2, CW, 51, 112)
  rpanels(k, 24.5, -CW, -6.2, 51, 112)
  rpanels(k, 24.5, -13.6, -P0, 51, 112)
  rpanels(k, 24.5, P0, 13.6, BASE, 49)
  rpanels(k, 24.5, 6.2, CW, BASE, 49)
  rpanels(k, 24.5, -CW, -6.2, BASE, 49)
  rpanels(k, 24.5, -13.6, -P0, BASE, 49)
  rpanels(k, 27, 13.6, 6.2, BASE, 49) // the small bays
  rpanels(k, 27, -6.2, -13.6, BASE, 49)
  rpanels(k, 22, P0, CW, 116, ROOF - 2) // the shaft face above the side bays
  rpanels(k, 22, -CW, -P0, 116, ROOF - 2)
  rpanels(k, 23.5, CW, -CW, 173, 191) // buttress steps
  rpanels(k, 25.2, CW, -CW, 142, 171)
  rpanels(k, 27.2, CW, -CW, 86, 140)
  rpanels(k, 29.6, CW, -CW, 18, 84)
  // The buttress's sides, where they stand clear of the side bays.
  for (const [y0, y1, z0, z1] of [[24.5, 25.2, 114, 171], [25.2, 27.2, 51, 140], [27.2, 29.6, 18, 84]] as const) {
    if (y1 - y0 > 1.8) {
      edgePanels(win, rot(k, [CW, y1]), rot(k, [CW, y0]), z0, z1, { ...PAN, margin: 0.3 })
      edgePanels(win, rot(k, [-CW, y0]), rot(k, [-CW, y1]), z0, z1, { ...PAN, margin: 0.3 })
    }
  }
}

// ── The glass crown: stepped tiers with raised corners. ──
const tiers: [number, number, number, number][] = [
  // half-width, height, corner block inner edge, corner height
  [17, 221, 9, 225],
  [14, 233, 8, 237],
]
for (const [h, z, c, zc] of tiers) {
  box(crown, -h, h, -h, h, ROOF - 1, z, roof, 0.4)
  for (let k = 0; k < 4; k++) rbox(crown, k, c, h, c, h, z - 1, zc, roof, 0.4)
}
box(crown, -8, 8, -8, 8, 232, 245, roof, 0.4)
box(crown, -4.5, 4.5, -4.5, 4.5, 244, 257, roof, 0.3)
// The white drum and mast.
const drum = circle([0, 0], 2.8, 14)
smoothWall(trim, drum, 257, 262.5)
fan(trim, drum, 262.5, true, [0, 0])
smoothWall(trim, circle([0, 0], 0.35, 6), 262.5, 266)
fan(trim, circle([0, 0], 0.35, 6), 266, true, [0, 0])

// Floodlight: the corner frames and the crown, and the top of the granite.
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : 1) * Math.min(1, Math.max(0, (p[2] - 160) / 40))

await save('atl-truist-plaza', 'Truist Plaza', [
  { part: granite, material: { ...finish('truist-granite', 0x75767a), floodlight: lit } },
  { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
  { part: win, material: { ...PALETTE.window, color: 0x4b5864 } },
  { part: roof, material: PALETTE.roof },
  { part: crown, material: finish('neon-truist-crown', 0x5f7282, 0.35) },
], { height: 266, anchor: [33.762699, -84.386554], bearing: 1 }, 6500)
