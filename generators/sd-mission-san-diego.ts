/**
 * Mission Basilica San Diego de Alcalá, Mission Valley, San Diego: the
 * first of the California missions (founded 1769; this church 1813, rebuilt
 * 1931 to the 1813 form; minor basilica 1976). A long whitewashed adobe nave
 * under a red tile roof; on its south-west end the white facade with its
 * curved Mission-style espadaña over an arched door and a slit window; beside
 * it, the signature campanario, a stepped bell wall of three tiers with
 * five bells in round-arched openings (two, two, one) under a curved cap and
 * a cross, standing on a thick buttressed base; the tile-roofed convento
 * wings round the garden to the north-west, the sanctuary and sacristy
 * behind, and the long low arcade wing running south-east along the front.
 * Original procedural geometry, CC0-1.0.   bun generators/sd-mission-san-diego.ts
 *
 * Frame: bearing 43 (the nave's axis, from OSM and NAIP). +y runs up the nave
 * towards the altar (north-east); the facade faces -y (south-west); +x is
 * south-east. x right, z up, metres; origin at the lead's anchor -117.10631,
 * 32.78479 (in the garden beside the nave).
 *
 * Ground: the site falls gently to the south-east and the south-west. y = 0 is
 * the lowest ground under the footprint, at the far (south-east) end of the
 * arcade wing (map terrain, Mapterhorn). The ground in front of the facade
 * is G = 1.5 above that; behind the sanctuary about 4 m. Every height below is
 * "above the ground in front of the facade" plus G. Elevation 0.
 *
 * Evidence
 * - OSM relation/14963099 (building=church, "Mission Basilica San Diego de
 *   Alcala", outers way/159783715 and way/1119076942): in this frame the nave
 *   x 1..13, y -32..21; the sanctuary and sacristy x 0..12, y 21..39; the
 *   north-west wing x -29..0, y 2..28; the west wing x -22..-18, y -29..2; the
 *   campanario and its base x -5.5..1, y -37..-30. way/1119076942 closes the
 *   garden court (x -18..1, y -27..3), which is open and not drawn.
 *   way/1119076937 (building=yes): the arcade wing south-east of the facade,
 *   a block x 16..32, y -40..-23 and the arcade x 32..75, y -40..-35.
 *   Not replaced: way/133172500 (a modern flat-roofed building west of the
 *   garden) and relation/1789750 (the school).
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014, 0.5 m grid in this frame
 *   (~/landmarks-scratch/sd/work/sd-mission-san-diego/lidar.json), heights
 *   above the ground in front of the facade (lidar 5.8 m over the box's
 *   ground_min): nave eaves 9.4 and ridge 10.8 (the ridge along x = 7); the
 *   north-west wing 6.5-8.3; the west wing 4.5-5.7; the sanctuary block 5-6.3;
 *   the arcade wing block 4.4-5.9, the arcade about 3 (on lower ground). The
 *   campanario's top reads 16-16.6 (cap and cross are thinner than the grid).
 *   Round 1 of this model added the front ground twice and drew every roof
 *   1.5 m too high, so the nave roof stood above the espadaña in a front
 *   view; round 2 corrects all of them.
 * - USGS NAIP (2022): the red tile roofs, the garden, the white campanario
 *   strip at the facade.
 * - Published (Wikipedia "Mission San Diego de Alcalá"; NRHP/NHL listing):
 *   founded 16 July 1769, moved to this site 1774, church of 1813, restored
 *   1931, campanario of five bells, basilica 1976.
 * - Photos (Wikimedia Commons), all EVIDENCE:
 *   "Mission San Diego de Alcalá - church.jpg" (Bernard Gagnon, CC BY-SA 3.0,
 *     2013): the front face-on: facade, espadaña, door, window, campanario
 *     tiers, the low buttress wall, the side walls;
 *   "San-diego-mission-church.JPG" (Dmadeo, CC BY-SA 3.0, 2008): the front,
 *     the campanario's tiers and openings, used for the proportions below;
 *   "San Diego Mission de Alcala.jpg" (DonnaAmisDavis, CC BY-SA 3.0, 2013):
 *     the espadaña's curves and the door surround;
 *   "Mission Basilica San Diego de Alcalá 2019b.jpg" (Antony-22, CC BY-SA
 *     4.0): the campanario from the garden side and the nave's side wall;
 *   "Mission Basilica San Diego de Alcalá 2019a.jpg" (Antony-22, CC BY-SA
 *     4.0): the long arcade wing and its tile roof from the south;
 *   the 2019 interior set (Antony-22, 2019d-f) for the nave's window rhythm.
 *
 * Proportions from the Dmadeo photo, scaled so the campanario's cap is 16.5
 * (lidar ~16): base to 6.8; tier one (two openings 1.7 m wide, 7.4 to 10.0)
 * to 11.2; tier two (two, 1.2 m, 11.4-12.9) to 13.6; tier three (one,
 * 1.0 m, 13.8-15.0) to 15.7; cap 16.5; cross to 18.2. Widths 6.6, 5.3, 2.9.
 * Facade: 12.5 wide, shoulders 11.6, crown 14.0; door 2.4 x 4.4; slit
 * window 0.9 x 2.6 at 7.4. Buttress wall in front of the campanario base
 * 6.3.
 * So the espadaña (crown 14.0, shoulders 11.6) stands 3.2 m clear of the nave
 * ridge (10.8), as in the photos, and is the highest point of the church
 * front; the campanario rises above it.
 * Made bolder for phone size (STYLE.md: signature features get bolder): the
 * campanario's tiers step in harder than measured (7.6, 5.2, 3.0 m wide,
 * against 6.6, 5.3, 2.9), with deeper cornices (0.35 m) at each step; the
 * upper tiers are 0.2-0.8 m taller (cap 17.6 instead of 16.5, cross to 19.5);
 * the openings are 2.0, 1.5 and 1.3 m wide and the bells about 1.3 times
 * real size.
 *
 * Doubts: the north-east end and the convento wings' garden faces are from
 * the aerial only; the external stair on the nave's side is left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, lathe, prism, report, writeGlb, type XY } from './sf-de-young'
import { panel, arched } from './sf-opera-house'

const white = new Part(), tile = new Part(), dark = new Part(), bronze = new Part(), wood = new Part()

const G = 1.5

/** A gable roof over a rectangle, ridge along y (or x), with eaves overhang. */
function gableY(x0: number, x1: number, y0: number, y1: number, zEave: number, zRidge: number, o = 0.6, ends = true) {
  const xm = (x0 + x1) / 2
  const a: V3 = [x0 - o, y0 - o, zEave - 0.2], b: V3 = [x0 - o, y1 + o, zEave - 0.2], c: V3 = [xm, y1 + o, zRidge], d: V3 = [xm, y0 - o, zRidge]
  const e: V3 = [x1 + o, y0 - o, zEave - 0.2], f: V3 = [x1 + o, y1 + o, zEave - 0.2]
  tile.quad(a, d, c, b)
  tile.quad(e, f, c, d)
  // undersides
  tile.quad(a, b, f, e)
  if (ends) {
    // gable walls (white) at both ends
    white.tri([x0, y0, zEave], [x1, y0, zEave], [xm, y0, zRidge - 0.15])
    white.tri([x1, y1, zEave], [x0, y1, zEave], [xm, y1, zRidge - 0.15])
  }
}
function gableX(x0: number, x1: number, y0: number, y1: number, zEave: number, zRidge: number, o = 0.6) {
  const ym = (y0 + y1) / 2
  const a: V3 = [x0 - o, y0 - o, zEave - 0.2], b: V3 = [x1 + o, y0 - o, zEave - 0.2], c: V3 = [x1 + o, ym, zRidge], d: V3 = [x0 - o, ym, zRidge]
  const e: V3 = [x0 - o, y1 + o, zEave - 0.2], f: V3 = [x1 + o, y1 + o, zEave - 0.2]
  tile.quad(a, b, c, d)
  tile.quad(e, d, c, f)
  tile.quad(a, e, f, b)
  white.tri([x0, y1, zEave], [x0, y0, zEave], [x0, ym, zRidge - 0.15])
  white.tri([x1, y0, zEave], [x1, y1, zEave], [x1, ym, zRidge - 0.15])
}
const wallsBox = (x0: number, x1: number, y0: number, y1: number, z1: number) => prism(white, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 0, z1, null)

