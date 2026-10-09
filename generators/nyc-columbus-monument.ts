/**
 * Columbus Monument, Columbus Circle, Manhattan (Gaetano Russo, 1892) —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-columbus-monument.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 29.4°, the Manhattan grid, which the pedestal follows (the edges
 * of OSM way/259888097). Model −y is the pedestal's front, toward Eighth
 * Avenue (SSW), where the marble angel sits; Columbus faces that way too.
 * The rostra (ships' prows) project from the column's ±x sides, the anchors
 * sit on its ±y faces. Anchor: the centroid of the OSM outline way/608947452
 * (historic=monument, building=yes), which this model replaces with its
 * six stacked building:parts (way/259888095–259888101).
 *
 * Evidence
 * - Published (Wikipedia, NRHP 2018): 76 ft (23 m) overall; a 14 ft (4.3 m)
 *   marble statue on a granite rostral column, four-stepped granite
 *   pedestal; bronze galley prows for the three ships; marble angel holding
 *   a globe on the pedestal.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 0.5 m, /tmp/city/nyc/lidar.py.
 *   Plaza 24.65 m NAVD88 (y = 0); steps up to ~1.35 m; lower pedestal top
 *   ~3.8 m over a ~4 m square; die and its cornice ~7.8 m; capital/abacus
 *   ~17.6 m over ~2.2 m; statue's head 23.1 m above the plaza.
 * - OSM building:parts give the plan: steps 11.2 / 9.2 / 6.9 m across
 *   (elongated octagons), lower pedestal 3.95 m square with cut corners,
 *   die 2.7 m, column plinth 1.7 m, shaft ~1.2 m.
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-columbus-monument/photos/credits.txt: Mike Peel
 *   (CC BY-SA 4.0, the whole monument from the SSW front), Daderot (CC0,
 *   statue close-up; from the south-east; column side with the prows),
 *   Acediscovery (CC BY 4.0, the angel), Juliette2020 (CC BY-SA 4.0, aerial),
 *   McKay Savage (CC BY 2.0, from the Time Warner Center) — the last two fix
 *   the angel on the SSW face and the prows on the WNW/ESE sides.
 *
 * Estimated from the photos against the lidar heights: the split of the
 * pedestal into lower block / die / cornices, the column's mouldings, the
 * prows' size (~0.85 m out from the shaft, ~0.5 m tall) and tier heights
 * (10.9, 12.7, 14.5 m), the figures' poses. The bronze palmette crest, the
 * relief panels' content and the inscription are left out; the relief
 * panels are flat bronze plates. The fountain basin around the plaza is the
 * map's (water and paving are not modelled).
 */
import { Part, addGltfTriangles, cross, sub, len, type V3 } from './mesh'
import { finishModel, prism, chamferRect, capPoly, type XY } from './nyc-570-lexington'

// ===========================================================================
// A small sculpture kit, shared by the Columbus Circle / Grand Army Plaza
// monuments (imported by nyc-uss-maine-monument, nyc-sherman-monument and
// nyc-pulitzer-fountain).
// ===========================================================================

