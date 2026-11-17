/**
 * Houses of Parliament, Cape Town: the 1884 main building (Charles Freeman,
 * completed by Henry Greaves), Parliament Street, now home of the National
 * Council of Provinces: original procedural geometry, CC0-1.0.
 * bun generators/cpt-parliament.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/141281524
 * ("National Council of Provinces", the 1884 building), lng 18.4197251,
 * lat -33.9257997. Its walls run at 41.6 / 131.6 degrees; the catalog
 * bearing is 41.6, so in the model +x is the Parliament Street front (facing
 * south-east) with the main portico, -x the Company's Garden side with the
 * second portico, +y the north-east end towards Wale Street and the statue
 * of Queen Victoria, -y the south-west end, where the 1910 Old Assembly
 * wing (way/448068764) joins on.
 *
 * Model only the 1884 building, as asked. The parliament precinct
 * (relation/6651748, office=government) is the fenced grounds, not a
 * building; the Old Assembly Chamber (1910, way/448068764), the National
 * Assembly (1980s, way/448068763) and the office blocks are separate OSM
 * buildings and stay on the map. So `replaces` is way/141281524 only.
 *
 * Identity, in order: the white hexastyle Corinthian portico on tall
 * pedestals with its wide low pediment, in front of a three-storey centre;
 * the long two-storey wings of red brick framed by white pilasters, white
 * window surrounds, a white cornice and balustrade; the corner pavilions
 * with their pedimented dormer aedicules and low dark mansard roofs; the
 * grey slate roofs behind. The same portico, a little smaller, faces the
 * Company's Garden. There is no dome or cupola on the 1884 building (none
 * in any photo; the dome over the trees in fire.jpg is the planetarium).
 *
 * Evidence:
 *  - plan: OSM outline way/141281524 (no parts, no heights), read in the
 *    turned frame: wings x -20.6..20.7, the porticoes projecting to x 26.1
 *    (front, y -9.8..10.4) and x -27.7 (garden side, y -9.5..9.9), the four
 *    corner pavilions (x 9.5..22.4 and -22..-9.6, y 28.4..41.6 and
 *    -28.4..-41), the small end porches x -4..4 to y +-44.
 *  - heights: none published. Measured on r3487 (the front portico straight
 *    on), scaled to its column spacing (OSM portico width 20.2 m over six
 *    columns, 3.6 m centres): columns about 13 m on their pedestals,
 *    pediment apex about 19 m. Wings (set back, corrected for distance, and
 *    on ossewa and andres): cornice 10.4-11.6, balustrade to 12.8.
 *    Pavilions (r3484, r3490): walls to 11.8, balustrade to 13.0, the
 *    mansard to about 17.1 with its brick lantern. The slate roofs' pitch
 *    and the court behind are estimated from fire.jpg (from above, 2022).
 *  - deliberately bolder than measured, after lead review (the portico must
 *    dominate as it does in ossewa and philipp): columns 1.9 m across on
 *    2.2 m pedestals, rising to 15.2 m, entablature to 17.4 m, pediment
 *    apex 21.6 m, so it stands well above the balustrades; the porticoes
 *    are drawn 2.3 m further out than OSM's outline (front columns at
 *    x 27.2, garden side at x -28.8), and the centre blocks behind them
 *    rise to 17.4 m, 8 m deep, under the pediment roof carried back.
 *  - bays: five to each wing between the portico and the pavilions, three
 *    to each pavilion face, five across the end links (ossewa, andres,
 *    philipp, disc23); one window a storey per bay.
 *  - colour: red brick (pulled to the palette's lightness), white-painted
 *    stucco (near-white #f6f3ee, as bright as the photos) for the pilasters, surrounds, cornice, balustrade and columns,
 *    grey slate, dark red doors.
 *  - map terrain: Mapterhorn has no z15 tiles here (tools/terrain.ts 404s);
 *    no lidar in South Africa. The ground rises gently to the south-west.
 *    Elevation 0.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Cape_Town,_Houses_of_Parliament.JPG (Ossewa, CC BY-SA 3.0) "ossewa":
 *    the front portico and wings.
 *  - Cape_Town_(ZA),_Parliament_of_South_Africa_--_2024_--_3484.jpg,
 *    _3487.jpg, _3490.jpg (Dietmar Rabich, CC BY-SA 4.0): a pavilion's
 *    mansard and dormer, the portico straight on, the other pavilion.
 *  - Parliament_WC_ZA.jpg (Andresdewet, CC BY-SA 3.0) "andres": the
 *    Parliament Street front at an angle.
 *  - Houses_of_Parliament_(Cape_Town).jpg (PhilippN, CC BY-SA 3.0): the
 *    front from the north-east, with the end pavilions.
 *  - Parliament,_Cape_Town_2023.jpg (Discott, CC BY-SA 4.0) "disc23": the
 *    garden side and a pavilion from the Company's Garden.
 *  - Houses_of_Parliament_from_inside_The_Company's_Gardens.JPG (Lara van
 *    Dyk, CC BY-SA 3.0): the garden portico.
 *  - Parliament_Fire_2022.jpg (Discott, CC BY-SA 4.0): the roofs from above.
 *  - 9_2_018_0234-Houses_of_Parliament-The_Cape-s.jpg (Janek Szymanowski,
 *    CC BY-SA 3.0): the front from the south-east.
 * No commercial imagery. No look-only sources.
 *
 * Left out: the balusters (solid bands with sunk panels), the capitals'
 * carving, the window pediments, the railings, lamps and the statue.
 *
 * Doubts: all heights are photo-scaled (no lidar here; expect +-1.5 m).
 * The inner courts and the roofs after the 2022 fire are drawn as one
 * slate roof ring (rise 2.3 m) around one open court with white walls and
 * windows (fire.jpg shows white inner ranges; the court's real plan is
 * not known). The wing height (balustrade top 12.8 m) is read from photos
 * taken close and low; the portico may read a little weaker than in the
 * street photos for that reason. The end porches are drawn as plain
 * projecting bays.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, rect, walls, cap, inset, block, lathe, type XY } from './chi-aon-center'
import { face, along, rectOn, pedimentOn } from './phl-independence-hall'
import { gableRoof } from './amsterdam-westerkerk'

const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 0.9)

function build() {
  const brick = new Part(), white = new Part(), roof = new Part(), win = new Part(), door = new Part()

  const box = (p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top: Part | null = p, bev = 0.2) =>
    block(p, top, rect(x0, y0, x1, y1), z0, z1, bev)
  /** A strip proud of wall a→b from s0 to s1, z0 to z1, d deep (a pilaster, a band). */
  const strip = (p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, d: number, top = true) => {
    const { P, n } = along(a, b)
    const N: V3 = [n[0], n[1], 0]
    const { u } = along(a, b)
    face(p, [P(s0, z0, d), P(s1, z0, d), P(s1, z1, d), P(s0, z1, d)], N)
    face(p, [P(s0, z0, 0), P(s0, z0, d), P(s0, z1, d), P(s0, z1, 0)], [-u[0], -u[1], 0])
    face(p, [P(s1, z0, d), P(s1, z0, 0), P(s1, z1, 0), P(s1, z1, d)], [u[0], u[1], 0])
    if (top) face(p, [P(s0, z1, 0), P(s0, z1, d), P(s1, z1, d), P(s1, z1, 0)], [0, 0, 1])
  }
  /**
   * A two-storey brick facade on wall a→b: white plinth, white pilasters at
   * the bay edges, a white string course, a window a storey per bay in a
   * white surround, white cornice and balustrade. `bays` are bay centres
   * along the wall; `w` the bay width.
   */
  const facade = (a: XY, b: XY, bays: number[], w: number, top: number, opts: { doorAt?: number[]; attic?: boolean; plain?: boolean } = {}) => {
    const { L } = along(a, b)
    strip(white, a, b, 0, L, 0, 1.5, 0.25)
    strip(white, a, b, 0, L, 5.8, 6.2, 0.18)
    strip(white, a, b, 0, L, top - 1.2, top - 0.2, 0.45)
    strip(white, a, b, 0, L, top - 0.2, top, 0.6)
    const edges = new Set<number>()
    for (const c of bays) { edges.add(+(c - w / 2).toFixed(2)); edges.add(+(c + w / 2).toFixed(2)) }
    if (!opts.plain) for (const e of edges) strip(white, a, b, Math.max(0, e - 0.32), Math.min(L, e + 0.32), 1.5, top - 1.2, 0.2, false)
    for (const c of bays) {
      const isDoor = opts.doorAt?.some(d => Math.abs(d - c) < 0.1)
      rectOn(white, a, b, c, 0.9, isDoor ? 1.5 : 1.9, 5.5, 0.04)
      rectOn(isDoor ? door : win, a, b, c, 0.62, isDoor ? 1.5 : 2.2, 5.1, 0.08)
      rectOn(white, a, b, c, 0.9, 6.5, 9.9, 0.04)
      rectOn(win, a, b, c, 0.62, 6.8, 9.5, 0.08)
      if (opts.attic) {
        rectOn(white, a, b, c, 0.75, 11.3, 12.9, 0.04)
        rectOn(win, a, b, c, 0.45, 11.6, 12.6, 0.08)
      }
    }
  }
  /** A balustrade on a ring (solid band, sunk dark-free panels drawn as a lighter coping). */
  const balustrade = (ring: XY[], z0: number, z1: number, t = 0.35) => {
    const i = inset(ring, t)
    walls(white, ring, z0, z1)
    walls(white, [...i].reverse(), z0, z1)
    for (let k = 0; k < ring.length; k++) {
      const l = (k + 1) % ring.length
      white.quad([ring[k][0], ring[k][1], z1], [ring[l][0], ring[l][1], z1], [i[l][0], i[l][1], z1], [i[k][0], i[k][1], z1])
    }
  }
  /** Window bands on the court walls (facing in). */
  const strip_ring = (r: XY[], z: number) => {
    const rr = [...r].reverse()
    for (let k = 0; k < rr.length; k++) {
      const a = rr[k], b = rr[(k + 1) % rr.length]
      const { L } = along(a, b)
      const n = Math.max(1, Math.round(L / 3.6))
      for (let i = 0; i < n; i++) rectOn(win, a, b, (i + 0.5) * L / n, 0.6, 6.8, z - 2.2, 0.06)
    }
  }
  /** A slate roof ring: hipped slopes from the eaves up to a ridge, down to a flat court. */
  const ringRoof = (r: XY[], z: number, d: number, rise: number) => {
    const r1 = inset(r, d), r2 = inset(r, 2 * d)
    walls(roof, r, z, z + rise, r1)
    walls(roof, [...r2].reverse(), z, z + rise, [...r1].reverse())
    // The inner court, open to a low roof over the ground floor (fire.jpg).
    walls(white, [...r2].reverse(), 4.5, z)
    strip_ring(r2, z)
    cap(roof, r2, 4.5)
  }

  // ----------------------------------------------------------------- wings
  const X0 = -20.6, X1 = 20.7, Y0 = -28.4, Y1 = 28.4, WT = 11.6
  {
    const r = rect(X0, Y0, X1, Y1)
    walls(brick, r, 0, WT - 1.2)
    walls(white, r, WT - 1.2, WT)
    balustrade(inset(r, -0.3), WT, WT + 1.2)
    ringRoof(inset(r, 1.2), WT + 0.4, 6.0, 2.3)
    // Five bays each side of the porticoes on both long fronts.
    const wing = [12.2, 15.8, 19.4, 23.0, 26.6]
    for (const [a, b] of [[[X1, Y0], [X1, Y1]], [[X0, Y1], [X0, Y0]]] as [XY, XY][]) {
      const { L } = along(a, b)
      facade(a, b, [...wing.map(s => L / 2 - s), ...wing.map(s => L / 2 + s)].map(s => s), 3.6, WT)
    }
  }

  // ------------------------------------------------- the porticoes (+x, -x)
  const portico = (side: 1 | -1, front: number, hy: number) => {
    // The three-storey centre block behind the columns.
    const wall = side > 0 ? X1 + 0.3 : X0 - 0.3
    const inner = wall - side * 8, xa = Math.min(wall, inner), xb = Math.max(wall, inner)
    const CT = 17.4
    // White walls (only their front face is brick; the sides and back rise
    // above the slate roofs and read white), the brick front as a panel.
    box(white, xa, -hy, xb, hy, 0, CT - 1.2, null, 0)
    rectOn(brick, side > 0 ? [wall, -hy] : [wall, hy], side > 0 ? [wall, hy] : [wall, -hy], hy, hy - 0.05, 1.5, CT - 1.2, 0.02)
    box(white, xa - 0.2, -hy - 0.2, xb + 0.2, hy + 0.2, CT - 1.2, CT, null, 0.15)
    const fa: XY = side > 0 ? [wall, -hy] : [wall, hy], fb: XY = side > 0 ? [wall, hy] : [wall, -hy]
    const L = 2 * hy
    facade(fa, fb, [-7.2, -3.6, 0, 3.6, 7.2].map(s => L / 2 + s), 3.6, CT, { doorAt: [L / 2], attic: true, plain: true })
    // Podium with steps.
    const px0 = Math.min(wall, front + side * 1.5), px1 = Math.max(wall, front + side * 1.5)
    box(white, px0, -hy - 0.4, px1, hy + 0.4, 0, 1.2, white, 0.1)
    const sx0 = Math.min(front, front + side * 1.5), sx1 = Math.max(front, front + side * 1.5)
    box(white, sx0, -hy + 1.5, sx1, hy - 1.5, 0, 0.6, white, 0.1)
    // Columns: six across the front, with a return pair behind the corners.
    const ys = [-9, -5.4, -1.8, 1.8, 5.4, 9].map(y => (y * hy) / 10.1)
    const cxF = front - side * 1.2, cxB = wall + side * 1.4
    const col = (x: number, y: number) => {
      box(white, x - 1.1, y - 1.1, x + 1.1, y + 1.1, 1.2, 3.2, white, 0.12)
      lathe(white, x, y, [[0.95, 3.2], [0.88, 3.5], [0.86, 12.6], [0.8, 14.3], [1.08, 15.2], [0, 15.2]], 12)
      box(white, x - 1.1, y - 1.1, x + 1.1, y + 1.1, 15.2, 15.5, white, 0.08)
    }
    for (const y of ys) col(cxF, y)
    for (const y of [ys[0], ys[5]]) col(cxB, y)
    // Entablature over the columns, then the pediment and its roof.
    const ex0 = Math.min(wall, front), ex1 = Math.max(wall, front), rx0 = Math.min(inner, front), rx1 = Math.max(inner, front)
    box(white, ex0, -hy - 0.2, ex1, hy + 0.2, 15.5, 17.4, white, 0.25)
    const pa = 21.6 - (10.1 - hy) * 0.35
    const pf: XY = side > 0 ? [front, -hy - 0.2] : [front, hy + 0.2], pb: XY = side > 0 ? [front, hy + 0.2] : [front, -hy - 0.2]
    pedimentOn(white, pf, pb, hy + 0.2, hy + 0.2, 17.4, pa, 0.05)
    gableRoof(roof, null, rx0, -hy - 0.4, rx1, hy + 0.4, 17.4, pa, true, 0.2, 0)
    // Close the pediment's back against the centre block's roof.
    const back: XY = side > 0 ? [inner, hy + 0.2] : [inner, -hy - 0.2], back2: XY = side > 0 ? [inner, -hy - 0.2] : [inner, hy + 0.2]
    pedimentOn(white, back, back2, hy + 0.2, hy + 0.2, 17.4, pa, 0.05)
  }
  portico(1, 28.4, 10.1)
  portico(-1, -30.0, 9.7)

  // ------------------------------------------------------------- pavilions
  const PT = 11.8
  const pavilion = (x0: number, y0: number, x1: number, y1: number, outer: number[]) => {
    const r = rect(x0, y0, x1, y1)
    walls(brick, r, 0, PT - 1.2)
    walls(white, r, PT - 1.2, PT)
    walls(white, inset(r, -0.35), PT - 0.35, PT, inset(r, -0.35))
    balustrade(inset(r, -0.2), PT, PT + 1.2)
    // Faces: three bays each.
    const sides: [XY, XY][] = [[r[0], r[1]], [r[1], r[2]], [r[2], r[3]], [r[3], r[0]]]
    for (const [a, b] of outer.map(k => sides[k])) {
      const { L } = along(a, b)
      const w = Math.min(3.6, (L - 1) / 3)
      facade(a, b, [L / 2 - w, L / 2, L / 2 + w], w, PT)
      // The pedimented dormer aedicule rising through the balustrade.
      const { P, n } = along(a, b)
      const dw = 1.6
      const q = (s: number, z: number, o: number) => P(s, z, o)
      const N: V3 = [n[0], n[1], 0]
      face(white, [q(L / 2 - dw, PT, 0.1), q(L / 2 + dw, PT, 0.1), q(L / 2 + dw, PT + 3.0, 0.1), q(L / 2 - dw, PT + 3.0, 0.1)], N)
      rectOn(win, a, b, L / 2, 0.55, PT + 0.6, PT + 2.6, 0.16)
      pedimentOn(white, a, b, L / 2, dw + 0.2, PT + 3.0, PT + 4.1, 0.25)
      // Back and sides of the aedicule, into the roof.
      const { u } = along(a, b)
      face(white, [q(L / 2 - dw, PT, 0.1), q(L / 2 - dw, PT, -2.2), q(L / 2 - dw, PT + 3.0, -2.2), q(L / 2 - dw, PT + 3.0, 0.1)], [-u[0], -u[1], 0])
      face(white, [q(L / 2 + dw, PT, -2.2), q(L / 2 + dw, PT, 0.1), q(L / 2 + dw, PT + 3.0, 0.1), q(L / 2 + dw, PT + 3.0, -2.2)], [u[0], u[1], 0])
    }
    // The low curved mansard, in dark slate, and its brick lantern.
    const m0 = inset(r, 1.4), m1 = inset(r, 2.3), m2 = inset(r, 3.6)
    walls(roof, m0, PT, PT + 2.4, m1)
    walls(roof, m1, PT + 2.4, PT + 3.8, m2)
    const lt = inset(r, 4.4)
    walls(brick, lt, PT + 3.8, PT + 5.0)
    walls(white, lt, PT + 5.0, PT + 5.3, inset(r, 4.2))
    cap(roof, inset(r, 4.2), PT + 5.3)
    cap(roof, m2, PT + 3.8)
  }
  pavilion(9.5, Y1, 22.4, 41.6, [1, 2])
  pavilion(-22.0, Y1, -9.6, 41.1, [3, 2])
  pavilion(9.1, -41.0, 22.5, Y0, [1, 0])
  pavilion(-22.0, -41.0, -9.3, Y0, [3, 0])

  // ---------------------------------------------- the end links and porches
  for (const [y0, y1, s] of [[Y1, 40.2, 1], [-39.9, Y0, -1]] as [number, number, number][]) {
    const r = rect(-9.6, y0, 9.5, y1)
    walls(brick, r, 0, WT - 1.2)
    walls(white, r, WT - 1.2, WT)
    balustrade(inset(r, -0.3), WT, WT + 1.2)
    cap(roof, inset(r, 0.3), WT)
    const yf = s > 0 ? y1 : y0
    const [a, b]: XY[] = s > 0 ? [[9.5, yf], [-9.6, yf]] : [[-9.6, yf], [9.5, yf]]
    facade(a, b, [-7.2, -3.6, 3.6, 7.2].map(c => 9.55 + c), 3.6, WT)
    // Porch, x -4..4, to y +-44.
    const pr = s > 0 ? rect(-4, yf, 4, 44) : rect(-4, -43.5, 4, yf)
    walls(white, pr, 0, 7.5)
    cap(white, pr, 7.5)
    walls(white, inset(pr, -0.25), 7.5, 8.3)
    cap(roof, inset(pr, -0.25), 8.3)
    const pf: [XY, XY] = s > 0 ? [[4, 44], [-4, 44]] : [[-4, -43.5], [4, -43.5]]
    rectOn(door, pf[0], pf[1], 4, 1.2, 1.2, 4.6, 0.06)
    rectOn(win, pf[0], pf[1], 1.6, 0.5, 2.4, 5.0, 0.06)
    rectOn(win, pf[0], pf[1], 6.4, 0.5, 2.4, 5.0, 0.06)
  }

  return [
    { part: brick, material: finish('cpt-parliament-brick', 0xbd6a55) },
    { part: white, material: { ...PALETTE.trim, color: 0xf6f3ee, floodlight: flood } },
    { part: roof, material: { ...PALETTE.roof, color: 0x8e979e } },
    { part: win, material: PALETTE.window },
    { part: door, material: { ...PALETTE.entrance, color: 0x9a5a48 } },
  ]
}

if (import.meta.main) await save('cpt-parliament', 'Houses of Parliament', [-33.9257997, 18.4197251], 41.6, build() as any, 6500)
