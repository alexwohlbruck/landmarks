/**
 * The New York Marriott Marquis screen (2014), the wraparound LED billboard
 * on the hotel's podium at 1535 Broadway, Times Square, between West 45th
 * and West 46th Streets on the west side of Broadway. Procedural, CC0-1.0.
 *   bun generators/nyc-marriott-marquis-screen.ts
 *
 * Signage only. The hotel stays the map's own OSM extrusion (way/163474780,
 * "New York Marriott Marquis", no height tag; its Broadway parts are
 * way/261748059 35 m at the 45th St corner, way/261748055 40 m with the
 * glass drum's bulge, way/261748058 35 m at the 46th St corner, and the
 * 160 m slabs way/261748069 and way/261748068 behind the side streets), so
 * the model replaces nothing. It is a single LED cabinet that follows that
 * outline just outside it: from the jog on 45th St (outline vertex 29),
 * round the 45th St corner, up the whole Broadway face (round the drum's
 * bulge, vertices 2-12, which the OSM outline and the 40 m part carry to the
 * ground) and round the 46th St corner, then 24 m west along 46th St to
 * where the 2017 lidar shows the hotel's 42 m podium on 46th St ending. The
 * cabinet's back is the outline offset 0.35 m outward (round joins at
 * convex corners, mitred at concave ones, so every point of the back is at
 * least 0.35 m outside the outline); its LED face is 0.85 m further out.
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * middle of the Broadway face, halfway between outline vertices 0 and 14
 * (-73.9856282, 40.7584116); the outline below is the OSM way in that frame
 * (equirectangular about the anchor). y = 0 is the cabinet's underside,
 * 9.3 m above the street, so the placement carries `elevation` 9.3: the
 * screen hangs on the hotel's wall, which the map draws, over the
 * storefronts.
 *
 * Published (Clear Channel Outdoor's release as sales agent, and ABC7 New
 * York, "Huge digital Times Square billboard ready to glow", Nov 2014): the
 * display is 77.69 ft by 329.65 ft (23.7 m by 100.5 m), about 25,000 sq ft,
 * on the whole block front at 1535 Broadway between 45th and 46th St; built
 * by Vornado and switched on in November 2014.
 * https://investor.clearchannel.com/news/detail/181/
 * https://abc7ny.com/led-times-square-marriot-marquis-hotel-new-york-city/398598
 * Measured: the run along the outline, 98 m (8.7 m on 45th St, 59 m on
 * Broadway with the bulge, 3 m of corner chamfer, 24 m on 46th St), which
 * lands on the published 100 m. The 46th St run ends where the 42 m wall
 * in the USGS NY_NewYorkCity lidar (2017, 0.5 m grid) ends.
 * Estimated from p1 (frontal, Broadway) and p2 (from the south-east), with
 * the storefront storey as the scale and the published 23.7 m as the total:
 * the cabinet from 9.3 m to 35.0 m (the corner parts' OSM height); a lower
 * band of screens 9.5-19.4 m, a dark mullion 19.4-20.1 m, the upper screen
 * 20.1-33.2 m (9.5-33.2 m = 23.7 m) and the black cap band (where the small
 * MARRIOTT MARQUIS logos sit) 33.2-35.0 m. The lower band
 * is several screens, split by dark mullions; the upper is one screen.
 * The cabinet depth (0.85 m) is invented, as LED cabinets go.
 *
 * Night: the screens show rotating ads, so they carry no lettering and no
 * imagery; they are drawn as the bold colour blocks they read as from a
 * distance, each a `neon-*` material that glows in its own colour: the
 * upper band white along Broadway and amber on the two street wraps; the
 * lower band blue at the 45th St end, white in the middle and T-Mobile
 * magenta from the drum to the 46th St corner and along 46th St, where
 * T-Mobile's store has kept its screens since 2017 (p1, p2). Mullions,
 * cap and cabinet are dark.
 *
 * Photos (all EVIDENCE):
 * - p1 "Marriott Marquis Hotel", Prayitno, CC BY 2.0 (Flickr 38358498371),
 *   frontal across Broadway, Jan 2017: the two bands, the cap, the corners.
 *   https://www.flickr.com/photos/34128007@N04/38358498371
 * - p2 "New York Marriott Marquis (54077363060).jpg", CC BY 2.0, Oct 2024,
 *   from the south-east: both wraps and the drum over the cap.
 *   https://commons.wikimedia.org/wiki/File:New_York_Marriott_Marquis_(54077363060).jpg
 * - p3 "W 46th St Duffy Square 11 - Marriott Marquis.jpg", Tdorante10,
 *   CC BY-SA 4.0, 2018, from the north-east: the upper band and cap.
 *   https://commons.wikimedia.org/wiki/File:W_46th_St_Duffy_Square_11_-_Marriott_Marquis.jpg
 * - p4 "Times Sq Nov 2021 23.jpg", Epicgenius, CC BY-SA 4.0: the drum and
 *   the cap band. https://commons.wikimedia.org/wiki/File:Times_Sq_Nov_2021_23.jpg
 * - n1 "Times Square - New York, NY, USA - August 2015 13.jpg", Giorgio
 *   Galeotti, CC BY 4.0: night, from the TKTS stairs, the 46th St wrap lit.
 *   https://commons.wikimedia.org/wiki/File:Times_Square_-_New_York,_NY,_USA_-_August_2015_13.jpg
 *
 * Doubts: the real screen runs flat under the drum, which cantilevers over
 * it; OSM carries the drum's bulge to the ground, so the cabinet bows out
 * round it (4.5 m over 19 m) to stay outside the map's extrusion. The
 * corners are drawn tighter than the real rounded wraps, for the same
 * reason. Band heights are photo-scaled (+-1.5 m). The lidar shows the
 * thin cabinet poorly and could not confirm its top. The colour split is a
 * choice; the real screens change every few seconds.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

export type P2 = [number, number]

/** Arc length at every chain vertex. */
function chainLengths(chain: P2[]) {
  const s = [0]
  for (let i = 1; i < chain.length; i++) s.push(s[i - 1] + Math.hypot(chain[i][0] - chain[i - 1][0], chain[i][1] - chain[i - 1][1]))
  return s
}

