/**
 * Yankee Stadium (2009), the Bronx: the pale limestone ring with its three-arch
 * bays and gate towers, the navy stands in three tiers, the canopy over the
 * upper deck with the white scalloped frieze along its front, the white
 * chevron-braced band behind it, and the row of outfield boards round the
 * centre-field scoreboard. Original procedural geometry, CC0-1.0.
 * bun generators/nyc-yankee-stadium.ts
 *
 * Also exports the small helpers the other NYC stadium models in this batch
 * (nyc-citi-field, nyc-barclays-center, nyc-arthur-ashe-stadium) build with;
 * the model itself is only written when this file is run.
 *
 * Stadium rule (STYLE.md "Ground"): the stands, roofs, facades, boards and gate
 * towers only. The field, warning track, Monument Park's lawn and the plazas
 * are the map's.
 *
 * Frame: BEARING 0, x east, y north, z up, metres. Origin = area centroid of
 * the OSM outline way/24801630 (-73.926453, 40.829601). z = 0 is the field,
 * 4.65 m NAVD88 (lidar). The streets round it are higher: River Avenue (east)
 * 2 m, 164th Street (north) 3 m, 161st Street and Ruppert Place (south and
 * west) 5 m. Sunken bowl: y = 0 is the field. Field depth below the street
 * outside: ~2 m below River Avenue (the lowest street on the outline), ~5 m
 * below 161st Street and Ruppert Place, from the lidar's ground returns
 * (field 4.65, River Avenue 6.6-7.0, 161st Street 9.6 m NAVD88), not map
 * terrain (no drawings or street photos give it directly). True placement
 * elevation would be -2; it ships as 0 until
 * the pipeline takes negative values (lead's instruction).
 *
 * Evidence
 * - OSM way/24801630 (leisure=stadium, "Yankee Stadium", start_date 2009,
 *   Q753529). OSM has no building or building:part inside it; the outline
 *   follows the limestone wall on every side and River Avenue on the east, with
 *   bumps at the three gate towers.
 * - USGS 3DEP lidar NY_NewYorkCity (2017) at 1 m (/tmp/city/nyc/work/
 *   nyc-yankee-stadium/lid.json), sampled on rays from (5, 0) every 5 degrees
 *   (radii.json). Heights above the field: the lower bowl rises from the field
 *   wall to 4.5 over about 14 m; a riser to 9 and the second tier to 11 over
 *   8 m; the upper deck's front at 20-22 rising to 29-31; the canopy roof at 40
 *   with its front edge (the frieze and lights) at 43, 11-12 m deep; the band
 *   behind it at 30, 7-9 m deep; the roof ring at 24-27 out to the limestone
 *   wall, whose top is 27 (30 along the west). The canopy runs from 62 degrees
 *   (north-east, left field) round behind home plate (west-south-west) to 327
 *   (south-east, right field). The outfield: bleachers from the fence rising to
 *   10; a 3 m thick row of boards at radius 98-101 topping out at 28, the
 *   scoreboard in the middle (6-21 degrees) at 34-35; the block under it
 *   (Monument Park and the bar) roofed at 14; low buildings behind at 11-15
 *   and the River Avenue wall at 13-14. Gate towers: west (Gate 4) to 32, south
 *   (Gate 6) and north to 30.
 * - Published (Wikipedia): opened 2009, Populous (HOK Sport); exterior of
 *   Indiana limestone, granite and cast stone recalling the 1923 stadium;
 *   the frieze copies the original's copper frieze in steel.
 * - Photos (Wikimedia Commons, credits in /tmp/city/nyc/work/
 *   nyc-yankee-stadium/photos/credits.txt): "Yankee Stadium, New York -
 *   panoramio.jpg" (dr-scott, CC BY-SA 3.0: the 161st Street front, three-arch
 *   bays, attic windows, the chevron band and the frieze above); "Yankee
 *   Stadium (27353652982).jpg" and four more by Kanesue (CC BY 2.0: Gate 4
 *   tower, granite base, three arched windows, flared cornice); "Front of the
 *   2nd Yankee Stadium on a summer day.jpg" (Charlie Smith FDTB, CC0);
 *   "2014 Yankee Stadium from Harlem River Drive walkway.jpg" (Beyond My Ken,
 *   CC BY-SA 4.0, from the west); "Yankee Stadium 002.JPG" (Gryffindor, CC
 *   BY-SA 3.0, aerial from the east); "Yankee Stadium in Bronx, New York City,
 *   from the air (5720974191).jpg" (Bill Abbott, CC BY-SA 2.0); "Yankee-stadium-
 *   frieze.jpg" (Y2kcrazyjoker4, CC BY 3.0); "Judge home run.jpg" (Adc95, CC
 *   BY-SA 4.0, the outfield boards and scoreboard); "Yankee Stadium 2012.jpg"
 *   (Reading Tom, CC BY 2.0, the tiers).
 * - USGS NAIP orthophoto for the plan, the diamond and the roof colours.
 *
 * Estimated from the photos: the bay rhythm (about 11.5 m, three arches each)
 * and the arch, attic and cornice proportions; the granite base height; the
 * frieze's bay (7.5 m) and depth; the chevron spacing; the gate towers' depth
 * behind the wall. The lower bowl's front is drawn 15 m inside the riser
 * (the lidar under the overhangs is unreliable). The tiers' fascias are drawn
 * plain; the ribbon boards, flags, light banks on the canopy and the lettering
 * are left out. The River Avenue wall's openings are a guess.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'

export type XY = [number, number]

// ---------------------------------------------------------------------------
// Shared helpers

export const add2 = (a: XY, b: XY, s = 1): XY => [a[0] + b[0] * s, a[1] + b[1] * s]
export const sub2 = (a: XY, b: XY): XY => [a[0] - b[0], a[1] - b[1]]
export const nrm2 = (a: XY): XY => { const l = Math.hypot(a[0], a[1]) || 1; return [a[0] / l, a[1] / l] }
export const len2 = (a: XY) => Math.hypot(a[0], a[1])
export const v3 = (p: XY, z: number): V3 => [p[0], p[1], z]

/** Signed area (positive = counter-clockwise). */
export function area(r: XY[]) {
  let s = 0
  for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; s += a[0] * b[1] - b[0] * a[1] }
  return s / 2
}
export const ccw = (r: XY[]) => (area(r) >= 0 ? r : [...r].reverse())

