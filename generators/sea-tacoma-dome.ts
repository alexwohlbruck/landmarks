/**
 * Tacoma Dome (1983, McGranahan Messenger Associates; Western Wood Structures'
 * Varax timber dome), Tacoma: procedural, CC0-1.0.
 * bun generators/sea-tacoma-dome.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; built in the street grid's
 * frame (bearing 351°, the OSM walls of the north hall run 350.7-350.9°),
 * which only matters for the hall: the dome is round. The origin is the
 * area centroid of OSM way/32660308 (-122.4270038, 47.2368426); the dome's
 * centre is 2.0 m east and 19.6 m south of it. y = 0 is the lowest ground
 * the outline touches (31.3 m NAVD88), on the north, where the site falls
 * away from the plaza that rings the dome's south side (9 m higher).
 *
 * Form: a shallow spherical dome of triangulated timber panels, white since
 * its repainting, on a low round base of dark brown panels with a dark band
 * under the eave, crowned by a flat lid over a short drum. North of it a
 * concourse deck joins a flat-roofed exhibition hall.
 *
 * Sources
 * - OSM: way/32660308 (outline, stadium, Q1570942) and its parts
 *   way/1352265453 (the dome, 44 m) and way/1352265454 (the crown, 45 m);
 *   the outline also takes in the deck and the hall to the north.
 * - Lidar (measured, USGS 3DEP WA_PierceCounty_1_2020, 1 m surface model,
 *   radial profile about the centre): the roof is a sphere of radius
 *   115.5 m to within 0.04 m RMS from r = 17 to r = 81; eave at r = 81,
 *   14.3 above y = 0; the sphere would peak at 47.4; the crown lid is flat at
 *   50.0 out to r ~12, its edge at r 13-14; ground 9 m on the south and east,
 *   0-5 m on the north and west; the deck at 7.5, the hall's roof at 10
 *   (x -53..33, y 71.5..107.5).
 * - Published: 530 ft (161.5 m) across, 152 ft (46 m) high; one of the
 *   largest wood-domed structures (Wikipedia, "Tacoma Dome").
 * - Photos (Wikimedia Commons; credits in
 *   /tmp/city/sea/work/sea-tacoma-dome/credits.txt): Joe Mabel 2021-22
 *   (from Interstate 5, west and north), SounderBruce 2024 (from the Pacific
 *   Avenue overpass, the white roof), Chris Light (from the north-west,
 *   two), Visitor7 (the base), Murphpics (aerial), Broran28 (from the
 *   north, before the repainting).
 * From photos: the roof is now white (it was blue-grey before 2018); its
 *   panels read as rings of large flat triangles, shown here as a
 *   flat-shaded geodesic (seven rings, 30 panels round at the eave down to 12
 *   under the crown, every other node 2 m proud of the measured sphere so
 *   neighbouring panels tilt apart and catch the light differently) rather
 *   than lines; the base's dark brown
 *   panels with the dark band under the eave; the crown's white lid over a
 *   grey drum.
 * Estimated: the facet layout (a regular tiered triangulation, not the real
 *   Varax pattern), the base's band heights, the hall's walls (plain).
 * Left out: the "TACOMA DOME" sign (signage), the flagpole, the entrance
 *   canopies and stairs.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, rect, capRing, arc, lathe, disc, ccw, finishGlb, writeModel } from './sea-tacoma-union-station'

const CX = 2.0, CY = -19.6
const R = 115.5, Z0 = -68.06 // the roof's sphere
const EAVE_R = 81
const zAt = (r: number) => Z0 + Math.sqrt(R * R - r * r)
const EAVE = zAt(EAVE_R) // 14.3
const FOLD = 2.0

function build() {
  const roofW = new Part(), wall = new Part(), band = new Part(), flat = new Part(), concrete = new Part()

  // ------------------------------------------------------------ the dome
  // A geodesic of flat triangular panels, ~15-20 m, in seven rings from the
  // eave to the crown, fewer panels round each ring as it rises (30 at the
  // eave, 12 under the crown), each ring turned half a panel from the one
  // below so the panels zigzag. Every face is flat-shaded: no lines, the
  // panels show by how each catches the light, as on the real roof.
  const rings: { r: number; n: number }[] = []
  const tEave = Math.asin(EAVE_R / R), tTop = Math.asin(14.2 / R)
  const counts = [30, 30, 24, 24, 18, 18, 12, 12]
  for (let k = 0; k < counts.length; k++) {
    const t = tEave + ((tTop - tEave) * k) / (counts.length - 1)
    rings.push({ r: R * Math.sin(t), n: counts[k] })
  }
  const ringPts = rings.map(({ r, n }, k) => Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI * (i + (k % 2) * 0.5)) / n
    // every other node of a ring stands proud of the sphere, so neighbouring
    // panels tilt opposite ways: the zigzag of lit and shaded triangles the
    // real roof shows, with no ring reading as a step
    const lift = k > 0 && k < counts.length - 1 && i % 2 ? FOLD : 0
    const t = Math.asin(r / R), rr = r + lift * Math.sin(t), zz = zAt(r) + lift * Math.cos(t)
    return { a, p: [CX + rr * Math.cos(a), CY + rr * Math.sin(a), zz] as V3 }
  }))
  // stitch each pair of rings by walking round both in angle order
  for (let k = 0; k + 1 < ringPts.length; k++) {
    const lo = ringPts[k], hi = ringPts[k + 1]
    const base = Math.min(lo[0].a, hi[0].a)
    const ang = (q: { a: number }, i: number, len: number) => q.a + 2 * Math.PI * Math.floor(i / len)
    let i = 0, j = 0
    while (i < lo.length || j < hi.length) {
      const a0 = lo[i % lo.length], b0 = hi[j % hi.length]
      const na = ang(lo[(i + 1) % lo.length], i + 1, lo.length) - base
      const nb = ang(hi[(j + 1) % hi.length], j + 1, hi.length) - base
      if (j >= hi.length || (i < lo.length && na <= nb)) {
        roofW.tri(a0.p, lo[(i + 1) % lo.length].p, b0.p)
        i++
      } else {
        roofW.tri(a0.p, hi[(j + 1) % hi.length].p, b0.p)
        j++
      }
    }
  }
  // a slight lip at the eave
  lathe(roofW, CX, CY, [[EAVE_R - 0.3, EAVE - 0.9], [EAVE_R + 0.6, EAVE - 0.2], [EAVE_R + 0.6, EAVE + 0.05]], 56)

  // the crown: a grey drum under a white lid
  const zr = zAt(14.2)
  lathe(flat, CX, CY, [[13.2, zr - 0.6], [13.2, 49.2]], 28)
  // the drum meets the top tier: close the gap under it with a cap
  disc(flat, CX, CY, 14.3, zr - 0.05, 28)
  lathe(roofW, CX, CY, [[13.0, 49.0], [14.0, 49.2], [14.0, 50.0]], 28)
  disc(roofW, CX, CY, 14.0, 50.0, 28)

  // ------------------------------------------------------------ the base
  // dark brown panels, with a darker band under the eave
  lathe(wall, CX, CY, [[EAVE_R - 0.2, 0], [EAVE_R - 0.2, EAVE - 3.4]], 56)
  lathe(band, CX, CY, [[EAVE_R - 0.2, EAVE - 3.4], [EAVE_R - 0.2, EAVE - 0.7]], 56)

  // ------------------------------------------------------------ the north deck and hall
  // The deck between the dome and the hall: the outline north of the dome,
  // its south edge following the dome's base.
  const deckZ = 7.5
  const deck = ccw([
    [70.7, 25.5], [65.5, 33.2], [65.5, 45.0], [65.4, 65.1], [35.4, 65.0], [35.4, 68.2], [33.0, 68.2], [33.0, 71.5],
    [-55.6, 71.5], [-55.5, 51.3], [-55.5, 41.2], [-62.4, 34.2], [-68.1, 26.6],
    ...arc(CX, CY, EAVE_R - 1, 146, 34, 16),
  ])
  // draw the deck as walls plus a top; its inner (dome-side) edge is hidden by the base
  prism(concrete, flat, deck, 0, deckZ, 25)
  // The exhibition hall.
  const hall = rect(-53.2, 71.5, 33.0, 107.6)
  prism(concrete, null, hall, 0, 9.0)
  prism(band, null, rect(-53.2, 71.5, 33.0, 107.6), 9.0, 10.0)
  capRing(flat, hall, 10.0)

  return finishGlb('Tacoma Dome', [
    { part: roofW, material: finish('td-roof', 0xe8ebeb) },
    { part: wall, material: finish('td-base', 0x6f5547) },
    { part: band, material: finish('td-band', 0x5b6168) },
    { part: flat, material: PALETTE.roof },
    { part: concrete, material: finish('td-concrete', 0xd6d2ca) },
  ], { bearing: 351, height: 50.0, replaces: ['way/32660308', 'way/1352265453', 'way/1352265454'] })
}

if (import.meta.main) await writeModel('sea-tacoma-dome', build())
