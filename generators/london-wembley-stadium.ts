/**
 * Wembley Stadium, Brent — original procedural geometry, CC0-1.0.
 * bun generators/london-wembley-stadium.ts
 * writes models/london-wembley-stadium.glb (low) and
 * models/london-wembley-stadium.detail.glb (the arch as a full tubular
 * lattice: six chords, rings and diagonals; every hanger and forestay; more
 * roof trusses).
 *
 * Model frame: bearing 0 (x east, y north, z up, metres; the pitch runs
 * east-west, OSM's opening is at bearing 89.8). Origin = area centroid of
 * the stadium outline (relation/912489's outer ring). y = 0 is the lowest
 * ground under the footprint: the street level north of the stadium,
 * about 40.3 m AOD.
 *
 * The form: a round bowl clad in silver-grey metal and glass, standing on
 * its podium; a flat ring roof over the outer concourse with, behind it, the
 * main roof's perimeter band of white V-trusses; the main roof sloping up to
 * an inner edge round the rectangular opening, grey with a cream
 * translucent band along the north and east sides and white radial trusses on top;
 * three red seating tiers inside, the glazed hospitality fronts as dark
 * bands between them; and the arch: a white tubular steel
 * lattice 7.4 m across, springing from concrete piers at the east and west
 * ends and leaning 22° north over the north stand, with hangers to the
 * north roof and forestays over the opening to the south roof. The pitch
 * is the map's.
 *
 * Evidence
 * - OSM relation/912489 (building=stadium, height 52; outer ways 116587436,
 *   963609749, 963609748, 963608732; inner way/377913373, the roof
 *   opening, x -67..72, y -59..35); relation/12942436 (leisure=stadium,
 *   the same outer ring, wikidata Q128468); the arch way/27784957
 *   (building=stadium, height 134, its plan a crescent from foot (-157, 42)
 *   to foot (160, 43), crown 94 m north of the feet); the retractable roof
 *   parts way/116537666 and way/377915368 (building=roof, height 60).
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0 (flight year not stated; the stadium opened in 2007 and shows
 *   complete). Above y = 0 (1.7 m above the box's lowest DTM cell, 38.6 m
 *   AOD): pitch 6.1; podium deck all round 12.3 (Olympic Way and the
 *   east and west podium; to the north and north-east the streets are at
 *   0–1.3, under the podium's edge; the ground rises to the south, to
 *   10–13 at the railway); facade top and the flat concourse roof 39.1;
 *   the main roof's outer edge 46.7–59.7 (highest on the north, where the
 *   arch carries it), its inner edge 62–64; arch crown 140.3. Plan, read
 *   on 48 rays from the opening's centre: the concourse ring roof is
 *   20–35 m wide on the north, about 12 m at the ends and almost nothing on
 *   the south, where the main roof runs out to the facade.
 * - Published (Wikipedia, "Wembley Stadium"): arch 133 m above the pitch,
 *   315 m span, 7.4 m diameter, inclined 22°; roof 52 m above the pitch;
 *   the arch carries the north roof and most of the south roof's
 *   retractable section; Foster + Partners and Populous, opened 2007;
 *   90,000 seats in three tiers.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "London Wembley.jpg", Arne Müseler, CC BY-SA 3.0 de — aerial from the
 *     south: the bowl, cladding, red seats, the south roof's white trusses
 *     and its retractable panel, the arch;
 *   "Wembley Stadium from the air - geograph.org.uk - 5891299.jpg", Mike
 *     Pennington, CC BY-SA 2.0 — aerial from the south-west: the cream
 *     translucent band on the north roof, the roof's white structure;
 *   "Cmglee London Wembley aerial.jpg", Cmglee, CC BY-SA 4.0 — distant
 *     aerial: the arch's lean;
 *   "New Wembley Stadium and Arch from Olympic Way - geograph.org.uk -
 *     2406320.jpg", David Hawgood, CC BY-SA 2.0 — from the north: the glass
 *     north facade, the white V-truss band, the arch and its hangers;
 *   "Wembley Stadium - geograph.org.uk - 2281511.jpg", David Howard,
 *     CC BY-SA 2.0 — from the north-east street: the podium on columns, the
 *     arch's lattice and hanger fans;
 *   "Wembley Stadium, north stand and the arch - geograph.org.uk -
 *     6440986.jpg", Christopher Hilton, CC BY-SA 2.0 — inside: the tiers,
 *     the cream roof band, the roof's white struts;
 *   "Wembley Stadium aerial 2011.jpg", Andreas Praefcke, public domain;
 *   "Wembley Stadium. London (26986246028).jpg", Mike McBey, CC BY 2.0.
 *
 * Measured (lidar): pitch, podium, facade and roof heights, the ring and
 * roof widths, the arch crown. Published: the arch's span, diameter, lean
 * and height. From OSM: the facade line, the opening, the arch's feet.
 * Estimated: the seating tiers' heights (from the inside photos), the
 * facade's glass and cladding pattern (grouped, not traced), the truss and
 * hanger counts (fewer than the real ones), the arch's in-plane curve
 * (a flattened parabola fitted to the lidar crescent), the piers' size.
 * The low model's arch is a solid 6 m core with three chords 8.8 m across
 * (real 7.4 m), ring collars and diagonals, so it survives at phone size
 * and still reads as a lattice; the detail model has the full lattice.
 * Elevation 0: the pitch is 6.1 m above the lowest street under the
 * footprint (north side) and 6.2 m below the podium deck, so the bowl isn't
 * sunk below the map's ground; y = 0 is the north street and the walls run
 * down to it; the podium deck round the bowl is not modelled (it is the
 * map's ground on the south and a deck over parking on the north).
 * Doubts: lidar flight year unknown; the seat tiers and the roof's inner
 * structure are simplified; the retractable panels are drawn closed-sided
 * in the roof plane.
 */
