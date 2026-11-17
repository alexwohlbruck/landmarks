/**
 * Benjamin Franklin Bridge (1926, as the Delaware River Bridge; Ralph
 * Modjeski chief engineer, Leon Moisseiff design engineer, Paul Cret
 * architect) — procedural, CC0-1.0, no textures.
 * bun generators/phl-ben-franklin-bridge.ts
 *
 * The whole suspension bridge as one placement, anchorage to anchorage,
 * which is what the OSM outline way/575987106 covers: both steel towers on
 * their granite piers, both granite anchorages with their landward corner
 * pylons, the two main cables over the main and side spans, the stiffening
 * trusses that rise above the roadway, the raised walkways, the PATCO track
 * beds outboard of the trusses, the deck's fascia girders and underside.
 * The approach viaducts beyond the anchorages (outline way/1044592782 on
 * the Pennsylvania side, another ~600 m in Camden) are left to the map: they
 * are plain steel and masonry viaducts, and leaving them out keeps the
 * 1,060 m model inside the budget for the parts that make it the bridge.
 * Writes a low model (towers with their X bracing, anchorages, cables, the
 * trusses as chords and big diagonals, walkways and track beds as bands) and
 * a detail model (the trusses as Warren lattice with posts, suspenders,
 * walkway brackets and railings, floor beams), which a map draws from
 * detailZoom up.
 *
 * Frame: x across the bridge (+x to the south side), y along it toward
 * Camden, z up, metres. Placed at bearing 102.716°, the line between the two
 * towers' lidar centres; the anchor (-75.1346174, 39.9529617) is midway
 * between them. The towers stand at y = ±266.4 (532.8 m apart; published
 * main span 1,750 ft, 533.4 m). The map owns the roadway surfaces: nothing
 * here is a slab at road level between the trusses.
 *
 * Height. z = 0 is the Delaware's surface, the lowest ground under the
 * footprint. Structure heights are lidar heights above the water's own
 * returns (-0.5 m NAVD88 in the 2015 flight). Ground heights for the
 * anchorages' feet are the map's terrain (Mapterhorn) above its own reading
 * of the river (-1.25 m), so the feet land on the terrain the map draws:
 * about 3.4 m at the Pennsylvania anchorage's river face rising to 5.5 m at
 * its landward face, and a flat 3.7 m in Camden (linear fits to 4 m tables;
 * the terrain varies under 0.3 m across the bridge there).
 *
 * The roadway, from lidar (no OSM height; deck way/45333099 has ele=45):
 * a vertical curve 47.4 − 6.2e-5·y² over the main span, 47.4 m at midspan
 * and 43.0 m at the towers, then a straight 3.45 % grade down the side
 * spans to 35.5 m at the anchorages' river faces (y = ±485) and 33.8 m at
 * their landward faces (±532). These are the heights the trusses, walkways
 * and track beds are built around, and the heights to give the map.
 *
 * Sources:
 * - OSM: outline way/575987106 (man_made=bridge, bridge:structure=
 *   suspension, layer 2), 39–41 m wide, y = −532 to +531; towers
 *   way/754832342 (Pennsylvania) and way/754832343 (New Jersey;
 *   bridge:support=pylon, building=tower, height 117); piers way/754832345
 *   and way/754832344 (bridge:support=pier, not buildings); anchorages
 *   way/334628511 and way/334628517 (bridge:support=pier, building=yes),
 *   y = ±485 to ±532, |x| ≤ 22 with the landward corner pylons out to 28.
 *   OSM's New Jersey tower and pier sit about 10 m short of the lidar's
 *   tower; the model follows the lidar and mirrors the Pennsylvania pier.
 * - Lidar: USGS 3DEP USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017, flown
 *   2015; 0.5 m grids over both towers, midspan and the Pennsylvania side
 *   span, 1 m grids over both anchorages:
 *   - tower tops 117.9 m (Pennsylvania) and 119.2 m (New Jersey, a light
 *     mast; the steel is 117.5 m), legs |x| 11–15.6, the top strut 113.0 m;
 *   - roadway as above; stiffening trusses at |x| 12.5–14.5, their tops
 *     9.6 m above the roadway (57.0 m at midspan); walkways at |x| 14.7–17,
 *     5.6 m above the roadway (53.0 m at midspan); PATCO tracks at |x|
 *     17.5–20, at the roadway's level; outer girders to |x| 20.5;
 *   - main cables in the truss planes, 57.6 m at midspan and 117.0 m at
 *     the saddles: a parabola fitted within a metre at y = ±222 to ±246;
 *     side spans 117 − 0.5264d + 0.000883d², d = |y| − 266.4, fitted to 12
 *     readings within 0.6 m, into the anchorages at about 43.7 m;
 *   - the anchorages: roadway decks between granite side masses whose tops
 *     carry the walkways (40–41 m) and a parapet (42–44 m) at |x| 20–22;
 *     corner pylons at the landward corners, |x| 18–28, y ±520–532, 56.8 m.
 * - Published (Wikipedia "Benjamin Franklin Bridge"; DRPA): main span
 *   1,750 ft; towers 385 ft (117 m) above the water; deck 128 ft wide;
 *   135 ft navigational clearance; seven lanes, two PATCO tracks and two
 *   walkways; the stiffening trusses "rise above the deck rather than lie
 *   beneath it", the tracks outboard of them; walkways elevated over the
 *   lanes; side spans 716.5 ft (218 m; 218.6 m here, tower to anchorage).
 * - Photos (Wikimedia Commons):
 *   - "Benjamin Franklin Bridge, Philadelphia side, Aug 2019" (Mys 721tx,
 *     CC BY-SA 3.0): the Pennsylvania tower from its pier, the whole bracing
 *     scheme above and below the deck, the flared feet, the deck's
 *     underside and outer girders;
 *   - "Ben Franklin Br" and "Ben Franklin Br - Train Crossing" (Michael
 *     Murphy, CC BY 2.0): the New Jersey tower and its X bracing, the
 *     walkway on brackets over the PATCO tracks;
 *   - "2012 Ben Franklin Bridge from Race Street Pier" and "2012 Ben
 *     Franklin Bridge west anchorage from south" (Beyond My Ken, CC BY-SA
 *     4.0): the tower bracing, the anchorage's rusticated side, its row of
 *     barred windows under the cornice, the corner pylon;
 *   - "Benjamin Franklin Bridge from below" (jm570, CC BY 2.0) and
 *     "Benjamin Franklin Bridge (19060494190)" (Thomas from Philadelphia
 *     Area, CC BY-SA 2.0): the tower below the deck, lattice bands and the
 *     arched opening above the pier;
 *   - "The Benjamin Franklin bridge in Philadelphia, PA." (Bruce
 *     Emmerling, CC0): the top lattice strut from the deck;
 *   - "Benjamin Franklin Bridge from Camden, NJ" (rocky8u, CC BY-SA 4.0):
 *     the whole span broadside, the cables meeting the truss at midspan,
 *     the Pennsylvania anchorage's pylon;
 *   - "Philadelphia anchor tower, Benjamin Franklin Bridge, July 2026"
 *     (Mr. Matté, CC BY-SA 4.0): the pylon's slit windows and stepped cap;
 *   - night: "Benjamin Franklin Bridge, Philadelphia (49055788621)" (Pierre
 *     Blaché, CC0), "2013 Ben Franklin Bridge at night" (Beyond My Ken,
 *     CC BY-SA 4.0), "Philadelphia209" and "Philadelphia212" (Diego Delso,
 *     CC BY-SA 4.0).
 *
 * What makes it the Ben Franklin: two pale-blue steel towers, each two
 * plain legs braced by a stack of three X panels above the deck under a
 * deep lattice strut, one X and two lattice bands below it, on flared feet
 * on a granite pier; two cables sagging down to the truss tops at midspan;
 * the deep truss band along the deck; the granite anchorages with their
 * tall pylons; and at night the cable "necklace" lights.
 *
 * Estimated from photos, scaled by the lidar heights: the bracing's levels
 * (top lattice strut 104.5–113 m; three equal X panels down to a strut at
 * 52–54 m; below the deck a lattice band 34–39.8 m, an X 18.5–34 m, a
 * lattice band 12.5–18.5 m, haunched corners down to the leg plinths); the
 * legs' depth along the bridge (6 m at the top, 7.2 m at the deck, flaring
 * to 9.8 m at the foot); members 1.9 m wide; the pier's top (5 m; the deck
 * hides it from the lidar except a 4–5 m reading beside it) and its
 * cutwater ends; the truss panels (8.9 m, Warren with posts); the deck's
 * depth under the roadway (2.8 m); the anchorages' windows and cornice.
 * The cables are drawn 1.4 m thick against the real 30 in (0.76 m), the
 * suspenders 0.35 m and one per 8.9 m panel.
 *
 * Colour: the towers' and deck's pale blue from daylight photos (#7b95a4
 * overcast, #759cc6 in sun, #afb4b9 hazy), pulled to the palette's
 * lightness; the anchorages' and piers' grey granite; the walkway and track
 * surfaces a mid grey.
 *
 * Night: the cables' necklace lights (DRPA, 1987; LED since 2015) as `lamp`
 * beads along both cables over all three spans; the towers floodlit warm
 * from inside the bracing, as the night photos show, through `_FLOODLIGHT`
 * on the paint near the towers; the green lights along the deck's outer
 * girders (in the 2013 and Delso photos) as small `neon` beads. One bead
 * per two suspenders, so they read as points.
 *
 * Shared code. The helpers exported below (lattice bands, X panels,
 * haunched knees, footed boxes, cables, beads and the two-LOD writer) are
 * also used by phl-walt-whitman-bridge.ts; this model's own build runs only
 * under `if (import.meta.main)`.
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { along, band, bead, footedWall, stations, strip, tube } from './bridge-kit'
import { beam, box, countParts, loftSolid, one, prism, type Skin } from './sf-golden-gate-bridge'
import { finish } from './palette'

export { beam, box, loftSolid, one, prism, type Skin }

const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

// ---- Shared helpers ----------------------------------------------------------

/**
 * A slab in a vertical plane across the bridge: the (x, z) outline `pts`
 * (convex from pts[0], which a fan reaches) extruded from y0 to y1.
 */
