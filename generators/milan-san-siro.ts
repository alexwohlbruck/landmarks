/**
 * Stadio Giuseppe Meazza (San Siro), Milan: original procedural geometry,
 * CC0-1.0, no textures.  bun generators/milan-san-siro.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/milan-san-siro.glb, the low model (<= 6,500 triangles);
 * - models/milan-san-siro.detail.glb, drawn from zoom 16 (<= 40,000):
 *   the towers' helical ramps as real helices, the 1955 ramps as sloping
 *   slabs with parapets, the red roof girders as open box and triangular
 *   trusses with chords, posts and diagonals, the polycarbonate roof as
 *   its barrel vaults, the stands stepped.
 *
 * This file also exports the small kit (rounded-rectangle rings, banded
 * strips with a per-segment material, bars, cylinders, trusses, writeLods)
 * used by this builder's turin-allianz-stadium and rome-stadio-olimpico;
 * its own build runs only under `import.meta.main`.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 21.4: model
 * +y runs along the pitch (north-north-east), +x across it (the east
 * stand). Anchor = the pitch centre, lng 9.1240346, lat 45.4780783, the
 * centre of OSM way/218520544 (the pitch, 105.6 x 66.2 m, long edges at
 * 21.4 deg). The roof outline's area centroid (relation/2892925) is 0.7 m
 * from it, the leisure=stadium outline's (way/218520505) 7.6 m west of it,
 * because the west stand is deeper; the pitch centre is the stadium's
 * centre of symmetry, so the model is built about it.
 *
 * Identity, in order: the eleven concrete towers wound with helical ramps
 * (four at the corners rising on to carry the roof; two on each short side
 * and three on the west long side carrying the third tier, which is built
 * on three sides only); the red steel roof girders, four main box girders
 * between the corner towers with their cantilevered ends finished in the
 * big slanted red "tips", and the secondary trusses rising above the roof
 * as red A-frames; the grey polycarbonate roof in ridged barrel
 * vaults; the third tier's smooth fascia over its ribbed soffit and the
 * ring beam on the towers; the 1955 second ring wrapped by nineteen
 * sloping ramps; three tiers of red (sides) and blue (ends) seats.
 *
 * Evidence
 *  - OSM (measured in this frame):
 *    - towers, building=yes, building:colour #ebebeb, 20.6 m across:
 *      corner towers height=68, way/218520507 (75.7,-104.7), 218520509
 *      (-74.1,102.7), 218520514 (-74.7,-103.8), 218520523 (77.1,101.6);
 *      other towers height=30, way/218520508 (-101.3,-57.2), 218520524
 *      (-101.0,-2.4), 218520528 (-100.5,52.1), 1246184378 (-30.3,-119.7),
 *      1246184379 (28.4,-119.7), 1246184380 (-29.1,117.2), 1246184381
 *      (29.0,116.9): drawn exactly there. No tower on the east side.
 *    - stands as skillion roofs in three rings, 0-16, 16-32, 32-48 m
 *      (way/1246202401-433): first ring from the pitch surround (x +-37,
 *      y +-61) to x +-60 / y +-83; second ring to x +-84 / y +-104; third
 *      ring to x -108 (west) and y +-126 (ends), absent on the east (its
 *      east parts stop at 32 m). Sector colours red (west), orange (east),
 *      green (north), blue (south) are the sectors' names.
 *    - roof: relation/17148825 (grey, 52-55 m), outer way/1246122201 x
 *      -112..86, y -130..128, inner way/1246122200 x +-37, y +-61.5 (the
 *      opening); relation/2892925 (#C66973, 55-65 m), the main girders'
 *      band, outer x -120..86, y +-149 (the cantilevered tips), inner x
 *      +-73, y +-101; secondary girders way/1246122202-233 (55-65 m) on
 *      the lines x = +-37.5 (full length), y = +-62 and y = +-20.5 (to
 *      the outer edge), x = 0 (the ends).
 *    - leisure=stadium way/218520505 (Q133566): x -102..82, y -131..128.
 *  - Published: it.wikipedia and en.wikipedia "San Siro" / "Stadio
 *    Giuseppe Meazza": pitch 105 x 68 m; second ring 1955 "supported by
 *    a series of helical load-bearing ramps", "nineteen spiralling ramps,
 *    each 200 metres long"; third ring 1987-90 on 11 cylindrical towers
 *    (four at the corners, two on each short side, three on one long
 *    side) which are its helical stairs, built "only on three of the four
 *    sides"; the four corner towers carry the roof's steel girders.
 *  - Heights: corner towers 68 m and other towers 30 m (OSM), confirmed
 *    by scaling ardfern (tower 20.6 m across = 103 px): ribbed part to
 *    29 m, corner tower top 68 m, ring beam 29-35 m, third tier fascia
 *    45-49 m. Stands 16/32/48 m and roof 52-55 / girders 55-66 m from OSM.
 *    The tips' rise (to 76 m at their ends) and length are ESTIMATED from
 *    ardfern, roofel and hidalgo (each tip about 25 m long, 10 m deep).
 *  - Elevation 0: the map's terrain (Mapterhorn z14) is flat here, the
 *    pitch within 0.5-0.8 m of the plaza round it; the street photos show
 *    the towers and gates standing at plaza level. No published field
 *    level; doubt (it may be ~1 m below the plaza).
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - hidalgo: Jose Hidalgo, "San Siro (15817752319).jpg", Public domain,
 *      the west side square on: towers, fascia, soffit, roof vaults, the
 *      tips and A-frames. https://commons.wikimedia.org/wiki/File:San_Siro_(15817752319).jpg
 *    - ardfern: Ardfern, "Stadio Giuseppe Meazza (San Siro), Milan, May
 *      2018 (01).jpg", CC BY-SA 4.0, a west corner: the V of tips over a
 *      corner tower, scale. https://commons.wikimedia.org/wiki/File:Stadio_Giuseppe_Meazza_(San_Siro),_Milan,_May_2018_(01).jpg
 *    - cyril: Cyril, "San Siro 2009 2.jpg", Public domain, from the
 *      south-west. https://commons.wikimedia.org/wiki/File:San_Siro_2009_2.jpg
 *    - otrebski: Andrzej Otrębski, "Milano stadion San Siro.jpg", CC BY-SA
 *      4.0, a corner. https://commons.wikimedia.org/wiki/File:Milano_stadion_San_Siro.jpg
 *    - jieyang: Jie Yang, "San siro Stadium, Milan, Italy - panoramio.jpg",
 *      CC BY 3.0, from the east (Via Piccolomini): the east side without
 *      a third tier. https://commons.wikimedia.org/wiki/File:San_siro_Stadium,_Milan,_Italy_-_panoramio.jpg
 *    - johnseb: johnseb (Flickr), "Giuseppe Meazza (San Siro) stadium,
 *      exterior view.jpg", CC BY 2.0, from the east. https://commons.wikimedia.org/wiki/File:Giuseppe_Meazza_(San_Siro)_stadium,_exterior_view.jpg
 *    - roofel: Neville Borg, "Stadio Giuseppe Meazza roof element
 *      exterior.jpg", CC BY-SA 2.0: a tip, its truss, the vaults.
 *      https://commons.wikimedia.org/wiki/File:Stadio_Giuseppe_Meazza_roof_element_exterior.jpg
 *    - corner: Revol Web, "San Siro Corner.jpg", Public domain: tips,
 *      soffit ribs, tower ramps. https://commons.wikimedia.org/wiki/File:San_Siro_Corner.jpg
 *    - heap: Dan Heap, "San Siro 2005.jpg", Public domain: the towers'
 *      ramps and the 1955 ramps behind them. https://commons.wikimedia.org/wiki/File:San_Siro_2005.jpg
 *    - poan: POAN68, "Milano - stadio Giuseppe Meazza - 202209050049.jpeg",
 *      CC BY-SA 4.0, inside: red girders at the opening, seats.
 *      https://commons.wikimedia.org/wiki/File:Milano_-_stadio_Giuseppe_Meazza_-_202209050049.jpeg
 *    - giesen: Bjørn Giesenbauer, "Stadio Giuseppe Meazza, San Siro, Milan
 *      (3326869632).jpg", CC BY-SA 2.0, inside from the third tier: red
 *      side seats, blue end. https://commons.wikimedia.org/wiki/File:Stadio_Giuseppe_Meazza,_San_Siro,_Milan_(3326869632).jpg
 *    - prelvini6: Prelvini, "Stadio Giuseppe Meazza 6.jpg", CC BY-SA 4.0,
 *      the west side at dusk: lit roof and ring beam, lit tower ramps.
 *      https://commons.wikimedia.org/wiki/File:Stadio_Giuseppe_Meazza_6.jpg
 *  No lidar or NAIP exists here (outside the US); no commercial imagery.
 *
 * Invented or simplified, and doubts:
 *  - The rings are rounded rectangles fitted to the OSM tier outlines and
 *    tower positions (corner radius 67 m on the tower line, which puts the
 *    corner towers and the mid towers on it); the stands are plain rakes.
 *  - The east cross-girder tips are drawn as long as the west ones (45 m
 *    past the towers), symmetric as the photos show the structure; OSM's
 *    girder band stops at x = 86 on the east (doubt).
 *  - The 1955 ramps: 19 ramps, each 200 m (published), rising 25 m
 *    (estimated, to the top of the second ring), evenly spaced round the
 *    perimeter, all climbing the same way round; the real ramps' starts
 *    and turns are not known from the photos.
 *  - The towers' ramps: about ten turns in 30 m (counted in heap); the low
 *    model draws five bold bands.
 *  - Seats: sides red, both ends blue; the north end (green sector) is
 *    drawn blue to stay within six materials (doubt). The low east "tribuna"
 *    building in front of the east stand and the gate canopies (G1-G15)
 *    are left to the map.
 *  - Rework (lead review 1): roof grey (#8f979e, near-opaque, as it reads in
 *    hidalgo and otrebski) with its vault ridges in the low model too; the
 *    third tier's soffit dark with bold pale radial fins (the "comb", two
 *    per ring sample); side seats a true red; corner towers capped and
 *    clear above the roof edge (otrebski).
 *  - Night: the polycarbonate roof glows and the ring beam and soffits are
 *    floodlit (prelvini6); the towers' ramp cores are `window` (lit).
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { crs, dot, face, nrm3, rayHit, vadd, vlerp, vmul, vsub } from './seoul-world-cup-stadium'

// ---------------------------------------------------------------------------
// The kit, shared with turin-allianz-stadium and rome-stadio-olimpico.

export type XY = [number, number]

/** A rounded rectangle, counter-clockwise: x from -xw to xe, y from -ys to yn, corner radius R. */
export function rrect(xw: number, xe: number, ys: number, yn: number, R: number, seg = 8): XY[] {
  const out: XY[] = []
  const corners: [number, number, number][] = [[xe - R, -ys + R, -90], [xe - R, yn - R, 0], [-xw + R, yn - R, 90], [-xw + R, -ys + R, 180]]
  for (const [cx, cy, a0] of corners)
    for (let k = 0; k <= seg; k++) {
      const a = ((a0 + (90 * k) / seg) * Math.PI) / 180
      out.push([cx + R * Math.cos(a), cy + R * Math.sin(a)])
    }
  return out
}