import { writeFileSync } from 'node:fs'
import { Part, writeGlb, cross, sub, type V3, type MaterialSpec } from './mesh'
import { finish, PALETTE } from './palette'

const ID = 'london-wembley-stadium'

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scl = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const nrm = (a: V3): V3 => scl(a, 1 / (Math.hypot(a[0], a[1], a[2]) || 1))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const rad = (d: number) => (d * Math.PI) / 180

/** A round tube along a path, smooth-shaded. */
function tube(p: Part, path: V3[], r: number | number[], sides: number, closed = false) {
  const n = path.length
  const R = (i: number) => (Array.isArray(r) ? r[i % r.length] : r)
  const nb = (i: number) => (closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i)))
  const T = path.map((_, i) => nrm(sub(path[nb(i + 1)], path[nb(i - 1)])))
  const rings = path.map((c, i) => {
    const t = T[i]
    const side = nrm(Math.abs(t[2]) > 0.9 ? cross(t, [1, 0, 0]) : cross(t, [0, 0, 1]))
    const up = cross(side, t)
    return Array.from({ length: sides }, (_, k) => {
      const a = (2 * Math.PI * k) / sides
      const d = add(scl(side, Math.cos(a)), scl(up, Math.sin(a)))
      return { p: add(c, scl(d, R(i))), n: d }
    })
  })
  const last = closed ? n : n - 1
  for (let i = 0; i < last; i++)
    for (let k = 0; k < sides; k++) {
      const j = (k + 1) % sides, a = rings[i], b = rings[(i + 1) % n]
      p.tri(a[k].p, b[k].p, b[j].p, undefined, undefined, undefined, [a[k].n, b[k].n, b[j].n])
      p.tri(a[k].p, b[j].p, a[j].p, undefined, undefined, undefined, [a[k].n, b[j].n, a[j].n])
    }
}
const rod = (p: Part, a: V3, b: V3, r: number, sides = 3) => tube(p, [a, b], r, sides)
/** A quad wound so its normal points along `hint`. */
function oq(p: Part, a: V3, b: V3, c: V3, d: V3, hint: V3) {
  const n = cross(sub(b, a), sub(c, a))
  const n2 = cross(sub(c, a), sub(d, a))
  const s = (n[0] + n2[0]) * hint[0] + (n[1] + n2[1]) * hint[1] + (n[2] + n2[2]) * hint[2]
  if (s >= 0) p.quad(a, b, c, d)
  else p.quad(a, d, c, b)
}
const UP: V3 = [0, 0, 1]
/** A quad drawn from both sides. */
function both(p: Part, a: V3, b: V3, c: V3, d: V3) {
  p.quad(a, b, c, d)
  p.quad(a, d, c, b)
}

