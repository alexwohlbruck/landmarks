/**
 * Comcast Center, Philadelphia (Robert A.M. Stern Architects, 2008) —
 * original procedural geometry, CC0-1.0.
 * bun generators/phl-comcast-center.ts
 *
 * Also exports the small geometry kit (bevelled boxes, bands, flush panels,
 * polygon prisms and lofts, the GLB writer) used by the other Market West
 * tower generators of this batch (phl-bny-mellon-center,
 * phl-three-logan-square, phl-one-commerce-square, phl-two-commerce-square).
 * Its own build runs only under `import.meta.main`.
 *
 * Map frame, turned to the building: +x runs east along JFK Boulevard
 * (east-south-east), +y north toward Arch Street, z up, metres. BEARING 9.0:
 * the Center City grid is turned 9 degrees clockwise of north (every edge of
 * the OSM outline runs at 9.0 or 99.0 degrees). Origin = area centroid of the
 * OSM outline way/42785026 (-75.168615, 39.954736), on the ground.
 *
 * Form. A glass tower on a notched cross plan: a 44 x 26 m core runs to the
 * top, and each face carries a shallower wing that stops lower, so every
 * corner is a re-entrant notch running the full height (the "stepped
 * vertical strips" of the corners), where the core's darker glass shows. The
 * broad north and south wings stop at 267 m and the narrow east and west
 * wings at 251 m. Above them the core rises another 30 m as the crown: an
 * open lattice of steel and glass, paler than the faces, with a projecting
 * pale lip. Each broad wing has a big square opening just below its top (the
 * dark "window" in every photo of the top), a void through the wing to the
 * core. On JFK Boulevard the south face carries a five-metre-deep glass block
 * to 80 m (coarse pale grid), and in front of it the Winter Garden: a 39 m
 * glass box with a deep frame grid, and its entrance canopy. Low glass and
 * metal pavilions fill the west end of the lot (toward 18th St).
 *
 * Evidence
 * - OSM way/42785026 (outline, Comcast Center, wikidata Q1113808) and its
 *   parts: way/333339072 (core, 296.7 m, 57 levels), way/336855440 and
 *   way/336855442 (south and north wings, 266.7 m), way/336855449 and
 *   way/336855450 (east and west wings, 269.7 m), way/336855451 (south block,
 *   69 m), way/336855441 (Winter Garden, 34 m, glass roof), way/336875906
 *   (canopy), way/336855448, way/336875907, way/336875908 (west pavilions, no
 *   height). All are replaced.
 * - USGS 3DEP lidar USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown 2015),
 *   0.5 m grid in this frame; heights above the Arch Street ground (the lowest
 *   ground under the footprint, 3.6 m above the box minimum): core roof
 *   297.2 m (published 296.7 m / 974 ft), north and south wing roofs 267.2 m,
 *   east and west wing roofs 251.4 m (OSM's 269.7 is wrong for these two),
 *   south block 80.4 m, Winter Garden roof 39.2 m, canopy 16.5 m, west
 *   pavilions 11.5-16.5 m. The plan extents of the core and wings come from
 *   the same grid and agree with the OSM parts to within a metre. The wing
 *   faces are vertical: the notches show bare ground within a metre of the
 *   wing roof edges, so the "taper" seen in photos is the notched corners and
 *   the perspective, not leaning faces. The crown lattice is mostly open;
 *   the lidar reads the core roof inside it at 297.2 m.
 * - Mapterhorn terrain: the site rises about 3 m from Arch Street (north) to
 *   JFK Boulevard (south); ordinary sloped site, elevation 0. The Winter
 *   Garden and canopy stand on the JFK side, so they are drawn from y = 0 and
 *   their heights include the 2.5 m of slope.
 * - Published: 974 ft (297 m), 58 storeys, Robert A.M. Stern Architects,
 *   2005-2008; the 110 ft Winter Garden at 17th St and JFK Blvd (Wikipedia,
 *   "Comcast Center (Philadelphia)").
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 * - "Comcast Center a.jpg", "b.jpg", "c.jpg", "d.jpg", Wobbanight, CC0 (the
 *   south and south-east faces from below: notches, shoulders, the square
 *   opening, the south block and Winter Garden grids)
 *   https://commons.wikimedia.org/wiki/File:Comcast_Center_b.jpg
 * - "Comcast Philly.JPG", Smallbones, public domain (south face from JFK)
 *   https://commons.wikimedia.org/wiki/File:Comcast_Philly.JPG
 * - "Comcast Center 2018.jpg", TastyPoutine, CC BY-SA 4.0 (south-east)
 *   https://commons.wikimedia.org/wiki/File:Comcast_Center_2018.jpg
 * - "Center City - Comcast Center (53587020610).jpg", ajay_suresh, CC BY 2.0
 *   (from City Hall, south-east, telephoto: crown, shoulders, glass colour)
 *   https://commons.wikimedia.org/wiki/File:Center_City_-_Comcast_Center_(53587020610).jpg
 * - "View down Arch Street, Philadelphia, towards Comcast Center from near
 *   City Hall.jpg", Daniel Case, CC BY-SA 4.0 (east, crown colour)
 *   https://commons.wikimedia.org/wiki/File:View_down_Arch_Street,_Philadelphia,_towards_Comcast_Center_from_near_City_Hall.jpg
 * - "Comcast Centers in Philadelphia.jpg", Chapsam, CC BY-SA 4.0 (from the
 *   north-west, across the Schuylkill)
 *   https://commons.wikimedia.org/wiki/File:Comcast_Centers_in_Philadelphia.jpg
 * - "Comcast Center from Pennwalt - panoramio.jpg", Bohao Zhao, CC BY 3.0
 *   (north-east, from 17th St)
 *   https://commons.wikimedia.org/wiki/File:Comcast_Center_from_Pennwalt_-_panoramio.jpg
 *
 * Estimated: the square openings (22 m wide, 229-255 m, centred on the north
 * and south wings; scaled from the Case crop (east) and Wobbanight b, where
 * they span about 0.6 of the face); the top lip 1.6 m tall and 0.5 m proud; the
 * lattice grid (about 5.4 x 6 m) and the crown's base at the 267 m wing roofs
 * (Case and ajay_suresh crops); the curtain wall drawn as glass with faint lines a step
 * lighter (verticals about every 9.5 m, floor lines every 40 m), as the
 * lead's notes ask; the south block's and Winter Garden's coarse frame grids
 * (counted from Wobbanight b and c: 4 bays across the block, 6 across the
 * Winter Garden); the west pavilions' faces (no good photo; drawn plain).
 *
 * Colours (daylight photos, pulled to the palette's lightness): the curtain
 * wall a clear, reflective sky blue (window-2 #7f9fbf), lighter than the
 * Comcast Technology Center's deep blue (#5a7ca6) next door, as in the sunny
 * ajay_suresh photo; the crown lattice a paler
 * silver-grey glass (window-3 #b2c0c2), as they read against the sky from City
 * Hall; the frame grids, lattice and the top lip a pale silver; the core, set back in the
 * corner notches and seen through the openings, a darker grey glass
 * (window-4 #5f7387), as it reads in shadow in every photo.
 *
 * Night: the office curtain wall glows (window-2). The crown is lit at night
 * (in white and in event colours, by common report; no licensed night photo
 * was checked); it is a window material (window-3) so it glows, not in a
 * fixed colour. The
 * darker core glass is office glazing too and glows.
 *
 * Doubts: the exact height and size of the square openings; the crown is
 * drawn closed (a pale gridded box) where the real one is an open lattice
 * that shows the sky through it; the west pavilions are simplified to five
 * blocks from the lidar, with no good photo of them.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

// =====================================================================
// Shared kit (exported): z-up map frame, metres.
// =====================================================================

export const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return v.map((n) => n / l) as V3 }
export type P2 = [number, number]
export type Ring = { p: P2[]; n: V3[][] } // points CCW from above, per-edge [start, end] normals

/** A rectangle with chamfered corners, counter-clockwise from above, with smooth bevel normals. */
export function rect(x0: number, x1: number, y0: number, y1: number, b = 0.5): Ring {
  const p: P2[] = [
    [x0 + b, y0], [x1 - b, y0], [x1, y0 + b], [x1, y1 - b],
    [x1 - b, y1], [x0 + b, y1], [x0, y1 - b], [x0, y0 + b],
  ]
  const face: V3[] = [[0, -1, 0], [1, 0, 0], [0, 1, 0], [-1, 0, 0]]
  const n: V3[][] = []
  for (let i = 0; i < 8; i++) {
    if (i % 2 === 0) { const f = face[i / 2]; n.push([f, f]) }
    else n.push([face[(i - 1) / 2], face[((i + 1) / 2) % 4]])
  }
  return { p, n }
}

