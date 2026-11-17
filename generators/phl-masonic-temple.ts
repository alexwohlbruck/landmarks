/**
 * Masonic Temple, 1 North Broad Street (1868-73, James H. Windrim; the
 * Grand Lodge of Pennsylvania) — original procedural geometry, CC0-1.0.
 * bun generators/phl-masonic-temple.ts [out.glb]
 *
 * Frame: map frame turned to the Center City grid, bearing 9.3 (OSM sides
 * 9.2-9.5 / 99.2). +x east-south-east (toward Juniper St), +y
 * north-north-east (toward Arch St), z up, metres. Origin = centroid of the
 * OSM outline way/309294828, 39.953620, -75.162657, on the street (Broad
 * St and Filbert / JFK Blvd sidewalks, ~1 m above the lidar box's
 * ground_min; the east end's sidewalk is ~0.5 m lower). Elevation 0.
 *
 * Identity, in order: the grey granite Norman Romanesque temple facing
 * City Hall across Broad St; the tall square tower at the south-west
 * corner (Broad and Filbert) with its four corner turrets and pinnacles
 * standing above a parapet; the shorter tower with an octagonal belfry at
 * the north-west corner; between them the gabled west front with the big
 * round-arched Norman portal, the great arched window over it and the
 * three gabled aedicules on its parapet; the long south side with
 * buttresses and pinnacles; the hipped green copper roof.
 *
 * Night: the stone is floodlit (Kanan H. Jani's night photo: the Broad St
 * front and the tower bright, the windows dark), so the granite carries
 * `floodlight`, strongest on the west front and the tower; the windows and
 * the portal are a dark, unlit recess colour.
 *
 * Evidence
 *  - OSM: way/309294828 (72.3 x 43.4 m; tagged height 11.63 and 3 levels,
 *    both wrong). Replaced. The Arch Street United Methodist Church to the
 *    north is separate and not replaced.
 *  - Lidar: USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown 2015), 0.5 m
 *    grid read in this frame. Measured above the sidewalk: eaves 27.4 all
 *    round; the copper roof's ridge 37.5 along the middle from the west
 *    front to x ~14, then a hip down to the east end; the south-west tower
 *    ~9 m square, its parapet ~60 and the corner pinnacles to ~71; the
 *    north-west tower ~7 m square, ~44 to its parapet; the west front's
 *    parapet 28-32 with its aedicules to ~40; a gabled bay on the south side
 *    (x 2..14) to ~35, one on the north (x -10..-2) to ~34, and the east end
 *    to ~40. The lidar sits ~1 m off the OSM outline; the model follows OSM.
 *  - Published (Wikipedia "Masonic Temple (Philadelphia)"; NRHP 1971): 1873,
 *    James Hamilton Windrim; Norman Romanesque; granite (Cape Ann).
 *  - Estimated: the tower's stage heights and window sizes (from Jersey856's
 *    and Bruce Andersen's photos, scaled by the lidar heights), the portal
 *    (5 m wide, 9 m to the arch's crown), the buttress spacing (7 m) and
 *    the window counts on the sides.
 *  - Colours: Jersey856's sunny photo and Nickvud's aerial, pulled to the
 *    palette's lightness: warm buff-tan granite (sampled ~#b5a68a in Nickvud's tower close-up), the roof's pale green patina.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  - Masonic_Temple_in_Philadelphia.jpg, Jersey856, CC BY-SA 4.0 (from the
 *    south-west, the west front and the south side)
 *    https://commons.wikimedia.org/wiki/File:Masonic_Temple_in_Philadelphia.jpg
 *  - Grand_Lodge_of_Pennsylvania.jpg, Bruce Andersen, CC BY-SA 2.5 (the same
 *    side) https://commons.wikimedia.org/wiki/File:Grand_Lodge_of_Pennsylvania.jpg
 *  - Masonic_Temple_Philadelphia_aerial_view.jpg, Nickvud, CC BY-SA 4.0 (from
 *    City Hall's tower: the roof, both towers' tops)
 *    https://commons.wikimedia.org/wiki/File:Masonic_Temple_Philadelphia_aerial_view.jpg
 *  - Philadelphia_Masonic_Temple_tower.jpg, Nickvud, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Philadelphia_Masonic_Temple_tower.jpg
 *  - Masonic_Temple,_Philadelphia,_PA.jpg, Kanan H. Jani, CC BY-SA 3.0 (night)
 *    https://commons.wikimedia.org/wiki/File:Masonic_Temple,_Philadelphia,_PA.jpg
 *  (HABS PA,51-PHILA,742 detail photos exist on Commons but were not used.)
 *  No look-only sources; no commercial imagery.
 *
 * Left out: the portal's carved rings, the arcaded corbel tables, the
 * balustrades, the rose windows' tracery, the fence, the small pinnacles
 * along the front's parapet.
 *
 * Doubts: the east end and the north side have no photo of their own (the
 * lidar gives their heights; their windows follow the south side).
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { block, cap, lathe, onWall, rect, save, walls, type XY } from './chi-aon-center'

const granite = new Part()
const roof = new Part()
const dark = new Part()

const X0 = -36.2, X1 = 36.2, Y0 = -21.7, Y1 = 21.7
const EAVE = 27.4, RIDGE = 37.5

/** An arched opening on the wall a→b: centre s, width w, from z0, the semicircle springing at zs. */
function arch(a: XY, b: XY, s: number, w: number, z0: number, zs: number, out = 0.05, p = dark, seg = 8) {
  const { P } = onWall(a, b)
  const r = w / 2
  p.quad(P(s - r, z0, out), P(s + r, z0, out), P(s + r, zs, out), P(s - r, zs, out))
  for (let i = 0; i < seg; i++) {
    const t0 = (Math.PI * i) / seg, t1 = (Math.PI * (i + 1)) / seg
    p.tri(P(s, zs, out), P(s + r * Math.cos(t0), zs + r * Math.sin(t0), out), P(s + r * Math.cos(t1), zs + r * Math.sin(t1), out))
  }
}

