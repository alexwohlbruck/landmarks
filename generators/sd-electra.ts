/**
 * Electra, San Diego — 700 West E Street.
 *
 * The 1911 SDG&E Station B power plant on the block between the rail line,
 * Kettner Boulevard, Broadway and E Street, converted to condominiums
 * (2008) with a 43-storey tower rising out of it. The old plant is an ivory
 * Art Deco block with punched windows and a crenellated parapet; the tower
 * is cream piers over grey-brown glass with stacked balconies, a set-back
 * at about 94 m, a lower east shoulder, and a dark glass box on top.
 *
 * Frame: bearing 0. +x east, +y north, metres; origin at the anchor
 * (−117.16953, 32.71502), the centroid of OSM's Electra outline; y = 0 the
 * ground (≈ 0.7 m above the lidar box's ground_min).
 *
 * Sources
 * - OSM way/305374761 (Electra, building=commercial, 43 levels, h=144.8,
 *   glass) and way/305925605 (building=yes, 5 levels: the Station B block,
 *   which contains the Electra outline). © OSM contributors. The plan's
 *   suggested parts way/1118169504 and way/1148077481 are Pacific Gate,
 *   90 m to the west, and are not replaced.
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014, after the 2008
 *   conversion), 1 m grid.
 * - Wikipedia "Electra (San Diego)": 43 floors, about 145 m (475 ft), 2008.
 * Photos (evidence) — only a few exist; all are listed:
 * - "ElectraSanDiegoApr09.jpg", Nehrams2020, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:ElectraSanDiegoApr09.jpg
 * - "San Diego, 2016 - 204.jpg", Another Believer, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:San_Diego,_2016_-_204.jpg
 *   (tower from the rail line, west side of the base).
 * - "Kettner Boulevard.JPG" and "Kettner Blvd.JPG", Vrysxy, CC BY-SA 3.0
 *   (the Station B facade on Kettner at dusk).
 * - "San Diego sdflgn.jpg", Luciof, CC BY-SA 3.0; "San Diego - California -
 *   Yacht Harbor with Hotels (cropped).jpg", PictorialEvidence, CC BY-SA 3.0
 *   (skyline: the silhouette).
 * Look-only: "San Diego - California - Electra Condos", Onasill ~ Bill,
 * Flickr, CC BY-NC-SA 2.0 (not used for any shape or colour).
 *
 * Numbers
 * - Positions and heights from the lidar, which agrees with OSM's Station B
 *   block to within a metre but puts the tower about 6 m west and 4 m north
 *   of OSM's Electra square; the model follows the lidar for the tower
 *   inside the replaced block.
 * - Tower: lower body 36 × 40 m to 93.3; upper body to 133.5 (west) and
 *   121.5 (east shoulder); top box 12 × 20 m to 142.5 — lidar (measured).
 * - Base: 23.5 m on Broadway, 14.5 m in the middle, 13.5/21.5 m on
 *   E Street, 21.5 m along Kettner — lidar (measured).
 * - Pier and window rhythm, colours: from Nehrams2020 and Another Believer
 *   (estimated). Window panels span three storeys (9.3 m) with 2.2 m
 *   spandrels and 1.3–1.5 m piers.
 * - The curved blue-glass bay: placed on the east shoulder (lidar 121.5 m,
 *   x 2…10), which is where both photos show it, to the right of the main
 *   shaft and stopping below its top; the 4 m bow is estimated.
 *
 * Doubts — evidence is thin:
 * - The Station B facades are known only from two dusk photos of the
 *   Kettner side; the other sides are drawn the same.
 * - The curved bay's side is inferred: neither photo's camera position is
 *   exactly known, and the lidar shows only a 122 m block there.
 * - The balcony stacks are drawn as part of the lower body, not as slabs.
 * - No night photo of the top was found; nothing is drawn lit up there
 *   but the windows.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { qf, cbox, rect, type Rect } from './dc-white-house'
import { save } from './chi-aon-center'

const CREAM = finish('electra-cream', 0xe9e1d1)
const IVORY = finish('electra-ivory', 0xeee3cc)
const WIN = finish('window', 0x6c6a68, 0.35)
const TOPGLASS = finish('glass', 0x7d8a95, 0.3)

const cream = new Part(), ivory = new Part(), win = new Part(), top = new Part(), roof = new Part(), blue = new Part()
const BLUE = windowVariant(2, 0x5a7ca8)

type Face = { n: V3; P: (u: number, z: number) => V3; L: number }
function faces(r: Rect, d = 0.06): Face[] {
  return [
    { n: [0, -1, 0], L: r.x1 - r.x0, P: (u, z) => [r.x0 + u, r.y0 - d, z] },
    { n: [1, 0, 0], L: r.y1 - r.y0, P: (u, z) => [r.x1 + d, r.y0 + u, z] },
    { n: [0, 1, 0], L: r.x1 - r.x0, P: (u, z) => [r.x1 - u, r.y1 + d, z] },
    { n: [-1, 0, 0], L: r.y1 - r.y0, P: (u, z) => [r.x0 - d, r.y1 - u, z] },
  ]
}
/** Tall window panels between piers: bays of ~`bay` m, storey groups of `group` m. */
function grid(r: Rect, z0: number, z1: number, bay: number, pier: number, group: number, spandrel: number, part = win, only?: number[]) {
  faces(r).forEach((f, i) => {
    if (only && !only.includes(i)) return
    const n = Math.max(1, Math.round(f.L / bay)), w = f.L / n
    for (let b = 0; b < n; b++) {
      const u0 = b * w + pier / 2, u1 = (b + 1) * w - pier / 2
      for (let z = z0; z + 1.5 < z1; z += group) {
        const za = z + spandrel / 2, zb = Math.min(z1, z + group) - spandrel / 2
        if (zb - za < 1) continue
        qf(part, f.P(u0, za), f.P(u1, za), f.P(u1, zb), f.P(u0, zb), f.n)
      }
    }
  })
}

