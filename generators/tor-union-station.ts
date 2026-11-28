/**
 * Union Station, Toronto (1927; Ross & Macdonald with Hugh G. Jones and
 * John M. Lyle) with its 1930 train shed and the 2010s glass atrium over
 * the tracks — original procedural geometry, CC0-1.0.
 * bun generators/tor-union-station.ts
 *
 * Frame: x along Front Street (east-north-east +), y towards Front Street
 * (north-north-west +), z up, metres; origin at the anchor on the ground.
 * Bearing 343.3 (the Toronto street grid; the OSM outline's edges run
 * true in it). Anchor = area centroid of OSM way/14744491 (building=
 * train_station, "Union Station"): -79.3805107, 43.6447360.
 *
 * One model, not two: OSM maps the head house, the train shed and the
 * atrium as one building outline (way/14744491) with parts inside it, and
 * the shed's roof meets the back wall of the head house above the ground
 * all along its length (Woodrich and Vågen aerials). So the shed and the
 * atrium are drawn here, as low masses behind the head house.
 *
 * Identity (from the photos):
 *  1. A 228 m long buff limestone head house on Front Street: a raised
 *     centre block with the long Tuscan colonnade (columns 12 m tall under
 *     a deep entablature), flanked by two plain five-storey wings with
 *     corner pavilions under small copper hip roofs.        (front, front3)
 *  2. The Great Hall rising behind the colonnade: an attic stage with a
 *     cornice and a green copper hip roof; big round-headed windows in its
 *     end walls show over the wings.                    (front3, cn, vagen)
 *  3. Behind it, the long low train shed: a thin roof on posts, open at
 *     the sides and the track ends, in long ridged strips along the tracks
 *     with glazed smoke slots between them, and the big flat glass atrium
 *     standing up out of its middle.                           (cn, vagen)
 *  4. The light court in the west wing, a long glazed slot.        (vagen)
 *
 * Heights (no lidar in Canada). Ground from Mapterhorn z15 (`terrain.ts
 * grid`): the lowest ground under the outline is the moat in front of the
 * wings and the south edge by Bay Street, about 75.6 m ASL = y 0 here;
 * Front Street's sidewalk is 4.3 m above that (B), the track deck 7 m.
 *  - OSM parts, taken as above Front Street: columns 12 m (951328xxx
 *    column parts), entablature 12-19 (951328327/331), attic 19-26.5
 *    (290168050), copper hip roof 26.5-32.5 (290168042), pavilion caps
 *    17-19.5 (290168044/047), light courts' glass 5-6 (290168035).
 *  - City of Toronto 3D Massing 2025 (https://open.toronto.ca/dataset/3d-massing/):
 *    shed 9.3 m above its 79.2 m surface (top ~12.9 above y 0), head house
 *    29.2 m as one block (site-plan source, too coarse for tiers).
 *  - estimated from front3 and front2: the wings' cornice 17.5 m above
 *    Front Street, a little under the entablature's top; five storeys.
 *  - estimated: the atrium's roof 20.5 m above y 0 (about 8 m over the
 *    shed, from the Vågen aerial's oblique), the shed's eaves 11 m and
 *    ridges 12.6 m; the size and count of the arched openings behind the
 *    colonnade (five, 7.6 m wide); the shed ridge spacing (13 m).
 *  - published: 22 columns, 40 ft (12.2 m) (Wikipedia, "Union Station
 *    (Toronto)"); the Great Hall 250 ft long, 88 ft high. OSM maps 24
 *    column parts (paired at the colonnade's ends); the model follows OSM.
 *  - plan: OSM outline and parts, turned into this frame. The head house
 *    body is OSM relation/12810367 (building:part, 0-17 m, the two light
 *    courts as inner rings), which agrees with the wings' 17.5 m.
 *
 * Colours: buff Indiana limestone from the sunlit front photo, pulled to
 * the palette's lightness; the Great Hall and pavilion roofs green copper
 * (front3; OSM roof:colour #527F76); the shed's roof grey; the atrium glass.
 *
 * Night: the Front Street faces are floodlit (front2): a `_FLOODLIGHT`
 * wash on the north-facing stone, weaker elsewhere. Windows glow; the
 * atrium and skylights stay dark as `glass`.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  front   "Front of Union Station in Toronto, April 3 2026.jpg", Dillan Payne,
 *          CC BY-SA 4.0 — the colonnade from the east, close.
 *          https://commons.wikimedia.org/wiki/File:Front_of_Union_Station_in_Toronto,_April_3_2026.jpg
 *  front3  "Union Station on Front Street.jpg", Doug Letterman, CC BY 2.0 — from
 *          Bay and Front (north-east): east wing, colonnade, attic, copper roof.
 *          https://commons.wikimedia.org/wiki/File:Union_Station_on_Front_Street.jpg
 *  front2  "Union Station, Toronto (20799517161).jpg", Umair Khan, CC BY 2.0 —
 *          night, from the north-east.
 *          https://commons.wikimedia.org/wiki/File:Union_Station,_Toronto_(20799517161).jpg
 *  cn      "Union Station from CN Tower, Toronto, Ontario, 2026-06-28.jpg",
 *          Chris Woodrich, CC BY-SA 4.0 — the roofs, shed and atrium from above.
 *          https://commons.wikimedia.org/wiki/File:Union_Station_from_CN_Tower,_Toronto,_Ontario,_2026-06-28.jpg
 *  vagen   "Union Station Toronto August 2017 01.jpg", Arild Vågen, CC BY-SA 4.0 —
 *          oblique aerial from the CN Tower (south-west).
 *          https://commons.wikimedia.org/wiki/File:Union_Station_Toronto_August_2017_01.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the wings' exact cornice height; the atrium's height; the
 * recess behind the colonnade is one dark glazed plane (the stone piers
 * between its arches left out) under a dark soffit;
 * the shed is trimmed 23 m short at its north-east corner, where the bus
 * terminal's separate glass canopy (way/1548670087, on its own columns,
 * part of the CIBC Square complex) stands over the outline; the south side of the
 * head house above the shed is only seen in the aerials.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, capPoly, column, cornice, edgePanels, prism, save, wall, type XY } from './atl-flatiron-building'
import { archShape, hipRoof, onWall, rectShape } from './atl-tech-tower'

const stone = new Part(), trim = new Part(), roof = new Part(), cu = new Part(), win = new Part(), glass = new Part()

const B = 4.3 // Front Street above y 0
const WING = B + 17.5 // wings' roof
const ENT0 = B + 12, ENT1 = B + 18.2, CB = B + 19 // entablature, centre block roof
const ATTIC = B + 26.5, RIDGE = B + 32.5
const EAVE = 11, RIDGE_SHED = 12.6, ATRIUM = 20.5

// ── Train shed and atrium ──
// The shed's outline, trimmed at the north-east corner where the glass
// canopy of the bus terminal (way/1548670087, a separate building on its
// own columns) stands over the outline's last 23 m.
const SHED: XY[] = [[-108.4, 34.3], [-142.8, 34.3], [-143.0, 38.3], [-168.9, 38.2], [-168.6, -68.6], [73.2, -70.0], [73.3, -57.0],
  [186.0, -57.4], [186.3, 5.5], [163.0, 5.5], [163.0, 19.7], [119.4, 19.6], [119.4, 22.4], [-108.4, 22.4]]
// A thin roof on posts, open at the sides and the track ends (vagen, cn).
wall(roof, SHED, EAVE - 0.7, EAVE)
capPoly(roof, SHED, EAVE - 0.7, false)
capPoly(roof, SHED, EAVE - 0.02, true)
for (let i = 0; i < SHED.length; i++) {
  const a = SHED[i], b = SHED[(i + 1) % SHED.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const n = Math.max(1, Math.round(L / 16))
  for (let k = 0; k < n; k++) {
    const t = k / n, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t
    box(roof, x - 0.35, x + 0.35, y - 0.35, y + 0.35, 0, EAVE - 0.7, null, 0)
  }
}
const AX0 = -31.1, AX1 = 42.1, AY0 = -69.2, AY1 = 21.6
// Long strips along the tracks: a low gabled roof strip, then a glazed
// smoke slot, repeated across the shed; the atrium stands in the middle.
for (let k = 0; k < 7; k++) {
  const y0 = -68.6 + k * 12.9, y1 = Math.min(y0 + 10.4, k === 6 ? 22.0 : 99), ys = Math.min(y1 + 2.5, 22.0)
  const xe = y0 < -57 ? 72.6 : y1 > 5.5 ? 162.6 : 185.6
  const runs: [number, number][] = [[-168.2, AX0 - 0.3], [AX1 + 0.3, xe]]
  for (const [x0, x1] of runs) {
    const ym = (y0 + y1) / 2
    const a: V3 = [x0, y0, EAVE], b: V3 = [x1, y0, EAVE], c: V3 = [x1, y1, EAVE], d: V3 = [x0, y1, EAVE]
    const r0: V3 = [x0, ym, RIDGE_SHED], r1: V3 = [x1, ym, RIDGE_SHED]
    roof.quad(a, b, r1, r0); roof.quad(c, d, r0, r1); roof.tri(d, a, r0); roof.tri(b, c, r1)
    if (ys > y1 + 0.5) glass.quad([x0, y1, EAVE + 0.05], [x1, y1, EAVE + 0.05], [x1, ys, EAVE + 0.05], [x0, ys, EAVE + 0.05])
  }
}
// The atrium: a flat glass box with a pale frame at its eaves and corners.
{
  const ring: XY[] = [[AX0, AY0], [AX1, AY0], [AX1, AY1], [AX0, AY1]]
  prism(glass, ring, EAVE - 0.7, ATRIUM, glass, 1.2, true)
  cornice(trim, ring, ATRIUM - 1.6, 0.6, 0.25, null)
  for (const [x, y] of ring) box(trim, x - 0.5, x + 0.5, y - 0.5, y + 0.5, EAVE, ATRIUM - 1.0, null, 0)
}

// ── Head house ──
/** Window panels on a face a→b (left to right seen from outside) in rows [z0, z1]. */
function rows(a: XY, b: XY, bands: [number, number][], bay = 4.6, margin = 1.6) {
  for (const [z0, z1] of bands) edgePanels(win, a, b, z0, z1, { group: z1 - z0 + 1, gap: 0, bay, pier: 1.5, margin, min: 4 })
}
const wingRows: [number, number][] = [[B + 1.2, B + 6], [B + 7.4, B + 11.6], [B + 12.6, WING - 1.6]]

