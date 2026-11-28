/**
 * Chicago O'Hare International Airport (ORD): Terminal 1, United's
 * terminal by Helmut Jahn (Murphy/Jahn), 1987. Two freestanding buildings,
 * joined only by the tunnel under the apron, so two models — procedural,
 * CC0-1.0, no textures:
 * - chi-ohare-terminal-1 ("O'Hare Terminal 1 and Concourse B"): Concourse B
 *   with its long glass-and-white-steel barrel vault, the ticketing
 *   pavilion beside it, the curb canopy and the bridge to the ATS station.
 *   Anchor = area centroid of way/163500139 and way/163500101:
 *   -87.9065055, 41.9793163.
 * - chi-ohare-terminal-1-concourse-c ("O'Hare Terminal 1 Concourse C"):
 *   Concourse C on the apron with its own vault. Anchor = area centroid of
 *   the joined ring of relation/13749364: -87.9103406, 41.9787727.
 *
 *   bun generators/chi-ohare-terminal-1.ts
 *
 * Writes models/chi-ohare-terminal-1.glb and
 * chi-ohare-terminal-1-concourse-c.glb (low) and a .detail.glb of each
 * (vault ribs at the real rhythm, every jet bridge leg, mullions). Uses the
 * ORD kit in chi-ohare-terminal-2.ts.
 *
 * Map frame: x and y turned to the bearing 8.5° (y runs along the
 * concourses, x across them, +x toward the landside), z up, metres. Both
 * are built in one shared frame from the old joint anchor (-87.9081459,
 * 41.9790838, the centroid of all three outlines) and moved to their own
 * anchor (ORIGIN_B, ORIGIN_C) as they are written; the lowest point of
 * each is z = 0, the apron.
 *
 * Identity (photos): two long parallel concourses, B against the landside
 * and C out on the apron, each with a glazed barrel vault down its spine
 * between white steel; B's vault, the taller, rises over the ticketing
 * pavilion, a long hall whose roof carries transverse skylight ribs; pale
 * grey and white walls with blue-grey glazing; jet bridges all round.
 *
 * Evidence
 * - OSM (footprints as mapped; no heights): relation/20666733 (Terminal 1,
 *   outer way/163500139: the ticketing pavilion), way/163500101 (Concourse
 *   B), way/1429454968 (building=roof: the curb canopy), way/1511154367
 *   (building=bridge to the ATS station) for Terminal 1 and Concourse B;
 *   relation/13749364 (Concourse C: outer ways 163500103 and 1026852501,
 *   joined) for Concourse C; 54 aeroway=jet_bridge ways drawn, each with
 *   the concourse it leaves from.
 * - Lidar: USGS 3DEP USGS_LPC_IL_4County_Cook_2017_LAS_2019 (2017), 1 m
 *   grid, above the apron (197.9 m; the map's terrain is flat within 1 m),
 *   traced as rectangles in this frame:
 *   Concourse B: gate wings 9.7 m; the concourse 12.8 m (x 97–123); the
 *   vault 12 m wide on a 2.6 m glazed clerestory, crown 18.8 m (y −161 to
 *   210), its ends lower (crown 15.8 m); the north end block 12.3 m;
 *   ticketing pavilion 13.3 m walls, roof 15.7 m, transverse skylight ribs
 *   to 16.7 m every 9.2 m (along-hall section);
 *   Concourse C: 9.8 m; spine 12.2 m; vault 10 m wide crown 15.0 m over the
 *   middle (y −128 to 22), crown 12.2 m over the ends.
 *   Canopy 12.0 m over the upper road; ATS bridge 14.6 m.
 *   The lidar flight (2017) predates Satellite Concourse 1 ("Concourse D",
 *   south-west of C): it is under construction (OSM building=construction,
 *   groundbreaking 2025, opening planned 2028) and is not modelled.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Terminal 1 and Concourse B:
 *   Concourse_B.jpg, commonsabhay, CC BY-SA 4.0 (2021: the pavilion from
 *     the landside: white frame, blue-grey and frosted glass, skylit roof);
 *   Concourse_B,_Chicago_O'Hare_airport.jpg, Dllu, CC BY-SA 4.0 (inside:
 *     vault form, white perforated steel arches, glass).
 *   Concourse C:
 *   OHareExtView.jpg (Wikimedia Commons, see the credits list): Concourse
 *     C's vaults from the apron, white arches and pale green-blue glass;
 *   Concourse_C_from_1991.jpg, PhillipC, CC BY 2.0 (inside: vault form,
 *     white perforated steel arches, glass).
 *   Both: Chicago_o_hare_delta_N904DA.jpg: B/C vaults beyond T2;
 *   At_Chicago_2024_106.jpg, Mike Peel, CC BY-SA 4.0 (aerial).
 *   USGS NAIP for the plan.
 * - Colours: walls pale warm grey, steel white, vault glass pale blue
 *   (stays dark at night), facade glass mid grey-blue (lit), the
 *   pavilion's frosted glass pale blue-green in two tiers (lit), roofs grey.
 *
 * Estimated: the clerestory and window heights; the vaults' section
 *   (circular-segment; lidar crown and width); rib spacing in the low model
 *   (18 m; the real arches are closer, in the detail model 6 m).
 * Doubts: Concourse C's ends: whether the low 12.2 m crown is a vault or a
 *   flat clerestory (drawn as a low vault). The pavilion's curved landside
 *   eave is drawn square.
 */
