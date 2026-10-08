/**
 * "it's a small world" facade, Disneyland Park, Anaheim — procedural, CC0-1.0.
 * bun generators/dlr-small-world.ts
 *
 * Rolly Crump's facade after Mary Blair: a long white stage flat whose top
 * edge is a skyline of flattened world landmarks — onion domes, a leaning
 * Pisa with a gold crown, an Eiffel lattice, a windmill, Gothic gables,
 * castellated towers — trimmed in gold, standing behind the boat flume, with the clock tower ("the clock of all nations", smiling face,
 * doll-parade doors) on its own arched platform in front, over the boats.
 * The current Anaheim scheme is white and gold, with silver-glitter panels.
 *
 * Frame: built in a facade frame — u along the facade (bearing 103°, ESE),
 * v toward its back (bearing 13°, NNE), z up — from the OSM survey origin
 * (-117.91779, 33.81465). The model's origin is the middle of what it draws,
 * (u, v) = (U0, V0), so x = u - U0, y = v - V0, and the catalog bearing is
 * 13°. y = 0 is the garden and flume level in front, the lowest ground.
 *
 * Evidence:
 *  - OSM, measured: the clock tower platform way/135699826 (u -10.0..4.7,
 *    v -7.1..3.3) and its part way/135489209 ("Clock Tower", h 10); the show
 *    building way/499783300, whose south edge (v 7.9..9.4, u -33.4..12.9) is
 *    the line the facade stands on; the railway (v ≈ 5.2) running between the
 *    clock tower and the facade; the flume ways under the tower. The bearing
 *    is the axis of all of these.
 *  - USGS NAIP orthophoto (public domain), measured: the facade's white band
 *    runs u ≈ -35..+24, ~59 m, behind the railway; the clock tower's square
 *    platform sits in front of it over the flume.
 *  - Published: the clock face is 30 ft (9.1 m) up (Wikipedia, "It's a Small
 *    World"). This sets the clock tower's scale.
 *  - Photos (Wikimedia Commons): straight-on from the mall, Shulman photo
 *    (Es715, CC BY-SA 3.0) — every facade element's position, width and
 *    height below is read off it (see LX/RX/HY); the 2025 straight-on
 *    (Steven Lopez 7, CC0) for the current white-and-gold colours; the clock
 *    tower close up (SolarSurfer, public domain); the facade from the west
 *    (Patrick Pelletier, CC BY-SA 3.0) and from the loading area (HarshLight,
 *    CC BY 2.0, and Vamsi, CC BY-SA 3.0) for which elements stand in front of
 *    which: the Eiffel lattice is behind the windmill and the crown.
 *
 * Estimated: every height. The photo is scaled so that the facade spans the
 * NAIP length and the clock face sits at the published 9.1 m; the facade
 * plane is taken as ~1.25× the clock tower's distance from the camera. That
 * puts the tallest finials near 16 m and the clock tower's gables at 12.9 m.
 * The facade's foot is hidden by a ~3 m hedge bank in every photo; the bank
 * is not modelled (it is ground and planting), so the flats run down to y = 0.
 * The clock tower group's 8.4 m width, its proportions (doors, triangle panel and
 * belfry each about one clock diameter and a half) and its front at v -3.6
 * are from the SolarSurfer close-up, scaled on the 9.1 m clock.
 * Depth (front-to-back relief, 0.6–1.6 m per flat) and the back of the
 * flats are invented: no photo shows the rear, which faces the show building
 * and the railway. Elements hidden behind the clock tower in every photo
 * (u ≈ -11..-4 on the facade) are generic filler.
 * Simplified: the lattice, numbers, gears, stars and doll figures are reduced
 * to gold or silver panels and discs; the boat tunnel arches are grey panels.
 * Colour: the white is a landmark finish (`small-world-white`), as white is
 * this facade's identity; the gold is the photos' leaf gold pulled light.
 * Not modelled: the entrance sign tower, the hedge bank and topiary, the
 * railway between the clock tower and the facade (the map draws it), and
 * way/285388485, the strip under the railway, which the model doesn't cover.
 *
 * Replaces the clock tower platform and its part. The show building
 * way/499783300 stays: the facade stands at its south edge, taller than it,
 * but covers only its front.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const TAU = Math.PI * 2

const white = new Part()   // the facade flats
const gold = new Part()    // domes, crowns, medallions, lattices, finials
const silver = new Part()  // glitter panels: triangles, numbers, gables
const shade = new Part()   // boat-tunnel arches under the clock tower

const U0 = -5.5, V0 = 1.5
const P = (u: number, v: number, z: number): V3 => [u - U0, v - V0, z]

// Shulman photo (3840 px wide), cropped to two halves 1600 px wide from y=60:
// LX/RX turn a crop x into facade u, HY a crop y into height on the facade
// plane. See the header for how the scale was fixed.
const LX = (x: number) => -33.5 + (1.2 * x - 72) / 65.1
const RX = (x: number) => -33.5 + (1920 + 1.2 * x - 72) / 65.1
const HY = (y: number) => 1.5 + (918 - y) / 57

// ---------------------------------------------------------------------------
// Kit

function tri(p: Part, a: V3, b: V3, c: V3, n?: V3[]) { p.tri(a, b, c, undefined, undefined, undefined, n) }
function quad(p: Part, a: V3, b: V3, c: V3, d: V3) { tri(p, a, b, c); tri(p, a, c, d) }

const area = (q: XY[]) => q.reduce((s, a, i) => { const b = q[(i + 1) % q.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2

/** Ear-clipping triangulation of a simple counter-clockwise polygon. */
function earcut(poly: XY[]): [number, number, number][] {
  const idx = poly.map((_, i) => i), out: [number, number, number][] = []
  const cz = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cz(a, b, p) > 1e-9 && cz(b, c, p) > 1e-9 && cz(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = poly[i0], b = poly[i1], c = poly[i2]
      if (cz(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(poly[j], a, b, c))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/**
 * A flat in the facade plane: a (u, z) outline extruded from v0 (its face,
 * toward the viewer) back to v1. Front, back and edges; flat-shaded.
 */
function plate(p: Part, poly: XY[], v0: number, v1: number, o: { back?: boolean } = {}) {
  if (area(poly) < 0) poly = [...poly].reverse()
  const tris = earcut(poly)
  const F = (q: XY) => P(q[0], v0, q[1]), B = (q: XY) => P(q[0], v1, q[1])
  for (const [i, j, k] of tris) tri(p, F(poly[i]), F(poly[j]), F(poly[k]))
  if (o.back !== false) for (const [i, j, k] of tris) tri(p, B(poly[i]), B(poly[k]), B(poly[j]))
  // A flush panel (set on a wall, no back, ≤ 7 cm proud) has no visible edge.
  if (o.back === false && Math.abs(v1 - v0) <= 0.07) return
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-6) continue
    quad(p, F(a), B(a), B(b), F(b))
  }
}

/** A box with its vertical edges chamfered by c (in u, v). */
function box(p: Part, u0: number, u1: number, v0: number, v1: number, z0: number, z1: number, c = 0.12, bottom = false) {
  const ring: XY[] = c > 0
    ? [[u0 + c, v0], [u1 - c, v0], [u1, v0 + c], [u1, v1 - c], [u1 - c, v1], [u0 + c, v1], [u0, v1 - c], [u0, v0 + c]]
    : [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    quad(p, P(a[0], a[1], z0), P(b[0], b[1], z0), P(b[0], b[1], z1), P(a[0], a[1], z1))
  }
  for (let i = 1; i < ring.length - 1; i++) {
    tri(p, P(...ring[0], z1), P(...ring[i], z1), P(...ring[i + 1], z1))
    if (bottom) tri(p, P(...ring[0], z0), P(...ring[i + 1], z0), P(...ring[i], z0))
  }
}

/** A square-based pyramid (or a hipped gable when the base is long). */
function pyramid(p: Part, u0: number, u1: number, v0: number, v1: number, z0: number, z1: number) {
  const um = (u0 + u1) / 2, vm = (v0 + v1) / 2
  const c: V3[] = [P(u0, v0, z0), P(u1, v0, z0), P(u1, v1, z0), P(u0, v1, z0)]
  const apex = P(um, vm, z1)
  for (let i = 0; i < 4; i++) tri(p, c[i], c[(i + 1) % 4], apex)
}

/** A smooth solid of revolution about a vertical axis, profile [r, z] bottom to top. */
function lathe(p: Part, cu: number, cv: number, prof: XY[], n = 12) {
  const at = (r: number, z: number, t: number) => P(cu + r * Math.cos(t), cv + r * Math.sin(t), z)
  // Profile normals, from the neighbouring segments.
  const nrm = prof.map((_, k) => {
    const a = prof[Math.max(0, k - 1)], b = prof[Math.min(prof.length - 1, k + 1)]
    const dr = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dr, dz) || 1
    return [dz / l, -dr / l] as XY // outward (radial, up)
  })
  for (let i = 0; i < n; i++) {
    const t0 = (i / n) * TAU, t1 = ((i + 1) / n) * TAU
    for (let k = 0; k < prof.length - 1; k++) {
      const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
      const n0 = nrm[k], n1 = nrm[k + 1]
      const N = (nn: XY, t: number): V3 => [nn[0] * Math.cos(t), nn[0] * Math.sin(t), nn[1]]
      const a = at(r0, z0, t0), b = at(r0, z0, t1), c = at(r1, z1, t1), d = at(r1, z1, t0)
      if (r1 < 1e-6) tri(p, a, b, c, [N(n0, t0), N(n0, t1), N(n1, (t0 + t1) / 2)])
      else if (r0 < 1e-6) tri(p, a, c, d, [N(n0, (t0 + t1) / 2), N(n1, t1), N(n1, t0)])
      else {
        tri(p, a, b, c, [N(n0, t0), N(n0, t1), N(n1, t1)])
        tri(p, a, c, d, [N(n0, t0), N(n1, t1), N(n1, t0)])
      }
    }
  }
}

