/**
 * Monumento a la Raza, Insurgentes Norte and Calzada Vallejo, Mexico City
 * — procedural, CC0-1.0, no textures. bun generators/mexico-city-monumento-a-la-raza.ts
 *
 * Francisco Borbolla (architecture) with sculptors Luis Lelo de Larrea
 * and others, inaugurated 12 October 1940. A pale grey stone stepped
 * pyramid in pre-Hispanic style, square in plan, with relief bands on its
 * tiers. On each of its four faces a broad pylon rises from a short stair
 * and a doorway (flanked by two serpent heads) to the top of the pyramid,
 * carrying a tall dark grille. Above the pyramid stands a smaller
 * tapering block with a bronze figure in a niche on each face, and on top
 * a bronze eagle with spread wings.
 *
 * Map frame: x east, y north, z up, metres, turned 38°: the pyramid's
 * sides in OSM way/1139108872 run at 38° and 128°, so the placement
 * bearing is 38 and the four pylons face the model's ±x and ±y. Anchor:
 * the area centroid (lng −99.142494, lat 19.464425).
 *
 * Covers and replaces way/1139108872 (building=yes, "Monumento a la Raza")
 * and its parts way/1144263096…1144263100, way/1186267703…1186267711.
 *
 * Evidence
 * - OSM (measured, turned 38°): the pyramid's foot ±13.2 m square; the
 *   stairs and their pedestals project on each axis to ±16.9 / ±18.3 m,
 *   4–9 m wide; the central core ±5 m. OSM heights (core 15 m, top 20 m)
 *   are lower than the photos show and were not used.
 * - Photo-scaled (estimated) from photo 6 (straight on to one pylon, ~16
 *   px/m on the 10 m pylon): six tiers to ~22 m; the top block to ~32 m
 *   (±4.3 m at its foot, ±2.9 m at its top); the eagle to ~38.2 m, its wings
 *   spread nearly level, ~12.6 m across (oversized ~20% for phone size). The pylon is ~9 m wide, its grille ~3.4 × 8 m high on it
 *   (13–21 m), the doorway ~3.2 × 7 m; its front leans only a little. Photo 3 (from a corner) confirms the steps and
 *   the slope of the pylons' fronts.
 * - Terrain: Mapterhorn has no z15 terrain here (tools/terrain.ts 404s);
 *   the site is on the flat lake bed (~2,240 m). Elevation 0.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   3 "Monumento a La Raza 03 2014 MEX 8349.JPG" and 4 "… 8352.JPG",
 *     Mariordo (Mario Roberto Durán Ortiz), CC BY-SA 3.0
 *   5 "VISTA DEL MONUMENTO A LA RAZA DEL AVENIDA DE LOS INSURGENTES
 *     NORTE.jpg", JEDIKNIGHT1970, CC BY-SA 2.5
 *   6 "Monumento a la Raza (2023).jpg", Tbhotch, CC BY-SA 4.0
 *   (Photos 1 and 2, "Monumento a La Raza 01/02.jpg", turned out to show
 *   the Seville monument of the same name and were not used.)
 * - Look-only: none. No commercial imagery.
 * - Colours: the stone a pale grey (#c9c4b9); the grilles and niches dark
 *   (#5a5550); the bronze eagle and figures dark bronze (#6a5a48).
 * - Simplified: the relief bands are slightly proud pale strips; the
 *   statues are flat bronze panels in their niches; the eagle is a hunched
 *   body, a head and two broad thick wing plates; the pool round the base is left
 *   out (ground).
 * - Doubts: all heights are photo estimates (no open published height);
 *   the other three pylons are assumed to match the photographed one.
 * - Night: the stone is floodlit.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { save } from './dc-nmaahc'
import { cbox, qf } from './dc-white-house'

const B = 13.2 // pyramid foot half-width
const ZP = 1.0 // plinth
const ZT = 22 // top of the pyramid
const NT = 6 // tiers

/** Rotate a point about z by k quarter turns (the four faces). */
const rot = (p: V3, k: number): V3 => {
  const c = [1, 0, -1, 0][k], s = [0, 1, 0, -1][k]
  return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]
}
const rotN = (n: V3, k: number): V3 => rot(n, k)

