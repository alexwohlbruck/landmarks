/**
 * One Liberty Place, Philadelphia (Murphy/Jahn, Helmut Jahn, 1987) —
 * original procedural geometry, CC0-1.0.
 * bun generators/phl-one-liberty-place.ts [out.glb]
 *
 * This file also exports the Liberty Place kit (materials, the rectilinear
 * massing with its banded granite / blue glass facade, the stacked gable
 * crown and its light lines) that phl-two-liberty-place.ts imports. Its own
 * build runs only under `import.meta.main`.
 *
 * Frame: map frame turned to the Center City grid, BEARING 9.2 (the mean
 * bearing of the OSM outline's four sides, 9.1-9.3; the lidar was read in
 * the same frame). +x toward 17th Street (east-south-east), +y toward Market
 * Street (north-north-east), z up, metres. Origin = area centroid of the OSM
 * outline way/42784982 (-75.168136, 39.952570), on the ground (Market
 * Street, lidar ground 0.7 m above the box's ground_min; elevation 0).
 *
 * Form (lidar + photos): a square 61-storey shaft of blue glass and silver
 * granite, its four corners notched full height (a 6.5 m re-entrant notch).
 * The middle 24 m of each face is an all-glass bay that rises past the shaft
 * top as a projecting gabled "arm" (T1). Behind the arms the crown is three
 * nested cross-gabled square tiers (T2-T4) whose gables face all four sides
 * and whose ridges climb toward the centre, then a short square pyramid and
 * the needle. Every gable's rakes are silver by day and lines of light at
 * night (white, sometimes colour-washed).
 *
 * Evidence
 * - OSM way/42784982 (outline, square 48.1 x 49.2 m with the notch nodes),
 *   parts way/333013556 (base, 3 levels), way/333012828 and way/333012829
 *   (the cross-shaped shaft, 185), way/345594709 and way/345594710 (crossing
 *   gables, 220), way/345594711 and way/332974959 (228), way/345594720 and
 *   way/345594721 (240), way/345594723 (250), way/333012830 (spire, 288).
 *   All replaced. OSM's part heights are rough; the lidar is used instead.
 * - USGS 3DEP lidar USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown 2015),
 *   0.5 m grid, read in this frame. Measured (above Market Street):
 *   footprint 49.9 x 50.2 m with its centre ~0.8 m east of the OSM centroid
 *   (the model follows OSM's centre and lidar's size: half 24.9, notch inner
 *   faces at 18.4); notch corners filled by the base to 16 m; shaft top
 *   (wings and terraces) 176.5; crown planes fitted by least squares over
 *   each ring (median residual 0.2-0.3 m): every tier is
 *   h = A - k*s + r*(W - d) with s, d the distances along and out from a
 *   face, k 1.05 (the rake slope, about 46 degrees), r 0.85 (the ridge's climb
 *   toward the centre); T2 W 18.4 A 221.5, T3 W 14.5 A 232.3, T4 W 9.5
 *   A 244.3 (centre 252.4); arms half-width 12, face apex 208.1, k 1.07,
 *   r 0.95, so the arm eaves are at 195.3 on the face. Needle tip in the
 *   lidar at 294 (with its rod and beacon).
 * - Published: 945 ft = 288 m to the spire (architectural), 61 storeys, top
 *   floor 784 ft = 239 m, completed 1987, Murphy/Jahn (Wikipedia "Liberty
 *   Place", citing CTBUH 593). The model's needle stops at the published
 *   288 m.
 * - Mapterhorn terrain: flat to within a metre over the block; elevation 0.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 * - "One Liberty Place, Philadelphia, Pennsylvania LCCN2011630484.tif", Carol
 *   M. Highsmith, public domain (from the north-west, above: the crown's
 *   tiers, the arms' gables and inner chevrons, the notched corners, the
 *   banded shaft) https://commons.wikimedia.org/wiki/File:One_Liberty_Place,_Philadelphia,_Pennsylvania_LCCN2011630484.tif
 * - "Liberty place.jpg", Photodavid, CC BY-SA 3.0 (both towers from the
 *   north-west; facade bands and colours)
 *   https://commons.wikimedia.org/wiki/File:Liberty_place.jpg
 * - "OneLiberyPlacePhiladelphia.jpg", Massimo Catarinella, CC BY 3.0 (from the
 *   east behind City Hall tower; spire proportions, glass colour)
 *   https://commons.wikimedia.org/wiki/File:OneLiberyPlacePhiladelphia.jpg
 * - "OneLibertyPlaceSpire.jpg", Wasted Time R, public domain (the crown and
 *   spire from below: the steel pyramid, the needle, the arms' granite frames)
 *   https://commons.wikimedia.org/wiki/File:OneLibertyPlaceSpire.jpg
 * - "One Liberty Place a.jpg", "b.jpg", "d.jpg", Wobbanight, CC0 (street-level
 *   views of the notched corner, the banding and the crown)
 *   https://commons.wikimedia.org/wiki/File:One_Liberty_Place_a.jpg
 * - Night: "Philadelphia Night Skyline.jpg", Thesab, CC BY-SA 4.0 (the gable
 *   rakes and the tiers' corners as white lines, the spire lit)
 *   https://commons.wikimedia.org/wiki/File:Philadelphia_Night_Skyline.jpg
 *   and "Philadelphia Night Skyline (14146388982).jpg", Chris Hunkeler,
 *   CC BY-SA 2.0 https://commons.wikimedia.org/wiki/File:Philadelphia_Night_Skyline_(14146388982).jpg
 *
 * Look-only: none used.
 *
 * Estimated: the facade rhythm (granite spandrels and blue glass ribbons
 * grouped three storeys to a band, 11.7 m, on the wings and notch walls; the
 * all-glass middle bays with a granite line every four storeys, 15.6 m, and
 * faint mullion lines) is a simplification of the photos' one-band-per-floor
 * pattern; the 7.5 m lobby band; the arm's inner chevron (photo-scaled from
 * Highsmith and Photodavid: parallel to the rake, apex 189 m, ending at the
 * shaft top); the spire's square pyramid (half 3.4 m at 245 m, buried in the
 * roof, to 1.0 m at 261 m) and the needle (2 m thick at its base, 1.1 m at
 * 279 m), scaled from Catarinella, Highsmith and the spire close-up against
 * the measured crown; the light lines 1.8 m deep (bolder than the real
 * fittings, so they read at phone size).
 *
 * Colours (daylight photos, pulled to the palette's lightness): shaft glass
 * a deep grey-blue (#55769c); the crown's vertical glass and the spire
 * pyramid the same blue a step lighter (#6384aa); the sloped crown glazing a
 * lighter sky-reflecting blue (#86a3c2); granite and the needle a pale warm
 * silver grey (#cbc6be); the light lines silver white.
 *
 * Night (Thesab, Hunkeler): the shaft is office glass (lit, `window`, the
 * glass bays included up to the arms' eaves); the crown's walls and sloped
 * glazing stay dark (`glass-2`, `glass`) so the lines read; every gable rake,
 * the tiers' corners (the chevrons' hooked ends in the night photos) and the
 * spire pyramid's hips glow white (`neon-liberty-lights`).
 *
 * Doubts: the corners' fine secondary steps (the corner notch is itself
 * stepped in the photos) are drawn as one 6.5 m notch, as the lidar shows;
 * the ground-floor arcade and entrances are simplified to a lobby band; the
 * lights are white here though they are often colour-washed.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'

// ---------------------------------------------------------------- materials

/** Liberty Place's six materials, shared by both towers. */
export const LIBERTY_MATERIALS = {
  /** Shaft and crown walls: deep grey-blue office glass, lit at night. */
  window: { ...PALETTE.window, color: 0x55769c } as MaterialSpec,
  /** Silver granite spandrels, piers, lips and the arms' inner chevrons. */
  granite: finish('liberty-granite', 0xcbc6be) as MaterialSpec,
  /** Sloped crown glazing and faint mullion lines; dark at night. */
  glass: { ...PALETTE.glass, color: 0x86a3c2 } as MaterialSpec,
  /** The gable rakes and spire: silver by day, white lines of light at night. */
  neon: finish('neon-liberty-lights', 0xe9eef3, 0.4) as MaterialSpec,
  roof: PALETTE.roof as MaterialSpec,
  /**
   * The crown's vertical glass and the spire pyramid: the shaft's blue, a
   * little lighter, and dark at night so the light lines read.
   */
  crown: { ...PALETTE.glass, name: 'glass-2', color: 0x6384aa } as MaterialSpec,
}
export type Kit = Record<keyof typeof LIBERTY_MATERIALS, Part>
export const newKit = (): Kit => ({
  window: new Part(), granite: new Part(), glass: new Part(), neon: new Part(), roof: new Part(), crown: new Part(),
})