const circle = (cu: number, cz: number, r: number, n = 14, ph = 0): XY[] =>
  Array.from({ length: n }, (_, i) => [cu + r * Math.cos(ph + (i / n) * TAU), cz + r * Math.sin(ph + (i / n) * TAU)] as XY)

/** A disc set on a face whose front is at v (it stands proud by t). */
const disc = (p: Part, cu: number, cz: number, r: number, v: number, t = 0.12, n = 14) =>
  plate(p, circle(cu, cz, r, n), v - t, v, { back: false })

/**
 * An almond outline from z0 to z1, w wide: pointed at both ends (`lozenge`,
 * the gold lattice almonds) or flat-bottomed and pointed on top (the white
 * flame and bullet towers).
 */
function almond(cu: number, z0: number, z1: number, w: number, lozenge = true, n = 8): XY[] {
  const right: XY[] = []
  for (let i = 1; i < n; i++) {
    const t = i / n
    const half = lozenge
      ? (w / 2) * Math.pow(Math.sin(Math.PI * t), 0.75)
      : (w / 2) * (t < 0.35 ? 1 : Math.cos(((t - 0.35) / 0.65) * Math.PI / 2) ** 0.8)
    right.push([cu + half, z0 + (z1 - z0) * t])
  }
  const left = right.map(([u, z]) => [2 * cu - u, z] as XY).reverse()
  const bottom: XY[] = lozenge ? [[cu, z0]] : [[cu - w / 2, z0], [cu + w / 2, z0]]
  return [...bottom, ...right, [cu, z1], ...left]
}

/** A round-topped (arched) panel outline. */
function arch(u0: number, u1: number, z0: number, zs: number, n = 8): XY[] {
  const cu = (u0 + u1) / 2, r = (u1 - u0) / 2
  const top: XY[] = Array.from({ length: n + 1 }, (_, i) => [cu + r * Math.cos((i / n) * Math.PI), zs + r * Math.sin((i / n) * Math.PI)] as XY)
  return [[u0, z0], [u1, z0], ...top]
}

