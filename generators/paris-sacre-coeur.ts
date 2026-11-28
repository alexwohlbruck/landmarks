/**
 * Basilique du Sacré-Cœur de Montmartre — procedural, CC0-1.0, no textures.
 * bun generators/paris-sacre-coeur.ts
 *
 * Frame: y along the church's axis, from the porch (south) to the campanile
 * (north); bearing 355.5° (the outline's long walls run at 174.7–176.8°).
 * Anchor: the area centroid of way/23762981, lng 2.3430193, lat 48.8867699.
 * The plan is symmetrical about x = 0, as OSM and the building are.
 *
 * Covers and replaces: the outline way/23762981 and its 44 building:parts
 * way/226727320–226727369 (every part inside the outline). The small
 * building way/62043974 against the east chapels is outside the outline
 * and the model, and is not replaced; Saint-Pierre de Montmartre's parts
 * (8218399xx, 653147916) to the west are a separate church.
 *
 * Evidence
 * - OSM (measured): outline and parts, with tagged heights used as given
 *   (above the parvis, G): podium/aisles 16; nave and transept 33 gabled
 *   (roof 9); crossing towers 24/33, small domes to 46, their lanterns to
 *   53; main dome base 21 m across, dome to 73 (roof 23), lantern 70–83;
 *   the façade gable 33.5 and its centre 35.5; porch 9–12; the statue
 *   pedestals 13; front turrets' domes 33, corner turrets' 30; ambulatory 24,
 *   choir 33 (pyramidal roof 9); campanile 64 / 80 / 84.
 * - Published: dome 83 m (fr.wikipedia "Basilique du Sacré-Cœur de
 *   Montmartre"), campanile 84 m; built 1875–1914 of Château-Landon
 *   travertine, which whitens with rain. The brief's 91 m for the bell tower
 *   matches the model's top measured from y = 0 (the lowest ground under the
 *   footprint), 91.2 m.
 * - Photos (Wikimedia Commons):
 *   · "Basilique du Sacré-Cœur de Montmartre - Paris - GT-01 - 2024.jpg",
 *     Terragio67, CC BY-SA 4.0 — the south front: porch, statues, façade
 *     windows and roses, the dome's drum, gallery and lantern, small domes.
 *     https://commons.wikimedia.org/wiki/File:Basilique_du_Sacr%C3%A9-C%C5%93ur_de_Montmartre_-_Paris_-_GT-01_-_2024.jpg
 *   · "Sacré-Coeur @ Square Marcel Bleustein Blanchet @ Montmartre @ Paris
 *     (33416192413).jpg", Guilhem Vellut, CC BY 2.0 — from the east: the
 *     chevet's domed chapels, the campanile's paired lights, belfry arch and
 *     pointed dome.
 *     https://commons.wikimedia.org/wiki/File:Sacr%C3%A9-Coeur_@_Square_Marcel_Bleustein_Blanchet_@_Montmartre_@_Paris_(33416192413).jpg
 *   · "Paris - Basilique Sacré-Cœur de Montmartre (nuit).jpg", Kev22,
 *     CC BY-SA 4.0 — floodlit all over, domes included; porch arches lit.
 *     https://commons.wikimedia.org/wiki/File:Paris_-_Basilique_Sacr%C3%A9-C%C5%93ur_de_Montmartre_(nuit).jpg
 * - Estimated from the photos: drum radius 10.2 m with 12 windows, gallery
 *   band 47–53, dome 17.4 m tall with a slightly pointed crown, lantern
 *   radius 2.3; the chapels' radius (4.2–4.5) from the outline's lobes; the
 *   campanile's stages (shaft to 49, belfry to 61, octagon to 68, dome to
 *   77, lantern and finial to 84); window sizes and positions.
 * - Ground: Mapterhorn shows a flat 6–7 m pit exactly inside the outline
 *   (16.6 m over the table's lowest point, against 20.5–24 all round): the
 *   building's removal from the DEM, not real ground. The map stands the
 *   model's y = 0 at that pit, so the walls run down to y = 0 and every
 *   height is measured from the parvis G = 7.2 m above it (the parvis before
 *   the porch reads 7.3–7.5 m; the west side 6.5, the north 5.2, the east
 *   4.3, so the podium shows there as it really does). terrain.ts check: ok.
 * - Simplified: the scale pattern of the domes is a greyer dome finish; the
 *   gallery arcades are small arched panels; the Sacred Heart statue in the
 *   gable niche is a window panel; the equestrian statues (Joan of Arc and
 *   Saint Louis, bronze) are boxes; the crypt, the north side's sacristies
 *   and the parvis stairs and terraces (ground) are not drawn.
 * - Doubts: the campanile's upper stages and the chevet roofs are read from
 *   one east photo; the north and west sides have no photo here.
 * - Night: stone and domes carry _FLOODLIGHT (floodlit all round); windows
 *   and the porch arches glow.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { qf, tf, save } from './dc-white-house'

/** The parvis and nave floor above y = 0 (see the header: Ground). */
const G = 7.2

