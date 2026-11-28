/**
 * Istanbul Airport (IST) air traffic control tower, "Lale Kule" (the tulip
 * tower; Pininfarina with AECOM, opened 2018) and the oval operations
 * building at its foot: procedural, CC0-1.0, no textures.
 *
 *   bun generators/istanbul-airport-control-tower.ts
 *
 * Writes models/istanbul-airport-control-tower.glb (low) and a .detail.glb
 * (rounder sections, finer bands, three podium joints, the antenna masts).
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Anchor: the area
 * centroid of the podium, OSM way/572703382 (lng 28.7175436, lat
 * 41.2840568). The tower (way/572703385) stands 7.2 m east of it.
 *
 * What makes it this tower (photos)
 * - A slender white stem that flares like a tulip under the cab: about 14 m
 *   across from the podium to a little under half way up, then opening out
 *   to a lens-shaped head about 26 m long (north-south) and 15 m wide.
 * - The "leaf": grey, ribbed bands layered on the stem that wind round it
 *   as they climb. Seen from the east they rise from the front (south-east)
 *   at the foot to the left (south) edge under the lip; seen from the west
 *   they rise from the front (south-west) to the right (south) edge. Drawn
 *   as two families of two bands each, one wound from the south-east and
 *   one from the south-west, each band turning 55-70 degrees up the height
 *   and bowing out at mid-height, all meeting under the lip on the south.
 *   The stem's lens-shaped section also turns 70 degrees on the way up.
 * - Two glazed cab tiers, each under a white slab, and the roof disc with
 *   its ring of antennas (drawn as a low solid ring).
 * - The oval, grey-panelled operations building around its foot, 85 x 35 m,
 *   with a rounded upper edge and dark horizontal joints.
 *
 * Evidence
 * - OSM: way/572703385 (Hava trafik kontrol kulesi, man_made=tower,
 *   tower:type=air_traffic_control, height 90; a lens 12 x 23 m, long axis
 *   north-south, taken here as the head's outline in plan), way/572703382
 *   (the podium, building=yes, no height).
 * - Published: 90 m and 17 floors (IGA press release "Istanbul New Airport
 *   ATC tower breaks ground", igairport.aero; Aviation Week); CTBUH gives
 *   96 m (probably to the antennas). Tulip-inspired design by Pininfarina
 *   and AECOM (IGA; Wikipedia "Istanbul Airport").
 * - Photos (Wikimedia Commons, all evidence):
 *   https://commons.wikimedia.org/wiki/File:Istanbul_airport_tower.jpg
 *     (Arne Müseler, CC BY-SA 3.0 de, 2021) from about the east: every
 *     height and width below was scaled from it (90 m to the roof disc);
 *   https://commons.wikimedia.org/wiki/File:Istanbul_Airport_%22Lalekule%22.jpg
 *     (TurkAviator, CC BY-SA 4.0, 2019) from about the west: the leaf on
 *     the south side, the podium's joints;
 *   https://commons.wikimedia.org/wiki/File:Tower_of_Istanbul_Airport.jpg
 *     (BSRF, CC BY-SA 4.0) from the landside: the flare and the lip;
 *   https://commons.wikimedia.org/wiki/File:Istanbul_new_airport_under_construction,_April_13,_2018.jpg
 *     (Mark Lowen, CC BY-SA 4.0, 2018) the round concrete core, the leaf's
 *     steel frame standing off it, the oval cab, the podium's grey panels.
 * - No lidar (Turkey). Terrain: Mapterhorn here is z12 only and older than
 *   the airport's earthworks; see Doubts.
 *
 * Numbers (scaled from Müseler's photo at 90 m to the roof, 0.071 m/px):
 * podium 12 m high; seen from the east the shaft (leaf included) is 14 m
 * across just above the podium (half the lip's width), 16 m at mid-height,
 * 20 m at two-thirds, 24 m at five-sixths, and flares to the 28 m lip; the
 * shaft is 66 m tall, 2.35 times the lip's width; head lip 76.4-78 m; lower cab glass 78-81.6 m under a
 * slab 81.6-82.6 m; upper glass 83.8-87.2 m; roof disc 87.2-90 m, 22.8 m
 * across. Estimated: the stem's east-west width (no photo looks along the
 * long axis; taken from OSM's lens ratio), the turn of the stem (35°), the
 * leaf's layering (two families of two bands), the cab tiers' plan
 * (ellipses 22 x 15 m, following the OSM lens but rounder).
 *
 * Colours: stem white, leaf a light blue-grey, podium pale grey with
 * darker joints, cab glass grey-blue; from the photos, pulled to the
 * palette's lightness. Night: the cab glass is `window` and glows; the stem
 * and leaf carry `_FLOODLIGHT` (the tower is floodlit white after dark); the
 * podium's joints are their own unlit grey.
 *
 * Location: the batch list gave about 41.2560, 28.7430 (the rail station by
 * the terminal); OSM's tower, and Müseler's geotag (41.2839, 28.7171), put
 * it 3.4 km north-west, between the runways. The smaller round tower east of
 * the terminal (way/596215849) is an apron tower, not this one.
 *
 * Doubts
 * - Every photo found looks at the tower roughly along the podium's long
 *   axis (from about east or west); the north and south faces are drawn
 *   from the construction photo and the plan only.
 * - Mapterhorn has only z12 here, from before the airport was built: the
 *   old hills and pits under the site do not match the flat airfield.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, capPoly, quadN, unit } from './nyc-570-lexington'
import { writeLod } from './tokyo-haneda-terminal-1'

const ID = 'istanbul-airport-control-tower'

const MAT = {
  white: { ...finish('ist-tower-white', 0xeef0ef), floodlight: (_p: V3, n: V3) => (Math.abs(n[2]) < 0.6 ? 0.7 : 0.15) } as MaterialSpec,
  leaf: { ...finish('ist-tower-leaf', 0xb7bfc6), floodlight: (_p: V3, n: V3) => (Math.abs(n[2]) < 0.6 ? 0.6 : 0.1) } as MaterialSpec,
  window: { name: 'window', color: 0x627480, roughness: 0.35 } as MaterialSpec,
  podium: finish('ist-tower-podium', 0xc4c9cc),
  joint: finish('ist-tower-joint', 0x7f878e),
  roof: PALETTE.roof as MaterialSpec,
}

const TX = 7.2, TY = 0 // the tower's axis
const PODIUM: XY[] = [[-42.9, -0.31], [-42.61, 1.76], [-41.36, 4.28], [-37.77, 8.12], [-29.92, 12.47], [-17.74, 15.83], [-5.81, 17.51], [6.14, 17.34], [17.82, 16.4], [27.28, 14.02], [35.13, 10.3], [40.35, 6.08], [42.03, 2.93], [42.46, 0.52], [41.95, -2.32], [40.33, -5.49], [35.17, -9.78], [27.37, -13.63], [17.94, -16.14], [6.28, -17.25], [-5.67, -17.59], [-17.62, -16.09], [-29.85, -12.9], [-37.75, -8.67], [-41.4, -4.89], [-42.69, -2.38]]

const smooth = (t: number) => t * t * (3 - 2 * t)
/** Piecewise-linear lookup over [z, value] pairs. */
function lut(tab: [number, number][], z: number) {
  if (z <= tab[0][0]) return tab[0][1]
  for (let i = 1; i < tab.length; i++) if (z <= tab[i][0]) {
    const [z0, v0] = tab[i - 1], [z1, v1] = tab[i]
    return v0 + (v1 - v0) * smooth((z - z0) / (z1 - z0))
  }
  return tab[tab.length - 1][1]
}

