/**
 * The signs of One Astor Plaza, 1515 Broadway (1972; Viacom's, now
 * Paramount Skydance's, headquarters), on the west side of Broadway between
 * West 44th and West 45th Streets, Times Square. Procedural, CC0-1.0.
 *   bun generators/nyc-1515-broadway-signs.ts
 *
 * Signage only. The building stays the map's own OSM extrusion (outline
 * way/157835453 "One Astor Place", no height tag; along Broadway the parts
 * way/258646149 25 m, way/258646153 27 m, way/258646151 29 m and
 * way/258646146 32 m, the tower way/258646147 205 m behind), so the model
 * replaces nothing. The way runs clockwise, so each sign's chain below is
 * taken against it, outside on the right. Every cabinet's back is 0.3 m
 * outside the outline.
 *
 * What is drawn, from the photos:
 * - the big portrait LED screen on the south-east corner (44th St and
 *   Broadway), on the stone block above the corner entrance (p1, p2, p3,
 *   p4): 12.5 m wide along the Broadway face from outline vertex 25, its
 *   cabinet 10.8-26.8 m, 1.5 m deep; the corner entrance's lit marquee under
 *   it (VIACOMCBS in p2/p4, "Paramount" in p5), 7.8-10.6 m;
 * - the Lion King banner on the glass podium's Broadway face (p1, p6, p7;
 *   there since the show moved to the Minskoff in 2006), 16-40 m along the
 *   face from the corner, 11.5-23.5 m, and the Minskoff's tall Lion King
 *   banners at the north end of the glass, 9-21 m;
 * - the band of graphics along the bottom of the glass (CBS NEWS in p1, p6,
 *   p7), 5.0-10.8 m, 13.5-40 m along the face;
 * - the landscape screen on the set-back north end of the Broadway face
 *   (outline vertices 22-23), 4.5-10.5 m (p1);
 * - the Palladium Times Square marquee screen on the stone 44th St face
 *   (p5, p8), 4.6-7.4 m, 18 m long west from the corner entrance.
 * The lettering on these (ViacomCBS, Paramount, CBS NEWS, Palladium, The
 * Lion King) is left off: the names change with the tenants and the shows.
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * middle of the Broadway face, halfway between outline vertices 24 and 25
 * (-73.9859516, 40.7576964); the outline below is the OSM way in that frame
 * (equirectangular about the anchor). y = 0 is the lowest sign's underside,
 * 4.5 m above the street, so the placement carries `elevation` 4.5.
 *
 * Measured: the faces from OSM. The USGS NY_NewYorkCity lidar (2017, 0.5 m
 * grid) puts the Broadway strip's roof at 27-28 m (OSM part 25 m), the
 * podium behind it at 31-37 m and the 45th St side at 40 m; the corner
 * screen's cabinet stops at 26.8 m, under that roof.
 * Estimated, photo-scaled from p1 and p2 with the storefront storey and the
 * glass bays (about 3 m) as the scale: every height and width above, +-1 m;
 * the cabinet depths are invented.
 *
 * Night: every lit face is a `neon-*` block in its own colour: the corner
 * screen and the CBS band white (the corner screen's content changes; most
 * photos catch it pale), the Lion King banner yellow, the Paramount marquee
 * blue, the Palladium marquee and the north screen red. Cabinets and frames
 * are dark. No licensed night photo of this frontage was found; the night
 * look was checked against the Times Square night panorama "Times Square -
 * New York, NY, USA - August 2015 13.jpg" (Giorgio Galeotti, CC BY 4.0),
 * where the neighbouring screens read as the same bold, saturated blocks.
 *
 * Photos (all EVIDENCE):
 * - p1 "Times Sq Nov 2021 116.jpg", Epicgenius, CC BY-SA 4.0: the Broadway
 *   face from the east, corner screen to the Minskoff end.
 *   https://commons.wikimedia.org/wiki/File:Times_Sq_Nov_2021_116.jpg
 * - p2 "Times Sq Nov 2021 114.jpg", Epicgenius, CC BY-SA 4.0: the corner
 *   screen close up, its cabinet and the marquee under it.
 *   https://commons.wikimedia.org/wiki/File:Times_Sq_Nov_2021_114.jpg
 * - p3 "Times Sq Nov 2021 112.jpg", Epicgenius, CC BY-SA 4.0: the corner
 *   screen on the stone block, the tower over it.
 *   https://commons.wikimedia.org/wiki/File:Times_Sq_Nov_2021_112.jpg
 * - p4 "Viacom building.jpg", CC BY 2.0 (Flickr): the corner screen and the
 *   glass podium. https://commons.wikimedia.org/wiki/File:Viacom_building.jpg
 * - p5 "Paramount Skydance One Astor Plaza.jpg", Nielsoncaetanosalmeron,
 *   CC BY 4.0: the corner from 44th St, Paramount marquee, Palladium screen.
 *   https://commons.wikimedia.org/wiki/File:Paramount_Skydance_One_Astor_Plaza.jpg
 * - p6 "Times Sq Nov 2021 124.jpg", Epicgenius, CC BY-SA 4.0: the Lion King
 *   banner and the CBS NEWS band on the glass.
 *   https://commons.wikimedia.org/wiki/File:Times_Sq_Nov_2021_124.jpg
 * - p7 "One Astor Plaza (55283615616).jpg", CC BY 4.0 (Flickr), May 2026:
 *   the whole podium with the corner screen.
 *   https://commons.wikimedia.org/wiki/File:One_Astor_Plaza_(55283615616).jpg
 * - p8 "Times Sq Feb 2022 02.jpg", Epicgenius, CC BY-SA 4.0: the Palladium
 *   marquee screen on the stone wall.
 *   https://commons.wikimedia.org/wiki/File:Times_Sq_Feb_2022_02.jpg
 *
 * Doubts: p7 seems to show the corner screen at the north end of the glass
 * face, against p1-p5, which all put it at the 44th St corner; the model
 * follows those. p5 suggests the corner screen is turned a little toward
 * the south-east, across the corner; it is drawn parallel to the Broadway
 * face. A 2012 night photo ("New York (7131165141).jpg", CC BY 2.0) shows a
 * north-facing screen somewhere on this frontage that the 2021-2026 photos
 * don't; it is left out. The sizes are photo-scaled, not published. The
 * north-end screen's colour is a choice (it shows rotating ads).
 */
