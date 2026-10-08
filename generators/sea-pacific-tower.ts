/**
 * Pacific Tower (US Marine Hospital, 1932, Bebb & Gould with John Graham;
 * later PacMed), Beacon Hill, Seattle — original procedural geometry, CC0-1.0.
 * bun generators/sea-pacific-tower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor
 * (-122.31571, 47.59286, the lidar tile's centre, 1.6 m east of the OSM
 * outline's centroid) on the lowest ground under the footprint (78.9 m
 * NAVD88, on the north side). The hill falls 7 m from the south forecourt to
 * the north, so the south front's walls run 7 m into the ground and its
 * facade starts there. The building is square to the compass; bearing 0.
 *
 * Form: an art-deco setback hospital in tan brick, symmetric about the
 * entrance axis on the south front: a 16-storey central tower whose centre bay
 * rises highest, flanked by a 12-13 storey slab, with lower wings stepping
 * forward at both ends (their outer corners rounded, their brick banded
 * darker). Behind, a stepped north wing with the glass bays of the later
 * addition, and low wings and service blocks to the north and east.
 *
 * Sources
 * - OSM: outline way/4712871 (Pacific Tower) and its parts
 *   way/1510326610..1510326619 (levels 3-16). The plan follows OSM, checked
 *   against the lidar (they agree to about a metre after the anchor shift).
 * - Lidar (measured, USGS 3DEP WA_KingCo_1_2021, above 78.9 m): tower 61 m,
 *   its upper stage 65, the centre bays 68; slab 52, its middle 55; south
 *   wings 36; north wing 35 / 40.5 / spine 48; low north wings 18-19; east
 *   blocks 9-13. South forecourt ground 7 m above the north side.
 * - Published: completed 1932 as the US Marine Hospital, 16 storeys
 *   (Wikipedia, "Pacific Tower (Seattle)").
 * - Photos (Wikimedia Commons, credits in the batch report): Joe Mabel (the
 *   south front pano; from the Buddhist Church and Mount Baker Ridge, the
 *   north and west sides), Vladimir Menkov (south-west).
 * Estimated: the window bays' widths and storey grouping (three storeys a
 * panel), the north wing's glass bays (simplified to one glazed face), the
 * east service blocks' facades (plain).
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, type Face, ccw, rect, arc, wallEdge, capRing, flatShape, chamfer, finishGlb, outward } from './sea-st-james-cathedral'

type Prism = { ring: XY[]; z1: number; z0?: number; wall: Part; panels?: Part | null; bay?: number; glassEdge?: (a: XY, b: XY) => boolean }

function inside(p: XY, r: XY[]) {
  let c = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j]
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < xi + ((p[1] - yi) * (xj - xi)) / (yj - yi)) c = !c
  }
  return c
}
/** How high the neighbours standing just outside a point cover it. */
function coverAt(prisms: Prism[], p: XY, self: Prism) {
  let h = self.z0 ?? 0, moved = true
  while (moved) {
    moved = false
    for (const q of prisms) if (q !== self && (q.z0 ?? 0) <= h + 0.01 && q.z1 > h + 0.01 && inside(p, q.ring)) { h = q.z1; moved = true }
  }
  return h
}

/** Ground above the model's zero: the south forecourt is 7 m up (lidar). */
const ground = (y: number) => (y < -13 ? 7 : y > 2 ? 0.5 : 0.5 + (6.5 * (2 - y)) / 15)

