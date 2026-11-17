/**
 * Natural History Museum, Cromwell Road, London (Alfred Waterhouse, opened
 * 1881): original procedural geometry, CC0-1.0.
 * bun generators/london-natural-history-museum.ts
 *
 * Map frame, turned to BEARING 353: +y is model north = compass 353 deg, +x
 * is model east = compass 83 deg, along the Cromwell Road front, which faces
 * model south; z up, metres. Origin = the area centroid of the OSM outline
 * way/24436446 (-0.176209, 51.496485), on the ground. The front is symmetric
 * about x = -19.9 (AX). y = 0 is the forecourt and Cromwell Road pavement
 * (lidar: 2.4 m above the box's ground_min, which is in the sunken garden
 * west of the front).
 *
 * What was chosen. The OSM outline way/24436446 is one way taking in the
 * whole island: Waterhouse's building (the Cromwell Road front, the Hintze
 * Hall and the top-lit galleries behind), the later blocks to the north, and
 * the former Geological Museum / Earth Galleries block on Exhibition Road
 * (east, x 57..152). The model replaces that outline, so it must fill it:
 * the Waterhouse building is modelled in detail; the later blocks behind and
 * to the east are plain massing at their lidar heights in Portland stone and
 * glass. The Darwin Centre (way/4959883) is a separate outline and is not
 * included.
 *
 * What makes it the NHM, and how each is drawn
 * - The two central towers (9 m square, body to 35.5 m, gallery, a belfry
 *   stage with corner pinnacles, then the steep banded square spire to
 *   56.5 m and the finial to 58), flanking the central gable over the great
 *   round-arched entrance: a real recessed arch with stepped orders, the
 *   twin doors deep inside it, the arcaded gallery and the gable window.
 * - The end pavilions (17 x 23 m) with their tall banded hipped roofs and
 *   corner turrets.
 * - The long ranges between: three storeys of round-arched windows in ten
 *   bays a side between buttress piers, a dormer gable per bay, the grey
 *   slate roof behind.
 * - The materials: buff terracotta with broad blue-grey terracotta bands at
 *   the plinth and storey lines (grouped, not every course), grey slate
 *   roofs, light slate bands on the spires and pavilion roofs.
 * - Behind: the Hintze Hall roof running north from the central gable to the
 *   two rear towers; the top-lit galleries' glazed ridges either side.
 * - Night: the front is floodlit (buff and blue carry _FLOODLIGHT on south
 *   faces); windows glow; the gallery glazing stays dark.
 *
 * Evidence
 * - OSM (ODbL): outline way/24436446 (building=yes, Natural History Museum;
 *   no parts inside it). wikidata Q309388.
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0 (composite of flights ~2000-2022). Measured above the forecourt
 *   (the lidar sits ~2 m south and ~2 m east of the OSM outline; the OSM plan
 *   was followed): front range eaves 19.5, ridge 26.8, dormer gables 23.6 at
 *   ~7.4 m spacing; end pavilions walls ~28.5, roof 48.4; central towers'
 *   belfry edges 43.5, spire DSM max 55.0 (the 1 m grid misses the tip);
 *   central gable 32.3; Hintze Hall ridge 26.7 at the south end, 21 at the
 *   north; rear towers 46 (drawn: banded towers to 33.5 with banded
 *   hipped roofs to 46, like the pavilions); galleries 11 with ridges to 15.5 at 20 m spacing;
 *   west range 28-31; north blocks 12.5, the two tall north blocks 32-32.7;
 *   east (Geological Museum) block 27, its Cromwell Road block 21, 23.7 on
 *   Exhibition Road.
 * - Published: front ~206 m long (OSM front 207 m); central towers ~58 m
 *   (Wikipedia "Natural History Museum, London"; Historic England list entry
 *   1358166 for the Waterhouse building).
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Natural History Museum London Jan 2006.jpg", Diliff, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Natural_History_Museum_London_Jan_2006.jpg
 *     (the whole front, level panorama: bays, storeys, towers, pavilions);
 *   "Natural History Museum London South Facade 2020 01.jpg", Julian Herzog,
 *     CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:Natural_History_Museum_London_South_Facade_2020_01.jpg
 *     (towers from the south-west: stage proportions, spires);
 *   "Natural History Museum London South Facade 2020 02.jpg", Julian Herzog,
 *     CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:Natural_History_Museum_London_South_Facade_2020_02.jpg
 *     (towers, central arch, west pavilion roof bands, dormer gables);
 *   "The Natural History Museum and The Royal Albert Hall from the air
 *     (geograph 4641862).jpg", Thomas Nugent, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:The_Natural_History_Museum_and_The_Royal_Albert_Hall_from_the_air_(geograph_4641862).jpg
 *     (from the air, south: roofs, galleries, the blocks behind);
 *   "Kensington Museums aerial 2011 a.jpg", Andreas Praefcke, public domain,
 *     https://commons.wikimedia.org/wiki/File:Kensington_Museums_aerial_2011_a.jpg
 *     (from the air, south-west: Hintze Hall roof, rear towers, galleries,
 *     east block).
 * - Look-only: none.
 *
 * Estimated (from the photos against the lidar): tower stage lines and
 * window groups, the belfry and spire split (35.5 / 44.5 / 56.5), the arch
 * (opening 8 m, springing 8.5 m, three orders), the range storeys and bay
 * count (10 a side), the band levels, the dormers' shape, the rear towers'
 * plan (5 m square), the gallery ridge widths.
 *
 * Doubts
 * - The blocks behind the front are drawn from the lidar and two aerials
 *   only: stone walls with grouped windows, parapets and grey flat roofs, or
 *   (the two 32 m north blocks) hipped slate roofs whose ridge is the lidar
 *   top. Those two rise above the front ridge (26.8) in the lidar; from
 *   Cromwell Road they are hidden behind it. Their facades are generic.
 * - The Geological Museum's Cromwell Road block is drawn in stone with
 *   grouped windows (lead review); its real front is partly glazed.
 * - The lidar's grid sits ~2 m off the OSM outline; heights were read where
 *   the lidar's own edges put each part.
 * - Sculpture, the iron roof cresting, the gallery tracery and the terracotta
 *   ornament are left out; the forecourt ramps and steps are not modelled.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'

export const BEARING = 353
const ID = 'london-natural-history-museum'
const AX = -19.9 // the front's axis of symmetry
const X = (u: number) => AX + u
const TAU = Math.PI * 2

// ---------------------------------------------------------------------------
// Face frames: o on the face, u along it, n out of it
// ---------------------------------------------------------------------------
type Frame = { o: V3; u: V3; n: V3 }
const F = (f: Frame, s: number, z: number, d: number): V3 => [f.o[0] + f.u[0] * s + f.n[0] * d, f.o[1] + f.u[1] * s + f.n[1] * d, f.o[2] + z]
/** South face at y (s = model x), north face (s = -x), east (s = y), west (s = -y). */
const south = (y: number): Frame => ({ o: [0, y, 0], u: [1, 0, 0], n: [0, -1, 0] })
const north = (y: number): Frame => ({ o: [0, y, 0], u: [-1, 0, 0], n: [0, 1, 0] })
const east = (x: number): Frame => ({ o: [x, 0, 0], u: [0, 1, 0], n: [1, 0, 0] })
const west = (x: number): Frame => ({ o: [x, 0, 0], u: [0, -1, 0], n: [-1, 0, 0] })

