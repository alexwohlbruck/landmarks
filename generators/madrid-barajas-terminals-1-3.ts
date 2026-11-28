/**
 * Madrid-Barajas Terminals 1, 2 and 3: the older linear terminal complex on
 * the airport's west side (T2, the former national terminal, from 1954 with
 * its 1950s control tower; T1, the former international terminal of the
 * 1970s, enlarged for 1982, with the South Dock of 1999; T3, the North Dock
 * of 1997) — procedural, CC0-1.0, no textures.
 * bun generators/madrid-barajas-terminals-1-3.ts
 *
 * Writes models/madrid-barajas-terminals-1-3.glb (low) and .detail.glb.
 *
 * A 1.5 km chain of low flat-roofed buildings bending round the landside
 * roads: from the North Dock (T3) south past the junction block, along T2's
 * curve with the old cream control tower on its airside block, then T1's
 * long curved body with the green glass canopy over its kerb, and out along
 * the connector to the South Dock's long pier, whose middle rises in a
 * shallow vault.
 *
 * Frame: origin -3.5700, 40.4680, x east, y north, bearing 0; the anchor is
 * this origin (near the middle of the chain; the outline's centroid is not
 * on the building).
 *
 * Evidence
 * - OSM: way/23704582 (Terminal 3, 2 levels), relation/2106537 (Terminal 2,
 *   2 levels; outer way/23704600, courtyards way/157539249 and
 *   way/157539253), way/23704583 (Terminal 1, 2 levels, the South Dock
 *   included). No heights. Gate nodes A1–E83 give the stands (the fixed
 *   links are drawn there, short and simple). The covered walkways and the
 *   courtyard canopy mapped as building=roof (way/157541250, 1443511327,
 *   157541255, 1443511328, 1512584615) are left to the map.
 * - PNOA orthophoto (IGN, CC BY 4.0): the plan of every block, the flat
 *   light grey roofs, T1's green glass canopy strip along the kerb (x ≈ −45
 *   to −15, y −560 to −290), the South Dock's raised middle (a vault about
 *   20 m wide along its axis), the jet bridges.
 * - Published: T2 built from 1954; T1 begun in the 1970s, enlarged for the
 *   1982 World Cup; South Dock 1999; North Dock (T3) 1997 (es/en Wikipedia,
 *   "Aeropuerto Adolfo Suárez Madrid-Barajas").
 * - Photos (EVIDENCE):
 *   https://commons.wikimedia.org/wiki/File:Aeropuerto_de_Madrid-Barajas_-_Exterior_02.jpg
 *     (jsmjr, CC BY-SA 2.0): T2's airside block from the east: the cream
 *     fascia lettered AEROPUERTO DE MADRID BARAJAS, the glazed band, the
 *     maroon base band with pale stripes, the old tower over it; heights
 *     scaled from the buses (3.2 m);
 *   https://www.flickr.com/photos/10226584@N06/4324356337 (slasher-fun,
 *     CC BY-SA 2.0): the old tower close: cream shaft, dark glazed slot,
 *     white top storey, octagonal cab, and the cream block beside it;
 *   https://commons.wikimedia.org/wiki/File:Aeropuerto_de_Madrid-Barajas02.jpg
 *     (Carlos Delgado, CC BY-SA 3.0): the same block from the apron;
 *   https://commons.wikimedia.org/wiki/File:Barajas-torre-tierra.jpg (FDV,
 *     CC BY-SA 3.0): T2 airside from the north-east at dusk, the long cream
 *     office block behind the tower;
 *   https://commons.wikimedia.org/wiki/File:Taxis_en_el_terminal_3_de_Barajas,_Madrid,_Espa%C3%B1a.jpg
 *     (Diego Delso, CC BY-SA 3.0): T3's landside: pale grey cladding and
 *     glass, flat roofs;
 *   https://commons.wikimedia.org/wiki/File:T-1_BARAJAS,MADRID.SPAIN_-_panoramio.jpg
 *     (Kayhan Ertugrul, CC BY-SA 3.0): T1 airside at gate 71, grey cladding;
 *   https://commons.wikimedia.org/wiki/File:T3-Barajas-Airside.jpg (FDV,
 *     CC BY-SA 4.0): the airside with the old tower in the distance;
 *   https://commons.wikimedia.org/wiki/File:Barajas_T1_dique_sur.jpg (Daniel
 *     Lobo, CC BY 2.0): inside the South Dock: the arched roof trusses.
 * - Terrain: Mapterhorn rises about 6 m from the airside west to the
 *   landside along T1 (read with tools/terrain.ts); walls run to y = 0.
 *
 * Numbers (estimated): T3 pier 13 m, its head 17 m; T2 main body 13 m, its
 * landside curve 12 m, the airside block 20 m (maroon base to 4.5 m, glazed
 * to 15 m, cream fascia to 20 m, scaled from the buses in Delgado's photo);
 * the old tower's shaft 10 × 10 m to 31 m, a white top storey to 33.4 m, the
 * octagonal cab 10–11 m across to 39.2 m, mast 42.5 m, the cream office
 * block beside it 34 × 10.5 m to 27 m; T1 body 16 m; its green glass kerb canopy 24 m deep at 10.5 m on posts,
 * outside the outline over the road (PNOA); connector 11 m; the South
 * Dock's pier 46 m wide, 15 m, with a 20 m wide vault rising 4.5 m along
 * its axis, its landside wing 9 m; fixed links 16 m at
 * the gates. Every height is a photo estimate or invented by analogy.
 * Doubts: no published heights; the blocks' heights are estimates; T1's and
 * T3's facades are only lightly photographed; the inner roofs and plant are
 * left out; some of the complex's courtyards are simplified.
 */
