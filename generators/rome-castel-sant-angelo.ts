/**
 * Castel Sant'Angelo (Mausoleum of Hadrian), Rome: procedural, CC0-1.0,
 * no textures.
 *   bun generators/rome-castel-sant-angelo.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 357.3 (the
 * square of curtain walls runs 2.7 degrees anticlockwise of north in OSM).
 * Origin: the centroid of the OSM outline way/8035487, at 12.466347,
 * 41.903074. The drum's centre is at (1.2, -3.6), the walls' square
 * centred on (0, -4.2).
 *
 * Modelled, inside the outline: the great drum (64 m across), its rough
 * lower half of peperino and opus caementicium, the travertine string
 * course, the ochre upper zone, the band of corbels (machicolations) under
 * the parapet, the ring gallery of Pius IV with its windows and its tiled
 * roof running round the top; the terrace inside it; the papal apartments
 * on top: the Julius II block on the south edge with its real open loggia
 * (two columns), the central tower with the Terrace of the Angel, the
 * northern blocks with hipped roofs and the Paul III loggia (five real
 * arches) facing north; the bronze Archangel Michael (P. A. Verschaffelt,
 * 1753) on his travertine pedestal at the terrace's south edge, sheathing
 * his sword: legs in stride, kilt and cuirass, right arm raised with the
 * hilt over his head, the blade
 * running down to the scabbard at his left hip, wings spread out and
 * back in layers of rounded feathers, cloak; the
 * square curtain walls with their merlons and the gate in the south wall;
 * the corner bastions named for the Evangelists (St Matthew, St Mark, St
 * Luke, St John), drawn from the OSM outline: pointed on the south-west,
 * north-west and north-east, and the round tower of the south-east
 * corner; and the buildings in the courtyard between walls and drum, as
 * OSM maps them.
 *
 * Not modelled (outside the outline, separate features): the Passetto di
 * Borgo, Ponte Sant'Angelo, and the Pius IV pentagonal outer works and moat
 * (in OSM only as walls and a park, not buildings; the map draws the
 * ground and the gardens).
 *
 * Sources
 * - OSM (ODbL), fetched 2026-11: the outline way/8035487 (building=yes,
 *   historic=castle, wikidata Q486382), used vertex by vertex for the walls
 *   and bastions; the wall walks way/263043433, 263043349, 263043576,
 *   263043354 (15-16 m) and bastion walks 263043558, 263043562, 263043362;
 *   145 merlon parts (15-18 m, ~1 m square); the round tower 263043561 and
 *   its rings 263043607/608; the drum ring 263043611 (31-32 m, r 33); the
 *   ring galleries 263043365 / 263043374 (31 m, gabled) and the terrace
 *   263043553 (28 m); the apartments: tower 263043400 (41 m), 263043573
 *   (42 m hipped), 263043352 / 263043351 (36-37 m hipped), the Paul III
 *   loggia 263043348 (30-36), the Julius II block 263043366 (35) and loggia
 *   263043359 (30-35); courtyard buildings 263043346, 263043350 (10 m),
 *   263043355 (20 m), 128817400 (22 m), 128817397, 128817401, 263043480
 *   (20 m), 263043603 (18 m), 263043606 (18 m); the part relations
 *   2720817 (the mausoleum's base ring), 3533071/73/80 (drum rings),
 *   3533072/79 (the curtain-wall ring, inner edge used for the courtyard),
 *   3533076/78 (the block between the Julius II front and the tower),
 *   3533081/77 (the tower's parapet and posts), 3533074/82/83 (the small
 *   round tower on the SE bastion); the angel's node
 *   node/1422517327 (height 48).
 * - Published (Wikipedia "Castel Sant'Angelo"; it.wikipedia "Mausoleo di
 *   Adriano"): drum 64 m across; height 48 m to the angel; the 1753 bronze
 *   angel by Peter Anton von Verschaffelt, shown sheathing his sword.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 Krzysztof Golik, "Castel Sant'Angelo in Rome (17).jpg" and "(9).jpg",
 *     CC BY-SA 4.0 (from the bridge and from across the Tiber to the
 *     south-east: elevations, zones, the round tower; height scale from the
 *     64 m drum, ~11.8 px/m in (9));
 *     https://commons.wikimedia.org/wiki/File:Castel_Sant'Angelo_in_Rome_(17).jpg
 *     https://commons.wikimedia.org/wiki/File:Castel_Sant'Angelo_in_Rome_(9).jpg
 *   2 Gaius Cornelius, "Castel Sant'Angelo (Rome).JPG", CC BY-SA 3.0 (from
 *     St Peter's dome, the west: the gallery roof ring, the apartments'
 *     massing, the walls' merlons);
 *     https://commons.wikimedia.org/wiki/File:Castel_Sant'Angelo_(Rome).JPG
 *   3 Livioandronico2013, "Top of Castel Sant'Angelo.jpg", CC BY-SA 4.0
 *     (the south face of the apartments, the Julius II loggia, the angel and
 *     pedestal: proportions at ~46 px/m);
 *     https://commons.wikimedia.org/wiki/File:Top_of_Castel_Sant'Angelo.jpg
 *   4 AngMoKio, "StAngelo Bridge Rome.jpg", CC BY-SA 2.5 (from the south-east
 *     along the Tiber: wall and drum heights over the street);
 *     https://commons.wikimedia.org/wiki/File:StAngelo_Bridge_Rome.jpg
 *   5 Gary Todd, "Castel Sant'Angelo Statue of Archangel Michael
 *     (48500492251).jpg", public domain, and Jean-Pol Grandmont,
 *     "Archange saint Michel - Castel Sant'Angelo.jpg", CC BY-SA 4.0 (the
 *     angel's pose and colour);
 *     https://commons.wikimedia.org/wiki/File:Castel_Sant'Angelo_Statue_of_Archangel_Michael_(48500492251).jpg
 *     https://commons.wikimedia.org/wiki/File:Archange_saint_Michel_-_Castel_Sant'Angelo.jpg
 *   6 Diego Delso, "Castillo de Sant'Angelo, Roma, Italia, 2022-09-14, DD
 *     58-60 HDR.jpg", CC BY-SA 4.0 (night: the whole castle floodlit gold).
 *     https://commons.wikimedia.org/wiki/File:Castillo_de_Sant'Angelo,_Roma,_Italia,_2022-09-14,_DD_58-60_HDR.jpg
 * - Terrain: Mapterhorn has only z13 here (z14-15 404); it slopes about
 *   3.5 m down from west to east over the site and does not show the moat.
 *   OSM's heights and photos 1 and 4 measure from the street, so y = 0 is
 *   the street level at the castle's lowest (eastern) side, the walls start
 *   there, and elevation is 0. Where the moat garden is lower, the walls'
 *   feet are below the map's ground there and are drawn shorter than they
 *   stand from the moat floor.
 *
 * Numbers
 * - Measured from OSM: every plan dimension; the drum's radius 33.
 * - From photos 1 and 4 (scaled on the drum): curtain walls 11.2 m to the
 *   walk with merlons to 13.2, about 0.4 of the drum's height in all three
 *   street-level photos (OSM's 15/18 are taller than the photos from the
 *   street show; they may be from the moat floor); the small round tower on
 *   the SE bastion to 19.2 (OSM 25);
 *   drum zones: rough to 18, string
 *   course to 18.9, ochre zone to 25.3, corbel band to 26.3, gallery wall to
 *   31.6, roof ridge 32.9 (OSM 31-32).
 * - From photos 1 and 3 (lead review, round 1): the central complex
 *   rises about 16 m over the drum top with three window rows over the
 *   Julius II loggia (7.2 x 3.0 m) and the angel's terrace above. So the
 *   Julius II front block (OSM 263043366, 35 m) is drawn to 44.5, the block
 *   behind it (relations 3533076/78, 35.5-37) to 38.5, the tower (OSM 41)
 *   to 47.5, the north block 44 + hipped roof, the Paul III block 40.5.
 *   Pedestal 2.2 m; the angel drawn 1.2 times life (5.5 m) so it reads at
 *   phone size, the raised hilt at 54.6 m. DOUBT: this is well over OSM's
 *   node (48) and the usual published 48 m; photos 1 and 4, scaled on the
 *   drum, give 50-60 m, so the true figure is uncertain. Courtyard
 *   buildings lowered to 12.5-13.5 m (OSM 18-22), as the photos show them
 *   hardly over the walls. The west and east wings on the drum top to 36 m
 *   (OSM 31): photos 1 and 2 show two storeys of windows over the gallery.
 *   The drum's rim carries a battlement of 64 merlons (1.7 m) on the
 *   gallery wall, the tiled gallery roof sloping inside it.
 * - Estimated: the Paul III loggia's five arches; the courtyard buildings'
 *   roofs (flat-topped here, tiled colour); the corbels (36, about a
 *   quarter of the real number) and the curtain walls' merlons (about an
 *   eighth, spaced 11 m) are thinned to keep the budget for the drum,
 *   apartments and angel.
 *
 * Night: the castle is floodlit all round (photo 6): drum, walls, apartments
 *   and the angel carry floodlight; the windows glow.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { ellipsoid, extrude, plus, prism, rect, save, scale, smooth, tube, unit, earcut, type XY } from './dc-wwii-memorial'

const TAU = Math.PI * 2

const peperino = new Part() // grey-brown rough lower drum
const ochre = new Part() // upper drum, walls, gallery
const brick = new Part() // apartments, courtyard buildings, tiled roofs
const trav = new Part() // travertine: string course, columns, pedestal
const bronze = new Part() // the angel
const win = new Part() // windows and openings

// ---------------------------------------------------------------- helpers

function lathe(p: Part, cx: number, cy: number, prof: Array<[number, number]>, n: number, crease = 55) {
  smooth(p, m => {
    const rings = prof.map(([r, z]) => Array.from({ length: n }, (_, i) => {
      const a = ((i + 0.5) / n) * TAU
      return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3
    }))
    m.loft(rings)
  }, crease)
}
function tri(p: Part, a: V3, b: V3, c: V3, dir: V3) {
  const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  if (n[0] * dir[0] + n[1] * dir[1] + n[2] * dir[2] < 0) p.tri(a, c, b)
  else p.tri(a, b, c)
}
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, dir: V3) {
  tri(p, a, b, c, dir)
  tri(p, a, c, d, dir)
}
function face(p: Part, ring: XY[], at: (u: number, v: number) => V3, dir: V3) {
  for (const [i, j, k] of earcut(ring)) tri(p, at(...ring[i]), at(...ring[j]), at(...ring[k]), dir)
}
/** Extrude a plan polygon from z0 to z1 (caps on top only). */
const block = (p: Part, ring: XY[], z0: number, z1: number) => extrude(p, ring, z0, z1, undefined, { caps: [false, true] })
/** A box, chamfered on top. */
const box = (p: Part, cx: number, cy: number, hx: number, hy: number, z0: number, z1: number, b = 0) => prism(p, rect(cx, cy, hx, hy), z0, z1, b)
/** A small block standing on a wall top, turned along `dir`, without a bottom: 5 faces. */
function merlon(p: Part, c: XY, dir: XY, w: number, d: number, z0: number, z1: number) {
  const ux = dir[0], uy = dir[1], vx = -uy, vy = ux
  const P = (s: number, t: number, z: number): V3 => [c[0] + ux * s + vx * t, c[1] + uy * s + vy * t, z]
  const corners: [number, number][] = [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]]
  for (let k = 0; k < 4; k++) {
    const [s0, t0] = corners[k], [s1, t1] = corners[(k + 1) % 4]
    const mx = (s0 + s1) / 2, my = (t0 + t1) / 2
    quad(p, P(s0, t0, z0), P(s1, t1, z0), P(s1, t1, z1), P(s0, t0, z1), [ux * mx + vx * my, uy * mx + vy * my, 0])
  }
  quad(p, P(-w / 2, -d / 2, z1), P(w / 2, -d / 2, z1), P(w / 2, d / 2, z1), P(-w / 2, d / 2, z1), [0, 0, 1])
}

