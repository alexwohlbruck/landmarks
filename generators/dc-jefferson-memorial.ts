/**
 * Thomas Jefferson Memorial — procedural, CC0-1.0, no textures.
 * bun generators/dc-jefferson-memorial.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the centroid of the OSM
 * outline (way/248460669). The rotunda's centre, fitted to the 25 colonnade
 * columns in OSM (radius 22.4 m), is 4.4 m south of that, and the building
 * is laid out about it. The portico faces due north across the Tidal Basin
 * to the White House, so the model is placed at bearing 0.
 *
 * Modelled: the low marble retaining wall of the circular terrace with its
 * lawn, open to the north; the stepped circular platform; the colonnade of
 * 26 Ionic columns round the cella, whose four openings are dark recesses;
 * the entablature, cornice and parapet; the flat roof ring; the drum, the
 * three stepped rings and the low dome; the north portico of eight columns
 * (and one more behind each end), its side walls with their tall arches,
 * entablature, pediment and roof; and the great north stairs with their
 * flanking blocks.
 *
 * Evidence:
 * - OSM, way/248460669 (outline, historic=monument) and its parts: the
 *   colonnade, 34 columns 1.7 m across (25 round the rotunda, 9 in the
 *   portico); the podium rings 248460774 / 767 / 770 (r 28.8 → 25.5 m, with
 *   a rectangle out to the portico); the terrace 248460790 (lawn, r ≈ 45 m,
 *   open to the north); the north steps 248460690 (63 × 20 m) and the blocks
 *   248460777 / 779; the entablature 66418912, the drum 248460682, the dome
 *   248460781 (r 17.2, top 39 m); the portico roof 248460786 (gabled,
 *   29.6 m wide) and its side walls 248460688 / 689; the statue pedestal
 *   248460766 (inside, not drawn). Building 1491844988 is the platform again.
 * - Published (NPS; Wikipedia "Jefferson Memorial"; NRHP 66000029): John
 *   Russell Pope's Pantheon-derived rotunda in Imperial Danby marble; the
 *   colonnade's 26 Ionic columns are 41 ft (12.5 m) tall; the portico has
 *   eight columns across.
 * - Photos (Wikimedia Commons): "Jefferson Memorial Washington April 2017
 *   001.jpg" (King of Hearts, CC BY-SA 4.0, from the north-east across the
 *   basin, near level — used for the heights); "Jefferson Memorial v.
 *   Süd-Osten.JPG" (Vincent Devens, CC BY-SA 3.0, the south side); "Jefferson
 *   Memorial Front.jpg" (Graysick, CC BY-SA 3.0, the portico and stairs);
 *   "Jefferson Memorial, aerial view" LCCN2010630278 and LCCN2010630677
 *   (Carol M. Highsmith, public domain, for the roof rings and radii);
 *   "Jefferson Memorial from the air.jpg" (aewolf, CC BY 2.0).
 *
 * Measured from the photos, against the published column height: the
 * stylobate at 5.5 m above the plaza and the road (OSM has 4), the
 * entablature (3.4 m) and cornice, the drum and ring heights, and the top at
 * 35.5 m, which is 30.0 m above the floor.
 *
 * Height, against the published figures. The NPS fact sheet (as quoted with
 * the memorial's other facts, e.g. flickr.com/photos/bootbearwdc/32971256)
 * gives "height from road to top of dome: 129 ft 4 in (39.42 m)" and
 * "height from floor to ceiling of dome: 91 ft 8 in (27.94 m)"; the dome
 * shell is 4 ft (1.2 m) thick (New World Encyclopedia). OSM's 39 m is the
 * first figure. The two only agree if the floor stands about 10 m above the
 * road, and neither the photos (road, 3 m terrace wall, steps, floor at
 * about 5.5 m, from the south and across the basin) nor OSM (floor at 4 m)
 * show that. The floor-relative figure (27.94 + 1.2 = 29.1 m from floor to
 * crown) does match the photos and this model (30.0 m), so the dome is kept
 * to it and the overall height is 35.5 m above the plaza rather than
 * 39.4 m. If the road datum turns out to be lower ground (the 1940s
 * approach roads, or the grade before the site settled), 39.4 m and this
 * model are consistent.
 *
 * The radii of the drum (17.0), rings and cap (12.4) come from the overhead
 * aerial; OSM's dome polygon (17.2) is the drum. Estimated: the arches in
 * the portico side walls, the number of steps (drawn coarser than the real risers), and
 * the stairs' split into flights. Columns are placed symmetrically (26 round
 * the rotunda, none on the south axis, as the photo from the south shows);
 * OSM's 25 sit within a few degrees of them. OSM has a column on the
 * portico's centre line; the photos show eight across with an open middle.
 * Not modelled: the statue, the pediment sculpture, the column flutes and
 * volutes, the plaza beyond the bottom step, and any water.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, circle, column, flight, orient, prism, rect } from './dc-lincoln-memorial'

const marble = new Part(), roof = new Part(), lawn = new Part(), dark = new Part()

const OY = -4.4 // rotunda centre, north of the outline centroid by this much (south)

// Heights above the plaza at the foot of the north stairs.
const TERRACE = 3.0, STYLO = 5.5, COL_TOP = 18.0, ENT = 21.4, CORN = 22.2
const PARA = 23.2, ROOF = 22.6
const DRUM = [[17.0, 25.8], [15.6, 26.8], [14.3, 27.8], [13.2, 28.8]] as const
const CAP_R = 12.4, CAP_TOP = 35.5

const R_COL = 22.4, R_CELLA = 18.6, R_ENT = 23.3, R_CORN = 23.9, R_PARA = 23.4

const N = 40 // segments round the big circles

/** A flat annulus between radii a (inner) and b (outer) at height z. */
function annulus(p: Part, a: number, b: number, z: number, up = true, n = N) {
  const I = circle(0, 0, a, n), O = circle(0, 0, b, n)
  for (let k = 0; k < n; k++) {
    const l = (k + 1) % n
    const q: V3[] = [[I[k][0], I[k][1], z], [O[k][0], O[k][1], z], [O[l][0], O[l][1], z], [I[l][0], I[l][1], z]]
    orient(p, q, [0, 0, up ? 1 : -1])
  }
}

