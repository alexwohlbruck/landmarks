/**
 * Walled Obelisk (Örme Dikilitaş; the Obelisk of Constantine VII
 * Porphyrogennetos), Hippodrome (Sultanahmet Meydanı), Istanbul — a
 * rough-stone masonry obelisk, probably Theodosian, restored and once
 * sheathed in gilt bronze plates in the 10th c. — original procedural
 * geometry, CC0-1.0.
 * bun generators/istanbul-walled-obelisk.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * floor of the pit round the base. Bearing 41: the model's axes run along
 * the Hippodrome's spina (+y = compass 41°); OSM's square (way/1120852418)
 * has edges at 41° and 131°. Anchor = that square's centroid, 28.974842,
 * 41.005405.
 *
 * Identity (from the photos below): a tall, slender, slightly tapering
 * shaft of rough pale limestone blocks, weathered grey in patches and
 * pitted with the holes of the lost bronze plates, with a small pointed
 * cap; on a plain marble base down in a railed pit.
 *
 * Dimensions. Published: 32 m high (Wikipedia "Walled Obelisk", en; OSM
 * height=32). Drawn 32 m from the pit floor to the tip. OSM's square is
 * 2.26 m a side, too small for the shaft (it reads as a placeholder); the
 * shaft is drawn 3.3 m square at its foot tapering to 1.95 m at 31.3 m
 * (the ratio read from haklai and jarvis, level views, top/foot ≈ 0.6,
 * scaled to the 32 m height), the cap to 32 m. The base: a marble block
 * 4.4 m square, 0–1.7 m, on a 0.25 m step (jarvis), estimated.
 *
 * Elevation −1.5 (evidence.md "Elevation", a base below the street): the
 * base stands in a pit lined with red plaster, its top a little over the
 * street (jarvis: the railing's footing at the base's top). Estimated from
 * that photo; no published depth. No lidar or Mapterhorn z15 terrain in
 * Istanbul.
 *
 * The pit lining is drawn facing in (an 8 m square, jarvis), with the
 * stone kerb, the marble posts and a top rail on the street.
 *
 * Night: floodlit from below (palmero, in the Theodosius generator's
 * sources).
 *
 * Photos (evidence, Wikimedia Commons):
 *  haklai "Walled Obelisk.jpg", Yair Haklai, CC BY-SA 4.0
 *  jarvis "Turkey-03247 - Walled Obelisk (11312655706).jpg", Dennis G. Jarvis, CC BY-SA 2.0
 *  dd131  "Obelisco de Constantino, Estambul, Turquía, 2024-09-28, DD 131.jpg", Diego Delso, CC BY-SA 4.0
 *  front  "Walled Obelisk Front.jpg", Uğur Başak, CC BY-SA 3.0
 *  back   "Walled Obelisk Back.jpg", Uğur Başak, CC BY-SA 3.0
 *  dudva  "Walled Obelisk, Istanbul.jpg", Dudva, CC BY-SA 4.0
 * Look-only: none.
 *
 * Doubts: the shaft's widths and the pit depth are photo estimates; OSM's
 * square is smaller than the real shaft.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { box, save } from './atl-flatiron-building'

const shaft = new Part(), weather = new Part(), marble = new Part(), rail = new Part(), lining = new Part()
const sq = (h: number, z: number): V3[] => [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]]

const STREET = 1.5

// 1. The base on its step.
marble.loft([sq(2.45, 0), sq(2.45, 0.25)]); marble.cap(sq(2.45, 0.25), true)
marble.loft([sq(2.2, 0.25), sq(2.2, 1.55)])
marble.loft([sq(2.2, 1.55), sq(2.3, 1.7)]); marble.cap(sq(2.3, 1.7), true)

// 2. The shaft, slightly bevelled at its corners (chamfered octagon), and
//    the cap. The lower third reads pale and even, the upper part greyer
//    and patchier (back, front): the shaft's skin is split in two tones.
function chamfered(h: number, c: number, z: number): V3[] {
  return [[-h + c, -h, z], [h - c, -h, z], [h, -h + c, z], [h, h - c, z], [h - c, h, z], [-h + c, h, z], [-h, h - c, z], [-h, -h + c, z]]
}
const Z0 = 1.7, Z1 = 31.3, H0 = 1.65, H1 = 0.975
const hAt = (z: number) => H0 + ((H1 - H0) * (z - Z0)) / (Z1 - Z0)
const levels = [Z0, 11.5, 31.3]
shaft.loft([chamfered(hAt(levels[0]), 0.25, levels[0]), chamfered(hAt(levels[1]), 0.22, levels[1])])
weather.loft([chamfered(hAt(levels[1]), 0.22, levels[1]), chamfered(hAt(levels[2]), 0.18, levels[2])])
{
  const top = chamfered(H1, 0.18, Z1), apex: V3 = [0, 0, 32]
  for (let i = 0; i < 8; i++) weather.tri(top[i], top[(i + 1) % 8], apex)
}
// 3. The pit: lining facing in, the kerb, posts and a top rail.
{
  const H = 4.0, K = 0.55, zk = STREET + 0.3
  lining.loft([sq(H, 0).reverse(), sq(H, STREET).reverse()])
  marble.loft([sq(H, STREET).reverse(), sq(H, zk).reverse()])
  marble.loft([sq(H + K, STREET), sq(H + K, zk)])
  const i0 = sq(H, zk), o0 = sq(H + K, zk)
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; marble.quad(i0[i], o0[i], o0[j], i0[j]) }
  const n = 4, hm = H + K / 2
  for (let k = 0; k < n * 4; k++) {
    const side = Math.floor(k / n), t = -hm + (2 * hm * (k % n)) / n
    const [x, y] = side === 0 ? [t, -hm] : side === 1 ? [hm, t] : side === 2 ? [-t, hm] : [-hm, -t]
    box(marble, x - 0.22, x + 0.22, y - 0.22, y + 0.22, zk, zk + 1.25, marble, 0.08)
  }
  for (const [x0, x1, y0, y1] of [[-hm, hm, -hm - 0.04, -hm + 0.04], [-hm, hm, hm - 0.04, hm + 0.04], [-hm - 0.04, -hm + 0.04, -hm, hm], [hm - 0.04, hm + 0.04, -hm, hm]]) {
    box(rail, x0, x1, y0, y1, zk + 1.0, zk + 1.08, rail, 0, true)
  }
}

const up = (p: V3, n: V3) => (n[2] > 0.6 ? 0.2 : Math.max(0.3, 1 - p[2] / 45))
await save('istanbul-walled-obelisk', 'Walled Obelisk', [
  { part: shaft, material: { ...finish('walled-obelisk-stone', 0xe6dcc7), floodlight: up } },
  { part: weather, material: { ...finish('walled-obelisk-weathered', 0xd2c9b8), floodlight: up } },
  { part: marble, material: { ...finish('walled-obelisk-marble', 0xece6dc), floodlight: up } },
  { part: rail, material: finish('walled-obelisk-iron', 0x4f5560, 0.6) },
  { part: lining, material: finish('walled-obelisk-pit', 0xc59a88) },
], { height: 32, anchor: [41.005405, 28.974842], bearing: 41, elevation: -1.5 })
