/**
 * National Gallery of Art, West Building — procedural, CC0-1.0, no textures.
 * bun generators/dc-nga-west.ts
 *
 * Also the kit for dc-nga-east and dc-national-archives: the helpers in the
 * first section are exported, and the West Building is only built when this
 * file is run directly.
 *
 * Map frame: x east, y north, z up, metres. The anchor is the area centroid
 * of the OSM outline way/66418944 (lng -77.0199074, lat 38.8913174), which
 * is also the centre of the rotunda's dome to half a metre. The outline's
 * walls are turned 0.89° anticlockwise from the compass (fitted over all its
 * edges), so the model is placed at bearing 359.11 and built square.
 *
 * What it is: John Russell Pope's gallery of 1937–41, an elongated H of
 * pink Tennessee marble 240 m long. A domed rotunda in the middle; long
 * wings east and west, with the skylit sculpture halls raised along their
 * spine and a skylit garden court in each; four corner pavilions that stand
 * forward of the wings to north and south; an end block at each end. An
 * Ionic portico of eight columns faces the Mall over a broad flight of
 * steps; a narrower portico of six columns on a ground-floor podium faces
 * Constitution Avenue. The walls are windowless: shallow pilasters, blind
 * niches, a cornice and an attic band. The roofs are almost all skylights.
 *
 * Covers and replaces: the outline way/66418944 and its 14 building:parts
 * (rotunda block, dome, both wings, the four sculpture-hall and garden-court
 * blocks, the four corner pavilions, both end blocks, both porticos). The
 * small unnamed buildings around it (way/66418758 and the others: the
 * service yard, guard booths, greenhouses) are left alone.
 *
 * Evidence
 * - OSM (measured): outline 240 × 93 m; wings to y ±26.3, pavilions to
 *   ±46.7, end blocks x 99.6–120; rotunda block a 42 m cross, dome 33.4 m
 *   across; sculpture halls x 21–65 and garden courts x 65–91, both y ±17;
 *   porticos 35 m wide, the south one to y -39.7, the north to 39.3.
 *   Heights: wings 22, pavilions and end blocks 24 (2 m gabled roof), halls
 *   and courts 27 (2 m roof), porticos 30 (4 m gable), rotunda block 30,
 *   dome 30–41.3.
 * - Published (Wikipedia, "National Gallery of Art"; NGA): Pope, 1937–41;
 *   pink Tennessee marble, at its opening the largest marble building in
 *   the world; an elongated H on a domed rotunda after the Pantheon, with
 *   skylit sculpture halls east and west and garden courts.
 * - Photos (Wikimedia Commons): "National-Gallery-of-Art-West-Building-
 *   John-Russell-Pope-National-Mall-Washington-DC-04-2014.jpg" (Gunnar
 *   Klack, CC BY-SA 4.0) and "National Gallery of Art, West Building
 *   (33519556034).jpg" (Gunnar Klack, CC BY-SA 2.0), the south portico
 *   frontally; "Washington October 2016-12.jpg" (Alvesgaspar, CC BY-SA 4.0)
 *   and "National Gallery of Art - West Building facade.JPG"
 *   (AgnosticPreachersKid, CC BY-SA 3.0), the portico close; "National
 *   Gallery of Art 3.jpg" and "National Gallery of Art 4.jpg" (Kurt Kaiser,
 *   CC0), the north portico, dome and wings from Constitution Avenue;
 *   "National Gallery of Art - West Building's east entrance.JPG" and
 *   "West Building of the National Gallery of Art.JPG"
 *   (AgnosticPreachersKid, CC BY-SA 3.0), the east end; "West Building -
 *   National Gallery of Art.JPG" (same), an end face.
 * - USGS NAIP orthophoto (public domain): the roof plan (skylit pavilions,
 *   the strip skylights either side of the halls, the garden courts' glass
 *   roofs, the dome's stepped rings and oculus) and the roof colours.
 * - Measured from the frontal south photo against the portico's OSM width
 *   (35 m): portico floor 5.6 m above Madison Drive, Ionic columns 5.6–20.8,
 *   entablature to 25, pediment apex 30 (OSM); the wing cornice about
 *   19.5 m and the attic band to 22 (OSM 22).
 * - Estimated: the north portico's podium (6 m) and column spacing; the
 *   dome's profile (three stepped rings, then a saucer to 41.3 m) and its
 *   oculus; the pilaster rhythm (about 7.4 m) and the blind niches, drawn as
 *   shaded panels in each bay; the steps' depth (12 m); the skylight
 *   sizes. The south steps stand outside the OSM outline, as they do in
 *   reality.
 * - The Mall is about a storey above Constitution Avenue at the north
 *   front; y = 0 is the lower, northern ground and the walls run to it all
 *   round.
 * - Simplified: the Ionic capitals are plain blocks; the portico ceilings,
 *   the bronze doors' frames, lamps, sculpture and the few small windows are
 *   left out.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cbox, cylinder, gable, grow, hip, panel, qf, rect, type Rect, type Side } from './dc-white-house'

// ===========================================================================
// Kit, shared with dc-nga-east and dc-national-archives.

export type XY = [number, number]

/** Emit a quad or triangle with its winding fixed so it faces `dir`. */
export function orient(p: Part, q: V3[], dir: V3) {
  const [a, b, c] = q
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  const fwd = n[0] * dir[0] + n[1] * dir[1] + n[2] * dir[2] >= 0
  if (q.length === 3) return fwd ? p.tri(q[0], q[1], q[2]) : p.tri(q[0], q[2], q[1])
  if (fwd) p.quad(q[0], q[1], q[2], q[3])
  else p.quad(q[0], q[3], q[2], q[1])
}

