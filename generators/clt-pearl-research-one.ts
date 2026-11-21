/**
 * Research One at The Pearl (905 Pearl Park Way, 2025, Ayers Saint Gross with
 * CO Architects and Neighboring Concepts, for Wexford Science + Technology
 * and Atrium Health; IRCAD North America the main tenant), Charlotte —
 * original procedural geometry, CC0-1.0.
 * bun generators/clt-pearl-research-one.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the
 * centroid of the OSM outline way/1558943000) on the lowest ground. Placed at
 * bearing 44.1, square to the district's grid: -y faces South McDowell
 * Street's side of the block, +x the Levine Center (the medical school) to
 * the south-east.
 *
 * Identity, in order:
 *  - a broad, low research block of clear glass behind close white vertical
 *    fins, the fins left out in patches so the faces read as a shimmer of
 *    white stripes with clear panels in it;
 *  - a solid white band for the plant screen on top, with small louvres;
 *  - a dark charcoal two-storey base, recessed, with storefront glass;
 *  - the two ends a storey lower than the middle; a four-storey wing along
 *    the north-east side.
 *
 * Evidence:
 *  - Identity and address: 905 Pearl Park Way is the research building
 *    joined to the Levine Center (Ayers Saint Gross,
 *    https://ayerssaintgross.com/work/project/the-howard-r-levine-center-for-education-and-research-1;
 *    the medical school gives its own address as 915 Pearl Park Way,
 *    https://school.wakehealth.edu/charlotte-campus). Wikipedia ("The Pearl
 *    (Charlotte)", https://en.wikipedia.org/wiki/The_Pearl_(Charlotte)):
 *    Research One, 10 storeys, 150 ft, IRCAD on its first four floors.
 *  - OSM: outline way/1558943000; parts way/1562203552 (middle, 55 m, 11
 *    levels), way/1562203553 and -554 (ends, 50 m, 10 levels), way/1562203555
 *    (north-east wing, 20 m, 4 levels). Plan and heights from these: the
 *    roof at 49.5 m and the plant screen to 55 m on the middle (150 ft to the
 *    roof, published), the ends 49.5 m, their white parapet carried to 53 m so the top band runs the full face as in the photos (OSM: 50 m).
 *  - Lidar: USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17) predates the
 *    building; not used.
 *  - Terrain (Mapterhorn): tools/terrain.ts grid; elevation 0.
 *  - Photos (Wikimedia Commons, daylight, City Dweller 2, CC BY-SA 4.0):
 *    "The Pearl Early June 2025.jpg" (from the south-west along McDowell:
 *    the long face, the fins and their gaps, the white top band, the dark
 *    base, https://commons.wikimedia.org/wiki/File:The_Pearl_Early_June_2025.jpg);
 *    "The Pearl at the corner of South McDowell St and Pearl Park Wy Early
 *    September 2026.jpg" (the same face from the corner, closer,
 *    https://commons.wikimedia.org/wiki/File:The_Pearl_at_the_corner_of_South_McDowell_St_and_Pearl_Park_Wy_Early_September_2026.jpg).
 *    No commercial imagery. No look-only sources.
 *
 * Estimated: the base 8 m; the fins 0.55 m wide every 1.2 m, 0.5 m proud, in
 * three-storey runs (13.8 m) with a thin pale band between runs; which runs (about one in six) are
 * left clear (a fixed pseudo-random pattern standing in for the real one,
 * not traced); the screen's louvres.
 * Doubts: only the south-west and south-east faces are photographed; the
 * north-east wing and the far faces are drawn the same way. The real fin
 * pattern is not copied panel for panel.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { area, cap, inset, onWall, panel, save, walls, type XY } from './chi-aon-center'

const BEARING = 44.1
const ANCHOR: [number, number] = [35.2145497, -80.8423644]

const glass = new Part(), fin = new Part(), base = new Part(), baseGlass = new Part(), roof = new Part()

const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)
const MID = ccw([[-41.1, -15.9], [-36.6, 10.8], [42.4, 12.2], [31.3, -18.7], [15.5, -18.7], [-21.2, -18.0]])
const ENDE = ccw([[31.3, -18.7], [42.4, 12.2], [48.6, 12.1], [36.0, -18.7]])
const ENDW = ccw([[-41.1, -15.9], [-47.0, -15.1], [-44.3, 11.1], [-36.6, 10.8]])
const WING = ccw([[-36.6, 10.8], [-36.7, 17.4], [41.9, 18.7], [42.4, 12.2]])
const BASE = 8, ROOF = 49.5, SCREEN = 55, RUN = 13.8

// pseudo-random but fixed: which runs of fins are left out
let seed = 7
const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280)

/** A glass block with white fins on its faces from BASE to top; faces listed by index are skipped (shared). */
function block(r: XY[], top: number, skip: (a: XY, b: XY) => boolean) {
  walls(base, inset(r, 0.8), 0, BASE)
  cap(base, r, BASE, false)
  walls(glass, r, BASE, top)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], { L } = onWall(a, b)
    if (skip(a, b) || L < 3) continue
    // storefront on the recessed base
    const ai = inset(r, 0.8)[i], bi = inset(r, 0.8)[(i + 1) % r.length]
    panel(baseGlass, ai, bi, 0.6, onWall(ai, bi).L - 0.6, 0.4, BASE - 1.6, 0.04)
    for (let z = BASE; z < top - 1; z += RUN) {
      const z1 = Math.min(z + RUN, top)
      panel(fin, a, b, 0, L, z, z + 0.35, 0.3) // pale band between runs
      const n = Math.floor(L / 1.2)
      let k = 0
      while (k < n) {
        const len = 4 + Math.floor(rnd() * 8), clear = rnd() < 0.16
        if (!clear) {
          // a run of fins drawn as one strip per fin
          for (let j = k; j < Math.min(n, k + len); j++) {
            const s = (j + 0.5) * (L / n)
            panel(fin, a, b, s - 0.28, s + 0.28, z + 0.5, z1, 0.5)
          }
        }
        k += len
      }
    }
  }
}
const shared = (a: XY, b: XY) => {
  // the faces where the blocks meet: the middle's ends against the end blocks, and its north-east face over the wing
  const on = (p: XY, q: XY) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 0.2
  const pairs: [XY, XY][] = [[[31.3, -18.7], [42.4, 12.2]], [[-41.1, -15.9], [-36.6, 10.8]], [[-36.6, 10.8], [42.4, 12.2]]]
  return pairs.some(([p, q]) => (on(a, p) && on(b, q)) || (on(a, q) && on(b, p)))
}
block(MID, ROOF, shared)
block(ENDE, ROOF - 0.01, shared)
block(ENDW, ROOF - 0.01, shared)
// north-east wing, four storeys
walls(base, inset(WING, 0.8), 0, BASE)
cap(base, WING, BASE, false)
walls(glass, WING, BASE, 20)
cap(roof, WING, 20)
for (let i = 0; i < WING.length; i++) {
  const a = WING[i], b = WING[(i + 1) % WING.length], { L } = onWall(a, b)
  if (shared(a, b) || L < 3) continue
  for (const z of [BASE + 0.6, BASE + 6.6]) panel(baseGlass, a, b, 0.6, L - 0.6, z, z + 4.6, 0.05)
}

