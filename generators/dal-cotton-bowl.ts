/**
 * Cotton Bowl Stadium, Fair Park, Dallas (1930, Mark Lemmon; upper decks
 * 1948-49; 2008 renovation) — procedural, CC0-1.0.
 * bun generators/dal-cotton-bowl.ts
 *
 * What makes it the Cotton Bowl: the long, round-ended bowl, sunk into the
 * ground; its pale concrete outer wall; the grey upper deck, which runs
 * unbroken round the bowl; the tall press box over the west (south-west)
 * side; and the pale Art Deco entrance block at the south-east end, with
 * its stepped shoulders, central window column, the two dark cotton-boll
 * medallions and the entrance canopy over the stairs. The video board stands
 * on the south-east rim behind it.
 *
 * Frame: built turned to bearing 314°, so +y runs along the field's long
 * axis to the north-west end and +x to the north-east side (the axis of the
 * OSM outline's minimum rectangle; the lidar field and stands line up with
 * it). The anchor is the area centroid of OSM way/27112448 (the outer ring
 * of relation/1640835, building=stadium), -96.7595899 32.7795954. The bowl's
 * own centre is 2 m east and 1.5 m north of it in this frame.
 *
 * Ground: y = 0 is the field. Catalog `elevation` is -7: the field is 24 ft
 * (7.3 m) below the ground round it, published by TexasEscapes ("Cotton
 * Bowl", the bowl dug out and the spoil banked under the seats), and the
 * 2018 lidar agrees: the field 0.5 m above the grid's ground_min, the
 * streets and plazas 6.0 m (south-east plaza), 7.2 m (south-west), 7.5-7.7 m
 * (north-west, north-east). Street level is taken as S = 7 m. The lower
 * bowl and the field are below the street and are left to the map's terrain,
 * which shows the dug bowl (Mapterhorn reads the field 6-8 m under the
 * street), as the Rose Bowl and Coliseum models do; the model starts where
 * the upper deck and the walls rise above the street. Walls run on down to
 * the field level out of sight, so the model's lowest point is the field;
 * nothing with an upward face is drawn below the street.
 *
 * Measured from USGS 3DEP lidar TX_Pecos_Dallas_B3_2018 (2018 flight), 1 m
 * grid, read in this frame with tools/lidar_frame.py (heights above the
 * field):
 * - the outer wall: OSM's outline, drawn as a superellipse about the bowl's
 *   centre, half-axes 90 by 130.5 m, exponent 2.5 (within 2-4 m of OSM and
 *   of the lidar's edge all round);
 * - the rim: 30-31 m at the ends and on the north-east side; 25 m on the
 *   south-west side at mid-length, 27-28 m towards its ends;
 * - the upper deck's front: 17.5 m high, 65 m out from the centre at
 *   mid-length and 104 m at the ends (a superellipse, exponent 2.8); below
 *   it the lower bowl, which reaches 10.5 m, 3.5 m above the street;
 * - the press box: x -97 to -81, y -25 to 31 (as OSM's bump), roof 39 m,
 *   a penthouse to 42.5 m over its middle;
 * - the video board: x -13.5 to 10.5 at y -125, top 45.5 m (the board is
 *   newer than the 2016 photos, and is in the 2018 lidar and 2019 photos);
 * - the entrance block: x -14.5 to 12.5, from the bowl to y -150, 17.5 m
 *   above its plaza, with terraces 3.8 m high either side of it, x -34 to
 *   35, out to y -148.
 *
 * Estimated from the photos (scaled from the block's lidar width): the
 * shoulders 4 m wide and 2 m lower, set back 1.5 m; the window column 6.6 m
 * wide from 5.5 to 15.2 m; the medallions, 2.9 m across in reality, drawn
 * 3.4 m so they read at phone size, centred 8.1 m either side at 10.7 m;
 * the canopy 15.6 m wide at 6.7 m over the plaza; the stairs and landing
 * (2.5 m), whose depth the lidar doesn't resolve; the outer wall pale up
 * to 9 m over the street and a dark band of open bays and glazing above it
 * to 2 m under the rim (the 2008 skyway photo shows the open steel bays,
 * the 2019 night photos the lit band), between piers about 7 m apart.
 *
 * Photos (Wikimedia Commons), compared against the renders:
 * - "Fair Park August 2016 39 (Cotton Bowl Stadium).jpg" and "... 40 ...",
 *   Michael Barera, CC BY-SA 4.0: the entrance block from the south-east,
 *   its stairs, canopy, medallions and shoulders, the outer wall beside it;
 * - "Fair Park August 2016 83 (Cotton Bowl Plaza).jpg", Michael Barera,
 *   CC BY-SA 4.0: the block from farther out;
 * - "Texas State Fair Cotton Bowl from skyway 1.jpg" and "... 2.jpg",
 *   Andreas Praefcke, CC BY 3.0: the north-east side and the block, the
 *   press box behind;
 * - "2019 State Fair Classic 01 (Cotton Bowl).jpg", Michael Barera, CC BY-SA
 *   4.0: the press box and the upper decks from inside;
 * - "The Cotton Bowl and Fair Park Esplanade in Fair Park.png",
 *   IcedCowboyCoffee, CC0: the bowl from above, the seat colour;
 * - "View from Top o' Texas Tower September 2019 06/10 (Cotton Bowl).jpg",
 *   Michael Barera, CC BY-SA 4.0: night, from the south-east, the lit band
 *   round the outer wall, the board and the block;
 * - "Cotton Bowl (14404700530).jpg", BobbbyLight, CC BY 2.0: the block's
 *   lit sign at dusk.
 * - Plan: USGS NAIP orthophoto (public domain).
 *
 * Left out: the field and lower bowl (the map's terrain), the lettering
 * "COTTON BOWL" (the stadium, not the sign, is the landmark), the light
 * towers (thin lattice), flags, aisles and the north-west end's small
 * landing and stairs.
 *
 * Doubts: no licensed daylight photo of the outer wall from the south-west
 * or north-west, so its bands are carried round from the south-east and
 * north-east views; the press box's outer face is not photographed; the
 * deck is drawn as one smooth rake, without the cross-aisle; the field
 * depth is a single figure, while the streets round it differ by 1.7 m (the
 * map drapes the street-level walls over that).
 * Terrain: `bun tools/terrain.ts check` (bearing 314, elevation -7) prints
 * "ok: no visible top above y 0.2 m is buried more than 0.15 m (11737.3 m²
 * checked)". Nothing with an upward face is below the street: the lower
 * bowl rows above the street (to 3.5 m) were left out because the map's
 * coarse ground grid would bury them.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const S = 7 // the street, above the field (y = 0)
const CX = 2, CY = 1.5 // the bowl's centre

const conc = new Part(), seats = new Part(), win = new Part(), trim = new Part(), navy = new Part(), door = new Part()

// ---------------------------------------------------------------- helpers
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
/** A planar convex polygon, wound to face `hint`. */
function face(p: Part, P: V3[], hint: V3) {
  let n: V3 = [0, 0, 0]
  for (let i = 1; i < P.length - 1; i++) {
    const c = cross(sub(P[i], P[0]), sub(P[i + 1], P[0]))
    n = [n[0] + c[0], n[1] + c[1], n[2] + c[2]]
  }
  const flip = dot(n, hint) < 0
  for (let i = 1; i < P.length - 1; i++) {
    const a = P[0], b = P[i], c = P[i + 1]
    if (Math.hypot(...cross(sub(b, a), sub(c, a))) < 1e-7) continue
    if (flip) p.tri(a, c, b)
    else p.tri(a, b, c)
  }
}
/** An axis-aligned box; `top` gets the lid, `bottom` adds a floor. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part = p, skip: string = '') {
  if (!skip.includes('w')) face(p, [[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1]], [-1, 0, 0])
  if (!skip.includes('e')) face(p, [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], [1, 0, 0])
  if (!skip.includes('s')) face(p, [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], [0, -1, 0])
  if (!skip.includes('n')) face(p, [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], [0, 1, 0])
  face(top, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [0, 0, 1])
}
/** A flat panel on a vertical plane facing `n` (unit, horizontal), from u0..u1 along it and z0..z1. */
function panelOn(p: Part, o: XY, along: XY, n: XY, u0: number, u1: number, z0: number, z1: number, off = 0.06) {
  const at = (u: number, z: number): V3 => [o[0] + along[0] * u + n[0] * off, o[1] + along[1] * u + n[1] * off, z]
  face(p, [at(u0, z0), at(u1, z0), at(u1, z1), at(u0, z1)], [n[0], n[1], 0])
}
/** A disc on the plane y = y0 facing -y, centre (x, z). */
function discS(p: Part, x: number, y0: number, z: number, r: number, seg = 16) {
  for (let k = 0; k < seg; k++) {
    const a0 = (2 * Math.PI * k) / seg, a1 = (2 * Math.PI * (k + 1)) / seg
    face(p, [[x, y0, z], [x + r * Math.cos(a0), y0, z + r * Math.sin(a0)], [x + r * Math.cos(a1), y0, z + r * Math.sin(a1)]], [0, -1, 0])
  }
}
/** A short drum: disc plus its rim, standing proud of y = yb by d. */
function medallion(p: Part, x: number, yb: number, z: number, r: number, d: number, seg = 16) {
  discS(p, x, yb - d, z, r, seg)
  for (let k = 0; k < seg; k++) {
    const a0 = (2 * Math.PI * k) / seg, a1 = (2 * Math.PI * (k + 1)) / seg
    const c0: XY = [x + r * Math.cos(a0), z + r * Math.sin(a0)], c1: XY = [x + r * Math.cos(a1), z + r * Math.sin(a1)]
    const am = (a0 + a1) / 2
    face(p, [[c0[0], yb, c0[1]], [c1[0], yb, c1[1]], [c1[0], yb - d, c1[1]], [c0[0], yb - d, c0[1]]], [Math.cos(am), 0, Math.sin(am)])
  }
}