export const area2 = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
/** Counter-clockwise from above. */
export const ccw = (r: XY[]) => (area2(r) < 0 ? [...r].reverse() : r)

/** Ear-clipping triangulation of a simple polygon (any winding); index triples. */
export function earcut(ring0: XY[]): [number, number, number][] {
  const idx = ring0.map((_, i) => i)
  if (area2(ring0) < 0) idx.reverse()
  const P = ring0
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inTri = (q: XY, a: XY, b: XY, c: XY) => cr(a, b, q) >= -1e-9 && cr(b, c, q) >= -1e-9 && cr(c, a, q) >= -1e-9
  const out: [number, number, number][] = []
  let guard = 0
  while (idx.length > 3 && guard++ < 100000) {
    let best = -1, bestScore = -Infinity
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const a = P[ia], b = P[ib], c = P[ic]
      const c2 = cr(a, b, c)
      if (c2 <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inTri(P[j], a, b, c) &&
        !(P[j][0] === a[0] && P[j][1] === a[1]) && !(P[j][0] === c[0] && P[j][1] === c[1]))) continue
      const e = Math.max(Math.hypot(a[0] - b[0], a[1] - b[1]), Math.hypot(b[0] - c[0], b[1] - c[1]), Math.hypot(a[0] - c[0], a[1] - c[1]))
      const score = c2 / (e * e)
      if (score > bestScore) { bestScore = score; best = i }
    }
    if (best < 0) throw new Error('earcut: polygon is not simple')
    out.push([idx[(best + idx.length - 1) % idx.length], idx[best], idx[(best + 1) % idx.length]])
    idx.splice(best, 1)
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}

/** A flat polygon at height z, facing up or down. */
export function pcap(p: Part, ring: XY[], z: number, up = true) {
  for (const [a, b, c] of earcut(ring)) orient(p, [[...ring[a], z], [...ring[b], z], [...ring[c], z]] as V3[], [0, 0, up ? 1 : -1])
}

/** Vertical walls round a ring (any winding), facing out. */
export function pwalls(p: Part, ring0: XY[], z0: number, z1: number) {
  const ring = ccw(ring0)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}

