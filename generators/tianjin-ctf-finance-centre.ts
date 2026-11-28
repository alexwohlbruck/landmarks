/**
 * Tianjin CTF Finance Centre, Binhai, Tianjin — original procedural geometry, CC0-1.0.
 * bun generators/tianjin-ctf-finance-centre.ts   (writes the low model and the detail LOD)
 *
 * Frame: bearing 24 (model +y points 24 degrees east of north: the OSM
 * outline way/764674838 is a square whose sides run that way). Origin = the
 * centre of that outline (117.698459 E, 39.021374 N), on the ground; the tower
 * axis stands on it. y = 0 is the plaza; elevation 0.
 *
 * Form, as read from OSM and the photos:
 * - a square plan with soft corners, 78 m at the foot, flaring out at
 *   the foot in a concave sweep, nearly straight from ~200 to ~350 m, then
 *   tapering faster and rounding into a bullet-shaped top; the corners get
 *   rounder as it rises, so the top is almost round;
 * - the eight sloping mega-columns, drawn as bold silver ribs proud of the
 *   glass: on each face a pair crosses near the face's centre at ~110 m,
 *   parts to the corners by ~290 m (meeting the pair from the next face) and
 *   crosses again near the top, looping into the crown;
 * - the open crown above the top floor (439 m): the envelope carried on as a
 *   paler, lighter skin, open at the top, its rim rising over the middle of
 *   each face in four lobes, the roof of the top floors inside it;
 * - the detail LOD adds vertical fins in the glass (four per face, far sparser than
 *   the real ones) and draws the crown skin translucent over a ring frame.
 *
 * Evidence
 * - OSM (API map call, fetched 2026-11-27): outline way/764674838 (height
 *   530, 97 levels, name 天津周大福金融中心, wikidata Q10939987).
 * - Published: 530 m, 97 floors, top floor 439.4 m; eight sloping mega-columns
 *   following a line between the centres and corners of the elevations;
 *   square plan with rounded corners; a "dematerialized" crown looped by the
 *   mega-columns (Wikipedia "Tianjin CTF Finance Centre"; SOM).
 * - Photos (Wikimedia Commons, daylight):
 *   "Tianjin CTF Finance Centre.jpg", H2v5o68z, CC BY 4.0, face-on from a
 *   distance: the profile, measured row by row (below), ribs, crown;
 *   https://commons.wikimedia.org/wiki/File:Tianjin_CTF_Finance_Centre.jpg
 *   "天津周大福金融中心北1.jpg", KangTyngrwey, CC BY-SA 4.0, from the north:
 *   the rib crossings (~110 m and near the top), crown lobes, foot;
 *   https://commons.wikimedia.org/wiki/File:%E5%A4%A9%E6%B4%A5%E5%91%A8%E5%A4%A7%E7%A6%8F%E9%87%91%E8%9E%8D%E4%B8%AD%E5%BF%83%E5%8C%971.jpg
 *   "Tianjin CTF Finance Centre, 24 of 24(cropped).jpg", BD2412, CC BY-SA 4.0:
 *   the crown loops and the ribs at the corners;
 *   https://commons.wikimedia.org/wiki/File:Tianjin_CTF_Finance_Centre,_24_of_24(cropped).jpg
 *   "Tianjin CTF Finance Centre in 2019.jpg", BD2412, CC BY-SA 4.0: colour;
 *   https://commons.wikimedia.org/wiki/File:Tianjin_CTF_Finance_Centre_in_2019.jpg
 * - No lidar, NAIP or Mapillary here (batch notes).
 * - Look-only references: none.
 *
 * Numbers
 * - Published: 530 m top, 439.4 m top floor.
 * - Measured (OSM): the bearing; a 67 m square, which the model overruns:
 *   two photos (face-on and corner-on) give a width/height ratio ~1.4 times
 *   what a 67 m foot allows, and the published floor area (252,144 m2 over
 *   97 floors) needs a ~78 m foot with this taper, so the whole profile is
 *   scaled by 1.165 (78 m at the foot, ~50 m at mid-height).
 * - Measured (photo, H2v5o68z, face-on, scaled to 530 m and to the OSM foot):
 *   width relative to 77 m (the profile's shape): 0.955 at 107 m, 0.89 at 138, 0.82 at 169, 0.756
 *   at 199, 0.724 at 276, 0.69 at 352, 0.614 at 414, 0.48 at 475, 0.36 at 521.
 * - Measured (photos): rib crossings at ~110 m and ~470 m, at the corners at
 *   ~290 m.
 * - Estimated: the corner radii (0.35 of the half-side at the foot to 0.95 at
 *   the top); the rim lobes (6 m); the rib size (2.4 m wide, 1.6 m proud in
 *   the low model, bolder than the real cladding so they read at phone size);
 *   colours sampled from the H2v5o68z and BD2412 photos (#4e6393-#54628f
 *   glass in shade, #b2b7cd-#c0bfc8 lit; pulled to #7f93ad).
 * - Invented: none of the massing.
 *
 * Doubts
 * - The size: OSM's 67 m square is smaller than the photos and the floor
 *   area suggest; the model is 78 m at the foot (estimate). Trees hide the
 *   foot in every profile photo.
 * - The rib path between the photographed crossings is smoothed; the real
 *   columns are straight segments between kinks.
 * - The real facade's vertical fins are per panel and staggered; they are
 *   left to the colour in the low model.
 * - Lobby canopies at the foot are not modelled.
 *
 * Night: the curtain wall glows as windows; the ribs and the crown are
 * floodlit (the crown glows at night).
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { face, saveLods, type Layer } from './auckland-sky-tower'
import { gridSurface } from './shanghai-tower'

const TOP = 530
const GLASS_TOP = 442 // top floor 439.4 + its roof
const ROOF = 470 // roof of the plant floors inside the crown
const LOBE = 6

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
// half-side (m) by height
const HALF: [number, number][] = [[0, 33.5], [30, 31.9], [77, 30.0], [107, 28.7], [138, 26.7], [169, 24.6], [199, 22.8], [237, 22.0], [276, 21.7], [314, 21.25], [352, 20.7], [383, 19.0], [414, 17.8], [444, 16.3], [475, 14.4], [500, 12.4], [515, 10.6], [525, 8.9], [530, 7.8]]
const SCALE = 1.165 // photos and the published floor area against OSM's small square: see header
const half = (z: number) => SCALE * smooth(HALF, z)
const roundF = (z: number) => smooth([[0, 0.35], [200, 0.5], [440, 0.78], [530, 0.95]], z)
// rib position: 0 at the face centre, 1 at the corner
const ribS = (z: number) => smooth([[0, -0.42], [110, 0], [200, 0.72], [290, 1], [380, 0.72], [470, 0], [530, -0.4]], z)
const rimZ = (qq: number) => TOP - 0.9 - LOBE * Math.min(1, (Math.abs(qq) / 0.5) ** 2) // qq in [-0.5,0.5], 0 at face centre

/**
 * Point on the rounded-square ring at height z and perimeter position q
 * (face k centre at q = k, the corner after it at k + 0.5), `out` metres
 * outward. Returns the point and its outward normal.
 */
