/**
 * Pauley Pavilion (1965, Welton Becket; renovated 2012), UCLA, Westwood —
 * original procedural geometry, CC0-1.0.
 *
 *   bun generators/la-pauley-pavilion.ts
 *
 * Frame: x east, y north, z up, metres; bearing 0 (the hall is square to
 * the compass within a degree). Origin at the area centroid of OSM
 * way/422876622, on the ground (117.2 m NAVD88; the site is flat to 0.3 m,
 * USGS 3DEP).
 *
 * What makes it Pauley: a big, low, almost flat hipped roof on a thin roof
 * edge, the ring of white steel V-trusses standing in a shadowed band
 * under that edge, and below it the 2012 concourse wrapped round all four
 * sides: tan panels alternating with tall glass bays that lean out towards
 * the top, over a deep canopy and a glazed ground floor.
 *
 * Evidence
 * - Plan: OSM way/422876622 (with the 2012 additions, x -63..65,
 *   y -56..55 about the centroid). The lidar puts the north edge 2-3 m
 *   south of OSM; the model follows the lidar.
 * - Heights: USGS 3DEP USGS_LPC_CA_LosAngeles_2016_LAS_2018 (2016 flight,
 *   after the 2012 renovation), 1 m grid, over ground 117.2 m:
 *   the roof edge 16.3 m round x -59..57, y -46..38; the hipped roof
 *   rising about 0.1 in 1 to a ridge of 19.9 m along x -17..15 at y -4
 *   (OSM height 20.4); the concourse roofs 11.2 m out to x -63 / 62 and
 *   y -54 / 50 (drawn at 10.2 m: the truss band in the photos starts at
 *   the top of the wall, below the concourse parapet and coping, which
 *   is what the lidar's flat 11.2 m reads); the truss band shows as a 12 m sawtooth between 10 and
 *   14.6 m along the edges.
 * - Photos (Wikimedia Commons), compared with renders from the same side:
 *   c1 "Colorful at Sunset - Collage" (Josh Lee, CC BY-SA 3.0, Nov 2012),
 *      bottom panel: the north side after the renovation: truss band, the
 *      tan panels and leaning glass bays, the canopy, the glazed ground
 *      floor;
 *   c2 "Pauley Pavilion, exterior" and c3 "Pauley Pavilion (Los Angeles,
 *      USA)" (Alton, CC BY 3.0, Jan 2008): the north side before the
 *      renovation: roof, roof edge and truss band, which the renovation
 *      kept;
 *   c4 "PauleyPavilionExterior" (Minnaert, CC BY-SA 3.0, 2008): the truss
 *      geometry and the beige concrete, close up;
 *   URLs: https://commons.wikimedia.org/wiki/File:Colorful_at_Sunset_-_Collage.jpg
 *   https://commons.wikimedia.org/wiki/File:Pauley_Pavilion,_exterior.JPG
 *   https://commons.wikimedia.org/wiki/File:Pauley_Pavilion_(Los_Angeles,_USA).JPG
 *   https://commons.wikimedia.org/wiki/File:PauleyPavilionExterior.jpg
 *   USGS NAIP: the white roof (with a painted UCLA script, left out), the concourse
 *   roofs.
 * - Colour: roof from NAIP and c2 (off-white); trusses white; concourse
 *   panels the warm tan of c1; glass dark grey-blue.
 * Look-only (Flickr, CC BY-NC-SA 2.0): afagen "Edwin W. Pauley Pavilion"
 * (2013, https://www.flickr.com/photos/51035749109@N01/10126573045): the
 * glazed entrance at night, its leaning mullions and the lit concourse.
 * Nothing is shaped from it; it confirms the night look (the concourse
 * glass glows).
 *
 * Estimated: the canopy height (4.3-4.9 m) and depth, the lean of the
 * skin (1.2 m), the layout of glass and panel bays on each side (c1 shows
 * the north side only; the others repeat it), the truss member size and
 * the depth of the shadowed band behind the trusses.
 * Left out: the painted UCLA script on the roof (seen in NAIP, but at
 * 0.21 m pixels it cannot be traced and no licensed photo shows its
 * letterforms, so drawing it would mean inventing them), the "Edwin W. Pauley Pavilion" letters, roof equipment.
 * - Colour, second pass: the concourse glass is the near-black grey-blue
 *   of the photos with pale mullion fins about 2 m apart; the tan panels
 *   are the 2012 photo's tan corrected for its sunset light; the band
 *   behind the trusses is the light grey soffit of the 2008 photos.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, rect, prism, cap, hipRoof, save } from './la-getty-center'

const roof = new Part(), tan = new Part(), trim = new Part(), dark = new Part(), win = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
/** A quad wound so its face points along `out`. */
function oq(p: Part, a: V3, b: V3, c: V3, d: V3, out: V3) {
  const n = cross(sub(b, a), sub(c, a))
  if (dot(n, out) >= 0) p.quad(a, b, c, d)
  else p.quad(a, d, c, b)
}
/** A square-section beam from a to b, `w` thick, its sides facing out. */
export function beam(p: Part, a: V3, b: V3, w: number, up: V3 = [0, 0, 1]) {
  const ax = sub(b, a), L = Math.hypot(...ax)
  const t: V3 = [ax[0] / L, ax[1] / L, ax[2] / L]
  let u = cross(t, up)
  if (Math.hypot(...u) < 1e-6) u = cross(t, [1, 0, 0])
  const ul = Math.hypot(...u); u = [u[0] / ul * w / 2, u[1] / ul * w / 2, u[2] / ul * w / 2]
  let v = cross(u, t); const vl = Math.hypot(...v); v = [v[0] / vl * w / 2, v[1] / vl * w / 2, v[2] / vl * w / 2]
  const off = (q: V3, s: number, r: number): V3 => [q[0] + u[0] * s + v[0] * r, q[1] + u[1] * s + v[1] * r, q[2] + u[2] * s + v[2] * r]
  const ring: [number, number][] = [[1, 1], [-1, 1], [-1, -1], [1, -1]]
  for (let i = 0; i < 4; i++) {
    const [s0, r0] = ring[i], [s1, r1] = ring[(i + 1) % 4]
    const out: V3 = [u[0] * (s0 + s1) + v[0] * (r0 + r1), u[1] * (s0 + s1) + v[1] * (r0 + r1), u[2] * (s0 + s1) + v[2] * (r0 + r1)]
    oq(p, off(a, s0, r0), off(a, s1, r1), off(b, s1, r1), off(b, s0, r0), out)
  }
  oq(p, ...(ring.map(([s, r]) => off(a, s, r)) as [V3, V3, V3, V3]), [-t[0], -t[1], -t[2]])
  oq(p, ...(ring.map(([s, r]) => off(b, s, r)) as [V3, V3, V3, V3]), t)
}