// West wing, with its light court (x -84..-35, y 45..58) left open.
const W0 = -108.2, W1 = -32.3
const wFront = (x: number) => 72.6 + ((x - W1) * (74.9 - 72.6)) / (W0 - W1)
const westRing: XY[] = [[W0, 22.4], [W1, 22.4], [W1, wFront(W1)], [-93.9, wFront(-93.9)], [W0, wFront(W0)]]
const CX0 = -84, CX1 = -35, CY0 = 45.2, CY1 = 57.8
const westPieces: XY[][] = [
  [[W0, 22.4], [W1, 22.4], [W1, CY0], [W0, CY0]],
  [[W0, CY1], [W1, CY1], [W1, wFront(W1)], [W0, wFront(W0)]],
  [[W0, CY0], [CX0, CY0], [CX0, CY1], [W0, CY1]],
  [[CX1, CY0], [W1, CY0], [W1, CY1], [CX1, CY1]],
]
for (const r of westPieces) prism(stone, r, 0, WING, roof, 0.35)
box(glass, CX0, CX1, CY0, CY1, 0, B + 6, glass, 0.3)
cornice(trim, westRing, WING - 1.4, 1.0, 0.45, null)
rows([W1, wFront(W1)], [-93.9, wFront(-93.9)], wingRows) // the Front Street face
rows([W0, 22.4], [W1, 22.4], [[B + 12.6, WING - 1.6]]) // over the shed
rows([W0, wFront(W0)], [W0, 22.4], wingRows) // west end
// West pavilion cap.
hipRoof(cu, -107.9, -94.0, 63.4, 74.6, WING, B + 20.5, 0.2)

