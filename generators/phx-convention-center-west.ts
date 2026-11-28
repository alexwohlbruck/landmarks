/**
 * Phoenix Convention Center, West Building (2006; with the North Building,
 * the 2006–08 expansion by HOK, Leo A Daly and Populous's predecessors),
 * Phoenix, Arizona — original procedural geometry, CC0-1.0.
 * bun generators/phx-convention-center-west.ts
 *
 * This file also holds the small kit (`Kit`) shared by
 * phx-convention-center-north.ts and phx-convention-center-south.ts; merge
 * it first. The West Building's own build runs only when this file is run.
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: the walls run
 * north–south and east–west. Anchor -112.0706636, 33.4497758, the area
 * centroid of OSM's outline way/209289531. Geometry is written in metres
 * about -112.0698, 33.4487 ("rel" below) and shifted by (80.2, -119.4).
 *
 * What is drawn: OSM way/209289531 only. The skybridge over 3rd Street to
 * the North Building (way/209289532, height 34, min_height 24) is its own
 * OSM building and belongs to neither model, so it is left to the map.
 * Symphony Hall to the south (way/37059667) is separate.
 *
 * Identity (from the photos below):
 *  1. The giant louvred steel canopy cantilevered over the 3rd Street
 *     sidewalk at roof height, its slats running out from the wall, held
 *     on raking struts.                        (s3rd, w21, lidar, NAIP)
 *  2. Under it, tall glass lobby boxes between striped stair towers of
 *     rust-red and sandstone metal panels.     (s3rd, w21, n21)
 *  3. The big pale exhibit-hall box: beige panels below a silver ribbed
 *     metal skin, its roof sloping up toward 3rd Street.  (n21, lidar)
 *  4. The white wedge canopy over the south entrance on Monroe's side,
 *     rising from the ground in the west to roof height.  (NAIP, lidar)
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020, 1 m grid,
 * tools/lidar.py; ground_min 328.26 m, the street around 332.0–332.7).
 * y = 0 is 332.0 m, the lowest map terrain under the footprint
 * (tools/terrain.ts grid; the site is flat within 0.9 m). Measured (model
 * metres): the hall roof 29.6 at its west wall rising to 33.8 on 3rd St;
 * the south block 28; the glass lobbies 24; the canopy's top 33.6–34,
 * reaching 21 m out from the wall (rel x -37 → -16); the wedge canopy
 * from about 2 m at x -118 to 26 at x -80, flat on to the wall.
 *
 * Estimated: the stair towers' positions and height (21, from w21 against the
 * 24 m lobbies; lidar's 1 m cells miss them), their stripe widths; the depth of the
 * silver skin (from 24 m up, s3rd and n21); the canopy's slat spacing
 * (3 m, drawn sparser than the real louvres), its girders and struts;
 * the sandstone base band. Left out: the skybridge (see above), the
 * balcony slot on the north face, signs, the plaza's planters.
 *
 * Photos (evidence):
 *  s3rd "Phoenix Convention Center - South on 3rd St - 2009-07-06.jpg",
 *       Cygnusloop99, CC BY-SA 3.0, Wikimedia Commons
 *       https://commons.wikimedia.org/wiki/File:Phoenix_Convention_Center_-_South_on_3rd_St_-_2009-07-06.jpg
 *  w21  "2021 Phoenix Convention Center, West Building 1.jpg", Beyond My
 *       Ken, CC BY-SA 4.0, Wikimedia Commons
 *       https://commons.wikimedia.org/wiki/File:2021_Phoenix_Convention_Center,_West_Building_1.jpg
 *  n21  "2021 Phoenix Convention Center, North Building.jpg", Beyond My
 *       Ken, CC BY-SA 4.0, Wikimedia Commons (the corner at 3rd St and
 *       Monroe; the same materials as this building)
 *       https://commons.wikimedia.org/wiki/File:2021_Phoenix_Convention_Center,_North_Building.jpg
 *  v1   "Phoenix Convention Center-1.jpg", Visitor7, CC BY-SA 3.0,
 *       Wikimedia Commons (3rd St looking north, the skybridge)
 *       https://commons.wikimedia.org/wiki/File:Phoenix_Convention_Center-1.jpg
 * Aerial: USGS NAIP (public domain). No look-only sources. No commercial
 * imagery.
 *
 * Night: the glass lobbies are `window` and glow.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'

export type XY = [number, number]

/** Geometry helpers in a shifted plan frame (x east, y north, z up). */
export class Kit {
  constructor(public shift: XY) {}
  P = (x: number, y: number, z: number): V3 => [x + this.shift[0], y + this.shift[1], z]