/**
 * Smooth a part's shading where faces meet at less than `deg`, and drop
 * the (unused) UVs, so corners that coincide merge into one vertex: curved
 * walls and roofs shade softly and the file stays small. Creases sharper
 * than `deg` stay hard.
 */
function smooth(p: Part, deg = 32) {
  const cos = Math.cos((deg * Math.PI) / 180)
  const groups = new Map<string, number[]>()
  const n = p.pos.length / 3
  for (let i = 0; i < n; i++) {
    const k = `${Math.round(p.pos[3 * i] * 100)},${Math.round(p.pos[3 * i + 1] * 100)},${Math.round(p.pos[3 * i + 2] * 100)}`
    const g = groups.get(k)
    if (g) g.push(i)
    else groups.set(k, [i])
  }
  const out = p.nrm.slice()
  for (const g of groups.values()) {
    for (const i of g) {
      let x = 0, y = 0, z = 0
      for (const j of g) {
        const d = p.nrm[3 * i] * p.nrm[3 * j] + p.nrm[3 * i + 1] * p.nrm[3 * j + 1] + p.nrm[3 * i + 2] * p.nrm[3 * j + 2]
        if (d >= cos) { x += p.nrm[3 * j]; y += p.nrm[3 * j + 1]; z += p.nrm[3 * j + 2] }
      }
      const l = Math.hypot(x, y, z) || 1
      out[3 * i] = Math.round((x / l) * 1e4) / 1e4; out[3 * i + 1] = Math.round((y / l) * 1e4) / 1e4; out[3 * i + 2] = Math.round((z / l) * 1e4) / 1e4
    }
  }
  p.nrm = out
  p.uv = p.uv.map(() => 0)
}

