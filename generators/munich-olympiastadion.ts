/**
 * Olympiastadion, Olympiapark, Munich: procedural, CC0-1.0.
 * bun generators/munich-olympiastadion.ts
 *
 * Also builds the detail model: bun generators/munich-olympiastadion.ts --detail
 * (models/munich-olympiastadion.detail.glb: the finer cable net, finer
 * roof and stands; the catalog should carry "detail" and "detailZoom": 16).
 *
 * Uses the geometry kit exported by generators/munich-olympiaturm.ts.
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin: the
 * centroid of OSM way/419656920 (leisure=stadium); z = 0 is the field.
 *
 * Behnisch & Partner with Frei Otto (roof), 1968-72. The bowl is two thirds
 * earthwork, the field just under 5 m below the original ground; the west
 * (main) stand is built up and carries the stadium's share of the
 * Olympiapark tent roof: acrylic panels on a cable net, lifted into humps
 * by eight tilted steel masts behind the stand, edged at the front by the
 * 440 m edge cable and tied down at the back.
 *
 * Roof split: the Olympiapark roof is one system over the stadium, the
 * paths and the hall/pool; OSM maps the stadium's part as its own way
 * (way/25001469, 33,400 m2 against the published 34,550 m2) and this model
 * draws exactly that, with its eight masts, their backstay anchors and the
 * edge cable's two tails (ways 117515278/79) to their anchor blocks (ways
 * 117477617/19). The walkway roofs toward the hall (ways 117470701,
 * 117477621, 302726370, ...) and the hall and pool are left to other models.
 *
 * Published (de.wikipedia "Olympiastadion München"): field 105 x 68 m,
 * eight-lane 400 m track; outer size 260 x 250 m; up to 88 rows at 0.8 m;
 * pitch just under 5 m below the original ground; tent roof 74,800 m2 in
 * all, 34,550 m2 over the stadium; twelve pylons, eight over the stadium;
 * cable-net mesh 75 cm; the 440 m edge cable over the main stand; anchors
 * up to 4,000 t.
 * OSM (measured in plan): the stadium outline (the stands' outer edge);
 * the lettered grandstand blocks A-Z (the stands' inner edge, fitted as a
 * superellipse 132 x 179 m about (3.6, 0.5), and the aisles between the
 * blocks); the VIP box (way/51366126); the roof outline, split at its ends
 * into the front edge and the scalloped back edge; the eight masts
 * (nodes 12861004093, ...098, 12861016702, ...718, ...721, ...724, ...728,
 * ...732); the eight 1.5 m concrete anchor blocks behind them (ways
 * 117479842, 845, 850, 852, 855, 858, 117479843, 117479856); the two
 * east floodlight towers (nodes 1323456670, 1323456776).
 * Terrain (Mapterhorn, read for the anchors' ground and the outside): the
 * field at 507.2 m; the east bank's crest 20-23 m above the field, the
 * ground behind the west stand 5-7 m, under the masts 7-13 m.
 * Estimated from photos (Olympiaberg 2019 from the south, the Olympiaturm
 * 2022 and 2018 from the east, scaled on the 105 m field and the stands):
 * - the stands' rake, 0.36 m a metre, so the rim is about 22 m on the west,
 *   20 m east and 15 m at the ends (lower at the ends, as published);
 * - the roof: the front edge at 27-33 m in shallow arches between the humps,
 *   down to 17 m at its ends; the humps 43 m (39 m at the two end ones),
 *   on the line over the top of the stand, as broad bells that sag into
 *   saddles between the mast heads; the back edge 12 m at the tie-down
 *   cusps, up to 20 m between;
 * - the roof skin light grey and mostly opaque (88%), as it reads in the
 *   photos, the stands under it mostly hidden;
 * - the masts 66 m above the field, slim, near vertical (1.5 m lean), with
 *   small heads and short steep backstays (24 m out, toward each OSM anchor
 *   block; the blocks themselves drawn small and low); the floodlight
 *   towers 62 m with a lamp head leaning in; two lamp frames hung from the
 *   front edge.
 * The net is drawn as real cable members (every third radial cable and
 * three long cables in the low model; every radial and nine long cables in
 * the detail model), not at its real 75 cm mesh.
 *
 * Elevation 0. Mapterhorn already shows the dug field and the earth-built
 * stands, so the map's lowest ground under the plan is the field. The
 * published 5 m (field below the original ground) as a negative elevation
 * would sink the lower rows under the terrain's own copy of the earth
 * stands (terrain check at -5: 3,429 m2 of seats buried up to 4.1 m); at 0
 * the check is ok. Doubt: on this site (22 m of relief over the plan) the
 * map's drape lifts the parts above 25 m by the mean rise, about 8.5 m.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 * - "Blick vom Olympiaberg auf das Olympiastadion.jpg", Amrei-Marie, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Blick_vom_Olympiaberg_auf_das_Olympiastadion.jpg
 * - "Olympiastadion München von oben.jpg", Deaq, CC BY-SA 3.0 (from the tower)
 *   https://commons.wikimedia.org/wiki/File:Olympiastadion_M%C3%BCnchen_von_oben.jpg
 * - "20220923 Olympic Stadium Munich.jpg", Flocci Nivis, CC BY 4.0 (from the tower)
 *   https://commons.wikimedia.org/wiki/File:20220923_Olympic_Stadium_Munich.jpg
 * - "München - Olympiapark (Luftbild).jpg", Maximilian Dörrbecker (Chumwa), CC BY-SA 2.5
 *   https://commons.wikimedia.org/wiki/File:M%C3%BCnchen_-_Olympiapark_(Luftbild).jpg
 * - "Munich - Frei Otto Tensed structures - 5293.jpg", Jorge Royan, CC BY-SA 3.0
 *   (under the roof: masts through the net, the hanging lamps)
 *   https://commons.wikimedia.org/wiki/File:Munich_-_Frei_Otto_Tensed_structures_-_5293.jpg
 * - "Zeltdach Olympiastadion München.JPG", Wikiolo, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Zeltdach_Olympiastadion_M%C3%BCnchen.JPG
 *
 * Left out: the track and field (the map's ground), the scoreboards, the
 * Olympic flame bowl, railings, the acrylic panels' joints.
 * Doubts: all roof and mast heights are photo-scaled (no published
 * figures found for the stadium's masts and humps); the hump shapes are
 * drawn as concave tents about each peak, the real net's form-found
 * surface is subtler. The bowl's outside is earth berm: its wall stops
 * 1 m below the ground Mapterhorn shows outside (a 2.5 m plinth on the
 * east), and the terrain carries the rest.
 *
 * Night: the floodlight faces are `lamp-floodlight`; the roof is `glass`
 * (stays dark).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { TAU, add, basis, box, face, flat, lathe, mul, tube, unit } from './munich-olympiaturm'

/**
 * A round cable through points, with one shared ring of vertices at each
 * point (frames carried along the path), so neighbouring segments weld.
 */