import { box, panelRow, writeModel, clean, cap, walls, type XY } from './atl-hartsfield-jackson-domestic-terminal'
import { newParts, body, raised, canopy, bridges, glassVault, materials, clipToRect, type Block, type Parts } from './chi-ohare-terminal-2'
import { Part, type V3 } from './mesh'
import { windowVariant } from './palette'

// OSM data for T1, shared frame (turned to the bearing 8.5): x model east, y model north, metres from the old shared anchor -87.9081459, 41.9790838;
// each model is moved to its own anchor (ORIGIN_B, ORIGIN_C) when written
export const ANCHOR = { lng: -87.9081459, lat: 41.9790838 }
/** Each model's own anchor, in this frame: B = area centroid of way/163500139 and way/163500101; C = of relation/13749364's joined ring. */
export const ANCHOR_B = { lng: -87.9065055, lat: 41.9793163 }, ORIGIN_B: XY = [130.46, 45.49]
export const ANCHOR_C = { lng: -87.9103406, lat: 41.9787727 }, ORIGIN_C: XY = [-174.54, -60.86]
export const OSM: Record<string, XY[]> = {
  'way/163500139': [[163.0,14.0],[163.0,13.5],[162.9,12.8],[162.9,11.9],[162.9,10.6],[162.8,9.4],[162.8,8.2],[162.8,7.5],[162.8,7.0],[162.7,5.6],[162.3,-18.7],[162.3,-19.2],[162.3,-19.9],[162.3,-20.7],[162.3,-21.5],[162.3,-24.3],[162.3,-25.7],[162.3,-25.8],[162.3,-27.4],[162.2,-30.8],[162.2,-31.4],[162.2,-32.0],[162.2,-32.6],[162.1,-33.3],[161.6,-58.0],[161.5,-62.2],[161.5,-62.4],[161.4,-67.0],[160.9,-94.3],[160.7,-98.8],[160.7,-99.1],[160.7,-103.5],[160.8,-108.5],[161.3,-112.7],[153.0,-112.6],[148.7,-112.4],[148.1,-112.4],[144.6,-112.4],[140.4,-112.3],[140.4,-118.3],[140.2,-124.8],[140.5,-128.6],[140.8,-132.2],[142.9,-144.0],[144.3,-148.5],[143.5,-148.5],[137.0,-148.7],[127.7,-148.4],[115.3,-147.9],[116.8,-116.3],[117.0,-111.7],[117.0,-110.8],[117.0,-109.8],[117.0,-109.1],[117.0,-108.4],[117.1,-106.8],[117.1,-102.8],[117.2,-101.2],[117.4,-84.2],[117.6,-76.0],[117.7,-73.8],[117.7,-73.0],[117.8,-70.2],[117.8,-67.0],[117.9,-56.9],[118.2,-42.7],[118.5,-29.3],[118.7,-15.7],[118.8,-11.7],[118.9,-2.7],[119.0,7.5],[119.1,8.4],[119.1,9.1],[119.1,11.3],[119.2,13.6],[119.2,14.4],[119.2,15.2],[119.4,24.9],[119.5,33.6],[119.6,39.0],[119.9,52.3],[120.1,66.0],[120.3,79.3],[120.6,92.9],[120.8,107.0],[121.1,120.4],[121.1,125.0],[121.2,125.4],[121.2,126.1],[121.2,128.7],[121.2,130.5],[121.3,131.3],[121.3,132.0],[121.3,132.9],[121.3,133.7],[122.0,133.7],[135.0,133.6],[143.5,133.5],[151.6,133.4],[157.9,133.4],[165.4,133.3],[165.3,124.2],[165.2,119.6],[165.2,119.5],[165.1,115.0],[164.6,90.9],[164.5,90.2],[164.5,89.4],[164.5,88.6],[164.5,87.9],[164.5,85.0],[164.4,83.3],[164.4,83.3],[164.5,81.9],[164.3,78.8],[164.3,78.1],[164.3,77.4],[164.2,76.7],[164.2,75.9],[163.7,51.8],[163.7,47.0],[163.7,46.8],[163.7,42.3],[163.0,15.7]],
  'way/163500101': [[94.1,-212.3],[93.9,-209.9],[93.9,-208.9],[94.3,-186.6],[94.3,-185.5],[94.4,-183.8],[94.5,-175.7],[94.9,-157.5],[94.9,-155.9],[94.9,-154.4],[95.4,-127.5],[95.5,-122.0],[95.6,-117.5],[95.7,-116.1],[95.7,-114.6],[95.8,-110.0],[95.9,-106.4],[95.9,-105.6],[95.9,-103.1],[96.0,-97.8],[96.3,-80.2],[96.4,-73.9],[96.6,-67.0],[96.7,-59.4],[96.7,-58.0],[96.9,-52.5],[97.1,-47.9],[97.0,-43.3],[97.5,-28.5],[97.6,-21.5],[97.7,-10.9],[97.7,-9.5],[97.7,-8.4],[97.8,-2.7],[98.0,6.6],[79.3,6.7],[79.4,13.7],[79.4,15.5],[79.4,17.5],[98.2,17.2],[98.3,19.8],[90.8,19.9],[90.9,26.7],[98.4,26.7],[98.6,34.7],[98.7,42.4],[98.9,52.5],[98.9,54.0],[99.0,55.5],[99.0,58.9],[99.1,60.1],[99.1,65.8],[99.9,104.6],[100.0,106.1],[100.0,107.8],[100.1,114.8],[100.3,124.3],[100.5,134.6],[100.5,135.9],[100.6,137.2],[100.6,141.7],[100.7,144.3],[100.8,151.7],[101.1,165.1],[101.1,166.1],[101.1,167.2],[101.5,176.7],[101.5,177.6],[101.6,179.9],[101.6,183.5],[101.7,198.2],[102.3,225.5],[102.3,228.4],[102.7,249.0],[102.8,253.6],[103.3,279.4],[103.3,281.1],[103.7,283.4],[104.6,285.8],[106.2,288.4],[106.7,289.0],[108.2,290.9],[110.8,293.1],[112.1,293.5],[113.5,294.0],[113.9,294.2],[114.8,294.5],[116.1,295.0],[121.1,294.9],[125.7,293.3],[128.0,291.7],[128.8,291.1],[131.2,288.5],[132.4,286.5],[132.4,286.3],[132.9,284.2],[132.9,283.4],[133.2,280.6],[168.5,280.2],[172.7,287.6],[166.6,291.5],[171.0,297.6],[175.6,303.5],[177.3,305.6],[183.7,312.1],[193.8,320.5],[206.7,328.5],[211.8,331.2],[215.2,333.0],[217.8,334.4],[221.1,336.1],[226.2,338.8],[239.6,345.9],[242.3,346.6],[245.3,346.4],[247.4,345.7],[249.0,344.6],[249.7,343.7],[250.3,342.8],[251.2,341.2],[251.3,340.2],[251.4,339.3],[251.4,337.9],[250.3,334.8],[247.8,332.2],[244.8,330.6],[239.1,327.6],[222.0,318.7],[221.1,320.1],[215.0,316.6],[211.8,314.6],[200.9,308.2],[197.0,304.9],[193.9,302.3],[185.3,293.0],[178.8,283.9],[173.5,274.0],[170.2,265.9],[168.2,258.2],[166.8,250.6],[165.6,248.1],[164.3,247.1],[162.1,246.9],[160.4,247.4],[159.3,249.3],[159.2,250.9],[153.9,251.2],[138.3,251.4],[133.0,251.5],[133.0,243.2],[132.9,234.7],[132.7,223.6],[132.7,216.3],[132.6,211.3],[132.5,206.0],[123.6,206.2],[121.3,133.7],[121.3,132.9],[121.3,132.0],[121.3,131.3],[121.2,130.5],[121.2,128.7],[121.2,126.1],[121.2,125.4],[121.1,125.0],[121.1,120.4],[120.8,107.0],[120.6,92.9],[120.3,79.3],[120.1,66.0],[119.9,52.3],[119.6,39.0],[119.5,33.6],[119.4,24.9],[119.2,15.2],[119.2,14.4],[119.2,13.6],[119.1,11.3],[119.1,9.1],[119.1,8.4],[119.0,7.5],[118.9,-2.7],[118.8,-11.7],[118.7,-15.7],[118.5,-29.3],[118.2,-42.7],[117.9,-56.9],[117.8,-67.0],[117.8,-70.2],[117.7,-73.0],[117.7,-73.8],[117.6,-76.0],[117.4,-84.2],[117.2,-101.2],[117.1,-102.8],[117.1,-106.8],[117.0,-108.4],[117.0,-109.1],[117.0,-109.8],[117.0,-110.8],[117.0,-111.7],[116.8,-116.3],[115.3,-147.9],[115.1,-155.8],[124.8,-156.1],[124.8,-157.8],[124.7,-166.3],[124.5,-177.0],[124.3,-189.2],[124.1,-202.1],[124.0,-203.5],[124.0,-207.3],[123.9,-209.9],[123.7,-212.9],[123.3,-216.3],[120.9,-220.9],[118.1,-223.8],[114.3,-225.9],[110.2,-226.8],[106.0,-226.7],[103.5,-225.9],[101.5,-225.3],[97.8,-222.0],[97.2,-221.2],[95.7,-219.1],[94.9,-217.1],[94.4,-214.7]],
  'relation/13749364': [[-148.3,-43.3],[-148.3,-45.7],[-149.2,-91.4],[-149.4,-98.4],[-158.4,-98.2],[-158.4,-101.0],[-158.9,-124.0],[-151.9,-124.1],[-150.1,-124.2],[-150.3,-131.6],[-150.3,-132.8],[-150.3,-134.1],[-150.3,-135.1],[-150.5,-143.0],[-150.7,-152.9],[-159.3,-152.9],[-159.5,-161.0],[-159.7,-170.3],[-159.8,-178.6],[-151.3,-178.9],[-151.3,-187.7],[-151.3,-189.0],[-151.4,-190.0],[-151.4,-196.1],[-151.5,-202.4],[-151.5,-207.4],[-160.3,-207.3],[-160.4,-216.4],[-160.6,-223.7],[-160.6,-225.7],[-160.8,-233.2],[-152.2,-233.4],[-152.4,-243.1],[-152.4,-244.2],[-152.4,-245.3],[-152.8,-271.1],[-152.9,-272.2],[-152.9,-273.2],[-153.0,-280.7],[-153.4,-284.0],[-153.8,-285.0],[-154.3,-286.2],[-156.7,-289.8],[-158.2,-291.7],[-161.9,-294.4],[-166.0,-295.9],[-168.4,-296.3],[-173.6,-295.6],[-177.4,-294.3],[-179.5,-292.7],[-180.4,-292.0],[-181.2,-291.3],[-182.3,-290.5],[-184.1,-286.8],[-184.8,-285.3],[-185.3,-284.1],[-185.6,-283.0],[-186.1,-279.8],[-186.3,-274.3],[-186.0,-264.6],[-185.9,-259.2],[-185.9,-257.1],[-185.6,-247.4],[-185.5,-242.6],[-185.5,-241.7],[-185.5,-240.6],[-185.4,-235.1],[-184.5,-201.4],[-184.3,-187.4],[-184.2,-186.6],[-184.2,-185.6],[-183.9,-178.5],[-183.9,-177.4],[-183.8,-176.5],[-183.4,-170.0],[-222.9,-169.0],[-222.5,-143.1],[-222.4,-131.5],[-201.6,-131.9],[-202.0,-118.0],[-202.1,-113.0],[-202.1,-112.0],[-202.1,-111.1],[-202.1,-109.9],[-202.1,-108.9],[-202.1,-107.8],[-202.0,-106.4],[-220.7,-106.1],[-220.0,-82.5],[-219.8,-68.8],[-219.6,-59.1],[-210.4,-59.2],[-201.3,-59.4],[-201.1,-50.8],[-201.0,-46.1],[-201.0,-41.8],[-201.0,-40.7],[-200.9,-39.5],[-200.9,-34.7],[-200.7,-23.7],[-200.7,-22.7],[-200.7,-21.7],[-200.4,3.5],[-200.3,9.3],[-200.3,11.2],[-200.2,15.2],[-200.2,19.1],[-200.1,20.0],[-200.1,21.1],[-200.1,22.5],[-179.7,22.1],[-179.5,30.5],[-179.5,34.2],[-179.4,39.5],[-179.3,48.5],[-179.2,53.2],[-179.0,66.7],[-179.0,67.9],[-179.0,69.1],[-178.9,76.5],[-178.5,100.0],[-178.5,101.3],[-178.5,102.4],[-178.5,103.8],[-178.4,108.6],[-178.4,112.2],[-178.3,121.4],[-178.2,126.1],[-177.9,139.7],[-177.9,140.6],[-177.9,142.0],[-177.5,166.7],[-177.5,167.8],[-177.5,169.0],[-177.4,176.7],[-176.9,179.9],[-176.4,181.2],[-175.8,182.3],[-172.6,187.6],[-170.6,189.3],[-169.3,189.9],[-168.2,190.4],[-160.9,192.4],[-155.7,191.9],[-152.1,190.1],[-150.9,189.5],[-149.9,189.1],[-145.8,184.1],[-144.3,177.9],[-144.4,168.5],[-144.4,167.3],[-144.5,166.0],[-144.8,141.2],[-144.8,139.9],[-144.8,138.8],[-144.9,129.3],[-153.7,129.4],[-153.8,125.9],[-153.9,120.9],[-154.4,103.6],[-145.4,103.2],[-145.6,93.3],[-145.6,92.3],[-145.6,91.2],[-145.8,76.6],[-145.9,74.9],[-154.9,74.9],[-155.0,66.3],[-155.1,57.1],[-155.2,49.2],[-152.8,49.1],[-146.5,48.9],[-146.6,38.9],[-146.6,37.9],[-146.6,36.9],[-146.7,33.6],[-146.8,20.2],[-155.8,20.3],[-156.0,11.8],[-156.2,2.9],[-156.2,-5.4],[-147.7,-5.7],[-148.0,-14.4],[-148.4,-33.0],[-138.7,-33.2],[-138.7,-34.7],[-138.9,-38.4],[-138.9,-41.6],[-139.0,-43.5]],
  'way/1429454968': [[174.6,14.5],[155.6,14.8],[158.1,136.8],[164.8,136.6],[177.0,136.2]],
  'way/1511154367': [[162.8,7.0],[162.8,7.5],[162.8,8.2],[162.8,9.4],[162.9,10.6],[162.9,11.9],[162.9,12.8],[163.0,13.5],[163.0,14.0],[205.1,13.4],[205.1,28.3],[205.8,28.3],[208.7,28.2],[211.9,28.2],[211.5,13.4],[215.2,13.2],[215.2,9.7],[215.2,5.9],[202.6,6.3]],
}
/** aeroway=jet_bridge ways touching the outlines, building end first */
export const JET_BRIDGES: XY[][] = [[[-152.9,-272.2],[-128.6,-274.9]],[[-152.4,-244.2],[-149.9,-243.9],[-139.1,-229.5]],[[-151.3,-189.0],[-148.9,-189.2],[-137.8,-173.8],[-137.7,-171.9]],[[-183.9,-177.4],[-206.6,-177.1],[-223.0,-172.1],[-240.8,-171.8]],[[-185.8,-186.5],[-187.5,-186.5],[-201.8,-183.7],[-220.4,-183.7]],[[-185.4,-235.1],[-205.7,-234.4],[-228.0,-242.4],[-315.0,-240.8],[-315.4,-260.8],[-316.4,-260.9],[-332.5,-269.8]],[[-185.5,-241.7],[-201.8,-241.5],[-217.7,-244.9],[-312.3,-243.6],[-313.8,-280.6],[-314.7,-280.4],[-342.6,-290.5]],[[-185.2,-228.8],[-204.3,-228.4],[-234.2,-239.6],[-314.9,-238.1],[-314.9,-233.8],[-316.0,-233.8],[-330.0,-242.4]],[[-184.2,-186.6],[-185.8,-186.5]],[[-185.8,-186.5],[-185.9,-187.4],[-187.3,-215.0],[-206.9,-214.6],[-207.1,-220.3],[-240.3,-219.8],[-258.0,-230.7]],[[-150.3,-132.8],[-147.5,-132.5],[-140.5,-122.6]],[[-149.2,-91.4],[-143.2,-91.7],[-136.1,-70.8]],[[-148.0,-14.4],[-145.2,-14.5],[-133.3,-1.9]],[[-146.6,37.9],[-145.7,37.8],[-138.7,49.6]],[[-145.6,92.3],[-143.2,93.4],[-133.3,105.5]],[[-144.8,139.9],[-143.1,140.0],[-129.5,150.2]],[[-144.4,167.3],[-141.5,167.2],[-128.8,183.4],[-129.2,186.0]],[[-150.9,189.5],[-129.2,217.3],[-130.7,219.5]],[[-160.9,192.4],[-160.7,206.1],[-156.9,233.3],[-159.3,237.1]],[[-176.4,181.2],[-179.8,182.0],[-178.9,198.5],[-181.4,200.6]],[[-177.5,167.8],[-181.1,168.3],[-195.6,177.2],[-197.2,175.6]],[[-177.9,140.6],[-190.1,141.4],[-203.3,136.9]],[[-178.5,101.3],[-197.4,102.1],[-198.1,99.4]],[[-179.0,67.9],[-183.1,68.4],[-198.4,52.3]],[[-200.1,20.0],[-213.8,24.5],[-240.0,22.5]],[[-200.2,15.2],[-218.8,17.2]],[[-200.7,-22.7],[-221.2,-21.6],[-237.8,-19.2]],[[-201.0,-40.7],[-207.5,-40.0],[-223.9,-41.9],[-225.2,-44.0]],[[-202.1,-108.9],[-226.1,-106.0],[-242.1,-105.7]],[[-202.1,-112.0],[-208.8,-111.7],[-228.6,-112.8]],[[95.7,-116.1],[92.1,-116.0],[70.7,-116.8]],[[94.9,-155.9],[91.3,-155.4],[67.0,-156.2]],[[94.3,-185.5],[90.9,-185.7],[68.7,-196.1]],[[93.9,-209.9],[90.5,-209.9],[70.0,-222.9]],[[103.5,-225.9],[102.7,-227.7],[97.9,-241.0]],[[123.8,-211.5],[126.3,-213.5],[127.5,-229.6]],[[249.7,343.7],[255.7,346.6],[255.3,347.5],[254.4,348.8],[243.1,359.2]],[[216.3,333.5],[203.2,353.5],[200.1,353.0]],[[176.3,304.5],[174.8,306.3],[169.5,317.2],[163.2,346.7],[160.1,346.1]],[[114.8,294.5],[110.4,308.3],[90.4,318.0]],[[112.1,293.5],[111.4,295.0],[97.6,304.8]],[[105.5,287.2],[102.6,289.0],[88.1,289.1],[75.7,288.9]],[[103.9,284.4],[101.8,285.2],[83.9,278.8]],[[102.4,227.1],[81.0,218.4]],[[101.1,166.1],[82.1,165.5]],[[100.5,135.9],[76.3,124.6]],[[100.0,106.1],[78.2,87.5]],[[98.9,54.0],[75.7,45.2]],[[97.7,-9.5],[75.2,-10.0]],[[96.7,-58.0],[72.1,-67.5]],[[251.3,340.2],[262.5,343.5],[302.5,361.4]],[[131.8,287.3],[133.2,288.3],[133.0,290.1]],[[133.0,290.6],[132.5,297.1]],[[133.0,290.1],[133.0,290.6]]]
/** Lidar-traced raised roofs per outline: body height and blocks (rectangle in this frame, height). */
export const REGIONS: Record<string, { body: number; regions: Block[] }> = {
}

