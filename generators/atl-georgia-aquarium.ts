/**
 * Georgia Aquarium (2005, tvsdesign; shark gallery 2020) — original
 * procedural geometry, CC0-1.0.
 * bun generators/atl-georgia-aquarium.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Anchor = centroid
 * of OSM way/28912103, 33.763237, -84.394946.
 *
 * Identity: a ship. A long blue-grey metal hull, lens-shaped in plan and
 * widest toward its bow, runs north-north-west to south-south-east through
 * the middle of the lower galleries; at its south tip, on Pemberton Place, the bow
 * is a tall prow of pale aqua glass carrying the blue "XG" whale-shark
 * logo, with a white mast raking back from its point. In front, a thin
 * white wave of a canopy on slender columns sweeps along the south front
 * and curls round the south-east entrance plaza.
 *
 * Evidence:
 *  - plan: OSM way/28912103 and its part way/1359126494 (building:part=
 *    roof, the entrance canopy over the south-east plaza). The hull's lens
 *    and the dome from the NAIP orthophoto: from (4, 22) to the prow's
 *    point at (54, -84), 32 m across at its widest, where the prow's
 *    glass begins (the south 38%, after the photos).
 *  - heights: USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 1 m
 *    grid, over ground_min (298.42 m): west galleries 32-33, the central
 *    galleries 22-25, the north galleries 19-22, the north-east hall 24
 *    rising to 27 on its east edge, the hull 28 at its south end (26-28
 *    along its length), the dome 30-31, the canopy 8-11. Mapterhorn's lowest ground under the
 *    outline (the east side, on the park) is about 3 m over ground_min,
 *    so here: west 29.5, centre 19.5, north 17, north-east 21 (the lower
 *    values of each range); the hull 25 at its north end rising to 27
 *    and its vault 2.5 m more, the prow on to 33 m at its point (the
 *    upper lidar values, so the hull stands clear of the galleries as in
 *    the photos); canopy top 9. The mast:
 *    estimated from the photos at 1.4 times the prow (46 m); the lidar's thin returns miss it.
 *  - the 2020 shark gallery on the north side: the 2018 lidar already
 *    shows 19-22 m roofs over the whole north block, and the newer NAIP
 *    shows the same block with plant on its roof, so it is drawn at the
 *    lidar's height (17 m here) with the rest of the north galleries.
 *  - colours (photos, the 2007 aerial, NAIP): the hull's walls and its
 *    vaulted roof in a mid blue-grey metal (darker than the other roofs,
 *    so it reads as the ship at phone size); the west block's and the
 *    north-east hall's big roofs in lighter blue-grey; the low gallery
 *    blocks and all the plain walls a quiet tan; pale aqua prow glass;
 *    white canopy and mast.
 *  - the hull's plan: the 2018 lidar's 25-30 m mass fills x 5..50,
 *    y -45..-85 behind the south front, so the lens is 42 m across at its
 *    widest (t = 0.66) and its glass prow covers the south 52%.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Georgia Aquarium Jan 2006.jpg, Diliff, CC BY 2.5 (prow, canopy, hull)
 *    https://commons.wikimedia.org/wiki/File:Georgia_Aquarium_Jan_2006.jpg
 *  - Georgia-aquarium-aerial.jpg, Connor.carey, CC BY-SA 3.0 (from the
 *    air, 2007: plan, roofs, canopy)
 *    https://commons.wikimedia.org/wiki/File:Georgia-aquarium-aerial.jpg
 *  - Atlanta August 2016 13 (Georgia Aquarium).jpg, Michael Barera,
 *    CC BY-SA 4.0 (the navy hull side and the mast)
 *    https://commons.wikimedia.org/wiki/File:Atlanta_August_2016_13_(Georgia_Aquarium).jpg
 *  - Georgia-Aquarium-Atlanta.jpg, Rundvald, public domain (from the
 *    plaza, south-east)
 *    https://commons.wikimedia.org/wiki/File:Georgia-Aquarium-Atlanta.jpg
 *  - Georgia Aquarium in Atlanta Georgia in January 2014.png, Tim Adams,
 *    CC BY 3.0 https://commons.wikimedia.org/wiki/File:Georgia_Aquarium_in_Atlanta_Georgia_in_January_2014.png
 *  - Atlanta Aquarium, Atlanta, GA (47474205311).jpg, Warren LeMay, CC0
 *    https://commons.wikimedia.org/wiki/File:Atlanta_Aquarium,_Atlanta,_GA_(47474205311).jpg
 *  - Georgia Aquarium in front of Coca-Cola museum.jpg, Sarrail, CC BY-SA
 *    4.0 (2022) https://commons.wikimedia.org/wiki/File:Georgia_Aquarium_in_front_of_Coca-Cola_museum.jpg
 *  - NAIP orthophoto (USGS, public domain): plan and roofs.
 * No look-only sources. No commercial imagery.
 *
 * Night: the prow glass is `window` (lit inside); the XG logo is
 * `neon-aq-blue`; the white canopy is floodlit underneath.
 *
 * Doubts: the galleries' many roof levels are reduced to four; the red
 * GEORGIA AQUARIUM letters on the canopy are left off (too thin to read);
 * the XG logo is a bold fish-shaped plate, not the traced logo.
 */
