/**
 * Margaret Hunt Hill Bridge (2012; Santiago Calatrava) — procedural, CC0-1.0.
 * bun generators/dal-margaret-hunt-hill-bridge.ts
 *
 * The whole bridge inside its OSM man_made=bridge outline (way/1275449057),
 * levee to levee across the Trinity River floodway: the white arch, its 58
 * stays, the deck's white edge girders and parapets, its underside (the
 * cantilevered floor beams sloping in to the central spine box), the piers
 * and the abutments' faces. The map draws the six lanes' surfaces; nothing
 * here is a slab at road level. Writes a low model (arch drawn a little
 * bolder, all 58 stays as 1.1 m rods, the soffit as a smooth surface) and a
 * detail model (the arch at its 16 ft, stays at 0.44 m, the floor beams as
 * ribs under the soffit), which a map draws from detailZoom up.
 *
 * Also exports the helpers dal-margaret-mcdermott-bridge.ts uses (sweepY,
 * capY, column, footedBox, smoothTube, resample, writeBoth...): merge this
 * generator first.
 *
 * What makes it the MHH: one tall, narrow white arch standing ACROSS the
 * roadway, its legs just outside the deck's edges, round at the crown; from
 * its upper half two fans of stays run down to the deck's centreline, the
 * highest to the nearest anchors and the lowest to the farthest, alternating
 * legs, so each fan twists into a ruled (hyperbolic-paraboloid) surface and
 * the pair reads as a bell from the side; a thin white deck.
 *
 * Frame: x across the bridge, y along it toward the ENE (downtown side), z
 * up, metres; origin at the outline's centroid, on the river. Placed at
 * bearing 67.7°, the deck's axis and the stays' centreline in the lidar
 * (the outline's principal axis is 67.05°, skewed by its ramp ends).
 *
 * Height. z = 0 is the river, the lowest ground under the footprint: the
 * lidar's ground_min 118.74 m NAVD88, and the map's DEM (Mapterhorn) reads
 * the river at 118.5 m. The roadway, from lidar along the median: 17.9 m at
 * the arch, 17.0 at ±190 m from it, 15.6–15.9 at the levees (road(y), a
 * vertical curve). The map solves its own deck height from the ground (a
 * layer's 6 m clearance, levee tops ~12–15 m), so its roadway may sit a few
 * metres off this; the outline records no height.
 *
 * Feet on the terrain: piers, the arch's footings and the abutment faces
 * run down to the ground under them vertex by vertex, at 3DEP bare-earth
 * heights above the river (GROUND_ROWS, lidar), per the bridge rule in
 * docs/reference.md: about 3–4 m in the floodway, 9–14 m on the levees. So
 * the model's lowest point is 3.1 m, not 0; nothing stands in the river.
 * FEET_ON_DEM = false would run every foot to z = 0 instead.
 *
 * Sources:
 * - OSM: the outline way/1275449057 (bridge:structure=cable-stayed, layer 1,
 *   no height), 38–41 m wide, y = -309..+308; the Woodall Rodgers Freeway
 *   carriageways on it. No building or building:part inside.
 * - Lidar, USGS 3DEP TX_Pecos_Dallas_B3_2018 (flown 2018), 1 m grid,
 *   heights above the river: the deck's edges at x = -20 and +18 (centre
 *   -1); the arch's legs at y = 12, centred at x = -22.5 and +18 at 43–63 m,
 *   outside the deck; the stays' returns, a lens along the median that
 *   closes on the centreline 174 m either side of the arch, its edges ±8 m
 *   wide and 64–66 m high 74 m out, which only stays from high on the arch
 *   fit. The cloud stops at about 68 m, so nothing higher was measured.
 * - Published: Calatrava (calatrava.com) and Structurae: overall length 368
 *   m (1,206 ft), main span 184 m (603 ft), deck 36.7 m wide, 58 stays 119–
 *   196 m long anchored on the centreline of a central steel spine box with
 *   cantilevered floor beams and C-shaped edge girders (WBCTX, Huitt-
 *   Zollars); arch 400 ft (122 m) above the deck, 440 ft (134 m) above the
 *   floodway, a 16 ft (4.9 m) tube (Wikipedia "Margaret Hunt Hill Bridge",
 *   Structurae). The model's tube top is 139 m above the river: 121 m over
 *   the deck, 135 m over the floodway.
 * - Photos (Wikimedia Commons): "View of Margaret Hunt Hill Bridge from
 *   Reunion Tower August 2015 23" (Michael Barera, CC BY-SA 4.0; the arch
 *   astride the deck, legs either side); "MargaretHuntHillBridgeNight"
 *   (Raysonho, CC0; broadside: the bell, stays leaving the arch between
 *   about 50% and 85% of its height above the deck); "Margaret Hunt Hill
 *   Bridge" (Fkbowen, CC BY-SA 4.0; the legs and the hairpin crown); "Margret
 *   Hunt Hill Bridge" (ChuckN13, CC BY-SA 4.0; from the west end under the
 *   deck: the twisted fans, the lit soffit); "The Margaret Hunt Hill Bridge"
 *   (Gus Rios, CC BY-SA 3.0; the leg beside the deck edge, the pier at the
 *   arch); "Margaret Hunt Hill Bridge 2012" and "The Margaret Hunt Hill
 *   Bridge.02" (Marco Becerra, CC BY 2.0); "View of the Margaret Hunt Hill
 *   Bridge ... LCCN2014632135" (Carol M. Highsmith, public domain); "Dallas
 *   Texas Skyline - Trinity River - Margaret Hunt Hill Bridge" (Tony
 *   Webster, CC BY-SA 2.0).
 * - Estimated: the arch's centreline (legs tapering from 23.1 m either side
 *   at the footing to a round crown, fitted to the lidar legs and the
 *   photos' proportions); the stays' attachment heights (125 m down to 85 m)
 *   and anchors (38 m to 174 m out), linear, fitted to the lidar lens, the
 *   published lengths (the model's run 114–188 m) and the broadside photo;
 *   the deck's section (edge girders 1.6 m deep, parapets 1.1 m, the spine
 *   3.4 m deep and 7.6 m wide); the piers' places: one under the arch, at the
 *   ends of the 184 m spans (y = -172, +196) and every 40 m on the approaches,
 *   all elliptical concrete columns; floor beams every 4.6 m.
 *
 * Colours: the steel is white paint (every daylight photo), a cool white
 * pulled to the palette's lightness; the soffit a shade darker, as it reads
 * in shadow; piers concrete.
 *
 * Night: the arch and stays are floodlit white from the deck (night photos),
 * the soffit lit from below; both carry `floodlight`. The fascia's LED line
 * is left out.
 *
 * Doubts: no photo shows the piers clearly (the old Continental viaduct
 * stands in front in most); stays above 68 m are fitted, not measured; the
 * map's own roadway height (see Height).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { face, merged, rod } from './bridge-kit'
import { finish, type Swatch } from './palette'

// ---- Shared helpers (also used by dal-margaret-mcdermott-bridge.ts) ---------

const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

/** Evenly spaced numbers from a to b, both included, at most `step` apart. */
export function steps(a: number, b: number, step: number): number[] {
  const n = Math.max(1, Math.ceil(Math.abs(b - a) / step))
  return Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n)
}

