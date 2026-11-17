/**
 * Equestrian statue of Carlos IV, "El Caballito" (Manuel Tolsá, cast 1802,
 * set up 1803; in Plaza Manuel Tolsá since 1979), Mexico City — original
 * procedural geometry, CC0-1.0.
 * bun generators/mexico-city-carlos-iv.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of OSM way/217407196 (tourism=artwork, the
 * pedestal's outline, 2.8 × 4.8 m), 19.436059, -99.139478; its long axis
 * runs at 8.7°, so the catalog bearing is 8.7. The horse faces south
 * (−y), toward the Palacio de Minería, its back to the MUNAL (JonathanVitela's
 * and Luisalvaz's views).
 *
 * Identity, in order: a dark bronze horse, massive and heavy-chested,
 * walking with the near (left) foreleg raised high and bent, the neck
 * arched and the head drawn in, nose down; the long tail sweeping to the
 * base; the king upright in the saddle in Roman dress and laurels, a cloak
 * falling over the croup, the right arm stretched forward holding the
 * baton up; all on a tall pale stone pedestal with a moulded base and
 * cornice and inscription panels.
 *
 * Evidence:
 *  - the bronze: 4.88 m high, 5.40 m long, 1.78 m wide (es Wikipedia, El
 *    Caballito (estatua)); modelled ~4.85 m high and 5.0 m long, plus the
 *    raised hoof and the muzzle.
 *  - the pedestal: OSM way/217407196 (2.8 × 4.8 m, the shaft); its height
 *    ~4.4 m photo-scaled against the 4.88 m bronze on Rafael Sánchez
 *    Guiris's level view from the plaza (pedestal ≈ 0.9 × the statue) —
 *    estimated. Total ~9.2 m.
 *  - pose and masses from Luisalvaz's three views (side, rider, head),
 *    Juan Carlos Fonseca Mata's and Isaac Salvador Pérez's three-quarter
 *    views, JonathanVitela's frontal view and the Secretaría de Cultura's
 *    close view (the raised baton).
 *  - colour: bronze with a dark green-grey patina, held at the palette's
 *    darkest (no darker than charcoal); the pedestal a pale buff-grey
 *    stone, its inscription panels white marble. Floodlit from below at
 *    night (ProtoplasmaKid's dusk view).
 *  - the stepped platform it stands on in the plaza is paving and is left
 *    to the map. Terrain: Mapterhorn has no z15 tiles here; the Centro is
 *    flat lake bed (~2,240 m).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Vista de la Estatua Ecuestre de Carlos IV (El Caballito) de Tolsá (CDMX) 1.JPG, 2.JPG, 3.JPG, Luisalvaz, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Vista_de_la_Estatua_Ecuestre_de_Carlos_IV_(El_Caballito)_de_Tols%C3%A1_(CDMX)_1.JPG
 *  - Estatua Ecuestre de Carlos IV, Plaza Manuel Tolsá, Ciudad de México.jpg, Juan Carlos Fonseca Mata, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Estatua_Ecuestre_de_Carlos_IV,_Plaza_Manuel_Tols%C3%A1,_Ciudad_de_M%C3%A9xico.jpg
 *  - Carlos IV, Plaza Tolsá.jpg, Isaac Salvador Pérez, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Carlos_IV,_Plaza_Tols%C3%A1.jpg
 *  - Estatua ecuestre de Carlos IV - 1.jpg (uploader credited as "Manuel Tolsá"), CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Estatua_ecuestre_de_Carlos_IV_-_1.jpg
 *  - Museo Nacional de Arte and El Caballito, Plaza Manuel Tolsá, Mexico City.jpg, JonathanVitela, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Museo_Nacional_de_Arte_and_El_Caballito,_Plaza_Manuel_Tols%C3%A1,_Mexico_City.jpg
 *  - El Caballito and Museo Nacional de Arte, Mexico City, 2017.jpg, Secretaría de Cultura de la Ciudad de México, CC BY-SA 2.0
 *    https://commons.wikimedia.org/wiki/File:El_Caballito_and_Museo_Nacional_de_Arte,_Mexico_City,_2017.jpg
 *  - Escultura Carlos IV + Palacio de Minería.jpg, ProtoplasmaKid, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Escultura_Carlos_IV_%2B_Palacio_de_Miner%C3%ADa.jpg
 *  - Palacio de Mineria.JPG, Rafael Sánchez Guiris, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Palacio_de_Mineria.JPG
 * Look-only: none. No commercial imagery.
 *
 * Left out: the harness, the quiver under the raised hoof, the laurel's
 * leaves, the inscriptions' lettering.
 */