function cable(p: Part, pts: V3[], r: number, k = 4) {
  if (pts.length < 2) return
  const tang = pts.map((_, i) => unit(sub3(pts[Math.min(pts.length - 1, i + 1)], pts[Math.max(0, i - 1)])))
  let [e1] = basis(tang[0])
  const rings: { pos: V3[]; nrm: V3[] }[] = []
  for (let i = 0; i < pts.length; i++) {
    const t = tang[i]
    // carry e1 along: remove its component along the new tangent
    e1 = unit(sub3(e1, mul(t, e1[0] * t[0] + e1[1] * t[1] + e1[2] * t[2])))
    const e2: V3 = [t[1] * e1[2] - t[2] * e1[1], t[2] * e1[0] - t[0] * e1[2], t[0] * e1[1] - t[1] * e1[0]]
    const nrm = Array.from({ length: k }, (_, j) => { const a = (j / k) * TAU; return add(mul(e1, Math.cos(a)), mul(e2, Math.sin(a))) })
    rings.push({ nrm, pos: nrm.map((n) => add(pts[i], mul(n, r))) })
  }
  for (let i = 0; i < pts.length - 1; i++) {
    const A = rings[i], B = rings[i + 1]
    for (let j = 0; j < k; j++) {
      const l = (j + 1) % k
      face(p, [A.pos[j], A.pos[l], B.pos[l], B.pos[j]], [A.nrm[j], A.nrm[l], B.nrm[l], B.nrm[j]])
    }
  }
}
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]

