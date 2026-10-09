/**
 * Optimist Hall, 1115 N. Brevard St, Optimist Park, Charlotte — procedural,
 * CC0-1.0.
 * bun generators/clt-optimist-hall.ts
 *
 * The Gibbs Manufacturing Company's 1892 mill (later Charlotte Pipe and
 * Foundry's), reopened in 2019 as a food hall and offices. A long red-brick
 * mill under one flat white roof, cut open by a courtyard at its south-west
 * end; at that end the two-storey block with stepped parapets on both its
 * end walls (El Thrifty Social), and beside the drive the square brick stack,
 * painted "OPTIMIST HALL" down one face. Along the railway side runs a taller
 * pale corrugated-metal shed, its north-east end re-clad as the charcoal
 * Duke Energy Innovation Center; at the north-east end the one-storey brick
 * annex with steel windows (Duke Energy). Black steel canopies over the
 * courtyard bar and the porch on the Parkwood side.
 *
 * The stack's lettering is not modelled: pale letters 0.9 m wide on a 3 m
 * shaft read as a stripe at map distance, not as words (STYLE: no stripes).
 *
 * Evidence:
 *  - OSM: way/323198228 (the outline, height 9) and its building:parts
 *    way/1502058328–1502058351 (heights 5–15 m, the stepped parapets mapped
 *    part by part), way/1196692782 (Billy Sunday, in the courtyard),
 *    way/1196692830 (the porch roof), node/10000428241 (the stack).
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m (ground_min 206.13 m
 *    NAVD88). Flown before the 2018–19 renovation, which demolished bays on
 *    the railway side, opened the courtyard and cleared the Parkwood side;
 *    the model follows today's OSM outline and takes heights only from roofs
 *    still standing. Base (lowest ground under the footprint) 2.4 m above
 *    ground_min, at the south-west end; the ground rises ~5 m to the
 *    north-east (plane fit below). Heights above base: main roof 8.6–8.9,
 *    El Thrifty block 9.7–10.0, the metal shed 14.2, the roof monitor
 *    (way/1502058336) 10.1, the north-east annex 9.3–10.2, the zig-zag
 *    lean-to 7.9, the stack 39.5 (lidar maximum 41.92 m above ground_min).
 *  - Photos: City Dweller 2, CC BY-SA 4.0 (Wikimedia Commons):
 *    "Optimist Hall Sign Main Entrance Late March 2024" (the stepped block
 *    and the stack), "Optimist Hall main entrance on North Brevard St
 *    Mid-October 2025", "Optimist Hall Sign along Parkwood Late March 2024"
 *    and "Optimist Hall Porch on Parkwood Late March 2024" (the long Parkwood
 *    side, eaves, porch canopy), "Fonta Flora Brewery Optimist Hall Mid-April
 *    2025" (the east wing's end), "Optimist Hall Main Level Courtyard Late
 *    March 2024" (courtyard canopy), "16th St Duke Innovation Center at
 *    Optimist Hall Late March 2024" and "Duke Energy Optimist Hall Innovation
 *    Center November 2022" (the north-east annex, the charcoal box, the
 *    corrugated shed beside it). Flickr "20211030_optimist_hall" by
 *    denton.harryman, CC0 (the Parkwood elevation, all three blocks). USGS
 *    NAIP (plan, white roofs, canopies).
 *  - Look-only: AdamChandler86 on Flickr, CC BY-NC-ND 2.0 (the stack's top:
 *    four recessed slots per face under a corbelled cap).
 *
 * Estimated: window counts and pitch (photos: ~2.6 m on the stepped block,
 * ~3.8 m elsewhere), storey heights, the eave depth on the Parkwood side, the
 * stack's taper (4.3 m square at the foot from photos, 3.0 m under the
 * cap, whose 3.5 m is lidar),
 * the canopies' heights, how far the charcoal Innovation Center runs back
 * into the shed (no photo shows where it ends), the courtyard bar's
 * form (OSM heights only), the faces no photo shows (north-east wall, the
 * shed's railway side, assumed blank corrugated metal).
 *
 * Model frame: bearing 53 (model +y runs along the mill to the north-east,
 * +x to the south-east, Parkwood side); metres above the base.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  type Block, type Kit, type XY,
  BRICK, MILL_ROOF, build, cap, centroid, prism, quad, rect, softBox, tri, window, write,
} from './clt-highland-park-mill-3'

/** Pale corrugated metal of the shed (2024 photo, beside the Innovation Center). */
const SHED = finish('optimist-shed', 0xc2cad0)
/** Black steel canopies and the Innovation Center's cladding, held at charcoal. */
const CHARCOAL = finish('optimist-charcoal', 0x4f555c)

