/**
 * The 1996 Olympic Cauldron tower (Siah Armajani, 1996), Summerhill,
 * Atlanta: procedural, CC0-1.0.
 * bun generators/atl-olympic-cauldron.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 48 (the
 * tower's sides run 48 and 138 degrees). Origin: the mean of OSM
 * way/260646639's corners (-84.388095, 33.741641); y = 0 is the lowest
 * ground under the footprint: the street at the bridge's east end, 0.6 m
 * below the tower's own ground.
 *
 * Form: a square steel tower of four lattice corner legs with a stack of
 * landing plates and stair flights packed inside its outline, topped by a
 * railed platform carrying the cauldron: a flared basket (after a Southern
 * woven basket) on a short stem, its rim rising at the back into a tall
 * blade. From the tower's east side a lattice footbridge crosses Capitol
 * Avenue, with the five Olympic rings on each side of it.
 *
 * Sources
 * - OSM way/260646639 (the tower, man_made=tower, height 46.6,
 *   tower:construction=lattice) and way/536777369 (the bridge,
 *   building=yes, bridge=yes, layer 1).
 * - USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 1 m grid, heights
 *   above y = 0: the top platform 34.5 over x 0.5..8.5, y -5..5 in this
 *   frame (4-5 m south-east of the OSM outline, which the model follows
 *   the lidar on); the basket's body 39.4; lower returns at 12-17 west of the
 *   legs (not modelled: the stairs are kept inside the tower's outline); the bridge's top chord 16.8, running due east to x 49 east of the
 *   anchor (as OSM has it).
 * - Photos (Wikimedia Commons, EVIDENCE): ViennaUK, "1996 Atlanta Summer
 *   Olympics cauldron 0463.jpg", "0469.jpg", "0460.jpg", "0467.jpg"
 *   (2011), CC BY-SA 4.0; John Sherwell, "Atlanta cauldron during 1996
 *   Paralympics.jpg", CC BY-SA 3.0 (the basket close up); Peter Bond,
 *   "Turner Field parking lot (4054059929).jpg", CC BY-SA 2.0 (from afar).
 * Estimated: the blade's tip (44.6 m; OSM's 46.6 may include the flame
 *   fittings), the landings' sizes and the stair runs (photos), the legs'
 *   width (1.5 m), the rings' size (5.8 m across, 1.6 times the bridge's
 *   3.6 m truss, as in ViennaUK 0463), the bridge's far-end supports (not
 *   photographed).
 * Simplified per STYLE: the lattice legs are solid bold columns with a few
 *   bold diagonals; the landings are solid plates with low solid railing
 *   bands; the stairs are ribbons inside the faces.
 * Colour: the steel is a dark blue-grey in every photo (#4f5a66, above
 *   charcoal); the rings dark bronze-grey. The basket's colours come from
 *   the one close licensed photo, Sherwell's (1996): a red-orange body with
 *   a dark band, a blue back and blade, a copper rim; the 2011 photos show
 *   the same scheme, faded.
 * Night: the cauldron and the tower are floodlit.
 */
import { Part, type V3 } from './mesh'
import { finish, type Swatch } from './palette'
import { lathe, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, qf, tf } from './atl-georgia-state-capitol'

const TX0 = 0.5, TX1 = 8.5, TY0 = -4.5, TY1 = 4.5, TOP = 34.5
const LEVELS = [6.8, 12.4, 18.0, 23.6, 29.2, TOP]

/** A straight bold member (square section `w`) from a to b. */
function member(p: Part, a: V3, b: V3, w: number) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const L = Math.hypot(...d)
  const t: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const up: V3 = Math.abs(t[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const u = norm(cross(t, up)), v = cross(u, t)
  const h = w / 2
  const corners = (c: V3) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([i, j]) => [c[0] + (u[0] * i + v[0] * j) * h, c[1] + (u[1] * i + v[1] * j) * h, c[2] + (u[2] * i + v[2] * j) * h] as V3)
  const A = corners(a), B = corners(b)
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    const n: V3 = [(A[k][0] + A[l][0]) / 2 - a[0], (A[k][1] + A[l][1]) / 2 - a[1], (A[k][2] + A[l][2]) / 2 - a[2]]
    qf(p, A[k], A[l], B[l], B[k], n)
  }
  qf(p, A[0], A[1], A[2], A[3], [-t[0], -t[1], -t[2]])
  qf(p, B[0], B[1], B[2], B[3], t)
}
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

