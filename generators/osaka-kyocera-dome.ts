/**
 * Kyocera Dome Osaka (京セラドーム大阪, Osaka Dome), Nishi-ku, Osaka:
 * procedural, CC0-1.0.
 * bun generators/osaka-kyocera-dome.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/osaka-kyocera-dome.glb, the low model;
 * - models/osaka-kyocera-dome.detail.glb, drawn from zoom 16: rounder
 *   lobes, the upper dome's meridian ribs, the stair cores' fins.
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the building is
 * round). The origin is the centre of OSM's outline (way/149991212, a
 * circle of radius ~104 m); y = 0 is the street (flat). The field inside is
 * not modelled: the model is the closed shell as seen from outside.
 *
 * Nikken Sekkei, 1997. A round dome stadium: a podium of concourses, a
 * sloping blue-grey "skirt", a dark blue band with white stair cores, a
 * ring of 36 silver cushion lobes divided by dark blue curving grooves, and
 * above them a terraced silver dome with a flat crown.
 *
 * OSM: way/149991212 (leisure=stadium, roof:shape=dome, height=36, which is
 * the eaves of the lobe ring rather than the top): a circle of radius
 * 103-105 m (measured). Published (ja.wikipedia "京セラドーム大阪"): 83 m
 * to the roof's highest point; building area 33,800 m^2 (a 207 m circle,
 * matching OSM); 9 storeys above ground; the central 76 m of the roof is
 * polycarbonate.
 *
 * Estimated from photos ("Kyocera Dome Osaka1.jpg", KENPEI, a near-level
 * side view scaled to the 83 m top and OSM's 208 m width, 3.94 px/m):
 * - the podium to 20 m (behind the plaza decks and bridges);
 * - the skirt sloping from r 105 m at 20 m to r 101 m at 32 m;
 * - the dark band r 100 m from 32 to 45.7 m, a lit cyan strip at its top,
 *   and white stair cores standing proud of it at eight places;
 * - the lobe ring from 45.7 m to ~65 m, bulging to r 103.5 m, its top
 *   rolling in to r ~64 m; 36 lobes (17-18 seen across a half);
 * - the upper dome from r 64 m at ~61 m (sunk behind the lobes' roll) to
 *   the crown, r 11 m at 82.4 m, in four terraces 0.9 m high, with a raised
 *   centre to 83 m;
 * - colours: the roof silver (#c9cfd6-#e2e6ea), drawn #d8dde2; the grooves
 *   and the band a dark blue (#3e5576-#5a7395), drawn #5d7494; the skirt a
 *   pale blue-grey (#9fb0c4), drawn #a9b8c8; the cores white.
 * Invented: the podium's details (hidden in every photo), the exact count
 *   of terraces (the photos show faint concentric lines).
 * Left out: the external stairs and ramps, the plaza decks and footbridges
 *   (separate in OSM or part of the ground), signs.
 * Terrain: see the report; elevation 0.
 *
 * Night: the cyan strip under the lobes is lit (`neon-dome-cyan`); the
 * band's windows glow.
 *
 * Photos (Wikimedia Commons, evidence):
 * - "Kyocera Dome Osaka1.jpg", KENPEI, CC BY-SA 3.0 (side view, proportions)
 * - "Kyocera Dome Osaka (27265570595).jpg", redlegsfan21, CC BY-SA 2.0 (front, from the north-east bridge)
 * - "Osaka-Dome-Kyocera-Dome (5376982945).jpg", Ai Amo, CC BY 2.0
 * - "Osaka Dome - panoramio.jpg", "(2)", "(6)", "(8)", DVMG, CC BY 3.0
 * - "京セラドーム大阪 (5424664283).jpg", Kohei Fujii, CC BY-SA 2.0
 * - "Osaka Dome from shin naniwa suji.JPG", ARICA13, CC BY-SA 3.0
 * - "京セラドーム大阪20120629.jpg", Sakuraikubuki, CC BY-SA 3.0 (inside: the roof's rings)
 * Look-only: none.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { TAU, fquad, writeLods, type Mat } from './osaka-umeda-sky-building'

const P3 = (r: number, a: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]

/** A surface of revolution, smooth around, flat along the profile; `k` segments. */
function lathe(p: Part, prof: Array<[number, number]>, k: number, a0 = 0, a1 = TAU) {
  for (let j = 0; j < prof.length - 1; j++) {
    const [r0, za] = prof[j], [r1, zb] = prof[j + 1], e = Math.atan2(r0 - r1, zb - za)
    for (let i = 0; i < k; i++) {
      const t0 = a0 + ((a1 - a0) * i) / k, t1 = a0 + ((a1 - a0) * (i + 1)) / k
      const N = (a: number): V3 => [Math.cos(a) * Math.cos(e), Math.sin(a) * Math.cos(e), Math.sin(e)]
      if (r1 < 0.02) p.tri(P3(r0, t0, za), P3(r0, t1, za), P3(0, 0, zb), undefined, undefined, undefined, [N(t0), N(t1), [0, 0, 1]])
      else if (r0 < 0.02) p.tri(P3(0, 0, za), P3(r1, t1, zb), P3(r1, t0, zb), undefined, undefined, undefined, [[0, 0, -1], N(t1), N(t0)])
      else {
        p.tri(P3(r0, t0, za), P3(r0, t1, za), P3(r1, t1, zb), undefined, undefined, undefined, [N(t0), N(t1), N(t1)])
        p.tri(P3(r0, t0, za), P3(r1, t1, zb), P3(r1, t0, zb), undefined, undefined, undefined, [N(t0), N(t1), N(t0)])
      }
    }
  }
}

