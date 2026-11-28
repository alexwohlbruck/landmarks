/**
 * Great Mosque of Djenné (rebuilt 1906-07 under Ismaila Traoré), Djenné,
 * Mali: procedural, CC0-1.0.
 * bun generators/djenne-great-mosque.ts
 *
 * Writes two levels of detail in the same frame and materials:
 * - models/djenne-great-mosque.glb (low, under 5,000 triangles): the
 *   platform, the prayer hall and courtyard walls, the three qibla towers,
 *   the buttress pilasters with their pinnacle cones;
 * - models/djenne-great-mosque.detail.glb (under 40,000): the same with
 *   the toron (palm-stick) bundles as real sticks standing 0.6 m out of the
 *   towers, pilasters and corner buttresses, the ostrich eggs on the tower
 *   tips, the roof's vent bowls and the courtyard's arched galleries.
 *
 * Frame: origin at the centroid of the OSM outline (relation/11916275,
 * outer way/437123394, courtyard inner way/875171600); bearing 1.0, the
 * outline's edges. +x is east: the qibla wall and its three towers.
 *
 * Plan, from OSM in this frame: the courtyard block x -27..4.5,
 * y -29..25.8, its open court x -23.8..-0.7, y -25..22.5 (OSM's inner ring,
 * squared); the prayer hall x 4.5 to the qibla wall (x 24.6, 26.0, 27.5,
 * 26.8 from south to north: the plan is not quite orthogonal, as published),
 * y -24.6..26.4; the towers' projections at y -12.2, 1.9 and 16.2, to x
 * 28.7, 29.9 and 32.9; the north stair tower (x 1.6..7.6) and entrance
 * porch (x 12.4..17.3) projecting to y 29.4 and 28.5.
 *
 * Heights. Published (en.wikipedia "Great Mosque of Djenné"): the platform
 * 75 x 75 m, 3 m above the market; the central tower about 16 m; the toron
 * project about 60 cm; 18 buttresses on the qibla wall, each with a
 * pinnacle. Scaled from "Great Mosque of Djenne 2.jpg" (jm, the qibla
 * front, square on; the towers' spacing from OSM, 14.2 m, gives
 * 0.046 m/px): walls 8.4 m above the platform, pinnacle tips 10.5; the
 * outer towers' bodies 11.4 m, then three stepped tiers and a square
 * pointed pinnacle to 16.0; the central tower's body 12.8 m, four tiers,
 * tip 17.0 (jm); the central tower 7.2 m wide, the outer
 * ones 6.0. From "Great Mosque of Djenné 1.jpg" (ag, north-east): the
 * courtyard walls lower, 6.8 m; the north stair tower 12.5 m; the
 * platform's parapet and its round-headed posts. The platform's extent is
 * estimated (OSM doesn't map it): 73 x 71 m round the mosque, kept clear
 * of the houses to the west and south.
 *
 * Ground: the market square is level; the map's terrain (Mapterhorn z12;
 * z13-15 return 404) varies under a metre here. The platform is part of the
 * model (y = 0 is the square). Elevation 0. The terrain check at z12
 * reads the lowest stair steps (0.6 m) as buried by up to 0.9 m: the
 * coarse tile rises 1.5 m across the platform, where the photos show a
 * level square; the steps are kept true to the photos.
 *
 * Colours from the daylight photos: the banco plaster sampled #a0876c to
 * #a68d72 in sun (jm, which is hazy), #877667 (ag); used warmer and
 * lighter, #c4a079, inside the lead's reading of jm (#b7936c-#c4a07a); the toron palm wood greyer and darker; doors in
 * shade read dark brown; the eggs white.
 *
 * Night: the mosque is floodlit for festivals; the walls carry a soft
 * `_FLOODLIGHT`.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - jm "Great Mosque of Djenne 2.jpg", JM, CC BY 2.0
 *   https://commons.wikimedia.org/wiki/File:Great_Mosque_of_Djenne_2.jpg
 * - ag "Great Mosque of Djenné 1.jpg", Andy Gilham, CC BY-SA 3.0
 *   https://commons.wikimedia.org/wiki/File:Great_Mosque_of_Djenn%C3%A9_1.jpg
 * - rz "Djenne great mud mosque.jpg", Ruud Zwart, CC BY-SA 3.0
 *   https://commons.wikimedia.org/wiki/File:Djenne_great_mud_mosque.jpg
 * - ju "The Great Mosque, Djenne.jpg", Jurgen, CC BY 2.0
 *   https://commons.wikimedia.org/wiki/File:The_Great_Mosque,_Djenne.jpg
 * - qv "Moschee von Djenné.jpg", qiv, CC BY-SA 2.0
 *   https://commons.wikimedia.org/wiki/File:Moschee_von_Djenn%C3%A9.jpg
 * - ab "Djenné Moschee(Dach)1990.jpg", Albert Backer, CC BY-SA 3.0 (the roof)
 *   https://commons.wikimedia.org/wiki/File:Djenn%C3%A9_Moschee(Dach)1990.jpg
 * Look-only: none.
 *
 * Doubts: the platform's outline and its stairs (only the east and north
 * flights are photographed); the west and south faces (no clear photo:
 * drawn with the same pilaster rhythm); the courtyard galleries' arches;
 * OSM puts the north tower 3 m further east than the others, which is
 * kept.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { TAU, lathe, norm, quad, save, type Mat, type XY } from './cairo-cairo-tower'
import { block, frustum, pyramid, rectRing } from './casablanca-hassan-ii-mosque'

const P0 = 3 // the platform's top
const WALL = P0 + 8.4, COURT = P0 + 6.6

/** A rounded pinnacle cone on a circle of radius r at (x, y), from z0 to the tip. */
function pinnacle(p: Part, x: number, y: number, r: number, z0: number, tip: number, seg: number) {
  const h = tip - z0
  const prof: [number, number][] = seg >= 8 ? [[r, z0], [r * 0.94, z0 + 0.35 * h], [r * 0.72, z0 + 0.7 * h], [r * 0.3, z0 + 0.94 * h], [0, tip]]
    : [[r, z0], [r * 0.82, z0 + 0.55 * h], [r * 0.35, z0 + 0.9 * h], [0, tip]]
  lathe(p, x, y, prof, seg, { smooth: true })
}