// ---------------------------------------------------------------- geometry helpers

type XY = [number, number]
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]

/** A convex planar polygon, wound to face along `hint`. */
export function poly(p: Part, pts: V3[], hint: V3, normals?: V3[]) {
  let n: V3 = [0, 0, 0]
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    n = add(n, [(a[1] - b[1]) * (a[2] + b[2]), (a[2] - b[2]) * (a[0] + b[0]), (a[0] - b[0]) * (a[1] + b[1])])
  }
  let v = pts, nn = normals
  if (n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0) { v = [...pts].reverse(); nn = normals && [...normals].reverse() }
  for (let i = 1; i < v.length - 1; i++) p.tri(v[0], v[i], v[i + 1], undefined, undefined, undefined, nn && [nn[0], nn[i], nn[i + 1]])
}

/**
 * A face frame around a centre: f = 0 E, 1 N, 2 W, 3 S. `d` is the distance
 * out from the centre along the face's normal, `s` runs along the face
 * counter-clockwise seen from above.
 */
export function frame(cx: number, cy: number, f: number) {
  const c = [1, 0, -1, 0][f], sn = [0, 1, 0, -1][f]
  const at = (s: number, d: number, z: number): V3 => [cx + c * d - sn * s, cy + sn * d + c * s, z]
  const out: V3 = [c, sn, 0]
  return { at, out }
}