// ---------------------------------------------------------------- the rings
const se = (a: number, b: number, n: number, t: number): XY => {
  const c = Math.cos(t), s = Math.sin(t)
  return [CX + a * Math.sign(c) * Math.abs(c) ** (2 / n), CY + b * Math.sign(s) * Math.abs(s) ** (2 / n)]
}
const OUT = (t: number) => se(90, 130.5, 2.5, t)
const FRONT = (t: number) => se(65.5, 104, 2.8, t)
// Parameters spaced evenly along the outer wall.
const N = 96
const TS: number[] = (() => {
  const fine = 4000, ts: number[] = [], acc: number[] = [0]
  for (let k = 1; k <= fine; k++) {
    const a = OUT((2 * Math.PI * (k - 1)) / fine), b = OUT((2 * Math.PI * k) / fine)
    acc.push(acc[k - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]))
  }
  const L = acc[fine]
  let j = 0
  for (let i = 0; i < N; i++) {
    const want = (L * i) / N
    while (acc[j + 1] < want) j++
    ts.push((2 * Math.PI * (j + (want - acc[j]) / (acc[j + 1] - acc[j]))) / fine)
  }
  return ts
})()
/** The rim's height: 31 m, falling to 25 m along the middle of the south-west side (lidar). */
const H = (t: number) => 31 - 6 * Math.max(0, -Math.cos(t)) ** 6
const DF = 17.5 // the upper deck's front
const LIP = 1.2, PAR = 0.6

