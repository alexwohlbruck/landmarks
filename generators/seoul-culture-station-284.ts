/**
 * Culture Station Seoul 284 (문화역서울 284), the old Seoul Station
 * (Keijō Station, 1925, Tsukamoto Yasushi): procedural, CC0-1.0.
 * bun generators/seoul-culture-station-284.ts
 *
 * Frame: bearing 0 (the outline's edges run within 1 degree of the
 * compass), model +x east, +y north. The station fronts east onto Seoul
 * Station Plaza; its axis runs through the dome at OSM-local y = -12.6.
 * Origin at the area centroid of the outline (OSM way/759569673); y = 0 is
 * the plaza. Elevation 0. Terrain could not be checked (no z15 tiles over
 * Seoul); the plaza is level in the photos.
 *
 * OSM: way/759569673 (3 levels) traces the whole: the main block from
 * OSM-local y -49.7 to 24.5, its front at x 7.3 with the central pavilion
 * out to 15.2, the porch to 19, the end pavilions to 11-13; the low annex
 * to the south (y -69 to -50); and the later one-and-a-half-storey annex to
 * the north, way/1103628080 (building:part), which is left to the map.
 * Published: built 1922-1925, red brick and granite, two storeys with a
 * basement, a Byzantine-style dome over the central hall; Historic Site 284
 * (Wikipedia, "Culture Station Seoul 284").
 *
 * From the photos, scaled to the 74 m main block (k4, level and frontal):
 * - the main cornice at 13.2 m, the mansard roof to 17.5 m with dormers;
 *   the end pavilions under their own steep roofs with round-arched gables
 *   rising to 18.5 m (k3, k4);
 * - the central pavilion: a great round-arched window over the clock and
 *   the porch, its arch rising above the cornice, two small domed turrets
 *   on its corners to 19.5 m (k3, k4);
 * - the dome: a square drum with a semicircular lunette on each face up to
 *   21.5 m, the green copper dome 12 m across to 25.5 m, a lantern to
 *   28.8 m (k3, k4);
 * - behind the dome the central hall's barrel roof, ending at the rear in
 *   a great fan window (k5, k6, from the rear);
 * - red brick with granite bands, quoins and window surrounds, a granite
 *   plinth; slate-grey roofs; green copper dome and turret caps.
 * Estimated: all heights, the dome's position in depth (over the hall,
 * 4 m behind the front wall), window counts and sizes, the dormers. The
 * plan is made symmetric about the dome's axis (the OSM end pavilions are
 * 9.5 and 11 m wide; both drawn 10 m).
 * Left out: the clock's hands, the lamps, the sign, the statue.
 *
 * Night: brick and granite floodlit (_FLOODLIGHT, k12); windows `window`.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - k3 "Old-Seoul-station-20181122-072336.jpg", LERK, CC BY-SA 4.0 (front, from above, north-east)
 *   https://commons.wikimedia.org/wiki/File:Old-Seoul-station-20181122-072336.jpg
 * - k4 "Old Seoul Station - 1998.jpg", Yusuke Kawasaki, CC BY 2.0 (front, level, distant)
 *   https://commons.wikimedia.org/wiki/File:Old_Seoul_Station_-_1998.jpg
 * - k2 "Old Seoul Station.jpg", 콩가루, CC BY-SA 4.0 (front)
 *   https://commons.wikimedia.org/wiki/File:Old_Seoul_Station.jpg
 * - k5 "KNR-Seoul-Station-old-other-side-over-view.JPG", Kanchi1979, CC BY 2.5 (rear, from above)
 *   https://commons.wikimedia.org/wiki/File:KNR-Seoul-Station-old-other-side-over-view.JPG
 * - k6 "KNR-Seoul-Station-old-other-side-over-view-center-hall.JPG", Kanchi1979, CC BY 2.5 (rear hall)
 *   https://commons.wikimedia.org/wiki/File:KNR-Seoul-Station-old-other-side-over-view-center-hall.JPG
 * - k12 "Old Seoul Station at night 01.JPG", Abasaa, public domain (night)
 *   https://commons.wikimedia.org/wiki/File:Old_Seoul_Station_at_night_01.JPG
 * No look-only references used.
 * Doubts: the ends and the rear are only seen obliquely from above; the
 * dome's depth position is estimated; heights rest on photo scaling.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { abox, disc, save, type P2 } from './seoul-city-hall'
import { face, flat, flatTri, lathe } from './seoul-n-seoul-tower'

const brick = new Part(), stone = new Part(), slate = new Part(), copper = new Part(), win = new Part()

const YC = -12.6 // the axis
const XR = -8.4, XF = 7.3 // rear and front walls of the main block
const Y0 = YC - 37.1, Y1 = YC + 37.1 // its ends
const ZC = 13.2 // the main cornice

/** A window panel facing +x or -x (s) at x, centred on y, with an optional round head. */
function winX(s: 1 | -1, x: number, y: number, w: number, z0: number, z1: number, round = false) {
  const X = x + s * 0.07, h = w / 2
  flat(win, [[X, y - h, z0], [X, y + h, z0], [X, y + h, z1], [X, y - h, z1]], [s, 0, 0])
  if (round) for (let k = 0; k < 6; k++) {
    const a0 = (k / 6) * Math.PI, a1 = ((k + 1) / 6) * Math.PI
    flatTri(win, [X, y, z1], [X, y + h * Math.cos(a0), z1 + h * Math.sin(a0)], [X, y + h * Math.cos(a1), z1 + h * Math.sin(a1)], [s, 0, 0])
  }
}
/** A semicircular face in the plane x = const, facing s, centred (y, z), radius r, from angle 0 to pi. */
function halfDisc(p: Part, s: 1 | -1, x: number, y: number, z: number, r: number, k = 10) {
  for (let i = 0; i < k; i++) {
    const a0 = (i / k) * Math.PI, a1 = ((i + 1) / k) * Math.PI
    flatTri(p, [x, y, z], [x, y + r * Math.cos(a0), z + r * Math.sin(a0)], [x, y + r * Math.cos(a1), z + r * Math.sin(a1)], [s, 0, 0])
  }
}
/** The same in the plane y = const, facing t. */
function halfDiscY(p: Part, t: 1 | -1, y: number, x: number, z: number, r: number, k = 10) {
  for (let i = 0; i < k; i++) {
    const a0 = (i / k) * Math.PI, a1 = ((i + 1) / k) * Math.PI
    flatTri(p, [x, y, z], [x + r * Math.cos(a0), y, z + r * Math.sin(a0)], [x + r * Math.cos(a1), y, z + r * Math.sin(a1)], [0, t, 0])
  }
}
/** A barrel vault along x from xa to xb, axis at (y, z), radius r: the top half of a cylinder. */
function barrel(p: Part, xa: number, xb: number, y: number, z: number, r: number, k = 10) {
  for (let i = 0; i < k; i++) {
    const a0 = (i / k) * Math.PI, a1 = ((i + 1) / k) * Math.PI
    const n0: V3 = [0, Math.cos(a0), Math.sin(a0)], n1: V3 = [0, Math.cos(a1), Math.sin(a1)]
    face(p, [[xa, y + r * n0[1], z + r * n0[2]], [xb, y + r * n0[1], z + r * n0[2]], [xb, y + r * n1[1], z + r * n1[2]], [xa, y + r * n1[1], z + r * n1[2]]], [n0, n0, n1, n1])
  }
}
/** A mansard: a steep lower slope from the eave ring inward by `ins` to z1, then a flat top. Axis-aligned rectangle. */
function mansard(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, ins: number, skip = '') {
  const a: V3 = [x0, y0, z0], b: V3 = [x1, y0, z0], c: V3 = [x1, y1, z0], d: V3 = [x0, y1, z0]
  const A: V3 = [x0 + ins, y0 + ins, z1], B: V3 = [x1 - ins, y0 + ins, z1], C: V3 = [x1 - ins, y1 - ins, z1], D: V3 = [x0 + ins, y1 - ins, z1]
  const k = ins, h = z1 - z0
  if (!skip.includes('s')) flat(slate, [a, b, B, A], [0, -h, k])
  if (!skip.includes('e')) flat(slate, [b, c, C, B], [h, 0, k])
  if (!skip.includes('n')) flat(slate, [c, d, D, C], [0, h, k])
  if (!skip.includes('w')) flat(slate, [d, a, A, D], [-h, 0, k])
  flat(slate, [A, B, C, D], [0, 0, 1])
}
/** A small gabled dormer on a mansard's east (s=1) or west slope: front at x, centred on y. */
function dormer(s: 1 | -1, x: number, y: number, z0: number) {
  const w = 0.9, h = 1.5, d = 1.6
  flat(brick, [[x, y - w, z0], [x, y + w, z0], [x, y + w, z0 + h], [x, y - w, z0 + h]], [s, 0, 0])
  flatTri(stone, [x + s * 0.02, y - w - 0.15, z0 + h], [x + s * 0.02, y + w + 0.15, z0 + h], [x + s * 0.02, y, z0 + h + 1.0], [s, 0, 0])
  winX(s, x, y, 0.8, z0 + 0.2, z0 + 1.3)
  for (const t of [-1, 1] as const) {
    flat(slate, [[x, y + t * (w + 0.15), z0 + h], [x, y, z0 + h + 1.0], [x - s * d, y, z0 + h + 1.0], [x - s * d, y + t * (w + 0.15), z0 + h]], [0, t * 1.0, w + 0.15])
    flat(brick, [[x, y + t * w, z0], [x, y + t * w, z0 + h], [x - s * d, y + t * w, z0 + h], [x - s * d, y + t * w, z0]], [0, t, 0])
  }
}
/** A small octagonal turret with a domed cap. */
function turret(x: number, y: number, z0: number, z1: number, r: number) {
  lathe([x, y], [[r, z0], [r, z1]], () => stone, 8, 50, Math.PI / 8)
  lathe([x, y], [[r + 0.25, z1], [r + 0.25, z1 + 0.35]], () => stone, 8, 50, Math.PI / 8)
  lathe([x, y], [[r + 0.15, z1 + 0.35], [r * 0.95, z1 + 1.0], [r * 0.6, z1 + 1.55], [0.2, z1 + 1.8], [0.2, z1 + 2.3], [0, z1 + 2.4]], () => copper, 8, 50, Math.PI / 8)
}

