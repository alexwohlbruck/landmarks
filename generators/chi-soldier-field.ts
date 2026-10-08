/**
 * Soldier Field (1410 Special Olympics Drive, 1924, Holabird & Roche;
 * rebuilt inside its colonnades 2003, Wood + Zapata and Lohan Caprile
 * Goettsch), Chicago — original procedural geometry, CC0-1.0.
 * bun generators/chi-soldier-field.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. The colonnades and the field run at ~177° in OSM, so the catalog
 * bearing is 357 and the long axis is this frame's y. The anchor is the
 * centre of the field (the inner ring way/172686057 of the bowl's
 * multipolygon relation/2305649), 41.862324, -87.616696.
 *
 * Identity, in order: the 2003 bowl rising high above the old stadium and
 * cantilevering out over it (the "spaceship"): the tall single west upper
 * deck whose glass skybox wall leans out over the west colonnade, and the
 * curved band of glass wrapping the south end and the east side under a
 * white roof edge; the 1924 limestone Doric colonnades running the full
 * length of the east and west sides, on a high base, with square end
 * pavilions under small red-tiled roofs; the old curved stone wall round the
 * south end; the video boards over the two end zones.
 *
 * Evidence:
 *  - plan: OSM building relation/16699535 and its parts, all used as drawn:
 *    the field edge (way/172686057), the lower bowl ring way/766775010
 *    (relation/2305649, height 30), the west deck way/766775009 (60), the
 *    east-and-ends crescent way/766775011 (60) with way/766775012 (50)
 *    inside it, the colonnades (west ways 766776876 30 / 766776884 20, east
 *    ways 766776875 30 / 766776883 20, with fragments 766782645, -646,
 *    -652, -656), the south curved wall way/766776882 (20) and the north
 *    end way/766776879 (20). Bowl rings are sampled along 64 rays from the
 *    field centre, as the Bank of America Stadium model does.
 *  - heights: OSM's 60 m for the decks looks like a round number; the
 *    photos put the west rim at about 2.3 times the colonnade's height and
 *    the east and end glass band at about 1.8 times. With the colonnade at
 *    OSM's 20 m that gives a west rim ~46 m and east/ends ~36 m; these are
 *    estimates. Colonnade: base ~6.5 m, columns ~11 m, entablature ~2.5 m
 *    (Warren LeMay's 2023 views, scaled by the 20 m height). South wall
 *    ~14 m (estimate). End pavilions ~21 m plus their roofs.
 *  - colour: buff Bedford limestone; the bowl's blue-green glass, read
 *    light; navy seats; the charcoal video boards; red tile on the
 *    pavilion roofs.
 *
 * Photos (Wikimedia Commons): Soldier_Field,_Chicago,_Illinois_(14207354361)
 * .jpg (Ken Lund, CC BY-SA 2.0, aerial from the south); Searsview.JPG
 * (Pacman5, CC BY-SA 3.0, aerial from the north-west);
 * 2010-02-19_3000x2000_chicago_soldier_field.jpg (J. Crocker, attribution,
 * west colonnade and deck from the north-west); Soldier_Field,_Lake_Shore_
 * Drive,..._November_2023_(54215613907).jpg and (54216896170) (Warren
 * LeMay, CC BY-SA 2.0, east colonnade); Northerly_Island_A_(Soldier_Field)
 * .jpg (Kelly Martin, CC BY-SA 3.0, from the east); 20210220_Soldier_from_
 * NEMA.jpg (TonyTheTiger, CC BY-SA 4.0, from above to the north-west).
 * USGS NAIP for the plan. No commercial imagery.
 *
 * Left out: the field (the map draws it), the seat rows and aisles, the
 * steel trusses under the west deck, the stairs and ramps, the flagpoles,
 * the Doughboy memorial and the north plaza's landscaping.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { finish } from './palette'
import { block, cap, lathe, rect, save, walls, type XY } from './chi-field-museum'

// way/766775010
const LOWER: XY[] = [[-51.1,39.2],[-53.0,18.2],[-53.5,-0.9],[-53.0,-17.6],[-51.0,-34.9],[-48.6,-48.6],[-45.6,-58.9],[-47.4,-79.2],[-44.3,-113.6],[-31.7,-113.7],[-40.5,-109.9],[-40.3,-103.1],[-0.0,-105.3],[-0.1,-106.6],[7.1,-106.6],[18.7,-105.8],[28.6,-103.7],[36.2,-100.9],[43.5,-96.2],[49.2,-89.9],[54.0,-80.8],[45.5,-49.1],[48.5,-31.6],[49.6,2.0],[47.7,26.3],[42.9,50.8],[50.2,86.7],[45.7,92.7],[40.7,97.8],[40.0,96.8],[5.8,118.2],[8.9,125.4],[32.6,117.8],[54.8,104.2],[57.9,112.6],[50.7,117.6],[32.7,122.4],[15.3,125.3],[-7.5,129.0],[-38.9,129.6],[-44.7,129.7],[-45.3,126.2],[-47.4,116.7],[-50.2,76.3],[-47.4,56.0]]
// way/172686057
const FIELD: XY[] = [[25.6,63.0],[21.3,64.3],[12.1,65.2],[2.4,65.4],[-6.6,65.0],[-19.9,64.2],[-25.3,63.5],[-29.8,62.0],[-38.4,73.9],[-39.9,72.8],[-41.3,71.7],[-32.9,59.8],[-35.5,56.1],[-38.1,48.7],[-39.6,38.7],[-40.9,29.6],[-41.7,19.7],[-42.3,9.9],[-42.5,-0.8],[-42.0,-11.6],[-40.9,-21.4],[-39.6,-30.9],[-38.0,-40.7],[-35.8,-50.0],[-34.3,-55.5],[-32.8,-58.6],[-30.2,-61.6],[-35.6,-68.5],[-34.0,-69.5],[-32.4,-70.6],[-26.9,-63.7],[-24.1,-64.7],[-18.5,-65.3],[-9.2,-66.0],[1.0,-66.2],[11.5,-65.7],[20.6,-64.7],[26.2,-63.5],[28.8,-62.6],[34.3,-68.4],[35.8,-67.3],[37.3,-66.1],[31.7,-60.6],[34.6,-56.7],[37.3,-48.6],[38.9,-39.0],[40.2,-29.7],[40.8,-19.4],[41.1,-10.1],[41.1,0.9],[40.8,11.4],[40.2,21.2],[38.7,31.0],[36.7,40.1],[35.4,39.8],[32.5,53.2],[30.7,57.2],[31.7,57.6],[28.8,61.2],[37.0,73.3],[35.4,74.2],[33.9,75.1]]
// way/766775009
const WEST_DECK: XY[] = [[-58.2,111.8],[-59.3,111.3],[-61.0,110.2],[-69.4,103.1],[-71.4,100.8],[-81.0,88.2],[-83.7,83.1],[-88.5,74.2],[-93.2,60.7],[-95.6,50.0],[-96.3,46.7],[-98.2,34.3],[-99.4,22.0],[-100.4,9.8],[-100.3,-2.9],[-100.1,-14.7],[-99.3,-27.6],[-98.0,-39.7],[-96.9,-47.6],[-95.1,-54.9],[-93.1,-62.4],[-87.5,-76.2],[-83.1,-83.4],[-79.6,-89.3],[-69.0,-101.5],[-58.0,-109.6],[-44.0,-116.3],[-44.3,-113.6],[-47.4,-79.2],[-45.6,-58.9],[-48.6,-48.6],[-51.0,-34.9],[-53.0,-17.6],[-53.5,-0.9],[-53.0,18.2],[-51.1,39.2],[-47.4,56.0],[-50.2,76.3],[-47.4,116.7]]
// way/766775011
const EAST_DECK: XY[] = [[-40.3,-103.1],[-40.5,-109.9],[-31.7,-113.7],[-11.1,-120.0],[10.9,-122.1],[28.3,-121.3],[43.8,-116.6],[58.4,-106.3],[68.2,-91.8],[69.1,-89.4],[73.5,-76.4],[79.0,-54.7],[83.0,-30.0],[84.6,-8.6],[83.7,12.3],[81.8,30.4],[75.3,63.0],[68.9,83.5],[62.5,95.6],[56.4,102.4],[54.8,104.2],[32.6,117.8],[8.9,125.4],[5.8,118.2],[40.0,96.8],[40.7,97.8],[45.7,92.7],[50.2,86.7],[57.5,67.9],[63.9,38.4],[67.4,6.7],[67.6,-17.0],[63.8,-45.5],[58.3,-68.4],[54.0,-80.8],[49.2,-89.9],[43.5,-96.2],[36.2,-100.9],[28.6,-103.7],[18.7,-105.8],[7.1,-106.6],[-0.1,-106.6],[-0.0,-105.3]]
// way/766776879
const NORTH_END: XY[] = [[-7.5,129.0],[15.3,125.3],[32.7,122.4],[50.7,117.6],[57.9,112.6],[54.8,104.2],[56.4,102.4],[61.9,117.7],[61.2,118.4],[48.6,126.0],[33.3,130.6],[18.0,132.7],[15.6,132.8],[-6.4,133.9],[-38.9,129.6]]
// way/766776882
const SOUTH_WALL: XY[] = [[97.7,-52.3],[97.6,-59.7],[97.0,-67.1],[95.5,-75.5],[93.3,-84.1],[90.4,-91.9],[87.1,-99.4],[83.2,-106.2],[78.3,-112.9],[72.1,-120.4],[66.0,-126.9],[59.7,-132.2],[52.0,-137.2],[41.2,-142.9],[32.5,-146.5],[24.3,-148.9],[16.2,-150.7],[5.8,-151.7],[-4.3,-151.9],[-12.3,-150.9],[-19.6,-149.6],[-31.4,-146.0],[-41.8,-141.5],[-50.3,-136.8],[-60.7,-129.6],[-70.5,-120.0],[-76.9,-112.4],[-82.6,-103.6],[-87.2,-94.8],[-90.9,-84.7],[-94.0,-73.5],[-95.3,-65.1],[-95.7,-56.6],[-97.2,-56.7],[-97.2,-59.9],[-96.8,-63.8],[-96.6,-65.7],[-95.5,-72.0],[-94.2,-78.9],[-92.0,-87.5],[-89.6,-94.2],[-88.2,-97.1],[-85.8,-102.5],[-87.0,-103.4],[-85.6,-106.0],[-84.4,-108.2],[-83.1,-107.5],[-77.0,-116.8],[-72.7,-122.1],[-71.1,-123.9],[-69.5,-125.7],[-66.2,-128.9],[-55.2,-137.8],[-55.7,-138.8],[-53.5,-140.2],[-51.3,-141.6],[-50.7,-140.7],[-42.1,-145.5],[-33.9,-148.9],[-31.7,-149.8],[-29.4,-150.7],[-20.9,-153.4],[-13.2,-154.5],[-14.0,-159.5],[-9.4,-160.0],[-4.8,-160.4],[-4.8,-160.6],[-0.3,-160.9],[-0.2,-161.3],[0.6,-161.3],[0.6,-160.2],[3.0,-160.2],[5.6,-160.0],[5.6,-161.1],[6.4,-161.1],[6.4,-160.7],[11.0,-160.4],[11.0,-160.0],[15.4,-159.5],[19.9,-158.7],[19.2,-153.8],[27.8,-151.7],[35.1,-149.4],[36.6,-149.0],[38.2,-148.5],[48.9,-142.7],[56.1,-138.2],[56.9,-139.2],[58.9,-137.8],[60.9,-136.4],[60.4,-135.2],[68.2,-127.8],[73.5,-122.1],[75.0,-120.4],[76.4,-118.8],[83.5,-109.6],[87.3,-102.2],[88.6,-102.7],[89.4,-100.9],[90.3,-99.1],[89.2,-98.5],[91.5,-93.3],[92.6,-90.3],[94.4,-84.6],[96.0,-78.2],[97.6,-70.2],[98.6,-61.7],[98.7,-59.0],[98.7,-52.2]]

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

/** A quad wound to face `hint`, with optional per-corner normals. */
function quad(p: Part, P: V3[], hint: V3, ns?: V3[]) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const ord = dot(f, hint) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  const t = (a: number, b: number, c: number) => {
    const A = P[ord[a]], B = P[ord[b]], C = P[ord[c]]
    if (Math.hypot(...cross(sub(B, A), sub(C, A))) < 1e-9) return
    p.tri(A, B, C, undefined, undefined, undefined, ns && [unit(ns[ord[a]]), unit(ns[ord[b]]), unit(ns[ord[c]])])
  }
  t(0, 1, 2)
  t(0, 2, 3)
}

