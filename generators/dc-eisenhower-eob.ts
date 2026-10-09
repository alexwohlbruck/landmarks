/**
 * Eisenhower Executive Office Building — procedural, CC0-1.0, no textures.
 * bun generators/dc-eisenhower-eob.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0°, the outline's walls
 * running due north–south and east–west. The anchor is the centroid of the
 * OSM outline relation/4043910 (lng -77.038705, lat 38.897580). The plan is
 * drawn symmetrical about x = 0 and y = OY (0.5 m), the outline's own centre
 * line, except for the porches that OSM shows as different on each front.
 *
 * What it is: Mullett's French Second Empire block (1871–88) round two
 * courtyards, a "figure of eight" of wings 21 m deep: grey granite in a
 * rusticated basement and four storeys, each with its own entablature and
 * engaged columns, under steep dark slate mansards. Taller mansards crown
 * the four corner pavilions and the pavilion in the middle of each front;
 * the inner corners carry the stair halls' roofs with their round
 * skylights; granite chimney stacks stand at the pavilions' shoulders. The
 * mansards, their dormers and the stacked storeys are the identity, so they
 * are drawn big; the cresting and carving are left out.
 *
 * Covers and replaces: the outline relation only. Its three courtyard
 * buildings (way/1444818995, 1444818996, 1444818997, untagged infill) are
 * separate buildings sitting in the courtyards, which the model leaves open,
 * so they are not replaced. The paint proposal: in 2025–26 the
 * administration proposed painting the granite white; NCPC asked for tests
 * (May 2026) and a judge declined to stop test painting (August 2026), but
 * the June 2026 aerial photo below shows the building still grey. It is
 * modelled as it stands, in grey granite.
 *
 * Evidence
 * - OSM (measured): relation/4043910, 87.6 × 155.3 m with two courtyards
 *   (30.3 × 41.2 m and 30.3 × 41.7 m), so wings 21 m deep and a 20 m centre
 *   wing. The pavilions' projections are read off the outline: corner
 *   pavilions out to x = ±43.6 on the long fronts, centre pavilions of the
 *   long fronts 2.7 m (west) and 6.6 m (east) out, intermediate pavilions
 *   3.5 m out, the north and south centre pavilions 2.7 m and 6.5 m out.
 *   building:levels 6, roof:shape many.
 * - Published: NCPC staff report, May 2026 (8777, EEOB Exterior
 *   Beautification Project): "approximately 520 feet long by 285 feet
 *   wide", "top rooftop elevation of 134 feet" (40.8 m), six storeys, grey
 *   granite walls, slate mansard roofs, cast-iron chimneys. Wikipedia: built
 *   1871–88, Alfred B. Mullett.
 * - Photos (Wikimedia Commons): "Eisenhower Executive Office Building from
 *   above Washington DC 2026-06-08 13-35-32.jpg" (G. Edward Johnson, CC BY
 *   4.0), from the south-east and above; "Eisenhower Executive Office
 *   Building viewed from 17th Street.jpg" (APK, CC BY 4.0, March 2026), the
 *   west front; "Eisenhower Executive Office Building exterior from the
 *   southeast.jpg" (Sdkb, CC BY-SA 4.0); "Eisenhower Executive Office
 *   Building 2021.jpg" (Abovfold, CC BY-SA 4.0).
 * - USGS NAIP orthophoto (public domain): the roof plan — slate slopes on
 *   every outer and courtyard face, grey-green flat decks between, the
 *   stair-hall roofs with round skylights at the courtyards' outer corners
 *   (13 m square), the chimney tops at the pavilions.
 * - Estimated from the photos against the published 40.8 m: rusticated
 *   basement to 4.8 m, four 5.4 m storeys to the main cornice at 27.6 m;
 *   wing mansards to 33.8 m, pavilion mansards to 36.6 m, stair-hall roofs
 *   to 37.5 m, chimneys to 40.8 m. Bay pitch about 3.7 m.
 * - Colour: the storey entablatures, main cornice and pavilion columns use a
 *   lighter granite tone than the wall, as their sunlit faces read in the
 *   photos, so the stacked storeys show at map scale.
 * - Simplified: paired columns are pilaster strips on the pavilions; the
 *   porches are one storey of free columns on a podium, on the north,
 *   south and east centre pavilions only (the upper porch storeys and the
 *   south front's grand stair are left out); the courtyard walls are plain; the west front's recesses beside its centre pavilion are
 *   filled in; dormers stand on the outer faces only, one to every other
 *   bay; the roof cresting is left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cbox, cylinder, grow, hip, panel, qf, rect, save, tf, type Rect, type Side } from './dc-white-house'

const granite = new Part(), ledge = new Part(), slate = new Part(), deck = new Part(), win = new Part(), door = new Part()

const OY = 0.5 // the plan's centre line, north of the anchor
const Y = (v: number) => OY + v

// ---- Plan (half extents about x = 0, y = OY).
const XO = 36.0 // long fronts' wall line
const YO = 72.8 // end fronts' wall line
const XC = 15.1, YC0 = 9.9, YC1 = 51.3 // courtyards: |x| < XC, YC0 < |y| < YC1

// ---- Heights.
const BASE = 4.8, STOREY = 5.4
const FLOORS = [BASE, BASE + STOREY, BASE + 2 * STOREY, BASE + 3 * STOREY]
const WALL = BASE + 4 * STOREY // 26.4
const CORNICE = 27.6
const WING_TOP = 33.8, PAV_TOP = 39.0, STAIR_TOP = 37.5, CHIMNEY = 40.8
const YE = YO - 1.2 // the end fronts' wall between their pavilions, set back

// ---- Masses: wing boxes and pavilion boxes. Walls only; tops are roofs.
type Mass = { r: Rect; pav: boolean; inset?: number }
const masses: Mass[] = []
const both = (f: (s: number) => void) => [-1, 1].forEach(f)
// Long wings (east and west) and the end wings and the centre wing.
both((s) => masses.push({ r: s < 0 ? rect(-XO, -XC, Y(-YE), Y(YE)) : rect(XC, XO, Y(-YE), Y(YE)), pav: false }))
both((s) => masses.push({ r: s < 0 ? rect(-XC, XC, Y(-YE), Y(-YC1)) : rect(-XC, XC, Y(YC1), Y(YE)), pav: false }))
masses.push({ r: rect(-XC, XC, Y(-YC0), Y(YC0)), pav: false })

// Pavilions. Corner pavilions, the centre pavilion of each front, and the
// intermediate pavilions of the long fronts.
const corner = (sx: number, sy: number) => {
  const xs = [sx * 27.5, sx * 40.5].sort((a, b) => a - b), ys = [Y(sy * 50.5), Y(sy * YO)].sort((a, b) => a - b)
  return rect(xs[0], xs[1], ys[0], ys[1])
}
for (const sx of [-1, 1]) for (const sy of [-1, 1]) masses.push({ r: corner(sx, sy), pav: true })
const PORCH = 3.2 // porch depth, inside the outline
const porchE = rect(XO - 6, 42.6 - PORCH, Y(-YC0 + 0.4), Y(YC0 - 0.4))
const centreW = rect(-38.7, -XO + 6, Y(-YC0 + 0.4), Y(YC0 - 0.4))
const centreN = rect(-10.0, 10.0, Y(YO - 6), 76.0 - PORCH)
const centreS = rect(-10.0, 10.0, -79.2 + PORCH, Y(-YO + 6))
masses.push({ r: porchE, pav: true }, { r: centreW, pav: true }, { r: centreN, pav: true }, { r: centreS, pav: true })
const inter: Rect[] = []
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const xs = [sx * (XO - 4), sx * 39.5].sort((a, b) => a - b), ys = [Y(sy * 17.0), Y(sy * 25.0)].sort((a, b) => a - b)
  inter.push(rect(xs[0], xs[1], ys[0], ys[1]))
}
// Corner pavilions' forward bays on the long fronts.
const cornerBay = (sx: number, sy: number) => {
  const xs = [sx * 40.4, sx * 43.6].sort((a, b) => a - b), ys = [Y(sy * 55.3), Y(sy * 67.5)].sort((a, b) => a - b)
  return rect(xs[0], xs[1], ys[0], ys[1])
}

// ---- Walls, basement, storey entablatures and main cornice for one mass.
function walls(r: Rect, top = WALL) {
  cbox(granite, r, 0, top, { top: false })
  // The rusticated basement ends in a band like the storeys above it.
  // Each storey's entablature: a projecting band.
  for (const z of FLOORS) cbox(ledge, grow(r, 0.55), z - 0.9, z, { top: false })
  // Main cornice, bevelled so it catches the light.
  cbox(ledge, grow(r, 0.75), top, CORNICE, { b: 0.3, bottom: true, top: false })
}
for (const m of masses) walls(m.r)
for (const r of inter) walls(r)
for (const sx of [-1, 1]) for (const sy of [-1, 1]) walls(cornerBay(sx, sy), WALL - STOREY)

// ---- Roofs. Mansard: a steep slate slope from the cornice, then a flat
// grey-green deck. Wings first, pavilions taller on top.
function mansard(r: Rect, top: number, steep: number, deckInset: number) {
  const base = grow(r, 0.3)
  hip(slate, base, CORNICE, top - 0.6, steep, false)
  const r1 = grow(base, -steep)
  hip(slate, r1, top - 0.6, top, deckInset, deck)
  // A thin granite curb where the slope breaks.
  cbox(granite, grow(r1, 0.12), top - 0.75, top - 0.6, { top: false, bottom: true })
}
/** A pavilion's tall convex mansard: it bulges out and rolls over to a small deck. */
function pavRoof(r: Rect, top: number) {
  const base = grow(r, 0.3), h = top - CORNICE
  const ring = (z: number, i: number) => {
    const ix = Math.min(i, (base.x1 - base.x0) / 2 - 0.6), iy = Math.min(i, (base.y1 - base.y0) / 2 - 0.6)
    return [[base.x0 + ix, base.y0 + iy, z], [base.x1 - ix, base.y0 + iy, z], [base.x1 - ix, base.y1 - iy, z], [base.x0 + ix, base.y1 - iy, z]] as V3[]
  }
  const rings = [ring(CORNICE, 0), ring(CORNICE + h * 0.45, 0.45), ring(CORNICE + h * 0.8, 1.4), ring(top - 0.3, 2.7)]
  slate.loft(rings)
  cbox(granite, rect(rings[3][0][0] - 0.15, rings[3][1][0] + 0.15, rings[3][0][1] - 0.15, rings[3][2][1] + 0.15), top - 0.3, top, { top: deck, bottom: true })
}
for (const m of masses) if (m.pav) pavRoof(m.r, PAV_TOP); else mansard(m.r, WING_TOP, 1.9, 2.5)
for (const r of inter) pavRoof(r, PAV_TOP - 1.6)
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const r = cornerBay(sx, sy)
  cbox(granite, grow(r, 0.2), WALL - STOREY, WALL - STOREY + 0.6, { bottom: true, top: deck })
}