// ------------------------------------------------------------------ data ---
// OSM, in metres from the anchor (the centroid of way/419656920).
// The stadium's part of the tent roof (way/25001469), split at its two
// ends into the front edge (the 440 m edge cable over the west stand) and
// the scalloped back edge, both running south to north.
const ROOF_OUTER: [number, number][] = [[38.2, -130.1], [32.8, -132.2], [28.0, -135.9], [26.1, -138.5], [24.8, -142.4], [25.0, -146.0], [25.4, -148.4], [20.9, -147.8], [17.1, -147.9], [13.7, -149.8], [10.3, -152.8], [9.0, -156.6], [5.7, -154.5], [-3.2, -151.7], [-12.9, -152.9], [-21.0, -155.8], [-26.1, -158.9], [-30.4, -157.3], [-34.6, -148.8], [-38.5, -146.0], [-43.2, -144.7], [-50.9, -144.1], [-59.4, -139.9], [-62.8, -134.9], [-66.1, -132.5], [-69.7, -130.4], [-76.3, -128.2], [-84.7, -128.1], [-88.7, -125.0], [-89.6, -119.1], [-91.9, -114.6], [-95.1, -111.2], [-98.7, -108.4], [-104.4, -105.2], [-111.3, -98.3], [-113.8, -91.5], [-118.5, -85.1], [-124.7, -79.9], [-130.3, -77.0], [-132.1, -73.4], [-130.5, -66.9], [-130.6, -60.5], [-133.0, -53.5], [-138.3, -46.5], [-139.2, -42.0], [-141.1, -37.8], [-140.8, -30.1], [-142.7, -22.2], [-146.5, -16.0], [-151.2, -12.9], [-151.8, -8.1], [-148.1, -3.6], [-146.3, 3.1], [-146.3, 9.9], [-147.8, 17.7], [-146.8, 28.9], [-144.1, 34.7], [-143.1, 41.5], [-143.9, 49.3], [-146.4, 55.3], [-145.6, 59.7], [-139.6, 63.7], [-136.3, 67.2], [-133.9, 71.5], [-131.8, 77.5], [-130.9, 84.4], [-125.9, 93.4], [-121.1, 97.7], [-118.1, 103.3], [-116.8, 108.9], [-116.7, 115.1], [-114.4, 118.6], [-107.7, 120.0], [-100.6, 123.7], [-93.5, 129.8], [-89.4, 136.1], [-83.0, 142.9], [-76.3, 144.3], [-70.6, 148.1], [-67.0, 152.6], [-65.0, 158.2], [-61.2, 161.0], [-54.6, 160.9], [-47.5, 162.0], [-41.5, 164.5], [-36.4, 167.9], [-30.9, 169.0], [-26.3, 170.6], [-19.6, 170.3], [-12.9, 171.7], [-7.1, 174.2], [-3.6, 178.8], [0.2, 179.9], [5.3, 177.2], [11.2, 176.1], [16.4, 176.2], [22.4, 178.4], [30.6, 176.2], [36.7, 176.9], [41.8, 178.9], [44.7, 181.4]]
const ROOF_INNER: [number, number][] = [[36.5, -104.2], [23.5, -101.4], [11.2, -98.2], [-4.2, -88.0], [-14.4, -80.7], [-22.5, -74.0], [-27.4, -68.0], [-33.6, -59.9], [-45.7, -43.2], [-54.8, -24.6], [-60.6, -0.2], [-60.9, 18.0], [-59.0, 34.4], [-56.5, 46.7], [-51.8, 59.9], [-43.2, 75.0], [-34.8, 88.1], [-23.8, 97.4], [-9.1, 107.5], [3.4, 113.8], [13.9, 118.7], [23.7, 121.3], [41.2, 124.5], [52.2, 125.9]]
const OUTLINE: [number, number][] = [[-27.0, 125.5], [-6.6, 128.1], [18.4, 128.9], [42.8, 123.5], [70.0, 106.7], [89.1, 88.1], [104.0, 63.7], [112.6, 38.4], [118.2, 13.7], [120.5, -15.5], [115.5, -43.9], [104.2, -70.8], [87.0, -91.6], [67.0, -108.6], [45.1, -120.8], [31.2, -124.6], [16.1, -127.7], [3.1, -129.8], [-9.7, -129.7], [-22.2, -128.2], [-38.0, -124.0], [-55.8, -117.2], [-74.8, -102.8], [-88.4, -87.4], [-97.8, -72.0], [-107.6, -51.2], [-114.8, -31.0], [-119.5, -7.8], [-120.9, 13.5], [-117.3, 39.0], [-107.9, 63.0], [-95.2, 82.6], [-74.8, 103.5], [-53.4, 117.5]]
const MASTS: [number, number][] = [[-24.4, -148.2], [-81.5, -118.8], [-123.6, -71.3], [-143.3, -9.1], [-137.4, 55.5], [-106.0, 109.3], [-56.1, 148.8], [0.9, 166.1]]
// backstay anchors, in mast order (OSM ways 117479842, 850, 858, 855, 852, 845, 843, 856)
const ANCHORS: [number, number][] = [[-43.8, -201.5], [-109.6, -154.8], [-164.3, -94.4], [-187.5, -15.5], [-184.5, 69.0], [-148.7, 143.5], [-84.6, 195.2], [-3.9, 199.3]]
// edge-cable anchors, south and north (OSM ways 117477619, 117477617)
const TAIL_ANCHORS: [number, number][] = [[93.9, -114.6], [89.1, 128.2]]
const LIGHT_TOWERS: [number, number][] = [[107.1, -72.5], [70.2, 110.5]]
const BLOCKS: [string, number, number][] = [['L', 75.6, 64.9], ['M', 85.4, 43.3], ['N', 91.5, 20.7], ['O', 94.5, -3.4], ['P', 93.7, -28.1], ['Q', 88.6, -51.0], ['R', 78.6, -71.0], ['S', 64.2, -86.9], ['K', 65.1, 86.1], ['T', 47.7, -99.4], ['J', 45.7, 91.2], ['I', 24.0, 105.2], ['H', 4.5, 111.8], ['G', -14.5, 110.5], ['F', -33.9, 105.3], ['E', -53.9, 94.3], ['V', 21.6, -108.8], ['U', 33.7, -106.3], ['W', -0.3, -115.9], ['Y', -64.5, -83.4], ['X', -28.5, -106.7], ['C', -78.6, 63.6], ['B', -86.2, 46.0], ['A', -90.6, 26.4], ['Z', -86.4, -21.6], ['LOGE', -69.9, -15.8], ['D', -65.6, 82.6]]