import { Part, type V3 } from './mesh'
import { capPoly, prism, save, wall, type XY } from './atl-westin-peachtree-plaza'

const metal = new Part(), navy = new Part(), glass = new Part(), roof = new Part(), white = new Part(), logo = new Part()

const NORTH = 17, CENTRE = 19.5, WEST = 29.5, NE = 21, HULL = 25, CANOPY = 9

/** Split long edges to ≤ 5 m so low faces follow the terrain. */
const split = (r: XY[], step = 5): XY[] => r.flatMap((a, i) => {
  const b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(L / step))
  return Array.from({ length: k }, (_, j) => [a[0] + ((b[0] - a[0]) * j) / k, a[1] + ((b[1] - a[1]) * j) / k] as XY)
})

// ── The galleries ──
const building: XY[] = [[-94.1, -19.2], [-50.8, -70.5], [-40.6, -70.7], [-37.4, -82], [50, -82], [52.5, -78.7], [51.5, -70.8], [49, -61.6], [45.8, -54.9], [41.7, -49.3], [65.4, -40.8], [66.1, -31.7], [66, 66.8], [49.9, 101.1], [39.1, 100.9], [39.2, 117.6], [28, 117.5], [27.9, 96.9], [-56, 97], [-56.1, 26.2], [-94.7, 26.3], [-97.7, 15.4], [-97.9, -8.8], [-96.2, -15.6]]
prism(metal, split(building), 0, NORTH, metal, 0.5)
prism(metal, [[-50.8, -70.5], [-40.6, -70.7], [-37.4, -82], [30, -82], [-5, -20], [-5, 26.2], [-55, 26.2], [-55, -19.2], [-94.1, -19.2]], NORTH - 0.5, CENTRE, metal, 0.5)
prism(metal, [[-97.7, 15.4], [-97.9, -8.8], [-96.2, -15.6], [-94.1, -19.2], [-55, -19.2], [-55, 26.2], [-94.7, 26.3]], NORTH - 0.5, WEST, roof, 0.5)
prism(metal, [[-5, -30], [41.7, -49.3], [65.4, -40.8], [66.1, -31.7], [66, 66.8], [49.9, 101.1], [39.1, 100.9], [39.2, 117.6], [28, 117.5], [27.9, 96.9], [-5, 97]], NORTH - 0.5, NE, roof, 0.5)

