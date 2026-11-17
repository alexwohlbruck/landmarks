/**
 * Two Liberty Place, Philadelphia (Murphy/Jahn, Helmut Jahn, 1990) —
 * original procedural geometry, CC0-1.0.
 * bun generators/phl-two-liberty-place.ts [out.glb]
 *
 * Built with the Liberty Place kit exported by phl-one-liberty-place.ts
 * (materials, banded massing, gabled bays, tiers, light lines), which must be
 * merged first.
 *
 * Frame: map frame turned to the Center City grid, BEARING 9.2 (the OSM
 * outline's sides, 8.7-9.8, mean 9.2; the lidar was read in the same frame).
 * +x toward 16th Street (east-south-east), +y toward Market Street
 * (north-north-east), z up, metres. Origin = area centroid of the OSM
 * outline way/42785013 (-75.167451, 39.951674), on the ground (Chestnut
 * Street, lidar ground 2.5 m above the box's ground_min; elevation 0).
 *
 * Form (lidar + photos): "as much of a slab as a tower" (Goldberger). A
 * 39.6 m wide, 66.7 m deep block of banded granite and blue glass runs up to
 * 146.5 m; its north end (over the Shops at Liberty Place) stops there, with
 * its two north corners cut down to 116.5 m. On the southern 50 m the tower
 * carries on, narrowed to 31.2 m, to 177 m, with a glass bay down the middle
 * of the east and west faces that rises past it. The crown is One Liberty's
 * design cut down: a gabled bay (T1) on each face (flush with the faces on
 * the east and west, set back behind a terrace on the north and south),
 * behind them one square cross-gabled tier (T2) whose ridges climb steeply to
 * a peak, and a short finial instead of a spire. The rakes of the T1 and T2
 * gables are lines of light at night (two nested chevrons a face; white,
 * often colour-washed green or red).
 *
 * Evidence
 * - OSM way/42785013 (outline of the southern part, 38 x 44 m), parts
 *   way/341324304 (149.54), way/333339065 (159.48), way/333339067 and
 *   way/333204579 (233, gabled), way/333339059 and way/333339064 (258,
 *   gabled); and way/333204568 (149.54), the tower's north end, mapped as a
 *   part inside the Shops at Liberty Place outline (way/333204596, which is
 *   not replaced: the mall and its glass rotunda are not this model). The OSM
 *   outlines sit about 2.3 m north of the lidar's and are a little small;
 *   the model is built to the lidar about the OSM centroid.
 * - USGS 3DEP lidar USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown 2015),
 *   0.5 m and 1 m grids, read in this frame. Measured (above Chestnut
 *   Street): lower block x +-19.8, y -23.1..34.4 to 146.5; north end
 *   y 34.4..43.6, x +-15.6 to 146.5, its corners to 116.5; upper shaft
 *   x +-15.6, y -23.1..26.6 to 177; east and west bays 22 m wide, flush with
 *   the lower faces; crown centre (0, 1.75). Least-squares fits of
 *   h = A - k*s + r*(W - d) (median residual 0.2-0.4 m): T1 bays half-width
 *   11, A 211.0 at the face, k 1.08, r 1.35 (eaves 199.1 on the face); T2
 *   W 15.6, A 225.7, k 1.08, r 0.8, so the peak is 238.2. Highest lidar
 *   return 246.4 (the finial).
 * - Published: 848 ft = 258 m, 58 storeys, completed 1990 (Wikipedia
 *   "Liberty Place", CTBUH). The lidar, and the photos scaled against the
 *   measured crown, put the finial's tip near 247 m above Chestnut Street,
 *   11 m short of the published figure; the model follows the measurement
 *   (see Doubts).
 * - Mapterhorn terrain: the site falls about 1 m to the south-east; ordinary
 *   site, elevation 0.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 * - "Liberty place.jpg", Photodavid, CC BY-SA 3.0 (both towers from the
 *   west-north-west: the west bay and its gable and chevron, T2, the dark
 *   steep peak and finial, the setback at 146.5 m and the filled corners)
 *   https://commons.wikimedia.org/wiki/File:Liberty_place.jpg
 * - "Two Liberty Place.jpg", BrokenSegue, CC BY-SA 4.0 (the banded shaft
 *   and glass bays from below, south-east)
 *   https://commons.wikimedia.org/wiki/File:Two_Liberty_Place.jpg
 * - "Two Liberty Place from Chestnut St.jpg", Mihai Bojin, CC BY 2.0 (south
 *   face, glass colour) https://commons.wikimedia.org/wiki/File:Two_Liberty_Place_from_Chestnut_St.jpg
 * - Night: "Philadelphia Night Skyline.jpg", Thesab, CC BY-SA 4.0 (two
 *   nested chevrons lit green, dark peak, red beacon on the finial)
 *   https://commons.wikimedia.org/wiki/File:Philadelphia_Night_Skyline.jpg
 *   and "Philadelphia Night Skyline (14146388982).jpg", Chris Hunkeler,
 *   CC BY-SA 2.0 (the same lit red)
 *   https://commons.wikimedia.org/wiki/File:Philadelphia_Night_Skyline_(14146388982).jpg
 *
 * Look-only: none used.
 *
 * Estimated: the facade rhythm, lobby and light-line depth as for One
 * Liberty (see that file); the inner chevron on each bay (apex 204 m,
 * photo-scaled from Photodavid); the finial (a square stub 3 m wide from the
 * peak to 241 m, then a point to 247.5 m), scaled from Photodavid against the
 * measured crown and capped by the lidar's highest return.
 *
 * Night: as One Liberty: shaft glass lit (`window`), crown glass dark
 * (`glass`, `glass-2`), the T1 and T2 rakes and T2's corners (the outer
 * chevron's hooked ends in the night photos) white light lines
 * (`neon-liberty-lights`).
 *
 * Doubts: the published 258 m is not met: neither the lidar (highest return
 * 246.4 m) nor the photos show anything that tall, so either the figure is
 * taken from a lower datum or the finial's tip carries a mast too thin to
 * see; the north and south faces are only seen obliquely in the licensed
 * photos, so their glass bays are drawn like the east and west ones; the
 * lights are white here though they are usually colour-washed.
 */
