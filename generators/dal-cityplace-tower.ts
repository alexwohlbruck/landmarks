/**
 * Cityplace Tower (1988, Araldo Cossutta; built as Cityplace Center East
 * for Southland Corporation, the first of two planned twin towers), 2711
 * North Haskell Avenue, Uptown Dallas: original procedural geometry, CC0-1.0.
 * bun generators/dal-cityplace-tower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the
 * centroid of OSM way/26329683, -96.7923920 32.8055209) on the lowest ground
 * under the footprint. Placed at bearing 0: the plan is square to north.
 *
 * Form: a 42-storey square tower, 50 x 58 m, of red-brown granite with
 * punched windows. The east and west faces each carry two chamfered shafts
 * that stand 7 m proud and flank a recessed bronze-glass slot running the
 * full height up the middle. The north and south faces carry three shallow
 * granite piers, and the corners are notched. At the top the tower splits
 * along the slot into two halves, each a stepped gable that climbs in 7 m
 * steps from its outer face to a peak beside the slot, so from the east or
 * west the crown is two stepped peaks with a notch between them; the
 * shafts stop just below the peaks, in front of them. Low triangular lobby
 * wings stand against the north and south faces.
 *
 * Identifying features, in order: the twin stepped peaks with the notch
 * between them; the chamfered shafts and the glass slot on the east and
 * west faces; the red-brown granite; the stepped corners.
 *
 * Sources
 * - OSM way/26329683 (building=yes, height 164, 42 levels, wikidata
 *   Q7829750): the plan, used as drawn (shafts, piers, corner notches),
 *   symmetrised to within 0.3 m. way/710355796 and way/710355797 (height 5):
 *   the triangular lobby wings south and north.
 * - Lidar (measured): USGS 3DEP TX_Pecos_Dallas_B3_2018 (2018 flight), 1 m
 *   grid. Nothing above about 49 m returns over the tower, so it gives the
 *   footprint only (x -30..+32, y -38..+32, matching OSM); the lobby wings
 *   return at about 16 m, not OSM's 5 m, and the model follows the lidar.
 * - Mapterhorn terrain: flat to within 0.5 m across the site.
 * - NAIP (USGS) orthophoto: the plan, the slot's glass roof running east-
 *   west across the top, the wings' granite roofs.
 * - Published: 171 m (560 ft) to the roof, 42 storeys, 1984-88, Cossutta &
 *   Associates (Araldo Cossutta); Brazilian red granite; a twin tower west
 *   of the expressway was planned and cancelled (Wikipedia, "Cityplace
 *   Tower").
 * - Photos (shapes and colours come from these):
 *   - "Cityplace Tower in Dallas, Texas.jpg", Drumguy8800 at English
 *     Wikipedia, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Cityplace_Tower_in_Dallas,_Texas.jpg
 *     (crown from the east or west: the two stepped peaks, the shafts in
 *     front of them, the glass slot, the stepped wings)
 *   - "Cityplace Center 1988.jpg", Justin Cozart, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Cityplace_Center_1988.jpg
 *     (whole east/west elevation under construction: proportions of shafts,
 *     slot and wings, the slot open between the peaks)
 *   - "Uptown Dallas.jpg", Aceplace at English Wikipedia, CC BY 2.5,
 *     https://commons.wikimedia.org/wiki/File:Uptown_Dallas.jpg
 *     (from the south-west on McKinney Avenue: granite colour in daylight,
 *     south-face piers, the crown's silhouette)
 *   - "Downtown Dallas with CityPlace skyline in foreground", skys the
 *     limit2 (Flickr), CC BY 2.0,
 *     https://www.flickr.com/photos/52949402@N03/47270068882
 *     (distant, from the north-west: slot and notch at the top)
 * - Look-only: none used.
 *
 * Numbers
 * - Plan: OSM (and the lidar footprint).
 * - Peaks 171 m: published. Steps 164, 157, 150 m toward the outer faces,
 *   the shafts' tops 166 m, the slot's roof 160 m: estimated from the
 *   Drumguy8800 and Cozart photos (about 0.09 m/px on the Cozart elevation,
 *   scaled to the published height). The notch is drawn a little deeper
 *   than it reads (11 m) so it holds at phone size.
 * - Lobby wings 11 m walls, 16 m apex: measured (lidar) top, estimated eaves.
 * - Window panels group three storeys of 4.07 m (171 m / 42).
 *
 * Doubts
 * - No lidar above 49 m and few licensed photos: no photo shows the north
 *   or south face's crown head-on, so its flat top with notched corners is
 *   inferred from the oblique views.
 * - The bronze slot glass is drawn as one colour; at sunset it reads gold.
 * - Left out: the shafts' bracketed cornices, the arched portal at the foot
 *   of the slot, the small domes on the roof, the rooftop masts.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { prism, box, panels, poly, type PanelOpts } from './dal-chase-tower'
import { finishGlb, type XY } from './sea-columbia-center'

/** Window panels on an axis-aligned face. `side` is the way it faces. */
function face(part: Part, side: 'N' | 'S' | 'E' | 'W', c: number, s0: number, s1: number, z0: number, z1: number, g: PanelOpts, edge = 0.8) {
  const L = s1 - s0
  const [a, b]: [XY, XY] =
    side === 'S' ? [[s0, c], [s1, c]] : side === 'N' ? [[s1, c], [s0, c]] : side === 'W' ? [[c, s1], [c, s0]] : [[c, s0], [c, s1]]
  panels(part, a, b, z0, z1, [[edge, L - edge]], g)
}

