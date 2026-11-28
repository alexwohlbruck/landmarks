/**
 * London Heathrow Terminal 3 (opened 1961 as the Oceanic Terminal, much
 * rebuilt since: the landside forecourt canopy of 2007, Pier 6 of 2006 for
 * the A380) with its piers 5, 6 and 7 — procedural, CC0-1.0, no textures.
 * bun generators/london-heathrow-terminal-3.ts
 *
 * Writes models/london-heathrow-terminal-3.glb (low) and
 * models/london-heathrow-terminal-3.detail.glb (detail: the whole landmark
 * again, with finer window bands, more rooftop plant and canopy beams).
 *
 * Map frame: x = model east, y = model north, z up, metres. Bearing −34.5°:
 * the main block's walls and Piers 5 and 7 run 34.5° west of north. Anchor:
 * area centroid of the outer ring of OSM relation/18911624. Landside (the
 * forecourt, the central area's car parks and bus station) is +x; Pier 7 is
 * the long finger at x ≈ −320, Pier 5 runs north from the main block at
 * x ≈ −40 and then turns north-west, Pier 6 is the separate diagonal finger
 * to the south.
 *
 * Identifying features (photos): a sprawling, low, flat-roofed terminal of
 * many wings rather than one form; a taller main block with flat grey roofs
 * and rooftop plant; long narrow piers with pale eave bands and glazed gate
 * floors over the apron; the 2007 landside forecourt: a
 * long canopy of glass on a grid of steel beams and slender posts in front of
 * the dark glass departures facade.
 *
 * Evidence
 * - OSM: relation/18911624 (Terminal 3, building=airport_terminal,
 *   multipolygon: outer way/151749316, inner way/1372773206, a small
 *   courtyard, covered over here); way/42432280 (Terminal 3, Pier 6);
 *   way/722642847 (building=roof: the forecourt canopy, x 78.4…109.4,
 *   y −184.7…−49.6 here, which places it) and way/446320645 (a small
 *   service kiosk under it). No heights, no building:parts.
 * - Published: opened 1961 (as the Oceanic Terminal), renamed Terminal 3 in
 *   1968; Pier 6 opened 2006; forecourt redevelopment 2007 (Wikipedia,
 *   "Heathrow Terminal 3").
 * - Photos:
 *   https://commons.wikimedia.org/wiki/File:Heathrow_Airport_Terminal_3_from_the_air_-_geograph.org.uk_-_5145243.jpg
 *     and https://commons.wikimedia.org/wiki/File:Heathrow_Airport_Terminal_3_from_the_air_-_geograph.org.uk_-_5145240.jpg
 *     (Thomas Nugent, CC BY-SA 2.0) aerials from the south: the low flat
 *     grey roofs of the piers and main block, with the control tower;
 *   https://commons.wikimedia.org/wiki/File:Heathrow_Airport_Terminal_3_(August_2023)_01.jpg
 *     (DiscoA340, CC BY-SA 4.0) the departures facade and forecourt canopy;
 *   https://commons.wikimedia.org/wiki/File:Forecourt_of_Heathrow_Terminal_3_(geograph_6090219).jpg
 *     (David Martin, CC BY-SA 2.0) under the forecourt canopy: its glass,
 *     beams and posts;
 *   https://commons.wikimedia.org/wiki/File:Heathrow_Airport_-_Terminal_3_%5E_Air_Traffic_Control_Tower_-_geograph.org.uk_-_5566650.jpg
 *     (Richard Cooke, CC BY-SA 2.0) the airside face beside the tower.
 * - No lidar.
 *
 * Review round 1: roofs lightened to the pale grey of Nugent's aerials;
 * jet bridges added along Piers 5, 6 and 7 (positions read from Nugent's
 * aerials, which show stands along both sides of Piers 5 and 7; Pier 6's
 * four at the stubs OSM draws on its south-west side; spacing about 48 m,
 * estimated); pale rooftop plant clusters; the piers' gate floors drawn as
 * one near-continuous glazing band.
 * Numbers (all estimated from the photos, against jet bridges at 5–8 m and
 * the 87 m control tower): piers and low wings 13 m; the main block 21 m;
 * rooftop plant 3 m high (placed, not measured); the forecourt canopy 12 m high (its plan is OSM's
 * way/722642847); window bands two
 * storeys high on the piers' gate floors.
 * Doubts: Terminal 3 is a patchwork of 1961–2007 wings whose heights vary
 * more than drawn here; the courtyard (OSM inner ring) is roofed over; the
 * jet bridges' exact positions and count are estimated from the aerials.
 */
