/**
 * Estádio Jornalista Mário Filho, the Maracanã (Rio de Janeiro; opened 16
 * June 1950, rebuilt inside 2010-13 with a single bowl and the
 * schlaich bergermann partner cable-and-membrane roof) — procedural,
 * CC0-1.0, no textures.  bun generators/rio-maracana.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/rio-maracana.glb, the low model (budget 6,500 triangles);
 * - models/rio-maracana.detail.glb, from zoom 16: stepped seating, the
 *   Y-shaped buttress frames, the flying masts and the radial cables.
 *
 * Map frame: x across the pitch, y along it, z up, metres. Placed at
 * bearing 31: the pitch's long side (OSM leisure=pitch way/1361281074 runs
 * at 31.0 deg, 104.5 x 67.9 m). Anchor -43.230177, -22.912155, the centre
 * of the bowl's outline (OSM grandstand relation/5588917, 284 x 318 m,
 * centred 1.3 m off the pitch centre). The model is symmetric about both
 * axes, as the real bowl is; only the ramps follow their own OSM outlines.
 *
 * Plan. The stands are a family of offset ellipses about the centre,
 * P(d, t) = ((47 + d) cos t, (64 + d) sin t): d is the distance out from
 * the seat front, which sits 13 m off the touch lines and 12 m behind the
 * goal lines (estimated from the aerials bar2, bar3). With d = 94-95 that
 * family gives the OSM outline's half axes (141-142 x 159; published
 * 279 x 317 m, pt.wikipedia), so one parameter carries the whole section:
 *   d 0-30   lower tier, z 1.2-11 (yellow front rows, then blue);
 *   d 30-32  the ring of boxes (camarotes), glazed face z 11-15.5;
 *   d 32-66  upper tier, z 15.5-27 (blue, yellow front rows);
 *   d 66-84  the top concourse under the roof's compression ring;
 *   d 84     the glazed concourse wall, z 0-27;
 *   d 86-95  the outward-raked concrete buttress columns, foot to head;
 *   d 82-96  the white rounded fascia (the "bead") on the column heads.
 * Roof: published "constant roof depth of 68 m" and "internal opening of
 * 160 x 122 m" (DETAIL, "Anticipation: Maracanã Stadium in Rio de
 * Janeiro", via its search abstract) and "295 x 258 m" (sbp project page)
 * give the membrane from d = 15 (opening 154 x 128 here, the offset family
 * cannot make both 160 and 122 at once) to d = 83. "A tension ring at about
 * two thirds of the roof depth" where "the upper and lower radial cable
 * bundles are splayed apart by a flying mast and meet again at the inner
 * edge" (DETAIL): the masts stand at d = 38. "A spoked-wheel design with
 * one compression ring and three tension rings ... kept low at the inner
 * and outer rim" (sbp). The roof's 60 radial axes are the 60 column bays
 * (counted on the aerials: about 30 bays in each half).
 *
 * Heights: OSM grandstand parts height=32 (relation/5597035-38) for the
 * top of the bead. ESTIMATED from the photos, scaled to that: the tiers
 * above; the roof's outer rim 32.4 m, its crest over the masts 39 m, the
 * inner rim 33.5 m, the masts' feet 29.5 m; the floor slabs at 5.5, 10.5,
 * 16, 21.5 m; the columns' lean (9 m out over 29 m, from ded5 and
 * structure). The long ramps (OSM relation/5588906, 5588909 and their side
 * ways) are drawn to the photos rather than to their OSM tags (16-32 m),
 * which no photo bears out: the main deck rises from the colonnade's roof
 * (10.5 m) to the 16 m floor; the side block steps down from 10.5 to 4 m
 * toward the bowl (OSM roof:direction agrees). The four low ramp houses
 * (Rampa B, C, E, F, height=10) are their OSM outlines at 10 m.
 *
 * Elevation 0: the field is taken at the level of the streets round the
 * stadium (the lower tier is entered at street level in fachada and
 * structure; the 1950 moat was ~3 m deep, pt.wikipedia). No published
 * field level was found: doubt. The map's terrain here only exists at z12
 * (Mapterhorn 404s at z13-15) and reads the bowl itself as a 10-16 m hill,
 * so it is no evidence for the field's depth.
 *
 * Colours from the daylight photos, pulled to the palette's lightness:
 * grey-white concrete (the facade went back to grey in 2013, en.wikipedia),
 * a white bead and white masts, the white PTFE membrane, seats "yellow,
 * blue and white" (en.wikipedia; yellow near the pitch, pt.wikipedia), the
 * dark-blue band of solar panels round the roof's outer edge.
 *
 * Evidence (all EVIDENCE unless marked):
 *  - OSM: stadium relation/4587734 (Q155174), grandstand relation/5588917
 *    and its sectors relation/5597035-38 (height 32), ramps
 *    relation/5588906-11, way/1578331406, way/1578331416, way/1578325888,
 *    the colonnades relation/5588896 and 5588899, pitch way/1361281074.
 *  - Photos, Wikimedia Commons:
 *    - basil_a, basil_d, basil_e: Daniel Basil, "Maracanã 2014 a/d/e.jpg",
 *      CC BY 3.0 BR (Portal da Copa): aerials from the east and south-east.
 *      https://commons.wikimedia.org/wiki/File:Maracan%C3%A3_2014_e.jpg
 *    - bar1, bar2, bar3: Diego Baravelli, "Estádio Maracanã 1/2/3.jpg",
 *      CC BY-SA 4.0: aerials (south-east; over the roof; into the bowl).
 *      https://commons.wikimedia.org/wiki/File:Est%C3%A1dio_Maracan%C3%A3_1.jpg
 *    - mueseler: Arne Müseler, "Maracana 2022.jpg", CC BY-SA 3.0 DE:
 *      aerial from the south-west: membrane ridges, masts ring, seats.
 *      https://commons.wikimedia.org/wiki/File:Maracana_2022.jpg
 *    - aer_lopez: Pedro Lopez, "Aerial view of the Maracanã Stadium.jpg",
 *      CC BY 2.0 (before 2010: the old concrete roof; plan and ramps only).
 *      https://commons.wikimedia.org/wiki/File:Aerial_view_of_the_Maracan%C3%A3_Stadium.jpg
 *    - ded5: Валерий Дед, "Rio de Janeiro Maracanã Stadium 5.jpg",
 *      CC BY 3.0: street level, the raked columns, bead and slabs.
 *      https://commons.wikimedia.org/wiki/File:Rio_de_Janeiro_Maracan%C3%A3_Stadium_5.jpg
 *    - structure: GilbertoSilvaFan, "Estádio do Maracanã structure.jpg",
 *      CC BY-SA 4.0: the buttress frames close up (before 2013, painted blue).
 *      https://commons.wikimedia.org/wiki/File:Est%C3%A1dio_do_Maracan%C3%A3_structure.jpg
 *    - fachada: Mark Scott Johnson, "Fachada Estádio do Maracanã.jpg",
 *      CC BY 2.0 (before 2013; the lower concourse).
 *      https://commons.wikimedia.org/wiki/File:Fachada_Est%C3%A1dio_do_Maracan%C3%A3.jpg
 *    - bv2020: Boaventuravinicius, "Estádio do Maracanã no início de
 *      2020.jpg", CC BY-SA 4.0: inside: tiers, boxes, roof underside.
 *      https://commons.wikimedia.org/wiki/File:Est%C3%A1dio_do_Maracan%C3%A3_no_in%C3%ADcio_de_2020.jpg
 *    - ciuffo: Leandro Neumann Ciuffo, "Maracanã stadium.jpg", CC BY 2.0:
 *      inside at night: flying masts, lower cables, floodlights.
 *      https://commons.wikimedia.org/wiki/File:Maracan%C3%A3_stadium.jpg
 *  - Published: en.wikipedia and pt.wikipedia "Estádio do Maracanã"
 *    (317 x 279 m, height 32 m, single bowl since 2013, seat colours, roof
 *    covers 95% of seats); sbp.de project page (46,500 m², 295 x 258 m,
 *    one compression and three tension rings); DETAIL (68 m depth,
 *    160 x 122 m opening, flying masts at two thirds of the depth).
 *  - No lidar, NAIP or usable terrain exists here. No commercial imagery.
 *
 * Round 2 (review): the facade is pale concourse slabs (four floors) that
 * step out to the raked columns, with the concourse wall recessed behind
 * them in dark grey; each bay has the raked column and the upright inner
 * leg of its Y frame (every other bay in the low model). The membrane's
 * vaults are deeper (3 m sag) and creased at the 60 ridge cables, with a
 * grey line drawn along each ridge; the blue solar band is 4 m wide and
 * continuous; the inner edge ring is white. Seats: a narrow yellow band
 * along the pitch (5 m), white blocks in the middle of each side's lower
 * tier, blue elsewhere (bar2, bar3, mueseler, bv2020). The long ramps'
 * side blocks keep pale concrete roofs (basil_e shows them pale);
 * the colonnades are pale columns under a curved deck.
 *
 * Invented or simplified: the seat mosaic is reduced to yellow front rows
 * and blue behind (white seats left out); the three tension rings are one
 * ring at the mast heads plus the inner edge; the membrane's sag between
 * ridge cables is 1.2 m; the stair cores and vomitories are left out of the
 * low model; the floodlights along the inner rim are not drawn (six
 * materials). The colonnades' roofs (OSM 16-19 m) are drawn at 10.5 m from
 * the photos. Doubts: the field level; the exact tier break heights; the
 * roof's crest height (no published figure; from the street photos the
 * membrane shows only a little above the bead).
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { face, strip, vaults, beam, tube, nrm3 } from './seoul-world-cup-stadium'

export type XY = [number, number]

// ---------------------------------------------------------------------------
// Section, in (d, z): d out from the seat front, see the header.

const A0 = 47, B0 = 64
const P = (d: number, t: number, z: number): V3 => [(A0 + d) * Math.cos(t), (B0 + d) * Math.sin(t), z]
/** Outward horizontal normal of the offset ellipse at parameter t and offset d. */
const outN = (t: number, d = 60): V3 => nrm3([Math.cos(t) / (A0 + d), Math.sin(t) / (B0 + d), 0])

