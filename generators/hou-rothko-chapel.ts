/**
 * Rothko Chapel (3900 Yupon Street, Houston, 1971; Philip Johnson, Howard
 * Barnstone and Eugene Aubry) with Barnett Newman's Broken Obelisk in its
 * reflecting pool — original procedural geometry, CC0-1.0.
 * bun generators/hou-rothko-chapel.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Bearing 359.3 (the OSM outline's axes are turned 0.7 deg
 * anticlockwise of north). Anchor = centroid of the OSM outline
 * way/87657067 ("Rothko Chapel", wikidata Q2956755), 29.7376093,
 * -95.3962022. The Broken Obelisk (OSM way/1393576367, wikidata
 * Q134777828, a 2.9 m square) stands 52 m due south of it in the pool, at
 * (0.4, -52.1) in this frame, and is part of this model. The pool water and
 * the paving are the map's and are not modelled.
 *
 * Identity, in order: a windowless, flat-topped box of pinkish grey-tan
 * brick on an octagonal plan, its four cardinal sides pushed out as shallow
 * square bays (the south one deeper: the entrance vestibule) joined by
 * diagonal walls, so from every side it reads as a cluster of plain
 * brick planes of one height; the black flat canopy and black doors of the
 * south entrance; the low skylight in the middle of a white roof; and, in
 * front, the rust-brown Cor-ten Broken Obelisk: an inverted, broken-off
 * obelisk balanced point to point on a pyramid.
 *
 * Evidence:
 *  - plan: OSM way/87657067 (16 corners), confirmed by USGS 3DEP lidar
 *    TX_Coastal_B1_2018 (flown 2018; 0.5 m grid, read in this frame), which
 *    puts every face within ~0.5 m of OSM. Drawn symmetric in x: the bays
 *    x +-4.8 (N, S), x +-7.8..+-10.35 (E, W, y -3.95..5.4); north face
 *    y 11.0, north bay root y 8.35; south face y -11.75, its root y -7.0.
 *  - heights (lidar, above the paving, which is 0.4 m over the grid minimum):
 *    parapet 8.2 m all round (every face the same height; the photos'
 *    apparent step between the vestibule and the walls behind it is
 *    perspective), roof deck 7.8 m, skylight curb ~8.7 m and top 9.0 m,
 *    a raised square about 6.5 m across in the middle (lidar 2018, and a
 *    pale grey-blue square in NAIP). The skylight was rebuilt in the
 *    2019-20 restoration; the 2018 flight shows the old one, and its
 *    outside form is estimated from it.
 *  - entrance (scaled from David Van Horn's south photo, 26.8 px/m on the
 *    9.6 m vestibule face): door opening 2.9 m wide, 2.8 m tall; black
 *    canopy 5.4 m wide, 0.45 m deep band, top at 3.2 m, projecting 1.5 m
 *    (lidar shows a 3.1 m deck to y -13.3).
 *  - north door: a tall narrow black door near the east end of the north
 *    bay (Jacklee 20130915-02), ~1.3 x 3.6 m (photo-scaled from the
 *    brick coursing; estimated).
 *  - Broken Obelisk: published: Cor-ten steel, 749.9 x 318.8 x 318.8 cm
 *    (MoMA's cast of the same edition, moma.org/collection/works/81555);
 *    the Rothko Chapel gives 26 ft with its base plate. Split from Jim
 *    Evans' and Ed Uthman's photos: steel base plate 3.45 m square, 0.2 m;
 *    pyramid 3.19 m square, 2.5 m tall; inverted pyramidion 0.8 m;
 *    shaft 0.95 m square at the point widening to 1.05 m at the broken top,
 *    4.2 m long (both photos put the obelisk at about twice the pyramid's
 *    height and its width at a third of the pyramid's base); the top torn
 *    off unevenly, ~0.35 m higher at one corner (the north-west in Evans'
 *    photo). Total 7.7 m. Square with the pool.
 *  - colours, sampled from several photos: brick #b8a9a0 (Van Horn,
 *    sun), #baa08d (Jacklee, sun), #a69ea3 (Vinz, overcast), #c5c3bc
 *    (Another Believer, bright) -> drawn #d4beb0, a pinkish grey-tan at
 *    the palette's lightness; Cor-ten #9f7c6d (sun), #947875, #725d55
 *    (shade) -> drawn #8f6452 so it reads as rusted steel; canopy and doors
 *    black -> charcoal #4a4f57; roof white in NAIP -> #d9dbd8.
 *
 * Photos (all evidence, Wikimedia Commons):
 *  - "Rothko Chapel - 1 August 2010.jpg", David Van Horn, CC BY 2.0 (south)
 *    https://commons.wikimedia.org/wiki/File:Rothko_Chapel_-_1_August_2010.jpg
 *  - "Rothko Chapel, Menil Collection, Houston, Texas - 20130915-01/-02/-04/-05.JPG",
 *    Jacklee, CC BY-SA 3.0 (-04 public domain) (corners, the pool, the south front)
 *    https://commons.wikimedia.org/wiki/File:Rothko_Chapel,_Menil_Collection,_Houston,_Texas_-_20130915-02.JPG
 *  - "Broken Obelisk in front of the Rothko Chapel -- Houston, Texas.jpg",
 *    Jim Evans, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Broken_Obelisk_in_front_of_the_Rothko_Chapel_--_Houston,_Texas.jpg
 *  - "Barnett Newman Broken Obelisk Rothko Chapel (HDR).jpg", Ed Uthman,
 *    CC BY 3.0 https://commons.wikimedia.org/wiki/File:Barnett_Newman_Broken_Obelisk_Rothko_Chapel_(HDR).jpg
 *  - "Rothko Chapel.jpg", "Rothko Chapel A.jpg", "Rothko Chapel B.jpg",
 *    WhisperToMe, CC0 (from the streets, north-east and east)
 *    https://commons.wikimedia.org/wiki/File:Rothko_Chapel.jpg
 *  - "Rothko Chapel 2010-04-18.jpg", charlie vinz, CC BY-SA 2.0 (south);
 *    "Rothko Chapel, Houston in 2012.JPG", Another Believer, CC BY-SA 3.0
 *    (south); "Rothko Chapel (8088569886).jpg", Aleksandr Zykov,
 *    CC BY-SA 2.0 (obelisk and chapel from the south)
 *    https://commons.wikimedia.org/wiki/File:Rothko_Chapel_2010-04-18.jpg
 *    https://commons.wikimedia.org/wiki/File:Rothko_Chapel,_Houston_in_2012.JPG
 *    https://commons.wikimedia.org/wiki/File:Rothko_Chapel_(8088569886).jpg
 *  USGS NAIP for the plan, roof colour and the pool. Mapterhorn terrain:
 *  flat (0.4-0.6 m over the whole site). No commercial imagery.
 *  Look-only: none.
 *
 * Left out: the brick coursing, the two lamp arms on the south parapet and
 * one on the north-west, the sign, the pool and its water, the bamboo.
 *
 * Doubts: the new (2020) skylight's outside form; the north door's exact
 * place (only one photo shows it clearly); whether the other doors on the
 * east and west sides exist (no photo shows them; left plain).
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { cap, inset, save, type XY } from './chi-aon-center'

/** Split a wall a→b (outward on the right of a CCW ring) into ≤ max m quads. */
function wallSeg(p: Part, a: XY, b: XY, z0: number, z1: number, max = 5) {
  const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / max))
  for (let k = 0; k < n; k++) {
    const t0 = k / n, t1 = (k + 1) / n
    const A: XY = [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0]
    const B: XY = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1]
    p.quad([A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1])
  }
}
function ringWalls(p: Part, r: XY[], z0: number, z1: number, max = 5) {
  r.forEach((a, i) => wallSeg(p, a, r[(i + 1) % r.length], z0, z1, max))
}
/** A box (all six faces) from x0..x1, y0..y1, z0..z1. */
function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, bottom = true) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  ringWalls(p, r, z0, z1, 100)
  cap(p, r, z1)
  if (bottom) cap(p, r, z0, false)
}
/** A frustum between two square rings (half sizes h0 at z0, h1 at z1) about (cx, cy). */
function frustum(p: Part, cx: number, cy: number, h0: number, z0: number, h1: number, z1: number) {
  const sq = (h: number, z: number): V3[] => [[cx - h, cy - h, z], [cx + h, cy - h, z], [cx + h, cy + h, z], [cx - h, cy + h, z]]
  const a = sq(h0, z0), b = sq(h1, z1)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    if (h1 < 1e-6) p.tri(a[i], a[j], b[i])
    else if (h0 < 1e-6) p.tri(a[i], b[j], b[i])
    else p.quad(a[i], a[j], b[j], b[i])
  }
}

