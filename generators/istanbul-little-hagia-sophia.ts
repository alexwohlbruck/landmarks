/**
 * Little Hagia Sophia (Küçük Ayasofya Camii; the church of Saints Sergius
 * and Bacchus, 527–536, converted to a mosque c. 1500 under Bayezid II,
 * portico and minaret Ottoman), Istanbul — original procedural geometry,
 * CC0-1.0.
 * bun generators/istanbul-little-hagia-sophia.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 20: the model's +x is compass 110°, the church's
 * east (the apse), its +y compass 20°. 20 squares the north and west walls
 * of the OSM outline (way/303179753, edges at 109.7–113° and 20.7°); the
 * south wall really runs 6° off (the church is famously irregular) and is
 * drawn as OSM has it. Anchor = the outline's centroid, 28.972207, 41.002744.
 *
 * Identity (from the photos below):
 *  1. The low "pumpkin" dome, lead, on an octagonal drum with one arched
 *     window per face and stubby buttresses with lead tops at the corners;
 *     the drum plastered pink-red.                       (sb, lhs)
 *  2. The squarish block below it, warm grey ashlar with bold brick bands
 *     (the bands share the drum's red), with a
 *     low lead roof, and the apse on the east.           (lhs, sb)
 *  3. The Ottoman portico (son cemaat yeri) on the west: open arches on
 *     columns under a row of five small lead domes, before the lower
 *     narthex.                                           (sb)
 *  4. The single slender minaret at the south-west corner: square stone
 *     base, one balcony, a tall lead cone.               (sb, lhs, ali02)
 *
 * Plan: OSM (© OpenStreetMap contributors, ODbL) way/303179753, turned to
 * bearing 20: main block x −9.0…19.1, y −14.8…14.4; apse x 19.1…22.9 (three
 * faces); narthex and portico x −21.6…−9.0, y −13.0…10.8 (the portico taken
 * as the outer 6.6 m, the narthex the inner 6 m, as sb shows a lower wall
 * behind the portico domes). The minaret: OSM node/13583574252
 * (man_made=tower, tower:type=minaret), at (−16.4, −15.9) in this frame,
 * drawn at (−16.4, −15.0) so its base touches the narthex corner as in sb.
 * OSM has no heights.
 *
 * Heights, estimated from the photos (no published exterior heights found):
 * scaled from sb (from the north-west, roughly level with the drum) with the
 * block's length (28 m, OSM) as the ruler:
 * main walls 14 m, drum 14.5–20.4 m (Ø 15 m, 18 m over the buttresses),
 * dome rise 3.0 m (crown 23.9 m), finial to 25.8 m; narthex 11 m; portico arches springing at 4.2 m, roof 7 m,
 * domes to 9.4 m; minaret balcony 21.5 m, cap 25.5–31 m, finial 32.6 m
 * (≈ 8 m above the dome finial in sb). Window sizes and counts estimated.
 * The minaret is drawn about 1.5× its real girth (city notes).
 *
 * Ground: no Mapterhorn z15 terrain (404) and no lidar. The site is level
 * (the mosque garden and Küçük Ayasofya Caddesi); elevation 0.
 *
 * Night: the walls, drum and minaret are floodlit; windows glow.
 *
 * Photos (evidence, Wikimedia Commons):
 *  sb     "Sergius and Bacchus.jpg", fusion-of-horizons, CC BY 2.0 (from the NW, raised)
 *  lhs    "Little Hagia Sophia.JPG", DavidConFran, CC BY-SA 3.0 (from the SE)
 *  d0982  "Little Aya Sophia 0982.jpg", Dosseman, CC BY-SA 4.0 (north side, cemetery)
 *  lor    "Küçük Ayasofya Camii.jpg", Loresue, CC0 (from the east)
 *  ali02  "Küçük Ayasofya Camii 02.jpg", Alicembasli, CC BY-SA 4.0 (minaret)
 *  ali04  "Küçük Ayasofya Camii 04.jpg", Alicembasli, CC BY-SA 4.0 (portico)
 * Look-only: none.
 *
 * Doubts: all heights are photo-scaled; the south side is seen only
 * obliquely; the narthex/portico split of OSM's west part is read from sb;
 * the little north annex strip in OSM (y 13.1–14.9) is folded into the
 * main block; the drum's real form is a sixteen-sided ring of windows and
 * buttresses, drawn as an octagon with corner buttresses.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { TAU, box, capPoly, ccw, circle, prism, save, smoothWall, wall, type XY } from './atl-flatiron-building'
import { archShape, onWall, revolve } from './atl-tech-tower'

const masonry = new Part(), plaster = new Part(), lead = new Part(), stone = new Part(), win = new Part(), gilt = new Part()

const nrm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
function poly(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    const g = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]
    if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.tri(a, b, c)
    else p.tri(a, c, b)
  }
}
const domeProf = (R: number, z0: number, rise: number, k = 6, lip = 0): [number, number][] => {
  const pr: [number, number][] = lip ? [[R + lip, z0 - 0.3], [R + lip, z0]] : []
  for (let i = 0; i <= k; i++) { const t = (i / k) * (Math.PI / 2); pr.push([R * Math.cos(t), z0 + rise * Math.sin(t)]) }
  pr[pr.length - 1][0] = 0
  return pr
}
function alem(c: XY, z: number, h: number) {
  const s = h / 4
  revolve(gilt, c, [[0.3 * s, z], [0.75 * s, z + 0.7 * s], [0.3 * s, z + 1.5 * s], [0.5 * s, z + 2.0 * s], [0.12 * s, z + 2.8 * s], [0, z + h]], 6)
}

/**
 * An open arcade in the vertical plane a→b (outside to the right): n round
 * arches between columns of radius cr, springing at zs, under a band to z1,
 * `t` thick (going inward from the line). Real openings: front and back
 * spandrel faces, arch soffits, round columns.
 */
