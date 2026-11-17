/**
 * The Independent ("the Jenga tower"), 301 West Avenue, Austin (2019, Rhode
 * Partners) — original procedural geometry, CC0-1.0.
 * bun generators/atx-the-independent.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 17.7: the model's axes follow Austin's street grid.
 * Anchor = area centroid of OSM way/516271461 ("The Independent", 58 levels,
 * height 209), -97.7511675, 30.2678017.
 *
 * Identity (from the photos): a slender residential tower made of stacked
 * glass boxes, each shifted sideways from the one below so that the corners
 * overhang in turn; the biggest overhang, on the south-east, is a deep
 * white-soffited cantilever about two-thirds of the way up. Each box is blue
 * glass with stacks of recessed white balconies; thick white slab edges mark
 * where the boxes meet. A tall screen of pale gold fins crowns the top box.
 *
 * Boxes (photo-scaled from "ajay", the farthest photo, against the published
 * 210 m; floors from Wikipedia): the podium (parking and the 9th-floor
 * amenity deck) to 30 m, then four boxes: 30-66, 66-106, 106-156 and
 * 156-194 m, and the fin screen to 210 m. Each box is 32 m square, offset
 * from the tower's axis by its own amount (see BOXES): along the SE-NW
 * diagonal measured in "ajay" and "ne" (20-25 px at about 0.17 m/px in
 * "ajay"), across it estimated from "lux". The slabs at the breaks are
 * 3.2 m thick and light, with light soffits where a box overhangs.
 *
 * Evidence:
 *  - plan: OSM way/516271461 (39 x 44 m) for the podium. The tower's square
 *    is placed from the lidar: in 2017 the core stood 42 m high over
 *    x -16..20, y -23..13 (the south of the lot), with the 28-34 m parking
 *    deck north of it.
 *  - lidar: USGS 3DEP USGS_LPC_TX_Central_B1_2017 (2017 flight); the tower
 *    was under construction (core 42 m, crane 74 m), so it gives only the
 *    footprint and the podium height (28-34 m, drawn 30).
 *  - published: 690 ft (210 m), 58 storeys, completed 2019 (Wikipedia,
 *    "The Independent (Austin, Texas)"; OSM height 209).
 *  - building:part=roof ways 970724030-33 east of the outline are canopies
 *    over the parking ramp, outside the outline, and not drawn or replaced.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  ajay   "The Independent - Austin, TX (54987491874).jpg", ajay_suresh,
 *         CC BY 4.0 (from the south-west, past the library)
 *         https://commons.wikimedia.org/wiki/File:The_Independent_-_Austin,_TX_(54987491874).jpg
 *  ne     "The Independent Austin Texas NE Corner 2020.jpg", Larry D. Moore
 *         (Nv8200p), CC BY 4.0 https://commons.wikimedia.org/wiki/File:The_Independent_Austin_Texas_NE_Corner_2020.jpg
 *  xn     "The Independent, Austin, TX 2021-08-10.jpg", Xnatedawgx, CC BY-SA 4.0
 *  lux    "The Independent.jpg", Luxbaumann23, CC BY-SA 4.0
 *  stacks "The Independent from the Stacks Austin Texas 2023.jpg", Larry D.
 *         Moore, CC BY 4.0
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the box heights and shifts are photo-scaled (a metre or two
 * either way); the SW-NE components rest on one close, upward photo. The balcony stacks are drawn two to a face
 * as broad cream panels. The podium's facades are drawn plainly.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, save, type XY } from './atl-flatiron-building'
import { wallBand } from './atx-google-tower'

const rail = new Part(), glass = new Part(), balc = new Part(), slab = new Part(), roof = new Part(), fins = new Part()

const OUTLINE: XY[] = [[-19.47, -22.14], [19.45, -22.2], [19.52, 22.19], [-19.54, 22.1]]
const C: XY = [1.5, -4.2], HALF = 16
// Boxes: [z0, z1, dx, dy], each box's offset from the tower's axis (m).
// Along the SE-NW diagonal the shifts are measured from "ajay" (SW) and
// "ne" (NE), which both look along that axis: relative to the second box,
// the first sits 3.5 m and the third 4.3 m further south-east, the fourth
// in line. Across it (SW-NE) they are estimated from "lux" (the third box
// sits toward the south-west over the second) and are less certain.
const BOXES: [number, number, number, number][] = [[30, 66, 1.6, -0.8], [66, 106, -2.4, 1.9], [106, 156, 1.2, -2.9], [156, 194, -2.6, 1.4]]
const TOP = 210

// The podium: the whole outline to 30 m, dark glazing bands on the parking.
prism(roof, OUTLINE, 0, 30, roof, 0.4)
for (let i = 0; i < 4; i++) for (let z = 6; z < 28; z += 6) wallBand(glass, OUTLINE[i], OUTLINE[(i + 1) % 4], z, z + 3, 0.06, 1.5)

const sqAt = (dx: number, dy: number): XY[] => {
  const cx = C[0] + dx, cy = C[1] + dy
  return [[cx - HALF, cy - HALF], [cx + HALF, cy - HALF], [cx + HALF, cy + HALF], [cx - HALF, cy + HALF]]
}
for (const [z0, z1, dx, dy] of BOXES) {
  const ring = sqAt(dx, dy)
  // the white slab at the box's foot (its soffit shows where it overhangs)
  prism(slab, ring, z0, z0 + 3.2, slab, 0.25, true)
  prism(glass, ring, z0 + 3.2, z1, roof, 0.3)
  // the big cantilever: the third box's terrace slab runs 4 m past its
  // south-east corner (the deep white overhang in every photo)
  if (z0 === 106) {
    // the 34th-floor terrace: the slab runs 3.5 m past the box's south
    // and east faces, with a glass railing on it
    const [x0, y0] = ring[0], [x1, y1] = ring[2]
    const T: XY[] = [[x0 + 4, y0 - 3.5], [x1 + 3.5, y0 - 3.5], [x1 + 3.5, y1 - 6], [x1, y1 - 6], [x1, y0], [x0 + 4, y0]]
    prism(slab, T, z0, z0 + 3.2, slab, 0.25, true)
    for (let i = 0; i < 3; i++) wallBand(rail, T[i], T[i + 1], z0 + 3.2, z0 + 4.4, 0.0)
  }
  // recessed balcony stacks: two cream panels on each face, and floor
  // lines across the glass every three storeys
  for (let i = 0; i < 4; i++) {
    const a = ring[i], b = ring[(i + 1) % 4]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const P = (d: number): XY => [a[0] + t[0] * d, a[1] + t[1] * d]
    const stacks = i % 2 === 0 ? [7, 22] : [10, 25]
    for (const d of stacks) wallBand(balc, P(d - 2.2), P(d + 2.2), z0 + 2.2, z1 - 0.4, 0.06)
    for (let z = z0 + 3.2 + 10.2; z < z1 - 3; z += 10.2) wallBand(slab, a, b, z, z + 0.5, 0.05, 0.3)
  }
}
// The crown: a screen of tall pale-gold fins round the top box's roof, set
// in a little, with a darker plant room behind.
{
  const ring = sqAt(BOXES[3][2], BOXES[3][3]), inset = 1.2
  const inner: XY[] = ring.map(([x, y]) => [x + (x < C[0] ? inset : -inset), y + (y < C[1] - 0 ? inset : -inset)] as XY)
  prism(roof, inner.map(([x, y]) => [x + (x < C[0] ? 3 : -3), y + (y < C[1] ? 3 : -3)] as XY), 194, 202, roof, 0.3)
  for (let i = 0; i < 4; i++) {
    const a = inner[i], b = inner[(i + 1) % 4]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = 8
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [t[1], -t[0]]
    for (let k = 0; k < n; k++) {
      const d = 1 + ((L - 2) * (k + 0.5)) / n
      const p: XY = [a[0] + t[0] * d, a[1] + t[1] * d]
      const w = 0.7, dep = 1.6
      const fin: XY[] = [
        [p[0] - t[0] * w, p[1] - t[1] * w], [p[0] + t[0] * w, p[1] + t[1] * w],
        [p[0] + t[0] * w - nn[0] * dep, p[1] + t[1] * w - nn[1] * dep], [p[0] - t[0] * w - nn[0] * dep, p[1] - t[1] * w - nn[1] * dep],
      ]
      prism(fins, fin, 194, k % 2 ? TOP - 1.5 : TOP, fins, 0)
    }
    // a band tying the fins together at their foot
    wallBand(fins, a, b, 194, 197, 0.06)
  }
}

if (import.meta.main) {
  await save('atx-the-independent', 'The Independent', [
    { part: glass, material: { ...PALETTE.window, color: 0x7ea5cc } },
    { part: rail, material: PALETTE.glass },
    { part: balc, material: finish('independent-balconies', 0xeadfcd) },
    { part: slab, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: fins, material: finish('independent-crown-fins', 0xd9c49a) },
  ], { bearing: 17.7, height: TOP, replaces: ['way/516271461'] })
}