function panel(p: Part, f: Frame, s0: number, s1: number, z0: number, z1: number, d = 0.06) {
  p.quad(F(f, s0, z0, d), F(f, s1, z0, d), F(f, s1, z1, d), F(f, s0, z1, d))
}
function archPanel(p: Part, f: Frame, sc: number, w: number, z0: number, zs: number, d = 0.06, n = 4) {
  const r = w / 2
  panel(p, f, sc - r, sc + r, z0, zs, d)
  const c = F(f, sc, zs, d)
  for (let i = 0; i < n; i++) {
    const a0 = (Math.PI * i) / n, a1 = (Math.PI * (i + 1)) / n
    p.tri(c, F(f, sc + r * Math.cos(a0), zs + r * Math.sin(a0), d), F(f, sc + r * Math.cos(a1), zs + r * Math.sin(a1), d))
  }
}
/** A block standing on a face: s0..s1, z0..z1, d0..d1 out. Front, ends, top (soffit optional). */
function proud(p: Part, f: Frame, s0: number, s1: number, z0: number, z1: number, d0: number, d1: number, o: { bottom?: boolean; top?: boolean; ends?: boolean } = {}) {
  const P = (s: number, z: number, d: number) => F(f, s, z, d)
  p.quad(P(s0, z0, d1), P(s1, z0, d1), P(s1, z1, d1), P(s0, z1, d1))
  if (o.top !== false) p.quad(P(s0, z1, d1), P(s1, z1, d1), P(s1, z1, d0), P(s0, z1, d0))
  if (o.ends !== false) {
    p.quad(P(s0, z0, d0), P(s0, z0, d1), P(s0, z1, d1), P(s0, z1, d0))
    p.quad(P(s1, z0, d1), P(s1, z0, d0), P(s1, z1, d0), P(s1, z1, d1))
  }
  if (o.bottom) p.quad(P(s0, z0, d0), P(s1, z0, d0), P(s1, z0, d1), P(s0, z0, d1))
}