// Stair halls at the courtyards' outer corners: low pyramid roofs with a
// skylight lantern.
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const cx = sx * 22.0, cy = Y(sy * 51.5), h = 6.5
  const r = rect(cx - h, cx + h, cy - h, cy + h)
  cbox(slate, r, CORNICE, WING_TOP + 0.6, { top: false })
  cbox(granite, grow(r, 0.15), WING_TOP + 0.3, WING_TOP + 0.75, { top: false, bottom: true })
  hip(deck, r, WING_TOP + 0.75, STAIR_TOP - 1.3, 4.6)
  // The round skylight, drawn as a low square lantern.
  cbox(win, rect(cx - 1.8, cx + 1.8, cy - 1.8, cy + 1.8), STAIR_TOP - 1.4, STAIR_TOP - 0.4, { top: false })
  hip(deck, rect(cx - 2.0, cx + 2.0, cy - 2.0, cy + 2.0), STAIR_TOP - 0.4, STAIR_TOP, 1.4)
}

// ---- Facades. Windows a bay, a storey; pilaster strips on the pavilions.
const W = 2.0
function bays(a0: number, a1: number, pitch = 3.7) {
  const n = Math.max(1, Math.round((a1 - a0) / pitch)), step = (a1 - a0) / n
  return { centres: Array.from({ length: n }, (_, k) => a0 + step * (k + 0.5)), step }
}
function facade(side: Side, at: number, a0: number, a1: number, o: { pav?: boolean; storeys?: number; first?: number; basement?: boolean; pitch?: number } = {}) {
  const { centres, step } = bays(a0, a1, o.pitch)
  const storeys = o.storeys ?? 4
  for (const c of centres) {
    for (let k = o.first ?? 0; k < storeys; k++) {
      const z = FLOORS[k]
      panel(win, side, at, c - W / 2, c + W / 2, z + 0.5, z + STOREY - 1.3)
    }
  }
  if (o.pav) {
    // Engaged columns between the bays, from the basement to the cornice.
    for (let k = 0; k <= centres.length; k++) {
      const a = a0 + k * step, pw = 0.42
      block(ledge, side, at, Math.max(a0, a - pw), Math.min(a1, a + pw), BASE, FLOORS[0] + storeys * STOREY - 0.6, 0.32, false, false)
    }
  }
}
// Long fronts (west, mirrored east): wing walls between pavilions.
for (const s of [-1, 1]) {
  const side: Side = s < 0 ? 'w' : 'e', at = s * XO
  for (const sy of [-1, 1]) {
    const lo = (a: number, b: number) => [Y(sy * a), Y(sy * b)].sort((p, q) => p - q) as [number, number]
    facade(side, at, ...lo(YC0 - 0.4, 17.0))
    facade(side, at, ...lo(25.0, 50.5))
    // Intermediate pavilion front.
    facade(side, s * 39.5, ...lo(17.0, 25.0), { pav: true, pitch: 4 })
    // Corner pavilion: its long-front face either side of the forward bay,
    // the bay itself three storeys high.
    facade(side, s * 40.5, ...lo(50.5, 55.3), { pav: true })
    facade(side, s * 40.5, ...lo(67.5, YO), { pav: true })
    facade(side, s * 43.6, ...lo(55.3, 67.5), { pav: true, storeys: 3, pitch: 4 })
    facade(side, s * 40.5, ...lo(55.3, 67.5), { basement: false, first: 3, pitch: 4 })
  }
  // Centre pavilion.
  if (s < 0) facade('w', centreW.x0, centreW.y0, centreW.y1, { pav: true })
  else facade('e', porchE.x1, porchE.y0, porchE.y1, { pav: true })
}
// End fronts (north and south).
for (const sy of [-1, 1]) {
  const side: Side = sy < 0 ? 's' : 'n', at = Y(sy * YO), atE = Y(sy * YE)
  for (const sx of [-1, 1]) {
    const lo = (a: number, b: number) => [sx * a, sx * b].sort((p, q) => p - q) as [number, number]
    facade(side, atE, ...lo(10.0, 27.5))
    facade(side, at, ...lo(27.5, 40.5), { pav: true })
  }
  const c = sy < 0 ? centreS : centreN
  facade(side, sy < 0 ? c.y0 : c.y1, c.x0, c.x1, { pav: true })
}
// Courtyards: left plain. They are deep, narrow and seen only from above,
// and the file budget is better spent on the outer fronts.