/** Ear clipping for a simple polygon (counter-clockwise). Returns index triples. */
export function earcut(r: XY[]): [number, number, number][] {
  const idx = r.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inTri = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = r[i0], b = r[i1], c = r[i2]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inTri(r[j], a, b, c))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) { // degenerate leftovers: drop a collinear vertex
      idx.splice(0, 1)
    }
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** A flat polygon (any simple ring) at height z, facing up or down. */
export function capPoly(p: Part, ring: XY[], z: number, up = true) {
  const r = ccw(ring)
  for (const [a, b, c] of earcut(r)) {
    if (up) p.tri(v3(r[a], z), v3(r[b], z), v3(r[c], z))
    else p.tri(v3(r[a], z), v3(r[c], z), v3(r[b], z))
  }
}

/** Vertical walls round a ring, facing out. */
export function walls(p: Part, ring: XY[], z0: number, z1: number) {
  const r = ccw(ring)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    p.quad(v3(a, z0), v3(b, z0), v3(b, z1), v3(a, z1))
  }
}

/** A prism over a ring: walls on `wall`, lid on `top`. */
export function prism(wall: Part, top: Part | null, ring: XY[], z0: number, z1: number) {
  walls(wall, ring, z0, z1)
  if (top) capPoly(top, ring, z1)
}

/** A rectangle ring centred at c, half sizes hw (along u) and hd (across), u a unit vector. */
export function rect(c: XY, u: XY, hw: number, hd: number): XY[] {
  const n: XY = [-u[1], u[0]]
  return [add2(add2(c, u, -hw), n, -hd), add2(add2(c, u, hw), n, -hd), add2(add2(c, u, hw), n, hd), add2(add2(c, u, -hw), n, hd)]
}

/** A flat panel on a wall: plan points a→b, outward normal n, offset `off` proud of the wall. */
export function panel(p: Part, a: XY, b: XY, n: XY, z0: number, z1: number, off = 0.05) {
  const A = add2(a, n, off), B = add2(b, n, off)
  // wind so the face looks along n
  const t = sub2(B, A), facing = t[0] * n[1] - t[1] * n[0] // <0: n is to the right of a→b
  if (facing < 0) p.quad(v3(A, z0), v3(B, z0), v3(B, z1), v3(A, z1))
  else p.quad(v3(B, z0), v3(A, z0), v3(A, z1), v3(B, z1))
}