/** A flat sheet on an axis-aligned face, proud by `p`. */
function sheet(part: Part, side: 'N' | 'S' | 'E' | 'W', c: number, s0: number, s1: number, z0: number, z1: number, p = 0.06) {
  const n: V3 = side === 'N' ? [0, 1, 0] : side === 'S' ? [0, -1, 0] : side === 'E' ? [1, 0, 0] : [-1, 0, 0]
  const P = (s: number, z: number): V3 => (side === 'N' || side === 'S' ? [s, c + n[1] * p, z] : [c + n[0] * p, s, z])
  poly(part, [P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1)], n)
}

function build() {
  const H = 171
  // plan
  const BX = 24.8, BY = 29.1 // body faces
  const NX = 22.3, NY = 25.9 // corner notches
  const SL = 5.0, SH = 14.7 // shafts span |y| SL..SH on the east and west faces
  const SX = 31.7 // shafts' front
  const PY = 31.1 // piers' front on the north and south faces
  const PIERS: [number, number][] = [[-17.6, -9.4], [-4.1, 4.1], [9.4, 17.6]]
  // crown: [|y| from, |y| to, top] for each half
  const OUTER = 150, STEPS: [number, number, number][] = [[SL, NY, 157], [SL, 19, 164], [SL, 13.5, H]]
  const CORE = 160, SHAFT = 166

  const granite = new Part(), win = new Part(), slot = new Part(), roof = new Part()

  // --- body to the outer step, with notched corners
  const body: XY[] = [[BX, -NY], [BX, NY], [NX, NY], [NX, BY], [-NX, BY], [-NX, NY], [-BX, NY], [-BX, -NY], [-NX, -NY], [-NX, -BY], [NX, -BY], [NX, -NY]]
  prism(granite, granite, body, 0, OUTER, 0.5)
  // --- the two halves' stepped gables
  for (const s of [-1, 1]) {
    let z0 = OUTER - 0.5
    for (const [a, b, top] of STEPS) {
      const y0 = s > 0 ? a : -b, y1 = s > 0 ? b : -a
      box(granite, granite, -BX, BX, y0, y1, z0, top, 0.5)
      z0 = top - 0.5
    }
  }
  // the slot's core between the halves, glass-roofed
  box(granite, slot, -BX + 1.5, BX - 1.5, -SL - 0.3, SL + 0.3, OUTER - 0.5, CORE, 0)

  // --- shafts on the east and west faces
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const r: XY[] = [[BX - 0.3, SL], [SX - 2, SL], [SX, SL + 3.2], [SX, SH - 3.2], [SX - 2, SH], [BX - 0.3, SH]]
    prism(granite, granite, r.map(([x, y]) => [sx * x, sy * y] as XY), 0, SHAFT, 0.4)
  }
  // --- piers on the north and south faces
  for (const sy of [-1, 1]) for (const [x0, x1] of PIERS) {
    box(granite, granite, x0, x1, sy > 0 ? BY - 0.3 : -PY, sy > 0 ? PY : -BY + 0.3, 0, OUTER + 1.5, 0.4)
  }

  // --- the glass slot between the shafts, ground to the core's roof
  for (const sx of [-1, 1]) {
    sheet(slot, sx > 0 ? 'E' : 'W', sx * BX, -SL + 0.2, SL - 0.2, 0, CORE - 0.4)
    // granite spandrel bands across it every three storeys, as in the photos
    for (let z = 3 * 4.07; z < CORE - 4; z += 3 * 4.07) box(granite, granite, sx > 0 ? BX - 0.3 : -BX - 0.35, sx > 0 ? BX + 0.35 : -BX + 0.3, -SL, SL, z - 0.6, z + 0.6, 0)
  }

  // --- lobby wings, triangular, granite pyramids
  for (const sy of [-1, 1]) {
    const tri: XY[] = [[22.1, sy * (BY - 0.3)], [0, sy * 52.9], [-22.4, sy * (BY - 0.3)]]
    prism(granite, null, tri, 0, 11, 0.6)
    const apex: V3 = [0, sy * 37, 16.5]
    const t3: V3[] = tri.map(([x, y]) => [x, y, 11] as V3)
    for (let i = 0; i < 3; i++) {
      const a = t3[i], b = t3[(i + 1) % 3]
      const mx = (a[0] + b[0]) / 2 - apex[0], my = (a[1] + b[1]) / 2 - apex[1]
      poly(granite, [a, b, apex], [mx, my, 4])
    }
  }

  // --- punched windows: three storeys a panel, granite dominant
  const g: PanelOpts = { group: 3 * 4.07, spandrel: 5.2, bayW: 2.2, pier: 2.6, zMin: 5 }
  for (const sx of [-1, 1]) {
    const side = sx > 0 ? 'E' : 'W'
    for (const sy of [-1, 1]) {
      const lo = (a: number, b: number): [number, number] => (sy > 0 ? [a, b] : [-b, -a])
      // the wing beside the shaft, by crown band
      const [a1, b1] = lo(SH, 19), [a2, b2] = lo(19, NY)
      face(win, side, sx * BX, a1, b1, 0, 164, g, 0.9)
      face(win, side, sx * BX, a2, b2, 0, 157, g, 0.8)
      // shaft fronts and sides
      const [a3, b3] = lo(SL + 3.2, SH - 3.2)
      face(win, side, sx * SX, a3, b3, 0, SHAFT, { ...g, bayW: 1.8 }, 0.6)
      const ys = [SL, SH]
      for (const y of ys) {
        const yy = sy * y, outwardN = (sy > 0) === (y === SH)
        const x0 = sx > 0 ? BX : -SX + 2, x1 = sx > 0 ? SX - 2 : -BX
        face(win, outwardN ? 'N' : 'S', yy, x0, x1, 0, SHAFT, { ...g, bayW: 2.0 }, 0.7)
      }
    }
  }
  for (const sy of [-1, 1]) {
    const side = sy > 0 ? 'N' : 'S'
    const xs: [number, number][] = [[-NX, -17.6], [-9.4, -4.1], [4.1, 9.4], [17.6, NX]]
    for (const [x0, x1] of xs) face(win, side, sy * BY, x0, x1, 0, OUTER, g, 0.7)
    // the crown's risers on the long faces
    face(win, side, sy * NY, -BX, BX, OUTER, 157, { ...g, zMin: OUTER + 0.6 }, 1.5)
  }

  const GRANITE = finish('cityplace-granite', 0xa97e70)
  const SLOT = windowVariant(2, 0x6f6a66)
  return finishGlb('dal-cityplace-tower', 'Cityplace Tower', [
    { part: granite, material: GRANITE },
    { part: win, material: PALETTE.window },
    { part: slot, material: SLOT },
    { part: roof, material: PALETTE.roof },
  ], { bearing: 0, height: H, replaces: ['way/26329683', 'way/710355796', 'way/710355797'] })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/dal-cityplace-tower.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