// ---------------------------------------------------------------- plan (OSM, model frame)

const OUTLINE: XY[] = [[-31.3,-48.1],[1.3,-48.4],[32.1,-48.7],[32.2,-49.0],[32.5,-50.0],[32.9,-51.4],[33.2,-52.4],[33.7,-53.8],[33.9,-54.7],[35.0,-58.2],[36.7,-58.6],[37.6,-58.9],[39.1,-59.2],[40.0,-59.5],[41.3,-59.8],[43.3,-59.5],[44.3,-59.3],[45.8,-59.1],[46.8,-58.9],[48.6,-58.6],[50.1,-56.9],[50.7,-56.1],[51.7,-55.0],[52.4,-54.2],[53.5,-52.8],[53.6,-50.8],[53.7,-49.8],[53.7,-49.6],[53.7,-48.3],[53.7,-47.3],[53.8,-44.5],[53.2,-43.5],[52.7,-42.6],[52.0,-41.3],[51.5,-40.4],[50.5,-38.7],[49.3,-38.4],[48.4,-38.0],[47.0,-37.6],[46.0,-37.3],[43.7,-36.5],[43.4,25.2],[44.0,25.3],[47.7,25.9],[52.5,26.6],[57.3,27.4],[58.9,27.7],[61.3,32.8],[63.4,37.3],[63.0,43.7],[62.6,48.7],[62.5,49.4],[59.5,52.6],[56.0,56.2],[54.6,57.7],[52.6,58.3],[47.8,59.6],[43.0,61.0],[41.9,60.5],[36.7,57.7],[33.1,55.9],[32.9,55.0],[31.7,50.2],[29.9,42.7],[29.2,39.8],[-0.4,40.0],[-17.0,40.1],[-18.6,40.1],[-29.5,40.2],[-31.5,46.6],[-32.9,51.3],[-34.0,54.6],[-37.5,55.9],[-41.6,57.5],[-44.1,58.4],[-48.1,57.6],[-50.8,57.0],[-55.4,56.1],[-59.1,52.7],[-61.9,50.1],[-62.0,47.3],[-62.2,42.8],[-62.3,41.2],[-62.4,39.0],[-61.6,37.2],[-59.2,32.1],[-57.7,28.7],[-55.5,28.1],[-51.7,26.9],[-46.4,25.4],[-44.0,24.6],[-43.5,-10.8],[-43.2,-34.8],[-47.2,-36.0],[-48.3,-36.3],[-54.8,-38.2],[-55.7,-40.5],[-56.1,-41.6],[-57.5,-45.6],[-56.4,-49.2],[-56.1,-50.3],[-55.7,-51.6],[-55.0,-53.9],[-52.5,-56.1],[-51.7,-56.9],[-50.1,-58.4],[-46.4,-59.4],[-45.2,-59.8],[-42.4,-60.6],[-38.7,-59.2],[-37.6,-58.8],[-34.7,-57.7],[-33.9,-55.3],[-33.5,-54.2]]
const ROUND_TOWER: XY[] = [[33.3,-48.8],[33.6,-49.7],[34.0,-51.1],[34.3,-52.0],[34.8,-53.4],[35.1,-54.4],[36.0,-57.5],[36.9,-57.7],[37.8,-57.9],[39.3,-58.3],[40.2,-58.5],[41.5,-58.8],[43.2,-58.5],[44.2,-58.4],[45.7,-58.2],[46.7,-58.0],[48.2,-57.8],[49.4,-56.4],[50.0,-55.6],[51.0,-54.4],[51.7,-53.7],[52.6,-52.5],[52.7,-50.7],[52.7,-49.7],[52.7,-48.2],[52.8,-47.3],[52.8,-44.9],[52.3,-44.0],[51.8,-43.1],[51.1,-41.8],[50.6,-40.9],[49.9,-39.8],[49.0,-39.5],[48.0,-39.1],[46.6,-38.7],[45.7,-38.4],[43.7,-37.7],[42.7,-37.4],[42.7,-44.1],[42.2,-44.3],[41.9,-44.5],[41.6,-44.7],[41.1,-45.3],[40.7,-45.9],[40.3,-46.5],[40.1,-47.3],[40.1,-47.9],[33.0,-47.8]]
const COURT: Array<[XY[], number]> = [
  [[[-40.3,-16.4],[-37.2,-16.4],[-31.0,-30.8],[-25.6,-35.3],[-14.4,-42.4],[-11.1,-42.6],[-11.1,-44.6],[-33.5,-44.2],[-40.3,-44.1],[-40.3,-39.0]], 9],
  [[[40.2,-25.9],[36.4,-24.5],[27.5,-34.4],[23.3,-37.9],[11.0,-40.5],[10.9,-43.9],[24.2,-43.9],[38.4,-43.8],[38.4,-41.3],[40.3,-41.3],[40.2,-29.1]], 9],
  [[[-44.0,33.7],[-44.0,24.6],[-43.9,14.8],[-40.4,14.9],[-36.4,15.0],[-31.2,25.8],[-28.4,29.0],[-15.8,34.7],[-16.0,35.4],[-17.0,40.0],[-30.7,40.0],[-35.2,40.0],[-39.2,40.0]], 13],
  [[[14.0,38.0],[14.0,35.5],[14.0,33.2],[14.0,29.6],[40.0,29.7],[41.2,29.7],[41.1,38.0],[40.0,38.0]], 13.5],
  [[[29.2,-33.1],[35.1,-26.4],[40.2,-29.1],[41.8,-29.9],[39.0,-36.7]], 12.5],
  [[[24.2,-43.9],[24.2,-39.3],[29.0,-38.2],[39.8,-38.4],[39.9,-43.9]], 12.5],
  [[[-40.3,-39.0],[-40.3,-44.1],[-33.5,-44.2],[-33.5,-39.0]], 12.5],
  [[[14.0,38.0],[8.6,38.0],[8.6,35.5],[8.6,33.2],[14.0,33.2],[14.0,35.5]], 12.5],
  [[[-5.1,-36.0],[-5.2,-39.1],[7.9,-39.5],[8.0,-35.8],[2.6,-36.6],[-0.6,-36.6],[-3.2,-36.4]], 13],
]