export function slabXZ(p: Part, pts: [number, number][], y0: number, y1: number) {
  const n = pts.length
  // Outline area sign, so faces wind outward whichever way pts run.
  let a = 0
  for (let i = 0; i < n; i++) { const [x0, z0] = pts[i], [x1, z1] = pts[(i + 1) % n]; a += x0 * z1 - x1 * z0 }
  const P = a > 0 ? pts : [...pts].reverse()
  // Seen from -y (front), (x, z) counter-clockwise is CCW on the screen.
  for (let i = 1; i < n - 1; i++) {
    p.tri([P[0][0], y0, P[0][1]], [P[i][0], y0, P[i][1]], [P[i + 1][0], y0, P[i + 1][1]])
    p.tri([P[0][0], y1, P[0][1]], [P[i + 1][0], y1, P[i + 1][1]], [P[i][0], y1, P[i][1]])
  }
  for (let i = 0; i < n; i++) {
    const [x0, z0] = P[i], [x1, z1] = P[(i + 1) % n]
    p.quad([x0, y0, z0], [x0, y1, z0], [x1, y1, z1], [x1, y0, z1])
  }
}

/**
 * A haunched knee in the corner between a leg's inner face (x = xi, the
 * opening on the side of sign `dir`) and a strut's face at height z: a
 * quarter-circle cut from a square of side r, hanging down (vdir −1) or
 * standing up (vdir +1).
 */