const ring = (x0: number, y0: number, x1: number, y1: number, z: number, c = 0): V3[] => c > 0
  ? [[x0 + c, y0, z], [x1 - c, y0, z], [x1, y0 + c, z], [x1, y1 - c, z], [x1 - c, y1, z], [x0 + c, y1, z], [x0, y1 - c, z], [x0, y0 + c, z]]
  : [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
/** A box, chamfered vertical edges c, top optional, no bottom. */
function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, c = 0.3, top = true) {
  p.loft([ring(x0, y0, x1, y1, z0, c), ring(x0, y0, x1, y1, z1, c)])
  if (top) p.cap(ring(x0, y0, x1, y1, z1, c), true)
}
/** A band round a box: a proud ring d out, z0..z1, with its top ledge. */
function boxBand(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, d: number) {
  const o = ring(x0 - d, y0 - d, x1 + d, y1 + d, 0)
  p.loft([o.map(([x, y]) => [x, y, z0] as V3), o.map(([x, y]) => [x, y, z1] as V3)])
  const i = ring(x0, y0, x1, y1, 0)
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    p.quad([i[k][0], i[k][1], z1], [o[k][0], o[k][1], z1], [o[l][0], o[l][1], z1], [i[l][0], i[l][1], z1])
  }
}
/** A hipped roof from a rectangle at z0 to a ridge at z1 inset by (ix, iy). */
function hip(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, ix: number, iy: number) {
  const b = ring(x0, y0, x1, y1, z0), t = ring(x0 + ix, y0 + iy, x1 - ix, y1 - iy, z1)
  p.loft([b, t])
  if (x1 - ix - (x0 + ix) > 0.01 && y1 - iy - (y0 + iy) > 0.01) p.cap(t, true)
}
/** A square pyramid (or frustum) centred at (cx, cy). */
function pyramid(p: Part, cx: number, cy: number, h0: number, z0: number, h1: number, z1: number) {
  const r = (h: number, z: number): V3[] => [[cx - h, cy - h, z], [cx + h, cy - h, z], [cx + h, cy + h, z], [cx - h, cy + h, z]]
  if (h1 <= 0.001) {
    const b = r(h0, z0)
    for (let k = 0; k < 4; k++) p.tri(b[k], b[(k + 1) % 4], [cx, cy, z1])
  } else p.loft([r(h0, z0), r(h1, z1)])
}
/** An octagonal pinnacle: shaft and spirelet. */
function pinnacle(shaft: Part, cap: Part, cx: number, cy: number, r: number, z0: number, z1: number, tip: number) {
  const n = 6, at = (rr: number, z: number) => Array.from({ length: n }, (_, i): V3 => [cx + rr * Math.cos((i + 0.5) / n * TAU), cy + rr * Math.sin((i + 0.5) / n * TAU), z])
  shaft.loft([at(r, z0), at(r, z1)])
  const b = at(r * 1.1, z1)
  for (let i = 0; i < n; i++) cap.tri(b[i], b[(i + 1) % n], [cx, cy, tip])
  cap.loft([at(r * 1.1, z1 - 0.3), b])
}
/** A gabled roof along y (ridge at x = xc) or along x (ridge at y = yc), with end gables in `gable`. */
function gableY(roof: Part, gable: Part | null, x0: number, x1: number, y0: number, y1: number, ze: number, zr: number) {
  const xc = (x0 + x1) / 2
  roof.quad([x0, y0, ze], [xc, y0, zr], [xc, y1, zr], [x0, y1, ze])
  roof.quad([xc, y0, zr], [x1, y0, ze], [x1, y1, ze], [xc, y1, zr])
  if (gable) {
    gable.tri([x0, y0, ze], [x1, y0, ze], [xc, y0, zr])
    gable.tri([x1, y1, ze], [x0, y1, ze], [xc, y1, zr])
  }
}
function gableX(roof: Part, gable: Part | null, x0: number, x1: number, y0: number, y1: number, ze: number, zr: number) {
  const yc = (y0 + y1) / 2
  roof.quad([x0, y0, ze], [x1, y0, ze], [x1, yc, zr], [x0, yc, zr])
  roof.quad([x0, yc, zr], [x1, yc, zr], [x1, y1, ze], [x0, y1, ze])
  if (gable) {
    gable.tri([x0, y1, ze], [x0, y0, ze], [x0, yc, zr])
    gable.tri([x1, y0, ze], [x1, y1, ze], [x1, yc, zr])
  }
}

// ---------------------------------------------------------------------------
// Materials
// ---------------------------------------------------------------------------
const lit = (p: V3, n: V3) => (p[1] < -30 && n[1] < -0.3 && p[2] < 60 ? 0.85 * (1 - Math.min(1, p[2] / 70)) + 0.15 : 0)
const M = {
  buff: { ...finish('nhm-buff', 0xe0c79f), floodlight: lit } as MaterialSpec,
  blue: { ...finish('nhm-blue', 0x9ea7ae), floodlight: lit } as MaterialSpec,
  slate: finish('nhm-slate', 0x80878f) as MaterialSpec,
  stone: PALETTE.stone as MaterialSpec,
  window: PALETTE.window as MaterialSpec,
  glass: PALETTE.glass as MaterialSpec,
}
const buff = new Part(), blue = new Part(), slate = new Part(), stone = new Part(), win = new Part(), glass = new Part()

// ---------------------------------------------------------------------------
// Plan (u = x - AX)
// ---------------------------------------------------------------------------
const YF = -52.8 // range front
const YB = -36 // range back
const YC = -60.5 // central block and tower fronts
const T0 = 6.75, T1 = 15.75 // towers between |u| = T0..T1
const RANGE = 86.7 // ranges run |u| = T1..RANGE
const P0 = 86.9, P1 = 103.75, PY0 = -55.6, PY1 = -33 // pavilions
const EAVE = 19.5, RIDGE = 26.8