const outer = TS.map(OUT), front = TS.map(FRONT), hs = TS.map(H)
const nrm = (ring: XY[], i: number): XY => {
  const a = ring[(i + N - 1) % N], b = ring[(i + 1) % N]
  const d: XY = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(...d)
  return [d[1] / l, -d[0] / l] // outward for a counter-clockwise ring
}
const inset = outer.map((p, i) => { const o = nrm(outer, i); return [p[0] - o[0] * PAR, p[1] - o[1] * PAR] as XY })

const inPressBox = (p: XY) => p[0] < -70 && p[1] > -27 && p[1] < 33
const inGate = (p: XY) => p[1] < -112 && p[0] > -17 && p[0] < 15

for (let i = 0; i < N; i++) {
  const j = (i + 1) % N
  const o0 = outer[i], o1 = outer[j], f0 = front[i], f1 = front[j], q0 = inset[i], q1 = inset[j]
  const h0 = hs[i], h1 = hs[j]
  const m: XY = [(o0[0] + o1[0]) / 2, (o0[1] + o1[1]) / 2]
  const out: V3 = [m[0] - CX, m[1] - CY, 0]
  // outer wall, from the field level (out of sight) to the rim
  face(conc, [[o0[0], o0[1], 0], [o1[0], o1[1], 0], [o1[0], o1[1], h1], [o0[0], o0[1], h0]], out)
  // parapet top and its inner face
  face(trim, [[q0[0], q0[1], h0], [q1[0], q1[1], h1], [o1[0], o1[1], h1], [o0[0], o0[1], h0]], [0, 0, 1])
  face(conc, [[q0[0], q0[1], h0 - LIP], [q1[0], q1[1], h1 - LIP], [q1[0], q1[1], h1], [q0[0], q0[1], h0]], [-out[0], -out[1], 0])
  // the upper deck's rake, in two strips so it shades smoothly
  const mid = (a: XY, b: XY): XY => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  const g0 = mid(f0, q0), g1 = mid(f1, q1)
  const hm0 = (DF + h0 - LIP) / 2, hm1 = (DF + h1 - LIP) / 2
  face(seats, [[f0[0], f0[1], DF], [f1[0], f1[1], DF], [g1[0], g1[1], hm1], [g0[0], g0[1], hm0]], [0, 0, 1])
  face(seats, [[g0[0], g0[1], hm0], [g1[0], g1[1], hm1], [q1[0], q1[1], h1 - LIP], [q0[0], q0[1], h0 - LIP]], [0, 0, 1])
  // the deck's front: a pale fascia with a walkway lip, down out of sight
  face(conc, [[f0[0], f0[1], 0], [f1[0], f1[1], 0], [f1[0], f1[1], DF], [f0[0], f0[1], DF]], [-(f0[0] + f1[0]) / 2 + CX, -(f0[1] + f1[1]) / 2 + CY, 0])
  // the outer wall: pale up to the upper concourse, then one dark band of
  // open bays and glazing between piers (lit at night), skipped where the press box
  // and the entrance block stand in front of it
  if (inPressBox(m) || inGate(m)) continue
  const L = Math.hypot(o1[0] - o0[0], o1[1] - o0[1])
  const al: XY = [(o1[0] - o0[0]) / L, (o1[1] - o0[1]) / L], on: XY = [al[1], -al[0]]
  const hmin = Math.min(h0, h1)
  panelOn(win, o0, al, on, 0.8, L - 0.8, S + 9, hmin - 2)
}