// ------------------------------------------------------------ plan
/** OSM outer ring (relation/912489), metres in the model frame. */
const OUTLINE: [number, number][] = [[-52.8,133.5],[-70.0,124.3],[-83.6,116.0],[-95.4,106.9],[-106.3,96.1],[-116.7,84.4],[-122.2,78.0],[-125.9,72.0],[-133.2,58.4],[-136.2,52.3],[-140.7,37.0],[-144.9,20.6],[-146.9,5.3],[-147.0,-12.9],[-144.5,-33.0],[-140.6,-49.2],[-135.9,-64.4],[-130.9,-74.2],[-125.6,-84.5],[-119.0,-92.1],[-110.9,-100.2],[-100.7,-109.7],[-89.2,-117.4],[-78.1,-124.7],[-65.9,-129.1],[-51.6,-132.2],[-36.1,-135.4],[-17.2,-137.6],[2.6,-137.7],[24.5,-136.7],[49.1,-132.6],[67.6,-127.9],[75.9,-124.5],[84.3,-120.3],[98.9,-109.4],[114.3,-94.5],[119.6,-88.2],[124.1,-82.6],[129.0,-74.0],[133.3,-64.9],[139.3,-46.0],[142.6,-32.0],[144.9,-16.3],[146.5,1.6],[145.5,17.9],[142.2,37.1],[138.4,53.1],[131.5,67.4],[122.8,81.4],[112.3,93.5],[102.3,104.0],[89.7,114.1],[76.8,122.7],[64.0,129.6],[54.6,133.8],[34.9,139.5],[24.6,142.0],[7.3,143.9],[0.4,144.0],[-8.1,143.6],[-24.2,141.7],[-32.5,139.7],[-44.9,136.4]]
/** The bowl's centre (the opening's centroid). */
const C: [number, number] = [2.5, -11.1]
const dir = (b: number): [number, number] => [Math.sin(rad(b)), Math.cos(rad(b))]
/** Distance from C to the outline along bearing b. */
function rFacade(b: number) {
  const [ux, uy] = dir(b)
  let best = 0
  for (let i = 0; i < OUTLINE.length; i++) {
    const [x0, y0] = OUTLINE[i], [x1, y1] = OUTLINE[(i + 1) % OUTLINE.length]
    const ex = x1 - x0, ey = y1 - y0, wx = x0 - C[0], wy = y0 - C[1]
    const den = ux * ey - uy * ex
    if (Math.abs(den) < 1e-9) continue
    const t = (wx * ey - wy * ex) / den, s = (wx * uy - wy * ux) / den
    if (t > 0 && s >= 0 && s <= 1) best = Math.max(best, t)
  }
  return best
}
/** A superellipse's radius along bearing b (x half-size a, y half-size bb). */
const superR = (b: number, a: number, bb: number, n: number) => {
  const [ux, uy] = dir(b)
  return 1 / Math.pow(Math.pow(Math.abs(ux) / a, n) + Math.pow(Math.abs(uy) / bb, n), 1 / n)
}
const rOpen = (b: number) => superR(b, 69.5, 47, 5.5)
const rPitch = (b: number) => superR(b, 62, 42.5, 7)
/** A table over bearing, every 30°, interpolated round the circle. */
const table = (vals: number[]) => (b: number) => {
  const t = (((b % 360) + 360) % 360) / 30, i = Math.floor(t), f = t - i
  const s = (1 - Math.cos(Math.PI * f)) / 2
  return lerp(vals[i % 12], vals[(i + 1) % 12], s)
}
/** Width of the low concourse roof ring outside the main roof (lidar). */
const ringW = table([28, 20, 12, 12, 6, 1.5, 1.5, 4, 8, 12, 12, 22])
/** Main roof outer-edge height (lidar). */
const zOut = table([59.5, 56, 50, 51.5, 50.5, 55.5, 57.5, 55, 51, 50, 48.5, 55.5])
const zIn = (b: number) => 62 + 1.6 * Math.cos(rad(b)) ** 2
const rRoof = (b: number) => rFacade(b) - ringW(b)
const Z = { pitch: 6.1, podium: 12.3, eave: 39.1 }
/** A point at fraction f between the opening (0) and the roof's outer edge (1). */
function roofPt(b: number, f: number): V3 {
  const r = lerp(rOpen(b), rRoof(b), f), [ux, uy] = dir(b)
  return [C[0] + ux * r, C[1] + uy * r, zIn(b) + (zOut(b) - zIn(b)) * Math.pow(f, 1.3)]
}
const at = (b: number, r: number, z: number): V3 => {
  const [ux, uy] = dir(b)
  return [C[0] + ux * r, C[1] + uy * r, z]
}

// ------------------------------------------------------------ the arch
const FOOT = { x0: -157.2, x1: 159.7, y: 42.4, z: Z.podium }
const LEAN = rad(22)
const S_TOP = (140.3 - FOOT.z) / Math.cos(LEAN)
/** A point on the arch's centre line, u from -1 (west foot) to 1 (east foot). */
function archPt(u: number): V3 {
  const s = S_TOP * Math.pow(Math.max(0, 1 - u * u), 0.88)
  const x = lerp(FOOT.x0, FOOT.x1, (u + 1) / 2)
  return [x, FOOT.y + s * Math.sin(LEAN), FOOT.z + s * Math.cos(LEAN)]
}

const M = {
  white: { ...finish('arch-white', 0xf4f4f1, 0.55), floodlight: (q: V3) => (q[2] > 14 ? 0.85 : 0) } as MaterialSpec,
  roof: { ...finish('roof-grey', 0xa4abb1, 0.8), doubleSided: true } as MaterialSpec,
  band: { ...finish('roof-translucent', 0xe6dcb6, 0.7), doubleSided: true } as MaterialSpec,
  clad: { ...finish('silver-cladding', 0xc9cdd0, 0.6), floodlight: (q: V3) => (q[2] > 12 && q[2] < 40 ? 0.35 : 0) } as MaterialSpec,
  glass: { ...PALETTE.window, color: 0x7f97a8 } as MaterialSpec,
  seats: finish('seats-red', 0xc4473f, 0.85),
}

