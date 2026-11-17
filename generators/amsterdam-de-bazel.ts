/**
 * De Bazel (Stadsarchief Amsterdam), Amsterdam — procedural, CC0-1.0, no textures.
 * bun generators/amsterdam-de-bazel.ts
 *
 * K.P.C. de Bazel's head office for the Nederlandsche Handel-Maatschappij
 * (1919–1926), now the city archives: a 100 m block on the Vijzelstraat
 * between the Herengracht and the Keizersgracht, its whole skin banded in
 * dark brick and pale granite. Eight storeys to the main cornice, two more
 * set back above it; at the two canal corners the block rises full height in
 * stepped tiers, and tower-like pier bundles break the long fronts; a glass
 * ridge over the central hall runs down the middle of the roof.
 *
 * Map frame: x = model east, y = model north, z up, metres. Model north is
 * bearing 12° (the long Vijzelstraat front, edges at 12.0–12.5°), so the
 * Vijzelstraat front is +x and the Herengracht end +y. Anchor: the OSM
 * outline's area centroid.
 *
 * Evidence
 * - OSM way/114542356 (building=government, height 37.5, building:levels 10,
 *   start_date 1924, ref:bag 0363100012165077, wikidata Q1977799): the BAG
 *   outline, 30 × 102 m with a stepped back (west) side.
 * - 3D BAG (3dbag.nl, CC BY 4.0, TU Delft / 3DGI), NL.IMBAG.Pand.
 *   0363100012165077, LoD2.2 roofs from AHN lidar, sampled on a 2 m grid in
 *   this frame (ground NAP +1.05). Measured: the main cornice 28.1 on a 2 m
 *   strip along both long fronts; the set-back top 33.4–33.6 across the
 *   block; the corner masses at both ends full width at 33.4–34.3; pier
 *   towers on the Vijzelstraat front at y ≈ 22, 0, −22 reaching 33.0–34.3; a
 *   raised central ridge x −4…4, 34.5–36.7 (the hall's glass roof); a stair
 *   head at the north-west, 36.7; a lift tower at x −8…−4, y −30…−40, 40–42.
 * - Published: architect K.P.C. de Bazel, built 1919–1926; rijksmonument;
 *   Stadsarchief since 2007 (nl.wikipedia "De Bazel (Amsterdam)").
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - Basvb, "Herengracht - Amsterdam (31).JPG", CC BY-SA 3.0 — the
 *     Herengracht corner and the Vijzelstraat front: the corner's stepped
 *     tiers, the pier bundles, the banding.
 *     https://commons.wikimedia.org/wiki/File:Herengracht_-_Amsterdam_(31).JPG
 *   - Fred Romero, "Amsterdam - Stadsarchief Amsterdam De Bazel
 *     (30214970991).jpg", CC BY 2.0 — the same corner, sunlit.
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_-_Stadsarchief_Amsterdam_De_Bazel_(30214970991).jpg
 *   - Fred Romero, "… (29670354714).jpg" and "… (30300822115).jpg", CC BY
 *     2.0 — the Vijzelstraat front from the south, the set-back storeys.
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_-_Stadsarchief_Amsterdam_De_Bazel_(29670354714).jpg
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_-_Stadsarchief_Amsterdam_De_Bazel_(30300822115).jpg
 *   - מייסטריך, "Amsterdan City Archives.jpg", CC BY-SA 4.0 — the north
 *     corner. https://commons.wikimedia.org/wiki/File:Amsterdan_City_Archives.jpg
 *   - Rob Oo, "From the Archives (50496166143).jpg", CC BY 2.0 — the banding
 *     close up: dark brick, pale granite courses, narrow window groups.
 *     https://commons.wikimedia.org/wiki/File:From_the_Archives_(50496166143).jpg
 *   - R. Hoogewoud, "Overzicht - Amsterdam - 20350193 - RCE.jpg", CC BY-SA
 *     4.0 — the Vijzelstraat front from the Keizersgracht end.
 *     https://commons.wikimedia.org/wiki/File:Overzicht_-_Amsterdam_-_20350193_-_RCE.jpg
 *   - Effeietsanders, "Rm46509.JPG", CC BY-SA 3.0 nl — the south corner.
 *     https://commons.wikimedia.org/wiki/File:Rm46509.JPG
 *
 * Estimated from the photos, scaled to 3D BAG: the granite base 0–4.4;
 * storeys 3.2 m; the banding drawn broad, as the lead asked: one pale band
 * 1.0 m deep under each storey's windows instead of the real two or three
 * finer courses per storey; window groups about 1.8 m wide on a 4.5 m bay,
 * two storeys to a panel; the pier bundles' step at 31.9 (one tier of the
 * photo's stepped pier bundles; the finer steps left out). The corners'
 * walls run straight to 33.5 as 3D BAG measures them.
 *
 * Doubts: the west (back) side faces courtyards of the canal houses and is
 * drawn like the fronts; the hall's glass ridge is from 3D BAG only.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, type XY } from './nyc-570-lexington'
import { rectPanel, band } from './nyc-city-hall'

const brick = new Part(), granite = new Part(), win = new Part(), roof = new Part(), glass = new Part()

const ring: XY[] = [
  [14.12, 5.39], [14.07, -49.72], [12.44, -51.59], [-15.74, -51.51], [-15.66, -36.05], [-12.63, -36.06], [-12.6, -29.64],
  [-12.72, 28.62], [-12.55, 34.95], [-17.73, 34.96], [-17.59, 50.67], [12.35, 50.56], [14.15, 48.57],
]
const CORNICE = 28.1, STEP = 30.8, TOP = 33.5
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** A banded volume: brick walls with a pale granite course under each storey's windows, and window groups. */
function volume(r: XY[], z0: number, z1: number, o: { roofPart?: Part | null; windows?: boolean; base?: boolean } = {}) {
  prism({ wall: brick, win: null, roof: o.roofPart === undefined ? roof : o.roofPart, coping: granite, ring: r, z0, z1, facade: null, bevel: 0.3 })
  // the granite base
  if (o.base) band(granite, ring3(r), 0, 4.4, 0.05)
  // broad pale bands, one per storey
  for (let z = 4.4; z < z1 - 1.2; z += 3.2) if (z >= z0) band(granite, ring3(r), z, z + 1.0, 0.04)
  band(granite, ring3(r), z1 - 0.9, z1 - 0.35, 0.12) // the cornice course
  if (o.windows === false) return
  // window groups, two storeys to a panel
  const rows: [number, number][] = []
  if (z0 < 1) rows.push([1.2, 3.8])
  for (let z = Math.max(4.4, z0 + 0.6); z + 2.6 < z1 - 0.8; z += 6.4) rows.push([z + 0.6, Math.min(z + 6.4 - 0.4, z1 - 1.1)])
  const rr = ccw(r)
  for (let k = 0; k < rr.length; k++) {
    const a = rr[k], b = rr[(k + 1) % rr.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 3) continue
    const n = Math.max(1, Math.round((L - 1.2) / 4.5)), p = (L - 1.2) / n
    for (let i = 0; i < n; i++) for (const [lo, hi] of rows) rectPanel(win, a, b, 0.6 + p * (i + 0.5), Math.min(1.8, p * 0.42), lo, hi, 0.08)
  }
}
const ccw = (r: XY[]) => { let s = 0; for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; s += a[0] * b[1] - b[0] * a[1] } return s < 0 ? r.slice().reverse() : r }
const ring3 = ccw

