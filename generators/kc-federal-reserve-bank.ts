/**
 * Federal Reserve Bank of Kansas City — original procedural geometry, CC0-1.0.
 * bun generators/kc-federal-reserve-bank.ts
 *
 * Henningson, Durham & Richardson, completed 2008, 1 Memorial Drive, across
 * the lawn south of the Liberty Memorial. Map frame: x east, y north, z up,
 * metres, turned to bearing 4.6° (the campus outline's long edges run
 * 4.6°/184.6° in OSM; the tower's walls agree in the lidar). Origin: the
 * centroid of the OSM outer ring, on the lowest ground inside the outline
 * (the open plaza south of the west wing).
 *
 * Identity, from the photos:
 *  1. a squat, pale limestone tower (≈ 46 × 54 m, ≈ 76 m) whose four faces
 *     are a grid of punched windows, each face with a full-height solid
 *     stone strip at one end (the north face's at its east end, the west
 *     face's at its north end);
 *  2. the crown: a solid stone band over the top window row, a raised
 *     central block and stone screen walls along the east and west sides
 *     rising past the roof, with lower terraces at the north and south ends;
 *  3. a two-storey colonnade lobby, glazed behind square piers;
 *  4. the long, low stone wings of the campus (lobby and conference wing to
 *     the west, offices and the operations building to the south).
 *
 * Evidence:
 *  - OSM: relation/8505077 (multipolygon, building=government, source
 *    Bing): outer way/132573658, inner way/614149128. The inner ring (a
 *    courtyard) sits ≈ 10 m north of where the 2020 lidar puts the open
 *    court and overlaps the tower's south end; the model follows the lidar
 *    and draws a low deck there (11.5 above the plaza datum, the planted
 *    roof court seen in NAIP). An open plaza (x −28…31, y −2…30) that OSM
 *    does not map as a hole is left open, as is a service yard at grade.
 *  - Lidar, measured: USGS 3DEP MO_FEMANRCS_1_2020 (2020 flight): a 1 m
 *    crop over the campus and a 0.5 m crop over the tower, both read in
 *    this frame. Tower: walls x −21…25, y −33…21 about its centre at
 *    (30.5, 117.4); window grid and end terraces to 70.5, central block
 *    78.2, screen walls 78.8, a terrace at 64 in the south end (drawn at
 *    the 70.5 level), mechanical screens ≈ 76; ground at its north foot
 *    2.5 on that scale, so the tower stands ≈ 76.3 m. Wings 13.6–20.5 on
 *    the wide crop's scale, over ground that rises ≈ 9 m to the south.
 *  - Published: the brief gave ≈ 100 m; the lidar gives 76.3 m above the
 *    plaza to the top of the screen walls, and the model follows the lidar.
 *  - From the photos: 14 office storeys over a two-storey lobby (counted on
 *    Antony-22's 2025a and Charvex's photo); seven window bays on the north
 *    face; the solid end strips ≈ 6 m.
 *  - Estimated: the bay counts and solid strips on the south and east faces
 *    (assumed to continue the pinwheel; no photo of those sides); the
 *    wings' window bands (only the west wing's glazed ground storey is
 *    drawn, from 2025a and Charvex); the lobby piers' spacing.
 *  - Windows are grouped two storeys to a panel per bay, as the style asks;
 *    the real facade has a window per bay on every floor between stone
 *    piers and spandrels.
 *  - Simplified: the sloping tops of the screen walls seen in 2025a, the
 *    lettered frieze over the lobby, the entrance canopy north of the west
 *    wing (way/1189405539, building=roof, a separate OSM way that is not
 *    replaced) and the flagpoles are left out.
 *
 * Night: office floors and the lobby glow (`window`); no floodlighting is
 * modelled, as no night photo was found.
 *
 * Photos (Wikimedia Commons, evidence): Kansas City Federal Reserve
 * 2025a.jpg (Antony-22, CC BY-SA 4.0); New Federal Reserve Bank Kansas City
 * MO.jpg (Charvex, public domain, 2008); Views from Liberty Memorial
 * 6135.JPG (Dual Freq, CC BY 3.0). USGS NAIP for the roofs. No look-only
 * sources; no commercial imagery.
 *
 * Doubts: no photo of the south or east faces, nor of the operations
 * building; the brief's "stepped/ribbed crown" reads in the lidar as the
 * raised core and screen walls, drawn plain; the published height (≈ 100 m)
 * disagrees with the lidar (76 m).
 */
