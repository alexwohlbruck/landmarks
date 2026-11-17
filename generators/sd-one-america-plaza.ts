/**
 * One America Plaza, San Diego — 600 West Broadway.
 *
 * Helmut Jahn (Murphy/Jahn), 1991; 34 storeys, 152 m (500 ft), the tallest
 * building in San Diego. A square tower with chamfered corners in a cream
 * aluminium-and-granite grid over blue-grey glass, whose top is a
 * cross-gabled glass crown: the middle three bays of every face rise into
 * a pointed gable, the four gables meet in a pyramid with a pinnacle, and
 * the chamfered corners stop lower under sloping glass caps. The crown is
 * floodlit white at night. The trolley station's canopy on the north side
 * is its own model (sd-america-plaza-station), in a matching frame.
 *
 * Frame: bearing 0 (the downtown grid here runs true north). +x east,
 * +y north, metres; origin at the anchor (−117.16870, 32.71614), the tower
 * part's centroid; y = 0 the ground at the tower's foot.
 *
 * Sources
 * - OSM: outline way/451287796 (One America Plaza, 2 levels), tower part
 *   way/458903471 (h=152, 34 levels, pyramidal, roof:height 30, glass),
 *   crown part way/497520826 (building:part=roof, h=140, gabled), podium
 *   parts way/1078598877 (Navy SEAL Museum San Diego, 2 levels) and
 *   way/1078598879 (2 levels). © OSM contributors.
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014), 1 m grid; ground at
 *   the tower ≈ 2.0 m above the box's ground_min.
 * - USGS NAIP orthophoto (plan of the crown, podium roofs).
 * - Wikipedia "One America Plaza": 152 m, 34 floors, 1991, Helmut Jahn.
 * Photos (evidence):
 * - "OneAmericaPlazaSDSept10.jpg" and "OneAmericaPlazaSanDiegoApr09.jpg",
 *   Nehrams2020, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:OneAmericaPlazaSDSept10.jpg
 * - "One America Plaza with moon.jpg", Wattewyl, CC BY 3.0,
 *   https://commons.wikimedia.org/wiki/File:One_America_Plaza_with_moon.jpg
 * - "OneAmericanPlaza.jpg", Ldelagarzag, CC BY-SA 4.0.
 * - "One America Plaza, night.JPG", Rufustele, CC BY 2.5 (night: the crown
 *   floodlit white).
 * - "Core-Columbia, San Diego … panoramio (8/9/10/17).jpg", Roman
 *   Eugeniusz, CC BY-SA 3.0 (the tower's foot, podium and canopy).
 * - "One America Plaza.jpg", Mds08011, CC BY 4.0 (base, canopy join).
 *
 * Numbers
 * - Plan: 43.5 × 43 m with 5.3 m chamfers. x from OSM (−21.4…22.1). OSM's
 *   tower part runs 6 m further north (to y = 25) than the lidar roof and
 *   the NAIP crown, which both give a near-square 43 m; the north edge is
 *   taken from the lidar (y = 18.8) and the strip left over belongs to the
 *   podium. The lidar roof sits about 3 m east of OSM; OSM's x is kept, so
 *   the model matches the outline it replaces.
 * - Shaft and corners to 109.5 m; gable eaves 118.6 m, gable peaks 131 m,
 *   crown apex 145.4 m — lidar (measured). Pinnacle to 152 m — published
 *   overall height.
 * - Gable band 27 m (the middle three 9 m bays) — lidar step and photos.
 * - Podium parts 12.3 m — lidar.
 * - Facade: bays and the three-storey grouping from the photos (estimated).
 *
 * Doubts
 * - The lidar-to-OSM east offset (3 m) is unexplained; the model follows
 *   OSM in x.
 * - The podium's facades are simplified to granite with window bands.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { qf, tf } from './dc-white-house'
import { cap as pcap, walls as pwalls, area, save, type XY } from './chi-aon-center'

const FRAME = finish('oap-frame', 0xe9e5dc)
const GLASS = windowVariant(1, 0x86a0bd)
const CROWN = finish('oap-crown', 0xcfd8de, 0.4)
const GRANITE = finish('oap-granite', 0xd3cbbf)

const frame = new Part(), win = new Part(), crown = new Part(), granite = new Part(), roof = new Part()

// Tower plan (OSM x, lidar north edge).
const CX = 0.35, CY = -2.7, A = 21.6, C = 5.3
const ZC = 109.5 // shaft and corner tops
const B = 13.5 // half-width of the gable band
const ZF = 131 // gable peak on each face
const APEX = 145.4
const R = (APEX - ZF) / A // ridge rise inward
const ZE = 118.6 // gable eaves at the band's edge
const G = (ZF - ZE) / B
const ZIN = 115.5 // corner caps' inner point
const LOBBY = 9

/** Arm k's frame: u along the face (to the right seen from outside), w outward from the centre. */
function arm(k: number) {
  const a = -Math.PI / 2 + k * Math.PI / 2 // k = 0 south, 1 east, 2 north, 3 west
  const n: XY = [Math.cos(a), Math.sin(a)], t: XY = [-n[1], n[0]]
  const P = (u: number, w: number, z: number): V3 => [CX + u * t[0] + w * n[0], CY + u * t[1] + w * n[1], z]
  return { n, t, P, N: [n[0], n[1], 0] as V3, T: [t[0], t[1], 0] as V3 }
}
const roofZ = (u: number, w: number) => ZF + R * (A - w) - G * Math.abs(u)