function build() {
  const brick = new Part(), band = new Part(), win = new Part(), roof = new Part(), glass = new Part()
  const G = 3.6 * 3 // three storeys a panel

  const AX = -22 // the entrance axis
  const mx = (x: number) => 2 * AX - x
  // the south wings' outer corners are rounded
  const wingW = ccw([[-61, 0], [-61, -18.5], ...arc(-56, -18.5, 5, 180, 270, 6).slice(1), [-48.5, -23.5], [-48.5, 0]])
  const wingE = ccw(wingW.map(([x, y]) => [mx(x), y] as XY))
  // north wing's middle tier, its flanks curving in toward the north (OSM)
  const nW: XY[] = [[-29.7, 21.3], [-31.1, 19.4], [-32.3, 17.3], [-33.8, 14.4], [-34.5, 10.9], [-34.9, 7.7]]
  const northB = ccw([...nW.slice().reverse(), [-34.9, 2], [mx(-34.9), 2], ...nW.map(([x, y]) => [mx(x), y] as XY)])

  const P: Prism[] = [
    { ring: rect(-48.5, -13.0, 4.5, 2.0), z1: 52, wall: brick, panels: win },
    { ring: rect(-34.5, -13.5, -9.5, 2.0), z1: 55, wall: brick, panels: win },
    { ring: rect(-30.5, -15.0, -13.5, 5.0), z1: 61, wall: brick, panels: win },
    { ring: rect(-29.5, -14.0, -14.5, 4.0), z1: 65, wall: brick, panels: win },
    // the crown: the centre bay runs up through the tower, front to back
    { ring: rect(-24.5, -15.8, -19.5, 5.8), z1: 68, wall: brick, panels: win, bay: 5 },
    { ring: wingW, z1: 36, wall: band, panels: win },
    // where the wings meet the slab they step up a tier (lidar 44.5 m)
    { ring: rect(-55.0, -13.0, -48.5, 0.0), z1: 44.5, wall: band, panels: win },
    { ring: rect(mx(-48.5), -13.0, mx(-55.0), 0.0), z1: 44.5, wall: band, panels: win },
    { ring: wingE, z1: 36, wall: band, panels: win },
    // north wing: base, the curved-flank tier, the spine
    { ring: rect(-36.5, 2.0, mx(-36.5), 25.0), z1: 35, wall: brick, panels: win },
    // its curved flanks are the later addition's glass bays (Joe Mabel, from the Buddhist Church)
    { ring: northB, z1: 40.5, wall: brick, panels: win, glassEdge: (a, b) => Math.abs(a[0] - b[0]) > 0.05 && Math.abs(a[1] - b[1]) > 0.05 && a[1] > 5 && b[1] > 5 },
    { ring: rect(-28.5, 2.0, -15.5, 24.0), z1: 48, wall: brick, panels: win },
    // low wings north and the east service blocks
    { ring: rect(-49.0, 2.0, -36.5, 24.0), z1: 18, wall: band, panels: win },
    { ring: rect(-7.5, 2.0, 4.5, 22.0), z1: 19, wall: band, panels: win },
    { ring: rect(4.5, 0.0, 19.0, 26.0), z1: 9, wall: band, panels: null },
    { ring: ccw([[17, -13], [35, -13], [35, -26], [49.5, -26], [49.5, 19], [19, 19], [19, 0], [17, 0]]), z1: 13, wall: band, panels: null },
    { ring: rect(17.0, -26.0, 35.0, -13.0), z1: 9.5, wall: band, panels: null },
  ]
  for (const p of P) p.ring = chamfer(ccw(p.ring), 0.4)

  for (const p of P) {
    const r = p.ring
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length], n = outward(a, b), L = Math.hypot(b[0] - a[0], b[1] - a[1])
      // what covers this edge from outside: the lowest of three samples
      let cov = Infinity
      for (const t of [0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95]) cov = Math.min(cov, coverAt(P, [a[0] + (b[0] - a[0]) * t + n[0] * 0.5, a[1] + (b[1] - a[1]) * t + n[1] * 0.5], p))
      const z0 = Math.max(p.z0 ?? 0, cov)
      if (z0 >= p.z1 - 0.01) continue
      if (p.glassEdge?.(a, b)) { wallEdge(glass, r, i, z0, p.z1 - 1.2, 25); wallEdge(p.wall, r, i, p.z1 - 1.2, p.z1, 25); continue }
      wallEdge(p.wall, r, i, z0, p.z1, 25)
      // window bays: three storeys a panel between brick piers and spandrels
      if (!p.panels || L < 3) continue
      const gnd = ground((a[1] + b[1]) / 2)
      const f: Face = { o: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0], n }
      const bayW = p.bay ?? 3.4, nb = Math.max(1, Math.round((L - 1.6) / bayW)), w = (L - 1.6) / nb
      const lo0 = Math.max(z0, gnd) + 1.2, hi0 = p.z1 - 2.2
      for (let k = 0; gnd + k * G < hi0; k++) {
        const lo = Math.max(gnd + k * G + 0.8, lo0), hi = Math.min(gnd + (k + 1) * G - 0.8, hi0)
        if (hi - lo < 3) continue
        for (let j = 0; j < nb; j++) {
          const s0 = -L / 2 + 0.8 + j * w + 0.6, s1 = -L / 2 + 0.8 + (j + 1) * w - 0.6
          if (s1 - s0 < 1.2) continue
          flatShape(p.panels, f, [[s0, lo], [s1, lo], [s1, hi], [s0, hi]], 0.05)
        }
      }
    }
    capRing(roof, r, p.z1)
  }

  // the later addition's glass on the north face of the spine
  flatShape(glass, { o: [-22, 24.0, 0], n: [0, 1] }, [[-5.5, 1.5], [5.5, 1.5], [5.5, 44], [-5.5, 44]], 0.09)
  // a tall glass bay on the north wing's west face, over the low west wing (Vladimir Menkov, from 12th Ave)
  flatShape(glass, { o: [-36.5, 13.5, 0], n: [-1, 0] }, [[-3, 18.5], [3, 18.5], [3, 33.5], [-3, 33.5]], 0.09)
  // and the tall glass bays either side of it on the north wing
  for (const s of [-6.5, 6.5]) flatShape(glass, { o: [AX, 25.0, 0], n: [0, 1] }, [[s - 2.5, 1.5], [s + 2.5, 1.5], [s + 2.5, 33], [s - 2.5, 33]], 0.09)

  return finishGlb('Pacific Tower', [
    { part: brick, material: finish('ptw-brick', 0xdcb593) },
    { part: band, material: finish('ptw-brick-banded', 0xcfa286) },
    { part: win, material: PALETTE.window },
    { part: glass, material: windowVariant(2, 0xa9bfd1) },
    { part: roof, material: PALETTE.roof },
  ], {
    bearing: 0, height: 68,
    replaces: ['way/4712871', ...[10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((n) => `way/15103266${n}`)],
  })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/sea-pacific-tower.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