// ── The hull: a navy lens with the glass prow at its south point ──
const PN: XY = [4, 22], PS: XY = [47, -87], W = 21
const ax: XY = [(PS[0] - PN[0]), (PS[1] - PN[1])], AL = Math.hypot(...ax), ux = ax[0] / AL, uy = ax[1] / AL, nx = -uy, ny = ux
const PROW = 0.6, GLASS = 0.48, WIDE = 0.66
// Widest at t = 0.66, over the prow's glass shoulders; pointed at both ends.
const half = (t: number) => W * (t < WIDE ? Math.sin((Math.PI / 2) * (t / WIDE)) ** 1.2 : Math.pow((1 - t) / (1 - WIDE), 0.6))
const at = (t: number, s: number): XY => [PN[0] + ax[0] * t + nx * s * half(t), PN[1] + ax[1] * t + ny * s * half(t)]
// The hull rises from 25 m at its north end to 27 at the prow's shoulders,
// and the glass prow on to 33 m at its point: the lidar's upper values
// (28-33 m over its ground_min round the prow), so the hull stands clear
// of the galleries as in the photos.
const top = (t: number) => (t < PROW ? HULL + 2 * (t / PROW) ** 2 : HULL + 2 + 6 * Math.pow((t - PROW) / (1 - PROW), 1.2))
{
  const N = 24, ts = Array.from({ length: N + 1 }, (_, i) => i / N)
  // Side walls: west (s = -1) and east (s = +1).
  for (const s of [-1, 1]) {
    for (let i = 0; i < N; i++) {
      const t0 = ts[i], t1 = ts[i + 1], a = at(t0, s), b = at(t1, s)
      const part = (t0 + t1) / 2 > GLASS ? glass : navy
      const q: V3[] = [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], top(t1)], [a[0], a[1], top(t0)]]
      // Wound to face outward (away from the axis).
      if (s > 0) navyOr(part, q[3], q[2], q[1], q[0])
      else navyOr(part, q[0], q[1], q[2], q[3])
    }
  }
  // Roof: a darker blue-grey metal shell, the hull's own skin, vaulted 2.5 m across the hull's width,
  // following the prow's rise along it.
  const SV = [-1, -0.6, -0.2, 0.2, 0.6, 1]
  const R = (t: number, s: number): V3 => { const [x, y] = at(t, s); return [x, y, top(t) + 2.5 * (1 - s * s)] }
  for (let i = 0; i < N; i++) for (let k = 0; k < SV.length - 1; k++) {
    const t0 = ts[i], t1 = ts[i + 1], s0 = SV[k], s1 = SV[k + 1]
    navy.quad(R(t0, s0), R(t1, s0), R(t1, s1), R(t0, s1))
  }
  // A pale rim along the prow's top edge, so the glass has an edge.
  for (const s of [-1, 1]) for (let i = Math.floor(GLASS * N); i < N; i++) {
    const t0 = ts[i], t1 = ts[i + 1], a = at(t0, s), b = at(t1, s)
    const q: V3[] = [[a[0], a[1], top(t0) - 0.9], [b[0], b[1], top(t1) - 0.9], [b[0], b[1], top(t1) + 0.05], [a[0], a[1], top(t0) + 0.05]]
    const o = 0.08
    const off = (p: V3): V3 => [p[0] + nx * s * o, p[1] + ny * s * o, p[2]]
    if (s > 0) white.quad(off(q[3]), off(q[2]), off(q[1]), off(q[0]))
    else white.quad(off(q[0]), off(q[1]), off(q[2]), off(q[3]))
  }
}
function navyOr(part: Part, a: V3, b: V3, c: V3, d: V3) { part.quad(a, b, c, d) }

// The glass dome at the hull's north end (lidar 30-31 → 28).
{
  const c: XY = [6, 15], r = 7, n = 16, rings = [0, 0.45, 0.8, 1]
  const pts = rings.slice(0, 3).map((k) => Array.from({ length: n }, (_, i) => {
    const a = (i / n) * 2 * Math.PI, rr = r * Math.cos((k * Math.PI) / 2)
    return [c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a), HULL + 3 * Math.sin((k * Math.PI) / 2)] as V3
  }))
  for (let k = 0; k < pts.length - 1; k++) roof.loft([pts[k], pts[k + 1]])
  roof.cap(pts[2], true)
  wall(roof, Array.from({ length: n }, (_, i) => { const a = (i / n) * 2 * Math.PI; return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)] as XY }), HULL - 2, HULL)
}

