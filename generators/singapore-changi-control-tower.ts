/**
 * Changi Airport control tower (1981), between Terminals 1 and 2 and south of
 * Jewel: a plain round concrete shaft with a glazed slot up two sides, the
 * flared two-storey operations cab, the smaller glass visual control room
 * above it and the cream radome ball on top — procedural, CC0-1.0, no textures.
 *   bun generators/singapore-changi-control-tower.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at bearing
 * 23.1° (the airport grid), so the shaft's two glazed slots, which OSM maps as
 * slivers on its north-east and south-west sides, face model ±y. Anchor: the
 * centroid of OSM way/173010406, 103.9893323, 1.3591693.
 *
 * Evidence
 * - OSM (© OpenStreetMap contributors, ODbL): way/173010406 (Changi Control
 *   Tower, height 78, the cab's outline, r 13.3) and its parts: 319987004
 *   (shaft core, to 57 m), 738597396 (57–59, r 11.8, concrete), 738597391
 *   (59–62, r 11.5, glass #293F54), 738597393 (62–63, concrete), 738597392
 *   (63–67, r 12.8, glass), 533598051 (67–70, r 13.3, concrete), 738597394
 *   (70–74, r 8.7, glass), 166327057 (74–76, r 9.3, concrete), 738597395
 *   (76–78, mast, metal), 533598052 (78–81, dome, #B69D7F), 738597389 and
 *   738597390 (the glazed slots up the shaft).
 * - Photos (evidence):
 *   https://commons.wikimedia.org/wiki/File:Changi_Airport,_Control_Tower_5.JPG
 *     (Terence Ong, CC BY 2.5) the whole tower, side on: the proportions below;
 *   https://commons.wikimedia.org/wiki/File:Changi_airport_tower.jpg
 *     (Sam Wilson, CC BY-SA 4.0) from the north-west beside Jewel;
 *   https://commons.wikimedia.org/wiki/File:Changi_Airport_Control_Tower_(3187275465).jpg
 *     (edwin.11, CC BY 2.0) from Terminal 2;
 *   https://commons.wikimedia.org/wiki/File:WSSS_tower_20110731.jpg
 *     (gtknj, CC BY 2.0) from the Terminal 1 forecourt;
 *   https://commons.wikimedia.org/wiki/File:The_tower_at_Singapore%27s_Changi_Airport.jpg
 *     (Hanluga, CC BY-SA 4.0) from the north, down Airport Boulevard;
 *   https://commons.wikimedia.org/wiki/File:Singapore_Changi_Airport_with_Jewel_in_the_background.jpg
 *     (George Tan, CC BY 2.0) from the south.
 * - No lidar for Singapore.
 *
 * Numbers: the tier heights are OSM's (57, 59, 62, 63, 67, 70, 74, 76 m) and
 * agree with Ong's photo scaled to the cab's 26.6 m width (the flared cab is
 * 12.7 m tall in it). Estimated from that photo: the shaft's radius, 4.0 m
 * (OSM's 2.8 m part is the core; the shaft is a third of the cab's width), the
 * flare (r 10.9 at the bottom to 13.3 at the top), the sloped glass of the top
 * cab (r 7.8 → 9.2), and the radome, 7.5 m across, its top at about 84.5 m
 * (OSM's dome part says 78–81 m and r 1.7, which the photos contradict; the
 * height tag of 78 m is the cab roof's mast). Doubts: the radome height; the
 * antennas on the cab roof are left out; the base building at the foot of the
 * shaft is not in OSM's outline and is left out.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { finish } from './palette'

const unit = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: [V3, V3, V3, V3]) {
  p.tri(a, b, c, undefined, undefined, undefined, [n[0], n[1], n[2]])
  p.tri(a, c, d, undefined, undefined, undefined, [n[0], n[2], n[3]])
}

const N = 24 // facets round the tower

/**
 * A lathe through profile points (r, z), bottom to top; `smooth` shades it
 * round. Caps a closed top (r → 0) or bottom automatically by the profile.
 */
function lathe(p: Part, prof: [number, number][], n = N, smooth = true, phase = 0.5) {
  for (let i = 0; i < n; i++) {
    const a0 = (2 * Math.PI * (i + phase)) / n, a1 = (2 * Math.PI * (i + 1 + phase)) / n
    for (let k = 0; k < prof.length - 1; k++) {
      const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
      if (r0 < 1e-6 && r1 < 1e-6) continue
      const dr = r1 - r0, dz = z1 - z0
      const nn = (a: number): V3 => unit([Math.cos(a) * dz, Math.sin(a) * dz, -dr])
      const am = (a0 + a1) / 2
      const na = smooth ? nn(a0) : nn(am), nb = smooth ? nn(a1) : nn(am)
      const P = (r: number, a: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]
      if (r0 < 1e-6) p.tri(P(0, a0, z0), P(r1, a1, z1), P(r1, a0, z1), undefined, undefined, undefined, [na, nb, na])
      else if (r1 < 1e-6) p.tri(P(r0, a0, z0), P(r0, a1, z0), P(0, a0, z1), undefined, undefined, undefined, [na, nb, na])
      else quadN(p, P(r0, a0, z0), P(r0, a1, z0), P(r1, a1, z1), P(r1, a0, z1), [na, nb, nb, na])
    }
  }
}