// ---------------------------------------------------------------------------
// The nave: whitewashed walls to the eaves, a low-pitched tile roof; small
// deep windows high on the side walls.
const NAVE = { x0: 1, x1: 13, y0: -31, y1: 21 }
wallsBox(NAVE.x0, NAVE.x1, NAVE.y0, NAVE.y1, G + 9.4)
gableY(NAVE.x0, NAVE.x1, NAVE.y0 + 1.0, NAVE.y1, G + 9.4, G + 10.8, 0.6)
for (let y = -22; y <= 14; y += 7.2) {
  panel(dark, [NAVE.x1, y - 0.5], [NAVE.x1, y + 0.5], [1, 0], G + 6.8, G + 8.6, 0.06)
  panel(dark, [NAVE.x0, y - 0.5], [NAVE.x0, y + 0.5], [-1, 0], G + 6.8, G + 8.6, 0.06)
}
// buttresses along the south-east side (white, stepped tops)
for (const y of [-18, -4, 10]) box(white, [NAVE.x1 + 0.9, y, (G + 6.5) / 2], 0.9, 0.9, (G + 6.5) / 2, 0)

// Sanctuary and sacristy behind, lower, under their own tile roofs.
wallsBox(1, 12.6, 21, 30, G + 5.0)
gableX(1, 12.6, 21, 30, G + 5.0, G + 6.2, 0.5)
wallsBox(0, 12, 30, 39, G + 5.1)
gableY(0, 12, 30, 39, G + 5.1, G + 6.3, 0.5)