// ---- Porches: free columns on the north, south and east centre
// pavilions' lowest storey, under a balcony slab.
function porch(side: Side, at: number, a0: number, a1: number, n: number) {
  const ns = side === 'n' || side === 's', sgn = side === 'n' || side === 'e' ? 1 : -1
  const d = PORCH - 0.8, step = (a1 - a0) / (n - 1)
  for (let k = 0; k < n; k++) {
    const a = a0 + k * step
    const [x, y] = ns ? [a, at + sgn * d] : [at + sgn * d, a]
    cylinder(granite, x, y, 0.42, BASE, FLOORS[1] - 0.6, 6)
  }
  const r = ns ? rect(a0 - 0.8, a1 + 0.8, Math.min(at, at + sgn * PORCH), Math.max(at, at + sgn * PORCH))
    : rect(Math.min(at, at + sgn * PORCH), Math.max(at, at + sgn * PORCH), a0 - 0.8, a1 + 0.8)
  cbox(granite, r, FLOORS[1] - 0.6, FLOORS[1], { b: 0.15, bottom: true })
  cbox(granite, r, 0, BASE, { top: true }) // the porch's podium
  // Doors at the back of the porch.
  panel(door, side, at, (a0 + a1) / 2 - 1.1, (a0 + a1) / 2 + 1.1, BASE, BASE + 4.0, 0.3)
}
porch('n', centreN.y1, -7.0, 7.0, 6)
porch('s', centreS.y0, -7.0, 7.0, 6)
porch('e', porchE.x1, porchE.y0 + 3, porchE.y1 - 3, 4)