// --- Station B, the base (lidar heights in OSM's block) ---------------------
const base: [Rect, number][] = [
  [rect(-32.5, 21, 26, 58), 23.5],
  [rect(-32.5, 12, -18, 26), 14.5],
  [rect(12, 21, -18, 26), 21.5],
  [rect(-31.3, -2, -34.5, -18), 13.5],
  [rect(-2, 20.4, -34.8, -18), 21.5],
]
for (const [r, h] of base) {
  cbox(ivory, r, 0, h, { top: roof, b: 0.3 })
  // Punched windows, a storey a row (4 m), in pairs between pilasters.
  grid(r, 1.2, h - 2.2, 4.4, 2.0, 4.0, 1.8)
}
// The crenellated parapet on the Broadway block: merlons along its edge.
{
  const r = rect(-32.5, 21, 26, 58), h = 23.5
  faces(r, 0).forEach((f) => {
    const n = Math.round(f.L / 4)
    for (let k = 0; k <= n; k++) {
      const u = Math.min(f.L - 0.4, Math.max(0.4, (k * f.L) / n))
      const a = f.P(u - 0.4, h), b = f.P(u + 0.4, h)
      const ins: V3 = [-f.n[0] * 0.8, -f.n[1] * 0.8, 0]
      cbox(ivory, rect(Math.min(a[0], b[0], a[0] + ins[0]), Math.max(a[0], b[0], a[0] + ins[0]), Math.min(a[1], b[1], a[1] + ins[1]), Math.max(a[1], b[1], a[1] + ins[1])), h, h + 1.4, { top: true })
    }
  })
}