const DC: XY = [1.2, -3.6] // drum centre
const RD = 33.0
const WALL = 11.2, MERLON = 2.0
const INNER = { x0: -40.5, x1: 40.3, y0: -44.6, y1: 38.0 } // relation/3533072's inner ring

// ---------------------------------------------------------------- the drum

const N = 36
// Rough lower half, grey-brown.
lathe(peperino, DC[0], DC[1], [[RD + 0.3, 0], [RD + 0.3, 18.0]], N)
// Travertine string course.
lathe(trav, DC[0], DC[1], [[RD + 0.3, 18.0], [RD + 0.65, 18.15], [RD + 0.65, 18.75], [RD, 18.9]], N)
// Ochre upper zone, the corbelled band, the gallery wall; inside, the
// gallery's inner wall and the terrace.
const BAND0 = 25.3, BAND1 = 26.3, GAL = 31.6, RIDGE = 32.9, RIN = 28.3, TERRACE = 28.0
lathe(ochre, DC[0], DC[1], [[RD, 18.9], [RD, BAND0], [RD + 0.9, BAND0 + 0.05], [RD + 0.9, BAND1], [RD + 0.6, BAND1], [RD + 0.6, GAL]], N)
lathe(ochre, DC[0], DC[1], [[RIN, GAL - 0.1], [RIN, TERRACE], [0.01, TERRACE]], N)
// The gallery's tiled roof, a ring ridge.
lathe(brick, DC[0], DC[1], [[RD + 0.05, GAL - 0.3], [RD - 2.0, RIDGE], [RIN - 0.2, GAL - 0.1]], N)
// The battlement on the drum's rim: a walk on the gallery wall's top and a
// strong ring of merlons (photos 1 and 2), 64 round (about two thirds of
// the real number).
lathe(ochre, DC[0], DC[1], [[RD + 0.6, GAL], [RD + 0.1, GAL]], N)
for (let k = 0; k < 64; k++) {
  const a = ((k + 0.5) / 64) * TAU, ux = Math.cos(a), uy = Math.sin(a)
  merlon(ochre, [DC[0] + (RD + 0.38) * ux, DC[1] + (RD + 0.38) * uy], [-uy, ux], 1.35, 0.5, GAL, GAL + 1.7)
}
// Corbels under the band: 36 wedges (about a quarter of the real number).
for (let k = 0; k < 36; k++) {
  const a = ((k + 0.25) / 36) * TAU, ux = Math.cos(a), uy = Math.sin(a)
  const c: XY = [DC[0] + (RD + 0.45) * ux, DC[1] + (RD + 0.45) * uy]
  const tx = -uy, ty = ux, w = 0.45
  const P = (s: number, t: number, z: number): V3 => [c[0] + tx * s + ux * t, c[1] + ty * s + uy * t, z]
  // A wedge: full depth at the band, tapering to the wall below.
  const top = BAND0, bot = BAND0 - 1.1
  quad(ochre, P(-w, 0.45, top), P(-w, -0.45, bot), P(w, -0.45, bot), P(w, 0.45, top), [ux, uy, -0.8])
  tri(ochre, P(-w, 0.45, top), P(-w, -0.45, top), P(-w, -0.45, bot), [-tx, -ty, 0])
  tri(ochre, P(w, 0.45, top), P(w, -0.45, bot), P(w, -0.45, top), [tx, ty, 0])
}
// Windows in the gallery wall, and a few small ones in the ochre zone.
for (let k = 0; k < 28; k++) {
  const a = ((k + 0.5) / 28) * TAU, ux = Math.cos(a), uy = Math.sin(a), tx = -uy, ty = ux
  const r = RD + 0.64, cx = DC[0] + r * ux, cy = DC[1] + r * uy, w = 0.5
  const z0 = 28.0, z1 = 29.8
  quad(win, [cx - tx * w, cy - ty * w, z0], [cx + tx * w, cy + ty * w, z0], [cx + tx * w, cy + ty * w, z1], [cx - tx * w, cy - ty * w, z1], [ux, uy, 0])
}