import clipping from 'polygon-clipping'
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, quadN, unit } from './nyc-570-lexington'
import { writeLod } from './tokyo-haneda-terminal-1'
import { polyTris } from './berlin-oberbaum-bridge'
import { beam3 } from './madrid-barajas-terminal-4'

const COL = {
  roof: finish('mad-old-roof', 0xd6d8d6),
  wall: finish('mad-old-cladding', 0xd2d3cf),
  cream: finish('mad-t2-cream', 0xeadcbf),
  maroon: finish('mad-t2-maroon', 0xb6625c),
  window: { name: 'window', color: 0x8193a3, roughness: 0.35 } as MaterialSpec,
  glass: { ...PALETTE.glass, color: 0xa6c9be } as MaterialSpec,
}

const T3: XY[] = [[-137.3,279.1],[-130.9,327.2],[-118.3,325.5],[-112.2,368.8],[-110.6,381.9],[-107.7,401.7],[-105.9,414.3],[-82.3,579.5],[-73.1,578.7],[-60.8,554.1],[-55.6,537.7],[-54.4,522.8],[-73.0,389.8],[-75.8,369.7],[-77.9,354.5],[-79.7,341.5],[-52.8,337.7],[-7.3,281.4],[-25.7,261.4],[-29.9,266.8],[-44.6,260.7],[-45.3,262.5],[-62.8,265.0],[-70.6,208.5],[-65.9,206.1],[-67.5,192.8],[-88.2,195.6],[-86.3,209.4],[-80.6,209.8],[-76.3,240.8],[-75.8,244.3],[-74.6,252.4],[-72.5,266.6],[-120.3,273.2],[-137.7,275.7]]
const T1: XY[] = [[-178.7,-605.6],[-163.5,-592.4],[-166.7,-589.1],[-128.1,-555.2],[-123.3,-559.7],[-108.1,-544.5],[-104.8,-540.4],[-99.3,-534.2],[-82.9,-514.0],[-70.3,-495.8],[-58.9,-476.3],[-50.7,-461.9],[-45.4,-450.3],[-41.5,-441.5],[-37.5,-429.4],[-28.3,-404.1],[-26.1,-395.9],[-22.8,-383.6],[-18.2,-358.0],[-16.3,-347.0],[-15.8,-341.3],[-14.1,-325.3],[-15.2,-272.1],[53.9,-273.1],[53.7,-281.5],[99.3,-295.3],[99.7,-310.2],[69.9,-321.9],[68.0,-347.3],[66.8,-362.9],[93.4,-375.5],[91.0,-391.1],[61.1,-396.6],[55.9,-414.9],[49.8,-436.4],[74.2,-454.1],[69.4,-469.2],[42.3,-529.0],[34.5,-542.4],[4.5,-535.4],[-21.4,-570.8],[-3.7,-596.6],[-13.2,-607.5],[-41.9,-595.6],[-73.2,-628.0],[-60.6,-655.0],[-71.6,-664.9],[-97.0,-649.2],[-110.7,-661.0],[-120.5,-648.7],[-133.3,-660.1],[-158.1,-680.1],[-197.3,-634.6],[-331.2,-693.6],[-554.5,-918.4],[-572.5,-900.3],[-578.9,-893.9],[-550.8,-865.9],[-578.5,-838.0],[-484.6,-743.0],[-406.8,-664.4],[-377.8,-691.6],[-356.7,-670.2],[-340.3,-685.8],[-335.8,-684.5],[-173.2,-612.6]]
const T2_OUT: XY[] = [[-7.3,281.4],[131.1,106.4],[141.3,80.4],[144.2,51.5],[136.9,-40.2],[128.9,-66.9],[114.4,-89.2],[70.1,-132.5],[69.9,-149.1],[69.7,-158.3],[68.1,-273.1],[53.9,-273.1],[-15.2,-272.1],[-15.6,-263.0],[-18.5,-197.9],[-19.2,-195.6],[-4.6,-142.6],[52.0,-86.2],[48.1,-82.9],[39.5,-73.8],[32.3,-66.3],[-6.2,-106.2],[-22.9,-90.6],[15.7,-51.3],[9.0,-45.3],[17.9,-29.3],[23.7,-16.6],[27.6,-1.6],[29.5,11.5],[30.2,21.0],[31.0,39.5],[29.0,56.4],[25.8,69.9],[20.1,83.4],[11.4,99.6],[-18.3,136.3],[-10.7,142.3],[-5.6,146.7],[-8.3,150.5],[1.0,160.5],[12.1,159.5],[14.0,156.8],[16.8,158.5],[21.2,162.0],[25.2,165.1],[28.2,167.6],[-44.6,260.7],[-29.9,266.8],[-25.7,261.4]]
const T2_HOLES: XY[][] = [
  [[67.1,128.5],[60.8,123.4],[56.0,119.5],[51.6,116.0],[42.3,108.4],[51.4,91.5],[56.9,74.6],[58.5,66.0],[60.2,57.1],[61.2,48.2],[61.9,32.0],[70.4,31.5],[87.4,30.6],[92.7,30.4],[94.1,56.1],[100.2,60.2],[100.5,71.4],[94.6,92.2],[79.8,112.0]],
  [[60.3,6.4],[68.9,5.9],[86.1,5.0],[91.1,4.7],[89.3,-20.5],[95.0,-25.3],[94.6,-33.6],[95.6,-33.9],[93.7,-39.6],[91.6,-45.3],[87.1,-55.2],[83.8,-60.1],[80.2,-64.7],[67.9,-77.4],[61.1,-70.2],[52.2,-61.2],[49.1,-58.2],[43.8,-52.7],[49.4,-41.8],[51.9,-36.0],[54.1,-30.7],[56.5,-23.4],[58.3,-17.0],[60.5,-7.9],[57.9,-7.6]],
]
/** The gate nodes (stands), from OSM. */
const GATES: XY[] = [[-77.6,581.2],[-90.4,554.8],[-57.1,553.2],[-52.6,533.8],[-98.5,497.3],[-55.8,492.9],[-62.4,443.5],[-106.9,438.0],[-69.0,394.3],[-113.9,388.5],[-83.2,347.9],[-0.7,282.3],[13.5,262.4],[52.2,212.6],[85.9,169.2],[120.5,128.0],[138.8,96.8],[142.9,72.4],[139.2,-41.7],[109.6,-97.3],[69.1,-165.6],[68.6,-224.4],[95.5,-301.8],[88.4,-381.3],[68.1,-459.2],[32.6,-533.9],[-11.1,-599.5],[-69.0,-656.1],[-348.4,-719.2],[-375.4,-727.9],[-387.8,-740.5],[-397.2,-768.7],[-446.7,-819.0],[-496.0,-869.0],[-544.2,-918.1]]

