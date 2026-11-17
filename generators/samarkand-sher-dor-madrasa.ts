/**
 * Sher-Dor Madrasa, Registan, Samarkand: procedural, CC0-1.0.
 * bun generators/samarkand-sher-dor-madrasa.ts
 *
 * Built 1619-1636 on the east side of the square, facing Ulugh Beg's, which
 * it mirrors: a pishtaq (famous for its tiger mosaic, "sher" = tiger)
 * between two front minarets, and two fluted turquoise domes on tall drums
 * over the front corners (Wikipedia, "Registan").
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built in true
 * orientation from OSM. The origin is the outline's area centroid; y = 0 is
 * the square's paving. tools/terrain.ts could not check the site (Mapterhorn
 * has no z15 tiles here); the square is flat in every photo, so elevation is 0.
 *
 * Every part is OSM's building:part extruded to its tagged height, except
 * the features the kit draws (see the kit header): minarets, the portal and
 * its iwan arch, the arcades of the front ranges, domes and turrets. The
 * tilework itself is left out (no textures): portals and minarets are a
 * blue-grey mosaic colour, walls a sand brick, domes turquoise glaze.
 *
 * OSM: relation/2437666 (outline with the courtyard) and its parts: the
 * body (relation/17771198, 12 m), the front range (15 m), the portal (30 m),
 * two minarets (31 m), the two dome drums (circles r 4.4 m, 24 m), corner
 * rooms (15 m).
 * Changed from OSM: the domes rise to 25 m (the panorama reads ~25.7 m);
 * the minarets 3.6 m across (OSM 2.8 m).
 * Estimated: the drum and dome profile, the lancet arch (read off the
 * panorama), niche bays.
 * Left out: the tiger-and-sun mosaic and all tile patterns.
 *
 * Photos (Wikimedia Commons):
 * - "Registan 01.jpg", Bernard Gagnon, CC0 (panorama from the south: all three)
 * - "Самарканд. Площадь-Регистан.jpg", Kraftabbas, CC BY-SA 4.0 (night panorama)
 * - "Registan, Samarkand (8590116140).jpg", Aleksandr Zykov, CC BY-SA 2.0
 * - "Sher-Dor Madrasah Samarkand.jpg", Ekrem Canli, CC BY-SA 3.0 (tile colour)
 * - "Ulugh beg Madrasah.jpg", Nassima Chahboun, CC BY-SA 4.0
 * - "Tilya Kori Madrasah (220363333).jpeg", Francisco Anzola, CC BY 3.0
 */
import { writeMadrasa, type MadrasaSpec, type PartData } from './samarkand-ulugh-beg-madrasa'
import type { XY } from './sf-de-young'

