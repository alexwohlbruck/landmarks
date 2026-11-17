/**
 * Obelisk of Theodosius (Dikilitaş), Hippodrome (Sultanahmet Meydanı),
 * Istanbul — the obelisk of Thutmose III (c. 1450 BC, Aswan granite),
 * re-erected here in 390 on a Theodosian marble pedestal — original
 * procedural geometry, CC0-1.0.
 * bun generators/istanbul-obelisk-of-theodosius.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * floor of the pit round the base. Bearing 37.6: the model's axes run
 * along the Hippodrome's spina (+y = compass 37.6°) and across it; the OSM
 * square of the shaft (way/1120852417) has edges at 37.6° and 127.6°.
 * Anchor = that square's centroid, 28.975400, 41.005928.
 *
 * Identity (from the photos below):
 *  1. The tall pink-tan granite shaft with its pyramidion.   (dd128, dd129)
 *  2. The four dark bronze cubes it stands on, with daylight between them.
 *  3. The square white marble pedestal with relief panels, its cornice, and
 *     under it the reddish granite corner blocks and the lower relief base,
 *     down in a railed pit.                    (dd128, dudva1, lowne, lowsw, haklai)
 *
 * Dimensions. Published (Wikipedia "Obelisk of Theodosius", en): the shaft
 * 18.54 m (or 19.6 m) high, 25.6 m with the base. Drawn: shaft and
 * pyramidion 19.55 m (6.05–25.6 m), the pyramidion 1.65 m. OSM tags 15.9 m,
 * which matches neither and is not used. The shaft's base 2.5 m square
 * (OSM's square is 2.24 m) tapering to 1.76 m under the pyramidion
 * (estimated from haklai, a distant level view). The base, estimated from dd128,
 * dudva1 and the 1991 base photos, scaled from the shaft's width: lower
 * base 4.4 m square, 0.3–1.8 m on a 0.3 m step; granite corner blocks
 * 0.9 m, 1.8–2.6 m; upper pedestal 3.5 m square, 2.6–5.0 m, with a 3.8 m
 * cornice slab to 5.4 m; bronze cubes 0.65 m.
 *
 * Elevation −2.2 (evidence.md "Elevation", a base below the street): the
 * Roman ground is the floor of the pit, and the street outside is level
 * with the granite corner blocks (dudva1, haklai: the railing's footing at
 * the bottom of the upper pedestal). Estimated from those photos, scaled
 * from the 2.4 m pedestal; no published depth was found. No lidar or
 * Mapterhorn z15 terrain in Istanbul.
 *
 * The pit: its lining is drawn as walls facing in (a 7.2 m square, from the
 * photos; terracotta-red plaster as in haklai) with the stone kerb and the
 * marble railing posts on the street; the iron railing between them is
 * left out but for a top rail.
 *
 * Night: the shaft and pedestal are floodlit from below (palmero, lascar).
 *
 * Photos (evidence, Wikimedia Commons):
 *  dd128   "Obelisco de Teodosio, Estambul, Turquía, 2024-09-28, DD 128.jpg", Diego Delso, CC BY-SA 4.0
 *  dd129   "Obelisco de Teodosio, Estambul, Turquía, 2024-09-28, DD 129.jpg", Diego Delso, CC BY-SA 4.0
 *  haklai  "Obelisk of Theodosius-.jpg", Yair Haklai, CC BY-SA 4.0
 *  dudva1  "Base of Theodosius obelisk 1.jpg", Dudva, CC BY-SA 4.0
 *  lowne   "Obelisk of Theodosius lower base northeast side (1991).jpg", Mark Landon, CC BY 4.0
 *  lowsw   "Obelisk of Theodosius lower base southwest side (1991).jpg", Mark Landon, CC BY 4.0
 *  palmero "Obelisk of Theodosius and Walled Obelisk.jpg", Nan Palmero, CC BY 2.0 (night)
 *  lascar  "Obelisk of Theodosius (8394685988).jpg", Jorge Láscar, CC BY 2.0 (night)
 * Look-only: none.
 *
 * Doubts: the pit's depth and size are estimates; the reliefs and
 * hieroglyphs are left out (too fine for the map).
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { box, save } from './atl-flatiron-building'

const granite = new Part(), marble = new Part(), red = new Part(), bronze = new Part(), lining = new Part()

/** A square frustum about the origin: half-size h0 at z0 to h1 at z1, capped. */
function frustum(p: Part, h0: number, h1: number, z0: number, z1: number, top = true) {
  const r = (h: number, z: number): V3[] => [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]]
  p.loft([r(h0, z0), r(h1, z1)])
  if (top) p.cap(r(h1, z1), true)
}