/** A round window on a wall. */
function rose(a: XY, b: XY, s: number, zc: number, r: number, out = 0.05) {
  const { P } = onWall(a, b)
  const n = 12
  for (let i = 0; i < n; i++) {
    const t0 = (2 * Math.PI * i) / n, t1 = (2 * Math.PI * (i + 1)) / n
    dark.tri(P(s, zc, out), P(s + r * Math.cos(t0), zc + r * Math.sin(t0), out), P(s + r * Math.cos(t1), zc + r * Math.sin(t1), out))
  }
}

/** A gable standing on the wall a→b: centre s, width w, from z0 to apex zA, `t` thick, with a coping. */
function gable(a: XY, b: XY, s: number, w: number, z0: number, zA: number, t = 0.8, out = 0.0) {
  const { P } = onWall(a, b)
  const s0 = s - w / 2, s1 = s + w / 2
  const f = out, k = out - t
  granite.tri(P(s0, z0, f), P(s1, z0, f), P(s, zA, f))
  granite.tri(P(s1, z0, k), P(s0, z0, k), P(s, zA, k))
  granite.quad(P(s1, z0, f), P(s1, z0, k), P(s, zA, k), P(s, zA, f))
  granite.quad(P(s, zA, f), P(s, zA, k), P(s0, z0, k), P(s0, z0, f))
}

/** A pinnacle: an octagonal shaft of radius r from z0 to z1, a cone to zT. */
function pinnacle(x: number, y: number, r: number, z0: number, z1: number, zT: number) {
  lathe(granite, x, y, [[r, z0], [r, z1], [r * 1.25, z1 + 0.25], [r * 1.05, z1 + 0.5], [0.08, zT], [0, zT]], 8, Math.PI / 8)
}

