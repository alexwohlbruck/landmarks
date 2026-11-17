/**
 * Moody Gardens pyramids, Galveston: the Rainforest Pyramid (1993), the
 * Discovery Pyramid (1997) and the Aquarium Pyramid (1999) — original
 * procedural geometry, CC0-1.0, no textures.
 * bun generators/hou-moody-gardens-pyramids.ts
 *
 * One model for the three, as the brief prefers: they stand 100-140 m
 * apart in one garden and read as one group in every distant photo.
 * Map frame: x east, y north, z up, metres. Bearing 0 (the Rainforest and
 * Aquarium pyramids are square to north; the Discovery Pyramid is turned
 * 45 degrees, corners to the compass points). Anchor at the group's
 * centroid (the three bases weighted by area), -94.8530978, 29.2750417,
 * which falls on the lawn between them. Each pyramid stands on its own
 * ground at z = 0; the map drapes each base on the terrain under it.
 *
 * Identity, in order: three crisp square pyramids of the same ~44 degree
 * pitch; the big turquoise Aquarium Pyramid on a white base; the clear
 * Rainforest Pyramid, pale glass in a white frame with white hips and a
 * pale catwalk band near the top; the smaller pink Discovery Pyramid,
 * turned 45 degrees on a beige base, with a dark glass apex.
 *
 * Evidence
 * - Plan: OSM way/33851702 (Aquarium Pyramid), way/33851713 (Rainforest
 *   Pyramid), way/33851735 (Discovery Pyramid, a 45-degree diamond),
 *   checked against the lidar and USGS NAIP. Centres in this frame (from
 *   the lidar apexes): Rainforest (34.6, 51.0), Aquarium (-10.6, -82.6),
 *   Discovery (-63.0, 74.8).
 * - Heights and bases: USGS 3DEP lidar TX_Coastal_B3_2018 (flown 2018),
 *   1 m grid, measured above each pyramid's own ground (lidar ground
 *   beside it, 4.5-6.5 m over the grid's lowest return):
 *     Aquarium: base 62 x 62 m (lidar edges; OSM 62 x 66 m, its north side
 *       includes the entrance building's wall), white base wall to the
 *       eave at 4.4 m, apex 34.1 m.
 *     Rainforest: base 63 x 63 m (OSM 64 x 64; lidar slope lines meet the
 *       ground at 62-63 m), low white curb 1.2 m, apex 31.0 m.
 *     Discovery: base 38.6 m square turned 45 degrees (lidar ridge ends
 *       27 m from the apex along N-S and E-W; OSM side 37.3 m), beige base
 *       wall to 6.6 m, apex 25.2 m.
 *   The three faces all slope at ~0.95 (43.5 degrees) in the lidar, which
 *   the photos bear out. Published: the Rainforest Pyramid is "10
 *   stories", the Aquarium "12 stories" (moodygardens.org; Wikipedia).
 * - Discovery's dark glass apex: the top quarter of the slope on its SE
 *   face (both photos below); assumed the same on the three faces no
 *   photo shows. Its glazed strip, low on the SW half of the SE face, is
 *   measured from the same photos.
 * - Rainforest catwalk band at 23.5 m and the frame lines at 9 and 16 m:
 *   estimated from the Highsmith, Supportstorm and Liu photos (the real
 *   frame is a fine white diagonal grid; drawn as three bands and the
 *   hips, which is what reads at a distance).
 * - Colours sampled from several photos and pulled to the palette:
 *   Aquarium glass #19d2e7 (Moore, sun), #19b7f3 / #11a5e6 (Supportstorm),
 *   shaded face #15a0b2 -> drawn #52c3dc; Rainforest glass #91b4b8,
 *   #6498b2, distant #627a78 / #678a88, with its white frame -> drawn
 *   #abc8cb; Discovery pink #c46e8e / #c88ba8 (Supportstorm), #bb8e8e
 *   (Moore, distant) -> drawn #d595a9; its apex glass #74495b -> palette
 *   window. Bases white (Aquarium, Rainforest) and beige (Discovery).
 *
 * Photos (all evidence):
 *  - Moody Gardens Pyramids Galveston Texas 2026.jpg, Larry D. Moore,
 *    CC BY 4.0 (all three, from the hotel to the SE)
 *    https://commons.wikimedia.org/wiki/File:Moody_Gardens_Pyramids_Galveston_Texas_2026.jpg
 *  - Rainforest Pyramid Moody Gardens.jpg, Supportstorm, public domain
 *    https://commons.wikimedia.org/wiki/File:Rainforest_Pyramid_Moody_Gardens.jpg
 *  - Discovery Pyramid Moody Gardens.jpg, Supportstorm, public domain
 *    https://commons.wikimedia.org/wiki/File:Discovery_Pyramid_Moody_Gardens.jpg
 *  - The Aquarium at Moody Gardens.jpg, Supportstorm, public domain
 *    https://commons.wikimedia.org/wiki/File:The_Aquarium_at_Moody_Gardens.jpg
 *  - Moody Gardens Rainforest Pyramid (14248736931).jpg, Lydia Liu,
 *    CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Moody_Gardens_Rainforest_Pyramid_(14248736931).jpg
 *  - Moody Gardens, Galveston, Texas LCCN2011630258.tif, Carol M.
 *    Highsmith, public domain (Rainforest Pyramid from the south)
 *    https://commons.wikimedia.org/wiki/File:Moody_Gardens,_Galveston,_Texas_LCCN2011630258.tif
 *  USGS NAIP for the plan and the glass colours from above. No commercial
 *  imagery.
 *
 * Glass: drawn opaque. The Rainforest Pyramid reads in every photo as pale
 * reflective glass in a white frame, not as a view of the canopy, so it is
 * `glass` (dark at night, like the other structural glazing); the
 * Aquarium's turquoise glass is `glass-2`.
 *
 * Left out: the linking walkways and entrance buildings (their own OSM
 * buildings, left to the map), the Aquarium's starred top panels and its
 * mullion grid, the Discovery Pyramid's vertical mullions, finials.
 *
 * Doubts: Discovery's NE, NW and SW faces (no photo; drawn like the SE
 * face, without its glazed strip); the Rainforest's north side (no photo);
 * the exact base-wall heights where shrubs hide them (lidar eaves used).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save } from './chi-aon-center'

const glassRain = new Part(), glassAqua = new Part(), pink = new Part(), white = new Part(), beige = new Part(), dark = new Part()

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const unit = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l] }
const crossV = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

type Face = { M: V3; e: V3; P: V3; n: V3; h: number; s: number }

/**
 * A square pyramid on a vertical base wall. Corners counter-clockwise from
 * above, the first at `rot` degrees (math angle) from +x. Returns its four
 * faces for overlays. Low edges are split into pieces of at most 5.5 m so
 * the map's per-vertex drape can follow the ground.
 */
