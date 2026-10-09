/**
 * Manhattan Bridge towers (1909; Leon Moisseiff, Gustav Lindenthal; portal
 * design by Carrère and Hastings) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-manhattan-bridge.ts
 *
 * One tower, placed twice (Manhattan and Brooklyn; OSM maps both with the
 * same 37-node outline, identical to 0.1 m). Map frame: x across the bridge,
 * y along it, z up, metres; origin at the centre of the pier on the water.
 * Placed at bearing 337.0°, the line from the Brooklyn tower's centroid to
 * the Manhattan one's (443.9 m apart; the published main span is 448 m).
 * Only the tower and its pier: no cables, and the deck is a stub no deeper
 * than the tower, so the map's own bridge line carries the span.
 *
 * What makes it the Manhattan Bridge: four slender steel columns in one
 * plane, the outer pairs filled with stacked X bracing, the open centre bay
 * topped by a tall semicircular arch, a heavy cornice across the top with
 * four ball finials, columns flaring out onto a granite pier, blue-grey paint.
 *
 * Sources:
 * - OSM: tower outlines way/1255353996 (Manhattan) and way/317352033
 *   (Brooklyn), bridge:support=pylon, height 102, colour #8eb4d2; piers
 *   way/1255353997 and way/1016640944 (man_made=pier, 42.7 x 20.3 m). Plan
 *   from the outline in the bridge frame: 36.2 x 7.6 m, columns at
 *   |x| 4.4–8.1 and 12.5–16.5, the bays between them set in 0.8 m.
 * - Lidar (USGS 3DEP NY_NewYorkCity 2017, 0.5 m, Manhattan tower; heights
 *   above the water at -0.84 m NAVD88): cornice top 98.6 m, 36 m across;
 *   finial tops 103.7 m over each column, pier top 6–8 m, the lower level's
 *   outer paths 42.7 m and the upper roadways 48.9 m.
 * - Published: towers 336 ft (102 m) above mean high water; 135 ft (41 m)
 *   navigational clearance (Wikipedia "Manhattan Bridge"; NYC DOT).
 * - Photos (Wikimedia Commons): "Manhattan Bridge tower, Dumbo, Brooklyn,
 *   New York" (Christian David, CC BY-SA 4.0; the Brooklyn tower three-
 *   quarter, flared column feet, pier); "NYC Manhattan Bridge detail" (Arnoldius,
 *   CC BY-SA 3.0; portal face end-on: X bays, arch, cornice, finials); "Manhattan Bridge
 *   and One Manhattan Square from Brooklyn Bridge, 20231005" (Jakub Hałun,
 *   CC BY-SA 4.0; the Manhattan tower face-on from the south-west); "Manhattan
 *   Bridge from the Brooklyn Bridge (6214687229)" (Tony Hisgett,
 *   CC BY 2.0; side view); HAER
 *   NY,31-NEYO,164-11 "Manhattan tower looking northwest" (Jet Lowe, public
 *   domain; portal from above).
 * - Column centre lines from the lidar's finial peaks (|x| 6.1 and 14.55);
 *   column width 3.4 m from the end-on photo (OSM draws 3.7–4.0 m, which
 *   leaves the X bays narrower than the photos show).
 * - Estimated from photos: five X panels above the deck and two below, the
 *   arch spring (85 m, about 73% of the way from the upper roadway to the
 *   cornice), the lattice frieze (92–96.6 m) and the cornice projecting
 *   about 2 m past the outer columns, the column feet's flare (to about 1.8x
 *   the column depth at the pier), the finial pedestals and balls.
 * - Colour: the blue-grey paint from sunlit daylight photos (#7f97a6 to
 *   #93a8b4), pulled to the palette's lightness; the bracing a shade deeper
 *   so the X panels read against the columns; the pier's granite buff.
 *
 * The geometry helpers below are shared with the Williamsburg and
 * Queensboro bridge generators.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { finish, type Swatch } from './palette'

// ---- Shared helpers ----------------------------------------------------------

export const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
export const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]

/** Corners of a plan rectangle with chamfered corners (r = 0: plain), CCW from above. */
export function rim(x0: number, x1: number, y0: number, y1: number, r: number, z: number): V3[] {
  if (r <= 0) return [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  return [[x0 + r, y0, z], [x1 - r, y0, z], [x1, y0 + r, z], [x1, y1 - r, z],
    [x1 - r, y1, z], [x0 + r, y1, z], [x0, y1 - r, z], [x0, y0 + r, z]]
}

/** A closed prism lofted through rings (each CCW from above, i.e. from the far end), capped. */
export function loftSolid(p: Part, rings: V3[][], caps = [true, true]) {
  const n = rings[0].length
  for (let k = 0; k < rings.length - 1; k++) for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    p.quad(rings[k][i], rings[k][j], rings[k + 1][j], rings[k + 1][i])
  }
  const fan = (ring: V3[], flip: boolean) => {
    const pts = flip ? [...ring].reverse() : ring
    for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1])
  }
  if (caps[1]) fan(rings[rings.length - 1], false)
  if (caps[0]) fan(rings[0], true)
}

