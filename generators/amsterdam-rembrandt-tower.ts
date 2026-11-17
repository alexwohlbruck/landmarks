/**
 * Rembrandttoren (Rembrandt Tower; Peter de Bruijn, 1994-95), Omval, next
 * to Amsterdam Amstel station: original procedural geometry, CC0-1.0.
 * bun generators/amsterdam-rembrandt-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of OSM way/44451577 (building=office,
 * Rembrandttoren, the BAG outline), 52.345125, 4.917058. The tower's walls
 * run at 69.3 / 159.3 degrees (mean of the OSM parts' long edges), so the
 * bearing is 339.3 and the tower is square to this frame. The tower is
 * symmetric about both axes and is drawn so.
 *
 * Identity, in order: a slim square shaft with notched corners in pale grey
 * stone and a regular grid of dark windows; a crown that steps in, with four
 * glass corner pavilions round a taller stone core, a white drum and the
 * white mast to 150 m; the row of loggias at the shaft top; the wider base.
 * (The brief mentions a gabled crown; the photos show a stepped, flat-topped
 * crown, and the model follows the photos.)
 *
 * Evidence
 *  - OSM building:parts round way/44451577, read in this frame (all centred
 *    on the origin within 0.2 m): base way/754399966, a cross 47.4 m across
 *    with 25 m arms, 22 m; skirt way/754399967, a +-19 m square with corner
 *    and mid-side notches, 35 m; shaft way/754399968, a +-17 m square with
 *    4.3 m corner notches, 22-108 m; four corner pavilions way/754399969-72,
 *    10.9 m squares at x, y = +-3.9..14.8, to 119 m; the core cross
 *    way/754399973, +-10.2 m with 12 m arms, 108-130 m; drum way/754399965,
 *    r 4 m, 130-140; mast way/754399964 and way/754399963 to 150 m; entrance
 *    canopy way/754399962 (building:part=roof, 7 m), y -24.7..-38.7, x +-9.
 *  - 3D BAG (3dbag.nl, CC BY 4.0, TU Delft/3DGI), pand
 *    NL.IMBAG.Pand.0363100012113758, roof surfaces from AHN5 (2023), sampled
 *    on a 2 m grid in this frame: base roof 22.1, skirt 37.0, shaft roof
 *    106.9 with its parapet ring 110.1, pavilions 120.5-122.2, core 132.3,
 *    drum and plant 134.6-137.6. Ground NAP -0.6. These heights are used
 *    over OSM's rounder ones.
 *  - Published (nl.wikipedia "Rembrandttoren"): 135 m to the roof, 150 m
 *    with the mast, 35 storeys, completed 1995.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - S Sepp, "Rembrandt toren vanuit het noordwesten.jpg", CC BY-SA 3.0 —
 *      level, from the north-west: crown stack, pavilions, loggias, mast.
 *      https://commons.wikimedia.org/wiki/File:Rembrandt_toren_vanuit_het_noordwesten.jpg
 *    - Choinowski, "Rembrandttoren in 2021.jpg", CC BY-SA 4.0 — from the
 *      south-east, the whole height.
 *      https://commons.wikimedia.org/wiki/File:Rembrandttoren_in_2021.jpg
 *    - Ceescamel, "Rembrandttoren in 2019 (1).jpg" and "(2)", CC BY-SA 4.0 —
 *      the base, the stone and window grid, the glass entrance canopy.
 *      https://commons.wikimedia.org/wiki/File:Rembrandttoren_in_2019_(1).jpg
 *    - S Sepp, "Amsterdam omval rembrandt breitner mondriaan toren.jpg",
 *      CC BY-SA 3.0 — across the Amstel, distant and level.
 *      https://commons.wikimedia.org/wiki/File:Amsterdam_omval_rembrandt_breitner_mondriaan_toren.jpg
 *    - Henk Monster, "The Amsterdam Amstel station with the Rembrandt tower
 *      left of it - panoramio.jpg", CC BY 3.0 — from the east.
 *      https://commons.wikimedia.org/wiki/File:The_Amsterdam_Amstel_station_with_the_Rembrandt_tower_left_of_it_-_panoramio.jpg
 *    - Tinelot Wittermans, "Rembrandt Tower with Amstel.jpg", CC BY-SA 3.0.
 *      https://commons.wikimedia.org/wiki/File:Rembrandt_Tower_with_Amstel.jpg
 *  No commercial imagery, no look-only sources. No lidar beyond the 3D BAG.
 *  Elevation 0 (flat, NAP about -0.6 m).
 *
 * Facade: the punched windows are drawn as one panel per bay spanning three
 * storeys, between stone piers and spandrels (no per-floor grid); the glass
 * pavilions are a light window wall with a pale floor line every three
 * storeys (lead review). Estimated: storey height 3.3 m; 8 bays on each main
 * face and one on each notch face (photo count); the loggia row 107-110 m;
 * the core's lower half glazed, its upper half stone (S Sepp's crown view).
 * Left out: the window-cleaning crane arm on the roof, the antenna rings,
 * the "Rembrandt Tower" sign and clock.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { bays, block, cap, inset, rect, rows, save, walls, type XY } from './chi-aon-center'
import { along, rectOn } from './phl-independence-hall'
import { swalls, tube } from './amsterdam-johan-cruijff-arena'

/** A square of half-size h with square notches n cut from each corner, counter-clockwise. */
export function notched(h: number, n: number): XY[] {
  const m = h - n
  return [[h, -m], [h, m], [m, m], [m, h], [-m, h], [-m, m], [-h, m], [-h, -m], [-m, -m], [-m, -h], [m, -h], [m, -m]]
}
/** A cross: arms of half-width w reaching to h. */
export function cross(h: number, w: number): XY[] {
  return [[h, -w], [h, w], [w, w], [w, h], [-w, h], [-w, w], [-h, w], [-h, -w], [-w, -w], [-w, -h], [w, -h], [w, -w]]
}
const sides = (r: XY[]) => r.map((a, k) => [a, r[(k + 1) % r.length]] as [XY, XY])

