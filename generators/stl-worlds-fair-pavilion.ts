/**
 * World's Fair Pavilion, Government Hill, Forest Park, St. Louis (1909,
 * Henry Wright, paid for with the 1904 Louisiana Purchase Exposition's
 * profits) — procedural, CC0-1.0, no textures.
 * bun generators/stl-worlds-fair-pavilion.ts
 *
 * Map frame: x along the pavilion (east-north-east +x), y toward the front
 * (north-north-west, downhill to the Government Hill fountains and the
 * Grand Basin), z up, metres. Bearing 336.7°: the long walls of OSM
 * way/561781211 run at 66.7°. Anchor -90.2855459, 38.6364771: the
 * outline's area centroid.
 *
 * The building (photos): a Mission/Spanish-style open shelter in buff
 * stucco under red tile. A long central hall open on both long sides
 * through arcades of seven round arches; two square towers at the front
 * corners of the hall, each a shaft with slit windows, an open arched
 * belvedere and a broad-eaved tile pyramid; lower end wings beyond them
 * with canted (half-octagon) ends, each face holding a big arch; deep
 * eaves with dark rafter ends all round.
 *
 * Measured (USGS lidar USGS_LPC_MO_StLouis_2017_LAS_2018, flown 2017–18,
 * 0.5 m grid, above the terrace the pavilion stands on; the lawn in front
 * is 0.6 m lower): the hall's eaves 6.2–6.4 and ridge 11.3, the ridge
 * running x -12 to 12; the end wings' eaves 6.1 and ridge 9.9 (x ±16 to
 * ±21, hipping down to the ends); the towers' roofs 12–13.1 in the lidar,
 * drawn with eaves 11.9 and a 14.0 peak (the photos show the towers' eaves
 * just over the hall's ridge; the lidar misses the slim peak),
 * their plan x 16.2–23.3 / -23.2 to -16.0 by y 4.5–12.0 (lidar and OSM).
 * OSM: the outline (hall x -15.7 to 16, y -10.1 to 10, the canted ends to
 * x ±29.6, the towers' fronts at y 11.8–12.1).
 * Estimated from the photos (scaled from the hall's eaves): the arches
 * (seven bays of 4.6 m, piers 1.2 m, springing 3.4 m), the end wings'
 * arches (3.6 m wide, springing 3.0 m), the towers' belvedere (9.0–11.6 m)
 * and slit windows, the eaves' overhang (0.8 m). The back (south) arcade is
 * assumed to match the front; no photo shows it.
 *
 * Photos:
 *   - "World Fair Pavilion", Reading Tom (Flickr), CC BY 2.0,
 *     https://www.flickr.com/photos/16801915@N06/5946647764 (the front from
 *     the lawn below: arcade, towers, end wings, roofs) — EVIDENCE;
 *   - "World Fair Pavilion", Reading Tom (Flickr), CC BY 2.0,
 *     https://www.flickr.com/photos/16801915@N06/5946648150 (from the
 *     fountains, head on) — EVIDENCE;
 *   - "Forest Park, St Louis.jpg", Kris from Seattle, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Forest_Park,_St_Louis.jpg
 *     (the front and the towers' belvederes) — EVIDENCE.
 * Look-only (CC BY-NC-SA, not used for shape): EEngler, "World's Fair
 * Pavilion" (Flickr 37982637592, 5381674263).
 *
 * Night: the stucco takes a soft floodlight on the front; the open
 * arcade's interior stays dark.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { archShape, box, ccw, cornice, onWall, prism, rectShape, save, type XY } from './atl-tech-tower'
import { offset, wall, capPoly } from './atl-flatiron-building'
import { quad } from './dc-nationals-park'

const stucco = new Part(), tile = new Part(), eave = new Part(), shade = new Part()

/**
 * A hipped roof over a convex eave polygon: each eave edge runs up to the
 * ridge end(s) nearest its corners (a quad along the ridge, a triangle at a
 * hip), with a fascia of rafter ends and a soffit under it.
 */
