/**
 * Salk Institute for Biological Studies, La Jolla — 10010 North Torrey Pines Road.
 *
 * Louis Kahn, 1965. Two mirror-image laboratory blocks of board-formed
 * concrete either side of the travertine courtyard that runs due west to
 * the Pacific. On the courtyard side of each block stands a row of study
 * towers, cut off from the lab by a sunken light court and joined to it by
 * bridges. Each tower's courtyard face carries 45° concrete fins so every
 * study looks west to the ocean, with teak panels on the second and fourth
 * storeys and open, shadowed storeys between. The courtyard, its water
 * channel and the fountain are ground and water, and are left to the map.
 *
 * Frame: bearing 0 (the courtyard axis is within 0.3° of east-west in
 * OSM). +x east, +y north, metres. Origin at the anchor, the centroid of
 * the two lab outlines, on the courtyard axis. z = 0 is the floor of the
 * sunken light courts, the lowest ground the blocks stand on (the map's
 * terrain shows the whole site at this level). Elevation 0.
 *
 * Sources
 * - OSM way/31844744 (north lab block with its study towers, 6 levels,
 *   concrete) and way/31839360 (south block, its mirror). © OSM
 *   contributors, SanGIS import. These two outlines are Kahn's building.
 *   way/31842306 and way/31844209 (h=10), 100 m to the east, are the
 *   later East Building pair across the eucalyptus grove; not modelled,
 *   not replaced.
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014), 0.5 m grid, read in
 *   this frame (heights above ground_min 101.23 m):
 *   light courts 5.6, west terrace 8.0, courtyard 11.7, outside ground
 *   north and south 11.6, lab roof 24.0–24.3, the end bays 25.2, study
 *   tower tops 25.0–25.3, bridges 24.5, service towers 24.2.
 * - USGS NAIP orthophoto (plan, roof, the five towers per side).
 * - Mapterhorn terrain: 2.6 m above its 104.28 m base across the whole
 *   site (= the light courts; it has no courtyard deck).
 * - Wikipedia "Salk Institute for Biological Studies": Louis Kahn,
 *   completed 1965; studies angled to the ocean; teak and concrete.
 * Photos (evidence):
 * - "Salk Institute for Biological Studies and a seagull dllu.jpg",
 *   Daniel L. Lu, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Salk_Institute_for_Biological_Studies_and_a_seagull_dllu.jpg
 *   (two towers face on: fins, teak boxes, open storeys, storey heights).
 * - "Salk Institute Highsmith.jpg" and "Salk Institute 2 Highsmith.jpg",
 *   Carol M. Highsmith, public domain,
 *   https://commons.wikimedia.org/wiki/File:Salk_Institute_Highsmith.jpg
 *   https://commons.wikimedia.org/wiki/File:Salk_Institute_2_Highsmith.jpg
 *   (the tower row in sunlight, concrete colour; the west end from below).
 * - "Salk Institute Panorama.jpg", Gregg M. Erickson, CC BY 3.0,
 *   https://commons.wikimedia.org/wiki/File:Salk_Institute_Panorama.jpg
 * - "Salk Institute 2.jpg", Codera23, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Salk_Institute_2.jpg
 *   (looking west down the courtyard, the two rows mirrored).
 * - "Salk Institute Side Perspective.jpg", David G. Gordon, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Salk_Institute_Side_Perspective.jpg
 * - "Salk institute 2014.jpg", Cristina Bejarano, CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:Salk_institute_2014.jpg
 * - "Louis Kahn's Salk Institute pano.jpg", Jason Taellious, CC BY-SA 2.0,
 *   https://commons.wikimedia.org/wiki/File:Louis_Kahn%27s_Salk_Institute_pano.jpg
 * - "2019 Salk Institute north building north facade.jpg", "… and cafe
 *   from west.jpg", "… from west plaza level.jpg", "… from east.jpg",
 *   Beyond My Ken, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:2019_Salk_Institute_north_building_north_facade.jpg
 *   (outer face: service towers and ribbon glazing; the west end's teak
 *   grid; the towers' west faces; the blank east ends).
 * Look-only: none.
 *
 * Numbers
 * - Plan: lab block x −55.3…55.1, y 26.7…52.4; five service towers on the
 *   outer face, 6.5 m wide, to y 57.5; four full study towers 12.1 m wide
 *   at an 18.3 m pitch plus a half tower at the east, body y 14.2…20.4,
 *   fin tips at y 12.0, fins 2.5 × 2.2 m; bridges 3.4 m wide across the
 *   light court — all OSM (measured).
 * - Heights above the light courts (lidar, measured): courtyard 6.1, lab
 *   roof 18.7, end bays 19.6, study towers 19.5, bridges 18.9, service
 *   towers 18.6.
 * - Tower storeys above the courtyard: four of 3.3 m — scaled from dllu's
 *   photo against the lidar height (estimated). Lab floors and the
 *   interstitial service floors between them: 3.0 m glass bands every
 *   6.2 m (estimated from dllu and Highsmith).
 * - Colours from the daylight photos: concrete warm grey, teak
 *   orange-brown, pulled to the palette's lightness.
 *
 * Doubts
 * - The map's terrain has no courtyard: it shows the whole site at the
 *   light-court level, 6 m below the real travertine. The courtyard is
 *   ground and is not modelled, so on the map the towers' lower storeys
 *   (below the courtyard) show as plain concrete over a sunken court.
 * - The light-court and outer faces of the labs are seen in few photos;
 *   their glazing is drawn as plain bands.
 * - The roof's solar panels (NAIP) are drawn as plain roof.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, rect, qf } from './dc-white-house'
import { pslab, saveModel, type XY } from './dc-nga-west'

const ID = 'sd-salk-institute'

const CONCRETE = finish('salk-concrete', 0xcfc7bc)
const TEAK = finish('salk-teak', 0xc48a55)
const RECESS = finish('salk-recess', 0x6d6964)

const concrete = new Part(), teak = new Part(), win = new Part(), recess = new Part(), roof = new Part()

// Heights (above the light courts).
const Z_COURT = 6.1
const Z_LAB = 18.7, Z_END = 19.6, Z_TOWER = 19.5, Z_BRIDGE = 18.9, Z_SERVICE = 18.6
// Tower storeys above the courtyard: open, teak, open, teak.
const ST = [Z_COURT, 9.4, 12.7, 15.9, 19.0]

/** A panel on a vertical wall from a to b (plan), facing `n`, lifted d off it. */
function wpanel(p: Part, a: XY, b: XY, n: XY, z0: number, z1: number, d = 0.05) {
  const A: V3 = [a[0] + n[0] * d, a[1] + n[1] * d, z0], B: V3 = [b[0] + n[0] * d, b[1] + n[1] * d, z0]
  const C: V3 = [b[0] + n[0] * d, b[1] + n[1] * d, z1], D: V3 = [a[0] + n[0] * d, a[1] + n[1] * d, z1]
  qf(p, A, B, C, D, [n[0], n[1], 0])
}