/** Any convex or concave polygon (CCW from above), flat-shaded edges. */
export function poly(p: P2[]): Ring {
  const n: V3[][] = p.map((a, i) => {
    const b = p[(i + 1) % p.length]
    const f = unit([b[1] - a[1], -(b[0] - a[0]), 0])
    return [f, f]
  })
  return { p, n }
}

export function walls(part: Part, r: Ring, z0: number, z1: number) {
  const k = r.p.length
  for (let i = 0; i < k; i++) {
    const a = r.p[i], b = r.p[(i + 1) % k], [na, nb] = r.n[i]
    const A: V3 = [a[0], a[1], z0], Bv: V3 = [b[0], b[1], z0], C: V3 = [b[0], b[1], z1], D: V3 = [a[0], a[1], z1]
    part.tri(A, Bv, C, undefined, undefined, undefined, [na, nb, nb])
    part.tri(A, C, D, undefined, undefined, undefined, [na, nb, na])
  }
}

/** Fan cap: fine for convex rings (rect, octagon). */
export function cap(part: Part, r: Ring, z: number, up = true) {
  const pts: V3[] = r.p.map(([x, y]) => [x, y, z])
  const order = up ? pts : [...pts].reverse()
  for (let i = 1; i < order.length - 1; i++) part.tri(order[0], order[i], order[i + 1])
}

