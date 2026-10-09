/**
 * The Line, 2151 Hawkins Street, South End, Charlotte — procedural, CC0-1.0.
 * bun generators/clt-the-line.ts
 *
 * A 16-storey office building on the Rail Trail (Portman Holdings, opened
 * 2023): an eight-floor glass office block standing on columns over a
 * parking podium. Read from the photos, bottom to top: an open ground floor
 * behind columns; a band of dark bronze perforated screen; three parking
 * levels behind bronze fins and slab edges; a recessed glass amenity floor
 * with pale round columns under the block's overhang; then the office block,
 * glazed in sky-reflecting glass with dark bronze bands that pair the floors
 * (a thick band every two floors, a thin one between). Two notches break the
 * west face: a recessed two-floor terrace at the top south corner and a
 * double-height glazed room at the bottom north corner. A narrower wing
 * steps out to the north.
 *
 * Evidence:
 *  - OSM way/1059972611 (outline; 16 levels, height 65) and its parts:
 *    way/1203857912 (0–8 m), 1203857913 (8–19 m, the garage),
 *    1203857916 (19–26 m), 1203857917 (26–66 m, the office block),
 *    1203857918 and 1203857919 (66–69 m, rooftop penthouses, pale).
 *    building:colour #292b2e (dark), roof:colour #f7f4eb (white membrane).
 *  - Lidar (2016) predates the building; it gives only the ground, flat to
 *    within 1 m across the site. Heights are OSM's.
 *  - NAIP (USGS, public domain): white roofs, the penthouse, and a lawn on
 *    the 26 m deck east of the office block.
 *  - Photos (Commons, City Dweller 2, CC BY-SA 4.0): "The Line Late August
 *    2023", "… Late November 2023", "… Late January 2024", "… Mid-January
 *    2024", "… Early February 2024", "… Mid-May 2024" (the west face, from
 *    the lot to the north-west); "The Line complex Late July 2024"; "The
 *    Line along South End Rail Trail Mid-April 2024" (the east arcade);
 *    "Hawkins St near The Line Late April 2024" (the overhang and its pale
 *    soffit); "Linea and The Line courtyard Late January 2025" (the south
 *    end, garage screen).
 *
 * Estimated: the split of the 0–26 m podium between the ground floor,
 * screen, parking levels and amenity floor (photo proportions; see Z1, Z2); the office floors as four pairs of ~4.8 m floors; the notches'
 * size and depth (photos: about 15 m and 17 m wide, two floors tall, ~3 m
 * deep); the lawn's outline (NAIP); the east and south faces' detail (a few
 * photos only), drawn like the west.
 *
 * Model frame: bearing 33.7 (model +y runs along the long axis, 33.7° east
 * of north). Coordinates below are in that frame about (-80.86206,
 * 35.20905); the anchor is the outline's centroid.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, clean, inside, prism, quad, write, type Built, type XY } from './clt-highland-park-mill-3'

const charcoal = new Part(), bronze = new Part(), win = new Part(), trim = new Part(), roof = new Part(), lawn = new Part()
const CHARCOAL = finish('line-charcoal', 0x4c5058)
const BRONZE = finish('line-bronze', 0x75695c)
const GLASS = { name: 'window', color: 0x8fa7bb, roughness: 0.35 }
const ROOF = finish('line-roof', 0xe2e0db)
const LAWN = finish('line-lawn', 0x9aab84)
const BURY = 0.5

// OSM parts, in the frame.
const G0: XY[] = [[-25.6, -33.1], [-9.6, -41.5], [-7.1, -43.0], [11.0, -51.7], [29.9, -51.4], [29.9, -41.8], [29.7, -23.7], [29.6, 61.0], [11.8, 61.0], [-25.0, 34.7], [-25.2, 19.1], [-25.4, -9.2]]
const G1: XY[] = [[-7.1, -43.0], [29.9, -41.8], [29.7, -23.7], [29.6, 61.0], [11.8, 61.0], [-25.0, 34.7], [-25.2, 19.1], [-25.4, -9.2], [-25.6, -33.1], [-9.6, -41.5]]
const G2: XY[] = [[-25.0, 34.7], [-25.2, 19.1], [-25.6, -33.1], [-9.1, -33.2], [13.1, -33.3], [13.3, -24.0], [29.7, -23.7], [29.6, 61.0], [11.8, 61.0]]
/** The office block, squared off (OSM's corners are within 0.3 m of these lines). */
const T: XY[] = [[-27.7, -33.2], [-9.1, -33.2], [-9.1, -24.1], [-2.4, -24.1], [-2.4, -26.8], [17.2, -26.8], [17.2, 48.0], [-3.2, 48.0], [-3.2, 34.7], [-27.7, 34.7]]

