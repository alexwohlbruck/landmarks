/**
 * Al Hamra Tower, Sharq, Kuwait City — original procedural geometry, CC0-1.0.
 * bun generators/kuwait-al-hamra-tower.ts   (writes the low model and the detail LOD)
 *
 *
 * Frame: bearing 9.4 (the OSM square's sides). Origin = area centroid of the tower part
 * way/188381326 (47.9930928 E, 29.3793408 N), on the ground. Elevation 0.
 *
 * Form, as read from the published description and the photos:
 * - a square tower (OSM 58.2 x 60.0 m) with a quarter of each floor plate removed from the
 *   south side; the cut slides from the west at the foot to the east at the top (SOM:
 *   "a quarter of each floor plate is chiseled out of the south side, shifting from west to
 *   east over the height"), so the two legs either side of the notch trade widths up the
 *   height and the tower twists;
 * - the west leg is a convex glass face wrapping from the west face into the notch, a
 *   sliver at the foot and the whole south-west quarter at the top, ending in a stone
 *   ribbon at the core; the east leg is the concave limestone "shawl" (brushed Jura
 *   limestone, Wikipedia), never thinner than 11 m, flaring wider and deeper in the upper
 *   third and curling west over the notch at the top; the core's south wall between them
 *   is limestone punched with staggered square openings (real 0.7 m recesses, one row
 *   every ~10 m in both models, columns 6.4 m apart: coarser
 *   than the real ones); the flared wall edges stand proud as pale fins;
 * - glass on the north, east and west faces (Wikipedia: "wrapped glass on the east, north,
 *   and west");
 * - a sloping top, highest at the south-west corner (412.6 m) and falling to the published
 *   roof (368 m) at the north-east (photos: the sharp sloped crown);
 * - the 40 m podium (OSM way/1456434410, 9 levels) south of the tower.
 *
 * Evidence
 * - OSM (API, fetched 2026-11-27): tower part way/188381326 (building:part, 77 levels,
 *   height 413, wikidata Q557933, checked against Wikidata "Al Hamra Tower" at 29.3786,
 *   47.9928); podium outline way/1456434410 (building=yes, height 40, 9 levels), which
 *   contains the tower part.
 * - Published: 412.6 m architectural height (CTBUH; Wikipedia 414 m tip), roof 368 m,
 *   80 floors; south limestone, the flared walls from the core's south-west and south-east
 *   corners (Wikipedia "Al Hamra Tower"; SOM and World-Architects project pages).
 * - Photos:
 *   "Al Hamra Tower" (Flickr 8013932911), robef (Rob Faulkner), CC BY 2.0, 2012, from the
 *   south-west (~240 deg): glass leg, punched core, shawl, sloping top, colours;
 *   https://www.flickr.com/photos/45953381@N05/8013932911
 *   "Al-Hamra Tower." (Flickr 54191786972), young shanahan, CC BY 2.0, from the south at the
 *   foot: the notch, core windows and shawl; https://www.flickr.com/photos/14759783@N04/54191786972
 *   "Kuwait City Kuwait Towers View to the al-Hamra Tower.jpg", Zairon, CC BY 4.0, 2022, from
 *   the north-east (Kuwait Towers): the glass faces and the sloped top;
 *   https://commons.wikimedia.org/wiki/File:Kuwait_City_Kuwait_Towers_View_to_the_al-Hamra_Tower.jpg
 *   "Kuwait City Skyline 2.jpg", Zairon, CC BY 4.0, 2022, from the east-north-east: the
 *   shawl's tip and the twist; https://commons.wikimedia.org/wiki/File:Kuwait_City_Skyline_2.jpg
 *   "Kuwait City Kuwait Towers Panoramic View 4.jpg", Zairon, CC BY 4.0, 2022;
 *   https://commons.wikimedia.org/wiki/File:Kuwait_City_Kuwait_Towers_Panoramic_View_4.jpg
 *   "Al Hamra Kuwait Mai 2010.jpg", J.Stiegler, CC BY-SA 3.0, 2010, from the south during
 *   construction: the core wall and the limestone podium;
 *   https://commons.wikimedia.org/wiki/File:Al_Hamra_Kuwait_Mai_2010.jpg
 * - No lidar, NAIP or Mapillary. Terrain: Mapterhorn z12 only.
 * - Look-only references: none.
 *
 * Numbers
 * - Published: 412.6 m top, 368 m roof, the south quarter and its west-to-east slide.
 * - Measured (OSM): plan and podium.
 * - Estimated (photos): the slide's easing (strongest mid-height), the legs' curvature
 *   (superellipse exponents 2.6 convex, 1.6 concave), the depth each leg reaches (in
 *   proportion to its width), the shawl's flare (from 150 m, to 17 m wide and the full
 *   depth at the top, its tip curling 40% of its width west), the top's slope, the fins
 *   (1 x 1.4 m), the core openings (3.0 x 3.6 m). Colours sampled from the 2012 robef photo
 *   (glass #4a5a70, limestone #d0a868 in sun) and pulled to the palette's lightness.
 *
 * Doubts
 * - The real geometry is a continuous ruled twist; this is a lofted approximation and the
 *   legs' exact plan at each height is estimated from photos.
 * - The podium is drawn as limestone with window bands; the real mall front has a glazed,
 *   curved facade and roof (seen in the 2012 photo) not modelled.
 * - The north side is only seen far off.
 *
 * Night: the glass glows as windows; the limestone shawl is floodlit; the core windows glow.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { K, type P2 } from './taipei-101'
import { face, saveLods, type Layer } from './auckland-sky-tower'
import { gridSurface } from './shanghai-tower'
import { punched } from './dubai-marina-101'

const ID = 'kuwait-al-hamra-tower'
const BEARING = 9.4 // the OSM square's sides run at 9.4 / 99.3 degrees
const ANCHOR = { lng: 47.9930928, lat: 29.3793408 } // area centroid of the tower part way/188381326
const proj = K.projector(ANCHOR.lng, ANCHOR.lat, BEARING)
const TOWER_LL: P2[] = [[47.9934471, 29.3795568], [47.993349, 29.3790372], [47.9927385, 29.3791247], [47.9928366, 29.3796443]]
const PODIUM_LL: P2[] = [[47.9928298, 29.3796523], [47.9925897, 29.3783588], [47.993003, 29.377841], [47.9931851, 29.3779567], [47.9934891, 29.3795543]]

const tw = TOWER_LL.map(proj)
const X = tw.reduce((s, p) => s + Math.abs(p[0]), 0) / 4 // ~30.0 m (the 60.0 m sides)
const Y = tw.reduce((s, p) => s + Math.abs(p[1]), 0) / 4 // ~29.1 m (the 58.2 m sides)

const TOP = 412.6 // architectural height: the tip of the sloping top (CTBUH)
const ROOF_N = 368 // the published roof height, taken as the low (north-east) end of the top
const PODIUM = 40 // OSM way/1456434410: height 40, 9 levels
const NEXP = 1.6 // superellipse exponent of the legs' concave faces (2 = elliptic, 1 = straight)

/**
 * The carved quarter: a notch half the width and half the depth of the square, cut from the
 * south side, sliding from the west (at the foot) to the east (at the top). `aw` is the width
 * of the west leg left beside it, `ae` the east leg's.
 */
