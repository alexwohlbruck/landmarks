/**
 * Princess Tower, Dubai Marina — original procedural geometry, CC0-1.0.
 * bun generators/dubai-princess-tower.ts   (writes the low model and the detail LOD)
 * Uses the small facade kit exported by dubai-marina-101.ts.
 *
 * Frame: bearing 45.8 (the OSM outline's sides). Origin = area centroid of the outline
 * way/186351092 (55.1467718 E, 25.0886460 N), on the ground. Elevation 0.
 *
 * Form, as read from OSM and the photos:
 * - a square shaft (OSM 37.6 x 39.9 m) with stepped corners and a recessed glass bay up the
 *   middle of each face, in cream stone with grouped punched balcony windows;
 * - two decorated cornices (~291 and ~315 m), the upper shaft above them drawn 10% narrower,
 *   and the bays closed by round arches under the shaft-top cornice (~357 m);
 * - the crown: two stone drums ringed with dark arched openings and cornices (OSM part
 *   357-370 m, radius 17 m; 370-387 m dome part), the ribbed gold dome (to the published
 *   roof, 392-397 m) in bronze-gold with pale silver ribs between the gores, thin cornice
 *   rings at the foot of each drum and of the dome, a lantern and the spire to 413.4 m.
 *
 * Evidence
 * - OSM (API, fetched 2026-11-27): outline way/186351092 (building=apartments, 101 levels,
 *   height 357 = top floor, wikidata Q19492, checked against Wikidata "Princess Tower" at
 *   25.088625, 55.146858); crown parts way/295954577 (357-370 m), way/288039567 (370-387 m,
 *   roof:shape dome), way/295954576 (387-414 m, the spire). No podium is mapped; none drawn.
 * - Published: 413.4 m architectural height, 414 m spire tip, roof 392 m, top floor 356.9 m,
 *   101 storeys (Wikipedia "Princess Tower", CTBUH).
 * - Photos (Wikimedia Commons):
 *   "The Tallest Block (29839279175).jpg", Steven Straiton, CC BY 2.0, 2016, from the west
 *   (~290 deg): the crown, cornices, bays and the cream colour;
 *   https://commons.wikimedia.org/wiki/File:The_Tallest_Block_(29839279175).jpg
 *   "Dubai Marina Skyline.jpg", Norlando Pobre, CC BY 2.0, 2020, from the north-west:
 *   silhouette beside Marina 101 and 23 Marina;
 *   https://commons.wikimedia.org/wiki/File:Dubai_Marina_Skyline.jpg
 *   "Princess Tower 4-Dubai UAE-Andres Larin.jpg" and "Princess Tower2-Dubai UAE-Andres
 *   Larin.jpg", Saaremees, CC BY-SA 4.0, 2023: the foot and lower shaft;
 *   https://commons.wikimedia.org/wiki/File:Princess_Tower_4-Dubai_UAE-Andres_Larin.jpg
 *   "Princess Tower.png", Jackedi07, CC0: elevation diagram (crown proportions);
 *   https://commons.wikimedia.org/wiki/File:Princess_Tower.png
 * - No lidar, NAIP or Mapillary. Terrain: Mapterhorn z12 only.
 * - Look-only references: none.
 *
 * Numbers
 * - Published: 413.4 m tip, 357 m top floor (the crown's base), 101 storeys (3.53 m).
 * - Measured (OSM): plan, the crown drum radius (16.6 m) and its part heights.
 * - Estimated (photos): cornice heights, the upper shaft's 10% setback, the drum tiers
 *   (359-369, 370-377 m), the dome's top at 397 m (between OSM's 387 and the published roof
 *   392 m, drawn higher so the dome reads as tall as in the photos), the lantern; colours
 *   (#e0d6c6 stone, #bf9d6a bronze-gold, sampled from the 2016 photo and pulled to the palette).
 * - Invented: the window grouping (three storeys a panel, two bays a side); the cornice
 *   saw-tooth frieze is simplified.
 *
 * Doubts
 * - The real dome's bronze and silver stripes are drawn as bronze-gold gores with pale
 *   ribs (12 in the low model, 24 in the detail).
 * - The real faces carry continuous balconies; drawn as grouped punched windows so they do
 *   not become per-floor stripes.
 * - The east and south sides are seen only in distant shots; drawn symmetric.
 *
 * Night: windows glow; the crown (drums, cornices and dome) is floodlit, as in night photos.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { K, type P2 } from './taipei-101'
import { face, lathe, saveLods, type Layer } from './auckland-sky-tower'
import { rectFaces, onFace, facePanel, faceBox, rowsOf, baysOf, panelGrid, punched, wallsExcept, type Face } from './dubai-marina-101'

const ID = 'dubai-princess-tower'
const BEARING = 45.8
const ANCHOR = { lng: 55.1467718, lat: 25.088646 } // area centroid of the outline way/186351092
const proj = K.projector(ANCHOR.lng, ANCHOR.lat, BEARING)
const OUTLINE_LL: P2[] = [[55.1467823, 25.0888928], [55.1464991, 25.0886413], [55.1467612, 25.0883992], [55.1470445, 25.0886508]]
const ol = OUTLINE_LL.map(proj)
const X = ol.reduce((s, p) => s + Math.abs(p[0]), 0) / 4 // ~18.8 m (the 37.6 m sides)
const Y = ol.reduce((s, p) => s + Math.abs(p[1]), 0) / 4 // ~19.95 m (the 39.9 m sides)

const TOP = 413.4 // architectural height (CTBUH)
const FLOOR = 3.53 // 101 storeys to the top floor at 356.9 m
const LOBBY = 7
const CORNICE = [291, 315] // the two decorated cornices (photos)
const UP_K = 0.9 // the upper shaft (above the second cornice) is drawn 10% narrower
const SHAFT = 357 // top floor; the crown starts here
const NOTCH = 2.0 // the stepped corners
const BAY = 2.8 // half-width of the recessed glass bay in the middle of each face
const BAY_D = 0.8 // its recess

/** The plan at scale k: a rectangle with notched corners and a recessed bay in each face, CCW. */
function plan(k: number): P2[] {
  const r: P2[] = []
  for (const f of rectFaces(X * k, Y * k)) {
    const w = BAY * k
    r.push(onFace(f, -f.L + NOTCH, 0), onFace(f, -w, 0), onFace(f, -w, -BAY_D), onFace(f, w, -BAY_D), onFace(f, w, 0), onFace(f, f.L - NOTCH, 0), onFace(f, f.L - NOTCH, -NOTCH))
  }
  return r
}