const stone = new Part(), dome = new Part(), win = new Part(), bronze = new Part()

type XY = [number, number]
const unit = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }

// ---------------------------------------------------------------------------
// Kit.

/** An axis-aligned box; `top` false leaves the lid off (something stands on it). */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part | false = p, bottom = false) {
  const r: V3[] = [[x0, y0, 0], [x1, y0, 0], [x1, y1, 0], [x0, y1, 0]]
  p.loft([r.map(([x, y]) => [x, y, z0] as V3), r.map(([x, y]) => [x, y, z1] as V3)])
  if (top) top.cap(r.map(([x, y]) => [x, y, z1] as V3), true)
  if (bottom) p.cap(r.map(([x, y]) => [x, y, z0] as V3), false)
}
/** A vertical prism over a convex polygon. */
function prism(p: Part, pts: XY[], z0: number, z1: number, top: Part | false = p) {
  let a = 0
  for (let i = 0; i < pts.length; i++) { const q = pts[i], r = pts[(i + 1) % pts.length]; a += q[0] * r[1] - r[0] * q[1] }
  const c = a > 0 ? pts : [...pts].reverse()
  p.loft([c.map(([x, y]) => [x, y, z0] as V3), c.map(([x, y]) => [x, y, z1] as V3)])
  if (top) top.cap(c.map(([x, y]) => [x, y, z1] as V3), true)
}
/**
 * A surface of revolution about the vertical through (cx, cy): `prof` is
 * [radius, z] from the bottom up, smooth-shaded. A last radius of 0 closes
 * the top; otherwise `cap` closes it flat.
 */
