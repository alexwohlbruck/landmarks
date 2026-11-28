/**
 * Krestovsky Stadium (Gazprom Arena), Saint Petersburg: original procedural
 * geometry, CC0-1.0, no textures.  bun generators/saint-petersburg-krestovsky.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/saint-petersburg-krestovsky.glb, the low model;
 * - models/saint-petersburg-krestovsky.detail.glb (zoom 16 up): the dome's
 *   transverse arches, the masts' stays in full fans, the rail trusses,
 *   both seating tiers under the roof, more columns and facade seams.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 5.6: model +y
 * runs along the pitch (north), +x across it (east). Anchor = the centre of
 * the pitch, OSM way/504592417 (leisure=pitch, 119 x 76 m, long edges at
 * 5.6 deg), lng 30.2205079, lat 59.9729904. The bowl part relation/8846006
 * (height=74) is a circle of radius 145-150 m whose centroid is 2.6 m from
 * it; the stadium is built about the pitch centre.
 *
 * Identity, in order: the round "spaceship" disc: a thin pale rim 286 m
 * across over a dark blue glazed band and a silver facade drawn in under it
 * like a saucer's belly, standing on a ring of white columns and glass stair
 * towers on its podium; the closed retractable roof as a long pale barrel
 * dome on the flat grey roof, with the two rail tracks running north and
 * south from it; the eight tall white masts in four pairs near the
 * diagonals, leaning in over the dome, each a V of two tubes, with fans of
 * stays.
 *
 * Evidence
 *  - OSM: relation/8841754 (building=sports_centre, leisure=stadium,
 *    height=75, Q722970), its bowl part relation/8846006 (height=74, the
 *    circle above), the pitch way/504592417; the east wings relation/8841752
 *    and 8841753 (3 levels), 8846032/8846033 (1 level), 8851846/8851847
 *    (height 1) and the pitch's slide-out dock relation/8846030 (1 level,
 *    south) are left to the map.
 *  - Published: ru.wikipedia "Газпром Арена": height from the ground to the
 *    roof 75 m, 110 m with the pylons; roof diameter 286 m; the roof rests
 *    on 8 masts; the sliding roof of two leaves, central section 224 x 92 m;
 *    a roll-out pitch. Architect Kisho Kurokawa (OSM architect tag).
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - smelov: Ivan Smelov, "Газпром арена и Западный скоростной
 *      диаметр.jpg", CC BY-SA 4.0, from the south and above, roof closed:
 *      the dome, the rails, the four southern masts, the columns and glass
 *      towers, the podium and the pitch dock. https://commons.wikimedia.org/wiki/File:%D0%93%D0%B0%D0%B7%D0%BF%D1%80%D0%BE%D0%BC_%D0%B0%D1%80%D0%B5%D0%BD%D0%B0_%D0%B8_%D0%97%D0%B0%D0%BF%D0%B0%D0%B4%D0%BD%D1%8B%D0%B9_%D1%81%D0%BA%D0%BE%D1%80%D0%BE%D1%81%D1%82%D0%BD%D0%BE%D0%B9_%D0%B4%D0%B8%D0%B0%D0%BC%D0%B5%D1%82%D1%80.jpg
 *    - air1, air2: Godot13, "RUS-2016-Aerial-SPB-Krestovsky Stadium 01/02.jpg",
 *      CC BY-SA 4.0, aerials, roof closed (01) and open (02): the leaves
 *      as lattice barrel vaults, the masts in pairs.
 *      https://commons.wikimedia.org/wiki/File:RUS-2016-Aerial-SPB-Krestovsky_Stadium_01.jpg
 *      https://commons.wikimedia.org/wiki/File:RUS-2016-Aerial-SPB-Krestovsky_Stadium_02.jpg
 *    - kz1-3: Andrey Korzun, "2018 SPb Gazprom Arena 01/02/03.jpg", CC BY-SA
 *      4.0, from the water to the west, nearly orthographic: every height
 *      and radius of the profile was scaled from kz3 (rim 960 px = 286 m).
 *      https://commons.wikimedia.org/wiki/File:2018_SPb_Gazprom_Arena_03.jpg
 *    - lakhta: Press Service of the President of Russia, "Gazprom Arena from
 *      Lakhta Center.jpg", CC BY 4.0, from the north-west and above: the
 *      dome's plan. https://commons.wikimedia.org/wiki/File:Gazprom_Arena_from_Lakhta_Center.jpg
 *    - mbh1-4: MBH, "Gazprom Arena in 2020 01-04.jpg", CC BY 4.0, street
 *      level: columns, glass towers, gates. https://commons.wikimedia.org/wiki/File:Gazprom_Arena_in_2020_01.jpg
 *    - mono: Monoklon, "Gazprom-Arena.jpg", CC BY-SA 4.0, street level.
 *      https://commons.wikimedia.org/wiki/File:Gazprom-Arena.jpg
 *    - secA: TakingOver, "Gazprom Arena From Audience, Sector A.jpg", CC0,
 *      inside: blue seats in two tiers, the rail trusses.
 *      https://commons.wikimedia.org/wiki/File:Gazprom_Arena_From_Audience,_Sector_A.jpg
 *    - yevd: Vyacheslav Yevdokimov, "Gazprom Arena, 2 May 2021.jpg", CC BY-SA
 *      3.0, inside, roof closed: the leaves' transverse arches, the rails
 *      along the pitch. https://commons.wikimedia.org/wiki/File:Gazprom_Arena,_2_May_2021.jpg
 *  No lidar or NAIP exists here (outside the US); no commercial imagery.
 *
 * Numbers (z above the field, which is y = 0; elevation 0: the field and
 * the pitch dock to the south are at the low outside ground, smelov, air1):
 *  - Podium (stylobate) top 14.5 m: ESTIMATED. Above the plaza kz3 gives
 *    the rim 38 m, the dome top 59.5 m and the mast tops 94 m; a podium of
 *    14.5 m puts them at the published 75 m roof and 110 m pylons. smelov's
 *    retaining wall at the pitch dock reads 12-18 m. The map's terrain here
 *    is only z12 (a 20 m ring that is the old surface model of the stadium
 *    itself); the check passes with this podium.
 *  - Above the plaza, from kz3 (rim 960 px = 286 m, 3.36 px/m): columns
 *    16 m (r 118, 2.5 m thick, about 8.5 m apart); the hull from the
 *    columns' heads out to r 137; the glazed band 6 m, leaning out to
 *    r 139.5; the lip at r 144 to 37.5 m; the roof rising to 41 m at the
 *    dome's foot; dome top 75 m above the field; masts 109 m.
 *  - Rim radius 144: published diameter 286 m; OSM's circle is 147.
 *  - Dome plan 148 m (east-west) x 138 m: MEASURED, 140-148 m across in
 *    smelov (from the south) and 137 m in kz3 (from the west). Its ridge
 *    runs east-west with the arches north-south (the ribs read as lines
 *    running away from the camera in smelov; the profile from the west is
 *    an arch in kz3); the two leaves meet on the ridge and park north and
 *    south on the rails at x = +-46 m (smelov; 92 m apart, as the published
 *    92 m), seen from the east in air2 with the leaves parked.
 *  - Masts: four pairs, bases at r 117 m and 33/57 deg from the cross axis,
 *    tops at r 87 m: MEASURED in smelov (bases 64 and 98 m off the axis,
 *    tops 47 and 72 m) and consistent with kz3. Each mast a V of two tubes
 *    (smelov, kz3), drawn 4.4 m thick at the foot.
 *  - Columns (56), glass stair towers (16): counts ESTIMATED from smelov,
 *    which shows a third of the ring.
 *  - Seats blue (secA, yevd, 2021-22), two tiers with a box ring; the tier
 *    radii are ESTIMATED from secA and yevd (detail model only: the closed
 *    roof hides them).
 * Doubts: the roof is drawn closed, as in almost every photo; the dome's
 * orientation (ridge east-west) rests on the photos' rib lines, the
 * published 224 x 92 m section is not explained by them; the podium
 * height (above); the facade's real cladding has rows of small windows,
 * drawn as shallow seams; the escalator galleries, the gate pavilions and
 * the east wings are left out (the map draws the wings).
 * Night: the glazed band and the concourse glazing are `window`; the masts
 * and the rim are floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { band, ring, bar, cyl, writeLods, superellipse, type XY } from './milan-san-siro'
import { face, tube, vadd, vlerp, vmul, vsub, nrm3 } from './seoul-world-cup-stadium'

const BEARING = 5.6
const RAD = Math.PI / 180

const circle = (r: number, n: number, rot = 0): XY[] => Array.from({ length: n }, (_, k) => {
  const a = rot + (k / n) * 2 * Math.PI
  return [r * Math.cos(a), r * Math.sin(a)] as XY
})

// Profile (r, z) of the saucer, outside, from the podium up.
const PODIUM = 12
const R_POD = 140
const R_COL = 118
const COL_TOP = 28
const R_RIM = 144
// the dome's foot: a superellipse, 70 across (x), 90 along (y)
const DA = 74, DB = 69, DE = 2.6
const DOME_Z0 = 55, DOME_TOP = 74.5
const ROOF_RIM = 51

function build(detail: boolean) {
  const silver = new Part(), roof = new Part(), membrane = new Part(), white = new Part(), win = new Part(), seats = new Part()
  const N = detail ? 128 : 64
  const phis = Array.from({ length: N }, (_, k) => (k / N) * 2 * Math.PI)
  const C = (r: number, z: number) => ring(circle(r, 8), phis, z).map((p) => {
    const a = Math.atan2(p[1], p[0])
    return [r * Math.cos(a), r * Math.sin(a), z] as V3
  })
  const OUT = (q: V3): V3 => [q[0], q[1], 0]
  const IN = (q: V3): V3 => [-q[0], -q[1], 0]
  const UP = (): V3 => [0, 0, 1]
  const DOWN = (): V3 => [0, 0, -1]
  const lathe = (p: Part, prof: [number, number][], hint: (q: V3) => V3) => {
    for (let k = 0; k < prof.length - 1; k++) band(p, C(prof[k][0], prof[k][1]), C(prof[k + 1][0], prof[k + 1][1]), hint)
  }

  // --- Podium: the stylobate wall and its plaza under the saucer.
  lathe(silver, [[R_POD, 0], [R_POD, PODIUM]], OUT)
  lathe(silver, [[R_POD, PODIUM], [100, PODIUM]], UP)
  // the concourse wall behind the columns: dark glazing (lit at night)
  lathe(win, [[110, PODIUM], [110, COL_TOP]], OUT)
  // the saucer's hull: a deep curved belly from the concourse, over the
  // columns, out to the glazed band, with two shallow seams (3D lips)
  const hull: [number, number][] = detail
    ? [[110, COL_TOP], [119, COL_TOP + 0.2], [126, COL_TOP + 0.9], [131, COL_TOP + 2.2], [134.6, COL_TOP + 4.3], [136.4, COL_TOP + 8.5], [137, 42.5]]
    : [[110, COL_TOP], [122, COL_TOP + 0.4], [130, COL_TOP + 1.8], [135.4, COL_TOP + 6.4], [137, 42.5]]
  {
    const HN = (q: V3): V3 => [q[0], q[1], -40]
    let lift = 0
    for (let k = 0; k < hull.length - 1; k++) {
      const [r0, z0] = hull[k], [r1, z1] = hull[k + 1]
      const seam = k === hull.length - 3 || k === hull.length - 4
      if (seam) {
        band(silver, C(r0, z0 + lift), C(r1 - 0.45, z1), HN)
        band(silver, C(r1 - 0.45, z1), C(r1, z1 + 0.3), DOWN) // a lip
        lift = 0.3
      } else {
        band(silver, C(r0, z0 + lift), C(r1, z1), HN)
        lift = 0
      }
    }
  }
  // the glazed band, dark blue, leaning out, with pale piers every 7.5 deg
  lathe(win, [[137, 42.5], [139.5, 48.5]], OUT)
  {
    const piers = detail ? 96 : 48
    for (let k = 0; k < piers; k++) {
      const a = (k / piers) * 2 * Math.PI, c = Math.cos(a), s = Math.sin(a)
      const P = (r: number, z: number): V3 => [r * c, r * s, z]
      bar(silver, P(137.4, 42.7), P(139.9, 48.3), detail ? 1.0 : 1.5, 0.9, [c, s, 0], false)
    }
  }
  // the soffit out to the lip, the pale lip, and the roof's top surface
  lathe(silver, [[139.5, 48.5], [143.6, 49.4]], DOWN)
  lathe(white, [[143.6, 49.4], [R_RIM + 0.6, 50.2], [R_RIM, ROOF_RIM], [R_RIM - 2.5, ROOF_RIM + 0.25]], OUT)

  // --- The roof: flat grey, rising gently from the rim to the dome's foot.
  const foot = superellipse(DA, DB, DE, 64)
  {
    const R0 = C(R_RIM - 2.5, ROOF_RIM + 0.25)
    const mid = ring(foot, phis, DOME_Z0 - 1.2, 22)
    const R1 = ring(foot, phis, DOME_Z0)
    band(roof, R0, mid, UP)
    band(roof, mid, R1, UP)
  }

  // --- The dome: the two closed leaves, a barrel with its ridge east-west
  // (the leaves meet on it), rounded down at its east and west ends.
  {
    const K = detail ? 10 : 6
    const sxt = (t: number) => 1 - 0.32 * t * t, syt = (t: number) => Math.cos((t * Math.PI) / 2)
    const zt = (t: number) => DOME_Z0 + 1.6 + (DOME_TOP - DOME_Z0 - 1.6) * Math.pow(Math.sin((t * Math.PI) / 2), 0.85)
    const lv = (t: number) => ring(foot, phis, zt(t), -0.4).map((p) => [p[0] * sxt(t), p[1] * syt(t), zt(t)] as V3)
    // white foot band (the leaves' pale edge beam)
    band(white, ring(foot, phis, DOME_Z0), ring(foot, phis, DOME_Z0 + 1.6, -0.4), OUT)
    const rings: V3[][] = []
    for (let k = 0; k <= K; k++) rings.push(lv(k / K))
    for (let k = 0; k < rings.length - 1; k++) band(membrane, rings[k], rings[k + 1], (q) => [q[0] / (DA * DA), q[1] / (DB * DB), 0.006])
    // the leaves' arches (raised ribs, north-south) and the bold seam on the ridge
    const ribs = detail ? 19 : 9
    const M = detail ? 7 : 4
    for (let i = 0; i < ribs; i++) {
      const x = -DA * 0.88 + (2 * DA * 0.88 * i) / (ribs - 1)
      const h = (DB - 0.4) * Math.pow(1 - Math.pow(Math.abs(x / DA), DE), 1 / DE)
      const path: V3[] = []
      for (let m = 0; m <= 2 * M; m++) {
        const side = m < M ? -1 : 1
        const t = m < M ? m / M : (2 * M - m) / M
        path.push([x * sxt(t), side * h * syt(t), zt(t) + 0.35])
      }
      for (let m = 0; m < 2 * M; m++) bar(white, path[m], path[m + 1], detail ? 0.9 : 1.3, 0.6, [0, 0, 1], false)
    }
    const ridge = Array.from({ length: 2 * M + 1 }, (_, m) => (-1 + m / M) * DA * sxt(1))
    for (let m = 0; m < 2 * M; m++) bar(white, [ridge[m], 0, DOME_TOP + 0.5], [ridge[m + 1], 0, DOME_TOP + 0.5], 2.6, 0.9, [0, 0, 1], m === 0 || m === 2 * M - 1)
  }

  // --- Rail tracks north and south of the dome, where the leaves park.
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const x = sx * 46
    const y0 = sy * DB * Math.pow(1 - Math.pow(46 / DA, DE), 1 / DE) * 0.98, y1 = sy * 133
    const zA = DOME_Z0 - 0.4, zB = ROOF_RIM + 1.2
    if (detail) {
      for (const o of [-1.4, 1.4]) bar(roof, [x + o, y0, zA + 1.6], [x + o, y1, zB + 1.6], 0.6, 0.6, [0, 0, 1], true)
      const n = 10
      for (let k = 0; k <= n; k++) {
        const t = k / n, y = y0 + (y1 - y0) * t, z = zA + (zB - zA) * t
        bar(roof, [x - 1.4, y, z + 1.6], [x + 1.4, y, z + 1.6], 0.4, 0.4, [0, 0, 1], false)
        bar(roof, [x, y, z], [x, y, z + 1.6], 0.5, 0.5, [1, 0, 0], false)
      }
    } else bar(roof, [x, y0, zA + 0.8], [x, y1, zB + 0.8], 3.2, 1.8, [0, 0, 1], true)
  }

  // --- The eight masts: four pairs near the diagonals, leaning in.
  const roofZ = (r: number) => ROOF_RIM + 0.25 + (DOME_Z0 - 1.2 - ROOF_RIM - 0.25) * Math.min(1, Math.max(0, (R_RIM - 2.5 - r) / (R_RIM - 2.5 - 100)))
  for (const q of [0, 90, 180, 270]) for (const off of [33, 57]) {
    const a = (q + off) * RAD, c = Math.cos(a), s = Math.sin(a)
    const tan: V3 = [-s, c, 0]
    const rB = 117, rT = 87, zT = 109
    const base: V3 = [rB * c, rB * s, roofZ(rB)]
    const top: V3 = [rT * c, rT * s, zT]
    const sides = detail ? 8 : 6
    // the V: two tubes from feet 3.4 m either side, joined 14 m under the tip
    const join = vlerp(base, top, 0.78)
    for (const o of [-1, 1]) {
      const f = vadd(base, vmul(tan, o * 3.4))
      tube(white, f, join, detail ? 1.8 : 2.2, 1.5, sides, false, false, 0, true)
    }
    tube(white, join, top, detail ? 1.9 : 2.2, 0.7, sides, true, false, 0, true)
    // feet plinths
    for (const o of [-1, 1]) {
      const f = vadd(base, vmul(tan, o * 3.4))
      cyl(white, f[0], f[1], 2.2, f[2] - 1, f[2] + 1.2, 6, true)
    }
    // stays: forward to the dome's foot, back to the roof near the rim
    const stays: V3[] = []
    const fw = (d: number, t: number): V3 => {
      const r = 72 + d
      const aa = a + t * RAD
      return [r * Math.cos(aa), r * Math.sin(aa), DOME_Z0 + 0.5]
    }
    const bk = (t: number): V3 => {
      const aa = a + t * RAD
      return [138 * Math.cos(aa), 138 * Math.sin(aa), roofZ(138)]
    }
    if (detail) {
      for (const t of [-14, -5, 5, 14]) stays.push(fw(0, t))
      for (const t of [-8, -2.5, 2.5, 8]) stays.push(bk(t))
    } else {
      stays.push(fw(0, -6), fw(0, 6), bk(-5), bk(5))
    }
    const hang = vlerp(join, top, 0.7)
    for (const e of stays) bar(white, hang, e, detail ? 0.35 : 0.55, detail ? 0.35 : 0.55, [0, 0, 1], false)
  }

  // --- Columns round the foot and the glass stair towers.
  const NC = detail ? 88 : 56
  const towers = 16
  for (let k = 0; k < NC; k++) {
    const a = ((k + 0.5) / NC) * 2 * Math.PI
    // skip where a stair tower stands
    const ta = (a / (2 * Math.PI)) * towers
    if (Math.abs(ta - Math.round(ta)) < 0.16) continue
    cyl(white, R_COL * Math.cos(a), R_COL * Math.sin(a), 1.25, PODIUM, COL_TOP + 0.6, detail ? 10 : 6)
  }
  for (let k = 0; k < towers; k++) {
    const a = (k / towers) * 2 * Math.PI, c = Math.cos(a), s = Math.sin(a)
    const o: V3 = [c, s, 0], t: V3 = [-s, c, 0]
    const P = (r: number, w: number, z: number): V3 => [r * c + t[0] * w, r * s + t[1] * w, z]
    const r0 = 112, r1 = 126, W = 6, z0 = PODIUM, z1 = COL_TOP + 0.6
    const box = [P(r0, -W, z0), P(r1, -W, z0), P(r1, W, z0), P(r0, W, z0)]
    const top = box.map((p) => [p[0], p[1], z1] as V3)
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      const m = vsub(vlerp(box[i], box[j], 0.5), [(r0 + r1) / 2 * c, (r0 + r1) / 2 * s, z0])
      face(win, [box[i], box[j], top[j], top[i]], m)
    }
    face(win, top, [0, 0, 1])
    // a pale frame: corner posts and the head
    if (detail) {
      for (const w of [-W, W]) bar(silver, P(r1 + 0.2, w, z0), P(r1 + 0.2, w, z1), 0.8, 0.8, o, false)
      bar(silver, P(r1 + 0.2, -W, z1 - 0.4), P(r1 + 0.2, W, z1 - 0.4), 0.8, 0.8, o, false)
    }
  }

  // --- Inside (detail only; the closed roof hides it): two blue tiers.
  if (detail) {
    const lowIn: XY[] = superellipse(42, 62, 3.2, 64), lowOut: XY[] = superellipse(78, 96, 2.6, 64)
    const upIn: XY[] = superellipse(84, 102, 2.4, 64), upOut: XY[] = superellipse(118, 128, 2.2, 64)
    const steps = 5
    const rake = (a: XY[], b: XY[], z0: number, z1: number) => {
      for (let s = 0; s < steps; s++) {
        const A = ring(a, phis, 0).map((p, k) => vlerp(p, ring(b, [phis[k]], 0)[0], s / steps))
        const B = ring(a, phis, 0).map((p, k) => vlerp(p, ring(b, [phis[k]], 0)[0], (s + 1) / steps))
        const za = z0 + ((z1 - z0) * s) / steps, zb = z0 + ((z1 - z0) * (s + 1)) / steps
        band(seats, A.map((p) => [p[0], p[1], za] as V3), A.map((p) => [p[0], p[1], zb] as V3), IN)
        band(seats, A.map((p) => [p[0], p[1], zb] as V3), B.map((p) => [p[0], p[1], zb] as V3), UP)
      }
    }
    rake(lowIn, lowOut, 1.2, 14)
    band(win, ring(upIn, phis, 14), ring(upIn, phis, 17), IN) // the box ring
    band(silver, ring(lowOut, phis, 14), ring(upIn, phis, 14), UP)
    rake(upIn, upOut, 17, 38)
    band(silver, ring(upOut, phis, 38), ring(upOut, phis, 41), IN)
    // the roof's soffit over the stands
    band(silver, ring(upOut, phis, 44), ring(foot, phis, DOME_Z0 - 2), DOWN)
    band(silver, ring(upOut, phis, 41), ring(upOut, phis, 44), IN)
  }

  // Final heights: the podium is 14.5 m (see the header); the saucer above it
  // keeps the photo-scaled heights (x 0.968 of the authored ones, which were
  // drawn on a 12 m podium).
  const PZ = 14.5
  for (const part of [silver, roof, membrane, white, win, seats])
    for (let i = 1; i < part.pos.length; i += 3) {
      const z = part.pos[i]
      part.pos[i] = z <= PODIUM ? (z * PZ) / PODIUM : PZ + (z - PODIUM) * 0.968
    }
  const lit = (_p: V3, n: V3) => (n[2] > 0.6 ? 0.25 : 0.75)
  void nrm3
  return [
    { part: silver, material: { ...finish('krestovsky-silver', 0xb9bfc5), floodlight: lit } },
    { part: roof, material: finish('krestovsky-roof', 0xaab0b5) },
    { part: membrane, material: finish('krestovsky-membrane', 0xdfe3e6) },
    { part: white, material: { ...finish('krestovsky-white', 0xf2f2ee), floodlight: () => 0.9 } },
    { part: win, material: { ...PALETTE.window, color: 0x62809c } },
    { part: seats, material: finish('krestovsky-seats', 0x3f6fae) },
  ]
}

if (import.meta.main)
  await writeLods('Krestovsky Stadium (Gazprom Arena)', { bearing: BEARING, elevation: 0, height: 110 }, [
    { file: 'saint-petersburg-krestovsky.glb', parts: build(false), maxTris: 6500, maxBytes: 250_000 },
    { file: 'saint-petersburg-krestovsky.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1_500_000 },
  ])