export function box(part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part | null = part, b = 0.5) {
  const r = rect(x0, x1, y0, y1, b)
  walls(part, r, z0, z1)
  if (top) cap(top, r, z1, true)
}

/** A prism over a convex ring with an optional top. */
export function prism(part: Part, r: Ring, z0: number, z1: number, top: Part | null = part) {
  walls(part, r, z0, z1)
  if (top) cap(top, r, z1, true)
}

/** Loft between two rings with the same number of points (flat-shaded faces). */
export function loft(part: Part, a: P2[], za: number, b: P2[], zb: number) {
  const k = a.length
  for (let i = 0; i < k; i++) {
    const j = (i + 1) % k
    part.quad([a[i][0], a[i][1], za], [a[j][0], a[j][1], za], [b[j][0], b[j][1], zb], [b[i][0], b[i][1], zb])
  }
}

/** A pale band proud of a rectangular volume's walls, with its top ledge. */
export function band(part: Part, x0: number, x1: number, y0: number, y1: number, z: number, h = 0.9, out = 0.18, b = 0.5) {
  const r = rect(x0 - out, x1 + out, y0 - out, y1 + out, b + out * 0.4)
  walls(part, r, z - h / 2, z + h / 2)
  const inner = rect(x0, x1, y0, y1, b)
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8
    part.quad([...inner.p[i], z + h / 2], [...r.p[i], z + h / 2], [...r.p[j], z + h / 2], [...inner.p[j], z + h / 2])
  }
}

/** A band around any convex ring, offset outward by `out` (approximate by scaling from the centroid). */
export function ringBand(part: Part, p: P2[], z: number, h: number, out: number) {
  const cx = p.reduce((s, q) => s + q[0], 0) / p.length, cy = p.reduce((s, q) => s + q[1], 0) / p.length
  const o: P2[] = p.map(([x, y]) => { const d = Math.hypot(x - cx, y - cy) || 1; return [x + ((x - cx) / d) * out, y + ((y - cy) / d) * out] })
  walls(part, poly(o), z - h / 2, z + h / 2)
  for (let i = 0; i < p.length; i++) {
    const j = (i + 1) % p.length
    part.quad([...p[i], z + h / 2], [...o[i], z + h / 2], [...o[j], z + h / 2], [...p[j], z + h / 2])
  }
  for (let i = 0; i < p.length; i++) {
    const j = (i + 1) % p.length
    part.quad([...o[i], z - h / 2], [...p[i], z - h / 2], [...p[j], z - h / 2], [...o[j], z - h / 2])
  }
}