// The convento wings round the garden: the north-west wing (y 2..25) and
// the narrow west wing (x -22..-18), with a deep shaded corridor (arcade)
// facing the garden.
wallsBox(-29, 0, 3, 25, G + 6.5)
gableX(-29, 0, 3, 25, G + 6.5, G + 8.3, 0.6)
wallsBox(-22, -18, -29, 3, G + 4.5)
gableY(-22, -18, -29, 3, G + 4.5, G + 5.7, 0.5)
// arcades on the garden faces: arched openings as dark recesses
for (let x = -16; x <= -2; x += 3.2) arched(dark, [x - 1.1, 3], [x + 1.1, 3], [0, -1], G + 0.2, G + 3.2, 0.06)
for (let y = -26; y <= 0; y += 3.2) arched(dark, [-18, y - 1.1], [-18, y + 1.1], [1, 0], G + 0.2, G + 3.2, 0.06)

// ---------------------------------------------------------------------------
// The facade: a slab across the nave's front with the curved espadaña.
const FX0 = 0.5, FX1 = 13.5, FY = -32.6, FT = 1.6 // front face y, thickness
const FC = (FX0 + FX1) / 2, FH = (FX1 - FX0) / 2
/** The espadaña's top edge at u (-1..1 across the facade). */
function crest(u: number) {
  const a = Math.abs(u)
  if (a > 0.68) return G + 11.6
  // centre hump (a round crown) over a pair of concave-convex scrolls
  if (a < 0.3) return G + 14.0 - 0.9 * (a / 0.3) ** 2
  // scroll: from 13.1 at a = .3 down to 11.6 at a = .68, with a small step
  const t = (a - 0.3) / 0.38
  return G + 11.6 + 1.5 * (0.5 + 0.5 * Math.cos(Math.PI * t)) + 0.35 * Math.sin(Math.PI * t * 2) * (1 - t)
}
{
  const N = 26
  const us = Array.from({ length: N + 1 }, (_, i) => -1 + (2 * i) / N)
  const X = (u: number) => FC + u * FH
  for (let i = 0; i < N; i++) {
    const u0 = us[i], u1 = us[i + 1], z0 = crest(u0), z1 = crest(u1)
    // front (faces -y), back (+y), top
    white.quad([X(u0), FY, 0], [X(u1), FY, 0], [X(u1), FY, z1], [X(u0), FY, z0])
    white.quad([X(u1), FY + FT, 0], [X(u0), FY + FT, 0], [X(u0), FY + FT, z0], [X(u1), FY + FT, z1])
    white.quad([X(u0), FY, z0], [X(u1), FY, z1], [X(u1), FY + FT, z1], [X(u0), FY + FT, z0])
  }
  // ends
  white.quad([FX1, FY, 0], [FX1, FY + FT, 0], [FX1, FY + FT, crest(1)], [FX1, FY, crest(1)])
  white.quad([FX0, FY + FT, 0], [FX0, FY, 0], [FX0, FY, crest(-1)], [FX0, FY + FT, crest(-1)])
  // the arched door (wood) in a white surround, the slit window over it,
  // and a cornice line under the window
  box(white, [FC, FY - 0.25, G + 2.6], 2.0, 0.25, 2.6)
  arched(wood, [FC - 1.2, FY - 0.5], [FC + 1.2, FY - 0.5], [0, -1], G, G + 4.4, 0.02)
  panel(dark, [FC - 0.45, FY], [FC + 0.45, FY], [0, -1], G + 7.4, G + 10.0, 0.04)
  box(white, [FC, FY - 0.15, G + 6.0], 3.4, 0.15, 0.18)
  // four short pilaster strips flanking the window, as in the photos
  for (const dx of [-2.2, -1.4, 1.4, 2.2]) box(white, [FC + dx, FY - 0.12, G + 7.3], 0.18, 0.12, 0.9)
}

