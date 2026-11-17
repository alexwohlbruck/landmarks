/**
 * Oil Derrick, Six Flags Over Texas, Arlington: procedural, CC0-1.0.
 * bun generators/dal-six-flags-oil-derrick.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * centroid of the OSM attraction area way/1507589103 ("Oil Derrick",
 * tourism=attraction, attraction=amusement_ride; not a building), at the
 * lowest ground under the legs.
 *
 * The 1969 observation tower styled as an oil derrick: four red lattice legs
 * splaying from a narrow square shaft to a broad base, a central elevator
 * core, two balconies with white railings (the first at about 50 ft, which
 * once carried the burlap-sack slide), and an octagonal cab on top: a dark
 * soffit, a glazed lower deck and an open upper deck behind white railings,
 * the blue "Six Flags" band and the small red box with the mast.
 *
 * Sources
 * - OSM: way/1507589103 (attraction area, 23 x 23 m, the footprint of the
 *   legs); no building or building:part covers the tower, so `replaces` is
 *   empty. The toilets building way/1507589102 to the west is separate and
 *   stays drawn. https://www.openstreetmap.org/way/1507589103
 * - Published: 300 ft (91.4 m) tall, opened 1969, first balcony at 50 ft,
 *   two elevators. Wikipedia, "Oil Derrick (Six Flags Over Texas)" and
 *   "Six Flags Over Texas".
 * - USGS 3DEP lidar TX_Pecos_Dallas_B3_2018 (2018 flight), 0.5 m grid: the
 *   first balcony's railing ring at about 18 m (ring about 25 m square), the
 *   second at about 37 m (about 15 m square). The lattice and the cab gave
 *   few returns (top of the cloud 50 m), so the cab heights come from the
 *   published height and photo proportions.
 * - Mapterhorn terrain: the site falls about 1.5 m to the south-west and
 *   shows no podium.
 * - USGS NAIP: plan of the square lattice and its leaning shadow.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Oil Derrick.jpg", Cstrs101 (Coasters101), 2019, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Oil_Derrick.jpg
 *   - "SixFlagsTower-3908.jpg", "-3940", "-3953", "-3954", "-3975",
 *     Loadmaster (David R. Tribble), 2007, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:SixFlagsTower-3908.jpg (etc.)
 *   - "SixFlagsTower-5826/5843/5865.jpg", Loadmaster (David R. Tribble), 2010,
 *     CC BY-SA 3.0
 *   - "LooneyTunesUSA-3872.jpg", Loadmaster (David R. Tribble), CC BY-SA 3.0
 *   - "Observationtower sfot.jpg" (night, floodlit), BrandonR, CC BY-SA 3.0
 *   - "Six Flags Over Texas, Arlington, Texas (48849396931).jpg", 2019,
 *     Nicolas Henderson (Flickr via Commons), CC BY 2.0: the cab today, white rails, blue band and
 *     red box, seen from the west across Titan.
 *
 * Numbers
 * - Total height 91.4 m: published (to the mast top).
 * - Balconies: deck tops 16.8 m and 35.8 m, measured (lidar rings) less the
 *   railing; their sizes measured from the lidar rings.
 * - Leg spread: 21.5 m at the ground (OSM area 23 m), 17.4 m at the first
 *   balcony and 12 m at the second (lidar), 8.2 m shaft above 56 m: estimated
 *   from the photos.
 * - Cab: 13.4 m across, soffit from 74.5 m, decks, band and box: estimated
 *   from SixFlagsTower-3908 scaled to the published height.
 * - Elevator core 2 m square: estimated (the photos show a narrow central
 *   column with the stairs round it).
 *
 * Style: the lattice is drawn bold for 80 px: 1 m legs, 0.7 m girts and
 * 0.7 m flat X-braces, two X's side by side on the wide lower panels, at
 * about half the real member count. Railings are solid white bands.
 * Night: the steel is floodlit from below (the night photo), fading up the
 * tower; the cab's glazed deck glows as `window`.
 *
 * Doubts: the cab's tier heights are photo estimates; the bracing pattern is
 * simplified (the real one has secondary K-bracing); the base of the tower is
 * hidden by trees in every photo, so the leg feet are from OSM and the
 * lidar, not seen.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const ANCHOR = { lng: -97.0711059, lat: 32.7580355 }

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }

const red = new Part(), white = new Part(), dark = new Part(), glazing = new Part(), blue = new Part(), deck = new Part()

/** A closed box bar from a to b: `w` across (along `side`), `d` deep (along the third axis). */
function bar(p: Part, a: V3, b: V3, w: number, d: number, side: V3) {
  const ax = unit(sub(b, a))
  const s0 = unit(sub(side, mul(ax, side[0] * ax[0] + side[1] * ax[1] + side[2] * ax[2])))
  const n = unit(crs(ax, s0))
  const c = (o: V3, i: number): V3 => {
    const [u, v] = [[1, 1], [-1, 1], [-1, -1], [1, -1]][i]
    return add(o, add(mul(s0, (u * w) / 2), mul(n, (v * d) / 2)))
  }
  const A = [0, 1, 2, 3].map((i) => c(a, i)), B = [0, 1, 2, 3].map((i) => c(b, i))
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    // Outward: the face between corners i and j.
    const mid = mul(add(add(A[i], A[j]), add(B[i], B[j])), 0.25), ctr = mul(add(a, b), 0.5)
    const out = sub(mid, ctr), g = crs(sub(A[j], A[i]), sub(B[i], A[i]))
    if (g[0] * out[0] + g[1] * out[1] + g[2] * out[2] > 0) p.quad(A[i], A[j], B[j], B[i])
    else p.quad(A[j], A[i], B[i], B[j])
  }
  p.quad(A[3], A[2], A[1], A[0])
  p.quad(B[0], B[1], B[2], B[3])
}

