/**
 * DFW Airport Terminal C — procedural, CC0-1.0, no textures.
 *
 *   bun generators/dal-dfw-terminal-c.ts
 *
 * DFW Airport Terminal C (1974; TRIP renewal, interiors renewed again for
 * the gates in use today; American's planned rebuild of C has not changed
 * the shell), east side, middle. Anchor -97.036832 32.8977923: area
 * centroid of way/25487580 "Terminal C" (the outline of the type=building
 * relation/6682955, whose parts are listed in `replaces`).
 *
 * Built with the kit in dal-dfw-terminal-a.ts (that file merges first): the
 * OSM outline extruded in wedge zones to the side-strip height, raised roof
 * bands read off the lidar across the band (depths from the airside face),
 * the two Skylink stations (2005) as raised white halls on columns over the
 * track with arched roofs, glass tiers, a canopy band and end cores, and the
 * OSM jet bridges. The Skylink track and the roads are not modelled.
 * Writes the low model and a .detail.glb (cabs and posts, mullion groups,
 * pale plant clusters, spine skylights, stepped curb piers and canopy,
 * station roof ribs). Glass is the palette's slate `window` (dark-tinted in
 * every photo); the stations have shallow barrel roofs with deep eaves.
 *
 * Frame: x east, y north, z up, metres, bearing 0. Lidar: USGS 3DEP
 * TX_Pecos_Dallas_B3_2018 (flown 2018), 1 m grid, read every 3 degrees
 * round the loop (work/dfw/sp-*.png against this spec). Colours from NAIP
 * (roof median #beb6aa inside the outline, pulled light) and the photos;
 * shared with A, B, C and E.
 *
 * Measured (lidar, above the apron at 175.4 m): side strips 10–11 m, the
 * south wing 7 m; the spine 14 m at 6–27 m in; the middle third's landside
 * block 16 m and the headhouse 18 m; the stations 20–25 m. Ground: the
 * apron 1.4 m above the lowest ground under the footprint (174.0 m).
 * Photos: https://commons.wikimedia.org/wiki/File:DFW_Terminals_ACD_View_from_Takeoff_(52831109800).jpg
 *   (formulanone, CC BY-SA 2.0, 2021) C's south end from the east: the
 *   long station box beside the track, the tan stepped roofs with plant,
 *   the white-faced spine, tan walls; compared in work/dal-dfw-terminal-c;
 *   https://commons.wikimedia.org/wiki/File:American_Airlines_Boeing_737_at_Terminal_C.jpg
 *   (MackenzieKram, CC BY-SA 4.0, 2019) the north station at C10–C11;
 *   https://www.flickr.com/photos/18583359@N00/79879678 (notdavidbrooks,
 *   CC BY 2.0) the station roof from the landside;
 *   https://commons.wikimedia.org/wiki/File:Skylink_at_Terminal_E.jpg
 *   (Baseball Watcher, CC BY-SA 4.0) the same station type.
 * Estimated: glazing bays, station tiers, plant.
 * The white tensile sail canopy at the curb (formulanone 2021, lower right)
 * is drawn although OSM doesn't map it: a two-saddle membrane on three
 * masts, about 40 × 13 m, 6–10 m over the curb, in both LODs. Its size is
 * scaled from the photo against the curb lanes; its position, at the inner
 * curb of C's south third (x 20, y -161) along the curb, is estimated from
 * the photo and a light structure there in NAIP.
 * Doubts: the sail's exact position and shape (one oblique photo); the planned reconstruction of C will make this
 * model out of date when it starts.
 */
import { type TerminalSpec, type XY, writeTerminal, sail } from './dal-dfw-terminal-a'
export { buildTerminal, materials, airsideRef, at, ccw } from './dal-dfw-terminal-a'

