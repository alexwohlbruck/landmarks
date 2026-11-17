/**
 * Niels Esperson Building (808 Travis Street, 1927, John Eberson), Houston
 * — original procedural geometry, CC0-1.0.
 * bun generators/hou-niels-esperson-building.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/510322923,
 * 29.758898,-95.365085. Its walls run at 34.9° / 124.9° (the downtown
 * grid), so the catalog bearing is 34.9 and the plan is square to the
 * frame: model +x faces south-east (the Travis Street front), +y
 * north-east. The adjoining 1941 Mellie Esperson Building is its own OSM
 * way (way/510322926, 19 levels) south-west of this one and is left out.
 *
 * Identity, in order: the round tempietto on top, a ring of twelve
 * columns round a core drum under a deep entablature, a stepped dome and
 * a lantern; under it two square stages, the upper with engaged columns
 * and corner obelisks on its balustrade, the lower with big arched windows
 * and urns at its corners; the tall cream terracotta slab of paired
 * windows between piers; the grey granite base with giant columns at the
 * Travis entrance. The tempietto and its stages are floodlit at night.
 *
 * Evidence:
 *  - plan: OSM outline way/510322923, read in the turned frame: the main
 *    block x -1.5..18.3, y -30..19.4 (19.8 x 49.4 m) with a 3.2 m recess in
 *    the Travis face (y -9.7..4.8), and a west wing x -29.3..-1.5,
 *    y 1.8..19.2. The 2018 lidar sits ~2.5 m north-east of OSM throughout
 *    (checked at all four slab edges at 0.5 m); the OSM lines are followed
 *    and every lidar position below is shifted back by that much.
 *  - heights (lidar, USGS 3DEP TX_Coastal_B1_2018, flown 2018, 0.5 m grid;
 *    the street is 0.5 m above ground_min, all heights here above the
 *    street): the recess holds a base block to 16.5 m (the entrance with
 *    its giant columns, Eric's photo), the slab roof 75.5 m with a 77 m
 *    parapet, the west wing 62.3 m. Stage A (arched windows) covers x
 *    -1.5..15.1, y -19..13 to 87 m; stage B (columns) x -1.5..15.1, y
 *    -15.5..6.5 to 98.4 m, balustrade to 101 m, the obelisks 105 m; the
 *    tempietto's entablature 115.6 m across ~12.4 m, the dome rings at
 *    117, 118.6 and 120 m, the lantern to 124.8 m. Published 125 m /
 *    410 ft, 32 storeys (Wikipedia); OSM height=124.
 *  - tempietto proportions: from Highsmith's close photo, columns about
 *    three quarters of the ring's diameter tall, entablature a quarter of
 *    the column, dome and lantern about as tall as the columns; matches
 *    the lidar levels above. Twelve columns (seven visible across half).
 *  - urns at stage A's corners and obelisks on stage B's balustrade:
 *    Highsmith, Evb-wiki; urns at lidar 92.8 m on the south corners.
 *  - slab facade: piers grouping pairs of windows (Porter, i_am_jim):
 *    drawn as panels about 2.4 m wide with 2.1 m piers, three storeys a panel.
 *    Stage A: two arched windows on each short face, three on the long
 *    (Highsmith, Evb-wiki; real semicircles). Stage B: three window bays
 *    between two engaged columns on the short faces, four bays and three
 *    columns on the long (Highsmith).
 *  - colours: the terracotta samples #c0a47c in sun (Highsmith), #d7d3c3
 *    and #ded2bd in sun (Porter, i_am_jim), #7f7263 in shade; drawn
 *    #dcc8a3, a warm cream-buff, the columns, cornices and dome a paler
 *    #ecdfc4. The base granite #9d998a at dusk (Eric), drawn #cbc4b4.
 *  - night: the crown above the slab carries `floodlight` (Highsmith's and
 *    Evb-wiki's photos show the floodlight fixtures; the tempietto is
 *    floodlit at night per the lead's notes; no licensed night photo).
 *
 * Ground: Houston is flat (Mapterhorn 0.0-0.6 m over the block);
 * elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Niels_Esperson_building,_Houston,_Texas_LCCN2011630530.tif, Carol M.
 *    Highsmith, public domain
 *    https://commons.wikimedia.org/wiki/File:Niels_Esperson_building,_Houston,_Texas_LCCN2011630530.tif
 *  - EspersonBuildingfromChase.JPG, WhisperToMe, public domain (aerial)
 *    https://commons.wikimedia.org/wiki/File:EspersonBuildingfromChase.JPG
 *  - Neils-Esperson_Building_Houston_Texas.jpg, i_am_jim, 2013, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Neils-Esperson_Building_Houston_Texas.jpg
 *  - Esperson_building,_2008.jpg, Jim Porter, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Esperson_building,_2008.jpg
 *  - Niels_Esperson_Building.jpg, Evb-wiki, CC BY 3.0
 *    https://commons.wikimedia.org/wiki/File:Niels_Esperson_Building.jpg
 *  - Niels_Esperson_Building,_Houston,_Texas.jpg, Patrick Feller, 2009, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Niels_Esperson_Building,_Houston,_Texas.jpg
 *  - Esperson1.jpg, Eric, 2005, CC BY-SA 2.0
 *    https://commons.wikimedia.org/wiki/File:Esperson1.jpg
 *  - Gulf_Building.jpg, ExqBoredinNac, 2009, CC BY-SA 4.0 (crown from afar)
 *    https://commons.wikimedia.org/wiki/File:Gulf_Building.jpg
 * No look-only sources; no commercial imagery.
 *
 * Doubts: the west wing's facade and the slab's west face (no photo);
 * the urns and obelisks are simplified and a little enlarged; the
 * fire escape on stage A, lions, lamps and balusters are left out; the
 * stair penthouse north of the crown is left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, chamfer, lathe, onWall, panel, parapetRoof, rect, rows, save, spire, walls, type XY } from './chi-aon-center'

const terra = new Part(), trim = new Part(), gran = new Part(), win = new Part(), roof = new Part()

const BASE = 16.5, SLAB = 75.5, WING = 62.3, SA = 87, SB = 98.4
const TX = 6.8, TY = -4.5 // the tempietto's axis, centre of the crown stages

type Face = [XY, XY]
const facesOf = (r: XY[]): Face[] => r.map((a, i) => [a, r[(i + 1) % r.length]] as Face)
const lenOf = ([a, b]: Face) => Math.hypot(b[0] - a[0], b[1] - a[1])

/** Panels in bays along a face between s0 and s1 (metres along it). */
function bayPanels(f: Face, s0: number, s1: number, bay: number, gap: number, groups: [number, number][], p = win) {
  const use = s1 - s0, k = Math.max(1, Math.round((use + gap) / (bay + gap))), w = (use - (k - 1) * gap) / k
  for (let q = 0; q < k; q++) for (const [z0, z1] of groups) panel(p, f[0], f[1], s0 + q * (w + gap), s0 + q * (w + gap) + w, z0, z1)
}

