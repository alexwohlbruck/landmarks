/**
 * General Grant National Memorial (Grant's Tomb), Riverside Drive at 122nd
 * Street — procedural, CC0-1.0, no textures.
 * bun generators/nyc-grants-tomb.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. The portico
 * faces model south (true bearing ~201°, down Riverside Drive). Placed at
 * bearing 21.1°, the edges of the OSM outline way/271922197 (a 26.8 m
 * square). Anchor: that outline's centroid.
 *
 * Evidence
 * - OSM way/271922197: 26.8 × 26.7 m square, height 46.9 m.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 0.5 m, read in the model frame,
 *   heights above the ground on the north and west sides (39.9 m NAVD88, the
 *   lowest under the footprint): main cornice 18.8 m, overhanging the walls
 *   by ~1.5 m; attic 21.0–21.4 m; the portico's roof 13.8–14.0 m, running
 *   from the wall out to 5.8 m in front of it, 21.8 m wide; the peristyle's
 *   entablature 34.4 m out to radius 11.2 m; the drum's attic to 38.3 m at
 *   radius 8.5 m; the cone rising from there at 45° to 46.6 m at the centre
 *   (radial medians over 72 directions). The flight of steps falls from the portico floor to
 *   about 0.5 m 12 m out, between the two eagle pedestals (4.7 m).
 * - Published: 1897, John Duncan, granite; "150 ft" tall on a 90 ft square
 *   base; a Doric portico of two rows of six columns; a drum ringed by an
 *   Ionic peristyle under a stepped conical roof (Wikipedia; NPS; NRHP
 *   66000055).
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-grants-tomb/photos/credits.txt: the south front
 *   square on (King of Hearts, two; Daniel Schwen), from the south-east
 *   under the portico (Ccnyc123), the rear from the north (Gigi alt): the
 *   piers and three high windows on the north face, small square windows in
 *   the drum's podium, the cone a weathered darker grey than the walls.
 *
 * Estimated: the portico's split between columns (2.6–11 m, 1.6 m across
 * on a 3.9 m pitch, from the square-on photo scaled to the lidar's 21.8 m
 * portico) and entablature; the porch floor (2.6 m, thirteen risers in the
 * photo); the drum's podium (to 24.4 m), column (8 m) and entablature
 * (2.2 m) heights, split from the lidar's 21.2 → 34.6 m by the photos'
 * proportions, the colonnade given the larger share (podium 21.2–23 m over
 * a square step, columns 23–32.6 m); 20 bold peristyle columns, 1.45 m
 * across (the photos show about 10–12 across the front half);
 * the grilles between them; the attic's height split (37.9 m and a 0.5 m
 * step at the cone's foot); the roof drawn as seven steps on the lidar's
 * envelope. Ground-level photos make the cone look lower than it is (the
 * camera sees it foreshortened); the lidar's radial profile (34.4 m
 * entablature to r 8.7, 38.3 m at r 8.4, 40.8 m at r 6, 46.6 m at the
 * knob) is what the heights follow. Colour: the warm pale granite of the
 * sunlit photos, as the palette's stone, with a warm shade for the porch
 * wall, the cella, the flat tops and the roof's risers. Sculpture (the attic's figures and corner trophies,
 * the eagles) is left out; the attic's corner blocks are kept as plain
 * raised blocks. The east and west faces are drawn like the north face (no
 * licensed photo shows them square on). Flat tops are drawn in the shaded
 * granite: no evidence of a different roof finish.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, circle, type XY, unit } from './nyc-570-lexington'
import { block, column, rectPanel, band } from './nyc-city-hall'

const granite = new Part(), shade = new Part(), win = new Part(), dark = new Part()

const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

// --- The main block: a 26.8 m granite cube with a plinth, a frieze band,
// a deep cornice and an attic ---
const H = 13.4 // half side (OSM)
const WALL = 17.3, CORN = 18.8, ATT = 21.2
prism({ wall: granite, win: null, roof: null, ring: rect(-H, -H, H, H), z0: 0, z1: WALL, facade: null, bevel: 0.3 })
band(granite, rect(-H, -H, H, H), 0, 1.2, 0.3)
band(granite, rect(-H, -H, H, H), 12.8, 14.0, 0.25) // the portico's entablature, carried round the block
band(granite, rect(-H, -H, H, H), 15.4, WALL, 0.35) // frieze
// The cornice: a slab overhanging 1.4 m, its soffit drawn.
{
  const o = H + 1.4
  block(granite, -o, -o, o, o, WALL, CORN, true)
}
prism({ wall: granite, win: null, roof: shade, ring: rect(-H + 0.2, -H + 0.2, H - 0.2, H - 0.2), z0: CORN, z1: ATT, facade: null, bevel: 0.3, coping: granite })
// Corner blocks on the attic (the trophies' pedestals), a little proud of it.
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const x0 = sx > 0 ? H - 3.0 : -H + 0.1, y0 = sy > 0 ? H - 3.0 : -H + 0.1
  block(granite, x0, y0, x0 + 2.9, y0 + 2.9, CORN, ATT + 0.7)
}

// The north, east and west faces: four shallow piers with three tall
// windows set high between them (north face, from the rear photo; the
// sides assumed to match).
{
  const faces: [XY, XY][] = [[[H, H], [-H, H]], [[H, -H], [H, H]], [[-H, H], [-H, -H]]]
  for (const [a, b] of faces) {
    for (const sc of [-9.75, -3.25, 3.25, 9.75]) {
      // a pier 1.8 m wide, 0.3 m proud, from the plinth to the band
      const L = 2 * H, ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux
      const cx = (a[0] + b[0]) / 2 + ux * sc, cy = (a[1] + b[1]) / 2 + uy * sc
      const p0: XY = [cx - ux * 0.9, cy - uy * 0.9], p1: XY = [cx + ux * 0.9, cy + uy * 0.9]
      const ring: XY[] = [p0, p1, [p1[0] + nx * 0.3, p1[1] + ny * 0.3], [p0[0] + nx * 0.3, p0[1] + ny * 0.3]]
      prism({ wall: granite, win: null, roof: granite, ring, z0: 1.2, z1: 12.8, facade: null, bevel: 0.1 })
    }
    for (const sc of [-6.5, 0, 6.5]) rectPanel(win, a, b, H + sc, 2.4, 8.0, 11.9)
  }
}

// --- The portico: two rows of six Doric columns, from the wall out to 5.8 m ---
const PX = 10.9, PY0 = -H - 5.8, FLOOR = 2.6, CTOP = 11.0, PTOP = 14.0
const colX = [-9.75, -5.85, -1.95, 1.95, 5.85, 9.75]
// The porch floor and its front edge.
block(granite, -PX, PY0, PX, -H + 0.01, 0, FLOOR)
// The recessed back wall in shade, with the bronze door.
rectPanel(shade, [-H, -H], [H, -H], H, 2 * PX - 1.2, FLOOR, CTOP, 0.03)
rectPanel(dark, [-H, -H], [H, -H], H, 3.0, FLOOR, FLOOR + 6.2, 0.06)
for (const y of [PY0 + 0.95, PY0 + 3.95]) for (const x of colX) column(granite, x, y, 0.8, FLOOR, CTOP, { n: 12, base: 0.05, cap: 0.6, taper: 0.85 })
// Entablature: architrave, frieze set back, a crowning course.
block(granite, -PX, PY0, PX, -H, CTOP, CTOP + 1.1, true)
block(granite, -PX + 0.15, PY0 + 0.15, PX - 0.15, -H, CTOP + 1.1, PTOP - 0.6)
block(granite, -PX - 0.3, PY0 - 0.3, PX + 0.3, -H, PTOP - 0.6, PTOP)
block(shade, -PX + 0.3, PY0 + 0.3, PX - 0.3, -H, PTOP, PTOP + 0.02)
// The flight of steps down to the plaza, with cheek blocks.
{
  const n = 9, run = 1.2
  for (let k = 0; k < n; k++) {
    const top = FLOOR * (1 - (k + 1) / (n + 1))
    block(granite, -PX + 1.2, PY0 - (k + 1) * run, PX - 1.2, PY0 - k * run + 0.01, 0, top + FLOOR / (n + 1))
  }
  for (const sx of [-1, 1]) {
    const x0 = sx > 0 ? PX - 1.2 : -PX, x1 = x0 + 1.2
    block(granite, x0, PY0 - n * run, x1, PY0, 0, FLOOR + 0.4)
  }
}

// --- The drum: a round podium, the Ionic peristyle round a plain cella
// with grilles, its entablature, a low ring, and the stepped cone ---
const N = 20
const STEP = 22.1, POD = 23.0, COLT = 32.6, ENT = 34.4
const ringN = 32
// A square step on the attic, then the drum's round podium.
prism({ wall: granite, win: null, roof: shade, ring: rect(-11.9, -11.9, 11.9, 11.9), z0: ATT - 0.3, z1: STEP, facade: null, bevel: 0.2, coping: granite })
prism({ wall: granite, win: null, roof: null, ring: circle(0, 0, 10.9, ringN), z0: STEP - 0.05, z1: POD, facade: null, bevel: 0 })
// Podium top: an annulus from the cella out to the podium edge.
{
  const o = circle(0, 0, 10.9, ringN), i = circle(0, 0, 8.6, ringN)
  for (let k = 0; k < ringN; k++) {
    const l = (k + 1) % ringN
    granite.quad([i[k][0], i[k][1], POD], [o[k][0], o[k][1], POD], [o[l][0], o[l][1], POD], [i[l][0], i[l][1], POD])
  }
}
// The cella wall inside the colonnade, smooth-shaded.
{
  const c0 = circle(0, 0, 8.6, ringN)
  for (let k = 0; k < ringN; k++) {
    const l = (k + 1) % ringN
    const a = c0[k], b = c0[l]
    const na = unit([a[0], a[1], 0]), nb = unit([b[0], b[1], 0])
    shade.tri([a[0], a[1], POD], [b[0], b[1], POD], [b[0], b[1], COLT], undefined, undefined, undefined, [na, nb, nb])
    shade.tri([a[0], a[1], POD], [b[0], b[1], COLT], [a[0], a[1], COLT], undefined, undefined, undefined, [na, nb, na])
  }
}
// Peristyle columns and the grilles between them.
for (let k = 0; k < N; k++) {
  const t = (k * 2 * Math.PI) / N
  column(granite, 10.15 * Math.cos(t), 10.15 * Math.sin(t), 0.72, POD, COLT, { n: 12, base: 0.45, cap: 0.55, taper: 0.88 })
  const tm = t + Math.PI / N, w = 1.5, r = 8.65
  const ux = -Math.sin(tm), uy = Math.cos(tm)
  const cx = r * Math.cos(tm), cy = r * Math.sin(tm)
  const z0 = POD + 5.0, z1 = COLT - 0.9
  win.quad([cx - ux * w / 2, cy - uy * w / 2, z0], [cx + ux * w / 2, cy + uy * w / 2, z0], [cx + ux * w / 2, cy + uy * w / 2, z1], [cx - ux * w / 2, cy - uy * w / 2, z1])
}
// Entablature: a ring band from the columns out to 11 m, with its soffit.
{
  const segs = ringN
  const outer = circle(0, 0, 11.2, segs), inner = circle(0, 0, 8.6, segs)
  for (let k = 0; k < segs; k++) {
    const l = (k + 1) % segs
    const o0 = outer[k], o1 = outer[l], i0 = inner[k], i1 = inner[l]
    const na = unit([o0[0], o0[1], 0]), nb = unit([o1[0], o1[1], 0])
    granite.tri([o0[0], o0[1], COLT], [o1[0], o1[1], COLT], [o1[0], o1[1], ENT], undefined, undefined, undefined, [na, nb, nb])
    granite.tri([o0[0], o0[1], COLT], [o1[0], o1[1], ENT], [o0[0], o0[1], ENT], undefined, undefined, undefined, [na, nb, na])
    granite.quad([o0[0], o0[1], COLT], [i0[0], i0[1], COLT], [i1[0], i1[1], COLT], [o1[0], o1[1], COLT])
    granite.quad([i0[0], i0[1], ENT], [o0[0], o0[1], ENT], [o1[0], o1[1], ENT], [i1[0], i1[1], ENT])
  }
}
// The low ring above the entablature, then two shallow steps and the cone.
function drumRing(r: number, z0: number, z1: number, rTop: number, p = granite) {
  const a = circle(0, 0, r, ringN), b = circle(0, 0, rTop, ringN)
  for (let k = 0; k < ringN; k++) {
    const l = (k + 1) % ringN
    const na = unit([a[k][0], a[k][1], 0]), nb = unit([a[l][0], a[l][1], 0])
    p.tri([a[k][0], a[k][1], z0], [a[l][0], a[l][1], z0], [a[l][0], a[l][1], z1], undefined, undefined, undefined, [na, nb, nb])
    p.tri([a[k][0], a[k][1], z0], [a[l][0], a[l][1], z1], [a[k][0], a[k][1], z1], undefined, undefined, undefined, [na, nb, na])
    p.quad([a[k][0], a[k][1], z1], [a[l][0], a[l][1], z1], [b[l][0], b[l][1], z1], [b[k][0], b[k][1], z1])
  }
}
// The drum's attic (r 8.6 m, to 37.9 m), a step, and a straight 45° cone
// (lidar, radial medians: 38.3 m at r 8.4, 40.8 m at r 6, 46.6 m at the top).
drumRing(8.6, ENT, 37.9, 8.3)
drumRing(8.3, 37.9, 38.4, 8.0)
// The roof: a cone of seven stone steps on the lidar's 45° envelope (38.4 m
// at r 8.0 to 45.4 m at r 1.2), a flat top and a low knob.
{
  const steps = 7, r0 = 8.0, r1 = 1.2, z0 = 38.4, z1 = 45.4
  for (let k = 0; k < steps; k++) {
    const ra = r0 - ((r0 - r1) * k) / steps, rb = r0 - ((r0 - r1) * (k + 1)) / steps
    const za = z0 + ((z1 - z0) * k) / steps, zb = z0 + ((z1 - z0) * (k + 1)) / steps
    // each step: a sloped riser (most of the rise) and a narrow tread
    const zr = za + (zb - za) * 0.8
    const outer = circle(0, 0, ra, ringN), mid = circle(0, 0, rb + (ra - rb) * 0.25, ringN), inner = circle(0, 0, rb, ringN)
    for (let i = 0; i < ringN; i++) {
      const l = (i + 1) % ringN
      const n = (p: XY, up: number): V3 => { const h = Math.hypot(p[0], p[1]); return unit([p[0] / h, p[1] / h, up]) }
      shade.tri([outer[i][0], outer[i][1], za], [outer[l][0], outer[l][1], za], [mid[l][0], mid[l][1], zb], undefined, undefined, undefined, [n(outer[i], 0.5), n(outer[l], 0.5), n(mid[l], 0.5)])
      shade.tri([outer[i][0], outer[i][1], za], [mid[l][0], mid[l][1], zb], [mid[i][0], mid[i][1], zb], undefined, undefined, undefined, [n(outer[i], 0.5), n(mid[l], 0.5), n(mid[i], 0.5)])
      granite.quad([mid[i][0], mid[i][1], zb], [mid[l][0], mid[l][1], zb], [inner[l][0], inner[l][1], zb], [inner[i][0], inner[i][1], zb])
    }
    void zr
  }
  const top = circle(0, 0, r1, ringN)
  for (let i = 1; i < ringN - 1; i++) granite.tri([top[0][0], top[0][1], z1], [top[i][0], top[i][1], z1], [top[i + 1][0], top[i + 1][1], z1])
  prism({ wall: granite, win: null, roof: granite, ring: circle(0, 0, 0.6, 10), z0: z1, z1: 46.3, facade: null, bevel: 0.15 })
}

finishModel("General Grant National Memorial", 'nyc-grants-tomb', [
  { part: granite, material: PALETTE.stone },
  { part: shade, material: finish('grant-stone-shade', 0xdcd2c1) },
  { part: win, material: PALETTE.window },
  { part: dark, material: { ...PALETTE.window, name: 'window-2', color: 0x5d6c78 } },
], { bearing: 21.1, osm: 'way/271922197', height: 46.6 }, 5000)
