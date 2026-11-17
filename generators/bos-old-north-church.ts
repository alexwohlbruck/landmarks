/**
 * Old North Church (Christ Church in the City of Boston), 193 Salem Street,
 * North End, Boston (1723; steeple rebuilt 1806, 1955) — original procedural
 * geometry, CC0-1.0.
 * bun generators/bos-old-north-church.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 30: the nave of OSM way/29650592 runs at 120°, so
 * x runs along the nave, the tower at -x on Salem Street (west-north-west)
 * and the apse at +x (east-south-east, toward the Paul Revere Mall).
 * Anchor = the outline's centroid, -71.0544570, 42.3663199.
 *
 * Identity (from the photos below):
 *  1. The tall white steeple, which is the landmark: over the brick tower a
 *     white plinth and balustrade with slender obelisk pinnacles at the
 *     corners, a square belfry with two round-headed louvred openings a
 *     face, a heavy cornice with small pinnacles, a narrower lantern with
 *     one round-headed window a face (where the two lanterns hung in 1775),
 *     and a tall octagonal spire with a gilded ball and vane.
 *  2. A plain square brick tower on Salem Street with a round-headed door,
 *     a big round-headed window over it, the white tablet, an oculus on the
 *     sides and a round-headed window high up; white cornice at the top.
 *  3. A Georgian brick nave with two tiers of round-headed windows, a grey
 *     gabled roof with white cornices, a small apse at the east end.
 *
 * Plan: OSM way/29650592 and its parts, in the turned frame: nave
 * x -9.5..11.3, y ±7.6; tower x -14.84..-7.9, y ±3.45 (part way/240382944);
 * apse to x 14.1 (way/240395586). The steeple stages are centred on the
 * tower (OSM parts 240382950/53, 240382943; the spire part sits on axis).
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021), 0.5 m grid,
 * read with tools/lidar_frame.py; y = 0 is the lowest ground, at the east
 * end (1.0 above the grid's ground_min); Salem Street at the tower is
 * 1.8 up. Measured: nave eaves 12.4, ridge 18.6; brick tower 25.8; the
 * belfry stage to 34.8 incl. cornice; the lantern to 39.7. The lidar
 * outline sits about 1.5 m west and 1 m north of OSM's; OSM's plan is used.
 * Published: the steeple is 191 ft (58.2 m) to the vane (Wikipedia; Old
 * North Church & Historic Site); drawn to 60.0 here, i.e. 58.2 above
 * Salem Street. The spire's own apex (55.5) is from the photo spire
 * (Farragutful) scaled from the belfry.
 *
 * Estimated from the photos: window sizes and positions, stage widths
 * (belfry 5.0 m, lantern 3.5 m, spire base 2.5 m, against the 6.9 m tower,
 * from the Farragutful and Beyond My Ken photos), the pinnacles, the apse.
 * The spire is drawn a little stouter than the real one so it holds at
 * phone size.
 *
 * Ground: Mapterhorn and lidar fall 1.8 m from Salem Street to the east
 * end; elevation 0. The tower door sits at the street (1.8).
 *
 * Night: the steeple is floodlit white; the lantern stage's windows glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Old North Church exterior street.jpg, LEvalyn, CC BY 4.0 (from Salem
 *    St, south-west) https://commons.wikimedia.org/wiki/File:Old_North_Church_exterior_street.jpg
 *  - 2017 Old North Church from Hull Street.jpg, Beyond My Ken, CC BY-SA
 *    4.0 (the tower front, west) https://commons.wikimedia.org/wiki/File:2017_Old_North_Church_from_Hull_Street.jpg
 *  - Old North Church, Boston (2025).jpg, Seasider53, CC BY 4.0 (west
 *    front) https://commons.wikimedia.org/wiki/File:Old_North_Church,_Boston_(2025).jpg
 *  - Old North Church Boston DSC 0815 ad.JPG, Adavyd, CC BY-SA 3.0 (down
 *    Hull St) https://commons.wikimedia.org/wiki/File:Old_North_Church_Boston_DSC_0815_ad.JPG
 *  - Old North Church, Boston, 2023-02-22 01.jpg, Crisco 1492, CC BY-SA 4.0
 *    (from the Paul Revere Mall, south-east)
 *    https://commons.wikimedia.org/wiki/File:Old_North_Church,_Boston,_2023-02-22_01.jpg
 *  - Old North Church exterior.jpg, LEvalyn, CC BY 4.0 (tower, south-west)
 *    https://commons.wikimedia.org/wiki/File:Old_North_Church_exterior.jpg
 *  - Old North Church spire.jpg, Farragutful, CC BY-SA 4.0 (the steeple)
 *    https://commons.wikimedia.org/wiki/File:Old_North_Church_spire.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the long sides are seen only obliquely between houses; five bays
 * of two tiers are drawn on each. The apse and the east end are seen only
 * through trees. The attached brick annex south of the tower (seen in the
 * LEvalyn street photo) is a separate building and not modelled.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, cornice, gableRoof, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'

const brick = new Part(), trim = new Part(), roof = new Part(), win = new Part(), gold = new Part(), door = new Part()

const NX0 = -9.5, NX1 = 11.3, NY = 7.6, EAVE = 12.3, RIDGE = 18.6
const TX0 = -14.84, TX1 = -7.9, TY = 3.45, TC: XY = [(TX0 + TX1) / 2, 0], TTOP = 25.8
const ST = 1.8 // Salem Street at the tower

// ── Nave ──
box(brick, NX0, NX1, -NY, NY, 0, EAVE, null, 0)
cornice(trim, [[NX0, -NY], [NX1, -NY], [NX1, NY], [NX0, NY]], EAVE - 0.45, 0.6, 0.35, null)
gableRoof(roof, brick, NX0, NX1, -NY, NY, EAVE, RIDGE, 'x', 0.45, 0.35)
// The raking cornices of the two gables.
for (const x of [NX0 - 0.4, NX1 + 0.05]) for (const k of [-1, 1]) {
  const sec = (y: number, z: number): V3[] => [[x, y, z], [x + 0.35, y, z], [x + 0.35, y, z - 0.4], [x, y, z - 0.4]]
  trim.sweep([sec(k * (NY + 0.2), EAVE + 0.1), sec(0, RIDGE + 0.15)])
}

// Round-headed windows: white surround, slate panel.
type F = [XY, XY]
function arched(f: F, s: number, z0: number, w: number, zs: number) {
  onWall(trim, f[0], f[1], archShape(s, w + 0.36, z0 - 0.18, zs, 10), 0.04)
  onWall(win, f[0], f[1], archShape(s, w, z0, zs, 10), 0.08)
}
const SOUTH: F = [[NX0, -NY], [NX1, -NY]], NORTH: F = [[NX1, NY], [NX0, NY]], EAST: F = [[NX1, -NY], [NX1, NY]]
const L = NX1 - NX0
for (const f of [SOUTH, NORTH]) for (let k = 0; k < 5; k++) {
  const s = 2.6 + (k * (L - 5.2)) / 4
  arched(f, s, 2.4, 1.3, 4.6)
  arched(f, s, 6.9, 1.5, 10.0)
}
// West front either side of the tower.
for (const [a, b] of [[[NX0, -NY], [NX0, -TY]], [[NX0, TY], [NX0, NY]]] as F[]) {
  const f: F = [b, a] // the outside is -x, so run north to south
  const s = Math.hypot(b[0] - a[0], b[1] - a[1]) / 2
  arched(f, s, 2.4 + ST * 0.6, 1.2, 4.7 + ST * 0.6)
  arched(f, s, 7.2, 1.3, 10.0)
}
// East end: the chancel window over the apse.
arched(EAST, NY, 10.2, 1.4, 12.6)

// ── Apse ──
{
  const prof: [number, number][] = []
  const ring: XY[] = Array.from({ length: 7 }, (_, i) => { const a = -Math.PI / 2 + (i / 6) * Math.PI; return [NX1 + 2.8 * Math.cos(a), 2.8 * Math.sin(a)] as XY })
  for (let i = 0; i < 6; i++) {
    const a = ring[i], b = ring[i + 1]
    brick.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], 8.5], [a[0], a[1], 8.5])
    const c: V3 = [NX1, 0, 10.6], o = (p: XY): V3 => [NX1 + (p[0] - NX1) * 1.12, p[1] * 1.12, 8.3]
    roof.tri(o(a), o(b), c)
    if (i === 1 || i === 4) arched([a, b], Math.hypot(b[0] - a[0], b[1] - a[1]) / 2, 3.0, 0.9, 5.6)
  }
  void prof
}

// ── Tower ──
box(brick, TX0, TX1, -TY, TY, 0, TTOP - 0.6, null, 0)
box(trim, TX0 - 0.25, TX1 + 0.25, -TY - 0.25, TY + 0.25, TTOP - 0.6, TTOP, trim, 0.2)
{
  const W: F = [[TX0, TY], [TX0, -TY]], TS: F = [[TX0, -TY], [NX0, -TY]], TN: F = [[NX0, TY], [TX0, TY]]
  // the door with its fanlight, the big window, the tablet, the high window
  onWall(trim, W[0], W[1], archShape(TY, 2.3, ST, ST + 3.1, 10), 0.05)
  onWall(door, W[0], W[1], rectShape(TY - 0.8, TY + 0.8, ST, ST + 3.0), 0.09)
  onWall(win, W[0], W[1], archShape(TY, 1.6, ST + 3.1, ST + 3.15, 10), 0.09)
  arched(W, TY, 7.5, 1.8, 11.4)
  onWall(trim, W[0], W[1], rectShape(TY - 1.1, TY + 1.1, 14.2, 15.8), 0.06)
  arched(W, TY, 20.0, 1.3, 22.4)
  const R = TX1 - TX0
  for (const f of [TS, TN]) {
    const s = (NX0 - TX0) / 2, ring = (r: number, z: number) => Array.from({ length: 12 }, (_, i) => [s + r * Math.cos((i / 12) * Math.PI * 2), z + r * Math.sin((i / 12) * Math.PI * 2)] as [number, number])
    onWall(trim, f[0], f[1], ring(0.6, 15.0), 0.04)
    onWall(win, f[0], f[1], ring(0.42, 15.0), 0.08)
    arched(f, s, 20.0, 1.2, 22.4)
    void R
  }
  const E: F = [[TX1, -TY], [TX1, TY]]
  arched(E, TY, 20.0, 1.2, 22.4)
}

// ── Steeple ──
const [cx, cy] = TC
const sq = (h: number, z0: number, z1: number, p = trim, bev = 0.12) => box(p, cx - h, cx + h, cy - h, cy + h, z0, z1, p, bev)
const faces = (h: number): F[] => [
  [[cx - h, cy - h], [cx + h, cy - h]], [[cx + h, cy - h], [cx + h, cy + h]],
  [[cx + h, cy + h], [cx - h, cy + h]], [[cx - h, cy + h], [cx - h, cy - h]],
]
/** A slender square obelisk pinnacle with a gilt ball. */
function obelisk(x: number, y: number, z0: number, z1: number, r: number) {
  revolve(trim, [x, y], [[r * 1.3, z0], [r * 1.3, z0 + 0.5], [r, z0 + 0.5], [0, z1]], 4, Math.PI / 4, true, true)
  revolve(gold, [x, y], [[0, z1 - 0.1], [0.2, z1 + 0.1], [0, z1 + 0.35]], 6, 0, true, false)
}
// plinth and balustrade
sq(3.1, TTOP, 27.0)
sq(2.95, 27.0, 27.9, trim, 0.05)
sq(3.1, 27.9, 28.15, trim, 0.06)
for (const [a, b] of faces(2.95)) for (const s of [1.5, 4.4]) onWall(roof, a, b, rectShape(s - 1.05, s + 1.05, 27.15, 27.75), 0.03) // balusters in shadow
for (const sx of [-1, 1]) for (const sy of [-1, 1]) obelisk(cx + sx * 2.8, cy + sy * 2.8, 28.15, 32.3, 0.34)
// belfry: two round-headed louvred openings a face, corner pilasters
sq(2.5, 28.15, 33.0, trim, 0)
for (const [a, b] of faces(2.5)) {
  for (const s of [1.65, 3.35]) {
    onWall(trim, a, b, archShape(s, 1.35, 29.4, 31.55, 10), 0.03)
    onWall(roof, a, b, archShape(s, 1.1, 29.6, 31.55, 10), 0.07)
  }
}
for (const sx of [-1, 1]) for (const sy of [-1, 1]) box(trim, cx + sx * 2.5 - 0.3, cx + sx * 2.5 + 0.3, cy + sy * 2.5 - 0.3, cy + sy * 2.5 + 0.3, 28.15, 33.0, null, 0.08)
// belfry cornice
sq(2.95, 33.0, 33.55, trim, 0.15)
sq(2.7, 33.55, 34.0, trim, 0.1)
for (const sx of [-1, 1]) for (const sy of [-1, 1]) obelisk(cx + sx * 2.35, cy + sy * 2.35, 34.0, 36.6, 0.24)
// lantern: one round-headed window a face
sq(1.75, 34.0, 38.6, trim, 0)
for (const [a, b] of faces(1.75)) {
  onWall(trim, a, b, archShape(1.75, 1.45, 34.7, 37.0, 10), 0.03)
  onWall(win, a, b, archShape(1.75, 1.15, 34.9, 37.0, 10), 0.07)
}
for (const sx of [-1, 1]) for (const sy of [-1, 1]) box(trim, cx + sx * 1.75 - 0.22, cx + sx * 1.75 + 0.22, cy + sy * 1.75 - 0.22, cy + sy * 1.75 + 0.22, 34.0, 38.6, null, 0.06)
sq(2.1, 38.6, 39.0, trim, 0.12)
sq(1.9, 39.0, 39.3, trim, 0.08)
for (const sx of [-1, 1]) for (const sy of [-1, 1]) revolve(trim, [cx + sx * 1.7, cy + sy * 1.7], [[0.22, 39.3], [0.28, 39.6], [0.18, 39.9], [0, 40.3]], 6, 0, true, true)
// octagonal spire
revolve(trim, [cx, cy], [[1.42, 39.3], [1.42, 40.0], [1.32, 40.0], [0.0, 55.5]], 8, Math.PI / 8, true, true)
// gilt ball, rod and vane
revolve(gold, [cx, cy], [[0.08, 55.2], [0.3, 55.55], [0.38, 55.9], [0.3, 56.25], [0.1, 56.5], [0.1, 59.7], [0, 60.0]], 8, 0, true, false)
box(gold, cx - 0.06, cx + 0.06, cy - 0.15, cy + 1.6, 58.3, 58.85, gold, 0)

const lit = (p: V3) => (p[2] > TTOP - 0.7 ? 0.9 : 0)
await save('bos-old-north-church', 'Old North Church', [
  { part: brick, material: finish('onc-brick', 0x9e6050) },
  { part: trim, material: { ...finish('onc-white', 0xf4efe6), floodlight: lit } },
  { part: roof, material: finish('onc-slate', 0x8c959e) },
  { part: win, material: PALETTE.window },
  { part: gold, material: { ...finish('onc-gold', 0xd9b45e), floodlight: () => 0.8 } },
  { part: door, material: finish('onc-door', 0x8f4a3c) },
], { height: 60, anchor: [42.3663199, -71.054457], bearing: 30 })
