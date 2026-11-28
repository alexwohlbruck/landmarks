/**
 * The Moonlight Tower in Zilker Park, Austin: one of the city's 1894-95
 * moonlight towers (Fort Wayne Electric Co.), the tower the Zilker Holiday
 * Tree is strung from — procedural, CC0-1.0, no textures.
 *   bun generators/atx-moonlight-tower.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Anchor = OSM
 * node/3913801151 (man_made=tower, height=50), -97.771192, 30.266387.
 * z = 0 is the lowest ground under the plan, at the south-east guy anchor;
 * the park falls about 1 m to the south-east (Mapterhorn grid), so the
 * post's foot stands at z 0.6 and each anchor at its own ground; every
 * tower height below is over the foot. Replaces nothing (OSM has a node).
 *
 * Identity: a very slender triangular iron lattice shaft, painted silver,
 * standing on a single cast-iron post; a small railed platform where the
 * lattice starts; a railed cage at the top carrying a ring of six lamps
 * under dark hoods round a short mast; and long guy cables from three
 * levels. Only the tower: the holiday tree's light strings are not drawn.
 *
 * Numbers:
 *  - total height 50.3 m: published 165 ft (OSM height=50);
 *  - the shaft: triangular, about 2.3 m a face, the same width from bottom
 *    to top (no taper): photo-scaled, its apparent width is 2.2 m against
 *    the 50.3 m height in "moore" (the Zilker tower whole) and constant in
 *    "eastside"; triangular as seen from below in "speedway";
 *  - the post 0-6.5 m, the legs gathering onto it 6.5-8.3 m, the platform
 *    at 8.3 m, the top cage 46.8-48.2 m, the lamps 48.6-49.8 m, the finial
 *    50.3 m: photo-scaled on "moore" (13.9 px a metre);
 *  - the lamp ring about 3.4 m across, six lamps: "campos1", "eason",
 *    "patterson" (six lit lamps);
 *  - guy levels at about 44, 34.5 and 25 m: scaled on "campos1"; their
 *    anchors are not photographed, so they are invented: three directions,
 *    30 m out, each direction's three cables meeting at one anchor;
 *  - the lattice: horizontals every 3.2 m with one X per panel on each face
 *    (the real tower has about twice as many, and finer rods: drawn at half
 *    density and thicker, per STYLE.md's bridge rule); legs 0.32 m, rods
 *    0.12-0.16 m, cables 0.16 m (all thicker than real so they read);
 *  - colours from "eastside" and "eason" (sun and overcast), pulled to the
 *    palette's lightness: the silver paint #c4c8c9 (a touch darker than the photos so the slender shaft holds against the pale map), the lamp hoods
 *    #5d636b, the guy cables a mid steel grey #8d9296.
 *  - Night: the six lamps (`lamp`), lit as in "patterson" and "rutledge".
 *
 * Photos (Wikimedia Commons, EVIDENCE). All Austin moonlight towers are the
 * same design, so photos of the other towers shape the shaft and crown; the
 * Zilker tower itself is "moore":
 *  moore     "Moonlight tower.jpg", Larry D. Moore, CC BY 4.0
 *            https://commons.wikimedia.org/wiki/File:Moonlight_tower.jpg
 *  eastside  "Moonlight Tower East Side Drive Austin Texas 2021.jpg",
 *            Larry D. Moore, CC BY 4.0
 *            https://commons.wikimedia.org/wiki/File:Moonlight_Tower_East_Side_Drive_Austin_Texas_2021.jpg
 *  campos1   "9302018.Moon.Light.towers.NRSID76002071 01.jpg", Paula K
 *            Campos, CC BY-SA 4.0
 *            https://commons.wikimedia.org/wiki/File:9302018.Moon.Light.towers.NRSID76002071_01.jpg
 *  eason     "Moonlight tower Austin 2007.jpg", Chris Eason, CC BY 2.0
 *            https://commons.wikimedia.org/wiki/File:Moonlight_tower_Austin_2007.jpg
 *  patterson "Moonlight Tower.jpg", Tim Patterson, CC BY-SA 2.0
 *            https://commons.wikimedia.org/wiki/File:Moonlight_Tower.jpg
 *  speedway  "Moon-twr-speedway.JPG", Lombana, CC BY-SA 3.0
 *            https://commons.wikimedia.org/wiki/File:Moon-twr-speedway.JPG
 *  rutledge  "Austin Moontower at Night.jpg", Matthewrutledge, public domain
 *            https://commons.wikimedia.org/wiki/File:Austin_Moontower_at_Night.jpg
 * Also OSM (ODbL). No look-only sources, no commercial imagery. No lidar
 * used (a lattice tower barely returns).
 *
 * Doubts: the guy anchors' places and the tower's turn (bearing) are not
 * known from any photo; the top cage and platform railings are simplified
 * to flat bands.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { save } from './atl-flatiron-building'
import { tube } from './amsterdam-johan-cruijff-arena'

const paint = new Part(), hood = new Part(), lamp = new Part(), cable = new Part()

const R = 2.3 / Math.sqrt(3) // circumradius of the triangular shaft
const Z0 = 8.3, Z1 = 46.8, TOP = 50.3
const legAng = [90, 210, 330].map((d) => (d * Math.PI) / 180)
const leg = (i: number, z: number, r = R): V3 => [r * Math.cos(legAng[i % 3]), r * Math.sin(legAng[i % 3]), z]

// ── the post and the legs gathering onto it ──
tube(paint, [0, 0, 0], [0, 0, 6.6], 0.3, 10, true)
tube(paint, [0, 0, 0], [0, 0, 0.8], 0.45, 10, true) // the cast-iron foot
for (let i = 0; i < 3; i++) tube(paint, [0, 0, 6.2], leg(i, Z0), 0.14, 5)

// ── the platform at the foot of the lattice: a triangular deck and a railing band ──
function ringBand(p: Part, pts: V3[], z0: number, z1: number) {
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
    p.quad([b[0], b[1], z0], [a[0], a[1], z0], [a[0], a[1], z1], [b[0], b[1], z1])
  }
}
{
  const deck = [0, 1, 2].map((i) => leg(i, Z0, R + 1.0))
  paint.cap(deck.map(([x, y]) => [x, y, Z0] as V3), true)
  paint.cap(deck.map(([x, y]) => [x, y, Z0 - 0.15] as V3), false)
  ringBand(paint, deck, Z0 + 0.9, Z0 + 1.2)
  for (const [x, y] of deck) tube(paint, [x, y, Z0], [x, y, Z0 + 1.2], 0.07, 4)
}

// ── the shaft: three legs, horizontals every 3.2 m, an X on each face per panel ──
for (let i = 0; i < 3; i++) tube(paint, leg(i, Z0), leg(i, Z1 + 1.4), 0.16, 6)
const N = 12, step = (Z1 - Z0) / N
for (let k = 0; k <= N; k++) {
  const z = Z0 + k * step
  for (let i = 0; i < 3; i++) tube(paint, leg(i, z), leg(i + 1, z), 0.08, 4)
}
for (let k = 0; k < N; k++) {
  const z = Z0 + k * step
  for (let i = 0; i < 3; i++) {
    tube(paint, leg(i, z), leg(i + 1, z + step), 0.06, 4)
    tube(paint, leg(i + 1, z), leg(i, z + step), 0.06, 4)
  }
}

// ── the top cage: a hexagonal deck and railing round the head of the shaft ──
{
  const hex = (r: number, z: number): V3[] => Array.from({ length: 6 }, (_, k) => [r * Math.cos((k * Math.PI) / 3 + Math.PI / 6), r * Math.sin((k * Math.PI) / 3 + Math.PI / 6), z])
  paint.cap(hex(1.75, Z1), true)
  paint.cap(hex(1.75, Z1 - 0.15), false)
  ringBand(paint, hex(1.75, Z1), Z1 - 0.15, Z1)
  ringBand(paint, hex(1.75, Z1), Z1 + 1.1, Z1 + 1.4)
  for (const [x, y] of hex(1.75, 0)) tube(paint, [x, y, Z1], [x, y, Z1 + 1.4], 0.07, 4)
}

// ── the lamp mast, its six arms, the hooded lamps ──
tube(paint, [0, 0, Z1], [0, 0, TOP - 0.25], 0.14, 6)
tube(paint, [0, 0, TOP - 0.25], [0, 0, TOP], 0.07, 4, true) // the finial
const LZ = 49.4, LR = 1.7
for (let k = 0; k < 6; k++) {
  const a = (k * Math.PI) / 3
  const c: V3 = [LR * Math.cos(a), LR * Math.sin(a), LZ]
  tube(paint, [0, 0, LZ + 0.35], [c[0], c[1], LZ + 0.35], 0.06, 4)
  // the hood: a shallow dark cone over the lamp
  for (let s = 0; s < 8; s++) {
    const t0 = (s * Math.PI) / 4, t1 = ((s + 1) * Math.PI) / 4
    const p0: V3 = [c[0] + 0.42 * Math.cos(t0), c[1] + 0.42 * Math.sin(t0), LZ + 0.05]
    const p1: V3 = [c[0] + 0.42 * Math.cos(t1), c[1] + 0.42 * Math.sin(t1), LZ + 0.05]
    const apex: V3 = [c[0], c[1], LZ + 0.38]
    hood.tri(p0, p1, apex)
    hood.tri(p1, p0, [c[0], c[1], LZ + 0.05])
  }
  // the lamp: a bead hanging under the hood, a little larger than the real globe
  const r = 0.4, m: V3 = [c[0], c[1], LZ - 0.25]
  const ax: V3[] = [[r, 0, 0], [0, r, 0], [-r, 0, 0], [0, -r, 0]]
  for (let s = 0; s < 4; s++) {
    const a0 = ax[s], a1 = ax[(s + 1) % 4]
    const q0: V3 = [m[0] + a0[0], m[1] + a0[1], m[2]], q1: V3 = [m[0] + a1[0], m[1] + a1[1], m[2]]
    lamp.tri(q0, q1, [m[0], m[1], m[2] + r])
    lamp.tri(q1, q0, [m[0], m[1], m[2] - r])
  }
}

// ── the guy cables: three levels, three directions, each direction to one anchor ──
// The park falls to the south-east, so the post's foot stands G over the
// lowest anchor, and each anchor sits at its own ground (Mapterhorn rise
// over the lowest point under the plan: north 0.8, south-west 0.6,
// south-east 0).
const G = 0.6, ANCHOR_R = 30, ANCHOR_Z = [0.8, 0.6, 0]
for (const part of [paint, hood, lamp]) for (let i = 1; i < part.pos.length; i += 3) part.pos[i] += G
for (const z of [44, 34.5, 25]) {
  for (let i = 0; i < 3; i++) {
    const [ax, ay] = leg(i, 0, ANCHOR_R), [lx, ly] = leg(i, 0)
    tube(cable, [lx, ly, z + G], [ax, ay, ANCHOR_Z[i]], 0.08, 4)
  }
}
for (let i = 0; i < 3; i++) {
  const [ax, ay] = leg(i, 0, ANCHOR_R)
  tube(cable, [ax, ay, Math.max(0, ANCHOR_Z[i] - 0.2)], [ax, ay, ANCHOR_Z[i] + 0.25], 0.3, 6, true) // the anchor's head
}

if (import.meta.main) {
  await save('atx-moonlight-tower', 'Moonlight Tower (Zilker Park)', [
    { part: paint, material: finish('moonlight-silver', 0xc4c8c9, 0.6) },
    { part: hood, material: finish('moonlight-hood', 0x5d636b) },
    { part: lamp, material: { name: 'lamp', color: 0xe6e2d6, roughness: 0.4 } },
    { part: cable, material: finish('moonlight-cable', 0x8d9296) },
  ], { bearing: 0, replaces: [] }, 5000)
}
