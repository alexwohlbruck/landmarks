/**
 * Dome of the Rock and Western Wall, Old City of Jerusalem: procedural, CC0-1.0.
 * bun generators/jerusalem-dome-of-the-rock.ts
 *
 * Writes two models, one per ground level, as nyc-bethesda-terrace does. The
 * map lifts a flat-based model by the terrain under it, read on a 7 x 7 grid
 * over its plan, so one model spanning the Western Wall plaza and the Temple
 * Mount esplanade about 12 m above it would have its upper level lifted twice
 * and float:
 * - jerusalem-dome-of-the-rock, the esplanade level: the upper platform (its
 *   4 m retaining walls and top, the eight stairs and their free-standing
 *   arcades, the qanatir), the Dome of the Rock, the Dome of the Chain and the
 *   four small domed shrines on the platform. y = 0 is the esplanade at the
 *   platform's foot. Anchor: the octagon's centre.
 * - jerusalem-dome-of-the-rock-plaza, the plaza level: the prayer section of
 *   the Western Wall (the retaining wall's face, OSM's wall outline), the
 *   low wall at the edge of the prayer area, and the covered Mughrabi Bridge
 *   ramp up to the Mughrabi Gate. y = 0 is the prayer area's paving at the
 *   foot of the wall. Anchor: the middle of the prayer face.
 * Both stand at elevation 0 on their own ground. The map's terrain here is
 * Mapterhorn at z13 (about 8 m a pixel; tools/terrain.ts could not check the
 * site: no z15 tiles). It shows the plaza only about 7 m below the esplanade
 * and puts the wall's own line on the slope between, so on the map the wall
 * stands on ground a few metres too high and its top rises some 5 to 10 m
 * above the esplanade behind, where the real top is about 7 m above it. The
 * models stay true to the photos, as docs/reference.md asks.
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built in true
 * orientation from OSM.
 *
 * OSM (replaced; ODbL):
 * - Upper: way/4709536 (the octagon, height 17) and way/291836699 (its dome
 *   part, 34); way/45099263 (Dome of the Chain) and its parts way/749005396,
 *   way/749005397 and the twelve columns way/749521336-347; the arcades
 *   way/748953265, 748953254, 748953257, 291841778, 748953252, 748953246,
 *   748953248, 748953239; the small domes way/137729566 (Ascension),
 *   291836680 (Prophet), 291836681 (Tablets), 291836713 (al-Khalili).
 *   The platform is barrier=retaining_wall way/137725307, not a building, so
 *   it is drawn but not listed. relation/19253751 (type=site, named "Dome of
 *   the Rock", whose outers are the compound's walls) is left alone.
 * - Plaza: way/817206833 (Western Wall, building=wall, height 20). The prayer
 *   area's edge (barrier=wall way/45081552) and the ramp (highway=steps
 *   way/277508271) are not buildings; they set where those are drawn.
 *
 * Heights. Published: the wall's exposed section 19 m above the plaza and
 * 57 m long (Wikipedia, "Western Wall"); the dome's diameter 20.2 m inside
 * (Wikipedia, "Dome of the Rock"), the building about 36 m high; the Dome of
 * the Chain 14 m across (Wikipedia). From photos (all estimated):
 * - Dome of the Rock, from "Dome of the Rock from the North" (square on, the
 *   octagon's 49 m across the flats as scale): walls 11.5 m to the parapet
 *   (the lower 3.6 m white marble, a tiled zone with seven arched windows a
 *   face, a dark-blue inscription band at the top); a low lead roof to the
 *   drum at 13 m; the drum r 10.9 to 20.6 m with sixteen windows; a gilded
 *   lip r 11.9; the dome r 11.4, its rise 1.23 times its radius (the photo's
 *   ratio), crown 35 m; finial to 38.5 m. Porches on the four doors (N, E,
 *   S, W), 7.5 m high, from "Dome of the Rock west.jpg".
 * - Upper platform 4 m above the esplanade (about 25 steps in the photos);
 *   arcades 7 m high with 3 to 5 arches each, stairs running 8 m out.
 * - Dome of the Chain, from Godot13's south photo: an 11-sided outer
 *   colonnade to 3.8 m, the tiled arcade band to 6.4 m, a hexagonal drum
 *   to 8.2 m and a lead dome r 2.9 to 11.2 m (OSM's 15 m reads high).
 * - Small domes (no photos measured): Ascension 5 m walls, dome to 8.5 m;
 *   al-Khalili 5 m, dome to 8.5 m; Prophet and Tablets 3 m, to 5 m.
 * - Western Wall: 19 m; the lower 8 m Herodian ashlars (seven courses,
 *   Wikipedia), drawn a shade darker. The esplanade, and the Mughrabi Gate
 *   the ramp climbs to, about 12 m above the prayer area (the ramp's top in
 *   two photos from the Jewish Quarter). The prayer area's edge wall 1.2 m.
 *
 * Simplified or estimated: the wall outline's stepped back (east) edge,
 * hidden behind the buildings on the esplanade, is drawn straight. OSM puts
 * the dome part 4.7 m off the octagon's centre; the drum and dome are drawn
 * concentric, as they are. The octagon
 * is drawn regular (R 26.5 m, turned as OSM has it). The platform is 4 m all
 * round, though it is lower in the north-west where it meets the bedrock.
 * The tilework, inscriptions and window grilles are colour fields; the
 * arcades' columns are square piers; the ramp's lattice sides are solid.
 *
 * Left out: al-Aqsa Mosque (its southern end stands on the compound's south
 * wall, where the map's z13 terrain falls 15-20 m across its footprint and
 * would warp it; it wants its own placement), the Islamic Museum, the
 * minarets, the Mughrabi Gate building, the southern continuation of the
 * wall (way/620099941), the Wilson's Arch hall, the trees, the summer pulpit.
 *
 * Photos (Wikimedia Commons):
 * - "Jerusalem-2013(2)-View of the Dome of the Rock & Temple Mount 02.jpg",
 *   Godot13, CC BY-SA 4.0 (from the Mount of Olives, east)
 * - "Dome of the Rock seen from the Mount of Olives (12395649153).jpg", askii,
 *   CC BY-SA 2.0 (east, with al-Aqsa)
 * - "Dome of the Rock from the North.jpg", Fjmustak, CC BY-SA 4.0
 * - "Dome of the Rock west.jpg", Yaakov Shoham, public domain
 * - "Dome of the Rock, South Facade (2008) 06.jpg", Godot13, CC BY-SA 4.0
 * - "Jerusalem-2013(2)-Temple Mount-Dome of the Chain (south exposure).jpg",
 *   Godot13, CC BY-SA 4.0
 * - "Western Wall Plaza - panoramio.jpg", CyberCop, CC BY 3.0 (plaza, west)
 * - "Western Wall and Dome of the Rock Jerusalem -10 (33400391921).jpg",
 *   Gary Bembridge, CC BY 2.0 (from above, west)
 * - "Western Wall Plaza (10804490996).jpg", Jorge Láscar, CC BY 2.0 (ramp)
 * - "Dome of the Rock night view.JPG", Zxc0505, CC BY-SA 3.0 (night)
 * - "Western Wall at night 2022.jpg", DGtal, CC BY-SA 4.0 (night)
 *
 * Night: the Dome of the Rock is floodlit all over (the gilded dome, the
 * drum and the tiled walls), its porch doors glow; the platform's walls and
 * arcades catch some light; the Western Wall is floodlit from the plaza.
 * The facade's arched windows read dark at night, so they are a dark tile
 * colour rather than `window`.
 */
