/**
 * JFK Airport Terminal 5 (JetBlue), Queens — procedural, CC0-1.0, no textures.
 * bun generators/nyc-jfk-terminal-5.ts
 *
 * Also the shared kit for the other JFK terminals of this batch
 * (nyc-jfk-terminal-1, -7, -8 import `zones`, `clip`, `annulus` and friends
 * from here). The model itself is only written when this file is run directly.
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 0: the terminal is symmetric about the east–west line of its long
 * pier. Anchor: area centroid of the OSM outline way/284907689.
 *
 * Identifying features (photos): the long crescent headhouse wrapped round
 * the TWA Flight Center, under a dark grey metal roof that rises from a tall
 * glass front over the departures curb to a crest along the airside, with a
 * clerestory under the crest; the white canopy over the curb; white flat
 * roofs behind the crest, two splayed concourse wings and a long straight
 * pier to the east, low and plain, with gate-lounge glazing.
 *
 * Evidence
 * - OSM way/284907689 (Terminal 5, tagged 13.6 m); multipolygon
 *   relation/9077350 "Terminal 5", whose outers are that way, the TWA Flight
 *   Center (way/284907419, modelled as nyc-twa-flight-center and NOT drawn or
 *   replaced here) and the Yellow Parking Garage (way/284907731), drawn here
 *   as a plain block so that every building the relation covers is drawn.
 * - Lidar: USGS 3DEP NY_NewYorkCity, flown 2017, 1 m grid, heights above
 *   the apron (taken as ground_min + 1.5 m = 3.45 m NAVD88):
 *   the crest of the hall roof is a circular arc, centre (−204.3, −57.5),
 *   radius 213.7 m (fit to 20 crest points, residual < 0.8 m), at 18 m; the
 *   roof falls to 14 m at the glass front, radius 189 m; a 10.3 m canopy
 *   runs out from there to radius 181 m over the curb; the departures deck
 *   and the arrivals level under it stand at 5.3 m; behind the crest a flat
 *   roof at 14 m reaches the concourses in a lens; the concourse wings and
 *   the pier at 11.3 m; the garage at 20 m. The AirTrain guideway (21 m)
 *   crosses the north end of the hall and is left out.
 * - Published: opened October 22, 2008, Gensler; 26 gates at opening
 *   (Wikipedia, "JFK Airport Terminal 5").
 * - Photos (Wikimedia Commons):
 *   https://commons.wikimedia.org/wiki/File:JFK_Terminal_5_aerial_view.jpg
 *     (Quintin Soloviev, CC BY 4.0) the plan, the dark hall roof, white roofs;
 *   https://commons.wikimedia.org/wiki/File:View_from_Pool_Deck,_TWA_Hotel,_John_F._Kennedy_International_Airport,_Jamaica,_Queens,_New_York_City,_NY_-_48581250157.jpg
 *     (w_lemay, CC0) the landside front: roof, glass band, canopy, deck;
 *   https://commons.wikimedia.org/wiki/File:View_from_Pool_Deck,_TWA_Hotel,_John_F._Kennedy_International_Airport,_Jamaica,_Queens,_New_York_City,_NY_-_48581109591.jpg
 *     (w_lemay, CC0) the front from the north, the deck;
 *   https://commons.wikimedia.org/wiki/File:View_from_Pool_Deck,_TWA_Hotel,_John_F._Kennedy_International_Airport,_Jamaica,_Queens,_New_York_City,_NY.jpg
 *     (w_lemay, CC0) the north end;
 *   https://commons.wikimedia.org/wiki/File:JetBlue_Terminal_5_ramp_NY1.jpg
 *     (Acroterion, CC BY-SA 4.0) the airside walls;
 *   https://commons.wikimedia.org/wiki/File:2022_JetBlue_Terminal_5_JFK_Airport_3.jpg
 *     (Beyond My Ken, CC BY-SA 4.0) inside the hall: the front glazing;
 *   https://commons.wikimedia.org/wiki/File:JFK_T5_May_2019_12.jpg
 *     (Epicgenius, CC BY-SA 4.0) the garage side.
 * - Look-only: https://commons.wikimedia.org/wiki/File:New_York_-_John_F._Kennedy_International_(Idlewild)_(JFK_-_KJFK)_AN0205771.jpg
 *   (Konstantin von Wedelstaedt, GFDL 1.2) the hall roof under construction.
 *
 * Estimated: the clerestory under the crest (a glazed band, from the
 * aerial's light strip along the crest); the window bands' heights; the
 * canopy's thickness. The lens of the 14 m roof is drawn as a circle through
 * three points read off the lidar. Rooftop plant is left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import pc from 'polygon-clipping'
import { type XY, area, prism, inside, facade, finishModel, capPoly, quadN, unit, insetRing, type Facade } from './nyc-570-lexington'

// ===========================================================================
// Shared kit for the JFK terminals
// ===========================================================================

type Poly = XY[][] // outer ring first, then holes (polygon-clipping's Polygon without closing points)
const close = (r: XY[]): [number, number][] => [...r, r[0]] as [number, number][]
const open = (r: [number, number][]): XY[] => r.slice(0, -1) as XY[]
export const ccw = (r: XY[]) => (area(r) < 0 ? r.slice().reverse() : r)

/** Boolean operations on rings; results as lists of rings (holes dropped, flagged). */
export function clip(op: 'intersection' | 'difference' | 'union', a: XY[][], ...b: XY[][][]): XY[][] {
  const A = a.map((r) => [close(r)])
  const B = b.map((s) => s.map((r) => [close(r)]))
  const res = (pc as any)[op](A, ...B) as [number, number][][][]
  const out: XY[][] = []
  for (const poly of res) {
    if (poly.length > 1) console.warn(`clip: dropped ${poly.length - 1} hole(s)`)
    out.push(ccw(open(poly[0])))
  }
  return out
}

