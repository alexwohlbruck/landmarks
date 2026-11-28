/**
 * 111 Huntington Avenue, Boston: original procedural geometry, CC0-1.0.
 * bun generators/bos-111-huntington.ts
 *
 * CBT Architects, completed 2002; 36 floors. A blue-glass tower whose square
 * plan has a broad curved bay on each face and stepped (sawtooth) corners,
 * with pale vertical fins; at the top it steps back in curved tiers to a
 * glass drum carrying an open dome of white steel arches round a central
 * core: the "R2-D2" or "juicer" crown, floodlit white at night.
 *
 * Frame: map frame turned to BEARING 356.1 (the faces run at 356.1° and
 * 86.1°), x east-ish, y north-ish, z up, metres. Origin = the anchor, the
 * centroid of OSM outline way/240255515. The tower is drawn round C, the
 * centre of the 2021 lidar footprint, which sits (-4.5, -2.5) m from the
 * OSM centroid; the OSM outline (traced from imagery) is also ~3 m wider on
 * each side than the lidar roof edges. Lidar is followed for both.
 *
 * Evidence
 * - OSM way/240255515 (outline, office, 36 levels, 169 m), with its
 *   building:parts: the curved-bay slices (33 and 31 levels, 138 and 130 m),
 *   the corner steps (32-33 levels, 134-139 m), way/240255482 (35 levels,
 *   146 m, the rounded upper tier), way/240255426 (36 levels, 150 m, the
 *   drum), way/240474022 (roof:shape dome, 165 m: twelve ribs in four fans
 *   of three about the diagonals), way/240255420 (the central core, r 3.2 m,
 *   165 m), roof parts at 146 m and the finial way/240255490 (169 m). The
 *   octant shape of the shaft and the upper tier are taken from the outline
 *   and way/240255482, scaled to the lidar.
 * - USGS 3DEP lidar MA_CentralEastern_1_2021 (2021 flight), 1 m grid read in
 *   this frame (tools/lidar_frame.py); street (Huntington Avenue, one ground
 *   return) 6.0 m above the box's ground_min. Heights above the street:
 *   - outer roof edge of the shaft 134.5, radius 26.5 on the axes;
 *   - stepped corners 138.5; upper tier 142.3 (to r 24.5);
 *   - terrace ring 151.0 (r 17.5-20.5); glass drum r 16.5, rim 157.0;
 *   - dome ribs to 169.7, core and spikes to 172.6.
 * - Published (Wikipedia "111 Huntington Avenue", citing CTBUH): 554 ft
 *   (168.9 m), 36 floors, completed 2002; "capped by an open-frame dome and
 *   crown which is illuminated at night"; blue glass curtain wall by CBT.
 * - Map terrain (Mapterhorn): slopes 5.8 m across the footprint, lowest at
 *   the SE corner on Huntington Avenue, so y = 0 is that street; the NW side
 *   sinks into the Prudential Center podium.
 * - Commons photos, all EVIDENCE:
 *   - "2017 Prudential Skywalk - 111 Huntington Avenue (SE).jpg", Beyond My
 *     Ken, CC BY-SA 4.0: the crown from above: tiers, drum, arches, core;
 *     https://commons.wikimedia.org/wiki/File:2017_Prudential_Skywalk_-_111_Huntington_Avenue_(SE).jpg
 *   - "111-Huntington-Ave.jpg", Fogster, public domain: from the South End
 *     (SE), the whole tower, blue-silver glass and fins, the dome;
 *     https://commons.wikimedia.org/wiki/File:111-Huntington-Ave.jpg
 *   - "111 Huntington Avenue (6222850995).jpg", Tony Hisgett, CC BY 2.0:
 *     the shaft and crown from the street;
 *     https://commons.wikimedia.org/wiki/File:111_Huntington_Avenue_(6222850995).jpg
 *   - "Boston night Hancock and Prudential dfjkn.jpg", Luciof, CC BY-SA 3.0
 *     (night): the dome lit white.
 *     https://commons.wikimedia.org/wiki/File:Boston_night_Hancock_and_Prudential_dfjkn.jpg
 *
 * Estimated: the arch springing (on the drum rim, semicircles of radius
 * 15.5 m springing just inside the drum rim, so their crowns meet the
 * lidar's 169.7 m; drawn 1.6 x 1.7 m, bolder than the real ribs, to read at
 * phone size); six arches stand for the
 * OSM's twelve ribs; the fin spacing (~4.5 m on the bays, one at each corner
 * step); the core's spikes (six, from the photos); the drum's height.
 * Simplified: the several small cascading steps at the top of each bay are
 * drawn as two tiers.
 * Doubts: the OSM and lidar plans differ by ~3 m in size and ~5 m in
 * position (see Frame).
 * No look-only sources were used.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, windowVariant } from './palette'

const BEARING = 356.1
const ANCHOR = { lng: -71.08147, lat: 42.346484 }
const C: [number, number] = [-4.5, -2.5] // lidar centre in the anchor frame

// --- Heights above Huntington Avenue (lidar) ---
const T1 = 134.5, T2 = 142.3, T3 = 151.0, DRUM = 157.0
const ARCH_R = 15.5, ARCH_BASE = DRUM - 2.5 // springing inside the rim; crowns at 170
const CORE_R = 3.0, CORE_TOP = 170.5, SPIKE_TOP = 172.6

type P2 = [number, number]
const glassW = new Part(), fin = new Part(), roof = new Part(), white = new Part(), drumG = new Part()

/** Mirror one octant (from the +x axis to the diagonal) into a full D4-symmetric loop, anticlockwise. */
function d4(oct: P2[]): P2[] {
  const q: P2[] = [...oct]
  for (let i = oct.length - 2; i >= 1; i--) q.push([oct[i][1], oct[i][0]]) // mirror over the diagonal
  q.push([0, oct[0][0]])
  const quarter = q.slice(0, -1) // from +x axis up to (not incl.) +y axis
  const out: P2[] = []
  for (let k = 0; k < 4; k++) {
    for (const [x, y] of quarter) {
      const r: P2 = k === 0 ? [x, y] : k === 1 ? [-y, x] : k === 2 ? [-x, -y] : [y, -x]
      out.push([r[0] + C[0], r[1] + C[1]])
    }
  }
  return out
}
const scale = (pts: P2[], s: number): P2[] => pts.map(([x, y]) => [x * s, y * s])