import clipping from 'polygon-clipping'
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { bandTris, beam, ccw, lathe, ngon, offset, prism, type XY } from './sf-de-young'

const TAU = Math.PI * 2
const DATA = {"upper":{"platform":[[83.3,-51.3],[83.5,-62.0],[63.3,-66.6],[63.1,-54.9],[62.9,-53.4],[56.6,-54.4],[50.0,-55.5],[50.4,-57.1],[20.6,-62.1],[20.3,-60.5],[13.3,-61.6],[6.5,-62.8],[6.8,-64.5],[-7.1,-67.2],[-7.7,-64.4],[-10.3,-64.9],[-9.8,-67.7],[-20.6,-69.6],[-21.6,-64.6],[-38.7,-67.9],[-39.0,-66.7],[-42.9,-67.4],[-43.8,-62.6],[-44.8,-57.9],[-46.9,-58.3],[-47.9,-53.0],[-51.1,-37.1],[-53.6,-23.0],[-35.1,-19.8],[-32.9,-19.3],[-34.4,-12.0],[-36.0,-4.8],[-38.2,-5.3],[-56.5,-9.2],[-56.7,-8.5],[-57.5,-4.2],[-58.7,1.7],[-60.5,10.8],[-62.9,22.9],[-63.0,23.5],[-60.6,24.0],[-61.4,28.1],[-63.8,27.7],[-64.0,28.6],[-74.0,72.7],[-71.7,73.0],[-72.0,74.9],[-58.7,76.5],[-56.3,76.8],[-57.3,85.1],[-58.4,93.3],[-46.3,94.8],[-44.5,95.0],[-21.4,97.9],[-21.0,94.4],[-15.6,95.0],[-16.0,98.6],[-9.8,99.4],[-3.5,100.2],[6.3,101.4],[12.1,102.1],[18.0,102.8],[20.7,103.2],[21.0,100.6],[28.4,101.5],[28.1,104.1],[33.0,104.7],[38.0,105.3],[45.2,106.2],[79.1,110.6],[79.0,97.7],[79.0,86.0],[78.9,70.3],[78.9,61.0],[78.8,55.9],[80.1,55.8],[80.8,20.1],[79.8,20.0],[80.0,10.2],[80.2,2.0],[82.4,2.0],[82.8,-19.7],[83.2,-45.9]],"chain":[[34.5,7.9],[36.0,11.3],[39.1,13.5],[42.9,13.9],[46.3,12.4],[48.5,9.3],[48.9,5.6],[47.4,2.1],[44.3,-0.1],[40.5,-0.5],[37.1,1.1],[34.8,4.1]],"arcades":{"way/748953265":[[6.5,-62.8],[6.8,-64.5],[13.6,-63.3],[20.6,-62.1],[20.3,-60.5],[13.3,-61.6]],"way/748953254":[[-46.9,-58.3],[-44.8,-57.9],[-43.8,-62.6],[-42.9,-67.4],[-45.0,-67.8],[-46.0,-63.0]],"way/748953257":[[-32.9,-19.3],[-35.1,-19.8],[-36.6,-12.5],[-38.2,-5.3],[-36.0,-4.9],[-34.4,-12.0]],"way/291841778":[[63.1,-54.9],[62.9,-53.4],[56.6,-54.4],[50.1,-55.5],[50.3,-57.1],[56.9,-56.0]],"way/748953252":[[80.8,20.1],[82.3,10.3],[82.4,2.0],[80.2,2.0],[80.0,10.2],[79.8,20.0]],"way/748953246":[[-3.5,100.2],[-3.8,102.3],[-10.1,101.5],[-16.3,100.7],[-16.0,98.6],[-9.8,99.4]],"way/748953248":[[28.1,104.1],[27.8,106.2],[32.7,106.8],[37.7,107.4],[38.0,105.3],[33.0,104.7]],"way/748953239":[[-56.3,76.8],[-58.7,76.5],[-59.7,84.8],[-60.8,93.0],[-58.3,93.3],[-57.3,85.1]]},"domes":{"way/137729566":[[-41.8,21.0],[-43.2,22.7],[-43.5,24.4],[-42.4,26.7],[-40.0,27.7],[-38.1,27.2],[-36.7,25.8],[-36.4,23.7],[-37.5,21.5],[-39.8,20.5]],"way/291836680":[[-24.1,19.4],[-23.4,20.2],[-23.4,21.3],[-24.3,22.0],[-25.4,21.9],[-26.1,21.1],[-26.0,20.0],[-25.2,19.3]],"way/291836681":[[-42.0,80.9],[-41.5,82.1],[-42.0,83.4],[-43.3,83.9],[-44.5,83.4],[-45.1,82.2],[-44.6,80.9],[-43.3,80.4]],"way/291836713":[[-54.7,46.3],[-46.4,47.8],[-44.5,37.7],[-52.8,36.2]]}},"lower":{"wall":[[-5.2,28.4],[0.5,-8.3],[5.0,-29.7],[11.2,-28.6],[13.4,-28.2],[4.8,21.1],[-2.1,60.5],[-10.7,58.9],[-10.5,55.7]],"edge":[[-47.7,-38.7],[-31.2,-27.1],[-33.5,-14.0],[-37.3,8.9],[-23.9,11.2]],"ramp":[[-38.2,-48.8],[-37.6,-39.9],[-25.7,-30.1],[-20.5,-26.6],[-10.3,-24.7],[-1.8,-23.1],[0.4,-33.9],[5.7,-33.4]]}} as const

