/**
 * Gwanghwamun (광화문), the south gate of Gyeongbokgung, Seoul (rebuilt in
 * wood 2006–2010) — original procedural geometry, CC0-1.0.
 * bun generators/seoul-gwanghwamun.ts
 *
 * Built with the hanok kit in seoul-geunjeongjeon.ts.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/170199440, 37.5759320,
 * 126.9768153. Its long sides run at 91.5°, so the catalog bearing is 1.5
 * and the gate faces south (-y).
 *
 * Identity: the long pale granite base with three round-headed passages,
 * the middle one larger, under a dark parapet set with white plaques; on it
 * the two-storey pavilion, 3 × 2 bays, with two hipped (ujingak) roofs whose
 * corners sweep up; the stubs of the palace wall stepping down either side.
 * At night the pavilion is floodlit in green and gold and the base is lit:
 * the red frame, the soffits and the granite carry `floodlight`, the lattice
 * windows are `window-2`.
 *
 * Evidence:
 *  - plan: OSM outline way/170199440 (stone base ±15.5 m × 13 m, wings to
 *    ±19.8 m and wall stubs to ±24.6 m) and its parts (way/1170008834–40,
 *    way/1415432340–47: pavilion storeys at 7–11 and 12–15 m, wings 7–9 m).
 *  - published (ko.wikipedia, Gwanghwamun): 19 m overall, base 7 m,
 *    pavilion 12 m; 3 × 2 bays; two storeys under a hipped roof with double
 *    eaves; arches (from the 2010 restoration report as quoted by the
 *    Encyclopedia of Korean Culture) centre 17.5 × 18 cheok (~5.3 m high,
 *    5.5 m wide), sides 16 × 14.5 cheok (~4.9 × 4.4 m).
 *  - proportions: measured on the level frontal photo (Gwanghwamun_(광화문).jpg)
 *    at 17 px/m, the scale that reconciles the published arch widths and the
 *    19 m height within ~7%: base 28 m wide (OSM's ±15.5 m reads as the
 *    lower eaves), 7.7 m high, parapet to 8.8 m; lower columns ±12.2 m,
 *    upper ±10.9 m; lower eaves 32.8 m, upper 30 m; ridge ~16 m between the
 *    ornaments, its top 19.2 m. Depths (base 13 m, storeys 8.8 / 7.6 m)
 *    from OSM.
 *  - colours: daylight photos: granite base, dark grey brick parapet with
 *    white plaques, red columns and doors, green dancheong.
 *  - terrain: Mapterhorn has no z15 tiles over Seoul; terrain.ts could not
 *    check the site, which is flat. Elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Gwanghwamun_(광화문).jpg, Noh Mun Duek, CC BY-SA 4.0 (front, level)
 *  - Gwanghwamun_20240413.jpg, *Youngjin, CC BY-SA 4.0 (south-west, with the 2023 woldae)
 *  - Gwanghwamun_2012.jpg, Komatta, CC BY-SA 3.0 (south-east, close)
 *  - Gwanghwamun,_Gyeongbokgung.jpg, Tristan Surtel, CC BY-SA 4.0 (south-west)
 *  - Gyeongbokgung_-_Gwanghwamun_Gate.jpg, Yuliya Boda, CC BY-SA 4.0
 *  - Gwanghwamun_December_2023.jpg, Huntsmanleader, CC0 (distant, front)
 *  - Gwanghwamun_Gate_(back_side).jpg, Hhk1201, CC BY-SA 4.0 (north, night)
 *  - Gwanghwamun_Gate_(광화문),_Seoul,_South_Korea_(Unsplash).jpg, Timothy Ries (wacowacko), CC0
 * No commercial imagery. No look-only references.
 *
 * Left out: the 2023 woldae (ceremonial platform) in front of the gate and
 * the haechi statues, which stand apart on the plaza; the board's lettering
 * (the board itself hangs over the upper storey's middle bay); the
 * palace walls beyond the outline's stubs.
 */
import { hyeonpan, box, brackets, columns, copedWall, gateBase, hanokMaterials, hanokParts, parapet, roof, saveHanok, storey, tally } from './seoul-geunjeongjeon'

