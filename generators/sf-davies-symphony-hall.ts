/**
 * Louise M. Davies Symphony Hall, San Francisco — original procedural
 * geometry, CC0-1.0.
 * bun generators/sf-davies-symphony-hall.ts
 *
 * Frame: BEARING 350.7, turned to the street grid like its War Memorial
 * neighbours. x east (Van Ness Avenue), y north (Grove Street), z up, metres.
 * Origin = area centroid of the OSM outline way/32865746. y = 0 is the lowest
 * ground the building touches (17.9 m NAVD88, the Franklin Street side); Van
 * Ness and Hayes are ~0.6 m higher and Grove ~1.3 m.
 *
 * The hall is symmetric about the diagonal through its curved corner: the
 * Van Ness and Grove fronts are each ~31 m long, joined by a quarter circle
 * of radius 32 m, with a round balcony "saucer" on each front where the glass
 * ends. Behind, the south (Hayes) and west walls rise sheer.
 *
 * Evidence
 * - OSM way/32865746 (theatre, "height 49 m", which the lidar does not bear
 *   out: that is likely the flagpole) and its parts way/679356534 (the west
 *   block), 679356535 and 679356536 (the hall, "height 27"), all replaced.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 1 m in the turned frame
 *   (/tmp/city/sf/work/sf-opera-house/lid.json): the curved wall fits a circle
 *   centred (15.0, 6.6) of radius 31.8 to within 0.6 m, tangent to the Van
 *   Ness wall at x = 47.5 and the Grove wall at y = 39.5. Along those fronts
 *   the roof slopes from an eave at 24.9 up to 31.8 about 9 m in; the south
 *   and west walls stand straight to 31.8, with a faceted bulge at the
 *   south-west corner; inside a 31.8 m parapet ring the roof deck sits at
 *   28.8. A balcony band tops out at 19.7, 1 m proud of the wall. The saucer
 *   terraces read ~20 m, centred on the fronts 18.5 m from the corners. The
 *   lower wings: a 19 m block to the west (x -65..-26.5), a 13.5 m L round the
 *   hall's west and south sides, a 5.8 m terrace by Grove Street and a 5.5 m
 *   podium at the Van Ness / Hayes corner.
 * - Published (Wikipedia): 1980, Skidmore, Owings & Merrill with Pietro
 *   Belluschi; 2,743 seats.
 * - Photos (Wikimedia Commons): "Daviessymphonyhall.jpg" (J. Ash Bowie, CC
 *   BY-SA 3.0, the curved front from the north-east, with the saucers);
 *   "Louise M. Davies Symphony Hall-San Francisco-2.jpg" (Yair Haklai, CC BY-SA
 *   3.0, the curve square on from the Grove / Van Ness corner);
 *   "San Francisco Davies Symphony Hall 1.jpg" and "... 2.jpg" (Andreas
 *   Praefcke, CC BY 3.0, the Hayes and Van Ness corner: the saucer, the
 *   half-round window, the sheer back walls); "Louise M. Davies Symphony
 *   Hall-San Francisco.jpg" (Yair Haklai, CC BY-SA 3.0, the Grove Street side
 *   and terrace); "Louise M. Davies Symphony Hall, San Francisco,
 *   California.jpg" (Ken Lund, CC BY-SA 2.0).
 *
 * Estimated from the photos: the storey lines of the curved front (lobby
 * glass to 7.5, a cantilevered balcony band to 9.3, the upper glass with
 * white fins to 17.2, a second band to 19.7, a solid attic with a row of slot
 * windows in its middle), the fin spacing (2.8 m), the saucers' drums and
 * discs, the half-round and tall windows on the back walls. The lower wings
 * are plain blocks: no photo shows their facades well.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { arc, cap, chamfer, inset, panel, walls, type XY } from './sf-opera-house'

const BEARING = 350.7
const ANCHOR = { lng: -122.4205864, lat: 37.7776139 }

const concrete = new Part(), windows = new Part(), fins = new Part(), roof = new Part()

// ---------------------------------------------------------------------------
// Plan

const C: XY = [15.5, 7.5] // centre of the curved corner
const R = 32 // its radius: the Van Ness wall is x = C.x + R, the Grove wall y = C.y + R
const EAST = C[0] + R, NORTH = C[1] + R, SOUTH = -24.3, WEST = -15.5
const EAVE = 24.9, TOP = 31.8, DECK = 28.8, SLOPE = 9

/** The south-west bulge (back of the stage), as measured. */
const BACK: XY[] = [[-20.3, -9], [-23, -16], [-17.5, -22.5], [-9, -30.3], [-5, -30.5], [1, -28], [10, SOUTH]]