  static area(r: XY[]) {
    return r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
  }
  static ccw(r: XY[]) { return Kit.area(r) < 0 ? [...r].reverse() : r }

  /** Ear-clipping triangulation of a simple ccw ring. */
  static earcut(ring: XY[]): [XY, XY, XY][] {
    const pts = [...ring], out: [XY, XY, XY][] = []
    const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
    let guard = 0
    while (pts.length > 3 && guard++ < 10000) {
      let cut = false
      for (let i = 0; i < pts.length; i++) {
        const a = pts[(i + pts.length - 1) % pts.length], b = pts[i], c = pts[(i + 1) % pts.length]
        if (cr(a, b, c) <= 1e-9) continue
        if (pts.some((p) => p !== a && p !== b && p !== c && inside(p, a, b, c))) continue
        out.push([a, b, c]); pts.splice(i, 1); cut = true; break
      }
      if (!cut) break
    }
    if (pts.length === 3) out.push([pts[0], pts[1], pts[2]])
    return out
  }

  /** Walls round a ring, from z0 to the height z1 (a number or a function of x, y). */
  walls(part: Part, ring: XY[], z0: number, z1: number | ((x: number, y: number) => number)) {
    const r = Kit.ccw(ring), h = typeof z1 === 'number' ? () => z1 : z1
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-6) continue
      part.quad(this.P(a[0], a[1], z0), this.P(b[0], b[1], z0), this.P(b[0], b[1], h(b[0], b[1])), this.P(a[0], a[1], h(a[0], a[1])))
    }
  }
  /** A top over a ring at a height (a number, or a plane given as a function). */
  top(part: Part, ring: XY[], z: number | ((x: number, y: number) => number), up = true) {
    const h = typeof z === 'number' ? () => z : z
    for (const [a, b, c] of Kit.earcut(Kit.ccw(ring))) {
      const [p, q, r] = [this.P(a[0], a[1], h(a[0], a[1])), this.P(b[0], b[1], h(b[0], b[1])), this.P(c[0], c[1], h(c[0], c[1]))]
      if (up) part.tri(p, q, r)
      else part.tri(p, r, q)
    }
  }
  /** A prism: walls and top (and optionally a bottom) over a ring. */
  prism(part: Part, ring: XY[], z0: number, z1: number | ((x: number, y: number) => number), topPart: Part | null = part, bottom = false) {
    this.walls(part, ring, z0, z1)
    if (topPart) this.top(topPart, ring, z1)
    if (bottom) this.top(part, ring, z0, false)
  }
  /** An axis-aligned box. */
  box(part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, topPart: Part | null = part, bottom = false) {
    this.prism(part, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1, topPart, bottom)
  }
  /** A flat panel on the face a→b (outward to the right): fractions s0..s1, heights z0..z1. */
  panel(part: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, off = 0.06) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy)
    const n: XY = [(dy / L) * off, (-dx / L) * off]
    const p = (s: number): XY => [a[0] + dx * s + n[0], a[1] + dy * s + n[1]]
    const [p0, p1] = [p(s0), p(s1)]
    part.quad(this.P(p0[0], p0[1], z0), this.P(p1[0], p1[1], z0), this.P(p1[0], p1[1], z1), this.P(p0[0], p0[1], z1))
  }
  /** A square-section bar from a to b, w wide. */
  bar(part: Part, a: V3, b: V3, w: number) {
    const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
    const L = Math.hypot(...d)
    const t: V3 = [d[0] / L, d[1] / L, d[2] / L]
    const ref: V3 = Math.abs(t[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
    const cx = (u: V3, v: V3): V3 => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    const nz = (u: V3): V3 => { const l = Math.hypot(...u); return [u[0] / l, u[1] / l, u[2] / l] }
    const u = nz(cx(t, ref)), v = nz(cx(t, u))
    const h = w / 2
    const ring = (p: V3) => [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([s, r]) => this.P(p[0] + (u[0] * s + v[0] * r) * h, p[1] + (u[1] * s + v[1] * r) * h, p[2] + (u[2] * s + v[2] * r) * h))
    const A = ring(a), B = ring(b)
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      part.tri(A[i], A[j], B[j]); part.tri(A[i], B[j], B[i])
      part.tri(A[i], B[j], A[j]); part.tri(A[i], B[i], B[j])
    }
  }
}