type Band = { z0: number; z1: number; mat: 'window' | 'maroon' | 'cream' }
type Zone = { region: XY[]; h: number; wall: 'wall' | 'cream'; roof: 'roof' | 'glass'; bands: Band[] }

const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const BIG = 5000
/** T1's kerb canopy: a 15 m band inside the curved west edge. */
const T1_KERB_EDGE: XY[] = [[-15.2,-272.1],[-14.1,-325.3],[-15.8,-341.3],[-18.2,-358.0],[-22.8,-383.6],[-28.3,-404.1],[-37.5,-429.4],[-45.4,-450.3],[-58.9,-476.3],[-70.3,-495.8],[-82.9,-514.0],[-99.3,-534.2],[-108.1,-544.5],[-123.3,-559.7]]
function offsetLine(pts: XY[], d: number): XY[] {
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]
    const t = unit([b[0] - a[0], b[1] - a[1], 0])
    return [p[0] + t[1] * d, p[1] - t[0] * d] as XY
  })
}
/** The canopy runs over the kerb road, outside the building's outline (PNOA): from the wall 24 m out. */
const kerbOuter = offsetLine(T1_KERB_EDGE, 24), kerbInner = offsetLine(T1_KERB_EDGE, 0.3)
const KERB: XY[] = [...kerbOuter, ...kerbInner.slice().reverse()]
/** The South Dock's pier proper: 46 m wide from its north-east (airside) wall. */
const DOCK_PIER: XY[] = [[-575.7, -939.7], [-310.0, -672.3], [-342.6, -639.9], [-608.3, -907.3]]