import { type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Facade, quadN } from './nyc-570-lexington'
import { zoneMass, simplify, prismRing, newMats, writeLod, drum, beam, inside, type Zone, type Mats } from './tokyo-haneda-terminal-1'
import { LHR } from './london-heathrow-terminal-5'

/** OSM relation/18911624, outer way/151749316, in this frame (bearing −34.5, anchor −0.4597941, 51.4710936). */
const T3: XY[] = [[-67.6,-137.2],[-139.7,-135.4],[-139.5,-117.4],[-193.8,-116.8],[-194.3,-97.3],[-317.9,-96.9],[-317.9,-143.9],[-318.0,-160.0],[-306.0,-160.3],[-306.4,-190.3],[-306.4,-197.3],[-318.0,-197.4],[-318.7,-194.3],[-324.1,-193.8],[-324.3,-188.4],[-336.5,-187.4],[-335.3,-137.5],[-325.0,-138.3],[-325.3,-111.8],[-336.0,-111.4],[-335.8,-69.8],[-335.8,-61.8],[-324.4,-62.3],[-325.1,-35.5],[-335.9,-34.9],[-335.5,6.2],[-335.4,14.8],[-323.7,14.6],[-323.8,41.7],[-335.7,41.5],[-335.3,82.5],[-335.2,90.6],[-323.5,91.3],[-322.9,117.5],[-336.2,118.4],[-335.5,158.9],[-335.4,167.8],[-324.0,168.0],[-323.9,181.1],[-325.3,181.7],[-324.8,186.7],[-316.8,186.5],[-316.3,179.5],[-305.2,179.1],[-305.2,176.8],[-305.2,174.9],[-305.4,129.9],[-316.7,129.9],[-316.5,102.6],[-305.7,102.4],[-305.6,63.5],[-305.5,54.0],[-316.3,53.4],[-316.5,26.4],[-305.8,26.2],[-306.4,-12.1],[-306.6,-21.7],[-317.3,-21.6],[-317.8,-86.9],[-134.3,-87.2],[-133.8,-56.2],[-42.1,-56.9],[-42.8,-19.3],[-39.2,-19.4],[-39.2,-2.2],[-45.4,-1.9],[-68.9,-2.0],[-68.7,22.1],[-50.7,22.1],[-50.6,35.6],[-52.7,35.7],[-52.7,39.7],[-39.4,39.8],[-39.7,65.6],[-69.7,66.3],[-69.2,91.1],[-57.2,90.7],[-57.2,93.2],[-50.7,93.3],[-50.5,106.0],[-53.1,106.0],[-52.9,110.1],[-51.7,110.4],[-51.8,119.9],[-40.4,119.9],[-41.0,139.5],[-52.4,140.2],[-52.4,137.4],[-65.1,137.1],[-65.3,140.4],[-69.5,140.6],[-69.4,161.5],[-58.3,161.3],[-58.3,164.6],[-38.9,163.5],[-40.3,178.1],[-51.0,178.2],[-51.3,191.4],[-48.5,191.3],[-48.5,196.6],[-39.6,196.6],[-39.7,215.1],[-52.0,215.7],[-52.0,221.6],[-60.8,222.0],[-59.7,229.5],[-56.9,229.5],[-56.7,231.7],[-49.9,231.3],[-49.9,244.3],[-52.3,244.6],[-52.2,248.5],[-48.8,248.5],[-50.5,291.0],[-58.7,291.6],[-58.9,298.6],[-41.8,298.4],[-38.4,298.4],[-39.6,328.2],[-44.7,329.0],[-45.2,337.0],[-54.5,336.7],[-61.2,341.3],[-61.5,369.3],[-76.4,380.5],[-107.4,405.3],[-122.5,382.2],[-161.2,408.8],[-159.9,410.5],[-173.7,420.4],[-165.6,433.9],[-175.6,441.2],[-173.1,445.7],[-147.4,428.9],[-141.1,438.2],[-129.5,455.8],[-143.5,465.4],[-145.7,462.6],[-149.2,465.4],[-144.4,472.7],[-140.3,469.7],[-134.6,477.8],[-139.2,495.0],[-137.1,497.4],[-134.7,488.9],[-132.6,489.5],[-128.8,477.4],[-136.4,466.5],[-126.7,459.9],[-126.2,460.8],[-109.7,449.4],[-101.3,461.7],[-106.7,465.7],[-105.0,468.8],[-93.7,460.9],[-94.9,459.2],[-98.6,461.7],[-107.8,448.1],[-87.8,434.3],[-102.7,412.4],[-76.7,391.5],[-41.1,364.4],[-33.5,358.9],[-33.1,392.8],[-25.1,392.9],[-25.4,353.5],[-23.7,352.6],[-19.2,349.3],[-14.1,345.6],[-14.1,337.3],[-14.6,317.9],[-14.8,314.8],[-18.0,314.4],[-17.9,306.2],[-11.5,305.8],[-11.6,302.6],[-15.6,302.9],[-16.0,274.0],[-7.8,273.6],[-8.0,267.4],[-12.8,267.4],[-12.8,263.2],[-20.3,263.1],[-20.2,249.8],[-16.1,249.8],[-16.2,244.5],[-10.2,244.3],[-10.4,240.3],[-16.4,240.4],[-15.8,203.5],[-7.5,203.4],[-7.4,197.4],[-12.3,197.5],[-11.9,191.8],[-20.6,192.0],[-20.2,179.1],[-6.5,178.8],[-1.5,169.8],[58.0,168.3],[78.6,133.9],[-15.3,133.8],[-15.2,130.2],[-15.0,124.6],[-18.9,124.6],[-28.9,124.6],[-29.1,63.3],[-15.6,63.0],[-15.6,94.7],[-9.1,94.6],[-9.2,93.1],[-2.1,93.0],[-1.5,115.7],[112.1,114.9],[112.1,115.8],[175.7,115.9],[185.0,115.9],[185.0,101.2],[185.0,96.3],[187.4,96.3],[187.6,83.8],[185.1,83.7],[185.4,66.8],[193.4,67.0],[193.5,60.2],[196.9,57.8],[222.7,57.9],[222.8,49.7],[234.0,49.8],[234.1,27.4],[234.2,8.5],[249.0,8.5],[292.2,8.4],[292.1,-21.5],[249.8,-21.1],[191.2,-20.4],[191.1,-32.3],[191.0,-40.8],[186.0,-40.8],[182.9,-40.8],[174.4,-40.8],[161.4,-40.8],[159.9,-40.8],[150.7,-40.8],[141.9,-40.7],[133.0,-40.7],[123.2,-40.7],[114.8,-40.6],[110.0,-40.6],[93.1,-40.6],[93.0,-40.6],[88.1,-40.6],[86.5,-40.6],[78.6,-40.6],[78.6,-49.6],[78.6,-55.7],[78.6,-58.2],[78.6,-73.2],[78.6,-81.0],[78.6,-83.6],[78.6,-93.5],[78.6,-100.6],[78.6,-102.5],[78.6,-121.1],[78.5,-134.1],[78.5,-141.5],[78.5,-145.5],[78.4,-152.1],[78.4,-163.1],[78.4,-165.6],[78.5,-179.8],[78.5,-184.5],[91.4,-184.6],[109.4,-184.7],[141.0,-184.6],[161.6,-184.7],[161.0,-228.7],[77.2,-230.2],[76.6,-238.7],[64.9,-236.3],[70.4,-229.9],[43.6,-229.4],[43.0,-236.7],[5.3,-236.6],[5.3,-264.3],[-26.8,-264.5],[-57.9,-243.2],[-51.0,-233.8],[-51.2,-220.1],[-57.1,-219.3],[-57.5,-221.6],[-62.9,-220.8],[-63.0,-215.1],[-66.0,-214.4],[-65.5,-199.0],[-77.2,-198.7],[-77.4,-203.1],[-86.1,-203.1],[-86.0,-187.9],[-77.2,-188.1],[-77.2,-195.4],[-56.0,-196.0],[-66.2,-168.9],[-66.2,-158.5],[-66.2,-152.9],[-69.7,-152.7],[-69.8,-164.5],[-74.3,-164.4],[-74.2,-147.7],[-71.7,-147.8],[-71.8,-150.1],[-65.9,-150.7],[-65.8,-145.5],[-66.0,-141.6],[-67.6,-141.1]]
/** OSM way/42432280 (Pier 6). */
const PIER6: XY[] = [[-26.8,-264.5],[145.7,-381.2],[134.5,-397.8],[127.9,-407.2],[120.9,-417.3],[113.5,-412.2],[126.9,-392.5],[60.2,-347.3],[54.6,-355.7],[46.9,-367.1],[39.9,-362.1],[52.9,-342.2],[-13.8,-297.0],[-19.5,-305.5],[-27.0,-316.6],[-34.2,-311.6],[-21.1,-292.0],[-87.8,-246.7],[-97.6,-261.1],[-101.5,-266.9],[-108.8,-261.8],[-95.5,-241.5],[-82.8,-223.4],[-73.3,-229.9],[-74.5,-231.6],[-57.9,-243.2]]

