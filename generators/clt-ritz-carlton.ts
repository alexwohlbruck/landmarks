/**
 * The Ritz-Carlton, Charlotte (201 E Trade St, 2009, LEED Gold hotel and
 * residences), Charlotte — original procedural geometry, CC0-1.0.
 * bun generators/clt-ritz-carlton.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the
 * centroid of the OSM outline way/380092604) on the lowest ground. Placed at
 * bearing 49.3, square to Uptown's grid: -y faces East Trade Street (and the
 * Gold Line), +y the Bank of America Center's plaza deck, -x South College
 * Street's side, +x towards South Tryon.
 *
 * Identity, in order:
 *  - two thin glass slabs side by side, the front one (on Trade) 18 storeys
 *    with a planted roof, the back one two to three storeys taller, a dark
 *    vertical slot between them on each end;
 *  - a fine grid of champagne mullions and spandrels over blue glass, the
 *    front slab's ends carrying deep horizontal fins;
 *  - a thin flat cornice slab overhanging each top;
 *  - a recessed two-storey glass base under a canopy.
 *
 * Evidence:
 *  - OSM: outline way/380092604 (80 m, 52.6 x 18.1 m). The plan's length and
 *    the front face are from it.
 *  - Lidar: USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17), 1 m grid
 *    read in this frame (tools/lidar_frame.py). Ground along Trade falls from
 *    4.8 m (-x) to 2.0 m (+x) above the crop's lowest return; the model's base
 *    is 2.2. Measured: the front slab y -10..2, roof 67.5 and parapet 68.3
 *    (65.3 / 66.1 above the base); the back slab y 2..16, roof 77.2 (75.0
 *    above the base). The back slab runs 6.5 m past OSM's outline into the
 *    Bank of America Center's polygon (way/984135971), which OSM draws as its
 *    plaza deck; the lidar and the photos put the slab there.
 *  - NAIP (tools/usgs.py naip, 60 m half-size, laid over OSM): the two roofs,
 *    the front one planted (green), the back one white with plant.
 *  - Photos (Wikimedia Commons, daylight):
 *    "Ritz Carlton Uptown Charlotte.jpg" (City Dweller 2, CC BY-SA 4.0, from
 *    Trade and College: the front face, the finned end, the slot and the
 *    back slab's end, the base,
 *    https://commons.wikimedia.org/wiki/File:Ritz_Carlton_Uptown_Charlotte.jpg);
 *    "The Ritz-Carlton Hotel, Charlotte.jpg" (Kiran891, CC BY-SA 4.0, the same
 *    corner in summer,
 *    https://commons.wikimedia.org/wiki/File:The_Ritz-Carlton_Hotel,_Charlotte.jpg);
 *    "Ritz Carlton 2019.jpg" (Cmett003, CC BY-SA 4.0, from high up to the
 *    north-west: the two slabs' heights, the planted front roof, the slot,
 *    https://commons.wikimedia.org/wiki/File:Ritz_Carlton_2019.jpg);
 *    "Ritz Charlotte.jpg" (Jt12081988, CC BY-SA 4.0, looking up the front
 *    face: the finned end against the flush grid,
 *    https://commons.wikimedia.org/wiki/File:Ritz_Charlotte.jpg).
 *    No commercial imagery. No look-only sources.
 *  - Terrain (Mapterhorn): checked with tools/terrain.ts; elevation 0.
 *
 * Estimated: the base 9 m (two storeys, set back 1 m); the storeys 3.15 m
 * (18 over 56 m above the base) grouped two at a time; bays 6.5 m; the fins
 * every two storeys, 0.7 m deep; the slot 1.6 m wide and 1.8 m deep; the
 * cornices 1.2 m out and 0.8 m thick; the planted area inset 1.6 m.
 * Doubts: the back slab's north-east face is hidden behind the plaza deck
 * below 30 m and drawn like the front; the back slab's exact end treatment
 * (vertical bay windows) is simplified to grouped panels.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, inset, onWall, panel, save, walls, type XY } from './chi-aon-center'

const BEARING = 49.3
const ANCHOR: [number, number] = [35.2261491, -80.8414749]

const frame = new Part(), glass = new Part(), base = new Part(), roof = new Part(), green = new Part(), slot = new Part()

const X0 = -26.3, X1 = 26.3, Y0 = -9.6, YJ = 2.0, Y1 = 15.6
const BASE = 9, HA = 65.3, HB = 75.0, STOREY = 3.15, GROUP = 2 * STOREY
const SLOT = 1.6, SD = 1.8

const A: XY[] = [[X0, Y0], [X1, Y0], [X1, YJ], [X0, YJ]]
// back slab, notched at each end where it meets the front slab: the slot
const B: XY[] = [[X0 + SLOT, YJ], [X1 - SLOT, YJ], [X1 - SLOT, YJ + SD], [X1, YJ + SD], [X1, Y1], [X0, Y1], [X0, YJ + SD], [X0 + SLOT, YJ + SD]]

// --- Base: recessed glass, the canopy is the slabs' soffit.
const footprint: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
walls(base, inset(footprint, 1.0), 0, BASE)
// champagne mullion piers and a transom across the base glass
{
  const I = inset(footprint, 1.0)
  for (let i = 0; i < 4; i++) {
    const a = I[i], b = I[(i + 1) % 4], { L } = onWall(a, b), n = Math.max(1, Math.round(L / 4.4))
    for (let k = 0; k <= n; k++) panel(frame, a, b, Math.max(0, k * L / n - 0.3), Math.min(L, k * L / n + 0.3), 0, BASE, 0.06)
    panel(frame, a, b, 0, L, 4.4, 5.0, 0.06)
  }
}
cap(frame, footprint, BASE, false)
walls(frame, footprint, BASE, BASE + 0.9) // canopy edge

walls(frame, A, BASE + 0.9, HA)
walls(frame, B, BASE + 0.9, HB)

const rows = (top: number) => {
  const out: [number, number][] = []
  for (let z = BASE + 0.9; z + 2 < top - 0.8; z += GROUP) out.push([z + 0.45, Math.min(z + GROUP - 0.45, top - 1.4)])
  return out
}
/** Grouped panels on wall a→b: bays about `bay` wide, piers 0.6. */
function grid(a: XY, b: XY, z0: number, top: number, bay = 6.5) {
  const { L } = onWall(a, b)
  const n = Math.max(1, Math.round(L / bay)), w = L / n
  for (let k = 0; k < n; k++) for (const [q0, q1] of rows(top)) if (q0 >= z0 - 0.01) panel(glass, a, b, k * w + 0.3, (k + 1) * w - 0.3, q0, q1, 0.05)
}