/** A chamfered square (octagon when `ch` > 0), counter-clockwise from above. */
function octo(h: number, ch: number, z: number): V3[] {
  if (ch <= 0) return [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]]
  return [
    [-h + ch, -h, z], [h - ch, -h, z], [h, -h + ch, z], [h, h - ch, z],
    [h - ch, h, z], [-h + ch, h, z], [-h, h - ch, z], [-h, -h + ch, z],
  ]
}
/** A prism between two heights on an octagon; caps optional. */
function prism(p: Part, h: number, ch: number, z0: number, z1: number, top = true, bottom = true) {
  p.loft([octo(h, ch, z0), octo(h, ch, z1)])
  if (top) p.cap(octo(h, ch, z1), true)
  if (bottom) p.cap(octo(h, ch, z0), false)
}
/** A ring band (railing) between two octagons, outer and inner walls and a top. */
function band(p: Part, h: number, ch: number, t: number, z0: number, z1: number) {
  p.loft([octo(h, ch, z0), octo(h, ch, z1)])
  p.loft([octo(h - t, Math.max(0, ch - t * 0.4), z0).reverse(), octo(h - t, Math.max(0, ch - t * 0.4), z1).reverse()])
  const o = octo(h, ch, z1), i = octo(h - t, Math.max(0, ch - t * 0.4), z1), n = o.length
  for (let k = 0; k < n; k++) p.quad(i[k], o[k], o[(k + 1) % n], i[(k + 1) % n])
}
/** A balcony: deck slab (dark underside and edge, roof-grey top) and a white railing band. */
function balcony(h: number, ch: number, zTop: number) {
  const T = 0.8
  dark.loft([octo(h, ch, zTop - T), octo(h, ch, zTop)])
  dark.cap(octo(h, ch, zTop - T), false)
  deck.cap(octo(h, ch, zTop), true)
  band(white, h, ch, 0.35, zTop, zTop + 1.15)
}

// ---- Lattice ------------------------------------------------------------------
// Half the leg spread at a height: splaying from the shaft to the base.
const PROFILE: [number, number][] = [[0, 10.75], [16.8, 8.7], [35.8, 6.0], [56, 4.1], [74.5, 4.1]]
function hw(z: number) {
  for (let i = 0; i < PROFILE.length - 1; i++) {
    const [z0, h0] = PROFILE[i], [z1, h1] = PROFILE[i + 1]
    if (z <= z1) return h0 + ((h1 - h0) * (z - z0)) / (z1 - z0)
  }
  return PROFILE[PROFILE.length - 1][1]
}
const LEVELS = [0.35, 8.4, 16.8, 26.3, 35.8, 45.9, 56, 60.6, 65.2, 69.8, 74.5]
const CORNERS: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
const corner = (k: number, z: number): V3 => [CORNERS[k][0] * hw(z), CORNERS[k][1] * hw(z), z]
const LEG = 1.0, GIRT = 0.7, BRACE = 0.7