import { Part, writeGlb, type V3 } from './mesh'

type P2 = [number, number]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
function tf(p: Part, a: V3, b: V3, c: V3, want: V3) {
  if (dot(crs(sub3(b, a), sub3(c, a)), want) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}
function qf(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) { tf(p, a, b, c, want); tf(p, a, c, d, want) }

/**
 * A prism over a convex polygon (counter-clockwise from above) from z0 to z1,
 * its top edge chamfered by `bev` toward the polygon's centre, with a lid.
 */
function prism(p: Part, poly: P2[], z0: number, z1: number, bev = 0, lid = true, top = p) {
  const n = poly.length, c: P2 = [poly.reduce((s, q) => s + q[0], 0) / n, poly.reduce((s, q) => s + q[1], 0) / n]
  const inset = (q: P2): P2 => {
    const d = Math.hypot(q[0] - c[0], q[1] - c[1]) || 1
    return [q[0] + ((c[0] - q[0]) / d) * bev * 1.2, q[1] + ((c[1] - q[1]) / d) * bev * 1.2]
  }
  const zt = z1 - bev
  for (let i = 0; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n], out: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
    qf(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], zt], [a[0], a[1], zt], out)
    if (bev > 0) {
      const ia = inset(a), ib = inset(b)
      qf(p, [a[0], a[1], zt], [b[0], b[1], zt], [ib[0], ib[1], z1], [ia[0], ia[1], z1], [out[0], out[1], Math.hypot(out[0], out[1])])
    }
  }
  if (lid) {
    const q = bev > 0 ? poly.map(inset) : poly
    for (let i = 1; i < n - 1; i++) tf(top, [q[0][0], q[0][1], z1], [q[i][0], q[i][1], z1], [q[i + 1][0], q[i + 1][1], z1], [0, 0, 1])
  }
}
const rect = (x0: number, x1: number, y0: number, y1: number): P2[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bev = 0, top = p) {
  prism(p, rect(x0, x1, y0, y1), z0, z1, bev, true, top)
}

/** A face of an axis-aligned wall: `side` is the outward direction n/e/s/w; s runs left to right seen from outside. */
type Side = 'n' | 'e' | 's' | 'w'
function faceAt(side: Side, x0: number, x1: number, y0: number, y1: number) {
  // Returns the point at (s, z, d) on the face, with s from the face's left end.
  switch (side) {
    case 'n': return { len: x1 - x0, out: [0, 1, 0] as V3, at: (s: number, z: number, d = 0): V3 => [x1 - s, y1 + d, z] }
    case 's': return { len: x1 - x0, out: [0, -1, 0] as V3, at: (s: number, z: number, d = 0): V3 => [x0 + s, y0 - d, z] }
    case 'e': return { len: y1 - y0, out: [1, 0, 0] as V3, at: (s: number, z: number, d = 0): V3 => [x1 + d, y0 + s, z] }
    case 'w': return { len: y1 - y0, out: [-1, 0, 0] as V3, at: (s: number, z: number, d = 0): V3 => [x0 - d, y1 - s, z] }
  }
}
function panel(p: Part, F: ReturnType<typeof faceAt>, s0: number, s1: number, z0: number, z1: number, d = 0.05) {
  qf(p, F.at(s0, z0, d), F.at(s1, z0, d), F.at(s1, z1, d), F.at(s0, z1, d), F.out)
}

// ---------------------------------------------------------------------------
// Parts

