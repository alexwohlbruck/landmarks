/**
 * Serpent Column (Yılanlı Sütun; the Plataean tripod's bronze column of
 * three intertwined snakes, cast 479 BC for Delphi, brought to the
 * Hippodrome by Constantine), Sultanahmet Meydanı, Istanbul — original
 * procedural geometry, CC0-1.0.
 * bun generators/istanbul-serpent-column.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * floor of the round pit the column stands in. Bearing 0 (the column and
 * its pit are round). Anchor = OSM node/415157636 (historic=column,
 * wikidata Q588892), 28.975110, 41.005665. OSM maps no outline; nothing is
 * replaced.
 *
 * Identity (from the photos below): the green-patinated bronze column of
 * three snake bodies twisted together, its top broken off where the three
 * necks parted; standing in a round pit lined with red plaster, with a
 * stone kerb and an iron railing round it at street level.
 *
 * Dimensions. The surviving column is about 5.5 m high (photo-scaled
 * against the pit and the railing in misterno and dudva1; Wikipedia "Serpent
 * Column", en, gives 8 m for the whole column when it still had its
 * heads). Drawn: a 0.2 m stone plinth, the column 0.2–5.65 m, about 0.75 m
 * across (drawn a little bolder than the real ~0.6 m so it survives at map
 * scale); each snake makes a full turn in 1.1 m (the real coils are about
 * twice as tight; halved, per STYLE.md's density rule for thin members).
 *
 * Elevation −3.2 (evidence.md "Elevation", a base below the street): the
 * pit floor is the Hippodrome's old level and the column's top stands
 * about 2.4 m over the street (dudva1: the broken top about 1 m over the
 * railing). Estimated from the photos; no published depth. The pit is
 * about 6.8 m across inside (dudva1, cobija), estimated. No lidar or
 * Mapterhorn z15 terrain in Istanbul.
 *
 * Photos (evidence, Wikimedia Commons):
 *  dudva1   "Serpent Column, Istanbul 1.jpg", Dudva, CC BY-SA 4.0 (the pit and railing)
 *  dudva2   "Serpent Column, Istanbul 2.jpg", Dudva, CC BY-SA 4.0
 *  scott    "Bronze Serpent Column in Istanbul.jpg", Ian Scott, CC BY-SA 2.0
 *  lorien   "Serpent Column Istanbul.jpg", Loriensong, CC BY-SA 4.0
 *  sonse    "Yılanlı Sütun, Serpent Column Istanbul.jpg", Sonse, CC BY 2.0
 *  gry      "Snake column Hippodrome Constantinople 2007.jpg", Gryffindor, public domain
 *  cobija   "Yılanlı Sütun (2).jpg", Cobija, CC BY-SA 4.0
 *  misterno "Serpent Column - panoramio.jpg", Mister No, CC BY 3.0
 * Look-only: none.
 *
 * Doubts: the pit's depth and width and the column's height are photo
 * estimates. At map scale only the top half of the column and the railed
 * ring show; the rest is below the street.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { save, smoothWall, circle } from './atl-flatiron-building'
import { revolve } from './atl-tech-tower'

const bronze = new Part(), stone = new Part(), iron = new Part(), lining = new Part()

// 1. The plinth.
revolve(stone, [0, 0], [[0.62, 0], [0.62, 0.2], [0.45, 0.2]], 12, 0, true, false)

// 2. The three snakes: tubes swept along helices, each a third of a turn
//    apart, swelling slightly toward the bottom.
{
  const Z0 = 0.2, Z1 = 5.45, PITCH = 1.1, SEG = 10, SIDES = 6
  const turns = (Z1 - Z0) / PITCH, N = Math.round(turns * SEG)
  for (let s = 0; s < 3; s++) {
    const ph = (s * Math.PI * 2) / 3
    const path: V3[] = [], rad: number[] = []
    for (let i = 0; i <= N; i++) {
      const t = i / N, z = Z0 + (Z1 - Z0) * t, a = ph + (z - Z0) / PITCH * Math.PI * 2
      const rh = 0.19 - 0.02 * t
      path.push([rh * Math.cos(a), rh * Math.sin(a), z]); rad.push(0.2 - 0.03 * t)
    }
    // the broken necks: each snake leans out and up from the top
    for (let k = 1; k <= 2; k++) {
      const last = path[N], dir = [Math.cos(ph + turns * Math.PI * 2), Math.sin(ph + turns * Math.PI * 2)]
      path.push([last[0] + dir[0] * 0.05 * k, last[1] + dir[1] * 0.05 * k, last[2] + 0.1 * k]); rad.push(0.17)
    }
    const rings: V3[][] = path.map((p, i) => {
      const q = path[Math.min(path.length - 1, i + 1)], r0 = path[Math.max(0, i - 1)]
      const tg = [q[0] - r0[0], q[1] - r0[1], q[2] - r0[2]], tl = Math.hypot(tg[0], tg[1], tg[2])
      const T = [tg[0] / tl, tg[1] / tl, tg[2] / tl]
      // a frame round the tangent: N from the radial direction, B = T × N
      let n0 = [p[0], p[1], 0]; const nl = Math.hypot(n0[0], n0[1]) || 1; n0 = [n0[0] / nl, n0[1] / nl, 0]
      const d = n0[0] * T[0] + n0[1] * T[1] + n0[2] * T[2]
      let Nn = [n0[0] - d * T[0], n0[1] - d * T[1], n0[2] - d * T[2]]; const Nl = Math.hypot(Nn[0], Nn[1], Nn[2]); Nn = [Nn[0] / Nl, Nn[1] / Nl, Nn[2] / Nl]
      const B = [T[1] * Nn[2] - T[2] * Nn[1], T[2] * Nn[0] - T[0] * Nn[2], T[0] * Nn[1] - T[1] * Nn[0]]
      return Array.from({ length: SIDES }, (_, k) => {
        const a = (k / SIDES) * Math.PI * 2, c = Math.cos(a) * rad[i], sn = Math.sin(a) * rad[i]
        return [p[0] + Nn[0] * c + B[0] * sn, p[1] + Nn[1] * c + B[1] * sn, p[2] + Nn[2] * c + B[2] * sn] as V3
      })
    })
    // smooth normals: from the ring centre out
    for (let i = 0; i < rings.length - 1; i++) {
      for (let k = 0; k < SIDES; k++) {
        const j = (k + 1) % SIDES
        const nOf = (ii: number, kk: number): V3 => { const c = path[ii], v = rings[ii][kk]; const x = [v[0] - c[0], v[1] - c[1], v[2] - c[2]]; const l = Math.hypot(x[0], x[1], x[2]); return [x[0] / l, x[1] / l, x[2] / l] }
        bronze.tri(rings[i][k], rings[i][j], rings[i + 1][j], undefined, undefined, undefined, [nOf(i, k), nOf(i, j), nOf(i + 1, j)])
        bronze.tri(rings[i][k], rings[i + 1][j], rings[i + 1][k], undefined, undefined, undefined, [nOf(i, k), nOf(i + 1, j), nOf(i + 1, k)])
      }
    }
    // close the broken end
    const end = rings[rings.length - 1], c = path[path.length - 1]
    for (let k = 0; k < SIDES; k++) {
      const a = end[k], b = end[(k + 1) % SIDES]
      const g = [(a[1] - c[1]) * (b[2] - c[2]) - (a[2] - c[2]) * (b[1] - c[1]), (a[2] - c[2]) * (b[0] - c[0]) - (a[0] - c[0]) * (b[2] - c[2]), (a[0] - c[0]) * (b[1] - c[1]) - (a[1] - c[1]) * (b[0] - c[0])]
      if (g[2] > 0) bronze.tri(c, a, b); else bronze.tri(c, b, a)
    }
  }
  // a core so no light shows between the coils
  smoothWall(bronze, circle([0, 0], 0.17, 8), 0.2, 5.4)
}

// 3. The pit: its lining facing in, the kerb, the railing.
{
  const STREET = 3.2, R = 3.4, K = 0.55, zk = STREET + 0.3, n = 24
  const ring = (r: number, z: number): V3[] => circle([0, 0], r, n).map(([x, y]) => [x, y, z])
  lining.loft([ring(R, 0).reverse(), ring(R, STREET).reverse()])
  stone.loft([ring(R, STREET).reverse(), ring(R, zk).reverse()])
  stone.loft([ring(R + K, STREET), ring(R + K, zk)])
  const i0 = ring(R, zk), o0 = ring(R + K, zk)
  for (let i = 0; i < n; i++) { const j = (i + 1) % n; stone.quad(i0[i], o0[i], o0[j], i0[j]) }
  // railing: posts and a top and bottom rail, on the kerb's middle
  const rr = R + K / 2
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2
    smoothWall(iron, circle([rr * Math.cos(a), rr * Math.sin(a)], 0.05, 4), zk, zk + 1.05)
  }
  for (const z of [zk + 0.12, zk + 0.98]) {
    const inner = circle([0, 0], rr - 0.035, n), outer = circle([0, 0], rr + 0.035, n)
    smoothWall(iron, outer, z, z + 0.07)
    smoothWall(iron, [...inner].reverse(), z, z + 0.07)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      iron.quad([inner[i][0], inner[i][1], z + 0.07], [outer[i][0], outer[i][1], z + 0.07], [outer[j][0], outer[j][1], z + 0.07], [inner[j][0], inner[j][1], z + 0.07])
    }
  }
}

await save('istanbul-serpent-column', 'Serpent Column', [
  { part: bronze, material: finish('serpent-bronze', 0x6b8f84, 0.6) },
  { part: stone, material: finish('serpent-kerb', 0xe6dfd2) },
  { part: iron, material: finish('serpent-railing', 0x4f5560, 0.6) },
  { part: lining, material: finish('serpent-pit', 0xc99a8a) },
], { height: 5.65, anchor: [41.005665, 28.97511], bearing: 0, elevation: -3.2 })