/** A piecewise-linear lookup through [x, y] points, held flat past the ends. */
export function lerpTable(points: [number, number][]): (x: number) => number {
  return (x) => {
    if (x <= points[0][0]) return points[0][1]
    for (let i = 1; i < points.length; i++) {
      const [x0, y0] = points[i - 1], [x1, y1] = points[i]
      if (x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0)
    }
    return points[points.length - 1][1]
  }
}

/**
 * A section swept along the bridge (y): `profile` is a list of [x, dz]
 * points, dz measured from `top(y)`, walked counter-clockwise as seen from
 * +y (down the left side, along the bottom, up the right side), so every
 * face's outward normal lies to the right of the walk. Only the segments
 * listed are drawn: an open profile leaves its hidden side out.
 */
export function sweepY(p: Part, profile: [number, number][], ys: number[], top: (y: number) => number) {
  for (let i = 0; i < profile.length - 1; i++) {
    const [xa, da] = profile[i], [xb, db] = profile[i + 1]
    const n = norm([db - da, 0, -(xb - xa)])
    for (let k = 0; k < ys.length - 1; k++) {
      const y0 = ys[k], y1 = ys[k + 1]
      face(p, [xa, y0, top(y0) + da], [xb, y0, top(y0) + db], [xb, y1, top(y1) + db], [xa, y1, top(y1) + da], n)
    }
  }
}