/** An ellipse-like superellipse polygon (half-axes a, b, exponent e). */
export function superellipse(a: number, b: number, e: number, n = 96): XY[] {
  return Array.from({ length: n }, (_, k) => {
    const t = (k / n) * 2 * Math.PI, c = Math.cos(t), s = Math.sin(t)
    return [a * Math.sign(c) * Math.pow(Math.abs(c), 2 / e), b * Math.sign(s) * Math.pow(Math.abs(s), 2 / e)] as XY
  })
}

/** Points where rays from the origin at angles `phis` leave `poly`, at height z (or z(phi)). */
export function ring(poly: XY[], phis: number[], z: number | ((phi: number, i: number) => number), grow = 0): V3[] {
  return phis.map((f, i) => {
    const r = rayHit(poly, f) + grow
    return [r * Math.cos(f), r * Math.sin(f), typeof z === 'number' ? z : z(f, i)] as V3
  })
}

/**
 * A strip between two rings of the same length, smooth along the rings,
 * each segment's triangles going to `pick(i)` (null skips it). Normals are
 * turned to agree with `hint`.
 */
export function band(pick: Part | ((i: number) => Part | null), r0: V3[], r1: V3[], hint: (q: V3) => V3, closed = true, smooth = true) {
  const n = r0.length
  const P = typeof pick === 'function' ? pick : () => pick
  const nv = (k: number, r: V3[]): V3 => {
    const a = r[closed ? (k - 1 + n) % n : Math.max(0, k - 1)], b = r[closed ? (k + 1) % n : Math.min(n - 1, k + 1)]
    let m = nrm3(crs(vsub(b, a), vsub(r1[k], r0[k])))
    if (dot(m, hint(r[k])) < 0) m = vmul(m, -1)
    return m
  }
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p = P(i)
    if (!p) continue
    const j = (i + 1) % n
    const a = r0[i], b = r0[j], c = r1[j], d = r1[i]
    if (!smooth) {
      const h = hint(vlerp(vlerp(a, b, 0.5), vlerp(c, d, 0.5), 0.5))
      face(p, [a, b, c], h)
      face(p, [a, c, d], h)
      continue
    }
    const na = nv(i, r0), nb = nv(j, r0), nc = nv(j, r1), nd = nv(i, r1)
    p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
    p.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
  }
}

