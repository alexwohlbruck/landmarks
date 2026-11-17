/**
 * Dee and Charles Wyly Theatre, AT&T Performing Arts Center (2400 Flora
 * Street, Dallas; REX / OMA, Joshua Prince-Ramus and Rem Koolhaas, 2009) —
 * original procedural geometry, CC0-1.0.
 * bun generators/dal-wyly-theatre.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * anchor. Anchor = centroid of the OSM outline way/361449421, 32.7900031,
 * -96.7963821. Bearing 46: the tower's walls run at 46° / 136° (OSM and
 * lidar), so it is square to this frame. +x faces south-east, -x faces
 * north-west onto Flora Street and the sunken lobby slope, -y faces
 * south-west.
 *
 * Identity, in order: a tall plain square box clad all over in vertical
 * silver aluminium tubes; its glazed base; the "barcode" window slots high
 * on the Flora Street face (a full-width band, and a half-width block under
 * it); the big square opening at the top of the south-west face near the
 * west corner; the cantilevered solid panel over the glass on Flora Street.
 *
 * Evidence:
 *  - plan: USGS 3DEP lidar TX_Pecos_Dallas_B3_2018 (2018 flight, 0.5 m
 *    grid): the box's roof is x -17.5..18.5, y -17.5..13.5 (36 x 31 m),
 *    1-2 m east and north of the OSM part way/1396184197 (35.9 x 30.8 m);
 *    lidar followed, since NAIP here leans too much to place the walls.
 *    Low north-east annex: OSM way/1396184198, x -7..10, y 13.5..27.2.
 *  - heights (lidar DSM minus the ground round the box, 144.2 m): roof
 *    40.2 m (measured, 42.0 above the box's ground_min); the roof trough
 *    behind the south-east parapet floor 35.6 at x 8.5..14.5, y -16..10
 *    (measured); rooftop stair box 43.1 (measured); annex 8.0 (measured).
 *    OSM height 40 agrees.
 *  - facade: Praefcke's photo 02 (the Flora Street face, square on) for the
 *    base glass (~8.5 m above the street; the lobby is sunk below it), the
 *    cantilever panel, and the two barcode bands (upper band z 30.2-32.8
 *    over nearly the full width, lower block z 22.9-28.7 over the left
 *    half); photo 03 and 01 for the opening (1.4-11.3 m from the west
 *    corner, 6 m tall, its top 3 m under the roof) and the ~4 m glass base
 *    on the other faces. The tube cladding is drawn as broad vertical bands
 *    of two silvers (1.1-2.6 m and 0.5-1.3 m wide), not as tubes.
 *  - colour: silver-grey aluminium in every daylight photo (#dfe3e5 bands
 *    over #c4c9cc); base glass `window`, lit at night (RFTunnell's night
 *    photo shows the glazed base and slots lit).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Dallas_Wyly_Theatre_01-04.jpg, ..._and_birds.jpg,
 *    ..._from_Winspear_Opera.jpg — Andreas Praefcke, CC BY 3.0
 *  - Dallas_Wyly_Theatre_May_2009.jpg — Luis Tamayo, CC BY-SA 2.0
 *  - Distant view of the Dee and Charles Wyly Theatre (edited).jpg and
 *    LCCN2015631026 — Carol M. Highsmith, public domain
 *  - Wyly_Theatre_at_Night.jpg — RFTunnell, CC BY-SA 4.0
 *  - Wyly_downtown.jpg, Wyly_slope.jpg — Bottomless, public domain
 * Aerial: USGS NAIP (public domain). No look-only sources. No commercial
 * imagery or 3D tiles.
 *
 * Doubts: the slots on the other three faces are not clearly photographed
 * and are left plain; the annex's walls are unphotographed (drawn as plain
 * concrete); the sunken lobby slope in front of the Flora Street face is
 * ground, left to the map. Left out: the external stair frame on the
 * north-east side, the WYLY lettering, the tubes' pinched pattern.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, panel, save, walls, type XY } from './chi-merchandise-mart'

const ANCHOR: [number, number] = [32.7900031, -96.7963821]
const BEARING = 46

const X0 = -17.5, X1 = 18.5, Y0 = -17.5, Y1 = 13.5, TOP = 40.2

/** A small deterministic hash, for band widths that look irregular but rebuild the same. */
const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return s - Math.floor(s)
}