type Set = { stone: Part; win: Part; bayGlass: Part; gold: Part; trim: Part; roof: Part }
const mk = (): Set => ({ stone: new Part(), win: new Part(), bayGlass: new Part(), gold: new Part(), trim: new Part(), roof: new Part() })

/** One shaft section from z0 to z1 at plan scale k: walls, windows and the glass bays. */
function section(s: Set, d: boolean, k: number, z0: number, z1: number) {
  const ring = plan(k)
  const sideEdge = (i: number) => i % 7 === 0 || i % 7 === 4
  const bayEdge = (i: number) => i % 7 === 2
  wallsExcept(s.stone, ring, z0, z1, (i) => (d && sideEdge(i)) || bayEdge(i))
  const rows = rowsOf(z0 + 0.6, z1 - 0.6, FLOOR * 3, 1.8)
  for (const f of rectFaces(X * k, Y * k)) {
    const w = BAY * k
    // the side zones: punched windows in two columns (balconies grouped three storeys a panel)
    for (const [a, b] of [[-f.L + NOTCH, -w], [w, f.L - NOTCH]] as [number, number][]) {
      const bays = baysOf(a, b, 2, 3.3)
      if (d) punched(s.stone, s.win, f, a, b, z0, z1, bays, rows, 0.4)
      else panelGrid(s.win, f, bays, rows, 0.05)
    }
    // the bay: a glass wall broken by pale stone spandrels at each group
    const fb: Face = { ...f, c: onFace(f, 0, -BAY_D) }
    facePanel(s.bayGlass, fb, -w, w, z0, z1, 0)
    for (const [, rb] of rows) facePanel(s.stone, fb, -w, w, rb, Math.min(rb + 0.9, z1), 0.06)
    if (d) for (const sx of [-w / 3, w / 3]) faceBox(s.trim, fb, sx - 0.25, sx + 0.25, z0, z1, 0, 0.3)
  }
}

/** A cornice: a band standing out, its top stepping back, with dentils in the detail model. */
function cornice(s: Set, d: boolean, k: number, z: number) {
  const ring = plan(k)
  K.band(s.trim, ring, z, z + 1.0, 0.7, 0.3)
  K.band(s.trim, ring, z + 1.0, z + 2.2, 1.0, 0.3)
  if (d) {
    // a frieze of small triangles under the cornice (the photos' saw-tooth band)
    for (const f of rectFaces(X * k, Y * k)) {
      for (const [a, b] of [[-f.L + NOTCH, -BAY * k], [BAY * k, f.L - NOTCH]] as [number, number][]) {
        const n = Math.max(2, Math.round((b - a) / 1.6))
        for (let i = 0; i < n; i++) {
          const s0 = a + ((b - a) * i) / n, s1 = a + ((b - a) * (i + 1)) / n
          const p0 = onFace(f, s0, 0.08), p1 = onFace(f, s1, 0.08), pm = onFace(f, (s0 + s1) / 2, 0.08)
          face(s.trim, [[p0[0], p0[1], z], [pm[0], pm[1], z - 1.3], [p1[0], p1[1], z]], [f.n[0], f.n[1], 0])
        }
      }
    }
  }
}