/** Ground above base: a plane fitted to the lidar ground round the complex (sd 0.5 m). */
const ground = (p: XY) => Math.max(0, 1.91 - 0.0149 * p[0] + 0.0225 * p[1])

/** way/323198228 in the model frame, for the anchor. */
const OUTLINE: XY[] = [[48.6, 38.6], [48.6, 34.1], [48.6, 12.6], [48.6, 6.2], [48.7, -11.9], [48.7, -19.8], [48.6, -62.7], [48.6, -65.4], [48.6, -65.9], [42.2, -65.9], [39.1, -65.9], [23.2, -66.0], [23.2, -65.5], [23.2, -49.4], [23.2, -23.1], [23.2, -12.0], [13.5, -12.1], [4.5, -12.2], [4.6, -16.8], [4.6, -35.3], [4.5, -56.1], [4.4, -66.8], [4.4, -68.8], [4.4, -71.4], [4.4, -75.0], [4.4, -77.5], [4.4, -79.7], [-19.6, -79.9], [-20.0, -79.9], [-20.0, -77.8], [-20.0, -75.2], [-20.1, -72.4], [-20.1, -71.6], [-20.1, -69.1], [-20.1, -67.0], [-20.1, -66.6], [-20.1, -53.7], [-20.1, -38.8], [-19.8, -38.8], [-19.8, -35.1], [-19.9, -23.4], [-19.8, -13.8], [-19.8, -12.2], [-20.5, -12.2], [-20.5, -8.3], [-20.5, -4.3], [-38.5, -4.5], [-38.5, 9.0], [-42.9, 11.7], [-39.7, 17.1], [-43.0, 19.0], [-39.6, 24.8], [-43.3, 27.0], [-41.7, 30.0], [-41.6, 33.6], [-43.5, 33.7], [-43.5, 36.0], [-38.6, 36.0], [-38.8, 71.5], [-28.3, 71.6], [-28.3, 65.6], [-24.3, 65.7], [-20.6, 65.7], [-20.6, 73.4], [0.6, 73.6], [0.6, 75.2], [4.2, 75.9], [1.6, 87.9], [9.6, 89.7], [9.3, 91.0], [14.4, 92.2], [14.7, 90.8], [25.8, 93.2], [28.4, 81.3], [27.6, 81.1], [27.6, 79.5], [27.7, 78.8], [27.8, 73.8], [48.6, 73.9]]

const TOP = 8.7 // main roof (lidar 8.6–8.9)

/** A post: a small square prism from the ground to `z1`. */
function post(p: Part, c: XY, z1: number, w = 0.45) {
  prism(p, rect(c[0] - w / 2, c[1] - w / 2, c[0] + w / 2, c[1] + w / 2), -0.3, z1)
}
/** A flat canopy on posts: a slab with posts at the corners and every ~8 m. */
function canopy(p: Part, R: XY[], z1: number, t = 0.45, inset = 0.6) {
  softBox(p, R, z1 - t, z1, 0.12)
  const xs = R.map((q) => q[0]), ys = R.map((q) => q[1])
  const x0 = Math.min(...xs) + inset, x1 = Math.max(...xs) - inset, y0 = Math.min(...ys) + inset, y1 = Math.max(...ys) - inset
  const nx = Math.max(1, Math.round((x1 - x0) / 8)), ny = Math.max(1, Math.round((y1 - y0) / 8))
  for (let i = 0; i <= nx; i++) for (let j = 0; j <= ny; j++) {
    if (i > 0 && i < nx && j > 0 && j < ny) continue
    post(p, [x0 + ((x1 - x0) * i) / nx, y0 + ((y1 - y0) * j) / ny], z1 - t)
  }
}

/**
 * The square stack: a tapered shaft with chamfered corners, a band of four
 * recessed slots per face near the top, and a corbelled cap.
 */
