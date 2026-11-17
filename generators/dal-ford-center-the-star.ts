/**
 * Ford Center at The Star, Frisco (Dallas Cowboys, Gensler, 2016) —
 * procedural, CC0-1.0, no textures.
 * bun generators/dal-ford-center-the-star.ts
 *
 * The indoor stadium and practice field under one great barrel roof whose
 * arch faces the Tostitos Championship Plaza to the east: a royal-navy gable
 * under the silver eave of the arch with the white Ford oval, and in front
 * of it the glass entrance pavilion with its video board. Round it, inside
 * the same OSM outline, the low office and training wings, and at the
 * north-east corner the glass Cowboys headquarters office block that rises
 * beside the plaza.
 *
 * OSM: way/518594979 (building=yes, leisure=stadium, "Ford Center", 6
 * levels) is the whole complex, the offices included; way/1197569929
 * (building:part, roof:shape=round, 6 levels) is the stadium inside it.
 * Both are `replaces`. The OSM "Dallas Cowboys Headquarters" way/518594981
 * is the parking garage west of the practice fields, not modelled. The
 * glass office block at the north-east (x 60..94, y 53..125 in the OSM
 * frame below) is inside way/518594979 and is drawn; the Omni hotel south
 * of it (way/723886399) is not.
 *
 * Frame: bearing 0 (the outline is square to north within half a degree),
 * x east, y north, z up, metres; origin at the outline's area centroid
 * (-96.828335, 33.110625). Coordinates below are written in the OSM frame
 * centred on -96.82830, 33.11044 and shifted by (+3.27, -20.41).
 *
 * Evidence. Frisco is not covered by any USGS 3DEP point cloud (lidar.py
 * find: none), so every height is photo-scaled or estimated.
 * - OSM outlines and parts (measured plan).
 * - NAIP (USGS): the barrel roof's plan x -56..100 (its top leans east in
 *   the image), the light roofs of the wings, the north-east block.
 * - Photos (Wikimedia Commons): Danazar, CC BY-SA 4.0
 *   (https://commons.wikimedia.org/wiki/File:Ford_Center_at_the_Star_-_May_2018_-_Exterior.jpg,
 *   https://commons.wikimedia.org/wiki/File:Ford_Center_at_the_Star.jpg): the east front, the
 *   navy gable, the arch, the pavilion and the north-east glass block;
 *   매일 누군가가 도둑맞을 때마다, CC0
 *   (https://commons.wikimedia.org/wiki/File:The_Star_in_Frisco_front_view_-_20261020.jpg):
 *   the front from across the plaza at dusk, the glass wings either side.
 * - Published (Wikipedia; Chamberlin; Kimley-Horn): opened 2016, 12,000
 *   seats, 510,000 sq ft, parabolic roof.
 * - Mapterhorn terrain: the ground rises about 3 m from the west wing to
 *   the east front; the east pavilion's glass starts 3 m up.
 *
 * Photo-scaled (from the east-front photos, by the pavilion's 61 m width in
 * OSM): the arch's crown 40 m, its eaves 30 m at the north and south walls,
 * the pavilion 23 m, the north-east glass block 42 m. Estimated: the wings
 * 15 m (their roofs sit well below the eaves in NAIP and the photos); the
 * navy colour pulled light from the photos' royal navy.
 *
 * Doubts: no licensed photo of the north, south or west sides; all heights
 * from one direction and +-20%. The west gable and the long side walls
 * are drawn navy like the east gable, unseen in any licensed photo; the training wings as plain glass-banded
 * boxes. The lattice light masts on the plaza are left out.
 */
import { Part, type V3 } from './mesh'
import { finishModel, prism, type XY, type Facade } from './nyc-570-lexington'
import { face } from './nyc-columbus-monument'
import { PALETTE, finish } from './palette'

const SX = 3.27, SY = -20.41
const m = (p: XY): XY => [p[0] + SX, p[1] + SY]

const OUTLINE: XY[] = ([
  [-74.8, 130.6], [-75.1, 98.9], [-93.6, 99.1], [-94.2, 38.7], [-75.7, 38.6], [-76.6, -47.1], [-72.2, -47.2], [-72.3, -53.6],
  [-71.9, -92.6], [-45.8, -92.5], [-45.9, -99.5], [-47.7, -99.4], [-48.0, -129.3], [-19.4, -129.6], [-18.6, -50.4],
  [-7.0, -50.6], [-7.1, -56.2], [39.1, -56.6], [39.2, -46.6], [83.0, -47.0], [83.9, -41.3], [86.7, -27.3], [87.1, -7.7],
  [93.4, -7.7], [93.8, 26.7], [94.0, 53.4], [87.7, 53.5], [87.9, 73.3], [82.2, 125.4], [60.7, 125.6], [60.4, 98.2],
  [-25.1, 99.0], [-24.8, 130.1],
] as XY[]).map(m)

const navy = new Part(), roof = new Part(), trim = new Part(), win = new Part(), wall = new Part(), board = new Part()

// Wings: the whole outline at 15 m, glass bands of offices.
const WING = 15
const offices: Facade = { bay: 7, ratio: 0.9, floor: 4.2, group: 1, spandrel: 0.9, sill: 1.0, ground: 0.8, head: 1.0, minLength: 6 }
prism({ wall, win, roof, ring: OUTLINE, z0: 0, z1: WING, facade: offices })

// The north-east glass office block beside the plaza.
const glassy: Facade = { bay: 6, ratio: 0.92, floor: 4.2, group: 2, spandrel: 0.8, sill: 0.6, head: 1.0, minLength: 5 }
prism({ wall, win, roof, ring: ([[62, 89], [86, 89], [82.2, 125.4], [62, 125.6]] as XY[]).map(m), z0: 0, z1: 42, facade: glassy })

