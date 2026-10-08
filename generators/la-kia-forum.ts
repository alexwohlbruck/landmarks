/**
 * Kia Forum, Inglewood (1967, Charles Luckman) — procedural, CC0-1.0.
 * bun generators/la-kia-forum.ts
 *
 * Map frame: x east, y north, z up, metres. The anchor is the area centroid
 * of OSM way/26320999 (the round building outline, r = 64.7 m), placed at
 * bearing 0: the building is round, so the only orientation is the phase
 * of the colonnade, which is built into the model (a column at azimuth
 * -0.4° and every 4.5° from there).
 * y = 0 is 46.0 m (NAVD88), the lowest ground at the edge of the footprint
 * (USGS 3DEP; the plaza round the building is 46.3-46.5 m and the parking to
 * the south-west falls to 45.6 m).
 *
 * What makes it the Forum: a white colonnade of 80 tall, slightly tapering
 * columns all the way round, joined at the top by round arches and flaring
 * into a deep white canopy whose outer edge is scalloped, one hump per bay;
 * the red drum recessed behind the columns, with a dark band across it at
 * mid-height; and, from above, a plain flat white roof disc.
 *
 * Sources:
 * - Plan: OSM way/26320999 (r = 64.7 m) and LARIAC 2020 footprint
 *   457947807351 (same circle). Canopy edge r = 66.5 m: LA County lidar
 *   surface model on two diameters at 2 m spacing, where the roof falls to
 *   the ground between r = 66 and 68 m. Column count 80: measured, the
 *   dominant period round the rim in the USGS NAIP 2022 orthophoto at
 *   r = 61-63 m (DFT peak at 79-80 cycles per turn), 4.8 m bay spacing.
 *   Column line r = 61.2 m, so the canopy overhangs it by about 4.7 m, as
 *   the canopy's silhouette at the ends of the west photo shows.
 * - Heights: LA County lidar surface model (above y = 0): roof 18.1 m at
 *   r = 60 m rising to 18.65 m at the centre (cable-hung roof, published
 *   diameter 124 m, Wikipedia), canopy edge 17.0-17.6 m. LARIAC 2020 gives
 *   19.34 m for the footprint. Arch springing 13.4 m, crown 15.0 m, canopy
 *   lip 17.3-17.8 m: proportions from Ritapepaj's photo scaled by the 4.9 m
 *   bay (the facade height from it, 17.2 m above the plaza, agrees with the
 *   lidar).
 * - Photos (Wikimedia Commons): "Forum Inglewood.JPG" (Ritapepaj, CC BY-SA
 *   3.0; from the west, the Forum Club entrance; red drum, white columns,
 *   the canopy vaults); "Kia Forum view from the North.jpg" (Trafficali, 2023, CC BY-SA 4.0,
 *   drone, from the north-west, over Manchester Blvd and Prairie Ave); "The Inglewood
 *   Forum.jpg" (Mbo90301, CC BY-SA 4.0; from the west); "Another View of
 *   the Inglewood Forum from the air.jpg" (Northwalker, CC0; high oblique
 *   from the south). La-the-forum-006.jpg (Eddy Lambert) shows the
 *   1988-2013 blue scheme; the red was restored in the 2014 renovation.
 * - Colours: drum red #b42929 in daylight, pulled to the palette's
 *   lightness; the dark band is the shadowed recess at 8-10 m; the roof
 *   reads plain light grey-white in NAIP 2022 (the 2014 "Forum presented by
 *   Chase" roof logo is gone), so it is one flat colour. The canopy's top,
 *   outside the column line, is white `trim`: a brighter rim ring in the
 *   aerial from the south, though barely distinct from the roof in NAIP.
 * - Estimated: the drum radius (59.2 m, 1.4 m behind the columns, from the
 *   photos), the column section (1.3 m wide at the foot to 1.8 m at the
 *   springing, 1.2 m deep), the profile of the canopy's flared underside and
 *   the scallop height (0.5 m).
 * - Left out: the ribbed panels and doors of the drum, the Forum Club
 *   marquee, the plaza walls and stairs, signs, rooftop kit, the parking lot.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const white = new Part(), roof = new Part(), red = new Part(), redDark = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const deg = Math.PI / 180

/** A triangle wound to face `hint`, with optional per-corner normals. */
function tri(p: Part, A: V3, B: V3, C: V3, hint: V3, ns?: V3[]) {
  if (Math.hypot(...cross(sub(B, A), sub(C, A))) < 1e-9) return
  if (dot(cross(sub(B, A), sub(C, A)), hint) >= 0) p.tri(A, B, C, undefined, undefined, undefined, ns)
  else p.tri(A, C, B, undefined, undefined, undefined, ns && [ns[0], ns[2], ns[1]])
}
function quad(p: Part, P: V3[], hint: V3, ns?: V3[]) {
  tri(p, P[0], P[1], P[2], hint, ns && [ns[0], ns[1], ns[2]])
  tri(p, P[0], P[2], P[3], hint, ns && [ns[0], ns[2], ns[3]])
}

