/**
 * Alcatraz Island Lighthouse, San Francisco — original procedural geometry,
 * CC0-1.0.
 * bun generators/sf-alcatraz-lighthouse.ts
 *
 * Frame: built turned to the tower, BEARING 45: x and y run along the square
 * base's sides (+y towards the north-east, +x towards the south-east), z up,
 * metres. Origin = centroid of the OSM outline way/99202294.
 *
 * Evidence
 * - OSM way/99202294: a circle of r ~2.1 m, height 26, start_date 1909. OSM on
 *   Alcatraz sits 10-14 m west of the 2023 lidar (and agrees with NAIP),
 *   consistently; the model keeps OSM's position so it lines up with the
 *   map's paths, and takes every dimension from the lidar.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 0.25 m: the square base
 *   (4.8 m, its sides at 45° and 135°, square to the cellhouse) stands 8.9 m
 *   above the lowest ground at its foot (40.0 m NAVD88, y = 0; the ground
 *   round it varies 0.8 m); the gallery deck (r ~2.3 m) is at 25.4 m, the
 *   lantern roof (r ~1.5 m) 27.8-28.2 m, the beacon on top 29.7 m.
 * - Published: Wikipedia and the NPS give 84 ft (25.6 m) for the 1909
 *   reinforced-concrete tower, 95 ft above mean sea level for the light;
 *   "Blueprint of the Alcatraz Island Light Station.jpg" (USCG / GGNRA park
 *   archives, public domain, South East Elevation, 1909) for the proportions:
 *   the octagonal shaft tapering ~7%, the cornice, the watch room on corbel
 *   brackets, the gallery and the X-glazed lantern with its domed roof.
 * - Commons daylight photos: "San Francisco (CA, USA), Alcatraz, Lighthouse --
 *   2022 -- 3155.jpg" (Dietmar Rabich, CC BY-SA 4.0, the south-east face
 *   whole), "Alcatraz Island Lighthouse Tower.jpg" (Centpacrr, CC BY-SA 3.0,
 *   from the south-west), "Alcatraz lighthouse top.jpg" (Uzvards, CC BY-SA
 *   2.0, lantern and gallery close up), "Lighthouse California-05967 -
 *   Alcatraz Island Lighthouse (20637738295).jpg" (Dennis G. Jarvis, CC BY-SA
 *   2.0, from the bay).
 *
 * Estimated from the photos and the blueprint: the shaft (3.65 m across the
 * flats at the base, 3.35 m under the cornice), the cornice at 22 m, the watch
 * room (2.5 m tall) and its corbels, window sizes and places (the base's tall
 * windows, two slits up the shaft, one window per watch-room face), the lantern
 * (12-sided, r 1.35 m, 1.8 m of X-glazed panes, a low domed cap). The concrete is
 * weathered mid grey; the lantern's base ring, domed cap and beacon
 * housing are white, its glazing bars and the gallery railing charcoal metal,
 * with `glass` between. The gallery railing is drawn as posts
 * and a rail, the one fine detail kept, since it frames the lantern.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 45
const ANCHOR = { lng: -122.4222949, lat: 37.8262541 }
const concrete = new Part(), glass = new Part(), windows = new Part(), rail = new Part(), trim = new Part()

/** Corners of a regular n-gon, `flats` across the flats, with a flat facing +y and +x when n % 4 == 0. */
const ngon = (n: number, flats: number, z: number): V3[] => {
  const R = flats / 2 / Math.cos(Math.PI / n)
  return Array.from({ length: n }, (_, i) => {
    const a = Math.PI / n + (2 * Math.PI * i) / n
    return [R * Math.cos(a), R * Math.sin(a), z] as V3
  })
}
/** A prism or frustum between two n-gons, capped. */
function frustum(p: Part, n: number, f0: number, z0: number, f1: number, z1: number, capTop = true, capBot = false) {
  const a = ngon(n, f0, z0), b = ngon(n, f1, z1)
  p.loft([a, b])
  if (capTop) p.cap(b, true)
  if (capBot) p.cap(a, false)
}
/** A box with chamfered vertical edges. */
function block(p: Part, half: number, z0: number, z1: number, ch = 0.25, top = true) {
  const h = half, c = ch
  const r: V3[] = ([[-h + c, -h], [h - c, -h], [h, -h + c], [h, h - c], [h - c, h], [-h + c, h], [-h, h - c], [-h, -h + c]] as [number, number][]).map(([x, y]) => [x, y, z0])
  const t = r.map(([x, y]) => [x, y, z1] as V3)
  p.loft([r, t])
  if (top) p.cap(t, true)
}
/** A flat panel on the face of an n-gon (face k), centred on it, w wide, z0-z1, set `off` proud of the face at that height. */
function facePanel(p: Part, n: number, flatsAt: (z: number) => number, k: number, w: number, z0: number, z1: number, off = 0.04) {
  const a = (2 * Math.PI * k) / n + Math.PI / n + Math.PI / n // face normal angle: between corners k and k+1
  const nx = Math.cos(a), ny = Math.sin(a), tx = -ny, ty = nx
  const P = (s: number, z: number): V3 => {
    const d = flatsAt(z) / 2 + off
    return [nx * d + tx * s, ny * d + ty * s, z]
  }
  p.quad(P(-w / 2, z0), P(w / 2, z0), P(w / 2, z1), P(-w / 2, z1))
}

