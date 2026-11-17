/**
 * Myers Park Presbyterian Church (1927, James M. McMichael; later wings and
 * Oxford Hall), 2501 Oxford Place, Charlotte: procedural, CC0-1.0.
 * bun generators/clt-myers-park-presbyterian.ts [out.glb]
 *
 * Map frame: x, y, z up, metres, built square to the church's own walls,
 * which run at bearings 64° and 334°: +y points along 334° (the placement's
 * bearing), +x along 64°. The anchor is on the main complex, at the old
 * campus-frame point (-77, 27); positions are rebased before export.
 * Source heights use a 6.7 m reference above the lidar box's ground_min
 * (204.2 m NAVD88); this datum is removed during local-ground normalization.
 * The source heights are converted to local heights above bare-earth ground
 * with clt-mppc-ground.ts before export. Entrances are explicitly grounded
 * relative to their local ground, keeping original leaf/fanlight heights.
 * After rebasing, feet follow native Mapterhorn z15 samples recorded in
 * clt-mppc-mapterhorn.ts. The map detects this own ground and does not add
 * its slope again. Thresholds compensate its 0.5 m base sink; steps are
 * 0.3 m above their entrance terrain. The lowest foot remains at y = 0.
 * The detached Outreach Center has its own generator, anchor and placement:
 * clt-myers-park-presbyterian-outreach-center.ts.
 *
 * Form: a Gothic Revival church in pale tan stone with grey slate roofs.
 * The long gabled nave (Sanctuary): a narthex bay at the south end with a
 * raised parapet, a round-arched side door and a three-light window on each
 * side, then eight two-light Y-traceried lancets a side between flat
 * pilasters, two chimneys near the north end; on the south gable the great
 * three-light window high up over a 6 m gabled porch with pointed double
 * doors. The bell tower at the nave's north-east corner: a wider lower stage
 * to a ledge, with a round-headed lancet on each face, and the slim belfry
 * stage above with a two-light Y-traceried opening on each face, under a
 * solid parapet with raised corner merlons and a raised middle on each side.
 * Behind it a short gabled transept. The two-storey east wing, its small
 * square tower (round-headed window, four-pane window, door), and the tall
 * cross-gabled chapel end with a two-light window and three rows of windows
 * on its east wall, and east of that a small gable with a traceried window
 * over its own gabled porch. West of the nave: a second square tower with a
 * round-arched door and fanlight; a gabled link; a gable with a gridded
 * pointed window between stacked pairs and an open gabled porch with steps;
 * and Oxford Hall, a big hall turned 45° to the rest with a steep shingled
 * gable, a tall round-headed gridded window over a door and step, buttress
 * walls at its corners, and low flat-roofed wings with rooftop monitors.
 * North: a two-storey flat-roofed wing with doors on both sides and the
 * three-storey education block with framed windows and three doors on its
 * south front.
 *
 * Sources
 * - Campus model by Josh Richard (SketchUp, exported as GLB; supplied by
 *   the church through Alex Wohlbruck, openly licensed with permission).
 *   Additional source campus model credit: Thiencg
 *   (https://www.fiverr.com/thiencfv).
 *   Used for the plan, the forms of every block and the facade pattern:
 *   lancet and buttress rhythm, tower openings, crenellations, gable
 *   windows, porches, window rows on the wings. Fitted to OSM by plan
 *   (IoU 0.87): the GLB's north is turned to bearing 19.25°, its origin at
 *   156 m west, 7 m north of the OSM church point. Its own ground levels
 *   are not consistent from block to block, so its heights were not used;
 *   lidar gives them.
 * - OSM (ODbL): relation/20429396 (Sanctuary, outer way/1498142161);
 *   way/1498142165 (Oxford Hall), 1498142162 (B), 1498142164 (C),
 *   836183794 (D), 369312110 (Outreach Center, F); the bell tower
 *   way/1208917845 (height 27); building:parts 1208917831..1208917857 with
 *   heights, roof shapes, roof directions 64/334/108 and colours
 *   (building:colour #e4d5c3 stone). Plans follow the OSM polygons.
 * - USGS 3DEP lidar USGS_LPC_NC_Phase4_Mecklenburg_2016_LAS_2019 (2016
 *   flight), 1 m grid, heights above ground_min 204.2 m (measured): nave
 *   ridge 26.6-26.8, eaves about 18.8; bell tower 37-38.5; transept ridge
 *   24.5; east wing ridge 22.4, eaves 18.3; chapel ridge 23.4; west tower
 *   24.5; west link ridge 23.2; Oxford Hall ridge 26.8 (line x - y = -135.8),
 *   eaves about 20.6; Oxford Hall's low wings 18.8; north wing C 17.7;
 *   education block D 20.5; Outreach Center ridges 19.2 (main) and 20.3
 *   (cross), eaves about 14; its porch 9.3, annex about 11.5.
 * - USGS NAIP orthophoto (public domain): roof colours (dark grey slate on
 *   the church, the transept and the north wing; light grey-tan shingles on
 *   Oxford Hall and the Outreach Center; white membrane on the flat roofs).
 * - Published: Myers Park Presbyterian Church, Gothic Revival, 1927, by
 *   James M. McMichael (Wikipedia, "James M. McMichael").
 * Estimated: window sizes and bay counts (from the campus model); the
 *   porch and the gable windows' heights; the ground under the Outreach
 *   Center's west side.
 * Doubts: no openly licensed exterior photo was found (Commons and
 *   Openverse have none; Mapillary was not searched, no token). Colours
 *   rest on OSM's tags and NAIP: the stone's tan is OSM's #e4d5c3, the
 *   trim and window colours are the palette's. The Outreach Center's
 *   walls are drawn in the same stone, unconfirmed. Small parts of the
 *   plan (OSM 1208917838, 1208917853, 1208917854) are folded into their
 *   neighbours. The low wings' rooftop monitors are simple boxes.
 * Detail: windows, towers and doors follow the campus model's elevations
 *   (read from level renders of it, scaled to the lidar heights): each
 *   opening's head shape, width and sill and head heights. Tracery is a few
 *   bold pale bars and doors are flush oak panels in pale surrounds, per
 *   STYLE.md ("Tracery", "Doors and entryways").
 * Night: windows and fanlights glow; doors and stone stay dark (no night evidence).
 */
