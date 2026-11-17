/**
 * Mercantile National Bank Building ("The Merc"), 1800 Main Street, Dallas,
 * 1943 (Walter W. Ahlschlager), with its 1958 clock and weather spire —
 * original procedural geometry, CC0-1.0.
 * bun generators/dal-mercantile-national-bank.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/30897787 ("The Merc",
 * 1800 Main Street, wikidata Q6818031), -96.796635, 32.780798. Its walls
 * run at 346° / 76°, so the catalog bearing is 346: +y is Main Street's
 * side (north), -y Commerce Street, -x Ervay Street.
 *
 * Note: the brief pointed at way/30897736, "Mercantile Commerce Building"
 * across Commerce Street. That is the former Vaughn Tower the bank bought
 * in 1976 (Wikipedia), not the 1943 tower with the clock and spire; this
 * model is the 1943 tower and replaces its own outline and parts.
 *
 * Identity, in order: the clock and weather spire — a square clock box with
 * red hands on all four faces, carrying a tapering spire with a green
 * starburst and a ringed mast; the pale Moderne limestone slab stepping in
 * from broad lower wings to the shaft, then to a ribbon-windowed penthouse
 * under the clock; tall vertical window bays with dark spandrels.
 * At night the hands are red neon and the starburst green neon; the clock
 * box and spire are floodlit.
 *
 * Evidence:
 *  - plan: OSM outline way/30897787 and its parts: way/1396179855 (the
 *    shaft, x -20.5..-1.3, y -14.4..14.8, with a 6 m bay out to x 4.5 on
 *    its east face), way/1396179854 and way/1396179856 (the wings north and
 *    south of it), way/1396179853 (the strip on Ervay). The east third of
 *    the outline is low buildings and an open plaza (lidar).
 *  - USGS 3DEP lidar TX_Pecos_Dallas_B3_2018 (2018; no returns above ~52 m
 *    over downtown), measured above the local ground: the north and south
 *    wings ~49.5 m (flat returns at the ceiling; read as their roof), the
 *    Ervay strip and the strip east of the shaft 28 m with 16.5 m ends, the
 *    low block north-east ~11 m, south-east ~8 m; the shaft returns nothing
 *    (taller). OSM's part heights (25, 50, 95) are coarser and lower.
 *  - heights: published 31 storeys; 545 ft (166 m) to the spire's tip
 *    including the 115 ft (35 m) clock tower (Wikipedia), so the clock box
 *    stands on ~131 m. The shaft's roof at 105 m and the penthouse tiers
 *    (to 109 and 118, the clock box to 130) are estimates from storey counts
 *    on Alex Liivet's and the public-domain aerial photo (~3.75 m a
 *    storey: 13 storeys of wing, 15 of shaft, 3 of penthouse).
 *  - clock and spire, proportioned from Liivet's photo and SDC's night
 *    photo: box ~11 m square and 12 m tall; spire 20 m tapering to the
 *    starburst, then a ringed mast to 166 m (estimates).
 *  - colour: pale buff limestone, grey-blue window bays with dark
 *    spandrels, red hands, green starburst (daylight photos; Liivet's shows
 *    the starburst green by day).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Mercantile-Bank-Building-Dallas.jpg, Alex Liivet, CC BY 2.0
 *  - Mercantile_Bank_Building.jpg, FoUTASportscaster, public domain
 *  - MercantileNationalBankBuilding.jpg, austrini, CC BY 2.0 (1943 view)
 *  - Dallas_The_Merc.jpg, Luis Tamayo, CC BY-SA 2.0
 *  - Merc_clock_tower,_Dallas.jpg, SDC, CC BY-SA 4.0 (night)
 *  - Main_Street_Garden_park_in_Dallas_at_dusk.png, IcedCowboyCoffee, CC0 (dusk)
 * USGS 3DEP lidar, USGS NAIP. No commercial imagery.
 *
 * Doubts: the shaft's and penthouse's heights (no lidar, from storey
 * counts); the penthouse's plan; the low blocks in the east of the outline
 * are drawn as plain boxes; the far (west and south) faces are assumed to
 * match the photographed ones.
 *
 * Left out: the 1960s curtain wall at the base, mullions, railings, the
 * clock's minute ticks (hour marks only), the mast's guy wires.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, rect, save, walls, type XY } from './chi-aon-center'
import { bands, bar, bayRow, box, course, pyramid, quadOut } from './dal-magnolia-hotel'

function build() {
  const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), red = new Part(), green = new Part()

  // Plan.
  const SW = -20.4, SE = -1.4, PE = 4.5 // shaft west / east faces, east bay
  const TS = -14.4, TN = 14.8, PS = -8.6, PN = 9.1
  const WING = 49.5, SHAFT = 105, P1 = 109, P2 = 118, CLK = 130

  const block = (r: XY[], h: number, lip = 0.6) => {
    walls(stone, r, 0, h - lip)
    course(trim, r, h - lip, h, 0.2)
    cap(roof, r, h)
  }
  // Wings north and south of the shaft, and the strips along Ervay and east.
  block(rect(SW, TN, SE, 30.2), WING)
  block(rect(SW, -32.6, SE, TS), WING)
  block(rect(-28.3, -20, SW, 20), 28)
  block(rect(-28.3, -32.8, SW, -20), 16.5)
  block(rect(-28.3, 20, SW, 30.1), 16.5)
  block(rect(SE, -20, 7.5, PS), 28)
  block(rect(SE, PN, 7.5, 20), 28)
  block(rect(SE, -32.5, 7.5, -20), 16.5)
  block(rect(SE, 20, 7.5, 30.2), 16.5)
  block(rect(PE, PS, 7.5, PN), 28)
  // Low buildings in the east of the outline.
  block(rect(7.5, 1.1, 29.8, 30.5), 11, 0.4)
  block(rect(7.5, -30.4, 22.8, -15.2), 8, 0.4)

  // The shaft with its east bay.
  const shaft: XY[] = [[SW, TS], [SE, TS], [SE, PS], [PE, PS], [PE, PN], [SE, PN], [SE, TN], [SW, TN]]
  walls(stone, shaft, 0, SHAFT - 0.6)
  course(trim, shaft, SHAFT - 0.6, SHAFT, 0.2)
  cap(roof, shaft, SHAFT)

  // Penthouse tiers, centred on the shaft.
  const cx = (SW + PE) / 2, cy = (TS + TN) / 2
  const tier = (hx: number, hy: number, z0: number, z1: number) => {
    const r = rect(cx - hx, cy - hy, cx + hx, cy + hy)
    walls(stone, r, z0, z1 - 0.5)
    course(trim, r, z1 - 0.5, z1, 0.15)
    cap(roof, r, z1)
    return r
  }
  tier(10.5, 12.5, SHAFT, P1)
  tier(8.5, 9.5, P1, P2)
  // Ribbon windows on the upper penthouse, two bands.
  for (const [z0, z1] of [[P1 + 1.2, P1 + 3.6], [P1 + 5.0, P1 + 7.4]]) {
    const r = rect(cx - 8.5, cy - 9.5, cx + 8.5, cy + 9.5)
    for (let i = 0; i < 4; i++) {
      const a = r[i], b = r[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      bayRow(win, a, b, 1, [[z0, z1]], { end: 1.5, fill: 1, from: 0, to: L })
    }
  }

  // The clock box: square, pale, a clock on each face.
  const H = 5.5
  walls(stone, rect(cx - H, cy - H, cx + H, cy + H), P2, CLK - 0.6)
  course(trim, rect(cx - H, cy - H, cx + H, cy + H), CLK - 0.6, CLK, 0.15)
  cap(roof, rect(cx - H, cy - H, cx + H, cy + H), CLK)
  const zc = (P2 + CLK) / 2 + 0.6
  const faces: [XY, XY][] = [[[cx - H, cy - H], [cx + H, cy - H]], [[cx + H, cy - H], [cx + H, cy + H]], [[cx + H, cy + H], [cx - H, cy + H]], [[cx - H, cy + H], [cx - H, cy - H]]]
  for (const [a, b] of faces) {
    const L = 2 * H, u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const P = (s: number, z: number, o: number): V3 => [a[0] + u[0] * (H + s) + n[0] * o, a[1] + u[1] * (H + s) + n[1] * o, zc + z]
    const R = 4.1
    // hour marks: twelve dark blocks, the quarters larger
    for (let k = 0; k < 12; k++) {
      const t = (k * Math.PI) / 6, w = k % 3 === 0 ? 0.42 : 0.3, l = k % 3 === 0 ? 1.0 : 0.7
      const c0 = R - l, c1 = R
      const d: [number, number] = [Math.sin(t), Math.cos(t)], q: [number, number] = [d[1], -d[0]]
      const pts = [[c0, -w], [c1, -w], [c1, w], [c0, w]].map(([r, s]) => P(d[0] * r + q[0] * s, d[1] * r + q[1] * s, 0.06))
      quadOut(win, pts[0], pts[1], pts[2], pts[3], P(0, 0, -1))
    }
    // hands at ten past ten, as broad red bars standing proud
    const hand = (ang: number, len: number, w: number) => {
      const d: [number, number] = [Math.sin(ang), Math.cos(ang)], q: [number, number] = [d[1], -d[0]]
      const ring = [[-0.4, -w], [len, -w * 0.6], [len, w * 0.6], [-0.4, w]]
      const f = ring.map(([r, s]) => P(d[0] * r + q[0] * s, d[1] * r + q[1] * s, 0.18))
      const bk = ring.map(([r, s]) => P(d[0] * r + q[0] * s, d[1] * r + q[1] * s, 0.0))
      const o = P(0, 0, -1)
      quadOut(red, f[0], f[1], f[2], f[3], o)
      for (let i = 0; i < 4; i++) quadOut(red, bk[i], bk[(i + 1) % 4], f[(i + 1) % 4], f[i], P(0, 0, 0.09))
    }
    hand((-60 * Math.PI) / 180, 2.6, 0.38)
    hand((60 * Math.PI) / 180, 3.6, 0.3)
  }

  // The spire: a tapering pale shaft of four fins round a core, then the
  // green starburst, then the ringed mast.
  const SP0 = CLK, SP1 = 150, MAST = 166
  {
    const r0 = 1.9, r1 = 0.55
    const sq = (r: number, z: number): V3[] => [[cx - r, cy - r, z], [cx + r, cy - r, z], [cx + r, cy + r, z], [cx - r, cy + r, z]]
    box(trim, null, cx - 3.0, cy - 3.0, cx + 3.0, cy + 3.0, SP0, SP0 + 1.2)
    stone.loft([sq(r0, SP0 + 1.2), sq(r1, SP1)])
    // fins on the diagonals, giving the spire its fluted look
    for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
      const a: V3 = [cx + sx * (r0 + 0.5), cy + sy * (r0 + 0.5), SP0 + 1.2], b: V3 = [cx + sx * r1, cy + sy * r1, SP1 - 1]
      bar(stone, a, b, 0.55)
    }
    // starburst: eight green blades round the top of the spire
    for (let k = 0; k < 8; k++) {
      const t = (k * Math.PI) / 4 + Math.PI / 8, len = 2.3
      const tip: V3 = [cx + Math.cos(t) * len, cy + Math.sin(t) * len, SP1 + 0.4]
      const root: V3 = [cx + Math.cos(t) * 0.5, cy + Math.sin(t) * 0.5, SP1 - 0.6]
      bar(green, root, tip, 0.6)
      bar(green, [root[0], root[1], SP1 + 0.8], [tip[0], tip[1], SP1 + 1.4], 0.5)
    }
    box(green, green, cx - 0.9, cy - 0.9, cx + 0.9, cy + 0.9, SP1 - 1.2, SP1 + 1.6)
    // mast with rings
    box(trim, null, cx - 0.45, cy - 0.45, cx + 0.45, cy + 0.45, SP1 + 1.6, MAST - 0.8)
    for (let z = SP1 + 2.6; z < MAST - 1.5; z += 1.6) box(trim, trim, cx - 0.8, cy - 0.8, cx + 0.8, cy + 0.8, z, z + 0.55)
    pyramid(trim, cx - 0.45, cy - 0.45, cx + 0.45, cy + 0.45, MAST - 0.8, MAST)
  }

  // Windows: tall bays of three storeys with dark spandrels between (the
  // Moderne verticals), wide pale piers.
  const shaftRows = bands(WING + 0.5, SHAFT - 1.5, 5, 2.2)
  const wingRows = bands(6, WING - 1.5, 4, 2.2)
  const lowRows = (h: number) => bands(5, h - 1.2, Math.max(1, Math.round((h - 5) / 11)), 2.2)
  // shaft: west, north and south full height; east above the strips
  bayRow(win, [SW, TN], [SW, TS], 8, bands(29, SHAFT - 1.5, 7, 2.2), { end: 1.6, fill: 0.42 })
  bayRow(win, [SE, TN], [SW, TN], 6, shaftRows, { end: 1.4, fill: 0.42 })
  bayRow(win, [SW, TS], [SE, TS], 6, shaftRows, { end: 1.4, fill: 0.42 })
  bayRow(win, [PE, PS], [PE, PN], 4, bands(29, SHAFT - 1.5, 7, 2.2), { end: 1.2, fill: 0.42 })
  bayRow(win, [SE, TS], [SE, PS], 2, bands(29, SHAFT - 1.5, 7, 2.2), { end: 0.8, fill: 0.42 })
  bayRow(win, [SE, PN], [SE, TN], 2, bands(29, SHAFT - 1.5, 7, 2.2), { end: 0.8, fill: 0.42 })
  // wings
  bayRow(win, [SE, 30.2], [SW, 30.2], 6, wingRows, { end: 1.4, fill: 0.42 })
  bayRow(win, [SW, -32.6], [SE, -32.6], 6, wingRows, { end: 1.4, fill: 0.42 })
  bayRow(win, [SE, TN], [SE, 30.2], 5, bands(29, WING - 1.5, 2, 2.2), { end: 1.2, fill: 0.42 })
  bayRow(win, [SE, -32.6], [SE, TS], 5, bands(29, WING - 1.5, 2, 2.2), { end: 1.2, fill: 0.42 })
  bayRow(win, [SW, 30.2], [SW, 20], 3, bands(17, WING - 1.5, 3, 2.2), { end: 1.2, fill: 0.42 })
  bayRow(win, [SW, -20], [SW, -32.6], 3, bands(17, WING - 1.5, 3, 2.2), { end: 1.2, fill: 0.42 })
  // strips
  bayRow(win, [-28.3, 20], [-28.3, -20], 10, lowRows(28), { end: 1.4, fill: 0.42 })
  bayRow(win, [-28.3, 30.1], [-28.3, 20], 2, lowRows(16.5), { end: 1.2, fill: 0.42 })
  bayRow(win, [-28.3, -20], [-28.3, -32.8], 3, lowRows(16.5), { end: 1.2, fill: 0.42 })
  bayRow(win, [7.5, PS], [7.5, PN], 4, lowRows(28), { end: 1.2, fill: 0.42 })
  bayRow(win, [7.5, -20], [7.5, PS], 3, lowRows(28), { end: 1.2, fill: 0.42 })
  bayRow(win, [7.5, 30.2], [SE, 30.2], 2, lowRows(16.5), { end: 1.2, fill: 0.42 })
  bayRow(win, [SE, -32.5], [7.5, -32.5], 2, lowRows(16.5), { end: 1.2, fill: 0.42 })
  bayRow(win, [7.5, 1.1], [29.8, 1.1], 5, [[3.5, 8.8]], { end: 1.2, fill: 0.5 })
  bayRow(win, [29.8, 30.5], [7.5, 30.5], 5, [[3.5, 8.8]], { end: 1.2, fill: 0.5 })
  bayRow(win, [22.8, -30.4], [22.8, -15.2], 3, [[3.5, 6.0]], { end: 1.2, fill: 0.5 })

  // Floodlit at night: the clock box and the spire.
  const lit = (p: V3, n: V3) => (p[2] > P2 - 0.5 && p[2] < SP1 ? (n[2] > 0.7 ? 0.3 : 1) : 0)
  return [
    { part: stone, material: { ...finish('merc-limestone', 0xe9dfcb), floodlight: lit } },
    { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: red, material: finish('neon-clock-red', 0xd8343a) },
    { part: green, material: finish('neon-starburst-green', 0x4fae5a) },
  ]
}

if (import.meta.main) await save('dal-mercantile-national-bank', 'Mercantile National Bank Building', [32.780798, -96.796635], 346, build())
