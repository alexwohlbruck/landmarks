/**
 * San Diego Air & Space Museum in the Ford Building, Balboa Park. Walter
 * Dorwin Teague, 1935, for the California Pacific International Exposition:
 * a great Streamline Moderne drum round a courtyard (now roofed over by a
 * pale ribbed tent with a central oculus), with a tall cylindrical entrance
 * tower on its north-east side ringed by blue fins, and two aircraft on
 * pylons either side of the entrance.
 *
 * Frame: bearing 0. +x east, +y north, z up, metres; origin at the anchor
 * -117.15439, 32.72624 (0.3 m from the outline's centroid). z = 0 is the
 * lowest ground under the outline, on its south and west sides (lidar
 * 8.4 m above the box's ground_min); the plaza and road on the north and
 * east, where the entrance is, are 5 m higher, so the drum's south wall is
 * that much taller.
 *
 * Replaces: the outline way/31240535 (building=yes, height 27.5, museum).
 * The two ticket and shelter buildings nearby are not drawn.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): the outline, a drum of r ≈ 48 about
 *   (−2.2, −4) with the tower's lobe, r ≈ 16 about (30.5, 37.5) (fitted to
 *   its vertices). Height 27.5 (the tower's flat roof).
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014), 0.5 m grid: drum roof
 *   ring 15.6, the courtyard roof rising to 21.2 at the oculus, the tower's
 *   roof 26.6 inside a rim to 31.6 (all z, measured).
 * - USGS NAIP orthophoto: plan.
 * - Wikipedia "Ford Building (San Diego)" / "San Diego Air & Space Museum":
 *   1935, Walter Dorwin Teague; the museum since 1980.
 * Photos (evidence, Wikimedia Commons):
 * - "SanDiegoAirSpaceMuseumByPhilKonstantin.JPG", Phil Konstantin,
 *   CC BY-SA 3.0, 2013 (aerial from the south: the drum, the ribbed
 *   courtyard roof and oculus, the tower's open top and fins):
 *   https://commons.wikimedia.org/wiki/File:SanDiegoAirSpaceMuseumByPhilKonstantin.JPG
 * - "Palisades, San Diego, CA 92101, USA - panoramio (20).jpg", Roman
 *   Eugeniusz, CC BY-SA 3.0, 2015 (the entrance tower; the A-12 on the
 *   right, the Sea Dart on the left, both level on pylons):
 *   https://commons.wikimedia.org/wiki/File:Palisades,_San_Diego,_CA_92101,_USA_-_panoramio_(20).jpg
 * - "Ford Building, Air and Space Museum.jpg", Gentletouch1954, CC BY-SA 3.0,
 *   2008 (the same, closer): https://commons.wikimedia.org/wiki/File:Ford_Building,_Air_and_Space_Museum.jpg
 * - "San Diego Air & Space Museum entrance 2009.jpg", SDASM, no known
 *   restrictions (the entrance and fins; it shows the A-12 nose-up, an older
 *   mounting): https://commons.wikimedia.org/wiki/File:San_Diego_Air_%26_Space_Museum_entrance_2009.jpg
 * - "San Diego, 2016 - 537.jpg", Another Believer, CC BY-SA 4.0 (fins,
 *   entrance glazing): https://commons.wikimedia.org/wiki/File:San_Diego,_2016_-_537.jpg
 * - "42-san-diego-air-space-museum.jpg", Alfred Twu, CC0, 2019 (aerial):
 *   https://commons.wikimedia.org/wiki/File:42-san-diego-air-space-museum.jpg
 * - "Palisades, San Diego, CA 92101, USA - panoramio (28).jpg", Roman
 *   Eugeniusz, CC BY-SA 3.0 (night: the tower washed in blue light).
 *
 * Numbers
 * - Drum wall to 15.6 with a parapet to 16.4; courtyard roof r 26, rising
 *   from 17.0 to 20.6, oculus r 5 to 21.2 (lidar).
 * - Tower: wall to 31.6, roof inside at 26.6 (lidar); 28 fins 1.1 m wide,
 *   0.7 m deep, to 28.5 (estimated from the photos).
 * - Entrance on the tower's outward face, bearing 38° from the drum's centre
 *   (estimated: the tower's lobe and the photos).
 * - Aircraft at their published sizes: Lockheed A-12 31.3 m long, 16.9 m
 *   span, on two pylons 4 m up; Convair XF2Y Sea Dart 16 m long, 10.3 m
 *   span, on one pylon 3.5 m up. Their placing, 10–14 m in front of the
 *   tower either side of the entrance, is estimated from the photos.
 *
 * Simplified / doubts
 * - The aircraft stand outside the OSM outline; they are drawn because the
 *   brief asks for them and they are part of the museum's face. The A-12's
 *   twin canted fins and the Sea Dart's skis are simplified.
 * - The "AIR & SPACE MUSEUM" lettering on the drum's roof and walls and the
 *   entrance sign panel are left out (STYLE: no lettering).
 * - The drum's shallow pilasters stand in for its vertical panel joints.
 * - Night: the fins are `neon` in their blue, as the tower is washed blue in
 *   the night photo; the entrance glazing glows.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { cylinder } from './dc-white-house'
import { orientTo, patternDome, ringPrism, saveModel, ngon, ngonFaces, facePoly, type XY } from './sd-california-tower'

const CREAM = finish('ford-cream', 0xebe3d3)
const ROOF = finish('ford-roof', 0xc6c6c2)
const TENT = finish('ford-tent', 0xf1efe9)
const BLUE = finish('neon-ford-blue', 0x2f5c9c)
const GLASS = finish('window', 0x4f5f6c, 0.35)
const PLANE = finish('ford-aircraft', 0x4a4f57)

function build() {
  const cream = new Part(), roof = new Part(), tent = new Part(), blue = new Part(), glass = new Part(), plane = new Part()

  // ---- The drum.
  const D: XY = [-2.2, -4.0], R = 48, WALL = 15.6, PAR = 16.4
  const SEG = 40
  ringPrism(cream, ngon(D[0], D[1], R, SEG), 0, WALL, false)
  // parapet ring and the flat roof ring inside it
  ringPrism(cream, ngon(D[0], D[1], R + 0.25, SEG), WALL - 0.4, PAR, false)
  const outer = ngon(D[0], D[1], R + 0.25, SEG), inner = ngon(D[0], D[1], R - 0.5, SEG)
  for (let k = 0; k < SEG; k++) {
    const j = (k + 1) % SEG
    orientTo(cream, [[...outer[k], PAR], [...outer[j], PAR], [...inner[j], PAR], [...inner[k], PAR]] as V3[], [0, 0, 1])
    orientTo(cream, [[...inner[k], PAR], [...inner[j], PAR], [...inner[j], WALL], [...inner[k], WALL]] as V3[], [D[0] - inner[k][0], D[1] - inner[k][1], 0])
  }
  // the roof ring at 15.6 between the parapet and the courtyard roof
  const RC = 26
  const rIn = ngon(D[0], D[1], RC, SEG), rOut = ngon(D[0], D[1], R - 0.5, SEG)
  for (let k = 0; k < SEG; k++) {
    const j = (k + 1) % SEG
    orientTo(roof, [[...rOut[k], WALL], [...rOut[j], WALL], [...rIn[j], WALL], [...rIn[k], WALL]] as V3[], [0, 0, 1])
  }
  // shallow pilasters round the wall: the "gear" teeth
  ngonFaces(D[0], D[1], R, SEG).forEach(({ F }) => {
    const P = (u: number, z: number, d: number): V3 => [F.o[0] + F.u[0] * u + F.n[0] * d, F.o[1] + F.u[1] * u + F.n[1] * d, z]
    const w = 0.7, d = 0.45, z1 = WALL - 0.4
    orientTo(cream, [P(-w, 0, d), P(w, 0, d), P(w, z1, d), P(-w, z1, d)], F.n)
    orientTo(cream, [P(-w, 0, 0), P(-w, 0, d), P(-w, z1, d), P(-w, z1, 0)], [-F.u[0], -F.u[1], 0])
    orientTo(cream, [P(w, 0, 0), P(w, 0, d), P(w, z1, d), P(w, z1, 0)], [F.u[0], F.u[1], 0])
    orientTo(cream, [P(-w, z1, 0), P(w, z1, 0), P(w, z1, d), P(-w, z1, d)], [0, 0, 1])
  })
  // the courtyard roof: a low ribbed tent from r 26 to the oculus, with a curb
  ringPrism(cream, ngon(D[0], D[1], RC, SEG), WALL, 17.0, false)
  const tentProf: XY[] = [[RC, 17.0], [19, 18.4], [12, 19.6], [5.2, 20.6]]
  patternDome(D[0], D[1], tentProf, 48, (c) => (c % 4 === 0 ? roof : tent), 0)
  patternDome(D[0], D[1], [[5.2, 20.6], [4.6, 21.0], [3.0, 21.2], [0.01, 21.3]], 16, (c) => (c % 2 === 0 ? glass : tent))

  // ---- The entrance tower.
  const T: XY = [30.5, 37.5], RT = 16, RIM = 31.6, TROOF = 26.6, NF = 28
  ringPrism(cream, ngon(T[0], T[1], RT, 28), 0, RIM, false)
  // rim top and the roof inside it
  const to = ngon(T[0], T[1], RT, 28), ti = ngon(T[0], T[1], RT - 0.6, 28)
  for (let k = 0; k < 28; k++) {
    const j = (k + 1) % 28
    orientTo(cream, [[...to[k], RIM], [...to[j], RIM], [...ti[j], RIM], [...ti[k], RIM]] as V3[], [0, 0, 1])
    orientTo(cream, [[...ti[k], RIM], [...ti[j], RIM], [...ti[j], TROOF], [...ti[k], TROOF]] as V3[], [T[0] - ti[k][0], T[1] - ti[k][1], 0])
  }
  ringPrism(roof, ti, TROOF - 0.2, TROOF, roof)
  // fins, skipping the entrance bay and the side buried in the drum
  const ENT = (38 * Math.PI) / 180 // compass bearing of the entrance from the drum's centre
  const entDir: XY = [Math.sin(ENT), Math.cos(ENT)]
  for (let k = 0; k < NF; k++) {
    const a = (2 * Math.PI * k) / NF
    const n: XY = [Math.cos(a), Math.sin(a)]
    const c: XY = [T[0] + RT * n[0], T[1] + RT * n[1]]
    if (Math.hypot(c[0] - D[0], c[1] - D[1]) < R - 0.5) continue
    const dotE = n[0] * entDir[0] + n[1] * entDir[1]
    if (dotE > Math.cos((9 * Math.PI) / 180)) continue // the entrance bay
    const u: XY = [-n[1], n[0]], w = 0.55, d = 0.7
    const P = (s: number, dd: number, z: number): V3 => [c[0] + u[0] * s + n[0] * dd, c[1] + u[1] * s + n[1] * dd, z]
    const z1 = 28.5
    orientTo(blue, [P(-w, d, 0), P(w, d, 0), P(w, d, z1), P(-w, d, z1)], [n[0], n[1], 0])
    orientTo(blue, [P(-w, 0, 0), P(-w, d, 0), P(-w, d, z1), P(-w, 0, z1)], [-u[0], -u[1], 0])
    orientTo(blue, [P(w, 0, 0), P(w, d, 0), P(w, d, z1), P(w, 0, z1)], [u[0], u[1], 0])
    orientTo(blue, [P(-w, 0, z1), P(w, 0, z1), P(w, d, z1 - 0.4), P(-w, d, z1 - 0.4)], [n[0], n[1], 1])
  }
  // the entrance: a tall glazed bay framed by two blue fins, on the face toward ENT
  const ec: XY = [T[0] + RT * entDir[0], T[1] + RT * entDir[1]]
  const eu: XY = [-entDir[1], entDir[0]]
  const E = (s: number, dd: number, z: number): V3 => [ec[0] + eu[0] * s + entDir[0] * dd, ec[1] + eu[1] * s + entDir[1] * dd, z]
  orientTo(glass, [E(-2.6, 0.1, 5.0), E(2.6, 0.1, 5.0), E(2.6, 0.1, 12.0), E(-2.6, 0.1, 12.0)], [entDir[0], entDir[1], 0])
  for (const s of [-3.3, 3.3]) {
    orientTo(blue, [E(s - 0.5, 1.0, 5.0), E(s + 0.5, 1.0, 5.0), E(s + 0.5, 1.0, 26.0), E(s - 0.5, 1.0, 26.0)], [entDir[0], entDir[1], 0])
    for (const t of [-1, 1]) orientTo(blue, [E(s + t * 0.5, 0, 5.0), E(s + t * 0.5, 1.0, 5.0), E(s + t * 0.5, 1.0, 26.0), E(s + t * 0.5, 0, 26.0)], [eu[0] * t, eu[1] * t, 0])
  }
  orientTo(blue, [E(-3.3, 1.2, 12.0), E(3.3, 1.2, 12.0), E(3.3, 1.2, 12.8), E(-3.3, 1.2, 12.8)], [entDir[0], entDir[1], 0])
  // the sign panel above the entrance (white), left plain
  orientTo(tent, [E(-2.6, 0.1, 13.6), E(2.6, 0.1, 13.6), E(2.6, 0.1, 22.5), E(-2.6, 0.1, 22.5)], [entDir[0], entDir[1], 0])

  // ---- The aircraft, either side of the entrance, level on pylons.
  const PZ = 5.0 // the plaza in front of the tower
  /** A plane in a local frame: nose along +s (direction `dir`), span along +t, centre `c`, belly at z. */
  const frame = (c: XY, dir: XY, z: number) => (s: number, t: number, h: number): V3 => [c[0] + dir[0] * s - dir[1] * t, c[1] + dir[1] * s + dir[0] * t, z + h]
  const wedge = (P: (s: number, t: number, h: number) => V3, pts: [number, number][], h0: number, h1: number) => {
    // a flat plate (wing) of thickness h0..h1 over a convex outline in (s, t)
    const top = pts.map(([s, t]) => P(s, t, h1)), bot = pts.map(([s, t]) => P(s, t, h0))
    for (let k = 1; k < pts.length - 1; k++) { orientTo(plane, [top[0], top[k], top[k + 1]], [0, 0, 1]); orientTo(plane, [bot[0], bot[k], bot[k + 1]], [0, 0, -1]) }
    for (let k = 0; k < pts.length; k++) {
      const j = (k + 1) % pts.length
      const m = [(pts[k][0] + pts[j][0]) / 2, (pts[k][1] + pts[j][1]) / 2]
      const cs = pts.reduce((a, p) => a + p[0], 0) / pts.length, ct = pts.reduce((a, p) => a + p[1], 0) / pts.length
      const o = P(m[0] - cs, m[1] - ct, 0), z0 = P(0, 0, 0)
      orientTo(plane, [bot[k], bot[j], top[j], top[k]], [o[0] - z0[0], o[1] - z0[1], 0])
    }
  }
  const body = (P: (s: number, t: number, h: number) => V3, s0: number, s1: number, rw: number, rh: number, h: number, n = 6) => {
    // a fuselage: an elliptic tube from s0 to s1, pointed at the nose (s1)
    const ring = (s: number, k: number) => Array.from({ length: n }, (_, i) => { const a = (2 * Math.PI * i) / n; return P(s, rw * k * Math.cos(a), h + rh * k * Math.sin(a)) })
    const sts: [number, number][] = [[s0, 0.7], [s0 + (s1 - s0) * 0.15, 1], [s0 + (s1 - s0) * 0.7, 1], [s0 + (s1 - s0) * 0.9, 0.55], [s1, 0.02]]
    for (let q = 0; q < sts.length - 1; q++) {
      const A = ring(...sts[q]), B = ring(...sts[q + 1])
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n
        const a = (2 * Math.PI * (i + 0.5)) / n
        const o = P(0, Math.cos(a), Math.sin(a)), z0 = P(0, 0, 0)
        orientTo(plane, [A[i], A[j], B[j], B[i]], [o[0] - z0[0], o[1] - z0[1], o[2] - z0[2]])
      }
    }
    const A = ring(...sts[0])
    for (let i = 1; i < n - 1; i++) { const back = P(-1, 0, 0), z0 = P(0, 0, 0); orientTo(plane, [A[0], A[i], A[i + 1]], [back[0] - z0[0], back[1] - z0[1], 0]) }
  }
  // tangent along the tower's face, pointing north-west
  const tang: XY = [eu[0], eu[1]]
  // A-12 on the right seen from the plaza (north-west of the entrance), nose toward the entrance
  {
    const c: XY = [ec[0] + eu[0] * 18.5 + entDir[0] * 8, ec[1] + eu[1] * 18.5 + entDir[1] * 8]
    const tang: XY = [-eu[0], -eu[1]]
    const P = frame(c, tang, PZ + 4.0)
    body(P, -15.6, 15.6, 1.4, 1.0, 0.9, 6)
    // the chined delta wing and the two engine nacelles with canted fins
    wedge(P, [[9, 0.6], [-10.5, 8.45], [-14, 8.45], [-14, -8.45], [-10.5, -8.45], [9, -0.6]], 0.55, 0.85)
    for (const t of [-4.3, 4.3]) {
      body(frame([c[0] - tang[1] * t, c[1] + tang[0] * t], tang, PZ + 4.0), -14.5, -1.5, 0.9, 0.9, 0.75, 6)
      wedge(P, [[-11, t - 0.12], [-14.4, t - 0.12], [-14.4, t + 0.12], [-11, t + 0.12]], 0.9, 4.0)
    }
    for (const s of [-6, 4]) { const [x, y] = P(s, 0, 0); cylinder(plane, x, y, 0.35, 0, PZ + 4.1, 6) }
  }
  // Sea Dart on the left (south-east of the entrance), nose toward the entrance
  {
    const c: XY = [ec[0] - eu[0] * 12 + entDir[0] * 7, ec[1] - eu[1] * 12 + entDir[1] * 7]
    const P = frame(c, tang, PZ + 3.5)
    body(P, -8, 8, 0.9, 1.1, 0.8, 6)
    wedge(P, [[3, 0.6], [-7.5, 5.15], [-7.5, -5.15], [3, -0.6]], 0.35, 0.6)
    wedge(P, [[-3.5, -0.1], [-8, -0.1], [-8, 0.1], [-3.5, 0.1]], 1.4, 5.5)
    const [x, y] = P(-1, 0, 0)
    cylinder(plane, x, y, 0.4, 0, PZ + 3.6, 6)
  }

  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : Math.hypot(p[0] - T[0], p[1] - T[1]) < RT + 1.5 ? 0.6 : 0.2)
  return [
    { part: cream, material: { ...CREAM, floodlight: lit } },
    { part: roof, material: ROOF },
    { part: tent, material: TENT },
    { part: blue, material: BLUE },
    { part: glass, material: GLASS },
    { part: plane, material: PLANE },
  ]
}

if (import.meta.main) await saveModel('sd-air-and-space-museum', 'San Diego Air & Space Museum', build())