export const TAU = Math.PI * 2
export const unit = (v: V3): V3 => v.map(n => n / (len(v) || 1)) as V3
export const add = (a: V3, b: V3): V3 => a.map((n, i) => n + b[i]) as V3
export const mul = (a: V3, s: number): V3 => a.map(n => n * s) as V3
export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** Build into a scratch part, then copy it into `p` smooth-shaded within `crease` degrees. */
export function smooth(p: Part, build: (q: Part) => void, crease = 55) {
  const q = new Part(); build(q)
  addGltfTriangles(p, new Float32Array(q.pos), Uint32Array.from({ length: q.pos.length / 3 }, (_, i) => i), { creaseDegrees: crease })
}
/** A closed solid from rings (same count, counter-clockwise from above), both ends capped. */
export function solid(p: Part, rings: V3[][]) {
  p.loft(rings); p.cap(rings[0], false); p.cap(rings[rings.length - 1], true)
}
/** A quad wound so its normal points away from `inside`. */
export function face(p: Part, a: V3, b: V3, c: V3, d: V3, inside: V3) {
  const n = cross(sub(b, a), sub(c, a))
  const centre = mul(add(add(a, b), add(c, d)), 0.25)
  if (dot(n, sub(centre, inside)) >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}
/** An ellipsoid, optionally rotated about z by `yaw` and tilted about the local y by `pitch`. */
export function ellipsoid(p: Part, c: V3, r: V3, n = 10, rows = 5, yaw = 0, pitch = 0) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch)
  const pt = (a: number, t: number): V3 => {
    let x = r[0] * Math.cos(t) * Math.cos(a), y = r[1] * Math.cos(t) * Math.sin(a), z = r[2] * Math.sin(t)
    ;[x, z] = [x * cp - z * sp, x * sp + z * cp]
    return [c[0] + x * cy - y * sy, c[1] + x * sy + y * cy, c[2] + z]
  }
  for (let j = 0; j < rows; j++) for (let i = 0; i < n; i++) {
    const a0 = i * TAU / n, a1 = (i + 1) * TAU / n, lo = -Math.PI / 2 + j * Math.PI / rows, hi = lo + Math.PI / rows
    const v0 = pt(a0, lo), v1 = pt(a1, lo), v2 = pt(a1, hi), v3 = pt(a0, hi)
    if (j > 0) p.tri(v0, v1, v2)
    if (j < rows - 1) p.tri(v0, v2, v3)
  }
}
/** A tube of `sides` along a path with per-point radii, capped. */
export function tube(p: Part, path: V3[], radii: number[], sides = 6) {
  solid(p, path.map((c, i) => {
    const axis = unit(sub(path[Math.min(i + 1, path.length - 1)], path[Math.max(0, i - 1)]))
    const u = unit(cross(Math.abs(axis[2]) > 0.9 ? [0, 1, 0] : [0, 0, 1], axis)), v = cross(axis, u)
    return Array.from({ length: sides }, (_, j) => add(c, add(mul(u, radii[i] * Math.cos(j * TAU / sides)), mul(v, radii[i] * Math.sin(j * TAU / sides)))))
  }))
}
/** A thick flat plate with a convex outline (u, v) in the plane spanned by U and V at `o`. */
export function slab(p: Part, o: V3, U: V3, V: V3, outline: [number, number][], thick: number) {
  const W = mul(unit(cross(U, V)), thick / 2)
  const at = ([u, v]: [number, number], s: number) => add(add(o, add(mul(U, u), mul(V, v))), mul(W, s))
  let pts = outline
  // Keep the outline counter-clockwise about +W so the caps face out.
  let area = 0
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; area += a[0] * b[1] - b[0] * a[1] }
  if (area < 0) pts = [...pts].reverse()
  const back = pts.map(q => at(q, -1)), front = pts.map(q => at(q, 1))
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length
    p.quad(back[i], back[j], front[j], front[i])
  }
  for (let i = 1; i < pts.length - 1; i++) { p.tri(front[0], front[i], front[i + 1]); p.tri(back[0], back[i + 1], back[i]) }
}
/** A lathe about the vertical axis through (cx, cy): profile [radius, z] bottom to top, top capped. */
export function lathe(p: Part, profile: [number, number][], n = 16, cx = 0, cy = 0, capTop = true) {
  const rings = profile.map(([r, z]) => Array.from({ length: n }, (_, i): V3 => [cx + r * Math.cos(i * TAU / n), cy + r * Math.sin(i * TAU / n), z]))
  p.loft(rings)
  if (capTop) p.cap(rings[rings.length - 1], true)
}
/**
 * A bevelled block: rectangle with chamfered vertical corners `c`, walls from
 * z0 to z1 and a soft rounded top edge `b`.
 */
