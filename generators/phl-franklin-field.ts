/**
 * Franklin Field, University of Pennsylvania, Philadelphia (1895; present
 * stands 1922, upper deck 1925; Day & Klauder) — original procedural
 * geometry, CC0-1.0.
 * bun generators/phl-franklin-field.ts
 *
 * Map frame, turned to the stadium: +x runs along the field toward the closed
 * (south-east) end, +y toward the north-east stand, z up, metres. BEARING
 * 42.5: the long sides of the OSM pitch and stand outlines run at 132.5 and
 * 312.5 degrees. Origin = the anchor -75.18997, 39.95007 (1.9 m from the
 * area centroid of the stadium outline way/665447049), the middle of the
 * field.
 *
 * Form. A brick horseshoe of double-decked stands, open to the north-west
 * (where Weightman Hall closes the view) and curved round the south-east
 * end. Each stand is drawn as one section swept along the field's front
 * line: the low brick wall at the track, the lower deck's grey benches
 * running back under the upper deck, the dark gap beneath the upper deck,
 * the upper deck's pale fascia and its benches rising to the brick parapet,
 * and the outer wall. The sides are 25.5 m deep; the curved end is deeper
 * (36.5 m), with more of its lower deck in the open and its upper deck
 * rising higher (lidar). Outside, the wall is the stadium's brick arcade:
 * one bay every 9.2 m with a big round arch at street level, a pale belt
 * course, two small round-arched openings above, a pale cornice, and the
 * crenellated parapet; pale stone quoined piers every third bay. The press
 * box stands on the north-east upper deck.
 *
 * Elevation / ground. The field is at street level on the sides, but the
 * ground falls away outside the curved end toward the rail cut, and the map
 * stands a model on the lowest ground under it. So z = 0 is that low
 * ground and the field is at z = 6.6 (lidar: field 7.6 m, lowest ground
 * outside the end wall 1.0 m, above the box minimum). The outer walls run
 * down to z = 0 everywhere; on the sides they sink into the street. The
 * arcade starts at street level (z 6.1). Elevation 0.
 *
 * Evidence
 * - OSM way/665447049 (leisure=stadium, Franklin Field, wikidata Q5491503)
 *   and way/624597559 (building=stadium, "Weiss Pavillion": the horseshoe
 *   of stands itself). Both replaced. The pitch way/32273357 is the map's.
 *   The OSM outline's curved end stops about 12 m short of the lidar's
 *   outer wall; the lidar is followed.
 * - USGS 3DEP lidar USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown
 *   2015), 1 m grid read in this frame, heights above the field: side
 *   stands' front wall at y ±49 (1.8 m), lower deck seen to y ±55 (4 m),
 *   upper deck lip at y ±55 (15 m) rising to 23.8-25 m at the outer wall
 *   (y ±74.5); curved end front at x 86, lower deck in the open to x 100
 *   (6.2 m), upper lip at x 100 (16.2 m) rising to 28.5 m at the outer wall
 *   (x 122); stands end at x -79 at the open end; press box x -22..58,
 *   y 66-72, top 29 m.
 * - NAIP (USGS, public domain): the horseshoe plan, pale benches, the press
 *   box roof on the north-east side.
 * - Published: opened 1895, rebuilt 1922 with the upper deck added 1925;
 *   architects Day & Klauder; capacity 52,593 (Wikipedia, "Franklin Field").
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 * - "Franklin Field, Philadelphia, 2024.jpg", JJonahJackalope, CC BY-SA 4.0
 *   (the outer arcade at the corner of the curved end: arches, quoins,
 *   crenellations, brick colour)
 *   https://commons.wikimedia.org/wiki/File:Franklin_Field,_Philadelphia,_2024.jpg
 * - "Franklin Field (Philadelphia)-exterior.JPG", Jeffrey M. Vinocur, CC BY
 *   2.5 (the curved end's arcade from the rail side)
 *   https://commons.wikimedia.org/wiki/File:Franklin_Field_(Philadelphia)-exterior.JPG
 * - "Football Practice on Franklin Field ... .jpg", Adam Jones, Ph.D., CC
 *   BY-SA 3.0 (inside: both decks, the gap under the upper deck, the pale
 *   fascia, the brick parapet)
 *   https://commons.wikimedia.org/wiki/File:Football_Practice_on_Franklin_Field_-_University_of_Pennsylvania_-_Philadelphia_-_Pennsylvania.jpg
 * - "Franklin Field, Penn.jpg", Phil Roeder, CC BY 2.0 (a tunnel under the
 *   stands, the open end toward Weightman Hall)
 *   https://commons.wikimedia.org/wiki/File:Franklin_Field,_Penn.jpg
 * - "FranklinFieldPenn.jpg", Etumretinw, CC BY-SA 3.0 (the open end:
 *   Weightman Hall, not part of this model)
 *   https://commons.wikimedia.org/wiki/File:FranklinFieldPenn.jpg
 * - "Franklin Field aerial.jpg", NASA World Wind, public domain (plan)
 *   https://commons.wikimedia.org/wiki/File:Franklin_Field_aerial.jpg
 *
 * Estimated: the bay (9.2 m) and the arch sizes (big arches 6.6 m wide,
 * springing 6 m up; upper openings 3.0 m wide), the belt course and cornice
 * heights, from the JJonahJackalope and Vinocur photos scaled against the
 * lidar wall height; quoined piers every third bay; the lower deck under the
 * upper one (hidden; drawn running back to 13 m on the sides); the
 * crenellation drawn as two merlons per bay (the real ones are smaller and
 * closer); the curved end drawn as a super-ellipse fitted to the lidar
 * front line (x 86 at the middle, the sides at y ±49).
 *
 * Colours (daylight photos, pulled to the palette's lightness): brick a warm
 * brown-tan (#b48a6c); benches pale concrete grey; the pale stone quoins,
 * belts and fascia `stone`; the arches and the gap under the upper deck a
 * dark warm grey (they are open and in shadow).
 *
 * Night: the press box glazing glows (window); the open arcades and the
 * stands stay unlit (no licensed night photo was checked).
 *
 * Left out: the field, track and markings (the map's), the flagpoles on the
 * parapet, the scoreboard, lettering, the seat numbers and aisles, and the
 * columns under the upper deck. Doubts: the hidden lower deck's depth; the
 * bay count on the curved end (the arches are spaced evenly along the wall).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { saveTower } from './phl-comcast-center'

const BEARING = 42.5
const ANCHOR = { lng: -75.18997, lat: 39.95007 }

const brick = new Part(), seats = new Part(), dark = new Part(), stone = new Part(), glass = new Part(), roof = new Part()

const FIELD = 6.6          // field above the lowest ground (lidar)
const STREET = FIELD - 0.5 // the arcade's base
const X_OPEN = -79         // the stands end here at the open end
const X0 = 60, A = 26, B = 49, NEXP = 2.5 // inner front line: straight sides, super-ellipse end

type P2 = [number, number]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
/** A planar convex polygon, wound so it faces along `out`. */
function poly(part: Part, pts: V3[], out: V3) {
  const n: V3 = [0, 0, 0]
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; n[0] += (a[1] - b[1]) * (a[2] + b[2]); n[1] += (a[2] - b[2]) * (a[0] + b[0]); n[2] += (a[0] - b[0]) * (a[1] + b[1]) }
  const q = dot(n, out) < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < q.length - 1; i++) part.tri(q[0], q[i], q[i + 1])
}