function legs(z: number): { aw: number; ae: number } {
  const t = Math.min(1, Math.max(0, z / 372))
  const u = t * t * (3 - 2 * t) * 0.7 + t * 0.3 // eased, so the twist reads strongest mid-height
  const aw = Math.max(1.2, X * u)
  // the shawl never thins away with the cut: it keeps a broad limestone face (at least 11 m
  // wide and half the depth) and flares wider and deeper in the upper third, curling over
  // at the top (photos)
  const ft = flareT(z)
  return { aw, ae: Math.min(2 * X - aw - 8, Math.max(1.2, X - aw, 11 + 6 * ft)) }
}
/** 0 below 150 m, easing to 1 at 360 m: how far the shawl's upper flare has grown. */
function flareT(z: number) {
  const t = Math.min(1, Math.max(0, (z - 150) / 210))
  return t * t * (3 - 2 * t)
}
/** The top: highest at the south-west corner, falling to ROOF_N at the north-east one. */
const topAt = (q: P2) => TOP - 0.6 * (q[1] + Y) - 0.13 * (q[0] + X)

type Kind = 'glass' | 'stone' | 'core' | 'rib'
/**
 * The plan at height z, CCW from the north-east corner, with the kind of wall that leaves
 * each vertex (toward the next one), and which vertices are sharp corners. The legs either
 * side of the notch end in concave, flaring faces that thin to a 2.5 m edge at the south
 * face: the west leg's in glass with a stone ribbon at its inner edge, the east leg's in
 * limestone (the "shawl").
 */
