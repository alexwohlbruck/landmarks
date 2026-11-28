/**
 * La Bombonera, Estadio Alberto J. Armando (Club Atlético Boca Juniors, La
 * Boca, Buenos Aires; opened 25 May 1940, the Palcos side built 1996) —
 * procedural, CC0-1.0, no textures.  bun generators/buenos-aires-la-bombonera.ts
 *
 * Map frame: x across the pitch (+x the Palcos side, east-north-east), y
 * along it (+y north-north-west), z up, metres. Placed at bearing 333.3: the
 * pitch's long side (OSM leisure=pitch way/105653198, 104.1 x 67.3 m, runs at
 * 153.3 / 333.3 deg). Anchor -58.364665, -34.635625: the pitch centre.
 *
 * What makes it itself: three steep, stacked stands in a U (a "D" in plan)
 * round the west side and both ends, closed on the east by the flat,
 * near-vertical wall of stacked boxes (the Palcos, OSM way/503647155, 6
 * levels); the blue and yellow paint: since 2023 a deep blue outside with
 * the curved knee-braces of the frames picked out in yellow, blue seats
 * with a yellow middle tier at the ends.
 *
 * Plan (OSM building=stadium way/369948707, in this frame): the stands'
 * inner edge runs x = -42 on the west side and y = +59 / -59 at the ends,
 * straight across the ends to the Palcos line x = 35; the outer wall x = -79,
 * y = +96 / -91. Drawn as offset superellipse quarters (half-axes 42 + d,
 * 59 + d, d out from the seat front) joined to straight end stands, made
 * symmetric about y = 0 (the north end is 4 m deeper in OSM). The Palcos
 * block is OSM's 10 x 113 m rectangle.
 *
 * Section, ESTIMATED from the aerials (aer01-aer11) and delso, scaled to a
 * rim of 36 m (no published height found; the planned 4th tier would take
 * it to "about 40 m", Minuto Uno 2026; the facade reads as about ten
 * storeys beside two-storey neighbours and cars in delso and aer01):
 *   lower tier  d 0-13,  z 1-11;  middle tier d 12-23, z 12-23;
 *   upper tier  d 22-36, z 24-35 (steep: about 38 deg, the famous rake);
 *   outer wall  d 37, frames every 4.5 deg, the yellow knee-brace band
 *   z 13-20, the dark open concourse band under it; Palcos 33 m.
 * Elevation 0: the field taken at street level (no published field level).
 *
 * Built (round 2, after review): the three tiers stepped (5, 6 and 7 rows
 * of terraces), a blue fascia over a dark slot at the front of the middle
 * and upper tiers; the middle tier yellow all round the U (aer01, aer11);
 * a thin navy canopy over the back rows on posts (aer01, aer03); outside,
 * one blue pier per bay (about 4.5 m), grouped window panels on the two
 * lower floors, and the yellow band as real struts: from each pier two
 * curved yellow knee-braces rise to the band's top beam mid-bay, over the
 * shaded concourse; the entrance tower with the crest panel in the middle
 * of the west side and the two stair blocks at the ends of the U. The
 * braces are drawn bolder (2.4 m) than real so they read at phone size.
 *
 * Evidence (all EVIDENCE):
 *  - OSM: stadium way/248598885 (leisure, Q499855), building way/369948707,
 *    Palcos way/503647155, pitch way/105653198.
 *  - Photos, Wikimedia Commons:
 *    - aer01, aer03, aer05, aer07, aer09, aer11: ProtoplasmaKid, "Vista aérea
 *      del Estadio Alberto J. Armando "La Bombonera" 01..11.jpg", CC BY-SA
 *      4.0 (2024-25): plan, tiers, colours, Palcos, floodlights, outside.
 *      https://commons.wikimedia.org/wiki/File:Vista_a%C3%A9rea_del_Estadio_Alberto_J._Armando_%22La_Bombonera%22_01.jpg
 *    - pk2025: ProtoplasmaKid, "La Bombonera 2025.jpg", CC BY-SA 4.0.
 *      https://commons.wikimedia.org/wiki/File:La_Bombonera_2025.jpg
 *    - delso: Diego Delso, "La Bombonera - Buenos Aires - Argentina.jpg", CC
 *      BY-SA 3.0 (before the 2023 repaint: the frames and knee-braces).
 *      https://commons.wikimedia.org/wiki/File:La_Bombonera_-_Buenos_Aires_-_Argentina.jpg
 *    - palcos: Nandofer18, "Palcos en 2012.JPG", CC BY-SA 4.0.
 *      https://commons.wikimedia.org/wiki/File:Palcos_en_2012.JPG
 *  - Published: es.wikipedia "Estadio Alberto J. Armando" (1940, Palcos
 *    1996, capacity 54,000).
 *  - No lidar, NAIP or Mapterhorn z13-15 tiles here. No commercial imagery.
 *
 * Not modelled: the murals and lettering (colour only), the scoreboard box
 * at the Palcos' north end is a plain box; the stairs, railings and
 * vomitories. Floodlights: lamp banks along the rim and the Palcos roof.
 * Doubts: every height (no published section); the field level.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { face, strip, beam, tube } from './seoul-world-cup-stadium'

const A0 = 42, B0 = 59, XE = 35 // inner half-axes; the Palcos line
const ex = (d: number) => 3.6 - (1.0 * Math.min(37, Math.max(0, d))) / 37
const se = (t: number, a: number, b: number, e: number) =>
  Math.pow(Math.pow(Math.abs(Math.cos(t) / a), e) + Math.pow(Math.abs(Math.sin(t) / b), e), -1 / e)

/**
 * The stands' path at offset d, as a polyline from the Palcos line at the
 * north (+y) round the west to the Palcos line at the south: a straight end
 * stand, the superellipse half, the other straight end stand.
 */