function pyramid(c: [number, number], half: number, rotDeg: number, zEave: number, zApex: number,
  wall: Part | null, face: (k: number) => Part, zCap?: number, capPart?: Part): Face[] {
  const r = half * Math.SQRT2
  const C: V3[] = [0, 1, 2, 3].map(k => {
    const a = ((rotDeg + 90 * k) * Math.PI) / 180
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), 0]
  })
  const P: V3 = [c[0], c[1], zApex]
  const n = Math.max(1, Math.ceil((2 * half) / 5.5))
  const faces: Face[] = []
  for (let k = 0; k < 4; k++) {
    const A = C[k], B = C[(k + 1) % 4]
    const at = (t: number, z: number): V3 => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, z]
    if (wall && zEave > 0) for (let i = 0; i < n; i++) wall.quad(at(i / n, 0), at((i + 1) / n, 0), at((i + 1) / n, zEave), at(i / n, zEave))
    // the sloped face: a strip of n pieces up to the cap line (or a fan to the apex)
    const tc = zCap !== undefined ? (zCap - zEave) / (zApex - zEave) : 1
    const lift = (p: V3, t: number): V3 => [p[0] + (P[0] - p[0]) * t, p[1] + (P[1] - p[1]) * t, zEave + (zApex - zEave) * t]
    const part = face(k)
    if (tc >= 1) {
      for (let i = 0; i < n; i++) part.tri(at(i / n, zEave), at((i + 1) / n, zEave), P)
    } else {
      for (let i = 0; i < n; i++) {
        const a0 = at(i / n, zEave), a1 = at((i + 1) / n, zEave)
        part.quad(a0, a1, lift(a1, tc), lift(a0, tc))
      }
      capPart!.tri(lift(A, tc), lift(B, tc), P)
    }
    const M: V3 = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2, zEave]
    const e = unit(sub(B, A))
    const nrm = unit(crossV(sub(B, A), sub(P, A)))
    faces.push({ M, e, P, n: nrm, h: half, s: Math.hypot(P[0] - M[0], P[1] - M[1], P[2] - M[2]) })
  }
  return faces
}