const DETAIL = process.argv.includes('--detail')

// ------------------------------------------------------------- materials ---
const seats = new Part()    // the green seats
const concrete = new Part() // walls, aisles, rim walkway, anchor blocks
const acrylic = new Part()  // the roof's acrylic panels (translucent)
const steel = new Part()    // masts, cables, net, lattice towers
const dark = new Part()     // vomitories, the VIP box, floodlight backs
const lamps = new Part()    // floodlight faces

type P2 = [number, number]
const FC: P2 = [3.6, 0.5] // the field's centre: the middle of the stands' inner edge
const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t))
const lerp2 = (a: P2, b: P2, t: number): P2 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const dist2 = (a: P2, b: P2) => Math.hypot(a[0] - b[0], a[1] - b[1])

// ---------------------------------------------------------------- stands ---
/** The stands' inner edge: a superellipse round the track, from the OSM blocks' inner corners. */
function inner(a: number): P2 {
  const A = 66, B = 89.5, n = 2.35
  const c = Math.cos(a), s = Math.sin(a)
  const r = Math.pow(Math.pow(Math.abs(c) / A, n) + Math.pow(Math.abs(s) / B, n), -1 / n)
  return [FC[0] + r * c, FC[1] + r * s]
}
/** The outline (way/419656920) hit by a ray from the field's centre. */
function outer(a: number): P2 {
  const d: P2 = [Math.cos(a), Math.sin(a)]
  let best = Infinity
  for (let i = 0; i < OUTLINE.length; i++) {
    const p = OUTLINE[i], q = OUTLINE[(i + 1) % OUTLINE.length]
    const ex = q[0] - p[0], ey = q[1] - p[1]
    const den = d[0] * ey - d[1] * ex
    if (Math.abs(den) < 1e-9) continue
    const t = ((p[0] - FC[0]) * ey - (p[1] - FC[1]) * ex) / den
    const u = ((p[0] - FC[0]) * d[1] - (p[1] - FC[1]) * d[0]) / den
    if (t > 0 && u >= 0 && u <= 1) best = Math.min(best, t)
  }
  return [FC[0] + best * d[0], FC[1] + best * d[1]]
}
const FRONT = 1.4  // the wall at the front of the stands, above the field
const RAKE = 0.36  // rise per metre of stand depth (88 rows at 0.8 m to about 22 m)
const WALK = 3.0   // the walkway round the top
/**
 * The ground just outside the bowl (Mapterhorn, 125 m from the field's
 * centre, every 30 degrees anticlockwise from east), above the field.
 */