// East wing, with the small court beside the centre block.
const E0 = 48.4, E1 = 119.6
const eastRing: XY[] = [[E0, 22.4], [E1, 22.4], [120.4, 60.4], [120.4, 72.6], [105.5, 72.7], [105.5, 71.2], [E0, 71.2]]
const ECX1 = 66.5, ECY0 = 44.3, ECY1 = 57.6
const eastPieces: XY[][] = [
  [[E0, 22.4], [E1, 22.4], [E1 + 0.3, ECY0], [E0, ECY0]],
  [[E0, ECY1], [E1 + 0.5, ECY1], [120.4, 60.4], [120.4, 72.6], [105.5, 72.7], [105.5, 71.2], [E0, 71.2]],
  [[ECX1, ECY0], [E1 + 0.3, ECY0], [E1 + 0.5, ECY1], [ECX1, ECY1]],
]
for (const r of eastPieces) prism(stone, r, 0, WING, roof, 0.35)
box(glass, E0, ECX1, ECY0, ECY1, 0, B + 6, glass, 0.3)
cornice(trim, eastRing, WING - 1.4, 1.0, 0.45, null)
rows([105.5, 71.2], [E0, 71.2], wingRows)
rows([120.4, 72.6], [105.5, 72.7], [[B + 1.2, B + 6], [B + 7.4, WING - 1.6]], 4.6, 2.5) // pavilion
rows([E1, 22.4], [120.4, 72.6], wingRows) // Bay Street end
rows([E0, 22.4], [E1, 22.4], [[B + 12.6, WING - 1.6]])
hipRoof(cu, 105.6, 120.3, 60.5, 72.5, WING, B + 20.5, 0.2)

