/**
 * Prudential Tower ("the Pru"), Boston: original procedural geometry, CC0-1.0.
 * bun generators/bos-prudential-tower.ts
 *
 * Charles Luckman and Associates, completed 1964; 52 floors. A plain
 * rectangular slab clad in a dense grid of aluminium fins over grey-green
 * glass, topped by the two-storey glass band of the Skywalk (floor 50) and Top
 * of the Hub (52) between two projecting concrete slabs, a dark mechanical
 * block on the roof and the tall radio mast.
 *
 * Frame: map frame turned to BEARING 339.6 (the tower's long sides run at
 * 339.6° / 159.6°), x across the tower (compass 69.6°), y along it, z up,
 * metres. Origin = the anchor, the centroid of OSM outline way/29869880.
 *
 * Ground: the tower rises out of the Prudential Center podium. The 2021 lidar
 * box around it has no ground returns at all, only the podium and plaza roofs
 * (ground_min 9.55 m is the lowest plaza roof), and the map's Mapterhorn
 * terrain under the site reads the same level (±0.3 m across the footprint).
 * So y = 0 is that plaza level, and every height below is measured from it.
 * The published roof (749 ft, 228.3 m) is above Boylston Street, about 6 m
 * lower; the lidar roof here is 222.2 m above the plaza, which agrees.
 *
 * Evidence
 * - OSM way/29869880 (outline, office, 52 levels, height 228.6 m, the tower
 *   51.4 x 55.2 m, edges at 70.2° and 159.7°); building:parts way/240259392
 *   (= the outline, 214 m, 51 levels), way/240259391 (218-228 m, the upper
 *   slab) and way/240259389 (228 m, the roof block). All four are replaced.
 * - USGS 3DEP lidar MA_CentralEastern_1_2021 (2021 flight), 1 m grid read in
 *   this frame with tools/lidar_frame.py; heights above the plaza:
 *   - shaft and lower cornice: x -25.5..21.8, y -29.5..27.5 (47.3 x 57.0 m;
 *     OSM's outline is 51.4 x 55.2 and sits ~1.8 m east; lidar is used for the
 *     shape, the OSM centroid as anchor), cornice top 203.3;
 *   - upper slab 217.7, x -23.5..20, y -26.5..24.5;
 *   - roof block 222.2, x -14.5..17.5, y -24..16, with a lower step at 219.2
 *     to y 24 (north); small light wells at 214.5 left out;
 *   - mast base box to 227.0 at x -5.5..2, y -4..2; mast returns to 258 (thin
 *     lattice, so the lidar under-reads its tip).
 * - Published (Wikipedia "Prudential Tower", citing SkyscraperPage 2188): roof
 *   749 ft (228.3 m), antenna 907 ft (276.5 m), 52 floors, Skywalk on 50, Top
 *   of the Hub on 52. Mast tip here: 276.5 - 6.1 (plaza above street, from
 *   228.3 published vs 222.2 lidar) = 270.4 m.
 * - Commons photos, all EVIDENCE:
 *   - "Prudential Tower from the John Hancock Tower 01.jpg", Wikieditor101,
 *     CC BY-SA 3.0: the crown from the ENE: lower slab, glass band, upper
 *     slab, the dark roof block and the mast with its guy wires;
 *     https://commons.wikimedia.org/wiki/File:Prudential_Tower_from_the_John_Hancock_Tower_01.jpg
 *   - "Prudential tower boston.JPG", Luciof, CC BY-SA 3.0: the fin grid
 *     (light aluminium over grey-green glass), the recessed green-glazed band
 *     under the projecting top slab;
 *     https://commons.wikimedia.org/wiki/File:Prudential_tower_boston.JPG
 *   - "Boston skyline - John Hancock Tower, 111 Huntington Avenue and
 *     Prudential Tower from Charles River Dam.jpg", Beyond My Ken, CC BY-SA
 *     4.0: the whole silhouette from the north, proportion of crown to shaft;
 *     https://commons.wikimedia.org/wiki/File:Boston_skyline_-_John_Hancock_Tower,_111_Huntington_Avenue_and_Prudential_Tower_from_Charles_River_Dam.jpg
 *   - "Prudential Tower at dusk from Huntington Avenue.jpg", Beyond My Ken,
 *     CC BY-SA 4.0: from the SW at dusk; lit office windows, the two slabs
 *     outlined in lights, the glazed band between them;
 *     https://commons.wikimedia.org/wiki/File:Prudential_Tower_at_dusk_from_Huntington_Avenue.jpg
 *   - "Boston night Hancock and Prudential dfjkn.jpg", Luciof, CC BY-SA 3.0
 *     (night): scattered lit windows, the top glass band glowing white.
 *     https://commons.wikimedia.org/wiki/File:Boston_night_Hancock_and_Prudential_dfjkn.jpg
 *
 * Estimated: the cornice slab heights (lower 200.0-203.3, upper 215.5-217.7)
 * and the glass band's set-back, from the dusk and Luciof photos scaled to
 * the lidar tops; panel grouping (three floors per panel, ~4.75 m bays) per
 * STYLE.md, not the real ~1.8 m fin rhythm; the mast's taper.
 * Left out: the "PRUDENTIAL" sign on the glass band (too fine to read at map
 * size; not the landmark's main identity), the second, smaller mast and the
 * dishes, the guy wires, the light wells in the roof.
 * Doubts: lidar and OSM disagree on the plan by ~2-4 m (see above).
 * No look-only sources were used.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const BEARING = 339.6
const ANCHOR = { lng: -71.082507, lat: 42.347172 }

// --- Dimensions (see header) ---
const CX0 = -25.5, CX1 = 21.8, CY0 = -29.5, CY1 = 27.5 // lower cornice edge (lidar)
const SHAFT_IN = 0.6 // shaft face inside the cornice edge (dusk photo)
const SHAFT_TOP = 200.0 // top of the fin grid (estimated)
const C1_TOP = 203.3 // lower cornice top (lidar)
const UX0 = -23.5, UX1 = 20.0, UY0 = -26.5, UY1 = 24.5 // upper slab edge (lidar)
const BAND_IN = 1.2 // glass band set back inside the upper slab
const U_BOT = 215.5, U_TOP = 217.7 // upper slab (lidar top)
const ROOF_TOP = 222.2 // roof block (lidar)
const STEP_TOP = 219.2
const MAST_BASE_TOP = 227.0
const MAST_TOP = 270.4 // published antenna, less the plaza height
const MAST_X = -2.5, MAST_Y = -1.0
const CH = 0.5

type P2 = [number, number]

const wall = new Part(), win = new Part(), sky = new Part(), slab = new Part(), roof = new Part(), mech = new Part()

/** Rectangle with chamfered corners, anticlockwise from above. */
function rect(x0: number, x1: number, y0: number, y1: number, c = CH): P2[] {
  return [
    [x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c],
    [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c],
  ]
}

