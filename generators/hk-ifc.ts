/**
 * International Finance Centre (Two IFC, One IFC and the IFC Mall), Central,
 * Hong Kong — original procedural geometry, CC0-1.0.
 * bun generators/hk-ifc.ts   (writes the low model and the detail model)
 *
 * Uses the geometry kit exported by taipei-101.ts.
 *
 * What is included: OSM maps Two IFC (way/25589595), One IFC (way/148554945)
 * and the IFC Mall (relation/13849938) as three buildings, but they are one
 * complex on one podium: the mall joins both towers (its parts wrap Two
 * IFC's foot and abut One IFC), so all three are in this model, as the batch
 * notes ask. Four Seasons Place, also part of the development but a separate
 * building north-west of the mall, is not.
 *
 * Frame: BEARING 31.8 (Two IFC's faces, from OSM), model +x = compass 121.8,
 * +y = compass 31.8 (the harbour side). Origin = area centroid of
 * way/25589595 (Two IFC). One IFC stands 190 m to the model's west-south-
 * west. y = 0 is the street; elevation 0.
 *
 * Two IFC, as modelled:
 * - the plan from OSM: a square with a proud central bay on each face (28 m
 *   wide, faces bowed out to 28.8 m), a step in at each side of it and a
 *   sloping corner zone to a pointed corner;
 * - the shaft rises plain to 230 m, then narrows in one smooth curve (a
 *   lofted inset through the 200809 photo's widths: 1.7 m in at 300 m, 3.4 m
 *   at 345, 5.5 m at 372, 8 m at 392) marked by many shallow setbacks (a
 *   pale lip every 18 m on the low model, every 6 m on the detail model),
 *   so the top reads as a rounded bullet;
 * - the white vertical fins of the facade as real 3D ribs following the
 *   curve (at the bay edges and the corner zones on the low model; 19 per
 *   face on the detail model);
 * - the crown, 392-412 m: the claw fins rise from the full width of the
 *   shaft's top and carry its curve on into a rounded, ribbed white cap
 *   (the cap 1.5 m behind them, to 409 m); they stop short of each corner,
 *   where the crown splits, rise highest (412 m) beside it and lowest
 *   (403 m) at a face's middle;
 * - the dark plant floors (about 54, 139, 238 and 298 m).
 * One IFC: the OSM outline to 126 m, then its main part way/1323739468 to
 * 202.5 m and its 40 OSM corner and face parts (way/1323739469-1323739508)
 * each to its own height, so the corners step back as in the photos; over
 * each face's middle bay an open frame of white fins under a top rail to
 * 210 m (the 200809 photo); a plant band. IFC Mall: the OSM parts at
 * 30 m, the two bridge parts over the roads carried on from 7.5 m; the
 * relation's inner ring (over Hong Kong Station's tracks) is left open, as
 * OSM maps it.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors, ODbL): way/25589595 (Two IFC, height
 *   415.8, 90 levels), way/148554945 (One IFC, 210 m, 38 levels),
 *   way/1323739468 (its upper part, 202.5 m), relation/13849938 (IFC Mall,
 *   4 levels) and its parts way/664250326-664250329 (30 m; the bridges from
 *   7.5 m).
 * - Published (Wikipedia "International Finance Centre (Hong Kong)", CTBUH):
 *   Two IFC 412 m to the top, roof 407 m, top floor 387.6 m, 88 storeys;
 *   One IFC 210 m, 39 storeys; the mall 4 storeys.
 * - Photos (Wikimedia Commons):
 *   "HK International Finance Centre 200809.jpg", WiNG, CC BY 3.0, from the
 *   harbour (N): the whole silhouette, setback and plant-floor heights were
 *   scaled from it, One IFC's crown;
 *   https://commons.wikimedia.org/wiki/File:HK_International_Finance_Centre_200809.jpg
 *   "International Finance Centre - panoramio.jpg", Jim Bowen, CC BY 3.0,
 *   corner-on: the setbacks, the fins and the crown's corner split;
 *   https://commons.wikimedia.org/wiki/File:International_Finance_Centre_-_panoramio.jpg
 *   "Overlook International Finance Centre.jpg", Exploringlife, CC BY-SA 4.0,
 *   from the Peak (S, above): plan width, crown width;
 *   https://commons.wikimedia.org/wiki/File:Overlook_International_Finance_Centre.jpg
 *   "Two International Finance Centre (2 IFC) - Hong Kong - taken in
 *   2015.jpg", Wiki.cullin, CC0, from the foot: corner zones, plant floors,
 *   One IFC's crown fins;
 *   https://commons.wikimedia.org/wiki/File:Two_International_Finance_Centre_(2_IFC)_-_Hong_Kong_-_taken_in_2015.jpg
 *   "Two International Finance Centre in Hong Kong in 2016.jpg", Choinowski,
 *   CC BY-SA 4.0; https://commons.wikimedia.org/wiki/File:Two_International_Finance_Centre_in_Hong_Kong_in_2016.jpg
 *   "Victoria Harbour skyscrapers.jpg", Wilfredor, CC0, at night: the crown
 *   lit white; https://commons.wikimedia.org/wiki/File:Victoria_Harbour_skyscrapers.jpg
 * - No lidar, no NAIP, no Mapillary token (batch notes).
 * - Look-only references: none.
 *
 * Numbers
 * - Published: 412 m (Two IFC's crown tips), One IFC 210 m, mall 4 storeys.
 * - Measured (OSM): every plan, the bearing, One IFC's 202.5 m upper part,
 *   the mall's 30 m and the bridges' 7.5 m.
 * - Measured (photo, 200809 view scaled to 412 m): the top's widths (the
 *   inset curve above); crown base ~392 m; plant floors ~54, 139, 238, 298 m; the
 *   crown's width (~0.8 of the shaft).
 * - Estimated: the curve between the measured widths, the lips, the fins'
 *   size and spacing, the crown's continuation above 400 m and the cap's
 *   height (409 m); One IFC's
 *   plant band (~95 m); the mall's facade (glass storeys under pale grey bands, kept low in
 *   contrast with the towers). Glass
 *   colour sampled from the 200809 and Peak photos (#77838f overall, glass
 *   with white grid), drawn as #73879a glass with white fins.
 *
 * Doubts
 * - Two IFC's crown: photos from below show the fins rising toward the
 *   corners, photos from the Peak (above) make the crown look domed; the
 *   model follows the views from below.
 * - The mall's inner courtyard (the relation's inner ring) is open in the
 *   model; it is roofed by station structures OSM maps underground.
 * - The setbacks are modelled as one smooth inset of the whole plan.
 *
 * Night: glass glows as windows; the crown fins are `neon-ifc-crown` (the
 * crowns are lit white); the plant-floor louvres stay unlit.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { K, type P2 } from './taipei-101'

const BEARING = 31.8
const ANCHOR = { lng: 114.1592775, lat: 22.2852971 }
const TOP = 412

/** Two IFC's plan, CCW, inset by s: per face the corner, the step, the bay edge and the bowed middle (OSM). */
function plan2(s: number, m = 1): P2[] {
  const F = 28.8 - s, Fb = 28.15 - s, Fs = 26.4 - s, C = 24.3 - s, b = 13.9 - s * 0.55
  const face: P2[] = [[C, -C], [Fs, -b], [Fb, -b]]
  for (let k = 1; k < m * 2; k++) {
    const y = -b + (2 * b * k) / (m * 2)
    face.push([Fb + (F - Fb) * (1 - (y / b) ** 2), y])
  }
  face.push([Fb, b], [Fs, b])
  const r: P2[] = []
  for (let k = 0; k < 4; k++) for (const [x, y] of face) {
    let [a, c] = [x, y]
    for (let i = 0; i < k; i++) [a, c] = [-c, a]
    r.push([a, c])
  }
  return r
}