// ---------------------------------------------------------------------------
// Front ranges
// ---------------------------------------------------------------------------
const BAYS = 10
for (const side of [-1, 1]) {
  const ua = side < 0 ? -RANGE : T1, ub = side < 0 ? -T1 : RANGE
  const x0 = X(ua), x1 = X(ub)
  box(buff, x0, YF, x1, YB, 0, EAVE, 0, false)
  // slate roof: front and back slopes to a ridge; end gables hidden in pavilion and tower
  const yr = (YF + YB) / 2
  slate.quad([x0, YF, EAVE], [x1, YF, EAVE], [x1, yr, RIDGE], [x0, yr, RIDGE])
  slate.quad([x0, yr, RIDGE], [x1, yr, RIDGE], [x1, YB, EAVE], [x0, YB, EAVE])
  const fs = south(YF)
  // blue-grey plinth and storey bands, the buff cornice
  proud(blue, fs, x0, x1, 0, 1.6, 0, 0.25, { ends: false })
  proud(blue, fs, x0, x1, 6.6, 7.6, 0, 0.18, { ends: false })
  proud(blue, fs, x0, x1, 13.3, 14.3, 0, 0.18, { ends: false })
  proud(buff, fs, x0, x1, 18.7, EAVE, -0.1, 0.55, { ends: false, bottom: true })
  const bw = (ub - ua) / BAYS
  for (let b = 0; b < BAYS; b++) {
    const sc = X(ua + bw * (b + 0.5))
    // ground floor: a two-light arched window; first floor: a pair of tall arches; second: a small pair
    archPanel(win, fs, sc, 2.8, 2.4, 5.2)
    archPanel(win, fs, sc - 1.0, 1.5, 8.4, 11.9)
    archPanel(win, fs, sc + 1.0, 1.5, 8.4, 11.9)
    archPanel(win, fs, sc, 2.4, 15.0, 16.9)
    // buttress pier at the bay's left edge
    const sp = X(ua + bw * b)
    if (b > 0) proud(buff, fs, sp - 0.45, sp + 0.45, 0, 18.7, 0, 0.45, { top: false })
    // dormer gable: a wall gable rising off the facade into the roof
    const g0 = sc - 1.9, g1 = sc + 1.9, ze = 21.8, za = 23.8, dep = 3.2
    const P = (s: number, z: number, d: number) => F(fs, s, z, d)
    buff.quad(P(g0, EAVE, 0.1), P(g1, EAVE, 0.1), P(g1, ze, 0.1), P(g0, ze, 0.1))
    buff.tri(P(g0, ze, 0.1), P(g1, ze, 0.1), P(sc, za, 0.1))
    slate.quad(P(g0 - 0.2, ze, 0.3), P(sc, za, 0.3), P(sc, za, -dep), P(g0 - 0.2, ze, -dep))
    slate.quad(P(sc, za, 0.3), P(g1 + 0.2, ze, 0.3), P(g1 + 0.2, ze, -dep), P(sc, za, -dep))
    for (const s of [g0, g1]) buff.quad(P(s, EAVE, 0.1), P(s, EAVE, -dep), P(s, ze, -dep), P(s, ze, 0.1))
    archPanel(win, fs, sc, 1.3, 20.0, 21.4, 0.16, 4)
  }
  // the back wall over the galleries: a window row
  const fn = north(YB)
  for (let b = 0; b < BAYS; b++) panel(win, fn, -X(ua + bw * (b + 0.5)) - 1.6, -X(ua + bw * (b + 0.5)) + 1.6, 13.5, 17.5)
}

// ---------------------------------------------------------------------------
// End pavilions
// ---------------------------------------------------------------------------
for (const side of [-1, 1]) {
  const x0 = X(side < 0 ? -P1 : P0), x1 = X(side < 0 ? -P0 : P1)
  const xc = (x0 + x1) / 2, wz = 28.5
  box(buff, x0, PY0, x1, PY1, 0, wz, 0.3, false)
  boxBand(blue, x0, PY0, x1, PY1, 0, 1.6, 0.25)
  boxBand(blue, x0, PY0, x1, PY1, 6.6, 7.6, 0.18)
  boxBand(blue, x0, PY0, x1, PY1, 13.3, 14.3, 0.18)
  boxBand(blue, x0, PY0, x1, PY1, 20.4, 21.4, 0.18)
  boxBand(buff, x0, PY0, x1, PY1, 27.6, wz, 0.5)
  // windows on the south face and the outer flank
  const fs = south(PY0)
  for (const k of [-1, 0, 1]) {
    archPanel(win, fs, xc + k * 4.6, 2.4, 2.4, 5.2)
    archPanel(win, fs, xc + k * 4.6, 2.4, 8.6, 12.0)
    archPanel(win, fs, xc + k * 4.6, 2.0, 15.0, 18.6)
    archPanel(win, fs, xc + k * 4.6, 1.6, 22.4, 25.6)
  }
  const ff = side < 0 ? west(x0) : east(x1), ym = (PY0 + PY1) / 2, s = side < 0 ? -ym : ym
  for (const k of [-1, 0, 1]) {
    archPanel(win, ff, s + k * 6, 2.4, 8.6, 12.0)
    archPanel(win, ff, s + k * 6, 2.0, 15.0, 18.6)
  }
  // corner turrets with spirelets
  for (const [cx, cy] of [[x0, PY0], [x1, PY0], [x0, PY1], [x1, PY1]]) pinnacle(buff, slate, cx, cy, 1.1, 20, wz + 3.0, wz + 7.0)
  // the tall banded hipped roof
  const zs = [wz, 34, 35.2, 41, 42, 48.4]
  const inset = (z: number) => (z - wz) / (48.4 - wz)
  for (let k = 0; k < zs.length - 1; k++) {
    const a = inset(zs[k]), b = inset(zs[k + 1]), part = k % 2 === 1 ? blue : slate
    const ix = (w: number, t: number) => t * (w / 2 - 0.4)
    const W = x1 - x0, D = PY1 - PY0
    const lo = ring(x0 + ix(W, a), PY0 + ix(W, a), x1 - ix(W, a), PY1 - ix(W, a), zs[k])
    const hi = ring(x0 + ix(W, b), PY0 + ix(W, b), x1 - ix(W, b), PY1 - ix(W, b), zs[k + 1])
    part.loft([lo, hi])
    if (k === zs.length - 2) part.cap(hi, true)
    void D
  }
}