const GROUND_OUT = [21.3, 20.9, 16.2, 8.6, 7.1, 6.8, 10.0, 10.1, 11.0, 8.3, 13.3, 17.9]
function groundOut(a: number) {
  const t = (((a / TAU) * 12) % 12 + 12) % 12, i = Math.floor(t), f = t - i
  return GROUND_OUT[i] * (1 - f) + GROUND_OUT[(i + 1) % 12] * f
}
const rimAt = (a: number) => FRONT + RAKE * (dist2(inner(a), outer(a)) - WALK)
{
  const K = DETAIL ? 144 : 72, T = [0, 0.34, 0.68, 1]
  const ring = (a: number) => {
    const pi = inner(a), po = outer(a), pw = lerp2(po, pi, WALK / dist2(pi, po)), rim = rimAt(a)
    const seat = T.map((t) => { const p = lerp2(pi, pw, t); return [p[0], p[1], FRONT + (rim - FRONT) * Math.pow(t, 1.15)] as V3 })
    // The outside is earth berm: the wall stops 1 m below the ground the
    // terrain shows outside (at least a 2.5 m plinth), and the map's
    // terrain carries the rest.
    const base = Math.max(0, Math.min(rim - 2.5, groundOut(a) - 1))
    return { pi, po, pw, rim, seat, base }
  }
  const R = Array.from({ length: K }, (_, i) => ring((i / K) * TAU))
  for (let i = 0; i < K; i++) {
    const A = R[i], B = R[(i + 1) % K]
    // front wall, facing the field
    concrete.quad([B.pi[0], B.pi[1], 0], [A.pi[0], A.pi[1], 0], [A.pi[0], A.pi[1], FRONT], [B.pi[0], B.pi[1], FRONT])
    // the seats, in three bands up the rake
    for (let k = 0; k < T.length - 1; k++) seats.quad(B.seat[k], A.seat[k], A.seat[k + 1], B.seat[k + 1])
    // walkway round the top, and the outer wall down to the ground
    concrete.quad(B.seat[T.length - 1], A.seat[T.length - 1], [A.po[0], A.po[1], A.rim], [B.po[0], B.po[1], B.rim])
    concrete.quad([B.po[0], B.po[1], B.rim], [A.po[0], A.po[1], A.rim], [A.po[0], A.po[1], A.base], [B.po[0], B.po[1], B.base])
  }
  // Radial aisles between the lettered blocks (OSM's grandstand ways), as
  // raised concrete strips; the broad blocks Y and Z are split in two.
  const ang = (x: number, y: number) => Math.atan2(y - FC[1], x - FC[0])
  const blocks = BLOCKS.filter(([n]) => n !== 'LOGE').map(([n, x, y]) => ({ n, a: ang(x, y) })).sort((p, q) => p.a - q.a)
  const aisles: number[] = []
  for (let i = 0; i < blocks.length; i++) {
    const a0 = blocks[i].a, a1 = blocks[(i + 1) % blocks.length].a + (i === blocks.length - 1 ? TAU : 0)
    const gap = a1 - a0, parts = Math.max(1, Math.round(gap / (TAU / 26)))
    for (let k = 1; k <= parts; k++) aisles.push(a0 + (gap * (k - 0.5)) / parts)
  }
  const seatAt = (a: number, t: number): V3 => {
    const pi = inner(a), po = outer(a), pw = lerp2(po, pi, WALK / dist2(pi, po)), rim = rimAt(a)
    const p = lerp2(pi, pw, t)
    return [p[0], p[1], FRONT + (rim - FRONT) * Math.pow(t, 1.15)]
  }
  for (const a of aisles) {
    const w = 0.85 / 80 // about 1.7 m across at the middle of the stand
    const S = [0, 0.34, 0.68, 1].map((t) => [seatAt(a - w, t), seatAt(a + w, t)].map((p) => add(p, [0, 0, 0.12])) as [V3, V3])
    for (let k = 0; k < S.length - 1; k++) concrete.quad(S[k][1], S[k][0], S[k + 1][0], S[k + 1][1])
  }
  // Vomitories: a dark mouth in the middle of each block.
  for (const { a } of blocks) {
    const w = 2.2 / 80
    const q = [seatAt(a - w, 0.44), seatAt(a + w, 0.44), seatAt(a + w, 0.52), seatAt(a - w, 0.52)].map((p) => add(p, [0, 0, 0.08]))
    dark.quad(q[1], q[0], q[3], q[2])
  }
  // The VIP box (OSM "LOGE", way/51366126) mid-way up the west stand.
  {
    const c: P2 = [-69.9, -15.8], a = ang(...c), d: V3 = [Math.cos(a), Math.sin(a), 0], e: V3 = [-Math.sin(a), Math.cos(a), 0]
    const z0 = seatAt(a, 0.3)[2]
    box(dark, [c[0], c[1], 0], d, e, 6, 13, z0, z0 + 5.5)
    box(concrete, [c[0], c[1], 0], d, e, 6.3, 13.3, z0 + 5.5, z0 + 6.2)
  }
}

// ------------------------------------------------------------------ roof ---
/** Points along a polyline at given arc-length fractions. */
function along(pl: P2[]) {
  const cum = [0]
  for (let i = 1; i < pl.length; i++) cum.push(cum[i - 1] + dist2(pl[i - 1], pl[i]))
  const L = cum[cum.length - 1]
  const at = (s: number): P2 => {
    const d = Math.min(L, Math.max(0, s))
    let i = 1
    while (i < pl.length - 1 && cum[i] < d) i++
    const t = (d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1)
    return lerp2(pl[i - 1], pl[i], t)
  }
  const nearest = (p: P2) => {
    let best = 0, bd = Infinity
    for (let s = 0; s <= L; s += 0.5) { const q = at(s); const dd = dist2(p, q); if (dd < bd) { bd = dd; best = s } }
    return best
  }
  return { L, at, nearest }
}
const IN = along(ROOF_INNER), OUT = along(ROOF_OUTER)
// Break both edges at each mast, so the humps line up with their masts.
const brkIn = [0], brkOut = [0]
for (const m of MASTS) {
  brkIn.push(0) // set below, by angle
  brkOut.push(OUT.nearest(m))
}
brkIn.push(IN.L); brkOut.push(OUT.L)
// On the front edge, the point in line with the mast as seen from the field's centre.
for (let k = 1; k <= MASTS.length; k++) {
  const m = MASTS[k - 1], a = Math.atan2(m[1] - FC[1], m[0] - FC[0])
  let best = 0, bd = Infinity
  for (let s = 0; s <= IN.L; s += 0.5) {
    const q = IN.at(s), b = Math.atan2(q[1] - FC[1], q[0] - FC[0])
    const dd = Math.abs(Math.atan2(Math.sin(b - a), Math.cos(b - a)))
    if (dd < bd) { bd = dd; best = s }
  }
  brkIn[k] = best
}
const NS = DETAIL ? 10 : 5 // samples per segment along the roof
const U: { pi: P2; po: P2; seg: number; f: number }[] = []
for (let k = 0; k < brkIn.length - 1; k++) {
  for (let j = 0; j < NS; j++) {
    const f = j / NS
    U.push({ pi: IN.at(brkIn[k] + (brkIn[k + 1] - brkIn[k]) * f), po: OUT.at(brkOut[k] + (brkOut[k + 1] - brkOut[k]) * f), seg: k, f })
  }
}
U.push({ pi: IN.at(IN.L), po: OUT.at(OUT.L), seg: brkIn.length - 2, f: 1 })
const NU = U.length

