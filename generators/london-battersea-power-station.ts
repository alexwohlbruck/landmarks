/**
 * Battersea Power Station (Station A 1929–35, Station B 1937–55; Sir Giles
 * Gilbert Scott with J. Theo Halliday; chimneys rebuilt 2014–17; reopened
 * 2022 after conversion by WilkinsonEyre) — procedural, CC0-1.0, no textures.
 * bun generators/london-battersea-power-station.ts
 *
 * The brick "cathedral" alone, without the new apartment blocks round it:
 * the central boiler house with its glazed roof-top storeys set back on
 * its two flanking blocks and the
 * two glass rooflights over the atrium; the four wash towers at its
 * corners, rising in three stepped stages and ribbed with bold vertical
 * brick piers, each
 * carrying a cream fluted concrete chimney with its banded cap; the two
 * turbine halls either side, their roofs now gardens; the outer switch
 * houses with their tall windows and two glazed storeys on top.
 *
 * Frame: x east, y north, z up, metres, turned to bearing 12.4°, the
 * building's long axis (the outline's walls run at 12.4° and 102.4°); the
 * anchor is the outline's centroid. Built in the outline's own frame, whose
 * origin is OSM's node at -0.14458, 51.48177, and moved by (OX, OY) on
 * output.
 *
 * Ground: z = 0 is the riverside plaza and the streets round the building
 * (lidar 8.3 m AOD on the north, east and west). Mapterhorn here is older
 * than the redevelopment and still shows the excavations (down to −7.6 m
 * AOD inside and south of the footprint), so it is not evidence for the
 * base: the model keeps the real ground and `elevation` stays 0.
 *
 * Sources:
 * - OSM: the outline way/4965216 (building=industrial, brick, height=30,
 *   160 × 169 m) and its parts: the chimneys way/223254725, way/223255111,
 *   way/223255300, way/223255478 (50–103 m, 9.6 m across at the base), the
 *   wash towers way/452939929–452939932 (55 m), the boiler house
 *   way/452939933 (50 m), the turbine halls way/452939927 and
 *   way/452939928 (30 m), and way/452939926 (35 m, a stair at the NE).
 * - Lidar: Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government
 *   Licence v3.0 (London flights of the 2010s to 2022; the roofs read as
 *   converted), heights above the 8.3 m AOD plaza: chimney tops 98–100 m;
 *   wash towers 55–56 m; the boiler house's centre 48–50 m and its two long
 *   flanking blocks 56 m; the turbine halls' roof gardens 22–24 m; the
 *   switch houses with their glazed top floors 33–35 m; the north front
 *   between the towers 44–46 m.
 * - Published (Wikipedia "Battersea Power Station"; Historic England list
 *   entry 1357620, Grade II*): chimneys 103 m (here 100.5 m above the
 *   plaza, which stands above the old ground), rebuilt 2014–17 to the
 *   original design in white concrete; brick cathedral about 160 × 170 m;
 *   reopened October 2022 with shops in the boiler house and turbine halls,
 *   flats on the roofs and in the switch houses, a roof garden, and Lift
 *   109, a glass lift inside the north-west chimney to a viewing platform at
 *   its top.
 * - Photos (Wikimedia Commons): "Helicopter Trip views 24th August 2022 -
 *   11" (Brian Adamson, CC BY 2.0; the roof plan: gardens on the turbine
 *   halls, the boiler house's rooflights and flanking blocks, the switch
 *   houses' glazed storeys); "Battersea Power Station front 2023"
 *   (Bartholomeus Thoth, CC BY 4.0; the north front, the wash towers'
 *   stepped tops and fluted piers, the chimneys' flutes and bands);
 *   "Battersea Power Station (6) - 2022-04-30" (The wub, CC BY-SA 4.0; a
 *   switch house's long side, its tall windows and glass top);
 *   "Grosvenor Bridge and Battersea Power Station" (Steve Daniels, CC BY-SA
 *   2.0; the west side from the river, during the works); "Battersea Power
 *   Station 40" (Francisco Anzola, CC BY 2.0).
 * - Estimated from photos: the wash towers' stages (the body to 42 m, a
 *   stage set in 1.3 m to 49 m, a top stage set in 2.6 m to 55 m, a stepped
 *   chimney base to 57 m); the vertical brick piers on every stage's outer
 *   faces from 24 m up (1.1 m wide, 0.9 m proud, every 2.8 m); the
 *   chimneys' taper (9.4 m across at the base to 8.0 m under the cap) and
 *   flutes (20); the window panels' size and spacing on the switch houses
 *   (2.4 × 17 m every 6.1 m); the glazed storeys set 2–2.5 m in from the
 *   brick, the switch houses' behind a brick upstand to 27 m.
 * - A departure from the lidar: the boiler house's flanking blocks are drawn
 *   with brick to 45 m and their glazed storey to 50.2 m, below the lidar's
 *   56 m (which includes roof plant and the new storeys' upstands), so the
 *   wash towers stand clear above them as they do in the photos from the
 *   ground.
 * - Not modelled: Lift 109's glazing, which is inside the NW chimney's top
 *   and does not show from outside; the cranes' gantry and jetty on the
 *   river; the new buildings round it.
 * - Colour: the brick's red-brown from daylight photos pulled to the
 *   palette's lightness; the chimneys' cream concrete (#e8e0c4); the glazed floors a
 *   light sky glass, which is lit flats at night; the gardens a muted green.
 *
 * Night: the chimneys and the brick are floodlit (`_FLOODLIGHT`): the
 * chimneys fully, the wash towers and north front strongly, the rest
 * softly; the glazed floors and tall windows glow as `window*`.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish, PALETTE, windowVariant } from './palette'

// The outline's centroid in the outline's own (turned) frame: the anchor.
const OX = 5.44, OY = -3.31

const brick = new Part(), white = new Part(), win = new Part(), glassy = new Part(), garden = new Part(), roof = new Part()

/** A plan rectangle with chamfered corners (c), CCW from above, at z. */
const rect = (x0: number, x1: number, y0: number, y1: number, c: number, z: number): V3[] => c <= 0
  ? [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  : [[x0 + c, y0, z], [x1 - c, y0, z], [x1, y0 + c, z], [x1, y1 - c, z], [x1 - c, y1, z], [x0 + c, y1, z], [x0, y1 - c, z], [x0, y0 + c, z]]

/** Rings lofted (CCW from above), top capped, bottom optional. */
function loft(p: Part, rings: V3[][], { top = true, bottom = false } = {}) {
  const n = rings[0].length
  for (let k = 0; k < rings.length - 1; k++)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, A = rings[k], B = rings[k + 1]
      p.quad(A[i], A[j], B[j], B[i])
    }
  const fan = (r: V3[], up: boolean) => {
    const c: V3 = [r.reduce((s, q) => s + q[0], 0) / n, r.reduce((s, q) => s + q[1], 0) / n, r[0][2]]
    for (let i = 0; i < n; i++) up ? p.tri(c, r[i], r[(i + 1) % n]) : p.tri(c, r[(i + 1) % n], r[i])
  }
  if (top) fan(rings[rings.length - 1], true)
  if (bottom) fan(rings[0], false)
}
/** An upright block with chamfered vertical edges. */
const block = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, c = 0.5, top = true) =>
  loft(p, [rect(x0, x1, y0, y1, c, z0), rect(x0, x1, y0, y1, c, z1)], { top })