function revolve(p: Part, cx: number, cy: number, prof: [number, number][], seg = 16, cap: Part | false = false, sharp = false) {
  const n = prof.length
  // Profile normals (outward, in the r–z plane), averaged at each vertex.
  const pn = prof.map((_, i) => {
    const a = prof[Math.max(0, i - 1)], b = prof[Math.min(n - 1, i + 1)]
    const dr = b[0] - a[0], dz = b[1] - a[1]
    return [dz, -dr] as [number, number]
  })
  for (let k = 0; k < seg; k++) {
    const t0 = (2 * Math.PI * k) / seg, t1 = (2 * Math.PI * (k + 1)) / seg
    for (let i = 0; i < n - 1; i++) {
      const P = (j: number, t: number): V3 => [cx + prof[j][0] * Math.cos(t), cy + prof[j][0] * Math.sin(t), prof[j][1]]
      const N = (j: number, t: number): V3 => {
        if (sharp) { const dr = prof[i + 1][0] - prof[i][0], dz = prof[i + 1][1] - prof[i][1]; return unit([dz * Math.cos(t), dz * Math.sin(t), -dr]) }
        return unit([pn[j][0] * Math.cos(t), pn[j][0] * Math.sin(t), pn[j][1]])
      }
      const a = P(i, t0), b = P(i, t1), c = P(i + 1, t1), d = P(i + 1, t0)
      if (prof[i + 1][0] < 1e-6) p.tri(a, b, c, undefined, undefined, undefined, [N(i, t0), N(i, t1), N(i + 1, t1)])
      else if (prof[i][0] < 1e-6) p.tri(a, c, d, undefined, undefined, undefined, [N(i, t0), N(i + 1, t1), N(i + 1, t0)])
      else {
        p.tri(a, b, c, undefined, undefined, undefined, [N(i, t0), N(i, t1), N(i + 1, t1)])
        p.tri(a, c, d, undefined, undefined, undefined, [N(i, t0), N(i + 1, t1), N(i + 1, t0)])
      }
    }
  }
  const top = prof[n - 1]
  if (cap && top[0] > 1e-6) {
    const ring: V3[] = Array.from({ length: seg }, (_, k) => [cx + top[0] * Math.cos((2 * Math.PI * k) / seg), cy + top[0] * Math.sin((2 * Math.PI * k) / seg), top[1]])
    cap.cap(ring, true)
  }
}
/** A dome's profile: an ellipse quadrant of base radius R and height H, cut at radius `rTop`. */
function domeProf(R: number, z0: number, H: number, rTop = 0, steps = 6, point = 1): [number, number][] {
  const out: [number, number][] = []
  for (let k = 0; k <= steps; k++) {
    const th = (k / steps) * (Math.PI / 2)
    // `point` > 1 pulls the crown into the slightly pointed Romano-Byzantine curve.
    const r = R * Math.pow(Math.cos(th), 1 / point), z = z0 + H * Math.sin(th)
    if (r <= rTop) { out.push([rTop, z0 + H * Math.sqrt(1 - Math.pow(rTop / R, 2 * point))]); return out }
    out.push([r, z])
  }
  return out
}
/** A gable roof over a box: ridge along y (ns) or along x; ends in `ends`. */
function gable(roof: Part, ends: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, ns: boolean) {
  if (ns) {
    const xm = (x0 + x1) / 2
    qf(roof, [x0, y0, z0], [x0, y1, z0], [xm, y1, z1], [xm, y0, z1], [-(z1 - z0), 0, xm - x0])
    qf(roof, [x1, y0, z0], [x1, y1, z0], [xm, y1, z1], [xm, y0, z1], [z1 - z0, 0, x1 - xm])
    tf(ends, [x0, y0, z0], [x1, y0, z0], [xm, y0, z1], [0, -1, 0])
    tf(ends, [x0, y1, z0], [x1, y1, z0], [xm, y1, z1], [0, 1, 0])
  } else {
    const ym = (y0 + y1) / 2
    qf(roof, [x0, y0, z0], [x1, y0, z0], [x1, ym, z1], [x0, ym, z1], [0, -(z1 - z0), ym - y0])
    qf(roof, [x0, y1, z0], [x1, y1, z0], [x1, ym, z1], [x0, ym, z1], [0, z1 - z0, y1 - ym])
    tf(ends, [x0, y0, z0], [x0, y1, z0], [x0, ym, z1], [-1, 0, 0])
    tf(ends, [x1, y0, z0], [x1, y1, z0], [x1, ym, z1], [1, 0, 0])
  }
}
type Side = 'n' | 's' | 'e' | 'w'
const NRM: Record<Side, V3> = { n: [0, 1, 0], s: [0, -1, 0], e: [1, 0, 0], w: [-1, 0, 0] }
/** A round-headed panel on a wall plane: jambs from z0, semicircle springing at z1 - w/2. */
function arch(p: Part, side: Side, at: number, a: number, w: number, z0: number, z1: number, d = 0.05) {
  const n = NRM[side], ns = side === 'n' || side === 's', off = at + (ns ? n[1] : n[0]) * d
  const Q = (s: number, z: number): V3 => (ns ? [s, off, z] : [off, s, z])
  const r = w / 2, zs = z1 - r
  qf(p, Q(a - r, z0), Q(a + r, z0), Q(a + r, zs), Q(a - r, zs), n)
  const seg = 6
  for (let k = 0; k < seg; k++) {
    const t0 = (Math.PI * k) / seg, t1 = (Math.PI * (k + 1)) / seg
    tf(p, Q(a, zs), Q(a + r * Math.cos(t0), zs + r * Math.sin(t0)), Q(a + r * Math.cos(t1), zs + r * Math.sin(t1)), n)
  }
}
/** A round window (rose) on a wall plane. */
function rose(p: Part, side: Side, at: number, a: number, zc: number, r: number) {
  const n = NRM[side], ns = side === 'n' || side === 's', off = at + (ns ? n[1] : n[0]) * 0.05
  const Q = (s: number, z: number): V3 => (ns ? [s, off, z] : [off, s, z])
  const seg = 12
  for (let k = 0; k < seg; k++) {
    const t0 = (2 * Math.PI * k) / seg, t1 = (2 * Math.PI * (k + 1)) / seg
    tf(p, Q(a, zc), Q(a + r * Math.cos(t0), zc + r * Math.sin(t0)), Q(a + r * Math.cos(t1), zc + r * Math.sin(t1)), n)
  }
}
/** A round-headed panel on a cylinder of radius r, centred at angle t (radians). */
function drumArch(p: Part, cx: number, cy: number, r: number, t: number, w: number, z0: number, z1: number) {
  const n: V3 = [Math.cos(t), Math.sin(t), 0], s: V3 = [-Math.sin(t), Math.cos(t), 0]
  // A flat panel on the tangent plane, just proud of the drum.
  const half = w / 2
  const c: V3 = [cx + n[0] * (r + 0.06), cy + n[1] * (r + 0.06), 0]
  const Q = (u: number, z: number): V3 => [c[0] + s[0] * u, c[1] + s[1] * u, z]
  const zs = z1 - half
  qf(p, Q(-half, z0), Q(half, z0), Q(half, zs), Q(-half, zs), n)
  for (let k = 0; k < 6; k++) {
    const t0 = (Math.PI * k) / 6, t1 = (Math.PI * (k + 1)) / 6
    tf(p, Q(0, zs), Q(half * Math.cos(t0), zs + half * Math.sin(t0)), Q(half * Math.cos(t1), zs + half * Math.sin(t1)), n)
  }
}

