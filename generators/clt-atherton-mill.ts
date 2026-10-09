/**
 * Atherton Cotton Mills (1892–93), 2108 South Boulevard, South End,
 * Charlotte — procedural, CC0-1.0.
 * bun generators/clt-atherton-mill.ts
 *
 * D. A. Tompkins's mill, the first factory in Dilworth's industrial district,
 * a designated Charlotte-Mecklenburg historic landmark, converted to
 * condominiums. The Landmarks Commission survey (Mattson & Morrill, 1997)
 * describes it: "a single building with the longitudinal plan common to
 * nineteenth century textile factories. Oriented north-south ... constructed
 * on a slope, which provided two floors of work space on the west side and a
 * single story on the east, facing South Boulevard ... 498 feet long and 78
 * feet wide ... pilastered brick exterior walls ... The roof is a shallow
 * pitched gable ... On the north and south elevations, the roof line is
 * defined by stepped parapets, while on the east and west sides, the gable
 * roof ends in exposed wooden rafters ... tall, recessed, segmental arch
 * windows ... The powerhouse and machine shop form one extension from the
 * northwest side of the main mill. On the south side of the powerhouse is a
 * tall, massive square, brick smokestack with flared base and corbeled cap."
 * That stack, beside the Rail Trail, is the mill's landmark.
 *
 * NOTE on the id: the lead's brief pointed at way/432937693, the "Atherton
 * Mill" retail centre at Tremont (the 1919 Parks-Cramer machine shop and the
 * Schoenith warehouse, north of the mill). The 1893 mill itself is
 * way/432937694, 230 m south-west, with its stack (way/1196988216). This
 * model is the 1893 mill and its stack.
 *
 * Evidence:
 *  - OSM way/432937694 (outline; building:levels 2, height 9) and
 *    way/1196988216 (man_made=chimney). No building:parts.
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m, sampled in this
 *    frame. Base (y = 0) is the west (Rail Trail) ground; the South Blvd side
 *    is 3 m higher. Mill eaves 7.8 m, ridge 9.4 m on the axis; the north-west
 *    extension 7–8 m; the stack 33 m above base, about 3–4 m square (photo proportions give a ~4 m
 *    shaft). The
 *    canopy at x −36…−24 is trees (ground returns under it), not a building.
 *  - NAIP (USGS, public domain): the long roof is a warm dark grey, the
 *    north-west extension a separate brown-grey roof.
 *  - Photos (Commons, City Dweller 2, CC BY-SA 4.0): "Atherton Mill along the
 *    Rail Trail Late May 2024" and "… - 2 Late May 2024": the west side —
 *    red brick, tall windows with pale lintels over half windows, a shallow
 *    roof with eaves, the square stack with its corbelled cap. The building
 *    those photos show in front of the stack is the powerhouse extension
 *    (one row of tall windows); the main mill's west face is screened by
 *    trees in them and is drawn with two rows, per the survey.
 *  - Published: 498 × 78 ft (survey). OSM/lidar measure 143 × 23 m; the
 *    model follows them.
 *
 * Estimated: window pitch (3.75 m) and sizes; the step heights of the end
 * parapets (no photo of the ends); the east face (no photo; drawn like the
 * west, main floor only, per the survey); the stack's taper and flare.
 *
 * Model frame: bearing 33.1 (model +y runs north-north-east along the mill);
 * origin at the OSM outline's centroid.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { BRICK, earcut, prism, quad, rect, tri, window, write, type Built, type Row, type XY } from './clt-highland-park-mill-3'

const ROOF = finish('atherton-roof', 0x96918d)

const brick = new Part(), win = new Part(), trim = new Part(), roof = new Part()

/** Ground above base: the slope rises 3 m from the trail (west) to South Blvd (east). */
const ground = (x: number) => Math.max(0, Math.min(3, ((x + 11) / 23) * 3))
const BURY = 0.6