/** A flat arched window: rectangle up to zs, a true semicircle on top. */
function arch(f: Face, s0: number, s1: number, z0: number, zs: number) {
  const { P } = onWall(f[0], f[1]), r = (s1 - s0) / 2, c = (s0 + s1) / 2, o = 0.05
  win.quad(P(s0, z0, o), P(s1, z0, o), P(s1, zs, o), P(s0, zs, o))
  const N = 10
  for (let i = 0; i < N; i++) {
    const a0 = (i / N) * Math.PI, a1 = ((i + 1) / N) * Math.PI
    win.tri(P(c, zs, o), P(c + r * Math.cos(a0), zs + r * Math.sin(a0), o), P(c + r * Math.cos(a1), zs + r * Math.sin(a1), o))
  }
}

// --- Base: granite, the recess filled to the base's top.
const block0 = chamfer(rect(-1.5, -30.0, 18.3, 19.4), 0.3)
walls(gran, block0, 0, BASE - 1.0)
walls(trim, block0, BASE - 1.0, BASE)
const wing = chamfer(rect(-29.3, 1.8, -1.5, 19.2), 0.3)
walls(gran, wing, 0, BASE - 1.0)
walls(trim, wing, BASE - 1.0, BASE)
for (const f of [...facesOf(rect(-1.5, -30.0, 18.3, 19.4)), ...facesOf(rect(-29.3, 1.8, -1.5, 19.2))]) {
  const L = lenOf(f)
  if (f[0][0] === -1.5 && f[1][0] === -1.5) continue // the wall between wing and slab
  if (f[0][1] === -30.0 && f[1][1] === -30.0) continue // party wall against the Mellie Esperson
  bayPanels(f, 1.5, L - 1.5, 2.6, 2.4, [[1.0, 7.0], [8.6, 14.6]])
}
// Travis entrance: the two giant columns in the recess.
for (const y of [-4.9, 0.0]) lathe(trim, 18.3 + 0.55, y, [[1.0, 0.4], [1.0, 1.4], [0.75, 1.6], [0.75, 13.2], [1.0, 13.8], [1.0, 14.4]], 10)
cap(roof, rect(15.1, -9.7, 18.3, 4.8), BASE)

