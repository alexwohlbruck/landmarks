/**
 * Nelson-Atkins Museum of Art (the original 1933 building), Kansas City,
 * Missouri — original procedural geometry, CC0-1.0.
 * bun generators/kc-nelson-atkins-museum.ts
 *
 * Wight and Wight, opened 1933: a long limestone block in a stripped
 * neoclassical manner. The 2007 Bloch Building to the east is a separate
 * model (kc-bloch-building). Map frame: x east, y north, z up, metres, in
 * the building's own axes, placed at bearing 2.4° (the long faces in the
 * 2020 lidar and in OSM both run 92.4°). Origin: the middle of the lidar
 * footprint (2 m east, 1 m south of the OSM outline's centroid), on the
 * lowest ground under the footprint (the map's terrain: 279.0 m, at the
 * west end of the south front).
 *
 * Identity, from the photos:
 *  1. the long pale limestone block with flat roof and strong cornice,
 *     symmetric about its north-south axis (all photos);
 *  2. the south front: a central pavilion with six giant Ionic columns in
 *     antis before a dark loggia with three bronze doors, the raised attic
 *     block above it, and the grand stair down to the lawn
 *     (Peterspexarth 2024, from the south);
 *  3. the end pavilions, with two columns in antis on the south and
 *     pilasters on the north; one row of tall windows along the wings,
 *     high blank wall above (2024 photo; the public-domain panorama of
 *     the north front);
 *  4. the north entrance: six columns before the centre (panorama);
 *  5. the east and west ends: a screen of six columns across the middle
 *     over a basement storey, a raised attic band over it (Daderot
 *     DSC08014);
 *  6. on the roof, the west wing's pitched glass skylight (green-grey in
 *     the 2024 photo and NAIP) and the centre's lower skylight.
 *
 * Evidence:
 *  - OSM: relation/15394221 (building=yes multipolygon "Nelson-Atkins
 *    Museum of Art", wikidata Q1976985), outer way/71551988 is this
 *    building; its other outers are the Bloch Building's lenses. No
 *    building:part ways.
 *  - Lidar, measured: USGS 3DEP MO_FEMANRCS_1_2020 (2020 flight), 1 m grid
 *    read in this frame (lidar_frame.py, bearing 2.4). Above the map's
 *    lowest ground (279.0 m): main roof 20.15; south attic 24.95;
 *    west skylight ridge 23.2; centre skylight ≈ 22; south terrace 0.5–1.1;
 *    north lawn 3.75; north areaways 0.5–1.5. Plan: wings' faces y ±25,
 *    end pavilions ±27 (x 43–57.5), the centre ±14 wide out to y −30
 *    (south) and +29.5 (north), the end column screens out to x ±60 over
 *    y ±10, the attic x ±14, y −26 … −9.
 *  - Terrain: Mapterhorn z15 (bun tools/terrain.ts grid), 279.0 m lowest
 *    under the footprint; the lidar ground agrees within 0.5 m.
 *  - Estimated from the photos (scaled by the lidar heights): portico and
 *    end-screen floors 4.5 m up, column shafts 4.5–16.4 m (Ø1.5 m, drawn Ø1.7),
 *    entablature 16.4–20.15 m; window sizes and counts (six per wing on
 *    the long fronts, two per end pavilion on the north, four each side of
 *    the end screens); attic windows; the stair's run.
 *  - Simplified: the relief panels high on the wings, the inscriptions,
 *    the urns and lamps, the basement windows, the courtyard roofs.
 *
 * Loggias: in every photo the wall behind the south and north columns is
 * in deep shadow, so the light columns stand out against it. The loggias
 * are cut 4.5 m back behind the wings' faces (8.5 m behind the columns) and
 * their back and side walls are drawn in the window slate, the darkest material,
 * a deliberate stand-in for the shadow, so the colonnades read at phone
 * size. Columns are drawn Ø1.7 m, a little bolder than the real ≈1.5 m.
 *
 * Night: the windows and the loggia back walls (window) and the three
 * south doors and the north doors (entrance) glow, as a lit portico would; the stone is left unlit (no open night photo of
 * the old building was found to show how it is floodlit).
 *
 * Photos (evidence):
 *  - Nelson-Atkins Museum of Art 2024.jpg, Peterspexarth, CC BY 4.0,
 *    https://commons.wikimedia.org/wiki/File:Nelson-Atkins_Museum_of_Art_2024.jpg
 *  - Nelson-Atkins Museum of Art - panorama of facade.jpg, public domain,
 *    https://commons.wikimedia.org/wiki/File:Nelson-Atkins_Museum_of_Art_-_panorama_of_facade.jpg
 *  - Side facade - Nelson-Atkins Museum of Art - DSC08014.JPG, Daderot,
 *    public domain,
 *    https://commons.wikimedia.org/wiki/File:Side_facade_-_Nelson-Atkins_Museum_of_Art_-_DSC08014.JPG
 *  - Exterior of Nelson-Atkins Museum of Art.jpg, Yungryan07, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Exterior_of_Nelson-Atkins_Museum_of_Art.jpg
 *  - USGS NAIP orthophoto (public domain) for the roof. No commercial
 *    imagery.
 * Doubts: the photographed end facade (DSC08014) is taken to be the west
 * one and the east end drawn the same (the Bloch lens hides most of it);
 * column count of the south end pavilions read from one aerial photo.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const TAU = Math.PI * 2
const ROOF = 20.15, ATTIC = 24.95, FLOOR = 4.5, CAP = 16.4

const stone = new Part(), trim = new Part(), roof = new Part()
const win = new Part(), glass = new Part(), door = new Part()

// --- helpers ---------------------------------------------------------------
/** A rectangle ring at z, counter-clockwise from above, corners chamfered by c. */
function ring(x0: number, x1: number, y0: number, y1: number, z: number, c: number): V3[] {
  if (c <= 0) return [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  return [[x0 + c, y0, z], [x1 - c, y0, z], [x1, y0 + c, z], [x1, y1 - c, z], [x1 - c, y1, z], [x0 + c, y1, z], [x0, y1 - c, z], [x0, y0 + c, z]]
}
/** A box with chamfered vertical edges and a chamfered top edge. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, c = 0.35) {
  c = Math.min(c, (x1 - x0) / 3, (y1 - y0) / 3, (z1 - z0) / 2)
  const a = ring(x0, x1, y0, y1, z0, c), b = ring(x0, x1, y0, y1, z1 - c, c)
  const t = ring(x0 + c, x1 - c, y0 + c, y1 - c, z1, c * 0.4)
  p.loft([a, b, t])
  p.cap(t, true)
  if (z0 > 0.01) p.cap(a, false)
}
/** Both mirror images of a box across x = 0 (the building is symmetric). */
function box2(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, c = 0.35) {
  box(p, x0, x1, y0, y1, z0, z1, c)
  box(p, -x1, -x0, y0, y1, z0, z1, c)
}
/** A flat panel on a wall face: `axis` is the face normal, at plane `at`. */
function panel(p: Part, axis: 'x+' | 'x-' | 'y+' | 'y-', at: number, u0: number, u1: number, z0: number, z1: number, off = 0.04) {
  const s = axis[1] === '+' ? 1 : -1, w = at + s * off
  if (axis[0] === 'x') {
    const A: V3 = [w, u0, z0], B: V3 = [w, u1, z0], C: V3 = [w, u1, z1], D: V3 = [w, u0, z1]
    if (s > 0) p.quad(A, B, C, D); else p.quad(B, A, D, C)
  } else {
    const A: V3 = [u0, w, z0], B: V3 = [u1, w, z0], C: V3 = [u1, w, z1], D: V3 = [u0, w, z1]
    if (s < 0) p.quad(A, B, C, D); else p.quad(B, A, D, C)
  }
}
/** A smooth round shaft between two radii, open-ended (sits between base and capital). */
function shaft(p: Part, x: number, y: number, z0: number, z1: number, r0: number, r1: number, n = 10) {
  const at = (r: number, z: number) => Array.from({ length: n }, (_, i): V3 => [x + r * Math.cos((i / n) * TAU), y + r * Math.sin((i / n) * TAU), z])
  const A = at(r0, z0), B = at(r1, z1)
  const nr = (i: number): V3 => [Math.cos((i / n) * TAU), Math.sin((i / n) * TAU), 0]
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    p.tri(A[i], A[j], B[j], undefined, undefined, undefined, [nr(i), nr(j), nr(j)])
    p.tri(A[i], B[j], B[i], undefined, undefined, undefined, [nr(i), nr(j), nr(i)])
  }
}
/** An Ionic column: square plinth and base, round shaft, and a capital wide along the facade. */
function column(x: number, y: number, z0: number, z1: number, along: 'x' | 'y') {
  box(trim, x - 1.1, x + 1.1, y - 1.1, y + 1.1, z0, z0 + 0.55, 0)
  shaft(trim, x, y, z0 + 0.5, z1 - 0.7, 0.86, 0.76)
  const [hx, hy] = along === 'x' ? [1.25, 0.95] : [0.95, 1.25]
  box(trim, x - hx, x + hx, y - hy, y + hy, z1 - 0.75, z1, 0)
}