import { Part, writeGlb } from './mesh'
import { finish } from './palette'
import { cabinet, type Band, type P2 } from './nyc-marriott-marquis-screen'

/** OSM way/157835453 in the model frame (clockwise; vertex 0 = 38, closed). */
export const ASTOR_OUTLINE: P2[] = [[-95.07, 20.55], [-92.65, 24.83], [-89.83, 23.25], [-85.82, 30.35], [-88.61, 31.91],
  [-90.34, 32.87], [-87.65, 33.60], [-83.32, 34.79], [-71.10, 56.44], [-72.98, 59.44], [-74.93, 62.52], [-72.14, 60.87],
  [-66.54, 70.78], [-62.22, 68.38], [-63.49, 66.13], [-58.00, 63.06], [-56.12, 66.49], [-54.44, 61.08], [-31.20, 48.15],
  [-26.08, 51.56], [-24.03, 51.16], [-20.96, 49.48], [8.14, 33.53], [5.69, 22.33], [11.38, 20.74], [-11.38, -20.74],
  [-18.50, -14.81], [-21.00, -19.44], [-17.75, -21.41], [-18.26, -22.61], [-21.76, -20.79], [-49.48, -6.17],
  [-55.89, -2.79], [-60.12, -0.40], [-57.90, 4.43], [-79.81, 16.63], [-85.33, 13.09], [-84.50, 14.67], [-95.07, 20.55]]

