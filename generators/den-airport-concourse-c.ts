/**
 * Denver International Airport (DEN): Concourse C, the northernmost
 * concourse (Southwest's base), with the 1995 core under its stepped glass
 * "ziggurat", the later east wing and the 2022 east gates. The FAA control
 * tower beside its core is its own model (den-airport-control-tower).
 * Procedural, CC0-1.0, no textures.
 *
 *   bun generators/den-airport-concourse-c.ts
 *
 * Writes models/den-airport-concourse-c.glb (low) and .detail.glb, with the
 * kit from den-airport-concourse-a.ts (merges first).
 *
 * Frame: x east, y north, z up, metres, bearing 0. Anchor (-104.672052,
 * 39.863054): the area centroid of OSM way/81294907 (Concourse C).
 *
 * Evidence
 * - OSM: way/81294907 "Concourse C" (aeroway=terminal,
 *   building=transportation, building:levels=2; no parts, no height), 54
 *   aeroway=jet_bridge lines. Footprint as mapped.
 * - Lidar: USGS 3DEP CO_DRCOG_2_2020 (flown 2020), 1 m grid, five tiles.
 *   Heights above the apron (1635.0 m; the map's terrain is flat within
 *   about 1 m):
 *   - the 1995 wings 13.3-13.5 m, flat (no raised spine on C, unlike A and
 *     B), the west end's north strip 10.4 m;
 *   - pods 17.8-18.1 m at x -369..-346, -323..-300, -206..-177, -100..-70,
 *     23..47, 69..92;
 *   - the core: an octagon at the wing height under five glass steps,
 *     16.5, 19.2, 21.6, 24.0 m and a 25.5 m crown;
 *   - the east wing (x 100..405) 12.6-12.8 m with a 16.3 m spine and
 *     20.4-20.6 m blocks at x 186..239 and 354..405;
 *   - x > 405 was a construction site in the flight: the 2022 east gates are
 *     drawn from the photo below at an estimated 14 m with a 19 m glass
 *     block.
 * - NAIP 2019 (USGS, public domain): plan, white roofs, the octagonal
 *   stepped core.
 * - Photos (Wikimedia Commons):
 *   - "DEN Air Traffic Control Tower.jpg", Bmurphy380, CC BY-SA 4.0: C from
 *     the south, from above: cream wings with two teal-grey glass ribbons,
 *     white pods flanked by taupe stair towers, the five-step glass
 *     ziggurat over the core, the tower in front.
 *   - "Denver A Terminal.jpg", TastyPoutine, CC BY-SA 3.0 (despite the name,
 *     C and the tower from the B side): the same facade, closer.
 *   - "Denver International Airport - Colorado (54124034645).jpg", Tony
 *     Webster, CC BY 2.0 (2024): the new C east gates (C68-C71) looking
 *     west: tall glass halls with white fascias and a darker glass block.
 *   - "Southwest 737s in Denver (7921580338).jpg", DearEdward, CC BY 2.0,
 *     and "Denver Airport Control Tower (53910491201).jpg", Tony Webster,
 *     CC BY-SA 2.0: the wing and core from the south-east and south-west.
 *   - "Denver International Airport Concourse C.jpg", Sdkb, CC BY-SA 4.0;
 *     "DIA Concourse C 2026.jpg", ECTran71, CC BY-SA 4.0: inside.
 * - Published: C opened 1995; the east expansion (gates C61-C86) opened in
 *   2022 (DEN).
 *
 * Estimated: glass ribbon heights, the stair towers, the 2022 east gates'
 * heights (photo against the lidar heights of the wing next to them).
 * Night: ribbons, step glass and lit halls are `window`.
 * Doubts: the 2022 east gates' massing (one photo); the north faces are
 * seen only from far off.
 */
import { newParts, materials, layer, spine, pod, ziggurat, chamferRect, clipRect, denJetBridges, plant, writeModel, rect, type XY } from './den-airport-concourse-a'
import { clean } from './clt-terminal'