type Mat = { part: Part; material: MaterialSpec }
const pts = (r: readonly (readonly number[])[]): XY[] => r.map((p) => [p[0], p[1]] as XY)
const centre = (r: XY[]): XY => [r.reduce((s, p) => s + p[0], 0) / r.length, r.reduce((s, p) => s + p[1], 0) / r.length]

/** Walls round a ring from z0 to z1, each edge cut into pieces no longer than `seg`, so the map's drape can bend a long base. */
function walls(p: Part, ring0: XY[], z0: number, z1: number, seg = 5) {
  const ring = ccw(ring0)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / seg))
    for (let k = 0; k < n; k++) {
      const u = k / n, v = (k + 1) / n
      const A: XY = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u], B: XY = [a[0] + (b[0] - a[0]) * v, a[1] + (b[1] - a[1]) * v]
      p.quad([...A, z0], [...B, z0], [...B, z1], [...A, z1])
    }
  }
}

/** A flat top over a ring, cut into a grid of `cell` metres so it bends with the map's drape. */
function top(p: Part, ring: XY[], z: number, cell = 12) {
  const xs = ring.map((q) => q[0]), ys = ring.map((q) => q[1])
  const n: V3 = [0, 0, 1]
  for (let x = Math.floor(Math.min(...xs) / cell) * cell; x < Math.max(...xs); x += cell) {
    for (let y = Math.floor(Math.min(...ys) / cell) * cell; y < Math.max(...ys); y += cell) {
      const sq: XY[] = [[x, y], [x + cell, y], [x + cell, y + cell], [x, y + cell]]
      for (const poly of clipping.intersection([ccw(ring)] as any, [sq] as any) as XY[][][]) {
        for (const [a, b, c] of bandTris(poly.map((r) => r.slice(0, -1)))) p.tri([...a, z], [...b, z], [...c, z], undefined, undefined, undefined, [n, n, n])
      }
    }
  }
}