/** A circle as a ring, vertices at multiples of `step` radians so arcs line up between shapes. */
export function circleRing(c: XY, r: number, step: number): XY[] {
  const n = Math.round((2 * Math.PI) / step)
  return Array.from({ length: n }, (_, k) => [c[0] + r * Math.cos(k * step), c[1] + r * Math.sin(k * step)] as XY)
}
/** Annular sector r0..r1, angles t0..t1 (radians), as one ring. */
export function annulus(c: XY, r0: number, r1: number, t0: number, t1: number, step: number): XY[] {
  const n = Math.max(1, Math.round((t1 - t0) / step))
  const outer: XY[] = [], inner: XY[] = []
  for (let k = 0; k <= n; k++) {
    const t = t0 + ((t1 - t0) * k) / n
    outer.push([c[0] + r1 * Math.cos(t), c[1] + r1 * Math.sin(t)])
    inner.push([c[0] + r0 * Math.cos(t), c[1] + r0 * Math.sin(t)])
  }
  return ccw([...outer, ...inner.reverse()])
}

/**
 * Subtract `holes` from `rings`, splitting any piece that would come out with
 * a hole (zones() draws simple rings only) along a vertical line through it.
 */
export function minusHoles(rings: XY[][], holes: XY[][]): XY[][] {
  let out = rings
  for (const h of holes) {
    const cx = h.reduce((s, p) => s + p[0], 0) / h.length
    const next: XY[][] = []
    for (const r of out) {
      const hit = h.every((p) => inside(p, r))
      if (!hit) { next.push(...clip('difference', [r], [h])); continue }
      const ys = r.map((p) => p[1]), lo = Math.min(...ys) - 1, hi = Math.max(...ys) + 1
      const xs = r.map((p) => p[0]), xl = Math.min(...xs) - 1, xh = Math.max(...xs) + 1
      next.push(...clip('difference', clip('intersection', [r], [[[xl, lo], [cx, lo], [cx, hi], [xl, hi]]]), [h]))
      next.push(...clip('difference', clip('intersection', [r], [[[cx, lo], [xh, lo], [xh, hi], [cx, hi]]]), [h]))
    }
    out = next
  }
  return out
}