// ---------------------------------------------------------------------------
// Plan (OSM way/23762981 and its parts, in the frame; x east of the axis,
// y towards the apse). Heights are above the parvis, G.

// ---- Base: the aisles, transept and crypt podium under everything (OSM 226727327, h 16).
box(stone, -24.9, 24.9, -31.4, 9.6, 0, G + 16)
box(stone, -19.9, 19.9, -36.1, -31.4, 0, G + 16)

// ---- Transept arms (226727340, h 33, gabled), end gables facing east and west.
box(stone, -24.9, 24.9, -21.2, -0.1, G + 16, G + 24, false)
gable(dome, stone, -25.2, 25.2, -21.4, 0.1, G + 24, G + 33, false)
// ---- Nave and choir bay (226727364, h 33, gabled), ridge along the axis.
box(stone, -10.7, 10.7, -38.7, 17.3, G + 16, G + 24, false)
gable(dome, stone, -10.9, 10.9, -38.7, 17.5, G + 24, G + 33, true)

// ---- Porch: three arches under an attic (226727367–369), with the
// equestrian statues' pedestals at its ends (226727351, 226727357).
box(stone, -9.3, 9.3, -44.5, -38.7, 0, G + 9.6, stone)
box(stone, -8.1, 8.1, -44.3, -39.7, G + 9.6, G + 12)
for (const a of [-5.4, 0, 5.4]) arch(win, 's', -44.5, a, 4.0, G, G + 8.0)
for (const sx of [-1, 1]) {
  const x = sx * 8.7
  box(stone, x - 0.7, x + 0.7, -44.9, -40.9, G + 9.6, G + 13.0)
  // Joan of Arc (west) and Saint Louis (east): horse and rider as bold masses.
  const y = -43.1
  box(bronze, x - 0.45, x + 0.45, y - 1.2, y + 1.2, G + 13.0, G + 14.1, bronze)
  box(bronze, x - 0.5, x + 0.5, y - 1.4, y + 1.4, G + 14.1, G + 15.3, bronze)
  box(bronze, x - 0.3, x + 0.3, y - 2.0, y - 1.2, G + 14.8, G + 16.4, bronze) // neck and head, facing south
  box(bronze, x - 0.35, x + 0.35, y - 0.2, y + 0.4, G + 15.3, G + 17.1, bronze) // rider
}
// The façade wall over the porch: a big round-headed window flanked by two
// smaller ones, the gable with the niche of the Sacred Heart above.
arch(win, 's', -38.7, 0, 3.4, G + 13.6, G + 21.8)
for (const sx of [-1, 1]) arch(win, 's', -38.7, sx * 5.6, 2.0, G + 14.2, G + 19.4)
box(stone, -3.0, 3.0, -40.1, -38.7, G + 24, G + 31)
gable(dome, stone, -3.2, 3.2, -40.3, -38.4, G + 31, G + 35.5, true)
arch(win, 's', -40.1, 0, 2.0, G + 25.4, G + 30.2)
// Turrets either side of the gable (226727359/360, domes to 33).
for (const sx of [-1, 1]) {
  revolve(stone, sx * 9.3, -39.8, [[1.25, G + 16], [1.25, G + 28.5]], 10, false, true)
  revolve(dome, sx * 9.3, -39.8, domeProf(1.4, G + 28.5, 3.6, 0, 4, 1.3), 10)
  revolve(stone, sx * 9.3, -39.8, [[1.5, G + 28.2], [1.5, G + 28.6]], 10, false, true)
}
// Rose windows on the aisle fronts either side of the porch.
for (const sx of [-1, 1]) rose(win, 's', -36.1, sx * 14.8, G + 10.6, 1.9)
// Corner turrets at the front corners (226727352/358, domes to 30).
for (const sx of [-1, 1]) {
  revolve(stone, sx * 20.1, -31.2, [[1.3, G + 16], [1.3, G + 25.5]], 10, false, true)
  revolve(dome, sx * 20.1, -31.2, domeProf(1.45, G + 25.5, 4.4, 0, 4, 1.3), 10)
}
// Transept and aisle windows on the east and west fronts.
for (const sx of [-1, 1]) {
  const side: Side = sx < 0 ? 'w' : 'e', at = sx * 24.9
  for (const a of [-16.8, -10.6, -4.4]) arch(win, side, at, a, 3.0, G + 7.0, G + 20.5)
  for (const a of [-27.6, -24.0, 2.9, 6.5]) arch(win, side, at, a, 1.8, G + 6.0, G + 12.5)
}

