/**
 * Stade de France, Saint-Denis (Paris): original procedural geometry,
 * CC0-1.0, no textures.  bun generators/paris-stade-de-france.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/paris-stade-de-france.glb, the low model (<= 6,500 triangles);
 * - models/paris-stade-de-france.detail.glb, drawn from zoom 16 (<= 40,000):
 *   stepped tiers, the roof's radial girders under the opaque roof and the
 *   steel grid seen through the glass skirt, tapered masts with their
 *   crowns and full cable fans, the eighteen monumental stairs with
 *   parapets.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 348.9: model
 * +y runs along the long axis of the ellipse (and the pitch), +x across it.
 * Anchor = the area centroid of the roof outline (OSM way/64003104, the
 * leisure=stadium way, also the outer of building relation/3009843),
 * lng 2.3601335, lat 48.9244694. The bearing is the principal axis of the
 * roof's opening (way/86922720, 168.9 deg); in that frame the 18 masts are
 * symmetric about both axes to 0.5 m.
 *
 * Identity, in order: the elliptical "flying saucer" roof (6 ha) floating
 * over the bowl with a gap above the top tier, its pale top, white rim,
 * dark underside and the wide translucent glass skirt round the opening;
 * the 18 slim white needle masts round its outer zone, rising about 15 m
 * above it, each with its fan of stays; three tiers of grey seats (the
 * movable lower tier pale, the upper two mid grey) with dark fascia and
 * box bands between them; the dark glazed concourse under the overhang
 * with pale floor slabs and the 18 monumental stairs.
 *
 * Evidence
 *  - OSM (measured in this frame):
 *    - roof outer edge = way/64003104: superellipse a 140.4 (x), b 160.9
 *      (y), exponent 2.4 (rms 0.7 m); relation/3009844 (white, 30-31 m
 *      over ground, outer 64003104, inner way/64003105) = the opaque roof;
 *      relation/3009845 (glass, 30-31 m) = the glass skirt between
 *      way/64003105 (a 78.9, b 99.8, e 2.7) and the opening way/86922720
 *      (a 51.9, b 81.7, e 3.6). relation/3009843 building=stadium, height
 *      60, outer 64003104, inner 86922720.
 *    - masts: 18 building:part ways 226371204-221, height 60, roof:colour
 *      white, drawn exactly at their OSM centres (r 116.5 on the x axis,
 *      136.3 on the y axis).
 *    - stands: 8 building:parts 226403482-489 (height 29, skillion, white,
 *      roof grey) from x +-49 / y +-76 (tier front) out to x +-115 /
 *      y +-136 (the mast line).
 *  - Published (fr.wikipedia "Stade de France", fetched 2026-11):
 *    roof 6 ha, 13,000 t, "46 mètres au-dessus de la pelouse"; 18 masts
 *    61 m (also "hautes de 60 m"); pitch 119 x 75 m; pitch "située à
 *    11 mètres au-dessous du parvis"; three tiers, the lower a movable
 *    stand of 25,000 seats that retracts 15 m (rows 1-30), middle rows
 *    35-59, upper rows 61-87 at level 6 reached by 18 monumental
 *    staircases; 550 floodlights housed in the roof.
 *  - Heights (field = 0, parvis = 11): roof top 46 at the glass edge
 *    (published) falling to 45 at the rim, underside 42.5-43.5 (OSM
 *    min_height 30 + 11 = 41, published 46: the 3 m roof depth sits
 *    between); mast tops 61 (OSM height 60 read from the field, ESTIMATED: cao24 and ecluse show the needles about 15 m over the roof, which a 60 m mast from the parvis would double); the tiers' heights
 *    are ESTIMATED from the row counts (about 0.8 m tread, 0.35-0.5 m
 *    riser) and scaled from dg528 and dg483: lower tier 1-11 m, box band
 *    11-14.5, middle tier 15-25, box band 25-29, upper tier 29.5-40.
 *  - Elevation 0, not -11: the pitch is 11 m below the parvis (published),
 *    but the map's Mapterhorn z15 terrain already carries the dig (pitch
 *    at 31.4 m, parvis 10.9-11.2 m above it), and the map stands y = 0 on
 *    the lowest ground under the footprint, which is the pitch. With -11
 *    the field would sit 11 m under the real one (terrain check: 9.8 m of
 *    stands buried); with 0 the check prints ok twice.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - vellut: Guilhem Vellut, "Stade de France @ Saint-Denis
 *      (28359861273).jpg", CC BY 2.0: the overhang from the parvis, white
 *      rim, grey ribbed underside, masts, dark concourse, a stair.
 *      https://commons.wikimedia.org/wiki/File:Stade_de_France_@_Saint-Denis_(28359861273).jpg
 *    - cao24: Chabe01, "Stade France & Centre Aquatique Olympique -
 *      Saint-Denis (FR93) - 2024-02-17 - 1.jpg", CC BY-SA 4.0: the long side, masts
 *      and their stay fans, the thin roof disc and the dark concourse.
 *      https://commons.wikimedia.org/wiki/File:Stade_France_%26_Centre_Aquatique_Olympique_-_Saint-Denis_(FR93)_-_2024-02-17_-_1.jpg
 *    - ecluse: Chris93, "Le Stade de France vu des jardins de
 *      l'écluse.jpg", CC BY 4.0: masts and fans over the rim.
 *      https://commons.wikimedia.org/wiki/File:Le_Stade_de_France_vu_des_jardins_de_l%27%C3%A9cluse.jpg
 *    - fromsky: Citizen59, "ParisSaintDenisFromSky April2016.jpg", CC BY
 *      3.0: the plan from the air, pale roof top, opening.
 *      https://commons.wikimedia.org/wiki/File:ParisSaintDenisFromSky_April2016.jpg
 *    - dg528, dg483, dgtour: Daniel from Glasgow, "Stade de France
 *      (48109589528).jpg", "(48109593483).jpg", "Stade de France tour
 *      (48097725477).jpg", CC BY 2.0: inside, the three tiers, seat greys
 *      (lower tier pale, middle and upper mid grey), the gap under the
 *      roof, the glass skirt, the mast tops.
 *      https://commons.wikimedia.org/wiki/File:Stade_de_France_(48109589528).jpg
 *      https://commons.wikimedia.org/wiki/File:Stade_de_France_(48109593483).jpg
 *      https://commons.wikimedia.org/wiki/File:Stade_de_France_tour_(48097725477).jpg
 *    - aug24: Ilan Costica, "Stade de France 5 August 2024.jpg", CC0:
 *      seats and roof underside in 2024.
 *      https://commons.wikimedia.org/wiki/File:Stade_de_France_5_August_2024.jpg
 *    - oly24: Rmpbedford, "Stade de France, Olympics 2024.jpg", CC BY-SA
 *      4.0: the lower tier retracted, seat greys.
 *      https://commons.wikimedia.org/wiki/File:Stade_de_France,_Olympics_2024.jpg
 *    - nl2018: Darthvadrouw, "StadeFranceNationsLeague2018.jpg", CC BY-SA
 *      4.0, at night: the lit roof underside and floodlight ring.
 *      https://commons.wikimedia.org/wiki/File:StadeFranceNationsLeague2018.jpg
 *  No lidar or NAIP exists here (outside the US); no commercial imagery.
 *
 * Invented or simplified, and doubts:
 *  - The tier outlines are superellipses fitted to the OSM tier front and
 *    mast line; the tier sections are estimates from row counts.
 *  - The stays: each mast carries four bold stays, two in to the glass
 *    edge and two out towards the rim, splayed sideways as the fans read
 *    in cao24 and ecluse; the real cable layout is more intricate.
 *  - The 18 stairs are drawn as straight flights from the parvis to the
 *    upper concourse, one between each pair of masts, all climbing the
 *    same way round (their real run and direction were not checked for
 *    every one).
 *  - The concourse facade under the roof is a dark glass wall with four
 *    pale floor slabs; its real depth varies round the bowl.
 *  - Night: the roof underside and rim are floodlit, the concourse glazing
 *    is `window` (lit); the glass skirt stays dark. The skirt is a pale
 *    grey glass at 0.7 opacity: from the air (fromsky) it reads almost
 *    as the roof does, the ribs showing through.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { band, bar, writeLods, RAD } from './milan-san-siro'
import { se, face, vadd, vsub, vmul, vlerp, nrm3 } from './seoul-world-cup-stadium'

const BEARING = 348.9

/** Masts (OSM centres in this frame). */
const MASTS: [number, number][] = [
  [-114.5, -21.3], [-107.8, -64.6], [-83.6, -105.7], [-44.5, -129.9], [-0.4, -136.3], [43.5, -130.3],
  [83.2, -106.8], [107.2, -65.5], [114.3, -22.2], [114.5, 21.3], [107.7, 64.7], [83.8, 105.8],
  [44.5, 129.9], [0.5, 136.2], [-43.4, 130.4], [-83.2, 106.4], [-107.5, 65.9], [-114.3, 21.8],
]

