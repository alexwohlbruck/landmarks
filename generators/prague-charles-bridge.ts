/**
 * Charles Bridge (Karlův most), Prague — procedural, CC0-1.0, no textures.
 * bun generators/prague-charles-bridge.ts
 *
 * Peter Parler's Gothic stone bridge over the Vltava (1357–1402): sixteen
 * arches on fifteen piers with pointed cutwaters, a parapeted deck about
 * 9.5 m wide, thirty Baroque statues and groups (1683–1938) on bays over the
 * piers, the Old Town Bridge Tower at the east end and, at the west end, the
 * two unequal Lesser Town Bridge Towers (the tall Gothic tower of 1464 and
 * the lower Romanesque Judith Tower) joined by a battlemented gate.
 *
 * This file also exports the small Gothic kit the other Prague models build
 * with (prague-old-town-hall.ts, prague-powder-tower.ts): local frames,
 * oriented faces and solids, hipped roofs and spires, pointed-arch walls and
 * passages, and the statue figures. Its own build runs only when it is run.
 *
 * Frame: map frame x east, y north, z up, metres, placed at bearing 12.3°,
 * so model +x runs along the bridge (Old Town, east, at +x) and +y is
 * downstream (north). Anchor 14.41015, 50.08663 (the lead's anchor, on the
 * bridge's centre line 28 m west of the outline's midpoint). The bridge is
 * not straight: its centre line, measured from the outline's straight edges,
 * bends from y = 12.3 at the west end through y = −1.0 at x = −30 and
 * y = 5.8 at x = 156 to y = 3.0 at the Old Town tower; the deck follows that
 * line, and each pier stands square to it.
 * z = 0 is the Vltava under the bridge (the map's terrain over the water,
 * 185.4–185.6 m in Mapterhorn z14); feet on land run down to the map's own
 * terrain vertex by vertex (GROUND, Mapterhorn z14 every 5 m, metres above
 * 185.5 m), per docs/reference.md, Bridges.
 *
 * Bridges rules: one placement for the whole structure. The model draws the
 * deck's stone paving (the bridge is pedestrian: highway=pedestrian, layer
 * 1/3, which the model owns as a walkway), the parapets, statues and lamps.
 * Walking surface heights it was built to (above the river, z): 7.0 at the
 * west end (x −222.5, level with Mostecká), 8.4 at x −196, 9.6 at −165,
 * 10.5 at −130, 11.0 at −100, 11.7 at −50, a crest of 12.0 from x 0 to 60,
 * 11.6 at 120, 10.6 at 180, 9.4 at 220, 8.2 at the Old Town tower's gate.
 *
 * Replaces: the man_made=bridge outline way/119016167 (which also covers the
 * Old Town tower), the Old Town Bridge Tower way/839278890 and its parts
 * 93479848, 482247472–482247479, 482310110; the Lesser Town Bridge Tower
 * way/839278891 and its parts 389652949, 482310111–482310116; the Judith
 * Tower way/389652950 and its roof part 482310118; the gate between them,
 * way/460016966, and its side parts 460016964, 460016965.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): the outline way/119016167 (its
 *   triangular bumps give every cutwater: 15 piers, at x −208.6, −180.3,
 *   −149.2, −118.3, −86.6, −54.9, −24.9, 5.85, 36.85, 67.85, 98.15, 129.2,
 *   160.85, 190.45, 221.25; downstream points 5 m, upstream points 8.6 m past
 *   the face; deck 9.4–10.6 m between the straight edges); the RÚIAN
 *   bridge:support ways 1132294228–1132294233 (piers 8.8–9.6 m thick on
 *   land; the Kampa arch at x −113…−91 and the two Lesser Town arches built
 *   up); the streets under the bridge (Saská at x −196, Čertovka at −160,
 *   Na Kampě at −133); the thirty statue nodes (historic=memorial,
 *   location=bridge) with their names; the street lamps; the tower building
 *   parts with heights: Old Town tower body 26, gallery 26–31, corner
 *   turrets 24–38 with 7 m pyramids, roof 31–50 hipped, the south stair
 *   turret to 42 with an 11 m pyramid, gate walls 9 (passage 6.4 m wide);
 *   Lesser Town tower body 26, gallery 26–29, turrets 25–36, roof 29–46;
 *   Judith Tower 17 with roof 15–29 hipped; gate 8–12.
 * - Published: Czech Wikipedia "Karlův most": 515.76 m long, 9.40–9.50 m
 *   wide, 16 arches, spans 16.62 m (Old Town side) to 23.38 m, deck 13 m
 *   above normal water, 30 statues and groups, wooden ice guards on the
 *   upstream side. "Staroměstská mostecká věž": 47 m. "Malostranské mostecké
 *   věže": the tall tower 45 m, the Judith Tower almost 30 m, the gate a
 *   double Gothic arch with a battlemented walkway.
 * - Mapterhorn terrain z14 (tools/terrain.ts grid, bearing 12.3, step 5 m;
 *   Mapterhorn has no z15 here): water 185.4–185.6 m; Kampa 189.0–189.7;
 *   Lesser Town end 191.7–192.5; Old Town square 193.6–193.8.
 * Photos (evidence, Wikimedia Commons):
 * - DXR, "North view of Charles Bridge from Mánesův most, Prague 20160808
 *   1.jpg", CC BY-SA 4.0 (the whole bridge from the north):
 *   https://commons.wikimedia.org/wiki/File:North_view_of_Charles_Bridge_from_M%C3%A1nes%C5%AFv_most,_Prague_20160808_1.jpg
 * - Slyronit, "Charles bridge from Vltava, Prague.jpg", CC BY-SA 4.0 (from
 *   upstream, south-east: arches, cutwaters, statues in silhouette):
 *   https://commons.wikimedia.org/wiki/File:Charles_bridge_from_Vltava,_Prague.jpg
 * - Uoaei1, "Praha Charles Bridge from Malá Strana Bridge Tower 20170430
 *   01.jpg", CC BY-SA 4.0 (the deck from above: bays, pedestals, statues,
 *   parapets, lamps, the Old Town tower):
 *   https://commons.wikimedia.org/wiki/File:Praha_Charles_Bridge_from_Mal%C3%A1_Strana_Bridge_Tower_20170430_01.jpg
 * - Ввласенко, "The Vltava, Charles Bridge, Old Town Bridge Tower and
 *   Church of St. Francis of Assisi. Prague, Czech Republic.jpg", CC BY-SA
 *   3.0 (the east arches, cutwater caps, ice guards, the tower and its stair
 *   turret spire from the south-west):
 *   https://commons.wikimedia.org/wiki/File:The_Vltava,_Charles_Bridge,_Old_Town_Bridge_Tower_and_Church_of_St._Francis_of_Assisi._Prague,_Czech_Republic.jpg
 * - Jakub Hałun, "20190816 Most Karola w Pradze 1713 5404 DxO.jpg", CC
 *   BY-SA 4.0 (from downstream: arch rings, cutwaters and their caps, the
 *   pilasters over the piers, the Old Town tower's west face and roof):
 *   https://commons.wikimedia.org/wiki/File:20190816_Most_Karola_w_Pradze_1713_5404_DxO.jpg
 * - Dietmar Rabich, "Prag, Karlsbrücke, Kleinseitner Brückenturm -- 2019 --
 *   6561.jpg" and "Prag, Karlsbrücke, Altstädter Brückenturm -- 2019 --
 *   6566.jpg" (the second in fact shows the Lesser Town towers), CC BY-SA
 *   4.0 (the Lesser Town tower's gallery, turrets, roof, niches; the Judith
 *   Tower's roof and dormer; the gate's battlements):
 *   https://commons.wikimedia.org/wiki/File:Prag,_Karlsbr%C3%BCcke,_Kleinseitner_Br%C3%BCckenturm_--_2019_--_6561.jpg
 *   https://commons.wikimedia.org/wiki/File:Prag,_Karlsbr%C3%BCcke,_Altst%C3%A4dter_Br%C3%BCckenturm_--_2019_--_6566.jpg
 * - Jo Venezia, "Malostranské mostecké věže v Praze.jpg", CC BY-SA 4.0 (the
 *   deck toward the Lesser Town towers, pedestals and statues):
 *   https://commons.wikimedia.org/wiki/File:Malostransk%C3%A9_mosteck%C3%A9_v%C4%9B%C5%BEe_v_Praze.jpg
 *
 * Numbers
 * - Arches: between the piers (9.2 m thick, OSM/RÚIAN), so spans of 19–22.6
 *   m and 16.4 m at the Old Town end (published 16.62); segmental, rising
 *   0.3 of the span to a crown 2.9 m under the deck (estimated from the
 *   downstream photo: springing a third of the way up, crown two thirds).
 * - Cutwaters: capped at the springing + 3.4 m with a half-pyramid rising
 *   3.6 m to the face, 6 m (downstream) and 9 m (upstream) long (photo); pilasters 4.2 m wide, 0.9 m proud, run up
 *   from the caps to the statue bays (photo).
 * - Deck heights above: estimated from the terrain at both ends, the 13 m
 *   published height, and Kampa's steps (some 7 m down).
 * - Parapet 1.3 m, 0.8 m thick, over a 0.6 m string course; pedestals 2.4–2.6 m; figures 2.4–3.6 m
 *   (larger than life), all estimated from the deck photos.
 * - Towers: OSM part heights above their thresholds (the Old Town gate at
 *   z 8.2, the Lesser Town gate on the terrain), with the Old Town roof
 *   apex at 44.5 and its finials at 47 (published 47 m; OSM's 50 counts from
 *   lower ground), and the Lesser Town roof apex at 43.5, finials 45.5.
 *
 * - Colours (lead's review against the photos): weathered dark grey-brown
 *   sandstone for the bridge and Lesser Town towers, the Old Town tower near
 *   black (held at charcoal lightness, STYLE.md), dark slate roofs.
 *
 * Simplified / doubts
 * - The statues are recognisable stand-ins, not portraits: each keeps its
 *   real composition (single saint, bishop's mitre, Nepomuk's five stars,
 *   child on the arm or shoulder, groups of two or three on a rock, the
 *   Calvary crucifix, the Pietà), not its carving.
 * - The built-up arches on land are drawn as blind arches on solid walls;
 *   the Saská passage through the second arch is a plain round arch.
 * - The Old Town tower's east-face sculpture is a few seated and standing
 *   figures in three niches; the coats of arms are left out.
 * - Arch rise and the deck's crest height are estimates; the deck heights
 *   are not lidar (there is no open lidar here).
 * - Bruncvík's column (on the Kampa pier, not one of the thirty) is in the
 *   detail model only.
 */
import { Part, writeGlb, cross, sub, len, type V3, type MaterialSpec } from './mesh'
import { finish, PALETTE } from './palette'
import { groundAt, tube, bead, footedLoft, type GroundGrid } from './bridge-kit'

// ===========================================================================
// The kit, shared with the other Prague models.

/** A local frame: (u, v, w) → map frame, turned `deg` counter-clockwise (u east at 0). */
export type Xf = (u: number, v: number, w: number) => V3
export function frame(ox: number, oy: number, oz: number, deg: number): Xf {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a)
  return (u, v, w) => [ox + u * c - v * s, oy + u * s + v * c, oz + w]
}
const add3 = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scl3 = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const nrm3 = (a: V3): V3 => scl3(a, 1 / (len(a) || 1))
const centroid = (q: V3[]): V3 => scl3(q.reduce((s, p) => add3(s, p), [0, 0, 0] as V3), 1 / q.length)