/** An onion dome profile of base radius r from z0, total height h. */
const onion = (r: number, z0: number, h: number): XY[] => [
  [r * 0.75, z0], [r * 1.0, z0 + h * 0.18], [r * 1.05, z0 + h * 0.33], [r * 0.9, z0 + h * 0.5],
  [r * 0.55, z0 + h * 0.7], [r * 0.2, z0 + h * 0.88], [0, z0 + h],
]
/** A round dome on a short drum. */
const dome = (r: number, z0: number, h: number): XY[] => [
  [r, z0], [r, z0 + h * 0.12], [r * 0.95, z0 + h * 0.4], [r * 0.78, z0 + h * 0.66], [r * 0.48, z0 + h * 0.88], [0, z0 + h],
]

/** A gold ball (a stack of them is a common finial), as a cheap bicone. */
function ball(u: number, v: number, z: number, r: number) {
  lathe(gold, u, v, [[0, z], [r * 0.8, z + r * 0.45], [r, z + r], [r * 0.8, z + r * 1.55], [0, z + 2 * r]], 6)
}

/** A gold finial: a ball and a spike, on top of whatever is at (u, v, z). */
function finial(u: number, v: number, z: number, h = 0.8) {
  const r = Math.min(0.16, h * 0.2)
  lathe(gold, u, v, [[0, z], [r, z + r], [0, z + 2 * r]], 6)
  pyramid(gold, u - 0.05, u + 0.05, v - 0.05, v + 0.05, z + 2 * r, z + h)
}

/** A flat gold four-petal flower (the facade's many flower finials), on a stalk. */
function flower(u: number, v: number, z: number, s = 0.45) {
  pyramid(gold, u - 0.06, u + 0.06, v - 0.06, v + 0.06, z, z + s * 1.2)
  const c = z + s * 1.2 + s * 0.6, k = s * 0.22
  const pts: XY[] = []
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU + Math.PI / 8
    const r = i % 2 ? k : s * 0.62
    pts.push([u + r * Math.cos(a), c + r * Math.sin(a)])
  }
  plate(gold, pts, v - 0.06, v + 0.06)
}

/** A small flag: a pole and a gold pennant flying east. */
function flag(u: number, v: number, z: number) {
  box(gold, u - 0.04, u + 0.04, v - 0.04, v + 0.04, z, z + 1.0, 0)
  plate(gold, [[u + 0.04, z + 0.62], [u + 0.75, z + 0.78], [u + 0.04, z + 0.95]], v - 0.03, v + 0.03)
}

/** Merlons along the top of a flat, u0..u1 at z, n teeth. */
function merlons(p: Part, u0: number, u1: number, v0: number, v1: number, z: number, h: number, n: number) {
  const w = (u1 - u0) / (2 * n - 1)
  for (let i = 0; i < n; i++) box(p, u0 + 2 * i * w, u0 + (2 * i + 1) * w, v0, v1, z, z + h, 0)
}

/** A row of half-disc scallops (the Moorish block's crest). */
function scallops(p: Part, u0: number, u1: number, v0: number, v1: number, z: number, n: number) {
  const w = (u1 - u0) / n
  for (let i = 0; i < n; i++) {
    const cu = u0 + w * (i + 0.5), r = w / 2
    plate(p, Array.from({ length: 7 }, (_, k) => [cu + r * Math.cos((k / 6) * Math.PI), z + r * 0.9 * Math.sin((k / 6) * Math.PI)] as XY), v0, v1)
  }
}

/** Silver triangle pattern on a face: an "X" of four triangles in u0..u1, z0..z1. */
function xpanel(u0: number, u1: number, z0: number, z1: number, v: number) {
  const um = (u0 + u1) / 2, zm = (z0 + z1) / 2, g = 0.08
  plate(silver, [[u0 + g, z1 - g], [um - g * 0.5, zm + g], [u0 + g, z0 + g]], v - 0.06, v, { back: false })
  plate(silver, [[u1 - g, z0 + g], [um + g * 0.5, zm + g * 0], [u1 - g, z1 - g]], v - 0.06, v, { back: false })
  plate(silver, [[u0 + g * 2, z1 - g], [u1 - g * 2, z1 - g], [um, zm + g]], v - 0.06, v, { back: false })
  plate(silver, [[u0 + g * 2, z0 + g], [um, zm - g], [u1 - g * 2, z0 + g]], v - 0.06, v, { back: false })
}

/** Silver checker panels (the facade's glitter blocks) on a face: cols × rows, alternate cells. */
function checker(u0: number, u1: number, z0: number, z1: number, v: number, cols: number, rows: number, odd = 0) {
  const w = (u1 - u0) / cols, h = (z1 - z0) / rows, g = 0.06
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    if ((i + j + odd) % 2) continue
    const a = u0 + i * w + g, b = u0 + (i + 1) * w - g, c = z0 + j * h + g, d = z0 + (j + 1) * h - g
    plate(silver, [[a, c], [b, c], [b, d], [a, d]], v - 0.05, v, { back: false })
  }
}

// ---------------------------------------------------------------------------
// The facade. Fronts at three depths: FRONT for the low flats, MID for most
// towers and BACK for the tallest landmarks, which really stand behind.

const FRONT = 7.6, MID = 8.0, BACK = 8.7, REAR = 10.2
const UW = -35.0, UE = 24.2

// The continuous lower wall behind everything: the first tier of flats.
box(white, UW, UE, MID + 0.2, REAR, 0, 7.0, 0.3)
/** A tower flat: a body from the ground to `top`, front at v, `d` deep. */
function tower(u0: number, u1: number, top: number, v = MID, d = 1.2) {
  box(white, u0, u1, v, v + d, 0, top, 0.12)
}

