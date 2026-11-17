/**
 * The Menil Collection (1533 Sul Ross Street, Houston, 1987; Renzo Piano
 * with Richard Fitzgerald, engineers Arup / Peter Rice) — original
 * procedural geometry, CC0-1.0.
 * bun generators/hou-menil-collection.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Bearing 359.4 (the OSM outline's long sides run at 89.4 deg).
 * Anchor = centroid of the outer ring of OSM relation/21270446 ("Menil
 * Collection", wikidata Q1888308), 29.7372846, -95.3984689. That outline is
 * the roof plate, 130.9 x 51.3 m, with eight inner rings (open courts).
 *
 * Identity, in order: the long, low, flat white roof plane of steel trusses
 * and curved ferro-cement "leaves" (louvres) that runs out past the walls
 * as a deep veranda on thin white steel columns, with a white edge band
 * along the long sides and the leaves' scalloped profiles at the ends;
 * the "Menil gray" painted cypress clapboard walls under it; the second-
 * storey "treasure house", a long plain grey clapboard box with white joint
 * strips and one window per bay, riding on the roof along the south side.
 *
 * Evidence:
 *  - USGS 3DEP lidar TX_Coastal_B1_2018 (flown 2018), 1 m grid, read in this
 *    frame; ground 0.85-0.95 m over the grid minimum (flat; Mapterhorn
 *    agrees). Measured above the ground: top of the roof trusses 7.6 m over
 *    the whole plate; roof edges x -65.5 / +66.3, y +26.2 / -27 (OSM
 *    +-65.45, +-25.65 drawn); treasure house 13.9 m high, x -61.0..62.5,
 *    y -8.5..-22.5 (drawn -22.3 so its south face stands on the ground-
 *    floor wall); plant on its roof (15.7) left out. Open courts confirmed
 *    by ground or tree returns at the centre (x -9..-1, y 6..15), both ends
 *    (x +-49..60, y -9..-3) and along the north (trees, x -37..-12); drawn
 *    from the OSM inner rings, snapped to the leaf rows.
 *  - photo-scaled (WhisperToMe "MenilCollection.JPG", the north entrance
 *    front, columns ~5 m to the leaf lip): leaf lip 5.0 m, edge band
 *    (lip + truss) 5.0-7.6 m; veranda ~3.4 m deep (wall lines x +-62.0,
 *    y +-22.3; estimated from the photos and the treasure house's lidar
 *    edges); column line 0.9 m in from the roof edge.
 *  - columns: 11 bays on the long sides (11.7 m; one leaf "hood" per bay
 *    with a joint at each column, as in Jacklee 20130915-02/-03 and the
 *    north front), 8 bays on the ends (6.2 m, Jacklee 20130915-08 shows
 *    ~4-5 leaf profiles per end bay). Both estimated from perspective.
 *  - leaves: published section 130 x 90 cm, ~300 of them (rpbw.com,
 *    fondazionerenzopiano.org); real pitch ~1.35 m across the building,
 *    drawn at half density (2.7 m) per STYLE so they read without
 *    shimmering: E-W ribs on top, scallops at the ends.
 *  - ground-floor windows: tall narrow windows, one per long-side bay
 *    (rhythm from Jacklee -02/-03; the exact bays are estimated); the
 *    entrance: a recessed glass front at the end of a passage at
 *    x -11.7..-0.9 on the north side (OSM court ring, lidar, NAIP path).
 *  - treasure-house windows: one per bay on the long faces, none on the
 *    ends (Francisco Anzola 5887512203, Jacklee -07, -08).
 *  - colours sampled from several photos: clapboard #5d7985 / #7a919a
 *    (Anzola, sunlit upper storey), #767f79 (Jacklee -15, under the
 *    veranda), #414640 (shade) -> drawn #a3aeac, "Menil gray" at the
 *    palette's lightness; white steel and leaves drawn #eef0ec; glass roof
 *    pale in NAIP -> #cdd8de (kept close to the white ribs so the stripes stay calm at 80 px); treasure-house roof #c4c9ca (NAIP).
 *
 * Photos (all evidence, Wikimedia Commons):
 *  - "MenilCollection.JPG", WhisperToMe, public domain (north entrance)
 *    https://commons.wikimedia.org/wiki/File:MenilCollection.JPG
 *  - "The Menil Collection A.jpg", "Menil Collection B.jpg",
 *    "MenilCollectionA.jpg", WhisperToMe, CC0
 *    https://commons.wikimedia.org/wiki/File:The_Menil_Collection_A.jpg
 *  - "Menil Collection Houston (5887512203).jpg" and "Menil Collection
 *    Building (5887506245).jpg", Francisco Anzola, CC BY 2.0 (south-east,
 *    the treasure house)
 *    https://commons.wikimedia.org/wiki/File:Menil_Collection_Houston_(5887512203).jpg
 *  - "Menil Collection, Houston, Texas - 20130915-01 ... -16.JPG", Jacklee,
 *    CC BY-SA 3.0 (the veranda, leaves, ends and walls)
 *    https://commons.wikimedia.org/wiki/File:Menil_Collection,_Houston,_Texas_-_20130915-08.JPG
 *  - "MenilCollection.jpg", Argos'Dad, CC BY-SA 3.0 (south-east corner)
 *    https://commons.wikimedia.org/wiki/File:MenilCollection.jpg
 *  USGS NAIP for the plan and the roof. Published: rpbw.com/project/the-menil-collection
 *  (leaf section and count). No commercial imagery. Look-only: none.
 *
 * Left out: the truss lattice (drawn as a solid white band), the glass
 * between the leaves (drawn opaque), mullions, sunshades over the upper
 * windows, the rooftop plant, the bungalows and the court trees.
 *
 * Doubts: the column spacing on the long sides (11.7 m, from perspective;
 * it could be half that); the veranda depth (~3.4 m); which ground-floor
 * bays have windows; the courts' exact edges (snapped to the leaf rows).
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { cap, save, type XY } from './chi-aon-center'

function wallSeg(p: Part, a: XY, b: XY, z0: number, z1: number, max = 5) {
  const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / max))
  for (let k = 0; k < n; k++) {
    const t0 = k / n, t1 = (k + 1) / n
    const A: XY = [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0]
    const B: XY = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1]
    p.quad([A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1])
  }
}
/** Axis box with all faces but the bottom. */
function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  r.forEach((a, i) => wallSeg(p, a, r[(i + 1) % 4], z0, z1, 100))
  cap(p, r, z1)
}

