/**
 * Kansas City City Hall (1937, Wight and Wight), 414 East 12th Street,
 * Kansas City, Missouri — original procedural geometry, CC0-1.0.
 * bun generators/kc-city-hall.ts
 *
 * Also exports two small helpers (`stepped`, `columns`) that
 * kc-jackson-county-courthouse uses; the City Hall model is only written
 * when this file runs itself. It builds on the setback kit in
 * kc-power-and-light-building.ts (`Tower`, `groups`).
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of OSM way/118650979, -94.5779159 39.1006055.
 * Its walls run at 2.2° (the downtown grid), so the bearing is 2.2 and the
 * model is square to its own frame. Elevation 0.
 *
 * Identity, in order: the pale limestone shaft rising from the broad low
 * base block; the base's tall grouped windows between fluted piers, its
 * sculpted frieze panels and the tall glazed entrance bay in the middle of
 * the south front; the tower's stepped (notched) corners and its two
 * setbacks near the top, with the narrow side strips stopping lower; the
 * top tier with the observation deck behind its parapet; the raised
 * terrace and steps on 12th Street.
 *
 * Evidence
 * - OSM way/118650979 (height 135, 30 levels, Q7485892) and its parts,
 *   all inside the outline: way/1345294950 (base, 28 m), 1345294942 (109),
 *   1345294941 (120), 1345294940 (127), 1345294943/1345294944 (96, the
 *   narrow east and west strips), 1345294945 (glass entrance on the north,
 *   5 m) and 1345294946 (its canopy). The parts' plans are used as drawn.
 * - USGS 3DEP lidar MO_FEMANRCS_1_2020 (2020 flight), 0.5 m, read in this
 *   frame; it sits on the OSM outline within half a metre. Heights above
 *   the model's y = 0 (the lowest ground under the footprint, the SW
 *   corner, ~276.9 m NAVD88 from the map's terrain; lidar - 1.8), measured:
 *   base 33; the side strips 100; first tier 114; second 125; top tier roof
 *   130.5 with parapet to ~134; a small roof house to 140. Published 135 m
 *   above 12th Street (443 ft, Wikipedia) agrees: the street front stands
 *   ~5 m above y = 0. The lidar has no returns on the west third of the
 *   base roof (shadowed); OSM's 28 m part is taken there.
 *   The south terrace: lidar 6.8 over y -19..-27 → top at 5.
 * - Photos (all daylight unless said): "Kansas City Missouri City Hall.jpg"
 *   (KindaGuitarded, CC BY-SA 3.0; from the south-south-west: colour, the
 *   base's window groups, fluted piers and frieze, the tower's corner
 *   steps); Flickr 6664834789 "Kansas City City Hall" (noahjeppson,
 *   CC BY-SA 2.0; frontal from the south: base proportions measured,
 *   ~10.4 px/m: corner groups of two windows x ±21..29, groups of three
 *   x ±7..18, the entrance bay ±3.7, tall windows from 5.4 to 22.4 m above
 *   the terrace, frieze 24-27); Flickr 44713901584 "Kansas City City Hall"
 *   (pasa47, CC BY 2.0; south, overcast: the tower's window columns, eight
 *   in the middle of the south face, one in each corner bay); "Kansas City
 *   Downtown Aerial (12448426133).jpg" (formulanone, CC BY-SA 2.0; from the
 *   north-east, high: the north and east faces, the setbacks, the flat top).
 * - Estimated: the storey (3.9 m) and the three-storey window groups; the
 *   side-face window columns (aerial, coarse); the frieze panel sizes.
 * - Look-only, not used: Flickr photos by jimmywayne, Sean_Marshall,
 *   ChrisM70 and Yudha P Sunandar (NC/ND licences).
 * - Doubts: no close daylight photo of the north or west faces; they repeat
 *   the south's rhythm, which the aerial supports at its scale.
 *
 * Colours: the limestone reads warm pale buff in sun (#d6ccb8, KindaGuitarded
 * photo), pulled to the palette's lightness; windows the palette slate;
 * setback terraces `roof`; frieze panels and the fluted piers `trim`.
 * Night: the tower is floodlit white from the setbacks (`_FLOODLIGHT`,
 * rising with height); the base is not.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, onWall, panel, parapetRoof, rect, save, walls, type XY } from './chi-aon-center'
import { Tower, groups } from './kc-power-and-light-building'

/**
 * A rectangle centred on (cx, cy) whose four corners are notched in steps:
 * `steps` lists [halfX, halfY] corner points from the east face inwards,
 * e.g. [[16.9, 12.1], [15.3, 13.5], [13.7, 14.5]]. Counter-clockwise.
 */
