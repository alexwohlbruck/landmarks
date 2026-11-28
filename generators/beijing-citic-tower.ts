/**
 * CITIC Tower (China Zun), Beijing CBD — original procedural geometry, CC0-1.0.
 * bun generators/beijing-citic-tower.ts   (writes the low model and the detail LOD)
 *
 * Frame: bearing 0 (model +y = north; the OSM outline's sides run within 2
 * degrees of the compass). Origin = the centre of the OSM outline way/599547918
 * (116.460236 E, 39.911501 N), on the ground; the tower axis stands on it.
 * y = 0 is the plaza; elevation 0.
 *
 * Form, as read from OSM and the photos:
 * - a square plan with broadly rounded corners, 78 m at the foot, that
 *   narrows in one smooth curve to a waist of ~56 m at ~360-400 m and flares
 *   out again in the last ~100 m to ~72 m at the rim: the profile of a zun, the bronze ritual vessel;
 * - the top rim rises at the corners and dips ~5 m at the middle of each
 *   face (the flared lip of the vessel); the roof garden at 522 m sits inside
 *   the glass parapet;
 * - the curtain wall's silver vertical fins, drawn as proud 3D fins at about
 *   twice the real spacing (five per face and one per corner in the low
 *   model), running the full height and following the curve;
 * - the dark louvre bands of the eight double-height mechanical floors
 *   (5-6, 17-18, 29-30, 43-44, 57-58, 73-74, 87-88, 103-104), across the
 *   middle of each face, which read as rows of slots between the fins.
 *
 * Evidence
 * - OSM (API map call, fetched 2026-11-27): outline way/599547918 (height 528,
 *   108 levels, name 中国尊, wikidata Q197833). The assignment named
 *   Q5011918, which is the CITIC Tower in Hong Kong; Q197833 is this tower.
 * - Published: 527.7 m, 109 floors, roof garden 522 m, mechanical floors as
 *   above (Wikipedia "CITIC Tower (Beijing)").
 * - Photos (Wikimedia Commons, daylight):
 *   "China Zun 05-11-2018.jpg", Milkomède, CC BY-SA 4.0, face-on from the
 *   west-south-west at a distance: profile and louvre bands, measured;
 *   https://commons.wikimedia.org/wiki/File:China_Zun_05-11-2018.jpg
 *   "CITIC Tower 2021.jpg", N509FZ, CC BY-SA 4.0, telephoto skyline: the
 *   flare of the top and the waist;
 *   https://commons.wikimedia.org/wiki/File:CITIC_Tower_2021.jpg
 *   "China Zun head.jpg", 維基小霸王, CC BY-SA 4.0: the crown, corner-on: the
 *   rim dipping between corners, the fins, the top louvre row;
 *   https://commons.wikimedia.org/wiki/File:China_Zun_head.jpg
 *   "China Zun from 300X (20180628141217).jpg", N509FZ, CC BY-SA 4.0,
 *   corner-on: rounded corners and the base flare;
 *   https://commons.wikimedia.org/wiki/File:China_Zun_from_300X_(20180628141217).jpg
 *   "China Zun.jpg", 維基小霸王, CC BY-SA 4.0, and "China Zun and Samsung China
 *   Headquarters.jpg", Bairuilong, CC BY-SA 4.0: colour, fins, bands;
 *   https://commons.wikimedia.org/wiki/File:China_Zun.jpg
 *   https://commons.wikimedia.org/wiki/File:China_Zun_and_Samsung_China_Headquarters.jpg
 * - No lidar, NAIP or Mapillary here (batch notes).
 * - Look-only references: none.
 *
 * Numbers
 * - Published: 527.7 m top, 522 m roof, the mechanical floors.
 * - Measured (OSM): 78.3 m square at the foot.
 * - Measured (photo, 2018 face-on, scaled by the band spacing): width ratios
 *   top / waist 1.25-1.27, 143 m / waist 1.22; waist at ~340-360 m; the rim
 *   dip ~4.5 m.
 * - Estimated: the corner radius (11 m at the foot, 9 at the waist, 12 at the
 *   top); band heights (floor n at ~4.8 n m) and their width (half a face);
 *   fin size (1.3 m wide, 1.2 m proud in the low model: bolder and sparser
 *   than the real fins so they read); colours sampled from the 2018 and 300X
 *   photos (#7b95a5 glass in shade, #d3e2ea lit; fins #d7dcdc).
 * - Invented: none of the massing.
 *
 * Doubts
 * - The corner diagrid (mega-braces) stands behind the glass and shows in no
 *   licensed photo; it is not drawn.
 * - The face sag at the top (2 m) and the corner radii are estimated.
 * - The lobby and entrances at the foot are not modelled (no clear photo).
 *
 * Night: the curtain wall glows as windows; the fins and the crown rim are
 * floodlit (the tower's fins carry light lines at night); the louvre bands
 * stay dark.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { face, saveLods, type Layer } from './auckland-sky-tower'
import { gridSurface } from './shanghai-tower'

const TOP = 527.7
const ROOF = 522
const DIP = 5 // rim dip at mid-face

// half-side by height
const PROFILE: [number, number][] = [[0, 39.1], [30, 38.2], [80, 36.3], [143, 34.0], [200, 32.0], [260, 30.0], [320, 28.4], [360, 28.0], [405, 28.2], [440, 28.9], [470, 30.3], [495, 32.5], [512, 34.5], [522, 35.6], [527.7, 36.0]]
function smooth(P: [number, number][], z: number): number {
  if (z <= P[0][0]) return P[0][1]
  for (let i = 0; i < P.length - 1; i++) {
    const [z0, r0] = P[i], [z1, r1] = P[i + 1]
    if (z <= z1) {
      const rm = i > 0 ? P[i - 1][1] : r0 - (r1 - r0), rp = i + 2 < P.length ? P[i + 2][1] : r1 + (r1 - r0)
      const t = (z - z0) / (z1 - z0), t2 = t * t, t3 = t2 * t
      return 0.5 * (2 * r0 + (-rm + r1) * t + (2 * rm - 5 * r0 + 4 * r1 - rp) * t2 + (-rm + 3 * r0 - 3 * r1 + rp) * t3)
    }
  }
  return P[P.length - 1][1]
}
const half = (z: number) => smooth(PROFILE, z)
const cornerR = (z: number) => smooth([[0, 11], [355, 9], [527.7, 12]], z)
const sag = (z: number) => (z < 440 ? 0 : 2 * ((z - 440) / (TOP - 440)) ** 2)

/**
 * A point on the plan ring at height z. `face` 0..3 (normal at 0/90/180/270 deg
 * math angle), `u` in [0, 1): the first `split` of it runs along the straight
 * face, the rest round the corner after it. Returns the point and its outward
 * horizontal normal.
 */