// ---- The four small domes on square towers at the crossing's corners
// (226727323–326 domes to 46, lanterns 226727333–338 to 53; towers 33).
const small: XY[] = [[-13.8, -24.6], [13.8, -24.6], [-14.4, 2.7], [14.4, 2.7]]
for (const [cx, cy] of small) {
  box(stone, cx - 5.3, cx + 5.3, cy - 5.3, cy + 5.3, G + 16, G + 32.2, false)
  box(stone, cx - 5.6, cx + 5.6, cy - 5.6, cy + 5.6, G + 32.2, G + 33, stone, true)
  // Paired windows on the tower's outer faces.
  const sx = Math.sign(cx), sy = Math.sign(cy + 11)
  for (const d of [-1.4, 1.4]) {
    arch(win, sx < 0 ? 'w' : 'e', cx + sx * 5.3, cy + d, 1.6, G + 25.0, G + 30.6)
    arch(win, sy < 0 ? 's' : 'n', cy + sy * 5.3, cx + d, 1.6, G + 25.0, G + 30.6)
  }
  revolve(stone, cx, cy, [[4.4, G + 33], [4.4, G + 37.2], [4.75, G + 37.2], [4.75, G + 37.9]], 14, false, true)
  for (let k = 0; k < 6; k++) drumArch(win, cx, cy, 4.4, (k * Math.PI) / 3 + Math.PI / 6, 1.2, G + 33.8, G + 36.6)
  revolve(dome, cx, cy, domeProf(4.55, G + 37.9, 7.6, 0.95, 6, 1.35), 14)
  revolve(stone, cx, cy, [[0.95, G + 45.0], [0.95, G + 48.6], [1.2, G + 48.6], [1.2, G + 49.0]], 8, false, true)
  revolve(dome, cx, cy, [...domeProf(1.15, G + 49.0, 2.0, 0.2, 3, 1.3), [0.12, G + 53], [0, G + 53]], 8)
}