// OSM splits the podium at 8 and 19 m; the photos put the screen band's top
// and the amenity floor's base higher (screen ≈ 0.6 of the three parking
// levels, amenity floor ≈ one office floor), so 10.5 and 21 m.
const Z1 = 10.5, Z2 = 21, Z3 = 26, ZT = 66
/** Office floors in pairs: each pair is a thick band, a floor, a thin band, a floor. */
const ZG = [26.8, 36.35, 45.9, 55.45], PAIR = 9.55
const rowsOf = (zg: number): [number, number][] => [[zg + 1.0, zg + 5.0], [zg + 5.5, zg + PAIR]]

type Edge = { A: XY; B: XY; L: number; u: XY; o: XY }
const edges = (P: XY[]): Edge[] => clean(P).map((A, i, R) => {
  const B = R[(i + 1) % R.length], L = Math.hypot(B[0] - A[0], B[1] - A[1])
  return { A, B, L, u: [(B[0] - A[0]) / L, (B[1] - A[1]) / L], o: [(B[1] - A[1]) / L, (A[0] - B[0]) / L] }
})
/** A flat panel on an edge from s0 to s1 along it, z0–z1, `d` proud of the wall. */
function panel(p: Part, e: Edge, s0: number, s1: number, z0: number, z1: number, d = 0.06) {
  const P = (s: number, z: number): V3 => [e.A[0] + e.u[0] * s + e.o[0] * d, e.A[1] + e.u[1] * s + e.o[1] * d, z]
  quad(p, P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1), [e.o[0], e.o[1], 0])
}
/** Walls of a ring between two heights in one material, no lid. */
const walls = (p: Part, P: XY[], z0: number, z1: number) => prism(p, P, z0, z1, null)

/** Parking openings: dark panels in bays between fins, one per level. */
function garage(e: Edge, levels: [number, number][], bay = 9) {
  if (e.L < 3) return
  const n = Math.max(1, Math.round(e.L / bay)), w = e.L / n
  for (let i = 0; i < n; i++) for (const [z0, z1] of levels) panel(charcoal, e, i * w + 0.45, (i + 1) * w - 0.45, z0, z1)
}

