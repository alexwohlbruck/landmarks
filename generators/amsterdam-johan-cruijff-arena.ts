/**
 * Johan Cruijff ArenA (Amsterdam ArenA; Rob Schuurman and Sjoerd Soeters,
 * opened 1996), Amsterdam-Zuidoost: original procedural geometry, CC0-1.0.
 * bun generators/amsterdam-johan-cruijff-arena.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the outer ring of OSM relation/1458682
 * (building=stadium, leisure=stadium, the BAG outline), 52.314318, 4.941771.
 * Bearing 330.8: the outline's long axis (length-weighted edge direction,
 * 150.8 / 330.8), so model +y is the long axis (north-north-west) and +x the
 * short axis (east-north-east).
 *
 * Identity, in order: the low grey roof over an oval bowl, open in the
 * middle; the two white arched lattice trusses that carry the sliding roof,
 * spanning the bowl from four white towers with disc caps; the two sliding
 * roof panels (drawn parked open, over the long sides, as in Alf van Beem's
 * and Quistnix's aerials); the white concourse ring with window bands under
 * the grey raking undersides of the upper tier and its leaning columns; the
 * Burgemeester Stramanweg running straight through the base under the
 * stadium; the end block with the nine round vents.
 *
 * Evidence
 *  - Plan: OSM relation/1458682 outer way/57853253 (the building, BAG
 *    0363100012075730; x -84..92, y +-116 for the bowl, with the west annex
 *    to x -110 and end blocks to y +-128) and inner way/57853514 (the pitch,
 *    74 x 111 m, centre x 2.2). Truss towers: the outline's bulges at
 *    x -86..-89, y +-(58..72) and the separate OSM buildings way/282372120
 *    and way/282372125 at x 91..101, y +-(45..72); so the trusses run
 *    across the bowl, in model x, at y = +-60. The road: OSM way/7051023
 *    and way/7051024 (Burgemeester Stramanweg, tunnel=yes, layer -1,
 *    maxheight 4.0), y -6..+6, through the full width of the building.
 *  - Published (nl.wikipedia "Johan Cruijff ArenA"): built over the
 *    Stramanweg with a parking garage at ground level and one level up; the
 *    stadium's underside 8.40 m above ground; stands at 37 degrees; the
 *    sliding roof is two parts of 37 x 120 m each (so the opening is 74 m
 *    across the pitch's width, 120 m between the trusses). OSM height 75
 *    (truss tops), roof:height 20.
 *  - 3D BAG (3dbag.nl, CC BY 4.0, TU Delft/3DGI), pand
 *    NL.IMBAG.Pand.0363100012075730, AHN5 (2023): only an LoD1.1 fallback,
 *    70th percentile roof 58.3 m above ground (NAP -3.97); used for the
 *    roof's crown height near the opening.
 *  - Heights estimated from Mister No's level view from the south
 *    (panoramio (1)), scaled by the tower spacing (183 m): tower discs about
 *    57 m, truss crown 75 m (OSM), roof fascia top 44 m, concourse top about
 *    21 m, west annex about 24 m.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - Alf van Beem, "Arena, Ajax stadion, Amsterdam.JPG", CC0 — aerial from
 *      the south, roof open: trusses, parked panels, solar band, nine-vent
 *      block. https://commons.wikimedia.org/wiki/File:Arena,_Ajax_stadion,_Amsterdam.JPG
 *    - R.M.Jaarsma, "Amsterdam Arena Aerial.jpg", CC BY-SA 3.0 — aerial from
 *      the south-west, roof closed. https://commons.wikimedia.org/wiki/File:Amsterdam_Arena_Aerial.jpg
 *    - Quistnix, "Amsterdam Arena Roof Open.jpg", CC BY 3.0.
 *      https://commons.wikimedia.org/wiki/File:Amsterdam_Arena_Roof_Open.jpg
 *    - calflier001, "Amsterdam Arena SEP 2012.jpg", CC BY-SA 2.0 — from the
 *      air, roof open. https://commons.wikimedia.org/wiki/File:Amsterdam_Arena_SEP_2012.jpg
 *    - Mister No, "Amsterdam Arena - panoramio (1).jpg", CC BY 3.0 — level,
 *      from the south: the height ruler. https://commons.wikimedia.org/wiki/File:Amsterdam_Arena_-_panoramio_(1).jpg
 *    - Janericloebe, "Amsterdam ArenA 001.JPG", CC BY 3.0 — the Stramanweg
 *      entering under the west block. https://commons.wikimedia.org/wiki/File:Amsterdam_ArenA_001.JPG
 *    - Gzen92, "Amsterdam Arena (Amsterdam, Pays-Bas) (1).jpg" and "(3)",
 *      CC BY-SA 4.0 — facade, columns, fascia.
 *      https://commons.wikimedia.org/wiki/File:Amsterdam_Arena_(Amsterdam,_Pays-Bas)_(1).jpg
 *    - Markus Unger, "Amsterdam Arena (5722962939).jpg", CC BY 2.0 — the
 *      concourse ring and the leaning columns. https://commons.wikimedia.org/wiki/File:Amsterdam_Arena_(5722962939).jpg
 *    - Steven Lek, "Utrechtboog en Arena soccer stadion.png", CC0 — the
 *      truss arch in profile. https://commons.wikimedia.org/wiki/File:Utrechtboog_en_Arena_soccer_stadion.png
 *  No commercial imagery, no look-only sources. No lidar (AHN is not read by
 *  the repo's tools); terrain flat (NAP about -4 m).
 *
 * Elevation 0: the base (the garage and the road under it) is at street
 * level; the pitch (the map's) is drawn at ground, so the inner wall of the
 * bowl runs down to y = 0 around the pitch hole. Real pitch level is about
 * 8.4 m up.
 *
 * Invented or simplified: the plan is a superellipse (exponent 2.4) fitted
 * to the outline, centred at x 4.5; the roof is a smooth dome from the
 * fascia (44 m) to about 58 m at the opening; the trusses are planar Warren
 * trusses (the real ones are three-dimensional), chords drawn 2 m wide;
 * the parked panels' ribs are drawn three per panel; the colourful facades of
 * the west annex and the escalators, stair drums, signs and lights are left
 * out; the nine vents are put on the south end block (from the aerials).
 * Doubts: the west towers stand on the outline's bulges, a few metres off the
 * east ones in y; drawn on one straight line. The roof is drawn open; it is
 * often closed.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, rect, save, walls, type XY } from './chi-aon-center'
import { face } from './phl-independence-hall'

// ---------------------------------------------------------------------------
// Kit shared by this builder's other models (olympic-stadium, rembrandt-tower,
// ing-house, de-gooyer): smooth-shaded walls and tubes, which weld in the GLB
// and so cost far fewer bytes than flat boxes.

const nrm3 = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

/** Walls of a closed counter-clockwise ring, z0 to z1 (to ring r1 at the top), smooth-shaded round the ring. */
export function swalls(p: Part, r: XY[], z0: number, z1: number, r1: XY[] = r) {
  const n = r.length
  const nv = (k: number, top: boolean): V3 => {
    const q = top ? r1 : r
    const a = q[(k - 1 + n) % n], b = q[(k + 1) % n]
    const T: V3 = [b[0] - a[0], b[1] - a[1], 0], U: V3 = [r1[k][0] - r[k][0], r1[k][1] - r[k][1], z1 - z0]
    return nrm3(crs(T, U))
  }
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a: V3 = [r[i][0], r[i][1], z0], b: V3 = [r[j][0], r[j][1], z0], c: V3 = [r1[j][0], r1[j][1], z1], d: V3 = [r1[i][0], r1[i][1], z1]
    const na = nv(i, false), nb = nv(j, false), nc = nv(j, true), nd = nv(i, true)
    p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
    p.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
  }
}

