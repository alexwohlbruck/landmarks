/**
 * Holy Name Cathedral, Chicago (1874–75, Patrick Keely) — original
 * procedural geometry, CC0-1.0.
 * bun generators/chi-holy-name-cathedral.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/75684994,
 * 41.895984,-87.627533. The outline's edges run at 88.7° / 178.7°, so the
 * catalog bearing is 358.7 and the church is square to this frame. The
 * front faces west onto State Street; the apse is east.
 *
 * Identity: the pale limestone gabled west front with its big rose window
 * over the pointed portal, and the single square tower at its south-west
 * corner carrying a tall, dark slate octagonal spire with corner pinnacles.
 * Second: the cruciform roof plan (nave, transepts, apse) in grey slate.
 *
 * Evidence:
 *  - plan: OSM outline (published 233 × 126 ft, i.e. 71 × 38 m, matches its
 *    72 × 40 m). The roof plan — nave and chancel ≈ 19 m wide under one
 *    roof, transept across x ≈ -11 to -1, a rounded apse at the east, lower
 *    chapels along the sides — is read off USGS NAIP.
 *  - heights: spire 64 m (Wikipedia, 210 ft); interior ceiling 21 m
 *    (Wikipedia). The rest measured on AlasdairW's frontal photo from the
 *    west, scaled so the spire is 64 m: front gable apex ≈ 32 m, nave eaves
 *    ≈ 22 m, aisle and chapel eaves ≈ 13 m, tower cornice ≈ 40 m, belfry
 *    lancet ≈ 27.5–34 m, rose window centre ≈ 19 m (radius ≈ 3.9 m).
 *    Measured against the OSM front width instead, the same photo gives a
 *    spire nearer 70 m; the published figure wins (expect ±3 m on the
 *    others).
 *  - estimated: the tower is ≈ 11 m square (the photo shows it at 0.6 of
 *    the gable's width; OSM's south-west block is 12.7 m wide but only
 *    6.7 m deep, so the tower is taken to run back into the aisle); the
 *    east chapels' roofs; the transept ridge height (taken equal to the
 *    nave's).
 *  - colour: buff-grey limestone, grey slate roofs, near-black slate spire
 *    held at charcoal.
 *
 * Photos (Wikimedia Commons): DSCN9250_Holy_Name_Cathedral.jpg (AlasdairW,
 * CC BY-SA 3.0); Holy_Name_Cathedral_-_Chicago_01.jpg, _02.jpg (Farragutful,
 * CC BY-SA 4.0); 20190421_03_Superior_St._near_Dearborn_St.
 * _(49699196441).jpg and 20110219_42_Holy_Name_Cathedral_(5498041069).jpg
 * (David Wilson, CC BY 2.0); Holy_Name_Cathedral_Structure.jpg (Raymond
 * Tambunan, CC BY-SA 3.0); Holy_Names_Cathedral,_Chicago,_Illinois
 * _(Landscape_style).jpg (TreShon Woods, CC BY-SA 4.0). USGS NAIP for the
 * roof plan. No commercial imagery.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const stone = new Part(), roof = new Part(), spire = new Part(), win = new Part(), door = new Part()

type XY = [number, number]
const at = (pts: XY[], z: number): V3[] => pts.map(([x, y]) => [x, y, z])
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part | null = p) {
  p.loft([at(rect(x0, x1, y0, y1), z0), at(rect(x0, x1, y0, y1), z1)])
  if (top) top.cap(at(rect(x0, x1, y0, y1), z1), true)
}

/**
 * A gabled block: walls to the eaves, gable walls at the ends that are
 * open (`ends`), and two slate roof planes with a small overhang. `alongY`
 * runs the ridge north-south.
 */
