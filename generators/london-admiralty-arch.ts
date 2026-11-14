/**
 * Admiralty Arch, The Mall / Trafalgar Square, London (Sir Aston Webb,
 * 1906-1911): original procedural geometry, CC0-1.0.
 * bun generators/london-admiralty-arch.ts
 * Writes models/london-admiralty-arch.glb (low) and
 * models/london-admiralty-arch.detail.glb (detail, detailZoom 16).
 * Imports `figure`/`place` from london-albert-memorial.ts (merge that first).
 *
 * Map frame, turned to BEARING 56.8 (the axis of the Mall through the arches,
 * from the outline's minimum rectangle): +y is compass 56.8, towards
 * Trafalgar Square; -y looks down the Mall. x runs along the building, +x
 * towards Horse Guards (south-east). z up, metres; z = 0 is the lowest ground
 * under the footprint (the Horse Guards end); the roadway under the arches
 * is 1.9 m higher (S below). Origin = the area centroid of OSM
 * relation/17074208.
 *
 * The plan is OSM's: the outline of the relation and its eleven building
 * parts; the low bow on the Horse Guards end (way/1242515125) is drawn at
 * two storeys, with the balustrade and cornices carried across its chord. The building is not symmetric in plan - the north-west block runs on
 * into the Old Admiralty - but the arch section is: three road arches on the
 * axis of the Mall (x = -5.85), a pedestrian arch either side of them.
 *
 * What makes it Admiralty Arch, and how each is drawn
 * - The curved Portland stone range straddling the Mall: both long fronts are
 *   concave, the arch section thin and the two end blocks deep (OSM).
 * - The three tall road arches and the two lower pedestrian arches - real
 *   through passages, with round soffits - and the giant Corinthian columns
 *   flanking the road arches on both fronts.
 * - The rusticated ground floor, the giant order of pilasters over two
 *   storeys of windows in the wings, the entablature, the top storey and the
 *   balustrade (a real parapet); windows as grouped panels per bay.
 * - The central attic over the arches with the inscription band, and the two
 *   square blocks that flank it; the end pavilions on the Mall with their
 *   pediments, and the seated statues (Navigation and Gunnery) beside them.
 *
 * Sources
 * - OSM relation/17074208 (outer way/382310651; Historic England 1238982;
 *   wikidata Q359256) and its building parts way/1242515121-1242515131;
 *   (c) OpenStreetMap contributors, ODbL.
 * - Lidar: Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government
 *   Licence v3.0: roadway at the arches 1.9 m above the lowest ground under
 *   the footprint; roof/balustrade 20.3 m above that; the central attic 23.6-
 *   24.0; the end blocks' roofs 20.3-22. The attic is modelled to 25.1 and its
 *   corner blocks to 26.1, ~1 m over the lidar, so it stands clear of the
 *   ranges as in the photos.
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Admiralty Arch, London, England - June 2009.jpg", David Iliff (Diliff),
 *     CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Admiralty_Arch,_London,_England_-_June_2009.jpg
 *     (the Mall front, level: arch, column and storey heights, the pavilions);
 *   "Admiralty Arch from the Mall.jpg", VirtuallyLondonBecky, CC0,
 *     https://commons.wikimedia.org/wiki/File:Admiralty_Arch_from_the_Mall.jpg
 *     (the arches, columns and inscription attic close up);
 *   "Admiralty Arch, City of Westminster.jpg", Tristan Surtel, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Admiralty_Arch,_City_of_Westminster.jpg
 *   "Admiralty Arch, Trafalgar Square.jpg", Garry Knight, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:Admiralty_Arch,_Trafalgar_Square.jpg
 *     (the Trafalgar Square front);
 *   "Admiralty Arch - geograph.org.uk - 2988086.jpg", Len Williams, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:Admiralty_Arch_-_geograph.org.uk_-_2988086.jpg
 * - Look-only: none.
 *
 * Measured / published / estimated
 * - Measured: the plan (OSM); the levels above (lidar).
 * - Estimated from the Diliff photo (scaled by the OSM pier spacing, 7.3 m):
 *   road arches 5.4 m wide springing 9.4 m above the roadway (crown 12.1,
 *   about two-thirds of the facade height, from the Garry Knight photo);
 *   pedestrian arches 2.6 m, crown 4.9; columns to 11.2 + capitals to 12.4;
 *   rusticated base to 5.5; entablature 12.6-14.2; top storey to 17.0;
 *   cornice and balustrade to 18.4 above the roadway; window bays 3.6 m.
 * - Invented: the roof is drawn flat behind the balustrade; the statues'
 *   poses are generic seated figures.
 *
 * Doubts
 * - OSM's plan is asymmetric at the ends (the north-west block continues as
 *   part of the Old Admiralty complex); the model follows OSM.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { lathe, face } from './nyc-columbus-monument'
import { writeModel, cbox } from './london-buckingham-palace'
import { capPoly, insetRing, area, type XY } from './nyc-570-lexington'
import { place, figure, tri, LOW, HIGH, type Q } from './london-albert-memorial'

export const BEARING = 56.8

const S = 1.9 // the roadway under the arches, above z = 0

const OUTER: XY[] = [[-29.1,-23.5],[-28.1,-21.3],[-27.1,-19.4],[-25.7,-17.5],[-24.1,-15.6],[-22.5,-14.0],[-20.8,-12.6],[-20.5,-13.1],[-15.5,-10.3],[-16.0,-9.3],[-14.7,-8.7],[-12.7,-7.7],[-10.4,-7.1],[-8.5,-6.8],[-5.6,-6.6],[-1.3,-6.9],[1.5,-7.4],[5.0,-8.6],[5.7,-8.9],[5.1,-9.9],[9.8,-12.8],[10.3,-12.2],[12.3,-13.6],[14.1,-15.3],[15.4,-16.9],[16.5,-18.7],[17.5,-20.8],[18.2,-22.8],[18.9,-25.4],[19.2,-25.9],[25.4,-25.8],[25.7,-25.5],[29.6,-15.8],[30.4,-15.2],[30.9,-13.0],[31.0,-12.1],[32.7,-7.3],[34.8,-1.6],[37.0,4.2],[38.6,7.2],[38.1,7.3],[42.3,18.1],[42.7,18.3],[40.4,23.0],[39.7,22.7],[20.7,29.1],[19.5,29.6],[15.0,25.7],[14.5,25.3],[14.9,24.8],[14.9,23.4],[14.5,21.5],[13.8,19.3],[13.0,17.2],[12.1,15.3],[10.9,13.4],[9.8,12.0],[8.7,10.7],[8.0,11.5],[4.0,8.1],[4.2,7.8],[3.5,7.3],[1.1,5.7],[-1.5,4.7],[-3.2,4.2],[-5.8,3.3],[-8.6,2.7],[-12.7,2.6],[-15.3,2.8],[-16.1,2.9],[-16.0,3.8],[-20.9,5.5],[-21.2,5.1],[-23.4,6.3],[-25.3,7.5],[-27.3,8.9],[-28.9,10.3],[-30.3,11.8],[-31.7,13.8],[-33.1,16.0],[-34.1,15.4],[-34.7,16.0],[-37.6,12.8],[-36.7,11.9],[-41.7,6.6],[-42.2,6.1],[-41.7,5.7],[-48.7,-1.3],[-49.3,-0.7],[-53.4,-4.9],[-53.1,-5.3],[-53.3,-5.6],[-52.6,-6.3],[-52.1,-6.5],[-36.0,-23.4],[-35.9,-25.0],[-35.3,-25.8],[-31.5,-25.7],[-29.8,-25.9]]
const P127: XY[] = [[-16.1,2.9],[-16.0,3.8],[-20.9,5.5],[-21.2,5.1],[-22.2,2.3],[-21.5,1.6],[-21.1,0.3],[-21.2,-2.7],[-21.6,-4.4],[-22.3,-5.4],[-22.3,-6.6],[-25.9,-3.3],[-27.8,-5.4],[-24.8,-8.2],[-25.4,-8.9],[-23.4,-10.9],[-22.4,-9.8],[-20.8,-12.6],[-20.5,-13.1],[-15.5,-10.3],[-16.0,-9.3]]
const P128: XY[] = [[-20.8,-12.6],[-22.4,-9.8],[-23.4,-10.9],[-25.4,-8.9],[-24.8,-8.2],[-27.8,-5.4],[-25.9,-3.3],[-22.3,-6.6],[-22.3,-5.4],[-21.6,-4.4],[-21.2,-2.7],[-21.1,0.3],[-21.5,1.6],[-22.2,2.3],[-21.2,5.1],[-23.4,6.3],[-25.3,7.5],[-27.3,8.9],[-28.9,10.3],[-30.3,11.8],[-31.7,13.8],[-33.1,16.0],[-34.1,15.4],[-34.7,16.0],[-37.6,12.8],[-36.7,11.9],[-41.7,6.6],[-42.2,6.1],[-41.7,5.7],[-48.7,-1.3],[-49.3,-0.7],[-53.4,-4.9],[-53.1,-5.3],[-53.3,-5.6],[-52.6,-6.3],[-52.1,-6.5],[-36.0,-23.4],[-35.9,-25.0],[-35.6,-25.4],[-35.3,-25.8],[-31.5,-25.7],[-29.8,-25.9],[-29.1,-23.5],[-28.1,-21.3],[-27.1,-19.4],[-25.7,-17.5],[-24.1,-15.6],[-22.5,-14.0]]
const P129: XY[] = [[10.3,-12.2],[12.3,-13.6],[14.1,-15.3],[15.4,-16.9],[16.5,-18.7],[17.5,-20.8],[18.2,-22.8],[18.9,-25.4],[19.2,-25.9],[25.4,-25.8],[25.7,-25.5],[29.6,-15.8],[30.4,-15.2],[30.9,-13.0],[31.0,-12.1],[32.7,-7.3],[34.8,-1.6],[37.0,4.2],[38.6,7.2],[38.1,7.3],[42.3,18.1],[42.7,18.3],[40.4,23.0],[39.7,22.7],[20.7,29.1],[19.5,29.6],[15.0,25.7],[14.5,25.3],[14.9,24.8],[14.9,23.4],[14.5,21.5],[13.8,19.3],[13.0,17.2],[12.1,15.3],[10.9,13.4],[9.8,12.0],[8.7,10.7],[12.4,6.6],[14.9,5.6],[16.6,10.3],[19.5,9.3],[21.1,13.8],[22.0,15.3],[23.2,16.1],[24.5,16.3],[25.5,16.2],[26.5,15.7],[27.5,14.8],[28.2,12.6],[27.8,10.7],[26.3,6.7],[25.2,6.6],[23.1,7.4],[22.1,4.8],[25.2,3.7],[23.0,-2.1],[22.1,-4.2],[21.0,-5.5],[19.6,-6.1],[18.5,-6.1],[17.4,-5.8],[16.5,-5.2],[15.7,-4.2],[15.4,-2.9],[15.5,-1.4],[16.1,0.4],[16.8,2.3],[14.4,3.2],[11.9,-4.0],[13.6,-7.3]]
const P130: XY[] = [[14.9,5.6],[12.4,6.6],[8.7,10.7],[8.0,11.5],[4.0,8.1],[4.2,7.8],[5.7,-8.9],[5.1,-9.9],[9.8,-12.8],[10.3,-12.2],[13.6,-7.3],[11.9,-4.0],[14.4,3.2],[16.8,2.3],[16.1,0.4],[17.5,-0.1],[21.5,-1.6],[23.0,-2.1],[25.2,3.7],[22.1,4.8],[23.1,7.4],[25.2,6.6],[26.5,10.1],[21.7,11.9],[20.6,8.9],[19.5,9.3],[16.6,10.3]]
const P131: XY[] = [[-16.1,2.9],[-16.0,-9.3],[-14.7,-8.7],[-12.7,-7.7],[-10.4,-7.1],[-8.5,-6.8],[-5.6,-6.6],[-1.3,-6.9],[1.5,-7.4],[5.0,-8.6],[5.7,-8.9],[4.2,7.8],[3.5,7.3],[1.1,5.7],[-1.5,4.7],[-3.2,4.2],[-5.8,3.3],[-8.6,2.7],[-12.7,2.6],[-15.3,2.8]]
const P124: XY[] = [[17.9,-2.3],[20.0,-3.1],[21.5,-1.6],[17.5,-0.1]]
/** The low two-storey bow on the Horse Guards end (OSM building:levels 2; the lidar reads it low). */
const P125: XY[] = [[32.7,-7.3],[33.2,-7.2],[33.8,-7.0],[34.2,-6.9],[34.5,-6.7],[35.0,-6.2],[35.4,-5.7],[35.7,-5.1],[35.8,-4.3],[35.8,-3.5],[35.7,-3.0],[35.5,-2.6],[35.2,-2.1],[34.8,-1.6]]

