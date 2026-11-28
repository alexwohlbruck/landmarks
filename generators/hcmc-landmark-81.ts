/**
 * Landmark 81, Vinhomes Central Park, Binh Thanh, Ho Chi Minh City: original procedural geometry, CC0-1.0.
 * bun generators/hcmc-landmark-81.ts   (writes the low model and the detail LOD)
 *
 * Also exports two small plan helpers (offsetRing, roofCap) that the other models of this
 * builder (busan-lct-landmark-tower, egypt-iconic-tower) import. Merge this file first.
 *
 * Frame: bearing 52 (model +y runs along the tower's grid at 52 deg, +x at 142 deg). Origin at the
 * centroid of the OSM outline way/622296615 (106.7217540 E, 10.7948403 N), on the ground; y = 0
 * is the street; elevation 0. Mapterhorn (z15) shows the site flat to within 1.7 m.
 *
 * Form, as read from the photos: a bundle of square glass tubes (Atkins: "a bundle of bamboo")
 * of staggered heights on a 62 x 56 m plan, stepping in towards the tall central core; the core
 * ends in a pale lantern box at the roof and carries the slender crown mast, a steel frame
 * round a dark glass core with ring bars, standing on the core's north-east side, from the
 * 372 m tube roof to 461.2 m. Each tube face is silver-blue glass; dark recessed joints mark the
 * tube edges, and dark bands mark the tube tops and the plant floors. The six-storey mall podium
 * fills the OSM outline.
 *
 * Modelled as a height field on a 7 x 6 grid of tubes (U bands along +x, V bands along +y);
 * every exposed wall is drawn once, with real 0.8 m-deep joints wherever two tube faces stand
 * side by side, and a parapet round every tube top.
 *
 * Evidence
 * - OSM (API map call, fetched 2026-11-27): outline way/622296615 (building=yes, name Vincom
 *   Center, height 461.2, 81 levels, wikidata Q18640924, wikipedia en:Landmark 81: Wikidata
 *   Q18640924 is Landmark 81, checked), parts way/622296616 (height 150: the tower's 62 x 56 m
 *   plan), way/622296617 (300) and way/622296618 (461.2: the mast, 12.3 x 7.8 m).
 * - Published (Wikipedia "Landmark 81", retrieved 2026-11-27): 461.2 m architectural top, roof
 *   395.2 m, 65 m crown spire, observatory 382.7 m (floors 79-81), 81 storeys, six-storey
 *   base; architect Atkins, the bundle-of-bamboo concept.
 * - Photos (Wikimedia Commons, daylight unless noted):
 *   "Landmark 81 (32099609868) (4to3).jpg", Christine und Hagen Graf, CC BY 2.0, from the
 *   south-east across the Saigon River, face-on to the +x face: the tube steps (measured, below),
 *   the lantern box, the mast's side and its ring bars, the silver glass in sun;
 *   https://commons.wikimedia.org/wiki/File:Landmark_81_(32099609868)_(4to3).jpg
 *   "Landmark 81 (3).jpg", Gzzz, CC0, from the river (north-east side): the steps on the other
 *   axis, the navy glass under cloud, the pale mast frame;
 *   https://commons.wikimedia.org/wiki/File:Landmark_81_(3).jpg
 *   "Landmark 81 view from Saigon River.jpg", Josemite, CC BY-SA 4.0: teal glass, the mast lattice;
 *   https://commons.wikimedia.org/wiki/File:Landmark_81_view_from_Saigon_River.jpg
 *   "Tòa nhà Landmark 81 (52353066123).jpg", Kien Mike, public domain: the foot, the podium's
 *   glazing and fins, the tube joints and mullions close up;
 *   https://commons.wikimedia.org/wiki/File:T%C3%B2a_nh%C3%A0_Landmark_81_(52353066123).jpg
 *   "Landmark 81 viewed from Thu Thiem.png", Cuong Tran, CC0: the skyline silhouette;
 *   https://commons.wikimedia.org/wiki/File:Landmark_81_viewed_from_Thu_Thiem.png
 *   Night: "Landmark 81, Ho Chi Minh City, Vietnam - February 2021.jpg", Thomas Galvez, CC BY 2.0,
 *   and "Vincom Landmark 81 (33490550068).jpg", Gurval Le Bouter, CC BY 2.0: the whole curtain
 *   wall lit warm white in vertical LED lines, the mast lit blue-white.
 * - No lidar, NAIP or Mapillary here (batch notes). Look-only references: none.
 *
 * Numbers
 * - Published: 461.2 m top; roof 395.2 m (the core is drawn to a 398 m parapet with the lantern
 *   box to 401.4 m); 65 m crown.
 * - Measured (OSM): the tower plan 62 x 56 m; the podium outline; the mast's 12 x 8 m size.
 * - Measured (Graf photo, scaled by the 65 m mast, 4.24 px/m): top tier 21 m wide; the second
 *   tier 31 m wide from 282 to ~372 m; tube tops on the V axis at 173, 190, ~293, 315, 372 and
 *   282 m; full width 58 m. (Gzzz photo, 3 px/m): steps on the U axis at ~375, 345, 302, 230,
 *   188, 175 m and a low corner tube at ~84 m. Each tube top is the lower of its U-band and
 *   V-band heights, with the front tube (330 m) and corner tubes set by hand.
 * - Estimated: podium 28 m (six retail storeys); band and joint sizes; the tube grid itself
 *   (the real tubes' plan is not published: the grid reproduces the two photographed skylines).
 * - Colours sampled: glass #364658 (cloud), #62919c (river light), sun silver; pulled to
 *   #6a83a0. Mast frame #707279 (cloud), drawn #b9c2ca; its glass core #5a6b7c.
 *
 * Doubts
 * - The tube grid is an abstraction built to match two skylines; the diagonal views and the
 *   north-west face are not photographed in the licensed set, so the tubes there are mirrored
 *   estimates.
 * - The podium's height and the tower's own glazing down to the street on its south side are
 *   estimated; the podium is drawn as one 28 m block on the OSM outline.
 * - The mast's position on the core follows the photo, a few metres off OSM's crude part.
 *
 * Night: the whole curtain wall and the podium glazing glow as windows (the LED-lined facade);
 * the mast frame is neon in its own pale colour (lit blue-white); its glass core glows as
 * window-2.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { face, prism, saveLods, ccw, type Layer, type XY } from './auckland-sky-tower'
import { polyTris } from './berlin-oberbaum-bridge'

/** A ring moved `d` metres outward (negative: inward), corners mitred; ring counter-clockwise. */
export function offsetRing(r: XY[], d: number): XY[] {
  const n = r.length
  return r.map((p, i) => {
    const a = r[(i - 1 + n) % n], b = r[(i + 1) % n]
    const e1: XY = [p[0] - a[0], p[1] - a[1]], e2: XY = [b[0] - p[0], b[1] - p[1]]
    const l1 = Math.hypot(...e1), l2 = Math.hypot(...e2)
    const n1: XY = [e1[1] / l1, -e1[0] / l1], n2: XY = [e2[1] / l2, -e2[0] / l2]
    const m: XY = [n1[0] + n2[0], n1[1] + n2[1]], ml = Math.hypot(...m) || 1
    const k = d / Math.max(0.3, (m[0] * n1[0] + m[1] * n1[1]) / ml)
    return [p[0] + (m[0] / ml) * k, p[1] + (m[1] / ml) * k] as XY
  })
}
/** A flat cap over any simple ring, facing up. */
export function roofCap(p: Part, r: XY[], z: number) {
  for (const [a, b, c] of polyTris(r)) face(p, [[a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z]], [0, 0, 1])
}

