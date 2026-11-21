/**
 * Discovery Place Science (301 N Tryon St, 1981; expanded 1991 with the
 * Charlotte Observer OMNIMAX theatre), Charlotte. Original procedural
 * geometry, CC0-1.0.
 * bun generators/clt-discovery-place.ts
 *
 * Map frame: x, y, z up, metres, turned to bearing 49.6, square to the
 * Uptown grid: +x faces North Tryon Street (south-east), -y faces 6th
 * Street (south-west), -x faces Church Street, and the curved +y edge faces
 * the garden beside St. Peter's Episcopal Church. Origin: centroid of OSM
 * way/174231925 on the lowest ground (the 6th St side).
 *
 * Identity, in order:
 *  - a broad, low, flat-roofed block filling most of the block, in brown
 *    brick over a glazed ground floor on Tryon;
 *  - the round OMNIMAX drum at the 6th St / Church St corner, a plain
 *    cylinder standing a storey and a half above the roof out of a wider
 *    round base;
 *  - the long curved north-east wall bending round the garden toward
 *    Tryon, and the glazed Tryon entrance corner with its dark frames;
 *  - skylights over the central hall.
 *
 * Evidence:
 *  - OSM way/174231925 (building, height 22, building:levels 2, Q5281960):
 *    the outline, read in this frame; no building:parts.
 *  - Lidar: USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17), 1 m grid,
 *    read with tools/lidar_frame.py at bearing 49.6. Ground 1.0 m (6th St)
 *    to 4-6 m (Church St north end) over the box minimum; y = 0 here is the
 *    6th St ground. Measured above it: the main roof 13-14 m (the central
 *    hall's roof about 1 m lower than the rest); the drum's flat top 21.1-
 *    21.9 m over x = -46..-22, y = -28..-4 (radius about 12.5 m, centred
 *    at -34, -16); the wider round base, the OSM circle (radius 18 m), at
 *    roof height. OSM's 22 m is the drum.
 *  - NAIP (USGS, public domain): the plan, the pale drum top, the gravel
 *    roof of the central hall with a run of skylights near the curved edge.
 *  - Photo: "Discovery Place-27527-1.jpg" (Ken Thomas, public domain,
 *    https://commons.wikimedia.org/wiki/File:Discovery_Place-27527-1.jpg):
 *    the Tryon entrance corner, glazed ground floor in dark frames, the
 *    upper storey in dark glass and brown brick leaning out over it.
 *    No other open photo was found; no Mapillary token was available. No
 *    commercial imagery.
 *  - Published: opened 1981, OMNIMAX theatre added 1991 (Wikipedia
 *    "Discovery Place").
 *
 * Estimated from the photo: the entrance corner's full-height glass box
 * (14 m along Tryon from the garden end, wrapping onto the curve), its
 * two tiers of 3.2 m bays; the ground-floor glazing 6.5 m tall on Tryon and the corner;
 * the brick upper storey leaning 1.5 m out over it on Tryon; the window
 * bands on the other faces; the brick colour, a mid brown pulled light.
 *
 * Doubts: only the Tryon entrance corner is photographed. The 6th St,
 * Church St and garden faces, and the drum's walls, are drawn from the
 * plan and lidar as brick with plain window bands; their real openings
 * are unknown. The drum's wall finish is a guess (brick, as the rest).
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { panel, type XY } from './chi-aon-center'
import { wallsF, capF, prism, edgeLen, ccw } from './clt-imaginon'

const BEARING = 49.6
const ANCHOR: [number, number] = [35.2295784, -80.8409863]

const brick = new Part(), glass = new Part(), roof = new Part(), frame = new Part(), sky = new Part()

const ROOF = 13.6, DRUM = 21.5

const RING: XY[] = ccw([[-54.5, -8.6], [-54.4, 4.1], [-54.4, 6.5], [-54.3, 8.9], [-56.5, 9.0], [-56.1, 49.7], [-47.3, 49.7], [-38.8, 49.7], [-32.1, 49.6], [-32.3, 34.0], [-26.8, 34.0], [-26.8, 26.1], [-21.5, 26.1], [-21.6, 18.0], [-13.9, 18.0], [-14.0, 13.8], [-16.4, 13.9], [-16.5, 8.9], [-3.9, 8.9], [-0.9, 9.2], [2.0, 9.8], [5.0, 10.5], [8.1, 11.5], [11.0, 12.7], [14.0, 14.1], [16.8, 15.7], [19.6, 17.4], [22.4, 19.7], [25.7, 21.8], [28.9, 23.6], [32.3, 25.0], [35.9, 26.1], [39.4, 26.9], [43.1, 27.2], [46.8, 27.4], [49.9, 27.8], [52.6, 28.4], [55.2, 29.3], [57.9, 30.4], [60.7, 31.7], [63.0, 33.3], [63.0, -29.3], [-16.0, -29.8], [-16.0, -28.4], [-24.5, -28.4], [-27.2, -30.6], [-30.3, -32.3], [-33.6, -33.4], [-36.8, -33.8], [-40.0, -33.7], [-43.3, -33.1], [-46.3, -31.7], [-49.1, -29.9], [-51.3, -27.8], [-53.1, -25.6], [-54.4, -23.0], [-55.4, -20.2], [-55.9, -17.5], [-56.0, -14.3], [-55.5, -11.3]])

// Tryon's upper storey leans out over the glazed ground floor: the main
// ring is the upper storey; the ground floor on Tryon is set back 1.5 m.
const TRYON = 63.0, LEAN = 1.5, GF = 6.5
{
  const isTryon = (a: XY, b: XY) => Math.abs(a[0] - TRYON) < 0.01 && Math.abs(b[0] - TRYON) < 0.01
  for (let i = 0; i < RING.length; i++) {
    const a = RING[i], b = RING[(i + 1) % RING.length], L = edgeLen(a, b)
    if (isTryon(a, b)) {
      // the glazed ground floor, set back, in dark frames
      const a0: XY = [a[0] - LEAN, a[1]], b0: XY = [b[0] - LEAN, b[1]]
      frame.quad([a0[0], a0[1], 0], [b0[0], b0[1], 0], [b0[0], b0[1], GF], [a0[0], a0[1], GF])
      const n = Math.round(L / 5)
      for (let k = 0; k < n; k++) panel(glass, a0, b0, k * L / n + 0.35, (k + 1) * L / n - 0.35, 0.3, GF - 0.4)
      // the soffit under the lean, and the brick upper storey to the roof
      frame.quad([a0[0], a0[1], GF], [b0[0], b0[1], GF], [b[0], b[1], GF + 1.2], [a[0], a[1], GF + 1.2])
      brick.quad([a[0], a[1], GF + 1.2], [b[0], b[1], GF + 1.2], [b[0], b[1], ROOF], [a[0], a[1], ROOF])
      // a dark glass band in the upper storey
      panel(glass, a, b, 3, L - 3, GF + 2.4, ROOF - 1.6)
      continue
    }
    brick.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], ROOF], [a[0], a[1], ROOF])
    if (L > 9 && L < 30) {
      // plain window bands on the long brick faces
      panel(glass, a, b, 1.5, L - 1.5, 1.2, 4.4)
      panel(glass, a, b, 1.5, L - 1.5, 8.0, 11.0)
    } else if (L >= 30) {
      const n = Math.round(L / 14)
      for (let k = 0; k < n; k++) {
        const c = (k + 0.5) * L / n
        panel(glass, a, b, c - 4.5, c + 4.5, 1.2, 4.4)
        panel(glass, a, b, c - 4.5, c + 4.5, 8.0, 11.0)
      }
    }
  }
  // the ends of the Tryon set-back (where the lean meets the 6th St and garden walls)
  const y0 = -29.3, y1 = 33.3
  brick.quad([TRYON, y1, 0], [TRYON - LEAN, y1, 0], [TRYON - LEAN, y1, GF], [TRYON, y1, GF + 1.2])
  brick.quad([TRYON - LEAN, y0, 0], [TRYON, y0, 0], [TRYON, y0, GF + 1.2], [TRYON - LEAN, y0, GF])
  capF(roof, RING, () => ROOF)
  // a low parapet line round the roof
  wallsF(frame, RING, () => ROOF, () => ROOF + 0.5)
}

// The curved garden wall gets a glazed lower storey along its whole run.
{
  const curve = RING.filter(([x, y]) => y > 8.5 && y < 34 && x > -4.5)
  for (let i = 0; i < curve.length - 1; i++) {
    const a = curve[i], b = curve[i + 1]
    // ring is counter-clockwise; this run goes from Tryon back west, so faces outward (+y side)
    panel(glass, a, b, 0.1, edgeLen(a, b) - 0.1, 0.8, 5.6)
  }
}

// The entrance corner at Tryon and the garden (photo): a two-storey box of
// glass in dark frames, flush with the upper storey, wrapping a few metres
// round onto the curved garden wall.
{
  const n = RING.length
  const ti = RING.findIndex((a, i) => Math.abs(a[0] - TRYON) < 0.01 && Math.abs(RING[(i + 1) % n][0] - TRYON) < 0.01)
  const A = RING[ti], B = RING[(ti + 1) % n], L = edgeLen(A, B)
  const Y0 = 19.5, Y1 = 33.3
  const s0 = Math.abs(Y0 - A[1]), s1 = Math.abs(Y1 - A[1])
  const [lo, hi] = [Math.min(s0, s1), Math.max(s0, s1)]
  const grid = (a: XY, b: XY, l0: number, l1: number) => {
    panel(frame, a, b, l0, l1, 0, ROOF, 0.06)
    const m = Math.max(1, Math.round((l1 - l0) / 3.2)), w = (l1 - l0) / m
    for (let k = 0; k < m; k++) {
      panel(glass, a, b, l0 + k * w + 0.2, l0 + (k + 1) * w - 0.2, 0.3, 6.4, 0.1)
      panel(glass, a, b, l0 + k * w + 0.2, l0 + (k + 1) * w - 0.2, 6.9, ROOF - 0.7, 0.1)
    }
  }
  if (L > 0) grid(A, B, lo, hi)
  // close the set-back under the lean at the box's south end
  frame.quad([TRYON - LEAN, Y0, 0], [TRYON + 0.06, Y0, 0], [TRYON + 0.06, Y0, GF + 1.2], [TRYON - LEAN, Y0, GF])
  frame.quad([TRYON + 0.06, Y0, 0], [TRYON - LEAN, Y0, 0], [TRYON - LEAN, Y0, GF], [TRYON + 0.06, Y0, GF + 1.2])
  // the wrap onto the curve
  for (let i = 0; i < n; i++) {
    const a = RING[i], b = RING[(i + 1) % n]
    if (a[1] > 25 && b[1] > 25 && a[0] > 47 && b[0] > 47 && !(a[0] === TRYON && b[0] === TRYON)) grid(a, b, 0, edgeLen(a, b))
  }
}

// The OMNIMAX drum.
{
  const cx = -34, cy = -16, r = 12.5, seg = 20
  const ring: XY[] = Array.from({ length: seg }, (_, i) => [cx + r * Math.cos(i / seg * 2 * Math.PI), cy + r * Math.sin(i / seg * 2 * Math.PI)] as XY)
  wallsF(brick, ring, () => ROOF, () => DRUM - 0.6)
  wallsF(frame, ring, () => DRUM - 0.6, () => DRUM)
  capF(roof, ring, () => DRUM)
}

// Skylights over the central hall (NAIP): a run of glass on the roof.
{
  const S: XY[] = [[6, -4], [30, -4], [30, 8], [6, 8]]
  prism(sky, sky, S, ROOF - 0.2, ROOF + 0.8)
  const T: XY[] = [[-8, -22], [10, -22], [10, -12], [-8, -12]]
  prism(sky, sky, T, ROOF - 0.2, ROOF + 0.6)
}

if (import.meta.main) {
  const { save } = await import('./chi-aon-center')
  await save('clt-discovery-place', 'Discovery Place Science', ANCHOR, BEARING, [
    { part: brick, material: finish('discovery-brick', 0xa47b66) },
    { part: glass, material: { ...PALETTE.window } },
    { part: roof, material: PALETTE.roof },
    { part: frame, material: finish('discovery-frame', 0x55595f) },
    { part: sky, material: PALETTE.glass },
  ])
}