/** A planar convex polygon, wound to face `n`. */
export function face(p: Part, q: V3[], n: V3) {
  let nx = 0, ny = 0, nz = 0
  for (let i = 0; i < q.length; i++) {
    const a = q[i], b = q[(i + 1) % q.length]
    nx += (a[1] - b[1]) * (a[2] + b[2])
    ny += (a[2] - b[2]) * (a[0] + b[0])
    nz += (a[0] - b[0]) * (a[1] + b[1])
  }
  if (Math.hypot(nx, ny, nz) < 1e-9) return
  const pts = nx * n[0] + ny * n[1] + nz * n[2] >= 0 ? q : [...q].reverse()
  for (let i = 1; i < pts.length - 1; i++) {
    if (len(cross(sub(pts[i], pts[0]), sub(pts[i + 1], pts[0]))) > 1e-8) p.tri(pts[0], pts[i], pts[i + 1])
  }
}
/** A face wound away from the point `from` (the inside of a convex solid). */
export function faceOut(p: Part, q: V3[], from: V3) {
  face(p, q, sub(centroid(q), from))
}

/** A box in a local frame; `skip` leaves faces out ('b' bottom, 't' top, 'u0' 'u1' 'v0' 'v1'). */
export function box(p: Part, F: Xf, u0: number, u1: number, v0: number, v1: number, w0: number, w1: number, skip = '') {
  const c = F((u0 + u1) / 2, (v0 + v1) / 2, (w0 + w1) / 2)
  const P = (u: number, v: number, w: number) => F(u, v, w)
  const fs: [string, V3[]][] = [
    ['b', [P(u0, v0, w0), P(u1, v0, w0), P(u1, v1, w0), P(u0, v1, w0)]],
    ['t', [P(u0, v0, w1), P(u1, v0, w1), P(u1, v1, w1), P(u0, v1, w1)]],
    ['u0', [P(u0, v0, w0), P(u0, v1, w0), P(u0, v1, w1), P(u0, v0, w1)]],
    ['u1', [P(u1, v0, w0), P(u1, v1, w0), P(u1, v1, w1), P(u1, v0, w1)]],
    ['v0', [P(u0, v0, w0), P(u1, v0, w0), P(u1, v0, w1), P(u0, v0, w1)]],
    ['v1', [P(u0, v1, w0), P(u1, v1, w0), P(u1, v1, w1), P(u0, v1, w1)]],
  ]
  for (const [k, q] of fs) if (!skip.split(' ').includes(k)) faceOut(p, q, c)
}

/** `n` points of an ellipse at height w, counter-clockwise from above. */
export function ring(F: Xf, cu: number, cv: number, ru: number, rv: number, w: number, n: number, phase = 0): V3[] {
  return Array.from({ length: n }, (_, k) => {
    const a = phase + (2 * Math.PI * k) / n
    return F(cu + ru * Math.cos(a), cv + rv * Math.sin(a), w)
  })
}

/** The sides of a stack of rings (same corner count), wound outward; caps optional. */
export function loft(p: Part, rings: V3[][], top = false, bottom = false) {
  const n = rings[0].length
  for (let k = 0; k + 1 < rings.length; k++) {
    const axis = scl3(add3(centroid(rings[k]), centroid(rings[k + 1])), 0.5)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const q = [rings[k][i], rings[k][j], rings[k + 1][j], rings[k + 1][i]]
      const c = centroid(q)
      const out = sub(c, axis)
      if (len(sub(q[2], q[3])) < 1e-6) face(p, [q[0], q[1], q[2]], out)
      else if (len(sub(q[0], q[1])) < 1e-6) face(p, [q[0], q[2], q[3]], out)
      else face(p, q, out)
    }
  }
  if (top) face(p, rings[rings.length - 1], [0, 0, 1])
  if (bottom) face(p, rings[0], [0, 0, -1])
}

/** A cone or pyramid from a ring to an apex. */
export function spire(p: Part, F: Xf, cu: number, cv: number, r: number, w0: number, w1: number, n: number, phase = Math.PI / n) {
  const base = ring(F, cu, cv, r, r, w0, n, phase), apex = F(cu, cv, w1)
  const c = F(cu, cv, w0 + (w1 - w0) * 0.25)
  for (let i = 0; i < n; i++) faceOut(p, [base[i], base[(i + 1) % n], apex], c)
}

/**
 * A hipped roof over the rectangle cu ± hu, cv ± hv from w0 to w1, its
 * ridge `ridge` long along v (0: a pyramid). `alongU` turns the ridge to u.
 */
export function hipRoof(p: Part, F: Xf, cu: number, cv: number, hu: number, hv: number, ridge: number, w0: number, w1: number, alongU = false) {
  const r = ridge / 2
  const c = F(cu, cv, w0 + (w1 - w0) * 0.2)
  const A = F(cu - hu, cv - hv, w0), B = F(cu + hu, cv - hv, w0), C = F(cu + hu, cv + hv, w0), D = F(cu - hu, cv + hv, w0)
  if (!alongU) {
    const R0 = F(cu, cv - r, w1), R1 = F(cu, cv + r, w1)
    faceOut(p, [B, C, R1, R0], c)
    faceOut(p, [D, A, R0, R1], c)
    faceOut(p, [A, B, R0], c)
    faceOut(p, [C, D, R1], c)
  } else {
    const R0 = F(cu - r, cv, w1), R1 = F(cu + r, cv, w1)
    faceOut(p, [A, B, R1, R0], c)
    faceOut(p, [C, D, R0, R1], c)
    faceOut(p, [B, C, R1], c)
    faceOut(p, [D, A, R0], c)
  }
}

/** A gabled roof over cu ± hu, cv ± hv, ridge along u; the gable ends are walls of `ends`. */
export function gableRoof(p: Part, ends: Part, F: Xf, cu: number, cv: number, hu: number, hv: number, w0: number, w1: number, overhang = 0) {
  const c = F(cu, cv, w0)
  const o = overhang
  const P = (u: number, v: number, w: number) => F(cu + u, cv + v, w)
  faceOut(p, [P(-hu - o, -hv - o, w0 - o * 0.6), P(hu + o, -hv - o, w0 - o * 0.6), P(hu + o, 0, w1), P(-hu - o, 0, w1)], c)
  faceOut(p, [P(hu + o, hv + o, w0 - o * 0.6), P(-hu - o, hv + o, w0 - o * 0.6), P(-hu - o, 0, w1), P(hu + o, 0, w1)], c)
  for (const s of [-1, 1]) faceOut(ends, [P(s * hu, -hv, w0), P(s * hu, hv, w0), P(s * hu, 0, w1)], F(cu, cv, w0 + 0.1))
}

/** The height of a pointed (two-centred) arch over |u| ≤ hw, springing at zs, apex at za. Falls back to a segment/semicircle when za − zs ≤ hw. */
export function pointedZ(hw: number, zs: number, za: number) {
  const h = za - zs
  if (h <= hw + 1e-6) {
    const R = (hw * hw + h * h) / (2 * h), zc = za - R
    return (u: number) => zc + Math.sqrt(Math.max(0, R * R - u * u))
  }
  const R = (hw * hw + h * h) / (2 * hw)
  return (u: number) => {
    const a = Math.abs(u)
    return zs + Math.sqrt(Math.max(0, R * R - (a - (hw - R)) ** 2))
  }
}

/**
 * A wall in the plane given by G(u, w) (a point on the wall), from u0 to u1
 * and w0 to w1, with an arched opening |u − uc| ≤ hw under `arch(u − uc)`.
 * Faces wound toward `n`.
 */
export function archWall(p: Part, G: (u: number, w: number) => V3, u0: number, u1: number, w0: number, w1: number, uc: number, hw: number, arch: (u: number) => number, segs: number, n: V3) {
  face(p, [G(u0, w0), G(uc - hw, w0), G(uc - hw, w1), G(u0, w1)], n)
  face(p, [G(uc + hw, w0), G(u1, w0), G(u1, w1), G(uc + hw, w1)], n)
  for (let k = 0; k < segs; k++) {
    const a = -hw + (2 * hw * k) / segs, b = -hw + (2 * hw * (k + 1)) / segs
    face(p, [G(uc + a, Math.min(arch(a), w1)), G(uc + b, Math.min(arch(b), w1)), G(uc + b, w1), G(uc + a, w1)], n)
  }
}

/**
 * The inside of an arched passage: side walls at u = uc ± hw from w0 to the
 * springing and the vault, between two depths d0 and d1. G(u, d, w) gives
 * a point. Faces wound toward the passage's axis.
 */
export function passage(p: Part, G: (u: number, d: number, w: number) => V3, uc: number, hw: number, w0: number, zs: number, arch: (u: number) => number, d0: number, d1: number, segs: number, floor?: Part) {
  const axis = (d: number, w: number) => G(uc, d, w)
  for (const s of [-1, 1]) {
    const q = [G(uc + s * hw, d0, w0), G(uc + s * hw, d1, w0), G(uc + s * hw, d1, zs), G(uc + s * hw, d0, zs)]
    face(p, q, sub(axis((d0 + d1) / 2, (w0 + zs) / 2), centroid(q)))
  }
  for (let k = 0; k < segs; k++) {
    const a = -hw + (2 * hw * k) / segs, b = -hw + (2 * hw * (k + 1)) / segs
    const q = [G(uc + a, d0, arch(a)), G(uc + b, d0, arch(b)), G(uc + b, d1, arch(b)), G(uc + a, d1, arch(a))]
    face(p, q, sub(axis((d0 + d1) / 2, zs), centroid(q)))
  }
  if (floor) {
    const q = [G(uc - hw, d0, w0), G(uc + hw, d0, w0), G(uc + hw, d1, w0), G(uc - hw, d1, w0)]
    face(floor, q, [0, 0, 1])
  }
}

// ---- Statues ----------------------------------------------------------------

/** What a figure carries or wears. */
export type FigOpt = {
  mitre?: boolean; crown?: boolean; halo?: boolean; child?: 'arm' | 'shoulder'; staff?: boolean
  bless?: boolean; armsUp?: boolean; crucifix?: boolean; book?: boolean; yaw?: number; slim?: number
}
/** A statue's frame: origin on its base, a across, b forward (toward the viewer), z up. */
export type SFrame = (a: number, b: number, z: number) => V3

