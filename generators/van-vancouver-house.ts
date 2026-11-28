/**
 * Vancouver House, 1480 Howe Street, Vancouver: procedural, CC0-1.0, no
 * textures.
 *   bun generators/van-vancouver-house.ts
 *
 * Bjarke Ingels Group's 2019 tower (59 floors, 150 m) at the Granville
 * Bridge ramps: a tower whose lower floors are cut back along a line
 * parallel to the ramps, the cut sweeping out floor by floor until the top
 * is the full rectangle, so the bridge side cantilevers out over the
 * ramps. White frames with dark recessed balconies stepping in a bond
 * pattern; the low podium buildings in the ramps' wedge.
 *
 * Map frame: x east', y north', z up, metres, turned to bearing 44.3 (the
 * long side of the tower's top, OSM way/1092241825). Anchor: the area
 * centroid of OSM way/742009401 (the site outline), lng -123.1309014,
 * lat 49.2749049. Elevation 0.
 *
 * Evidence
 *  - OSM (ODbL): way/742009401 (Vancouver House, apartments, Q55636956):
 *    the site, tower and the wedge along the ramps; way/1092241825 (part,
 *    height 157, 49 levels): the tower's top plan, a 28.7 x 43.2 m
 *    rectangle here. The ramps' line runs from (43.1, -51.4) to
 *    (-12.7, 63.4) in this frame (the outline's long edge).
 *  - Published (Wikipedia "Vancouver House"): 150 m, 59 floors, completed
 *    2019. The City's 2009 lidar predates it; heights are published and
 *    photo-scaled.
 *  - The cut's sweep, measured from haatu (side view, 7.1 px/m on the
 *    150 m height): the tower's width reads 33.8 m at 30 m up, 36.6 at 54,
 *    40.8 at 68, 43.7 at 82, 46.5 at 96, 48.6 at 110, 49.7 at 124 and 50
 *    at the top: drawn as a smoothstep from 20 m to 128 m. lund02
 *    (front-on from the Granville Bridge) shows the opposite side vertical
 *    the full height.
 *  - Photos (Wikimedia Commons, EVIDENCE):
 *    - haatu: Haatu, "Vancouver House - 22.jpg", CC BY 2.0.
 *      https://commons.wikimedia.org/wiki/File:Vancouver_House_-_22.jpg
 *    - lund02, lund04: Ken Lund, "Vancouver House, Vancouver, British
 *      Columbia 02 / 04 - Nov 30, 2019.jpg", CC BY-SA 2.0.
 *      https://commons.wikimedia.org/wiki/File:Vancouver_House,_Vancouver,_British_Columbia_02_-_Nov_30,_2019.jpg
 *      https://commons.wikimedia.org/wiki/File:Vancouver_House,_Vancouver,_British_Columbia_04_-_Nov_30,_2019.jpg
 *    - dxr: DXR, "Vancouver House, southwest view 20240831 1.jpg",
 *      CC BY-SA 4.0.
 *      https://commons.wikimedia.org/wiki/File:Vancouver_House,_southwest_view_20240831_1.jpg
 *  No commercial imagery.
 *
 * Estimated, and doubts:
 *  - The base: the cut at ground runs through the rectangle's south
 *    corner, parallel to the ramps (the real base is triangular; OSM maps
 *    only the top).
 *  - The facade (lead review 1): stacked two-floor bands, each a bold
 *    white slab edge 2.4 m deep over a band of dark glass set back 0.8 m,
 *    broken by 2 m white box ends about every 9 m, staggered band to band; alternate slabs stand 0.6 m prouder, and every band takes
 *    the plan at its own height, so the silhouette and the cantilevered
 *    face step band by band. The real steps are one floor each, and its
 *    balcony boxes also stagger along each floor (not drawn).
 *  - The podium wedge (the outline less the tower) is drawn 9 m tall,
 *    plain glass and white (no good photo of it; OSM's 9 levels look like
 *    the tower's).
 *  - Night: the balcony glazing is `window` and glows.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { area, cap, inset, panel, walls, type XY } from './chi-aon-center'

export const BEARING = 44.3
export const ANCHOR = { lng: -123.1309014, lat: 49.2749049 }
const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)

const SITE = ccw([[13.9, -28.5], [17.6, -28.8], [17.4, -51.0], [43.1, -51.4], [10.5, 15.9], [-12.7, 63.4], [-21.8, 63.4], [-22.6, 16.6], [-25.1, -28.7]])
const A: XY = [-22.6, -26.4], B: XY = [6.1, -26.4], C: XY = [6.1, 16.8], D: XY = [-22.6, 16.8]
const RAMP: XY = (() => { const d: XY = [-55.8, 114.8], l = Math.hypot(d[0], d[1]); return [d[0] / l, d[1] / l] })()
const N: XY = [RAMP[1], -RAMP[0]] // toward C
const dot = (p: XY) => p[0] * N[0] + p[1] * N[1]
const Z_TOP = 150, Z_POD = 9

/** The cut's sweep: 0 (through B) up to 20 m, 1 (the full rectangle) from 128 m. */
const sweep = (z: number) => { const t = Math.max(0, Math.min(1, (z - 20) / 108)); return t * t * (3 - 2 * t) }
/** The floor plan at height z: A, B, P (on BC), Q (on CD), D. */
function plan(z: number): XY[] {
  const d = dot(B) + sweep(z) * (dot(C) - dot(B))
  const py = Math.min(C[1], (d - N[0] * B[0]) / N[1]) // on x = 6.1
  const qx = Math.min(C[0], (d - N[1] * C[1]) / N[0]) // on y = 16.8
  return [A, B, [B[0], Math.max(B[1], py)], [qx, C[1]], D]
}