// ---------------------------------------------------------------- facades

export const BEVEL = 0.45 // edge chamfers and roof lips
const LOBBY = 7.5, PLINTH = 1.2
const BAND_P = 11.7, BAND_SP = 4.0 // three storeys a band; granite spandrel depth
const LINE_P = 15.6, LINE_H = 0.8  // the glass bays' granite line every four storeys

/** Vertical layering of a facade between z0 and z1: [za, zb, granite?]. */
function layers(style: Style, z0: number, z1: number): [number, number, boolean][] {
  const cuts: [number, number, boolean][] = []
  const push = (a: number, b: number, g: boolean) => {
    a = Math.max(a, z0); b = Math.min(b, z1)
    if (b - a > 0.01) cuts.push([a, b, g])
  }
  if (style === 'crown') { push(z0, z1, false); return cuts }
  push(-1, PLINTH, true)
  push(PLINTH, LOBBY, false)
  const P = style === 'band' ? BAND_P : LINE_P, H = style === 'band' ? BAND_SP : LINE_H
  for (let z = LOBBY; z < z1; z += P) { push(z, z + H, true); push(z + H, z + P, false) }
  // A sliver of glass under a lip or a sliver of granite over a ribbon reads as
  // noise: fold anything under 1.2 m into its neighbour.
  for (let i = 0; i < cuts.length; i++) if (cuts[i][1] - cuts[i][0] < 1.2 && cuts.length > 1) {
    const j = i ? i - 1 : 1
    cuts[j] = [Math.min(cuts[i][0], cuts[j][0]), Math.max(cuts[i][1], cuts[j][1]), cuts[j][2]]
    cuts.splice(i--, 1)
  }
  return cuts
}

export type Style = 'band' | 'curtain' | 'crown' | 'granite'

/**
 * A flat facade on the wall from a to b (outward normal n), between u0 and u1
 * metres along it and z0..z1, tiled into granite and glass. `band`: granite
 * spandrels with three-storey glass ribbons between piers; `curtain`: a glass
 * bay framed by piers with a granite line every four storeys and faint
 * mullion lines; `crown`: plain office glass.
 */
export function facade(k: Kit, a: XY, b: XY, u0: number, u1: number, z0: number, z1: number, style: Style, piers: [boolean, boolean] = [true, true]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), tx = (b[0] - a[0]) / L, ty = (b[1] - a[1]) / L
  const n: V3 = [ty, -tx, 0]
  const at = (u: number, z: number, off = 0): V3 => [a[0] + tx * u + n[0] * off, a[1] + ty * u + n[1] * off, z]
  const rect = (p: Part, ua: number, ub: number, za: number, zb: number, off = 0) =>
    poly(p, [at(ua, za, off), at(ub, za, off), at(ub, zb, off), at(ua, zb, off)], n)
  if (style === 'granite') { rect(k.granite, u0, u1, z0, z1); return }
  // Banded walls carry their ribbons right round the corners, as the real
  // ones do; only the glass bays are framed by piers.
  const pw = style === 'curtain' ? Math.min(1.0, (u1 - u0) * 0.15) : 0
  const l = u0 + (piers[0] ? pw : 0), r = u1 - (piers[1] ? pw : 0)
  if (l > u0) rect(k.granite, u0, l, z0, z1)
  if (r < u1) rect(k.granite, r, u1, z0, z1)
  for (const [za, zb, g] of layers(style, z0, z1)) rect(g ? k.granite : k.window, l, r, za, zb)
  if (style === 'curtain') {
    // Faint mullion lines, a step lighter than the glass, about 4.8 m apart.
    const m = Math.max(1, Math.round((r - l) / 4.8))
    for (let i = 1; i < m; i++) {
      const u = l + (r - l) * i / m
      rect(k.glass, u - 0.2, u + 0.2, Math.max(z0, LOBBY), z1 - 0.05, 0.05)
    }
  }
}