// ── The mast: raking back from the prow's point. ──
{
  const foot: V3 = [PS[0] - ux * 1.5, PS[1] - uy * 1.5, 0], tip: V3 = [PS[0] - ux * 9, PS[1] - uy * 9, 46]
  const sec = (p: V3, h: number): V3[] => [[p[0] - h, p[1] - h, p[2]], [p[0] + h, p[1] - h, p[2]], [p[0] + h, p[1] + h, p[2]], [p[0] - h, p[1] + h, p[2]]]
  const r0 = sec(foot, 1.5), r1 = sec(tip, 0.6)
  white.loft([r0, r1])
  white.cap(r1, true)
}

// ── The XG logo: a bold blue fish-shaped plate on each side of the prow. ──
for (const s of [-1, 1]) {
  const t0 = 0.68, t1 = 0.86, zc = (top(t0) + top(t1)) / 2 - 4.5
  const n = 12, pts: V3[] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI, tt = (t0 + t1) / 2 + ((t1 - t0) / 2) * Math.cos(a), p = at(tt, s)
    const o = 0.9
    pts.push([p[0] + nx * s * o, p[1] + ny * s * o, zc + 3.6 * Math.sin(a)])
  }
  for (let i = 1; i < n - 1; i++) {
    const q = [pts[0], pts[i], pts[i + 1]]
    if (s > 0) logo.tri(q[0], q[2], q[1])
    else logo.tri(q[0], q[1], q[2])
  }
}

// ── The canopy: a thin white slab over the south front and the
// south-east plaza, on slender columns. ──
const canopy: XY[] = [[-37.4, -82], [-36.8, -89.1], [-32.6, -92.7], [3.2, -92.7], [3.3, -95.1], [46.8, -93.7], [52.3, -93], [55.9, -92.5], [74.2, -92.2], [76.2, -90.9], [80.9, -86], [83.6, -80.6], [85.3, -74.9], [86.2, -69], [86.1, -62.6], [85.1, -56.4], [83, -50.4], [80, -44.7], [76.1, -39.7], [71.4, -35.3], [66.1, -31.7], [65.4, -40.8], [41.7, -49.3], [45.8, -54.9], [49, -61.6], [51.5, -70.8], [52.5, -78.7], [50, -82]]
{
  const z0 = CANOPY - 1.2
  capPoly(white, canopy, CANOPY, true)
  capPoly(white, canopy, z0, false)
  wall(white, canopy, z0, CANOPY)
  // Columns along the outer edge, about every 11 m.
  const outerEdge = canopy.slice(1, 21)
  let acc = 0
  for (let i = 0; i < outerEdge.length - 1; i++) {
    const a = outerEdge[i], b = outerEdge[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (let s = (11 - acc) % 11; s < L; s += 11) {
      const p: XY = [a[0] + ((b[0] - a[0]) * s) / L, a[1] + ((b[1] - a[1]) * s) / L]
      // 1.6 m in from the edge.
      const c: XY = [p[0] + (0 - p[0]) * 0, p[1]]
      const k = 1.6 / Math.hypot(p[0] - 20, p[1] + 60), q: XY = [p[0] + (20 - p[0]) * k, p[1] + (-60 - p[1]) * k]
      void c
      const ring = Array.from({ length: 8 }, (_, j) => { const a2 = (j / 8) * 2 * Math.PI; return [q[0] + 0.5 * Math.cos(a2), q[1] + 0.5 * Math.sin(a2)] as XY })
      wall(white, ring, 0, z0)
    }
    acc = (acc + L) % 11
  }
}

await save('atl-georgia-aquarium', 'Georgia Aquarium', [
  { part: metal, material: { name: 'aq-tan', color: 0xcfc2aa, roughness: 0.85 } },
  { part: navy, material: { name: 'aq-hull', color: 0x5d6d98, roughness: 0.6 } },
  { part: glass, material: { name: 'window', color: 0x8fbfc8, roughness: 0.35 } },
  { part: roof, material: { name: 'roof', color: 0x95a2c2, roughness: 0.8 } },
  { part: white, material: { name: 'trim', color: 0xf4f3ef, roughness: 0.6, floodlight: (p: V3, n: V3) => (n[2] < -0.5 ? 0.8 : 0) } },
  { part: logo, material: { name: 'neon-aq-blue', color: 0x3a5cae, roughness: 0.5 } },
], { height: 46, anchor: [33.763237, -84.394946], bearing: 0 })
