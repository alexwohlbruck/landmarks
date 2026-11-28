/**
 * 23 Marina, Dubai Marina — original procedural geometry, CC0-1.0.
 * bun generators/dubai-23-marina.ts   (writes the low model and the detail LOD)
 * Uses the small facade kit exported by dubai-marina-101.ts.
 *
 * Frame: bearing 355.7 (the OSM octagon's main faces run at 85.7 / 175.6 degrees). Origin =
 * area centroid of the tower part way/907717855 (55.1507089 E, 25.0897481 N), on the
 * ground. Elevation 0.
 *
 * Form, as read from OSM and the photos:
 * - an octagonal shaft (OSM part, ~40 m across, made symmetric about its centroid) in a
 *   white frame: the four chamfer faces carry big blue glass panels in the frame (three or
 *   four storeys a panel, two columns), the four main faces glass behind stacked balconies
 *   between white end piers; pale bands at ~157 and ~239 m where the pattern changes;
 * - the crown: an eight-sided pyramid from 312 m, glass below and the open steel lattice
 *   above (drawn as a grey facet with bold white diagonals), four white ribs over the
 *   chamfers meeting under the spire, and the spire with its bulb to 392.4 m;
 * - the 20 m podium (OSM way/1575886769 and the outline way/186351097).
 *
 * Evidence
 * - OSM (API, fetched 2026-11-27): outline way/186351097 (building=apartments, 89 levels,
 *   height 395, wikidata Q216264, checked against Wikidata "23 Marina" at 25.089806,
 *   55.150611), tower part way/907717855, podium part way/1575886769 (height 20, 5 levels),
 *   spire part way/186351102 (height 393).
 * - Published: architectural height 392.4 m (CTBUH; Wikipedia gives 392.8), 88-89 storeys,
 *   top floor 313.5 m (Wikipedia "23 Marina", CTBUH).
 * - Photos (Wikimedia Commons):
 *   "Dubai Marina Skyline.jpg", Norlando Pobre, CC BY 2.0, 2020, from the north-west: the
 *   crown (ribs, lattice, glass band), the facade pattern, colours;
 *   https://commons.wikimedia.org/wiki/File:Dubai_Marina_Skyline.jpg
 *   "The Tallest Block (29839279175).jpg", Steven Straiton, CC BY 2.0, 2016, from the west;
 *   https://commons.wikimedia.org/wiki/File:The_Tallest_Block_(29839279175).jpg
 *   "Mage 2024-05-14 at 19.29.21.jpg", BS2024, CC BY-SA 4.0, 2024: the shaft close up;
 *   https://commons.wikimedia.org/wiki/File:Mage_2024-05-14_at_19.29.21.jpg
 * - No lidar, NAIP or Mapillary. Terrain: Mapterhorn z12 only.
 * - Look-only references: none.
 *
 * Numbers
 * - Published: 392.4 m tip, 313.5 m top floor. Measured (OSM): plan, podium (20 m).
 * - Estimated (2020 photo, scaled to 392.4 m): the shoulder at 312 m, the ribs' apex at
 *   362 m, the glass share of the pyramid (40%), the spire's bulb at 388 m, the bands.
 * - Invented: the balcony rhythm (every three storeys in the low model, two in the detail;
 *   the real ones are every storey), the lattice members (four bold bars a facet).
 *
 * Doubts
 * - Which faces carry the balconies rests on the north-west photos; the south and east sides
 *   are only seen far off. Drawn symmetric.
 * - The real crown has "columns" (tall slender ribs/fins) around a smaller glass core; drawn
 *   as four ribs on a pyramid.
 * - The low model's balcony slabs have no soffits (budget); from street level they show as
 *   open boxes.
 *
 * Night: windows glow; the white crown frame and ribs are floodlit; the lattice stays dark.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { K, type P2 } from './taipei-101'
import { face, lathe, saveLods, type Layer } from './auckland-sky-tower'
import { onFace, facePanel, faceBox, rowsOf, baysOf, panelGrid, punched, wallsExcept, type Face } from './dubai-marina-101'

const ID = 'dubai-23-marina'
const BEARING = 355.7 // the main faces run at 85.7 / 175.6 degrees (OSM way/907717855)
const ANCHOR = { lng: 55.1507089, lat: 25.0897481 } // area centroid of the tower part way/907717855
const proj = K.projector(ANCHOR.lng, ANCHOR.lat, BEARING)
const TOWER_LL: P2[] = [[55.1506098, 25.089919], [55.1505092, 25.0898136], [55.1505226, 25.0896557], [55.1506396, 25.0895656], [55.1508084, 25.0895773], [55.1509085, 25.0896824], [55.1508951, 25.0898403], [55.1507786, 25.0899307]]
const PODIUM_LL: P2[] = [[55.1506901, 25.0900624], [55.1503401, 25.0896908], [55.150766, 25.0893485], [55.1510529, 25.0896415], [55.1510385, 25.0898037], [55.1506998, 25.0900552]]

const TOP = 392.4 // architectural height (CTBUH)
const PODIUM = 20 // OSM way/1575886769: height 20, 5 levels
const FLOOR = 3.52 // 89 storeys; top floor 313.5 m
const BANDS = [157, 239] // the pale bands where the glazing pattern changes (2020 photo)
const SHOULDER = 312 // top of the shaft; the pyramid starts here (photos)
const APEX = 362 // the pyramid's ribs meet here (photos)
const BALC_TOP = 306

// the octagon: OSM's eight corners, made symmetric about the centroid (opposite corners averaged)
const raw = K.ccw(TOWER_LL.map(proj))
const OCT: P2[] = raw.map((p, i) => {
  const q = raw[(i + 4) % 8]
  return [(p[0] - q[0]) / 2, (p[1] - q[1]) / 2] as P2
})
/** The eight faces, CCW; `main` marks the long faces (glass), the others are the balconied chamfers. */
const FACES: (Face & { main: boolean })[] = OCT.map((a, i) => {
  const b = OCT[(i + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const ang = ((Math.atan2(t[0], t[1]) * 180) / Math.PI + 360) % 90
  return { c: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], t, n: [t[1], -t[0]], L: L / 2, main: ang < 20 || ang > 70 }
})

type Set = { frame: Part; glass: Part; crownGlass: Part; lattice: Part; stone: Part; roof: Part }
const mk = (): Set => ({ frame: new Part(), glass: new Part(), crownGlass: new Part(), lattice: new Part(), stone: new Part(), roof: new Part() })

function build(s: Set, d: boolean) {
  // ---- podium (OSM way/1575886769, 20 m), pale stone with a band of dark shopfront glazing
  const pod = K.ccw(PODIUM_LL.map(proj))
  K.prism(s.stone, pod, 0, PODIUM - 1.0, false)
  K.band(s.frame, pod, PODIUM - 1.0, PODIUM, 0.4, 0.4)
  K.cap(s.roof, pod, PODIUM, true, [OCT])
  for (let i = 0; i < pod.length; i++) {
    const a = pod[i], b = pod[(i + 1) % pod.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 4) continue
    const t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const f: Face = { c: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], t, n: [t[1], -t[0]], L: L / 2 }
    panelGrid(s.glass, f, baysOf(-L / 2 + 1.5, L / 2 - 1.5, Math.max(1, Math.round(L / (d ? 6 : 12))), 1.2), [[0.8, 5.6], [8.5, 17.5]], 0.05)
  }

  // ---- the shaft: white frame walls. The chamfers carry the big blue glass panels in the
  // white frame (grouped three or four storeys a panel, two columns); the main faces carry
  // glass behind stacked balcony slabs (photos 2016, 2020, 2024: seen from the north-west
  // the balconies show on the faces either side of a glazed chamfer)
  // walls (in the detail model the punched faces bring their own, so they are left out here)
  wallsExcept(s.frame, OCT, PODIUM, SHOULDER, (i) => d || !FACES[i].main)
  if (d) for (const f of FACES) if (f.main) {
    facePanel(s.frame, f, -f.L, f.L, PODIUM, PODIUM + 2, 0)
    facePanel(s.frame, f, -f.L, f.L, BALC_TOP, SHOULDER, 0)
    for (const e of [-1, 1]) facePanel(s.frame, f, e > 0 ? f.L - 1.4 : -f.L, e > 0 ? f.L : -f.L + 1.4, PODIUM + 2, BALC_TOP, 0)
  }
  for (const f of FACES) {
    if (!f.main) {
      const rows = [
        ...rowsOf(PODIUM + 1, BANDS[0] - 1.5, FLOOR * 3, 1.6),
        ...rowsOf(BANDS[0] + 1.5, BANDS[1] - 1.5, FLOOR * 4, 1.6),
        ...rowsOf(BANDS[1] + 1.5, SHOULDER - 2.5, FLOOR * 4, 1.6),
      ]
      const bays = baysOf(-f.L, f.L, 2, 2.2)
      punched(s.frame, s.glass, f, -f.L, f.L, PODIUM, SHOULDER, bays, rows, 0.5)
    } else {
      // the main face: a glass wall behind the balconies, between white end piers
      if (d) punched(s.frame, s.glass, f, -f.L + 1.4, f.L - 1.4, PODIUM + 2, BALC_TOP, baysOf(-f.L + 1.4, f.L - 1.4, 2, 0.6), rowsOf(PODIUM + 2, BALC_TOP, FLOOR * 2, 0.5), 0.15)
      else facePanel(s.glass, f, -f.L + 1.4, f.L - 1.4, PODIUM + 2, BALC_TOP, 0.05)
      // balcony slabs every three storeys (two in the detail model; the real ones are every
      // storey), 1.6 m deep
      const step = FLOOR * (d ? 2 : 3)
      for (let z = PODIUM + step; z < BALC_TOP; z += step) faceBox(s.frame, f, -f.L + 1.4, f.L - 1.4, z - 0.45, z + 0.45, 0, 1.2, true, d)
      for (const e of [-1, 1]) faceBox(s.frame, f, e > 0 ? f.L - 1.4 : -f.L, e > 0 ? f.L : -f.L + 1.4, PODIUM, SHOULDER - 1.5, 0, 1.0)
    }
  }
  for (const z of BANDS) K.band(s.frame, OCT, z - 1.3, z + 1.3, 0.5, 0.3)
  K.band(s.frame, OCT, SHOULDER - 2, SHOULDER, 0.7, 0.3)

  // ---- the crown: an eight-sided pyramid, glass below and the open steel lattice above
  // (photos), with four white ribs standing proud over the chamfers and meeting under the
  // spire
  const apex: V3 = [0, 0, APEX]
  const GL = 0.4 // share of the pyramid's height glazed before the lattice starts
  for (let i = 0; i < 8; i++) {
    const a = OCT[i], b = OCT[(i + 1) % 8], f = FACES[i]
    const A: V3 = [a[0], a[1], SHOULDER], B: V3 = [b[0], b[1], SHOULDER]
    const lerp = (p: V3, t: number): V3 => [p[0] + (apex[0] - p[0]) * t, p[1] + (apex[1] - p[1]) * t, p[2] + (apex[2] - p[2]) * t]
    const e1 = [B[0] - A[0], B[1] - A[1], 0], e2 = [apex[0] - A[0], apex[1] - A[1], apex[2] - A[2]]
    const n: V3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
    const nn: V3 = n[0] * f.n[0] + n[1] * f.n[1] < 0 ? [-n[0], -n[1], -n[2]] : n
    face(s.crownGlass, [A, B, lerp(B, GL), lerp(A, GL)], nn)
    face(s.lattice, [lerp(A, GL), lerp(B, GL), apex], nn)
    // a white band where the glass meets the lattice
    const off = (p: V3, o: number): V3 => { const l = Math.hypot(...nn); return [p[0] + (nn[0] / l) * o, p[1] + (nn[1] / l) * o, p[2] + (nn[2] / l) * o] }
    face(s.frame, [off(lerp(A, GL - 0.03), 0.1), off(lerp(B, GL - 0.03), 0.1), off(lerp(B, GL + 0.03), 0.1), off(lerp(A, GL + 0.03), 0.1)], nn)
    {
      // the lattice's members: a few bold diagonals standing just proud of the facet
      const bars: [number, number, number, number][] = [[0.0, GL, 0.5, 0.75], [1.0, GL, 0.5, 0.75], [0.5, GL, 0.0, 0.75], [0.5, GL, 1.0, 0.75]]
      const side: V3 = [(B[0] - A[0]) / (2 * f.L), (B[1] - A[1]) / (2 * f.L), 0]
      for (const [u0, t0, u1, t1] of bars) {
        const P = (u: number, t: number): V3 => off(lerp([A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u, SHOULDER], t), 0.12)
        const p0 = P(u0, t0), p1 = P(u1, t1), w = 0.35
        face(s.frame, [[p0[0] - side[0] * w, p0[1] - side[1] * w, p0[2]], [p0[0] + side[0] * w, p0[1] + side[1] * w, p0[2]], [p1[0] + side[0] * w, p1[1] + side[1] * w, p1[2]], [p1[0] - side[0] * w, p1[1] - side[1] * w, p1[2]]], nn)
      }
    }
  }
  // the ribs: a white fin over the middle of each chamfer facet, from the shoulder to the apex
  for (let i = 0; i < 8; i++) {
    if (FACES[i].main) continue
    const m: P2 = [(OCT[i][0] + OCT[(i + 1) % 8][0]) / 2, (OCT[i][1] + OCT[(i + 1) % 8][1]) / 2]
    const l = Math.hypot(m[0], m[1]), u: P2 = [m[0] / l, m[1] / l], v: P2 = [-u[1], u[0]]
    const w = 1.3, o = 1.8
    const pts: P2[] = [[m[0] + u[0] * o - v[0] * w, m[1] + u[1] * o - v[1] * w], [m[0] + u[0] * o + v[0] * w, m[1] + u[1] * o + v[1] * w], [m[0] - u[0] * 2 + v[0] * w, m[1] - u[1] * 2 + v[1] * w], [m[0] - u[0] * 2 - v[0] * w, m[1] - u[1] * 2 - v[1] * w]]
    const bot = pts.map((q) => [q[0], q[1], SHOULDER - 2] as V3)
    const top: V3[] = pts.map((q, k) => [q[0] * 0.08 + (k < 2 ? u[0] * 0.6 : 0), q[1] * 0.08 + (k < 2 ? u[1] * 0.6 : 0), APEX + 1] as V3)
    for (let k = 0; k < 4; k++) {
      const j = (k + 1) % 4
      const e: P2 = [pts[j][0] - pts[k][0], pts[j][1] - pts[k][1]]
      face(s.frame, [bot[k], bot[j], top[j], top[k]], [e[1], -e[0], 0.3])
    }
  }
  // the spire: a white needle with a pointed bulb near its top
  lathe(s.frame, [0, 0], [[1.8, APEX - 1], [1.4, APEX + 3], [1.0, 384], [1.0, 387], [1.6, 388.2], [0.9, 389.6], [0.3, 391], [0.05, TOP]], d ? 12 : 8)
}