function plan(z: number, m: number): { pts: P2[]; kind: Kind[]; sharp: boolean[] } {
  const { aw, ae } = legs(z)
  const C = (th: number) => Math.cos(th) ** (2 / NEXP), S = (th: number) => Math.sin(th) ** (2 / NEXP)
  const pts: P2[] = [], kind: Kind[] = [], sharp: boolean[] = []
  const add = (p: P2, k: Kind, sh: boolean) => { pts.push(p); kind.push(k); sharp.push(sh) }
  const te = Math.min(ae, Math.max(2.5, ae * 0.22))
  // the west leg: a convex glass face wrapping from the west face round to the notch
  // (photos: the glass grows from a sliver at the foot to the whole south-west quarter at
  // the top), ending in a stone ribbon at the core
  const cv = (th: number) => Math.cos(th) ** (2 / 2.6), sv = (th: number) => Math.sin(th) ** (2 / 2.6)
  add([X, Y], 'glass', true) // north face
  add([-X, Y], 'glass', true) // west face
  add([-X, 0], 'glass', false)
  // each leg reaches as far south as it is wide (scaled to the square): a sliver at its
  // thin end, a whole quarter where it is widest
  const ft = flareT(z)
  const dw = (Y * aw) / X, de = Math.min(Y, Math.max((Y * (X - aw)) / X, Y * (0.55 + 0.45 * ft)))
  // the shawl's tip curls west over the notch as it flares
  const curl = ft * ae * 0.4
  add([-X, -dw], 'glass', true)
  for (let i = 1; i < m; i++) {
    const th = (Math.PI / 2) * (1 - i / m)
    add([-X + aw * cv(th), -dw * sv(th)], i === m - 1 ? 'rib' : 'glass', false)
  }
  add([-X + aw, 0], 'core', true) // the core's south wall, exposed in the notch
  add([X - ae, 0], 'stone', true) // the east leg's concave face: the limestone "shawl"
  for (let i = 1; i < m; i++) {
    const ph = (Math.PI / 2) * (i / m)
    add([X - ae + (ae - te - curl) * S(ph), -de + de * C(ph)], 'stone', false)
  }
  add([X - te - curl, -de], 'stone', true) // the shawl's south edge
  add([X, -de], 'glass', true) // east face
  add([X, 0], 'glass', false)
  return { pts, kind, sharp }
}

type Set = { glass: Part; stone: Part; core: Part; rib: Part; roof: Part; podium: Part; band: Part; win: Part }
const mk = (): Set => ({ glass: new Part(), stone: new Part(), core: new Part(), rib: new Part(), roof: new Part(), podium: new Part(), band: new Part(), win: new Part() })

