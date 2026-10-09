/**
 * Common Market South End, 235 West Tremont Avenue, Charlotte —
 * procedural, CC0-1.0.
 * bun generators/clt-common-market-south-end.ts
 *
 * The deli, bottle shop and bar that moved here from its first South End
 * address in 2018, into what the press called a "new industrial-looking
 * structure" of about 5,000 sq ft with a 2,000 sq ft patio (Charlotte
 * Magazine; Hoodline, Sept. 2018).
 *
 * WEAK EVIDENCE. No licensed photo of the building exists that I could
 * find (Commons, Commons geosearch, Openverse, Mapillary, KartaView all
 * empty within 400 m), and the 2016 lidar predates it (it shows an earlier
 * 9 m structure on the lot). What is known:
 *  - OSM way/553077609 (outline, which takes in the patio).
 *  - NAIP (USGS, public domain): a pale grey flat roof about 17 × 16 m in
 *    the outline's east part, the patio (umbrellas, furniture) west and
 *    north of it, and a short shadow to the north that suggests a single
 *    tall storey, not the old 9 m block.
 * Everything else is estimated or invented: the 5.5 m height, the wall and
 * storefront colours, the corner entrance, and the sign (a plain panel over
 * the corner, as STYLE.md asks when the lettering can't be checked).
 *
 * Model frame: bearing 0; coordinates below are about (-80.86358,
 * 35.21035); the anchor is the OSM outline's centroid.
 */
import { Part } from './mesh'
import { PALETTE } from './palette'
import { cap, prism, quad, rect, softBox, write, type Built } from './clt-highland-park-mill-3'

const wall = new Part(), win = new Part(), trim = new Part(), roof = new Part(), sign = new Part()

export function buildCommonMarket(): Built {
  // The roofed block (NAIP), inside the OSM outline (x −12.4…8.9, y −9…11).
  const X0 = -8.0, X1 = 8.9, Y0 = -9.0, Y1 = 7.5, H = 5.5
  softBox(wall, rect(X0, Y0, X1, Y1), -0.5, H, 0.3, null)
  cap(roof, rect(X0 + 0.4, Y0 + 0.4, X1 - 0.4, Y1 - 0.4), H - 0.3)
  // Coping.
  for (const [a, b, c, d] of [[X0, Y0, X1, Y0 + 0.4], [X0, Y1 - 0.4, X1, Y1], [X0, Y0, X0 + 0.4, Y1], [X1 - 0.4, Y0, X1, Y1]])
    prism(trim, rect(a, b, c, d), H - 0.3, H + 0.05, trim)
  // Storefront glazing on the patio (west) and street (south) faces, and
  // the north face onto the patio; the east wall is shared with no. 235.
  const d = 0.05
  quad(win, [X0 - d, Y1 - 1.2, 0.4], [X0 - d, Y0 + 1.2, 0.4], [X0 - d, Y0 + 1.2, 3.6], [X0 - d, Y1 - 1.2, 3.6], [-1, 0, 0])
  quad(win, [X0 + 1.2, Y0 - d, 0.4], [X1 - 1.2, Y0 - d, 0.4], [X1 - 1.2, Y0 - d, 3.6], [X0 + 1.2, Y0 - d, 3.6], [0, -1, 0])
  quad(win, [X1 - 1.2, Y1 + d, 0.4], [X0 + 1.2, Y1 + d, 0.4], [X0 + 1.2, Y1 + d, 3.6], [X1 - 1.2, Y1 + d, 3.6], [0, 1, 0])
  // A plain sign panel over the south-west corner, on the street face.
  prism(sign, rect(X0 + 0.6, Y0 - 0.25, X0 + 7.6, Y0 - 0.05), 3.9, 5.0, sign)

  return {
    id: 'clt-common-market-south-end', name: 'Common Market South End', anchor: [-1.75, 1.0], height: 5.6,
    parts: [
      { part: wall, material: PALETTE.stone },
      { part: roof, material: PALETTE.roof },
      { part: win, material: PALETTE.window },
      { part: trim, material: PALETTE.trim },
      { part: sign, material: PALETTE.metal },
    ],
  }
}

if (import.meta.main) await write(buildCommonMarket())