/** An upright box with chamfered vertical edges (r) and optional chamfered top/bottom edges. */
export function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number,
  { r = 0.3, top = 0, bot = 0, bottom = true, lid = p }: { r?: number; top?: number; bot?: number; bottom?: boolean; lid?: Part } = {}) {
  const rings: V3[][] = []
  if (bot > 0) rings.push(rim(x0 + bot, x1 - bot, y0 + bot, y1 - bot, Math.max(0.05, r - bot * 0.4), z0))
  rings.push(rim(x0, x1, y0, y1, r, z0 + bot))
  rings.push(rim(x0, x1, y0, y1, r, z1 - top))
  if (top > 0) rings.push(rim(x0 + top, x1 - top, y0 + top, y1 - top, Math.max(0.05, r - top * 0.4), z1))
  loftSolid(p, rings, [bottom, false])
  const last = rings[rings.length - 1]
  for (let i = 1; i < last.length - 1; i++) lid.tri(last[0], last[i], last[i + 1])
}

/** A straight member from a to b with a w x t rectangular section (t measured along `side`). */
export function beam(p: Part, a: V3, b: V3, w: number, t: number, side: V3 = [0, 1, 0]) {
  const d = norm(sub(b, a))
  const S = norm(sub(side, mul(d, side[0] * d[0] + side[1] * d[1] + side[2] * d[2])))
  const W = cross(S, d)
  const section = (o: V3): V3[] => [[-1, -1], [1, -1], [1, 1], [-1, 1]]
    .map(([u, v]) => add(o, add(mul(W, u * w / 2), mul(S, v * t / 2))))
  loftSolid(p, [section(a), section(b)])
}

/**
 * An X-braced panel in a vertical plane y = yc, between x0..x1 and z0..z1:
 * two broad diagonal plates, clipped to the panel so nothing pokes past it.
 */
export function xPanel(p: Part, x0: number, x1: number, z0: number, z1: number, yc: number, w: number, t: number) {
  // Each diagonal is a parallelogram whose vertical ends sit on the panel's sides.
  const h = (w / 2) * Math.hypot(x1 - x0, z1 - z0) / (x1 - x0) // vertical half-thickness of a plate
  for (const [za, zb] of [[z0, z1], [z1, z0]]) {
    const lo = (z: number) => Math.max(z0, Math.min(z1, z))
    const f: V3[] = [[x0, yc - t / 2, lo(za - h)], [x1, yc - t / 2, lo(zb - h)], [x1, yc - t / 2, lo(zb + h)], [x0, yc - t / 2, lo(za + h)]]
    const b: V3[] = f.map(([x, , z]) => [x, yc + t / 2, z] as V3)
    // Faces: front (-y), back (+y), top and bottom edges.
    p.quad(f[0], f[1], f[2], f[3]); p.quad(b[0], b[3], b[2], b[1])
    p.quad(f[3], f[2], b[2], b[3]); p.quad(f[0], b[0], b[1], f[1])
  }
}