/** Distance from p to segment ab. */
export function segDist(p: XY, a: XY, b: XY) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy
  const t = L2 ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L2)) : 0
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy)
}
/** Is edge ab on the boundary of `ring` (its midpoint within tol of one of the ring's edges)? */
export function onBoundary(a: XY, b: XY, rings: XY[][], tol = 0.15) {
  const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  return rings.some((r) => r.some((p, i) => segDist(m, p, r[(i + 1) % r.length]) < tol))
}

export type Zone = { rings: XY[][]; z: number; facade: Facade | null; wall?: Part; roof?: Part; bevel?: number }
/**
 * Flat-roofed zones that share walls: each edge is drawn only from the
 * height of whatever stands beyond it (`heightAt`, 0 outside the building)
 * up to the zone's roof, so no wall is buried inside a neighbour. Windows
 * only on edges lying on `exterior` (the OSM outline) and only below the
 * neighbour-free part. A bevelled coping lip runs round every roof edge.
 */
export function zones(o: { wall: Part; win: Part; roof: Part; coping?: Part; exterior: XY[][]; list: Zone[]; heightAt?: (p: XY) => number }) {
  const UP: V3 = [0, 0, 1]
  const others = (p: XY, self: XY[]) => {
    let h = 0
    for (const zn of o.list) for (const ring of zn.rings) if (ring !== self && inside(p, ring)) h = Math.max(h, zn.z)
    return Math.max(h, o.heightAt ? o.heightAt(p) : 0)
  }
  for (const zn of o.list) for (const raw of zn.rings) {
    if (Math.abs(area(raw)) < 4) continue
    const ring = ccw(raw)
    const bevel = zn.bevel ?? 0.45
    const inner = insetRing(ring, bevel)
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 1e-3) continue
      const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
      const m: XY = [(a[0] + b[0]) / 2 + n[0] * 0.3, (a[1] + b[1]) / 2 + n[1] * 0.3]
      const zb = others(m, raw)
      if (zb >= zn.z - 0.05) continue
      const ext = onBoundary(a, b, o.exterior)
      facade(zn.wall ?? o.wall, o.win, a, b, zb, zn.z - bevel, ext && zb < 0.01 ? zn.facade : null)
      const nu = unit([n[0], n[1], 0.25])
      const ia = inner[i], ib = inner[(i + 1) % ring.length]
      quadN(o.coping ?? zn.wall ?? o.wall, [a[0], a[1], zn.z - bevel], [b[0], b[1], zn.z - bevel], [ib[0], ib[1], zn.z], [ia[0], ia[1], zn.z], [nu, nu, UP, UP])
    }
    capPoly(zn.roof ?? o.roof, inner, zn.z)
  }
}

/** Triangulate a ring and lift each vertex to z(x, y); upward faces. Keep pieces small for curved z. */
export function liftedCap(p: Part, ring: XY[], z: (q: XY) => number) {
  const tmp = new Part()
  capPoly(tmp, ring, 0)
  const pos = tmp.pos // glTF frame: (x, z, −y)
  for (let i = 0; i < pos.length; i += 9) {
    const t: V3[] = [0, 1, 2].map((k) => [pos[i + 3 * k], -pos[i + 3 * k + 2], 0] as V3)
    for (const v of t) v[2] = z([v[0], v[1]])
    p.tri(t[0], t[1], t[2])
  }
}

/** A wall from a to b whose foot is at z0 and whose top follows z(q); outward for ccw a→b. */
export function wallTo(p: Part, a: XY, b: XY, z0: number, za: number, zb: number) {
  if (za <= z0 + 1e-3 && zb <= z0 + 1e-3) return
  p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], zb], [a[0], a[1], za])
}