const WIN = (h: number): Band[] => [{ z0: 3.2, z1: h - 2.6, mat: 'window' }]

function zonesFor(name: 'T1' | 'T2' | 'T3'): Zone[] {
  if (name === 'T3') return [
    { region: rect(-BIG, 340, BIG, BIG), h: 13, wall: 'wall', roof: 'roof', bands: WIN(13) },
    { region: rect(-BIG, -BIG, BIG, 340), h: 17, wall: 'wall', roof: 'roof', bands: WIN(17) },
  ]
  if (name === 'T2') {
    const air = rect(95, -3, 150, 51)
    return [
      { region: air, h: 20, wall: 'cream', roof: 'roof', bands: [{ z0: 0.3, z1: 4.5, mat: 'maroon' }, { z0: 6.0, z1: 14.5, mat: 'window' }] },
      { region: [[-60, -300], [38, -300], [38, 165], [-60, 290]], h: 12, wall: 'wall', roof: 'roof', bands: WIN(12) },
      { region: [[38, -300], [BIG, -300], [BIG, BIG], [-60, BIG], [-60, 290], [38, 165]], h: 13, wall: 'wall', roof: 'roof', bands: [{ z0: 0.3, z1: 4.0, mat: 'maroon' }, { z0: 4.6, z1: 11.0, mat: 'window' }] },
    ]
  }
  return [
    { region: DOCK_PIER, h: 15, wall: 'wall', roof: 'roof', bands: WIN(15) },
    { region: rect(-BIG, -BIG, -330, BIG), h: 9, wall: 'wall', roof: 'roof', bands: WIN(9) },
    { region: rect(-330, -BIG, -175, BIG), h: 11, wall: 'wall', roof: 'roof', bands: WIN(11) },
    { region: rect(-175, -BIG, BIG, BIG), h: 16, wall: 'wall', roof: 'roof', bands: WIN(16) },
  ]
}

const close = (r: XY[]) => [...r, r[0]].map(([a, b]) => [a, b] as [number, number])
const area2 = (r: XY[]) => { let s = 0; for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; s += a[0] * b[1] - b[0] * a[1] } return s / 2 }