const ROOF = { dOut: 83, dMast: 38, dIn: 15, zOut: 32.4, zCrest: 39, zIn: 33.5, zMastFoot: 29.5, zLowOut: 29 }
const COL = { d0: 84.6, d1: 95, z1: 25 } // raked buttress: foot (d0, 0), head (d1, z1)
const colD = (z: number) => COL.d0 + ((COL.d1 - COL.d0) * z) / COL.z1
const SLABS = [5, 10, 15, 20]
const BAYS = 60

/** Lofts a (d, z) profile round the ring at n samples; side +1 shows the profile's left (up/inward for a rising, outgoing line). */
function loftProfile(p: Part, n: number, prof: [number, number][], side: 1 | -1, flat = false, t0 = 0, range?: [number, number]) {
  const closed = !range
  const ts = range
    ? Array.from({ length: n + 1 }, (_, k) => range[0] + ((range[1] - range[0]) * k) / n)
    : Array.from({ length: n }, (_, k) => t0 + (k / n) * 2 * Math.PI)
  for (let i = 0; i < prof.length - 1; i++) {
    const [d0, z0] = prof[i], [d1, z1] = prof[i + 1]
    const nd = -(z1 - z0) * side, nz = (d1 - d0) * side
    const r0 = ts.map((t) => P(d0, t, z0)), r1 = ts.map((t) => P(d1, t, z1))
    strip(p, r0, r1, (q) => {
      const t = Math.atan2(q[1] / (B0 + d0), q[0] / (A0 + d0))
      const o = outN(t, (d0 + d1) / 2)
      return [o[0] * nd, o[1] * nd, nz]
    }, closed, flat)
  }
}

