/**
 * Fox Plaza (2121 Avenue of the Stars, 1987, Johnson Fain and Pereira
 * Associates), Century City, Los Angeles — original procedural geometry,
 * CC0-1.0.
 *
 *   bun generators/la-fox-plaza.ts
 *
 * Frame: x east, y north turned to bearing 3.5°, z up, metres. Origin at
 * the centre of the plan, 0.2 m from the OSM outline's area centroid, on
 * the lowest ground under it (98.8 m, the south and west corners).
 *
 * The plan is two squares laid over each other: a 41 m square square to
 * the street grid, and a 67 m square turned 45° whose corners point north,
 * east, south and west. Their union is a sixteen-sided star, so the tower
 * reads as a cluster of faceted prisms. It rises in four tiers of that star
 * shape, the diamond's points stepping back first, to a stepped glass crown
 * with a helipad. The faceted star plan, the pink granite banded with blue
 * glass and the stepped glass crown are the identity.
 *
 * Evidence
 * - Plan: OSM relation/5459884, outer way/367173855: square corners at
 *   (-21.7,-19.8) (-19.9,21.6) (19.8,19.8) (17.9,-21.6), diamond points at
 *   (-33.9,2.8) (2.0,33.1) (32.7,-3.2) (-3.8,-34.1) about the anchor area;
 *   drawn as an exact union of a 41.2 m square and a 33.5 m half-diagonal
 *   diamond on one centre. OSM building:part way/367173868 (the 150 m
 *   tower core) is covered.
 * - Heights: LA County lidar surface model (LACounty_Dynamic/Elevation
 *   layer 8, sampled on a 2 m grid): the diamond points stop at 122 m over
 *   the lowest ground, a ring of the star to 135 m, a diamond to its
 *   square's face midpoints at 144 m and the top at 147 m. LARIAC 2020
 *   footprint 201700095851: 146.5 m. Published: 150 m / 492 ft, 35 floors
 *   (Wikipedia); OSM height 150.
 * - Photos (Wikimedia Commons), compared with renders from the same side:
 *   f1 "2121 Avenue of the Stars (Fox Plaza), Sept. 2024" (Alexis Doine,
 *      CC0) — from the east on Avenue of the Stars;
 *   f2 "Fox Plaza HD" (Veldin963, CC BY-SA 3.0) — the crown from below,
 *      south-east;
 *   f3 "Foxplaza la" (public domain) — from the north-west, granite bands;
 *   f4 "Fox Plaza (Los Angeles, Century City) August 2024" (Alexis Doine, CC0).
 *   USGS NAIP orthophoto for the plan and the helipad.
 * - Colour: the photos (rose-brown granite, sky-blue reflective glass),
 *   pulled to the palette's lightness.
 *
 * Estimated: the window bands (the real facade is a ribbon window per floor;
 * drawn as one broad band per two floors), the 26 m half-diagonal of the
 * 135 m tier, the crown's floor lines, the base (the lobby floors, drawn as
 * plain granite with a window per facet). Left out: the low podium wing
 * and the garage, the roof equipment.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, lngLat, rot, prism, panel, wallLen, cap, inset, save } from './la-getty-center'

const O = [-118.41327, 34.05519] as const
const BEARING = 3.5
const CENTRE: XY = [-0.85, -0.15]

const granite = new Part(), win = new Part(), crown = new Part(), roof = new Part(), trim = new Part()

/** The star: a square of half-side s and a diamond of half-diagonal d, counter-clockwise. */
function star(s: number, d: number): XY[] {
  const k = d - s
  if (k <= 0) return [[d, 0], [0, d], [-d, 0], [0, -d]]
  return [
    [d, 0], [s, k], [s, s], [k, s], [0, d], [-k, s], [-s, s], [-s, k],
    [-d, 0], [-s, -k], [-s, -s], [-k, -s], [0, -d], [k, -s], [s, -s], [s, -k],
  ]
}
const diamond = (d: number): XY[] => [[d, 0], [0, d], [-d, 0], [0, -d]]

const S = 20.6, D = 33.5
const FLOOR = 4.0, GROUP = 2 * FLOOR, BASE = 12

/** A banded granite tier: walls z0→z1 with one broad window band per two floors on each facet. */
function tier(ring: XY[], z0: number, z1: number, bandFrom: number) {
  const t = prism(granite, null, ring, z0, z1, { corner: 0.35, bevel: 0.4 })
  const R = t.ring
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], L = wallLen(a, b)
    const m = L > 12 ? 1.4 : 1.0
    // the lobby floors: one window per facet
    if (z0 === 0) panel(win, a, b, m, L - m, 2.5, 9.0, 0.06)
    for (let z = Math.max(z0, bandFrom); z + GROUP <= z1 - 1.2 + 0.01; z += GROUP)
      panel(win, a, b, m, L - m, z + 1.6, z + GROUP - 1.6, 0.06)
  }
  return R
}

// 3. the glass crown: a diamond to the square's face midpoints, then a
// smaller one, each with a granite lip and floor lines
function glassTier(ring: XY[], z0: number, z1: number) {
  prism(crown, null, ring, z0, z1 - 0.8, { corner: 0.3, bevel: 0 })
  prism(trim, null, inset(ring, -0.25), z1 - 0.8, z1, { corner: 0.3, bevel: 0.3 })
  for (let z = z0 + FLOOR; z < z1 - 1.5; z += FLOOR) {
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      panel(trim, a, b, 0.3, wallLen(a, b) - 0.3, z - 0.25, z + 0.25, 0.04)
    }
  }
  return ring
}
// 1. the full star to 122 m: the diamond's points stop here
tier(star(S, D), 0, 122, BASE)
// terrace on the points, between the full star and the next tier
const T2 = star(S, 26)
{
  const lower = inset(star(S, D), 0.4)
  // the ring between the two outlines, as a flat terrace (ear-clipped as a
  // polygon with a slit is fussy; the next tier's walls stand on it, so a
  // full cap of the lower star hidden under the upper tier is enough)
  cap(roof, lower, 122)
}
// 2. the star with shorter points to 135 m, glass (its top floors are
// glazed all round in the photos, below the crown)
glassTier(T2, 122, 135)
cap(roof, inset(T2, 0.4), 135)

glassTier(diamond(20.4), 135, 144)
cap(roof, inset(diamond(20.4), 0.3), 144)
glassTier(diamond(13.5), 144, 147.5)
// the helipad deck
{
  const top = inset(diamond(13.5), 0.3)
  cap(roof, top, 147.5)
}

if (import.meta.main) {
  const [lng, lat] = lngLat(rot(CENTRE, 0), O[0], O[1])
  console.log(`anchor ${lng.toFixed(7)}, ${lat.toFixed(7)}`)
  save('la-fox-plaza', 'Fox Plaza', [
    { part: granite, material: finish('fox-granite', 0xc9a091) },
    { part: win, material: { ...PALETTE.window, color: 0x86a2bd } },
    { part: crown, material: windowVariant(2, 0xa9bfd1) },
    { part: trim, material: finish('fox-granite-light', 0xdcbcae) },
    { part: roof, material: PALETTE.roof },
  ], { bearing: BEARING, elevation: 0, height: 147.5, replaces: ['relation/5459884', 'way/367173868'] })
}