function body() {
  const r = rect(X0, Y0, X1, Y1)
  walls(granite, r, 0, EAVE - 1.0)
  // the corbelled cornice
  const o = rect(X0 - 0.5, Y0 - 0.5, X1 + 0.5, Y1 + 0.5)
  walls(granite, o, EAVE - 1.0, EAVE)
  walls(granite, r, EAVE - 1.0, EAVE - 1.0, o)

  // Roof: gable at the west front, ridge along the middle, hip at the east.
  const rr = o
  const xr = X1 - (RIDGE - EAVE) / (RIDGE - EAVE) * (Y1 - Y0) / 2 // hip start, same slope as the sides
  const W0: V3 = [X0 + 1.2, rr[0][1], EAVE], E0: V3 = [rr[1][0], rr[1][1], EAVE], E1: V3 = [rr[2][0], rr[2][1], EAVE], W1: V3 = [X0 + 1.2, rr[3][1], EAVE]
  const RW: V3 = [X0 + 1.2, 0, RIDGE], RE: V3 = [xr, 0, RIDGE]
  roof.quad(W0, E0, RE, RW) // south slope
  roof.quad(E1, W1, RW, RE) // north slope
  roof.tri(E0, E1, RE) // east hip
  // the west gable behind the front's parapet
  granite.tri(W1, W0, RW)
  cap(granite, [[X0, Y0], [X0 + 1.2, Y0], [X0 + 1.2, Y1], [X0, Y1]] as XY[], EAVE)
}

function westFront() {
  const a: XY = [X0, Y1], b: XY = [X0, Y0] // the west face, running south; s = 0 at the north corner
  const L = Y1 - Y0
  const sAt = (y: number) => Y1 - y
  // Parapet between the towers.
  block(granite, granite, rect(X0 - 0.3, -12.9, X0 + 1.2, 15.1), EAVE, 30.6, 0.2)
  // The central section: pilaster-buttresses, raised parapet, aedicules.
  block(granite, granite, rect(X0 - 1.0, -8.6, X0 + 1.2, 8.6), 0, 33.2, 0.3)
  for (const y of [-8.6, 8.6]) block(granite, granite, rect(X0 - 1.6, y - 1.0, X0 + 0.5, y + 1.0), 0, 34.0, 0.25)
  gable([X0 - 1.0, 8.6], [X0 - 1.0, -8.6], 8.6, 6.0, 33.2, 40.0, 1.6)
  for (const y of [-5.6, 5.6]) gable([X0 - 1.0, 8.6], [X0 - 1.0, -8.6], 8.6 - y, 2.6, 33.2, 36.4, 1.4)
  for (const y of [-7.3, -3.9, 3.9, 7.3]) pinnacle(X0 - 0.6, y, 0.35, 33.2, 34.6, 36.6)
  // a small gable on the front north of the centre (photos)
  gable(a, b, sAt(11.6), 4.0, 30.6, 34.6, 1.2, 0.2)
  // The Norman portal: a porch with a deep round arch.
  block(granite, granite, rect(X0 - 3.2, -5.8, X0 - 0.5, 5.8), 0, 12.6, 0.3)
  const pa: XY = [X0 - 3.2, 5.8], pb: XY = [X0 - 3.2, -5.8]
  arch(pa, pb, 5.8, 5.2, 0, 6.6)
  // the great arched window over it, and the roundels
  const ca: XY = [X0 - 1.0, 8.6], cb: XY = [X0 - 1.0, -8.6]
  arch(ca, cb, 8.6, 4.6, 14.0, 21.0)
  for (const y of [-6.5, 6.5]) rose(ca, cb, 8.6 - y, 25.0, 0.7)
  // the arcade of five arched windows high in the centre
  for (let i = -2; i <= 2; i++) arch(ca, cb, 8.6 + i * 2.6, 1.5, 27.0, 29.0)
  // side bays of the front: two tiers of arched windows
  for (const y of [-11.0, 11.6]) {
    arch(a, b, sAt(y), 1.8, 3.0, 8.0)
    arch(a, b, sAt(y), 1.8, 13.5, 18.5)
    arch(a, b, sAt(y), 2.2, 21.0, 24.5)
  }
  void L
}