// Heights above the field. The front edge cable rides at about 29 m and
// drops to 17 m at its two ends; the back edge is tied down near the ground
// at the scallops' cusps (12 m above the field, 3-6 m above the ground
// behind the west stand) and lifts between them.
const ZI = 27, ZI_ARCH = 6, ZI_END = 17
/**
 * The front edge cable: a run of shallow arches, highest in front of each
 * hump (33 m) and sagging between them (27 m), dropping to 17 m at its ends.
 */
const ziAt = (i: number) => {
  const u = U[i]
  const arch = ZI + ZI_ARCH * Math.pow(Math.sin(Math.PI * (u.f + 0.5)), 2)
  if (u.seg === 0) return ZI_END + (arch - ZI_END) * smooth(u.f * 1.4)
  if (u.seg === brkIn.length - 2) return ZI_END + (arch - ZI_END) * smooth((1 - u.f) * 1.4)
  return arch
}
// back edge: lift each point by how far it sits inside the scallop's chord
const zoAt = (() => {
  const fine: P2[] = []
  for (let s = 0; s <= OUT.L; s += 1) fine.push(OUT.at(s))
  const r = fine.map((p) => dist2(p, FC))
  const win = 18
  const lift = fine.map((_, i) => {
    let m = 0
    for (let j = Math.max(0, i - win); j <= Math.min(fine.length - 1, i + win); j++) m = Math.max(m, r[j])
    return m - r[i]
  })
  return (p: P2) => {
    let bi = 0, bd = Infinity
    for (let i = 0; i < fine.length; i++) { const d = dist2(fine[i], p); if (d < bd) { bd = d; bi = i } }
    return 12 + Math.min(8, lift[bi] * 0.9)
  }
})()
const ZO = U.map((u) => zoAt(u.po))
// v samples include the humps' line (0.64) so each tent keeps its peak
const VS = DETAIL ? [0, 0.06, 0.12, 0.19, 0.26, 0.33, 0.4, 0.47, 0.53, 0.59, 0.64, 0.69, 0.75, 0.82, 0.88, 0.94, 1] : [0, 0.12, 0.24, 0.36, 0.46, 0.55, 0.64, 0.73, 0.82, 0.91, 1]
// The humps: one tent peak per mast, 40% of the way back, 44 m up (the
// south and north ends a little lower), with concave flanks.
const PEAK_V = 0.64
const peaks = MASTS.map((_, k) => {
  const i = (k + 1) * NS
  const p = lerp2(U[i].pi, U[i].po, PEAK_V)
  const zp = k === 0 || k === MASTS.length - 1 ? 39 : 43
  return { p, zp }
})
const zBase = (i: number, v: number) => ziAt(i) + (ZO[i] - ziAt(i)) * Math.pow(v, 2.2)
function zRoof(i: number, v: number) {
  const P = lerp2(U[i].pi, U[i].po, v)
  const b = zBase(i, v)
  let z = b
  for (const { p, zp } of peaks) {
    // a broad bell, so the net sags smoothly from each mast head into saddles
    const d = dist2(P, p), R = 54
    if (d < R) z = Math.max(z, b + (zp - b) * (1 - (d / R) ** 2) ** 2)
  }
  return z
}
const RP: V3[][] = U.map((u, i) => VS.map((v) => { const p = lerp2(u.pi, u.po, v); return [p[0], p[1], zRoof(i, v)] as V3 }))
// The acrylic skin: a doubled-sided translucent surface.
{
  // smooth normals from the grid's neighbours, so the saddles shade softly
  const RN: V3[][] = RP.map((row, i) => row.map((_, j) => {
    const du = sub3(RP[Math.min(NU - 1, i + 1)][j], RP[Math.max(0, i - 1)][j])
    const dv = sub3(RP[i][Math.min(VS.length - 1, j + 1)], RP[i][Math.max(0, j - 1)])
    const n: V3 = [du[1] * dv[2] - du[2] * dv[1], du[2] * dv[0] - du[0] * dv[2], du[0] * dv[1] - du[1] * dv[0]]
    return unit(n[2] < 0 ? mul(n, -1) : n)
  }))
  for (let i = 0; i < NU - 1; i++) for (let j = 0; j < VS.length - 1; j++)
    face(acrylic, [RP[i][j], RP[i + 1][j], RP[i + 1][j + 1], RP[i][j + 1]], [RN[i][j], RN[i + 1][j], RN[i + 1][j + 1], RN[i][j + 1]])
}