// --- the main block ----------------------------------------------------------
const CORN = ROOF - 1.2                       // foot of the cornice
// The core, with the two central loggias cut 4.5 m deeper than the wings'
// faces, so their back walls stand well behind the columns (the photos show
// them in deep shadow).
box(stone, -57.5, 57.5, -20.5, 20.5, 0, CORN, 0.3)
box2(stone, 12.2, 57.5, -25, -20.4, 0, CORN, 0.3)
box2(stone, 12.6, 57.5, 20.4, 25, 0, CORN, 0.3)
box(stone, -12.3, 12.3, -25, -20.4, 0, FLOOR, 0.05)         // loggia floors
box(stone, -12.7, 12.7, 20.4, 25, 0, FLOOR, 0.05)
box(stone, -12.3, 12.3, -25, -20.4, CAP, CORN, 0.05)        // loggia ceilings (behind the entablature)
box(stone, -12.7, 12.7, 20.4, 25, CAP, CORN, 0.05)
box(trim, -58.1, 58.1, -25.6, 25.6, CORN, ROOF, 0.4)
box(roof, -57.3, 57.3, -24.8, 24.8, ROOF - 0.3, ROOF + 0.06, 0)

// End pavilions on the long fronts (x 43–57.5). South: a loggia with two
// columns in antis; north: a solid bay with four pilasters.
for (const s of [-1, 1]) {
  const X = (a: number) => s * a
  const lo = Math.min(X(43), X(57.5)), hi = Math.max(X(43), X(57.5))
  // north bay, solid, out to y 27.5
  box(stone, lo, hi, 25, 27.5, 0, CORN, 0.3)
  box(trim, lo - 0.6, hi + 0.6, 24.5, 28.1, CORN, ROOF, 0.4)
  for (const a of [44.1, 48.3, 52.5, 56.7]) box(stone, Math.min(X(a - 0.6), X(a + 0.6)), Math.max(X(a - 0.6), X(a + 0.6)), 27.3, 27.85, FLOOR, CAP, 0.12)
  for (const a of [46.2, 50.4, 54.6]) panel(win, 'y+', 27.5, Math.min(X(a - 0.8), X(a + 0.8)), Math.max(X(a - 0.8), X(a + 0.8)), 5.2, 9.0)
  // south loggia: antae, podium, entablature, two columns, windows behind
  box(stone, Math.min(X(43), X(45.5)), Math.max(X(43), X(45.5)), -27, -24.9, 0, CORN, 0.3)
  box(stone, Math.min(X(55), X(57.5)), Math.max(X(55), X(57.5)), -27, -24.9, 0, CORN, 0.3)
  box(stone, lo, hi, -27, -24.9, 0, FLOOR, 0.2)
  box(stone, lo, hi, -27, -24.9, CAP, CORN, 0.2)
  box(trim, lo - 0.6, hi + 0.6, -27.6, -24.5, CORN, ROOF, 0.4)
  for (const a of [48.3, 51.7]) column(X(a), -26.1, FLOOR, CAP, 'x')
  for (const a of [46.6, 50, 53.4]) panel(win, 'y-', -25, Math.min(X(a - 0.7), X(a + 0.7)), Math.max(X(a - 0.7), X(a + 0.7)), 6.0, 10.5)
}