/**
 * A smooth round tube from a to b, `seg` sides (4 to 8), radius r; open at
 * the ends unless `caps`. Lattice members, columns, stocks.
 */
export function tube(p: Part, a: V3, b: V3, r: number, seg = 6, caps = false) {
  const t = nrm3([b[0] - a[0], b[1] - a[1], b[2] - a[2]])
  let u = crs(t, [0, 0, 1])
  if (Math.hypot(...u) < 1e-6) u = crs(t, [1, 0, 0])
  u = nrm3(u)
  const v = crs(u, t)
  const dir = (k: number): V3 => {
    const ang = (k / seg) * 2 * Math.PI + Math.PI / seg
    return [u[0] * Math.cos(ang) + v[0] * Math.sin(ang), u[1] * Math.cos(ang) + v[1] * Math.sin(ang), u[2] * Math.cos(ang) + v[2] * Math.sin(ang)]
  }
  const at = (o: V3, d: V3): V3 => [o[0] + d[0] * r, o[1] + d[1] * r, o[2] + d[2] * r]
  for (let k = 0; k < seg; k++) {
    const d0 = dir(k), d1 = dir(k + 1)
    p.tri(at(a, d0), at(a, d1), at(b, d1), undefined, undefined, undefined, [d0, d1, d1])
    p.tri(at(a, d0), at(b, d1), at(b, d0), undefined, undefined, undefined, [d0, d1, d0])
    if (caps) {
      p.tri(b, at(b, d0), at(b, d1), undefined, undefined, undefined, [t, t, t])
      const m: V3 = [-t[0], -t[1], -t[2]]
      p.tri(a, at(a, d1), at(a, d0), undefined, undefined, undefined, [m, m, m])
    }
  }
}