/** Walls and an up-facing cap for a ring that is star-shaped about the origin. */
function starPrism(p: Part, ring: XY[], z0: number, z1: number) {
  const lo = ring.map(([x, y]) => [x, y, z0] as V3), hi = ring.map(([x, y]) => [x, y, z1] as V3)
  p.loft([lo, hi])
  for (let k = 0; k < ring.length; k++) p.tri([0, 0, z1], hi[k], hi[(k + 1) % ring.length])
}

/** Ear-clipping triangulation of a simple counter-clockwise polygon, at height z. */
function fill(p: Part, poly: XY[], z: number) {
  const idx = poly.map((_, i) => i)
  const cross = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (pt: XY, a: XY, b: XY, c: XY) => cross(a, b, pt) > 1e-9 && cross(b, c, pt) > 1e-9 && cross(c, a, pt) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let clipped = false
    for (let i = 0; i < idx.length; i++) {
      const a = poly[idx[(i + idx.length - 1) % idx.length]], b = poly[idx[i]], c = poly[idx[(i + 1) % idx.length]]
      if (cross(a, b, c) <= 1e-9) continue
      if (idx.some((j) => { const q = poly[j]; return q !== a && q !== b && q !== c && inside(q, a, b, c) })) continue
      p.tri([a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z])
      idx.splice(i, 1)
      clipped = true
      break
    }
    if (!clipped) throw new Error('fill: polygon is not simple')
  }
  const [a, b, c] = idx.map((i) => poly[i])
  p.tri([a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z])
}

/** Points along a circle of radius r from angle a0 to a1 (degrees), inclusive. */
function arc(r: number, a0: number, a1: number, n: number): XY[] {
  return Array.from({ length: n + 1 }, (_, k) => {
    const a = ((a0 + ((a1 - a0) * k) / n) * Math.PI) / 180
    return [r * Math.cos(a), r * Math.sin(a)] as XY
  })
}
const deg = (x: number, y: number) => (Math.atan2(y, x) * 180) / Math.PI

// ---------------------------------------------------------------------------
// Terrace: a low marble wall round a lawn, open to the north for the stairs.