export function buildLine(): Built {
  // --- Podium. Ground floor: dark, glazed between columns; the screen band above.
  walls(charcoal, G0, -BURY, 4.6)
  walls(bronze, G0, 4.6, Z1)
  cap(roof, G0, Z1)
  for (const e of edges(G0)) {
    if (e.L < 4) continue
    const n = Math.max(1, Math.round(e.L / 9)), w = e.L / n
    for (let i = 0; i < n; i++) panel(win, e, i * w + 0.6, (i + 1) * w - 0.6, 0.3, 4.1)
  }
  // Parking levels behind bronze fins.
  walls(bronze, G1, Z1, Z2)
  cap(roof, G1, Z2)
  for (const e of edges(G1)) garage(e, [[11.0, 13.6], [14.3, 16.9], [17.6, 20.3]])
  // 19–26: a glass amenity floor under the block's overhang; parking behind
  // the screen where the floor is open to the sky.
  walls(bronze, G2, Z2, Z3)
  cap(roof, G2, Z3)
  for (const e of edges(G2)) {
    // Glass where the office block overhangs the edge, parking elsewhere.
    const m: XY = [(e.A[0] + e.B[0]) / 2 + e.o[0] * 1.0, (e.A[1] + e.B[1]) / 2 + e.o[1] * 1.0]
    if (inside(T, m)) panel(win, e, 0.2, e.L - 0.2, Z2 + 0.4, Z3 - 0.3)
    else garage(e, [[21.5, 25.4]])
  }
  // The lawn on the 26 m deck (NAIP).
  cap(lawn, [[19.5, -18], [27.5, -18], [27.5, 40], [19.5, 40]], Z3 + 0.05)
  // Pale round columns along the west overhang, at the office block's face.
  for (let i = 0; i < 11; i++) {
    const y = -30.5 + i * 6.25, c: XY = [-26.9, y], seg = 8, r = 0.5
    const ring: XY[] = Array.from({ length: seg }, (_, k) => [c[0] + r * Math.cos((k / seg) * 2 * Math.PI), c[1] + r * Math.sin((k / seg) * 2 * Math.PI)])
    prism(trim, ring, Z2, Z3, null)
  }

  // --- The office block, 26–66 m.
  const TE = edges(T)
  // Soffit (pale, per the Hawkins St photo) and roof.
  cap(trim, T, Z3, false)
  cap(roof, T, ZT)
  // A thin coping lip round the roof.
  for (const e of TE) panel(charcoal, e, -0.02, e.L + 0.02, ZT - 0.35, ZT + 0.25, 0.12)
  // The west face (x = −27.7) carries two recesses; the other faces are plain pairs of bands.
  const WEST = TE.find((e) => Math.abs(e.A[0] + 27.7) < 0.01 && Math.abs(e.B[0] + 27.7) < 0.01)!
  type Hole = { y0: number; y1: number; z0: number; z1: number; depth: number; tall: boolean }
  const holes: Hole[] = [
    // Top south: a two-floor terrace, 15 m wide, ~3 m deep, inside a corner frame.
    { y0: -32.4, y1: -17.4, z0: ZG[2] + 1.0, z1: ZG[2] + PAIR, depth: 3.0, tall: false },
    // Bottom north: a double-height glazed room, 17 m wide.
    { y0: 17.0, y1: 34.2, z0: ZG[0] + 1.0, z1: ZG[0] + PAIR, depth: 1.2, tall: true },
  ]
  for (const e of TE) {
    if (e === WEST) continue
    quad(charcoal, [e.A[0], e.A[1], Z3], [e.B[0], e.B[1], Z3], [e.B[0], e.B[1], ZT], [e.A[0], e.A[1], ZT], [e.o[0], e.o[1], 0])
    if (e.L < 2) continue
    for (const zg of ZG) for (const [z0, z1] of rowsOf(zg)) panel(win, e, 0.45, e.L - 0.45, z0, z1)
  }
  // West face: wall pieces round the holes, the recesses, and the bands.
  {
    const x = -27.7, yN = 34.7, yS = -33.2, N: V3 = [-1, 0, 0]
    const wq = (ya: number, yb: number, za: number, zb: number) => quad(charcoal, [x, ya, za], [x, yb, za], [x, yb, zb], [x, ya, zb], N)
    // Full-height strips between and outside the holes, then above/below each hole.
    const hs = [...holes].sort((a, b) => b.y1 - a.y1)
    let y = yN
    for (const h of hs) { wq(y, h.y1, Z3, ZT); wq(h.y1, h.y0, Z3, h.z0); wq(h.y1, h.y0, h.z1, ZT); y = h.y0 }
    wq(y, yS, Z3, ZT)
    // Bands on the solid wall: per row, the spans outside any hole at that height.
    for (const zg of ZG) for (const [z0, z1] of rowsOf(zg)) {
      let spans: [number, number][] = [[yN - 0.45, yS + 0.45]]
      for (const h of holes) if (z1 > h.z0 && z0 < h.z1) spans = spans.flatMap(([a, b]) => [[a, h.y1 + 0.0], [h.y0 - 0.0, b]] as [number, number][]).filter(([a, b]) => a - b > 1)
      for (const [a, b] of spans) quad(win, [x - 0.06, a, z0], [x - 0.06, b, z0], [x - 0.06, b, z1], [x - 0.06, a, z1], N)
    }
    // Recesses: back wall glazed, dark sides and ceiling, a floor in roof grey.
    for (const h of holes) {
      const xb = x + h.depth
      quad(charcoal, [xb, h.y1, h.z0], [xb, h.y0, h.z0], [xb, h.y0, h.z1], [xb, h.y1, h.z1], N)
      const g = (za: number, zb: number) => quad(win, [xb - 0.06, h.y1 - 0.3, za], [xb - 0.06, h.y0 + 0.3, za], [xb - 0.06, h.y0 + 0.3, zb], [xb - 0.06, h.y1 - 0.3, zb], N)
      if (h.tall) g(h.z0 + 0.1, h.z1 - 0.35)
      else { g(h.z0 + 0.1, h.z0 + 4.0); g(h.z0 + 4.5, h.z1 - 0.35) }
      quad(charcoal, [x, h.y1, h.z0], [xb, h.y1, h.z0], [xb, h.y1, h.z1], [x, h.y1, h.z1], [0, -1, 0])
      quad(charcoal, [xb, h.y0, h.z0], [x, h.y0, h.z0], [x, h.y0, h.z1], [xb, h.y0, h.z1], [0, 1, 0])
      quad(charcoal, [x, h.y0, h.z1], [x, h.y1, h.z1], [xb, h.y1, h.z1], [xb, h.y0, h.z1], [0, 0, -1])
      quad(roof, [x, h.y1, h.z0], [x, h.y0, h.z0], [xb, h.y0, h.z0], [xb, h.y1, h.z0], [0, 0, 1])
    }
  }
  // Rooftop penthouses (OSM, 66–69 m), pale.
  prism(trim, [[-11.0, -4.4], [0.2, -4.4], [0.2, 16.2], [-11.0, 16.2]], ZT, 69)
  prism(trim, [[-6.5, -11.1], [0.8, -11.1], [0.8, -7.4], [-6.5, -7.4]], ZT, 69)

  return {
    id: 'clt-the-line', name: 'The Line', anchor: [3.61, 3.26], height: 69,
    parts: [
      { part: charcoal, material: CHARCOAL },
      { part: bronze, material: BRONZE },
      { part: win, material: GLASS },
      { part: trim, material: PALETTE.trim },
      { part: roof, material: ROOF },
      { part: lawn, material: LAWN },
    ],
  }
}

if (import.meta.main) await write(buildLine())
