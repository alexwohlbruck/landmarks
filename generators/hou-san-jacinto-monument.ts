/**
 * San Jacinto Monument (1936-39; Alfred C. Finn, architect, Robert J.
 * Cummins, engineer), San Jacinto Battleground, La Porte, Texas —
 * procedural, CC0-1.0, no textures.
 * bun generators/hou-san-jacinto-monument.ts
 *
 * Map frame: x across, y "north", z up, metres; origin at the anchor on the
 * ground. The monument is square to its terrace, whose faces look to 25°,
 * 115°, 205° and 295° (OSM roof:direction tags on the shaft's faces, and
 * every outline edge runs at 25° / 115°), so the model is built in that
 * turned frame and placed at bearing 25: model +y looks NNE, -x WNW down
 * the reflecting pool, -y SSW. Anchor -95.0807045, 29.7498544, the centre of
 * the base building and shaft (OSM way/41290215 and way/257767778 agree to
 * 0.2 m).
 *
 * Identity, in order: the very tall, slowly tapering shaft, square with
 * chamfered corners (so octagonal), three vertical flutes down the middle
 * of every face; the Lone Star on top, a faceted five-pointed star that
 * reads as a star from every side (drawn as two faceted stars crossed at
 * right angles, which is how it shows in the photos: face-on from the pool
 * and from the south, a crossed "V" from the diagonal); the narrow crown
 * block under it with its slots; the wider pedestal at the shaft's foot
 * with its bas-relief frieze; the low square museum base with chamfered
 * corners and a portal on each face; the terrace with its stair flights.
 *
 * Height and ground. z = 0 is the plaza the terrace stands on (lidar 2.0 m
 * over the grid's lowest ground, the grass at the plaza's edge). The
 * terrace top is 2.65 m above it (lidar 4.6-4.7; OSM height 3), the museum
 * roof 12.25 m (lidar 14.25), the skylight boxes on it 13.6 m (lidar
 * 15.5-15.8), the shaft's top 156.4 m (lidar 157.9), the star's tip 171 m
 * (lidar 173.0 over the grass, 171.0 over the plaza; published 567.31 ft,
 * 172.92 m, over the original ground). elevation 0.
 *
 * Evidence:
 * - OSM: outline way/257767763 (building, historic=monument, the terrace,
 *   92 x 92 m, ele 5); terrace way/257767764 (height 3), its three stair
 *   flights way/257767771, 257767772, 257767775 and the ramp on the SSW
 *   side, way/607475586, 607475590, 607475592, 607475595, 607475597,
 *   607710160 (heights 1-3 m); the base building way/41290215 (38 x 38 m,
 *   chamfered 4 m, height 10); the shaft's foot way/257767778 (16.6 m,
 *   chamfered), its eight faces way/257767765-769, 773, 774, 776, the top
 *   way/257767777 and the star way/257767770 (height 173). Every plan
 *   dimension of the terrace, stairs, ramp and base is OSM's.
 * - Lidar: USGS 3DEP TX_Coastal_B1_2018 (flown 2018), 0.5 m grid read at
 *   bearing 25: the heights above.
 * - Published (Wikipedia "San Jacinto Monument"; NRHP 66000815): 567.31 ft
 *   (172.92 m); the shaft 48 ft (14.6 m) square where it rises from the
 *   base, 30 ft (9.1 m) at the observation deck; the star 34 ft (10.4 m)
 *   high, 220 tons; faced with buff Texas (Cordova) limestone.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "San Jacinto Monument - Full.jpg", Adam Cuerden, public domain
 *     https://commons.wikimedia.org/wiki/File:San_Jacinto_Monument_-_Full.jpg
 *     (whole height, sunlit, a diagonal of the star; portal, stairs, frieze)
 *   - "San Jacinto Monument March 2022 3.jpg", Michael Barera, CC BY-SA 4.0
 *     https://commons.wikimedia.org/wiki/File:San_Jacinto_Monument_March_2022_3.jpg
 *     (face-on across the pool, overcast: the proportions were scaled here)
 *   - "San Jacinto monument, Houston, Texas LCCN2011633232.tif", Carol M.
 *     Highsmith, public domain
 *     https://commons.wikimedia.org/wiki/File:San_Jacinto_monument,_Houston,_Texas_LCCN2011633232.tif
 *   - "5 San Jacinto Monument. Star.jpg", Tijuana Brass, public domain
 *     https://commons.wikimedia.org/wiki/File:5_San_Jacinto_Monument._Star.jpg
 *     (the star's facets, the crown block and the windows under it)
 *   - "San Jacinto Battle Monument From The South.jpg", Gronowski26,
 *     CC BY-SA 4.0
 *     https://commons.wikimedia.org/wiki/File:San_Jacinto_Battle_Monument_From_The_South.jpg
 *   - "San Jacinto monument.jpg", Daniel Schwen, CC BY-SA 4.0
 *     https://commons.wikimedia.org/wiki/File:San_Jacinto_monument.jpg
 *   - USGS NAIP orthophoto (public domain): the plan, terrace, skylights.
 *
 * Estimated from the photos (scaled on Barera's face-on view, 0.1165 m/px,
 * against the 38.2 m base): the pedestal 16.4 m wide up to 30.6 m, its
 * frieze band 19.6-27.3 m; the flutes (three, 1.4 m apart, drawn 0.6 m
 * wide, as shade panels, from the pedestal to the observation windows);
 * the observation windows at the flutes' heads, 148-150.6 m; the crown
 * block (7.4 m, 156.4-159.6 m) with three slots a face and the collar
 * under the star (6.4 m, to 160.8 m); the star's width (drawn 0.95 of a
 * regular star's) and the depth of its facets (3.2 m through the centre,
 * a little bolder than the photos so it holds at phone size); the portals (9.6 m wide, 10.6 m high, 0.6 m proud)
 * and doors (2.6 x 4.8 m). Doors are drawn on the three faces with stair
 * flights; the ESE face, with no stair, gets the portal only (no photo of
 * that face was found: a doubt). The stairs are drawn as five broad steps.
 * Not modelled: the carved inscriptions and the wave frieze's relief (a
 * plain shade band), the outer plaza and its steps (OSM parts outside the
 * outline, left to the map), the reflecting pool.
 *
 * Colour: the shellstone's warm buff from the sunlit photos (#d9cfbd to
 * #e4dccb), drawn #e6dccb; flutes, frieze and recesses a step darker; the
 * star a mid steel grey (it reads silver in sun, grey-bronze at dusk;
 * drawn darker than the sunlit silver so it stands out against the pale
 * shaft at 200 and 80 px); the terrace paving OSM's roof:colour #dab3a5, pulled paler.
 *
 * Terrain (tools/terrain.ts check, Mapterhorn z15, map with the footprint
 * fill): ok. The terrace and steps are drawn to their real heights (lidar
 * 2.65 m over the plaza); the map fills the lidar's copy of the terrace
 * from the plaza around it.
 *
 * Night: the shaft is floodlit from the base to the star, so every stone
 * surface and the star carry a floodlight wash, weaker on faces that look
 * up; the observation windows and doors glow.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const stone = new Part(), shade = new Part(), star = new Part(), win = new Part(), door = new Part(), paving = new Part()

// ---- helpers ---------------------------------------------------------------

/** A square ring of half-width h with chamfer c at height z, CCW from above. */
function oct(h: number, c: number, z: number): V3[] {
  return [
    [-h + c, -h, z], [h - c, -h, z], [h, -h + c, z], [h, h - c, z],
    [h - c, h, z], [-h + c, h, z], [-h, h - c, z], [-h, -h + c, z],
  ]
}