// ---------------------------------------------------------------------------
// Plan (lidar): the hall's roof edge H, the concourse's outer line O.
const H = { x0: -59, x1: 57, y0: -46, y1: 38 }
const O = { x0: -63, x1: 62, y0: -54, y1: 50 }
const Z_CANOPY = 4.3, Z_CANOPY_TOP = 4.9, Z_CONC = 10.2, Z_EDGE0 = 15.9, Z_EDGE = 16.5, Z_RIDGE = 19.9
const LEAN = 1.2, RECESS = 2.6

/** The four sides of a rectangle, counter-clockwise: start, end, outward normal. */
function sides(r: { x0: number; x1: number; y0: number; y1: number }): [XY, XY, XY][] {
  return [
    [[r.x0, r.y0], [r.x1, r.y0], [0, -1]],
    [[r.x1, r.y0], [r.x1, r.y1], [1, 0]],
    [[r.x1, r.y1], [r.x0, r.y1], [0, 1]],
    [[r.x0, r.y1], [r.x0, r.y0], [-1, 0]],
  ]
}
const ins = (r: typeof O, d: number) => ({ x0: r.x0 + d, x1: r.x1 - d, y0: r.y0 + d, y1: r.y1 - d })

// ---------- ground floor: glazing behind the canopy, between off-white concrete piers (the 1965 base) ----------
{
  const G = ins(O, RECESS)
  prism(win, null, rect(G.x0, G.y0, G.x1, G.y1), 0, Z_CANOPY, { corner: 0.2, bevel: 0 })
  for (const [a, b, n] of sides(G)) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.round(L / 8.5)
    for (let i = 0; i <= k; i++) {
      const s = i / k, cx = a[0] + (b[0] - a[0]) * s + n[0] * 0.25, cy = a[1] + (b[1] - a[1]) * s + n[1] * 0.25
      const hx = n[0] ? 0.4 : 0.8, hy = n[1] ? 0.4 : 0.8
      prism(trim, null, rect(cx - hx, cy - hy, cx + hx, cy + hy), 0, Z_CANOPY, { corner: 0.1, bevel: 0 })
    }
  }
}

// ---------- the canopy: a deep slab round the building ----------
{
  const C = ins(O, -1.3), G = ins(O, RECESS)
  const z0 = Z_CANOPY, z1 = Z_CANOPY_TOP
  // four slabs, mitred at the corners by overlapping
  for (const r of [
    rect(C.x0, C.y0, C.x1, G.y0), rect(C.x0, G.y1, C.x1, C.y1),
    rect(C.x0, G.y0, G.x0, G.y1), rect(G.x1, G.y0, C.x1, G.y1),
  ]) prism(dark, dark, r, z0, z1, { corner: 0.15, bevel: 0.15, bottom: dark })
}