function squareStack(brick: Part, dark: Part, c: XY, h0: number, h1: number, z1: number) {
  const ch = 0.18
  const ring = (h: number, z: number): V3[] => {
    const pts: XY[] = [[h, -h + ch], [h, h - ch], [h - ch, h], [-h + ch, h], [-h, h - ch], [-h, -h + ch], [-h + ch, -h], [h - ch, -h]]
    return pts.map((q) => [c[0] + q[0], c[1] + q[1], z] as V3)
  }
  const band = (ra: V3[], rb: V3[], p: Part) => {
    for (let i = 0; i < ra.length; i++) { const j = (i + 1) % ra.length; quad(p, ra[i], ra[j], rb[j], rb[i]) }
  }
  const zs = z1 - 1.3 // under the cap
  const hz = (z: number) => h0 + ((h1 - h0) * z) / zs
  const R0 = ring(h0, -0.6), R1 = ring(h1, zs)
  band(R0, R1, brick)
  // Corbelled cap: a step out and a band to the top.
  const C0 = ring(h1 + 0.22, zs), C1 = ring(h1 + 0.22, z1)
  band(R1, C0, brick); band(C0, C1, brick)
  const M = ring(h1 - 0.25, z1)
  band(C1, M, brick)
  for (let i = 1; i < M.length - 1; i++) tri(dark, M[0], M[i], M[i + 1], [0, 0, 1])
  // Four recessed slots per face in the top 5 m of the shaft.
  const za = zs - 5.6, zb = zs - 0.5
  for (const [u, o] of [[[0, 1], [1, 0]], [[-1, 0], [0, 1]], [[0, -1], [-1, 0]], [[1, 0], [0, -1]]] as [XY, XY][]) {
    for (let k = 0; k < 4; k++) {
      const s = (k - 1.5) * 0.62, w = 0.3
      const P = (ss: number, z: number): V3 => { const h = hz(z) + 0.03; return [c[0] + o[0] * h + u[0] * ss, c[1] + o[1] * h + u[1] * ss, z] }
      quad(dark, P(s - w / 2, za), P(s + w / 2, za), P(s + w / 2, zb), P(s - w / 2, zb), [o[0], o[1], 0])
    }
  }
}

