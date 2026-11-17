/**
 * Perot Museum of Nature and Science (2201 N Field Street, Dallas; Morphosis,
 * Thom Mayne, 2012) — original procedural geometry, CC0-1.0.
 * bun generators/dal-perot-museum.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * anchor. Anchor = centroid of the OSM outline way/618964796,
 * 32.786905, -96.8063744. Bearing 32: the cube's walls run at 32° / 122°
 * (lidar, minimum-area rectangle of the cube's roof returns: 32.3°), so the
 * cube is square to this frame. +x is the cube's south-east face (the plaza
 * and the escalator), -y its south-west face (Woodall Rodgers side).
 *
 * Identity, in order: the plain grey precast-concrete cube, lifted on angled
 * legs over a glazed ground storey; the glass escalator tube running up the
 * plaza face and cantilevered past its north corner, with the glazed slot
 * cut into that corner; the few long dark window slots; the rough
 * horizontal ribbing of the panels, densest low down; the sloping
 * flagstone-and-grass roof of the podium wrapping the cube's north and east,
 * with the curved entrance wall and glass storey over the south-east plaza.
 *
 * Evidence:
 *  - plan: cube x -39.4..6.0, y -40.8..4.3 (45.4 x 45.1 m) from USGS 3DEP
 *    lidar TX_Pecos_Dallas_B3_2018 (2018 flight, 0.5 m grid). OSM's cube
 *    part (way/1188705976) sits about 2.5 m west and 3 m north of the lidar
 *    cube; the lidar is followed. Podium: the OSM outline way/618964796 minus
 *    the cube, which matches the lidar roof edges on the north and east.
 *  - heights: base = the lowest ground at the north-west corner (lidar
 *    126.2 m). Cube top 51.7 (measured, lidar 54.0 over ground_min 123.9 less
 *    2.3); published "170 ft" (51.8 m), Wikipedia. Tube top 39.0 at its north
 *    end, falling at 27° to 24.6 at y -22 (measured along the face). Podium
 *    roof (measured, binned 4 m): ~6.5 over the west and north-west, a ramp
 *    rising east from about x -12 to x 12 (contours turning north-east), and
 *    a gently tilted top at 12.7 (south) to 16.6 (north). The south-east
 *    plaza is at 7.0 (lidar ground, Mapterhorn ~8.9 m above its own low).
 *  - cube underside 12.5 on the plaza and north sides, glass to it from
 *    the plaza (about 5.5 m over plaza level; Mabel 01, 04, pano 03). On the
 *    south and west the ribbed concrete comes down to 9.0 as a fascia and
 *    only a 3.5-4.5 m glass band shows over the landscaped ground (pano 01,
 *    Mabel 03; Mabel 07's base is hidden by the freeway barrier), with a
 *    concrete plinth under it; angled legs only on the west and plaza sides. Tube cross
 *    section 6.5 m wide (lidar) x 11 m deep (Mabel 01: ~320 px against
 *    ~29 px/m along its length; lead review asked 10-12 m), its pale frame
 *    and its cantilever past the corner: Budd
 *    "exterior of Escalator", Mabel 01, 02, 06, 07. Window slots placed per
 *    face from Mabel 03, 04, 07, pano 01 (estimated positions).
 *  - entrance wall over the plaza: glass storey 7.0-10.5, concrete band to
 *    the roof (Mabel 06, pano 03).
 *  - colour: the precast concrete is a neutral light grey in every daylight
 *    photo (median #93989a shade / #b0b5b5 overcast), pulled to palette
 *    lightness #d5d5d0; podium roof tan flagstone with dry grass (#a59b73,
 *    Mabel "green roof 01") pulled to #cabfa3 (toned toward grey after
 *    review: the flagstone is tan, the curbs and walls near the cube grey);
 *    tube glass a clear pale teal #a8d5d3 with a pale metal frame #eceeec
 *    (Mabel 01, Budd); ribbing bands and roof plant a shade darker #c3c3be.
 *  - ribbing: dense staggered rows of raised bands 1-1.5 m tall, 0.35-0.55 m
 *    proud, covering 55-85% of each row (more low down), an abstraction of
 *    the striated precast panels in Mabel 01, 03, 04, 07.
 *  - night: the glazed ground storey, the slots and the tube are lit from
 *    inside (window, window-2). The concrete is not floodlit.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Perot_Museum_of_Nature_and_Science_01..07.jpg, _pano_01..03.jpg,
 *    _green_roof_01.jpg — Joe Mabel, CC BY-SA 3.0
 *  - Perot_Museum_of_Nature_and_Science_exterior_of_Escalator.jpg —
 *    Paul M. Budd, CC BY-SA 4.0
 * Aerial: USGS NAIP (public domain). No look-only sources. No commercial
 * imagery or 3D tiles.
 *
 * Terrain: the plaza is lidar ground and outside the outline, so the map
 * draws it; the podium roof and the cube are built to their measured
 * heights. Low faces are split into pieces of 4 m or less.
 *
 * Doubts: the ribbing bands are laid out pseudo-randomly, not panel by
 * panel; the tube ends at y 9.5 (lidar shows it gone by y 10), so its
 * cantilever past the corner may read a little shorter than in Mabel 01; the slot positions are estimated; the
 * corner slot is drawn as a plain 4 x 4 m notch; the north and east podium
 * walls are drawn as plain concrete (no photo shows them square on); the
 * long entry canopy (way/1188705975) and the lower roof well inside the
 * cube's parapet (lidar ~45 m) are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { area, cap, clip, inset, panel, rect, save, triangulate, type XY } from './chi-merchandise-mart'

const ANCHOR: [number, number] = [32.786905, -96.8063744]
const BEARING = 32

/** The cube. */
const CX0 = -39.4, CX1 = 6.0, CY0 = -40.8, CY1 = 4.3
const CB = 12.5, TOP = 51.7
/** South and west: fascia bottom, and the plinth under the glass band. */
const SK = 9.0, PL_S = 5.5, PL_W = 4.5
/** Corner slot at the north end of the plaza face. */
const NX = 2.0, NY = 0.3
/** Plaza level. */
const PLAZA = 7.0

