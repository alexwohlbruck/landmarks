/**
 * Kiosco Morisco, Alameda de Santa María la Ribera, Mexico City —
 * procedural, CC0-1.0, no textures. bun generators/mexico-city-kiosco-morisco.ts
 *
 * José Ramón Ibarrola, 1884 (built as Mexico's pavilion for the New
 * Orleans World's Fair, moved here in 1910). A Moorish-revival cast-iron
 * octagonal pavilion on a raised stone platform: an outer arcade of three
 * horseshoe arches a side on slender yellow columns with blue bands, a
 * deep red frieze band with blue medallions, a red stepped-merlon
 * parapet; inside, a second ring of horseshoe arches carries a glazed
 * drum with red X-bracing and a glass dome on red ribs, crowned by a
 * blue ball and the eagle.
 *
 * Small and famous: the arches are real openings (horseshoe, more than a
 * semicircle, drawn bolder than real), the columns real cylinders, the
 * dome a real dome.
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the octagon's flats
 * face the compass points; the main stairs face north and south, where OSM
 * way/491159204 bulges). Anchor: the centre of the dome part
 * way/1137755090 (lng −99.156854, lat 19.449664).
 *
 * Covers and replaces way/491159204 (building=roof, "Kiosco morisco") and
 * way/1137755090 (the dome part).
 *
 * Evidence
 * - OSM (measured): the roof outline reaches 10–12 m from the centre, the
 *   stair bulges 16 m (north) and 13.7 m (south); the dome part is ~7 m
 *   across. OSM's outline is ragged and seems to include the platform's
 *   edge; the arcade is drawn inside it (circumradius 8.4 m) and the
 *   platform out to 10.6 m.
 * - Photo-scaled (estimated) from photo 4 (Tanke67, one face straight on,
 *   ~100 px/m on the 3.8 m columns): platform 1.4 m; columns to 5.2 m;
 *   stilted horseshoe arches to ~8.15 m in a band as tall as the columns
 *   (to 8.6 m); frieze and cornice to 9.7 m; merlons to ~10.6 m; the
 *   inner tier to 11.2 m (merlons ~12 m); the glazed drum 11.2–13.2 m;
 *   dome to ~17 m; ball and eagle to ~19 m. Photo 8 (ItzaeItayetzi, from
 *   the stair) for three arches a side and the raised inner tier. Photo 3 (night, from the stair) for the inner arcade and
 *   the stair's width.
 * - Terrain: Mapterhorn has no z15 terrain here (tools/terrain.ts 404s);
 *   Santa María la Ribera is on the flat lake bed (~2,240 m). Elevation 0.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 "Kiosco Morisco de Santa María la Ribera 1.jpg" and 2 "… 3.jpg",
 *     Juan Carlos Fonseca Mata, CC BY-SA 4.0 (ceiling, frieze and dome from
 *     inside: the colours)
 *   3 "Kiosco Morisco Mexico.jpg", Ulisesmorales, CC BY-SA 3.0
 *   4 "Kiosco Morisco dia.JPG", Tanke67, CC BY-SA 3.0
 *   8 "Kiosco Morisco Santa María la Ribera.jpg", ItzaeItayetzi, CC BY-SA 4.0
 * - Look-only: none. No commercial imagery.
 * - Colours: the ironwork a vermilion red pulled light (#cf6a58); the
 *   frieze and railing blue (#7fa3c2); the columns pale yellow (#e9dc95);
 *   the dome and drum glass pale (glass #cfe0e6); eagle and ball bronze
 *   and blue; the platform pale stone.
 * - Simplified: the arabesque relief is left out (colour bands only); the
 *   corner column clusters are one column and a pier; the railing is a low
 *   blue band; the dome's ribs are 8 (16 real); the parapet carries 4 stepped
 *   merlons a side (bolder and fewer than real).
 * - Doubts: the exact plan size (OSM is ragged); heights are photo
 *   estimates.
 * - Night: the arcade is lit from inside (the frieze and arches are
 *   floodlit); the dome is glass and stays dark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, lathe, earcut, ccw } from './dc-nmaahc'
import { cbox, qf } from './dc-white-house'
import { cylinder } from './dc-white-house'

type UZ = [number, number]
const RO = 8.4 // outer arcade circumradius
const RI = 4.4 // inner arcade circumradius
const ZP = 1.4, ZC = 5.2, ZE = 9.7

/** A frame on side k of an octagon of circumradius R (flats face the axes). */
function side(R: number, k: number) {
  const a = (k * Math.PI) / 4 // outward normal angle (0 = east)
  const ap = R * Math.cos(Math.PI / 8), half = R * Math.sin(Math.PI / 8)
  const o: V3 = [Math.cos(a), Math.sin(a), 0], t: V3 = [-Math.sin(a), Math.cos(a), 0]
  const P = (u: number, z: number, d = 0): V3 => [o[0] * (ap + d) + t[0] * u, o[1] * (ap + d) + t[1] * u, z]
  return { o, t, P, half, ap }
}