/** A standing robed figure of height h at (a0, b0, z0) in the statue frame `X`. */
export function figure(p: Part, X: SFrame, a0: number, b0: number, z0: number, h: number, o: FigOpt = {}, detail = true) {
  const y = o.yaw ?? 0, cy = Math.cos(y), sy = Math.sin(y)
  const L: Xf = (a, b, z) => X(a0 + a * cy - b * sy, b0 + a * sy + b * cy, z0 + z)
  const s = o.slim ?? 1
  if (!detail) {
    // low: a four-sided robe in one taper, a diamond head
    const r0 = ring(L, 0, 0, 0.17 * h * s, 0.14 * h, 0, 4, Math.PI / 4), r1 = ring(L, 0, 0, 0.16 * h * s, 0.09 * h, 0.79 * h, 4, Math.PI / 4)
    loft(p, [r0, r1], true)
    const hr = ring(L, 0, 0.005 * h, 0.075 * h, 0.075 * h, 0.875 * h, 4, Math.PI / 4)
    const lo = L(0, 0, 0.78 * h), hi = L(0, 0.005 * h, (o.mitre ? 1.08 : 0.99) * h), c = L(0, 0, 0.875 * h)
    for (let i = 0; i < 4; i++) { faceOut(p, [hr[i], hr[(i + 1) % 4], hi], c); faceOut(p, [hr[(i + 1) % 4], hr[i], lo], c) }
    if (o.child === 'shoulder') figure(p, L, -0.1 * h, -0.02 * h, 0.8 * h, 0.3 * h, {}, false)
    return
  }
  // The robe: hem, knees, waist, chest, shoulders, neck.
  const rr: [number, number, number, number][] = [
    [0, 0.17, 0.15, 0.01], [0.26, 0.15, 0.12, 0.012], [0.5, 0.12, 0.09, 0], [0.66, 0.135, 0.085, 0],
    [0.76, 0.165, 0.085, -0.005], [0.8, 0.12, 0.07, 0], [0.835, 0.045, 0.045, 0],
  ]
  loft(p, rr.map(([z, ru, rv, db]) => ring(L, 0, db * h, ru * h * s, rv * h, z * h, 8, Math.PI / 8)))
  // The head.
  const hd: [number, number][] = [[0.83, 0.04], [0.855, 0.06], [0.91, 0.062], [0.955, 0.04]]
  const head = hd.map(([z, r]) => ring(L, 0, 0.008 * h, r * h, r * h * 1.05, z * h, 6, Math.PI / 6))
  loft(p, head)
  const crownTop = o.mitre ? 1.1 : 0.985
  if (o.mitre) {
    // a mitre: a tall wedge from the brow
    const m = ring(L, 0, 0.008 * h, 0.05 * h, 0.04 * h, 0.95 * h, 6, Math.PI / 6)
    loft(p, [head[3], m])
    const apex = [L(-0.02 * h, 0.008 * h, crownTop * h), L(0.02 * h, 0.008 * h, crownTop * h)]
    for (let i = 0; i < 6; i++) faceOut(p, [m[i], m[(i + 1) % 6], apex[Math.cos((Math.PI * (2 * i + 2)) / 6) > 0 ? 1 : 0]], L(0, 0.008 * h, 1.0 * h))
  } else if (o.crown) {
    const c0 = ring(L, 0, 0.008 * h, 0.055 * h, 0.055 * h, 0.94 * h, 6, Math.PI / 6)
    const c1 = ring(L, 0, 0.008 * h, 0.065 * h, 0.065 * h, 1.0 * h, 6, Math.PI / 6)
    loft(p, [head[3], c0, c1], true)
  } else {
    face(p, head[3], [0, 0, 1])
  }
  if (o.halo) {
    // Nepomuk's five stars on a ring behind the head.
    for (let k = 0; k < 5; k++) {
      const t = Math.PI * (0.1 + (0.8 * k) / 4)
      bead(p, L(0.13 * h * Math.cos(t), -0.03 * h, 0.9 * h + 0.13 * h * Math.sin(t)), 0.028 * h)
    }
  }
  // Arms: shoulder → elbow → hand, by pose.
  const r = 0.036 * h
  const S = (sg: number): V3 => [sg * 0.15 * h, 0, 0.755 * h]
  let hands: [V3, V3] = [[-0.11 * h, 0.17 * h, 0.5 * h], [0.11 * h, 0.17 * h, 0.5 * h]]
  let elbows: [V3, V3] = [[-0.19 * h, 0.04 * h, 0.56 * h], [0.19 * h, 0.04 * h, 0.56 * h]]
  if (o.armsUp) { hands = [[-0.26 * h, 0.1 * h, 1.02 * h], [0.26 * h, 0.1 * h, 1.02 * h]]; elbows = [[-0.25 * h, 0.06 * h, 0.85 * h], [0.25 * h, 0.06 * h, 0.85 * h]] }
  if (o.bless) { hands[1] = [0.15 * h, 0.2 * h, 0.82 * h]; elbows[1] = [0.22 * h, 0.1 * h, 0.62 * h] }
  if (o.child === 'arm') { hands[0] = [-0.04 * h, 0.16 * h, 0.6 * h]; elbows[0] = [-0.19 * h, 0.06 * h, 0.55 * h] }
  const at = (q: V3): V3 => L(q[0], q[1], q[2])
  for (const k of [0, 1]) tube(p, [at(S(k ? 1 : -1)), at(elbows[k]), at(hands[k])], r, 5)
  if (o.staff) {
    const hx = hands[1]
    tube(p, [L(hx[0], hx[1], 0.02 * h), L(hx[0], hx[1], 1.12 * h)], 0.022 * h, 4)
  }
  if (o.crucifix) {
    const hx = hands[0]
    const c0: V3 = [hx[0] + 0.02 * h, hx[1] + 0.03 * h, hx[2] - 0.1 * h], c1: V3 = [hx[0] + 0.12 * h, hx[1] + 0.03 * h, hx[2] + 0.3 * h]
    tube(p, [at(c0), at(c1)], 0.018 * h, 4)
    const m: V3 = [c0[0] * 0.3 + c1[0] * 0.7, c0[1], c0[2] * 0.3 + c1[2] * 0.7]
    tube(p, [at([m[0] - 0.07 * h, m[1], m[2] + 0.015 * h]), at([m[0] + 0.07 * h, m[1], m[2] - 0.015 * h])], 0.016 * h, 4)
  }
  if (o.book) {
    const hx = hands[1]
    box(p, (a, b, z) => L(hx[0] + a, hx[1] + b, hx[2] + z), -0.07 * h, 0.07 * h, -0.02 * h, 0.03 * h, -0.05 * h, 0.05 * h)
  }
  if (o.child === 'arm') figure(p, L, -0.06 * h, 0.13 * h, 0.52 * h, 0.3 * h, { slim: 0.9 }, true)
  if (o.child === 'shoulder') figure(p, L, -0.1 * h, -0.01 * h, 0.79 * h, 0.3 * h, {}, true)
}

/** A rough rock under a group: an irregular frustum. */
export function rock(p: Part, X: SFrame, hu: number, hv: number, h: number, detail: boolean) {
  const n = detail ? 7 : 4
  const jag = [1, 0.86, 0.97, 0.9, 1.0, 0.84, 0.95]
  const F: Xf = (a, b, z) => X(a, b, z)
  const r0 = ring(F, 0, 0, hu, hv, 0, n, 0.3).map((q, i) => q)
  const r1 = Array.from({ length: n }, (_, k) => {
    const a = 0.3 + (2 * Math.PI * k) / n, j = detail ? jag[k % 7] : 0.9
    return F(hu * 0.75 * j * Math.cos(a), hv * 0.7 * j * Math.sin(a), h * (detail ? 0.7 + 0.3 * jag[(k + 3) % 7] : 1))
  })
  loft(p, [r0, r1], true)
}

/** Save a model's low LOD and, optionally, its detail LOD; checks the budgets. */
export async function saveLods(id: string, name: string, low: Array<{ part: Part; material: MaterialSpec }>, detail: Array<{ part: Part; material: MaterialSpec }> | null, extras: Record<string, unknown>, maxLow = 6500) {
  for (const [file, list, maxT, maxB] of [[`${id}.glb`, low, maxLow, 250 * 1024], [`${id}.detail.glb`, detail, 40000, 1536 * 1024]] as const) {
    if (!list) continue
    const used = list.filter(({ part }) => part.triangles)
    const tris = used.reduce((n, { part }) => n + part.triangles, 0)
    console.log(file, used.map(({ part, material }) => `${material.name} ${part.triangles}`).join(', '))
    if (used.length > 6) throw new Error(`${file}: ${used.length} materials`)
    if (tris > maxT) throw new Error(`${file}: ${tris} triangles, over ${maxT}`)
    const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground', ...extras })
    if (glb.length > maxB) throw new Error(`${file}: ${glb.length} bytes, over ${maxB}`)
    const out = new URL(`../models/${file}`, import.meta.url).pathname
    await Bun.write(out, glb)
    console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
  }
}

/** Shift every part so the lowest vertex sits at z = 0; returns the shift. */
export function dropToZero(parts: Part[]): number {
  let low = Infinity
  for (const p of parts) for (let i = 1; i < p.pos.length; i += 3) low = Math.min(low, p.pos[i])
  for (const p of parts) for (let i = 1; i < p.pos.length; i += 3) p.pos[i] -= low
  return low
}

// ===========================================================================
// Charles Bridge.