/** A closed chamfered prism (tapering if h0 != h1) between z0 and z1. */
function block(p: Part, h0: number, c0: number, z0: number, h1: number, c1: number, z1: number, top = true, bottom = false) {
  p.loft([oct(h0, c0, z0), oct(h1, c1, z1)])
  if (top) p.cap(oct(h1, c1, z1), true)
  if (bottom) p.cap(oct(h0, c0, z0), false)
}

/** Ear-clipping triangulation of a simple polygon, CCW from above. */
function triangulate(poly: [number, number][]): [number, number, number][] {
  const idx = poly.map((_, i) => i), out: [number, number, number][] = []
  const crossz = (a: [number, number], b: [number, number], c: [number, number]) =>
    (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: [number, number], a: [number, number], b: [number, number], c: [number, number]) =>
    crossz(a, b, p) > 1e-9 && crossz(b, c, p) > 1e-9 && crossz(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = poly[i0], b = poly[i1], c = poly[i2]
      if (crossz(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(poly[j], a, b, c))) continue
      out.push([i0, i1, i2])
      idx.splice(k, 1)
      break
    }
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}

/** An upright prism over a simple plan polygon (CCW), walls in `wall`, top in `top`. */
function prism(wall: Part, top: Part, plan: [number, number][], z0: number, z1: number) {
  let area = 0
  for (let i = 0; i < plan.length; i++) {
    const [ax, ay] = plan[i], [bx, by] = plan[(i + 1) % plan.length]
    area += ax * by - bx * ay
  }
  if (area < 0) plan = [...plan].reverse()
  const n = plan.length
  for (let i = 0; i < n; i++) {
    const [ax, ay] = plan[i], [bx, by] = plan[(i + 1) % n]
    wall.quad([ax, ay, z0], [bx, by, z0], [bx, by, z1], [ax, ay, z1])
  }
  for (const [i, j, k] of triangulate(plan))
    top.tri([plan[i][0], plan[i][1], z1], [plan[j][0], plan[j][1], z1], [plan[k][0], plan[k][1], z1])
}