function build() {
  const steel = new Part(), deck = new Part(), red = new Part(), blue = new Part(), gold = new Part()

  // ---- the tower: four lattice legs, ring beams at each landing, bold diagonals
  const LEG = 1.5
  const legs: [number, number][] = [[TX0, TY0], [TX1, TY0], [TX1, TY1], [TX0, TY1]]
  for (const [x, y] of legs) box(steel, steel, x - LEG / 2, y - LEG / 2, x + LEG / 2, y + LEG / 2, 0, TOP, 0.1)
  for (const z of LEVELS) {
    for (let k = 0; k < 4; k++) {
      const [x0, y0] = legs[k], [x1, y1] = legs[(k + 1) % 4]
      member(steel, [x0, y0, z - 0.45], [x1, y1, z - 0.45], 0.7)
    }
  }
  // diagonals in alternate bays on each face
  for (let i = 0; i < LEVELS.length; i++) {
    const z0 = i === 0 ? 0.5 : LEVELS[i - 1], z1 = LEVELS[i] - 0.8
    for (let k = 0; k < 4; k++) {
      if ((i + k) % 2) continue
      const [x0, y0] = legs[k], [x1, y1] = legs[(k + 1) % 4]
      member(steel, [x0, y0, z0], [x1, y1, z1], 0.4)
    }
  }

  // ---- landings and stairs, all within the tower's outline: a solid landing
  // plate at every level with a low solid railing band round it, and between
  // levels a stair flight running up just inside one face, the faces taking
  // turns, so the stack reads as one dense lattice block
  const O = LEG / 2 + 0.05
  const X0 = TX0 - O, X1 = TX1 + O, Y0 = TY0 - O, Y1 = TY1 + O
  for (const z of LEVELS.slice(0, -1)) {
    box(deck, deck, X0, Y0, X1, Y1, z - 0.45, z, 0.05)
    for (const [a0, b0, a1, b1] of [[X0, Y0, X1, Y0 + 0.14], [X0, Y1 - 0.14, X1, Y1], [X0, Y0, X0 + 0.14, Y1], [X1 - 0.14, Y0, X1, Y1]]) box(steel, null, a0, b0, a1, b1, z, z + 1.0, 0)
  }
  // a flight between each pair of levels, 1.3 m wide, inside the face
  const flight = (k: number, z0: number, z1: number) => {
    const W = 1.3, I = O + 0.1
    // faces in turn: west, north, east, south
    const f = k % 4
    let a: V3, b: V3, c: V3, d: V3, n: V3
    if (f === 0) { a = [X0 + I, Y0 + I, z0]; b = [X0 + I, Y1 - I, z1]; c = [X0 + I + W, Y1 - I, z1]; d = [X0 + I + W, Y0 + I, z0]; n = [0, -(z1 - z0), Y1 - Y0] }
    else if (f === 1) { a = [X0 + I, Y1 - I, z0]; b = [X1 - I, Y1 - I, z1]; c = [X1 - I, Y1 - I - W, z1]; d = [X0 + I, Y1 - I - W, z0]; n = [-(z1 - z0), 0, X1 - X0] }
    else if (f === 2) { a = [X1 - I, Y1 - I, z0]; b = [X1 - I, Y0 + I, z1]; c = [X1 - I - W, Y0 + I, z1]; d = [X1 - I - W, Y1 - I, z0]; n = [0, z1 - z0, Y1 - Y0] }
    else { a = [X1 - I, Y0 + I, z0]; b = [X0 + I, Y0 + I, z1]; c = [X0 + I, Y0 + I + W, z1]; d = [X1 - I, Y0 + I + W, z0]; n = [z1 - z0, 0, X1 - X0] }
    qf(deck, a, b, c, d, n)
    const dn = (p: V3): V3 => [p[0], p[1], p[2] - 0.4]
    qf(deck, dn(a), dn(b), dn(c), dn(d), [-n[0], -n[1], -n[2]])
    member(steel, [a[0], a[1], a[2] + 0.5], [b[0], b[1], b[2] + 0.5], 0.3) // the outer stringer and rail
  }
  for (let i = 0; i < LEVELS.length - 1; i++) flight(i, i === 0 ? 0.5 : LEVELS[i - 1], LEVELS[i])
  flight(LEVELS.length - 1, LEVELS[LEVELS.length - 2], TOP)
  // the top platform and its railing band
  box(deck, deck, TX0 - 1.4, TY0 - 1.0, TX1 + 1.4, TY1 + 1.0, TOP - 0.6, TOP, 0.1)
  for (const [x0, y0, x1, y1] of [[TX0 - 1.4, TY0 - 1.0, TX1 + 1.4, TY0 - 0.85], [TX0 - 1.4, TY1 + 0.85, TX1 + 1.4, TY1 + 1.0], [TX0 - 1.4, TY0 - 1.0, TX0 - 1.25, TY1 + 1.0], [TX1 + 1.25, TY0 - 1.0, TX1 + 1.4, TY1 + 1.0]]) {
    box(steel, null, x0, y0, x1, y1, TOP, TOP + 1.1, 0)
  }

  // ---- the cauldron: stem, flared basket, the blade rising at its back
  const CX = 4.5, CY = 0.0
  const PHI = (48 * Math.PI) / 180 // the blade leans to the east (compass 90 is 48 degrees from model +x)
  lathe(steel, CX, CY, [[1.1, TOP], [1.1, TOP + 1.6], [1.3, TOP + 1.6]], 12)
  {
    const N = 16, z0 = TOP + 1.6
    const rim = (a: number): [number, number, number] => {
      // an elliptical rim, longer across the blade, rising toward the back (+y)
      const rx = 2.7, ry = 2.4, s = Math.cos(a - PHI)
      const z = 39.0 + 1.3 * Math.max(0, s) ** 2
      return [CX + rx * Math.cos(a), CY + ry * s, z]
    }
    for (let k = 0; k < N; k++) {
      const a0 = (k / N) * 2 * Math.PI, a1 = ((k + 1) / N) * 2 * Math.PI
      const b0: V3 = [CX + 1.3 * Math.cos(a0), CY + 1.3 * Math.sin(a0), z0], b1: V3 = [CX + 1.3 * Math.cos(a1), CY + 1.3 * Math.sin(a1), z0]
      const t0 = rim(a0), t1 = rim(a1)
      const out: V3 = [Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2), 0.3]
      const back = Math.cos((a0 + a1) / 2 - PHI) > 0.55
      qf(back ? blue : red, b0, b1, t1, t0, out)
      qf(red, b0, b1, t1, t0, [-out[0], -out[1], 0.6]) // the inside
    }
    // the blade: a tall tapering fin standing up from the back of the rim
    const r0 = rim(PHI - 0.42), r1 = rim(PHI + 0.42), tip: V3 = [CX + 5.0 * Math.cos(PHI), CY + 5.0 * Math.sin(PHI), 44.6]
    const th = 0.18, ox = Math.cos(PHI) * th, oy = Math.sin(PHI) * th
    const O = (p: V3, k: number): V3 => [p[0] + ox * k, p[1] + oy * k, p[2]]
    tf(blue, O(r0, 1), O(r1, 1), O(tip, 1), [Math.cos(PHI), Math.sin(PHI), 0.2])
    tf(blue, O(r0, -1), O(r1, -1), O(tip, -1), [-Math.cos(PHI), -Math.sin(PHI), 0])
    qf(blue, O(r0, -1), O(r0, 1), O(tip, 1), O(tip, -1), [Math.sin(PHI), -Math.cos(PHI), 0])
    qf(blue, O(r1, -1), O(r1, 1), O(tip, 1), O(tip, -1), [-Math.sin(PHI), Math.cos(PHI), 0])
  }

  // ---- the footbridge east over Capitol Avenue
  {
    // from the tower's east face to the OSM bridge's east end (49 m east of the anchor)
    const b = (48 * Math.PI) / 180
    const toModel = (e: number, n: number): [number, number] => [e * Math.cos(b) - n * Math.sin(b), e * Math.sin(b) + n * Math.cos(b)]
    const A = toModel(7.0, -5.3), B = toModel(49.0, -5.3)
    const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy)
    const ux = dx / L, uy = dy / L, vx = -uy, vy = ux, HW = 1.6
    const P = (s: number, w: number, z: number): V3 => [A[0] + ux * s + vx * w, A[1] + uy * s + vy * w, z]
    const DECK = 13.2, TOPC = 16.8
    // deck slab and the top and bottom chords
    qf(deck, P(0, -HW, DECK), P(L, -HW, DECK), P(L, HW, DECK), P(0, HW, DECK), [0, 0, 1])
    qf(deck, P(0, -HW, DECK - 0.5), P(L, -HW, DECK - 0.5), P(L, HW, DECK - 0.5), P(0, HW, DECK - 0.5), [0, 0, -1])
    for (const w of [-HW, HW]) {
      member(steel, P(0, w, DECK - 0.25), P(L, w, DECK - 0.25), 0.55)
      member(steel, P(0, w, TOPC - 0.25), P(L, w, TOPC - 0.25), 0.45)
      // verticals and Warren diagonals, bold and sparse
      const n = 8
      for (let k = 0; k <= n; k++) member(steel, P((L * k) / n, w, DECK), P((L * k) / n, w, TOPC - 0.3), 0.3)
      for (let k = 0; k < n; k++) member(steel, P((L * k) / n, w, k % 2 ? DECK : TOPC - 0.3), P((L * (k + 1)) / n, w, k % 2 ? TOPC - 0.3 : DECK), 0.28)
    }
    // the far-end supports
    for (const w of [-HW + 0.4, HW - 0.4]) box(steel, null, P(L - 0.6, w, 0)[0] - 0.5, P(L - 0.6, w, 0)[1] - 0.5, P(L - 0.6, w, 0)[0] + 0.5, P(L - 0.6, w, 0)[1] + 0.5, 0, DECK - 0.5, 0.1)
    // the Olympic rings, on both sides: three above, two below, interlaced
    const R = 2.9, T = 0.6, SEG = 16
    const ring = (s: number, z: number, w: number) => {
      for (let k = 0; k < SEG; k++) {
        const a0 = (k / SEG) * 2 * Math.PI, a1 = ((k + 1) / SEG) * 2 * Math.PI
        const q = (a: number, r: number, d: number) => P(s + r * Math.cos(a), w + d, z + r * Math.sin(a))
        const side = Math.sign(w)
        qf(gold, q(a0, R - T / 2, 0.15 * side), q(a1, R - T / 2, 0.15 * side), q(a1, R + T / 2, 0.15 * side), q(a0, R + T / 2, 0.15 * side), [vx * side, vy * side, 0])
        qf(gold, q(a0, R - T / 2, -0.15 * side), q(a1, R - T / 2, -0.15 * side), q(a1, R + T / 2, -0.15 * side), q(a0, R + T / 2, -0.15 * side), [-vx * side, -vy * side, 0])
        qf(gold, q(a0, R + T / 2, -0.15), q(a1, R + T / 2, -0.15), q(a1, R + T / 2, 0.15), q(a0, R + T / 2, 0.15), [Math.cos((a0 + a1) / 2) * ux, Math.cos((a0 + a1) / 2) * uy, Math.sin((a0 + a1) / 2)])
      }
    }
    const s0 = L * 0.62, zc = (DECK + TOPC) / 2
    for (const w of [-(HW + 0.35), HW + 0.35]) {
      for (const k of [-1, 0, 1]) ring(s0 + k * 2.25 * R, zc + 1.1, w)
      for (const k of [-0.5, 0.5]) ring(s0 + k * 2.25 * R, zc - 1.4, w + Math.sign(w) * 0.32)
    }
  }

  const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.2 : 0.4 + 0.6 * Math.min(1, p[2] / 44))
  return finishGlb('1996 Olympic Cauldron', [
    { part: steel, material: { ...finish('oc-steel', 0x4f5a66, 0.6), floodlight: lit } as Swatch },
    { part: deck, material: finish('oc-deck', 0x5b6672, 0.7) },
    { part: red, material: { ...finish('oc-basket-red', 0xbf4f3c, 0.6), floodlight: () => 1 } as Swatch },
    { part: blue, material: { ...finish('oc-basket-blue', 0x4a67a5, 0.6), floodlight: () => 1 } as Swatch },
    { part: gold, material: finish('oc-rings-bronze', 0x8a7d62, 0.5) },
  ], { bearing: 48, height: 44.6, replaces: ['way/260646639', 'way/536777369'] }, 6500)
}

if (import.meta.main) await writeModel('atl-olympic-cauldron', build())
