/**
 * GT Tower (East), Seocho-dong, Seoul — original procedural geometry, CC0-1.0.
 * bun generators/seoul-gt-tower.ts
 *
 * The rippling glass tower by Gangnam station (2011): its floor plates shift
 * back and forth up the height, so the whole tower sways and its faces
 * swell in and out. The ripple is real geometry: the skin is lofted through
 * 29 plan rings, each the OSM rectangle shifted along the long axis and with
 * its long faces bowed, by sine waves of height; silver vertical fins ride
 * the waves up every face, parallel to the wavy silhouette, and stand past
 * the roof as a comb along the crown (grouped about 3 m apart on the long
 * faces; the real fins are denser).
 *
 * Frame: BEARING 159.43, so model +y points to compass 159.4 (the long axis,
 * SSE) and +x to compass 249.4 (WSW). Origin = centroid of the OSM outline
 * way/301605795. y = 0 is the street; elevation 0. Terrain could not be
 * checked: Mapterhorn has no z15 tiles over Seoul.
 *
 * Evidence
 * - OSM way/301605795 "GT타워" (height 130, 24 levels, start 2011, wikidata
 *   Q17063396, source survey): a 31.4 x 40.3 m rectangle, fetched 2026-11-13.
 * - Photos (EVIDENCE):
 *   "Gangnam", AntheaAtlas (Flickr), CC BY 2.0,
 *     https://www.flickr.com/photos/69327687@N03/19547142271
 *     looking up a corner over most of the height: the vertical fins riding
 *     the waves parallel to the silhouette, their ends forming a comb along
 *     the top edge, the corner silhouette swinging in and out about two
 *     times over the visible upper two-thirds, and the top flaring out. The
 *     wave count, amplitude and flare are read from this photo.
 *   "The wave of G Tower", seafaringwoman (Flickr), CC BY 2.0,
 *     https://www.flickr.com/photos/27284887@N03/7111561555
 *     close-up of the waving corner: every fin parallel to the wavy edge.
 *   "Gangman, Seúl, Corea Del Sur - panoramio (3).jpg", Nelson Pérez,
 *     CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Gangman,Se%C3%BAl,_Corea_Del_Sur_-_panoramio_(3).jpg
 *     looking up the face: the curving floor edges, deep blue glass.
 *   LOOK-ONLY (CC BY-NC / NC-ND / NC-SA), looked at but not relied on:
 *     Flickr "GT Tower, Seoul" by hewy (15776985981), "GT Tower" by Travis
 *     Estell (31116108405), "강남역 GT타워" by TFurban (9801828155). They
 *     agree with the licensed photos above.
 *   (A Commons photo "GT Tower East Gangnam Seoul South Korea 20130412
 *   095744.jpg" found by search has been deleted from Commons; not used.)
 *   Colours: glass deep blue ~#2c4870 in sun (Nelson Pérez), pulled light
 *   to #5d7798; fins light silver, drawn #c9d1d8.
 *
 * Estimated: the wave (4.5 m sway along the long axis, 1.8 m bow of the long
 * faces, ~65 m wavelength, two waves up the height, the top flaring 3 m;
 * all read from the AntheaAtlas photo, an upward view, so the amplitudes
 * are approximate), the fin size (0.8 m proud, 1 m wide, bolder than real), spacing and
 * the 2.2 m comb above the roof,
 * the 6 m lobby. Published height 130 m (OSM; the tower is about 130 m to the
 * roof). No lidar exists for Korea.
 *
 * Night: the office glass is lit (window-2); the lobby is `entrance`.
 */