function gabled(x0: number, x1: number, y0: number, y1: number, eave: number, ridge: number, alongY = false, ends: [boolean, boolean] = [true, true]) {
  const P = (a: number, b: number, z: number): V3 => (alongY ? [b, a, z] : [a, b, z])
  const [a0, a1, b0, b1] = alongY ? [y0, y1, x0, x1] : [x0, x1, y0, y1]
  const bm = (b0 + b1) / 2
  const q = (v: V3[]) => (alongY ? stone.quad(v[1], v[0], v[3], v[2]) : stone.quad(v[0], v[1], v[2], v[3]))
  q([P(a0, b0, 0), P(a1, b0, 0), P(a1, b0, eave), P(a0, b0, eave)])
  q([P(a1, b1, 0), P(a0, b1, 0), P(a0, b1, eave), P(a1, b1, eave)])
  const end = (a: number, out: boolean) => {
    const v = [P(a, b1, 0), P(a, b0, 0), P(a, b0, eave), P(a, bm, ridge), P(a, b1, eave)]
    const w = out !== alongY ? [...v].reverse() : v
    stone.quad(w[0], w[1], w[2], w[4]); stone.tri(w[2], w[3], w[4])
  }
  if (ends[0]) end(a0, false)
  if (ends[1]) end(a1, true)
  const o = 0.5, dz = ((ridge - eave) / ((b1 - b0) / 2)) * o
  const A0 = a0 - (ends[0] ? 0.4 : 0), A1 = a1 + (ends[1] ? 0.4 : 0)
  const r1 = [P(A0, b0 - o, eave - dz), P(A1, b0 - o, eave - dz), P(A1, bm, ridge), P(A0, bm, ridge)]
  const r2 = [P(A1, b1 + o, eave - dz), P(A0, b1 + o, eave - dz), P(A0, bm, ridge), P(A1, bm, ridge)]
  for (const r of [r1, r2]) alongY ? roof.quad(r[1], r[0], r[3], r[2]) : roof.quad(r[0], r[1], r[2], r[3])
}
/** A lean-to roof over a side chapel, sloping down away from the nave. */
function leanTo(x0: number, x1: number, y0: number, y1: number, low: number, high: number, highAtY1: boolean) {
  box(stone, x0, x1, y0, y1, 0, low, null)
  const [yl, yh] = highAtY1 ? [y0 - 0.4, y1] : [y1 + 0.4, y0]
  const hz = high
  // End triangles.
  for (const [x, s] of [[x0, -1], [x1, 1]] as [number, number][]) {
    const t: V3[] = [[x, highAtY1 ? y0 : y1, low], [x, highAtY1 ? y1 : y0, low], [x, highAtY1 ? y1 : y0, hz]]
    if ((s > 0) === highAtY1) stone.tri(t[0], t[1], t[2]); else stone.tri(t[1], t[0], t[2])
  }
  const r: V3[] = [[x0 - 0.3, yl, low - 0.3], [x1 + 0.3, yl, low - 0.3], [x1 + 0.3, yh, hz], [x0 - 0.3, yh, hz]]
  if (highAtY1) roof.quad(r[0], r[1], r[2], r[3]); else roof.quad(r[1], r[0], r[3], r[2])
}

/** A flat pointed-arch panel on a wall facing `n` (a unit axis), centred at `c`. */
function lancet(p: Part, c: XY, n: XY, w: number, z0: number, z1: number, d = 0.06) {
  const t: XY = [-n[1], n[0]] // left-to-right seen from outside
  const spring = z1 - w * 0.75
  const pts: [number, number][] = [[-w / 2, z0], [w / 2, z0], [w / 2, spring]]
  for (const k of [1, 2]) { const a = (k * Math.PI) / 6; pts.push([w / 2 - (w / 2) * (1 - Math.cos(a)), spring + (z1 - spring) * Math.sin(a)]) }
  pts.push([0, z1])
  for (const k of [2, 1]) { const a = (k * Math.PI) / 6; pts.push([-w / 2 + (w / 2) * (1 - Math.cos(a)), spring + (z1 - spring) * Math.sin(a)]) }
  pts.push([-w / 2, spring])
  const v = pts.map(([s, z]): V3 => [c[0] + t[0] * s + n[0] * d, c[1] + t[1] * s + n[1] * d, z])
  for (let i = 1; i < v.length - 1; i++) p.tri(v[0], v[i], v[i + 1])
}
function disc(p: Part, c: XY, n: XY, r: number, z: number, seg = 14, d = 0.08) {
  const t: XY = [-n[1], n[0]]
  const ring = Array.from({ length: seg }, (_, i): V3 => {
    const a = (i / seg) * Math.PI * 2
    return [c[0] + t[0] * r * Math.cos(a) + n[0] * d, c[1] + t[1] * r * Math.cos(a) + n[1] * d, z + r * Math.sin(a)]
  })
  const m: V3 = [c[0] + n[0] * d, c[1] + n[1] * d, z]
  for (let i = 0; i < seg; i++) p.tri(m, ring[i], ring[(i + 1) % seg])
}
function pinnacle(p: Part, x: number, y: number, h: number, z0: number, z1: number, cap: number) {
  const r = rect(x - h, x + h, y - h, y + h)
  p.loft([at(r, z0), at(r, z1)])
  const ring = at(r, z1)
  for (let i = 0; i < 4; i++) p.tri(ring[i], ring[(i + 1) % 4], [x, y, z1 + cap])
}
const W: XY = [-1, 0], S: XY = [0, -1], N: XY = [0, 1], E: XY = [1, 0]