const H_PIER = 13, H_MAIN = 21

/**
 * Fixed jet bridges along a pier: for each start point (outside the
 * building), march along `inward` until inside the outline; that is the
 * bridge's root on the wall. The bridge runs back out `len` metres to a round
 * cab on a post. Positions come from the aerials (OSM maps none).
 */
function pierBridges(part: import('./mesh').Part, outline: XY[], starts: XY[], inward: XY, o: { len: number; z0: number; z1: number; detail: boolean }) {
  for (const s of starts) {
    let p: XY = [s[0], s[1]], k = 0
    while (!inside(p, outline) && k++ < 400) p = [p[0] + inward[0] * 0.5, p[1] + inward[1] * 0.5]
    if (k >= 400) continue
    const root: XY = [p[0] - inward[0] * 0.3, p[1] - inward[1] * 0.3]
    const end: XY = [root[0] - inward[0] * o.len, root[1] - inward[1] * o.len]
    beam(part, root, end, 3.6, o.z0, o.z1, true)
    drum(part, end[0], end[1], 2.3, 2.3, o.z0 - 0.4, o.z1 + 0.5, o.detail ? 12 : 8, part)
    drum(part, end[0], end[1], 0.6, 0.6, 0, o.z0 - 0.4, 6, null)
    if (o.detail) { const mid: XY = [(root[0] + end[0]) / 2, (root[1] + end[1]) / 2]; drum(part, mid[0], mid[1], 0.4, 0.4, 0, o.z0, 6, null) }
  }
}