/** A rounded buttress pilaster on a wall face (outward normal n), up to its pinnacle tip. */
function pilaster(p: Part, x: number, y: number, n: XY, r: number, z0: number, ztop: number, tip: number, seg: number) {
  const a = Math.atan2(n[1], n[0])
  // the half proud of the wall, then the whole column above the wall top
  lathe(p, x, y, [[r, z0], [r * 0.92, ztop]], seg, { smooth: true, a0: a - Math.PI / 2, a1: a + Math.PI / 2 })
  pinnacle(p, x, y, r * 0.92, ztop, tip, seg * 2 - 2)
}

/** A toron stick: a square palm-wood beam 0.6 m out of a face with outward normal n. */
function stick(p: Part, x: number, y: number, z: number, n: XY, out = 0.65, t = 0.17) {
  const u: XY = [-n[1], n[0]]
  const c = (a: number, b: number, d: number): V3 => [x + n[0] * d + u[0] * a, y + n[1] * d + u[1] * b * 0 + u[1] * a, z + b]
  const h = t / 2
  const N: V3 = [n[0], n[1], 0], U: V3 = [u[0], u[1], 0]
  quad(p, c(-h, -h, out), c(h, -h, out), c(h, h, out), c(-h, h, out), N)
  quad(p, c(-h, h, -0.1), c(-h, h, out), c(h, h, out), c(h, h, -0.1), [0, 0, 1])
  quad(p, c(-h, -h, -0.1), c(h, -h, -0.1), c(h, -h, out), c(-h, -h, out), [0, 0, -1])
  quad(p, c(h, -h, -0.1), c(h, h, -0.1), c(h, h, out), c(h, -h, out), U)
  quad(p, c(-h, -h, -0.1), c(-h, -h, out), c(-h, h, out), c(-h, h, -0.1), [-U[0], -U[1], 0])
}

/** A flat panel on a face, centred at (x, y), normal n: w wide, z0..z1, round head optional. */
function opening(p: Part, x: number, y: number, n: XY, w: number, z0: number, z1: number, arch: boolean, segs = 6) {
  const u: XY = [-n[1], n[0]], o: XY = [x + n[0] * 0.05, y + n[1] * 0.05], r = w / 2
  const P = (s: number, z: number): V3 => [o[0] + u[0] * s, o[1] + u[1] * s, z]
  const pts: V3[] = [P(-r, z0), P(r, z0)]
  if (arch) for (let i = 0; i <= segs; i++) { const a = (Math.PI * i) / segs; pts.push(P(r * Math.cos(a), z1 - r + r * Math.sin(a))) }
  else pts.push(P(r, z1), P(-r, z1))
  for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1], [0, 0], [0, 0], [0, 0], [[n[0], n[1], 0], [n[0], n[1], 0], [n[0], n[1], 0]])
}