/** Axis-aligned rectangle as a ccw ring. */
export const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/**
 * A zone with a curved roof z(q): the roof sliced into bands along `axis`
 * (so each triangle's vertices sit on band lines and z, linear in that axis
 * within a band, is exact), walls under every edge from whatever stands
 * beyond (`heightAt`) up to the roof, a pale fascia along the roof edge,
 * and windows (`facade`) on outline edges.
 */
export function slopedZone(o: {
  roof: Part; wall: Part; win: Part | null; fascia?: Part; ring: XY[]; z: (q: XY) => number
  axis: 0 | 1; step: number; heightAt: (q: XY) => number; exterior: XY[][]; facade?: (a: XY, b: XY) => Facade | null
}) {
  const ring = ccw(o.ring)
  const lo = Math.min(...ring.map((p) => p[o.axis])), hi = Math.max(...ring.map((p) => p[o.axis]))
  const other = 1 - o.axis
  const olo = Math.min(...ring.map((p) => p[other])) - 1, ohi = Math.max(...ring.map((p) => p[other])) + 1
  const cuts: number[] = []
  for (let v = lo; v < hi - 1e-6; v += o.step) cuts.push(v)
  cuts.push(hi)
  for (let k = 0; k < cuts.length - 1; k++) {
    const band = o.axis === 0 ? rect(cuts[k], olo, cuts[k + 1], ohi) : rect(olo, cuts[k], ohi, cuts[k + 1])
    for (const piece of clip('intersection', [ring], [band])) liftedCap(o.roof, piece, o.z)
  }
  const scratch = new Part()
  for (let i = 0; i < ring.length; i++) {
    const A = ring[i], B = ring[(i + 1) % ring.length]
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]); if (L < 1e-3) continue
    const n: XY = [(B[1] - A[1]) / L, -(B[0] - A[0]) / L]
    // break the edge where it crosses band lines
    const ts = [0, 1]
    for (const c of cuts) { const d = B[o.axis] - A[o.axis]; if (Math.abs(d) > 1e-9) { const t = (c - A[o.axis]) / d; if (t > 1e-4 && t < 1 - 1e-4) ts.push(t) } }
    ts.sort((x, y) => x - y)
    const ext = onBoundary(A, B, o.exterior)
    const f = ext && o.facade ? o.facade(A, B) : null
    for (let j = 0; j < ts.length - 1; j++) {
      const a: XY = [A[0] + (B[0] - A[0]) * ts[j], A[1] + (B[1] - A[1]) * ts[j]]
      const b: XY = [A[0] + (B[0] - A[0]) * ts[j + 1], A[1] + (B[1] - A[1]) * ts[j + 1]]
      const m: XY = [(a[0] + b[0]) / 2 + n[0] * 0.3, (a[1] + b[1]) / 2 + n[1] * 0.3]
      const base = o.heightAt(m), za = o.z(a), zb = o.z(b)
      if (base >= Math.min(za, zb) - 0.05) continue
      wallTo(o.wall, a, b, base, za, zb)
      if (f && o.win) facade(scratch, o.win, a, b, base, Math.min(za, zb), f)
      if (o.fascia) {
        const d = 0.1
        o.fascia.quad([a[0] + n[0] * d, a[1] + n[1] * d, za - 1.1], [b[0] + n[0] * d, b[1] + n[1] * d, zb - 1.1], [b[0] + n[0] * d, b[1] + n[1] * d, zb + 0.12], [a[0] + n[0] * d, a[1] + n[1] * d, za + 0.12])
      }
    }
  }
}

/** Piecewise-linear interpolation through [t, value] pairs (sorted by t). */
export function pwl(pts: [number, number][]) {
  return (t: number) => {
    if (t <= pts[0][0]) return pts[0][1]
    for (let i = 0; i < pts.length - 1; i++) if (t <= pts[i + 1][0]) {
      const [t0, v0] = pts[i], [t1, v1] = pts[i + 1]
      return v0 + ((v1 - v0) * (t - t0)) / (t1 - t0)
    }
    return pts[pts.length - 1][1]
  }
}

