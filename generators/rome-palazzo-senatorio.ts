/**
 * Palazzo Senatorio, Piazza del Campidoglio, Rome: procedural, CC0-1.0,
 * no textures.
 *   bun generators/rome-palazzo-senatorio.ts
 *
 * Map frame: x, y, z up, metres, turned to bearing 304: +y points north-west,
 * out of Michelangelo's facade onto the piazza; +x points north-east (toward
 * the Aracoeli side); -y is the back, over the Forum. The bearing is the
 * direction of OSM's long front and back edges (34 deg) less 90. Origin:
 * the centroid of the OSM outline relation/1691910 at 12.4835877,
 * 41.8929489. The facade is symmetric about x = 0.9.
 *
 * y = 0 is the lowest ground the map draws under the footprint (z13
 * terrain), at the back corner; the piazza is P = 5.7 m above it (the
 * terrain check: the map's ground along the facade). All facade heights
 * are from the piazza.
 *
 * Modelled: the palace block on OSM's plan, its walls in the salmon render
 * between travertine; the facade's rusticated travertine basement, the
 * giant order of pilasters over seven bays with the projecting end bays,
 * the entablature and the balustrade with its eight statues; the
 * pedimented windows of the piano nobile and the upper windows; the double
 * stair (each side a short lower flight in front of the end bay, a landing,
 * and the long flight rising to the central landing) with its parapets;
 * the main door; the fountain niche under the landing with the seated Roma
 * and the two reclining river gods; the Torre Capitolina at the centre: the
 * brick shaft, the lower belfry, the clock stage, the arched belfry, the
 * cornice, the balustrade, the lantern and the pole; on the Forum side the
 * Tabularium (OSM's outline includes it): its massive base in grey-brown
 * tufa and peperino and its arcade storey, three arches open, the palace's
 * rear wall above with four storeys of windows, and the crenellated Torre di
 * Niccolò V at the east corner (OSM way/123817461).
 *
 * Sources
 * - OSM (ODbL), fetched 2026-11-28 (API map call): the outline
 *   relation/1691910 (building=public, height 31, wikidata Q927092); the
 *   tower way/123817559 ("Torre della Patarina", the Capitoline bell tower,
 *   height 45); the corner towers way/123817461 (Torre di Niccolò V) and
 *   way/123817462 (Torri di Bonifacio IX), all drawn within the block;
 *   way/123817552 (building=bridge, the small passage at the south-west
 *   corner, about half under the block) is replaced as well, with
 *   way/131557516 (a 1 m² building inside the block) and relation/1841130
 *   (the small building against the Tabularium, a quarter under the
 *   Tabularium's ledge).
 * - Published: Italian Wikipedia, "Tabularium" (read 2026-11): the base on
 *   the Forum side 73.6 m long, in Aniene tufa and peperino blocks; three
 *   arches survive, framed by Doric half-columns; the upper floor level
 *   with the hill's top.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 Alvesgaspar, "Campidoglio (Palacio Senatorio) September 2015-1.jpg",
 *     CC BY-SA 4.0 (the facade square on from the piazza: bays, every
 *     height, the stair, the statues, the tower's stages, the colours);
 *     https://commons.wikimedia.org/wiki/File:Campidoglio_(Palacio_Senatorio)_September_2015-1.jpg
 *   3 Hugo DK, "Palazzo Senatorio Torre.jpg", CC BY 4.0 (close-up of the
 *     tower: stages, corner pilasters, clock, belfries, statue);
 *     https://commons.wikimedia.org/wiki/File:Palazzo_Senatorio_Torre.jpg
 *   2 Rita1234, "Rome Forum Romanum Tabularium.JPG", CC BY-SA 3.0 (the
 *     back from the Forum: the Tabularium base and arcade, the rear wall
 *     and its windows, the Torre di Niccolò V, the tower's back);
 *     https://commons.wikimedia.org/wiki/File:Rome_Forum_Romanum_Tabularium.JPG
 * - Terrain: Mapterhorn z13 only. It falls only 3-4.5 m from the piazza to
 *   the back of the block, where the real Forum lies ~20 m below the piazza
 *   (Tabularium base ~12 m and arcade ~8 m, estimated). The model keeps the
 *   real heights from the piazza, so most of the Tabularium is under the
 *   drawn ground: its arches show only their heads. That is the terrain's
 *   error. Elevation 0.
 *
 * Numbers
 * - From OSM: the plan (simplified), the facade width (60.4 m), the tower's
 *   position, the Torre di Niccolò V's plan.
 * - Measured on photo 1 (60 m = 965 px, 16 px/m, square on): pilasters at
 *   0.9 ± 4.25, 11.3, 18.8, 28.2 m; basement to 9.1 m, pilasters to 23.4,
 *   cornice 24.7, balustrade 26.6, statues to 28.5; piano nobile windows
 *   2.3 x 3.8 m from 9.9 m, upper windows 1.9 m square from 17.8; the
 *   stair's landing 9 m wide at 9.1 m, lower landings at 3.2 m, the flights
 *   starting 24.3 m out.
 * - The tower, measured on photo 3 in its own width (W = 6.3 m, set by
 *   photo 1): the lower stage to 32.6 m with its arched belfry (27.4-30.8)
 *   and balustrade, the cornice with the clock (3 m across) astride it, the
 *   upper stage to 38.8 with the upper belfry arch, the cornice to 39.6, the
 *   balustrade to 40.6, the pedestal to 42.2, the statue to 44 and the pole
 *   to 45 m (OSM 45). OSM's 31 m for the block is read as the statues' tops plus
 *   the roof.
 * - Estimated from photo 2: the rear windows (four storeys, 1.3 x 2.2 m),
 *   the Torre di Niccolò V 29 m over the piazza with its crenellation, the
 *   three open arches' places; the end bays' projection (2.9 m) from OSM.
 * - Simplified: no window aedicules beyond a pale frame and pediment
 *   block, no capitals, no medallions, no balusters (solid parapets); the
 *   sculpture is bold masses.
 *
 * Night: the facade and the tower are floodlit; the windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { earcut, extrude, prism, rect, save, body, ellipsoid, type XY } from './dc-wwii-memorial'

const trav = new Part()
const render = new Part()
const brick = new Part()
const win = new Part()
const stone = new Part() // the rear and side walls, the Tabularium, the corner tower
const dark = new Part()

function tri(p: Part, a: V3, b: V3, c: V3, dir: V3) {
  const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  if (n[0] * dir[0] + n[1] * dir[1] + n[2] * dir[2] < 0) p.tri(a, c, b)
  else p.tri(a, b, c)
}
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, dir: V3) {
  tri(p, a, b, c, dir)
  tri(p, a, c, d, dir)
}
function face(p: Part, ring: XY[], at: (u: number, v: number) => V3, dir: V3) {
  for (const [i, j, k] of earcut(ring)) tri(p, at(...ring[i]), at(...ring[j]), at(...ring[k]), dir)
}
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, b = 0) {
  prism(p, rect((x0 + x1) / 2, (y0 + y1) / 2, Math.abs(x1 - x0) / 2, Math.abs(y1 - y0) / 2), z0, z1, b)
}
/** A round-headed opening as a flat polygon in (u, v): width 2w, sill v0, springing v1. */
function arched(u: number, w: number, v0: number, v1: number, n = 6): XY[] {
  const pts: XY[] = [[u - w, v0], [u + w, v0]]
  for (let k = 0; k <= n; k++) pts.push([u + w * Math.cos((Math.PI * k) / n), v1 + w * Math.sin((Math.PI * k) / n)])
  return pts
}
const disc = (cu: number, cv: number, r: number, n: number): XY[] =>
  Array.from({ length: n }, (_, i) => [cu + r * Math.cos((i / n) * Math.PI * 2), cv + r * Math.sin((i / n) * Math.PI * 2)] as XY)