function ringPt(z: number, q: number, out = 0): { p: V3; n: V3 } {
  const a = half(z), rc = roundF(z) * a, L = a - rc
  const k = Math.round(q), qq = q - k // -0.5..0.5
  const th = (k * Math.PI) / 2
  const nk = [Math.cos(th), Math.sin(th)], tk = [-Math.sin(th), Math.cos(th)]
  const run = L + (Math.PI * rc) / 4
  const dd = Math.abs(qq) * 2 * run, sg = Math.sign(qq) || 1
  if (dd <= L) {
    const off = sg * dd
    return { p: [nk[0] * (a + out) + tk[0] * off, nk[1] * (a + out) + tk[1] * off, z], n: [nk[0], nk[1], 0] }
  }
  const ang = th + sg * ((dd - L) / rc)
  const c = [nk[0] * L + tk[0] * sg * L, nk[1] * L + tk[1] * sg * L]
  const m: V3 = [Math.cos(ang), Math.sin(ang), 0]
  return { p: [c[0] + m[0] * (rc + out), c[1] + m[1] * (rc + out), z], n: m }
}

type Set = { glass: Part; rib: Part; crown: Part; frame: Part; roof: Part }
const mk = (): Set => ({ glass: new Part(), rib: new Part(), crown: new Part(), frame: new Part(), roof: new Part() })