// Stem: semi-axes along its own long axis (A) and across it (B), its turn.
const Z0 = 12, ZH = 76.4
const A_TAB: [number, number][] = [[12, 6.0], [30, 5.9], [45, 6.1], [55, 7.0], [63, 8.6], [70, 10.7], [74, 12.1], [76.4, 13.0]]
const B_TAB: [number, number][] = [[12, 5.4], [45, 5.3], [58, 5.8], [68, 6.6], [76.4, 7.5]]
const TURN: [number, number][] = [[12, 70], [76.4, 0]] // degrees of the long axis off north
const stemA = (z: number) => lut(A_TAB, z), stemB = (z: number) => lut(B_TAB, z)
const turn = (z: number) => (lut(TURN, z) * Math.PI) / 180

/** A point on the stem's lens-like section at height z, polar angle phi (from east, CCW), pushed out by `out`. */
function stemPt(z: number, phi: number, out = 0): V3 {
  const A = stemA(z), B = stemB(z), t = turn(z)
  // ellipse in the stem's own axes: long axis along local v (north before the turn)
  const lp = phi - t // angle in the local frame
  const c = Math.cos(lp), s = Math.sin(lp)
  // a slightly pointed lens: superellipse with exponent < 2 at the long ends
  const r = 1 / Math.pow(Math.pow(Math.abs(c) / B, 2) + Math.pow(Math.abs(s) / A, 2), 0.5)
  const R = r + out
  const x = R * Math.cos(phi), y = R * Math.sin(phi)
  return [TX + x, TY + y, z]
}