// Moat skylights along Front Street in front of both wings: stone curbs
// down into the moat, a low glass vault at street level.
for (const [x0, x1, y0, y1] of [[-93.9, -36.4, 73.6, 85.1], [50.6, 105.4, 71.3, 83.0]]) {
  box(stone, x0, x1, y0, y1, 0, B + 0.3, null, 0)
  const ym = (y0 + y1) / 2, hw = (y1 - y0) / 2 - 0.4
  const prof: [number, number][] = [0, 1, 2, 3, 4, 5, 6].map((i) => { const a = Math.PI * (1 - i / 6); return [ym + hw * Math.cos(a), B + 0.3 + 1.0 * Math.sin(a)] })
  for (let i = 0; i < prof.length - 1; i++) {
    const [ya, za] = prof[i], [yb, zb] = prof[i + 1]
    glass.quad([x1 - 0.4, ya, za], [x1 - 0.4, yb, zb], [x0 + 0.4, yb, zb], [x0 + 0.4, ya, za])
  }
  capPoly(stone, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], B + 0.3, true)
}

// Centre block: the body to the entablature's height, the colonnade, the attic and roof.
const C0 = -32.3, C1 = 48.4, PW = 68.5 // the wall behind the colonnade
prism(stone, [[C0, 22.4], [C1, 22.4], [C1, PW], [C0, PW]], 0, CB, roof, 0.4)
cornice(trim, [[C0, 22.4], [C1, 22.4], [C1, PW], [C0, PW]], CB - 1.0, 1.0, 0.5, null)
// The deep recess behind the colonnade: the wall there is glazed screens
// and arched windows in shadow (front, front3), drawn as one dark window
// plane so the pale columns stand out against it; the arches' stone
// surrounds sit on it.
// (The stone piers between the arches are left out: at map distance they
// read as a second row of columns and lighten the recess.)
onWall(win, [47.7, PW], [-31.3, PW], rectShape(0, 79, B + 0.3, ENT0), 0.05)
// Entablature over the colonnade, stepping forward over the paired end columns.
{
  const ent: XY[] = [[-31.3, PW], [47.7, PW], [47.7, 76.6], [33.5, 76.6], [33.5, 74.9], [-17.0, 74.9], [-17.0, 76.8], [-31.3, 76.8]]
  prism(stone, ent, ENT0, ENT1, roof, 0.3, true)
  cornice(trim, ent, ENT1 - 0.2, 1.0, 0.55, roof)
  // its soffit dark, so the colonnade reads as a deep shadowed porch
  capPoly(win, ent, ENT0 + 0.01, false)
}
// The columns (OSM column parts), with square plinths and capitals.
const COLS: XY[] = [
  [-30.6, 75.7], [-27.0, 75.7], [-21.7, 75.6], [-17.9, 75.6], [34.1, 75.2], [36.9, 75.2], [42.3, 75.1], [45.8, 75.1],
  [-27.0, 73.4], [-21.7, 73.3], [-16.9, 73.8], [-11.8, 73.3], [-7.5, 73.3], [-3.0, 73.3], [1.5, 73.2], [5.9, 73.1],
  [10.3, 73.1], [14.6, 73.1], [19.1, 73.1], [23.6, 73.0], [28.0, 73.0], [33.4, 73.3], [36.9, 72.9], [42.4, 72.9],
]
for (const [x, y] of COLS) {
  column(trim, [x, y], 0.95, B + 0.9, ENT0 - 0.8, 12)
  box(trim, x - 1.2, x + 1.2, y - 1.2, y + 1.2, B + 0.3, B + 0.9, trim, 0.15)
  box(trim, x - 1.25, x + 1.25, y - 1.25, y + 1.25, ENT0 - 0.8, ENT0, null, 0)
}
// Portico floor at Front Street level, over the stone below.
box(stone, C0, C1, PW, 76.8, 0, B + 0.3, stone, 0)

