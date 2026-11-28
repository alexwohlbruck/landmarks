/**
 * Maishima Incineration Plant (舞洲工場), Maishima, Konohana, Osaka:
 * procedural, CC0-1.0.
 * bun generators/osaka-maishima-plant.ts
 *
 * Map frame: x across the plant (east-south-east +), y along it (north-
 * north-east +), z up, metres; origin on the ground at the centroid of the
 * building's outer ring (OSM relation/8374661). Bearing 8.4, the long walls'
 * direction.
 *
 * The plant's exterior is Friedensreich Hundertwasser's (completed April
 * 2001): a long white body with red and yellow stripes, wavy rooflines with
 * gold balls on posts, a red tower block, black-and-white chequer panels,
 * irregular windows, gold onion domes, and the 120 m chimney, sky blue with
 * red veins, crowned by a gold ball.
 *
 * Published (ja.wikipedia "舞洲工場"): chimney 120 m; 7 storeys above ground;
 * site about 33,000 m^2, floor area about 57,000 m^2; completed 2001.
 *
 * OSM (© OpenStreetMap contributors): relation/8374661 (building=yes; outer
 * way/146903252, inner way/596710404, a slit 5 m wide that is not drawn);
 * the chimney way/596710406 (man_made=chimney, height 120, 15 m across at
 * its foot), standing clear of the south-west corner; the site
 * way/596710405 (amenity=waste_transfer_station, not a building).
 *
 * From photos (ignis 001 from the west, 002 from the south-west, 003 from
 * across the water to the north; studio IRONY and 空之境界 close to the west
 * front; 5xile from the north-west):
 * - the long west front about 26-30 m, its roofline waving, gold balls on
 *   posts along the roof edges (the largest at the corners);
 * - the west front's projection (OSM's notch at y -29 to -11) a low white
 *   porch about 14 m, with the slender red tower rising from it to about
 *   44 m, chequered on its west face, two turrets with gold tops;
 * - chequer panels of black and white beside it, irregular windows (arched
 *   and square, some ringed) scattered over white walls, broad vertical red
 *   and yellow stripes;
 * - behind, the tall plant hall, about 45 m (scaled on the 120 m chimney in
 *   ignis 003), with a gridded facade, and a gold onion dome on its roof
 *   near the chimney;
 * - the chimney: light blue, three wandering red veins, a few small white
 *   window boxes, a gold band at about 96 m and the gold ball, a squat sphere
 *   about 19.6 m across (wider than the shaft), from about 100 to 112 m, a mast to 120 m.
 *
 * Lead review round 1 applied: fewer, bolder colour fields so the colour
 * survives at 200 px, instead of thin stripes and dots:
 * - the body's walls in broad fields about 18 m wide (white, yellow, red,
 *   blue) and a coloured upper storey 6 m deep under the wavy parapet
 *   (yellow, red, blue, gold);
 * - the hall blue with a regular dark grid of broad panels and a gold
 *   cornice (ignis 003 from the north);
 * - the gold balls only at the ends of the long walls, larger (4.2 m on
 *   4.5 m posts), plus the red tower's;
 * - fewer, larger irregular windows.
 * The chimney's blue: sampled top and bottom on ignis 002 (#466da3 /
 * #527db0) and 003 (#3a5180 / #384e7e): no gradient up the shaft, the
 * difference between the photos is light and haze. Drawn one blue,
 * #5e88c4, between the sunny (#678bca, ignis 001) and the hazy readings.
 *
 * Colours (sampled): white #f1efe8; red #df241d in sun (studio IRONY),
 * drawn #cf3a34; yellow #d4a344-#e9c23c, drawn #e4b545; gold #d7b24a;
 * blue #5e88c4; windows, grid and chequers dark (window).
 *
 * Estimated: every height but the chimney's (±4 m), the hall's footprint,
 * the stripe, window and chequer layout (in the spirit of the photos, not
 * a copy of each panel), the domes' sizes, the chimney's taper. The east
 * side, which no licensed photo shows, is drawn like the west.
 * Look-only (described, not relied on): Flickr photos by gidsey_, clogette
 * (CC BY-NC-ND 2.0) and gdpreston, Hyotenka (CC BY-NC): they agree with the
 * licensed views.
 *
 * Night: the windows glow (window); the rest is unlit.
 *
 * Photos (Wikimedia Commons):
 * - "Maishima waste treatment center Osaka JPN 001.jpg", ignis, CC BY-SA 3.0 (west front, chimney)
 * - "Maishima waste treatment center Osaka JPN 002.jpg", ignis, CC BY-SA 3.0 (south-west, chimney, red tower)
 * - "Maishima waste treatment center Osaka JPN 003.jpg", ignis, CC BY-SA 3.0 (from the water: hall, dome, chimney; heights)
 * - "Osaka City Environment Directorate - panoramio.jpg", studio IRONY, CC BY 3.0 (west front close)
 * - "大阪舞洲垃圾处理厂 - panoramio.jpg", 空之境界, CC BY 3.0 (chequers, red tower, windows)
 * - "Mai-shima 3 - panoramio.jpg", 5xile, CC BY-SA 3.0 (north-west)
 * - "Munchkin - panoramio.jpg", Jun Maegawa, CC BY-SA 3.0 (striped columns and domes, close)
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { triangulate, area, type XY } from './chi-aon-center'

const TAU = Math.PI * 2
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
/** Surface of revolution about a vertical axis at c, profile [r, z], smooth-shaded. */
function lathe(p: Part, c: XY, prof: Array<[number, number]>, k: number) {
  for (let b = 0; b < prof.length - 1; b++) {
    const [r0, z0] = prof[b], [r1, z1] = prof[b + 1]
    const er = r1 - r0, ez = z1 - z0, l = Math.hypot(er, ez) || 1
    const nn = [ez / l, -er / l]
    for (let s = 0; s < k; s++) {
      const a0 = (s / k) * TAU, a1 = ((s + 1) / k) * TAU
      const P = (r: number, a: number, z: number): V3 => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z]
      const N = (a: number): V3 => unit([nn[0] * Math.cos(a), nn[0] * Math.sin(a), nn[1]])
      const q = [P(r0, a0, z0), P(r0, a1, z0), P(r1, a1, z1), P(r1, a0, z1)]
      const ns = [N(a0), N(a1), N(a1), N(a0)]
      const tri = (i: number, j: number, m: number) => {
        const g = cross(sub(q[j], q[i]), sub(q[m], q[i])), s2 = add(add(ns[i], ns[j]), ns[m])
        if (dot(g, s2) >= 0) p.tri(q[i], q[j], q[m], undefined, undefined, undefined, [ns[i], ns[j], ns[m]])
        else p.tri(q[i], q[m], q[j], undefined, undefined, undefined, [ns[i], ns[m], ns[j]])
      }
      if (r0 > 1e-6) tri(0, 1, 2)
      if (r1 > 1e-6) tri(0, 2, 3)
    }
  }
}
/** A deterministic pseudo-random sequence. */
function rng(seed: number) {
  let s = seed >>> 0
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
}

