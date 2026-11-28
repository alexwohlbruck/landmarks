/**
 * Lord's Cricket Ground, St John's Wood, London: original procedural
 * geometry, CC0-1.0, no textures.  bun generators/london-lords.ts
 *
 * Writes models/london-lords.glb (<= 6,500 triangles) and
 * models/london-lords.detail.glb (drawn from zoom 16): the same stands with
 * stepped tiers, the Grand Stand's bowstring truss in full and finer curves.
 * Uses the kit exported by melbourne-mcg.ts (merge that first).
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 54: model +y
 * runs from the Pavilion (Pavilion End, south-west) to the Media Centre
 * (Nursery End, north-east), along the square's straight sides. Anchor =
 * the area centroid of the outfield, OSM way/19790003 (leisure=pitch),
 * lng -0.1727891, lat 51.5294531.
 *
 * Identity, in order: separate stands round a big rounded-square outfield,
 * not a bowl; the Victorian Pavilion (1890, red brick, two end towers with
 * pyramid roofs, white-railed balconies and a pale canopy over the top
 * deck); the Media Centre (1999), a white aluminium pod with a glazed front
 * band on two round white legs; the Mound Stand's row of white PVC tents on masts
 * over a brick base; the Compton and Edrich Stands (2021) with their curved
 * shell roofs, white edge and timber underside; the Warner Stand's timber
 * cantilever; the Grand Stand with its bowstring roof truss and mast; four
 * white floodlight masts; white seats all round.
 *
 * Evidence
 *  - OSM (measured in this frame; no heights are tagged): Lord's Pavilion
 *    way/429408675 (Q6678854), Warner Stand way/429408677, Grand Stand
 *    way/429408672 (Q119444071), Compton Stand way/429408670, Lord's Media
 *    Centre way/224810338 (Q6678851), Edrich Stand way/429408671, Mound
 *    Stand way/429408674 (Q119444016), Tavern Stand way/429408676, Allen
 *    Stand way/429408669; floodlight masts nodes 9787015100-9787015103
 *    (man_made=mast, tower:type=lighting). The site is leisure=stadium
 *    relation/9653407 (Q331613). The outlines are embedded below (POLY).
 *  - Published (en.wikipedia "Lord's", "Lord's Media Centre", "Pavilion
 *    (Lord's)"): Pavilion 1889-90 by Thomas Verity; Mound Stand 1987
 *    (Michael Hopkins, tent roof); Grand Stand 1998 (Nicholas Grimshaw);
 *    Media Centre 1999 (Future Systems), aluminium monocoque, raised about
 *    15 m above the ground on two concrete legs, about 40 m long; Warner
 *    Stand 2017 (Populous); Compton and Edrich Stands 2021 (WilkinsonEyre).
 *  - Heights, all ESTIMATED by photo scaling (no lidar outside the US):
 *    Pavilion body 16-19 m, towers 22 m to the cornice and 30 m to the
 *    roof's tip (p120, p142, p73, against people and 3.5 m storeys);
 *    Compton and Edrich upper tier to 20 m, roof front edge curling down to 15 m at
 *    both ends, peaking at 27.5 m near the Media Centre end and falling to
 *    23 m towards the outer end; its leading 4 m lifts at 45 deg and the
 *    shell then slopes 1.6 m down to the back (p97, p115, p117); Media Centre pod 19.4-29.4 m
 *    (p46, p58, p117: its top just above the Compton and Edrich roofs); Warner roof 21 m (p74); Grand Stand roof 23 m, mast
 *    42 m (p42); Mound Stand upper deck 9-15 m, tent peaks 25.5 m (p135);
 *    Tavern 17 m, Allen 13 m (p135, p114); floodlights 44 m (p74, p97).
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *
 *    - p73: John Sutton, "Lord's, the changed view from the Compton Stand -
 *      geograph.org.uk - 7172939.jpg", CC BY-SA 2.0: the Pavilion square on.
 *    - p120: Yorkspotter, "Lords-Cricket-Ground-Pavilion-06-08-2017.jpg",
 *      CC BY-SA 4.0: the Pavilion from the field.
 *    - p142: PaddyBriggs, "The Pavilion - Lord's Cricket Ground.JPG",
 *      CC BY-SA 3.0: the Pavilion and its north tower at an angle.
 *    - p97: Spike 'em, "Lords Compton Stand Oct 2021.jpg", CC BY-SA 4.0.
 *    - p115: Spike 'em, "Lords Edrich Stand Oct 2021.jpg", CC BY-SA 4.0.
 *    - p117: Spike 'em, "Lords Nursery End Oct 202.jpg", CC BY-SA 4.0: the
 *      Compton and Edrich roofs either side of the Media Centre.
 *    - p61: John Sutton, "Lord's, a view from the Warner Stand -
 *      geograph.org.uk - 7462550.jpg", CC BY-SA 2.0: the Nursery End.
 *    - p74: John Sutton, "Lord's, the new Warner Stand - geograph.org.uk -
 *      5448306.jpg", CC BY-SA 2.0: Warner Stand roof, a floodlight.
 *    - p135: Paul Gillett, "Tavern Stand and Mound Stand, Lord's -
 *      geograph.org.uk - 3430213.jpg", CC BY-SA 2.0: the Mound tents.
 *    - p42: John Sutton, "Lord's Cricket Ground, The Grandstand -
 *      geograph.org.uk - 3934871.jpg", CC BY-SA 2.0: the bowstring and mast.
 *    - p46: PaddyBriggs, "Lord's Media Centre.jpg", Public domain.
 *    - p58: John Sutton, "Lord's, The Nursery End before the Final -
 *      geograph.org.uk - 3664475.jpg", CC BY-SA 2.0: the Media Centre's
 *      legs and stairs from behind.
 *    - p33: Paul Gillett, "J P Morgan Media Centre, Lord's -
 *      geograph.org.uk - 3430380.jpg", CC BY-SA 2.0: the pod's underside.
 *    - p114: Shryta234, "Lords Cricket Ground.jpg", CC BY-SA 4.0.
 *    (Each is on Commons under its file name: https://commons.wikimedia.org/wiki/File:<name>.)
 *    - p105: Gareth Williams, "Lords Cricket Ground, June 2011.jpg",
 *      CC BY 2.0, panorama (before the Warner, Compton, Edrich rebuilds).
 *  No lidar, NAIP or aerial photo; no commercial imagery.
 *
 * Elevation 0, y = 0 at the lowest ground (the east, Mound and Tavern
 * side). The ground's famous slope (published about 2.5 m, north-west to
 * south-east) reads on Mapterhorn (z15) as 1.9 - 0.021 x metres in this
 * frame (3.8 m at the Grand Stand, 0 behind the Mound Stand): every point
 * above the ground is lifted by it (function slope), the feet stay at
 * y = 0 and sink into the higher west side.
 *
 * Invented or simplified, and doubts:
 *  - Each stand is one cross-section lofted along its OSM outline; tier
 *    splits and box bands are estimated from the photos. The Nursery End
 *    lower seating in front of the Media Centre (outside every OSM stand)
 *    is left to the map.
 *  - The Pavilion is drawn as a brick body with its front balconies,
 *    five arched Long Room windows, the top canopy and the two towers;
 *    its rear (OSM way/694766205 and the Middlesex office) is not modelled.
 *  - Mound Stand: twelve small tents (the real roof's peaks, evenly spaced).
 *  - The floodlights are drawn raised (they retract when not in use).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { face, vadd, vlerp, vmul, vsub } from './seoul-world-cup-stadium'
import { triangulate } from './chi-aon-center'
import { RAD, bar, cyl, loftSections, obox, tier, writeLods, type Sec } from './melbourne-mcg'

type XY = [number, number]
const BEARING = 54

/** OSM outlines in this frame. */
const POLY: Record<string, XY[]> = {
  PAV: [[31.0, -107.3], [23.0, -107.4], [23.0, -103.2], [13.9, -103.3], [13.8, -101.2], [-10.2, -101.5], [-10.2, -103.7], [-15.4, -103.7], [-15.3, -109.9], [-26.4, -110.0], [-26.5, -103.4], [-35.8, -103.6], [-35.9, -100.4], [-36.0, -78.5], [31.0, -77.8]],
  WAR: [[-36.0, -78.5], [-35.9, -100.4], [-41.8, -100.4], [-41.9, -96.5], [-68.4, -96.4], [-74.6, -93.7], [-80.5, -93.9], [-82.0, -87.7], [-85.8, -80.5], [-86.2, -49.7], [-63.6, -49.2], [-63.5, -52.5], [-63.1, -54.8], [-62.3, -58.2], [-61.1, -60.6], [-59.7, -63.1], [-58.4, -65.1], [-56.8, -67.2], [-54.8, -69.4], [-52.4, -71.4], [-49.4, -73.4], [-46.5, -74.5], [-43.3, -75.3], [-40.5, -75.8], [-36.1, -75.9]],
  GRA: [[-86.2, -49.7], [-87.9, 50.8], [-80.4, 51.0], [-65.3, 51.3], [-65.3, 48.4], [-63.6, -49.2]],
  COM: [[-80.4, 51.0], [-80.1, 55.9], [-79.3, 61.3], [-78.3, 64.9], [-76.8, 70.7], [-86.4, 75.3], [-85.0, 81.0], [-82.2, 85.0], [-79.1, 89.5], [-75.3, 92.9], [-79.3, 100.8], [-74.5, 105.3], [-67.9, 109.8], [-59.4, 112.7], [-51.9, 115.2], [-46.5, 115.5], [-31.2, 116.6], [-25.3, 112.9], [-25.5, 107.1], [-20.1, 104.9], [-21.8, 101.3], [-22.9, 97.2], [-23.1, 94.0], [-22.4, 92.5], [-21.3, 91.6], [-19.6, 91.2], [-17.4, 90.9], [-7.4, 91.1], [-6.8, 80.6], [-37.2, 79.9], [-47.4, 77.4], [-52.1, 75.0], [-56.4, 71.6], [-59.6, 68.4], [-62.1, 64.4], [-63.6, 61.0], [-64.9, 57.3], [-65.3, 54.0], [-65.3, 51.3]],
  MED: [[13.3, 91.6], [2.2, 91.2], [-7.4, 91.1], [-17.4, 90.9], [-19.6, 91.2], [-21.3, 91.6], [-22.4, 92.5], [-23.1, 94.0], [-22.9, 97.2], [-21.8, 101.3], [-20.1, 104.9], [-18.9, 106.6], [-16.2, 108.8], [-12.6, 111.0], [-9.9, 111.9], [-6.3, 112.4], [-4.0, 112.6], [-1.2, 112.5], [1.3, 112.3], [3.5, 112.0], [6.1, 111.2], [8.3, 110.2], [10.9, 108.5], [13.0, 106.5], [14.3, 104.9], [15.1, 103.2], [16.1, 101.0], [16.8, 99.0], [17.1, 96.9], [17.1, 94.6], [16.6, 92.9], [15.2, 92.0]],
  EDR: [[2.1, 80.7], [12.1, 80.7], [18.6, 80.6], [26.2, 79.9], [32.2, 78.1], [37.5, 75.8], [41.7, 72.9], [48.1, 68.8], [59.7, 80.8], [59.0, 81.9], [69.1, 91.4], [76.8, 102.6], [70.9, 106.8], [66.2, 110.0], [59.8, 113.4], [52.6, 115.9], [44.6, 117.4], [35.7, 118.8], [28.4, 118.8], [20.7, 118.5], [20.8, 108.3], [10.9, 108.5], [13.0, 106.5], [14.3, 104.9], [15.1, 103.2], [16.1, 101.0], [16.8, 99.0], [17.1, 96.9], [17.1, 94.6], [16.6, 92.9], [15.2, 92.0], [13.3, 91.6], [2.2, 91.2]],
  MOU: [[48.1, 68.8], [53.7, 63.9], [56.8, 60.6], [59.5, 55.9], [62.1, 50.5], [63.6, 45.2], [64.3, 39.9], [65.5, -5.6], [86.4, -5.0], [92.8, -5.0], [91.9, 35.3], [92.0, 43.5], [91.7, 48.6], [88.9, 59.1], [85.4, 66.7], [81.7, 74.1], [76.5, 81.9], [69.1, 91.4], [59.0, 81.9], [59.7, 80.8]],
  TAV: [[86.4, -5.0], [86.6, -13.9], [87.7, -53.0], [86.9, -60.9], [85.4, -67.0], [82.8, -72.8], [78.8, -78.7], [73.4, -85.3], [68.3, -89.7], [61.5, -93.2], [53.2, -74.8], [57.0, -72.6], [59.8, -69.6], [62.9, -65.8], [64.6, -62.9], [66.3, -58.1], [67.1, -53.8], [67.2, -48.6], [65.5, -5.6]],
  ALL: [[53.2, -74.8], [51.4, -75.3], [46.3, -76.7], [36.0, -77.9], [35.9, -86.4], [34.2, -86.8], [34.6, -98.2], [43.6, -98.0], [50.6, -97.3], [57.3, -95.3], [61.5, -93.2]],
}