// One IFC's parts way/1323739469-1323739508 (OSM): [top, ring]; skillion parts drawn flat at height - roof:height / 2
const IFC1_PARTS: [number, P2[]][] = [
  [193.5, [[-175.0, -133.4], [-174.5, -132.0], [-170.5, -133.5], [-172.0, -137.6], [-173.3, -137.1], [-172.3, -134.4]]],
  [193.5, [[-182.5, -161.3], [-181.1, -161.8], [-182.7, -165.8], [-186.7, -164.3], [-186.2, -162.9], [-183.5, -164.0]]],
  [193.5, [[-210.4, -153.9], [-210.9, -155.3], [-214.9, -153.8], [-213.4, -149.7], [-212.1, -150.2], [-213.1, -152.9]]],
  [193.5, [[-202.9, -126.1], [-204.2, -125.6], [-202.7, -121.5], [-198.6, -123.0], [-199.1, -124.4], [-201.8, -123.4]]],
  [191.25, [[-187.2, -165.6], [-187.8, -167.0], [-211.9, -158.0], [-211.4, -156.6]]],
  [191.25, [[-214.7, -149.2], [-216.1, -148.7], [-206.9, -124.6], [-205.6, -125.1]]],
  [191.25, [[-198.1, -121.7], [-197.6, -120.4], [-173.5, -129.4], [-174.0, -130.7]]],
  [191.25, [[-170.6, -138.1], [-169.3, -138.6], [-178.5, -162.8], [-179.8, -162.3]]],
  [173.25, [[-188.3, -168.3], [-188.8, -169.6], [-212.9, -160.6], [-212.4, -159.3]]],
  [184.5, [[-212.4, -159.3], [-211.9, -158.0], [-187.8, -167.0], [-188.3, -168.3]]],
  [173.25, [[-217.4, -148.2], [-218.8, -147.7], [-209.6, -123.6], [-208.2, -124.1]]],
  [184.5, [[-208.2, -124.1], [-206.9, -124.6], [-216.1, -148.7], [-217.4, -148.2]]],
  [173.25, [[-197.1, -119.0], [-196.6, -117.7], [-172.4, -126.7], [-172.9, -128.0]]],
  [184.5, [[-172.9, -128.0], [-173.5, -129.4], [-197.6, -120.4], [-197.1, -119.0]]],
  [184.5, [[-169.3, -138.6], [-167.9, -139.1], [-177.1, -163.3], [-178.5, -162.8]]],
  [173.25, [[-167.9, -139.1], [-166.6, -139.6], [-175.8, -163.8], [-177.1, -163.3]]],
  [175.5, [[-170.5, -133.5], [-167.7, -134.6], [-169.3, -138.6], [-170.6, -138.1], [-172.0, -137.6]]],
  [175.5, [[-173.5, -129.4], [-169.4, -130.9], [-170.5, -133.5], [-174.5, -132.0], [-174.0, -130.7]]],
  [175.5, [[-202.7, -121.5], [-201.7, -118.8], [-197.6, -120.4], [-198.1, -121.7], [-198.6, -123.0]]],
  [175.5, [[-206.9, -124.6], [-205.4, -120.5], [-202.7, -121.5], [-204.2, -125.6], [-205.6, -125.1]]],
  [175.5, [[-214.9, -153.8], [-217.6, -152.8], [-216.1, -148.7], [-214.7, -149.2], [-213.4, -149.7]]],
  [175.5, [[-211.9, -158.0], [-216.0, -156.4], [-214.9, -153.8], [-210.9, -155.3], [-211.4, -156.6]]],
  [175.5, [[-182.7, -165.8], [-183.7, -168.5], [-187.8, -167.0], [-187.2, -165.6], [-186.7, -164.3]]],
  [175.5, [[-182.7, -165.8], [-181.1, -161.8], [-179.8, -162.3], [-178.5, -162.8], [-180.0, -166.8]]],
  [162.0, [[-218.8, -147.7], [-221.0, -146.9], [-211.8, -122.8], [-209.6, -123.6]]],
  [162.0, [[-196.6, -117.7], [-195.8, -115.5], [-171.6, -124.5], [-172.4, -126.7]]],
  [162.0, [[-166.6, -139.6], [-164.4, -140.4], [-173.6, -164.6], [-175.8, -163.8]]],
  [162.0, [[-188.8, -169.6], [-189.6, -171.8], [-213.8, -162.8], [-212.9, -160.6]]],
  [148.5, [[-175.8, -163.8], [-177.3, -167.8], [-180.0, -166.8], [-178.5, -162.8], [-177.1, -163.3]]],
  [148.5, [[-183.7, -168.5], [-184.7, -171.2], [-188.8, -169.6], [-188.3, -168.3], [-187.8, -167.0]]],
  [148.5, [[-212.9, -160.6], [-217.0, -159.1], [-216.0, -156.4], [-211.9, -158.0], [-212.4, -159.3]]],
  [148.5, [[-217.6, -152.8], [-220.3, -151.8], [-218.8, -147.7], [-217.4, -148.2], [-216.1, -148.7]]],
  [148.5, [[-201.7, -118.8], [-200.7, -116.2], [-196.6, -117.7], [-197.1, -119.0], [-197.6, -120.4]]],
  [148.5, [[-209.6, -123.6], [-208.0, -119.5], [-205.4, -120.5], [-206.9, -124.6], [-208.2, -124.1]]],
  [148.5, [[-172.4, -126.7], [-168.4, -128.2], [-169.4, -130.9], [-173.5, -129.4], [-172.9, -128.0]]],
  [148.5, [[-167.7, -134.6], [-165.1, -135.6], [-166.6, -139.6], [-167.9, -139.1], [-169.3, -138.6]]],
  [126.0, [[-180.0, -166.8], [-183.7, -168.5], [-182.7, -165.8]]],
  [126.0, [[-169.4, -130.9], [-167.7, -134.6], [-170.5, -133.5]]],
  [126.0, [[-205.4, -120.5], [-201.7, -118.8], [-202.7, -121.5]]],
  [126.0, [[-216.0, -156.4], [-217.6, -152.8], [-214.9, -153.8]]],
]