const SPLIT = 0.75
function ringPt(z: number, f: number, u: number, out = 0): { p: V3; n: V3; mid: number } {
  const a = half(z), rc = cornerR(z), L = a - rc
  const th = (f * Math.PI) / 2
  const n: V3 = [Math.cos(th), Math.sin(th), 0], t: V3 = [-Math.sin(th), Math.cos(th), 0]
  if (u < SPLIT) {
    const s = -1 + (2 * u) / SPLIT // -1..1 along the face
    const off = s * L, sg = sag(z) * (1 - s * s)
    const r = a - sg + out
    return { p: [n[0] * r + t[0] * off, n[1] * r + t[1] * off, z], n, mid: 1 - s * s }
  }
  const v = (u - SPLIT) / (1 - SPLIT) // 0..1 round the corner
  const c: V3 = [(n[0] + t[0]) * L, (n[1] + t[1]) * L, 0]
  const ang = th + (v * Math.PI) / 2
  const m: V3 = [Math.cos(ang), Math.sin(ang), 0]
  return { p: [c[0] + m[0] * (rc + out), c[1] + m[1] * (rc + out), z], n: m, mid: 0 }
}
/** rim height at a ring position: corners at TOP, mid-face DIP lower */
const rimZ = (f: number, u: number) => TOP - 0.6 - DIP * ringPt(TOP, f, u).mid // the lip rises 0.6 m over it, to 527.7

