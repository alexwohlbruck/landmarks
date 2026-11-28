/**
 * Wuhan Center, Wuhan CBD, Jianghan — original procedural geometry, CC0-1.0.
 * bun generators/wuhan-center.ts   (writes the low model and the detail LOD)
 *
 * Frame: bearing 26 (model +y points 26 degrees east of north, along the axis
 * through the two corner slots of the OSM outline way/450740194). Origin = the
 * centroid of that outline (114.2396688 E, 30.5966386 N), on the ground;
 * y = 0 is the plaza; elevation 0.
 *
 * Form, as read from OSM and the photos:
 * - a rounded-diamond plan (four bulging faces between rounded corners), with
 *   a vertical slot cut into the corners on the slot axis (NNE and SSW), run
 *   the full height; OSM maps the slots as notches in the outline;
 * - nearly straight to ~140 m, then a gentle taper, curving inward faster
 *   above the top floor;
 * - the crown: the curtain wall runs on above the roof (~404 m) as a glass
 *   sail whose top edge rises in a curve from ~412 m at the SSW slot to the
 *   443.1 m peak at the NNE slot, where the slot splits it into two horns;
 * - recessed refuge-floor bands at ~72, 135, 213, 285 and 345 m (set back
 *   0.7 m in the same glass, so they read as the photos' thin shadow lines);
 * - the podium: OSM's 4-level block north of the tower (way/450740191) and the
 *   link block between (way/628441291), as plain boxes with a glazed band.
 *
 * Evidence
 * - OSM (API map call, fetched 2026-11-27): outline way/450740194
 *   (building=commercial, height 438, 88 levels, name 武汉中心, wikidata
 *   Q2484373 — checked: Wikidata Q2484373 is "Wuhan Center", 438 m, coordinates
 *   on the outline); podium way/450740191 (4 levels), link way/628441291.
 * - Published: 443.1 m to the top of the crown (CTBUH; 438 m in OSM/Wikidata
 *   is the main roof figure), 88 floors (Wikipedia "Wuhan Center").
 * - Photos (Wikimedia Commons, daylight):
 *   "Wuhan Center 201704.jpg", Baycrest, CC BY-SA 2.5: the profile (measured
 *   row by row), the crown sail and its peak, refuge bands, slot;
 *   https://commons.wikimedia.org/wiki/File:Wuhan_Center_201704.jpg
 *   (2017: crown glazed, part of one side still being clad);
 *   "Wuhan Center Tower 201901 （view from the Central Square of Wuhan CBD）.jpg",
 *   Wuchernchau, CC BY-SA 4.0, camera 390 m north-east (Commons camera
 *   location): the slot on the NNE corner, the two horns of the crown meeting
 *   it, the podium to the north;
 *   https://commons.wikimedia.org/wiki/File:Wuhan_Center_Tower_201901_%EF%BC%88view_from_the_Central_Square_of_Wuhan_CBD%EF%BC%89.jpg
 *   "Wuhan Center and its surrounding areas in September 2023.jpg", Zheng
 *   Zhou, CC BY-SA 4.0, camera 2.45 km due east: the crown rising to the north
 *   (right), the overall width/height ratio;
 *   https://commons.wikimedia.org/wiki/File:Wuhan_Center_and_its_surrounding_areas_in_September_2023.jpg
 *   "武汉中心 直戳云霄.jpg", Duane, CC0: the slot and the facade pattern from
 *   the foot; https://commons.wikimedia.org/wiki/File:%E6%AD%A6%E6%B1%89%E4%B8%AD%E5%BF%83_%E7%9B%B4%E6%88%B3%E4%BA%91%E9%9C%84.jpg
 * - No lidar, NAIP or Mapillary here (batch notes).
 * - Look-only references: none.
 *
 * Numbers
 * - Published: 443.1 m top.
 * - Measured (OSM): the plan's shape and the slot axis (bearing 26).
 * - Measured (photo, Baycrest, scaled to 443.1 m; width relative to the widest):
 *   1.0 at 72 m, 0.99 at 136, 0.967 at 222, 0.957 at 265, 0.929 at 308, 0.90 at
 *   351, 0.867 at 395, 0.74 at 416 (crown curving in), the peak ~0.6.
 * - Measured (photos): crown base ~404 m, its low end ~412 m; refuge bands as above.
 * - Estimated: the size. OSM's outline is 58–60 m across, but two independent
 *   photos (Baycrest, face-on, and Zheng Zhou, from the east) give a
 *   width/height ratio of 1/5.9–1/6.4, i.e. 69–76 m; the outline looks traced
 *   at the (narrower) roof. The plan is scaled by 1.2 (about 72 m corner to
 *   corner at the foot).
 * - Estimated: slot 4 m wide, 3 m deep; podium 22 m and link 18 m tall (4
 *   levels; photo); colours sampled from the Baycrest photo (#7b9cbe–#879caa
 *   glass; #74a4d6 crown), pulled to #7f9cb6 / #8fb0cc.
 *
 * Doubts
 * - The 1.2 scale on OSM's outline (see above).
 * - The crown's inner structure is not visible in any photo; drawn as an open
 *   glass skin over a flat roof, with a silver lip.
 * - The facade's saw-tooth panels are left to colour (and grouped spandrel
 *   lines in the detail LOD).
 *
 * Night: the curtain wall glows as windows; the crown is glass (dark), its
 * lip lightly floodlit.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { face, saveLods, prism, type Layer } from './auckland-sky-tower'
import { gridSurface } from './shanghai-tower'
import { capRing, ccwXY, ledge, smoothInterp, type XY } from './wuhan-greenland-center'

const TOP = 443.1
const ROOF = 404
const LOW = 412 // the crown's low end, at the SSW slot
const SCALE = 1.2 // see header
const A = 30.3 * SCALE, B = 29.2 * SCALE, P = 1.68 // superellipse fitted to OSM
const PROF: [number, number][] = [[0, 0.985], [40, 1], [136, 0.99], [222, 0.967], [265, 0.957], [308, 0.929], [351, 0.9], [395, 0.867], [404, 0.855], [416, 0.81], [430, 0.74], [443.1, 0.64]]
const sc = (z: number) => smoothInterp(PROF, z)
const BANDS = [72, 135, 213, 285, 345]
const SLOT_W = 4, SLOT_D = 3

// podium, in the model frame (OSM)
const PODIUM: XY[] = [[-109.8, 77.3], [19.4, 107.7], [31.1, 57.4], [-29.6, 43.5], [-69.8, 33.7], [-98.2, 27.1]]
const LINK: XY[] = [[-69.8, 33.7], [-30.2, -0.8], [-30.3, 1.6], [-28.1, 7.1], [-24.4, 11.6], [-16.6, 20.0], [-29.6, 43.5]]

type Set = { glass: Part; dark: Part; crown: Part; lip: Part; roof: Part; podium: Part }
const mk = (): Set => ({ glass: new Part(), dark: new Part(), crown: new Part(), lip: new Part(), roof: new Part(), podium: new Part() })

/** plan point at angle t (rad, CCW from +x), with the slot cut in; returns point and slot flag */
function planPt(t: number, inset = 0): { p: XY; slot: boolean } {
  const c = Math.cos(t), s = Math.sin(t)
  const r = 1 / Math.pow(Math.pow(Math.abs(c) / A, P) + Math.pow(Math.abs(s) / B, P), 1 / P)
  let x = r * c, y = r * s, slot = false
  // slots at +y and -y corners: a rectangular notch SLOT_W wide, SLOT_D deep
  if (Math.abs(x) < SLOT_W / 2 + 0.01) {
    slot = true
    y = Math.sign(y) * (Math.abs(y) - SLOT_D)
  }
  const l = Math.hypot(x, y)
  return { p: [x - (x / l) * inset, y - (y / l) * inset], slot }
}

