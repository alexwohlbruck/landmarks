/**
 * Rainier Tower (1977, Minoru Yamasaki with NBBJ), Seattle — original
 * procedural geometry, CC0-1.0.
 * bun generators/sea-rainier-tower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the OSM
 * outline's area centroid, -122.3343526, 47.6088171) on the lowest ground
 * under the footprint (46.6 m NAVD88; the plaza rises about 3 m across it).
 * Built in the street grid's frame, like Rainier Square Tower next door: the
 * model's y axis runs up 5th Avenue (NNW), so the placement bearing is 328.8°.
 *
 * Form: a 42 m square office shaft of pale aluminium cut by narrow dark
 * window slots, with a plain band at the roof and at its foot, standing on a
 * square concrete pedestal half its width. The pedestal's four faces are
 * concave: plumb near the ground, sweeping out ever faster to meet the
 * shaft's underside almost horizontally (Yamasaki's "golf tee").
 *
 * Sources
 * - OSM: outline way/35824879; parts way/686348090 (shaft, 41 floors) and
 *   way/686348091 (pedestal, 11 floors, 21.4 m square, 37 m).
 * - Lidar (measured, USGS 3DEP WA_KingCo_1_2021): shaft 43-44 m square in
 *   the 1 m surface model (so 42 m, allowing a cell each side), centred on
 *   OSM's shaft; roof 160.7 m above the lowest ground, with sunken roof
 *   wells at 150 m (not modelled) and small plant to 163 m.
 * - Published: 156 m (514 ft) roof, 41 storeys, the 11-storey (121 ft)
 *   pedestal (Wikipedia, "Rainier Tower"). The measured roof is used.
 * - Photos (Wikimedia Commons): Cumulus Clouds 2008 and Joe Mabel 2010 (from
 *   1201 Third Avenue, high, from the west and south-west), Rsocol 2008 (from
 *   the north-west, high): the pedestal's curve, the slot rhythm, the bands.
 * Estimated: the pedestal's profile (a quarter-ellipse over its upper two
 * thirds, read from the photos; the shaft hides it from the lidar); its top
 * at 38 m (37 m published, from the plaza); slots drawn as 8 broad panels a
 * face, grouped about seven storeys high (the real shaft has about 24 slots).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, capRing, chamfer, finishGlb, loftRings, facePanels } from './sea-rainier-square-tower'

function build() {
  const alu = new Part(), win = new Part(), conc = new Part(), roof = new Part()
  const C: XY = [-0.5, 1.3] // shaft and pedestal centre (OSM and lidar agree)
  const S = 21, P0 = 10.6 // shaft and pedestal-foot half-widths
  const PED = 38, ROOF = 160.7

  // pedestal half-width against height: plumb for the lowest third, then a
  // quarter-ellipse out to the shaft, flat at the top
  const STRAIGHT = 0.3 * PED
  const w = (z: number) => {
    if (z <= STRAIGHT) return P0
    const t = Math.min(1, (z - STRAIGHT) / (PED - STRAIGHT))
    return P0 + (S - 0.6 - P0) * (1 - Math.sqrt(1 - t * t))
  }
  const dw = (z: number) => (w(Math.min(PED, z + 0.05)) - w(Math.max(0, z - 0.05))) / 0.1
  const sq = (h: number): XY[] => [[C[0] - h, C[1] - h], [C[0] + h, C[1] - h], [C[0] + h, C[1] + h], [C[0] - h, C[1] + h]]
  // levels denser toward the top, where the curve turns
  const levels = [0, STRAIGHT]
  for (let k = 1; k <= 12; k++) levels.push(STRAIGHT + (PED - STRAIGHT) * Math.sin((k / 12) * (Math.PI / 2)))
  const OUT: XY[] = [[0, -1], [1, 0], [0, 1], [-1, 0]] // outward normal of side k (from corner k to k+1)
  for (let k = 0; k + 1 < levels.length; k++) {
    const z0 = levels[k], z1 = levels[k + 1]
    const b = sq(w(z0)), t = sq(w(z1))
    const s0 = Math.min(dw(z0 + 0.01), 30), s1 = Math.min(dw(z1 - 0.01), 30)
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4, n = OUT[i]
      const N = (s: number): V3 => { const l = Math.hypot(1, s); return [n[0] / l, n[1] / l, -s / l] }
      const A: V3 = [b[i][0], b[i][1], z0], B: V3 = [b[j][0], b[j][1], z0], Bt: V3 = [t[j][0], t[j][1], z1], At: V3 = [t[i][0], t[i][1], z1]
      conc.tri(A, B, Bt, undefined, undefined, undefined, [N(s0), N(s0), N(s1)])
      conc.tri(A, Bt, At, undefined, undefined, undefined, [N(s0), N(s1), N(s1)])
    }
  }

  // the shaft
  const ring = chamfer(sq(S), 1.0)
  loftRings(alu, ring, ring, PED, ROOF)
  capRing(alu, ring, PED, false)
  capRing(roof, ring, ROOF)
  // window slots, abstracted: 8 broad panels a face (piers 40% of a panel), about seven storeys high, between a plain
  // band at the foot (the transfer floor) and a deeper one at the roof
  const BAND_LO = PED + 4.2, BAND_HI = ROOF - 9.5
  const G = (BAND_HI - BAND_LO) / 4
  const BAY = (2 * S) / 8, SLOT = 3.75
  const faces: { at: (s: number, z: number) => V3 }[] = [
    { at: (s, z) => [C[0] - S + s, C[1] - S - 0.06, z] }, // south
    { at: (s, z) => [C[0] + S + 0.06, C[1] - S + s, z] }, // east
    { at: (s, z) => [C[0] + S - s, C[1] + S + 0.06, z] }, // north
    { at: (s, z) => [C[0] - S - 0.06, C[1] + S - s, z] }, // west
  ]
  for (let g = 0; g < 4; g++) {
    const lo = BAND_LO + g * G + 0.35, hi = BAND_LO + (g + 1) * G - 0.35
    for (const f of faces) facePanels(win, f.at, 1.2, 2 * S - 1.2, lo, hi, BAY, BAY - SLOT, false, 1)
  }

  return finishGlb('sea-rainier-tower', 'Rainier Tower', [
    { part: alu, material: finish('rt-aluminium', 0xdcd9d3, 0.6) },
    { part: win, material: PALETTE.window },
    { part: conc, material: finish('rt-concrete', 0xd6cfc4) },
    { part: roof, material: PALETTE.roof },
  ], { bearing: 328.8, height: ROOF, replaces: ['way/35824879', 'way/686348090', 'way/686348091'] })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/sea-rainier-tower.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