// ---------------------------------------------------------------------------
// Bowl: rings sampled along rays from the field's centre.

const C: XY = [-0.7, 2.3]
const N = 64
const dirs: XY[] = Array.from({ length: N }, (_, k) => {
  const t = (k / N) * 2 * Math.PI
  return [Math.cos(t), Math.sin(t)] as XY
})
/** Farthest crossing of a ring along the ray from C in direction d (0 if none). */
function reach(ring: XY[], [dx, dy]: XY) {
  let best = 0
  for (let i = 0; i < ring.length; i++) {
    const [x1, y1] = ring[i], [x2, y2] = ring[(i + 1) % ring.length]
    const ex = x2 - x1, ey = y2 - y1, den = dx * ey - dy * ex
    if (Math.abs(den) < 1e-9) continue
    const t = ((x1 - C[0]) * ey - (y1 - C[1]) * ex) / den, s = ((x1 - C[0]) * dy - (y1 - C[1]) * dx) / den
    if (t > 0 && s >= 0 && s <= 1) best = Math.max(best, t)
  }
  return best
}
/** A ring of radii, lightly smoothed round the bowl so facets don't wobble. */
function radii(f: (k: number) => number, pass = 1) {
  let r = Array.from({ length: N }, (_, k) => f(k))
  for (let p = 0; p < pass; p++) r = r.map((v, k) => (r[(k - 1 + N) % N] + 2 * v + r[(k + 1) % N]) / 4)
  return r
}
const at = (k: number, r: number, z: number): V3 => [C[0] + dirs[k % N][0] * r, C[1] + dirs[k % N][1] * r, z]
const outward = (k: number): V3 => [dirs[k % N][0], dirs[k % N][1], 0]