// --- Slab: the recessed outline, terracotta, to a cornice and parapet.
const slab: XY[] = [[-1.5, -30.0], [18.3, -30.0], [18.3, -9.7], [15.1, -9.7], [15.1, 4.8], [18.3, 4.8], [18.3, 19.4], [-1.5, 19.4]]
walls(terra, slab, BASE, SLAB - 1.4)
walls(trim, slab, SLAB - 1.4, SLAB - 0.4)
walls(terra, slab, SLAB - 0.4, SLAB + 1.5)
parapetRoof(terra, roof, slab, SLAB + 1.5, 0.5, 1.5)
const slabRows = rows(BASE + 1.2, SLAB - 2.2, 6, 1.4)
for (const f of facesOf(slab)) {
  const L = lenOf(f)
  if (L < 4) continue
  if (f[0][0] === -1.5 && f[1][0] === -1.5) {
    // West face: windows only where the wing doesn't cover it.
    const along = (y: number) => f[0][1] - y // the face runs north to south
    bayPanels(f, along(1.8) + 1.0, L - 1.5, 2.4, 2.1, slabRows)
    bayPanels(f, 1.5, along(1.8) - 1.0, 2.4, 2.1, slabRows.filter(([z0]) => z0 > WING + 0.5))
    continue
  }
  // South face: the Mellie Esperson (lidar ~59 m) covers it below that.
  bayPanels(f, 1.6, L - 1.6, 2.4, 2.1, f[0][1] === -30.0 && f[1][1] === -30.0 ? slabRows.filter(([z0]) => z0 > 60) : slabRows)
}

// --- West wing.
walls(terra, wing, BASE, WING - 1.2)
walls(trim, wing, WING - 1.2, WING)
parapetRoof(terra, roof, wing, WING, 0.5, 1.0)
for (const f of facesOf(rect(-29.3, 1.8, -1.5, 19.2))) {
  if (f[0][0] === -1.5 && f[1][0] === -1.5) continue
  bayPanels(f, 1.6, lenOf(f) - 1.6, 2.6, 1.9, rows(BASE + 1.2, WING - 2.0, 5, 1.4))
}

// --- Stage A: arched windows, a cornice; urns at its corners.
const A = rect(-1.5, -19.0, 15.1, 13.0)
walls(terra, chamfer(A, 0.3), SLAB, SA - 1.2)
walls(trim, chamfer(A, 0.3), SA - 1.2, SA)
parapetRoof(trim, roof, chamfer(A, 0.3), SA + 0.6, 0.5, 0.6)
walls(trim, chamfer(A, 0.3), SA, SA + 0.6)
for (const f of facesOf(A)) {
  const L = lenOf(f), n = L > 20 ? 3 : 2, w = 3.0
  for (let k = 0; k < n; k++) {
    const c = L * (k + 1) / (n + 1)
    arch(f, c - w / 2, c + w / 2, SLAB + 2.5, SA - 4.0)
  }
}
const urn = (x: number, y: number, z: number) =>
  lathe(trim, x, y, [[0.9, z], [0.9, z + 0.7], [0.5, z + 1.0], [1.0, z + 2.2], [1.2, z + 3.0], [1.0, z + 3.6], [0, z + 3.7]], 8)
for (const [x, y] of [[-0.4, -17.6], [14.0, -17.6], [-0.4, 11.6], [14.0, 11.6]]) {
  block(trim, trim, chamfer(rect(x - 1.0, y - 1.0, x + 1.0, y + 1.0), 0.2), SA, SA + 1.4, 0.2)
  urn(x, y, SA + 1.4)
}