// --- Heights (y = 0 at the lowest ground by the base) ---
const BASE = 8.9, CORNICE = 22.0, WATCH = 22.5, DECK = 25.0, DECK_TOP = 25.4
const shaftFlats = (z: number) => 3.65 + (3.35 - 3.65) * ((z - BASE) / (CORNICE - BASE))

// Square base, with a cornice and a band below it.
block(concrete, 2.4, 0, BASE - 0.4, 0.2, false)
block(concrete, 2.55, BASE - 0.4, BASE, 0.2, true)
block(concrete, 2.47, BASE - 1.6, BASE - 1.4, 0.2, false)
// a tall window on each face, a small one in the frieze under the cornice (the photos' south-east face)
for (let k = 0; k < 4; k++) {
  const a = (Math.PI / 2) * k, nx = Math.cos(a), ny = Math.sin(a)
  const P = (s: number, z: number): V3 => [nx * 2.44 - ny * s, ny * 2.44 + nx * s, z]
  const win = (w: number, z0: number, z1: number) => windows.quad(P(-w / 2, z0), P(w / 2, z0), P(w / 2, z1), P(-w / 2, z1))
  win(0.8, 4.3, 6.4)
  win(0.75, BASE - 1.3, BASE - 0.55)
}

// Octagonal shaft, tapering, with a cornice.
frustum(concrete, 8, 3.65, BASE, 3.35, CORNICE, false)
frustum(concrete, 8, 3.9, CORNICE, 4.0, WATCH, true, true)
// slit windows up the shaft, on the faces square to the base (k = 1, 3, 5, 7 face ±x/±y)
for (const [k, z] of [[7, 13.0], [7, 17.4], [1, 15.2], [3, 13.0], [5, 17.4]] as [number, number][])
  facePanel(windows, 8, shaftFlats, k, 0.42, z, z + 1.1)

// Watch room, its corbels, the gallery deck.
frustum(concrete, 8, 3.4, WATCH, 3.4, DECK - 0.5, false)
frustum(concrete, 8, 3.4, DECK - 0.5, 4.5, DECK, false, false)
frustum(concrete, 8, 4.7, DECK, 4.7, DECK_TOP, true, true)
for (let k = 1; k < 8; k += 2) facePanel(windows, 8, () => 3.4, k, 0.6, WATCH + 0.6, WATCH + 1.6)
// corner pilasters on the watch room, the brackets the blueprint shows
for (let k = 0; k < 8; k++) {
  const R = 3.4 / 2 / Math.cos(Math.PI / 8), a = Math.PI / 8 + (Math.PI / 4) * k
  const cx = R * Math.cos(a), cy = R * Math.sin(a), s = 0.2
  const sq: V3[] = [[cx - s, cy - s, WATCH], [cx + s, cy - s, WATCH], [cx + s, cy + s, WATCH], [cx - s, cy + s, WATCH]]
  concrete.loft([sq, sq.map(([x, y]) => [x, y, DECK - 0.5] as V3)])
}

