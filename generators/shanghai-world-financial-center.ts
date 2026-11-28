/**
 * Shanghai World Financial Center, Lujiazui, Shanghai — original procedural
 * geometry, CC0-1.0.
 * bun generators/shanghai-world-financial-center.ts   (low model and detail LOD)
 *
 * Frame: BEARING 355, so model +y points to compass 355 and +x to 85: the
 * tower's square plan is axis-aligned in this frame. Origin = area centroid
 * of the OSM outline way/10691100 (121.503041 E, 31.236577 N), on the plaza.
 * y = 0 is the plaza; elevation 0.
 *
 * Form, as read from OSM and the photos:
 * - a square prism, 59.4 m a side (OSM), cut by two curved faces that sweep
 *   from the north-west and south-east corners at the foot to the SW-NE
 *   diagonal at the top, so the plan narrows from a square to a long thin
 *   hexagon and the top is a single edge 83 m long and ~9 m thick; the four
 *   flat faces narrow to tall triangles, the SW and NE corners rise plumb to
 *   the top. The cut is drawn with a curve fitted to the 2025 photo from the
 *   west (the face boundary bows a little: w = W0 - (W0 - 4.5) (z/492)^1.2);
 * - the aperture: a trapezoidal hole straight through the crown (NW-SE),
 *   440-477 m, wider at the top (60 m along the diagonal) than at the floor
 *   (40 m), with real reveals: two pillars at the SW and NE corners and the
 *   15 m top bar over the hole; the observatory (floor 100, 472-477 m) hangs
 *   across the hole's top and the skywalk (floor 97) crosses its floor, both
 *   as glazed boxes (`glass`);
 * - the edges lit at night: the plumb corners, the curved faces' edges and the
 *   top, drawn as slim pale strips (`neon-swfc-edge`, cyan at night as in the
 *   night photo);
 * - the dark louvre bands of the mechanical floors, every ~12 floors, as
 *   shallow recessed bands on the flat faces (detail only).
 * The SWFC podium (OSM way/165591946, 5 levels) is a separate building that
 * wraps the tower foot; it is left to the map.
 *
 * Evidence
 * - OSM, fetched 2026-11-27 with tools/osm.py: outline way/10691100 (height
 *   492, 101 levels, Q80852) and its parts way/279942892 (470-492 m, the top
 *   strip along the SW-NE diagonal), 279942893-279942903 (430/470 m).
 * - Published: 492 m, 101 floors, Kohn Pedersen Fox, completed 2008; the
 *   observatory floors 94, 97 (skywalk at 439 m) and 100 (474 m); the
 *   trapezoidal aperture (Wikipedia "Shanghai World Financial Center";
 *   CTBUH Skyscraper Center).
 * - Photos (Wikimedia Commons, daylight unless noted):
 *   "Shanghai Tower, Shanghai World Financial Center and Jin Mao Tower 20251126.jpg",
 *   Supanut Arunopra, CC BY 4.0, from the west (~281): the curved face and the
 *   flat face, the plumb SW corner, the aperture's trapezoid, the louvre
 *   bands; https://commons.wikimedia.org/wiki/File:Shanghai_Tower,_Shanghai_World_Financial_Center_and_Jin_Mao_Tower_20251126.jpg
 *   "Pudong Shanghai November 2017 panorama.jpg", King of Hearts, CC BY-SA 4.0,
 *   from the Bund (~281): heights of the aperture and bar against 492 m,
 *   relative heights; https://commons.wikimedia.org/wiki/File:Pudong_Shanghai_November_2017_panorama.jpg
 *   "Shanghai World Financial Center (Top).jpg", Gerbil, CC BY-SA 3.0: the
 *   crown, aperture and glass colour;
 *   https://commons.wikimedia.org/wiki/File:Shanghai_World_Financial_Center_(Top).jpg
 *   "Shanghai World Financial Center 20260418.jpg", DvTor8303, CC0, from the
 *   NW (~318) at the foot: the curved face rising to the top edge, colour;
 *   https://commons.wikimedia.org/wiki/File:Shanghai_World_Financial_Center_20260418.jpg
 *   "Shanghai World Financial Center from Shanghai Tower.png", Sebastiandoe5,
 *   CC BY-SA 4.0, from above (SSW): the crown seen from above, the slim top
 *   edge; https://commons.wikimedia.org/wiki/File:Shanghai_World_Financial_Center_from_Shanghai_Tower.png
 *   "Shanghai World Financial Center at night 03.JPG", Römert, CC BY-SA 3.0,
 *   at night: the cyan LED lines on the edges;
 *   https://commons.wikimedia.org/wiki/File:Shanghai_World_Financial_Center_at_night_03.JPG
 * - No lidar, NAIP or Mapillary over Shanghai (batch notes).
 * - Look-only references: none.
 *
 * Numbers
 * - Published: 492 m top; the skywalk (439 m, floor 97) at the aperture's
 *   floor, the observatory (474 m, floor 100) in the bar above it.
 * - Measured (OSM): the square (59.4 m, turned 5 deg), the top strip's width
 *   at 470 m (~16 m, OSM; drawn 13 m).
 * - Measured (photo, panorama scaled to the tower's projected width, 4.9 px/m):
 *   the aperture 440-477 m with the observatory's glass band 472-477 m inside
 *   its top, the top bar 477-492 m, the aperture's width along the diagonal
 *   (~59 m at its top, ~41 m at its floor); the curve of the face boundary
 *   (2025 photo).
 * - Estimated: the exponent of the sweep (1.2); the louvre bands (every 50 m);
 *   colours sampled from the 2026, 2025 and Top photos (#6e8a9d-#9bb5ca
 *   glass, pulled to #8299ab).
 * - Invented: none of the massing.
 *
 * Doubts
 * - The aperture's side faces are drawn plane and leaning; the real reveals
 *   are slightly curved.
 * - The curve of the sweep near the foot is hidden by the podium in every
 *   photo; it is drawn starting at the plaza.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { face, prism, saveLods, type Layer, type XY } from './auckland-sky-tower'
import { gridSurface } from './shanghai-tower'

const H = 492
const h = 29.7 // half side
const S2 = Math.SQRT2
const W0 = h * S2 - 0.5 // a small chamfer at the foot
const WT = 4.5 // half thickness of the top edge
const w = (z: number) => W0 - (W0 - WT) * Math.pow(Math.min(z, H) / H, 1.2)
const AP0 = 440, AP1 = 477 // the aperture's floor and its top edge
const uHole = (z: number) => 20 + ((z - AP0) / (AP1 - AP0)) * 10 // half width of the aperture along the diagonal

/** (u along SW->NE, v toward NW) -> map frame */
const UV = (u: number, v: number, z: number): V3 => [(u - v) / S2, (u + v) / S2, z]