/** A wall drawn in its own (s, z) plane: polygon `P` along `u` from `o0`, facing `n`, `t` thick. */
function slab(p: Part, P: XY[], o0: XY, u: XY, n: XY, t: number) {
  const W = (s: number, z: number, d: number): V3 => [o0[0] + u[0] * s - n[0] * d, o0[1] + u[1] * s - n[1] * d, z]
  for (const [i, j, k] of earcut(P)) {
    tri(p, W(P[i][0], P[i][1], 0), W(P[j][0], P[j][1], 0), W(P[k][0], P[k][1], 0), [n[0], n[1], 0])
    tri(p, W(P[i][0], P[i][1], t), W(P[k][0], P[k][1], t), W(P[j][0], P[j][1], t), [-n[0], -n[1], 0])
  }
  P.forEach((A, i) => {
    const B = P[(i + 1) % P.length], ds = B[0] - A[0], dz = B[1] - A[1]
    // Outward in the wall's plane: perpendicular to the edge (polygon is CCW in s, z).
    const L = Math.hypot(ds, dz), os = dz / L, oz = -ds / L
    quad(p, W(A[0], A[1], 0), W(B[0], B[1], 0), W(B[0], B[1], t), W(A[0], A[1], t), [u[0] * os, u[1] * os, oz])
  })
}

/**
 * A long block with a shallow gable along y, overhanging eaves on the long
 * sides, and gable-end walls that are either plain or stepped parapets.
 */
function gableBlock(x0: number, x1: number, y0: number, y1: number, eave: number, ridge: number, over: number, steps: number[] | null, ends: [boolean, boolean] = [true, true]) {
  const xr = (x0 + x1) / 2, half = (x1 - x0) / 2, k = (ridge - eave) / half
  // Long walls up to the eave.
  quad(brick, [x0, y1, -BURY], [x0, y0, -BURY], [x0, y0, eave], [x0, y1, eave], [-1, 0, 0])
  quad(brick, [x1, y0, -BURY], [x1, y1, -BURY], [x1, y1, eave], [x1, y0, eave], [1, 0, 0])
  // Roof planes, running `over` past the walls, inside the end walls.
  const t = steps ? 0.45 : 0
  const ya = y0 + (ends[0] ? t : -over), yb = y1 - (ends[1] ? t : -over)
  const ze = eave - over * k
  const nW: V3 = [-k, 0, 1], nE: V3 = [k, 0, 1]
  quad(roof, [x0 - over, ya, ze], [x0 - over, yb, ze], [xr, yb, ridge], [xr, ya, ridge], nW)
  quad(roof, [xr, ya, ridge], [xr, yb, ridge], [x1 + over, yb, ze], [x1 + over, ya, ze], nE)
  // Fascia and soffit along the eaves (pale: the exposed rafter ends and fascia).
  for (const [xa, s] of [[x0, -1], [x1, 1]] as [number, number][]) {
    const xo = xa + s * over
    quad(trim, [xo, ya, ze - 0.3], [xo, yb, ze - 0.3], [xo, yb, ze], [xo, ya, ze], [s, 0, 0])
    quad(trim, [xo, ya, ze - 0.3], [xa, ya, eave - 0.05], [xa, yb, eave - 0.05], [xo, yb, ze - 0.3], [0, 0, -1])
  }
  // Gable ends.
  for (const [y, s, on] of [[y0, -1, ends[0]], [y1, 1, ends[1]]] as [number, number, boolean][]) {
    if (!on) continue
    const n: XY = [0, s]
    // Wall polygon in (s along x from x0, z), counter-clockwise seen from outside.
    let P: XY[]
    if (steps) {
      // Stepped parapet: steps[i] is the top of the i-th step from the eave to the middle.
      const m = steps.length, w = (x1 - x0) / (2 * m - 1), pts: XY[] = [[0, -BURY], [x1 - x0, -BURY]]
      const hs = [...steps, ...steps.slice(0, -1).reverse()]
      for (let i = hs.length - 1; i >= 0; i--) { pts.push([(i + 1) * w, hs[i]]); pts.push([i * w, hs[i]]) }
      P = pts
    } else P = [[0, -BURY], [x1 - x0, -BURY], [x1 - x0, eave], [half, ridge], [0, eave]]
    // Seen from outside (+y side) the wall runs from x1 to x0; flip so it is CCW.
    const flip = s > 0
    const Q = flip ? P.map(([a, z]) => [x1 - x0 - a, z] as XY).reverse() : P
    const o0: XY = flip ? [x1, y] : [x0, y], u: XY = flip ? [-1, 0] : [1, 0]
    slab(brick, flip ? Q : P, o0, u, n, steps ? t : 0.01)
    if (steps) {
      // Coping on each step.
      const m = steps.length, w = (x1 - x0) / (2 * m - 1), hs = [...steps, ...steps.slice(0, -1).reverse()]
      hs.forEach((h, i) => {
        const a = x0 + i * w - 0.05, b = x0 + (i + 1) * w + 0.05, yi = y - s * t, yo = y + s * 0.08
        quad(trim, [a, Math.min(yi, yo), h + 0.12], [b, Math.min(yi, yo), h + 0.12], [b, Math.max(yi, yo), h + 0.12], [a, Math.max(yi, yo), h + 0.12], [0, 0, 1])
        quad(trim, [a, yo, h - 0.1], [b, yo, h - 0.1], [b, yo, h + 0.12], [a, yo, h + 0.12], [0, s, 0])
      })
    }
  }
}