/** The hall's outline with its corner radius cut back to `r` (r = R - SLOPE: the top of the roof slope). */
function hallRing(r: number): XY[] {
  const d = R - r
  return [
    ...BACK,
    [EAST - d, SOUTH], [EAST - d, C[1]],
    ...arc(C, r, 0, Math.PI / 2, 14).slice(1, -1),
    [C[0], NORTH - d], [WEST, NORTH - d], [WEST, 1],
  ]
}
const INNER = hallRing(R - SLOPE)

// ---------------------------------------------------------------------------
// The hall

// Sheer back walls (west bulge to south) up to the parapet.
const backRing = [[WEST, 1] as XY, ...BACK, [EAST - SLOPE, SOUTH] as XY]
for (let i = 0; i < backRing.length - 1; i++) {
  const a = backRing[i], b = backRing[i + 1]
  concrete.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], TOP], [a[0], a[1], TOP])
}
// South wall's east end and west wall's north end: their tops follow the roof slope.
for (const [a, b, c] of [
  [[EAST - SLOPE, SOUTH], [EAST, SOUTH], 1],
  [[WEST, NORTH], [WEST, NORTH - SLOPE], 0],
] as [XY, XY, number][]) {
  concrete.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], c ? EAVE : TOP], [a[0], a[1], c ? TOP : EAVE])
}
// West wall between the slope's end and the bulge.
concrete.quad([WEST, NORTH - SLOPE, 0], [WEST, 1, 0], [WEST, 1, TOP], [WEST, NORTH - SLOPE, TOP])

// The fronts (Van Ness, the curve, Grove) up to the eave, then the sloping metal roof.
const front: XY[] = [[EAST, SOUTH], [EAST, C[1]], ...arc(C, R, 0, Math.PI / 2, 14).slice(1, -1), [C[0], NORTH], [WEST, NORTH]]
const frontTop: XY[] = [[EAST - SLOPE, SOUTH], [EAST - SLOPE, C[1]], ...arc(C, R - SLOPE, 0, Math.PI / 2, 14).slice(1, -1), [C[0], NORTH - SLOPE], [WEST, NORTH - SLOPE]]
for (let i = 0; i < front.length - 1; i++) {
  const a = front[i], b = front[i + 1], p = frontTop[i], q = frontTop[i + 1]
  concrete.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], EAVE], [a[0], a[1], EAVE])
  roof.quad([a[0], a[1], EAVE], [b[0], b[1], EAVE], [q[0], q[1], TOP], [p[0], p[1], TOP])
}
// The parapet ring round the sunken deck, and the deck.
const deck = inset(INNER, 2.5)
{
  // ring between INNER (outside) and deck (hole), joined by a slit
  const hole = [...deck].reverse()
  const ring = [...INNER, INNER[0], hole[hole.length - 1], ...hole]
  cap(roof, ring, TOP) // metal, like the slope it tops: no pale band shows over the eave
  walls(concrete, hole, DECK, TOP) // the recess's inner walls face inwards
  cap(roof, deck, DECK)
}

// ---------------------------------------------------------------------------
// The glass front: from the Van Ness saucer round the curve to the Grove saucer.

const SAUCER_E: XY = [EAST, -18.5], SAUCER_N: XY = [-10, NORTH]
const SR = 6
type Path = { p: XY[]; n: XY[] }
function frontPath(): Path {
  const p: XY[] = [], n: XY[] = []
  const add = (q: XY, m: XY) => { p.push(q); n.push(m) }
  for (let y = SAUCER_E[1] + SR; y < C[1] - 0.01; y += 4) add([EAST, y], [1, 0])
  for (let i = 0; i <= 18; i++) {
    const a = (Math.PI / 2) * (i / 18)
    add([C[0] + R * Math.cos(a), C[1] + R * Math.sin(a)], [Math.cos(a), Math.sin(a)])
  }
  for (let x = C[0] - 4; x > SAUCER_N[0] + SR + 0.01; x -= 4) add([x, NORTH], [0, 1])
  add([SAUCER_N[0] + SR, NORTH], [0, 1])
  return { p, n }
}
const FP = frontPath()
const at = (i: number, off: number, z: number): V3 => [FP.p[i][0] + FP.n[i][0] * off, FP.p[i][1] + FP.n[i][1] * off, z]