/** A UV sphere (segments around, rings pole to pole). */
export function ball(p: Part, c: V3, r: number, seg = 12, rings = 8) {
  const pt = (i: number, j: number): V3 => {
    const th = (2 * Math.PI * i) / seg, ph = Math.PI * (j / rings - 0.5)
    return [c[0] + r * Math.cos(ph) * Math.cos(th), c[1] + r * Math.cos(ph) * Math.sin(th), c[2] + r * Math.sin(ph)]
  }
  for (let j = 0; j < rings; j++) for (let i = 0; i < seg; i++) {
    const a = pt(i, j), b = pt(i + 1, j), cc = pt(i + 1, j + 1), d = pt(i, j + 1)
    const n = (q: V3) => norm(sub(q, c))
    if (j > 0) p.tri(a, b, cc, undefined, undefined, undefined, [n(a), n(b), n(cc)])
    if (j < rings - 1) p.tri(a, cc, d, undefined, undefined, undefined, [n(a), n(cc), n(d)])
  }
}

/**
 * A wall slab between x0..x1, y0..y1 from the semicircular arch (centre xc,
 * spring zs, radius r) up to z1: the spandrels over an arched opening, with
 * the intrados drawn through the slab's depth in `soffit`.
 */
export function archWall(p: Part, soffit: Part, x0: number, x1: number, y0: number, y1: number,
  xc: number, zs: number, r: number, z1: number, seg = 12) {
  const arc = (i: number): [number, number] => {
    const th = Math.PI - (Math.PI * i) / seg
    return [xc + r * Math.cos(th), zs + r * Math.sin(th)]
  }
  for (let i = 0; i < seg; i++) {
    const [xa, za] = arc(i), [xb, zb] = arc(i + 1)
    // Front (y0, faces -y) and back (y1, faces +y) faces, strip by strip.
    p.quad([xa, y0, za], [xb, y0, zb], [xb, y0, z1], [xa, y0, z1])
    p.quad([xb, y1, zb], [xa, y1, za], [xa, y1, z1], [xb, y1, z1])
    const na: V3 = [xc - xa, 0, zs - za], nb: V3 = [xc - xb, 0, zs - zb]
    soffit.tri([xa, y0, za], [xa, y1, za], [xb, y1, zb], undefined, undefined, undefined, [norm(na), norm(na), norm(nb)])
    soffit.tri([xa, y0, za], [xb, y1, zb], [xb, y0, zb], undefined, undefined, undefined, [norm(na), norm(nb), norm(nb)])
  }
  // Haunches between the arch's feet and the slab's sides, front and back.
  for (const [y, s] of [[y0, 1], [y1, -1]] as [number, number][]) {
    const q = (a: V3, b: V3, c: V3, d: V3) => s > 0 ? p.quad(a, b, c, d) : p.quad(d, c, b, a)
    q([x0, y, zs], [xc - r, y, zs], [xc - r, y, z1], [x0, y, z1])
    q([xc + r, y, zs], [x1, y, zs], [x1, y, z1], [xc + r, y, z1])
  }
  p.quad([x0, y1, zs], [x0, y0, zs], [x0, y0, z1], [x0, y1, z1])
  p.quad([x1, y0, zs], [x1, y1, zs], [x1, y1, z1], [x1, y0, z1])
  // Flat undersides beside the arch.
  for (const [a, b] of [[x0, xc - r], [xc + r, x1]]) if (b - a > 0.01) p.quad([a, y0, zs], [a, y1, zs], [b, y1, zs], [b, y0, zs])
}

export const countParts = (parts: { part: Part }[]) => parts.reduce((s, p) => s + p.part.triangles, 0)

// ---- The Manhattan Bridge tower ---------------------------------------------