function build(s: Set, d: boolean) {
  const m = d ? 22 : 12
  // levels: the shaft from the ground to below the sloping top, then the top row
  const step = d ? 5 : 10
  const zs: number[] = []
  for (let z = 0; z < ROOF_N - 4; z += step) zs.push(z)
  const rows: V3[][] = zs.map((z) => plan(z, m).pts.map((p) => [p[0], p[1], z] as V3))
  const topPlan = plan(392, m)
  rows.push(topPlan.pts.map((p) => [p[0], p[1], topAt(p)] as V3))
  const { kind, sharp } = topPlan
  const N = kind.length
  const scrap = new Part() // the core wall is drawn below, punched, instead of by the loft
  const partOf = (k: Kind) => (k === 'glass' ? s.glass : k === 'stone' ? s.stone : k === 'core' ? scrap : s.rib)
  gridSurface(rows, true, (i) => partOf(kind[i]), (i) => sharp[i], (i) => kind[i] === 'core' || kind[i] === 'rib')

  // the top: a sloping glass-edged roof; a lip of the ribbon stone round its rim
  const top = rows[rows.length - 1]
  const ring2 = top.map((p) => [p[0], p[1]] as P2)
  const tris = (K.ccw(ring2) === ring2 ? ring2 : [...ring2].reverse())
  void tris
  // fan from the plan's centroid (the plan is star-shaped from a point in the north half)
  const cx: P2 = [0, Y * 0.45]
  const cz = topAt(cx)
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    s.roof.tri(top[i], top[j], [cx[0], cx[1], cz])
  }
  // the flared walls: the stone ribbon on the west leg's edge stands proud as a fin, and the
  // shawl's edge at the core wall too (SOM: "flared walls reaching from the south-west and
  // south-east corners of the core span the entire height")
  for (let k = 0; k < rows.length - 1; k++) {
    const z0 = rows[k][0][2], last = k === rows.length - 2
    for (const idx of [kind.indexOf('core'), kind.indexOf('stone')]) {
      const a0 = rows[k][idx], a1 = rows[k + 1][idx]
      const fin = (p: V3, zt: number): V3[] => [[p[0] - 0.5, p[1] + 0.1, zt], [p[0] + 0.5, p[1] + 0.1, zt], [p[0] + 0.5, p[1] - 1.3, zt], [p[0] - 0.5, p[1] - 1.3, zt]]
      const b0 = fin(a0, z0 < PODIUM - 1 ? PODIUM - 1 : z0), b1 = fin(a1, last ? a1[2] + 1.2 : a1[2])
      if (a1[2] < PODIUM) continue
      for (let e = 0; e < 4; e++) {
        const f = (e + 1) % 4
        const ex = b0[f][0] - b0[e][0], ey = b0[f][1] - b0[e][1]
        face(s.rib, [b0[e], b0[f], b1[f], b1[e]], [ey, -ex, 0])
      }
      if (last) face(s.rib, b1, [0, 0, 1])
    }
  }

  // the core wall in the notch: limestone punched with square openings as real recesses,
  // staggered row to row as in the photos, at a coarser rhythm than the real ones (one row
  // every ~10 m, columns 6.4 m apart) so they don't read as a dot grid
  {
    const ic = kind.indexOf('core')
    const f = { c: [0, 0] as P2, t: [1, 0] as P2, n: [0, -1] as P2, L: 0 }
    const poly = (pts: V3[]) => {
      const q = pts.filter((p, i) => { const r = pts[(i + 1) % pts.length]; return Math.hypot(p[0] - r[0], p[2] - r[2]) > 1e-4 })
      if (q.length >= 3) face(s.core, q, [0, -1, 0])
    }
    const P = 6.4, W = 3.0, OH = 3.6
    let used = 0
    for (let k = 0; k < rows.length - 1; k++) {
      const A0 = rows[k][ic], B0 = rows[k][ic + 1], A1 = rows[k + 1][ic], B1 = rows[k + 1][ic + 1]
      const z0 = A0[2], z1 = A1[2], last = k === rows.length - 2
      const W0: V3 = [A0[0], 0, z0], W1: V3 = [B0[0], 0, z0], W2: V3 = [B1[0], 0, B1[2]], W3: V3 = [A1[0], 0, A1[2]]
      const pick = !last && z0 >= PODIUM && (d ? Math.round(z0 / step) % 2 === 0 : true)
      if (!pick) { poly([W0, W1, W2, W3]); continue }
      const s0 = Math.max(A0[0], A1[0]), s1 = Math.min(B0[0], B1[0])
      poly([W0, [s0, 0, z0], [s0, 0, z1], W3]) // the slanting sliver at the west leg
      poly([[s1, 0, z0], W1, W2, [s1, 0, z1]]) // and at the shawl
      const off = used++ % 2 ? P / 2 : 0
      const bays: [number, number][] = []
      for (let x = -X + 1 + off; x + W < X; x += P) if (x >= s0 + 1.2 && x + W <= s1 - 1.2) bays.push([x, x + W])
      const zc = (z0 + z1) / 2, h = Math.min(OH, z1 - z0 - 1.4) / 2
      punched(s.core, s.win, f, s0, s1, z0, z1, bays, [[zc - h, zc + h]], 0.7)
    }
  }

  // ---- the podium (OSM way/1456434410, 40 m): limestone, with long bands of glazing
  const pod = K.ccw(PODIUM_LL.map(proj))
  K.prism(s.podium, pod, 0, PODIUM - 1.2, false)
  K.band(s.rib, pod, PODIUM - 1.2, PODIUM, 0.4, 0.4)
  const footprint = plan(PODIUM, m).pts
  K.cap(s.roof, pod, PODIUM, true, [footprint])
  for (let i = 0; i < pod.length; i++) {
    const a = pod[i], b = pod[(i + 1) % pod.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 10) continue
    const t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: P2 = [t[1], -t[0]]
    for (const [z0, z1] of [[1, 7], [16, 19.5], [28, 31.5]]) {
      const nb = Math.max(1, Math.floor(L / (d ? 14 : 28)))
      for (let k = 0; k < nb; k++) {
        const s0 = 3 + ((L - 6) * k) / nb + 1, s1 = 3 + ((L - 6) * (k + 1)) / nb - 1
        const p0: P2 = [a[0] + t[0] * s0 + n[0] * 0.06, a[1] + t[1] * s0 + n[1] * 0.06], p1: P2 = [a[0] + t[0] * s1 + n[0] * 0.06, a[1] + t[1] * s1 + n[1] * 0.06]
        face(s.glass, [[p0[0], p0[1], z0], [p1[0], p1[1], z0], [p1[0], p1[1], z1], [p0[0], p0[1], z1]], [n[0], n[1], 0])
      }
    }
  }
}