// ---------------------------------------------------------------- the press box
{
  const x0 = -97, x1 = -81, y0 = -25, y1 = 31
  box(conc, x0, x1, y0, y1, 0, 39, conc)
  box(conc, -95, -85, -15, 21, 39, 42.5, conc)
  for (const [z0, z1] of [[25, 28], [29.5, 32.5], [34, 37]]) {
    panelOn(win, [x1, y0], [0, 1], [1, 0], 1.2, y1 - y0 - 1.2, z0, z1)
    panelOn(win, [x0, y1], [0, -1], [-1, 0], 1.2, y1 - y0 - 1.2, z0, z1)
    panelOn(win, [x0, y0], [1, 0], [0, -1], 1.2, x1 - x0 - 1.2, z0, z1)
    panelOn(win, [x1, y1], [-1, 0], [0, 1], 1.2, x1 - x0 - 1.2, z0, z1)
  }
}

// ---------------------------------------------------------------- the video board
box(navy, -13.5, 10.5, -127, -123.5, 27, 45.5, navy)

// ---------------------------------------------------------------- the entrance block (south-east)
{
  const cx = -1, X0 = -14.5, X1 = 12.5, YB = -118, YF = -150, TOP = S + 17.5, SH = 4
  const yS = YF + 1.5 // the shoulders' face, set back
  // central mass, full height, from the facade back into the bowl wall
  box(conc, X0 + SH, X1 - SH, YF, YB, 0, TOP, conc, 'n')
  // shoulders: full height behind, stepped down 2 m over their front 3 m
  for (const [a, b] of [[X0, X0 + SH], [X1 - SH, X1]]) {
    box(conc, a, b, yS + 3, YB, 0, TOP, conc, 'n')
    box(conc, a, b, yS, yS + 3, 0, TOP - 2, conc, 'n')
  }
  // a pale coping line along the top of the facade
  box(trim, X0 + SH - 0.3, X1 - SH + 0.3, YF - 0.3, YF + 1.2, TOP - 1.2, TOP + 0.3, trim)
  // the window column and its surround
  const wx0 = cx - 3.3, wx1 = cx + 3.3, wz0 = S + 5.5, wz1 = S + 15.2
  box(trim, wx0 - 0.6, wx1 + 0.6, YF - 0.35, YF + 0.5, wz0 - 0.4, wz1 + 0.6, trim)
  const cw = (wx1 - wx0) / 3
  for (let c = 0; c < 3; c++)
    for (const [z0, z1] of [[wz0, (wz0 + wz1) / 2 - 0.25], [(wz0 + wz1) / 2 + 0.25, wz1]])
      face(win, [[wx0 + c * cw + 0.2, YF - 0.41, z0], [wx0 + (c + 1) * cw - 0.2, YF - 0.41, z0], [wx0 + (c + 1) * cw - 0.2, YF - 0.41, z1], [wx0 + c * cw + 0.2, YF - 0.41, z1]], [0, -1, 0])
  // the cotton-boll medallions: a dark disc with a pale boll
  for (const sx of [-1, 1]) {
    const mx = cx + sx * 8.1, mz = S + 10.7
    medallion(navy, mx, YF, mz, 1.7, 0.3)
    medallion(trim, mx, YF - 0.3, mz + 0.15, 0.95, 0.15, 12)
  }
  // the landing, stairs and cheek walls, and the canopy over the doors
  const LZ = S + 2.5, cw2 = 7.8
  box(conc, cx - cw2, cx + cw2, YF - 1.5, YF, 0, LZ, conc, 'n')
  const steps = 5, tread = 0.7
  for (let k = 0; k < steps; k++) {
    const y1 = YF - 1.5 - k * tread
    box(conc, cx - cw2 + 0.8, cx + cw2 - 0.8, y1 - tread, y1, 0, LZ - (k + 1) * (2.5 / (steps + 1)) + 0.0, trim, 'n')
  }
  for (const sx of [-1, 1]) {
    const a = cx + sx * cw2, b = cx + sx * (cw2 - 0.8)
    box(conc, Math.min(a, b), Math.max(a, b), YF - 1.5 - steps * tread, YF - 1.5, 0, LZ + 0.9, trim, 'n')
  }
  box(trim, cx - cw2, cx + cw2, YF - 3.6, YF, S + 6.7, S + 7.5, trim, 'n')
  face(door, [[cx - 6.3, YF - 0.06, LZ], [cx + 6.3, YF - 0.06, LZ], [cx + 6.3, YF - 0.06, S + 6.5], [cx - 6.3, YF - 0.06, S + 6.5]], [0, -1, 0])
  // a window strip down each side face, near the front
  for (const [x, nx] of [[X0, -1], [X1, 1]] as [number, number][]) {
    face(win, [[x + nx * 0.06, yS + 4.5, S + 4], [x + nx * 0.06, yS + 7.5, S + 4], [x + nx * 0.06, yS + 7.5, TOP - 3], [x + nx * 0.06, yS + 4.5, TOP - 3]], [nx, 0, 0])
  }
  // the terraces either side, 3.8 m over the plaza, back into the bowl wall
  for (const [a, b] of [[-34, X0], [X1, 35]]) box(conc, a, b, -148, -112, 0, S + 3.8, conc, 'n')
}

// ---------------------------------------------------------------- output
const parts = [
  { part: conc, material: finish('cb-concrete', 0xe7e1d3) },
  { part: seats, material: finish('cb-seats', 0xadb2b6) },
  { part: win, material: PALETTE.window },
  { part: trim, material: PALETTE.trim },
  { part: navy, material: finish('cb-navy', 0x46536b) },
  { part: door, material: PALETTE.entrance },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(14), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Cotton Bowl Stadium', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the field below the way/27112448 centroid; bearing 314',
  bearing: 314, elevation: -S, osm: 'relation/1640835',
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const file = new URL('../models/dal-cotton-bowl.glb', import.meta.url).pathname
await Bun.write(file, glb)
console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`)