function build(detail: boolean) {
  const P = { roof: new Part(), wall: new Part(), cream: new Part(), maroon: new Part(), window: new Part(), glass: new Part() }
  const pieces: { ring: XY[]; holes: XY[][]; z: Zone }[] = []
  const shapes: [string, XY[], XY[][]][] = [['T3', T3, []], ['T2', T2_OUT, T2_HOLES], ['T1', T1, []]]
  for (const [name, out, holes] of shapes) {
    let rest: any = [[close(out), ...holes.map(close)]]
    for (const z of zonesFor(name as any)) {
      const got = clipping.intersection(rest, [close(z.region)])
      rest = clipping.difference(rest, [close(z.region)])
      for (const poly of got) pieces.push({ ring: poly[0].slice(0, -1) as XY[], holes: poly.slice(1).map((h) => h.slice(0, -1) as XY[]), z })
    }
  }
  for (const { ring, holes, z } of pieces) {
    const wallP = z.wall === 'cream' ? P.cream : P.wall
    const rings = [area2(ring) > 0 ? ring : ring.slice().reverse(), ...holes.map((h) => (area2(h) < 0 ? h : h.slice().reverse()))]
    for (const r of rings) for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.05) continue
      const n: V3 = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 0]
      quadN(wallP, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], z.h], [a[0], a[1], z.h], [n, n, n, n])
      if (L < 2.5) continue
      for (const bd of z.bands) {
        const o = 0.06, part = P[bd.mat]
        const A: XY = [a[0] + n[0] * o, a[1] + n[1] * o], B: XY = [b[0] + n[0] * o, b[1] + n[1] * o]
        quadN(part, [A[0], A[1], bd.z0], [B[0], B[1], bd.z0], [B[0], B[1], bd.z1], [A[0], A[1], bd.z1], [n, n, n, n])
      }
    }
    // a parapet lip round each flat roof
    if (z.roof === 'roof') for (const r of rings) for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.05) continue
      const n: V3 = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 0], up: V3 = [0, 0, 1], t = 0.5
      const A2: XY = [a[0] - n[0] * t, a[1] - n[1] * t], B2: XY = [b[0] - n[0] * t, b[1] - n[1] * t]
      quadN(wallP, [a[0], a[1], z.h], [b[0], b[1], z.h], [b[0], b[1], z.h + 0.9], [a[0], a[1], z.h + 0.9], [n, n, n, n])
      quadN(wallP, [a[0], a[1], z.h + 0.9], [b[0], b[1], z.h + 0.9], [B2[0], B2[1], z.h + 0.9], [A2[0], A2[1], z.h + 0.9], [up, up, up, up])
      const ni: V3 = [-n[0], -n[1], 0]
      quadN(wallP, [B2[0], B2[1], z.h], [A2[0], A2[1], z.h], [A2[0], A2[1], z.h + 0.9], [B2[0], B2[1], z.h + 0.9], [ni, ni, ni, ni])
    }
    const roofP = z.roof === 'glass' ? P.glass : P.roof
    const up: V3 = [0, 0, 1]
    for (const [a, b, c] of polyTris(rings[0], rings.slice(1))) roofP.tri([a[0], a[1], z.h], [b[0], b[1], z.h], [c[0], c[1], z.h], undefined, undefined, undefined, [up, up, up])
  }

  // the South Dock's vault along its axis
  {
    const A: XY = [-552.5, -892], B: XY = [-353, -692] // axis ends (middle of the dock's width, PNOA)
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], v: XY = [-u[1], u[0]]
    const W = 20, rise = 4.5, z0 = 15, n = detail ? 12 : 6
    const at = (s: number, t: number, z: number): V3 => [A[0] + u[0] * s + v[0] * t, A[1] + u[1] * s + v[1] * t, z]
    const prof = Array.from({ length: n + 1 }, (_, i) => { const a = Math.PI * (i / n); return [-(W / 2) * Math.cos(a), z0 + rise * Math.sin(a)] as [number, number] })
    for (let i = 0; i < n; i++) {
      const [t0, za] = prof[i], [t1, zb] = prof[i + 1]
      const na = unit([v[0] * (t0 / (W / 2)) * rise, v[1] * (t0 / (W / 2)) * rise, (W / 2) * Math.sin(Math.PI * (i / n)) + 0.5])
      const nb = unit([v[0] * (t1 / (W / 2)) * rise, v[1] * (t1 / (W / 2)) * rise, (W / 2) * Math.sin(Math.PI * ((i + 1) / n)) + 0.5])
      quadN(P.roof, at(0, t0, za), at(L, t0, za), at(L, t1, zb), at(0, t1, zb), [na, na, nb, nb])
      // the glazed ends
      for (const [s, sg] of [[0, -1], [L, 1]] as [number, number][]) {
        const ne: V3 = [u[0] * sg, u[1] * sg, 0]
        P.window.tri(at(s, 0, z0), at(s, t0, za), at(s, t1, zb), undefined, undefined, undefined, [ne, ne, ne])
      }
    }
    // ribs (detail): the trusses' lines on the vault
    if (detail) for (let s = 12; s < L - 6; s += 12) for (let i = 0; i < n; i++) {
      const [t0, za] = prof[i], [t1, zb] = prof[i + 1]
      beam3(P.wall, at(s, t0, za + 0.15), at(s, t1, zb + 0.15), 0.35)
    }
  }

  // T1's kerb canopy: a green glass roof on posts over the road along the curved landside wall
  {
    const z = 10.5, up: V3 = [0, 0, 1], dn: V3 = [0, 0, -1]
    for (let i = 0; i < T1_KERB_EDGE.length - 1; i++) {
      const a = kerbInner[i], b = kerbInner[i + 1], c = kerbOuter[i + 1], d = kerbOuter[i]
      quadN(P.glass, [a[0], a[1], z], [d[0], d[1], z], [c[0], c[1], z], [b[0], b[1], z], [up, up, up, up])
      quadN(P.wall, [a[0], a[1], z - 0.7], [b[0], b[1], z - 0.7], [c[0], c[1], z - 0.7], [d[0], d[1], z - 0.7], [dn, dn, dn, dn])
      // the edge beam along the outer side
      const L = Math.hypot(c[0] - d[0], c[1] - d[1]), n: V3 = [-(c[1] - d[1]) / L, (c[0] - d[0]) / L, 0]
      quadN(P.wall, [c[0], c[1], z - 0.7], [d[0], d[1], z - 0.7], [d[0], d[1], z + 0.15], [c[0], c[1], z + 0.15], [n, n, n, n])
    }
    // posts every other vertex along the outer edge
    for (let i = 0; i < T1_KERB_EDGE.length; i += 2) { const q = offsetLine(T1_KERB_EDGE, 21)[i]; beam3(P.wall, [q[0], q[1], 0], [q[0], q[1], z - 0.7], 0.8, false) }
  }

  // T2's old control tower on the airside block: a cream shaft with a dark glazed slot down its airside face,
  // a cream shoulder block beside it, a white top storey with a row of windows, the octagonal cab
  {
    const cx = 120, cy = 25
    const box = (p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top = true) => {
      const c: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
      for (let i = 0; i < 4; i++) { const a = c[i], b = c[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1]); const nn: V3 = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 0]; quadN(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [nn, nn, nn, nn]) }
      if (top) { const up: V3 = [0, 0, 1]; quadN(p, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [up, up, up, up]) }
    }
    const face = (p: Part, x: number, y0: number, y1: number, z0: number, z1: number, sg: number) => {
      const nn: V3 = [sg, 0, 0], xx = x + sg * 0.06
      if (sg > 0) quadN(p, [xx, y0, z0], [xx, y1, z0], [xx, y1, z1], [xx, y0, z1], [nn, nn, nn, nn]); else quadN(p, [xx, y1, z0], [xx, y0, z0], [xx, y0, z1], [xx, y1, z1], [nn, nn, nn, nn])
    }
    // the shoulder block (south of the shaft)
    box(P.cream, cx - 30, cy - 15, cx + 4, cy - 4.5, 19.5, 27)
    face(P.window, cx + 4, cy - 13.5, cy - 6, 21, 25.5, 1)
    for (const z of [21.2, 24.2]) { const nn: V3 = [0, -1, 0], yy = cy - 15.06; quadN(P.window, [cx - 28.5, yy, z], [cx + 2.5, yy, z], [cx + 2.5, yy, z + 2.2], [cx - 28.5, yy, z + 2.2], [nn, nn, nn, nn]) }
    // the shaft
    box(P.cream, cx - 5, cy - 5, cx + 5, cy + 5, 19.5, 31)
    face(P.window, cx + 5, cy - 2.4, cy + 2.4, 20.3, 28.2, 1)
    face(P.window, cx - 5, cy - 2.4, cy + 2.4, 26, 28.2, -1)
    // the white top storey and its row of windows
    box(P.roof, cx - 5.4, cy - 5.4, cx + 5.4, cy + 5.4, 31, 33.4)
    face(P.window, cx + 5.4, cy - 3.6, cy + 3.6, 31.6, 32.9, 1)
    face(P.window, cx - 5.4, cy - 3.6, cy + 3.6, 31.6, 32.9, -1)
    // gallery deck and the octagonal cab
    box(P.roof, cx - 6.4, cy - 6.4, cx + 6.4, cy + 6.4, 33.4, 34.0)
    const oct = (r: number, z: number): V3[] => Array.from({ length: 8 }, (_, i) => [cx + r * Math.cos(Math.PI / 8 + (i * Math.PI) / 4), cy + r * Math.sin(Math.PI / 8 + (i * Math.PI) / 4), z])
    const ringQ = (p: Part, lo: V3[], hi: V3[]) => { for (let i = 0; i < 8; i++) { const j = (i + 1) % 8; const m = unit([(lo[i][0] + lo[j][0]) / 2 - cx, (lo[i][1] + lo[j][1]) / 2 - cy, 0]); quadN(p, lo[i], lo[j], hi[j], hi[i], [m, m, m, m]) } }
    ringQ(P.wall, oct(4.6, 34.0), oct(4.6, 35.0))
    ringQ(P.window, oct(4.6, 35.0), oct(5.4, 38.2))
    ringQ(P.wall, oct(5.6, 38.2), oct(5.6, 39.2))
    const upc: V3 = [0, 0, 1], top = oct(5.6, 39.2)
    for (let i = 1; i < 7; i++) P.wall.tri(top[0], top[i], top[i + 1], undefined, undefined, undefined, [upc, upc, upc])
    beam3(P.wall, [cx, cy, 39.2], [cx, cy, 42.5], 0.5, true)
  }

  // fixed links at the gates: from the nearest wall outward
  const edges: [XY, XY][] = []
  for (const r of [T3, T2_OUT, T1]) { const rr = area2(r) > 0 ? r : r.slice().reverse(); for (let i = 0; i < rr.length; i++) edges.push([rr[i], rr[(i + 1) % rr.length]]) }
  for (const g of GATES) {
    let best: { d: number; p: XY; n: XY } | null = null
    for (const [a, b] of edges) {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 3) continue
      const t = Math.max(0, Math.min(1, ((g[0] - a[0]) * (b[0] - a[0]) + (g[1] - a[1]) * (b[1] - a[1])) / (L * L)))
      const p: XY = [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]
      const d = Math.hypot(g[0] - p[0], g[1] - p[1])
      if (!best || d < best.d) best = { d, p, n: [(b[1] - a[1]) / L, -(b[0] - a[0]) / L] }
    }
    if (!best) continue
    const { p, n } = best
    const q: XY = [p[0] + n[0] * 16, p[1] + n[1] * 16]
    beam3(P.wall, [p[0] - n[0] * 0.5, p[1] - n[1] * 0.5, 6.2], [q[0], q[1], 6.2], 3.2, true)
    beam3(P.wall, [q[0], q[1], 0], [q[0], q[1], 5.0], 0.9, false)
    if (detail) beam3(P.window, [p[0] + n[0] * 0.8, p[1] + n[1] * 0.8, 6.4], [q[0] - n[0] * 0.8, q[1] - n[1] * 0.8, 6.4], 3.3, false)
  }

  return [
    { part: P.roof, material: COL.roof },
    { part: P.wall, material: COL.wall },
    { part: P.cream, material: COL.cream },
    { part: P.maroon, material: COL.maroon },
    { part: P.window, material: COL.window },
    { part: P.glass, material: COL.glass },
  ]
}

if (import.meta.main) {
  const extras = { bearing: 0, osm: 'way/23704583', height: 42.5 }
  writeLod('Madrid-Barajas Terminals 1-3', 'madrid-barajas-terminals-1-3.glb', build(false), extras, 8000, 250_000)
  writeLod('Madrid-Barajas Terminals 1-3', 'madrid-barajas-terminals-1-3.detail.glb', build(true), extras, 40_000, 1_500_000)
}