/** The chain with extra vertices at the given arc lengths (no turn there). */
export function splitChain(chain: P2[], cuts: number[]): P2[] {
  const s = chainLengths(chain)
  const out: P2[] = [chain[0]]
  for (let i = 1; i < chain.length; i++) {
    for (const c of [...cuts].sort((a, b) => a - b)) {
      if (c > s[i - 1] + 0.05 && c < s[i] - 0.05) {
        const t = (c - s[i - 1]) / (s[i] - s[i - 1])
        out.push([chain[i - 1][0] + (chain[i][0] - chain[i - 1][0]) * t, chain[i - 1][1] + (chain[i][1] - chain[i - 1][1]) * t])
      }
    }
    out.push(chain[i])
  }
  return out
}

/**
 * An open chain of a counter-clockwise outline (so its outside is on the
 * right), offset outward by `d`: round joins at convex corners, mitred at
 * concave ones, so every point is at least `d` outside the outline. The
 * vertex count depends only on the chain, so offsets at two distances pair
 * up point for point. `s` is each point's arc length along the chain.
 */
export function offsetChain(chain: P2[], d: number, stepDeg = 15): { pts: P2[]; s: number[] } {
  const sc = chainLengths(chain)
  const pts: P2[] = [], s: number[] = []
  const tan = (i: number): P2 => {
    const a = chain[i], b = chain[i + 1], l = Math.hypot(b[0] - a[0], b[1] - a[1])
    return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]
  }
  const right = (t: P2): P2 => [t[1], -t[0]]
  const n = chain.length
  for (let i = 0; i < n; i++) {
    const c = chain[i]
    if (i === 0 || i === n - 1) {
      const r = right(tan(i === 0 ? 0 : n - 2))
      pts.push([c[0] + r[0] * d, c[1] + r[1] * d]); s.push(sc[i])
      continue
    }
    const t0 = tan(i - 1), t1 = tan(i)
    const cr = t0[0] * t1[1] - t0[1] * t1[0], dot = t0[0] * t1[0] + t0[1] * t1[1]
    const turn = Math.atan2(cr, dot)
    const n0 = right(t0), n1 = right(t1)
    if (turn > 1e-4) {
      // convex: an arc about the corner, from n0 round to n1
      const a0 = Math.atan2(n0[1], n0[0])
      const k = Math.max(1, Math.ceil(turn / ((stepDeg * Math.PI) / 180)))
      for (let j = 0; j <= k; j++) {
        const a = a0 + (turn * j) / k
        pts.push([c[0] + Math.cos(a) * d, c[1] + Math.sin(a) * d]); s.push(sc[i])
      }
    } else {
      // concave or straight: where the two offset lines meet
      const m: P2 = [n0[0] + n1[0], n0[1] + n1[1]], ml = Math.hypot(m[0], m[1])
      const cosHalf = Math.cos(turn / 2)
      pts.push([c[0] + (m[0] / ml) * (d / cosHalf), c[1] + (m[1] / ml) * (d / cosHalf)]); s.push(sc[i])
    }
  }
  return { pts, s }
}

/** One horizontal band of a cabinet's face; `pick` chooses its part by chain position. */
export type Band = { z0: number; z1: number; pick: (s: number) => Part }

/**
 * A sign cabinet along an outline chain: its back `d0` and face `d1`
 * outside the outline, from z0 to z1, the face in `bands`, the back, top,
 * underside and ends in `body`.
 */