const T_R = 44.8, T_X = 29.7, T_Y = 33.5, T_N = 41.7, ST_X = 26.0, ST_Y = 30.0
const BUMP_X = 16.8, BUMP_Y = -43.9 // the short straight wall on the south axis
{
  // Outer edge, clockwise from the north-east stub round the south to the
  // north-west one, with the short straight wall across the south axis.
  const a0 = deg(T_X, Math.sqrt(T_R * T_R - T_X * T_X)), a1 = 180 - a0
  const yB = -Math.sqrt(T_R * T_R - BUMP_X * BUMP_X)
  const outer: XY[] = []
  let bumped = false
  for (const [x, y] of arc(T_R, a0, a1 - 360, 44)) {
    if (Math.abs(x) < BUMP_X && y < 0) {
      if (!bumped) outer.push([BUMP_X, yB], [BUMP_X, BUMP_Y], [-BUMP_X, BUMP_Y], [-BUMP_X, yB])
      bumped = true
      continue
    }
    outer.push([x, y])
  }
  const path: XY[] = [[ST_X, T_N], [T_X, T_N], [T_X, T_Y], ...outer, [-T_X, T_Y], [-T_X, T_N], [-ST_X, T_N]]
  // The wall: the path runs clockwise, so each face is wound the other way.
  for (let k = 0; k < path.length - 1; k++) {
    const [a, b] = [path[k], path[k + 1]]
    marble.quad([b[0], b[1], 0], [a[0], a[1], 0], [a[0], a[1], TERRACE], [b[0], b[1], TERRACE])
  }
  // Lawn, counter-clockwise: the wall from the north-west stub round to the
  // north-east one, then back along the stairs' side and the platform's foot.
  const xh = 21.2, rP = 28.8, aj = deg(xh, Math.sqrt(rP * rP - xh * xh))
  const inner: XY[] = [[ST_X, ST_Y], [xh, ST_Y], ...arc(rP, aj, 180 - aj - 360, 40), [-xh, ST_Y], [-ST_X, ST_Y]]
  fill(lawn, dedupe([...[...path].reverse(), ...inner]), TERRACE)
}
function dedupe(poly: XY[]) {
  return poly.filter((p, i) => {
    const q = poly[(i + poly.length - 1) % poly.length]
    return Math.hypot(p[0] - q[0], p[1] - q[1]) > 1e-6
  })
}

// ---------------------------------------------------------------------------
// The platform: five circular steps from the lawn to the stylobate, each
// running out north as a rectangle under the portico.

for (let k = 0; k < 5; k++) {
  const r = 28.8 - 0.82 * k, xh = 21.2 - 0.82 * k, yN = 32 - 0.5 * k
  const yj = Math.sqrt(r * r - xh * xh), aj = deg(xh, yj)
  const ring: XY[] = [...arc(r, aj, aj - 360 + 2 * (90 - aj), 40), [-xh, yN], [xh, yN]]
  // arc from the north-east junction clockwise round the south to the north-west junction
  starPrism(marble, ring.slice().reverse(), TERRACE + 0.5 * k, TERRACE + 0.5 * (k + 1))
}

// North stairs: the long upper flight from the stylobate to the terrace,
// a short middle flight between the blocks, and a broad bottom flight.
flight(marble, 3, -41.6, -ST_Y, -ST_X, ST_X, TERRACE, STYLO, 10, TERRACE)
flight(marble, 3, -46.6, -41.6, -25.6, 25.6, 2.2, TERRACE, 3, 0)
flight(marble, 3, -51.4, -46.6, -31.5, 31.5, 0, 2.2, 8, 0)
for (const s of [-1, 1]) prism(marble, rect(s > 0 ? 25.6 : -30.6, s > 0 ? 30.6 : -25.6, 41.6, 46.6, 0.2), 0, TERRACE + 0.2)

// ---------------------------------------------------------------------------
// Rotunda.