// A. West end: castellated stub wall with a gold lattice arch.
tower(UW, LX(60), HY(510), FRONT, 1.6)
merlons(white, UW + 0.1, LX(60) - 0.1, FRONT + 0.3, FRONT + 1.3, HY(510), 0.5, 2)
plate(gold, arch(UW + 0.25, LX(60) - 0.25, 4.2, 6.2, 6), FRONT - 0.05, FRONT, { back: false })

// B. The ribbed pointed cupola tower, gold band and peacock medallion.
{
  const u0 = LX(60), u1 = LX(160), cu = (u0 + u1) / 2, r = (u1 - u0) / 2
  tower(u0, u1, HY(480), FRONT, 1.8)
  box(gold, u0, u1, FRONT - 0.05, FRONT + 1.85, HY(480) - 0.5, HY(480), 0.1)
  lathe(white, cu, FRONT + 0.9, [[r * 0.95, HY(480)], [r * 1.0, HY(480) + 0.6], [r * 0.85, HY(410)], [r * 0.5, HY(355)], [0, HY(315)]], 12)
  finial(cu, FRONT + 0.9, HY(315), 0.6)
  disc(gold, cu, HY(640), 0.8, FRONT)
}

// C. The Moorish block: two gold arched lattice windows, scalloped crest,
//    gold-starred grid below, and a ribbed dome rising behind it.
{
  const u0 = LX(160), u1 = LX(410)
  tower(u0, u1, HY(372), FRONT, 1.6)
  scallops(white, u0 + 0.1, u1 - 0.1, FRONT + 0.2, FRONT + 1.2, HY(372), 5)
  for (const [a, b] of [[190, 247], [300, 357]]) plate(gold, arch(LX(a), LX(b), HY(473), HY(410), 6), FRONT - 0.06, FRONT, { back: false })
  for (const x of [215, 275, 335]) for (const y of [560, 680]) disc(gold, LX(x) + 0.3, HY(y), 0.22, FRONT, 0.08, 8)
  xpanel(u0 + 0.2, (u0 + u1) / 2 - 0.1, HY(760), HY(500), FRONT)
  xpanel((u0 + u1) / 2 + 0.1, u1 - 0.2, HY(760), HY(500), FRONT)
  const cu = LX(355)
  box(white, cu - 1.4, cu + 1.4, BACK, BACK + 2.4, 0, HY(330), 0.2)
  lathe(white, cu, BACK + 1.2, dome(1.35, HY(330), HY(245) - HY(330)), 12)
  flower(cu, BACK + 1.2, HY(245), 0.45)
}

// D. Castellated wall, a little spire and a small dome behind it.
{
  const u0 = LX(410), u1 = LX(615)
  tower(u0, u1, HY(395), FRONT, 1.4)
  merlons(white, u0 + 0.1, u1 - 0.1, FRONT + 0.1, FRONT + 1.1, HY(395), 0.45, 4)
  checker(u0 + 0.2, u1 - 0.2, HY(780), HY(440), FRONT, 3, 4)
  const s = LX(505)
  box(white, s - 0.35, s + 0.35, BACK, BACK + 0.7, 0, HY(395), 0.08)
  pyramid(white, s - 0.35, s + 0.35, BACK, BACK + 0.7, HY(395), HY(300))
  finial(s, BACK + 0.35, HY(300), 0.4)
  const d = LX(570)
  box(white, d - 0.75, d + 0.75, BACK, BACK + 1.5, 0, HY(390), 0.1)
  lathe(white, d, BACK + 0.75, onion(0.75, HY(390), HY(310) - HY(390)), 12)
  flower(d, BACK + 0.75, HY(310), 0.4)
}

// E. Twin square towers, one white and one gold pyramid cap, and the gold
//    sun medallion block below them.
{
  const u0 = LX(617), u1 = LX(733), um = (u0 + u1) / 2
  for (const [a, b, cap] of [[u0, um - 0.05, white], [um + 0.05, u1, gold]] as [number, number, Part][]) {
    tower(a, b, HY(277), MID, 1.0)
    pyramid(cap, a, b, MID, MID + 1.0, HY(277), HY(223))
    finial((a + b) / 2, MID + 0.5, HY(223), 0.5)
    disc(white, (a + b) / 2, HY(330), 0.32, MID, 0.08, 10)
  }
  box(white, u0, u1, FRONT, FRONT + 1.4, 0, HY(483), 0.1)
  disc(gold, um, HY(536), 0.75, FRONT, 0.14, 16)
  for (const [a, b] of [[u0 + 0.2, u0 + 0.55], [u1 - 0.55, u1 - 0.2]])
    plate(silver, [[a, HY(483) - 0.15], [b, HY(483) - 0.15], [(a + b) / 2, HY(290) + 0.4]], MID - 0.05, MID, { back: false })
}

// F. Block with a gold lattice almond.
{
  const u0 = LX(733), u1 = LX(850)
  tower(u0, u1, HY(345), FRONT, 1.2)
  plate(white, [[u0, HY(345)], [u1, HY(345)], [(u0 + u1) / 2, HY(285)]], FRONT, FRONT + 1.2)
  plate(gold, almond((u0 + u1) / 2, HY(487), HY(387), 0.9), FRONT - 0.06, FRONT, { back: false })
  checker(u0 + 0.15, u1 - 0.15, HY(780), HY(520), FRONT, 2, 3)
  disc(gold, LX(880), HY(470), 0.35, FRONT, 0.1, 10)
}

// G. The white flame (almond) tower.
{
  const u0 = LX(845), u1 = LX(915)
  tower(u0, u1, HY(380), MID, 1.0)
  plate(white, almond((u0 + u1) / 2, HY(380) - 0.6, HY(235), u1 - u0, false), MID, MID + 1.0)
}