// Wing windows: one row of tall windows on both long fronts, small
// basement windows under them on the south (the terrace side).
for (const s of [-1, 1])
  for (let i = 0; i < 6; i++) {
    const x = s * (17 + i * 4.8), u0 = Math.min(x - 0.8, x + 0.8), u1 = Math.max(x - 0.8, x + 0.8)
    panel(win, 'y-', -25, u0, u1, 5.0, 8.8)
    panel(win, 'y-', -25, u0 + 0.15, u1 - 0.15, 1.6, 3.0)
    panel(win, 'y+', 25, u0, u1, 5.6, 9.4)
  }

// --- the south centre: six columns in antis, the loggia doors, the attic ---
box(stone, -14, 14, -30, -24.9, 0, FLOOR, 0.3)              // portico floor
box2(stone, 12.2, 14, -30, -24.9, FLOOR - 0.1, CAP, 0.3)    // antae
box(stone, -14.6, 14.6, -30.6, -24.9, CAP, CORN, 0.3)       // entablature
box(trim, -15.2, 15.2, -31.2, -24.5, CORN, ROOF, 0.4)       // cornice
for (let i = 0; i < 6; i++) column(-11 + i * 4.4, -29, FLOOR, CAP, 'x')
// Three tall bronze doors in the loggia, about two thirds of the columns' height.
// The shadowed loggia: its back wall drawn dark (window slate) between the
// antae, so the light columns stand out against it; three tall bronze doors on it.
panel(win, 'y-', -20.5, -12.2, 12.2, FLOOR, CAP)
panel(win, 'x+', -12.2, -30, -20.5, FLOOR, CAP)   // and its side walls, which the diagonal views see
panel(win, 'x-', 12.2, -30, -20.5, FLOOR, CAP)
for (const x of [-6.6, 0, 6.6]) panel(door, 'y-', -20.5, x - 1.4, x + 1.4, FLOOR, FLOOR + 7.6, 0.08)
// The attic over the south centre, with its row of six small windows.
box(stone, -14, 14, -26, -9, ROOF - 0.5, ATTIC - 0.9, 0.3)
box(trim, -14.5, 14.5, -26.5, -8.5, ATTIC - 0.9, ATTIC, 0.35)
for (let i = 0; i < 6; i++) panel(win, 'y-', -26, -10.6 + i * 4.24, -9.4 + i * 4.24, ROOF + 0.9, ROOF + 2.7)
// The grand stair down from the portico, between two cheek blocks.
for (let k = 0; k < 4; k++) box(stone, -11, 11, -34, -30 - k, 0, FLOOR - 0.5 * (k + 1), 0.05)
box2(stone, 11, 13.2, -34.5, -29.9, 0, FLOOR + 0.5, 0.2)