const P = 5.7 // the piazza over the model's base
const C = 0.9 // the facade's axis
const FY = 22.7 // the facade plane between the end bays
const PAV = 2.9 // the end bays' projection
const EAVE = P + 24.7

// ---------------------------------------------------------------- the block

// The body on OSM's plan (simplified), in render, to the cornice.
const BODY: XY[] = [[-36.7, -23.1], [24.7, -23.1], [24.7, -13.9], [34.8, -13.9], [30.9, FY], [-30.0, FY], [-31.8, 15.3], [-33.7, 4.4]]
extrude(stone, BODY, 0, EAVE, undefined, { caps: [false, true] })
// The salmon render of the front between the end bays.
box(render, C - 18.8, C + 18.8, FY - 0.3, FY + 0.05, P + 9.1, EAVE)
// The low tiled roof, hipped, its ridge under the balustrade's top so it
// stays hidden from the piazza (photo 1).
{
  const x0 = -30.5, x1 = 30.0, y0 = -21.6, y1 = FY - 1.2, r = EAVE + 0.8
  const ym = (y0 + y1) / 2
  quad(brick, [x0, y0, EAVE], [x1, y0, EAVE], [x1 - 7, ym, r], [x0 + 7, ym, r], [0, -1, 2])
  quad(brick, [x1 - 7, ym, r], [x1, y1, EAVE], [x0, y1, EAVE], [x0 + 7, ym, r], [0, 1, 2])
  tri(brick, [x1, y0, EAVE], [x1, y1, EAVE], [x1 - 7, ym, r], [1, 0, 1])
  tri(brick, [x0, y1, EAVE], [x0, y0, EAVE], [x0 + 7, ym, r], [-1, 0, 1])
}