// The map's terrain (Mapterhorn z14), metres above 185.5 m (the river), every
// 5 m in this frame: rows along y from y = −25, columns along x from x = −285.
const GROUND: GroundGrid = { y0: -25, x0: -285, step: 5, z: [
  [5.5, 5.3, 5.2, 5.0, 5.0, 4.8, 4.7, 4.3, 3.9, 3.5, 3.4, 3.2, 3.0, 3.1, 3.0, 3.0, 3.0, 2.9, 2.9, 2.9, 2.9, 2.1, 0.5, -0.2, -0.3, -0.2, -0.2, -0.1, 1.2, 2.2, 2.5, 2.6, 2.9, 3.0, 3.1, 3.2, 3.4, 3.5, 3.6, 3.6, 3.6, 3.6, 3.5, 3.0, 2.5, 2.2, 1.8, 0.7, -0.5, -0.5, -0.5, -0.3, -0.3, -0.2, -0.2, -0.1, -0.1, -0.2, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, 0.1, 0.2, 0.5, 0.6, 0.8, 1.6, 2.5, 2.5, 2.0, 1.4, 0.8, 0.2, -0.2, -0.5, 0.1, 1.1, 1.6, 1.6, 1.4, 1.2, 1.1, 1.6, 2.2],
  [5.5, 5.3, 5.0, 4.8, 4.8, 4.7, 4.3, 4.0, 3.8, 3.5, 3.1, 3.0, 2.8, 2.8, 3.0, 3.0, 3.0, 2.9, 2.9, 3.0, 3.0, 2.4, 0.9, 0.1, -0.1, -0.2, -0.2, 0.1, 1.2, 2.4, 2.9, 3.0, 3.0, 3.2, 3.2, 3.4, 3.5, 3.5, 3.8, 3.8, 3.8, 3.6, 3.4, 2.9, 2.5, 2.1, 1.6, 0.5, -0.5, -0.5, -0.2, -0.2, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, 0.1, 0.3, 0.6, 0.9, 1.9, 2.1, 1.6, 1.4, 0.8, 0.2, -0.1, -0.3, -0.5, -0.1, 0.8, 1.2, 1.2, 1.1, 0.8, 0.9, 1.6, 2.5],
  [5.7, 5.7, 5.5, 5.3, 5.0, 4.8, 4.5, 4.2, 3.9, 3.5, 3.4, 3.0, 2.9, 2.9, 3.0, 3.0, 2.9, 2.9, 2.9, 3.0, 3.0, 2.8, 1.9, 0.9, 0.2, -0.1, -0.1, 0.3, 1.4, 2.4, 3.0, 3.1, 3.4, 3.4, 3.4, 3.5, 3.5, 3.6, 3.8, 3.9, 3.9, 3.6, 3.2, 2.9, 2.5, 2.1, 1.6, 0.5, -0.2, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.6, 1.6, 2.5, 2.0, 1.2, 0.9, 0.5, -0.1, -0.3, -0.5, -0.5, -0.3, 0.5, 0.9, 0.9, 0.8, 0.8, 1.1, 2.0, 3.0],
  [6.0, 6.0, 6.2, 6.2, 6.0, 5.8, 5.5, 5.0, 4.2, 3.6, 3.4, 3.2, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.1, 3.0, 2.5, 1.9, 1.1, 0.7, 0.2, 0.5, 1.4, 2.5, 3.0, 3.2, 3.5, 3.5, 3.5, 3.5, 3.6, 3.8, 3.8, 3.9, 3.9, 3.6, 3.4, 3.0, 2.5, 2.2, 1.6, 0.5, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, 0.1, -0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.5, 1.9, 2.8, 2.5, 1.8, 1.1, 0.8, 0.2, -0.1, -0.3, -0.5, -0.5, 0.3, 1.1, 1.2, 1.2, 1.1, 1.8, 3.0, 4.0],
  [6.3, 6.5, 6.7, 6.7, 6.7, 6.5, 6.5, 6.0, 5.2, 4.2, 3.5, 3.4, 3.1, 2.9, 3.0, 2.9, 2.9, 3.0, 3.0, 3.0, 3.0, 3.0, 2.5, 2.0, 1.6, 0.9, 0.7, 0.8, 1.6, 2.8, 3.2, 3.4, 3.4, 3.5, 3.5, 3.6, 3.8, 3.9, 3.8, 3.8, 3.8, 3.5, 3.2, 3.0, 2.8, 2.5, 1.9, 0.7, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, 0.1, -0.1, 0.1, -0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.3, 1.6, 2.6, 2.5, 2.1, 1.6, 1.1, 0.7, 0.1, -0.2, -0.3, -0.1, 1.1, 2.9, 3.6, 3.5, 2.6, 2.8, 4.2, 5.3],
  [6.5, 6.7, 6.8, 6.8, 6.8, 6.8, 6.7, 6.5, 5.8, 4.8, 4.0, 3.5, 3.2, 3.0, 3.0, 3.0, 3.0, 2.9, 2.9, 3.0, 2.9, 2.9, 2.5, 1.9, 1.4, 0.9, 0.7, 1.1, 2.1, 3.1, 3.4, 3.2, 3.4, 3.5, 3.5, 3.6, 3.6, 3.8, 3.6, 3.6, 3.6, 3.5, 3.4, 3.2, 3.0, 2.8, 2.2, 0.9, 0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.3, 1.6, 2.5, 2.2, 1.9, 1.6, 1.1, 0.7, 0.2, -0.1, -0.1, 0.3, 2.1, 4.8, 6.2, 6.5, 5.5, 4.5, 6.0, 7.0],
  [6.5, 6.7, 6.8, 6.8, 6.8, 6.7, 6.7, 6.7, 6.3, 5.5, 4.8, 4.5, 4.3, 4.0, 3.6, 3.9, 4.0, 3.4, 3.0, 2.9, 2.9, 2.9, 2.5, 2.0, 1.6, 0.8, 0.7, 1.2, 2.2, 3.1, 3.2, 3.2, 3.2, 3.4, 3.4, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.4, 3.2, 3.1, 3.1, 3.0, 2.5, 1.1, 0.1, -0.1, 0.1, -0.1, -0.1, 0.1, -0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.6, 1.8, 1.8, 1.2, 1.6, 1.4, 0.9, 0.6, 0.1, -0.1, 0.1, 1.1, 3.8, 6.5, 7.8, 8.3, 8.2, 7.8, 7.8, 7.7],
  [6.5, 6.5, 6.5, 6.5, 6.5, 6.7, 6.7, 6.7, 6.7, 6.3, 6.2, 6.2, 6.3, 6.5, 6.5, 6.5, 6.3, 4.7, 3.0, 2.8, 2.9, 3.0, 2.8, 2.4, 1.6, 0.8, 0.7, 1.6, 2.5, 3.1, 3.2, 3.1, 3.2, 3.2, 3.2, 3.2, 3.2, 3.4, 3.2, 3.5, 3.4, 3.4, 3.2, 3.1, 3.1, 3.0, 2.8, 1.4, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.7, 1.8, 0.9, 0.2, 0.8, 1.1, 0.8, 0.3, -0.1, -0.1, 0.3, 2.8, 6.0, 7.8, 8.3, 8.6, 8.4, 8.2, 8.0, 7.5],
  [6.5, 6.3, 6.3, 6.2, 6.3, 6.3, 6.5, 6.5, 6.8, 6.8, 6.8, 7.2, 7.2, 7.3, 7.5, 7.7, 7.2, 5.2, 3.2, 2.6, 2.8, 3.0, 3.0, 2.8, 2.4, 1.1, 0.8, 1.4, 2.5, 3.1, 3.1, 3.0, 3.0, 3.2, 3.2, 3.1, 3.1, 3.1, 3.2, 3.4, 3.4, 3.4, 3.2, 3.2, 3.2, 3.1, 3.0, 1.9, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, -0.1, -0.1, -0.1, -0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.8, 1.6, 0.6, -0.1, 0.1, 0.8, 0.6, 0.1, -0.1, -0.1, 0.7, 4.5, 7.7, 8.2, 8.2, 8.3, 8.2, 8.2, 7.8, 7.3],
  [6.5, 6.3, 6.3, 6.2, 6.2, 6.2, 6.2, 6.3, 6.5, 6.8, 6.8, 6.8, 7.0, 6.5, 5.5, 5.5, 5.0, 3.6, 2.9, 2.6, 2.8, 2.8, 2.8, 2.9, 2.9, 1.6, 0.6, 0.8, 2.5, 3.1, 2.9, 2.0, 2.5, 3.1, 3.2, 3.0, 3.0, 3.1, 3.1, 3.2, 3.5, 3.5, 3.4, 3.2, 3.2, 3.2, 3.1, 1.9, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.9, 1.6, 0.3, -0.1, -0.1, 0.1, 0.2, 0.1, -0.2, -0.1, 0.3, 3.4, 7.2, 8.2, 8.2, 8.2, 8.2, 8.0, 7.3, 7.0],
  [6.7, 6.7, 6.5, 6.2, 6.2, 6.2, 6.2, 6.3, 6.5, 6.5, 6.5, 6.2, 5.8, 5.2, 4.5, 3.9, 3.6, 3.2, 3.0, 2.9, 2.8, 2.9, 2.9, 2.9, 3.0, 2.6, 1.4, 1.4, 2.8, 2.8, 1.6, 0.8, 2.2, 3.4, 3.4, 3.1, 3.0, 3.1, 3.4, 3.4, 3.5, 3.5, 3.4, 3.2, 3.2, 3.2, 3.0, 1.6, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 1.1, 1.2, 0.1, -0.1, -0.1, -0.2, -0.1, -0.2, -0.3, -0.2, -0.1, 2.0, 7.0, 8.2, 8.2, 8.1, 8.1, 8.0, 7.5, 6.8],
  [6.8, 7.0, 6.5, 6.3, 6.2, 6.0, 6.0, 6.0, 6.2, 6.2, 6.0, 5.7, 5.2, 5.0, 4.7, 4.2, 3.6, 3.4, 3.2, 3.1, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.8, 2.9, 3.0, 2.0, 0.6, -0.1, 1.1, 3.0, 3.1, 3.1, 3.2, 3.5, 3.5, 3.5, 3.5, 3.4, 3.4, 3.4, 3.2, 3.2, 3.0, 1.4, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, -0.1, 0.1, 1.2, 0.8, -0.1, -0.1, -0.1, -0.2, -0.3, -0.3, -0.3, -0.2, -0.1, 2.1, 6.2, 7.7, 7.8, 7.5, 7.0, 7.2, 7.2, 7.0],
  [6.8, 7.2, 7.0, 6.3, 6.2, 6.0, 5.8, 5.8, 5.7, 5.7, 5.7, 5.2, 5.2, 5.2, 4.8, 4.5, 4.0, 3.8, 3.5, 3.5, 3.4, 3.2, 3.2, 3.2, 3.2, 3.2, 3.2, 3.4, 3.0, 2.0, 0.8, 0.1, 0.3, 1.4, 2.0, 2.6, 3.1, 3.5, 3.5, 3.5, 3.5, 3.4, 3.4, 3.4, 3.2, 3.2, 3.0, 1.9, 0.5, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, -0.1, 0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, -0.1, -0.1, 0.2, 1.1, 0.5, -0.1, -0.1, -0.1, -0.2, -0.3, -0.5, -0.3, -0.2, -0.1, 0.9, 3.0, 5.0, 5.7, 5.3, 4.8, 5.3, 6.3, 6.8],
] }

const ground = (x: number, y: number) => groundAt(GROUND, x, y)

/** Linear interpolation through [x, y] points, held flat past the ends. */
export function piecewise(pts: [number, number][]) {
  return (x: number) => {
    if (x <= pts[0][0]) return pts[0][1]
    for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]
      return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0)
    }
    return pts[pts.length - 1][1]
  }
}
const smoothed = (f: (x: number) => number, w: number) => (x: number) => {
  let s = 0
  for (let k = -4; k <= 4; k++) s += f(x + (k * w) / 4)
  return s / 9
}

// The centre line (y at x), from the outline's straight edges, and the walking surface (z at x).
const C = smoothed(piecewise([
  [-226, 12.6], [-223, 12.3], [-196, 8.9], [-165, 6.1], [-133, 4.2], [-121, 3.5], [-102, 1.9], [-82, 0.27], [-71, 0.03], [-59, -0.22],
  [-40, -0.88], [-30, -1.05], [-20, -0.94], [-10, -0.56], [1, -0.13], [21, 0.62], [42, 1.42], [63, 2.17], [83, 2.93], [103, 3.72],
  [124, 4.52], [144, 5.28], [156, 5.79], [166, 5.6], [186, 5.12], [205, 4.55], [226, 3.85], [234, 3.48], [250, 2.95],
]), 8)
const deck = smoothed(piecewise([
  [-226, 7.0], [-222.5, 7.0], [-196, 8.4], [-165, 9.6], [-130, 10.5], [-100, 11.0], [-50, 11.7], [0, 12.0], [60, 12.0],
  [120, 11.6], [180, 10.6], [220, 9.4], [242, 8.4], [250, 8.2],
]), 10)
const tang = (s: number): [number, number] => {
  const d = (C(s + 1) - C(s - 1)) / 2, l = Math.hypot(1, d)
  return [1 / l, d / l]
}
/** Bridge coordinates (s along, t across to the north, z up) → model frame. */
const M = (s: number, t: number, z: number): V3 => {
  const [tx, ty] = tang(s)
  return [s - t * ty, C(s) + t * tx, z]
}
const Nrm = (s: number): V3 => { const [tx, ty] = tang(s); return [-ty, tx, 0] }
const Tan = (s: number): V3 => { const [tx, ty] = tang(s); return [tx, ty, 0] }
const gAt = (s: number, t: number) => { const q = M(s, t, 0); return ground(q[0], q[1]) }