/** An axis-aligned box. */
function box(wall: Part, top: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  prism(wall, top, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1)
}

/**
 * A flat panel on face f (0 south -y, 1 east +x, 2 north +y, 3 west -x),
 * s across the face from its centre, z up, `lift` off the surface whose
 * half-width at z is `surf(z)`.
 */
function panel(p: Part, f: number, s0: number, s1: number, z0: number, z1: number, surf: (z: number) => number, lift = 0.04) {
  const a = (f * Math.PI) / 2, cs = Math.cos(a), sn = Math.sin(a)
  const pt = (s: number, z: number): V3 => {
    const x = s, y = -surf(z) - lift
    return [x * cs - y * sn, x * sn + y * cs, z]
  }
  p.quad(pt(s0, z0), pt(s1, z0), pt(s1, z1), pt(s0, z1))
}

/** Rotate a plan point by quarter turns f (CCW). */
const turn = ([x, y]: [number, number], f: number): [number, number] => {
  const a = (f * Math.PI) / 2, cs = Math.round(Math.cos(a)), sn = Math.round(Math.sin(a))
  return [x * cs - y * sn, x * sn + y * cs]
}

// ---- terrace (OSM way/257767764, in the turned frame) ------------------------

const T = 2.65 // terrace top over the plaza (lidar)
const terrace: [number, number][] = [
  [-30.54, 37.01], [-11.55, 36.96], [-11.54, 29.77], [10.01, 29.94], [10.0, 37.13], [28.86, 37.07],
  [36.71, 29.31], [36.61, -29.63], [29.03, -37.25], [25.17, -37.27], [25.17, -33.58], [23.69, -33.57],
  [23.69, -31.83], [10.3, -31.91], [10.31, -30.0], [-11.67, -30.0], [-11.7, -37.36], [-30.43, -37.45],
  [-37.56, -30.2], [-37.83, -11.2], [-30.62, -11.15], [-30.65, 10.61], [-37.86, 10.57], [-38.13, 29.15],
]
prism(stone, paving, terrace, 0, T)