// ---------------------------------------------------------------------------

const EX = 65.45, EY = 25.65 // roof edge
const WX = 62.0, WY = 22.3 // ground-floor walls
const CX = 64.55, CY = 24.75 // column lines
const LIP = 5.0, SOFFIT = 5.9, BAND = 6.4, GLASS = 7.2, TOP = 7.6
const TH = { x0: -61.0, x1: 62.5, y0: -22.3, y1: -8.5, z: 13.9 }
const NROW = 19, P = (2 * EY) / NROW // leaf rows, 2.7 m

// Open courts from the OSM inner rings, [x0, x1, y0, y1], snapped to rows below.
const COURTS: [number, number, number, number][] = [
  [-60.4, -49.3, -9.1, -3.5], [49.4, 60.2, -8.0, -2.4],
  [-11.7, -0.9, 6.2, 15.8],
  [-36.7, -25.3, 17.0, 20.6], [-24.0, -12.8, 17.1, 20.7],
  [0.35, 11.2, 17.3, 20.9], [12.6, 23.6, 17.4, 21.0], [24.85, 35.55, 17.5, 21.2],
]
const rowY = (i: number) => -EY + i * P
const snap = (y: number) => Math.round((y + EY) / P)
const courts = COURTS.map(([x0, x1, y0, y1]) => {
  let i0 = snap(y0), i1 = snap(y1)
  if (i1 <= i0) i1 = i0 + 1
  return { x0, x1, i0, i1, y0: rowY(i0), y1: rowY(i1) }
})
const ENTRY = { x0: -11.7, x1: -0.9 } // the north entrance passage