for (let li = 0; li < LEVELS.length - 1; li++) {
  const z0 = LEVELS[li], z1 = LEVELS[li + 1]
  for (let k = 0; k < 4; k++) {
    const k2 = (k + 1) % 4
    // Leg: a square bar, its face turned to the diagonal.
    const a = corner(k, z0), b = corner(k, z1)
    bar(red, a, b, LEG, LEG, [CORNERS[k][0], -CORNERS[k][1], 0])
    // Face of this panel, between corner k and k2.
    const out: V3 = unit([(CORNERS[k][0] + CORNERS[k2][0]), (CORNERS[k][1] + CORNERS[k2][1]), 0])
    const inset = (p: V3): V3 => sub(p, mul(out, 0.15))
    // Girt at the top of the panel.
    bar(red, inset(corner(k, z1)), inset(corner(k2, z1)), GIRT, 0.45, [0, 0, 1])
    // X-braces: one or two X's across the face, by its width.
    const width = 2 * hw(z0), n = width > 1.5 * (z1 - z0) ? 2 : 1
    for (let s = 0; s < n; s++) {
      const P = (t: number, z: number): V3 => {
        const A = corner(k, z), B = corner(k2, z)
        return inset(add(A, mul(sub(B, A), t)))
      }
      const t0 = s / n, t1 = (s + 1) / n
      bar(red, P(t0, z0), P(t1, z1), BRACE, 0.35, out)
      bar(red, P(t1, z0), P(t0, z1), BRACE, 0.35, out)
      if (n === 2 && s === 0) bar(red, P(0.5, z0), P(0.5, z1), 0.6, 0.4, out)
    }
  }
}
// Concrete footings under the legs and the core.
for (const [sx, sy] of CORNERS) bar(deck, [sx * hw(0.35), sy * hw(0.35), 0], [sx * hw(0.35), sy * hw(0.35), 0.8], 1.8, 1.8, [1, 0, 0])
// The elevator core: a square shaft up the middle.
bar(red, [0, 0, 0], [0, 0, 74.5], 2.0, 2.0, [1, 0, 0])

// ---- Balconies ---------------------------------------------------------------
balcony(12.3, 1.2, 16.8)
balcony(7.6, 0.8, 35.8)

// ---- Cab -----------------------------------------------------------------------
const CAB = 6.7, CH = 2.0
// Soffit: from the shaft out to the cab, dark.
dark.loft([octo(4.6, 0.6, 74.5), octo(CAB, CH, 78.4)])
dark.cap(octo(4.6, 0.6, 74.5), false)
// Lower deck: a white floor rim, the glazed wall, the railing band.
prism(white, CAB, CH, 78.4, 78.9, false, false)
prism(glazing, CAB - 0.5, CH - 0.2, 78.9, 82.4, false, false)
band(white, CAB, CH, 0.3, 78.9, 80.0)
// Upper deck floor, its edge and railing.
prism(dark, CAB + 0.2, CH + 0.1, 82.4, 83.0, false, true)
deck.cap(octo(CAB + 0.2, CH + 0.1, 83.0), true)
band(white, CAB + 0.2, CH + 0.1, 0.3, 83.0, 84.2)
// The red enclosure, the blue band, the red box and the mast.
prism(red, 4.3, 0.9, 83.0, 85.0, false, false)
prism(blue, 4.4, 0.9, 85.0, 86.1, true, false)
prism(red, 2.7, 0, 86.1, 88.7, true, false)
white.loft([octo(2.85, 0, 88.7), octo(2.85, 0, 89.1)])
white.cap(octo(2.85, 0, 89.1), true)
bar(white, [1.2, 0.8, 89.1], [1.2, 0.8, 91.4], 0.45, 0.45, [1, 0, 0])
bar(white, [-1.6, -1.2, 89.1], [-1.6, -1.2, 90.6], 0.35, 0.35, [1, 0, 0])

// ---- Write ---------------------------------------------------------------------
// Painted red steel: 2019 sun photos #c23b2c, 2007 overcast #a5412f, pulled
// light. Railings white; deck undersides near black in the photos, held at
// charcoal; the band a mid blue.
const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 1) * Math.max(0.25, 1 - p[2] / 95)
const parts = [
  { part: red, material: { ...finish('derrick-red', 0xbd4639), floodlight: flood } },
  { part: white, material: finish('railing-white', 0xf1ede6) },
  { part: dark, material: { ...finish('soffit-charcoal', 0x4f5359), floodlight: (p: V3) => (p[2] > 70 ? 0.8 : 0) } },
  { part: glazing, material: PALETTE.window },
  { part: blue, material: finish('sign-blue', 0x3f5f9e) },
  { part: deck, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
for (const { part, material } of parts) console.log(`  ${material.name}: ${part.triangles}`)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Oil Derrick', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 91.4,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: [],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/dal-six-flags-oil-derrick.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