// ---- materials: colours sampled from the 2012, 2013, 2022 and 2024 daylight photos, pulled to
// the palette's lightness
const GLASS: MaterialSpec = { ...PALETTE.window, color: 0x72839a } // dark grey-blue glass, pulled light
const STONE: MaterialSpec = { ...finish('hamra-limestone', 0xdcbb84), floodlight: (p, n) => (n[2] > 0.8 ? 0 : 0.5) }
const CORE: MaterialSpec = finish('hamra-limestone-shade', 0xcfae7c) // the core wall, punched and in shadow
const RIB: MaterialSpec = PALETTE.trim
const ROOF: MaterialSpec = PALETTE.roof
const PODIUM_M: MaterialSpec = finish('hamra-podium', 0xdccbb0)
// the core's punched windows
const BAND: MaterialSpec = windowVariant(2, 0x68717c)
const merge = (a: Part, b: Part) => { const p = new Part(); p.pos = [...a.pos, ...b.pos]; p.nrm = [...a.nrm, ...b.nrm]; p.uv = [...a.uv, ...b.uv]; return p }
const layers = (s: Set): Layer[] => {
  // six materials at most: the podium shares the shaded limestone, the bands the ribbon trim
  const core = new Part(); core.pos = [...s.core.pos, ...s.podium.pos]; core.nrm = [...s.core.nrm, ...s.podium.nrm]; core.uv = [...s.core.uv, ...s.podium.uv]
  void PODIUM_M
  return [
    { part: s.glass, material: GLASS },
    { part: s.stone, material: STONE },
    { part: core, material: CORE },
    { part: s.rib, material: RIB },
    { part: s.roof, material: ROOF },
    { part: merge(s.band, s.win), material: BAND },
  ]
}

if (import.meta.main) {
  const low = mk(), det = mk()
  build(low, false)
  build(det, true)
  await saveLods(ID, 'Al Hamra Tower', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the OSM tower part centroid, on the ground',
    bearing: BEARING, height: TOP,
  }, 6500)
}
