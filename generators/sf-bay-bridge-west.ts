/**
 * San Francisco–Oakland Bay Bridge, West Bay Crossing towers (1936; Charles
 * H. Purcell, chief engineer) — procedural, CC0-1.0.
 * bun generators/sf-bay-bridge-west.ts
 *
 * The west crossing is two suspension bridges end to end, four towers in
 * all. They share one design but come in two heights: towers W2 and W6, at
 * the outer ends, stand 13.6 m lower than W3 and W5 beside the centre
 * anchorage, because the deck climbs toward Yerba Buena Island's tunnel
 * and the inner towers carry it higher. Everything from the deck up is the
 * same; the inner towers only have longer legs and lower X panels under it.
 * So the builder below makes either, and two models use it: this one (W2,
 * W6) and `sf-bay-bridge-west-inner` (W3, W5). A scale would have widened
 * the inner towers by a tenth, where the lidar shows them the same width.
 *
 * Map frame: x across the bridge, y along it, z up, metres; origin at the
 * tower's centre on the water. Placed at bearing 40.4°, the line through
 * all four towers. Only the towers and their piers: deck, trusses and
 * cables are the map's.
 *
 * What makes it the Bay Bridge: silver-grey steel; two slender legs
 * leaning slightly inward and flaring at the foot along the bridge; a chain
 * of X bracing, three panels above the deck and two below, meeting the legs
 * without horizontals; the paired roadway struts under the two decks; a
 * castellated box hood across the top with three openings in each face;
 * a broad round-ended concrete pier.
 *
 * Sources:
 * - HAER CA-32 drawing 382, "West Bay Crossing; Towers; General Elevations
 *   and Sections" (State of California Department of Public Works, public
 *   domain, via Wikimedia Commons): leg batter 1/4 in 12; legs 15 x 12 ft
 *   at the top; base 19 ft across the bridge, 31 ft 7 in (W3, W5) or 24 ft
 *   (W2, W6) along it, the flare a parabola over the bottom 172 ft or 127
 *   ft; cap plates at 498.2 ft (W3, W5) and 453.5 ft (W2, W6) above MLLW;
 *   upper and lower roadways at 257.6/231.1 ft and 212.9/186.5 ft; upper X
 *   panels 70.9, 70.3 and 73.6 ft; top of masonry at +40 ft.
 * - OSM: the towers are ways 432712476–432712479 (building=tower, a 29 x 10
 *   m outline each, height 160 tagged on all four); the piers are
 *   man_made=pier areas (236373808 "D", 236373809 "E", 1136339257 "Pier B"),
 *   about 55 x 29 m with rounded ends, which the model's pier follows.
 * - Lidar (USGS 3DEP, CA_SanFrancisco_1_B23, 2023, 0.5 m grid; water at
 *   0 m NAVD88 = y 0): hood tops 143.4 m (W2, W6) and 156.9 m (W3, W5);
 *   upper deck 64.9 m and 78.4 m; tops 27 m across; piers about 12 m.
 * - Photos (Wikimedia Commons): "Bay Bridge (91696)" and "Bay Bridge
 *   (91690)" (Rhododendrites, CC BY-SA 4.0; W5 and W6 broadside in low
 *   sun); "San Francisco Oakland Bay Bridge Western Span" and "Western span
 *   of the San Francisco–Oakland Bay Bridge" (from the Embarcadero); "San
 *   Francisco Bay Bridge January 2014" (King of Hearts, CC BY-SA 4.0).
 * - Estimated: member sizes (diagonals 2.3 m, struts 2.5–3.3 m, from the
 *   drawing's sections), the hood's openings and crenellations (photos),
 *   the pier's top course.
 * - Colour: the towers' aluminium-grey paint from daylight photos, pulled
 *   to the palette's lightness; recesses a shade darker.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { beam, box, countParts, loftSolid, one, prism } from './sf-golden-gate-bridge'

export function buildWestTower(inner: boolean) {
  const steel = new Part(), dark = new Part(), pier = new Part()
  const S = one(steel), D = one(dark), P = one(pier)
  const lift = inner ? 13.6 : 0          // the inner towers' extra height
  const PIER = 12                        // top of masonry, +40 ft MLLW
  const CAP = 137.6 + lift               // leg tops (cap plates)
  const HOOD0 = CAP - 2.0, HOOD1 = 141.9 + lift, TOP = 143.4 + lift
  const DECK = 64.9 + lift               // upper roadway

  // Pier: round-ended, from OSM, with a slightly inset top course.
  const half: [number, number][] = [[19.5, -14.2], [22.3, -12], [26.4, -5], [27.4, 0], [26.4, 5], [22.3, 12], [19.5, 14.2]]
  const plan = [...half, ...half.map(([x, y]) => [-x, -y] as [number, number])]
  prism(P, plan, 0, PIER - 1.2, false)
  prism(P, plan.map(([x, y]) => [x * 0.96, y * 0.93] as [number, number]), PIER - 1.2, PIER, false)

  // Legs: batter 1/4 in 12 across the bridge; along it a parabolic flare.
  const centre = (z: number) => 10.05 + (CAP - z) / 48
  const across = (z: number) => 4.6 + 1.2 * (CAP - z) / (CAP - PIER)
  const flareH = inner ? 52.4 : 38.8, baseDepth = inner ? 9.6 : 7.3
  const along = (z: number) => {
    const t = Math.max(0, 1 - (z - PIER) / flareH)
    return 3.7 + (baseDepth - 3.7) * t * t
  }
  const levels = [PIER, PIER + flareH * 0.12, PIER + flareH * 0.28, PIER + flareH * 0.5, PIER + flareH * 0.75, PIER + flareH, CAP]
  for (const s of [-1, 1]) {
    const rings = levels.map((z) => {
      const c = s * centre(z), w = across(z) / 2, d = along(z) / 2, r = 0.5
      return [[c - w + r, -d, z], [c + w - r, -d, z], [c + w, -d + r, z], [c + w, d - r, z],
        [c + w - r, d, z], [c - w + r, d, z], [c - w, d - r, z], [c - w, -d + r, z]] as V3[]
    })
    loftSolid(S, rings, [false, true])
    // A plinth where the leg meets the pier.
    box(S, s * centre(PIER) - 3.6, s * centre(PIER) + 3.6, -baseDepth / 2 - 0.8, baseDepth / 2 + 0.8, PIER, PIER + 1.6, { r: 0.4, top: 0.3, bottom: false })
  }
  /** The legs' inner face at height z, measured from the axis. */
  const xin = (z: number) => centre(z) - across(z) / 2

  /** A horizontal strut between the legs. */
  const strut = (z0: number, z1: number, d = 2.5) => {
    const x = xin((z0 + z1) / 2) + 0.6
    box(S, -x, x, -d / 2, d / 2, z0, z1, { r: 0.25 })
  }
  /** A chain of X panels between z0 and z1: diagonals meeting the legs, no horizontals. */
  const xChain = (z0: number, z1: number, n: number) => {
    const h = (z1 - z0) / n
    for (let k = 0; k < n; k++) {
      const a = z0 + k * h, b = a + h
      for (const s of [-1, 1]) beam(S, [s * (xin(a) + 0.6), 0, a], [-s * (xin(b) + 0.6), 0, b], 2.3, 2.4)
      const m = (a + b) / 2
      beam(S, [0, 0, m - 1.7], [0, 0, m + 1.7], 2.6, 2.6)
    }
  }

  // Above the deck: three X panels from the hood down to the roadway struts.
  const upperTop = HOOD0, upperBot = HOOD0 - 65.4
  xChain(upperBot, upperTop, 3)
  strut(upperBot - 2.2, upperBot, 2.6)              // closes the upper chain
  strut(DECK - 2.9, DECK - 0.3, 2.5)                // upper roadway strut
  strut(DECK - 8.1 - 3.3, DECK - 8.1, 3.3)          // lower roadway strut
  // Below: two X panels down to the bottom strut.
  const lowTop = DECK - 11.4, lowBot = PIER + 5.5
  xChain(lowBot, lowTop, 2)
  strut(lowBot - 2.6, lowBot, 2.6)

  // The hood: a box strut over the leg tops, three openings in each face,
  // a castellated top.
  const hx = centre(CAP) + 2.5
  box(S, -hx, hx, -2.2, 2.2, HOOD0, HOOD1, { r: 0.3 })
  for (const s of [-1, 1]) for (const k of [-1, 0, 1]) {
    const x = k * 6.2
    box(D, x - 2.2, x + 2.2, s > 0 ? 2.15 : -2.3, s > 0 ? 2.3 : -2.15, HOOD0 + 1.4, HOOD1 - 1.2, { r: 0 })
  }
  for (const k of [-2, -1, 0, 1, 2]) {
    const x = k * (hx - 1.1) / 2
    box(S, x - 1.1, x + 1.1, -2.2, 2.2, HOOD1, TOP, { r: 0.2, top: 0.2, bottom: false })
  }

  const parts = [
    { part: steel, material: finish('bay-bridge-silver', 0xc4c9cd) },
    { part: dark, material: finish('bay-bridge-shadow', 0x8e969d) },
    { part: pier, material: finish('concrete', 0xd9d3c7) },
  ]
  return { parts, height: TOP }
}

export async function writeWestTower(id: string, inner: boolean) {
  const { parts, height } = buildWestTower(inner)
  const triangles = countParts(parts)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(`Bay Bridge west span tower (${inner ? 'W3/W5' : 'W2/W6'})`, parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at the tower centre on the water', height, bearing: 40.4,
  })
  await Bun.write(new URL(`../models/${id}.glb`, import.meta.url), glb)
  console.log(`${id}.glb: ${triangles} triangles, ${glb.length} bytes`)
}

if (import.meta.main) await writeWestTower('sf-bay-bridge-west', false)