// The pit floor (y = 0) is the Roman ground; the street is at STREET.
const STREET = 2.2

// 1. The lower base on its step, with a moulded top.
frustum(marble, 2.5, 2.5, 0, 0.3)
frustum(marble, 2.2, 2.2, 0.3, 1.55)
frustum(marble, 2.2, 2.32, 1.55, 1.7)
frustum(marble, 2.32, 2.32, 1.7, 1.8)
// 2. The granite corner blocks with the marble core between them.
for (const sx of [-1, 1]) for (const sy of [-1, 1]) box(red, sx * 1.75 - 0.45, sx * 1.75 + 0.45, sy * 1.75 - 0.45, sy * 1.75 + 0.45, 1.8, 2.6, red, 0.08)
frustum(marble, 1.35, 1.35, 1.8, 2.6, false)
// 3. The upper pedestal, a base moulding, and its cornice slab.
frustum(marble, 1.9, 1.9, 2.6, 2.75)
frustum(marble, 1.75, 1.75, 2.75, 5.0, false)
frustum(marble, 1.75, 1.92, 5.0, 5.15, false)
frustum(marble, 1.92, 1.92, 5.15, 5.4)
// 4. The bronze cubes under the shaft's corners.
for (const sx of [-1, 1]) for (const sy of [-1, 1]) box(bronze, sx * 0.95 - 0.33, sx * 0.95 + 0.33, sy * 0.95 - 0.33, sy * 0.95 + 0.33, 5.4, 6.05, bronze, 0.04, true)
// 5. The shaft and the pyramidion.
{
  const r = (h: number, z: number): V3[] => [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]]
  granite.loft([r(1.25, 6.05), r(0.88, 23.95)])
  granite.cap(r(1.25, 6.05), false)
  const top = r(0.88, 23.95), apex: V3 = [0, 0, 25.6]
  for (let i = 0; i < 4; i++) granite.tri(top[i], top[(i + 1) % 4], apex)
}
// 6. The pit: lining facing in, the kerb, posts and a top rail.
{
  const H = 3.6, K = 0.55
  const ring = (h: number, z: number): V3[] => [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]]
  lining.loft([ring(H, 0).reverse(), ring(H, STREET).reverse()])
  // the kerb: a flat-topped band round the pit, its top a little over the street
  const zk = STREET + 0.3
  marble.loft([ring(H, STREET), ring(H, zk)].map((r) => r.reverse()))
  marble.loft([ring(H + K, STREET), ring(H + K, zk)])
  const i0 = ring(H, zk), o0 = ring(H + K, zk)
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; marble.quad(i0[i], o0[i], o0[j], i0[j]) }
  // marble posts on the kerb, four bays a side, and a rail between them
  const n = 4, hm = H + K / 2
  for (let k = 0; k < n * 4; k++) {
    const side = Math.floor(k / n), t = -hm + (2 * hm * (k % n)) / n
    const [x, y] = side === 0 ? [t, -hm] : side === 1 ? [hm, t] : side === 2 ? [-t, hm] : [-hm, -t]
    box(marble, x - 0.22, x + 0.22, y - 0.22, y + 0.22, zk, zk + 1.25, marble, 0.08)
  }
  for (const [x0, x1, y0, y1] of [[-hm, hm, -hm - 0.04, -hm + 0.04], [-hm, hm, hm - 0.04, hm + 0.04], [-hm - 0.04, -hm + 0.04, -hm, hm], [hm - 0.04, hm + 0.04, -hm, hm]]) {
    box(bronze, x0, x1, y0, y1, zk + 1.0, zk + 1.08, bronze, 0, true)
  }
}

const up = (p: V3, n: V3) => (n[2] > 0.6 ? 0.2 : Math.max(0.35, 1 - p[2] / 40))
await save('istanbul-obelisk-of-theodosius', 'Obelisk of Theodosius', [
  { part: granite, material: { ...finish('theodosius-granite', 0xdcbca0), floodlight: up } },
  { part: marble, material: { ...finish('theodosius-marble', 0xece6dc), floodlight: up } },
  { part: red, material: finish('theodosius-red-granite', 0xb08676) },
  { part: bronze, material: finish('theodosius-bronze', 0x5f5a52, 0.6) },
  { part: lining, material: finish('theodosius-pit', 0xc59a88) },
], { height: 25.6, anchor: [41.005928, 28.9754], bearing: 37.6, elevation: -2.2 })