// ---------- the inner front line, dense, with the side-to-end blend ----------
type Sample = { p: P2; s: number }
const dense: Sample[] = []
for (let x = X_OPEN; x < X0; x += 1) dense.push({ p: [x, -B], s: 0 })
for (let i = 0; i <= 180; i++) {
  const th = -Math.PI / 2 + (Math.PI * i) / 180
  const c = Math.cos(th), sn = Math.sin(th)
  dense.push({ p: [X0 + A * Math.sign(c) * Math.abs(c) ** (2 / NEXP), B * Math.sign(sn) * Math.abs(sn) ** (2 / NEXP)], s: c * c })
}
for (let x = X0 - 1; x >= X_OPEN; x -= 1) dense.push({ p: [x, B], s: 0 })
const normalAt = (i: number): P2 => {
  const a = dense[Math.max(0, i - 1)].p, b = dense[Math.min(dense.length - 1, i + 1)].p
  const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty)
  return [ty / l, -tx / l] // outward: right of the direction of travel
}

// ---------- the section: (d outward from the front line, height above the low ground) ----------
type Seg = Part
function section(s: number): Array<[number, number, Seg]> {
  const L = (side: number, end: number) => side + (end - side) * s
  const D = L(25.5, 36.5)
  // each point carries the part of the face from it to the next point
  return [
    [0, FIELD, brick],                              // front wall at the track
    [0, FIELD + 1.8, seats],                        // lower deck benches
    [L(13, 16), FIELD + L(6.0, 6.8), dark],         // dark back of the gap under the upper deck
    [L(13, 16), FIELD + L(11.5, 13.8), dark],       // soffit
    [L(6.5, 14.5), FIELD + L(13.4, 15.2), stone],   // pale fascia
    [L(6.5, 14.5), FIELD + L(15.0, 16.6), seats],   // upper deck benches
    [D - 1, FIELD + L(22.4, 25.6), brick],          // brick parapet, inside (about 2.5 m of brick above the top row)
    [D - 1, FIELD + L(25.0, 28.0), brick],          // parapet top
    [D, FIELD + L(25.0, 28.0), brick],              // outer wall
    [D, 0, dark],                                   // underside (hidden)
  ]
}