// ---- materials: colours sampled from the 2016, 2020 and 2024 photos, pulled to the palette
const FRAME: MaterialSpec = { ...PALETTE.trim, color: 0xf2efe8, floodlight: (p, n) => (p[2] > SHOULDER - 2 && n[2] < 0.9 ? 0.8 : 0) }
const GLASS: MaterialSpec = { ...PALETTE.window, color: 0x6e8fb4 }
const CROWN_GLASS: MaterialSpec = windowVariant(2, 0x7d9cbc)
const LATTICE: MaterialSpec = finish('m23-lattice', 0x8792a0)
const STONE: MaterialSpec = PALETTE.stone
const ROOF: MaterialSpec = PALETTE.roof
const layers = (s: Set): Layer[] => [
  { part: s.frame, material: FRAME },
  { part: s.glass, material: GLASS },
  { part: s.crownGlass, material: CROWN_GLASS },
  { part: s.lattice, material: LATTICE },
  { part: s.stone, material: STONE },
  { part: s.roof, material: ROOF },
]

if (import.meta.main) {
  const low = mk(), det = mk()
  build(low, false)
  build(det, true)
  await saveLods(ID, '23 Marina', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the OSM tower part centroid, on the ground',
    bearing: BEARING, height: TOP,
  }, 6500)
}