// front slab: long faces and the finned ends
grid(A[0], A[1], BASE, HA) // Trade face
for (const [a, b] of [[A[1], A[2]], [A[3], A[0]]] as [XY, XY][]) {
  const { L } = onWall(a, b)
  for (const [q0, q1] of rows(HA)) {
    panel(glass, a, b, 0.4, L - 0.4, q0, q1, 0.05)
    // the fin over each group, 0.7 deep: top, front and soffit
    const { P } = onWall(a, b), z = q1 + 0.45
    frame.quad(P(0, z, 1.0), P(L, z, 1.0), P(L, z, 0), P(0, z, 0))
    frame.quad(P(0, z - 0.5, 1.0), P(L, z - 0.5, 1.0), P(L, z, 1.0), P(0, z, 1.0))
    frame.quad(P(0, z - 0.5, 0), P(L, z - 0.5, 0), P(L, z - 0.5, 1.0), P(0, z - 0.5, 1.0))
  }
}
// back slab: its long faces (the south-west one only above the front slab), ends, slot
for (let i = 0; i < B.length; i++) {
  const a = B[i], b = B[(i + 1) % B.length], { L } = onWall(a, b)
  if (L < 2.5) { panel(slot, a, b, 0, L, BASE + 0.9, HB - 0.8, 0.02); continue } // the slot's sides
  if (i === 0) { grid(a, b, HA, HB); continue }
  grid(a, b, BASE, HB, i === 4 ? 6.5 : 4.4)
}
// the slot's back: the front slab's end wall between the notch faces is the slot's floor plan edge
for (const [x0, x1] of [[X0, X0 + SLOT], [X1 - SLOT, X1]]) {
  panel(slot, [x1, YJ], [x0, YJ], 0, SLOT, BASE + 0.9, HA, 0.02) // faces +y into the notch
}

// --- Cornice slabs and roofs.
function cornice(r: XY[], h: number) {
  const o = inset(r, -1.2)
  walls(frame, o, h - 0.8, h)
  cap(frame, o, h - 0.8, false)
  cap(roof, o, h)
}
cornice(A, HA + 0.8)
cornice([[X0, YJ], [X1, YJ], [X1, Y1], [X0, Y1]], HB + 0.8)
cap(green, inset(A, 1.6), HA + 0.85) // the planted roof
// plant on the back roof
{
  const M: XY[] = [[-12, 6], [10, 6], [10, 12], [-12, 12]]
  walls(roof, M, HB + 0.8, HB + 3.4)
  cap(roof, M, HB + 3.4)
}

if (import.meta.main) {
  await save('clt-ritz-carlton', 'The Ritz-Carlton, Charlotte', ANCHOR, BEARING, [
    { part: frame, material: finish('ritz-champagne', 0xcfc6b1) },
    { part: glass, material: { ...PALETTE.window, color: 0x6f90b0 } },
    { part: base, material: windowVariant(2, 0x7f95a8) },
    { part: slot, material: windowVariant(3, 0x3f4f5e) },
    { part: roof, material: PALETTE.roof },
    { part: green, material: finish('ritz-green-roof', 0x8c9e6a) },
  ])
}
