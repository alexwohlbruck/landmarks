/**
 * The Railyard, 1414 South Tryon Street, South End, Charlotte — procedural,
 * CC0-1.0.
 * bun generators/clt-railyard.ts
 *
 * An office and food-hall complex (Cousins Properties, completed 2020): two
 * eight-storey office towers, North and South, flank a courtyard that opens
 * onto South Tryon Street; across the back of the courtyard stands the
 * three-storey brick food-hall building with a glazed steel-truss bridge
 * storey on its roof. Modelled as one landmark because that is how it reads
 * from the street and from above: a U of two bars and the low hall.
 *
 * Each tower is a bar running back from Tryon. Its Tryon end is the "head":
 *  - on the courtyard corner, a three-storey charcoal-brick retail podium,
 *    with a glass box of five storeys cantilevered over it, wrapping the
 *    corner (black floor bands);
 *  - in the middle of the Tryon face, a red-brick slot core whose two piers
 *    rise above the roof, glazed between them with stacked black X-braces;
 *  - on the outer corner, a full-height glass curtain wall;
 *  - along the courtyard, red-brick upper storeys with grouped windows;
 *  - a glazed top storey under a thin flat roof that overhangs the Tryon and
 *    outer faces.
 * Behind the head the bar is charcoal brick with wide glazed bays and narrow
 * windows, stepping in plan at the back (OSM).
 *
 * Model frame: bearing 41. Model +y runs along South Tryon to the north-east,
 * +x towards Tryon (south-east). Geometry is authored in a site frame whose
 * origin is (-80.85567, 35.21744) and shifted at the end to the anchor, the
 * area centroid of the three outlines.
 *
 * Evidence:
 *  - OSM: way/695524312 (North Tower, 8 levels), way/849315325 (South
 *    Tower, 8 levels), way/1121531932 (the food hall, "Railyard") and the
 *    building:parts way/1208420096–1208420113 and 1208420133–1208420150:
 *    tower bodies 38 m, the slot cores 43 m (1208420096, 1208420147), roof
 *    elements 38–41 m, mechanical penthouses 40–41 m, the food hall 12 m and
 *    its truss storey 12–20 m (1208420150), entrance canopies at 7.6–8 m and
 *    copper awnings at 4.6–5 m.
 *  - The 2016 lidar predates construction, so no height here is measured;
 *    all come from OSM, checked against the photos (8 storeys).
 *  - Photos: City Dweller 2, CC BY-SA 4.0 (Wikimedia Commons): "Railyard May
 *    2021" (North Tower's Tryon face: podium, glass box, slot, curtain wall,
 *    overhang), "Railyard north section of building along South Tryon Late
 *    April 2024" (North Tower's courtyard corner and Tryon face), "Railyard
 *    south section of building along South Tryon Late April 2024" (South
 *    Tower, the same corner mirrored), "Railyard first floor on South Tryon
 *    Late April 2024" (down the courtyard: red heads, charcoal bodies, the
 *    truss bridge). Poojaxsl, "The RailYard Building in Charlotte, North
 *    Carolina", CC0 (the food hall front and the truss storey). USGS NAIP
 *    (plan, white roofs).
 *
 * Estimated: storey heights (podium 3 floors to 14 m, offices 4.6 m, glazed
 * top floor); where the red brick gives way to charcoal along the courtyard
 * (x = 14, from the photos' bay counts); window and bay pitch; the outer
 * (long) faces and back faces, which no photo shows: assumed charcoal with
 * the courtyard's bay rhythm, the outer corner of the head glass (OSM roof
 * part 1208420146) and the rest of the head red brick; the truss storey's
 * height, 6.5 m from the Poojaxsl photo against the 12 m brick front (OSM
 * says 8); the roof overhang depth (1.2 m). Awnings, canopies and the
 * "RAILYARD" sign are left out as too small to read.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

// ---------------------------------------------------------------------------
// A small kit: chamfered boxes and flat shapes on axis-aligned faces.

type F = 'S' | 'N' | 'E' | 'W'
type AZ = [number, number]
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const NRM: Record<F, V3> = { S: [0, -1, 0], N: [0, 1, 0], E: [1, 0, 0], W: [-1, 0, 0] }
const SIGN: Record<F, number> = { S: -1, N: 1, E: 1, W: -1 }
const UP: V3 = [0, 0, 1], DN: V3 = [0, 0, -1]

function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
  p.tri(a, c, d, undefined, undefined, undefined, [n, n, n])
}

/** An axis-aligned box, its top edges chamfered by b; sides = [S, E, N, W]. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, b = 0, top: Part | null = p, sides = [true, true, true, true]) {
  if (x0 > x1) [x0, x1] = [x1, x0]
  if (y0 > y1) [y0, y1] = [y1, y0]
  const zt = z1 - b
  if (sides[0]) quadN(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, zt], [x0, y0, zt], NRM.S)
  if (sides[1]) quadN(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, zt], [x1, y0, zt], NRM.E)
  if (sides[2]) quadN(p, [x1, y1, z0], [x0, y1, z0], [x0, y1, zt], [x1, y1, zt], NRM.N)
  if (sides[3]) quadN(p, [x0, y1, z0], [x0, y0, z0], [x0, y0, zt], [x0, y1, zt], NRM.W)
  if (b > 0) {
    const i0 = x0 + b, i1 = x1 - b, j0 = y0 + b, j1 = y1 - b
    quadN(p, [x0, y0, zt], [x1, y0, zt], [i1, j0, z1], [i0, j0, z1], unit([0, -1, 1]))
    quadN(p, [x1, y0, zt], [x1, y1, zt], [i1, j1, z1], [i1, j0, z1], unit([1, 0, 1]))
    quadN(p, [x1, y1, zt], [x0, y1, zt], [i0, j1, z1], [i1, j1, z1], unit([0, 1, 1]))
    quadN(p, [x0, y1, zt], [x0, y0, zt], [i0, j0, z1], [i0, j1, z1], unit([-1, 0, 1]))
    if (top) quadN(top, [i0, j0, z1], [i1, j0, z1], [i1, j1, z1], [i0, j1, z1], UP)
  } else if (top) quadN(top, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], UP)
}
/** The underside of a slab. */
function soffit(p: Part, x0: number, x1: number, y0: number, y1: number, z: number) {
  if (x0 > x1) [x0, x1] = [x1, x0]
  if (y0 > y1) [y0, y1] = [y1, y0]
  quadN(p, [x0, y0, z], [x0, y1, z], [x1, y1, z], [x1, y0, z], DN)
}