// --- Stage B: engaged columns between window bays, balustrade, obelisks.
const B = rect(-1.3, -15.5, 14.9, 6.5)
walls(terra, chamfer(B, 0.3), SA, SB - 1.6)
walls(trim, chamfer(B, 0.3), SB - 1.6, SB, chamfer(rect(-1.7, -15.9, 15.3, 6.9), 0.3))
const Bt = chamfer(rect(-1.7, -15.9, 15.3, 6.9), 0.3)
walls(trim, Bt, SB, SB + 2.7)
parapetRoof(trim, roof, Bt, SB + 2.7, 0.6, 2.4)
for (const f of facesOf(B)) {
  const L = lenOf(f), bays = L > 18 ? 4 : 3, pier = 2.4
  const { P, n } = onWall(f[0], f[1])
  const span = (L - 2 * pier) / bays
  for (let k = 0; k < bays; k++) panel(win, f[0], f[1], pier + k * span + 0.7, pier + (k + 1) * span - 0.7, SA + 1.2, SB - 2.4, 0.05)
  for (let k = 1; k < bays; k++) {
    const s = pier + k * span, c = P(s, 0, 0.35)
    lathe(trim, c[0], c[1], [[0.75, SA + 0.6], [0.6, SA + 1.2], [0.6, SB - 2.4], [0.8, SB - 1.8], [0, SB - 1.7]], 10)
  }
  void n
}
for (const [x, y] of [[-0.6, -15.2], [14.2, -15.2], [14.2, 6.2], [-0.6, 6.2]]) {
  block(trim, null, chamfer(rect(x - 0.9, y - 0.9, x + 0.9, y + 0.9), 0.15), SB + 2.7, SB + 3.6, 0.15)
  lathe(trim, x, y, [[0.85, SB + 3.6], [0.85, SB + 4.6], [0.6, SB + 5.8], [0, SB + 7.0]], 8, Math.PI / 4)
}

// --- Tempietto: plinth, core drum, twelve columns, entablature, stepped
// dome and lantern.
const T0 = SB + 2.3, COL = 112.0, ENT = 115.6
lathe(trim, TX, TY, [[6.5, SB + 0.5], [6.5, T0], [6.0, T0 + 0.1]], 16)
lathe(terra, TX, TY, [[4.0, T0], [4.0, COL]], 16)
for (let k = 0; k < 12; k++) {
  const a = (k / 12) * 2 * Math.PI + Math.PI / 12
  const x = TX + 5.3 * Math.cos(a), y = TY + 5.3 * Math.sin(a)
  lathe(trim, x, y, [[0.75, T0], [0.6, T0 + 0.6], [0.6, COL - 0.6], [0.8, COL]], 8)
}
lathe(trim, TX, TY, [
  [5.0, COL], [6.1, COL], [6.1, COL + 1.8], [6.6, COL + 2.4], [6.6, ENT - 0.4], [6.3, ENT],
  [5.6, ENT], [5.6, 116.8], [4.7, 117.0], [4.7, 118.1], [3.8, 118.3], [3.8, 119.3], [2.8, 119.5], [2.4, 120.2],
  [1.6, 120.3],
], 16)
lathe(trim, TX, TY, [[1.6, 120.3], [1.6, 122.6], [1.9, 122.9], [1.2, 123.6], [0.5, 124.2], [0, 124.8]], 10)

// Floodlight: the crown above the slab, brighter towards the dome; tops dimmer.
const lit = (p: V3, n: V3): number =>
  p[2] < SLAB - 0.5 ? 0 : (0.7 + 0.3 * Math.min(1, (p[2] - SLAB) / 49)) * (n[2] > 0.7 ? 0.35 : 1)

const out = [
  { part: terra, material: { ...finish('esperson-terracotta', 0xdcc8a3), floodlight: lit } },
  { part: trim, material: { ...finish('esperson-trim', 0xecdfc4), floodlight: lit } },
  { part: gran, material: finish('esperson-granite', 0xcbc4b4) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
]
if (import.meta.main) await save('hou-niels-esperson-building', 'Niels Esperson Building', [29.758898, -95.365085], 34.9, out)