/** The shared colours of the 2006–08 buildings, from the daylight photos. */
export const CC = {
  panel: finish('pcc-panel', 0xd3c9b5),
  metal: finish('pcc-metal', 0xbfc2c1),
  rust: finish('pcc-rust', 0xa8644f),
  sand: finish('pcc-sand', 0xdcb88f),
  window: { ...PALETTE.window, color: 0x67878f } as Swatch,
  roof: finish('pcc-roof', 0xdcdcd6),
}

/** A striped stair tower: sand with bold rust bands, on a rectangle. */
export function stairTower(k: Kit, sand: Part, rust: Part, roof: Part, x0: number, x1: number, y0: number, y1: number, h: number) {
  k.box(sand, x0, x1, y0, y1, 0, h, roof)
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4]
    for (let z = 2.5; z + 2 < h; z += 4.4) k.panel(rust, a, b, 0, 1, z, z + 2.2, 0.05)
  }
}

/**
 * The louvred canopy: slats running out from the wall at x = xw to the
 * outer edge xo, along y0..y1, top at zt(x); a fascia girder on the outer
 * edge, cross girders and raking struts back to the wall.
 */
export function canopy(k: Kit, metal: Part, xw: number, xo: number, y0: number, y1: number, zt: (x: number) => number, strutZ: number) {
  const s = Math.sign(xo - xw)
  // slats every 3 m, 1.4 m wide, 0.5 m deep
  for (let y = y0 + 0.7; y <= y1 - 0.7 + 1e-6; y += 3) {
    const r: XY[] = [[Math.min(xw, xo), y - 0.7], [Math.max(xw, xo), y - 0.7], [Math.max(xw, xo), y + 0.7], [Math.min(xw, xo), y + 0.7]]
    // a sloped slab between zt - 0.5 and zt
    const ring = Kit.ccw(r)
    for (let i = 0; i < 4; i++) {
      const a = ring[i], b = ring[(i + 1) % 4]
      metal.quad(k.P(a[0], a[1], zt(a[0]) - 0.5), k.P(b[0], b[1], zt(b[0]) - 0.5), k.P(b[0], b[1], zt(b[0])), k.P(a[0], a[1], zt(a[0])))
    }
    k.top(metal, r, (x) => zt(x))
    k.top(metal, r, (x) => zt(x) - 0.5, false)
  }
  // the fascia girder on the outer edge and a girder along the wall
  const xf0 = xo - s * 1.2
  k.prism(metal, Kit.ccw([[Math.min(xf0, xo), y0], [Math.max(xf0, xo), y0], [Math.max(xf0, xo), y1], [Math.min(xf0, xo), y1]]), zt(xo) - 3, zt(xo) + 0.2, metal, true)
  // cross girders and raking struts every ~15 m
  const n = Math.max(2, Math.round((y1 - y0) / 15))
  for (let i = 0; i <= n; i++) {
    const y = y0 + 0.6 + ((y1 - y0 - 1.2) * i) / n
    k.bar(metal, [xw, y, zt(xw) - 1.2], [xo, y, zt(xo) - 1.2], 1.0)
    k.bar(metal, [xw + s * 0.5, y, strutZ], [xo - s * 1.0, y, zt(xo) - 3], 0.8)
  }
}

/** Write a model, checking the budget. */
export async function write(id: string, name: string, frame: string, parts: { part: Part; material: MaterialSpec }[]) {
  const used = parts.filter((p) => p.part.triangles > 0)
  const triangles = used.reduce((s, p) => s + p.part.triangles, 0)
  if (used.length > 6) throw new Error(`${id}: ${used.length} materials`)
  if (triangles > 5000) throw new Error(`${id}: ${triangles} triangles`)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame })
  if (glb.length > 250_000) throw new Error(`${id}: ${glb.length} bytes`)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(used.map((p) => `${p.material.name}: ${p.part.triangles}`).join(', '))
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