function path(d: number, m: number): Array<{ p: [number, number]; n: [number, number] }> {
  const a = A0 + d, b = B0 + d, e = ex(d)
  const out: Array<{ p: [number, number]; n: [number, number] }> = []
  const steps = 4
  for (let i = 0; i < steps; i++) out.push({ p: [XE - (XE * i) / steps, b], n: [0, 1] })
  for (let i = 0; i <= m; i++) {
    const t = Math.PI / 2 + (Math.PI * i) / m
    const r = se(t, a, b, e)
    const x = r * Math.cos(t), y = r * Math.sin(t)
    // normal of the superellipse |x/a|^e + |y/b|^e = 1
    const gx = Math.sign(x) * Math.pow(Math.abs(x / a), e - 1) / a, gy = Math.sign(y) * Math.pow(Math.abs(y / b), e - 1) / b
    const l = Math.hypot(gx, gy) || 1
    out.push({ p: [x, y], n: [gx / l, gy / l] })
  }
  for (let i = 1; i <= steps; i++) out.push({ p: [(XE * i) / steps, -b], n: [0, -1] })
  return out
}

/** Lofts a (d, z) profile along the open path; side +1 shows the left of an outgoing, rising profile. */
function loftProfile(p: Part, m: number, prof: [number, number][], side: 1 | -1, flat = false) {
  for (let i = 0; i < prof.length - 1; i++) {
    const [d0, z0] = prof[i], [d1, z1] = prof[i + 1]
    const nd = -(z1 - z0) * side, nz = (d1 - d0) * side
    const A = path(d0, m), B = path(d1, m)
    strip(p, A.map((q) => [q.p[0], q.p[1], z0] as V3), B.map((q) => [q.p[0], q.p[1], z1] as V3), (q) => {
      let best = A[0], bd = 1e9
      for (const c of A) { const dd = (c.p[0] - q[0]) ** 2 + (c.p[1] - q[1]) ** 2; if (dd < bd) { bd = dd; best = c } }
      return [best.n[0] * nd, best.n[1] * nd, nz]
    }, false, flat)
  }
}

/** Closes the stands' ends at the Palcos line with a flat wall following a (d, z) outline. */
function endWall(p: Part, outline: [number, number][], ySign: 1 | -1) {
  const pts: V3[] = outline.map(([d, z]) => [XE, ySign * (B0 + d), z])
  // fan from the bottom-inner corner; outline is ordered round the section
  for (let i = 1; i < pts.length - 1; i++) face(p, [pts[0], pts[i], pts[i + 1]], [1, 0, 0])
}