// ---- Dormers on the mansards' outer faces, one to every other bay; one
// large pedimented dormer on each pavilion front.
function dormer(side: Side, at: number, a: number, w: number, h: number, big = false) {
  // `at`: the cornice line the mansard rises from.
  const n = side === 'n' || side === 's'
  const sgn = side === 'n' || side === 'e' ? 1 : -1
  const z0 = CORNICE + 0.2, z1 = z0 + h
  const front = at - sgn * 0.35, back = at - sgn * 2.6
  const r = n ? rect(a - w / 2, a + w / 2, Math.min(front, back), Math.max(front, back))
    : rect(Math.min(front, back), Math.max(front, back), a - w / 2, a + w / 2)
  cbox(granite, r, z0, z1, { top: false })
  panel(win, side, front, a - w * 0.28, a + w * 0.28, z0 + 0.5, z1 - 0.5)
  // A small pediment roof.
  const apex = z1 + (big ? 1.6 : 0.9)
  const e = 0.15
  if (n) {
    const y0 = Math.min(front, back) - e, y1 = Math.max(front, back) + e
    qf(slate, [a - w / 2 - e, y0, z1], [a - w / 2 - e, y1, z1], [a, y1, apex], [a, y0, apex], [-1, 0, 1])
    qf(slate, [a + w / 2 + e, y0, z1], [a + w / 2 + e, y1, z1], [a, y1, apex], [a, y0, apex], [1, 0, 1])
    tf(granite, [a - w / 2 - e, front + sgn * e, z1], [a + w / 2 + e, front + sgn * e, z1], [a, front + sgn * e, apex], [0, sgn, 0])
  } else {
    const x0 = Math.min(front, back) - e, x1 = Math.max(front, back) + e
    qf(slate, [x0, a - w / 2 - e, z1], [x1, a - w / 2 - e, z1], [x1, a, apex], [x0, a, apex], [0, -1, 1])
    qf(slate, [x0, a + w / 2 + e, z1], [x1, a + w / 2 + e, z1], [x1, a, apex], [x0, a, apex], [0, 1, 1])
    tf(granite, [front + sgn * e, a - w / 2 - e, z1], [front + sgn * e, a + w / 2 + e, z1], [front + sgn * e, a, apex], [sgn, 0, 0])
  }
}
function dormers(side: Side, at: number, a0: number, a1: number) {
  const { centres } = bays(a0, a1)
  centres.forEach((c, k) => { if (k % 2 === (centres.length > 2 ? 1 : 0)) dormer(side, at, c, 2.3, 3.2) })
}
for (const s of [-1, 1]) {
  const side: Side = s < 0 ? 'w' : 'e'
  for (const sy of [-1, 1]) {
    const lo = (a: number, b: number) => [Y(sy * a), Y(sy * b)].sort((p, q) => p - q) as [number, number]
    dormers(side, s * XO + s * 0.3, ...lo(25.0, 50.5))
    dormer(side, s * 39.5 + s * 0.3, Y(sy * 21.0), 2.6, 3.4, true)
    dormer(side, s * 40.5 + s * 0.3, Y(sy * 61.4), 2.8, 3.8, true)
  }
  dormer(side, s < 0 ? centreW.x0 - 0.3 : porchE.x1 + 0.3, Y(0), 3.2, 4.2, true)
}
for (const sy of [-1, 1]) {
  const side: Side = sy < 0 ? 's' : 'n', at = Y(sy * YE) + sy * 0.3
  for (const sx of [-1, 1]) {
    const lo = (a: number, b: number) => [sx * a, sx * b].sort((p, q) => p - q) as [number, number]
    dormers(side, at, ...lo(10.0, 27.5))
    dormer(side, Y(sy * YO) + sy * 0.3, sx * 34.0, 2.8, 3.8, true)
  }
  dormer(side, sy < 0 ? centreS.y0 - 0.3 : centreN.y1 + 0.3, 0, 3.2, 4.2, true)
}