/** x intervals of row i not cut by a court (and, if `th`, by the treasure house). */
function spans(i: number, th: boolean): [number, number][] {
  const cuts = courts.filter(c => i >= c.i0 && i < c.i1).map(c => [c.x0, c.x1] as [number, number])
  const yc = rowY(i) + P / 2
  if (th && yc > TH.y0 && yc < TH.y1) cuts.push([TH.x0, TH.x1])
  cuts.sort((a, b) => a[0] - b[0])
  const out: [number, number][] = []
  let x = -EX
  for (const [a, b] of cuts) { if (a > x) out.push([x, a]); x = Math.max(x, b) }
  if (x < EX) out.push([x, EX])
  return out
}

function build() {
  const clad = new Part(), white = new Part(), glass = new Part(), win = new Part(), roof = new Part(), door = new Part()

  // ---- ground floor walls (with the entrance passage cut into the north wall)
  const north = rowY(courts[2].i1) // the passage's back wall: the court's north edge
  wallSeg(clad, [-WX, -WY], [WX, -WY], 0, SOFFIT)
  wallSeg(clad, [WX, -WY], [WX, WY], 0, SOFFIT)
  wallSeg(clad, [WX, WY], [ENTRY.x1, WY], 0, SOFFIT)
  wallSeg(clad, [ENTRY.x0, WY], [-WX, WY], 0, SOFFIT)
  wallSeg(clad, [-WX, WY], [-WX, -WY], 0, SOFFIT)
  // passage: side walls, glass front, ceiling
  wallSeg(clad, [ENTRY.x1, WY], [ENTRY.x1, north], 0, SOFFIT)
  wallSeg(clad, [ENTRY.x0, north], [ENTRY.x0, WY], 0, SOFFIT)
  wallSeg(door, [ENTRY.x1, north], [ENTRY.x0, north], 0, SOFFIT)
  white.quad([ENTRY.x0, north, SOFFIT], [ENTRY.x0, WY, SOFFIT], [ENTRY.x1, WY, SOFFIT], [ENTRY.x1, north, SOFFIT])
  // white corner boards (small boxes wrapping each corner)
  for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
    const xa = sx * (WX - 0.5), xb = sx * (WX + 0.06), ya = sy * (WY - 0.5), yb = sy * (WY + 0.06)
    box(white, Math.min(xa, xb), Math.min(ya, yb), 0, Math.max(xa, xb), Math.max(ya, yb), SOFFIT)
  }

  // tall ground-floor windows: one per long-side bay, away from the entrance
  const BAYL = (2 * CX) / 11
  for (let k = 0; k < 11; k++) {
    const xc = -CX + (k + 0.5) * BAYL
    if (xc + 0.6 > ENTRY.x0 - 1 && xc - 0.6 < ENTRY.x1 + 1) continue
    const o = 0.05
    win.quad([xc - 0.6, -WY - o, 0.6], [xc + 0.6, -WY - o, 0.6], [xc + 0.6, -WY - o, 4.2], [xc - 0.6, -WY - o, 4.2])
    win.quad([xc + 0.6, WY + o, 0.6], [xc - 0.6, WY + o, 0.6], [xc - 0.6, WY + o, 4.2], [xc + 0.6, WY + o, 4.2])
  }

  // ---- courts: inward walls down to the ground, white rim on top
  for (const c of courts) {
    const r: XY[] = [[c.x0, c.y0], [c.x0, c.y1], [c.x1, c.y1], [c.x1, c.y0]] // clockwise: faces inward
    r.forEach((a, i) => {
      const b = r[(i + 1) % 4]
      wallSeg(clad, a, b, 0, BAND)
      wallSeg(white, a, b, BAND, TOP, 100)
    })
  }

  // ---- roof top: glass between white E-W ribs (one per leaf row)
  const RW = 0.45 // half rib width
  for (let i = 0; i < NROW; i++) {
    const y0 = rowY(i), y1 = y0 + P, yc = y0 + P / 2
    for (const [a, b] of spans(i, true)) {
      glass.quad([a, y0, GLASS], [b, y0, GLASS], [b, yc - RW, GLASS], [a, yc - RW, GLASS])
      glass.quad([a, yc + RW, GLASS], [b, yc + RW, GLASS], [b, y1, GLASS], [a, y1, GLASS])
      white.quad([a, yc - RW, GLASS], [b, yc - RW, GLASS], [b, yc - RW, TOP], [a, yc - RW, TOP])
      white.quad([b, yc + RW, GLASS], [a, yc + RW, GLASS], [a, yc + RW, TOP], [b, yc + RW, TOP])
      white.quad([a, yc - RW, TOP], [b, yc - RW, TOP], [b, yc + RW, TOP], [a, yc + RW, TOP])
      // rib ends where a court or the treasure house cuts the row
      white.quad([b, yc - RW, GLASS], [b, yc + RW, GLASS], [b, yc + RW, TOP], [b, yc - RW, TOP])
      white.quad([a, yc + RW, GLASS], [a, yc - RW, GLASS], [a, yc - RW, TOP], [a, yc + RW, TOP])
    }
  }

  // ---- the edge band on the long sides: truss band and the hood's lip
  for (const s of [-1, 1]) {
    const y = s * EY
    const a: XY = s < 0 ? [-EX, y] : [EX, y], b: XY = s < 0 ? [EX, y] : [-EX, y]
    wallSeg(white, a, b, LIP, TOP, 12)
    // hood underside: from the lip, curving up to the veranda soffit at the wall
    const prof: [number, number][] = [[0, LIP], [0.5, LIP + 0.35], [1.4, LIP + 0.75], [2.3, SOFFIT]]
    for (let k = 0; k < prof.length - 1; k++) {
      const [d0, z0] = prof[k], [d1, z1] = prof[k + 1]
      const ya = y - s * d0, yb = y - s * d1
      // facing down/outward: wind so the normal points down
      if (s > 0) white.quad([-EX, ya, z0], [EX, ya, z0], [EX, yb, z1], [-EX, yb, z1])
      else white.quad([EX, ya, z0], [-EX, ya, z0], [-EX, yb, z1], [EX, yb, z1])
    }
    const yb = y - s * 2.3, yw = s * WY
    if (s > 0) white.quad([-EX, yb, SOFFIT], [EX, yb, SOFFIT], [EX, yw, SOFFIT], [-EX, yw, SOFFIT])
    else white.quad([EX, yb, SOFFIT], [-EX, yb, SOFFIT], [-EX, yw, SOFFIT], [EX, yw, SOFFIT])
  }

  // ---- the ends: each leaf row ends in a scallop; troughs under the end verandas
  const SEG = 6
  const dip = (t: number) => BAND - (BAND - LIP) * Math.sin(Math.PI * t) // 0..1 across a row
  for (const s of [-1, 1]) {
    const x = s * EX, xw = s * WX
    for (let i = 0; i < NROW; i++) {
      const y0 = rowY(i)
      // skip rows hidden behind the long-side hoods (the first and last)
      const ts = Array.from({ length: SEG + 1 }, (_, k) => k / SEG)
      for (let k = 0; k < SEG; k++) {
        const ya = y0 + ts[k] * P, yb = y0 + ts[k + 1] * P
        const za = dip(ts[k]), zb = dip(ts[k + 1])
        // end face: from the scallop edge up to the band top
        if (s > 0) white.quad([x, ya, za], [x, yb, zb], [x, yb, TOP], [x, ya, TOP])
        else white.quad([x, yb, zb], [x, ya, za], [x, ya, TOP], [x, yb, TOP])
        // trough underside, from the end to the wall (facing down)
        if (s > 0) white.quad([xw, ya, za], [x, ya, za], [x, yb, zb], [xw, yb, zb])
        else white.quad([x, ya, za], [xw, ya, za], [xw, yb, zb], [x, yb, zb])
      }
    }
  }

  // ---- columns
  const col = (x: number, y: number) => box(white, x - 0.18, y - 0.18, 0, x + 0.18, y + 0.18, SOFFIT)
  for (let k = 0; k <= 11; k++) { col(-CX + k * BAYL, -CY); col(-CX + k * BAYL, CY) }
  const BAYE = (2 * CY) / 8
  for (let k = 1; k < 8; k++) { col(-CX, -CY + k * BAYE); col(CX, -CY + k * BAYE) }

  // ---- treasure house
  const T = TH, TB = GLASS
  const tr: XY[] = [[T.x0, T.y0], [T.x1, T.y0], [T.x1, T.y1], [T.x0, T.y1]]
  tr.forEach((a, i) => wallSeg(clad, a, tr[(i + 1) % 4], TB, T.z - 0.45, 100))
  // white coping band (slightly proud) and flat roof
  const o = 0.08
  const tro: XY[] = [[T.x0 - o, T.y0 - o], [T.x1 + o, T.y0 - o], [T.x1 + o, T.y1 + o], [T.x0 - o, T.y1 + o]]
  tro.forEach((a, i) => wallSeg(white, a, tro[(i + 1) % 4], T.z - 0.45, T.z, 100))
  cap(roof, tro, T.z)
  // joint strips at each bay and one window per bay on the long faces
  const yS = T.y0 - 0.05, yN = T.y1 + 0.05
  for (let k = 0; k <= 11; k++) {
    const xj = -CX + k * BAYL
    if (xj > T.x0 + 0.5 && xj < T.x1 - 0.5) {
      white.quad([xj - 0.2, yS, TB], [xj + 0.2, yS, TB], [xj + 0.2, yS, T.z - 0.45], [xj - 0.2, yS, T.z - 0.45])
      white.quad([xj + 0.2, yN, TB], [xj - 0.2, yN, TB], [xj - 0.2, yN, T.z - 0.45], [xj + 0.2, yN, T.z - 0.45])
    }
    if (k < 11) {
      const xc = xj + BAYL / 2
      if (xc - 1 < T.x0 || xc + 1 > T.x1) continue
      const z0 = 9.6, z1 = 12.1
      win.quad([xc - 1.0, yS, z0], [xc + 1.0, yS, z0], [xc + 1.0, yS, z1], [xc - 1.0, yS, z1])
      win.quad([xc + 1.0, yN, z0], [xc - 1.0, yN, z0], [xc - 1.0, yN, z1], [xc + 1.0, yN, z1])
    }
  }
  // corner boards on the treasure house
  for (const [x, y] of [[T.x0, T.y0], [T.x1, T.y0], [T.x1, T.y1], [T.x0, T.y1]] as XY[]) {
    box(white, x - 0.25, y - 0.25, TB, x + 0.25, y + 0.25, T.z - 0.45)
  }

  return [
    { part: clad, material: finish('menil-gray', 0xa3aeac) },
    { part: white, material: finish('menil-white', 0xeef0ec) },
    { part: glass, material: { name: 'glass', color: 0xcdd8de, roughness: 0.24 } },
    { part: win, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
    { part: roof, material: finish('menil-roof', 0xc4c9ca) },
    { part: door, material: { name: 'entrance', color: 0x7d929c, roughness: 0.35 } },
  ]
}

if (import.meta.main) await save('hou-menil-collection', 'The Menil Collection', [29.7372846, -95.3984689], 359.4, build(), 6500)
