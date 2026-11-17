/**
 * Irving Convention Center at Las Colinas, Irving (RMJM Hillier, 2011) —
 * procedural, CC0-1.0, no textures.
 * bun generators/dal-irving-convention-center.ts
 *
 * A dark brown podium of slanted, interlocking wall blades, and on it the
 * great box of the exhibit and ballroom levels wrapped in a perforated
 * copper-coloured metal skin. The box is cut away underneath: each face
 * hangs down to the podium in the middle and lifts toward its corners, so
 * every corner is a cantilevered prow, deepest at the south-east over the
 * entrance plaza, and the roof's edge rises toward the north-west and
 * south-east corners.
 *
 * Frame: built turned to bearing 347.5 (model +x along 77.5 degrees, the
 * box's north edge), x' / y' below; z up, metres. Anchor: the area centroid
 * of OSM way/499314166 (building=yes, amenity=conference_centre, 4 levels),
 * which is `replaces`. No building:part inside it.
 *
 * Evidence
 * - Lidar: USGS 3DEP TX_Pecos_Dallas_B3_2018 (2018), 1 m grid,
 *   work/dal-irving-convention-center/lidar.json. Ground 132.4 m, flat to
 *   0.5 m round the building. The box's roof edge is a rectangle
 *   x' -39.3..53.0, y' -49.5..38.3 (92.3 x 87.8 m), roof 36 m over the
 *   ground with the edge rising to 41 m at the north-west and south-east
 *   corners over about 45 m (measured). Podium roofs west and north of the
 *   box, and the north-east wing, 16 to 17 m (measured: 16.5). South of the
 *   box a deck 13 to 15 m up on a block pointed south (measured: 13.5).
 * - Photos (Wikimedia Commons): from the Westin to the south-west (Renanville,
 *   CC0, https://commons.wikimedia.org/wiki/File:City_of_Irving,_Texas_-_Convention_Center.jpg):
 *   the box's prows, the V-shaped lower edges of its south and west faces,
 *   the podium blades, the glass lobby under the box and the deck;
 *   Carol M. Highsmith, public domain
 *   (https://commons.wikimedia.org/wiki/File:The_Irving_Convention_Center_in_Irving,_Texas,_an_upscale_community_in_the_Dallas-Fort_Worth_metroplex_LCCN2015630716.tif
 *   and https://commons.wikimedia.org/wiki/File:The_Irving_Convention_Center_in_Irving,_Texas,_part_of_the_Dallas-Fort_Worth_metroplex_area_LCCN2015630546.tif):
 *   the south face and the south-east overhang in daylight, the colours; Irvingtexas (City of Irving), CC BY-SA 4.0
 *   (https://commons.wikimedia.org/wiki/File:Irving_Convention_Center_Exterior.JPG,
 *   https://commons.wikimedia.org/wiki/File:Outside_Irving_Convention_Center.jpg,
 *   https://commons.wikimedia.org/wiki/File:Irving_Convention_Center_Water_Fountain.JPG,
 *   https://commons.wikimedia.org/wiki/File:Irving_Convention_Center_Exterior_at_Sunrise.jpg):
 *   the south entrance with its glass gable, the soffits, the night look.
 * - NAIP (USGS): the roof and deck in plan.
 *
 * Estimated from the photos (the lidar can't see under the box): the
 * heights of the box's lower edge, 22 m at the south-west and north-west
 * prows, 29 m at the south-east, down to the 16.5 m podium roof toward the
 * middle of each face (the Westin photo and the Highsmith photo, scaled by
 * the lidar's 37 m and 41 m corners); the north-east corner sits on the
 * north-east wing;
 * the core under the box, taken as the box shrunk to 58% about its centre;
 * the blade walls of the south podium (two slanted blades, 14 m falling to
 * 3 m and 4 m rising to 12 m); the glass lobby band 10 to 16 m and the
 * entrance gable's size. Colours from the daylight photos, the copper skin
 * (a muted red-brown, #77635f lit) and the darker brown blades pulled to
 * the palette's lightness. At night the skin carries a floodlight share
 * for the lit hall seen through the mesh, the soffits more, and the lobby
 * glass and the entrance gable glow.
 *
 * Doubts: no licensed photo of the north and east faces close up; their
 * lower edges mirror the west and south ones. The skin's pattern (vertical
 * panel strips, the bracing faintly behind) is left out.
 */