function build(detail: boolean): Mat[] {
  const silver = new Part(), blue = new Part(), skirt = new Part(), win = new Part(), white = new Part(), neon = new Part()
  const K = detail ? 144 : 64

  // --- Podium, skirt and band. --------------------------------------------
  lathe(skirt, [[97.5, 0], [97.5, 20]], K)
  // podium glazing: two bands round it
  for (const [z0, z1] of [[3.5, 7.5], [12, 16]]) lathe(win, [[97.56, z0], [97.56, z1]], K)
  lathe(skirt, [[97.5, 20], [105, 20], [101, 32]], K) // the sloping skirt
  lathe(blue, [[100, 32], [100, 44.4]], K)
  lathe(neon, [[100.05, 44.4], [100.05, 45.7]], K)
  // the band's glazing: two broad bands, broken by the cores
  const cores = 8
  for (let c = 0; c < cores; c++) {
    const a0 = ((c + 0.12) / cores) * TAU, a1 = ((c + 0.88) / cores) * TAU
    for (const [z0, z1] of [[34, 37.4], [39.2, 42.6]]) lathe(win, [[100.06, z0], [100.06, z1]], Math.round(K / cores), a0, a1)
  }
  // white stair cores: boxes standing proud of the band, up to the lobes
  for (let c = 0; c < cores; c++) {
    const a = (c / cores) * TAU + TAU / 16
    const u: V3 = [Math.cos(a), Math.sin(a), 0], v: V3 = [-Math.sin(a), Math.cos(a), 0]
    const Q = (r: number, w: number, z: number): V3 => [u[0] * r + v[0] * w, u[1] * r + v[1] * w, z]
    const r0 = 98.5, r1 = 104.2, w = 4.6, z0 = 20, z1 = 47
    fquad(white, Q(r1, -w, z0), Q(r1, w, z0), Q(r1, w, z1), Q(r1, -w, z1), u)
    fquad(white, Q(r0, -w, z0), Q(r1, -w, z0), Q(r1, -w, z1), Q(r0, -w, z1), [-v[0], -v[1], 0])
    fquad(white, Q(r1, w, z0), Q(r0, w, z0), Q(r0, w, z1), Q(r1, w, z1), v)
    fquad(white, Q(r0, -w, z1), Q(r1, -w, z1), Q(r1, w, z1), Q(r0, w, z1), [0, 0, 1])
    // a tall glazed slot down the core's face
    fquad(win, Q(r1 + 0.05, -1.0, z0 + 3), Q(r1 + 0.05, 1.0, z0 + 3), Q(r1 + 0.05, 1.0, z1 - 3), Q(r1 + 0.05, -1.0, z1 - 3), u)
  }

  // --- The ring of 36 lobes. ----------------------------------------------
  // Each lobe is a cushion: the ring's section bulges out across the lobe's
  // middle and sinks into a groove at its edges, where a dark blue rib runs
  // over the roll.
  const NL = 36
  const full: Array<[number, number]> = [[100.2, 45.7], [102.6, 48.5], [103.6, 52.5], [103.2, 57], [100.5, 61], [95, 63.8], [86, 65.3], [75, 65.4], [64, 64.6]]
  const sec = detail ? full : [0, 2, 3, 4, 5, 6, 8].map((i) => full[i])
  const centre = [102, 56] // the roll's centre in section, for the bulge's direction
  const nu = detail ? 8 : 3
  const S = (j: number, u: number, lobe: number): V3 => {
    // u in 0..1 across the lobe; the bulge is 1 at the middle, 0 at the grooves
    const [r, z] = sec[j]
    const b = 1 - Math.pow(2 * u - 1, 4)
    const dr = r - centre[0], dz = z - centre[1], l = Math.hypot(dr, dz) || 1
    const lift = (j === 0 || j === sec.length - 1 ? 0 : 2.3) * b - 1.0 * (1 - b) * (j === 0 || j === sec.length - 1 ? 0 : 1)
    const rr = r + (dr / l) * lift, zz = z + (dz / l) * lift
    const a = ((lobe + u) / NL) * TAU
    return P3(rr, a, zz)
  }
  for (let L = 0; L < NL; L++) {
    for (let j = 0; j < sec.length - 1; j++) {
      for (let i = 0; i < nu; i++) {
        const u0 = 0.04 + (0.92 * i) / nu, u1 = 0.04 + (0.92 * (i + 1)) / nu
        const A = S(j, u0, L), B = S(j, u1, L), C = S(j + 1, u1, L), D = S(j + 1, u0, L)
        const n: V3 = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2, ((A[2] + C[2]) / 2 - 40) * 1.5]
        fquad(silver, A, B, C, D, n)
      }
      // the groove: a dark blue strip from the lobe's edge to the next lobe's
      const A = S(j, 0.96, L), B = S(j, 1.04, L), C = S(j + 1, 1.04, L), D = S(j + 1, 0.96, L)
      const n: V3 = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2, ((A[2] + C[2]) / 2 - 40) * 1.5]
      fquad(blue, A, B, C, D, n)
    }
  }
  // a dark ledge under the lobes, over the cyan strip
  lathe(blue, [[100, 45.7], [100.3, 45.7]], K)

  // --- The upper dome, in terraces, and its crown. -------------------------
  // A spherical cap from r 64 m to r 11 m (sphere radius ~116 m), cut into
  // four terraces that each step up 0.9 m going in, the crown at 82.4 m.
  const R = 115.7, RISE = 0.9, steps = [64, 52, 40, 27.5, 11]
  const zc = 82.4 - RISE * (steps.length - 2) - Math.sqrt(R * R - 11 * 11)
  const zOf = (r: number) => zc + Math.sqrt(R * R - r * r)
  // the inner face of the lobe ring, dropping to the dome's foot (faces in)
  lathe(blue, [[64, 64.6], [64, zOf(64)]], K)
  for (let s = 0; s < steps.length - 1; s++) {
    const ra = steps[s], rb = steps[s + 1], m = detail ? 4 : 2, off = RISE * s
    const prof: Array<[number, number]> = []
    for (let q = 0; q <= m; q++) { const r = ra - ((ra - rb) * q) / m; prof.push([r, zOf(r) + off]) }
    lathe(silver, prof, K)
    // the riser up to the next terrace, a little darker
    if (s < steps.length - 2) lathe(blue, [[rb, zOf(rb) + off], [rb, zOf(rb) + off + RISE]], K)
  }
  // crown: the flat polycarbonate centre with a raised rim and a small lantern ring
  lathe(silver, [[11, 82.4], [11, 82.9], [10.2, 82.9]], K / 2)
  lathe(white, [[10.2, 82.4], [0, 82.4]], K / 2)
  lathe(silver, [[3.2, 82.4], [3.2, 83.0], [0, 83.0]], K / 4)
  // meridian ribs on the upper dome (detail): low raised strips
  if (detail) for (let i = 0; i < 48; i++) {
    const a = (i / 48) * TAU, da = 0.006
    for (let s = 0; s < steps.length - 1; s++) {
      const r0 = steps[s] - 0.2, r1 = steps[s + 1] + 0.2, off = RISE * s + 0.15
      fquad(silver, P3(r0, a - da * (64 / r0), zOf(r0) + off), P3(r0, a + da * (64 / r0), zOf(r0) + off), P3(r1, a + da * (64 / r1), zOf(r1) + off), P3(r1, a - da * (64 / r1), zOf(r1) + off), [Math.cos(a), Math.sin(a), 2])
    }
  }

  const mats: Array<[Part, MaterialSpec]> = [
    [silver, finish('dome-silver', 0xd8dde2)],
    [blue, finish('dome-blue', 0x5d7494)],
    [skirt, finish('dome-skirt', 0xa9b8c8)],
    [win, PALETTE.window],
    [white, finish('dome-white', 0xe9ecee)],
    [neon, finish('neon-dome-cyan', 0x7cc6dc)],
  ]
  return mats.map(([part, material]) => ({ part, material }))
}

if (import.meta.main) {
  await writeLods('osaka-kyocera-dome', 'Kyocera Dome Osaka', { bearing: 0, elevation: 0, height: 83 }, [
    { file: 'osaka-kyocera-dome.glb', parts: build(false), maxTris: 6500, maxBytes: 250_000 },
    { file: 'osaka-kyocera-dome.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1536 * 1024 },
  ])
}