export function arcade(face: Part, col: Part, a: XY, b: XY, n: number, cr: number, zs: number, z1: number, t: number, ends = true, seg = 8, back: Part = face) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), d: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], o: XY = [d[1], -d[0]]
  const P = (s: number, z: number, off: number): V3 => [a[0] + d[0] * s + o[0] * off, a[1] + d[1] * s + o[1] * off, z]
  const w = L / n, r = w / 2 - cr * 0.85
  const nOut: V3 = [o[0], o[1], 0], nIn: V3 = [-o[0], -o[1], 0]
  for (let k = 0; k < n; k++) {
    const s0 = k * w, s1 = s0 + w, sc = s0 + w / 2
    const arc = Array.from({ length: seg + 1 }, (_, i) => { const q = Math.PI - (i / seg) * Math.PI; return [sc + r * Math.cos(q), zs + r * Math.sin(q)] as [number, number] })
    const tops = arc.map((_, i) => s0 + (w * i) / seg)
    for (const [off, nn, fp] of [[0, nOut, face], [-t, nIn, back]] as [number, V3, Part][]) {
      poly(fp, [P(s0, zs, off), P(arc[0][0], zs, off), P(arc[0][0], z1, off), P(s0, z1, off)], nn)
      poly(fp, [P(arc[seg][0], zs, off), P(s1, zs, off), P(s1, z1, off), P(arc[seg][0], z1, off)], nn)
      for (let i = 0; i < seg; i++) {
        const xa = Math.max(arc[0][0], Math.min(arc[seg][0], tops[i])), xb = Math.max(arc[0][0], Math.min(arc[seg][0], tops[i + 1]))
        poly(fp, [P(arc[i][0], arc[i][1], off), P(arc[i + 1][0], arc[i + 1][1], off), P(xb, z1, off), P(xa, z1, off)], nn)
      }
    }
    for (let i = 0; i < seg; i++) {
      const [s0a, z0a] = arc[i], [s1a, z1a] = arc[i + 1], mx = (s0a + s1a) / 2 - sc, mz = (z0a + z1a) / 2 - zs
      const nn = nrm([-(d[0] * mx), -(d[1] * mx), -mz])
      poly(face, [P(s0a, z0a, 0), P(s1a, z1a, 0), P(s1a, z1a, -t), P(s0a, z0a, -t)], nn)
    }
    // the flat underside between arches, over the columns
    poly(face, [P(s0, zs, 0), P(arc[0][0], zs, 0), P(arc[0][0], zs, -t), P(s0, zs, -t)], [0, 0, -1])
    poly(face, [P(arc[seg][0], zs, 0), P(s1, zs, 0), P(s1, zs, -t), P(arc[seg][0], zs, -t)], [0, 0, -1])
  }
  for (let k = ends ? 0 : 1; k <= (ends ? n : n - 1); k++) {
    const c = P(k * w, 0, -t / 2)
    smoothWall(col, circle([c[0], c[1]], cr, 8), 0, zs)
  }
  if (ends) for (const [s, sg] of [[0, -1], [L, 1]] as [number, number][]) poly(face, [P(s, zs, 0), P(s, zs, -t), P(s, z1, -t), P(s, z1, 0)], [d[0] * sg, d[1] * sg, 0])
}