function build(detail: boolean) {
  const P = { white: new Part(), leaf: new Part(), window: new Part(), podium: new Part(), roof: new Part(), joint: new Part() }
  const NA = detail ? 64 : 36 // around the stem

  // ---------------------------------------------------------------- podium
  // Oval, 12 m: walls bowed out a little at a third of the height, rounded in at the top.
  const cx = PODIUM.reduce((s, p) => s + p[0], 0) / PODIUM.length, cy = PODIUM.reduce((s, p) => s + p[1], 0) / PODIUM.length
  const scaleRing = (k: number): XY[] => [...PODIUM].reverse().map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k])
  const prof: [number, number][] = [[0, 0.975], [3.5, 1.0], [8.5, 0.995], [10.6, 0.975], [11.6, 0.95], [12, 0.925]]
  const rings = prof.map(([z, k]) => scaleRing(k).map(([x, y]) => [x, y, z] as V3))
  // smooth normals around the oval
  const nrmAt = (ring: V3[], i: number, tilt: number): V3 => {
    const a = ring[(i - 1 + ring.length) % ring.length], b = ring[(i + 1) % ring.length]
    return unit([b[1] - a[1], -(b[0] - a[0]), tilt])
  }
  for (let k = 0; k < rings.length - 1; k++) {
    const r0 = rings[k], r1 = rings[k + 1]
    const tilt = (prof[k][1] - prof[k + 1][1]) * 40 / Math.max(0.3, prof[k + 1][0] - prof[k][0])
    for (let i = 0; i < r0.length; i++) {
      const j = (i + 1) % r0.length
      quadN(P.podium, r0[i], r0[j], r1[j], r1[i], [nrmAt(r0, i, tilt), nrmAt(r0, j, tilt), nrmAt(r1, j, tilt), nrmAt(r1, i, tilt)])
    }
  }
  // the grey panels' recessed horizontal joints, read as dark lines (unlit)
  const bands: [number, number][] = detail ? [[4.2, 4.8], [6.6, 7.2], [9.0, 9.5]] : [[4.4, 5.2], [7.4, 8.2]]
  for (const [z0, z1] of bands) {
    const k0 = 1.0 - 0.0005, r0 = scaleRing(k0 + 0.0012), n = r0.length
    for (let i = 0; i < n; i++) {
      const a = r0[i], b = r0[(i + 1) % n]
      quadN(P.joint, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
    }
  }
  capPoly(P.roof, scaleRing(0.925), 12)

  // ---------------------------------------------------------------- stem core
  const zs: number[] = []
  const NZ = detail ? 34 : 20
  for (let i = 0; i <= NZ; i++) { const t = i / NZ; zs.push(Z0 - 0.5 + (ZH - Z0 + 0.5) * (1 - Math.pow(1 - t, 1.6))) }
  const ring = (z: number, out = 0): V3[] => Array.from({ length: NA }, (_, i) => stemPt(Math.max(Z0, z), (2 * Math.PI * i) / NA, out))
  const coreRings = zs.map((z) => ring(z))
  for (let k = 0; k < coreRings.length - 1; k++) {
    const r0 = coreRings[k], r1 = coreRings[k + 1]
    for (let i = 0; i < NA; i++) {
      const j = (i + 1) % NA
      const n = (r: V3[], ii: number, rn: V3[]) => {
        const a = r[(ii - 1 + NA) % NA], b = r[(ii + 1) % NA]
        const dz = Math.hypot(rn[ii][0] - r[ii][0], rn[ii][1] - r[ii][1]) // flare
        return unit([b[1] - a[1], -(b[0] - a[0]), -dz * 0.9])
      }
      const rn = coreRings[Math.min(k + 2, coreRings.length - 1)]
      quadN(P.white, r0[i], r0[j], r1[j], r1[i], [n(r0, i, r1), n(r0, j, r1), n(r1, j, rn), n(r1, i, rn)])
    }
  }

  // ---------------------------------------------------------------- the leaf
  // Three layered strips on the south side. Each strip spans a band of polar
  // angle that narrows and drifts with height, stands off the core by `off`
  // and is `th` thick. The outer strip is the widest and stands off most.
  const strips = [
    // east family: from the south-east foot round to the south under the lip
    { c0: -20, c1: -86, w0: 36, w1: 20, off0: 0.2, off1: 0.45, th: 0.9 },
    { c0: -38, c1: -95, w0: 20, w1: 11, off0: 0.95, off1: 1.0, th: 0.8 },
    // west family: from the south-west foot round to the south, the other way
    { c0: -160, c1: -94, w0: 36, w1: 20, off0: 0.35, off1: 0.6, th: 0.9 },
    { c0: -142, c1: -85, w0: 20, w1: 11, off0: 1.1, off1: 1.15, th: 0.8 },
  ]
  const NS = detail ? 10 : 5 // across a strip
  const leafZs = zs.filter((z) => z >= Z0)
  for (const s of strips) {
    const secs: V3[][] = []
    for (const z of leafZs) {
      const t = (z - Z0) / (ZH - Z0)
      const tt = t // each band winds 55-70° round the stem, evenly up its height
      const c = ((s.c0 + (s.c1 - s.c0) * tt) * Math.PI) / 180
      const w = ((s.w0 + (s.w1 - s.w0) * tt) * Math.PI) / 180
      const off = s.off0 + (s.off1 - s.off0) * t + 1.6 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.1)), 1.5) // bows out at mid-height, back in under the lip
      // the strip's top bends out into the lip: no extra
      const outer: V3[] = [], inner: V3[] = []
      for (let k = 0; k <= NS; k++) {
        const phi = c - w + (2 * w * k) / NS
        // edges thinner, so the strip reads as a rounded petal
        const e = Math.sin((Math.PI * k) / NS)
        outer.push(stemPt(z, phi, off + s.th * (0.35 + 0.65 * e)))
        inner.push(stemPt(z, phi, Math.max(0, off - 0.05)))
      }
      secs.push([...outer, ...inner.reverse()])
    }
    // loft the closed section (outer arc then inner arc back): faces point out on the outer arc
    const n = secs[0].length
    for (let k = 0; k < secs.length - 1; k++) {
      const r0 = secs[k], r1 = secs[k + 1]
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n
        // outer arc runs with increasing phi (CCW) → quad (r0[i], r0[j], r1[j], r1[i]) faces out
        P.leaf.quad(r0[i], r0[j], r1[j], r1[i])
      }
    }
    // the foot: close the bottom of the strip
    const b = secs[0]
    for (let i = 1; i < b.length - 1; i++) P.leaf.tri(b[0], b[i + 1], b[i])
  }

  // ---------------------------------------------------------------- head and cab
  // Lip: the leaf's rim round the head, cantilevered further to the south and north.
  const ell = (a: number, b: number, z: number, n: number, dx = 0, dy = 0, rot = 0): V3[] =>
    Array.from({ length: n }, (_, i) => {
      const t = (2 * Math.PI * i) / n
      const x = b * Math.cos(t), y = a * Math.sin(t)
      return [TX + dx + x * Math.cos(rot) - y * Math.sin(rot), TY + dy + x * Math.sin(rot) + y * Math.cos(rot), z] as V3
    })
  const disc = (p: Part, side: Part | null, a: number, b: number, z0: number, z1: number, n: number, dy = 0, bottom = true) => {
    const lo = ell(a, b, z0, n, 0, dy), hi = ell(a, b, z1, n, 0, dy)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const nr = (k: number): V3 => { const t = (2 * Math.PI * k) / n; return unit([Math.cos(t) / b, Math.sin(t) / a, 0]) }
      quadN(side ?? p, lo[i], lo[j], hi[j], hi[i], [nr(i), nr(j), nr(j), nr(i)])
    }
    p.cap(hi, true)
    if (bottom) p.cap(lo, false)
  }
  const NC = detail ? 48 : 28
  // the lip: a soffit sloping out from the flare to the rim, then the rim band
  const lipLo = ell(13.6, 7.8, ZH - 0.2, NC, 0, -1.0), lipHi = ell(14.8, 8.6, ZH + 1.6, NC, 0, -1.3)
  for (let i = 0; i < NC; i++) {
    const j = (i + 1) % NC
    P.leaf.quad(lipLo[i], lipLo[j], lipHi[j], lipHi[i])
  }
  P.leaf.cap(lipLo, false)
  P.white.cap(lipHi, true)
  // lower cab: glass 78.0-81.6 under a slab 81.6-82.6
  disc(P.white, P.window, 10.2, 7.0, ZH + 1.6, 81.6, NC, 0, false)
  disc(P.white, null, 11.4, 8.0, 81.6, 82.6, NC)
  // a recessed neck, then the upper cab: slab, glass 83.8-87.2, roof disc 87.2-90
  disc(P.white, null, 10.6, 7.4, 82.6, 83.8, NC, 0, false)
  disc(P.white, P.window, 10.4, 7.3, 83.8, 87.2, NC, 0, false)
  disc(P.white, null, 11.4, 8.1, 87.2, 90.0, NC)
  // antenna ring on the roof: a low solid ring, drawn as a thin grey band
  disc(P.leaf, null, 9.6, 6.4, 90.0, detail ? 91.6 : 91.2, detail ? 32 : 16, 0, false)
  if (detail) {
    // a few masts round the roof
    for (let k = 0; k < 10; k++) {
      const t = (2 * Math.PI * k) / 10
      const x = TX + 9.0 * 0.66 * Math.cos(t), y = TY + 9.0 * Math.sin(t)
      const sq = (r: number, z: number): V3[] => [[x - r, y - r, z], [x + r, y - r, z], [x + r, y + r, z], [x - r, y + r, z]]
      P.leaf.loft([sq(0.18, 90), sq(0.1, 94)])
    }
  }

  return [
    { part: P.white, material: MAT.white },
    { part: P.leaf, material: MAT.leaf },
    { part: P.window, material: MAT.window },
    { part: P.podium, material: MAT.podium },
    { part: P.roof, material: MAT.roof },
    { part: P.joint, material: MAT.joint },
  ]
}

if (import.meta.main) {
  const extras = { name: 'Istanbul Airport control tower', source: `generators/${ID}.ts` }
  writeLod('Istanbul Airport control tower', `${ID}.glb`, build(false), extras, 5000, 250_000)
  writeLod('Istanbul Airport control tower', `${ID}.detail.glb`, build(true), extras, 40_000, 1_500_000)
}