/**
 * A flat panel on a vertical face. The face runs from (ax, ay) to (bx, by)
 * counter-clockwise (outside on the right when walking a→b seen from above);
 * the panel spans fractions s0..s1 along it and z0..z1, `off` proud.
 */
export function facePanel(part: Part, a: P2, b: P2, s0: number, s1: number, z0: number, z1: number, off = 0.05) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
  const nx = dy / l, ny = -dx / l
  const p = (s: number, z: number): V3 => [a[0] + dx * s + nx * off, a[1] + dy * s + ny * off, z]
  const n: V3 = [nx, ny, 0]
  const A = p(s0, z0), B = p(s1, z0), C = p(s1, z1), D = p(s0, z1)
  part.tri(A, B, C, undefined, undefined, undefined, [n, n, n])
  part.tri(A, C, D, undefined, undefined, undefined, [n, n, n])
}

/** A raised strip (with sides) on a vertical face, for piers and frames: like facePanel but `d` deep. */
export function faceStrip(part: Part, a: P2, b: P2, s0: number, s1: number, z0: number, z1: number, d = 0.4) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
  const ux = dx / l, uy = dy / l, nx = uy, ny = -ux
  const x0 = a[0] + dx * s0, y0 = a[1] + dy * s0, x1 = a[0] + dx * s1, y1 = a[1] + dy * s1
  const pts: P2[] = ccw([[x0, y0], [x1, y1], [x1 + nx * d, y1 + ny * d], [x0 + nx * d, y0 + ny * d]])
  walls(part, poly(pts), z0, z1)
  cap(part, poly(pts), z1, true)
}

/** A horizontal quad facing down (a soffit), from its four corners in any order around. */
export function soffit(part: Part, p: P2[], z: number) {
  const q = ccw(p).reverse(), d: V3 = [0, 0, -1]
  const v = q.map(([x, y]) => [x, y, z] as V3)
  part.tri(v[0], v[1], v[2], undefined, undefined, undefined, [d, d, d])
  part.tri(v[0], v[2], v[3], undefined, undefined, undefined, [d, d, d])
}

/** Make a ring counter-clockwise from above. */
export function ccw(p: P2[]): P2[] {
  let a = 0
  for (let i = 0; i < p.length; i++) { const q = p[i], r = p[(i + 1) % p.length]; a += q[0] * r[1] - r[0] * q[1] }
  return a < 0 ? [...p].reverse() : p
}

/** Faint vertical and horizontal curtain-wall lines on a rectangular volume's four faces. */
export function curtainLines(part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, step = 9.5, floors: number[] = [], w = 0.6, faces = 'nesw') {
  const sides: Array<[string, P2, P2]> = [['s', [x0, y0], [x1, y0]], ['e', [x1, y0], [x1, y1]], ['n', [x1, y1], [x0, y1]], ['w', [x0, y1], [x0, y0]]]
  for (const [k, a, b] of sides) {
    if (!faces.includes(k)) continue
    const l = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = Math.max(1, Math.round(l / step))
    for (let i = 1; i < n; i++) { const s = i / n, hw = w / 2 / l; facePanel(part, a, b, s - hw, s + hw, z0, z1, 0.05) }
    for (const z of floors) facePanel(part, a, b, 0.6 / l, 1 - 0.6 / l, z - w / 2, z + w / 2, 0.05)
  }
}

export type PartSpec = { part: Part; material: MaterialSpec }