// Resample so the outer wall's vertices fall every BAY metres along it.
const BAY = 9.2
const outerDense = dense.map((q, i) => { const n = normalAt(i), D = section(q.s)[8][0]; return [q.p[0] + n[0] * D, q.p[1] + n[1] * D] as P2 })
const cum = [0]
for (let i = 1; i < outerDense.length; i++) cum.push(cum[i - 1] + Math.hypot(outerDense[i][0] - outerDense[i - 1][0], outerDense[i][1] - outerDense[i - 1][1]))
const total = cum[cum.length - 1]
const nBays = Math.round(total / BAY)
const samples: { p: P2; n: P2; s: number }[] = []
for (let k = 0; k <= nBays; k++) {
  const target = (k * total) / nBays
  let i = cum.findIndex((c) => c >= target); if (i <= 0) i = 1
  const f = (target - cum[i - 1]) / (cum[i] - cum[i - 1] || 1)
  const a = dense[i - 1], b = dense[i], na = normalAt(i - 1), nb = normalAt(i)
  const n: P2 = [na[0] + (nb[0] - na[0]) * f, na[1] + (nb[1] - na[1]) * f]; const nl = Math.hypot(...n)
  samples.push({ p: [a.p[0] + (b.p[0] - a.p[0]) * f, a.p[1] + (b.p[1] - a.p[1]) * f], n: [n[0] / nl, n[1] / nl], s: a.s + (b.s - a.s) * f })
}
const at = (k: number, d: number, z: number): V3 => [samples[k].p[0] + samples[k].n[0] * d, samples[k].p[1] + samples[k].n[1] * d, z]

// ---------- the stands: the section swept along the front line ----------
const wind = (() => { const sec = section(0); let a = 0; for (let i = 0; i < sec.length; i++) { const p = sec[i], q = sec[(i + 1) % sec.length]; a += p[0] * q[1] - q[0] * p[1] }; return a })()
for (let k = 0; k < samples.length - 1; k++) {
  const s0 = section(samples[k].s), s1 = section(samples[k + 1].s)
  for (let j = 0; j < s0.length; j++) {
    const jn = (j + 1) % s0.length
    const a0 = at(k, s0[j][0], s0[j][1]), b0 = at(k, s0[jn][0], s0[jn][1])
    const a1 = at(k + 1, s1[j][0], s1[j][1]), b1 = at(k + 1, s1[jn][0], s1[jn][1])
    // outward for this face, from the section's winding in (d, z)
    const e = [s0[jn][0] - s0[j][0], s0[jn][1] - s0[j][1]]
    const n2 = wind > 0 ? [e[1], -e[0]] : [-e[1], e[0]] // right of the edge for a CCW section
    const nh = samples[k].n
    const want: V3 = [nh[0] * n2[0], nh[1] * n2[0], n2[1]]
    const n = cross(sub(b0, a0), sub(a1, a0))
    const q = dot(n, want) < 0 ? [a0, a1, b1, b0] : [a0, b0, b1, a1]
    s0[j][2].tri(q[0], q[1], q[2]); s0[j][2].tri(q[0], q[2], q[3])
  }
}
// End caps at the open end: the section, ear-clipped.
function earClip(pts: P2[]): number[][] {
  const idx = pts.map((_, i) => i), out: number[][] = []
  const area = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1])
  let sign = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; sign += a[0] * b[1] - b[0] * a[1] }
  const ccw = sign > 0
  let guard = 0
  while (idx.length > 3 && guard++ < 500) {
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const ar = area(pts[ia], pts[ib], pts[ic])
      if ((ccw ? ar : -ar) <= 1e-9) continue
      const inTri = idx.some((m) => m !== ia && m !== ib && m !== ic && (() => {
        const p = pts[m], d1 = area(pts[ia], pts[ib], p), d2 = area(pts[ib], pts[ic], p), d3 = area(pts[ic], pts[ia], p)
        return ccw ? d1 > 0 && d2 > 0 && d3 > 0 : d1 < 0 && d2 < 0 && d3 < 0
      })())
      if (inTri) continue
      out.push([ia, ib, ic]); idx.splice(i, 1); break
    }
  }
  out.push(idx)
  return out
}
for (const [k, dir] of [[0, -1], [samples.length - 1, 1]] as [number, number][]) {
  const sec = section(samples[k].s)
  const tris = earClip(sec.map(([d, z]) => [d, z] as P2))
  const t = samples[k].n, out: V3 = [-t[1] * dir, t[0] * dir, 0] // along the line of travel, away from the stands
  // tangent at the ends: the sides run along x, so the open-end caps face -x
  const face: V3 = [-1, 0, 0]
  void out
  for (const [a, b, c] of tris) poly(brick, [at(k, sec[a][0], sec[a][1]), at(k, sec[b][0], sec[b][1]), at(k, sec[c][0], sec[c][1])], face)
}

