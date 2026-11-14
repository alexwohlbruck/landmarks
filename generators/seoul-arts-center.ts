/**
 * Seoul Arts Center Opera House (예술의전당 오페라하우스), Seocho, Seoul:
 * procedural, CC0-1.0.
 * bun generators/seoul-arts-center.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (round building).
 * The origin is the area centroid of the OSM outline (relation/8439129,
 * outer way/303946382: a 20-sided circle 101 m across, taken as the brim
 * of the roof). y = 0 is the lowest ground under it; the building stands
 * on the complex's terraces, so its base wall runs down to y = 0.
 * Elevation 0. Terrain not checked (no z15 tiles over Seoul).
 *
 * Opened 1993 (architect Kim Seok-chul); the roof is shaped after a gat,
 * the Korean scholar's horsehair hat: a low round crown on a wide, shallow
 * brim.
 *
 * From photos (scaled to the outline's 101 m brim; the front photo is
 * nearly level from the street to the south, "Seoul Arts Center 20"):
 * - the brim: a flat, thin dark-grey metal cone, from its 0.6 m lip at
 *   r 50.5 (21.6 m) rising only 4 m to the crown; it overhangs the walls
 *   by about 2.5 m (in the front photo the walls below are nearly as wide
 *   as the brim); 24 standing seams;
 * - under the brim a glazed clerestory band behind a ring of columns,
 *   r 46.8, from 14.6 to 20.9 m;
 * - a pale granite drum below, r 48, with a few openings;
 * - the crown: a dark flat-topped cylinder 12.8 m across and 7.5 m high
 *   (25.5 to 33 m), about 0.6 of its width, as in the photo.
 * Estimated: every height (from the front photo's proportions, 0.17 m/px),
 *   the column count (32), the drum's openings.
 * Left out: the white arched entrance pavilion and signs at the street
 *   (not in the outline), the terraces and stairs, the attached halls.
 *
 * Night: the glazed band is `window`; the brim's underside is unlit.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "Seoul Arts Center 20.JPG", Piotrus, CC BY-SA 3.0 (front, from the street to the south)
 *   https://commons.wikimedia.org/wiki/File:Seoul_Arts_Center_20.JPG
 * - "Korea-Seoul.Arts.Center-02.jpg", Kai Hendry, CC BY 2.0 (the brim's edge)
 *   https://commons.wikimedia.org/wiki/File:Korea-Seoul.Arts.Center-02.jpg
 * - "Seoul Arts Center 10.JPG", Piotrus, CC BY-SA 3.0 (plaza)
 *   https://commons.wikimedia.org/wiki/File:Seoul_Arts_Center_10.JPG
 * - "Seoul Arts Center 12.JPG", Piotrus, CC BY-SA 3.0 (plaza)
 *   https://commons.wikimedia.org/wiki/File:Seoul_Arts_Center_12.JPG
 * No look-only references used.
 * Doubts: no photo from the north or from above; the stage house behind
 * the auditorium is not seen in any licensed photo and is left inside the
 * crown and brim; the crown's size is read from one photo.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { flat, lathe, tube } from './seoul-n-seoul-tower'

function build() {
  const stone = new Part(), win = new Part(), cols = new Part(), brim = new Part(), crown = new Part(), under = new Part()
  const C: [number, number] = [0, 0]
  const K = 40
  // ---- Granite drum, glazed band and its columns.
  lathe(C, [[48, 0], [48, 14.2], [47.4, 14.6], [46.8, 14.6]], () => stone, K)
  lathe(C, [[46.8, 14.6], [46.8, 20.8]], () => win, K)
  for (let i = 0; i < 32; i++) {
    const a = ((i + 0.5) / 32) * Math.PI * 2
    lathe([47.5 * Math.cos(a), 47.5 * Math.sin(a)], [[0.65, 14.6], [0.65, 20.9], [0, 20.9]], (b) => (b === 0 ? cols : null), 6)
  }
  // drum openings: an entrance at each quarter (only the south one is photographed)
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 - Math.PI / 2, r = 48.06, w = 0.08
    const p0: V3 = [r * Math.cos(a - w), r * Math.sin(a - w), 2], p1: V3 = [r * Math.cos(a + w), r * Math.sin(a + w), 2]
    flat(win, [p0, p1, [p1[0], p1[1], 11], [p0[0], p0[1], 11]], [Math.cos(a), Math.sin(a), 0])
  }
  // ---- The brim: a shallow cone with a thick, slightly upturned lip.
  // (lathe profiles run with the outside on their left: roofs inward,
  // walls upward, undersides outward)
  lathe(C, [[50.5, 21.6], [49.6, 21.75], [40, 22.6], [25, 23.9], [7.4, 25.5]], () => brim, 48, 30)
  lathe(C, [[50.0, 21.0], [50.6, 21.1], [50.8, 21.35], [50.5, 21.6]], () => brim, 48, 50)
  lathe(C, [[46.8, 20.9], [50.0, 21.0]], () => under, 48, 30)
  // Standing seams on the brim: 24 low radial ribs, the metal roof's lines.
  const brimZ = (r: number) => (r >= 40 ? 22.6 - ((r - 40) / 10.5) * 1.0 : r >= 25 ? 23.9 - ((r - 25) / 15) * 1.3 : 25.5 - ((r - 7.4) / 17.6) * 1.6)
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2
    const pts: V3[] = [7.8, 25, 40, 50.2].map((r) => [r * Math.cos(a), r * Math.sin(a), brimZ(r) + 0.18] as V3)
    tube(brim, pts, 0.45)
  }
  // ---- The crown: a squat cylinder with a rounded top.
  lathe(C, [[7.4, 25.5], [6.4, 25.6], [6.4, 32.5], [6.0, 33.0], [0, 33.0]], () => crown, 48, 35)

  const parts = [
    { part: stone, material: { ...finish('sac-granite', 0xddd7cc), floodlight: (_p: V3, n: V3) => (n[2] > 0.6 ? 0 : 0.6) } },
    { part: win, material: PALETTE.window },
    { part: cols, material: PALETTE.trim },
    { part: brim, material: finish('gat-metal', 0x7f8892) },
    { part: crown, material: finish('gat-crown', 0x5f666e) },
    { part: under, material: PALETTE.roof },
  ]
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Seoul Arts Center Opera House', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 0, elevation: 0, height: 33,
  })
  if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
  const out = new URL('../models/seoul-arts-center.glb', import.meta.url).pathname
  Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

if (import.meta.main) build()