// ── The West Building ───────────────────────────────────────────────────
if (import.meta.main) {
  const ID = 'phx-convention-center-west'
  const k = new Kit([80.2, -119.4])
  const panel = new Part(), metal = new Part(), rust = new Part(), sand = new Part(), win = new Part(), roof = new Part()

  // The hall: x -125.5..-41, y 87..175, roof rising east 29.6 → 33.8.
  const XW = -125.5, XE = -41, SKIN = 24
  const zr = (x: number) => 29.6 + ((33.8 - 29.6) * (x - XW)) / (XE - XW)
  const hall: XY[] = [[XW, 87], [XE, 87], [XE, 175], [XW, 175]]
  k.walls(panel, hall, 0, SKIN)
  k.walls(metal, hall, SKIN, (x) => zr(x))
  k.top(roof, hall, (x) => zr(x))
  // The south block, y 62.5..87, flat at 28; its west end follows OSM's
  // notched outline.
  const south: XY[] = [[-121, 65.5], [-85, 62.5], [XE, 62.5], [XE, 87], [-105.3, 87], [-105.3, 77.8], [-116.6, 75]]
  k.walls(panel, south, 0, 22)
  k.walls(metal, south, 22, 28)
  k.top(roof, south, 28)
  // the sandstone base band round both, with one rust stripe
  for (const ring of [hall, south]) {
    const r = Kit.ccw(ring)
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      if (a[0] === XE && b[0] === XE) continue // the 3rd St face has the lobbies
      k.panel(sand, a, b, 0, 1, 0, 5.5, 0.08)
      k.panel(rust, a, b, 0, 1, 2.2, 3.6, 0.12)
    }
  }
  // A broad recessed window band high on the north and west faces (n21).
  k.panel(win, [XE, 175], [XW, 175], 0.12, 0.62, 14, 18)
  k.panel(win, [XW, 175], [XW, 87], 0.1, 0.9, 14, 17)

  // The 3rd St face (x -41): glass lobby boxes to x -37.7 between striped
  // stair towers, under the canopy.
  const towers = [91, 118, 145, 171]
  for (const y of towers) stairTower(k, sand, rust, roof, -41, -37, y - 4, y + 4, 21)
  for (let i = 0; i < towers.length - 1; i++) {
    const y0 = towers[i] + 4, y1 = towers[i + 1] - 4
    k.box(win, -41, -37.9, y0, y1, 0, 24, roof)
  }
  // the lobby south of the first tower, at the skybridge
  k.box(win, -41, -37.7, 73, 87, 0, 24, roof)
  canopy(k, metal, XE, -16, 72, 175, (x) => 33.6 + (0.4 * (x - XE)) / (-16 - XE), 18)

  // The wedge canopy over the south entrance: a sloped white slab south
  // of the block, rising from 3.5 m at x -112 to 26 at x -80, flat on to
  // the lobby.
  {
    const zw = (x: number) => (x < -80 ? 3.5 + (22.5 * (x + 112)) / 32 : 26)
    const r: XY[] = [[-112, 60.5], [-80, 57.8], [-46.5, 56.3], [-46.5, 62.4], [-85, 62.4], [-112, 64.6]]
    const pts = Kit.ccw(r)
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length]
      roof.quad(k.P(a[0], a[1], zw(a[0]) - 1), k.P(b[0], b[1], zw(b[0]) - 1), k.P(b[0], b[1], zw(b[0])), k.P(a[0], a[1], zw(a[0])))
    }
    k.top(roof, r, zw)
    k.top(roof, r, (x) => zw(x) - 1, false)
  }

  await write(ID, 'Phoenix Convention Center West Building',
    'Y up, -Z north, +X east, metres; origin on the ground at the outline centroid (-112.0706636, 33.4497758); bearing 0', [
      { part: panel, material: CC.panel },
      { part: metal, material: CC.metal },
      { part: rust, material: CC.rust },
      { part: sand, material: CC.sand },
      { part: win, material: CC.window },
      { part: roof, material: CC.roof },
    ])
}