/** Clip a ring to x0 <= x <= x1 (Sutherland-Hodgman). */
function clipX(ring: XY[], x0: number, x1: number): XY[] {
  const half = (pts: XY[], keep: (p: XY) => boolean, cut: (a: XY, b: XY) => XY) => {
    const out: XY[] = []
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length]
      if (keep(a)) { out.push(a); if (!keep(b)) out.push(cut(a, b)) } else if (keep(b)) out.push(cut(a, b))
    }
    return out
  }
  const at = (x: number) => (a: XY, b: XY): XY => [x, a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0])]
  return half(half(ring, (p) => p[0] >= x0, at(x0)), (p) => p[0] <= x1, at(x1))
}

/** Walls of a ring between z0 and z1 (outward for a counter-clockwise ring), optional caps. */
function extrude(p: Part, ring: XY[], z0: number, z1: number, top: Part | null, bottom = false) {
  let r = ring
  if (r.length < 3 || Math.abs(area(r)) < 0.05) return
  if (area(r) < 0) r = [...r].reverse()
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-3) continue
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (top) capPoly(top, r, z1, true)
  if (bottom) capPoly(p, r, z0, false)
}

type Arch = { x0: number; x1: number; zs: number }

/** Extrude a ring 0..z1 with round-headed passages along y cut through it at each arch's x-range. */
function extrudeArched(p: Part, soffit: Part, top: Part | null, ring: XY[], z1: number, arches: Arch[], n: number) {
  const sorted = [...arches].sort((a, b) => a.x0 - b.x0)
  const xs = ring.map((q) => q[0]), xmin = Math.min(...xs) - 1, xmax = Math.max(...xs) + 1
  let x = xmin
  for (const a of sorted) {
    if (a.x0 > x) extrude(p, clipX(ring, x, a.x0), 0, z1, top)
    const r = (a.x1 - a.x0) / 2, xc = (a.x0 + a.x1) / 2
    for (let i = 0; i < n; i++) {
      const u0 = a.x0 + (a.x1 - a.x0) * i / n, u1 = a.x0 + (a.x1 - a.x0) * (i + 1) / n, um = (u0 + u1) / 2
      const zb = a.zs + Math.sqrt(Math.max(0, r * r - (um - xc) * (um - xc)))
      const sl = clipX(ring, u0, u1)
      if (sl.length < 3) continue
      extrude(p, sl, zb, z1, top)
      capPoly(soffit, area(sl) < 0 ? [...sl].reverse() : sl, zb, false)
    }
    x = a.x1
  }
  if (x < xmax) extrude(p, clipX(ring, x, xmax), 0, z1, top)
}