const W = 4.9, PT = 0.8, PARA = 1.3
const PC = [-208.6, -180.3, -149.2, -118.3, -86.6, -54.9, -24.9, 5.85, 36.85, 67.85, 98.15, 129.2, 160.85, 190.45, 221.25]
const PH = 4.6
const WEST = -222.5, EAST_ABUT = 242.2, EAST = 246.6
type Arch = { A: number; B: number; xc: number; hs: number; zs: number; zc: number; R: number; crown: number; open: boolean }
const ENDS = [WEST, ...PC.flatMap((c) => [c - PH, c + PH]), EAST_ABUT]
const ARCHES: Arch[] = Array.from({ length: 16 }, (_, i) => {
  const A = ENDS[2 * i], B = ENDS[2 * i + 1], xc = (A + B) / 2, hs = (B - A) / 2
  const crown = deck(xc) - 2.9, rise = 0.3 * (B - A), R = (hs * hs + rise * rise) / (2 * rise)
  return { A, B, xc, hs, crown, zs: crown - rise, zc: crown - R, R, open: ![0, 1, 4].includes(i) }
})
const intr = (a: Arch, s: number) => a.zc + Math.sqrt(Math.max(0, a.R * a.R - (s - a.xc) ** 2))
// The Saská passage through the built-up second arch.
const SP = -196, SPH = 2.2, SPG = gAt(SP, 0), SPS = SPG + 2.4
const sasZ = pointedZ(SPH, SPS, SPS + SPH)
const RIVER = PC.map((c) => gAt(c, 0) < 2.6)

const STONE = finish('charles-sandstone', 0x6a5e52)
const TOWER = finish('charles-tower-stone', 0x48423c)
const SLATE = finish('charles-slate', 0x4a4f57)
const STATUE = finish('charles-statue', 0x403b36)
const LAMPM = finish('lamp', 0x3f4448)

type Statue =
  | { k: 'single'; h: number; o: FigOpt }
  | { k: 'group'; rock: [number, number, number]; figs: [number, number, number, number, FigOpt][] }
  | { k: 'calvary' | 'luthgard' | 'pieta' }

// The thirty statues by pier, west to east (OSM names; docs/the header).
const NORTH: Statue[] = [
  { k: 'group', rock: [1.4, 0.9, 0.5], figs: [[0, -0.2, 0.8, 2.9, { bless: true }], [-0.95, 0.2, 0.3, 2.6, { book: true, yaw: 0.3 }], [0.95, 0.2, 0.3, 2.6, { yaw: -0.3 }]] }, // Cosmas, Damian, Salvator
  { k: 'single', h: 3.0, o: { book: true } }, // Vitus
  { k: 'single', h: 3.0, o: { crucifix: true } }, // Philip Benizi
  { k: 'single', h: 3.1, o: { bless: true } }, // Cajetan
  { k: 'single', h: 3.0, o: { mitre: true, staff: true } }, // Augustine
  { k: 'single', h: 3.0, o: { staff: true, book: true } }, // Jude Thaddeus
  { k: 'single', h: 3.0, o: { child: 'arm' } }, // Anthony of Padua
  { k: 'single', h: 3.0, o: { halo: true, crucifix: true } }, // John of Nepomuk
  { k: 'group', rock: [1.5, 0.8, 0.4], figs: [[0, -0.1, 0.4, 3.0, { mitre: true, staff: true }], [-1.0, 0.15, 0.3, 2.7, { crown: true, staff: true, yaw: 0.25 }], [1.0, 0.15, 0.3, 2.7, { crown: true, staff: true, yaw: -0.25 }]] }, // Norbert, Wenceslas, Sigismund
  { k: 'single', h: 3.0, o: { staff: true, bless: true } }, // John the Baptist
  { k: 'group', rock: [1.5, 0.9, 0.6], figs: [[-0.6, -0.1, 0.5, 3.0, { mitre: true, staff: true }], [0.6, -0.1, 0.5, 3.0, { book: true }], [0, 0.55, 0, 1.9, { armsUp: true }]] }, // Cyril and Methodius
  { k: 'single', h: 2.9, o: { child: 'arm' } }, // Anne
  { k: 'calvary' }, // the Calvary
  { k: 'group', rock: [1.5, 0.9, 0.5], figs: [[0, -0.25, 0.9, 2.7, { child: 'arm', crown: true }], [-1.0, 0.25, 0.2, 2.3, { book: true, yaw: 0.4 }], [1.0, 0.25, 0.2, 2.3, { book: true, yaw: -0.4 }]] }, // Madonna, Dominic, Thomas
  { k: 'group', rock: [1.4, 0.9, 0.5], figs: [[0.45, -0.2, 0.8, 2.7, { child: 'arm' }], [-0.65, 0.25, 0.2, 2.3, { armsUp: true, yaw: 0.3 }]] }, // Madonna and Bernard
]
const SOUTH: Statue[] = [
  { k: 'single', h: 3.0, o: { crown: true, staff: true } }, // Wenceslas
  { k: 'group', rock: [1.6, 1.0, 0.9], figs: [[0, -0.3, 0.9, 2.7, { crucifix: true }], [-1.0, 0.1, 0.4, 2.6, { staff: true }], [1.0, 0.1, 0.4, 2.6, { book: true }], [0.35, 0.75, 0, 2.0, {}]] }, // Trinitarians
  { k: 'single', h: 3.0, o: { mitre: true, staff: true } }, // Adalbert
  { k: 'luthgard' }, // Luthgard
  { k: 'single', h: 3.0, o: { bless: true } }, // Nicholas of Tolentino
  { k: 'group', rock: [1.4, 0.9, 0.6], figs: [[-0.6, 0, 0.5, 2.9, { bless: true }], [0.6, 0, 0.5, 2.9, { mitre: true, staff: true }]] }, // Vincent Ferrer, Procopius
  { k: 'single', h: 3.0, o: { crucifix: true } }, // Francis Seraph
  { k: 'single', h: 2.9, o: { crown: true, child: 'arm' } }, // Ludmila
  { k: 'group', rock: [1.3, 0.8, 0.4], figs: [[-0.35, 0, 0.3, 3.0, { crucifix: true }], [0.8, 0.2, 0.3, 2.0, { armsUp: true }]] }, // Francis Borgia
  { k: 'single', h: 3.6, o: { child: 'shoulder', staff: true } }, // Christopher
  { k: 'group', rock: [1.5, 0.9, 0.4], figs: [[0, -0.1, 1.2, 2.6, { crucifix: true, armsUp: true }], [-0.75, 0.25, 0.2, 2.2, { armsUp: true }], [0.75, 0.25, 0.2, 2.2, { armsUp: true }]] }, // Francis Xavier
  { k: 'single', h: 3.0, o: { child: 'arm', staff: true } }, // Joseph
  { k: 'pieta' }, // the Pietà
  { k: 'group', rock: [1.5, 0.8, 0.3], figs: [[0, -0.1, 0.3, 2.9, { crown: true }], [-1.0, 0.15, 0.3, 2.7, { book: true, yaw: 0.25 }], [1.0, 0.15, 0.3, 2.7, { crown: true, yaw: -0.25 }]] }, // Barbara, Margaret, Elizabeth
  { k: 'single', h: 3.0, o: { book: true } }, // Ivo
]

/** A crucifix of height h with its corpus, in a statue frame. */
function crucifix(p: Part, X: SFrame, a0: number, b0: number, h: number, bar: number, detail: boolean) {
  const B: Xf = (a, b, z) => X(a0 + a, b0 + b, z)
  box(p, B, -0.13, 0.13, -0.13, 0.13, 0, h, 'b')
  box(p, B, -bar, bar, -0.12, 0.12, h * 0.76, h * 0.76 + 0.26)
  const zb = h * 0.42, zt = h * 0.76
  if (!detail) { box(p, B, -0.2, 0.2, 0.13, 0.35, zb, zt); return }
  loft(p, [ring(B, 0, 0.26, 0.12, 0.09, zb, 6), ring(B, 0, 0.27, 0.17, 0.1, zb + (zt - zb) * 0.6, 6), ring(B, 0, 0.26, 0.2, 0.1, zt - 0.1, 6)], true, true)
  for (const s of [-1, 1]) tube(p, [B(s * 0.18, 0.26, zt - 0.12), B(s * bar * 0.85, 0.24, zt + 0.12)], 0.06, 4)
  bead(p, B(0.05, 0.3, zt + 0.02), 0.13)
}

function statue(p: Part, X0: SFrame, st: Statue, detail: boolean) {
  // larger than life: the deck photos put the tallest figures some 5.7 m over the parapet
  const k = 1.12
  const X: SFrame = (a, b, z) => X0(a * k, b * k, z * k)
  if (st.k === 'single') return figure(p, X, 0, 0, 0, st.h, st.o, detail)
  if (st.k === 'group') {
    rock(p, X, st.rock[0], st.rock[1], st.rock[2], detail)
    for (const [a, b, z, h, o] of detail ? st.figs : st.figs.slice(0, 2)) figure(p, X, a, b, z, h, o, detail)
    return
  }
  if (st.k === 'calvary') {
    rock(p, X, 1.5, 0.9, 0.3, detail)
    crucifix(p, X, 0, -0.3, 5.4, 1.25, detail)
    figure(p, X, -1.2, 0.35, 0.2, 2.4, { yaw: 0.35 }, detail)
    figure(p, X, 1.2, 0.35, 0.2, 2.4, { yaw: -0.35, book: true }, detail)
    return
  }
  if (st.k === 'luthgard') {
    rock(p, X, 1.4, 0.9, 0.6, detail)
    crucifix(p, X, -0.4, -0.25, 4.4, 1.0, detail)
    figure(p, X, 0.55, 0.45, 0.4, 2.1, { armsUp: true, yaw: -0.4 }, detail)
    return
  }
  // the Pietà: Mary seated, Christ across her knees, John standing
  rock(p, X, 1.5, 0.9, 0.5, detail)
  const Y: Xf = (a, b, z) => X(a, b, z)
  if (detail) {
    box(p, Y, -0.1, 0.9, -0.5, 0.2, 0.5, 1.15)
    figure(p, X, 0.4, -0.2, 0.55, 2.4, { slim: 1.15, armsUp: false }, true)
    tube(p, [X(-0.9, 0.35, 1.25), X(-0.2, 0.4, 1.35), X(0.7, 0.4, 1.2)], 0.22, 6)
    bead(p, X(-1.05, 0.35, 1.3), 0.16)
    figure(p, X, -0.95, -0.35, 0.5, 2.6, { yaw: 0.3 }, true)
  } else {
    box(p, Y, -0.1, 0.9, -0.5, 0.2, 0.5, 1.15)
    figure(p, X, 0.4, -0.2, 0.55, 2.4, {}, false)
    box(p, Y, -0.9, 0.7, 0.2, 0.6, 1.1, 1.45)
    figure(p, X, -0.95, -0.35, 0.5, 2.6, {}, false)
  }
}

// ---- Gothic gate towers ------------------------------------------------------

type FaceName = 'u0' | 'u1' | 'v0' | 'v1'
export type TowerParts = { st: Part; roof: Part; win: Part; fig: Part }
export type TowerSpec = {
  F: Xf; G: number; hu: number; hv: number; body: number; co: number; gal: number
  roof: { hu: number; hv: number; ridge: number; w0: number; w1: number; alongU?: boolean }
  finials?: number
  turrets?: { r: number; w0: number; w1: number; spire: number }
  passage?: { hw: number; zs: number; za: number }
  niches?: { faces: FaceName[]; w0: number; w1: number; n: number }
  windows?: { face: FaceName; at: number; w0: number; w1: number; hw: number }[]
  strings?: number[]
  ground: (x: number, y: number) => number
}