/**
 * A flat convex shape on face f (the plane x = d for E/W, y = d for S/N),
 * standing o metres proud of it. Points are (a, z): a is x on S/N faces and
 * y on E/W faces, listed anticlockwise with a increasing to the right.
 */
function shape(p: Part, f: F, d: number, pts: AZ[], o = 0.04) {
  const dd = d + SIGN[f] * o
  const P = ([a, z]: AZ): V3 => (f === 'S' || f === 'N' ? [a, dd, z] : [dd, a, z])
  // On N and W faces a increases to the viewer's left, so the order flips.
  const q = f === 'N' || f === 'W' ? [...pts].reverse() : pts
  const n = NRM[f]
  for (let i = 1; i < q.length - 1; i++) p.tri(P(q[0]), P(q[i]), P(q[i + 1]), undefined, undefined, undefined, [n, n, n])
}
const rect = (p: Part, f: F, d: number, a0: number, a1: number, z0: number, z1: number, o = 0.04) => {
  if (a0 > a1) [a0, a1] = [a1, a0]
  shape(p, f, d, [[a0, z0], [a1, z0], [a1, z1], [a0, z1]], o)
}
/** A straight bar of width w on a face, from (a0, z0) to (a1, z1). */
function bar(p: Part, f: F, d: number, a0: number, z0: number, a1: number, z1: number, w: number, o = 0.08) {
  const L = Math.hypot(a1 - a0, z1 - z0), pa = (-(z1 - z0) / L) * w / 2, pz = ((a1 - a0) / L) * w / 2
  let pts: AZ[] = [[a0 - pa, z0 - pz], [a1 - pa, z1 - pz], [a1 + pa, z1 + pz], [a0 + pa, z0 + pz]]
  // Keep the winding anticlockwise whichever way the bar runs.
  const area = pts.reduce((s, [a, z], i) => { const [b, y] = pts[(i + 1) % 4]; return s + a * y - b * z }, 0)
  if (area < 0) pts = pts.reverse()
  shape(p, f, d, pts, o)
}

