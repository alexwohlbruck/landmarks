/**
 * Space Mountain, Disneyland Park (Anaheim), Tomorrowland — procedural, CC0-1.0.
 * bun generators/dlr-space-mountain.ts
 *
 * Map frame: x east, y north, z up, metres. Origin at the centre of the
 * round base in OSM (way/122090695, least-squares circle centre
 * -117.9174999, 33.8109694), on the ground. Round, so placed at bearing 0.
 *
 * Anaheim's 1977 Space Mountain, smaller than Walt Disney World's and drawn
 * from Anaheim photos only: a round base drum with a white fascia ring; a
 * white cone ribbed by 30 broad concrete beams that run from the fascia to
 * a flared collar lip; above the collar, a steeper ribbed band under a
 * broad second lip, then a low saucer tier; six pairs of spires, each pair
 * two adjacent ribs carried on up past the collar as tapering blades; and
 * a tripod mast with a central antenna, standing off-centre on the top.
 *
 * Evidence:
 *  - OSM, measured: five concentric building:parts, circle-fitted —
 *    way/122090695 (the base, r 33.0 m, tagged h 11.5, attraction=
 *    roller_coaster, building:colour white), way/122090687 (r 12.7 m, h 23,
 *    the collar), way/122090694 (r 8.7 m, h 24.5), way/122090693 (r 6.1 m,
 *    h 25.4), way/262351999 (r 5.2 m, h 26). Their centres agree to 1.3 m.
 *    They sit inside the large Tomorrowland outline way/372931495 (h 10),
 *    which this model does not cover and does not replace.
 *    OSM has no roller_coaster=track ways for this ride (checked against
 *    the API map call and Overpass on 2026-10-07): the track is wholly
 *    indoors and unmapped, so `replaces` lists only the five parts.
 *  - Published: 118 ft (36 m) tall, about 200 ft (61 m) across (secondary
 *    sources, as quoted in the brief); Wikipedia gives the ride's 76 ft
 *    lift height and 1977 opening, and RCDB #201 lists it.
 *  - Photos (licensed): Contributor19, "Space Mountain, Disneyland.jpg"
 *    (CC BY 4.0) — telephoto daylight elevation, the tiers, spire pairs and
 *    tripod mast; deror_avi, "Disneyland Tomorrowland IMG 3983.jpg"
 *    (CC BY-SA 3.0) and SolarSurfer, "Space Mountain Top Platform.JPG"
 *    (public domain) — from the entrance plaza on the north side: rib
 *    count and width, the fascia and the recessed band under it; Lyght,
 *    "Disneyland Aug22 025.jpg" (CC BY-SA 3.0) and HarshLight, "Space
 *    Mountain (28099690590).jpg" (CC BY 2.0, from the monorail station) —
 *    other sides, the spire groups; Jon Sullivan, "Disneyland (1).jpg"
 *    (public domain) — elevated view from the north-west (2000s bronze
 *    paint scheme, now white again).
 *  - Look-only: "Disneyland Anaheim.jpg" on Commons (CC BY-SA 2.0, no
 *    author recorded, a 2004 aerial) for the plan: collar ring about 0.37
 *    of the base diameter, white top.
 *
 * Measured from photos (estimated): the cone's slope, about 33 degrees,
 * from the silhouette in Contributor19's telephoto shot, which with the
 * fascia top at 5.8 m (estimated from the north photos) puts the collar
 * lip at 18 to 20 m. The second lip (23.2 to 24 m, r 11.8) and saucer
 * (24.6 to 25.6 m, r 8.4) come from the photos' width ratios, and agree
 * with OSM's inner parts (23, 24.5, 25.4, 26 m). OSM's 23 m on the r 12.7
 * part is read as the top of the band above the collar, not the collar
 * itself. 30 ribs, from rib spacing at the front of two photos (counts of
 * 26 to 34). Spire tips at 27 m (6.5 to 9 m above the collar by different
 * photos). The mast's legs to 33.8 m and antenna to 36.5 m, matching the
 * published 118 ft. OSM's 11.5 m on the base ring fits nothing in the
 * photos and is ignored.
 *
 * Doubts: the spire layout is read as six pairs, 60 degrees apart, from
 * the groups visible in four photos (two face-on, two or three edge-on);
 * the real arrangement may differ, and their angular phase is estimated
 * from the north photo only. Every photo shows the mast about 4.4 m left
 * of centre, but all are taken from the Tomorrowland side (north to west),
 * so its direction (here 4 m towards bearing 70) is estimated. Contributor19
 * also shows the saucer set a little off-centre; it is kept concentric, as
 * OSM draws it. The entrance wings and queue building belong to
 * way/372931495 and are left to it, as is the east-side service stair.
 * The cone's foot and fascia height have no direct measurement.
 */