/** A point on a tower face (face plane offset `d` outward), a across the face, w up (model z). */
export function onFace(F: Xf, hu: number, hv: number, f: FaceName, a: number, w: number, d = 0): V3 {
  if (f === 'u1') return F(hu + d, a, w)
  if (f === 'u0') return F(-hu - d, -a, w)
  if (f === 'v1') return F(-a, hv + d, w)
  return F(a, -hv - d, w)
}
export function faceNormal(F: Xf, f: FaceName): V3 {
  const o = F(0, 0, 0), q = f === 'u1' ? F(1, 0, 0) : f === 'u0' ? F(-1, 0, 0) : f === 'v1' ? F(0, 1, 0) : F(0, -1, 0)
  return sub(q, o)
}
/** A flat panel on a face: a rectangle, or with `pointed` a lancet. */
export function panel(p: Part, F: Xf, hu: number, hv: number, f: FaceName, a: number, hw: number, w0: number, w1: number, pointed: boolean, d = 0.05, segs = 4) {
  const n = faceNormal(F, f)
  if (!pointed) return face(p, [onFace(F, hu, hv, f, a - hw, w0, d), onFace(F, hu, hv, f, a + hw, w0, d), onFace(F, hu, hv, f, a + hw, w1, d), onFace(F, hu, hv, f, a - hw, w1, d)], n)
  const za = w1, zs = w1 - hw * 1.6
  const z = pointedZ(hw, zs, za)
  const pts: V3[] = [onFace(F, hu, hv, f, a - hw, w0, d), onFace(F, hu, hv, f, a + hw, w0, d)]
  for (let k = segs; k >= 0; k--) { const u = -hw + (2 * hw * k) / segs; pts.push(onFace(F, hu, hv, f, a + u, z(u), d)) }
  face(p, pts, n)
}

/** A square Gothic gate tower: body, corbelled gallery, corner turrets, hipped roof, optional passage. */
export function gateTower(P: TowerParts, T: TowerSpec, detail: boolean) {
  const { F, G, hu, hv, body, co, gal } = T
  const faces: FaceName[] = ['u0', 'u1', 'v0', 'v1']
  // Foundation from the terrain up to the threshold.
  const plan = [F(-hu, -hv, 0), F(hu, -hv, 0), F(hu, hv, 0), F(-hu, hv, 0)].map((q) => [q[0], q[1]] as [number, number])
  footedLoft(P.st, (x, y) => Math.min(T.ground(x, y), G), [{ plan, z: 'ground' }, { plan, z: G }], 3, false)
  // The body.
  for (const f of faces) {
    const half = f[0] === 'u' ? hv : hu
    const hu2 = f[0] === 'u' ? hu : hv
    const G2 = (a: number, w: number) => onFace(F, hu, hv, f, a, w)
    if (T.passage && f[0] === 'u') {
      const { hw, zs, za } = T.passage
      archWall(P.st, G2, -half, half, G, G + body, 0, hw, pointedZ(hw, G + zs, G + za), detail ? 10 : 6, faceNormal(F, f))
    } else face(P.st, [G2(-half, G), G2(half, G), G2(half, G + body), G2(-half, G + body)], faceNormal(F, f))
    void hu2
  }
  if (T.passage) {
    const { hw, zs, za } = T.passage
    passage(P.st, (a, d, w) => F(d, a, w), 0, hw, G, G + zs, pointedZ(hw, G + zs, G + za), -hu, hu, detail ? 10 : 6, P.st)
  }
  // String courses.
  if (detail) for (const z of T.strings ?? []) {
    for (const f of faces) {
      const half = f[0] === 'u' ? hv : hu
      const n = faceNormal(F, f)
      face(P.st, [onFace(F, hu, hv, f, -half - 0.15, G + z, 0.15), onFace(F, hu, hv, f, half + 0.15, G + z, 0.15), onFace(F, hu, hv, f, half + 0.15, G + z + 0.35, 0.15), onFace(F, hu, hv, f, -half - 0.15, G + z + 0.35, 0.15)], n)
      face(P.st, [onFace(F, hu, hv, f, -half - 0.15, G + z + 0.35, 0), onFace(F, hu, hv, f, half + 0.15, G + z + 0.35, 0), onFace(F, hu, hv, f, half + 0.15, G + z + 0.35, 0.15), onFace(F, hu, hv, f, -half - 0.15, G + z + 0.35, 0.15)], [0, 0, 1])
    }
  }
  // Corbel table and gallery.
  const ou = hu + co, ov = hv + co, iu = ou - 0.5, iv = ov - 0.5
  const R = (u: number, v: number, w: number) => [F(-u, -v, w), F(u, -v, w), F(u, v, w), F(-u, v, w)]
  const rb = R(hu, hv, G + body), ro = R(ou, ov, G + body), rt = R(ou, ov, G + gal), ri = R(iu, iv, G + gal), rf = R(iu, iv, G + gal - 1.3)
  const mid = F(0, 0, G + body + 1)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    face(P.st, [rb[i], rb[j], ro[j], ro[i]], [0, 0, -1])
    faceOut(P.st, [ro[i], ro[j], rt[j], rt[i]], mid)
    face(P.st, [rt[i], rt[j], ri[j], ri[i]], [0, 0, 1])
    face(P.st, [ri[i], ri[j], rf[j], rf[i]], sub(mid, centroid([ri[i], ri[j]])))
  }
  face(P.st, rf, [0, 0, 1])
  // The gallery's openings.
  for (const f of faces) {
    const half = (f[0] === 'u' ? ov : ou) - 1.0
    const n = detail ? 4 : 1, wdt = (2 * half) / n
    for (let k = 0; k < n; k++) {
      const a = -half + wdt * (k + 0.5)
      panel(P.win, F, ou, ov, f, a, wdt * (detail ? 0.32 : 0.42), G + body + 0.9, G + gal - 0.6, false, 0.04)
    }
  }
  // Corner turrets.
  if (T.turrets) {
    const { r, w0, w1, spire: top } = T.turrets
    for (const [su, sv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const cu = su * (ou - r * 0.4), cv = sv * (ov - r * 0.4)
      const n = detail ? 8 : 4
      const rr = (w: number) => ring(F, cu, cv, r, r, w, n, Math.PI / n)
      loft(P.st, [rr(G + w0), rr(G + w1)], false, true)
      spire(P.roof, F, cu, cv, r * 1.05, G + w1, G + top, n)
      if (detail) { tube(P.fig, [F(cu, cv, G + top - 0.3), F(cu, cv, G + top + 1.2)], 0.06, 4); bead(P.fig, F(cu, cv, G + top + 0.9), 0.2) }
    }
  }
  // The roof and its ridge finials.
  const rf2 = T.roof
  hipRoof(P.roof, F, 0, 0, rf2.hu, rf2.hv, rf2.ridge, G + rf2.w0, G + rf2.w1, rf2.alongU)
  if (detail && T.finials) for (const s of [-1, 1]) {
    const [cu, cv] = rf2.alongU ? [s * rf2.ridge / 2, 0] : [0, s * rf2.ridge / 2]
    tube(P.fig, [F(cu, cv, G + rf2.w1 - 0.2), F(cu, cv, G + T.finials)], 0.07, 4)
    bead(P.fig, F(cu, cv, G + T.finials - 0.6), 0.28)
  }
  // Niches (blind tracery) and windows.
  if (T.niches) {
    const { w0, w1, n } = T.niches
    for (const f of T.niches.faces) {
      const half = (f[0] === 'u' ? hv : hu) - 0.9, wdt = (2 * half) / n
      for (let k = 0; k < n; k++) panel(P.fig, F, hu, hv, f, -half + wdt * (k + 0.5), wdt * 0.36, G + w0, G + w1, true, 0.05, detail ? 6 : 2)
      if (detail) for (let k = 0; k <= n; k++) {
        // pinnacles between the niches
        const a = -half + wdt * k
        const base = onFace(F, hu, hv, f, a, G + w1 - 1.0, 0.1)
        const c = onFace(F, hu, hv, f, a, G + w1 - 1.0, 0.0)
        void c
        const pr = (w: number, r: number) => [-1, 1].flatMap((s) => [onFace(F, hu, hv, f, a + s * r, w, 0.02), onFace(F, hu, hv, f, a + s * r, w, 0.02 + 2 * r)])
        const q0 = pr(G + w0 + 0.4, 0.15), q1 = pr(G + w1 + 0.3, 0.15)
        const order = [0, 2, 3, 1]
        loft(P.st, [order.map((i) => q0[i]), order.map((i) => q1[i])])
        spire(P.st, (u, v, w) => [base[0] + u * 0 + (onFace(F, hu, hv, f, a + u, w, 0.17 + v)[0] - onFace(F, hu, hv, f, a, w, 0.17)[0]) + (onFace(F, hu, hv, f, a, w, 0.17)[0] - base[0]),
          onFace(F, hu, hv, f, a + u, w, 0.17 + v)[1], w], 0, 0, 0.2, G + w1 + 0.3, G + w1 + 1.6, 4)
      }
    }
  }
  for (const wdw of T.windows ?? []) panel(P.win, F, hu, hv, wdw.face, wdw.at, wdw.hw, G + wdw.w0, G + wdw.w1, true, 0.05, detail ? 6 : 2)
}

// ---- The bridge ----------------------------------------------------------------