/** A smooth-shaded band along the front path, `off` proud, from z0 to z1, with top and underside. */
function ribbon(part: Part, off: number, z0: number, z1: number, solid = true) {
  for (let i = 0; i < FP.p.length - 1; i++) {
    const n0: V3 = [FP.n[i][0], FP.n[i][1], 0], n1: V3 = [FP.n[i + 1][0], FP.n[i + 1][1], 0]
    const A = at(i, off, z0), B = at(i + 1, off, z0), Cc = at(i + 1, off, z1), D = at(i, off, z1)
    part.tri(A, B, Cc, undefined, undefined, undefined, [n0, n1, n1])
    part.tri(A, Cc, D, undefined, undefined, undefined, [n0, n1, n0])
    if (!solid) continue
    part.quad(at(i, 0, z1), D, Cc, at(i + 1, 0, z1)) // top
    part.quad(at(i, 0, z0), at(i + 1, 0, z0), B, A) // underside
  }
  if (solid) for (const [i, s] of [[0, 1], [FP.p.length - 1, -1]] as [number, number][]) {
    // end caps
    const a = at(i, 0, z0), b = at(i, off, z0), c = at(i, off, z1), d = at(i, 0, z1)
    if (s > 0) part.quad(a, b, c, d)
    else part.quad(b, a, d, c)
  }
}

// Lobby glass, the balcony band, the upper glass behind its white fins, the second band.
ribbon(windows, 0.06, 0.8, 7.5, false)
ribbon(concrete, 1.6, 7.5, 9.3)
ribbon(windows, 0.06, 9.3, 17.2, false)
ribbon(concrete, 1.0, 17.2, 19.7)
{
  // fins every ~4.2 m along the path, on both glass storeys (the real mullions are closer;
  // drawn wider apart so they read as fins, not pinstripes)
  const FIN = 4.2
  let acc = 0
  for (let i = 0; i < FP.p.length - 1; i++) {
    const a = FP.p[i], b = FP.p[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    for (let s = FIN - acc; s < L; s += FIN) {
      const t = s / L, n: XY = [FP.n[i][0] * (1 - t) + FP.n[i + 1][0] * t, FP.n[i][1] * (1 - t) + FP.n[i + 1][1] * t]
      const m: XY = [a[0] + u[0] * s, a[1] + u[1] * s]
      for (const [z0, z1, d, w] of [[9.3, 17.2, 0.5, 0.4], [0.8, 7.5, 0.2, 0.2]]) {
        const P = (o: number, side: number, z: number): V3 => [m[0] + u[0] * w * side + n[0] * o, m[1] + u[1] * w * side + n[1] * o, z]
        fins.quad(P(d, -1, z0), P(d, 1, z0), P(d, 1, z1), P(d, -1, z1))
        fins.quad(P(0, -1, z0), P(d, -1, z0), P(d, -1, z1), P(0, -1, z1))
        fins.quad(P(d, 1, z0), P(0, 1, z0), P(0, 1, z1), P(d, 1, z1))
      }
    }
    acc = (acc + L) % FIN
  }
}
// Slot windows in the attic over the middle of the curve.
for (let k = -10; k <= 10; k++) {
  const a = Math.PI / 4 + k * (1.45 / R), n: XY = [Math.cos(a), Math.sin(a)], t: XY = [-n[1], n[0]]
  const m: XY = [C[0] + R * n[0], C[1] + R * n[1]]
  panel(windows, [m[0] - t[0] * 0.3, m[1] - t[1] * 0.3], [m[0] + t[0] * 0.3, m[1] + t[1] * 0.3], n, 20.9, 23.5)
}

// The saucers: a half drum on the wall, then a round terrace with a rounded lip.
for (const [c, n] of [[SAUCER_E, [1, 0]], [SAUCER_N, [0, 1]]] as [XY, XY][]) {
  // drum: the outward half of a cylinder
  const seg = 8, rd = 3.4, a0 = Math.atan2(n[1], n[0]) - Math.PI / 2
  for (let i = 0; i < seg; i++) {
    const t0 = a0 + (Math.PI * i) / seg, t1 = a0 + (Math.PI * (i + 1)) / seg
    const m0: V3 = [Math.cos(t0), Math.sin(t0), 0], m1: V3 = [Math.cos(t1), Math.sin(t1), 0]
    const A: V3 = [c[0] + rd * m0[0], c[1] + rd * m0[1], 0], B: V3 = [c[0] + rd * m1[0], c[1] + rd * m1[1], 0]
    concrete.tri(A, B, [B[0], B[1], 17.6], undefined, undefined, undefined, [m0, m1, m1])
    concrete.tri(A, [B[0], B[1], 17.6], [A[0], A[1], 17.6], undefined, undefined, undefined, [m0, m1, m0])
  }
  // the disc: a flared underside then a thick rim, smooth all round
  const s = 16, z0 = 17.6, z1 = 18.8, z2 = 20.6
  for (let i = 0; i < s; i++) {
    const t0 = (2 * Math.PI * i) / s, t1 = (2 * Math.PI * (i + 1)) / s
    const e0: XY = [Math.cos(t0), Math.sin(t0)], e1: XY = [Math.cos(t1), Math.sin(t1)]
    const P = (e: XY, r: number, z: number): V3 => [c[0] + e[0] * r, c[1] + e[1] * r, z]
    const fr = z1 - z0, fo = SR - 3.4, l = Math.hypot(fr, fo)
    const flare = (e: XY): V3 => [(e[0] * fr) / l, (e[1] * fr) / l, -fo / l]
    concrete.tri(P(e0, 3.4, z0), P(e1, 3.4, z0), P(e1, SR, z1), undefined, undefined, undefined, [flare(e0), flare(e1), flare(e1)])
    concrete.tri(P(e0, 3.4, z0), P(e1, SR, z1), P(e0, SR, z1), undefined, undefined, undefined, [flare(e0), flare(e1), flare(e0)])
    const r0: V3 = [e0[0], e0[1], 0], r1: V3 = [e1[0], e1[1], 0]
    concrete.tri(P(e0, SR, z1), P(e1, SR, z1), P(e1, SR, z2), undefined, undefined, undefined, [r0, r1, r1])
    concrete.tri(P(e0, SR, z1), P(e1, SR, z2), P(e0, SR, z2), undefined, undefined, undefined, [r0, r1, r0])
    roof.tri([c[0], c[1], z2], P(e0, SR, z2), P(e1, SR, z2))
  }
}

// Back walls: a half-round window high up and a tall window under it, near each front.
for (const [a, b, n] of [
  [[EAST - 6.6, SOUTH], [EAST - 3.4, SOUTH], [0, -1]],
  [[WEST, NORTH - 3.4], [WEST, NORTH - 6.6], [-1, 0]],
] as [XY, XY, XY][]) {
  const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], u: XY = [(b[0] - a[0]) / 3.2, (b[1] - a[1]) / 3.2]
  // half-round: a semicircle standing on its diameter at z 21.6
  const o = 0.06, P = (s: number, z: number): V3 => [m[0] + u[0] * s + n[0] * o, m[1] + u[1] * s + n[1] * o, z]
  for (let i = 0; i < 8; i++) {
    const t0 = (Math.PI * i) / 8, t1 = (Math.PI * (i + 1)) / 8
    const tri: [V3, V3, V3] = [P(0, 21.6), P(1.6 * Math.cos(t0), 21.6 + 1.6 * Math.sin(t0)), P(1.6 * Math.cos(t1), 21.6 + 1.6 * Math.sin(t1))]
    // face outwards: the order depends on which way u runs relative to n
    if (u[1] * n[0] - u[0] * n[1] >= 0) windows.tri(tri[0], tri[1], tri[2])
    else windows.tri(tri[0], tri[2], tri[1])
  }
  panel(windows, [m[0] - u[0] * 0.7, m[1] - u[1] * 0.7], [m[0] + u[0] * 0.7, m[1] + u[1] * 0.7], n, 12.5, 19.5)
}