/**
 * Seat colours round the ring, from the aerials (bar2, bar3, mueseler) and
 * bv2020: mostly blue, a narrow yellow band along the pitch, white blocks
 * in the middle of each side's lower tier.
 */
const WHITE_HALF = 0.2 // half-angle of the white blocks about t = 0 and t = pi
function seatRanges(d: number, tier: 0 | 1, parts: { blue: Part; yellow: Part; white: Part }): Array<[number, number, Part]> {
  if (tier === 0 && d < 5) return [[0, 2 * Math.PI, parts.yellow]]
  if (tier === 1 || d > 20 || d < 8) return [[0, 2 * Math.PI, parts.blue]]
  const w = WHITE_HALF
  return [[-w, w, parts.white], [w, Math.PI - w, parts.blue], [Math.PI - w, Math.PI + w, parts.white], [Math.PI + w, 2 * Math.PI - w, parts.blue]]
}
function seatLoft(parts: { blue: Part; yellow: Part; white: Part }, n: number, prof: [number, number][], dMid: number, tier: 0 | 1, flat: boolean) {
  for (const [a, b, part] of seatRanges(dMid, tier, parts)) {
    if (b - a > 6.2) loftProfile(part, n, prof, 1, flat)
    else loftProfile(part, Math.max(3, Math.round((n * (b - a)) / (2 * Math.PI))), prof, 1, flat, 0, [a, b])
  }
}