type Set = { glass: Part; fin: Part; louvre: Part; roof: Part }
const mk = (): Set => ({ glass: new Part(), fin: new Part(), louvre: new Part(), roof: new Part() })
const nrm = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / l, v[1] / l, v[2] / l]
}

/** columns as (face, u) pairs, ccw from above */
function columns(nf: number, nc: number): [number, number][] {
  const cols: [number, number][] = []
  for (let f = 0; f < 4; f++) {
    for (let i = 0; i < nf; i++) cols.push([f, (SPLIT * i) / nf])
    for (let i = 0; i < nc; i++) cols.push([f, SPLIT + ((1 - SPLIT) * i) / nc])
  }
  return cols
}

/** proud fin along a column, from z0 to the rim, `w` wide and `d` proud */
function fin(p: Part, f: number, u: number, zs: number[], w: number, d: number) {
  const zt = rimZ(f, u)
  const lv = [...zs.filter((z) => z < zt - 1), zt]
  const sec = lv.map((z) => {
    const { p: c, n } = ringPt(z, f, u)
    const t: V3 = [-n[1], n[0], 0], h = w / 2
    return {
      l0: [c[0] - t[0] * h - n[0] * 0.3, c[1] - t[1] * h - n[1] * 0.3, z] as V3,
      l1: [c[0] - t[0] * h + n[0] * d, c[1] - t[1] * h + n[1] * d, z] as V3,
      r1: [c[0] + t[0] * h + n[0] * d, c[1] + t[1] * h + n[1] * d, z] as V3,
      r0: [c[0] + t[0] * h - n[0] * 0.3, c[1] + t[1] * h - n[1] * 0.3, z] as V3,
      n, t,
    }
  })
  for (let k = 0; k < sec.length - 1; k++) {
    const a = sec[k], b = sec[k + 1]
    face(p, [a.l0, a.l1, b.l1, b.l0], [-a.t[0], -a.t[1], 0])
    face(p, [a.r1, a.r0, b.r0, b.r1], [a.t[0], a.t[1], 0])
    p.tri(a.l1, a.r1, b.r1, undefined, undefined, undefined, [a.n, a.n, b.n])
    p.tri(a.l1, b.r1, b.l1, undefined, undefined, undefined, [a.n, b.n, b.n])
  }
  const e = sec[sec.length - 1] // cap
  face(p, [e.l1, e.r1, e.r0, e.l0], [0, 0, 1])
}

const BANDS = [6, 18, 30, 44, 58, 74, 88, 104].map((n) => 4.8 * n - 2) // top of each double floor