// ---------------------------------------------------------------------------
// Materials, from the daylight photos pulled to the palette's lightness.

const brick = new Part(), charcoal = new Part(), win = new Part(), glass = new Part(), roof = new Part(), trim = new Part()

// ---------------------------------------------------------------------------
// Heights (OSM, storeys from the photos).

const Z_POD = 14           // three-storey retail podium
const Z_OFF = 32.4         // four office floors of 4.6 m above it
const Z_TOP = 38.2         // glazed top storey to the roof slab
const Z_SLAB = 39.2        // head roof slab (OSM roof elements 38-41)
const Z_BODY = 38          // charcoal bodies (OSM 38)
const Z_CORE = 43          // the slot cores (OSM 43)
const FLOORS = [Z_POD, Z_POD + 4.6, Z_POD + 9.2, Z_POD + 13.8, Z_OFF]
const X_HEAD = 14          // where the red head meets the charcoal body
const X_BOX = 31.5         // glass box / outer glass block start

type Tower = {
  yc: number               // courtyard face
  sgn: 1 | -1              // from the courtyard towards the outer face
  depth: number            // courtyard face to outer face
  xb: number               // back of the main body
  xt: number               // Tryon face
  xs: number               // slot core's Tryon face
  slot: [number, number]   // slot core, as distances from the courtyard face
  back: [number, number, number, number][]  // stepped back wings, x0 x1 y0 y1
  mech: [number, number, number, number, number][]  // rooftop boxes, x0 x1 y0 y1 top
}

/** Window and glass panels across a charcoal face, in 6 m modules: a wide glazed bay and a narrow window, two floors per panel. */
function charcoalBays(f: F, d: number, a0: number, a1: number, retail: boolean) {
  const n = Math.max(1, Math.round((a1 - a0) / 6)), m = (a1 - a0) / n
  const groups: [number, number][] = [[5.4, 13.2], [14.6, 22.6], [23.8, 31.6], [32.8, 37.2]]
  for (let i = 0; i < n; i++) {
    const s = a0 + i * m
    for (const [z0, z1] of groups) {
      rect(glass, f, d, s + 1.0, s + 1.0 + m * 0.36, z0, z1)
      rect(win, f, d, s + m * 0.68, s + m * 0.68 + 0.9, z0, z1)
    }
    if (retail) rect(win, f, d, s + 0.6, s + m - 0.6, 0.6, 4.4)
  }
}

/** Curtain glass with black floor bands between floor heights z[]. */
function curtain(f: F, d: number, a0: number, a1: number, z0: number, z1: number, bands: number[]) {
  rect(glass, f, d, a0, a1, z0, z1, 0.03)
  for (const z of bands) if (z > z0 + 0.5 && z < z1 - 0.3) rect(charcoal, f, d, a0, a1, z - 0.35, z + 0.35, 0.07)
}