// ---------------------------------------------------------------- the papal apartments

// The central tower with the Terrace of the Angel.
const TX = 1.3, TY = -3.75, TOWER = 47.5
box(brick, TX, TY, 8.5, 8.25, TERRACE, TOWER - 0.6)
box(trav, TX, TY, 8.85, 8.6, TOWER - 0.6, TOWER - 0.25)
box(ochre, TX, TY, 8.2, 7.95, TOWER - 0.25, TOWER - 0.2)
// The terrace parapet, a ring of four walls.
for (const [cx, cy, hx, hy] of [[TX, TY - 8.2, 8.5, 0.3], [TX, TY + 8.2, 8.5, 0.3], [TX - 8.2, TY, 0.3, 7.9], [TX + 8.2, TY, 0.3, 7.9]])
  box(brick, cx, cy, hx, hy, TOWER - 0.25, TOWER + 0.8, 0.1)
// Windows on the tower's faces, four storeys.
for (const z of [34.2, 37.6, 41.0, 44.2]) for (const s of [-4.5, 0, 4.5]) {
  quad(win, [TX + s - 0.6, TY - 8.27, z], [TX + s + 0.6, TY - 8.27, z], [TX + s + 0.6, TY - 8.27, z + 1.8], [TX + s - 0.6, TY - 8.27, z + 1.8], [0, -1, 0])
  quad(win, [TX + 8.52, TY + s - 0.6, z], [TX + 8.52, TY + s + 0.6, z], [TX + 8.52, TY + s + 0.6, z + 1.8], [TX + 8.52, TY + s - 0.6, z + 1.8], [1, 0, 0])
  quad(win, [TX - 8.52, TY + s - 0.6, z], [TX - 8.52, TY + s + 0.6, z], [TX - 8.52, TY + s + 0.6, z + 1.8], [TX - 8.52, TY + s - 0.6, z + 1.8], [-1, 0, 0])
}