function build(s: Set, d: boolean) {
  const seg = d ? 32 : 16
  // the lobby plinth, a little wider, with tall glazing
  const base = K.offset(K.ccw(plan(1)), 0.5)
  K.prism(s.stone, base, 0, LOBBY, false)
  for (const f of rectFaces(X + 0.5, Y + 0.5)) panelGrid(s.win, f, baysOf(-f.L + 3, f.L - 3, d ? 5 : 3, 1.4), [[0.6, LOBBY - 1.2]], 0.05)
  K.band(s.trim, base, LOBBY - 0.8, LOBBY, 0.4, 0.3)

  // the shaft in three sections with the two cornices between
  section(s, d, 1, LOBBY, CORNICE[0])
  cornice(s, d, 1, CORNICE[0])
  section(s, d, 1, CORNICE[0] + 2.2, CORNICE[1])
  cornice(s, d, 1, CORNICE[1])
  K.cap(s.roof, plan(1), CORNICE[1] + 2.2, true, [plan(UP_K)])
  section(s, d, UP_K, CORNICE[1] + 2.2, SHAFT)
  // the bay heads: a round-headed arch closes each bay at the top (photos)
  for (const f of rectFaces(X * UP_K, Y * UP_K)) {
    const w = BAY * UP_K, fb: Face = { ...f, c: onFace(f, 0, -BAY_D) }
    const pts: V3[] = []
    for (let i = 0; i <= (d ? 12 : 8); i++) {
      const a = Math.PI * (i / (d ? 12 : 8)), q = onFace(fb, -w * Math.cos(a), 0.08)
      pts.push([q[0], q[1], SHAFT - 6 - w + w * Math.sin(a) + w])
    }
    // the spandrel above the arch, in stone
    const tl = onFace(fb, -w, 0.08), tr = onFace(fb, w, 0.08)
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1]
      const top = (q: V3): V3 => {
        const t = (q[0] - tl[0]) * f.t[0] + (q[1] - tl[1]) * f.t[1]
        const p = onFace(fb, -w + t, 0.08)
        return [p[0], p[1], SHAFT]
      }
      face(s.stone, [a, b, top(b), top(a)], [f.n[0], f.n[1], 0])
    }
    void tr
  }
  // the shaft top: a cornice and the square roof the crown stands on
  cornice(s, d, UP_K, SHAFT)
  K.cap(s.roof, plan(UP_K), SHAFT + 2.2, true)

  // ---- the crown (OSM parts: drum 357-370 m, dome 370-387 m, spire to 414 m; published
  // roof 392 m, tip 413.4 m), drawn from the photos: two drum tiers with dark arched
  // openings and cornices, a ribbed gold dome, a lantern and the spire
  const C: P2 = [0, 0]
  const D0 = SHAFT + 2.2
  // lower drum: stone with a ring of arched openings
  lathe(s.stone, C, [[16.6, D0], [16.6, 368]], seg)
  lathe(s.trim, C, [[16.6, 368], [17.2, 368.4], [17.2, 369.4], [14.6, 369.6]], seg, { top: true })
  // upper drum
  lathe(s.stone, C, [[14.6, 369.6], [14.6, 376]], seg)
  lathe(s.trim, C, [[14.6, 376], [15.3, 376.3], [15.3, 377.1], [13.4, 377.4]], seg, { top: true })
  // openings: dark arched panels round both drums (seen black in every photo)
  const ring = (r: number, z0: number, z1: number, n: number, w: number) => {
    for (let i = 0; i < n; i++) {
      const a = ((i + 0.5) * 2 * Math.PI) / n
      const f: Face = { c: [r * Math.cos(a), r * Math.sin(a)], t: [-Math.sin(a), Math.cos(a)], n: [Math.cos(a), Math.sin(a)], L: w }
      const hw = w / 2, steps = d ? 6 : 3, zs = z1 - hw
      const pts: V3[] = []
      const p0 = onFace(f, -hw, 0.12), p1 = onFace(f, hw, 0.12)
      pts.push([p0[0], p0[1], z0], [p1[0], p1[1], z0])
      for (let k = 0; k <= steps; k++) {
        const t = (k / steps) * Math.PI, q = onFace(f, hw * Math.cos(t), 0.12)
        pts.push([q[0], q[1], zs + hw * Math.sin(t)])
      }
      face(s.win, pts, [f.n[0], f.n[1], 0])
    }
  }
  ring(16.6, D0 + 1.2, 366.8, d ? 24 : 16, 3.0)
  ring(14.6, 370.6, 375.2, d ? 24 : 16, 2.2)
  // the dome: a slightly pointed profile in bronze-gold, with pale silver ribs between the
  // bronze gores (the 2016 photo's alternating stripes), standing just proud
  const prof: [number, number][] = []
  const DOME0 = 377.4, DOME1 = 397, R0 = 13.4
  for (let i = 0; i <= (d ? 10 : 6); i++) {
    const t = i / (d ? 10 : 6)
    prof.push([R0 * Math.cos((t * Math.PI) / 2) ** 0.75, DOME0 + (DOME1 - DOME0) * Math.sin((t * Math.PI) / 2) ** 1.4])
  }
  prof[prof.length - 1] = [1.4, DOME1]
  lathe(s.gold, C, prof, seg, { top: true })
  const NR = d ? 24 : 12, RW = d ? 0.7 : 1.0
  for (let i = 0; i < NR; i++) {
    const a = ((i + 0.5) * 2 * Math.PI) / NR
    const pts: V3[] = prof.map(([r, z]) => [(r + 0.25) * Math.cos(a), (r + 0.25) * Math.sin(a), z + 0.15] as V3)
    for (let k = 0; k < pts.length - 1; k++) {
      const p = pts[k], q = pts[k + 1]
      const w = RW * Math.max(0.25, prof[k + 1][0] / R0)
      const w0 = RW * Math.max(0.25, prof[k][0] / R0)
      const tx = -Math.sin(a), ty = Math.cos(a)
      face(s.trim, [[p[0] - tx * w0, p[1] - ty * w0, p[2]], [p[0] + tx * w0, p[1] + ty * w0, p[2]], [q[0] + tx * w, q[1] + ty * w, q[2]], [q[0] - tx * w, q[1] - ty * w, q[2]]], [Math.cos(a), Math.sin(a), 0.6])
    }
  }
  // thin cornice rings layering the crown: at the foot of each drum and round the dome's foot
  lathe(s.trim, C, [[16.6, D0 + 0.0], [17.1, D0 + 0.2], [17.1, D0 + 0.9], [16.6, D0 + 1.1]], seg)
  lathe(s.trim, C, [[14.6, 369.6], [15.0, 369.8], [15.0, 370.4], [14.6, 370.6]], seg)
  lathe(s.trim, C, [[13.4, 377.4], [13.9, 377.6], [13.8, 378.5], [13.3, 378.8]], seg)
  // the lantern and the spire
  lathe(s.gold, C, [[1.4, DOME1], [2.0, 398], [2.0, 399.2], [1.1, 400], [1.0, 400.6]], seg / 2)
  lathe(s.trim, C, [[1.0, 400.6], [0.8, 406], [0.4, 411], [0.05, TOP]], d ? 12 : 8)
}

