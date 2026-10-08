/**
 * Tribune Tower, Chicago (1925, Howells & Hood) — original procedural
 * geometry, CC0-1.0.
 * bun generators/chi-tribune-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/150407241,
 * 41.890550,-87.623308. The outline's edges run at 88.3° / 178.4°, so the
 * catalog bearing is 358.4 and the complex is square to this frame.
 *
 * Identity: the pale limestone shaft with its strong vertical piers, and on
 * top of it the octagonal lantern ringed by eight flying buttresses that leap
 * to tall corner piers, all bristling with pinnacles. Second: the lower
 * pinnacled rear wing east of the shaft, and the plain Tribune annex blocks
 * behind.
 *
 * Evidence:
 *  - plan: OSM. The tower part way/127107038 (30 × 31 m with chamfered
 *    corners) is used as drawn for the shaft. The rest of the outline is the
 *    1920s plant/annex; the split into blocks is read from TonyTheTiger's
 *    2018 photo from the east (two blocks, the north one taller) and from
 *    NAIP (the north block's pale roof, the Nathan Hale Court notch on
 *    Michigan Avenue, which the outline already excludes). The rear wing's
 *    east edge at x = -2.5 is the outline's own node on the south side.
 *  - heights: 141 m to the top of the crown (OSM height, Wikipedia 462 ft).
 *    Crown levels measured on Rycroft's 2022 photo from the south, scaled by
 *    the 30 m shaft width and corrected for foreshortening: shaft windows to
 *    ≈ 105 m, tracery screen to ≈ 114 m, corner piers to ≈ 124/129 m,
 *    lantern parapet ≈ 136 m. Rear wing ≈ 84 m with pinnacles to ≈ 92 m
 *    (Rycroft and TonyTheTiger 2007, both from the south-west, ratio to the
 *    full height). Annex blocks ≈ 32 m (south) and ≈ 40 m (north) by
 *    counting floors on TonyTheTiger's photo from the east; the Michigan
 *    Avenue north wing takes OSM's 6 levels (≈ 25 m). Expect ±3 m on the
 *    crown and ±4 m on the annex.
 *  - estimated: the lantern's size (≈ 15 m across flats, from its face width
 *    against the shaft) and that it is centred on the shaft; the north
 *    extent of the rear wing (no photo shows it from the north); the annex
 *    split line. Heights are from Michigan Avenue's upper level.
 *  - colour: grey-buff Indiana limestone throughout, pulled to the palette.
 *
 * Photos (Wikimedia Commons): Chicago_in_2022_Tribune_Tower_(52053649770).jpg
 * (Chris Rycroft, CC BY 2.0); 20070513_Tribune_Tower.JPG (TonyTheTiger,
 * CC BY-SA 3.0); 20180427_Tribune_Tower_property_from_eastern_edge_(1).jpg
 * (TonyTheTiger, CC BY-SA 4.0); Chicago_Tribune_Tower_(47090586914).jpg
 * (Bex Walton, CC BY 2.0); 20190323_01_Tribune_Tower_(49490506182).jpg
 * (David Wilson, CC BY 2.0). USGS NAIP for the roof plan. No commercial
 * imagery.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const stone = new Part(), roof = new Part(), win = new Part(), shade = new Part(), door = new Part(), trim = new Part()

type XY = [number, number]
const ringAt = (pts: XY[], z: number): V3[] => pts.map(([x, y]) => [x, y, z])
function prism(p: Part, pts: XY[], z0: number, z1: number, top: Part | null = p) {
  p.loft([ringAt(pts, z0), ringAt(pts, z1)])
  if (top) top.cap(ringAt(pts, z1), true)
}
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
/** A rectangle with chamfered corners, counter-clockwise. */
const chamfered = (cx: number, cy: number, hx: number, hy: number, c: number): XY[] => [
  [cx - hx + c, cy - hy], [cx + hx - c, cy - hy], [cx + hx, cy - hy + c], [cx + hx, cy + hy - c],
  [cx + hx - c, cy + hy], [cx - hx + c, cy + hy], [cx - hx, cy + hy - c], [cx - hx, cy - hy + c],
]
/** A block with a small bevelled parapet lip, roof inside. */
function block(pts: XY[], z1: number, lip = 0.35) {
  prism(stone, pts, 0, z1 - 0.6, null)
  // Chamfer: a short sloped band to a slightly smaller ring.
  const r0 = ringAt(pts, z1 - 0.6), r1 = ringAt(insetRing(pts, lip), z1)
  stone.loft([r0, r1])
  roof.cap(r1, true)
}
/** Offset a convex counter-clockwise ring inward by d. */
function insetRing(pts: XY[], d: number): XY[] {
  const n = pts.length
  const lines = pts.map((a, i) => {
    const b = pts[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
    const nx = -dy / l, ny = dx / l // inward for CCW
    return { p: [a[0] + nx * d, a[1] + ny * d] as XY, d: [dx / l, dy / l] as XY }
  })
  return pts.map((_, i) => {
    const L1 = lines[(i - 1 + n) % n], L2 = lines[i]
    const den = L1.d[0] * L2.d[1] - L1.d[1] * L2.d[0]
    if (Math.abs(den) < 1e-9) return L2.p
    const t = ((L2.p[0] - L1.p[0]) * L2.d[1] - (L2.p[1] - L1.p[1]) * L2.d[0]) / den
    return [L1.p[0] + L1.d[0] * t, L1.p[1] + L1.d[1] * t]
  })
}

/** A flat panel on the wall of edge a→b (CCW ring, so outward is to the right). */
function panel(p: Part, a: XY, b: XY, u0: number, u1: number, z0: number, z1: number, off = 0.05) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l
  const nx = uy * off, ny = -ux * off
  const P = (u: number, z: number): V3 => [a[0] + ux * u + nx, a[1] + uy * u + ny, z]
  p.quad(P(u0, z0), P(u1, z0), P(u1, z1), P(u0, z1))
}
/** A round-arched panel: rectangle to `spring`, semicircle above. */
function archPanel(p: Part, a: XY, b: XY, uc: number, w: number, z0: number, z1: number, off = 0.06) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l
  const nx = uy * off, ny = -ux * off, r = w / 2, spring = z1 - r
  const P = (u: number, z: number): V3 => [a[0] + ux * u + nx, a[1] + uy * u + ny, z]
  const pts: V3[] = [P(uc - r, z0), P(uc + r, z0)]
  for (let k = 0; k <= 8; k++) { const t = (k * Math.PI) / 8; pts.push(P(uc + r * Math.cos(t), spring + r * Math.sin(t))) }
  for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1])
}
/** A pointed (Gothic) arched panel. */
function lancet(p: Part, a: XY, b: XY, uc: number, w: number, z0: number, z1: number, off = 0.06) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l
  const nx = uy * off, ny = -ux * off, spring = z1 - w * 0.8
  const P = (u: number, z: number): V3 => [a[0] + ux * u + nx, a[1] + uy * u + ny, z]
  const pts: V3[] = [P(uc - w / 2, z0), P(uc + w / 2, z0), P(uc + w / 2, spring), P(uc + w / 4, spring + (z1 - spring) * 0.75), P(uc, z1), P(uc - w / 4, spring + (z1 - spring) * 0.75), P(uc - w / 2, spring)]
  for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1])
}
/** A square pier with a pyramid cap: the Gothic pinnacle, as a bold block. */
function pinnacle(p: Part, x: number, y: number, h: number, z0: number, z1: number, cap: number) {
  const r = rect(x - h, x + h, y - h, y + h)
  prism(p, r, z0, z1, null)
  const ring = ringAt(r, z1)
  for (let i = 0; i < 4; i++) p.tri(ring[i], ring[(i + 1) % 4], [x, y, z1 + cap])
}
const edges = (ring: XY[]) => ring.map((a, i) => [a, ring[(i + 1) % ring.length]] as [XY, XY])
const elen = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])