/**
 * A surface over a grid that wraps round the building: G[i][j], i round
 * (closed), j across. `hint(i, j)` says which way it faces; with `smooth`
 * the normals come from the grid, so the canopy's flare shades as a curve.
 */
function surface(p: Part, G: V3[][], hint: (i: number, j: number) => V3, smooth: boolean) {
  const n = G.length, m = G[0].length
  const N = (i: number, j: number): V3 => {
    const a = sub(G[(i + 1) % n][j], G[(i - 1 + n) % n][j])
    const b = sub(G[i][Math.min(j + 1, m - 1)], G[i][Math.max(j - 1, 0)])
    const c = unit(cross(a, b))
    return dot(c, hint(i, j)) >= 0 ? c : mul(c, -1)
  }
  for (let i = 0; i < n; i++) {
    const k = (i + 1) % n
    for (let j = 0; j < m - 1; j++) {
      const P = [G[i][j], G[k][j], G[k][j + 1], G[i][j + 1]]
      const h = hint(i, j)
      quad(p, P, h, smooth ? [N(i, j), N(k, j), N(k, j + 1), N(i, j + 1)] : undefined)
    }
  }
}

// ---------------------------------------------------------------------------
// Dimensions

const BAYS = 80
const PHASE = -0.4 * deg // azimuth of a column, from the NAIP rim pattern
const R_DRUM = 59.2, R_COL_IN = 60.6, R_COL_OUT = 61.8, R_EDGE = 66.5
const Z_SPRING = 13.4, LIP = 0.6
const Z_TOP_IN = 18.1, Z_ROOF_MID = 18.4, Z_ROOF_C = 18.65
const COL_W0 = 1.3, COL_W1 = 1.8

const R_COL = (R_COL_IN + R_COL_OUT) / 2
const BAY = (2 * Math.PI * R_COL) / BAYS // 4.91 m
const HALF_OPEN = (BAY - COL_W1) / 2 // arch radius, 1.55 m
const UA = HALF_OPEN / BAY // half the arch as a fraction of the bay

// Points across a bay, as a fraction u of the bay from its centre: column
// centre, springing, the arch in four segments, springing, column centre.
const ARCH = [180, 135, 90, 45, 0].map(a => a * deg)
const US = [-0.5, ...ARCH.map(a => UA * Math.cos(a)), 0.5]
const archZ = [Z_SPRING, ...ARCH.map(a => Z_SPRING + HALF_OPEN * Math.sin(a)), Z_SPRING]
const PER = US.length - 1 // 6 segments per bay
const NU = BAYS * PER

/** Azimuth (clockwise from north) of sample i round the building. */
const azOf = (i: number) => {
  const b = Math.floor(i / PER), s = i % PER
  return PHASE + (b + 0.5 + US[s]) * ((2 * Math.PI) / BAYS)
}
const uOf = (i: number) => US[i % PER]
const zArch = (i: number) => archZ[i % PER]
const at = (az: number, r: number, z: number): V3 => [r * Math.sin(az), r * Math.cos(az), z]
const radial = (az: number): V3 => [Math.sin(az), Math.cos(az), 0]
/** The canopy lip's top: a hump over each bay, low over each column. */
const lipTop = (u: number) => 17.1 + 0.5 * Math.cos(Math.PI * u)

// Columns sit at bay boundaries, i.e. azimuth PHASE + k·4.5°.
const colAz = (k: number) => PHASE + k * ((2 * Math.PI) / BAYS)
/** A point on the 80-gon through the column azimuths, at angle az. */
function onChord(az: number, r: number, z: number): V3 {
  const step = (2 * Math.PI) / BAYS
  const k = Math.floor((az - PHASE) / step)
  const t = (az - colAz(k)) / step
  const a = at(colAz(k), r, z), b = at(colAz(k + 1), r, z)
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, z]
}

// ---------------------------------------------------------------------------
// The canopy: underside vaults flaring from the arches out to the lip, the
// lip, and the top falling gently from the roof to the lip.