function build(s: Set, d: boolean) {
  // angles: dense round the ring, with the slot jambs exact
  const N4 = d ? 30 : 14 // per quadrant
  const ts: number[] = []
  for (let q = 0; q < 4; q++) for (let i = 0; i < N4; i++) ts.push((q * Math.PI) / 2 + (i * Math.PI) / 2 / N4)
  // replace samples near ±90 deg by the slot's corners
  const out: { t: number; jamb: number }[] = []
  for (const t of ts) {
    const c = Math.cos(t), r = 1 / Math.pow(Math.pow(Math.abs(c) / A, P) + Math.pow(Math.abs(Math.sin(t)) / B, P), 1 / P)
    if (Math.abs(r * c) < SLOT_W / 2 + 1.5) continue
    out.push({ t, jamb: 0 })
  }
  // add the slot: outer jamb, inner jamb, inner jamb, outer jamb, at both ends
  const jambs = (sy: number) => {
    const yb = sy > 0 ? B : -B
    const ang = (x: number) => Math.atan2(yb, x)
    return sy > 0
      ? [{ t: ang(SLOT_W / 2 + 0.02), jamb: 1 }, { t: ang(SLOT_W / 2), jamb: 2 }, { t: ang(-SLOT_W / 2), jamb: 2 }, { t: ang(-SLOT_W / 2 - 0.02), jamb: 1 }]
      : [{ t: ang(-SLOT_W / 2 - 0.02), jamb: 1 }, { t: ang(-SLOT_W / 2), jamb: 2 }, { t: ang(SLOT_W / 2), jamb: 2 }, { t: ang(SLOT_W / 2 + 0.02), jamb: 1 }]
  }
  const all = [...out, ...jambs(1), ...jambs(-1)].map((o) => ({ ...o, t: (o.t + 2 * Math.PI) % (2 * Math.PI) })).sort((a, b) => a.t - b.t)
  const N = all.length
  const plan = all.map((o) => {
    const c = Math.cos(o.t), sn = Math.sin(o.t)
    const r = 1 / Math.pow(Math.pow(Math.abs(c) / A, P) + Math.pow(Math.abs(sn) / B, P), 1 / P)
    let x = r * c, y = r * sn
    if (o.jamb === 2) y = Math.sign(y) * (Math.abs(y) - SLOT_D)
    if (o.jamb) x = Math.sign(x) * (o.jamb === 2 ? SLOT_W / 2 : SLOT_W / 2)
    if (o.jamb === 1) { // on the envelope at x = ±SLOT_W/2
      const yy = B * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(x) / A, P)), 1 / P)
      y = Math.sign(y) * yy
    }
    return [x, y] as XY
  })
  const slotQ = (i: number) => { const j = (i + 1) % N; return all[i].jamb > 0 && all[j].jamb > 0 }
  const norms = plan.map((p) => { const l = Math.hypot(p[0], p[1]); return [p[0] / l, p[1] / l] as XY })
  const at = (i: number, z: number, inset = 0): V3 => { const k = sc(z); return [plan[i][0] * k - norms[i][0] * inset, plan[i][1] * k - norms[i][1] * inset, z] }
  const zTop = (i: number) => { const t = Math.max(-1, Math.min(1, plan[i][1] / B)); return LOW + (TOP - LOW) * Math.pow((t + 1) / 2, 2.2) }

  // shell rows with refuge bands
  type Row = { z: number; inset: number; band: boolean }
  const rows: Row[] = []
  const zs = d ? [0, 20, 40, 60, 100, 160, 180, 240, 260, 310, 330, 370, 395] : [0, 40, 100, 180, 250, 320, 380]
  for (const z of zs) rows.push({ z, inset: 0, band: false })
  const bh = d ? 3 : 3.5
  for (const z of BANDS) rows.push({ z: z - bh / 2, inset: 0, band: false }, { z: z - bh / 2 + 0.01, inset: 0.7, band: true }, { z: z + bh / 2 - 0.01, inset: 0.7, band: true }, { z: z + bh / 2, inset: 0, band: false })
  rows.sort((a, b) => a.z - b.z)
  rows.push({ z: ROOF, inset: 0, band: false })
  const g: V3[][] = rows.map((r) => plan.map((_, i) => at(i, r.z, r.inset)))
  // smooth runs between the band steps; the steps themselves are flat rings, so their
  // normals don't bleed into the walls
  let k0 = 0
  for (let k = 1; k <= rows.length; k++) {
    if (k === rows.length || rows[k].inset !== rows[k - 1].inset) {
      if (k - k0 > 1) gridSurface(g.slice(k0, k), true, (i) => (slotQ(i) ? s.dark : s.glass), (i) => all[i].jamb > 0)
      if (k < rows.length) {
        const up = rows[k].inset > rows[k - 1].inset
        for (let i = 0; i < N; i++) {
          const j = (i + 1) % N
          face(slotQ(i) ? s.dark : s.glass, [g[k - 1][i], g[k - 1][j], g[k][j], g[k][i]], [0, 0, up ? 1 : -1])
        }
      }
      k0 = k
    }
  }

  // crown skin: rows clipped to the sail line
  const cz: number[] = []
  for (let z = ROOF + (d ? 4 : 8); z < TOP; z += d ? 4 : 8) cz.push(z)
  const crownRows: V3[][] = [plan.map((_, i) => at(i, ROOF))]
  for (const z of cz) crownRows.push(plan.map((_, i) => at(i, Math.min(z, zTop(i)))))
  crownRows.push(plan.map((_, i) => at(i, zTop(i))))
  gridSurface(crownRows, true, (i) => (slotQ(i) ? s.dark : s.crown), (i) => all[i].jamb > 0)
  const inner = crownRows.map((r) => r.map((p, i) => { const q = at(i, p[2], 0.8); return q }))
  gridSurface(inner.map((r) => [...r].reverse()), true, () => s.crown)
  // the lip along the sail's edge
  const top = crownRows[crownRows.length - 1], topIn = inner[inner.length - 1]
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    face(s.lip, [top[i], top[j], topIn[j], topIn[i]], [0, 0, 1])
  }
  // roof inside the crown
  const roofRing = plan.map((_, i) => at(i, ROOF + 0.5, 0.8))
  capRing(s.roof, roofRing, true)

  // detail: grouped spandrel lines every ~3 floors (shallow ledges)
  if (d) {
    const ns: XY[] = norms
    for (let z = 15; z < ROOF - 5; z += 13.5) {
      if (BANDS.some((b) => Math.abs(z - b) < 6)) continue
      const k = sc(z)
      // two runs: the faces between the slots
      const half = (lo: boolean) => {
        const idx = [...Array(N).keys()].filter((i) => !all[i].jamb && (plan[i][0] > 0) === lo)
        idx.sort((a, b) => (lo ? plan[b][1] - plan[a][1] : plan[a][1] - plan[b][1]))
        return idx
      }
      for (const side of [true, false]) {
        const idx = half(side)
        ledge(s.lip, idx.map((i) => [plan[i][0] * k, plan[i][1] * k] as XY), idx.map((i) => ns[i]), z, 0.35, 0.35, false)
      }
    }
  }

  // podium and link
  prism(s.podium, ccwXY(PODIUM), 0, 22)
  prism(s.podium, ccwXY(LINK), 0, 18)
  // glazed band on the podium walls (4 m, at 7–11 m), set 0.05 proud
  for (const [poly, top] of [[ccwXY(PODIUM), 22], [ccwXY(LINK), 18]] as [XY[], number][]) {
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 6) continue
      const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
      const u = (t: number, z: number): V3 => [a[0] + (b[0] - a[0]) * t + n[0] * 0.05, a[1] + (b[1] - a[1]) * t + n[1] * 0.05, z]
      const m = 1.5 / L
      for (const [z0, z1] of [[2, 6.5], [9, top - 3]]) face(s.glass, [u(m, z0), u(1 - m, z0), u(1 - m, z1), u(m, z1)], [n[0], n[1], 0])
    }
  }
}