// ---------------------------------------------------------------------------
// Johan Cruijff ArenA

const CX = 4.5, A = 88, B = 116, PE = 2.4, N = 56
const sp = (c: number) => Math.sign(c) * Math.pow(Math.abs(c), 2 / PE)
/** Superellipse point at scale s, angle t, pushed `d` metres outwards. */
function sePt(s: number, t: number, d = 0): XY {
  const x = s * A * sp(Math.cos(t)), y = s * B * sp(Math.sin(t))
  if (!d) return [CX + x, y]
  const e = 1e-3, x2 = s * A * sp(Math.cos(t + e)), y2 = s * B * sp(Math.sin(t + e))
  const tx = x2 - x, ty = y2 - y, l = Math.hypot(tx, ty)
  return [CX + x + (ty / l) * d, y - (tx / l) * d]
}
const ring = (s: number, d = 0, n = N): XY[] => Array.from({ length: n }, (_, k) => sePt(s, (k / n) * 2 * Math.PI, d))
/** Normalised superellipse radius of a plan point. */
const sOf = (x: number, y: number) => Math.pow(Math.pow(Math.abs(x - CX) / A, PE) + Math.pow(Math.abs(y) / B, PE), 1 / PE)

const RIM = 1.02 // roof edge, a little outside the facade
const Z_EAVE = 44, Z_CROWN = 58.5
const zRoof = (x: number, y: number) => {
  const s = Math.min(1, sOf(x, y) / RIM)
  return Z_EAVE + (Z_CROWN - Z_EAVE) * Math.pow(1 - s * s, 0.62)
}
/** Half-width of the roof rim at height y (plan), and half-length at x. */
const rimX = (y: number) => RIM * A * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(y) / (RIM * B), PE)), 1 / PE)
const rimY = (x: number) => RIM * B * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(x - CX) / (RIM * A), PE)), 1 / PE)

const OX = 37, OY = 60 // the opening: half 37 m across (x), 60 m between the trusses (y)

/** Clip a ring to y >= y0 (keep = 1) or y <= y0 (keep = -1). */
function clipY(r: XY[], y0: number, keep: 1 | -1): XY[] {
  const out: XY[] = [], ins = (p: XY) => (p[1] - y0) * keep >= 0
  r.forEach((a, i) => {
    const b = r[(i + 1) % r.length]
    if (ins(a)) out.push(a)
    if (ins(a) !== ins(b)) {
      const t = (y0 - a[1]) / (b[1] - a[1])
      out.push([a[0] + (b[0] - a[0]) * t, y0])
    }
  })
  return out
}