/** A polygon (u, z) on a side's plane, extruded from d0 to d1 (out = d1). */
function slabUZ(p: Part, S: ReturnType<typeof side>, poly0: UZ[], d0: number, d1: number, skip?: (a: UZ, b: UZ) => boolean, back = true) {
  const poly = ccw(poly0) as UZ[]
  const nb: V3 = [-S.o[0], -S.o[1], 0]
  for (const [i, j, k] of earcut(poly)) {
    qf3(p, S.P(...poly[i], d1), S.P(...poly[j], d1), S.P(...poly[k], d1), S.o)
    if (back) qf3(p, S.P(...poly[i], d0), S.P(...poly[j], d0), S.P(...poly[k], d0), nb)
  }
  for (let i = 0; i < poly.length; i++) {
    const A = poly[i], B = poly[(i + 1) % poly.length]
    const du = B[0] - A[0], dz = B[1] - A[1]
    if (Math.hypot(du, dz) < 1e-6 || skip?.(A, B)) continue
    const n: V3 = [S.t[0] * dz, S.t[1] * dz, -du]
    qf(p, S.P(...A, d0), S.P(...B, d0), S.P(...B, d1), S.P(...A, d1), n)
  }
}
function qf3(p: Part, a: V3, b: V3, c: V3, n: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const f: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (f[0] * n[0] + f[1] * n[1] + f[2] * n[2] >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}

/** The arch band of one side: n horseshoe openings between zs and zt. */
function archBand(p: Part, S: ReturnType<typeof side>, n: number, zs: number, zt: number, pier: number, d0: number, d1: number, seg = 6) {
  const w = (2 * S.half) / n
  for (let i = 0; i < n; i++) {
    const u0 = -S.half + i * w, u1 = u0 + w, uc = (u0 + u1) / 2
    const r = (w - pier) / 2 / Math.cos((20 * Math.PI) / 180) * 0.94 // the arc's widest half-width
    const zc = Math.max(zs + r * 0.45, zt - 0.45 - r) // stilted: the crown sits just under the band's top
    // left half: from the left springing up round to the crown, then the cell corners
    const arc: UZ[] = []
    for (let s = 0; s <= seg; s++) {
      const th = ((200 - (110 * s) / seg) * Math.PI) / 180
      arc.push([uc + r * Math.cos(th), zc + r * Math.sin(th)])
    }
    const left: UZ[] = [[u0, zs], [arc[0][0], zs], ...arc, [uc, zt], [u0, zt]]
    // edges on the cell's boundary (against the neighbour, the frieze, the capital) are hidden
    const hid = (a: UZ, b: UZ) => (Math.abs(a[1] - zt) < 1e-6 && Math.abs(b[1] - zt) < 1e-6) || (Math.abs(a[1] - zs) < 1e-6 && Math.abs(b[1] - zs) < 1e-6) || (Math.abs(a[0] - b[0]) < 1e-6 && (Math.abs(a[0] - u0) < 1e-6 || Math.abs(a[0] - u1) < 1e-6 || Math.abs(a[0] - uc) < 1e-6))
    slabUZ(p, S, left, d0, d1, hid)
    const right: UZ[] = left.map(([u, z]) => [2 * uc - u, z] as UZ).reverse()
    slabUZ(p, S, right, d0, d1, hid)
  }
}

function build() {
  const red = new Part(), blue = new Part(), yellow = new Part(), glass = new Part(), bronze = new Part(), stone = new Part()

  // ---- Platform and stairs.
  const oct = (R: number, z: number): V3[] => Array.from({ length: 8 }, (_, k) => {
    const a = ((k + 0.5) * Math.PI) / 4
    return [R * Math.cos(a), R * Math.sin(a), z] as V3
  })
  stone.loft([oct(10.6, 0), oct(10.6, ZP - 0.25), oct(10.4, ZP)])
  stone.cap(oct(10.4, ZP), true)
  for (const sy of [-1, 1]) {
    const ap = 10.6 * Math.cos(Math.PI / 8)
    const n = 5, run = sy > 0 ? 5.4 : 3.2
    for (let i = 0; i < n; i++) {
      const y0 = sy * (ap + run - (i * run) / n), y1 = sy * (ap - 0.2)
      cbox(stone, { x0: -3.4, x1: 3.4, y0: Math.min(y0, y1), y1: Math.max(y0, y1) }, 0, ((i + 1) * ZP) / n)
    }
    for (const s of [-1, 1]) cbox(stone, { x0: s * 3.4 - 0.4, x1: s * 3.4 + 0.4, y0: Math.min(sy * (ap + run), sy * ap), y1: Math.max(sy * (ap + run), sy * ap) }, 0, ZP + 0.9, { b: 0.1 })
  }

  // ---- Outer arcade: columns, the arch band, frieze, cornice, merlons.
  for (let k = 0; k < 8; k++) {
    const S = side(RO, k)
    // the railing between the columns, except at the stairs (north/south sides)
    if (k !== 2 && k !== 6) {
      qf(blue, S.P(-S.half, ZP, 0.05), S.P(S.half, ZP, 0.05), S.P(S.half, ZP + 1.0, 0.05), S.P(-S.half, ZP + 1.0, 0.05), S.o)
      qf(blue, S.P(-S.half, ZP, -0.05), S.P(S.half, ZP, -0.05), S.P(S.half, ZP + 1.0, -0.05), S.P(-S.half, ZP + 1.0, -0.05), [-S.o[0], -S.o[1], 0])
    }
    for (const u of [-S.half, -S.half / 3, S.half / 3]) {
      const c = S.P(u, 0)
      const rr = u === -S.half ? 0.32 : 0.24
      cylinder(yellow, c[0], c[1], rr, ZP + 0.3, ZC - 0.3, 6)
      cbox(blue, { x0: c[0] - rr - 0.08, x1: c[0] + rr + 0.08, y0: c[1] - rr - 0.08, y1: c[1] + rr + 0.08 }, ZP, ZP + 0.3)
      cbox(red, { x0: c[0] - rr - 0.14, x1: c[0] + rr + 0.14, y0: c[1] - rr - 0.14, y1: c[1] + rr + 0.14 }, ZC - 0.3, ZC + 0.05, { b: 0.08 })
    }
    archBand(red, S, 3, ZC, 8.6, 0.6, -0.25, 0.2, 4)
    // frieze (blue band) and cornice, parapet
    slabUZ(blue, S, [[-S.half - 0.15, 8.6], [S.half + 0.15, 8.6], [S.half + 0.15, 9.2], [-S.half - 0.15, 9.2]], -0.25, 0.28)
    slabUZ(red, S, [[-S.half - 0.3, 9.2], [S.half + 0.3, 9.2], [S.half + 0.3, ZE], [-S.half - 0.3, ZE]], -0.25, 0.5)
    // stepped merlons on the parapet
    const NM = 3
    for (let m = 0; m < NM; m++) {
      const u = -S.half + ((m + 0.5) * 2 * S.half) / NM
      slabUZ(red, S, [[u - 0.34, ZE], [u + 0.34, ZE], [u + 0.34, ZE + 0.4], [u + 0.15, ZE + 0.4], [u + 0.15, ZE + 0.9], [u - 0.15, ZE + 0.9], [u - 0.15, ZE + 0.4], [u - 0.34, ZE + 0.4]], 0.2, 0.45, (a, b) => a[1] === ZE && b[1] === ZE, false)
    }
  }
  // the roof deck between the arcades (red), and the soffit under it
  const ringQuad = (R0: number, R1: number, z: number, up: boolean, p: Part) => {
    const A = oct(R0, z), B = oct(R1, z)
    for (let k = 0; k < 8; k++) qf(p, A[k], A[(k + 1) % 8], B[(k + 1) % 8], B[k], [0, 0, up ? 1 : -1])
  }
  // oct() puts vertices at odd eighths, matching side(): circumradius R
  ringQuad(RO + 0.3, RI, ZE - 0.05, true, red)
  ringQuad(RO - 0.3, RI + 0.2, 8.6, false, red)

  // ---- Inner arcade: columns and a ring of horseshoe arches, up to the
  // drum.
  for (let k = 0; k < 8; k++) {
    const S = side(RI, k)
    const c = S.P(-S.half, 0)
    cylinder(yellow, c[0], c[1], 0.22, ZP, ZC + 0.4, 6)
    cbox(red, { x0: c[0] - 0.36, x1: c[0] + 0.36, y0: c[1] - 0.36, y1: c[1] + 0.36 }, ZC + 0.4, ZC + 0.7, { b: 0.08 })
    slabUZ(red, S, [[-S.half, ZC + 0.7], [S.half, ZC + 0.7], [S.half, ZE], [-S.half, ZE]], -0.15, 0.15)
  }

  // ---- The drum: a red sill, glazing with red posts and X-bracing, a red
  // band; the glass dome on 16 red ribs; ball and eagle.
  // the raised inner tier: an octagonal wall with its own merlons, on
  // which the drum stands (photo 8)
  const RT = 6.0, ZU = ZE + 1.5
  for (let k = 0; k < 8; k++) {
    const S = side(RT, k)
    slabUZ(red, S, [[-S.half, ZE - 0.1], [S.half, ZE - 0.1], [S.half, ZU], [-S.half, ZU]], -0.3, 0)
    slabUZ(blue, S, [[-S.half + 0.2, ZE + 0.35], [S.half - 0.2, ZE + 0.35], [S.half - 0.2, ZE + 0.85], [-S.half + 0.2, ZE + 0.85]], 0, 0.06)
    for (let m = 0; m < 3; m++) {
      const u = -S.half + ((m + 0.5) * 2 * S.half) / 3
      slabUZ(red, S, [[u - 0.3, ZU], [u + 0.3, ZU], [u + 0.3, ZU + 0.35], [u + 0.13, ZU + 0.35], [u + 0.13, ZU + 0.8], [u - 0.13, ZU + 0.8], [u - 0.13, ZU + 0.35], [u - 0.3, ZU + 0.35]], -0.25, 0, (a, b) => a[1] === ZU && b[1] === ZU, false)
    }
  }
  ringQuad(RT, RI, ZU - 0.02, true, red)
  const RD = 3.6, Z0 = ZU, Z1 = Z0 + 2.0
  lathe(red, 0, 0, [[RD + 0.25, Z0], [RD + 0.25, Z0 + 0.3], [RD, Z0 + 0.3]], 12, false)
  lathe(glass, 0, 0, [[RD - 0.05, Z0 + 0.3], [RD - 0.05, Z1]], 12, false)
  for (let k = 0; k < 12; k++) {
    const a0 = (k * 2 * Math.PI) / 12, a1 = ((k + 1) * 2 * Math.PI) / 12
    const P = (a: number, z: number): V3 => [RD * Math.cos(a), RD * Math.sin(a), z]
    const am = (a0 + a1) / 2, o: V3 = [Math.cos(am), Math.sin(am), 0], t: V3 = [-Math.sin(am), Math.cos(am), 0]
    const post = P(a0, 0)
    cbox(red, { x0: post[0] - 0.1, x1: post[0] + 0.1, y0: post[1] - 0.1, y1: post[1] + 0.1 }, Z0 + 0.3, Z1, { top: false })
    // X-brace on the face: two thin bars
    for (const [za, zb, s] of [[Z0 + 0.4, Z1 - 0.1, 1], [Z0 + 0.4, Z1 - 0.1, -1]] as Array<[number, number, number]>) {
      const A = P(s > 0 ? a0 : a1, za), B = P(s > 0 ? a1 : a0, zb)
      const w = 0.08
      const off: V3 = [o[0] * 0.03, o[1] * 0.03, 0]
      const d: V3 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], l = Math.hypot(...d)
      // perpendicular within the face
      const pz = d[2] / l, pu = (d[0] * t[0] + d[1] * t[1]) / l
      const perp: V3 = [-t[0] * pz * w, -t[1] * pz * w, pu * w]
      const q = (p: V3, s2: number): V3 => [p[0] + off[0] + perp[0] * s2, p[1] + off[1] + perp[1] * s2, p[2] + perp[2] * s2]
      qf(red, q(A, -1), q(B, -1), q(B, 1), q(A, 1), o)
    }
  }
  lathe(red, 0, 0, [[RD + 0.2, Z1], [RD + 0.2, Z1 + 0.45], [RD - 0.05, Z1 + 0.45]], 12, false)
  // a slightly stilted dome
  const prof: [number, number][] = []
  for (let i = 0; i <= 8; i++) {
    const t = (Math.PI / 2) * (i / 8)
    prof.push([0.25 + (RD - 0.3) * Math.cos(t), Z1 + 0.45 + 3.45 * Math.sin(t)])
  }
  lathe(glass, 0, 0, prof, 12)
  for (let k = 0; k < 8; k++) {
    const a = (k * 2 * Math.PI) / 8 + Math.PI / 12, o: V3 = [Math.cos(a), Math.sin(a), 0], t: V3 = [-Math.sin(a), Math.cos(a), 0]
    for (let i = 0; i < prof.length - 1; i++) {
      const [r0, z0] = prof[i], [r1, z1] = prof[i + 1]
      const R0 = r0 * Math.cos(Math.PI / 12) + 0.02, R1 = r1 * Math.cos(Math.PI / 12) + 0.02, w = 0.11
      const A = (r: number, s: number, z: number): V3 => [o[0] * r + t[0] * s, o[1] * r + t[1] * s, z]
      qf(red, A(R0 + 0.08, -w, z0), A(R0 + 0.08, w, z0), A(R1 + 0.08, w, z1), A(R1 + 0.08, -w, z1), [o[0] * (z1 - z0), o[1] * (z1 - z0), R0 - R1 + 0.01])
    }
  }
  // the lower scalloped band of the dome, in red
  lathe(red, 0, 0, [[RD - 0.02, Z1 + 0.45], [RD - 0.06, Z1 + 1.0]], 12, false)
  const ZT = Z1 + 0.45 + 3.45
  lathe(red, 0, 0, [[0.4, ZT - 0.1], [0.12, ZT + 0.7]], 8)
  lathe(blue, 0, 0, [[0.05, ZT + 0.6], [0.3, ZT + 0.7], [0.42, ZT + 0.95], [0.3, ZT + 1.2], [0.05, ZT + 1.3]], 10)
  // the eagle: body and raised wings
  const ZB = ZT + 1.3
  cbox(bronze, { x0: -0.22, x1: 0.22, y0: -0.35, y1: 0.35 }, ZB, ZB + 0.8, { c: 0.1, b: 0.1 })
  cbox(bronze, { x0: -0.12, x1: 0.12, y0: -0.5, y1: -0.2 }, ZB + 0.7, ZB + 0.95)
  for (const s of [-1, 1]) {
    const pts: V3[] = [[s * 0.15, -0.05, ZB + 0.6], [s * 1.25, 0.05, ZB + 1.35], [s * 1.1, 0.1, ZB + 0.9], [s * 0.2, 0.1, ZB + 0.3]]
    for (const dy of [0, 0.12]) {
      const q = pts.map((p) => [p[0], p[1] + dy, p[2]] as V3)
      qf(bronze, q[0], q[1], q[2], q[3], [0, dy ? 1 : -1, 0])
    }
  }

  // Night: the arcade is lit from inside.
  const lit = (p: V3, n: V3) => (n[2] > 0.6 || p[2] > ZE + 1 ? 0 : 0.8)
  return [
    { part: red, material: { ...finish('ironwork-red', 0xcf6a58), floodlight: lit } },
    { part: blue, material: { ...finish('ironwork-blue', 0x7fa3c2), floodlight: lit } },
    { part: yellow, material: { ...finish('column-yellow', 0xe9dc95), floodlight: lit } },
    { part: glass, material: { ...PALETTE.glass, color: 0xcfe0e6 } },
    { part: bronze, material: finish('bronze', 0x6f5d48) },
    { part: stone, material: PALETTE.stone },
  ]
}

if (import.meta.main) await save('mexico-city-kiosco-morisco', 'Kiosco Morisco', build(), { generator: 'generators/mexico-city-kiosco-morisco.ts' }, 6500)