// ---- Materials and output ----------------------------------------------------------------------

const GLASS: MaterialSpec = { ...PALETTE.window, color: 0x7f9cb6 }
const DARK: MaterialSpec = finish('wuhan-center-slot', 0x55667a, 0.5)
const CROWN: MaterialSpec = { ...PALETTE.glass, color: 0x8fb0cc }
const LIP: MaterialSpec = { ...finish('wuhan-center-silver', 0xd3dae0, 0.45), floodlight: (p) => (p[2] > 400 ? 0.8 : 0.2) }
const ROOFM: MaterialSpec = PALETTE.roof
const PODM: MaterialSpec = finish('wuhan-center-podium', 0xc9cdd0)

const low = mk(), det = mk()
build(low, false)
build(det, true)
const layers = (s: Set): Layer[] => [
  { part: s.glass, material: GLASS },
  { part: s.dark, material: DARK },
  { part: s.crown, material: CROWN },
  { part: s.lip, material: LIP },
  { part: s.roof, material: ROOFM },
  { part: s.podium, material: PODM },
]
void planPt

if (import.meta.main) {
  await saveLods('wuhan-center', 'Wuhan Center', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres, turned to bearing 26; origin at the centroid of the OSM outline, on the plaza',
    bearing: 26, height: TOP,
  }, 5000)
}