function tower(t: Tower) {
  const Y = (s: number) => t.yc + t.sgn * s
  const yo = Y(t.depth)
  const fc: F = t.sgn > 0 ? 'S' : 'N'          // the courtyard face
  const fo: F = t.sgn > 0 ? 'N' : 'S'          // the outer face
  const [s0, s1] = t.slot

  // Charcoal body behind the head, and its stepped back wings.
  box(charcoal, t.xb, X_HEAD, t.yc, yo, 0, Z_BODY, 0.4, roof, [true, false, true, true])
  for (const [x0, x1, y0, y1] of t.back) box(charcoal, x0, x1, y0, y1, 0, Z_BODY, 0.4, roof, [true, false, true, true])
  charcoalBays(fc, t.yc, t.xb + 0.5, X_HEAD - 0.5, true)
  charcoalBays(fo, yo, t.xb + 0.5, X_HEAD - 0.5, false)
  // Bays on the back face where no wing covers it, and on each wing's back.
  {
    const lo = Math.min(t.yc, yo), hi = Math.max(t.yc, yo)
    let cur = lo
    for (const [, , y0, y1] of [...t.back].sort((a, b) => a[2] - b[2])) {
      if (y0 - cur > 5) charcoalBays('W', t.xb, cur + 0.4, y0 - 0.4, false)
      cur = Math.max(cur, y1)
    }
    if (hi - cur > 5) charcoalBays('W', t.xb, cur + 0.4, hi - 0.4, false)
    for (const [x0, , y0, y1] of t.back) if (y1 - y0 > 5) charcoalBays('W', x0, y0 + 0.4, y1 - 0.4, false)
  }

  // The head: podium, red brick and glass faces round a core volume.
  const yS0 = Y(s0), yS1 = Y(s1)
  // Courtyard face: charcoal podium, red brick over it to the box, glass box at the corner.
  rect(charcoal, fc, t.yc, X_HEAD, t.xt, 0, Z_POD, 0)
  rect(brick, fc, t.yc, X_HEAD, X_BOX, Z_POD, Z_OFF, 0)
  curtain(fc, t.yc, X_BOX, t.xt, Z_POD, Z_TOP, FLOORS.slice(1))
  curtain(fc, t.yc, X_HEAD, X_BOX, Z_OFF, Z_TOP, [])
  // Storefronts with a pale cornice on the podium.
  {
    const n = 6, m = (t.xt - X_HEAD) / n
    for (let i = 0; i < n; i++) {
      const s = X_HEAD + i * m
      rect(win, fc, t.yc, s + 0.6, s + m - 0.6, 0.6, 4.6)
      rect(win, fc, t.yc, s + 0.9, s + m - 0.9, 6.2, 12.6)
    }
    rect(trim, fc, t.yc, X_HEAD, t.xt, Z_POD - 0.7, Z_POD, 0.1)
  }
  // Red brick: four bays of grouped windows, two floors to a panel.
  {
    const n = 4, m = (X_BOX - X_HEAD) / n
    for (let i = 0; i < n; i++) {
      const s = X_HEAD + i * m
      rect(win, fc, t.yc, s + 0.7, s + m - 0.7, Z_POD + 0.8, Z_POD + 8.4)
      rect(win, fc, t.yc, s + 0.7, s + m - 0.7, Z_POD + 10.0, Z_OFF - 0.8)
    }
  }

  // Tryon face: podium + glass box on the courtyard side, the slot core, then curtain glass.
  {
    const [p0, p1] = [Math.min(t.yc, yS0), Math.max(t.yc, yS0)]
    rect(charcoal, 'E', t.xt, p0, p1, 0, Z_POD, 0)
    const n = 2, m = (p1 - p0) / n
    for (let i = 0; i < n; i++) {
      rect(win, 'E', t.xt, p0 + i * m + 0.6, p0 + (i + 1) * m - 0.6, 0.6, 4.6)
      rect(win, 'E', t.xt, p0 + i * m + 0.9, p0 + (i + 1) * m - 0.9, 6.2, 12.6)
    }
    rect(trim, 'E', t.xt, p0, p1, Z_POD - 0.7, Z_POD, 0.1)
    curtain('E', t.xt, p0, p1, Z_POD, Z_TOP, FLOORS.slice(1))
    const [q0, q1] = [Math.min(yS1, yo), Math.max(yS1, yo)]
    curtain('E', t.xt, q0, q1, 0, Z_TOP, [5.4, 9.7, ...FLOORS])
  }
  // Outer face: the corner glass block, then red brick back to the body.
  curtain(fo, yo, X_BOX, t.xt, 0, Z_TOP, [5.4, 9.7, ...FLOORS])
  rect(brick, fo, yo, X_HEAD, X_BOX, 0, Z_OFF, 0)
  curtain(fo, yo, X_HEAD, X_BOX, Z_OFF, Z_TOP, [])
  {
    const n = 4, m = (X_BOX - X_HEAD) / n
    for (let i = 0; i < n; i++) {
      const s = X_HEAD + i * m
      rect(win, fo, yo, s + 0.6, s + m - 0.6, 0.6, 4.6)
      rect(win, fo, yo, s + 0.7, s + m - 0.7, 5.6, 13.2)
      rect(win, fo, yo, s + 0.7, s + m - 0.7, Z_POD + 0.8, Z_POD + 8.4)
      rect(win, fo, yo, s + 0.7, s + m - 0.7, Z_POD + 10.0, Z_OFF - 0.8)
    }
  }
  // Roof of the head under the slab is hidden; the slab overhangs Tryon and the outer face.
  {
    const ov = 1.2
    const x0 = X_HEAD, x1 = t.xt + ov
    const yy0 = t.yc - t.sgn * 0.5, yy1 = yo + t.sgn * ov
    box(trim, x0, x1, yy0, yy1, Z_TOP, Z_SLAB, 0.3, roof, [true, true, true, false])
    soffit(trim, x0, x1, yy0, yy1, Z_TOP)
    // The slab's inner end wall where it rises above the charcoal body.
    quadN(trim, [x0, Math.max(yy0, yy1), Z_BODY], [x0, Math.min(yy0, yy1), Z_BODY], [x0, Math.min(yy0, yy1), Z_SLAB - 0.3], [x0, Math.max(yy0, yy1), Z_SLAB - 0.3], NRM.W)
  }

  // The slot core: red-brick piers to 43 m, glazed between with stacked X-braces.
  {
    // The photos show the brick piers wider than OSM's 7 m core part (pier,
    // slot, pier read about 2.8 + 3.4 + 2.8 m), so the core takes 1 m more
    // of the face either side.
    const c0 = Math.min(yS0, yS1) - 1.0, c1 = Math.max(yS0, yS1) + 1.0
    box(brick, 31, t.xs, c0, c1, 0, Z_CORE, 0.45, brick, [true, true, true, true])
    const g0 = (c0 + c1) / 2 - 1.7, g1 = (c0 + c1) / 2 + 1.7
    rect(glass, 'E', t.xs, g0, g1, 0.4, Z_CORE - 2.5, 0.03)
    const h = (Z_CORE - 3.0) / 9
    for (let k = 0; k < 9; k++) {
      const z0 = 0.4 + k * h, z1 = z0 + h
      bar(charcoal, 'E', t.xs, g0 + 0.25, z0, g1 - 0.25, z1, 0.45)
      bar(charcoal, 'E', t.xs, g1 - 0.25, z0, g0 + 0.25, z1, 0.45)
      rect(charcoal, 'E', t.xs, g0, g1, z1 - 0.2, z1 + 0.2, 0.08)
    }
  }

  // Rooftop penthouses.
  for (const [x0, x1, y0, y1, z] of t.mech) box(roof, x0, x1, y0, y1, Z_BODY - 0.2, z, 0.3)
}

