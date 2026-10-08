/**
 * National Air and Space Museum — procedural, CC0-1.0, no textures.
 * bun generators/dc-air-and-space.ts
 *
 * Map frame: x east, y north, z up, metres, in the building's own frame:
 * bearing 359.04°, the long walls turned 0.96° anticlockwise of due east
 * (measured on both long walls of the OSM outline). The anchor is the area
 * centroid of the OSM outline relation/16159112 (lng -77.0198307,
 * lat 38.8881333).
 *
 * What it is: Gyo Obata's museum (HOK, 1976), as rebuilt by the 2018–2026
 * revitalization: a 208 m row of four tall blank blocks clad in pink
 * Tennessee marble (re-clad in new marble panels in the renovation), each
 * with one deep window slot under its top on the long fronts, alternating
 * with three glazed gallery bays. On the Mall (north) side the bays are tall
 * glass walls set back between the blocks under stepped glass roofs; on the
 * Independence Avenue (south) side they close with lower marble blocks that
 * float over a recessed base, cut off from the tall blocks by narrow
 * recessed slots. The new north entrance (2025) is a white gull-winged
 * canopy in front of the middle bay. The rhythm of marble blocks and glass
 * bays, the slots and the canopy are the identity.
 *
 * Covers and replaces: relation/16159112 (outer way/66418797, untagged) and
 * the building:part way/535720705 (building:part=hangar, h 25.3), which is
 * the same outline again, drawn about 3 m to the west.
 *
 * Evidence
 * - OSM (measured, in the building frame): outline x −104.6…103.9,
 *   y −33.1…34.7; tall blocks x −104.6…−79.0, −43.6…−18.2, 17.2…42.7,
 *   78.4…103.9; the north glass walls set back to y 29.6–30.3; the south
 *   lower blocks between 6.5 m slots recessed to y −28.3; the west
 *   entrance recess x −104.6…−101.2, y −7.7…8.9; height 25.3 m.
 * - USGS NAIP orthophoto (public domain, taken during the works): the tall
 *   blocks run the full depth; the glass roofs over the bays run from the
 *   north wall to about y −9, white roofs south of that; the canopy's
 *   central vault about 25 m wide and 12 m deep.
 * - Photos (Wikimedia Commons): north entrance, "National Air and Space
 *   Museum (55256212753).jpg" (Ajay Suresh, CC BY 4.0, May 2026); south
 *   front, "National Air and Space Museum viewed from across Independence
 *   Avenue, December 2025.jpg" (Marc Merlin, CC BY-SA 4.0) and "National
 *   Air and Space Museum - 2024 Construction (53840041116).jpg" (Ajay
 *   Suresh, CC BY 2.0); from the south-west, "2014-04-04-National-Air-and-
 *   Space-Museum-Washington-DC.jpg" (Gunnar Klack, CC BY-SA 4.0); "National
 *   Air and Space Museum, Washington, DC (21 September 2023) 01.jpg"
 *   (DiscoA340, CC BY-SA 4.0).
 * - Estimated from the photos against the 25.3 m blocks: window slots 19.3
 *   to 22.3 m, inset 1.4 m from the block edges; north glass walls 17.3 m;
 *   the glass roof stepping up to 19.0 m at y 10; the south lower blocks
 *   20.0 m, over a base recessed 1.5 m to 3.0 m up; the canopy's vault
 *   15.5 m high at the middle, its wings dipping to 6.4 m and rising to
 *   9 m at the tips, 74 m across.
 * - Simplified: the marble's joint pattern is left out; the canopy's ribs
 *   and glazing are one white shell; its legs are two posts.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, grow, panel, qf, rect, save, type Rect } from './dc-smithsonian-castle'

const marble = new Part(), white = new Part(), roof = new Part(), win = new Part(), glass = new Part()

const YS = -33.1, YN = 34.7, TOP = 25.3
const TALL: Array<[number, number]> = [[-104.6, -79.0], [-43.6, -18.2], [17.2, 42.7], [78.4, 103.9]]
const BAYS: Array<[number, number]> = [[-79.0, -43.6], [-18.2, 17.2], [42.7, 78.4]]
const GLASS_N = 29.8, GLASS_TOP = 17.3, STEP_Y = 10.0, STEP_TOP = 19.0, GLASS_S = -9.0
const LOW = 20.0, SLOT = 6.5, SLOT_Y = -28.3

// ---- Tall blocks: blank marble, a deep window slot under the top on the
// north and south faces, a white roof.
for (const [x0, x1] of TALL) {
  const r = rect(x0, x1, YS, YN)
  const west = x0 < -100
  if (west) {
    // The westernmost block is split by the west entrance's glass recess.
    cbox(marble, rect(x0, x1, YS, -7.7), 0, TOP, { top: roof })
    cbox(marble, rect(x0, x1, 8.9, YN), 0, TOP, { top: roof })
    cbox(marble, rect(-101.2, x1, -7.7, 8.9), 0, TOP, { top: roof })
    panel(win, 'w', -101.2, -7.7, 8.9, 0.0, TOP - 2.0, 0.04)
    // Its returns into the recess, also marble (part of the boxes above).
  } else {
    cbox(marble, r, 0, TOP, { top: roof })
  }
  for (const [side, at] of [['n', YN], ['s', YS]] as const) {
    panel(win, side, at, x0 + 1.4, x1 - 1.4, 19.3, 22.3, 0.04)
    // The slot's sill: a thin white ledge standing just proud of the face.
    const ledge = side === 'n' ? rect(x0 + 1.4, x1 - 1.4, at, at + 0.35) : rect(x0 + 1.4, x1 - 1.4, at - 0.35, at)
    cbox(white, ledge, 18.9, 19.3, { bottom: true })
  }
}

// ---- Bays: glass on the north under stepped glass roofs; on the south a
// lower marble block floating over a recessed base, between two slots.
for (const [x0, x1] of BAYS) {
  // North glass wall and its two roof steps.
  const g1 = rect(x0, x1, STEP_Y, GLASS_N), g2 = rect(x0, x1, GLASS_S, STEP_Y)
  cbox(win, g1, 0, GLASS_TOP, { top: false })
  cbox(glass, g1, GLASS_TOP - 0.05, GLASS_TOP, { top: true })
  cbox(win, rect(x0, x1, GLASS_S, STEP_Y), GLASS_TOP, STEP_TOP, { top: false })
  cbox(glass, g2, STEP_TOP - 0.05, STEP_TOP, { top: true })
  // A white roof edge on the glass wall, so the steps read.
  cbox(white, rect(x0, x1, GLASS_N - 0.4, GLASS_N + 0.1), GLASS_TOP - 0.5, GLASS_TOP + 0.15, { bottom: true })
  cbox(white, rect(x0, x1, STEP_Y - 0.3, STEP_Y + 0.1), STEP_TOP - 0.5, STEP_TOP + 0.15, { bottom: true })
  // South block.
  const lb = rect(x0 + SLOT, x1 - SLOT, YS, GLASS_S)
  cbox(marble, grow(lb, -1.5, 0), 0, 3.0, { top: false })
  cbox(marble, rect(lb.x0, lb.x1, YS, GLASS_S), 3.0, LOW, { top: roof, bottom: true })
  // The base's dark glazing behind the overhang.
  panel(win, 's', YS, lb.x0 + 1.5, lb.x1 - 1.5, 0.0, 3.0, 0.04)
  // Slots between the south block and the tall blocks: recessed, glazed.
  for (const [s0, s1] of [[x0, x0 + SLOT], [x1 - SLOT, x1]]) {
    cbox(marble, rect(s0, s1, SLOT_Y, GLASS_S), 0, LOW, { top: roof })
    panel(win, 's', SLOT_Y, s0, s1, 0.0, LOW - 1.0, 0.04)
  }
}

// ---- The north entrance canopy (2025): a white gull-winged shell in
// front of the middle bay, a high vault over the doors and two wings.
{
  const cx = (BAYS[1][0] + BAYS[1][1]) / 2
  // Profile across the front (x from the middle, z) and depth (y out from
  // the glass wall) at each station; mirrored about the middle.
  const prof: Array<[number, number, number]> = [
    [0, 15.5, 12.0], [4, 14.8, 11.6], [8, 12.6, 10.6], [11, 9.6, 9.6], [13.5, 6.8, 8.8],
    [16, 6.4, 8.0], [22, 6.9, 6.6], [30, 7.9, 4.8], [37, 9.0, 3.0],
  ]
  const T = 0.7 // shell thickness
  const pts = [...prof.slice(1).reverse().map(([x, z, d]) => [-x, z, d]), ...prof] as Array<[number, number, number]>
  for (let k = 0; k < pts.length - 1; k++) {
    const [xa, za, da] = pts[k], [xb, zb, db] = pts[k + 1]
    const y0 = GLASS_N
    const A = (x: number, z: number, d: number): V3[] => [[cx + x, y0, z], [cx + x, y0 + d, z]]
    const [a0, a1] = A(xa, za, da), [b0, b1] = A(xb, zb, db)
    // Top surface, underside and front edge.
    qf(white, a0, b0, b1, a1, [0, 0, 1])
    const dn = (p: V3): V3 => [p[0], p[1], p[2] - T]
    qf(white, dn(a0), dn(b0), dn(b1), dn(a1), [0, 0, -1])
    qf(white, a1, b1, dn(b1), dn(a1), [0, 1, 0])
  }
  // Wing tips' end faces.
  for (const s of [-1, 1]) {
    const [x, z, d] = prof[prof.length - 1]
    qf(white, [cx + s * x, GLASS_N, z], [cx + s * x, GLASS_N + d, z], [cx + s * x, GLASS_N + d, z - T], [cx + s * x, GLASS_N, z - T], [s, 0, 0])
  }
  // Glazed entrance under the vault, and two posts at the wings' valleys.
  const ent = rect(cx - 11, cx + 11, GLASS_N, GLASS_N + 6.0)
  cbox(win, ent, 0, 6.2, { top: white })
  for (const s of [-1, 1]) cbox(white, rect(cx + s * 14.5 - 0.35, cx + s * 14.5 + 0.35, GLASS_N + 7.0, GLASS_N + 7.7), 0, 6.1, { top: false })
}

console.log({ marble: marble.triangles, white: white.triangles, roof: roof.triangles, win: win.triangles, glass: glass.triangles })
await save('dc-air-and-space', 'National Air and Space Museum', [
  { part: marble, material: finish('nasm-marble', 0xe2d5cd) },
  { part: white, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
], { bearing: 359.04, osm: 'relation/16159112', footprint: [208.5, 67.8], height: TOP }, 5000)