// ---------------------------------------------------------------- the facade

const PIL = [4.25, 11.3, 18.8, 28.2] // pilaster centres from the axis
const HALF = 29.5 // the facade's half width
const atX = (s: number, d: number) => C + s * d
for (const s of [-1, 1]) {
  // The end bays, projecting, in render.
  const xa = atX(s, PIL[2]), xb = atX(s, HALF)
  box(render, Math.min(xa, xb), Math.max(xa, xb), FY - 1, FY + PAV, 0, EAVE)
}
// The rusticated basement, its travertine greyer than the order above
// (photo 1): drawn in the grey-brown stone so the pale stair reads on it.
box(stone, atX(-1, PIL[2]), atX(1, PIL[2]), FY - 0.5, FY + 0.35, 0, P + 9.1)
for (const s of [-1, 1]) {
  const xa = atX(s, PIL[2]) - s * 0.35, xb = atX(s, HALF) + s * 0.35
  box(stone, Math.min(xa, xb), Math.max(xa, xb), FY + PAV - 1, FY + PAV + 0.35, 0, P + 9.1)
}
// A cornice band over the basement.
box(trav, atX(-1, HALF) - 0.4, atX(1, HALF) + 0.4, FY + PAV - 0.5, FY + PAV + 0.6, P + 8.8, P + 9.5)
box(trav, atX(-1, PIL[2]), atX(1, PIL[2]), FY - 0.5, FY + 0.6, P + 8.8, P + 9.5)
// The giant pilasters, on the front of each bay division.
for (const s of [-1, 1]) for (const d of PIL) {
  const y = d >= PIL[2] ? FY + PAV : FY
  // The end bay's inner pilaster turns the corner: one on its side face too.
  box(trav, atX(s, d) - 0.8, atX(s, d) + 0.8, y - 0.3, y + 0.45, P + 9.5, P + 23.4)
}
for (const s of [-1, 1]) box(trav, atX(s, PIL[2]) - 0.8, atX(s, PIL[2]) + 0.8, FY - 0.2, FY + PAV, P + 9.5, P + 23.4)
// The entablature, carried round the end bays, and the cornice.
box(trav, atX(-1, PIL[2]), atX(1, PIL[2]), FY - 0.5, FY + 0.6, P + 23.0, EAVE - 0.4)
for (const s of [-1, 1]) {
  const xa = atX(s, PIL[2]) - s * 0.9, xb = atX(s, HALF) + s * 0.5
  box(trav, Math.min(xa, xb), Math.max(xa, xb), FY - 0.5, FY + PAV + 0.6, P + 23.0, EAVE - 0.4)
}
box(trav, atX(-1, PIL[2]), atX(1, PIL[2]), FY - 0.5, FY + 1.0, EAVE - 0.4, EAVE, 0.15)
for (const s of [-1, 1]) {
  const xa = atX(s, PIL[2]) - s * 0.9, xb = atX(s, HALF) + s * 0.9
  box(trav, Math.min(xa, xb), Math.max(xa, xb), FY - 0.5, FY + PAV + 1.0, EAVE - 0.4, EAVE, 0.15)
}
// The balustrade (a solid parapet) and the statues on its pedestals.
box(trav, atX(-1, PIL[2]), atX(1, PIL[2]), FY - 0.3, FY + 0.4, EAVE, P + 26.4)
for (const s of [-1, 1]) {
  const xa = atX(s, PIL[2]), xb = atX(s, HALF)
  box(trav, Math.min(xa, xb), Math.max(xa, xb), FY + PAV - 0.3, FY + PAV + 0.4, EAVE, P + 26.4)
  // ...and along the end bays' inner sides, back to the main front.
  box(trav, xa - 0.35, xa + 0.35, FY, FY + PAV, EAVE, P + 26.4)
}
for (const s of [-1, 1]) for (const d of PIL) {
  const y = d >= PIL[2] ? FY + PAV : FY, x = atX(s, d)
  box(trav, x - 0.55, x + 0.55, y - 0.35, y + 0.55, EAVE, P + 26.6)
  body(trav, [[P + 26.6, 0.45, 0.4, x, y + 0.1], [P + 28.0, 0.35, 0.3, x, y + 0.1], [P + 28.6, 0.18, 0.18, x, y + 0.1]], 5)
}

