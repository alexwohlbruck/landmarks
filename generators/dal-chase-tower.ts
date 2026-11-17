/**
 * Chase Tower (Texas Commerce Tower, 1987, Skidmore, Owings & Merrill;
 * renamed Dallas Arts Tower), 2200 Ross Avenue, Dallas: original procedural
 * geometry, CC0-1.0.
 * bun generators/dal-chase-tower.ts [out.glb]
 *
 * Map frame: x, y, z up, metres; origin at the anchor (the centroid of OSM
 * way/28781114, -96.7966344 32.7879509) on the lowest ground under the
 * footprint. Placed at bearing 135, so the model's +y points south-east
 * and its x axis runs along the tower's long side, south-west (+x) to
 * north-east (-x).
 *
 * Form: a 55-storey slab, 69 x 38 m, of warm grey granite with punched
 * windows. Each broad face is split by a narrow glazed slot running from a
 * tall glass entrance bay up to the crown; each end face has a slot too. At the top the granite steps up
 * from the middle of each broad face to its corners, a stepped V, in front
 * of a glass crown whose top is a segmental arch across the whole width,
 * split at its apex by a narrow notch. Through the crown, from broad face to
 * broad face, runs the "keyhole": a six-storey opening under a glazed
 * lintel, with a curved glass drum standing in each side of it.
 *
 * Identifying features, in order: the arched glass top; the opening through
 * it (sky shows through from both broad faces); the stepped granite V under
 * it; the slot down the middle of each broad face.
 *
 * Sources
 * - OSM way/28781114 (building=commercial, height 225 m, 55 levels, wikidata
 *   Q579403). Its outline runs about 8 m past the tower on the north-west
 *   side, over plaza that the lidar shows as ground, so the tower is drawn
 *   to the lidar walls instead; the outline is still what `replaces` lists.
 * - Lidar (measured): USGS 3DEP TX_Pecos_Dallas_B3_2018 (2018 flight), 1 m
 *   grid. The point cloud carries nothing above about 51 m over this block,
 *   so it gives only the footprint: wall returns at x45 = -16 and +22,
 *   y45 = -35 and +34 in the bearing-45 frame, i.e. a 69 x 38 m slab whose
 *   centre is 0.5 m south-west and 3 m south-east of the anchor; a dip in
 *   the north-west wall at mid-length where the glazed slot is.
 * - NAIP (USGS) orthophoto: confirms the outline and the plaza around it.
 * - Published: 225 m (738 ft) to the roof, 55 storeys, 1987, SOM; a
 *   "6-story hole in the center of the building near the top"
 *   (Wikipedia, "Chase Tower (Dallas)").
 * - Photos (Wikimedia Commons; shapes and colours come from these):
 *   - "JPMorganChaseTower.png", User:Nmajdan, CC BY-SA 2.5,
 *     https://commons.wikimedia.org/wiki/File:JPMorganChaseTower.png
 *     (broad face from a tower to the south-east: crown proportions)
 *   - "Top of JPMorgan Chase Tower.jpg", Joe Mabel, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Top_of_JPMorgan_Chase_Tower.jpg
 *     (drums, lintel and notch)
 *   - "Chase Tower Dallas.jpg", NETarrantMan, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Chase_Tower_Dallas.jpg
 *     (stepped granite V, end face)
 *   - "Dallas July 2015 16 (Chase Tower).jpg" and "... 18" and "... 21",
 *     Michael Barera, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Dallas_July_2015_16_(Chase_Tower).jpg
 *     https://commons.wikimedia.org/wiki/File:Dallas_July_2015_18_(Chase_Tower).jpg
 *     https://commons.wikimedia.org/wiki/File:Dallas_July_2015_21_(Chase_Tower).jpg
 *     (base, entrance bay, slot, granite colour)
 *   - "JPMorgan Chase Tower1.jpg", Kent Wang, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:JPMorgan_Chase_Tower1.jpg
 *   - "Dallas Crow Center 2100 Ross Ave JP Morgan Chase Tower Fairmont
 *     Hotel.jpg", Andreas Praefcke, CC BY 3.0,
 *     https://commons.wikimedia.org/wiki/File:Dallas_Crow_Center_2100_Ross_Ave_JP_Morgan_Chase_Tower_Fairmont_Hotel.jpg
 *   - "Dallas - Klyde Warren Park 10.jpg", Joe Mabel, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Dallas_-_Klyde_Warren_Park_10.jpg
 * - Look-only: none used.
 *
 * Numbers
 * - Footprint 69 x 38 m: measured (lidar walls).
 * - Roof 225 m at the arch's apex: published.
 * - Arch springing 209 m (a 16 m rise over the 62 m crown), lintel
 *   195-201 m, opening floor 168 m, granite steps 178/186/194/202 m:
 *   estimated from the Nmajdan photo, scaled to the published height (about
 *   0.165 m/px on the face). The opening is drawn 27 m tall, a little more
 *   than the published six storeys (about 24 m), so it reads at phone size.
 * - Crown inset (3.5 m at the ends, 2 m on the broad faces), the drums'
 *   radius (5.5 m) and the opening's width (36 m between the crown halves):
 *   estimated from the same photos. The clear gap between the drums is
 *   drawn 14 m wide, wider than the 7-8 m it reads in photos, so the sky
 *   shows through at phone size (bolder, per STYLE.md).
 * - Broad-face slot 2.8 m wide, end-face slot 2.6 m, entrance bay 10 m wide
 *   and 38 m tall: estimated from the Barera and NETarrantMan photos.
 * - Window panels group three storeys of 4.1 m (225 m / 55).
 *
 * Doubts
 * - No lidar above 51 m, so every crown height rests on photos and the
 *   published total.
 * - The end (north-east and south-west) faces are drawn plain to 202 m; the
 *   photos show them only obliquely, with a few small steps near the top
 *   that are left out.
 * - Left out as too small: the round medallions over the base, the glass
 *   kiosks at the corners, the Chase sign on the crown (the building has
 *   since been renamed).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { capRing, ccw, chamfer, finishGlb, outward, type XY } from './sea-columbia-center'

// ---------------------------------------------------------------- kit
// Shared with dal-comerica-bank-tower.ts.

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const sb = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]

/** A convex planar polygon, wound to face `n`. */
export function poly(part: Part, pts: V3[], n: V3) {
  const g = crs(sb(pts[1], pts[0]), sb(pts[2], pts[0]))
  const p = dot(g, n) < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < p.length - 1; i++) part.tri(p[0], p[i], p[i + 1])
}

