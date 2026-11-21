/**
 * Grand Canyon Skywalk (2007; Hualapai Tribe, design Mark Ross Johnson,
 * engineering Lochsa Engineering) at Eagle Point, Grand Canyon West —
 * procedural, CC0-1.0, no textures.
 * bun generators/grand-canyon-skywalk.ts
 *
 * The glass-floored horseshoe cantilevered over the canyon from the rim,
 * and the terracotta visitor building that stands over its roots: OSM maps
 * the two as one structure (the building way/170214302 is "Grand Canyon
 * Skywalk", Q1542550, with the horseshoe footway running off its canyon
 * face), so the model carries both. The horseshoe is a pair of steel box
 * girders with the glass walkway between them and glass parapets on top;
 * the floor and the parapets are translucent, so the girders and the void
 * read through them. Under the building's canyon side, a rock-coloured base
 * runs down to the map's terrain: the map's DEM rounds the rim off about
 * 10 m inside the real edge, and the base keeps the building from floating
 * over that slope (it reads as the cliff, as it does in photos).
 *
 * Frame: x towards 120° (out over the canyon), y towards 30°, z up,
 * metres. Origin at the catalog anchor (-113.81105, 36.01203). z = 0 is the
 * lowest map ground under the footprint, under the horseshoe's south-east
 * corner (`Z0` above the terrain grid's datum, 1240.92 m).
 *
 * Sources:
 * - OSM (API, 2026-11-20): way/170214302 (building, "Grand Canyon
 *   Skywalk", ele 1450, start_date 2007, operator Hualapai Tribal Council),
 *   the building's plan, used as mapped; way/170214301 (footway, bridge=yes,
 *   surface=glass, width 3.1), the horseshoe's side and width. Its tip
 *   runs 20 m out from the building where NAIP shows 12 m; the NAIP length
 *   is used.
 * - USGS NAIP (public domain, 0.15 m): the horseshoe's outer width (20 m)
 *   and how far it stands out from the building (12 m); the building's
 *   terraced blocks and the tower on its north side.
 * - Map terrain (tools/terrain.ts grid, Mapterhorn z15, 5 m, `GROUND`): the
 *   rim at 211 m above the grid's datum, the rounded edge under the
 *   building's canyon side.
 * - Published (Wikipedia "Grand Canyon Skywalk"; grandcanyonwest.com):
 *   opened 2007; projects 70 ft (21 m) from the rim; 10 ft (3 m) wide
 *   walkway between steel box beams; glass floor and walls; about 4,000 ft
 *   over the river, 500–800 ft over the ledges directly beneath.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - "Grand Canyon Skywalk - aerial.jpg", Werner Keulen (labete),
 *     CC BY-SA 3.0 (the horseshoe off the building's canyon face, the
 *     terracotta blocks and terraces);
 *   - "Grand Canyon Skywalk 09 2017 4832.jpg", Mariordo (Mario Roberto Durán
 *     Ortiz), CC BY-SA 4.0 (from below along the cliff: the horseshoe level
 *     with the rim, the building's height against it, the tall block);
 *   - "Back of Skywalk Grand Canyon 2014 - panoramio.jpg", Robert Meszaros,
 *     CC BY 3.0 (the landward side: stepped parapets, the stair tower).
 * - Estimated from photos: girder depth (1.8 m), parapet height (1.5 m),
 *   building heights (8 m main body, 12 m upper block, 16 m tower).
 *
 * Doubts: OSM's building plan sits about 5–7 m east of NAIP's; it is kept,
 * since the map replaces that outline. The building's massing is simplified
 * to three tiers. The visitor centre's separate tensile canopy and the
 * other Eagle Point buildings are left out.
 *
 * Night: the canyon-face glazing is `window`; the glass stays dark.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { face, footedLoft, groundAt, type GroundGrid } from './bridge-kit'

// Map terrain (tools/terrain.ts grid -113.81105 36.01203 45 5 --bearing 30),
// metres above 1240.92 m.
const GROUND: GroundGrid = {"y0":-45,"x0":-45,"step":5,"z":[[211.7,211.8,211.9,212,212,212,212,211.9,211.8,211.8,211.7,211.5,211,208.1,196.4,171.6,138.4,103.5,69.2],[211.6,211.7,211.7,211.8,211.8,211.9,211.8,211.8,211.7,211.7,211.6,211.4,210.5,204.9,188.2,160.3,128,95.2,63],[211.5,211.6,211.7,211.7,211.8,211.8,211.7,211.7,211.7,211.6,211.5,211.3,209.2,199.9,179.2,150.7,120.2,90.8,60.7],[211.4,211.4,211.5,211.6,211.6,211.6,211.6,211.6,211.6,211.5,211.4,210.9,207,194.2,171.1,142.1,114.5,89.6,60.5],[211.3,211.4,211.4,211.5,211.5,211.5,211.5,211.5,211.4,211.4,211.3,210.2,204.6,189.9,164.3,134.8,110.5,87.9,57.7],[211.2,211.2,211.3,211.3,211.4,211.4,211.4,211.4,211.3,211.3,211,209.1,202.5,186,158.3,129.2,106.1,82,50.2],[211.1,211.1,211.2,211.2,211.3,211.3,211.3,211.3,211.3,211.2,210.2,207,198.2,178.5,150.3,122.1,97.4,70.2,39.7],[211,211.1,211.1,211.2,211.2,211.3,211.3,211.3,211.3,210.8,208.7,202.8,189.3,166.4,138.1,110,82.6,54.6,27.4],[210.9,211,211,211.1,211.2,211.2,211.2,211.2,211.1,210.1,206.1,196,177.1,151.3,122.4,93.5,65.4,38.9,15.8],[210.8,210.9,211,211.1,211.1,211.2,211.2,211.2,211,209.2,202.9,187.8,163.8,135.2,105.6,76.7,49.6,26,7.5],[210.8,210.9,211,211,211.1,211.2,211.3,211.2,210.9,208.7,200.2,181,152.6,121.2,90.9,62.7,37.5,17,2.7],[210.8,210.9,211,211,211.1,211.2,211.2,211.2,210.8,208.1,198.3,176.6,145.2,111.5,80.8,53.2,29.4,11.4,0.5],[210.8,210.8,210.9,211,211,211.1,211.1,211.1,210.6,207.5,196.5,173.4,140,105.6,75.5,47.9,24.5,8.6,0],[210.8,210.8,210.8,210.8,210.9,210.9,210.9,210.9,210.2,206.7,195,170.4,136.8,103.6,73.4,45.4,22.6,8.6,0.8],[210.7,210.7,210.7,210.6,210.5,210.5,210.5,210.4,209.7,206,193.7,168.7,136.1,103.5,72.7,44.6,23.5,10.6,2.9],[210.5,210.4,210.3,210.2,210.1,210,209.9,209.8,209.2,205.1,192.5,168.2,136.5,103.8,73.1,45.9,25.8,13.6,6.3],[209.9,209.8,209.6,209.4,209.2,209.1,209,208.8,207.8,203,190.3,166.6,136,105.1,75.7,49.2,29.3,17.6,10.9],[208.5,208.3,208.1,207.6,207.1,206.8,206.7,206.1,203.5,197.2,183.8,161,134,107.3,80.5,55.1,35.3,23.4,16.9],[204.7,204.2,203.2,202.1,200.9,199.8,199.2,197.8,193.6,185.5,171.5,152,130.8,109.4,86.5,63.2,43.6,30.8,23.8]]}
const BEARING = 30
const rad = (BEARING * Math.PI) / 180
/** OSM metres east/north of the anchor to the model frame. */
const toModel = ([e, n]: [number, number]): [number, number] => [e * Math.cos(rad) - n * Math.sin(rad), e * Math.sin(rad) + n * Math.cos(rad)]