// Windows: per bay, the piano nobile's pedimented window and the upper one.
{
  const bays = [0, (PIL[0] + PIL[1]) / 2, (PIL[1] + PIL[2]) / 2, (PIL[2] + PIL[3]) / 2]
  for (const s of [-1, 1]) for (const [i, d] of bays.entries()) {
    if (i === 0 && s > 0) continue
    const x = C + s * d, y = (i === 3 ? FY + PAV : FY) + 0.05
    const w = i === 0 ? 1.4 : 1.15
    if (i > 0) {
      // Pale frame with a pediment block, the glass inside.
      box(trav, x - w - 0.35, x + w + 0.35, y - 0.1, y + 0.15, P + 9.6, P + 14.0)
      box(trav, x - w - 0.6, x + w + 0.6, y - 0.1, y + 0.45, P + 14.0, P + 14.8)
      quad(win, [x - w, y + 0.17, P + 9.9], [x + w, y + 0.17, P + 9.9], [x + w, y + 0.17, P + 13.7], [x - w, y + 0.17, P + 13.7], [0, 1, 0])
    }
    box(trav, x - 1.25, x + 1.25, y - 0.1, y + 0.12, P + 17.5, P + 20.0)
    quad(win, [x - 0.95, y + 0.14, P + 17.8], [x + 0.95, y + 0.14, P + 17.8], [x + 0.95, y + 0.14, P + 19.7], [x - 0.95, y + 0.14, P + 19.7], [0, 1, 0])
  }
  // The main door at the landing, under its frame, and a small basement
  // window in each end bay.
  box(trav, C - 2.0, C + 2.0, FY - 0.1, FY + 0.2, P + 9.1, P + 14.8)
  quad(dark, [C - 1.3, FY + 0.22, P + 9.1], [C + 1.3, FY + 0.22, P + 9.1], [C + 1.3, FY + 0.22, P + 13.9], [C - 1.3, FY + 0.22, P + 13.9], [0, 1, 0])
  for (const s of [-1, 1]) {
    const x = C + s * (PIL[2] + PIL[3]) / 2, y = FY + PAV + 0.38
    quad(win, [x - 0.8, y, P + 4.0], [x + 0.8, y, P + 4.0], [x + 0.8, y, P + 6.2], [x - 0.8, y, P + 6.2], [0, 1, 0])
  }
}

