/**
 * Municipal House (Obecní dům), Prague: procedural, CC0-1.0.
 *   bun generators/prague-municipal-house.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/prague-municipal-house.glb, the low model;
 * - models/prague-municipal-house.detail.glb, drawn from zoom 17: the dome's
 *   ribs and oval lights, pilasters, the balconies' ironwork, gilded
 *   medallions, the canopy's frame, and the sculpture drawn rounder.
 *
 * Uses the kit exported by generators/prague-dancing-house.ts and the
 * helpers exported by generators/prague-national-theatre.ts.
 *
 * Frame: not turned (BEARING 0): +x east, +y north, z up, metres. Origin =
 * the anchor 14.42776 E, 50.08776 N (4.5 m north-west of the centroid of
 * the OSM outline way/27124435). y = 0 is the street; the site is level to
 * within 2 m (Mapterhorn z14).
 *
 * Evidence
 * - OSM way/27124435 (Obecní dům, building=civic, Antonín Balšánek and
 *   Osvald Polívka, art_nouveau, height 15, hipped), its outline used,
 *   simplified to 0.6 m; parts: way/482524690 (the corner dome, r 6.3 about
 *   (27.8, -13.4), "height 22"), way/482524691 and way/482524692 (the two
 *   front wings on náměstí Republiky, 18 m with round roofs),
 *   way/482524693 (the entrance canopy, building=roof) and ways
 *   482524694/95 (its two pillars, 9 m).
 * - Published (cs/en.wikipedia "Obecní dům"): 1905-1912, Art Nouveau;
 *   the mosaic "Homage to Prague" (Karel Špillar) in the lunette over the
 *   main entrance, flanked by Ladislav Šaloun's sculpture groups "The
 *   Humiliation of the Czech Nation" and "The Resurrection of the Czech
 *   Nation"; the dome over the corner; Smetana Hall inside.
 * - Commons photos (EVIDENCE):
 *   "Prague Municipal House 01.jpg" (Uoaei1, CC BY-SA 4.0; square on to
 *   the corner from the south-east: the storeys are measured on its left
 *   wing, 20 px/m from the people at its foot: cornice 15.7 m, the green
 *   mansard to 18 m, the lunette's crown about 21 m, the dome's lantern
 *   about 33 m); "Casa municipal, Praga, República Checa, 2022-07-02, DD
 *   09.jpg" (Diego Delso, CC BY-SA 4.0; the same front in sun: colours, the
 *   six arched windows each side, the canopy and pillars); "Municipal House
 *   (Prague).jpg" (Yair Haklai, CC BY-SA 4.0); "Obecní dům in Prague,
 *   2018.jpg" and "(2).jpg" (Szczecinolog, CC BY-SA 4.0; the north wing and
 *   its end pavilion); "Lascar Obecní dům (Municipal House)
 *   (4502264288).jpg" (Jorge Láscar, CC BY 2.0); "Municipal House in
 *   Prague, Czech Republic, September 2019.jpg" (MichalPL, CC BY-SA 4.0);
 *   "Municipal House (Prague) 01(js).jpg" (Jerzy Strzelecki, CC BY-SA 3.0;
 *   night, beside the Powder Tower: the floodlit front and lit dome).
 *
 * Estimated: the bay rhythm (4.3 m, six bays a wing) and window sizes; the
 * dome's profile (drum to 24 m with eight arched lights, a ribbed copper
 * cupola to 30 m, lantern and finial to 34.7 m: the photos put it well above
 * OSM's 22 m); the end pavilions (the north one with a small dome and two
 * spires, the south one by the Powder Tower with a raised gable); the
 * sculpture (the two groups as three figures each, dark, on the lunette's
 * shoulders, and figures on the end pavilions). The mosaic is one bold
 * apricot panel inside a gilded ring. The flat roofs inside the mansards
 * share the sculpture's dark grey.
 *
 * Left out: the bridge to the Powder Tower (OSM way/225234255, not
 * replaced), the flagpoles, the café awnings, the inner courtyards.
 *
 * Doubts: the west and north fronts (Králodvorská, U Obecního domu) are
 * drawn with the front's bays, less richly than the real ones; the dome's
 * height follows the photos, not OSM.
 *
 * Night: the front is floodlit warm (js01); the windows and the dome's
 * lights glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { TAU, add, mul, sub, unit, cross, lathe, loftSmooth, tube, rod, box, prism, triN, quadN, saveLods, triangulate, type PartList, type XY } from './prague-dancing-house'
import { statue, archPanel, pane, insetPoly, type Lod } from './prague-national-theatre'

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

// OSM's outline, clockwise as mapped; reversed below.
const OSM: XY[] = [[-42.5, 15.6], [-41.4, 16.2], [-39.7, 16.4], [-38.3, 15.9], [-37.8, 17.3], [-36.2, 17.6], [-36.2, 17.4], [-20.5, 21.0], [-20.6, 21.4], [-19.7, 21.5], [-19.8, 21.9], [-14.5, 23.1], [-14.5, 22.9], [-13.3, 23.0], [-13.3, 22.8], [8.2, 27.8], [8.1, 28.3], [15.3, 29.8], [15.4, 29.5], [25.5, 31.9], [26.6, 32.2], [26.7, 32.4], [28.6, 32.2], [28.7, 32.7], [29.1, 32.7], [29.7, 33.2], [30.5, 33.1], [30.5, 32.2], [34.4, 32.2], [34.5, 32.9], [35.1, 32.9], [35.7, 32.4], [36.1, 32.4], [36.0, 31.8], [38.0, 31.7], [38.1, 31.3], [38.5, 31.3], [38.1, 24.9], [37.6, 24.9], [37.6, 24.2], [37.2, 24.2], [37.1, 19.7], [36.1, -8.1], [36.5, -8.2], [37.0, -9.3], [37.9, -10.0], [37.8, -10.3], [38.5, -10.5], [36.3, -16.2], [33.7, -22.9], [33.0, -22.7], [32.8, -23.1], [31.6, -23.1], [30.6, -23.4], [30.1, -23.2], [11.6, -45.5], [10.0, -45.1], [10.1, -44.9], [9.2, -44.7], [8.9, -45.3], [5.0, -44.2], [2.8, -43.6], [2.9, -43.1], [2.0, -43.0], [1.9, -43.2], [-6.1, -41.0], [-6.0, -40.6], [-7.2, -40.3], [-7.1, -39.9], [-8.2, -39.3], [-9.5, -38.2], [-10.6, -36.9], [-10.9, -37.1], [-11.2, -36.4], [-11.5, -36.5], [-12.1, -35.8], [-14.8, -31.9], [-14.5, -31.7], [-15.1, -31.1], [-14.8, -30.8], [-15.0, -30.6], [-15.1, -30.6], [-27.1, -13.5], [-26.9, -13.3], [-27.3, -12.8], [-27.5, -12.9], [-28.1, -12.2], [-28.3, -12.3], [-31.5, -7.8], [-31.2, -7.6], [-31.8, -6.9], [-31.4, -6.7], [-40.3, 5.7], [-40.0, 5.8], [-40.5, 6.4], [-40.8, 6.2], [-41.6, 7.4], [-41.0, 9.1], [-42.5, 9.9], [-43.5, 11.1], [-44.2, 12.4], [-44.8, 12.5], [-43.1, 15.8]]

/** Douglas-Peucker on a closed ring. */
function simplify(r: XY[], tol: number): XY[] {
  const dp = (pts: XY[]): XY[] => {
    if (pts.length < 3) return pts
    const a = pts[0], b = pts[pts.length - 1]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    let best = -1, at = 0
    for (let i = 1; i < pts.length - 1; i++) {
      const d = Math.abs((b[0] - a[0]) * (a[1] - pts[i][1]) - (a[0] - pts[i][0]) * (b[1] - a[1])) / l
      if (d > best) { best = d; at = i }
    }
    if (best <= tol) return [a, b]
    const left = dp(pts.slice(0, at + 1)), right = dp(pts.slice(at))
    return [...left.slice(0, -1), ...right]
  }
  // split at the point farthest from the first
  let far = 0, fd = 0
  r.forEach((p, i) => { const d = Math.hypot(p[0] - r[0][0], p[1] - r[0][1]); if (d > fd) { fd = d; far = i } })
  const a = dp(r.slice(0, far + 1)), b = dp([...r.slice(far), r[0]])
  return [...a.slice(0, -1), ...b.slice(0, -1)]
}
const PLAN = simplify([...OSM].reverse(), 0.6)