// ---- Frame -------------------------------------------------------------------------------------
// bearing 52: model +y runs along the tower's long axis at 52 deg, +x at 142 deg. Origin at the
// centroid of the OSM outline way/622296615 (the podium), on the ground.

const TOP = 461.2 // published architectural top (the crown mast)
const ROOF = 398 // the core's parapet (published roof 395.2)
const MAST_BASE = 372
const BASE = 28 // podium roof (estimated: six retail storeys)

// the podium outline (way/622296615) in the model frame
const PODIUM: XY[] = [[-40.6, 44.8], [-41.0, 13.3], [-69.6, 13.2], [-70.9, -9.7], [-50.7, -10.9], [-50.8, -43.0], [27.2, -44.5], [27.0, -36.3], [46.3, -36.1], [46.9, -27.1], [57.5, -26.7], [58.1, -17.4], [68.2, -17.3], [67.6, 8.3], [58.5, 8.1], [57.9, 16.5], [48.6, 16.8], [39.6, 26.4], [39.6, 33.8], [31.6, 34.2], [33.5, 47.4], [12.8, 51.4], [11.8, 60.8], [5.1, 60.9], [4.3, 43.8]]
// the tower: OSM part way/622296616 is a 62 x 56 m rectangle centred here
const T: XY = [-7.0, 13.0]