// ── The shaft ────────────────────────────────────────────────────────────
// OSM tower part: x -47.9..-17.6, y -33.0..-1.9, ~4.5 m chamfers.
const CX = -32.75, CY = -17.45, HX = 15.15, HY = 15.55, CH = 4.4
const shaft = chamfered(CX, CY, HX, HY, CH)
const SHAFT_TOP = 107.5, SCREEN_TOP = 114
prism(stone, shaft, 0, SHAFT_TOP, null)
// Balcony band at the top of the shaft, a bevelled projecting course.
{
  const out = insetRing(shaft, -0.35)
  stone.loft([ringAt(shaft, SHAFT_TOP - 0.8), ringAt(out, SHAFT_TOP - 0.4), ringAt(out, SHAFT_TOP), ringAt(shaft, SHAFT_TOP + 0.3)])
}
// The tracery screen: the shaft wall carried on up, pierced by lancets.
prism(stone, shaft, SHAFT_TOP + 0.3, SCREEN_TOP, null)
{
  const inner = insetRing(shaft, 0.8)
  // Top of the screen wall: a flat ring.
  const o = ringAt(shaft, SCREEN_TOP), i = ringAt(inner, SCREEN_TOP)
  for (let k = 0; k < 8; k++) { const l = (k + 1) % 8; stone.quad(i[k], o[k], o[l], i[l]) }
  roof.cap(ringAt(inner, SCREEN_TOP - 1.5), true)
  stone.loft([ringAt(inner, SCREEN_TOP).reverse(), ringAt(inner, SCREEN_TOP - 1.5).reverse()])
}
// A Gothic ornament belt low on the shaft (the band over the third floor).
{
  const out = insetRing(shaft, -0.25)
  trim.loft([ringAt(shaft, 16.5), ringAt(out, 17), ringAt(out, 19.5), ringAt(shaft, 20)])
}