/** A box bar from A to B, w wide (sideways) and h deep (along `up`), ends capped. */
export function bar(p: Part, A: V3, B: V3, w: number, h = w, up: V3 = [0, 0, 1], caps = true) {
  const t = nrm3(vsub(B, A))
  let s = crs(t, up)
  if (Math.hypot(...s) < 1e-6) s = crs(t, [1, 0, 0])
  s = nrm3(s)
  const u = crs(s, t)
  const c = (P: V3, a: number, b: number): V3 => vadd(P, vadd(vmul(s, a * w / 2), vmul(u, b * h / 2)))
  const q = [[1, 1], [-1, 1], [-1, -1], [1, -1]]
  const SA = q.map(([a, b]) => c(A, a, b)), SB = q.map(([a, b]) => c(B, a, b))
  for (let k = 0; k < 4; k++) {
    const j = (k + 1) % 4
    const out = vadd(vmul(s, q[k][0] + q[j][0]), vmul(u, q[k][1] + q[j][1]))
    face(p, [SA[k], SA[j], SB[j], SB[k]], out)
  }
  if (caps) { face(p, SA, vmul(t, -1)); face(p, SB, t) }
}

/** A cheap triangular-section rod from A to B (three flat faces, no caps), r its half-width. */
export function rod3(p: Part, A: V3, B: V3, r: number, up: V3 = [0, 0, 1]) {
  const t = nrm3(vsub(B, A))
  let s = crs(t, up)
  if (Math.hypot(...s) < 1e-6) s = crs(t, [1, 0, 0])
  s = nrm3(s)
  const u = crs(s, t)
  const corner = (P: V3, k: number): V3 => {
    const a = Math.PI / 2 + (k * 2 * Math.PI) / 3
    return vadd(P, vadd(vmul(s, r * Math.cos(a)), vmul(u, r * Math.sin(a))))
  }
  for (let k = 0; k < 3; k++) {
    const j = (k + 1) % 3
    const a = corner(A, k), b = corner(A, j), c = corner(B, j), d = corner(B, k)
    const m = vsub(vlerp(vlerp(a, b, 0.5), vlerp(c, d, 0.5), 0.5), vlerp(A, B, 0.5))
    face(p, [a, b, c, d], m)
  }
}

/** An upright cylinder wall (smooth), optionally capped on top. */
export function cyl(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, n = 12, top = false, r1 = r, rot = 0) {
  const A: V3[] = [], B: V3[] = []
  for (let k = 0; k < n; k++) {
    const a = rot + (k / n) * 2 * Math.PI
    A.push([cx + r * Math.cos(a), cy + r * Math.sin(a), z0])
    B.push([cx + r1 * Math.cos(a), cy + r1 * Math.sin(a), z1])
  }
  band(p, A, B, (q) => [q[0] - cx, q[1] - cy, 0])
  if (top) face(p, B, [0, 0, 1])
}