/** A vertical prism over a convex anticlockwise plan. */
function prism(p: Part, plan: P2[], z0: number, z1: number, bottom = false) {
  for (let k = 0; k < plan.length; k++) {
    const a = plan[k], b = plan[(k + 1) % plan.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  p.cap(plan.map(([x, y]) => [x, y, z1] as V3), true)
  if (bottom) p.cap(plan.map(([x, y]) => [x, y, z0] as V3), false)
}

/** Window panels on the face a→b (anticlockwise), `bays` across, grouped vertically. */
function panels(a: P2, b: P2, bays: number, pier: number, z0: number, z1: number, groups: number, spandrel: number, p: Part) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: P2 = [t[1], -t[0]]
  const at = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * 0.05, a[1] + t[1] * s + n[1] * 0.05, z]
  const bw = L / bays, gh = (z1 - z0) / groups
  for (let i = 0; i < bays; i++) {
    const s0 = i * bw + pier / 2, s1 = (i + 1) * bw - pier / 2
    for (let g = 0; g < groups; g++) {
      const za = z0 + g * gh + spandrel, zb = z0 + (g + 1) * gh
      p.quad(at(s0, za), at(s1, za), at(s1, zb), at(s0, zb))
    }
  }
}

// --- Shaft ---
const sx0 = CX0 + SHAFT_IN, sx1 = CX1 - SHAFT_IN, sy0 = CY0 + SHAFT_IN, sy1 = CY1 - SHAFT_IN
prism(wall, rect(sx0, sx1, sy0, sy1), 0, SHAFT_TOP)
{
  const GROUPS = 16 // three floors each
  const faces: [P2, P2, number][] = [
    [[sx0 + CH, sy0], [sx1 - CH, sy0], 10], // south-ish
    [[sx1, sy0 + CH], [sx1, sy1 - CH], 12], // east-ish
    [[sx1 - CH, sy1], [sx0 + CH, sy1], 10], // north-ish
    [[sx0, sy1 - CH], [sx0, sy0 + CH], 12], // west-ish
  ]
  for (const [a, b, bays] of faces) {
    panels(a, b, bays, 1.25, 0.6, SHAFT_TOP - 4.6, GROUPS, 2.4, win)
    // the dark louvred mechanical floor under the lower slab (ENE photo)
    panels(a, b, 1, 0, SHAFT_TOP - 3.4, SHAFT_TOP, 1, 0, mech)
  }
}

