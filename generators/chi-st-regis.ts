/**
 * St. Regis Chicago (Vista Tower, 2020, Jeanne Gang / Studio Gang), Chicago —
 * original procedural geometry, CC0-1.0.
 * bun generators/chi-st-regis.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. The anchor is the area centroid of the OSM outline (way/464802811),
 * 41.887236, -87.617251. Bearing 0: the masses sit square to north in OSM.
 *
 * Form: three glass masses side by side, west to east 93, 71 and 47 storeys
 * (Wikipedia), each a stack of frustums that alternately flare out and draw
 * in, so every face and every seam between masses waves gently. A dark
 * storey-high band marks the blow-through floor near the top of the west
 * mass, and darker bands cross the masses at the amenity and mechanical
 * floors (photos from north and south). A low glass podium wraps the foot,
 * with the 11-storey east block on Field Boulevard.
 *
 * Sources:
 *  - Plans: OSM building:parts, exact: west mass way/465242989, middle
 *    way/465242991, east way/465242992, east block way/465242990 (59 m),
 *    outline way/464802811 for the low podium.
 *  - Heights: west 363 m (published architectural height; OSM tags the
 *    93rd-floor roof 349 m and the mechanical floors carry the glass to the
 *    top), middle 259 m and east 179 m (OSM, consistent with 71 and 47
 *    storeys at the tower's ~3.6 m floor-to-floor).
 *  - Frustum stacking: published as alternating truncated pyramids, each
 *    perimeter column stepping ~13 cm a floor (Wikipedia). Knot heights are
 *    estimated from photos (about 12 floors a frustum: 8 on the west mass,
 *    6 and 4 on the others), neighbours out of phase so the seams wave, as
 *    in the facade detail photo. The swing is drawn 3.2 m per side, about
 *    twice the real one, so each frustum reads at map scale. Facets leaning
 *    in (towards the sky) are the lighter glass and facets leaning out the
 *    deeper one, which is how the photos show them.
 *  - Crown: the blow-through floor sits at the west mass's widest point and
 *    the last frustum draws in hard above it (≈4.6 m a side over 51 m) to a
 *    flat roof. The far photos (Navy Pier, Adler) show the roof level; the
 *    pointed / V look in the close north and north-east photos is that flat
 *    roof and the floor lines seen corner-on from below.
 *  - Dark bands: blow-through floor 83 at ~312–319 m, measured in the north
 *    and north-east photos (Wikipedia: 7.3 m grates; set back 1.6 m here,
 *    estimated, so the open floor reads as a gap); the floor-47 amenity
 *    level ~172 m, a low mechanical floor on the middle mass ~52 m and the
 *    parapet floors of the two lower masses, estimated from the south photo.
 *  - Balcony slots: the dark recessed slot down the middle of each mass's
 *    east face where it stands clear of its neighbour (north-east photos;
 *    width 3.6 m estimated).
 *  - Facade: pale floor-group lines every four floors (STYLE.md curtain
 *    wall), no mullions.
 *  - Colours: six blue-green glass shades in reality; drawn as a light and
 *    a deep blue-green, held near the palette's window lightness.
 *  - Podium: the north pavilion's diamond-gridded silver frame (photo from
 *    the north) is drawn as a pale silver box, 30 m (estimated); the east
 *    block (OSM 59 m) is glazed like the tower, as the north-east photo
 *    shows, with the same floor lines.
 *
 * Photos (Wikimedia Commons): St._Regis_Chicago.jpg (R Boed, CC BY 2.0, from
 * the north across the river); Chicago_in_2022_St._Regis_Chicago_skyscraper
 * _(52057790496).jpg (Chris Rycroft, CC BY 2.0, from the north-east);
 * Stregis_3.19.24.jpg (Drocklaw, CC BY-SA 4.0, from the park to the south);
 * The_St._Regis_Chicago,_viewed_from_Navy_Pier.jpg (Masterpineapple421,
 * CC BY-SA 4.0, from the east); Vista_Tower_..._(PPL2-Enhanced)_julesvernex2
 * .jpg (Jules Verne Times Two, CC BY-SA 4.0, facade detail); Chicago_
 * skyscrapers_in_New_Eastside_from_the_Adler_Planetarium_Skyline_Walk_
 * (52032999464).jpg (Chris Rycroft, CC BY 2.0, from the south-east). No
 * commercial imagery or 3D tiles were used.
 *
 * Left out: mullions and single-floor lines (too fine), the pathway under
 * the middle mass, the rooftop terrace planting.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const lit = new Part()    // facets that lean in and catch the sky: lighter
const shade = new Part()  // facets that lean out and face down: deeper
const dark = new Part()   // blow-through and mechanical floors, balcony slots
const roof = new Part()
const silver = new Part() // pale floor-group lines, the silver-framed pavilion

/**
 * A mass: OSM rectangle [x0, x1] × [y0, y1] and its profile, a list of
 * [height, offset] knots: offset 0 is the drawn-in plan, SWING the flared
 * one, and the faces run straight between knots, so each pair of knots is
 * one frustum. `shared` lists the sides that abut a neighbour ('w', 'e');
 * those never draw in, so neighbours never part, only overlap.
 */