export function buildOptimist() {
  const brick = new Part(), shed = new Part(), win = new Part(), trim = new Part(), roof = new Part(), dark = new Part()
  // Along the Parkwood side, north-east of the Fonta Flora wing, the hall
  // stands on a raised terrace behind a retaining wall, so its wall shows one
  // tall storey (photos): windows start above the terrace there.
  const terrace = (p: XY) => ground(p) + (p[0] > 47 && p[1] > -45 ? 1.6 : 0)
  const kit: Kit = { win, trim, roof, ground: terrace, frame: trim }

  // Two storeys where the ground allows, the upper one tall (photos).
  const millRows = [{ z0: 1.3, z1: 3.5, w: 1.6 }, { z0: 4.5, z1: 8.0, w: 1.75 }]
  const blocks: Block[] = [
    // The mill under one flat roof: west wing, Parkwood hall, east (Fonta Flora) wing.
    {
      poly: [[-20.1, -67.0], [4.4, -66.8], [4.5, -12.2], [23.2, -12.0], [23.2, -65.5], [48.6, -65.4], [48.6, 73.9], [-20.6, 73.4], [-20.5, -4.3]],
      top: TOP, wall: brick, rows: millRows, pitch: 3.4,
      // The Fonta Flora end wall gets its own windows below.
      blank: (o, m) => o[1] < -0.9 && m[0] > 23,
    },
    // El Thrifty Social: two storeys, nine bays by five (photo), 2.4 m pitch.
    {
      poly: rect(-19.6, -79.9, 3.9, -67.0), top: 9.8, wall: brick, pitch: 2.4,
      rows: [{ z0: 1.0, z1: 3.4, w: 1.3 }, { z0: 4.7, z1: 8.4, w: 1.4 }],
    },
    // The metal shed on the railway side (lidar 14.2), blank corrugated walls.
    { poly: [[-38.5, -4.5], [-20.5, -4.3], [-20.6, 65.7], [-28.3, 65.6], [-28.3, 62.0], [-38.7, 62.0]], top: 14.2, wall: shed },
    // The zig-zag lean-to on the railway side (way/1502058333) and its tower (way/1502058332).
    { poly: [[-38.5, 9.0], [-38.6, 30.0], [-41.7, 30.0], [-43.3, 27.0], [-39.6, 24.8], [-43.0, 19.0], [-39.7, 17.1], [-42.9, 11.7]], top: 7.9, wall: shed },
    { poly: [[-43.5, 30.0], [-38.6, 30.0], [-38.6, 36.0], [-43.5, 36.0]], top: 12.6, wall: shed },
    // The north-east annex (Duke Energy): one tall storey of wide steel windows.
    {
      poly: [[4.2, 75.9], [27.6, 81.1], [28.4, 81.3], [25.8, 93.2], [14.7, 90.8], [14.4, 92.2], [9.3, 91.0], [9.6, 89.7], [1.6, 87.9]],
      top: 9.5, wall: brick, rows: [{ z0: 4.6, z1: 7.8, w: 3.0 }], pitch: 4.4,
    },
    // The link between the mill and the annex.
    { poly: [[0.6, 73.6], [27.8, 73.8], [27.6, 81.1], [4.2, 75.9], [0.6, 75.2]], top: 9.0, wall: brick },
    // The roof monitor (way/1502058336), clerestory windows down both sides.
    { poly: rect(31.3, 21.6, 39.9, 71.1), top: 10.1, wall: brick, rows: [{ z0: 8.85, z1: 9.65, w: 2.4 }], pitch: 3.6, blank: (o) => Math.abs(o[1]) > 0.5 },
  ]
  build(blocks, kit)

  // The Innovation Center: the charcoal two-storey box at the shed's
  // north-east corner (the part of way/1502058331 that juts out), its
  // glass corner wrapping the south-east and north-east faces, two tall
  // slit windows on the rest of its front (2022 and 2024 photos). How far
  // back it runs into the shed is estimated.
  {
    const IC: XY[] = [[-38.7, 62.0], [-28.3, 62.0], [-28.3, 71.6], [-38.8, 71.5]]
    build([{ poly: IC, top: 14.2, wall: dark }], kit)
    const g = ground([-30, 71.5])
    for (const [z0, z1] of [[g + 0.6, g + 4.6], [g + 5.2, 12.6]]) {
      window(win, [-28.3, 68.6], [0, 1], [1, 0], { z0, z1, w: 5.4 })
      window(win, [-30.7, 71.58], [-1, 0], [0, 1], { z0, z1, w: 4.0 })
    }
    for (const x of [-34.6, -36.6]) window(win, [x, 71.55], [-1, 0], [0, 1], { z0: g + 5.2, z1: 12.6, w: 0.9 })
  }

  // The stepped parapets on El Thrifty's two end walls (way/1502058342–51):
  // steps of ~0.9 and ~1.9 m up to the middle (photo; OSM maps 0.5 m steps).
  const steps: [number, number, number][] = [[-77.8, -75.2, 10.7], [-75.2, -71.6, 11.7], [-71.6, -69.1, 10.7]]
  for (const x of [-19.6, 3.9 - 0.45]) for (const [y0, y1, z] of steps) {
    prism(brick, rect(x, y0, x + 0.45, y1), 9.2, z, trim)
  }
  // The Fonta Flora wing's end wall rises a step on its west part (way/1502058339, -41).
  prism(brick, rect(23.2, -65.5, 39.0, -65.05), 8.2, 9.3, trim)
  prism(brick, rect(39.0, -65.5, 42.2, -65.05), 8.2, 9.0, trim)
  // Its windows: two groups of three either side of a blank pier (photo).
  for (const dx of [2.3, 5.7, 8.8, 17.9, 20.7, 23.5]) {
    window(win, [23.2 + dx, -65.5], [1, 0], [0, -1], { z0: 0.4, z1: 3.0, w: 1.8 }, trim)
    window(win, [23.2 + dx, -65.5], [1, 0], [0, -1], { z0: 4.6, z1: 7.7, w: 1.9 }, trim)
  }
  // The raised parapet on the west wing's railway face (way/1502058330, lidar 10.4).
  prism(brick, rect(-20.4, -38.8, -19.6, -12.2), 8.2, 10.4, trim)

  // Deep eaves on white brackets down the Parkwood side (photos): a pale
  // soffit and fascia under a roof-coloured top.
  {
    const x0 = 48.6, x1 = 49.6, y0 = -65.4, y1 = 73.9, za = TOP - 0.45, zb = TOP
    prism(trim, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], za, zb, roof)
    cap(trim, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], za, false)
  }

  // Black steel canopies: the porch on the Parkwood side (way/1196692830)
  // and the courtyard bar (Billy Sunday, way/1196692782) with its kiosk.
  canopy(dark, rect(54.4, -17.0, 61.0, -1.1), 8.2)
  canopy(dark, rect(8.6, -59.1, 17.3, -40.6), 8.0)
  softBox(dark, rect(8.4, -72.9, 17.0, -59.1), -0.3, 5.5, 0.15, roof)

  // The stack (node/10000428241; centred on its lidar returns, 1 m east of
  // the node): lidar top 39.5 m above base, 3.5 m across the cap.
  squareStack(brick, dark, [-29.0, -85.0], 2.15, 1.5, 39.5)

  return {
    id: 'clt-optimist-hall', name: 'Optimist Hall', anchor: centroid(OUTLINE), height: 39.5,
    parts: [
      { part: brick, material: BRICK },
      { part: roof, material: MILL_ROOF },
      { part: shed, material: SHED },
      { part: win, material: PALETTE.window },
      { part: trim, material: PALETTE.trim },
      { part: dark, material: CHARCOAL },
    ],
  }
}

if (import.meta.main) {
  const b = buildOptimist()
  console.log('anchor (model frame)', b.anchor.map((v) => v.toFixed(2)).join(', '))
  await write(b)
}