/** Closes a swept section's end at y with a flat face looking along ±y (a convex profile). */
export function capY(p: Part, profile: [number, number][], y: number, top: number, dir: 1 | -1) {
  const pts = profile.map(([x, d]) => [x, y, top + d] as V3)
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    const g = (b[0] - a[0]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[0] - a[0])  // y of (b-a)x(c-a) is -(this)
    if (Math.abs(g) < 1e-9) continue
    if (-g * dir > 0) p.tri(a, b, c)
    else p.tri(a, c, b)
  }
}

/**
 * An upright elliptical column centred at (cx, cy), radii rx across and ry
 * along, from the ground under each of its vertices up to z1. Open at both
 * ends: its top is under the deck and its foot in the ground.
 */
export function column(p: Part, cx: number, cy: number, rx: number, ry: number, z1: number, ground: (x: number, y: number) => number, sides = 12) {
  for (let i = 0; i < sides; i++) {
    const a0 = (2 * Math.PI * i) / sides, a1 = (2 * Math.PI * (i + 1)) / sides
    const P = (a: number): [number, number] => [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]
    const [x0, y0] = P(a0), [x1, y1] = P(a1)
    const n0: V3 = norm([Math.cos(a0) / rx, Math.sin(a0) / ry, 0]), n1: V3 = norm([Math.cos(a1) / rx, Math.sin(a1) / ry, 0])
    const A: V3 = [x0, y0, ground(x0, y0)], B: V3 = [x1, y1, ground(x1, y1)], C: V3 = [x1, y1, z1], D: V3 = [x0, y0, z1]
    p.tri(A, B, C, undefined, undefined, undefined, [n0, n1, n1])
    p.tri(A, C, D, undefined, undefined, undefined, [n0, n1, n0])
  }
}

/** A box from x0..x1, y0..y1, its foot on the ground under each corner, up to z1; top and sides only. */
export function footedBox(p: Part, x0: number, x1: number, y0: number, y1: number, z1: number, ground: (x: number, y: number) => number) {
  const c: [number, number][] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  for (let i = 0; i < 4; i++) {
    const [ax, ay] = c[i], [bx, by] = c[(i + 1) % 4]
    const n = norm([by - ay, -(bx - ax), 0])
    face(p, [ax, ay, ground(ax, ay)], [bx, by, ground(bx, by)], [bx, by, z1], [ax, ay, z1], n)
  }
  face(p, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
}

/** Resample a polyline to `n` segments of equal length. */
export function resample(path: V3[], n: number): V3[] {
  const d = [0]
  for (let i = 1; i < path.length; i++) d.push(d[i - 1] + Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1], path[i][2] - path[i - 1][2]))
  const total = d[d.length - 1], out: V3[] = []
  let k = 1
  for (let i = 0; i <= n; i++) {
    const s = (total * i) / n
    while (k < path.length - 1 && d[k] < s) k++
    const t = (s - d[k - 1]) / (d[k] - d[k - 1] || 1)
    out.push([0, 1, 2].map((j) => path[k - 1][j] + (path[k][j] - path[k - 1][j]) * t) as V3)
  }
  return out
}

/**
 * A round tube along a path with parallel-transported sections, so it never
 * twists where the path turns from upright to level (bridge-kit's `tube`
 * switches its reference axis there and pinches). Smooth-shaded, open ends.
 */
