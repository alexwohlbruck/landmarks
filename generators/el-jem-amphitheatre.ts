/**
 * Amphitheatre of El Jem (Thysdrus, about 238 AD), El Jem, Tunisia:
 * original procedural geometry, CC0-1.0, no textures.
 *   bun generators/el-jem-amphitheatre.ts
 * Writes models/el-jem-amphitheatre.glb (low) and
 * models/el-jem-amphitheatre.detail.glb (detail: arches cut through the
 * full wall with their reveals and 10-segment heads, engaged columns on
 * the upper storeys, finer seating tiers).
 *
 * Map frame: x east, y north, z up, metres. Anchor = the centre of the
 * ellipse fitted to the OSM outer way (way/218657180 of relation/2894555),
 * lng 10.706952, lat 35.296420. Bearing 350: the fitted major axis runs at
 * 80 deg, so it lies along model x.
 *
 * Identity, in order: the elliptical outer wall of three storeys of 64
 * round arches each, with cornices between the storeys and engaged
 * columns; its broken western section, where the wall is down to a few
 * metres over about 30 m and stands in ragged stubs on either side; the
 * lost attic, so that the third storey's arch heads are broken open over
 * much of the circuit; the cavea falling in tiers to the arena's podium;
 * the honey-coloured limestone.
 *
 * Evidence
 *  - Plan: OSM relation/2894555 (building=ruins): outer way/218657180
 *    (fitted ellipse 146.6 x 127.6 m), inner way/975418627 (the arena,
 *    fitted 66.4 x 39.7 m). Published (Wikipedia, French Wikipedia):
 *    148 x 122 m overall, arena 65 x 39 m, 36 m high, 64 arcades on three
 *    storeys, Corinthian on the first and third, composite on the second;
 *    the attic is lost; the breach (1695, widened about 1850) is about
 *    30 m. Drawn: 147 x 125 m (between OSM and the published axes), arena
 *    65 x 39 m, 64 arches spaced evenly along the ellipse.
 *  - Storeys (ESTIMATED from e2, e9 and the section in e8): ground storey
 *    to 11 m (arches 4.2 m wide, springing 6.2 m), cornice; second to
 *    21.8 m; third to 32.5 m, entablature to 33.2 m; attic remnants to
 *    36 m in a few bays only (e1, e3). Arches are true semicircles.
 *  - The breach: on the west (the lead's note; e11 shows it from the
 *    garden side): the wall stands 3-8 m over about 36 deg of the
 *    circuit, stepping up to full-height stubs on either side (e10, e11).
 *    The cavea there is down to a low mound.
 *  - Cavea: from the inner face of the arcade ring (4.5 m in) at 24 m
 *    down to a 4 m podium round the arena (section e8), in 5 tiers (12 in
 *    the detail model).
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    e1 Skander zarrad, "Amphitheatre El Jem - vue exterieur.jpg", CC BY-SA 4.0
 *      https://commons.wikimedia.org/wiki/File:Amphitheatre_El_Jem_-_vue_exterieur.jpg
 *    e2 Bernard Gagnon, "Amphitheatre of El Djem 01.jpg", CC BY-SA 3.0 (storeys, columns, colour)
 *      https://commons.wikimedia.org/wiki/File:Amphitheatre_of_El_Djem_01.jpg
 *    e3 Jerzystrzelecki, "Amphitheatre El Jem(js)3.jpg", CC BY 3.0 (broken third-storey heads)
 *      https://commons.wikimedia.org/wiki/File:Amphitheatre_El_Jem(js)3.jpg
 *    e5 AQVA121, "Amphitheatre of El Jem external 01.jpg", CC BY-SA 4.0
 *      https://commons.wikimedia.org/wiki/File:Amphitheatre_of_El_Jem_external_01.jpg
 *    e7 Fatma Hamdi, "Amphitheatre El Jem Front Entrance.jpg", CC BY-SA 4.0
 *      https://commons.wikimedia.org/wiki/File:Amphitheatre_El_Jem_Front_Entrance.jpg
 *    e8 Habib M'henni, "Plan and section views of the Amphitheatre of El Jem.svg", CC BY-SA 3.0
 *      https://commons.wikimedia.org/wiki/File:Plan_and_section_views_of_the_Amphitheatre_of_El_Jem.svg
 *    e9 Vajta, "Amphitheatre-of-El-Jem 01.jpg", CC BY-SA 3.0 (the storeys close up)
 *      https://commons.wikimedia.org/wiki/File:Amphitheatre-of-El-Jem_01.jpg
 *    e10 Jerzystrzelecki, "Amphitheatre El Jem(js)7.jpg", CC BY 3.0 (the wall stepping down at the breach)
 *      https://commons.wikimedia.org/wiki/File:Amphitheatre_El_Jem(js)7.jpg
 *    e11 Dennis Jarvis, "3000 years of history.jpg", CC BY-SA 2.0 (the breach)
 *      https://commons.wikimedia.org/wiki/File:3000_years_of_history.jpg
 *    e12 Ridiculopathy, "Amphitheatre of El Jem, Tunisia in January 2023.jpg", CC0
 *      https://commons.wikimedia.org/wiki/File:Amphitheatre_of_El_Jem,_Tunisia_in_January_2023.jpg
 *  - Colours: sunlit limestone sampled from e2, e9, e12, honey #c9a771 to
 *    #d8bb8a; drawn #dcc193 (walls), #e6d2ad (cornices, columns), seating
 *    #cdb68f. Night: floodlit (it is lit for the summer festival).
 *  No look-only sources. No commercial imagery. No lidar exists here.
 *
 * Invented or simplified: the ruined profile of the top (which bays keep
 * their heads and attic) follows the photos loosely, not bay by bay; the
 * radial vaults and corridors are reduced to one inner ring wall; the
 * cavea is drawn whole outside the breach, where much of it is really
 * ruined or restored; the hypogeum is not drawn. Doubts: the breach's
 * exact position and extent.
 */
