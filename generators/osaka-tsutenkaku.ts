/**
 * Tsutenkaku (通天閣), Shinsekai, Naniwa, Osaka: procedural, CC0-1.0.
 * bun generators/osaka-tsutenkaku.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/osaka-tsutenkaku.glb, the low model: the four legs over the
 *   street, the truss storey and the glazed podium, the shaft as open 3D
 *   members (corner chords, a ring girder and an X brace in every panel),
 *   the four outrigger frames, the octagonal head on its raking struts and
 *   the round weather-light crown; within 6,500 triangles;
 * - models/osaka-tsutenkaku.detail.glb, drawn from zoom 16: the same frame
 *   with twice the panels and a diamond round every X, plan bracing, the
 *   outrigger booms as open triangular lattice girders, the sign letters as
 *   strokes, the ring lights, the roof railings and the "Tip the Tsutenkaku"
 *   plank.
 *
 * Map frame: x east, y north, z up, metres, origin on the ground at the
 * centroid of OSM way/254319878 (the podium's outline, a square 25.5 m on a
 * side). Built with its faces on the axes; the placement's bearing (15.5)
 * turns them to OSM's faces, which point 15.5, 105.5, 195.5 and 285.5
 * degrees. The ground is flat here (Mapterhorn z14: 0.6 m across 80 m);
 * elevation 0.
 *
 * The second tower (1956, Tachū Naitō; the first stood 1912-1943). Four
 * legs straddle a public street; above them a truss storey and a two-storey
 * glazed podium, then a square steel lattice shaft tapering to an octagonal
 * observation head, with four outrigger frames below the head and a round
 * light crown on the roof. Repainted "pop silver" (near white) in 2022-23;
 * modelled as it is since.
 *
 * Published (ja.wikipedia "通天閣"):
 * - 108 m to the lightning rod's tip (since 2016-17), the body 100 m;
 * - width 24 m, 24 m between the legs;
 * - 2F (Under Floor) 18.0 m, 3F 22.0 m, the 3F roof garden 26.0 m;
 * - 4F floor 84.0 m (光の展望台), 5F floor 87.5 m (黄金の展望台), the open
 *   roof deck 天望パラダイス at 94.5 m;
 * - the entrance's octagonal ceiling about 12 m up, under the base;
 * - the signs: a product name on the north and south faces and the HITACHI
 *   logo alternating with a slogan on the east face (12-colour LED tubes
 *   since 2017); the weather light (光の天気予報) on the crown, white for
 *   fine weather.
 *
 * OSM: way/254319878 (通天閣, building=commercial, height 108, 6 levels):
 * the podium square, 25.5 m on a side, faces at 15.5 degrees. No parts.
 *
 * From photos, scaled on the published heights (4F 84 m and the roof deck
 * 94.5 m on Sakai Yayoi's "New Tsutenkaku"; the 26 m roof and 108 m tip on
 * そらみみ's distant "Hondori" view, 12.9 px/m) and on the 24-25 m width:
 * - the legs: four broad grey legs leaning in from about 22.5 m apart at the
 *   ground to the truss storey's corners at 12 m, straight haunches at the
 *   top of each opening (Tokumeigakarinoaoshima, Sept 2023);
 * - the truss storey 12-18 m: posts and V braces before a glazed wall, set
 *   in 3.8 m from the podium, which overhangs it on all four sides;
 * - the podium 18-26 m: two glazed storeys in a white frame, a deep fascia
 *   under them, a parapet and a railing on the roof;
 * - the shaft 26-76 m: half-side 7.0 m at the roof, 3.1 m under the head
 *   (estimated, ±0.7 m, from the shaft-to-podium and shaft-to-head width
 *   ratios in three views; the lead's review found the first pass, 3.6 m,
 *   too wide at the top);
 *   four corner chords, ring girders about every 5 m, an X in every panel,
 *   a solid grey lift core inside (about 4.6 m square);
 * - the outriggers: in each corner's diagonal plane a boom rising to a tip
 *   about 78.5 m up and one falling to about 65.5 m, 15.5 m from the axis
 *   (two long girders crossing in an X in each diagonal plane), a horizontal
 *   arm between them (Sakai Yayoi, Kernan, Mr.ちゅらさん 2020);
 * - the head: an octagon flat to the shaft's faces, about 17 m across its
 *   flats at 84 m flaring to 18.6 m at the roof, two glazed storeys, on a
 *   sloping grey soffit carried by eight raking struts from the shaft;
 * - the crown: a short drum and dome about 5.4 m across on the roof deck,
 *   then the rod to 108 m;
 * - the signs (2024): white channel letters standing on the lattice, the
 *   slogan (nine characters) on the north face and 通天閣 (three) on the west,
 *   the south face a tall dark board with a vertical logo, HITACHI in small
 *   letters under the head on the north, the clock on the south face of the
 *   head's lower storey with HITACHI under it.
 *
 * Signs: the lettering is a trademark and a slogan, so no letters or
 *   glyphs are drawn: each sign is a plain lit panel at the real size and
 *   place (neon white): a strip 3.2 x 36.5 m for the slogan on the north
 *   face, 3.8 x 19.5 m for the name on the west and east, and on the south
 *   the dark board 3.8 x 41.5 m with one lit inset panel; the small HITACHI
 *   signs are plain lit bars. STYLE.md's "Famous signs" exception is not
 *   used. The east face, which no licensed photo shows square on, repeats
 *   the west's panel (estimated).
 *
 * Colours (daylight photos, sunlit pixels, re-sampled after review on
 *   Sakai Yayoi "108m", "New Tsutenkaku" and Tokumeigakarinoaoshima Sept
 *   2023): the steel "pop silver", #d8dde3-#cfd6dc in sun, #a9b3c4 in shade
 *   (a cool, slightly violet grey); the legs, truss storey and the podium's
 *   frame drawn silver grey #d0d5da (not white: the frame reads grey metal
 *   with white mullions); the lattice and the head's frame #c4c6d9, see
 *   Night; the glazing a light grey-blue window (#8fa4b5, it reflects the
 *   sky); the core and soffit mid grey (roof); the south board near black,
 *   drawn #50565e; the sign panels, clock and crown white neon.
 *
 * Night (Sakai Yayoi "yoru", Mr.ちゅらさん 2023-11): the whole lattice and
 *   head are lit in coloured LED light (purple in "yoru"; red, blue by
 *   season). STYLE.md's floodlight is warm white only, so the lattice, the
 *   outriggers, the struts and the head's frame are one `neon` material,
 *   neon-tsutenkaku-lattice #c4c6d9: by day a cool silver a shade towards
 *   violet (the shaded steel in the photos reads #a9b3c4), at night a
 *   lavender glow over the whole frame. A stronger purple turned the tower
 *   visibly purple by day; this is the compromise, as tokyo-tower's
 *   neon-landmark-light is. The legs, truss storey and podium frame keep a
 *   warm floodlight wash; the sign panels, clock and crown are `neon` white
 *   (the weather light's "fine" colour); the podium and head glazing glow as
 *   windows. The detail model adds the round fittings on the ring girders as
 *   small white neon beads.
 *
 * Estimated: the leg positions and thickness (2.8 m at the ground, 2.2 m at
 *   12 m), the haunches, the truss storey's set-back, member sizes (drawn
 *   heavier than real so the frame reads: corner chords 1.2 m, rings 0.75 m,
 *   braces 0.6 m in the low model), the ring spacing, the outrigger geometry
 *   (±1 m), the head's flare and storey split, the crown's size, the core.
 * Left out: the podium's rooftop plant and the 2F links to the buildings
 *   round it, the stairs and lifts inside the shaft, the cameras, the
 *   railings in the low model.
 *
 * Photos (Wikimedia Commons):
 * - "Tsutenkaku 108m.jpg", Sakai Yayoi, CC0 (shaft, letters, outriggers, head; from the north)
 * - "New Tsutenkaku, Osaka.jpg", Sakai Yayoi, CC0 (head, struts, outriggers, podium)
 * - "Osaka Tsutenkaku yoru 01.jpg", Sakai Yayoi, CC0 (night)
 * - "Tsūtenkaku on 29th September 2023 (9).jpg", Tokumeigakarinoaoshima, CC BY-SA 4.0 (legs, truss storey, podium, south board, clock; from the south)
 * - "Tsutenkaku-Hondori Shopping Street and Tsutenkaku Tower.jpg", そらみみ, CC BY-SA 4.0 (heights, taper; distant, from the north)
 * - "Tsutenkaku, Osaka.jpg", David Kernan, CC BY 4.0 (west face sign, head)
 * - "Tsutenkaku 2020-11.jpg", Mr.ちゅらさん, CC BY-SA 4.0 (head, outriggers; before the 2022-23 renewal)
 * - "Tsutenkaku 2023-11.jpg", Mr.ちゅらさん, CC0 (night: crown, clock, ring lights)
 * - "Tsutenkaku at day.JPG", Tokumeigakarinoaoshima, CC0 (before 2022: podium, shaft)
 * Look-only: none.
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const TAU = Math.PI * 2
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const lerpV = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]

/** A quad whose winding follows its normals. */
function face(p: Part, Q: V3[], N: V3[]) {
  const f = cross(sub(Q[1], Q[0]), sub(Q[2], Q[0]))
  const avg = N.reduce(add, [0, 0, 0] as V3)
  const [a, b, c, d] = dot(f, avg) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  p.tri(Q[a], Q[b], Q[c], undefined, undefined, undefined, [N[a], N[b], N[c]])
  p.tri(Q[a], Q[c], Q[d], undefined, undefined, undefined, [N[a], N[c], N[d]])
}
const flat = (p: Part, Q: V3[], n: V3) => face(p, Q, [n, n, n, n])

