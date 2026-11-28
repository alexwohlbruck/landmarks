/**
 * Tovrea Castle, Phoenix (1928-1930, built by Alessio Carraro, later the
 * Tovrea family home), on its knoll at Carraro Heights. Procedural, CC0-1.0,
 * no textures.
 *   bun generators/phx-tovrea-castle.ts
 *
 * Map frame: x east, y north, z up, metres, placed at bearing 4 (the OSM
 * walls run 4/94 deg). Anchor -111.9717296, 33.4481607, the centroid of OSM
 * way/136668541 ("Tovrea Castle"). replaces: way/136668541 (nothing else in
 * OSM under it).
 *
 * Identity (photos below):
 *  1. The "wedding cake": three stacked tiers, each an elongated octagon
 *     smaller than the one below, cream stucco.                  (g1, bs, bn)
 *  2. A crenellated parapet round every tier, the merlons capped in green,
 *     a thin green band under each parapet.                           (g1, bs)
 *  3. The cupola on top: a small octagonal drum with windows under a dome
 *     striped green and white, a flagpole.                            (g1, bs)
 *  4. Tall dark windows on every face of every tier.                  (g1, bs)
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020), 0.5 m grid;
 * the knoll top round the castle is lidar 7-8 above ground_min, z 0 = lidar
 * 7.5. Measured: the first tier's deck 5 m (drawn 4.0, parapet top 4.8); the
 * tiers' plans from the lidar steps (outer edge x +-6, y +-8.2, next +-4.4 x
 * +-6.3, top +-2.9 x +-4.4, matching g1's widths 700:520:330 px), the first
 * tier also from the OSM outline (10.9 x 15.9 m, chamfers 2.5 m; the lidar
 * reads it about 1 m wider each side with the parapet). Estimated: the upper
 * tiers' heights and the cupola from g1's proportions (tiers 180:160:155 px,
 * drum 55, dome 80, the whole about 0.9 times the visible width): parapet
 * tops 4.8, 8.2, 11.4, drum to 12.6, dome to 14.0 (the dome about a quarter of the top tier's
 * width, as in bn). The lidar's highest
 * returns (16.5-17 m over the knoll, two cells) are taken as the flagpole's
 * base and finial, not the dome. Also estimated: the parapet
 * and merlon sizes; the windows (from g1 and bs). The flagpole is left out
 * (too thin).
 *
 * Photos (EVIDENCE, Wikimedia Commons):
 *  g1  "Tovrea Castle by Gage Skidmore.jpg", Gage Skidmore, CC BY-SA 3.0,
 *      https://commons.wikimedia.org/wiki/File:Tovrea_Castle_by_Gage_Skidmore.jpg
 *  bs  "2021 Tovrea Castle at Carraro Heights from southeast.jpg",
 *      Beyond My Ken, CC BY-SA 4.0,
 *      https://commons.wikimedia.org/wiki/File:2021_Tovrea_Castle_at_Carraro_Heights_from_southeast.jpg
 *  bn  "2021 Tovrea Castle at Carraro Heights from north.jpg", Beyond My Ken,
 *      CC BY-SA 4.0,
 *      https://commons.wikimedia.org/wiki/File:2021_Tovrea_Castle_at_Carraro_Heights_from_north.jpg
 * No look-only sources. No commercial imagery.
 * Doubts: the upper tiers' heights and the dome are photo-scaled, not
 * measured (the lidar's 1.5 m blocks read decks at about 7.5 and 10 m, close
 * to the drawn 7.4 and 10.6); the
 * stone retaining walls of the knoll are left to the terrain.
 *
 * Night: the castle is floodlit; windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { ccw, prism, save, wall, at, capPoly, offset, type XY } from './atl-flatiron-building'
import { onWall, rectShape, revolve } from './atl-tech-tower'

const ANCHOR = { lng: -111.9717296, lat: 33.4481607 }, BEARING = 4
const stucco = new Part(), green = new Part(), win = new Part(), white = new Part()

// an elongated octagon: half-sizes a (x) and b (y), corner chamfer c
const oct = (a: number, b: number, c: number): XY[] => ccw([[a, -b + c], [a, b - c], [a - c, b], [-a + c, b], [-a, b - c], [-a, -b + c], [-a + c, -b], [a - c, -b]])

const TIERS = [
  { ring: oct(6, 8.2, 2.7), z0: 0, deck: 4.0, top: 4.8, win: [0.9, 3.0] },
  { ring: oct(4.4, 6.3, 1.9), z0: 4.0, deck: 7.4, top: 8.2, win: [5.0, 6.8] },
  { ring: oct(2.9, 4.4, 1.3), z0: 7.4, deck: 10.6, top: 11.4, win: [8.3, 10.0] },
]

for (const [k, t] of TIERS.entries()) {
  // the wall up to the deck, the parapet above it (its inner face, its top)
  wall(stucco, t.ring, t.z0, t.top - 0.5)
  const inner = offset(t.ring, -0.35)
  wall(stucco, [...inner].reverse(), t.deck, t.top - 0.5)
  for (let i = 0; i < t.ring.length; i++) {
    const j = (i + 1) % t.ring.length
    stucco.quad([inner[i][0], inner[i][1], t.top - 0.5], [t.ring[i][0], t.ring[i][1], t.top - 0.5], [t.ring[j][0], t.ring[j][1], t.top - 0.5], [inner[j][0], inner[j][1], t.top - 0.5])
  }
  capPoly(white, inner, t.deck, true)
  // the thin green band under the parapet
  const band = offset(t.ring, 0.06)
  wall(green, band, t.deck - 0.05, t.deck + 0.07)
  // merlons, green-capped, along every face
  for (let i = 0; i < t.ring.length; i++) {
    const A = t.ring[i], B = t.ring[(i + 1) % t.ring.length], L = Math.hypot(B[0] - A[0], B[1] - A[1])
    const ux = (B[0] - A[0]) / L, uy = (B[1] - A[1]) / L, nx = uy, ny = -ux
    const n = Math.max(1, Math.round(L / 1.5))
    for (let m = 0; m < n; m++) {
      const s = (L * (m + 0.5)) / n, w = 0.32
      const P = (ds: number, dn: number): XY => [A[0] + ux * (s + ds) + nx * dn, A[1] + uy * (s + ds) + ny * dn]
      const r = ccw([P(-w, -0.35), P(w, -0.35), P(w, 0), P(-w, 0)])
      prism(stucco, r, t.top - 0.5, t.top - 0.08, null, 0)
      prism(green, r, t.top - 0.08, t.top + 0.04, green, 0)
    }
    // windows: one tall window per face, two on the long sides
    const nw = Math.max(1, Math.round(L / 2.6))
    for (let w = 0; w < nw; w++) {
      const s = (L * (w + 0.5)) / nw, hw = Math.min(0.5, L / nw / 2 - 0.35)
      onWall(win, A, B, rectShape(s - hw, s + hw, t.win[0], t.win[1]), 0.05)
    }
  }
}

// ── The cupola: octagonal drum with windows, striped dome ──
{
  const R = 1.15, N = 8, z0 = 10.6, z1 = 12.4
  const ring: XY[] = Array.from({ length: N }, (_, i) => [R * Math.cos((i / N) * Math.PI * 2 + Math.PI / 8), R * Math.sin((i / N) * Math.PI * 2 + Math.PI / 8)])
  prism(stucco, ring, z0, z1, null, 0)
  for (let i = 0; i < N; i++) onWall(win, ring[i], ring[(i + 1) % N], rectShape(0.24, 0.64, 11.4, 12.2), 0.04)
  // a ring at the dome's foot
  revolve(green, [0, 0], [[1.2, 12.3], [1.38, 12.4], [1.38, 12.6], [1.2, 12.6]], 16, 0, false, true)
  // the dome: 16 gores, alternately green and white
  const S = 16, rows = 6
  const prof = Array.from({ length: rows + 1 }, (_, k) => { const a = (k / rows) * (Math.PI / 2); return [1.28 * Math.cos(a), 12.6 + 1.4 * Math.sin(a)] as [number, number] })
  for (let i = 0; i < S; i++) {
    const p = i % 2 ? white : green
    const a0 = (i / S) * Math.PI * 2, a1 = ((i + 1) / S) * Math.PI * 2
    for (let k = 0; k < rows; k++) {
      const [r0, z0_] = prof[k], [r1, z1_] = prof[k + 1]
      const A: V3 = [r0 * Math.cos(a0), r0 * Math.sin(a0), z0_], B: V3 = [r0 * Math.cos(a1), r0 * Math.sin(a1), z0_]
      const C: V3 = [r1 * Math.cos(a1), r1 * Math.sin(a1), z1_], D: V3 = [r1 * Math.cos(a0), r1 * Math.sin(a0), z1_]
      const n = (r: number, z: number, a: number): V3 => { const l = Math.hypot(r / 1.28 ** 2, (z - 12.6) / 1.4 ** 2); return [(r / 1.28 ** 2) * Math.cos(a) / l, (r / 1.28 ** 2) * Math.sin(a) / l, ((z - 12.6) / 1.4 ** 2) / l] }
      p.tri(A, B, C, undefined, undefined, undefined, [n(r0, z0_, a0), n(r0, z0_, a1), n(r1, z1_, a1)])
      if (r1 > 1e-6) p.tri(A, C, D, undefined, undefined, undefined, [n(r0, z0_, a0), n(r1, z1_, a1), n(r1, z1_, a0)])
    }
  }
  revolve(white, [0, 0], [[0.1, 13.95], [0.18, 14.1], [0, 14.3]], 6, 0, false, false)
}
void at

await save('phx-tovrea-castle', 'Tovrea Castle', [
  { part: stucco, material: { ...finish('tovrea-stucco', 0xf0e2b6), floodlight: (_p, n) => (n[2] < 0.5 ? 0.8 : 0.2) } },
  { part: green, material: finish('tovrea-green', 0x4f8a66) },
  { part: win, material: { ...PALETTE.window, color: 0x4f5f6c } },
  { part: white, material: finish('tovrea-white', 0xf6f2e8) },
], { height: 14.3, anchor: [ANCHOR.lat, ANCHOR.lng], bearing: BEARING }, 5000)