/** The plan at z, counter-clockwise from above: the square cut by |v| <= w. */
function hexagon(z: number): V3[] {
  const c = w(z) * S2
  return [[-h, -h, z], [-h + c, -h, z], [h, h - c, z], [h, h, z], [h - c, h, z], [-h, -h + c, z]]
}
/** A pillar's plan at z (u >= uh, or mirrored), counter-clockwise. */
function pillar(z: number, sign: 1 | -1): V3[] {
  const ww = w(z), L = h * S2, uh = uHole(z)
  const pts = [UV(uh, -ww, z), UV(L - ww, -ww, z), UV(L, 0, z), UV(L - ww, ww, z), UV(uh, ww, z)]
  return sign === 1 ? pts : pts.map(([x, y, zz]) => [-x, -y, zz] as V3)
}

type Set = { glass: Part; edge: Part; hole: Part; roof: Part; dark: Part }
const mk = (): Set => ({ glass: new Part(), edge: new Part(), hole: new Part(), roof: new Part(), dark: new Part() })

const cap = (p: Part, ring: V3[], up: boolean) => face(p, ring, [0, 0, up ? 1 : -1])

function build(s: Set, d: boolean) {
  const step = d ? 4 : 12
  const lv = (a: number, b: number) => {
    const out: number[] = []
    for (let z = a; z < b - 1e-6; z += step) out.push(z)
    out.push(b)
    return out
  }
  const allCrease = () => true
  // the shaft up to the aperture floor
  gridSurface(lv(0, AP0).map(hexagon), true, () => s.glass, allCrease)
  cap(s.roof, hexagon(AP0), true)
  // the two pillars beside the aperture
  for (const sg of [1, -1] as const) {
    const rows = lv(AP0, AP1).map((z) => pillar(z, sg))
    gridSurface(rows, true, (i) => (i === 4 ? s.glass : s.glass), allCrease)
  }
  // the top bar over the aperture
  gridSurface(lv(AP1, H).map(hexagon), true, () => s.glass, allCrease)
  cap(s.hole, hexagon(AP1), false)
  // the aperture's floor (the skywalk) and ceiling read as glass: over the floor a glazed strip
  {
    const z = AP0, ww = w(z), uh = uHole(z)
    face(s.hole, [UV(-uh, -ww, z + 0.05), UV(uh, -ww, z + 0.05), UV(uh, ww, z + 0.05), UV(-uh, ww, z + 0.05)], [0, 0, 1])
  }

  // the skywalk across the aperture's foot: a glazed box 3 m high, set back 2 m from each face
  {
    const z0 = AP0, z1 = AP0 + 3, ww = w(z1) - 2, uh = uHole(z0) + 0.5
    const r = (z: number) => [UV(-uh, -ww, z), UV(uh, -ww, z), UV(uh, ww, z), UV(-uh, ww, z)] as V3[]
    gridSurface([r(z0), r(z1)], true, () => s.hole, () => true)
    cap(s.roof, r(z1), true)
  }
  // the observatory under the bar (floor 100): a glazed box hung across the aperture's top
  {
    const z0 = AP1 - 5, z1 = AP1, ww = w(z1) - 1, uh = uHole(z0)
    const r = (z: number) => [UV(-uh, -ww, z), UV(uh, -ww, z), UV(uh, ww, z), UV(-uh, ww, z)] as V3[]
    gridSurface([r(z0), r(z1)], true, () => s.hole, () => true)
    cap(s.roof, r(z0), false)
  }

  // ---- edges: slim strips on the plumb corners, along the curved faces' edges and round the top ----
  const EW = d ? 0.7 : 1.1, EO = 0.12
  const zs = lv(0, H)
  // plumb corners SW and NE: a strip on each of the two faces meeting there
  for (const sg of [1, -1]) {
    for (const [n, inward] of [[[0, sg, 0], [-sg, 0, 0]], [[sg, 0, 0], [0, -sg, 0]]] as [V3, V3][]) {
      const c: V3 = [sg * h + n[0] * EO, sg * h + n[1] * EO, 0]
      const q = (t: number, z: number): V3 => [c[0] + inward[0] * t, c[1] + inward[1] * t, z]
      face(s.edge, [q(0, 0), q(EW, 0), q(EW, H), q(0, H)], n)
    }
  }
  // the curved faces' edges: on each flat face, from the boundary point inward along that face
  const curvedEdges: [number, V3, V3][] = [
    [1, [0, -1, 0], [-1, 0, 0]], // south face, flat part toward the SW corner
    [2, [1, 0, 0], [0, 1, 0]], // east face, toward NE
    [4, [0, 1, 0], [1, 0, 0]], // north face, toward NE
    [5, [-1, 0, 0], [0, -1, 0]], // west face, toward SW
  ]
  for (const [vi, n, inward] of curvedEdges) {
    const pts = zs.slice(0, -1).map((z) => hexagon(z)[vi])
    for (let k = 0; k < pts.length - 1; k++) {
      const a = pts[k], b = pts[k + 1]
      const o = (p: V3, t: number): V3 => [p[0] + inward[0] * t + n[0] * EO, p[1] + inward[1] * t + n[1] * EO, p[2]]
      face(s.edge, [o(a, 0), o(a, EW), o(b, EW), o(b, 0)], n)
    }
  }
  // round the top: a slim pale coping
  {
    const grow = (r: V3[]) => r.map(([x, y, z]) => [x * 1.005, y * 1.005, z] as V3)
    const t0 = grow(hexagon(H - 1.5)), t1 = grow(hexagon(H))
    gridSurface([t0, t1], true, () => s.edge, allCrease)
    cap(s.edge, t1, true)
  }
  // the aperture's outline: a pale reveal frame on both faces
  for (const sv of [1, -1]) {
    for (const z of [AP0, AP1]) {
      const ww = w(z) * sv + sv * EO, uh = uHole(z)
      const a = UV(-uh - 0.6, ww, z - 0.6), b = UV(uh + 0.6, ww, z - 0.6), c = UV(uh + 0.6, ww, z + 0.6), dd = UV(-uh - 0.6, ww, z + 0.6)
      face(s.edge, [a, b, c, dd], [-sv / S2, sv / S2, 0])
    }
  }

  // ---- louvre bands of the mechanical floors: shallow dark bands on the flat faces ----
  const bands = d ? [55, 105, 155, 205, 255, 305, 355, 405] : [105, 205, 305, 405]
  const BH = d ? 1.6 : 2.2
  for (const z of bands) {
    const r0 = hexagon(z), r1 = hexagon(z + BH)
    // flat faces only: edges 0-1 (south), 2-3 (east), 3-4 (north), 5-0 (west)
    for (const [i, j, n] of [[0, 1, [0, -1, 0]], [2, 3, [1, 0, 0]], [3, 4, [0, 1, 0]], [5, 0, [-1, 0, 0]]] as [number, number, V3][]) {
      const o = (p: V3): V3 => [p[0] + n[0] * 0.06, p[1] + n[1] * 0.06, p[2]]
      // keep the band inside the face: pull its ends in by 1.5 m
      const a = r0[i], b = r0[j]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 6) continue
      const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
      const A: V3 = o([a[0] + ux * 1.5, a[1] + uy * 1.5, z]), B: V3 = o([b[0] - ux * 1.5, b[1] - uy * 1.5, z])
      face(s.dark, [A, B, [B[0], B[1], z + BH], [A[0], A[1], z + BH]], n)
    }
  }
  // maintenance crane arm on the roof (detail; seen in the 2025 photo)
  if (d) {
    const p = UV(-30, 0, H)
    prism(s.edge, [[p[0] - 0.6, p[1] - 0.6], [p[0] + 0.6, p[1] - 0.6], [p[0] + 0.6, p[1] + 0.6], [p[0] - 0.6, p[1] + 0.6]], H, H + 4)
  }
}

// ---- Materials and output ----------------------------------------------------------------------

const GLASS: MaterialSpec = { ...PALETTE.window, color: 0x8299ab }
const EDGE: MaterialSpec = finish('neon-swfc-edge', 0xb2dbe8, 0.5)
const HOLE: MaterialSpec = PALETTE.glass
const ROOF: MaterialSpec = PALETTE.roof
const DARK: MaterialSpec = finish('swfc-louvre', 0x5d6b77, 0.6)
const layers = (s: Set): Layer[] => [
  { part: s.glass, material: GLASS },
  { part: s.edge, material: EDGE },
  { part: s.hole, material: HOLE },
  { part: s.roof, material: ROOF },
  { part: s.dark, material: DARK },
]

if (import.meta.main) {
  const low = mk(), det = mk()
  build(low, false)
  build(det, true)
  await saveLods('shanghai-world-financial-center', 'Shanghai World Financial Center', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the OSM outline centroid, on the plaza; bearing 355',
    bearing: 355, height: H,
  }, 5000)
}