// Lantern: a low white wall, X-glazed drum, domed roof, vent ball, beacon.
const LAN = 12, LR = 1.35
const G0 = DECK_TOP + 0.3, G1 = DECK_TOP + 2.1 // glazing
frustum(trim, LAN, 2 * LR, DECK_TOP, 2 * LR, G0, false)
frustum(glass, LAN, 2 * LR - 0.04, G0, 2 * LR - 0.04, G1, false)
frustum(trim, LAN, 2 * LR + 0.2, G1, 2 * LR + 0.2, G1 + 0.15, false, true)
// astragals: the X in each pane, flush on the glass
{
  const C0 = ngon(LAN, 2 * LR + 0.02, G0), C1 = ngon(LAN, 2 * LR + 0.02, G1), w = 0.05
  for (let k = 0; k < LAN; k++) {
    const l = (k + 1) % LAN
    for (const [a, b] of [[C0[k], C1[l]], [C0[l], C1[k]]] as [V3, V3][]) {
      // a thin band from a to b in the pane's plane; both windings so it shows from outside
      const ex = C0[l][0] - C0[k][0], ey = C0[l][1] - C0[k][1], el = Math.hypot(ex, ey)
      const ox = (ex / el) * w, oy = (ey / el) * w
      const q: V3[] = [[a[0] - ox, a[1] - oy, a[2]], [a[0] + ox, a[1] + oy, a[2]], [b[0] + ox, b[1] + oy, b[2]], [b[0] - ox, b[1] - oy, b[2]]]
      rail.quad(q[0], q[1], q[2], q[3])
      rail.quad(q[3], q[2], q[1], q[0])
    }
  }
}
{
  // dome: quarter circle profile from the roof ring to the vent
  const z0 = G1 + 0.15, r0 = LR + 0.1, h = 0.4
  const rings: V3[][] = []
  for (let k = 0; k <= 4; k++) {
    const t = (Math.PI / 2) * (k / 4), r = Math.max(0.18, r0 * Math.cos(t))
    rings.push(ngon(LAN, 2 * r, z0 + h * Math.sin(t)))
  }
  trim.loft(rings)
  trim.cap(rings[rings.length - 1], true)
  frustum(rail, 8, 0.3, z0 + h, 0.3, z0 + h + 0.35, true) // vent
  frustum(rail, 8, 0.12, z0 + h + 0.35, 0.12, z0 + h + 1.1, false) // beacon mast
  frustum(trim, 8, 0.45, z0 + h + 1.1, 0.45, z0 + h + 1.45, true, true) // beacon lamp
}

// Gallery railing: posts at the corners and a top rail, dark.
{
  const C = ngon(8, 4.5, DECK_TOP), H = 1.0, w = 0.07
  for (let k = 0; k < 8; k++) {
    const [x, y] = C[k]
    rail.loft([[[x - w, y - w, DECK_TOP], [x + w, y - w, DECK_TOP], [x + w, y + w, DECK_TOP], [x - w, y + w, DECK_TOP]], [[x - w, y - w, DECK_TOP + H], [x + w, y - w, DECK_TOP + H], [x + w, y + w, DECK_TOP + H], [x - w, y + w, DECK_TOP + H]]])
  }
  const o = ngon(8, 4.6, DECK_TOP + H - 0.08), i = ngon(8, 4.4, DECK_TOP + H - 0.08)
  const o2 = o.map(([x, y]) => [x, y, DECK_TOP + H + 0.04] as V3), i2 = i.map(([x, y]) => [x, y, DECK_TOP + H + 0.04] as V3)
  rail.loft([o, o2])
  rail.loft([[...i2].reverse(), [...i].reverse()].reverse())
  for (let k = 0; k < 8; k++) {
    const l = (k + 1) % 8
    rail.quad(i2[k], o2[k], o2[l], i2[l])
    rail.quad(i[l], o[l], o[k], i[k])
  }
}

const parts = [
  { part: concrete, material: finish('weathered-concrete', 0xbab7b0) },
  { part: trim, material: PALETTE.trim },
  { part: glass, material: PALETTE.glass },
  { part: windows, material: PALETTE.window },
  { part: rail, material: finish('lantern-metal', 0x4a4f57) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Alcatraz Island Lighthouse', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: DECK_TOP + 2.25 + 0.4 + 1.45,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/99202294'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-alcatraz-lighthouse.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
