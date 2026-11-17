/**
 * Pathé Tuschinski, Amsterdam — procedural, CC0-1.0, no textures.
 * bun generators/amsterdam-tuschinski.ts
 *
 * Hijman Louis de Jong's cinema of 1918–1921 on the Reguliersbreestraat:
 * a narrow, richly tiled front between two square towers, each crowned by a
 * ribbed, corbelled top with corner pinnacles and a green bulbous dome with
 * a lantern; between the towers a polygonal oriel, a round-arched window, a
 * dark ornamental frieze and a gilt openwork crest; the auditorium behind is
 * a big gabled hall hidden among the street's houses, with a higher stage
 * house at the back.
 *
 * Map frame: x = model east, y = model north, z up, metres. Model north
 * (+y) is the street front, which faces bearing 25° (NNE). Placed at
 * bearing 25 (the long side walls of the BAG outline, 25.4–26.7°, and the
 * front's normal, 24.3–25.4°). Anchor: the outline's area centroid.
 *
 * Evidence
 * - OSM way/267116768 (building=yes, height 38.2 from 3D BAG, start_date
 *   1922, ref:bag 0363100012168188), the BAG outline: a 14.5 m street front
 *   (towers 4.0 m each, x −8.8…−4.8 and 1.7…5.7, the centre 6.5 m set back
 *   0.3 m), widening behind the neighbouring houses into the 33 m wide hall.
 * - 3D BAG (3dbag.nl, CC BY 4.0, TU Delft / 3DGI), NL.IMBAG.Pand.
 *   0363100012168188, LoD2.2 roof surfaces from AHN lidar, sampled on a 2 m
 *   grid in this frame. Measured (above ground NAP +0.75): the front's
 *   centre 19.9–21.1; the front block's roof 21.4–21.8; the hall a gable on
 *   a ridge along y near x = +1, 22.1, eaves 19.0 at x ±15; the stage house
 *   y −16…−22, 24.3–24.8; the rear wing y < −22, 15–18; a side wing x 5…11
 *   y 12…20, 15.7–19.6. The towers are too small for the reconstruction
 *   (27.1, 31.7, 25.2 at the tower cells: domes, lanterns and flagpoles
 *   mixed); OSM's 38.2 is the point cloud's maximum and not used.
 * - Published: built 1918–1921, opened 28 October 1921, architect H.L. de
 *   Jong, for Abraham Tuschinski; rijksmonument (nl/en.wikipedia
 *   "Tuschinski Theater").
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - Matthias Süßen, "Tuschinski Theater-Amsterdam-2025-msu-9137.jpg",
 *     CC BY-SA 4.0 — the front straight on with verticals corrected; every
 *     front height is scaled from it (28.6 px/m from the 14.5 m front;
 *     check: the centre's top comes out 19.1 against 3D BAG's 19.9–21.1).
 *     https://commons.wikimedia.org/wiki/File:Tuschinski_Theater-Amsterdam-2025-msu-9137.jpg
 *   - MatteoNL97, "Het Tuschinski Theater aan de grotendeels lege
 *     Reguliersbreestraat tijdens de coronacrisis (2021).jpg" and "… (2021)
 *     2.jpg", CC BY 4.0 — the front from the north-west, the towers' side
 *     faces above the neighbours, the crest.
 *     https://commons.wikimedia.org/wiki/File:Het_Tuschinski_Theater_aan_de_grotendeels_lege_Reguliersbreestraat_tijdens_de_coronacrisis_(2021).jpg
 *     https://commons.wikimedia.org/wiki/File:Het_Tuschinski_Theater_aan_de_grotendeels_lege_Reguliersbreestraat_tijdens_de_coronacrisis_(2021)_2.jpg
 *   - Txllxt TxllxT, "Amsterdam - Reguliersbreestraat - View West on
 *     Tuschinski Theatre 1921.jpg", CC BY-SA 4.0 — a tower top close up:
 *     ribbed corbelled crown, corner pinnacles, stepped green base, the
 *     bulbous dome and its lantern frame.
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_-_Reguliersbreestraat_-_View_West_on_Tuschinski_Theatre_1921.jpg
 *   - Txllxt TxllxT, "Amsterdam - Reguliersbreestraat - View South on
 *     Theater Tuschinski.jpg", CC BY-SA 4.0 — the oriels, tile colour.
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_-_Reguliersbreestraat_-_View_South_on_Theater_Tuschinski.jpg
 *   - Txllxt TxllxT, "Amsterdam - Reguliersbreestraat - Theater Tuschinski -
 *     Panoramic Photocompilation.jpg", CC BY-SA 4.0 — the whole front with
 *     both domes (stitched, so used for the order of parts, not sizes).
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_-_Reguliersbreestraat_-_Theater_Tuschinski_-_Panoramic_Photocompilation.jpg
 *   - Anefo, "Tuschinski Theater in de Reguliersbreestraat in Amsterdam,
 *     Bestanddeelnr 931-8038.jpg", CC0 — the lower front, doors and canopy.
 *     https://commons.wikimedia.org/wiki/File:Tuschinski_Theater_in_de_Reguliersbreestraat_in_Amsterdam,_Bestanddeelnr_931-8038.jpg
 *
 * Estimated from Süßen's photo (heights above the street): tower shafts to
 * 20.0, crowns 20.0–22.2 corbelled 0.25 out, pinnacles to 23.4, the domes'
 * green base 22.2–23.0, bulb to 25.2, lantern to 26.4, spike 27.4; the
 * oriels on the towers 8.3–11.6, 12.4–15.5, 16.0–19.4; the centre's oriel
 * 8.2–11.7 (4.5 m wide), round-arched window 12.6–14.5, frieze 16.1–18.4,
 * the gilt crest 19.1–20.5; the name band 4.5–5.1 and canopy 3.3–4.4. The
 * domes are drawn 0.2 m fuller than the photo so they hold at 200 px. Tower
 * depth 4.5 m is estimated (the side faces show above the neighbours only).
 * The auditorium's walls are hidden by the houses on the street; drawn plain
 * in a dark brick tone like the neighbouring houses' (the same dark material
 * as the crowns and frieze), so the pale tiled front reads as the face; their
 * real finish is unknown. Rechecked after review: the hall's heights are 3D
 * BAG's LoD2.2 roof surfaces (LoD1.2 gives 21.9 flat for the whole hall, its
 * 70th percentile), not a maximum; the stage house is drawn at 24.3 as
 * measured, 50 m behind the street front, where no street photo can see it.
 *
 * Doubts: no photo shows the back or the hall roof; its shape is 3D BAG's.
 * Night: the front is floodlit (the tile glows warm in night photos), the
 * windows and doors light; the marquee is a plain box, not lettering.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, capPoly, type XY, unit } from './nyc-570-lexington'
import { rectPanel, archPanel, band, block } from './nyc-city-hall'

const tile = new Part(), dark = new Part(), win = new Part(), cop = new Part(), gilt = new Part(), roof = new Part()

/** A solid of revolution about (cx, cy): profile [r, z] from bottom to top, n sides, smooth. */
function lathe(p: Part, cx: number, cy: number, prof: [number, number][], n = 12) {
  const ring = (r: number, z: number) => Array.from({ length: n }, (_, i) => {
    const a = (i / n) * 2 * Math.PI + Math.PI / n
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3
  })
  const R = prof.map(([r, z]) => ring(r, z))
  for (let k = 0; k < prof.length - 1; k++) {
    const dr = prof[k + 1][0] - prof[k][0], dz = prof[k + 1][1] - prof[k][1]
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const nm = (q: V3): V3 => { const h = unit([q[0] - cx, q[1] - cy, 0]); return unit([h[0] * dz, h[1] * dz, -dr]) }
      const a = R[k][i], b = R[k][j], c = R[k + 1][j], d = R[k + 1][i]
      if (prof[k][0] > 1e-3) p.tri(a, b, c, undefined, undefined, undefined, [nm(a), nm(b), nm(c)])
      if (prof[k + 1][0] > 1e-3) p.tri(a, c, d, undefined, undefined, undefined, [nm(a), nm(c), nm(d)])
    }
  }
}