/** A pointed (two-centred) arch outline in a face's (u, v): `w` wide centred on u = 0, from v = b, springing at s, apex at t. */
function arch(w: number, b: number, s: number, t: number, n = 4): XY[] {
  const h = w / 2, rise = t - s
  if (rise <= h * 1.001) {
    // round (or nearly): a semicircle squashed to the rise
    const out: XY[] = [[-h, b], [h, b]]
    for (let i = 0; i <= 2 * n; i++) { const a = (Math.PI * i) / (2 * n); out.push([h * Math.cos(a), s + rise * Math.sin(a)]) }
    out.push([-h, b])
    return out.slice(0, -1)
  }
  const R = (h * h + rise * rise) / (2 * h), cx = h - R, a1 = Math.atan2(rise, -cx)
  const out: XY[] = [[-h, b], [h, b]]
  for (let i = 0; i < n; i++) { const a = (a1 * i) / n; out.push([cx + R * Math.cos(a), s + R * Math.sin(a)]) }
  out.push([0, t])
  for (let i = n - 1; i >= 0; i--) { const a = (a1 * i) / n; out.push([-(cx + R * Math.cos(a)), s + R * Math.sin(a)]) }
  return out
}

/** A flat shape in (u, v) laid on the vertical face from a to b (counter-clockwise ring, outward to the right), `lift` proud of it. */
function onFace(p: Part, a: XY, b: XY, u0: number, shape: XY[], lift: number, z0 = 0) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const nrm: V3 = [t[1], -t[0], 0]
  const P = ([u, v]: XY): V3 => [a[0] + t[0] * (u0 + u) + nrm[0] * lift, a[1] + t[1] * (u0 + u) + nrm[1] * lift, z0 + v]
  for (const [A, B, C] of bandTris([shape.map(([u, v]) => [u, v] as XY)])) {
    // bandTris works in (x, y) = (u, v); emit facing outward
    p.tri(P(A), P(B), P(C), undefined, undefined, undefined, [nrm, nrm, nrm])
  }
}