// way/170214302, metres east/north of the anchor, counter-clockwise.
const BUILDING = ([[-1.6, -24.0], [5.7, -11.5], [7.5, -8.4], [11.2, -10.6], [16.2, -2.1], [10.8, 1.0], [12.7, 4.3], [15.2, 8.7], [7.2, 13.3], [8.8, 15.9], [-4.1, 23.3], [-10.4, 12.5], [-6.6, 10.3], [-20.3, -13.3]] as [number, number][]).map(toModel)

// Horseshoe: centre-line legs at y = −7 and +10, semicircle beyond.
const HY = 1.5, HR = 8.5, LEG0 = 9, HC = 17 // legs from x = 9 into the building; arc centre x = 17
const path: [number, number][] = []
for (let x = LEG0; x < HC; x += 4) path.push([x, HY - HR])
for (let i = 0; i <= 12; i++) {
  const a = -Math.PI / 2 + (Math.PI * i) / 12
  path.push([HC + HR * Math.cos(a), HY + HR * Math.sin(a)])
}
for (let x = HC - 4; x >= LEG0; x -= 4) path.push([x, HY + HR])

const inPlan = ([x, y]: [number, number]) => {
  let inside = false
  for (let i = 0, j = BUILDING.length - 1; i < BUILDING.length; j = i++) {
    const [xi, yi] = BUILDING[i], [xj, yj] = BUILDING[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}
// z = 0: the lowest map ground under the plan (building and horseshoe).
const raw = (x: number, y: number) => groundAt(GROUND, x, y)
const Z0 = (() => {
  let lo = Infinity
  for (let x = -30; x <= HC + HR + 2.5; x += 0.5)
    for (let y = -30; y <= 30; y += 0.5) {
      const onShoe = Math.hypot(x - HC, y - HY) <= HR + 2.2 && x >= HC ? true
        : x >= LEG0 && x <= HC && (Math.abs(y - (HY - HR)) <= 2.2 || Math.abs(y - (HY + HR)) <= 2.2)
      if (onShoe || inPlan([x, y])) lo = Math.min(lo, raw(x, y))
    }
  return lo
})()
const ground = (x: number, y: number) => Math.max(0, raw(x, y) - Z0)
const RIM = 211.0 - Z0 // the rim and the walkway's floor

/** Plan centre-line offsets: a box swept along `path` between offsets a..b (left of travel) and z0..z1. */
function sweep(p: Part, a: number, b: number, z0: number, z1: number, faces: { top?: boolean; bottom?: boolean; sides?: boolean }) {
  const off = (i: number, d: number): [number, number] => {
    const [x, y] = path[i]
    const [px, py] = path[Math.max(0, i - 1)], [nx, ny] = path[Math.min(path.length - 1, i + 1)]
    const tx = nx - px, ty = ny - py, l = Math.hypot(tx, ty)
    return [x - (ty / l) * d, y + (tx / l) * d]
  }
  for (let i = 0; i < path.length - 1; i++) {
    const [a0, a1, b0, b1] = [off(i, a), off(i + 1, a), off(i, b), off(i + 1, b)]
    const v = (q: [number, number], z: number): V3 => [q[0], q[1], z]
    const side = (q0: [number, number], q1: [number, number], sgn: number): V3 => {
      const tx = q1[0] - q0[0], ty = q1[1] - q0[1]
      return [-ty * sgn, tx * sgn, 0]
    }
    if (faces.top) face(p, v(a0, z1), v(a1, z1), v(b1, z1), v(b0, z1), [0, 0, 1])
    if (faces.bottom) face(p, v(a0, z0), v(a1, z0), v(b1, z0), v(b0, z0), [0, 0, -1])
    if (faces.sides) {
      face(p, v(a0, z0), v(a1, z0), v(a1, z1), v(a0, z1), side(a0, a1, Math.sign(a - b)))
      face(p, v(b0, z0), v(b1, z0), v(b1, z1), v(b0, z1), side(b0, b1, Math.sign(b - a)))
    }
  }
}

/** A plan polygon scaled about a point. */
const shrink = (pts: [number, number][], c: [number, number], k: number) => pts.map(([x, y]) => [c[0] + (x - c[0]) * k, c[1] + (y - c[1]) * k] as [number, number])

/** Ear-clipping triangulation of a simple CCW polygon, as index triples. */
function earcut(pts: [number, number][]): [number, number, number][] {
  const idx = pts.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: number[], b: number[], c: number[]) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 1000) {
    for (let k = 0; k < idx.length; k++) {
      const [i, j, l] = [idx[(k + idx.length - 1) % idx.length], idx[k], idx[(k + 1) % idx.length]]
      if (cr(pts[i], pts[j], pts[l]) <= 0) continue
      const inside = idx.some((m) => m !== i && m !== j && m !== l && cr(pts[i], pts[j], pts[m]) >= 0 && cr(pts[j], pts[l], pts[m]) >= 0 && cr(pts[l], pts[i], pts[m]) >= 0)
      if (inside) continue
      out.push([i, j, l])
      idx.splice(k, 1)
      break
    }
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}

/** A prism on a plan polygon (CCW), from z0 to z1, capped. */
function prism(p: Part, pts: [number, number][], z0: number, z1: number) {
  const lo = pts.map(([x, y]) => [x, y, z0] as V3), hi = pts.map(([x, y]) => [x, y, z1] as V3)
  p.loft([lo, hi])
  for (const [a, b, c] of earcut(pts)) p.tri(hi[a], hi[b], hi[c])
}

function build() {
  const wall = new Part(), rock = new Part(), steel = new Part(), glass = new Part(), win = new Part()
  // The building: a rock base on the map's ground up to the rim, the
  // terracotta body on it, an upper block and the tower.
  footedLoft(rock, ground, [{ plan: BUILDING, z: 'ground' }, { plan: BUILDING, z: RIM - 0.3 }], 3, false)
  prism(wall, BUILDING, RIM - 0.3, RIM + 8)
  const c: [number, number] = [BUILDING.reduce((s, q) => s + q[0], 0) / BUILDING.length, BUILDING.reduce((s, q) => s + q[1], 0) / BUILDING.length]
  prism(wall, shrink(BUILDING, [c[0] + 2, c[1]], 0.62), RIM + 8, RIM + 12)
  const T: [number, number][] = [[5, 10], [10, 10], [10, 15], [5, 15]]
  prism(wall, T, RIM + 8, RIM + 16)
  // Canyon-face glazing: on the building's two edges facing +x.
  for (let i = 0; i < BUILDING.length; i++) {
    const a = BUILDING[i], b = BUILDING[(i + 1) % BUILDING.length]
    const nx = b[1] - a[1], ny = -(b[0] - a[0]), l = Math.hypot(nx, ny)
    if (nx / l < 0.85 || l < 4) continue
    const ox = (nx / l) * 0.06, oy = (ny / l) * 0.06, k = 0.8 / l
    const p0: [number, number] = [a[0] + (b[0] - a[0]) * k + ox, a[1] + (b[1] - a[1]) * k + oy]
    const p1: [number, number] = [b[0] - (b[0] - a[0]) * k + ox, b[1] - (b[1] - a[1]) * k + oy]
    face(win, [p0[0], p0[1], RIM + 2.6], [p1[0], p1[1], RIM + 2.6], [p1[0], p1[1], RIM + 6.4], [p0[0], p0[1], RIM + 6.4], [nx / l, ny / l, 0])
  }
  // Horseshoe: box girders either side of the walkway, the glass floor
  // between them, glass parapets on the girders' inner edges.
  for (const s of [-1, 1]) sweep(steel, s * 1.4, s * 2.2, RIM - 1.8, RIM + 0.1, { top: true, bottom: true, sides: true })
  sweep(steel, -1.4, 1.4, RIM - 0.35, RIM - 0.15, { bottom: true }) // floor beams' soffit
  sweep(glass, -1.4, 1.4, RIM - 0.15, RIM - 0.05, { top: true })
  for (const s of [-1, 1]) {
    sweep(glass, s * 1.5, s * 1.6, RIM + 0.1, RIM + 1.55, { sides: true })
    sweep(steel, s * 1.45, s * 1.65, RIM + 1.55, RIM + 1.7, { top: true, sides: true })
  }
  return { wall, rock, steel, glass, win }
}

const WALL = finish('terracotta-stucco', 0xbd7a63)
const ROCK = finish('rim-rock', 0xa47c66)
const STEEL = finish('skywalk-steel', 0xb7bcc0, 0.5)
const GLASS = { ...finish('glass', 0x7fc4de, 0.2), opacity: 0.3, doubleSided: true }
const WIN = PALETTE.window

if (import.meta.main) {
  const m = build()
  const list = [
    { part: m.wall, material: WALL },
    { part: m.rock, material: ROCK },
    { part: m.steel, material: STEEL },
    { part: m.glass, material: GLASS },
    { part: m.win, material: WIN },
  ].filter(({ part }) => part.triangles > 0)
  const tris = list.reduce((s, { part }) => s + part.triangles, 0)
  if (tris > 5000) throw new Error(`${tris} triangles, over 5000`)
  const glb = writeGlb('Grand Canyon Skywalk', list, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the anchor, on the lowest map ground under the plan',
    bearing: BEARING, elevation: 0, rim: RIM, datum: 1240.92 + Z0,
  })
  if (glb.length > 250 * 1024) throw new Error(`${glb.length} bytes, over 250 KB`)
  await Bun.write(new URL('../models/grand-canyon-skywalk.glb', import.meta.url), glb)
  console.log(`grand-canyon-skywalk.glb: ${tris} triangles, ${glb.length} bytes, rim ${RIM.toFixed(1)} m`)
}