/**
 * A prism over a plan ring, its vertical corners chamfered by `ch`. Walls
 * into `walls`, the roof cap into `roof`; no floor (it stands on something).
 */
export function prism(walls: Part, roof: Part | null, ring: XY[], z0: number, z1: number, ch = 0.5, bottom?: Part) {
  const r = ch > 0 ? chamfer(ccw(ring), ch) : ccw(ring)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], n = outward(a, b)
    poly(walls, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], [n[0], n[1], 0])
  }
  if (roof) capRing(roof, r, z1, true)
  if (bottom) capRing(bottom, r, z0, false)
}

export const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

export function box(walls: Part, roof: Part | null, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, ch = 0.5, bottom?: Part) {
  prism(walls, roof, rect(x0, x1, y0, y1), z0, z1, ch, bottom)
}

/**
 * Extrude a convex profile along an axis. `prof` is a list of [u, z] points
 * (u across the axis), `axis` 'y' sweeps it from s0 to s1 along y with u = x,
 * 'x' sweeps along x with u = y. Sides go to `sides` (smooth-shaded where
 * the profile turns gently, as on an arch), the two end faces to `ends`.
 */
export function extrude(sides: Part, ends: Part | null, prof: [number, number][], axis: 'x' | 'y', s0: number, s1: number, smooth = 25) {
  const P = (u: number, z: number, s: number): V3 => (axis === 'y' ? [u, s, z] : [s, u, z])
  const N = (nu: number, nz: number): V3 => (axis === 'y' ? [nu, 0, nz] : [0, nu, nz])
  const cu = prof.reduce((t, p) => t + p[0], 0) / prof.length, cz = prof.reduce((t, p) => t + p[1], 0) / prof.length
  const n = prof.length
  const en = (i: number): [number, number] => {
    const a = prof[i], b = prof[(i + 1) % n]
    let nu = b[1] - a[1], nz = -(b[0] - a[0])
    const l = Math.hypot(nu, nz) || 1
    nu /= l; nz /= l
    const mu = (a[0] + b[0]) / 2 - cu, mz = (a[1] + b[1]) / 2 - cz
    if (nu * mu + nz * mz < 0) { nu = -nu; nz = -nz }
    return [nu, nz]
  }
  const vn = (i: number, e: number): [number, number] => {
    // vertex normal at prof[i] for edge e, averaged with the neighbouring edge if the turn is gentle
    const o = e === i ? (i - 1 + n) % n : (i + 0) % n
    const a = en(e), b = en(o)
    const ang = (Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1]))) * 180) / Math.PI
    if (ang > smooth) return a
    const l = Math.hypot(a[0] + b[0], a[1] + b[1])
    return [(a[0] + b[0]) / l, (a[1] + b[1]) / l]
  }
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, a = prof[i], b = prof[j]
    const [nu, nz] = en(i)
    const na = vn(i, i), nb = vn(j, i)
    const A0 = P(a[0], a[1], s0), B0 = P(b[0], b[1], s0), B1 = P(b[0], b[1], s1), A1 = P(a[0], a[1], s1)
    const NA = N(na[0], na[1]), NB = N(nb[0], nb[1])
    const want = N(nu, nz)
    const g = crs(sb(B0, A0), sb(B1, A0))
    if (dot(g, want) >= 0) {
      sides.tri(A0, B0, B1, undefined, undefined, undefined, [NA, NB, NB])
      sides.tri(A0, B1, A1, undefined, undefined, undefined, [NA, NB, NA])
    } else {
      sides.tri(A0, B1, B0, undefined, undefined, undefined, [NA, NB, NB])
      sides.tri(A0, A1, B1, undefined, undefined, undefined, [NA, NA, NB])
    }
  }
  if (ends) {
    const ax: V3 = axis === 'y' ? [0, 1, 0] : [1, 0, 0]
    poly(ends, prof.map(([u, z]) => P(u, z, s1)), ax)
    poly(ends, prof.map(([u, z]) => P(u, z, s0)), [-ax[0], -ax[1], -ax[2]])
  }
}

