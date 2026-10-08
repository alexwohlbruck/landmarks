/**
 * Salesforce Tower, San Francisco — original procedural geometry, CC0-1.0.
 * bun generators/sf-salesforce-tower.ts
 *
 * Map frame, rotated to the building: +x is the south-east face's outward
 * normal, +y the north-east face's, z up, metres. BEARING 44 (the faces run
 * with the SoMa street grid). Origin = centroid of the OSM outline
 * way/431972186, which is also the centre of the plan.
 *
 * Evidence
 * - OSM way/431972186: rounded-square outline, 54.4 m across the faces,
 *   height 326, 61 levels. Parts 1053143796-801, 1053143803-805 (eight
 *   skillion facets of the curved faces, roof:direction 38.8/48.8/128.8/...,
 *   so the faces are turned 44 degrees from north, and a central flat part).
 *   1053143802 (5 levels, mostly outside the outline on the east edge) is a
 *   low annex the model does not cover, so it is not replaced.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 0.5 m, sampled in the
 *   building frame with /tmp/city/sf/lidar.py: ground under the footprint flat
 *   to 1.1 m; crown rim 326.6 m above the lowest ground; a deck ring inside
 *   the rim at ~324 m and an opening in the middle that drops to ~288 m.
 *   Face half-width (average of the four faces) by height: 27.4 at the foot,
 *   27.3 at 120, 26.3 at 200, 24.8 at 240, 22.6 at 270, 19.6 at 300, 16.6 at
 *   320, 14.3 at the rim: a straight shaft that curves in over the top third.
 *   Diagonal extents give a corner radius of about 14-15 m at every height.
 * - Published (Wikipedia, CTBUH): 326 m, 61 storeys, Pelli Clarke Pelli,
 *   2018; the top ~45 m is an open crown screened by perforated white
 *   aluminium, with the LED artwork level inside.
 * - Commons photos (daylight): "Salesforce Tower SF 2017.jpg" (homebucket,
 *   CC BY-SA 2.0, from the north-west), "Salesforce Tower 2020.jpg"
 *   (Saggittarius A, CC BY-SA 4.0, from the west), "Salesforce Tower from Ina
 *   Coolbrith Park-01445.jpg" (Frank Schulenburg, CC BY-SA 4.0, from the
 *   north-west, the white crown and its centre rib), "Salesforce Tower
 *   Roof.jpg" (InvadingInvader, CC BY-SA 4.0, drone view of the crown: white
 *   ribs, deck ring and the open middle), "Salesforce Tower alongside 181
 *   Fremont.jpg" (Yair92002, CC BY-SA 4.0, from the west), "Karl the Fog
 *   playing with the Salesforce Tower-L1003555.jpg" (Frank Schulenburg,
 *   CC BY-SA 4.0, from the north-east).
 *
 * Estimated: the crown base at 292 m (counted in floors on the Ina Coolbrith
 * photo: the white screen covers the top ~8 floors, its centre rib ~3 more),
 * the lobby recess (11 m tall, 1 m deep; no licensed street photo of the
 * base was found), the size of the opening in the top and the core block in
 * it, the rib widths. The curtain wall is drawn as one pale glass surface with
 * a floor-line band every six storeys; the real wall's closely spaced pale
 * fins are not drawn one by one.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const BEARING = 44
const ANCHOR = { lng: -122.396927, lat: 37.7897756 }

const curtain = new Part(), fins = new Part(), screen = new Part(), roof = new Part(), lobby = new Part()

// --- Plan: a rounded square of face half-width h and corner radius r. ---
const CS = 5 // segments per corner arc
function ring(h: number, z: number, r = radius(h)): V3[] {
  const out: V3[] = []
  const corners: [number, number][] = [[1, 1], [-1, 1], [-1, -1], [1, -1]]
  corners.forEach(([sx, sy], q) => {
    const cx = sx * (h - r), cy = sy * (h - r)
    for (let i = 0; i <= CS; i++) {
      const a = (q * Math.PI) / 2 + (i / CS) * (Math.PI / 2)
      out.push([cx + r * Math.cos(a), cy + r * Math.sin(a), z])
    }
  })
  return out
}
const radius = (h: number) => Math.min(14.5, 0.85 * h)

// --- Profile: face half-width by height, from the lidar. ---
const PROFILE: [number, number][] = [
  [0, 27.4], [120, 27.3], [160, 27.0], [200, 26.3], [240, 24.8], [260, 23.5], [270, 22.6],
  [280, 21.6], [290, 20.6], [300, 19.5], [310, 18.2], [318, 16.9], [323, 15.7], [326.6, 14.3],
]
function half(z: number) {
  for (let i = 0; i < PROFILE.length - 1; i++) {
    const [z0, h0] = PROFILE[i], [z1, h1] = PROFILE[i + 1]
    if (z <= z1) return h0 + ((h1 - h0) * (z - z0)) / (z1 - z0)
  }
  return PROFILE[PROFILE.length - 1][1]
}
const TOP = 326.6
const CROWN = 292
const LOBBY = 11

/** Loft with smooth per-vertex normals (rings counter-clockwise from above). */
function smoothLoft(p: Part, rings: V3[][], inward = false) {
  const n = rings[0].length, L = rings.length
  const acc: V3[][] = rings.map((r) => r.map(() => [0, 0, 0] as V3))
  const fn = (a: V3, b: V3, c: V3): V3 => {
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  }
  const add = (k: number, i: number, m: V3) => { const t = acc[k][i]; t[0] += m[0]; t[1] += m[1]; t[2] += m[2] }
  for (let k = 0; k < L - 1; k++) for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    let m = fn(rings[k][i], rings[k][j], rings[k + 1][j])
    const l = Math.hypot(...m) || 1
    m = [m[0] / l, m[1] / l, m[2] / l]
    if (inward) m = [-m[0], -m[1], -m[2]]
    add(k, i, m); add(k, j, m); add(k + 1, i, m); add(k + 1, j, m)
  }
  const N = acc.map((r) => r.map((m) => { const l = Math.hypot(...m) || 1; return [m[0] / l, m[1] / l, m[2] / l] as V3 }))
  for (let k = 0; k < L - 1; k++) for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a = rings[k][i], b = rings[k][j], c = rings[k + 1][j], d = rings[k + 1][i]
    const na = N[k][i], nb = N[k][j], nc = N[k + 1][j], nd = N[k + 1][i]
    if (!inward) {
      p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
      p.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
    } else {
      p.tri(a, c, b, undefined, undefined, undefined, [na, nc, nb])
      p.tri(a, d, c, undefined, undefined, undefined, [na, nd, nc])
    }
  }
}
/** Flat annulus between two rings of equal length at one height. */
function annulus(p: Part, outer: V3[], inner: V3[], up: boolean) {
  const n = outer.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    if (up) p.quad(inner[i], outer[i], outer[j], inner[j])
    else p.quad(inner[i], inner[j], outer[j], outer[i])
  }
}