// --- the north centre: six columns before the entrance --------------------
box(stone, -14, 14, 24.9, 29.5, 0, FLOOR, 0.3)
box2(stone, 12.6, 14, 24.9, 26.2, FLOOR - 0.1, CAP, 0.2)
box(stone, -14.6, 14.6, 24.9, 30.1, CAP, CORN, 0.3)
box(trim, -15.2, 15.2, 24.5, 30.7, CORN, ROOF, 0.4)
for (let i = 0; i < 6; i++) column(-11 + i * 4.4, 28.6, FLOOR, CAP, 'x')
panel(win, 'y+', 20.5, -12.6, 12.6, FLOOR, CAP)
panel(win, 'x+', -12.6, 20.5, 26.2, FLOOR, CAP)
panel(win, 'x-', 12.6, 20.5, 26.2, FLOOR, CAP)
for (const x of [-4.4, 0, 4.4]) panel(door, 'y+', 20.5, x - 1.2, x + 1.2, FLOOR, FLOOR + 5.0, 0.08)

// --- the east and west ends: a six-column screen over a basement storey ---
for (const s of [-1, 1]) {
  const X = (a: number) => s * a, lo = (a: number, b: number) => Math.min(X(a), X(b)), hi = (a: number, b: number) => Math.max(X(a), X(b))
  const ax = s < 0 ? 'x-' : 'x+'
  box(stone, lo(57.4, 60), hi(57.4, 60), -10.8, 10.8, 0, 5.0, 0.3)          // basement storey
  box(stone, lo(57.4, 60.6), hi(57.4, 60.6), -11.2, 11.2, CAP, CORN, 0.3)  // entablature
  box(trim, lo(57.4, 61.2), hi(57.4, 61.2), -11.8, 11.8, CORN, ROOF, 0.4)
  box(stone, lo(54.5, 60.6), hi(54.5, 60.6), -11.2, 11.2, ROOF - 0.2, ROOF + 1.1, 0.3) // raised attic band
  for (let i = 0; i < 6; i++) column(X(59.0), -10 + i * 4, 5.0, CAP, 'y')
  for (const y of [-8, -4, 0, 4, 8]) panel(win, ax, 57.5, y - 1.0, y + 1.0, 8.2, 11.6)
  for (const y of [-14, -17.5, -21, 14, 17.5, 21]) panel(win, ax, 57.5, y - 1.0, y + 1.0, 7.2, 10.8)
  for (const y of [-6, 0, 6]) panel(win, ax, 60, y - 0.9, y + 0.9, 1.4, 3.8)
}