function build() {
  const stone = new Part(), seats = new Part(), glassP = new Part(), white = new Part(), dark = new Part(), tile = new Part()

  const rF = radii(k => reach(FIELD, dirs[k]), 1)
  const rL = radii(k => reach(LOWER, dirs[k]), 1)
  const rO = radii(k => Math.max(reach(WEST_DECK, dirs[k]), reach(EAST_DECK, dirs[k]), rL[k] + 5), 1)
  // Rim height: the west deck is the tall one, the east and the ends a
  // level glass band.
  const rim = (k: number) => {
    const dx = dirs[k % N][0]
    // The west deck stands clear of the rest, its ends cut steeply at the
    // north-west and south-west corners.
    const t = Math.min(1, Math.max(0, (-dx - 0.3) / 0.25))
    return 39 + 10 * t * t * (3 - 2 * t)
  }
  // How far the outer wall leans out: only the west skybox wall.
  const lean = (k: number) => {
    const dx = dirs[k % N][0]
    return dx < -0.35 ? 11 * Math.min(1, (-dx - 0.35) / 0.4) : 0
  }

  const WALL = 2.2, LOW = 14, FASCIA = 18.5, GLASS_LO = 10
  // Depth of the white roof edge: a deep canopy over the east and the
  // ends, a slim lip on the west deck.
  const canopy = (k: number) => {
    const dx = dirs[k % N][0], t = Math.min(1, Math.max(0, (-dx - 0.3) / 0.25))
    return -(7 - 3.8 * t)
  }
  for (let k = 0; k < N; k++) {
    const j = (k + 1) % N
    const ring = (r: number[], i: number, z: number | ((i: number) => number), dr = 0) => at(i, r[i] + dr, typeof z === 'number' ? z : z(i))
    const inn: V3 = [-dirs[k][0], -dirs[k][1], 0.6], up: V3 = [0, 0, 1]
    const out = outward(k)
    // Field wall.
    quad(dark, [at(k, rF[k], 0), at(j, rF[j], 0), at(j, rF[j], WALL), at(k, rF[k], WALL)], inn)
    // Lower bowl.
    quad(seats, [ring(rF, k, WALL), ring(rF, j, WALL), ring(rL, j, LOW, -7), ring(rL, k, LOW, -7)], inn)
    // Suite fascia between the decks.
    quad(glassP, [ring(rL, k, LOW, -7), ring(rL, j, LOW, -7), ring(rL, j, FASCIA, -7), ring(rL, k, FASCIA, -7)], inn)
    quad(white, [ring(rL, k, FASCIA, -7), ring(rL, j, FASCIA, -7), ring(rL, j, FASCIA, -5.8), ring(rL, k, FASCIA, -5.8)], up)
    // Upper deck, up to just inside the rim.
    const top = (i: number) => rim(i) - 2.2
    const cv = (i: number, z: number | ((i: number) => number)) => at(i, rO[i] + canopy(i), typeof z === 'number' ? z : z(i))
    quad(seats, [ring(rL, k, FASCIA, -5.8), ring(rL, j, FASCIA, -5.8), cv(j, top), cv(k, top)], inn)
    // Parapet and the white roof edge.
    quad(white, [cv(k, top), cv(j, top), cv(j, rim), cv(k, rim)], inn)
    quad(white, [cv(k, rim), cv(j, rim), ring(rO, j, rim, 0), ring(rO, k, rim, 0)], up)
    quad(white, [ring(rO, k, rim, 0), ring(rO, j, rim, 0), ring(rO, j, (i: number) => rim(i) - 2.4, 0), ring(rO, k, (i: number) => rim(i) - 2.4, 0)], out)
    // Outer wall: glass from the roof edge down to GLASS_LO, leaning out on
    // the west; concrete below.
    const base = (i: number) => rO[i] - lean(i)
    quad(glassP, [ring(rO, k, (i: number) => rim(i) - 2.4), ring(rO, j, (i: number) => rim(i) - 2.4), at(j, base(j), GLASS_LO), at(k, base(k), GLASS_LO)], out)
    quad(stone, [at(k, base(k), GLASS_LO), at(j, base(j), GLASS_LO), at(j, base(j), 0), at(k, base(k), 0)], out)
    // Floor lines on the glass: a few pale bands, as the curtain wall reads.
    const onGlass = (i: number, f: number, dr: number): V3 => {
      const zb = GLASS_LO, zt = rim(i) - 2.4, rb = base(i), rt = rO[i]
      return at(i, rb + (rt - rb) * f + dr, zb + (zt - zb) * f)
    }
    for (const f of [0.3, 0.55, 0.8]) quad(white, [onGlass(k, f, 0.3), onGlass(j, f, 0.3), onGlass(j, f + 0.035, 0.3), onGlass(k, f + 0.035, 0.3)], out)
    // Underside of the west overhang.
    if (lean(k) > 0 || lean(j) > 0) quad(white, [at(k, base(k), GLASS_LO), at(j, base(j), GLASS_LO), at(j, base(j) + 0.01, GLASS_LO), at(k, base(k) + 0.01, GLASS_LO)], [0, 0, -1])
  }

  // Video boards over the end zones, facing the field.
  for (const s of [-1, 1]) {
    const k = s > 0 ? N / 4 : (3 * N) / 4
    const y = C[1] + s * (rO[k] - 6), z0 = rim(k) - 1, z1 = z0 + 9, w = 17
    const r = s > 0 ? rect(C[0] - w, y - 1.2, C[0] + w, y + 1.2) : rect(C[0] - w, y - 1.2, C[0] + w, y + 1.2)
    block(dark, dark, r, z0, z1, 0.3)
    for (const x of [-w + 3, w - 3]) block(white, null, rect(C[0] + x - 0.6, y - 0.6, C[0] + x + 0.6, y + 0.6), rim(k) - 2.2, z0, 0)
  }

  // ---------------------------------------------------------------------------
  // The 1924 stadium: colonnades, pavilions, south wall, north end.

  const BASE = 6.5, CAPS = 17.5, TOP = 20
  const colonnade = (a: XY, b: XY, side: -1 | 1, n: number) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    // Outward is away from the field: +x on the east, -x on the west.
    const o: XY = [side, 0]
    const P = (s: number, d: number): XY => [a[0] + u[0] * s + o[0] * d, a[1] + u[1] * s + o[1] * d]
    const quadRing = (d0: number, d1: number, s0 = 0, s1 = L): XY[] => {
      const r = [P(s0, d0), P(s1, d0), P(s1, d1), P(s0, d1)]
      // Counter-clockwise from above.
      const ar = r.reduce((acc, p, i) => { const q = r[(i + 1) % 4]; return acc + p[0] * q[1] - q[0] * p[1] }, 0)
      return ar < 0 ? r.reverse() : r
    }
    // Base under the whole width, then the inner wall, the columns along
    // the outer edge, and the entablature slab over the walk.
    block(stone, stone, quadRing(-5.5, 5.5), 0, BASE, 0.3)
    block(seats, null, quadRing(-5.5, -2.5), BASE, CAPS, 0)
    const pitch = L / n
    for (let i = 0; i < n; i++) {
      const [x, y] = P((i + 0.5) * pitch, 3.8)
      lathe(stone, x, y, [[0.95, BASE], [0.82, CAPS - 0.6]], 8)
      block(white, null, rect(x - 1.15, y - 1.15, x + 1.15, y + 1.15), CAPS - 0.6, CAPS, 0)
    }
    block(stone, stone, quadRing(-5.5, 5.3), CAPS, TOP, 0.35)
  }
  const pavilion = (cx: number, cy: number) => {
    block(stone, stone, rect(cx - 7.5, cy - 7.5, cx + 7.5, cy + 7.5), 0, 21, 0.4)
    block(stone, null, rect(cx - 5, cy - 5, cx + 5, cy + 5), 21, 23.4, 0.2)
    const r0 = rect(cx - 5.6, cy - 5.6, cx + 5.6, cy + 5.6), r1 = rect(cx - 0.4, cy - 0.4, cx + 0.4, cy + 0.4)
    walls(tile, r0, 23.4, 26.4, r1)
    cap(tile, r1, 26.4)
  }
  const W0: XY = [-100.2, -48], W1: XY = [-96.8, 178], E0: XY = [93.8, -43], E1: XY = [92.0, 182]
  // Each side: two runs between three pavilions (south end, where the
  // bowl's corner meets it, north end).
  for (const [a, b, side] of [[W0, W1, -1], [E0, E1, 1]] as [XY, XY, -1 | 1][]) {
    const mid = (t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
    const tm = (55 - a[1]) / (b[1] - a[1])
    const ends = [mid(0), mid(tm), mid(1)]
    colonnade(mid(0.033), mid(tm - 0.033), side, 19)
    colonnade(mid(tm + 0.033), mid(1 - 0.033), side, 24)
    for (const [x, y] of ends) pavilion(x, y)
  }
  // Old south wall and north end.
  block(stone, stone, SOUTH_WALL, 0, 14, 0.3)
  block(stone, stone, NORTH_END, 0, 12, 0.3)

  return [
    { part: stone, material: finish('bedford-limestone', 0xe3d9c6) },
    { part: seats, material: finish('bears-navy-seats', 0x6b7586) },
    { part: glassP, material: { name: 'window', color: 0xa3bac7, roughness: 0.35 } },
    { part: white, material: finish('white-steel', 0xf2f0ea) },
    { part: dark, material: finish('charcoal', 0x4a4f57) },
    { part: tile, material: finish('red-tile', 0xb5705c) },
  ]
}

if (import.meta.main) await save('chi-soldier-field', 'Soldier Field', [41.862324, -87.616696], 357, build(), 6500)