/** A flat ring between radii r0 < r1 at height z, facing up or down. */
export function annulus(p: Part, cx: number, cy: number, r0: number, r1: number, z: number, n = 12, up = true, rot = 0) {
  for (let k = 0; k < n; k++) {
    const a = rot + (k / n) * 2 * Math.PI, b = rot + ((k + 1) / n) * 2 * Math.PI
    const P = (r: number, t: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
    face(p, [P(r0, a), P(r1, a), P(r1, b), P(r0, b)], [0, 0, up ? 1 : -1])
  }
}

/**
 * A planar truss between two chord lines (functions of t in 0..1): chords
 * and posts as bars, with diagonals when `diag` (alternating, a Warren/
 * Pratt web). `n` panels.
 */
export function truss(p: Part, top: (t: number) => V3, bot: (t: number) => V3, n: number, chord: number, web: number, diag = true, up: V3 = [0, 0, 1], posts = true) {
  for (let k = 0; k < n; k++) {
    const t0 = k / n, t1 = (k + 1) / n
    bar(p, top(t0), top(t1), chord, chord, up, false)
    bar(p, bot(t0), bot(t1), chord, chord, up, false)
    if (diag) bar(p, k % 2 ? top(t0) : bot(t0), k % 2 ? bot(t1) : top(t1), web, web, up, false)
  }
  if (posts) for (let k = 0; k <= n; k++) bar(p, bot(k / n), top(k / n), web, web, [1, 0, 0].map((v, i) => (i === 0 ? 0.3 : 0.7)) as V3, false)
}

export type Lod = { file: string; parts: Array<{ part: Part; material: MaterialSpec }>; maxTris: number; maxBytes: number }

/** Check each level's budget and write models/<file>. */
export async function writeLods(name: string, extras: Record<string, unknown>, lods: Lod[]) {
  for (const l of lods) {
    const used = l.parts.filter((x) => x.part.triangles > 0)
    const tris = used.reduce((s, x) => s + x.part.triangles, 0)
    if (used.length > 6) throw new Error(`${l.file}: ${used.length} materials`)
    console.log(l.file, used.map((x) => `${x.material.name}:${x.part.triangles}`).join(" "))
    if (tris > l.maxTris) throw new Error(`${l.file}: ${tris} triangles > ${l.maxTris}`)
    const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; ground anchor', ...extras })
    if (glb.length > l.maxBytes) throw new Error(`${l.file}: ${glb.length} bytes > ${l.maxBytes}`)
    const out = new URL(`../models/${l.file}`, import.meta.url).pathname
    await Bun.write(out, glb)
    console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
  }
}

export const RAD = Math.PI / 180

// ---------------------------------------------------------------------------
// San Siro

const BEARING = 21.4

// Towers (OSM, this frame).
const CORNER: XY[] = [[75.7, -104.7], [-74.1, 102.7], [-74.7, -103.8], [77.1, 101.6]]
const MIDT: XY[] = [[-101.3, -57.2], [-101.0, -2.4], [-100.5, 52.1], [-30.3, -119.7], [28.4, -119.7], [-29.1, 117.2], [29.0, 116.9]]
const TR = 10.3 // tower radius (OSM 20.6 m across)
const RIB_TOP = 30 // the helical ramps reach the ring beam
const CORNER_TOP = 68

// The main girders run through the corner towers' mean lines.
const GX = 75.4, GY = 103.2
const G_BOT = 55, G_TOP = 66
const TIP = 45 // cantilever past the tower

// Rings (half-extents west, east, south, north, corner radius).
const R_PITCH = rrect(37.5, 37.5, 61, 61, 8)
const R_T1 = rrect(60, 60, 83, 83, 22)
const R_T2F = rrect(62, 62, 85, 85, 26)
const R_T2 = rrect(84, 84, 104, 104, 40)
const R_T3F = rrect(80, 80, 100, 100, 44)
const R_T3 = rrect(110, 110, 128, 128, 62)
const R_TL = rrect(101, 101, 118, 118, 67) // the tower line: ring beam on the towers
const R_F = rrect(92, 90, 111, 111, 52) // the 1955 ramp facade
const R_ROOF = rrect(112, 86, 130, 130, 46)
const R_OPEN = rrect(37.5, 37.5, 61.5, 61.5, 3)

const ROOF_Z = 53

/** Is angle phi on the stretch carrying the third tier (all but the east)? */
const PHI_E = Math.atan2(102, 76.4) // the east corner towers
const onTier3 = (f: number) => Math.abs(Math.atan2(Math.sin(f), Math.cos(f))) > PHI_E - 0.001

function build(detail: boolean) {
  const concrete = new Part(), steel = new Part(), roof = new Part(), seatR = new Part(), seatB = new Part(), win = new Part()
  const N = detail ? 128 : 44
  // Angles: uniform, plus the east corner towers' bearings so the C of the
  // third tier ends cleanly there.
  const phis = Array.from({ length: N }, (_, k) => -Math.PI + (k / N) * 2 * Math.PI)
  const IN = (q: V3): V3 => [-q[0], -q[1], 0]
  const OUT = (q: V3): V3 => [q[0], q[1], 0]
  const UP = (): V3 => [0, 0, 1]
  const DOWN = (): V3 => [0, 0, -1]
  const SEAT = (q: V3): V3 => [-q[0], -q[1], 120]
  const mid = (i: number) => phis[i] + Math.PI / N
  const isEnd = (f: number) => Math.abs(Math.sin(f)) > 0.8
  const seats = (i: number) => (isEnd(mid(i)) ? seatB : seatR)

  // --- The stands.
  band(concrete, ring(R_PITCH, phis, 0), ring(R_PITCH, phis, 2.5), IN) // pitch wall
  const rake = (inner: XY[], outer: XY[], z0: number, z1: number, pick: (i: number) => Part | null, closed = true, idx = phis.map((_, i) => i)) => {
    const ph = idx.map((i) => phis[i])
    if (!detail) { band((k) => pick(idx[k]), ring(inner, ph, z0), ring(outer, ph, z1), SEAT, closed); return }
    // stepped: risers and treads, 2.4 m a step in plan
    const steps = 4
    for (let s = 0; s < steps; s++) {
      const t0 = s / steps, t1 = (s + 1) / steps
      const A = ring(inner, ph, z0).map((p, k) => vlerp(p, ring(outer, [ph[k]], z1)[0], t0))
      const B = ring(inner, ph, z0).map((p, k) => vlerp(p, ring(outer, [ph[k]], z1)[0], t1))
      const Ar = A.map((p, k) => [p[0], p[1], B[k][2]] as V3)
      band((k) => pick(idx[k]), A, Ar, IN, closed) // riser
      band((k) => pick(idx[k]), Ar, B, UP, closed) // tread
    }
  }
  rake(R_PITCH, R_T1, 2.5, 14, seats)
  band(concrete, ring(R_T1, phis, 14), ring(R_T2F, phis, 14), UP) // walkway
  band(win, ring(R_T2F, phis, 14), ring(R_T2F, phis, 17), IN) // the box band (sky boxes)
  rake(R_T2F, R_T2, 17, 31, seats)
  // the second ring's back: a parapet on the east, under the third tier elsewhere
  band(concrete, ring(R_T2, phis, 31), ring(R_T2, phis, 33.5), IN)
  if (detail) band(concrete, ring(R_T2, phis, 33.5), ring(R_T2, phis, 33.5, 1), UP)
  // third tier, a C open to the east
  const c3 = phis.map((f, i) => i).filter((i) => onTier3(phis[i]))
  // start the C at the first index after the north-east tower
  const start = c3.findIndex((i, k) => k > 0 && c3[k - 1] !== i - 1)
  const C3 = start > 0 ? [...c3.slice(start), ...c3.slice(0, start)] : c3
  const ph3 = C3.map((i) => phis[i])
  const sub3 = (i: number) => (C3.includes(i + 0) && C3.includes((i + 1) % N) ? seats(i) : null)
  rake(R_T3F, R_T3, 34, 48, (i) => sub3(i), false, C3)
  band(concrete, ring(R_T3F, ph3, 31.5), ring(R_T3F, ph3, 34), IN, false) // front parapet
  band(concrete, ring(R_T3F, ph3, 31.5), ring(R_T2, ph3, 31.5), DOWN, false) // front soffit
  // fascia band, its top and its underside (the ribbed soffit) back to the ring beam
  band(concrete, ring(R_T3, ph3, 44.5, 1), ring(R_T3, ph3, 49.5, 1), OUT, false)
  band(concrete, ring(R_T3, ph3, 49.5, 1), ring(R_T3, ph3, 49.5, -0.6), UP, false)
  if (detail) band(concrete, ring(R_T3, ph3, 48), ring(R_T3, ph3, 49.5, -0.6), IN, false)
  band(win, ring(R_TL, ph3, 35), ring(R_T3, ph3, 44.5, 1), (q) => [q[0] * 0.01, q[1] * 0.01, -1], false) // the soffit, dark between its ribs
  // the ring beam on the towers, and the soffit back to the 1955 facade
  band(concrete, ring(R_TL, ph3, 29), ring(R_TL, ph3, 35), OUT, false)
  band(concrete, ring(R_TL, ph3, 29), ring(R_F, ph3, 27.5), DOWN, false)
  if (detail) band(concrete, ring(R_TL, ph3, 35), ring(R_T2, ph3, 33.5), UP, false)
  // close the C's two ends (hidden in the corner towers, but closed)
  for (const k of [0, C3.length - 1]) {
    const f = ph3[k]
    const P = (poly: XY[], z: number, g = 0) => ring(poly, [f], z, g)[0]
    const s: V3 = [-Math.sin(f), Math.cos(f), 0]
    face(concrete, [P(R_T2, 31.5), P(R_TL, 29), P(R_TL, 35), P(R_T3, 44.5, 1), P(R_T3, 49.5, 1), P(R_T3, 48), P(R_T3F, 34), P(R_T3F, 31.5)], k === 0 ? s : vmul(s, -1))
  }
  // the 1955 facade: dark concourse wall, its top back to the second ring
  band(win, ring(R_F, phis, 0), ring(R_F, phis, 27.5), OUT)
  band(concrete, ring(R_F, phis, 27.5), ring(R_T2, phis, 31), UP)
  // the ribbed soffit (the "comb"): bold pale radial fins hanging under the
  // dark soffit, several per ring sample, from the ring beam out to the fascia
  const FINS = detail ? 2 : 2
  for (let k = 0; k < C3.length - 1; k++)
    for (let m = 0; m < FINS; m++) {
      const f = ph3[k] + ((ph3[k + 1] - ph3[k] + 2 * Math.PI) % (2 * Math.PI)) * (m / FINS)
      const a = ring(R_TL, [f], 35)[0], b = ring(R_T3, [f], 44.5, 0.6)[0]
      if (detail) bar(concrete, vadd(a, [0, 0, -1.1]), vadd(b, [0, 0, -1.1]), 0.8, 2.2, [0, 0, 1], true)
      else rod3(concrete, vadd(a, [0, 0, -1.0]), vadd(b, [0, 0, -1.0]), 1.3)
    }
  for (let k = 0; k < C3.length; k += 2) {
      const f = ph3[k]
      if (!detail) continue
      const c = ring(R_TL, [f], 29)[0], d = ring(R_F, [f], 27.5)[0]
      bar(concrete, vadd(c, [0, 0, -0.5]), vadd(d, [0, 0, -0.5]), 0.8, 1.0, [0, 0, 1], true)
    }

  // --- The 1955 ramps: 19 ramps, 200 m each, round the facade, climbing 25 m.
  {
    const M = 720
    const fine = Array.from({ length: M }, (_, k) => -Math.PI + (k / M) * 2 * Math.PI)
    const pts = ring(R_F, fine, 0)
    const cum = [0]
    for (let k = 1; k <= M; k++) cum.push(cum[k - 1] + Math.hypot(pts[k % M][0] - pts[k - 1][0], pts[k % M][1] - pts[k - 1][1]))
    const P = cum[M]
    const at = (s: number): [XY, XY] => {
      s = ((s % P) + P) % P
      let k = 0
      while (cum[k + 1] < s) k++
      const t = (s - cum[k]) / (cum[k + 1] - cum[k])
      const a = pts[k], b = pts[(k + 1) % M]
      const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t
      const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty)
      return [[x, y], [ty / l, -tx / l]] // outward normal (ring is counter-clockwise)
    }
    const W = 3.6, TH = 0.7, PAR = detail ? 1.1 : 0
    const segs = detail ? 10 : 3
    for (let r = 0; r < 19; r++) {
      const s0 = (r * P) / 19
      const z0 = 2, z1 = 27
      const line = (o: number, dz: number) => Array.from({ length: segs + 1 }, (_, k) => {
        const s = s0 + (200 * k) / segs
        const [[x, y], [nx, ny]] = at(s)
        return [x + nx * o, y + ny * o, z0 + ((z1 - z0) * k) / segs + dz] as V3
      })
      const outer = line(W, 0), inner = line(0.05, 0)
      band(concrete, inner, outer, UP, false) // walking surface
      if (detail) band(concrete, line(W, -TH), outer, OUT, false) // edge (the low model's ramps are their walking surface)
      if (detail) {
        band(concrete, line(W, 0), line(W, PAR), OUT, false) // parapet
        band(concrete, line(W - 0.25, PAR), line(W - 0.25, 0), IN, false)
        band(concrete, line(W - 0.25, PAR), line(W, PAR), UP, false)
        band(concrete, line(W, -TH), line(0.05, -TH), DOWN, false)
      }
    }
  }

  // --- Towers: a dark core wound with the pale helical ramp.
  const towers = [...CORNER.map((c) => [c, true] as [XY, boolean]), ...MIDT.map((c) => [c, false] as [XY, boolean])]
  const TN = detail ? 20 : 12
  for (const [[cx, cy], corner] of towers) {
    const core = TR - 1.9
    cyl(win, cx, cy, core, 0, RIB_TOP, TN)
    if (!detail) {
      // five bold bands, each a turn of the ramp drawn level
      for (let b = 0; b < 4; b++) {
        const z0 = 1.5 + b * 7.2, z1 = z0 + 3.6
        cyl(concrete, cx, cy, TR, z0, z1, TN)
        annulus(concrete, cx, cy, core, TR, z1, TN, true)
        if (detail) annulus(concrete, cx, cy, core, TR, z0, TN, false)
      }
    } else {
      // the real helix: ten turns in 29 m, a slab 1.1 m thick with a parapet
      const turns = 9, per = 12, H0 = 0.6, H1 = RIB_TOP - 0.8
      const n = turns * per
      const pt = (k: number, r: number, dz: number): V3 => {
        const a = (k / per) * 2 * Math.PI
        return [cx + r * Math.cos(a), cy + r * Math.sin(a), H0 + ((H1 - H0) * k) / n + dz]
      }
      const L = (r: number, dz: number) => Array.from({ length: n + 1 }, (_, k) => pt(k, r, dz))
      const hint = (q: V3): V3 => [q[0] - cx, q[1] - cy, 0]
      band(concrete, L(core, 0), L(TR, 0), UP, false)
      band(concrete, L(TR, -1.1), L(TR, 1.0), hint, false)
      band(concrete, L(core, -1.1), L(TR, -1.1), DOWN, false)
    }
    // above the ramps: the plain shaft (corner towers rise through the roof)
    const top = corner ? CORNER_TOP : RIB_TOP + 2
    cyl(concrete, cx, cy, TR - 0.4, RIB_TOP, top, TN, !corner)
    if (corner) {
      // the cap: a slightly wider ring with a flat top, clear above the roof
      annulus(concrete, cx, cy, TR - 0.4, TR + 0.3, top - 2.2, TN, false)
      cyl(concrete, cx, cy, TR + 0.3, top - 2.2, top + 0.6, TN, true)
    }
    if (corner && detail) cyl(steel, cx, cy, 1.2, top, top + 4, 6, true) // the lamp crane / mast on top
  }

  // --- The roof: translucent polycarbonate over the stands.
  {
    const rIn = ring(R_OPEN, phis, ROOF_Z), rOut = ring(R_ROOF, phis, ROOF_Z - 1)
    if (!detail) {
      // barrel vaults: every other sample a crown, flat-shaded so the ridges read
      const mid = rIn.map((p, i) => vlerp(p, rOut[i], 0.5))
      const lift = (r: V3[]) => r.map((p, i) => (i % 2 ? vadd(p, [0, 0, 1.6]) : p))
      band(roof, lift(rIn), lift(mid), UP, true, false)
      band(roof, lift(mid), lift(rOut), UP, true, false)
      band(roof, ring(R_ROOF, phis, ROOF_Z - 4), rOut, OUT) // edge
    } else {
      // barrel vaults running out from the opening, every other sample a crown
      const K = 4
      for (let k = 0; k < K; k++) {
        const t0 = k / K, t1 = (k + 1) / K
        const A = rIn.map((p, i) => vlerp(p, rOut[i], t0)), B = rIn.map((p, i) => vlerp(p, rOut[i], t1))
        const lift = (r: V3[]) => r.map((p, i) => (i % 2 ? vadd(p, [0, 0, 1.6]) : p))
        band(roof, lift(A), lift(B), UP, true, false)
      }
      band(roof, ring(R_ROOF, phis, ROOF_Z - 2.2), rOut, OUT)
      // the space frame under it: radial ribs every fourth sample
      for (let i = 0; i < N; i += 4) bar(steel, vadd(rIn[i], [0, 0, -1.2]), vadd(rOut[i], [0, 0, -1.2]), 0.5, 1.4, [0, 0, 1], false)
    }
  }

  // --- The red girders.
  const ch = detail ? 1.3 : 2.2
  /** A box girder from A to B (on the ground plan), bottom zb, top zt, width w. */
  const girder = (A: XY, B: XY, zb: (t: number) => number, zt: (t: number) => number, w: number, panels: number) => {
    const L = Math.hypot(B[0] - A[0], B[1] - A[1])
    const sx = -(B[1] - A[1]) / L, sy = (B[0] - A[0]) / L
    const P = (t: number, side: number, z: number): V3 => [A[0] + (B[0] - A[0]) * t + sx * side * w / 2, A[1] + (B[1] - A[1]) * t + sy * side * w / 2, z]
    if (!detail) {
      // one plane: chords and posts, a Vierendeel the colour of the real one
      // one plane of chords and posts (a Vierendeel, as the real one reads), three-sided rods
      for (let k = 0; k < panels; k++) {
        rod3(steel, P(k / panels, 0, zt(k / panels)), P((k + 1) / panels, 0, zt((k + 1) / panels)), ch * 0.62)
        rod3(steel, P(k / panels, 0, zb(k / panels)), P((k + 1) / panels, 0, zb((k + 1) / panels)), ch * 0.62)
      }
      for (let k = 0; k <= panels; k++) rod3(steel, P(k / panels, 0, zb(k / panels)), P(k / panels, 0, zt(k / panels)), ch * 0.5, [1, 0, 0])
      return
    }
    for (const side of [-1, 1]) truss(steel, (t) => P(t, side, zt(t)), (t) => P(t, side, zb(t)), panels, ch, 0.8, true)
    for (let k = 0; k <= panels; k++) {
      const t = k / panels
      bar(steel, P(t, -1, zt(t)), P(t, 1, zt(t)), 0.7, 0.7, [0, 0, 1], false)
      bar(steel, P(t, -1, zb(t)), P(t, 1, zb(t)), 0.7, 0.7, [0, 0, 1], false)
    }
  }
  /** A triangular-section truss: one top chord over two bottom chords (the A-frames). */
  const atruss = (A: XY, B: XY, zb: (t: number) => number, zt: (t: number) => number, w: number, panels: number) => {
    const L = Math.hypot(B[0] - A[0], B[1] - A[1])
    const sx = -(B[1] - A[1]) / L, sy = (B[0] - A[0]) / L
    const P = (t: number, side: number, z: number): V3 => [A[0] + (B[0] - A[0]) * t + sx * side * w / 2, A[1] + (B[1] - A[1]) * t + sy * side * w / 2, z]
    const c = detail ? 0.9 : 1.2
    for (let k = 0; k < panels; k++) {
      const t0 = k / panels, t1 = (k + 1) / panels
      bar(steel, P(t0, 0, zt(t0)), P(t1, 0, zt(t1)), c, c, [0, 0, 1], false)
      if (detail) for (const s of [-1, 1]) {
        bar(steel, P(t0, s, zb(t0)), P(t1, s, zb(t1)), c * 0.8, c * 0.8, [0, 0, 1], false)
        bar(steel, k % 2 ? P(t0, s, zb(t0)) : P(t0, 0, zt(t0)), k % 2 ? P(t1, 0, zt(t1)) : P(t1, s, zb(t1)), 0.5, 0.5, [0, 0, 1], false)
      }
    }
    // A-frames: at both ends and, in the detail model, every panel
    const every = detail ? 1 : panels
    for (let k = 0; k <= panels; k += every) {
      const t = k / panels
      for (const s of [-1, 1]) bar(steel, P(t, s, zb(t)), P(t, 0, zt(t)), c * 0.8, c * 0.8, [0, 0, 1], false)
    }
  }
  const flat = (z: number) => () => z
  // main girders between the corner towers
  for (const sx of [-1, 1]) girder([sx * GX, -GY + TR], [sx * GX, GY - TR], flat(G_BOT), flat(G_TOP), 5, detail ? 14 : 5)
  for (const sy of [-1, 1]) girder([-GX + TR, sy * GY], [GX - TR, sy * GY], flat(G_BOT), flat(G_TOP), 5, detail ? 11 : 5)
  // cantilevers past the towers: an open truss rising out to the solid tip
  const tip = (O: XY, d: XY) => {
    const at = (s: number, side = 0): XY => [O[0] + d[0] * s - d[1] * side, O[1] + d[1] * s + d[0] * side]
    const S0 = TR, S1 = 20, S2 = TIP
    // the truss arm from the tower face to the tip's root
    const zt = (s: number) => G_TOP + (s - S0) * 0.12, zb = (s: number) => G_BOT + (s - S0) * 0.2
    if (detail) {
      for (const side of [-2.5, 2.5]) truss(steel, (t) => [...at(S0 + (S1 - S0) * t, side), zt(S0 + (S1 - S0) * t)] as V3, (t) => [...at(S0 + (S1 - S0) * t, side), zb(S0 + (S1 - S0) * t)] as V3, 3, 1.1, 0.7, true)
    } else {
      for (const side of [-1.5, 1.5]) {
        rod3(steel, [...at(S0, side), zt(S0)] as V3, [...at(S1, side), zt(S1)] as V3, 1.0)
        rod3(steel, [...at(S0, side), zb(S0)] as V3, [...at(S1, side), zb(S1)] as V3, 1.0)
      }
      bar(steel, [...at(S1 - 1, 0), zb(S1 - 1)] as V3, [...at(S1 - 1, 0), zt(S1 - 1)] as V3, 5, 1.2, [d[0], d[1], 0], false)
    }
    // the tip: a solid sheared box, its top rising to 76 m, its end cut back
    const prof: [number, number][] = [[S1, zb(S1)], [S2 - 3, zb(S1) + 8], [S2, zt(S1) + 10.5], [S1 + 1, zt(S1) + 1]]
    const W = 3
    const L = prof.map(([s, z]) => [...at(s, -W), z] as V3), R = prof.map(([s, z]) => [...at(s, W), z] as V3)
    const side: V3 = [-d[1], d[0], 0]
    face(steel, L, vmul(side, -1))
    face(steel, R, side)
    for (let k = 0; k < 4; k++) {
      const j = (k + 1) % 4
      const m = vsub(vlerp(L[k], L[j], 0.5), [...at((prof[0][0] + prof[2][0]) / 2, -W), (prof[0][1] + prof[2][1]) / 2] as V3)
      face(steel, [L[k], L[j], R[j], R[k]], [m[0], m[1], m[2]])
    }
  }
  for (const [cx, cy] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
    tip([cx * GX, cy * GY], [0, cy]) // the long girders' ends
    tip([cx * GX, cy * GY], [cx, 0]) // the cross girders' ends
  }
  // secondary trusses (A-frames over the roof), on OSM's lines: each line
  // a polyline of [x, y, top z]; the top chord rises over the main girders
  // and falls to the roof's edge.
  const RE = 86, RW = 112, RN = 130, OX = 37.5, OY = 61.5
  const secLine = (pts: [number, number, number][]) => {
    if (detail) {
      for (let k = 0; k < pts.length - 1; k++) {
        const [x0, y0, z0] = pts[k], [x1, y1, z1] = pts[k + 1]
        const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / 12))
        atruss([x0, y0], [x1, y1], flat(ROOF_Z + 0.6), (t) => z0 + (z1 - z0) * t, 5, n)
      }
      return
    }
    for (let k = 0; k < pts.length - 1; k++) rod3(steel, pts[k], pts[k + 1], 1.1)
    for (const k of [0, pts.length - 1]) {
      const [x, y, z] = pts[k], o = k ? pts[k - 1] : pts[1]
      const dx = o[0] - x, dy = o[1] - y, l = Math.hypot(dx, dy)
      for (const s of [-2.5, 2.5]) rod3(steel, [x - (dy / l) * s, y + (dx / l) * s, ROOF_Z + 0.6], [x, y, z], 1.0)
    }
  }
  for (const sx of [-1, 1]) secLine([[sx * OX, -RN, 56.5], [sx * OX, -GY, 64], [sx * OX, -OY, 61], [sx * OX, OY, 61], [sx * OX, GY, 64], [sx * OX, RN, 56.5]])
  for (const y of [-OY, OY]) secLine([[-RW, y, 56.5], [-GX, y, 64], [-OX, y, 61], [OX, y, 61], [GX, y, 64], [RE, y, 59]])
  for (const y of [-20.5, 20.5]) {
    secLine([[-RW, y, 56.5], [-GX, y, 64], [-OX, y, 61]])
    secLine([[OX, y, 61], [GX, y, 64], [RE, y, 59]])
  }
  for (const sy of [-1, 1]) secLine([[0, sy * OY, 61], [0, sy * GY, 64], [0, sy * RN, 56.5]])

  const lit = (_p: V3, n: V3) => (n[2] < -0.2 ? 0.8 : 0.35)
  return [
    { part: concrete, material: { ...finish('sansiro-concrete', 0xd7cfc0), floodlight: lit } },
    { part: steel, material: finish('sansiro-red', 0xa94a49) },
    { part: roof, material: { ...finish('sansiro-polycarbonate', 0x8f979e), opacity: 0.95, doubleSided: true, floodlight: () => 0.85 } },
    { part: seatR, material: finish('sansiro-seats-red', 0xb3383a) },
    { part: seatB, material: finish('sansiro-seats-blue', 0x4f6ca4) },
    { part: win, material: { ...PALETTE.window, color: 0x6a737b } },
  ]
}

if (import.meta.main)
  await writeLods('Stadio Giuseppe Meazza (San Siro)', { bearing: BEARING, elevation: 0, height: 76 }, [
    { file: 'milan-san-siro.glb', parts: build(false), maxTris: 6500, maxBytes: 250_000 },
    { file: 'milan-san-siro.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1536 * 1024 },
  ])