/** A hipped roof over a rectangle. */
function hipped(p: Part, cx: number, cy: number, hx: number, hy: number, z0: number, rise: number) {
  const r = Math.min(hx, hy)
  const a: V3 = [cx - hx, cy - hy, z0], b: V3 = [cx + hx, cy - hy, z0], c: V3 = [cx + hx, cy + hy, z0], d: V3 = [cx - hx, cy + hy, z0]
  const along = hx >= hy
  const r0: V3 = along ? [cx - hx + r, cy, z0 + rise] : [cx, cy - hy + r, z0 + rise]
  const r1: V3 = along ? [cx + hx - r, cy, z0 + rise] : [cx, cy + hy - r, z0 + rise]
  if (along) {
    quad(p, a, b, r1, r0, [0, -1, 1]); quad(p, c, d, r0, r1, [0, 1, 1])
    tri(p, b, c, r1, [1, 0, 1]); tri(p, d, a, r0, [-1, 0, 1])
  } else {
    quad(p, b, c, r1, r0, [1, 0, 1]); quad(p, d, a, r0, r1, [-1, 0, 1])
    tri(p, a, b, r0, [0, -1, 1]); tri(p, c, d, r1, [0, 1, 1])
  }
}
// The west and east wings on the drum's top (OSM 263043365, 263043374):
// two storeys over the gallery roof (photos 1 and 2; OSM has 31 m),
// windows towards the outside, tile roofs.
const WING = 36.0
{
  const W: XY[] = [[-18.3,-21.9],[-21.8,-21.5],[-23.3,-19.2],[-25.3,-15.5],[-25.5,-15.1],[-26.5,-12.3],[-27.4,-8.0],[-27.6,-3.5],[-27.4,0.7],[-26.4,3.6],[-24.6,8.3],[-21.5,13.3],[-18.4,16.6],[-14.1,19.7],[-10.8,21.3],[-10.8,20.7],[-10.7,10.0],[-16.2,10.0],[-17.7,-13.3]]
  const E: XY[] = [[14.8,25.1],[13.2,21.4],[13.4,13.3],[15.5,13.3],[17.6,11.4],[19.3,9.2],[21.1,6.8],[22.3,4.1],[23.1,1.9],[23.9,-1.8],[23.9,-6.2],[23.1,-9.9],[22.1,-13.3],[21.9,-13.6],[20.5,-16.1],[20.0,-17.1],[15.3,-22.1],[15.4,-27.6],[15.4,-32.1],[15.4,-33.3],[15.6,-33.2],[19.7,-30.8],[23.1,-28.0],[25.7,-25.4],[27.7,-22.9],[30.4,-18.2],[32.4,-12.9],[33.5,-7.1],[33.5,-1.3],[32.5,4.3],[30.5,9.7],[27.7,14.4],[24.0,18.8],[19.6,22.4]]
  // Pull the outer edges in to the gallery's inner wall, so the wings stand behind it.
  const pull = (ring: XY[]) => ring.map(([x, y]) => {
    const dx = x - DC[0], dy = y - DC[1], r = Math.hypot(dx, dy)
    return r > RIN - 0.3 ? [DC[0] + (dx / r) * (RIN - 0.3), DC[1] + (dy / r) * (RIN - 0.3)] as XY : [x, y] as XY
  })
  for (const ring of [pull(W), pull(E)]) {
    extrude(brick, ring, TERRACE, WING, undefined, { caps: [false, false] })
    face(brick, ring, (u, v) => [u, v, WING], [0, 0, 1])
  }
  // Windows on the wings' outer faces, above the gallery roof.
  for (let k = 0; k < 22; k++) {
    const side = k < 11 ? -1 : 1, j = k % 11
    const a = side < 0 ? Math.PI - 0.62 + (j / 10) * 1.24 + (j > 5 ? 0 : 0) : -0.62 + (j / 10) * 1.24
    const ux = Math.cos(a), uy = Math.sin(a), tx = -uy, ty = ux, r = RIN - 0.27
    const cx = DC[0] + r * ux, cy = DC[1] + r * uy
    for (const z of [33.1, 34.6])
      quad(win, [cx - tx * 0.5, cy - ty * 0.5, z], [cx + tx * 0.5, cy + ty * 0.5, z], [cx + tx * 0.5, cy + ty * 0.5, z + 1.0], [cx - tx * 0.5, cy - ty * 0.5, z + 1.0], [ux, uy, 0])
  }
}

// North of the tower: the block with the hipped roof (OSM 263043573).
box(ochre, 1.2, 10.4, 8.4, 6.0, TERRACE, 44.0)
hipped(brick, 1.2, 10.4, 8.7, 6.3, 44.0, 2.2)
for (const s of [-1, 1]) for (const yy of [7.4, 13.4]) for (const z of [35.2, 38.4, 41.6])
  quad(win, [1.2 + s * 8.42, yy - 0.55, z], [1.2 + s * 8.42, yy + 0.55, z], [1.2 + s * 8.42, yy + 0.55, z + 1.6], [1.2 + s * 8.42, yy - 0.55, z + 1.6], [s, 0, 0])