const norm2 = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
/**
 * Offset a ring outward by d (inward when negative), mitred. Acute corners
 * keep their true mitre, so a knife edge stays a knife edge.
 */
export function poffset(ring0: XY[], d: number): XY[] {
  const ring = ccw(ring0), n = ring.length
  const out = ring.map((p, i) => {
    const a = ring[(i + n - 1) % n], b = ring[(i + 1) % n]
    const e1 = norm2([p[0] - a[0], p[1] - a[1]]), e2 = norm2([b[0] - p[0], b[1] - p[1]])
    const n1: XY = [e1[1], -e1[0]], n2: XY = [e2[1], -e2[0]]
    const m = norm2([n1[0] + n2[0], n1[1] + n2[1]])
    const k = Math.max(0.12, m[0] * n1[0] + m[1] * n1[1])
    return [p[0] + (m[0] * d) / k, p[1] + (m[1] * d) / k] as XY
  })
  return area2(ring0) < 0 ? out.reverse() : out
}

/**
 * A prism over a ring between z0 and z1, its top edge chamfered by `b` (the
 * soft edge STYLE.md asks for). `top` may be another part (a roof), or false.
 */
export function pslab(p: Part, ring: XY[], z0: number, z1: number, b = 0.4, top: Part | boolean = true, bottom = false) {
  const R = ccw(ring)
  if (b > 0) {
    pwalls(p, R, z0, z1 - b)
    const I = poffset(R, -b)
    p.loft([R.map(([x, y]) => [x, y, z1 - b] as V3), I.map(([x, y]) => [x, y, z1] as V3)])
    if (top) pcap(top === true ? p : top, I, z1, true)
  } else {
    pwalls(p, R, z0, z1)
    if (top) pcap(top === true ? p : top, R, z1, true)
  }
  if (bottom) pcap(p, R, z0, false)
}

/** The flat ring between an outer and an inner ring with the same count, at z. */
export function pannulus(p: Part, outer: XY[], inner: XY[], z: number, up = true) {
  const O = ccw(outer), I = ccw(inner)
  for (let i = 0; i < O.length; i++) {
    const j = (i + 1) % O.length
    orient(p, [[...O[i], z], [...O[j], z], [...I[j], z], [...I[i], z]] as V3[], [0, 0, up ? 1 : -1])
  }
}

export function circle(cx: number, cy: number, r: number, n: number, a0 = 0): XY[] {
  return Array.from({ length: n }, (_, k) => [cx + r * Math.cos(a0 + (k * 2 * Math.PI) / n), cy + r * Math.sin(a0 + (k * 2 * Math.PI) / n)] as XY)
}

/** A smooth-shaded surface of revolution through (radius, z) profile points. */
export function lathe(p: Part, cx: number, cy: number, prof: [number, number][], n = 16, capTop = true) {
  const P = (r: number, z: number, a: number): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    const nr = z1 - z0, nz = -(r1 - r0), l = Math.hypot(nr, nz) || 1
    if (l < 1e-9) continue
    for (let i = 0; i < n; i++) {
      const a = (i * 2 * Math.PI) / n, b = ((i + 1) * 2 * Math.PI) / n
      const N = (ang: number): V3 => [(Math.cos(ang) * nr) / l, (Math.sin(ang) * nr) / l, nz / l]
      if (r1 < 1e-6) p.tri(P(r0, z0, a), P(r0, z0, b), P(0, z1, 0), undefined, undefined, undefined, [N(a), N(b), [0, 0, 1]])
      else if (r0 < 1e-6) p.tri(P(0, z0, 0), P(r1, z1, b), P(r1, z1, a), undefined, undefined, undefined, [[0, 0, -1], N(b), N(a)])
      else {
        p.tri(P(r0, z0, a), P(r0, z0, b), P(r1, z1, b), undefined, undefined, undefined, [N(a), N(b), N(b)])
        p.tri(P(r0, z0, a), P(r1, z1, b), P(r1, z1, a), undefined, undefined, undefined, [N(a), N(b), N(a)])
      }
    }
  }
  const [rt, zt] = prof[prof.length - 1]
  if (capTop && rt > 1e-6) p.cap(circle(cx, cy, rt, n).map(([x, y]) => [x, y, zt] as V3), true)
}