function build(detail: boolean) {
  const white = new Part(), roof = new Part(), band = new Part(), clad = new Part(), glass = new Part(), seats = new Part()
  const N = detail ? 128 : 64
  const B = (i: number) => (360 * i) / N

  // --- The bowl wall: concrete base to the podium, then the facade to the
  // eave. Cladding with grouped glass: a full curtain wall on the north
  // (Olympic Way) side, tall glass panels between silver piers elsewhere.
  for (let i = 0; i < N; i++) {
    const b0 = B(i), b1 = B(i + 1), r0 = rFacade(b0), r1 = rFacade(b1)
    const p = (b: number, r: number, z: number) => at(b, r, z)
    const bm = (b0 + b1) / 2, north = Math.cos(rad(bm)) > 0.55
    const out: V3 = [...dir(bm), 0] as V3, inw: V3 = [-out[0], -out[1], 0]
    const W = (part: Part, a: V3, b: V3, c: V3, d: V3) => oq(part, a, b, c, d, out)
    W(roof, p(b0, r0, 0), p(b1, r1, 0), p(b1, r1, Z.podium), p(b0, r0, Z.podium))
    const k = i % (detail ? 8 : 4)
    const z0 = Z.podium, z1 = Z.eave
    if (north) {
      // curtain wall from 14 m to 37 m, a cladding band at the foot and top
      W(clad, p(b0, r0, z0), p(b1, r1, z0), p(b1, r1, z0 + 2), p(b0, r0, z0 + 2))
      W(glass, p(b0, r0, z0 + 2), p(b1, r1, z0 + 2), p(b1, r1, z1 - 2.5), p(b0, r0, z1 - 2.5))
      W(clad, p(b0, r0, z1 - 2.5), p(b1, r1, z1 - 2.5), p(b1, r1, z1), p(b0, r0, z1))
      // pale mullion piers every other bay and a transom band, just proud
      if (i % 2 === 0) {
        const s = 0.12 * (b1 - b0), o = 0.06
        W(clad, p(b0, r0 + o, z0 + 2), p(b0 + s, rFacade(b0 + s) + o, z0 + 2), p(b0 + s, rFacade(b0 + s) + o, z1 - 2.5), p(b0, r0 + o, z1 - 2.5))
      }
      W(clad, p(b0, r0 + 0.06, 25), p(b1, r1 + 0.06, 25), p(b1, r1 + 0.06, 26.2), p(b0, r0 + 0.06, 26.2))
    } else {
      W(clad, p(b0, r0, z0), p(b1, r1, z0), p(b1, r1, z1), p(b0, r0, z1))
      // a broad glass ribbon just proud of the cladding, a silver pier
      // every fourth bay
      {
        const o = 0.05, gz0 = 21, gz1 = 33
        const s = k === 0 ? 0.35 * (b1 - b0) : 0
        W(glass, p(b0 + s, rFacade(b0 + s) + o, gz0), p(b1 - s, rFacade(b1 - s) + o, gz0), p(b1 - s, rFacade(b1 - s) + o, gz1), p(b0 + s, rFacade(b0 + s) + o, gz1))
      }
    }
    // Flat concourse roof from the facade in to the main roof's edge.
    const q0 = rRoof(b0), q1 = rRoof(b1)
    if (r0 - q0 > 0.5 || r1 - q1 > 0.5) oq(roof, p(b1, q1, Z.eave), p(b0, q0, Z.eave), p(b0, r0, Z.eave), p(b1, r1, Z.eave), UP)
    // The main roof's perimeter band: dark backing from the ring up to the
    // roof edge (the white V-trusses go on it below).
    const e0 = roofPt(b0, 1), e1 = roofPt(b1, 1)
    W(roof, p(b0, q0, Z.eave), p(b1, q1, Z.eave), [e1[0], e1[1], e1[2] - 1.2], [e0[0], e0[1], e0[2] - 1.2])
  }

  // --- The main roof: grey, with the cream translucent band along the
  // inner edge on the north and east; a white edge beam round the opening.
  const RF = detail ? [0, 0.12, 0.28, 0.5, 0.75, 1] : [0, 0.28, 0.6, 1]
  for (let i = 0; i < N; i++) {
    const b0 = B(i), b1 = B(i + 1), bm = (b0 + b1) / 2
    // the cream translucent band shows on the north and east roofs only
    const northBand = bm >= 300 || bm <= 125
    for (let k = 0; k < RF.length - 1; k++) {
      const a0 = roofPt(b0, RF[k]), a1 = roofPt(b1, RF[k]), c0 = roofPt(b0, RF[k + 1]), c1 = roofPt(b1, RF[k + 1])
      const part = k === 0 && northBand ? band : roof
      oq(part, a0, c0, c1, a1, UP)
    }
    // the roof edge's fascia down to the band backing
    const e0 = roofPt(b0, 1), e1 = roofPt(b1, 1)
    const ob: V3 = [...dir(bm), 0] as V3
    oq(roof, [e0[0], e0[1], e0[2] - 1.2], [e1[0], e1[1], e1[2] - 1.2], e1, e0, ob)
    // inner edge fascia (the opening's lip)
    const o0 = roofPt(b0, 0), o1 = roofPt(b1, 0)
    oq(roof, o1, o0, [o0[0], o0[1], o0[2] - 2.2], [o1[0], o1[1], o1[2] - 2.2], [-ob[0], -ob[1], 0])
  }
  {
    const ring: V3[] = []
    for (let i = 0; i < N; i++) ring.push(add(roofPt(B(i), 0), [0, 0, 0.4]))
    tube(white, ring, detail ? 0.7 : 0.9, detail ? 5 : 3, true)
    // the band's white top chord along the roof edge
    const top: V3[] = []
    for (let i = 0; i < N; i++) top.push(add(roofPt(B(i), 1), [0, 0, 0.2]))
    tube(white, top, detail ? 0.6 : 0.8, detail ? 5 : 3, true)
  }

  // --- The perimeter band's white V-trusses: a bottom chord on the
  // concourse roof and diagonals up to the roof edge.
  {
    const NV = detail ? 120 : 60
    const bot: V3[] = []
    for (let i = 0; i < NV; i++) bot.push(at((360 * i) / NV, rRoof((360 * i) / NV) + 0.6, Z.eave + 0.7))
    tube(white, bot, detail ? 0.5 : 0.7, 3, true)
    for (let i = 0; i < NV; i++) {
      const b = (360 * i) / NV, bn = (360 * (i + 1)) / NV
      const lo = at(b, rRoof(b) + 0.6, Z.eave + 0.7)
      const hi = add(roofPt((b + bn) / 2, 1), [0, 0, -0.2])
      const lo2 = at(bn, rRoof(bn) + 0.6, Z.eave + 0.7)
      rod(white, lo, hi, detail ? 0.4 : 0.55, 3)
      rod(white, hi, lo2, detail ? 0.4 : 0.55, 3)
    }
  }

  // --- White radial trusses on the roof (east, south and west: the north
  // roof hangs from the arch): a top chord standing above the roof and a
  // Warren web.
  {
    const bearings = detail ? [75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285] : [95, 125, 152, 180, 208, 235, 265]
    for (const b of bearings) {
      const PN = detail ? 8 : 4
      const lo: V3[] = [], hi: V3[] = []
      for (let k = 0; k <= PN; k++) {
        const f = lerp(0.04, 0.96, k / PN)
        const p = roofPt(b, f)
        lo.push(add(p, [0, 0, 0.3]))
        hi.push(add(p, [0, 0, 7.5 * Math.sin(Math.PI * lerp(0.15, 0.85, k / PN)) + 1.5]))
      }
      tube(white, hi, detail ? 0.55 : 0.7, 3)
      for (let k = 0; k < PN; k++) {
        rod(white, lo[k], hi[k + 1], detail ? 0.35 : 0.5, 3)
        rod(white, hi[k], lo[k], detail ? 0.35 : 0.5, 3)
      }
      rod(white, hi[PN], lo[PN], detail ? 0.35 : 0.5, 3)
    }
  }

  // --- The seating bowl: three red tiers with dark fascias between, from
  // the pitch's edge up under the roof.
  {
    // [fraction from the pitch edge to the roof's outer edge, height]
    // three raked tiers; between them the glazed fronts of the hospitality
    // levels as dark grey bands (window: they are lit at night)
    const tiers: [number, number, 'seat' | 'face' | 'band'][] = [
      [0, Z.pitch, 'face'], [0, Z.pitch + 1.4, 'seat'], [0.25, 20, 'band'], [0.255, 25.5, 'seat'], [0.4, 32, 'band'],
      [0.405, 37.5, 'seat'], [0.97, 0, 'face'],
    ]
    for (let i = 0; i < N; i++) {
      const b0 = B(i), b1 = B(i + 1)
      const pt = (b: number, f: number, z: number) => at(b, lerp(rPitch(b), rRoof(b) - 1, f), z === 0 ? zOut(b) - 2.5 : z)
      for (let k = 0; k < tiers.length - 1; k++) {
        const [f0, z0, kind] = tiers[k], [f1, z1] = tiers[k + 1]
        const a0 = pt(b0, f0, z0), a1 = pt(b1, f0, z0), c0 = pt(b0, f1, z1), c1 = pt(b1, f1, z1)
        const [ux, uy] = dir((b0 + b1) / 2)
        oq(kind === 'seat' ? seats : kind === 'band' ? glass : roof, a1, a0, c0, c1, kind === 'seat' ? [-ux, -uy, 2] : [-ux, -uy, 0.3])
      }
      // back wall: from the top of the upper tier up to the roof's underside
      const t0 = pt(b0, 0.97, 0), t1 = pt(b1, 0.97, 0)
      const u0 = roofPt(b0, 0.985), u1 = roofPt(b1, 0.985)
      const [vx, vy] = dir((b0 + b1) / 2)
      oq(roof, t1, t0, u0, u1, [-vx, -vy, 0])
    }
  }

  // --- The arch: concrete piers, then the white tube.
  for (const [fx, sgn] of [[FOOT.x0, -1], [FOOT.x1, 1]] as const) {
    const w0 = 7, w1 = 4.6, cy = FOOT.y
    const ring = (w: number, z: number): V3[] => [[fx - w, cy - w, z], [fx + w, cy - w, z], [fx + w, cy + w, z], [fx - w, cy + w, z]]
    const r0 = ring(w0, 0), r1 = ring(w1, FOOT.z + 1)
    for (let j = 0; j < 4; j++) {
      const jj = (j + 1) % 4
      const m = [(r0[j][0] + r0[jj][0]) / 2 - fx, (r0[j][1] + r0[jj][1]) / 2 - cy, 0] as V3
      oq(roof, r0[j], r0[jj], r1[jj], r1[j], m)
    }
    oq(roof, r1[0], r1[1], r1[2], r1[3], UP)
    void sgn
  }
  const AS = detail ? 120 : 44
  const us = Array.from({ length: AS + 1 }, (_, i) => {
    // denser near the feet where the curve turns fastest
    const t = i / AS
    return -Math.cos(Math.PI * t)
  })
  const centre = us.map(archPt)
  if (!detail) {
    // A bold lattice: a solid core (it reads as the dense lattice does
    // from afar), three outer chords 4.4 m out (8.8 m across against the
    // real 7.4, so it survives at phone size), ring collars every few
    // metres and a diagonal between the chords in each bay.
    tube(white, centre, 3.0, 6)
    const fr = centre.map((c, i) => {
      const t = nrm(sub(centre[Math.min(i + 1, AS)], centre[Math.max(i - 1, 0)]))
      const side = nrm(cross(t, [0, 0, 1])), up = cross(side, t)
      return { c, t, side, up }
    })
    const ch = (i: number, k: number) => {
      const f = fr[i], a = Math.PI / 2 + (2 * Math.PI * k) / 3
      return add(f.c, add(scl(f.side, 4.4 * Math.cos(a)), scl(f.up, 4.4 * Math.sin(a))))
    }
    const idx = Array.from({ length: AS / 2 + 1 }, (_, j) => 2 * j)
    for (let k = 0; k < 3; k++) tube(white, idx.map((i) => ch(i, k)), 0.75, 3)
    for (let j = 0; j + 2 < idx.length; j += 2) {
      const i = idx[j], i2 = idx[j + 2]
      tube(white, [add(fr[i].c, scl(fr[i].t, -0.7)), add(fr[i].c, scl(fr[i].t, 0.7))], 4.9, 6)
      for (let k = 0; k < 3; k++) rod(white, ch(i, k), ch(i2, (k + 1) % 3), 0.55, 3)
    }
  } else {
    // Six chords round a 3.7 m radius, rings and diagonals.
    const frames = centre.map((c, i) => {
      const t = nrm(sub(centre[Math.min(i + 1, AS)], centre[Math.max(i - 1, 0)]))
      const side = nrm(cross(t, [0, 0, 1]))
      const up = cross(side, t)
      return { c, side, up }
    })
    const node = (i: number, k: number) => {
      const f = frames[i], a = (2 * Math.PI * k) / 6
      return add(f.c, add(scl(f.side, 3.5 * Math.cos(a)), scl(f.up, 3.5 * Math.sin(a))))
    }
    for (let k = 0; k < 6; k++) tube(white, centre.map((_, i) => node(i, k)), 0.45, 5)
    for (let i = 0; i <= AS; i += 2) {
      tube(white, Array.from({ length: 6 }, (_, k) => node(i, k)), 0.3, 4, true)
      if (i < AS) for (let k = 0; k < 6; k++) rod(white, node(i, k), node(i + 2, (k + 1) % 6), 0.22, 3)
    }
  }

  // --- Hangers from the arch to the north roof, and forestays over the
  // opening to the south roof.
  {
    const hang = detail ? [-0.82, -0.7, -0.58, -0.46, -0.34, -0.22, -0.1, 0.1, 0.22, 0.34, 0.46, 0.58, 0.7, 0.82] : [-0.72, -0.48, -0.24, 0.24, 0.48, 0.72]
    for (const u of hang) {
      const a = archPt(u)
      const b = (Math.atan2(a[0] - C[0], 120) * 180) / Math.PI
      for (const f of detail ? [0.45, 0.85] : [0.6]) rod(white, add(a, [0, 0, -3.5]), add(roofPt(b, f), [0, 0, 0.5]), detail ? 0.25 : 0.4, 3)
    }
    const fore = detail ? [-0.4, -0.25, -0.1, 0.1, 0.25, 0.4] : [-0.3, 0, 0.3]
    for (const u of fore) {
      const a = archPt(u)
      const b = 180 - (Math.atan2(a[0] - C[0], 140) * 180) / Math.PI
      rod(white, add(a, [0, 0, -3.5]), add(roofPt(b, 0.22), [0, 0, 6]), detail ? 0.25 : 0.4, 3)
    }
  }

  for (const q of [white, roof, band, clad, glass, seats]) smooth(q)
  return [
    { part: white, material: M.white },
    { part: roof, material: M.roof },
    { part: band, material: M.band },
    { part: clad, material: M.clad },
    { part: glass, material: M.glass },
    { part: seats, material: M.seats },
  ]
}

if (import.meta.main) {
  const extras = { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor' }
  for (const [detail, file] of [[false, `models/${ID}.glb`], [true, `models/${ID}.detail.glb`]] as const) {
    const parts = build(detail)
    const tris = parts.reduce((s, { part }) => s + part.triangles, 0)
    const glb = writeGlb('Wembley Stadium', parts, extras)
    writeFileSync(new URL(`../${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