export function block(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, c = 0.2, b = 0.12) {
  prism({ wall: p, win: null, roof: p, ring: chamferRect(x0, y0, x1, y1, c), z0, z1, facade: null, bevel: b })
}
/** A flat plate on a wall: rectangle u0..u1 × z0..z1 on the plane y = `y` (facing −y if `y` < 0). */
export function plate(p: Part, x0: number, x1: number, z0: number, z1: number, y: number, out: 1 | -1, depth = 0.05) {
  const yy = y + out * depth
  face(p, [x0, yy, z0], [x1, yy, z0], [x1, yy, z1], [x0, yy, z1], [0, y - out, (z0 + z1) / 2])
}
/** Rotate everything added to `p` since `from` about the vertical axis through (cx, cy). */
export function turnSince(p: Part, from: number, ang: number, cx = 0, cy = 0) {
  const c = Math.cos(ang), s = Math.sin(ang)
  // Part stores glTF (x, z, -y).
  for (let k = from; k < p.pos.length; k += 3) {
    const x = p.pos[k] - cx, y = -p.pos[k + 2] - cy
    p.pos[k] = cx + x * c - y * s; p.pos[k + 2] = -(cy + x * s + y * c)
    const nx = p.nrm[k], ny = -p.nrm[k + 2]
    p.nrm[k] = nx * c - ny * s; p.nrm[k + 2] = -(nx * s + ny * c)
  }
}
/** Mirror what was added to `p` since `from` across x = 0, as new triangles. */
export function mirrorXSince(p: Part, from: number) {
  const end = p.pos.length
  for (let k = from; k < end; k += 9) {
    const v = [0, 1, 2].map(j => [-p.pos[k + j * 3], -p.pos[k + j * 3 + 2], p.pos[k + j * 3 + 1]] as V3)
    const n = [0, 1, 2].map(j => [-p.nrm[k + j * 3], -p.nrm[k + j * 3 + 2], p.nrm[k + j * 3 + 1]] as V3)
    p.tri(v[2], v[1], v[0], undefined, undefined, undefined, [n[2], n[1], n[0]])
  }
}

/**
 * A standing robed man facing −y, feet at `c`, `h` tall to the top of the
 * head. Used for Columbus; arms are passed as paths from the shoulders.
 */
export function standingFigure(p: Part, c: V3, h: number, o: { arms: V3[][]; cloak?: boolean; hat?: boolean }) {
  const at = (x: number, y: number, z: number): V3 => [c[0] + x * h, c[1] + y * h, c[2] + z * h]
  const ring = (z: number, rx: number, ry: number, dy = 0, n = 10) => Array.from({ length: n }, (_, i): V3 =>
    at(rx * Math.cos(i * TAU / n), dy + ry * Math.sin(i * TAU / n), z))
  // Legs (hose) from the feet to under the tunic.
  for (const s of [-1, 1]) tube(p, [at(s * 0.055, -0.01, 0.0), at(s * 0.055, 0, 0.26), at(s * 0.06, 0, 0.42)], [0.045 * h, 0.042 * h, 0.05 * h], 6)
  // Feet.
  for (const s of [-1, 1]) ellipsoid(p, at(s * 0.06, -0.04, 0.02), [0.04 * h, 0.08 * h, 0.03 * h], 6, 3)
  // Tunic skirt and torso, one loft from the hem to the neck.
  solid(p, [ring(0.36, 0.15, 0.12), ring(0.5, 0.13, 0.1), ring(0.58, 0.115, 0.085), ring(0.7, 0.13, 0.085), ring(0.79, 0.15, 0.09), ring(0.83, 0.12, 0.08), ring(0.86, 0.045, 0.045)])
  // Head and cap.
  ellipsoid(p, at(0, -0.01, 0.915), [0.055 * h, 0.06 * h, 0.07 * h], 8, 4)
  if (o.hat) solid(p, [ring(0.94, 0.07, 0.07, -0.005, 8), ring(0.985, 0.068, 0.068, -0.005, 8), ring(1.0, 0.05, 0.05, -0.005, 8)])
  // A heavy cloak hanging from the shoulders behind, to just above the ankles.
  if (o.cloak) {
    solid(p, [ring(0.1, 0.19, 0.06, 0.1), ring(0.4, 0.18, 0.07, 0.1), ring(0.65, 0.17, 0.065, 0.085), ring(0.8, 0.165, 0.06, 0.07), ring(0.85, 0.11, 0.05, 0.06)])
  }
  for (const arm of o.arms) tube(p, arm, [0.045 * h, 0.04 * h, 0.034 * h, 0.03 * h].slice(0, arm.length), 6)
}