if (import.meta.main) {
  // ─────────────────────────────── the plan ────────────────────────────────
  const BODY: XY[] = ccw([[-8.95, -14.83], [18.77, -11.86], [19.13, -4.37], [18.95, 7.35], [17.59, 14.36], [-9.2, 13.6], [-9.0, 10.76]])
  const APSE: XY[] = ccw([[18.6, -4.37], [19.13, -4.37], [22.65, -1.35], [22.87, 4.29], [18.95, 7.35], [18.6, 7.35]])
  const Z_BODY = 14, C: XY = [5.0, -0.2]

  // 1. The main block, the apse, the narthex.
  prism(masonry, BODY, 0, Z_BODY, lead, 0.4)
  prism(masonry, APSE, 0, 11.5, lead, 0.35)
  box(masonry, -15.0, -9.0, -13.0, 10.76, 0, 11, lead, 0.35)
  // a pale string course at the top of the walls
  {
    const o = BODY.map(([x, y]) => [x, y] as XY)
    for (let i = 0; i < o.length; i++) {
      const p = o[i], q = o[(i + 1) % o.length], L = Math.hypot(q[0] - p[0], q[1] - p[1])
      if (L < 2) continue
      onWall(stone, p, q, [[0, Z_BODY - 0.9], [L, Z_BODY - 0.9], [L, Z_BODY - 0.4], [0, Z_BODY - 0.4]], 0.07)
    }
  }
  // three bold bands of brick courses round the grey stone block (lhs, sb)
  for (let i = 0; i < BODY.length; i++) {
    const p = BODY[i], q = BODY[(i + 1) % BODY.length], L = Math.hypot(q[0] - p[0], q[1] - p[1])
    if (L < 2) continue
    for (const [z, h] of [[1.7, 1.0], [6.3, 1.4], [11.7, 1.1]]) onWall(plaster, p, q, [[0, z], [L, z], [L, z + h], [0, z + h]], 0.04)
  }
  // the same bands on the apse and the narthex (below their roofs)
  for (const ring of [APSE, ccw([[-15.0, -13.0], [-9.0, -13.0], [-9.0, 10.76], [-15.0, 10.76]])]) {
    for (let i = 0; i < ring.length; i++) {
      const p = ring[i], q = ring[(i + 1) % ring.length], L = Math.hypot(q[0] - p[0], q[1] - p[1])
      if (L < 2 || (p[0] === -9.0 && q[0] === -9.0)) continue
      for (const [z, h] of [[1.7, 1.0], [6.3, 1.4]]) onWall(plaster, p, q, [[0, z], [L, z], [L, z + h], [0, z + h]], 0.04)
    }
  }
  // a low hipped lead roof over the block, round the drum
  {
    const ring = BODY.map(([x, y]) => [x + (C[0] - x) * 0.04, y + (C[1] - y) * 0.04] as XY)
    const inner = ring.map(([x, y]) => [C[0] + (x - C[0]) * 0.62, C[1] + (y - C[1]) * 0.62] as XY)
    for (let i = 0; i < ring.length; i++) {
      const j = (i + 1) % ring.length
      lead.quad([ring[i][0], ring[i][1], Z_BODY], [ring[j][0], ring[j][1], Z_BODY], [inner[j][0], inner[j][1], Z_BODY + 0.8], [inner[i][0], inner[i][1], Z_BODY + 0.8])
    }
    capPoly(lead, inner, Z_BODY + 0.8, true)
  }

  // 2. The drum: an octagon of arched windows with buttresses at its corners.
  const R8 = 7.4, Z_D0 = Z_BODY + 0.5, Z_D1 = 20.4
  const oct = circle(C, R8, 8, Math.PI / 8)
  wall(plaster, oct, Z_D0, Z_D1)
  for (let i = 0; i < 8; i++) {
    const a = oct[i], b = oct[(i + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    onWall(win, a, b, archShape(L / 2, 1.5, 16.4, 18.9, 6), 0.06)
    // the corner buttress, radial, with a sloping lead top
    const ang = Math.PI / 8 + (i / 8) * TAU, ux = Math.cos(ang), uy = Math.sin(ang), vx = -uy, vy = ux, w = 0.75
    const P = (r: number, s: number, z: number): V3 => [C[0] + ux * r + vx * s, C[1] + uy * r + vy * s, z]
    const r0 = R8 - 0.3, r1 = R8 + 1.5, zt = 19.6, zb = 18.4
    poly(plaster, [P(r0, -w, Z_D0), P(r1, -w, Z_D0), P(r1, -w, zb), P(r0, -w, zt)], [-vx, -vy, 0])
    poly(plaster, [P(r0, w, Z_D0), P(r1, w, Z_D0), P(r1, w, zb), P(r0, w, zt)], [vx, vy, 0])
    poly(plaster, [P(r1, -w, Z_D0), P(r1, w, Z_D0), P(r1, w, zb), P(r1, -w, zb)], [ux, uy, 0])
    poly(lead, [P(r0, -w - 0.1, zt + 0.1), P(r1 + 0.15, -w - 0.1, zb), P(r1 + 0.15, w + 0.1, zb), P(r0, w + 0.1, zt + 0.1)], nrm([ux, uy, (r1 - r0) / (zt - zb)]))
  }
  // cornice, the pumpkin dome (faceted: sixteen flat gores), the finial
  revolve(stone, C, [[R8 * 0.94, Z_D1 - 0.1], [R8 + 0.35, Z_D1 + 0.05], [R8 + 0.35, Z_D1 + 0.4], [R8 - 0.2, Z_D1 + 0.45]], 16, 0, true, false)
  revolve(lead, C, domeProf(R8 - 0.2, Z_D1 + 0.45, 3.0, 5), 16, 0, true)
  alem(C, 23.75, 2.1)

  // 3. Windows on the block: two tiers on the long walls, the apse, the narthex.
  const edge = (i: number): [XY, XY] => [BODY[i], BODY[(i + 1) % BODY.length]]
  for (let i = 0; i < BODY.length; i++) {
    const [a, b] = edge(i), L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 15) continue
    const n = Math.round(L / 6.5)
    const ss = Array.from({ length: n }, (_, k) => (L * (k + 0.5)) / n)
    for (const s of ss) {
      onWall(win, a, b, [[s - 0.75, 3.4], [s + 0.75, 3.4], [s + 0.75, 5.6], [s - 0.75, 5.6]], 0.06)
      onWall(win, a, b, archShape(s, 1.5, 8.4, 10.6, 6), 0.06)
    }
  }
  {
    const fa: XY[] = [[19.13, -4.37], [22.65, -1.35], [22.87, 4.29], [18.95, 7.35]]
    for (let i = 0; i < 3; i++) {
      const L = Math.hypot(fa[i + 1][0] - fa[i][0], fa[i + 1][1] - fa[i][1])
      onWall(win, fa[i], fa[i + 1], archShape(L / 2, 1.5, 5.5, 8.6, 6), 0.06)
    }
  }
  // the narthex's upper windows over the portico roof (west face)
  for (const s of [5, 11.9, 18.8]) onWall(win, [-15.0, 10.76], [-15.0, -13.0], archShape(s, 1.4, 8.0, 9.6, 6), 0.06)

  // 4. The portico: an open arcade of five bays on the west, one at each end,
  //    the flat lead roof and its five small domes.
  {
    const X0 = -21.58, X1 = -15.0, Y0 = -11.1, Y1 = 10.7, ZS = 4.2, ZT = 7.0
    arcade(stone, stone, [X0, Y1], [X0, Y0], 5, 0.34, ZS - 0.15, ZT, 0.7)
    arcade(stone, stone, [X0, Y0], [X1, Y0], 1, 0.34, ZS - 0.15, ZT, 0.7, false)
    arcade(stone, stone, [X1, Y1], [X0, Y1], 1, 0.34, ZS - 0.15, ZT, 0.7, false)
    box(stone, X0 - 0.15, X1, Y0 - 0.15, Y1 + 0.15, ZT, ZT + 0.5, lead, 0.25, true)
    for (let k = 0; k < 5; k++) {
      const c: XY = [(X0 + X1) / 2 - 0.2, Y0 + ((Y1 - Y0) * (k + 0.5)) / 5]
      smoothWall(stone, circle(c, 1.9, 12), ZT + 0.5, ZT + 1.0)
      revolve(lead, c, domeProf(1.9, ZT + 1.0, 1.4, 3, 0.15), 12)
      alem(c, ZT + 2.35, 0.7)
    }
  }

  // 5. The minaret.
  {
    const c: XY = [-16.4, -15.0], h = 1.45
    box(stone, c[0] - h, c[0] + h, c[1] - h, c[1] + h, 0, 9.0, stone, 0.25)
    revolve(stone, c, [[h * 1.1, 9.0], [1.2, 10.6]], 12, Math.PI / 12, true, false)
    smoothWall(stone, circle(c, 1.2, 12), 10.6, 20.5)
    revolve(stone, c, [[1.2, 20.5], [2.05, 21.5], [2.05, 22.5], [1.15, 22.5]], 12, 0, false, false)
    smoothWall(stone, circle(c, 1.08, 12), 22.5, 25.3)
    revolve(stone, c, [[1.08, 25.3], [1.32, 25.5]], 12, 0, true, false)
    revolve(lead, c, [[1.32, 25.5], [0, 31.0]], 12, 0, true, false)
    capPoly(lead, circle(c, 1.32, 12), 25.5, false)
    alem(c, 30.8, 1.8)
  }

  const lit = (_p: V3, n: V3) => (n[2] < 0.6 ? 0.7 : 0.15)
  await save('istanbul-little-hagia-sophia', 'Little Hagia Sophia', [
    { part: masonry, material: { ...finish('kucuk-masonry', 0xc9bdae), floodlight: lit } },
    { part: plaster, material: { ...finish('kucuk-plaster', 0xcf8a74), floodlight: lit } },
    { part: lead, material: finish('kucuk-lead', 0xa3acb5, 0.6) },
    { part: stone, material: { ...PALETTE.stone, floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: gilt, material: finish('kucuk-gilt', 0xd8aa45, 0.5) },
  ], { height: 32.6, anchor: [41.002744, 28.972207], bearing: 20 }, 5000)
}