// North Tower (way/695524312).
tower({
  yc: 11.0, sgn: 1, depth: 34.1, xb: -12.5, xt: 41.8, xs: 43.5, slot: [10.4, 17.4],
  back: [[-18.3, -12.5, 16.4, 22.9], [-18.4, -12.5, 25.5, 33.6], [-22.3, -12.5, 33.6, 42.9]],
  mech: [[-8.6, -3.8, 16.9, 24.3, 40], [-4.6, 7.3, 27.1, 33.7, 41], [10.8, 13.5, 30.6, 36.2, 41], [-18.0, -13.0, 25.8, 33.3, 41], [-17.9, -13.8, 16.7, 22.6, 40]],
})
// South Tower (way/849315325), the mirror across the courtyard.
tower({
  yc: -13.1, sgn: -1, depth: 34.5, xb: -12.7, xt: 41.7, xs: 43.8, slot: [10.4, 17.3],
  back: [[-15.6, -12.7, -47.6, -17.1], [-20.4, -15.6, -26.3, -20.4], [-21.0, -15.6, -37.1, -30.8], [-24.5, -15.6, -45.4, -37.1]],
  mech: [[-8.6, -3.8, -29.4, -22.1, 40], [-4.8, 7.5, -38.9, -32.2, 41], [11.5, 14.2, -37.9, -32.3, 41], [-20.6, -15.3, -36.8, -31.0, 41], [-20.1, -15.6, -26.1, -20.6, 40]],
})

