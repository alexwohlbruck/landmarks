/**
 * Brooklyn Borough Hall, 209 Joralemon Street — procedural, CC0-1.0, no
 * textures.
 * bun generators/nyc-brooklyn-borough-hall.ts
 *
 * Map frame: x east, y north, z up, metres, turned to the building's axis.
 * Anchor: area centroid of the OSM outline way/241846064 (-73.9903048,
 * 40.6927696). The outline's walls run 5.1° clockwise of the compass, so the
 * model is placed at bearing 5.1 and built square.
 *
 * What it is: Gamaliel King's Greek Revival city hall of 1846–51, the old
 * City Hall of Brooklyn, in white Tuckahoe marble. A plain three-storey
 * block over a basement, with a hexastyle Ionic portico on its north front
 * raised over a broad flight of steps from Columbus Park; low pediments over
 * the outer bays of the south front on Joralemon Street, whose middle is
 * recessed. On the roof a tall square pedestal carries Vincent Griffith's
 * 1898 cupola: an eight-sided stage ringed with columns and open arches, a
 * clock stage, a dome of green scale tiles and a gilded figure of Justice.
 *
 * Covers and replaces: way/241846064, the only building there; the steps
 * stand outside it, as in reality.
 *
 * Evidence
 * - OSM (measured): the outline, 50.0 × 31.3 m with the 18.5 × 4.4 m
 *   portico on the north and a 15 × 2.8 m recess in the south front;
 *   height=41.3; wikidata Q929403.
 * - USGS lidar NY_NewYorkCity (2017). y = 0 is Joralemon Street (19.2 m);
 *   the park to the north is 1.0 m higher. Measured above y = 0: the main
 *   roof 19.0–19.3 m at the walls, rising to 20.3–21.3 m round the cupola;
 *   the portico roof 18.4–19.3 m near its ends and 20.6–20.7 m along the
 *   ridge (drawn: entablature 17.9 m, apex 20.9 m, which gives the 18–19°
 *   rake the square-on photo shows; the lidar's end cells catch the raking
 *   cornice); the
 *   steps from 1.0 m to 3.6 m, 24 m wide and about 4.8 m deep; the south
 *   pediments 21.3 m; the cupola's square pedestal 11.5 m across, 26.1 m
 *   high, centred (0, -2.2); the cupola's lower cornice 34.7 m about 4.2 m
 *   out; the dome 40–41 m; the figure's head 45.8 m.
 * - Photos (Wikimedia Commons): "Brooklyn Borough Hall July 2026.jpg"
 *   (Kidfly182, CC BY 4.0), the north front square on; "Brooklyn Borough
 *   Hall 01.jpg" (Ad Meskens, CC BY-SA 3.0), from the north-north-east;
 *   "Brooklyn Borough Hall November 2022.jpg" (Kidfly182, CC BY-SA 4.0),
 *   north front; "Brooklyn Borough Hall January 2023.jpg", "…001.jpg",
 *   "…002.jpg" (Kidfly182, CC BY-SA 4.0), the south front and cupola;
 *   "Brooklyn Borough Hall bell tower from the south.jpg" (Rhododendrites,
 *   CC BY-SA 4.0), the cupola square on; "Brooklyn Borough Hall 2.JPG"
 *   (Michelb101, CC BY-SA 3.0), from the north-west along Court Street.
 * - From the photos, scaled to the lidar: the columns 3.6–15.2 m, the
 *   entablature and main cornice 17.9 m under a parapet to the roof;
 *   four window rows (basement, ground, main storey, small attic windows); the window
 *   bays (five each side of the portico, nine on the ends); the cupola's
 *   stages (lower 26.5–33.3 m and 8.5 m across, clock stage to 37.8 m and
 *   7.5 m across, dome to 40.6 m); the marble's pale warm grey.
 *
 * Estimated: the window sizes; the south pediments spanning each outer
 * wing (x ±7.5–25 m; ridges at x ±16 m in the lidar, as in the south photo); the cupola's arches
 * and clock faces; the depth of the stair's flare.
 *
 * Doubts: the east side is seen only obliquely; the courtyard-facing parts
 * of the south recess are plain.
 *
 * Simplified: Ionic capitals are a flared bell and a wide abacus; window
 * hoods, the balustrades, the clocks' hands and the cupola's urns and
 * scrolls are left out; the figure of Justice is a gilded column-like
 * figure on a ball.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, cylinder, gable, hip, panel, rect, type Side } from './dc-white-house'
import { classicalColumn, lathe, pslab, pwalls, saveModel, type XY } from './nyc-dime-savings-bank'

const marble = new Part(), shade = new Part(), roof = new Part(), win = new Part(), green = new Part(), gilt = new Part()

const X = 25.0, YN = 14.36, YS = -16.97 // main block
const PX = 9.25, PY = 18.75 // portico
const NX = 7.5, NY = -14.19 // south recess
const PLAZA = 1.0, PODIUM = 3.6, CAP = 15.2, CORNICE = 17.9, ROOF = 19.2, APEX = 20.9

// ---- Main block: walls to the cornice, a cornice band, a low roof.
{
  const ring: XY[] = [[-X, YS], [-NX, YS], [-NX, NY], [NX, NY], [NX, YS], [X, YS], [X, YN], [-X, YN]]
  pslab(marble, ring, 0, CORNICE - 0.7, 0, false)
  // a plinth course for the basement
  pslab(marble, [[-X - 0.25, YS - 0.25], [-NX + 0.25, YS - 0.25], [-NX + 0.25, NY - 0.25], [NX - 0.25, NY - 0.25], [NX - 0.25, YS - 0.25], [X + 0.25, YS - 0.25], [X + 0.25, YN + 0.25], [-X - 0.25, YN + 0.25]], 0, PLAZA + 3.6, 0.15, false)
  // string course over the basement
  pslab(marble, [[-X - 0.2, YS - 0.2], [-NX + 0.2, YS - 0.2], [-NX + 0.2, NY - 0.2], [NX - 0.2, NY - 0.2], [NX - 0.2, YS - 0.2], [X + 0.2, YS - 0.2], [X + 0.2, YN + 0.2], [-X - 0.2, YN + 0.2]], PLAZA + 3.6, PLAZA + 4.0, 0.1, false, true)
  const lip: XY[] = [[-X - 0.5, YS - 0.5], [-NX + 0.5, YS - 0.5], [-NX + 0.5, NY - 0.5], [NX - 0.5, NY - 0.5], [NX - 0.5, YS - 0.5], [X + 0.5, YS - 0.5], [X + 0.5, YN + 0.5], [-X - 0.5, YN + 0.5]]
  pslab(marble, lip, CORNICE - 0.7, CORNICE, 0.3, false, true)
  // the parapet, then the roof: flat over the wings, a low hip in the middle
  pslab(marble, ring, CORNICE, ROOF, 0.15, roof)
  hip(roof, rect(-14, 14, -12.5, 8.5), ROOF, 20.6, 4)
}

// ---- Windows: three panels a bay (basement, ground, main storey with the
// small attic windows over it), in bays of about 3.2 m.
function bays(side: Side, at: number, a0: number, a1: number, n: number, rows: [number, number][] = ROWS) {
  const step = (a1 - a0) / n
  for (let k = 0; k < n; k++) {
    const c = a0 + step * (k + 0.5)
    for (const [z0, z1] of rows) panel(win, side, at, c - 0.65, c + 0.65, z0, z1, 0.05)
  }
}
const ROWS: [number, number][] = [[PLAZA + 1.2, PLAZA + 3.0], [PLAZA + 4.6, PLAZA + 7.0], [PLAZA + 8.4, PLAZA + 12.2], [PLAZA + 13.2, PLAZA + 14.6]]
bays('n', YN, -X + 0.8, -PX - 0.6, 5)
bays('n', YN, PX + 0.6, X - 0.8, 5)
bays('w', -X, YS + 0.8, YN - 0.8, 9)
bays('e', X, YS + 0.8, YN - 0.8, 9)
const SROWS: [number, number][] = ROWS.map(([a, b]) => [a - PLAZA, b - PLAZA])
bays('s', YS, -X + 0.8, -NX - 0.6, 5, SROWS)
bays('s', YS, NX + 0.6, X - 0.8, 5, SROWS)
bays('s', NY, -NX + 0.6, NX - 0.6, 4, SROWS)

// ---- South front: low pediments over the outer bays.
for (const s of [-1, 1]) {
  const r = rect(s < 0 ? -X - 0.5 : NX + 0.3, s < 0 ? -NX - 0.3 : X + 0.5, YS - 0.5, YS + 7)
  gable(roof, marble, r, ROOF, 21.3, true, [true, true])
  // the tympanum, shaded, a little inside the gable (faces south)
  const y = YS - 0.53, xm = (r.x0 + r.x1) / 2
  shade.tri([r.x0 + 1.4, y, ROOF + 0.25], [r.x1 - 1.4, y, ROOF + 0.25], [xm, y, 21.3 - 0.45])
}

// ---- The north portico on its podium, six columns, a low pediment.
{
  cbox(marble, rect(-PX, PX, YN - 0.1, PY), 0, PODIUM, { b: 0.15 })
  const ys = PY - 1.0
  for (let k = 0; k < 6; k++) classicalColumn(marble, [-PX + 1.0 + (k * (2 * PX - 2.0)) / 5, ys], 0.66, PODIUM, CAP, 10)
  // shaded back wall with its windows and doors
  panel(shade, 'n', YN, -PX + 0.4, PX - 0.4, PODIUM, CAP, 0.03)
  for (let k = 0; k < 5; k++) {
    const c = -PX + 1.0 + ((k + 0.5) * (2 * PX - 2.0)) / 5
    panel(win, 'n', YN, c - 0.8, c + 0.8, PODIUM + 0.2, PODIUM + 3.6, 0.06)
    panel(win, 'n', YN, c - 0.75, c + 0.75, PODIUM + 5.0, PODIUM + 9.6, 0.06)
  }
  // entablature over the columns, back to the wall
  cbox(marble, rect(-PX, PX, YN, PY), CAP, CORNICE - 0.6, { top: false, bottom: true })
  cbox(marble, rect(-PX - 0.4, PX + 0.4, YN, PY + 0.4), CORNICE - 0.6, CORNICE, { b: 0.25, top: false, bottom: true })
  // pediment: a gable running back from the front to the main roof
  const g = rect(-PX - 0.4, PX + 0.4, YN - 1, PY + 0.4)
  gable(roof, marble, g, CORNICE, APEX, false, [false, false])
  // close the front gable as the tympanum, with a shaded recess
  const f = PY + 0.4
  const tri = (p: Part, x0: number, x1: number, z0: number, z1: number, y: number) =>
    p.tri([x0, y, z0], [x1, y, z0], [(x0 + x1) / 2, y, z1])
  // faces north: winding counter-clockwise seen from +y
  tri(marble, PX + 0.4, -PX - 0.4, CORNICE, APEX, f)
  tri(shade, PX - 1.4, -PX + 1.4, CORNICE + 0.3, APEX - 0.55, f + 0.03)
}

// ---- Steps from the park up to the portico, flaring wider than it.
{
  const N = 8, Y0 = PY, Y1 = PY + 4.8
  for (let k = 0; k < N; k++) {
    const y1 = Y1 - (k * (Y1 - Y0)) / N
    const w = 12.2 - k * 0.35
    cbox(marble, rect(-w, w, Y0 - 0.1, y1), 0, PLAZA + ((k + 1) * (PODIUM - PLAZA)) / N)
  }
  // cheek walls
  for (const s of [-1, 1]) cbox(marble, rect(s < 0 ? -PX - 0.9 : PX - 0.6, s < 0 ? -PX + 0.6 : PX + 0.9, Y0 - 0.1, Y0 + 1.6), 0, PODIUM + 0.9, { b: 0.15 })
}

// ---- The cupola.
{
  const cx = 0, cy = -2.2
  // square pedestal over the roof, with a cornice
  cbox(marble, rect(cx - 5.75, cx + 5.75, cy - 5.75, cy + 5.75), ROOF, 25.6, { top: false })
  cbox(marble, rect(cx - 6.05, cx + 6.05, cy - 6.05, cy + 6.05), 25.6, 26.1, { b: 0.2, bottom: true, top: roof })
  for (const side of ['n', 's', 'e', 'w'] as Side[]) {
    const at = side === 'n' ? cy + 5.75 : side === 's' ? cy - 5.75 : side === 'e' ? cx + 5.75 : cx - 5.75
    const c = side === 'n' || side === 's' ? cx : cy
    panel(win, side, at, c - 2.8, c - 1.0, 21.6, 24.2, 0.05)
    panel(win, side, at, c + 1.0, c + 2.8, 21.6, 24.2, 0.05)
  }
  // the columned stage: an octagon with a column at each corner, arches on four faces
  const oct = (r: number): XY[] => Array.from({ length: 8 }, (_, k) => [cx + r * Math.cos(((k + 0.5) * Math.PI) / 4), cy + r * Math.sin(((k + 0.5) * Math.PI) / 4)] as XY)
  const z0 = 26.5, z1 = 33.3
  pslab(marble, oct(4.6), 26.1, z0, 0.1, false)
  pwalls(marble, oct(3.7), z0, z1)
  for (const [x, y] of oct(4.05)) classicalColumn(marble, [x, y], 0.32, z0, z1 - 0.2, 8)
  const O = oct(3.7)
  for (let k = 0; k < 8; k++) {
    const a = O[k], b = O[(k + 1) % 8]
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = dy / L, ny = -dx / L
    const m: XY = [(a[0] + b[0]) / 2 + nx * 0.05, (a[1] + b[1]) / 2 + ny * 0.05]
    const w = k % 2 === 0 ? 0.85 : 0.55
    const P = (s: number, z: number): [number, number, number] => [m[0] + (dx / L) * s, m[1] + (dy / L) * s, z]
    // an opening with a round head
    win.quad(P(-w, z0 + 0.6), P(w, z0 + 0.6), P(w, z1 - 1.6 - w), P(-w, z1 - 1.6 - w))
    for (let j = 0; j < 6; j++) {
      const t0 = (j / 6) * Math.PI, t1 = ((j + 1) / 6) * Math.PI
      win.tri(P(0, z1 - 1.6 - w), P(w * Math.cos(t0), z1 - 1.6 - w + w * Math.sin(t0)), P(w * Math.cos(t1), z1 - 1.6 - w + w * Math.sin(t1)))
    }
  }
  pslab(marble, oct(4.75), z1, 34.0, 0.25, roof, true)
  // clock stage
  const z2 = 37.8
  pwalls(marble, oct(3.4), 34.0, z2)
  const C = oct(3.4)
  for (let k = 0; k < 8; k += 2) {
    const a = C[k], b = C[(k + 1) % 8]
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = dy / L, ny = -dx / L
    const m: [number, number, number] = [(a[0] + b[0]) / 2 + nx * 0.06, (a[1] + b[1]) / 2 + ny * 0.06, 35.9]
    // a clock face: a pale disc in a dark ring
    for (let j = 0; j < 10; j++) {
      const t0 = (j / 10) * Math.PI * 2, t1 = ((j + 1) / 10) * Math.PI * 2
      const R = 0.95, Q = (t: number, r: number): [number, number, number] => [m[0] + (dx / L) * Math.cos(t) * r, m[1] + (dy / L) * Math.cos(t) * r, m[2] + Math.sin(t) * r]
      win.tri(m, Q(t0, R), Q(t1, R))
    }
  }
  for (let k = 0; k < 8; k++) {
    // corner scrolls, read as buttress blocks
    const [x, y] = oct(3.55)[k]
    cbox(marble, rect(x - 0.3, x + 0.3, y - 0.3, y + 0.3), 34.0, 36.6, { b: 0.1 })
  }
  pslab(marble, oct(3.75), z2, 38.2, 0.2, false, true)
  // dome of green scale tiles, then a little drum, a ball and Justice
  lathe(green, cx, cy, [[3.1, 38.2], [3.1, 38.6], [2.9, 39.4], [2.4, 40.1], [1.6, 40.6], [0.6, 40.9], [0, 41.0]], 12, false)
  cylinder(gilt, cx, cy, 0.35, 40.9, 41.4, 8)
  lathe(gilt, cx, cy, [[0, 41.4], [0.35, 41.55], [0.45, 41.75], [0.35, 41.95], [0.3, 42.0]], 8, true)
  lathe(gilt, cx, cy, [[0.6, 42.0], [0.5, 43.4], [0.42, 44.5], [0.3, 44.8], [0.28, 45.3], [0, 45.8]], 8, false)
}

await saveModel('nyc-brooklyn-borough-hall', 'Brooklyn Borough Hall', [
  { part: marble, material: finish('bbh-marble', 0xe9e4da) },
  { part: shade, material: finish('bbh-marble-shade', 0xcdc6ba) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: green, material: PALETTE.patina },
  { part: gilt, material: finish('bbh-gilt', 0xcfa850) },
], { source: 'generators/nyc-brooklyn-borough-hall.ts', bearing: 5.1, osm: 'way/241846064', height: 45.8 }, 6500)
