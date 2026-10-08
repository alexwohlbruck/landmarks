/**
 * Art Institute of Chicago, the 1893 Allerton Building (Shepley, Rutan and
 * Coolidge, built as the World's Congress Auxiliary Building), Michigan
 * Avenue — original procedural geometry, CC0-1.0.
 *
 *   bun generators/chi-art-institute.ts
 *
 * Only the original Beaux-Arts building on Michigan Avenue. The later wings
 * east of it (Gunsaulus Hall over the railway, the Rice and Morton wings,
 * the Modern Wing) are separate in OSM and are not drawn here.
 *
 * Map frame: x east, y north, z up, metres; origin at the centroid of the
 * OSM outline way/765296570 (41.879567, -87.623660). The outline's long
 * walls run at 359.1°, so the model is built square and placed at bearing
 * 359.1.
 *
 * Identity: a long, low limestone palazzo. On Michigan Avenue, a central
 * pavilion under a broad pediment, its three arched entrances below a
 * loggia of three tall arched openings; either side, long wings with a
 * plain ground floor of square windows and, above, a blind arcade of round
 * arches under a deep frieze and cornice. From above, the gallery wings
 * ring two light courts under low hipped roofs with long glass skylights
 * along their ridges, and a glass lantern over the grand staircase in the
 * middle.
 *
 * Evidence:
 *  - OSM: way/765296570 (outline: 54.5 x 97.6 m main block, the 28.5 m
 *    pavilion projecting 4.2 m on Michigan Avenue, a 5 m projection on the
 *    east), way/765296577 (Fullerton Hall) and way/765296578 (Ryerson &
 *    Burnham Libraries), both drawn as buildings inside it.
 *  - USGS NAIP: the two courts (≈ 28 x 20 m each, Fullerton Hall in the
 *    north one, the library's flat roof in the south one), the cross wing
 *    with the stair hall's glazed roof between them, and the glass strips
 *    along the wings' roofs.
 *  - Heights: nothing is published. Measured off GualdimG's frontal photo,
 *    scaled by the pavilion's 28.5 m width: cornice ≈ 17.5 m above the
 *    sidewalk, pediment apex ≈ 26 m; ground storey ≈ 6.5 m. The hipped
 *    roofs' 19.6 m and the courts' 13 m inner blocks are estimates (NAIP
 *    shadows and the roof seen in Alanscottwalker's photo).
 *  - Photos (Wikimedia Commons): Art_Institute_of_Chicago_Fachada_02.jpg
 *    (GualdimG, CC BY-SA 4.0, west front); Art_Institute_of_Chicago_from
 *    _south.jpg (Beyond My Ken, CC BY-SA 4.0); 20070622_Art_Institute_of
 *    _Chicago_Original_Building.JPG (TonyTheTiger, CC BY-SA 3.0, from the
 *    south-west); Art_Institute_of_Chicago_(7415244162).jpg (Teemu008,
 *    CC BY-SA 2.0, from the north-west); Art_Institute_of_Chicago_Michigan
 *    _Avenue.jpg (Alanscottwalker, CC BY-SA 3.0, the roof and skylights);
 *    Art_Institute_of_Chicago,_Illinois,_Estados_Unidos,_2012-10-20,_DD_02
 *    .jpg (Diego Delso, CC BY-SA 3.0, south front at night). No commercial
 *    imagery.
 *
 * Ground: y = 0 is the Michigan Avenue sidewalk. The east wall stands over
 * the railway cut, a few metres lower; the walls are not carried down into
 * it because the map's terrain does not have the cut.
 *
 * Simplified: the blind arcade's arches are flat panels in a slightly
 * darker stone; columns, the frieze's carved names, the steps and the lions
 * (separate OSM objects) are left out. The east front (over the tracks) is
 * drawn with the same rhythm as the others, from the aerial only.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { plate, type UV } from './chi-picasso'

const stone = new Part(), shade = new Part(), roof = new Part(), glass = new Part(), win = new Part(), door = new Part()

type XY = [number, number]
const at = (pts: XY[], z: number): V3[] => pts.map(([x, y]) => [x, y, z])
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const grow = (r: XY[], d: number): XY[] => {
  const cx = (r[0][0] + r[2][0]) / 2, cy = (r[0][1] + r[2][1]) / 2
  return r.map(([x, y]) => [x + Math.sign(x - cx) * d, y + Math.sign(y - cy) * d])
}

type Face = { axis: 'x' | 'y'; c: number; out: 1 | -1 }
const onFace = (f: Face, u: number, z: number, d: number): V3 => f.axis === 'x' ? [f.c + f.out * d, u, z] : [u, f.c + f.out * d, z]
function panel(p: Part, f: Face, u0: number, u1: number, z0: number, z1: number, off = 0.06) {
  plate(p, rect(u0, u1, z0, z1), (u, z, w) => onFace(f, u, z, off + 0.01 + w), 0.02)
}
function arched(p: Part, f: Face, uc: number, w: number, z0: number, zs: number, off = 0.06, depth = 0.02) {
  const r = w / 2, pts: UV[] = [[uc - r, z0], [uc + r, z0]]
  for (let k = 0; k <= 10; k++) { const a = (k / 10) * Math.PI; pts.push([uc + r * Math.cos(a), zs + r * Math.sin(a)]) }
  plate(p, pts, (u, z, w2) => onFace(f, u, z, off + depth / 2 + w2), depth)
}

// ── Plan (OSM, turned 0.9° square) ───────────────────────────────────────
const X0 = -28.4, X1 = 26.1, Y0 = -48.8, Y1 = 48.8
const PAV = { x0: -32.6, y0: -14.7, y1: 13.8 } // Michigan Avenue pavilion
const EAST = { x1: 31.2, y0: -32.3, y1: 33.4 } // east projection
const COURT_N = rect(-16, 12, 12, 32), COURT_S = rect(-16, 12, -30, -10)
const BASE = 6.5, CORNICE = 17.5, ROOFTOP = 19.6, INNER = 13.0

// ── Walls, cornice and the gallery roofs ─────────────────────────────────
function walls(ring: XY[], top: number) {
  stone.loft([at(ring, 0), at(ring, top - 1.0)])
  // Bevelled cornice: out 0.7 m and back.
  const o = grow(ring, 0.7)
  stone.loft([at(ring, top - 1.0), at(o, top - 0.4), at(o, top)])
  return o
}
const outer = walls(rect(X0, X1, Y0, Y1), CORNICE)
const eastO = walls(rect(X1 - 0.5, EAST.x1, EAST.y0, EAST.y1), CORNICE)
roof.cap(at(eastO, CORNICE), true)
// Outer roof slope, rising inward from the cornice to the ridge level.
const IN = 5.0
const ridgeOuter = grow(rect(X0, X1, Y0, Y1), -IN + 0.7)
roof.loft([at(outer, CORNICE), at(ridgeOuter, ROOFTOP)])
// Courts: inner blocks (Fullerton Hall, the library) up to 13 m, then the
// court walls and the roof slopes rising away from each court.
for (const court of [COURT_N, COURT_S]) {
  const box = rect(court[0][0], court[2][0], court[0][1], court[2][1])
  stone.loft([at(box, INNER - 0.6), at(box, INNER)])
  roof.cap(at(box, INNER), true)
  // Court walls face into the court: run the ring the other way round.
  const rev = [...box].reverse()
  stone.loft([at(rev, INNER), at(rev, CORNICE)])
  roof.loft([at(rev, CORNICE), at([...grow(box, IN)].reverse(), ROOFTOP)])
}
// The flat top between the slopes, in strips, each with a glass skylight
// down its middle.
{
  const rx0 = ridgeOuter[0][0], rx1 = ridgeOuter[2][0], ry0 = ridgeOuter[0][1], ry1 = ridgeOuter[2][1]
  const cx0 = -16 - IN, cx1 = 12 + IN
  const strips: [number, number, number, number][] = [
    [rx0, cx0, ry0, ry1], [cx1, rx1, ry0, ry1],
    [cx0, cx1, 32 + IN, ry1], [cx0, cx1, -10 + IN - 0.0, 12 - IN], [cx0, cx1, ry0, -30 - IN],
  ]
  for (const [a, b, c, d] of strips) {
    if (b - a < 0.5 || d - c < 0.5) continue
    roof.cap(at(rect(a, b, c, d), ROOFTOP), true)
    const sx = b - a > d - c
    const g = sx ? rect(a + 1.2, b - 1.2, (c + d) / 2 - 1.1, (c + d) / 2 + 1.1) : rect((a + b) / 2 - 1.1, (a + b) / 2 + 1.1, c + 1.2, d - 1.2)
    glass.cap(at(g, ROOFTOP + 0.05), true)
  }
  // The stair hall's glass lantern over the middle of the cross wing.
  const L = rect(-9, 6, -7, 8)
  stone.loft([at(L, ROOFTOP), at(L, ROOFTOP + 1.2)])
  glass.loft([at(L, ROOFTOP + 1.2), at(grow(L, -2.5), ROOFTOP + 3.0)])
  glass.cap(at(grow(L, -2.5), ROOFTOP + 3.0), true)
}

// ── The Michigan Avenue pavilion and its pediment ────────────────────────
const PED = 26.0
{
  const ring = rect(PAV.x0, X0 + 0.5, PAV.y0, PAV.y1)
  walls(ring, CORNICE)
  // Gable roof from the pediment back over the middle of the building.
  const yc = (PAV.y0 + PAV.y1) / 2, ya = PAV.y0 - 0.7, yb = PAV.y1 + 0.7
  // The ridge runs back 9 m and hips down onto the gallery roof.
  const xf = PAV.x0 - 0.7, xh = -24.5, xb = -17
  const pedFront: V3[] = [[xf, ya, CORNICE], [xf, yb, CORNICE], [xf, yc, PED]]
  // Pediment face (with a thin raking cornice the same stone) and the two
  // roof slopes.
  stone.tri(pedFront[0], pedFront[2], pedFront[1])
  stone.tri(pedFront[0], pedFront[1], pedFront[2])
  roof.quad([xf, ya, CORNICE], [xb, ya, CORNICE], [xh, yc, PED], [xf, yc, PED])
  roof.quad([xf, yc, PED], [xh, yc, PED], [xb, yb, CORNICE], [xf, yb, CORNICE])
  roof.tri([xb, ya, CORNICE], [xb, yb, CORNICE], [xh, yc, PED])
  // Facade: three arched doors below, the loggia's three tall arches above,
  // smaller arched bays at either side.
  const W: Face = { axis: 'x', c: PAV.x0, out: -1 }
  for (const k of [-1, 0, 1]) {
    const u = yc + k * 5.0
    arched(door, W, u, 2.6, 0.9, 4.6)
    arched(win, W, u, 3.6, 8.2, 12.6)
  }
  for (const s of [-1, 1]) {
    arched(win, W, yc + s * 11.0, 2.0, 1.5, 4.4)
    panel(shade, W, yc + s * 11.0 - 1.4, yc + s * 11.0 + 1.4, 8.4, 13.6)
  }
}

// ── The wings' facades: square windows below, blind arcade above ─────────
function arcade(f: Face, u0: number, u1: number, bay: number) {
  const n = Math.max(1, Math.round((u1 - u0) / bay)), b = (u1 - u0) / n
  for (let i = 0; i < n; i++) {
    const uc = u0 + b * (i + 0.5)
    panel(win, f, uc - 1.0, uc + 1.0, 1.8, 4.9)
    arched(shade, f, uc, b * 0.72, BASE + 1.2, 12.4)
  }
  // A string course between the storeys.
  panel(stone, f, u0, u1, BASE - 0.15, BASE + 0.35, 0.18)
}
// West, either side of the pavilion.
arcade({ axis: 'x', c: X0, out: -1 }, Y0 + 2, PAV.y0 - 0.5, 4.4)
arcade({ axis: 'x', c: X0, out: -1 }, PAV.y1 + 0.5, Y1 - 2, 4.4)
// South and north ends.
arcade({ axis: 'y', c: Y0, out: -1 }, X0 + 2, X1 - 2, 4.4)
arcade({ axis: 'y', c: Y1, out: 1 }, X0 + 2, X1 - 2, 4.4)
// East, on the projection and the short returns either side.
arcade({ axis: 'x', c: EAST.x1, out: 1 }, EAST.y0 + 2, EAST.y1 - 2, 4.4)
arcade({ axis: 'x', c: X1, out: 1 }, Y0 + 2, EAST.y0 - 1, 4.4)
arcade({ axis: 'x', c: X1, out: 1 }, EAST.y1 + 1, Y1 - 2, 4.4)

const parts = [
  { part: stone, material: PALETTE.stone },
  { part: shade, material: finish('aic-stone-recess', 0xd8ccb9) },
  { part: roof, material: PALETTE.roof },
  { part: glass, material: PALETTE.glass },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
]
const triangles = parts.reduce((s, p) => s + p.part.triangles, 0)
const glb = writeGlb('Art Institute of Chicago', parts, {
  frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [41.879567, -87.62366], bearing: 359.1,
})
if (triangles > 5000 || glb.length > 250000) throw new Error(`Budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
const out = process.argv[2] ?? new URL('../models/chi-art-institute.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