/**
 * A flat panel on the wall segment a→b of a counter-clockwise ring (so it
 * faces out), between fractions t0..t1 along it and heights z0..z1, d proud.
 */
export function ppanel(p: Part, a: XY, b: XY, t0: number, t1: number, z0: number, z1: number, d = 0.05) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
  const nx = dy / l, ny = -dx / l
  const P = (t: number, z: number): V3 => [a[0] + dx * t + nx * d, a[1] + dy * t + ny * d, z]
  p.quad(P(t0, z0), P(t1, z0), P(t1, z1), P(t0, z1))
}

/**
 * A round column standing on a square plinth under a square abacus: the
 * plain, bold version of a classical column that still reads as round.
 */
export function roundColumn(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, seg = 10, capital = 0.6) {
  const pl = r * 1.25
  cbox(p, rect(cx - pl, cx + pl, cy - pl, cy + pl), z0, z0 + 0.45, { top: true })
  cylinder(p, cx, cy, r, z0 + 0.45, z1 - capital, seg, r * 0.86)
  // the capital: a flaring echinus, then the abacus
  cylinder(p, cx, cy, r * 0.86, z1 - capital, z1 - capital * 0.45, seg, r * 1.12)
  cbox(p, rect(cx - pl, cx + pl, cy - pl, cy + pl), z1 - capital * 0.45, z1, { bottom: true })
}

export type Mat = { name: string; color: number; roughness?: number }