// --- The tower -----------------------------------------------------------------
const LOW = rect(-24, 12, -16, 24), LOW_H = 93.3
const UP = rect(-20, 10, -12, 20)
const UP_W = rect(-20, 2, -12, 20), UP_W_H = 133.5
const UP_E = rect(2, 10, -12, 20), UP_E_H = 121.5
const BOX = rect(-14, -2, -6, 14), BOX_H = 142.5
void UP

cbox(cream, LOW, 0, LOW_H, { top: roof, b: 0.4 })
grid(LOW, 15.5, LOW_H - 1, 4.2, 1.5, 9.3, 2.2)
cbox(cream, UP_W, LOW_H, UP_W_H, { top: roof, b: 0.4 })
grid(UP_W, LOW_H + 0.5, UP_W_H - 1, 3.6, 1.3, 9.3, 2.2, win, [0, 2, 3])
// Its east face shows only above the shoulder.
grid(UP_W, UP_E_H + 0.3, UP_W_H - 1, 3.6, 1.3, 11.2, 2.2, win, [1])
// The east shoulder: a curved blue-glass bay (Nehrams2020, Another Believer),
// its east face bowing out to x = 12, under a cream cornice.
{
  const ring: [number, number][] = [[UP_E.x0, UP_E.y0], [8, UP_E.y0]]
  for (let i = 1; i < 8; i++) {
    const t = i / 8, y = UP_E.y0 + (UP_E.y1 - UP_E.y0) * t
    ring.push([8 + 4 * Math.sin(Math.PI * t), y])
  }
  ring.push([8, UP_E.y1], [UP_E.x0, UP_E.y1])
  const P = (i: number, z: number): V3 => [ring[i][0], ring[i][1], z]
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length
    const a = ring[i], b = ring[j]
    const n: V3 = [b[1] - a[1], a[0] - b[0], 0]
    const curved = i >= 1 && i < ring.length - 2
    qf(curved ? blue : cream, P(i, LOW_H), P(j, LOW_H), P(j, UP_E_H - 1.2), P(i, UP_E_H - 1.2), n)
    qf(cream, P(i, UP_E_H - 1.2), P(j, UP_E_H - 1.2), P(j, UP_E_H), P(i, UP_E_H), n)
  }
  for (let i = 1; i < ring.length - 1; i++) roof.tri(P(0, UP_E_H), P(i, UP_E_H), P(i + 1, UP_E_H))
  // Window panels on the shoulder's flat south and north faces.
  grid(rect(UP_E.x0, 8, UP_E.y0, UP_E.y1), LOW_H + 0.5, UP_E_H - 1.5, 3.0, 1.2, 9.3, 2.2, win, [0, 2])
}
// The dark glass box on top, with a cream cornice.
cbox(top, BOX, UP_W_H, BOX_H - 0.8, { top: false })
cbox(cream, rect(BOX.x0 - 0.3, BOX.x1 + 0.3, BOX.y0 - 0.3, BOX.y1 + 0.3), BOX_H - 0.8, BOX_H, { top: roof, b: 0.2, bottom: true })
// Cornice bands at the set-backs.
cbox(cream, rect(LOW.x0 - 0.4, LOW.x1 + 0.4, LOW.y0 - 0.4, LOW.y1 + 0.4), LOW_H - 1.2, LOW_H, { top: false, bottom: true })
cbox(cream, rect(UP_W.x0 - 0.4, UP_W.x1, UP_W.y0 - 0.4, UP_W.y1 + 0.4), UP_W_H - 1.2, UP_W_H, { top: false, bottom: true })

const parts = [
  { part: cream, material: CREAM },
  { part: ivory, material: { ...IVORY, floodlight: (p: V3, n: V3) => (p[2] < 8 && n[2] < 0.5 ? 0.7 : 0) } },
  { part: win, material: WIN },
  { part: top, material: TOPGLASS },
  { part: roof, material: PALETTE.roof },
  { part: blue, material: BLUE },
]
await save('sd-electra', 'Electra', [-117.16953, 32.71502], 0, parts as any)