if (import.meta.main) {
  const O = ASTOR_OUTLINE
  const ZB = 4.5 // the lowest sign's underside above the street = the placement's elevation
  const z = (h: number) => h - ZB
  const along = (a: P2, b: P2, d: number): P2 => {
    const l = Math.hypot(b[0] - a[0], b[1] - a[1])
    return [a[0] + ((b[0] - a[0]) / l) * d, a[1] + ((b[1] - a[1]) / l) * d]
  }
  // the Broadway face, north from the 44th St corner (vertex 25 to 24)
  const bway = (s0: number, s1: number): P2[] => [along(O[25], O[24], s0), along(O[25], O[24], s1)]

  const frame = new Part(), white = new Part(), yellow = new Part(), blue = new Part(), red = new Part()
  const flat = (p: Part, rim0: number, rim1: number, h0: number, h1: number): Band[] => [
    { z0: z(h0), z1: z(h0 + rim0), pick: () => frame },
    { z0: z(h0 + rim0), z1: z(h1 - rim1), pick: () => p },
    { z0: z(h1 - rim1), z1: z(h1), pick: () => frame },
  ]

  // the corner screen and the marquee under it
  cabinet(bway(0, 12.5), 0.3, 1.8, z(10.8), z(26.8), flat(white, 0.5, 0.5, 10.8, 26.8), frame)
  cabinet(bway(0, 10), 0.3, 1.5, z(7.8), z(10.6), flat(blue, 0.3, 0.3, 7.8, 10.6), frame)
  // on the glass: the band of graphics low down and the Lion King banner above it
  cabinet(bway(13.5, 40), 0.3, 0.6, z(5.0), z(10.8), flat(white, 0.2, 0.2, 5.0, 10.8), frame)
  cabinet(bway(16, 40), 0.3, 0.6, z(11.5), z(23.5), flat(yellow, 0.2, 0.2, 11.5, 23.5), frame)
  // the Minskoff's tall Lion King banners at the north end of the glass
  cabinet(bway(41, 46.5), 0.3, 0.6, z(9.0), z(21.0), flat(yellow, 0.2, 0.2, 9.0, 21.0), frame)
  // the screen on the set-back north end (vertex 23 to 22)
  cabinet([along(O[23], O[22], 0.6), along(O[23], O[22], 10.9)], 0.3, 1.0, z(4.5), z(10.5), flat(red, 0.3, 0.3, 4.5, 10.5), frame)
  // the Palladium marquee on 44th St, west from the corner entrance (vertex 31 toward 30)
  const p30 = O[30], p31 = O[31], l44 = Math.hypot(p30[0] - p31[0], p30[1] - p31[1])
  cabinet([along(p31, p30, l44 - 18.5), along(p31, p30, l44 - 0.5)], 0.3, 0.9, z(4.6), z(7.4), flat(red, 0.25, 0.25, 4.6, 7.4), frame)

  const parts = [
    { part: frame, material: finish('screen-frame', 0x4a4f57) },
    { part: white, material: finish('neon-astor-white', 0xeef1f5) },
    { part: yellow, material: finish('neon-astor-yellow', 0xf2c230) },
    { part: blue, material: finish('neon-astor-blue', 0x3f6fd6) },
    { part: red, material: finish('neon-astor-red', 0xe0473f) },
  ]
  const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  let top = 0
  for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) top = Math.max(top, part.pos[i])
  const glb = writeGlb('One Astor Plaza Signs', parts, {
    license: 'CC0-1.0', bearing: 0, elevation: ZB, height: top,
    frame: 'Y up, -Z north, +X east, metres; origin at the anchor, y = 0 at the lowest sign underside 4.5 m above the street',
    replaces: [],
  })
  if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/nyc-1515-broadway-signs.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${top.toFixed(1)} m`)
}