// --- Shaft: chamfered square from the ground to the corner tops -------------
const plan: XY[] = []
for (let k = 0; k < 4; k++) {
  const { P } = arm(k)
  const a = P(-(A - C), A, 0), b = P(A - C, A, 0)
  plan.push([a[0], a[1]], [b[0], b[1]])
}
pwalls(frame, area(plan) > 0 ? plan : [...plan].reverse(), 0, ZC)

/** A window panel on a vertical face: s0..s1 along it from point o in direction t, z0..z1; top corners clipped to `top(s)`. */
function facePanel(o: V3, t: XY, n: XY, s0: number, s1: number, z0: number, z1: number, top?: (s: number) => number, part = win) {
  const d = 0.06
  const Q = (s: number, z: number): V3 => [o[0] + t[0] * s + n[0] * d, o[1] + t[1] * s + n[1] * d, z]
  const ta = top ? Math.min(z1, top(s0)) : z1, tb = top ? Math.min(z1, top(s1)) : z1
  if (ta - z0 < 0.8 && tb - z0 < 0.8) return
  qf(part, Q(s0, z0), Q(s1, z0), Q(s1, Math.max(z0 + 0.3, tb)), Q(s0, Math.max(z0 + 0.3, ta)), [n[0], n[1], 0])
}

// Storey groups: a tall glass lobby, then three-storey bands.
const bands: [number, number][] = [[0.0, LOBBY - 0.8]]
{
  const n = 9, h = (ZC - LOBBY) / n
  for (let i = 0; i < n; i++) bands.push([LOBBY + i * h + 0.7, LOBBY + (i + 1) * h - 0.7])
  // Two more bands up into the gables.
  bands.push([ZC + 0.7, ZC + h - 0.7], [ZC + h + 0.7, ZC + 2 * h - 0.7])
}