// The cable net, drawn as real members: the radial cables at every
// second sample and the long cables at four (detail: eight) depths. The
// real mesh is 75 cm; this shows its direction and the surface's curvature.
{
  const lift: V3 = [0, 0, 0.15]
  const rStep = DETAIL ? 1 : 3, rr = DETAIL ? 0.12 : 0.2, sides = DETAIL ? 4 : 3
  for (let i = 0; i < NU; i += rStep) cable(steel, RP[i].map((p) => add(p, lift)), rr, sides)
  const longV = DETAIL ? [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9] : [0.25, 0.5, 0.75]
  for (const v of longV) {
    const pts = U.map((u, i) => { const p = lerp2(u.pi, u.po, v); return [p[0], p[1], zRoof(i, v) + 0.15] as V3 })
    cable(steel, pts, rr, sides)
  }
}
// The edge cables: the front one heavy, the back one lighter.
cable(steel, RP.map((r) => add(r[0], [0, 0, 0.2])), 0.55, DETAIL ? 8 : 4)
cable(steel, RP.map((r) => r[r.length - 1]), 0.35, DETAIL ? 6 : 3)
cable(steel, RP[0], 0.3, 3)
cable(steel, RP[NU - 1], 0.3, 3)
// The front cable's tails down to their anchor blocks on the east bank.
for (const [k, end] of [[0, RP[0][0]], [1, RP[NU - 1][0]]] as [number, V3][]) {
  const a = TAIL_ANCHORS[k]
  // the block is small and low: built from z 0 like everything else here,
  // so the map's drape stands it on the bank (3.6 m: the bank under it
  // rises steeply, and the drape would bury a lower one)
  tube(steel, end, [a[0], a[1], 3.3], 0.5, 0.5, 6)
  box(concrete, [a[0], a[1], 0], [1, 0, 0], [0, 1, 0], 3, 1.6, 0, 3.6)
}
// Tie-downs at the back edge's cusps.
{
  for (let i = 0; i < NU; i++) {
    const prev = ZO[Math.max(0, i - 1)], next = ZO[Math.min(NU - 1, i + 1)]
    if (!(ZO[i] <= prev && ZO[i] <= next && ZO[i] < 13.5)) continue
    const p = RP[i][VS.length - 1]
    const o = unit([p[0] - FC[0], p[1] - FC[1], 0])
    tube(steel, p, add(add(p, mul(o, 6)), [0, 0, -(p[2] - 6)]), 0.3, 0.3, 4)
  }
}
// The peaks' rings, where the hanging cables take the net.
for (const { p } of peaks) {
  const i0 = U.findIndex((_, i) => dist2(lerp2(U[i].pi, U[i].po, PEAK_V), p) < 0.01)
  const z = zRoof(i0, PEAK_V)
  lathe([[2.6, z - 0.5], [3.2, z], [2.6, z + 0.6], [2.6, z - 0.5]], () => steel, DETAIL ? 16 : 8, 30, [p[0], p[1], 0])
}

// ----------------------------------------------------------------- masts ---
// Eight steel masts behind the west stand (OSM nodes, man_made=mast),
// leaning back, each holding its hump by a pair of cables and stayed back
// to its concrete anchor block (OSM ways 1174798xx, 1.5 m).
const MAST_TOP = 66, MAST_LEAN = 1.5, STAY = 24
MASTS.forEach((m, k) => {
  const o = unit([m[0] - FC[0], m[1] - FC[1], 0])
  const base: V3 = [m[0], m[1], 0.1]
  const top: V3 = add(add(base, mul(o, MAST_LEAN)), [0, 0, MAST_TOP])
  const mid = add(base, mul(add(mul(o, MAST_LEAN), [0, 0, MAST_TOP]), 0.45))
  const sides = DETAIL ? 12 : 8
  tube(steel, base, mid, 0.5, 0.8, sides, false)
  tube(steel, mid, top, 0.8, 0.38, sides, false)
  lathe([[0.55, 0], [0.55, 1.0], [0, 1.2]], () => steel, sides, 40, top)
  // the pair of hanging cables to the hump's ring
  const pk = peaks[k], i0 = U.findIndex((_, i) => dist2(lerp2(U[i].pi, U[i].po, PEAK_V), pk.p) < 0.01)
  const zr = zRoof(i0, PEAK_V)
  const t = unit([-o[1], o[0], 0])
  for (const s of [-1, 1]) tube(steel, add(top, [0, 0, -0.8]), add([pk.p[0], pk.p[1], zr + 0.4], mul(t, s * 2.8)), 0.28, 0.28, 4)
  // a short, steep backstay down behind the mast, toward its anchor block
  // (OSM), and the block itself, small and low
  const a = ANCHORS[k], toA = unit([a[0] - m[0], a[1] - m[1], 0])
  tube(steel, add(top, [0, 0, -0.8]), [m[0] + toA[0] * STAY, m[1] + toA[1] * STAY, 0.6], 0.28, 0.28, 4)
  box(concrete, [a[0], a[1], 0], [o[0], o[1], 0], [-o[1], o[0], 0], 2.4, 1.6, 0, 1.5)
})