function build(detail: boolean) {
  const M: Mats = newMats(['wall', 'win', 'roof', 'trim', 'glass', 'dark'])
  // the piers' gate floors: one near-continuous glazing band over the apron-level base
  const PIER: Facade = { bay: detail ? 6 : 9, ratio: 0.95, floor: 3.2, group: 1, spandrel: 0, sill: 1.0, head: 1.6, ground: 6.0, minLength: 8 }
  const MAIN: Facade = { bay: detail ? 9 : 12, ratio: 0.86, floor: 4.0, group: 2, spandrel: 1.6, sill: 1.0, head: 1.8, ground: 5.0, minLength: 8 }
  const body = simplify(T3, 0.8)
  const zones: Zone[] = [
    { rect: [-1000, -1000, 1000, 1000], z: H_PIER, facade: PIER },
    { rect: [-42, -275, 300, 115], z: H_MAIN, facade: MAIN },
  ]
  zoneMass(M, body, zones, { lip: 0.9 })
  zoneMass(M, simplify(PIER6, 0.5), [{ rect: [-1000, -1000, 1000, 1000], z: H_PIER, facade: PIER }], { lip: 0.9 })

  // rooftop plant (detail)
  // rooftop plant: pale clusters on the main block and the wider wings (Nugent's aerials)
  const plant: [number, number, number, number][] = [[100, 60, 14, 10], [200, 70, 12, 8], [-10, -60, 16, 10], [40, 40, 10, 8], [20, -200, 14, 10], [150, -10, 10, 8], [-100, -110, 12, 8], [60, -120, 10, 12]]
  for (const [x, y, w, d] of detail ? plant : plant.slice(0, 6)) {
    prismRing(M.dark, [[x - w / 2, y - d / 2], [x + w / 2, y - d / 2], [x + w / 2, y + d / 2], [x - w / 2, y + d / 2]], H_MAIN, H_MAIN + 3, M.dark)
    if (detail) drum(M.dark, x + w / 2 + 2.5, y, 1.2, 1.2, H_MAIN, H_MAIN + 4.5, 8, M.dark)
  }

  // --- jet bridges along the piers (positions from Nugent's aerials; none are in OSM) ---
  const jb = { len: 22, z0: 4.6, z1: 7.8, detail }
  const along = (x: number, ys: number[]): XY[] => ys.map((y) => [x, y])
  pierBridges(M.dark, body, along(-420, [-170, -122, -74, -26, 22, 70, 118, 166]), [1, 0], jb) // Pier 7, west side
  pierBridges(M.dark, body, along(-250, [-20, 30, 80, 130, 175]), [-1, 0], jb) // Pier 7, east side
  pierBridges(M.dark, body, along(-150, [150, 200, 250, 300, 350]), [1, 0], jb) // Pier 5, west side
  pierBridges(M.dark, body, along(40, [190, 240, 290, 340]), [-1, 0], jb) // Pier 5, east side
  // Pier 6: its four A380 stands, at the stubs OSM draws on its south-west side
  const n6: XY = [0.562, 0.827]
  pierBridges(M.dark, PIER6, ([[113.5, -412.2], [39.9, -362.1], [-34.2, -311.6], [-108.8, -261.8]] as XY[]).map(([x, y]) => [x - n6[0] * 20, y - n6[1] * 20] as XY), n6, { ...jb, len: 26 })

  // --- the landside forecourt canopy: glass on a grid of white beams and posts ---
  {
    const X0 = 79, X1 = 109, Y0 = -184.5, Y1 = -49.8, Z = 12, up: V3 = [0, 0, 1], dn: V3 = [0, 0, -1]
    quadN(M.glass, [X0, Y0, Z], [X1, Y0, Z], [X1, Y1, Z], [X0, Y1, Z], [up, up, up, up])
    quadN(M.glass, [X0, Y0, Z - 0.05], [X0, Y1, Z - 0.05], [X1, Y1, Z - 0.05], [X1, Y0, Z - 0.05], [dn, dn, dn, dn])
    const nb = detail ? 16 : 8
    for (let k = 0; k <= nb; k++) { // cross beams
      const y = Y0 + ((Y1 - Y0) * k) / nb
      prismRing(M.trim, [[X0, y - 0.4], [X1 + 0.6, y - 0.4], [X1 + 0.6, y + 0.4], [X0, y + 0.4]], Z - 1.0, Z + 0.25, M.trim, M.trim)
    }
    for (const x of [X0 + 0.4, X1 + 0.2]) prismRing(M.trim, [[x - 0.4, Y0], [x + 0.4, Y0], [x + 0.4, Y1], [x - 0.4, Y1]], Z - 1.2, Z + 0.3, M.trim, M.trim)
    for (let k = 0; k <= nb; k += 2) drum(M.trim, X1 - 2, Y0 + ((Y1 - Y0) * k) / nb, 0.35, 0.35, 0, Z - 1.0, 6, null)
  }

  return [
    { part: M.wall, material: finish('lhr-t3-panel', 0xd6d3cc) },
    { part: M.win, material: LHR.window },
    { part: M.roof, material: finish('lhr-t3-roof', 0xc9cccc) },
    { part: M.trim, material: LHR.white },
    { part: M.glass, material: PALETTE.glass },
    { part: M.dark, material: finish('lhr-t3-bridge', 0xd4d7d9) },
  ]
}

if (import.meta.main) {
  const extras = { bearing: -34.5, osm: 'relation/18911624', height: H_MAIN + 2.2 }
  writeLod('Heathrow Terminal 3', 'london-heathrow-terminal-3.glb', build(false), extras, 8000, 250_000)
  writeLod('Heathrow Terminal 3', 'london-heathrow-terminal-3.detail.glb', build(true), extras, 40_000, 1_500_000)
}