import { Part, type V3 } from './mesh'
import { campusGround } from './clt-mppc-ground'
import { mapterhorn } from './clt-mppc-mapterhorn'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, chamfer, flatShape, extrudeShape, arc, archShape, ccw, finishGlb, writeModel } from './sea-tacoma-union-station'

/** Lowest ground under the church's OSM footprints: 6.73 m above the lidar box minimum, rounded down. */
const G = 6.7
const Z = (h: number) => h - G

// ---------------------------------------------------------------- helpers

function qf(part: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) part.quad(a, b, c, d)
  else part.quad(d, c, b, a)
}
function tf(part: Part, a: V3, b: V3, c: V3, want: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) part.tri(a, b, c)
  else part.tri(a, c, b)
}
function box(wall: Part, top: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bevel = 0.3) {
  prism(wall, top, bevel > 0 ? chamfer(rect(x0, y0, x1, y1), bevel) : rect(x0, y0, x1, y1), z0, z1)
}
export const R = (s0: number, z0: number, s1: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
/** A pointed (equilateral) arch's outline: jambs from z0, springing at zs. */
function pointed(sc: number, w: number, z0: number, zs: number, segs = 4): XY[] {
  const h = w / 2
  return [[sc - h, z0], [sc + h, z0], ...arc(sc - h, zs, w, 0, 60, segs), ...arc(sc + h, zs, w, 120, 180, segs).slice(1)]
}

/** A block's own frame: centre (cx, cy), local u along angle `a` (radians from +x), v 90° left of it. */
export type Frame = { cx: number; cy: number; a: number }
export const at = (f: Frame, u: number, v: number): XY => [f.cx + u * Math.cos(f.a) - v * Math.sin(f.a), f.cy + u * Math.sin(f.a) + v * Math.cos(f.a)]
export const dir = (f: Frame, u: number, v: number): XY => [u * Math.cos(f.a) - v * Math.sin(f.a), u * Math.sin(f.a) + v * Math.cos(f.a)]
/** The face on a block's side: `side` is the outward local direction (±1, 0) or (0, ±1), at half-extent `d`. */
export function sideFace(f: Frame, side: XY, d: number): Face {
  const o = at(f, side[0] * d, side[1] * d)
  return { o: [o[0], o[1], 0], n: dir(f, side[0], side[1]) }
}
/** Position along a face (its s axis) of a world point. */
export const sAt = (f: Face, p: XY) => (p[0] - f.o[0]) * -f.n[1] + (p[1] - f.o[1]) * f.n[0]
/** A face on an axis-aligned wall: x = c facing ±x, or y = c facing ±y. */
const faceX = (x: number, sgn: 1 | -1): Face => ({ o: [x, 0, 0], n: [sgn, 0] })
const faceY = (y: number, sgn: 1 | -1): Face => ({ o: [0, y, 0], n: [0, sgn] })
/** The face on a plan edge a→b of a counter-clockwise ring, facing out. */
function edgeFace(a: XY, b: XY): Face {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  return { o: [a[0], a[1], 0], n: [(b[1] - a[1]) / L, -(b[0] - a[0]) / L] }
}

/**
 * A gabled block: L along local u (the ridge), Wd across. Walls from z0 to
 * the eaves, gable triangles at both ends, two roof slopes with a little
 * overhang. `ends` false leaves the gable ends off (a block butting into
 * another).
 */
export function gabled(f: Frame, L: number, Wd: number, z0: number, eave: number, ridge: number, wall: Part, roof: Part, opts: { over?: number; bevel?: number; ends?: [boolean, boolean] } = {}) {
  const over = opts.over ?? 0.45, ends = opts.ends ?? [true, true]
  const ring = [at(f, -L / 2, -Wd / 2), at(f, L / 2, -Wd / 2), at(f, L / 2, Wd / 2), at(f, -L / 2, Wd / 2)]
  prism(wall, null, opts.bevel ? chamfer(ring, opts.bevel) : ring, z0, eave)
  const P = (u: number, v: number, z: number): V3 => { const p = at(f, u, v); return [p[0], p[1], z] }
  const slope = (ridge - eave) / (Wd / 2)
  const ue = L / 2 + over * 0.6, ze = eave - over * slope
  for (const s of [-1, 1]) {
    const n = dir(f, 0, s)
    qf(roof, P(-ue, s * (Wd / 2 + over), ze), P(ue, s * (Wd / 2 + over), ze), P(ue, 0, ridge), P(-ue, 0, ridge), [n[0] * slope, n[1] * slope, 1])
    // the roof's thin edge at each end, seen from below the eaves
    const m = dir(f, 1, 0)
    for (const e of [-1, 1]) tf(roof, P(e * ue, s * (Wd / 2 + over), ze), P(e * ue, 0, ridge), P(e * ue, 0, ridge - 0.35), [m[0] * e, m[1] * e, 0])
  }
  ends.forEach((on, k) => {
    if (!on) return
    const e = k === 0 ? -1 : 1, m = dir(f, e, 0)
    tf(wall, P(e * L / 2, -Wd / 2, eave), P(e * L / 2, Wd / 2, eave), P(e * L / 2, 0, ridge), [m[0], m[1], 0])
  })
}
/** An axis-aligned gabled block from its corners; the ridge runs along `axis`. */
function gabledXY(x0: number, y0: number, x1: number, y1: number, axis: 'x' | 'y', z0: number, eave: number, ridge: number, wall: Part, roof: Part, opts: { over?: number; bevel?: number; ends?: [boolean, boolean] } = {}) {
  const f: Frame = { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, a: axis === 'x' ? 0 : Math.PI / 2 }
  gabled(f, axis === 'x' ? x1 - x0 : y1 - y0, axis === 'x' ? y1 - y0 : x1 - x0, z0, eave, ridge, wall, roof, opts)
}
/** A flat-roofed block from a plan ring, with a pale coping band at the top. */
export function flatBlock(wall: Part, trim: Part, flat: Part, ring: XY[], top: number, coping = 0.45) {
  const r = ccw(ring)
  prism(wall, null, r, 0, top - coping)
  prism(trim, flat, r, top - coping, top)
}
/** Rectangular windows in rows along a face between s0 and s1, grouped in bays. */
export function windowRows(win: Part, f: Face, s0: number, s1: number, rows: [number, number][], bay: number, inset = 0.8) {
  const a = Math.min(s0, s1), b = Math.max(s0, s1), n = Math.max(1, Math.round((b - a) / bay)), st = (b - a) / n
  for (let k = 0; k < n; k++) for (const [z0, z1] of rows) flatShape(win, f, R(a + st * k + inset, z0, a + st * (k + 1) - inset, z1), 0.06)
}


/** Height of a pointed (equilateral) arch of width w, springing at zs, at offset d from its centre. */
const pointedAt = (w: number, zs: number, d: number) => zs + Math.sqrt(Math.max(0, w * w - (Math.abs(d) + w / 2) ** 2))
/** Height of a semicircular arch of width w, springing at zs, at offset d from its centre. */
const roundAt = (w: number, zs: number, d: number) => zs + Math.sqrt(Math.max(0, (w / 2) ** 2 - d * d))
/**
 * Stone tracery in a window: mullions splitting it into `n` lights, each
 * stopped under the arch, and transoms across. Bold pale bars, a few to a
 * window (STYLE.md, "Tracery").
 */
export function tracery(trim: Part, f: Face, sc: number, w: number, z0: number, zs: number, n: number, head: 'pointed' | 'round' | 'flat', transoms: number[] = [], bar = 0.18) {
  const top = (d: number) => head === 'pointed' ? pointedAt(w, zs, d) : head === 'round' ? roundAt(w, zs, d) : zs
  for (let k = 1; k < n; k++) {
    const d = -w / 2 + (w * k) / n
    flatShape(trim, f, R(sc + d - bar / 2, z0, sc + d + bar / 2, top(d) - 0.12), 0.09)
  }
  for (const z of transoms) flatShape(trim, f, R(sc - w / 2, z - bar / 2, sc + w / 2, z + bar / 2), 0.09)
}
/** A pointed two-light window with Y tracery: the mullion forks at the springing into the arch. */
function lancet2(trim: Part, win: Part, f: Face, sc: number, w: number, z0: number, zs: number, surround = 0.3, transoms: number[] = []) {
  if (surround > 0) flatShape(trim, f, pointed(sc, w + surround, z0 - surround / 2, zs, 6), 0.03)
  flatShape(win, f, pointed(sc, w, z0, zs, 6), 0.06)
  const b = 0.09, ex = w * 0.3, ez = pointedAt(w, zs, ex) - 0.2
  flatShape(trim, f, R(sc - b, z0, sc + b, zs + 0.1), 0.09)
  flatShape(trim, f, [[sc - b, zs], [sc + b, zs], [sc + ex + b, ez], [sc + ex - b, ez]], 0.09)
  flatShape(trim, f, [[sc - b, zs], [sc + b, zs], [sc - ex + b, ez], [sc - ex - b, ez]], 0.09)
  for (const z of transoms) flatShape(trim, f, R(sc - w / 2, z - b, sc + w / 2, z + b), 0.09)
}
/** A window panel with a pale stone surround behind it. */
export function framed(trim: Part, win: Part, f: Face, s0: number, z0: number, s1: number, z1: number, m = 0.25) {
  flatShape(trim, f, R(s0 - m, z0 - m, s1 + m, z1 + m), 0.03)
  flatShape(win, f, R(s0, z0, s1, z1), 0.06)
}
/** A four-pane square window: a framed panel with a cross of bars. */
function crossWindow(trim: Part, win: Part, f: Face, sc: number, w: number, z0: number, z1: number) {
  framed(trim, win, f, sc - w / 2, z0, sc + w / 2, z1, 0.18)
  tracery(trim, f, sc, w, z0, z1, 2, 'flat', [(z0 + z1) / 2], 0.14)
}
/** Geometry explicitly based at an entrance's local ground, already flattened. */
const grounded = new WeakMap<Part, Map<number, number>>()
export function onGround(parts: Part[], ground: number, draw: () => void, adjustment = 0) {
  const starts = parts.map(p => p.pos.length)
  draw()
  parts.forEach((p, k) => {
    let marked = grounded.get(p)
    if (!marked) grounded.set(p, marked = new Map())
    for (let i = starts[k]; i < p.pos.length; i += 3) {
      p.pos[i + 1] = Math.max(0, p.pos[i + 1] - ground)
      marked.set(i, adjustment)
    }
  })
}
/** Remove source terrain offsets before the map drapes this flat-based model. */
export function terrainRelative(parts: Part[], baseline: number) {
  for (const p of parts) for (let i = 0; i < p.pos.length; i += 3) {
    if (grounded.get(p)?.has(i)) continue
    p.pos[i + 1] = Math.max(0, p.pos[i + 1] - (campusGround(p.pos[i], -p.pos[i + 2]) - baseline))
  }
}

/**
 * A doorway: a pale stone surround, the door leaves, and over them a glazed
 * head (fanlight) when the opening is arched: `head` 'round', 'pointed' or
 * 'flat'. The leaves rise to `zs`; an arched head springs there.
 */
export function doorway(trim: Part, door: Part, win: Part, f: Face, sc: number, w: number, z0: number, zs: number, head: 'round' | 'pointed' | 'flat', m = 0.3, terrainAdjustment = 0) {
  onGround([trim, door, win], z0, () => {
  const shape = (ww: number, a: number) => head === 'round' ? archShape(sc, ww, a, zs, 8) : head === 'pointed' ? pointed(sc, ww, a, zs, 5) : R(sc - ww / 2, a, sc + ww / 2, zs + 0.5)
  flatShape(trim, f, shape(w + 2 * m, z0), 0.03)
  flatShape(door, f, R(sc - w / 2, z0, sc + w / 2, zs), 0.06)
  if (head === 'flat') flatShape(win, f, R(sc - w / 2, zs + 0.1, sc + w / 2, zs + 0.5), 0.06)
  else {
    const fan = head === 'round' ? archShape(sc, w, zs + 0.1, zs + 0.1, 8).slice(2) : pointed(sc, w, zs + 0.1, zs + 0.1, 5).slice(2)
    flatShape(win, f, [[sc - w / 2, zs + 0.1], [sc + w / 2, zs + 0.1], ...fan.slice(1, -1)], 0.06)
  }
  flatShape(trim, f, R(sc - 0.07, z0, sc + 0.07, zs), 0.09) // the meeting stile of a pair of leaves
  }, terrainAdjustment)
}
/** A chimney stack with a pale cap. */
function chimney(stone: Part, trim: Part, x: number, y: number, top: number) {
  box(stone, null, x - 0.6, y - 0.45, x + 0.6, y + 0.45, 0, top - 0.3, 0.06)
  box(trim, trim, x - 0.72, y - 0.57, x + 0.72, y + 0.57, top - 0.3, top, 0.05)
}
/**
 * A square tower as the campus model draws them: a plain shaft (optionally
 * a wider lower stage with a ledge), a pale string course under a solid
 * parapet, raised merlons at the corners and a lower raised block in the
 * middle of each side. No pinnacles.
 */
function tower(stone: Part, trim: Part, cx: number, cy: number, half: number, deck: number, lower?: { half: number; top: number }) {
  if (lower) {
    const l = lower.half
    box(stone, null, cx - l, cy - l, cx + l, cy + l, 0, lower.top, 0.15)
    box(trim, trim, cx - l - 0.1, cy - l - 0.1, cx + l + 0.1, cy + l + 0.1, lower.top, lower.top + 0.35, 0.08)
  }
  const h = half
  box(stone, null, cx - h, cy - h, cx + h, cy + h, 0, deck, 0.15)
  box(trim, null, cx - h - 0.12, cy - h - 0.12, cx + h + 0.12, cy + h + 0.12, deck - 0.35, deck, 0.06)
  box(stone, trim, cx - h, cy - h, cx + h, cy + h, deck, deck + 0.6, 0.1)
  const m = Math.min(0.65, h * 0.22)
  for (const [x, y] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) box(stone, trim, cx + x * h - (x > 0 ? 2 * m : 0), cy + y * h - (y > 0 ? 2 * m : 0), cx + x * h + (x < 0 ? 2 * m : 0), cy + y * h + (y < 0 ? 2 * m : 0), deck + 0.6, deck + 1.35, 0.05)
  const c = h * 0.4, t = 0.4
  box(stone, trim, cx - c, cy - h, cx + c, cy - h + t, deck + 0.6, deck + 1.0, 0.03)
  box(stone, trim, cx - c, cy + h - t, cx + c, cy + h, deck + 0.6, deck + 1.0, 0.03)
  box(stone, trim, cx - h, cy - c, cx - h + t, cy + c, deck + 0.6, deck + 1.0, 0.03)
  box(stone, trim, cx + h - t, cy - c, cx + h, cy + c, deck + 0.6, deck + 1.0, 0.03)
}

/** Feet follow the actual DEM; the map detects and subtracts this own ground. */
export function followMapterhorn(parts: Part[], id: string) {
  const samples = mapterhorn[id]
  let lowest = Infinity
  for (const p of parts) for (let i = 0; i < p.pos.length; i += 3) {
    const x = p.pos[i], z = p.pos[i + 2]
    let h = samples[`${x.toFixed(3)},${z.toFixed(3)}`]
    // Float32 export can round a coordinate across a half-mm boundary.
    if (h === undefined) for (const dx of [-0.001, 0, 0.001]) for (const dz of [-0.001, 0, 0.001]) {
      h ??= samples[`${(x + dx).toFixed(3)},${(z + dz).toFixed(3)}`]
    }
    if (h === undefined) throw new Error(`Resample Mapterhorn for ${id}: ${x},${z}`)
    p.pos[i + 1] += h + (grounded.get(p)?.has(i) ? 0.5 + grounded.get(p)!.get(i)! : 0)
    lowest = Math.min(lowest, p.pos[i + 1])
  }
  for (const p of parts) for (let i = 1; i < p.pos.length; i += 3) p.pos[i] -= lowest
}

/** Rebase plan coordinates; Part stores glTF (x, up, -plan-y) positions. */
export function reanchor(parts: Part[], x: number, y: number) {
  for (const part of parts) for (let i = 0; i < part.pos.length; i += 3) {
    part.pos[i] -= x
    part.pos[i + 2] += y
  }
}

// ---------------------------------------------------------------- the church

// The nave (Sanctuary), relation/20429396 and part 1208917846
const NX0 = -86.1, NX1 = -67.3, NY0 = -21.0, NY1 = 34.7, NAX = (NX0 + NX1) / 2
const NEAVE = Z(18.8), NRIDGE = Z(26.8), GROUND = Z(10.0)
// The narthex bay at the south end, then eight lancet bays 3.55 m apart (campus model)
const NARTHEX = -12.4, BAY0 = -10.3, BAY = 3.55
// The bell tower, way/1208917845: a wider lower stage to the ledge, the belfry stage above
const TCX = -65.5, TCY = 18.5, TDECK = Z(36.4)

function build() {
  const stone = new Part(), trim = new Part(), slate = new Part(), shingle = new Part(), win = new Part(), door = new Part()
  const flat = trim // the white membrane roofs read as the pale trim

  // ---- the nave
  gabledXY(NX0, NY0, NX1, NY1, 'y', 0, NEAVE, NRIDGE, stone, slate, { over: 0.5, bevel: 0.2 })
  {
    // the south front: coping, angle buttresses, the great window high in the gable
    const f = faceY(NY0, -1), hw = (NX1 - NX0) / 2, sc = sAt(f, [NAX, NY0])
    extrudeShape(trim, f, [[sc - hw - 0.2, NEAVE], [sc, NRIDGE + 0.35], [sc + hw + 0.2, NEAVE], [sc + hw - 0.6, NEAVE], [sc, NRIDGE - 0.45], [sc - hw + 0.6, NEAVE]], 0, 0.3)
    for (const x of [NX0, NX1]) {
      box(stone, trim, x - 0.7, NY0 - 0.7, x + 0.7, NY0 + 0.7, 0, Z(16.4), 0.08)
      box(stone, trim, x - 0.5, NY0 - 0.5, x + 0.5, NY0 + 0.5, Z(16.4), Z(19.4), 0.06)
    }
    flatShape(trim, f, pointed(sc, 4.5, Z(15.8), Z(18.3), 6), 0.03)
    flatShape(win, f, pointed(sc, 3.9, Z(16.1), Z(18.3), 6), 0.06)
    tracery(trim, f, sc, 3.9, Z(16.1), Z(18.3), 3, 'pointed', [Z(18.3)])
    // the porch: a gabled frontispiece 6 m wide with the arched double doors
    const PY0 = NY0 - 1.6
    gabledXY(NAX - 3.0, PY0, NAX + 3.0, NY0, 'y', 0, Z(15.9), Z(17.9), stone, slate, { over: 0.3, ends: [true, false] })
    const p = faceY(PY0, -1), ps = sAt(p, [NAX, PY0])
    extrudeShape(trim, p, [[ps - 3.2, Z(15.9)], [ps, Z(18.15)], [ps + 3.2, Z(15.9)], [ps + 2.7, Z(15.9)], [ps, Z(17.6)], [ps - 2.7, Z(15.9)]], 0, 0.25)
    for (const x of [NAX - 3.0, NAX + 3.0]) box(stone, trim, x - 0.35, PY0 - 0.5, x + 0.35, PY0 + 0.4, 0, Z(15.4), 0.05)
    doorway(trim, door, win, p, ps, 2.3, GROUND, Z(13.0), 'pointed', 0.35)
  }
  {
    // the long sides: the narthex bay with its side door, then eight two-light lancets between flat pilasters
    for (const [x, sgn] of [[NX0, -1], [NX1, 1]] as [number, 1 | -1][]) {
      const f = faceX(x, sgn)
      for (let k = 0; k < 8; k++) lancet2(trim, win, f, sAt(f, [x, BAY0 + BAY * k]), 2.3, Z(11.3), Z(15.5), 0.24)
      for (const y of [NARTHEX, ...[0, 1, 2, 3, 4, 5, 6].map((k) => BAY0 + BAY * (k + 0.5))]) {
        const d = sgn * 0.45
        box(stone, trim, Math.min(x, x + d), y - 0.35, Math.max(x, x + d), y + 0.35, 0, Z(18.4), 0.05)
      }
      // the narthex bay: walls carried up as a parapet, a round-arched door, a three-light window over it
      box(stone, trim, Math.min(x, x - sgn * 0.5), NY0 + 0.3, Math.max(x, x - sgn * 0.5), NARTHEX, Z(18.4), Z(19.8), 0.05)
      const sd = sAt(f, [x, -15.8])
      doorway(trim, door, win, f, sd, 1.9, GROUND, Z(12.4), 'round')
      framed(trim, win, f, sd - 1.25, Z(14.4), sd + 1.25, Z(15.6), 0.2)
      tracery(trim, f, sd, 2.5, Z(14.4), Z(15.6), 3, 'flat', [], 0.14)
    }
    chimney(stone, trim, NAX + 3.6, 32.0, Z(28.7))
    chimney(stone, trim, NAX - 3.4, 32.0, Z(26.4))
  }
  {
    // the north gable over the low wings
    const f = faceY(NY1, 1), hw = (NX1 - NX0) / 2, sc = sAt(f, [NAX, NY1])
    extrudeShape(trim, f, [[sc - hw - 0.2, NEAVE], [sc, NRIDGE + 0.35], [sc + hw + 0.2, NEAVE], [sc + hw - 0.6, NEAVE], [sc, NRIDGE - 0.45], [sc - hw + 0.6, NEAVE]], 0, 0.3)
    lancet2(trim, win, f, sc, 2.6, Z(19.4), Z(21.4), 0.24)
  }

  // ---- the transept behind the tower (part 1208917847), ridge along x
  gabledXY(-74.0, 19.7, -63.4, 31.2, 'x', 0, Z(18.6), Z(24.6), stone, slate, { ends: [false, true] })

  // ---- the bell tower: lower stage to the ledge at 26.7 with a round-headed lancet, the belfry above
  tower(stone, trim, TCX, TCY, 2.8, TDECK, { half: 3.2, top: Z(26.7) })
  for (const [f, along] of [[faceX(TCX - 2.8, -1), 'y'], [faceX(TCX + 2.8, 1), 'y'], [faceY(TCY - 2.8, -1), 'x'], [faceY(TCY + 2.8, 1), 'x']] as [Face, string][]) {
    const sc = sAt(f, [TCX, TCY])
    lancet2(trim, win, f, sc, 2.0, Z(30.0), Z(32.0), 0.3)
    const g: Face = along === 'y' ? faceX(TCX + Math.sign(f.n[0]) * 3.2, f.n[0] > 0 ? 1 : -1) : faceY(TCY + Math.sign(f.n[1]) * 3.2, f.n[1] > 0 ? 1 : -1)
    flatShape(trim, g, archShape(sAt(g, [TCX, TCY]), 1.2, Z(22.8), Z(25.4), 6), 0.03)
    flatShape(win, g, archShape(sAt(g, [TCX, TCY]), 0.9, Z(23.0), Z(25.4), 6), 0.06)
  }

  // ---- the east wing (outline B): two-storey range, flat strip, small tower, chapel end
  {
    // part 1208917848: x -63.4..-35, ridge along x; grouped windows in two rows and a basement row
    gabledXY(-63.4, 17.2, -40.6, 30.2, 'x', 0, Z(18.3), Z(22.4), stone, slate, { ends: [false, false] })
    const f = faceY(17.2, -1)
    windowRows(win, f, sAt(f, [-62.4, 17.2]), sAt(f, [-45.8, 17.2]), [[Z(11.0), Z(12.9)], [Z(14.4), Z(16.4)]], 4.2, 0.9)
    // part 1208917849: the strip along the north side, flat
    flatBlock(stone, trim, flat, rect(-67.6, 30.2, -40.6, 34.7), Z(18.0))
    const n = faceY(34.7, 1)
    windowRows(win, n, sAt(n, [-60.0, 34.7]), sAt(n, [-41.6, 34.7]), [[Z(10.8), Z(12.6)], [Z(14.2), Z(16.0)]], 4.0, 0.7)
    doorway(trim, door, win, n, sAt(n, [-62.3, 34.7]), 1.8, Z(10.2), Z(12.6), 'flat')
    // part 1208917850: the small tower on the south front
    tower(stone, trim, -43.0, 18.6, 2.4, Z(20.4))
    const tf0 = faceY(16.2, -1), ts = sAt(tf0, [-43.0, 16.2])
    flatShape(trim, tf0, archShape(ts, 1.2, Z(17.9), Z(19.2), 6), 0.03)
    flatShape(win, tf0, archShape(ts, 0.9, Z(18.1), Z(19.2), 6), 0.06)
    crossWindow(trim, win, tf0, ts, 1.6, Z(15.6), Z(17.0))
    doorway(trim, door, win, tf0, ts, 1.6, Z(10.0), Z(12.6), 'flat', 0.3, -0.85) // native terrain falls below the coarse fill here
    // part 1208917851: the chapel end, a tall cross gable with ridge along y
    gabledXY(-40.6, 13.5, -28.3, 34.7, 'y', 0, Z(19.6), Z(23.4), stone, slate, { bevel: 0.15 })
    const c = faceY(13.5, -1), cs = sAt(c, [-34.45, 13.5])
    extrudeShape(trim, c, [[cs - 6.35, Z(19.6)], [cs, Z(23.75)], [cs + 6.35, Z(19.6)], [cs + 5.8, Z(19.6)], [cs, Z(23.2)], [cs - 5.8, Z(19.6)]], 0, 0.25)
    lancet2(trim, win, c, cs, 3.3, Z(12.5), Z(16.0), 0.4, [Z(14.2)])
    flatShape(win, c, archShape(cs, 0.8, Z(20.0), Z(21.4), 6), 0.06)
    for (const x of [-40.6, -28.3]) box(stone, trim, x - 0.6, 12.9, x + 0.6, 14.1, 0, Z(19.0), 0.06)
    const ce = faceX(-28.3, 1)
    for (const y of [15.4, 19.0, 22.6]) for (const [z0, z1] of [[8.6, 10.2], [11.4, 13.2], [14.4, 16.6]]) {
      const sy = sAt(ce, [-28.3, y])
      flatShape(win, ce, R(sy - 0.95, Z(z0), sy + 0.95, Z(z1)), 0.06)
    }
    for (const y of [17.2, 20.8]) box(stone, trim, -28.3, y - 0.35, -27.7, y + 0.35, 0, Z(18.6), 0.05)
    // parts 1208917852-54: the gabled range off the chapel's east side, its great window and porch
    gabledXY(-28.3, 24.8, -23.2, 32.7, 'x', 0, Z(17.0), Z(20.6), stone, slate, { ends: [false, true] })
    const e = faceX(-23.2, 1), es = sAt(e, [-23.2, 28.75])
    extrudeShape(trim, e, [[es - 4.15, Z(17.0)], [es, Z(20.85)], [es + 4.15, Z(17.0)], [es + 3.6, Z(17.0)], [es, Z(20.3)], [es - 3.6, Z(17.0)]], 0, 0.22)
    lancet2(trim, win, e, es, 3.4, Z(12.2), Z(15.6), 0.4, [Z(13.9)])
    gabledXY(-23.2, 27.4, -21.0, 30.1, 'x', 0, Z(10.6), Z(11.9), stone, slate, { over: 0.25, ends: [false, true] })
    const pe = faceX(-21.0, 1)
    doorway(trim, door, win, pe, sAt(pe, [-21.0, 28.75]), 1.3, Z(7.8), Z(9.4), 'pointed', 0.25)
  }

  // ---- west of the nave: the small tower, the gabled link, Oxford Hall's low wings
  tower(stone, trim, -88.9, 19.4, 2.8, Z(23.6))
  {
    const f = faceY(16.6, -1), sc = sAt(f, [-88.9, 16.6])
    flatShape(trim, f, archShape(sc, 1.3, Z(20.7), Z(22.6), 6), 0.03)
    flatShape(win, f, archShape(sc, 1.0, Z(20.9), Z(22.6), 6), 0.06)
    crossWindow(trim, win, f, sc, 2.0, Z(16.4), Z(18.3))
    doorway(trim, door, win, f, sc, 2.0, GROUND, Z(13.2), 'round', 0.3)
  }
  // part 1208917843: the gabled link north of the tower, ridge along x
  gabledXY(-96.9, 26.8, -86.1, 36.9, 'x', 0, Z(19.0), Z(23.2), stone, slate, { ends: [true, false] })
  {
    const f = faceY(26.8, -1)
    windowRows(win, f, sAt(f, [-96.2, 26.8]), sAt(f, [-86.8, 26.8]), [[Z(14.4), Z(16.4)]], 3.2, 0.6)
  }
  // parts 1208917836 and -37: two gabled blocks at the hall's east corner
  gabledXY(-105.3, 10.7, -96.5, 20.6, 'x', 0, Z(18.5), Z(22.3), stone, slate)
  gabledXY(-109.9, 7.4, -99.9, 14.2, 'y', 0, Z(18.5), Z(22.3), stone, slate)
  {
    // its south gable: a gridded pointed window between stacked pairs, and the open porch with steps
    const f = faceY(7.4, -1), sc = sAt(f, [-104.9, 7.4])
    extrudeShape(trim, f, [[sc - 5.2, Z(18.5)], [sc, Z(22.6)], [sc + 5.2, Z(18.5)], [sc + 4.6, Z(18.5)], [sc, Z(22.0)], [sc - 4.6, Z(18.5)]], 0, 0.22)
    flatShape(trim, f, pointed(sc, 3.2, Z(11.0), Z(17.4), 6), 0.03)
    flatShape(win, f, pointed(sc, 2.8, Z(11.2), Z(17.4), 6), 0.06)
    tracery(trim, f, sc, 2.8, Z(11.2), Z(17.4), 3, 'pointed', [Z(13.4), Z(15.4)], 0.14)
    for (const d of [-3.2, 3.2]) for (const [z0, z1] of [[11.4, 13.4], [14.6, 16.6]]) crossWindow(trim, win, f, sc + d, 1.3, Z(z0), Z(z1))
    gabledXY(-99.5, 4.4, -96.5, 7.6, 'y', 0, Z(13.2), Z(15.0), stone, slate, { over: 0.25, ends: [true, false] })
    const pf = faceY(4.4, -1), ps = sAt(pf, [-98.0, 4.4])
    extrudeShape(trim, pf, [[ps - 1.65, Z(13.2)], [ps, Z(15.2)], [ps + 1.65, Z(13.2)], [ps + 1.2, Z(13.2)], [ps, Z(14.7)], [ps - 1.2, Z(13.2)]], 0, 0.2)
    onGround([door], GROUND, () => flatShape(door, pf, pointed(ps, 2.0, GROUND, Z(12.4), 5), 0.06))
    onGround([trim], GROUND, () => box(trim, trim, -99.3, 3.4, -96.7, 4.4, 0, GROUND + 0.3, 0.04), 0.35) // step clearance over the coarse terrain fill
  }
  // part 1208917834: the long low wing, flat, with its rooftop monitors
  const low: XY[] = [[-123.0, 35.4], [-125.0, 33.4], [-125.0, 27.7], [-126.1, 23.6], [-111.6, 9.1], [-109.7, 7.4], [-109.9, 14.0], [-106.7, 14.2], [-103.7, 17.2], [-103.7, 20.5], [-96.8, 20.6], [-96.8, 21.9], [-91.7, 22.1], [-86.2, 22.3], [-86.2, 27.1], [-96.8, 26.8], [-96.9, 39.1], [-89.1, 47.2], [-96.9, 54.7], [-116.5, 34.7], [-117.2, 35.4]]
  flatBlock(stone, trim, flat, low, Z(18.8))
  flatBlock(stone, trim, flat, [[-125.1, -4.4], [-123.7, -5.7], [-120.2, -5.9], [-115.7, -1.2], [-115.8, 2.5], [-117.0, 3.6]], Z(18.0)) // part 1208917833
  flatBlock(stone, trim, flat, [[-96.9, 54.7], [-91.4, 54.5], [-89.4, 52.5], [-89.1, 47.2]], Z(14.0)) // part 1208917835
  flatBlock(stone, trim, flat, [[-99.9, 7.7], [-96.5, 11.0], [-99.9, 10.7]], Z(18.0)) // part 1208917838
  for (const ring of [
    [[-109.0, 24.6], [-114.1, 19.4], [-112.4, 17.8], [-107.4, 23.0]],
    [[-112.6, 30.6], [-118.6, 24.5], [-117.0, 22.9], [-111.0, 29.0]],
    [[-102.7, 38.4], [-109.7, 31.4], [-107.6, 29.4], [-100.7, 36.4]],
  ] as XY[][]) prism(stone, trim, ccw(ring), Z(18.8), Z(20.4))
  {
    // part 1208917839: the glazed pyramid
    const b: XY[] = [[-107.2, 20.6], [-110.2, 17.5], [-106.9, 14.4], [-103.9, 17.5]], c: V3 = [-107.05, 17.5, Z(21.0)]
    for (let k = 0; k < 4; k++) {
      const p = b[k], q = b[(k + 1) % 4]
      tf(win, [p[0], p[1], Z(18.8)], [q[0], q[1], Z(18.8)], c, [(p[0] + q[0]) / 2 - c[0], (p[1] + q[1]) / 2 - c[1], 1])
    }
  }
  for (const [a, b, bay] of [[[-126.1, 23.6], [-111.6, 9.1], 4.0], [[-96.9, 39.1], [-89.1, 47.2], 3.8], [[-96.9, 54.7], [-116.5, 34.7], 4.0]] as [XY, XY, number][]) {
    const f = edgeFace(a, b)
    windowRows(win, f, sAt(f, a), sAt(f, b), [[Z(11.4), Z(13.0)], [Z(14.8), Z(16.6)]], bay, 0.9)
  }

  // ---- Oxford Hall's great hall (part 1208917831): turned 45°, steep shingled gable
  {
    const f: Frame = { cx: -128.25, cy: 7.6, a: Math.PI / 4 }, L = 25.7, Wd = 21.4, eave = Z(20.6), ridge = Z(26.8)
    gabled(f, L, Wd, 0, eave, ridge, stone, shingle, { over: 0.5, bevel: 0.2 })
    // the south-west gable end: coping, the tall round-headed gridded window, the door and step under it
    const sw = sideFace(f, [-1, 0], L / 2), hw = Wd / 2
    extrudeShape(trim, sw, [[-hw - 0.2, eave], [0, ridge + 0.35], [hw + 0.2, eave], [hw - 0.6, eave], [0, ridge - 0.45], [-hw + 0.6, eave]], 0, 0.3)
    flatShape(trim, sw, archShape(0, 5.2, Z(14.3), Z(20.6), 10), 0.03)
    flatShape(win, sw, archShape(0, 4.6, Z(14.6), Z(20.6), 10), 0.06)
    tracery(trim, sw, 0, 4.6, Z(14.6), Z(20.6), 4, 'round', [Z(16.6), Z(18.6), Z(20.6)], 0.16)
    doorway(trim, door, win, sw, 0, 2.2, GROUND, Z(12.4), 'flat')
    {
      const a = at(f, -L / 2 - 1.0, -1.6), b = at(f, -L / 2 - 1.0, 1.6), c2 = at(f, -L / 2, 1.6), d = at(f, -L / 2, -1.6)
      onGround([trim], GROUND, () => prism(trim, trim, ccw([a, b, c2, d]), 0, GROUND + 0.3))
    }
    // the buttress walls standing forward at the gable's corners
    for (const v of [-hw, hw]) prism(stone, trim, ccw(chamfer([at(f, -L / 2 - 1.6, v - 1.0), at(f, -L / 2 + 0.4, v - 1.0), at(f, -L / 2 + 0.4, v + 1.0), at(f, -L / 2 - 1.6, v + 1.0)], 0.08)), 0, Z(21.6))
    const ne = sideFace(f, [1, 0], L / 2)
    extrudeShape(trim, ne, [[-hw - 0.2, eave], [0, ridge + 0.35], [hw + 0.2, eave], [hw - 0.6, eave], [0, ridge - 0.45], [-hw + 0.6, eave]], 0, 0.3)
    flatShape(win, ne, pointed(0, 3.2, Z(21.0), Z(23.4), 4), 0.06)
    for (const s of [-1, 1] as const) {
      const side = sideFace(f, [0, s], Wd / 2)
      windowRows(win, side, -L / 2 + 1.2, L / 2 - 1.2, [[Z(11.6), Z(13.6)], [Z(15.4), Z(18.6)]], 4.6, 1.2)
    }
  }

  // ---- north: wing C and the education block D, flat roofs
  {
    const C: XY[] = [[-72.2, 34.6], [-62.4, 34.6], [-62.5, 39.0], [-56.7, 39.0], [-57.0, 74.7], [-55.3, 74.7], [-55.4, 81.6], [-71.7, 81.5], [-71.6, 77.6], [-72.6, 77.6]]
    flatBlock(stone, trim, slate, C, Z(17.7))
    box(trim, trim, -67.0, 48.0, -62.1, 64.0, Z(17.7), Z(19.2), 0.1) // part 1208917856, a roof light
    const w = edgeFace([-72.6, 77.6], [-72.2, 34.6]), e = edgeFace([-56.7, 39.0], [-57.0, 74.7]), ce = edgeFace([-62.4, 34.6], [-62.5, 39.0])
    windowRows(win, w, sAt(w, [-72.6, 76.0]), sAt(w, [-72.4, 58.4]), [[Z(11.4), Z(13.0)], [Z(14.4), Z(16.2)]], 4.4, 0.8)
    windowRows(win, w, sAt(w, [-72.4, 54.8]), sAt(w, [-72.2, 37.0]), [[Z(11.4), Z(13.0)], [Z(14.4), Z(16.2)]], 4.4, 0.8)
    doorway(trim, door, win, w, sAt(w, [-72.4, 56.6]), 1.8, Z(10.2), Z(12.6), 'flat')
    windowRows(win, e, sAt(e, [-56.7, 41.0]), sAt(e, [-57.0, 72.0]), [[Z(11.4), Z(13.0)], [Z(14.4), Z(16.2)]], 4.4, 0.8)
    doorway(trim, door, win, ce, sAt(ce, [-62.45, 36.8]), 1.8, Z(10.2), Z(12.6), 'flat')
    const D: XY[] = [[-52.6, 81.7], [-52.5, 78.3], [-55.3, 78.2], [-55.3, 74.7], [-57.0, 74.7], [-57.0, 71.0], [-52.1, 71.2], [-51.9, 64.9], [-9.2, 66.0], [-9.7, 82.8]]
    flatBlock(stone, trim, flat, D, Z(20.5), 0.6)
    const rows: [number, number][] = [[Z(9.6), Z(11.4)], [Z(12.9), Z(14.8)], [Z(16.2), Z(18.2)]]
    const s = edgeFace([-51.9, 64.9], [-9.2, 66.0]), n = edgeFace([-9.7, 82.8], [-52.6, 81.7]), ee = edgeFace([-9.2, 66.0], [-9.7, 82.8])
    const yS = (x: number) => 64.9 + ((x + 51.9) * 1.1) / 42.7
    const doorsS = [-42.7, -18.0, -11.2].map((x) => sAt(s, [x, yS(x)]))
    const framedRows = (f: Face, s0: number, s1: number, bay: number, inset: number, doors: number[] = []) => {
      const a = Math.min(s0, s1), b = Math.max(s0, s1), k = Math.max(1, Math.round((b - a) / bay)), st = (b - a) / k
      for (let i = 0; i < k; i++) for (const [z0, z1] of rows) {
        const l = a + st * i + inset, r = a + st * (i + 1) - inset
        if (z0 === rows[0][0] && doors.some((d) => d > l - 2.0 && d < r + 2.0)) continue
        framed(trim, win, f, l, z0, r, z1, 0.22)
      }
    }
    framedRows(s, sAt(s, [-51.0, 64.9]), sAt(s, [-10.2, 66.0]), 6.0, 1.0, doorsS)
    doorway(trim, door, win, s, doorsS[0], 1.2, Z(9.0), Z(11.4), 'flat', 0.22)
    doorway(trim, door, win, s, doorsS[1], 2.8, Z(8.6), Z(11.2), 'flat', 0.25)
    doorway(trim, door, win, s, doorsS[2], 1.1, Z(8.4), Z(10.8), 'flat', 0.2)
    framedRows(n, sAt(n, [-10.7, 82.8]), sAt(n, [-51.6, 81.7]), 6.0, 1.0)
    framedRows(ee, sAt(ee, [-9.2, 67.2]), sAt(ee, [-9.7, 81.6]), 4.5, 1.1)
  }

  terrainRelative([stone, trim, slate, shingle, win, door], G)
  reanchor([stone, trim, slate, shingle, win, door], -77, 27)
  followMapterhorn([stone, trim, slate, shingle, win, door], 'clt-myers-park-presbyterian')
  return finishGlb('Myers Park Presbyterian Church', [
    { part: stone, material: finish('mppc-stone', 0xe4d5c3) },
    { part: trim, material: PALETTE.trim },
    { part: slate, material: finish('mppc-slate', 0x7d878d) },
    { part: shingle, material: finish('mppc-shingle', 0xb7b5a8) },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('mppc-door', 0x76675a) },
  ], { bearing: 334, height: TDECK + 1.35 }, 6500)
}

if (import.meta.main) await writeModel('clt-myers-park-presbyterian', build())