/** A flat-fronted oriel on the front (wall plane y = yw, facing +y): a box with chamfered sides and a sloping corbel. */
function oriel(x0: number, x1: number, z0: number, z1: number, yw: number, d: number, glaze = true) {
  const c = Math.min(d, (x1 - x0) * 0.25)
  const ring: XY[] = [[x0, yw], [x1, yw], [x1, yw + d - c], [x1 - c, yw + d], [x0 + c, yw + d], [x0, yw + d - c]]
  prism({ wall: tile, win: null, roof: tile, ring, z0, z1, facade: null, bevel: 0.08 })
  // the corbel under it, sloping back to the wall
  const cz = z0 - d * 1.1
  tile.quad([x0 + c, yw + d, z0], [x1 - c, yw + d, z0], [x1 - c * 0.3, yw, cz], [x0 + c * 0.3, yw, cz])
  tile.tri([x1 - c, yw + d, z0], [x1, yw + d - c, z0], [x1 - c * 0.3, yw, cz])
  tile.tri([x0, yw + d - c, z0], [x0 + c, yw + d, z0], [x0 + c * 0.3, yw, cz])
  tile.tri([x1, yw + d - c, z0], [x1, yw, z0], [x1 - c * 0.3, yw, cz])
  tile.tri([x0, yw, z0], [x0, yw + d - c, z0], [x0 + c * 0.3, yw, cz])
  if (!glaze) return
  // windows: one panel on the face, one on each chamfer
  const m = 0.25
  win.quad([x1 - c - m, yw + d + 0.05, z0 + 0.4], [x0 + c + m, yw + d + 0.05, z0 + 0.4], [x0 + c + m, yw + d + 0.05, z1 - 0.4], [x1 - c - m, yw + d + 0.05, z1 - 0.4])
  const side = (a: XY, b: XY) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L > 0.6) rectPanel(win, a, b, L / 2, L - 0.25, z0 + 0.4, z1 - 0.4, 0.04)
  }
  side([x1, yw + d - c], [x1 - c, yw + d])
  side([x0 + c, yw + d], [x0, yw + d - c])
}

