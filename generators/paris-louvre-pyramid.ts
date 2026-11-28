/**
 * Pyramide du Louvre, with its three pyramidions — procedural, CC0-1.0, no
 * textures. bun generators/paris-louvre-pyramid.ts
 *
 * Frame and bearing shared with paris-louvre (20.5°: the Pyramid's sides run
 * at 110.2–110.7° and 20.0–21.1° in OSM). Anchor: the area centroid of
 * way/375076234, lng 2.3358526, lat 48.8610123.
 *
 * Covers and replaces: the Pyramid way/375076234 and the three small
 * pyramids way/53815259 (south), 53815260 (east) and 53815261 (north). The
 * basins and paving round them are ground and are left to the map.
 *
 * Evidence
 * - OSM (measured): way/375076234, height 21.65 m, pyramidal glass roof,
 *   outline 36.4–37.0 m a side (cadastre, likely including the sill); the
 *   pyramidions' outlines, 7.9 m a side, turned 45° to the Pyramid, height 5.
 * - Published: 21.65 m high, 35.42 m a side (fr.wikipedia "Pyramide du
 *   Louvre", as given in the batch brief; en.wikipedia rounds to 21.6 m and
 *   34 m); 603 rhombic and 70 triangular panes, the rhombi set by lines
 *   parallel to the faces' hips. The base is drawn 35.42 m, centred on the
 *   OSM outline.
 * - Photos (Wikimedia Commons):
 *   · "Cour Napoléon seen from the pavillon de l'Horloge, Louvre 8 July
 *     2016.jpg", Tangopaso, public domain — the east face by day, the
 *     lattice, the pyramidions turned 45°.
 *     https://commons.wikimedia.org/wiki/File:Cour_Napol%C3%A9on_seen_from_the_pavillon_de_l%27Horloge,_Louvre_8_July_2016.jpg
 *   · "Louvre Museum Wikimedia Commons.jpg", Benh LIEU SONG, CC BY-SA 3.0 —
 *     the west face at dusk: lit from inside, the lattice dark against it,
 *     the entrance portal at the foot of the west face.
 *     https://commons.wikimedia.org/wiki/File:Louvre_Museum_Wikimedia_Commons.jpg
 * - Drawn: translucent faces (seeing through is the identity), steel hips
 *   and sills 0.7 m (thicker than the real ~0.3 m so they read), a lattice of
 *   7 bars a way per face (real: 17), the entrance portal; through the glass
 *   the stone balustrade round the opening over the Hall Napoléon and the
 *   lift's round platform (positions estimated).
 * - Night: the faces are `window-2` (pale glass blue by day, translucent),
 *   so the map glows them warm at night as the Pyramid is lit from inside,
 *   with the lattice dark across it, as in the dusk photo. This is a
 *   deliberate exception to "glass stays dark".
 * - Elevation +8.8 m: Mapterhorn reads the Hall Napoléon's floor through the
 *   glass, an 8.8 m pit exactly under the Pyramid (court at 33.9 m, pit floor
 *   25.1 m). The map's fill only lowers ground, so at elevation 0 the model
 *   would stand at the pit's floor with the court burying it. The real base
 *   is the court; +8.8 sets it there (terrain.ts check passes).
 */
import { Part, type V3, sub, cross, len } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { qf, tf, save } from './dc-white-house'

const glass = new Part(), steel = new Part(), stone = new Part(), door = new Part()

const norm = (v: V3): V3 => { const l = len(v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]
const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]

/** A square-section bar from a to b, `w` wide, its faces turned square to `up`. */
function bar(p: Part, a: V3, b: V3, w: number, up: V3) {
  const d = norm(sub(b, a)), s = norm(cross(d, up)), u = norm(cross(s, d))
  const h = w / 2
  const corner = (o: V3, i: number): V3 => add(add(o, s, (i === 0 || i === 3 ? -h : h)), u, (i < 2 ? -h : h))
  const A = [0, 1, 2, 3].map((i) => corner(a, i)), B = [0, 1, 2, 3].map((i) => corner(b, i))
  // Four sides, each turned to face away from the bar's axis.
  const mids = [0, 1, 2, 3].map((i) => {
    const j = (i + 1) % 4
    return norm(sub(lerp3(A[i], A[j], 0.5), a))
  })
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    qf(p, A[i], A[j], B[j], B[i], mids[i])
  }
}

/**
 * One glass pyramid: four translucent faces, steel hips and base, and on
 * each face a coarse lattice of bars parallel to its two hips (the real
 * rhombus glazing, 18 panes a side, drawn at `grid` lines a side).
 */