const C_RAW: XY[] = [[-489, 19], [-489, 15], [-489, -11], [-484, -11], [-464, -11], [-395, -12], [-371, -12], [-371, -15], [-364, -15], [-359, -15], [-359, -21], [-339, -21], [-311, -21], [-311, -17], [-306, -17], [-287, -17], [-249, -18], [-212, -18], [-196, -18], [-196, -29], [-187, -29], [-187, -26], [-176, -26], [-163, -39], [-163, -48], [-155, -48], [-150, -55], [-132, -55], [-125, -48], [-116, -48], [-116, -40], [-105, -28], [-94, -28], [-94, -29], [-84, -30], [-84, -18], [-78, -18], [-58, -19], [-22, -19], [17, -19], [33, -19], [33, -24], [43, -24], [43, -22], [61, -22], [68, -22], [68, -24], [78, -24], [78, -19], [81, -19], [88, -20], [88, -21], [112, -21], [151, -22], [176, -22], [183, -22], [183, -24], [237, -25], [237, -23], [247, -23], [251, -23], [281, -24], [325, -24], [344, -24], [350, -24], [350, -26], [405, -27], [405, -24], [422, -24], [427, -24], [456, -25], [472, -25], [472, -24], [472, -17], [481, -18], [481, -16], [481, -11], [481, 0], [481, 4], [481, 6], [473, 6], [474, 14], [474, 16], [473, 18], [449, 18], [422, 18], [407, 18], [403, 18], [403, 21], [359, 21], [351, 21], [351, 19], [327, 19], [284, 19], [247, 19], [239, 20], [236, 20], [236, 21], [185, 22], [185, 19], [183, 19], [149, 20], [107, 20], [89, 20], [88, 18], [79, 18], [79, 21], [61, 21], [43, 21], [43, 23], [34, 23], [34, 19], [28, 19], [-8, 19], [-30, 19], [-77, 19], [-84, 19], [-83, 29], [-93, 29], [-93, 27], [-104, 27], [-131, 58], [-147, 58], [-175, 30], [-187, 30], [-187, 32], [-196, 32], [-196, 21], [-209, 21], [-222, 21], [-257, 21], [-296, 22], [-313, 22], [-313, 26], [-338, 26], [-358, 27], [-358, 22], [-361, 22], [-371, 22], [-371, 18], [-395, 19], [-444, 19], [-484, 19]]
const C_JB: XY[][] = [[[-484.0, -10.9], [-483.9, -14.9], [-509.7, -14.1], [-509.7, -18.8], [-506.9, -38.6]], [[-488.7, 14.9], [-528.0, 15.4], [-527.9, 20.4], [-533.5, 47.3], [-539.3, 47.4]], [[-463.8, -11.0], [-458.1, -39.4]], [[-395.0, -11.5], [-395.0, -22.4], [-425.4, -21.2], [-425.0, -24.7], [-422.4, -43.0]], [[-363.8, -14.6], [-366.7, -42.3]], [[-306.3, -17.4], [-313.8, -44.2]], [[-287.5, -17.5], [-284.3, -37.2]], [[-249.4, -17.6], [-236.3, -39.0]], [[-211.7, -17.7], [-212.2, -32.3], [-200.7, -63.6]], [[-484.4, 19.2], [-486.4, 40.9], [-495.7, 41.4]], [[-443.7, 19.0], [-446.7, 43.6], [-452.4, 43.8]], [[-395.1, 18.6], [-395.0, 27.3], [-398.0, 44.6], [-410.5, 50.0]], [[-360.7, 21.7], [-357.9, 44.6], [-368.9, 48.1]], [[-296.4, 21.6], [-307.4, 41.5], [-312.9, 42.4]], [[-257.4, 21.3], [-264.5, 46.6], [-270.5, 47.1]], [[-221.8, 21.0], [-223.9, 41.1], [-233.1, 44.2]], [[-208.5, 20.9], [-208.4, 23.6], [-193.7, 44.4], [-197.7, 48.8]], [[-77.6, -18.4], [-77.9, -27.5], [-89.6, -54.6], [-82.1, -61.2]], [[-57.9, -18.5], [-58.2, -23.1], [-46.6, -44.1], [-41.9, -44.9]], [[107.3, 20.0], [107.2, 24.5], [91.7, 44.1]], [[81.5, -19.5], [82.4, -24.4], [68.0, -41.0], [84.9, -58.0]], [[17.0, -18.9], [17.9, -21.0], [34.4, -46.4]], [[-21.5, -18.7], [-21.4, -21.1], [-8.4, -46.1]], [[239.1, 19.6], [237.6, 22.6], [217.0, 42.3]], [[246.4, -41.6], [256.7, -57.9]], [[182.9, 19.5], [184.1, 25.5], [177.9, 42.9]], [[176.4, -22.0], [176.5, -26.1], [187.5, -41.0], [192.0, -41.0]], [[28.1, 18.8], [28.5, 21.2], [33.7, 43.9], [32.3, 46.7]], [[-8.5, 19.0], [-4.6, 43.1], [-10.9, 45.5]], [[-29.6, 19.1], [-40.3, 44.5], [-45.9, 44.8]], [[-77.1, 19.3], [-77.8, 38.9], [-88.0, 42.0]], [[148.7, 19.7], [147.9, 24.6], [131.4, 47.6]], [[111.3, -42.0], [126.9, -57.0]], [[150.7, -42.7], [169.2, -60.1]], [[111.7, -21.4], [111.3, -42.0]], [[150.7, -21.7], [150.7, -42.7]], [[192.0, -41.0], [192.1, -42.9], [209.4, -56.2]], [[251.4, -23.3], [251.7, -27.2], [246.3, -39.6], [246.4, -41.6]], [[472.7, 17.6], [473.7, 18.0], [492.0, 18.0], [484.2, 42.7], [481.6, 43.0]], [[449.2, 17.7], [442.8, 43.2], [439.4, 43.8]], [[406.5, 17.9], [392.2, 41.1], [389.5, 41.3]], [[359.5, 20.8], [350.9, 44.3], [348.0, 44.3]], [[327.1, 19.0], [308.5, 44.5], [305.9, 45.0]], [[283.6, 19.3], [283.7, 22.3], [270.8, 41.3], [268.3, 41.3]], [[456.0, -44.7], [470.0, -58.2], [472.4, -58.3]], [[427.1, -24.2], [426.6, -29.6], [421.5, -41.1], [421.7, -44.2]], [[344.3, -24.1], [344.3, -28.1], [361.5, -42.7], [361.5, -46.1]], [[324.8, -43.9], [338.4, -57.6], [341.1, -57.7]], [[281.2, -43.5], [300.1, -60.6], [303.5, -60.8]], [[280.9, -23.5], [280.7, -41.3], [281.2, -43.5]], [[325.0, -23.9], [324.8, -43.9]], [[361.5, -46.1], [379.2, -57.5], [383.6, -60.4]], [[421.7, -44.2], [431.7, -58.6]], [[455.6, -24.5], [456.0, -44.7]]]

