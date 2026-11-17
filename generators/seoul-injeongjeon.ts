/**
 * Injeongjeon (인정전), the throne hall of Changdeokgung, Seoul (rebuilt
 * 1804) — original procedural geometry, CC0-1.0.
 * bun generators/seoul-injeongjeon.ts
 *
 * Built with the hanok kit in seoul-geunjeongjeon.ts.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/380863259 (the eaves),
 * 37.5794490, 126.9910907. Its long sides run at 83.6°, so the catalog
 * bearing is 353.6 and the hall faces south (-y).
 *
 * Identity: a two-storey-looking hall under a double hipped-and-gabled roof,
 * smaller and more upright than Geunjeongjeon, its upper storey a short red
 * band of ochre lattice windows; the ochre lattice doors and windows of the
 * lower storey (Joseon lattice with the 1907 glazing behind it); and the
 * tall, plain two-tier stone platform with no balustrades and broad stairs
 * in front. At night the hall is floodlit: red frame, soffits and platform
 * carry `floodlight`, the lattice is `window-2` and glows.
 *
 * Evidence:
 *  - plan: OSM outline way/380863259, 33.3 × 28 m (the lower eaves; no
 *    parts). The cloister and its corridors are separate OSM buildings
 *    (way/894611016–29 and others) and are not modelled.
 *  - published (Encyclopedia of Korean Culture, Injeongjeon): 5 × 4 bays,
 *    two-storey (jungcheung) dapo hall with a hipped-and-gabled roof,
 *    rebuilt 1804; no metric dimensions found.
 *  - proportions: Bernard Gagnon's level front view (Injeongjeon_Hall_01),
 *    scaled by OSM's eaves (34.5 px/m at the lower columns): columns
 *    22.7 m wide (bays 4.15 / 4.35 / 5.65 m), lower storey 4.7 m to the
 *    lintel top, brackets to 6.4 m, the skirt meets the upper wall at
 *    8.3 m, upper lintel to 10.1 m, brackets to 11.6 m; upper columns
 *    19.9 m wide; the upper eaves nearly as wide as the lower (31.6 against
 *    32.6 m). Ridge top ~15.6 m above the floor, the raw 14.9 m corrected a
 *    little for perspective (ridge ~10 m behind the columns). Depth
 *    (4 bays, 17.4 m) from OSM's 28 m eaves less the same overhangs.
 *  - platform: two tiers ~1.15 m each (six steps a flight) and the hall's
 *    0.4 m plinth; tier plans estimated from the front and the 2026 side
 *    views (no aerial): upper 39 × 30 m, lower 47 × 40 m, both reaching
 *    further south. No balustrades (photos).
 *  - colours: red frame, green dancheong, ochre lattice (#d6be86 pulled
 *    from the photos), granite platform, grey tile, white ridges.
 *  - terrain: the court rises gently to the north; Mapterhorn has no z15
 *    tiles over Seoul, so terrain.ts could not check it. Elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Injeongjeon_Hall_01.jpg and _02.jpg, Bernard Gagnon, CC0
 *  - Changdeokgung_Injeongjeon_in_2026_(1).jpg and (2), Sadopaul, CC BY-SA 4.0
 *  - Seoul,_Jongno_District,_Changdeokgung_Palace_(Injeongjeon).jpg, Dr. Thomas Liptak, CC BY-SA 4.0
 *  - Korea-Seoul-Changdeokgung-Injeongjeon-Frontal_view-01.jpg, Alain Seguin, CC BY-SA 3.0
 * No commercial imagery. No look-only references.
 *
 * Left out: the plum-blossom (ihwa) emblems on the ridge, the japsang, the
 * board's lettering (the board hangs over the upper middle bay), the
 * bronze vessels and the rank stones.
 */
import { hyeonpan, brackets, box, columns, hanokMaterials, hanokParts, platform, roof, saveHanok, storey, tally } from './seoul-geunjeongjeon'

function build() {
  const P = hanokParts()
  const T1 = 1.15, T2 = 2.3, Z0 = 2.7

  platform(P, [
    {
      x0: -23.5, x1: 23.5, y0: -25, y1: 15, z0: 0, z1: T1, rail: false,
      stairs: [{ side: 's', at: 0, width: 9 }, { side: 's', at: -15, width: 3.2 }, { side: 's', at: 15, width: 3.2 }, { side: 'e', at: -8, width: 3 }, { side: 'w', at: -8, width: 3 }],
    },
    {
      x0: -19.5, x1: 19.5, y0: -18, y1: 12, z0: T1, z1: T2, rail: false,
      stairs: [{ side: 's', at: 0, width: 9 }, { side: 's', at: -15, width: 3.2 }, { side: 's', at: 15, width: 3.2 }],
    },
    // The hall's own plinth.
    { x0: -13.4, x1: 13.4, y0: -10.6, y1: 10.6, z0: T2, z1: Z0, rail: false, stairs: [{ side: 's', at: 0, width: 5 }] },
  ])
  tally(P, 'platform')

  const xs = [-11.33, -7.18, -2.83, 2.83, 7.18, 11.33]
  const ys = [-8.7, -4.35, 0, 4.35, 8.7]
  const L1 = Z0 + 4.0, L2 = Z0 + 4.7, B1 = Z0 + 6.4
  storey(P, xs, ys, Z0, L1, L2, () => 'door')
  columns(P, xs, ys, Z0, L2, 0.33)
  brackets(P, xs, ys, L2, B1, { per: 2, depth: 1.35, width: 0.5 })
  tally(P, 'lower storey')

  const UX = 9.95, UY = 7.4, U0 = Z0 + 8.3
  roof(P, {
    kind: 'skirt', ex: 16.3, ey: 13.4, ze: Z0 + 6.1, gx: UX, gy: UY, zg: U0,
    lift: 1.7, flare: 1.0, sag: 0.35, th: 0.75,
    soffit: { bx: 11.33 + 1.4, by: 8.7 + 1.4, zb: B1 },
  })
  tally(P, 'lower roof')

  const uxs = [-UX, -6.3, -2.5, 2.5, 6.3, UX]
  const uys = [-UY, -2.5, 2.5, UY]
  const UL1 = Z0 + 9.6, UL2 = Z0 + 10.1, UB1 = Z0 + 11.6
  storey(P, uxs, uys, U0 - 0.2, UL1, UL2, () => 'window')
  columns(P, uxs, uys, U0 - 0.2, UL2, 0.3)
  brackets(P, uxs, uys, UL2, UB1, { per: 2, depth: 1.3, width: 0.45 })
  tally(P, 'upper storey')

  roof(P, {
    kind: 'paljak', ex: 15.8, ey: 12.8, ze: Z0 + 10.9, gx: 9.4, gy: 4.6, zg: Z0 + 12.7, zr: Z0 + 14.6,
    lift: 2.2, flare: 1.2, sag: 0.45, th: 0.8,
    soffit: { bx: UX + 1.3, by: UY + 1.3, zb: UB1 },
    ridge: { h: 1.0, w: 0.9, ornament: 1.5 }, ridgeSag: 0.25,
  })
  hyeonpan(P, 0, -UY - 0.9, UL2 + 0.1, 3.0, 1.25)
  tally(P, 'upper roof')

  return hanokMaterials(P, { red: 0.75, teal: 0.6, stone: 0.35 }, { lattice: 0xd6be86 })
}

if (import.meta.main) await saveHanok('seoul-injeongjeon', 'Injeongjeon', [37.579449, 126.9910907], 353.6, build(), 6500)
