/**
 * Sakishima Cosmo Tower (Osaka Prefectural Government Sakishima Building,
 * 大阪府咲洲庁舎; formerly the Osaka World Trade Center), Nankō, Suminoe,
 * Osaka: procedural, CC0-1.0.
 * bun generators/osaka-cosmo-tower.ts
 *
 * Map frame: x along 48.6 degrees (north-east), y along 318.6 (north-west),
 * z up, metres; built about the tower part's centre and moved on write so
 * the origin is the outline's centroid (the tower centre at x 31.7, y -2.0);
 * bearing 318.6. The tower's faces in OSM run at 48.6/138.6 degrees.
 *
 * Published (ja.wikipedia "大阪府咲洲庁舎"; OSM height=256): 256 m, 55
 * floors above ground, opened 1995 (Nikken Sekkei, Mancini Duffy); the
 * observatory "Sakishima Cosmo Tower" on 55F, 252 m, under the glass
 * inverted pyramid of the crown.
 *
 * OSM (all replaced): way/43979655 (the outline, 55 levels, 256 m), the
 * parts way/1034338448 (55 levels, the tower: a square 57 x 55 m with a
 * central projection 19 m wide on the north-west and south-east faces),
 * way/1034338449 and way/1034338450 (3 levels, the podium wings),
 * way/245266285 (2 levels).
 *
 * From photos (lead review round 1 applied: slenderer, bold 3D frame,
 * glass in the notches):
 * - the shaft is OSM's tower part as a square 56.7 x 55 m; the part's two
 *   central projections (19 m wide, 10-13 m deep) are drawn only as low
 *   3-level entrance halls: every photo shows the faces flat to the crown,
 *   with a central glass slot but no full-height projection, and drawing
 *   them full height made the tower read stocky;
 * - a slight taper (7 % narrower at the top, from the photos' converging
 *   corners beyond the camera's), and above about 188 m the shoulders step
 *   in 6.5 m (J o, 663highland);
 * - the glass recessed between bold white frames standing proud: the
 *   corner piers (3.2 m wide, 1.4 m proud) and the slot's two edges run the
 *   full height, two more piers on each face below the shoulders, white
 *   bands at 9, 62, 125 and 188 m;
 * - the crown (238-256 m): on each face a deep inverted triangle, glass
 *   behind it and on its sloping sides, its two slanted edges lined in a
 *   thin red; the top frame a white ring at 253 m with the corner piers rising
 *   to the roof at 256 m (J o's "Osaka-WTC-01", 663highland's "WTC01", DVMG);
 * - at the foot, white fins splay out from the faces and corners to about
 *   28 m (Tokumeigakarinoaoshima);
 * - the podium wings low (12 m, 8 m), white with glass bands; the
 *   exhibition hall's red roof edge belongs to the separate ATC/INTEX
 *   buildings and is not drawn.
 *
 * Colours: the glass sunlit #3f6a82-#5d7f92, reflecting the sky, drawn a
 * blue-green #6a8ba0 (window-2); the frames and fins white-silver
 * #dfe3e6; the crown's red lining #c4463f; roofs grey.
 *
 * Estimated: the taper, the setback height and depth, the frame sizes, the
 * notch (22 m wide, 18 m deep, 3.5 m back), the fins, the podium heights.
 *
 * Night: the office glass glows (window-2); the crown's red lining is lit
 * at night in Vellut's photos: `neon` in its day red.
 *
 * Photos (Wikimedia Commons):
 * - "Osaka-WTC-01.jpg", J o, CC BY-SA 3.0 (wide face, crown, fins)
 * - "WTC01s3200.jpg", 663highland, CC BY 2.5 (wide face, crown)
 * - "Sakishima Cosmo Tower.jpg", Tokumeigakarinoaoshima, CC BY-SA 4.0 (face, crown)
 * - "Osaka Prefectural Government Sakishima Building.jpg", Tokumeigakarinoaoshima, CC BY-SA 4.0 (the fins at the foot)
 * - "Cosmo Tower @ Sakishima Island @ Osaka (13382078703).jpg", Guilhem Vellut, CC BY 2.0 (side, silhouette)
 * - "WTC Cosmo Tower - panoramio.jpg", DVMG, CC BY 3.0 (corner view, crown on two faces)
 * - "Cosmo Tower observatory at night @ Sakishima Island @ Osaka (13381909...)", Guilhem Vellut, CC BY 2.0 (night)
 * Look-only: none.
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { triangulate, area, type XY } from './chi-aon-center'

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
function poly(p: Part, Q: V3[], n: V3) {
  for (let i = 1; i < Q.length - 1; i++) {
    const g = cross(sub(Q[i], Q[0]), sub(Q[i + 1], Q[0]))
    if (dot(g, n) >= 0) p.tri(Q[0], Q[i], Q[i + 1])
    else p.tri(Q[0], Q[i + 1], Q[i])
  }
}
const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)

// the tower part in the model frame (OSM way/1034338448, turned)
const X0 = -29.7, X1 = 27.0, Y0 = -24.8, Y1 = 30.2
const SPINE = [-16.4, 2.5] // the projections' extent along x
const SP_N = 43.4, SP_S = -35.4
const H = 256, SETBACK_Z = 188, CROWN_Z = 238, INSET = 6.5
const PODIUM_NW: XY[] = [[-29.6, 44.4], [-29.7, 30.2], [-16.3, 30.2], [-16.4, 43.4], [2.5, 43.4], [2.6, 30.2], [15.4, 30.2], [15.2, 60.9], [-21.1, 61.0], [-21.1, 63.4], [-30.4, 63.4], [-30.3, 44.4]]
const PODIUM_SW: XY[] = [[-29.7, 30.2], [-29.3, -24.5], [-58.8, -24.5], [-58.5, -36.9], [-82.7, -37.0], [-83.9, -42.4], [-86.1, -43.7], [-89.7, -43.7], [-92.4, -41.4], [-93.2, -38.1], [-91.6, -35.3], [-89.1, -33.6], [-86.0, -33.8], [-85.9, -30.3], [-93.4, -30.6], [-93.5, -24.5], [-99.6, -24.4], [-100.1, 31.8], [-92.8, 31.5], [-93.0, 37.4], [-86.7, 37.7], [-85.6, 41.7], [-82.5, 43.9], [-78.3, 43.6], [-75.0, 40.9], [-74.2, 36.7], [-76.0, 33.6], [-78.7, 30.9]]
const PODIUM_SE: XY[] = [[15.6, -24.8], [15.9, -54.1], [-4.2, -54.1], [-4.2, -51.1], [-11.8, -51.1], [-11.7, -54.1], [-29.7, -54.1], [-29.9, -30.0], [-58.7, -30.0], [-58.8, -24.5], [-16.1, -24.4], [-16.0, -35.4], [2.4, -35.4], [2.4, -24.8]]

function build() {
  const frame = new Part()  // white-silver frame, fins, podium walls
  const glaze = new Part()  // the curtain wall (window-2)
  const roof = new Part()
  const red = new Part()    // the crown's lining (neon)

  /** A wall from a to b (counter-clockwise ring order), z0..z1, with grouped panels. */
  const wall = (a: XY, b: XY, z0: number, z1: number, panels = true) => {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n: V3 = unit([b[1] - a[1], a[0] - b[0], 0])
    const P = (u: number, z: number, o = 0): V3 => [a[0] + (b[0] - a[0]) * u + n[0] * o, a[1] + (b[1] - a[1]) * u + n[1] * o, z]
    poly(frame, [P(0, z0), P(1, z0), P(1, z1), P(0, z1)], n)
    if (!panels || len < 2) return
    const nb = Math.max(1, Math.round(len / 10.5)), rows = Math.max(1, Math.round((z1 - z0) / 18.5))
    const mu = 0.6 / len
    for (let i = 0; i < nb; i++)
      for (let k = 0; k < rows; k++) {
        const u0 = i / nb + mu, u1 = (i + 1) / nb - mu
        const za = z0 + ((z1 - z0) * k) / rows + 0.25, zb = z0 + ((z1 - z0) * (k + 1)) / rows - 0.25
        poly(glaze, [P(u0, za, 0.05), P(u1, za, 0.05), P(u1, zb, 0.05), P(u0, zb, 0.05)], n)
      }
  }
  const ring = (r: XY[], z0: number, z1: number, panels = true) => {
    const c = ccw(r)
    for (let i = 0; i < c.length; i++) wall(c[i], c[(i + 1) % c.length], z0, z1, panels)
  }
  const capR = (r: XY[], z: number, part = roof) => {
    const c = ccw(r)
    for (const [i, j, k] of triangulate(c)) poly(part, [[c[i][0], c[i][1], z], [c[j][0], c[j][1], z], [c[k][0], c[k][1], z]], [0, 0, 1])
  }

  // --- The shaft: a square on OSM's tower part (without the two projections,
  // which are low: see the header), tapering slightly, stepping in at the
  // shoulders; glass recessed between bold white frames standing proud.
  const CX0 = (X0 + X1) / 2, CY0 = (Y0 + Y1) / 2, HA = (X1 - X0) / 2, HB = (Y1 - Y0) / 2
  const TAPER = 0.07
  const sc = (z: number) => 1 - (TAPER * z) / H
  /** Half-sizes at z, before and after the shoulder step. */
  const half = (z: number, upper: boolean): [number, number] => [HA * sc(z) - (upper ? INSET : 0), HB * sc(z) - (upper ? INSET : 0)]
  // face f: 0 +x, 1 +y, 2 -x, 3 -y; along-face unit t, outward n
  const F: Array<{ n: XY; t: XY }> = [{ n: [1, 0], t: [0, 1] }, { n: [0, 1], t: [-1, 0] }, { n: [-1, 0], t: [0, -1] }, { n: [0, -1], t: [1, 0] }]
  const fp = (f: number, u: number, z: number, upper: boolean, out = 0): V3 => {
    const [ha, hb] = half(z, upper)
    const { n, t } = F[f]
    const d = (n[0] !== 0 ? ha : hb) + out
    return [CX0 + n[0] * d + t[0] * u, CY0 + n[1] * d + t[1] * u, z]
  }
  const faceHalf = (f: number, z: number, upper: boolean) => (F[f].n[0] !== 0 ? half(z, upper)[1] : half(z, upper)[0])
  const faceN = (f: number): V3 => unit([F[f].n[0], F[f].n[1], (TAPER * HA) / H])
  /** Glass between z0 and z1 over the whole face width (the corners meet). */
  const glassBand = (f: number, z0: number, z1: number, upper: boolean, part = glaze) => {
    const w0 = faceHalf(f, z0, upper), w1 = faceHalf(f, z1, upper)
    poly(part, [fp(f, -w0, z0, upper), fp(f, w0, z0, upper), fp(f, w1, z1, upper), fp(f, -w1, z1, upper)], faceN(f))
  }
  /** A white pier on face f at along-face fraction q (−1..1 of the half width), proud by `out`. */
  const pier = (f: number, q: number, z0: number, z1: number, upper: boolean, w: number, out: number) => {
    const A = (z: number, s: number, o: number) => fp(f, q * faceHalf(f, z, upper) + s, z, upper, o)
    const t3: V3 = [F[f].t[0], F[f].t[1], 0]
    poly(frame, [A(z0, -w, out), A(z0, w, out), A(z1, w, out), A(z1, -w, out)], faceN(f))
    poly(frame, [A(z0, w, 0), A(z0, w, out), A(z1, w, out), A(z1, w, 0)], t3)
    poly(frame, [A(z0, -w, 0), A(z1, -w, 0), A(z1, -w, out), A(z0, -w, out)], mul(t3, -1))
  }
  /** A white band round the shaft at z, proud by `out`. */
  const band = (z: number, h: number, upper: boolean, out: number) => {
    for (let f = 0; f < 4; f++) {
      const w = faceHalf(f, z, upper) + out
      const Q = (u: number, zz: number, o: number) => fp(f, u, zz, upper, o)
      poly(frame, [Q(-w, z, out), Q(w, z, out), Q(w, z + h, out), Q(-w, z + h, out)], faceN(f))
      poly(frame, [Q(-w, z + h, 0), Q(w, z + h, 0), Q(w, z + h, out), Q(-w, z + h, out)], [0, 0, 1])
      poly(frame, [Q(-w, z, 0), Q(-w, z, out), Q(w, z, out), Q(w, z, 0)], [0, 0, -1])
    }
  }
  const piers = (z0: number, z1: number, upper: boolean) => {
    for (let f = 0; f < 4; f++) {
      pier(f, -1, z0, z1, upper, 1.6, 1.4)   // the corners
      pier(f, 1, z0, z1, upper, 1.6, 1.4)
      pier(f, -0.22, z0, z1, upper, 0.9, 1.1) // the central slot's edges
      pier(f, 0.22, z0, z1, upper, 0.9, 1.1)
      if (!upper) { pier(f, -0.62, z0, z1, upper, 0.6, 0.8); pier(f, 0.62, z0, z1, upper, 0.6, 0.8) }
    }
  }
  for (let f = 0; f < 4; f++) { glassBand(f, 0, SETBACK_Z, false); glassBand(f, SETBACK_Z, CROWN_Z, true) }
  piers(0, SETBACK_Z, false)
  piers(SETBACK_Z, H, true)
  for (const z of [9, 62, 125]) band(z, 1.2, false, 0.9)
  band(SETBACK_Z - 1.4, 1.4, false, 0.6)
  // the shoulder's roof between the two plans
  for (let f = 0; f < 4; f++) {
    const z = SETBACK_Z
    const wo = faceHalf(f, z, false), wi = faceHalf(f, z, true)
    poly(roof, [fp(f, -wo, z, false), fp(f, wo, z, false), fp(f, wi, z, true), fp(f, -wi, z, true)], [0, 0, 1])
  }

  // --- The crown (238-256 m): glass faces, each with the deep inverted
  // triangle: glass behind, glass sides, a thin red edge; a stepped white top.
  const zT = H - 3.1, zA = zT - 18, BACK = 3.5
  for (let f = 0; f < 4; f++) {
    const w0 = faceHalf(f, CROWN_Z, true), w1 = faceHalf(f, zT, true)
    const hw = 11
    const Q = (u: number, z: number, back = 0) => fp(f, u, z, true, -back)
    const n = faceN(f), t3: V3 = [F[f].t[0], F[f].t[1], 0]
    poly(glaze, [Q(-w0, CROWN_Z), Q(0, CROWN_Z), Q(0, zA), Q(-hw, zT), Q(-w1, zT)], n)
    poly(glaze, [Q(0, CROWN_Z), Q(w0, CROWN_Z), Q(w1, zT), Q(hw, zT), Q(0, zA)], n)
    poly(glaze, [Q(0, zA, BACK), Q(hw * 0.8, zT, BACK), Q(-hw * 0.8, zT, BACK)], n)
    poly(glaze, [Q(-hw, zT), Q(0, zA), Q(0, zA, BACK), Q(-hw * 0.8, zT, BACK)], unit(add(n, mul(t3, 0.8))))
    poly(glaze, [Q(0, zA), Q(hw, zT), Q(hw * 0.8, zT, BACK), Q(0, zA, BACK)], unit(add(n, mul(t3, -0.8))))
    // the thin red edge along the notch's two slanted sides
    const e = 0.9
    const R = (u: number, z: number) => fp(f, u, z, true, 0.12)
    poly(red, [R(-hw, zT), R(-hw + e * 1.6, zT), R(0, zA + e * 1.6), R(0, zA)], n)
    poly(red, [R(0, zA), R(0, zA + e * 1.6), R(hw - e * 1.6, zT), R(hw, zT)], n)
  }
  // the stepped top frame: a white ring, higher at the corners
  band(zT, 0.6, true, 1.2)
  for (let f = 0; f < 4; f++) for (const q of [-1, 1]) pier(f, q, zT, H, true, 1.9, 1.6)
  {
    const r: XY[] = []
    for (let f = 0; f < 4; f++) {
      const p0 = fp(f, -faceHalf(f, zT, true), zT, true)
      r.push([p0[0], p0[1]])
    }
    capR(r, zT + 0.6)
  }

  // the two low projections of OSM's tower part (entrance halls, 3 levels)
  for (const r of [[[SPINE[0], SP_S], [SPINE[1], SP_S], [SPINE[1], Y0], [SPINE[0], Y0]], [[SPINE[0], Y1], [SPINE[1], Y1], [SPINE[1], SP_N], [SPINE[0], SP_N]]] as XY[][]) {
    ring(r, 0, 13.5)
    capR(r, 13.5)
  }

  // --- The fins at the foot: white plates splaying out from the faces.
  const fin = (base: XY, out: XY, h: number, reach: number) => {
    const t: V3 = unit([out[0], out[1], 0]), side: V3 = unit(cross(t, [0, 0, 1]))
    const w = 0.45
    const Q = (s: number, r: number, z: number): V3 => [base[0] + t[0] * r + side[0] * s, base[1] + t[1] * r + side[1] * s, z]
    for (const s of [-w, w]) poly(frame, [Q(s, 0, 0), Q(s, reach, 0), Q(s, 0, h)], mul(side, Math.sign(s)))
    poly(frame, [Q(-w, reach, 0), Q(w, reach, 0), Q(w, 0, h), Q(-w, 0, h)], unit([t[0] * h, t[1] * h, reach]))
  }
  for (const [x, y] of [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]] as XY[]) fin([x, y], [Math.sign(x), Math.sign(y)], 28, 7)
  for (const x of [-25, -21, 7, 12, 17, 22]) { fin([x, Y0], [0, -1], 24, 5.5); fin([x, Y1], [0, 1], 24, 5.5) }
  for (const y of [-19, -10, 0, 10, 20, 26]) { fin([X0, y], [-1, 0], 24, 5.5); fin([X1, y], [1, 0], 24, 5.5) }

  // --- The podium wings (3 and 2 levels).
  for (const [r, h] of [[PODIUM_NW, 12], [PODIUM_SW, 12], [PODIUM_SE, 8]] as Array<[XY[], number]>) {
    const cc = ccw(r)
    for (let i = 0; i < cc.length; i++) {
      const a = cc[i], b = cc[(i + 1) % cc.length]
      const len = Math.hypot(b[0] - a[0], b[1] - a[1])
      const n: V3 = unit([b[1] - a[1], a[0] - b[0], 0])
      const P = (u: number, z: number, o = 0): V3 => [a[0] + (b[0] - a[0]) * u + n[0] * o, a[1] + (b[1] - a[1]) * u + n[1] * o, z]
      poly(frame, [P(0, 0), P(1, 0), P(1, h), P(0, h)], n)
      if (len > 6) poly(glaze, [P(0.04, 1, 0.05), P(0.96, 1, 0.05), P(0.96, h - 2.4, 0.05), P(0.04, h - 2.4, 0.05)], n)
    }
    capR(cc, h)
  }

  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: frame, material: finish('cosmo-frame', 0xdfe3e6) },
    { part: glaze, material: windowVariant(2, 0x6a8ba0) },
    { part: roof, material: PALETTE.roof },
    { part: red, material: finish('neon-cosmo-crown', 0xc4463f) },
  ]
  return parts
}

if (import.meta.main) {
  const parts = build()
  // move the origin from the tower's centre to the outline's centroid (the anchor):
  // the tower centre sits at (31.7, -2.0) from it in the model frame
  for (const { part } of parts)
    for (let i = 0; i < part.pos.length; i += 3) {
      part.pos[i] += 31.7
      part.pos[i + 2] -= -2.0 // glTF z is -y
    }
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (triangles > 5000) throw new Error(`triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Sakishima Cosmo Tower', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: 318.6, height: H,
  })
  await Bun.write(new URL('../models/osaka-cosmo-tower.glb', import.meta.url), glb)
  console.log(`osaka-cosmo-tower.glb: ${triangles} triangles, ${glb.length} bytes`)
}