function pyramid(cx: number, cy: number, half: number, h: number, turn: number, o: { hip: number; rib: number; grid: number; entrance?: boolean }) {
  const c = Math.cos(turn), s = Math.sin(turn)
  const R = (x: number, y: number, z: number): V3 => [cx + x * c - y * s, cy + x * s + y * c, z]
  const base = [R(-half, -half, 0), R(half, -half, 0), R(half, half, 0), R(-half, half, 0)]
  const apex = R(0, 0, h)
  for (let i = 0; i < 4; i++) {
    const a = base[i], b = base[(i + 1) % 4]
    const n = norm(cross(sub(b, a), sub(apex, a)))
    // Glass, both ways round: the material is double-sided but the map culls
    // by winding, so the inside face is written too.
    tf(glass, a, b, apex, n)
    // Lattice: bars parallel to each hip, set just proud of the glass on
    // both sides so they read from outside and through the far faces.
    for (let k = 1; k < o.grid; k++) {
      const t = k / o.grid
      // Parallel to the hip a→apex, from a point on the base to a point on the hip b→apex.
      const p0 = lerp3(a, b, t), p1 = lerp3(b, apex, 1 - t)
      const q0 = lerp3(b, a, t), q1 = lerp3(a, apex, 1 - t)
      // Each bar starts a little up the face so its corners stay above y = 0.
      for (const [u, v] of [[p0, p1], [q0, q1]] as [V3, V3][]) rib(lerp3(u, v, o.rib / len(sub(v, u))), v, n, o.rib)
    }
    // Steel: the base sill and the hip.
    bar(steel, add(a, [0, 0, 1], o.hip / 2), add(b, [0, 0, 1], o.hip / 2), o.hip, [0, 0, 1])
    // The hip starts half a bar up, so its foot stands on y = 0.
    bar(steel, lerp3(a, apex, (o.hip / 2) / h), apex, o.hip, n)
  }
  if (o.entrance) {
    // The main entrance in the west face: a low glazed portal at the foot of
    // the face, framed in steel.
    const a = base[3], b = base[0]
    const n = norm(cross(sub(b, a), sub(apex, a)))
    const m = lerp3(a, b, 0.5), along = norm(sub(b, a))
    const up = norm(sub(apex, m))
    const w = 4.6, hh = 4.2 / Math.sin(Math.atan2(h, half)) // portal height 4.2 m measured up the face
    const P = (x: number, y: number) => add(add(add(m, along, x), up, y), n, 0.08)
    qf(door, P(-w, 0), P(w, 0), P(w, hh), P(-w, hh), n)
    bar(steel, P(-w - 0.2, hh), P(w + 0.2, hh), 0.5, n)
  }
}
/** A flat strip lying on a face, written on both sides. */
function rib(a: V3, b: V3, n: V3, w: number) {
  const d = norm(sub(b, a)), s = norm(cross(n, d))
  for (const sg of [1, -1]) {
    const off = 0.05 * sg
    const A = add(add(a, s, -w / 2), n, off), B = add(add(a, s, w / 2), n, off)
    const C = add(add(b, s, w / 2), n, off), D = add(add(b, s, -w / 2), n, off)
    qf(steel, A, B, C, D, [n[0] * sg, n[1] * sg, n[2] * sg])
  }
}

// ---- The Pyramid: 35.42 m square, 21.65 m high, axis-parallel in the frame.
const PX = 0.13, PY = 0.0
pyramid(PX, PY, 35.42 / 2, 21.65, 0, { hip: 0.7, rib: 0.3, grid: 8, entrance: true })
// ---- The three pyramidions (OSM: 7.9 m bases, 5 m high, turned 45°).
pyramid(0.23, -45.32, 7.9 / 2, 5, Math.PI / 4, { hip: 0.35, rib: 0.18, grid: 2 })
pyramid(46.14, -0.1, 7.9 / 2, 5, Math.PI / 4, { hip: 0.35, rib: 0.18, grid: 2 })
pyramid(0.68, 45.31, 7.9 / 2, 5, Math.PI / 4, { hip: 0.35, rib: 0.18, grid: 2 })

// ---- Seen through the glass: the stone balustrade round the opening over
// the Hall Napoléon and the top of the spiral stair's well, in the middle.
{
  const r = 6.0, seg = 16
  for (let k = 0; k < seg; k++) {
    const a0 = (2 * Math.PI * k) / seg, a1 = (2 * Math.PI * (k + 1)) / seg
    const o0: V3 = [PX + r * Math.cos(a0), PY + r * Math.sin(a0), 0], o1: V3 = [PX + r * Math.cos(a1), PY + r * Math.sin(a1), 0]
    const t0: V3 = [o0[0], o0[1], 1.1], t1: V3 = [o1[0], o1[1], 1.1]
    const n: V3 = [Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2), 0]
    qf(stone, o0, o1, t1, t0, n)
    qf(stone, o0, o1, t1, t0, [-n[0], -n[1], 0])
  }
  // The lift's round platform in the middle of the stair.
  for (let k = 0; k < 12; k++) {
    const a0 = (2 * Math.PI * k) / 12, a1 = (2 * Math.PI * (k + 1)) / 12
    tf(stone, [PX, PY, 0.5], [PX + 2.2 * Math.cos(a0), PY + 2.2 * Math.sin(a0), 0.5], [PX + 2.2 * Math.cos(a1), PY + 2.2 * Math.sin(a1), 0.5], [0, 0, 1])
  }
}

console.log({ glass: glass.triangles, steel: steel.triangles, stone: stone.triangles, door: door.triangles })
await save('paris-louvre-pyramid', 'Pyramide du Louvre', [
  { part: glass, material: { ...windowVariant(2, 0x9cc7dc), roughness: 0.2, opacity: 0.32, doubleSided: true } },
  { part: steel, material: { ...finish('pyramid-steel', 0x8b939b, 0.5), floodlight: () => 0.25 } },
  { part: stone, material: { ...PALETTE.stone, floodlight: () => 0.6 } },
  { part: door, material: PALETTE.entrance },
], { bearing: 20.5, osm: 'way/375076234', footprint: [35.42, 35.42], height: 21.65 }, 5000)