/** A flat panel on a vertical face: along the face from a to b (x, y), z0..z1, `out` metres proud along normal n. */
function panel(p: Part, a: [number, number], b: [number, number], z0: number, z1: number, n: [number, number], out = 0.06) {
  const A: V3 = [a[0] + n[0] * out, a[1] + n[1] * out, z0], B: V3 = [b[0] + n[0] * out, b[1] + n[1] * out, z0]
  const q: V3[] = [A, B, [B[0], B[1], z1], [A[0], A[1], z1]]
  // wind to face n
  const cr = (B[0] - A[0]) * 0 - 0, nx = (B[1] - A[1]), ny = -(B[0] - A[0])
  void cr
  if (nx * n[0] + ny * n[1] > 0) p.quad(q[0], q[1], q[2], q[3]); else p.quad(q[0], q[3], q[2], q[1])
}
/** A row of panels along a face of a block: count k, width w, centred. */
function panelRow(p: Part, a: [number, number], b: [number, number], n: [number, number], z0: number, z1: number, w: number, step: number, margin = 3) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  const k = Math.floor((L - 2 * margin + (step - w)) / step)
  const start = (L - (k * step - (step - w))) / 2
  for (let i = 0; i < k; i++) {
    const s0 = start + i * step, s1 = s0 + w
    panel(p, [a[0] + ux * s0, a[1] + uy * s0], [a[0] + ux * s1, a[1] + uy * s1], z0, z1, n)
  }
}
/** Vertical brick piers (ribs) on a face: boxes w wide, d proud, from z0 to z1. */
function ribs(p: Part, a: [number, number], b: [number, number], n: [number, number], z0: number, z1: number, step: number, w = 0.8, d = 0.6, margin = 1.2) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  const k = Math.floor((L - 2 * margin) / step)
  const start = (L - k * step) / 2
  for (let i = 0; i <= k; i++) {
    const s = start + i * step
    const cx = a[0] + ux * s + n[0] * d / 2, cy = a[1] + uy * s + n[1] * d / 2
    const hx = Math.abs(ux) * w / 2 + Math.abs(n[0]) * d / 2, hy = Math.abs(uy) * w / 2 + Math.abs(n[1]) * d / 2
    block(p, cx - hx, cx + hx, cy - hy, cy + hy, z0, z1, 0, false)
  }
}