const DATA = {"square":[-63.6,-14.2],"outline":[[[[-37.5,23.2],[-37.4,22.8],[-37.1,22.4],[-36.8,22.2],[-36.4,22],[-36,22],[-33.5,9.4],[-36.5,8.8],[-33.5,-5.3],[-30.5,-19.7],[-27.8,-19.1],[-25.4,-31.4],[-25.7,-31.6],[-26,-31.9],[-26.2,-32.3],[-26.2,-32.7],[-26.1,-33.2],[-25.9,-33.5],[-25.6,-33.8],[-25.2,-34],[-24.7,-34],[-24.3,-33.9],[-23.9,-33.6],[-23.6,-33.2],[-23.5,-32.8],[-15.9,-31.3],[7.9,-26.5],[39.3,-20.2],[39.5,-20.6],[39.9,-20.8],[40.3,-21],[40.7,-21],[41.1,-20.9],[41.5,-20.6],[41.8,-20.3],[41.9,-19.8],[41.9,-19.3],[41.7,-18.9],[41.4,-18.6],[41,-18.4],[40.5,-18.3],[30,35.5],[30.4,35.7],[30.7,36.1],[30.8,36.5],[30.8,37],[30.6,37.4],[30.3,37.8],[29.9,38],[29.4,38.1],[29,38],[28.6,37.8],[28.3,37.4],[28.2,37],[28.1,36.6],[-3.3,30.4],[-27.7,25.5],[-35,24.1],[-35.3,24.4],[-35.7,24.6],[-36.2,24.7],[-36.6,24.6],[-37,24.4],[-37.2,24.1],[-37.4,23.7],[-37.5,23.2]],[[-16.5,18.2],[-4,20.6],[8.2,23.1],[20.7,25.5],[24.5,6.5],[25.9,-0.5],[28.3,-12.5],[15.8,-14.9],[3.6,-17.4],[-8.8,-19.8],[-12.5,-1.4],[-16.5,18.2]]]],"parts":[{"id":"way/1296464135","h":31,"rings":[[[[-35.1,22.4],[-34.9,22.7],[-34.7,23.2],[-34.8,23.6],[-35,24.1],[-35.3,24.4],[-35.7,24.6],[-36.2,24.7],[-36.6,24.6],[-37,24.4],[-37.2,24.1],[-37.4,23.7],[-37.5,23.2],[-37.4,22.8],[-37.1,22.4],[-36.8,22.2],[-36.4,22],[-36,22],[-35.5,22.1],[-35.1,22.4]]]],"role":"minaret"},{"id":"way/1296464136","h":31,"rings":[[[[-23.9,-33.6],[-23.6,-33.2],[-23.5,-32.8],[-23.5,-32.3],[-23.7,-31.9],[-24,-31.6],[-24.5,-31.4],[-24.9,-31.3],[-25.4,-31.4],[-25.7,-31.6],[-26,-31.9],[-26.2,-32.3],[-26.2,-32.7],[-26.1,-33.2],[-25.9,-33.5],[-25.6,-33.8],[-25.2,-34],[-24.7,-34],[-24.3,-33.9],[-23.9,-33.6]]]],"role":"minaret"},{"id":"way/1296464137","h":24,"rings":[[[[-27.9,13.5],[-26.8,14.5],[-26.2,15.8],[-26,17.2],[-26.4,18.6],[-27.2,19.8],[-28.3,20.7],[-29.7,21.1],[-31.1,21.1],[-32.3,20.7],[-33.4,19.8],[-34.2,18.7],[-34.5,17.4],[-34.5,16],[-34,14.8],[-33.1,13.7],[-31.9,13],[-30.6,12.7],[-29.2,12.9],[-27.9,13.5]]]],"role":"dome-fluted","base":15,"top":25},{"id":"way/1296464138","h":24,"rings":[[[[-19.4,-29],[-18.4,-28],[-17.7,-26.7],[-17.6,-25.3],[-17.9,-23.9],[-18.7,-22.7],[-19.8,-21.8],[-21.2,-21.3],[-22.6,-21.4],[-23.9,-21.8],[-24.9,-22.6],[-25.7,-23.8],[-26.1,-25.1],[-26,-26.4],[-25.5,-27.7],[-24.6,-28.7],[-23.5,-29.4],[-22.2,-29.8],[-20.7,-29.6],[-19.4,-29]]]],"role":"dome-fluted","base":15,"top":25},{"id":"way/1296464139","h":15,"rings":[[[[-27.7,25.5],[-24.5,10.4],[-23.7,6.5],[-19.8,-12.5],[-19,-16.3],[-15.9,-31.3],[-23.5,-32.8],[-23.5,-32.3],[-23.7,-31.9],[-24,-31.6],[-24.5,-31.4],[-24.9,-31.3],[-25.4,-31.4],[-27.8,-19.1],[-25.2,-18.6],[-25.4,-17.7],[-31.2,9],[-31.4,9.9],[-33.5,9.4],[-36,22],[-35.5,22.1],[-35.1,22.4],[-34.9,22.7],[-34.7,23.2],[-34.8,23.6],[-35,24.1],[-27.7,25.5]]]],"role":"front"},{"id":"way/1296464140","h":15,"rings":[[[[-4.3,22.3],[7.8,24.7],[8.2,23.1],[-4,20.6],[-4.3,22.3]]]]},{"id":"way/1296464141","h":15,"rings":[[[[4,-19],[16.1,-16.6],[15.8,-14.9],[3.6,-17.4],[4,-19]]]]},{"id":"way/1296464142","h":15,"rings":[[[[24.8,13.9],[27.6,-0.2],[25.9,-0.5],[23.1,13.6],[24.8,13.9]]]]},{"id":"way/1297399179","h":30,"rings":[[[[-31.2,9],[-25.4,-17.7],[-22.2,-17],[-23,-13.2],[-19.8,-12.5],[-23.7,6.5],[-27,5.9],[-27.9,9.7],[-31.2,9]]]],"role":"portal"},{"id":"relation/17771198","h":12,"rings":[[[[30.6,37.4],[30.8,37],[30.8,36.5],[30.7,36.1],[30.4,35.7],[30,35.5],[40.5,-18.3],[41,-18.4],[41.4,-18.6],[41.7,-18.9],[41.9,-19.3],[41.9,-19.8],[41.8,-20.3],[41.5,-20.6],[41.1,-20.9],[40.7,-21],[40.3,-21],[39.9,-20.8],[39.5,-20.6],[39.3,-20.2],[7.9,-26.5],[-15.9,-31.3],[-23.5,-32.8],[-23.6,-33.2],[-23.9,-33.6],[-24.3,-33.9],[-24.7,-34],[-25.2,-34],[-25.6,-33.8],[-25.9,-33.5],[-26.1,-33.2],[-26.2,-32.7],[-26.2,-32.3],[-26,-31.9],[-25.7,-31.6],[-25.4,-31.4],[-27.8,-19.1],[-25.2,-18.6],[-25.4,-17.7],[-31.2,9],[-31.4,9.9],[-33.5,9.4],[-36,22],[-36.4,22],[-36.8,22.2],[-37.1,22.4],[-37.4,22.8],[-37.5,23.2],[-37.4,23.7],[-37.2,24.1],[-37,24.4],[-36.6,24.6],[-36.2,24.7],[-35.7,24.6],[-35.3,24.4],[-35,24.1],[-27.7,25.5],[-3.3,30.4],[28.1,36.6],[28.2,37],[28.3,37.4],[28.6,37.8],[29,38],[29.4,38.1],[29.9,38],[30.3,37.8],[30.6,37.4]],[[-16.5,18.2],[-4,20.6],[8.2,23.1],[20.7,25.5],[24.5,6.5],[25.9,-0.5],[28.3,-12.5],[15.8,-14.9],[3.6,-17.4],[-8.8,-19.8],[-12.5,-1.4],[-16.5,18.2]]]]}]} as const

const SPEC: MadrasaSpec = {
  frontTile: true,
  name: "Sher-Dor Madrasa", file: 'samarkand-sher-dor-madrasa.glb', defaultH: 12, minaretR: 1.8,
  portalH: {},
  square: DATA.square as unknown as XY, outline: DATA.outline as unknown as XY[][][], parts: DATA.parts as unknown as PartData[],
}

await writeMadrasa(SPEC, { height: 31 })