export { type XY, type Facade }

// ===========================================================================
// Terminal 5
// ===========================================================================

const OUTLINE: XY[] = ccw([[-61.0, -111.4], [-60.1, -109.1], [-59.0, -106.1], [-57.1, -99.2], [-54.5, -90.2], [-52.6, -80.0], [-51.5, -71.5], [-51.1, -60.8], [-51.4, -46.8], [-52.4, -36.1], [-54.1, -26.2], [-57.0, -15.4], [-59.9, -6.4], [-63.0, 2.3], [-66.9, 10.2], [-71.0, 17.6], [-75.1, 24.2], [-76.6, 26.9], [-77.7, 29.0], [-82.3, 36.3], [-74.1, 42.6], [-82.0, 52.4], [-74.5, 60.2], [-70.3, 57.2], [-71.4, 58.8], [-75.8, 63.2], [-76.9, 62.6], [-83.7, 69.1], [-90.4, 74.6], [-98.0, 80.1], [-106.8, 85.6], [-116.1, 90.6], [-121.1, 80.2], [-128.4, 83.7], [-136.4, 86.5], [-145.1, 89.2], [-156.0, 91.5], [-154.7, 97.8], [-150.9, 116.1], [-156.7, 117.5], [-156.5, 118.9], [-165.7, 120.2], [-164.3, 134.0], [-173.0, 134.6], [-182.4, 134.7], [-193.3, 134.0], [-205.9, 132.3], [-215.3, 130.5], [-227.1, 127.5], [-238.5, 123.7], [-246.1, 120.3], [-247.5, 123.8], [-249.7, 123.7], [-248.8, 122.4], [-250.8, 124.1], [-254.6, 127.4], [-252.4, 128.6], [-248.3, 130.4], [-243.8, 132.3], [-236.5, 135.0], [-230.7, 136.8], [-224.3, 138.6], [-216.7, 140.3], [-205.9, 142.3], [-197.7, 143.5], [-193.9, 143.9], [-217.9, 157.9], [-208.8, 173.1], [-217.5, 178.5], [-209.7, 191.5], [-206.4, 197.0], [-217.6, 203.7], [-214.3, 209.1], [-209.8, 206.4], [-189.2, 194.3], [-188.0, 196.2], [-183.3, 193.4], [-184.5, 191.3], [-180.0, 188.8], [-138.9, 164.2], [-134.8, 161.7], [-137.4, 157.4], [-135.3, 156.1], [-115.5, 144.3], [-112.5, 149.0], [-108.6, 146.7], [-67.7, 122.4], [-59.1, 117.3], [-62.5, 112.6], [-52.7, 104.9], [94.4, -13.0], [104.3, -20.9], [106.4, -21.1], [146.7, -21.5], [188.0, -21.9], [229.6, -22.3], [270.8, -22.7], [324.8, -23.2], [324.7, -25.7], [324.7, -28.5], [324.2, -51.9], [321.9, -52.0], [286.4, -51.6], [240.8, -51.0], [200.4, -50.6], [158.6, -50.1], [113.7, -49.6], [106.1, -49.5], [102.8, -49.5], [60.9, -101.5], [57.0, -106.3], [26.9, -143.8], [13.2, -160.8], [3.6, -172.7], [2.0, -174.7], [-0.3, -172.8], [-16.2, -160.0], [-22.3, -155.5], [-23.4, -154.7], [-24.5, -153.4], [-31.1, -149.9], [-32.1, -151.5], [-44.7, -145.5], [-46.5, -145.7], [-61.1, -137.5], [-56.3, -128.4], [-52.7, -120.4], [-56.3, -118.9], [-59.5, -125.1], [-65.8, -122.0]])
// The Yellow Parking Garage (way/284907731), same frame.
const GARAGE: XY[] = ccw([[-271.0, 7.9], [-276.7, 0.6], [-282.0, -6.3], [-261.1, -23.3], [-272.9, -37.7], [-262.1, -46.2], [-281.7, -70.7], [-288.7, -79.3], [-290.3, -81.5], [-299.3, -74.4], [-333.8, -47.1], [-328.7, -39.7], [-344.1, -27.3], [-334.9, -15.9], [-327.1, -6.1], [-369.7, 28.0], [-363.7, 35.7], [-405.9, 69.8], [-387.0, 93.8], [-382.8, 97.7], [-316.5, 45.5], [-314.7, 44.1], [-313.9, 43.5], [-311.4, 41.5], [-293.4, 26.8], [-280.5, 16.0]])