// Window bays: piers between, groups of four floors with stone spandrels.
const GROUPS: [number, number][] = []
for (let z = 21.5; z + 14 <= 104; z += 15.3) GROUPS.push([z, z + 14])
GROUPS[GROUPS.length - 1][1] = 104
edges(shaft).forEach(([a, b], k) => {
  const L = elen(a, b)
  const main = k % 2 === 0
  const bays = main ? 7 : 1
  const pitch = L / bays, w = main ? 1.3 : 1.4
  for (let i = 0; i < bays; i++) {
    const uc = pitch * (i + 0.5)
    // Lower floors: punched windows under the ornament belt.
    if (!(main && k === 6 && Math.abs(uc - L / 2) < 3)) panel(win, a, b, uc - w / 2, uc + w / 2, 5, 15)
    for (const [z0, z1] of GROUPS) {
      if (z1 === 104) archPanel(win, a, b, uc, w, z0, z1)
      else panel(win, a, b, uc - w / 2, uc + w / 2, z0, z1)
    }
    // Screen openings between the piers.
    lancet(shade, a, b, uc, w * 1.15, SHAFT_TOP + 1.3, SCREEN_TOP - 0.8)
  }
})
// The west front's tall Gothic portal on Michigan Avenue.
{
  const [a, b] = edges(shaft)[6]
  const L = elen(a, b)
  lancet(trim, a, b, L / 2, 6.2, 0, 13, 0.08)
  lancet(door, a, b, L / 2, 4.2, 0, 10.5, 0.14)
}