/**
 * Two IFC's inset (metres in from the base plan, every face) by height: plain
 * to 230 m, then a smooth curve through the 200809 photo's widths (1.7 m at
 * 300 m, 3.4 at 345, 5.5 at 372, 8 at 392) that carries on through the crown
 * into the rounded cap (13.5 m at 406 m, 20 m at the 412 m tips).
 */
const inset = (z: number) => {
  const rows: [number, number][] = [[230, 0], [260, 0.6], [300, 1.7], [345, 3.4], [372, 5.5], [392, 8.0], [400, 10.5], [406, 13.5], [410, 17], [412, 20]]
  if (z <= rows[0][0]) return 0
  for (let i = 0; i < rows.length - 1; i++) {
    const [z0, v0] = rows[i], [z1, v1] = rows[i + 1]
    if (z <= z1) {
      // smooth (cubic Hermite with finite-difference slopes) so the outline flows
      const t = (z - z0) / (z1 - z0)
      const m0 = i > 0 ? (v1 - rows[i - 1][1]) / (z1 - rows[i - 1][0]) : (v1 - v0) / (z1 - z0) * 0.5
      const m1 = i < rows.length - 2 ? (rows[i + 2][1] - v0) / (rows[i + 2][0] - z0) : (v1 - v0) / (z1 - z0)
      const h = z1 - z0, t2 = t * t, t3 = t2 * t
      return (2 * t3 - 3 * t2 + 1) * v0 + (t3 - 2 * t2 + t) * h * m0 + (-2 * t3 + 3 * t2) * v1 + (t3 - t2) * h * m1
    }
  }
  return rows[rows.length - 1][1]
}
const CROWN0 = 392
const LOUVRES: [number, number][] = [[52, 56.5], [137, 141.5], [232.3, 236.6], [295.5, 299.8]]