/** Window panels on the facets of a cone band (r0 at z0 to r1 at z1), with piers between. */
function bandPanels(p: Part, r0: number, z0: number, r1: number, z1: number, n = N, pier = 0.16, out = 0.06) {
  for (let i = 0; i < n; i++) {
    const a0 = (2 * Math.PI * (i + pier / 2)) / n, a1 = (2 * Math.PI * (i + 1 - pier / 2)) / n
    // the facet plane between the lathe's corners (phase 0.5 → facet centred on i + 1/2... match lathe(phase 0))
    const am = (a0 + a1) / 2, dz = z1 - z0, dr = r1 - r0
    const nrm = unit([Math.cos(am) * dz, Math.sin(am) * dz, -dr])
    const F = (r: number, a: number, z: number): V3 => {
      // project onto the flat facet between the corner angles i and i+1
      const k = Math.cos(Math.PI / n) / Math.cos(a - am)
      return [r * k * Math.cos(a) + nrm[0] * out, r * k * Math.sin(a) + nrm[1] * out, z + nrm[2] * out]
    }
    const rc = (r: number) => r * Math.cos(Math.PI / n) // facet's inradius
    void rc
    quadN(p, F(r0, a0, z0), F(r0, a1, z0), F(r1, a1, z1), F(r1, a0, z1), [nrm, nrm, nrm, nrm])
  }
}

function build() {
  const conc = new Part(), glass = new Part(), slot = new Part(), ball = new Part(), pale = new Part()

  // --- The shaft ---
  const RS = 4.0
  lathe(conc, [[RS, 0], [RS, 57.2]], 20)
  // the glazed slots up the north-east and south-west faces (model ±y)
  for (const sg of [1, -1]) {
    const w = 0.8, y = sg * (RS + 0.05)
    const a: V3 = [-w, y, 3], b: V3 = [w, y, 3], c: V3 = [w, y, 56.5], d: V3 = [-w, y, 56.5]
    const n: V3 = [0, sg, 0]
    if (sg > 0) quadN(slot, b, a, d, c, [n, n, n, n]); else quadN(slot, a, b, c, d, [n, n, n, n])
  }

  // --- The operations cab: a flat soffit disc, then the flared glazed tiers ---
  lathe(conc, [[0, 56.8], [10.2, 56.8], [10.2, 58.2], [10.4, 58.2]], N, false, 0) // soffit
  // flare: the glazed tiers lean out, r 10.4 @58.2 → 12.6 @67.4, under an overhanging rim
  const flare = (z: number) => 10.4 + ((z - 58.2) * (12.6 - 10.4)) / (67.4 - 58.2)
  lathe(conc, [[10.4, 58.2], [12.6, 67.4], [13.3, 67.4], [13.3, 69.6], [10.5, 70.6], [0, 70.6]], N, false, 0)
  // the two glazed bands, with the sloped fins showing as piers
  bandPanels(glass, flare(59.4), 59.4, flare(62.0), 62.0)
  bandPanels(glass, flare(63.3), 63.3, flare(67.4), 67.4)
  // the ledge between them, a little proud
  lathe(pale, [[flare(62.2) + 0.35, 62.2], [flare(62.2) + 0.35, 63.0], [flare(62.2), 63.0]], N, false, 0)

  // --- The visual control room: sloped glass, a roof disc ---
  lathe(glass, [[7.8, 70.6], [9.2, 74.0]], N, false, 0)
  lathe(conc, [[0, 70.6], [7.8, 70.6]], N, false, 0)
  lathe(pale, [[0, 74.0], [9.2, 74.0], [9.5, 74.4], [9.5, 75.4], [8.6, 76.0], [0, 76.0]], N, false, 0)

  // --- The radome on its neck ---
  lathe(conc, [[3.0, 75.9], [3.0, 77.6], [0, 77.6]], 16)
  const RB = 3.75, ZB = 80.75, prof: [number, number][] = []
  for (let k = 0; k <= 10; k++) { const t = -Math.PI / 2 + (Math.PI * k) / 10; prof.push([RB * Math.cos(t), ZB + RB * Math.sin(t)]) }
  prof[0][0] = 0; prof[prof.length - 1][0] = 0
  lathe(ball, prof, 16)

  return [
    { part: conc, material: finish('changi-tower-concrete', 0xdcdbd7) as MaterialSpec },
    { part: pale, material: finish('changi-tower-trim', 0xf1efea) as MaterialSpec },
    { part: glass, material: { name: 'window', color: 0x5f7b93, roughness: 0.35 } as MaterialSpec },
    { part: slot, material: { name: 'window-2', color: 0x4d7d9c, roughness: 0.35 } as MaterialSpec },
    { part: ball, material: finish('changi-radome', 0xd4b582) as MaterialSpec },
  ]
}

if (import.meta.main) {
  const parts = build()
  const tris = parts.reduce((t, { part }) => t + part.triangles, 0)
  const glb = writeGlb('Changi Airport Control Tower', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 23.1, osm: 'way/173010406', height: 84.5,
  })
  console.log(`singapore-changi-control-tower.glb: ${tris} triangles, ${glb.length} bytes`)
  if (tris > 5000 || glb.length > 250_000) throw new Error('over budget')
  Bun.write(new URL('../models/singapore-changi-control-tower.glb', import.meta.url).pathname, glb)
}