// --- skylights on the roof -------------------------------------------------
/** A hipped glass roof over a rectangle, its ridge along x. */
function hip(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const ym = (y0 + y1) / 2, d = (y1 - y0) / 2
  const A: V3 = [x0, y0, z0], B: V3 = [x1, y0, z0], C: V3 = [x1, y1, z0], D: V3 = [x0, y1, z0]
  const R0: V3 = [x0 + d, ym, z1], R1: V3 = [x1 - d, ym, z1]
  p.quad(A, B, R1, R0)
  p.quad(C, D, R0, R1)
  p.tri(B, C, R1)
  p.tri(D, A, R0)
}
box(roof, -44.5, -15.5, -5.5, 11.5, ROOF, ROOF + 0.8, 0.1)
hip(glass, -44, -16, -5, 11, ROOF + 0.8, 23.2)
box(roof, -16.5, 16.5, -5.5, 3.5, ROOF, ROOF + 0.6, 0.1)
hip(glass, -16, 16, -5, 3, ROOF + 0.6, 22.2)

// --- write ------------------------------------------------------------------
const parts: Array<{ part: Part; material: MaterialSpec }> = [
  { part: stone, material: finish('nelson-limestone', 0xe8dcc4) },
  { part: trim, material: finish('nelson-limestone-trim', 0xf1e7d3) },
  { part: roof, material: finish('nelson-roof', 0xbcbfbd) },
  { part: win, material: PALETTE.window },
  // The skylights read green-grey from above (NAIP) and in the 2024 aerial photo.
  { part: glass, material: finish('glass', 0x8fb2ac, 0.3) },
  // Bronze doors by day; `entrance` glows at night.
  { part: door, material: { name: 'entrance', color: 0x7d6c58, roughness: 0.6 } },
]
const triangles = parts.reduce((a, { part }) => a + part.triangles, 0)
console.log(parts.map(({ part, material }) => `${material.name}: ${part.triangles}`).join(', '))
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Nelson-Atkins Museum of Art', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: ATTIC, bearing: 2.4,
})
if (glb.length > 250_000) throw new Error(`too big: ${glb.length}`)
await Bun.write(new URL('../models/kc-nelson-atkins-museum.glb', import.meta.url), glb)
console.log(`kc-nelson-atkins-museum.glb: ${triangles} triangles, ${glb.length} bytes`)