function polyHip(ring: XY[], ra: XY, rb: XY, z0: number, z1: number, fascia = 0.4) {
  const R = ccw(ring)
  const near = (p: XY) => (Math.hypot(p[0] - ra[0], p[1] - ra[1]) <= Math.hypot(p[0] - rb[0], p[1] - rb[1]) ? ra : rb)
  const c: XY = [(ra[0] + rb[0]) / 2, (ra[1] + rb[1]) / 2]
  for (let i = 0; i < R.length; i++) {
    const a = R[i], b = R[(i + 1) % R.length]
    const na = near(a), nb = near(b)
    const up: V3 = [((a[0] + b[0]) / 2 - c[0]), ((a[1] + b[1]) / 2 - c[1]), 3]
    const A: V3 = [a[0], a[1], z0], B: V3 = [b[0], b[1], z0]
    if (na === nb) quad(tile, [A, B, [na[0], na[1], z1], [na[0], na[1], z1]], up)
    else quad(tile, [A, B, [nb[0], nb[1], z1], [na[0], na[1], z1]], up)
  }
  wall(eave, R, z0 - fascia, z0)
  capPoly(eave, R, z0 - fascia, false)
}

/**
 * An arcade wall in the plane y = y0 (its outer face), `thick` deep toward
 * -s·y: n round arches between x0 and x1 on piers, open right through, up
 * to `top`. Draws both faces, the jambs and the arches' soffits.
 */
function arcade(y0: number, s: 1 | -1, x0: number, x1: number, n: number, pier: number, spring: number, top: number, thick = 0.8) {
  const yo = y0, yi = y0 - s * thick
  const bay = (x1 - x0) / n, seg = 8
  for (let i = 0; i < n; i++) {
    const bx0 = x0 + bay * i, bx1 = bx0 + bay
    const ox0 = bx0 + pier / 2, ox1 = bx1 - pier / 2, r = (ox1 - ox0) / 2, cx = (ox0 + ox1) / 2
    for (const [y, sgn] of [[yo, s], [yi, -s]] as [number, number][]) {
      const nrm: V3 = [0, sgn, 0]
      quad(stucco, [[bx0, y, 0], [ox0, y, 0], [ox0, y, top], [bx0, y, top]], nrm)
      quad(stucco, [[ox1, y, 0], [bx1, y, 0], [bx1, y, top], [ox1, y, top]], nrm)
      for (let k = 0; k < seg; k++) {
        const t0 = Math.PI - (Math.PI * k) / seg, t1 = Math.PI - (Math.PI * (k + 1)) / seg
        const p0: V3 = [cx + r * Math.cos(t0), y, spring + r * Math.sin(t0)], p1: V3 = [cx + r * Math.cos(t1), y, spring + r * Math.sin(t1)]
        quad(stucco, [p0, p1, [p1[0], y, top], [p0[0], y, top]], nrm)
      }
    }
    // jambs and the arch's soffit, facing into the opening
    quad(stucco, [[ox0, yo, 0], [ox0, yi, 0], [ox0, yi, spring], [ox0, yo, spring]], [1, 0, 0])
    quad(stucco, [[ox1, yo, 0], [ox1, yi, 0], [ox1, yi, spring], [ox1, yo, spring]], [-1, 0, 0])
    for (let k = 0; k < seg; k++) {
      const t0 = Math.PI - (Math.PI * k) / seg, t1 = Math.PI - (Math.PI * (k + 1)) / seg
      const P = (t: number, y: number): V3 => [cx + r * Math.cos(t), y, spring + r * Math.sin(t)]
      const tm = (t0 + t1) / 2
      quad(stucco, [P(t0, yo), P(t1, yo), P(t1, yi), P(t0, yi)], [-Math.cos(tm), 0, -Math.sin(tm)])
    }
  }
}

// ── The central hall: arcades front and back, the end walls, the ceiling ──
const HX0 = -16.0, HX1 = 16.2, FRONT = 10.0, BACK = -10.1, EAVE = 6.3
arcade(FRONT, 1, HX0, HX1, 7, 1.2, 3.4, EAVE)
arcade(BACK, -1, HX0, HX1, 7, 1.2, 3.4, EAVE)
for (const [x, s] of [[HX0, 1], [HX1, -1]] as [number, number][]) {
  quad(stucco, [[x, BACK, 0], [x, FRONT, 0], [x, FRONT, EAVE], [x, BACK, EAVE]], [s, 0, 0]) // the end walls, seen through the arches
}
quad(stucco, [[HX0, BACK + 0.8, EAVE - 0.3], [HX1, BACK + 0.8, EAVE - 0.3], [HX1, FRONT - 0.8, EAVE - 0.3], [HX0, FRONT - 0.8, EAVE - 0.3]], [0, 0, -1]) // ceiling
// the wall-head over the arcades, up to the eaves
for (const [y, s] of [[FRONT, 1], [BACK, -1]] as [number, number][]) box(stucco, HX0, HX1, Math.min(y, y - s * 0.8), Math.max(y, y - s * 0.8), EAVE - 0.3, EAVE, null, 0)
polyHip(offset(ccw([[HX0, BACK], [HX1, BACK], [HX1, FRONT], [HX0, FRONT]]), 0.8), [-12, -0.05], [12, -0.05], EAVE, 11.3)