// ---- Pediments: a granite gable on the cornice of each pavilion front,
// standing in front of its mansard.
function pediment(side: Side, at: number, a0: number, a1: number, z0: number, h: number) {
  const ns = side === 'n' || side === 's', sgn = side === 'n' || side === 'e' ? 1 : -1
  const am = (a0 + a1) / 2, f = at + sgn * 0.5, b = at - sgn * 3.0
  const P = (a: number, d: number, z: number): V3 => (ns ? [a, d, z] : [d, a, z])
  const n: V3 = ns ? [0, sgn, 0] : [sgn, 0, 0]
  tf(granite, P(a0, f, z0), P(a1, f, z0), P(am, f, z0 + h), n)
  const up0: V3 = ns ? [-h, 0, (a1 - a0) / 2] : [0, -h, (a1 - a0) / 2]
  const up1: V3 = ns ? [h, 0, (a1 - a0) / 2] : [0, h, (a1 - a0) / 2]
  qf(granite, P(a0, f, z0), P(am, f, z0 + h), P(am, b, z0 + h), P(a0, b, z0), up0)
  qf(granite, P(a1, f, z0), P(am, f, z0 + h), P(am, b, z0 + h), P(a1, b, z0), up1)
}
for (const sy of [-1, 1]) {
  const side: Side = sy < 0 ? 's' : 'n'
  pediment(side, sy < 0 ? centreS.y0 : centreN.y1, -9.0, 9.0, CORNICE, 4.4)
  for (const sx of [-1, 1]) pediment(side, Y(sy * YO), sx < 0 ? -39.0 : 29.0, sx < 0 ? -29.0 : 39.0, CORNICE, 2.8)
}
for (const s of [-1, 1]) {
  const side: Side = s < 0 ? 'w' : 'e'
  pediment(side, s < 0 ? centreW.x0 : porchE.x1, Y(-8.5), Y(8.5), CORNICE, 4.2)
  for (const sy of [-1, 1]) {
    const ys = [Y(sy * 55.8), Y(sy * 67.0)].sort((a, b) => a - b)
    pediment(side, s * 43.6, ys[0], ys[1], WALL - STOREY + 0.6, 2.4)
  }
}

