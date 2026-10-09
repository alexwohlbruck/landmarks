/**
 * Suzzallo Library (1926 west wing and 1935 south wing by Bebb & Gould;
 * 1963 east addition), University of Washington, Seattle: procedural,
 * CC0-1.0.
 * bun generators/sea-suzzallo-library.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 10 (the west wing's long
 * walls run at 10 degrees). The origin is the area centroid of OSM
 * relation/2955450's outer ring. y = 0 is the lowest ground the building
 * touches, on the south side (44.9 m NAVD88); Red Square, in front of the
 * west front, is 4 m higher, so the facade's detail starts there.
 *
 * Form: the Collegiate Gothic west wing, an 18.5 m wide block 67 m long
 * under a steep hipped slate roof, its Red Square front of eleven bays:
 * a cast-stone ground storey with an arched window in each bay and three
 * entrance porches in the middle, the reading room's tall pointed windows
 * in brick above, stone buttresses between the bays rising into pinnacles
 * over the parapet, a corner tower at each end, a polygonal stair bay at
 * the north end. The 1935 south wing, narrower and lower, runs off at 65
 * degrees from the south end under a gabled slate roof, its gable facing
 * the square. The 1963 addition fills the angle behind with flat-roofed
 * blocks. Allen Library (east) is a separate building and not drawn.
 *
 * Measured (USGS 3DEP WA_KingCo_1_2021, 0.5 m surface model, heights above
 * y = 0): the west wing's front wall at x = -39, the back at -20.5; parapet
 * 29 m, ridge 37.5 m (a narrow flat ridge at x -29.75), roof planes about
 * 50 degrees; the south wing 12 m wide, eaves 19.5 m, ridge 26 m; the
 * addition's roofs at 28 m (middle block), 24.5 m (north) and 20.5 m (east);
 * the north stair bay to 29 m; the link at the south-west corner 20 m.
 * Published: built 1926, 1935, 1963 (Wikipedia, "Suzzallo Library").
 * From photos (west front only): bay count (eleven), storey proportions,
 * the window and arch shapes, the brick and stone colours, the green-grey
 * slate.
 * Estimated: the east and north faces (no photos), the south wing's side
 * windows, the addition's window bands, pinnacle heights (32-35 m).
 * Left out: tracery, statues, the openwork parapet, lettering, steps.
 *
 * OSM: relation/2955450 (outline), parts way/1104202902 (the L of the old
 * wings), way/1104202901 (the 1963 addition), way/445398678 (the
 * south-west link), way/1104202900 (a small roof part on the south side).
 *
 * Photos: /tmp/city/sea/work/sea-suzzallo-library/credits.txt.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

const brick = new Part(), stone = new Part(), slate = new Part(), win = new Part(), door = new Part(), flat = new Part()

function poly(p: Part, P: V3[], n: V3) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const Q = dot(f, n) >= 0 ? P : [...P].reverse()
  for (let i = 1; i < Q.length - 1; i++) p.tri(Q[0], Q[i], Q[i + 1])
}
function earcut(P: XY[]): number[][] {
  const area = P.reduce((s, p, i) => { const q = P[(i + 1) % P.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
  const idx = P.map((_, i) => i)
  if (area < 0) idx.reverse()
  const out: number[][] = []
  const crs = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 5000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const a = idx[(k + idx.length - 1) % idx.length], b = idx[k], c = idx[(k + 1) % idx.length]
      if (crs(P[a], P[b], P[c]) <= 1e-9) continue
      if (idx.some((o) => o !== a && o !== b && o !== c && crs(P[a], P[b], P[o]) >= 0 && crs(P[b], P[c], P[o]) >= 0 && crs(P[c], P[a], P[o]) >= 0)) continue
      out.push([a, b, c]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
/** A vertical prism over a ring; walls in `p`, top in `topP`. */
function prism(p: Part, ring: XY[], z0: number, z1: number, topP: Part | null = p) {
  const area = ring.reduce((s, a, i) => { const b = ring[(i + 1) % ring.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
  const R = area < 0 ? [...ring].reverse() : ring
  for (let i = 0; i < R.length; i++) {
    const a = R[i], b = R[(i + 1) % R.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (topP) for (const [a, b, c] of earcut(R)) topP.tri([R[a][0], R[a][1], z1], [R[b][0], R[b][1], z1], [R[c][0], R[c][1], z1])
}
const rect = (x0: number, y0: number, x1: number, y1: number, c = 0): XY[] => c <= 0
  ? [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  : [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
/** A square pyramid (pinnacle) on a ring's centre. */
function pyramid(p: Part, cx: number, cy: number, h: number, z0: number, z1: number) {
  const r: XY[] = rect(cx - h, cy - h, cx + h, cy + h)
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4]
    poly(p, [[a[0], a[1], z0], [b[0], b[1], z0], [cx, cy, z1]], [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 0.3])
  }
}
/**
 * A flat opening on a wall: `o` the wall point at its centre line, `t` along
 * the wall, `n` out of it. Tops: flat, a semicircle, or a pointed (equilateral)
 * Gothic arch.
 */
function opening(p: Part, o: XY, t: XY, n: XY, w: number, z0: number, z1: number, top: 'flat' | 'round' | 'pointed', off = 0.06) {
  const at = (s: number, z: number): V3 => [o[0] + t[0] * s + n[0] * off, o[1] + t[1] * s + n[1] * off, z]
  const nn: V3 = [n[0], n[1], 0]
  const r = w / 2
  if (top === 'flat') return poly(p, [at(-r, z0), at(r, z0), at(r, z1), at(-r, z1)], nn)
  const pts: V3[] = [at(-r, z0), at(r, z0)]
  if (top === 'round') {
    const zs = z1 - r
    for (let k = 0; k <= 10; k++) { const a = (k / 10) * Math.PI; pts.push(at(r * Math.cos(a), zs + r * Math.sin(a))) }
  } else {
    // two arcs of radius w, centred on the opposite springing points
    const zs = z1 - w * Math.sin(Math.PI / 3)
    for (let k = 0; k <= 5; k++) { const a = (k / 5) * (Math.PI / 3); pts.push(at(-r + w * Math.cos(a), zs + w * Math.sin(a))) }
    for (let k = 4; k >= 0; k--) { const a = (k / 5) * (Math.PI / 3); pts.push(at(r - w * Math.cos(a), zs + w * Math.sin(a))) }
  }
  poly(p, pts, nn)
}

// ------------------------------------------------------- the west wing ---
const WX0 = -39, WX1 = -20.5, WY0 = -31.5, WY1 = 36
const SQ = 4                         // Red Square's level against the front
const BASE = 14, PAR0 = 27.3, PAR = 29, RIDGE = 37.5
const RX = (WX0 + WX1) / 2           // ridge line
{
  // walls: stone to the top of the ground storey, brick to the parapet,
  // a stone parapet band
  prism(stone, rect(WX0, WY0, WX1, WY1), 0, BASE, null)
  prism(brick, rect(WX0, WY0, WX1, WY1), BASE, PAR0, null)
  prism(stone, rect(WX0 - 0.3, WY0 - 0.3, WX1 + 0.3, WY1 + 0.3), PAR0, PAR, null)
  // a flat gutter strip inside the parapet
  poly(stone, [[WX0 - 0.3, WY0 - 0.3, PAR], [WX1 + 0.3, WY0 - 0.3, PAR], [WX1 + 0.3, WY1 + 0.3, PAR], [WX0 - 0.3, WY1 + 0.3, PAR]], [0, 0, 1])
  // the hipped slate roof, 50 degrees, a short flat ridge
  const half = (WX1 - WX0) / 2 - 0.6, rise = RIDGE - PAR, k = 0.6
  const e: XY[] = [[WX0 + 0.6, WY0 + 0.6], [WX1 - 0.6, WY0 + 0.6], [WX1 - 0.6, WY1 - 0.6], [WX0 + 0.6, WY1 - 0.6]]
  const inset = half - k
  const top: XY[] = [[RX - k, WY0 + 0.6 + inset], [RX + k, WY0 + 0.6 + inset], [RX + k, WY1 - 0.6 - inset], [RX - k, WY1 - 0.6 - inset]]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const n: V3 = [[0, -1, 1], [1, 0, 1], [0, 1, 1], [-1, 0, 1]][i] as V3
    poly(slate, [[e[i][0], e[i][1], PAR], [e[j][0], e[j][1], PAR], [top[j][0], top[j][1], RIDGE], [top[i][0], top[i][1], RIDGE]], n)
  }
  poly(slate, top.map(([x, y]) => [x, y, RIDGE] as V3), [0, 0, 1])
  void rise

  // The west front: eleven bays between the corner towers.
  const T = 5.2, NB = 11
  const bay = (WY1 - WY0 - 2 * T) / NB
  const tN: XY = [0, 1], nW: XY = [-1, 0]
  // a buttress: stone through the ground storey, brick above with a stone
  // cap, ending in a stone pinnacle over the parapet
  const buttress = (y: number) => {
    const r = rect(WX0 - 1.1, y - 0.65, WX0, y + 0.65, 0.2)
    prism(stone, r, 0, BASE, null)
    prism(brick, r, BASE, PAR0 - 0.5, null)
    prism(stone, r, PAR0 - 0.5, 30.2)
    pyramid(stone, WX0 - 0.55, y, 0.6, 30.2, 33.4)
  }
  for (let b = 0; b < NB; b++) {
    const yc = WY0 + T + bay * (b + 0.5)
    const entry = b >= 4 && b <= 6
    // tall reading-room window
    opening(win, [WX0, yc], tN, nW, bay * 0.6, 15, 26.6, 'pointed')
    // ground storey: an arched window, or an entrance in a porch
    if (entry) {
      // the porch: a gabled stone block standing out from the wall
      const py0 = yc - bay / 2 + 0.25, py1 = yc + bay / 2 - 0.25, px = WX0 - 2.2
      prism(stone, rect(px, py0, WX0, py1), 0, 12.5)
      poly(stone, [[px, py0, 12.5], [px, py1, 12.5], [px, (py0 + py1) / 2, 15.2]], [-1, 0, 0])
      poly(stone, [[px, py0, 12.5], [WX0, py0, 12.5], [WX0, (py0 + py1) / 2, 15.2], [px, (py0 + py1) / 2, 15.2]], [0, -1, 1])
      poly(stone, [[px, py1, 12.5], [WX0, py1, 12.5], [WX0, (py0 + py1) / 2, 15.2], [px, (py0 + py1) / 2, 15.2]], [0, 1, 1])
      opening(door, [px, yc], tN, nW, bay * 0.55, SQ + 0.8, 11.2, 'pointed')
    } else {
      opening(win, [WX0, yc], tN, nW, bay * 0.6, SQ + 2.6, 12.2, 'round')
    }
  }
  // buttresses between the bays, stone, each ending in a pinnacle
  for (let b = 1; b < NB; b++) {
    const y = WY0 + T + bay * b
    buttress(y)
  }
  // the end bays: a narrow lancet over an arched window, then a stone
  // corner buttress with a tall pinnacle at each corner of the wing
  for (const yc of [WY0 + T / 2 + 0.6, WY1 - T / 2 - 0.6]) {
    opening(win, [WX0, yc], tN, nW, 1.7, 16.5, 26, 'pointed')
    opening(win, [WX0, yc], tN, nW, 2.4, SQ + 3, 12.2, 'round')
  }
  for (const x of [WX0 + 0.3, WX1 - 0.3]) for (const y of [WY0 + 0.3, WY1 - 0.3]) {
    prism(stone, rect(x - 1.3, y - 1.3, x + 1.3, y + 1.3, 0.4), 0, 31.5)
    pyramid(stone, x, y, 1.0, 31.5, 36.5)
  }
  // a buttress between each end bay and the first bay too
  for (const y of [WY0 + T, WY1 - T]) {
    buttress(y)
  }
  // the end walls: a big window each (north end over the stair bay)
  opening(win, [RX, WY1], [1, 0], [0, 1], 6.5, 17, 27, 'pointed')
  opening(win, [RX, WY0], [1, 0], [0, -1], 6.5, 21.5, 27, 'pointed')
  // the north stair bay: half an octagon
  {
    const c: XY = [RX, WY1], r = 5.5
    const ring: XY[] = []
    for (let k = 0; k <= 4; k++) { const a = (k / 4) * Math.PI; ring.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a) * 0.95]) }
    prism(stone, ring, 0, 9, null)
    prism(brick, ring, 9, 24.5)
    for (let k = 1; k < 4; k++) {
      const a = ring[k - 1], b = ring[k], m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
      const t: XY = [(b[0] - a[0]), (b[1] - a[1])], L = Math.hypot(...t)
      opening(win, m, [t[0] / L, t[1] / L], [t[1] / L, -t[0] / L], 1.7, 12, 21, 'pointed')
    }
    // its roof: a half pyramid
    const apex: V3 = [c[0], c[1], 31]
    for (let k = 0; k < 4; k++) {
      const a = ring[k], b = ring[k + 1]
      poly(slate, [[a[0], a[1], 24.5], [b[0], b[1], 24.5], apex], [(a[0] + b[0]) / 2 - c[0], (a[1] + b[1]) / 2 - c[1], 0.6])
    }
  }
}

// ------------------------------------------------------ the south wing ---
{
  const Q: XY = [-11.43, -32.73], d: XY = [0.817, 0.577], n: XY = [-0.577, 0.817]
  const T0 = -22, T1 = 36, HW = 6, EAVE = 19.5, R = 26
  const P = (t: number, o: number, z: number): V3 => [Q[0] + d[0] * t + n[0] * o, Q[1] + d[1] * t + n[1] * o, z]
  const xy = (t: number, o: number): XY => [Q[0] + d[0] * t + n[0] * o, Q[1] + d[1] * t + n[1] * o]
  const ring = [xy(T0, -HW), xy(T1, -HW), xy(T1, HW), xy(T0, HW)]
  prism(stone, ring, 0, 2.5, null)
  prism(brick, ring, 2.5, EAVE, null)
  // gabled roof with a small overhang; gable walls in brick, stone coped
  const O = 0.5
  poly(slate, [P(T0 - O, -HW - O, EAVE - 0.4), P(T1 + O, -HW - O, EAVE - 0.4), P(T1 + O, 0, R), P(T0 - O, 0, R)], [-n[0], -n[1], 1])
  poly(slate, [P(T0 - O, HW + O, EAVE - 0.4), P(T1 + O, HW + O, EAVE - 0.4), P(T1 + O, 0, R), P(T0 - O, 0, R)], [n[0], n[1], 1])
  for (const [t, s] of [[T0, -1], [T1, 1]]) {
    poly(brick, [P(t, -HW, EAVE), P(t, HW, EAVE), P(t, 0, R - 0.3)], [d[0] * s, d[1] * s, 0])
    // stone coping and corner turrets on the gable towards the square
    if (s < 0) {
      for (const o of [-HW, HW]) {
        const c = xy(t + 0.2, o)
        prism(stone, rect(c[0] - 1.1, c[1] - 1.1, c[0] + 1.1, c[1] + 1.1, 0.3), 0, EAVE + 2.5)
        pyramid(stone, c[0], c[1], 0.8, EAVE + 2.5, EAVE + 5)
      }
      opening(win, xy(t, 0), [n[0], n[1]], [-d[0], -d[1]], 5, 7, 17.5, 'pointed')
    }
  }
  // windows on the long sides: pairs of storeys grouped per bay, about 5 m
  for (const o of [-HW, HW]) {
    const nn: XY = o < 0 ? [-n[0], -n[1]] : [n[0], n[1]]
    for (let t = T0 + 4.5; t < T1 - 2; t += 5.1) {
      const p = xy(t, o)
      if (o > 0 && t < -6) continue // the link and the west wing stand there
      opening(win, p, d, nn, 2.6, 4, 9.5, 'flat')
      opening(win, p, d, nn, 2.6, 11, 17.5, 'pointed')
    }
  }
}

// ----------------------------------- the south-west link (4 storeys) ---
prism(brick, [[-39.5, -30.2], [-39.1, -35.9], [-36.1, -40.0], [-28.6, -34.6], [-26, -31.5]], 0, 20)
prism(stone, [[-39.8, -30.2], [-39.4, -36.0], [-36.2, -40.4], [-28.4, -34.9], [-25.8, -31.3]], 20, 21, flat)

// --------------------------------------------- the 1963 addition ---
{
  const blocks: { r: XY[]; z: number }[] = [
    { r: [[WX1, -11], [33, -11], [33, 13], [WX1, 13]], z: 28 },
    { r: [[WX1, 13], [15.2, 13], [15.2, 35.1], [WX1, 35.1]], z: 24.5 },
    { r: [[33, -17.9], [55.8, -17.9], [56.1, 23], [15.2, 23], [15.2, 13], [33, 13]], z: 20.5 },
    { r: [[-5.5, -11.1], [-2, -15.8], [9.3, -8.1], [14.7, -8.0], [20.8, -16.4], [23.7, -17.6], [33, -17.9], [33, -11]], z: 20.5 },
  ]
  for (const b of blocks) {
    prism(stone, b.r, 0, b.z, flat)
    // storey-grouped window bands on its outward faces
    for (let i = 0; i < b.r.length; i++) {
      const a = b.r[i], c = b.r[(i + 1) % b.r.length]
      const L = Math.hypot(c[0] - a[0], c[1] - a[1])
      if (L < 8) continue
      const t: XY = [(c[0] - a[0]) / L, (c[1] - a[1]) / L]
      const area = b.r.reduce((s, p, k) => { const q = b.r[(k + 1) % b.r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
      const nrm: XY = area > 0 ? [t[1], -t[0]] : [-t[1], t[0]]
      const m: XY = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2]
      // skip faces hidden against the old wings or another block
      if (Math.abs(m[0] - WX1) < 0.5 || (m[1] > -12 && m[1] < 23 && Math.abs(m[0] - 33) < 0.5) || Math.abs(m[1] - 13) < 0.5 || Math.abs(m[1] + 11) < 0.5 && m[0] > -6) continue
      if (Math.abs(m[0] - 15.2) < 0.5 && m[1] < 23) continue
      // a panel per bay of about 6 m, two storeys each, piers between
      const nb = Math.max(1, Math.round((L - 3) / 6.5)), bw = (L - 3) / nb
      for (let k = 0; k < nb; k++) {
        const mc: XY = [a[0] + t[0] * (1.5 + bw * (k + 0.5)), a[1] + t[1] * (1.5 + bw * (k + 0.5))]
        for (let z = 4; z + 6 < b.z; z += 8) opening(win, mc, t, nrm, bw - 1.6, z, z + 5.2, 'flat')
      }
    }
  }
}

// ---------------------------------------------------------------- output ---
const parts = [
  { part: brick, material: finish('suzzallo-brick', 0xc9a085) },
  { part: stone, material: PALETTE.stone },
  { part: slate, material: finish('suzzallo-slate', 0x95a39b) },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
  { part: flat, material: PALETTE.roof },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Suzzallo Library', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 10, elevation: 0, height: 37.5,
})
await Bun.write(new URL('../models/sea-suzzallo-library.glb', import.meta.url), glb)
console.log(`sea-suzzallo-library.glb: ${triangles} triangles, ${glb.length} bytes`)