// ===========================================================================
// The Columbus Monument
// ===========================================================================

function build() {
  const granite = new Part(), steps = new Part(), marble = new Part(), bronze = new Part()

  // --- Steps: three elongated octagons (OSM parts), the lowest the outline. ---
  const oct = (h: number, c: number): XY[] => chamferRect(-h, -h, h, h, c)
  prism({ wall: steps, win: null, roof: steps, ring: oct(5.6, 2.25), z0: 0, z1: 0.45, facade: null, bevel: 0.1 })
  prism({ wall: steps, win: null, roof: steps, ring: oct(4.6, 1.75), z0: 0.45, z1: 0.9, facade: null, bevel: 0.1 })
  prism({ wall: steps, win: null, roof: steps, ring: oct(3.45, 0.95), z0: 0.9, z1: 1.35, facade: null, bevel: 0.1 })

  // --- Lower pedestal: base course, body with cut corners, cornice. ---
  const L = 1.98
  block(granite, -2.08, -2.08, 2.08, 2.08, 1.35, 1.7, 0.55, 0.08)
  block(granite, -L, -L, L, L, 1.7, 3.35, 0.5, 0.05)
  block(granite, -2.12, -2.12, 2.12, 2.12, 3.35, 3.8, 0.56, 0.14)
  // Bronze relief panels on the front and back, a plaque on each side.
  for (const s of [-1, 1] as const) {
    plate(bronze, -1.05, 1.05, 2.05, 2.95, s * L, s, 0.05)
  }
  {
    const from = bronze.pos.length
    // Side panels: plates on the x faces, as the front ones turned a quarter.
    for (const s of [-1, 1] as const) plate(bronze, -0.75, 0.75, 2.1, 2.9, s * L, s, 0.04)
    turnSince(bronze, from, Math.PI / 2)
  }

  // --- Die: the angel's block, then its cornice. ---
  const D = 1.35
  block(granite, -1.48, -1.48, 1.48, 1.48, 3.8, 4.15, 0.3, 0.08)
  block(granite, -D, -D, D, D, 4.15, 6.95, 0.12, 0.05)
  block(granite, -1.58, -1.58, 1.58, 1.58, 6.95, 7.4, 0.3, 0.14)
  // The bronze palmette crest along the cornice, read as a dark band.
  prism({ wall: bronze, win: null, roof: null, ring: chamferRect(-1.46, -1.46, 1.46, 1.46, 0.26), z0: 7.4, z1: 7.55, facade: null, bevel: 0 })
  // Column plinth.
  block(granite, -0.86, -0.86, 0.86, 0.86, 7.4, 7.9, 0.1, 0.1)

  // --- Column: base mouldings, tapering shaft, capital, abacus. ---
  smooth(granite, q => lathe(q, [[0.78, 7.9], [0.78, 8.05], [0.7, 8.22], [0.63, 8.32], [0.62, 8.5], [0.555, 16.5], [0.6, 16.62], [0.6, 16.72], [0.68, 16.85], [0.82, 17.05]], 16), 50)
  block(granite, -1.08, -1.08, 1.08, 1.08, 17.05, 17.55, 0.08, 0.12)
  // Drum under the statue, with its moulded top.
  smooth(granite, q => lathe(q, [[0.52, 17.55], [0.52, 18.2], [0.6, 18.3], [0.6, 18.42], [0.7, 18.55], [0.7, 18.7]], 16), 50)

  // --- Rostra: three tiers of galley prows on the column's ±x sides. ---
  for (const z of [10.9, 12.7, 14.5]) for (const s of [-1, 1]) prow(bronze, s, z)

  // --- Anchors: flat bronze anchors on the ±y faces of the shaft, between the prows. ---
  for (const s of [-1, 1]) for (const z of [11.0, 14.2]) anchor(bronze, s, z)

  // --- Columbus: marble, 4.3 m, facing −y; left hand on the hip, the right
  // arm down at his side resting on a tiller; a long fur-collared cloak. ---
  {
    const zb = 18.7
    smooth(marble, q => lathe(q, [[0.62, zb], [0.62, zb + 0.22]], 12), 40)
    const z0 = zb + 0.22, h = 4.1
    const P = (x: number, y: number, z: number): V3 => [x * h, y * h, z0 + z * h]
    smooth(marble, q => {
      standingFigure(q, [0, 0, z0], h, {
        cloak: true, hat: true, arms: [
          // His left (+x) hand on the hip, elbow out.
          [P(0.15, 0, 0.8), P(0.235, 0.0, 0.66), P(0.16, -0.035, 0.6), P(0.12, -0.04, 0.6)],
          // His right (−x) arm hanging down, the hand on the tiller at his side.
          [P(-0.15, 0, 0.8), P(-0.19, -0.01, 0.65), P(-0.19, -0.03, 0.52), P(-0.18, -0.04, 0.47)],
        ],
      })
      // The cloak's fur collar, broad over both shoulders.
      tube(q, [P(-0.17, 0.0, 0.81), P(0, -0.03, 0.84), P(0.17, 0.0, 0.81)], [0.04 * h, 0.05 * h, 0.04 * h], 6)
      // The coil of rope by his left foot, behind.
      ellipsoid(q, P(0.12, 0.07, 0.06), [0.09 * h, 0.08 * h, 0.07 * h], 8, 4)
      // The cloak falls over his right shoulder to the ankle, in front of that side.
      tube(q, [P(-0.15, -0.02, 0.82), P(-0.18, -0.045, 0.5), P(-0.16, -0.04, 0.16)], [0.05 * h, 0.06 * h, 0.06 * h], 8)
    }, 60)
  }

  // --- The angel with the globe, on the front (−y) of the die, seated on
  // the lower pedestal's cornice, leaning over the globe on his left (+x). ---
  smooth(marble, q => {
    const zs = 3.8, yc = -D - 0.36
    const ell = (x: number, y: number, z: number, rx: number, ry: number, n = 12) => Array.from({ length: n }, (_, i): V3 =>
      [x + rx * Math.cos(i * TAU / n), y + ry * Math.sin(i * TAU / n), z])
    // Drapery over the seat and legs: broad at the cornice, gathering at the lap;
    // its front leans out to the knees.
    solid(q, [ell(0.05, yc - 0.02, zs, 0.85, 0.36), ell(0.05, yc - 0.1, zs + 0.7, 0.78, 0.4), ell(0.02, yc - 0.12, zs + 1.15, 0.62, 0.38), ell(0, yc + 0.02, zs + 1.45, 0.42, 0.26)])
    // Torso leaning forward and to his left, then the bowed head.
    tube(q, [[-0.05, yc + 0.02, zs + 1.3], [0.02, yc - 0.1, zs + 1.9], [0.1, yc - 0.22, zs + 2.35]], [0.38, 0.36, 0.3], 10)
    ellipsoid(q, [0.15, yc - 0.32, zs + 2.7], [0.24, 0.24, 0.27], 10, 5)
    // His right arm hanging down by the knee, his left hand on the globe.
    tube(q, [[-0.3, yc - 0.12, zs + 2.25], [-0.45, yc - 0.3, zs + 1.7], [-0.46, yc - 0.42, zs + 1.2]], [0.11, 0.1, 0.09], 6)
    tube(q, [[0.33, yc - 0.15, zs + 2.3], [0.52, yc - 0.3, zs + 2.25], [0.6, yc - 0.34, zs + 2.12]], [0.11, 0.1, 0.09], 6)
    // The globe on its stand, beside him on the drapery.
    tube(q, [[0.62, yc - 0.3, zs + 0.9], [0.62, yc - 0.3, zs + 1.5]], [0.09, 0.11], 6)
    ellipsoid(q, [0.62, yc - 0.3, zs + 1.8], [0.36, 0.36, 0.36], 12, 6)
    // Wings: his right one raised high behind his head, his left one swept
    // out level behind the globe, both just off the die face.
    slab(q, [-0.2, -D - 0.2, zs + 2.25], [-Math.cos(0.4), -Math.sin(0.4), 0], [0, 0, 1],
      [[0, -1.5], [0.35, -1.6], [0.7, -0.8], [0.85, 0.2], [0.68, 0.85], [0.25, 0.92], [0, 0.5]], 0.2)
    slab(q, [0.2, -D - 0.16, zs + 2.25], [Math.cos(0.25), -Math.sin(0.25), 0], [0, 0, 1],
      [[0, -0.55], [0.6, -0.35], [1.25, -0.05], [1.3, 0.12], [0.9, 0.38], [0.3, 0.5], [0, 0.35]], 0.2)
  }, 60)

  finishModel('Columbus Monument', 'nyc-columbus-monument', [
    { part: granite, material: { name: 'granite', color: 0xddd2c1, roughness: 0.85 } },
    { part: steps, material: { name: 'granite-steps', color: 0xd9d4ca, roughness: 0.85 } },
    { part: marble, material: { name: 'marble', color: 0xf4f0e8, roughness: 0.7 } },
    { part: bronze, material: { name: 'bronze', color: 0x55635b, roughness: 0.75 } },
  ], { bearing: 29.4, osm: 'way/608947452', height: 23.1 }, 6500)
}