const stone = new Part()   // pale limestone
const win = new Part()     // windows and the lobby glazing: glow at night
const roof = new Part()    // flat roofs, terraces, mechanical screens

// Model z = lidar height above the wide crop's ground_min − 3.2 m (the open
// plaza inside the outline, the lowest ground under it). The tower crop's
// heights are 1.86 m higher on the same scale: tower z = its value − 1.34.
const tz = (h: number) => h - 1.34

// --- The tower. Built in its own frame (origin at the tower crop's centre,
// axes the model's), then moved by T into place.
const T: P2 = [30.5, 117.4]
const X0 = -21, X1 = 25, Y0 = -33, Y1 = 21    // tower plan, lidar
const GROUND = tz(2.5)                         // the plaza north of the tower
const LOBBY = GROUND + 9.6                     // the two-storey colonnade lobby
const SHAFT = tz(70.5)                         // top of the window grid and of the end terraces
const CORE = tz(78.2)                          // the central raised block
const SCREEN = tz(78.8)                        // the stone screen walls that rise past the roof
const FLOORS = 14, FH = (SHAFT - 1.2 - LOBBY) / FLOORS

const tower = new Part(), towerWin = new Part(), towerRoof = new Part()
box(tower, X0, X1, Y0, Y1, 0, SHAFT, 0.4, towerRoof)
box(tower, X0, 9, -27, 9, SHAFT, CORE, 0.35, towerRoof)
box(tower, X0, X0 + 1.6, Y0, 7, SHAFT - 0.4, SCREEN, 0.3)       // west screen wall
box(tower, X1 - 1.6, X1, -31, Y1, SHAFT - 0.4, SCREEN, 0.3)     // east screen wall
box(tower, 12, X1, 12, Y1, SHAFT - 0.4, SCREEN, 0.3)            // its north-east corner block
box(towerRoof, 10, 22, -14, 8, SHAFT, tz(76.0), 0.2)            // mechanical screen
// Four faces, a pinwheel: each has a full-height solid stone strip at one
// end (the north face's at its east end and the west face's at its north
// end, as the photos show; the others assumed to follow round).
const faces: [Side, number, number][] = [['n', 7, 6], ['w', 8, 6], ['s', 7, 6], ['e', 8, 6]]
for (const [side, bays, solid] of faces) {
  const F = faceAt(side, X0, X1, Y0, Y1)
  // The solid strip is at the face's left end seen from outside (pinwheel).
  const f0 = solid, f1 = F.len - 1.0, pitch = (f1 - f0) / bays
  for (let b = 0; b < bays; b++) {
    const c = f0 + pitch * (b + 0.5)
    for (let k = 0; k < FLOORS; k += 2) {
      const z0 = LOBBY + 1.2 + FH * k + 0.7, z1 = LOBBY + 1.2 + FH * (k + 2) - 0.9
      panel(towerWin, F, c - pitch * 0.32, c + pitch * 0.32, z0, z1)
    }
  }
  // The lobby: a glazed two-storey colonnade behind square stone piers.
  panel(towerWin, F, f0, f1, GROUND + 0.2, LOBBY - 0.4)
  for (let b = 0; b <= bays; b++) {
    const s = f0 + pitch * b
    const a = F.at(s - 0.7, 0, 0), c = F.at(s + 0.7, 0, 1.4)
    box(tower, Math.min(a[0], c[0]), Math.max(a[0], c[0]), Math.min(a[1], c[1]), Math.max(a[1], c[1]), 0, LOBBY, 0.15)
  }
}
// Move the tower parts into place.
for (const [src, dst] of [[tower, stone], [towerWin, win], [towerRoof, roof]] as [Part, Part][]) {
  for (let i = 0; i < src.pos.length; i += 3) { src.pos[i] += T[0]; src.pos[i + 2] -= T[1] }
  dst.pos.push(...src.pos); dst.nrm.push(...src.nrm); dst.uv.push(...src.uv)
}