/** A convex polygon facing n. */
function poly(p: Part, Q: V3[], n: V3) {
  for (let i = 1; i < Q.length - 1; i++) {
    const g = cross(sub(Q[i], Q[0]), sub(Q[i + 1], Q[0]))
    if (dot(g, n) >= 0) p.tri(Q[0], Q[i], Q[i + 1], undefined, undefined, undefined, [n, n, n])
    else p.tri(Q[0], Q[i + 1], Q[i], undefined, undefined, undefined, [n, n, n])
  }
}

/** A straight member from a to b: a prism of `sides` faces, open-ended. */
function member(p: Part, a: V3, b: V3, r: number, sides = 3) {
  const t = unit(sub(b, a))
  const m = mul(add(a, b), 0.5)
  const out: V3 = Math.hypot(m[0], m[1]) < 1e-6 ? [1, 0, 0] : unit([m[0], m[1], 0])
  let u = sub(out, mul(t, dot(out, t)))
  if (Math.hypot(...u) < 1e-6) u = Math.abs(t[2]) < 0.9 ? cross(t, [0, 0, 1]) : cross(t, [1, 0, 0])
  u = unit(u)
  const v = unit(cross(t, u))
  const off = (k: number): V3 => {
    const ang = (k / sides) * TAU + (sides === 4 ? Math.PI / 4 : 0)
    return add(mul(u, r * Math.cos(ang)), mul(v, r * Math.sin(ang)))
  }
  for (let k = 0; k < sides; k++) {
    const o0 = off(k), o1 = off(k + 1)
    face(p, [add(a, o0), add(a, o1), add(b, o1), add(b, o0)], [unit(o0), unit(o1), unit(o1), unit(o0)])
  }
}