function build() {
  const white = new Part(), win = new Part(), roof = new Part(), pod = new Part(), podWin = new Part()

  // the podium wedge
  walls(pod, SITE, 0, Z_POD)
  cap(roof, SITE, Z_POD)
  for (let i = 0; i < SITE.length; i++) {
    const a = SITE[i], b = SITE[(i + 1) % SITE.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 6) continue
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * 0.05, a[1] + u[1] * s + n[1] * 0.05, z]
    podWin.quad(P(1, 1), P(L - 1, 1), P(L - 1, Z_POD - 2), P(1, Z_POD - 2))
  }

  // the tower (lead review 1): stacked two-floor bands, each a white slab
  // edge over recessed dark glass, the glass broken by white balcony piers
  // staggered band to band; each band takes the plan at its own height, so
  // the cantilever face steps out band by band like the real stacked boxes
  const H = 5.1, SLAB = 2.4, REC = 0.8
  const dedupe = (r: XY[]) => r.filter((q, i) => { const o = r[(i + 1) % r.length]; return Math.hypot(o[0] - q[0], o[1] - q[1]) > 0.4 })
  let band = 0
  for (let zb = Z_POD - 0.5; zb < Z_TOP - 0.5; zb += H, band++) {
    const zt = Math.min(Z_TOP, zb + H)
    const r0 = dedupe(plan(zb + H / 2))
    // alternate slabs stand 0.6 m prouder, so every edge steps like the stacked balconies
    const r = band % 2 ? inset(r0, -0.6) : r0
    const g = inset(r0, REC)
    // the white slab at the band's top, and its underside where it overhangs the glass
    walls(white, r, zt - SLAB, zt)
    cap(zt >= Z_TOP - 0.01 ? roof : white, r, zt)
    cap(white, r, zt - SLAB, false)
    // the recessed glass
    walls(win, g, zb, zt - SLAB)
    // white box ends breaking the glass about every 9 m, staggered band to band
    for (let i = 0; i < g.length; i++) {
      const a = g[i], b = g[(i + 1) % g.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 6) continue
      const n = Math.max(1, Math.round(L / 9)), w = L / n
      for (let q = 0; q < n; q++) {
        const sc = (q + (band % 2 ? 0.25 : 0.75)) * w
        panel(white, a, b, sc - 1.0, sc + 1.0, zb, zt - SLAB, 0.04)
      }
    }
  }

  return [
    { part: white, material: finish('vancouver-house-white', 0xeeede8) as MaterialSpec },
    { part: win, material: PALETTE.window as MaterialSpec },
    { part: roof, material: PALETTE.roof as MaterialSpec },
    { part: pod, material: PALETTE.stone as MaterialSpec },
    { part: podWin, material: windowVariant(2, 0x8fa9bb) as MaterialSpec },
  ]
}

if (import.meta.main) {
  const parts = build().filter((x) => x.part.triangles > 0)
  const tris = parts.reduce((s, x) => s + x.part.triangles, 0)
  const glb = writeGlb('Vancouver House', parts, { frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [ANCHOR.lat, ANCHOR.lng], bearing: BEARING })
  if (tris > 6500 || glb.length > 250_000) throw new Error(`budget: ${tris} triangles / ${glb.length} bytes`)
  const out = new URL('../models/van-vancouver-house.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}