import { Part, cross, type V3 } from './mesh'
import { finish } from './palette'
import { save } from './chi-aon-center'
import { block, ellipsoid, plate, smooth, unit } from './nyc-columbus-monument'

const ANCHOR: [number, number] = [19.436059, -99.139478]
const BEARING = 8.7

/**
 * A closed limb along a path, elliptical in section: `rx` across the
 * horse (the author frame's X), `rz` in the other direction, both per point.
 */
function limb(p: Part, path: V3[], rx: number[], rz: number[], n = 8) {
  const rings = path.map((c, i) => {
    const T = unit([0, 1, 2].map(k => path[Math.min(i + 1, path.length - 1)][k] - path[Math.max(0, i - 1)][k]) as V3)
    let A: V3 = [1 - T[0] * T[0], -T[0] * T[1], -T[0] * T[2]] // X̂ minus its part along T
    if (Math.hypot(...A) < 0.3) A = [-T[1] * T[0], 1 - T[1] * T[1], -T[1] * T[2]]
    A = unit(A)
    const B = cross(T, A)
    return Array.from({ length: n }, (_, j): V3 => {
      const t = (j / n) * 2 * Math.PI
      return [0, 1, 2].map(k => c[k] + A[k] * rx[i] * Math.cos(t) + B[k] * rz[i] * Math.sin(t)) as V3
    })
  })
  p.loft(rings)
  p.cap(rings[0], false)
  p.cap(rings[rings.length - 1], true)
}

