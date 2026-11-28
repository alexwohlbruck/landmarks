/**
 * Dubai International Airport (DXB), Concourse D: procedural, CC0-1.0, no
 * textures. A plain model: see Doubts.
 *
 *   bun generators/dubai-dxb-concourse-d.ts
 *
 * Built with the kit in dubai-dxb-terminal-3.ts.
 *
 * What is modelled
 * - Concourse D (way/302538629; opened February 2016, 17 gates, linked to
 *   Terminal 1 by people mover; Wikipedia): a 700 m pier along the apron
 *   with its two hooked ends, and the deeper central block on its
 *   landside where the people mover arrives. Glass walls under a white
 *   flat roof; the central block's roof carries grey skylight fields; teal
 *   glass gate modules along the apron face.
 * It is split from dubai-dxb-terminal-1 (which the batch plan joined it
 * to) because it stands 600 m from Concourse C across the apron.
 *
 * Frame: x along the pier (to bearing 122.2 deg, south-east), y to the
 * north-east (the apron), z up, metres; placed at bearing 32.2. Anchor:
 * the area centroid of way/302538629, lng 55.3441659, lat 25.2578588.
 * Flat site (Mapterhorn z12).
 *
 * Numbers
 * - Footprint: OSM way/302538629 (ODbL), fetched 2026-11.
 * - Pier 20 m, central block 24 m: estimated (four public levels over the
 *   apron level); no photo gives a height.
 * - Gate modules every ~40 m along the apron face: estimated from the 17
 *   gates and the parked aircraft on the ISS photo.
 *
 * Sources (evidence)
 * - OSM way/302538629.
 * - Wikipedia, "Dubai International Airport", Concourse D.
 * - "ISS-65 Dubai International Airport and Dubai Creek (cropped).jpg",
 *   NASA, public domain, 2021 (plan and roof: a white roof, grey fields
 *   over the central block, aircraft along the north-east face):
 *   https://commons.wikimedia.org/wiki/File:ISS-65_Dubai_International_Airport_and_Dubai_Creek_(cropped).jpg
 *
 * Doubts
 * - No licensed photo of Concourse D's walls was found (Commons, Openverse;
 *   the 2013-14 aerials show it under construction). The walls are drawn
 *   as plain glass and every height is estimated. Treat this as a
 *   placeholder until a photo turns up.
 */
import { Part } from './mesh'
import { cap, clean, clip, panels, walls, type XY } from './clt-terminal'
import { DXB, obox, spanAt, writeModel } from './dubai-dxb-terminal-3'

const ID = 'dubai-dxb-concourse-d'
const BEARING = 32.2

const D: XY[] = [[-144.04, 10.86], [-164.64, 10.6], [-186.02, 9.97], [-253.42, 8.92], [-300.19, 8.78], [-300.36, -2.33], [-310.91, -2.1], [-311.12, -13.65], [-311.47, -56.74], [-311.52, -64.7], [-350.08, -64.88], [-350.27, -50.12], [-350.56, 1.76], [-351.45, 40.81], [-351.53, 47.59], [-345.04, 47.74], [-339.59, 47.87], [-267.84, 49.46], [-213.56, 50.67], [-206.99, 50.83], [-187.06, 51.26], [-169.29, 51.17], [-159.5, 51.34], [-124.51, 51.86], [-117.62, 51.97], [-87.2, 52.45], [-47.09, 53.32], [-41.54, 53.43], [58.02, 55.56], [114.96, 56.98], [129.24, 57.49], [146.85, 58.13], [159.28, 58.73], [194.47, 58.46], [263.01, 57.91], [325.5, 57.39], [345.11, 57.2], [345.23, 53.45], [345.99, 31.86], [347.76, -19.39], [348.95, -53.59], [337.77, -53.78], [311.13, -54.24], [310.95, -47.45], [309.84, -3.96], [309.86, 5.85], [297.41, 5.78], [297.38, 18.36], [250.32, 17.8], [183.15, 17.17], [160.56, 16.9], [147.56, 16.75], [142.86, 16.69], [122.42, -4.85], [114.15, -13.57], [105.9, -22.25], [116.46, -32.68], [99.06, -50.73], [99.94, -93.72], [11.15, -94.93], [11.21, -105.34], [-13.21, -105.54], [-13.69, -95.2], [-75.69, -95.43], [-75.34, -61.99], [-75.29, -56.78], [-107.49, -25.33], [-116.79, -15.98], [-126.79, -6.19]]

function build() {
  const glassWall = new Part(), win = new Part(), white = new Part(), roof = new Part(), teal = new Part(), trim = new Part()
  const ring = clean(D, 0.4)
  // the pier (north of y = 12, plus the hooked ends) and the central block between x -130 and 125
  const centre = clean(clip(clip(clip(ring, 0, 1, 12), -1, 0, 135), 1, 0, 130), 0.1)
  const pierW = clean(clip(ring, 1, 0, -135), 0.1)
  const pierE = clean(clip(ring, -1, 0, -130), 0.1)
  const pierM = clean(clip(clip(clip(ring, 0, -1, -12), -1, 0, 135), 1, 0, 130), 0.1)
  for (const [r, h] of [[pierW, 20], [pierE, 20], [pierM, 20], [centre, 24]] as [XY[], number][]) {
    if (r.length < 3) continue
    walls(white, r, 0, 2)
    walls(white, r, h - 2.4, h)
    walls(glassWall, r, 2, h - 2.4)
    panels(win, r, 3, h - 3.4, { bay: 18, gap: 1.4, minLen: 10, out: 0.05 })
    cap(white, r, h)
  }
  // grey skylight fields on the central block's roof
  for (const [x0, x1] of [[-62, 6], [16, 84]]) cap(roof, [[x0, -86], [x1, -86], [x1, -6], [x0, -6]], 24.15)
  // gate modules along the apron face (y ~ 50-58)
  for (let x = -320; x <= 330; x += 40) {
    const y = spanAt(ring, x)[1]
    obox(teal, x, y, 0, -6, 6, -0.5, 7, 0, 13.6, null)
    obox(trim, x, y, 0, -6.4, 6.4, -0.5, 7.4, 13.6, 15)
  }
  return [
    { part: glassWall, material: DXB.stone },
    { part: win, material: DXB.window },
    { part: white, material: DXB.trim },
    { part: roof, material: DXB.roof },
    { part: teal, material: DXB.teal },
    { part: trim, material: DXB.silver },
  ]
}

if (import.meta.main) {
  await writeModel(`${ID}.glb`, 'Dubai International Airport Concourse D', build(), { bearing: BEARING, elevation: 0 }, 5000, 250_000)
}