function sides() {
  // Buttresses with pinnacles along the south and north sides, tall arched
  // windows between, a gabled bay on each side and on the east end.
  for (const [y, sgn] of [[Y0, -1], [Y1, 1]] as [number, number][]) {
    const a: XY = sgn < 0 ? [X0, Y0] : [X1, Y1], b: XY = sgn < 0 ? [X1, Y0] : [X0, Y1]
    const sOf = (x: number) => (sgn < 0 ? x - X0 : X1 - x)
    const xs: number[] = []
    for (let x = -26.6; x <= X1 - 1; x += 7.0) xs.push(x)
    for (const x of xs) {
      if (sgn > 0 && x < -28) continue
      const yy = y + sgn * 0.5
      block(granite, null, rect(x - 0.65, Math.min(y, yy + sgn * 0.5), x + 0.65, Math.max(y, yy + sgn * 0.5)), 0, EAVE + 1.0, 0.2)
      pinnacle(x, y + sgn * 0.35, 0.55, EAVE + 1.0, EAVE + 3.2, EAVE + 6.4)
    }
    for (let i = 0; i < xs.length - 1; i++) {
      const xm = (xs[i] + xs[i + 1]) / 2
      arch(a, b, sOf(xm), 2.0, 2.5, 8.5)
      arch(a, b, sOf(xm), 2.0, 12.5, 20.5)
    }
  }
  // gabled bays (lidar): south x 2..14, north x -10..-2, east y -9..7
  gable([X0, Y0 - 0.5], [X1, Y0 - 0.5], 8.0 - X0, 12.0, EAVE, 35.4, 2.0, 0.3)
  pinnacle(2.0, Y0 - 0.3, 0.6, EAVE, 33.5, 37.8)
  pinnacle(14.0, Y0 - 0.3, 0.6, EAVE, 33.5, 37.8)
  rose([X0, Y0 - 0.8], [X1, Y0 - 0.8], 8.0 - X0, 30.6, 1.3)
  gable([X1, Y1 + 0.5], [X0, Y1 + 0.5], X1 + 6.0, 8.0, EAVE, 33.8, 2.0, 0.3)
  gable([X1 + 0.5, Y0], [X1 + 0.5, Y1], -1.0 - Y0, 16.0, EAVE, 38.6, 2.0, 0.3)
  pinnacle(X1 + 0.3, -9.0, 0.6, EAVE, 35.0, 40.2)
  pinnacle(X1 + 0.3, 7.0, 0.6, EAVE, 35.0, 40.2)
  const ea: XY = [X1 + 0.5, Y0], eb: XY = [X1 + 0.5, Y1]
  for (const y of [-6, -1, 4]) arch(ea, eb, y - Y0, 2.0, 4.0, 11.0)
  rose(ea, eb, -1 - Y0, 31.0, 1.6)
  for (const y of [-6, 4]) arch(ea, eb, y - Y0, 2.0, 14.0, 21.0)
}

function swTower() {
  const tx0 = -36.8, tx1 = -28.2, ty0 = -22.3, ty1 = -13.7
  const r = rect(tx0, ty0, tx1, ty1)
  block(granite, null, r, 0, 46.0, 0)
  // string courses
  for (const z of [EAVE - 1.0, 36.6, 45.4]) {
    const o = rect(tx0 - 0.35, ty0 - 0.35, tx1 + 0.35, ty1 + 0.35)
    walls(granite, o, z, z + 0.6)
    walls(granite, o, z + 0.6, z + 0.6, r)
    walls(granite, r, z, z, o)
  }
  // belfry stage, a little narrower, and the parapet
  const r2 = rect(tx0 + 0.4, ty0 + 0.4, tx1 - 0.4, ty1 - 0.4)
  walls(granite, r2, 46.0, 58.8)
  cap(granite, r, 46.0)
  const o2 = rect(tx0 - 0.1, ty0 - 0.1, tx1 + 0.1, ty1 + 0.1)
  block(granite, roof, o2, 58.8, 60.6, 0.25)
  // windows on all four faces: rose low on the street faces, triple arcade,
  // the tall belfry arch
  const cx = (tx0 + tx1) / 2, cy = (ty0 + ty1) / 2
  const faces: [XY, XY, XY, XY][] = [
    [r[0], r[1], r2[0], r2[1]], [r[1], r[2], r2[1], r2[2]], [r[2], r[3], r2[2], r2[3]], [r[3], r[0], r2[3], r2[0]],
  ]
  faces.forEach(([a, b, a2, b2], i) => {
    const m = (tx1 - tx0) / 2
    if (i === 0 || i === 3) {
      arch(a, b, m, 2.0, 4.0, 10.0)
      arch(a, b, m, 2.0, 14.0, 20.0)
      rose(a, b, m, 24.0, 1.3)
    }
    for (const d of [-1.6, 0, 1.6]) arch(a, b, m + d, 1.0, 38.5, 42.6)
    for (const d of [-1.3, 1.3]) arch(a2, b2, m - 0.4 + d, 1.5, 48.0, 55.6)
  })
  // The four corner turrets stand against the lower stages and end in
  // conical caps under the belfry stage (Nickvud's tower photo); the
  // belfry's own corners carry short pinnacles over the parapet.
  for (const [x, y] of [[tx0, ty0], [tx1, ty0], [tx1, ty1], [tx0, ty1]]) {
    const ix = x + (x < cx ? 0.1 : -0.1), iy = y + (y < cy ? 0.1 : -0.1)
    lathe(granite, ix, iy, [[1.15, 30.0], [1.15, 46.6], [1.4, 46.9], [1.25, 47.4], [0.1, 53.5], [0, 53.5]], 8, Math.PI / 8)
    const px = x + (x < cx ? 0.55 : -0.55), py = y + (y < cy ? 0.55 : -0.55)
    lathe(granite, px, py, [[0.75, 60.6], [0.75, 63.4], [0.95, 63.7], [0.85, 64.1], [0.08, 70.5], [0, 70.5]], 8, Math.PI / 8)
  }
}

