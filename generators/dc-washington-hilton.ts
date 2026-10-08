/**
 * Washington Hilton — procedural, CC0-1.0, no textures.
 * bun generators/dc-washington-hilton.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0°. The anchor is the
 * area centroid of the OSM outline way/66981885 (lng -77.0449051, lat
 * 38.91651).
 *
 * What it is: William B. Tabler's hotel (1965), the "double arc": two
 * curved slabs of rooms, each a ring sector concave to the south, meeting in
 * a cusp that points south at the main entrance, so the plan reads as a
 * bird with outstretched wings. White concrete, eleven floors of rooms in a
 * deep egg-crate grid over a recessed, glazed ground floor, plain end walls,
 * and a curved two-storey penthouse over the cusp. The arcs and the deep
 * egg-crate facade are the identity. The grid is drawn coarse: white
 * floor slabs every two storeys and white fins every two bays frame dark
 * window panels set 1.2 m back, so the frame reads in 3D and stays clear
 * of shimmer at phone size.
 *
 * Covers and replaces: the outline way/66981885 and the porte-cochère roof
 * at the cusp's south tip, way/1549399804 (building=roof), which is
 * modelled as a white pyramid canopy. Not replaced: way/1342700937, an
 * untagged building along the east wing's end and the pool deck, which the
 * model does not cover; way/1549399805, a small separate building to the
 * south-west; The Hepburn (way/533733539), the 2018 apartment building in
 * the east courtyard.
 *
 * Evidence
 * - OSM (measured): the outline's edges fit circles to within 0.2 m. West
 *   wing: centre (-85.0, -37.6), radii 50.1 and 66.4 m, from -2° to 99°
 *   (counter-clockwise from east). East wing: centre (31.8, -43.8), radii
 *   48.1 and 66.3 m, from 15° to 174°. The two wings' ends overlap in the
 *   cusp, x -36 to -16, whose south face is at y ≈ -39. Tags: height 43.5,
 *   building:levels 12, roof:shape flat.
 * - Published (Wikipedia, "Washington Hilton"): opened 1965, architect
 *   William B. Tabler, "distinctive double-arched design", 1,070-plus rooms.
 * - Photos (Wikimedia Commons): "The Washington Hilton Hotel, 1919
 *   Connecticut Ave. , N.W., Washington, D.C LCCN2010641293.tif" (Carol M.
 *   Highsmith, public domain) and "Hilton Washington - Connecticut
 *   Avenue.JPG" (APK, CC BY-SA 3.0), the west wing's concave face from the
 *   south-west; "Washington Hilton (55264947478).jpg" (ajay_suresh, CC BY
 *   4.0), the same face from the motor court; "Hilton Washington - side
 *   view.JPG" (AgnosticPreachersKid, CC BY-SA 3.0), the west end wall;
 *   "Hilton Washington - view from T Street.JPG" (APK, CC BY-SA 3.0), the
 *   east wing's concave face from the south; "View from The Cairo - facing
 *   northwest.jpg" (Carol M. Highsmith, public domain), from afar.
 * - USGS NAIP orthophoto (public domain): the plan, the raised roof over the
 *   cusp with plant on either side of it.
 * - Estimated from the photos against OSM's 43.5 m: ground floor 4.5 m,
 *   eleven 2.9 m floors to 36.4 m, parapet to 37.3 m, penthouse to 43.5 m;
 *   window bays about 3.2 m; slabs 1.4 m, fins 1.4 m, recess 1.2 m.
 *   The penthouse's extent (over the cusp, about 33° of each wing near it) is read
 *   from the aerial and from where it shows above the parapet in the
 *   photos; it is the least certain part.
 * - Simplified: the egg-crate is drawn at two storeys by two bays; the end
 *   walls' corner window columns, the motor-court arcade's vaults and the
 *   roof plant are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { arcCap, arcWall, cbox, hip, qf, rect, save } from './dc-white-house'

const conc = new Part(), win = new Part(), roof = new Part()

// ---- Heights.
const BASE = 4.5, FL = 2.9, FLOORS = 11
const TOPF = BASE + FL * FLOORS // 36.4
const TOP = TOPF + 0.9
const PENT = 43.5
// A coarse grid: a slab every two floors and a fin every two bays, so each
// recessed window panel is two storeys by two bays. Finer, it shimmers at
// phone size.
const LEDGE = 1.4, D = 1.2, PER = 2

type Wing = { cx: number; cy: number; r0: number; r1: number; a0: number; a1: number; seg: number; lift: number }
// `lift` keeps the two wings' roofs off each other where they overlap in
// the cusp (a few centimetres would flicker; 0.3 m doesn't show).
const WEST: Wing = { cx: -85.0, cy: -37.6, r0: 50.1, r1: 66.4, a0: -2, a1: 99, seg: 12, lift: 0 }
const EAST: Wing = { cx: 31.8, cy: -43.8, r0: 48.1, r1: 66.3, a0: 15, a1: 174, seg: 18, lift: 0.3 }

const rad = (a: number) => (a * Math.PI) / 180
const at = (w: Wing, r: number, a: number, z: number): V3 => [w.cx + r * Math.cos(rad(a)), w.cy + r * Math.sin(rad(a)), z]

/** A radial end wall at angle a, facing along the arc away from the wing. */
function endWall(p: Part, w: Wing, a: number, z0: number, z1: number, r0 = w.r0, r1 = w.r1, sign = 1) {
  const t: V3 = [-Math.sin(rad(a)) * sign, Math.cos(rad(a)) * sign, 0]
  qf(p, at(w, r0, a, z0), at(w, r1, a, z0), at(w, r1, a, z1), at(w, r0, a, z1), t)
}