if (import.meta.main) {
  const steel = new Part()   // columns, cornice, finials
  const brace = new Part()   // X bracing and spandrels, a shade deeper
  const granite = new Part() // pier
  const road = new Part()    // deck stub

  // Heights (m above the water).
  const PIER = 6.2, COPE = 7.0, PED = 8.6   // pier, coping, granite pedestal under the columns
  const FLARE = 30                           // the column feet flare out below this
  const DECK0 = 36.0, DECK = 42.7, UPPER = 48.9 // deck stub: underside, lower level's outer paths, upper roadways
  const LAT0 = 49.0                          // bracing above the deck starts at the truss tops
  const SPRING = 85.0                        // centre arch
  const COR0 = 92.0, FRIEZE = 96.6, COR1 = 98.6 // lattice frieze under the cornice, cornice
  const CAPTOP = 101.2, FIN = 103.7         // finial pedestals, ball tops

  // Plan (OSM, bridge frame).
  const COLS = [6.1, 14.55]  // column centre lines, |x| (lidar: the finials)
  const CW = 1.7             // column half-width (x); OSM draws 1.9-2.0, photos ~1.7
  const CD = 3.8             // column half-depth (y)
  const BY = 3.0             // bracing planes, |y|
  const INNER = COLS[0] - CW // centre bay half-width: 4.4

  // Pier and pedestal.
  box(granite, -21.4, 21.4, -10.15, 10.15, 0, PIER, { r: 0.8, bottom: false })
  box(granite, -20.8, 20.8, -9.55, 9.55, PIER, COPE, { r: 0.6, top: 0.3, bottom: false })
  box(granite, -18.9, 18.9, -7.0, 7.0, COPE, PED, { r: 0.5, top: 0.35, bottom: false })

  // Columns: flared feet, then straight shafts up to the cornice.
  for (const s of [-1, 1]) for (const cx of COLS) {
    const x = s * cx
    const rings: V3[][] = []
    for (let k = 0; k <= 5; k++) {
      const t = k / 5, f = (1 - t) * (1 - t)
      const z = PED + (FLARE - PED) * t
      const hw = CW + 0.6 * f, hd = CD + 3.0 * f
      rings.push(rim(x - hw, x + hw, -hd, hd, 0.35, z))
    }
    rings.push(rim(x - CW, x + CW, -CD, CD, 0.35, COR0))
    loftSolid(steel, rings, [false, false])
  }

  // Deck stub through the tower: no longer than the tower is deep.
  // Steel sides in the bracing's shade, the roadway on top.
  box(brace, -18.4, 18.4, -4.6, 4.6, DECK0, DECK, { r: 0.3, bottom: true, lid: road })
  box(brace, -COLS[1] + CW, COLS[1] - CW, -4.6, 4.6, DECK, UPPER, { r: 0.2, bottom: false, lid: road })
  // Under the deck the centre bay is closed by an arched portal brace.
  archWall(brace, brace, -INNER, INNER, -BY - 0.4, BY + 0.4, 0, DECK0 - 8.5, INNER, DECK0, 10)

  // X bracing in the outer bays, on both faces: five panels above the deck, two below.
  const bx0 = COLS[0] + CW, bx1 = COLS[1] - CW
  const bays = (z0: number, z1: number, n: number) => {
    const h = (z1 - z0) / n
    for (let k = 0; k <= n; k++) {
      const z = z0 + k * h
      for (const s of [-1, 1]) for (const y of [-BY, BY])
        box(brace, s > 0 ? bx0 : -bx1, s > 0 ? bx1 : -bx0, y - 0.35, y + 0.35, z - 0.6, z + 0.6, { r: 0 })
    }
    for (let k = 0; k < n; k++) for (const s of [-1, 1]) for (const y of [-BY, BY]) {
      const za = z0 + k * h + 0.6, zb = z0 + (k + 1) * h - 0.6
      xPanel(brace, s > 0 ? bx0 : -bx1, s > 0 ? bx1 : -bx0, za, zb, y, 1.1, 0.6)
    }
  }
  bays(LAT0, COR0 - 0.6, 5)
  bays(PED + 4, DECK0, 2)

  // The centre bay: open to the arch, spandrels above it up to the cornice.
  archWall(brace, brace, -INNER, INNER, -BY - 0.4, BY + 0.4, 0, SPRING, INNER, COR0, 12)
  // Arch ring: a raised band on each face, the paint's lit colour.
  for (const [y, d] of [[-BY - 0.4, -1], [BY + 0.4, 1]] as [number, number][]) {
    const seg = 12, r0 = INNER, r1 = INNER + 0.9
    for (let i = 0; i < seg; i++) {
      const a0 = Math.PI - (Math.PI * i) / seg, a1 = Math.PI - (Math.PI * (i + 1)) / seg
      const P = (r: number, a: number, yy: number): V3 => [r * Math.cos(a), yy, SPRING + r * Math.sin(a)]
      const yo = y + d * 0.3
      const q = (a: V3, b: V3, c: V3, e: V3) => d < 0 ? steel.quad(a, b, c, e) : steel.quad(e, c, b, a)
      q(P(r0, a0, yo), P(r0, a1, yo), P(r1, a1, yo), P(r1, a0, yo))                // face
      q(P(r1, a0, y), P(r1, a0, yo), P(r1, a1, yo), P(r1, a1, y))                  // outer edge
      q(P(r0, a1, y), P(r0, a1, yo), P(r0, a0, yo), P(r0, a0, y))                  // inner edge
    }
  }

  // Cornice across the top: a frieze, then a projecting lip.
  // The lattice frieze, with the columns' capitals standing proud of it.
  box(brace, -COLS[1] - CW, COLS[1] + CW, -3.7, 3.7, COR0, FRIEZE, { r: 0.2, bottom: true })
  for (const s of [-1, 1]) for (const cx of COLS)
    box(steel, s * cx - CW - 0.25, s * cx + CW + 0.25, -CD - 0.25, CD + 0.25, COR0 - 0.4, FRIEZE, { r: 0.35, bot: 0.3, bottom: true })
  // The cornice projects about 2 m past the outer columns (photos; lidar 36 m across).
  box(steel, -18.2, 18.2, -4.7, 4.7, FRIEZE, COR1, { r: 0.5, top: 0.3, bot: 0.5, bottom: true })

  // Finials over each column: a stepped pedestal and a ball.
  const BR = 1.25
  for (const s of [-1, 1]) for (const cx of COLS) {
    const x = s * cx
    box(steel, x - 1.6, x + 1.6, -2.6, 2.6, COR1, COR1 + 0.9, { r: 0.3, top: 0.25, bottom: false })
    box(steel, x - 0.9, x + 0.9, -1.3, 1.3, COR1 + 0.9, CAPTOP, { r: 0.25, top: 0.2, bottom: false })
    ball(steel, [x, 0, FIN - BR], BR, 12, 8)
  }

  const STEEL: Swatch = finish('bridge-blue-grey', 0x8ea3b0)
  const BRACE: Swatch = finish('bridge-blue-grey-shade', 0x768c9b)
  const GRANITE: Swatch = finish('granite', 0xd6c8b2)
  const ROAD: Swatch = finish('deck', 0x7f8489)
  const parts = [
    { part: steel, material: STEEL }, { part: brace, material: BRACE },
    { part: granite, material: GRANITE }, { part: road, material: ROAD },
  ]
  const triangles = countParts(parts)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Manhattan Bridge tower', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the pier centre on the water',
    height: FIN, bearing: 337.0, elevation: 0,
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  await Bun.write(new URL('../models/nyc-manhattan-bridge.glb', import.meta.url), glb)
  console.log(`nyc-manhattan-bridge.glb: ${triangles} triangles, ${glb.length} bytes`)
}