// --- generated from OSM (see header): anchor -97.036832 32.8977923
// way/25487580
const RING_25487580 = [[-201.5,253.8],[-167.0,252.7],[-150.0,252.1],[-118.2,252.3],[-85.5,244.4],[-71.2,240.1],[-57.6,236.0],[-35.2,226.6],[-22.6,220.2],[-19.1,218.4],[-13.8,226.5],[-10.7,231.7],[-3.5,238.8],[4.1,233.6],[25.2,215.6],[27.5,218.1],[48.7,198.7],[70.4,178.9],[68.1,176.6],[88.2,157.4],[94.3,149.9],[87.0,142.6],[75.0,133.2],[80.0,126.4],[85.0,118.4],[86.8,114.7],[96.9,96.3],[99.3,91.5],[105.9,76.5],[111.6,59.6],[116.9,42.9],[119.8,22.8],[122.9,-3.4],[123.6,-21.2],[123.9,-33.5],[123.8,-59.2],[121.8,-74.6],[120.2,-82.6],[115.8,-102.8],[109.3,-121.5],[108.4,-123.8],[101.6,-141.5],[93.3,-158.3],[90.5,-163.8],[85.2,-173.4],[74.8,-189.9],[81.0,-195.0],[86.7,-199.2],[93.3,-206.6],[88.0,-211.7],[82.3,-217.8],[80.8,-219.0],[80.4,-219.4],[80.1,-219.7],[66.8,-231.7],[70.0,-235.5],[26.1,-274.8],[22.6,-271.4],[-4.0,-293.4],[-8.2,-292.9],[-13.7,-287.2],[-16.2,-289.5],[-23.4,-277.1],[-32.0,-281.4],[-33.0,-280.0],[-38.9,-284.1],[-61.4,-298.4],[-77.2,-303.1],[-119.0,-303.8],[-161.0,-304.3],[-184.4,-304.1],[-190.3,-306.5],[-184.4,-279.0],[-79.6,-276.6],[-30.5,-246.2],[-35.1,-238.2],[-36.4,-235.8],[-38.8,-231.5],[-25.2,-223.6],[-28.4,-219.4],[-25.3,-217.2],[-29.7,-211.3],[-27.0,-209.4],[-25.4,-208.3],[-22.9,-206.4],[-18.1,-212.5],[-15.0,-210.3],[-12.1,-214.0],[-3.8,-207.0],[9.5,-195.0],[26.6,-176.3],[37.2,-183.9],[51.6,-164.1],[58.3,-152.5],[64.6,-141.5],[74.8,-119.2],[62.8,-113.8],[65.2,-107.6],[61.1,-106.0],[61.9,-103.4],[54.3,-100.7],[55.0,-98.4],[55.7,-96.6],[56.8,-93.2],[64.4,-95.7],[65.4,-92.2],[70.2,-93.6],[70.5,-92.0],[71.0,-90.1],[66.9,-88.6],[72.5,-63.8],[77.4,-64.4],[77.7,-60.5],[72.4,-59.8],[72.7,-55.5],[78.5,-56.1],[78.8,-52.4],[78.8,-51.2],[79.0,-49.3],[73.5,-48.6],[73.7,-45.5],[68.0,-45.2],[68.3,-11.1],[74.0,-10.7],[73.2,-3.6],[73.0,-1.9],[72.3,4.0],[78.1,4.5],[77.5,8.3],[71.8,7.6],[66.8,32.4],[71.5,33.5],[71.0,35.3],[70.4,37.4],[64.5,35.5],[62.9,41.5],[62.2,44.0],[60.5,50.5],[66.5,52.4],[64.9,57.7],[75.3,62.0],[64.5,84.9],[57.2,97.3],[49.6,110.0],[37.2,127.1],[26.9,119.1],[23.4,123.0],[20.7,120.5],[15.4,126.3],[13.9,128.0],[10.4,131.9],[13.9,135.0],[11.2,138.2],[7.9,134.7],[-11.3,151.8],[-8.2,155.6],[-10.2,157.0],[-11.2,157.8],[-14.6,153.6],[-17.5,155.8],[-23.7,160.7],[-26.5,162.9],[-23.5,167.0],[-27.0,169.6],[-49.3,182.7],[-53.1,184.3],[-55.4,179.2],[-61.7,182.3],[-63.5,183.1],[-69.2,185.9],[-67.5,190.0],[-70.8,191.6],[-72.8,187.4],[-97.0,195.7],[-96.2,200.0],[-97.8,200.4],[-99.2,200.7],[-100.5,195.8],[-109.4,197.9],[-115.7,199.5],[-114.8,204.0],[-119.0,204.9],[-119.7,198.4],[-153.0,202.3],[-225.2,203.0],[-225.2,220.3],[-225.2,223.8],[-225.2,235.8],[-225.2,239.1],[-223.9,239.1],[-223.2,239.1],[-212.4,239.0],[-211.8,239.0],[-210.6,239.0],[-210.6,234.6],[-201.6,234.4]] as XY[]
const JET: XY[][] = [[[-192.1,-337.5],[-197.0,-311.8],[-184.4,-304.1]],[[-161.0,-304.3],[-143.1,-321.4]],[[-119.0,-303.8],[-118.9,-310.9],[-105.3,-324.9]],[[-94.1,-306.2],[-93.6,-314.8],[-65.2,-327.6]],[[88.0,-211.7],[95.5,-207.2],[116.1,-202.5]],[[90.5,-163.8],[101.8,-169.8],[119.8,-169.0],[130.9,-169.1],[150.9,-156.2]],[[108.4,-123.8],[122.4,-127.5],[144.9,-115.3]],[[121.8,-74.6],[140.2,-75.6],[148.5,-76.0],[177.9,-81.1]],[[123.6,-21.2],[134.0,-19.9],[139.0,-19.4],[166.9,-8.1]],[[116.9,42.9],[121.9,45.6],[130.5,66.0]],[[105.9,76.5],[111.0,78.7],[134.3,89.7],[152.8,99.7]],[[85.0,118.4],[89.1,121.4],[98.4,131.3],[106.2,155.5]],[[78.7,165.9],[82.0,169.1],[82.8,187.5]],[[64.2,180.0],[65.8,181.8],[59.2,205.5]],[[37.3,203.9],[36.3,235.2]],[[4.1,233.6],[8.2,267.2]],[[-22.6,220.2],[-16.8,241.1],[-32.3,272.9]],[[-71.2,240.1],[-67.2,256.0],[-70.9,281.7]],[[-118.2,252.3],[-116.0,273.7],[-100.4,273.1],[-100.5,275.4],[-117.2,294.6]],[[-167.0,252.7],[-166.2,276.9],[-175.8,297.8]],[[134.0,-19.9],[134.0,-15.1],[150.3,11.9]],[[140.2,-75.6],[141.9,-62.2],[149.6,-45.7]],[[-42.4,-276.5],[-38.9,-284.1],[-34.3,-293.7],[-25.4,-320.3]],[[111.0,78.7],[111.0,83.3],[122.5,93.0],[134.4,114.0]]]