// ---------------------------------------------------------------- massing

export type Box = [number, number, number, number, number] // x0 y0 x1 y1 top (from the ground)
export type Rect = [number, number, number, number]
export type Wall = { a: XY; b: XY; lo: number; hi: number; start: number; end: number }
/** How to dress one wall: segments [u0, u1, style, lip] along it, metres from a. */
export type Dress = (w: Wall, length: number) => { u0: number; u1: number; style: Style; lip: boolean }[]

/**
 * Rectilinear massing as a height field over the union of boxes. Only the
 * visible walls and roofs are built. Convex corners get a smooth chamfer,
 * wall tops that meet a roof get a bevelled granite lip, and roofs inside the
 * `covered` rectangles are skipped (the crown builds over them).
 */
export function massing(k: Kit, boxes: Box[], covered: Rect[], dress: Dress) {
  const xs = [...new Set(boxes.flatMap((b) => [b[0], b[2]]).concat(covered.flatMap((c) => [c[0], c[2]])))].sort((a, b) => a - b)
  const ys = [...new Set(boxes.flatMap((b) => [b[1], b[3]]).concat(covered.flatMap((c) => [c[1], c[3]])))].sort((a, b) => a - b)
  const H = ys.slice(1).map((_, j) => xs.slice(1).map((_, i) => {
    const x = (xs[i] + xs[i + 1]) / 2, y = (ys[j] + ys[j + 1]) / 2
    return Math.max(0, ...boxes.map((b) => (x > b[0] && x < b[2] && y > b[1] && y < b[3] ? b[4] : 0)))
  }))
  const h = (i: number, j: number) => H[j]?.[i] ?? 0
  // Unit walls between cells, outward from the higher cell, then merged.
  const raw: Wall[] = []
  const push = (a: XY, b: XY, lo: number, hi: number) => { if (hi > lo) raw.push({ a, b, lo, hi, start: 0, end: 0 }) }
  for (let j = 0; j < H.length; j++) for (let i = 0; i < H[j].length; i++) {
    const c = h(i, j)
    push([xs[i], ys[j]], [xs[i + 1], ys[j]], h(i, j - 1), c)         // south side, walking east
    push([xs[i + 1], ys[j]], [xs[i + 1], ys[j + 1]], h(i + 1, j), c) // east side, walking north
    push([xs[i + 1], ys[j + 1]], [xs[i], ys[j + 1]], h(i, j + 1), c) // north side, walking west
    push([xs[i], ys[j + 1]], [xs[i], ys[j]], h(i - 1, j), c)         // west side, walking south
  }
  const walls: Wall[] = []
  for (const w of raw) {
    const prev = walls.find((v) => v.lo === w.lo && v.hi === w.hi && v.b[0] === w.a[0] && v.b[1] === w.a[1] &&
      (v.b[0] - v.a[0]) * (w.b[1] - w.a[1]) === (v.b[1] - v.a[1]) * (w.b[0] - w.a[0]) &&
      (v.b[0] - v.a[0]) * (w.b[0] - w.a[0]) + (v.b[1] - v.a[1]) * (w.b[1] - w.a[1]) > 0)
    if (prev) prev.b = w.b
    else walls.push({ ...w })
  }
  // Merging is order-dependent; run it again until nothing joins.
  for (let again = true; again;) {
    again = false
    for (const v of walls) for (const w of walls) {
      if (v === w || v.lo !== w.lo || v.hi !== w.hi || v.b[0] !== w.a[0] || v.b[1] !== w.a[1]) continue
      const dv = [v.b[0] - v.a[0], v.b[1] - v.a[1]], dw = [w.b[0] - w.a[0], w.b[1] - w.a[1]]
      if (dv[0] * dw[1] - dv[1] * dw[0] !== 0 || dv[0] * dw[0] + dv[1] * dw[1] <= 0) continue
      v.b = w.b; walls.splice(walls.indexOf(w), 1); again = true; break
    }
  }
  // Convex corners of walls with equal spans: a smooth chamfer.
  for (const a of walls) for (const b of walls) {
    if (a === b || a.lo !== b.lo || a.hi !== b.hi || a.b[0] !== b.a[0] || a.b[1] !== b.a[1]) continue
    const da = [a.b[0] - a.a[0], a.b[1] - a.a[1]], db = [b.b[0] - b.a[0], b.b[1] - b.a[1]]
    if (da[0] * db[1] - da[1] * db[0] <= 0) continue
    const la = Math.hypot(da[0], da[1]), lb = Math.hypot(db[0], db[1]), c = Math.min(0.6, la * 0.2, lb * 0.2)
    a.end = c; b.start = c
    const p: XY = [a.b[0] - da[0] / la * c, a.b[1] - da[1] / la * c], q: XY = [b.a[0] + db[0] / lb * c, b.a[1] + db[1] / lb * c]
    const na: V3 = [da[1] / la, -da[0] / la, 0], nb: V3 = [db[1] / lb, -db[0] / lb, 0], nm = unit(add(na, nb))
    poly(k.granite, [[...p, a.lo], [...q, a.lo], [...q, a.hi - BEVEL], [...p, a.hi - BEVEL]], nm, [na, nb, nb, na])
    // The lip turns the corner too.
    const pi: XY = [p[0] - na[0] * BEVEL, p[1] - na[1] * BEVEL], qi: XY = [q[0] - nb[0] * BEVEL, q[1] - nb[1] * BEVEL]
    const up = unit(add(nm, [0, 0, 1]))
    poly(k.granite, [[...p, a.hi - BEVEL], [...q, a.hi - BEVEL], [...qi, a.hi], [...pi, a.hi]], up)
  }
  for (const w of walls) {
    const L = Math.hypot(w.b[0] - w.a[0], w.b[1] - w.a[1]), tx = (w.b[0] - w.a[0]) / L, ty = (w.b[1] - w.a[1]) / L
    const n: V3 = [ty, -tx, 0], up = unit(add(n, [0, 0, 1]))
    const at = (u: number, off: number, z: number): V3 => [w.a[0] + tx * u - n[0] * off, w.a[1] + ty * u - n[1] * off, z]
    for (const seg of dress(w, L)) {
      const u0 = Math.max(seg.u0, w.start), u1 = Math.min(seg.u1, L - w.end)
      if (u1 - u0 < 0.01) continue
      const top = seg.lip ? w.hi - BEVEL : w.hi
      facade(k, w.a, w.b, u0, u1, w.lo, top, seg.style)
      if (seg.lip) {
        poly(k.granite, [at(u0, 0, top), at(u1, 0, top), at(u1, BEVEL, w.hi), at(u0, BEVEL, w.hi)], up, [n, n, [0, 0, 1], [0, 0, 1]])
        poly(k.granite, [at(u0, BEVEL, w.hi), at(u1, BEVEL, w.hi), at(u1, 1.1, w.hi), at(u0, 1.1, w.hi)], [0, 0, 1])
      }
    }
  }
  // Roofs, cell by cell, just under the lips; none inside the covered areas.
  for (let j = 0; j < H.length; j++) for (let i = 0; i < H[j].length; i++) {
    const z = H[j][i]
    if (!z) continue
    const cx = (xs[i] + xs[i + 1]) / 2, cy = (ys[j] + ys[j + 1]) / 2
    if (covered.some((c) => cx > c[0] && cx < c[2] && cy > c[1] && cy < c[3])) continue
    // Pull the cap in from any edge with a drop, so it never reaches past a
    // chamfered corner.
    const x0 = xs[i] + (h(i - 1, j) < z ? BEVEL : 0), x1 = xs[i + 1] - (h(i + 1, j) < z ? BEVEL : 0)
    const y0 = ys[j] + (h(i, j - 1) < z ? BEVEL : 0), y1 = ys[j + 1] - (h(i, j + 1) < z ? BEVEL : 0)
    poly(k.roof, [[x0, y0, z - 0.06], [x1, y0, z - 0.06], [x1, y1, z - 0.06], [x0, y1, z - 0.06]], [0, 0, 1])
  }
  return walls
}