// ── The crown ────────────────────────────────────────────────────────────
// Corner piers: on each main face, one near each end, rising to 127 m with
// pinnacle caps, and a lower one on each chamfer to 121 m.
const PW = 1.75
const inner: XY[] = []
for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
  // Face piers, one on the x-face and one on the y-face at this corner.
  const a: XY = [CX + sx * (HX - CH - 1.4), CY + sy * (HY - PW + 0.15)]
  const b: XY = [CX + sx * (HX - PW + 0.15), CY + sy * (HY - CH - 1.4)]
  for (const p of [a, b]) {
    pinnacle(stone, p[0], p[1], PW, SCREEN_TOP - 2, 129, 2.2)
    inner.push(p)
  }
  // Chamfer pier, square to the chamfer is close enough at this size.
  const c: XY = [CX + sx * (HX - CH / 2 + 0.2), CY + sy * (HY - CH / 2 + 0.2)]
  pinnacle(stone, c[0], c[1], 1.7, SCREEN_TOP - 2, 123.5, 2)
}

// A row of small pinnacles along the screen top, between the piers.
edges(shaft).forEach(([a, b], k) => {
  if (k % 2) return
  const L = elen(a, b), dx = (b[0] - a[0]) / L, dy = (b[1] - a[1]) / L
  for (const u of [0.3, 0.43, 0.57, 0.7]) {
    const x = a[0] + dx * L * u - dy * 0.5, y = a[1] + dy * L * u + dx * 0.5
    pinnacle(stone, x, y, 0.45, SCREEN_TOP - 0.5, SCREEN_TOP + 2.2, 2.2)
  }
})
// The octagonal lantern, centred on the shaft.
const R8 = 7.5 / Math.cos(Math.PI / 8)
const oct = (r: number): XY[] => Array.from({ length: 8 }, (_, i) => [CX + r * Math.cos(Math.PI / 8 + (i * Math.PI) / 4), CY + r * Math.sin(Math.PI / 8 + (i * Math.PI) / 4)])
const L8 = oct(R8)
prism(stone, L8, SCREEN_TOP - 1.5, 128, null)
// Tracery balustrade band, slightly proud, then the upper stage and parapet.
{
  const o = oct(R8 + 0.3)
  stone.loft([ringAt(L8, 128), ringAt(o, 128.4), ringAt(o, 132), ringAt(oct(R8 - 0.4), 132.4)])
  const up = oct(R8 - 0.4)
  prism(stone, up, 132.4, 135.4, null)
  stone.loft([ringAt(up, 135.4), ringAt(oct(R8 - 0.1), 135.8), ringAt(oct(R8 - 0.1), 136.4)])
  roof.cap(ringAt(oct(R8 - 0.1), 136.4), true)
  edges(o).forEach(([a, b]) => { const L = elen(a, b); for (const u of [L * 0.28, L * 0.72]) lancet(shade, a, b, u, 1.2, 128.9, 131.6) })
}
edges(L8).forEach(([a, b]) => {
  const L = elen(a, b)
  for (const u of [L * 0.32, L * 0.68]) archPanel(win, a, b, u, 1.5, 117, 126.5)
})
// Lantern corner buttresses rising to pinnacles over the parapet.
L8.forEach(([x, y]) => pinnacle(stone, x, y, 0.75, 128, 138.5, 2.5))
// A small central finial.
pinnacle(stone, CX, CY, 0.9, 136.4, 138, 3)

// Flying buttresses: from each face pier inward to the nearest lantern
// corner, a thick arched strut rising toward the lantern.
for (const p of inner) {
  let best = L8[0], bd = Infinity
  for (const q of L8) { const d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bd) { bd = d; best = q } }
  const dx = best[0] - p[0], dy = best[1] - p[1], l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l
  const px = -uy * 0.6, py = ux * 0.6
  const secs: V3[][] = []
  const N = 6
  for (let k = 0; k <= N; k++) {
    const t = k / N
    const x = p[0] + ux * (PW * 0.8) + dx * t * (1 - (PW * 0.8 + 0.5) / l), y = p[1] + uy * (PW * 0.8) + dy * t * (1 - (PW * 0.8 + 0.5) / l)
    const top = 124 + 3 * t
    const bot = top - 1.2 - 2.6 * Math.sin(Math.PI * t) * 0.9 - (1 - t) * 0.2
    secs.push([[x - px, y - py, bot], [x + px, y + py, bot], [x + px, y + py, top], [x - px, y - py, top]])
  }
  stone.sweep(secs)
}

