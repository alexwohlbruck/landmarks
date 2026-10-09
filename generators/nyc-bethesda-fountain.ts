/**
 * Bethesda Fountain, the Angel of the Waters, Bethesda Terrace, Central
 * Park (Emma Stebbins, sculptor; Calvert Vaux and Jacob Wrey Mould; 1873) —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-bethesda-fountain.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Bearing 0: the
 * angel faces true south, toward the terrace and its stairs (the photos
 * from the terrace show her face; those from the Lake her back). Anchor: the
 * fountain's centre as the lidar shows it, ~1 m west and 0.5 m south of the
 * centroid of the OSM pool way/958635828 (amenity=fountain, natural=water,
 * not a building), so `replaces` is empty. y = 0 is the pool's water; the
 * water is the map's. The pool's low granite rim wall (0.75 m) is drawn so
 * the fountain reads as rising from inside its basin.
 *
 * Evidence
 * - Published (Wikipedia; Central Park Conservancy; NYC Parks): bronze angel
 *   8 ft (2.4 m) tall, the first public sculpture by a woman in New York;
 *   she blesses the water with her right hand and holds lilies in her left;
 *   four cherubs (Temperance, Purity, Health and Peace) under the upper basin.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 0.5 m, sparse over the fountain:
 *   the lower basin's rim +3.0 m over a ~5.4 m circle, the upper basin
 *   +6.0 m, the angel's head and wings +8.75 m (all above the water).
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-bethesda-fountain/photos/credits.txt: Christian
 *   David (CC BY-SA 4.0: the front from the south; from the terrace above;
 *   the back from the Lake), PumpkinSky (public domain, the whole fountain
 *   from the south), Julian Lupyan (CC0, the angel close), Jay Dobkin
 *   (CC BY-SA 4.0, from the terrace stairs).
 *
 * Estimated from the front photos scaled to the lidar heights: the octagonal
 * granite base (5.0 m across the flats, 0.9 m above the water) with its carved band, the
 * ring of eight short granite columns (to 2.1 m) round a core, the lower
 * basin's bowl (5.3 m across the flats) and rim, the octagonal pedestal of
 * the cherub group, the leafy stem, the upper basin (2.9 m across), the rock
 * under the angel's feet, her pose (weight forward, right arm out and down,
 * lilies on her left), the gown's flare and the 3.4 m span of her raised
 * wings. Cherubs are four bold small figures round the stem; the fountain's
 * jets and the carving are left out.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { TAU, smooth, solid, lathe, ellipsoid, tube, slab, turnSince, unit } from './nyc-columbus-monument'
import { ell } from './nyc-uss-maine-monument'

const granite = new Part(), basin = new Part(), cols = new Part(), bronze = new Part()

/** An octagonal lathe with flats facing the axes (vertex radius given). */
function oct(p: Part, prof: [number, number][], cap = true) {
  const from = p.pos.length
  lathe(p, prof, 8, 0, 0, cap)
  turnSince(p, from, Math.PI / 8)
}
const V = 1 / Math.cos(Math.PI / 8) // apothem → vertex radius

// --- The octagonal granite base standing in the pool, its carved band and
// stepped top. ---
oct(granite, ([[2.5, 0], [2.5, 0.42], [2.4, 0.48], [2.4, 0.62], [2.52, 0.68], [2.15, 0.78], [2.15, 0.88]] as [number, number][]).map(([a, z]) => [a * V, z]))
// The ring of eight short granite columns and the core they stand round.
oct(granite, ([[1.15, 0.88], [1.15, 2.1]] as [number, number][]).map(([a, z]) => [a * V, z]), false)
for (let k = 0; k < 8; k++) {
  const a = k * TAU / 8, cx = 1.85 * Math.cos(a), cy = 1.85 * Math.sin(a)
  smooth(cols, q => lathe(q, [[0.24, 0.88], [0.24, 0.98], [0.17, 1.03], [0.15, 1.92], [0.22, 1.99], [0.24, 2.1]], 8, cx, cy, false), 50)
}
// --- The lower basin: a broad octagonal bowl with a wide rim, dished inside. ---
oct(basin, ([[1.75, 2.08], [2.15, 2.15], [2.55, 2.38], [2.78, 2.68], [2.84, 2.84], [2.84, 2.98], [2.6, 3.0], [2.55, 2.88]] as [number, number][]).map(([a, z]) => [a * V, z]))
// Its soffit under the bowl, closed.
oct(basin, ([[1.15, 2.1], [1.75, 2.08]] as [number, number][]).map(([a, z]) => [a * V, z]), false)
// The cherubs' octagonal pedestal.
oct(granite, ([[1.05, 2.88], [1.05, 3.1], [0.95, 3.15], [0.95, 3.38], [1.02, 3.42], [0.9, 3.46]] as [number, number][]).map(([a, z]) => [a * V, z]))