type SE = [number, number, number] // a, b, exponent

// Plan rings (superellipses).
const OPEN: SE = [51.9, 81.7, 3.6] // the roof opening
const GLASS: SE = [78.9, 99.8, 2.7] // outer edge of the glass skirt
const RIM: SE = [140.4, 160.9, 2.4] // roof outer edge
const T1F: SE = [49, 76, 3.4] // lower tier front
const T1B: SE = [70, 96, 3.0]
const T2F: SE = [72.5, 98.5, 2.9]
const T2B: SE = [89, 115, 2.7]
const T3F: SE = [90.5, 116.5, 2.7]
const T3B: SE = [111, 132, 2.5]
const FAC: SE = [109.5, 130.5, 2.5] // concourse glazing line under the upper tier

const PARVIS = 11

function build(detail: boolean) {
  const roof = new Part(), dark = new Part(), white = new Part(), seats = new Part(), win = new Part(), glass = new Part()
  const N = detail ? 152 : 60
  const phis = Array.from({ length: N }, (_, k) => (k / N) * 2 * Math.PI)
  const P = (s: SE, f: number, z: number, grow = 0): V3 => {
    const r = se(f, s[0], s[1], s[2]) + grow
    return [r * Math.cos(f), r * Math.sin(f), z]
  }
  const R = (s: SE, z: number | ((f: number) => number), grow = 0) => phis.map((f) => P(s, f, typeof z === 'number' ? z : z(f), grow))
  const IN = (q: V3): V3 => [-q[0], -q[1], 0]
  const OUT = (q: V3): V3 => [q[0], q[1], 0]
  const UP = (): V3 => [0, 0, 1]
  const DOWN = (): V3 => [0, 0, -1]
  const SEAT = (q: V3): V3 => [-q[0], -q[1], 140]

  // --- The bowl.
  const rake = (p: Part, A: SE, za: number, B: SE, zb: number, steps: number) => {
    if (!detail) { band(p, R(A, za), R(B, zb), SEAT); return }
    for (let s = 0; s < steps; s++) {
      const t0 = s / steps, t1 = (s + 1) / steps
      const a = phis.map((f) => vlerp(P(A, f, za), P(B, f, zb), t0))
      const b = phis.map((f) => vlerp(P(A, f, za), P(B, f, zb), t1))
      const ar = a.map((q, k) => [q[0], q[1], b[k][2]] as V3)
      band(p, a, ar, IN)
      band(p, ar, b, UP)
    }
  }
  band(dark, R(T1F, 0), R(T1F, 1.4), IN) // pitch wall (the movable stand's front)
  rake(roof, T1F, 1.4, T1B, 11, 8) // lower tier, pale grey seats
  // box band between lower and middle tier: dark fascia over lit boxes
  band(dark, R(T1B, 11), R(T1B, 12), IN)
  band(win, R(T1B, 12, 0.6), R(T1B, 14.5, 0.6), IN)
  band(dark, R(T1B, 12, 0.6), R(T1B, 12, 0), UP)
  band(dark, R(T1B, 14.5, 0.6), R(T2F, 15), UP)
  rake(seats, T2F, 15, T2B, 25, 7) // middle tier
  band(dark, R(T2B, 25), R(T2B, 26), IN)
  band(win, R(T2B, 26, 0.6), R(T2B, 29, 0.6), IN)
  band(dark, R(T2B, 26, 0.6), R(T2B, 26, 0), UP)
  band(dark, R(T2B, 29, 0.6), R(T3F, 29.5), UP)
  rake(seats, T3F, 29.5, T3B, 40, 8) // upper tier
  // the upper tier's back wall and its top
  band(dark, R(T3B, 40), R(T3B, 41.2), IN)
  band(white, R(T3B, 41.2), R(T3B, 41.2, 1.2), UP)
  band(dark, R(T3B, 30, 1.2), R(T3B, 41.2, 1.2), OUT) // the back of the upper tier, in shadow

  // --- The concourse under the overhang: dark glazing with pale floor slabs.
  band(win, R(FAC, 0), R(FAC, 30), OUT)
  band(dark, R(FAC, 30), R(T3B, 30, 1.2), DOWN) // soffit of the upper tier's back
  for (const z of [PARVIS, 19, 26.5]) {
    const o = 2.4, th = 0.9
    band(white, R(FAC, z - th, o), R(FAC, z, o), OUT)
    band(white, R(FAC, z, 0), R(FAC, z, o), UP)
    if (detail) band(white, R(FAC, z - th, o), R(FAC, z - th, 0), DOWN)
  }

  // --- The 18 monumental stairs: straight flights between the masts,
  // from the parvis to the upper concourse, against the glazing.
  {
    const SW = detail ? 4.5 : 5
    for (let m = 0; m < MASTS.length; m++) {
      const f0 = Math.atan2(MASTS[m][1], MASTS[m][0]) + 4 * RAD
      const f1 = f0 + 12 * RAD
      const K = detail ? 6 : 2
      const L = (o: number, dz: number) => Array.from({ length: K + 1 }, (_, k) => {
        const f = f0 + ((f1 - f0) * k) / K
        return P(FAC, f, PARVIS + ((26.5 - PARVIS) * k) / K + dz, o)
      })
      band(dark, L(2.6, 0), L(2.6 + SW, 0), UP, false)
      band(dark, L(2.6 + SW, -0.8), L(2.6 + SW, 0), OUT, false)
      band(dark, L(2.6 + SW, -0.8), L(2.6, -0.8), DOWN, false)
      if (detail) {
        band(dark, L(2.6 + SW, 0), L(2.6 + SW, 1.1), OUT, false)
        band(dark, L(2.6 + SW - 0.25, 1.1), L(2.6 + SW - 0.25, 0), IN, false)
        band(dark, L(2.6 + SW - 0.25, 1.1), L(2.6 + SW, 1.1), UP, false)
      }
    }
  }

  // --- The roof: a flat elliptical disc, its top falling gently outward.
  const zTop = (t: number) => 46 - t // t: 0 at the glass edge, 1 at the rim
  const zBot = (t: number) => 43.5 - t
  {
    const K = detail ? 4 : 2
    for (let k = 0; k < K; k++) {
      const t0 = k / K, t1 = (k + 1) / K
      const A = phis.map((f) => vlerp(P(GLASS, f, zTop(0)), P(RIM, f, zTop(1)), t0))
      const B = phis.map((f) => vlerp(P(GLASS, f, zTop(0)), P(RIM, f, zTop(1)), t1))
      band(roof, A, B, UP)
      const C = phis.map((f) => vlerp(P(GLASS, f, zBot(0)), P(RIM, f, zBot(1)), t0))
      const D = phis.map((f) => vlerp(P(GLASS, f, zBot(0)), P(RIM, f, zBot(1)), t1))
      band(dark, C, D, DOWN)
    }
    // the white rim, slightly turned down
    band(white, R(RIM, zBot(1) - 0.6), R(RIM, zTop(1) + 0.3), OUT)
    band(white, R(RIM, zTop(1) + 0.3), R(RIM, zTop(1), -0.8), UP)
    band(white, R(RIM, zBot(1) - 0.6), R(RIM, zBot(1), -1.5), DOWN)
    // the glass skirt and its edges: the steel compression ring at the opening
    band(glass, R(OPEN, 45.3), R(GLASS, 45.9), UP)
    band(dark, R(OPEN, 42.6), R(OPEN, 45.6), IN)
    band(dark, R(OPEN, 42.6), R(OPEN, 42.6, 1.6), DOWN)
    band(dark, R(OPEN, 45.6), R(OPEN, 45.6, 1.2), UP)
    band(dark, R(GLASS, zBot(0)), R(GLASS, 46.0), IN)
    // radial ribs under the glass, read through it
    const every = detail ? 2 : 3
    for (let i = 0; i < N; i += every) {
      const f = phis[i]
      const a = P(OPEN, f, 44.2, 0.8), b = P(GLASS, f, 44.6)
      bar(dark, a, b, detail ? 0.7 : 1.1, detail ? 1.6 : 1.4, [0, 0, 1], !detail)
      if (detail) {
        // the girder's bottom chord and its web posts
        const c = P(OPEN, f, 42.8, 0.8), d = P(GLASS, f, 43.6)
        bar(dark, c, d, 0.5, 0.5, [0, 0, 1], false)
        for (let k = 1; k < 4; k++) bar(dark, vlerp(c, d, k / 4), vlerp(a, b, k / 4), 0.35, 0.35, [1, 0, 0], false)
      }
    }
    if (detail) {
      // purlin rings across the glass
      for (const t of [0.33, 0.66]) {
        const ring = phis.map((f) => vlerp(P(OPEN, f, 45.0, 0.8), P(GLASS, f, 45.4), t))
        for (let i = 0; i < N; i++) bar(dark, ring[i], ring[(i + 1) % N], 0.35, 0.35, [0, 0, 1], false)
      }
      // radial girders under the opaque roof
      for (let i = 0; i < N; i += 4) {
        const f = phis[i]
        bar(dark, P(GLASS, f, zBot(0) - 0.7), P(RIM, f, zBot(1) - 0.7, -2), 0.8, 1.4, [0, 0, 1], false)
      }
    }
  }

  // --- The masts: slim white needles from the parvis to 61 m, through the
  // roof, each with its crown and four stays.
  const TOP = 61 // OSM height 60 read from the field: 15 m over the roof, as scaled from cao24
  for (const [mx, my] of MASTS) {
    const f = Math.atan2(my, mx)
    const rad: V3 = [Math.cos(f), Math.sin(f), 0], tan: V3 = [-Math.sin(f), Math.cos(f), 0]
    const base: V3 = [mx, my, PARVIS]
    const head: V3 = [mx, my, TOP - 4]
    const tip: V3 = [mx, my, TOP]
    // tapered square shaft
    const sec = (c: V3, w: number) => [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([a, b]) => vadd(c, vadd(vmul(rad, a * w / 2), vmul(tan, b * w / 2))))
    const levels = detail ? [[PARVIS, 1.5], [46, 2.0], [TOP - 4, 1.2]] : [[PARVIS, 1.6], [46, 2.0], [TOP - 4, 1.2]]
    for (let l = 0; l < levels.length - 1; l++) {
      const A = sec([mx, my, levels[l][0]], levels[l][1]), B = sec([mx, my, levels[l + 1][0]], levels[l + 1][1])
      for (let k = 0; k < 4; k++) {
        const j = (k + 1) % 4
        face(white, [A[k], A[j], B[j], B[k]], vsub(vlerp(A[k], A[j], 0.5), [mx, my, levels[l][0]]))
      }
    }
    // the needle tip
    const A = sec(head, 1.2)
    for (let k = 0; k < 4; k++) face(white, [A[k], A[(k + 1) % 4], tip], vsub(vlerp(A[k], A[(k + 1) % 4], 0.5), head))
    // stays: in to the glass edge and out towards the rim, splayed sideways
    const rm = Math.hypot(mx, my)
    const rg = se(f, GLASS[0], GLASS[1], GLASS[2]) + 4
    const rr = se(f, RIM[0], RIM[1], RIM[2])
    const at = (r: number, s: number): V3 => {
      const p = vadd(vmul(rad, r), vmul(tan, s))
      const t = Math.min(1, Math.max(0, (Math.hypot(p[0], p[1]) - rg + 4) / (rr - rg + 4)))
      return [p[0], p[1], zTop(t) + 0.2]
    }
    const from: V3 = [mx, my, TOP - 5]
    const stays: V3[] = [at(rm - 20, -17), at(rm - 20, 17), at(Math.min(rr - 5, rm + 14), -18), at(Math.min(rr - 5, rm + 14), 18)]
    if (detail) stays.push(at(rm - 10, -21), at(rm - 10, 21), at(rm - 30, -6), at(rm - 30, 6))
    for (const s of stays) bar(white, from, s, detail ? 0.5 : 0.95, detail ? 0.5 : 0.95, nrm3(vsub(s, from)).map((v, i) => (i === 2 ? 0 : v)) as V3, false)
    // the crown: a short spreader across the head
    if (detail) bar(white, vadd(head, vmul(tan, -3.2)), vadd(head, vmul(tan, 3.2)), 0.7, 0.7, [0, 0, 1], true)
    if (detail) bar(white, vadd(head, vmul(rad, -2.4)), vadd(head, vmul(rad, 2.4)), 0.6, 0.6, [0, 0, 1], true)
    // collar where the mast passes the roof
    if (detail) bar(white, [mx, my, 44], [mx, my, 47.5], 3.2, 3.2, tan, true)
  }

  const lit = (_p: V3, n: V3) => (n[2] < -0.3 ? 0.85 : 0.3)
  return [
    { part: roof, material: finish('sdf-roof', 0xb8b7af) },
    { part: dark, material: { ...finish('sdf-steel', 0x5c6269), floodlight: lit } },
    { part: white, material: { ...finish('sdf-white', 0xf1eee6), floodlight: (_p: V3, n: V3) => (n[2] > 0.5 ? 0.2 : 0.6) } },
    { part: seats, material: finish('sdf-seats', 0x8a8f96) },
    { part: win, material: { ...PALETTE.window, color: 0x5d6b78 } },
    { part: glass, material: { ...PALETTE.glass, color: 0xa9b1b5, opacity: 0.7, doubleSided: true } },
  ]
}

if (import.meta.main)
  await writeLods('Stade de France', { bearing: BEARING, elevation: 0, height: 61 }, [
    { file: 'paris-stade-de-france.glb', parts: build(false), maxTris: 6500, maxBytes: 250_000 },
    { file: 'paris-stade-de-france.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1_500_000 },
  ])