// ---------------------------------------------------------------- the stair

{
  const LAND = P + 9.1, LOW = P + 3.2, D = 3.6 // landing height, lower landing, flight depth
  // The central landing and the block under it with the fountain niche.
  box(trav, C - 4.5, C + 4.5, FY, FY + 4.4, 0, LAND)
  box(trav, C - 4.7, C + 4.7, FY + 4.2, FY + 4.6, LAND, LAND + 1.3)
  face(dark, arched(C, 1.7, P + 0.8, P + 4.6, 6), (u, v) => [u, FY + 4.43, v], [0, 1, 0])
  // Roma, seated in the niche.
  body(trav, [[P + 0.8, 0.9, 0.7, C, FY + 4.7], [P + 2.6, 0.75, 0.55, C, FY + 4.6], [P + 3.9, 0.45, 0.4, C, FY + 4.55], [P + 4.3, 0.25, 0.25, C, FY + 4.55]], 6)
  for (const s of [-1, 1]) {
    // The long flight, a stepped profile from the lower landing to the top.
    const x0 = C + s * 4.5, x1 = C + s * 16.5, N = 10
    const prof: XY[] = [[16.5, 0]]
    for (let i = 0; i < N; i++) {
      const u = 16.5 - (12 * i) / N, z = LOW + ((LAND - LOW) * (i + 1)) / N
      prof.push([u, z], [u - 12 / N, z])
    }
    prof.push([4.5, 0])
    extrude(trav, prof, FY, FY + D - 0.7, (u, v, w) => [C + s * u, w, v], { caps: [false, true] })
    // Its balustrade along the front edge, a solid band following the
    // slope from the lower landing to the top landing, standing down to the
    // ground as the flight's outer wall.
    // The flight's outer wall in the basement's grey stone, the balustrade
    // band on it in white travertine, standing a little proud.
    const wall: XY[] = [[16.5, 0], [16.5, LOW], [4.5, LAND], [4.5, 0]]
    extrude(stone, wall, FY + D - 0.7, FY + D, (u, v, w) => [C + s * u, w, v], { caps: [false, true] })
    const par: XY[] = [[16.5, LOW - 0.3], [16.5, LOW + 1.3], [4.5, LAND + 1.3], [4.5, LAND - 0.3]]
    extrude(trav, par, FY + D - 0.75, FY + D + 0.25, (u, v, w) => [C + s * u, w, v])
    // The lower landing, and the short flight in front of the end bay.
    box(trav, Math.min(x1, C + s * PIL[2]), Math.max(x1, C + s * PIL[2]), FY, FY + PAV + D, 0, LOW)
    const M = 5, xa = PIL[2], xb = 24.3
    for (let i = 1; i <= M; i++) {
      const u = xb - ((xb - xa) * (i - 1)) / M
      box(trav, Math.min(C + s * xa, C + s * u), Math.max(C + s * xa, C + s * u), FY + PAV, FY + PAV + D, 0, P + (3.2 * i) / M)
    }
    box(trav, Math.min(C + s * xa, C + s * xb), Math.max(C + s * xa, C + s * xb), FY + PAV + D - 0.4, FY + PAV + D, P, P + 1.0)
    void x0
    // The reclining river god before the flight (Nile on the left, Tiber
    // on the right), on a low plinth.
    const gx = C + s * 8.2, gy = FY + D + 1.4
    box(trav, gx - 2.6, gx + 2.6, gy - 1.0, gy + 1.0, 0, P + 0.8)
    ellipsoid(trav, [gx, gy, P + 1.4], [2.3, 0.9, 0.7], 8, 3)
    ellipsoid(trav, [gx + s * 1.5, gy - 0.1, P + 2.3], [0.6, 0.5, 0.9], 6, 3)
  }
}