// ---------------------------------------------------------------------------
// The stadium: a barrel roof spanning north–south, its arch facing east.
// ---------------------------------------------------------------------------
const W0 = -56, E0 = 86, S0 = -42, N0 = 90
const CROWN = 40, EAVE = 30, OVER = 2.5, FASCIA = 1.6, SEG = 14
const [x0, y0] = m([W0, S0]), [x1, y1] = m([E0, N0])
const yc = (y0 + y1) / 2, half = (y1 - y0) / 2 + OVER
// Circular arc through the eaves and the crown.
const R = (half * half + (CROWN - EAVE) ** 2) / (2 * (CROWN - EAVE))
const arcZ = (y: number) => CROWN - R + Math.sqrt(Math.max(0, R * R - (y - yc) ** 2))
const ys = Array.from({ length: SEG + 1 }, (_, i) => yc - half + (2 * half * i) / SEG)
const inside: V3 = [(x0 + x1) / 2, yc, 10]
// Gable walls (navy) under the arch, east and west; long walls north and south.
for (const [x, out] of [[x1, 1], [x0, -1]] as [number, number][]) {
  for (let i = 0; i < SEG; i++) {
    const ya = Math.max(y0, Math.min(y1, ys[i])), yb = Math.max(y0, Math.min(y1, ys[i + 1]))
    if (yb - ya < 0.01) continue
    face(navy, [x, ya, 0], [x, yb, 0], [x, yb, arcZ(yb) - FASCIA], [x, ya, arcZ(ya) - FASCIA], [x - out, (ya + yb) / 2, 5])
  }
}
for (const y of [y0, y1]) {
  const n = 10
  for (let k = 0; k < n; k++) {
    const a = x0 + ((x1 - x0) * k) / n, b = x0 + ((x1 - x0) * (k + 1)) / n
    face(navy, [a, y, 0], [b, y, 0], [b, y, arcZ(y) - FASCIA], [a, y, arcZ(y) - FASCIA], [(a + b) / 2, yc, 5])
  }
}
// The barrel: roof on top, silver fascia round its edge, overhanging the walls.
const rx0 = x0 - OVER, rx1 = x1 + OVER
for (let i = 0; i < SEG; i++) {
  const ya = ys[i], yb = ys[i + 1], za = arcZ(ya), zb = arcZ(yb)
  face(roof, [rx0, ya, za], [rx1, ya, za], [rx1, yb, zb], [rx0, yb, zb], [(rx0 + rx1) / 2, (ya + yb) / 2, za - 5])
  face(trim, [rx0, ya, za - FASCIA], [rx1, ya, za - FASCIA], [rx1, yb, zb - FASCIA], [rx0, yb, zb - FASCIA], [(rx0 + rx1) / 2, (ya + yb) / 2, za + 5])
  for (const [x, s] of [[rx1, 1], [rx0, -1]] as [number, number][])
    face(trim, [x, ya, za - FASCIA], [x, yb, zb - FASCIA], [x, yb, zb], [x, ya, za], [x - s, (ya + yb) / 2, za - 1])
}
for (const [y, s] of [[ys[0], -1], [ys[SEG], 1]] as [number, number][]) {
  const z = arcZ(y)
  face(trim, [rx0, y, z - FASCIA], [rx1, y, z - FASCIA], [rx1, y, z], [rx0, y, z], [(rx0 + rx1) / 2, y - s, z - 1])
}
// The white Ford oval high on the east gable.
{
  const cy = yc, cz = 34, a = 9, b = 3.6, x = x1 + 0.08, n = 16
  for (let i = 0; i < n; i++) {
    const t0 = (i / n) * 2 * Math.PI, t1 = ((i + 1) / n) * 2 * Math.PI
    face(trim, [x, cy, cz], [x, cy + a * Math.cos(t0), cz + b * Math.sin(t0)], [x, cy + a * Math.cos(t1), cz + b * Math.sin(t1)], [x, cy, cz], [x - 1, cy, cz])
  }
}

// The glass entrance pavilion on the plaza, with its video board.
{
  const [px0, py0] = m([E0, -7.7]), [px1, py1] = m([94.8, 53.4]), H = 23
  const ring: XY[] = [[px0, py0], [px1, py0], [px1, py1], [px0, py1]]
  const lobby: Facade = { bay: 6, ratio: 0.94, floor: 5.5, group: 1, spandrel: 1.0, sill: 3.4, ground: 3.4, head: 0.8, minLength: 4 }
  prism({ wall, win, roof, ring, z0: 0, z1: H, facade: lobby })
  const bw = 12, bh = 9, bz = 9, x = px1 + 0.12
  face(board, [x, yc - bw, bz], [x, yc + bw, bz], [x, yc + bw, bz + bh], [x, yc - bw, bz + bh], [x - 5, yc, bz])
}

finishModel('Ford Center at The Star', 'dal-ford-center-the-star', [
  { part: navy, material: finish('cowboys-navy', 0x3e57a6) },
  { part: roof, material: PALETTE.roof },
  { part: trim, material: PALETTE.trim },
  { part: win, material: windowGlass() },
  { part: wall, material: PALETTE.stone },
  { part: board, material: finish('neon-video-board', 0x3c4f63, 0.4) },
], { bearing: 0, osm: 'way/518594979', height: CROWN }, 5000)

function windowGlass() {
  return { name: 'window', color: 0x7f99b3, roughness: 0.35 }
}
