/**
 * The rock spires of Black Spire Outpost, Star Wars: Galaxy's Edge,
 * Disneyland Park, Anaheim — procedural, CC0-1.0.
 * bun generators/dlr-batuu-spires.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0. The origin is the
 * mean of the main spires' bases. One model holds the whole group, as
 * wdw-batuu-spires does: the spires are one piece of rockwork, a ridge of
 * tan mesas with slate needles growing out of it, and read as one group
 * from the courtyard and from outside the park.
 *
 * Anaheim's group is laid out differently from Florida's. It stands on the
 * roof edge of Smugglers Run's show building (way/515673763), north and
 * north-east of the Millennium Falcon: the tallest needle (A) right behind
 * the ship's middle, a second (B) to its east whose slate runs down almost
 * to the ground behind the mandibles, a lower two-headed spire (C) further
 * east, a lesser needle (D) behind A to the north-west, and a long tan mesa
 * running west behind the docking bay. Every base falls inside the show
 * building's outline, so the model replaces nothing.
 *
 * Evidence
 * - OSM has no spire, rock or peak feature here; natural=bare_rock areas in
 *   the land (way/705339559, 705328797, 706812985, 705316172/4, 754173179,
 *   704176252) are low courtyard rockwork, none under a spire.
 * - Published: 135 ft (41 m) for the tallest spire (Wikipedia, "Star Wars:
 *   Galaxy's Edge"). A is drawn 40 m.
 * - Photos from the courtyard, south-west to south-east of the Falcon:
 *   Commons, Univaded Fox (public domain; Phonetography 162, 163),
 *   Contributor19 (CC BY 4.0; "Galaxy's Edge, Disneyland"), elisfkc
 *   (CC BY-SA 2.0; 48512021956, 48512183242 and two panoramas), Laika ac
 *   (CC BY-SA 2.0; "Star War Galaxy's Edge (Disneyland) 02",
 *   "Disneyland - Star Wars Galaxy's Edge (Disneyland) 01"); Mapillary
 *   1582830536335484 (DrivingRoundTown, CC BY-SA 4.0). Street views from
 *   outside the park to the north-west (Mapillary marker_geo, 2020–2022,
 *   CC BY-SA 4.0) show A and B side by side above the show buildings.
 * - Positions: two courtyard cameras (Phonetography 163, Mapillary) posed
 *   against the Falcon (cockpit, docking port), its tree (OSM node
 *   6334505586) and the Smugglers Run tower give each spire's bearing; the
 *   depth comes from the USGS NAIP orthophoto (public domain), where the
 *   pale rock lies between 5 and 28 m north of the Falcon and A's pointed
 *   shadow ends on the show building's roof 31 m north. Heights follow
 *   from each spire's elevation angle in Phonetography 163 at that range.
 *
 * Doubts: the two posed cameras stand only a few metres apart, so the
 * bearings fix each spire's direction well but not its depth; that rests on
 * the aerial and may be 5 m out, more for C and D. The heights other than
 * A's are photo estimates (B 36 m, C 31 m, D 28 m), scaled so A comes
 * out at the published 41 m with a phone's 64° field of view and the mesas' outline
 * and height (15–20 m) are estimated from the photos and the aerial. The
 * pale distant needles seen far to the north-west from the courtyard are
 * not modelled; nothing places them. The needles' facets and lesser points
 * are a stylised stand-in for the sculpted rock.
 */