// ---- Chimneys: granite stacks at the pavilions' shoulders, to 40.8 m.
function stack(cx: number, cy: number, alongX: boolean) {
  const r = alongX ? rect(cx - 1.7, cx + 1.7, cy - 1.0, cy + 1.0) : rect(cx - 1.0, cx + 1.0, cy - 1.7, cy + 1.7)
  cbox(granite, r, CORNICE, CHIMNEY - 1.0, { top: false })
  cbox(granite, grow(r, 0.25), CHIMNEY - 1.0, CHIMNEY, {})
}
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  // Corner pavilions: one stack on each inner shoulder.
  stack(sx * 27.2, Y(sy * 61.5), false)
  stack(sx * 34.0, Y(sy * 50.2), true)
  // End-front centre pavilions: a stack either side.
  stack(sx * 10.3, Y(sy * 69.5), false)
  // Long-front centre pavilions.
  stack(sx * 33.0, Y(sy * 10.0), true)
}

console.log({granite: granite.triangles, slate: slate.triangles, deck: deck.triangles, win: win.triangles, door: door.triangles})
await save('dc-eisenhower-eob', 'Eisenhower Executive Office Building', [
  { part: granite, material: finish('eeob-granite', 0xc8c5bf) },
  { part: ledge, material: finish('eeob-cornice', 0xe2dfd9) },
  { part: slate, material: finish('eeob-slate', 0x6a7078) },
  { part: deck, material: finish('eeob-roof-deck', 0x9fadaa) },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
], { bearing: 0, osm: 'relation/4043910', footprint: [87.6, 155.3], height: CHIMNEY }, 6500)