const LAB = { x0: -55.3, x1: 55.1, yIn: 26.7, yOut: 52.4 }
const SERVICE = [[-40.2, -33.6], [-21.7, -15.3], [-3.5, 3.1], [14.9, 21.6], [33.0, 39.6]]
const TOWERS = [-43.1, -24.7, -6.6, 11.8]
const HALF_TOWER = 30.3

function wing(s: 1 | -1) {
  const Y = (y: number) => s * y
  const out: XY = [0, s] // away from the courtyard
  const inn: XY = [0, -s] // toward the courtyard

  // --- The lab block, its two slightly taller end bays, a bevelled top.
  const yr = (a: number, b: number) => [Math.min(Y(a), Y(b)), Math.max(Y(a), Y(b))] as const
  const [ly0, ly1] = yr(LAB.yIn, LAB.yOut)
  cbox(concrete, rect(-41, 42, ly0, ly1), 0, Z_LAB, { b: 0.35, top: roof })
  cbox(concrete, rect(LAB.x0, -41, ly0, ly1), 0, Z_END, { b: 0.35, top: roof })
  cbox(concrete, rect(42, LAB.x1, ly0, ly1), 0, Z_END, { b: 0.35, top: roof })

  // Lab floors: glass bands between the interstitial service floors, one
  // panel per structural bay, on the outer face between the service towers.
  const bands = [[0.5, 3.4], [6.7, 9.7], [12.9, 15.9]]
  const outerSpans: [number, number][] = []
  let x = LAB.x0 + 1.2
  for (const [a, b] of SERVICE) { outerSpans.push([x, a - 0.8]); x = b + 0.8 }
  outerSpans.push([x, LAB.x1 - 1.2])
  // The outer face is ribbon glazing, recessed between the service towers.
  for (const [a, b] of outerSpans) for (const [z0, z1] of bands)
    wpanel(win, [a, Y(LAB.yOut)], [b, Y(LAB.yOut)], out, z0, z1)
  // Courtyard-side face, in the light courts between the bridges.
  const bridgeX = TOWERS.map((t) => [t + 4.5, t + 7.9])
  const innerSpans: [number, number][] = [[LAB.x0 + 1.2, bridgeX[0][0] - 0.8]]
  for (let i = 0; i < bridgeX.length - 1; i++) innerSpans.push([bridgeX[i][1] + 0.8, bridgeX[i + 1][0] - 0.8])
  innerSpans.push([bridgeX[3][1] + 0.8, HALF_TOWER - 0.8])
  innerSpans.push([HALF_TOWER + 6.3 + 0.8, LAB.x1 - 1.2])
  for (const [a, b] of innerSpans) {
    const n = Math.max(1, Math.round((b - a) / 6))
    const w = (b - a) / n
    for (let k = 0; k < n; k++) for (const [z0, z1] of bands)
      wpanel(win, [a + k * w + 0.5, Y(LAB.yIn)], [a + (k + 1) * w - 0.5, Y(LAB.yIn)], inn, z0, z1)
  }
  // West end: the offices over the lower terrace, a grid of teak panels
  // each with its window slot. The east end is blank concrete.
  {
    const xe = LAB.x0, ya = LAB.yIn + 1.5, yb = LAB.yOut - 1.5, n = 4, w = (yb - ya) / n
    for (let k = 0; k < n; k++) for (const [z0, z1] of [[3.0, 5.8], [6.6, 9.4], [10.2, 13.0], [13.8, 16.6]]) {
      const a = ya + k * w + 0.5, b = ya + (k + 1) * w - 0.5
      wpanel(teak, [xe, Y(a)], [xe, Y(b)], [-1, 0], z0, z1)
      wpanel(win, [xe, Y(a + 0.4)], [xe, Y(a + 1.3)], [-1, 0], z0 + 0.35, z1 - 0.35, 0.09)
    }
  }

  // --- Service towers on the outer face.
  for (const [a, b] of SERVICE) {
    const [y0, y1] = yr(LAB.yOut - 0.5, 57.5)
    cbox(concrete, rect(a, b, y0, y1), 0, Z_SERVICE, { b: 0.3 })
  }

  // --- Study towers: body, two 45° fins, teak boxes and open storeys.
  const tower = (x0: number, w: number, teeth: number[], yBack: number) => {
    const yF = 14.2, yT = 12.0, fin = 2.5
    // plan ring, walking the courtyard face from west to east
    const ring: XY[] = [[x0, Y(yBack)]]
    for (let i = 0; i < teeth.length; i++) {
      const t = teeth[i]
      ring.push([t, Y(yT)], [t + fin, Y(yF)])
      const next = i + 1 < teeth.length ? teeth[i + 1] : x0 + w
      ring.push([next, Y(yF)])
    }
    ring.pop()
    ring.push([x0 + w, Y(yF)], [x0 + w, Y(yBack)])
    // the first tooth's west face is the tower's west wall
    const clean: XY[] = []
    for (const p of ring) if (!clean.length || Math.hypot(p[0] - clean[clean.length - 1][0], p[1] - clean[clean.length - 1][1]) > 1e-6) clean.push(p)
    pslab(concrete, clean, 0, Z_TOWER, 0.3)

    for (let i = 0; i < teeth.length; i++) {
      const t = teeth[i]
      const bayA = t + fin, bayB = i + 1 < teeth.length ? teeth[i + 1] : x0 + w
      const a = bayA + 0.25, b = bayB - 0.25
      // courtyard face of the bay: open, teak, open, teak
      wpanel(recess, [a, Y(yF)], [b, Y(yF)], inn, ST[0] + 0.1, ST[1] - 0.25)
      wpanel(recess, [a, Y(yF)], [b, Y(yF)], inn, ST[2] + 0.2, ST[3] - 0.25)
      for (const [z0, z1] of [[ST[1], ST[2]], [ST[3], ST[4]]]) {
        wpanel(teak, [a, Y(yF)], [b, Y(yF)], inn, z0 + 0.15, z1 - 0.15)
        // the study's glazed slot beside the fin
        wpanel(win, [a + 0.25, Y(yF)], [a + 0.95, Y(yF)], inn, z0 + 0.45, z1 - 0.45, 0.09)
      }
      // the fin's west face: the window turned to the ocean
      const yA = Y(yT + 0.25), yB = Y(yF - 0.1)
      wpanel(recess, [t, yA], [t, yB], [-1, 0], ST[0] + 0.1, ST[1] - 0.25)
      wpanel(recess, [t, yA], [t, yB], [-1, 0], ST[2] + 0.2, ST[3] - 0.25)
      for (const [z0, z1] of [[ST[1], ST[2]], [ST[3], ST[4]]]) wpanel(teak, [t, yA], [t, yB], [-1, 0], z0 + 0.15, z1 - 0.15)
    }
    // open ground storey on the side faces too (the walk between towers)
    for (const [xs, nx] of [[x0, -1], [x0 + w, 1]] as const) {
      wpanel(recess, [xs, Y(yF + 0.6)], [xs, Y(yBack - 0.6)], [nx, 0], ST[0] + 0.1, ST[1] - 0.25)
    }
  }
  for (const t of TOWERS) {
    tower(t, 12.1, [t, t + 6.4], 20.4)
    // bridge across the light court to the lab
    const [y0, y1] = yr(20.3, LAB.yIn + 0.3)
    cbox(concrete, rect(t + 4.5, t + 7.9, y0, y1), 0, Z_BRIDGE, { b: 0.25 })
    wpanel(recess, [t + 4.5, Y(21.5)], [t + 4.5, Y(25.5)], [-1, 0], ST[2] + 0.2, ST[3] - 0.25)
    wpanel(recess, [t + 7.9, Y(21.5)], [t + 7.9, Y(25.5)], [1, 0], ST[2] + 0.2, ST[3] - 0.25)
  }
  // The east half tower runs straight back to the lab.
  tower(HALF_TOWER, 6.3, [HALF_TOWER], LAB.yIn + 0.3)
}

wing(1)
wing(-1)

if (import.meta.main) {
  await saveModel(ID, 'Salk Institute', [
    { part: concrete, material: CONCRETE },
    { part: teak, material: TEAK },
    { part: win, material: PALETTE.window },
    { part: recess, material: RECESS },
    { part: roof, material: PALETTE.roof },
  ], { source: `generators/${ID}.ts` })
}