import clipping from 'polygon-clipping'
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { type XY } from './chi-aon-center'
import { face } from './phl-independence-hall'
import { polyTris } from './berlin-oberbaum-bridge'
import { cyl, writeModel, type Slot } from './pretoria-union-buildings'

const ID = 'el-jem-amphitheatre'
const NAME = 'Amphitheatre of El Jem'
const ANCHOR: [number, number] = [10.706952, 35.29642]
const BEARING = 350

const A = 73.5, B = 62.5, N = 64, DEPTH = 4.5
const RAD = Math.PI / 180
/** Storeys: base, top, arch half-width, springing. */
const STOREYS: [number, number, number, number][] = [[0, 11.0, 2.1, 6.2], [11.8, 21.8, 2.05, 16.6], [22.5, 32.5, 1.95, 27.0]]
const CORNICES: [number, number][] = [[11.0, 11.8], [21.8, 22.5], [32.5, 33.2]]

const P = (t: number, d = 0): XY => {
  // offset d inward along the ellipse normal
  const x = A * Math.cos(t), y = B * Math.sin(t), nx = Math.cos(t) / A, ny = Math.sin(t) / B, l = Math.hypot(nx, ny)
  return [x - (d * nx) / l, y - (d * ny) / l]
}
/** Parameters of the 64 bay boundaries, evenly spaced along the ellipse. */
const T: number[] = (() => {
  const M = 4096, s: number[] = [0]
  for (let i = 1; i <= M; i++) { const a = P((2 * Math.PI * (i - 1)) / M), b = P((2 * Math.PI * i) / M); s.push(s[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])) }
  const L = s[M], out: number[] = []
  let j = 0
  for (let k = 0; k <= N; k++) {
    const want = (L * k) / N + L / (2 * N) * 0
    while (j < M && s[j + 1] < want) j++
    const f = (want - s[j]) / ((s[j + 1] - s[j]) || 1)
    out.push(((j + f) / M) * 2 * Math.PI + Math.PI / N)
  }
  return out
})()

/** The ruined top of the wall at bay i (centre angle t). */
function hmax(i: number, t: number) {
  let a = ((t / RAD) % 360 + 360) % 360; if (a > 180) a -= 360
  const fromBreach = Math.min(Math.abs(a - 170), 360 - Math.abs(a - 170))
  if (fromBreach < 18) return 3 + ((i * 5) % 4) * 1.4
  if (fromBreach < 22) return 14 + ((i * 3) % 3) * 3
  if (fromBreach < 27) return 30.5
  if (a > -30 && a < 2) return 36
  if (Math.abs(a) > 100 || (i * 5) % 7 === 0) return 28.4
  return 33.2
}