// ---------- the 2012 concourse skin: leaning out from the canopy to the roof ----------
// Layout along each side, as fractions: tan panels and glass bays, from c1.
const LONG: [number, 'tan' | 'glass'][] = [[8, 'tan'], [18, 'glass'], [10, 'tan'], [8, 'glass'], [12, 'tan'], [8, 'glass'], [10, 'tan'], [18, 'glass'], [8, 'tan']]
const SHORT: [number, 'tan' | 'glass'][] = [[12, 'tan'], [24, 'glass'], [20, 'tan'], [24, 'glass'], [12, 'tan']]
{
  const z0 = Z_CANOPY_TOP, z1 = Z_CONC
  const B = ins(O, LEAN)
  // the leaning walls (a frustum): bottom ring B at z0, top ring O at z1
  const ring = (r: typeof O, z: number): V3[] => [[r.x0, r.y0, z], [r.x1, r.y0, z], [r.x1, r.y1, z], [r.x0, r.y1, z]]
  const rb = ring(B, z0), rt = ring(O, z1)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const [, , n] = sides(O)[i]
    const out: V3 = [n[0], n[1], 0.2]
    const isLong = i % 2 === 0
    const lay = isLong ? LONG : SHORT
    const total = lay.reduce((s, [w]) => s + w, 0)
    let acc = 0
    // the wall itself is cut into the bays: tan bays are tan wall, glass bays glass
    for (const [w, kind] of lay) {
      const s0 = acc / total, s1 = (acc + w) / total
      acc += w
      const P = (s: number, top: boolean): V3 => {
        const A = top ? rt[i] : rb[i], Bp = top ? rt[j] : rb[j]
        return [A[0] + (Bp[0] - A[0]) * s, A[1] + (Bp[1] - A[1]) * s, A[2]]
      }
      if (kind === 'tan') oq(tan, P(s0, false), P(s1, false), P(s1, true), P(s0, true), out)
      else {
        oq(win, P(s0, false), P(s1, false), P(s1, true), P(s0, true), out)
        // tan mullion fins at the edges of a glass bay and one in its middle: real, 0.5 m deep
        // tan fins at the bay's edges, slim pale mullion fins about 4 m apart between
        const segLen = (s1 - s0) * Math.hypot(rt[j][0] - rt[i][0], rt[j][1] - rt[i][1]), m = Math.max(1, Math.round(segLen / 2))
        for (let q = 0; q <= m; q++) {
          const s = s0 + ((s1 - s0) * q) / m, edge = q === 0 || q === m
          const b = P(s, false), t = P(s, true)
          beam(edge ? tan : trim, [b[0] + n[0] * 0.2, b[1] + n[1] * 0.2, b[2]], [t[0] + n[0] * 0.2, t[1] + n[1] * 0.2, t[2]], edge ? 0.6 : 0.25)
        }
      }
    }
  }
  // the concourse roof
  cap(roof, rect(O.x0, O.y0, O.x1, O.y1), Z_CONC)
  // a slim coping on its edge
  for (const [a, b, n] of sides(O)) {
    const A: V3 = [a[0] + n[0] * 0.2, a[1] + n[1] * 0.2, Z_CONC + 0.2], Bv: V3 = [b[0] + n[0] * 0.2, b[1] + n[1] * 0.2, Z_CONC + 0.2]
    beam(trim, A, Bv, 0.6)
  }
}

// ---------- the shadowed band behind the trusses ----------
{
  const R = ins(H, RECESS)
  prism(dark, null, rect(R.x0, R.y0, R.x1, R.y1), Z_CONC, Z_EDGE0 + 0.1, { corner: 0.2, bevel: 0 })
}

// ---------- the white V-trusses, a zigzag round the roof edge ----------
for (const [a, b, n] of sides(H)) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.round(L / 11.8)
  const at = (s: number, z: number): V3 => [a[0] + (b[0] - a[0]) * s + n[0] * -0.6, a[1] + (b[1] - a[1]) * s + n[1] * -0.6, z]
  const zb = Z_CONC + 0.35, zt = Z_EDGE0 - 0.15
  for (let i = 0; i < k; i++) {
    const s0 = i / k, sm = (i + 0.5) / k, s1 = (i + 1) / k
    beam(trim, at(s0, zb), at(sm, zt), 1.1)
    beam(trim, at(sm, zt), at(s1, zb), 1.1)
  }
  // the bottom chord on the concourse roof
  beam(trim, at(0, zb - 0.1), at(1, zb - 0.1), 0.7)
}

// ---------- the roof edge and the low hipped roof ----------
prism(trim, null, rect(H.x0, H.y0, H.x1, H.y1), Z_EDGE0, Z_EDGE, { corner: 0.4, bevel: 0.25, bottom: trim })
hipRoof(roof, rect(H.x0 + 0.25, H.y0 + 0.25, H.x1 - 0.25, H.y1 - 0.25), Z_EDGE, Z_RIDGE - Z_EDGE)

if (import.meta.main) {
  save('la-pauley-pavilion', 'Pauley Pavilion', [
    { part: roof, material: finish('pauley-roof', 0xdcdad3) },
    { part: tan, material: finish('pauley-tan', 0xcbbfac) },
    { part: trim, material: PALETTE.trim },
    { part: dark, material: finish('pauley-soffit', 0xbdb9b2) },
    { part: win, material: { ...PALETTE.window, color: 0x4f5d69 } },
  ], { bearing: 0, elevation: 0, height: Z_RIDGE, replaces: ['way/422876622'] })
}
