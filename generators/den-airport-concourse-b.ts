/**
 * Denver International Airport (DEN): Concourse B, United's hub and the
 * longest of the three (about 1.3 km), with the 1995 core and its ramp
 * control tower, the B east regional wing and the 2018-2022 gate expansions.
 * Procedural, CC0-1.0, no textures.
 *
 *   bun generators/den-airport-concourse-b.ts
 *
 * Writes models/den-airport-concourse-b.glb (low) and .detail.glb. The kit
 * (colours, layers, spines, pods, stepped cores, jet bridges, writer) is
 * imported from den-airport-concourse-a.ts, which merges first.
 *
 * Frame: x east, y north, z up, metres, bearing 0. Anchor (-104.672967,
 * 39.858725): the area centroid of OSM relation/15409558 (outer way/81294927
 * less the inner way/1136411520).
 *
 * Evidence
 * - OSM: relation/15409558 "Concourse B" (aeroway=terminal, building=yes; no
 *   parts, no heights), 116 aeroway=jet_bridge lines. Footprint as mapped;
 *   the small north-east courtyard (the inner ring) is left open.
 * - Lidar: USGS 3DEP CO_DRCOG_2_2020 (flown 2020), 1 m grid, six tiles
 *   along the concourse. Heights above the apron (1636.0 m; the map's
 *   terrain is flat within about 1 m here):
 *   - wings 13.5 m, the clerestory spine 16.8 m (y -6.5..6.5), a raised
 *     spine section 18.3 m at x -604..-541;
 *   - pods across the wing 18.2-18.4 m at x -458..-434, -413..-388,
 *     -296..-226, 96..166, 259..283, 305..329, 412..436; lanterns 21.1-21.2 m
 *     on the two big ones;
 *   - the core: 18.7 m with the stepped glass roof 21.6, 24.0, 26.6 m and a
 *     28 m crown; the cross arms 20.5-23 m;
 *   - the north block 13.5-14.3 m with a 19 m spine and the ramp control
 *     tower (x -70..-54, y 58..72) to 46.5-48.5 m;
 *   - the B east regional wing 6.7 m, its link 10.4-12.3 m.
 *   The flight predates part of the gate expansion: the north-east arm (x
 *   444..651, y 23..48) is missing in it and is drawn at an estimated 13 m
 *   (as the link it hangs off), with a 16 m spine.
 * - NAIP 2019 (USGS, public domain): plan, white membrane roofs, the core.
 * - Photos (Wikimedia Commons, Flickr):
 *   - "Central portion of Concourse B at Denver International Airport
 *     (2021).jpg", Steve Morgan, CC BY-SA 4.0: the core and ramp tower from
 *     the north-west: white panel walls, long teal-grey glass bands, the
 *     tower's tall teal glass panels and its cab under a flat overhanging
 *     roof, the stepped glazed core behind.
 *   - "Denver concourse B west ramp (29657388588).jpg", airbus777, CC BY 2.0:
 *     the B west wing's north face from a gate: cream panels, glass ribbons,
 *     taupe stair towers, jet bridges.
 *   - "Denver Airport Concourse B East (53113489761)", airbus777, CC BY 2.0
 *     (Flickr), and "DIA Concourse B 2026.jpg", ECTran71, CC BY-SA 4.0:
 *     inside, the clerestory spine over the moving walks.
 *   - "Concourse B Denver International Airport 2024.jpg", Larry D. Moore,
 *     CC BY 4.0: a 2022 expansion gate hall (tall glazing, clerestory).
 *   - "2022_08_20_ege-den-sba_048b", Doc Searls, CC BY 2.0 (Flickr): from a
 *     B gate across the ramp to C and the tower (jet bridge massing).
 *   - Shared with C (same design): "DEN Air Traffic Control Tower.jpg",
 *     Bmurphy380, CC BY-SA 4.0 (the pods with taupe stair towers, the glass
 *     ribbons, the stepped core, from above).
 * - Published: Concourse B is United's hub, the longest concourse; the gate
 *   expansion 2018-2022 added gates on B west and B east (DEN, Wikipedia).
 *
 * Estimated: glass ribbon heights and bay widths (photos), the stair
 *   towers (photos), the north-east arm's height (above), the cab and roof
 *   of the ramp tower within its measured top.
 * Night: glass ribbons, clerestories, stepped core glass and the ramp tower
 *   cab are `window` and lit.
 * Doubts: the expansion arm's height; the south face of the east wing is
 *   seen in no licensed close photo; the B east regional wing is plain.
 */