const wrapPi = (a: number) => Math.atan2(Math.sin(a), Math.cos(a))
/** Nearest and farthest crossing of the ray from the origin at angle phi with a polygon. */
function hits(poly: XY[], phi: number): [number, number] | null {
  const dx = Math.cos(phi), dy = Math.sin(phi)
  let lo = Infinity, hi = -Infinity
  for (let i = 0; i < poly.length; i++) {
    const [x0, y0] = poly[i], [x1, y1] = poly[(i + 1) % poly.length]
    const ex = x1 - x0, ey = y1 - y0, den = dx * ey - dy * ex
    if (Math.abs(den) < 1e-9) continue
    const t = (x0 * ey - y0 * ex) / den, s = (x0 * dy - y0 * dx) / den
    if (t > 0 && s >= 0 && s <= 1) { lo = Math.min(lo, t); hi = Math.max(hi, t) }
  }
  return hi > lo ? [lo, hi] : null
}
/** The polygon's angular range seen from the origin. */
function span(poly: XY[]): [number, number] {
  const cx = poly.reduce((s, p) => s + p[0], 0) / poly.length, cy = poly.reduce((s, p) => s + p[1], 0) / poly.length
  const a0 = Math.atan2(cy, cx)
  const d = poly.map(([x, y]) => wrapPi(Math.atan2(y, x) - a0))
  return [a0 + Math.min(...d), a0 + Math.max(...d)]
}

