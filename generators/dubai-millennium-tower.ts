/**
 * Millennium Tower, Dubai — original procedural geometry, CC0-1.0.
 * bun generators/dubai-millennium-tower.ts   (imports the kit from dubai-address-downtown.ts)
 *
 * Frame: map frame, x east, y north, z up, metres, turned to BEARING 41 (the
 * outline's long sides), origin at the outline's centroid. +y is the NE end.
 *
 * Evidence
 * - OSM way/203296254 "Millennium Tower" (height 285, 60 levels, 2006,
 *   wikidata Q623517): a 33.0 x 43.3 m rectangle, long sides NE-SW. (Its
 *   wikimedia_commons tag points at the Wroclaw Millennium Tower: wrong.)
 * - Published: 285 m to the spire (the batch assignment; OSM's height tag
 *   and its wikipedia link agree), completed 2006 (OSM start_date).
 * - Photos:
 *   m3 "053-DSC07075", Bazsi1979, CC BY-SA 2.0,
 *     https://www.flickr.com/photos/31929940@N00/24940164833 (whole tower from the
 *     E across Downtown, distant and level: every height ratio below);
 *   m2 "037-DSC07004", Bazsi1979, CC BY-SA 2.0,
 *     https://www.flickr.com/photos/31929940@N00/25448279882 (the crown close:
 *     the slot, the needle spire, the canopy ledge, the braced frame);
 * - No lidar or aerial imagery covers the UAE in the allowed sources; the map
 *   terrain (Mapterhorn) has no tiles here, so the ground could not be
 *   checked. The site is flat; elevation 0.
 *
 * Numbers
 * - Tip 285: published. From m3 (ground line hidden behind a wall, estimated
 *   at the palms' foot): crown top 261 m, dark shaft top 236 m, top of the
 *   white braced end frames 206 m - estimated, +-5 m.
 * - End blocks 6 m deep (the white strip of the SW block's side in m3) and the
 *   braced frames on both short (NE, SW) faces - estimated; only the NE one is
 *   photographed, the SW one is assumed by symmetry.
 * - Crown: 29 m across the frame faces (m2, same width as the shaft less its
 *   edges) and 11 m the other way (its projected width in m3) - estimated; the
 *   slot 5.2 m wide down to 248 m (m2: about half the crown).
 * - The spire is drawn 5 m thick at its foot, bolder than the real needle,
 *   so it shows on a phone.
 * - Facade: dark blue glass in three-floor groups between pale louvre bands;
 *   the braced frames as eight bays a side, a lambda of diagonals per half bay.
 * - Bevels 0.5-0.9 m on the shaft corners, end blocks, ledges and crown.
 * Look-only references (licence outside PD/CC0/CC BY/CC BY-SA; looked at, not used):
 *   m11 "Millennium Tower (Dubai).jpg", Ting read, "copyrighted free use",
 *     https://commons.wikimedia.org/wiki/File:Millennium_Tower_(Dubai).jpg
 *     (from the Burj Khalifa lake, E, distant: agrees with m3's silhouette).
 * Doubts: no photo of the W or S sides; the SW frame is assumed. The pale
 * vertical fin on the SE face (m3) and the louvre fins are not drawn. The
 * ground line in m3 is hidden, so the setback heights carry about 5 m of
 * doubt.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { type V2, block, chamfer, mast, walls, writeModel } from './dubai-address-downtown'

const ID = 'dubai-millennium-tower'
const ANCHOR = { lng: 55.265865, lat: 25.1948367 } // centroid of way/203296254
const BEARING = 41 // the long sides of the outline run NE-SW; +y is the NE end

const HX = 16.5, HY = 21.5 // OSM way/203296254: 33.0 x 43.3 m
const END = 6 // depth of the white braced end blocks (estimated from photo m3)
const H = {
  tip: 285, // published
  crownTop: 261, // photo m3 (tip 285 m to an estimated base line)
  slot: 248, // bottom of the slot the spire rises from (photo m2: ~half the crown)
  crown: 236, // top of the dark glass shaft (photo m3)
  ends: 206, // top of the white braced end frames (photo m3)
  pitch: 12.9, band: 1.6, // three floors to a group, pale louvre band between
}

const rect = (x0: number, y0: number, x1: number, y1: number, c = 0.6): V2[] => chamfer([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], c)

function build() {
  const glass = new Part(), white = new Part(), roof = new Part(), spire = new Part()

  // --- Dark glass shaft between the end blocks, louvre bands every three floors. ---
  const shaft = rect(-HX, -HY + END, HX, HY - END, 0.6)
  let z = 0
  while (z + H.pitch <= H.crown + 0.1) {
    walls(glass, shaft, z, shaft, z + H.pitch - H.band)
    walls(white, shaft, z + H.pitch - H.band, shaft, z + H.pitch)
    z += H.pitch
  }
  walls(glass, shaft, z, shaft, H.crown)

  // --- White braced end blocks (NE and SW), the frame on their outer faces. ---
  for (const s of [1, -1]) {
    const y0 = s > 0 ? HY - END - 0.3 : -HY, y1 = s > 0 ? HY : -HY + END + 0.3
    block(white, rect(-HX, y0, HX, y1, 0.6), 0, H.ends, { bev: 0.6, topPart: roof })
    // the braced face: two columns of glass bays either side of the central mullion
    const yf = s * (HY + 0.06)
    const P = (x: number, zz: number): V3 => [x, yf, zz]
    const quad = (part: Part, a: V3, b: V3, c: V3, d: V3) => (s > 0 ? part.quad(a, b, c, d) : part.quad(b, a, d, c))
    const bays = 8, zb0 = 3, zb1 = H.ends - 3, bh = (zb1 - zb0) / bays
    const xo = HX - 2.6, xm = 0.9 // frame border and half the central mullion
    for (let k = 0; k < bays; k++) {
      const za = zb0 + k * bh + 0.8, zc = zb0 + (k + 1) * bh - 0.8
      for (const side of [-1, 1]) {
        const xa = side < 0 ? -xo : xm, xc = side < 0 ? -xm : xo
        // glass, drawn left to right as seen from outside (+y face: x decreasing)
        if (s > 0) quad(glass, P(xc, za), P(xa, za), P(xa, zc), P(xc, zc))
        else quad(glass, P(xc, za), P(xa, za), P(xa, zc), P(xc, zc))
        // the diagonal: from the top at the mullion down to the outer bottom corner (a Lambda per bay)
        const top: [number, number] = [side * xm, zc], bot: [number, number] = [side * xo, za]
        const dx = bot[0] - top[0], dz = bot[1] - top[1], l = Math.hypot(dx, dz), w = 0.75
        const nx = (-dz / l) * w, nz = (dx / l) * w
        const d = (x: number, zz: number): V3 => [x, yf + s * 0.08, zz]
        const a = d(top[0] - nx, top[1] - nz), b = d(top[0] + nx, top[1] + nz), c = d(bot[0] + nx, bot[1] + nz), e = d(bot[0] - nx, bot[1] - nz)
        white.tri(a, b, c, undefined, undefined, undefined, [[0, s, 0], [0, s, 0], [0, s, 0]])
        white.tri(a, c, e, undefined, undefined, undefined, [[0, s, 0], [0, s, 0], [0, s, 0]])
      }
    }
    // the canopy ledge over the frame, projecting from the shaft
    const ly0 = s > 0 ? HY - END - 1 : -HY - 2.2, ly1 = s > 0 ? HY + 2.2 : -HY + END + 1
    block(white, rect(-12.5, ly0, 12.5, ly1, 0.8), H.ends, H.ends + 2.6, { bev: 0.5, botBev: 0.5, bottom: true, topPart: roof })
  }

  // --- The silver crown: a slab across the frame faces (29 m wide, photo m2) but
  // thin the other way (photo m3), split by the slot the spire rises from. ---
  block(roof, shaft, H.crown - 0.6, H.crown, { bev: 0, top: true })
  const CX = 14.5, CY = 5.5, SL = 2.6
  block(spire, rect(-CX, -CY, CX, CY, 0.9), H.crown, H.slot, { bev: 0, top: false })
  block(spire, rect(-CX, -CY, -SL, CY, 0.9), H.slot, H.crownTop, { bev: 0.7 })
  block(spire, rect(SL, -CY, CX, CY, 0.9), H.slot, H.crownTop, { bev: 0.7 })
  block(roof, rect(-SL - 0.5, -CY + 1, SL + 0.5, CY - 1, 0.4), H.slot - 0.5, H.slot, { bev: 0.3 })
  // the needle spire, drawn bolder than the real one so it reads on a phone
  mast(spire, [0, 0], 2.5, H.slot - 1, H.tip, 12, 0.2)

  const mats: Swatch[] = [
    { name: 'window', color: 0x5f7790, roughness: 0.3 },
    finish('white-frame', 0xe4e6e9, 0.5),
    PALETTE.roof,
    finish('spire-steel', 0xc9cdd2, 0.4),
  ]
  return [glass, white, roof, spire].map((part, i) => ({ part, material: mats[i] }))
}

if (import.meta.main) {
  await writeModel(ID, 'Millennium Tower', build(), {
    bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: H.tip,
    replaces: ['way/203296254'],
  })
}