// ---------------------------------------------------------------- crown

/** A cross-gabled square tier: roof h = A - k*s + r*(W - d). */
export type Tier = { W: number; A: number }
export type CrownSpec = {
  cx: number; cy: number
  k: number; r: number
  /** Ground of the lowest tier's walls (the shaft-top terrace). */
  base: number
  tiers: Tier[] // outermost first
}

const RAKE = 1.8, PROUD = 0.3

/**
 * A light line along a rake: a bar 1.4 m deep standing 0.25 m proud of the
 * wall, its top flush with the roof edge, from s0 to s1 on face frame f at d.
 */
export function rake(k: Kit, F: ReturnType<typeof frame>, d: number, s0: number, z0: number, s1: number, z1: number) {
  const o = F.out
  const p = (s: number, z: number, off: number) => F.at(s, d + off, z)
  poly(k.neon, [p(s0, z0 - RAKE, PROUD), p(s1, z1 - RAKE, PROUD), p(s1, z1, PROUD), p(s0, z0, PROUD)], o)
  poly(k.neon, [p(s0, z0, 0), p(s0, z0, PROUD), p(s1, z1, PROUD), p(s1, z1, 0)], unit(add(o, [0, 0, 1])))
  poly(k.neon, [p(s0, z0 - RAKE, 0), p(s1, z1 - RAKE, 0), p(s1, z1 - RAKE, PROUD), p(s0, z0 - RAKE, PROUD)], [0, 0, -1])
  // End caps, so the bar reads solid from the side.
  for (const [s, z, sign] of [[s0, z0, -1], [s1, z1, 1]] as const) {
    if (Math.abs(s) < 0.01) continue
    const t = F.at(sign, 0, 0), c = F.at(0, 0, 0), dir: V3 = [t[0] - c[0], t[1] - c[1], 0]
    poly(k.neon, [p(s, z - RAKE, 0), p(s, z - RAKE, PROUD), p(s, z, PROUD), p(s, z, 0)], dir)
  }
}