/** A flight of `n` broad steps in a notch: x0..x1 across, from `inner` out to `outer` along the axis. */
function flight(axis: 'x' | 'y', a0: number, a1: number, inner: number, outer: number, n = 5) {
  for (let k = 1; k <= n; k++) {
    const z1 = (T * k) / n, z0 = (T * (k - 1)) / n
    const reach = outer + ((inner - outer) * (k - 1)) / n // each step stops one tread short of the one below
    const [b0, b1] = inner < reach ? [inner, reach] : [reach, inner]
    if (axis === 'y') box(stone, paving, a0, a1, b0, b1, z0, z1)
    else box(stone, paving, b0, b1, a0, a1, z0, z1)
  }
}
flight('y', -11.55, 10.0, 29.85, 37.05)    // NNE, way/257767771
flight('x', -11.18, 10.59, -30.63, -37.85) // WNW, way/257767772
flight('y', -11.68, 10.3, -30.0, -37.36)   // SSW, way/257767775
// The SSW ramp beside it, by OSM's part heights scaled to the terrace.
const r = T / 3
box(stone, paving, 11.73, 23.69, -33.56, -31.86, 0, 3 * r)     // way/607475595
box(stone, paving, 11.75, 23.65, -35.12, -33.56, 0, 2.25 * r)  // way/607475597
box(stone, paving, 10.29, 11.75, -35.22, -31.91, 0, 2.25 * r)  // way/607475592
box(stone, paving, 15.48, 23.6, -37.31, -35.12, 0, 1.5 * r)    // way/607475590
box(stone, paving, 23.6, 25.17, -37.28, -33.58, 0, 1.5 * r)    // way/607475586
box(stone, paving, 10.28, 15.48, -37.34, -35.2, 0, 1.0 * r)    // way/607710160

// ---- museum base (way/41290215) --------------------------------------------

const ROOF = 12.25
const BH = 19.05, BC = 3.9 // half-width and corner chamfer
const batter = 0.35        // the walls lean in a little (Cuerden)
block(stone, BH, BC, T, BH - batter, BC - batter * 0.4, ROOF - 1.1, false)
// The frieze band under the coping, then the coping.
block(shade, BH - batter, BC - batter * 0.4, ROOF - 1.1, BH - batter, BC - batter * 0.4, ROOF - 0.35, false)
block(stone, BH - batter + 0.15, BC - batter * 0.4, ROOF - 0.35, BH - batter + 0.15, BC - batter * 0.4, ROOF, true)
// Skylight boxes on the roof: two either side of the shaft on each face (NAIP).
for (let f = 0; f < 4; f++)
  for (const s of [-1, 1]) {
    const [cx, cy] = turn([s * 6.6, -12.2], f)
    const hx = f % 2 ? 2.2 : 2.6, hy = f % 2 ? 2.6 : 2.2
    box(stone, shade, cx - hx, cx + hx, cy - hy, cy + hy, ROOF, ROOF + 1.35)
  }
// Portals: a projecting frame on every face, a door on the three with stairs.
const wallAt = (z: number) => BH - (batter * (z - T)) / (ROOF - 1.1 - T)
for (let f = 0; f < 4; f++) {
  const PW = 4.8, PROUD = 0.6, PT = 10.6
  // Built on the south face, then turned.
  const plan: [number, number][] = [[-PW, -BH - PROUD], [PW, -BH - PROUD], [PW, -BH + 1], [-PW, -BH + 1]]
  const r = plan.map((p) => turn(p, f))
  prism(stone, stone, r, T, PT)
  panel(shade, f, -PW + 0.9, PW - 0.9, PT - 1.4, PT - 0.5, () => BH + PROUD, 0.03) // lintel band
  if (f !== 1) panel(door, f, -1.3, 1.3, T, T + 4.8, () => BH + PROUD, 0.03)
}

// ---- pedestal and shaft ------------------------------------------------------