/** An arched panel (a real semicircle on top) on a wall: plan a→b, normal n, sill z0, springing zs. */
export function arch(p: Part, a: XY, b: XY, n: XY, z0: number, zs: number, off = 0.05, seg = 8) {
  const A = add2(a, n, off), B = add2(b, n, off)
  const t = sub2(B, A), facing = t[0] * n[1] - t[1] * n[0]
  const [L, R] = facing < 0 ? [A, B] : [B, A] // L→R runs left to right seen from outside
  const c: XY = [(L[0] + R[0]) / 2, (L[1] + R[1]) / 2], rad = len2(sub2(R, L)) / 2, u = nrm2(sub2(R, L))
  p.quad(v3(L, z0), v3(R, z0), v3(R, zs), v3(L, zs))
  for (let i = 0; i < seg; i++) {
    const a0 = (Math.PI * i) / seg, a1 = (Math.PI * (i + 1)) / seg
    const P = (an: number): V3 => [c[0] + u[0] * Math.cos(an) * rad, c[1] + u[1] * Math.cos(an) * rad, zs + Math.sin(an) * rad]
    p.tri([c[0], c[1], zs], P(a0), P(a1))
  }
}

/** A square-section beam between two points (four sides, no ends). */
export function beam(p: Part, a: V3, b: V3, w: number, h = w) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d)
  const t: V3 = [d[0] / L, d[1] / L, d[2] / L]
  let s: V3 = Math.abs(t[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  // e1 ⟂ t, e2 = t × e1
  const dot = s[0] * t[0] + s[1] * t[1] + s[2] * t[2]
  s = [s[0] - t[0] * dot, s[1] - t[1] * dot, s[2] - t[2] * dot]
  const sl = Math.hypot(...s), e1: V3 = [s[0] / sl, s[1] / sl, s[2] / sl]
  const e2: V3 = [t[1] * e1[2] - t[2] * e1[1], t[2] * e1[0] - t[0] * e1[2], t[0] * e1[1] - t[1] * e1[0]]
  const corner = (q: V3, i: number): V3 => {
    const [cx, cy] = [[1, 1], [-1, 1], [-1, -1], [1, -1]][i]
    return [q[0] + e1[0] * cx * w / 2 + e2[0] * cy * h / 2, q[1] + e1[1] * cx * w / 2 + e2[1] * cy * h / 2, q[2] + e1[2] * cx * w / 2 + e2[2] * cy * h / 2]
  }
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    p.quad(corner(a, i), corner(a, j), corner(b, j), corner(b, i))
  }
}

/** Distance along the ray p + t·d to the nearest crossing of closed ring F. */
export function rayHit(p: XY, d: XY, F: XY[], tmin = 0): number | null {
  let best: number | null = null
  for (let i = 0; i < F.length; i++) {
    const a = F[i], b = F[(i + 1) % F.length], e = sub2(b, a)
    const den = d[0] * e[1] - d[1] * e[0]
    if (Math.abs(den) < 1e-12) continue
    const w = sub2(a, p), t = (w[0] * e[1] - w[1] * e[0]) / den, s = (w[0] * d[1] - w[1] * d[0]) / den
    if (s >= -1e-9 && s <= 1 + 1e-9 && t > tmin && (best === null || t < best)) best = t
  }
  return best
}

/**
 * A ring of cross-sections swept round a centre: `stations[k]` is a profile of
 * (x, y, z) points in the same order at each station; strip i (between
 * points i and i+1) takes `mat(i, k)`. Each quad faces the side to the right
 * of the profile's direction when stations run counter-clockwise.
 */
export function sweep(stations: V3[][], mat: (strip: number, k: number) => Part | null, closed = false) {
  const n = stations.length, m = stations[0].length
  for (let k = 0; k < (closed ? n : n - 1); k++) {
    const A = stations[k], B = stations[(k + 1) % n]
    for (let i = 0; i < m - 1; i++) {
      const p = mat(i, k)
      if (!p) continue
      p.quad(A[i], A[i + 1], B[i + 1], B[i])
    }
  }
}

/**
 * Close the end of a sweep: the cross-section polygon (the profile closed back
 * along its foot), facing `out` (a horizontal unit vector).
 */
export function endCap(p: Part, profile0: V3[], out: XY) {
  const last = profile0[profile0.length - 1]
  const profile = last[2] > 1e-6 ? [...profile0, [last[0], last[1], 0] as V3] : profile0
  // 2D coordinates in the section plane: s along the horizontal (across), z up
  const h: XY = [-out[1], out[0]]
  const o = profile[0]
  const flat: XY[] = profile.map((q) => [(q[0] - o[0]) * h[0] + (q[1] - o[1]) * h[1], q[2]])
  const sgn = area(flat) >= 0 ? 1 : -1
  const ring = sgn > 0 ? flat : [...flat].reverse()
  const P = sgn > 0 ? profile : [...profile].reverse()
  for (const [a, b, c] of earcut(ring)) {
    // ring is CCW in (h, z); the face normal of a CCW triangle there is h × z = -out... check and flip
    const n = [(P[b][1] - P[a][1]) * (P[c][2] - P[a][2]) - (P[b][2] - P[a][2]) * (P[c][1] - P[a][1]), (P[b][2] - P[a][2]) * (P[c][0] - P[a][0]) - (P[b][0] - P[a][0]) * (P[c][2] - P[a][2])]
    if (n[0] * out[0] + n[1] * out[1] >= 0) p.tri(P[a], P[b], P[c])
    else p.tri(P[a], P[c], P[b])
  }
}