/** A vertical screen along a to b, `d` thick, from z0: the counter-clockwise outline `ring` in (u, v), with its edges as reveals. */
function screen(p: Part, a: XY, b: XY, d: number, z0: number, ring: XY[]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const nrm: XY = [t[1], -t[0]]
  const P = ([u, v]: XY, side: number): V3 => [a[0] + t[0] * u + nrm[0] * side * d / 2, a[1] + t[1] * u + nrm[1] * side * d / 2, z0 + v]
  const nF: V3 = [nrm[0], nrm[1], 0], nB: V3 = [-nrm[0], -nrm[1], 0]
  for (const [A, B, C] of bandTris([ring])) {
    p.tri(P(A, 1), P(B, 1), P(C, 1), undefined, undefined, undefined, [nF, nF, nF])
    p.tri(P(A, -1), P(C, -1), P(B, -1), undefined, undefined, undefined, [nB, nB, nB])
  }
  for (let i = 0; i < ring.length; i++) {
    const A = ring[i], B = ring[(i + 1) % ring.length], du = B[0] - A[0], dv = B[1] - A[1], l = Math.hypot(du, dv) || 1
    const n3: V3 = [(t[0] * dv) / l, (t[1] * dv) / l, -du / l]
    p.tri(P(A, 1), P(B, 1), P(B, -1), undefined, undefined, undefined, [n3, n3, n3])
    p.tri(P(A, 1), P(B, -1), P(A, -1), undefined, undefined, undefined, [n3, n3, n3])
  }
}

/** The two long sides of an OSM arcade outline: its centre line ends and its thickness. */
function axis(r: XY[]): { a: XY; b: XY; d: number } {
  const c = centre(r)
  let best: [XY, XY] = [r[0], r[1]], bl = 0
  for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++) {
    const l = Math.hypot(r[j][0] - r[i][0], r[j][1] - r[i][1])
    if (l > bl) { bl = l; best = [r[i], r[j]] }
  }
  const dir: XY = [(best[1][0] - best[0][0]) / bl, (best[1][1] - best[0][1]) / bl]
  const proj = r.map((q) => (q[0] - c[0]) * dir[0] + (q[1] - c[1]) * dir[1])
  const across = r.map((q) => Math.abs((q[0] - c[0]) * -dir[1] + (q[1] - c[1]) * dir[0]))
  const lo = Math.min(...proj), hi = Math.max(...proj)
  return { a: [c[0] + dir[0] * lo, c[1] + dir[1] * lo], b: [c[0] + dir[0] * hi, c[1] + dir[1] * hi], d: Math.min(2, 2 * Math.max(...across)) }
}

// ---------------------------------------------------------------------------
// The esplanade level

const PLAT_H = 4