/** A square light bar standing on a tier's corner (s = W in frame F), z0 to z1. */
function cornerLight(k: Kit, F: ReturnType<typeof frame>, W: number, z0: number, z1: number) {
  const h = RAKE / 2, o = PROUD
  // Its two outer faces, flush with the rake bars on either face.
  const c = (s: number, d: number, z: number) => F.at(s, d, z)
  const pts = [[W - h, W + o], [W + o, W + o], [W + o, W - h]] as const
  for (let i = 0; i < 2; i++) {
    const [s0, d0] = pts[i], [s1, d1] = pts[i + 1]
    const m = c((s0 + s1) / 2, (d0 + d1) / 2, 0), ctr = c(W - h, W - h, 0)
    poly(k.neon, [c(s0, d0, z0), c(s1, d1, z0), c(s1, d1, z1), c(s0, d0, z1)], [m[0] - ctr[0], m[1] - ctr[1], 0])
  }
}

/** The nested tiers: chevron wall bands, glazed roofs and a rake on every gable. */
export function crown(k: Kit, c: CrownSpec, lights = true) {
  const roofAt = (t: Tier, s: number, d: number) => t.A - c.k * Math.abs(s) + c.r * (t.W - d)
  for (let f = 0; f < 4; f++) {
    const F = frame(c.cx, c.cy, f)
    c.tiers.forEach((t, i) => {
      const below = c.tiers[i - 1]
      const bottom = (s: number) => (below ? roofAt(below, s, t.W) : c.base)
      for (const [s0, s1] of [[-t.W, 0], [0, t.W]]) {
        poly(k.crown, [F.at(s0, t.W, bottom(s0)), F.at(s1, t.W, bottom(s1)), F.at(s1, t.W, roofAt(t, s1, t.W)), F.at(s0, t.W, roofAt(t, s0, t.W))], F.out)
        if (lights) rake(k, F, t.W, s0, roofAt(t, s0, t.W), s1, roofAt(t, s1, t.W))
      }
      // The light lines also run down the tier's corners (seen in the night
      // photos as the chevrons' hooked ends): a bar on the corner.
      if (lights) cornerLight(k, F, t.W, bottom(t.W), roofAt(t, t.W, t.W) - RAKE * 0.5)
      // Glazed roof: the ring out to the next tier, both halves of this sector.
      const inner = c.tiers[i + 1]?.W ?? 0
      for (const sg of [-1, 1]) {
        const pts: [number, number][] = inner ? [[0, inner], [sg * inner, inner], [sg * t.W, t.W], [0, t.W]] : [[0, 0], [sg * t.W, t.W], [0, t.W]]
        poly(k.glass, pts.map(([s, d]) => F.at(s, d, roofAt(t, s, d))), [0, 0, 1])
      }
    })
  }
  return roofAt
}