/** Podium roof height (lidar, see header). */
function roofZ(x: number, y: number) {
  const top = Math.max(12.4, 15.0 + 0.075 * y)
  const low = y > 32 ? 6.5 - 0.11 * (y - 32) : 6.5
  const ramp = 7 + 0.38 * (x + 10 - 0.35 * (y - 12))
  return Math.min(top, Math.max(low, ramp))
}

/** Podium outline (OSM way/618964796 less the cube), in this frame. */
const POD: XY[] = [
  [CX1, -16.6], [11.6, -13.5], [15.6, -11.2], [22.1, -8.5], [24.7, -8.7], [27.9, -10.7], [31.0, -13.9],
  [38.6, -25.9], [39.1, -30.0], [38.5, -33.0], [37.6, -33.9], [31.9, -39.4], [37.3, -40.4], [40.5, -37.3],
  [45.4, -32.3], [46.4, -31.1], [46.8, -29.8], [46.1, -18.8], [45.5, -10.7], [45.4, -1.7], [45.6, 2.3],
  [48.6, 8.9], [54.0, 19.4], [36.0, 22.9], [30.3, 24.4], [22.6, 27.3], [16.3, 28.6], [9.2, 29.7], [2.9, 31.8],
  [-0.7, 33.1], [-10.3, 33.4], [-14.8, 33.9], [-18.2, 36.3], [-24.7, 42.4], [-31.9, 48.9], [-35.5, 46.5],
  [-30.7, 31.2], [-30.7, 27.3], [-32.1, 22.2], [-32.2, 9.2], [CX0, 9.2], [CX0, CY1], [CX1, CY1],
]
/** Edges of POD that face the plaza and carry the entrance glazing. */
const PLAZA_EDGES = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

/** Deterministic pseudo-random numbers. */
function rng(seed: number) {
  let s = seed >>> 0
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32)
}