// --- Lobby: recessed glazing under the shaft. ---
{
  const r0 = ring(half(0) - 1.0, 0), r1 = ring(half(LOBBY) - 1.0, LOBBY)
  smoothLoft(lobby, [r0, r1])
  annulus(fins, ring(half(LOBBY), LOBBY), r1, false) // soffit
}

// --- Shaft: pale curtain wall from the lobby to the crown. ---
const shaftZ = [LOBBY, 40, 80, 120, 160, 200, 220, 240, 250, 260, 270, 280, CROWN]
smoothLoft(curtain, shaftZ.map((z) => ring(half(z), z)))

// --- Floor-line bands: every six storeys (~25.8 m), and a heavier one at the crown base. ---
function band(p: Part, zc: number, hgt: number, out: number) {
  const z0 = zc - hgt / 2, z1 = zc + hgt / 2, b = Math.min(0.25, hgt / 3)
  smoothLoft(p, [
    ring(half(z0) - 0.05, z0),
    ring(half(z0 + b) + out, z0 + b),
    ring(half(z1 - b) + out, z1 - b),
    ring(half(z1) - 0.05, z1),
  ])
}
for (let k = 1; k <= 10; k++) band(fins, LOBBY + 25.8 * k - 2, 0.9, 0.22)
band(fins, LOBBY + 0.6, 1.2, 0.3)