function build(detail: boolean) {
  const st = new Part(), tw = new Part(), roof = new Part(), win = new Part(), fig = new Part(), lamp = new Part()
  const D = detail
  const nA = D ? 14 : 6

  // Stations along the bridge.
  const SS = new Set<number>()
  const addS = (v: number) => SS.add(Math.round(v * 1000) / 1000)
  ARCHES.forEach((a, i) => {
    if (a.open) for (let k = 0; k <= nA; k++) addS(a.A + ((a.B - a.A) * k) / nA)
    else {
      const n = Math.ceil((a.B - a.A) / 4.5)
      for (let k = 0; k <= n; k++) addS(a.A + ((a.B - a.A) * k) / n)
      if (D) for (let k = 0; k <= nA; k++) addS(a.A + ((a.B - a.A) * k) / nA)
    }
    if (i < 15) { const b = a.B, e = ARCHES[i + 1].A, n = D || !RIVER[i] ? 2 : 1; for (let k = 0; k <= n; k++) addS(b + ((e - b) * k) / n) }
  })
  for (let k = 0; k <= 2; k++) addS(EAST_ABUT + ((EAST - EAST_ABUT) * k) / 2)
  for (let k = 0; k <= 8; k++) addS(SP - SPH + (2 * SPH * k) / 8)
  const S = [...SS].sort((a, b) => a - b)
  const archAt = (s: number) => ARCHES.find((a) => s > a.A + 1e-6 && s < a.B - 1e-6)
  const inSaska = (s: number) => Math.abs(s - SP) < SPH - 1e-6

  /** The underside of a face wall at (s, t), for the region the segment's midpoint is in. */
  const bottom = (s: number, t: number, sm: number) => {
    const a = archAt(sm)
    const g = gAt(s, t)
    if (a && a.open) return Math.max(g, intr(a, s))
    if (inSaska(sm)) return sasZ(s - SP)
    return g
  }

  // ---- Face walls (spandrels, piers, abutments) to the parapet's top.
  for (const sg of [-1, 1]) {
    const t = sg * W
    for (let i = 0; i + 1 < S.length; i++) {
      const sa = S[i], sb = S[i + 1], sm = (sa + sb) / 2
      const za = bottom(sa, t, sm), zb = bottom(sb, t, sm)
      face(st, [M(sa, t, za), M(sb, t, zb), M(sb, t, deck(sb) + PARA), M(sa, t, deck(sa) + PARA)], scl3(Nrm(sm), sg))
    }
  }
  // ---- Arch soffits and the pier faces under the springings.
  for (const a of ARCHES) {
    if (!a.open) continue
    const ss = S.filter((s) => s >= a.A - 1e-6 && s <= a.B + 1e-6)
    for (let i = 0; i + 1 < ss.length; i++) {
      const s0 = ss[i], s1 = ss[i + 1]
      const z0 = intr(a, s0), z1 = intr(a, s1)
      if (z0 < gAt(s0, 0) && z1 < gAt(s1, 0)) continue
      const q = [M(s0, -W, z0), M(s1, -W, z1), M(s1, W, z1), M(s0, W, z0)]
      face(st, q, sub(M(a.xc, 0, a.zc), centroid(q)))
    }
    for (const [s, dir] of [[a.A, 1], [a.B, -1]] as [number, number][]) {
      const ts = D ? [-W, -W / 2, 0, W / 2, W] : [-W, 0, W]
      for (let k = 0; k + 1 < ts.length; k++) {
        const g0 = gAt(s, ts[k]), g1 = gAt(s, ts[k + 1])
        if (g0 >= a.zs && g1 >= a.zs) continue
        face(st, [M(s, ts[k], Math.min(g0, a.zs)), M(s, ts[k + 1], Math.min(g1, a.zs)), M(s, ts[k + 1], a.zs), M(s, ts[k], a.zs)], scl3(Tan(s), dir))
      }
    }
  }
  // ---- The Saská passage.
  {
    const ts = [-W, -W / 2, 0, W / 2, W]
    for (const [s, dir] of [[SP - SPH, 1], [SP + SPH, -1]] as [number, number][])
      for (let k = 0; k < 4; k++)
        face(st, [M(s, ts[k], gAt(s, ts[k])), M(s, ts[k + 1], gAt(s, ts[k + 1])), M(s, ts[k + 1], SPS), M(s, ts[k], SPS)], scl3(Tan(s), dir))
    for (let k = 0; k < 8; k++) {
      const u0 = -SPH + (2 * SPH * k) / 8, u1 = -SPH + (2 * SPH * (k + 1)) / 8
      const q = [M(SP + u0, -W, sasZ(u0)), M(SP + u1, -W, sasZ(u1)), M(SP + u1, W, sasZ(u1)), M(SP + u0, W, sasZ(u0))]
      face(st, q, sub(M(SP, 0, SPS), centroid(q)))
    }
  }
  // ---- Arch rings, a little proud of the face: every arch in the detail model, the blind ones in the low.
  for (const a of ARCHES) {
    if (!D && a.open) continue
    const n = nA, dep = 1.2, pr = D ? 0.14 : 0.2
    const pts = Array.from({ length: n + 1 }, (_, k) => {
      const s = a.A + ((a.B - a.A) * k) / n, z = intr(a, s)
      const r: [number, number] = [(s - a.xc) / a.R, (z - a.zc) / a.R]
      return { s, z, so: s + r[0] * dep, zo: z + r[1] * dep }
    })
    for (const sg of [-1, 1]) {
      const t1 = sg * (W + pr)
      for (let k = 0; k < n; k++) {
        const p0 = pts[k], p1 = pts[k + 1]
        const nn = scl3(Nrm(p0.s), sg)
        face(st, [M(p0.s, t1, p0.z), M(p1.s, t1, p1.z), M(p1.so, t1, p1.zo), M(p0.so, t1, p0.zo)], nn)
        face(st, [M(p0.so, sg * W, p0.zo), M(p1.so, sg * W, p1.zo), M(p1.so, t1, p1.zo), M(p0.so, t1, p0.zo)], [0, 0, 1])
        if (D) face(st, [M(p0.s, sg * W, p0.z), M(p1.s, sg * W, p1.z), M(p1.s, t1, p1.z), M(p0.s, t1, p0.z)], [0, 0, -1])
      }
    }
  }

  // ---- Deck, parapets, the string course.
  const DS: number[] = []
  for (let s = WEST; s < EAST - 1e-6; s += D ? 4 : 12) DS.push(s)
  DS.push(EAST)
  for (let i = 0; i + 1 < DS.length; i++) {
    const sa = DS[i], sb = DS[i + 1], sm = (sa + sb) / 2
    const ti = W - PT
    face(st, [M(sa, -ti, deck(sa)), M(sb, -ti, deck(sb)), M(sb, ti, deck(sb)), M(sa, ti, deck(sa))], [0, 0, 1])
    for (const sg of [-1, 1]) {
      face(st, [M(sa, sg * ti, deck(sa)), M(sb, sg * ti, deck(sb)), M(sb, sg * ti, deck(sb) + PARA), M(sa, sg * ti, deck(sa) + PARA)], scl3(Nrm(sm), -sg))
      face(st, [M(sa, sg * ti, deck(sa) + PARA), M(sb, sg * ti, deck(sb) + PARA), M(sb, sg * W, deck(sb) + PARA), M(sa, sg * W, deck(sa) + PARA)], [0, 0, 1])
      {
        const to = sg * (W + 0.25), z0 = (s: number) => deck(s) - 0.75, z1 = (s: number) => deck(s) - 0.15
        face(st, [M(sa, to, z0(sa)), M(sb, to, z0(sb)), M(sb, to, z1(sb)), M(sa, to, z1(sa))], scl3(Nrm(sm), sg))
        if (D) face(st, [M(sa, sg * W, z1(sa)), M(sb, sg * W, z1(sb)), M(sb, to, z1(sb)), M(sa, to, z1(sa))], [0, 0, 1])
        if (D) face(st, [M(sa, sg * W, z0(sa)), M(sb, sg * W, z0(sb)), M(sb, to, z0(sb)), M(sa, to, z0(sa))], [0, 0, -1])
      }
    }
  }
  // The west end, where the deck lands on Mostecká.
  {
    const ts = [-W, -W / 2, 0, W / 2, W]
    for (let k = 0; k < 4; k++) {
      const z = deck(WEST) + PARA
      face(st, [M(WEST, ts[k], Math.min(z - 0.2, gAt(WEST, ts[k]))), M(WEST, ts[k + 1], Math.min(z - 0.2, gAt(WEST, ts[k + 1]))), M(WEST, ts[k + 1], z), M(WEST, ts[k], z)], scl3(Tan(WEST), -1))
    }
  }

  // ---- Piers: cutwaters, pilasters, bays, pedestals and statues.
  PC.forEach((c, i) => {
    const o = M(c, 0, 0), T = Tan(c), N = Nrm(c)
    const Fp: Xf = (u, t, z) => [o[0] + u * T[0] + t * N[0], o[1] + u * T[1] + t * N[1], z]
    const dk = deck(c)
    const zsAvg = (ARCHES[i].zs + ARCHES[i + 1].zs) / 2
    const capB = zsAvg + 3.4, capT = capB + 3.6
    const river = RIVER[i]
    for (const sg of [-1, 1]) {
      if (river) {
        const L = sg < 0 ? 9.0 : 6.0
        const A = (z: number) => Fp(-PH - 0.4, sg * W, z), B = (z: number) => Fp(PH + 0.4, sg * W, z), Tp = (z: number) => Fp(0, sg * (W + L), z)
        const g = (q: V3) => ground(q[0], q[1])
        const cen = Fp(0, sg * W, capB - 3)
        const segs = D ? 2 : 1
        for (const [P0, P1] of [[A, Tp], [Tp, B]]) {
          for (let k = 0; k < segs; k++) {
            const lerpP = (t: number) => (z: number): V3 => { const a = P0(z), b = P1(z); return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, z] }
            const qa = lerpP(k / segs), qb = lerpP((k + 1) / segs)
            faceOut(st, [qa(g(qa(0))), qb(g(qb(0))), qb(capB), qa(capB)], [cen[0], cen[1], (capB + g(cen)) / 2])
          }
        }
        const Q = Fp(0, sg * W, capT)
        faceOut(st, [A(capB), Tp(capB), Q], cen)
        faceOut(st, [Tp(capB), B(capB), Q], cen)
        if (D) {
          // the footing: a step around the cutwater at the water
          const f = 0.45, fz = 0.9
          const pa = (z: number) => Fp(-PH - f, sg * W, z), pb = (z: number) => Fp(PH + f, sg * W, z), pt = (z: number) => Fp(0, sg * (W + L + f * 1.8), z)
          for (const [P0, P1] of [[pa, pt], [pt, pb]]) faceOut(st, [P0(g(P0(0))), P1(g(P1(0))), P1(fz), P0(fz)], [cen[0], cen[1], 0])
          for (const [P0, P1, Q0, Q1] of [[pa, pt, A, Tp], [pt, pb, Tp, B]]) face(st, [P0(fz), P1(fz), Q1(fz), Q0(fz)], [0, 0, 1])
        }
        if (sg < 0 && D) {
          // the wooden ice guard upstream of the cutwater
          const t0 = -(W + L + 0.3), t1 = -(W + L + 7.5)
          const a0 = Fp(-1.5, t0, 0), a1 = Fp(1.5, t0, 0), ap = Fp(0, t1, 0)
          const h0 = 2.3, h1 = 0.5
          const top0 = Fp(-1.5, t0, h0), top1 = Fp(1.5, t0, h0), topp = Fp(0, t1, h1)
          const cc = Fp(0, (t0 + t1) / 2, 0.5)
          faceOut(fig, [a0, ap, topp, top0], cc)
          faceOut(fig, [ap, a1, top1, topp], cc)
          faceOut(fig, [top0, topp, top1], cc)
          faceOut(fig, [a0, top0, top1, a1], cc)
        }
      }
      // The pilaster over the pier, carrying the statue bay.
      const zb = river ? capT - 1.2 : Math.min(gAt(c - 2.1, sg * W), gAt(c + 2.1, sg * W))
      const tIn = sg * W, tOut = sg * (W + 0.9)
      box(st, Fp, -2.1, 2.1, Math.min(tIn, tOut), Math.max(tIn, tOut), zb, dk + PARA + 0.08, `b ${sg > 0 ? 'v0' : 'v1'}`)
      box(st, Fp, -2.1, 2.1, Math.min(sg * (W - PT), tIn), Math.max(sg * (W - PT), tIn), dk + PARA - 0.01, dk + PARA + 0.08, `b ${sg > 0 ? 'v0' : 'v1'} u0 u1`)
      // The pedestal.
      const stt = (sg > 0 ? NORTH : SOUTH)[i]
      const wide = stt.k !== 'single'
      const hw = wide ? 1.75 : 1.05, ph = wide ? 2.2 : 2.6
      const tc = sg * (W - 0.4), td = 0.95
      if (D) {
        box(fig, Fp, -hw, hw, tc - td, tc + td, dk, dk + 0.7, 'b')
        box(fig, Fp, -hw + 0.15, hw - 0.15, tc - td + 0.15, tc + td - 0.15, dk + 0.7, dk + ph - 0.4, 'b')
        box(fig, Fp, -hw - 0.05, hw + 0.05, tc - td - 0.05, tc + td + 0.05, dk + ph - 0.4, dk + ph, 'b')
      } else box(fig, Fp, -hw, hw, tc - td, tc + td, dk, dk + ph, 'b')
      // The statue, facing the walkway.
      const O = Fp(0, tc, dk + ph)
      const bU: V3 = scl3(N, -sg), aU: V3 = [bU[1], -bU[0], 0]
      const X: SFrame = (a, b, z) => [O[0] + a * aU[0] + b * bU[0], O[1] + a * aU[1] + b * bU[1], O[2] + z]
      statue(fig, X, stt, D)
    }
    // Bruncvík on his column, on the Kampa pier's upstream cutwater (detail only).
    if (D && i === 5) {
      const base = Fp(0, -(W + 4.2), 0)
      const top = dk + 0.3
      loft(st, [ring((u, v, w) => [base[0] + u, base[1] + v, w], 0, 0, 0.55, 0.55, capB, 8), ring((u, v, w) => [base[0] + u, base[1] + v, w], 0, 0, 0.5, 0.5, top, 8)], true)
      const X: SFrame = (a, b, z) => [base[0] + a * T[0] + b * N[0], base[1] + a * T[1] + b * N[1], top + z]
      figure(fig, X, 0, 0, 0, 2.4, { staff: true, crown: true }, true)
    }
  })

  // ---- Gas lamps on the parapets, one per arch each side.
  for (const a of ARCHES) for (const sg of [-1, 1]) {
    const s = a.xc, z = deck(s) + PARA
    const p0 = M(s, sg * (W - PT / 2), z)
    if (D) {
      tube(fig, [p0, [p0[0], p0[1], z + 2.9]], 0.08, 6)
      bead(lamp, [p0[0], p0[1], z + 3.2], 0.3)
    } else {
      tube(fig, [p0, [p0[0], p0[1], z + 2.9]], 0.1, 3)
      bead(lamp, [p0[0], p0[1], z + 3.2], 0.32, true)
    }
  }

  // ---- The stair to Kampa (the block on the south face at x −106…−100).
  {
    const plan: [number, number][] = [[-106.1, -8.6], [-100.0, -9.1], [-100.0, C(-100) - W + 0.1], [-106.1, C(-106.1) - W + 0.1]]
    footedLoft(st, ground, [{ plan, z: 'ground' }, { plan, z: deck(-103) - 0.6 }], 3, true)
  }

  // ---- The towers.
  const TP: TowerParts = { st: tw, roof, win, fig }
  // Old Town Bridge Tower (OSM way/839278890): 11.4 × 11.7 m, turned −2.4°, gate floor at the deck's end.
  const GO = deck(250)
  const FO = frame(252.05, 2.95, 0, -2.4)
  gateTower(TP, {
    F: FO, G: GO, hu: 5.7, hv: 5.85, body: 26, co: 0.4, gal: 30.2,
    roof: { hu: 2.9, hv: 2.9, ridge: 2.6, w0: 29.4, w1: 43.2 },
    finials: 47.2, turrets: { r: 0.8, w0: 24, w1: 31.2, spire: 39.5 },
    passage: { hw: 3.2, zs: 4.0, za: 9.0 }, strings: [10.6, 16.6],
    niches: { faces: ['u1'], w0: 17.2, w1: 24.6, n: 3 },
    windows: [
      { face: 'u0', at: -2.2, w0: 18.5, w1: 23.8, hw: 0.8 }, { face: 'u0', at: 2.2, w0: 18.5, w1: 23.8, hw: 0.8 },
      { face: 'v1', at: 0, w0: 18.5, w1: 23.5, hw: 0.8 }, { face: 'v0', at: 1.6, w0: 18.5, w1: 23.5, hw: 0.8 },
      { face: 'v1', at: 0, w0: 11.5, w1: 14.5, hw: 0.6 },
    ],
    ground,
  }, D)
  // its south stair turret (OSM 482310110: to 31, an 11 m pyramid to 42)
  {
    const pl = [FO(-1.9, -5.85 - 2.3, 0), FO(1.0, -5.85 - 2.3, 0), FO(1.0, -5.8, 0), FO(-1.9, -5.8, 0)].map((q) => [q[0], q[1]] as [number, number])
    footedLoft(tw, ground, [{ plan: pl, z: 'ground' }, { plan: pl, z: GO + 31 }], 3, false)
    spire(roof, FO, -0.45, -5.85 - 1.15, 1.75, GO + 31, GO + 41, 4, Math.PI / 4)
    if (D) for (let k = 0; k < 3; k++) panel(win, (u, v, w) => FO(-0.45 + u, -7.0 + v, w), 1.45, 1.15, 'v0', 0, 0.25, GO + 8 + 7 * k, GO + 10 + 7 * k, false, 0.04)
  }
  // The east face's sculpture: Charles IV and Wenceslas IV seated beside St Vitus, St Adalbert and St Sigismund above (detail).
  if (D) {
    const E = (a: number, b: number, z: number) => FO(5.7 + 0.1 + b, a, GO + z)
    const X: SFrame = (a, b, z) => E(a, b, z)
    for (const [a, z, h, o] of [[-3.0, 11.2, 2.3, { crown: true }], [0, 11.2, 2.6, { book: true }], [3.0, 11.2, 2.3, { crown: true }], [-1.6, 18.2, 2.5, { mitre: true }], [1.6, 18.2, 2.5, { crown: true }]] as [number, number, number, FigOpt][]) {
      box(fig, (u, v, w) => E(u, v, w), a - 0.7, a + 0.7, 0, 0.55, z - 0.35, z, 'b')
      figure(fig, X, a, 0.3, z, h, o, true)
    }
  }

  // Lesser Town Bridge Tower (OSM way/839278891): 10.2 m square, turned 9.3°, on the terrain at the gate.
  // The Lesser Town towers are the paler sandstone of the bridge itself.
  const LP: TowerParts = { st, roof, win, fig }
  const FL = frame(-246.0, 23.1, 0, 9.3)
  const GL = ground(-244.6, 14.6)
  gateTower(LP, {
    F: FL, G: GL, hu: 5.1, hv: 5.1, body: 26, co: 0.4, gal: 29.2,
    roof: { hu: 2.9, hv: 2.9, ridge: 2.5, w0: 28.6, w1: 41 },
    finials: 43.5, turrets: { r: 0.7, w0: 25, w1: 29.8, spire: 36 },
    strings: [7.2, 14.8],
    niches: { faces: ['u1', 'u0'], w0: 16, w1: 23.4, n: 3 },
    windows: [
      { face: 'u1', at: 0, w0: 8.6, w1: 12.2, hw: 0.7 }, { face: 'u0', at: 0, w0: 8.6, w1: 12.2, hw: 0.7 },
      { face: 'v0', at: 0, w0: 17, w1: 21.5, hw: 0.7 }, { face: 'v1', at: 0, w0: 17, w1: 21.5, hw: 0.7 },
    ],
    ground,
  }, D)

  // The Judith Tower (OSM way/389652950): 8.9 × 10.1 m, turned 12.3°, walls to 15.5, hipped roof to 29.
  const FJ = frame(-242.15, 5.05, 0, 12.3)
  {
    const hu = 4.45, hv = 5.05
    const pl = [FJ(-hu, -hv, 0), FJ(hu, -hv, 0), FJ(hu, hv, 0), FJ(-hu, hv, 0)].map((q) => [q[0], q[1]] as [number, number])
    footedLoft(st, ground, [{ plan: pl, z: 'ground' }, { plan: pl, z: GL + 15.5 }], 3, true)
    hipRoof(roof, FJ, 0, 0, hu + 0.3, hv + 0.3, 4.3, GL + 15.2, GL + 29)
    // the Renaissance dormer gable on the east slope
    const du0 = 1.2, du1 = 2.6, zr = (u: number) => GL + 15.2 + (13.8 * (hu + 0.3 - u)) / (hu + 0.3)
    box(st, FJ, du0, du1, -1.3, 1.3, zr(du1) - 0.3, zr(du1) + 2.6, 'b u0')
    gableRoof(roof, st, (u, v, w) => FJ(u, v, w), (du0 + du1) / 2 + 0.2, 0, (du1 - du0) / 2 + 0.2, 1.3, zr(du1) + 2.6, zr(du1) + 4.0, 0)
    panel(win, FJ, du1, 1.3, 'u1', 0, 0.45, zr(du1) + 0.5, zr(du1) + 1.9, false, 0.04)
    for (const [f, a, w0] of [['u1', -2.4, 9], ['u1', 2.4, 9], ['v0', 0, 10], ['u0', 0, 10]] as [FaceName, number, number][])
      panel(win, FJ, hu, hv, f, a, 0.55, GL + w0, GL + w0 + 2.2, false, 0.04)
    if (D) for (const s of [-1, 1]) { tube(fig, [FJ(0, s * 2.15, GL + 28.8), FJ(0, s * 2.15, GL + 31.2)], 0.06, 4); bead(fig, FJ(0, s * 2.15, GL + 30.6), 0.18) }
  }
  // The gate between them (OSM way/460016966): a battlemented block over a pointed passage.
  {
    const FG = frame(-244.6, 14.55, 0, 10.0)
    const hu = 5.0, hv = 2.4, top = GL + 10.6
    const pl = [FG(-hu, -hv, 0), FG(hu, -hv, 0), FG(hu, hv, 0), FG(-hu, hv, 0)].map((q) => [q[0], q[1]] as [number, number])
    footedLoft(st, (x, y) => Math.min(ground(x, y), GL), [{ plan: pl, z: 'ground' }, { plan: pl, z: GL }], 3, false)
    const arch = pointedZ(2.0, GL + 4.6, GL + 7.4)
    for (const su of [-1, 1]) archWall(st, (a, w) => FG(su * hu, a, w), -hv, hv, GL, top, 0, 2.0, arch, D ? 10 : 6, sub(FG(su, 0, 0), FG(0, 0, 0)))
    passage(st, (a, d, w) => FG(d, a, w), 0, 2.0, GL, GL + 4.6, arch, -hu, hu, D ? 10 : 6)
    face(st, [FG(-hu, -hv, top), FG(hu, -hv, top), FG(hu, hv, top), FG(-hu, hv, top)], [0, 0, 1])
    // battlements on both faces
    for (const su of [-1, 1]) {
      if (D) for (let k = 0; k < 4; k++) {
        const v0 = -hv + 0.2 + k * 1.2
        box(st, FG, su > 0 ? hu - 0.5 : -hu, su > 0 ? hu : -hu + 0.5, v0, v0 + 0.8, top, top + 1.4, 'b')
      }
      else box(st, FG, su > 0 ? hu - 0.5 : -hu, su > 0 ? hu : -hu + 0.5, -hv, hv, top, top + 1.0, 'b')
    }
  }

  const parts = [st, tw, roof, win, fig, lamp]
  const low = dropToZero(parts)
  console.log(`${D ? 'detail' : 'low'}: lowest point ${low.toFixed(2)} m above the river datum; deck ${deck(WEST).toFixed(2)} / ${deck(30).toFixed(2)} / ${deck(EAST).toFixed(2)}`)
  const sidewise = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : n[2] < -0.5 ? 0.45 : 0.6)
  const towerLit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 0.75)
  return [
    { part: st, material: { ...STONE, floodlight: sidewise } },
    { part: tw, material: { ...TOWER, floodlight: towerLit } },
    { part: roof, material: SLATE },
    { part: win, material: PALETTE.window },
    { part: fig, material: STATUE },
    { part: lamp, material: LAMPM },
  ]
}

if (import.meta.main) {
  console.log(ARCHES.map((a, i) => `${i}: ${a.A.toFixed(1)}…${a.B.toFixed(1)} span ${(a.B - a.A).toFixed(1)} spring ${a.zs.toFixed(1)} crown ${a.crown.toFixed(1)}${a.open ? '' : ' (built up)'}`).join('\n'))
  console.log('river piers', PC.filter((_, i) => RIVER[i]).join(' '))
  await saveLods('prague-charles-bridge', 'Charles Bridge', build(false), build(true), { bearing: 12.3 })
}