// H. The Eiffel Tower lattice, at the back, white with a gold fleur-de-lis.
{
  const cu = LX(1085), cv = MID + 1.4, z0 = 7.0, z1 = HY(120)
  const b = 1.1
  // Four legs splaying out from a slender mast, with two gold platforms.
  for (const [su, sv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const bu = cu + su * b, bv = cv + sv * b, tu = cu + su * 0.18, tv = cv + sv * 0.18, zm = z0 + (z1 - z0) * 0.62
    const s = 0.13
    const sec = (u: number, v: number, z: number): V3[] => [P(u - s, v - s, z), P(u + s, v - s, z), P(u + s, v + s, z), P(u - s, v + s, z)]
    white.sweep([sec(bu, bv, z0), sec(tu, tv, zm)])
  }
  box(white, cu - 0.2, cu + 0.2, cv - 0.2, cv + 0.2, z0 + (z1 - z0) * 0.6, z1, 0.05)
  box(gold, cu - 0.75, cu + 0.75, cv - 0.75, cv + 0.75, z0 + (z1 - z0) * 0.3, z0 + (z1 - z0) * 0.3 + 0.25, 0.1)
  box(gold, cu - 0.32, cu + 0.32, cv - 0.32, cv + 0.32, z0 + (z1 - z0) * 0.62, z0 + (z1 - z0) * 0.62 + 0.22, 0.05)
  flower(cu, cv, z1, 0.5)
}

// I. The thin Gothic frame gable.
{
  const u0 = LX(920), u1 = LX(1030), um = (u0 + u1) / 2
  tower(u0, u1, HY(330), BACK, 0.8)
  const zt = HY(330), za = HY(220), w = 0.22
  plate(white, [[u0, zt], [u1, zt], [um, za]], BACK, BACK + 0.8)
  plate(silver, [[u0 + w * 2, zt + 0.1], [u1 - w * 2, zt + 0.1], [um, za - w * 3]], BACK - 0.05, BACK, { back: false })
  finial(um, BACK + 0.4, za, 0.6)
}

// J. The sawtooth crown band in front of the Eiffel tower.
{
  const u0 = LX(950), u1 = LX(1170), z = HY(320), n = 7, w = (u1 - u0) / n
  tower(u0, u1, z, FRONT, 1.0)
  for (let i = 0; i < n; i++) plate(white, [[u0 + i * w, z], [u0 + (i + 1) * w, z], [u0 + (i + 0.5) * w, z + 0.9]], FRONT, FRONT + 1.0)
  for (const x of [990, 1060, 1130]) plate(silver, [[LX(x) - 0.45, HY(520)], [LX(x) + 0.45, HY(520)], [LX(x), HY(380)]], FRONT - 0.05, FRONT, { back: false })
}

// K. The Dutch house with the gold windmill sails.
{
  const u0 = LX(1060), u1 = LX(1235), um = (u0 + u1) / 2
  tower(u0, u1, HY(330), MID, 1.3)
  plate(white, [[u0, HY(330)], [u1, HY(330)], [um, HY(225)]], MID, MID + 1.3)
  checker(u0 + 0.2, u1 - 0.2, HY(760), HY(400), MID, 2, 4, 1)
  const cz = HY(262), L = 1.7, w = 0.17
  for (const a of [Math.PI / 4, -Math.PI / 4]) {
    const c = Math.cos(a), s = Math.sin(a)
    plate(gold, [[um - L * c - w * s, cz - L * s + w * c], [um - L * c + w * s, cz - L * s - w * c], [um + L * c + w * s, cz + L * s - w * c], [um + L * c - w * s, cz + L * s + w * c]], MID - 0.25, MID - 0.1)
  }
  disc(gold, um, cz, 0.25, MID - 0.25, 0.1, 8)
}

// Filler behind the clock tower (hidden in every photo): a bullet tower, a
// gold-roofed gable and a plain block, so the facade doesn't gap from behind.
{
  tower(-11.6, -9.4, 9.6, MID, 1.2)
  plate(white, almond(-10.5, 9.0, 12.6, 2.2, false), MID, MID + 1.2)
  tower(-9.4, -6.6, 10.4, BACK, 1.2)
  plate(gold, [[-9.4, 10.4], [-6.6, 10.4], [-8.0, 11.9]], BACK, BACK + 1.2)
  tower(-6.6, -3.0, 9.8, MID, 1.2)
  merlons(white, -6.5, -3.1, MID + 0.1, MID + 1.1, 9.8, 0.45, 4)
}

// N. The onion-domed tower with the gold grille circle (tallest on the right).
{
  const u0 = RX(143), u1 = RX(243), cu = (u0 + u1) / 2
  tower(u0, u1, HY(230), BACK, 1.8)
  disc(gold, cu, HY(283), 0.85, BACK, 0.12, 16)
  lathe(white, cu, BACK + 0.9, onion(0.95, HY(230), HY(137) - HY(230)), 12)
  flower(cu, BACK + 0.9, HY(137), 0.45)
  plate(silver, [[u0 + 0.15, HY(345)], [u1 - 0.15, HY(345)], [cu, HY(450)]], BACK - 0.05, BACK, { back: false })
  xpanel(u0 + 0.1, u1 - 0.1, HY(560), HY(400), BACK)
}
// Its neighbour on the left: a white gable frame.
{
  const u0 = RX(43), u1 = RX(143), um = (u0 + u1) / 2
  tower(u0, u1, HY(330), BACK + 0.4, 1.0)
  plate(white, [[u0, HY(330)], [u1, HY(330)], [um, HY(227)]], BACK + 0.4, BACK + 1.4)
}

// O. The peacock plaque: a round-shouldered white crest with the big gold
//    medallion, gold ball stack on top, a round window below.
{
  const u0 = RX(213), u1 = RX(360), cu = (u0 + u1) / 2, r = (u1 - u0) / 2
  tower(u0, u1, HY(520), FRONT, 1.2)
  const crest: XY[] = [[u0, HY(520)], [u1, HY(520)], ...Array.from({ length: 9 }, (_, i) => {
    const a = (i / 8) * Math.PI
    return [cu + r * Math.cos(a), HY(470) + (HY(397) - HY(470)) * Math.sin(a)] as XY
  })]
  plate(white, crest, FRONT, FRONT + 1.2)
  disc(gold, cu, HY(470), 1.0, FRONT, 0.16, 16)
  for (let k = 0; k < 3; k++) ball(cu, FRONT + 0.6, HY(397) + k * 0.42, 0.21)
  disc(silver, cu, HY(600), 0.45, FRONT, 0.06, 12)
}

// P. The tall Gothic gable with gold glass, and the gold lattice hourglass.
{
  const u0 = RX(330), u1 = RX(427), um = (u0 + u1) / 2
  tower(u0, u1, HY(337), BACK, 1.0)
  plate(white, [[u0, HY(337)], [u1, HY(337)], [um, HY(143)]], BACK, BACK + 1.0)
  plate(gold, [[um - 0.2, HY(330)], [um + 0.2, HY(330)], [um, HY(230)]], BACK - 0.05, BACK, { back: false })
  finial(um, BACK + 0.5, HY(143), 0.5)
  const a = RX(427), b = RX(513), c = (a + b) / 2
  tower(a, b, HY(440), FRONT, 1.0)
  plate(gold, [[a + 0.1, HY(443)], [b - 0.1, HY(443)], [c, HY(536)]], FRONT - 0.06, FRONT, { back: false })
  plate(gold, [[c, HY(536)], [b - 0.1, HY(630)], [a + 0.1, HY(630)]], FRONT - 0.06, FRONT, { back: false })
}

// Q. Gabled tower with three pins.
{
  const u0 = RX(427), u1 = RX(520), um = (u0 + u1) / 2
  tower(u0, u1, HY(420), MID, 1.0)
  plate(white, [[u0, HY(420)], [u1, HY(420)], [um, HY(337)]], MID, MID + 1.0)
  disc(silver, um, HY(395), 0.3, MID, 0.06, 10)
}

// R. The Leaning Tower of Pisa with its gold crown, leaning east in the plane
//    of the facade, behind a big white gable.
{
  const base = RX(560), zb = HY(540), zt = HY(205), lean = (RX(660) - RX(560))
  const w = 2.1, d = 1.8, v = BACK + 0.2
  const at = (t: number) => base + lean * t
  // A leaning octagonal shaft, flat-shaded.
  const ring = (t: number): V3[] => Array.from({ length: 8 }, (_, i) => {
    const a = ((i + 0.5) / 8) * TAU
    return P(at(t) + (w / 2) * Math.cos(a), v + d / 2 + (d / 2) * Math.sin(a), zb + (zt - zb) * t)
  })
  white.loft([ring(0), ring(0.33), ring(0.66), ring(1)])
  white.cap(ring(1), true)
  // Gallery bands, silver.
  for (const t of [0.33, 0.66]) {
    const r0 = ring(t - 0.025), r1 = ring(t + 0.025)
    const grow = (r: V3[], k: number) => r.map((q): V3 => {
      const c = P(at(t), v + d / 2, 0)
      return [c[0] + (q[0] - c[0]) * k, c[1] + (q[1] - c[1]) * k, q[2]]
    })
    silver.loft([grow(r0, 1.12), grow(r1, 1.12)])
    silver.cap(grow(r1, 1.12), true)
  }
  // The crown: gold teeth round the top.
  const cu = at(1), zc = zt
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU
    const tu = cu + 0.75 * Math.cos(a), tv = v + d / 2 + 0.7 * Math.sin(a)
    pyramid(gold, tu - 0.17, tu + 0.17, tv - 0.17, tv + 0.17, zc - 0.25, zc + 0.55)
  }
  box(gold, cu - 0.85, cu + 0.85, v + d / 2 - 0.8, v + d / 2 + 0.8, zc - 0.4, zc - 0.05, 0.25)
  box(white, base - 0.9, base + 0.9, v, v + d, 0, zb, 0.1)
  // The white gable in front of Pisa's foot.
  const g0 = RX(520), g1 = RX(650)
  tower(g0, g1, HY(520), MID, 1.0)
  plate(white, [[g0, HY(520)], [g1, HY(520)], [(g0 + g1) / 2, HY(410)]], MID, MID + 1.0)
  plate(silver, [[g0 + 0.4, HY(525)], [g1 - 0.4, HY(525)], [(g0 + g1) / 2, HY(440)]], MID - 0.05, MID, { back: false })
}