import { Part, type V3 } from './mesh'
import { box, walls, cap } from './atl-hartsfield-jackson-domestic-terminal'
import { newParts, materials, layer, spine, pod, ziggurat, chamferRect, clipRect, slab, denJetBridges, plant, writeModel, rect, inset, type XY } from './den-airport-concourse-a'
import { clean } from './clt-terminal'

// OSM way/81294927 (outer) in the frame; the inner ring and the low north-east
// courtyard buildings round it are cut off along y = 16 and drawn apart.
const B_RAW: XY[] = [[390, 42], [365, 43], [358, 43], [358, 38], [372, 38], [372, 35], [369, 35], [369, 32], [373, 32], [374, 22], [374, 16], [341, 16], [321, 16], [315, 16], [315, 19], [272, 19], [270, 19], [270, 16], [236, 16], [206, 16], [158, 16], [152, 16], [152, 21], [131, 21], [109, 21], [107, 21], [107, 16], [64, 17], [35, 17], [-10, 17], [-10, 28], [-28, 28], [-36, 35], [-36, 95], [-94, 95], [-93, 34], [-100, 28], [-119, 28], [-119, 19], [-120, 19], [-149, 19], [-186, 19], [-218, 19], [-240, 20], [-240, 22], [-262, 22], [-283, 23], [-284, 23], [-284, 20], [-286, 20], [-312, 20], [-351, 21], [-397, 21], [-404, 21], [-404, 25], [-425, 25], [-445, 25], [-447, 25], [-447, 22], [-472, 22], [-510, 22], [-540, 22], [-600, 23], [-623, 23], [-662, 23], [-667, 23], [-666, 14], [-663, 12], [-663, -3], [-666, -5], [-666, -16], [-662, -16], [-643, -16], [-601, -16], [-546, -16], [-514, -17], [-492, -17], [-447, -17], [-447, -23], [-446, -23], [-423, -23], [-404, -23], [-404, -18], [-371, -18], [-339, -19], [-284, -19], [-284, -22], [-283, -22], [-264, -23], [-241, -23], [-241, -19], [-233, -20], [-166, -20], [-119, -20], [-119, -29], [-103, -29], [-89, -42], [-89, -49], [-82, -49], [-75, -55], [-75, -67], [-55, -67], [-55, -55], [-51, -50], [-41, -50], [-41, -41], [-29, -29], [-10, -29], [-10, -24], [-4, -24], [69, -24], [107, -24], [107, -27], [109, -27], [131, -27], [152, -27], [152, -24], [184, -24], [215, -24], [252, -25], [270, -25], [270, -29], [272, -29], [315, -29], [315, -25], [321, -25], [349, -25], [389, -25], [426, -25], [431, -25], [431, -54], [451, -74], [451, -98], [458, -107], [462, -107], [478, -107], [509, -107], [536, -107], [566, -107], [594, -108], [615, -108], [615, -109], [618, -109], [626, -109], [626, -108], [626, -108], [621, -108], [621, -99], [621, -97], [620, -97], [620, -95], [619, -94], [619, -91], [470, -90], [463, -67], [452, -66], [439, -54], [439, -25], [439, -22], [455, -21], [458, -21], [467, 23], [487, 23], [520, 23], [557, 23], [580, 23], [613, 23], [651, 23], [651, 47], [649, 47], [608, 47], [562, 47], [526, 48], [482, 48], [450, 48], [444, 23], [439, 2], [435, 2], [434, 15], [407, 15], [407, 22], [407, 29], [412, 29], [412, 32], [418, 32], [418, 38], [433, 37], [433, 42], [421, 42], [393, 42], [390, 42]]
const B_JB: XY[][] = [[[-662.0, -15.6], [-662.1, -31.6], [-681.4, -31.0], [-692.5, -44.7]], [[-642.5, -15.8], [-642.6, -31.7], [-656.3, -31.6]], [[-601.1, -15.9], [-601.3, -32.1], [-613.6, -32.0]], [[-545.6, -16.4], [-546.0, -36.0], [-570.2, -35.7]], [[-514.0, -33.6], [-519.4, -33.9], [-519.2, -37.0], [-518.6, -63.0]], [[-492.1, -36.3], [-481.7, -56.3]], [[-446.2, -37.1], [-434.1, -63.6]], [[-667.0, 40.6], [-671.0, 48.4], [-678.8, 63.6], [-681.3, 63.8]], [[-616.3, 40.0], [-616.4, 42.2], [-633.5, 54.9], [-636.3, 55.0]], [[-589.1, 39.5], [-597.6, 66.3], [-601.0, 67.1]], [[-539.8, 41.9], [-546.2, 60.8], [-549.0, 61.7]], [[-505.8, 39.0], [-506.4, 62.6], [-508.7, 63.2]], [[-465.4, 38.6], [-464.8, 60.1], [-467.6, 60.9]], [[-445.4, 25.0], [-445.3, 38.6], [-422.8, 38.2]], [[-446.3, -23.1], [-446.2, -37.1]], [[-492.0, -17.1], [-492.1, -36.3]], [[-513.8, -16.9], [-514.0, -33.6]], [[-570.2, -35.7], [-570.1, -38.5], [-565.1, -59.5]], [[-613.6, -32.0], [-612.0, -53.3]], [[-656.3, -31.6], [-653.5, -51.9]], [[-692.5, -44.7], [-692.5, -59.5]], [[-661.7, 23.5], [-661.5, 40.3], [-667.0, 40.6]], [[-622.7, 23.1], [-622.7, 40.3], [-616.3, 40.0]], [[-600.3, 23.0], [-600.5, 39.6], [-589.1, 39.5]], [[-540.1, 22.4], [-539.8, 41.9]], [[-510.5, 22.1], [-510.4, 39.0], [-505.8, 39.0]], [[-472.5, 21.8], [-472.0, 38.8], [-465.4, 38.6]], [[-166.1, -20.0], [-166.3, -35.4]], [[-166.3, -35.4], [-162.9, -37.2], [-149.0, -45.0]], [[-166.3, -35.4], [-167.2, -39.4], [-157.1, -54.9]], [[-233.0, -19.6], [-233.1, -35.3]], [[-233.1, -35.3], [-229.8, -36.2], [-215.5, -48.8], [-212.8, -49.1]], [[-233.1, -35.3], [-235.0, -38.7], [-230.7, -57.8], [-228.2, -59.0]], [[-283.4, -35.9], [-288.4, -35.6], [-289.2, -62.9]], [[-338.8, -35.4], [-334.5, -35.8], [-334.3, -38.5], [-331.3, -60.2]], [[-371.1, -35.2], [-376.3, -35.1], [-376.3, -37.7], [-378.8, -61.1]], [[-397.2, 21.1], [-397.3, 38.3], [-379.1, 37.9]], [[-351.4, 20.6], [-351.6, 37.6], [-340.0, 37.7]], [[-311.7, 20.3], [-311.8, 36.6], [-298.6, 36.9]], [[-282.6, 22.5], [-282.6, 36.8], [-258.1, 36.4]], [[-218.1, 19.4], [-218.2, 36.0], [-210.8, 36.1]], [[-148.6, 18.8], [-148.9, 36.2], [-160.5, 36.3]], [[-120.0, 35.4], [-120.1, 56.7], [-123.1, 57.3]], [[-282.9, -22.4], [-283.4, -35.9]], [[-339.2, -18.6], [-338.8, -35.4]], [[-371.0, -18.2], [-371.1, -35.2]], [[-422.8, 38.2], [-424.2, 59.6], [-427.2, 60.6]], [[-379.1, 37.9], [-378.1, 61.1], [-381.2, 61.6]], [[-340.0, 37.7], [-340.2, 60.9], [-342.5, 61.2]], [[-298.6, 36.9], [-300.1, 46.6], [-301.9, 58.0], [-304.7, 58.3]], [[-258.1, 36.4], [-258.0, 57.3], [-260.6, 58.4]], [[-210.8, 36.1], [-210.9, 58.0]], [[-160.5, 36.3], [-167.4, 57.0], [-170.0, 57.6]], [[-119.9, 18.5], [-120.0, 35.4]], [[-185.6, 36.9], [-185.8, 19.1]], [[215.4, -39.5], [215.4, -42.8], [217.1, -69.9], [219.7, -70.0]], [[184.4, -39.4], [184.4, -39.9], [178.9, -39.9], [176.2, -62.5], [178.8, -63.3]], [[108.7, -39.5], [113.1, -39.5], [113.3, -42.1], [125.7, -70.3], [128.9, -70.8]], [[65.3, -36.7], [62.3, -36.7], [62.4, -45.3], [76.4, -61.4], [77.7, -61.7]], [[65.3, -36.7], [65.2, -41.2], [74.4, -49.7], [77.2, -49.8]], [[-3.9, -23.9], [-3.8, -40.4]], [[-3.8, -40.4], [-0.8, -40.5], [8.0, -49.8], [10.1, -50.1]], [[-3.8, -40.4], [-5.4, -44.8], [5.1, -59.7], [7.7, -60.0]], [[26.7, 34.4], [26.7, 36.9], [8.7, 57.0], [5.9, 57.4]], [[48.8, 57.1], [51.0, 56.9], [63.0, 36.6]], [[90.9, 55.5], [93.4, 55.5], [108.8, 35.2]], [[142.2, 56.3], [145.6, 55.8], [157.5, 34.9]], [[188.5, 56.0], [191.4, 55.5], [206.1, 34.4]], [[225.8, 60.8], [228.8, 60.9], [235.6, 35.1]], [[261.5, 60.9], [264.2, 60.8], [271.7, 34.2]], [[297.1, 55.6], [300.1, 55.9], [313.9, 31.5]], [[333.4, 62.2], [337.0, 62.0], [340.4, 32.3]], [[320.3, -40.1], [320.2, -43.8], [326.2, -67.4], [329.0, -67.6]], [[271.7, -39.8], [271.6, -40.4], [275.4, -40.7], [287.1, -65.0], [289.8, -65.0]], [[252.3, -39.7], [252.3, -43.1], [251.4, -63.8], [254.2, -64.4]], [[69.5, -24.1], [69.4, -36.7], [65.3, -36.7]], [[206.5, 17.2], [206.5, 16.1]], [[235.8, 16.8], [235.8, 16.0]], [[320.5, -24.8], [320.3, -40.1]], [[272.0, -28.7], [271.7, -39.8]], [[252.3, -24.6], [252.3, -39.7]], [[215.5, -24.5], [215.4, -39.5]], [[184.2, -24.4], [184.4, -39.4]], [[108.6, -27.1], [108.7, -39.5]], [[34.6, 16.6], [34.4, 34.4], [26.7, 34.4]], [[63.0, 36.6], [63.6, 16.5]], [[108.8, 35.2], [109.1, 21.1]], [[157.5, 34.9], [157.8, 16.2]], [[206.1, 34.4], [206.5, 17.2]], [[235.6, 35.1], [235.8, 16.8]], [[271.7, 34.2], [271.7, 19.3]], [[313.9, 31.5], [321.2, 31.2], [321.1, 15.8]], [[388.3, -41.0], [388.2, -44.5], [394.8, -70.7], [397.0, -70.7]], [[425.2, -41.5], [425.0, -45.7], [426.8, -66.9], [429.5, -67.1]], [[349.2, -40.5], [349.2, -43.9], [358.6, -68.0], [361.3, -68.1]], [[592.8, 65.5], [595.6, 65.2], [608.1, 52.9], [608.4, 47.2]], [[632.8, 74.6], [635.7, 74.2], [649.5, 52.6], [649.4, 46.9]], [[630.1, 9.0], [627.3, 8.8], [613.3, 19.9], [613.1, 23.3]], [[599.0, 9.7], [596.6, 9.8], [580.1, 20.1], [580.1, 23.3]], [[545.0, 66.1], [547.8, 66.0], [562.1, 52.5], [562.1, 47.5]], [[502.1, 67.2], [504.9, 66.7], [525.9, 52.9], [526.1, 47.8]], [[483.8, 76.1], [482.9, 73.0], [481.8, 48.1]], [[487.5, 23.5], [487.8, 21.0], [502.2, 8.8], [504.8, 8.6]], [[520.2, 23.4], [520.1, 19.8], [537.2, 7.7], [539.4, 7.7]], [[556.8, 23.4], [556.9, 19.9], [569.5, 7.6], [571.7, 7.5]], [[625.3, -119.7], [621.0, -119.9], [617.6, -109.3]], [[598.6, -118.2], [594.5, -107.5]], [[571.5, -120.1], [568.0, -118.8], [566.0, -107.5]], [[543.6, -117.2], [535.6, -107.3]], [[514.2, -119.0], [511.5, -117.8], [509.3, -107.0]], [[483.4, -120.0], [480.8, -118.5], [478.5, -107.0]], [[459.6, -118.1], [458.1, -116.2], [461.6, -107.0]], [[425.7, -25.2], [425.2, -41.5]], [[388.7, -25.0], [388.3, -41.0]], [[349.1, -24.8], [349.2, -40.5]], [[340.4, 32.3], [340.7, 15.7]]]