/**
 * Place an opening w wide centred at distance s along a run of wall edges
 * (counter-clockwise ring, so the outward normal is to the right). Spanning a
 * corner, it sits on the chord, stood off by the corner's bulge; one that
 * would bulge more than 0.12 m or spans two corners is left out.
 */
export function placeOnRun(run: [XY, XY, number][], s: number, w: number, draw: (a: XY, b: XY, n: XY, off: number) => void) {
  // the points at s - w/2 and s + w/2 along the run, and the corner (if any) between
  const pts: XY[] = [run[0][0], ...run.map((e) => e[1])]
  const cum = [0]
  for (let i = 0; i < run.length; i++) cum.push(cum[i] + len2(sub2(pts[i + 1], pts[i])))
  const pos = (t: number): [XY, number] => {
    for (let i = 0; i < run.length; i++) if (t <= cum[i + 1] || i === run.length - 1) {
      const u = nrm2(sub2(pts[i + 1], pts[i]))
      return [add2(pts[i], u, t - cum[i]), i]
    }
    return [pts[0], 0]
  }
  const [pa, ia] = pos(s - w / 2), [pb, ib] = pos(s + w / 2)
  if (ib - ia > 1) return
  const u = nrm2(sub2(pb, pa)), n: XY = [u[1], -u[0]]
  // a corner between the ends bulges past the chord: stand the panel off by that much
  const sag = ib > ia ? (pts[ib][0] - pa[0]) * n[0] + (pts[ib][1] - pa[1]) * n[1] : 0
  if (sag > 0.12 || sag < -0.12) return
  draw(pa, pb, n, 0.05 + Math.max(0, sag))
}

/** Write the GLB, check the budget, print the size. */
export async function save(id: string, name: string, parts: { part: Part; material: Swatch & { doubleSided?: boolean } }[], extras: Record<string, unknown>, maxTris = 6500) {
  const used = parts.filter((p) => p.part.triangles > 0)
  const tris = used.reduce((s, p) => s + p.part.triangles, 0)
  if (used.length > 6) throw new Error(`${id}: ${used.length} materials`)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', ...extras })
  if (tris > maxTris) throw new Error(`${id}: ${tris} triangles`)
  if (glb.length > 250000) throw new Error(`${id}: ${glb.length} bytes`)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
  for (const p of used) console.log(`  ${p.material.name}: ${p.part.triangles}`)
}

// ---------------------------------------------------------------------------
// Yankee Stadium

