/**
 * Tottenham Hotspur Stadium, Tottenham — original procedural geometry,
 * CC0-1.0.
 * bun generators/london-tottenham-hotspur-stadium.ts
 * writes models/london-tottenham-hotspur-stadium.glb.
 *
 * Model frame turned to BEARING 357.4 (the stadium's long axis, from the
 * principal axis of OSM's outline and opening): +y along the long axis
 * (north), +x across it (east), z up, metres. Origin = area centroid of the
 * outline way/538300255. y = 0 is the street round the stadium (8.1 m
 * above the lidar box's lowest cell, a ramp pit at the south-west corner).
 *
 * The form: a rounded-rectangle bowl, wider at the south end, whose roof
 * rises gently from a rolled silver eave to the opening, ribbed radially in
 * grey panels with a wide band of translucent blue-grey glass, barred
 * radially, round the opening. The facade is the
 * "pixel" cladding, mostly pale silver with sparse light grey tiles that thin
 * out toward the top, in an upper band whose
 * lower edge steps and sweeps up and down round the building: high over the
 * two great glazed corners of the south stand (dark teal glass walls with
 * pale mullions on tree-like columns, south-west and south-east), low along the east and west, with a
 * blue glass band under the eave on the north. Inside, the navy seats: the
 * huge single-tier south stand and two-tier stands on the other sides.
 * On the roof, the Skywalk climbs from the south-west eave to the arched
 * viewing platform at the south stand's inner edge, and on its crest the
 * golden cockerel stands on its ball. The pitch is the map's.
 *
 * Evidence
 * - OSM way/538300255 (leisure=stadium, wikidata Q55074091) and
 *   relation/7708006 (building=stadium, outer way/538300255, inner
 *   way/538304818: the roof opening, x -40..41, y -54..62 in this frame).
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0 (the stadium opened in 2019 and shows complete). Above the street:
 *   pitch 1.3 m (the bowl is not sunk); the roof's outer edge 43.1 m, rising
 *   to 44.4 (60% in), 45.6 (40%), 46.4 (20%) and 48.5 m at the opening; the
 *   eave reaches 1–2 m past OSM's outline at the south end. A cluster of
 *   returns 3–8 m above the roof at x -10..+20, y -55..-68: the platform and
 *   the cockerel at the south stand's inner edge.
 * - Published (Wikipedia, "Tottenham Hotspur Stadium"): 62,850 seats; the
 *   17,500-seat single-tier south stand, the largest in the UK; opened April
 *   2019, Populous; the Dare Skywalk over the roof, 46.8 m up; the 4.7 m
 *   golden cockerel on the roof.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "London Tottenham Hotspur Stadium.jpg", Arne Müseler, CC BY-SA 3.0 de —
 *     aerial: the roof, its glass band and radial panels, the Skywalk, the
 *     glazed corner on tree columns, the pixel cladding and its sweeping
 *     lower edge, the rolled eave;
 *   "Spurs cockerel on the roof at Tottenham Hotspur Stadium 2020.jpg", Hzh,
 *     CC BY-SA 4.0 — the cockerel on its ball over the platform's arch;
 *   "Tottenham Hotspur Stadium - view from High Road - June 2019.jpg", Hzh,
 *     CC BY-SA 4.0 — the west side: the cladding's diagonal sweep, the glass;
 *   "Tottenham Hotspur Stadium June 2019, view from East.jpg", Hzh,
 *     CC BY-SA 4.0 — the east side: the stepped cladding band, the glass
 *     corner, the blue glass band under the eave on the north-east;
 *   "Tottenham Hotspur Stadium.jpg", Stadium spotter, CC BY-SA 4.0 — the
 *     north-west: cladding over the glazed tree-column atrium;
 *   "Tottenham Hotspur Stadium Dec 2022 - DxO.jpg", Acabashi, CC BY-SA 4.0 —
 *     distant profile from the west: the flat roof line and the eave;
 *   "Tottenham Hotspur Stadium South Stand.jpg", Bluejam, CC BY-SA 4.0 —
 *     inside: the single-tier south stand, the glass roof band, the
 *     cockerel at the top.
 *
 * Measured (lidar): every height and the roof's profile. From OSM: the
 * outline and the opening. Published: the facts above. Estimated: the
 * cladding band's edges and the glass areas (from the photos, simplified
 * into bearing ranges; the tile pattern is a bold two-tone pixel pattern,
 * not traced); the seating tiers' heights; the Skywalk's route (from the
 * aerial and a ridge in the lidar: from the south-west eave to the
 * platform); the cockerel's pose and size (the bird drawn about 5.4 m tall on a
 * 2.3 m ball, a little over the published 4.7 m, so it reads), and the way it faces: east. The one photo here that shows it from a known
 * side, Bluejam's "South Stand" (taken from inside the bowl looking south),
 * shows it in profile with its head to the left, i.e. east; Hzh's close-up
 * has its head to the left too but its camera side is unknown. The lead's
 * note that it faces west is not borne out by these, so east is kept.
 * Elevation 0: the pitch is 1.3 m above the street. But the map's terrain
 * (Mapterhorn, `terrain.ts grid`/`check`) and the lidar DTM show the bowl's
 * interior 3-5 m below the street round it (a construction-era or
 * interpolated hole the finished pitch, 9.4 m in the DSM, does not have).
 * `terrain.ts check` passes, but the map puts y = 0 at that low point, so
 * the facade's lowest ~5 m sinks below the drawn street. Kept at 0 per the
 * rules (terrain wrong for the site); about +4.5 would set the base on the
 * street if the lead prefers.
 * Doubts: lidar flight year not stated; the pixel pattern and the facade's
 * sweeps are simplified; the cockerel's heading is a guess.
 */