function build() {
  const st = new Part(), band = new Part(), dark = new Part(), bronze = new Part()

  // ---- Plinth and the stepped pyramid: six tiers, each a short wall
  // and a narrow tread, the walls leaning slightly; a pale relief band on
  // each riser.
  cbox(st, { x0: -B - 0.8, x1: B + 0.8, y0: -B - 0.8, y1: B + 0.8 }, 0, ZP, { b: 0.2 })
  const h = (ZT - ZP) / NT, top = 8.4, step = (B - top) / NT
  for (let i = 0; i < NT; i++) {
    const r0 = B - i * step, z0 = ZP + i * h, z1 = z0 + h
    const r1 = r0 - step * 0.45 // the riser leans in a little, then the tread
    const ring = (r: number, z: number): V3[] => [[-r, -r, z], [r, -r, z], [r, r, z], [-r, r, z]]
    st.loft([ring(r0, z0), ring(r1, z1)])
    const rn = r0 - step
    // tread
    for (let k = 0; k < 4; k++) {
      const a = ring(r1, z1), b2 = ring(rn, z1)
      qf(st, a[k], a[(k + 1) % 4], b2[(k + 1) % 4], b2[k], [0, 0, 1])
    }
    // relief band on each face, either side of the pylon
    for (let k = 0; k < 4; k++) {
      for (const s of [-1, 1]) {
        const u0 = s * 5.0, u1 = s * (r1 - 1.0)
        const zb0 = z0 + h * 0.3, zb1 = z0 + h * 0.7
        const rr = (z: number) => r0 + (r1 - r0) * ((z - z0) / h) + 0.06
        const P = (u: number, z: number): V3 => rot([u, -rr(z), z], k)
        qf(band, P(u0, zb0), P(u1, zb0), P(u1, zb1), P(u0, zb1), rotN([0, -h, step * 0.45], k))
      }
    }
  }
  cbox(st, { x0: -top, x1: top, y0: -top, y1: top }, ZT - 0.01, ZT + 0.3, { b: 0.2 })

  // ---- The four pylons: a broad slab on each face, its front leaning
  // from the stair at the foot to the pyramid's top; a dark grille and
  // the doorway; a short stair flanked by two serpent heads.
  const PW = 4.5 // half-width
  for (let k = 0; k < 4; k++) {
    const f0 = 14.6, f1 = 11.2 // front at the foot and the top
    const zf0 = ZP, zf1 = ZT + 1.2
    const P = (u: number, d: number, z: number): V3 => rot([u, -d, z], k)
    const nF: V3 = rotN([0, -(zf1 - zf0), f0 - f1], k)
    // front, sides and top
    qf(st, P(-PW, f0, zf0), P(PW, f0, zf0), P(PW, f1, zf1), P(-PW, f1, zf1), nF)
    for (const s of [-1, 1]) {
      const ns: V3 = rotN([s, 0, 0], k)
      qf(st, P(s * PW, 5, zf0), P(s * PW, f0, zf0), P(s * PW, f1, zf1), P(s * PW, 5, zf1), ns)
    }
    qf(st, P(-PW, f1, zf1), P(PW, f1, zf1), P(PW, 5, zf1), P(-PW, 5, zf1), [0, 0, 1])
    // inner frame strips (pale) and the dark grille, the doorway
    const F = (u: number, z: number, d = 0.08): V3 => {
      const t = (z - zf0) / (zf1 - zf0), dd = f0 + (f1 - f0) * t + d
      return P(u, dd, z)
    }
    qf(band, F(-PW + 0.6, zf0), F(-PW + 1.4, zf0), F(-PW + 1.4, zf1 - 0.6), F(-PW + 0.6, zf1 - 0.6), nF)
    qf(band, F(PW - 1.4, zf0), F(PW - 0.6, zf0), F(PW - 0.6, zf1 - 0.6), F(PW - 1.4, zf1 - 0.6), nF)
    qf(dark, F(-1.7, 13.0, 0.12), F(1.7, 13.0, 0.12), F(1.7, 21.0, 0.12), F(-1.7, 21.0, 0.12), nF)
    qf(dark, F(-1.6, zf0 + 1.4, 0.12), F(1.6, zf0 + 1.4, 0.12), F(1.6, 8.6, 0.12), F(-1.6, 8.6, 0.12), nF)
    // stair to the door and the two serpent-head pedestals
    for (let i = 0; i < 4; i++) {
      const d0 = f0 + 2.0 - i * 0.5
      const a = P(-2.0, d0, ZP + i * 0.35), b = P(2.0, f0 - 0.2, ZP + (i + 1) * 0.35)
      cbox(st, { x0: Math.min(a[0], b[0]), x1: Math.max(a[0], b[0]), y0: Math.min(a[1], b[1]), y1: Math.max(a[1], b[1]) }, ZP + i * 0.35, ZP + (i + 1) * 0.35)
    }
    for (const s of [-1, 1]) {
      const a = P(s * 2.2, 18.2, 0), b = P(s * 4.4, f0 - 0.5, 0)
      cbox(st, { x0: Math.min(a[0], b[0]), x1: Math.max(a[0], b[0]), y0: Math.min(a[1], b[1]), y1: Math.max(a[1], b[1]) }, 0, 2.2, { b: 0.15 })
      const c = P(s * 3.3, 16.6, 0)
      cbox(band, { x0: c[0] - 1.0, x1: c[0] + 1.0, y0: c[1] - 1.0, y1: c[1] + 1.0 }, 2.2, 3.8, { b: 0.3 }) // the serpent head
    }
  }

  // ---- The top block: a tapering square block with a bronze figure in a
  // niche on each face, a cap, and the eagle.
  const T0 = 4.3, T1 = 2.9, Z0 = ZT + 0.3, Z1 = 32
  const ring = (r: number, z: number): V3[] => [[-r, -r, z], [r, -r, z], [r, r, z], [-r, r, z]]
  st.loft([ring(T0, Z0), ring(T1, Z1)])
  st.loft([ring(T1 + 0.3, Z1), ring(T1 + 0.3, Z1 + 0.5), ring(2.2, Z1 + 1.4)])
  st.cap(ring(2.2, Z1 + 1.4), true)
  for (let k = 0; k < 4; k++) {
    const Fz = (u: number, z: number, d: number): V3 => {
      const t = (z - Z0) / (Z1 - Z0), r = T0 + (T1 - T0) * t + d
      return rot([u, -r, z], k)
    }
    const n: V3 = rotN([0, -(Z1 - Z0), T0 - T1], k)
    qf(dark, Fz(-1.6, Z0 + 0.8, 0.05), Fz(1.6, Z0 + 0.8, 0.05), Fz(1.3, Z1 - 1.0, 0.05), Fz(-1.3, Z1 - 1.0, 0.05), n)
    // the bronze figure standing in the niche: a bold slab
    const a = Fz(-0.85, Z0 + 1.0, 0.06), b = Fz(0.85, Z0 + 1.0, 0.45)
    cbox(bronze, { x0: Math.min(a[0], b[0]), x1: Math.max(a[0], b[0]), y0: Math.min(a[1], b[1]), y1: Math.max(a[1], b[1]) }, Z0 + 1.0, Z1 - 1.6, { b: 0.2 })
  }

  // ---- The eagle: a hunched body and broad wings spread nearly level
  // (photo 3), drawn a little oversized so the spread reads at 80 px.
  const ZE = Z1 + 1.4
  cbox(bronze, { x0: -0.9, x1: 0.9, y0: -0.9, y1: 0.9 }, ZE, ZE + 0.6, { b: 0.15 })
  cbox(bronze, { x0: -1.1, x1: 1.1, y0: -1.3, y1: 1.3 }, ZE + 0.6, ZE + 3.3, { c: 0.45, b: 0.5 })
  cbox(bronze, { x0: -0.55, x1: 0.55, y0: -1.9, y1: -0.7 }, ZE + 2.6, ZE + 3.5, { b: 0.25 }) // head, forward and low
  for (const s of [-1, 1]) {
    // a thick wing plate: root at the shoulders, a broad level span, tips
    // lifting slightly, the trailing edge feathered lower
    const top: V3[] = [[s * 0.8, -1.0, ZE + 3.3], [s * 3.5, -0.9, ZE + 3.9], [s * 6.3, -0.4, ZE + 4.7], [s * 6.1, 0.7, ZE + 4.2], [s * 4.2, 1.4, ZE + 3.3], [s * 2.4, 1.5, ZE + 2.9], [s * 0.8, 1.1, ZE + 2.7]]
    const T = 0.45
    const bot = top.map((q) => [q[0], q[1], q[2] - T] as V3)
    for (let i = 1; i < top.length - 1; i++) {
      const tri = [top[0], top[i], top[i + 1]]
      const n = (u: V3, v: V3) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]] as V3
      const d1: V3 = [tri[1][0] - tri[0][0], tri[1][1] - tri[0][1], tri[1][2] - tri[0][2]], d2: V3 = [tri[2][0] - tri[0][0], tri[2][1] - tri[0][1], tri[2][2] - tri[0][2]]
      const nn = n(d1, d2), up = nn[2] >= 0
      if (up) bronze.tri(tri[0], tri[1], tri[2]); else bronze.tri(tri[0], tri[2], tri[1])
      if (up) bronze.tri(bot[0], bot[i + 1], bot[i]); else bronze.tri(bot[0], bot[i], bot[i + 1])
    }
    for (let i = 0; i < top.length; i++) {
      const j = (i + 1) % top.length
      const m: V3 = [(top[i][0] + top[j][0]) / 2 - s * 3.3, (top[i][1] + top[j][1]) / 2 - 0.3, 0]
      qf(bronze, top[i], top[j], bot[j], bot[i], m)
    }
  }

  // Night: the stone is floodlit from the ground.
  const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.1 : Math.max(0.3, 0.9 - p[2] / 60))
  return [
    { part: st, material: { ...finish('raza-stone', 0xc9c4b9), floodlight: lit } },
    { part: band, material: { ...finish('relief-stone', 0xdedad0), floodlight: lit } },
    { part: dark, material: finish('grille-dark', 0x5a5550) },
    { part: bronze, material: finish('bronze', 0x6a5a48) },
  ]
}

if (import.meta.main) await save('mexico-city-monumento-a-la-raza', 'Monumento a la Raza', build(), { generator: 'generators/mexico-city-monumento-a-la-raza.ts' }, 5000)