// ---------------------------------------------------------------------------
// The campanario: a stepped wall with real arched openings and the bells
// hung in them. Built tier by tier: sill wall, piers, spandrels with true
// semicircular arch heads, a cornice on each step.
const CX = -2.25, CY0 = -33.8, CY1 = -30.8 // centre x, front and back faces
type Op = { xc: number; w: number; zb: number; zc: number }
/** A wall slab x0..x1, z0..z1 between CY0 and CY1, pierced by arched openings. */
function pierced(x0: number, x1: number, z0: number, z1: number, ops: Op[]) {
  const slab = (xa: number, xb: number, za: number, zb: number) => {
    if (xb - xa < 0.01 || zb - za < 0.01) return
    box(white, [(xa + xb) / 2, (CY0 + CY1) / 2, (za + zb) / 2], (xb - xa) / 2, (CY1 - CY0) / 2, (zb - za) / 2)
  }
  const zb = Math.min(...ops.map((o) => o.zb)), zt = Math.max(...ops.map((o) => o.zc))
  slab(x0, x1, z0, zb) // sill
  slab(x0, x1, zt, z1) // above the crowns
  // piers between openings, from sill to crown height
  const edges = [x0, ...ops.flatMap((o) => [o.xc - o.w / 2, o.xc + o.w / 2]), x1]
  for (let k = 0; k < edges.length; k += 2) slab(edges[k], edges[k + 1], zb, zt)
  // arch heads: fill between the semicircle and the crown line, both faces,
  // and the intrados soffit
  const seg = 8
  for (const o of ops) {
    const r = o.w / 2, zs = o.zc - r
    const pt = (i: number): XY => { const t = Math.PI - (Math.PI * i) / seg; return [o.xc + r * Math.cos(t), zs + r * Math.sin(t)] }
    for (let i = 0; i < seg; i++) {
      const p = pt(i), q = pt(i + 1)
      const cx = i < seg / 2 ? o.xc - r : o.xc + r // corner the fan hangs from
      const corner: XY = [cx, o.zc]
      // front face (-y)
      white.tri([p[0], CY0, p[1]], [q[0], CY0, q[1]], [corner[0], CY0, corner[1]])
      // back face (+y)
      white.tri([q[0], CY1, q[1]], [p[0], CY1, p[1]], [corner[0], CY1, corner[1]])
      // soffit, facing down into the opening
      white.quad([p[0], CY1, p[1]], [q[0], CY1, q[1]], [q[0], CY0, q[1]], [p[0], CY0, p[1]])
    }
    // the middle triangle under the crown between the two fans
    const m = pt(seg / 2)
    white.tri([o.xc - r, CY0, o.zc], [m[0], CY0, m[1]], [o.xc + r, CY0, o.zc])
    white.tri([o.xc + r, CY1, o.zc], [m[0], CY1, m[1]], [o.xc - r, CY1, o.zc])
    // the bell, hung under the arch: a smooth bronze bell and a dark yoke
    const bs = o.w > 1.5 ? 0.75 : 0.55
    const top = zs - 0.05, yb = (CY0 + CY1) / 2
    lathe(bronze, [[0.02, top - bs * 1.55], [bs, top - bs * 1.5], [bs * 0.82, top - bs * 1.2], [bs * 0.6, top - bs * 0.45], [bs * 0.45, top - bs * 0.1], [0.01, top]], 10, [o.xc, yb])
    box(wood, [o.xc, yb, top + 0.12], 0.08, (CY1 - CY0) / 2, 0.12)
  }
}
const cornice = (x0: number, x1: number, z: number) => box(white, [(x0 + x1) / 2, (CY0 + CY1) / 2, z + 0.15], (x1 - x0) / 2 + 0.35, (CY1 - CY0) / 2 + 0.35, 0.2)
// base wall
box(white, [CX, (CY0 + CY1) / 2, (G + 6.8) / 2], 3.8, (CY1 - CY0) / 2, (G + 6.8) / 2)
// tier one: 6.6 wide, two openings
pierced(CX - 3.8, CX + 3.8, G + 6.8, G + 11.4, [{ xc: CX - 1.85, w: 2.0, zb: G + 7.3, zc: G + 10.3 }, { xc: CX + 1.85, w: 2.0, zb: G + 7.3, zc: G + 10.3 }])
cornice(CX - 3.8, CX + 3.8, G + 11.4)
// tier two: 5.3 wide, two openings
pierced(CX - 2.6, CX + 2.6, G + 11.8, G + 14.2, [{ xc: CX - 1.25, w: 1.5, zb: G + 11.9, zc: G + 13.6 }, { xc: CX + 1.25, w: 1.5, zb: G + 11.9, zc: G + 13.6 }])
cornice(CX - 2.6, CX + 2.6, G + 14.2)
// tier three: 2.9 wide, one opening
pierced(CX - 1.5, CX + 1.5, G + 14.6, G + 16.5, [{ xc: CX, w: 1.3, zb: G + 14.55, zc: G + 15.95 }])
cornice(CX - 1.6, CX + 1.6, G + 16.5)
// the cap: a curved (segmental) top and the cross
{
  const n = 8, x0 = CX - 1.6, x1 = CX + 1.6, z0 = G + 16.8
  const zc = (u: number) => z0 + 0.8 * Math.sqrt(Math.max(0, 1 - u * u))
  for (let i = 0; i < n; i++) {
    const u0 = -1 + (2 * i) / n, u1 = -1 + (2 * (i + 1)) / n
    const xa = CX + u0 * 1.6, xb = CX + u1 * 1.6
    white.quad([xa, CY0, z0], [xb, CY0, z0], [xb, CY0, zc(u1)], [xa, CY0, zc(u0)])
    white.quad([xb, CY1, z0], [xa, CY1, z0], [xa, CY1, zc(u0)], [xb, CY1, zc(u1)])
    white.quad([xa, CY0, zc(u0)], [xb, CY0, zc(u1)], [xb, CY1, zc(u1)], [xa, CY1, zc(u0)])
  }
  void x0; void x1
  box(white, [CX, (CY0 + CY1) / 2, z0 - 0.1], 1.6, (CY1 - CY0) / 2, 0.15)
  box(wood, [CX, (CY0 + CY1) / 2, G + 17.6 + 0.95], 0.16, 0.16, 0.95)
  box(wood, [CX, (CY0 + CY1) / 2, G + 18.85], 0.6, 0.16, 0.16)
}
// The buttressed base wall in front of the campanario, its top falling
// towards the front.
{
  const x0 = CX - 3.8, x1 = 0.5, yb = CY0, yf = -37
  const zb = G + 6.3, zf = G + 4.6
  const P: V3[] = [[x0, yf, 0], [x1, yf, 0], [x1, yb, 0], [x0, yb, 0]]
  white.quad(P[0], P[1], [x1, yf, zf], [x0, yf, zf])
  white.quad(P[1], P[2], [x1, yb, zb], [x1, yf, zf])
  white.quad(P[3], P[0], [x0, yf, zf], [x0, yb, zb])
  white.quad([x0, yf, zf], [x1, yf, zf], [x1, yb, zb], [x0, yb, zb])
}
// Low wall linking the facade to the arcade wing (south-east).
prism(white, [[13.5, -33], [16, -33], [16, -31], [13.5, -31]], 0, G + 5.8, white)