export function stepped(cx: number, cy: number, steps: [number, number][]): XY[] {
  const q: XY[] = [] // first quadrant, from the east face round to the north face
  steps.forEach(([x, y], i) => {
    if (i > 0) q.push([x, steps[i - 1][1]])
    q.push([x, y])
  })
  const r: XY[] = []
  const quad = (sx: number, sy: number, rev: boolean) => {
    const pts = q.map(([x, y]) => [cx + sx * x, cy + sy * y] as XY)
    r.push(...(rev ? pts.reverse() : pts))
  }
  quad(1, -1, true) // south-east, from the south face to the east face
  quad(1, 1, false)
  quad(-1, 1, true)
  quad(-1, -1, false)
  return r
}

/** Window panels on wall a→b at the given [s0, s1] spans, over storey groups. */
export function columns(p: Part, a: XY, b: XY, spans: [number, number][], rows: [number, number][], out = 0.05) {
  for (const [s0, s1] of spans) for (const [z0, z1] of rows) panel(p, a, b, s0, s1, z0, z1, out)
}

/** n evenly pitched spans of width w between s0 and s1. */
export const spread = (s0: number, s1: number, n: number, w: number): [number, number][] =>
  Array.from({ length: n }, (_, i) => { const c = s0 + (s1 - s0) * (i + 0.5) / n; return [c - w / 2, c + w / 2] as [number, number] })

// ---------------------------------------------------------------------------
// Kansas City City Hall