// ---- Switch houses (outer): brick to 25 m, two glazed storeys to 33.5 m ----------------------

const SW = { x0: -79.7, x1: -54.1, y0: -49.5, y1: 63.1 }
const SE = { x0: 57.0, x1: 79.4, y0: -59.5, y1: 74.0 }
for (const s of [SW, SE]) {
  block(brick, s.x0, s.x1, s.y0, s.y1, 0, 24.2, 0.6, false)
  loft(brick, [rect(s.x0, s.x1, s.y0, s.y1, 0.6, 24.2), rect(s.x0 - 0.3, s.x1 + 0.3, s.y0 - 0.3, s.y1 + 0.3, 0.7, 24.6), rect(s.x0 - 0.3, s.x1 + 0.3, s.y0 - 0.3, s.y1 + 0.3, 0.7, 25.2)])
  // Brick parapet up to 27 m round a glazed top storey set back 2.5 m.
  loft(brick, [rect(s.x0 - 0.3, s.x1 + 0.3, s.y0 - 0.3, s.y1 + 0.3, 0.7, 25.2), rect(s.x0 - 0.3, s.x1 + 0.3, s.y0 - 0.3, s.y1 + 0.3, 0.7, 27.0)], { top: false })
  block(glassy, s.x0 + 2.5, s.x1 - 2.5, s.y0 + 2.5, s.y1 - 2.5, 25.2, 31.6, 0.3, false)
  loft(roof, [rect(s.x0 + 2.2, s.x1 - 2.2, s.y0 + 2.2, s.y1 - 2.2, 0.4, 31.6), rect(s.x0 + 2.2, s.x1 - 2.2, s.y0 + 2.2, s.y1 - 2.2, 0.4, 32.1)])
  // Tall windows on the long outer face and both ends.
  const outer = s === SW ? s.x0 : s.x1, nx = s === SW ? -1 : 1
  panelRow(win, [outer, s.y0], [outer, s.y1], [nx, 0], 4.5, 21.5, 2.4, 6.1, 3)
  for (const [y, ny] of [[s.y0, -1], [s.y1, 1]] as const) panelRow(win, [s.x0, y], [s.x1, y], [0, ny], 4.5, 21.5, 2.4, 6.1, 3)
}

