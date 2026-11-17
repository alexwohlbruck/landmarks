/**
 * Hurt Building, Atlanta (1913–1926, J. E. R. Carpenter for Joel Hurt) —
 * original procedural geometry, CC0-1.0.
 * bun generators/atl-hurt-building.ts
 *
 * Uses the B4 kit exported from generators/atl-flatiron-building.ts.
 *
 * Map frame: x east, y north, z up, metres; bearing 0, the plan is OSM's
 * outline as drawn. Anchor = centroid of OSM way/24232553 ("Hurt
 * Building", building=commercial, height 82, 18 levels), 33.754259,
 * -84.387189.
 *
 * Identity: a seventeen-storey office block on a triangular lot between
 * Edgewood Avenue (north) and Hurt Plaza (south-west). Its two wings, the
 * long Edgewood wing and the Hurt Plaza wing, meet at the narrow west end
 * in a smooth full-height round: the whole facade, base, windows, frieze
 * and cornice, wraps round it. At its foot stands a broad two-storey
 * marble entrance rotunda with columns, windows and a balustraded roof,
 * about as wide as the round end. A tall grey-white
 * marble base under a cornice, a shaft of white glazed brick with cream
 * terracotta spandrels, and a cream terracotta frieze under a heavy
 * bracketed cornice. Between the wings, on the south-east, a low block
 * fills the angle.
 *
 * Evidence:
 *  - plan: OSM way/24232553 (the whole lot, with the rotunda's circle at
 *    the west end). The round end is a fillet tangent to both wing faces
 *    through OSM's two end corners (centre (-44.45, 10.0), r 8.1 m, 150°);
 *    the rotunda is a drum 2.6 m proud of it over its middle 120°, sized
 *    from LeMay's west-end photo (review round 1: the earlier sharp end
 *    and small tube at OSM's 4.65 m circle did not match it). The wings are cut from the lidar: the Edgewood wing
 *    from the north edge to y ≈ -2.5, the Hurt Plaza wing about 20 m deep
 *    from the south-west edge; the angle between them is the low block.
 *  - heights: USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 1 m grid,
 *    above ground_min 310.76 m. Measured: tower roof 68.0–70.7 m (69.5
 *    used), a rooftop penthouse 75.9–77.9 m over the middle of the Edgewood
 *    wing (x −22…−2), the low block 18.2–19.5 m (18.8 used), the rotunda
 *    16.4–17.8 m (17 used, to the balustrade). OSM's 82 m is not borne out.
 *  - ground: Mapterhorn falls about 4.3 m from the west end to the east
 *    side; y = 0 is the east side, so the west end and the rotunda stand in
 *    4 m of hill (their walls run down to y = 0); elevation 0.
 *  - storeys: base cornice at about 17.5 m (level with the rotunda's top,
 *    LeMay's west-end photo), the top frieze about 5 m deep under a 2 m
 *    cornice, scaled from the same photo and Merlin's.
 *  - colour: grey-white marble base, white glazed brick shaft (a cool
 *    white), cream terracotta frieze and cornice — all from the daylight
 *    photos.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - The Hurt Building, Atlanta, GA (33597846218).jpg, Warren LeMay, CC0
 *    (the west end and rotunda, the Hurt Plaza front)
 *    https://commons.wikimedia.org/wiki/File:The_Hurt_Building,_Atlanta,_GA_(33597846218).jpg
 *  - Hurt Building at sunset in Atlanta.jpg, Marc Merlin, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Hurt_Building_at_sunset_in_Atlanta.jpg
 *  - Hurt-building-atlanta-side.jpg, Connor.carey, CC BY-SA 3.0 (the
 *    shaft's brick and spandrels)
 *    https://commons.wikimedia.org/wiki/File:Hurt-building-atlanta-side.jpg
 *  - The Hurt Building, Atlanta, GA (32532497137).jpg, Warren LeMay, CC0
 *    (the marble base)
 *    https://commons.wikimedia.org/wiki/File:The_Hurt_Building,_Atlanta,_GA_(32532497137).jpg
 *  - The Hurt Building, Atlanta, GA (46559101345).jpg, Warren LeMay, CC0
 *    (the long front and cornice)
 *    https://commons.wikimedia.org/wiki/File:The_Hurt_Building,_Atlanta,_GA_(46559101345).jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the low block in the angle and the inner faces of the wings are
 * seen in no photo (drawn plain with the shaft's windows); the
 * terracotta spandrels are folded into the brick between the panel bands;
 * the rotunda's columns are drawn as engaged half-columns, five of them
 * (the real drum has more, paired); its size is photo-scaled.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, ccw, circle, offset, column, cornice, edgePanels, prism, save, smoothWall, split, wall, type PanelOpts, type XY } from './atl-flatiron-building'

const brick = new Part(), marble = new Part(), tc = new Part(), win = new Part(), roof = new Part()

const BASE = 17.5, FRIEZE = 62.5, ROOF = 69.5, LOW = 18.8, ROT = 15.5

// The west end: a full-height round end, tangent to both wings, through
// OSM's end corners (-48.35, 3.08) and (-44.52, 18.12). The two wing faces
// meet at 30°, so the round turns through 150°; its centre (-44.45, 10.0)
// and radius 8.1 m are fitted to those corners. Its crown at x = -52.3
// lies inside OSM's outline, whose rotunda bulge reaches -54.8.
const EC: XY = [-44.45, 10.0], ER = 8.1, EN = 16
const endArc: XY[] = Array.from({ length: EN + 1 }, (_, i) => {
  const a = ((90 + (150 * i) / EN) * Math.PI) / 180
  return [EC[0] + ER * Math.cos(a), EC[1] + ER * Math.sin(a)] as XY
})
endArc[0] = [-44.52, 18.12]
endArc[EN] = [-48.35, 3.08]

// The tower: the Edgewood and Hurt Plaza wings in one ring (see the header).
const Q1: XY = [24.3, -21.0], QC: XY = [0.5, -2.5], E: XY = [37.28, -3.43]
const T = ccw([[14.91, -33.73], Q1, QC, E, [47.67, 11.09], [43.89, 17.92], [20.72, 17.97], ...endArc])
// The low block in the angle between the wings.
const LOWR = ccw([Q1, E, QC])

// ── Massing ──
wall(marble, split(T, 5), 0, BASE)
prism(brick, T, BASE, ROOF, roof, 0.4)
// Smooth shading over the round end, for the marble base and the brick.
smoothWall(marble, offset(endArc, 0.02), 0, BASE, false)
smoothWall(brick, offset(endArc, 0.02), BASE, ROOF - 0.5, false)
prism(marble, split(LOWR, 5), 0, LOW, roof, 0.3)
// The base cornice, the frieze and the crowning cornice, all carried round
// the round end with the ring.
cornice(marble, T, BASE - 0.6, 1.2, 0.5, marble)
wall(tc, offset(T, 0.1), FRIEZE, ROOF - 2.2)
smoothWall(tc, offset(endArc, 0.12), FRIEZE, ROOF - 2.2, false)
cornice(tc, T, ROOF - 2.2, 2.2, 1.3, roof)
// The rooftop penthouse (lidar 76–78 m).
box(roof, -22, -2, 0.5, 9.5, ROOF, 77.5, roof, 0.4)

// ── The rotunda at the foot of the round end ──
// A broad two-storey drum on the same centre as the round, 2.6 m proud of
// it, wrapping its middle 120°: as wide as the end in LeMay's photo. Engaged
// columns stand round it with tall windows between, under an entablature,
// a cornice and a balustrade. Its top at 17 m is the lidar's 16.4–17.8 m.
const RR = ER + 2.6, A0 = 105, A1 = 225, RN = 12
const arcAt = (r: number, n = RN): XY[] => Array.from({ length: n + 1 }, (_, i) => {
  const a = ((A0 + ((A1 - A0) * i) / n) * Math.PI) / 180
  return [EC[0] + r * Math.cos(a), EC[1] + r * Math.sin(a)] as XY
})
const sector = (r: number): XY[] => [...arcAt(r), ...arcAt(ER - 1.5).reverse()]
prism(marble, sector(RR), 0, ROT, null, 0)
smoothWall(marble, arcAt(RR + 0.02), 0, ROT, false)
// The cornice lip, then the balustrade round a flat roof.
prism(marble, sector(RR + 0.5), ROT, ROT + 0.7, roof, 0, true)
smoothWall(marble, arcAt(RR + 0.52), ROT, ROT + 0.7, false)
const bal = [...arcAt(RR + 0.2), ...arcAt(RR - 0.4).reverse()]
prism(marble, bal, ROT + 0.7, 17, marble, 0.15)
smoothWall(marble, arcAt(RR + 0.22), ROT + 0.7, 17 - 0.15, false)
// Engaged columns and the tall windows between them, above the west end's
// street (about 4 m up the hill from y = 0).
const NC = 5
for (let k = 0; k < NC; k++) {
  const a = ((A0 + 8 + ((A1 - A0 - 16) * k) / (NC - 1)) * Math.PI) / 180
  column(marble, [EC[0] + RR * Math.cos(a), EC[1] + RR * Math.sin(a)], 0.75, 3.6, ROT - 1.4, 10)
}
for (let k = 0; k < NC - 1; k++) {
  const a0 = ((A0 + 8 + ((A1 - A0 - 16) * (k + 0.17)) / (NC - 1)) * Math.PI) / 180
  const a1 = ((A0 + 8 + ((A1 - A0 - 16) * (k + 0.83)) / (NC - 1)) * Math.PI) / 180
  const P = (a: number, z: number): V3 => [EC[0] + (RR + 0.05) * Math.cos(a), EC[1] + (RR + 0.05) * Math.sin(a), z]
  const N = (a: number): V3 => [Math.cos(a), Math.sin(a), 0]
  const am = (a0 + a1) / 2
  for (const [p, q] of [[a0, am], [am, a1]]) {
    win.tri(P(p, 4.6), P(q, 4.6), P(q, ROT - 2), undefined, undefined, undefined, [N(p), N(q), N(q)])
    win.tri(P(p, 4.6), P(q, ROT - 2), P(p, ROT - 2), undefined, undefined, undefined, [N(p), N(q), N(p)])
  }
}

// ── Windows round the round end: grouped columns on the curve, as on the
// fronts, from the base cornice to the frieze. ──
function arcPanels(r: number, a0: number, a1: number, cols: number, z0: number, z1: number, group: number, gap: number, pierDeg: number) {
  const bands = Math.max(1, Math.round((z1 - z0) / group)), gh = (z1 - z0) / bands
  const N = (a: number): V3 => [Math.cos(a), Math.sin(a), 0]
  const P = (a: number, z: number): V3 => [EC[0] + r * Math.cos(a), EC[1] + r * Math.sin(a), z]
  const step = (a1 - a0) / cols
  for (let c = 0; c < cols; c++) {
    const p = ((a0 + c * step + pierDeg / 2) * Math.PI) / 180, q = ((a0 + (c + 1) * step - pierDeg / 2) * Math.PI) / 180
    const m = (p + q) / 2
    for (let g = 0; g < bands; g++) {
      const za = z0 + g * gh + gap / 2, zb = z0 + (g + 1) * gh - gap / 2
      for (const [u, v] of [[p, m], [m, q]]) {
        win.tri(P(u, za), P(v, za), P(v, zb), undefined, undefined, undefined, [N(u), N(v), N(v)])
        win.tri(P(u, za), P(v, zb), P(u, zb), undefined, undefined, undefined, [N(u), N(v), N(u)])
      }
    }
  }
}
arcPanels(ER + 0.07, 90, 240, 6, BASE + 1.4, FRIEZE - 0.8, 6.8, 1.7, 9)

// ── Windows ──
const shaft: PanelOpts = { group: 6.8, gap: 1.7, bay: 3.6, pier: 1.3, margin: 1.4, min: 4 }
for (let i = 0; i < T.length; i++) {
  const a = T[i], b = T[(i + 1) % T.length]
  edgePanels(win, a, b, BASE + 1.4, FRIEZE - 0.8, shaft)
  // The base: tall openings between marble piers, above the west end's
  // higher street (4 m up the hill) and down to the east end's street.
  const zb = Math.max(a[0], b[0]) < -20 ? 5.0 : 1.2
  edgePanels(win, a, b, zb, BASE - 1.6, { ...shaft, group: 16, gap: 0, bay: 4.2, pier: 1.6 })
}
// The low block's two outer-facing walls get shop windows.
edgePanels(win, Q1, E, 1.2, LOW - 2, { ...shaft, group: 8, gap: 1.5 })

await save('atl-hurt-building', 'Hurt Building', [
  { part: brick, material: finish('hurt-brick', 0xe8e8e2) },
  { part: marble, material: finish('hurt-marble', 0xdcdbd5) },
  { part: tc, material: finish('hurt-terracotta', 0xe9d9b4) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
], { height: 77.5, anchor: [33.754259, -84.387189], bearing: 0 })