// Shaft: the OSM outline's octant (curved bay, three corner steps), scaled to the lidar's 26.5 m.
const SHAFT = d4(scale([[29.6, 0], [29.3, 4.8], [28.6, 9.7], [27.8, 13.5], [24.8, 13.5], [24.8, 17.2], [20.8, 17.2], [20.8, 20.8]], 26.5 / 29.6))
// Upper tier: way/240255482's octant, stretched to the lidar's 24.5 m on the axes.
const TIER2 = d4([[24.0, 0], [23.5, 4.6], [22.2, 8.8], [19.8, 13.0], [17.0, 15.0], [17.0, 17.0]])
const circle = (r: number, n: number, z = 0): P2[] =>
  Array.from({ length: n }, (_, i) => [C[0] + r * Math.cos((2 * Math.PI * i) / n), C[1] + r * Math.sin((2 * Math.PI * i) / n)] as P2)

/** Walls of an anticlockwise loop, and a cap fanned from C (every loop here is star-shaped about it). */
function prism(wallP: Part, capP: Part | null, pts: P2[], z0: number, z1: number) {
  for (let k = 0; k < pts.length; k++) {
    const a = pts[k], b = pts[(k + 1) % pts.length]
    wallP.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (capP) for (let k = 0; k < pts.length; k++) {
    const a = pts[k], b = pts[(k + 1) % pts.length]
    capP.tri([C[0], C[1], z1], [a[0], a[1], z1], [b[0], b[1], z1])
  }
}

/** A pale fin standing out from the wall at point p, facing out along n. */
function finAt(p: P2, n: P2, z0: number, z1: number, w = 0.55, d = 0.45) {
  const t: P2 = [-n[1], n[0]]
  const A: P2 = [p[0] - t[0] * w / 2, p[1] - t[1] * w / 2], B: P2 = [p[0] + t[0] * w / 2, p[1] + t[1] * w / 2]
  const A2: P2 = [A[0] + n[0] * d, A[1] + n[1] * d], B2: P2 = [B[0] + n[0] * d, B[1] + n[1] * d]
  fin.quad([A2[0], A2[1], z0], [B2[0], B2[1], z0], [B2[0], B2[1], z1], [A2[0], A2[1], z1])
  fin.quad([A[0], A[1], z0], [A2[0], A2[1], z0], [A2[0], A2[1], z1], [A[0], A[1], z1])
  fin.quad([B2[0], B2[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [B2[0], B2[1], z1])
  fin.quad([A[0], A[1], z1], [A2[0], A2[1], z1], [B2[0], B2[1], z1], [B[0], B[1], z1])
}
const norm = (v: P2): P2 => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

/** Fins on every corner of a loop (bisector-out), plus extra ones along edges longer than `every`. */
function fins(pts: P2[], z0: number, z1: number, every = 4.6) {
  const n = pts.length
  for (let k = 0; k < n; k++) {
    const p = pts[(k + n - 1) % n], q = pts[k], r = pts[(k + 1) % n]
    const n1 = norm([q[1] - p[1], p[0] - q[0]]), n2 = norm([r[1] - q[1], q[0] - r[0]])
    const cr = (q[0] - p[0]) * (r[1] - q[1]) - (q[1] - p[1]) * (r[0] - q[0])
    if (cr > 0) finAt(q, norm([n1[0] + n2[0], n1[1] + n2[1]]), z0, z1) // convex corners only
    const L = Math.hypot(r[0] - q[0], r[1] - q[1]), m = Math.floor(L / every)
    for (let i = 1; i <= m; i++) {
      const s = i / (m + 1)
      finAt([q[0] + (r[0] - q[0]) * s, q[1] + (r[1] - q[1]) * s], n2, z0, z1)
    }
  }
}

/** A flat ring band (parapet or rim) around a loop, from z0 to z1, pushed out by `out`. */
function rim(p: Part, pts: P2[], z0: number, z1: number, out: number) {
  const o = pts.map(([x, y]) => { const v = norm([x - C[0], y - C[1]]); return [x + v[0] * out, y + v[1] * out] as P2 })
  prism(p, null, o, z0, z1)
  for (let k = 0; k < pts.length; k++) {
    const a = pts[k], b = pts[(k + 1) % pts.length], c = o[(k + 1) % o.length], d = o[k]
    p.quad([a[0], a[1], z1], [d[0], d[1], z1], [c[0], c[1], z1], [b[0], b[1], z1])
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [c[0], c[1], z0], [d[0], d[1], z0])
  }
}

// --- Shaft and tiers ---
prism(glassW, roof, SHAFT, 0, T1)
fins(SHAFT, 0, T1 + 0.6)
prism(glassW, roof, TIER2, T1, T2)
fins(TIER2, T1, T2 + 0.6)
const TIER3 = circle(20.5, 24)
prism(glassW, roof, TIER3, T2, T3)
fins(TIER3, T2, T3 + 0.6, 99)
rim(white, TIER3, T3 - 0.2, T3 + 1.0, 0.25) // white parapet round the terrace

// --- Drum and its rim ---
const DRUM_PTS = circle(16.5, 24)
prism(drumG, roof, DRUM_PTS, T3, DRUM - 1.2)
rim(white, DRUM_PTS, DRUM - 1.2, DRUM, 0.5)
fins(DRUM_PTS, T3, DRUM - 1.2, 99)

// --- Dome: six semicircular arches about the diagonals, three to a fan ---
{
  const SEG = 12, W = 1.6, D = 1.7
  for (const deg of [31.5, 45, 58.5, 121.5, 135, 148.5]) {
    const a = (deg * Math.PI) / 180, u: P2 = [Math.cos(a), Math.sin(a)], t: P2 = [-u[1], u[0]]
    const sections: V3[][] = []
    for (let i = 0; i <= SEG; i++) {
      const th = (Math.PI * i) / SEG
      const r = ARCH_R * Math.cos(th), z = ARCH_BASE + ARCH_R * Math.sin(th)
      const nr = Math.cos(th), nz = Math.sin(th) // outward normal of the arch in its plane
      const ri = r - nr * D, zi = z - nz * D
      const pt = (rr: number, zz: number, side: number): V3 => [C[0] + u[0] * rr + t[0] * side, C[1] + u[1] * rr + t[1] * side, zz]
      sections.push([pt(r, z, -W / 2), pt(r, z, W / 2), pt(ri, zi, W / 2), pt(ri, zi, -W / 2)])
    }
    white.sweep(sections)
  }
  // central core: a white cylinder through the crown, with a ring of spikes
  const N = 12
  const ring = (r: number, z: number): V3[] =>
    Array.from({ length: N }, (_, i) => [C[0] + r * Math.cos((2 * Math.PI * i) / N), C[1] + r * Math.sin((2 * Math.PI * i) / N), z] as V3)
  white.loft([ring(CORE_R, DRUM - 1.2), ring(CORE_R, CORE_TOP)])
  white.cap(ring(CORE_R, CORE_TOP), true)
  for (let i = 0; i < 6; i++) {
    const a = (2 * Math.PI * i) / 6 + Math.PI / 12
    const cx = C[0] + (CORE_R - 0.4) * Math.cos(a), cy = C[1] + (CORE_R - 0.4) * Math.sin(a)
    const b: V3[] = [[cx - 0.35, cy - 0.35, CORE_TOP], [cx + 0.35, cy - 0.35, CORE_TOP], [cx + 0.35, cy + 0.35, CORE_TOP], [cx - 0.35, cy + 0.35, CORE_TOP]]
    const tip: V3 = [cx, cy, SPIKE_TOP]
    for (let k = 0; k < 4; k++) white.tri(b[k], b[(k + 1) % 4], tip)
  }
}

// The white crown, rims and fins of the drum are floodlit; the arches glow brightest.
const lit = (p: V3) => (p[2] > T3 - 1 ? 1 : 0)
const parts = [
  { part: glassW, material: windowVariant(2, 0x9fb5c9) },
  { part: fin, material: { ...PALETTE.trim, color: 0xe9edf0 } },
  { part: roof, material: PALETTE.roof },
  { part: drumG, material: PALETTE.window },
  { part: white, material: { ...PALETTE.trim, name: 'crown-white', color: 0xf6f7f5, floodlight: lit } },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('111 Huntington Avenue', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: SPIKE_TOP,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/bos-111-huntington.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