// ---------------------------------------------------------------------------
// The arcade wing along the front to the south-east: a block, then a long
// low wing whose garden-side arcade is a row of dark arched openings.
wallsBox(16, 32, -40, -23, G + 4.4)
gableX(16, 32, -40, -23, G + 4.4, G + 5.9, 0.6)
wallsBox(32, 75, -40, -35, 3.4)
gableX(32, 75, -40, -35, 3.4, 4.5, 0.6)
for (let x = 34; x <= 73; x += 3.0) arched(dark, [x - 1.0, -40], [x + 1.0, -40], [0, -1], 0.4, G + 2.6, 0.06)

// ---------------------------------------------------------------------------
const lit = (p: V3, n: V3) => (n[1] < -0.5 && p[1] < -29 && p[0] < 14 ? 0.85 : n[2] > 0.7 ? 0.05 : 0.2)
const parts = [
  { part: white, material: { ...finish('mission-whitewash', 0xf4efe4), floodlight: lit } },
  { part: tile, material: finish('mission-red-tile', 0xb8664a) },
  { part: dark, material: finish('mission-deep-recess', 0x5a5149) },
  { part: bronze, material: finish('bell-bronze', 0x6b6a4e) },
  { part: wood, material: finish('mission-dark-wood', 0x6a4a36) },
]
const glb = writeGlb('Mission Basilica San Diego de Alcalá', parts, {
  license: 'CC0-1.0', bearing: 43, elevation: 0, anchor: [32.78479, -117.10631],
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['relation/14963099', 'way/1119076937'],
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report('Mission San Diego', parts, glb, 5000)
const out = new URL('../models/sd-mission-san-diego.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