// ---------------------------------------------------------------- outline and the hall
// BAG outline (way/267116768) in this frame.
const ring: XY[] = [
  [16.89, 15.63], [16.69, 3.0], [15.69, 3.01], [15.63, -1.62], [16.62, -1.62], [16.53, -7.85], [14.71, -7.93], [15.31, -12.93],
  [18.55, -24.56], [-0.64, -28.74], [-1.61, -25.04], [-5.01, -25.16], [-9.58, -26.26], [-14.62, -27.46], [-14.85, -26.58],
  [-16.61, -27.01], [-18.17, -21.31], [-16.07, -21.33], [-15.58, -1.7], [-14.98, 18.02], [-9.33, 18.0], [-8.87, 34.67],
  [-4.79, 34.62], [-4.79, 34.37], [1.7, 34.45], [1.7, 34.69], [5.7, 34.74], [5.35, 21.75], [10.92, 21.37], [10.88, 15.57],
].reverse() as XY[]
// The whole footprint to the rear wing's height.
prism({ wall: dark, win: null, roof, ring, z0: 0, z1: 16.0, facade: null, bevel: 0.2 })

// The hall: walls to the eaves (19.0), a gable along y with its ridge near x = +1 (22.1).
const EAVE = 19.0, RIDGE = 22.1, RX = 1.0
const hall: XY[] = [
  [-16.0, -21.3], [17.4, -21.3], [15.3, -12.9], [14.7, -7.9], [16.5, -7.9], [16.6, 3.0], [16.9, 15.6], [10.9, 15.6], [10.9, 21.4],
  [5.4, 21.75], [5.55, 30.0], [-8.75, 30.0], [-9.3, 18.0], [-15.0, 18.0], [-15.6, -1.7],
]
prism({ wall: dark, win: null, roof: null, ring: hall, z0: 15.5, z1: EAVE, facade: null, bevel: 0.2 })
{
  const xa = -15.8, xb = 17.0, y0 = -16.0, y1 = 18.0
  roof.quad([RX, y0, RIDGE], [RX, y1, RIDGE], [xa, y1, EAVE - 0.3], [xa, y0, EAVE - 0.3])
  roof.quad([RX, y1, RIDGE], [RX, y0, RIDGE], [xb, y0, EAVE - 0.3], [xb, y1, EAVE - 0.3])
  dark.tri([xa + 0.3, y1, EAVE - 0.05], [xb - 0.3, y1, EAVE - 0.05], [RX, y1, RIDGE - 0.05])
  // the front block between the hall and the street: flat at the eaves
  capPoly(roof, [[-9.3, 18.0], [10.9, 18.0], [10.9, 21.4], [5.4, 21.75], [5.55, 30.0], [-8.75, 30.0]], EAVE)
  // the stage house at the back
  prism({ wall: dark, win: null, roof, ring: [[-16.0, -21.3], [17.4, -21.3], [16.1, -16.0], [-15.85, -16.0]], z0: 15.5, z1: 24.3, facade: null, bevel: 0.25 })
}