// ---------------------------------------------------------------------------
// The central towers
// ---------------------------------------------------------------------------
const TB = 35.8, TG = 37.3, TBel = 46.0, TSp = 57.0, TTip = 58.6
for (const side of [-1, 1]) {
  const x0 = X(side < 0 ? -T1 + 0.45 : T0), x1 = X(side < 0 ? -T0 : T1 - 0.45), y0 = YC + 0.45, y1 = YC + 9
  const xc = (x0 + x1) / 2, yc = (y0 + y1) / 2
  box(buff, x0, y0, x1, y1, 0, TB, 0.3, true)
  // corner buttresses, stepped in at mid-height (inside the 9 m outline)
  for (const [cx, cy] of [[x0 + 0.6, y0 + 0.6], [x1 - 0.6, y0 + 0.6]]) {
    box(buff, cx - 0.75, cy - 0.75, cx + 0.75, cy + 0.75, 0, 22, 0.2)
    box(buff, cx - 0.6, cy - 0.6, cx + 0.6, cy + 0.6, 22, TB, 0.15)
  }
  for (const [z0, z1, d] of [[0, 1.6, 0.25], [6.6, 7.6, 0.18], [13.3, 14.3, 0.18], [18.5, 19.3, 0.18], [22.5, 23.4, 0.18], [31.8, 32.8, 0.18]]) boxBand(blue, x0, y0, x1, y1, z0, z1, d)
  // gallery: a corbelled parapet with real openings (posts and rail)
  boxBand(buff, x0, y0, x1, y1, TB - 0.5, TB, 0.6)
  const fs = south(y0), fe = side < 0 ? west(x0) : east(x1), fq = side < 0 ? east(x1) : west(x0)
  for (const f of [fs, fe]) {
    const sm = f === fs ? xc : (side < 0 ? -yc : yc)
    proud(buff, f, sm - 4.7, sm + 4.7, TG - 0.35, TG, 0.25, 0.6, { bottom: true })
    for (let k = -2; k <= 2; k++) proud(buff, f, sm + k * 2.2 - 0.25, sm + k * 2.2 + 0.25, TB, TG - 0.35, 0.25, 0.6, { top: false })
    // windows: big two-light arch, a pair, an arcade of four, three tall lights
    archPanel(win, f, sm, 3.4, 3.2, 9.0)
    archPanel(win, f, sm - 1.1, 1.3, 14.8, 17.6)
    archPanel(win, f, sm + 1.1, 1.3, 14.8, 17.6)
    for (let k = 0; k < 4; k++) archPanel(win, f, sm - 2.4 + k * 1.6, 0.9, 19.8, 21.6, 0.06, 4)
    for (const k of [-1, 0, 1]) archPanel(win, f, sm + k * 1.7, 1.2, 24.0, 30.6)
  }
  for (const k of [-1, 0, 1]) archPanel(win, fq, (side < 0 ? yc : -yc) + k * 1.7, 1.2, 27.0, 30.6) // the inner face, over the gable roof
  // belfry stage, set in, with corner pinnacles
  const bi = 1.0
  box(buff, x0 + bi, y0 + bi, x1 - bi, y1 - bi, TB, TBel, 0.25, false)
  boxBand(blue, x0 + bi, y0 + bi, x1 - bi, y1 - bi, 40.2, 40.8, 0.15)
  for (const f of [south(y0 + bi), side < 0 ? west(x0 + bi) : east(x1 - bi), north(y1 - bi), side < 0 ? east(x1 - bi) : west(x0 + bi)]) {
    const sm = f.n[1] !== 0 ? (f.n[1] < 0 ? xc : -xc) : (f.n[0] > 0 ? yc : -yc)
    archPanel(win, f, sm - 1.2, 1.3, 37.8, 42.4)
    archPanel(win, f, sm + 1.2, 1.3, 37.8, 42.4)
  }
  for (const [cx, cy] of [[x0 + 0.5, y0 + 0.5], [x1 - 0.5, y0 + 0.5], [x0 + 0.5, y1 - 0.5], [x1 - 0.5, y1 - 0.5]]) pinnacle(buff, slate, cx, cy, 0.75, TB, TBel + 0.6, TBel + 4.2)
  // the banded spire and finial
  const hb = 3.5
  const lvl = [TBel, 49.0, 49.9, 52.6, 53.3, TSp]
  for (let k = 0; k < lvl.length - 1; k++) {
    const h0 = hb * (1 - (lvl[k] - TBel) / (TSp - TBel)), h1 = hb * (1 - (lvl[k + 1] - TBel) / (TSp - TBel))
    pyramid(k % 2 === 1 ? blue : slate, xc, yc, h0, lvl[k], k === lvl.length - 2 ? 0 : h1, lvl[k + 1])
  }
  pinnacle(buff, buff, xc, yc, 0.22, TSp - 0.8, TTip - 0.6, TTip)
}