type Wall = { a: XY; b: XY; n: XY; top: number; tip: number; skip?: [number, number][] }

export function build(detail: boolean): Mat[] {
  const mud = new Part(), shade = new Part(), wood = new Part(), egg = new Part()
  const seg = detail ? 6 : 3 // half-round segments of a pilaster

  // ── The platform: 3 m of banco with a low parapet and round-headed posts
  const PX0 = -34, PX1 = 35.5, PY0 = -35, PY1 = 34
  block(mud, PX0, PY0, PX1, PY1, 0, P0, 0.3)
  const parapet = (x0: number, y0: number, x1: number, y1: number) => block(mud, x0, y0, x1, y1, P0 - 0.1, P0 + 1.0, 0.15)
  // the parapet, broken by the east stair (y -0.4..4.2) and the north stair (x 12.6..17.2)
  parapet(PX1 - 0.7, PY0, PX1, -0.4); parapet(PX1 - 0.7, 4.2, PX1, PY1)
  parapet(PX0, PY1 - 0.7, 12.6, PY1); parapet(17.2, PY1 - 0.7, PX1, PY1)
  parapet(PX0, PY0, PX1, PY0 + 0.7); parapet(PX0, PY0, PX0 + 0.7, PY1)
  const posts: XY[] = [[PX1 - 0.35, -1.2], [PX1 - 0.35, 5.0], [11.8, PY1 - 0.35], [18.0, PY1 - 0.35]]
  for (let y = PY0 + 5; y < PY1 - 3; y += 8) if (y < -4 || y > 9) posts.push([PX1 - 0.35, y])
  for (let x = PX0 + 5; x < PX1 - 3; x += 8) { if (x < 9 || x > 21) posts.push([x, PY1 - 0.35]); posts.push([x, PY0 + 0.35]) }
  for (let y = PY0 + 5; y < PY1 - 3; y += 8) posts.push([PX0 + 0.35, y])
  for (const [x, y] of posts) {
    const big = Math.abs(x - (PX1 - 0.35)) < 0.1 && y > -2 && y < 6
    pinnacle(mud, x, y, big ? 1.1 : 0.75, P0 - 0.1, P0 + (big ? 4.0 : 2.2), detail ? 10 : 6)
  }
  // the stairs: up the east face to the central tower, and to the north door
  for (let i = 0; i < 5; i++) {
    const d = 3.2 - i * 0.64
    block(mud, PX1, -0.2, PX1 + d, 4.0, 0, P0 * ((i + 1) / 5))
    block(mud, 12.8, PY1, 17.0, PY1 + d, 0, P0 * ((i + 1) / 5))
  }

  // ── The courtyard block: walls round the open court
  const CX0 = -27, CX1 = 4.5, CY0 = -29, CY1 = 25.8, HX0 = -23.8, HX1 = -0.7, HY0 = -25, HY1 = 22.5
  block(mud, CX0, CY0, HX0, CY1, P0, COURT)
  block(mud, HX0, CY0, CX1, HY0, P0, COURT)
  block(mud, HX0, HY1, CX1, CY1, P0, COURT)
  block(mud, HX1, HY0, CX1, HY1, P0, COURT)
  // the galleries round the court: arched openings on its inner faces
  const gal = (x: number, y: number, n: XY) => opening(shade, x, y, n, 2.2, P0, P0 + 3.6, true, detail ? 6 : 3)
  for (let y = HY0 + 2.5; y < HY1 - 1.5; y += 4) { gal(HX0, y, [1, 0]); gal(HX1, y, [-1, 0]) }
  for (let x = HX0 + 2.5; x < HX1 - 1.5; x += 4) { gal(x, HY0, [0, 1]); gal(x, HY1, [0, -1]) }

  // ── The prayer hall, to the qibla wall
  const E: [number, number, number][] = [[-24.6, -9.0, 24.6], [-9.0, 4.8, 26.0], [4.8, 19.0, 27.5], [19.0, 26.4, 26.8]]
  for (const [y0, y1, x1] of E) block(mud, CX1 - 0.2, y0, x1, y1, P0, WALL)
  // corner buttresses: rectangular, topped by pinnacles
  for (const [x, y] of [[24.0, -24.0], [26.2, 25.8], [-26.4, -28.4], [-26.4, 25.2], [3.9, -28.4]] as XY[]) {
    const top = x > 0 && Math.abs(y) < 27 ? WALL + 0.6 : COURT + 0.6
    block(mud, x - 1.3, y - 1.3, x + 1.3, y + 1.3, P0, top, 0.25)
    pinnacle(mud, x, y, 1.1, top, top + 2.6, detail ? 10 : 6)
  }

  // ── The pilasters, each with its pinnacle, along every outer wall
  const towers: [number, number, number, number][] = [ // y0, y1, face x, body top
    [-15.2, -9.2, 28.7, P0 + 11.4], [-1.7, 5.5, 29.9, P0 + 12.8], [13.15, 19.15, 32.9, P0 + 11.4]]
  const walls: Wall[] = [
    ...E.map(([y0, y1, x]) => ({ a: [x, y0] as XY, b: [x, y1] as XY, n: [1, 0] as XY, top: WALL, tip: WALL + 2.1, skip: towers.map(([t0, t1]) => [t0 - 0.9, t1 + 0.9] as [number, number]) })),
    { a: [CX1, -24.6], b: [24.6, -24.6], n: [0, -1], top: WALL, tip: WALL + 2.1 },
    { a: [CX1, 26.4], b: [26.8, 26.4], n: [0, 1], top: WALL, tip: WALL + 2.1, skip: [[0, 9], [11.4, 18.3]] },
    { a: [CX0, CY0], b: [CX1, CY0], n: [0, -1], top: COURT, tip: COURT + 1.9 },
    { a: [CX0, CY1], b: [CX1, CY1], n: [0, 1], top: COURT, tip: COURT + 1.9, skip: [[0, 9]] },
    { a: [CX0, CY0], b: [CX0, CY1], n: [-1, 0], top: COURT, tip: COURT + 1.9 },
  ]
  const R = 0.85, STEP = 2.1
  const pilasters: { x: number; y: number; n: XY; top: number }[] = []
  for (const w of walls) {
    const L = Math.hypot(w.b[0] - w.a[0], w.b[1] - w.a[1]), u: XY = [(w.b[0] - w.a[0]) / L, (w.b[1] - w.a[1]) / L]
    const n = Math.floor((L - 2.4) / STEP)
    for (let k = 0; k <= n; k++) {
      const s = 1.2 + ((L - 2.4) * k) / Math.max(1, n)
      const x = w.a[0] + u[0] * s, y = w.a[1] + u[1] * s
      const along = Math.abs(u[0]) > 0.5 ? x : y
      if (w.skip?.some(([a, b]) => along > a && along < b)) continue
      pilaster(mud, x, y, w.n, R, P0, w.top, w.tip, seg)
      pilasters.push({ x: x + w.n[0] * R, y: y + w.n[1] * R, n: w.n, top: w.top })
    }
  }

  // ── The three towers on the qibla wall: battered shafts, pilastered
  // corners with pinnacles, a top stage and the cone with its egg
  towers.forEach(([y0, y1, fx, top], i) => {
    const central = i === 1, cy = (y0 + y1) / 2, hw = (y1 - y0) / 2, x0 = fx - 6.5
    const bat = 0.45 // the batter: each face leans in this much over the height
    frustum(mud, rectRing(x0, y0, fx, y1), P0, rectRing(x0, y0 + bat, fx - bat, y1 - bat), top)
    // corner pilasters rising to pinnacles
    // (the central tower only; the outer ones have plain battered faces)
    if (central) for (const sy of [-1, 1]) pilaster(mud, fx - 0.3 - bat / 2, cy + sy * (hw - 0.3 - bat / 2), [1, 0], 0.75, P0, top, top + 1.6, seg + 1)
    // the top: a stepped square pyramid tapering to a pointed pinnacle with
    // its ostrich egg, toron sticking out of the upper steps (jm)
    const tcx = fx - 3.25 - bat / 2, hx = (6.5 - bat) / 2 - 0.15, hy = hw - bat - 0.15
    const tiers = central ? 4 : 3, th = central ? 1.0 : 0.95, shrink = central ? 0.6 : 0.62
    let z = top, ax = hx, ay = hy
    for (let t = 0; t < tiers; t++) {
      const bx = ax - shrink * 0.35, by = ay - shrink * 0.35
      frustum(mud, rectRing(tcx - ax, cy - ay, tcx + ax, cy + ay), z, rectRing(tcx - bx, cy - by, tcx + bx, cy + by), z + th)
      if (detail) for (const s2 of t < tiers - 1 ? [-0.5, 0.5] : [0]) {
        stick(wood, tcx + bx, cy + s2 * by, z + th * 0.55, [1, 0], 0.7)
        stick(wood, tcx + s2 * bx, cy + by, z + th * 0.55, [0, 1], 0.7)
        stick(wood, tcx + s2 * bx, cy - by, z + th * 0.55, [0, -1], 0.7)
      }
      z += th; ax = bx - shrink * 0.65; ay = by - shrink * 0.65
    }
    const tipz = central ? P0 + 17.0 : P0 + 16.0, tx = tcx
    // the pointed pinnacle: a square spire on the last step
    pyramid(mud, rectRing(tcx - ax - 0.2, cy - ay - 0.2, tcx + ax + 0.2, cy + ay + 0.2), z, [tcx, cy, tipz])
    if (detail) for (const zz of [z + (tipz - z) * 0.35, z + (tipz - z) * 0.62]) {
      const k = 1 - (zz - z) / (tipz - z), e = (ax + 0.2) * k
      stick(wood, tcx + e, cy, zz, [1, 0], 0.8); stick(wood, tcx, cy + e, zz, [0, 1], 0.8); stick(wood, tcx, cy - e, zz, [0, -1], 0.8)
    }
    if (central) {
      // the door at the platform, and a round window high up
      opening(wood, fx - bat * 0.05, cy, [1, 0], 2.3, P0, P0 + 3.4, false)
    }
    if (detail) {
      // toron: rows of sticks on the face and the sides
      for (let z = P0 + 1.8; z < top - 0.6; z += 1.45) {
        const f = (z - P0) / (top - P0), xf = fx - bat * f
        const across = central ? [-2.4, -1.2, 1.2, 2.4] : [-1.6, 1.6]
        for (const s of across) stick(wood, xf, cy + s, z, [1, 0])
        for (const sy of [-1, 1]) for (const dx of [-1.4, -3.6, -5.6]) stick(wood, x0 + 6.5 + dx, cy + sy * (hw - bat * f), z, [0, sy])
      }
    }
  })

  // ── The north stair tower and the entrance porch
  block(mud, 1.6, 22.4, 7.6, 29.4, P0, P0 + 12.5, 0.3)
  for (const [x, y] of [[2.1, 28.9], [7.1, 28.9], [2.1, 22.9], [7.1, 22.9]] as XY[]) pinnacle(mud, x, y, 0.5, P0 + 12.5, P0 + 13.6, detail ? 8 : 5)
  block(mud, 12.4, 24, 17.3, 28.5, P0, P0 + 10.4, 0.2)
  for (const x of [12.9, 16.8]) pinnacle(mud, x, 28.0, 0.5, P0 + 10.4, P0 + 12.0, detail ? 8 : 5)
  opening(shade, 14.85, 28.5, [0, 1], 2.6, P0, P0 + 6.5, false)
  opening(shade, 4.6, 29.4, [0, 1], 1.4, P0, P0 + 2.6, false)
  // small windows on the north and south walls (ag)
  for (const x of [9.5, 20, 23]) opening(shade, x, 26.4 + R + 0.02, [0, 1], 0.7, P0 + 4.2, P0 + 5.1, false)
  for (const x of [8, 13, 18, 22]) opening(shade, x, -24.6 - R - 0.02, [0, -1], 0.7, P0 + 4.2, P0 + 5.1, false)

  if (detail) {
    // toron on every pilaster and buttress, and the roof's vent bowls
    for (const q of pilasters) for (let z = P0 + 1.6; z < q.top - 0.5; z += 1.6) stick(wood, q.x, q.y, z, q.n, 0.6)
    for (let x = 7; x < 24; x += 3.4) for (let y = -22; y < 25; y += 3.4)
      lathe(mud, x, y, [[0.45, WALL], [0.42, WALL + 0.25], [0.2, WALL + 0.42], [0, WALL + 0.45]], 6, { smooth: true })
  }

  const lit = (q: V3, n: V3) => (n[2] > 0.8 ? 0.2 : q[2] > P0 ? 0.6 : 0.3)
  return [
    { part: mud, material: { ...finish('djenne-banco', 0xc4a079), floodlight: lit } },
    { part: shade, material: finish('djenne-banco-shade', 0x76604d) },
    { part: wood, material: finish('djenne-toron', 0x8c765f) },
    { part: egg, material: PALETTE.trim },
  ]
}

if (import.meta.main) {
  const extras = { bearing: 1.0, osm: 'relation/11916275', height: P0 + 17 }
  await save('djenne-great-mosque.glb', 'Great Mosque of Djenné', build(false), 6500, 250_000, extras)
  await save('djenne-great-mosque.detail.glb', 'Great Mosque of Djenné', build(true), 40_000, 1536 * 1024, extras)
}
void norm; void TAU