/** A point on Two IFC's plan (m = 1 outline) at height z, at share f (0..1) of face k's length from its first corner. */
function onFace(z: number, k: number, f: number): { p: P2; n: P2; t: P2 } {
  const r = plan2(inset(z), 1), n = r.length / 4
  const pts = r.slice(k * n, k * n + n).concat([r[((k + 1) * n) % r.length]])
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const s = f * cum[cum.length - 1]
  let i = 1
  while (i < pts.length - 1 && cum[i] < s) i++
  const g = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1)
  const a = pts[i - 1], b = pts[i]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
  const t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  return { p: [a[0] + (b[0] - a[0]) * g, a[1] + (b[1] - a[1]) * g], n: [t[1], -t[0]], t }
}

/** A rib swept up face k at share f through levels zs: w half-wide along the face, from `inn` behind to `out` in front of it. */
function rib(p: Part, k: number, f: number, zs: number[], w: number, out: number, inn: number, capTop = true) {
  // sections with horizontal side normals, so a rib welds into three strips
  const sec = (z: number) => {
    const { p: c, n, t } = onFace(z, k, f)
    const pts = ([[-w, -inn], [w, -inn], [w, out], [-w, out]] as P2[]).map(([u, d]) => [c[0] + t[0] * u + n[0] * d, c[1] + t[1] * u + n[1] * d, z] as V3)
    const nr: V3[] = [[-n[0], -n[1], 0], [t[0], t[1], 0], [n[0], n[1], 0], [-t[0], -t[1], 0]] // normal of side e (from corner e to e + 1)
    return { pts, nr }
  }
  for (let l = 0; l < zs.length - 1; l++) {
    const A = sec(zs[l]), B = sec(zs[l + 1])
    for (let e = 1; e < 4; e++) { // the back (e = 0) lies against the wall or the cap
      const e2 = (e + 1) % 4, na = A.nr[e], nb = B.nr[e]
      p.tri(A.pts[e], A.pts[e2], B.pts[e2], undefined, undefined, undefined, [na, na, nb])
      p.tri(A.pts[e], B.pts[e2], B.pts[e], undefined, undefined, undefined, [na, nb, nb])
    }
  }
  if (capTop) { const tp = sec(zs[zs.length - 1]).pts; p.quad(tp[3], tp[2], tp[1], tp[0]) }
}

