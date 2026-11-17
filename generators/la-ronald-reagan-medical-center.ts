/**
 * Ronald Reagan UCLA Medical Center (2008, Pei Cobb Freed & Partners with
 * CO Architects), Westwood — original procedural geometry, CC0-1.0.
 *
 *   bun generators/la-ronald-reagan-medical-center.ts
 *
 * Frame: x east, y north, z up, metres; bearing 0 (the blocks are square
 * to the compass within a degree). Origin at (-118.4463465, 34.06646),
 * 0.5 m from the area centroid of OSM relation/2389785 (outer way
 * 179074944 less the courtyard, way 51125966). The street round the
 * building is level within a metre (109.1 m NAVD88, USGS 3DEP), but the
 * service ramp along the west tower's south side drops about 7 m, and the
 * map stands a model on the lowest ground under it (Mapterhorn: 7.4 m
 * under the street there). So y = 0 is the bottom of that ramp, the walls
 * run down to it everywhere, and every height below is measured from the
 * street and lifted by Z0 = 7.4 m; the facades start at the street.
 *
 * What makes it the Reagan hospital: three ten-storey towers in pale
 * pinkish-grey travertine, crisp rectilinear slabs (the west tower with
 * one big rounded corner), joined by a darker grey
 * stone slab with glass walls; punched window pairs on every floor in the stone, wide gridded
 * windows on the 2nd and 3rd floors and in the link between the towers,
 * joint bands every two storeys; grey mechanical penthouses on top; the entry
 * court on the south side between two towers, with its glass stair shaft
 * and steel struts and the canopy over the main door; notched podiums
 * (the "M" on the south side, the V and the square notch on the north).
 *
 * Evidence
 * - Plan and heights: USGS 3DEP USGS_LPC_CA_LosAngeles_2016_LAS_2018 (2016
 *   flight; the hospital opened in 2008), 1 m grid, read as runs of roof
 *   height per 3 m row. Over the 109.1 m street (add Z0 for the model's
 *   own heights): main roofs 43.6 m (OSM height 43.9), penthouses 49.5 m
 *   (equipment to 52), podiums 19.5 m (23-24 m inside the south notch), a
 *   low link with taller shafts (about 30 m) in the east courtyard; the
 *   glass stair shaft in the south court (38 m) is from r1/r2. Outlines from the same runs: the north block x -48..88,
 *   y 8..50, with a V notch (apex at -16, 26) and a square notch
 *   (x 16..40, y 25..50) whose east side is the north-east tower's rounded
 *   corner (centre 63, 25, radius 23); the slab x -48..16, y -8.5..8; the
 *   courtyard x 16..40, y -8..8 (OSM inner way 51125966); the south block
 *   x -82..52, y -52..-8.5, its west tower rounded at the south-west
 *   (centre -60, -30, radius 22, as the OSM outline), the M notch with a
 *   wedge pointing south (tip at -16, -37), and the south-east tower.
 *   The lidar edges of the north-east tower facing the square notch and
 *   of the south-east tower facing the M notch bend round (radii about 23
 *   and 27 m), but the photos show square corners there, so the model
 *   follows the photos: the north-east tower is squared at x 44 and the
 *   south-east tower at x 18 (the lidar curve runs between x 6 and 32).
 * - OSM relation/2389785 for the outline, which matches the lidar within
 *   2 m. NAIP for the pale roofs, the grey penthouses and the helipads.
 * - Photos (Wikimedia Commons), compared with renders from the same side:
 *   r1 "Ronald Reagan UCLA Medical Center" (Coolcaesar, CC BY 4.0, 2024)
 *      and r2 "UCLA Reagan Medical Center" (Fuzzy901, CC BY-SA 3.0, 2008):
 *      the south entry court (the M notch) from the south-east and
 *      south-west: the west tower with its rounded corner, the main door
 *      and canopy, the glass stair shaft, the struts, the grey penthouses;
 *   r3 and r4 "Ronald Reagan UCLA Medical Center June 2012 001 / 002"
 *      (King of Hearts, CC BY-SA 3.0): the north-east tower (the emergency
 *      entrance) and the grey podium and glass walls along the north street.
 *   URLs: https://commons.wikimedia.org/wiki/File:Ronald_Reagan_UCLA_Medical_Center.jpg
 *   https://commons.wikimedia.org/wiki/File:UCLA_Reagan_Medical_Center.JPG
 *   https://commons.wikimedia.org/wiki/File:Ronald_Reagan_UCLA_Medical_Center_June_2012_001.jpg
 *   https://commons.wikimedia.org/wiki/File:Ronald_Reagan_UCLA_Medical_Center_June_2012_002.jpg
 * - Colour: travertine (#d8cfc7, light pinkish grey-beige) and grey stone
 *   sampled from r1 and r2 in sun and
 *   pulled to the palette's lightness; window glass dark teal-grey; the
 *   curtain walls lighter grey-blue as in r4.
 *
 * Estimated: which faces are grey stone or curtain wall on the sides no
 * photo shows (the west side), the squared corners where the lidar bends,
 * the window bays (7.6 m, a pair of 1.8 x 2.3 m windows a floor, 4.3 m
 * storeys), the joint bands every two storeys,
 * the canopy and strut sizes and positions (from r1, scaled on the 43.6 m
 * roof), the penthouse outlines (lidar extents, drawn as rectangular boxes as the
 * photos show them), Z0 (from the map's terrain, Mapterhorn). Left out: the helipads, the lettering, balconies and fire
 * stairs, louvres, roof equipment.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, ccw, cap, inset, prism, save } from './la-getty-center'
import { beam } from './la-pauley-pavilion'

const trav = new Part(), grey = new Part(), roof = new Part(), metal = new Part(), win = new Part(), curtain = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function oq(p: Part, a: V3, b: V3, c: V3, d: V3, out: V3) {
  if (dot(cross(sub(b, a), sub(c, a)), out) >= 0) p.quad(a, b, c, d)
  else p.quad(a, d, c, b)
}
/** Points on an arc, centre c, radius r, from angle a0 to a1 (degrees), n segments. */
const arc = (c: XY, r: number, a0: number, a1: number, n: number): XY[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)] as XY
  })