import { Part, type V3 } from './mesh'
import { finishModel, prism, capPoly, type XY, type Facade } from './nyc-570-lexington'
import { face } from './nyc-columbus-monument'
import { PALETTE, finish } from './palette'

const copper = new Part(), dark = new Part(), roof = new Part(), win = new Part(), door = new Part(), deck = new Part()

// OSM way/499314166 in the model frame (bearing 347.5, origin at its area centroid).
const OUTLINE: XY[] = [
  [-3.5, 38.7], [49.1, 39.2], [49.2, 31.0], [53.2, 28.7], [68.7, 19.5], [48.7, -14.0], [48.2, -34.4],
  [48.1, -48.1], [41.0, -48.0], [-40.4, -48.5], [-40.7, -15.0], [-60.4, -7.2], [-55.2, 6.0], [-60.1, 7.9],
  [-51.1, 30.7], [-55.5, 32.4], [-46.3, 55.6],
]

/** Keep the part of a polygon where a*x + b*y + c >= 0 (Sutherland–Hodgman). */
function clip(poly: XY[], a: number, b: number, c: number): XY[] {
  const out: XY[] = [], f = (p: XY) => a * p[0] + b * p[1] + c
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length], fp = f(p), fq = f(q)
    if (fp >= 0) out.push(p)
    if (fp >= 0 !== fq >= 0) { const t = fp / (fp - fq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]) }
  }
  return out.filter((p, i) => Math.hypot(p[0] - out[(i + 1) % out.length][0], p[1] - out[(i + 1) % out.length][1]) > 0.3)
}

// ---------------------------------------------------------------------------
// The box
// ---------------------------------------------------------------------------
const X0 = -39.3, X1 = 53.0, Y0 = -49.5, Y1 = 38.3
const CX = (X0 + X1) / 2, CY = (Y0 + Y1) / 2
const ROOF = 36, LIFT = 5, REACH = 45, POD = 16.5, CORE = 0.58, RIM = 0.8