/**
 * Walls between two rings whose faces share one horizontal normal per edge,
 * so stacked bands of a curved loft weld into one strip per face (half the
 * vertices of flat-shaded quads).
 */
function loftH(p: Part, lo: V3[], hi: V3[]) {
  const n = lo.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const dx = lo[j][0] - lo[i][0], dy = lo[j][1] - lo[i][1], L = Math.hypot(dx, dy) || 1
    const nn: V3 = [dy / L, -dx / L, 0]
    p.tri(lo[i], lo[j], hi[j], undefined, undefined, undefined, [nn, nn, nn])
    p.tri(lo[i], hi[j], hi[i], undefined, undefined, undefined, [nn, nn, nn])
  }
}

export function build(detail: boolean) {
  const glassP = new Part(), dark = new Part(), fin = new Part(), crown = new Part(), roof = new Part(), mallW = new Part()
  const M = detail ? 3 : 1

  // ---------------------------------------------------------- Two IFC shaft: one lofted curve
  const zUp: number[] = []
  for (let z = 230; z < CROWN0; z += detail ? 6 : 18) zUp.push(z)
  const ZS = [...new Set([0, ...LOUVRES.flat(), ...zUp, CROWN0])].sort((a, b) => a - b)
  for (let l = 0; l < ZS.length - 1; l++) {
    const z0 = ZS[l], z1 = ZS[l + 1]
    const louvre = LOUVRES.some(([a, b]) => z0 >= a && z1 <= b)
    loftH(louvre ? dark : glassP, K.at(plan2(inset(z0), M), z0), K.at(plan2(inset(z1), M), z1))
  }
  // the many shallow setbacks: a pale lip at every level of the curve
  for (const z of ZS.filter((z) => z > 236.6 && z < CROWN0)) {
    const r = plan2(inset(z), M), o = K.offset(r, 0.3)
    K.loft(fin, K.at(o, z - 0.45), K.at(o, z))
    if (detail) K.loft(fin, K.at(o, z), K.at(r, z))
  }
  // detail: pale floor lines every two floors below the curve
  if (detail) for (let z = 8.6; z < 228; z += 8.6) {
    if (LOUVRES.some(([a, b]) => z > a - 1 && z < b + 1)) continue
    const r = plan2(0, M), o = K.offset(r, 0.12)
    K.loft(fin, K.at(o, z - 0.16), K.at(o, z + 0.16))
    K.loft(fin, K.at(o, z + 0.16), K.at(r, z + 0.16))
  }
  // vertical fins: white ribs following the curve, from the street to the crown
  {
    // shares along a face (corner .. corner): low model at the bay edges and the corner zones
    const base = plan2(0, 1), n = base.length / 4
    const pts = base.slice(0, n).concat([base[n]])
    const cum = [0]
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
    const L = cum[cum.length - 1]
    const shares = detail
      ? Array.from({ length: 19 }, (_, i) => (i + 1) / 20)
      : [cum[1] / 2 / L, (cum[2] + 0.4) / L, (cum[cum.length - 3] - 0.4) / L, (cum[cum.length - 2] + L) / 2 / L]
    const zs = detail ? [0, ...zUp, CROWN0] : [0, 230, 300, 345, 372, CROWN0]
    for (let k = 0; k < 4; k++) for (const f of shares) rib(fin, k, f, zs, detail ? 0.2 : 0.45, detail ? 0.6 : 0.9, 0.05)
  }

  // ---------------------------------------------------------- Two IFC crown
  // The claw fins rise from the full width of the shaft's top and follow its
  // curve on into a rounded ribbed cap; they stop short of each corner, where
  // the crown splits, and rise highest beside it.
  {
    const cz: number[] = []
    for (let z = CROWN0; z <= 412.001; z += detail ? 2 : 5) cz.push(z)
    // the cap behind the fins: the same curve, 1.5 m further in, white
    const core = (z: number) => plan2(Math.min(inset(z) + 1.5, 21.5), M)
    const coreTop = 409
    const czc = [...cz.filter((z) => z < coreTop), coreTop]
    for (let l = 0; l < czc.length - 1; l++) loftH(crown, K.at(core(czc[l]), czc[l]), K.at(core(czc[l + 1]), czc[l + 1]))
    K.cap(crown, core(coreTop), coreTop, true)
    const NF = detail ? 21 : 9
    const us = Array.from({ length: NF }, (_, f) => -1 + (2 * (f + 0.5)) / NF).filter((u) => Math.abs(u) <= 0.93)
    const uMax = Math.max(...us.map(Math.abs))
    for (let k = 0; k < 4; k++) for (const u of us) {
      const top = 403 + 9 * (u / uMax) ** 2
      const zs = [...cz.filter((z) => z < top), top]
      rib(crown, k, (u + 1) / 2, zs, detail ? 0.28 : 0.45, 0.7, 2.0)
    }
  }

  // ---------------------------------------------------------- One IFC
  {
    const A: P2[] = [[-164.4, -140.4], [-173.6, -164.6], [-175.8, -163.8], [-177.3, -167.8], [-180.0, -166.8], [-183.7, -168.5], [-184.7, -171.2], [-188.8, -169.6], [-189.6, -171.8], [-213.8, -162.8], [-212.9, -160.6], [-217.0, -159.1], [-216.0, -156.4], [-217.6, -152.8], [-220.3, -151.8], [-218.8, -147.7], [-221.0, -146.9], [-211.8, -122.8], [-209.6, -123.6], [-208.0, -119.5], [-205.4, -120.5], [-201.7, -118.8], [-200.7, -116.2], [-196.6, -117.7], [-195.8, -115.5], [-171.6, -124.5], [-172.4, -126.7], [-168.4, -128.2], [-169.4, -130.9], [-167.7, -134.6], [-165.1, -135.6], [-166.6, -139.6]]
    const B: P2[] = [[-172.0, -137.6], [-170.6, -138.1], [-179.8, -162.3], [-182.5, -161.3], [-183.5, -164.0], [-186.2, -162.9], [-187.2, -165.6], [-211.4, -156.6], [-210.4, -153.9], [-213.1, -152.9], [-212.1, -150.2], [-214.7, -149.2], [-205.6, -125.1], [-202.9, -126.1], [-201.8, -123.4], [-199.1, -124.4], [-198.1, -121.7], [-174.0, -130.7], [-175.0, -133.4], [-172.3, -134.4], [-173.3, -137.1]]
    const a = K.ccw(A), b = K.ccw(B)
    // the outline up to the lowest corner step, then the main body and every
    // OSM part to its own height: the corners step back at 126, 148.5, 162,
    // 175.5 and 193.5 m and the face strips rise to 184.5 and 191 m
    K.loft(glassP, K.at(a, 0), K.at(a, 126))
    K.loft(dark, K.at(K.offset(a, 0.06), 93), K.at(K.offset(a, 0.06), 97))
    K.cap(roof, a, 126, true)
    K.loft(glassP, K.at(b, 126), K.at(b, 202.5))
    for (const [h, r] of IFC1_PARTS) {
      const rr = K.ccw(r)
      K.loft(glassP, K.at(rr, 125.9), K.at(rr, h))
      K.cap(fin, rr, h, true)
    }
    K.cap(roof, K.offset(b, -2.5), 204, true)
    K.loft(glassP, K.at(K.offset(b, -2.5), 202.5), K.at(K.offset(b, -2.5), 204))
    K.loft(roof, K.at(b, 202.5), K.at(K.offset(b, -2.5), 202.5))
    // crown (as in the 200809 photo): over each face's middle bay, an open
    // frame of tall white fins to 210 m under a top rail; the stepped white
    // corners (the OSM corner parts, capped white) frame it
    for (let i = 0; i < b.length; i++) {
      const p = b[i], q = b[(i + 1) % b.length]
      const L = Math.hypot(q[0] - p[0], q[1] - p[1])
      if (L < 15) continue // only the long face edges
      const tt: P2 = [(q[0] - p[0]) / L, (q[1] - p[1]) / L], nrm: P2 = [tt[1], -tt[0]]
      const nf = Math.max(2, Math.round(L / (detail ? 2.6 : 4.2)))
      for (let f = 0; f <= nf; f++) {
        const g = 0.08 + (0.84 * f) / nf
        const o: V3 = [p[0] + (q[0] - p[0]) * g, p[1] + (q[1] - p[1]) * g, 202.5]
        K.plate(crown, [[-1.2, 0], [0.4, 0], [0.4, 7.5], [-1.2, 7.5]], o, nrm, tt, 0.25, 0.25, true)
      }
      // the top rail
      const a0: P2 = [p[0] + (q[0] - p[0]) * 0.08, p[1] + (q[1] - p[1]) * 0.08], a1: P2 = [p[0] + (q[0] - p[0]) * 0.92, p[1] + (q[1] - p[1]) * 0.92]
      const rail: P2[] = [
        [a0[0] - nrm[0] * 1.2, a0[1] - nrm[1] * 1.2], [a1[0] - nrm[0] * 1.2, a1[1] - nrm[1] * 1.2],
        [a1[0] + nrm[0] * 0.4, a1[1] + nrm[1] * 0.4], [a0[0] + nrm[0] * 0.4, a0[1] + nrm[1] * 0.4],
      ]
      K.prism(crown, rail, 209.2, 210, true, true)
    }
    if (detail) {
      // pale vertical ribs at the outline's corners
      for (let i = 0; i < a.length; i++) {
        const p = a[i]
        K.prism(fin, K.circle(p[0], p[1], 0.35, 4), 0.5, 195, false)
      }
    }
  }

  // ---------------------------------------------------------- IFC Mall
  {
    const parts: { r: P2[]; z0: number }[] = [
      { z0: 0, r: [[-224.0, 9.1], [-217.5, -46.4], [-186.5, -46.5], [-176.8, -46.6], [-129.7, -46.8], [-73.9, -47.0], [-57.8, -47.1], [-50.1, -47.2], [-43.6, -47.2], [3.0, -47.2], [18.9, -47.8], [46.0, -48.9], [49.2, -48.9], [50.9, -21.8], [-23.8, -21.4], [-22.4, 20.9], [-51.5, 21.3], [-103.7, 17.8], [-106.0, 17.6], [-185.1, 12.2]] },
      { z0: 0, r: [[-177.9, -104.3], [49.2, -104.6], [49.2, -133.9], [39.2, -144.0], [-178.4, -143.9]] },
      { z0: 7.5, r: [[3.0, -47.2], [12.7, -89.5], [13.6, -93.5], [16.1, -104.5], [46.1, -104.6], [46.0, -48.9], [18.9, -47.8]] },
      { z0: 7.5, r: [[-177.9, -104.3], [-176.8, -46.6], [-129.7, -46.8], [-131.3, -52.7], [-140.5, -88.2], [-143.7, -104.3]] },
    ]
    // glass storeys under pale horizontal bands, kept low in contrast with the towers
    const bands: [number, number, boolean][] = detail
      ? [[0, 5.5, false], [5.5, 7.5, true], [7.5, 12.5, false], [12.5, 14.3, true], [14.3, 19.5, false], [19.5, 21.3, true], [21.3, 26.2, false], [26.2, 30, true]]
      : [[0, 8, false], [8, 10, true], [10, 18, false], [18, 20, true], [20, 26, false], [26, 30, true]]
    for (const { r, z0 } of parts) {
      const rr = K.ccw(r)
      for (const [b0, b1, pale] of bands) {
        if (b1 <= z0) continue
        const lo = Math.max(b0, z0)
        if (pale && detail) K.band(mallW, rr, lo, b1, 0.3, 0.02)
        else K.loft(pale ? mallW : glassP, K.at(rr, lo), K.at(rr, b1))
      }
      K.cap(roof, rr, 30, true)
      if (z0 > 0) K.cap(mallW, rr, z0, false)
    }
  }

  return [
    { part: glassP, material: windowVariant(2, 0xa0aebb) },
    { part: dark, material: finish('ifc-louvre', 0x8e8b88) }, // plant-floor louvres, unlit
    // the white fins catch the light at night rather than turning into dark stripes
    { part: fin, material: { ...finish('ifc-fin', 0xe6eaec), floodlight: () => 0.6 } },
    { part: crown, material: finish('neon-ifc-crown', 0xf1f3f4) },
    { part: roof, material: PALETTE.roof },
    { part: mallW, material: finish('ifc-mall-band', 0xc9ced2) },
  ]
}

// ============================================================ write
const REPLACES = [
  'way/25589595', // Two IFC
  'way/148554945', 'way/1323739468', // One IFC and its main part
  ...Array.from({ length: 40 }, (_, i) => `way/${1323739469 + i}`), // One IFC's corner and face parts
  'relation/13849938', 'way/664250326', 'way/664250327', 'way/664250328', 'way/664250329', // IFC Mall and its parts
]

if (import.meta.main) {
  for (const [file, detail, maxTris, maxBytes] of [
    ['hk-ifc.glb', false, 6500, 250 * 1024],
    ['hk-ifc.detail.glb', true, 40000, 1536 * 1024],
  ] as const) {
    const parts = build(detail)
    const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
    if (process.env.COUNTS) console.log(parts.map(({ part, material }) => material.name + ' ' + part.triangles).join(', '))
    if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
    const glb = writeGlb('International Finance Centre', parts, {
      license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: TOP,
      frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
      replaces: REPLACES,
    })
    if (glb.length > maxBytes) throw new Error(`${file}: file budget exceeded: ${glb.length}`)
    const out = new URL(`../models/${file}`, import.meta.url).pathname
    await Bun.write(out, glb)
    console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
  }
}