function upper(): Mat[] {
  const stone = new Part(), tile = new Part(), dark = new Part(), gold = new Part(), lead = new Part(), door = new Part()
  const platform = pts(DATA.upper.platform)

  // The upper platform: retaining walls and its paved top.
  walls(stone, platform, 0, PLAT_H)
  top(stone, platform, PLAT_H)

  // The qanatir: a free-standing arcade at the head of each stair, the stair running out and down from it.
  const pc = centre(platform)
  for (const ring of Object.values(DATA.upper.arcades)) {
    let { a, b, d } = axis(pts(ring))
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    let nrm: XY = [t[1], -t[0]]
    const mid: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    if ((mid[0] - pc[0]) * nrm[0] + (mid[1] - pc[1]) * nrm[1] < 0) { [a, b] = [b, a]; nrm = [-nrm[0], -nrm[1]] }
    const H = 7, n = Math.max(3, Math.round(L / 3.8)), pier = 1.3, span = (L - 2 * pier) / n, col = 0.7
    // The outline: piers at the ends, columns between, the arches open to the platform.
    const comb: XY[] = [[0, 0]]
    for (let i = 0; i < n; i++) {
      const u0 = pier + i * span + (i === 0 ? 0 : col / 2), u1 = pier + (i + 1) * span - (i === n - 1 ? 0 : col / 2)
      const c = (u0 + u1) / 2
      // the arch's outline from its right foot over the top to its left foot, walked left to right along the bottom edge
      const arc = arch(u1 - u0, 0, 4.3, 5.9, 3).map(([u, v]) => [u + c, v] as XY)
      comb.push([u0, 0], ...arc.slice(2).reverse().filter(([, v]) => v > 0), [u1, 0])
    }
    comb.push([L, 0], [L, H], [0, H])
    screen(stone, a, b, Math.max(1.4, d * 0.8), PLAT_H, comb)
    // The stair: a wedge 8 m out from the arcade's outer face, from the platform's top to the esplanade.
    const run = 8, off = Math.max(1.4, d * 0.8) / 2
    const A: XY = [a[0] + nrm[0] * off, a[1] + nrm[1] * off], B: XY = [b[0] + nrm[0] * off, b[1] + nrm[1] * off]
    const A2: XY = [A[0] + nrm[0] * run, A[1] + nrm[1] * run], B2: XY = [B[0] + nrm[0] * run, B[1] + nrm[1] * run]
    stone.quad([...A2, 0], [...B2, 0], [...B, PLAT_H], [...A, PLAT_H])
    stone.tri([...A, 0], [...A2, 0], [...A, PLAT_H])
    stone.tri([...B2, 0], [...B, 0], [...B, PLAT_H])
  }

  // The Dome of the Rock, on the platform. A regular octagon, R 26.5 m, its corners turned as OSM has them.
  const z0 = PLAT_H, R = 26.5, a0 = (76.6 * Math.PI) / 180
  const oct = ngon(0, 0, R, 8, a0)
  const WALL = 11.5
  prism(stone, oct, z0, z0 + 3.6, null)
  prism(tile, oct, z0 + 3.6, z0 + WALL - 0.4, null)
  // coping and the roof inside the parapet
  const inner = offset(oct, -0.6)
  prism(tile, oct, z0 + WALL - 0.4, z0 + WALL, null)
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8
    tile.quad([...oct[i], z0 + WALL], [...oct[j], z0 + WALL], [...inner[j], z0 + WALL], [...inner[i], z0 + WALL])
  }
  // lead roof: from inside the parapet up to the drum, a 32-sided ring resampled on the octagon
  const N = 32, DR = 10.9
  const ringAt = (r: (ang: number) => number, z: number): V3[] => Array.from({ length: N }, (_, k) => {
    const ang = a0 + (TAU * k) / N
    return [r(ang) * Math.cos(ang), r(ang) * Math.sin(ang), z]
  })
  const apothem = (R - 0.6) * Math.cos(Math.PI / 8)
  const octR = (ang: number) => { const rel = ((ang - a0) % (TAU / 8) + TAU / 8) % (TAU / 8) - Math.PI / 8; return apothem / Math.cos(rel) }
  lead.loft([ringAt(octR, z0 + WALL - 0.5), ringAt(() => DR, z0 + 13)])
  // the drum, its windows, the gilded lip and the dome
  lathe(tile, [[DR, z0 + 12.6], [DR, z0 + 20.6]], N, [0, 0], a0, false)
  const facet = (k: number): [XY, XY] => {
    const p = (i: number): XY => [DR * Math.cos(a0 + (TAU * i) / N), DR * Math.sin(a0 + (TAU * i) / N)]
    return [p(k), p(k + 1)]
  }
  for (let k = 0; k < N; k += 2) {
    const [fa, fb] = facet(k)
    const fl = Math.hypot(fb[0] - fa[0], fb[1] - fa[1])
    onFace(dark, fa, fb, fl / 2, arch(1.6, 0, 2.6, 3.6), 0.06, z0 + 15.4)
  }
  lathe(gold, [[DR, z0 + 20.5], [11.9, z0 + 20.7], [11.9, z0 + 21.1], [11.3, z0 + 21.2]], N, [0, 0], a0, false)
  const HD = 14.0, zb = z0 + 21.0
  const prof: [number, number][] = [[11.3, zb + 0.2], [11.6, zb + 1.6], [11.5, zb + 3.4], [11.0, zb + 5.4], [10.0, zb + 7.4], [8.4, zb + 9.4], [6.3, zb + 11.1], [3.8, zb + 12.6], [1.4, zb + 13.6], [0, zb + HD]]
  lathe(gold, prof, N, [0, 0], a0)
  // finial: a stalk with two knobs and the crescent
  const zf = zb + HD - 0.1
  lathe(gold, [[0.35, zf], [0.6, zf + 0.5], [0.3, zf + 1.0], [0.18, zf + 1.4], [0.45, zf + 1.8], [0.18, zf + 2.2], [0.12, zf + 2.8], [0, zf + 2.9]], 8)
  for (let i = 0; i < 8; i++) {
    const t0 = Math.PI * 0.15 + (Math.PI * 1.7 * i) / 8, t1 = Math.PI * 0.15 + (Math.PI * 1.7 * (i + 1)) / 8
    const P = (t: number, r: number): V3 => [0, -Math.sin(t) * r, zf + 3.6 - Math.cos(t) * r]
    beam(gold, P(t0, 0.75), P(t1, 0.75), 0.25, 0.25, [1, 0, 0])
  }

  // Facades: seven arched windows a face, the dark inscription band, and a porch on each door.
  for (let i = 0; i < 8; i++) {
    const A = oct[i], B = oct[(i + 1) % 8], L = Math.hypot(B[0] - A[0], B[1] - A[1])
    const pitch = L / 7.4
    for (let k = 0; k < 7; k++) onFace(dark, A, B, L / 2 + (k - 3) * pitch, arch(pitch * 0.62, 0, 2.4, 3.9), 0.05, z0 + 4.2)
    onFace(dark, A, B, L / 2, [[-L / 2 + 0.3, 0], [L / 2 - 0.3, 0], [L / 2 - 0.3, 1.5], [-L / 2 + 0.3, 1.5]], 0.05, z0 + 9.3)
  }
  for (let k = 0; k < 4; k++) {
    // doors on the faces whose normals point (near) north, west, south and east
    const i = [0, 2, 4, 6][k]
    const A = oct[i], B = oct[(i + 1) % 8], L = Math.hypot(B[0] - A[0], B[1] - A[1])
    const t: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], nrm: XY = [t[1], -t[0]]
    const m: XY = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], w = 5.6, dep = 3.2
    const P0: XY = [m[0] - t[0] * w, m[1] - t[1] * w], P1: XY = [m[0] + t[0] * w, m[1] + t[1] * w]
    const ring: XY[] = [P0, [P0[0] + nrm[0] * dep, P0[1] + nrm[1] * dep], [P1[0] + nrm[0] * dep, P1[1] + nrm[1] * dep], P1]
    prism(stone, ring, z0, z0 + 7.5, stone, 0.3)
    const F0 = ring[1], F1 = ring[2]
    onFace(door, F0, F1, w, arch(3.0, 0, 3.6, 5.8), 0.05, z0)
    onFace(dark, F0, F1, w - 3.3, arch(2.2, 0, 3.2, 4.8), 0.05, z0 + 0.5)
    onFace(dark, F0, F1, w + 3.3, arch(2.2, 0, 3.2, 4.8), 0.05, z0 + 0.5)
  }

  // The Dome of the Chain: 11 piers, the tiled arcade band, the hexagonal drum and its lead dome.
  const cc = centre(pts(DATA.upper.chain)), cr = 7.0
  for (const q of ngon(cc[0], cc[1], cr - 0.5, 11, 0.3)) prism(stone, ngon(q[0], q[1], 0.35, 6), z0, z0 + 3.8, null)
  const band = ngon(cc[0], cc[1], cr - 0.6, 11, 0.3)
  prism(lead, ngon(cc[0], cc[1], cr, 11, 0.3), z0 + 3.8, z0 + 4.1, lead, 0, true)
  prism(tile, band, z0 + 4.1, z0 + 6.2, null)
  prism(lead, ngon(cc[0], cc[1], cr + 0.2, 11, 0.3), z0 + 6.2, z0 + 6.5, lead, 0.15, true)
  const hex = ngon(cc[0], cc[1], 3.2, 6, Math.PI / 6)
  prism(tile, hex, z0 + 6.5, z0 + 8.1, null)
  prism(lead, ngon(cc[0], cc[1], 3.6, 6, Math.PI / 6), z0 + 8.1, z0 + 8.4, lead, 0.15, true)
  lathe(lead, [[2.9, z0 + 8.4], [2.95, z0 + 9.2], [2.6, z0 + 10.0], [1.8, z0 + 10.7], [0.8, z0 + 11.1], [0, z0 + 11.2]], 12, cc)
  lathe(gold, [[0.15, z0 + 11.1], [0.3, z0 + 11.5], [0.1, z0 + 11.9], [0, z0 + 12.3]], 6, cc)

  // The small domes: the outline to its wall height, a drum and a lead dome.
  const small: Record<string, [number, number]> = { 'way/137729566': [5, 8.5], 'way/291836680': [3, 5], 'way/291836681': [3, 5], 'way/291836713': [5, 8.5] }
  for (const [id, ring0] of Object.entries(DATA.upper.domes)) {
    const ring = pts(ring0), [hw, ht] = small[id], c = centre(ring)
    prism(stone, ring, z0, z0 + hw, stone, 0.2)
    const r = Math.min(...ring.map((q) => Math.hypot(q[0] - c[0], q[1] - c[1]))) * 0.8
    const rise = ht - hw
    lathe(lead, [[r, z0 + hw], [r, z0 + hw + rise * 0.2], [r * 0.85, z0 + hw + rise * 0.55], [r * 0.5, z0 + hw + rise * 0.85], [0, z0 + ht]], 12, c)
  }

  const dome = (p: V3, n: V3) => (p[2] > PLAT_H ? (n[2] > 0.85 ? 0.4 : 1) : 0.45)
  const low = (p: V3, n: V3) => (n[2] > 0.85 ? 0 : p[2] > PLAT_H + 0.5 && Math.hypot(p[0], p[1]) < 30 ? 0.9 : 0.35)
  return [
    { part: stone, material: { ...PALETTE.stone, floodlight: low } },
    { part: tile, material: { ...finish('dome-rock-tile', 0x6f90c4), floodlight: dome } },
    { part: dark, material: finish('dome-rock-arch', 0x3f5e98) },
    { part: gold, material: { ...finish('dome-rock-gold', 0xe2b23f, 0.45), floodlight: () => 1 } },
    { part: lead, material: { ...PALETTE.roof, floodlight: dome } },
    { part: door, material: PALETTE.entrance },
  ].filter((p) => p.part.triangles > 0)
}