function mainRing(): XY[] {
  // start at (374,16) on the courtyard cut, follow the ring west and round to (434,15), close
  const i0 = B_RAW.findIndex(([x, y]) => x === 374 && y === 16)
  const i1 = B_RAW.findIndex(([x, y]) => x === 434 && y === 15)
  const r = [...B_RAW.slice(i0), ...B_RAW.slice(0, i0)]
  const k = r.findIndex(([x, y]) => x === 434 && y === 15)
  void i1
  return clean(r.slice(0, k + 1), 0.6)
}

export function buildB(detail: boolean) {
  const p = newParts()
  const ring = mainRing()
  const HW = 13.5, SP = 16.8, POD = 18.3, CORE = 18.7

  // ── wings at 13.5 to x 439; east of it the B east link, regional wing and the north-east arm
  const main = clipRect(ring, -700, -120, 439, 100)
  layer(p, main, 0, HW, 'wing', { detail })
  layer(p, clipRect(ring, 439, -62, 700, 23), 0, 12.3, 'wing', { detail }) // the link (lidar 12.1-12.3)
  layer(p, clipRect(ring, 439, 23, 700, 60), 0, 13.0, 'wing', { detail }) // the north-east arm (estimated)
  layer(p, clipRect(ring, 439, -120, 700, -62), 0, 6.7, 'plain') // the B east regional wing (lidar 6.7)
  layer(p, rect(458, -100, 474, -66), 6.7, 10.4, 'plain') // its link block (10.4)
  // the courtyard buildings round the inner ring (lidar 4.8)
  for (const r of [rect(358, 16, 378, 43), rect(403, 16, 433, 42), rect(378, 38, 403, 43)]) layer(p, r, 0, 4.8, 'none')

  // ── clerestory spines
  spine(p, -660, -125, -6.5, 6.5, HW, SP)
  spine(p, -5, 435, -6.5, 6.5, HW, SP)
  spine(p, 470, 645, 29, 42, 13.0, 16.0)
  pod(p, ring, -604, -541, -10, 15, HW, POD, { towers: false })

  // ── pods (lidar), each with its taupe stair towers
  pod(p, ring, -458, -434, -23, 27, HW, POD)
  pod(p, ring, -413, -388, -22, 24, HW, POD)
  pod(p, ring, -296, -226, -26, 26, HW, POD, { lantern: [-271, -250, -7, 6, 21.1] })
  pod(p, ring, 96, 166, -29, 22, HW, POD, { lantern: [121, 142, -10, 3, 21.2] })
  pod(p, ring, 259, 283, -29, 19, HW, POD)
  pod(p, ring, 305, 329, -29, 18, HW, POD)
  pod(p, ring, 412, 436, -19, 6, HW, POD, { towers: false })

  // ── the core (lidar): octagon at 18.7, the cross arms, the stepped glass roof
  layer(p, clipRect(ring, -126, -72, -2, 52), HW, CORE, 'pod')
  layer(p, rect(-78, 20, -46, 40), CORE, 22.8, 'tier')
  layer(p, rect(-76, 40, -48, 52), CORE, 20.8, 'tier')
  layer(p, rect(-78, -44, -46, -20), CORE, 23.1, 'tier')
  layer(p, rect(-74, -70, -54, -44), CORE, 21.0, 'tier')
  ziggurat(p, CORE, [
    { r: chamferRect(-90, -22, -38, 20, 6), z: 21.6 },
    { r: chamferRect(-84, -16, -42, 12, 4), z: 24.0 },
    { r: chamferRect(-80, -12, -46, 8, 3), z: 26.6 },
    { r: rect(-72, -6, -56, 2), z: 28.0 },
  ], detail)

  // ── the north block's spine (19) and the ramp control tower (to 47.5)
  layer(p, rect(-70, 52, -54, 92), 14.0, 19.0, 'plain')
  const T = rect(-70.5, 58, -53.5, 72.5)
  box(p.wall, null, T, 19.0, 40.6, 0)
  // the tall teal glass panels on its faces (photo), two per face, with white piers
  for (let i = 0; i < 4; i++) {
    const a = T[i], b = T[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * 0.05, a[1] + u[1] * s + n[1] * 0.05, z]
    for (const [s0, s1] of [[1.2, L / 2 - 0.6], [L / 2 + 0.6, L - 1.2]]) p.win.quad(P(s0, 27.5), P(s1, 27.5), P(s1, 37.8), P(s0, 37.8))
  }
  walls(p.wall, T, 40.6, 41.2)
  walls(p.win, inset(T, -0.35), 41.2, 44.6) // the cab
  slab(p.wall, inset(T, -1.3), 44.6, 45.8) // its overhanging roof
  box(p.wall, p.roof, inset(T, 3.5), 45.8, 47.5, 0.2) // the plant room on top (lidar 46.5-48.5)

  // rooftop plant along the wings
  plant(p, -650, -320, 10, HW, 21, detail)
  plant(p, 180, 420, -11, HW, 22, detail)

  denJetBridges(p, B_JB, detail)
  return p
}

if (import.meta.main) {
  const name = 'Denver International Airport, Concourse B'
  const low = buildB(false)
  await writeModel('den-airport-concourse-b.glb', name, materials(low), { height: 47.5, maxTris: 8000, maxBytes: 250_000 })
  const hi = buildB(true)
  await writeModel('den-airport-concourse-b.detail.glb', name, materials(hi), { height: 47.5, maxTris: 40_000, maxBytes: 1_500_000 })
}