/** The street (and the floor the facades start from) over y = 0, the bottom of the south-west ramp. */
const Z0 = 7.4
const ROOF = Z0 + 43.6, PENT = Z0 + 49.5, POD = Z0 + 19.5, BAND = 8.6, FH = 4.3

type Skin = 'trav' | 'grey' | 'glass' | null
/**
 * A block: walls of a ring from 0 to z1, each edge clad as `skin(i)`
 * (null = an internal edge, against another block, left out), with
 * window pairs, joint bands and a coping, and a roof cap.
 */
function block(ring: XY[], z1: number, skin: (i: number, a: XY, b: XY) => Skin, o: { bays?: boolean } = {}) {
  const R = ccw(ring)
  for (let i = 0; i < R.length; i++) {
    const a = R[i], b = R[(i + 1) % R.length]
    const s = skin(i, a, b)
    if (!s) continue
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 0.05) continue
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: V3 = [u[1], -u[0], 0]
    const P = (t: number, z: number, out = 0): V3 => [a[0] + u[0] * t + n[0] * out, a[1] + u[1] * t + n[1] * out, z]
    const wall = s === 'trav' ? trav : s === 'grey' ? grey : curtain
    oq(wall, P(0, 0), P(L, 0), P(L, z1), P(0, z1), n)
    // joint bands every two storeys: proud, grey on travertine, travertine on grey, pale on glass
    const bandPart = s === 'trav' ? grey : s === 'grey' ? trav : PALETTE_TRIM
    for (let z = Z0 + BAND; z < z1 - 2; z += BAND) {
      const z0 = z - 0.2, zt = z + 0.2, d = 0.2
      oq(bandPart, P(0, z0, d), P(L, z0, d), P(L, zt, d), P(0, zt, d), n)
      oq(bandPart, P(0, zt, 0), P(L, zt, 0), P(L, zt, d), P(0, zt, d), [0, 0, 1])
      oq(bandPart, P(0, z0, 0), P(L, z0, 0), P(L, z0, d), P(0, z0, d), [0, 0, -1])
    }
    // the coping
    {
      const z0 = z1 - 0.9, d = 0.3
      oq(bandPart, P(-0.0, z0, d), P(L, z0, d), P(L, z1, d), P(0, z1, d), n)
      oq(bandPart, P(0, z1, 0), P(L, z1, 0), P(L, z1, d), P(0, z1, d), [0, 0, 1])
    }
    if (s === 'glass' || o.bays === false) continue
    // punched window pairs on every floor in the stone (r1, r2), the towers' 2nd and 3rd
    // floors and the podiums' lower floors in wide gridded panels two storeys tall, and a
    // glazed ground floor
    const nb = Math.max(1, Math.round(L / 7.6)), bay = L / nb, podium = z1 < Z0 + 30
    const pane = (c: number, w: number, z0: number, z2: number) =>
      oq(win, P(c - w / 2, z0, 0.05), P(c + w / 2, z0, 0.05), P(c + w / 2, z2, 0.05), P(c - w / 2, z2, 0.05), n)
    for (let k = 0; k < nb; k++) {
      const c = bay * (k + 0.5)
      if (z1 > Z0 + 6) pane(c, bay * 0.76, Z0 + 0.8, Z0 + 3.8)
      const wide = podium ? true : s === 'trav' && nb > 2 && k > 0 && k < nb - 1
      for (let f = 1; Z0 + FH * (f + 1) <= z1 - 1.0; f++) {
        const zf = Z0 + FH * f
        if (wide && f === 1) { pane(c, bay * 0.78, zf + 0.6, zf + 2 * FH - 0.6); continue }
        if (wide && f === 2) continue
        if (bay < 4.5) { pane(c, Math.min(1.8, bay * 0.4), zf + 1.0, zf + 3.3); continue }
        for (const d of [-1.3, 1.3]) pane(c + d, 1.8, zf + 1.0, zf + 3.3)
      }
    }
  }
  cap(roof, R, z1)
}
const PALETTE_TRIM = new Part()