// ---------------------------------------------------------------------------
// The food hall (way/1121531932): a red-brick front block, recessed glazed
// entrance bays either side against the towers, and the truss storey on top.
{
  const XF = 3.9, XE = 1.9, XR = -12.6, XT = -2.5, Z_HALL = 12, Z_TRUSS = 18.5
  const ys = -8.3, yn = 5.9, yS = -13.1, yN = 11.0
  box(brick, XR, XF, ys, yn, 0, Z_HALL, 0.35, roof, [false, true, false, true])
  box(brick, XR, XE, yS, ys, 0, Z_HALL, 0.35, roof, [false, true, false, true])
  box(brick, XR, XE, yn, yN, 0, Z_HALL, 0.35, roof, [false, true, false, true])
  // The steps of the front between the block and the entrance bays.
  rect(brick, 'S', ys, XE, XF, 0, Z_HALL - 0.35, 0)
  rect(brick, 'N', yn, XE, XF, 0, Z_HALL - 0.35, 0)
  // Front: a storefront, three big windows above, a pale band and coping.
  rect(win, 'E', XF, -5.9, 3.5, 0.4, 5.0)
  for (const c of [-5.4, -1.2, 3.0]) rect(win, 'E', XF, c - 1.5, c + 1.5, 6.4, 10.4)
  rect(trim, 'E', XF, ys, yn, 5.4, 6.0, 0.08)
  // Entrance bays: white frames with glazing, against each tower.
  for (const [a, b] of [[yS, ys], [yn, yN]] as AZ[]) {
    rect(trim, 'E', XE, a, b, 0, Z_HALL - 0.35, 0.03)
    rect(win, 'E', XE, a + 0.7, b - 0.7, 0.3, 3.6)
    rect(glass, 'E', XE, a + 0.7, b - 0.7, 4.6, Z_HALL - 1.2)
  }
  // The truss storey: a glazed box spanning between the towers, a black
  // Warren truss on its front and back faces, a dark roof band.
  box(glass, XR + 0.2, XT, yS, yN, Z_HALL, Z_TRUSS - 1.0, 0, null, [false, true, false, true])
  box(charcoal, XR + 0.2, XT, yS, yN, Z_TRUSS - 1.0, Z_TRUSS, 0.3, roof, [false, true, false, true])
  for (const [f, d] of [['E', XT], ['W', XR + 0.2]] as [F, number][]) {
    const n = 6, m = (yN - yS) / n, z0 = Z_HALL + 0.25, z1 = Z_TRUSS - 1.25
    rect(charcoal, f, d, yS, yN, Z_HALL, Z_HALL + 0.5, 0.08)
    for (let i = 0; i < n; i++) {
      const a = yS + i * m, b = a + m
      if (i % 2 === 0) bar(charcoal, f, d, a + 0.2, z0, b - 0.2, z1, 0.5)
      else bar(charcoal, f, d, a + 0.2, z1, b - 0.2, z0, 0.5)
      if (i > 0) rect(charcoal, f, d, a - 0.2, a + 0.2, z0, z1, 0.08)
    }
  }
}

// ---------------------------------------------------------------------------
// Shift from the site frame to the anchor (area centroid of the three outlines).
const OX = 11.63, OY = -1.55
const parts = [
  { part: brick, material: finish('railyard-brick', 0xc27460) },
  { part: charcoal, material: finish('railyard-charcoal', 0x63676e) },
  { part: win, material: PALETTE.window },
  { part: glass, material: windowVariant(2, 0x8fa5b8) },
  { part: roof, material: PALETTE.roof },
  { part: trim, material: PALETTE.trim },
]
for (const { part } of parts) for (let i = 0; i < part.pos.length; i += 3) { part.pos[i] -= OX; part.pos[i + 2] += OY }

const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
console.log(parts.map(({ part, material }) => `${material.name}: ${part.triangles}`).join(', '))
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('The Railyard', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 41, osm: ['way/695524312', 'way/849315325', 'way/1121531932'], height: Z_CORE,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/clt-railyard.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