// ---- Turbine halls: brick to 22 m with a parapet, roof gardens --------------------------------

const TW = { x0: -54.1, x1: -28.9, y0: -70.7, y1: 74.4 }
const TE = { x0: 32.6, x1: 57.0, y0: -77.7, y1: 74.2 }
for (const t of [TW, TE]) {
  block(brick, t.x0, t.x1, t.y0, t.y1, 0, 22.0, 0.5, false)
  // A parapet ring round the garden.
  loft(brick, [rect(t.x0, t.x1, t.y0, t.y1, 0.5, 22.0), rect(t.x0, t.x1, t.y0, t.y1, 0.5, 23.2)], { top: false })
  loft(brick, [rect(t.x0 + 0.6, t.x1 - 0.6, t.y0 + 0.6, t.y1 - 0.6, 0.3, 22.4).reverse(), rect(t.x0 + 0.6, t.x1 - 0.6, t.y0 + 0.6, t.y1 - 0.6, 0.3, 23.2).reverse()], { top: false })
  const rim = (z: number) => [rect(t.x0, t.x1, t.y0, t.y1, 0.5, z), rect(t.x0 + 0.6, t.x1 - 0.6, t.y0 + 0.6, t.y1 - 0.6, 0.3, z)]
  const [o, i] = rim(23.2)
  for (let k = 0; k < o.length; k++) { const j = (k + 1) % o.length; brick.quad(o[k], o[j], i[j], i[k]) }
  loft(garden, [rect(t.x0 + 0.6, t.x1 - 0.6, t.y0 + 0.6, t.y1 - 0.6, 0.3, 22.4)], { top: true })
  // Tall windows at the ends, over the switch houses' roofs, and on the north and south fronts.
  for (const [y, ny] of [[t.y0, -1], [t.y1, 1]] as const) panelRow(win, [t.x0, y], [t.x1, y], [0, ny], 4.5, 19.5, 2.4, 5.0, 2.5)
}

// ---- Boiler house: brick nave with flanking blocks and their glazed top floors ----------------