function nwTower() {
  const tx0 = -37.0, tx1 = -29.6, ty0 = 15.1, ty1 = 22.5
  const r = rect(tx0, ty0, tx1, ty1)
  block(granite, null, r, 0, 37.0, 0)
  const o = rect(tx0 - 0.35, ty0 - 0.35, tx1 + 0.35, ty1 + 0.35)
  walls(granite, o, 36.4, 37.0)
  walls(granite, o, 37.0, 37.0, r)
  walls(granite, r, 36.4, 36.4, o)
  // octagonal belfry with arched openings, a parapet and corner pinnacles
  const cx = (tx0 + tx1) / 2, cy = (ty0 + ty1) / 2
  const oct: XY[] = []
  for (let i = 0; i < 8; i++) {
    const t = Math.PI / 8 + (i * Math.PI) / 4
    oct.push([cx + 3.5 * Math.cos(t), cy + 3.5 * Math.sin(t)])
  }
  walls(granite, oct, 37.0, 43.4)
  cap(granite, r, 37.0)
  for (let i = 0; i < 8; i++) arch(oct[i], oct[(i + 1) % 8], 1.34, 1.3, 38.4, 41.2)
  const octO = oct.map(([x, y]) => [cx + (x - cx) * 1.1, cy + (y - cy) * 1.1] as XY)
  walls(granite, octO, 43.4, 44.6)
  walls(granite, oct, 43.4, 43.4, octO)
  cap(roof, octO, 44.6)
  for (const [x, y] of r) pinnacle(x + (x < cx ? 0.5 : -0.5), y + (y < cy ? 0.5 : -0.5), 0.45, 37.0, 41.5, 46.5)
  // windows on its street faces
  const fa: XY = r[3], fb: XY = r[0] // west
  const na: XY = r[2], nb: XY = r[3] // north
  for (const [a, b] of [[fa, fb], [na, nb]] as [XY, XY][]) {
    arch(a, b, 3.7, 1.8, 3.0, 8.0)
    arch(a, b, 3.7, 1.8, 13.5, 18.5)
    arch(a, b, 3.7, 2.2, 22.0, 26.0)
    for (const d of [-1.3, 1.3]) arch(a, b, 3.7 + d, 1.0, 30.0, 33.5)
  }
}

function build() {
  body()
  westFront()
  sides()
  swTower()
  nwTower()
  const flood = (p: V3, n: V3) => {
    if (n[2] > 0.7) return 0.15
    const tower = p[0] < -26 && p[1] < -12
    if (tower) return 0.6 + 0.4 * Math.min(1, p[2] / 60)
    if (p[0] < X0 + 1.5 && n[0] < -0.5) return 1.0 // the Broad St front
    if (n[1] < -0.5) return 0.6 // the south side, on Filbert / JFK Blvd
    return 0.35
  }
  return [
    { part: granite, material: { ...finish('masonic-granite', 0xd4c9b2), floodlight: flood } },
    { part: roof, material: finish('masonic-copper', 0x9ab8a8) },
    { part: dark, material: finish('masonic-openings', 0x4d5459) },
  ]
}

if (import.meta.main) await save('phl-masonic-temple', 'Masonic Temple', [39.95362, -75.162657], 9.3, build())