// Colonnade: 26 Ionic columns, symmetric about the north–south axis, none on it.
const STEP = 10.8
const cols: XY[] = []
for (let k = 0; k < 13; k++) for (const s of [-1, 1]) {
  const a = ((-90 + s * (k + 0.5) * STEP) * Math.PI) / 180
  cols.push([R_COL * Math.cos(a), R_COL * Math.sin(a)])
}
// Portico: eight across the front, and one behind each end.
const FRONT_Y = 28.5
for (const x of [1.9, 5.66, 9.43, 13.2]) for (const s of [-1, 1]) cols.push([s * x, FRONT_Y])
cols.push([13.2, 24.6], [-13.2, 24.6])
for (const [x, y] of cols) {
  column(marble, x, y, STYLO, COL_TOP - 0.7, 0.82, 0.68, 12)
  column(marble, x, y, COL_TOP - 0.7, COL_TOP - 0.35, 0.72, 0.9, 12)          // echinus and volutes, as one flare
  prism(marble, rect(x - 0.95, x + 0.95, y - 0.95, y + 0.95, 0), COL_TOP - 0.35, COL_TOP, false)
}

// Cella: a 24-sided wall with dark openings on the four axes.
{
  const n = 24, ring = circle(0, 0, R_CELLA, n)
  const open = new Set([23, 0, 5, 6, 11, 12, 17, 18]) // segments either side of 0°, 90°, 180°, 270°
  const OPEN_TOP = 16.0
  for (let k = 0; k < n; k++) {
    const l = (k + 1) % n
    const a = ring[k], b = ring[l]
    const q = (z0: number, z1: number): V3[] => [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]]
    if (open.has(k)) {
      dark.quad(...(q(STYLO, OPEN_TOP) as [V3, V3, V3, V3]))
      marble.quad(...(q(OPEN_TOP, COL_TOP) as [V3, V3, V3, V3]))
    } else marble.quad(...(q(STYLO, COL_TOP) as [V3, V3, V3, V3]))
  }
}

// Peristyle ceiling, entablature, cornice, parapet.
annulus(marble, R_CELLA - 0.6, R_ENT, COL_TOP, false)
column(marble, 0, 0, COL_TOP, ENT - 0.4, R_ENT, R_ENT, N)
column(marble, 0, 0, ENT - 0.4, ENT, R_ENT, R_CORN, N)                      // bed moulding
column(marble, 0, 0, ENT, CORN, R_CORN, R_CORN, N)
annulus(marble, R_PARA, R_CORN, CORN)
column(marble, 0, 0, CORN, PARA, R_PARA, R_PARA, N)
annulus(marble, R_PARA - 0.6, R_PARA, PARA)
{
  // Inner face of the parapet, looking into the roof.
  const I = circle(0, 0, R_PARA - 0.6, N)
  for (let k = 0; k < N; k++) {
    const l = (k + 1) % N
    marble.quad([I[l][0], I[l][1], ROOF], [I[k][0], I[k][1], ROOF], [I[k][0], I[k][1], PARA], [I[l][0], I[l][1], PARA])
  }
}
annulus(roof, DRUM[0][0], R_PARA - 0.6, ROOF)

// Drum and stepped rings.
{
  let z = ROOF
  DRUM.forEach(([r, top], i) => {
    column(marble, 0, 0, z, top, r, r, N)
    const next = i + 1 < DRUM.length ? DRUM[i + 1][0] : CAP_R
    annulus(marble, next, r, top)
    z = top
  })
}

// Dome: a spherical cap from radius 12.4 at the top ring to the crown.
{
  const z0 = DRUM[DRUM.length - 1][1], h = CAP_TOP - z0
  const R = (CAP_R * CAP_R + h * h) / (2 * h), zc = CAP_TOP - R
  const phi0 = Math.asin(CAP_R / R), M = 6, n = 32
  const P = (i: number, k: number): { p: V3; n: V3 } => {
    const phi = phi0 * (1 - i / M), a = (k * 2 * Math.PI) / n
    const nn: V3 = [Math.sin(phi) * Math.cos(a), Math.sin(phi) * Math.sin(a), Math.cos(phi)]
    return { p: [R * nn[0], R * nn[1], zc + R * nn[2]], n: nn }
  }
  for (let i = 0; i < M; i++) for (let k = 0; k < n; k++) {
    const a = P(i, k), b = P(i, k + 1), c = P(i + 1, k + 1), d = P(i + 1, k)
    marble.tri(a.p, b.p, c.p, undefined, undefined, undefined, [a.n, b.n, c.n])
    if (i < M - 1) marble.tri(a.p, c.p, d.p, undefined, undefined, undefined, [a.n, c.n, d.n])
  }
}