// the bundle: a grid of square tubes. U along model x (62 m), V along model y (56 m), metres from T.
const UE = [-31, -25, -19, -11, 11, 19, 25, 31]
const VE = [-28, -23, -18.4, -12, 9, 19.3, 28]
// The tube tops: the lower of a U-band height and a V-band height, read as steps off the two
// skyline photos (see the header), with the few tubes that break the rule set by hand.
const ROW_U = [175, 230, 345, ROOF, 375, 232, 188]
const COL_V = [173, 190, 296, ROOF, 372, 282]
const H: number[][] = ROW_U.map((hu) => COL_V.map((hv) => Math.min(hu, hv)))
H[4][3] = 330 // the front tube on the core (Graf photo)
H[3][2] = 315
H[0][0] = 84 // the low corner tube (Gzzz photo)
H[6][0] = 122
H[0][5] = 150
H[6][5] = 160
const NI = UE.length - 1, NJ = VE.length - 1
const hAt = (i: number, j: number) => (i < 0 || j < 0 || i >= NI || j >= NJ ? BASE : H[i][j])

// refuge / plant floors: dark bands across every tube face that passes them
const BANDS = [96, 174, 265, 358]

type Set = { glass: Part; joint: Part; roof: Part; trim: Part; crown: Part; crownGlass: Part }
const mk = (): Set => ({ glass: new Part(), joint: new Part(), roof: new Part(), trim: new Part(), crown: new Part(), crownGlass: new Part() })

