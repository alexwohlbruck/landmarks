/**
 * Iconic Tower, Central Business District, New Administrative Capital, Egypt: original procedural
 * geometry, CC0-1.0.
 * bun generators/egypt-iconic-tower.ts   (writes the low model and the detail LOD)
 *
 * Frame: bearing 45 (model +x runs south-east, +y north-east). Origin at the centroid of the OSM
 * outline way/819256088 (31.6938483 E, 30.0127354 N), on the ground; elevation 0. Mapterhorn (z15)
 * shows the site flat to within 0.7 m.
 *
 * Form, as read from the photos: an obelisk-like tower of two "plumes" (Amun's double-feather
 * Shuti crown, per the published concept) on a near-elliptical plan, split by a narrow dark slot
 * that is open full height at the north-west end; the shaft swells slightly to a third of its
 * height and narrows towards the top, where each plume ends in a rounded crest, the north-east
 * one higher; continuous white horizontal fins wrap the plumes over silver-blue glass; a dark
 * frame stands in the slot at the top.
 *
 * Evidence
 * - OSM (API map call, fetched 2026-11-27): way/819256088 (building=commercial, name البرج
 *   الأيقوني / The Iconic Tower, height 394, 77 levels, wikidata Q102281065). Wikidata Q102281065
 *   is "Iconic Tower" in Egypt, 393.8 m, at 30.01278 N 31.69389 E (on the outline): checked (the
 *   Dhaka tower of the same English name is a different item). No other building or part within
 *   120 m.
 * - Published (Wikipedia "Iconic Tower (Egypt)", retrieved 2026-11-27; Wikidata): 393.8-394 m,
 *   77 floors, topped out 2021, completed 2024; Dar al-Handasah; obelisk and Shuti-crown concept.
 * - Photos (Wikimedia Commons):
 *   "Iconic Tower Egypt(18-6-2023) (cropped).jpg", Mohamed Ouda, CC BY-SA 4.0: the finished
 *   cladding, the profile (measured, below), the slot at the left edge, the rounded crest;
 *   https://commons.wikimedia.org/wiki/File:Iconic_Tower_Egypt(18-6-2023)_(cropped).jpg
 *   "Iconic Tower Egypt(18-6-2023).jpg", Mohamed Ouda, CC BY-SA 4.0: the whole tower in the CBD;
 *   https://commons.wikimedia.org/wiki/File:Iconic_Tower_Egypt(18-6-2023).jpg
 *   "Iconic Tower Egypt.jpg", Mohamed Ouda, CC BY-SA 4.0, April 2022, camera 30.007158 N
 *   31.688343 E (810 m to the south-west, from the file's coordinates): the slot on the
 *   north-west edge, the plan's width across the slot direction (~63 m), the crown frame;
 *   https://commons.wikimedia.org/wiki/File:Iconic_Tower_Egypt.jpg
 *   "Central business district, New Administrative Capital.jpg" and "... 3 ...jpg",
 *   Abdelrhman 1990, CC BY-SA 4.0 (May 2023): the fins and glass in sun and shade;
 *   https://commons.wikimedia.org/wiki/File:Central_business_district,_New_Administrative_Capital.jpg
 *   https://commons.wikimedia.org/wiki/File:Central_business_district_3,_New_Administrative_Capital.jpg
 *   "Iconic Tower Maquette.jpg", Ziad Rashad, CC0 (a photo of the developer's model): the two
 *   plumes and the slot between them;
 *   https://commons.wikimedia.org/wiki/File:Iconic_Tower_Maquette.jpg
 * - No lidar, NAIP or Mapillary here (batch notes). Look-only references: none.
 *
 * Numbers
 * - Published: 393.8 m top (the north-east plume's crest).
 * - Measured (Ouda cropped, scaled to 393.8 m, 2.56 px/m): widths relative to the widest, 0.94 at
 *   the foot, 1.0 from ~140 to ~220 m, 0.955 at 300, 0.90 at 355, 0.83-0.84 at the top; the
 *   widest ~60 m; the second crest ~8 m lower. (SW photo) ~63 m across the slot direction.
 * - Estimated: the plan's half-axes 31.5 x 29 m (photos; OSM's 76 m circle is larger, so the
 *   model stays inside it); the slot 6.4 m wide, 5 m deep; the crest curves; fins grouped
 *   every two storeys (10.2 m), 1 m deep; colours sampled: overall #8f98a2 / #858e98 (fins and
 *   glass together), shade #66737a; fins drawn #e6e8e8, glass #93a2b0, slot #56616c.
 *
 * Doubts
 * - The finished tower is photographed only from the south-west and south: whether the slot is
 *   also open at the south-east end is not shown (drawn closed); the plumes' tops are read from
 *   one photo taken while a crane still stood on the crown.
 * - The slot sweeps in a gentle S-curve near the foot in both Ouda photos; it is drawn straight.
 * - The real fins are one per storey; they are grouped two storeys to a fin.
 * - The plan's orientation (slot running north-west to south-east) is read from the photos'
 *   camera directions, not from a drawing; OSM's outline is a plain circle.
 *
 * Night: the glass glows as windows; the fins carry a light floodlight; no night photo was found.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { face, saveLods, type Layer, type XY } from './auckland-sky-tower'
import { gridSurface } from './shanghai-tower'

// ---- Frame: bearing 45, so model +x (u) runs south-east along the slot and +y (v) north-east ----

const TOP = 393.8 // published
const TOP2 = 386 // the second plume's crest (photos)
const A = 31.5, B = 29 // the plan's half-axes along and across the slot (photos, inside OSM's 76 m circle)
const G = 3.2 // half-width of the slot between the plumes
// plan scale by height, measured off Ouda's photo (widest at a third of the height)
const PROF: [number, number][] = [[0, 0.94], [60, 0.97], [140, 1.0], [220, 1.0], [300, 0.955], [355, 0.9], [394, 0.83]]
const sAt = (z: number) => {
  for (let k = 0; k < PROF.length - 1; k++) {
    const [z0, s0] = PROF[k], [z1, s1] = PROF[k + 1]
    if (z <= z1) { const t = (z - z0) / (z1 - z0), e = t * t * (3 - 2 * t); return s0 + (s1 - s0) * e }
  }
  return PROF[PROF.length - 1][1]
}

type Set = { glass: Part; fin: Part; slot: Part; roof: Part; crown: Part }
const mk = (): Set => ({ glass: new Part(), fin: new Part(), slot: new Part(), roof: new Part(), crown: new Part() })

/**
 * One plume's plan at scale 1: the half-ellipse on side `sg` (+1 north-east, -1 south-west) from
 * the slot face at v = sg*G, counter-clockwise from above.
 */