// ---------------------------------------------------------------------------
// The north block and the slab (A), and the north-east tower (B).
const A: XY[] = [[-48, -8.5], [16, -8.5], [16, 8], [44, 8], [44, 25], [16, 25], [16, 50], [1, 50], [-16, 26.5], [-37, 50], [-48, 50]]
const B: XY[] = [[44, 8], [88, 8], [88, 50], [44, 50], [44, 25]]

// The south block: west tower (W), the middle with the wedge (M), the south-east tower (E).
const W: XY[] = [...arc([-60, -30], 22, 180, 270, 6), [-36, -52], [-36, -24.5], [-36, -8.5], [-48, -8.5], [-82, -8.5]]
const M: XY[] = [[-36, -24.5], [-26, -24.5], [-16, -37], [-4, -24.5], [5, -24.5], [5, -8.5], [-36, -8.5]]
const E: XY[] = [[5, -24.5], [18, -24.5], [18, -52], [52, -52], [52, -8.5], [16, -8.5], [5, -8.5]]

const near = (p: XY, q: XY) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 0.1
const isEdge = (a: XY, b: XY, p: XY, q: XY) => (near(a, p) && near(b, q)) || (near(a, q) && near(b, p))

block(A, ROOF, (_, a, b) => {
  if (isEdge(a, b, [-48, -8.5], [16, -8.5]) || isEdge(a, b, [44, 8], [44, 25])) return null
  // the faces round the notches and the courtyard are glass walls (r4)
  if (isEdge(a, b, [16, 25], [44, 25]) || isEdge(a, b, [16, 25], [16, 50]) || isEdge(a, b, [16, -8.5], [16, 8])) return 'glass'
  if (isEdge(a, b, [1, 50], [-16, 26.5]) || isEdge(a, b, [-16, 26.5], [-37, 50])) return 'glass'
  return 'grey'
})
block(B, ROOF, (_, a, b) => (isEdge(a, b, [44, 25], [44, 8]) ? null : 'trav'))
block(W, ROOF, (_, a, b) => (isEdge(a, b, [-36, -24.5], [-36, -8.5]) || isEdge(a, b, [-36, -8.5], [-48, -8.5]) ? null : 'trav'))
block(M, ROOF, (_, a, b) => (isEdge(a, b, [5, -24.5], [5, -8.5]) || isEdge(a, b, [5, -8.5], [-36, -8.5]) || isEdge(a, b, [-36, -8.5], [-36, -24.5]) ? null : 'grey'))
block(E, ROOF, (_, a, b) => (isEdge(a, b, [16, -8.5], [5, -8.5]) || isEdge(a, b, [5, -8.5], [5, -24.5]) ? null : 'trav'))