// ---------------------------------------------------------------- the tower

{
  // Stages measured on photo 3 (the tower's width W = 6.3 m, from photo 1:
  // the facade balustrade to the tower's balustrade is 2.28 W).
  const TX = C, TY = 7.0, W = 6.3
  const sq = (w: number, z0: number, z1: number, p: Part, b = 0) => box(p, TX - w / 2, TX + w / 2, TY - w / 2, TY + w / 2, z0, z1, b)
  sq(W, EAVE - 2, P + 32.6, brick)
  sq(W + 0.9, P + 32.6, P + 33.3, trav, 0.1)
  sq(W, P + 33.3, P + 38.8, brick)
  sq(W + 1.0, P + 38.8, P + 39.6, trav, 0.15)
  sq(W - 0.2, P + 39.6, P + 40.6, trav)
  sq(1.1, P + 40.6, P + 42.2, trav)
  // The statue on top (Minerva as Roma), and the flagpole.
  body(trav, [[P + 42.2, 0.4, 0.35, TX, TY], [P + 43.4, 0.3, 0.25, TX, TY], [P + 44.0, 0.15, 0.15, TX, TY]], 5)
  sq(0.18, P + 44.0, P + 45.0, dark)
  // Travertine corner pilasters on both stages: they make the slender
  // stripes of photo 3.
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const cx = TX + sx * (W / 2 - 0.3), cy = TY + sy * (W / 2 - 0.3)
    box(trav, cx - 0.4, cx + 0.4, cy - 0.4, cy + 0.4, EAVE + 1.4, P + 32.6)
    box(trav, cx - 0.4, cx + 0.4, cy - 0.4, cy + 0.4, P + 33.3, P + 38.8)
  }
  // On every face: the lower belfry arch with its balustrade, the clock
  // astride the cornice (front and back), the upper belfry arch.
  for (const d of [1, -1] as const) {
    const at = (u: number, v: number): V3 => [u, TY + d * (W / 2 + 0.03), v]
    face(dark, arched(TX, 0.9, P + 27.4, P + 29.9, 6), at, [0, d, 0])
    face(dark, arched(TX, 0.8, P + 34.2, P + 36.4, 6), at, [0, d, 0])
    face(trav, disc(TX, P + 32.9, 1.5, 12), (u, v) => [u, TY + d * (W / 2 + 0.5), v], [0, d, 0])
    box(trav, TX - 1.0, TX + 1.0, TY + d * (W / 2) - 0.1, TY + d * (W / 2) + 0.25, P + 27.4, P + 28.4)
  }
  for (const d of [1, -1] as const) {
    const at = (u: number, v: number): V3 => [TX + d * (W / 2 + 0.03), u, v]
    face(dark, arched(TY, 0.9, P + 27.4, P + 29.9, 6), at, [d, 0, 0])
    face(dark, arched(TY, 0.8, P + 34.2, P + 36.4, 6), at, [d, 0, 0])
  }
}

// ---------------------------------------------------------------- the back

