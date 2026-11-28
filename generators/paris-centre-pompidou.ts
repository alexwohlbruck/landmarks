/**
 * Centre Pompidou (Centre national d'art et de culture Georges-Pompidou) —
 * procedural, CC0-1.0, no textures. bun generators/paris-centre-pompidou.ts
 *
 * Frame: y along the building (bearing 19.8°), x across it, the piazza on
 * the west (x < 0) and the rue du Renard on the east. Anchor: the area
 * centroid of way/55503397, lng 2.3524396, lat 48.8605305. Uses the kit
 * exported by paris-sacre-coeur.ts.
 *
 * Modelled as it stood before the closure for renovation (2025–2030): the
 * 2026 photo below shows it wrapped in scaffolding, with the frame,
 * escalator and red roof box unchanged under it.
 *
 * Covers and replaces: way/55503397 (building=civic, height 42) and the six
 * small building=yes ways against the rue du Renard front at its two ends
 * (55507596, 55507597, 55507609 north; 55507607, 55507608, 55507613 south),
 * drawn as the white ventilation stacks that stand there (photo below).
 * The big white funnels at the west edge of the piazza, 60–70 m away by
 * the rue Saint-Martin, stand apart, are not mapped in OSM and are not
 * drawn; the Atelier Brancusi, IRCAM and the piazza's kiosks are separate.
 *
 * Evidence
 * - OSM (measured): outline 61.5 × 167.3 m, height 42.
 * - Published: Renzo Piano, Richard Rogers and Gianfranco Franchini, 1971–77;
 *   166 × 60 m, 42 m, 14 frames of 12.8 m, 48 m clear span between the
 *   column lines with 6 m gerberette zones each side; the services' colour
 *   code (blue air, green water, yellow electricity, red circulation)
 *   (fr.wikipedia "Centre Pompidou").
 * - Photos (Wikimedia Commons):
 *   · "Centre Georges-Pompidou - panoramio (14).jpg", bynyalcin, CC BY 3.0 —
 *     the piazza front: white frame and bracing, the escalator in its glass
 *     tube on the red truss, the red box on the roof.
 *     https://commons.wikimedia.org/wiki/File:Centre_Georges-Pompidou_-_panoramio_(14).jpg
 *   · "Centre Pompidou - panoramio - mayatomo.jpg", mayatomo, CC BY-SA 3.0 —
 *     the rue du Renard front: the big blue ducts, green and yellow pipes,
 *     red lift towers, the white ventilation stacks at the north end.
 *     https://commons.wikimedia.org/wiki/File:Centre_Pompidou_-_panoramio_-_mayatomo.jpg
 *   · "Paris Montmartre Blick aufs Centre Georges-Pompidou.jpg", Zairon,
 *     CC BY-SA 4.0 — from the north: blue duct boxes and white funnels on
 *     the roof, the escalator's zig-zag in profile.
 *     https://commons.wikimedia.org/wiki/File:Paris_Montmartre_Blick_aufs_Centre_Georges-Pompidou.jpg
 *   · "Le Centre Georges-Pompidou en travaux (2026).jpg", JeremyJeanguenin,
 *     CC BY-SA 4.0 — the renovation state and the escalator's run: five
 *     flights with landings, rising from the north part of the front.
 *     https://commons.wikimedia.org/wiki/File:Le_Centre_Georges-Pompidou_en_travaux_(2026).jpg
 *   · "Lüftungsrohre Place George Pompidou Paris.jpg", Stefan Drößler,
 *     CC BY 4.0 — the piazza's freestanding funnels (looked at; not drawn).
 *     https://commons.wikimedia.org/wiki/File:L%C3%BCftungsrohre_Place_George_Pompidou_Paris.jpg
 * - Estimated: storeys every 7 m; the escalator's flights 13 m long with
 *   10 m landings, the tube 3.4 m across; the ducts' sizes and order per bay;
 *   the roof boxes and funnels' positions; the stacks' 10.8 m height.
 * - Ground: Mapterhorn shows the piazza sloping down to the Forum's floor at
 *   the west front (y = 0) and the rue du Renard 3.5–3.9 m higher; the east
 *   services and stacks run down to y = 0. terrain.ts check: ok.
 * - Simplified: the frame's members are square bars, thicker than the real
 *   tubes; the lattice of floor trusses, the stairs and the cross-bracing
 *   detail are reduced to one X per bay per two storeys. The curtain wall is
 *   a light sky glass (window-2, #a9bfd1; at review: the block reads pale in
 *   every photo, white steel before reflective glass). The escalator tube is
 *   a casing of the same pale glass with white rails along its shoulders, on
 *   the red truss (a translucent tube would need a seventh material; the six
 *   are the frame, the glass and the four service colours).
 * - Night: the glazed box and the escalator tube glow (`window-2`); the frame and services carry
 *   _FLOODLIGHT.
 */