// ---------------------------------------------------------------------------
// The plaza level

const WALL_H = 19, HERODIAN = 8, GATE = 12

function lower(): Mat[] {
  const ashlar = new Part(), stone = new Part(), timber = new Part(), roof = new Part()
  const wall = pts(DATA.lower.wall)
  walls(ashlar, wall, 0, HERODIAN)
  walls(stone, wall, HERODIAN, WALL_H - 0.6)
  // a slightly inset top course, bevelled, and the top
  prism(stone, wall, WALL_H - 0.6, WALL_H, stone, 0.35)

  // The prayer area's edge: a low wall along OSM's line, in pieces of 5 m or less.
  const edge = pts(DATA.lower.edge)
  for (let i = 0; i + 1 < edge.length; i++) {
    const a = edge[i], b = edge[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.ceil(L / 5)
    for (let k = 0; k < n; k++) {
      const P = (u: number): V3 => [a[0] + ((b[0] - a[0]) * u) / n, a[1] + ((b[1] - a[1]) * u) / n, 0.6]
      beam(stone, P(k), P(k + 1), 0.8, 1.2, [0, 0, 1])
    }
  }

  // The Mughrabi Bridge: a covered timber ramp on its scaffold, rising along OSM's way to the gate.
  const path = pts(DATA.lower.ramp)
  const lens = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1]))
  const total = lens.reduce((s, l) => s + l, 0)
  let s = 0
  const deck = (d: number) => 1.0 + ((GATE - 1.0) * d) / total
  path.slice(1).forEach((b, i) => {
    const a = path[i], h0 = deck(s), h1 = deck(s + lens[i])
    beam(timber, [a[0], a[1], h0 + 1.0], [b[0], b[1], h1 + 1.0], 4.4, 3.4, [0, 0, 1])
    beam(roof, [a[0], a[1], h0 + 2.85], [b[0], b[1], h1 + 2.85], 5.0, 0.3, [0, 0, 1])
    // scaffold legs under the deck, every 8 m or so, where it is off the ground
    const legs = Math.floor(lens[i] / 8)
    for (let k = 1; k <= legs; k++) {
      const u = k / (legs + 1), h = h0 + (h1 - h0) * u
      if (h < 2) continue
      const c: V3 = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, 0]
      beam(timber, c, [c[0], c[1], h - 0.6], 0.6, 0.6, [1, 0, 0])
    }
    s += lens[i]
  })

  const lit = (_p: V3, n: V3) => (n[2] > 0.85 ? 0.3 : 1)
  return [
    { part: ashlar, material: { ...finish('herodian-ashlar', 0xd9cdb5), floodlight: lit } },
    { part: stone, material: { ...PALETTE.stone, floodlight: lit } },
    { part: timber, material: finish('mughrabi-timber', 0xa8875f) },
    { part: roof, material: PALETTE.roof },
  ].filter((p) => p.part.triangles > 0)
}

async function write(name: string, file: string, parts: Mat[], height: number) {
  const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
  if (triangles > 6500) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(name, parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: 0, elevation: 0, height,
  })
  if (glb.length > 250_000) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

await write('Dome of the Rock and Western Wall', 'jerusalem-dome-of-the-rock.glb', upper(), PLAT_H + 21 + 14 + 3.5)
await write('Dome of the Rock and Western Wall (plaza level)', 'jerusalem-dome-of-the-rock-plaza.glb', lower(), WALL_H)
