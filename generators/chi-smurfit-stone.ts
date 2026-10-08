/**
 * Crain Communications Building (150 North Michigan, 1984, A. Epstein &
 * Sons; long the Smurfit-Stone Building), Chicago — original procedural
 * geometry, CC0-1.0.
 * bun generators/chi-smurfit-stone.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/210671717,
 * 41.884830,-87.624977. The plan is drawn from OSM's own coordinates, so
 * the catalog bearing is 0.
 *
 * Identity, in order: the top sliced off by one steep plane falling to the
 * south-east, which reads from Michigan Avenue and Millennium Park as a
 * diamond of glass; the cleft that splits the building on the diagonal, a V
 * notch running the full height at the south-east corner and a slot through
 * the top at the north-west; the white bands of the facade, a ribbon window
 * to every floor.
 *
 * Evidence:
 *  - plan: OSM parts way/284816228 (south-west half), way/284816229
 *    (north-east half) and way/284816227 (the slot at the north-west,
 *    flat at 152.5 m). The V notches in the outline at the south-east and
 *    north-west corners are the cleft's two ends.
 *  - the slope: OSM tags both halves as skillions facing 133°, the south-
 *    west half 172.4 m high with a 75 m roof, the north-east 177.4 m with
 *    73 m. Those roof heights look like estimates: the glass face drops
 *    only 30-36% of the height in TonyTheTiger's photo from the south-east
 *    and Tony Hisgett's from the south. One plane is used for both halves,
 *    through OSM's 177.4 m at the north-west and ~112 m at the south-east
 *    corner (65 m, from the photos), falling 1.10 m per metre (48°) to 133°.
 *    Published height 177 m, 41 floors.
 *  - facade: continuous ribbon windows between white spandrels, one per
 *    floor (every photo); ~4.1 m floors from 41 floors in 168 m above a
 *    taller lobby.
 *  - colour: white aluminium spandrels, a cool white finish; the ribbons
 *    the palette window; the slope is glass (structural glazing, unlit).
 *
 * Photos (Wikimedia Commons): 20080602_Park_Grill_Plaza_and_Smurfit_Stone
 * _Building.JPG (TonyTheTiger, CC BY-SA 3.0); Crain_Communications_Building
 * _(15626441032).jpg (Tony Hisgett, CC BY 2.0); -chicago_-illinois
 * _-building_-skyscrapers_(33933842361).jpg (grego1402, CC BY 2.0);
 * 2_Prudential_13_(14814971009).jpg (Jaysin Trevino, CC BY 2.0, from
 * above). No commercial imagery.
 *
 * Left out: the lobby's set-back glazing at street level, mullions.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { area, panel, save, triangulate, type XY } from './chi-aon-center'

const white = new Part(), win = new Part(), glass = new Part(), roof = new Part()

const ccw = (r: XY[]) => (area(r) < 0 ? r.slice().reverse() : r)
const SW = ccw([[20.1, -22.8], [12.8, -16.4], [12.2, -15.8], [-9.6, 5.6], [-19.2, 14.8], [-18.4, -23.3], [8.1, -22.9], [13.5, -23.0]])
const NE = ccw([[-15.3, 18.7], [-5.8, 9.4], [-9.6, 5.6], [12.2, -15.8], [13.3, -14.6], [19.8, -8.1], [19.8, -4.9], [19.4, 14.0], [19.3, 19.5], [19.2, 22.6], [-18.8, 22.1]])
const SLOT = ccw([[-5.8, 9.4], [-9.6, 5.6], [-19.2, 14.8], [-17.2, 16.7], [-15.3, 18.7]])
const SLOT_Z = 152.5

// The slicing plane: falls to the south-east (133°).
const plane = ([x, y]: XY) => 145.7 - 1.10 * (0.731 * x - 0.682 * y)

type Solid = { ring: XY[]; top: (p: XY) => number; cap: Part }
const solids: Solid[] = [
  { ring: SW, top: plane, cap: glass },
  { ring: NE, top: plane, cap: glass },
  { ring: SLOT, top: () => SLOT_Z, cap: roof },
]
const key = (a: XY, b: XY) => `${a[0]},${a[1]}|${b[0]},${b[1]}`
const owner = new Map<string, number>()
solids.forEach((s, i) => s.ring.forEach((a, k) => owner.set(key(a, s.ring[(k + 1) % s.ring.length]), i)))

const LOBBY = 9, FLOOR = (168 - LOBBY) / 39
for (const [i, s] of solids.entries()) {
  const r = s.ring
  // Sloped (or flat) top.
  for (const [a, b, c] of triangulate(r)) {
    const P = (p: XY): V3 => [p[0], p[1], s.top(p)]
    s.cap.tri(P(r[a]), P(r[b]), P(r[c]))
  }
  for (let k = 0; k < r.length; k++) {
    const a = r[k], b = r[(k + 1) % r.length]
    const other = owner.get(key(b, a))
    if (other !== undefined && (i === 2 || other < 2)) continue // halves meet flush; the slot hides inside
    const ta = s.top(a), tb = s.top(b)
    // Walls facing the slot start at its floor.
    const z0 = other === 2 ? SLOT_Z : 0
    if (Math.max(ta, tb) <= z0) continue
    white.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], tb], [a[0], a[1], ta])
    if (other !== undefined) continue
    // Ribbon windows, one per floor, cut short where the slope comes down.
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 2.5) continue
    for (let f = 0; ; f++) {
      const zb = LOBBY + f * FLOOR + FLOOR * 0.42, zt = LOBBY + (f + 1) * FLOOR - 0.15
      if (zb > Math.max(ta, tb) - 1) break
      // The span of the edge whose top clears this ribbon by a metre.
      const lim = (z: number) => z + 1
      let s0 = 0, s1 = L
      if (ta < lim(zt) || tb < lim(zt)) {
        if (ta < lim(zt) && tb < lim(zt)) continue
        const t = (lim(zt) - ta) / (tb - ta) * L
        if (ta < lim(zt)) s0 = t; else s1 = t
      }
      if (s1 - s0 < 1) continue
      panel(win, a, b, s0 + 0.15, s1 - 0.15, zb, zt)
    }
  }
}
// A lobby band of glass at street level, set into the white.
for (const s of solids.slice(0, 2)) {
  const r = s.ring
  for (let k = 0; k < r.length; k++) {
    const a = r[k], b = r[(k + 1) % r.length]
    if (owner.get(key(b, a)) !== undefined || Math.hypot(b[0] - a[0], b[1] - a[1]) < 4) continue
    panel(win, a, b, 0.8, Math.hypot(b[0] - a[0], b[1] - a[1]) - 0.8, 0.5, LOBBY - 1.2)
  }
}

await save('chi-smurfit-stone', 'Crain Communications Building', [41.88483, -87.624977], 0, [
  { part: white, material: finish('crain-white', 0xeeeeea) },
  { part: win, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
  { part: roof, material: PALETTE.roof },
])