/** An oriented box: centre c, half-axis vectors u, v, w (all six faces). */
function obox(p: Part, c: V3, u: V3, v: V3, w: V3, skip: { bottom?: boolean } = {}) {
  const P = (a: number, b: number, d: number) => add(c, add(mul(u, a), add(mul(v, b), mul(w, d))))
  const nu = unit(u), nv = unit(v), nw = unit(w)
  flat(p, [P(1, -1, -1), P(1, 1, -1), P(1, 1, 1), P(1, -1, 1)], nu)
  flat(p, [P(-1, -1, -1), P(-1, -1, 1), P(-1, 1, 1), P(-1, 1, -1)], mul(nu, -1))
  flat(p, [P(-1, 1, -1), P(-1, 1, 1), P(1, 1, 1), P(1, 1, -1)], nv)
  flat(p, [P(-1, -1, -1), P(1, -1, -1), P(1, -1, 1), P(-1, -1, 1)], mul(nv, -1))
  flat(p, [P(-1, -1, 1), P(1, -1, 1), P(1, 1, 1), P(-1, 1, 1)], nw)
  if (!skip.bottom) flat(p, [P(-1, -1, -1), P(-1, 1, -1), P(1, 1, -1), P(1, -1, -1)], mul(nw, -1))
}

/** Sides of a lofted ring stack (rings counter-clockwise from above), flat-shaded. */
function loft(p: Part, rings: V3[][]) {
  for (let k = 0; k < rings.length - 1; k++) {
    const n = rings[k].length
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const b0 = rings[k][i], b1 = rings[k][j], t0 = rings[k + 1][i], t1 = rings[k + 1][j]
      flat(p, [b0, b1, t1, t0], unit(cross(sub(b1, b0), sub(t0, b0))))
    }
  }
}
/** Flat cap over a convex ring (counter-clockwise from above). */
const cap = (p: Part, ring: V3[], up: boolean) => poly(p, ring, [0, 0, up ? 1 : -1])

/** A square ring with chamfered corners, half-side h, chamfer c, centre (cx, cy). */
function chamfered(h: number, c: number, z: number, cx = 0, cy = 0): V3[] {
  const q: Array<[number, number]> = [[-h + c, -h], [h - c, -h], [h, -h + c], [h, h - c], [h - c, h], [-h + c, h], [-h, h - c], [-h, -h + c]]
  return q.map(([x, y]) => [cx + x, cy + y, z])
}
/** A regular octagon with its flats on the axes, apothem a. */
function octagon(a: number, z: number): V3[] {
  const R = a / Math.cos(Math.PI / 8)
  return Array.from({ length: 8 }, (_, k) => {
    const t = -Math.PI / 2 - Math.PI / 8 + (k * Math.PI) / 4
    return [R * Math.cos(t), R * Math.sin(t), z] as V3
  })
}

/** Surface of revolution from [r, z] (left of the profile is outside), smooth-shaded. */
function lathe(p: Part, profile: [number, number][], k: number) {
  for (let b = 0; b < profile.length - 1; b++) {
    const [r0, z0] = profile[b], [r1, z1] = profile[b + 1]
    const er = r1 - r0, ez = z1 - z0, l = Math.hypot(er, ez) || 1
    const n = [ez / l, -er / l]
    const N = (a: number): V3 => unit([n[0] * Math.cos(a), n[0] * Math.sin(a), n[1]])
    const P = (r: number, a: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]
    for (let s = 0; s < k; s++) {
      const a0 = (s / k) * TAU, a1 = ((s + 1) / k) * TAU
      const q = [P(r0, a0, z0), P(r0, a1, z0), P(r1, a1, z1), P(r1, a0, z1)]
      const nn = [N(a0), N(a1), N(a1), N(a0)]
      if (r1 < 1e-6) p.tri(q[0], q[1], q[2], undefined, undefined, undefined, [nn[0], nn[1], nn[2]])
      else if (r0 < 1e-6) p.tri(q[0], q[2], q[3], undefined, undefined, undefined, [nn[0], nn[2], nn[3]])
      else face(p, q, nn)
    }
  }
}