function build(detail: boolean): Slot[] {
  const stone = new Part(), dressed = new Part(), seats = new Part(), shade = new Part()
  const SEG = detail ? 10 : 4

  for (let i = 0; i < N; i++) {
    const t0 = T[i], t1 = T[i + 1], tm = (t0 + t1) / 2
    const a = P(t0), b = P(t1), ai = P(t0, DEPTH), bi = P(t1, DEPTH)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    // points on the outer face (s along the chord, z) and the inner ring
    const O = (s: number, z: number): V3 => [a[0] + u[0] * s, a[1] + u[1] * s, z]
    const Li = Math.hypot(bi[0] - ai[0], bi[1] - ai[1]), ui: XY = [(bi[0] - ai[0]) / Li, (bi[1] - ai[1]) / Li]
    const I = (s: number, z: number): V3 => [ai[0] + ui[0] * (s * Li / L), ai[1] + ui[1] * (s * Li / L), z]
    const top = hmax(i, tm)
    const flood = 1

    for (let k = 0; k < STOREYS.length; k++) {
      const [z0, z1, hw, zs] = STOREYS[k]
      if (z0 >= top) break
      const zt = Math.min(z1, top)
      // the bay's face: wall with an arched opening open at the foot
      const o0 = L / 2 - hw, o1 = L / 2 + hw
      const ring: [number, number][] = [[0, z0], [o0, z0], [o0, zs]]
      for (let q = 1; q < SEG; q++) { const ang = Math.PI - (Math.PI * q) / SEG; ring.push([L / 2 + hw * Math.cos(ang), zs + hw * Math.sin(ang)]) }
      ring.push([o1, zs], [o1, z0], [L, z0], [L, z1], [0, z1])
      const clipped = clipping.intersection([[...ring, ring[0]]], [[[-1, z0 - 1], [L + 1, z0 - 1], [L + 1, zt], [-1, zt], [-1, z0 - 1]]])
      for (const poly of clipped) {
        const r = poly[0].slice(0, -1) as XY[]
        for (const [p, q, c] of polyTris(r)) face(stone, [O(...p), O(...q), O(...c)], [n[0], n[1], 0])
        if (detail) {
          // the same face on the ambulatory side, and the reveals through the wall
          for (const [p, q, c] of polyTris(r)) face(stone, [I(...p), I(...q), I(...c)], [-n[0], -n[1], 0])
          for (let e = 0; e < r.length; e++) {
            const p = r[e], q = r[(e + 1) % r.length]
            const inner = p[0] > 0.01 && p[0] < L - 0.01 && q[0] > 0.01 && q[0] < L - 0.01 && !(Math.abs(p[1] - q[1]) < 1e-6 && (Math.abs(p[1] - z0) < 1e-6 || Math.abs(p[1] - zt) < 1e-6))
            if (!inner) continue
            const ds: XY = [q[0] - p[0], q[1] - p[1]], dl = Math.hypot(ds[0], ds[1]) || 1
            const nn: V3 = [u[0] * (ds[1] / dl), u[1] * (ds[1] / dl), -ds[0] / dl]
            face(stone, [O(...p), O(...q), I(...q), I(...p)], [-nn[0], -nn[1], -nn[2]])
          }
        }
      }
      // the broken top of a bay that stops inside the storey: a rough slab across the wall
      if (zt < z1) face(stone, [O(0, zt), O(L, zt), I(L, zt), I(0, zt)], [0, 0, 1])
      // engaged columns between the arches (detail), on the upper storeys
      if (detail && k > 0 && zt > zs) for (const s of [0, L]) {
        const c = O(s, 0)
        cyl(dressed, c[0] + n[0] * 0.05, c[1] + n[1] * 0.05, 0.42, z0 + 0.4, Math.min(z1, zt), 8, false)
      }
    }
    // the inner ring wall (the ambulatory's inner side), its face toward the arcades
    const zr = Math.min(top, 33.2)
    {
      // seen through the arches: the shadowed vaults behind them
      const as = P(t0, DEPTH + (detail ? 0.6 : 0)), bs = P(t1, DEPTH + (detail ? 0.6 : 0))
      face(shade, [[as[0], as[1], 0], [bs[0], bs[1], 0], [bs[0], bs[1], zr], [as[0], as[1], zr]], [n[0], n[1], 0])
    }
    // and its face toward the cavea, above the seating
    const zc = caveaTop(tm)
    const ai2 = P(t0, DEPTH + 0.8), bi2 = P(t1, DEPTH + 0.8)
    if (zr > zc) face(stone, [[bi2[0], bi2[1], zc], [ai2[0], ai2[1], zc], [ai2[0], ai2[1], zr], [bi2[0], bi2[1], zr]], [-n[0], -n[1], 0])
    // walkway over the wall where it stands to full height
    if (top >= 33.2) face(dressed, [O(0, top), O(L, top), [bi2[0], bi2[1], top], [ai2[0], ai2[1], top]], [0, 0, 1])
    else face(stone, [I(0, zr), I(L, zr), [bi2[0], bi2[1], zr], [ai2[0], ai2[1], zr]], [0, 0, 1])
    // cornices
    for (const [c0, c1] of CORNICES) {
      if (c1 > top + 0.01) continue
      const o = 0.45
      const Q = (s: number, z: number, d: number): V3 => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, z]
      face(dressed, [Q(-0.02, c0, o), Q(L + 0.02, c0, o), Q(L + 0.02, c1, o), Q(-0.02, c1, o)], [n[0], n[1], 0])
      face(dressed, [Q(-0.02, c1, o), Q(L + 0.02, c1, o), Q(L + 0.02, c1, 0), Q(-0.02, c1, 0)], [0, 0, 1])
      face(dressed, [Q(-0.02, c0, 0), Q(L + 0.02, c0, 0), Q(L + 0.02, c0, o), Q(-0.02, c0, o)], [0, 0, -1])
    }
    // attic remnant: solid wall above the entablature
    if (top > 33.21) {
      face(stone, [O(0, 33.2), O(L, 33.2), O(L, top), O(0, top)], [n[0], n[1], 0])
      face(stone, [O(0, top), O(L, top), I(L, top), I(0, top)], [0, 0, 1])
      face(stone, [I(L, 33.2), I(0, 33.2), I(0, top), I(L, top)], [-n[0], -n[1], 0])
    }
    // stub ends where the height changes between neighbouring bays
    const tn = hmax((i + 1) % N, (T[(i + 1) % N] + T[(i + 2) % N]) / 2)
    if (Math.abs(tn - top) > 0.5) {
      const lo = Math.min(tn, top), hi = Math.max(tn, top)
      const s = L, dir: XY = tn < top ? u : [-u[0], -u[1]]
      face(stone, [O(s, lo), I(s, lo), I(s, hi), O(s, hi)], [dir[0], dir[1], 0])
    }
    void flood
  }

  // --- cavea: tiers from the arcade ring down to the podium round the arena
  const tiers = detail ? 12 : 5, M = detail ? 96 : 48
  const AR = 32.5, BR = 19.5, POD = 4
  const ring = (f: number, t: number): XY => {
    // f = 0 at the inner ring wall, 1 at the podium
    const a0 = A - DEPTH - 0.8, b0 = B - DEPTH - 0.8
    return [(a0 + (AR - a0) * f) * Math.cos(t), (b0 + (BR - b0) * f) * Math.sin(t)]
  }
  for (let m = 0; m < M; m++) {
    const t0 = (2 * Math.PI * m) / M, t1 = (2 * Math.PI * (m + 1)) / M, tm = (t0 + t1) / 2
    const cap = caveaTop(tm)
    for (let k = 0; k < tiers; k++) {
      const f0 = k / tiers, f1 = (k + 1) / tiers
      const z = Math.min(cap, 24 - ((24 - POD) * (k + 0.5)) / tiers)
      const zn = k + 1 < tiers ? Math.min(cap, 24 - ((24 - POD) * (k + 1.5)) / tiers) : 0
      const p00 = ring(f0, t0), p01 = ring(f0, t1), p10 = ring(f1, t0), p11 = ring(f1, t1)
      face(seats, [[p00[0], p00[1], z], [p10[0], p10[1], z], [p11[0], p11[1], z], [p01[0], p01[1], z]], [0, 0, 1])
      // riser down to the next tier (or the arena, for the podium)
      if (z - zn > 0.05) {
        const nx = -(p10[0] + p11[0]) / 2, ny = -(p10[1] + p11[1]) / 2
        face(k + 1 < tiers ? seats : stone, [[p10[0], p10[1], zn], [p11[0], p11[1], zn], [p11[0], p11[1], z], [p10[0], p10[1], z]], [nx, ny, 0])
      }
    }
  }

  const flood = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 0.9)
  return [
    { part: stone, material: { ...finish('eljem-limestone', 0xdcc193), floodlight: flood } },
    { part: dressed, material: { ...finish('eljem-dressed-stone', 0xe6d2ad), floodlight: flood } },
    { part: seats, material: finish('eljem-cavea', 0xcdb68f) },
    { part: shade, material: finish('eljem-shade', 0x8c7556) },
  ]
}

/** The cavea's highest tier at angle t: 24 m, down to a low mound in the breach. */
function caveaTop(t: number) {
  const a = ((t / RAD) % 360 + 360) % 360
  const d = Math.min(Math.abs(a - 170), 360 - Math.abs(a - 170))
  if (d < 20) return 5
  if (d < 30) return 5 + ((d - 20) / 10) * 19
  return 24
}

if (import.meta.main) {
  const extras = { anchor: ANCHOR, bearing: BEARING }
  await writeModel(`${ID}.glb`, NAME, build(false), extras, 6500, 250_000)
  await writeModel(`${ID}.detail.glb`, NAME, build(true), extras, 40_000, 1_536_000)
}