/** Windows along a wall from A to B (outward normal `o`), with pale lintels and sills. */
function bays(A: XY, B: XY, o: XY, rows: Row[], pitch: number, skip?: (s: number) => boolean) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L]
  const count = Math.floor((L - 1) / pitch), start = (L - count * pitch) / 2
  const N: V3 = [o[0], o[1], 0]
  for (let i = 0; i < count; i++) {
    const s = start + pitch * (i + 0.5)
    if (skip?.(s)) continue
    const c: XY = [A[0] + u[0] * s, A[1] + u[1] * s]
    for (const r of rows) {
      if (ground(c[0]) > r.z0 - 0.4) continue
      window(win, c, u, o, r)
      const P = (d: number, w: number, z: number): V3 => [c[0] + u[0] * w + o[0] * d, c[1] + u[1] * w + o[1] * d, z]
      const hw = r.w / 2 + 0.2
      // Lintel (a flat stone band above the head) and sill.
      quad(trim, P(0.07, -hw, r.z1 + 0.05), P(0.07, hw, r.z1 + 0.05), P(0.07, hw, r.z1 + 0.4), P(0.07, -hw, r.z1 + 0.4), N)
      quad(trim, P(0.07, -hw + 0.1, r.z0 - 0.22), P(0.07, hw - 0.1, r.z0 - 0.22), P(0.07, hw - 0.1, r.z0), P(0.07, -hw + 0.1, r.z0), N)
    }
  }
}