// ── The end wings: canted ends, a big arch in every face (open, drawn dark) ──
const WING_E: XY[] = ccw([[16.2, -10.1], [24.7, -10.1], [29.6, -5.0], [29.6, 2.3], [24.5, 7.4], [16.2, 7.4]])
const WING_W: XY[] = WING_E.map(([x, y]) => [-x - 0.1, y] as XY)
for (const W of [WING_E, ccw(WING_W)]) {
  prism(stucco, W, 0, 6.1, null, 0)
  const sx = W[0][0] > 0 || W.some(([x]) => x > 20) ? 1 : -1
  polyHip(offset(W, 0.8), [sx * 16.2, -1.35], [sx * 21, -1.35], 6.1, 9.9)
  for (let i = 0; i < W.length; i++) {
    const a = W[i], b = W[(i + 1) % W.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 6 || (Math.abs(a[0]) < 16.5 && Math.abs(b[0]) < 16.5) || (a[1] > 7 && b[1] > 7)) continue // against the hall, or behind the tower
    onWall(shade, a, b, archShape(L / 2, 3.6, 0, 3.0, 8), 0.04)
  }
}

// ── The towers: shaft, slit windows, open belvedere, cornice, tile pyramid ──
for (const [x0, x1] of [[16.2, 23.3], [-23.2, -16.0]] as [number, number][]) {
  const T = ccw([[x0, 4.5], [x1, 4.5], [x1, 12.0], [x0, 12.0]])
  prism(stucco, T, 0, 11.7, null, 0)
  cornice(stucco, T, 11.4, 0.5, 0.35, null)
  const w = x1 - x0, xm = (x0 + x1) / 2
  // the belvedere's arched opening on each face, dark
  const faces: [XY, XY][] = [[[x0, 12.0], [x1, 12.0]], [[x1, 12.0], [x1, 4.5]], [[x1, 4.5], [x0, 4.5]], [[x0, 4.5], [x0, 12.0]]]
  for (const [a, b] of faces) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    // onWall's outward normal is to the right of a→b; the ring above runs ccw, so walk it clockwise
    onWall(shade, b, a, archShape(L / 2, 4.4, 9.0, 9.4, 8), 0.04)
  }
  // three slit windows on the front and on the outer side
  for (const d of [-1.1, 0, 1.1]) onWall(shade, [xm + d + 0.2, 12.0], [xm + d - 0.2, 12.0], rectShape(0, 0.4, 3.6, 6.8), 0.04)
  const xo = Math.abs(x0) > Math.abs(x1) ? x0 : x1
  for (const d of [-1.1, 0, 1.1]) {
    const a: XY = xo > 0 ? [xo, 8.25 + d - 0.2] : [xo, 8.25 + d + 0.2], b: XY = xo > 0 ? [xo, 8.25 + d + 0.2] : [xo, 8.25 + d - 0.2]
    onWall(shade, a, b, rectShape(0, 0.4, 3.6, 6.8), 0.04)
  }
  void w
  polyHip(offset(T, 0.9), [xm, 8.25], [xm, 8.25], 11.9, 14.0, 0.3)
}

const floodlit = (p: V3, n: V3) => (n[2] > 0.7 ? 0 : n[1] > 0.5 ? 0.5 : 0.25)
await save('stl-worlds-fair-pavilion', "World's Fair Pavilion", [
  { part: stucco, material: { ...finish('wfp-stucco', 0xdcc9a6), floodlight: floodlit } },
  { part: tile, material: finish('wfp-tile', 0xb35a45) },
  { part: eave, material: finish('wfp-rafters', 0x8c6a50) },
  { part: shade, material: finish('wfp-shade', 0x6b6258) },
], { height: 14.0, anchor: [38.6364771, -90.2855459], bearing: 336.7, osm: 'way/561781211' }, 6500)