type Frame = { o: [number, number]; d: [number, number] }
type Stand = { frames: Frame[]; ri: number[]; ro: number[]; t: number[]; phi: number[] }

/** Frames along a stand: n + 1 rays across its angular range, trimmed by `trim` radians at each end. */
function standFrames(poly: XY[], n: number, trim = 0.006): Stand {
  const [a, b] = span(poly)
  const out: Stand = { frames: [], ri: [], ro: [], t: [], phi: [] }
  for (let k = 0; k <= n; k++) {
    const f = a + trim + ((b - a - 2 * trim) * k) / n
    const h = hits(poly, f)
    if (!h) continue
    out.frames.push({ o: [0, 0], d: [Math.cos(f), Math.sin(f)] })
    out.ri.push(h[0]); out.ro.push(h[1]); out.t.push(k / n); out.phi.push(f)
  }
  return out
}

/** Close a profile's open end with a flat polygon (profile + ground), facing `side`. */
function endCap(p: Part, fr: Frame, secs: Sec[], side: V3) {
  const pts: XY[] = []
  for (const s of secs) {
    const q: XY = [s.r, s.z]
    const last = pts[pts.length - 1]
    if (!last || Math.hypot(last[0] - q[0], last[1] - q[1]) > 1e-3) pts.push(q)
  }
  if (Math.hypot(pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]) < 1e-3) pts.pop()
  let area = 0
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; area += a[0] * b[1] - b[0] * a[1] }
  const ring = area < 0 ? [...pts].reverse() : pts
  const P = ([r, z]: XY): V3 => [fr.o[0] + fr.d[0] * r, fr.o[1] + fr.d[1] * r, z]
  for (const [i, j, k] of triangulate(ring)) face(p, [P(ring[i]), P(ring[j]), P(ring[k])], side)
}