// ------------------------------------------------------- floodlights ---
// Two lattice towers on the east bank (OSM man_made=mast, lighting),
// leaning in over the stand, and two lamp frames hung under the front edge.
function lampHead(c: V3, facing: V3, w: number, h: number) {
  const f = unit(facing), e = unit([-f[1], f[0], 0])
  box(dark, c, unit([f[0], f[1], 0]), e, 0.8, w / 2, -h / 2, h / 2)
  const front = add(c, mul(unit([f[0], f[1], 0]), 0.85))
  flat(lamps, [add(front, add(mul(e, -w / 2 + 0.4), [0, 0, -h / 2 + 0.4])), add(front, add(mul(e, w / 2 - 0.4), [0, 0, -h / 2 + 0.4])), add(front, add(mul(e, w / 2 - 0.4), [0, 0, h / 2 - 0.4])), add(front, add(mul(e, -w / 2 + 0.4), [0, 0, h / 2 - 0.4]))], unit([f[0], f[1], 0]))
}
const LIGHT_Z = [16.9, 17.2]
LIGHT_TOWERS.forEach((l, k) => {
  const z0 = LIGHT_Z[k] - 1
  const toField = unit([FC[0] - l[0], FC[1] - l[1], 0])
  const H = 62 - z0, lean = 7
  const e = unit([-toField[1], toField[0], 0])
  const leg = (s: number, t: number, h: number): V3 => {
    const half = 2.2 - 1.3 * (h / H)
    return add(add(add([l[0], l[1], z0 + h], mul(toField, lean * (h / H))), mul(toField, s * half)), mul(e, t * half))
  }
  const C = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  const LV = DETAIL ? 9 : 4
  for (const [s, t] of C) tube(steel, leg(s, t, 0), leg(s, t, H), 0.28, 0.2, 4, false)
  for (let j = 1; j <= LV; j++) {
    const h0 = (H * (j - 1)) / LV, h1 = (H * j) / LV
    for (let c = 0; c < 4; c++) {
      const [s0, t0] = C[c], [s1, t1] = C[(c + 1) % 4]
      tube(steel, leg(s0, t0, h1), leg(s1, t1, h1), 0.14, 0.14, 3, false)
      tube(steel, leg(s0, t0, h0), leg(s1, t1, h1), 0.12, 0.12, 3, false)
    }
  }
  lampHead(add(leg(0, 0, H), [0, 0, 3.2]), toField, 11, 6)
})
// hung under the front edge at the two ends of the west stand
for (const fi of [Math.round(NU * 0.28), Math.round(NU * 0.72)]) {
  const p = RP[fi][0]
  const toField = unit([FC[0] - p[0], FC[1] - p[1], 0])
  const c: V3 = add(p, [0, 0, -7])
  for (const s of [-1, 1]) tube(steel, add(c, add(mul([-toField[1], toField[0], 0], s * 2.5), [0, 0, 2.6])), add(p, mul([-toField[1], toField[0], 0], s * 2.5)), 0.12, 0.12, 3, false)
  lampHead(c, toField, 6, 5)
}

// ---------------------------------------------------------------- output ---
const parts = [
  { part: seats, material: finish('stadium-seat-green', 0x9cb36a) },
  { part: concrete, material: finish('stadium-concrete', 0xccc8c0) },
  { part: acrylic, material: { name: 'glass', color: 0xd2d6d8, roughness: 0.3, opacity: 0.88, doubleSided: true } },
  { part: steel, material: finish('stadium-steel', 0xa7adb2) },
  { part: dark, material: finish('stadium-dark', 0x50565d) },
  { part: lamps, material: finish('lamp-floodlight', 0xd9d9d2) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (process.env.STATS) console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(" "))
const cap = DETAIL ? 40000 : 6500
if (triangles > cap) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Olympiastadion', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the field below the way/419656920 centroid',
  bearing: 0, elevation: 0, height: MAST_TOP + 1.6, osm: 'way/419656920',
})
if (glb.length > (DETAIL ? 1_500_000 : 250_000)) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL(`../models/munich-olympiastadion${DETAIL ? '.detail' : ''}.glb`, import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