// The corner front on náměstí Republiky, from its south end to its north end
const FRONT_A: XY = [33.7, -22.9], FRONT_B: XY = [38.5, -10.5]
const DOME: XY = [27.8, -13.4]
const CORNICE = 15.5, MANSARD = 18.4

function build(L: Lod): PartList {
  const stone = new Part(), win = new Part(), copper = new Part(), gold = new Part(), mosaic = new Part(), dark = new Part()

  // --- the block, its cornice and the copper mansard round it ---
  prism(stone, PLAN, 0, CORNICE, null)
  {
    const o = insetPoly(PLAN, -0.7)
    prism(stone, o, CORNICE - 0.8, CORNICE, null, stone)
    for (let i = 0; i < PLAN.length; i++) {
      const a = o[i], b = o[(i + 1) % o.length], c = PLAN[(i + 1) % PLAN.length], d = PLAN[i]
      quadN(stone, [a[0], a[1], CORNICE], [b[0], b[1], CORNICE], [c[0], c[1], CORNICE], [d[0], d[1], CORNICE], [0, 0, 1])
    }
    // the mansard: a curved copper band rising from behind the cornice, one
    // strip per wall (no mitred insets, which a plan this ragged folds over)
    const steps = L.detail ? 4 : 2, DEPTH = 2.6
    for (let i = 0; i < PLAN.length; i++) {
      const a = PLAN[i], b = PLAN[(i + 1) % PLAN.length]
      const l = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (l < 0.3) continue
      const nin: XY = [-(b[1] - a[1]) / l, (b[0] - a[0]) / l]
      const at = (p: XY, k: number): V3 => {
        const ph = (k / steps) * (Math.PI / 2), ins = 0.2 + (DEPTH - 0.2) * (1 - Math.cos(ph))
        return [p[0] + nin[0] * ins, p[1] + nin[1] * ins, CORNICE + (MANSARD - CORNICE) * Math.sin(ph)]
      }
      for (let k = 0; k < steps; k++) {
        const A = at(a, k), B = at(b, k), C = at(b, k + 1), D = at(a, k + 1)
        let n = unit(cross(sub(B, A), sub(D, A)))
        if (n[2] < 0) n = mul(n, -1)
        quadN(copper, A, B, C, D, n)
      }
      // the strip's top and its inner face down to the roof
      const T0 = at(a, steps), T1 = at(b, steps)
      const I0: V3 = [a[0] + nin[0] * (DEPTH + 0.6), a[1] + nin[1] * (DEPTH + 0.6), MANSARD], I1: V3 = [b[0] + nin[0] * (DEPTH + 0.6), b[1] + nin[1] * (DEPTH + 0.6), MANSARD]
      quadN(copper, T0, T1, I1, I0, [0, 0, 1])
      quadN(copper, I0, I1, [I1[0], I1[1], CORNICE + 0.2], [I0[0], I0[1], CORNICE + 0.2], [nin[0], nin[1], 0])
    }
    // the flat roof inside
    for (const [i, j, k] of triangulate(PLAN)) triN(dark, [PLAN[i][0], PLAN[i][1], CORNICE + 0.2], [PLAN[j][0], PLAN[j][1], CORNICE + 0.2], [PLAN[k][0], PLAN[k][1], CORNICE + 0.2], [0, 0, 1])
  }

  // --- the fronts: shops, mezzanine, balcony, arched piano nobile, oval attic lights ---
  const isFront = (a: XY, b: XY) => Math.hypot(a[0] - FRONT_A[0], a[1] - FRONT_A[1]) < 1.5 && Math.hypot(b[0] - FRONT_B[0], b[1] - FRONT_B[1]) < 1.5
  for (let i = 0; i < PLAN.length; i++) {
    const a = PLAN[i], b = PLAN[(i + 1) % PLAN.length]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (len < 3.6 || isFront(a, b)) continue
    const u: V3 = [(b[0] - a[0]) / len, (b[1] - a[1]) / len, 0], w: V3 = [u[1], -u[0], 0]
    const n = Math.max(1, Math.round(len / 4.3)), bay = len / n
    for (let k = 0; k < n; k++) {
      const s = (k + 0.5) * bay
      const c = (z: number): V3 => [a[0] + u[0] * s, a[1] + u[1] * s, z]
      pane(win, c(2.5), u, w, Math.min(1.3, bay * 0.32), 1.9)
      pane(win, c(5.9), u, w, Math.min(1.0, bay * 0.25), 0.8)
      archPanel(win, c(11.4), u, w, Math.min(1.0, bay * 0.24), 3.0, 0.05, L.detail ? 8 : 3)
      const oc = c(13.9), m = L.detail ? 10 : 6
      const ring = Array.from({ length: m }, (_, q) => add(add(oc, mul(u, 0.55 * Math.cos((q / m) * TAU))), add([0, 0, 0.38 * Math.sin((q / m) * TAU)], mul(w, 0.05))))
      for (let q = 0; q < m; q++) triN(win, add(oc, mul(w, 0.05)), ring[q], ring[(q + 1) % m], w)
      if (L.detail) {
        // pilasters, a gilded medallion over each arch
        if (k > 0) box(stone, [a[0] + u[0] * k * bay, a[1] + u[1] * k * bay, 11.5], u, [0, 0, 1], w, 0.3, 3.6, -0.05, 0.2)
        const md = add(c(12.95), mul(w, 0.1))
        const mm = Array.from({ length: 8 }, (_, q) => add(md, add(mul(u, 0.32 * Math.cos((q / 8) * TAU)), [0, 0, 0.32 * Math.sin((q / 8) * TAU)])))
        for (let q = 0; q < 8; q++) triN(gold, md, mm[q], mm[(q + 1) % 8], w)
      }
    }
    // the balcony: a slab along the wall with its green iron railing
    box(stone, [lerp(a[0], b[0], 0.5), lerp(a[1], b[1], 0.5), 7.6], u, [0, 0, 1], w, len / 2 - 0.3, 0.18, -0.05, 0.9)
    if (L.detail) {
      const posts = Math.max(2, Math.round(len / 1.2))
      for (let q = 0; q <= posts; q++) {
        const t = 0.3 / len + ((1 - 0.6 / len) * q) / posts
        const p = add([lerp(a[0], b[0], t), lerp(a[1], b[1], t), 7.78], mul(w, 0.8))
        rod(copper, p, add(p, [0, 0, 1.0]), 0.04, 4, false)
      }
      const p0 = add([lerp(a[0], b[0], 0.02), lerp(a[1], b[1], 0.02), 8.8], mul(w, 0.8)), p1 = add([lerp(a[0], b[0], 0.98), lerp(a[1], b[1], 0.98), 8.8], mul(w, 0.8))
      rod(copper, p0, p1, 0.06, 4, false)
    } else {
      const p0 = add([lerp(a[0], b[0], 0.02), lerp(a[1], b[1], 0.02), 8.6], mul(w, 0.8)), p1 = add([lerp(a[0], b[0], 0.98), lerp(a[1], b[1], 0.98), 8.6], mul(w, 0.8))
      rod(copper, p0, p1, 0.1, 3, false)
    }
  }

  // --- the corner front: entrance, canopy, the lunette with the mosaic, sculpture ---
  {
    const len = Math.hypot(FRONT_B[0] - FRONT_A[0], FRONT_B[1] - FRONT_A[1])
    const u: V3 = [(FRONT_B[0] - FRONT_A[0]) / len, (FRONT_B[1] - FRONT_A[1]) / len, 0], w: V3 = [u[1], -u[0], 0]
    const F = (s: number, t: number, z: number): V3 => [FRONT_A[0] + u[0] * s + w[0] * t, FRONT_A[1] + u[1] * s + w[1] * t, z]
    const mid = len / 2
    // the gable: a slab rising over the cornice with a semicircular top, 3 m deep
    const R = 6.3, SPR = 14.6, D = 3.0
    const prof: XY[] = [[0.2, CORNICE - 0.8], [len - 0.2, CORNICE - 0.8]]
    const seg = L.detail ? 16 : 8
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI
      prof.push([mid + R * Math.cos(a), SPR + R * Math.sin(a)])
    }
    // front and back faces and the curved top, as a prism in (s, z)
    const ring = prof.filter((p) => p[1] >= CORNICE - 0.8)
    const ccwRing = ring
    const front = ccwRing.map(([s, z]) => F(s, 0.25, z)), back = ccwRing.map(([s, z]) => F(s, -D, z))
    for (const [i, j, k] of triangulate(ccwRing)) {
      triN(stone, front[i], front[j], front[k], w)
      triN(stone, back[i], back[k], back[j], mul(w, -1))
    }
    for (let i = 0; i < ring.length; i++) {
      const j = (i + 1) % ring.length
      const e = sub(front[j], front[i])
      let n = unit(cross(e, w))
      const c = F(mid, 0, SPR)
      if ((front[i][2] - c[2]) * n[2] + (front[i][0] - c[0]) * n[0] + (front[i][1] - c[1]) * n[1] < 0) n = mul(n, -1)
      quadN(stone, front[i], front[j], back[j], back[i], n)
    }
    // the mosaic in its gilded ring
    const mr = 4.8, ms = L.detail ? 20 : 10
    const arc = (r: number, out: number) => Array.from({ length: ms + 1 }, (_, i) => F(mid + r * Math.cos((i / ms) * Math.PI), out, SPR + r * Math.sin((i / ms) * Math.PI)))
    const inner = arc(mr, 0.3), ringIn = arc(mr, 0.32), ringOut = arc(mr + 0.6, 0.32)
    const base = F(mid, 0.3, SPR)
    for (let i = 0; i < ms; i++) triN(mosaic, base, inner[i], inner[i + 1], w)
    quadN(mosaic, F(mid - mr, 0.3, SPR - 1.2), F(mid + mr, 0.3, SPR - 1.2), F(mid + mr, 0.3, SPR), F(mid - mr, 0.3, SPR), w)
    for (let i = 0; i < ms; i++) quadN(gold, ringIn[i], ringOut[i], ringOut[i + 1], ringIn[i + 1], w)
    // the window band under the mosaic and the balcony across it
    pane(win, F(mid, 0.25, 11.2), u, w, 3.6, 1.6)
    box(stone, F(mid, 0.25, 8.4), u, [0, 0, 1], w, mid - 0.6, 0.25, -0.05, 1.3)
    rod(copper, F(0.8, 1.45, 9.6), F(len - 0.8, 1.45, 9.6), L.detail ? 0.07 : 0.1, L.detail ? 4 : 3, false)
    // the entrance: three glazed doorways
    for (const s of [mid - 3.2, mid, mid + 3.2]) archPanel(win, F(s, 0.25, 4.6), u, w, 1.2, 4.0, 0.05, L.detail ? 8 : 4)
    // the canopy over the pavement, on its two lamp pillars (OSM 482524693-95)
    {
      const cz = 7.3
      const can: XY[] = [[0.5, 0.2], [len - 0.5, 0.2], [len - 1.5, 4.6], [1.5, 4.6]].map(([s, t]) => { const p = F(s, t, 0); return [p[0], p[1]] as XY })
      const ccw = (r: XY[]) => (r.reduce((acc, p, i) => { const q = r[(i + 1) % r.length]; return acc + p[0] * q[1] - q[0] * p[1] }, 0) >= 0 ? r : [...r].reverse())
      prism(win, ccw(can), cz, cz + 0.25, win, win)
      prism(copper, ccw(insetPoly(ccw(can), -0.12)), cz + 0.25, cz + 0.55, copper, null)
      for (const [x, y] of [[38.8, -21.3], [41.0, -15.7]] as XY[]) {
        lathe(copper, x, y, [[0.45, 0], [0.32, 0.8], [0.28, 7.6], [0.5, 8.0], [0.35, 8.6], [0.0, 9.2]], L.detail ? 10 : 6)
        if (L.detail) statue(dark, [x, y, 9.0], w, 1.6, L, 3)
      }
      if (L.detail) for (let q = 0; q <= 6; q++) {
        const s = lerp(1.0, len - 1.0, q / 6)
        rod(copper, F(s, 0.3, cz + 0.55), F(s, 4.3, cz + 0.55), 0.06, 4, false)
      }
    }
    // Šaloun's groups on the lunette's shoulders: three figures each
    for (const side of [-1, 1]) {
      const s0 = mid + side * (R + 0.6)
      for (let k = 0; k < 3; k++) {
        const ds = side * (k - 1) * 0.9
        const h = k === 1 ? 3.1 : 2.4
        const f = unit(add(w, mul(u, -side * 0.35 * (k - 1))))
        statue(dark, F(Math.min(len - 0.4, Math.max(0.4, s0 + ds - side * 0.8)), -0.6 + k * 0.4, CORNICE), f, h, L, k + (side > 0 ? 1 : 0))
      }
    }
    // a gilded crest on the lunette's crown
    const cp = F(mid, -0.5, 0)
    lathe(gold, cp[0], cp[1], [[0.7, SPR + R], [0.55, SPR + R + 0.8], [0.25, SPR + R + 1.4], [0, SPR + R + 1.8]], L.detail ? 10 : 6)
  }

  // --- the dome over the corner ---
  {
    const [cx, cy] = DOME
    const seg = L.detail ? 32 : 16
    lathe(stone, cx, cy, [[6.0, CORNICE], [6.0, 23.0], [6.4, 23.4], [6.4, 23.9], [6.0, 24.0]], seg)
    // eight tall arched lights round the drum
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * TAU + Math.PI / 8
      const w: V3 = [Math.cos(a), Math.sin(a), 0], u: V3 = [-Math.sin(a), Math.cos(a), 0]
      archPanel(win, [cx + 6.0 * w[0], cy + 6.0 * w[1], 21.4], u, w, 1.1, 2.6, 0.06, L.detail ? 8 : 4)
      if (L.detail) box(stone, [cx + 6.0 * Math.cos(a + Math.PI / 8), cy + 6.0 * Math.sin(a + Math.PI / 8), 20.2], [-Math.sin(a + Math.PI / 8), Math.cos(a + Math.PI / 8), 0], [0, 0, 1], [Math.cos(a + Math.PI / 8), Math.sin(a + Math.PI / 8), 0], 0.35, 3.3, -0.05, 0.35)
    }
    // the ribbed copper cupola, a little bell-shaped, then the lantern and finial
    const cup: XY[] = [[6.0, 24.0], [5.95, 25.4], [5.6, 26.9], [4.7, 28.4], [3.3, 29.6], [1.7, 30.2]]
    lathe(copper, cx, cy, cup, seg)
    lathe(copper, cx, cy, [[1.7, 30.2], [1.45, 30.3], [1.45, 31.9], [1.75, 32.1], [1.2, 32.7], [0.35, 33.1], [0.0, 33.2]], L.detail ? 16 : 8)
    lathe(gold, cx, cy, [[0.2, 33.1], [0.32, 33.5], [0.06, 34.6], [0, 34.7]], 6)
    if (L.detail) {
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * TAU
        rod(win, [cx + 1.47 * Math.cos(a + 0.4), cy + 1.47 * Math.sin(a + 0.4), 30.5], [cx + 1.47 * Math.cos(a + 0.4), cy + 1.47 * Math.sin(a + 0.4), 31.7], 0.3, 4, false)
      }
    }
    // ribs, and an oval light between each pair
    const RIBS = L.detail ? 16 : 8
    for (let k = 0; k < RIBS; k++) {
      const a = (k / RIBS) * TAU
      const pts = cup.map(([r, z]) => [cx + (r + 0.12) * Math.cos(a), cy + (r + 0.12) * Math.sin(a), z] as V3)
      tube(L.detail && k % 2 ? copper : gold, pts, L.detail ? 0.14 : 0.18, 4, false)
    }
    for (let k = 0; k < 8; k++) {
      const a = ((k + 0.5) / 8) * TAU
      const r = 5.68, z = 26.4
      const w: V3 = unit([Math.cos(a) * 0.9, Math.sin(a) * 0.9, 0.45]), u: V3 = [-Math.sin(a), Math.cos(a), 0]
      const v = unit(cross(w, u))
      const c: V3 = [cx + r * Math.cos(a) + w[0] * 0.08, cy + r * Math.sin(a) + w[1] * 0.08, z + w[2] * 0.08]
      const m = L.detail ? 12 : 6
      const ring = Array.from({ length: m }, (_, q) => add(c, add(mul(u, 0.65 * Math.cos((q / m) * TAU)), mul(v, -0.95 * Math.sin((q / m) * TAU)))))
      for (let q = 0; q < m; q++) triN(win, c, ring[q], ring[(q + 1) % m], w)
    }
  }

  // --- the end pavilions ---
  {
    // north: a raised block with a small copper dome and two spires
    const nb: XY[] = [[30.5, 24.6], [37.9, 24.6], [38.3, 31.3], [30.5, 32.2]]
    prism(stone, nb, CORNICE, 19.0, null)
    lathe(copper, 34.3, 28.3, [[4.2, 19.0], [4.0, 20.4], [3.2, 22.0], [1.6, 23.2], [0.6, 23.6], [0.5, 24.6], [0, 25.6]], L.detail ? 20 : 10)
    for (const [x, y] of [[37.6, 25.2], [37.7, 30.8]] as XY[]) lathe(copper, x, y, [[0.6, 17.5], [0.6, 20.5], [0.3, 23.5], [0.0, 26.8]], L.detail ? 8 : 5)
    for (const [x, y] of [[38.0, 26.6], [38.0, 29.6]] as XY[]) statue(stone, [x, y, CORNICE], [1, 0, 0], 2.4, L, 1)
    // south, by the Powder Tower: a raised gable with figures
    const sb: XY[] = [[8.6, -45.2], [12.3, -45.0], [16.6, -39.8], [12.0, -36.0], [5.0, -41.5]]
    prism(stone, sb, CORNICE, 19.2, null)
    lathe(copper, 10.6, -41.0, [[3.8, 19.2], [2.8, 21.0], [1.0, 22.6], [0, 23.2]], L.detail ? 12 : 6)
    for (const [x, y] of [[14.0, -41.6], [11.7, -44.2]] as XY[]) statue(stone, [x, y, 19.2], unit([0.72, -0.69, 0]), 2.4, L, 2)
  }

  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : p[0] > 20 && p[1] < 5 ? 0.9 : 0.6)
  return [
    { part: stone, material: { ...finish('obecni-render', 0xe7d39f), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: copper, material: { ...PALETTE.copper, color: 0x86ad98, floodlight: (p: V3) => (p[2] > 20 ? 0.5 : 0) } },
    { part: gold, material: { ...finish('obecni-gold', 0xd5ac4d, 0.45), floodlight: () => 0.7 } },
    { part: mosaic, material: { ...finish('obecni-mosaic', 0xdc8f55), floodlight: () => 0.8 } },
    { part: dark, material: finish('obecni-sculpture', 0x6a6863) },
  ]
}
void loftSmooth

if (import.meta.main) {
  await saveLods('prague-municipal-house', 'Municipal House', build({ detail: false }), build({ detail: true }), {
    anchor: [50.08776, 14.42776], bearing: 0, height: 34.7,
  })
}