/** A square brick stack with chamfered corners, flared base and corbelled cap. */
function squareStack(c: XY, z1: number) {
  const ring = (w: number, z: number): V3[] => {
    const h = w / 2, b = Math.min(0.25, w * 0.08)
    const P: XY[] = [[h - b, -h], [h, -h + b], [h, h - b], [h - b, h], [-h + b, h], [-h, h - b], [-h, -h + b], [-h + b, -h]]
    return P.map(([x, y]) => [c[0] + x, c[1] + y, z])
  }
  const band = (p: Part, A: V3[], B: V3[]) => {
    for (let i = 0; i < A.length; i++) {
      const j = (i + 1) % A.length
      const e: V3 = [A[j][0] - A[i][0], A[j][1] - A[i][1], 0], n: V3 = [e[1], -e[0], 0]
      quad(p, A[i], A[j], B[j], B[i], n)
    }
  }
  const zc = z1 - 1.6
  const levels: [number, number][] = [[-BURY, 4.8], [0.9, 4.8], [2.8, 4.0], [zc, 3.3], [zc, 3.8], [z1, 3.8]]
  for (let k = 0; k < levels.length - 1; k++) {
    const [za, wa] = levels[k], [zb, wb] = levels[k + 1]
    const A = ring(wa, za), B = ring(wb, zb)
    if (za === zb) { // the corbel step: a downward-facing ledge
      for (let i = 0; i < 8; i++) { const j = (i + 1) % 8; quad(brick, A[i], B[i], B[j], A[j], [0, 0, -1]) }
    } else band(k >= 3 ? brick : brick, A, B)
  }
  // Coping ring and dark mouth.
  const T = ring(3.8, z1), M = ring(2.6, z1)
  for (let i = 0; i < 8; i++) { const j = (i + 1) % 8; quad(trim, T[i], T[j], M[j], M[i], [0, 0, 1]) }
  for (let i = 1; i < 7; i++) tri(roof, M[0], M[i], M[i + 1], [0, 0, 1])
}

export function buildAtherton(): Built {
  // The mill: 23 × 143 m, shallow gable on its axis, stepped parapets at both ends.
  const X0 = -11, X1 = 12, Y0 = -73.5, Y1 = 69.5, EAVE = 7.8, RIDGE = 9.4
  gableBlock(X0, X1, Y0, Y1, EAVE, RIDGE, 0.6, [8.9, 9.5, 10.2])
  // Main floor: tall segment-headed windows; on the low (west) side a row of half windows below.
  const main: Row = { z0: 3.7, z1: 6.9, w: 2.0, head: 'segment' }, low: Row = { z0: 0.9, z1: 2.5, w: 1.8 }
  const PITCH = 3.75
  // West face (x = X0, facing −x): skip bays the north-west extension and the stair block cover.
  bays([X0, Y1], [X0, Y0], [-1, 0], [low, main], PITCH, (s) => { const y = Y1 - s; return (y > 24.8 && y < 48.6) || (y > -35.8 && y < -29.1) })
  bays([X1, Y0], [X1, Y1], [1, 0], [main], PITCH)
  bays([X1, Y1], [X0, Y1], [0, 1], [low, main], 3.6)
  bays([X0, Y0], [X1, Y0], [0, -1], [low, main], 3.6)

  // The powerhouse and machine shop extension on the north-west (OSM; lidar heights).
  gableBlock(-22.1, X0, 35.9, 47.6, 7.0, 8.0, 0.5, null)
  gableBlock(-27.8, X0, 25.8, 35.9, 6.3, 7.1, 0.5, null)
  const ext: Row = { z0: 2.0, z1: 5.6, w: 1.9, head: 'segment' }
  bays([-22.1, 47.6], [-22.1, 35.9], [-1, 0], [ext], 3.75)
  bays([-27.8, 35.9], [-27.8, 25.8], [-1, 0], [ext], 3.4, (s) => s > 0.5 && s < 4.5)
  bays([X0, 47.6], [-22.1, 47.6], [0, 1], [ext], 3.6)
  bays([-27.8, 25.8], [X0, 25.8], [0, -1], [ext], 3.6)
  // The stair block on the west side (OSM), flat.
  prism(brick, rect(-17.2, -34.8, X0, -30.1), -BURY, 6.0, roof)

  // The stack, south of the powerhouse (OSM chimney; lidar 33 m).
  squareStack([-30.8, 33.2], 33)

  return {
    id: 'clt-atherton-mill', name: 'Atherton Mill', anchor: [0, 0], height: 33,
    parts: [
      { part: brick, material: BRICK },
      { part: roof, material: ROOF },
      { part: win, material: PALETTE.window },
      { part: trim, material: PALETTE.trim },
    ],
  }
}

if (import.meta.main) await write(buildAtherton())