/** Check the budgets and write models/<id>.glb. */
export async function saveModel(id: string, name: string, parts: Array<{ part: Part; material: Mat }>, extras: Record<string, unknown>, maxTris = 5000) {
  const used = parts.filter(({ part }) => part.triangles)
  const triangles = used.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${id}: triangle budget exceeded: ${triangles}`)
  if (used.length > 6) throw new Error(`${id}: ${used.length} materials`)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', ...extras })
  if (glb.length > 250 * 1024) throw new Error(`${id}: file budget exceeded: ${glb.length}`)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}

/** The pink Tennessee marble of both National Gallery buildings, pulled to the palette's lightness. */
export const NGA_MARBLE = finish('nga-marble', 0xf0ded3)
/**
 * The skylights that cover nearly all of both buildings' roofs: grey wired
 * glass that reads pale grey from above (NAIP, the aerials), not sky blue.
 * Named apart from `glass` only for its colour; like `glass`, it never glows.
 */
export const NGA_SKYLIGHT = finish('nga-skylight', 0xb4bec4, 0.3)
/** The same marble in the shade of a portico or a niche. */
export const NGA_MARBLE_SHADE = finish('nga-marble-shade', 0xe2d0c6)

// ===========================================================================
// The West Building.

function build() {
  const stone = new Part(), shade = new Part(), roof = new Part(), glass = new Part(), dome = new Part(), door = new Part()

  // ---- Plan (OSM, symmetrical about both axes to within half a metre).
  const XR = 17.6 // the wings' inner end, at the rotunda
  const XH = 21.2, XC = 65.1, XG = 90.7 // sculpture hall, garden court
  const XP = 55.3, XE = 99.6, XEND = 120.0 // pavilion inner side, pavilion/end-block line, end
  const YW = 26.3, YP = 46.7, YH = 17.0
  // ---- Heights.
  const PLINTH = 1.1, CORNICE = 19.0, CORNICE_TOP = 19.8, TOP = 22.0
  const HALL = 25.4, HALL_RIDGE = 27.0

  const wing = (s: number) => (s < 0 ? rect(-XE, -XR, -YW, YW) : rect(XR, XE, -YW, YW))
  const pav = (sx: number, sy: number) => {
    const [x0, x1] = sx < 0 ? [-XE, -XP] : [XP, XE]
    const [y0, y1] = sy < 0 ? [-YP, -YW] : [YW, YP]
    return rect(x0, x1, y0, y1)
  }
  const end = (s: number) => (s < 0 ? rect(-XEND, -XE, -YW, YW) : rect(XE, XEND, -YW, YW))
  const blocks: Rect[] = []
  for (const s of [-1, 1]) blocks.push(wing(s), end(s), pav(s, -1), pav(s, 1))

  // ---- Walls: plinth, wall, cornice, attic band, coping.
  for (const r of blocks) {
    cbox(stone, r, 0, TOP - 0.35, { top: false })
    cbox(stone, grow(r, 0.22), 0, PLINTH, { b: 0.15, top: true })
    cbox(stone, grow(r, 0.55), CORNICE, CORNICE_TOP, { b: 0.3, bottom: true, top: true })
    cbox(stone, grow(r, 0.15), TOP - 0.35, TOP, { b: 0.2, bottom: true, top: roof })
  }

  // ---- Facades: shallow pilasters and a blind niche in each bay.
  /** Pilasters at both ends and every ~7.4 m; a niche in each bay. */
  function facade(side: Side, at: number, a0: number, a1: number, o: { niches?: boolean; pitch?: number; skip?: [number, number] } = {}) {
    const n = Math.max(1, Math.round((a1 - a0) / (o.pitch ?? 7.4))), step = (a1 - a0) / n
    for (let k = 0; k <= n; k++) {
      const a = a0 + k * step
      const s0 = Math.max(a0, a - 0.65), s1 = Math.min(a1, a + 0.65)
      block(stone, side, at, s0, s1, PLINTH, CORNICE, 0.25, false, true)
    }
    if (o.niches === false) return
    for (let k = 0; k < n; k++) {
      const c = a0 + step * (k + 0.5)
      if (o.skip && c > o.skip[0] && c < o.skip[1]) continue
      panel(shade, side, at, c - step * 0.17, c + step * 0.17, 7.4, 14.6, 0.04)
    }
  }
  for (const s of [-1, 1]) {
    const x = (v: number) => s * v
    const span = (a: number, b: number): [number, number] => [Math.min(x(a), x(b)), Math.max(x(a), x(b))]
    // wing faces between the portico and the pavilion
    facade('s', -YW, ...span(XR, XP))
    facade('n', YW, ...span(XR, XP))
    // pavilion fronts, outer and inner sides
    facade('s', -YP, ...span(XP, XE))
    facade('n', YP, ...span(XP, XE))
    facade(s < 0 ? 'w' : 'e', x(XE), -YP, -YW, { pitch: 10 })
    facade(s < 0 ? 'w' : 'e', x(XE), YW, YP, { pitch: 10 })
    facade(s < 0 ? 'e' : 'w', x(XP), -YP, -YW, { pitch: 10 })
    facade(s < 0 ? 'e' : 'w', x(XP), YW, YP, { pitch: 10 })
    // end blocks: their long sides, and the end face with its central doorway
    facade('s', -YW, ...span(XE, XEND), { pitch: 10 })
    facade('n', YW, ...span(XE, XEND), { pitch: 10 })
    const side: Side = s < 0 ? 'w' : 'e'
    facade(side, x(XEND), -YW, YW, { pitch: 8.8, skip: [-5, 5] })
    // the doorway: a framed opening, the door itself lit at night
    block(stone, side, x(XEND), -4.2, 4.2, PLINTH, 12.6, 0.35, false, true)
    panel(door, side, x(XEND) + s * 0.35, -2.7, 2.7, PLINTH, 10.8, 0.04)
  }

  // ---- Roofs. Wings: flat, with a strip skylight either side of the hall.
  for (const s of [-1, 1]) {
    const [x0, x1] = s < 0 ? [-XC + 2, -XR - 4] : [XR + 4, XC - 2]
    for (const sy of [-1, 1]) {
      const y0 = sy < 0 ? -YW + 1.5 : YH + 1.0, y1 = sy < 0 ? -YH - 1.0 : YW - 1.5
      hip(glass, rect(x0, x1, y0, y1), TOP, TOP + 1.3, 2.2)
      const [g0, g1] = s < 0 ? [-XE + 2, -XC - 1] : [XC + 1, XE - 2]
      hip(glass, rect(g0, g1, y0, y1), TOP, TOP + 1.3, 2.2)
    }
    // Pavilions and end blocks: a broad hipped skylight inside a stone rim.
    for (const sy of [-1, 1]) hip(glass, grow(pav(s, sy), -2.2), TOP, TOP + 2.0, 4.5)
    const e = grow(end(s), -2.2)
    hip(glass, rect(e.x0, e.x1, e.y0, -3), TOP, TOP + 1.6, 3.5)
    hip(glass, rect(e.x0, e.x1, 3, e.y1), TOP, TOP + 1.6, 3.5)
    // The sculpture hall: an attic storey along the wing's spine, with a
    // long glass roof; then the garden court, a stone rim round a glass roof.
    const [h0, h1] = s < 0 ? [-XC, -XH + 0.5] : [XH - 0.5, XC]
    const hallR = rect(h0, h1, -YH, YH)
    cbox(stone, hallR, TOP - 0.2, HALL - 0.35, { top: false })
    cbox(stone, grow(hallR, 0.3), HALL - 0.35, HALL, { b: 0.2, bottom: true, top: roof })
    gable(glass, glass, rect(h0 + 1.5, h1 - 1.5, -6.5, 6.5), HALL, HALL_RIDGE, false)
    const [c0, c1] = s < 0 ? [-XG, -XC] : [XC, XG]
    const court = rect(c0, c1, -YH, YH)
    cbox(stone, court, TOP - 0.2, HALL - 0.35, { top: false })
    cbox(stone, grow(court, 0.3), HALL - 0.35, HALL, { b: 0.2, bottom: true, top: roof })
    hip(glass, grow(court, -2.5), HALL, HALL + 1.6, 6, glass, 9)
    // pilasters on the hall's attic, over the wing roof
    for (const sy of [-1, 1]) {
      const n = 6, step = (h1 - h0) / n
      for (let k = 0; k <= n; k++) block(stone, sy < 0 ? 's' : 'n', sy * YH, Math.max(h0, h0 + k * step - 0.6), Math.min(h1, h0 + k * step + 0.6), TOP, HALL - 0.35, 0.2, false, true)
    }
  }

  // ---- The rotunda block, a cross in plan, and the dome.
  const RB = 30.0
  const cross1 = rect(-XH, XH, -YH, YH), cross2 = rect(-17.3, 17.3, -21.0, 21.0)
  for (const r of [cross1, cross2]) {
    cbox(stone, r, TOP - 0.2, RB - 0.4, { top: false })
    cbox(stone, grow(r, 0.4), RB - 2.2, RB - 1.5, { b: 0.25, bottom: true, top: false })
    cbox(stone, grow(r, 0.12), RB - 0.4, RB, { b: 0.25, bottom: true, top: true })
  }
  // corner pilasters on the rotunda block
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    block(stone, sy < 0 ? 's' : 'n', sy * YH, sx < 0 ? -XH : XH - 1.4, sx < 0 ? -XH + 1.4 : XH, TOP, RB - 2.2, 0.2, false, true)
    block(stone, sx < 0 ? 'w' : 'e', sx * 17.3, sy < 0 ? -21 : 19.6, sy < 0 ? -19.6 : 21, TOP, RB - 2.2, 0.2, false, true)
  }
  {
    // The drum: three stepped rings, as the NAIP and the north photos show,
    // then a shallow saucer dome in grey lead to an oculus.
    const N = 24
    lathe(stone, 0, 0, [[16.7, RB], [16.7, RB + 1.2], [16.1, RB + 1.2], [16.1, RB + 2.3], [15.5, RB + 2.3], [15.5, RB + 3.3], [15.0, RB + 3.3]], N, false)
    const R = 15.0, z0 = RB + 3.3, crown = 41.3, rOc = 2.6
    const h = crown - z0, Rs = (R * R + h * h) / (2 * h), zc = crown - Rs
    const prof: [number, number][] = []
    const a0 = Math.asin(R / Rs), a1 = Math.asin(rOc / Rs), steps = 6
    for (let k = 0; k <= steps; k++) {
      const a = a0 + (a1 - a0) * (k / steps)
      prof.push([Rs * Math.sin(a), zc + Rs * Math.cos(a)])
    }
    lathe(dome, 0, 0, prof, N, false)
    const [rTop, zTop] = prof[prof.length - 1]
    lathe(stone, 0, 0, [[rTop, zTop], [rTop + 0.2, zTop + 0.45], [rOc - 0.6, zTop + 0.45]], 12, false)
    lathe(glass, 0, 0, [[rOc - 0.6, zTop + 0.45], [0.01, zTop + 1.4]], 12, false)
  }

  // ---- The south portico: eight Ionic columns over the Mall steps.
  {
    const X = 17.4, Y0 = -YW, Y1 = -39.7, YB = -21.0
    const FLOOR = 5.6, COLS = 20.8, ENT = 25.0, APEX = 30.0, R = 0.92
    const base = rect(-X, X, Y1, Y0)
    cbox(stone, base, 0, FLOOR, { b: 0.2, top: true })
    // the solid part behind the colonnade, up to the rotunda block
    cbox(stone, rect(-X, X, Y0, YB), 0, ENT - 0.7, { top: false })
    const cy = Y1 + 1.3
    for (let k = 0; k < 8; k++) roundColumn(stone, -15.3 + (30.6 * k) / 7, cy, R, FLOOR, COLS)
    for (const sx of [-1, 1]) for (const y of [cy + 4.4, cy + 8.8]) roundColumn(stone, sx * 15.3, y, R, FLOOR, COLS)
    // entablature and its cornice, then the pediment and its roof
    cbox(stone, rect(-X, X, Y1, Y0), COLS, ENT - 0.7, { bottom: true, top: false })
    cbox(stone, rect(-X - 0.4, X + 0.4, Y1 - 0.4, YB), ENT - 0.7, ENT, { b: 0.3, bottom: true, top: false })
    gable(roof, stone, rect(-X - 0.4, X + 0.4, Y1 - 0.4, YB), ENT, APEX, true, [true, false])
    // the raking cornice: a pale lip under each slope
    for (const sx of [-1, 1]) qf(stone, [sx * (X + 0.4), Y1 - 0.75, ENT - 0.05], [0, Y1 - 0.75, APEX + 0.05], [0, Y1 - 0.75, APEX - 0.55], [sx * (X + 0.4), Y1 - 0.75, ENT - 0.55], [0, -1, 0])
    for (const sx of [-1, 1]) qf(stone, [sx * (X + 0.4), Y1 - 0.75, ENT - 0.55], [0, Y1 - 0.75, APEX - 0.55], [0, Y1 - 0.4, APEX - 0.55], [sx * (X + 0.4), Y1 - 0.4, ENT - 0.55], [0, 0, -1])
    // the shaded back wall with its three bronze doors
    panel(shade, 's', Y0, -X + 0.6, X - 0.6, FLOOR, COLS, 0.04)
    panel(door, 's', Y0, -2.4, 2.4, FLOOR, FLOOR + 9.4, 0.08)
    for (const sx of [-1, 1]) panel(door, 's', Y0, sx * 9.6 - 1.4, sx * 9.6 + 1.4, FLOOR, FLOOR + 6.2, 0.08)
    // the steps: a broad flight down to Madison Drive, with cheek blocks
    const N = 8, RUN = 12.0, W = 22.0
    // the lowest three steps run out wider, as the Mall front's terrace does
    for (let k = 0; k < N; k++) {
      const y0 = Y1 - RUN + (k * RUN) / N, w = k < 3 ? W + 14 : W
      cbox(stone, rect(-w, w, y0, k < 3 ? Y1 - RUN + (3 * RUN) / N : Y1), 0, ((k + 1) * FLOOR) / N, { top: true })
    }
    for (const sx of [-1, 1]) cbox(stone, rect(sx < 0 ? -X - 3.2 : X, sx < 0 ? -X : X + 3.2, Y1 - 3.0, Y0), 0, FLOOR + 1.0, { b: 0.2 })
  }

  // ---- The north portico: six columns on a ground-floor podium, with
  // square end piers, facing Constitution Avenue.
  {
    const X = 17.9, Y0 = YW, Y1 = 39.3, YB = 21.0
    const FLOOR = 6.0, COLS = 20.8, ENT = 25.0, APEX = 30.0, R = 0.88
    cbox(stone, rect(-X, X, Y0, Y1), 0, FLOOR, { b: 0.2, top: true })
    cbox(stone, rect(-X, X, YB, Y0), 0, ENT - 0.7, { top: false })
    cbox(stone, rect(-X - 0.25, X + 0.25, Y0, Y1 + 0.25), FLOOR - 0.8, FLOOR, { b: 0.15, top: false, bottom: true })
    for (const x of [-6.4, 0, 6.4]) panel(door, 'n', Y1, x - 1.5, x + 1.5, 0, 4.2, 0.04)
    const cy = Y1 - 1.3
    for (let k = 0; k < 6; k++) roundColumn(stone, -11.5 + (23 * k) / 5, cy, R, FLOOR, COLS)
    for (const sx of [-1, 1]) cbox(stone, rect(sx < 0 ? -X : X - 2.6, sx < 0 ? -X + 2.6 : X, Y0, Y1), FLOOR, COLS, { top: false })
    cbox(stone, rect(-X, X, Y0, Y1), COLS, ENT - 0.7, { bottom: true, top: false })
    cbox(stone, rect(-X - 0.4, X + 0.4, YB, Y1 + 0.4), ENT - 0.7, ENT, { b: 0.3, bottom: true, top: false })
    gable(roof, stone, rect(-X - 0.4, X + 0.4, YB, Y1 + 0.4), ENT, APEX, true, [false, true])
    for (const sx of [-1, 1]) qf(stone, [sx * (X + 0.4), Y1 + 0.75, ENT - 0.05], [0, Y1 + 0.75, APEX + 0.05], [0, Y1 + 0.75, APEX - 0.55], [sx * (X + 0.4), Y1 + 0.75, ENT - 0.55], [0, 1, 0])
    for (const sx of [-1, 1]) qf(stone, [sx * (X + 0.4), Y1 + 0.75, ENT - 0.55], [0, Y1 + 0.75, APEX - 0.55], [0, Y1 + 0.4, APEX - 0.55], [sx * (X + 0.4), Y1 + 0.4, ENT - 0.55], [0, 0, -1])
    panel(shade, 'n', Y0, -X + 2.6, X - 2.6, FLOOR, COLS, 0.04)
    panel(door, 'n', Y0, -2.2, 2.2, FLOOR, FLOOR + 8.0, 0.08)
  }

  return [
    { part: stone, material: NGA_MARBLE },
    { part: shade, material: NGA_MARBLE_SHADE },
    { part: roof, material: PALETTE.roof },
    { part: glass, material: NGA_SKYLIGHT },
    { part: dome, material: finish('nga-dome-lead', 0xbcbdb9) },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) {
  await saveModel('dc-nga-west', 'National Gallery of Art, West Building', build(), {
    source: 'generators/dc-nga-west.ts', bearing: 359.11, osm: 'way/66418944', footprint: [240.0, 93.4], height: 41.3,
  }, 6500)
}