const R = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const Z_JB = 3.8, Z_CANOPY = 12.0

/** A vault on a clerestory box between two points along the concourse. */
function vaultRun(P: Parts, a: XY, b: XY, w: number, zBox: number, zSpring: number, rise: number, detail: boolean, ribs: number) {
  if (zSpring - zBox > 0.3) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1] * w / 2, -u[0] * w / 2]
    const ring: XY[] = [[a[0] - n[0], a[1] - n[1]], [b[0] - n[0], b[1] - n[1]], [b[0] + n[0], b[1] + n[1]], [a[0] + n[0], a[1] + n[1]]]
    const r = clean(ring, 0.1)
    walls(P.trim, r, zBox, zSpring)
    for (let i = 0; i < 4; i++) { const p = r[i], q = r[(i + 1) % 4]; if (Math.hypot(q[0] - p[0], q[1] - p[1]) > 20) panelRow(P.win, p, q, zBox + 0.35, zSpring - 0.35, { bay: detail ? 3 : 9, gap: 0.5, end: 0.4, out: 0.06 }) }
  }
  glassVault(P, a, b, w, zSpring, rise, { up: 0.25, detail, rib: ribs })
  if (!detail) {
    // the white arches, every ~18 m, bold enough for the map
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.round(L / 18))
    for (let i = 1; i < k; i++) {
      const t = i / k, c: XY = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
      const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
      glassArch(P, c, u, w, zSpring + 0.25, rise)
    }
  }
}