// ── Nave, transept, chancel and apse ─────────────────────────────────────
const NY0 = -6.4, NY1 = 12.4, NM = (NY0 + NY1) / 2, EAVE = 22, RIDGE = 32
gabled(-37.0, -11.0, NY0, NY1, EAVE, RIDGE, false, [true, false])
gabled(-11.0, -1.0, -16.4, 16.0, EAVE, RIDGE, true)
gabled(-1.0, 25.5, NY0, NY1, EAVE - 1, RIDGE - 1.5, false, [false, false])
// Rounded apse: a half-polygon wall and a conical roof.
{
  const cx = 25.5, R = (NY1 - NY0) / 2, n = 7
  const pts: XY[] = Array.from({ length: n + 1 }, (_, i) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI
    return [cx + R * Math.cos(a), NM + R * Math.sin(a)]
  })
  for (let i = 0; i < n; i++) {
    const [a, b] = [pts[i], pts[i + 1]]
    stone.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], EAVE - 1], [a[0], a[1], EAVE - 1])
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, l = Math.hypot(mx - cx, my - NM)
    lancet(win, [mx, my], [(mx - cx) / l, (my - NM) / l], 1.6, 13, 19)
    const o = 1.04
    roof.tri([cx + (a[0] - cx) * o, NM + (a[1] - NM) * o, EAVE - 1.3], [cx + (b[0] - cx) * o, NM + (b[1] - NM) * o, EAVE - 1.3], [cx, NM, RIDGE - 1.5])
  }
}
// Side aisles and chapels, lower, with lean-to roofs.
leanTo(-31.6, -11.0, -12.5, NY0, 11, 15.5, true)
leanTo(-1.0, 22.2, -16.4, NY0, 11, 15.5, true)
leanTo(-1.0, 13.0, NY1, 16.0, 11, 14, false)
// The narrow bay between the tower and the nave front.
box(stone, -37.4, -27.3, -8.1, NY0, 0, 14, roof)
// North-east sacristy and the east annexes: low flat-roofed blocks.
box(stone, 13.0, 30.6, NY1, 20.8, 0, 10, roof)
box(stone, 22.2, 30.9, -20.5, -16.4, 0, 9, roof)
box(stone, 30.9, 33.9, -2.8, 9.6, 0, 9, roof)

// Nave windows between buttresses; transept rose windows.
for (let x = -28.5; x < -12; x += 4.4) {
  lancet(win, [x, NY1], N, 1.5, 13, 20)
  lancet(win, [x, NY0], S, 1.5, 16.5, 20.5)
  lancet(win, [x, -12.5], S, 1.4, 3.5, 9)
  box(stone, x + 1.8, x + 2.6, NY1, NY1 + 0.9, 0, 18, null)
}
for (const [y, n] of [[16.0, N], [-16.4, S]] as [number, XY][]) {
  disc(win, [-6, y], n, 3.4, 16.5)
  lancet(win, [-8, y], n, 1.4, 4, 11)
  lancet(win, [-4, y], n, 1.4, 4, 11)
}
for (let x = 2; x < 22; x += 4.5) lancet(win, [x, -16.4], S, 1.4, 3.5, 9)

