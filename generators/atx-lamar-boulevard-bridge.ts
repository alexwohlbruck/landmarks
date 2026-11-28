/**
 * Lamar Boulevard Bridge, Austin (1942; NRHP 1994) — procedural, CC0-1.0,
 * no textures.
 * bun generators/atx-lamar-boulevard-bridge.ts
 *
 * An open-spandrel concrete arch bridge carrying Lamar Boulevard over Lady
 * Bird Lake and West Cesar Chavez Street. One placement for the whole
 * structure inside OSM's man_made=bridge outline, abutment to abutment: six
 * flat segmental arch spans, each two ribs under the deck's edges, carrying
 * spandrel columns joined under the deck by a row of small arches (the
 * arcade that is the bridge's look); the wall piers with rounded cutwaters;
 * the deck with its fascia cantilevered on corbels, the parapets and the
 * narrow walks (the model's own walkways), the lamp standards, and the
 * short north approach over the bank. Low model: parapets as solid bands.
 * Detail model (z16): parapet posts with open railing between, the corbels
 * under the overhang, cross struts between the ribs.
 *
 * Frame: x across (+x to the ESE, downstream), y along the bridge toward
 * the north end (NNE), z up, metres. Bearing 19.64, the line of the roadway
 * (OSM ways 126586913 and 239372004, straight); anchor -97.7565675,
 * 30.2658527, the outline's centroid. z = 0 is Lady Bird Lake, the map's
 * Mapterhorn water (130.50 m; the lidar's lake 130.53 m, NAVD88). Feet on
 * land run down to the map's terrain vertex by vertex (GROUND, Mapterhorn
 * z15, 5 m in this frame); river piers stand at z = 0.
 *
 * The map owns the roadway between the curbs (x = XC -6 to XC +6); nothing
 * here is a slab at road level there.
 *
 * Roadway built to (lidar, tools/bridge_ele.py measure 126586913 239372004
 * --every 10, USGS_LPC_TX_Central_B1_2017_LAS_2019; heights above 130.50 m):
 * a flat crest, 8.19 m at the south end (y = -106.9), 8.34 m at y = 2.2,
 * 8.17 m at the north end (y = 108.4); walks 0.25 m over the road. `ele` for
 * the three roadway nodes is proposed in landmarks-scratch/osm-ele/
 * atx-lamar-boulevard-bridge.osc and .md (+1.00 m, GEOID18 to EGM96), not
 * uploaded.
 *
 * Ends. South: the first arch springs from the abutment at y = -105.2 at the
 * foot of the south bank; the deck runs on over it to the outline's end,
 * where the road meets its fill. North: the last arch lands on a pier on the
 * bank at y = 95.5; a deck span carries the road on to the abutment where
 * the bank reaches the deck (y = 104), and the deck edges run on to the
 * outline's end over walls footed on the terrain.
 *
 * Replaces: the man_made=bridge outline way/679083604 (OSM maps no piers or
 * buildings under it).
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): the outline way/679083604 (215 x
 *   15.3 m, bridge:structure=arch, Q14710932, NRHP 94000678); the roadway
 *   126586913 and 239372004 (sidewalk=no, foot=no: the walks are for
 *   emergencies).
 * - Lidar (measured; USGS 3DEP USGS_LPC_TX_Central_B1_2017_LAS_2019, flown
 *   2017, 1 m grid): the roadway; the deck 16.5 m wide, curbs 12 m apart,
 *   walks 2-2.5 m, parapets 0.85 m over the walks; lamp heads 9.3 m over the
 *   road at y = -106.5 (both sides), -73 (W), -39.3 (E), -5.5 (W), 28.2 (E),
 *   62 (W) and 95.5 (both): every 33.67 m, which is the pier rhythm (the
 *   lidar cannot see the piers under the deck); the lake at 130.53 m. The
 *   lidar deck sits about 1 m east of OSM; the model centres the deck on
 *   OSM's roadway (XC = 0.25).
 * - Map terrain: Mapterhorn z15 (tools/terrain.ts grid, bearing 19.64, 5 m):
 *   the lake from y = -95 to 60, the north floodplain (Cesar Chavez Street)
 *   to 95, the banks rising beyond.
 * - Published (Wikipedia, "Lamar Boulevard Bridge"; NRHP 94000678): 1942,
 *   open-spandrel reinforced-concrete arch bridge.
 * Photos (evidence):
 * - Larry D. Moore, "Lamar Bridge 2007.jpg", CC BY 4.0 (from the north-west
 *   bank: ribs, arcade, parapet posts, lamps):
 *   https://commons.wikimedia.org/wiki/File:Lamar_Bridge_2007.jpg
 * - Spawnzilla, "Lamar Boulevard Bridge 20160904185436.jpg" and
 *   "...20160904185556.jpg", CC BY-SA 4.0 (from the lake, broadside: six
 *   flat arches, the corbels and arcade under the deck):
 *   https://commons.wikimedia.org/wiki/File:Lamar_Boulevard_Bridge_20160904185436.jpg
 *   https://commons.wikimedia.org/wiki/File:Lamar_Boulevard_Bridge_20160904185556.jpg
 * - Claudia Durand, "Lamar Bridge.jpg", CC BY-SA 3.0 (the ribs, the arcade
 *   and the cantilevered deck, the parapet's open railing):
 *   https://commons.wikimedia.org/wiki/File:Lamar_Bridge.jpg
 * - Larry D. Moore, "Lamar Blvd Bridge Austin Substructure.jpg", CC BY 4.0
 *   (under the deck: two ribs, cross struts, transverse beams):
 *   https://commons.wikimedia.org/wiki/File:Lamar_Blvd_Bridge_Austin_Substructure.jpg
 * - sbmeaper1, "Lamar St Bridge, Austin TX.jpg", CC0 (under the north end):
 *   https://commons.wikimedia.org/wiki/File:Lamar_St_Bridge,_Austin_TX.jpg
 *
 * Numbers
 * - Piers every 33.67 m (lidar lamp rhythm) at y = -106.5 + 33.67 k, 2.5 m
 *   thick; six spans of 31.2 m clear (the span count from the photos).
 * - Ribs: 1.4 m wide at XC +-6.5, 1.0 m deep at the crown, 1.8 m at the
 *   springing; springing 0.8 m over the lake, crown under the deck slab, rise
 *   5.5 m (photo-scaled: rise about a fifth of the span).
 * - Spandrel columns 0.7 x 1.0 m every 3.5 m, arcade arches between them
 *   1.0 m deep at the columns (photo).
 * - Deck: fascia from 0.8 m under the road; parapets 0.85 m (lidar), posts
 *   every 6.9 m (photo); lamps 9.3 m over the road, 3 m arms (lidar).
 * - Colours: buff concrete from the daylight photos, #d3ccbd; undersides
 *   #b5ad9f; walks #cdc8bd; lamps and railing galvanised grey.
 * - Night: the lamp heads (`lamp`); no floodlighting.
 *
 * Doubts
 * - The span count (six) and the pier positions rest on the lamp rhythm and
 *   the photos; the north approach's arrangement is estimated.
 * - Rib depths, the arcade and the cross struts are photo estimates.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { bead, face, footedLoft, groundAt, rod, stations, type GroundGrid } from './bridge-kit'

// ---- The map's terrain, metres above the lake (Mapterhorn z15, 130.50 m) ----
// rows along y from -120 every 5 m, columns across x from -20 every 5 m
const GROUND: GroundGrid = { y0: -120, x0: -20, step: 5, z: [
  [6.3, 6.7, 8.0, 8.2, 8.2, 8.2, 8.2, 7.0, 6.1],
  [6.0, 6.2, 6.8, 7.3, 7.1, 7.2, 7.5, 5.8, 4.9],
  [5.3, 4.6, 4.0, 4.3, 4.2, 4.2, 4.2, 3.2, 2.5],
  [2.8, 2.4, 2.0, 1.4, 1.5, 1.5, 1.2, 1.0, 1.2],
  [0.9, 0.7, 0.7, 0.4, 0.3, 0.3, 0.6, 0.3, 0.0],
  [0.5, 0.2, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  ...Array.from({ length: 31 }, () => Array(9).fill(0)), // y = -90 .. 60: the lake
  [1.3, 1.2, 1.4, 0.8, 0.4, 0.5, 1.2, 1.4, 1.4],
  [1.6, 1.5, 1.5, 1.3, 1.2, 1.1, 1.3, 1.4, 1.4],
  [1.5, 1.5, 1.4, 1.3, 1.3, 1.2, 1.2, 1.3, 1.4],
  [1.6, 1.5, 1.4, 1.3, 1.2, 1.2, 1.2, 1.3, 1.4],
  [1.5, 1.4, 1.3, 1.3, 1.3, 1.3, 1.2, 1.3, 1.4],
  [1.8, 1.8, 1.7, 1.6, 1.6, 1.6, 1.6, 1.7, 1.9],
  [2.6, 2.7, 2.3, 2.3, 2.4, 2.3, 2.2, 2.2, 2.6],
  [3.5, 3.6, 4.1, 4.5, 4.5, 4.5, 4.5, 3.8, 3.6],
  [3.7, 4.8, 7.0, 7.7, 7.3, 7.5, 7.8, 5.9, 4.1],
  [3.8, 5.7, 7.8, 8.2, 8.1, 8.1, 8.3, 7.2, 5.2],
  [3.8, 5.8, 7.9, 8.1, 8.1, 8.1, 8.2, 7.7, 5.9],
  [3.8, 5.8, 7.9, 8.1, 8.1, 8.1, 8.0, 7.9, 6.2],
] }
if (GROUND.z.length !== 49) throw new Error(`GROUND has ${GROUND.z.length} rows`)
// Feet on land go 0.4 m into the terrain: the 5 m grid misses up to that much on the banks' slopes.
const ground = (x: number, y: number) => { const g = groundAt(GROUND, x, y); return g > 0.5 ? g - 0.4 : Math.max(0, g) }

// ---- The roadway (lidar, tools/bridge_ele.py; metres above 130.50 m) ---------
const road = (y: number) => (y < 2.2 ? 8.34 - 0.15 * ((y - 2.2) / 109.1) ** 2 : 8.34 - 0.17 * ((y - 2.2) / 106.2) ** 2)
const walk = (y: number) => road(y) + 0.25

// ---- Plan -----------------------------------------------------------------------
const XC = 0.25 // the deck's centre line, across (on OSM's roadway)
const Y_S = -106.5, Y_N = 107.9 // the outline's ends
const BAY = 33.67, PIER_T = 2.5
const PIERS = [1, 2, 3, 4, 5, 6].map((k) => -106.5 + BAY * k) // the last (95.5) stands on the north bank
const Y_SABUT = -106.5 + PIER_T / 2, Y_NABUT = 104
const HALF = 8.25, CURB = 6.0, PAR = 0.35 // deck half-width, curbs, parapet thickness (lidar)
const RIB_X = 6.5, RIB_W = 1.4
const SPRING = 0.8
const slab = (y: number) => road(y) - 0.8 // the deck's underside
const LAMPS: [number, number][] = [[-1, -106.5 + 1], [1, -106.5 + 1], [-1, PIERS[0]], [1, PIERS[1]], [-1, PIERS[2]], [1, PIERS[3]], [-1, PIERS[4]], [-1, PIERS[5]], [1, PIERS[5]]]

// ---- Materials ------------------------------------------------------------------
const CONCRETE: MaterialSpec = finish('lamar-concrete', 0xd3ccbd)
const SHADE: MaterialSpec = finish('lamar-concrete-shade', 0xb5ad9f)
const WALKMAT: MaterialSpec = finish('concrete-walk', 0xcdc8bd)
const STEEL: MaterialSpec = finish('galvanised-steel', 0xa3a9af)
const LAMP: MaterialSpec = finish('lamp', 0x8d9298)
type Set = { stone: Part; shade: Part; walk: Part; steel: Part; lamp: Part }

const nrm = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
function block(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number | 'ground', z1: number, seg = 30) {
  footedLoft(p, ground, [
    { plan: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z: z0 },
    { plan: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z: z1 },
  ], seg)
}
function wallY(p: Part, x: number, ys: number[], top: (y: number) => number, bot: (y: number) => number, side: number) {
  for (let i = 0; i + 1 < ys.length; i++) {
    const [a, b] = [ys[i], ys[i + 1]]
    if (Math.max(top(a) - bot(a), top(b) - bot(b)) <= 0.01) continue
    face(p, [x, a, bot(a)], [x, b, bot(b)], [x, b, Math.max(top(b), bot(b))], [x, a, Math.max(top(a), bot(a))], [side, 0, 0])
  }
}
function sheet(p: Part, x0: number, x1: number, ys: number[], z: (y: number) => number, up: boolean) {
  for (let i = 0; i + 1 < ys.length; i++) {
    const [a, b] = [ys[i], ys[i + 1]]
    const t = nrm([0, b - a, z(b) - z(a)]), n: V3 = up ? [0, -t[2], t[1]] : [0, t[2], -t[1]]
    face(p, [x0, a, z(a)], [x1, a, z(a)], [x1, b, z(b)], [x0, b, z(b)], n)
  }
}
const sortedYs = (y0: number, y1: number, step: number, br: number[] = []) =>
  [...new Set([...stations(y0, y1, step), ...br.filter((b) => b > y0 && b < y1)])].sort((a, b) => a - b)

// ---- Arch ribs, spandrel columns and the arcade --------------------------------------
type Span = { a: number; b: number }
const SPANS: Span[] = [Y_SABUT, ...PIERS.slice(0, -1).map((y) => y + PIER_T / 2)].map((a, i) => ({ a, b: PIERS[i] - PIER_T / 2 }))
const bankAt = (y: number) => Math.max(...[-RIB_X, 0, RIB_X].map((x) => ground(XC + x, y)))

function arches(s: Set, detail: boolean) {
  for (const sp of SPANS) {
    const c = sp.b - sp.a, m = (sp.a + sp.b) / 2
    const crownTop = slab(m) - 0.05, rise = crownTop - 1.0 - SPRING
    const R = (c * c / 4 + rise * rise) / (2 * rise)
    const intr = (y: number) => SPRING + rise - R + Math.sqrt(Math.max(0, R * R - (y - m) ** 2))
    const extr = (y: number) => Math.min(intr(y) + 1.0 + 0.8 * ((y - m) / (c / 2)) ** 2, slab(y) - 0.05)
    const clear = (y: number) => extr(y) > bankAt(y) + 0.1
    const ys = stations(sp.a, sp.b, c / (detail ? 16 : 10)).filter(clear)
    if (ys.length < 2) continue
    for (const sd of [-1, 1]) {
      const x0 = XC + sd * (RIB_X - RIB_W / 2), x1 = XC + sd * (RIB_X + RIB_W / 2)
      wallY(s.stone, x1, sd > 0 ? ys : [...ys].reverse(), extr, intr, sd)
      wallY(s.shade, x0, sd > 0 ? [...ys].reverse() : ys, extr, intr, -sd)
      sheet(s.shade, Math.min(x0, x1), Math.max(x0, x1), ys, intr, false)
      sheet(s.stone, Math.min(x0, x1), Math.max(x0, x1), ys, extr, true)
    }
    // spandrel columns on the ribs, joined under the deck by small arches (the arcade)
    const cols = stations(sp.a + 1.2, sp.b - 1.2, 3.5).filter((y) => slab(y) - extr(y) > 0.9 && clear(y))
    for (const sd of [-1, 1]) {
      const xo = XC + sd * (RIB_X + 0.5), xi = XC + sd * (RIB_X - 0.5)
      for (const y of cols) block(s.stone, Math.min(xo, xi), Math.max(xo, xi), y - 0.35, y + 0.35, extr(y) - 0.1, slab(y))
      for (let i = 0; i + 1 < cols.length; i++) {
        const [a, b] = [cols[i] + 0.35, cols[i + 1] - 0.35], mid = (a + b) / 2, half = (b - a) / 2
        const arcBot = (y: number) => slab(y) - 1.0 + 0.75 * Math.sqrt(Math.max(0, 1 - ((y - mid) / half) ** 2))
        const ay = stations(a, b, (b - a) / (detail ? 6 : 4))
        wallY(s.stone, xo, sd > 0 ? ay : [...ay].reverse(), slab, arcBot, sd)
        sheet(s.shade, Math.min(xo, xi), Math.max(xo, xi), ay, arcBot, false)
      }
    }
    // cross struts between the ribs (detail)
    if (detail) for (const t of [0.25, 0.5, 0.75]) {
      const y = sp.a + c * t
      if (clear(y)) block(s.shade, XC - RIB_X + RIB_W / 2, XC + RIB_X - RIB_W / 2, y - 0.4, y + 0.4, extr(y) - 0.9, extr(y) - 0.1)
    }
  }
}

// ---- Piers and abutments ---------------------------------------------------------
function piers(s: Set, detail: boolean) {
  const nose = detail ? 8 : 5, r = PIER_T / 2, half = RIB_X + 0.3
  for (const y of PIERS) {
    const plan: [number, number][] = []
    for (let i = 0; i <= nose; i++) { const a = -Math.PI / 2 + (Math.PI * i) / nose; plan.push([XC + half + r * Math.cos(a), y + r * Math.sin(a)]) }
    for (let i = 0; i <= nose; i++) { const a = Math.PI / 2 + (Math.PI * i) / nose; plan.push([XC - half + r * Math.cos(a), y + r * Math.sin(a)]) }
    // the cap stands clear of the bank where the pier is on land (the north pier at 95.5)
    const cap = Math.max(SPRING + 0.9, Math.max(...plan.map(([x, yy]) => groundAt(GROUND, x, yy))) + 0.3)
    footedLoft(s.stone, ground, [{ plan, z: 'ground' }, { plan, z: cap }], 3)
    // over the springing: a pair of columns at the ribs up to the deck
    for (const sd of [-1, 1]) block(s.stone, XC + sd * RIB_X - 0.6, XC + sd * RIB_X + 0.6, y - 0.9, y + 0.9, cap, slab(y))
  }
  // abutments: from the terrain to the deck, between the abutment face and the outline's end
  for (const [y0, y1] of [[Y_S, Y_SABUT], [Y_NABUT, Y_N]]) {
    footedLoft(s.stone, ground, [
      { plan: [[XC - RIB_X - 0.8, y0], [XC + RIB_X + 0.8, y0], [XC + RIB_X + 0.8, y1], [XC - RIB_X - 0.8, y1]], z: 'ground' },
      { plan: [[XC - RIB_X - 0.8, y0], [XC + RIB_X + 0.8, y0], [XC + RIB_X + 0.8, y1], [XC - RIB_X - 0.8, y1]], z: slab((y0 + y1) / 2) },
    ], 2, false)
  }
  // the north approach: a bent of two columns between the last pier and the abutment
  for (const sd of [-1, 1]) block(s.stone, XC + sd * RIB_X - 0.5, XC + sd * RIB_X + 0.5, 99.4, 100.4, 'ground', slab(100))
}

// ---- Deck, walks, parapets, lamps --------------------------------------------------
function deck(s: Set, detail: boolean) {
  const br = [Y_SABUT, Y_NABUT, ...PIERS]
  const all = sortedYs(Y_S, Y_N, detail ? 5 : 10, br)
  const onLand = (y: number) => y < Y_SABUT - 1e-6 || y > Y_NABUT + 1e-6
  for (const sd of [-1, 1]) {
    const o = (l: number[]) => (sd > 0 ? l : [...l].reverse())
    const xe = XC + sd * HALF, xp = XC + sd * (HALF - PAR), xc = XC + sd * CURB
    // fascia from under the deck (or the terrain on land) to the parapet's foot
    wallY(s.stone, xe, o(all), walk, (y) => (onLand(y) ? Math.min(slab(y), ground(xe, y)) : slab(y)), sd)
    // the overhang's underside out from the ribs, and corbels at each column (detail)
    sheet(s.shade, Math.min(XC + sd * (RIB_X + 0.5), xe), Math.max(XC + sd * (RIB_X + 0.5), xe), all.filter((y) => !onLand(y)), slab, false)
    if (detail) for (const sp of SPANS) for (const y of stations(sp.a + 1.2, sp.b - 1.2, 3.5))
      block(s.shade, Math.min(XC + sd * (RIB_X + 0.5), xe - sd * 0.3), Math.max(XC + sd * (RIB_X + 0.5), xe - sd * 0.3), y - 0.3, y + 0.3, slab(y) - 0.6, slab(y))
    // the walk (the model's own) and its curb face
    sheet(s.walk, Math.min(xc, xp), Math.max(xc, xp), all, walk, true)
    wallY(s.walk, xc, o(all).reverse(), walk, (y) => road(y) - 0.05, -sd)
    // parapet: a solid band in the low model; posts, a rail and an open railing in the detail
    const top = (y: number) => walk(y) + 0.85
    if (!detail) {
      wallY(s.stone, xe, o(all), top, walk, sd)
      wallY(s.stone, xp, o(all).reverse(), top, walk, -sd)
      sheet(s.stone, Math.min(xe, xp), Math.max(xe, xp), all, top, true)
    } else {
      for (const [z0, z1] of [[0, 0.2], [0.7, 0.85]] as [number, number][]) {
        wallY(s.stone, xe, o(all), (y) => walk(y) + z1, (y) => walk(y) + z0, sd)
        wallY(s.stone, xp, o(all).reverse(), (y) => walk(y) + z1, (y) => walk(y) + z0, -sd)
        sheet(s.stone, Math.min(xe, xp), Math.max(xe, xp), all, (y) => walk(y) + z1, true)
        if (z0 > 0) sheet(s.shade, Math.min(xe, xp), Math.max(xe, xp), all, (y) => walk(y) + z0, false)
      }
      for (const y of stations(Y_S + 0.4, Y_N - 0.4, 6.9)) block(s.stone, Math.min(xe, xp) - 0.1, Math.max(xe, xp) + 0.1, y - 0.3, y + 0.3, walk(y), walk(y) + 1.05)
      for (const y of stations(Y_S + 0.4, Y_N - 0.4, 0.35)) rod(s.steel, [XC + sd * (HALF - PAR / 2), y, walk(y) + 0.2], [XC + sd * (HALF - PAR / 2), y, walk(y) + 0.7], 0.03, 3)
    }
  }
  // the deck's end faces
  for (const [y, d] of [[Y_S, -1], [Y_N, 1]] as [number, number][]) for (const sd of [-1, 1]) {
    const xa = XC + sd * CURB, xb = XC + sd * HALF
    face(s.stone, [xa, y, Math.min(ground(xb, y), road(y) - 0.3)], [xb, y, Math.min(ground(xb, y), road(y) - 0.3)], [xb, y, walk(y) + 0.85], [xa, y, walk(y) + 0.85], [0, d, 0])
  }
  // lamp standards on the parapets, arms over the road (lidar)
  for (const [sd, y] of LAMPS) {
    const x = XC + sd * (HALF - PAR / 2), zt = road(y) + 9.4, hx = XC + sd * (HALF - 3.2)
    block(s.steel, x - 0.15, x + 0.15, y - 0.15, y + 0.15, walk(y) + 0.85, zt)
    if (detail) rod(s.steel, [x, y, zt - 0.1], [hx, y, zt + 0.2], 0.07, 4)
    else block(s.steel, Math.min(x, hx), Math.max(x, hx), y - 0.1, y + 0.1, zt - 0.2, zt)
    bead(s.lamp, [hx, y, zt - 0.1], detail ? 0.4 : 0.5, !detail)
  }
}

function build(detail: boolean): Set {
  const s: Set = { stone: new Part(), shade: new Part(), walk: new Part(), steel: new Part(), lamp: new Part() }
  arches(s, detail)
  piers(s, detail)
  deck(s, detail)
  return s
}

if (import.meta.main) {
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin on the outline centroid, at the lake',
    bearing: 19.64, elevation: 0, roadway: { south: road(Y_S), crest: road(2.2), north: road(Y_N) },
  }
  for (const [file, detail, maxTris, maxBytes] of [
    ['atx-lamar-boulevard-bridge.glb', false, 6500, 250 * 1024],
    ['atx-lamar-boulevard-bridge.detail.glb', true, 40000, 1536 * 1024],
  ] as const) {
    const s = build(detail)
    const list = [
      { part: s.stone, material: CONCRETE }, { part: s.shade, material: SHADE }, { part: s.walk, material: WALKMAT },
      { part: s.steel, material: STEEL }, { part: s.lamp, material: LAMP },
    ]
    const tris = list.reduce((n, p) => n + p.part.triangles, 0)
    const glb = writeGlb('Lamar Boulevard Bridge', list, extras)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes; ` + list.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
    if (tris > maxTris || glb.length > maxBytes) throw new Error(`${file} over budget`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
  }
  console.log(SPANS.map((s) => `${s.a.toFixed(2)}..${s.b.toFixed(2)}`).join('; '))
}