// ---------- the outer arcade, one bay per outer-wall segment ----------
function onWall(k: number, u: number, z: number, off = 0.06): V3 {
  // u metres along the outer wall segment k (from its start), z height
  const D0 = section(samples[k].s)[8][0], D1 = section(samples[k + 1].s)[8][0]
  const a = at(k, D0, 0), b = at(k + 1, D1, 0)
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), tx = (b[0] - a[0]) / L, ty = (b[1] - a[1]) / L
  const nx = ty, ny = -tx // outward (right of travel)
  return [a[0] + tx * u + nx * off, a[1] + ty * u + ny * off, z]
}
function segLen(k: number) {
  const a = at(k, section(samples[k].s)[8][0], 0), b = at(k + 1, section(samples[k + 1].s)[8][0], 0)
  return Math.hypot(b[0] - a[0], b[1] - a[1])
}
function segOut(k: number): V3 {
  const a = onWall(k, 0, 0, 0), b = onWall(k, 1, 0, 0)
  return [b[1] - a[1], -(b[0] - a[0]), 0]
}
function arch(part: Part, k: number, uc: number, w: number, z0: number, spring: number, off = 0.06) {
  const r = w / 2, pts: V3[] = [onWall(k, uc - r, z0, off), onWall(k, uc + r, z0, off)]
  for (let i = 0; i <= 10; i++) { const a = (Math.PI * i) / 10; pts.push(onWall(k, uc + r * Math.cos(a), spring + r * Math.sin(a), off)) }
  poly(part, pts, segOut(k))
}
function band(part: Part, k: number, u0: number, u1: number, z0: number, z1: number, off = 0.08) {
  poly(part, [onWall(k, u0, z0, off), onWall(k, u1, z0, off), onWall(k, u1, z1, off), onWall(k, u0, z1, off)], segOut(k))
}
for (let k = 0; k < samples.length - 1; k++) {
  const L = segLen(k), top = section(samples[k].s)[8][1]
  const H = top - STREET // facade height above the street
  const big = Math.min(6.6, L - 2.6), uc = L / 2
  arch(dark, k, uc, big, STREET, STREET + 6.0)
  band(stone, k, 0, L, STREET + 10.8, STREET + 11.6)
  for (const f of [-1, 1]) arch(dark, k, uc + f * L * 0.24, 3.0, STREET + 12.6, STREET + 15.8)
  band(stone, k, 0, L, STREET + H - 5.6, STREET + H - 4.8)
  if (k % 3 === 0) band(stone, k, 0.15, 1.5, STREET, STREET + H - 5.6, 0.1)
  // merlons on the parapet: two per bay, real boxes
  const D = section(samples[k].s)[8][0], t = 0.7
  for (const f of [0.25, 0.75]) {
    const u0 = L * f - 0.6, u1 = L * f + 0.6
    const p = (u: number, z: number, off: number) => onWall(k, u, z, off)
    const outv = segOut(k)
    const inv: V3 = [-outv[0], -outv[1], 0]
    const along: V3 = sub(onWall(k, 1, 0, 0), onWall(k, 0, 0, 0))
    poly(brick, [p(u0, top, 0.02), p(u1, top, 0.02), p(u1, top + 1.1, 0.02), p(u0, top + 1.1, 0.02)], outv)
    poly(brick, [p(u0, top, -t), p(u1, top, -t), p(u1, top + 1.1, -t), p(u0, top + 1.1, -t)], inv)
    poly(brick, [p(u0, top + 1.1, 0.02), p(u1, top + 1.1, 0.02), p(u1, top + 1.1, -t), p(u0, top + 1.1, -t)], [0, 0, 1])
    poly(brick, [p(u0, top, 0.02), p(u0, top + 1.1, 0.02), p(u0, top + 1.1, -t), p(u0, top, -t)], [-along[0], -along[1], 0])
    poly(brick, [p(u1, top, 0.02), p(u1, top + 1.1, 0.02), p(u1, top + 1.1, -t), p(u1, top, -t)], along)
    void D
  }
}