/** A box from its plan rectangle and heights, all six faces unless told otherwise. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, o: { top?: boolean; bottom?: boolean } = {}) {
  face(p, [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], [0, -1, 0])
  face(p, [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], [1, 0, 0])
  face(p, [[x1, y1, z0], [x0, y1, z0], [x0, y1, z1], [x1, y1, z1]], [0, 1, 0])
  face(p, [[x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1]], [-1, 0, 0])
  if (o.top !== false) face(p, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [0, 0, 1])
  if (o.bottom) face(p, [[x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [x1, y0, z0]], [0, 0, -1])
}

function build(s: Set, d: boolean) {
  const G = 0.6, DEP = 0.8 // joint half-width and depth
  // four directions: outward normal, how to step to the neighbour, and the along-wall axis
  const dirs = [
    { n: [1, 0] as XY, di: 1, dj: 0 },
    { n: [-1, 0] as XY, di: -1, dj: 0 },
    { n: [0, 1] as XY, di: 0, dj: 1 },
    { n: [0, -1] as XY, di: 0, dj: -1 },
  ]
  // the exposed z-range of cell (i,j) toward a direction
  const exposed = (i: number, j: number, D: (typeof dirs)[number]): [number, number] | null => {
    if (i < 0 || j < 0 || i >= NI || j >= NJ) return null
    const h = H[i][j], hn = hAt(i + D.di, j + D.dj)
    return h > hn + 0.01 ? [Math.max(hn, BASE), h] : null
  }
  const lap = (a: [number, number] | null, b: [number, number] | null): [number, number] | null => {
    if (!a || !b) return null
    const lo = Math.max(a[0], b[0]), hi = Math.min(a[1], b[1])
    return hi > lo + 0.01 ? [lo, hi] : null
  }

  for (let i = 0; i < NI; i++) for (let j = 0; j < NJ; j++) {
    const h = H[i][j]
    const x0 = T[0] + UE[i], x1 = T[0] + UE[i + 1], y0 = T[1] + VE[j], y1 = T[1] + VE[j + 1]
    // the tube's top
    {
      // a parapet round each tube top: lip, inner faces, the roof a metre down
      const e = 0.45, r = 1.1
      const o: V3[] = [[x0, y0, h], [x1, y0, h], [x1, y1, h], [x0, y1, h]]
      const n: V3[] = [[x0 + e, y0 + e, h], [x1 - e, y0 + e, h], [x1 - e, y1 - e, h], [x0 + e, y1 - e, h]]
      const lo = n.map((q) => [q[0], q[1], h - r] as V3)
      const inward: V3[] = [[0, 1, 0], [-1, 0, 0], [0, -1, 0], [1, 0, 0]]
      for (let k = 0; k < 4; k++) {
        const l = (k + 1) % 4
        face(s.roof, [o[k], o[l], n[l], n[k]], [0, 0, 1])
        face(s.glass, [lo[k], lo[l], n[l], n[k]], inward[k])
      }
      face(s.roof, lo, [0, 0, 1])
    }
    for (const D of dirs) {
      const ex = exposed(i, j, D)
      if (!ex) continue
      // the wall line: from p0 to p1 with the outside on the right (counter-clockwise round the cell)
      const xw = D.n[0] > 0 ? x1 : x0, yw = D.n[1] > 0 ? y1 : y0
      const along: XY = [-D.n[1], D.n[0]] // counter-clockwise tangent
      const vert = D.n[0] !== 0
      const sA = vert ? (D.n[0] > 0 ? y0 : y1) : D.n[1] > 0 ? x1 : x0
      const sB = vert ? (D.n[0] > 0 ? y1 : y0) : D.n[1] > 0 ? x0 : x1
      const P = (sv: number, z: number, dep = 0): V3 => (vert ? [xw - D.n[0] * dep, sv, z] : [sv, yw - D.n[1] * dep, z])
      // the neighbours along the wall: at sA (behind) and sB (ahead)
      const stepA: [number, number] = vert ? [0, D.n[0] > 0 ? -1 : 1] : [D.n[1] > 0 ? 1 : -1, 0]
      const nA = exposed(i + stepA[0], j + stepA[1], D), nB = exposed(i - stepA[0], j - stepA[1], D)
      const gA = lap(ex, nA), gB = lap(ex, nB)
      const cuts = [ex[0], ex[1], ...(gA ?? []), ...(gB ?? [])].filter((z) => z >= ex[0] && z <= ex[1]).sort((a, b) => a - b)
      const zs = cuts.filter((z, k) => k === 0 || z - cuts[k - 1] > 0.01)
      const sgn = Math.sign(sB - sA)
      const N3: V3 = [D.n[0], D.n[1], 0]
      for (let k = 0; k < zs.length - 1; k++) {
        const za = zs[k], zb = zs[k + 1], zm = (za + zb) / 2
        const inA = gA && zm > gA[0] && zm < gA[1], inB = gB && zm > gB[0] && zm < gB[1]
        const a = sA + (inA ? sgn * G : 0), b = sB - (inB ? sgn * G : 0)
        face(s.glass, [P(a, za), P(b, za), P(b, zb), P(a, zb)], N3)
        // bands: refuge floors, and the dark top band of each tube
        const bandZ = [...BANDS.filter((z) => z > za + 2 && z < zb - 2 && z < h - 8), ...(zb === h && h - za > 8 ? [h - 2.6] : [])]
        for (const z of bandZ) {
          const bh = d ? 1.1 : 1.3, out = 0.22
          const q0 = P(a, z - bh, -out), q1 = P(b, z - bh, -out), q2 = P(b, z + bh, -out), q3 = P(a, z + bh, -out)
          face(s.joint, [q0, q1, q2, q3], N3)
          face(s.joint, [P(a, z + bh), P(b, z + bh), q2, q3], [0, 0, 1])
          if (d) face(s.joint, [P(a, z - bh), q0, q1, P(b, z - bh)], [0, 0, -1])
        }
        // the detail LOD: the vertical mullion fins, in the glass colour so they read by their shading only
        {
          const L = Math.abs(b - a), nf = Math.round(L / (d ? 1.8 : 5.4))
          const tt: V3 = [along[0], along[1], 0], fo = 0.18, fw = 0.16
          for (let f = 1; f < nf; f++) {
            const sv = a + ((b - a) * f) / nf
            face(s.glass, [P(sv - sgn * fw, za, -fo), P(sv + sgn * fw, za, -fo), P(sv + sgn * fw, zb, -fo), P(sv - sgn * fw, zb, -fo)], N3)
            face(s.glass, [P(sv - sgn * fw, za, 0), P(sv - sgn * fw, za, -fo), P(sv - sgn * fw, zb, -fo), P(sv - sgn * fw, zb, 0)], tt.map((v) => -v) as V3)
            face(s.glass, [P(sv + sgn * fw, za, -fo), P(sv + sgn * fw, za, 0), P(sv + sgn * fw, zb, 0), P(sv + sgn * fw, zb, -fo)], tt)
          }
        }
        // the detail LOD: thin floor-group lines every four storeys (dark mullion transoms in the photos)
        if (d) for (let z = BASE + 18.4; z < zb - 3; z += 18.4) {
          if (z < za + 2 || BANDS.some((q) => Math.abs(q - z) < 4)) continue
          const out = 0.14, t = 0.22
          face(s.joint, [P(a, z - t, -out), P(b, z - t, -out), P(b, z + t, -out), P(a, z + t, -out)], N3)
          face(s.joint, [P(a, z + t), P(b, z + t), P(b, z + t, -out), P(a, z + t, -out)], [0, 0, 1])
        }
      }
      // the joint (a real groove) shared with the neighbour ahead, drawn once from this side
      if (gB) {
        const sJ = sB, [za, zb] = gB
        const tA: V3 = [along[0], along[1], 0]
        face(s.joint, [P(sJ - sgn * G, za, DEP), P(sJ + sgn * G, za, DEP), P(sJ + sgn * G, zb, DEP), P(sJ - sgn * G, zb, DEP)], N3)
        face(s.joint, [P(sJ - sgn * G, za, 0), P(sJ - sgn * G, za, DEP), P(sJ - sgn * G, zb, DEP), P(sJ - sgn * G, zb, 0)], tA)
        face(s.joint, [P(sJ + sgn * G, za, 0), P(sJ + sgn * G, za, DEP), P(sJ + sgn * G, zb, DEP), P(sJ + sgn * G, zb, 0)], tA.map((v) => -v) as V3)
      }
    }
  }

  // ---- the pale lantern box on the core's roof (the Graf photo's white cap)
  box(s.trim, T[0] - 8.2, T[0] + 8.2, T[1] - 9.6, T[1] + 6.4, ROOF - 1.1, ROOF + 3.4)

  // ---- the crown mast: four posts, ring bars, a glass core; on the core's +V side
  const mx0 = T[0] - 6.1, mx1 = T[0] + 6.1, my0 = T[1] + 1.4, my1 = T[1] + 9.6
  const MT = TOP - 1.4
  box(s.crownGlass, mx0 + 0.7, mx1 - 0.7, my0 + 0.7, my1 - 0.7, MAST_BASE, MT - 0.4)
  const post = 1.0
  for (const [px, py] of [[mx0, my0], [mx1 - post, my0], [mx1 - post, my1 - post], [mx0, my1 - post]] as XY[]) box(s.crown, px, px + post, py, py + post, MAST_BASE, MT)
  if (d) for (const [px, py] of [[(mx0 + mx1) / 2 - 0.35, my0], [(mx0 + mx1) / 2 - 0.35, my1 - 0.7], [mx0, (my0 + my1) / 2 - 0.35], [mx1 - 0.7, (my0 + my1) / 2 - 0.35]] as XY[]) box(s.crown, px, px + 0.7, py, py + 0.7, ROOF, MT)
  const nBars = d ? 13 : 9
  for (let k = 0; k <= nBars; k++) {
    const z = ROOF + 2 + ((MT - 1 - ROOF - 2) * k) / nBars
    const t = d ? 0.7 : 1.0
    box(s.crown, mx0, mx1, my0, my1, z, z + t, { top: true, bottom: true })
  }
  box(s.crown, mx0, mx1, my0, my1, MT - 1, MT)
  // the finial
  box(s.crown, T[0] - 0.5, T[0] + 0.5, (my0 + my1) / 2 - 0.5, (my0 + my1) / 2 + 0.5, MT, TOP)

  // ---- the podium: six retail storeys on the OSM outline, a pale parapet band
  prism(s.glass, PODIUM, 0, BASE - 3, { top: false })
  prism(s.trim, PODIUM, BASE - 3, BASE, { top: false })
  const ring = ccw(PODIUM), inset = offsetRing(ring, -0.8)
  for (let k = 0; k < ring.length; k++) {
    const l = (k + 1) % ring.length, a = ring[k], b = ring[l], ia = inset[k], ib = inset[l]
    const nx = b[1] - a[1], ny = -(b[0] - a[0]), L = Math.hypot(nx, ny)
    face(s.trim, [[a[0], a[1], BASE], [b[0], b[1], BASE], [ib[0], ib[1], BASE], [ia[0], ia[1], BASE]], [0, 0, 1])
    face(s.trim, [[ia[0], ia[1], BASE - 1], [ib[0], ib[1], BASE - 1], [ib[0], ib[1], BASE], [ia[0], ia[1], BASE]], [-nx / L, -ny / L, 0])
    // the podium's vertical glazing fins (silver, the Kien Mike photo)
    const step = d ? 4.5 : 9
    const nf = Math.floor(L / step)
    for (let f = 1; f < nf; f++) {
      const t = f / nf, cx = a[0] + (b[0] - a[0]) * t, cy = a[1] + (b[1] - a[1]) * t
      const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, w = 0.25, dep = 0.55
      const q = (s0: number, o: number, z: number): V3 => [cx + ux * s0 + (nx / L) * o, cy + uy * s0 + (ny / L) * o, z]
      face(s.trim, [q(-w, dep, 0), q(w, dep, 0), q(w, dep, BASE - 3), q(-w, dep, BASE - 3)], [nx / L, ny / L, 0])
      face(s.trim, [q(-w, 0, 0), q(-w, dep, 0), q(-w, dep, BASE - 3), q(-w, 0, BASE - 3)], [-ux, -uy, 0])
      face(s.trim, [q(w, dep, 0), q(w, 0, 0), q(w, 0, BASE - 3), q(w, dep, BASE - 3)], [ux, uy, 0])
      face(s.trim, [q(-w, 0, BASE - 3), q(-w, dep, BASE - 3), q(w, dep, BASE - 3), q(w, 0, BASE - 3)], [0, 0, 1])
    }
  }
  roofCap(s.roof, inset, BASE - 1)
}

// ---- Materials and output ----------------------------------------------------------------------

const GLASS: MaterialSpec = { ...PALETTE.window, color: 0x6a83a0 }
const JOINT: MaterialSpec = finish('lm81-joint', 0x4f5a66, 0.6)
const ROOFM: MaterialSpec = PALETTE.roof
const TRIM: MaterialSpec = PALETTE.trim
const CROWN: MaterialSpec = finish('neon-lm81-crown', 0xb9c2ca, 0.5)
const CROWN_GLASS: MaterialSpec = windowVariant(2, 0x5a6b7c)

const low = mk(), det = mk()
build(low, false)
build(det, true)
const layers = (s: Set): Layer[] => [
  { part: s.glass, material: GLASS },
  { part: s.joint, material: JOINT },
  { part: s.roof, material: ROOFM },
  { part: s.trim, material: TRIM },
  { part: s.crown, material: CROWN },
  { part: s.crownGlass, material: CROWN_GLASS },
]

if (import.meta.main) {
  await saveLods('hcmc-landmark-81', 'Landmark 81', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres, bearing 52; origin at the centroid of the OSM outline way/622296615, on the ground',
    bearing: 52, height: TOP,
  }, 5000)
}