// ── The rear wing, east of the shaft ─────────────────────────────────────
{
  const x0 = -18.6, x1 = -2.5, y0 = -32.9, y1 = -9.5, top = 84
  block(rect(x0, x1, y0, y1), top)
  for (const [x, y] of [[x0 + 1.2, y0 + 1.2], [x1 - 1.2, y0 + 1.2], [x1 - 1.2, y1 - 1.2], [x0 + 1.2, y1 - 1.2]] as XY[])
    pinnacle(stone, x, y, 1.15, top - 6, top + 4.5, 3)
  // Small gables between the turrets on the south and north ends.
  for (const [y, s] of [[y0, -1], [y1, 1]] as [number, number][]) {
    const m = (x0 + x1) / 2, yy = y - s * 0.6
    const q: V3[] = [[m - 4, yy, top], [m + 4, yy, top], [m, yy, top + 5]]
    if (s < 0) stone.tri(q[0], q[1], q[2]); else stone.tri(q[1], q[0], q[2])
  }
  const ring = rect(x0, x1, y0, y1)
  edges(ring).forEach(([a, b], k) => {
    if (k === 3) return // the west wall meets the shaft
    const L = elen(a, b), bays = Math.max(2, Math.round(L / 3.4)), pitch = L / bays
    for (let i = 0; i < bays; i++) {
      const uc = pitch * (i + 0.5)
      if (k !== 2) panel(win, a, b, uc - 0.7, uc + 0.7, 5, 15)
      for (const [z0, z1] of GROUPS) if (z1 < top - 4) panel(win, a, b, uc - 0.7, uc + 0.7, z0, z1)
      archPanel(win, a, b, uc, 1.4, GROUPS[GROUPS.length - 2][1] + 1.3, top - 3.5)
    }
  })
}

// ── The annex blocks (Tribune plant, 1920; Michigan Avenue north wing) ─────
function facade(ring: XY[], top: number, skip: (k: number) => boolean, floors = 3.9) {
  edges(ring).forEach(([a, b], k) => {
    if (skip(k)) return
    const L = elen(a, b), bays = Math.max(1, Math.round(L / 4.2)), pitch = L / bays
    for (let i = 0; i < bays; i++) {
      const uc = pitch * (i + 0.5)
      for (let z = 5; z + floors * 2 <= top - 2; z += floors * 2 + 0.01) panel(win, a, b, uc - 1.1, uc + 1.1, z, z + floors * 2 - 1.2)
    }
  })
}
const southAnnex = rect(-2.5, 43.8, -33.1, 0)
block(southAnnex, 32)
facade(southAnnex, 32, (k) => k === 3 || k === 2)
const link = rect(-18.6, -2.5, -9.5, 0)
block(link, 32)
const northBlock: XY[] = [[-26.4, -2.0], [-17.6, -2.0], [-17.6, 0], [43.7, 0], [43.6, 33.5], [-26.4, 33.4]]
block(northBlock, 40)
facade(northBlock, 40, (k) => k < 3 || k === 5)
const northWing = rect(-47.2, -26.4, 11.6, 33.35)
block(northWing, 25)
facade(northWing, 25, (k) => k === 1)

const parts = [
  { part: stone, material: finish('tribune-limestone', 0xe7dfd1) },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: shade, material: finish('tracery-shadow', 0x6b6f75) },
  { part: door, material: PALETTE.entrance },
]
const triangles = parts.reduce((s, p) => s + p.part.triangles, 0)
const glb = writeGlb('Tribune Tower', parts, {
  frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [41.89055, -87.623308], bearing: 358.4,
})
if (triangles > 6500 || glb.length > 250000) throw new Error(`Budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
const out = process.argv[2] ?? new URL('../models/chi-tribune-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
