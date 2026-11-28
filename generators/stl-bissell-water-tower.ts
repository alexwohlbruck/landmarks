/**
 * Bissell Street Water Tower ("Red"), College Hill, St. Louis (1886,
 * William S. Eames; a standpipe cased in red brick, the tallest of the
 * city's three water towers) — procedural, CC0-1.0, no textures.
 * bun generators/stl-bissell-water-tower.ts
 *
 * Map frame: x and y along the tower's square, turned 66° (bearing 66, the
 * sides of OSM way/238580357), z up, metres. Anchor -90.2056675,
 * 38.6704190: the square's centre.
 *
 * The tower (photos): a stepped granite plinth, rock-faced, with a carved
 * frieze and cornice; a battered stage of granite and brick with corner
 * piers, small arched windows and cornices; a tall square shaft of red brick
 * with white stone stepped bands climbing it in four tiers; a stone-framed
 * band with brick panels; a corbelled gallery; an arcaded lantern stage;
 * and a tall octagonal spire in green copper with a finial.
 *
 * Measured (USGS lidar USGS_LPC_MO_StLouis_2017_LAS_2018, flown 2017–18,
 * 0.5 m grid, read in this frame, above the ground at the plinth): the
 * plinth's top about 6 at ±3.8; the battered stage 10–11 at ±3.3; the
 * gallery 46–47 at ±3.0–3.3; the lantern's cornice 51 at ±2.5; the spire
 * 58 near its tip (centre within 0.3 m of the square's).
 * Published: 196 ft / 59.7 m (Wikipedia); OSM height 62.7, taken to the
 * finial's tip.
 * Estimated from the photos (scaled from the lidar's plinth and lantern):
 * the plinth's steps (2.3, 4.8, 6.3), the battered stage's cornices (10.0,
 * 11.0), the shaft (5.4 m square; the OSM square is 5.9), the four stepped
 * bands (19, 25, 31.5, 38), the stone band (41.5–45), the gallery
 * (45.5–46.8), the lantern's arches, the spire's base (51.3) and tip (61).
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *   - "STL Bissell and Blair Water Tower 01.JPG", Onegentlemanofverona,
 *     CC BY 3.0, https://commons.wikimedia.org/wiki/File:STL_Bissell_and_Blair_Water_Tower_01.JPG
 *     (the whole tower straight on);
 *   - "Bissell Street Water Tower, Bissell Street and Blair Avenue, College
 *     Hill, St. Louis, MO - 53134676493.jpg", w_lemay, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:Bissell_Street_Water_Tower,_Bissell_Street_and_Blair_Avenue,_College_Hill,_St._Louis,_MO_-_53134676493.jpg
 *     (the plinth and battered stage close up);
 *   - the same series, 53133600457 and 53134606860 (w_lemay, CC BY-SA 2.0).
 *
 * Night: the brick and stone are floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, ccw, cornice, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'
import { quad } from './dc-nationals-park'

const brick = new Part(), stone = new Part(), granite = new Part(), copper = new Part(), win = new Part()
const SQ = (h: number): XY[] => ccw([[-h, -h], [h, -h], [h, h], [-h, h]])
/** The four faces of a square of half-size h, each as [a, b] with its outside to the right of a→b. */
const faces = (h: number): [XY, XY][] => [[[-h, -h], [h, -h]], [[h, -h], [h, h]], [[h, h], [-h, h]], [[-h, h], [-h, -h]]]

// ── The plinth: three granite steps, rock-faced courses, a frieze and cornice
box(granite, -4.2, 4.2, -4.2, 4.2, 0, 1.6, null, 0.2)
box(granite, -4.0, 4.0, -4.0, 4.0, 1.6, 2.3, granite, 0.35) // the chamfered step
box(granite, -3.85, 3.85, -3.85, 3.85, 2.3, 4.8, null, 0.3)
for (const z of [2.95, 3.6, 4.25]) cornice(granite, SQ(3.85), z, 0.15, 0.1, null) // the rock-faced courses' joints, as bands
box(stone, -3.75, 3.75, -3.75, 3.75, 4.8, 5.7, null, 0.1) // the carved frieze
cornice(stone, SQ(3.75), 5.7, 0.6, 0.3, stone)