// ---------------------------------------------------------------- the front
const YF = 34.65 // tower fronts
const YC = 34.4 // the centre between them
const TW: [number, number][] = [[-8.85, -4.8], [1.7, 5.7]]
const TD = 4.5 // tower depth
const SHAFT = 20.0, CROWN = 22.2

// The centre: wall to 19.1 between the towers, the front block behind it.
prism({ wall: tile, win: null, roof, ring: [[-4.8, 30.0], [1.7, 30.0], [1.7, YC], [-4.8, YC]], z0: 0, z1: 19.1, facade: null, bevel: 0.05 })
band(dark, [[-4.8, 30.0], [1.7, 30.0], [1.7, YC], [-4.8, YC]], 18.7, 19.15, 0.12)

for (const [x0, x1] of TW) {
  const r: XY[] = [[x0, YF - TD], [x1, YF - TD], [x1, YF], [x0, YF]]
  prism({ wall: tile, win: null, roof: null, ring: r, z0: 0, z1: SHAFT, facade: null, bevel: 0.25 })
  band(tile, r, 0, 0.6, 0.08) // granite plinth course
  // the strong vertical ribs up the tower's front corners
  block(tile, x0 - 0.05, YF - 0.6, x0 + 0.55, YF + 0.3, 0.6, SHAFT - 0.6)
  block(tile, x1 - 0.55, YF - 0.6, x1 + 0.05, YF + 0.3, 0.6, SHAFT - 0.6)
  // the ribbed, corbelled crown
  const cr: XY[] = [[x0 - 0.25, YF - TD - 0.25], [x1 + 0.25, YF - TD - 0.25], [x1 + 0.25, YF + 0.25], [x0 - 0.25, YF + 0.25]]
  tile.quad([x0, YF, SHAFT - 0.6], [x1, YF, SHAFT - 0.6], [x1 + 0.25, YF + 0.25, SHAFT], [x0 - 0.25, YF + 0.25, SHAFT]) // corbel
  tile.quad([x1, YF, SHAFT - 0.6], [x1, YF - TD, SHAFT - 0.6], [x1 + 0.25, YF - TD - 0.25, SHAFT], [x1 + 0.25, YF + 0.25, SHAFT])
  tile.quad([x0, YF - TD, SHAFT - 0.6], [x0, YF, SHAFT - 0.6], [x0 - 0.25, YF + 0.25, SHAFT], [x0 - 0.25, YF - TD - 0.25, SHAFT])
  tile.quad([x1, YF - TD, SHAFT - 0.6], [x0, YF - TD, SHAFT - 0.6], [x0 - 0.25, YF - TD - 0.25, SHAFT], [x1 + 0.25, YF - TD - 0.25, SHAFT])
  prism({ wall: dark, win: null, roof: dark, ring: cr, z0: SHAFT, z1: CROWN, facade: null, bevel: 0.15 })
  // vertical ribs on the crown's four faces
  const cx = (x0 + x1) / 2, cy = YF - TD / 2
  for (const t of [-0.3, 0, 0.3]) {
    const xs = cx + t * (x1 - x0 + 0.5), ys = cy + t * (TD + 0.5)
    block(dark, xs - 0.17, YF + 0.25, xs + 0.17, YF + 0.5, SHAFT - 0.2, CROWN - 0.15)
    block(dark, xs - 0.17, YF - TD - 0.5, xs + 0.17, YF - TD - 0.25, SHAFT - 0.2, CROWN - 0.15)
    block(dark, x1 + 0.25, ys - 0.17, x1 + 0.5, ys + 0.17, SHAFT - 0.2, CROWN - 0.15)
    block(dark, x0 - 0.5, ys - 0.17, x0 - 0.25, ys + 0.17, SHAFT - 0.2, CROWN - 0.15)
  }
  // corner pinnacles with small green caps
  for (const [px, py] of [[x0, YF - TD], [x1, YF - TD], [x1, YF], [x0, YF]] as XY[]) {
    block(dark, px - 0.4, py - 0.4, px + 0.4, py + 0.4, CROWN - 0.3, CROWN + 1.0, false)
    lathe(cop, px, py, [[0.42, CROWN + 1.0], [0.3, CROWN + 1.3], [0.0, CROWN + 2.1]], 8)
  }
  // the dome: a stepped green base, the bulb, a lantern and a spike
  lathe(cop, cx, cy, [[1.55, CROWN - 0.05], [1.55, CROWN + 0.3], [1.3, CROWN + 0.3], [1.3, CROWN + 0.7]], 12)
  lathe(cop, cx, cy, [[1.3, CROWN + 0.7], [1.5, CROWN + 1.2], [1.5, CROWN + 1.7], [1.3, CROWN + 2.3], [0.85, CROWN + 2.95], [0.4, CROWN + 3.4], [0.22, CROWN + 3.55]], 12)
  lathe(gilt, cx, cy, [[0.25, CROWN + 3.5], [0.5, CROWN + 3.8], [0.5, CROWN + 4.6], [0.3, CROWN + 4.85]], 8)
  lathe(cop, cx, cy, [[0.3, CROWN + 4.85], [0.1, CROWN + 5.1], [0.0, CROWN + 6.0]], 6)
  // the tower fronts: door, a window, three stacked oriels
  const a: XY = [x1, YF], b: XY = [x0, YF], w = x1 - x0, mid = w / 2
  rectPanel(win, a, b, mid, 1.8, 0.6, 3.2)
  block(dark, x0 + 0.5, YF, x1 - 0.5, YF + 0.35, 3.4, 4.6) // the tiled 'pagoda' hood over the door
  rectPanel(win, a, b, mid, 1.4, 5.4, 7.5)
  oriel(x0 + 0.85, x1 - 0.85, 8.3, 11.6, YF, 0.6)
  oriel(x0 + 0.85, x1 - 0.85, 12.4, 15.5, YF, 0.6)
  oriel(x0 + 0.85, x1 - 0.85, 16.0, 19.4, YF, 0.6)
  // side faces above the neighbouring houses: a window each
  const outer: [XY, XY] = x0 < 0 ? [[x0, YF], [x0, YF - TD]] : [[x1, YF - TD], [x1, YF]] // ring order, facing out
  rectPanel(win, outer[0], outer[1], TD / 2, 1.3, 16.2, 18.8)
}

