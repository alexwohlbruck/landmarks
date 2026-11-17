/**
 * Junghwajeon (중화전), the throne hall of Deoksugung, Seoul (rebuilt 1906)
 * — original procedural geometry, CC0-1.0.
 * bun generators/seoul-junghwajeon.ts
 *
 * Built with the hanok kit in seoul-geunjeongjeon.ts.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/181574577 (the eaves,
 * traced with their curve), 37.5658068, 126.9748217. Its long sides run at
 * 102.3°, so the catalog bearing is 12.3 and the hall faces 192° — south,
 * turned a little west, as the encyclopedia describes.
 *
 * Identity: a single-storey hall under one broad hipped-and-gabled roof
 * with a large red gable and sweeping corners, among the office towers of
 * Jeong-dong; red columns over ochre lattice doors; the low, plain two-tier
 * stone platform without balustrades, its central stair carrying the
 * dragon slab. The 1902 hall had two storeys; the 1906 rebuild has one
 * (ko.wikipedia), and every photo shows one roof, so the model has one.
 * At night: red frame, soffits and platform carry `floodlight`; the lattice
 * is `window-2`.
 *
 * Evidence:
 *  - plan: OSM outline way/181574577, 31.5 × 24.6 m over the eaves, with
 *    the building=roof ways inside it (way/772263216–21), which are the roof
 *    faces and are replaced too.
 *  - published (ko.wikipedia, Junghwajeon): 5 × 4 bays, hipped-and-gabled,
 *    dapo brackets, single storey since 1906; double-tiered wide platform of
 *    long stones, stairs front-left, front-right and at the back of the
 *    lower tier. No metric dimensions found.
 *  - proportions: Mobius6's level front view (Deoksugung_Palace_20240409_
 *    084), scaled by people on the platform (26.5 px/m at the columns),
 *    which also gives OSM's eave length: columns 19.6 m wide (bays 3.8 /
 *    3.85 / 4.3 m), lintel top 4.15 m above the floor, brackets to 5.7 m,
 *    eave ~5.6 m mid-front, ridge top ~11.1 m (raw 10.8 m); the ridge spans
 *    ~60% of the roof's width, ~21 m between the ornaments. Depth
 *    (4 bays, 13.4 m) from OSM's 24.6 m eaves less the same 4.8 m overhang.
 *  - platform: tiers ~1.1 m each from the photos; plans estimated (upper
 *    35 × 27 m, lower 46 × 36 m).
 *  - colours: red frame, green dancheong, ochre-brown lattice doors
 *    (#c9a066 from the photos, pulled lighter), granite, grey tile.
 *  - terrain: Mapterhorn has no z15 tiles over Seoul; terrain.ts could not
 *    check the site, which is flat. Elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Deoksugung_Palace_20240409_084.jpg and _037.jpg, Mobius6, CC BY 4.0
 *  - Junghwajeon_Front.jpg, Tungdangthanh, CC BY-SA 4.0
 *  - Junghwajeon_-_Deoksugung_Palace.jpg and Deoksugung_Palace_-_Junghwajeon.jpg, 이창로, CC BY-SA 4.0
 *  - Deoksugung_Palace,_Seoul_(32)_(39307393550).jpg, Richard Mortel, CC BY 2.0
 *  - Junghwajeon.JPG, Lawinc82, CC BY-SA 3.0
 *  - Junghwajeon_Hall_IMG_2078.jpg, G41rn8, CC BY-SA 4.0
 * No commercial imagery. No look-only references.
 *
 * Left out: the board's lettering (the board hangs over the middle bay),
 * the dragon carving on the stair slab, the bronze vessels, the
 * rank stones and the surviving corner of the cloister (a separate building).
 */
import { hyeonpan, brackets, columns, hanokMaterials, hanokParts, platform, roof, saveHanok, storey, tally } from './seoul-geunjeongjeon'

function build() {
  const P = hanokParts()
  const T1 = 1.1, Z0 = 2.2

  platform(P, [
    {
      x0: -23, x1: 23, y0: -22, y1: 14, z0: 0, z1: T1, rail: false,
      stairs: [{ side: 's', at: 0, width: 7 }, { side: 's', at: -17, width: 3 }, { side: 's', at: 17, width: 3 }, { side: 'n', at: 0, width: 3.5 }],
    },
    {
      x0: -17.5, x1: 17.5, y0: -16, y1: 11, z0: T1, z1: Z0, rail: false,
      stairs: [{ side: 's', at: 0, width: 7 }, { side: 'n', at: 0, width: 3.5 }],
    },
  ])
  tally(P, 'platform')

  const xs = [-9.8, -6.0, -2.15, 2.15, 6.0, 9.8]
  const ys = [-6.7, -3.35, 0, 3.35, 6.7]
  const L1 = Z0 + 3.55, L2 = Z0 + 4.15, B1 = Z0 + 5.7
  storey(P, xs, ys, Z0, L1, L2, () => 'door')
  columns(P, xs, ys, Z0, L2, 0.32)
  brackets(P, xs, ys, L2, B1, { per: 2, depth: 1.3, width: 0.45 })
  tally(P, 'storey')

  roof(P, {
    kind: 'paljak', ex: 14.6, ey: 11.5, ze: Z0 + 5.6, gx: 10.6, gy: 4.0, zg: Z0 + 7.9, zr: Z0 + 10.1,
    lift: 1.9, flare: 1.1, sag: 0.45, th: 0.8,
    soffit: { bx: 9.8 + 1.25, by: 6.7 + 1.25, zb: B1 },
    ridge: { h: 1.0, w: 0.9, ornament: 1.4 }, ridgeSag: 0.25,
  })
  hyeonpan(P, 0, -6.7 - 0.9, L2 + 0.05, 2.8, 1.1)
  tally(P, 'roof')

  return hanokMaterials(P, { red: 0.75, teal: 0.6, stone: 0.35 }, { lattice: 0xc9a066 })
}

if (import.meta.main) await saveHanok('seoul-junghwajeon', 'Junghwajeon', [37.5658068, 126.9748217], 12.3, build(), 6500)