// ── The battered stage: tapering ±3.5 → ±3.0, corner piers, arched windows
{
  const z0 = 6.3, z1 = 10.0, h0 = 3.5, h1 = 3.0
  for (let i = 0; i < 4; i++) {
    const a0 = (i * Math.PI) / 2, a1 = ((i + 1) * Math.PI) / 2
    const c = (a: number, h: number): [number, number] => [Math.round(Math.cos(a + Math.PI / 4) * Math.SQRT2) * h, Math.round(Math.sin(a + Math.PI / 4) * Math.SQRT2) * h]
    const A0 = c(a0, h0), B0 = c(a1, h0), A1 = c(a0, h1), B1 = c(a1, h1)
    quad(granite, [[A0[0], A0[1], z0], [B0[0], B0[1], z0], [B1[0], B1[1], z1], [A1[0], A1[1], z1]], [(A0[0] + B0[0]) / 2, (A0[1] + B0[1]) / 2, 1])
  }
  // brick panels on the battered faces between the corner piers
  for (const [a, b] of faces(3.27)) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    onWall(brick, a, b, rectShape(1.4, L - 1.4, 6.6, 9.4), 0.12)
  }
  box(stone, -3.15, 3.15, -3.15, 3.15, z1, 10.4, null, 0.1)
  cornice(stone, SQ(3.15), 10.4, 0.6, 0.35, stone) // the dentil cornice
  box(brick, -2.95, 2.95, -2.95, 2.95, 11.0, 12.6, null, 0)
  for (const [a, b] of faces(2.95)) onWall(win, a, b, archShape(2.95, 1.0, 11.2, 12.3, 8), 0.06) // the small arched windows
  cornice(stone, SQ(2.95), 12.6, 0.5, 0.25, null)
}

// ── The shaft ───────────────────────────────────────────────────────────────
const HS = 2.7
box(brick, -HS, HS, -HS, HS, 12.6, 41.5, null, 0)
// the white stone stepped bands, four tiers: on each face a run of three
// blocks climbing diagonally, as in the photos
for (const z of [19, 25.2, 31.5, 37.8]) {
  for (const [a, b] of faces(HS)) {
    const L = 2 * HS
    // a stepped fret at the middle of the face: three blocks climbing
    for (let k = 0; k < 3; k++) {
      const s = L / 2 - 1.35 + k * 0.9, zz = z + k * 0.6
      onWall(stone, a, b, rectShape(s, s + 0.9, zz, zz + 0.5), 0.08)
    }
  }
}
// slit windows up the shaft
for (const [a, b] of faces(HS)) for (const z of [15.5, 22, 28.4, 34.7]) onWall(win, a, b, rectShape(HS - 0.25, HS + 0.25, z, z + 1.6), 0.06)

// ── The stone band, the gallery, the lantern, the spire ─────────────────────
box(stone, -HS - 0.1, HS + 0.1, -HS - 0.1, HS + 0.1, 41.5, 45.2, null, 0.05)
for (const [a, b] of faces(HS + 0.1)) { // two brick panels in each face of the band
  onWall(brick, a, b, rectShape(0.6, HS - 0.25, 42.2, 44.5), 0.05)
  onWall(brick, a, b, rectShape(HS + 0.45, 2 * HS - 0.4, 42.2, 44.5), 0.05)
}
cornice(stone, SQ(HS + 0.1), 45.2, 1.0, 0.5, stone) // the corbelled gallery
box(brick, -2.5, 2.5, -2.5, 2.5, 46.2, 50.6, null, 0)
for (const [a, b] of faces(2.5)) { // the lantern's arcade, two arches a face
  onWall(win, a, b, archShape(1.45, 1.3, 46.9, 49.0, 8), 0.06)
  onWall(win, a, b, archShape(3.55, 1.3, 46.9, 49.0, 8), 0.06)
}
cornice(stone, SQ(2.5), 50.6, 0.7, 0.35, stone)
// the octagonal spire, with a slight bell-cast at its foot, and the finial
revolve(copper, [0, 0], [[2.7, 51.3], [2.45, 51.8], [2.05, 53.0], [1.05, 57.0], [0.28, 60.6], [0.01, 61.0]], 8, Math.PI / 8)
revolve(copper, [0, 0], [[0.12, 60.8], [0.12, 62.2], [0.25, 62.3], [0.01, 62.7]], 6)

const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.1 : p[2] < 51 ? 0.7 : 0.3)
await save('stl-bissell-water-tower', 'Bissell Street Water Tower', [
  { part: brick, material: { ...finish('bissell-red-brick', 0xb86e5a), floodlight: lit } },
  { part: stone, material: { ...finish('bissell-stone', 0xe8dfce), floodlight: lit } },
  { part: granite, material: { ...finish('bissell-granite', 0xb99486), floodlight: lit } },
  { part: copper, material: PALETTE.patina },
  { part: win, material: PALETTE.window },
], { height: 62.7, anchor: [38.670419, -90.2056675], bearing: 66, osm: 'way/238580357' }, 5000)