const C: XY = [-204.3, -57.5] // centre of the headhouse's arcs (lidar)
const R_CANOPY = 181, R_GLASS = 189, R_CREST = 213.7
const Z_DECK = 5.3, Z_CANOPY = 10.3, Z_EAVE = 14, Z_CREST = 18, Z_BACK = 14, Z_LOW = 11.3, Z_GARAGE = 20
const STEP = (2.5 * Math.PI) / 180

function circle3(a: XY, b: XY, c: XY): [XY, number] {
  const d = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]))
  const s = (p: XY) => p[0] * p[0] + p[1] * p[1]
  const ux = (s(a) * (b[1] - c[1]) + s(b) * (c[1] - a[1]) + s(c) * (a[1] - b[1])) / d
  const uy = (s(a) * (c[0] - b[0]) + s(b) * (a[0] - c[0]) + s(c) * (b[0] - a[0])) / d
  return [[ux, uy], Math.hypot(a[0] - ux, a[1] - uy)]
}

function build() {
  const panel = new Part(), win = new Part(), roof = new Part(), hall = new Part(), deck = new Part(), trim = new Part()
  const r = (q: XY) => Math.hypot(q[0] - C[0], q[1] - C[1])
  const ext = [OUTLINE]

  // The hall's angular range: where the whole band (glass to crest) lies inside the outline.
  let t0 = Infinity, t1 = -Infinity
  for (let k = -180; k <= 240; k++) {
    const t = (k * 0.5 * Math.PI) / 180
    const ok = [R_GLASS + 0.5, 201, R_CREST - 0.5].every((rr) => inside([C[0] + rr * Math.cos(t), C[1] + rr * Math.sin(t)], OUTLINE))
    if (ok && t < 1.6) { t0 = Math.min(t0, t); t1 = Math.max(t1, t) }
  }
  const hallBand = annulus(C, R_GLASS, R_CREST, t0, t1, (t1 - t0) / Math.max(1, Math.round((t1 - t0) / STEP)))
  const discGlass = circleRing(C, R_GLASS, STEP), discCrest = circleRing(C, R_CREST, STEP)
  const [LC, LR] = circle3([-10, -148], [62, -22], [-12, 45])
  const lens = clip('difference', [circleRing(LC, LR, STEP)], [discCrest])

  const front = clip('intersection', [OUTLINE], [discGlass])
  const back = clip('intersection', [OUTLINE], lens)
  const rest = [...clip('difference', [OUTLINE], [discCrest], lens), ...clip('difference', clip('intersection', [OUTLINE], [discCrest]), [discGlass], [hallBand])]

  const lowFacade: Facade = { bay: 9, ratio: 0.82, floor: 5, group: 1, spandrel: 0, sill: 4.2, head: 1.4, ground: 4.2, minLength: 6 }
  const deckFacade: Facade = { bay: 8, ratio: 0.7, floor: 3, group: 1, spandrel: 0, sill: 1.0, head: 0.9, ground: 1.0, minLength: 6 }
  const zHall0 = (q: XY) => Z_EAVE + ((Z_CREST - Z_EAVE) * (r(q) - R_GLASS)) / (R_CREST - R_GLASS)
  zones({
    wall: panel, win, roof, coping: trim, exterior: ext, heightAt: (q) => (inside(q, hallBand) ? zHall0(q) : 0), list: [
      { rings: front, z: Z_DECK, facade: deckFacade, roof: deck, bevel: 0.3 },
      { rings: back, z: Z_BACK, facade: lowFacade },
      { rings: rest, z: Z_LOW, facade: lowFacade },
    ],
  })

  // --- The great hall: a sloped roof between the glass front and the crest ---
  const zHall = (q: XY) => Z_EAVE + ((Z_CREST - Z_EAVE) * (r(q) - R_GLASS)) / (R_CREST - R_GLASS)
  const n = Math.max(1, Math.round((t1 - t0) / STEP)), dt = (t1 - t0) / n
  for (let k = 0; k < n; k++) {
    const a = t0 + k * dt, b = a + dt
    // the sloped roof: radial strips so z (linear in radius) stays exact
    const P = (rr: number, t: number): V3 => { const q: XY = [C[0] + rr * Math.cos(t), C[1] + rr * Math.sin(t)]; return [q[0], q[1], zHall(q)] }
    const nr = 3
    for (let j = 0; j < nr; j++) {
      const r0 = R_GLASS + ((R_CREST - R_GLASS) * j) / nr, r1 = R_GLASS + ((R_CREST - R_GLASS) * (j + 1)) / nr
      hall.quad(P(r0, a), P(r1, a), P(r1, b), P(r0, b))
    }
    // the two radial end walls, from the ground up to the roof
    for (const [t, s] of [[t0, -1], [t1, 1]] as [number, number][]) {
      if (Math.abs((s < 0 ? a : b) - t) > 1e-9) continue
      const g = P(R_GLASS, t), c = P(R_CREST, t)
      const A: XY = [g[0], g[1]], B: XY = [c[0], c[1]]
      if (s > 0) wallTo(panel, B, A, 0, c[2], g[2]); else wallTo(panel, A, B, 0, g[2], c[2])
    }
    // The glass front at R_GLASS (deck → eave) and the clerestory under the crest.
    const pa: XY = [C[0] + R_GLASS * Math.cos(a), C[1] + R_GLASS * Math.sin(a)], pb: XY = [C[0] + R_GLASS * Math.cos(b), C[1] + R_GLASS * Math.sin(b)]
    const ca: XY = [C[0] + R_CREST * Math.cos(a), C[1] + R_CREST * Math.sin(a)], cb: XY = [C[0] + R_CREST * Math.cos(b), C[1] + R_CREST * Math.sin(b)]
    const mG: XY = [(pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2], mC: XY = [(ca[0] + cb[0]) / 2, (ca[1] + cb[1]) / 2]
    if (inside(mG, OUTLINE)) {
      // faces inward to the centre (the landside): run b → a
      const nA = unit([C[0] - pa[0], C[1] - pa[1], 0]), nB = unit([C[0] - pb[0], C[1] - pb[1], 0])
      facade(panel, win, pb, pa, Z_DECK, Z_EAVE, { bay: 8, ratio: 0.9, floor: 7, group: 1, spandrel: 0, sill: 0.5, head: 0.7, minLength: 2 }, nB, nA)
      // the canopy over the curb, R_CANOPY…R_GLASS
      const qa: XY = [C[0] + R_CANOPY * Math.cos(a), C[1] + R_CANOPY * Math.sin(a)], qb: XY = [C[0] + R_CANOPY * Math.cos(b), C[1] + R_CANOPY * Math.sin(b)]
      if (inside([(qa[0] + qb[0]) / 2, (qa[1] + qb[1]) / 2], OUTLINE)) {
        const z1 = Z_CANOPY, z0 = Z_CANOPY - 0.7
        // top (up), soffit (down), and the free edge facing the centre; (b−a)×(c−a) checked for each
        trim.quad([qa[0], qa[1], z1], [pa[0], pa[1], z1], [pb[0], pb[1], z1], [qb[0], qb[1], z1])
        trim.quad([qa[0], qa[1], z0], [qb[0], qb[1], z0], [pb[0], pb[1], z0], [pa[0], pa[1], z0])
        trim.quad([qb[0], qb[1], z0], [qa[0], qa[1], z0], [qa[0], qa[1], z1], [qb[0], qb[1], z1])
      }
    }
    if (inside(mC, OUTLINE)) {
      // the crest wall faces outward (airside): run a → b on the larger circle
      facade(panel, win, ca, cb, Z_LOW, Z_CREST, { bay: 9.3, ratio: 0.88, floor: 3, group: 1, spandrel: 0, sill: 3.0, head: 0.5, minLength: 2 })
      // a pale lip along the crest
      const o = 0.6
      const ua = unit([ca[0] - C[0], ca[1] - C[1], 0]), ub = unit([cb[0] - C[0], cb[1] - C[1], 0])
      trim.quad([ca[0] + ua[0] * 0.1, ca[1] + ua[1] * 0.1, Z_CREST - o], [cb[0] + ub[0] * 0.1, cb[1] + ub[1] * 0.1, Z_CREST - o], [cb[0] + ub[0] * 0.1, cb[1] + ub[1] * 0.1, Z_CREST + 0.05], [ca[0] + ua[0] * 0.1, ca[1] + ua[1] * 0.1, Z_CREST + 0.05])
    }
  }

  // --- Rooftop plant on the 14 m roof behind the crest (lidar: a row of boxes ~4 m tall at r ≈ 243) ---
  for (const deg of [-12, -6, 0, 6, 12, 18, 24, 30]) {
    const t = (deg * Math.PI) / 180, rr = 243
    const cx = C[0] + rr * Math.cos(t), cy = C[1] + rr * Math.sin(t)
    const u: XY = [Math.cos(t), Math.sin(t)], v: XY = [-Math.sin(t), Math.cos(t)]
    const box: XY[] = [[-3, -5], [3, -5], [3, 5], [-3, 5]].map(([a, b]) => [cx + u[0] * a + v[0] * b, cy + u[1] * a + v[1] * b] as XY)
    if (!box.every((q) => back.some((ring) => inside(q, ring)))) continue
    prism({ wall: panel, win: null, roof, ring: box, z0: Z_BACK - 0.2, z1: Z_BACK + 3.8, facade: null, bevel: 0.3 })
  }

  // --- The Yellow Parking Garage (part of OSM's Terminal 5 relation): a plain block ---
  prism({ wall: panel, win: null, roof: deck, coping: trim, ring: GARAGE, z0: 0, z1: Z_GARAGE, facade: null, bevel: 0.45 })
  {
    // its open storeys as broad recessed-looking bands, grouped two storeys each
    const g = ccw(GARAGE)
    for (let i = 0; i < g.length; i++) {
      const a = g[i], b = g[(i + 1) % g.length]
      if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 10) continue
      facade(new Part(), deck, a, b, 0, Z_GARAGE - 0.45, { bay: 14, ratio: 0.9, floor: 3.2, group: 2, spandrel: 1.4, sill: 1.6, head: 1.5, ground: 3.2, minLength: 10 })
    }
  }

  finishModel('JFK Airport Terminal 5', 'nyc-jfk-terminal-5', [
    { part: panel, material: finish('t5-panel', 0xd3d6d7) },
    { part: win, material: PALETTE.window },
    { part: roof, material: finish('t5-roof', 0xe6e7e4) },
    { part: hall, material: finish('t5-hall-roof', 0x7a828b) },
    { part: deck, material: PALETTE.roof },
    { part: trim, material: PALETTE.trim },
  ], { bearing: 0, osm: 'way/284907689', height: Z_CREST }, 6500)
}

if (import.meta.main) build()