// ---------------------------------------------------------------------------
// The central gable and the great arched entrance
// ---------------------------------------------------------------------------
{
  const x0 = X(-T0), x1 = X(T0), y0 = YC, yb = YF + 4, zw = 25.5, zg = 32.3
  const dep = 3.0, w = 9.0, zs = 9.0, r = w / 2
  const fs = south(y0)
  // body behind the arch's recess; the gable front
  box(buff, x0, y0 + dep, x1, yb, 0, zw, 0, false)
  const P = (s: number, z: number, d: number) => F(fs, s, z, d)
  // the front: piers either side of the arch, the spandrel over it, the wall above
  proud(buff, fs, x0, AX - r, 0, 15.0, -dep, 0, { top: false })
  proud(buff, fs, AX + r, x1, 0, 15.0, -dep, 0, { top: false })
  const n = 8
  for (let i = 0; i < n; i++) {
    const a0 = Math.PI - (Math.PI * i) / n, a1 = Math.PI - (Math.PI * (i + 1)) / n
    const s0 = AX + r * Math.cos(a0), z0 = zs + r * Math.sin(a0), s1 = AX + r * Math.cos(a1), z1 = zs + r * Math.sin(a1)
    buff.quad(P(s0, z0, 0), P(s1, z1, 0), P(s1, 15.0, 0), P(s0, 15.0, 0))
    // soffit stepped in three orders
    for (let k = 0; k < 3; k++) {
      const rr = r - k * 0.55, dd0 = -k * 1.0, dd1 = -(k + 1) * 1.0
      const q0 = AX + rr * Math.cos(a0), w0 = zs + rr * Math.sin(a0), q1 = AX + rr * Math.cos(a1), w1 = zs + rr * Math.sin(a1)
      ;(k === 1 ? blue : buff).quad(P(q0, w0, dd0), P(q0, w0, dd1), P(q1, w1, dd1), P(q1, w1, dd0))
      if (k < 2) {
        const r2 = rr - 0.55
        const e0 = AX + r2 * Math.cos(a0), f0 = zs + r2 * Math.sin(a0), e1 = AX + r2 * Math.cos(a1), f1 = zs + r2 * Math.sin(a1)
        buff.quad(P(q0, w0, dd1), P(e0, f0, dd1), P(e1, f1, dd1), P(q1, w1, dd1))
      }
    }
  }
  // the archivolt: a broad banded ring proud of the face, round the opening
  for (let i = 0; i < n; i++) {
    const a0 = Math.PI - (Math.PI * i) / n, a1 = Math.PI - (Math.PI * (i + 1)) / n, R0 = r, R1 = r + 1.0
    const Q = (a: number, rr: number, d: number) => P(AX + rr * Math.cos(a), zs + rr * Math.sin(a), d)
    blue.quad(Q(a0, R0, 0.3), Q(a1, R0, 0.3), Q(a1, R1, 0.3), Q(a0, R1, 0.3))
    blue.quad(Q(a0, R1, 0.3), Q(a1, R1, 0.3), Q(a1, R1, 0), Q(a0, R1, 0))
  }
  for (const sgn of [-1, 1]) proud(blue, fs, AX + sgn * (r + 0.5) - 0.5, AX + sgn * (r + 0.5) + 0.5, 0, zs, 0, 0.3, { top: false })
  // jambs of the three orders
  for (const sgn of [-1, 1]) for (let k = 0; k < 3; k++) {
    const s = AX + sgn * (r - k * 0.55), s2 = AX + sgn * (r - (k + 1) * 0.55)
    const a: V3 = P(s, 0, -k), b: V3 = P(s, 0, -(k + 1)), c: V3 = P(s, zs, -(k + 1)), d: V3 = P(s, zs, -k)
    if (sgn < 0) buff.quad(a, d, c, b); else buff.quad(a, b, c, d)
    if (k < 2) { if (sgn < 0) buff.quad(P(s, 0, -(k + 1)), P(s, zs, -(k + 1)), P(s2, zs, -(k + 1)), P(s2, 0, -(k + 1))); else buff.quad(P(s2, 0, -(k + 1)), P(s2, zs, -(k + 1)), P(s, zs, -(k + 1)), P(s, 0, -(k + 1))) }
  }
  // inside the arch: the window over the doors, the twin doors
  const ri = r - 1.65
  archPanel(win, fs, AX, 2 * ri, 5.2, zs, -dep + 0.02, 8)
  archPanel(win, fs, AX - 1.2, 2.0, 0, 3.6, -dep + 0.05, 6)
  archPanel(win, fs, AX + 1.2, 2.0, 0, 3.6, -dep + 0.05, 6)
  // above the arch: blue band, an arcade gallery of seven lights, a balcony, the gable window
  panel(buff, fs, x0, x1, 15.0, zw, 0)
  proud(blue, fs, x0, x1, 15.0, 15.6, 0, 0.2, { ends: false })
  for (let k = -3; k <= 3; k++) archPanel(win, fs, AX + k * 1.75, 1.2, 16.2, 18.4)
  proud(buff, fs, x0 + 0.5, x1 - 0.5, 19.1, 19.9, 0, 0.6, { bottom: true })
  for (let k = -2; k <= 2; k++) archPanel(win, fs, AX + k * 2.2, 1.4, 20.4, 22.7)
  proud(blue, fs, x0, x1, 23.6, 24.2, 0, 0.18, { ends: false })
  // gable: a solid triangle with a round-arched window and a raking coping
  buff.tri(P(x0, zw, 0), P(x1, zw, 0), P(AX, zg, 0))
  archPanel(win, fs, AX, 2.4, 26.0, 28.4, 0.06)
  for (const sgn of [-1, 1]) {
    const a = P(AX + sgn * T0, zw, 0.35), b = P(AX, zg + 0.4, 0.35), a2 = P(AX + sgn * T0, zw + 0.6, 0.35), b2 = P(AX, zg + 1.0, 0.35)
    if (sgn < 0) buff.quad(a, b, b2, a2); else buff.quad(b, a, a2, b2)
  }
  // the roof behind the gable, running back into the hall
  gableY(slate, null, x0, x1, y0, yb, zw, zg)
}