import { writeFileSync } from 'node:fs'
import { Part, writeGlb, cross, sub, type V3, type MaterialSpec } from './mesh'
import { finish, PALETTE } from './palette'

const ID = 'london-tottenham-hotspur-stadium'

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scl = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const nrm = (a: V3): V3 => scl(a, 1 / (Math.hypot(a[0], a[1], a[2]) || 1))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const rad = (d: number) => (d * Math.PI) / 180
const UP: V3 = [0, 0, 1]

/** A quad wound so its normal points along `hint`. */
function oq(p: Part, a: V3, b: V3, c: V3, d: V3, hint: V3) {
  const n = cross(sub(b, a), sub(c, a)), n2 = cross(sub(c, a), sub(d, a))
  const s = (n[0] + n2[0]) * hint[0] + (n[1] + n2[1]) * hint[1] + (n[2] + n2[2]) * hint[2]
  if (s >= 0) p.quad(a, b, c, d)
  else p.quad(a, d, c, b)
}
function ot(p: Part, a: V3, b: V3, c: V3, hint: V3) {
  const n = cross(sub(b, a), sub(c, a))
  if (n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}
/** A round tube along a path, smooth-shaded. */
function tube(p: Part, path: V3[], r: number, sides: number) {
  const n = path.length
  const T = path.map((_, i) => nrm(sub(path[Math.min(i + 1, n - 1)], path[Math.max(i - 1, 0)])))
  const rings = path.map((c, i) => {
    const t = T[i]
    const side = nrm(Math.abs(t[2]) > 0.9 ? cross(t, [1, 0, 0]) : cross(t, [0, 0, 1]))
    const up = cross(side, t)
    return Array.from({ length: sides }, (_, k) => {
      const a = (2 * Math.PI * k) / sides
      const d = add(scl(side, Math.cos(a)), scl(up, Math.sin(a)))
      return { p: add(c, scl(d, r)), n: d }
    })
  })
  for (let i = 0; i < n - 1; i++)
    for (let k = 0; k < sides; k++) {
      const j = (k + 1) % sides, a = rings[i], b = rings[i + 1]
      p.tri(a[k].p, b[k].p, b[j].p, undefined, undefined, undefined, [a[k].n, b[k].n, b[j].n])
      p.tri(a[k].p, b[j].p, a[j].p, undefined, undefined, undefined, [a[k].n, b[j].n, a[j].n])
    }
}
/** A smooth ellipsoid: centre, three semi-axes along the given unit axes. */
function ellipsoid(p: Part, c: V3, ax: [V3, V3, V3], r: [number, number, number], seg = 10, rings = 6) {
  const pt = (i: number, j: number) => {
    const th = (2 * Math.PI * i) / seg, ph = -Math.PI / 2 + (Math.PI * j) / rings
    const u = Math.cos(ph) * Math.cos(th), v = Math.cos(ph) * Math.sin(th), w = Math.sin(ph)
    const pos = add(c, add(add(scl(ax[0], u * r[0]), scl(ax[1], v * r[1])), scl(ax[2], w * r[2])))
    const n = nrm(add(add(scl(ax[0], u / r[0]), scl(ax[1], v / r[1])), scl(ax[2], w / r[2])))
    return { pos, n }
  }
  for (let i = 0; i < seg; i++)
    for (let j = 0; j < rings; j++) {
      const a = pt(i, j), b = pt(i + 1, j), cc = pt(i + 1, j + 1), d = pt(i, j + 1)
      if (j > 0) p.tri(a.pos, b.pos, cc.pos, undefined, undefined, undefined, [a.n, b.n, cc.n])
      if (j < rings - 1) p.tri(a.pos, cc.pos, d.pos, undefined, undefined, undefined, [a.n, cc.n, d.n])
    }
}
/** A flat polygon (convex or star-shaped about its first point) extruded by t along n. */
function slab(p: Part, poly: V3[], n: V3, t: number) {
  const f = poly.map((q) => add(q, scl(n, t / 2))), b = poly.map((q) => add(q, scl(n, -t / 2)))
  for (let i = 1; i < poly.length - 1; i++) {
    ot(p, f[0], f[i], f[i + 1], n)
    ot(p, b[0], b[i], b[i + 1], scl(n, -1))
  }
  const cx = poly.reduce((s, q) => add(s, q), [0, 0, 0] as V3)
  const cen = scl(cx, 1 / poly.length)
  for (let i = 0; i < poly.length; i++) {
    const j = (i + 1) % poly.length
    const out = sub(add(poly[i], poly[j]), scl(cen, 2))
    oq(p, f[i], f[j], b[j], b[i], out)
  }
}

/**
 * Smooth a part's shading where faces meet at less than `deg`, and drop
 * the (unused) UVs, so corners that coincide merge into one vertex: curved
 * walls and roofs shade softly and the file stays small. Creases sharper
 * than `deg` stay hard.
 */
function smooth(p: Part, deg = 32) {
  const cos = Math.cos((deg * Math.PI) / 180)
  const groups = new Map<string, number[]>()
  const n = p.pos.length / 3
  for (let i = 0; i < n; i++) {
    const k = `${Math.round(p.pos[3 * i] * 100)},${Math.round(p.pos[3 * i + 1] * 100)},${Math.round(p.pos[3 * i + 2] * 100)}`
    const g = groups.get(k)
    if (g) g.push(i)
    else groups.set(k, [i])
  }
  const out = p.nrm.slice()
  for (const g of groups.values()) {
    for (const i of g) {
      let x = 0, y = 0, z = 0
      for (const j of g) {
        const d = p.nrm[3 * i] * p.nrm[3 * j] + p.nrm[3 * i + 1] * p.nrm[3 * j + 1] + p.nrm[3 * i + 2] * p.nrm[3 * j + 2]
        if (d >= cos) { x += p.nrm[3 * j]; y += p.nrm[3 * j + 1]; z += p.nrm[3 * j + 2] }
      }
      const l = Math.hypot(x, y, z) || 1
      out[3 * i] = Math.round((x / l) * 1e4) / 1e4; out[3 * i + 1] = Math.round((y / l) * 1e4) / 1e4; out[3 * i + 2] = Math.round((z / l) * 1e4) / 1e4
    }
  }
  p.nrm = out
  p.uv = p.uv.map(() => 0)
}

// ------------------------------------------------------------ plan
/** OSM outline way/538300255 in this frame. */
const OUTLINE: [number, number][] = [[-78.1,85.6],[-67.8,95.9],[-60.9,101.1],[-49.2,107.9],[-36.5,112.8],[-25.2,115.4],[-17.3,116.4],[-14.0,116.7],[-5.4,117.0],[1.9,116.8],[9.8,116.5],[20.1,116.0],[33.1,114.2],[43.8,110.7],[54.8,106.2],[67.1,97.5],[77.6,87.1],[84.8,76.9],[88.6,69.9],[91.5,63.4],[94.1,57.0],[97.2,46.7],[100.1,34.0],[100.9,25.0],[101.2,18.8],[101.6,11.5],[101.6,4.5],[100.9,-13.7],[99.4,-24.4],[97.4,-35.9],[93.2,-50.0],[91.0,-55.9],[87.8,-63.5],[80.8,-75.2],[74.4,-84.5],[67.9,-92.5],[63.1,-96.8],[55.9,-103.3],[45.1,-111.1],[29.0,-118.7],[20.2,-121.5],[10.5,-123.4],[2.5,-123.8],[-5.5,-123.6],[-14.2,-122.6],[-23.0,-120.6],[-34.9,-115.9],[-44.6,-110.4],[-54.1,-103.2],[-63.5,-93.9],[-72.1,-84.1],[-77.1,-77.8],[-80.0,-74.1],[-83.2,-68.1],[-85.7,-63.2],[-87.7,-59.0],[-93.3,-44.3],[-96.0,-36.9],[-98.3,-36.9],[-100.6,-36.9],[-104.1,-4.7],[-104.5,-1.3],[-105.2,6.3],[-105.3,12.1],[-104.4,16.5],[-103.1,20.7],[-101.7,24.1],[-99.9,28.1],[-98.2,39.2],[-96.4,47.9],[-94.3,55.3],[-92.9,58.7],[-88.6,68.6],[-83.6,77.6]]
const C: [number, number] = [0.65, 4]
const dir = (b: number): [number, number] => [Math.sin(rad(b)), Math.cos(rad(b))]
function rOutline(b: number) {
  const [ux, uy] = dir(b)
  let best = 0
  for (let i = 0; i < OUTLINE.length; i++) {
    const [x0, y0] = OUTLINE[i], [x1, y1] = OUTLINE[(i + 1) % OUTLINE.length]
    const ex = x1 - x0, ey = y1 - y0, wx = x0 - C[0], wy = y0 - C[1]
    const den = ux * ey - uy * ex
    if (Math.abs(den) < 1e-9) continue
    const t = (wx * ey - wy * ex) / den, s = (wx * uy - wy * ux) / den
    if (t > 0 && s >= 0 && s <= 1) best = Math.max(best, t)
  }
  return best
}
const superR = (b: number, a: number, bb: number, n: number) => {
  const [ux, uy] = dir(b)
  return 1 / Math.pow(Math.pow(Math.abs(ux) / a, n) + Math.pow(Math.abs(uy) / bb, n), 1 / n)
}
// The outline has a notch on the west (a service bay at y -37); smooth it.
const rFacade = (b: number) => Math.max(rOutline(b), 0.5 * (rOutline(b - 6) + rOutline(b + 6)) - 1.5)
const rOpen = (b: number) => superR(b, 40.5, 57.7, 5)
const rPitch = (b: number) => superR(b, 38.5, 57.5, 6)
const at = (b: number, r: number, z: number): V3 => {
  const [ux, uy] = dir(b)
  return [C[0] + ux * r, C[1] + uy * r, z]
}
const Z = { pitch: 1.3, eave: 43.1, inner: 48.5, top: 40.8 }
/** Roof height at fraction f from the opening (0) to the eave (1). */
const roofZ = (f: number) => Z.eave + (Z.inner - Z.eave) * Math.pow(1 - f, 1.4)
const roofR = (b: number, f: number) => lerp(rOpen(b), rFacade(b) - 0.4, f)

/** A bearing-keyed piecewise-linear table (degrees, value). */
const pw = (pts: [number, number][]) => (b: number) => {
  const x = ((b % 360) + 360) % 360
  for (let i = 0; i < pts.length - 1; i++) if (x <= pts[i + 1][0]) return lerp(pts[i][1], pts[i + 1][1], (x - pts[i][0]) / (pts[i + 1][0] - pts[i][0]))
  return pts[pts.length - 1][1]
}
/** Lower edge of the cladding band (glass below it). */
const clLow = pw([[0, 9], [30, 9], [50, 12], [68, 20], [82, 11], [96, 4], [112, 17], [125, 27], [150, 27], [165, 21], [195, 21], [210, 27], [235, 27], [248, 17], [264, 4], [278, 11], [292, 20], [310, 12], [330, 9], [360, 9]])
/** Upper edge of the cladding band (blue glass above it on the north). */
const clHigh = pw([[0, 33], [30, 33], [55, 40.8], [305, 40.8], [330, 33], [360, 33]])

const M = {
  silver: { ...finish('pixel-silver', 0xd3d6d8, 0.55), floodlight: (q: V3) => (q[2] > 8 && q[2] < 42 ? 0.3 : 0) } as MaterialSpec,
  grey: finish('seats-navy', 0x58657b, 0.85),
  glass: { ...PALETTE.window, color: 0x5f8a8f } as MaterialSpec,
  /** The roof's panels, and the light grey pixel tiles on the facade. */
  roof: { ...finish('roof-panels', 0xaab1b7, 0.7), doubleSided: true, floodlight: (q: V3, n: V3) => (Math.abs(n[2]) < 0.5 && q[2] > 8 && q[2] < 42 ? 0.3 : 0) } as MaterialSpec,
  band: { ...PALETTE.glass, color: 0x8fa6b8, opacity: 0.5, doubleSided: true } as MaterialSpec,
  gold: { ...finish('cockerel-gold', 0xd6b45c, 0.45), floodlight: () => 0.9 } as MaterialSpec,
}

function hash(i: number, j: number) {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453
  return s - Math.floor(s)
}

function build() {
  const silver = new Part(), grey = new Part(), glass = new Part(), roof = new Part(), band = new Part(), gold = new Part()
  const N = 72
  const B = (i: number) => (360 * i) / N

  // --- Facade: glass below the cladding band, the band in two-tone pixel
  // tiles (stepped to 3.5 m courses), glass above it on the north.
  const step = (z: number) => Math.round(z / 3.5) * 3.5
  for (let i = 0; i < N; i++) {
    const b0 = B(i), b1 = B(i + 1), bm = (b0 + b1) / 2
    const r0 = rFacade(b0), r1 = rFacade(b1)
    const out: V3 = [...dir(bm), 0] as V3
    const lo = Math.max(3.5, step(clLow(bm))), hi = clHigh(bm)
    // smooth (radial) normals, so the round wall shades softly and its vertices merge
    const n0: V3 = [...dir(b0), 0] as V3, n1: V3 = [...dir(b1), 0] as V3
    const W = (part: Part, z0: number, z1: number) => {
      const a = at(b0, r0, z0), b = at(b1, r1, z0), c = at(b1, r1, z1), d = at(b0, r0, z1)
      part.tri(a, b, c, undefined, undefined, undefined, [n0, n1, n1])
      part.tri(a, c, d, undefined, undefined, undefined, [n0, n1, n0])
    }
    // the glass under the band, set back 3.5 m under the band's soffit
    {
      const SB = 3.5, g0 = at(b0, r0 - SB, 0), g1 = at(b1, r1 - SB, 0)
      const h0 = at(b0, r0 - SB, lo), h1 = at(b1, r1 - SB, lo)
      glass.tri(g0, g1, h1, undefined, undefined, undefined, [n0, n1, n1])
      glass.tri(g0, h1, h0, undefined, undefined, undefined, [n0, n1, n0])
      oq(silver, h0, h1, at(b1, r1, lo), at(b0, r0, lo), [0, 0, -1])
      // a pale mullion line at every bay on the glass
      {
        const t: V3 = [...dir(b0 + 90), 0] as V3
        const m0 = add(at(b0, r0 - SB + 0.12, 0), scl(t, 0.3)), m1 = add(at(b0, r0 - SB + 0.12, lo), scl(t, 0.3))
        oq(silver, add(m0, scl(t, -0.6)), m0, m1, add(m1, scl(t, -0.6)), n0)
      }
      // where the band's lower edge steps, a cheek closes the step
      const loN = Math.max(3.5, step(clLow((b1 + B(i + 2)) / 2)))
      if (Math.abs(loN - lo) > 0.1) {
        const t: V3 = [...dir(b1 + 90), 0] as V3, sgn = loN > lo ? 1 : -1
        oq(silver, at(b1, r1 - SB, Math.min(lo, loN)), at(b1, r1, Math.min(lo, loN)), at(b1, r1, Math.max(lo, loN)), at(b1, r1 - SB, Math.max(lo, loN)), scl(t, sgn))
      }
    }
    // pixel tiles: mostly pale silver, with sparse light grey tiles (two
    // per bay, courses about 6.5 m) thinning out toward the top
    const courses = Math.max(1, Math.round((hi - lo) / 6.5))
    for (let h = 0; h < 2; h++) {
      const ba = lerp(b0, b1, h / 2), bb = lerp(b0, b1, (h + 1) / 2)
      const ra = rFacade(ba), rb = rFacade(bb)
      const na: V3 = [...dir(ba), 0] as V3, nb: V3 = [...dir(bb), 0] as V3
      for (let k = 0; k < courses; k++) {
        const z0 = lerp(lo, hi, k / courses), z1 = lerp(lo, hi, (k + 1) / courses)
        const col = 2 * i + h, dark = hash(col, k) < 0.4 * Math.pow(1 - k / courses, 1.2)
        const part = dark ? roof : silver
        const a = at(ba, ra, z0), b = at(bb, rb, z0), c = at(bb, rb, z1), d = at(ba, ra, z1)
        part.tri(a, b, c, undefined, undefined, undefined, [na, nb, nb])
        part.tri(a, c, d, undefined, undefined, undefined, [na, nb, na])
      }
    }
    if (hi < Z.top - 0.1) W(glass, hi, Z.top)
    // the rolled eave: a bold silver roll from the band's top, out and over
    // to the roof's edge
    const e0 = at(b0, r0 + 1.4, Z.top + 0.9), e1 = at(b1, r1 + 1.4, Z.top + 0.9)
    oq(silver, at(b0, r0, Z.top - 0.6), at(b1, r1, Z.top - 0.6), e1, e0, [out[0], out[1], -0.6])
    const c0 = at(b0, r0 + 1.3, Z.eave + 0.6), c1 = at(b1, r1 + 1.3, Z.eave + 0.6)
    oq(silver, e0, e1, c1, c0, [out[0], out[1], 0.2])
    const f0 = at(b0, roofR(b0, 1), roofZ(1) + 0.5), f1 = at(b1, roofR(b1, 1), roofZ(1) + 0.5)
    oq(silver, c0, c1, f1, f0, [out[0] * 0.3, out[1] * 0.3, 1])
  }
  // The tree columns of the two great glazed corners, just proud of the
  // set-back glass: a trunk and two branches up to the band's soffit.
  for (const [ba, bb] of [[118, 160], [200, 242]]) {
    for (let b = ba + 3; b <= bb - 3; b += 8) {
      const o: V3 = [...dir(b), 0] as V3
      const foot = at(b, rFacade(b) - 3.3, 0), fork = at(b, rFacade(b) - 3.3, 9)
      const strut = (p: V3, q: V3, w: number) => {
        const d = nrm(sub(q, p)), s: V3 = nrm(cross(d, o))
        oq(silver, add(p, scl(s, -w)), add(p, scl(s, w)), add(q, scl(s, w)), add(q, scl(s, -w)), o)
      }
      strut(foot, fork, 0.7)
      for (const db of [-3.2, 3.2]) strut(fork, at(b + db, rFacade(b + db) - 3.3, step(clLow(b + db)) - 0.2), 0.5)
    }
  }

  // --- Roof: radial grey panels ridged at every other column, the glass
  // band round the opening.
  const RF = [0, 0.26, 0.37, 0.58, 0.79, 1]
  const rp = (i: number, k: number): V3 => {
    const b = B(i), f = RF[k], ridge = i % 2 === 0 && k > 1 && k < RF.length - 1 ? 0.45 : 0
    return at(b, roofR(b, f), roofZ(f) + ridge)
  }
  for (let i = 0; i < N; i++)
    for (let k = 0; k < RF.length - 1; k++) oq(k < 1 ? band : roof, rp(i, k), rp(i + 1, k), rp(i + 1, k + 1), rp(i, k + 1), UP)
  // glass band's outer frame and the opening's lip
  for (let i = 0; i < N; i++) {
    const b0 = B(i), b1 = B(i + 1), o: V3 = [...dir((b0 + b1) / 2), 0] as V3
    const a0 = rp(i, 0), a1 = rp(i + 1, 0)
    oq(roof, a0, a1, add(a1, [0, 0, -2.5]), add(a0, [0, 0, -2.5]), [-o[0], -o[1], 0])
    const s0 = rp(i, 1), s1 = rp(i + 1, 1)
    oq(silver, add(s0, [0, 0, 0.6]), add(s1, [0, 0, 0.6]), add(s1, [0, 0, -0.2]), add(s0, [0, 0, -0.2]), [-o[0], -o[1], 0.3])
    oq(silver, add(s0, [0, 0, 0.6]), add(s1, [0, 0, 0.6]), add(rp(i + 1, 2), [0, 0, 0.15]), add(rp(i, 2), [0, 0, 0.15]), UP)
  }

  // Radial glazing bars across the glass band.
  for (let i = 0; i < N; i += 3) tube(silver, [add(rp(i, 0), [0, 0, 0.25]), add(rp(i, 1), [0, 0, 0.25])], 0.28, 3)

  // Radial ribs over the roof panels, from the glass band's frame to the eave.
  for (let i = 0; i < N; i += 2) {
    const b = B(i)
    tube(silver, [0.34, 0.6, 0.82, 1].map((f) => at(b, roofR(b, f) + (f === 1 ? 0.6 : 0), roofZ(f) + 0.3 + (f === 1 ? 0.4 : 0))), 0.32, 3)
  }

  // --- Seats: navy (drawn in the mid grey of the cladding, which is close).
  for (let i = 0; i < N; i++) {
    const b0 = B(i), b1 = B(i + 1), bm = (b0 + b1) / 2
    const [ux, uy] = dir(bm)
    const south = Math.cos(rad(bm)) < -0.62
    const tiers: [number, number, 'seat' | 'face'][] = south
      ? [[0, Z.pitch, 'face'], [0, Z.pitch + 1.8, 'seat'], [0.96, 0, 'face']]
      : [[0, Z.pitch, 'face'], [0, Z.pitch + 1.8, 'seat'], [0.42, 15, 'face'], [0.44, 21, 'seat'], [0.96, 0, 'face']]
    const pt = (b: number, f: number, z: number) => {
      const r = lerp(rPitch(b), rFacade(b) - 2, f)
      return at(b, r, z === 0 ? roofZ(Math.min(1, Math.max(0, (r - rOpen(b)) / (rFacade(b) - 0.4 - rOpen(b))))) - 2.2 : z)
    }
    for (let k = 0; k < tiers.length - 1; k++) {
      const [f0, z0, kind] = tiers[k], [f1, z1] = tiers[k + 1]
      oq(kind === 'seat' ? grey : roof, pt(b1, f0, z0), pt(b0, f0, z0), pt(b0, f1, z1), pt(b1, f1, z1), kind === 'seat' ? [-ux, -uy, 2] : [-ux, -uy, 0.3])
    }
    // back wall up to the roof's underside
    const t0 = pt(b0, 0.96, 0), t1 = pt(b1, 0.96, 0)
    oq(roof, t1, t0, add(t0, [0, 0, 2.6]), add(t1, [0, 0, 2.6]), [-ux, -uy, 0])
  }

  // --- The Skywalk: a raised walkway from the south-west eave up to the
  // platform, then the platform's arch along the south stand's inner edge.
  const roofPt = (x: number, y: number): V3 => {
    const b = (Math.atan2(x - C[0], y - C[1]) * 180) / Math.PI, r = Math.hypot(x - C[0], y - C[1])
    const f = Math.min(1, Math.max(0, (r - rOpen(b)) / (rFacade(b) - 0.4 - rOpen(b))))
    return [x, y, roofZ(f)]
  }
  const walkway = (pts: [number, number][], lift: (t: number) => number, w: number, h: number) => {
    const P = pts.map(([x, y], i) => add(roofPt(x, y), [0, 0, lift(i / (pts.length - 1))]))
    for (let i = 0; i < P.length - 1; i++) {
      const d = nrm(sub(P[i + 1], P[i])), s: V3 = nrm([d[1], -d[0], 0])
      const q = (p: V3, sd: number, up: number) => add(add(p, scl(s, sd * w)), [0, 0, up])
      oq(silver, q(P[i], -1, h), q(P[i], 1, h), q(P[i + 1], 1, h), q(P[i + 1], -1, h), UP)
      oq(silver, q(P[i], 1, -0.6), q(P[i + 1], 1, -0.6), q(P[i + 1], 1, h), q(P[i], 1, h), s)
      oq(silver, q(P[i], -1, -0.6), q(P[i + 1], -1, -0.6), q(P[i + 1], -1, h), q(P[i], -1, h), scl(s, -1))
    }
  }
  const sw = at(228, rFacade(228) - 1, 0)
  const path: [number, number][] = []
  for (let i = 0; i <= 8; i++) path.push([lerp(sw[0], -16, i / 8), lerp(sw[1], -60, i / 8)])
  walkway(path, () => 0.8, 1.3, 1.8)
  // the platform: an arch along the inner edge, crest 3.4 m above the roof
  const arch: [number, number][] = []
  for (let i = 0; i <= 8; i++) arch.push([lerp(-16, 12, i / 8), -60.5])
  walkway(arch, (t) => 0.8 + 2.6 * Math.sin(Math.PI * t), 2.2, 2.4)

  // --- The cockerel on its ball, on a short post at the arch's crest.
  {
    const crest = add(roofPt(-2, -60.5), [0, 0, 0.8 + 2.6 + 2.4])
    tube(gold, [add(crest, [0, 0, -1.6]), crest], 0.25, 6)
    const ball = add(crest, [0, 0, 0.6]) // seated in the platform arch, as in the photo
    const X: V3 = [1, 0, 0], Y: V3 = [0, 1, 0], Zv: V3 = [0, 0, 1]
    ellipsoid(gold, ball, [X, Y, Zv], [1.15, 1.15, 1.15], 12, 7)
    // The bird faces +x (east). Body tilted breast-up.
    const tilt = (a: number): [V3, V3, V3] => {
      const c = Math.cos(rad(a)), s = Math.sin(rad(a))
      return [[c, 0, s], Y, [-s, 0, c]]
    }
    const o = add(ball, [0, 0, 0.75])
    const P = (x: number, y: number, z: number): V3 => add(o, [x, y, z])
    // legs
    for (const y of [-0.3, 0.3]) tube(gold, [P(0.05, y, -0.1), P(0.25, y, 0.9), P(0.05, y * 1.1, 1.75)], 0.16, 5)
    ellipsoid(gold, P(-0.1, 0, 2.35), tilt(28), [1.35, 0.72, 0.78], 12, 7) // body
    ellipsoid(gold, P(0.8, 0, 3.35), tilt(72), [0.95, 0.42, 0.4], 10, 6) // breast and neck
    ellipsoid(gold, P(1.12, 0, 4.25), [X, Y, Zv], [0.48, 0.36, 0.4], 10, 6) // head
    // beak
    tube(gold, [P(1.52, 0, 4.2), P(2.0, 0, 4.04)], 0.14, 4)
    // wings: sleek feathered slabs along the body's sides
    for (const sy of [-1, 1]) {
      const y = 0.66 * sy
      slab(gold, [P(0.65, y, 2.85), P(-0.3, y, 2.95), P(-1.35, y, 2.35), P(-1.45, y, 1.95), P(-0.6, y, 1.85), P(0.35, y, 2.2)], [0, sy, 0], 0.2)
    }
    // the tail: an upright fan of five feathers, back and up
    const base = P(-1.1, 0, 2.35)
    const fan: V3[] = [base]
    for (let k = 0; k <= 10; k++) {
      const a = rad(lerp(32, 88, k / 10)), r = k % 2 === 0 ? 2.35 : 1.95
      fan.push(add(base, [-Math.cos(a) * r, 0, Math.sin(a) * r]))
    }
    slab(gold, fan, Y, 0.38)
  }

  for (const q of [silver, grey, glass, roof, band, gold]) smooth(q)
  return [
    { part: silver, material: M.silver },
    { part: grey, material: M.grey },
    { part: glass, material: M.glass },
    { part: roof, material: M.roof },
    { part: band, material: M.band },
    { part: gold, material: M.gold },
  ]
}

if (import.meta.main) {
  const extras = { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor' }
  const parts = build()
  const tris = parts.reduce((s, { part }) => s + part.triangles, 0)
  const glb = writeGlb('Tottenham Hotspur Stadium', parts, extras)
  writeFileSync(new URL(`../models/${ID}.glb`, import.meta.url), glb)
  console.log(`models/${ID}.glb: ${tris} triangles, ${glb.length} bytes`)
}
