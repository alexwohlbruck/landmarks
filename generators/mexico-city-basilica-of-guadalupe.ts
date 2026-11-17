/**
 * Basilica of Our Lady of Guadalupe (the new basilica; Insigne y Nacional
 * Basílica de Santa María de Guadalupe), Villa de Guadalupe, Mexico City —
 * procedural, CC0-1.0, no textures.
 * bun generators/mexico-city-basilica-of-guadalupe.ts
 *
 * Pedro Ramírez Vázquez, José Luis Benlliure and others, 1974–76. A round
 * church about 100 m across: a concrete drum with bands of stained glass
 * over a recessed ground storey of doors, under a great tent roof of
 * verdigris copper that rises, stepped with clerestory bands, to a crown
 * set towards the back: a cone of pale cream fins, a concrete ring, an
 * A-frame and a cross. A concrete pylon with a cross stands over the open
 * balcony on the atrium side.
 *
 * Map frame: x east, y north, z up, metres, turned to the church's axis.
 * Placement bearing 290: the model's +y (the back, where the crown is)
 * points to compass 290° (WNW); the atrium front is at −y (compass 110°),
 * where the pylon and balcony stand on the axis.
 * The anchor is the area centroid of OSM way/120733641 (lng −99.117857,
 * lat 19.484845).
 *
 * Covers and replaces way/120733641 (building=church). The free-standing
 * carillon/clock tower (way/299611954) stands ~170 m away across the Atrio
 * de América and is not part of this model; neither is the old basilica
 * (way/120733637, its own model) nor the baptistery.
 *
 * Evidence
 * - OSM (measured): way/120733641 is a near-circle, radius 50.4 m about the
 *   centroid (50 nodes). The Atrio de América (way/1212616388) hugs its
 *   east and south-east side.
 * - Orientation (estimated from photos): the crown stands towards compass
 *   ~290° from the centre and the pylon over the balcony at ~110°.
 *   Worked out from the drone views 16 and 17 (anchored on the old
 *   basilica, the Capuchinas dome and the carillon), the atrium view 21
 *   (crown to the left, pylon to the right of the new basilica seen from
 *   the atrium), and the hill views 5, 19 and 20 (crown on the far side,
 *   right of centre), and photo 6 (pylon left, crown just right of centre,
 *   seen from the east). The crown's offset from the centre (35 m) is
 *   read from 16 and 17: its fins come down almost to the back rim.
 * - Heights (photo-scaled, estimated; no published figure found; review
 *   round 1 re-measure). Photo 6 (Drkgk, from the east, near level): the
 *   drum is 225 px from the ground to its rim; people at the doors are
 *   ~30 px for 1.7 m (~17.5 px/m at the near face), so the drum is ~13 m
 *   (door storey 5 m, glass band 6.4–11.8 m, rim fascia to 14 m). The
 *   drum's silhouette (1,110 px for 100.8 m) gives ~11 px/m at the
 *   centre's depth, which puts the camera ~140 m from the centre; the
 *   crown, ~33 m beyond the centre, is then at ~8.9 px/m. From the
 *   horizon (y≈640): fin foot y≈395 → ~27 m, fin top / ring y≈340 →
 *   ~34–36 m, cross top y≈265 → ~43 m. Photo 21 (far, from the atrium)
 *   agrees: cross top ~2.7× the drum's apparent height, ~3.2× after the
 *   ~15% setback correction (~42 m). The roof rises from the 14 m rim,
 *   low and flat near the rim and steepening into the crown. The pylon
 *   stands on the near face: its cross top is 1.73× the drum (photo 6,
 *   same depth) → ~23.8 m, drawn to 25 m (a little bolder, for phone
 *   size); its foot spreads ~10 m across the balcony, its shaft is ~3.6 m
 *   wide and 3 m deep, its cross arms ~7.6 m.
 *   Note: tools/render.ts is orthographic, so a render never shows the
 *   photo's perspective shrink of the far crown; compare real heights.
 *   The first version had the drum at 15.5 m and the crown to 51.6 m,
 *   from photos without the perspective correction.
 * - Terrain: Mapterhorn has no z15 terrain here (tools/terrain.ts 404s);
 *   the site is on the flat lake-bed plain at the foot of the Tepeyac hill
 *   (~2,240 m). Elevation 0.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 "Main facade - New Basilica of Our Lady of Guadalupe - Mexico 2024.jpg",
 *     José Luiz, CC BY-SA 4.0
 *   2 "Rear view - New Basilica of Our Lady of Guadalupe - Mexico 2024.jpg"
 *     and "… (2).jpg", José Luiz, CC BY-SA 4.0
 *   4 "View from the street - New Basilica of Our Lady of Guadalupe - Mexico
 *     2024.jpg", José Luiz, CC BY-SA 4.0
 *   5 "Basilica of Our Lady of Guadalupe, Mexico.jpg", Eneas De Troya,
 *     CC BY 2.0
 *   6 "Basílica de Santa María de Guadalupe 2018.jpg", Drkgk, CC0
 *   7 "Nueva Basílica de Nuestra Señora de Guadalupe - Outside - 1.JPG" and
 *     "- 2.JPG", Jarek Tuszyński, CC BY 4.0
 *   9 "2013-12-23 Nueva Basílica de Nuestra Señora de Guadalupe
 *     anagoria.JPG", Anagoria, CC BY 3.0
 *   11, 12, 16, 17 "Basílica de Guadalupe desde el aire 1/2/6/7.jpg",
 *     ProtoplasmaKid, CC BY-SA 4.0
 *   19 "Vista de la Plaza Mariana desde el Cerro del Tepeyac 03.jpg",
 *     ProtoplasmaKid, CC BY 4.0
 *   20 "Basílica de Guadalupe CDMX 2024.jpg", PlanoAbierto, CC BY 4.0
 *   21 "Atrio de las Américas - La Villa - Basílica de Guadalupe - Ciudad de
 *     México.jpg", Juan Carlos Fonseca Mata, CC BY-SA 4.0
 *   22 "Complejo Villa de Guadalupe.JPG", Erick Hershele Gallegos Galván,
 *     CC BY-SA 3.0
 * - Look-only: none. No commercial imagery.
 * - Colours from the daylight photos: the roof a light verdigris
 *   (#8fc0ac), the crown fins cream (#eadcae), the drum warm grey concrete
 *   (#bdb2a2), the doors teal-and-gold mosaic (entrance #6f9a8e), the
 *   balcony's back wall red-brown tile, the cross and A-frame bronze.
 * - Simplified: the stained glass is grouped into one panel per bay; the
 *   roof's copper seams and ribs are left out, the radial ridges kept as a
 *   few raised ribs; the loudspeakers, lamps and flagpoles are left out.
 * - Doubts: no height is published in an open source; all heights are
 *   photo estimates. The crown's exact offset and the pylon's bearing are
 *   read from oblique drone photos (±10°). The drum's back (street) side
 *   is seen only in photos 2–4.
 * - Night: the drum and crown are floodlit; the stained glass and doors
 *   glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, lathe } from './dc-nmaahc'
import { cbox, qf, tf } from './dc-white-house'

const R = 50.4 // drum radius (OSM)
const ZG = 5.0 // top of the recessed ground storey
const ZD = 13 // top of the drum
const ZR = 14 // top of the rim fascia
const CY = 35 // crown centre (0, CY)
const RF0 = 12, ZF0 = 27 // fin cone foot
const RF1 = 6.6, ZF1 = 34 // fin cone top = ring
const ZRING = 36

const pol = (r: number, a: number, z: number, cx = 0, cy = 0): V3 => [cx + r * Math.sin(a), cy + r * Math.cos(a), z] // a clockwise from +y
const rad = (d: number) => (d * Math.PI) / 180

function build() {
  const conc = new Part(), cu = new Part(), cream = new Part(), win = new Part(), door = new Part(), bronze = new Part()

  // ---- Drum. Ground storey recessed 1.6 m behind piers; the upper drum
  // overhangs it; a verdigris fascia caps it.
  const N = 64
  const RG = R - 1.6
  lathe(conc, 0, 0, [[RG, 0], [RG, ZG]], N, false)
  // soffit under the overhang (facing down)
  for (let i = 0; i < N; i++) {
    const a0 = (i * 2 * Math.PI) / N, a1 = ((i + 1) * 2 * Math.PI) / N
    qf(conc, pol(RG, a0, ZG), pol(R, a0, ZG), pol(R, a1, ZG), pol(RG, a1, ZG), [0, 0, -1])
  }
  lathe(conc, 0, 0, [[R, ZG], [R, ZD]], N, false)
  lathe(cu, 0, 0, [[R, ZD], [R + 0.35, ZD], [R + 0.35, ZR - 0.3], [R + 0.05, ZR]], N, false)

  // Bays: 18 around; each a stained-glass panel between paired pilasters,
  // with doors in the ground storey. The balcony bay (under the pylon) is
  // a recess instead.
  const NB = 18
  const PYLON = rad(180) // model angle of the pylon (compass 110°)
  for (let k = 0; k < NB; k++) {
    const ac = (k * 2 * Math.PI) / NB + PYLON // bay centres; bay 0 is under the pylon
    const half = Math.PI / NB
    const isBalcony = k === 0
    // paired pilasters at the bay edge, full drum height
    const ae = ac + half
    for (const s of [-1, 1]) {
      const a = ae + s * 0.012
      const t: V3 = [Math.cos(a), -Math.sin(a), 0], o: V3 = [Math.sin(a), Math.cos(a), 0]
      const P = (u: number, d: number, z: number): V3 => [o[0] * (R + d) + t[0] * u, o[1] * (R + d) + t[1] * u, z]
      // a fin 0.7 wide standing 0.8 proud, from the ground to the drum top
      const w = 0.35
      qf(conc, P(-w, 0.8, 0), P(w, 0.8, 0), P(w, 0.8, ZD - 0.1), P(-w, 0.8, ZD - 0.1), o)
      qf(conc, P(-w, -1.6, 0), P(-w, 0.8, 0), P(-w, 0.8, ZD - 0.1), P(-w, -1.6, ZD - 0.1), [-t[0], -t[1], 0])
      qf(conc, P(w, -1.6, 0), P(w, 0.8, 0), P(w, 0.8, ZD - 0.1), P(w, -1.6, ZD - 0.1), t)
      qf(conc, P(-w, 0, ZD - 0.1), P(w, 0, ZD - 0.1), P(w, 0.8, ZD - 0.1), P(-w, 0.8, ZD - 0.1), [0, 0, 1])
    }
    // the glass: three facets following the curve
    const g0 = ac - half + 0.045, g1 = ac + half - 0.045
    if (isBalcony) {
      // open balcony: a dark red-brown tiled back wall, a white parapet
      for (let f = 0; f < 3; f++) {
        const b0 = g0 + ((g1 - g0) * f) / 3, b1 = g0 + ((g1 - g0) * (f + 1)) / 3
        const m = (b0 + b1) / 2, o: V3 = [Math.sin(m), Math.cos(m), 0]
        qf(bronze, pol(R + 0.03, b0, ZG + 1.6), pol(R + 0.03, b1, ZG + 1.6), pol(R + 0.03, b1, ZD - 1.4), pol(R + 0.03, b0, ZD - 1.4), o)
        qf(cream, pol(R + 0.06, b0, ZG + 0.6), pol(R + 0.06, b1, ZG + 0.6), pol(R + 0.06, b1, ZG + 1.6), pol(R + 0.06, b0, ZG + 1.6), o)
      }
    } else {
      for (let f = 0; f < 3; f++) {
        const b0 = g0 + ((g1 - g0) * f) / 3, b1 = g0 + ((g1 - g0) * (f + 1)) / 3
        const m = (b0 + b1) / 2, o: V3 = [Math.sin(m), Math.cos(m), 0]
        qf(win, pol(R + 0.05, b0, 6.4), pol(R + 0.05, b1, 6.4), pol(R + 0.05, b1, 11.8), pol(R + 0.05, b0, 11.8), o)
      }
      // the south-west (street) side: concrete louvres over the glass,
      // as the drone views show (vertical ribs the full band height)
      const deg = ((((ac * 180) / Math.PI) % 360) + 360) % 360
      if (deg > 225 && deg < 335) {
        for (let r = 1; r < 6; r++) {
          const a = g0 + ((g1 - g0) * r) / 6, o: V3 = [Math.sin(a), Math.cos(a), 0], t: V3 = [Math.cos(a), -Math.sin(a), 0]
          const Pl = (u: number, d: number, z: number): V3 => [o[0] * (R + d) + t[0] * u, o[1] * (R + d) + t[1] * u, z]
          const w = 0.32
          qf(conc, Pl(-w, 0.5, 6.2), Pl(w, 0.5, 6.2), Pl(w, 0.5, 12), Pl(-w, 0.5, 12), o)
          qf(conc, Pl(-w, 0, 6.2), Pl(-w, 0.5, 6.2), Pl(-w, 0.5, 12), Pl(-w, 0, 12), [-t[0], -t[1], 0])
          qf(conc, Pl(w, 0, 6.2), Pl(w, 0.5, 6.2), Pl(w, 0.5, 12), Pl(w, 0, 12), t)
        }
      }
    }
    // doors in the ground storey: two leaves per bay
    for (const [d0, d1] of [[0.1, 0.45], [0.55, 0.9]]) {
      const b0 = ac - half + 2 * half * d0, b1 = ac - half + 2 * half * d1
      const m = (b0 + b1) / 2, o: V3 = [Math.sin(m), Math.cos(m), 0]
      qf(door, pol(RG + 0.05, b0, 0), pol(RG + 0.05, b1, 0), pol(RG + 0.05, b1, 4.2), pol(RG + 0.05, b0, 4.2), o)
    }
  }

  // ---- The roof: a tent about the crown at (0, CY), from the fin cone's
  // foot (r 12, z 27) down to the rim (z 15), steep at the crown and
  // flattening to the front; three clerestory steps.
  const NA = 48
  const rimDist = (a: number) => {
    const ux = Math.sin(a), uy = Math.cos(a)
    const b = CY * uy, c = CY * CY - (R - 0.2) ** 2
    return -b + Math.sqrt(b * b - c)
  }
  const STEPS = [0.07, 0.16, 0.27] // fractions along each ray where the roof steps down
  const DROP = 1.0
  // smooth height along the ray (before the steps), t 0..1
  const H0 = (t: number) => ZR + (ZF0 - ZR + STEPS.length * DROP) * Math.pow(1 - t, 3)
  const H = (t: number, side: 0 | 1) => {
    // side 0: just inside a step (upper); 1: just outside (lower)
    let n = 0
    for (const s of STEPS) if (t > s + 1e-9 || (side === 1 && Math.abs(t - s) < 1e-9)) n++
    return H0(t) - n * DROP
  }
  const P = (a: number, t: number, side: 0 | 1 = 0): V3 => {
    const L = rimDist(a), r = RF0 + (L - RF0) * t
    return [r * Math.sin(a), CY + r * Math.cos(a), H(t, side)]
  }
  const TS = [0, 0.035, 0.07, 0.115, 0.16, 0.21, 0.27, 0.35, 0.45, 0.57, 0.72, 0.86, 1]
  const normalAt = (a: number, t: number): V3 => {
    const e = 0.004, ea = 0.01
    const p = P(a, t), pa = P(a + ea, t), pt = P(a, Math.min(1, t + e))
    const pt0 = P(a, Math.max(0, t - e))
    const da: V3 = [pa[0] - p[0], pa[1] - p[1], pa[2] - p[2]]
    const dt: V3 = [pt[0] - pt0[0], pt[1] - pt0[1], H0(Math.min(1, t + e)) - H0(Math.max(0, t - e))]
    const n: V3 = [dt[1] * da[2] - dt[2] * da[1], dt[2] * da[0] - dt[0] * da[2], dt[0] * da[1] - dt[1] * da[0]]
    const l = Math.hypot(...n)
    return n[2] < 0 ? [-n[0] / l, -n[1] / l, -n[2] / l] : [n[0] / l, n[1] / l, n[2] / l]
  }
  for (let i = 0; i < NA; i++) {
    const a0 = (i * 2 * Math.PI) / NA, a1 = ((i + 1) * 2 * Math.PI) / NA
    for (let k = 0; k < TS.length - 1; k++) {
      const t0 = TS[k], t1 = TS[k + 1]
      const sa = STEPS.includes(t0) ? 1 : 0
      const A = P(a0, t0, sa as 0 | 1), B = P(a1, t0, sa as 0 | 1), C = P(a1, t1, 0), D = P(a0, t1, 0)
      const nA = normalAt(a0, t0 + 1e-4), nB = normalAt(a1, t0 + 1e-4), nC = normalAt(a1, t1 - 1e-4), nD = normalAt(a0, t1 - 1e-4)
      cu.tri(A, B, C, undefined, undefined, undefined, [nA, nB, nC])
      cu.tri(A, C, D, undefined, undefined, undefined, [nA, nC, nD])
    }
    // the clerestory risers: a dark glazed band facing out down the slope
    for (const s of STEPS) {
      const A = P(a0, s, 1), B = P(a1, s, 1), C = P(a1, s, 0), D = P(a0, s, 0)
      const m = (a0 + a1) / 2, o: V3 = [Math.sin(m), Math.cos(m), 0]
      qf(win, A, B, C, D, o)
    }
  }
  // radial ridges over the roof: raised copper ribs from the crown to the rim
  const NR = 16
  for (let j = 0; j < NR; j++) {
    const a = (j * 2 * Math.PI) / NR + Math.PI / NR
    const t: V3 = [Math.cos(a), -Math.sin(a), 0]
    const w = 0.45, hgt = 0.45
    const pts: Array<[V3, number]> = []
    for (const s of TS) {
      if (STEPS.includes(s)) { pts.push([P(a, s, 0), s]); pts.push([P(a, s, 1), s]) } else pts.push([P(a, s, 0), s])
    }
    for (let k = 0; k < pts.length - 1; k++) {
      const p0 = pts[k][0], p1 = pts[k + 1][0]
      const L = (p: V3, s: number, h: number): V3 => [p[0] + t[0] * s * w, p[1] + t[1] * s * w, p[2] + h]
      const up: V3 = [0, 0, 1]
      qf(cu, L(p0, -1, hgt), L(p0, 1, hgt), L(p1, 1, hgt), L(p1, -1, hgt), up)
      qf(cu, L(p0, -1, 0), L(p0, -1, hgt), L(p1, -1, hgt), L(p1, -1, 0), [-t[0], -t[1], 0])
      qf(cu, L(p0, 1, 0), L(p0, 1, hgt), L(p1, 1, hgt), L(p1, 1, 0), t)
    }
  }

  // ---- The crown: a dark inner cone, 24 cream fins on it, the concrete
  // ring, an A-frame and the cross.
  lathe(conc, 0, CY, [[RF0 - 0.6, ZF0 - 1.5], [RF1 - 0.3, ZF1]], 24, false)
  const NF = 24
  for (let j = 0; j < NF; j++) {
    const ac = (j * 2 * Math.PI) / NF, hw = (Math.PI / NF) * 0.78
    const out = 0.45
    const Q = (a: number, r: number, z: number): V3 => pol(r, a, z, 0, CY)
    const b0 = Q(ac - hw, RF0, ZF0 - 1.2), b1 = Q(ac + hw, RF0, ZF0 - 1.2), t1 = Q(ac + hw * 0.9, RF1 + out, ZF1 - 0.2), t0 = Q(ac - hw * 0.9, RF1 + out, ZF1 - 0.2)
    const nn: V3 = [Math.sin(ac) * 0.75, Math.cos(ac) * 0.75, 0.66]
    qf(cream, b0, b1, t1, t0, nn)
    // fin sides back to the inner cone
    const ib0 = Q(ac - hw, RF0 - 0.7, ZF0 - 1.2), it0 = Q(ac - hw * 0.9, RF1 - 0.2, ZF1 - 0.2)
    const ib1 = Q(ac + hw, RF0 - 0.7, ZF0 - 1.2), it1 = Q(ac + hw * 0.9, RF1 - 0.2, ZF1 - 0.2)
    qf(cream, ib0, b0, t0, it0, [-Math.cos(ac), Math.sin(ac), 0])
    qf(cream, b1, ib1, it1, t1, [Math.cos(ac), -Math.sin(ac), 0])
  }
  lathe(conc, 0, CY, [[RF1 + 0.4, ZF1 - 0.4], [RF1 + 0.4, ZRING], [RF1 - 0.4, ZRING], [RF1 - 0.4, ZRING - 0.8], [0.01, ZRING - 0.8]], 24, false)
  // the A-frame: two bronze struts from the ring rising to meet at the cross
  const strut = (x0: number, z0: number, x1: number, z1: number, w = 0.55) => {
    const dx = x1 - x0, dz = z1 - z0, l = Math.hypot(dx, dz), nx = -dz / l, nz = dx / l
    const pts = [[x0 + nx * w / 2, z0 + nz * w / 2], [x1 + nx * w / 2, z1 + nz * w / 2], [x1 - nx * w / 2, z1 - nz * w / 2], [x0 - nx * w / 2, z0 - nz * w / 2]]
    const y0 = CY - w / 2, y1 = CY + w / 2
    const F = (k: number, y: number): V3 => [pts[k][0], y, pts[k][1]]
    qf(bronze, F(0, y0), F(1, y0), F(2, y0), F(3, y0), [0, -1, 0])
    qf(bronze, F(0, y1), F(1, y1), F(2, y1), F(3, y1), [0, 1, 0])
    for (let k = 0; k < 4; k++) {
      const m = (k + 1) % 4, ex = pts[m][0] - pts[k][0], ez = pts[m][1] - pts[k][1]
      qf(bronze, F(k, y0), F(m, y0), F(m, y1), F(k, y1), [ez, 0, -ex].map((v, i) => (i === 1 ? 0 : v)) as V3)
    }
  }
  strut(-4.6, ZRING, -0.2, ZRING + 4.8)
  strut(4.6, ZRING, 0.2, ZRING + 4.8)
  cbox(bronze, { x0: -0.35, x1: 0.35, y0: CY - 0.35, y1: CY + 0.35 }, ZRING - 0.2, ZRING + 7.0)
  cbox(bronze, { x0: -2.0, x1: 2.0, y0: CY - 0.33, y1: CY + 0.33 }, ZRING + 5.0, ZRING + 5.65, { bottom: true })

  // ---- The pylon over the balcony: a tapering concrete blade rising from
  // the drum, with a cross head and a cream cross inlaid on its face.
  {
    const a = PYLON, o: V3 = [Math.sin(a), Math.cos(a), 0], t: V3 = [Math.cos(a), -Math.sin(a), 0]
    const rc = R - 2.2 // set just behind the face
    const Pp = (u: number, d: number, z: number): V3 => [o[0] * (rc + d) + t[0] * u, o[1] * (rc + d) + t[1] * u, z]
    const D0 = -1.5, D1 = 1.5 // thickness
    const prof: Array<[number, number]> = [[-5.2, ZD - 3], [5.2, ZD - 3], [1.8, 20.4], [-1.8, 20.4]]
    const blade = (pr: Array<[number, number]>, zt?: number) => {
      for (const [d, s] of [[D1, 1], [D0, -1]] as Array<[number, number]>) qf(conc, Pp(pr[0][0], d, pr[0][1]), Pp(pr[1][0], d, pr[1][1]), Pp(pr[2][0], d, pr[2][1]), Pp(pr[3][0], d, pr[3][1]), [o[0] * s, o[1] * s, 0])
      for (let k = 0; k < 4; k++) {
        const m = (k + 1) % 4, eu = pr[m][0] - pr[k][0], ez = pr[m][1] - pr[k][1]
        const n: V3 = [t[0] * ez, t[1] * ez, -eu]
        qf(conc, Pp(pr[k][0], D0, pr[k][1]), Pp(pr[m][0], D0, pr[m][1]), Pp(pr[m][0], D1, pr[m][1]), Pp(pr[k][0], D1, pr[k][1]), n)
      }
      void zt
    }
    blade(prof)
    blade([[-3.8, 20.4], [3.8, 20.4], [3.8, 22.3], [-3.8, 22.3]]) // cross arms
    blade([[-1.8, 22.3], [1.8, 22.3], [1.5, 25.0], [-1.5, 25.0]]) // head
    // the cream cross on the outer face
    const F = D1 + 0.04
    qf(cream, Pp(-0.5, F, 15.2), Pp(0.5, F, 15.2), Pp(0.5, F, 24.4), Pp(-0.5, F, 24.4), o)
    qf(cream, Pp(-3.3, F, 20.9), Pp(3.3, F, 20.9), Pp(3.3, F, 21.8), Pp(-3.3, F, 21.8), o)
  }

  // Night: the drum's upper band and the crown are floodlit.
  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0 : p[2] > ZG ? 0.6 : 0.2)
  return [
    { part: conc, material: { ...finish('concrete', 0xbdb2a2), floodlight: lit } },
    { part: cu, material: finish('verdigris', 0x8fc0ac) },
    { part: cream, material: { ...finish('crown-cream', 0xeadcae), floodlight: (p: V3) => (p[2] > 20 ? 0.9 : 0.4) } },
    { part: win, material: PALETTE.window },
    { part: door, material: { ...PALETTE.entrance, color: 0x6f9a8e } },
    { part: bronze, material: finish('bronze', 0x8a6e55) },
  ]
}

if (import.meta.main) await save('mexico-city-basilica-of-guadalupe', 'Basilica of Our Lady of Guadalupe', build(), { generator: 'generators/mexico-city-basilica-of-guadalupe.ts' }, 6500)