// ---------------------------------------------------------------------------
// Behind the front: the Hintze Hall, the rear towers, the top-lit galleries
// ---------------------------------------------------------------------------
{
  // Hintze Hall
  const hx0 = X(-11), hx1 = X(11)
  box(buff, hx0, YF + 4, hx1, 16, 0, 20, 0, false)
  gableY(slate, buff, hx0, hx1, YF + 4, 16, 20, 26.7)
  // a glazed strip along each slope near the ridge
  for (const sgn of [-1, 1]) {
    const xa = AX + sgn * 1.2, xb = AX + sgn * 5.5, za = 26.7 - (1.2 / 11) * 6.7 + 0.05, zb = 26.7 - (5.5 / 11) * 6.7 + 0.05
    if (sgn < 0) glass.quad([xb, YB + 2, zb], [xa, YB + 2, za], [xa, 13, za], [xb, 13, zb])
    else glass.quad([xa, YB + 2, za], [xb, YB + 2, zb], [xb, 13, zb], [xa, 13, za])
  }
  // the cross range at the north end and the two rear towers
  box(buff, X(-17), 12, X(17), 26, 0, 18.5, 0.3, false)
  gableX(slate, buff, X(-17), X(17), 12, 26, 18.5, 22.5)
  for (const sgn of [-1, 1]) {
    // Romanesque rear towers, banded like the front and with the pavilions' banded hipped roof
    const cx = X(sgn * 13.5), cy = 19, h = 3.0, wz = 33.5
    box(buff, cx - h, cy - h, cx + h, cy + h, 0, wz, 0.3, false)
    for (const [z0, z1] of [[6.6, 7.6], [13.3, 14.3], [20.4, 21.4], [26.4, 27.2]]) boxBand(blue, cx - h, cy - h, cx + h, cy + h, z0, z1, 0.15)
    boxBand(buff, cx - h, cy - h, cx + h, cy + h, wz - 0.6, wz, 0.4)
    for (const f of [south(cy - h), north(cy + h), east(cx + h), west(cx - h)]) {
      const sm = f.n[1] !== 0 ? (f.n[1] < 0 ? cx : -cx) : (f.n[0] > 0 ? cy : -cy)
      archPanel(win, f, sm - 1.0, 1.1, 28.2, 31.6, 0.06, 4)
      archPanel(win, f, sm + 1.0, 1.1, 28.2, 31.6, 0.06, 4)
    }
    const zs = [wz, 37.0, 37.9, 41.4, 42.2, 46.0]
    for (let k = 0; k < zs.length - 1; k++) {
      const a = (zs[k] - wz) / (46 - wz), b = (zs[k + 1] - wz) / (46 - wz), hh = h + 0.3
      pyramid(k % 2 === 1 ? blue : slate, cx, cy, hh * (1 - a), zs[k], k === zs.length - 2 ? 0 : hh * (1 - b), zs[k + 1])
    }
  }
  // top-lit galleries: a flat block, ridged glazed rooflights every 20 m
  const gal = (x0: number, x1: number, y0: number, y1: number) => {
    box(buff, x0, y0, x1, y1, 0, 11, 0, false)
    blue.cap(ring(x0, y0, x1, y1, 11), true)
    boxBand(blue, x0, y0, x1, y1, 10.4, 11.0, 0.15)
  }
  gal(-96, X(-11), YB, 26)
  gal(X(11), 57, YB, 26)
  for (const xc of [-82.5, -62.5, -42.5, 7.5, 27.5, 47.5]) {
    const x0 = xc - 4.5, x1 = xc + 4.5, y0 = YB + 1, y1 = 24, ze = 11.0, zr = 15.5
    slate.quad([x0, y0, ze], [x0 + 1.5, y0, ze + 0.75], [x0 + 1.5, y1, ze + 0.75], [x0, y1, ze])
    slate.quad([x1 - 1.5, y0, ze + 0.75], [x1, y0, ze], [x1, y1, ze], [x1 - 1.5, y1, ze + 0.75])
    glass.quad([x0 + 1.5, y0, ze + 0.75], [xc, y0, zr], [xc, y1, zr], [x0 + 1.5, y1, ze + 0.75])
    glass.quad([xc, y0, zr], [x1 - 1.5, y0, ze + 0.75], [x1 - 1.5, y1, ze + 0.75], [xc, y1, zr])
    buff.quad([x0, y0, ze], [x1, y0, ze], [x1 - 1.5, y0, ze + 0.75], [x0 + 1.5, y0, ze + 0.75])
    buff.tri([x0 + 1.5, y0, ze + 0.75], [x1 - 1.5, y0, ze + 0.75], [xc, y0, zr])
    buff.quad([x1, y1, ze], [x0, y1, ze], [x0 + 1.5, y1, ze + 0.75], [x1 - 1.5, y1, ze + 0.75])
    buff.tri([x1 - 1.5, y1, ze + 0.75], [x0 + 1.5, y1, ze + 0.75], [xc, y1, zr])
  }
  // the west range running north from the west pavilion
  box(buff, -122.5, PY1, -96, 58, 0, 26.5, 0.3, false)
  gableY(slate, buff, -122.5, -96, PY1, 58, 26.5, 31.0)
  const fw = west(-122.5)
  boxBand(blue, -122.5, PY1, -96, 58, 0, 1.6, 0.2)
  for (let k = 0; k < 9; k++) {
    const s = -(PY1 + 5 + k * 10)
    archPanel(win, fw, s, 2.4, 8.6, 12.0)
    archPanel(win, fw, s, 2.0, 15.0, 18.6)
  }
}