// ---------------------------------------------------------------- plan ---
const OUTER: XY[] = [[-35.5, -104.6], [-35.4, -22.7], [-56.0, -22.7], [-56.0, -29.0], [-64.5, -29.2], [-64.5, -24.3], [-68.5, -24.3], [-68.6, -17.3], [-79.1, -17.3], [-79.4, -10.8], [-55.1, -10.7], [-55.2, 86.7], [59.1, 87.4], [58.9, 52.5], [61.6, 52.4], [61.8, -22.9], [54.6, -23.4], [54.4, 25.7], [47.1, 33.1], [40.6, 33.3], [41.0, -104.5]]
const BODY_H = 27
const HALL: XY[] = [[-42, -18], [50, -18], [50, 60], [-42, 60]]
const HALL_H = 45
const TOWER: XY[] = [[-73.5, -27.5], [-59.5, -27.5], [-59.5, -12.5], [-73.5, -12.5]]
const TOWER_H = 44
const PORCH: XY[] = [[-79.1, -29.2], [-56.0, -29.2], [-56.0, -10.7], [-79.4, -10.7]]
const CHIMNEY: XY = [-65.9, -97.6]

function build() {
  const white = new Part()
  const red = new Part()
  const yellow = new Part()
  const gold = new Part()
  const blue = new Part()
  const win = new Part()
  const rnd = rng(7)

  /** Walls of a ring with a wavy top: base h, amplitude amp. Returns the edge list with tops. */
  type Field = (run: number) => Part
  const wavyWalls = (ring: XY[], h: number, amp: number, part: Part | Field, phase: number, band?: { h: number; at: Field }) => {
    const fieldAt: Field = typeof part === 'function' ? part : () => part
    const r = ccw(ring)
    const top = (u: number) => h + amp * (0.5 + 0.5 * Math.sin(u / 9 + phase))
    let run = 0
    const edges: Array<{ a: XY; b: XY; len: number; n: V3; s0: number }> = []
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const len = Math.hypot(b[0] - a[0], b[1] - a[1])
      const n: V3 = unit([b[1] - a[1], a[0] - b[0], 0])
      const steps = Math.max(1, Math.round(len / 9))
      for (let k = 0; k < steps; k++) {
        const t0 = k / steps, t1 = (k + 1) / steps
        const P = (t: number, z: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, z]
        const mid = run + len * (t0 + t1) / 2
        if (band) {
          const zb = h - band.h
          poly(fieldAt(mid), [P(t0, 0), P(t1, 0), P(t1, zb), P(t0, zb)], n)
          poly(band.at(mid), [P(t0, zb), P(t1, zb), P(t1, top(run + len * t1)), P(t0, top(run + len * t0))], n)
        } else poly(fieldAt(mid), [P(t0, 0), P(t1, 0), P(t1, top(run + len * t1)), P(t0, top(run + len * t0))], n)
      }
      edges.push({ a, b, len, n, s0: run })
      run += len
    }
    for (const [i, j, k] of triangulate(r)) poly(PALETTE_ROOF, [[r[i][0], r[i][1], h], [r[j][0], r[j][1], h], [r[k][0], r[k][1], h]], [0, 0, 1])
    return { edges, top }
  }
  const PALETTE_ROOF = white // the roofs are pale (gardens and white decks in the aerials)

  // broad colour fields (about 18 m) along the walls and a coloured upper
  // storey with a wavy parapet, as in ignis 001-003 and studio IRONY
  const cyc = (list: Part[], w: number, off = 0): Field => (run) => list[Math.floor((run + off) / w) % list.length]
  const body = wavyWalls(OUTER, BODY_H, 3, cyc([white, yellow, white, red, white, blue, yellow, white], 18), 0, { h: 6, at: cyc([yellow, red, blue, yellow, gold, red], 24, 7) })
  const hall = wavyWalls(HALL, HALL_H, 1.5, blue, 1, { h: 3, at: () => gold })
  const porch = wavyWalls(PORCH, 14, 2, cyc([yellow, white], 12), 2, { h: 3, at: () => red })
  const tower = wavyWalls(TOWER, TOWER_H, 0, red, 0)

  // --- Facade work on the body: stripes, windows, chequers, balls on posts.
  const flush = (e: { a: XY; b: XY; n: V3 }, d = 0.06) => (u: number, z: number): V3 => {
    const t: XY = [(e.b[0] - e.a[0]), (e.b[1] - e.a[1])], L = Math.hypot(t[0], t[1])
    return [e.a[0] + (t[0] / L) * u + e.n[0] * d, e.a[1] + (t[1] / L) * u + e.n[1] * d, z]
  }
  const ball = (c: V3, r: number) => lathe(gold, [c[0], c[1]], [[0, c[2] - r], [r * 0.7, c[2] - r * 0.7], [r, c[2]], [r * 0.7, c[2] + r * 0.7], [0, c[2] + r]], 6)
  const post = (base: V3, h: number) => {
    const w = 0.35
    for (const [dx, dy, n] of [[w, 0, [1, 0, 0]], [-w, 0, [-1, 0, 0]], [0, w, [0, 1, 0]], [0, -w, [0, -1, 0]]] as Array<[number, number, V3]>) {
      const sx = dy !== 0 ? w : 0, sy = dx !== 0 ? w : 0
      poly(white, [[base[0] + dx - sx, base[1] + dy - sy, base[2]], [base[0] + dx + sx, base[1] + dy + sy, base[2]], [base[0] + dx + sx, base[1] + dy + sy, base[2] + h], [base[0] + dx - sx, base[1] + dy - sy, base[2] + h]], n)
    }
  }
  const decorate = (w: { edges: Array<{ a: XY; b: XY; len: number; n: V3; s0: number }>; top: (u: number) => number }, z0: number, stripes: boolean, balls: boolean, grid = false) => {
    for (const e of w.edges) {
      if (e.len < 7) continue
      const P = flush(e)
      // vertical stripes, red and yellow, about every 13 m
      if (stripes) {
        const ns = Math.floor(e.len / 13)
        for (let k = 0; k < ns; k++) {
          const u = ((k + 0.5) * e.len) / ns + (rnd() - 0.5) * 3, wdt = 1.4 + rnd() * 1.6
          const zt = w.top(e.s0 + u) - 0.3
          poly(k % 2 ? yellow : red, [P(u - wdt / 2, z0), P(u + wdt / 2, z0), P(u + wdt / 2, zt), P(u - wdt / 2, zt)], e.n)
        }
      }
      // the hall's dark grid: broad panels in a regular grid
      const P2 = flush(e, 0.1)
      if (grid) {
        const nb = Math.max(1, Math.round(e.len / 8))
        for (let i = 0; i < nb; i++)
          for (let z = z0 + 2; z < w.top(e.s0) - 5; z += 6) {
            const u0 = (i * e.len) / nb + 0.6, u1 = ((i + 1) * e.len) / nb - 0.6
            poly(win, [P2(u0, z), P2(u1, z), P2(u1, z + 4.8), P2(u0, z + 4.8)], e.n)
          }
        continue
      }
      // irregular windows: square and arched, scattered by storey
      for (let z = z0 + 3; z < w.top(e.s0) - 5; z += 4.2 + rnd() * 1.5) {
        for (let u = 2 + rnd() * 3; u < e.len - 3; u += 5.5 + rnd() * 6) {
          if (rnd() < 0.78) continue
          const ww = 1.1 + rnd() * 1.4, hh = 1.4 + rnd() * 1.6
          if (rnd() < 0.25) {
            // arched: a rectangle under a semicircle
            const pts: V3[] = [P2(u - ww / 2, z), P2(u + ww / 2, z)]
            for (let k = 0; k <= 6; k++) pts.push(P2(u + (ww / 2) * Math.cos((k / 6) * Math.PI), z + hh + (ww / 2) * Math.sin((k / 6) * Math.PI)))
            poly(win, pts, e.n)
          } else poly(win, [P2(u - ww / 2, z), P2(u + ww / 2, z), P2(u + ww / 2, z + hh), P2(u - ww / 2, z + hh)], e.n)
        }
      }
      // gold balls on posts along the top
      if (balls && e.len > 25) {
        // only the prominent ones: one at each end of a long wall, set in
        for (const u of [2.5, e.len - 2.5]) {
          const p = flush(e, -2.5)(u, w.top(e.s0 + u))
          post(p, 4.5)
          ball(add(p, [0, 0, 6.6]), 2.1)
        }
      }
    }
  }
  decorate(body, 0, false, true)
  decorate(hall, BODY_H, false, false, true)
  decorate(tower, 14, false, false)
  decorate(porch, 0, false, false)

  // chequer panels on the west front, either side of the red tower (black squares only)
  {
    const e = body.edges.find((q) => Math.abs(q.a[0] + 35.5) < 0.2 && q.len > 70)!
    const P = flush(e, 0.12)
    const sq = 3.2
    // e runs from y -22.7 down to y -104.6 or the reverse; find u for a given y
    const uAt = (y: number) => Math.abs(y - e.a[1])
    for (const y0 of [-40, -60]) {
      const u0 = uAt(y0)
      for (let i = 0; i < 6; i++)
        for (let j = 0; j < 7; j++) {
          if ((i + j) % 2) continue
          const u = u0 + i * sq, z = 4 + j * sq
          poly(win, [P(u, z), P(u + sq, z), P(u + sq, z + sq), P(u, z + sq)], e.n)
        }
    }
    // and on the tower's west face, above the porch
    const t = tower.edges.find((q) => Math.abs(q.a[0] + 73.5) < 0.2 && Math.abs(q.b[0] + 73.5) < 0.2)!
    const T = flush(t, 0.12)
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 8; j++) if ((i + j) % 2 === 0) poly(win, [T(1.5 + i * sq, 16 + j * sq), T(1.5 + (i + 1) * sq, 16 + j * sq), T(1.5 + (i + 1) * sq, 16 + (j + 1) * sq), T(1.5 + i * sq, 16 + (j + 1) * sq)], t.n)
  }

  // the red tower's turrets with gold tops, and its battlement balls
  for (const c of [[-71, -25], [-62, -15]] as XY[]) {
    lathe(red, c, [[2.2, TOWER_H - 0.5], [2.2, TOWER_H + 8], [0, TOWER_H + 8]], 10)
    lathe(gold, c, [[2.4, TOWER_H + 8], [2.9, TOWER_H + 9.4], [2.2, TOWER_H + 11], [0.9, TOWER_H + 12.4], [0.2, TOWER_H + 14], [0, TOWER_H + 14.2]], 10)
  }
  for (const c of [[-73.5, -12.5], [-59.5, -27.5]] as XY[]) ball([c[0], c[1], TOWER_H + 1.4], 1.2)

  // the gold onion dome on the hall roof, near the chimney end, on a drum
  {
    const c: XY = [-20, -6]
    lathe(white, c, [[5.4, HALL_H], [5.4, HALL_H + 4]], 14)
    lathe(gold, c, [[5.4, HALL_H + 4], [6.6, HALL_H + 6.5], [6.4, HALL_H + 9], [4.6, HALL_H + 11.5], [2.2, HALL_H + 13.6], [0.6, HALL_H + 15], [0.25, HALL_H + 17.5], [0, HALL_H + 17.6]], 14)
  }
  // smaller domes on striped columns at the north front (Munchkin's view)
  for (const c of [[-40, 83], [0, 83], [40, 83]] as XY[]) {
    lathe(yellow, c, [[2.0, 0], [2.0, BODY_H + 4]], 10)
    lathe(white, c, [[2.0, BODY_H + 4], [2.5, BODY_H + 5.5], [1.6, BODY_H + 7], [0, BODY_H + 7.4]], 10)
  }

  // --- The chimney: sky blue with red veins, window boxes, a gold band and ball.
  const R = (z: number) => 7.2 - 3.0 * Math.min(1, z / 96)
  {
    const prof: Array<[number, number]> = []
    for (let z = 0; z <= 96; z += 12) prof.push([R(z), z])
    lathe(blue, CHIMNEY, prof, 14)
    // red veins: three wandering ribs
    for (let v = 0; v < 3; v++) {
      const ang = (z: number) => (v / 3) * TAU + 0.35 * Math.sin(z / 11 + v * 2)
      for (let z = 1; z < 95; z += 5) {
        const z1 = z + 5
        const p0 = (zz: number, dr: number, da: number): V3 => {
          const a = ang(zz) + da
          return [CHIMNEY[0] + (R(zz) + dr) * Math.cos(a), CHIMNEY[1] + (R(zz) + dr) * Math.sin(a), zz]
        }
        const da = 0.06
        const n0 = unit([Math.cos(ang(z)), Math.sin(ang(z)), 0])
        poly(red, [p0(z, 0.15, -da), p0(z, 0.15, da), p0(z1, 0.15, da), p0(z1, 0.15, -da)], n0)
      }
    }
    // small white window boxes
    for (const [z, a] of [[34, 0.5], [52, 2.6], [68, 4.4], [80, 1.4], [88, 3.6]] as Array<[number, number]>) {
      const r = R(z), c: V3 = [CHIMNEY[0] + (r + 0.6) * Math.cos(a), CHIMNEY[1] + (r + 0.6) * Math.sin(a), z]
      const n: V3 = [Math.cos(a), Math.sin(a), 0], t: V3 = [-Math.sin(a), Math.cos(a), 0]
      const Q = (s: number, o: number, dz: number): V3 => add(c, add(mul(t, s), add(mul(n, o), [0, 0, dz])))
      poly(white, [Q(-1.4, 0.9, -1.6), Q(1.4, 0.9, -1.6), Q(1.4, 0.9, 1.6), Q(-1.4, 0.9, 1.6)], n)
      poly(white, [Q(1.4, -0.8, -1.6), Q(1.4, 0.9, -1.6), Q(1.4, 0.9, 1.6), Q(1.4, -0.8, 1.6)], t)
      poly(white, [Q(-1.4, -0.8, -1.6), Q(-1.4, -0.8, 1.6), Q(-1.4, 0.9, 1.6), Q(-1.4, 0.9, -1.6)], mul(t, -1))
      poly(white, [Q(-1.4, -0.8, 1.6), Q(1.4, -0.8, 1.6), Q(1.4, 0.9, 1.6), Q(-1.4, 0.9, 1.6)], [0, 0, 1])
      poly(win, [Q(-0.8, 0.95, -0.9), Q(0.8, 0.95, -0.9), Q(0.8, 0.95, 0.9), Q(-0.8, 0.95, 0.9)], n)
    }
    // gold band, a blue neck, the gold ball with its window ring, the mast
    lathe(gold, CHIMNEY, [[R(96), 96], [R(96) + 0.8, 96.4], [R(96) + 0.8, 98], [R(96), 98.4]], 14)
    lathe(blue, CHIMNEY, [[R(96), 98.4], [4.2, 100.5]], 14)
    lathe(gold, CHIMNEY, [[4.2, 100.5], [7.6, 101.4], [9.4, 103.2], [9.8, 105], [9.8, 106.2], [9.0, 108.2], [6.6, 110.4], [3.4, 111.8], [0, 112.3]], 16)
    lathe(win, CHIMNEY, [[9.85, 104.8], [9.85, 106.4]], 16)
    lathe(gold, CHIMNEY, [[0.6, 113], [0.15, 120], [0, 120]], 6)
  }

  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: white, material: finish('maishima-white', 0xf1efe8) },
    { part: red, material: finish('maishima-red', 0xcf3a34) },
    { part: yellow, material: finish('maishima-yellow', 0xe4b545) },
    { part: gold, material: finish('maishima-gold', 0xd7b24a, 0.45) },
    { part: blue, material: finish('maishima-blue', 0x5e88c4) },
    { part: win, material: PALETTE.window },
  ]
  return parts
}

if (import.meta.main) {
  const parts = build()
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (triangles > 6500) throw new Error(`triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Maishima Incineration Plant', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: 8.4, height: 120,
  })
  if (glb.length > 250_000) throw new Error(`size budget exceeded: ${glb.length}`)
  await Bun.write(new URL('../models/osaka-maishima-plant.glb', import.meta.url), glb)
  console.log(`osaka-maishima-plant.glb: ${triangles} triangles, ${glb.length} bytes`)
}