// Attic over the Great Hall, its end lunettes, the green copper hip roof.
const attic: XY[] = [[C0, 32.8], [48.3, 32.8], [48.3, 62.5], [C0, 62.5]]
prism(stone, attic, CB, ATTIC, roof, 0.3)
cornice(trim, attic, ATTIC - 1.2, 1.2, 0.6, roof)
for (const [a, b] of [[[C0, 62.5], [C0, 32.8]], [[48.3, 32.8], [48.3, 62.5]]] as [XY, XY][]) {
  const mid = Math.hypot(b[0] - a[0], b[1] - a[1]) / 2
  onWall(win, a, b, archShape(mid, 12, CB + 0.6, CB + 0.6, 10), 0.06)
  onWall(trim, a, b, rectShape(mid - 0.3, mid + 0.3, CB + 0.6, CB + 6.6), 0.1)
}
// The attic's long faces are plain stone (front3).
hipRoof(cu, -29.9, 46.1, 35.1, 59.7, ATTIC, RIDGE, 0.3)

// Night: Front Street is floodlit; the rest gets a faint wash.
const lit = (p: V3, n: V3) => (n[1] > 0.5 && p[1] > 60 ? 0.8 : n[2] > 0.7 ? 0.05 : 0.2)
await save('tor-union-station', 'Union Station', [
  { part: stone, material: { ...finish('union-limestone', 0xe2d5bc), floodlight: lit } },
  { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
  { part: roof, material: PALETTE.roof },
  { part: cu, material: PALETTE.patina },
  { part: win, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
], { anchor: [43.6447360, -79.3805107], bearing: 343.3 }, 6500)