/** One white arch rib (0.8 m wide, 0.3 m proud) across a vault at c. */
function glassArch(P: Parts, c: XY, u: XY, w: number, z0: number, rise: number) {
  const n: XY = [u[1], -u[0]], seg = 8, half = 0.4, e = 0.3
  const pt = (i: number, s: number, d: number): V3 => { const t = Math.PI * (i / seg); const v = (w / 2 + d) * Math.cos(t); const z = z0 + (rise + d) * Math.sin(t); return [c[0] + u[0] * s + n[0] * v, c[1] + u[1] * s + n[1] * v, z] }
  for (let i = 0; i < seg; i++) {
    P.trim.quad(pt(i, -half, e), pt(i, half, e), pt(i + 1, half, e), pt(i + 1, -half, e))
    P.trim.quad(pt(i, half, e), pt(i, half, 0), pt(i + 1, half, 0), pt(i + 1, half, e))
    P.trim.quad(pt(i, -half, 0), pt(i, -half, e), pt(i + 1, -half, e), pt(i + 1, -half, 0))
  }
}

/** Move a model's parts by -o in the map frame (Part stores glTF x, z = -y), so its own anchor is the origin. */
function shift<T extends { part: Part }>(parts: T[], o: XY): T[] {
  for (const part of new Set(parts.map((q) => q.part))) for (let i = 0; i < part.pos.length; i += 3) { part.pos[i] -= o[0]; part.pos[i + 2] += o[1] }
  return parts
}
/** The jet bridges at each concourse: B's (and the pavilion's) have x > 0, C's x < 0. */
const onB = (l: XY[]) => l[0][0] > 0