// T. The gold ribbed dome (the facade's Taj), on a scalloped white drum.
{
  const u0 = RX(707), u1 = RX(805), cu = (u0 + u1) / 2, r = (u1 - u0) / 2
  tower(u0, u1, HY(420), MID, 1.9)
  lathe(gold, cu, MID + 0.95, dome(r * 0.98, HY(420), HY(333) - HY(420)), 12)
  finial(cu, MID + 0.95, HY(333), 0.6)
  disc(white, cu, HY(470), 0.62, MID, 0.12, 12)
}
// U. Gable with a round hole (silver disc) beside it.
{
  const u0 = RX(640), u1 = RX(707), um = (u0 + u1) / 2
  tower(u0, u1, HY(460), FRONT, 1.0)
  plate(white, [[u0, HY(460)], [u1, HY(460)], [um, HY(377)]], FRONT, FRONT + 1.0)
  disc(silver, um, HY(500), 0.55, FRONT, 0.06, 12)
  xpanel(u0 + 0.1, u1 - 0.1, HY(760), HY(560), FRONT)
}

// V. The almond medallion tower with a flower finial.
{
  const u0 = RX(805), u1 = RX(880), cu = (u0 + u1) / 2
  tower(u0, u1, HY(420), FRONT, 1.0)
  plate(white, almond(cu, HY(420) - 0.3, HY(340), u1 - u0, false), FRONT, FRONT + 1.0)
  plate(gold, almond(cu, HY(470), HY(400), (u1 - u0) * 0.55), FRONT - 0.06, FRONT, { back: false })
  flower(cu, FRONT + 0.5, HY(340), 0.4)
}