// The Paul III block (263043352) and its loggia facing north: five arches
// open into a real gallery.
{
  const x0 = -8.4, x1 = 10.1, y0 = 16.3, y1 = 27.4, top = 40.5, F = 33.0
  const ARCH_R = 1.25, SPR = 35.2
  // Sides and back of the block.
  quad(brick, [x0, y0, TERRACE], [x0, y1, TERRACE], [x0, y1, top], [x0, y0, top], [-1, 0, 0])
  quad(brick, [x1, y0, TERRACE], [x1, y1, TERRACE], [x1, y1, top], [x1, y0, top], [1, 0, 0])
  hipped(brick, (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2 + 0.3, (y1 - y0) / 2 + 0.3, top, 1.9)
  // The front below the loggia.
  quad(brick, [x0, y1, TERRACE], [x1, y1, TERRACE], [x1, y1, F], [x0, y1, F], [0, 1, 0])
  // The arcade face, open below its arches.
  const cxs = [-5.6, -2.6, 0.85, 4.3, 7.3].map(v => v - 0.0)
  const ring: XY[] = [[x0, F]]
  for (const c of cxs) {
    ring.push([c - ARCH_R, F])
    for (let k = 0; k <= 6; k++) {
      const a = Math.PI - (Math.PI * k) / 6
      ring.push([c + ARCH_R * Math.cos(a), SPR + ARCH_R * Math.sin(a)])
    }
    ring.push([c + ARCH_R, F])
  }
  ring.push([x1, F], [x1, top], [x0, top])
  face(trav, ring, (u, v) => [u, y1, v], [0, 1, 0])
  // The gallery behind: floor, back wall (dark, the frescoed rooms) and ceiling.
  const D = y1 - 2.6
  quad(ochre, [x0 + 0.6, D, F], [x1 - 0.6, D, F], [x1 - 0.6, y1, F], [x0 + 0.6, y1, F], [0, 0, 1])
  quad(win, [x0 + 0.6, D, F], [x1 - 0.6, D, F], [x1 - 0.6, D, SPR + ARCH_R], [x0 + 0.6, D, SPR + ARCH_R], [0, 1, 0])
  quad(ochre, [x0 + 0.6, D, SPR + ARCH_R], [x1 - 0.6, D, SPR + ARCH_R], [x1 - 0.6, y1, SPR + ARCH_R], [x0 + 0.6, y1, SPR + ARCH_R], [0, 0, -1])
  for (const xx of [x0 + 0.6, x1 - 0.6]) quad(ochre, [xx, D, F], [xx, y1, F], [xx, y1, SPR + ARCH_R], [xx, D, SPR + ARCH_R], [xx < 0 ? 1 : -1, 0, 0])
}

// The Julius II block on the south edge and its loggia: an opening 7.2 m
// wide with two columns, two storeys of windows above.
{
  const x0 = -7.0, x1 = 10.1, y0 = -36.4, y1 = -27.0, top = 44.5, F = 32.4, L = 35.4
  // Behind it, the lower block running back to the tower (relations
  // 3533076/78), and the front block's back wall above it.
  box(brick, (x0 + x1) / 2, (y1 - 12.0) / 2, (x1 - x0) / 2, (-12.0 - y1) / 2, TERRACE, 38.5)
  quad(brick, [x1, y1, 38.5], [x0, y1, 38.5], [x0, y1, top], [x1, y1, top], [0, 1, 0])
  const lx0 = -2.1, lx1 = 5.1
  quad(brick, [x0, y0, TERRACE], [x0, y1, TERRACE], [x0, y1, top], [x0, y0, top], [-1, 0, 0])
  quad(brick, [x1, y0, TERRACE], [x1, y1, TERRACE], [x1, y1, top], [x1, y0, top], [1, 0, 0])
  quad(brick, [x0, y0, top], [x1, y0, top], [x1, y1, top], [x0, y1, top], [0, 0, 1])
  // South face, around the loggia opening.
  const S = (a: number, b: number, c: number, d: number) => quad(brick, [a, y0, c], [b, y0, c], [b, y0, d], [a, y0, d], [0, -1, 0])
  S(x0, x1, TERRACE, F); S(x0, x1, L, top); S(x0, lx0, F, L); S(lx1, x1, F, L)
  box(trav, (x0 + x1) / 2, y0 - 0.15, (x1 - x0) / 2 + 0.25, 0.35, top - 0.5, top + 0.15)
  box(trav, (lx0 + lx1) / 2, y0 - 0.12, (lx1 - lx0) / 2 + 0.35, 0.25, L, L + 0.5)
  // The loggia: floor, back wall, ceiling, ends, two columns.
  const D = y0 + 2.6
  quad(ochre, [lx0, y0, F], [lx1, y0, F], [lx1, D, F], [lx0, D, F], [0, 0, 1])
  quad(win, [lx0, D, F], [lx1, D, F], [lx1, D, L], [lx0, D, L], [0, -1, 0])
  quad(ochre, [lx0, y0, L], [lx1, y0, L], [lx1, D, L], [lx0, D, L], [0, 0, -1])
  for (const xx of [lx0, lx1]) quad(ochre, [xx, y0, F], [xx, D, F], [xx, D, L], [xx, y0, L], [xx < 1.5 ? 1 : -1, 0, 0])
  for (const xx of [lx0 + 2.4, lx1 - 2.4]) lathe(trav, xx, y0 + 0.5, [[0.28, F], [0.22, L - 0.25], [0.32, L]], 8)
  // Windows on the three storeys above, and either side of the loggia.
  for (const z of [36.4, 39.0, 41.6]) for (const xx of [-4.8, -0.6, 3.6, 7.8])
    quad(win, [xx - 0.55, y0 - 0.03, z], [xx + 0.55, y0 - 0.03, z], [xx + 0.55, y0 - 0.03, z + 1.5], [xx - 0.55, y0 - 0.03, z + 1.5], [0, -1, 0])
  for (const xx of [-5.0, 8.1]) quad(win, [xx - 0.55, y0 - 0.03, F + 0.6], [xx + 0.55, y0 - 0.03, F + 0.6], [xx + 0.55, y0 - 0.03, F + 2.4], [xx - 0.55, y0 - 0.03, F + 2.4], [0, -1, 0])
}

// ---------------------------------------------------------------- the angel

// On a travertine pedestal at the terrace's south edge, facing the bridge
// (south). Figure frame: origin at the feet, +x the figure's right, +y its
// front, metres of the real statue.
{
  const PX = 1.3, PY = -9.6, P0 = TOWER
  prism(trav, rect(PX, PY, 1.05, 1.05, 0, 0.1), P0, P0 + 0.35, 0.08)
  prism(trav, rect(PX, PY, 0.85, 0.85), P0 + 0.35, P0 + 1.9, 0.06)
  prism(trav, rect(PX, PY, 1.0, 1.0, 0, 0.1), P0 + 1.9, P0 + 2.2, 0.08)
  const Z = P0 + 2.2
  // Turned to face -y (figure x → -x, figure y → -y) and drawn 1.2 times
  // life so the figure and wings hold at phone size.
  const K = 1.2
  const V = (p: V3): V3 => [PX - p[0] * K, PY - p[1] * K, Z + p[2] * K]
  const T = (path: V3[], w: number[], d = w, n = 8) => tube(bronze, path.map(V), w.map(v => v * K), d.map(v => v * K), n)
  const E = (c: V3, r: V3, n = 8, rows = 4) => ellipsoid(bronze, V(c), r.map(v => v * K) as V3, n, rows)
  /** A plate in the plane (o, eu, ev), its outline in (u, v), bent back by `bend`·u² along its normal. */
  const plate = (o: V3, eu: V3, ev: V3, out: XY[], t: number, bend = 0) => {
    const n: V3 = unit([eu[1] * ev[2] - eu[2] * ev[1], eu[2] * ev[0] - eu[0] * ev[2], eu[0] * ev[1] - eu[1] * ev[0]])
    extrude(bronze, out, -t, t, (u, v, w) => V(plus(o, plus(scale(eu, u), plus(scale(ev, v), scale(n, w + bend * u * u))))))
  }
  // The rock (cloud) he stands on.
  E([0, 0, 0.16], [0.62, 0.55, 0.2], 10, 3)
  // Legs in stride: the left leg forward with the knee bent, the right
  // leg back, under the kilt of leather straps.
  T([[-0.2, 0.0, 1.3], [-0.24, 0.38, 0.78], [-0.22, 0.34, 0.42], [-0.2, 0.42, 0.18]], [0.17, 0.14, 0.12, 0.11])
  T([[0.2, 0.0, 1.3], [0.23, -0.18, 0.74], [0.25, -0.34, 0.2]], [0.17, 0.14, 0.11])
  // The kilt (pteruges) flaring from the waist, then the cuirass: a waist,
  // a deep chest, the shoulder guards.
  T([[0, 0.0, 1.9], [0, 0.03, 1.45], [0, 0.06, 1.0]], [0.4, 0.55, 0.64], [0.3, 0.42, 0.5], 10)
  T([[0, 0.0, 1.85], [0, 0.04, 2.25], [0, 0.05, 2.6], [0, 0.0, 2.8]], [0.38, 0.44, 0.5, 0.46], [0.26, 0.31, 0.32, 0.26], 10)
  for (const s of [-1, 1]) E([s * 0.46, 0.0, 2.72], [0.2, 0.2, 0.16], 6, 3)
  // Neck and head, turned a little down to his right, with the hair.
  T([[0, 0, 2.8], [0.03, 0.03, 2.98]], [0.11, 0.11])
  E([0.06, 0.06, 3.17], [0.19, 0.21, 0.24], 8, 4)
  E([0.05, -0.03, 3.28], [0.23, 0.21, 0.18], 8, 3)
  // Right arm raised high, the fist over his head holding the hilt.
  T([[0.46, 0, 2.72], [0.64, 0.02, 3.25], [0.48, 0.08, 3.75], [0.24, 0.12, 3.97]], [0.12, 0.11, 0.095, 0.085])
  // The sword: grip and cross-guard in his fist, the blade pointing down
  // across in front of his head towards the scabbard (he is sheathing it).
  T([[0.24, 0.12, 4.1], [0.18, 0.14, 3.85]], [0.05, 0.05], undefined, 5)
  T([[0.0, 0.1, 3.84], [0.38, 0.2, 3.86]], [0.045, 0.045], undefined, 4)
  T([[0.18, 0.15, 3.85], [-0.45, 0.34, 2.7]], [0.07, 0.03], [0.025, 0.015], 4)
  // Left arm down, the hand on the scabbard at his left hip.
  T([[-0.46, 0, 2.72], [-0.64, 0.08, 2.3], [-0.5, 0.2, 1.98]], [0.12, 0.11, 0.09])
  T([[-0.5, 0.22, 2.1], [-0.62, 0.05, 1.1]], [0.065, 0.05], undefined, 5)
  // The cloak: from both shoulders, flowing down behind him and billowing
  // out to his left, in two folds.
  plate([0.42, -0.24, 2.75], unit([-1, -0.12, 0]), unit([-0.15, -0.35, -1]),
    [[0, 0], [0.85, 0], [1.0, 0.8], [0.95, 1.6], [0.7, 2.2], [0.3, 2.45], [0.05, 1.5]], 0.05, -0.25)
  plate([-0.3, -0.3, 2.3], unit([-0.85, -0.5, 0]), unit([-0.2, -0.2, -1]),
    [[0, 0], [0.55, 0.05], [0.75, 0.7], [0.6, 1.45], [0.25, 1.75], [0.0, 1.0]], 0.05, 0.3)
  // The wings: spread out sideways and back from the shoulder blades, each
  // about 1.3 times his torso and head; his right wing's tip a little
  // over the shoulders, his left sweeping down behind the scabbard. Three
  // layers (coverts, secondaries, primaries), their trailing edges rounded
  // lobes of long feathers, curved back along the span.
  for (const s of [-1, 1]) {
    const root: V3 = [s * 0.22, -0.28, 2.6]
    const tip: V3 = s > 0 ? [1.62, -0.5, 3.1] : [-1.52, -0.5, 1.95]
    const e1 = unit([tip[0] - root[0], tip[1] - root[1], tip[2] - root[2]])
    // Across the wing, towards its trailing edge: down and back.
    const across: V3 = [0, -0.3, -1]
    const dd = e1[0] * across[0] + e1[1] * across[1] + e1[2] * across[2]
    const e2 = unit([across[0] - e1[0] * dd, across[1] - e1[1] * dd, across[2] - e1[2] * dd])
    const L = Math.hypot(tip[0] - root[0], tip[1] - root[1], tip[2] - root[2])
    const n: V3 = unit([e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]])
    /** A trailing edge of k rounded feather tips from u1 back to u0, reaching v (longer towards the tip). */
    const lobes = (u0: number, u1: number, v0: number, v1: number, k: number): XY[] => {
      const pts: XY[] = []
      for (let i = 0; i < k; i++) {
        const ua = u1 - ((u1 - u0) * i) / k, ub = u1 - ((u1 - u0) * (i + 1)) / k
        const v = v1 + ((v0 - v1) * (i + 0.5)) / k, r = (ua - ub) / 2
        for (let j = i === 0 ? 0 : 1; j <= 3; j++) {
          const t = (Math.PI * j) / 3
          pts.push([ua - r + r * Math.cos(t), v + r * 0.9 * Math.sin(t)])
        }
      }
      return pts
    }
    // Primaries, the longest, reaching out past the tip.
    plate(root, e1, e2, [[0.1 * L, -0.12], [0.6 * L, -0.18], [1.08 * L, 0.05], ...lobes(0.3 * L, 1.06 * L, 0.55, 0.95, 4)], 0.06, -0.12)
    // Secondaries along the inner wing, a little in front.
    plate(plus(root, scale(n, 0.09)), e1, e2, [[0, -0.1], [0.7 * L, -0.08], ...lobes(0, 0.72 * L, 0.5, 0.75, 3)], 0.06, -0.12)
    // Coverts along the leading edge.
    plate(plus(root, scale(n, 0.18)), e1, e2, [[0, -0.12], [0.85 * L, -0.06], ...lobes(0, 0.85 * L, 0.28, 0.32, 3)], 0.06, -0.12)
  }
}