export function buildC(detail: boolean) {
  const p = newParts()
  const ring = clean(C_RAW, 0.6)
  const HW = 13.4, POD = 18.0

  // ── wings: the 1995 part (x < 100) at 13.4, the east wing at 12.7, the 2022 gates at 14
  layer(p, clipRect(ring, -500, -40, -370, 10), 0, HW, 'wing', { detail })
  layer(p, clipRect(ring, -500, 10, -370, 40), 0, 10.4, 'wing', { detail })
  layer(p, clipRect(ring, -370, -60, 100, 60), 0, HW, 'wing', { detail })
  layer(p, clipRect(ring, 100, -40, 405, 40), 0, 12.7, 'wing', { detail })
  layer(p, clipRect(ring, 405, -40, 500, 40), 0, 14.0, 'pod', { detail })
  layer(p, rect(420, -12, 466, 12), 14.0, 19.0, 'pod') // the darker glass block of the new east gates (photo)

  // ── the east wing's spine and blocks (lidar)
  spine(p, 100, 352, -10, 8, 12.7, 16.3)
  pod(p, ring, 110, 150, -11, 4, 12.7, 17.5, { towers: false })
  pod(p, ring, 186, 239, -14, 20, 12.7, 20.5)
  pod(p, ring, 354, 405, -16, 18, 12.7, 20.4)
  layer(p, rect(183, -25, 232, -14), 12.5, 16.0, 'plain')
  layer(p, rect(350, -27, 405, -16), 12.5, 16.0, 'plain')

  // ── pods on the 1995 wings, with their taupe stair towers
  pod(p, ring, -369, -346, -22, 26, HW, POD)
  pod(p, ring, -323, -300, -21, 26, HW, POD)
  layer(p, rect(-345, -5, -324, 8), HW, 16.2, 'plain')
  pod(p, ring, -206, -177, -29, 31, HW, POD)
  pod(p, ring, -100, -70, -30, 29, HW, POD)
  pod(p, ring, 23, 47, -24, 23, HW, POD)
  pod(p, ring, 69, 92, -24, 21, HW, POD)

  // ── the core: five glass steps over the octagon (lidar)
  ziggurat(p, HW, [
    { r: chamferRect(-166, -32, -110, 32, 14), z: 16.5 },
    { r: chamferRect(-160, -22, -116, 22, 9), z: 19.2 },
    { r: chamferRect(-157, -17, -119, 17, 7), z: 21.6 },
    { r: chamferRect(-153, -13, -123, 13, 4), z: 24.0 },
    { r: rect(-145, -6, -131, 2), z: 25.5 },
  ], detail)

  plant(p, -460, -220, 0, HW, 31, detail)
  plant(p, -40, 90, 0, HW, 32, detail)
  denJetBridges(p, C_JB, detail)
  return p
}

if (import.meta.main) {
  const name = 'Denver International Airport, Concourse C'
  const low = buildC(false)
  await writeModel('den-airport-concourse-c.glb', name, materials(low), { height: 25.5, maxTris: 8000, maxBytes: 250_000 })
  const hi = buildC(true)
  await writeModel('den-airport-concourse-c.detail.glb', name, materials(hi), { height: 25.5, maxTris: 40_000, maxBytes: 1_500_000 })
}