/** A circular-arc profile closed by a flat base: [u0..u1] at zBase, arc through (uc, zc) radius R. */
export function archProfile(u0: number, u1: number, zBase: number, uc: number, zc: number, R: number, seg: number): [number, number][] {
  const pts: [number, number][] = [[u0, zBase], [u1, zBase]]
  const t0 = Math.acos(Math.max(-1, Math.min(1, (u1 - uc) / R))), t1 = Math.acos(Math.max(-1, Math.min(1, (u0 - uc) / R)))
  for (let k = 0; k <= seg; k++) {
    const t = t0 + ((t1 - t0) * k) / seg
    pts.push([uc + R * Math.cos(t), zc + R * Math.sin(t)])
  }
  return pts
}

/**
 * Window panels on a vertical face running from a to b (plan points, the
 * face's outward normal on the right of a->b as for a counter-clockwise
 * ring), between z0 and z1. `spans` limits the panels to [s0, s1] runs
 * along the face (metres from a); each run is split into bays of about
 * `bayW` with `pier` between them. Storeys are grouped `group` metres high
 * counted from z = 0, so they line up across faces.
 */
export type PanelOpts = { group: number; spandrel: number; bayW: number; pier: number; proud?: number; zMin?: number }
export function panels(part: Part, a: XY, b: XY, z0: number, z1: number, spans: [number, number][], o: PanelOpts) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const n = outward(a, b), pr = o.proud ?? 0.06
  const at = (s: number): XY => [a[0] + t[0] * s + n[0] * pr, a[1] + t[1] * s + n[1] * pr]
  const N: V3 = [n[0], n[1], 0]
  for (const [s0, s1] of spans) {
    const w = s1 - s0
    if (w < 1.2) continue
    const bays = Math.max(1, Math.round((w + o.pier) / (o.bayW + o.pier))), bw = (w - o.pier * (bays - 1)) / bays
    for (let k = Math.floor(z0 / o.group); k * o.group < z1; k++) {
      const lo = Math.max(k * o.group + o.spandrel / 2, z0 + 0.6, o.zMin ?? 0), hi = Math.min((k + 1) * o.group - o.spandrel / 2, z1 - 0.8)
      if (hi - lo < 2) continue
      for (let q = 0; q < bays; q++) {
        const p0 = at(s0 + q * (bw + o.pier)), p1 = at(s0 + q * (bw + o.pier) + bw)
        poly(part, [[p0[0], p0[1], lo], [p1[0], p1[1], lo], [p1[0], p1[1], hi], [p0[0], p0[1], hi]], N)
      }
    }
  }
}