const PED = 30.6, PH = 8.2, PC = 2.5      // pedestal top, half-width, chamfer
const S0 = 7.3, S1 = 4.57, TOP = 156.4    // shaft half-widths (48 ft, 30 ft), top
const chamf = (h: number) => h * 0.2
const shaftHalf = (z: number) => S0 + ((S1 - S0) * (z - PED)) / (TOP - PED)
// The shaft's foot (OSM height 10 over the roof) and the pedestal.
block(stone, PH, PC, ROOF, PH, PC, PED - 0.8, false)
block(stone, PH + 0.2, PC, PED - 0.8, PH + 0.2, PC, PED, true) // cap
// Frieze band, 19.6-27.3 m: a shade panel on each face.
for (let f = 0; f < 4; f++) panel(shade, f, -PH + PC + 0.5, PH - PC - 0.5, 19.6, 27.3, () => PH)
// The shaft.
block(stone, S0, chamf(S0), PED, S1, chamf(S1), TOP, false)
// Shaft cap: a thin step at the top.
block(stone, S1 + 0.18, chamf(S1), TOP - 0.9, S1 + 0.18, chamf(S1), TOP, true)

// Flutes (three per face) up to the observation windows at their heads.
const WIN0 = 148, WIN1 = 150.6
for (let f = 0; f < 4; f++)
  for (const s of [-1.4, 0, 1.4]) {
    panel(shade, f, s - 0.35, s + 0.35, PED + 0.3, WIN0 - 0.4, shaftHalf)
    panel(win, f, s - 0.36, s + 0.36, WIN0, WIN1, shaftHalf)
  }

// ---- crown and star -----------------------------------------------------------

const CR = 3.7, CROWN = 159.6, COLLAR = 160.8
block(stone, CR, 0.7, TOP, CR, 0.7, CROWN, true)
block(stone, 3.2, 0.6, CROWN, 3.2, 0.6, COLLAR, true)
for (let f = 0; f < 4; f++) for (const s of [-1.5, 0, 1.5]) panel(win, f, s - 0.32, s + 0.32, TOP + 0.6, CROWN - 0.7, () => CR)

/**
 * A faceted five-pointed star facing ±n (n along y for a = 0, along x for
 * a = 1), centre at height zc: outer radius R, inner r, `d` deep each side
 * at the centre, the tips knife-edged.
 */
const R = 5.75, ZC = COLLAR - 0.2 + R * Math.cos(Math.PI / 5), XS = 0.95
function faceted(axis: 0 | 1, d: number) {
  const rim: V3[] = []
  for (let i = 0; i < 10; i++) {
    const th = Math.PI / 2 + (i * Math.PI) / 5, rad = i % 2 ? R * 0.42 : R
    const u = rad * Math.cos(th) * XS, z = ZC + rad * Math.sin(th)
    rim.push(axis === 0 ? [u, 0, z] : [0, u, z])
  }
  const front: V3 = axis === 0 ? [0, -d, ZC] : [d, 0, ZC]
  const back: V3 = axis === 0 ? [0, d, ZC] : [-d, 0, ZC]
  for (let i = 0; i < 10; i++) {
    const a = rim[i], b = rim[(i + 1) % 10]
    // Rim runs counter-clockwise seen from the front apex for axis 0.
    if (axis === 0) { star.tri(front, b, a); star.tri(back, a, b) } else { star.tri(front, a, b); star.tri(back, b, a) }
  }
}
faceted(0, 1.6)
faceted(1, 1.6)

// ---- write -------------------------------------------------------------------

const H_TIP = ZC + R
const lit = (p: V3, n: V3): number => (n[2] > 0.6 ? 0.35 : p[2] < T + 0.01 ? 0.5 : 0.95 - 0.15 * Math.min(1, p[2] / H_TIP))
const STONE = { ...finish('cordova-shellstone', 0xe6dccb), floodlight: lit }
const SHADE = { ...finish('cordova-shellstone-shade', 0xd6cbb8), floodlight: lit }
const STAR = { ...finish('star-steel', 0x9d998f, 0.6), floodlight: () => 0.9 }
const PAVING = finish('terrace-paving', 0xddc7b6)
const parts = [
  { part: stone, material: STONE },
  { part: shade, material: SHADE },
  { part: star, material: STAR },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
  { part: paving, material: PAVING },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('San Jacinto Monument', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 25, osm: 'way/257767763', height: H_TIP,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/hou-san-jacinto-monument.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, tip ${H_TIP.toFixed(2)} m`)