/** A bronze galley prow on the column's `s` side (±x) at height z: hull, ram and curled stem. */
function prow(p: Part, s: number, z: number) {
  smooth(p, q => {
    // Hull sections from the shaft outward: [x out, half-width, keel z, gunwale z].
    const secs: [number, number, number, number][] = [[0.45, 0.28, -0.22, 0.14], [0.68, 0.26, -0.22, 0.16], [0.9, 0.19, -0.18, 0.18], [1.08, 0.1, -0.09, 0.2], [1.16, 0.03, 0.0, 0.22]]
    const rings = secs.map(([x, w, k, g]) => [[x, -w, g], [x, -w * 0.9, (k + g) / 2], [x, 0, k], [x, w * 0.9, (k + g) / 2], [x, w, g], [x, 0, g + 0.02]].map(([a, b, c]) => [s * a, b, z + c] as V3))
    solid(q, s > 0 ? rings : rings.map(r => [...r].reverse()))
    // The ram at the waterline and the stem curling up and back.
    tube(q, [[s * 1.0, 0, z - 0.11], [s * 1.32, 0, z - 0.09]], [0.07, 0.04], 5)
    tube(q, [[s * 1.14, 0, z + 0.18], [s * 1.24, 0, z + 0.42], [s * 1.12, 0, z + 0.58]], [0.07, 0.06, 0.05], 5)
  }, 60)
}

