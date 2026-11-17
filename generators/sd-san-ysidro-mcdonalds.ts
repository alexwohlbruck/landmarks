/**
 * The "Trolley Station" restaurant building at San Ysidro, 729 E San Ysidro
 * Blvd — a two-storey cream stucco block facing the San Ysidro Transit
 * Center trolley platforms, with its local landmark over the middle of the
 * platform front: a big curved sign of three stacked maroon bands, the
 * widest on top, cantilevered out from the wall above the entrance.
 *
 * Branding: the real top band carries the chain's name with "Trolley
 * Station", and the chain's logo sits at its end and on the shop fascia.
 * Per the brief, no wordmark or logo is modelled: the curved bands are kept
 * as plain maroon forms (their shape is the landmark), and the ground-floor
 * shop signs are left out.
 *
 * Frame: bearing 60. Map frame x along the platform front toward
 * south-south-east (compass 150), y toward east-north-east (compass 60),
 * z up, metres; the platform front faces -y (west-south-west). Origin at the
 * anchor (−117.0291055, 32.5443977), the centroid of OSM way/31818520;
 * y = 0 is the platform-side ground (the lowest under the footprint). The
 * ground behind (east) is about 4.6 m higher (lidar), so the back wall sinks
 * into it on the map.
 *
 * Sources
 * - OSM way/31818520 (building=retail, amenity=fast_food, branch "Trolley
 *   Station") © OSM contributors: a 54 × 23 m block whose front bulges by
 *   about 2.5 m over 17 m, where the curved sign is. The front, which OSM
 *   draws a few tenths of a metre crooked, is straightened at y = −11.2.
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014), 0.5 m grid, read in
 *   the model's frame: platform ground +0.5, ground behind +4.6 (above the
 *   box's ground_min); roof 8.3–9.0, front parapet 9.8, curved sign's top
 *   10.8 (all above the platform ground, measured).
 * - USGS NAIP orthophoto: plan, tan gravel roof, the bulge on the front.
 * Photos (evidence)
 * - "San Ysidro, San Diego, CA, USA - panoramio (6).jpg", Roman Eugeniusz,
 *   CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:San_Ysidro,_San_Diego,_CA,_USA_-_panoramio_(6).jpg
 *   — square on to the sign: three bands, their widths, the khaki pilasters,
 *   big gridded upper windows, storefronts.
 * - "San Ysidro, San Diego, CA, USA - panoramio (5).jpg", same author and
 *   licence, https://commons.wikimedia.org/wiki/File:San_Ysidro,_San_Diego,_CA,_USA_-_panoramio_(5).jpg
 *   — from the north-west: how far the bands project, the plain north wing
 *   with small square windows, maroon coping.
 * - "San Ysidro, San Diego, CA, USA - panoramio (7).jpg", same author and
 *   licence, https://commons.wikimedia.org/wiki/File:San_Ysidro,_San_Diego,_CA,_USA_-_panoramio_(7).jpg
 *   — along the platform from the north: the long front, the sign.
 *
 * Numbers
 * - Plan: OSM (measured). Walls to 9.0, front parapet 9.8, roof deck 8.6,
 *   sign top 10.8: lidar (measured).
 * - Sign bands: top 9.5–10.85 (top from lidar), middle 7.9–9.2, bottom
 *   6.3–7.6 (0.3 m dark gaps between), so the stack fills the upper ~40% of the front as in photos
 *   5 and 6. Chords 22, 20 and 18 m, projections 4.1, 3.4 and 2.7 m,
 *   centred at x = −6.5 (the lidar's centre of the sign top).
 *   Exaggerated on purpose, after review: the sign is the landmark and must
 *   read at phone size. The evidence gives a smaller sign: the lidar's 10.7 m
 *   top surface spans about 14 m (x −13.5…0.5) and projects about 2 m past
 *   the parapet; photo 6 gives a top band about 18 m wide (band widths in
 *   proportion 990 : 880 : 785 px); OSM's bulge is about 2.3 m deep.
 * - Storey lines, window and pilaster sizes: estimated from photos 5 and 6
 *   (pilaster 1.4 m as the scale).
 * - Colours: cream stucco, khaki pilasters and frieze, maroon sign and
 *   coping, tan roof, from the sunny photos, pulled to the palette.
 *
 * Doubts
 * - Photos (Roman Eugeniusz) are from about 2012; the shop fascias change,
 *   the building form has not, as far as the 2014 lidar and NAIP show.
 * - The east (back) and the two end walls are not photographed: plain
 *   stucco with the coping.
 * - The sign's real lettering is lit at night; without it, the bands stay
 *   unlit. The windows glow.
 */
import { Part } from './mesh'
import { finish, PALETTE } from './palette'
import { cbox, rect, panel, block, save } from './dc-white-house'
import { pslab, type XY } from './dc-nga-west'

const STUCCO = finish('trolley-stucco', 0xf0e2bf)
const KHAKI = finish('trolley-khaki', 0xc5ae6e)
const MAROON = finish('trolley-maroon', 0xa83d42)
const MAROON_DARK = finish('trolley-maroon-dark', 0x83353a)
const ROOF = finish('trolley-roof', 0xc4b8a3)

const X0 = -27.0, X1 = 27.27, YF = -11.2, YB = 11.6
const WALL = 9.0, PARAPET = 9.8, DECK = 8.6