// ---------------------------------------------------------------- walls and bastions

{
  // Split the ring between the outline and the inner square into four
  // simple pieces, cut along the diagonals through the bastions' tips.
  const dirs: XY[] = [[1, -1], [1, 1], [-1, 1], [-1, -1]] // SE, NE, NW, SW
  const inner: XY[] = [[INNER.x1, INNER.y0], [INNER.x1, INNER.y1], [INNER.x0, INNER.y1], [INNER.x0, INNER.y0]]
  const cut = dirs.map(([dx, dy]) => {
    let best = 0, bv = -Infinity
    OUTLINE.forEach(([x, y], i) => { const v = x * dx + (y + 4.2) * dy; if (v > bv) { bv = v; best = i } })
    return best
  })
  const n = OUTLINE.length
  for (let k = 0; k < 4; k++) {
    const a = cut[k], b = cut[(k + 1) % 4]
    const chain: XY[] = []
    for (let i = a; ; i = (i + 1) % n) { chain.push(OUTLINE[i]); if (i === b) break }
    block(ochre, [...chain, inner[(k + 1) % 4], inner[k]], 0, WALL)
  }
  // The round bastion on the south-east corner, and the small round tower
  // rising from its middle (relations 3533074, 3533082, 3533083).
  block(ochre, ROUND_TOWER.slice(0, 37), 0, WALL)
  lathe(ochre, 44.5, -48.1, [[5.0, WALL - 0.5], [5.0, 16.6], [5.6, 16.9], [5.6, 17.6], [0.01, 17.6]], 16)
  // Merlons along the outline's outer edge (about an eighth of the real number,
  // to leave the budget to the drum, apartments and angel), and
  // round the tower.
  const along = (pts: XY[], z: number, step: number, skip?: (p: XY) => boolean) => {
    let carry = step / 2
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], q = pts[(i + 1) % pts.length]
      const L = Math.hypot(q[0] - p[0], q[1] - p[1])
      if (L < 1e-6) continue
      const u: XY = [(q[0] - p[0]) / L, (q[1] - p[1]) / L], inw: XY = [-u[1], u[0]]
      let t = carry
      while (t < L) {
        const c: XY = [p[0] + u[0] * t + inw[0] * 0.45, p[1] + u[1] * t + inw[1] * 0.45]
        if (!skip || !skip(c)) merlon(ochre, c, u, 1.2, 0.8, z, z + MERLON)
        t += step
      }
      carry = t - L
    }
  }
  along(OUTLINE, WALL, 11)
  for (let k = 0; k < 10; k++) { const a = (k / 10) * TAU; merlon(ochre, [44.5 + 5.15 * Math.cos(a), -48.1 + 5.15 * Math.sin(a)], [-Math.sin(a), Math.cos(a)], 1.2, 0.7, 17.6, 19.2) }
  // The gate in the south wall (263043347): a dark arched doorway.
  const gate: XY[] = [[-1.6, 0], [1.6, 0], [1.6, 3.6]]
  for (let k = 0; k <= 6; k++) gate.push([1.6 * Math.cos((Math.PI * k) / 6), 3.6 + 1.6 * Math.sin((Math.PI * k) / 6)])
  gate.push([-1.6, 3.6])
  face(win, gate.map(([u, v]) => [u + 1.3, v] as XY), (u, v) => [u, -48.43 - 0.04, v], [0, -1, 0])
}