function build() {
  const stone = new Part(), roof = new Part(), win = new Part(), trim = new Part(), door = new Part()
  const T = new Tower(stone, roof, win)
  const CY = -1.5 // the tower's centre line (OSM parts)
  const ST = 3.9 // storey

  // --- the base block (OSM outline), 33 m, with the south front projecting
  const baseMain = rect(-29.5, -18.3, 29.5, 17.4)
  const baseFront = rect(-20.3, -19.5, 20.1, -18.0)
  T.mass(baseMain, 0, 33.4, 0.5)
  T.mass(baseFront, 0, 32.6, 0.4)
  // the north entrance (glass, 5 m) and its canopy
  block(stone, roof, rect(-6.9, 17.4, 8.0, 22.0), 0, 9.5, 0.3)
  block(stone, roof, rect(-6.9, 22.0, 8.1, 27.0), 8.8, 9.6, 0.15)
  for (const x of [-6.4, 7.6]) block(stone, null, rect(x - 0.3, 26.4, x + 0.3, 27.0), 4.6, 8.8, 0)
  panel(win, [8.0, 22.0], [-6.9, 22.0], 0.8, 14.1, 5.0, 8.4)

  // --- the terrace on 12th Street with its central steps
  block(stone, roof, rect(-22, -27, 22, -19.4), 0, 5.2, 0.25)
  for (let i = 0; i < 6; i++) {
    const y0 = -27 - (6 - i) * 0.55
    block(stone, roof, rect(-8, y0, 8, y0 + 0.6), 0, 3.2 + 0.35 * i, 0.05) // from 12th Street (~3 above y = 0) up to the terrace
  }

  // --- the tower: side strips, first tier, second tier, top tier
  const wingE = rect(16.9, CY - 11.8, 18.7, CY + 11.8), wingW = rect(-18.7, CY - 11.8, -16.9, CY + 11.8)
  const t1 = stepped(0, CY, [[16.9, 12.1], [15.3, 13.5], [13.7, 14.5]])
  const t2 = stepped(0, CY, [[15.4, 10.5], [14.3, 12.0], [13.0, 13.1]])
  const t3 = stepped(0, CY, [[12.1, 8.2], [11.1, 9.2], [10.1, 10.2]])
  T.mass(wingE, 33, 100, 0.4)
  T.mass(wingW, 33, 100, 0.4)
  T.mass(t1, 33, 114, 0.45)
  T.mass(t2, 114, 125, 0.45)
  T.mass(t3, 125, 133.5, 0, null)
  parapetRoof(stone, roof, t3, 133.5, 0.7, 2.8) // the observation deck behind its parapet
  block(stone, roof, rect(-3.2, CY - 1.5, 3.2, CY + 4.5), 130.7, 137.5, 0.35) // roof house (lidar 140 is a mast base)

  // --- tower windows
  const G = (z0: number, z1: number) => groups(z0, z1, ST, 3, 1.5)
  // south and north faces of the first tier: one column in each corner bay,
  // eight in the middle
  const midSpans = spread(5.6, 28.2, 8, 1.55)
  const sideSpans: [number, number][] = [[2.3, 3.3], [30.5, 31.5]]
  const yS = CY - 14.5, yN = CY + 14.5
  columns(win, [-13.7, yS], [13.7, yS], spread(1.8, 25.6, 8, 1.85), G(37, 112.5))
  columns(win, [13.7, yN], [-13.7, yN], spread(1.8, 25.6, 8, 1.85), G(37, 112.5))
  // the stepped faces either side of those (x 13.7..15.3 and 15.3..16.9 steps are narrow: blank)
  void midSpans; void sideSpans
  // east and west: the strips carry single window columns to 100; above them the tier's own face
  columns(win, [18.7, CY - 11.8], [18.7, CY + 11.8], spread(1.5, 22.1, 6, 1.1), G(37, 98.5))
  columns(win, [-18.7, CY + 11.8], [-18.7, CY - 11.8], spread(1.5, 22.1, 6, 1.1), G(37, 98.5))
  columns(win, [16.9, CY - 12.1], [16.9, CY + 12.1], spread(1.5, 22.7, 6, 1.1), G(101, 112.5))
  columns(win, [-16.9, CY + 12.1], [-16.9, CY - 12.1], spread(1.5, 22.7, 6, 1.1), G(101, 112.5))
  // second tier: one group; top tier: the tall observation-floor windows
  for (const [a, b] of [[[-13, CY - 13.1], [13, CY - 13.1]], [[13, CY + 13.1], [-13, CY + 13.1]], [[15.4, CY - 10.5], [15.4, CY + 10.5]], [[-15.4, CY + 10.5], [-15.4, CY - 10.5]]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    columns(win, a, b, spread(1.5, L - 1.5, Math.round(L / 3.1), 1.45), [[115.3, 119.6], [120.6, 123.4]])
  }
  for (const [a, b] of [[[-10.1, CY - 10.2], [10.1, CY - 10.2]], [[10.1, CY + 10.2], [-10.1, CY + 10.2]], [[12.1, CY - 8.2], [12.1, CY + 8.2]], [[-12.1, CY + 8.2], [-12.1, CY - 8.2]]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    columns(win, a, b, spread(1.4, L - 1.4, Math.round(L / 2.6), 1.3), [[126.2, 131.2]])
  }
  // the zigzag frieze under the first setback: a pale band on each face
  for (const [a, b] of [[[-13.7, CY - 14.5], [13.7, CY - 14.5]], [[13.7, CY + 14.5], [-13.7, CY + 14.5]]] as [XY, XY][]) {
    panel(trim, a, b, 1.2, 26.2, 112.8, 113.6, 0.06)
  }

  // --- base windows, frieze panels, fluted piers and the entrance bay
  const B = (z0: number, z1: number) => groups(z0, z1, 5.7, 1, 0.9) // three groups between spandrels
  const TW = B(10.4, 27.4)
  // south front (on the projecting front, y -19.5, x -20.3..20.1)
  const sA: XY = [-20.3, -19.5], sB: XY = [20.1, -19.5]
  const at = (x: number) => x + 20.3 // s along the south front for an x
  const sw = (x0: number, x1: number, n: number) => spread(at(x0), at(x1), n, 1.6)
  columns(win, sA, sB, [...sw(-18.5, -8.4, 3), ...sw(6.5, 17.0, 3)], TW)
  // the corner pavilions (y -18.3), two windows each
  columns(win, [-29.5, -18.3], [-20.3, -18.3], spread(0.8, 8.4, 2, 1.7), TW)
  columns(win, [20.1, -18.3], [29.5, -18.3], spread(0.8, 8.6, 2, 1.7), TW)
  // ground storey: small windows on the terrace level
  columns(win, sA, sB, [...sw(-18.5, -8.4, 3), ...sw(6.5, 17.0, 3)].map(([a, b]) => [a + 0.2, b - 0.2] as [number, number]), [[6.2, 8.6]])
  // entrance bay: tall glazed grille, doors at its foot, pale surround
  panel(trim, sA, sB, at(-4.6), at(4.4), 5.2, 28.2, 0.04)
  panel(win, sA, sB, at(-3.7), at(3.5), 10.2, 27.2, 0.08)
  panel(door, sA, sB, at(-3.0), at(2.8), 5.2, 9.4, 0.08)
  // fluted piers either side of each window group, frieze panels above
  for (const [x0, x1] of [[-21, -18.7], [-8.2, -4.8], [4.6, 6.4], [17.2, 19.6]] as [number, number][]) panel(trim, sA, sB, at(x0), at(x1), 9.6, 27.4, 0.05)
  for (const [x0, x1] of [[-17.6, -9.3], [-3.0, 3.0], [7.4, 16.1]] as [number, number][]) panel(trim, sA, sB, at(x0), at(x1), 28.2, 31.2, 0.05)
  for (const [x0, x1] of [[-28.4, -22.0], [21.8, 28.4]] as [number, number][]) {
    const a: XY = x0 < 0 ? [-29.5, -18.3] : [20.1, -18.3], b: XY = x0 < 0 ? [-20.3, -18.3] : [29.5, -18.3]
    const s0 = x0 - a[0]
    panel(trim, a, b, s0, s0 + (x1 - x0), 28.2, 31.2, 0.05)
  }
  // east, west and north faces of the base: the same tall windows in threes
  // between piers; the west runs down to the lower ground
  for (const [a, b, n] of [[[29.5, -18.3], [29.5, 17.4], 9], [[-29.5, 17.4], [-29.5, -18.3], 9], [[29.5, 17.4], [8.0, 17.4], 5], [[-6.9, 17.4], [-29.5, 17.4], 5]] as [XY, XY, number][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    columns(win, a, b, spread(2.0, L - 2.0, n, 1.6), TW)
    columns(win, a, b, spread(2.0, L - 2.0, n, 1.6).map(([s0, s1]) => [s0 + 0.2, s1 - 0.2] as [number, number]), [[6.2, 8.6]])
    panel(trim, a, b, 1.6, L - 1.6, 28.4, 30.8, 0.04)
  }

  // Night: the tower is floodlit from its base and setbacks; the base stays dark.
  const lit = (p: V3, n: V3) => {
    if (p[2] < 33.5) return 0
    const k = Math.min(1, 0.5 + 0.5 * (p[2] - 33) / 100)
    return n[2] > 0.7 ? k * 0.3 : k
  }
  void cap; void onWall
  return [
    { part: stone, material: { ...finish('kcch-limestone', 0xdcd1bd), floodlight: lit } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: trim, material: finish('kcch-limestone-pale', 0xe8dfcd) },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('kc-city-hall', 'Kansas City City Hall', [39.1006055, -94.5779159], 2.2, build(), 6500)