/** Terminal 1 and Concourse B: the concourse and its vault, the ticketing pavilion, the ATS bridge and the curb canopy. */
export function buildB(detail: boolean) {
  const P = newParts(), G3 = new Part() // the pavilion's pale frosted glass (lit at night)
  const B = OSM['way/163500101'], HALL = OSM['way/163500139']
  const ribs = detail ? 6 : 18

  // --- Concourse B: gate wings, the concourse, the north block, the vault
  body(P, B, 9.7, { detail })
  raised(P, B, { h: 12.8, rect: R(97, 123, -215, 282) }, 9.7, { wall: P.wall, glaze: [10.2, 12.0], detail })
  raised(P, B, { h: 12.3, rect: R(140, 245, 244, 345) }, 9.7, { wall: P.wall, glaze: [10.2, 11.6], detail })
  vaultRun(P, [110.8, -161], [115, 210], 12, 12.8, 15.4, 3.2, detail, ribs)
  vaultRun(P, [110.3, -212], [110.8, -161], 12, 12.8, 12.95, 2.85, detail, ribs)
  vaultRun(P, [115, 210], [116.2, 278], 12, 12.8, 12.95, 2.85, detail, ribs)

  // --- The ticketing pavilion: glass walls, roof, transverse skylight ribs
  {
    const r = clean(HALL, detail ? 0.4 : 1.6)
    box(P.wall, P.roof, r, 0, 13.3, detail ? 0.4 : 0)
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 10) continue
      // two tiers of pale frosted blue-green glass in the white frame (Concourse_B.jpg)
      panelRow(G3, a, b, 1.0, 6.0, { bay: detail ? 4.6 : 9.2, gap: 0.7, end: 0.6 })
      panelRow(G3, a, b, 7.0, 12.2, { bay: detail ? 4.6 : 9.2, gap: 0.7, end: 0.6 })
    }
    raised(P, HALL, { h: 15.7, rect: R(118, 158, -114, 133) }, 13.3, { wall: P.trim, detail })
    for (let y = -108; y <= 130; y += 9.17) {
      const x0 = 121, x1 = 154, w = 1.6, zt = 15.7, zr = 16.8
      const A: V3 = [x0, y - w, zt], Bp: V3 = [x1, y - w, zt], Cp: V3 = [x1, y + w, zt], D: V3 = [x0, y + w, zt], Ra: V3 = [x0, y, zr], Rb: V3 = [x1, y, zr]
      P.glass.quad(A, Bp, Rb, Ra); P.glass.quad(Cp, D, Ra, Rb)
      P.trim.tri(D, A, Ra); P.trim.tri(Bp, Cp, Rb)
    }
  }

  // --- the ATS bridge and the curb canopy
  {
    const r = clean(OSM['way/1511154367'], 0.4)
    box(P.trim, P.roof, r, 8.6, 14.6, 0.2)
    cap(P.trim, r, 8.6, false)
    for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 10) panelRow(P.win, a, b, 9.4, 13.6, { bay: 6, gap: 0.8, end: 0.6 }) }
  }
  canopy(P, OSM['way/1429454968'], Z_CANOPY, { step: detail ? 14 : 26 })
  bridges(P, JET_BRIDGES.filter(onB), Z_JB, detail)
  return shift([...materials(P), { part: G3, material: windowVariant(3, 0xa9c4c6) }], ORIGIN_B)
}