/** proud rib through the points with outward normals: w wide, d proud */
function rib(p: Part, pts: V3[], ns: V3[], w: number, d: number) {
  const sec = pts.map((c, k) => {
    const n = ns[k], t: V3 = [-n[1], n[0], 0], h = w / 2
    return {
      l0: [c[0] - t[0] * h - n[0] * 0.4, c[1] - t[1] * h - n[1] * 0.4, c[2]] as V3,
      l1: [c[0] - t[0] * h + n[0] * d, c[1] - t[1] * h + n[1] * d, c[2]] as V3,
      r1: [c[0] + t[0] * h + n[0] * d, c[1] + t[1] * h + n[1] * d, c[2]] as V3,
      r0: [c[0] + t[0] * h - n[0] * 0.4, c[1] + t[1] * h - n[1] * 0.4, c[2]] as V3,
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
  const e = sec[sec.length - 1]
  face(p, [e.l1, e.r1, e.r0, e.l0], [0, 0, 1])
}

function build(s: Set, d: boolean) {
  const per = d ? 24 : 10 // columns per face (centre to centre)
  const qs: number[] = []
  for (let i = 0; i < 4 * per; i++) qs.push(-0.5 + i / per)
  const N = qs.length
  const levels: number[] = []
  if (d) { for (let z = 0; z < GLASS_TOP; z += 6) levels.push(z) } else levels.push(0, 12, 28, 48, 72, 100, 130, 162, 196, 236, 276, 316, 356, 390, 420)
  levels.push(GLASS_TOP)
  const ring = (z: number, out = 0) => qs.map((q) => ringPt(z, q, out).p)
  gridSurface(levels.map((z) => ring(z)), true, () => s.glass)

  // the crown: the envelope carried up as a paler skin, open at the top
  const cl: number[] = []
  const cStep = d ? 6 : 18
  for (let z = GLASS_TOP; z < TOP - 8; z += cStep) cl.push(z)
  const qz = (q: number) => rimZ(q - Math.round(q))
  const crownRows = cl.map((z) => qs.map((q) => ringPt(Math.min(z, qz(q)), q).p))
  crownRows.push(qs.map((q) => ringPt(qz(q), q).p))
  gridSurface(crownRows, true, () => s.crown)
  // the skin's inside, so the open crown reads as a shell from above
  const inner = crownRows.map((r, k) => r.map((p, i) => { const o = ringPt(p[2], qs[i], -1.2).p; return [o[0], o[1], p[2]] as V3 }))
  gridSurface(inner.map((r) => [...r].reverse()), true, () => s.crown)
  // its rim: a silver lip
  const top = crownRows[crownRows.length - 1], topIn = inner[inner.length - 1]
  const lipTop = qs.map((q) => { const p = ringPt(qz(q), q, 0.4).p; return [p[0], p[1], qz(q) + 0.9] as V3 })
  const lipIn = qs.map((q) => { const p = ringPt(qz(q), q, -1.6).p; return [p[0], p[1], qz(q) + 0.9] as V3 })
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    const n = ringPt(top[i][2], qs[i]).n
    face(s.rib, [top[i], top[j], lipTop[j], lipTop[i]], [n[0], n[1], 0.4])
    face(s.rib, [lipTop[i], lipTop[j], lipIn[j], lipIn[i]], [0, 0, 1])
    face(s.rib, [lipIn[i], lipIn[j], topIn[j], topIn[i]], [-n[0], -n[1], 0])
  }
  // the roof of the plant floors inside the crown, and a lower roof at the glass top
  const rr = qs.map((q) => ringPt(ROOF, q, -1.2).p)
  for (let i = 0; i < N; i++) face(s.roof, [[0, 0, ROOF], rr[i], rr[(i + 1) % N]], [0, 0, 1])
  // the plant drum between the glass top and that roof, set in from the skin
  const drum = [GLASS_TOP, ROOF].map((z) => qs.map((q) => ringPt(z, q, -1.2).p))
  gridSurface(drum, true, () => s.frame)
  if (d) {
    // crown frame rings seen through the skin
    for (let z = GLASS_TOP + 12; z < TOP - 10; z += 14) {
      const a = qs.map((q) => ringPt(z, q, -0.5).p), b = qs.map((q) => ringPt(z + 1, q, -0.5).p)
      gridSurface([a, b], true, () => s.frame)
    }
  }

  // ribs: two per face, crossing at the face centre and meeting at the corners
  const rl: number[] = []
  const rStep = d ? 5 : 14
  for (let z = 0; z < TOP - 8; z += rStep) rl.push(z)
  const W = d ? 2.0 : 2.4, D = d ? 1.3 : 1.6
  for (let k = 0; k < 4; k++) for (const sg of [-1, 1]) {
    const pts: V3[] = [], ns: V3[] = []
    for (const z of rl) {
      const q = k + sg * 0.5 * ribS(z)
      const zt = qz(q)
      if (z > zt - 1) break
      const r = ringPt(z, q)
      pts.push(r.p); ns.push(r.n)
    }
    // run on to the rim
    const qe = k + sg * 0.5 * ribS(TOP - 4), ze = qz(qe)
    const re = ringPt(ze, qe)
    pts.push(re.p); ns.push(re.n)
    rib(s.rib, pts, ns, W, D)
  }

  // detail: vertical fins in the glass, grouped (four per face), up to the crown
  if (d) {
    for (let k = 0; k < 4; k++) for (let f = 0; f < 4; f++) {
      const q = k - 0.36 + (0.72 * (f + 0.5)) / 4
      const pts: V3[] = [], ns: V3[] = []
      for (let z = 4; z <= GLASS_TOP; z += 10) { const r = ringPt(z, q); pts.push(r.p); ns.push(r.n) }
      rib(s.frame, pts, ns, 0.8, 0.6)
    }
  }
}

// ---- Materials and output ----------------------------------------------------------------------

const GLASS: MaterialSpec = { ...PALETTE.window, color: 0x7f93ad }
const RIB: MaterialSpec = { ...finish('ctf-silver', 0xdde2e6, 0.45), floodlight: (p, n) => (p[2] > 430 ? 0.9 : n[2] > 0.7 ? 0.2 : 0.5) }
const CROWN_LOW: MaterialSpec = { ...finish('ctf-crown', 0xadbccb, 0.4), floodlight: () => 0.85 }
const CROWN_DET: MaterialSpec = { name: 'glass', color: 0x9fb5c8, roughness: 0.3, opacity: 0.5, doubleSided: true }
const FRAME: MaterialSpec = finish('ctf-frame', 0xc3cbd2, 0.5)
const ROOFM: MaterialSpec = PALETTE.roof

const low = mk(), det = mk()
build(low, false)
build(det, true)
const layers = (s: Set, d: boolean): Layer[] => [
  { part: s.glass, material: GLASS },
  { part: s.rib, material: RIB },
  { part: s.crown, material: d ? CROWN_DET : CROWN_LOW },
  { part: s.frame, material: FRAME },
  { part: s.roof, material: ROOFM },
]

if (import.meta.main) {
  await saveLods('tianjin-ctf-finance-centre', 'Tianjin CTF Finance Centre', layers(low, false), layers(det, true), {
    frame: 'Y up, -Z north, +X east, metres, turned to bearing 24; origin at the centre of the OSM outline, on the plaza',
    bearing: 24, height: TOP,
  }, 5000)
}