import { Part, type V3, sub, cross } from './mesh'
import { finish, windowVariant } from './palette'
import { qf, save } from './dc-white-house'
import { box, revolve } from './paris-sacre-coeur'

const white = new Part(), glazing = new Part(), blue = new Part(), green = new Part(), yellow = new Part(), red = new Part()

const unit = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]
/** A square-section bar from a to b, `w` wide, four sides (open ends). */
function bar(p: Part, a: V3, b: V3, w: number) {
  const d = unit(sub(b, a)), ref: V3 = Math.abs(d[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const s = unit(cross(d, ref)), u = unit(cross(s, d)), h = w / 2
  const off = [[-h, -h], [h, -h], [h, h], [-h, h]]
  const A = off.map(([i, j]) => add(add(a, s, i), u, j)), B = off.map(([i, j]) => add(add(b, s, i), u, j))
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    const n = unit(add(add([0, 0, 0], s, off[k][0] + off[l][0]), u, off[k][1] + off[l][1]))
    qf(p, A[k], A[l], B[l], B[k], n)
  }
}
/** A vertical pipe (smooth, open), radius r, from z0 to z1. */
const pipe = (p: Part, x: number, y: number, r: number, z0: number, z1: number, seg = 8) => revolve(p, x, y, [[r, z0], [r, z1]], seg, false, true)

// ---------------------------------------------------------------------------
// Frame: y along the building (bearing 19.8°, north-north-east), x across it
// (the piazza west, x < 0; the rue du Renard east, x > 0). y = 0 is the
// Forum's floor, at the bottom of the sloping piazza.

const L = 83.4, LEVELS = [0, 7, 14, 21, 28, 35, 42], TOP = 42
const XC = 24.0, XG = 30.0 // the column lines, and the gerberettes' outer ends
const NB = 13, BAY = (2 * L) / NB
const ys = Array.from({ length: NB + 1 }, (_, k) => -L + BAY * k)

// ---- The glazed box between the column lines, set back from them, and
// the roof deck.
box(glazing, -22.6, 22.6, -L + 1.2, L - 1.2, 0, TOP - 0.8, false)
box(white, -XG, XG, -L, L, TOP - 0.8, TOP, white, true)
// Floor edges: pale bands round the glass at each level.
for (const z of LEVELS.slice(1, -1)) box(white, -22.9, 22.9, -L + 0.9, L - 0.9, z - 0.7, z, false)

// ---- The white steel frame: columns on both lines, the gerberettes' outer
// ties, beams along each level at both, and the cross-bracing of the long
// fronts.
for (const y of ys) {
  for (const sx of [-1, 1]) {
    pipe(white, sx * XC, y, 0.45, 0, TOP, 6)
    bar(white, [sx * XG, y, 0], [sx * XG, y, TOP], 0.3)
    for (const z of [14, 28, 42]) bar(white, [sx * XC, y, z - 0.4], [sx * XG, y, z - 0.4], 0.5) // gerberettes, one level in two
  }
}
for (const sx of [-1, 1]) for (const z of LEVELS.slice(1)) {
  bar(white, [sx * XG, -L, z - 0.4], [sx * XG, L, z - 0.4], 0.45)
  bar(white, [sx * XC, -L, z - 0.4], [sx * XC, L, z - 0.4], 0.35)
}
// Cross-bracing on the piazza front and on the ends: an X per bay per two storeys.
for (let k = 0; k < NB; k++) for (let j = 0; j < 6; j += 2) {
  const y0 = ys[k], y1 = ys[k + 1], z0 = Math.max(0.15, LEVELS[j]), z1 = LEVELS[j + 2]
  bar(white, [-XG - 0.05, y0, z0], [-XG - 0.05, y1, z1], 0.18)
  bar(white, [-XG - 0.05, y1, z0], [-XG - 0.05, y0, z1], 0.18)
}
for (const sy of [-1, 1]) for (const [x0, x1] of [[-XC, -8], [-8, 8], [8, XC]]) {
  bar(white, [x0, sy * (L + 0.05), 0.15], [x1, sy * (L + 0.05), 21], 0.18)
  bar(white, [x1, sy * (L + 0.05), 0.15], [x0, sy * (L + 0.05), 21], 0.18)
  bar(white, [x0, sy * (L + 0.05), 21], [x1, sy * (L + 0.05), 42], 0.18)
  bar(white, [x1, sy * (L + 0.05), 21], [x0, sy * (L + 0.05), 42], 0.18)
}

// ---- The "caterpillar": the escalator in its glass tube zig-zagging up the
// piazza front from the north part of the Forum to the top, on a red truss,
// with the horizontal galleries along each landing.
{
  const xT = -27.6, r = 1.7
  let y = 38.0, z = 1.6
  const flights: [V3, V3][] = []
  for (let f = 0; f < 5; f++) {
    const z1 = LEVELS[f + 1] + 0.6, y1 = y - 13.0
    flights.push([[xT, y, z], [xT, y1, z1]])
    if (f < 4) { flights.push([[xT, y1, z1], [xT, y1 - 10.0, z1]]); y = y1 - 10.0 } else y = y1
    z = z1
  }
  // The top gallery along the fifth level, the length of the front.
  flights.push([[xT, y, z], [xT, -L + 2, z]])
  for (const [a, b] of flights) {
    // The tube as a hexagon of pale glass with white rails, on a red truss.
    const d = unit(sub(b, a)), s: V3 = [1, 0, 0], u = unit(cross(d, s)) // u points up from the run
    for (let k = 0; k < 6; k++) {
      const t0 = (k / 6) * 2 * Math.PI, t1 = ((k + 1) / 6) * 2 * Math.PI
      const P = (p: V3, t: number): V3 => add(add(p, s, r * Math.cos(t)), u, r * Math.sin(t) + r)
      qf(glazing, P(a, t0), P(a, t1), P(b, t1), P(b, t0), unit(add(add([0, 0, 0], s, Math.cos((t0 + t1) / 2)), u, Math.sin((t0 + t1) / 2))))
    }
    const lo = (p: V3): V3 => add(p, u, -0.6)
    bar(red, lo(a), lo(b), 1.9)
    for (const sg of [-1, 1]) {
      const rail = (p: V3): V3 => add(add(p, s, sg * r * 0.95), u, r * 1.5)
      bar(white, rail(a), rail(b), 0.35)
    }
  }
}

// ---- The rue du Renard front: the services in their code colours, between
// the column line and the gerberettes. Blue air ducts (the biggest), green
// water pipes, yellow electricity, red lifts and goods hoists.
for (let k = 0; k < NB; k++) {
  const y0 = ys[k], y1 = ys[k + 1], m = (y0 + y1) / 2
  if (k % 4 === 1) {
    // A red lift tower filling the bay's middle.
    box(red, 25.0, 29.4, m - 2.4, m + 2.4, 0, TOP + 2.0)
    pipe(green, 26.0, y0 + 1.6, 0.45, 0, TOP)
    pipe(yellow, 26.2, y1 - 1.6, 0.35, 0, TOP)
  } else {
    pipe(blue, 26.8, y0 + 3.0, 1.05, 0, TOP + 1.0, 10)
    pipe(blue, 26.8, y0 + 6.2, 1.05, 0, TOP + 1.0, 10)
    pipe(blue, 28.6, m + 3.6, 0.75, 0, TOP - 3.5, 8)
    pipe(green, 25.6, y1 - 2.6, 0.45, 0, TOP)
    pipe(yellow, 25.8, y1 - 1.4, 0.35, 0, TOP)
    // The blue ducts' bends into the floors, one level in two.
    for (const z of [10.5, 24.5]) bar(blue, [26.8, y0 + 3.0, z], [23.0, y0 + 3.0, z], 1.4)
  }
}
// Blue duct boxes along the roof's east edge, and white ventilation funnels.
for (let k = 0; k < NB; k++) if (k % 2 === 0) box(blue, 22.0, 29.0, ys[k] + 1.5, ys[k + 1] - 1.5, TOP, TOP + 3.0)
for (const y of [-55, -30, -5, 20, 45]) {
  revolve(white, 12.0, y, [[1.4, TOP], [1.4, TOP + 3.0], [2.3, TOP + 4.4], [2.3, TOP + 4.9]], 10, white, true)
}
box(red, -26.0, -19.0, 70.0, 77.0, TOP, TOP + 4.6) // the red cube on the roof's north-west corner

// ---- The white ventilation funnels at the rue du Renard ends (OSM's small
// buildings against the east front): stacks with their mouths to the street.
for (const y of [78.5, 75.5, 72.0, -73.5, -76.9, -80.5]) {
  pipe(white, 33.5, y, 1.25, 0, 9.0, 10)
  revolve(white, 33.5, y, [[1.25, 9.0], [1.9, 10.2], [1.9, 10.8]], 10, white, true)
}

const lit = (_p: V3, n: V3) => (n[2] > 0.8 ? 0.2 : 0.8)
console.log({ white: white.triangles, glazing: glazing.triangles, blue: blue.triangles, green: green.triangles, yellow: yellow.triangles, red: red.triangles })
await save('paris-centre-pompidou', 'Centre Pompidou', [
  { part: white, material: { ...finish('pompidou-white', 0xeceeee), floodlight: lit } },
  { part: glazing, material: windowVariant(2, 0xa9bfd1) },
  { part: blue, material: { ...finish('pompidou-blue', 0x4f8fcf), floodlight: lit } },
  { part: green, material: { ...finish('pompidou-green', 0x3f9a5c), floodlight: lit } },
  { part: yellow, material: { ...finish('pompidou-yellow', 0xd9b23a), floodlight: lit } },
  { part: red, material: { ...finish('pompidou-red', 0xc9473b), floodlight: lit } },
], { bearing: 19.8, osm: 'way/55503397', footprint: [61.5, 167.3], height: TOP + 4.9 }, 6500)