// --- The great basin's low rim: a granite kerb wall ~0.75 m high round the
// pool (OSM way/958635828, 28 m across, centred ~1 m east and 0.5 m north of
// the fountain). The water inside it is the map's. ---
{
  const n = 40, cx = 1.0, cy = 0.5, ro = 14.1, ri = 13.4, h = 0.75
  const at = (r: number, k: number, z: number): V3 => [cx + r * Math.cos(k * TAU / n), cy + r * Math.sin(k * TAU / n), z]
  for (let k = 0; k < n; k++) {
    const l = k + 1
    granite.quad(at(ro, k, 0), at(ro, l, 0), at(ro, l, h), at(ro, k, h))
    granite.quad(at(ri, l, 0), at(ri, k, 0), at(ri, k, h), at(ri, l, h))
    granite.quad(at(ri, k, h), at(ro, k, h), at(ro, l, h), at(ri, l, h))
  }
}

// --- Bronze: the cherub group, stem, upper basin, rock and the angel. ---
smooth(bronze, q => {
  // A low mound under the cherubs.
  lathe(q, [[0.85, 3.46], [0.8, 3.54], [0.55, 3.6]], 12, 0, 0, true)
  // The stem, flaring into leaves under the upper basin.
  lathe(q, [[0.42, 3.5], [0.34, 4.0], [0.3, 4.65], [0.4, 4.95], [0.55, 5.1]], 10, 0, 0, false)
  // Four cherubs facing out on the diagonals, ~1 m tall, an arm raised.
  for (let k = 0; k < 4; k++) {
    const a = Math.PI / 4 + k * Math.PI / 2, ca = Math.cos(a), sa = Math.sin(a)
    const P = (r: number, side: number, z: number): V3 => [r * ca - side * sa, r * sa + side * ca, 3.58 + z]
    tube(q, [P(0.55, -0.08, 0), P(0.55, -0.08, 0.38)], [0.08, 0.09], 6)
    tube(q, [P(0.55, 0.08, 0), P(0.55, 0.08, 0.38)], [0.08, 0.09], 6)
    ellipsoid(q, P(0.55, 0, 0.6), [0.17, 0.17, 0.27], 8, 4)
    ellipsoid(q, P(0.57, 0, 0.95), [0.12, 0.12, 0.13], 8, 4)
    const s = k % 2 ? 1 : -1
    tube(q, [P(0.55, s * 0.15, 0.78), P(0.62, s * 0.3, 1.0), P(0.66, s * 0.32, 1.22)], [0.055, 0.05, 0.045], 5)
    tube(q, [P(0.55, -s * 0.15, 0.78), P(0.62, -s * 0.2, 0.6)], [0.055, 0.05], 5)
  }
  // The upper basin, a shallow bowl with a lipped rim.
  lathe(q, [[0.5, 5.07], [0.85, 5.2], [1.2, 5.47], [1.44, 5.76], [1.5, 5.88], [1.38, 5.92], [1.32, 5.84]], 16, 0, 0, true)
}, 50)
// The rock she stands on.
smooth(bronze, q => ellipsoid(q, [0, 0, 5.98], [0.5, 0.45, 0.32], 10, 4), 60)