export const ANCHOR: [number, number] = [-97.036832, 32.8977923]
export const SPEC: TerminalSpec = {
  id: 'dal-dfw-terminal-c', name: 'DFW Airport Terminal C', height: 26,
  ring: RING_25487580, centre: [-37, -19], ground: 1.4,
  thRange: [-130, 130], holes: [[54, 86], [-88, -55]],
  zones: [{ th: [-130, -88], h: 7 }, { th: [-88, 0], h: 10.5 }, { th: [0, 130], h: 11 }],
  bands: [
    { th: [87, 110], d: [9, 36], h: 14.5 },
    { th: [-40, 30], d: [6, 27], h: 14 },
    { th: [-82, -55], d: [30, 45], h: 14 },
    { th: [-35, 30], d: [27, 50], h: 16, face: 'wall' },
    { th: [-14, 0], d: [40, 54], h: 18, face: 'wall', glaze: true },
  ],
  stations: [
    { th: [56, 85], d: [-21, -1], hEdge: 17, hCrown: 24.5, core: 2 },
    { th: [-87, -57], d: [-21, -1], hEdge: 17, hCrown: 24.5, core: 2 },
  ],
  jets: JET,
  // The white tensile sail over the curb (formulanone 2021; not in OSM): two
  // saddles on three masts, about 40 × 13 m, 6–10 m over the curb, which
  // lies about 1.2 m under the apron. Position estimated: the light
  // structure at the inner curb of C's south third in NAIP, along the curb.
  extra: (p, detail) => sail(p, [20, -161], [0.62, 0.79], 40, 13, 1.4 - 1.2 + 8.0, 2.2, 0, detail),
  plant: [{ th: [-50, 50], d: [30, 40], h: 11 }],
}

if (import.meta.main) await writeTerminal(SPEC)