/** A flat bronze anchor on the shaft's ±y face, crown down, centred at height z. */
function anchor(p: Part, s: number, z: number) {
  // Each corner sits 0.04 m off the tapering shaft (radius ~0.57 m here), so the anchor wraps it.
  const Y = (x: number) => s * (Math.sqrt(0.575 ** 2 - x * x) + 0.04)
  const bar = (x0: number, z0: number, x1: number, z1: number, w: number) => {
    const L = Math.hypot(x1 - x0, z1 - z0), nx = -(z1 - z0) / L * w / 2, nz = (x1 - x0) / L * w / 2
    face(p, [x0 + nx, Y(x0 + nx), z0 + nz], [x1 + nx, Y(x1 + nx), z1 + nz], [x1 - nx, Y(x1 - nx), z1 - nz], [x0 - nx, Y(x0 - nx), z0 - nz], [0, 0, z])
  }
  bar(0, z - 0.6, 0, z + 0.55, 0.11)
  bar(-0.26, z + 0.42, 0.26, z + 0.42, 0.09)
  for (const k of [-1, 1]) {
    bar(0, z - 0.6, k * 0.24, z - 0.5, 0.1)
    bar(k * 0.24, z - 0.5, k * 0.32, z - 0.25, 0.1)
  }
}

if (import.meta.main) build()