/** A pier standing in the recess, radial, `wd` wide, at angle a. */
function pier(w: Wing, a: number, outer: boolean, wd: number) {
  const r = outer ? w.r1 : w.r0, rb = outer ? w.r1 - D : w.r0 + D
  const da = (wd / 2 / r) * (180 / Math.PI)
  const n: V3 = [Math.cos(rad(a)) * (outer ? 1 : -1), Math.sin(rad(a)) * (outer ? 1 : -1), 0]
  // Front face, then the two cheeks.
  qf(conc, at(w, r, a - da, BASE), at(w, r, a + da, BASE), at(w, r, a + da, TOPF), at(w, r, a - da, TOPF), n)
  for (const s of [-1, 1]) {
    const aa = a + s * da
    const t: V3 = [-Math.sin(rad(aa)) * s, Math.cos(rad(aa)) * s, 0]
    qf(conc, at(w, rb, aa, BASE), at(w, r, aa, BASE), at(w, r, aa, TOPF), at(w, rb, aa, TOPF), t)
  }
}

function wing(w: Wing) {
  const { cx, cy, r0, r1, a0, a1, seg, lift } = w
  // The recessed core: dark window wall on both faces, ground to the top floor.
  arcWall(win, cx, cy, r1 - D, a0, a1, seg, 0, TOPF, true)
  arcWall(win, cx, cy, r0 + D, a0, a1, seg, 0, TOPF, false)
  // A projecting white floor slab at the foot of every second floor.
  for (let k = 0; k < FLOORS; k += PER) {
    const z0 = BASE + k * FL, z1 = z0 + LEDGE
    arcWall(conc, cx, cy, r1, a0, a1, seg, z0, z1, true)
    arcCap(conc, cx, cy, r1 - D, r1, a0, a1, seg, z1, true)
    arcWall(conc, cx, cy, r0, a0, a1, seg, z0, z1, false)
    arcCap(conc, cx, cy, r0, r0 + D, a0, a1, seg, z1, true)
  }
  // Parapet and roof.
  arcWall(conc, cx, cy, r1, a0, a1, seg, TOPF, TOP + lift, true)
  arcWall(conc, cx, cy, r0, a0, a1, seg, TOPF, TOP + lift, false)
  arcCap(roof, cx, cy, r0, r1, a0, a1, seg, TOP + lift, true)
  // Fins every second bay (about 6.4 m), on both faces.
  for (const outer of [true, false]) {
    const r = outer ? r1 : r0
    const span = (rad(a1 - a0) * r)
    const n = Math.round(span / 6.4)
    for (let k = 1; k < n; k++) pier(w, a0 + ((a1 - a0) * k) / n, outer, 1.4)
  }
}
wing(WEST)
wing(EAST)

// End walls: plain white stair-tower ends. The cusp's south face is the west
// wing's end at -2°; the east wing's end at 174° sits just behind it.
endWall(conc, WEST, WEST.a1, 0, TOP, WEST.r0, WEST.r1, 1)
endWall(conc, WEST, WEST.a0, 0, TOP, WEST.r0, WEST.r1, -1)
endWall(conc, EAST, EAST.a0, 0, TOP + EAST.lift, EAST.r0, EAST.r1, -1)
endWall(conc, EAST, EAST.a1, 0, TOP + EAST.lift, EAST.r0, EAST.r1, 1)

// ---- Penthouse over the cusp: a curved two-storey block on each wing's
// inner end, set back from both faces.
function penthouse(w: Wing, a0: number, a1: number, lift: number) {
  const seg = 4, i0 = w.r0 + 3.0, i1 = w.r1 - 3.5, z0 = TOP + w.lift, z1 = PENT + lift
  arcWall(conc, w.cx, w.cy, i1, a0, a1, seg, z0, z1, true)
  arcWall(conc, w.cx, w.cy, i0, a0, a1, seg, z0, z1, false)
  arcCap(roof, w.cx, w.cy, i0, i1, a0, a1, seg, z1, true)
  endWall(conc, w, a1, z0, z1, i0, i1, 1)
  endWall(conc, w, a0, z0, z1, i0, i1, -1)
}
penthouse(WEST, 8, 42, 0)
penthouse(EAST, 135, 168, 0.25)

// ---- Porte-cochère at the cusp's tip (way/1549399804): a white pyramid
// canopy on four piers.
{
  const r = rect(-36.9, -17.5, -57.3, -40.0)
  for (const [x, y] of [[r.x0 + 1, r.y0 + 1], [r.x1 - 1, r.y0 + 1]] as [number, number][])
    cbox(conc, rect(x - 0.6, x + 0.6, y - 0.6, y + 0.6), 0, 5.0, { top: false })
  cbox(conc, r, 5.0, 5.8, { b: 0.2, bottom: true, top: false })
  hip(conc, r, 5.8, 8.4, 9.0, conc, 7.5)
}

await save('dc-washington-hilton', 'Washington Hilton', [
  { part: conc, material: finish('hilton-concrete', 0xf0ece4) },
  { part: win, material: PALETTE.window },
  { part: roof, material: finish('hilton-roof', 0xc8c7c2) },
], { bearing: 0, osm: 'way/66981885', footprint: [190.4, 69.6], height: PENT }, 5000)