for (let k = 0; k < 4; k++) {
  const { n, t, P } = arm(k)
  // The face: three 9 m bays in the gable band, a 2.8 m bay either side.
  const o = P(0, A, 0)
  const bays: [number, number][] = []
  for (const i of [-1, 0, 1]) {
    const c = i * 9
    bays.push([c - 4.05, c - 0.35], [c + 0.35, c + 4.05])
  }
  bays.push([-(A - C) + 0.5, -B - 0.45], [B + 0.45, A - C - 0.5])
  for (const [s0, s1] of bays) {
    const inBand = Math.abs((s0 + s1) / 2) < B
    for (const [z0, z1] of bands) {
      if (!inBand && z0 > ZC) continue
      facePanel(o, t, n, s0, s1, z0, z1, inBand ? (s) => ZF - G * Math.abs(s) - 0.8 : (s) => ZC - 0.5)
    }
  }
  // The chamfer to the next face: one bay.
  {
    const a = P(A - C, A, 0), b = P(A, A - C, 0)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const tc: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nc: XY = [tc[1], -tc[0]]
    for (const [z0, z1] of bands) if (z1 < ZC) facePanel(a, tc, nc, 0.5, L - 0.5, z0, z1)
  }

  // --- Crown -------------------------------------------------------------------
  // The gable wall above the corner tops.
  const N3: V3 = [n[0], n[1], 0], T3: V3 = [t[0], t[1], 0]
  qf(frame, P(-B, A, ZC), P(B, A, ZC), P(B, A, ZE), P(-B, A, ZE), N3)
  tf(frame, P(-B, A, ZE), P(B, A, ZE), P(0, A, ZF), N3)
  // Rake trim: a band standing proud along the gable's edges.
  for (const s of [-1, 1]) {
    const e0 = P(s * B, A + 0.35, ZE), e1 = P(0, A + 0.35, ZF)
    qf(frame, e0, e1, [e1[0], e1[1], e1[2] + 0.7], [e0[0], e0[1], e0[2] + 0.7], N3)
  }
  // The gable's roof: two sloping glass planes meeting at the apex.
  for (const s of [-1, 1]) {
    const pts: V3[] = [P(0, A, ZF), P(s * B, A, ZE), P(s * B, B, roofZ(B, B)), P(0, 0, APEX)]
    qf(crown, pts[0], pts[1], pts[2], pts[3], [s * t[0] * G + n[0] * R, s * t[1] * G + n[1] * R, 1])
  }
  // The band's side walls, above the corner caps.
  for (const s of [-1, 1]) {
    const m: V3 = [s * t[0], s * t[1], 0]
    qf(crown, P(s * B, A, ZC), P(s * B, B, ZIN), P(s * B, B, roofZ(B, B)), P(s * B, A, ZE), m)
  }
  // The corner cap on this arm's right: glass sloping up from the corner tops.
  const ring: V3[] = [P(B, A, ZC), P(A - C, A, ZC), P(A, A - C, ZC), P(A, B, ZC)]
  const inner = P(B, B, ZIN)
  // Dark glass, as the photos show it against the pale crown.
  for (let i = 0; i < ring.length - 1; i++) tf(win, ring[i], ring[i + 1], inner, [0, 0, 1])
  // A trim lip around the corner top.
  for (let i = 0; i < ring.length - 1; i++) {
    const a = ring[i], b = ring[i + 1]
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy)
    const no: V3 = [dy / L, -dx / L, 0]
    qf(frame, [a[0] + no[0] * 0.1, a[1] + no[1] * 0.1, ZC - 0.9], [b[0] + no[0] * 0.1, b[1] + no[1] * 0.1, ZC - 0.9], [b[0] + no[0] * 0.1, b[1] + no[1] * 0.1, ZC + 0.4], [a[0] + no[0] * 0.1, a[1] + no[1] * 0.1, ZC + 0.4], no)
  }
}
// Pinnacle.
{
  const h = 0.6
  const base: V3[] = [[CX - h, CY - h, APEX - 0.6], [CX + h, CY - h, APEX - 0.6], [CX + h, CY + h, APEX - 0.6], [CX - h, CY + h, APEX - 0.6]]
  const tip: V3 = [CX, CY, 152]
  for (let i = 0; i < 4; i++) crown.tri(base[i], base[(i + 1) % 4], tip)
}

// --- Podium parts (OSM, 12.3 m) ---------------------------------------------------
const PODIUM_H = 12.3
const seal: XY[] = [[-9.0, 63.0], [-12.0, 59.3], [-27.5, 23.8], [-34.2, 26.5], [-33.7, 63.3]]
const east: XY[] = [[24.9, 60.7], [21.2, 60.8], [16.4, 60.2], [12.2, 58.7], [8.3, 56.3], [4.8, 53.2], [1.8, 48.9], [-8.0, 25.1], [-8.0, 18.8], [21.5, 18.8], [19.7, 24.1], [19.5, 33.6], [19.5, 38.6], [25.2, 38.7]]
for (const ring0 of [seal, east]) {
  const ring = area(ring0) > 0 ? ring0 : [...ring0].reverse()
  pwalls(granite, ring, 0, PODIUM_H)
  pcap(roof, ring, PODIUM_H)
  // Window bands on every wall longer than 4 m: two storeys.
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 4) continue
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
    for (const [z0, z1] of [[0.3, 4.6], [6.4, 10.8]] as [number, number][]) facePanel([a[0], a[1], 0], t, n, 0.8, L - 0.8, z0, z1, undefined, win)
  }
}

const parts = [
  { part: frame, material: FRAME },
  { part: win, material: GLASS },
  { part: crown, material: { ...CROWN, floodlight: (p: V3) => (p[2] > ZC - 1 ? 1 : 0) } },
  { part: granite, material: GRANITE },
  { part: roof, material: PALETTE.roof },
]
await save('sd-one-america-plaza', 'One America Plaza', [-117.1687, 32.71614], 0, parts as any)