/** Check the budget and write models/<id>.glb. */
export async function saveTower(id: string, name: string, parts: PartSpec[], meta: { bearing: number; anchor: { lng: number; lat: number }; height: number; replaces: string[] }, maxTri = 5000) {
  const used = parts.filter(({ part }) => part.triangles > 0)
  const triangles = used.reduce((n, { part }) => n + part.triangles, 0)
  if (triangles > maxTri) throw new Error(`Triangle budget exceeded: ${triangles}`)
  if (used.length > 6) throw new Error(`Too many materials: ${used.length}`)
  const glb = writeGlb(name, used, {
    license: 'CC0-1.0', bearing: meta.bearing, elevation: 0, anchor: [meta.anchor.lat, meta.anchor.lng], height: meta.height,
    frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    replaces: meta.replaces,
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}

// =====================================================================
// Comcast Center
// =====================================================================

if (import.meta.main) {
  const BEARING = 9.0
  const ANCHOR = { lng: -75.168615, lat: 39.954736 }

  const glass = new Part()  // curtain wall (window-2)
  const crown = new Part()  // the crown lattice above the wings (window-3)
  const mull = new Part()   // faint curtain-wall lines
  const frame = new Part()  // pale silver: top lip, coarse frame grids, pavilions
  const roof = new Part()
  const slot = new Part()   // the darker core glass: seen in the corner notches and through the openings (window-4)

  // ---------- heights (lidar, above Arch Street) ----------
  const TOP = 297.2
  const NS = 267.2   // north and south wing roofs
  const EW = 251.4   // east and west wing roofs
  const LIP = 1.6
  const BLOCK = 80.4 // south block
  const WG = 39.2    // Winter Garden
  const CANOPY = 16.5

  // ---------- plan (lidar / OSM parts, this frame) ----------
  const CORE = { x0: -14.0, x1: 29.8, y0: -4.9, y1: 20.9 }
  const S = { x0: -11.8, x1: 27.1, y0: -11.6, y1: CORE.y0 }
  const N = { x0: -11.6, x1: 27.4, y0: CORE.y1, y1: 27.8 }
  const E = { x0: CORE.x1, x1: 38.1, y0: -3.3, y1: 18.8 }
  const W = { x0: -22.3, x1: CORE.x0, y0: -3.3, y1: 18.8 }
  const OPEN = { w: 22, z0: 229, z1: 255 } // the square openings in the broad wings

  // ---------- core: glass to the north/south wing roofs, then the lattice crown ----------
  box(slot, CORE.x0, CORE.x1, CORE.y0, CORE.y1, 0, NS, null)
  box(crown, CORE.x0, CORE.x1, CORE.y0, CORE.y1, NS, TOP - LIP, null, 0.3)
  box(frame, CORE.x0 - 0.5, CORE.x1 + 0.5, CORE.y0 - 0.5, CORE.y1 + 0.5, TOP - LIP, TOP, roof, 0.6)
  band(frame, CORE.x0, CORE.x1, CORE.y0, CORE.y1, NS + 0.5, 1.0, 0.15, 0.3)
  // The crown's open steel-and-glass lattice: a pale grid, about 5 m by 6 m.
  {
    const faces: Array<[P2, P2]> = [
      [[CORE.x0, CORE.y0], [CORE.x1, CORE.y0]], [[CORE.x1, CORE.y0], [CORE.x1, CORE.y1]],
      [[CORE.x1, CORE.y1], [CORE.x0, CORE.y1]], [[CORE.x0, CORE.y1], [CORE.x0, CORE.y0]],
    ]
    for (const [a, b] of faces) {
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.round(l / 5.4)
      for (let i = 1; i < n; i++) facePanel(frame, a, b, i / n - 0.25 / l, i / n + 0.25 / l, NS + 1, TOP - LIP, 0.06)
      for (let z = NS + 6.5; z < TOP - 4; z += 6) facePanel(frame, a, b, 0.4 / l, 1 - 0.4 / l, z - 0.25, z + 0.25, 0.06)
    }
  }

  // ---------- wings: north and south to 267 m, east and west to 251 m ----------
  const ov = 0.4 // overlap into the core
  box(glass, E.x0 - ov, E.x1, E.y0, E.y1, 0, EW, roof)
  box(glass, W.x0, W.x1 + ov, W.y0, W.y1, 0, EW, roof)
  // The broad wings carry the square opening near their tops: a void through
  // the wing, showing the shadowed core face behind it.
  for (const [w, side] of [[S, -1], [N, 1]] as const) {
    const y0 = side < 0 ? w.y0 : w.y0 - ov, y1 = side < 0 ? w.y1 + ov : w.y1
    const cx = (w.x0 + w.x1) / 2, ox0 = cx - OPEN.w / 2, ox1 = cx + OPEN.w / 2
    box(glass, w.x0, w.x1, y0, y1, 0, OPEN.z0, null)
    box(glass, w.x0, ox0, y0, y1, OPEN.z0, OPEN.z1, null, 0.3)
    box(glass, ox1, w.x1, y0, y1, OPEN.z0, OPEN.z1, null, 0.3)
    box(glass, w.x0, w.x1, y0, y1, OPEN.z1, NS, roof)
    const coreY = side < 0 ? CORE.y0 : CORE.y1, outY = side < 0 ? w.y0 : w.y1
    const a: P2 = side < 0 ? [ox0, coreY] : [ox1, coreY], b: P2 = side < 0 ? [ox1, coreY] : [ox0, coreY]
    facePanel(slot, a, b, 0, 1, OPEN.z0, OPEN.z1, 0.06)
    soffit(slot, [[ox0, outY], [ox1, outY], [ox1, coreY], [ox0, coreY]], OPEN.z1)
    // sill: the floor of the void
    const sill = ccw([[ox0, outY], [ox1, outY], [ox1, coreY], [ox0, coreY]])
    cap(roof, poly(sill), OPEN.z0 + 0.02, true)
    // a pale frame round the opening on the face
    const fa: P2 = side < 0 ? [w.x0, outY] : [w.x1, outY], fb: P2 = side < 0 ? [w.x1, outY] : [w.x0, outY], l = w.x1 - w.x0
    const s0 = side < 0 ? (ox0 - w.x0) / l : (w.x1 - ox1) / l, s1 = s0 + OPEN.w / l
    facePanel(frame, fa, fb, s0 - 0.6 / l, s1 + 0.6 / l, OPEN.z1, OPEN.z1 + 0.6, 0.08)
    facePanel(frame, fa, fb, s0 - 0.6 / l, s1 + 0.6 / l, OPEN.z0 - 0.6, OPEN.z0, 0.08)
    facePanel(frame, fa, fb, s0 - 0.6 / l, s0, OPEN.z0, OPEN.z1, 0.08)
    facePanel(frame, fa, fb, s1, s1 + 0.6 / l, OPEN.z0, OPEN.z1, 0.08)
  }

  // ---------- curtain-wall lines ----------
  const floors = [40, 80, 120, 160, 200, 240]
  curtainLines(mull, S.x0, S.x1, S.y0, S.y1, BLOCK, OPEN.z0 - 1, 9.7, floors.filter((z) => z > BLOCK && z < OPEN.z0), 0.6, 's')
  curtainLines(mull, N.x0, N.x1, N.y0, N.y1, 3, OPEN.z0 - 1, 9.7, floors.filter((z) => z < OPEN.z0), 0.6, 'n')
  curtainLines(mull, E.x0, E.x1, E.y0, E.y1, 3, EW - 0.5, 7.4, floors, 0.6, 'e')
  curtainLines(mull, W.x0, W.x1, W.y0, W.y1, 16.5, EW - 0.5, 7.4, floors, 0.6, 'w')

  // ---------- south block to 80 m: coarse pale grid ----------
  const SB = { x0: -11.8, x1: 27.2, y0: -16.6, y1: S.y0 + ov }
  box(glass, SB.x0, SB.x1, SB.y0, SB.y1, 0, BLOCK, roof)
  band(frame, SB.x0, SB.x1, SB.y0, SB.y1, BLOCK - 0.6, 1.2, 0.2)
  {
    const a: P2 = [SB.x0, SB.y0], b: P2 = [SB.x1, SB.y0], l = SB.x1 - SB.x0
    for (let i = 1; i < 4; i++) faceStrip(frame, a, b, i / 4 - 0.4 / l, i / 4 + 0.4 / l, WG, BLOCK - 1.2, 0.35)
    for (const z of [WG + 13.5, WG + 27]) facePanel(frame, a, b, 0.3 / l, 1 - 0.3 / l, z - 0.5, z + 0.5, 0.08)
    for (const [p, q] of [[[SB.x1, SB.y0], [SB.x1, SB.y1]], [[SB.x0, SB.y1], [SB.x0, SB.y0]]] as [P2, P2][])
      for (const z of [WG + 13.5, WG + 27]) facePanel(frame, p, q, 0.05, 0.95, z - 0.5, z + 0.5, 0.08)
  }

  // ---------- Winter Garden: 39 m glass box with a deep frame grid ----------
  const WGB = { x0: -11.8, x1: 27.2, y0: -28.8, y1: SB.y0 + ov }
  box(glass, WGB.x0, WGB.x1, WGB.y0, WGB.y1, 0, WG, roof)
  band(frame, WGB.x0, WGB.x1, WGB.y0, WGB.y1, WG - 0.7, 1.4, 0.25)
  {
    const faces: Array<[P2, P2, number]> = [
      [[WGB.x0, WGB.y0], [WGB.x1, WGB.y0], 6],
      [[WGB.x1, WGB.y0], [WGB.x1, WGB.y1], 2],
      [[WGB.x0, WGB.y1], [WGB.x0, WGB.y0], 2],
    ]
    for (const [a, b, n] of faces) {
      const l = Math.hypot(b[0] - a[0], b[1] - a[1])
      for (let i = 1; i < n; i++) faceStrip(frame, a, b, i / n - 0.35 / l, i / n + 0.35 / l, 0, WG - 1.4, 0.45)
      for (const z of [CANOPY + 0.5, 28]) facePanel(frame, a, b, 0.3 / l, 1 - 0.3 / l, z - 0.45, z + 0.45, 0.08)
    }
  }
  // Entrance canopy on JFK, cantilevered from the Winter Garden.
  box(frame, -11.9, 27.2, -34.9, WGB.y0 + 0.3, CANOPY - 1.2, CANOPY, frame, 0.3)
  // underside
  soffit(frame, [[-11.6, -34.6], [-11.6, WGB.y0], [26.9, WGB.y0], [26.9, -34.6]], CANOPY - 1.2)

  // ---------- west pavilions (low glass and metal) ----------
  const pav = (x0: number, x1: number, y0: number, y1: number, h: number) => {
    box(glass, x0 + 0.6, x1 - 0.6, y0 + 0.6, y1 - 0.6, 0, h - 3.5, null)
    box(frame, x0, x1, y0, y1, h - 3.5, h, roof)
  }
  pav(-40.8, -11.6, 18.8, 26.3, 16.5)
  pav(-40.8, W.x0 + 0.3, 1.4, 18.8 + 0.3, 12.2)
  pav(-40.8, W.x0 + 0.3, -9.6, 1.4 + 0.3, 11.5)
  pav(-40.8, -34.7, -18.1, -9.3, 13.9)
  pav(-22.3, -11.6, -16.6, W.y0 + 0.3, 12.0)

  await saveTower('phl-comcast-center', 'Comcast Center', [
    { part: glass, material: windowVariant(2, 0x7f9fbf) },
    { part: crown, material: windowVariant(3, 0xb2c0c2) },
    { part: mull, material: finish('cc-mullion', 0x9bb5cf) },
    { part: frame, material: finish('cc-silver', 0xd3d8d9) },
    { part: roof, material: PALETTE.roof },
    { part: slot, material: windowVariant(4, 0x5f7387) },
  ], {
    bearing: BEARING, anchor: ANCHOR, height: TOP,
    replaces: ['way/42785026', 'way/333339072', 'way/336855440', 'way/336855442', 'way/336855449', 'way/336855450', 'way/336855451', 'way/336855441', 'way/336875906', 'way/336855448', 'way/336875907', 'way/336875908'],
  })
}