// ---------- podiums in the notches ----------
block([[-36, -50], [18, -50], [18, -46], [-36, -46]], POD, (_, a, b) => (a[0] <= -35.9 && b[0] <= -35.9 ? null : 'grey'))
block([[-34, -46], [16, -46], [16, -30], [-34, -30]], Z0 + 23.5, () => 'grey', { bays: false })
block([[16, 25], [44, 25], [44, 49.5], [16, 49.5]], POD, (_, a, b) => (a[0] > 43.9 && b[0] > 43.9 ? null : 'grey'))
block([[-37, 49.5], [-16, 27], [1, 49.5]], POD, () => 'grey', { bays: false })
// the east court: a low link
block([[40, -8], [51, -8], [51, 8], [40, 8]], POD, (_, a, b) => (a[1] === 8 && b[1] === 8 ? null : 'grey'))

// ---------- penthouses ----------
// rectangular grey boxes set back from the parapets (r1, r2; lidar for their extent)
const pent = (x0: number, y0: number, x1: number, y1: number) => prism(metal, metal, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], ROOF, PENT, { corner: 0.3, bevel: 0.3 })
pent(51, 14, 82, 44)
pent(-74, -46, -42, -15)
pent(24, -46, 46, -14)
prism(metal, metal, [[-44, -7], [12, -7], [12, 7], [-10, 7], [-10, 14], [-34, 14], [-34, 7], [-44, 7]], ROOF, PENT, { corner: 0.4, bevel: 0.4 })

// ---------- the main entrance in the south court: a sloping canopy on two columns ----------
{
  // from the west tower's south face out over the drop-off and into the court, x -48 to -31,
  // 6-7 m over the street, dipping 1.4 m outwards (r1, r2)
  const x0 = -48, x1 = -31, y0 = -50.5, y1 = -62, zi = Z0 + 7.0, zo = Z0 + 5.6, t = 0.8
  const top: V3[] = [[x0, y0, zi + t], [x0, y1, zo + t], [x1, y1, zo + t], [x1, y0, zi + t]]
  const bot: V3[] = top.map(([x, y, z]) => [x, y, z - t] as V3)
  oq(metal, top[0], top[1], top[2], top[3], [0, -0.1, 1])
  oq(metal, bot[0], bot[1], bot[2], bot[3], [0, 0, -1])
  oq(metal, bot[1], bot[2], top[2], top[1], [0, -1, 0])
  oq(metal, bot[0], bot[1], top[1], top[0], [-1, 0, 0])
  oq(metal, bot[2], bot[3], top[3], top[2], [1, 0, 0])
  for (const x of [x0 + 3, x1 - 3]) beam(metal, [x, y1 + 2, 0], [x, y1 + 2, zo], 0.8)
}

// ---------- the glass stair shaft and the steel struts across the court (r1, r2) ----------
prism(curtain, roof, [[-36, -49], [-30, -49], [-30, -42], [-36, -42]], 0, Z0 + 40, { corner: 0.2, bevel: 0.2 })
for (const [z, dz] of [[Z0 + 27, 4.5], [Z0 + 32, 4.5]] as [number, number][]) beam(metal, [-16.6, -36.6, z], [-29.8, -45, z + dz], 1.5)

if (import.meta.main) {
  // the joint bands on the glass walls are pale trim; fold them into the travertine part
  trav.pos.push(...PALETTE_TRIM.pos); trav.nrm.push(...PALETTE_TRIM.nrm); trav.uv.push(...PALETTE_TRIM.uv)
  save('la-ronald-reagan-medical-center', 'Ronald Reagan UCLA Medical Center', [
    { part: trav, material: finish('reagan-travertine', 0xd8cfc7) },
    { part: grey, material: finish('reagan-grey-stone', 0xa29b93) },
    { part: roof, material: finish('reagan-roof', 0xcfd0cc) },
    { part: metal, material: finish('reagan-metal', 0x8d9296) },
    { part: win, material: { ...PALETTE.window, color: 0x5a6e79 } },
    { part: curtain, material: windowVariant(2, 0x8ea6b6) },
  ], { bearing: 0, elevation: 0, height: PENT, replaces: ['relation/2389785'] }, 6500)
}