// ---------------------------------------------------------------- massing
volume(ring, 0, CORNICE, { base: true })
// the set-back upper storeys over the long middle
volume(rect(-10.7, -40.0, 12.1, 39.0), CORNICE - 0.2, TOP)
// the two canal corners rise full width, their walls straight up to the top
volume([[-17.59, 39.0], [14.15, 39.0], [14.15, 48.57], [12.35, 50.56], [-17.59, 50.67]], CORNICE - 0.2, TOP)
volume([[-15.74, -51.51], [12.44, -51.59], [14.07, -49.72], [14.07, -40.0], [-15.7, -40.0]], CORNICE - 0.2, TOP)
// tower-like pier bundles breaking the Vijzelstraat front (and one at the back), stepping in at the top
for (const [y0, y1] of [[19.5, 25.0], [-3.0, 3.0], [-25.0, -19.5]]) {
  volume(rect(11.9, y0, 14.1, y1), CORNICE - 0.2, STEP + 1.1, { windows: false })
  volume(rect(11.4, y0 + 0.7, 13.4, y1 - 0.7), STEP + 0.9, TOP, { windows: false })
}
volume(rect(-12.7, -28.0, -10.5, -19.5), CORNICE - 0.2, TOP, { windows: false })
// stair and lift heads
volume(rect(-12.0, 30.0, -6.0, 39.5), TOP - 0.2, 36.7, { windows: false })
volume(rect(-8.2, -40.0, -3.8, -30.0), TOP - 0.2, 41.5, { windows: false })

// the glass ridge over the central hall
{
  const x0 = -3.5, x1 = 3.5, xc = 0, y0 = -36.0, y1 = 30.0, ze = TOP + 0.05, zr = 36.7
  glass.quad([x1, y0, ze], [x1, y1, ze], [xc, y1, zr], [xc, y0, zr])
  glass.quad([x0, y1, ze], [x0, y0, ze], [xc, y0, zr], [xc, y1, zr])
  glass.tri([x0, y0, ze], [x1, y0, ze], [xc, y0, zr])
  glass.tri([x1, y1, ze], [x0, y1, ze], [xc, y1, zr])
}

// ---------------------------------------------------------------- write
finishModel('De Bazel', 'amsterdam-de-bazel', [
  { part: brick, material: finish('debazel-brick', 0x735c57) },
  { part: granite, material: finish('debazel-granite', 0xc6bcad) },
  { part: win, material: PALETTE.window },
  { part: roof, material: { ...PALETTE.roof, color: 0x8f969c } },
  { part: glass, material: { ...PALETTE.glass, color: 0x8796a3 } },
], { bearing: 12, osm: 'way/114542356', height: 41.5 }, 6500)