const BH = { x0: -28.9, x1: 32.6, y0: -71.0, y1: 80.0 }
const NAVE = { x0: -12.0, x1: 16.0 }
// Flanking blocks: brick to 45 m, a pale glazed storey set back 2 m to 50.2 m, a thin roof.
for (const [x0, x1] of [[BH.x0, NAVE.x0], [NAVE.x1, BH.x1]] as const) {
  block(brick, x0, x1, BH.y0, BH.y1, 0, 45.0, 0.5, false)
  loft(brick, [rect(x0, x1, BH.y0, BH.y1, 0.5, 45.0), rect(x0 - 0.3, x1 + 0.3, BH.y0 - 0.3, BH.y1 + 0.3, 0.6, 45.6)])
  block(glassy, x0 + 2.0, x1 - 2.0, BH.y0 + 6, BH.y1 - 6, 45.6, 50.2, 0.3, false)
  loft(roof, [rect(x0 + 1.8, x1 - 1.8, BH.y0 + 5.8, BH.y1 - 5.8, 0.4, 50.2), rect(x0 + 1.8, x1 - 1.8, BH.y0 + 5.8, BH.y1 - 5.8, 0.4, 50.6)])
  // Tall windows on the faces above the turbine-hall gardens.
  const out = x0 === BH.x0 ? x0 : x1, nx = x0 === BH.x0 ? -1 : 1
  panelRow(win, [out, BH.y0 + 12], [out, BH.y1 - 6], [nx, 0], 26.5, 42.5, 2.6, 6.5, 1)
}
// The nave: brick to 48 m, roof garden, two long glass rooflights over the atrium.
block(brick, NAVE.x0, NAVE.x1, BH.y0, BH.y1, 0, 48.0, 0, false)
loft(garden, [rect(NAVE.x0, NAVE.x1, BH.y0, BH.y1, 0, 48.0)], { top: true })
for (const [y0, y1] of [[-38, 2], [8, 50]] as const) {
  const c = (NAVE.x0 + NAVE.x1) / 2
  loft(glassy, [rect(c - 6.5, c + 6.5, y0, y1, 0, 48.0), rect(c - 6.5, c + 6.5, y0, y1, 0, 49.0), rect(c - 2.0, c + 2.0, y0 + 1.5, y1 - 1.5, 0, 50.6)])
}
// North and south fronts between the wash towers: brick to 44 m, windows, a glazed top.
for (const [y, ny] of [[BH.y1, 1], [BH.y0, -1]] as const) {
  const x0 = -12.1, x1 = 13.2
  const yb = y + ny * 0.0
  block(brick, x0, x1, Math.min(yb, yb + ny * 5.8), Math.max(yb, yb + ny * 5.8), 0, 44.0, 0.4, true)
  const face = yb + ny * 5.8
  panelRow(win, [x0, face], [x1, face], [0, ny], 14, 40, 1.9, 3.4, 3.0)
  panel(win, [-4.5, face], [5.5, face], 3.0, 10.0, [0, ny]) // the entrance's glazing
  block(glassy, x0 + 1.0, x1 - 1.0, Math.min(yb, yb + ny * 4.6), Math.max(yb, yb + ny * 4.6), 44.0, 48.6, 0.2, false)
  // Fluted brick piers flanking the centre of the front.
  ribs(brick, [x0 + 1.5, face], [x0 + 6.5, face], [0, ny], 20, 43.5, 1.6, 0.6, 0.4, 0.2)
  ribs(brick, [x1 - 6.5, face], [x1 - 1.5, face], [0, ny], 20, 43.5, 1.6, 0.6, 0.4, 0.2)
}

// ---- Wash towers and chimneys ---------------------------------------------------------------------