function plumePlan(sg: number, n: number): XY[] {
  const t0 = Math.asin(G / B) // where the ellipse meets the slot face
  const pts: XY[] = []
  for (let i = 0; i <= n; i++) {
    const t = t0 + ((Math.PI - 2 * t0) * i) / n // 0..pi measured from +u, on the +v side
    pts.push([A * Math.cos(t), B * Math.sin(t)])
  }
  // +v side runs counter-clockwise from +u to -u; the slot face closes it
  return sg > 0 ? pts : pts.map(([u, v]) => [-u, -v] as XY)
}

function build(s: Set, d: boolean) {
  const n = d ? 28 : 14
  const levels = d ? [0, 20, 40, 60, 90, 120, 140, 180, 220, 260, 300, 330, 355] : [0, 60, 140, 220, 300, 355]
  for (const sg of [1, -1]) {
    const plan = plumePlan(sg, n)
    const crestZ = sg > 0 ? TOP : TOP2
    // the crest: highest over the plume's inner third, falling to the slot and the outer edge
    const crestAt = (p: XY) => {
      const c: XY = [0, sg * (G + (B - G) * 0.5)]
      const r = Math.hypot((p[0] - c[0]) / A, (p[1] - c[1]) / (B - G))
      return crestZ - 18 * Math.min(1, r) ** 2
    }
    const ring = (z: number, inset = 0): V3[] => plan.map(([u, v]) => {
      const k = sAt(z)
      // inset toward the plume's own centre for the rounded shoulder
      const cx = 0, cy = sg * (G + (B - G) * 0.45)
      const px = u * k, py = sg > 0 ? Math.max(v * k, G) : Math.min(v * k, -G)
      const dx = px - cx, dy = py - cy, l = Math.hypot(dx, dy) || 1
      return [px - (dx / l) * inset, py - (dy / l) * inset, z] as V3
    })
    // the curved face: walls up to the shoulder, then three rounded rows over the crest line
    const rows: V3[][] = levels.map((z) => ring(z))
    const shoulder = plan.map((p, i) => { const z = crestAt([p[0] * sAt(372), p[1]]) - 7; return ring(z)[i].map((v, k) => (k === 2 ? z : v)) as V3 })
    rows.push(shoulder)
    for (const [dz, ins] of [[3.5, 1.2], [5.8, 3.0], [7, 5.5]] as [number, number][]) {
      rows.push(plan.map((p, i) => { const z = crestAt([p[0] * sAt(372), p[1]]) - 7 + dz; const q = ring(z, ins)[i]; return [q[0], q[1], z] as V3 }))
    }
    // lift the crest rows so the rounded top (its centre 1.2 m over the top row) meets the crest height
    {
      const m = Math.max(...rows[rows.length - 1].map((p) => p[2])), lift = crestZ - 1.2 - m
      for (let k = levels.length; k < rows.length; k++) rows[k] = rows[k].map((p) => [p[0], p[1], p[2] + lift] as V3)
    }
    // gridSurface faces outward when columns run counter-clockwise; the slot face (last -> first) is open
    gridSurface(rows, false, (i, k) => (k >= levels.length ? s.crown : s.glass))
    // the slot face of the plume (flat, dark glass), from the plan's two ends
    const last = rows.length - 1
    for (let k = 0; k < last; k++) {
      const a = rows[k][n], b = rows[k][0], c = rows[k + 1][0], e = rows[k + 1][n]
      face(s.slot, [a, b, c, e], [0, -sg, 0])
    }
    // the roof: a fan over the top row
    const top = rows[last]
    const cz = crestZ
    const cxy: XY = [top.reduce((t, p) => t + p[0], 0) / top.length, top.reduce((t, p) => t + p[1], 0) / top.length]
    for (let i = 0; i < n; i++) face(s.crown, [top[i], top[i + 1], [cxy[0], cxy[1], cz]], [0, 0, 1])
    face(s.crown, [top[n], top[0], [cxy[0], cxy[1], cz]], [0, 0, 1])

    // the white horizontal fins, grouped (three storeys low, two in the detail)
    const step = 10.2, out = d ? 0.9 : 1.0, th = d ? 0.8 : 1.0
    for (let z = 9; z < 358; z += step) {
      const k = sAt(z)
      const pts = plan.map(([u, v]) => [u * k, sg > 0 ? Math.max(v * k, G) : Math.min(v * k, -G)] as XY)
      for (let i = 0; i < n; i++) {
        const p = pts[i], q = pts[i + 1]
        const np: XY = [p[0] / (A * A), p[1] / (B * B)], nq: XY = [q[0] / (A * A), q[1] / (B * B)]
        const lp = Math.hypot(...np), lq = Math.hypot(...nq)
        const P: V3 = [p[0] + (np[0] / lp) * out, p[1] + (np[1] / lp) * out, 0], Q: V3 = [q[0] + (nq[0] / lq) * out, q[1] + (nq[1] / lq) * out, 0]
        const N: V3 = [(np[0] / lp + nq[0] / lq) / 2, (np[1] / lp + nq[1] / lq) / 2, 0]
        face(s.fin, [[P[0], P[1], z - th], [Q[0], Q[1], z - th], [Q[0], Q[1], z], [P[0], P[1], z]], N)
        face(s.fin, [[p[0], p[1], z], [q[0], q[1], z], [Q[0], Q[1], z], [P[0], P[1], z]], [0, 0, 1])
        if (d) face(s.fin, [[p[0], p[1], z - th], [P[0], P[1], z - th], [Q[0], Q[1], z - th], [q[0], q[1], z - th]], [0, 0, -1])
      }
    }
  }
  // the core in the slot: dark glass set 5 m back at the north-west end (the photographed notch);
  // at the south-east end the plumes read as joined, so the core is flush there, in the glass
  const coreTop = TOP2 - 10, c0 = Math.cos(Math.asin(G / B))
  const coreRows = (d ? [0, 60, 140, 220, 300, 355, coreTop] : [0, 140, 300, coreTop]).map((z) => {
    const e0 = A * sAt(z) - 5, e1 = A * sAt(z) * c0 - 0.05
    return [[-e0, -G, z], [e1, -G, z], [e1, G, z], [-e0, G, z]] as V3[]
  })
  for (let k = 0; k < coreRows.length - 1; k++) {
    face(s.glass, [coreRows[k][1], coreRows[k][2], coreRows[k + 1][2], coreRows[k + 1][1]], [1, 0, 0])
    face(s.slot, [coreRows[k][3], coreRows[k][0], coreRows[k + 1][0], coreRows[k + 1][3]], [-1, 0, 0])
  }
  face(s.roof, coreRows[coreRows.length - 1], [0, 0, 1])
  // the crown spike over the slot's north-west end (Ouda's photos: a dark frame standing between the plumes)
  const e = A * sAt(coreTop) - 5
  const sp: V3[] = [[-e, -1.6, coreTop], [-e + 5, -1.6, coreTop], [-e + 5, 1.6, coreTop], [-e, 1.6, coreTop]]
  const tip: V3 = [-e + 1.5, 0, TOP2 - 2]
  for (let k = 0; k < 4; k++) {
    const a = sp[k], b = sp[(k + 1) % 4]
    const nn: V3 = [(a[0] + b[0]) / 2 - tip[0], (a[1] + b[1]) / 2 - tip[1], 0.3]
    face(s.slot, [a, b, tip], nn)
  }
}

// ---- Materials and output ----------------------------------------------------------------------

const GLASS: MaterialSpec = { ...PALETTE.window, color: 0x93a2b0 }
const FIN: MaterialSpec = { ...finish('iconic-fin', 0xe6e8e8, 0.6), floodlight: (_p, nn) => (nn[2] > 0.7 ? 0.2 : 0.5) }
const SLOT: MaterialSpec = windowVariant(2, 0x56616c)
const ROOFM: MaterialSpec = PALETTE.roof
const CROWN: MaterialSpec = finish('iconic-crown', 0xd5dadd, 0.5)

const low = mk(), det = mk()
build(low, false)
build(det, true)
const layers = (s: Set): Layer[] => [
  { part: s.glass, material: GLASS },
  { part: s.fin, material: FIN },
  { part: s.slot, material: SLOT },
  { part: s.roof, material: ROOFM },
  { part: s.crown, material: CROWN },
]

if (import.meta.main) {
  await saveLods('egypt-iconic-tower', 'Iconic Tower', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres, bearing 45; origin at the centroid of the OSM outline way/819256088, on the ground',
    bearing: 45, height: TOP,
  }, 5000)
}