export function smoothTube(p: Part, path: V3[], r: number | ((i: number) => number), sides: number) {
  const radius = typeof r === 'number' ? () => r : r
  const T = path.map((_, i) => norm(sub3(path[Math.min(i + 1, path.length - 1)], path[Math.max(i - 1, 0)])))
  let N = norm(cross3(T[0], Math.abs(T[0][2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]))
  const rings: { pts: V3[]; ns: V3[] }[] = []
  for (let i = 0; i < path.length; i++) {
    if (i > 0) { // transport N: remove its component along the new tangent
      const d = N[0] * T[i][0] + N[1] * T[i][1] + N[2] * T[i][2]
      N = norm([N[0] - d * T[i][0], N[1] - d * T[i][1], N[2] - d * T[i][2]])
    }
    const B = cross3(T[i], N)
    const ns: V3[] = [], pts: V3[] = []
    for (let k = 0; k < sides; k++) {
      const a = (2 * Math.PI * k) / sides
      const n: V3 = [N[0] * Math.cos(a) + B[0] * Math.sin(a), N[1] * Math.cos(a) + B[1] * Math.sin(a), N[2] * Math.cos(a) + B[2] * Math.sin(a)]
      ns.push(n)
      const rr = radius(i)
      pts.push([path[i][0] + n[0] * rr, path[i][1] + n[1] * rr, path[i][2] + n[2] * rr])
    }
    rings.push({ pts, ns })
  }
  for (let i = 0; i < rings.length - 1; i++)
    for (let k = 0; k < sides; k++) {
      const j = (k + 1) % sides, a = rings[i], b = rings[i + 1]
      p.tri(a.pts[k], b.pts[k], b.pts[j], undefined, undefined, undefined, [a.ns[k], b.ns[k], b.ns[j]])
      p.tri(a.pts[k], b.pts[j], a.pts[j], undefined, undefined, undefined, [a.ns[k], b.ns[j], a.ns[j]])
    }
}
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

export const countTris = (parts: { part: Part }[]) => parts.reduce((s, p) => s + p.part.triangles, 0)

/** Writes a low and a detail GLB, holding each to its budget. */
export async function writeBoth(id: string, name: string,
  low: { part: Part; material: any }[], detail: { part: Part; material: any }[], extras: Record<string, unknown>) {
  for (const [file, list, maxTris, maxBytes] of [
    [`${id}.glb`, low, 6500, 250 * 1024],
    [`${id}.detail.glb`, detail, 40000, 1536 * 1024],
  ] as const) {
    const parts = list.filter((l) => l.part.triangles > 0)
    const tris = countTris(parts)
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb(name, parts, extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}

// ---- Margaret Hunt Hill Bridge ---------------------------------------------

const XC = -1.0            // deck centreline (lidar: deck edges at -20 and +18)
const HALF = 18.5          // deck half-width to the fascia's outer face (36.7 m published, 38 m lidar)
const YA = 12              // the arch's plane, across the bridge
const XA = -2.0            // the arch's centre (lidar: leg centres -22.5 and +18 at 53 m)
const ENDS: [number, number] = [-305, 305]   // the outline's ends, on the levees

/** The roadway, metres above the water (lidar): 17.9 m at the arch, 15.6 m at the levees. */
const road = (y: number) => 17.9 - 2.4e-5 * (y - YA) ** 2

/** 3DEP bare earth above the river (lidar ground_min 118.74 m NAVD88), along the bridge; [y, left, right]. */
const GROUND_ROWS: [number, number, number][] = [
  [-320, 14.4, 14.3], [-310, 13.3, 13.9], [-300, 12.2, 13.2], [-290, 9.7, 12.8], [-280, 7.8, 10.3], [-270, 5.1, 8.2],
  [-260, 3.7, 5.6], [-250, 3.5, 3.7], [-240, 3.0, 3.4], [-200, 3.0, 3.2], [-170, 3.4, 3.5], [-140, 3.6, 3.9],
  [-100, 3.9, 4.1], [-70, 3.9, 4.1], [-60, 1.9, 3.6], [-50, 0.6, 1.8], [-40, 0.2, 0.2], [-20, 0.2, 0.2],
  [-10, 0.5, 0.5], [0, 2.1, 2.1], [10, 4.0, 4.0], [60, 4.0, 4.0], [100, 3.8, 3.7], [140, 3.4, 3.5],
  [200, 3.6, 3.5], [230, 3.9, 3.7], [240, 4.2, 4.0], [250, 5.4, 4.4], [260, 7.5, 5.6], [270, 10.5, 7.0],
  [280, 12.0, 9.7], [290, 11.4, 11.8], [300, 9.2, 10.7], [310, 8.6, 9.1], [320, 6.4, 7.7],
]
const groundL = lerpTable(GROUND_ROWS.map(([y, l]) => [y, l]))
const groundR = lerpTable(GROUND_ROWS.map(([y, , r]) => [y, r]))
/** Feet stand on the DEM, at its height above the water (the bridge rule in docs/reference.md). */
const FEET_ON_DEM = true
const ground = (x: number, y: number) => {
  if (!FEET_ON_DEM) return 0
  const t = Math.min(1, Math.max(0, (x - (XC - 25)) / 50))
  return groundL(y) * (1 - t) + groundR(y) * t
}

/** The arch's centreline half-width at height z: straight, slightly tapering legs into a round crown. */
const TOP = 136.5          // centreline crown; the tube's top 139 m above the water
const R_ARCH = 2.45        // 16 ft tube
const R_ARCH_LOW = 2.9     // the low model draws it a little bolder, to hold at phone size
const FOOT = 4.0
const archHalf = (z: number) => {
  const t = Math.min(1, Math.max(0, (z - FOOT) / (TOP - FOOT)))
  return (23.1 - 0.05 * (z - FOOT)) * Math.sqrt(Math.max(0, 1 - t ** 3.5))
}
function archPath(n: number): V3[] {
  const dense: V3[] = []
  const zs = steps(FOOT, TOP, 0.25)
  for (const z of zs) dense.push([XA - archHalf(z), YA, z])
  for (const z of [...zs].reverse().slice(1)) dense.push([XA + archHalf(z), YA, z])
  return resample(dense, n)
}

/**
 * The stays: 29 a side, each from the arch to the deck's centreline. The
 * first leaves the arch at 125 m for the deck 38 m out; each next one
 * leaves a little lower, from the other leg, for a point farther out, the
 * last from 85 m to 174 m out. Adjacent stays cross, so each fan is a twisted
 * ruled surface; the other fan is its mirror, from the opposite legs.
 */
function stays(every = 1): [V3, V3][] {
  const out: [V3, V3][] = []
  for (const s of [-1, 1]) for (let k = 0; k < 29; k += every) {
    const u = k / 28
    const za = 125 - 40 * u, D = 38 + 136 * u
    const leg = (k % 2 ? 1 : -1) * s
    const y = YA + s * D
    out.push([[XA + leg * archHalf(za), YA, za], [XC, y, road(y) - 0.3]])
  }
  return out
}

/**
 * The deck in section, from the fascia's top down, dz from the roadway:
 * the white edge girders (a parapet 1.1 m above the road, 1.6 m deep), the
 * cantilevered floor beams' soffit sloping in to the central spine box,
 * 3.4 m deep. Walked down the left side, along the bottom, up the right.
 */
const SECTION: [number, number][] = [
  [XC - HALF + 0.6, 1.1], [XC - HALF, 1.1], [XC - HALF, -1.6], [XC - HALF + 0.6, -1.6],
  [XC - 5.0, -2.8], [XC - 3.8, -3.4], [XC + 3.8, -3.4], [XC + 5.0, -2.8],
  [XC + HALF - 0.6, -1.6], [XC + HALF, -1.6], [XC + HALF, 1.1], [XC + HALF - 0.6, 1.1],
]

/** The edge girders with their parapets, inner faces included down to just under the road. */
const LEFT: [number, number][] = [[XC - HALF + 0.6, -0.3], ...SECTION.slice(0, 4)]
const RIGHT: [number, number][] = [...SECTION.slice(8), [XC + HALF - 0.6, -0.3]]

/** Piers under the spine, [y, across radius, along radius]; the arch's own at YA. */
const PIERS: [number, number, number][] = [[-252, 3.2, 1.4], [-212, 3.2, 1.4], [-172, 3.6, 1.8], [YA, 4.2, 2.0], [196, 3.6, 1.8], [236, 3.2, 1.4], [276, 3.2, 1.4]]

if (import.meta.main) {
  const fascia = new Part(), under = new Part(), arch = new Part(), cablesLow = new Part()
  const fasciaD = new Part(), underD = new Part(), archD = new Part(), cablesD = new Part()
  const concrete = new Part()

  const ys = steps(ENDS[0], ENDS[1], 15)
  for (const [f, u] of [[fascia, under], [fasciaD, underD]] as [Part, Part][]) {
    // Edge girders and parapets (white), the soffit (shade).
    sweepY(f, LEFT, ys, road)
    sweepY(f, RIGHT, ys, road)
    sweepY(u, SECTION.slice(3, 9), ys, road)
    for (const [y, dir] of [[ENDS[0], -1], [ENDS[1], 1]] as [number, 1 | -1][]) {
      capY(u, SECTION.slice(3, 9), y, road(y), dir)
      for (const side of [LEFT, RIGHT]) capY(f, side, y, road(y), dir)
    }
  }
  // Detail: the floor beams' ribs under the soffit, every 4.6 m either side of the spine.
  for (const y of steps(ENDS[0] + 2, ENDS[1] - 2, 4.6)) for (const s of [-1, 1]) {
    const rib: [number, number][] = s < 0
      ? [[XC - HALF + 0.6, -1.6], [XC - HALF + 0.6, -2.0], [XC - 5.0, -3.2], [XC - 5.0, -2.8]]
      : [[XC + 5.0, -2.8], [XC + 5.0, -3.2], [XC + HALF - 0.6, -2.0], [XC + HALF - 0.6, -1.6]]
    const top = road(y)
    const at = (x: number, d: number, yy: number): V3 => [x, yy, top + d]
    // two sides and the bottom of a 0.5 m rib
    for (const [yy, dir] of [[y - 0.25, -1], [y + 0.25, 1]] as [number, number][]) {
      const q = rib.map(([x, d]) => at(x, d, yy))
      face(underD, q[0], q[1], q[2], q[3], [0, dir, 0])
    }
    const [a, b] = [rib[1], rib[2]]
    const n = norm([b[1] - a[1], 0, -(b[0] - a[0])])
    face(underD, at(a[0], a[1], y - 0.25), at(b[0], b[1], y - 0.25), at(b[0], b[1], y + 0.25), at(a[0], a[1], y + 0.25), n)
  }

  // The arch: one 16 ft tube, its legs standing on concrete footings outside the deck's edges.
  smoothTube(arch, archPath(44), R_ARCH_LOW, 10)
  smoothTube(archD, archPath(96), R_ARCH, 16)
  for (const s of [-1, 1]) {
    const x = XA + s * archHalf(FOOT)
    footedBox(concrete, x - 4, x + 4, YA - 4, YA + 4, FOOT + 1.2, ground)
  }

  // Stays.
  for (const [a, b] of stays(1)) rod(cablesLow, a, b, 0.55, 3)
  for (const [a, b] of stays(1)) rod(cablesD, a, b, 0.22, 6)

  // Piers under the spine, and the abutments' faces at the levees.
  for (const [y, rx, ry] of PIERS) column(concrete, XC, y, rx, ry, road(y) - 3.3, ground)
  for (const [y, dir] of [[ENDS[0], -1], [ENDS[1], 1]] as [number, number][]) {
    const top = road(y) - 1.6
    const xs = steps(XC - HALF, XC + HALF, 4)
    for (let i = 0; i < xs.length - 1; i++) {
      const x0 = xs[i], x1 = xs[i + 1]
      face(concrete, [x0, y, Math.min(ground(x0, y), top)], [x1, y, Math.min(ground(x1, y), top)], [x1, y, top], [x0, y, top], [0, dir, 0])
    }
  }

  // Night: the arch and stays are floodlit white from the deck; the soffit is lit from below.
  const above = (p: V3, n: V3) => (p[2] > road(p[1]) + 1.2 ? (n[2] > 0.7 ? 0.5 : 0.95) : 0)
  const WHITE = { ...finish('white-steel', 0xeeeeea), floodlight: above }
  const WHITE_DS = { ...WHITE, doubleSided: true }
  const SHADE = { ...finish('white-steel-shade', 0xd3d6d6), floodlight: (_p: V3, n: V3) => (n[2] < -0.5 ? 0.7 : 0.3) }
  const CONCRETE: Swatch = finish('concrete', 0xd9d4ca)

  await writeBoth('dal-margaret-hunt-hill-bridge', 'Margaret Hunt Hill Bridge', [
    { part: merged(arch, fascia, cablesLow), material: WHITE },
    { part: under, material: SHADE },
    { part: concrete, material: CONCRETE },
  ], [
    { part: merged(archD, fasciaD), material: WHITE },
    { part: cablesD, material: { ...WHITE_DS, name: 'white-steel-stays' } },
    { part: underD, material: SHADE },
    { part: concrete, material: CONCRETE },
  ], {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, on the river',
    bearing: 67.7, elevation: 0, roadwayAtArch: road(YA), roadwayEnds: [road(ENDS[0]), road(ENDS[1])],
  })
}