// ---------------------------------------------------------------------------
// The later blocks (plain): north ranges, the two tall north blocks, the
// Geological Museum / Earth Galleries block to the east
// ---------------------------------------------------------------------------
function plain(x0: number, y0: number, x1: number, y1: number, h: number, faces: Frame[] = [], rows: [number, number][] = [], bay = 6, hipFrom = 0) {
  const wz = hipFrom > 0 ? hipFrom : h
  box(stone, x0, y0, x1, y1, 0, wz, 0.3, false)
  if (hipFrom > 0) {
    // a hipped slate roof, its ridge at the measured top
    const ins = Math.min((x1 - x0) / 2 - 0.5, (y1 - y0) / 2 - 0.5, (h - wz) * 1.6)
    hip(slate, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, wz, h, ins, ins)
  } else {
    boxBand(stone, x0, y0, x1, y1, h - 1.0, h, 0.35) // cornice and parapet
    blue.cap(ring(x0, y0, x1, y1, h - 0.4, 0.3), true)
  }
  for (const f of faces) {
    const along = f.u[0] !== 0 ? [x0, x1] : [y0, y1]
    const sgn = f.u[0] + f.u[1]
    const a = Math.min(along[0] * sgn, along[1] * sgn), b = Math.max(along[0] * sgn, along[1] * sgn)
    const nb = Math.max(1, Math.floor((b - a) / bay))
    for (const [z0, z1] of rows) for (let k = 0; k < nb; k++) panel(win, f, a + (b - a) * (k + 0.25) / nb, a + (b - a) * (k + 0.75) / nb, z0, z1)
  }
}
plain(-96, 26, -58, 58, 12.5)
// the two tall north blocks: lidar 32-32.7 m to the top, drawn with hipped slate roofs (hidden from Cromwell Road behind the front ridge)
plain(-58, 28, -46.5, 65.5, 32, [west(-58), east(-46.5)], [[4, 11], [14.5, 21.5], [24, 26]], 8, 27)
plain(-46.5, 33, 12, 59.9, 12.5, [north(59.9)], [[4, 10]], 7)
plain(12, 29.5, 32.5, 59.9, 32.7, [east(32.5), north(59.9)], [[4, 11], [14.5, 21.5], [24, 26]], 7, 27)
plain(32.5, 26, 57, 34, 12.5)
// east: the Geological Museum (1935, Portland stone, classical): stone walls,
// three rows of grouped windows, cornice and parapet, grey roof
plain(57, 3, 152, 34.5, 27, [east(152), north(34.5)], [[3, 10], [12.5, 19.5], [22, 25]], 6.5)
plain(57, -36, 84, -8, 11.5)
plain(84, -17, 137, -8, 14)
plain(137, -33, 152, 3, 23.7, [east(152), south(-33)], [[3, 10], [12.5, 20]], 6)
// its Cromwell Road block: stone, grouped windows in two tiers between piers
plain(84, -33, 137, -17, 21, [south(-33), east(137)], [[2.5, 9.5], [11.5, 18.5]], 5.3)
// east pavilion's back block
box(buff, X(P0), PY1, X(P1), -8, 0, 21, 0.3)

// ---------------------------------------------------------------------------
const parts = [
  { part: buff, material: M.buff },
  { part: blue, material: M.blue },
  { part: slate, material: M.slate },
  { part: stone, material: M.stone },
  { part: win, material: M.window },
  { part: glass, material: M.glass },
]
const tris = parts.reduce((s, { part }) => s + part.triangles, 0)
const glb = writeGlb('Natural History Museum', parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor' })
console.log(`${ID}: ${tris} triangles, ${glb.length} bytes; ` + parts.map(({ part, material }) => `${material.name} ${part.triangles}`).join(', '))
if (!process.env.LOOSE) {
  if (tris > 6500) throw new Error('triangle budget exceeded')
  if (glb.length > 250 * 1024) throw new Error('file budget exceeded')
}
await Bun.write(new URL(`../models/${ID}.glb`, import.meta.url).pathname, glb)