// ---------------------------------------------------------------- the model

function build() {
  // Tower extents in the model frame (bearing 135): lidar walls.
  const X0 = -34.0, X1 = 35.0, Y0 = -16.0, Y1 = 22.0
  const CX = (X0 + X1) / 2, CY = (Y0 + Y1) / 2 // 0.5, 3
  const HW = (X1 - X0) / 2 // 34.5
  const H = 225
  // Crown, about the face centre CX.
  const ARC_R = (31 * 31 + 16 * 16) / 32, ARC_ZC = H - ARC_R // apex 225, springing 209 at |x| = 31
  const CROWN_HW = 31.0, CROWN_IN = 2.0
  const VOID_HW = 18.0, VOID_Z0 = 168, VOID_Z1 = 195, LINTEL_Z1 = 201, NOTCH_HW = 1.5
  const DRUM_R = 5.5, DRUM_CX = 12.5 // clear gap 2 * (12.5 - 5.5) = 14 m
  const SCREEN = 6.0 // depth of the stepped granite in front of the crown
  const STEPS: [number, number, number][] = [ // [|x| from, |x| to, top] about CX
    [0, 8, 168], [8, 15, 178], [15, 22, 186], [22, 31, 194], [31, HW, 202],
  ]
  const SLOT_HW = 1.4, SLOT_D = 1.6, BAY_HW = 5.0, BAY_D = 2.4, BAY_Z = 38

  const granite = new Part(), win = new Part(), crown = new Part(), roof = new Part()

  // --- shaft: two halves either side of the slot, full height to the void floor
  const xl = CX - SLOT_HW, xr = CX + SLOT_HW, bl = CX - BAY_HW, br = CX + BAY_HW
  // The end faces carry a slot of their own, ESLOT_HW wide and ESLOT_D deep.
  const ESLOT_HW = 1.3, ESLOT_D = 1.4
  const notched = (x0: number, x1: number, end: 'w' | 'e'): XY[] => {
    const a = CY - ESLOT_HW, b = CY + ESLOT_HW
    return end === 'w'
      ? [[x0, Y0], [x1, Y0], [x1, Y1], [x0, Y1], [x0, b], [x0 + ESLOT_D, b], [x0 + ESLOT_D, a], [x0, a]]
      : [[x0, Y0], [x1, Y0], [x1, a], [x1 - ESLOT_D, a], [x1 - ESLOT_D, b], [x1, b], [x1, Y1], [x0, Y1]]
  }
  prism(granite, null, notched(X0, bl, 'w'), 0, BAY_Z)
  prism(granite, null, notched(br, X1, 'e'), 0, BAY_Z)
  prism(granite, roof, notched(X0, xl, 'w'), BAY_Z, VOID_Z0, 0.5, granite)
  prism(granite, roof, notched(xr, X1, 'e'), BAY_Z, VOID_Z0, 0.5, granite)
  box(win, null, X0 + ESLOT_D - 0.2, X0 + ESLOT_D + 0.1, CY - ESLOT_HW - 0.1, CY + ESLOT_HW + 0.1, 0, 202, 0)
  box(win, null, X1 - ESLOT_D - 0.1, X1 - ESLOT_D + 0.2, CY - ESLOT_HW - 0.1, CY + ESLOT_HW + 0.1, 0, 202, 0)
  // the slot's glass, recessed into both broad faces
  box(win, null, xl - 0.1, xr + 0.1, Y0 + SLOT_D, Y1 - SLOT_D, BAY_Z - 0.5, VOID_Z0, 0)
  // the tall glass entrance bay at the foot of the slot on both broad faces
  box(crown, null, bl - 0.1, br + 0.1, Y0 + BAY_D, Y1 - BAY_D, 0, BAY_Z, 0)

  // --- end faces and corners up to 202 m, full depth
  prism(granite, roof, notched(X0, CX - 31, 'w'), VOID_Z0, 202)
  prism(granite, roof, notched(CX + 31, X1, 'e'), VOID_Z0, 202)

  // --- the stepped granite screens on both broad faces
  for (const [f0, f1, top] of STEPS) {
    if (top <= VOID_Z0 || f0 >= 31) continue
    for (const sgn of [-1, 1]) {
      const a = CX + sgn * f0, b = CX + sgn * f1
      const x0 = Math.min(a, b), x1 = Math.max(a, b)
      box(granite, roof, x0, x1, Y0, Y0 + SCREEN, VOID_Z0, top)
      box(granite, roof, x0, x1, Y1 - SCREEN, Y1, VOID_Z0, top)
    }
  }

  // --- glass crown: two halves beside the opening, the lintel, and the
  // arched top split by the apex notch
  const cy0 = Y0 + CROWN_IN, cy1 = Y1 - CROWN_IN
  const SEG = 9
  // halves beside the opening, from the void floor to the arch
  for (const sgn of [-1, 1]) {
    const u0 = sgn < 0 ? -CROWN_HW : VOID_HW, u1 = sgn < 0 ? -VOID_HW : CROWN_HW
    const prof = archProfile(CX + u0, CX + u1, VOID_Z0, CX, ARC_ZC, ARC_R, SEG)
    extrude(crown, crown, prof, 'y', cy0, cy1)
  }
  // lintel over the opening
  box(crown, null, CX - VOID_HW - 0.2, CX + VOID_HW + 0.2, cy0 - 0.4, cy1 + 0.4, VOID_Z1, LINTEL_Z1, 0.3, crown)
  // the two arched halves over the lintel, split by the notch
  for (const sgn of [-1, 1]) {
    const u0 = sgn < 0 ? -VOID_HW : NOTCH_HW, u1 = sgn < 0 ? -NOTCH_HW : VOID_HW
    const prof = archProfile(CX + u0, CX + u1, LINTEL_Z1, CX, ARC_ZC, ARC_R, 5)
    extrude(crown, crown, prof, 'y', cy0, cy1)
  }
  // drums standing in the opening
  const DS = 12
  for (const sgn of [-1, 1]) {
    const cx = CX + sgn * DRUM_CX, cyy = (cy0 + cy1) / 2
    const ring: XY[] = []
    for (let k = 0; k < DS; k++) {
      const t = (2 * Math.PI * k) / DS
      ring.push([cx + DRUM_R * Math.cos(t), cyy + DRUM_R * Math.sin(t)])
    }
    // smooth walls
    for (let k = 0; k < DS; k++) {
      const a = ring[k], b = ring[(k + 1) % DS]
      const na: V3 = [(a[0] - cx) / DRUM_R, (a[1] - cyy) / DRUM_R, 0], nb: V3 = [(b[0] - cx) / DRUM_R, (b[1] - cyy) / DRUM_R, 0]
      win.tri([a[0], a[1], VOID_Z0], [b[0], b[1], VOID_Z0], [b[0], b[1], VOID_Z1], undefined, undefined, undefined, [na, nb, nb])
      win.tri([a[0], a[1], VOID_Z0], [b[0], b[1], VOID_Z1], [a[0], a[1], VOID_Z1], undefined, undefined, undefined, [na, nb, na])
    }
  }

  // --- window panels on the granite
  const g = { group: 3 * 4.1, spandrel: 2.6, bayW: 5.0, pier: 1.2, zMin: 5 }
  const faces = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, which: string, spans?: [number, number][]) => {
    // which: s (y0 face), n (y1 face), w (x0 face), e (x1 face)
    if (which.includes('s')) panels(win, [x0, y0], [x1, y0], z0, z1, spans ?? [[0.9, x1 - x0 - 0.9]], g)
    if (which.includes('n')) panels(win, [x1, y1], [x0, y1], z0, z1, spans ?? [[0.9, x1 - x0 - 0.9]], g)
    // end faces skip their slot
    const m = CY - y0, L = y1 - y0, sw = ESLOT_HW + 0.7
    if (which.includes('w')) panels(win, [x0, y1], [x0, y0], z0, z1, [[0.9, L - m - sw], [L - m + sw, L - 0.9]], g)
    if (which.includes('e')) panels(win, [x1, y0], [x1, y1], z0, z1, [[0.9, m - sw], [m + sw, L - 0.9]], g)
  }
  // shaft halves: broad faces, skipping the entrance bay's width at the foot
  faces(X0, bl, Y0, Y1, 0, BAY_Z, 'sn')
  faces(br, X1, Y0, Y1, 0, BAY_Z, 'sn')
  faces(X0, xl, Y0, Y1, BAY_Z, VOID_Z0, 'sn')
  faces(xr, X1, Y0, Y1, BAY_Z, VOID_Z0, 'sn')
  faces(X0, xl, Y0, Y1, 0, 202, 'w')
  faces(xr, X1, Y0, Y1, 0, 202, 'e')
  // corners above the shaft on the broad faces
  faces(X0, CX - 31, Y0, Y1, VOID_Z0, 202, 'sn')
  faces(CX + 31, X1, Y0, Y1, VOID_Z0, 202, 'sn')
  for (const [f0, f1, top] of STEPS) {
    if (top <= VOID_Z0 || f0 >= 31) continue
    for (const sgn of [-1, 1]) {
      const a = CX + sgn * f0, b = CX + sgn * f1
      const x0 = Math.min(a, b), x1 = Math.max(a, b)
      faces(x0, x1, Y0, Y0 + SCREEN, VOID_Z0, top, 's', [[0.7, x1 - x0 - 0.7]])
      faces(x0, x1, Y1 - SCREEN, Y1, VOID_Z0, top, 'n', [[0.7, x1 - x0 - 0.7]])
    }
  }

  const GRANITE = finish('chase-granite', 0xb9a68f)
  const WINDOW = { ...PALETTE.window, color: 0x5d6f80 }
  const CROWN = windowVariant(2, 0x7189a3)
  return finishGlb('dal-chase-tower', 'Chase Tower', [
    { part: granite, material: GRANITE },
    { part: win, material: WINDOW },
    { part: crown, material: CROWN },
    { part: roof, material: PALETTE.roof },
  ], { bearing: 135, height: H, replaces: ['way/28781114'] })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/dal-chase-tower.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