/** A point on a face: u across from its centre line, v up the slope; `off` out of it. */
const onFace = (f: Face, u: number, v: number, off = 0.05): V3 =>
  add(add(add(f.M, mul(f.e, u)), mul(sub(f.P, f.M), v / f.s)), mul(f.n, off))

/** A horizontal band across a face between slope heights v0 and v1. */
function band(p: Part, f: Face, v0: number, v1: number) {
  const w0 = f.h * (1 - v0 / f.s), w1 = f.h * (1 - v1 / f.s)
  p.quad(onFace(f, -w0, v0), onFace(f, w0, v0), onFace(f, w1, v1), onFace(f, -w1, v1))
}

/** The hip lines: a strip of width w inside the face along both of its sloped edges, meeting on the centre line. */
function hips(p: Part, f: Face, w: number) {
  const b = (w * Math.hypot(f.h, f.s)) / f.s
  const top = f.s - (f.s * b) / f.h
  // left hip
  p.quad(onFace(f, -f.h, 0), onFace(f, -f.h + b, 0), onFace(f, 0, top), onFace(f, 0, f.s))
  // right hip
  p.quad(onFace(f, f.h - b, 0), onFace(f, f.h, 0), onFace(f, 0, f.s), onFace(f, 0, top))
}

/** A region of a face from u0..u1 (clipped to the hips) and v0..v1. */
function patch(p: Part, f: Face, u0: number, u1: number, v0: number, v1: number) {
  const w = (v: number) => f.h * (1 - v / f.s)
  const cl = (u: number, v: number) => Math.max(-w(v), Math.min(w(v), u))
  p.quad(onFace(f, cl(u0, v0), v0), onFace(f, cl(u1, v0), v0), onFace(f, cl(u1, v1), v1), onFace(f, cl(u0, v1), v1))
}

const slope = (f: Face, z: number, zEave: number, zApex: number) => ((z - zEave) / (zApex - zEave)) * f.s

// ---- Aquarium Pyramid -------------------------------------------------------
{
  const zE = 4.4, zA = 34.1
  const faces = pyramid([-10.6, -82.6], 31.0, 45, zE, zA, white, () => glassAqua)
  for (const f of faces) hips(white, f, 0.3)
}

// ---- Rainforest Pyramid -----------------------------------------------------
{
  const zE = 1.2, zA = 31.0
  const faces = pyramid([34.6, 51.0], 31.5, 45, zE, zA, white, () => glassRain)
  for (const f of faces) {
    hips(white, f, 0.75)
    for (const [z, w] of [[9, 0.45], [16.5, 0.45], [23.5, 1.0]] as [number, number][]) {
      const v = slope(f, z, zE, zA)
      band(white, f, v - w / 2, v + w / 2)
    }
  }
}

// ---- Discovery Pyramid ------------------------------------------------------
{
  const zE = 6.6, zA = 25.2, zCap = zE + 0.75 * (zA - zE)
  // corners to the compass points: first corner east (0 degrees)
  const faces = pyramid([-63.0, 74.8], 19.3, 0, zE, zA, beige, () => pink, zCap, dark)
  for (const f of faces) hips(white, f, 0.35)
  // the glazed strip low on the SW half of the SE face (face 3: from the S corner to the E corner)
  const se = faces[3]
  patch(dark, se, -se.h, -0.12 * se.h, 0.03 * se.s, 0.27 * se.s)
}

if (import.meta.main) {
  await save('hou-moody-gardens-pyramids', 'Moody Gardens pyramids', [29.2750417, -94.8530978], 0, [
    { part: glassAqua, material: finish('glass-2', 0x52c3dc, 0.24) },
    { part: glassRain, material: { ...PALETTE.glass, color: 0xb5cfd1 } },
    { part: pink, material: finish('discovery-pink', 0xd595a9) },
    { part: white, material: PALETTE.trim },
    { part: beige, material: finish('discovery-base', 0xe4d6bf) },
    { part: dark, material: PALETTE.window },
  ])
}