function build() {
  const dark = new Part(), light = new Part(), win = new Part(), roof = new Part(), conc = new Part()

  // --- The box.
  const box: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
  walls(dark, box, 0, TOP - 0.3)
  walls(light, box, TOP - 0.3, TOP, inset(box, 0.3))
  // Roof: the main deck at TOP, with the trough behind the south-east parapet.
  const tx0 = 8.5, tx1 = 14.5, ty0 = -16, ty1 = 10, TZ = 35.6
  const r = inset(box, 0.3)
  const RX0 = r[0][0], RY0 = r[0][1], RX1 = r[2][0], RY1 = r[2][1]
  const rect = (a: number, b: number, c: number, d: number): XY[] => [[a, b], [c, b], [c, d], [a, d]]
  for (const q of [rect(RX0, RY0, tx0, RY1), rect(tx1, RY0, RX1, RY1), rect(tx0, RY0, tx1, ty0), rect(tx0, ty1, tx1, RY1)]) cap(roof, q, TOP)
  const trough = rect(tx0, ty0, tx1, ty1)
  walls(light, [...trough].reverse(), TZ, TOP)
  cap(roof, trough, TZ)
  // Rooftop stair box near the north edge (lidar 43.1).
  const st = rect(-2.5, 10.5, 2.5, 13.0)
  walls(dark, st, TOP, 43.1)
  cap(roof, st, 43.1)

  // --- Facades, per face: a glass base, the cladding as broad bands of two
  // silvers, with the slots and the opening left out of the bands.
  type Hole = { s0: number; s1: number; z0: number; z1: number }
  const faces: { a: XY; b: XY; base: number; holes: Hole[]; seed: number }[] = [
    // south-west (-y), the opening near the west corner (s from the west end)
    { a: [X0, Y0], b: [X1, Y0], base: 4.2, holes: [{ s0: 1.4, s1: 11.3, z0: TOP - 9.0, z1: TOP - 3.0 }], seed: 1 },
    { a: [X1, Y0], b: [X1, Y1], base: 4.2, holes: [], seed: 2 }, // south-east
    { a: [X1, Y1], b: [X0, Y1], base: 4.2, holes: [], seed: 3 }, // north-east
    // north-west, Flora Street: s runs from the north corner to the west corner
    { a: [X0, Y1], b: [X0, Y0], base: 8.5, holes: [{ s0: 1.0, s1: 30.0, z0: 30.2, z1: 32.8 }, { s0: 1.0, s1: 15.4, z0: 22.9, z1: 28.7 }], seed: 4 },
  ]
  for (const { a, b, base, holes, seed } of faces) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    // glass base
    panel(win, a, b, 0.25, L - 0.25, 0, base, 0.05)
    // slots and opening: dark window panels set into the wall
    for (const h of holes) panel(win, a, b, h.s0, h.s1, h.z0, h.z1, 0.05)
    // light bands, irregular widths, broken round the holes
    let s = 0.3 + hash(seed) * 0.6, k = 0
    while (s < L - 0.6) {
      const w = Math.min(1.1 + hash(seed * 31 + k) * 1.5, L - 0.3 - s)
      // where a band crosses a hole's side, split the band at the hole's edge
      const cuts = [s, s + w]
      for (const h of holes) for (const e of [h.s0, h.s1]) if (e > s && e < s + w) cuts.push(e)
      cuts.sort((p, q) => p - q)
      for (let c = 0; c < cuts.length - 1; c++) {
        const m = (cuts[c] + cuts[c + 1]) / 2
        const inHole = holes.filter(h => m > h.s0 && m < h.s1)
        let spans: [number, number][] = [[base, TOP - 0.3]]
        for (const h of inHole) spans = spans.flatMap(([p, q]) => (q <= h.z0 || p >= h.z1 ? [[p, q]] : [[p, h.z0], [h.z1, q]]) as [number, number][]).filter(([u, v]) => v - u > 0.2)
        for (const [z0, z1] of spans) panel(light, a, b, cuts[c], cuts[c + 1], z0, z1, 0.08)
      }
      s += w + 0.5 + hash(seed * 17 + k) * 0.8
      k++
    }
  }
  // A steel brace across the opening, lower left to upper right (Praefcke 01, 03).
  {
    const ax = X0 + 1.4 + 0.3, bx = X0 + 11.3 - 0.3, z0 = TOP - 9.0, z1 = TOP - 3.0, w = 0.7, y = Y0 - 0.1
    light.quad([ax, y, z0], [ax + w, y, z0], [bx, y, z1 - 0.45], [bx - w, y, z1])
  }
  // Cantilevered solid panel over the Flora Street glass (Praefcke 02).
  {
    const a: XY = [X0, Y1], b: XY = [X0, Y0]
    const s0 = 7.0, s1 = 23.5, z0 = 8.5, z1 = 13.0, d = 0.7
    panel(light, a, b, s0, s1, z0, z1, d)
    // its edges back to the wall
    const P = (s: number, z: number, o: number) => [X0 - o, Y1 - s, z] as [number, number, number]
    light.quad(P(s0, z0, 0), P(s1, z0, 0), P(s1, z0, d), P(s0, z0, d))
    light.quad(P(s0, z1, d), P(s1, z1, d), P(s1, z1, 0), P(s0, z1, 0))
    light.quad(P(s0, z0, 0), P(s0, z0, d), P(s0, z1, d), P(s0, z1, 0))
    light.quad(P(s1, z0, d), P(s1, z0, 0), P(s1, z1, 0), P(s1, z1, d))
  }

  // --- The low annex on the north-east.
  const an: XY[] = rect(-7.0, Y1, 10.0, 27.2)
  walls(conc, an, 0, 7.6)
  walls(conc, an, 7.6, 8.0, inset(an, 0.3))
  cap(roof, inset(an, 0.3), 8.0)
  for (const [p, q] of [[an[1], an[2]], [an[2], an[3]]] as [XY, XY][]) {
    const L = Math.hypot(q[0] - p[0], q[1] - p[1])
    panel(win, p, q, 0.8, L - 0.8, 0.4, 3.6, 0.05)
  }

  return [
    { part: dark, material: finish("wyly-aluminium", 0xc4c9cc) },
    { part: light, material: finish('wyly-aluminium-light', 0xdfe3e5) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: conc, material: finish('wyly-concrete', 0xcfcdc6) },
  ]
}

if (import.meta.main) await save('dal-wyly-theatre', 'Wyly Theatre', ANCHOR, BEARING, build(), 5000)