// W. The low X-pattern block with a gold lattice almond.
{
  const u0 = RX(880), u1 = RX(1010)
  tower(u0, u1, HY(440), FRONT, 1.2)
  xpanel(u0 + 0.1, u1 - 0.1, HY(530), HY(445), FRONT)
  plate(gold, almond((u0 + u1) / 2, HY(670), HY(555), 1.0), FRONT - 0.06, FRONT, { back: false })
}

// X. The castellated tower with gold window slits, a white spire on top and
//    a gold medallion low down.
{
  const u0 = RX(1015), u1 = RX(1175), cu = (u0 + u1) / 2
  tower(u0, u1, HY(395), MID, 1.6)
  box(white, u0 - 0.1, u1 + 0.1, MID - 0.1, MID + 1.7, HY(420), HY(395), 0.1)
  merlons(white, u0, u1, MID - 0.1, MID + 1.7, HY(395), 0.4, 5)
  const n = 4, w = (u1 - u0 - 0.6) / (2 * n - 1)
  for (let i = 0; i < n; i++) plate(gold, [[u0 + 0.3 + 2 * i * w, HY(530)], [u0 + 0.3 + (2 * i + 1) * w, HY(530)], [u0 + 0.3 + (2 * i + 1) * w, HY(425)], [u0 + 0.3 + 2 * i * w, HY(425)]], MID - 0.06, MID, { back: false })
  pyramid(white, cu - 0.75, cu + 0.75, MID + 0.05, MID + 1.55, HY(395), HY(215))
  finial(cu, MID + 0.8, HY(215), 0.5)
  disc(gold, cu, HY(670), 0.65, MID, 0.12, 14)
  xpanel(u0 + 0.1, u1 - 0.1, HY(775), HY(700), MID)
}

// Y. The low east wing: gold dome, white cupola, gold pyramid spire.
{
  const u0 = RX(1175), u1 = RX(1390)
  tower(u0, u1, HY(510), FRONT, 1.2)
  const d = RX(1212)
  lathe(gold, d, FRONT + 0.6, dome(0.85, HY(510), HY(445) - HY(510)), 12)
  finial(d, FRONT + 0.6, HY(445), 0.4)
  const c = RX(1300)
  lathe(white, c, FRONT + 0.6, onion(0.5, HY(510), HY(470) - HY(510)), 10)
  const s = RX(1368)
  box(white, s - 0.4, s + 0.4, FRONT, FRONT + 0.8, 0, HY(530), 0.06)
  pyramid(gold, s - 0.4, s + 0.4, FRONT, FRONT + 0.8, HY(530), HY(435))
  for (const x of [1240, 1265]) plate(silver, arch(RX(x) - 0.2, RX(x) + 0.2, HY(640), HY(560), 5), FRONT - 0.05, FRONT, { back: false })
}

// Z. The low gateway and AA. the east end tower with its gold pyramid cap.
{
  const u0 = RX(1390), u1 = RX(1440)
  box(white, u0, u1, FRONT + 0.3, FRONT + 1.0, 0, HY(600), 0.05)
  const a = RX(1440), b = UE
  tower(a, b, HY(590), FRONT, 2.0)
  pyramid(gold, a, b, FRONT, FRONT + 2.0, HY(590), HY(530))
  xpanel(a + 0.1, b - 0.1, HY(720), HY(600), FRONT)
}

// ---------------------------------------------------------------------------
// The clock tower, on its platform over the flume (OSM way/135699826).