import { Part, cross, len, sub, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

const slate = new Part()      // the blue-grey needles
const sand = new Part()       // the tan rock mesas they grow from
const ochre = new Part()      // the darker strata in the mesas

const TAU = Math.PI * 2
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A flat triangle facing away from `inside`. */
function tri(p: Part, a: V3, b: V3, c: V3, inside: V3) {
  const n = cross(sub(b, a), sub(c, a))
  if (len(n) < 1e-9) return
  const m: V3 = [(a[0] + b[0] + c[0]) / 3 - inside[0], (a[1] + b[1] + c[1]) / 3 - inside[1], (a[2] + b[2] + c[2]) / 3 - inside[2]]
  if (dot(n, m) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}

/** A small deterministic random source, so the rock comes out the same every run. */
let seed = 11
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
const between = (a: number, b: number) => a + (b - a) * rnd()

/** Loft closed rings (same corner count) with flat faces, then cap the top with an apex or a flat lid. */
function loft(p: Part | ((k: number) => Part), rings: V3[][], top: V3 | 'flat', bottom = false) {
  const pick = typeof p === 'function' ? p : () => p
  const n = rings[0].length
  const centre = (r: V3[]): V3 => [r.reduce((s, q) => s + q[0], 0) / n, r.reduce((s, q) => s + q[1], 0) / n, r.reduce((s, q) => s + q[2], 0) / n]
  for (let k = 0; k < rings.length - 1; k++) {
    const c0 = centre(rings[k]), c1 = centre(rings[k + 1])
    const inside: V3 = [(c0[0] + c1[0]) / 2, (c0[1] + c1[1]) / 2, (c0[2] + c1[2]) / 2]
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      tri(pick(k), rings[k][i], rings[k][j], rings[k + 1][j], inside)
      tri(pick(k), rings[k][i], rings[k + 1][j], rings[k + 1][i], inside)
    }
  }
  const last = rings[rings.length - 1], c = centre(last), q = pick(rings.length - 1)
  if (top === 'flat') {
    // A low dome over the lid, so a mesa top is not a dead-flat roof.
    const peak: V3 = [c[0], c[1], c[2] + 1.2]
    for (let i = 0; i < n; i++) tri(q, last[i], last[(i + 1) % n], peak, [c[0], c[1], c[2] - 5])
  } else {
    for (let i = 0; i < n; i++) tri(q, last[i], last[(i + 1) % n], top, [c[0], c[1], c[2] - 1])
  }
  if (bottom) {
    const b = rings[0], cb = centre(b)
    for (let i = 0; i < n; i++) tri(pick(0), b[i], b[(i + 1) % n], cb, [cb[0], cb[1], cb[2] + 1])
  }
}

/**
 * A needle: a fluted cross-section (alternate corners pulled in, so the
 * faces fold into vertical clefts) lofted up a wandering, leaning axis,
 * narrowing unevenly to a point. Returns the axis and radius at a height,
 * for hanging lesser points on its flanks.
 */
function needle(x: number, y: number, z0: number, h: number, r: number, lean: [number, number], sides = 10, levels = 6, taper = 0.6) {
  const base = Array.from({ length: sides }, (_, i) => (i % 2 ? between(0.62, 0.8) : between(0.95, 1.2)))
  const turn = rnd() * TAU
  const axis: Array<[number, number, number, number]> = [] // x, y, z, radius
  let wx = 0, wy = 0
  for (let k = 0; k <= levels; k++) {
    const t = k / (levels + 1)
    // Uneven taper: the profile thins as (1 - t), with each level a little
    // fatter or thinner than the last, and the axis drifting as it leans.
    // taper 0 means a column: nearly straight-sided to just past half its
    // height, then drawing in to a sharp point.
    const shape = taper > 0 ? Math.pow(1 - t, taper) : (1 - 0.3 * t) * (t > 0.5 ? Math.pow((1 - t) / 0.5, 0.85) : 1)
    const s = shape * between(0.86, 1.08)
    if (k) { wx += between(-0.2, 0.2) * r; wy += between(-0.2, 0.2) * r }
    axis.push([x + lean[0] * t + wx, y + lean[1] * t + wy, z0 + (h - z0) * t, r * s])
  }
  const rings = axis.map(([ax, ay, az, ar]) => base.map((f, i) => {
    const a = turn + (i / sides) * TAU
    const k = ar * f * between(0.9, 1.1)
    return [ax + Math.cos(a) * k, ay + Math.sin(a) * k, az] as V3
  }))
  const last = axis[axis.length - 1]
  loft(slate, rings, [last[0] + lean[0] * 0.15 + between(-0.3, 0.3), last[1] + lean[1] * 0.15 + between(-0.3, 0.3), h])
  return (z: number) => {
    let k = 0
    while (k < axis.length - 2 && axis[k + 1][2] < z) k++
    const a = axis[k], b = axis[k + 1], t = Math.min(1, Math.max(0, (z - a[2]) / (b[2] - a[2])))
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[3] + (b[3] - a[3]) * t] as [number, number, number]
  }
}

/**
 * A main spire: the needle itself, and `n` lesser points clustered near its
 * top and stepping down its flanks, each a small needle rooted inside the
 * main one and breaking out of its side.
 */
function spire(x: number, y: number, z0: number, h: number, r: number, lean: [number, number], n: number) {
  // Anaheim's needles stand as near-vertical columns for most of their
  // height and only draw in to a point above half way, so the main ones are
  // columns rather than cones.
  const at = needle(x, y, z0, h, r, lean, 10, 7, 0)
  for (let j = 0; j < n; j++) {
    // Most of them high up, a few lower down the flank.
    const t = j < n * 0.6 ? between(0.62, 0.86) : between(0.35, 0.62)
    const z = z0 + (h - z0) * t
    const [ax, ay, ar] = at(z)
    const a = rnd() * TAU, d = ar * 0.55
    const top = z + (h - z0) * between(0.1, 0.2) * (1.15 - t * 0.4)
    needle(ax + Math.cos(a) * d, ay + Math.sin(a) * d, z - (h - z0) * 0.08, Math.min(top, h - 1.5), ar * 0.5,
      [Math.cos(a) * ar * 0.4, Math.sin(a) * ar * 0.4], 6, 2)
  }
}