function build() {
  const stone = new Part(), granite = new Part(), trim = new Part(), navy = new Part(), roof = new Part(), win = new Part()

  const C: XY = [5, 0] // the centre the radii were measured from
  const D2R = Math.PI / 180

  // The limestone wall: OSM way/24801630 without the gate-tower bumps, CCW.
  const WALL: XY[] = ccw([
    [130.0, 27.8], [59.4, -129.9], [42.2, -131.5], [-2.5, -126.6], [-15.2, -122.8], [-27.0, -118.1], [-80.1, -91.8],
    [-97.9, -82.1], [-104.6, -76.9], [-108.8, -73.3], [-113.2, -68.5], [-116.9, -64.0], [-120.3, -58.8], [-124.4, -51.5],
    [-126.6, -46.6], [-130.9, -21.3], [-130.6, -13.9], [-129.3, -6.1], [-127.0, 2.1], [-123.2, 11.1], [-115.7, 23.0],
    [-61.6, 94.9], [-51.4, 108.4], [-44.9, 115.8], [-39.6, 121.3], [-35.7, 124.8], [-16.2, 133.8], [-3.3, 138.7],
    [-1.1, 137.8], [104.7, 92.3], [95.8, 72.6], [120.8, 61.5], [118.7, 57.0], [116.3, 51.6], [123.3, 31.0],
  ])

  // Radii from the lidar every 5 degrees (angle anticlockwise from east, about C):
  // r8 = the riser to the second tier, r20 = the upper deck's front,
  // r38 = the canopy's front, rcb = its back, rc = the back of the band behind.
  // Smoothed by hand where seats under the overhangs confused the sampling.
  const T: Record<number, [number, number, number, number, number]> = {
    65: [88, 93, 103, 114, 122], 70: [85, 93, 102, 114, 121], 75: [85, 93, 103, 114, 121], 80: [84, 92, 103, 114, 121],
    85: [84, 92, 102, 113, 120], 90: [83, 91, 101, 112, 119], 95: [81, 89, 99, 110, 118], 100: [78, 87, 96, 108, 117],
    105: [76, 84, 95, 107, 115], 110: [72, 81, 93, 104, 113], 115: [71, 79, 89, 101, 110], 120: [69, 77, 88, 99, 108],
    125: [69, 76, 87, 98, 107], 130: [68, 76, 86, 97, 106], 135: [69, 76, 86, 97, 106], 140: [69, 76, 86, 97, 106],
    145: [68, 76, 87, 97, 106], 150: [69, 76, 87, 98, 106], 155: [69, 77, 88, 99, 108], 160: [71, 79, 90, 101, 111],
    165: [73, 82, 93, 104, 114], 170: [77, 85, 96, 107, 118], 175: [79, 88, 99, 110, 121], 180: [83, 91, 102, 113, 124],
    185: [85, 93, 103, 114, 125], 190: [86, 94, 104.5, 115.5, 126], 195: [87, 95, 105, 116, 126], 200: [87, 94, 105, 116, 125],
    205: [86, 94, 104, 115, 123], 210: [84, 91, 102, 113, 121], 215: [82, 90, 101, 112, 120], 220: [78, 87, 98, 109, 117],
    225: [75, 83, 95, 106, 113], 230: [73, 81, 91, 103, 111], 235: [72, 79, 90, 101, 109], 240: [70, 77, 89, 99, 107],
    245: [69, 77, 88, 98, 107], 250: [70, 78, 88, 99, 107], 255: [70, 78, 89, 99, 107], 260: [71, 78, 88, 99, 107],
    265: [71, 78, 88, 99, 107], 270: [72, 80, 90, 101, 109], 275: [73, 81, 92, 103, 111], 280: [75, 83, 94, 105, 113],
    285: [77, 85, 95, 106, 115], 290: [78, 86, 96, 107, 116], 295: [78, 86, 96, 107, 116], 300: [77, 85, 96, 106, 115],
    305: [76, 83, 94, 105, 114], 310: [73, 82, 93, 103, 112], 315: [72, 79, 90, 102, 111], 320: [70, 78, 89, 99, 107],
    325: [69, 78, 88, 98, 105], 330: [69, 78, 88, 98, 104],
  }
  const radii = (deg: number) => {
    const d = Math.min(330, Math.max(65, deg)), k0 = Math.floor(d / 5) * 5, k1 = Math.min(330, k0 + 5), u = (d - k0) / 5
    return T[k0].map((v, i) => v + (T[k1][i] - v) * u) as [number, number, number, number, number]
  }
  const dir = (deg: number): XY => [Math.cos(deg * D2R), Math.sin(deg * D2R)]
  const at = (deg: number, r: number): XY => add2(C, dir(deg), r)
  const wallR = (deg: number) => rayHit(C, dir(deg), WALL)!

  // Facade top: 27 round the grandstand; 14 along River Avenue and the
  // north-east corner beyond the end of the stands.
  const FACADE_HI = 27, FACADE_LO = 14
  const G0 = 62, G1 = 327 // the canopy's ends (degrees)
  const facadeZ = (deg: number) => {
    const d = ((deg % 360) + 360) % 360
    return d >= G0 && d <= 293 ? FACADE_HI : FACADE_LO
  }

  // ----- Grandstand: one profile swept from left field round to right field.
  const gAngles: number[] = []
  for (let d = G0; d <= G1; d += 6) gAngles.push(d)
  for (const d of [93, 125, 169, 227, 293]) if (!gAngles.includes(d)) gAngles.push(d)
  if (!gAngles.includes(G1)) gAngles.push(G1)
  gAngles.sort((a, b) => a - b)

  type Pt = [number, number] // (radius, z)
  const gProfile = (deg: number): Pt[] => {
    const [r8, r20, r38, rcb, rc] = radii(deg)
    const ro = wallR(deg) - 0.4
    const zr = facadeZ(deg) - 1
    const lb = r8 - 15
    return [
      [lb, 0], [lb, 1.3], // field wall
      [r8 - 1, 4.5], // lower bowl
      [r8 - 1, 9], // riser
      [r20 - 1, 11.5], // second tier
      [r20 - 1, 20], // under the upper deck
      [r20, 21.8], // fascia
      [r38 + 1.5, 31], // upper deck
      [r38 + 1.5, 38.4], // open back under the canopy
      [r38, 38.4], // canopy soffit
      [r38, 40], // canopy front
      [rcb, 40], // canopy roof
      [rcb, 30], // the braced band
      [Math.min(rc, ro - 2), 30], // its roof
      [Math.min(rc, ro - 2), zr], // drop to the roof ring
      [ro, zr], // roof ring to the wall
    ]
  }
  const gMat = (i: number) => [navy, navy, roof, navy, roof, roof, navy, roof, roof, trim, trim, roof, roof, roof, roof][i]
  const gStations = gAngles.map((d) => gProfile(d).map(([r, z]) => v3(at(d, r), z)))
  sweep(gStations, (i) => gMat(i))
  endCap(roof, gStations[0], nrm2([Math.sin(G0 * D2R), -Math.cos(G0 * D2R)]))
  endCap(roof, gStations[gStations.length - 1], nrm2([-Math.sin(G1 * D2R), Math.cos(G1 * D2R)]))

  // The braced band behind the canopy: white posts and, every other bay, a
  // tall inverted V, on the grey face at rcb, as seen above the limestone.
  {
    const step = 6
    const P = (deg: number, z: number): V3 => v3(add2(at(deg, radii(deg)[3]), dir(deg), 0.3), z)
    const strip = (p: V3, q: V3, w: number, deg: number) => {
      // a flat ribbon from p to q, w wide, in the band's vertical plane (trim is double-sided)
      const tg: XY = [-Math.sin(deg * D2R), Math.cos(deg * D2R)]
      const along = (q[0] - p[0]) * tg[0] + (q[1] - p[1]) * tg[1], dz = q[2] - p[2], l = Math.hypot(along, dz)
      const ox = (-dz / l) * w / 2, oz = (along / l) * w / 2
      const off = (v: V3, s: number): V3 => [v[0] + tg[0] * ox * s, v[1] + tg[1] * ox * s, v[2] + oz * s]
      trim.quad(off(p, -1), off(p, 1), off(q, 1), off(q, -1))
    }
    let k = 0
    for (let d = G0 + 3; d <= G1 - 3; d += step, k++) {
      strip(P(d, 30), P(d, 40), 0.8, d)
      if (k % 2 === 0 && d + step <= G1 - 3) {
        strip(P(d, 30.4), P(d + step / 2, 38.3), 1.5, d + step / 4)
        strip(P(d + step / 2, 38.3), P(d + step, 30.4), 1.5, d + 3 * step / 4)
      }
    }
  }

  // The frieze: a white band along the canopy's front, hanging posts and a
  // scalloped arch between each pair, double-sided (trim is double-sided).
  {
    const fr = (d: number) => radii(d)[2] - 0.15
    const zTop = 43, zBand = 41.5, zFoot = 37.2, zCrown = 40.2
    const span = G1 - G0 - 2
    const bays = Math.round((span * D2R * 95) / 7.5)
    const dd = span / bays
    for (let k = 0; k < bays; k++) {
      const d0 = G0 + 1 + k * dd, d1 = d0 + dd
      const p0 = at(d0, fr(d0)), p1 = at(d1, fr(d1))
      trim.quad(v3(p1, zBand), v3(p0, zBand), v3(p0, zTop), v3(p1, zTop)) // band, facing the field
      // the arch spandrel: from the band down to a semicircle-ish soffit
      const seg = 4
      for (let i = 0; i < seg; i++) {
        const t0 = i / seg, t1 = (i + 1) / seg
        const z = (t: number) => zFoot + (zCrown - zFoot) * Math.sin(Math.PI * t)
        const pa: XY = [p0[0] + (p1[0] - p0[0]) * t0, p0[1] + (p1[1] - p0[1]) * t0]
        const pb: XY = [p0[0] + (p1[0] - p0[0]) * t1, p0[1] + (p1[1] - p0[1]) * t1]
        trim.quad(v3(pb, z(t1)), v3(pa, z(t0)), v3(pa, zBand), v3(pb, zBand))
      }
    }
    // a white rail along the canopy's back edge, seen from outside
    for (let i = 0; i + 1 < gAngles.length; i++) {
      const d0 = gAngles[i], d1 = gAngles[i + 1]
      const a = at(d0, radii(d0)[3]), b = at(d1, radii(d1)[3])
      trim.quad(v3(add2(a, dir(d0), 0.32), 38.4), v3(add2(b, dir(d1), 0.32), 38.4), v3(add2(b, dir(d1), 0.32), 41.4), v3(add2(a, dir(d0), 0.32), 41.4))
    }
  }

  // ----- Outfield: bleachers from the fence up to the row of boards.
  const OF0 = G1, OF1 = G0 + 360
  const oAngles: number[] = []
  for (let d = OF0; d <= OF1; d += 5) oAngles.push(d)
  if (!oAngles.includes(OF1)) oAngles.push(OF1)
  if (!oAngles.includes(403)) oAngles.push(403) // the NE wall corner (vertex at 43°)
  oAngles.sort((a, b) => a - b)
  const fence = (deg: number) => {
    const d = ((deg % 360) + 360) % 360
    // the fence radius from the lidar, smoothed: 66 in right field to 74 in centre, 72 in left
    const tbl: [number, number][] = [[327, 66], [345, 67], [360, 72], [380, 75], [400, 74], [422, 72]]
    const dd = d < 180 ? d + 360 : d
    for (let i = 0; i + 1 < tbl.length; i++) if (dd >= tbl[i][0] && dd <= tbl[i + 1][0]) {
      const u = (dd - tbl[i][0]) / (tbl[i + 1][0] - tbl[i][0]); return tbl[i][1] + (tbl[i + 1][1] - tbl[i][1]) * u
    }
    return 70
  }
  const RB = 98 // the boards' front
  const oProfile = (deg: number): Pt[] => {
    const rf = fence(deg), ro = wallR(deg) - 0.4
    return [[rf, 0], [rf, 2.2], [RB - 0.5, 10.5], [RB - 0.5, 13], [ro, 13]]
  }
  const oStations = oAngles.map((d) => oProfile(d).map(([r, z]) => v3(at(d, r), z)))
  sweep(oStations, (i) => [navy, navy, roof, roof][i])

  // The outfield boards: the centre-field scoreboard, a dark slab 31 m wide
  // standing to 35.5 over the batter's eye, with its video screen facing home;
  // and on either side a row of separate billboards on legs over the
  // bleachers' back (the lidar's 28 m returns there are their tops and lights).
  {
    const box = (c: XY, u: XY, hw: number, hd: number, z0: number, z1: number, wall: Part) => {
      const r = rect(c, u, hw, hd)
      prism(wall, roof, r, z0, z1)
      capPoly(wall, r, z0, false)
    }
    const tang = (d: number): XY => [-Math.sin(d * D2R), Math.cos(d * D2R)]
    const SB = 373.5
    {
      const c = at(SB, RB + 1.5), u = tang(SB), n = nrm2(sub2(C, c))
      box(c, u, 15.5, 1.3, 12, 35.5, navy)
      panel(win, add2(add2(c, n, 1.3), u, 14.3), add2(add2(c, n, 1.3), u, -14.3), n, 16.5, 34, 0.06)
    }
    for (const d of [334, 342, 350, 358, 389, 397, 405, 413]) {
      const c = at(d, RB + 1), u = tang(d), hw = d < 360 ? 6.2 : 6.2
      box(c, u, hw, 0.6, 17, 26.5, navy)
      for (const s of [-hw + 1.2, hw - 1.2]) box(add2(c, u, s), u, 0.45, 0.45, 13, 17, roof)
    }
  }
  // The block under the scoreboard (the batter's eye and the bar), roofed at 14.
  {
    const ds = [364, 369, 374, 379, 383]
    const st = ds.map((d) => [v3(at(d, fence(d) + 4), 0), v3(at(d, fence(d) + 4), 14), v3(at(d, RB), 14)])
    sweep(st, (i) => [navy, roof][i])
    endCap(navy, [...st[0], v3(at(ds[0], RB), 0)], nrm2([Math.sin(ds[0] * D2R), -Math.cos(ds[0] * D2R)]))
    endCap(navy, [...st[st.length - 1], v3(at(ds[ds.length - 1], RB), 0)], nrm2([-Math.sin(ds[ds.length - 1] * D2R), Math.cos(ds[ds.length - 1] * D2R)]))
  }

  // ----- The limestone wall: granite plinth, three-arch bays, attic windows, cornice.
  {
    const PLINTH = 6.5
    // walls and cornice, edge by edge; the edge crossing G0 is split there
    const ang = (p: XY) => (Math.atan2(p[1] - C[1], p[0] - C[0]) / D2R + 360) % 360
    const edges: [XY, XY, number][] = []
    for (let i = 0; i < WALL.length; i++) {
      const a = WALL[i], b = WALL[(i + 1) % WALL.length]
      const da = ang(a), db = ang(b)
      if (Math.abs(da - db) < 180 && Math.min(da, db) < G0 && Math.max(da, db) > G0) {
        const sp = at(G0, wallR(G0))
        edges.push([a, sp, facadeZ(da)], [sp, b, facadeZ(db)])
      } else edges.push([a, b, facadeZ(ang([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]))])
    }
    for (const [p, q, H] of edges) {
      const u = nrm2(sub2(q, p)), n: XY = [u[1], -u[0]] // outward for a CCW ring
      granite.quad(v3(p, 0), v3(q, 0), v3(q, PLINTH), v3(p, PLINTH))
      stone.quad(v3(p, PLINTH), v3(q, PLINTH), v3(q, H - 1.2), v3(p, H - 1.2))
      const P = add2(p, n, 0.5), Q = add2(q, n, 0.5)
      stone.quad(v3(P, H - 1.2), v3(Q, H - 1.2), v3(Q, H), v3(P, H))
      stone.quad(v3(p, H - 1.2), v3(q, H - 1.2), v3(Q, H - 1.2), v3(P, H - 1.2))
      stone.quad(v3(P, H), v3(Q, H), v3(q, H), v3(p, H))
    }
    // Openings, walked along each run of wall of one height so the bays keep
    // their rhythm round the curves. An opening sits on the edge holding its
    // centre, slid along to fit inside it; one that can't fit is left out.
    const runs: [XY, XY, number][][] = []
    for (const e of edges) {
      const last = runs[runs.length - 1]
      if (last && last[last.length - 1][2] === e[2]) last.push(e)
      else runs.push([e])
    }
    if (runs.length > 1 && runs[0][0][2] === runs[runs.length - 1][0][2]) runs[0].unshift(...runs.pop()!)
    const place = placeOnRun
    for (const run of runs) {
      const total = run.reduce((t, [p, q]) => t + len2(sub2(q, p)), 0)
      const hi = run[0][2] === FACADE_HI
      const BAY = hi ? 12.5 : 11
      const nb = Math.floor((total - 4) / BAY)
      const s0 = (total - nb * BAY) / 2
      for (let k = 0; k < nb; k++) {
        const c = s0 + (k + 0.5) * BAY
        if (hi) {
          for (const o of [-3.4, 0, 3.4]) {
            place(run, c + o, 2.3, (a, b, n, off) => arch(win, a, b, n, 10.5, 21.4, off))
            place(run, c + o, 2.6, (a, b, n, off) => panel(win, a, b, n, 23.2, 24.8, off)) // the attic windows
          }
        } else {
          place(run, c, 3.2, (a, b, n, off) => arch(win, a, b, n, 4.5, 9.8, off))
        }
      }
    }
  }

  // ----- Gate towers: west (Gate 4), south (Gate 6) and north.
  {
    const towers: [XY, XY, number][] = [
      [[-131.2, -47.7], [-137.4, -23.1], 32],
      [[30.8, -135.4], [9.5, -133.3], 30],
      [[-37.4, 129.4], [-17.6, 137.6], 30],
    ]
    for (const [a, b, H] of towers) {
      const u = nrm2(sub2(b, a)), n: XY = [-u[1], u[0]]
      // n must point out of the stadium
      const mid: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
      const out: XY = (n[0] * (mid[0] - C[0]) + n[1] * (mid[1] - C[1])) > 0 ? n : [-n[0], -n[1]]
      const L = len2(sub2(b, a)), depth = 12
      const ring: XY[] = [a, b, add2(b, out, -depth), add2(a, out, -depth)]
      walls(granite, ring, 0, 10.5)
      walls(stone, ring, 10.5, H - 1.6)
      // flared cap: a slab 1.2 m proud all round
      const cap: XY[] = [add2(add2(a, out, 1.2), u, -1.2), add2(add2(b, out, 1.2), u, 1.2), add2(add2(b, out, -depth), u, 1.2), add2(add2(a, out, -depth), u, -1.2)]
      prism(stone, roof, cap, H - 1.6, H)
      capPoly(stone, cap, H - 1.6, false)
      // the recessed centre with three tall arches, and the entrance below
      const c = 0.5 * L
      for (let j = -1; j <= 1; j++) arch(win, add2(a, u, c + j * 3.4 - 1.2), add2(a, u, c + j * 3.4 + 1.2), out, 11.5, 23.5)
      panel(win, add2(a, u, c - 5), add2(a, u, c + 5), out, 5, 8.6)
    }
  }

  return [
    { part: stone, material: PALETTE.stone },
    { part: granite, material: finish('yankee-granite', 0xc4c0b8) },
    { part: trim, material: { ...PALETTE.trim, doubleSided: true } },
    { part: navy, material: finish('yankees-navy', 0x55637d) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
  ]
}

if (import.meta.main) {
  await save('nyc-yankee-stadium', 'Yankee Stadium', build(), {
    bearing: 0, elevation: 0, anchor: [40.829601, -73.926453], height: 43,
    replaces: ['way/24801630'],
  })
}