/** A square-section leg from a to b. */
function leg(p: Part, a: V3, b: V3, w: number) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const l = Math.hypot(...d)
  const u: V3 = [d[0] / l, d[1] / l, d[2] / l]
  // two axes perpendicular to u
  let s: V3 = [-u[1], u[0], 0]
  const sl = Math.hypot(...s)
  s = sl < 1e-6 ? [1, 0, 0] : [s[0] / sl, s[1] / sl, 0]
  const t: V3 = [u[1] * s[2] - u[2] * s[1], u[2] * s[0] - u[0] * s[2], u[0] * s[1] - u[1] * s[0]]
  const ring = (c: V3): V3[] => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([i, j]) =>
    [c[0] + (s[0] * i + t[0] * j) * w / 2, c[1] + (s[1] * i + t[1] * j) * w / 2, c[2] + (s[2] * i + t[2] * j) * w / 2] as V3)
  const r0 = ring(a), r1 = ring(b)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    // winding: outward normals
    const q: V3[] = [r0[i], r0[j], r1[j], r1[i]]
    const mid: V3 = [(r0[i][0] + r0[j][0]) / 2, (r0[i][1] + r0[j][1]) / 2, (r0[i][2] + r0[j][2]) / 2]
    const n = [mid[0] - a[0], mid[1] - a[1], mid[2] - a[2]] as V3
    const g = [(q[1][1] - q[0][1]) * (q[2][2] - q[0][2]) - (q[1][2] - q[0][2]) * (q[2][1] - q[0][1]),
      (q[1][2] - q[0][2]) * (q[2][0] - q[0][0]) - (q[1][0] - q[0][0]) * (q[2][2] - q[0][2]),
      (q[1][0] - q[0][0]) * (q[2][1] - q[0][1]) - (q[1][1] - q[0][1]) * (q[2][0] - q[0][0])]
    if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.quad(q[0], q[1], q[2], q[3])
    else p.quad(q[0], q[3], q[2], q[1])
  }
}

/** An axis-aligned box. */
function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bottom = true) {
  const r = rect(x0, y0, x1, y1)
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  cap(p, r, z1)
  if (bottom) cap(p, r, z0, false)
}