{
  const BY = -23.1
  // The Tabularium: the base and arcade storey up to the piazza's level,
  // a ledge 0.3 m proud of the palace's rear wall (no more: the small
  // building relation/1841130 stands against it); three arches open.
  box(stone, -36.7, 24.7, BY - 0.3, BY + 0.2, 0, P + 0.6, 0.2)
  for (const x of [-0.5, 8.5, 17.5]) face(dark, arched(x, 2.0, 0, P - 3.0, 6), (u, v) => [u, BY - 0.33, v], [0, -1, 0])
  // The rear wall's windows, four storeys.
  for (let x = -32; x <= 21; x += 4.4) for (const z of [P + 2.2, P + 7.4, P + 12.6, P + 17.8]) {
    quad(win, [x - 0.65, BY - 0.04, z], [x + 0.65, BY - 0.04, z], [x + 0.65, BY - 0.04, z + 2.2], [x - 0.65, BY - 0.04, z + 2.2], [0, -1, 0])
  }
  // The Torre di Niccolò V, crenellated, at the east corner.
  const T0 = 24.7, T1 = 34.8, U0 = -23.1, U1 = -13.9, TOP = P + 29.0
  box(stone, T0, T1, U0, U1, 0, TOP)
  for (const [a, b] of [[T0, T0 + 1.6], [(T0 + T1) / 2 - 0.8, (T0 + T1) / 2 + 0.8], [T1 - 1.6, T1]] as const) {
    box(stone, a, b, U0, U0 + 1.0, TOP, TOP + 1.4)
    box(stone, a, b, U1 - 1.0, U1, TOP, TOP + 1.4)
  }
  for (const [a, b] of [[U0 + 1.6, U0 + 3.2], [(U0 + U1) / 2 - 0.8, (U0 + U1) / 2 + 0.8], [U1 - 3.2, U1 - 1.6]] as const) {
    box(stone, T0, T0 + 1.0, a, b, TOP, TOP + 1.4)
    box(stone, T1 - 1.0, T1, a, b, TOP, TOP + 1.4)
  }
  for (const z of [P + 12.6, P + 17.8, P + 23.0]) quad(win, [28.9, U0 - 0.04, z], [30.5, U0 - 0.04, z], [30.5, U0 - 0.04, z + 2.0], [28.9, U0 - 0.04, z + 2.0], [0, -1, 0])
  // Side windows: three storeys along the south-west side.
  for (let y = -18; y <= 0; y += 4.5) for (const z of [P + 7.4, P + 12.6, P + 17.8]) {
    const x = -36.7 + ((y + 23.1) / (4.4 + 23.1)) * (-33.7 + 36.7) - 0.04
    quad(win, [x, y - 0.65, z], [x, y + 0.65, z], [x, y + 0.65, z + 2.2], [x, y - 0.65, z + 2.2], [-1, 0.1, 0])
  }
}

// ---------------------------------------------------------------- write

// Floodlight: the piazza front and the tower, brightest; the back dimmer.
const up = (n: V3) => (n[2] > 0.7 ? 0.4 : 1)
const lit = (k: number) => (p: V3, n: V3) => (p[1] > FY - 2 || Math.hypot(p[0] - C, p[1] - 7) < 6 ? 1 : 0.35) * k * up(n)

console.log({ trav: trav.triangles, render: render.triangles, brick: brick.triangles, win: win.triangles, stone: stone.triangles, dark: dark.triangles })
await save('rome-palazzo-senatorio', 'Palazzo Senatorio', [
  // Colours from photos 1 and 2, pulled to the palette's lightness: warm
  // travertine; the salmon render of the front; the grey-brown of the rear
  // render, the Tabularium's tufa and the corner tower, and of the stair's
  // flanks in shade; the bell tower's red-brown brick, shared by the
  // roof's tiles; dark openings.
  { part: trav, material: { ...finish('campidoglio-travertine', 0xeee3d0), floodlight: lit(1) } },
  { part: render, material: { ...finish('senatorio-render', 0xe3b994), floodlight: lit(0.9) } },
  { part: stone, material: { ...finish('capitol-stone', 0xbcab93), floodlight: lit(0.6) } },
  { part: brick, material: { ...finish('capitol-brick', 0xb98a68), floodlight: lit(0.8) } },
  { part: win, material: PALETTE.window },
  { part: dark, material: finish('senatorio-dark', 0x55504a) },
], { bearing: 304, osm: 'relation/1691910' })