function build() {
  const P = hanokParts()
  const Y0 = -7.0, Y1 = 6.0, CY = (Y0 + Y1) / 2
  const BX = 14.0, BH = 7.7

  gateBase(P, {
    x0: -BX, x1: BX, y0: Y0, y1: Y1, h: BH, reveal: 1.6,
    arches: [{ c: -8.3, w: 4.3, h: 5.1 }, { c: 0, w: 5.2, h: 5.6 }, { c: 8.3, w: 4.3, h: 5.1 }],
  })
  parapet(P, -BX, Y0, BX, Y1, BH, 1.1, 0.6, 2.3)
  // The wings stepping down to the palace wall, then the wall stubs.
  for (const s of [-1, 1]) {
    const w = (a: number, b: number) => (s < 0 ? [-b, -a] : [a, b]) as [number, number]
    const [a0, a1] = w(BX, 19.8), [b0, b1] = w(19.8, 24.6)
    copedWall(P, a0, -2.0, a1, 4.9, 7.0, { rise: 0.8 })
    copedWall(P, b0, 0.8, b1, 4.6, 5.8, { rise: 0.8 })
  }
  tally(P, 'base')

  // Lower storey: 3 × 2 bays.
  const Z0 = BH
  const xs = [-12.2, -4.25, 4.25, 12.2]
  const ys = [CY - 4.4, CY, CY + 4.4]
  const L1 = Z0 + 2.0, L2 = Z0 + 2.6, B1 = Z0 + 3.9
  // The pavilion's floor over the base, inside the parapet.
  box(P.stone, -BX + 0.6, Y0 + 0.6, BH, BX - 0.6, Y1 - 0.6, BH + 0.15, 'b')
  storey(P, xs, ys, Z0 + 0.15, L1, L2, () => 'high')
  columns(P, xs, ys, Z0 + 0.15, L2, 0.36)
  brackets(P, xs, ys, L2, B1, { per: 2, depth: 1.3, width: 0.55 })
  tally(P, 'lower storey')

  const UX = 10.9, UY = 3.8, U0 = Z0 + 5.5
  roof(P, {
    cy: CY, kind: 'skirt', ex: 16.4, ey: 8.6, ze: Z0 + 3.4, gx: UX, gy: UY, zg: U0,
    lift: 1.4, flare: 0.9, sag: 0.3, th: 0.7,
    soffit: { bx: 12.2 + 1.35, by: 4.4 + 1.35, zb: B1 },
  })
  tally(P, 'lower roof')

  const uxs = [-UX, -3.8, 3.8, UX]
  const uys = [CY - UY, CY, CY + UY]
  const UL1 = Z0 + 6.9, UL2 = Z0 + 7.4, UB1 = Z0 + 8.6
  storey(P, uxs, uys, U0 - 0.2, UL1, UL2, () => 'window')
  columns(P, uxs, uys, U0 - 0.2, UL2, 0.32)
  brackets(P, uxs, uys, UL2, UB1, { per: 2, depth: 1.25, width: 0.5 })
  tally(P, 'upper storey')

  roof(P, {
    cy: CY, kind: 'hip', ex: 15.0, ey: 7.9, ze: Z0 + 8.4, gx: 7.6, gy: 0, zg: 19.3, zr: 19.3,
    lift: 1.9, flare: 1.1, sag: 0.35, th: 0.8,
    soffit: { bx: UX + 1.3, by: UY + 1.3, zb: UB1 },
    ridge: { h: 0.75, w: 0.85, ornament: 1.3 }, ridgeSag: 0.2,
  })
  hyeonpan(P, 0, CY - UY - 0.9, UL2 + 0.1, 3.4, 1.3)
  tally(P, 'upper roof')

  return hanokMaterials(P, { red: 0.75, teal: 0.7, stone: 0.45 })
}

if (import.meta.main) await saveHanok('seoul-gwanghwamun', 'Gwanghwamun', [37.575932, 126.9768153], 1.5, build(), 6500)