type Lod = { n: number; seatN: number; detail: boolean }
export const LOW: Lod = { n: 60, seatN: 60, detail: false }
const DETAIL: Lod = { n: 240, seatN: 120, detail: true }

// The ramps, from OSM in this frame (x across the pitch, y along it).
const C0: XY = [1.3, -0.4] // the bowl centre, in the pitch-centred frame the OSM was read in
const osm = (pts: XY[]): XY[] => pts.map(([x, y]) => [x - C0[0], y - C0[1]] as XY)
const RAMP_HOUSES: XY[][] = ([
  // Rampa B - Sul relation/5588907
  [[-87.9, -126.0], [-89.6, -133.0], [-89.8, -135.9], [-88.7, -138.9], [-86.4, -141.8], [-73.9, -150.1], [-57.6, -159.7], [-54.6, -160.1], [-51.8, -159.3], [-49.1, -157.9], [-43.7, -152.0], [-48.1, -150.2], [-56.7, -146.6], [-68.1, -140.6], [-77.9, -133.7], [-81.8, -130.9]],
  // Rampa C - Sul relation/5588908
  [[41.5, -152.5], [50.0, -159.4], [52.8, -160.7], [55.1, -160.6], [58.1, -159.7], [69.1, -154.3], [77.5, -149.3], [83.5, -145.5], [89.1, -141.4], [91.9, -138.6], [93.0, -136.4], [93.1, -133.5], [90.1, -123.9], [86.5, -127.1], [79.3, -132.8], [71.8, -138.0], [64.0, -142.7], [56.0, -146.7], [47.8, -150.3]],
  // Rampa E - Norte relation/5588910
  [[88.9, 124.6], [91.4, 132.3], [90.7, 136.5], [88.9, 139.4], [85.7, 141.8], [67.6, 152.5], [59.2, 157.4], [56.4, 158.4], [53.4, 158.0], [50.1, 156.7], [44.3, 151.2], [53.5, 147.5], [68.1, 139.5], [80.6, 131.1]],
  // Rampa F - Norte relation/5588911
  [[-44.5, 151.0], [-48.1, 154.4], [-49.7, 155.8], [-51.1, 156.8], [-53.9, 157.9], [-58.1, 157.2], [-66.2, 153.4], [-73.5, 149.2], [-81.9, 144.1], [-88.3, 138.6], [-90.4, 135.8], [-91.2, 132.9], [-90.9, 130.0], [-89.0, 123.9], [-81.4, 130.4], [-68.5, 139.5], [-54.0, 147.3]],
] as XY[][]).map(osm)

const area = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)

/** Ear clipping for a simple counter-clockwise ring. */
function triangulate(r: XY[]): [number, number, number][] {
  const idx = r.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 20000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i - 1 + idx.length) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      if (cr(r[ia], r[ib], r[ic]) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inside(r[j], r[ia], r[ib], r[ic]))) continue
      out.push([ia, ib, ic]); idx.splice(i, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** A prism over a polygon from z0 to z1 (z1 may vary with position): walls and a top. */
function prismPoly(wall: Part, top: Part, poly: XY[], z0: number, z1: number | ((p: XY) => number), bottom = false) {
  const r = ccw(poly), zt = typeof z1 === 'number' ? () => z1 : z1
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const n: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
    face(wall, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], zt(b)], [a[0], a[1], zt(a)]], n)
  }
  for (const [i, j, k] of triangulate(r)) {
    const pt = (q: XY): V3 => [q[0], q[1], zt(q)]
    face(top, [pt(r[i]), pt(r[j]), pt(r[k])], [0, 0, 1])
    if (bottom) face(wall, [[r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], [r[k][0], r[k][1], z0]], [0, 0, -1])
  }
}

// ---------------------------------------------------------------------------