const TOWERS: { x0: number; x1: number; y0: number; y1: number; c: [number, number] }[] = [
  { x0: -36.2, x1: -12.1, y0: 73.9, y1: 85.6, c: [-24.1, 79.3] },
  { x0: 13.2, x1: 43.2, y0: 74.2, y1: 85.9, c: [25.4, 79.8] },
  { x0: -37.3, x1: -12.6, y0: -82.2, y1: -70.6, c: [-24.6, -75.6] },
  { x0: 12.1, x1: 36.1, y0: -82.8, y1: -71.3, c: [23.8, -76.3] },
]
const STAGE = 55.0, BASE_TOP = 57.0, CHIMNEY_TOP = 100.5
for (const t of TOWERS) {
  // The tower in three stepped stages: the body to 42 m, a stage set in
  // 1.3 m to 49 m, a top stage set in 2.6 m to 55 m; bold vertical brick
  // ribs run up the outer faces of every stage, the Art Deco fluting.
  const north = t.y0 > 0
  const yFace = north ? t.y1 : t.y0, ny = north ? 1 : -1
  const outer = t.x0 < 0 ? t.x0 : t.x1, nx = t.x0 < 0 ? -1 : 1
  const stages: [number, number, number][] = [[0, 0, 42.0], [1.3, 42.0, 49.0], [2.6, 49.0, STAGE]]
  for (const [inset, z0, z1] of stages) {
    const x0 = t.x0 + inset, x1 = t.x1 - inset, y0 = t.y0 + inset, y1 = t.y1 - inset
    block(brick, x0, x1, y0, y1, z0, z1, 0.6, true)
    const yf = north ? y1 : y0, xo = t.x0 < 0 ? x0 : x1
    ribs(brick, [x0, yf], [x1, yf], [0, ny], Math.max(z0, 24), z1 - 0.3, 2.8, 1.1, 0.9, 0.9)
    ribs(brick, [xo, y0], [xo, y1], [nx, 0], Math.max(z0, 24), z1 - 0.3, 2.8, 1.1, 0.9, 0.9)
  }
  // Tall slit windows low on the end face.
  panelRow(win, [t.x0, yFace], [t.x1, yFace], [0, ny], 6, 26, 1.4, 4.8, 3)
  // The chimney's stepped base.
  const [cx, cy] = t.c
  const oct = (r: number, z: number, n = 16) => Array.from({ length: n }, (_, i) => {
    const a = Math.PI / n + (2 * Math.PI * i) / n
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3
  })
  loft(white, [oct(5.6, STAGE), oct(5.6, STAGE + 0.9), oct(5.1, STAGE + 0.9), oct(5.1, BASE_TOP)], { top: false })
  loft(white, [oct(5.1, BASE_TOP), oct(4.75, BASE_TOP)], { top: false })
  // The fluted shaft: 24 flutes, tapering, then the banded cap.
  const F = 20, fl = (r: number, z: number) => Array.from({ length: F * 2 }, (_, i) => {
    const a = (Math.PI * i) / F
    const rr = i % 2 ? r - 0.22 : r
    return [cx + rr * Math.cos(a), cy + rr * Math.sin(a), z] as V3
  })
  loft(white, [fl(4.7, BASE_TOP), fl(4.0, CHIMNEY_TOP - 2.6)], { top: false })
  loft(white, [oct(4.0, CHIMNEY_TOP - 2.6, 20), oct(4.35, CHIMNEY_TOP - 2.2, 20), oct(4.35, CHIMNEY_TOP - 1.1, 20), oct(4.15, CHIMNEY_TOP - 0.9, 20), oct(4.2, CHIMNEY_TOP, 20)], { top: false })
  // The open top: an inner wall and a dark flue mouth.
  loft(white, [oct(4.2, CHIMNEY_TOP, 20), oct(3.6, CHIMNEY_TOP, 20)], { top: false })
  loft(roof, [oct(3.6, CHIMNEY_TOP - 1.2, 20)], { top: true })
  loft(white, [oct(3.6, CHIMNEY_TOP - 1.2, 20).reverse(), oct(3.6, CHIMNEY_TOP, 20).reverse()], { top: false })
}

// ---- Output ------------------------------------------------------------------------------------------

// Move from the outline's frame to the anchor's (Parts hold glTF x, z, -y).
for (const p of [brick, white, win, glassy, garden, roof])
  for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] -= OX; p.pos[i + 2] += OY }

// Floodlight, in the anchor's frame: chimneys fully, towers and fronts strongly, the rest softly.
const towerZone = (p: V3) => Math.abs(p[1] + OY) > 68
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 1) * (p[2] > STAGE ? 1 : towerZone(p) ? 0.85 : 0.45)
const BRICK = { ...finish('battersea-brick', 0xb07a5f), floodlight: lit }
const WHITE = { ...finish('chimney-cream', 0xe8e0c4), floodlight: lit }
const parts = [
  { part: brick, material: BRICK },
  { part: white, material: WHITE },
  { part: win, material: PALETTE.window },
  { part: glassy, material: windowVariant(2, 0xb7c8d4) },
  { part: garden, material: finish('roof-garden', 0x9aa985) },
  { part: roof, material: finish('roof-grey', 0x8f8c87) },
]
if (import.meta.main) {
  let tris = 0
  for (const { part } of parts) tris += part.triangles
  const glb = writeGlb('Battersea Power Station', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, on the plaza',
    bearing: 12.4, elevation: 0, groundAOD: 8.3,
  })
  if (tris > 6500 || glb.length > 250 * 1024) throw new Error(`${tris} triangles, ${glb.length} bytes: over budget`)
  await Bun.write(new URL('../models/london-battersea-power-station.glb', import.meta.url), glb)
  console.log(`london-battersea-power-station.glb: ${tris} triangles, ${glb.length} bytes`)
}