// --- Crown: the open screen of white perforated fins. ---
const crownZ = [CROWN, 300, 310, 318, 323, TOP - 0.5]
smoothLoft(screen, crownZ.map((z) => ring(half(z), z)))
band(fins, CROWN + 0.6, 1.6, 0.3)
// Rounded lip to the rim, then the rim top.
const RIM = 0.9
{
  const a = ring(half(TOP - 0.5), TOP - 0.5), b = ring(half(TOP) - 0.25, TOP), c = ring(half(TOP) - RIM, TOP)
  smoothLoft(fins, [a, b])
  annulus(fins, b, c, true)
}

// Ribs: a bold rib down the middle of each face and one on each rounded corner.
function rib(angle: number, w: number, d: number, from = CROWN) {
  const zs = [from, ...[CROWN, 300, 310, 318, 323].filter((z) => z > from), TOP - 0.3]
  const at = (z: number, s: number, o: number): V3 => {
    const h = half(z), r = radius(h)
    // the surface point at this angle, and its outward normal
    const c = Math.cos(angle), sn = Math.sin(angle)
    let px: number, py: number, nx: number, ny: number
    if (Math.abs(Math.abs(c) - Math.abs(sn)) < 1e-6) {
      // corner: on the arc
      const cx = Math.sign(c) * (h - r), cy = Math.sign(sn) * (h - r)
      nx = c; ny = sn; px = cx + r * c; py = cy + r * sn
    } else {
      nx = Math.round(c); ny = Math.round(sn); px = nx * h; py = ny * h
    }
    const tx = -ny, ty = nx
    return [px + tx * s + nx * o, py + ty * s + ny * o, z]
  }
  const sec = (z: number): V3[] => [at(z, -w / 2, -0.1), at(z, -w / 2, d), at(z, w / 2, d), at(z, w / 2, -0.1)]
  for (let k = 0; k < zs.length - 1; k++) {
    const s0 = sec(zs[k]), s1 = sec(zs[k + 1])
    for (let i = 0; i < 3; i++) fins.quad(s0[i], s0[i + 1], s1[i + 1], s1[i])
  }
  const s = sec(zs[zs.length - 1])
  fins.quad(s[0], s[1], s[2], s[3]) // top
}
for (let q = 0; q < 4; q++) {
  rib((q * Math.PI) / 2, 2.2, 0.5, CROWN - 12) // the centre rib runs a few floors below the screen
  rib((q * Math.PI) / 2 + Math.PI / 4, 1.4, 0.4)
}

// --- Top: inner rim wall, deck ring, the open middle and its core. ---
{
  const hT = half(TOP) - RIM, DECK = 323.8
  const rimIn = ring(hT, TOP), rimLow = ring(hT, DECK)
  smoothLoft(screen, [rimLow, rimIn], true)
  const open = ring(6.5, DECK, 5)
  annulus(roof, ring(hT, DECK), open, true)
  const FLOOR = 300
  smoothLoft(roof, [ring(6.5, FLOOR, 5), open], true)
  roof.cap(ring(6.5, FLOOR, 5), true)
  // core: the lift overrun and the LED level's plant, a rounded block in the middle
  const core0 = ring(3, FLOOR, 1.8), core1 = ring(3, DECK + 1.6, 1.8)
  smoothLoft(roof, [core0, core1])
  roof.cap(core1, true)
}

const parts = [
  { part: curtain, material: windowVariant(2, 0xbccbd7) },
  { part: fins, material: finish('fin-white', 0xf2f1ec) },
  { part: screen, material: finish('crown-screen', 0xe7eaea) },
  { part: roof, material: PALETTE.roof },
  { part: lobby, material: { ...PALETTE.entrance, color: 0x8f9ca6 } },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Salesforce Tower', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: TOP,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/431972186', 'way/1053143796', 'way/1053143797', 'way/1053143798', 'way/1053143799', 'way/1053143800',
    'way/1053143801', 'way/1053143803', 'way/1053143804', 'way/1053143805'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-salesforce-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