function build() {
  const blue = new Part(), yellow = new Part(), glazing = new Part(), grey = new Part(), lamps = new Part(), navy = new Part()
  const m = 24

  // --- The three tiers, stepped (aer01, aer11): lower blue, middle yellow, upper blue,
  // each tier's front a blue fascia over a dark slot (the boxes and gangway under it).
  const tier = (part: Part, d0: number, z0: number, d1: number, z1: number, steps: number) => {
    const dd = (d1 - d0) / steps, dz = (z1 - z0) / steps
    const prof: [number, number][] = [[d0, z0]]
    for (let s = 0; s < steps; s++) prof.push([d0 + s * dd, z0 + (s + 1) * dz], [d0 + (s + 1) * dd, z0 + (s + 1) * dz])
    loftProfile(part, 16, prof, 1, true)
  }
  loftProfile(grey, m, [[0, 0], [0, 1]], 1)
  tier(blue, 0, 1, 13, 10.5, 5)
  loftProfile(glazing, m, [[13, 10.5], [13, 11.2], [12, 11.2]], 1) // the slot under the middle tier
  loftProfile(blue, m, [[12, 11.2], [12, 12.6]], 1) // middle tier fascia
  tier(yellow, 12, 12.6, 23, 22.5, 6)
  loftProfile(glazing, m, [[23, 22.5], [23, 23.4], [22, 23.4]], 1)
  loftProfile(blue, m, [[22, 23.4], [22, 24.8]], 1) // upper tier fascia
  tier(blue, 22, 24.8, 36, 35, 7)
  loftProfile(blue, m, [[36, 35], [36, 36], [37.2, 36], [37.2, 34]], 1) // rim parapet

  // --- The canopy over the back rows (aer01, aer03): a thin blue roof on raking struts.
  loftProfile(navy, m, [[27, 39.4], [37.4, 38.2], [37.4, 37.6], [27, 38.8], [27, 39.4]], 1)
  for (const q of path(36.8, 12)) {
    if (q.p[0] > XE - 2) continue
    tube(navy, [q.p[0], q.p[1], 36], [q.p[0], q.p[1], 38.3], 0.3, 0.3, 3, false, false)
  }

  // --- Outside: blue frames (one pier per bay), the lower floors with grouped windows,
  // and the yellow band of curved knee-braces as real struts, dark concourse behind them.
  loftProfile(blue, m, [[36.6, 0], [36.6, 12.4]], -1)
  loftProfile(navy, m, [[36.0, 12.4], [36.0, 23.6]], -1) // the open concourse behind the braces, in shadow
  loftProfile(blue, m, [[36.6, 12.4], [36.0, 12.4]], 1)
  loftProfile(blue, m, [[36.0, 23.6], [36.6, 23.6]], 1)
  loftProfile(blue, m, [[36.6, 23.6], [36.6, 34]], -1)
  const P = path(37, 28)
  const okP = (q: { p: [number, number] }) => q.p[0] <= XE - 2
  const at = (q: { p: [number, number]; n: [number, number] }, out: number, z: number): V3 => [q.p[0] + q.n[0] * out, q.p[1] + q.n[1] * out, z]
  for (let i = 0; i < P.length; i++) {
    const q = P[i], o: V3 = [q.n[0], q.n[1], 0]
    if (!okP(q)) continue
    beam(blue, [at(q, 0.4, 0), at(q, 0.4, 35)], 1.4, 1.8, o)
    // grouped windows on the lower floors: two panels per bay
    const nx = P[i + 1]
    if (nx && okP(nx)) {
      for (const [za, zb] of [[2.5, 5.5], [7, 10.5]]) {
        const a = at(q, 0.06, za), b = at(nx, 0.06, za)
        const lerp3 = (u: V3, v: V3, f: number): V3 => [u[0] + (v[0] - u[0]) * f, u[1] + (v[1] - u[1]) * f, u[2]]
        const a1 = lerp3(a, b, 0.16), b1 = lerp3(a, b, 0.84)
        face(glazing, [a1, b1, [b1[0], b1[1], zb], [a1[0], a1[1], zb]], o)
      }
      // the knee-braces: from each pier at 12.6 m, a curved yellow strut rising to the band's top beam mid-bay, mirrored from the next pier
      const mid: V3 = [(q.p[0] + nx.p[0]) / 2, (q.p[1] + nx.p[1]) / 2, 0]
      const mn: [number, number] = [(q.n[0] + nx.n[0]) / 2, (q.n[1] + nx.n[1]) / 2]
      const top: V3 = [mid[0] + mn[0] * 0.6, mid[1] + mn[1] * 0.6, 22.6]
      for (const e of [q, nx]) {
        const f = at(e, 0.5, 12.8)
        const c1: V3 = [f[0] + (top[0] - f[0]) * 0.12, f[1] + (top[1] - f[1]) * 0.12, 18.4]
        const c2: V3 = [f[0] + (top[0] - f[0]) * 0.55, f[1] + (top[1] - f[1]) * 0.55, 19.8]
        beam(yellow, [f, c1, top], 2.4, 1.0, o)
      }
    }
  }
  // the band's top and bottom beams, yellow
  loftProfile(yellow, m, [[36.6, 22.6], [38.0, 22.6], [38.0, 23.8], [36.6, 23.8]], -1)
  loftProfile(yellow, m, [[36.6, 12.4], [37.9, 12.4], [37.9, 13.2], [36.6, 13.2]], -1)

  // the ends of the U, closed at the Palcos line
  const sect: [number, number][] = [[0, 0], [36.6, 0], [36.6, 36], [36, 36], [36, 35], [22, 24.8], [12, 12.6], [0, 1]]
  endWall(blue, sect, 1)
  endWall(blue, [...sect].reverse() as [number, number][], -1)
  // lamp banks along the rim
  for (let i = 2; i < P.length - 2; i += 4) {
    const q = path(36.6, 28)[i]
    if (!okP(q)) continue
    const c: V3 = [q.p[0] - q.n[0] * 2, q.p[1] - q.n[1] * 2, 40.4]
    tube(lamps, [c[0], c[1], c[2] - 0.6], [c[0], c[1], c[2] + 0.9], 1.0, 1.0, 4, true, true)
  }

  // --- Stair blocks: the entrance tower in the middle of the west side (aer03, the club crest),
  // and the two corner stair blocks at the ends of the U against the Palcos.
  const box = (p: Part, xa: number, xb: number, ya: number, yb: number, za: number, zb: number) => {
    face(p, [[xa, ya, zb], [xb, ya, zb], [xb, yb, zb], [xa, yb, zb]], [0, 0, 1])
    face(p, [[xa, ya, za], [xa, yb, za], [xa, yb, zb], [xa, ya, zb]], [-1, 0, 0])
    face(p, [[xb, ya, za], [xb, yb, za], [xb, yb, zb], [xb, ya, zb]], [1, 0, 0])
    face(p, [[xa, ya, za], [xb, ya, za], [xb, ya, zb], [xa, ya, zb]], [0, -1, 0])
    face(p, [[xa, yb, za], [xb, yb, za], [xb, yb, zb], [xa, yb, zb]], [0, 1, 0])
  }
  const xw = -(A0 + 37)
  box(blue, xw - 6, xw + 1, -7, 7, 0, 37)
  face(yellow, [[xw - 6.05, -5, 22], [xw - 6.05, 5, 22], [xw - 6.05, 5, 31], [xw - 6.05, -5, 31]], [-1, 0, 0]) // the crest panel
  for (const s of [1, -1]) {
    const y0 = s * (B0 + 30), y1 = s * (B0 + 39)
    box(blue, XE - 8, XE + 2, Math.min(y0, y1), Math.max(y0, y1), 0, 37)
  }

  // --- The Palcos: the flat stacked-box wall on the east side.
  const x0 = XE, x1 = 45, y0 = -56.8, y1 = 56.8, H = 33
  box(blue, x0 + 1.2, x1, y0, y1, 0, H)
  for (let k = 0; k < 5; k++) {
    const za = 9 + k * 4.6
    face(glazing, [[x0 + 1.15, y0 + 1.5, za], [x0 + 1.15, y1 - 1.5, za], [x0 + 1.15, y1 - 1.5, za + 3.6], [x0 + 1.15, y0 + 1.5, za + 3.6]], [-1, 0, 0])
  }
  face(blue, [[x0 - 6, y0, 0], [x0 - 6, y1, 0], [x0 + 1.2, y1, 6.5], [x0 + 1.2, y0, 6.5]], [-6.5, 0, 7.2])
  face(yellow, [[x0 - 6, y0, 0], [x0 - 6, y1, 0], [x0 - 6, y1, 1.0], [x0 - 6, y0, 1.0]], [-1, 0, 0])
  for (let k = 0; k < 6; k++) {
    const za = 3 + k * 4.8
    face(glazing, [[x1 + 0.05, y0 + 2, za], [x1 + 0.05, y1 - 2, za], [x1 + 0.05, y1 - 2, za + 2.4], [x1 + 0.05, y0 + 2, za + 2.4]], [1, 0, 0])
  }
  box(navy, x0 + 1.5, x1 - 0.5, 44, 56, H, H + 9)
  for (const y of [-50, -18, 18]) {
    tube(grey, [40, y, H], [40, y, H + 10], 0.5, 0.4, 4, false, false)
    box(lamps, 37.5, 39.5, y - 4, y + 4, H + 8, H + 12)
  }

  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: blue, material: { ...finish('boca-blue', 0x3c5ea6), floodlight: (_p, n) => (n[2] > 0.6 ? 0.1 : 0.7) } },
    { part: yellow, material: { ...finish('boca-yellow', 0xe8c446), floodlight: (_p, n) => (n[2] > 0.6 ? 0.1 : 0.8) } },
    { part: navy, material: finish('boca-navy', 0x34497a) },
    { part: glazing, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
    { part: grey, material: finish('bombonera-grey', 0xb9bcbf) },
    { part: lamps, material: { name: 'lamp', color: 0xe8e6e0, roughness: 0.5 } },
  ]
  return parts
}

if (import.meta.main) {
  const parts = build()
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(" "), triangles)
  if (triangles > 6500) throw new Error(`triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('La Bombonera', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 333.3, elevation: 0, height: 42,
  })
  if (glb.length > 250_000) throw new Error(`size budget exceeded: ${glb.length}`)
  const out = new URL('../models/buenos-aires-la-bombonera.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