// --- Crown: lower cornice slab, glass band, upper slab, roof block, mast ---
prism(slab, rect(CX0, CX1, CY0, CY1, 0.6), SHAFT_TOP, C1_TOP, true)
{
  const bx0 = UX0 + BAND_IN, bx1 = UX1 - BAND_IN, by0 = UY0 + BAND_IN, by1 = UY1 - BAND_IN
  prism(sky, rect(bx0, bx1, by0, by1, 0.4), C1_TOP, U_BOT)
  // glazing mullions every ~4 m, pale, on the glass band
  const faces: [P2, P2][] = [[[bx0, by0], [bx1, by0]], [[bx1, by0], [bx1, by1]], [[bx1, by1], [bx0, by1]], [[bx0, by1], [bx0, by0]]]
  for (const [a, b] of faces) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.round(L / 4.2)
    const t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], o: P2 = [t[1] * 0.08, -t[0] * 0.08]
    for (let i = 1; i < n; i++) {
      const s = (L * i) / n
      const p0: V3 = [a[0] + t[0] * (s - 0.25) + o[0], a[1] + t[1] * (s - 0.25) + o[1], C1_TOP]
      const p1: V3 = [a[0] + t[0] * (s + 0.25) + o[0], a[1] + t[1] * (s + 0.25) + o[1], C1_TOP]
      slab.quad(p0, p1, [p1[0], p1[1], U_BOT], [p0[0], p0[1], U_BOT])
    }
    // a transom between the two storeys
    const z = (C1_TOP + U_BOT) / 2
    const q0: V3 = [a[0] + o[0], a[1] + o[1], z - 0.25], q1: V3 = [b[0] + o[0], b[1] + o[1], z - 0.25]
    slab.quad(q0, q1, [q1[0], q1[1], z + 0.25], [q0[0], q0[1], z + 0.25])
  }
}
prism(slab, rect(UX0, UX1, UY0, UY1, 0.6), U_BOT, U_TOP, true)
prism(mech, rect(-14.5, 17.5, -24, 16, 0.4), U_TOP, ROOF_TOP)
prism(mech, rect(-14.5, 17.5, 16, 24, 0.4), U_TOP, STEP_TOP)
prism(mech, rect(MAST_X - 3.7, MAST_X + 4.0, MAST_Y - 3.0, MAST_Y + 3.0, 0.3), ROOF_TOP, MAST_BASE_TOP)
{
  // the mast: a bold tapered square shaft, thicker than the real lattice so it reads
  const ring = (h: number, z: number): V3[] => [
    [MAST_X - h, MAST_Y - h, z], [MAST_X + h, MAST_Y - h, z], [MAST_X + h, MAST_Y + h, z], [MAST_X - h, MAST_Y + h, z],
  ]
  roof.loft([ring(1.6, MAST_BASE_TOP), ring(1.0, 238), ring(0.55, 255), ring(0.35, MAST_TOP)])
  roof.cap(ring(0.35, MAST_TOP), true)
}

// Floodlit cornices: the two slabs are outlined in lights at night (dusk photo).
const slabLit = (p: V3, n: V3) => (n[2] > 0.5 ? 0.3 : 1)
const parts = [
  { part: wall, material: finish('pru-aluminium', 0xb4b9b5) },
  { part: win, material: windowVariant(2, 0x627372) },
  { part: sky, material: PALETTE.window },
  { part: slab, material: { ...PALETTE.trim, floodlight: slabLit } },
  { part: roof, material: PALETTE.roof },
  { part: mech, material: finish('pru-mechanical', 0x62676c) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Prudential Tower', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: MAST_TOP,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/29869880', 'way/240259392', 'way/240259391', 'way/240259389'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/bos-prudential-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