// ---- materials: colours sampled from the 2016 daylight photo, pulled to the palette's lightness
const STONE: MaterialSpec = finish('princess-stone', 0xe0d6c6)
const WIN: MaterialSpec = { ...PALETTE.window, color: 0x707e8b }
const BAY_GLASS: MaterialSpec = windowVariant(2, 0x8398a8)
const GOLD: MaterialSpec = { ...finish('princess-gold', 0xbf9d6a, 0.5), floodlight: (p, n) => (p[2] > 377 ? (n[2] > 0.85 ? 0.4 : 1) : 0) }
const TRIM: MaterialSpec = { ...PALETTE.trim, floodlight: (p) => (p[2] > 356 && p[2] < 398 ? 0.8 : 0) }
const ROOF: MaterialSpec = PALETTE.roof
const layers = (s: Set): Layer[] => [
  { part: s.stone, material: STONE },
  { part: s.win, material: WIN },
  { part: s.bayGlass, material: BAY_GLASS },
  { part: s.gold, material: GOLD },
  { part: s.trim, material: TRIM },
  { part: s.roof, material: ROOF },
]

if (import.meta.main) {
  const low = mk(), det = mk()
  build(low, false)
  build(det, true)
  await saveLods(ID, 'Princess Tower', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the OSM outline centroid, on the ground',
    bearing: BEARING, height: TOP,
  }, 6500)
}