export function knee(p: Part, xi: number, dir: number, z: number, vdir: number, r: number, y0: number, y1: number, seg = 6) {
  // The arc's centre is r out from both faces; it runs from the leg to the strut.
  const pts: [number, number][] = [[xi, z]]
  for (let i = 0; i <= seg; i++) {
    const t = (Math.PI / 2) * (i / seg)
    pts.push([xi + dir * r - dir * r * Math.cos(t), z + vdir * r - vdir * r * Math.sin(t)])
  }
  slabXZ(p, pts, y0, y1)
}

/**
 * A lattice strut between the legs (|x| < xi), z0..z1, in the plane y = 0:
 * a top and a bottom chord and `cells` square-ish cells, each a post and an
 * X of light members, as the towers' latticed struts read from a distance.
 */
export function latticeBand(lit: Skin, xi: number, z0: number, z1: number, cells: number, depth: number,
  { chord = 1.5, post = 0.8, member = 0.6, r = 0.15, back }: { chord?: number; post?: number; member?: number; r?: number; back?: Part } = {}) {
  box(lit, -xi, xi, -depth / 2, depth / 2, z1 - chord, z1, { r })
  box(lit, -xi, xi, -depth / 2, depth / 2, z0, z0 + chord, { r })
  const w = (2 * xi) / cells, za = z0 + chord, zb = z1 - chord
  for (let k = 1; k < cells; k++) {
    const x = -xi + k * w
    box(lit, x - post / 2, x + post / 2, -depth / 2 + 0.1, depth / 2 - 0.1, za, zb, { r: 0, bottom: false })
  }
  if (back) {
    // Far view: the lattice as a darker web across the cells, both faces.
    for (const y of [-0.15, 0.15]) {
      const n = Math.sign(y)
      const q: V3[] = [[-xi, y, za], [xi, y, za], [xi, y, zb], [-xi, y, zb]]
      if (n < 0) back.quad(q[0], q[1], q[2], q[3]); else back.quad(q[1], q[0], q[3], q[2])
    }
    return
  }
  for (let k = 0; k < cells; k++) {
    const xa = -xi + k * w + post / 2, xb = -xi + (k + 1) * w - post / 2
    beam(lit, [xa, 0, za], [xb, 0, zb], member, depth * 0.6)
    beam(lit, [xa, 0, zb], [xb, 0, za], member, depth * 0.6)
  }
}