export function cabinet(chain: P2[], d0: number, d1: number, z0: number, z1: number, bands: Band[], body: Part) {
  const B = offsetChain(chain, d0), F = offsetChain(chain, d1)
  const at = (p: P2, z: number): V3 => [p[0], p[1], z]
  const m = B.pts.length
  for (let i = 0; i < m - 1; i++) {
    const b0 = B.pts[i], b1 = B.pts[i + 1], f0 = F.pts[i], f1 = F.pts[i + 1]
    const sm = (B.s[i] + B.s[i + 1]) / 2
    for (const band of bands) band.pick(sm).quad(at(f0, band.z0), at(f1, band.z0), at(f1, band.z1), at(f0, band.z1))
    body.quad(at(b1, z0), at(b0, z0), at(b0, z1), at(b1, z1)) // back, facing the wall
    body.quad(at(f0, z1), at(f1, z1), at(b1, z1), at(b0, z1)) // top
    body.quad(at(b0, z0), at(b1, z0), at(f1, z0), at(f0, z0)) // underside
  }
  const e0b = B.pts[0], e0f = F.pts[0], e1b = B.pts[m - 1], e1f = F.pts[m - 1]
  body.quad(at(e0b, z0), at(e0f, z0), at(e0f, z1), at(e0b, z1))
  body.quad(at(e1f, z0), at(e1b, z0), at(e1b, z1), at(e1f, z1))
}

// ------------------------------------------------------------ the host outline
/** OSM way/163474780 in the model frame (vertex 0 = 30, closed). */
export const MARRIOTT_OUTLINE: P2[] = [[-8.37, -28.51], [-4.71, -16.03], [-2.34, -7.98], [-0.14, -6.93], [2.07, -5.31], [3.44, -3.79],
  [4.47, -2.19], [5.41, 0.13], [5.80, 2.29], [5.78, 4.69], [5.31, 6.88], [4.37, 8.94], [3.24, 10.74], [4.49, 15.30], [8.37, 28.51],
  [5.89, 30.22], [-58.91, 65.64], [-67.00, 70.00], [-73.73, 57.71], [-78.66, 60.35], [-85.96, 47.20], [-106.78, 58.67],
  [-108.45, 55.67], [-114.89, 44.06], [-103.98, 38.03], [-110.84, 25.70], [-88.38, 13.39], [-46.17, -9.68], [-16.82, -25.74],
  [-15.96, -24.24], [-8.37, -28.51]]

/** The cabinet's chain: vertex 29 on 45th St, round to 24 m along 46th St. */
function marriottChain(): P2[] {
  const O = MARRIOTT_OUTLINE
  const along = (a: P2, b: P2, d: number): P2 => {
    const l = Math.hypot(b[0] - a[0], b[1] - a[1])
    return [a[0] + ((b[0] - a[0]) / l) * d, a[1] + ((b[1] - a[1]) / l) * d]
  }
  // start 0.6 m past the jog at vertex 29, so the cabinet's end clears the jog's wall
  return [along(O[29], O[0], 0.6), ...O.slice(0, 16), along(O[15], O[16], 24)]
}

if (import.meta.main) {
  const ZB = 9.3 // the cabinet's underside above the street = the placement's elevation
  const D0 = 0.35, D1 = 1.2
  const base = marriottChain()
  const L = chainLengths(base)
  // block edges at concave corners: the drum's south and north ends (vertices 2 and 12), the 46th St corner (15)
  const S2 = L[3], S12 = L[13], S15 = L[16]
  const MULL = 0.3 // half a mullion between lower screens
  const lowerCuts = [S2, (S2 + S12) / 2, S12, S15 - 7]
  const chain = splitChain(base, lowerCuts.flatMap(c => [c - MULL, c + MULL]))

  const frame = new Part(), white = new Part(), amber = new Part(), magenta = new Part(), blue = new Part()
  const z = (h: number) => h - ZB
  const upper = (s: number) => (s < S2 || s > S15 ? amber : white)
  const lower = (s: number) => {
    if (lowerCuts.some(c => Math.abs(s - c) < MULL)) return frame
    if (s < S2) return blue
    if (s < S12) return white
    return magenta
  }
  const bands: Band[] = [
    { z0: z(9.3), z1: z(9.5), pick: () => frame },
    { z0: z(9.5), z1: z(19.4), pick: lower },
    { z0: z(19.4), z1: z(20.1), pick: () => frame },
    { z0: z(20.1), z1: z(33.2), pick: upper },
    { z0: z(33.2), z1: z(35.0), pick: () => frame },
  ]
  cabinet(chain, D0, D1, z(9.3), z(35.0), bands, frame)

  const parts = [
    { part: frame, material: finish('screen-frame', 0x4a4f57) },
    { part: white, material: finish('neon-marquis-white', 0xeef1f5) },
    { part: amber, material: finish('neon-marquis-amber', 0xf2b53a) },
    { part: magenta, material: finish('neon-marquis-magenta', 0xe0479a) },
    { part: blue, material: finish('neon-marquis-blue', 0x4a86e0) },
  ]
  const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  let top = 0
  for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) top = Math.max(top, part.pos[i])
  const glb = writeGlb('New York Marriott Marquis Screen', parts, {
    license: 'CC0-1.0', bearing: 0, elevation: ZB, height: top,
    frame: 'Y up, -Z north, +X east, metres; origin at the anchor, y = 0 at the screen cabinet underside 9.3 m above the street',
    replaces: [],
  })
  if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/nyc-marriott-marquis-screen.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${top.toFixed(1)} m`)
}