type Mass = {
  x0: number; x1: number; y0: number; y1: number; shared: string
  knots: [number, number][]; bands: [number, number][]; slot: [number, number][]
}

const SWING = 3.2   // flare beyond the drawn-in plan, metres per side
const CH = 0.9      // corner chamfer
const RECESS = 1.6  // how far an open (blow-through) floor sits back
const S = SWING

const masses: Mass[] = [
  // west, 93 storeys + mechanical. The blow-through floor sits at the
  // widest point; above it the crown frustum draws in hard to the roof.
  { x0: -53.4, x1: -27.0, y0: -10.0, y1: 17.7, shared: 'e',
    knots: [[0, 0], [34, S], [78, 0], [122, S], [168, 0], [214, S], [262, 0], [312, S], [363, -1.4]],
    bands: [[312, 319], [168, 175]], slot: [[259, 312], [319, 360]] },
  // middle, 71 storeys
  { x0: -27.0, x1: -0.4, y0: -12.7, y1: 14.4, shared: 'we',
    knots: [[0, S], [44, 0], [90, S], [136, 0], [180, S], [222, 0], [259, S * 0.6]],
    bands: [[49, 55], [255, 259]], slot: [[179, 255]] },
  // east, 47 storeys
  { x0: -0.4, x1: 26.0, y0: -16.5, y1: 11.1, shared: 'w',
    knots: [[0, 0], [44, S], [92, 0], [136, S], [179, 0]],
    bands: [[175, 179]], slot: [[59, 175]] },
]

/** The offset of a mass at height z, read off its knots. */
function offsetAt(m: Mass, z: number) {
  const k = m.knots
  for (let i = 0; i < k.length - 1; i++) {
    const [za, oa] = k[i], [zb, ob] = k[i + 1]
    if (z >= za && z <= zb) return oa + (ob - oa) * (z - za) / (zb - za)
  }
  return k[k.length - 1][1]
}

/** The chamfered rectangle of a mass at offset `o`, standing `proud` off it, ccw. */
function ring(m: Mass, o: number, z: number, proud = 0): V3[] {
  const inset = SWING / 2, q = o + proud
  const x0 = m.x0 + (m.shared.includes('w') ? 0 : inset) - q
  const x1 = m.x1 - (m.shared.includes('e') ? 0 : inset) + q
  const y0 = m.y0 + inset - q, y1 = m.y1 - inset + q
  return [
    [x0 + CH, y0, z], [x1 - CH, y0, z], [x1, y0 + CH, z], [x1, y1 - CH, z],
    [x1 - CH, y1, z], [x0 + CH, y1, z], [x0, y1 - CH, z], [x0, y0 + CH, z],
  ]
}
const ringAt = (m: Mass, z: number, proud = 0) => ring(m, offsetAt(m, z), z, proud)

const FLOORS = 14.4  // a floor-group line every four floors (~3.6 m each)
const LINE = 0.8     // line height, broad enough to hold at map distance

