/**
 * 1201 Third Avenue (1988, Kohn Pedersen Fox), Seattle — original procedural
 * geometry, CC0-1.0.
 * bun generators/sea-1201-third-avenue.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the OSM
 * outline's area centroid, -122.3361630, 47.6072043) on the lowest ground
 * under the footprint (26.5 m NAVD88, at the alley on the downhill west
 * side; 3rd Avenue is about 10 m higher). Built in the street grid's frame:
 * the model's y axis runs up 3rd Avenue (NNW), placement bearing 328.8°.
 *
 * Form: a 44 m square granite tower on a five-storey podium. Each face has a
 * bowed curtain-wall bay of blue-green glass, 27 m across and bulging 4 m,
 * split down the middle by a granite strip, between granite corner piers
 * with small windows. The bays stop at 169 m under a band of X-patterned
 * windows; the corners stop at 180 m; above them a cross of four arms rises
 * to 206 m, each arm a barrel vault whose end is an arched gable with a dark
 * lunette; over the crossing a pale stepped pyramid and a square lantern finish at
 * 231 m.
 *
 * Sources
 * - OSM: outline way/140436171; parts way/331322651 (podium), way/331322649
 *   (shaft with the four bowed bays), way/331424981 and way/488923802 (the
 *   two arms, roof:shape round), way/331322650 (pyramid), way/331324934
 *   (lantern). Plans used as they are, made symmetric about the shaft's
 *   centre (they are within half a metre of it).
 * - Lidar (measured, USGS 3DEP WA_KingCo_1_2021, above 26.5 m NAVD88):
 *   podium 27 m; north wing 19 m, south strip 18 m, west alley wing 7-11 m;
 *   bay tops 169 m; corner blocks 180-181 m; barrel springing ~206 m, crest
 *   ~212 m; pyramid base ~214 m, top ~225 m; lantern 231 m.
 * - Published: 235 m (772 ft), 55 storeys (Wikipedia, "1201 Third Avenue").
 * - Photos (Wikimedia Commons): Joe Mabel 2016 (from Elliott Bay, west face,
 *   low sun), JSquish 2016 (west face, overcast: the colours), Udeezy 2014
 *   (crown detail), Cody Logan 2007.
 * Estimated: storey groups (three storeys a panel on the corner piers), the
 * barrels' arc, the lunettes' size, the podium's facade.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Prism, capRing, ccw, chamfer, edgeBase, finishGlb, loftRings, facePanels, outward, wallEdge, edgePanels } from './sea-rainier-square-tower'

function build() {
  const granite = new Part(), win = new Part(), roof = new Part(), lantern = new Part()
  const C: XY = [4.5, -3.5]
  const H = 22, A = 13.5, BULGE = 4
  const P = { podium: 27, bay: 169, corner: 180.5, arm: 206, crest: 212, drum: 214.5, pyrTop: 224.5, lantern: 231 }
  // rotate a face-local point (south face: u east, v north) by k quarter turns, about C
  const rot = (p: XY, k: number): XY => {
    let [u, v] = p
    for (let i = 0; i < k; i++) [u, v] = [-v, u]
    return [C[0] + u, C[1] + v]
  }
  // the bay arc on the south face, from (-A, -H) out to (0, -H - BULGE) and back to (A, -H)
  const R = (A * A + BULGE * BULGE) / (2 * BULGE)
  const NA = 8
  const arcPts: XY[] = []
  { const a0 = Math.asin(A / R); for (let i = 0; i <= NA; i++) { const a = -a0 + (2 * a0 * i) / NA; arcPts.push([R * Math.sin(a), -H - BULGE + R - R * Math.cos(a)]) } }
  // ---- the shaft ring: corner, bay arc, per face
  const shaft: XY[] = []
  for (let k = 0; k < 4; k++) {
    shaft.push(rot([-H, -H], k))
    for (const p of arcPts) shaft.push(rot(p, k))
  }
  const shaftR = chamfer(shaft, 0.5)
  const isBay = (a: XY, b: XY) => {
    // an edge on a bay arc lies outside the square
    const m: XY = [(a[0] + b[0]) / 2 - C[0], (a[1] + b[1]) / 2 - C[1]]
    return Math.max(Math.abs(m[0]), Math.abs(m[1])) > H + 0.2
  }
  for (let i = 0; i < shaftR.length; i++) {
    const a = shaftR[i], b = shaftR[(i + 1) % shaftR.length]
    const bay = isBay(a, b)
    ;(bay ? win : granite).quad([a[0], a[1], P.podium], [b[0], b[1], P.podium], [b[0], b[1], P.bay], [a[0], a[1], P.bay])
  }
  // the granite strip down the middle of each bay, and its corner-pier windows
  for (let k = 0; k < 4; k++) {
    const m0 = arcPts[NA / 2 - 1], m1 = arcPts[NA / 2], m2 = arcPts[NA / 2 + 1]
    const toward = (p: XY, q: XY, d: number): XY => { const L = Math.hypot(q[0] - p[0], q[1] - p[1]); return [p[0] + ((q[0] - p[0]) * d) / L, p[1] + ((q[1] - p[1]) * d) / L] }
    for (const [s0, s1] of [[toward(m1, m0, 1.8), m1], [m1, toward(m1, m2, 1.8)]] as [XY, XY][]) {
      const A0 = rot(s0, k), B0 = rot(s1, k), n = outward(A0, B0), o = 0.08
      granite.quad([A0[0] + n[0] * o, A0[1] + n[1] * o, P.podium], [B0[0] + n[0] * o, B0[1] + n[1] * o, P.podium], [B0[0] + n[0] * o, B0[1] + n[1] * o, P.bay], [A0[0] + n[0] * o, A0[1] + n[1] * o, P.bay])
    }
    // the corner piers read as solid granite from any distance: their small
    // punched windows are left out rather than drawn as a dotted column
  }

  // ---- the X band and corner blocks: the square, 169 to 180.5 m
  const sq = (h: number): XY[] => [rot([-h, -h], 0), rot([-h, -h], 1), rot([-h, -h], 2), rot([-h, -h], 3)]
  const square = chamfer(sq(H), 0.5)
  loftRings(granite, square, square, P.bay, P.corner)
  capRing(roof, square, P.corner)
  // the bays' tops, where they stand proud of the square
  for (let k = 0; k < 4; k++) {
    const r = ccw(arcPts.map((p) => rot(p, k)))
    capRing(granite, r, P.bay)
  }
  for (let k = 0; k < 4; k++) {
    const face = (s: number, z: number): V3 => { const p = rot([-H + s, -H - 0.06], k); return [p[0], p[1], z] }
    const lo = P.bay + 2.4, hi = P.corner - 2.4
    facePanels(win, face, H - A + 0.8, H - 1.8, lo, hi, 50, 0)
    facePanels(win, face, H + 1.8, H + A - 0.8, lo, hi, 50, 0)
    facePanels(win, face, 2.0, 6.6, lo, hi, 50, 0)
    facePanels(win, face, 2 * H - 6.6, 2 * H - 2.0, lo, hi, 50, 0)
  }

  // ---- the cross of arms, 180.5 to 206 m
  const cross: XY[] = []
  for (let k = 0; k < 4; k++) cross.push(rot([-A, -H], k), rot([A, -H], k), rot([A, -A], k))
  const crossR = chamfer(ccw(cross), 0.5)
  loftRings(granite, crossR, crossR, P.corner, P.arm)
  for (let k = 0; k < 4; k++) {
    // arm end (flush with the face): two tall panels either side of the strip, two groups
    const end = (s: number, z: number): V3 => { const p = rot([-A + s, -H - 0.06], k); return [p[0], p[1], z] }
    // arm side (set back): one panel
    const side = (s: number, z: number): V3 => { const p = rot([A + 0.06, -H + s], k); return [p[0], p[1], z] }
    for (const [lo, hi] of [[P.corner + 1.2, 192.6], [194.2, P.arm - 1.2]]) {
      facePanels(win, end, 0.9, A - 1.8, lo, hi, 50, 0)
      facePanels(win, end, A + 1.8, 2 * A - 0.9, lo, hi, 50, 0)
      facePanels(win, side, 1.6, H - A - 1.6, lo, hi, 50, 0, true)
    }
  }
  // the crossing drum, above the barrels
  const drum = chamfer(sq(A), 0.5)
  loftRings(granite, drum, drum, P.arm, P.drum)

  // ---- barrel vaults on the arms, arched gables with lunettes
  const RB = (A * A + (P.crest - P.arm) ** 2) / (2 * (P.crest - P.arm))
  const NB = 10
  const b0 = Math.asin(A / RB)
  const prof: [number, number][] = [] // (across, z)
  for (let i = 0; i <= NB; i++) { const a = -b0 + (2 * b0 * i) / NB; prof.push([RB * Math.sin(a), P.crest - RB + RB * Math.cos(a)]) }
  for (let k = 0; k < 4; k++) {
    // the south arm: runs from the face (v = -H) in to the drum (v = -A)
    for (let i = 0; i < NB; i++) {
      const [u0, z0] = prof[i], [u1, z1] = prof[i + 1]
      const p = (u: number, v: number, z: number): V3 => { const q = rot([u, v], k); return [q[0], q[1], z] }
      granite.quad(p(u0, -H, z0), p(u1, -H, z1), p(u1, -A, z1), p(u0, -A, z0))
      // gable end, a fan from the springing line's middle
      granite.tri(p(0, -H, P.arm), p(u1, -H, z1), p(u0, -H, z0))
    }
    // lunette: the arch inset by a rim
    const rim = 1.1
    for (let i = 0; i < NB; i++) {
      const p = (u: number, z: number): V3 => { const q = rot([u, -H - 0.06], k); return [q[0], q[1], z] }
      const f = (A - rim) / A
      const [u0, z0] = prof[i], [u1, z1] = prof[i + 1]
      const zb = P.arm + 0.6
      win.tri(p(0, zb), p(u1 * f, zb + (z1 - P.arm) * 0.72), p(u0 * f, zb + (z0 - P.arm) * 0.72))
    }
  }

  // ---- the stepped pale pyramid and lantern: five bevelled tiers
  const TIERS = 5, th = (P.pyrTop - P.drum) / TIERS
  for (let t = 0; t < TIERS; t++) {
    const h = A - 0.3 - ((A - 0.3 - 3.4) * t) / (TIERS - 1)
    const r = chamfer(sq(h), 0.4), z0 = P.drum + t * th, z1 = z0 + th
    loftRings(lantern, r, r, z0, z1)
    capRing(lantern, r, z1)
  }
  const lb = sq(2.3)
  loftRings(lantern, lb, lb, P.pyrTop, P.lantern)
  capRing(lantern, lb, P.lantern)

  // ---- podium and the low wings in the outline
  const prisms: Prism[] = [
    { ring: ccw([[-22.0, 6.8], [-22.3, 22.4], [30.8, 23.0], [31.6, -29.4], [-21.5, -29.9]]), z1: P.podium, wall: granite, roof, kind: 'podium' },
    { ring: ccw([[-40.6, 26.1], [-27.4, 26.3], [-27.3, 22.9], [30.8, 23.0], [30.5, 36.4], [-40.8, 35.7]]), z1: 19, wall: granite, roof, kind: 'wing' },
    { ring: ccw([[-2, -36.1], [31.7, -35.8], [31.6, -29.4], [-2, -29.7]]), z1: 18, wall: granite, roof, kind: 'wing' },
    { ring: ccw([[-40.6, 26.1], [-40.8, 35.7], [30.5, 36.4], [30.8, 23.0], [31.6, -29.4], [31.7, -35.8], [12.8, -35.9], [-38.2, -36.4], [-38.4, -25.2], [-26.6, -25.0], [-27.4, 26.3]]), z1: 8, wall: granite, roof, kind: 'low' },
  ]
  for (const Q of prisms) {
    Q.ring = chamfer(Q.ring, 0.4)
    const r = Q.ring
    for (let i = 0; i < r.length; i++) {
      const z0 = edgeBase(prisms, Q, i)
      if (z0 >= Q.z1 - 0.01) continue
      wallEdge(Q.wall, r, i, z0, Q.z1)
      if (Q.kind !== 'low') edgePanels(win, r, i, z0, Q.z1, { group: 2 * 4.2, spandrel: 2.2, pier: 1.4, bayW: 5.5, head: 1.0, foot: 1.2 }, false)
    }
    capRing(Q.roof, r, Q.z1)
  }

  return finishGlb('sea-1201-third-avenue', '1201 Third Avenue', [
    { part: granite, material: finish('wm-granite', 0xe2d2be) },
    { part: win, material: { ...PALETTE.window, color: 0x6a8f9c } },
    { part: roof, material: { ...PALETTE.roof, color: 0xbcc2c6 } },
    { part: lantern, material: finish('wm-crown', 0xf1e7d8) },
  ], { bearing: 328.8, height: P.lantern, replaces: ['way/140436171', 'way/331322651', 'way/331322649', 'way/331424981', 'way/488923802', 'way/331322650', 'way/331324934'] })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/sea-1201-third-avenue.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