function build() {
  const mirror = (f: (s: 1 | -1) => void) => { f(1); f(-1) }
  const Y = (s: number, d: number) => YC + s * d

  // ---- the main block: granite plinth, brick walls, cornice, mansard
  abox(stone, XR - 0.2, XF + 0.2, Y0 - 0.2, Y1 + 0.2, 0, 1.6, null)
  abox(brick, XR, XF, Y0, Y1, 1.6, ZC, null)
  abox(stone, XR - 0.15, XF + 0.15, Y0 - 0.15, Y1 + 0.15, 6.0, 6.5, null) // string course
  abox(stone, XR - 0.45, XF + 0.45, Y0 - 0.45, Y1 + 0.45, ZC - 0.7, ZC, stone, true)
  mansard(XR + 0.2, XF - 0.2, Y0 + 0.2, Y1 - 0.2, ZC, 17.0, 2.6)
  // windows: front and rear, both storeys, in the bays between the pavilions
  for (let y = Y0 + 12.4; y < Y1 - 11; y += 3.6) {
    if (Math.abs(y - YC) < 9.6) continue
    for (const [s, x] of [[1, XF], [-1, XR]] as [1 | -1, number][]) {
      winX(s, x, y, 1.6, 2.2, 5.2, s > 0 && Math.abs(y - YC) < 16)
      winX(s, x, y, 1.5, 7.4, 11.0)
      // granite lintels over both storeys' windows
      for (const z of [5.4, 11.2]) abox(stone, Math.min(x, x + s * 0.25), Math.max(x, x + s * 0.25), y - 1.05, y + 1.05, z, z + 0.55, stone)
    }
    if (Math.abs(y - YC) > 10.5 && (Math.round((y - Y0) / 3.6) % 2 === 0)) {
      dormer(1, XF - 1.3, y, 14.1)
      dormer(-1, XR + 1.3, y, 14.1)
    }
  }
  // the ends: windows
  for (const [t, y] of [[1, Y1], [-1, Y0]] as [1 | -1, number][]) for (let x = XR + 2.2; x < XF - 1; x += 3.4) {
    for (const [z0, z1] of [[2.2, 5.2], [7.4, 11.0]]) flat(win, [[x - 0.75, y + t * 0.07, z0], [x + 0.75, y + t * 0.07, z0], [x + 0.75, y + t * 0.07, z1], [x - 0.75, y + t * 0.07, z1]], [0, t, 0])
  }

  // ---- end pavilions: forward 4.7 m, own steep roofs, round-arched gables
  mirror((s) => {
    const yc = Y(s, 31.5), x1 = 12.0
    abox(stone, XF, x1 + 0.2, yc - 5.2, yc + 5.2, 0, 1.6, null)
    abox(brick, XF, x1, yc - 5, yc + 5, 1.6, ZC, null)
    abox(stone, XF, x1 + 0.15, yc - 5.15, yc + 5.15, 6.0, 6.5, null)
    abox(stone, XF, x1 + 0.45, yc - 5.45, yc + 5.45, ZC - 0.7, ZC, stone)
    // granite quoins at the corners: alternating long and short blocks
    for (const d of [-1, 1]) for (let z = 1.6, k = 0; z < ZC - 1.2; z += 1.1, k++) {
      const w = k % 2 ? 0.9 : 1.5
      abox(stone, x1 - w, x1 + 0.12, yc + d * 5 - 0.6, yc + d * 5 + 0.6, z, z + 0.6, null)
    }
    // steep hipped roof
    mansard(XF - 2, x1, yc - 5.2, yc + 5.2, ZC, 18.2, 3.4, 'e')
    // the gable: brick wall with a round top, a round-arched window
    abox(brick, x1 - 0.6, x1, yc - 3.6, yc + 3.6, ZC, 15.6, null)
    flat(brick, [[x1, yc - 3.6, ZC], [x1, yc + 3.6, ZC], [x1, yc + 3.6, 15.6], [x1, yc - 3.6, 15.6]], [1, 0, 0])
    halfDisc(brick, 1, x1, yc, 15.6, 3.6)
    halfDisc(brick, -1, x1 - 0.6, yc, 15.6, 3.6)
    barrel(stone, x1 - 0.7, x1 + 0.15, yc, 15.6, 3.75, 10)
    winX(1, x1, yc, 2.4, 13.6, 15.9, true)
    // the slope behind the gable
    flat(slate, [[x1 - 0.6, yc - 5.2, ZC], [x1 - 0.6, yc + 5.2, ZC], [x1 - 3.4, yc + 1.8, 18.2], [x1 - 3.4, yc - 1.8, 18.2]], [3.4, 0, 5])
    // windows on the pavilion front: paired, both storeys
    for (const d of [-2.6, 0, 2.6]) {
      winX(1, x1, yc + d, 1.3, 2.2, 5.2)
      winX(1, x1, yc + d, 1.3, 7.4, 11.0, d === 0)
    }
  })

  // ---- the central pavilion, its great arch, turrets, the porch
  const PX = 15.2, PH = 8.0
  abox(stone, XF, PX + 0.2, YC - PH - 0.2, YC + PH + 0.2, 0, 1.6, null)
  abox(brick, XF, PX, YC - PH, YC + PH, 1.6, ZC + 0.6, null)
  abox(stone, XF, PX + 0.45, YC - PH - 0.45, YC + PH + 0.45, ZC - 0.1, ZC + 0.6, stone)
  abox(slate, XF - 1, PX - 0.2, YC - PH + 0.3, YC + PH - 0.3, ZC + 0.6, ZC + 0.9, slate) // flat roof before the drum
  // the arch: a granite frame round a fan window, rising above the cornice
  const AR = 5.4, AZ = 11.6
  abox(brick, PX - 0.8, PX, YC - AR - 0.6, YC + AR + 0.6, ZC + 0.6, AZ + 0.4, null)
  halfDisc(brick, 1, PX, YC, AZ, AR + 0.6, 12)
  halfDisc(brick, -1, PX - 0.8, YC, AZ, AR + 0.6, 12)
  barrel(stone, PX - 0.9, PX + 0.3, YC, AZ, AR + 0.75, 12)
  flat(win, [[PX + 0.07, YC - AR + 0.6, 6.8], [PX + 0.07, YC + AR - 0.6, 6.8], [PX + 0.07, YC + AR - 0.6, AZ], [PX + 0.07, YC - AR + 0.6, AZ]], [1, 0, 0])
  halfDisc(win, 1, PX + 0.07, YC, AZ, AR - 0.6, 12)
  // the clock in a granite panel under the arch, mullions over the window
  abox(stone, PX, PX + 0.3, YC - 1.3, YC + 1.3, 6.5, 9.4, null)
  disc(win, [PX + 0.32, YC, 8.0], [1, 0, 0], 0.95, 12)
  disc(stone, [PX + 0.36, YC, 8.0], [1, 0, 0], 0.75, 12)
  for (const d of [-2.4, 2.4]) abox(stone, PX, PX + 0.2, YC + d - 0.2, YC + d + 0.2, 6.8, AZ + Math.sqrt((AR - 0.6) ** 2 - d * d) - 0.1, null)
  // quoins on the pavilion's corners
  for (const d of [-1, 1]) for (let z = 1.6, k = 0; z < ZC - 1.2; z += 1.1, k++) {
    const w = k % 2 ? 0.9 : 1.6
    abox(stone, PX - 0.6, PX + 0.12, d > 0 ? YC + PH - w : YC - PH, d > 0 ? YC + PH + 0.12 : YC - PH + w, z, z + 0.6, null)
  }
  // side bays of the pavilion
  for (const s of [-1, 1]) for (const [z0, z1] of [[7.4, 11.0]]) winX(1, PX, YC + s * 6.9, 1.0, z0, z1)
  // turrets on the pavilion's corners
  mirror((s) => turret(PX - 0.6, Y(s, PH - 0.4), ZC + 0.6, 16.6, 1.1))
  // the porch: granite piers under a flat roof with a parapet
  const QX = 19.0, QH = 10.3, QZ = 5.4
  abox(stone, PX, QX, YC - QH, YC + QH, QZ - 0.8, QZ, stone, true)
  abox(stone, QX - 0.3, QX + 0.1, YC - QH, YC + QH, QZ, QZ + 0.7, stone)
  for (const d of [-QH + 0.5, -5.5, -1.8, 1.8, 5.5, QH - 0.5]) abox(stone, QX - 1.0, QX - 0.1, YC + d - 0.45, YC + d + 0.45, 0, QZ - 0.8, null)
  // doors behind the porch
  for (const d of [-3.6, 0, 3.6]) winX(1, PX, YC + d, 2.2, 0.3, 4.2)

  // ---- the dome: square drum with a lunette on each face, dome, lantern
  const DX = 6.4, DH = 6.6, DZ = 16.0
  abox(brick, DX - DH, DX + DH, YC - DH, YC + DH, ZC, DZ + 1.6, null)
  abox(stone, DX - DH - 0.3, DX + DH + 0.3, YC - DH - 0.3, YC + DH + 0.3, DZ + 1.3, DZ + 1.8, stone)
  for (const s of [1, -1] as const) {
    // lunettes on the east and west faces
    const x = DX + s * DH
    halfDisc(brick, s, x, YC, DZ + 1.8, 4.6, 12)
    halfDisc(brick, -s as 1 | -1, x - s * 0.6, YC, DZ + 1.8, 4.6, 12)
    barrel(stone, Math.min(x, x - s * 0.7), Math.max(x, x - s * 0.7) + 0.0, YC, DZ + 1.8, 4.8, 12)
    halfDisc(win, s, x + s * 0.07, YC, DZ + 1.8, 3.9, 12)
    for (const d of [-1.3, 1.3]) abox(stone, Math.min(x, x + s * 0.15), Math.max(x, x + s * 0.15), YC + d - 0.12, YC + d + 0.12, DZ + 1.8, DZ + 1.8 + Math.sqrt(3.9 ** 2 - d * d), null)
    // and on the north and south faces
    const y = YC + s * DH
    halfDiscY(brick, s, y, DX, DZ + 1.8, 4.6, 12)
    halfDiscY(brick, -s as 1 | -1, y - s * 0.6, DX, DZ + 1.8, 4.6, 12)
    halfDiscY(win, s, y + s * 0.07, DX, DZ + 1.8, 3.9, 12)
    for (let i = 0; i < 12; i++) {
      const a0 = (i / 12) * Math.PI, a1 = ((i + 1) / 12) * Math.PI, r = 4.8
      const n0: V3 = [Math.cos(a0), 0, Math.sin(a0)], n1: V3 = [Math.cos(a1), 0, Math.sin(a1)]
      const ya = y - s * 0.7, yb = y + s * 0.0
      face(stone, [[DX + r * n0[0], ya, DZ + 1.8 + r * n0[2]], [DX + r * n0[0], yb, DZ + 1.8 + r * n0[2]], [DX + r * n1[0], yb, DZ + 1.8 + r * n1[2]], [DX + r * n1[0], ya, DZ + 1.8 + r * n1[2]]], [n0, n0, n1, n1])
    }
  }
  // the dome, the lantern and its cap
  lathe([DX, YC], [[6.3, DZ + 1.8], [6.3, DZ + 2.4], [6.0, DZ + 4.4], [5.2, DZ + 6.4], [3.9, DZ + 8.1], [2.1, DZ + 9.2], [1.4, DZ + 9.5]], () => copper, 16, 40)
  lathe([DX, YC], [[1.4, DZ + 9.5], [1.4, DZ + 11.0]], () => stone, 8, 50, Math.PI / 8)
  lathe([DX, YC], [[1.7, DZ + 11.0], [1.4, DZ + 11.8], [0.8, DZ + 12.4], [0.18, DZ + 12.6], [0.18, DZ + 13.4], [0, DZ + 13.5]], () => copper, 8, 50, Math.PI / 8)
  // lantern windows
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * 2 * Math.PI, ca = Math.cos(a), sa = Math.sin(a), r = 1.42
    flat(win, [[DX + r * ca - sa * 0.35, YC + r * sa + ca * 0.35, DZ + 9.8], [DX + r * ca + sa * 0.35, YC + r * sa - ca * 0.35, DZ + 9.8], [DX + r * ca + sa * 0.35, YC + r * sa - ca * 0.35, DZ + 10.7], [DX + r * ca - sa * 0.35, YC + r * sa + ca * 0.35, DZ + 10.7]], [ca, sa, 0])
  }

  // ---- the central hall behind: barrel roof running to the rear, fan window
  const HW = 5.6
  const HZ = ZC - 0.4
  barrel(copper, XR - 0.3, DX - DH + 0.5, YC, HZ, HW + 0.3, 12)
  halfDisc(brick, -1, XR, YC, HZ, HW, 12)
  halfDisc(win, -1, XR - 0.07, YC, HZ, HW - 0.9, 12)
  barrel(stone, XR - 0.4, XR + 0.2, YC, HZ, HW + 0.1, 12)

  // ---- the low arcaded annex to the south (OSM y -69 to -50)
  const AY0 = -68.9, AY1 = Y0
  abox(stone, -7.8, 13.9, AY0, AY1, 0, 6.2, slate)
  abox(stone, -8.0, 14.1, AY0 - 0.2, AY1, 6.2, 6.9, stone)
  for (const y of [-66.0, -61.4, -56.8, -52.2]) winX(1, 13.9, y, 3.2, 0.4, 3.8, true)
  for (const y of [-66.0, -61.4, -56.8, -52.2]) winX(-1, -7.8, y, 2.0, 1.2, 4.0)
  for (const x of [-4.4, 0.4, 5.2, 10.0]) flat(win, [[x + 1.4, AY0 - 0.07, 0.4], [x - 1.4, AY0 - 0.07, 0.4], [x - 1.4, AY0 - 0.07, 3.8], [x + 1.4, AY0 - 0.07, 3.8]], [0, -1, 0])

  // origin: the outline's centroid (OSM local 1.0, -3.4)
  for (const p of [brick, stone, slate, copper, win]) for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] -= 1.0; p.pos[i + 2] -= 3.4 }
  const flood = (p: V3, n: V3) => (n[2] > 0.6 ? 0.15 : p[0] > -5 ? Math.max(0.3, 1 - p[2] / 30) : 0.2)
  save('seoul-culture-station-284', 'Culture Station Seoul 284', [
    { part: brick, material: { ...finish('station-brick', 0xc98a72), floodlight: flood } },
    { part: stone, material: { ...finish('station-granite', 0xe3ddd0), floodlight: flood } },
    { part: slate, material: { ...PALETTE.roof, color: 0x8b9097 } },
    { part: copper, material: { ...PALETTE.copper, color: 0x7fb3a0 } },
    { part: win, material: PALETTE.window },
  ], 0, 29.5)
}

if (import.meta.main) build()