function build(s: Set, d: boolean) {
  const nf = d ? 16 : 6, nc = d ? 6 : 3
  const cols = columns(nf, nc)
  const N = cols.length
  const levels: number[] = []
  if (d) for (let z = 0; z < TOP - 12; z += 6) levels.push(z)
  else levels.push(0, 15, 35, 60, 90, 125, 165, 210, 255, 300, 340, 380, 420, 455, 485, 505)
  const ring = (z: number, out = 0) => cols.map(([f, u]) => ringPt(z, f, u, out).p)
  const rim = (out = 0) => cols.map(([f, u]) => ringPt(TOP, f, u, out).p.map((v, k) => (k === 2 ? rimZ(f, u) : v)) as V3)
  // curtain wall up to the rim
  const g = [...levels.map((z) => ring(z)), rim()]
  gridSurface(g, true, () => s.glass, (i) => cols[i][1] === 0 || cols[i][1] === SPLIT)
  // the rim's lip: a pale cap that rolls over the top edge, then the parapet's inside
  const lip = 0.9
  const r0 = rim(), r1 = cols.map(([f, u]) => { const q = ringPt(TOP, f, u, lip).p; return [q[0], q[1], rimZ(f, u) - 1.2] as V3 })
  const r2 = cols.map(([f, u]) => { const q = ringPt(TOP, f, u, lip).p; return [q[0], q[1], rimZ(f, u) + 0.6] as V3 })
  const r3 = cols.map(([f, u]) => { const q = ringPt(TOP, f, u, -1.6).p; return [q[0], q[1], rimZ(f, u) + 0.6] as V3 })
  gridSurface([r1, r2], true, () => s.fin)
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    face(s.fin, [r1[i], r1[j], r0[j], r0[i]], [0, 0, -1])
    face(s.fin, [r2[i], r2[j], r3[j], r3[i]], [0, 0, 1])
  }
  // parapet inside face and the roof garden
  const inTop = r3, inBot = cols.map(([f, u]) => ringPt(ROOF, f, u, -1.6).p)
  gridSurface([[...inBot].reverse(), [...inTop].reverse()], true, () => s.glass)
  for (let i = 0; i < N; i++) face(s.roof, [[0, 0, ROOF], inBot[i], inBot[(i + 1) % N]], [0, 0, 1])

  // louvre bands: across the middle half of each face, a little proud
  const bh = d ? 4.8 : 5.5
  for (const zt of BANDS) {
    const z0 = zt - bh, z1 = zt
    for (let f = 0; f < 4; f++) {
      const us: number[] = []
      const nseg = d ? 8 : 4
      for (let k = 0; k <= nseg; k++) us.push(SPLIT * (0.25 + (0.5 * k) / nseg))
      const lo = us.map((u) => ringPt(z0, f, u, 0.15).p), hi = us.map((u) => ringPt(z1, f, u, 0.15).p)
      const n = ringPt(z0, f, SPLIT / 2).n
      for (let k = 0; k < nseg; k++) face(s.louvre, [lo[k], lo[k + 1], hi[k + 1], hi[k]], n)
    }
  }

  // fins: on the faces and round the corners
  const finZ = d ? levels.filter((_, k) => k % 2 === 0) : levels
  const W = d ? 0.9 : 1.3, D = d ? 0.9 : 1.2
  const perFace = d ? 11 : 5, perCorner = d ? 3 : 1
  for (let f = 0; f < 4; f++) {
    for (let k = 0; k < perFace; k++) fin(s.fin, f, SPLIT * ((k + 1) / (perFace + 1)), finZ, W, D)
    for (let k = 0; k < perCorner; k++) fin(s.fin, f, SPLIT + (1 - SPLIT) * ((k + 0.5) / perCorner), finZ, W, D)
  }
}

// ---- Materials and output ----------------------------------------------------------------------

const GLASS: MaterialSpec = { ...PALETTE.window, color: 0x8ba3b5 }
const FIN: MaterialSpec = { ...finish('cz-silver', 0xd0d7dc, 0.45), floodlight: (p, n) => (p[2] > 515 ? 0.9 : n[2] > 0.7 ? 0.2 : 0.45) }
const LOUVRE: MaterialSpec = finish('cz-louvre', 0x5b6672, 0.6)
const ROOFM: MaterialSpec = PALETTE.roof

const low = mk(), det = mk()
build(low, false)
build(det, true)
const layers = (s: Set): Layer[] => [
  { part: s.glass, material: GLASS },
  { part: s.fin, material: FIN },
  { part: s.louvre, material: LOUVRE },
  { part: s.roof, material: ROOFM },
]

if (import.meta.main) {
  await saveLods('beijing-citic-tower', 'CITIC Tower', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the centre of the OSM outline, on the plaza',
    bearing: 0, height: TOP,
  }, 5000)
}
