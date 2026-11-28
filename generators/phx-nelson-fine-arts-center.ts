/**
 * Nelson Fine Arts Center (ASU Art Museum and the Galvin Playhouse),
 * Arizona State University, Tempe (1989, Antoine Predock) — original
 * procedural geometry, CC0-1.0.
 * bun generators/phx-nelson-fine-arts-center.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * centroid of the outer way (way/28822268) of OSM relation/12350154
 * (-111.9382932, 33.4186734). Bearing 0.
 *
 * What is drawn: relation/12350154's outline (its outer way 28822268; the
 * small inner light well, way 909767552, is roofed over here), plus the
 * museum plaza's stepped stair masses and the concrete gateway on the
 * outline's edge.
 *
 * Identity (from the photos below):
 *  1. Mauve, purple-grey stucco masses stepping up in tiers like a mesa
 *     village, with few, small square openings.           (main, dad, sh5)
 *  2. The tall plain fly tower of the playhouse, the highest mass, with a
 *     taller slab along its west side.                         (sh5, lidar)
 *  3. The board-formed concrete gateway over the museum entrance: two
 *     tapering pylons joined at the top by a dark steel truss.  (main, dad)
 *  4. Big triangular stair masses with stepped edges climbing from the
 *     sunken plaza to the roof terraces.                  (main, dad, 2508)
 *  5. The red brick arcade along the curved south front.            (sh5)
 *
 * Plan: OSM. Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown
 * 2020), 1 m grid, above the ground round it (355.2 m), read on a 3–4 m
 * lattice: the low base and brick arcade 5.5; west galleries 6.7 with a
 * raised middle at 9.7; north gallery strip 4.7; the north mass 13.7; the
 * central lobby block 8.7 and 11.2 to its north; the theatre 12.2; the fly
 * tower 23.7 with its west slab 29.7; the north-east block 7.7; the east
 * strip 6.0; the gateway's pylons and truss 17.7.
 *
 * Estimated: every block edge is squared off to the lidar's lattice, so
 * the stepping is simplified; the stair masses' extents and rises (from
 * main, dad, 2508 and the plaza's lidar); the gateway's pylon sizes and
 * taper (dad, scaled to the 17.7 m lidar top); the arcade's arches.
 *
 * Photos (evidence, Wikimedia Commons):
 *  main "Nelson Fine Arts Center, Arizona State University, 10th Street,
 *       Tempe, AZ.jpg", w_lemay, CC BY-SA 2.0
 *       https://commons.wikimedia.org/wiki/File:Nelson_Fine_Arts_Center,_Arizona_State_University,_10th_Street,_Tempe,_AZ.jpg
 *  2508 "... Tempe, AZ - 54438012508.jpg", w_lemay, CC BY-SA 2.0
 *       https://commons.wikimedia.org/wiki/File:Nelson_Fine_Arts_Center,_Arizona_State_University,_10th_Street,_Tempe,_AZ_-_54438012508.jpg
 *  dad  "Arizona State University Art Museum - Arizona State University -
 *       Tempe, AZ - DSC05997.JPG", Daderot, CC0
 *       https://commons.wikimedia.org/wiki/File:Arizona_State_University_Art_Museum_-_Arizona_State_University_-_Tempe,_AZ_-_DSC05997.JPG
 *  sh5  "ASU Art Museum-5.jpg", sean hobson, CC BY 2.0 (the fly tower and
 *       brick arcade)
 *       https://commons.wikimedia.org/wiki/File:ASU_Art_Museum-5.jpg
 * USGS NAIP orthophoto (public domain) for the plan. No look-only sources.
 * No commercial imagery.
 *
 * Doubts: the blocks are squared to a coarse lattice; the east and north
 * faces are only seen from afar. Elevation 0: the plaza is sunken about a
 * metre and the map's terrain shows it; the site is otherwise flat.
 * Night: the few windows glow; the gateway is floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { capPoly, ccw, prism, save, type XY } from './atl-flatiron-building'

const mauve = new Part(), conc = new Part(), brick = new Part(), steel = new Part(), win = new Part()

function face(p: Part, q: V3[], want: V3) {
  const b = [q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]], c = [q[2][0] - q[0][0], q[2][1] - q[0][1], q[2][2] - q[0][2]]
  const g = [b[1] * c[2] - b[2] * c[1], b[2] * c[0] - b[0] * c[2], b[0] * c[1] - b[1] * c[0]]
  const r = g[0] * want[0] + g[1] * want[1] + g[2] * want[2] < 0 ? [...q].reverse() : q
  if (r.length === 3) p.tri(r[0], r[1], r[2])
  else p.quad(r[0], r[1], r[2], r[3])
}
const box = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bev = 0.25) => prism(p, ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]), z0, z1, p, bev)

// ── the base: the whole outline at 5.5 m, brick along the curved south ──
const ring: XY[] = ccw([
  [43.0, 27.3], [43.3, 9.8], [47.4, 9.8], [47.6, -8.4], [42.8, -8.4], [42.7, -28.9], [41.0, -29.7], [41.5, -32.4], [36.8, -33.5], [29.6, -33.5],
  [20.9, -32.7], [11.5, -30.5], [2.8, -26.3], [-5.6, -20.7], [-11.1, -13.7], [-16.6, -5.8], [-19.0, 2.9], [-21.0, 8.9], [-33.1, 14.7], [-37.7, 12.3],
  [-42.6, 14.0], [-48.3, 13.0], [-48.4, 21.6], [-57.4, 21.4], [-57.2, 15.9], [-51.0, 15.8], [-50.5, -12.1], [-57.0, -12.3], [-56.8, -18.5],
  [-47.4, -18.4], [-47.4, -21.7], [-87.5, -21.7], [-87.5, -18.7], [-78.5, -18.4], [-78.4, -8.9], [-72.3, -8.8], [-72.3, -6.1], [-69.3, -5.9],
  [-69.3, 1.5], [-69.4, 9.1], [-72.7, 9.2], [-72.7, 12.1], [-78.7, 12.0], [-78.7, 21.2], [-87.8, 21.1], [-87.8, 24.1], [-60.4, 24.5],
  [-60.5, 33.0], [-42.2, 33.3], [-42.1, 26.6], [21.2, 28.8], [20.8, 27.0],
])
const BASE = 5.5
const curved = (a: XY, b: XY) => a[1] < 3 && b[1] < 3 && a[0] > -20 && b[0] > -20 && a[0] < 42 && b[0] < 42 && Math.min(a[1], b[1]) < -5
for (let i = 0; i < ring.length; i++) {
  const a = ring[i], b = ring[(i + 1) % ring.length], ex = b[0] - a[0], ey = b[1] - a[1], L = Math.hypot(ex, ey)
  const p = curved(a, b) ? brick : mauve
  face(p, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], BASE], [a[0], a[1], BASE]], [ey, -ex, 0])
  if (p === brick) {
    // the arcade: round-headed openings, about 4 m wide on 5 m centres
    const n = Math.floor(L / 5), t: XY = [ex / L, ey / L], o: XY = [(ey / L) * 0.06, (-ex / L) * 0.06]
    for (let k = 0; k < n; k++) {
      const s = ((k + 0.5) * L) / n, w = 1.8, zs = 2.6
      const P = (u: number, z: number): V3 => [a[0] + t[0] * (s + u) + o[0], a[1] + t[1] * (s + u) + o[1], z]
      const pts: V3[] = [P(-w, 0), P(w, 0)]
      for (let j = 0; j <= 6; j++) pts.push(P(w * Math.cos((j / 6) * Math.PI), zs + w * Math.sin((j / 6) * Math.PI)))
      for (let j = 1; j < pts.length - 1; j++) face(steel, [pts[0], pts[j], pts[j + 1]], [o[0], o[1], 0])
    }
  }
}
capPoly(mauve, ring, BASE, true)

// ── the stepped masses above it (lidar heights) ──
box(mauve, -78.5, -50.5, -21.7, 21.2, BASE, 6.7)
box(mauve, -58, -50.5, -9, 9, 6.7, 9.7)
box(mauve, -48.4, -19, 14.5, 26.6, BASE, 13.7)
box(mauve, -19, 14, 15, 27.6, BASE, 11.2)
box(mauve, -14, 16, -9, 15, BASE, 8.7)
box(mauve, 18, 42.7, -24, -7, BASE, 12.2) // the theatre
box(mauve, 20, 42.7, -7, 9.5, BASE, 23.7) // the fly tower
box(mauve, 16.5, 20, -7, 9.5, BASE, 29.7) // its taller west slab
box(mauve, 21, 43, 9.5, 27.3, BASE, 7.7)
box(mauve, 42.8, 47.5, -8.4, 9.8, BASE, 6.0)
// small square openings in rows on the north mass's south face and the
// stair walls (main, dad)
for (let x = -46; x < -22; x += 1.6) for (const z of [9.2, 10.6]) face(win, [[x, 14.44, z], [x + 0.7, 14.44, z], [x + 0.7, 14.44, z + 0.7], [x, 14.44, z + 0.7]], [0, -1, 0])
for (const x of [-12, -6, 0, 6, 12]) face(win, [[x - 1.1, 27.66, 7], [x + 1.1, 27.66, 7], [x + 1.1, 27.66, 9], [x - 1.1, 27.66, 9]], [0, 1, 0])
// the theatre's lobby glazing behind the arcade (dark lattice screens in sh5)
face(win, [[-13.94, -6, 6.2], [-13.94, 12, 6.2], [-13.94, 12, 8.0], [-13.94, -6, 8.0]], [-1, 0, 0])

// ── the plaza's stair masses ──
/** A stair mass: a wedge rising from z0 at y=ya to z1 at y=yb (or along x), with stepped treads and stepped side walls. */
function stair(x0: number, x1: number, y0: number, y1: number, z1: number, dir: 'n' | 'w', steps = 8) {
  for (let k = 0; k < steps; k++) {
    // the plaza sits about a metre above the model's lowest ground (map terrain)
    const Z0 = 1.2, za = Z0 + ((z1 - Z0) * k) / steps, zb = Z0 + ((z1 - Z0) * (k + 1)) / steps
    if (dir === 'n') {
      const ya = y0 + ((y1 - y0) * k) / steps, yb = y0 + ((y1 - y0) * (k + 1)) / steps
      // the riser, the tread, and the side walls' step
      face(conc, [[x0, ya, za], [x1, ya, za], [x1, ya, zb], [x0, ya, zb]], [0, -1, 0])
      face(conc, [[x0, ya, zb], [x1, ya, zb], [x1, yb, zb], [x0, yb, zb]], [0, 0, 1])
      face(mauve, [[x0, ya, 0], [x0, y1, 0], [x0, y1, zb], [x0, ya, zb]], [-1, 0, 0])
      face(mauve, [[x1, ya, 0], [x1, y1, 0], [x1, y1, zb], [x1, ya, zb]], [1, 0, 0])
    } else {
      const xa = x1 - ((x1 - x0) * k) / steps, xb = x1 - ((x1 - x0) * (k + 1)) / steps
      face(conc, [[xa, y0, za], [xa, y1, za], [xa, y1, zb], [xa, y0, zb]], [1, 0, 0])
      face(conc, [[xa, y0, zb], [xa, y1, zb], [xb, y1, zb], [xb, y0, zb]], [0, 0, 1])
      face(mauve, [[xa, y0, 0], [x0, y0, 0], [x0, y0, zb], [xa, y0, zb]], [0, -1, 0])
      face(mauve, [[xa, y1, 0], [x0, y1, 0], [x0, y1, zb], [xa, y1, zb]], [0, 1, 0])
    }
  }
}
stair(-36, -24, -6, 14.5, 8.7, 'n', 9) // the big stair up to the north terraces
stair(-46, -37, -9, -5, 5.5, 'w', 6) // the small stair up to the gateway
// the triangular wall between them, with its grid of small square holes
{
  const x = -36.6, pts: V3[] = [[x, -9, 0], [x, 8, 0], [x, 8, 8.7]]
  face(mauve, pts, [-1, 0, 0]); face(mauve, [[x + 0.6, -9, 0], [x + 0.6, 8, 0], [x + 0.6, 8, 8.7]], [1, 0, 0])
  face(mauve, [[x, -9, 0], [x, 8, 8.7], [x + 0.6, 8, 8.7], [x + 0.6, -9, 0]], [-0.5, -1, 1])
  for (let i = 0; i < 4; i++) for (let j = 0; j <= i; j++) {
    const y = 6 - i * 2.2 + j * 0.1, z = 1.0 + j * 1.1
    if (z + 0.6 > ((y + 9) / 17) * 8.7 - 0.5) continue
    face(win, [[x - 0.05, y, z], [x - 0.05, y + 0.6, z], [x - 0.05, y + 0.6, z + 0.6], [x - 0.05, y, z + 0.6]], [-1, 0, 0])
  }
}