export function build() {
  const stone = new Part(), marble = new Part(), bronze = new Part()

  // ---- The pedestal (the OSM outline is its shaft, 2.8 × 4.8 m). ----
  block(stone, -1.75, -2.85, 1.75, 2.85, 0, 0.45, 0.15, 0.1)
  block(stone, -1.6, -2.7, 1.6, 2.7, 0.45, 0.9, 0.12, 0.15)
  block(stone, -1.4, -2.4, 1.4, 2.4, 0.9, 3.55, 0.1, 0.04)
  block(stone, -1.7, -2.8, 1.7, 2.8, 3.55, 4.05, 0.12, 0.2)
  block(stone, -1.5, -2.6, 1.5, 2.6, 4.05, 4.3, 0.1, 0.06)
  // Inscription panels: white marble on the long sides, bronze on the ends.
  for (const sx of [-1, 1]) {
    const x = sx * 1.4, d = 0.05
    const q: V3[] = [[x + sx * d, -1.6, 1.4], [x + sx * d, 1.6, 1.4], [x + sx * d, 1.6, 3.1], [x + sx * d, -1.6, 3.1]]
    if (sx > 0) marble.quad(q[0], q[1], q[2], q[3])
    else marble.quad(q[1], q[0], q[3], q[2])
  }
  plate(bronze, -0.7, 0.7, 1.8, 2.9, -2.4, -1, 0.05)
  plate(bronze, -0.7, 0.7, 1.8, 2.9, 2.4, 1, 0.05)

  // ---- The bronze: author frame (X the horse's right, F forward, Z up),
  // turned so the horse faces south: x = −X, y = −F. ----
  const K = 1.05, ZB = 4.5, F0 = 0.12
  const H = (X: number, F: number, Z: number): V3 => [-X * K, -(F + F0) * K, ZB + Z * K]
  const L = (pts: [number, number, number, number, number][], n = 8) =>
    limb(bronze_q, pts.map(([X, F, Z]) => H(X, F, Z)), pts.map(v => v[3] * K), pts.map(v => v[4] * K), n)
  let bronze_q = bronze
  smooth(bronze, q => {
    bronze_q = q
    // The bronze ground the horse stands on.
    block(q, -0.95, -2.5, 0.95, 2.5, 4.3, ZB, 0.35, 0.08)

    // Barrel, chest and quarters: [X, F, Z, half-width, half-height].
    L([[0, -1.78, 2.35, 0.12, 0.16], [0, -1.6, 2.32, 0.48, 0.54], [0, -1.15, 2.22, 0.64, 0.74], [0, -0.3, 2.12, 0.6, 0.72],
      [0, 0.5, 2.17, 0.6, 0.76], [0, 1.05, 2.33, 0.56, 0.72], [0, 1.4, 2.53, 0.4, 0.55], [0, 1.55, 2.67, 0.14, 0.22]], 12)
    // Neck, thick, arched and high; the head drawn in, nose down.
    L([[0, 1.1, 2.65, 0.38, 0.55], [0, 1.45, 3.15, 0.32, 0.46], [0, 1.72, 3.55, 0.27, 0.36], [0, 1.92, 3.78, 0.22, 0.27]], 10)
    L([[0, 1.88, 3.85, 0.19, 0.2], [0, 2.08, 3.55, 0.23, 0.3], [0, 2.32, 2.95, 0.17, 0.22], [0, 2.4, 2.7, 0.1, 0.12]], 8)
    // The mane along the crest, the ears.
    L([[0, 1.12, 3.15, 0.12, 0.14], [0, 1.43, 3.55, 0.16, 0.18], [0, 1.74, 3.9, 0.12, 0.14], [0, 1.88, 4.02, 0.05, 0.06]], 6)
    for (const s of [-1, 1]) L([[s * 0.1, 1.93, 3.92, 0.05, 0.06], [s * 0.11, 1.95, 4.15, 0.02, 0.02]], 5)
    // Legs: [X, F, Z, r, r]. The near (left, −X) foreleg raised and bent.
    const leg = (pts: [number, number, number][], r: number[]) => L(pts.map(([X, F, Z], i) => [X, F, Z, r[i], r[i]] as [number, number, number, number, number]), 7)
    leg([[0.3, 1.05, 1.9], [0.31, 1.1, 1.0], [0.31, 1.12, 0.32], [0.31, 1.2, 0.07]], [0.27, 0.17, 0.13, 0.16])
    leg([[-0.3, 1.05, 1.9], [-0.32, 1.6, 1.45], [-0.32, 1.45, 0.95], [-0.32, 1.62, 0.8]], [0.27, 0.17, 0.13, 0.15])
    leg([[0.3, -1.25, 2.1], [0.32, -1.1, 1.3], [0.32, -1.45, 0.8], [0.32, -1.27, 0.28], [0.32, -1.17, 0.07]], [0.4, 0.26, 0.17, 0.13, 0.16])
    leg([[-0.3, -1.25, 2.1], [-0.32, -1.2, 1.3], [-0.32, -1.65, 0.8], [-0.32, -1.57, 0.28], [-0.32, -1.52, 0.07]], [0.4, 0.26, 0.17, 0.13, 0.16])
    // The long, heavy tail, sweeping down to the ground behind.
    L([[0, -1.72, 2.35, 0.13, 0.15], [0, -2.08, 1.9, 0.22, 0.3], [0, -2.3, 1.05, 0.25, 0.34], [0, -2.33, 0.1, 0.2, 0.28]], 7)

    // The king: a broad cuirassed torso, the tunic spread over the saddle,
    // the head in laurels, legs along the flanks.
    L([[0, 0.1, 2.88, 0.4, 0.34], [0, 0.12, 3.45, 0.34, 0.3], [0, 0.08, 3.95, 0.38, 0.28], [0, 0.08, 4.12, 0.12, 0.12]], 8)
    L([[0, 0.12, 3.15, 0.38, 0.32], [0, 0.18, 2.72, 0.62, 0.55]], 10)
    ellipsoid(q, H(0, 0.1, 4.34), [0.22 * K, 0.24 * K, 0.27 * K], 8, 5)
    for (const s of [-1, 1]) leg([[s * 0.3, 0.15, 2.95], [s * 0.66, 0.58, 2.55], [s * 0.66, 0.45, 1.85]], [0.2, 0.15, 0.12])
    // Right arm stretched forward, the baton held up; the left on the reins.
    leg([[0.4, 0.1, 3.88], [0.62, 0.5, 3.9], [0.66, 0.95, 4.02]], [0.14, 0.12, 0.1])
    L([[0.66, 0.88, 3.85, 0.07, 0.07], [0.68, 1.15, 4.4, 0.06, 0.06]], 6)
    leg([[-0.4, 0.1, 3.88], [-0.5, 0.22, 3.4], [-0.3, 0.62, 3.25]], [0.14, 0.12, 0.1])
    // The cloak falling from the shoulders over the croup.
    L([[0, -0.12, 3.92, 0.42, 0.16], [0, -0.48, 3.35, 0.58, 0.17], [0, -0.82, 2.8, 0.66, 0.14]], 8)
  }, 55)

  const lit = (p: V3, n: V3) => (n[2] > 0.6 ? 0.25 : 0.6 + 0.3 * Math.min(1, p[2] / 9))
  return [
    { part: stone, material: { ...finish('pedestal-stone', 0xd6cec0), floodlight: lit } },
    { part: marble, material: finish('inscription-marble', 0xf1ede5) },
    // Bronze, dark green-grey patina, at the palette's darkest.
    { part: bronze, material: { ...finish('bronze-patina', 0x555e58, 0.6), floodlight: lit } },
  ]
}

if (import.meta.main) await save('mexico-city-carlos-iv', 'El Caballito (Carlos IV)', ANCHOR, BEARING, build(), 5000)