{
  // Platform with the boat-tunnel arches.
  const pu0 = -10.05, pu1 = 4.8, pv0 = -7.15, pv1 = 3.35, ph = 2.4
  box(white, pu0, pu1, pv0, pv1, 0, ph, 0.3)
  box(white, pu0, pu1, pv0, pv1, ph, ph + 0.35, 0.3) // the parapet cap line
  const nA = 5, aw = (pu1 - pu0) / nA
  for (let i = 0; i < nA; i++) {
    const cu = pu0 + aw * (i + 0.5)
    plate(shade, arch(cu - aw * 0.36, cu + aw * 0.36, 0, 1.15, 8), pv0 - 0.04, pv0, { back: false })
  }
  // The west and east ends: two arches each (the flume runs through).
  for (const [u, s] of [[pu0, -1], [pu1, 1]] as [number, number][]) {
    for (const cv of [-4.6, 0.6]) {
      const poly = arch(cv - 1.6, cv + 1.6, 0, 1.0, 8)
      // Plate is authored in (u, z); here the face is a u = const plane, so
      // build it directly as a fan in (v, z).
      const pts = poly.map(([vv, z]) => P(u + s * 0.04, vv, z))
      for (let k = 1; k < pts.length - 1; k++) s > 0 ? tri(shade, pts[0], pts[k], pts[k + 1]) : tri(shade, pts[0], pts[k + 1], pts[k])
    }
  }

  const Z = ph + 0.35
  const vF = -3.6, D = 3.0
  // Ball column (left).
  const b0 = -7.3, b1 = -6.45
  box(white, b0, b1, vF + 0.5, vF + 3.0, Z, 8.6, 0.08)
  for (let k = 0; k < 3; k++) ball((b0 + b1) / 2, vF + 1.75, 8.6 + k * 0.48, 0.24)
  // White spire tower.
  const s0 = -6.45, s1 = -5.15, sc = (s0 + s1) / 2
  box(white, s0, s1, vF + 0.3, vF + D - 0.3, Z, 8.9, 0.1)
  pyramid(white, s0, s1, vF + 0.3, vF + D - 0.3, 8.9, 11.7)
  finial(sc, vF + D / 2, 11.7, 0.6)
  disc(gold, sc, 8.0, 0.42, vF + 0.3, 0.1, 12)
  disc(silver, sc, 6.2, 0.4, vF + 0.3, 0.06, 12)
  disc(silver, sc, 5.2, 0.3, vF + 0.3, 0.06, 10)
  // Central block: doors, the silver X of triangles, the open twin-arched
  // belfry with the clock, the gold frieze and two silver gables with flags.
  const c0 = -5.15, c1 = -2.65, cc = (c0 + c1) / 2
  box(white, c0, c1, vF, vF + D, Z, 7.6, 0.1)
  plate(gold, arch(c0 + 0.12, c1 - 0.12, Z, Z + 1.85, 10), vF - 0.06, vF, { back: false })
  plate(white, arch(c0 + 0.32, c1 - 0.32, Z, Z + 1.85, 10), vF - 0.1, vF - 0.06, { back: false })
  disc(gold, cc - 0.35, Z + 1.3, 0.12, vF - 0.1, 0.04, 6)
  disc(gold, cc + 0.35, Z + 1.3, 0.12, vF - 0.1, 0.04, 6)
  xpanel(c0 + 0.05, c1 - 0.05, 5.15, 7.55, vF)
  // Belfry: three posts and two round arches, open between them.
  const zb = 7.6, zs = 10.6, zt = 11.4, pw = 0.26
  const open = (c1 - c0 - 3 * pw) / 2, r = open / 2
  for (const u of [c0, c0 + pw + open, c1 - pw]) box(white, u, u + pw, vF, vF + D, zb, zs, 0)
  box(white, c0, c1, vF, vF + D, zt - 0.35, zt, 0)
  for (const o0 of [c0 + pw, c0 + 2 * pw + open]) {
    // Spandrel filling each arch's top corners: front and back faces.
    const cu = o0 + r, n = 6
    const span: XY[] = [[o0, zs], ...Array.from({ length: n + 1 }, (_, i) => [cu - r * Math.cos((i / n) * Math.PI), zs + r * Math.sin((i / n) * Math.PI)] as XY), [o0 + open, zs], [o0 + open, zt - 0.35], [o0, zt - 0.35]]
    plate(white, span, vF, vF + D)
  }
  // Silver glitter at the back of the belfry, so the open arches read.
  box(silver, c0 + pw, c1 - pw, vF + D - 0.5, vF + D - 0.3, 9.5, zt - 0.35, 0)
  // Gold grille behind the clock, filling the arches' lower half.
  box(gold, c0 + pw, c1 - pw, vF + 1.2, vF + 1.4, zb, 9.5, 0)
  // The clock: white face, gold ring, gold eyes and nose (the smile).
  const zc = 9.1, R = 1.05, vc = vF - 0.12
  plate(gold, circle(cc, zc, R + 0.3, 16), vc - 0.05, vF + 0.4)
  plate(white, circle(cc, zc, R, 16), vc - 0.12, vc - 0.05, { back: false })
  disc(gold, cc - 0.38, zc + 0.25, 0.17, vc - 0.12, 0.05, 8)
  disc(gold, cc + 0.38, zc + 0.25, 0.17, vc - 0.12, 0.05, 8)
  plate(gold, [[cc - 0.07, zc + 0.35], [cc + 0.07, zc + 0.35], [cc + 0.1, zc - 0.6], [cc - 0.1, zc - 0.6]], vc - 0.17, vc - 0.12, { back: false })
  // Frieze and gables.
  box(gold, c0 - 0.05, c1 + 0.05, vF - 0.05, vF + D + 0.05, zt, zt + 0.5, 0.06)
  box(gold, c0 - 0.05, c1 + 0.05, vF - 0.05, vF + D + 0.05, zb - 0.3, zb, 0.06)
  const g = (c1 - c0) / 2
  // Two steep gables side by side, ridges running front to back, silver
  // glitter on their faces.
  for (const u of [c0, c0 + g]) {
    plate(white, [[u, zt + 0.5], [u + g, zt + 0.5], [u + g / 2, 12.9]], vF, vF + D)
    plate(silver, [[u + 0.12, zt + 0.58], [u + g - 0.12, zt + 0.58], [u + g / 2, 12.65]], vF - 0.05, vF, { back: false })
    flag(u + g / 2, vF + 0.3, 12.9)
  }
  // Dome column with the numbers (a silver strip) and the gold onion dome.
  const d0 = -2.65, d1 = -1.4, dc = (d0 + d1) / 2
  box(white, d0, d1, vF + 0.15, vF + D - 0.15, Z, 9.4, 0.1)
  box(silver, d0 + 0.15, d1 - 0.15, vF + 0.09, vF + 0.15, Z + 0.2, 7.2, 0)
  disc(gold, dc, 8.4, 0.38, vF + 0.15, 0.08, 10)
  lathe(gold, dc, vF + D / 2, onion(0.6, 9.4, 1.9), 12)
  finial(dc, vF + D / 2, 11.3, 0.7)
  // Right block with gold-faced pyramids and gold suns.
  const r0 = -1.4, r1 = 1.1
  box(white, r0, r1, vF + 0.4, vF + D - 0.4, Z, 8.4, 0.1)
  for (const [a, b] of [[r0 + 0.15, r0 + 1.2], [r1 - 1.2, r1 - 0.15]]) {
    pyramid(gold, a, b, vF + 0.6, vF + 1.65, 8.4, 10.3)
    pyramid(white, a, b, vF + 1.65, vF + D - 0.6, 8.4, 9.6)
  }
  disc(gold, r0 + 0.65, 7.6, 0.3, vF + 0.4, 0.08, 10)
  disc(gold, r1 - 0.65, 7.6, 0.3, vF + 0.4, 0.08, 10)
  xpanel(r0 + 0.1, r1 - 0.1, 4.6, 6.9, vF + 0.4)
}

// ---------------------------------------------------------------------------

const parts = [
  { part: white, material: finish('small-world-white', 0xf7f5ef) },
  { part: gold, material: finish('small-world-gold', 0xd8b55e) },
  { part: silver, material: finish('small-world-silver', 0xc9cdd1) },
  { part: shade, material: { ...PALETTE.roof } },
]
const triangles = parts.reduce((n, p) => n + p.part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('"it\'s a small world" facade', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 13, osm: 'way/135699826, way/135489209', height: 16.5,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/dlr-small-world.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