// --- Roofs and the plant screen.
for (const r of [ENDE, ENDW]) {
  walls(fin, r, ROOF, SCREEN - 2) // the white top band carries on over the ends (photos)
  cap(roof, r, SCREEN - 2)
}
cap(roof, MID, ROOF)
{
  const S = inset(MID, 0.3)
  walls(fin, S, ROOF, SCREEN)
  cap(roof, S, SCREEN)
  for (let i = 0; i < S.length; i++) {
    const a = S[i], b = S[(i + 1) % S.length], { L } = onWall(a, b)
    if (L < 8) continue
    const n = Math.floor(L / 9)
    for (let k = 0; k < n; k++) {
      const s = (k + 0.5) * L / n
      panel(roof, a, b, s - 1.0, s + 1.0, SCREEN - 2.6, SCREEN - 1.2, 0.03)
    }
  }
}

if (import.meta.main) {
  await save('clt-pearl-research-one', 'Research One at The Pearl', ANCHOR, BEARING, [
    { part: glass, material: { ...PALETTE.window, color: 0x7f9fbe } },
    { part: fin, material: finish('pearl-fin-white', 0xf1f1ee) },
    { part: base, material: finish('pearl-charcoal', 0x4a4d52) },
    { part: baseGlass, material: windowVariant(2, 0x5d6f80) },
    { part: roof, material: PALETTE.roof },
  ], 6500)
}