// The angel: 2.4 m, facing −y, alighting with her weight forward.
const ZF = 6.22, H = 2.42
smooth(bronze, q => {
  const at = (x: number, y: number, z: number): V3 => [x * H, y * H, ZF + z * H]
  // Feet.
  ellipsoid(q, at(-0.05, -0.06, 0.02), [0.04 * H, 0.08 * H, 0.03 * H], 6, 3)
  ellipsoid(q, at(0.06, 0.02, 0.03), [0.04 * H, 0.08 * H, 0.03 * H], 6, 3)
  // The gown: flaring at the hem, billowing out behind on her left, gathered at the waist.
  solid(q, [
    ell(0.02 * H, 0.02 * H, ZF + 0.04 * H, 0.2 * H, 0.15 * H, 12),
    ell(0.03 * H, 0.03 * H, ZF + 0.18 * H, 0.19 * H, 0.14 * H, 12),
    ell(0.02 * H, 0.01 * H, ZF + 0.45 * H, 0.13 * H, 0.1 * H, 12),
    ell(0.0, 0.0, ZF + 0.6 * H, 0.1 * H, 0.08 * H, 12),
    ell(0.0, 0.0, ZF + 0.72 * H, 0.12 * H, 0.08 * H, 12),
    ell(0.0, 0.01 * H, ZF + 0.8 * H, 0.14 * H, 0.08 * H, 12),
    ell(0.0, 0.01 * H, ZF + 0.84 * H, 0.06 * H, 0.05 * H, 12),
  ])
  // The billow of drapery at her left hip and the lilies held against it.
  ellipsoid(q, at(0.1, 0.04, 0.3), [0.07 * H, 0.07 * H, 0.17 * H], 8, 4)
  tube(q, [at(0.15, -0.07, 0.38), at(0.17, -0.08, 0.6), at(0.19, -0.06, 0.82)], [0.022 * H, 0.02 * H, 0.03 * H], 5)
  // Head, a little bowed.
  ellipsoid(q, at(0, -0.02, 0.91), [0.06 * H, 0.068 * H, 0.08 * H], 8, 4)
  // Right arm out and down over the water; left arm down holding the lilies.
  tube(q, [at(-0.14, 0, 0.8), at(-0.22, -0.06, 0.66), at(-0.29, -0.16, 0.58), at(-0.31, -0.2, 0.57)], [0.04 * H, 0.035 * H, 0.03 * H, 0.025 * H], 6)
  tube(q, [at(0.14, 0, 0.8), at(0.19, -0.04, 0.64), at(0.17, -0.08, 0.52)], [0.04 * H, 0.035 * H, 0.03 * H], 6)
}, 60)
// Wings, spread and raised, from her shoulder blades, a little swept back.
for (const s of [-1, 1]) {
  // Upper edge near level at head height, feathers sweeping down to the
  // waist at the root; the tips just above her head.
  const U = unit([s * 1, 0.3, 0.1]), W: V3 = [0, 0.12, 1]
  slab(bronze, [s * 0.12, 0.16, ZF + 1.95], U, W,
    [[0, -0.38], [0.35, -0.14], [0.75, 0.04], [1.15, 0.17], [1.5, 0.28], [1.62, 0.4], [1.3, 0.46], [0.8, 0.48], [0.3, 0.45], [0, 0.34]], 0.1)
}

finishModel('Bethesda Fountain', 'nyc-bethesda-fountain', [
  { part: granite, material: { name: 'granite', color: 0x8a8580, roughness: 0.85 } },
  { part: cols, material: { name: 'granite-red', color: 0xa38a7f, roughness: 0.8 } },
  { part: basin, material: { name: 'basin', color: 0xa59a8c, roughness: 0.85 } },
  { part: bronze, material: { name: 'bronze', color: 0x56635c, roughness: 0.7 } },
], { bearing: 0, osm: 'way/958635828', height: 8.75 }, 6500)