// ---- The crossing and the main dome (226727341, dome to 73; lantern
// 226727321 70–83). Square base to the roofs, a drum of tall windows, a
// gallery of small arches, the elongated dome and its colonnaded lantern.
const DX = 0, DY = -11.0
box(stone, -10.6, 10.6, -21.6, -0.4, G + 24, G + 33, stone)
revolve(stone, DX, DY, [[10.2, G + 33], [10.2, G + 47.0], [10.8, G + 47.0], [10.8, G + 48.4], [9.6, G + 48.4], [9.6, G + 53.0], [9.95, G + 53.0], [9.95, G + 53.6]], 20, false, true)
for (let k = 0; k < 12; k++) drumArch(win, DX, DY, 10.2, (k * Math.PI) / 6 + Math.PI / 12, 2.0, G + 37.0, G + 45.2)
for (let k = 0; k < 16; k++) drumArch(win, DX, DY, 9.6, (k * Math.PI) / 8, 1.0, G + 49.4, G + 52.2)
revolve(dome, DX, DY, domeProf(9.5, G + 53.6, 17.4, 2.3, 8, 1.25), 20)
revolve(stone, DX, DY, [[2.3, G + 70.4], [2.3, G + 76.0], [2.75, G + 76.0], [2.75, G + 76.7]], 10, false, true)
for (let k = 0; k < 6; k++) drumArch(win, DX, DY, 2.3, (k * Math.PI) / 3, 0.75, G + 71.2, G + 75.2)
revolve(dome, DX, DY, [...domeProf(2.6, G + 76.7, 3.8, 0.3, 4, 1.3), [0.18, G + 83], [0, G + 83]], 10)

// ---- The apse: ambulatory (226727322, 24) and choir (226727320, 33)
// with its pyramidal roof; the radiating chapels as domed half-rotundas.
const amb: XY[] = [[18.0, 9.6], [18.0, 17.3], [17.9, 25.0], [16.4, 30.0], [11.4, 34.9], [6.6, 37.1], [-6.5, 37.1], [-11.7, 34.8], [-15.6, 30.1], [-17.3, 24.5], [-17.8, 17.3], [-17.8, 9.6]]
prism(stone, amb, G + 16, G + 21, false)
const choir: XY[] = [[10.2, 17.3], [10.2, 20.7], [9.8, 25.2], [8.3, 28.2], [5.4, 30.7], [1.9, 31.6], [-2.1, 31.6], [-5.2, 30.8], [-8.3, 28.6], [-10.1, 25.2], [-10.8, 20.7], [-10.8, 17.3]]
prism(stone, amb, 0, G + 16, false)
// Ambulatory roof: a low slope from its wall up to the choir's wall.
{
  const outer = amb.map(([x, y]) => [x, y, G + 21] as V3)
  const inner = amb.map(([x, y]) => [x * 0.62, 17.3 + (y - 17.3) * 0.72 + 0.3, G + 24.5] as V3)
  dome.loft([outer, inner])
}
prism(stone, choir, G + 21, G + 28, false)
{
  const c = choir.map(([x, y]) => [x, y, G + 28] as V3)
  const t = choir.map(([x, y]) => [x * 0.25, 17.3 + (y - 17.3) * 0.3, G + 33] as V3)
  dome.loft([c, t])
  dome.cap(t, true)
}
const chapels: XY[] = [[-20.2, 22.3], [-16.4, 30.4], [-10.0, 36.0], [10.0, 36.0], [16.4, 30.4], [20.2, 22.3]]
for (const [cx, cy] of chapels) {
  revolve(stone, cx, cy, [[4.2, 0], [4.2, G + 13.5], [4.5, G + 13.5], [4.5, G + 14.2]], 12, false, true)
  revolve(dome, cx, cy, domeProf(4.3, G + 14.2, 3.6, 0, 4, 1), 12)
  const t = Math.atan2(cy - 17, cx)
  for (const d of [-0.42, 0.42]) drumArch(win, cx, cy, 4.2, t + d, 1.4, G + 6.0, G + 11.8)
}
// Small domed turrets at the apse's shoulders (226727346/347).
for (const sx of [-1, 1]) {
  revolve(stone, sx * 20.5, 8.3, [[1.2, G + 16], [1.2, G + 25]], 8, false, true)
  revolve(dome, sx * 20.5, 8.3, domeProf(1.3, G + 25, 4.6, 0, 3, 1.3), 8)
}