// ---------------------------------------------------------------------------

const PARAPET = 8.2, DECK = 7.8

// The plan, counter-clockwise from the vestibule's south-west corner.
const BX = 4.8, EX0 = 7.8, EX1 = 10.35, EY0 = -3.95, EY1 = 5.4
const NY0 = 8.35, NY1 = 11.0, SY0 = -7.0, SY1 = -11.75
const PLAN: XY[] = [
  [-BX, SY1], [BX, SY1], [BX, SY0], [EX0, EY0], [EX1, EY0], [EX1, EY1], [EX0, EY1], [BX, NY0],
  [BX, NY1], [-BX, NY1], [-BX, NY0], [-EX0, EY1], [-EX1, EY1], [-EX1, EY0], [-EX0, EY0], [-BX, SY0],
]

// The Broken Obelisk's centre.
const OB: XY = [0.4, -52.1]

/** `only`: draw just the chapel or just the obelisk (for photo comparisons). */
function build(only = process.env.ROTHKO_ONLY) {
  const brick = new Part(), roof = new Part(), black = new Part(), steel = new Part(), sky = new Part()

  // Walls with a small bevel at the parapet's top edge, then the coping and
  // the roof deck sunk behind it.
  const BEV = 0.3, LIP = 0.35
  const top = inset(PLAN, BEV)
  ringWalls(brick, PLAN, 0, PARAPET - BEV)
  PLAN.forEach((a, i) => {
    const j = (i + 1) % PLAN.length, b = PLAN[j]
    brick.quad([a[0], a[1], PARAPET - BEV], [b[0], b[1], PARAPET - BEV], [top[j][0], top[j][1], PARAPET], [top[i][0], top[i][1], PARAPET])
  })
  // coping (brick) from the bevel to the inner lip, then the inner face down to the deck
  const inner = inset(PLAN, LIP)
  PLAN.forEach((_, i) => {
    const j = (i + 1) % PLAN.length
    brick.quad([top[i][0], top[i][1], PARAPET], [top[j][0], top[j][1], PARAPET], [inner[j][0], inner[j][1], PARAPET], [inner[i][0], inner[i][1], PARAPET])
    brick.quad([inner[j][0], inner[j][1], PARAPET], [inner[i][0], inner[i][1], PARAPET], [inner[i][0], inner[i][1], DECK], [inner[j][0], inner[j][1], DECK])
  })
  cap(roof, inner, DECK)

  // Skylight: a square curb in the middle of the roof with a low glass hip.
  const SC: XY = [0, 0.4], SH = 3.25, CURB = 8.7, SKY = 9.0
  const curb: XY[] = [[SC[0] - SH, SC[1] - SH], [SC[0] + SH, SC[1] - SH], [SC[0] + SH, SC[1] + SH], [SC[0] - SH, SC[1] + SH]]
  ringWalls(roof, curb, DECK, CURB, 100)
  const sq = (h: number, z: number): V3[] => [[SC[0] - h, SC[1] - h, z], [SC[0] + h, SC[1] - h, z], [SC[0] + h, SC[1] + h, z], [SC[0] - h, SC[1] + h, z]]
  const c0 = sq(SH, CURB), c1 = sq(SH - 0.25, CURB), g = sq(SH - 1.4, SKY)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    roof.quad(c0[i], c0[j], c1[j], c1[i])
    sky.quad(c1[i], c1[j], g[j], g[i])
  }
  sky.quad(g[0], g[1], g[2], g[3])

  // South entrance: black doors in the vestibule face and the flat canopy.
  const OUT = 0.05
  black.quad([-1.45, SY1 - OUT, 0], [1.45, SY1 - OUT, 0], [1.45, SY1 - OUT, 2.8], [-1.45, SY1 - OUT, 2.8])
  box(black, -2.7, SY1 - 1.5, 2.75, 2.7, SY1, 3.2)
  // North door: tall and narrow, near the east end of the north bay.
  black.quad([3.6, NY1 + OUT, 0], [2.3, NY1 + OUT, 0], [2.3, NY1 + OUT, 3.6], [3.6, NY1 + OUT, 3.6])

  if (only === 'obelisk') for (const p of [brick, roof, black, sky]) { p.pos = []; p.nrm = []; p.uv = [] }
  if (only === 'chapel') return mats()

  // ---- Broken Obelisk -------------------------------------------------
  const [ox, oy] = OB
  box(steel, ox - 1.725, oy - 1.725, 0, ox + 1.725, oy + 1.725, 0.2, false)
  const PB = 0.2, PT = PB + 2.5 // pyramid base and apex
  frustum(steel, ox, oy, 1.595, PB, 0, PT)
  // inverted pyramidion, point down on the apex
  const SB = PT + 0.8
  frustum(steel, ox, oy, 0, PT, 0.475, SB)
  // shaft widening to the broken top; the tear slopes down from the NW corner
  const h0 = 0.475, h1 = 0.525
  const TOP = SB + 4.2
  const tops = [TOP - 0.25, TOP - 0.15, TOP, TOP + 0.1] // SW, SE, NE, NW corners
  const b0: V3[] = [[ox - h0, oy - h0, SB], [ox + h0, oy - h0, SB], [ox + h0, oy + h0, SB], [ox - h0, oy + h0, SB]]
  const b1: V3[] = [[ox - h1, oy - h1, tops[0]], [ox + h1, oy - h1, tops[1]], [ox + h1, oy + h1, tops[2]], [ox - h1, oy + h1, tops[3]]]
  // ragged midpoints on each top edge (the torn steel)
  const rag = [0.12, -0.1, 0.14, -0.12]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const m: V3 = [(b1[i][0] + b1[j][0]) / 2, (b1[i][1] + b1[j][1]) / 2, (b1[i][2] + b1[j][2]) / 2 + rag[i]]
    const mb: V3 = [(b0[i][0] + b0[j][0]) / 2, (b0[i][1] + b0[j][1]) / 2, SB]
    steel.quad(b0[i], mb, m, b1[i])
    steel.quad(mb, b0[j], b1[j], m)
  }
  // the torn top surface: a fan from the centre
  const ctr: V3 = [ox, oy, (tops[0] + tops[1] + tops[2] + tops[3]) / 4]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const m: V3 = [(b1[i][0] + b1[j][0]) / 2, (b1[i][1] + b1[j][1]) / 2, (b1[i][2] + b1[j][2]) / 2 + rag[i]]
    steel.tri(ctr, b1[i], m)
    steel.tri(ctr, m, b1[j])
  }

  return mats()

  function mats() {
  return [
    { part: brick, material: finish('rothko-brick', 0xd4beb0) },
    { part: roof, material: finish('rothko-roof', 0xd9dbd8) },
    { part: black, material: finish('rothko-black', 0x4a4f57) },
    { part: steel, material: finish('rothko-corten', 0x8f6452) },
    { part: sky, material: { name: 'glass', color: 0xa4c4d9, roughness: 0.24 } },
  ]
  }
}

if (import.meta.main) await save('hou-rothko-chapel', 'Rothko Chapel', [29.7376093, -95.3962022], 359.3, build())