// The centre's face: doors and canopy, name band, windows, the big oriel,
// the round-arched window, the frieze and the gilt crest.
{
  const a: XY = [1.7, YC], b: XY = [-4.8, YC], L = 6.5
  rectPanel(win, a, b, L / 2, 4.4, 0.5, 3.2)
  block(dark, -4.4, YC, 1.3, YC + 1.5, 3.3, 4.2) // the canopy
  rectPanel(gilt, a, b, L / 2, 5.4, 4.5, 5.1, 0.07) // the name band (plain, not lettered)
  for (const s of [1.2, 2.55, 3.95, 5.3]) rectPanel(win, a, b, s, 0.85, 5.6, 7.5)
  oriel(-3.6, 0.5, 8.2, 11.7, YC, 0.8)
  archPanel(tile, a, b, L / 2, 3.9, 12.2, 15.4, 0.06, 10) // the raised arch surround
  archPanel(win, a, b, L / 2, 3.1, 12.6, 14.9, 0.1, 10)
  rectPanel(dark, a, b, L / 2, L - 0.2, 16.1, 18.4, 0.08) // the ornamental frieze
  // the openwork gilt crest: a row of five bold arches on a rail
  block(gilt, -4.6, YC - 0.25, 1.5, YC - 0.05, 19.1, 19.4)
  for (let k = 0; k < 5; k++) {
    const s = -4.6 + (6.1 * (k + 0.5)) / 5, r = 0.58, zc = 19.4
    // a half-disc plate, both faces, 0.2 m thick at the rim
    const pts: [number, number][] = []
    for (let i = 0; i <= 8; i++) { const t = (i / 8) * Math.PI; pts.push([s + r * Math.cos(t), zc + 0.45 + r * Math.sin(t)]) }
    const yf = YC - 0.05, yb = YC - 0.25
    gilt.quad([s - r, yf, zc], [s + r, yf, zc], [s + r, yf, zc + 0.45], [s - r, yf, zc + 0.45])
    gilt.quad([s + r, yb, zc], [s - r, yb, zc], [s - r, yb, zc + 0.45], [s + r, yb, zc + 0.45])
    for (let i = 0; i < 8; i++) {
      const A = pts[i], B = pts[i + 1]
      gilt.tri([s, yf, zc + 0.45], [A[0], yf, A[1]], [B[0], yf, B[1]])
      gilt.tri([s, yb, zc + 0.45], [B[0], yb, B[1]], [A[0], yb, A[1]])
      gilt.quad([A[0], yf, A[1]], [A[0], yb, A[1]], [B[0], yb, B[1]], [B[0], yf, B[1]])
    }
  }
}

// ---------------------------------------------------------------- write
const front = (p: V3, n: V3): number => (p[1] > 29 && n[1] > 0.4 ? 1 : p[1] > 29 && n[2] < 0.5 ? 0.6 : 0)
finishModel('Pathé Tuschinski', 'amsterdam-tuschinski', [
  { part: tile, material: { ...finish('tuschinski-tile', 0xa79e8c), floodlight: front } },
  { part: dark, material: { ...finish('tuschinski-dark', 0x6f5a52), floodlight: front } },
  { part: win, material: PALETTE.window },
  { part: cop, material: { ...PALETTE.patina, color: 0x5f9381 } },
  { part: gilt, material: { ...finish('tuschinski-gilt', 0xc9a14a, 0.5), floodlight: front } },
  { part: roof, material: { ...PALETTE.roof, color: 0x8b8f93 } },
], { bearing: 25, osm: 'way/267116768', height: 28.2 }, 5000)
