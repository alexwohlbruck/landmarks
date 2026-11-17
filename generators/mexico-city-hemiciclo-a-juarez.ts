/**
 * Hemiciclo a Juárez (1910; architect Guillermo de Heredia, sculptor
 * Alessandro Lazzerini), Alameda Central on Avenida Juárez, Mexico City —
 * original procedural geometry, CC0-1.0.
 * bun generators/mexico-city-hemiciclo-a-juarez.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of OSM way/992941278 (building=yes,
 * historic=monument), 19.435063, -99.144097. Its two ends lie square at
 * 8.5°, so the catalog bearing is 8.5. The hemicycle opens south, to
 * Avenida Juárez; Juárez faces the avenue.
 *
 * Identity, in order: the white marble half-ring of twelve Doric columns
 * under a deep entablature edged with antefixes; the tall square pedestal
 * in the middle of the curve, rising well above the colonnade, with the
 * gilded laurel medallion ("Al Benemérito Benito Juárez, La Patria") on
 * its front, and the marble group on top: Juárez seated, the winged Patria
 * crowning him with laurel, the Law beside him with a torch raised; two
 * marble lions lying at its foot; the square end piers carrying bronze
 * tripod urns; the stepped stylobate.
 *
 * Evidence:
 *  - plan: OSM way/992941278. Fitted in the 8.5° frame: concentric arcs
 *    about (0, −7.75), inner radius 11.9 m and outer 15.4 m, a little more
 *    than a half-circle: the ends run on straight to y = −10.1 m, where the
 *    end piers stand. The pedestal is the notch in the inner arc, 4.6 m
 *    wide, its front 1.8 m north of the anchor.
 *  - twelve Doric columns, the urns, the medallion, the eagle on the base
 *    and the lions: es Wikipedia (Hemiciclo a Juárez); "55 m" there has no
 *    stated meaning and isn't used.
 *  - heights: none published. Photo-scaled, estimates: on ProtoplasmaKid's
 *    level aerial view (Vista aérea 01) by the 30.8 m span between the end
 *    piers: stylobate ~0.9 m, columns to ~6.6 m, entablature to ~8.3 m,
 *    the end piers ~9 m with urns to ~11.4 m; the pedestal ~10.8 m (≈1.3 ×
 *    the entablature, here and in Diego Delso's night view) and the group
 *    on it to ~16 m (≈0.5 × the pedestal in both).
 *  - colour: white Carrara marble, pulled a touch off pure white; the
 *    medallion, garlands and eagle gilded; the urns bronze. Floodlit at
 *    night (Diego Delso's night view).
 *  - terrain: Mapterhorn has no z15 tiles here; the Alameda is flat lake
 *    bed (~2,240 m). The broad steps down to the avenue and the paved
 *    floor inside the curve are paving, left to the map.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Hemiciclo a Juárez, México D.F., México, 2014-10-13, DD 35.JPG, Diego Delso, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Hemiciclo_a_Ju%C3%A1rez,_M%C3%A9xico_D.F.,_M%C3%A9xico,_2014-10-13,_DD_35.JPG
 *  - Hemiciclo a Juárez (vista trasera), Ciudad de México.jpg, Juan Carlos Fonseca Mata, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Hemiciclo_a_Ju%C3%A1rez_(vista_trasera),_Ciudad_de_M%C3%A9xico.jpg
 *  - Hemiciclo Juarez 1.jpg, ProtoplasmaKid, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Hemiciclo_Juarez_1.jpg
 *  - Hemiciclo a Juárez 2024.jpg, Dudva, CC0
 *    https://commons.wikimedia.org/wiki/File:Hemiciclo_a_Ju%C3%A1rez_2024.jpg
 *  - Vista aérea del Hemiciclo a Juárez 01–05.jpg, ProtoplasmaKid, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Vista_a%C3%A9rea_del_Hemiciclo_a_Ju%C3%A1rez_01.jpg
 *  - Hemiciclo a Juárez y Alameda Central 03.jpg, Correogsk, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Hemiciclo_a_Ju%C3%A1rez_y_Alameda_Central_03.jpg
 * Look-only: none. No commercial imagery.
 *
 * Left out: the columns' fluting, the triglyphs, the reliefs on the end
 * piers (drawn as plain gilt panels), the festoons' detail.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { save } from './chi-aon-center'
import { block, ellipsoid, face, lathe, slab, smooth, tube } from './nyc-columbus-monument'

const ANCHOR: [number, number] = [19.435063, -99.144097]
const BEARING = 8.5

const CY = -7.75 // the arcs' centre
const RI = 11.9, RO = 15.4, RC = 13.65, YEND = -10.1
const STY = 0.9, COL1 = 6.6, ENT1 = 8.3
const PED_HALF = 2.3, PED_Y0 = 1.8, PED_Y1 = 7.9 // pedestal shaft, x ±2.3

const P = (t: number, r: number, z: number): V3 => [r * Math.cos(t), CY + r * Math.sin(t), z]
const deg = Math.PI / 180

/** A curved band about (0, CY) between radii and heights, from angle t0 to t1; every face wound outward. */
function arcBand(p: Part, r0: number, r1: number, z0: number, z1: number, t0: number, t1: number, n: number, bottom = false) {
  for (let k = 0; k < n; k++) {
    const a = t0 + ((t1 - t0) * k) / n, b = t0 + ((t1 - t0) * (k + 1)) / n, m = (a + b) / 2
    const ins = P(m, (r0 + r1) / 2, (z0 + z1) / 2)
    face(p, P(a, r1, z0), P(b, r1, z0), P(b, r1, z1), P(a, r1, z1), ins)
    face(p, P(a, r0, z0), P(b, r0, z0), P(b, r0, z1), P(a, r0, z1), ins)
    face(p, P(a, r0, z1), P(b, r0, z1), P(b, r1, z1), P(a, r1, z1), ins)
    if (bottom) face(p, P(a, r0, z0), P(b, r0, z0), P(b, r1, z0), P(a, r1, z0), ins)
  }
  for (const t of [t0, t1]) {
    const o = t === t0 ? 1 : -1, ins = P(t + o * 0.01, (r0 + r1) / 2, (z0 + z1) / 2)
    face(p, P(t, r0, z0), P(t, r1, z0), P(t, r1, z1), P(t, r0, z1), ins)
  }
}
/** An axis-aligned box from (x0, y0, z0) to (x1, y1, z1), no bevel. */
function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, bottom = false) {
  const c: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2]
  face(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], c)
  face(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], c)
  face(p, [x1, y1, z0], [x0, y1, z0], [x0, y1, z1], [x1, y1, z1], c)
  face(p, [x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], c)
  face(p, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], c)
  if (bottom) face(p, [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], c)
}