// Perimeter control points, counter-clockwise from the south-west prow:
// [x', y', lower edge z]. Between them the lower edge runs straight.
const CTRL: [number, number, number][] = [
  [X0, Y0, 22], [-8, Y0, POD], [X1, Y0, 29], // south face
  [X1, 0, POD], [X1, Y1, POD + 0.5], // east face: the south-east prow, then down onto the north-east wing
  [10, Y1, POD], [X0, Y1, 22], // north face
  [X0, -5, POD], // west face, back to the south-west prow
]
const NW: XY = [X0, Y1], SE: XY = [X1, Y0]
const roofZ = (x: number, y: number) => {
  // Perimeter distance to the nearer lifted corner (both lie on the rectangle).
  const along = (c: XY) => (x === c[0] || y === c[1] ? Math.abs(x - c[0]) + Math.abs(y - c[1]) : Infinity)
  const d = Math.min(along(NW), along(SE))
  return ROOF + LIFT * Math.max(0, 1 - d / REACH)
}
// Densify: every control segment into pieces of at most 6 m.
const ring: { p: XY; zb: number }[] = []
for (let i = 0; i < CTRL.length; i++) {
  const a = CTRL[i], b = CTRL[(i + 1) % CTRL.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / 6))
  for (let k = 0; k < n; k++) {
    const t = k / n
    const p: XY = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
    ring.push({ p: [Math.round(p[0] * 1000) / 1000, Math.round(p[1] * 1000) / 1000], zb: a[2] + (b[2] - a[2]) * t })
  }
}
// Snap points that lie on the rectangle exactly onto it, for roofZ.
for (const r of ring) {
  for (const [v, k] of [[X0, 0], [X1, 0], [Y0, 1], [Y1, 1]] as [number, 0 | 1][]) if (Math.abs(r.p[k] - v) < 0.01) r.p[k] = v
}
const inner = (p: XY): XY => [CX + (p[0] - CX) * CORE, CY + (p[1] - CY) * CORE]
const centre: V3 = [CX, CY, 28]
for (let i = 0; i < ring.length; i++) {
  const a = ring[i], b = ring[(i + 1) % ring.length]
  const ta: V3 = [a.p[0], a.p[1], roofZ(a.p[0], a.p[1])], tb: V3 = [b.p[0], b.p[1], roofZ(b.p[0], b.p[1])]
  const ba: V3 = [a.p[0], a.p[1], a.zb], bb: V3 = [b.p[0], b.p[1], b.zb]
  // The skin, from the roof edge down to the lower edge.
  face(copper, ba, bb, tb, ta, [CX, CY, (ta[2] + ba[2]) / 2])
  // The skin stands 1.2 m proud of the roof as a rim; the roof is a fan
  // from its flat middle up toward the lifted corners.
  const pin = (p: XY): XY => { const dx = p[0] - CX, dy = p[1] - CY; return [p[0] - Math.sign(dx) * (Math.abs(Math.abs(p[0] - X0) < 0.01 || Math.abs(p[0] - X1) < 0.01 ? 1 : 0)) * RIM, p[1] - Math.sign(dy) * (Math.abs(p[1] - Y0) < 0.01 || Math.abs(p[1] - Y1) < 0.01 ? 1 : 0) * RIM] }
  const ra = pin(a.p), rb = pin(b.p)
  const qa: V3 = [ra[0], ra[1], ta[2] - 1.2], qb: V3 = [rb[0], rb[1], tb[2] - 1.2]
  face(copper, ta, tb, qb, qa, [CX, CY, ROOF - 5])
  face(dark, qa, qb, [qb[0], qb[1], qb[2] + 1.2], [qa[0], qa[1], qa[2] + 1.2], [a.p[0] * 2 - CX, a.p[1] * 2 - CY, ROOF])
  roof.tri([CX, CY, ROOF - 1.2], qa, qb)
  // The soffit: from the lower edge in and down to the core.
  const ia = inner(a.p), ib = inner(b.p)
  const sa: V3 = [ia[0], ia[1], POD], sb: V3 = [ib[0], ib[1], POD]
  if (a.zb - POD > 0.05 || b.zb - POD > 0.05) face(dark, ba, bb, sb, sa, [CX, CY, 40])
}

// ---------------------------------------------------------------------------
// The podium and the glass lobby under the box
// ---------------------------------------------------------------------------
const coreS = inner([0, Y0])[1], coreE = inner([X1, 0])[0]
const lobby: Facade = { bay: 7, ratio: 0.9, floor: 5, group: 1, spandrel: 0, sill: 10, ground: 10, head: 0.6, minLength: 5 }
const street: Facade = { bay: 9, ratio: 0.8, floor: 3.5, group: 1, spandrel: 0, sill: 0.4, ground: 0.4, head: 12.4, minLength: 8 }
const onLobby = (a: XY, b: XY) =>
  (Math.abs(a[1] - coreS) < 0.2 && Math.abs(b[1] - coreS) < 0.2) || (Math.abs(a[0] - coreE) < 0.2 && Math.abs(b[0] - coreE) < 0.2)
