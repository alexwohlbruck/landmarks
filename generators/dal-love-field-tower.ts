/**
 * Dallas Love Field air traffic control tower — procedural, CC0-1.0, no
 * textures.
 *
 *   bun generators/dal-love-field-tower.ts
 *
 * Frame: x east, y north, z up, metres, bearing 0. Anchor: centroid of the
 * tower's OSM outline way/744685687 (an octagon 9 m across the flats, its
 * flats facing the compass points), -96.84940 32.84518, just east of the
 * gate concourse's spine. OSM node/4407814179 carries the name.
 *
 * Identifying features (photos): a slender octagonal shaft of pale grey
 * concrete with a narrow strip of louvres up one face; below the cab two
 * wider service levels, each ringed by a pale railed catwalk; the cab, an
 * octagon of dark glass leaning outward, under a deep white fascia that
 * flares out to the roof; antennas on top. A one-storey base building joins
 * its foot on the north.
 *
 * Evidence
 * - OSM: way/744685687 (tower), way/443151009 (its base building, 26 × 25 m
 *   with an angled notch round the tower), in this frame; no heights.
 * - Lidar: USGS 3DEP TX_Pecos_Dallas_B3_2018 (flown 2018), 0.5 m,
 *   work/dal-love-field-tower/lidar.json, above the apron round the foot
 *   (0–1 m over ground_min): cab roof 44–45 m over a 13 m spread (the
 *   fascia), 48 m at the antennas; base building 4–5 m. The returns sit
 *   about 2 m south-east of the OSM octagon; the model follows OSM.
 * - Photos:
 *   https://commons.wikimedia.org/wiki/File:KDAL_ATCT_(2986073040).jpg
 *     (Cory W. Watts, CC BY-SA 2.0) the top close: cab, fascia, two
 *     catwalk levels, the louvre strip;
 *   https://commons.wikimedia.org/wiki/File:As_luck_would_have_it_(3013696220).jpg
 *     (Cory W. Watts, CC BY-SA 2.0) the top from another side;
 *   https://commons.wikimedia.org/wiki/File:DallasLoveFieldEastConcourse-2009.JPG
 *     (LoneStarMike, CC BY 3.0) the whole tower from the apron, beside the
 *     old terminal: its proportions.
 *
 * Estimated from the photos, scaled to the lidar's 44.5 m roof and OSM's
 * 9 m shaft: lower service level 33–36.2 m, upper 36.8–38.6 m (both 12.6 m
 * across with catwalks), cab glass 38.6–41.6 m, fascia to 44.5 m; one mast
 * for the antennas. Doubt: the photos are from 2008–2009, before the 2014
 * terminal rebuild; the 2018 lidar shows the same tower standing.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, area, capPoly, facade, finishModel, unit, type Facade } from './nyc-570-lexington'

const conc = new Part(), win = new Part(), roof = new Part(), trim = new Part(), dark = new Part()
const ccw = (r: XY[]) => (area(r) < 0 ? r.slice().reverse() : r)
const CX = 0, CY = 0.3
/** A regular octagon with its flats facing the compass points; r = half the width across the flats. */
const oct = (r: number): XY[] => Array.from({ length: 8 }, (_, i) => { const t = Math.PI / 8 + (i * Math.PI) / 4, R = r / Math.cos(Math.PI / 8); return [CX + R * Math.cos(t), CY + R * Math.sin(t)] as XY })
function band(p: Part, r0: XY[], z0: number, r1: XY[], z1: number) {
  const n = r0.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    p.quad([r0[i][0], r0[i][1], z0], [r0[j][0], r0[j][1], z0], [r1[j][0], r1[j][1], z1], [r1[i][0], r1[i][1], z1])
  }
}

// --- Base building (OSM way/443151009), 4.5 m ---
{
  const ring = ccw([[-3.9, 9.5], [-12.1, 9.6], [-12.0, 34.0], [14.2, 33.9], [14.1, 9.5], [4.0, 9.5], [4.0, 6.9], [7.0, 3.9], [4.5, 1.5], [1.3, 4.7], [-1.2, 4.8], [-4.5, 1.5], [-6.9, 4.0], [-3.9, 6.9]])
  const f: Facade = { bay: 5, ratio: 0.7, floor: 2.2, group: 1, spandrel: 0, sill: 1.0, head: 0.8, ground: 1.0, minLength: 3.5 }
  for (let i = 0; i < ring.length; i++) facade(conc, win, ring[i], ring[(i + 1) % ring.length], 0, 4.1, f)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    trim.quad([a[0] + n[0] * 0.1, a[1] + n[1] * 0.1, 4.1], [b[0] + n[0] * 0.1, b[1] + n[1] * 0.1, 4.1], [b[0] + n[0] * 0.1, b[1] + n[1] * 0.1, 4.5], [a[0] + n[0] * 0.1, a[1] + n[1] * 0.1, 4.5])
  }
  capPoly(roof, ring, 4.5)
}

// --- Shaft: 9 m octagon, a louvre strip up the west face ---
band(conc, oct(4.5), 0, oct(4.5), 33)
{
  const x = CX - 4.5 - 0.05
  dark.quad([x, CY + 0.7, 6], [x, CY - 0.7, 6], [x, CY - 0.7, 32], [x, CY + 0.7, 32])
}

// --- Two service levels, each a wider octagon with dark windows and a pale railed catwalk ---
function level(z0: number, z1: number) {
  band(conc, oct(5.0), z0, oct(5.0), z1)
  const R = oct(5.0)
  for (let i = 0; i < 8; i++) {
    const a = R[i], b = R[(i + 1) % 8]
    const u: XY = [b[0] - a[0], b[1] - a[1]], n = unit([u[1], -u[0], 0])
    const P = (t: number, z: number): V3 => [a[0] + u[0] * t + n[0] * 0.05, a[1] + u[1] * t + n[1] * 0.05, z]
    win.quad(P(0.12, z0 + 0.6), P(0.88, z0 + 0.6), P(0.88, z1 - 0.5), P(0.12, z1 - 0.5))
  }
  // catwalk deck and its railing as one pale band
  capPoly(trim, oct(6.4), z0 - 0.3, false)
  band(trim, oct(6.4), z0 - 0.3, oct(6.4), z0 + 1.1)
  capPoly(trim, oct(6.4), z0 + 1.1)
}
capPoly(conc, oct(5.0), 33, false)
level(33, 36.2)
band(conc, oct(5.0), 36.2, oct(5.0), 36.8)
level(36.8, 38.6)

// --- The cab: dark glass leaning out, a deep white fascia flaring to the roof, a mast ---
band(trim, oct(5.0), 38.6, oct(5.6), 38.9)
band(win, oct(5.6), 38.9, oct(6.5), 41.6)
band(trim, oct(6.5), 41.6, oct(6.9), 44.5)
capPoly(roof, oct(6.9), 44.5)
{
  const m = oct(0.3)
  band(trim, m, 44.5, m, 48.5)
  capPoly(trim, m, 48.5)
  const r = oct(2.2)
  band(conc, r, 44.5, r, 45.6)
  capPoly(roof, r, 45.6)
}

finishModel('Dallas Love Field Air Traffic Control Tower', 'dal-love-field-tower', [
  { part: conc, material: finish('dal-tower-concrete', 0xd8d6cf) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: trim, material: PALETTE.trim },
  { part: dark, material: finish('dal-tower-louvre', 0x8a8c8e) },
], { bearing: 0, osm: 'way/744685687', height: 48.5 }, 5000)