function build(Q: Q) {
  const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), dark = new Part(), soffit = new Part()
  const ZR = S + 17.4, ZB = S + 18.4 // roof behind the balustrade, balustrade top
  const XM = -5.85 // the Mall's axis
  const road: Arch[] = [[-15.85, -10.45], [-8.55, -3.15], [-1.25, 4.15]].map(([x0, x1]) => ({ x0, x1, zs: S + 9.4 }))
  const ped: Arch[] = [{ x0: XM - 15.3, x1: XM - 12.7, zs: S + 3.6 }, { x0: XM + 12.7, x1: XM + 15.3, zs: S + 3.6 }]
  const nA = Q.detail ? 10 : 5

  // ===== Massing ===========================================================
  extrudeArched(stone, soffit, roof, P131, ZR, road, nA)
  extrudeArched(stone, soffit, roof, P127, ZR, [ped[0]], Q.detail ? 6 : 3)
  extrudeArched(stone, soffit, roof, P130, ZR, [ped[1]], Q.detail ? 6 : 3)
  for (const r of [P128, P129, P124]) extrude(stone, r, 0, ZR, roof)
  extrude(stone, P125, 0, S + 6.0, null)
  extrude(trim, P125, S + 6.0, S + 6.6, roof)

  // ===== Balustrade: a real parapet round the outline ======================
  if (Q.detail) {
    // Detail: plinth, balusters with real gaps, top rail.
    const inner = insetRing(OUTER, 0.45)
    const band = (z0: number, z1: number) => {
      extrude(trim, OUTER, z0, z1, null)
      const rin = [...inner].reverse()
      for (let i = 0; i < rin.length; i++) { const a = rin[i], b = rin[(i + 1) % rin.length]; trim.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]) }
      for (let i = 0; i < OUTER.length; i++) {
        const a = OUTER[i], b = OUTER[(i + 1) % OUTER.length], c = inner[(i + 1) % OUTER.length], d = inner[i]
        trim.quad([a[0], a[1], z1], [b[0], b[1], z1], [c[0], c[1], z1], [d[0], d[1], z1])
        trim.quad([a[0], a[1], z0], [d[0], d[1], z0], [c[0], c[1], z0], [b[0], b[1], z0])
      }
    }
    band(ZR, ZR + 0.25); band(ZB - 0.22, ZB)
    for (let i = 0; i < OUTER.length; i++) {
      const a = OUTER[i], b = OUTER[(i + 1) % OUTER.length], c = inner[(i + 1) % OUTER.length], d = inner[i]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.floor(L / 0.5)
      for (let k = 0; k < n; k++) {
        const t = (k + 0.5) / n
        const px = (a[0] + (b[0] - a[0]) * t + d[0] + (c[0] - d[0]) * t) / 2, py = (a[1] + (b[1] - a[1]) * t + d[1] + (c[1] - d[1]) * t) / 2
        lathe(trim, [[0.1, ZR + 0.25], [0.15, ZR + 0.45], [0.08, ZB - 0.35], [0.11, ZB - 0.22]], 5, px, py, false)
      }
    }
  } else {
    const inner = insetRing(OUTER, 0.45)
    extrude(trim, OUTER, ZR, ZB, null)
    const rin = [...inner].reverse()
    for (let i = 0; i < rin.length; i++) {
      const a = rin[i], b = rin[(i + 1) % rin.length]
      trim.quad([a[0], a[1], ZR], [b[0], b[1], ZR], [b[0], b[1], ZB], [a[0], a[1], ZB])
    }
    for (let i = 0; i < OUTER.length; i++) {
      const a = OUTER[i], b = OUTER[(i + 1) % OUTER.length], c = inner[(i + 1) % OUTER.length], d = inner[i]
      trim.quad([a[0], a[1], ZB], [b[0], b[1], ZB], [c[0], c[1], ZB], [d[0], d[1], ZB])
    }
  }

  // ===== Facades along the outline =========================================
  const inCentre = (x: number) => x > -16.4 && x < 6.0
  const inArch = (x: number, w = 0.3) => [...road, ...ped].some((a) => x > a.x0 - w && x < a.x1 + w)
  for (let i = 0; i < OUTER.length; i++) {
    const a = OUTER[i], b = OUTER[(i + 1) % OUTER.length]
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy)
    if (L < 1.6) continue
    const ux = dx / L, uy = dy / L, nx = uy, ny = -ux
    const P = (s: number, z: number, d: number): V3 => [a[0] + ux * s + nx * d, a[1] + uy * s + ny * d, z]
    const panel = (part: Part, s0: number, s1: number, z0: number, z1: number, d: number) => face(part, P(s0, z0, d), P(s1, z0, d), P(s1, z1, d), P(s0, z1, d), P((s0 + s1) / 2, (z0 + z1) / 2, -1))
    const proudBand = (part: Part, s0: number, s1: number, z0: number, z1: number, d: number) => {
      const ins = P((s0 + s1) / 2, (z0 + z1) / 2, -1)
      face(part, P(s0, z0, d), P(s1, z0, d), P(s1, z1, d), P(s0, z1, d), ins)
      face(part, P(s0, z1, 0), P(s1, z1, 0), P(s1, z1, d), P(s0, z1, d), P((s0 + s1) / 2, z1 - 1, 0))
      if (Q.detail) face(part, P(s0, z0, 0), P(s1, z0, 0), P(s1, z0, d), P(s0, z0, d), P((s0 + s1) / 2, z0 + 1, 0))
      face(part, P(s0, z0, 0), P(s0, z0, d), P(s0, z1, d), P(s0, z1, 0), P(s0 + 1, (z0 + z1) / 2, 0))
      face(part, P(s1, z0, 0), P(s1, z0, d), P(s1, z1, d), P(s1, z1, 0), P(s1 - 1, (z0 + z1) / 2, 0))
    }
    // Bands: top of the rusticated base, entablature, cornice.
    // Bands stop at the arch openings they would cross.
    const runs = (z0: number): [number, number][] => {
      let out: [number, number][] = [[0, L]]
      for (const ar of [...road, ...ped]) {
        if (z0 > ar.zs + (ar.x1 - ar.x0) / 2 || Math.abs(ux) < 0.3) continue
        const sa = (ar.x0 - 0.35 - a[0]) / ux, sb = (ar.x1 + 0.35 - a[0]) / ux
        const lo = Math.min(sa, sb), hi = Math.max(sa, sb)
        out = out.flatMap(([p, q]): [number, number][] => hi <= p || lo >= q ? [[p, q]] : [...(lo > p ? [[p, lo]] as [number, number][] : []), ...(hi < q ? [[hi, q]] as [number, number][] : [])])
      }
      return out.filter(([p, q]) => q - p > 0.2)
    }
    if (Q.detail || L > 3) {
      for (const [p, q] of runs(S + 5.3)) proudBand(trim, p, q, S + 5.3, S + 5.7, 0.15)
      for (const [p, q] of runs(S + 12.6)) proudBand(trim, p, q, S + 12.6, S + 14.2, 0.35)
      proudBand(trim, 0, L, S + 17.0, ZR, 0.5)
    }
    // Bays.
    const nb = Math.max(1, Math.floor(L / 3.6)), pitch = L / nb
    for (let k = 0; k < nb; k++) {
      const s = (k + 0.5) * pitch, mx = a[0] + ux * s
      const centre = inCentre(mx) && Math.abs(ux) > 0.5
      if (!centre && !inArch(mx, 1.0)) {
        panel(win, s - 0.75, s + 0.75, S + 1.3, S + 4.2, 0.04) // ground floor
        panel(win, s - 0.8, s + 0.8, S + 6.6, S + 12.0, 0.04) // two storeys, grouped
      }
      if (!centre) {
        // Giant pilasters between bays.
        if (L > 5 && k > 0 && (Q.detail || k % 2 === 0)) proudBand(stone, k * pitch - 0.35, k * pitch + 0.35, S + 5.7, S + 12.6, 0.22)
      }
      panel(win, s - 0.65, s + 0.65, S + 14.7, S + 16.6, 0.04) // top storey
    }
  }

  // ===== Giant columns at the road arches, on both fronts ==================
  const faceY = (x: number, side: 1 | -1) => {
    // The outline's y where the vertical line x meets it, nearest the centre on this side.
    let best: number | null = null
    for (let i = 0; i < OUTER.length; i++) {
      const a = OUTER[i], b = OUTER[(i + 1) % OUTER.length]
      if ((a[0] - x) * (b[0] - x) > 0 || a[0] === b[0]) continue
      const y = a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0])
      if (side > 0 ? y > -2 && (best === null || y < best) : y < -2 && (best === null || y > best)) best = y
    }
    return best ?? 0
  }
  for (const x of [-17.6, -9.5, -2.2, 5.85]) for (const side of [-1, 1] as const) {
    const y = faceY(x, side) + side * 0.75
    cbox(stone, x - 0.85, y - 0.85, x + 0.85, y + 0.85, 0, S + 0.9, Q.detail ? 0.12 : 0)
    lathe(stone, [[0.66, S + 0.9], [0.6, S + 11.2]], Q.detail ? 14 : 7, x, y, false)
    lathe(trim, [[0.6, S + 11.2], [0.82, S + 12.3]], Q.detail ? 14 : 7, x, y, false)
    cbox(trim, x - 0.9, y - 0.9, x + 0.9, y + 0.9, S + 12.3, S + 12.6, 0)
  }
  // Rusticated voussoirs and keystones round the road arches (both fronts).
  for (const ar of [...road, ...ped]) for (const side of [-1, 1] as const) {
    const xc = (ar.x0 + ar.x1) / 2, r = (ar.x1 - ar.x0) / 2, y = faceY(xc, side)
    const n = Q.detail ? 9 : 5
    for (let k = 0; k < n; k++) {
      const t0 = Math.PI * k / n, t1 = Math.PI * (k + 1) / n
      const A = (t: number, rr: number, d: number): V3 => [xc + rr * Math.cos(t), y + side * d, ar.zs + rr * Math.sin(t)]
      face(trim, A(t0, r, 0.12), A(t1, r, 0.12), A(t1, r + 0.55, 0.12), A(t0, r + 0.55, 0.12), [xc, y - side * 2, ar.zs])
    }
    cbox(trim, xc - 0.4, side > 0 ? y : y - 0.3, xc + 0.4, side > 0 ? y + 0.3 : y, ar.zs + r - 0.1, ar.zs + r + 1.0, 0)
  }

  // ===== Central attic with the inscription, and its flanking blocks =======
  {
    const at = insetRing(clipX(P131, -14.4, 2.7), 0.7)
    extrude(stone, at, ZR, S + 22.6, null)
    extrude(trim, insetRing(clipX(P131, -14.4, 2.7), 0.55), S + 22.6, S + 23.2, roof)
    // The inscription band (lettering not drawn): a lighter recessed panel on both fronts.
    for (const side of [-1, 1] as const) for (let x = -13.2; x < 1.6; x += 2.95) {
      const y0 = faceY(x, side) - side * 0.62, y1 = faceY(x + 2.95, side) - side * 0.62
      face(trim, [x, y0, S + 19.9], [x + 2.95, y1, S + 19.9], [x + 2.95, y1, S + 21.9], [x, y0, S + 21.9], [x + 1.5, 0, S + 21])
    }
    for (const [x0, x1] of [[-19.4, -14.4], [2.7, 7.6]]) {
      const blk = insetRing(clipX(OUTER, x0, x1), 0.5)
      extrude(stone, blk, ZR, S + 23.6, null)
      extrude(trim, insetRing(clipX(OUTER, x0, x1), 0.35), S + 23.6, S + 24.2, roof)
      // A roundel on each block's fronts.
      if (Q.detail) for (const side of [-1, 1] as const) {
        const xc = (x0 + x1) / 2, y = faceY(xc, side) - side * 0.48
        place(trim, [xc, y, S + 21.0], side > 0 ? 0 : Math.PI, 1, (q) => { lathe(q, [[0.9, 0], [0.9, 0.12], [0.6, 0.25]], 12, 0, 0, true) }, 50, Math.PI / 2)
      }
    }
  }

  // ===== End pavilions on the Mall: pediments, statues ====================
  for (const [a, b] of [[[-35.3, -25.8], [-29.8, -25.9]], [[19.2, -25.9], [25.4, -25.8]]] as [XY, XY][]) {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, h = 2.4, z0 = ZB
    const A: V3 = [a[0] - 0.2, a[1] - 0.3, z0], B: V3 = [b[0] + 0.2, b[1] - 0.3, z0], C: V3 = [mx, my - 0.3, z0 + h]
    const A2: V3 = [a[0] - 0.2, a[1] + 1.4, z0], B2: V3 = [b[0] + 0.2, b[1] + 1.4, z0], C2: V3 = [mx, my + 1.4, z0 + h]
    tri(stone, A, B, C, [mx, my + 0.5, z0 + 0.5])
    tri(stone, A2, C2, B2, [mx, my + 0.5, z0 + 0.5])
    face(trim, A, C, C2, A2, [mx + 1, my + 0.5, z0])
    face(trim, C, B, B2, C2, [mx - 1, my + 0.5, z0])
    // The seated statue before each pavilion, on its pedestal.
    const sx = mx < 0 ? 1 : -1
    cbox(stone, mx + sx * 4.2 - 1.0, my - 3.0, mx + sx * 4.2 + 1.0, my - 1.2, 0, S + 2.4, Q.detail ? 0.12 : 0)
    place(stone, [mx + sx * 4.2, my - 2.0, S + 2.4], Math.PI, 1, (q) => figure(q, Q, 3.0, { seated: true, arms: [[[0.14, 0, 0.7], [0.24, 0.15, 0.55], [0.15, 0.3, 0.5]], [[-0.14, 0, 0.7], [-0.25, 0.1, 0.6], [-0.2, 0.2, 0.75]]] }))
  }
  // Passage linings: the side walls of every passage in the shaded soffit tone.
  for (const ar of [...road, ...ped]) for (const x of [ar.x0 + 0.01, ar.x1 - 0.01]) {
    const ya = faceY(x, -1), yb = faceY(x, 1), inn = x < (ar.x0 + ar.x1) / 2 ? x + 1 : x - 1
    for (let y = ya; y < yb - 0.01; y += 5) {
      const y1 = Math.min(yb, y + 5)
      face(soffit, [x, y, 0], [x, y1, 0], [x, y1, ar.zs], [x, y, ar.zs], [x + (x - inn), (y + y1) / 2, ar.zs / 2])
    }
  }
  // Gates in the road arches, set back inside the passages.
  for (const ar of road) {
    const xc = (ar.x0 + ar.x1) / 2, r = (ar.x1 - ar.x0) / 2, y = faceY(xc, -1) + 2.5
    const nb = Q.detail ? 14 : 6
    for (let k = 0; k <= nb; k++) {
      const x = ar.x0 + 0.1 + (ar.x1 - ar.x0 - 0.2) * k / nb
      const top = ar.zs + Math.sqrt(Math.max(0, r * r - (x - xc) * (x - xc))) - 0.25
      cbox(dark, x - 0.03, y - 0.03, x + 0.03, y + 0.03, S, top, 0)
    }
    for (const z of [S + 0.3, S + 3.5, ar.zs]) cbox(dark, ar.x0, y - 0.06, ar.x1, y + 0.06, z, z + 0.12, 0)
  }
  return { stone, trim, win, roof, dark, soffit }
}

function write(Q: Q, file: string, maxTris: number) {
  const { stone, trim, win, roof, dark, soffit } = build(Q)
  const lit = (p: V3, n: V3) => (n[2] > 0.95 ? 0.25 : Math.min(1, 0.4 + (p[2] - S) / 25))
  writeModel('Admiralty Arch', 'london-admiralty-arch', [
    { part: stone, material: { ...mat('portland-stone', 0xece3d2), floodlight: lit } },
    { part: trim, material: { ...mat('trim', 0xfff0dd), floodlight: lit } },
    { part: win, material: mat('window', 0x64798a, 0.35) },
    { part: roof, material: mat('roof', 0x9da6ad) },
    { part: dark, material: mat('admiralty-arch-gates', 0x4a4f4c, 0.5) },
    { part: soffit, material: mat('admiralty-arch-soffit', 0x857d70) },
  ], { bearing: BEARING, osm: 'relation/17074208', height: S + 24.2 }, maxTris, file)
}

function mat(name: string, color: number, roughness = 0.85): MaterialSpec {
  return { name, color, roughness }
}

if (import.meta.main) {
  write(LOW, 'london-admiralty-arch', 6500)
  write(HIGH, 'london-admiralty-arch.detail', 40000)
}