// Courtyard buildings, flat-topped in the tile colour.
for (const [ring, h] of COURT) {
  extrude(ochre, ring, 0, h, undefined, { caps: [false, false] })
  face(brick, ring, (u, v) => [u, v, h], [0, 0, 1])
}

// ---------------------------------------------------------------- write

const up = (n: V3) => (n[2] > 0.7 ? 0.4 : 1)
const lit = (k: number) => (_p: V3, n: V3) => k * up(n)
console.log({ peperino: peperino.triangles, ochre: ochre.triangles, brick: brick.triangles, trav: trav.triangles, bronze: bronze.triangles, win: win.triangles })
await save('rome-castel-sant-angelo', "Castel Sant'Angelo", [
  // Colours from photos 1-3 and 5, pulled to the palette's lightness: the
  // weathered grey-brown peperino of the lower drum, the warm ochre of the
  // upper drum and the walls, the reddish brick and tiles of the
  // apartments, pale travertine, the green-grey bronze of the angel.
  { part: peperino, material: { ...finish('peperino', 0xb3a28a), floodlight: lit(0.9) } },
  { part: ochre, material: { ...finish('castle-ochre', 0xd4b68a), floodlight: lit(1) } },
  { part: brick, material: { ...finish('castle-brick', 0xc6a27c), floodlight: lit(0.8) } },
  { part: trav, material: { ...finish('travertine', 0xeee5d4), floodlight: lit(1) } },
  { part: bronze, material: { ...finish('angel-bronze', 0x3e5a57, 0.6), floodlight: lit(1) } },
  { part: win, material: PALETTE.window },
], { bearing: 357.3, osm: 'way/8035487' }, 6500)