export function build(L: Lod) {
  const concrete = new Part(), white = new Part(), membrane = new Part()
  const blue = new Part(), yellow = new Part(), glazing = new Part()
  const n = L.n, nf = L.detail ? 120 : 48 // nf: the facade's slabs and glazing

  // --- The bowl. Pitch wall, lower tier, boxes, upper tier, top concourse.
  loftProfile(concrete, L.seatN, [[0, 0], [0, 1.2]], 1)
  const lower: [number, number][] = [[0, 1.2], [30, 11]]
  const upper: [number, number][] = [[32, 15.5], [66, 27]]
  const sp = { blue, yellow, white }
  for (const [tier, [[da, za], [db, zb]], steps] of [[0, lower, L.detail ? 10 : 0], [1, upper, L.detail ? 12 : 0]] as const) {
    const zAt = (d: number) => za + ((zb - za) * (d - da)) / (db - da)
    if (!steps) {
      // low model: smooth rakes in the colour bands
      const cuts = tier === 0 ? [da, 5, 8, 20, db] : [da, db]
      for (let i = 0; i < cuts.length - 1; i++) seatLoft(sp, L.seatN, [[cuts[i], zAt(cuts[i])], [cuts[i + 1], zAt(cuts[i + 1])]], (cuts[i] + cuts[i + 1]) / 2, tier, false)
      continue
    }
    const dd = (db - da) / steps, dz = (zb - za) / steps
    for (let s = 0; s < steps; s++) {
      const d0 = da + s * dd, z0 = za + s * dz
      seatLoft(sp, L.seatN, [[d0, z0], [d0, z0 + dz], [d0 + dd, z0 + dz]], d0 + dd / 2, tier, true) // riser and tread
    }
  }
  // gangway behind the lower tier, the glazed box front, its sill and lid
  if (L.detail) {
    loftProfile(concrete, L.seatN, [[30, 11], [30.6, 11], [30.6, 11.6]], 1)
    loftProfile(glazing, L.seatN, [[30.6, 11.6], [30.6, 14.6]], 1)
    loftProfile(concrete, L.seatN, [[30.6, 14.6], [30.6, 15.5], [32, 15.5]], 1)
    // the top concourse behind the upper tier, under the roof
    loftProfile(concrete, nf, [[66, 27], [66, 28.2], [84, 28.2]], 1)
  } else {
    loftProfile(glazing, L.seatN, [[30, 11], [30.6, 14.6]], 1)
    loftProfile(concrete, L.seatN, [[30.6, 14.6], [32, 15.5]], 1)
    loftProfile(concrete, 40, [[66, 27], [84, 28.2]], 1) // under the roof: coarse
  }

  // --- The outer wall: glazing set back behind the slabs, the slabs out to the column line.
  // the recessed concourse wall, in shadow (dark grey, not a blue-grey glass wall)
  loftProfile(glazing, nf, [[83.2, 0], [83.2, 24.6]], -1)
  // pale concourse slabs, each stepping out to the raked columns: deep bands with dark gaps between floors
  for (const z of SLABS) {
    const de = colD(z + 1.4) - 0.2
    loftProfile(concrete, nf, L.detail ? [[83.2, z + 1.4], [de, z + 1.4], [de, z - 1.2], [83.2, z - 1.2]] : [[83.2, z + 1.4], [de, z + 1.4], [de, z - 1.2]], 1)
  }

  // --- The raked buttress columns: one per bay, foot inward, head outward.
  for (let k = 0; k < BAYS; k++) {
    const t = ((k + 0.5) / BAYS) * 2 * Math.PI
    const o = outN(t, 90)
    const foot = P(COL.d0, t, 0), head = P(COL.d1, t, COL.z1)
    beam(concrete, [[foot[0], foot[1], 0.9], head], 2.0, 2.4, o)
    if (L.detail || k % 2 === 0) {
      // the inner, upright leg of the Y frame (structure photo), and its tie at the second slab
      // (low model: the upright leg alone, straight; detail: with its tie)
      const iFoot = P(83.6, t, 0.7), iHead = P(83.6, t, 16.4)
      beam(concrete, L.detail ? [iFoot, iHead, P(colD(16.4) - 0.5, t, 16.4)] : [iFoot, iHead], 1.2, 1.4, o)
    }
    // the rib over the bead at the column head, in concrete
    if (L.detail) {
      const rib: V3[] = [[82.6, 32.3], [88, 33.05], [93, 32.45], [96.0, 30.3], [96.8, 27.2], [95.9, 24.8]].map(([d, z]) => P(d, t, z))
      beam(concrete, rib, 1.4, 0.7, [0, 0, 1])
    } else {
      // low model: a flat band laid over the bead, 1.6 m wide
      const tg: V3 = nrm3([-Math.sin(t) * (A0 + 90), Math.cos(t) * (B0 + 90), 0])
      const prof: [number, number][] = [[82.4, 32.4], [93, 32.8], [96.6, 27.4]]
      const side = (w: number) => prof.map(([d, z]) => { const q = P(d, t, z); return [q[0] + tg[0] * w, q[1] + tg[1] * w, q[2]] as V3 })
      const a = side(-0.8), b = side(0.8)
      for (let i = 0; i < prof.length - 1; i++) {
        const nd = prof[i + 1][1] - prof[i][1], nz = -(prof[i + 1][0] - prof[i][0])
        face(concrete, [a[i], b[i], b[i + 1], a[i + 1]], [o[0] * -nd, o[1] * -nd, -nz])
      }
    }
  }

  // --- The bead: the white rounded fascia ring on the column heads, one pillow per bay.
  const beadProf: [number, number][] = [[82.4, 32.2], [88, 32.9], [93, 32.3], [95.8, 30.2], [96.6, 27.2], [95.8, 25], [93.5, 24.4], [84, 24.6]]
  if (!L.detail) loftProfile(white, n, [[82.4, 32.2], [92, 32.75], [96.6, 28.6], [95.4, 24.4], [84, 24.6]], 1)
  else {
    // pillows pinched at the ribs: the section shrinks toward each bay's ends
    const per = n / BAYS
    const ts = Array.from({ length: n + 1 }, (_, k) => (k / n) * 2 * Math.PI)
    const pinch = (k: number) => { const f = (k % per) / per; return 0.55 + 0.45 * Math.sin(Math.PI * f) }
    const shape = (k: number) => beadProf.map(([d, z]) => {
      const s = pinch(k), dc = 89.5, zc = 28.5
      return [dc + (d - dc) * (0.85 + 0.15 * s), zc + (z - zc) * (0.7 + 0.3 * s)] as [number, number]
    })
    for (let i = 0; i < beadProf.length - 1; i++) {
      const r0 = ts.slice(0, n).map((t, k) => { const [d, z] = shape(k)[i]; return P(d, t, z) })
      const r1 = ts.slice(0, n).map((t, k) => { const [d, z] = shape(k)[i + 1]; return P(d, t, z) })
      strip(white, r0, r1, (q) => {
        const [d, z] = beadProf[i], [d1, z1] = beadProf[i + 1]
        const nd = -(z1 - z), nz = (d1 - d)
        const o = outN(Math.atan2(q[1] / (B0 + d), q[0] / (A0 + d)), d)
        return [o[0] * nd, o[1] * nd, nz]
      })
    }
  }

  // --- The roof: membrane over 60 radial bays, vaulted between ridge cables.
  const RD = L.detail ? [83, 75, 66, 57, 48, 38, 31, 23, 15] : [83, 61, 38, 15]
  const crest = (d: number) => d >= ROOF.dMast
    ? ROOF.zOut + (ROOF.zCrest - ROOF.zOut) * Math.pow((ROOF.dOut - d) / (ROOF.dOut - ROOF.dMast), 0.85)
    : ROOF.zIn + (ROOF.zCrest - ROOF.zIn) * Math.pow((d - ROOF.dIn) / (ROOF.dMast - ROOF.dIn), 0.9)
  const sag = (d: number) => {
    const f = d >= ROOF.dMast ? (ROOF.dOut - d) / (ROOF.dOut - ROOF.dMast) : (d - ROOF.dIn) / (ROOF.dMast - ROOF.dIn)
    return 3.0 * Math.sin(Math.PI * f)
  }
  const roofN = BAYS * 2
  const sub = roofN / BAYS
  const roofPt = (d: number, k: number): V3 => {
    const f = (k % sub) / sub // 0 at a ridge cable
    const z = crest(d) - sag(d) * Math.sin(Math.PI * f)
    return P(d, (k / roofN) * 2 * Math.PI, z)
  }
  const rings = RD.map((d) => Array.from({ length: roofN }, (_, k) => roofPt(d, k)))
  for (let i = 0; i < RD.length - 1; i++) vaults(membrane, rings[i], rings[i + 1], () => [0, 0, 1]) // creased at the ridge cables, smooth in the troughs
  // the dark-blue band of solar panels round the outer edge, just above the membrane
  // (laid at the ridge height, so the band reads as one continuous ring)
  const solar = [83, 79].map((d) => Array.from({ length: roofN }, (_, k) => P(d, (k / roofN) * 2 * Math.PI, crest(d) + 0.15)))
  strip(blue, solar[0], solar[1], () => [0, 0, 1])
  // the radial ridge cables, drawn as grey lines on the membrane so the 60 bays read from above (mueseler)
  for (let k = 0; k < BAYS; k++) {
    const t = (k / BAYS) * 2 * Math.PI, w = 0.0045
    const seg = L.detail ? [75, 66, 57, 48, 38, 31, 23, 16] : [75, 38]
    for (let i = 0; i < seg.length - 1; i++) {
      const a = seg[i], b = seg[i + 1]
      face(concrete, [P(a, t - w, crest(a) + 0.12), P(a, t + w, crest(a) + 0.12), P(b, t + w, crest(b) + 0.12), P(b, t - w, crest(b) + 0.12)], [0, 0, 1])
    }
  }
  // the compression ring's inner face under the membrane edge
  if (L.detail) loftProfile(concrete, nf, [[82.4, 28.2], [82.4, 32.1]], 1)

  // the tension ring at the mast heads, and the inner edge ring, in white steel
  const ringTube = (d: number, z: number, r: number, m: number, part = white) => {
    const pts = Array.from({ length: m + 1 }, (_, k) => P(d, (k / m) * 2 * Math.PI, z))
    for (let k = 0; k < m; k++) tube(part, pts[k], pts[k + 1], r, r, L.detail ? 4 : 3, false, false, Math.PI / 2, true)
  }
  ringTube(ROOF.dIn, ROOF.zIn - 0.4, L.detail ? 0.7 : 1.0, L.detail ? 120 : 40)
  if (!L.detail) ringTube(ROOF.dMast, ROOF.zCrest + 0.3, 0.75, 30) // the mast heads' ring, bold
  if (L.detail) {
    ringTube(ROOF.dMast, ROOF.zCrest + 0.35, 0.35, 120)
    ringTube(ROOF.dMast, ROOF.zMastFoot, 0.35, 120)
  }

  // flying masts (one per bay) and, in the detail model, the radial cables under the membrane
  for (let k = 0; k < BAYS; k++) {
    const t = (k / BAYS) * 2 * Math.PI
    const top = P(ROOF.dMast, t, ROOF.zCrest + 0.6), foot = P(ROOF.dMast, t, ROOF.zMastFoot)
    if (L.detail) {
      tube(white, foot, top, 0.45, 0.45, 6, true, true)
      const low = [P(ROOF.dOut - 0.5, t, ROOF.zLowOut), foot, P(ROOF.dIn, t, ROOF.zIn - 0.4)]
      tube(blue, low[0], low[1], 0.22, 0.22, 4, false, false)
      tube(blue, low[1], low[2], 0.22, 0.22, 4, false, false)
      // the V stays of the tension ring, seen on top of the membrane (bar2, bar3)
      const tn = ((k + 0.5) / BAYS) * 2 * Math.PI
      const a = P(ROOF.dMast - 7, tn, crest(ROOF.dMast - 7) + 0.15)
      tube(blue, [top[0], top[1], top[2] - 0.2], a, 0.16, 0.16, 4, false, false)
      const tp = ((k - 0.5) / BAYS) * 2 * Math.PI
      const b = P(ROOF.dMast - 7, tp, crest(ROOF.dMast - 7) + 0.15)
      tube(blue, [top[0], top[1], top[2] - 0.2], b, 0.16, 0.16, 4, false, false)
    }
  }

  // --- The long ramps, west (-x) and east (+x), and their colonnades.
  for (const s of [-1, 1] as const) {
    const xIn = s * (colD(16) + A0 - 0.5), xOut = s * 236
    const deck = (x: number) => 10.5 + ((16 - 10.5) * (x - xOut)) / (xIn - xOut)
    // main deck, 16 m wide: a 1.4 m slab rising to the bowl, on two rows of columns every 12 m
    const y0 = -8, y1 = 8, th = 1.4
    const c = (x: number, y: number, top: boolean): V3 => [x, y, deck(x) - (top ? 0 : th)]
    face(concrete, [c(xIn, y0, true), c(xOut, y0, true), c(xOut, y1, true), c(xIn, y1, true)], [0, 0, 1])
    face(concrete, [c(xIn, y0, false), c(xOut, y0, false), c(xOut, y1, false), c(xIn, y1, false)], [0, 0, -1])
    face(concrete, [c(xIn, y0, false), c(xOut, y0, false), c(xOut, y0, true), c(xIn, y0, true)], [0, -1, 0])
    face(concrete, [c(xIn, y1, false), c(xOut, y1, false), c(xOut, y1, true), c(xIn, y1, true)], [0, 1, 0])
    face(concrete, [c(xOut, y0, false), c(xOut, y1, false), c(xOut, y1, true), c(xOut, y0, true)], [s, 0, 0])
    for (let x = xOut - s * 6; s * x > s * xIn + 3; x -= s * (L.detail ? 12 : 24)) {
      for (const y of [y0 + 1.5, y1 - 1.5]) tube(concrete, [x, y, 0], [x, y, deck(x) - th], 0.6, 0.6, L.detail ? 6 : 4, false, false)
    }
    // side block: sloping solar-panel roof stepping down toward the bowl (west: south side, east: north side)
    const ys: [number, number] = s < 0 ? [-25, -8] : [8, 24]
    const sx = (x: number) => 10.5 + ((4 - 10.5) * (x - xOut)) / (s * 140.5 - xOut)
    prismPoly(concrete, concrete, [[s * 140.5, ys[0]], [xOut, ys[0]], [xOut, ys[1]], [s * 140.5, ys[1]]], 0, (p) => sx(p[0]))
    // the colonnade: an arc band round a centre 290 m out on the axis, radii 40-56 m
    const cx = s * 290, a0 = -0.75, a1 = 0.75, m = L.detail ? 16 : 8
    const arc = (r: number) => Array.from({ length: m + 1 }, (_, i) => {
      const a = a0 + ((a1 - a0) * i) / m
      return [cx - s * r * Math.cos(a), r * Math.sin(a)] as XY
    })
    const outer = arc(56), inner = arc(40)
    const band: XY[] = [...outer, ...inner.reverse()]
    // roof slab 9.2-10.5 m
    prismPoly(concrete, concrete, band, 9.2, 10.5, true)
    // columns along both arcs
    for (const r of [42, 54]) for (let i = 0; i <= m; i += L.detail ? 1 : 4) {
      const a = a0 + ((a1 - a0) * i) / m
      const c: V3 = [cx - s * r * Math.cos(a), r * Math.sin(a), 0]
      tube(white, c, [c[0], c[1], 9.2], 0.5, 0.5, L.detail ? 8 : 4, false, false)
    }
  }
  // the west ramp's low flat block (OSM way/1578325888, height 8)
  prismPoly(concrete, concrete, osm([[-191.0, 7.0], [-191.1, 24.2], [-138.6, 24.9], [-139.9, 14.3], [-140.3, 6.9]]).map(([x, y]) => [x, Math.max(y, 8)] as XY), 0, 8)

  // --- The four low ramp houses (helical ramps), height 10, with two glazed bands.
  for (const h of RAMP_HOUSES) {
    prismPoly(concrete, concrete, h, 0, 10)
    if (L.detail) {
      const r = ccw(h)
      for (let i = 0; i < r.length; i++) {
        const a = r[i], b = r[(i + 1) % r.length]
        const L2 = Math.hypot(b[0] - a[0], b[1] - a[1])
        if (L2 < 4) continue
        const nx = (b[1] - a[1]) / L2, ny = -(b[0] - a[0]) / L2
        for (const [z0, z1] of [[3.2, 5.6], [6.8, 8.9]]) {
          face(glazing, [[a[0] + nx * 0.05, a[1] + ny * 0.05, z0], [b[0] + nx * 0.05, b[1] + ny * 0.05, z0], [b[0] + nx * 0.05, b[1] + ny * 0.05, z1], [a[0] + nx * 0.05, a[1] + ny * 0.05, z1]], [nx, ny, 0])
        }
      }
    }
  }

  const lit = (_p: V3, nn: V3) => (nn[2] > 0.6 ? 0.15 : 0.75)
  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: concrete, material: { ...finish('maracana-concrete', 0xd3d5d2), floodlight: lit } },
    { part: white, material: { ...finish('maracana-white', 0xf4f3ee), floodlight: lit } },
    { part: membrane, material: { name: 'glass', color: 0xf1f1ec, roughness: 0.6, opacity: 0.92, doubleSided: true } },
    { part: blue, material: finish('maracana-seat-blue', 0x5374a6) },
    { part: yellow, material: finish('maracana-seat-yellow', 0xdcc172) },
    { part: glazing, material: { ...PALETTE.window, color: 0x6c7176 } },
  ]
  return parts
}

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (process.env.DEBUG) console.log(file, parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(" "))
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Maracanã', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 31, elevation: 0, height: 39.6,
  })
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

if (import.meta.main) {
  await write('rio-maracana.glb', build(LOW), 6500, 250_000)
  await write('rio-maracana.detail.glb', build(DETAIL), 40_000, 1536 * 1024)
}