/**
 * A mesa: a broad, low, irregular block of layered rock in stepped tiers,
 * each set back a little, with a thin ochre stratum between them.
 */
function mesa(x: number, y: number, rx: number, ry: number, rot: number, h: number) {
  const sides = 11
  const radii = Array.from({ length: sides }, () => between(0.75, 1.15))
  // The stratum wanders up and down round the mesa, so it reads as a bed
  // of rock rather than a painted belt.
  const ring = (z: number, s: number, dz = 0): V3[] => radii.map((f, i) => {
    const a = (i / sides) * TAU
    const px = Math.cos(a) * rx * f * s * between(0.95, 1.05), py = Math.sin(a) * ry * f * s * between(0.95, 1.05)
    return [x + px * Math.cos(rot) - py * Math.sin(rot), y + px * Math.sin(rot) + py * Math.cos(rot), z + between(-dz, dz)]
  })
  const z1 = h * between(0.45, 0.55)
  const rings = [ring(0, 1), ring(z1, 0.95, 1.2), ring(z1 + 1.1, 0.9, 1.2), ring(h, 0.72, 1.0)]
  loft((k) => (k === 1 ? ochre : sand), rings, 'flat')
}

// Positions in metres east and north of the Falcon OSM trace's centroid
// (-117.92124, 33.81499). The origin is the mean of the four main needles.
const MAIN: Array<[number, number]> = [[6, 17], [17, 15], [27, 18], [-5, 27]]
const OX = MAIN.reduce((s, p) => s + p[0], 0) / MAIN.length
const OY = MAIN.reduce((s, p) => s + p[1], 0) / MAIN.length
const L = (x: number, y: number): [number, number] => [x - OX, y - OY]

// The mesas: a long ridge from behind the docking bay east to C, highest
// under A, falling to a low shoulder under B and C.
for (const [x, y, rx, ry, rot, h] of [
  [-13, 24, 11, 6, 0.15, 16],  // the west ridge behind the docking bay
  [4, 24, 10, 6, 0.1, 18],      // behind the tallest, whose slate comes down in front
  [-5, 27, 7, 5, -0.3, 17],     // under D
  [18, 19.5, 8, 5, -0.3, 14],   // behind B, its south face behind the mandibles
  [27, 19, 8, 5, 0.3, 13],      // under C
] as const) {
  const [lx, ly] = L(x, y)
  mesa(lx, ly, rx, ry, rot, h)
}

// The needles: main ones with their lesser points, and companions fused to
// them at the base.
for (const [x, y, z0, h, r, lx, ly, n] of [
  [6, 17, 4, 41, 7.2, 0.8, 1.0, 7],     // A, the tallest, behind the Falcon's middle
  [10, 19, 8, 32, 3.6, 0.6, 0.5, 2],    // its fused second head
  [12.5, 21, 9, 24, 2.8, 0.3, 0.6, 1],  // the sharp points between A and B
  [17, 15, 2, 36, 6.0, 0.4, 0.8, 6],    // B
  [27, 18, 6, 31, 3.8, -0.3, 0.5, 3],   // C, two-headed
  [30.5, 21, 6, 30, 3.4, 0.5, 0.4, 2],
  [-5, 27, 9, 28, 3.6, -0.4, 0.6, 3],   // D, behind A to the west
] as const) {
  const [px, py] = L(x, y)
  spire(px, py, z0 + 1, h, r, [lx, ly], n)
}

const parts = [
  // Slate pulled light, as STYLE.md asks of a large dark surface, but kept
  // blue-grey enough to read as the dark rock against the tan.
  { part: slate, material: finish('spire-slate', 0x98a0a6) },
  { part: sand, material: finish('spire-sandstone', 0xd4bf9a) },
  { part: ochre, material: finish('spire-ochre', 0xbf9d72) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
console.log(parts.map(({ part, material }) => `${material.name}: ${part.triangles}`).join('\n'))
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Black Spire Outpost spires', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', origin: [OX, OY],
})
await Bun.write(new URL('../models/dlr-batuu-spires.glb', import.meta.url), glb)
console.log(`dlr-batuu-spires.glb: ${triangles} triangles, ${glb.length} bytes; origin ${OX.toFixed(1)}, ${OY.toFixed(1)} m from the Falcon trace`)