// ── the concrete gateway on the plaza's west edge ──
// Two pylons facing east, their inner faces plumb and their outer faces
// tapering to the top; the opening 8 m; the truss across their tops.
const GX0 = -51, GX1 = -44.5, TOPZ = 17.7
box(conc, GX0, GX1, -11, -2.5, 0, 10.3, 0.2) // the south pylon's block
face(win, [[GX1 + 0.05, -9.5, 7.2], [GX1 + 0.05, -5.5, 7.2], [GX1 + 0.05, -5.5, 9.0], [GX1 + 0.05, -9.5, 9.0]], [1, 0, 0])
for (const [yIn, yOut, zb] of [[-2.5, -7.5, 10.3], [5.5, 10, 6.5]] as const) {
  const s = Math.sign(yOut - yIn), yTop = yIn + s * 1.6
  // a tapering slab: plumb inner face at yIn, sloping outer face from yOut at zb to yTop at TOPZ
  const pts: [number, number][] = [[yIn, 0], [yOut, 0], [yOut, zb], [yTop, TOPZ], [yIn, TOPZ]]
  const P = ([y, z]: [number, number], x: number): V3 => [x, y, z]
  for (const [x, nx] of [[GX1, 1], [GX0, -1]] as const) for (let k = 1; k < pts.length - 1; k++) face(conc, [P(pts[0], x), P(pts[k], x), P(pts[k + 1], x)], [nx, 0, 0])
  const area = pts.reduce((acc, a, k) => { const b = pts[(k + 1) % pts.length]; return acc + a[0] * b[1] - b[0] * a[1] }, 0)
  for (let k = 0; k < pts.length; k++) {
    const a = pts[k], b = pts[(k + 1) % pts.length], sg = area > 0 ? 1 : -1
    // the edge's outward normal in the (y, z) plane
    face(conc, [P(a, GX0), P(b, GX0), P(b, GX1), P(a, GX1)], [0, sg * (b[1] - a[1]), -sg * (b[0] - a[0])])
  }
}
// the truss: top and bottom chords and four diagonals
{
  const y0 = -2.5, y1 = 5.5, xa = -48.3, xb = -47.2
  box(steel, xa, xb, y0, y1, TOPZ - 0.6, TOPZ, 0.05)
  box(steel, xa, xb, y0, y1, TOPZ - 2.4, TOPZ - 1.9, 0.05)
  for (let k = 0; k < 4; k++) {
    const ya = y0 + (k * (y1 - y0)) / 4, yb = y0 + ((k + 1) * (y1 - y0)) / 4, up = k % 2 === 0
    const za = up ? TOPZ - 1.9 : TOPZ - 0.6, zb = up ? TOPZ - 0.6 : TOPZ - 1.9
    for (const [x, nx] of [[xa, -1], [xb, 1]] as const) face(steel, [[x, ya, za], [x, ya + 0.35, za], [x, yb, zb], [x, yb - 0.35, zb]], [nx, 0, 0])
  }
}

await save('phx-nelson-fine-arts-center', 'Nelson Fine Arts Center', [
  { part: mauve, material: finish('nelson-mauve', 0xbaa0a6) },
  { part: conc, material: { ...finish('nelson-concrete', 0xc4bfb5), floodlight: (p) => (p[0] < -43 && p[0] > -52 ? 0.8 : 0) } },
  { part: brick, material: finish('nelson-brick', 0xb46c55) },
  { part: steel, material: finish('nelson-steel', 0x5e5552) },
  { part: win, material: PALETTE.window },
], { height: 29.7, anchor: [33.4186734, -111.9382932], bearing: 0 }, 5000)