// ── The west front ───────────────────────────────────────────────────────
{
  const x = -37.0
  disc(win, [x, NM], W, 3.9, 18.8)
  disc(stone, [x, NM], W, 4.4, 18.8, 14, 0.04)
  lancet(stone, [x, NM], W, 6.4, 0, 9.4, 0.1)
  lancet(door, [x, NM], W, 3.6, 0, 7.2, 0.16)
  for (const dy of [-5.2, -3.3, 3.3, 5.2]) lancet(win, [x, NM + dy], W, 1.0, 10.5, 13.6)
  for (const dy of [-1.6, -0.55, 0.55, 1.6]) lancet(win, [x, NM + dy], W, 0.8, 11.5, 13.6)
  // Corner turret on the north corner of the front, with its pinnacle.
  pinnacle(stone, x + 0.6, NY1 - 0.8, 1.2, 0, 31, 3.5)
}

// ── The tower and spire (south-west corner) ──────────────────────────────
{
  const x0 = -38.3, x1 = -27.3, y0 = -19.1, y1 = -8.1, top = 40
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, h = (x1 - x0) / 2
  box(stone, x0, x1, y0, y1, 0, top - 1.2, roof)
  // Bevelled cornice.
  const r0 = rect(x0, x1, y0, y1), r1 = rect(x0 - 0.4, x1 + 0.4, y0 - 0.4, y1 + 0.4)
  stone.loft([at(r0, top - 1.2), at(r1, top - 0.5), at(r1, top)])
  roof.cap(at(r1, top), true)
  // Corner buttresses running up the shaft, and pinnacles over the cornice.
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const px = cx + sx * (h - 0.6), py = cy + sy * (h - 0.6)
    box(stone, px - 0.9, px + 0.9, py - 0.9, py + 0.9, 0, top - 2.5, null)
    pinnacle(stone, px, py, 0.75, top - 2.5, top + 2.5, 2.8)
  }
  // Belfry lancet, oculus and lower windows on the three free faces.
  for (const [c, n] of [[[x0, cy], W], [[cx, y0], S], [[x1, cy], E]] as [XY, XY][]) {
    lancet(win, c, n, 2.6, 27.5, 34.3)
    disc(win, c, n, 1.0, 37.0, 10)
    lancet(win, c, n, 1.3, 20.5, 24)
    lancet(win, c, n, 1.2, 9.5, 13)
  }
  lancet(door, [x0, cy], W, 2.2, 0, 5.5, 0.12)
  // The octagonal spire, dark slate, with four small gabled lucarnes.
  // Slender: the photos show the spire base at about half the tower width.
  const R = 3.1 / Math.cos(Math.PI / 8)
  const base = Array.from({ length: 8 }, (_, i): V3 => [cx + R * Math.cos(Math.PI / 8 + (i * Math.PI) / 4), cy + R * Math.sin(Math.PI / 8 + (i * Math.PI) / 4), top])
  for (let i = 0; i < 8; i++) spire.tri(base[i], base[(i + 1) % 8], [cx, cy, 64])
  for (const n of [W, S, E, N] as XY[]) {
    const t: XY = [-n[1], n[0]], d = R * Math.cos(Math.PI / 8) * 0.78, z0 = top + 3.2
    const c: XY = [cx + n[0] * d, cy + n[1] * d]
    const a: V3 = [c[0] - t[0] * 0.8 + n[0] * 0.35, c[1] - t[1] * 0.8 + n[1] * 0.35, z0]
    const b: V3 = [c[0] + t[0] * 0.8 + n[0] * 0.35, c[1] + t[1] * 0.8 + n[1] * 0.35, z0]
    const tip: V3 = [c[0] + n[0] * 0.35, c[1] + n[1] * 0.35, z0 + 2.6]
    spire.tri(a, b, tip)
    const back: V3 = [c[0] - n[0] * 0.8, c[1] - n[1] * 0.8, z0 + 2.6]
    spire.tri(b, back, tip); spire.tri(back, a, tip)
  }
}

const parts = [
  { part: stone, material: finish('holy-name-limestone', 0xe8dfca) },
  { part: roof, material: { ...PALETTE.roof, color: 0x8d969d } },
  { part: spire, material: finish('spire-slate', 0x4f5560) },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
]
const triangles = parts.reduce((s, p) => s + p.part.triangles, 0)
const glb = writeGlb('Holy Name Cathedral', parts, {
  frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [41.895984, -87.627533], bearing: 358.7,
})
if (triangles > 5000 || glb.length > 250000) throw new Error(`Budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
const out = process.argv[2] ?? new URL('../models/chi-holy-name-cathedral.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
