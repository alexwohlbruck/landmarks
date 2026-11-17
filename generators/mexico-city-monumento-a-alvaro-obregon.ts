/**
 * Monumento a Álvaro Obregón (1934-35, architect Enrique Aragón
 * Echegaray, sculptor Ignacio Asúnsolo), Parque de la Bombilla, San Ángel,
 * Mexico City: procedural, CC0-1.0.
 * bun generators/mexico-city-monumento-a-alvaro-obregon.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 107.4: the
 * monument's platform (OSM way/1279110115, historic=monument) has its sides
 * at 107.4 and 17.4 degrees, and the front faces 287.4 (west-north-west,
 * down the reflecting pool, OSM way/456292723). In this frame the front
 * faces -y (south). Origin: the area centroid of way/1279110115.
 *
 * Form, from the photos: a tall, plain, slightly tapering square pylon of
 * pale cantera with a vertical strip of blue-green glass mosaic running up
 * the middle of each face, standing on a broad masonry base block. At the
 * front, steps rise between low cheek walls to a dark doorway (lettered
 * OBREGON above), flanked by two colossal standing figures (Asúnsolo's
 * peasant and worker); on the sides of the base, against the corners,
 * large sculpted groups ("Alegoría del Sacrificio" and others) stand on
 * low podiums. The whole sits on a square platform with steps round it.
 * Austere Art Deco, symmetrical about its axis.
 *
 * Sources
 * - OSM (ODbL): node/317911271 (historic=monument, its wikidata Q6062723
 *   is the park; no item of its own was found); way/1279110115, the
 *   platform, 29.7 m wide x 31.8 m deep (measured); the pool
 *   way/456292723 on the front axis. No building is mapped, so the model
 *   replaces nothing.
 * - Published: architect, sculptor, dates; a hollow tower with an inner
 *   stair (chilango.com, "Historia del Parque La Bombilla";
 *   escapadas.mexicodesconocido.com.mx). No height published.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 Thelmadatter, "MonumentAlvaroObrgonDF.JPG", public domain (square on
 *     from across the pool: proportions; people on the platform for scale);
 *     https://commons.wikimedia.org/wiki/File:MonumentAlvaroObrgonDF.JPG
 *   2 Natalia.castilloo, "Monumento a Alvaro Obregon.jpg", CC BY-SA 4.0
 *     (the same axis from further back);
 *     https://commons.wikimedia.org/wiki/File:Monumento_a_Alvaro_Obregon.jpg
 *   3 Gobierno CDMX, "002304-001 MONUMENTO ÁLVARO OBREGÓN
 *     (32251569108).jpg", CC0 (the front at its opening: stairs, statues,
 *     side groups, the strip window);
 *     https://commons.wikimedia.org/wiki/File:002304-001_MONUMENTO_%C3%81LVARO_OBREG%C3%93N_(32251569108).jpg
 *   4 Matrodgian, "Esquina Norte del Monumento a Álvaro Obregón 2.jpg",
 *     CC BY-SA 4.0, and Ehécatl Cabrera, "Costado del Monumento a Álvaro
 *     Obregón.jpg", CC BY-SA 4.0 (corner and side: the platform's sloped
 *     edge, the side stair, the corner groups, the side strip window);
 *     https://commons.wikimedia.org/wiki/File:Esquina_Norte_del_Monumento_a_%C3%81lvaro_Obreg%C3%B3n_2.jpg
 *     https://commons.wikimedia.org/wiki/File:Costado_del_Monumento_a_%C3%81lvaro_Obreg%C3%B3n.jpg
 *   5 ProtoplasmaKid, "Monumento a Obregón - 2026 - 04.jpg", CC BY 4.0
 *     (the statues and the glass mosaic strip close up); Leana.mg,
 *     "Costado derecho del monumento a Álvaro Obregón.jpg", CC BY-SA 4.0.
 *     https://commons.wikimedia.org/wiki/File:Monumento_a_Obreg%C3%B3n_-_2026_-_04.jpg
 *     https://commons.wikimedia.org/wiki/File:Costado_derecho_del_monumento_a_%C3%81lvaro_Obreg%C3%B3n.jpg
 * - Numbers (estimated from photo 1, scaled on people ~1.7 m and on OSM's
 *   platform width): pylon 10 m square tapering to 9.4, from the base top
 *   at 10 m to 26 m; base block 15.8 x 14 m (with the corner groups); statues ~6.3 m on 2 m
 *   pedestals; door sill 4 m; platform steps 0.9 m, plinth to 2.2 m.
 * - Doubts: the rear face is not photographed (drawn like the front less
 *   the door and statues); the pylon's depth is taken equal to its width
 *   (photo 4 shows similar faces); the sculpture groups are blocks with
 *   sloped tops, not figures; the lettering is left out.
 * - Terrain: Mapterhorn has no z15 terrain here (tools/terrain.ts 404s);
 *   San Ángel lies on the gentle edge of the Pedregal; the platform is
 *   level. Elevation 0.
 * - Look-only: none.
 * - Night: the pylon is floodlit; the glass strips and the door glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { slab, lathe, panel, save, orient, type XY } from './dc-nmaahc'

const pale = new Part(), base = new Part(), carved = new Part(), win = new Part(), strip = new Part()
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const sq = (w: number, d: number, cy = 0): XY[] => rect(-w / 2, w / 2, cy - d / 2, cy + d / 2)

// --- Platform: two steps round it, then a plinth with sloped edges --------
const PW = 29.7, PD = 31.8
slab(base, sq(PW, PD), 0, 0.45, 0.1)
slab(base, sq(PW - 1.2, PD - 1.2), 0.45, 0.9, 0.1)
slab(base, sq(PW - 5.0, PD - 5.0), 0.9, 2.2, 1.2) // a broad chamfer reads as the sloped edge

// --- The base block and the front stair --------------------------------------
const BW = 15.8, BD = 14.0, BTOP = 10.0, SILL = 4.0
slab(base, sq(BW, BD), 2.2, BTOP, 0.35)
// the front: a recessed centre bay with the door, and the stair up to it
const FY = -BD / 2
slab(pale, rect(-4.4, 4.4, FY - 0.6, FY + 0.5), 2.2, BTOP, 0.2) // pale frontispiece
// stair: a sloped block from the plinth to the sill, between cheek walls
{
  const y0 = FY - 6.0, y1 = FY - 0.6, w = 1.5
  // the stair's sloped top, drawn as a wedge
  const P = (x: number, y: number, z: number): V3 => [x, y, z]
  orient(pale, [P(-w, y0, 2.2), P(w, y0, 2.2), P(w, y1, SILL), P(-w, y1, SILL)], [0, -1, 2])
  orient(pale, [P(w, y0, 2.2), P(w, y1, 2.2), P(w, y1, SILL)], [1, 0, 0])
  orient(pale, [P(-w, y0, 2.2), P(-w, y1, SILL), P(-w, y1, 2.2)], [-1, 0, 0])
  for (const s of [-1, 1]) slab(pale, rect(s * w - (s > 0 ? 0 : 1.0), s * w + (s > 0 ? 1.0 : 0), y0 + 1.5, y1), 2.2, SILL + 0.9, 0.2)
}
// the doorway, and the lettering band above it as a pale bar
panel(win, [-1.1, FY - 0.6], [1.1, FY - 0.6], 0, 1, SILL, SILL + 3.6, 0.05)
slab(pale, rect(-3.4, 3.4, FY - 0.75, FY - 0.6), SILL + 4.6, SILL + 5.2, 0)

// --- Colossal standing figures flanking the door ---------------------------
for (const s of [-1, 1]) {
  const cx = s * 3.2, cy = FY - 1.4
  slab(base, rect(cx - 1.2, cx + 1.2, cy - 1.0, cy + 1.0), 2.2, SILL + 0.4, 0.2)
  // body: a tall tapered block, robe falling to the feet
  const z0 = SILL + 0.4, z1 = z0 + 5.3
  const bot = rect(cx - 1.0, cx + 1.0, cy - 0.8, cy + 0.8), top = rect(cx - 0.8, cx + 0.8, cy - 0.6, cy + 0.6)
  carved.loft([bot.map(([x, y]) => [x, y, z0] as V3), top.map(([x, y]) => [x, y, z1] as V3)])
  carved.cap(top.map(([x, y]) => [x, y, z1] as V3), true)
  // the arms and the object held at the chest
  slab(carved, rect(cx - 0.55, cx + 0.55, cy - 1.15, cy - 0.6), z0 + 3.3, z0 + 4.4, 0.15)
  // head
  lathe(carved, cx, cy, [[0.32, z1], [0.5, z1 + 0.35], [0.52, z1 + 0.75], [0.35, z1 + 1.05], [0.01, z1 + 1.15]], 8, false)
}

// --- Sculpted groups at the four corners of the base, on podiums ----------
// Each stands in front of a face at the corner, its top rising toward the
// base block (photos 3, 4: the groups beyond the statues, at the corners).
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const xa = sx > 0 ? 5.0 : -7.9, xb = sx > 0 ? 7.9 : -5.0
  const yIn = sy * (BD / 2), yOut = sy * (BD / 2 + 3.0)
  const ya = Math.min(yIn, yOut), yb = Math.max(yIn, yOut)
  slab(base, rect(xa, xb, ya, yb), 2.2, 4.4, 0.2)
  const lo = 4.4, hiOut = 7.2, hiIn = 9.6
  const zAt = (y: number) => (Math.abs(y - yIn) < 1e-6 ? hiIn : hiOut)
  const g: XY[] = [[xa + 0.2, ya + (sy < 0 ? 0.3 : 0)], [xb - 0.2, ya + (sy < 0 ? 0.3 : 0)], [xb - 0.2, yb - (sy > 0 ? 0.3 : 0)], [xa + 0.2, yb - (sy > 0 ? 0.3 : 0)]]
  const ringLo = g.map(([x, y]) => [x, y, lo] as V3)
  const ringHi = g.map(([x, y]) => [x, y, zAt(Math.abs(y - yIn) < 0.31 ? yIn : y)] as V3)
  carved.loft([ringLo, ringHi])
  carved.quad(ringHi[0], ringHi[1], ringHi[2], ringHi[3])
  // a figure's head rising from the group's outer edge
  lathe(carved, (xa + xb) / 2, yOut - sy * 0.9, [[0.55, hiOut + 0.3], [0.65, hiOut + 1.0], [0.42, hiOut + 1.6], [0.01, hiOut + 1.8]], 8, false)
}

// --- The pylon ------------------------------------------------------------
const TW0 = 10.0, TW1 = 9.4, TTOP = 26.0
{
  const r0 = sq(TW0, TW0).map(([x, y]) => [x, y, BTOP] as V3)
  const r1 = sq(TW1 - 0.2, TW1 - 0.2).map(([x, y]) => [x, y, TTOP] as V3)
  // the taper, a slight chamfer at the top edge
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  const rT = sq(TW1, TW1).map(([x, y]) => [x, y, TTOP - 0.25] as V3)
  pale.loft([r0, rT, r1])
  pale.cap(r1, true)
  // glass mosaic strips up the middle of each face (front, back, sides)
  const z0 = BTOP + 1.2, z1 = TTOP - 2.2
  const half = (z: number) => lerp(TW0, TW1, (z - BTOP) / (TTOP - 0.25 - BTOP)) / 2 + 0.05
  const w = 0.85
  const faces: [XY, XY][] = [[[1, 0], [0, -1]], [[-1, 0], [0, 1]], [[0, 1], [1, 0]], [[0, -1], [-1, 0]]] // [along, normal]
  for (const [[ax, ay], [nx, ny]] of faces) {
    const P = (s: number, z: number): V3 => [ax * s + nx * half(z), ay * s + ny * half(z), z]
    strip.quad(P(-w, z0), P(w, z0), P(w, z1), P(-w, z1))
  }
}

const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : p[2] > BTOP ? 0.9 : 0.6)
await save('mexico-city-monumento-a-alvaro-obregon', 'Monumento a Álvaro Obregón', [
  { part: pale, material: { ...finish('obregon-cantera', 0xe6dbc6), floodlight: lit } as any },
  { part: base, material: { ...finish('obregon-base-stone', 0xc2bbae), floodlight: lit } as any },
  { part: carved, material: { ...finish('obregon-sculpture', 0xa69c8e), floodlight: lit } as any },
  { part: win, material: PALETTE.window },
  { part: strip, material: windowVariant(2, 0x6f9197) },
], { name: 'Monumento a Álvaro Obregón' }, 5000)