// ---------------------------------------------------------------------------
// The lower wings

/** A plain block with chamfered corners and a bevelled parapet edge. */
const block = (r: XY[], z1: number) => {
  const c = chamfer(r, 0.4), top = inset(c, 0.4)
  walls(concrete, c, 0, z1 - 0.4)
  walls(concrete, c, z1 - 0.4, z1, top)
  cap(roof, top, z1)
}
block([[-65, -37], [-26.5, -37], [-26.5, -2.5], [-65, -2.5]], 19) // west block
block([[-29, -2.5], [WEST + 0.5, -2.5], [WEST + 0.5, 32], [-29, 32]], 13.5) // west of the hall
block([[-26.5, -37], [40, -37], [40, SOUTH + 0.5], [-26.5, SOUTH + 0.5]], 13.5) // south along Hayes
block([[40, -37], [EAST, -37], [EAST, SOUTH + 0.5], [40, SOUTH + 0.5]], 5.5) // Van Ness / Hayes podium
block([[-33, 32], [WEST + 0.5, 32], [WEST + 0.5, 47.5], [-33, 47.5]], 5.8) // Grove Street terrace
const parts = [
  { part: concrete, material: finish('davies-concrete', 0xdfddd7) },
  { part: windows, material: PALETTE.window },
  { part: fins, material: finish('fin-white', 0xf2f1ec) },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Louise M. Davies Symphony Hall', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: TOP,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/32865746', 'way/679356534', 'way/679356535', 'way/679356536'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-davies-symphony-hall.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