/** Concourse C, across the apron (reached by the tunnel): gates, spine, vault (taller over the middle). */
export function buildC(detail: boolean) {
  const P = newParts(), C = OSM['relation/13749364']
  const ribs = detail ? 6 : 18
  body(P, C, 9.8, { detail })
  raised(P, C, { h: 12.2, rect: R(-186, -158, -122, 16) }, 9.8, { wall: P.wall, glaze: [10.3, 11.7], detail })
  vaultRun(P, [-166.5, -128], [-164.5, 22], 10, 12.2, 12.2, 2.8, detail, ribs)
  vaultRun(P, [-168.6, -251], [-166.5, -128], 10, 9.8, 9.9, 2.3, detail, ribs)
  vaultRun(P, [-164.5, 22], [-162.2, 145], 10, 9.8, 9.9, 2.3, detail, ribs)
  bridges(P, JET_BRIDGES.filter((l) => !onB(l)), Z_JB, detail)
  return shift(materials(P), ORIGIN_C)
}

if (import.meta.main) {
  const b = { bearing: 8.5, height: 18.8 }, c = { bearing: 8.5, height: 15.0 }
  await writeModel('chi-ohare-terminal-1.glb', "O'Hare Terminal 1 and Concourse B", buildB(false), { ...b, maxTris: 8000, maxBytes: 250_000 })
  await writeModel('chi-ohare-terminal-1.detail.glb', "O'Hare Terminal 1 and Concourse B", buildB(true), { ...b, maxTris: 40_000, maxBytes: 1536 * 1024 })
  await writeModel('chi-ohare-terminal-1-concourse-c.glb', "O'Hare Terminal 1 Concourse C", buildC(false), { ...c, maxTris: 8000, maxBytes: 250_000 })
  await writeModel('chi-ohare-terminal-1-concourse-c.detail.glb', "O'Hare Terminal 1 Concourse C", buildC(true), { ...c, maxTris: 40_000, maxBytes: 1536 * 1024 })
}