function build() {
  const conc = new Part(), terr = new Part(), rib = new Part(), win = new Part(), tube = new Part(), frame = new Part()

  // --- Podium: walls split into short pieces, a roof draped on a 4 m grid.
  const pod = area(POD) > 0 ? POD : [...POD].reverse()
  const flipped = pod !== POD
  for (let i = 0; i < pod.length; i++) {
    const a = pod[i], b = pod[(i + 1) % pod.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / 4))
    const edgeIndex = flipped ? pod.length - 2 - i : i
    const plaza = PLAZA_EDGES.has(edgeIndex)
    for (let k = 0; k < n; k++) {
      const p: XY = [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]
      const q: XY = [a[0] + (b[0] - a[0]) * (k + 1) / n, a[1] + (b[1] - a[1]) * (k + 1) / n]
      conc.quad([p[0], p[1], 0], [q[0], q[1], 0], [q[0], q[1], roofZ(...q)], [p[0], p[1], roofZ(...p)])
    }
    // The tall north and east walls carry the same ribbed panels as the cube.
    if (!plaza && L > 8) {
      const zmin = Math.min(roofZ(...a), roofZ(...b))
      for (const [z0, z1, f0, f1] of [[4.6, 6.4, 0.04, 0.96]] as const)
        if (zmin > z1 + 1.2) relief(conc, a, b, L * f0, L * f1, z0, z1, 0.25)
    }
    if (plaza && L > 2) {
      // Glass storey at plaza level, in bays between slim piers.
      const bays = Math.max(1, Math.round(L / 6)), w = L / bays
      for (let k = 0; k < bays; k++) panel(win, a, b, k * w + 0.3, (k + 1) * w - 0.3, PLAZA, 10.5, 0.06)
    }
  }
  const G = 4
  for (let gx = -44; gx < 56; gx += G) {
    for (let gy = -44; gy < 52; gy += G) {
      const cell = rect(gx, gy, gx + G, gy + G)
      const piece = clip(pod, cell)
      if (piece.length < 3 || Math.abs(area(piece)) < 1e-3) continue
      for (const [i, j, k] of triangulate(piece)) {
        const A = piece[i], B = piece[j], C = piece[k]
        terr.tri([A[0], A[1], roofZ(...A)], [B[0], B[1], roofZ(...B)], [C[0], C[1], roofZ(...C)])
      }
    }
  }

  // --- The cube, with the slot cut into its north-east corner.
  const C: XY[] = [[CX0, CY0], [CX1, CY0], [CX1, NY], [NX, NY], [NX, CY1], [CX0, CY1]]
  const BEV = 0.5
  const Ci = inset(C, BEV)
  for (let i = 0; i < C.length; i++) {
    const a = C[i], b = C[(i + 1) % C.length], ai = Ci[i], bi = Ci[(i + 1) % C.length]
    const notch = i === 2 || i === 3
    const p = notch ? tube : conc
    p.quad([a[0], a[1], CB], [b[0], b[1], CB], [b[0], b[1], TOP - BEV], [a[0], a[1], TOP - BEV])
    conc.quad([a[0], a[1], TOP - BEV], [b[0], b[1], TOP - BEV], [bi[0], bi[1], TOP], [ai[0], ai[1], TOP])
  }
  // parapet top, roof well
  for (const [i, j, k] of triangulate(Ci)) {
    // the parapet top and the roof, in concrete
    conc.tri([Ci[i][0], Ci[i][1], TOP], [Ci[j][0], Ci[j][1], TOP], [Ci[k][0], Ci[k][1], TOP])
  }
  // The roof is pale membrane (NAIP); two grey plant enclosures on it.
  box(rib, CX0 + 8, CY0 + 10, CX0 + 22, CY0 + 24, TOP, TOP + 2.2, false)
  box(rib, CX0 + 26, CY0 + 6, CX0 + 36, CY0 + 30, TOP, TOP + 1.6, false)
  cap(conc, C, CB, false)

  // --- Ground storey under the cube, set in under the overhang. On the
  // plaza (east) and north sides it is glass to the cube's underside (Mabel
  // 01, 04, pano 03). On the south and west the ribbed concrete comes down to
  // SK as a deep fascia and only a band of glass shows over the landscaped
  // ground (pano 01, Mabel 03: about 3-4 m of glass above the planting); a
  // concrete plinth fills the storey below that ground.
  const lob = rect(CX0 + 2.5, CY0 + 2.5, CX1 - 2.5, CY1)
  for (let i = 0; i < 4; i++) {
    const a = lob[i], b = lob[(i + 1) % 4]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.ceil(L / 4)
    const pl = i === 0 ? PL_S : i === 3 ? PL_W : 0, top = i === 0 || i === 3 ? SK : CB
    for (let k = 0; k < n; k++) {
      const s0 = (L * k) / n, s1 = (L * (k + 1)) / n
      if (pl > 0) panel(conc, a, b, s0, s1, 0, pl, 0)
      panel(win, a, b, s0, s1, pl, top, 0)
    }
  }
  // the fascia on the south and west faces, and its soffit
  const fS: XY[] = [[CX0, CY0], [CX1, CY0]], fW: XY[] = [[CX0, CY1], [CX0, CY0]]
  for (const [a, b] of [fS, fW]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.ceil(L / 5)
    for (let k = 0; k < n; k++) panel(conc, a, b, (L * k) / n, (L * (k + 1)) / n, SK, CB, 0)
  }
  cap(conc, [[CX0, CY0], [CX1, CY0], [CX1, CY0 + 2.5], [CX0 + 2.5, CY0 + 2.5], [CX0 + 2.5, CY1], [CX0, CY1]], SK, false)
  // Angled legs: under the west fascia (pano 01, pano 02) and on the plaza
  // side (Mabel 04); none on the south face, where no photo shows them.
  const legs: [V3, V3][] = []
  for (const y of [-30, -14]) {
    legs.push([[CX0 + 2.5, y - 2.5, PL_W], [CX0 + 0.8, y - 1.0, SK]], [[CX0 + 2.5, y + 2.5, PL_W], [CX0 + 0.8, y + 1.0, SK]])
  }
  legs.push([[CX1 - 2.5, -36, 0.8], [CX1 - 0.8, -34, CB]], [[CX1 - 2.5, -26, 0.8], [CX1 - 0.8, -28, CB]])
  for (const [a, b] of legs) leg(conc, a, b, 1.1)

  // --- Faces: window slots, then the ribbed panel relief around them.
  type Slot = [number, number, number, number]
  const faces: { a: XY; b: XY; slots: Slot[]; skip?: (s: number, z: number) => boolean }[] = [
    // south-west face (Woodall Rodgers side), s west -> east (Mabel 07, 04)
    { a: [CX0, CY0], b: [CX1, CY0], slots: [[11, 36, 42.2, 43.9], [7, 10.5, 38, 39.4], [16, 19.5, 35.5, 36.9], [24, 28.5, 33, 34.4], [33, 37, 36, 37.4], [29, 31.5, 30, 31.4]],
      skip: (s, z) => s > 37 && z < 21 },
    // south-east plaza face, s south -> north; the tube covers its upper north half
    { a: [CX1, CY0], b: [CX1, NY], slots: [[2, 22, 46.3, 47.9], [6, 9.5, 40.5, 41.9], [3, 6, 30, 31.4]],
      skip: (s, z) => { const y = CY0 + s; return y > -25.5 && z > tubeTop(y) - TH - 1 && z < tubeTop(y) + 1 } },
    // north-east face, s east -> west
    { a: [NX, CY1], b: [CX0, CY1], slots: [[6, 34, 44, 45.6], [9, 12.5, 21, 22.4], [24, 28, 30, 31.4], [33, 36, 37, 38.4]] },
    // north-west face, s north -> south (pano 01)
    { a: [CX0, CY1], b: [CX0, CY0], slots: [[4, 30, 45, 46.6], [6, 9.5, 36, 37.4], [14, 17.5, 31, 32.4], [30, 33.5, 38.5, 39.9], [22, 25.5, 26, 27.4], [36, 40, 42, 43.4]] },
  ]
  const R = rng(20120)
  for (const f of faces) {
    const L = Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1])
    for (const [s0, s1, z0, z1] of f.slots) panel(win, f.a, f.b, s0, s1, z0, z1, 0.06)
    // Ribbing: dense staggered rows of raised bands 1-1.5 m tall, a shade
    // darker than the wall, more of them low down (Mabel 01, 03, 04, 07).
    for (let z = (f === faces[0] || f === faces[3] ? SK : CB) + 0.5; z < TOP - 2; ) {
      const h = 1.0 + R() * 0.5
      const lowness = 1 - (z - CB) / (TOP - CB)
      let s = R() * 6
      while (s < L - 2) {
        const w = 6 + R() * 12
        const e = Math.min(L - 0.6, s + w)
        const zz0 = z, zz1 = Math.min(TOP - 1.2, z + h)
        const hitsSlot = f.slots.some(([a0, a1, b0, b1]) => e > a0 - 0.4 && s < a1 + 0.4 && zz1 > b0 - 0.4 && zz0 < b1 + 0.4)
        const skipped = f.skip && (f.skip(s, zz0) || f.skip(e, zz0) || f.skip(s, zz1) || f.skip(e, zz1) || f.skip((s + e) / 2, zz0))
        if (R() < 0.55 + 0.3 * lowness && !hitsSlot && !skipped && e - s > 3 && zz1 - zz0 > 0.6) {
          relief(rib, f.a, f.b, s, e, zz0, zz1, 0.35 + 0.2 * R())
        }
        s = e + 1 + R() * 4
      }
      z += h + 0.35 + R() * 0.3
    }
  }

  // --- The escalator tube up the plaza face, past the corner (lidar, Budd,
  // Mabel 01): a deep glass box with a pale metal frame on its edges.
  const TY0 = -24, TY1 = 9.5, TX0 = CX1, TX1 = CX1 + 6.5
  const t = (x: number, y: number, top: boolean): V3 => [x, y, tubeTop(y) - (top ? 0 : TH)]
  const A0 = t(TX0, TY0, false), A1 = t(TX1, TY0, false), A2 = t(TX1, TY0, true), A3 = t(TX0, TY0, true)
  const B0 = t(TX0, TY1, false), B1 = t(TX1, TY1, false), B2 = t(TX1, TY1, true), B3 = t(TX0, TY1, true)
  tube.quad(A1, B1, B2, A2) // outer side
  tube.quad(A3, A2, B2, B3) // glass roof
  tube.quad(A0, B0, B1, A1) // glass underside
  tube.quad(B1, B0, B3, B2) // high end
  tube.quad(A0, A1, A2, A3) // low end
  // inner side, where it stands clear of the cube (over the corner slot)
  const M0 = t(TX0, NY, false), M3 = t(TX0, NY, true)
  tube.quad(B0, M0, M3, B3)
  // frame: the twelve edges, and a mid rail along the outer side
  const out = (p: V3, dx: number, dz: number): V3 => [p[0] + dx, p[1], p[2] + dz]
  const F = 0.55
  for (const [p, q] of [[A1, B1], [A2, B2], [A3, B3], [A1, A2], [B1, B2], [A2, A3], [B2, B3], [B0, B1], [A0, A1], [B0, B3]] as [V3, V3][])
    leg(frame, p, q, F)
  leg(frame, out(A1, 0.1, TH / 2), out(B1, 0.1, TH / 2), 0.4)
  // soffit box under the cantilevered end (Budd, Mabel 02)
  const sz = tubeTop(4) - TH
  box(conc, TX0 + 0.8, 1.5, TX1 - 0.8, TY1 - 1.5, sz - 2.4, sz - 0.6 * 0, true)
  // glass stair in the corner slot under the tube (Mabel 01)
  panel(tube, [CX1, NY], [CX1, CY1], 0.3, CY1 - NY - 0.3, CB, sz - 2.4, 0.0)

  // --- Small projecting bay low on the south-west face (Mabel 07, pano 01).
  box(rib, -1.5, CY0 - 3, 4.5, CY0, 13, 19.5)
  panel(win, [-1.5, CY0 - 3], [4.5, CY0 - 3], 0.6, 5.4, 13.8, 18.4, 0.05)

  return [
    { part: conc, material: finish('perot-concrete', 0xd5d5d0) },
    { part: rib, material: finish('perot-rib', 0xc3c3be) },
    { part: terr, material: finish('perot-terrace', 0xcabfa3) },
    { part: win, material: PALETTE.window },
    { part: tube, material: windowVariant(2, 0xa8d5d3) },
    { part: frame, material: finish('perot-frame', 0xeceeec) },
  ]
}

/** Vertical depth of the escalator tube (Mabel 01: ~320 px at ~29 px/m). */
const TH = 11

/** Top of the escalator tube along the plaza face (lidar: 39.0 at y 6, 27°). */
function tubeTop(y: number) {
  return 39.0 + 0.51 * (y - 6)
}

/** A slab standing `out` proud of the wall a→b over s0..s1, z0..z1. */
function relief(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, z: number, o: number): V3 => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o, z]
  p.quad(P(s0, z0, out), P(s1, z0, out), P(s1, z1, out), P(s0, z1, out)) // face
  p.quad(P(s0, z1, out), P(s1, z1, out), P(s1, z1, 0), P(s0, z1, 0)) // top
  p.quad(P(s0, z0, 0), P(s1, z0, 0), P(s1, z0, out), P(s0, z0, out)) // underside
  p.quad(P(s1, z0, out), P(s1, z0, 0), P(s1, z1, 0), P(s1, z1, out)) // right end
  p.quad(P(s0, z0, 0), P(s0, z0, out), P(s0, z1, out), P(s0, z1, 0)) // left end
}

if (import.meta.main) await save('dal-perot-museum', 'Perot Museum of Nature and Science', ANCHOR, BEARING, build(), 5000)