import { Part, len, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

type XY = [number, number]
const TAU = Math.PI * 2
const DEG = Math.PI / 180

const shell = new Part()  // cone panels and the base wall
const white = new Part()  // ribs, fascia, lips, spires, mast
const shade = new Part()  // the recessed band under the fascia

// ---------------------------------------------------------------------------
// Kit (after wdw-space-mountain.ts)

const unit = (a: V3): V3 => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
function tri(p: Part, a: V3, b: V3, c: V3, n?: V3[]) { p.tri(a, b, c, undefined, undefined, undefined, n) }
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n?: [V3, V3, V3, V3]) {
  tri(p, a, b, c, n && [n[0], n[1], n[2]])
  tri(p, a, c, d, n && [n[0], n[2], n[3]])
}

/** A frustum about the vertical axis, r0 at z0 to r1 at z1; flat or smooth. */
function frustum(p: Part, r0: number, z0: number, r1: number, z1: number, n: number,
  o: { top?: boolean; bottom?: boolean; phase?: number; flat?: boolean; cx?: number; cy?: number } = {}) {
  const cx = o.cx ?? 0, cy = o.cy ?? 0
  const ph = (o.phase ?? 0) * TAU
  const k = (r0 - r1) / (z1 - z0 || 1e-9)
  const at = (i: number, r: number, z: number): V3 => {
    const t = ph + (i / n) * TAU
    return [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
  }
  const nrm = (t: number): V3 => (z1 === z0 ? [0, 0, r1 < r0 ? 1 : -1] : unit([Math.cos(t), Math.sin(t), k]))
  for (let i = 0; i < n; i++) {
    const j = i + 1
    const ti = ph + (i / n) * TAU, tj = ph + (j / n) * TAU
    const ni = o.flat ? nrm((ti + tj) / 2) : nrm(ti), nj = o.flat ? ni : nrm(tj)
    if (r1 <= 0) tri(p, at(i, r0, z0), at(j, r0, z0), [cx, cy, z1], [ni, nj, nrm((ti + tj) / 2)])
    else quad(p, at(i, r0, z0), at(j, r0, z0), at(j, r1, z1), at(i, r1, z1), [ni, nj, nj, ni])
  }
  if (o.top && r1 > 0) for (let i = 1; i < n - 1; i++) tri(p, at(0, r1, z1), at(i, r1, z1), at(i + 1, r1, z1))
  if (o.bottom) for (let i = 1; i < n - 1; i++) tri(p, at(0, r0, z0), at(i + 1, r0, z0), at(i, r0, z0))
}

const area = (q: XY[]) => q.reduce((s, a, i) => { const b = q[(i + 1) % q.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2

/** Ear-clipping triangulation of a simple counter-clockwise polygon. */
function earcut(poly: XY[]): [number, number, number][] {
  const idx = poly.map((_, i) => i), out: [number, number, number][] = []
  const crossz = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => crossz(a, b, p) > 1e-9 && crossz(b, c, p) > 1e-9 && crossz(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = poly[i0], b = poly[i1], c = poly[i2]
      if (crossz(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(poly[j], a, b, c))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/**
 * A blade in the radial plane at angle t: a profile in (r, z), each point
 * carrying its own half-width across the radius, so a rib can stay broad
 * while a spire tapers to a point. Profile counter-clockwise seen from +t.
 */
function blade(p: Part, prof: [number, number, number][], t: number) {
  const pr: XY[] = prof.map(([r, z]) => [r, z])
  if (area(pr) < 0) { prof = [...prof].reverse() }
  const c = Math.cos(t), s = Math.sin(t)
  const at = ([r, z, h]: [number, number, number], side: number): V3 => [r * c - side * h * s, r * s + side * h * c, z]
  for (let i = 0; i < prof.length; i++) {
    const a = prof[i], b = prof[(i + 1) % prof.length]
    quad(p, at(a, 1), at(b, 1), at(b, -1), at(a, -1))
  }
  for (const [i, j, k] of earcut(prof.map(([r, z]) => [r, z] as XY))) {
    tri(p, at(prof[i], 1), at(prof[k], 1), at(prof[j], 1))
    tri(p, at(prof[i], -1), at(prof[j], -1), at(prof[k], -1))
  }
}

/** A tapered square post from a to b, w0 wide at a and w1 at b. */
function post(p: Part, a: V3, b: V3, w0: number, w1: number) {
  const d = unit([b[0] - a[0], b[1] - a[1], b[2] - a[2]])
  const u = unit(Math.abs(d[2]) > 0.9 ? [1, 0, 0] : [-d[1], d[0], 0])
  const v: V3 = [d[1] * u[2] - d[2] * u[1], d[2] * u[0] - d[0] * u[2], d[0] * u[1] - d[1] * u[0]]
  const ring = (c: V3, w: number) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([i, j]) =>
    [c[0] + (u[0] * i + v[0] * j) * w / 2, c[1] + (u[1] * i + v[1] * j) * w / 2, c[2] + (u[2] * i + v[2] * j) * w / 2] as V3)
  const r0 = ring(a, w0), r1 = ring(b, w1)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    quad(p, r0[i], r0[j], r1[j], r1[i])
  }
  tri(p, r1[0], r1[1], r1[2]); tri(p, r1[0], r1[2], r1[3])
  tri(p, r0[0], r0[2], r0[1]); tri(p, r0[0], r0[3], r0[2])
}

// ---------------------------------------------------------------------------
// Dimensions

const N_RIB = 30
const R_DRUM = 33.6                 // way/122090695, r 33.0 ± 0.7, covered
const Z_SOFFIT = 3.4, Z_FASCIA = 4.6, Z_EAVE = 5.8
const R_EAVE = 31.6                 // the cone's foot, inside the fascia
const R_COLLAR = 12.9, Z_COLLAR = 18.0  // cone meets the collar lip
const coneZ = (r: number) => Z_EAVE + (R_EAVE - r) * (Z_COLLAR - Z_EAVE) / (R_EAVE - R_COLLAR)
const Z_LIP = 20.0                  // top of the collar lip (OSM's way/122090687 says 23)
// Above the collar a second, steeper ribbed band rises 3.2 m to a broad
// second lip, then a low wall and a saucer lip: OSM's 23, 24.5, 25.4 and
// 26 m inner parts fit these levels.
const R_B0 = 12.0, R_B1 = 10.0, R_LIP2 = 11.8, Z_LIP2a = 23.2, Z_LIP2b = 24.0
const R_TOPW = 7.2, R_TOP = 8.4, Z_TOPa = 24.6, Z_TOPb = 25.6

// The drum: base wall, the dark recessed band under the fascia, the fascia
// ring, and its top ledge in to the cone's foot.
frustum(shell, R_DRUM - 1.0, 0, R_DRUM - 1.0, Z_SOFFIT, 60, { flat: true })
frustum(shade, R_DRUM - 1.4, Z_SOFFIT, R_DRUM - 1.4, Z_FASCIA, 60, { flat: true })
frustum(shell, R_DRUM - 1.0, Z_SOFFIT, R_DRUM - 1.4, Z_SOFFIT, 60)       // ledge into the recess
frustum(white, R_DRUM - 1.4, Z_FASCIA, R_DRUM, Z_FASCIA, 60)              // fascia underside
frustum(white, R_DRUM, Z_FASCIA, R_DRUM, Z_EAVE, 60, { flat: true })
frustum(white, R_DRUM, Z_EAVE, R_EAVE, Z_EAVE, 60)

// The cone: flat panels between the ribs, which stand on the panel joints.
frustum(shell, R_EAVE, Z_EAVE, R_COLLAR, Z_COLLAR, N_RIB, { flat: true })
const ribAngle = (k: number) => (k / N_RIB) * TAU
{
  // Broad beams, about 2.2 m wide at the foot narrowing to 1.3 m at the
  // collar, standing 1.6 m proud, as the photos show them.
  const D = 1.6, W0 = 1.1, W1 = 0.65
  const prof: [number, number, number][] = [
    [R_EAVE - 0.3, Z_EAVE, W0],
    [R_EAVE + 1.2, Z_EAVE, W0],          // the foot, out on the fascia ledge
    [R_EAVE + 1.2, Z_EAVE + 0.8, W0],
    [R_EAVE, coneZ(R_EAVE) + D, W0],
    [R_COLLAR + 0.4, coneZ(R_COLLAR + 0.4) + D, W1],
    [R_COLLAR, Z_COLLAR, W1],
  ]
  for (let k = 0; k < N_RIB; k++) blade(white, prof, ribAngle(k))
}

// The collar lip: a flared ring standing out past the cone.
frustum(white, R_COLLAR - 0.1, Z_COLLAR, 13.9, Z_COLLAR, 48)                 // underside
frustum(white, 13.9, Z_COLLAR, 14.3, Z_LIP, 48, { flat: true })              // outer face
frustum(white, 14.3, Z_LIP, R_B0, Z_LIP, 48)                                 // top

// The finned band and the second lip.
frustum(shell, R_B0, Z_LIP, R_B1, Z_LIP2a, 30, { flat: true })
for (let k = 0; k < N_RIB; k++) {
  blade(white, [[R_B0 - 0.1, Z_LIP, 0.4], [R_B0 + 0.8, Z_LIP, 0.4], [R_LIP2 - 0.3, Z_LIP2a, 0.3], [R_B1 - 0.1, Z_LIP2a, 0.3]], ribAngle(k))
}
frustum(white, R_B1, Z_LIP2a, R_LIP2, Z_LIP2a, 36)
frustum(white, R_LIP2, Z_LIP2a, R_LIP2, Z_LIP2b, 36, { flat: true })
frustum(white, R_LIP2, Z_LIP2b, R_TOPW, Z_LIP2b, 36)

// The top tier: a short wall and a thin saucer lip with a flat top.
frustum(shell, R_TOPW, Z_LIP2b, R_TOPW, Z_TOPa, 24, { flat: true })
frustum(white, R_TOPW, Z_TOPa, R_TOP, Z_TOPa, 24)
frustum(white, R_TOP, Z_TOPa, R_TOP, Z_TOPb, 24, { flat: true, top: true })

// Spires: six pairs, 60 degrees apart, each pair two adjacent ribs carried
// on up past the collar as tapering blades. Phase estimated: the north
// photo shows a pair face-on, about 20 degrees east of north.
const SPIRE_TIP = 27.0
const PHASE_BEARING = 20
for (let c = 0; c < 6; c++) {
  const bearing = PHASE_BEARING + c * 60
  const t0 = (90 - bearing) * DEG
  // the two ribs nearest the cluster's bearing
  const k0 = Math.round(t0 / TAU * N_RIB - 0.5)
  for (const k of [k0, k0 + 1]) {
    const t = ribAngle(k)
    blade(white, [
      [R_COLLAR - 0.2, Z_COLLAR - 0.2, 0.68],
      [R_COLLAR + 1.4, coneZ(R_COLLAR + 1.4) + 1.6, 0.68],
      [14.8, Z_LIP - 0.4, 0.62],
      [14.5, Z_LIP + 1.6, 0.5],
      [13.9, SPIRE_TIP, 0.06],
      [13.0, Z_LIP + 3.0, 0.42],
      [12.5, Z_LIP, 0.55],
    ], t)
  }
}

// The tripod mast and its antenna.
// Every licensed photo, all taken from the Tomorrowland (north and west)
// side, shows the mast about 4.4 m left of the collar's centre, so it stands
// off-centre towards the east-north-east.
{
  const mb = 70 * DEG, mx = 4.0 * Math.sin(mb), my = 4.0 * Math.cos(mb)
  const z0 = Z_TOPb, zTop = 33.8
  for (let k = 0; k < 3; k++) {
    const t = (k / 3) * TAU + (90 - PHASE_BEARING) * DEG
    const foot: V3 = [mx + 1.8 * Math.cos(t), my + 1.8 * Math.sin(t), z0]
    const head: V3 = [mx + 0.35 * Math.cos(t), my + 0.35 * Math.sin(t), zTop]
    post(white, foot, head, 0.8, 0.3)
  }
  // two cross-bar rings, as the photos show
  for (const z of [28.6, 31.0]) {
    const f = (z - z0) / (zTop - z0), r = 1.8 + (0.35 - 1.8) * f
    for (let k = 0; k < 3; k++) {
      const t = (k / 3) * TAU + (90 - PHASE_BEARING) * DEG, u = t + TAU / 3
      post(white, [mx + r * Math.cos(t), my + r * Math.sin(t), z], [mx + r * Math.cos(u), my + r * Math.sin(u), z], 0.3, 0.3)
    }
  }
  frustum(white, 0.3, z0, 0.12, 36.5, 6, { flat: true, top: true, cx: mx, cy: my })
}

// ---------------------------------------------------------------------------

// White concrete. The panels a touch greyer than the ribs and lips so the
// ribbing reads in flat map light; the recessed bands a soft grey.
const parts = [
  { part: shell, material: finish('space-shell', 0xdfe2e3) },
  { part: white, material: finish('space-white', 0xf8f8f4) },
  { part: shade, material: finish('space-recess', 0xa9b1b8) },
]
const triangles = parts.reduce((sum, { part }) => sum + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Space Mountain (Disneyland)', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 36.5,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/dlr-space-mountain.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