export function build() {
  const marble = new Part(), gilt = new Part(), bronze = new Part()

  // ---- The stylobate: three steps on the inside of the curve, run on
  // along the straight ends. ----
  const T0 = 0, T1 = Math.PI
  const steps: [number, number, number][] = [[RI, 0, 0.3], [RI + 0.4, 0.3, 0.6], [RI + 0.8, 0.6, STY]]
  for (const [r0, z0, z1] of steps) {
    arcBand(marble, r0, RO, z0, z1, T0, T1, 16)
    for (const s of [-1, 1]) {
      const xa = s * r0, xb = s * RO
      box(marble, Math.min(xa, xb), YEND, z0, Math.max(xa, xb), CY, z1)
    }
  }

  // ---- The colonnade: six Doric columns each side of the pedestal. ----
  const pedT = Math.asin(PED_HALF / RC) // the pedestal's half-width, as an angle at RC
  const endT = 7 * deg // the end piers' inner edge
  const span = (90 * deg - pedT) - endT
  const colT: number[] = []
  for (let k = 1; k <= 6; k++) colT.push(endT + (k * span) / 7)
  for (const t of [...colT, ...colT.map(t => Math.PI - t)]) {
    const [x, y] = P(t, RC, 0)
    smooth(marble, q => lathe(q, [[0.55, STY], [0.55, STY + 0.22], [0.46, STY + 0.32], [0.39, COL1 - 0.45], [0.52, COL1 - 0.22], [0.6, COL1 - 0.2], [0.6, COL1]], 10, x, y), 40)
  }
  // The entablature (architrave, frieze, a projecting cornice), from the
  // end piers to the pedestal, and the antefixes along its edges.
  for (const [a, b] of [[0, 90 * deg - pedT], [90 * deg + pedT, Math.PI]] as [number, number][]) {
    arcBand(marble, RC - 0.75, RC + 0.75, COL1, ENT1 - 0.45, a, b, 10, true)
    arcBand(marble, RC - 0.98, RC + 0.98, ENT1 - 0.45, ENT1, a, b, 10, true)
    const n = 12
    for (let k = 0; k < n; k++) {
      const t = a + ((b - a) * (k + 0.5)) / n
      for (const r of [RC - 0.82]) {
        const u: V3 = [-Math.sin(t), Math.cos(t), 0], c = P(t, r, ENT1)
        // A small upright palmette slab, tangent to the curve.
        slab(marble, c, u, [0, 0, 1], [[-0.24, 0], [0.24, 0], [0.18, 0.32], [0, 0.48], [-0.18, 0.32]], 0.12)
      }
    }
  }

  // ---- The end piers on the straight ends, with their bronze urns. ----
  for (const s of [-1, 1]) {
    const x0 = s > 0 ? RC - 1.55 : -RC - 1.55, x1 = x0 + 3.1, y0 = YEND + 0.2, y1 = CY + 1.6
    block(marble, x0, y0, x1, y1, STY, ENT1 - 0.45, 0.15, 0.05)
    block(marble, x0 - 0.2, y0 - 0.2, x1 + 0.2, y1 + 0.2, ENT1 - 0.45, 9.0, 0.15, 0.15)
    block(marble, x0 + 0.5, y0 + 0.5, x1 - 0.5, y1 - 0.5, 9.0, 9.6, 0.1, 0.08)
    // The bronze relief (a fasces in a wreath) on the south face.
    {
      const m = (x0 + x1) / 2, y = y0 - 0.04
      face(bronze, [m - 0.18, y, 2.6], [m + 0.18, y, 2.6], [m + 0.18, y, 6.9], [m - 0.18, y, 6.9], [m, y0 + 1, 4])
      face(bronze, [m - 0.55, y, 4.4], [m, y, 3.7], [m + 0.55, y, 4.4], [m, y, 5.5], [m, y0 + 1, 4])
    }
    // The bronze tripod urn: three legs, a fluted bowl with a rolled lip.
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
    smooth(bronze, q => {
      for (let k = 0; k < 3; k++) {
        const a = (k / 3) * 2 * Math.PI + 0.5
        tube(q, [[cx + 0.75 * Math.cos(a), cy + 0.75 * Math.sin(a), 9.6], [cx + 0.55 * Math.cos(a), cy + 0.55 * Math.sin(a), 10.3]], [0.13, 0.11], 5)
      }
      lathe(q, [[0.2, 10.05], [0.55, 10.25], [0.8, 10.6], [0.85, 11.1], [0.95, 11.25], [0.8, 11.3]], 10, cx, cy)
    }, 50)
  }

  // ---- The pedestal: base with the gilt eagle, shaft with the medallion,
  // cornice, the upper die with its garland, the cap. ----
  block(marble, -2.75, PED_Y0 - 0.55, 2.75, PED_Y1 + 0.3, 0, 1.6, 0.15, 0.12)
  block(marble, -PED_HALF, PED_Y0, PED_HALF, PED_Y1, 1.6, 7.6, 0.12, 0.05)
  block(marble, -2.6, PED_Y0 - 0.3, 2.6, PED_Y1 + 0.3, 7.6, 8.8, 0.15, 0.2)
  block(marble, -2.0, PED_Y0 + 0.3, 2.0, PED_Y1 - 0.4, 8.8, 10.2, 0.12, 0.05)
  block(marble, -2.25, PED_Y0 + 0.05, 2.25, PED_Y1 - 0.15, 10.2, 10.8, 0.12, 0.15)
  {
    const fy = PED_Y0 - 0.05, ins: V3 = [0, PED_Y0 + 1, 5]
    // The medallion: a plain round gilt disc inside a gilt laurel ring.
    const n = 16, c = [0, 5.2], r0 = 0.72, r1 = 0.98
    for (let k = 0; k < n; k++) {
      const a = (k / n) * 2 * Math.PI, b = ((k + 1) / n) * 2 * Math.PI
      face(gilt, [c[0] + r1 * Math.cos(a), fy, c[1] + r1 * Math.sin(a)], [c[0] + r1 * Math.cos(b), fy, c[1] + r1 * Math.sin(b)],
        [c[0] + r0 * Math.cos(b), fy, c[1] + r0 * Math.sin(b)], [c[0] + r0 * Math.cos(a), fy, c[1] + r0 * Math.sin(a)], ins)
    }
    const disc = (t: number, rd: number): V3 => [c[0] + rd * Math.cos(t), fy, c[1] + rd * Math.sin(t)]
    for (let k = 0; k < n; k++) {
      const a = (k / n) * 2 * Math.PI, b = ((k + 1) / n) * 2 * Math.PI
      gilt.tri([c[0], fy, c[1]], disc(a, 0.55), disc(b, 0.55)) // faces −y (south, out)
    }
    // The upper die's garland band, and the eagle on the base.
    face(gilt, [-1.7, PED_Y0 + 0.25, 9.2], [1.7, PED_Y0 + 0.25, 9.2], [1.7, PED_Y0 + 0.25, 9.8], [-1.7, PED_Y0 + 0.25, 9.8], [0, PED_Y0 + 2, 9.5])
    face(gilt, [-1.1, PED_Y0 - 0.6, 0.5], [1.1, PED_Y0 - 0.6, 0.5], [1.1, PED_Y0 - 0.6, 1.3], [-1.1, PED_Y0 - 0.6, 1.3], [0, PED_Y0 + 1, 1])
  }

  // ---- The lions, lying at the pedestal's foot, facing out. ----
  for (const s of [-1, 1]) {
    smooth(marble, q => {
      const x = s * 1.85, y = PED_Y0 - 1.25
      block(q, x - 1.25, y - 0.55, x + 1.25, y + 0.55, 0, 0.25, 0.1, 0.05)
      ellipsoid(q, [x - s * 0.15, y, 0.7], [1.0, 0.42, 0.42], 10, 5)
      ellipsoid(q, [x + s * 0.75, y - 0.05, 0.95], [0.4, 0.42, 0.45], 8, 4) // the maned head
      ellipsoid(q, [x + s * 1.05, y - 0.08, 0.85], [0.22, 0.2, 0.2], 6, 3) // the muzzle
      for (const dy of [-0.22, 0.22]) tube(q, [[x + s * 0.6, y + dy, 0.4], [x + s * 1.2, y + dy, 0.35]], [0.14, 0.12], 5)
    }, 55)
  }

  // ---- The group: Juárez seated, Patria crowning him, the Law with a torch. ----
  smooth(marble, q => {
    const z = 10.8
    block(q, -1.9, PED_Y0 + 0.35, 1.9, PED_Y1 - 0.6, z, z + 0.35, 0.1, 0.08)
    const z0 = z + 0.35
    // Juárez: the chair, the lap and legs, the seated body, the head.
    block(q, -0.8, PED_Y0 + 1.6, 0.8, PED_Y0 + 2.9, z0, z0 + 1.15, 0.1, 0.1)
    tube(q, [[0, PED_Y0 + 2.3, z0 + 1.15], [0, PED_Y0 + 0.95, z0 + 1.1], [0, PED_Y0 + 0.7, z0 + 0.15]], [0.68, 0.62, 0.55], 8)
    tube(q, [[0, PED_Y0 + 2.2, z0 + 1.05], [0, PED_Y0 + 2.1, z0 + 2.1], [0, PED_Y0 + 2.15, z0 + 2.7]], [0.68, 0.58, 0.46], 8)
    ellipsoid(q, [0, PED_Y0 + 2.05, z0 + 3.05], [0.27, 0.29, 0.33], 8, 4)
    // Patria, behind on his right (west), winged, the wreath held over him.
    const px = -0.75, py = PED_Y0 + 3.3
    tube(q, [[px, py, z0], [px, py, z0 + 1.8], [px, py, z0 + 3.2], [px, py, z0 + 3.5]], [0.62, 0.45, 0.36, 0.18], 8)
    ellipsoid(q, [px, py - 0.05, z0 + 3.78], [0.22, 0.24, 0.27], 8, 4)
    tube(q, [[px + 0.3, py - 0.1, z0 + 3.2], [px + 0.55, py - 0.6, z0 + 3.55], [0.05, PED_Y0 + 2.1, z0 + 3.45]], [0.13, 0.11, 0.09], 6)
    for (const s of [-1, 1]) slab(q, [px + s * 0.3, py + 0.35, z0 + 3.0], [s * 0.55, 0.84, 0], [0, -0.15, 1],
      [[0, -0.1], [0.75, -0.55], [1.4, 0.2], [1.6, 1.3], [1.15, 2.3], [0.5, 1.7], [0, 0.6]], 0.18)
    // The Law, standing on his left (east), the torch raised high.
    const lx = 0.85, ly = PED_Y0 + 3.2
    tube(q, [[lx, ly, z0], [lx, ly, z0 + 1.8], [lx, ly, z0 + 3.3], [lx, ly, z0 + 3.6]], [0.6, 0.44, 0.36, 0.18], 8)
    ellipsoid(q, [lx, ly - 0.05, z0 + 3.88], [0.22, 0.24, 0.27], 8, 4)
    tube(q, [[lx + 0.3, ly, z0 + 3.35], [lx + 0.55, ly - 0.15, z0 + 4.1], [lx + 0.55, ly - 0.2, z0 + 4.75]], [0.13, 0.11, 0.09], 6)
    tube(q, [[lx + 0.55, ly - 0.2, z0 + 4.6], [lx + 0.55, ly - 0.2, z0 + 5.35]], [0.08, 0.17], 6)
  }, 55)
  {
    // The laurel wreath held over Juárez's head, gilded.
    const c: V3 = [0.05, PED_Y0 + 2.1, 11.15 + 3.45], n = 10, r0 = 0.22, r1 = 0.36
    for (let k = 0; k < n; k++) {
      const a = (k / n) * 2 * Math.PI, b = ((k + 1) / n) * 2 * Math.PI
      const o = (r: number, t: number, dz: number): V3 => [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t), c[2] + dz]
      face(gilt, o(r0, a, 0.08), o(r1, a, 0.08), o(r1, b, 0.08), o(r0, b, 0.08), [c[0], c[1], c[2] - 1])
      face(gilt, o(r0, a, -0.08), o(r1, a, -0.08), o(r1, b, -0.08), o(r0, b, -0.08), [c[0], c[1], c[2] + 1])
      face(gilt, o(r1, a, -0.08), o(r1, b, -0.08), o(r1, b, 0.08), o(r1, a, 0.08), c)
    }
  }

  // Floodlit marble at night, brightest on the pedestal and group.
  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 0.55 + 0.4 * Math.min(1, p[2] / 16))
  return [
    { part: marble, material: { ...finish('carrara-marble', 0xf1ede5), floodlight: lit } },
    { part: gilt, material: { ...finish('gilding', 0xcfa95c, 0.45), floodlight: lit } },
    { part: bronze, material: finish('urn-bronze', 0x7d6d52, 0.6) },
  ]
}

if (import.meta.main) await save('mexico-city-hemiciclo-a-juarez', 'Hemiciclo a Juárez', ANCHOR, BEARING, build(), 5000)