/** A convex arc segment in plan: the chord on y = yWall + back, the arc bulging to -y by `sag`. */
function arcRing(cx: number, chord: number, sag: number, back = 0.3, n = 12): XY[] {
  const half = chord / 2, r = (half * half + sag * sag) / (2 * sag)
  const cy = YF - sag + r // circle centre (behind the wall)
  const a0 = Math.atan2(YF - cy, -half), a1 = Math.atan2(YF - cy, half)
  const pts: XY[] = []
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
  }
  pts.push([cx + half, YF + back], [cx - half, YF + back])
  return pts
}

function build() {
  const stucco = new Part(), khaki = new Part(), maroon = new Part(), dark = new Part(), win = new Part(), roof = new Part()

  // Body: walls to 9.0, the roof deck, a front parapet to 9.8 and a lower
  // parapet round the other three sides; maroon coping on top.
  cbox(stucco, rect(X0, X1, YF, YB), 0, WALL, { top: false })
  cbox(roof, rect(X0 + 0.3, X1 - 0.3, YF + 0.3, YB - 0.3), DECK - 0.1, DECK, { top: true })
  cbox(stucco, rect(X0, X1, YF, YF + 0.35), WALL, PARAPET - 0.12, { top: false })
  cbox(maroon, rect(X0 - 0.08, X1 + 0.08, YF - 0.08, YF + 0.4), PARAPET - 0.12, PARAPET, { b: 0.05, bottom: true })
  for (const r of [rect(X0, X0 + 0.35, YF + 0.35, YB), rect(X1 - 0.35, X1, YF + 0.35, YB), rect(X0 + 0.35, X1 - 0.35, YB - 0.35, YB)]) {
    cbox(stucco, r, WALL - 0.4, WALL, { top: false })
    cbox(maroon, rect(r.x0 - 0.06, r.x1 + 0.06, r.y0 - 0.06, r.y1 + 0.06), WALL, WALL + 0.12, { b: 0.04, bottom: true })
  }
  // Fill the wall-top between wall and deck so the roof reads closed.
  cbox(stucco, rect(X0 + 0.35, X1 - 0.35, YF + 0.35, YB - 0.35), WALL - 0.4, DECK - 0.1, { top: false })

  // Khaki pilasters on the platform front, standing 0.3 m proud. The
  // middle bay (5 m, under the centre of the sign) and its neighbours from
  // photo 6, scaled by the sign's 18 m width.
  const PIL = [-15.9, -9.65, -3.25, 5.0, 12.9, 20.0, 25.9]
  for (const x of PIL) block(khaki, 's', YF, x, x + 1.4, 0, 8.6, 0.3)

  // North wing (x < -15.9): storefronts below, small square windows above.
  for (const x of [-26.0, -21.9, -18.0]) panel(win, 's', YF, x, x + 1.6 + 1.0, 0.4, 3.6)
  cbox(khaki, rect(X0 + 0.4, -15.9, YF - 0.12, YF), 3.9, 5.0, { bottom: true })
  for (const x of [-25.0, -21.6, -18.2]) {
    block(khaki, 's', YF, x - 0.15, x + 1.55, 5.85, 7.55, 0.06)
    panel(win, 's', YF - 0.06, x, x + 1.4, 6.0, 7.4)
  }

  // The bays between the pilasters: storefronts, a khaki frieze carrying
  // the shop signs, and gridded upper windows, kept below the sign where
  // the sign's bands meet the wall.
  const SIGN0 = -17.6, SIGN1 = 4.6
  const bays: [number, number][] = [[-14.5, -9.65], [-8.25, -3.25], [-1.85, 5.0], [6.4, 12.9], [14.3, 20.0], [21.4, 25.9]]
  for (const [a, b] of bays) {
    panel(win, 's', YF, a + 0.25, b - 0.25, 0.3, 3.6)
    cbox(khaki, rect(a, b, YF - 0.12, YF), 3.9, 5.2, { bottom: true })
    const top = b > SIGN0 && a < SIGN1 ? 6.1 : 8.3
    panel(win, 's', YF, a + 0.45, b - 0.45, 5.5, top)
    // pale mullions, so the big windows read as gridded
    const n = Math.round((b - a) / 2.4)
    for (let k = 1; k < n; k++) {
      const x = a + 0.45 + ((b - a - 0.9) * k) / n
      block(stucco, 's', YF - 0.04, x - 0.09, x + 0.09, 5.5, top, 0.04, false)
    }
  }

  // The curved sign: a dark maroon drum behind three stacked bands, the
  // widest on top, each projecting further than the one below.
  const CX = -6.5
  pslab(dark, arcRing(CX, 16.0, 2.0), 6.2, 10.6, 0, true, true)
  const BANDS: [number, number, number, number][] = [
    [6.3, 7.6, 18.0, 2.7],
    [7.9, 9.2, 20.0, 3.4],
    [9.5, 10.85, 22.0, 4.1],
  ]
  for (const [z0, z1, chord, sag] of BANDS) pslab(maroon, arcRing(CX, chord, sag, 0.3, 16), z0, z1, 0.15, true, true)

  return [
    { part: stucco, material: STUCCO },
    { part: khaki, material: KHAKI },
    { part: maroon, material: MAROON },
    { part: dark, material: MAROON_DARK },
    { part: win, material: PALETTE.window },
    { part: roof, material: ROOF },
  ]
}

if (import.meta.main) {
  await save('sd-san-ysidro-mcdonalds', 'Trolley Station restaurant, San Ysidro', build(), {})
}