/** A small octahedron bead. */
function bead(p: Part, c: V3, r: number) {
  const X: V3[] = [[r, 0, 0], [0, r, 0], [-r, 0, 0], [0, -r, 0]]
  const top = add(c, [0, 0, r]), bot = add(c, [0, 0, -r])
  for (let i = 0; i < 4; i++) {
    const a = add(c, X[i]), b = add(c, X[(i + 1) % 4])
    p.tri(a, b, top)
    p.tri(b, a, bot)
  }
}

// ------------------------------------------------------------- the shape ---
const POD = 12.7          // podium half-side (OSM 25.5 m square; published width 24 m)
const BAND = 8.9          // truss storey half-side (photo: set in 3.8 m)
const Z_BAND = 12, Z_POD = 18, Z_ROOF = 26
const SHAFT_TOP = 76
/** Half-side of the shaft at its corner chords. */
const L = (z: number) => 3.1 + 3.9 * Math.pow(Math.max(0, (SHAFT_TOP - z) / (SHAFT_TOP - Z_ROOF)), 1.12)
const dL = (z: number) => (L(z + 0.05) - L(z - 0.05)) / 0.1
/** Leg centre (half-distance on each axis) and half-thickness. */
const LEG_C = (z: number) => 11.2 + (7.8 - 11.2) * (z / Z_BAND)
const LEG_H = (z: number) => 1.75 + (1.2 - 1.75) * (z / Z_BAND)

/** The four faces: outward normal and the along-face direction (left to right seen from outside). */
const FACES: Array<{ n: V3; t: V3; name: string }> = [
  { n: [0, -1, 0], t: [1, 0, 0], name: 'south' },
  { n: [1, 0, 0], t: [0, 1, 0], name: 'east' },
  { n: [0, 1, 0], t: [-1, 0, 0], name: 'north' },
  { n: [-1, 0, 0], t: [0, -1, 0], name: 'west' },
]
const CORNERS: Array<[number, number]> = [[1, 1], [-1, 1], [-1, -1], [1, -1]]

/** A point on shaft face f: along-face u, height z, `off` outward from the face plane. */
function onFace(f: number, u: number, z: number, off = 0): V3 {
  const { n, t } = FACES[f]
  const r = L(z) + off
  return [n[0] * r + t[0] * u, n[1] * r + t[1] * u, z]
}
/** The shaft face's outward normal at z (it leans in, so it looks a little up). */
function faceNormal(f: number, z: number): V3 {
  const { n } = FACES[f]
  return unit([n[0], n[1], -dL(z)])
}

type Sizes = {
  detail: boolean
  chord: number; ring: number; diag: number; sub: number
  rings: number[]
  boom: number
  k: number
}
const ringsEvery = (step: number) => {
  const r: number[] = []
  for (let z = Z_ROOF; z < SHAFT_TOP - 0.01; z += step) r.push(z)
  r.push(SHAFT_TOP)
  return r
}
const LOW: Sizes = { detail: false, chord: 0.62, ring: 0.4, diag: 0.32, sub: 0, rings: ringsEvery(5), boom: 0.38, k: 16 }
const DETAIL: Sizes = { detail: true, chord: 0.5, ring: 0.3, diag: 0.24, sub: 0.17, rings: ringsEvery(2.5), boom: 0.18, k: 24 }