// ---------- vomitories: dark openings in the upper deck, every fourth bay ----------
for (let k = 2; k < samples.length - 1; k += 4) {
  const sec0 = section(samples[k].s), sec1 = section(samples[k + 1].s)
  // the upper rake runs from point 5 to point 6 of the section
  const rake = (sec: ReturnType<typeof section>, f: number): [number, number] => [sec[5][0] + (sec[6][0] - sec[5][0]) * f, sec[5][1] + (sec[6][1] - sec[5][1]) * f]
  const pt = (kk: number, sec: ReturnType<typeof section>, f: number, lift = 0.12): V3 => { const [d, z] = rake(sec, f); return at(kk, d, z + lift) }
  const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
  const f0 = 0.36, f1 = 0.56, t0 = 0.32, t1 = 0.68
  const A0 = pt(k, sec0, f0), A1 = pt(k + 1, sec1, f0), B0 = pt(k, sec0, f1), B1 = pt(k + 1, sec1, f1)
  poly(dark, [lerp3(A0, A1, t0), lerp3(A0, A1, t1), lerp3(B0, B1, t1), lerp3(B0, B1, t0)], [0, 0, 1])
}

// ---------- the press box on the north-east upper deck ----------
{
  const x0 = -22, x1 = 58, y0 = 66, y1 = 72.5
  const zb = FIELD + 20     // the upper deck under its front (section)
  const zTop = FIELD + 28.8 // lidar
  const c: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, (zb + zTop) / 2]
  const quad = (part: Part, pts: V3[]) => { const m = pts.reduce((s, p) => [s[0] + p[0] / 4, s[1] + p[1] / 4, s[2] + p[2] / 4] as V3, [0, 0, 0] as V3); poly(part, pts, sub(m, c)) }
  quad(glass, [[x0, y0, zb + 2], [x1, y0, zb + 2], [x1, y0, zTop - 2.2], [x0, y0, zTop - 2.2]])  // glazed front, facing the field
  quad(stone, [[x0, y0, zb], [x1, y0, zb], [x1, y0, zb + 2], [x0, y0, zb + 2]])
  quad(stone, [[x0, y0, zTop - 2.2], [x1, y0, zTop - 2.2], [x1, y0, zTop], [x0, y0, zTop]])
  quad(brick, [[x0, y0, zb], [x0, y1, zb], [x0, y1, zTop], [x0, y0, zTop]])
  quad(brick, [[x1, y0, zb], [x1, y1, zb], [x1, y1, zTop], [x1, y0, zTop]])
  quad(brick, [[x0, y1, zb], [x1, y1, zb], [x1, y1, zTop], [x0, y1, zTop]])
  quad(roof, [[x0, y0, zTop], [x1, y0, zTop], [x1, y1, zTop], [x0, y1, zTop]])
}

await saveTower('phl-franklin-field', 'Franklin Field', [
  { part: brick, material: finish('ff-brick', 0xb48a6c) },
  { part: seats, material: finish('ff-benches', 0xcfcbc3) },
  { part: dark, material: finish('ff-shadow', 0x5f5852) },
  { part: stone, material: PALETTE.stone },
  { part: glass, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
], { bearing: BEARING, anchor: ANCHOR, height: FIELD + 29, replaces: ['way/665447049', 'way/624597559'] }, 6500)