import {
  newKit, massing, crown, bay, frustum, save,
  type Box, type Rect,
} from './phl-one-liberty-place'

const BEARING = 9.2
const ANCHOR = { lng: -75.167451, lat: 39.951674 }
const X = 19.8, XU = 15.6           // lower block and upper shaft half-widths
const YS = -23.1, YN = 34.4, YE = 43.6, YU = 26.6 // south face, notch line, north end, upper shaft's north face
const CUT = 116.5, BLOCK = 146.5, SHAFT = 177
const CX = 0, CY = 1.75, W1 = 11, T2 = 15.6, D1 = 19.8, D1NS = 20

const k = newKit()
const boxes: Box[] = [
  [-X, YS, X, YE, CUT],
  [-X, YS, X, YN, BLOCK],
  [-XU, YN, XU, YE, BLOCK],
  [-XU, YS, XU, YU, SHAFT],
  [XU, CY - W1, X, CY + W1, SHAFT],
  [-X, CY - W1, -XU, CY + W1, SHAFT],
]
const covered: Rect[] = [
  [CX - T2, CY - T2, CX + T2, CY + T2],
  [XU, CY - W1, X, CY + W1], [-X, CY - W1, -XU, CY + W1],
  [CX - W1, CY + T2, CX + W1, CY + D1NS], [CX - W1, CY - D1NS, CX + W1, CY - T2],
]
massing(k, boxes, covered, (w, L) => {
  const alongX = w.a[1] === w.b[1]
  const u = (t: number) => Math.abs(t - (alongX ? w.a[0] : w.a[1]))
  const c = alongX ? w.a[1] : w.a[0] // the wall's line
  const segs = (cuts: number[], styles: ('band' | 'curtain')[], lips: boolean[]) =>
    styles.map((style, i) => ({ u0: cuts[i], u1: cuts[i + 1], style, lip: lips[i] }))
  // East and west faces of the bays: glass all the way up into the gable.
  if (!alongX && Math.abs(c) === X && w.hi === SHAFT) return [{ u0: 0, u1: L, style: 'curtain', lip: false }]
  // The bays' flanks between 146.5 and 177 carry on above as the bays' sides.
  if (alongX && w.lo === BLOCK && w.hi === SHAFT && Math.abs(Math.abs(c - CY) - W1) < 0.01) return [{ u0: 0, u1: L, style: 'band', lip: false }]
  // The upper shaft's east and west faces turn into T2's walls where T2 meets them.
  if (!alongX && Math.abs(c) === XU && w.hi === SHAFT) {
    // Signed distance along the wall, which may run either way.
    const dir = Math.sign(w.b[1] - w.a[1]), v = (t: number) => (t - w.a[1]) * dir
    const a = v(CY - T2), b = v(CY + T2), lo = Math.max(0, Math.min(a, b)), hi = Math.min(L, Math.max(a, b))
    return [{ u0: 0, u1: lo, style: 'band', lip: true }, { u0: lo, u1: hi, style: 'band', lip: false }, { u0: hi, u1: L, style: 'band', lip: true }]
      .filter((s) => s.u1 - s.u0 > 0.01) as ReturnType<Parameters<typeof massing>[3]>
  }
  // The upper shaft's north and south faces: a glass bay down the middle.
  if (alongX && w.hi === SHAFT && (c === YS || c === YU)) {
    const a = u(-W1), b = u(W1)
    return segs([0, Math.min(a, b), Math.max(a, b), L], ['band', 'curtain', 'band'], [true, true, true])
  }
  return [{ u0: 0, u1: L, style: 'band', lip: true }]
})

const K = 1.08, R = 0.8
const roofAt = crown(k, { cx: CX, cy: CY, k: K, r: R, base: SHAFT, tiers: [{ W: T2, A: 225.7 }] })
for (let f = 0; f < 4; f++) {
  const ns = f % 2 === 1
  bay(k, {
    cx: CX, cy: CY, f, D: ns ? D1NS : D1, Win: T2, w: W1, A: 211.0, k: K, r: 1.35,
    faceBase: SHAFT, sideBase: SHAFT, chevron: 204,
  })
}
// The finial: a short square stub on the peak, then a point.
const peak = roofAt({ W: T2, A: 225.7 }, 0, 0)
frustum(k.crown, CX, CY, peak - 2.5, 1.6, 241, 0.75, 4, false)
frustum(k.granite, CX, CY, 241, 0.75, 247.5, 0, 4, false)

await save('Two Liberty Place', k, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 247.5,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  source: 'generators/phl-two-liberty-place.ts',
}, process.argv[2] ?? new URL('../models/phl-two-liberty-place.glb', import.meta.url).pathname)