for (const m of masses) {
  const top = m.knots[m.knots.length - 1][0]
  for (let k = 0; k < m.knots.length - 1; k++) {
    const [za, oa] = m.knots[k], [zb, ob] = m.knots[k + 1]
    const part = ob < oa ? lit : shade
    const cuts = [za, ...m.bands.flat().filter((z) => z > za && z < zb), zb].sort((a, b) => a - b)
    for (let c = 0; c < cuts.length - 1; c++) {
      const z0 = cuts[c], z1 = cuts[c + 1]
      const inBand = m.bands.some(([b0, b1]) => z0 >= b0 && z1 <= b1)
      if (inBand && z1 < top) {
        // an open floor: set back RECESS, with a ledge under and a soffit over
        const lo = ringAt(m, z0), hi = ringAt(m, z1), li = ringAt(m, z0, -RECESS), hiIn = ringAt(m, z1, -RECESS)
        dark.loft([li, hiIn])
        for (let i = 0; i < 8; i++) {
          const j = (i + 1) % 8
          dark.quad(lo[i], lo[j], li[j], li[i])
          dark.quad(hi[j], hi[i], hiIn[i], hiIn[j])
        }
      } else (inBand ? dark : part).loft([ringAt(m, z0), ringAt(m, z1)])
    }
  }
  roof.cap(ringAt(m, top), true)

  // floor-group lines, skipping the dark bands
  for (let z = FLOORS; z < top - 2; z += FLOORS) {
    if (m.bands.some(([b0, b1]) => z > b0 - 1.5 && z < b1 + 1.5)) continue
    silver.loft([ringAt(m, z - LINE / 2, 0.06), ringAt(m, z + LINE / 2, 0.06)])
  }

  // the recessed balcony slot down the middle of the east face, where exposed
  const yc = (m.y0 + m.y1) / 2, hw = 1.8
  for (const [s0, s1] of m.slot) {
    const zs = [s0, ...m.knots.map(([z]) => z).filter((z) => z > s0 && z < s1), s1]
    for (let i = 0; i < zs.length - 1; i++) {
      const xa = ringAt(m, zs[i], 0.1)[2][0], xb = ringAt(m, zs[i + 1], 0.1)[2][0]
      dark.quad([xa, yc - hw, zs[i]], [xa, yc + hw, zs[i]], [xb, yc + hw, zs[i + 1]], [xb, yc - hw, zs[i + 1]])
    }
  }
}

// ---------- podium ----------
// The silver-framed glass pavilion in front of the middle mass on the north
// (its diamond-gridded frame reads pale silver in photos), and the 11-storey
// east block on Field Boulevard, glazed like the tower.
function box(part: Part, x0: number, x1: number, y0: number, y1: number, z1: number) {
  const r: V3[] = [[x0, y0, 0], [x1, y0, 0], [x1, y1, 0], [x0, y1, 0]]
  part.loft([r, r.map(([x, y]) => [x, y, z1] as V3)])
  roof.cap(r.map(([x, y]) => [x, y, z1] as V3), true)
}
box(silver, -27.4, -2.0, 10, 23.5, 30)
box(shade, 24.5, 52.3, -23.3, 9.4, 59)
for (let z = FLOORS; z < 58; z += FLOORS) {
  const r: V3[] = [[24.44, -23.36, z - LINE / 2], [52.36, -23.36, z - LINE / 2], [52.36, 9.46, z - LINE / 2], [24.44, 9.46, z - LINE / 2]]
  silver.loft([r, r.map(([x, y]) => [x, y, z + LINE / 2] as V3)])
}

// ---------- write ----------

const parts = [
  { part: lit, material: windowVariant(2, 0x85b3c6) },
  { part: shade, material: windowVariant(3, 0x5f8ea8) },
  { part: dark, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: silver, material: finish('stregis-silver', 0xcfdade) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('St. Regis Chicago', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, height: 363,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/464802811', 'way/465242989', 'way/465242991', 'way/465242992', 'way/465242990'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/chi-st-regis.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