/** An X panel between the legs' inner faces (±xi), z0..z1, members w wide and t deep. */
export function xBrace(lit: Skin, xi: number, z0: number, z1: number, w: number, t: number, inset = 0.6) {
  beam(lit, [-xi, 0, z1 - inset], [xi, 0, z0 + inset], w, t)
  beam(lit, [xi, 0, z1 - inset], [-xi, 0, z0 + inset], w, t)
}

/** A plain horizontal strut between the legs. */
export function strut(lit: Skin, xi: number, z0: number, z1: number, depth: number, r = 0.2) {
  box(lit, -xi - 0.2, xi + 0.2, -depth / 2, depth / 2, z0, z1, { r })
}

/**
 * A box standing on the terrain: four walls from the ground (sampled every
 * `step` m along their feet) up to `top(x, y)`, and a flat top at `topZ`
 * drawn as a fan when `lid` is set. For anchorage masses and pylons.
 */
export function footedBox(p: Part, x0: number, x1: number, y0: number, y1: number,
  ground: (x: number, y: number) => number, top: (x: number, y: number) => number, lid = true, step = 6) {
  footedWall(p, [x0, y0], [x1, y0], ground, top, [0, -1, 0], step)
  footedWall(p, [x1, y0], [x1, y1], ground, top, [1, 0, 0], step)
  footedWall(p, [x1, y1], [x0, y1], ground, top, [0, 1, 0], step)
  footedWall(p, [x0, y1], [x0, y0], ground, top, [-1, 0, 0], step)
  if (lid) {
    const c: V3[] = [[x0, y0, top(x0, y0)], [x1, y0, top(x1, y0)], [x1, y1, top(x1, y1)], [x0, y1, top(x0, y1)]]
    p.tri(c[0], c[1], c[2], undefined, undefined, undefined, [[0, 0, 1], [0, 0, 1], [0, 0, 1]])
    p.tri(c[0], c[2], c[3], undefined, undefined, undefined, [[0, 0, 1], [0, 0, 1], [0, 0, 1]])
  }
}

/** A flat panel on a vertical wall facing n (±x or ±y), centred at c, w wide and h tall, `off` proud. */
export function wallPanel(p: Part, c: V3, n: V3, w: number, h: number, off = 0.05) {
  const u: V3 = norm(cross([0, 0, 1], n)) // across the face, to the right seen from outside
  const o: V3 = [c[0] + n[0] * off, c[1] + n[1] * off, c[2]]
  const at = (su: number, sz: number): V3 => [o[0] + u[0] * su, o[1] + u[1] * su, o[2] + sz]
  p.quad(at(-w / 2, -h / 2), at(w / 2, -h / 2), at(w / 2, h / 2), at(-w / 2, h / 2))
}

/** Points along a cable through every station of `ys` (sorted), at height z(y), x fixed. */
export function cableLine(x: number, ys: number[], z: (y: number) => number): V3[] {
  return ys.map((y) => [x, y, z(y)] as V3)
}

/** Sorted, de-duplicated stations. */
export function merge(...lists: number[][]): number[] {
  return [...new Set(lists.flat().map((v) => Math.round(v * 1000) / 1000))].sort((a, b) => a - b)
}

/** A floodlight wash for steel within `half` metres of y = ±ty: the bracing (|x| < xi) full, legs a little less, faces looking up little. */
export function towerWash(ty: number, half: number, xi: number) {
  return (p: V3, n: V3): number => {
    if (Math.abs(Math.abs(p[1]) - ty) > half) return 0
    const k = Math.abs(p[0]) < xi ? 1 : 0.7
    return k * (n[2] > 0.7 ? 0.35 : 1)
  }
}

export type Lod = { part: Part; material: MaterialSpec }[]