// --- The low wings around the tower: the lobby and conference wing west of
// it, the courts and offices south of the plaza, and the long operations
// building across the south end, each at its lidar roof height. Their walls
// run down to z 0 and sink into the ground, which rises ≈ 9 m to the south.
const z = (h: number) => h - 3.2
const wings: [P2[], number][] = [
  [[[-45.7, 82], [9.5, 82], [9.5, 124.5], [-45.7, 116.8]], z(19.5)],   // west wing, its north edge slanting as OSM's
  [rect(-40, -2, 62, 82), z(16.0)],
  [rect(-2, 31, 64, 84.4), z(11.5)],                                      // the low deck with the planted court
  [rect(31, 55, 62, 84.4), z(16.0)],
  [rect(-46.7, -16, 18, 62), z(19.5)],
  [rect(-16, 31, 30, 64), z(16.0)],
  [rect(31, 55, 10, 62), z(20.4)],
  [rect(-46.7, -28, 6, 18), z(13.6)],
  [rect(-57.4, -44, -59.7, 6), z(13.6)],
  [rect(-44, -14, -22, -2), z(13.6)],
  [rect(-14, -4, -59.7, -2), z(13.6)],
  [rect(-4, 55, -59.7, -2), z(20.5)],
  [rect(-81.2, 55, -111.5, -59.7), z(20.5)],                              // operations building
  [rect(55, 67.5, -111.2, -84.9), z(20.5)],
]
for (const [poly, top] of wings) {
  // walls, a parapet coping, then the flat roof just inside it
  const n = poly.length, c: P2 = [poly.reduce((s, q) => s + q[0], 0) / n, poly.reduce((s, q) => s + q[1], 0) / n]
  const inner = poly.map(([x, y]): P2 => { const d = Math.hypot(x - c[0], y - c[1]); return [x + ((c[0] - x) / d) * 0.5, y + ((c[1] - y) / d) * 0.5] })
  prism(stone, poly, 0, top, 0, false)
  for (let i = 0; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n], ia = inner[i], ib = inner[(i + 1) % n]
    qf(stone, [a[0], a[1], top], [b[0], b[1], top], [ib[0], ib[1], top], [ia[0], ia[1], top], [0, 0, 1])
    qf(stone, [ia[0], ia[1], top], [ib[0], ib[1], top], [ib[0], ib[1], top - 0.5], [ia[0], ia[1], top - 0.5], [-(b[1] - a[1]), b[0] - a[0], 0])
  }
  for (let i = 1; i < n - 1; i++) tf(roof, [inner[0][0], inner[0][1], top - 0.5], [inner[i][0], inner[i][1], top - 0.5], [inner[i + 1][0], inner[i + 1][1], top - 0.5], [0, 0, 1])
}
// The west wing's north front on the plaza: a glazed ground storey under a
// tall stone band (2025a, Charvex), and its west end the same.
{
  const zg = 1.0
  // its north edge slants: glaze only the eastern part, which faces the plaza squarely
  qf(win, [9.4, 124.55, zg], [-20, 119.95, zg], [-20, 119.95, zg + 5.5], [9.4, 124.55, zg + 5.5], [-0.15, 1, 0])
  const wf = faceAt('w', -45.7, 9.5, 82, 116.8)
  panel(win, wf, 3, 32, zg, zg + 5.5)
}

// ---------------------------------------------------------------------------
// Materials: colours from the daylight photos (Antony-22 2025a, Charvex),
// pulled to the palette's lightness: a pale, slightly cool limestone and
// dark blue-grey glass. At night the office floors and the lobby glow.

const parts = [
  { part: stone, material: { name: 'limestone', color: 0xe2ddd2, roughness: 0.85 } },
  { part: win, material: { name: 'window', color: 0x5f7487, roughness: 0.35 } },
  { part: roof, material: { name: 'roof', color: 0xcac7bf, roughness: 0.85 } },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Federal Reserve Bank of Kansas City', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 4.6, osm: 'relation/8505077', footprint: [149, 250], height: SCREEN,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/kc-federal-reserve-bank.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
