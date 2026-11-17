/**
 * Citizens Savings Bank (now HSBC), 58 Bowery at Canal Street — procedural,
 * CC0-1.0, no textures.
 * bun generators/nyc-citizens-savings-bank.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built straight from
 * the OSM coordinates. Anchor: the HSBC outline way/250266994's node centre
 * (-73.9965510, 40.7161162), which is close to the dome's centre.
 *
 * What it is: Clarence W. Brazer's domed savings bank of 1924, on the
 * south-west corner of Bowery and Canal Street at the Manhattan foot of the
 * Manhattan Bridge, whose arch and colonnade stand across Bowery to the
 * east. A near-square granite block: a rusticated base, then on each street
 * face one giant round-arched window with a bronze grille over a short
 * balustrade, between paired pilasters; a deep modillioned cornice; a
 * set-back attic with small square windows; and on the attic a low gilded
 * bronze dome on a short octagonal curb. Over the Bowery face the attic
 * carries a sculpture group round a clock, between two beehive finials.
 * A one-storey annex fills the rest of the lot to the west along Canal.
 *
 * Covers and replaces: the outline way/250266994 (block and annex) and its
 * parts way/870504654 (main body, 25 m), way/870504655 (a sliver, 19–25 m),
 * way/870504656 (the dome, 25–33.6 m) and way/870504657 (the Bowery strip,
 * 21 m). The parts are rough (the main body part stops 4 m short of Canal
 * Street at its west end), so the block is drawn from the outline's corners,
 * which lidar confirms to within a metre.
 *
 * Evidence
 * - OSM (measured): the outline: Bowery face 22.1 m, Canal face 25.3 m,
 *   south face 23.7 m, west face 22.2 m, corners at 88–92°; the dome part a
 *   30-gon of radius 10.3 m centred (2.3, -0.7); height=33.6, dome 25–33.6.
 * - USGS lidar NY_NewYorkCity (2017), above the street: the cornice's outer
 *   ring 21–22 m; the attic 26–28 m; the dome's top 34 m; the annex 8–9 m;
 *   a chimney about 35 m near (-9, -8); open ground south of the block.
 * - Photos (Wikimedia Commons): "Citizen's Savings Bank.jpg" (Beyond My Ken,
 *   CC BY-SA 4.0) and "Citizen's Savings Bank (7707794444).jpg" (Eden,
 *   Janine and Jim, CC BY 2.0), both from the north-east across Canal: the
 *   Bowery face with the clock group, the Canal face, the arch, base and
 *   attic proportions. "Citizens Savings Canal St jeh.JPG" (Jim.henderson,
 *   public domain), from the north-west on Canal: the Canal and west faces,
 *   the annex with its arched front, the chimney, the lamp bulbs round the
 *   dome's base and up its ribs.
 * - From the photos, scaled to the lidar cornice: the base to the
 *   balustrade 7.3 m, the window sill 8.4 m, the arch 7 m wide with its
 *   crown at 17.6 m, the surround 1.5 m wide; the frieze 19.1–20.2 m; the
 *   cornice to 21.2 m, about 1.1 m proud; the attic set back 1.8 m, to
 *   26.3 m; the curb to 27.6 m; the dome a half-ellipse rising
 *   6.7 m, upright at its base.
 *
 * Estimated: the pilaster positions; the attic window rhythm (four a face);
 * the clock group's size (6.6 m wide, 5 m high); the annex height (8 m).
 *
 * Doubts: no licensed photo shows the south face; it is drawn like the
 * Canal face, as the lidar shows it standing free. The west face's arch is
 * only seen above the annex.
 *
 * Simplified: the sculpture group is a block with a bronze clock disc; the
 * grilles, modillions, lion statues, signs and lettering are left out; the
 * dome's ribs are not drawn, only its bulbs.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, rect } from './dc-white-house'
import { ccw, lathe, poffset, pslab, pwalls, saveModel, type XY } from './dc-nga-west'
import { edgeBox, edgeFrame, edgePanel } from './nyc-dime-savings-bank'
import { archPanel, discPanel } from './nyc-city-hall'

function build() {
  const stone = new Part(), shade = new Part(), roof = new Part(), win = new Part(), gold = new Part(), lamp = new Part()

  // The block, counter-clockwise from the south-east corner (OSM outline).
  const SE: XY = [8.74, -15.79], NE: XY = [18.71, 3.98], NW: XY = [-4.19, 14.66], SW: XY = [-12.82, -5.84]
  const B: XY[] = [SE, NE, NW, SW]
  const EAST = 0, NORTH = 1, WEST = 2, SOUTH = 3
  const edge = (i: number) => [B[i], B[(i + 1) % 4]] as [XY, XY]
  const C: XY = [2.4, -0.75] // dome centre

  // Heights above the street.
  const PLINTH = 0.9, BAL = 7.3, SILL = 8.4, CROWN = 17.6, FRIEZE0 = 19.1, FRIEZE1 = 20.2, CORNICE = 21.2
  const ATTIC = 26.3, COPING = 26.8, CURB = 27.6, TOP = 34.3, DOME_R = 10.3, ARCH_W = 7.0, SURROUND = 1.5

  // ---- Body: plinth, walls, base string course.
  pslab(stone, poffset(B, 0.15), 0, PLINTH, 0.1, false)
  pwalls(stone, B, PLINTH, FRIEZE1)
  pslab(stone, poffset(B, 0.3), BAL - 0.5, BAL, 0.12, false, true)

  for (let i = 0; i < 4; i++) {
    const [a, b] = edge(i)
    const f = edgeFrame(a, b), L = f.L, m = L / 2
    // corner piers and the pilaster pairs either side of the arch
    for (const s of [0.9, L - 0.9, m - 6.2, m + 6.2]) edgeBox(stone, a, b, s - 0.8, s + 0.8, 0, 0.3, BAL, FRIEZE0, 0.08, false)
    // the arch: a recessed surround in shade, the bronze-grilled window, the balustrade under it
    archPanel(shade, a, b, m, ARCH_W + 2 * SURROUND, BAL, CROWN + SURROUND, 0.04, 12)
    archPanel(win, a, b, m, ARCH_W, SILL, CROWN, 0.08, 12)
    edgeBox(stone, a, b, m - ARCH_W / 2 - 0.2, m + ARCH_W / 2 + 0.2, 0, 0.35, BAL, SILL, 0.08, true)
    // the frieze band and keystone under the cornice
    edgePanel(shade, a, b, 1.8, L - 1.8, FRIEZE0, FRIEZE1 - 0.3, 0.04)
    edgeBox(stone, a, b, m - 0.6, m + 0.6, 0, 0.35, CROWN, FRIEZE0 + 0.3, 0.05, true)
    // the base: a door in the middle, a small window either side
    if (i !== WEST) {
      edgePanel(win, a, b, m - 1.2, m + 1.2, PLINTH, 4.6, 0.06)
      for (const sg of [-1, 1]) edgePanel(win, a, b, m + sg * 5.2 - 0.7, m + sg * 5.2 + 0.7, 2.2, 4.6, 0.06)
    }
  }

  // ---- The cornice, overhanging, with its roof.
  pslab(stone, poffset(B, 0.5), FRIEZE1, FRIEZE1 + 0.6, 0.1, false, true)
  pslab(stone, poffset(B, 1.1), FRIEZE1 + 0.6, CORNICE, 0.3, roof, true)

  // ---- The attic, set back, with four small square windows a face.
  const At = poffset(B, -1.8)
  pslab(stone, At, CORNICE, ATTIC, 0, false)
  pslab(roof, poffset(At, 0.3), ATTIC, COPING, 0.2, roof)
  for (let i = 0; i < 4; i++) {
    const [a, b] = [At[i], At[(i + 1) % 4]]
    const L = edgeFrame(a, b).L
    for (let k = 0; k < 4; k++) {
      const s = L * (0.2 + 0.2 * k)
      if (i === EAST && (k === 1 || k === 2)) continue // behind the clock group
      edgePanel(win, a, b, s - 0.65, s + 0.65, 23.0, 24.4, 0.05)
    }
  }

  // ---- The clock group and the beehive finials on the Bowery face.
  {
    const [a, b] = edge(EAST)
    const f = edgeFrame(a, b), m = f.L / 2
    edgeBox(stone, a, b, m - 3.3, m + 3.3, -1.7, -0.2, CORNICE, CORNICE + 3.4, 0.5)
    edgeBox(stone, a, b, m - 1.8, m + 1.8, -1.7, -0.3, CORNICE + 3.4, CORNICE + 5.0, 0.5)
    discPanel(gold, f.xy(m, -0.2) as XY, f.xy(m + 1, -0.2) as XY, 0, CORNICE + 3.1, 1.15, 0.06)
    for (const sg of [-1, 1]) {
      const c = f.xy(m + sg * 6.6, -1.0)
      lathe(stone, c[0], c[1], [[0.95, CORNICE], [0.95, CORNICE + 0.5], [0.85, CORNICE + 1.2], [0.6, CORNICE + 1.9], [0.25, CORNICE + 2.3], [0, CORNICE + 2.4]], 10, false)
    }
  }

  // ---- The chimney at the south-west, rising from behind the attic.
  cbox(stone, rect(-9.5, -7.1, -6.2, -3.8), CORNICE, 34.5, { b: 0.2 })

  // ---- The curb: an octagon of stone with a bronze cap, then the gilded dome.
  const ang0 = Math.atan2(NE[1] - SE[1], NE[0] - SE[0]) // align the octagon with the block
  const oct = (r: number): XY[] => Array.from({ length: 8 }, (_, k) => [C[0] + r * Math.cos(ang0 + Math.PI / 8 + (k * Math.PI) / 4), C[1] + r * Math.sin(ang0 + Math.PI / 8 + (k * Math.PI) / 4)] as XY)
  pslab(stone, oct(11.6), COPING, CURB - 0.4, 0.15, false)
  pslab(roof, oct(11.9), CURB - 0.4, CURB, 0.15, roof)
  // a half-ellipse, upright at its base as the photos show
  const prof: [number, number][] = [[DOME_R + 0.4, CURB], [DOME_R + 0.4, CURB + 0.35], [DOME_R, CURB + 0.35]]
  for (let k = 1; k <= 8; k++) {
    const t = (k / 8) * Math.PI / 2
    prof.push([DOME_R * Math.cos(t), CURB + 0.35 + (TOP - CURB - 0.35) * Math.sin(t)])
  }
  lathe(gold, C[0], C[1], prof, 20, false)

  // ---- Lamps: the ring of bulbs round the dome's base, and up eight of its ribs.
  const bulb = (x: number, y: number, z: number) => cbox(lamp, rect(x - 0.18, x + 0.18, y - 0.18, y + 0.18), z, z + 0.36)
  for (let k = 0; k < 24; k++) {
    const t = (k / 24) * Math.PI * 2, r = DOME_R + 0.45
    bulb(C[0] + r * Math.cos(t), C[1] + r * Math.sin(t), CURB + 0.35)
  }
  for (let k = 0; k < 8; k++) {
    const t = (k / 8) * Math.PI * 2
    for (const u of [0.35, 0.6, 0.85]) {
      const e = (u * Math.PI) / 2, r = DOME_R * Math.cos(e) + 0.1
      bulb(C[0] + r * Math.cos(t), C[1] + r * Math.sin(t), CURB + 0.35 + (TOP - CURB - 0.35) * Math.sin(e) - 0.1)
    }
  }

  // ---- The annex: one storey filling the lot west of the block, an arched front on Canal.
  const ANNEX = 8.0
  const An: XY[] = ccw([[-18.26, -3.3], [-13.69, -5.43], SW, NW, [-15.58, 19.97], [-21.96, 6.47], [-15.15, 3.28]])
  pslab(stone, An, 0, ANNEX, 0.25, roof)
  pslab(stone, poffset(An, 0.2), ANNEX - 0.6, ANNEX - 0.2, 0.1, false, true)
  const canal: [XY, XY] = [NW, [-15.58, 19.97]]
  archPanel(shade, canal[0], canal[1], edgeFrame(...canal).L / 2, 7.4, 0.3, 7.0, 0.04, 10)
  archPanel(win, canal[0], canal[1], edgeFrame(...canal).L / 2, 6.0, 0.3, 6.3, 0.08, 10)

  return [
    { part: stone, material: finish('citizens-granite', 0xe9e4da) },
    { part: shade, material: finish('citizens-granite-shade', 0xc9c3b8) },
    { part: roof, material: finish('citizens-bronze', 0x8f8a7c) },
    { part: win, material: PALETTE.window },
    { part: gold, material: finish('citizens-gilt', 0xc6ad6c, 0.5) },
    { part: lamp, material: finish('lamp-citizens-bulb', 0xb8a878) },
  ]
}

if (import.meta.main) {
  await saveModel('nyc-citizens-savings-bank', 'Citizens Savings Bank', build(), {
    source: 'generators/nyc-citizens-savings-bank.ts', bearing: 0, osm: 'way/250266994', height: 34.5,
  }, 5000)
}