/** Checks both levels of detail against their budgets and writes them. */
export async function writeLods(id: string, name: string, low: Lod, detail: Lod, extras: Record<string, unknown>,
  { maxLow = 6500, maxDetail = 40000 } = {}) {
  for (const [file, list, maxTris, maxBytes] of [
    [`${id}.glb`, low, maxLow, 250 * 1024],
    [`${id}.detail.glb`, detail, maxDetail, 1536 * 1024],
  ] as const) {
    const parts = list.filter((p) => p.part.triangles > 0)
    if (process.env.DEBUG) console.log(file, parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
    const tris = countParts(parts)
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb(name, parts, extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes, ${parts.length} materials`)
  }
}

// ---- The Ben Franklin Bridge ------------------------------------------------------

const T = 266.4            // tower centres at y = ±T (lidar)
const FACE = 485           // anchorages' river faces, |y| (OSM)
const END = 532            // anchorages' landward faces, |y| (OSM)
const CX = 13.4            // cable and truss planes, |x| (lidar)
const XI = 11.2            // legs' inner faces, |x|
const XO = 15.6            // legs' outer faces, |x|

/** The roadway, metres above the water (lidar). */
const road = (y: number): number => {
  const a = Math.abs(y)
  return a <= T ? 47.4 - 6.2e-5 * y * y : 43.0 - 0.0345 * (a - T)
}
const walk = (y: number) => road(y) + 5.6
const trussTop = (y: number) => road(y) + 9.6
/** The main cables' centre line (lidar fits). */
const cableZ = (y: number): number => {
  const a = Math.abs(y)
  const z = a <= T ? 57.6 + (117.0 - 57.6) * (y / T) ** 2 : 117 - 0.5264 * (a - T) + 0.000883 * (a - T) ** 2
  return Math.max(z, trussTop(y) + 0.6)
}

/** Ground under the anchorages, above the map's water (Mapterhorn fits). */
const ground = (x: number, y: number): number => (y < 0 ? 3.4 + (2.1 * (Math.abs(y) - FACE)) / (END - FACE) : 3.7)

/** One tower, centred on its pier, into the parts given. */
function tower(lit: Part, shade: Part, granite: Part, detail: boolean) {
  const L = one(lit), G = one(granite)
  // Pier: rectangular with pointed cutwater ends across the bridge (OSM).
  const plan: [number, number][] = [[-18.5, -10.6], [18.5, -10.6], [21.0, -5.5], [22.2, 0], [21.0, 5.5], [18.5, 10.6],
    [-18.5, 10.6], [-21.0, 5.5], [-22.2, 0], [-21.0, -5.5]]
  prism(G, plan, 0, 5.2, false)
  prism(G, plan.map(([x, y]) => [x * 0.97, y * 0.94] as [number, number]), 5.2, 6.0, false)
  for (const s of [-1, 1]) {
    const [a, b] = s > 0 ? [CX - 3.3, CX + 3.3] : [-CX - 3.3, -CX + 3.3]
    box(G, a, b, -5.6, 5.6, 6.0, 8.0, { r: 0.4, top: 0.3, bottom: false })
  }
  // Legs: plain box columns, flared at the foot, tapering a little along
  // the bridge, capped under the cable saddles.
  for (const s of [-1, 1]) {
    const ring = (z: number, hx: number, hy: number, r: number): V3[] => {
      const x0 = s * CX - hx, x1 = s * CX + hx
      return r > 0
        ? [[x0 + r, -hy, z], [x1 - r, -hy, z], [x1, -hy + r, z], [x1, hy - r, z], [x1 - r, hy, z], [x0 + r, hy, z], [x0, hy - r, z], [x0, -hy + r, z]]
        : [[x0, -hy, z], [x1, -hy, z], [x1, hy, z], [x0, hy, z]]
    }
    const r = detail ? 0.35 : 0
    loftSolid(L, [ring(8.0, 3.0, 4.9, r), ring(10.6, 2.45, 4.0, r), ring(13.8, 2.2, 3.7, r), ring(43, 2.2, 3.6, r), ring(114.6, 2.2, 3.0, r)], [false, true])
    box(L, s * CX - 2.45, s * CX + 2.45, -3.3, 3.3, 114.6, 116.4, detail ? { r: 0.3, top: 0.3 } : { r: 0 })
    // Saddle housing: a low hood along the bridge over the cable.
    const R = 3.2, C = 114.7, Y = 3.0
    const hood = (x: number): V3[] => [[x, -Y, 116.4], [x, Y, 116.4],
      ...Array.from({ length: 7 }, (_, i) => { const y = Y - (2 * Y * i) / 6; return [x, y, Math.max(116.4, C + Math.sqrt(R * R - y * y))] as V3 })]
    loftSolid(L, [hood(s * CX - 1.3), hood(s * CX + 1.3)])
  }
  // Above the deck: the deep lattice strut at the top, haunched into the legs.
  const D = 2.4, W = 1.9, Tk = 1.6
  const lat = detail ? { r: 0.15 } : { r: 0, back: shade }
  latticeBand(L, XI, 104.5, 113.0, 5, D, { chord: 1.6, post: 0.9, member: 0.6, ...lat })
  for (const s of [-1, 1]) knee(lit, s * XI, -s, 104.5, -1, 3.2, -D / 2, D / 2, detail ? 6 : 3)
  // Three X panels down to a strut just above the deck; a bar at each crossing.
  const levels = [104.5, 87.3, 70.15, 53.0]
  for (let i = 0; i < 3; i++) {
    const zt = levels[i], zb = levels[i + 1]
    xBrace(L, XI, zb, zt, W, Tk)
    const zc = (zt + zb) / 2
    const sr = detail ? 0.2 : 0
    strut(L, XI, zc - 0.6, zc + 0.6, 1.3, sr)
    if (i < 2) strut(L, XI, zb - 0.9, zb + 0.9, Tk, sr)
  }
  strut(L, XI, 52.0, 54.0, 1.8, detail ? 0.2 : 0)
  // Below the deck: a lattice band under the deck, one X, a lattice band
  // over the opening, whose corners are haunched down to the plinths.
  latticeBand(L, XI, 34.0, 39.8, 5, D, { chord: 1.3, post: 0.8, member: 0.5, ...lat })
  xBrace(L, XI, 18.5, 34.0, W, Tk)
  latticeBand(L, XI, 12.5, 18.5, 5, D, { chord: 1.3, post: 0.8, member: 0.5, ...lat })
  for (const s of [-1, 1]) knee(lit, s * XI, -s, 12.5, -1, 4.0, -D / 2, D / 2, detail ? 6 : 3)
}

if (import.meta.main) {
  // Parts per level of detail.
  const mk = () => ({ lit: new Part(), shade: new Part(), granite: new Part(), deck: new Part(), lamp: new Part(), neon: new Part() })
  const low = mk(), det = mk()

  // Towers, built at the origin and moved to ±T.
  const place = (dst: Part, src: Part, dy: number) => {
    for (let i = 0; i < src.pos.length; i += 3) { dst.pos.push(src.pos[i], src.pos[i + 1], src.pos[i + 2] - dy); }
    dst.nrm.push(...src.nrm); dst.uv.push(...src.uv)
  }
  for (const [lod, detail] of [[low, false], [det, true]] as const) {
    const t = { lit: new Part(), shade: new Part(), granite: new Part() }
    tower(t.lit, t.shade, t.granite, detail)
    for (const dy of [-T, T]) for (const k of ['lit', 'shade', 'granite'] as const) place(lod[k], t[k], dy)
  }

  // ---- Deck ----
  const spans: [number, number][] = [[-FACE, -T - 3.3], [-T + 3.3, T - 3.3], [T + 3.3, FACE]]
  const curve = ([a, b]: [number, number], step: number) => stations(a, b, step)
  const whole = merge(curve([-FACE, -T], 40), curve([-T, T], 40), curve([T, FACE], 40))
  const wholeDet = merge(curve([-FACE, -T], 15), curve([-T, T], 15), curve([T, FACE], 15))
  const PANEL = 8.9

  for (const [lod, detail] of [[low, false], [det, true]] as const) {
    const ys = detail ? wholeDet : whole
    for (const s of [-1, 1]) {
      // Outer girder along the track deck's edge.
      band(lod.lit, s * 20.0, s * 20.5, ys, (y) => road(y) + 1.2, (y) => road(y) - 2.8, { out: true, in: true, top: true })
      // PATCO track bed, outboard of the truss (the model owns it).
      band(lod.deck, s * 17.8, s * 20.0, ys, (y) => road(y) + 0.3, (y) => road(y) + 0.3, { top: true })
      // The truss: top chord, and in the low model big diagonals; in the
      // detail a Warren truss with posts.
      for (const span of spans) {
        const cys = curve(span, detail ? 15 : 40)
        band(lod.lit, s * (CX - 0.6), s * (CX + 0.6), cys, (y) => trussTop(y), (y) => trussTop(y) - 1.1, { out: true, in: true, top: true, bottom: true, ends: true })
        if (detail) band(lod.lit, s * (CX - 0.6), s * (CX + 0.6), cys, (y) => road(y) - 0.2, (y) => road(y) - 1.6, { out: true, in: true, top: true })
        const ps = stations(span[0], span[1], detail ? PANEL : 2 * PANEL)
        for (let i = 0; i < ps.length - 1; i++) {
          const [ya, yb] = i % 2 ? [ps[i], ps[i + 1]] : [ps[i + 1], ps[i]]
          tube(lod.lit, [[s * CX, ya, road(ya) - 0.4], [s * CX, yb, trussTop(yb) - 0.9]], detail ? 0.32 : 0.5, detail ? 4 : 3)
          if (detail) tube(lod.lit, [[s * CX, ps[i], road(ps[i]) - 0.4], [s * CX, ps[i], trussTop(ps[i]) - 0.9]], 0.25, 4)
        }
        // Suspenders, one per panel point (detail only).
        if (detail) for (const y of stations(span[0], span[1], PANEL)) {
          const z1 = cableZ(y) - 0.5, z0 = trussTop(y)
          if (z1 - z0 > 1.0) tube(lod.lit, [[s * CX, y, z0], [s * CX, y, z1]], 0.18, 4)
        }
      }
      // Walkway on brackets outboard of the truss: its floor (the model's),
      // its outer edge rising as the railing; around the towers it steps out
      // past the legs.
      const wz = (y: number) => walk(y)
      const runs: [number, number, number, number][] = [
        [-END, -T - 4.8, 14.6, 17.6], [-T - 4.8, -T + 4.8, 15.8, 18.6], [-T + 4.8, T - 4.8, 14.6, 17.6],
        [T - 4.8, T + 4.8, 15.8, 18.6], [T + 4.8, END, 14.6, 17.6]]
      for (const [a, b, xi, xo] of runs) {
        const rys = stations(a, b, detail ? 15 : 40)
        band(lod.deck, s * xi, s * xo, rys, wz, wz, { top: true })
        band(lod.lit, s * xi, s * xo, rys, (y) => wz(y) - 0.02, (y) => wz(y) - 0.9, { bottom: true, in: detail, ends: Math.abs(b - a) < 12 })
        band(lod.lit, s * xo, s * (xo + 0.25), rys, (y) => wz(y) + 1.25, (y) => wz(y) - 0.9, { out: true, top: true, in: detail })
        if (detail) {
          // Railing: a top rail and posts on the inner edge too, and the
          // brackets under the floor down to the track deck's edge.
          band(lod.lit, s * (xi - 0.1), s * xi, rys, (y) => wz(y) + 1.2, (y) => wz(y) + 1.0, { out: true, in: true, top: true })
          for (const y of stations(a, b, 3)) tube(lod.lit, [[s * xi, y, wz(y)], [s * xi, y, wz(y) + 1.05]], 0.06, 3)
          for (const y of stations(a, b, PANEL)) {
            if (Math.abs(y) > FACE - 2.5) continue
            strip(lod.lit, [s * (xo - 0.3), y, wz(y) - 0.9], [s * 19.6, y - 2.2, road(y) + 1.1], 0.45, [0, 1, 0])
            strip(lod.lit, [s * (xo - 0.3), y, wz(y) - 0.9], [s * 19.6, y + 2.2, road(y) + 1.1], 0.45, [0, 1, 0])
          }
        }
      }
    }
    // The deck's underside, facing down, edge to edge; floor beams in the detail.
    band(lod.shade, -20.5, 20.5, ys, (y) => road(y) - 2.8, (y) => road(y) - 2.8, { bottom: true })
    if (detail) for (const y of stations(-FACE, FACE, PANEL)) {
      if (Math.abs(Math.abs(y) - T) < 4) continue
      band(lod.shade, -20.0, 20.0, [y - 0.3, y + 0.3], () => road(y) - 0.6, () => road(y) - 2.75, { out: false, in: false, bottom: true, ends: true })
    }

    // ---- Cables, saddle to saddle to anchorage ----
    const cys = merge(curve([-492, -T], detail ? 8 : 28), curve([-T, T], detail ? 10 : 33.3), curve([T, 492], detail ? 8 : 28))
    for (const s of [-1, 1]) tube(lod.lit, cableLine(s * CX, cys, cableZ), 0.7, detail ? 10 : 6)
    // Necklace lights on both cables, one per two suspenders.
    for (const s of [-1, 1]) {
      const main = cableLine(s * CX, merge(curve([-T + 4, T - 4], 5)), (y) => cableZ(y) + 0.9)
      for (const p of along(main, detail ? 30 : 22)) bead(lod.lamp, p, detail ? 0.75 : 0.9, !detail)
      for (const sy of [-1, 1]) {
        const side = cableLine(s * CX, merge(curve(sy < 0 ? [-FACE + 6, -T - 4] : [T + 4, FACE - 6], 5)), (y) => cableZ(y) + 0.9)
        for (const p of along(side, detail ? 12 : 8)) bead(lod.lamp, p, detail ? 0.75 : 0.9, !detail)
      }
      // Green lights along the outer girders (detail only: in the far view
      // they would cost more file than they show).
      if (detail) for (const y of stations(-FACE + 10, FACE - 10, 12)) {
        if (Math.abs(Math.abs(y) - T) < 6) continue
        bead(lod.neon, [s * 20.75, y, road(y) - 2.0], detail ? 0.45 : 0.6, !detail)
      }
    }

    // ---- Anchorages ----
    for (const sy of [-1, 1]) {
      const yr = sy * FACE, yl = sy * END
      const [y0, y1] = sy < 0 ? [yl, yr] : [yr, yl]
      const g = (x: number, y: number) => ground(x, y)
      const G = lod.granite
      // The middle, under the roadways: river and landward faces, and a
      // roof 0.3 m under the map's roadways.
      for (const yy of [yr, yl]) footedWall(G, [-12.3, yy], [12.3, yy], g, (_x, y) => road(y) - 0.3, [0, Math.sign(yy) * (yy === yr ? -1 : 1), 0], 12.3)
      band(G, -12.3, 12.3, stations(y0, y1, 50), (y) => road(y) - 0.3, (y) => road(y) - 0.3, { top: true })
      for (const s of [-1, 1]) {
        // Side masses carrying the walkways, and the parapet on the outer edge.
        const [ma, mb] = s > 0 ? [12.3, 20.3] : [-20.3, -12.3]
        const [pa, pb] = s > 0 ? [20.3, 21.6] : [-21.6, -20.3]
        footedBox(G, Math.min(ma, pa), Math.max(mb, pb), y0, y1, g, (_x, y) => walk(y) - 0.4, true, 12)
        band(G, pa, pb, stations(y0, y1, 50), (y) => walk(y) + 2.6, (y) => walk(y) - 0.4, { in: true, out: true, top: true, ends: true })
        // Cornice under the parapet, and the row of barred windows below it.
        band(G, s * 21.6, s * 22.1, stations(y0, y1, 50), (y) => walk(y) + 1.2, (y) => walk(y) + 0.4, { out: true, top: true, bottom: true, ends: true })
        for (let k = 0; k < 6; k++) {
          const y = sy * (FACE + 3.5 + k * 5.4)
          wallPanel(lod.deck, [s * 21.6, y, walk(y) - 3.0], [s, 0, 0], 2.0, 3.4)
        }
        // Landward corner pylon: a granite tower with a cornice, a stepped
        // cap and four slit windows a side under it.
        const [px0, px1] = s > 0 ? [18.2, 28.2] : [-28.2, -18.2]
        const [py0, py1] = sy < 0 ? [-END + 0.2, -END + 12.2] : [END - 12.2, END - 0.2]
        footedBox(G, px0, px1, py0, py1, g, () => 53.2, false, 12)
        box(one(G), px0 - 0.4, px1 + 0.4, py0 - 0.4, py1 + 0.4, 53.2, 54.4, { r: 0.2 })
        box(one(G), px0 + 0.3, px1 - 0.3, py0 + 0.3, py1 - 0.3, 54.4, 56.8, { r: 0.2, top: 0.5, bottom: false })
        for (const [n, c0, len] of [[[0, -1, 0], (px0 + px1) / 2, px1 - px0], [[0, 1, 0], (px0 + px1) / 2, px1 - px0],
          [[1, 0, 0], (py0 + py1) / 2, py1 - py0], [[-1, 0, 0], (py0 + py1) / 2, py1 - py0]] as [V3, number, number][]) {
          for (let k = 0; k < 4; k++) {
            const u = -len / 2 + (len * (k + 0.5)) / 4
            const c: V3 = n[0] === 0 ? [c0 + u, n[1] < 0 ? py0 : py1, 50.6] : [n[0] > 0 ? px1 : px0, c0 + u, 50.6]
            wallPanel(lod.deck, c, n, 0.9, 3.2)
          }
        }
      }
    }
  }

  // ---- Materials ----
  const wash = towerWash(T, 7, XI + 0.5)
  const BLUE: MaterialSpec = { ...finish('bfb-blue', 0x98b6cb), floodlight: wash }
  const BLUE_SHADE: MaterialSpec = { ...finish('bfb-blue-shade', 0x7f9cb1) }
  const GRANITE: MaterialSpec = finish('granite', 0xc8c3b8)
  const DECK: MaterialSpec = finish('deck', 0x8b9095)
  const LAMP: MaterialSpec = { name: 'lamp', color: 0x98b6cb, roughness: 0.85 }
  const NEON: MaterialSpec = finish('neon-bfb-green', 0x46b98c)
  const lod = (m: ReturnType<typeof mk>, detail: boolean): Lod => [
    { part: m.lit, material: detail ? { ...BLUE, doubleSided: true } : BLUE },
    { part: m.shade, material: BLUE_SHADE },
    { part: m.granite, material: GRANITE },
    { part: m.deck, material: DECK },
    { part: m.lamp, material: LAMP },
    { part: m.neon, material: NEON },
  ]
  await writeLods('phl-ben-franklin-bridge', 'Benjamin Franklin Bridge', lod(low, false), lod(det, true), {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin midway between the towers, on the water',
    bearing: 102.716, elevation: 0, towers: [-T, T], ends: [-END, END],
    roadwayMidspan: road(0), roadwayAtTowers: road(T), roadwayAtAnchorages: road(FACE), roadwayEnds: road(END),
  })
}