// ---------------------------------------------------------------------------
// Portico.

const PX = 14.7, PY0 = 11.6, PY1 = 29.6, OVER = 0.5
// Side walls behind the columns, each with a tall arched opening.
for (const s of [-1, 1]) {
  const x0 = s > 0 ? 4.2 : -14.6, x1 = s > 0 ? 14.6 : -4.2
  prism(marble, rect(x0, x1, PY0, 22.2, 0.2), STYLO, COL_TOP, false)
  const cx = s * 9.4, w = 1.6, top = 13.6, spring = top - w, yF = 22.2 + 0.03
  const pts: XY[] = [[cx - w, STYLO], [cx + w, STYLO], ...arc(w, 0, 180, 8).map(([x, z]) => [cx + x, spring + z] as XY)]
  for (let k = 1; k < pts.length - 1; k++) {
    // Seen from the north (+y), x runs right to left, so wind the fan backwards.
    dark.tri([pts[0][0], yF, pts[0][1]], [pts[k + 1][0], yF, pts[k + 1][1]], [pts[k][0], yF, pts[k][1]])
  }
}
// Entablature, cornice, pediment and roof.
prism(marble, rect(-PX, PX, PY0, PY1, 0.15), COL_TOP, ENT - 0.4, false)
prism(marble, rect(-PX - OVER * 0.5, PX + OVER * 0.5, PY0, PY1 + OVER * 0.5, 0.15), ENT - 0.4, ENT, false)
prism(marble, rect(-PX - OVER, PX + OVER, PY0, PY1 + OVER, 0.15), ENT, CORN, true)
orient(marble, [[-PX, PY0, COL_TOP], [PX, PY0, COL_TOP], [PX, PY1, COL_TOP], [-PX, PY1, COL_TOP]], [0, 0, -1])
{
  const ex = PX + OVER, yF = PY1 + OVER, apex = CORN + 4.0
  // Tympanum, set back inside the raking cornice and a shade greyer, as it
  // reads in the photos, so the pediment holds its shape without shadows.
  roof.tri([ex - 0.6, yF - 0.35, CORN], [-ex + 0.6, yF - 0.35, CORN], [0, yF - 0.35, apex - 0.45])
  // Raking cornice: a band along each slope, standing proud of the tympanum.
  for (const s of [-1, 1]) {
    const a: V3 = [s * ex, yF, CORN], b: V3 = [0, yF, apex]
    const a2: V3 = [s * (ex - 0.6), yF, CORN], b2: V3 = [0, yF, apex - 0.45]
    orient(marble, [a, b, b2, a2], [0, 1, 0])
    // Soffit of the band, facing down into the tympanum.
    orient(marble, [a2, b2, [0, yF - 0.35, apex - 0.45], [s * (ex - 0.6), yF - 0.35, CORN]], [0, 0, -1])
    // Roof slope.
    orient(roof, [[s * ex, yF, CORN], [0, yF, apex], [0, PY0, apex], [s * ex, PY0, CORN]], [s * 0.26, 0, 1])
  }
  // Back gable, mostly inside the drum.
  marble.tri([-ex, PY0, CORN], [0, PY0, apex], [ex, PY0, CORN])
}

// ---------------------------------------------------------------------------

// Shift from the rotunda's centre to the outline centroid: map y → glTF −z.
for (const p of [marble, roof, lawn, dark]) for (let i = 2; i < p.pos.length; i += 3) p.pos[i] -= OY

const parts = [
  // Colours off the daylight photos: Danby marble, white with a faint warm
  // grey; the flat roofs, a pale grey; the terrace lawn, muted; the shadowed
  // openings into the chamber, which is lit at night.
  { part: marble, material: finish('danby-marble', 0xece8df) },
  { part: roof, material: { ...PALETTE.roof, color: 0xc9c8c2 } },
  { part: lawn, material: finish('terrace-lawn', 0xa8b48f) },
  { part: dark, material: { name: 'entrance', color: 0x6f6b64, roughness: 0.85 } },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Thomas Jefferson Memorial', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 0, osm: 'way/248460669', footprint: [89.6, 95.3], height: CAP_TOP,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/dc-jefferson-memorial.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