// North and west wings, and the north-east wing beyond the box: OSM north of y' = -12.
const north = clip(OUTLINE, 0, 1, 12)
// The core under the box, between the south lobby and y' = -12, west of the east lobby.
const core = clip(clip(clip(OUTLINE, 0, -1, -12), 0, 1, -coreS), -1, 0, coreE)
for (const r of [north, core])
  prism({ wall: dark, win, roof, ring: r, z0: 0, z1: POD, facade: street, faceFacade: (_i, a, b) => (onLobby(a, b) ? lobby : street) })

/** A slanted blade wall: a box whose top runs from zw at its west end to ze at its east end. */
function blade(x0: number, x1: number, y0: number, y1: number, zw: number, ze: number) {
  const z = (x: number) => zw + ((ze - zw) * (x - x0)) / (x1 - x0)
  const c: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  const mid: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, 1]
  for (let i = 0; i < 4; i++) {
    const a = c[i], b = c[(i + 1) % 4]
    // Split long walls so the map's ground can bend them.
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 5))
    for (let k = 0; k < n; k++) {
      const p: XY = [a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]
      const q: XY = [a[0] + ((b[0] - a[0]) * (k + 1)) / n, a[1] + ((b[1] - a[1]) * (k + 1)) / n]
      face(dark, [p[0], p[1], 0], [q[0], q[1], 0], [q[0], q[1], z(q[0])], [p[0], p[1], z(p[0])], mid)
    }
  }
  const n = Math.ceil((x1 - x0) / 5)
  for (let k = 0; k < n; k++) {
    const a = x0 + ((x1 - x0) * k) / n, b = x0 + ((x1 - x0) * (k + 1)) / n
    face(dark, [a, y0, z(a)], [b, y0, z(b)], [b, y1, z(b)], [a, y1, z(a)], [(a + b) / 2, (y0 + y1) / 2, 0])
  }
}
// The south podium under the box's south-west wing: the front blade falls
// from the south-west corner toward the entrance, the one behind it rises.
blade(-40.4, -3, -48.4, -42, 14, 3)
blade(-40.4, -5, -42, coreS, 4, 12)

// The entrance block south of the box: walls of the dark blades, its top the
// public deck, pointed south, with the glass gable of the main entrance in
// its two south faces.
const DECK = 13.5
const ENTRY: XY[] = [[-5, coreS], [29, coreS], [29, -57], [21.5, -67], [14, -64], [-5, -51]]
prism({ wall: dark, win: null, roof: deck, ring: ENTRY, z0: 0, z1: DECK, facade: null })
{
  // The gable: a glass triangle across the prow, 9 m at its apex.
  const tip: XY = [21.5, -67], w: XY = [14, -64], e: XY = [29, -57]
  const out = (a: XY, b: XY): XY => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[1] - a[1]) / l * 0.06, -(b[0] - a[0]) / l * 0.06] }
  const ow = out(w, tip), oe = out(tip, e)
  const lerp2 = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
  const wl = lerp2(tip, w, 0.98), el = lerp2(tip, e, 0.85)
  door.tri([wl[0] + ow[0], wl[1] + ow[1], 0.3], [tip[0] + ow[0], tip[1] + ow[1], 0.3], [tip[0] + ow[0], tip[1] + ow[1], 9])
  door.tri([tip[0] + oe[0], tip[1] + oe[1], 0.3], [el[0] + oe[0], el[1] + oe[1], 0.3], [tip[0] + oe[0], tip[1] + oe[1], 9])
}

finishModel('Irving Convention Center at Las Colinas', 'dal-irving-convention-center', [
  { part: copper, material: { ...finish('copper-mesh', 0xa8785f), roughness: 0.6, floodlight: (_p, n) => (Math.abs(n[2]) < 0.5 ? 0.45 : 0) } },
  { part: dark, material: { ...finish('copper-dark', 0x846352), floodlight: (_p, n) => (n[2] < -0.3 ? 0.7 : 0) } },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
  { part: deck, material: PALETTE.stone },
], { bearing: 347.5, osm: 'way/499314166', height: 41 }, 5000)