import { Part, writeGlb, cross, sub, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const BEARING = 159.43
const ANCHOR = { lng: 127.025944, lat: 37.498063 }

const HX = 15.7, HY = 20.15, H = 130
const LOBBY = 6
const glass = new Part(), fin = new Part(), roof = new Part(), lobby = new Part(), trim = new Part()

/** The sway along y and the bow of the long faces, by height; both zero at the street. */
const WAVE = 65
const sway = (z: number) => 4.5 * Math.sin((2 * Math.PI * z) / WAVE) * Math.min(1, z / 12)
const bow = (z: number) => 1.8 * Math.sin((2 * Math.PI * z) / WAVE + Math.PI / 2) * Math.min(1, z / 12)
const flare = (z: number) => 3.0 * Math.max(0, (z - (H - 14)) / 14) ** 2 // the top widens a little

/**
 * The plan ring at height z, counter-clockwise, as a list of points with the
 * parameter along the perimeter. Corners are chamfered 1.5 m.
 */
const NL = 14, NS = 10, C = 1.5
function ring(z: number): V3[] {
  const s = sway(z), b = bow(z), f = flare(z)
  const pts: V3[] = []
  const hx = HX + f, hy = HY + f
  // south face (y = -hy), x from -hx to hx
  const edge = (from: [number, number], to: [number, number], n: number, push: (u: number) => [number, number]) => {
    for (let k = 0; k < n; k++) {
      const u = k / n
      const [ox, oy] = push(u)
      pts.push([from[0] + (to[0] - from[0]) * u + ox, from[1] + (to[1] - from[1]) * u + oy + s, z])
    }
  }
  const bump = (u: number) => Math.sin(Math.PI * u)
  edge([-hx + C, -hy], [hx - C, -hy], NS, () => [0, 0])
  edge([hx - C, -hy], [hx, -hy + C], 1, () => [0, 0])
  edge([hx, -hy + C], [hx, hy - C], NL, (u) => [b * bump(u), 0]) // east long face bows
  edge([hx, hy - C], [hx - C, hy], 1, () => [0, 0])
  edge([hx - C, hy], [-hx + C, hy], NS, () => [0, 0])
  edge([-hx + C, hy], [-hx, hy - C], 1, () => [0, 0])
  edge([-hx, hy - C], [-hx, -hy + C], NL, (u) => [b * bump(u), 0]) // the west face bows the same way: the tower ripples, not breathes
  edge([-hx, -hy + C], [-hx + C, -hy], 1, () => [0, 0])
  return pts
}

// Ring heights: the lobby, then every ~3.6 m to the top.
const zs: number[] = [0, LOBBY]
const NR = 28
for (let k = 1; k <= NR; k++) zs.push(LOBBY + ((H - LOBBY) * k) / NR)
const rings = zs.map(ring)
const M = rings[0].length

// Smooth normals over the lofted skin (from the glass rings only).
const normal = (r: number, i: number): V3 => {
  const a = rings[r][(i + 1) % M], b = rings[r][(i + M - 1) % M]
  const u = rings[Math.min(rings.length - 1, r + 1)][i], d = rings[Math.max(1, r - 1)][i]
  const n = cross(sub(a, b), sub(u, d))
  const l = Math.hypot(...n) || 1
  return [n[0] / l, n[1] / l, n[2] / l]
}
// lobby: recessed 1.5 m, lit
{
  const inset = (p: V3, z: number): V3 => [p[0] * (1 - 1.5 / HX), p[1] * (1 - 1.5 / HY), z]
  const lo = rings[0].map((p) => inset(p, 0)), hi = rings[1].map((p) => inset(p, LOBBY))
  lobby.loft([lo, hi])
  // the soffit over the recessed lobby
  for (let i = 0; i < M; i++) {
    const j = (i + 1) % M
    trim.quad(rings[1][j], rings[1][i], hi[i], hi[j])
  }
}
for (let r = 1; r < rings.length - 1; r++) {
  for (let i = 0; i < M; i++) {
    const j = (i + 1) % M
    const n = [normal(r, i), normal(r, j), normal(r + 1, j), normal(r + 1, i)]
    glass.tri(rings[r][i], rings[r][j], rings[r + 1][j], [0, 0], [0, 0], [0, 0], [n[0], n[1], n[2]])
    glass.tri(rings[r][i], rings[r + 1][j], rings[r + 1][i], [0, 0], [0, 0], [0, 0], [n[0], n[2], n[3]])
  }
}
// roof and a slim pale coping at the top edge
const top = rings[rings.length - 1]
roof.cap(top.map((p) => [p[0], p[1], p[2] + 1.2] as V3).filter((_, i) => i % 1 === 0), true)
{
  const up = top.map((p) => [p[0], p[1], p[2] + 1.2] as V3)
  trim.loft([top, up])
}

// Fins: the facade's vertical fins, triangular ridges 0.8 m proud, riding
// the waves up every face parallel to the silhouette, and running 2.2 m past
// the roof so their ends make the comb along the crown.
const COMB = 2.2
function finAt(i: number) {
  const last = rings.length - 1
  const at = (k: number, lift = 0) => {
    const kk = Math.min(k, last)
    const p = rings[kk][i], n = normal(kk, i)
    const t = sub(rings[kk][(i + 1) % M], rings[kk][(i + M - 1) % M]), tl = Math.hypot(...t)
    const tx: V3 = [t[0] / tl, t[1] / tl, t[2] / tl]
    const w = 0.5
    const unit = (v: V3): V3 => { const l = Math.hypot(...v); return [v[0] / l, v[1] / l, v[2] / l] }
    const nl = unit([n[0] - tx[0] * 0.8, n[1] - tx[1] * 0.8, n[2]]), nr = unit([n[0] + tx[0] * 0.8, n[1] + tx[1] * 0.8, n[2]])
    const z = p[2] + lift
    return {
      l: [p[0] - tx[0] * w + n[0] * 0.02, p[1] - tx[1] * w + n[1] * 0.02, z] as V3,
      r: [p[0] + tx[0] * w + n[0] * 0.02, p[1] + tx[1] * w + n[1] * 0.02, z] as V3,
      c: [p[0] + n[0] * 0.8, p[1] + n[1] * 0.8, z] as V3,
      nl, nr, nc: n,
    }
  }
  const segs = [] as ReturnType<typeof at>[]
  for (let r = 1; r <= last; r++) segs.push(at(r))
  segs.push(at(last, COMB)) // the comb above the roof
  for (let k = 0; k < segs.length - 1; k++) {
    const a = segs[k], b = segs[k + 1]
    // smooth-shaded ridge: shared normals let the corners weld up the fin
    fin.tri(a.l, a.c, b.c, [0, 0], [0, 0], [0, 0], [a.nl, a.nc, b.nc])
    fin.tri(a.l, b.c, b.l, [0, 0], [0, 0], [0, 0], [a.nl, b.nc, b.nl])
    fin.tri(a.c, a.r, b.r, [0, 0], [0, 0], [0, 0], [a.nc, a.nr, b.nr])
    fin.tri(a.c, b.r, b.c, [0, 0], [0, 0], [0, 0], [a.nc, b.nr, b.nc])
  }
  // the comb's cut-off top and back, so the fin end is a closed tooth
  const t = segs[segs.length - 1]
  fin.tri(t.l, t.r, t.c)
  fin.tri(t.l, t.c, t.r)
}
// ring layout: [south NS][corner][east NL][corner][north NS][corner][west NL][corner]
const south0 = 0, east0 = NS + 1, north0 = east0 + NL + 1, west0 = north0 + NS + 1
for (let k = 1; k < NL; k += 2) { finAt(east0 + k); finAt(west0 + k) } // seven per long face
for (let k = 2; k < NS; k += 3) { finAt(south0 + k); finAt(north0 + k) } // three per end
for (const c of [east0 - 1, north0 - 1, west0 - 1, M - 1]) finAt(c) // the corners

const parts = [
  { part: glass, material: windowVariant(2, 0x5d7798) },
  { part: fin, material: finish('gt-fin', 0xc9d1d8, 0.5) },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
  { part: lobby, material: { ...PALETTE.entrance, color: 0x6a7c8e } },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('GT Tower', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: H + 1.2,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/301605795'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/seoul-gt-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