function build(s: Sizes) {
  const steel = new Part() // legs, truss storey, podium frame: silver grey (floodlit)
  const white = steel      // the podium's frame is the same silver grey
  const lat = new Part()   // the lattice, outriggers, struts and the head's frame: lit in colour at night (neon)
  const glaze = new Part() // podium and head glazing (window)
  const grey = new Part()  // roofs, soffits, the lift core (roof)
  const board = new Part() // the south sign board (charcoal)
  const neon = new Part()  // letters, clock face, crown (neon white)

  // --- Legs: broad chamfered columns leaning in from the ground to the
  // truss storey's corners at 12 m.
  for (const [sx, sy] of CORNERS) {
    const ring = (z: number) => chamfered(LEG_H(z), 0.35, z, sx * LEG_C(z), sy * LEG_C(z))
    loft(steel, [ring(0), ring(Z_BAND)])
  }
  // Each face's opening: the beam under the truss storey and straight
  // haunches down the legs' inner edges (a plate in the legs' plane).
  for (let f = 0; f < 4; f++) {
    const { n, t } = FACES[f]
    const P = (u: number, z: number, o: number): V3 => {
      const r = LEG_C(z) + o
      return [n[0] * r + t[0] * u, n[1] * r + t[1] * u, z]
    }
    const inner = (z: number) => LEG_C(z) - LEG_H(z) + 0.1
    const zh = 7.6, zb = 10.4, hu = inner(zb) - 2.6
    // outline: up the left leg, across the top, down the right leg, then the opening's edge back
    const outline: Array<[number, number]> = [
      [-inner(zh), zh], [-inner(Z_BAND), Z_BAND], [inner(Z_BAND), Z_BAND], [inner(zh), zh], [hu, zb], [-hu, zb],
    ]
    for (const o of [-0.5, 0.5]) {
      // the plate is not convex: split it into the beam and two haunch triangles
      const nn: V3 = o > 0 ? n : mul(n, -1)
      poly(steel, [P(-hu, zb, o), P(hu, zb, o), P(inner(Z_BAND), Z_BAND, o), P(-inner(Z_BAND), Z_BAND, o)], nn)
      poly(steel, [P(-inner(zh), zh, o), P(-hu, zb, o), P(-inner(Z_BAND), Z_BAND, o)], nn)
      poly(steel, [P(inner(zh), zh, o), P(inner(Z_BAND), Z_BAND, o), P(hu, zb, o)], nn)
    }
    // the opening's soffit edges
    const edge = (a: [number, number], b: [number, number]) => {
      const A0 = P(a[0], a[1], -0.5), A1 = P(a[0], a[1], 0.5), B0 = P(b[0], b[1], -0.5), B1 = P(b[0], b[1], 0.5)
      const d = sub(B1, A1)
      let nn = unit(cross(d, n))
      if (nn[2] > 0.01 || (Math.abs(nn[2]) < 0.01 && dot(nn, mul(t, a[0])) > 0)) nn = mul(nn, -1)
      flat(steel, [A0, B0, B1, A1], nn)
    }
    edge(outline[3], outline[4]); edge(outline[4], outline[5]); edge(outline[5], outline[0])
  }

  // --- The truss storey (12-18 m): a glazed wall behind posts and V braces.
  const wallH = BAND - 0.5
  const sq = (h: number, z: number): V3[] => [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]]
  loft(glaze, [sq(wallH, Z_BAND), sq(wallH, Z_POD - 0.4)])
  cap(grey, sq(BAND + 0.3, Z_BAND), false)
  loft(steel, [sq(BAND + 0.3, Z_BAND - 0.6), sq(BAND + 0.3, Z_BAND)])
  for (let f = 0; f < 4; f++) {
    const { n, t } = FACES[f]
    const Q = (u: number, z: number): V3 => [n[0] * BAND + t[0] * u, n[1] * BAND + t[1] * u, z]
    const posts = [-BAND, -BAND / 2, 0, BAND / 2, BAND]
    const z0 = Z_BAND + 0.3, z1 = Z_POD - 0.6
    member(steel, Q(-BAND, z1), Q(BAND, z1), 0.42, 4)
    for (const u of posts) member(steel, Q(u, z0), Q(u, z1), 0.42, 4)
    for (let i = 0; i < posts.length - 1; i++) {
      const m = (posts[i] + posts[i + 1]) / 2
      member(steel, Q(posts[i], z1), Q(m, z0), 0.34, 4)
      member(steel, Q(posts[i + 1], z1), Q(m, z0), 0.34, 4)
    }
  }

  // --- The podium (18-26 m): fascia, two glazed storeys, parapet, roof.
  const pz = [Z_POD - 0.6, 19.6, 22.0, 22.8, 25.0, Z_ROOF]
  cap(white, chamfered(POD, 0.4, pz[0]), false) // the underside where it overhangs
  loft(white, [chamfered(POD, 0.4, pz[0]), chamfered(POD, 0.4, pz[pz.length - 1])])
  cap(grey, chamfered(POD - 0.6, 0.3, Z_ROOF - 0.3), true)
  loft(white, [chamfered(POD - 0.6, 0.3, Z_ROOF), chamfered(POD - 0.6, 0.3, Z_ROOF - 0.3)].map((r) => [...r].reverse()))
  cap(white, chamfered(POD, 0.4, Z_ROOF), true) // parapet top: drawn whole, the roof sits 0.3 m below inside
  for (let f = 0; f < 4; f++) {
    const { n, t } = FACES[f]
    const bays = 6, wide = 2 * (POD - 0.6), pier = 0.35
    for (const [za, zb] of [[pz[1], pz[2]], [pz[3], pz[4]]]) {
      for (let b = 0; b < bays; b++) {
        const u0 = -wide / 2 + (b * wide) / bays + pier / 2, u1 = -wide / 2 + ((b + 1) * wide) / bays - pier / 2
        const Q = (u: number, z: number): V3 => [n[0] * (POD + 0.05) + t[0] * u, n[1] * (POD + 0.05) + t[1] * u, z]
        flat(glaze, [Q(u0, za), Q(u1, za), Q(u1, zb), Q(u0, zb)], n)
      }
    }
  }
  if (s.detail) {
    // the roof railing
    const rh = POD - 0.25
    for (let f = 0; f < 4; f++) {
      const { n, t } = FACES[f]
      const Q = (u: number, z: number): V3 => [n[0] * rh + t[0] * u, n[1] * rh + t[1] * u, z]
      member(steel, Q(-rh, Z_ROOF + 1.1), Q(rh, Z_ROOF + 1.1), 0.07, 4)
      for (let u = -rh; u <= rh + 0.01; u += 2.5) member(steel, Q(u, Z_ROOF), Q(u, Z_ROOF + 1.1), 0.05, 4)
    }
  }

  // --- The lift core inside the shaft, roof to head.
  const CORE = 2.3
  loft(board, [chamfered(CORE, 0.3, Z_ROOF), chamfered(CORE, 0.3, 81)])

  // --- The shaft: corner chords, ring girders, an X in every panel.
  const R = s.rings
  for (const [sx, sy] of CORNERS)
    for (let i = 0; i < R.length - 1; i++)
      member(lat, [sx * L(R[i]), sy * L(R[i]), R[i]], [sx * L(R[i + 1]), sy * L(R[i + 1]), R[i + 1]], s.chord, s.detail ? 6 : 4)
  // the chords run on through the soffit to the head
  const topL = (z: number) => L(SHAFT_TOP) - 0.12 * (z - SHAFT_TOP)
  for (const [sx, sy] of CORNERS) member(lat, [sx * L(SHAFT_TOP), sy * L(SHAFT_TOP), SHAFT_TOP], [sx * topL(83.4), sy * topL(83.4), 83.4], s.chord * 0.9, s.detail ? 6 : 4)
  for (let k = 0; k < R.length; k++) {
    const z1 = R[k]
    for (let f = 0; f < 4; f++) {
      const A1 = onFace(f, -L(z1), z1), B1 = onFace(f, L(z1), z1)
      member(lat, A1, B1, s.ring, 4)
      if (s.detail && k % 4 === 0) {
        // plan bracing: face centre to the next face's centre
        member(lat, onFace(f, 0, z1), onFace((f + 1) % 4, 0, z1), s.sub)
      }
      if (k === 0) continue
      const z0 = R[k - 1]
      const A0 = onFace(f, -L(z0), z0), B0 = onFace(f, L(z0), z0)
      member(lat, A0, B1, s.diag)
      member(lat, B0, A1, s.diag)
      if (s.detail) {
        // a diamond round the X's crossing
        const mA = lerpV(A0, A1, 0.5), mB = lerpV(B0, B1, 0.5)
        const m0 = lerpV(A0, B0, 0.5), m1 = lerpV(A1, B1, 0.5)
        member(lat, mA, m1, s.sub); member(lat, m1, mB, s.sub); member(lat, mB, m0, s.sub); member(lat, m0, mA, s.sub)
      }
    }
  }

  // --- The outriggers: in each diagonal plane two long girders cross at the
  // axis in an X, so each corner sends out a boom rising to a tip at 78.5 m
  // and one falling to 65.5 m, 15.5 m from the axis, with a horizontal arm
  // between them (Sakai Yayoi; Mr.ちゅらさん 2020).
  const ZX = 72, KX = 0.42, R_TIP = 15.5
  for (const [sx, sy] of CORNERS) {
    const d: V3 = unit([sx, sy, 0])
    const at = (r: number, z: number): V3 => [d[0] * r, d[1] * r, z]
    const rc = L(ZX) * Math.SQRT2
    const hubU = at(rc, ZX + rc * KX), hubL = at(rc, ZX - rc * KX), hubH = at(rc, ZX)
    const tipU = at(R_TIP, ZX + R_TIP * KX), tipL = at(R_TIP, ZX - R_TIP * KX), tipH = at(R_TIP - 2.2, ZX)
    if (!s.detail) {
      for (const [a, b] of [[hubU, tipU], [hubL, tipL], [hubH, tipH]] as Array<[V3, V3]>) member(lat, a, b, s.boom, 4)
      member(lat, tipU, lerpV(hubH, tipH, 0.45), s.boom * 0.7)
      member(lat, tipL, lerpV(hubH, tipH, 0.45), s.boom * 0.7)
      member(lat, tipH, tipU, s.boom * 0.7)
      member(lat, tipH, tipL, s.boom * 0.7)
    } else {
      // each boom an open triangular girder, deep at the root, to a point at the tip
      const side = unit(cross(d, [0, 0, 1]))
      const girder = (a: V3, b: V3, depth: number, n: number) => {
        const ax = unit(sub(b, a))
        const up = unit(cross(side, ax))
        const sec = (t: number) => {
          const c = lerpV(a, b, t), h = depth * (1 - 0.85 * t)
          return [add(c, mul(side, h * 0.5)), add(c, mul(side, -h * 0.5)), add(c, mul(up, h * 0.8))] as V3[]
        }
        for (let i = 0; i < n; i++) {
          const s0 = sec(i / n), s1 = sec((i + 1) / n)
          for (let c = 0; c < 3; c++) {
            member(lat, s0[c], s1[c], 0.14, 4)
            member(lat, s0[c], s1[(c + 1) % 3], 0.07, 3)
          }
          for (let c = 0; c < 3; c++) member(lat, s1[c], s1[(c + 1) % 3], 0.07, 3)
        }
      }
      girder(hubU, tipU, 1.6, 6)
      girder(hubL, tipL, 1.6, 6)
      girder(hubH, tipH, 1.2, 5)
      for (let i = 1; i <= 4; i++) {
        const t = i / 5
        member(lat, lerpV(hubH, tipH, t), lerpV(hubU, tipU, t + 0.1), 0.1)
        member(lat, lerpV(hubH, tipH, t), lerpV(hubL, tipL, t + 0.1), 0.1)
      }
      member(lat, tipH, tipU, 0.12); member(lat, tipH, tipL, 0.12)
    }
  }

  // --- The head: a sloping soffit on eight raking struts, two glazed
  // storeys flaring out, the roof deck.
  const H0 = 83.6
  const soffit = [octagon(L(SHAFT_TOP) + 0.1, SHAFT_TOP + 0.5), octagon(8.4, H0)]
  loft(grey, soffit.map((r) => [...r].reverse())) // faces down and out
  for (let k = 0; k < 8; k++) {
    const a = -Math.PI / 2 - Math.PI / 8 + (k * Math.PI) / 4
    const Rv = 8.4 / Math.cos(Math.PI / 8) - 0.3
    const rs = L(73.5) * (k % 2 ? 1 : 1)
    const base: V3 = [Math.cos(a) * rs * 1.15, Math.sin(a) * rs * 1.15, 73.5]
    member(lat, base, [Math.cos(a) * Rv, Math.sin(a) * Rv, H0 - 0.3], s.detail ? 0.3 : 0.42, 4)
  }
  const bands: Array<[number, number, number, number, Part]> = [
    // z0, z1, apothem at z0, at z1, part
    [H0, 84.6, 8.4, 8.45, lat],
    [84.6, 88.0, 8.45, 8.9, lat],
    [88.0, 88.9, 8.9, 8.95, lat],
    [88.9, 93.2, 8.95, 9.3, lat],
    [93.2, 94.6, 9.3, 9.3, lat],
  ]
  cap(lat, octagon(8.4, H0), false)
  for (const [z0, z1, a0, a1, part] of bands) loft(part, [octagon(a0, z0), octagon(a1, z1)])
  cap(grey, octagon(9.3, 94.6), true)
  // glazing: one panel per face per storey, white piers at the corners
  for (const [z0, z1, a0, a1] of [[84.6, 88.0, 8.45, 8.9], [88.9, 93.2, 8.95, 9.3]]) {
    const r0 = octagon(a0, z0), r1 = octagon(a1, z1)
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8
      const b0 = r0[i], b1 = r0[j], t0 = r1[i], t1 = r1[j]
      const n = unit(cross(sub(b1, b0), sub(t0, b0)))
      const at = (u: number, v: number): V3 => add(lerpV(lerpV(b0, b1, u), lerpV(t0, t1, u), v), mul(n, 0.05))
      const panes = s.detail ? 2 : 1
      for (let w = 0; w < panes; w++) {
        const u0 = w / panes + 0.08 / panes, u1 = (w + 1) / panes - 0.08 / panes
        flat(glaze, [at(u0, 0.12), at(u1, 0.12), at(u1, 0.9), at(u0, 0.9)], n)
      }
    }
  }
  if (s.detail) {
    // the roof deck's railing and the "Tip the Tsutenkaku" plank off the east face
    const rr = octagon(9.0, 94.6)
    for (let i = 0; i < 8; i++) {
      const a = rr[i], b = rr[(i + 1) % 8]
      member(lat, add(a, [0, 0, 1.2]), add(b, [0, 0, 1.2]), 0.07, 4)
      for (let k = 0; k < 3; k++) member(lat, lerpV(a, b, k / 3), add(lerpV(a, b, k / 3), [0, 0, 1.2]), 0.05, 4)
    }
    const p0: V3 = [8.8, 2.5, 94.6], p1: V3 = [13.8, 3.6, 96.6]
    obox(lat, lerpV(p0, p1, 0.5), mul(sub(p1, p0), 0.5), [0, 0.65, 0], [0, 0, 0.12])
    for (const o of [-0.65, 0.65]) member(lat, add(p0, [0, o, 1.1]), add(p1, [0, o, 1.1]), 0.06, 4)
  }

  // --- The crown: a drum and dome on the roof deck, the weather light; the rod.
  lathe(grey, [[2.95, 94.6], [2.95, 95.0]], s.k)
  const dome: [number, number][] = [[2.75, 95.0], [2.75, 96.0]]
  const n = s.detail ? 8 : 5
  for (let i = 1; i <= n; i++) {
    const a = (i / n) * (Math.PI / 2)
    dome.push([2.75 * Math.cos(a), 96.0 + 2.4 * Math.sin(a)])
  }
  dome[dome.length - 1][0] = 0
  lathe(neon, dome, s.k)
  member(lat, [0, 0, 98.3], [0, 0, 108], s.detail ? 0.14 : 0.22, 6)

  // --- Signs: plain lit panels at the real sizes and places, no lettering
  // (see the header): on the north face the slogan's strip, on the east and
  // west the shorter strips of the tower's name, on the south the dark board
  // with one lit inset panel.
  const panel = (part: Part, f: number, w: number, z0: number, z1: number, off: number, depth: number, steps = 6) => {
    for (let i = 0; i < steps; i++) {
      const za = z0 + ((z1 - z0) * i) / steps, zc = z0 + ((z1 - z0) * (i + 1)) / steps
      const F = [onFace(f, -w / 2, za, off + depth), onFace(f, w / 2, za, off + depth), onFace(f, w / 2, zc, off + depth), onFace(f, -w / 2, zc, off + depth)]
      const B = [onFace(f, -w / 2, za, off), onFace(f, w / 2, za, off), onFace(f, w / 2, zc, off), onFace(f, -w / 2, zc, off)]
      const nrm = faceNormal(f, (za + zc) / 2), t = FACES[f].t
      flat(part, F, nrm)
      flat(part, [B[0], B[3], B[2], B[1]], mul(nrm, -1))
      flat(part, [B[1], B[2], F[2], F[1]], t)
      flat(part, [B[0], F[0], F[3], B[3]], mul(t, -1))
      if (i === steps - 1) flat(part, [F[3], F[2], B[2], B[3]], [0, 0, 1])
      if (i === 0) flat(part, [B[0], B[1], F[1], F[0]], [0, 0, -1])
    }
  }
  panel(neon, 2, 3.2, 36.0, 72.5, 0.7, 0.25)  // north: the slogan's strip
  panel(neon, 3, 3.8, 53.0, 72.5, 0.7, 0.25, 3) // west: the name
  panel(neon, 1, 3.8, 53.0, 72.5, 0.7, 0.25, 3) // east (estimated, as the west)
  panel(board, 0, 3.8, 31.0, 72.5, 0.45, 0.3, 8) // south: the dark board
  panel(neon, 0, 2.2, 41.0, 70.5, 0.75, 0.12, 6) // and its lit panel
  // HITACHI in small letters under the head (north, east, west), and the
  // clock on the south: neon on the struts' plane.
  for (const f of [1, 2, 3]) {
    const zc = 79.6, w = 6.2, h = 1.0
    const P = (u: number, z: number): V3 => {
      const { n, t } = FACES[f]
      const r = L(SHAFT_TOP) + (z - SHAFT_TOP) * 0.66 + 0.6
      return [n[0] * r + t[0] * u, n[1] * r + t[1] * u, z]
    }
    const nrm = unit([FACES[f].n[0], FACES[f].n[1], -0.55])
    obox(neon, P(0, zc), mul(FACES[f].t, w / 2), mul(nrm, 0.12), mul(unit(cross(FACES[f].t, nrm)), -h / 2))
  }
  {
    // the clock: a white disc facing south with two dark hands
    const zc = 85.4, r = 2.1, yc = -(8.45 + 0.35)
    const ring: V3[] = []
    const K = s.detail ? 20 : 12
    for (let k = 0; k < K; k++) ring.push([r * Math.cos((k / K) * TAU), yc, zc + r * Math.sin((k / K) * TAU)])
    poly(neon, ring, [0, -1, 0])
    poly(neon, ring.map(([x, , z]) => [x, yc + 0.25, z] as V3), [0, 1, 0])
    for (let k = 0; k < K; k++) {
      const a = ring[k], b = ring[(k + 1) % K]
      const m = unit([(a[0] + b[0]) / 2, 0, (a[2] + b[2]) / 2 - zc])
      flat(neon, [a, b, [b[0], yc + 0.25, b[2]], [a[0], yc + 0.25, a[2]]], m)
    }
    member(board, [0, yc - 0.08, zc], [0.15, yc - 0.08, zc + 1.4], 0.13, 4)
    member(board, [0, yc - 0.08, zc], [1.0, yc - 0.08, zc - 0.5], 0.13, 4)
    // small HITACHI under the clock
    obox(neon, [0, -(L(81.4) + 0.66 * 5.4 + 0.7), 81.4], [2.0, 0, 0], [0, 0.12, 0], [0, 0, 0.35])
  }

  // --- Detail: the round light fittings on the ring girders (white neon beads).
  if (s.detail) {
    for (let k = 1; k < R.length; k += 2)
      for (let f = 0; f < 4; f++)
        for (const u of [-0.6, -0.2, 0.2, 0.6]) bead(neon, onFace(f, u * L(R[k]), R[k] + 0.45, 0.35), 0.28)
  }

  const lit = (p: V3, n: V3) => (p[2] < Z_ROOF ? 0.35 : n[2] > 0.8 ? 0.4 : 0.9)
  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: steel, material: { ...finish('tsutenkaku-silver', 0xd0d5da), floodlight: lit } },
    { part: lat, material: finish('neon-tsutenkaku-lattice', 0xc4c6d9) },
    { part: glaze, material: windowVariant(2, 0x8fa4b5) },
    { part: grey, material: PALETTE.roof },
    { part: board, material: finish('tsutenkaku-board', 0x50565e) },
    { part: neon, material: finish('neon-tsutenkaku-white', 0xf4f1ea) },
  ]
  return parts
}

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Tsutenkaku', parts.filter(({ part }) => part.triangles > 0), {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 15.5, elevation: 0, height: 108,
  })
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

if (import.meta.main) {
  await write('osaka-tsutenkaku.glb', build(LOW), 6500, 250_000)
  await write('osaka-tsutenkaku.detail.glb', build(DETAIL), 40_000, 1536 * 1024)
}