export type BaySpec = {
  cx: number; cy: number; f: number
  /** The bay's outer face and the inner face it grows from (the tier behind). */
  D: number; Win: number
  w: number; A: number; k: number; r: number
  /** Where the face wall and the side walls start. */
  faceBase: number; sideBase: number
  /** The inner chevron's apex, below the rake. */
  chevron?: number
  lights?: boolean
}

/**
 * A gabled bay on one face (T1): a glass front rising to a gable, glass
 * sides whose eaves climb toward the tier behind, two glazed roof planes,
 * a light line on the rakes and a granite chevron set into the front.
 */
export function bay(k: Kit, b: BaySpec) {
  const F = frame(b.cx, b.cy, b.f)
  const h = (s: number, d: number) => b.A - b.k * Math.abs(s) + b.r * (b.D - d)
  const eaves = h(b.w, b.D)
  // Front: the glass bay's facade to the eaves, then the gable.
  const a = F.at(-b.w, b.D, 0), e = F.at(b.w, b.D, 0)
  facade(k, [a[0], a[1]], [e[0], e[1]], 0, 2 * b.w, b.faceBase, eaves, 'curtain', [true, true])
  poly(k.crown, [F.at(-b.w, b.D, eaves), F.at(b.w, b.D, eaves), F.at(0, b.D, b.A)], F.out)
  // Sides.
  for (const sg of [-1, 1]) {
    const p = (d: number, z: number) => F.at(sg * b.w, d, z)
    const n = F.at(sg, 0, 0), o = F.at(0, 0, 0)
    poly(k.crown, [p(b.Win, b.sideBase), p(b.D, b.sideBase), p(b.D, h(b.w, b.D)), p(b.Win, h(b.w, b.Win))], [n[0] - o[0], n[1] - o[1], 0])
  }
  // Roof planes.
  for (const sg of [-1, 1]) {
    poly(k.glass, [F.at(0, b.Win, h(0, b.Win)), F.at(sg * b.w, b.Win, h(b.w, b.Win)), F.at(sg * b.w, b.D, eaves), F.at(0, b.D, b.A)], [0, 0, 1])
  }
  if (b.lights !== false) for (const [s0, s1] of [[-b.w, 0], [0, b.w]]) rake(k, F, b.D, s0, h(s0, b.D), s1, h(s1, b.D))
  if (b.chevron) {
    // A granite chevron in the glass, parallel to the rake, 1.0 m deep.
    for (const [s0, s1] of [[-b.w + 1, 0], [0, b.w - 1]]) {
      const z = (s: number) => b.chevron! - b.k * Math.abs(s)
      poly(k.granite, [F.at(s0, b.D + 0.06, z(s0) - 1), F.at(s1, b.D + 0.06, z(s1) - 1), F.at(s1, b.D + 0.06, z(s1)), F.at(s0, b.D + 0.06, z(s0))], F.out)
    }
  }
}

/** A square pyramid (or frustum) from z0 (half h0) to z1 (half h1). */
export function frustum(p: Part, cx: number, cy: number, z0: number, h0: number, z1: number, h1: number, sides = 4, cap = true) {
  const ring = (z: number, r: number) => Array.from({ length: sides }, (_, i) => {
    const a = (i / sides) * 2 * Math.PI + (sides === 4 ? Math.PI / 4 : 0), rr = sides === 4 ? r * Math.SQRT2 : r
    return [cx + rr * Math.cos(a), cy + rr * Math.sin(a), z] as V3
  })
  const lo = ring(z0, h0), hi = ring(z1, h1)
  for (let i = 0; i < sides; i++) {
    const j = (i + 1) % sides, m: V3 = [(lo[i][0] + lo[j][0]) / 2 - cx, (lo[i][1] + lo[j][1]) / 2 - cy, 0]
    if (h1 > 0.001) poly(p, [lo[i], lo[j], hi[j], hi[i]], m)
    else poly(p, [lo[i], lo[j], [cx, cy, z1]], m)
  }
  if (cap && h1 > 0.001) poly(p, hi, [0, 0, 1])
}