// ---- The campanile (226727342 to 64, 226727335 to 80, 226727339 to 84):
// a square shaft with tall paired lights, the belfry with one great arch a
// side, an octagonal stage and the pointed dome with its lantern.
const TY = 43.45
box(stone, -6.55, 6.55, TY - 6.35, TY + 6.35, 0, G + 49.2, false)
box(stone, -6.95, 6.95, TY - 6.75, TY + 6.75, G + 49.2, G + 50.2, stone, true)
box(stone, -6.1, 6.1, TY - 5.9, TY + 5.9, G + 50.2, G + 61.0, false)
box(stone, -6.5, 6.5, TY - 6.3, TY + 6.3, G + 61.0, G + 62.0, stone, true)
for (const [side, at] of [['e', 6.55], ['w', -6.55], ['n', TY + 6.35]] as [Side, number][]) {
  for (const d of [-1.6, 1.6]) arch(win, side, at, (side === 'n' ? 0 : TY) + d, 1.4, G + 22, G + 44)
}
for (const [side, at] of [['e', 6.1], ['w', -6.1], ['n', TY + 5.9], ['s', TY - 5.9]] as [Side, number][]) {
  arch(win, side, at, side === 'n' || side === 's' ? 0 : TY, 4.6, G + 51.5, G + 59.6)
}
revolve(stone, 0, TY, [[4.6, G + 62], [4.6, G + 67.0], [5.0, G + 67.0], [5.0, G + 67.8]], 8, false, true)
for (let k = 0; k < 8; k++) drumArch(win, 0, TY, 4.4, (k * Math.PI) / 4 + Math.PI / 8, 1.3, G + 62.8, G + 66.2)
revolve(dome, 0, TY, domeProf(4.6, G + 67.8, 9.4, 0.9, 5, 1.6), 8)
revolve(stone, 0, TY, [[0.9, G + 76.8], [0.9, G + 79.4]], 6, false, true)
revolve(dome, 0, TY, [[1.05, G + 79.4], [0.6, G + 81.0], [0.12, G + 84.0], [0, G + 84.0]], 6)

const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.3 : 0.9)
console.log({ stone: stone.triangles, dome: dome.triangles, win: win.triangles, bronze: bronze.triangles })
await save('paris-sacre-coeur', 'Basilique du Sacré-Cœur', [
  { part: stone, material: { ...finish('sacre-coeur-stone', 0xf2efe8), floodlight: lit } },
  { part: dome, material: { ...finish('sacre-coeur-dome', 0xd2cfc8), floodlight: (_p, n) => (n[2] > 0.97 ? 0.3 : 0.85) } },
  { part: win, material: PALETTE.window },
  { part: bronze, material: { ...PALETTE.patina, floodlight: () => 0.7 } },
], { bearing: 355.5, osm: 'way/23762981', footprint: [50.4, 95.4], height: G + 84 }, 6500)