function build() {
  const stone = new Part(), win = new Part(), glassWall = new Part(), trim = new Part(), roof = new Part(), glass = new Part()

  // --- Base, 0-22 m: the cross-shaped podium with tall window bays.
  const base = cross(23.7, 12.5)
  block(stone, roof, base, 0, 22.1, 0.4)
  bays(win, base, rows(1.0, 21.0, 3, 1.8), { bay: 2.0, gap: 1.4, end: 1.0, minLen: 6 })

  // --- Skirt, 22-37 m: the shaft square grown 2 m, notched.
  const skirt = notched(19, 4.4)
  block(stone, roof, skirt, 22.1, 37.0, 0.4)
  bays(win, skirt, rows(23.0, 36.2, 1, 1.6), { bay: 1.5, gap: 1.6, end: 0.8, minLen: 3.5 })

  // --- Shaft, 37-107 m, then the loggia row and parapet to 110.
  const shaft = notched(17, 4.3)
  const Z_ROOF = 106.9, Z_PAR = 110.1
  walls(stone, shaft, 37.0, Z_PAR - 0.4)
  walls(stone, shaft, Z_PAR - 0.4, Z_PAR, inset(shaft, 0.4))
  {
    // The parapet's inner face and the roof inside it.
    const i = inset(shaft, 0.4), ii = inset(shaft, 1.0)
    walls(stone, [...ii].reverse(), Z_ROOF, Z_PAR)
    for (let k = 0; k < i.length; k++) {
      const l = (k + 1) % i.length
      stone.quad([i[k][0], i[k][1], Z_PAR], [i[l][0], i[l][1], Z_PAR], [ii[l][0], ii[l][1], Z_PAR], [ii[k][0], ii[k][1], Z_PAR])
    }
    cap(roof, ii, Z_ROOF)
  }
  // Three-storey window panels between piers, 21 groups of three storeys.
  bays(win, shaft, rows(37.6, 106.0, 7, 1.9), { bay: 1.5, gap: 1.6, end: 0.9, minLen: 3.5 })
  // Loggias under the parapet: deep dark openings, one per bay.
  bays(win, shaft, [[107.3, 109.3]], { bay: 2.6, gap: 0.5, end: 0.6, minLen: 3.5, out: 0.05 })

  // --- Crown: four glass pavilions at the corners round the stone core.
  const Z_PAV = 120.6
  for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
    const r = rect(Math.min(sx * 3.9, sx * 14.8), Math.min(sy * 3.9, sy * 14.8), Math.max(sx * 3.9, sx * 14.8), Math.max(sy * 3.9, sy * 14.8))
    walls(glassWall, r, Z_ROOF, Z_PAV - 0.7)
    block(trim, roof, r, Z_PAV - 0.7, Z_PAV, 0.25)
    for (const [a, b] of sides(r)) {
      const { L } = along(a, b)
      rectOn(trim, a, b, L / 2, L / 2, 113.8, 114.3, 0.05) // floor line every third storey
      for (const c of [0.3, L - 0.3]) rectOn(trim, a, b, c, 0.3, Z_ROOF, Z_PAV - 0.7, 0.05) // corner mullions
    }
  }
  // The core cross: glazed between the pavilions, stone above them.
  const core = cross(10.2, 6.0)
  walls(glassWall, core, Z_ROOF, 121.6)
  for (const [a, b] of sides(core)) {
    const { L } = along(a, b)
    if (L > 5) rectOn(trim, a, b, L / 2, L / 2, 114.6, 115.1, 0.05)
  }
  block(stone, roof, core, 121.6, 132.3, 0.35)
  bays(win, core, [[123.0, 130.6]], { bay: 1.8, gap: 1.1, end: 0.8, minLen: 3.5 })

  // --- Drum, plant and mast.
  const disc = (r: number, n = 14): XY[] => Array.from({ length: n }, (_, k) => [r * Math.cos((k / n) * 2 * Math.PI), r * Math.sin((k / n) * 2 * Math.PI)] as XY)
  swalls(trim, disc(4.0), 132.3, 137.6)
  cap(trim, disc(4.0), 137.6)
  swalls(roof, disc(4.1), 134.4, 135.0)
  swalls(trim, disc(1.4, 10), 137.6, 140.0)
  swalls(trim, disc(2.0, 10), 140.0, 141.2)
  cap(trim, disc(2.0, 10), 141.2)
  cap(trim, disc(2.0, 10), 140.0, false)
  tube(trim, [0, 0, 141.2], [0, 0, 150.0], 0.55, 6, true)

  // --- Entrance canopy: a glass roof on four columns, south front.
  {
    const r = rect(-8.9, -38.7, 9.1, -24.7)
    walls(trim, r, 6.4, 7.0)
    cap(glass, r, 7.0)
    cap(trim, r, 6.4, false)
    for (const [x, y] of [[-7.6, -37.4], [7.8, -37.4], [-7.6, -26.0], [7.8, -26.0]]) tube(trim, [x, y, 0], [x, y, 6.4], 0.45, 6)
  }

  return [
    { part: stone, material: finish('rembrandt-stone', 0xd2ccc1) },
    { part: win, material: { ...PALETTE.window } },
    { part: glassWall, material: windowVariant(2, 0xa9bfd1) },
    { part: trim, material: { ...PALETTE.trim } },
    { part: roof, material: { ...PALETTE.roof } },
    { part: glass, material: { ...PALETTE.glass } },
  ]
}

if (import.meta.main) await save('amsterdam-rembrandt-tower', 'Rembrandttoren', [52.345125, 4.917058], 339.3, build(), 5000)