/** Light lines up the four hips of a square spire pyramid: thin steel-edge bars. */
export function spireHips(k: Kit, cx: number, cy: number, z0: number, h0: number, z1: number, h1: number, w = 0.75) {
  for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
    const a: V3 = [cx + sx * (h0 + 0.05), cy + sy * (h0 + 0.05), z0], b: V3 = [cx + sx * (h1 + 0.05), cy + sy * (h1 + 0.05), z1]
    const out: V3 = [sx, sy, 0]
    // Two narrow faces either side of the hip, a little proud of the pyramid.
    for (const [ex, ey] of [[sx * 0, -sy * w], [-sx * w, sy * 0]]) {
      poly(k.neon, [a, b, [b[0] + ex, b[1] + ey, b[2]], [a[0] + ex, a[1] + ey, a[2]]], out)
    }
  }
}

export function save(name: string, k: Kit, extras: Record<string, unknown>, out: string, limit = 6500) {
  const parts = (Object.keys(LIBERTY_MATERIALS) as (keyof Kit)[]).map((m) => ({ part: k[m], material: LIBERTY_MATERIALS[m] }))
    .filter((p) => p.part.triangles)
  const triangles = parts.reduce((n, p) => n + p.part.triangles, 0)
  const glb = writeGlb(name, parts, extras)
  if (triangles > limit || glb.length > 250000) throw new Error(`Budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
  return Bun.write(out, glb).then(() => console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`))
}

// ---------------------------------------------------------------- One Liberty Place

if (import.meta.main) {
  const BEARING = 9.2
  const ANCHOR = { lng: -75.168136, lat: 39.95257 }
  const D = 24.9, N = 18.4 // half-width of the square, the notch's inner faces
  const SHAFT = 176.5, BASE = 16
  const W1 = 12 // the arms' half-width
  const k = newKit()

  const boxes: Box[] = [
    [-D, -D, D, D, BASE],
    [-N, -D, N, D, SHAFT],
    [-D, -N, D, N, SHAFT],
  ]
  // The crown grows over the middle square and the four arms.
  const covered: Rect[] = [[-N, -N, N, N], [-W1, N, W1, D], [-W1, -D, W1, -N], [N, -W1, D, W1], [-D, -W1, -N, W1]]
  massing(k, boxes, covered, (w, L) => {
    const horizontal = w.a[1] === w.b[1]
    const d = Math.abs(horizontal ? w.a[1] : w.a[0])
    // The outer faces: banded wings either side of the glass bay, which
    // carries on up into the arm (no lip there).
    if (d === D && w.hi === SHAFT) {
      const u = (t: number) => Math.abs(t - (horizontal ? w.a[0] : w.a[1]))
      const m0 = Math.min(u(-W1), u(W1)), m1 = Math.max(u(-W1), u(W1))
      return [
        { u0: 0, u1: m0, style: 'band', lip: true },
        { u0: m0, u1: m1, style: 'curtain', lip: false },
        { u0: m1, u1: L, style: 'band', lip: true },
      ]
    }
    return [{ u0: 0, u1: L, style: 'band', lip: true }]
  })

  const K = 1.05, R = 0.85
  const roofAt = crown(k, { cx: 0, cy: 0, k: K, r: R, base: SHAFT, tiers: [{ W: N, A: 221.5 }, { W: 14.5, A: 232.3 }, { W: 9.5, A: 244.3 }] })
  for (let f = 0; f < 4; f++) {
    bay(k, { cx: 0, cy: 0, f, D, Win: N, w: W1, A: 208.1, k: 1.07, r: 0.95, faceBase: SHAFT, sideBase: SHAFT, chevron: 189 })
  }
  // Spire: a short steel pyramid whose four hips are lit, then the needle.
  const top = roofAt({ W: 9.5, A: 244.3 }, 0, 0)
  const z0 = top - 7.4, z1 = 261, h0 = 3.4, h1 = 1.0
  frustum(k.crown, 0, 0, z0, h0, z1, h1, 4, false)
  spireHips(k, 0, 0, z0, h0, z1, h1)
  frustum(k.granite, 0, 0, z1, 1.0, 279, 0.55, 8, false)
  frustum(k.granite, 0, 0, 279, 0.55, 288, 0, 8, false)

  await save('One Liberty Place', k, {
    license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 288,
    frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    source: 'generators/phl-one-liberty-place.ts',
  }, process.argv[2] ?? new URL('../models/phl-one-liberty-place.glb', import.meta.url).pathname)
}