/** Loft a set of sections along a stand and cap both ends. */
function loftStand(st: Stand, secs: Sec[][], cap: Part) {
  loftSections(st.frames, secs, false)
  const n = st.frames.length - 1
  const side = (k: number): V3 => [-st.frames[k].d[1], st.frames[k].d[0], 0]
  endCap(cap, st.frames[0], secs[0], vmul(side(0), -1))
  endCap(cap, st.frames[n], secs[n], side(n))
}

/** The outfield's rise above the model's lowest ground, by x (measured on Mapterhorn, z15, in this frame). */
const slope = (x: number) => Math.min(4, Math.max(0, 1.9 - 0.021 * x))

type Bowl = { a: number; z1: number; z2?: number; b?: number; z3?: number; back: number; wall?: Part }

function build(detail: boolean) {
  const brick = new Part(), white = new Part(), stone = new Part(), roof = new Part(), timber = new Part(), win = new Part()
  const steps = detail ? 5 : 3

  /** A stand's seating section, from the outfield edge to its back wall. */
  const bowl = (ri: number, ro: number, p: Bowl): Sec[] => {
    const D = ro - ri, A = ri + p.a * D
    const out: Sec[] = [
      { r: ri, z: 0, part: stone },
      { r: ri, z: 1.2, part: stone },
      { r: ri + 1, z: 1.2, part: null },
      ...tier(white, ri + 1, 1.2, A, p.z1, steps, stone),
    ]
    if (p.z2 !== undefined) {
      const B = ri + (p.b ?? 0.9) * D
      out.push(
        { r: A, z: p.z1, part: win }, // the boxes' glazing, in the shadow under the upper tier
        { r: A, z: p.z2 - 0.9, part: stone },
        { r: A - 2.4, z: p.z2 - 0.9, part: stone }, // the upper tier's overhang
        { r: A - 2.4, z: p.z2, part: stone },
        ...tier(white, A - 2.4, p.z2, B, p.z3!, steps, stone),
        { r: B, z: p.z3!, part: stone },
        { r: B, z: p.back, part: stone },
      )
    } else out.push({ r: A, z: p.z1, part: stone }, { r: A, z: p.back, part: stone })
    out.push({ r: ro, z: p.back, part: p.wall ?? stone }, { r: ro, z: 0, part: null })
    return out
  }
  /** A roof slab over a stand: fascia, top, back edge, underside. */
  const roofSec = (ri: number, ro: number, front: number, zf: number, zb: number, th: number, top: Part, under: Part): Sec[] => {
    const rf = ri + front * (ro - ri)
    return [
      { r: rf, z: zf - th, part: white },
      { r: rf, z: zf, part: top },
      { r: ro + 0.6, z: zb, part: white },
      { r: ro + 0.6, z: zb - th, part: under },
      { r: rf, z: zf - th, part: null },
    ]
  }
  const N = (low: number) => (detail ? low * 3 : low)

  // --- Warner Stand (2017): two tiers, a timber-soffit cantilever.
  {
    const st = standFrames(POLY.WAR, N(6))
    loftStand(st, st.ri.map((ri, k) => bowl(ri, st.ro[k], { a: 0.45, z1: 6.5, z2: 9.5, b: 0.9, z3: 17, back: 19.6 })), stone)
    loftStand(st, st.ri.map((ri, k) => roofSec(ri, st.ro[k], 0.45, 21, 21.4, 1.0, white, timber)), white)
  }
  // --- Grand Stand (1998): two tiers, a roof with a bowstring truss and a mast.
  {
    const st = standFrames(POLY.GRA, N(8))
    loftStand(st, st.ri.map((ri, k) => bowl(ri, st.ro[k], { a: 0.4, z1: 6, z2: 10, b: 0.9, z3: 19, back: 21.6 })), stone)
    loftStand(st, st.ri.map((ri, k) => roofSec(ri, st.ro[k], 0.3, 22.6, 23.2, 1.1, roof, stone)), white)
    const n = st.frames.length - 1
    const at = (k: number, r: number, z: number): V3 => [st.frames[k].d[0] * r, st.frames[k].d[1] * r, z]
    const fr = (k: number) => st.ri[k] + 0.3 * (st.ro[k] - st.ri[k]) + 0.4
    const arc = (k: number) => 22.8 + 5 * Math.sin(Math.PI * st.t[k])
    const m = detail ? 0.7 : 1.1
    for (let k = 0; k < n; k++) bar(white, at(k, fr(k), arc(k)), at(k + 1, fr(k + 1), arc(k + 1)), m, m, [0, 0, 1], false)
    for (let k = 0; k <= n; k += detail ? 1 : 2) if (k > 0 && k < n) bar(white, at(k, fr(k), 22.6), at(k, fr(k), arc(k)), m * 0.8, m * 0.8, [1, 0, 0], false)
    // the mast at mid-length, behind the roof, with ties to the truss
    const km = Math.round(n / 2), rm = st.ro[km] + 1.5
    const top = at(km, rm, 42)
    cyl(white, top[0], top[1], 0.75, 0, 42, 8, true, 0.45)
    for (const k of [Math.round(n * 0.2), km, Math.round(n * 0.8)]) bar(white, top, at(k, fr(k), arc(k)), m * 0.6, m * 0.6, [0, 0, 1], false)
  }
  // --- Compton and Edrich Stands (2021): three tiers, curved shell roofs.
  for (const key of ['COM', 'EDR']) {
    const st = standFrames(POLY[key], N(10))
    // The roof's front edge: a wave rising steeply from a curl at the Media
    // Centre end to its peak, falling gently along the stand and curling
    // down again at the outer end (p117, p97, p115). u runs from the Media
    // Centre end (Compton's first frame, Edrich's last).
    const curl = (x: number) => Math.sqrt(1 - (1 - Math.min(1, Math.max(0, x))) ** 2)
    const front = (t: number) => {
      const u = key === 'COM' ? t : 1 - t
      return 15 + (27.5 - 4.5 * u - 15) * curl(u / 0.16) * curl((1 - u) / 0.12)
    }
    const TH = detail ? 0.45 : 0.6
    const LIP = 4 // the leading edge lifts at 45 deg, so its timber soffit faces the field
    const sec = st.ri.map((ri, k) => {
      const zf = front(st.t[k])
      const z3 = Math.max(11.5, Math.min(20, zf - 7.5))
      const zb = Math.max(z3 + 0.6 + TH, zf - LIP - 1.6)
      return { zf, zb, z3, back: zb - TH }
    })
    loftStand(st, st.ri.map((ri, k) => bowl(ri, st.ro[k], { a: 0.35, z1: 6, z2: 10.5, b: 0.9, z3: sec[k].z3, back: sec[k].back })), stone)
    // a thin shell: the lifted lip, then sloping gently down to the back
    loftStand(st, st.ri.map((ri, k) => {
      const rf = ri + 0.45 * (st.ro[k] - ri), ro = st.ro[k] + 0.6, { zf, zb } = sec[k]
      const lip = Math.min(LIP, Math.max(0.5, zf - zb - 0.4))
      return [
        { r: rf, z: zf - TH, part: white },
        { r: rf, z: zf, part: white },
        { r: rf + lip, z: zf - lip, part: white },
        { r: ro, z: zb, part: white },
        { r: ro, z: zb - TH, part: timber },
        { r: rf + lip, z: zf - lip - TH, part: timber },
        { r: rf, z: zf - TH, part: null },
      ] as Sec[]
    }), white)
  }
  // --- Mound Stand (1987): a brick base, an upper deck and the tents.
  {
    const st = standFrames(POLY.MOU, N(8))
    loftStand(st, st.ri.map((ri, k) => bowl(ri, st.ro[k], { a: 0.45, z1: 5, z2: 9, b: 0.95, z3: 15, back: 16.5, wall: brick })), stone)
    // upper deck cover under the tents, back from the front of the upper tier
    const T = 12, n = st.frames.length - 1
    for (let j = 0; j < T; j++) {
      const t = (j + 0.5) / T, k0 = Math.min(n - 1, Math.floor(t * n)), u = t * n - k0
      const d = vlerp([...st.frames[k0].d, 0] as V3, [...st.frames[k0 + 1].d, 0] as V3, u)
      const ri = st.ri[k0] * (1 - u) + st.ri[k0 + 1] * u, ro = st.ro[k0] * (1 - u) + st.ro[k0 + 1] * u
      const rc = ri + 0.7 * (ro - ri)
      const c: V3 = [d[0] * rc, d[1] * rc, 0]
      const R = 4.6, sides = detail ? 8 : 5
      const peak: V3 = [c[0], c[1], 24]
      const rim = Array.from({ length: sides }, (_, s) => {
        const a = Math.atan2(d[1], d[0]) + (s / sides) * 2 * Math.PI + Math.PI / sides
        return [c[0] + R * Math.cos(a), c[1] + R * Math.sin(a), 18] as V3
      })
      for (let s = 0; s < sides; s++) {
        const a = rim[s], b = rim[(s + 1) % sides]
        const mid = vlerp(a, b, 0.5)
        face(white, [a, b, peak], vadd(vsub(mid, c), [0, 0, 30]))
        face(white, [b, a, [c[0], c[1], 20]], [0, 0, -1])
      }
      bar(white, [c[0], c[1], 15], [c[0], c[1], 26.2], detail ? 0.5 : 0.7, detail ? 0.5 : 0.7, [1, 0, 0], true)
    }
  }
  // --- Tavern Stand and Allen Stand.
  {
    const st = standFrames(POLY.TAV, N(7))
    loftStand(st, st.ri.map((ri, k) => bowl(ri, st.ro[k], { a: 0.5, z1: 6, z2: 9, b: 0.9, z3: 14, back: 15.8 })), stone)
    loftStand(st, st.ri.map((ri, k) => roofSec(ri, st.ro[k], 0.5, 17, 17.4, 0.9, roof, stone)), white)
  }
  {
    const st = standFrames(POLY.ALL, N(4))
    loftStand(st, st.ri.map((ri, k) => bowl(ri, st.ro[k], { a: 0.85, z1: 9, back: 11.8 })), stone)
    loftStand(st, st.ri.map((ri, k) => roofSec(ri, st.ro[k], 0.3, 13, 13.4, 0.8, roof, stone)), white)
  }

  // --- The Pavilion (frame-aligned: its front faces +y at y = -78).
  {
    const ex: V3 = [1, 0, 0], ey: V3 = [0, 1, 0], O: V3 = [0, 0, 0]
    const YF = -78
    // the seats in front, then the brick body
    for (let s = 0; s < (detail ? 4 : 1); s++) {
      const n = detail ? 4 : 1, y0 = YF - (6 * s) / n, y1 = YF - (6 * (s + 1)) / n
      obox(white, O, ex, ey, -26, 24, y1, y0, 0, 0.8 + (2.7 * (s + 1)) / n)
    }
    obox(brick, O, ex, ey, -26, 24, -101, -84, 0, 8)
    // the Long Room's five arched windows on the front
    for (let i = 0; i < 5; i++) {
      const xc = -21 + i * 9.5, w = 2.6, z0 = 3.6, zs = 6.4
      const pts: V3[] = [[xc - w / 2, -83.94, z0], [xc + w / 2, -83.94, z0], [xc + w / 2, -83.94, zs]]
      for (let a = 1; a < 8; a++) pts.push([xc + (w / 2) * Math.cos((a * Math.PI) / 8), -83.94, zs + (w / 2) * Math.sin((a * Math.PI) / 8)])
      pts.push([xc - w / 2, -83.94, zs])
      face(win, pts, [0, 1, 0])
    }
    // two balcony decks, each with seats stepping back to the wall behind
    const deck = (z: number, yEdge: number, yBack: number, zTop: number) => {
      obox(stone, O, ex, ey, -26, 24, yBack, yEdge, z - 0.6, z, true)
      obox(white, O, ex, ey, -26, 24, yEdge - 0.25, yEdge, z, z + 1.1) // the white railing band
      obox(white, O, ex, ey, -26, 24, yBack, yEdge - 0.3, z, z + (zTop - z) * 0.5)
      obox(white, O, ex, ey, -26, 24, yBack, (yBack + yEdge) / 2, z, zTop)
    }
    deck(8.6, -80.5, -88, 11.6)
    obox(brick, O, ex, ey, -26, 24, -101, -88, 8, 12.4)
    deck(12.6, -84.5, -92, 15.4)
    obox(brick, O, ex, ey, -26, 24, -103, -92, 0, 19)
    face(win, [[-24, -91.94, 13.2], [22, -91.94, 13.2], [22, -91.94, 18.2], [-24, -91.94, 18.2]], [0, 1, 0])
    // the pale canopy over the top deck, on posts
    obox(roof, O, ex, ey, -27, 25, -101, -82.5, 20.2, 21, true)
    for (const x of [-24, -12, 0, 12, 22]) obox(white, O, ex, ey, x - 0.3, x + 0.3, -83.4, -82.8, 15.4, 20.2)
    obox(roof, O, ex, ey, -25, 23, -100, -93, 19, 19.4)
    // the rear block
    obox(brick, O, ex, ey, -26, 31, -107, -101, 0, 14)
    obox(roof, O, ex, ey, -26, 31, -107, -103, 14, 14.4)
    // its windows towards the Grace Gates: grouped panels per bay, two storeys
    for (let i = 0; i < 6; i++) {
      const x0 = -23 + i * 9, x1 = x0 + 6
      for (const [z0, z1] of [[3, 6.8], [8.6, 12.4]]) face(win, [[x0, -107.06, z0], [x1, -107.06, z0], [x1, -107.06, z1], [x0, -107.06, z1]], [0, -1, 0])
    }
    // the two towers: brick shaft, white cornice, a windowed stage, a pyramid roof
    for (const xc of [-31.4, 27]) {
      obox(brick, O, ex, ey, xc - 4.6, xc + 4.6, -100.5, -79, 0, 21)
      obox(white, O, ex, ey, xc - 5, xc + 5, -100.9, -78.6, 21, 22.2, true)
      obox(brick, O, ex, ey, xc - 3.6, xc + 3.6, -93.4, -86.2, 22.2, 25.4)
      for (const [nx, ny] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        const cx = xc + nx * 3.66, cy = -89.8 + ny * 3.66
        const sx = ny !== 0 ? 1 : 0, sy = nx !== 0 ? 1 : 0
        face(win, [[cx - sx * 1.6, cy - sy * 1.6, 22.9], [cx + sx * 1.6, cy + sy * 1.6, 22.9], [cx + sx * 1.6, cy + sy * 1.6, 24.8], [cx - sx * 1.6, cy - sy * 1.6, 24.8]], [nx, ny, 0])
      }
      const base: V3[] = [[xc - 4.4, -94.2, 25.4], [xc + 4.4, -94.2, 25.4], [xc + 4.4, -85.4, 25.4], [xc - 4.4, -85.4, 25.4]]
      const tip: V3 = [xc, -89.8, 30.2]
      for (let s = 0; s < 4; s++) {
        const a = base[s], b = base[(s + 1) % 4]
        face(roof, [a, b, tip], vadd(vsub(vlerp(a, b, 0.5), [xc, -89.8, 25.4]), [0, 0, 8]))
      }
      face(roof, base, [0, 0, -1])
      bar(white, tip, [xc, -89.8, 31.6], 0.35, 0.35, [1, 0, 0], true)
      // the tower's windows, two-storey groups on the field face
      for (const [z0, z1] of [[3, 7.5], [11, 16.5]]) face(win, [[xc - 2, -78.94, z0], [xc + 2, -78.94, z0], [xc + 2, -78.94, z1], [xc - 2, -78.94, z1]], [0, 1, 0])
    }
  }

  // --- The Media Centre: a white pod with a glazed front band on two legs.
  {
    const cx = -3, cy = 101.8, A = 20, B = 10.8
    for (const lx of [-13, 7]) cyl(white, lx, cy + 0.5, 2.8, 0, 19.8, detail ? 16 : 10, false)
    const M = detail ? 48 : 28
    const plan = (s: number) => Array.from({ length: M }, (_, k) => {
      const a = (k / M) * 2 * Math.PI, c = Math.cos(a), sn = Math.sin(a), e = 2.3
      return [cx + s * A * Math.sign(c) * Math.abs(c) ** (2 / e), cy + s * B * Math.sign(sn) * Math.abs(sn) ** (2 / e)] as XY
    })
    // section: [scale, z]
    // a lens: rounded underneath and on top, the glazed band round the front on the widest rings
    const prof: [number, number][] = [[0.45, 19.4], [0.78, 20], [0.95, 21.2], [1, 22.6], [1, 25.8], [0.95, 27.3], [0.8, 28.6], [0.5, 29.4]]
    const rings = prof.map(([s, z]) => plan(s).map(([x, y]) => [x, y, z] as V3))
    for (let L = 0; L < rings.length - 1; L++) {
      const glass = L >= 2 && L <= 4
      for (let k = 0; k < M; k++) {
        const j = (k + 1) % M
        const a = rings[L][k], b = rings[L][j], c = rings[L + 1][j], d = rings[L + 1][k]
        const front = (a[1] + b[1]) / 2 < cy + 3
        const out = vsub(vlerp(vlerp(a, b, 0.5), vlerp(c, d, 0.5), 0.5), [cx, cy, (a[2] + c[2]) / 2])
        face(glass && front ? win : white, [a, b, c, d], out)
      }
    }
    face(white, rings[0], [0, 0, -1])
    face(white, rings[rings.length - 1], [0, 0, 1])
  }

  // --- Four floodlight masts, raised; the lamp faces glow (window).
  for (const [x, y] of [[75.7, 88.4], [71.0, -90.7], [-80.4, 71.6], [-74.3, -87.5]] as XY[]) {
    const L = Math.hypot(x, y), f: V3 = [-x / L, -y / L, 0], s: V3 = [-f[1], f[0], 0]
    cyl(white, x, y, 0.95, 0, 41, detail ? 12 : 8, true, 0.6)
    const tilt = 15 * RAD
    const up: V3 = vadd([0, 0, Math.cos(tilt)], vmul(f, Math.sin(tilt)))
    const nrm: V3 = vadd(vmul(f, Math.cos(tilt)), [0, 0, -Math.sin(tilt)])
    const b0: V3 = [x + f[0] * 0.5, y + f[1] * 0.5, 40.4]
    const Q = (u: number, v: number, w: number): V3 => vadd(b0, vadd(vadd(vmul(s, u), vmul(up, v)), vmul(nrm, w)))
    const fr = [Q(-3.6, 0, 0), Q(3.6, 0, 0), Q(3.6, 5.2, 0), Q(-3.6, 5.2, 0)], bk = fr.map((p) => vsub(p, vmul(nrm, 1.2)))
    face(win, fr, nrm)
    face(white, bk, vmul(nrm, -1))
    for (let k = 0; k < 4; k++) { const j = (k + 1) % 4; face(white, [fr[k], fr[j], bk[j], bk[k]], vsub(vlerp(fr[k], fr[j], 0.5), Q(0, 2.6, 0))) }
  }

  // The ground's slope: everything above the ground is lifted by the
  // terrain's rise above the lowest (east) edge; feet stay at y = 0 and sink
  // into the higher west side.
  for (const p of [brick, white, stone, roof, timber, win])
    for (let i = 0; i < p.pos.length; i += 3) if (p.pos[i + 1] > 1e-6) p.pos[i + 1] += slope(p.pos[i])

  const lit = (_p: V3, n: V3) => (n[2] < 0.5 ? 0.5 : 0.15)
  return [
    { part: brick, material: { ...finish('lords-brick', 0xb86c57), floodlight: lit } },
    { part: white, material: finish('lords-white', 0xf1f0eb) },
    { part: stone, material: finish('lords-concrete', 0xbebdb7) },
    { part: roof, material: PALETTE.roof },
    { part: timber, material: finish('lords-timber', 0xb08660) },
    { part: win, material: PALETTE.window },
  ]
}

if (import.meta.main)
  await writeLods("Lord's Cricket Ground", { bearing: BEARING, elevation: 0, height: 49.4 }, [
    { file: 'london-lords.glb', parts: build(false), maxTris: 6500, maxBytes: 250_000 },
    { file: 'london-lords.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1536 * 1024 },
  ])