function build() {
  const white = new Part(), grey = new Part(), roof = new Part(), win = new Part(), red = new Part(), dark = new Part()

  // --- Base, 0-8.4 m: the garage under the bowl, split by the Stramanweg.
  const ROAD = 10, Z_ROAD = 5.6, Z_DECK = 8.4
  /** A prism split by the road: two halves to the road's soffit, whole above. */
  function overRoad(r: XY[], z1: number, wall: Part, top: Part | null) {
    for (const k of [1, -1] as const) {
      const h = clipY(r, k * ROAD, k)
      if (h.length < 3) continue
      h.forEach((a, i) => {
        const b = h[(i + 1) % h.length]
        const cut = Math.abs(a[1] - k * ROAD) < 1e-6 && Math.abs(b[1] - k * ROAD) < 1e-6
        ;(cut ? dark : wall).quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], Z_ROAD], [a[0], a[1], Z_ROAD])
      })
    }
    const mid = clipY(clipY(r, -ROAD, 1), ROAD, -1)
    if (mid.length >= 3) cap(dark, mid, Z_ROAD, false)
    walls(wall, r, Z_ROAD, z1)
    if (top) cap(top, r, z1)
  }
  overRoad(ring(1.0), Z_DECK, grey, null) // open over the pitch hole
  // West annex (the block the road enters under), east strip, end blocks.
  overRoad(rect(-109.8, -45.8, -86, 46.2), 24, grey, roof)
  overRoad(rect(88, -36, 97.6, 36), 10, grey, roof)
  for (const [y0, y1] of [[113.6, 127.9], [-127.5, -113.3]]) {
    const r = rect(-5.4, y0, 17.2, y1)
    walls(grey, r, 0, 24)
    cap(roof, r, 24)
  }
  // Window bands on the west annex's west face, either side of the road.
  for (const [y0, y1] of [[-44, -12], [12, 44]]) for (const z of [9, 16]) face(win, [[-109.86, y1, z], [-109.86, y0, z], [-109.86, y0, z + 4.5], [-109.86, y1, z + 4.5]], [-1, 0, 0])
  // The nine round vents on the south end block.
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    const cx = 5.9 + (i - 1) * 6.4, cz = 15.5 + (j - 1) * 6.0, rr = 2.3, y = -127.56
    for (let k = 0; k < 12; k++) {
      const a0 = (k / 12) * 2 * Math.PI, a1 = ((k + 1) / 12) * 2 * Math.PI
      face(dark, [[cx, y, cz], [cx + rr * Math.cos(a0), y, cz + rr * Math.sin(a0)], [cx + rr * Math.cos(a1), y, cz + rr * Math.sin(a1)]], [0, -1, 0])
    }
  }

  // --- The concourse ring, 8.4-21 m, white, with two window bands.
  const Z_CONC = 21
  swalls(white, ring(0.965), Z_DECK, Z_CONC)
  for (const [z0, z1] of [[10.6, 13.6], [15.6, 18.6]]) swalls(win, ring(0.965, 0.05), z0, z1)
  swalls(red, ring(0.965, 0.05), 19.6, 20.4) // the red trim line under the upper tier
  // The upper tier's raking underside, leaning out to the fascia.
  swalls(grey, ring(0.965), Z_CONC, 40, ring(1.0))
  // Fascia 40-44, its soffit, and the roof edge.
  swalls(grey, ring(RIM), 40, Z_EAVE)
  {
    const o = ring(RIM), i = ring(1.0)
    for (let k = 0; k < N; k++) {
      const l = (k + 1) % N
      grey.quad([o[k][0], o[k][1], 40], [i[k][0], i[k][1], 40], [i[l][0], i[l][1], 40], [o[l][0], o[l][1], 40])
    }
  }
  // Leaning white columns from the deck to the fascia.
  const NC = 32
  for (let k = 0; k < NC; k++) {
    const t = ((k + 0.5) / NC) * 2 * Math.PI
    const a = sePt(1.0, t, 0.6), b = sePt(RIM, t, -0.4)
    tube(white, [a[0], a[1], Z_DECK], [b[0], b[1], 40], 0.7, 5)
  }

  // --- The stands: the inner wall round the pitch hole and the seating bowl.
  {
    const P = 2.3, IA = 39, IB = 58, IP = 6
    const inner: XY[] = Array.from({ length: N }, (_, k) => {
      const t = (k / N) * 2 * Math.PI, c = Math.cos(t), s = Math.sin(t)
      return [P + IA * Math.sign(c) * Math.pow(Math.abs(c), 2 / IP), 0.2 + IB * Math.sign(s) * Math.pow(Math.abs(s), 2 / IP)] as XY
    })
    swalls(dark, [...inner].reverse(), 0, 9.6)
    const outer = ring(0.95)
    // Red seats in the lower tier, the upper tier in shadow under the roof.
    const mid = inner.map((p, k) => [p[0] + (outer[k][0] - p[0]) * 0.4, p[1] + (outer[k][1] - p[1]) * 0.4] as XY)
    swalls(red, [...inner].reverse(), 9.6, 22, [...mid].reverse())
    swalls(dark, [...mid].reverse(), 22, 40.5, [...outer].reverse())
  }

  // --- The roof: a shallow dome with the opening between the trusses,
  // drawn as two side strips and two end caps so its edges follow the
  // opening and the rim. A band of solar panels runs round its outer part.
  const SOL0 = 0.6, SOL1 = 0.88
  const roofQuad = (a: XY, b: XY, c: XY, d: XY, part: Part) => {
    const P = (p: XY): V3 => [p[0], p[1], zRoof(p[0], p[1])]
    const Nn = (p: XY): V3 => {
      const e = 0.5, gx = (zRoof(p[0] + e, p[1]) - zRoof(p[0] - e, p[1])) / (2 * e), gy = (zRoof(p[0], p[1] + e) - zRoof(p[0], p[1] - e)) / (2 * e)
      return nrm3([-gx, -gy, 1])
    }
    const Dn = (p: XY): V3 => { const n = Nn(p); return [-n[0], -n[1], -n[2]] }
    part.tri(P(a), P(b), P(c), undefined, undefined, undefined, [Nn(a), Nn(b), Nn(c)])
    part.tri(P(a), P(c), P(d), undefined, undefined, undefined, [Nn(a), Nn(c), Nn(d)])
    // The underside, seen through the opening.
    roof.tri(P(a), P(c), P(b), undefined, undefined, undefined, [Dn(a), Dn(c), Dn(b)])
    roof.tri(P(a), P(d), P(c), undefined, undefined, undefined, [Dn(a), Dn(d), Dn(c)])
  }
  const NY = 8, NT = 6
  const ts = Array.from({ length: NT + 1 }, (_, i) => i / NT)
  for (const sx of [1, -1]) {
    // Side strips over the long sides, between the trusses.
    for (let j = 0; j < NY; j++) {
      const y0 = -OY + (2 * OY * j) / NY, y1 = -OY + (2 * OY * (j + 1)) / NY
      for (let i = 0; i < NT; i++) {
        const X = (y: number, t: number) => CX + sx * (OX + (rimX(y) - OX) * t)
        const a: XY = [X(y0, ts[i]), y0], b: XY = [X(y0, ts[i + 1]), y0], c: XY = [X(y1, ts[i + 1]), y1], d: XY = [X(y1, ts[i]), y1]
        const tm = (ts[i] + ts[i + 1]) / 2, part = tm > SOL0 && tm < SOL1 ? dark : roof
        if (sx > 0) roofQuad(a, b, c, d, part)
        else roofQuad(a, d, c, b, part)
      }
    }
  }
  for (const sy of [1, -1]) {
    // End caps beyond the trusses; their columns meet the strips' at y = +-60.
    const w = rimX(OY)
    const xs = [
      ...ts.map((t) => -(OX + (w - OX) * t)).reverse(),
      ...Array.from({ length: 5 }, (_, i) => -OX + (2 * OX * (i + 1)) / 6),
      ...ts.map((t) => OX + (w - OX) * t),
    ].map((x) => CX + x)
    for (let i = 0; i < xs.length - 1; i++) {
      for (let j = 0; j < NT; j++) {
        const Y = (x: number, t: number) => sy * (OY + (rimY(x) - OY) * t)
        const x0 = xs[i], x1 = xs[i + 1]
        const a: XY = [x0, Y(x0, ts[j])], b: XY = [x1, Y(x1, ts[j])], c: XY = [x1, Y(x1, ts[j + 1])], d: XY = [x0, Y(x0, ts[j + 1])]
        const tm = (ts[j] + ts[j + 1]) / 2, part = tm > SOL0 && tm < SOL1 ? dark : roof
        if (sy > 0) roofQuad(a, b, c, d, part)
        else roofQuad(a, d, c, b, part)
      }
    }
  }

  // --- The sliding roof panels, parked open over the long sides: curved
  // slabs riding 1.8 m above the fixed roof, each with three white ribs.
  for (const sx of [1, -1]) {
    const x0 = CX + sx * (OX + 0.8), x1 = CX + sx * (OX + 37), y0 = -OY + 2.5, y1 = OY - 2.5
    const NXp = 3, NYp = 2, H = 1.8, T = 1.0
    const Pz = (x: number, y: number, up: number): V3 => [x, y, zRoof(x, y) + up]
    const gx = (i: number) => x0 + ((x1 - x0) * i) / NXp, gy = (j: number) => y0 + ((y1 - y0) * j) / NYp
    for (let i = 0; i < NXp; i++) for (let j = 0; j < NYp; j++) {
      const a = Pz(gx(i), gy(j), H + T), b = Pz(gx(i + 1), gy(j), H + T), c = Pz(gx(i + 1), gy(j + 1), H + T), d = Pz(gx(i), gy(j + 1), H + T)
      face(white, [a, b, c, d], [0, 0, 1])
    }
    // Edges: the slab's sides down to its underside.
    for (let i = 0; i < NXp; i++) for (const [j, ny] of [[0, -1], [NYp, 1]] as [number, number][]) {
      face(roof, [Pz(gx(i), gy(j), H), Pz(gx(i + 1), gy(j), H), Pz(gx(i + 1), gy(j), H + T), Pz(gx(i), gy(j), H + T)], [0, ny, 0])
    }
    for (const [i, nx] of [[0, -sx], [NXp, sx]] as [number, number][]) for (let j = 0; j < NYp; j++) {
      face(roof, [Pz(gx(i), gy(j), H), Pz(gx(i), gy(j + 1), H), Pz(gx(i), gy(j + 1), H + T), Pz(gx(i), gy(j), H + T)], [nx, 0, 0])
    }
    for (let i = 0; i < NXp; i++) for (let j = 0; j < NYp; j++) {
      face(roof, [Pz(gx(i), gy(j), H), Pz(gx(i + 1), gy(j), H), Pz(gx(i + 1), gy(j + 1), H), Pz(gx(i), gy(j + 1), H)], [0, 0, -1])
    }
    for (const f of [0.18, 0.5, 0.82]) {
      const x = x0 + (x1 - x0) * f
      for (let j = 0; j < NYp; j++) tube(white, Pz(x, gy(j), H + T + 0.5), Pz(x, gy(j + 1), H + T + 0.5), 0.55, 4)
    }
  }

  // --- Towers: concrete cores, white columns, two discs; then the trusses.
  const XW = -87, XE = 96, Z_TOP = 57
  for (const x of [XW, XE]) for (const y of [-OY, OY]) {
    const core = x > 0 ? rect(90.8, y > 0 ? 45.6 : -71.7, 100.6, y > 0 ? 71.8 : -45.4) : rect(-91, y - 6, -83, y + 6)
    walls(grey, core, 0, 20)
    cap(roof, core, 20)
    const col: XY[] = Array.from({ length: 12 }, (_, k) => [x + 2.3 * Math.cos((k / 12) * 2 * Math.PI), y + 2.3 * Math.sin((k / 12) * 2 * Math.PI)] as XY)
    swalls(white, col, 20, Z_TOP + 2.5)
    cap(white, col, Z_TOP + 2.5)
    for (const [z0, z1, r] of [[Z_TOP - 6, Z_TOP - 5.2, 3.6], [Z_TOP, Z_TOP + 1.3, 4.8]]) {
      const d: XY[] = Array.from({ length: 12 }, (_, k) => [x + r * Math.cos((k / 12) * 2 * Math.PI), y + r * Math.sin((k / 12) * 2 * Math.PI)] as XY)
      swalls(white, d, z0, z1)
      cap(white, d, z1)
      cap(white, d, z0, false)
    }
  }
  const NB = 14
  for (const y of [-OY, OY]) {
    const zb = (u: number) => Z_TOP + 1.5 + 6.5 * Math.sin(Math.PI * u)
    const zt = (u: number) => Z_TOP + 3.0 + 15.0 * Math.sin(Math.PI * u)
    const X = (u: number) => XW + (XE - XW) * u
    for (let k = 0; k < NB; k++) {
      const u0 = k / NB, u1 = (k + 1) / NB
      tube(white, [X(u0), y, zb(u0)], [X(u1), y, zb(u1)], 1.6, 6)
      tube(white, [X(u0), y, zt(u0)], [X(u1), y, zt(u1)], 1.7, 6)
      // Warren diagonals, skipping the tapered end bays.
      if (k > 0 && k < NB - 1) {
        const [ua, ub] = k % 2 ? [u0, u1] : [u1, u0]
        tube(white, [X(ua), y, zb(ua)], [X(ub), y, zt(ub)], 1.0, 5)
      }
    }
    // Verticals at every second node.
    for (let k = 2; k < NB - 1; k += 2) tube(white, [X(k / NB), y, zb(k / NB)], [X(k / NB), y, zt(k / NB)], 0.75, 5)
  }

  const flood = (p: V3, n: V3) => (p[2] > 50 && n[2] < 0.8 ? 0.8 : 0)
  return [
    { part: white, material: { ...finish('arena-white', 0xf1f0ec), floodlight: flood } },
    { part: grey, material: finish('arena-grey', 0xc4c5c3) },
    { part: roof, material: { ...PALETTE.roof } },
    { part: win, material: { ...PALETTE.window } },
    { part: red, material: finish('arena-red', 0xa64a42) },
    { part: dark, material: finish('arena-dark', 0x4f5560) },
  ]
}

if (import.meta.main) await save('amsterdam-johan-cruijff-arena', 'Johan Cruijff ArenA', [52.314318, 4.941771], 330.8, build(), 6500)