const S = [0, 0.5, 1]
const vault: V3[][] = [], lip: V3[][] = [], top: V3[][] = [], intrados: V3[][] = []
for (let i = 0; i < NU; i++) {
  const az = azOf(i), u = uOf(i), z0 = zArch(i), z1 = lipTop(u) - LIP
  vault.push(S.map(s => at(az, R_COL_OUT + (R_EDGE - R_COL_OUT) * s, z0 + (z1 - z0) * Math.sin((s * Math.PI) / 2))))
  lip.push([at(az, R_EDGE, z1), at(az, R_EDGE, lipTop(u))])
  top.push([at(az, R_EDGE, lipTop(u)), onChord(az, R_DRUM, Z_TOP_IN)])
  intrados.push([onChord(az, R_DRUM, z0), at(az, R_COL_OUT, z0)])
}
surface(white, vault, (i, j) => add(mul(radial(azOf(i)), j === 0 ? 0.6 : 0.3), [0, 0, -1]), true)
surface(white, lip, i => radial(azOf(i)), true)
// The canopy's top, one fan per bay from the scalloped lip to the drum's
// 80-gon, so it meets the roof without T-junctions.
for (let b = 0; b < BAYS; b++) {
  const up: V3 = [0, 0, 1], U = [up, up, up]
  const L = Array.from({ length: PER + 1 }, (_, s) => top[(b * PER + s) % NU][0])
  const A = at(colAz(b), R_COL_OUT, Z_TOP_IN), B = at(colAz(b + 1), R_COL_OUT, Z_TOP_IN)
  const h = PER / 2
  for (let s = 0; s < PER; s++) tri(white, L[s], L[s + 1], s < h ? A : B, up, U)
  tri(white, L[h], B, A, up, U)
}
// Arch soffits, carried back to the drum as the colonnade's ceiling.
surface(white, intrados, i => {
  const s = i % PER
  if (s === 0 || s === PER - 1) return [0, 0, -1]
  const a = (ARCH[s - 1] + ARCH[s]) / 2 // facing the arch's centre
  const az = azOf(i), t: V3 = [Math.cos(az), -Math.sin(az), 0] // increasing u
  return add(mul(t, -Math.cos(a)), [0, 0, -Math.sin(a)])
}, true)

// ---------------------------------------------------------------------------
// Columns: tapering from 1.3 m at the foot to 1.8 m at the springing, from
// the ground to where the vaults take over.

for (let k = 0; k < BAYS; k++) {
  const az = colAz(k)
  const rd = radial(az), tg: V3 = [Math.cos(az), -Math.sin(az), 0]
  const P = (r: number, w: number, z: number): V3 => add(add(mul(rd, r), mul(tg, w / 2)), [0, 0, z])
  const ring = (z: number, w: number) => [P(R_COL_OUT, -w, z), P(R_COL_OUT, w, z), P(R_COL_IN, w, z), P(R_COL_IN, -w, z)]
  const lo = ring(0, COL_W0), hi = ring(Z_SPRING, COL_W1)
  const c: V3 = [...mul(rd, R_COL).slice(0, 2), 0] as V3
  for (let e = 0; e < 4; e++) {
    const f = (e + 1) % 4
    const mid = mul(add(lo[e], lo[f]), 0.5)
    quad(white, [lo[e], lo[f], hi[f], hi[e]], sub(mid, c))
  }
}

// ---------------------------------------------------------------------------
// The drum behind the colonnade, an 80-gon through the column azimuths: red,
// with the dark recessed band at 8.3-10.4 m.

const drumRing = (z: number) => Array.from({ length: BAYS }, (_, k) => at(colAz(k), R_DRUM, z))
const bands: [Part, number, number][] = [[red, 0, 8.3], [redDark, 8.3, 10.4], [red, 10.4, Z_TOP_IN - 0.3]]
for (const [p, z0, z1] of bands) {
  const a = drumRing(z0), b = drumRing(z1)
  for (let k = 0; k < BAYS; k++) {
    const l = (k + 1) % BAYS
    const na = radial(colAz(k)), nb = radial(colAz(l))
    quad(p, [a[k], a[l], b[l], b[k]], radial(colAz(k) + Math.PI / BAYS), [na, nb, nb, na])
  }
}

// The roof: a very shallow cone over the cable-hung roof, lidar 18.1 m at
// the edge to 18.65 m at the centre.
{
  const o = Array.from({ length: BAYS }, (_, k) => at(colAz(k), R_COL_OUT, Z_TOP_IN)), m = Array.from({ length: BAYS }, (_, k) => at(colAz(k), 30, Z_ROOF_MID))
  const c: V3 = [0, 0, Z_ROOF_C]
  for (let k = 0; k < BAYS; k++) {
    const l = (k + 1) % BAYS
    const up: V3 = [0, 0, 1]
    quad(roof, [o[k], o[l], m[l], m[k]], up, [up, up, up, up])
    tri(roof, m[k], m[l], c, up, [up, up, up])
  }
}

// ---------------------------------------------------------------------------
// Palette: the columns and canopy are white `trim`; the drum is the Forum's
// "California sunset red" pulled to the palette's lightness, its recess a
// muted dark red; the roof is the plain light grey-white of NAIP 2022.
const parts = [
  { part: white, material: PALETTE.trim },
  { part: red, material: finish('forum-red', 0xc25a50) },
  { part: redDark, material: finish('forum-red-shadow', 0x8a4440) },
  { part: roof, material: finish('forum-roof', 0xe2e1dc) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Kia Forum', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 0, osm: 'way/26320999',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/la-kia-forum.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
