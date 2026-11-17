/**
 * Marina Bay Sands, Singapore: the hotel's three towers and the SkyPark.
 * Procedural, CC0-1.0.
 * bun generators/singapore-marina-bay-sands.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built from OSM's
 * coordinates about the three towers' centre. The towers and the SkyPark
 * run along an axis at bearing 22 (OSM's tower edges and the SkyPark's long
 * axis: 20-25); y = 0 is the ground (reclaimed land, flat; tools/terrain.ts
 * could not check it, as Mapterhorn has no z15 tiles here; elevation 0).
 *
 * Opened 2010 (Moshe Safdie). Three 55-storey slab towers, their broad glass
 * faces to the bay (west) and east; each is two legs, a straight eastern leg
 * and a western leg that splays out at the foot and curves in to join it
 * about 80 m up. Across their tops lies the 340 m SkyPark, a boat-shaped
 * hull whose north end cantilevers 67 m past the north tower (Wikipedia,
 * "Marina Bay Sands").
 *
 * OSM: the towers way/116801004, way/172307472 and way/172307471 (193 m,
 * 55 levels), the SkyPark way/116800998 (193-207 m), the hotel podia between
 * the towers way/827847308 (18 m) and way/827847309 (13 m). All replaced.
 * The Shoppes and the convention centre are separate and left to the map.
 *
 * Each tower's plan is OSM's outline in the towers' own axes (u along the
 * SkyPark, v to the east): ~48 m deep at the foot; along u OSM gives ~60 m,
 * but the view from the WNW ("Marina Bay Sands Singapore 2026 2.jpg",
 * scaled from the SkyPark's published 340 m) gives towers ~65 m wide with
 * ~36 m gaps, so they are drawn ~70 m wide, 5 m past OSM at each end.
 * From photos ("Hotel Marina Bay Sands, Marina Bay, Singapur, 2023-08-17,
 * DD 30.jpg", Diego Delso, CC BY-SA 4.0, from the north, the towers' ends;
 * "Cricket match and Marina Bay Sands Hotel in Singapore.jpg", Basile Morin,
 * CC BY-SA 4.0, and "Marina Bay Sands Singapore 2026 2.jpg", kallerna,
 * CC BY-SA 4.0, from the west):
 * - the eastern leg straight, ~11 m deep; the western leg ~12 m deep at the
 *   foot, splayed to the west edge of OSM's outline, curving in to meet the
 *   eastern leg by ~80 m; above that the tower is ~23 m deep to the top;
 * - the legs' ends pale grey concrete, their broad faces glass;
 * - the SkyPark's hull ~10 m deep under a flat deck at ~198 m, rising a
 *   little to its cantilevered north end; a white block on the deck over
 *   each end tower.
 * Estimated: the legs' depths and the curve, the hull's profile, the deck
 *   blocks, a faint floor line every 18 floors on the glass faces.
 * The deck: the infinity pool along its west edge over the two northern
 *   towers (~150 m), rows of trees down its east side, low pavilions and a
 *   pale parapet (photos; positions estimated). The glass faces carry a pale
 *   frame at each end and a mullion line every ~10 m; a glazed slot runs
 *   down each tower's end where its legs meet.
 * The legs are lofted from chamfered sections (1.3 m at every vertical
 *   edge); the western leg's curve in 5 m steps. The hull has a rounded
 *   section and sweeps ~2 m up toward its cantilevered north end. The podia
 *   carry rows of ridged glass skylights (estimated).
 * Left out: the hull's diamond grid, the observation deck's railing.
 *
 * Night: the towers' glass glows as windows; the hull is floodlit.
 *
 * Photos (Wikimedia Commons):
 * - "Hotel Marina Bay Sands, Marina Bay, Singapur, 2023-08-17, DD 30.jpg", Diego Delso, CC BY-SA 4.0
 * - "Cricket match and Marina Bay Sands Hotel in Singapore.jpg", Basile Morin, CC BY-SA 4.0
 * - "Marina Bay Sands Singapore 2026 2.jpg", kallerna, CC BY-SA 4.0
 * - "Singapore (SG), Marina Bay Sands Hotel -- 2019 -- 4535.jpg", Dietmar Rabich, CC BY-SA 4.0
 * - "2016 Singapur, Downtown Core, Marina Bay Sands (02).jpg", Marcin Konsek, CC BY-SA 4.0
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish, PALETTE, windowVariant } from './palette'
import { earcut, offset, type XY } from './sf-de-young'

const OSM: Record<string, XY[]> = {"way/116801004":[[-12.7,-97.6],[-17.8,-94.0],[-55.6,-68.0],[-80.2,-103.3],[-89.0,-115.8],[-46.2,-145.4]],"way/172307472":[[-4.3,32.7],[-30.2,-22.1],[15.7,-43.2],[41.6,11.6],[28.0,18.0]],"way/172307471":[[59.5,116.6],[56.2,117.5],[43.8,121.0],[41.5,113.0],[33.3,115.3],[27.3,117.0],[14.6,72.5],[44.6,64.1]],"way/116800998":[[38.1,139.6],[41.9,154.8],[44.9,160.8],[49.0,165.7],[52.2,167.8],[55.1,168.2],[58.2,167.4],[61.6,164.7],[64.1,161.1],[65.8,155.7],[67.0,147.0],[68.6,134.7],[65.6,113.8],[61.9,90.6],[56.3,69.1],[49.6,46.2],[40.0,18.1],[26.1,-13.5],[10.8,-44.8],[-11.2,-80.4],[-26.2,-105.2],[-61.1,-149.0],[-75.9,-144.6],[-85.2,-136.3],[-90.9,-125.0],[-74.7,-104.9],[-51.1,-72.0],[-46.2,-65.6],[-34.5,-46.5],[-16.0,-12.2],[-2.0,18.7],[4.9,35.8],[11.7,54.0],[22.9,89.0],[30.5,117.9]],"way/827847308":[[-30.2,-22.1],[-33.3,-28.7],[-40.1,-47.3],[-55.6,-68.0],[-17.8,-94.0],[15.7,-43.2]],"way/827847309":[[14.6,72.5],[-4.3,32.7],[28.0,18.0],[44.6,64.1]]} as any
const area = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
const ccw = (r: XY[]) => (area(r) > 0 ? r : [...r].reverse())

const glass = new Part(), concrete = new Part(), hull = new Part(), deck = new Part(), podGlass = new Part(), garden = new Part()
const podWin = glass // the podia's walls are the towers' glass

// The towers' axes: u along bearing 22 (the SkyPark), v to bearing 112.
const B = (22 * Math.PI) / 180
const AU: XY = [Math.sin(B), Math.cos(B)], AV: XY = [Math.cos(B), -Math.sin(B)]
const toXY = (u: number, v: number): XY => [AU[0] * u + AV[0] * v, AU[1] * u + AV[1] * v]
const uOf = (p: XY) => p[0] * AU[0] + p[1] * AU[1], vOf = (p: XY) => p[0] * AV[0] + p[1] * AV[1]

/** A box in (u, v) between z0 and z1; the faces get the given parts (ends: ±u; sides: ±v). */
function boxUV(u0: number, u1: number, v0: number, v1: number, z0: number, z1: number, side: Part, end: Part, top: Part | null) {
  const c = [toXY(u0, v0), toXY(u1, v0), toXY(u1, v1), toXY(u0, v1)]
  const q = (a: XY, b: XY, p: Part) => p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  // Corners ordered u0v0, u1v0, u1v1, u0v1: counter-clockwise when (u, v) is left-handed in the map; fix by area.
  const ring = area(c) > 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  for (let i = 0; i < 4; i++) {
    const a = ring[i], b = ring[(i + 1) % 4]
    const isEnd = (a === 1 && b === 2) || (a === 2 && b === 1) || (a === 3 && b === 0) || (a === 0 && b === 3)
    q(c[a], c[b], isEnd ? end : side)
  }
  if (top) top.quad(...(ring.map((i) => [c[i][0], c[i][1], z1] as V3) as [V3, V3, V3, V3]))
}

const TOP = 193, JOIN = 80, LEG_E = 11, LEG_W = 12, DEPTH_TOP = 23
const bands: number[] = []
for (let z = 63; z < TOP - 4; z += 63) bands.push(z) // floor lines every 18 floors only: denser ones read as stripes
for (const id of ['way/116801004', 'way/172307472', 'way/172307471']) {
  const pts = OSM[id]
  const us = pts.map(uOf), vs = pts.map(vOf)
  // OSM's outlines give ~60 m along u; the west photos put each gap at about
  // half a tower's width, so each tower is drawn 5 m wider at each end.
  const u0 = Math.min(...us) - 5, u1 = Math.max(...us) + 5, v0 = Math.min(...vs), v1 = Math.max(...vs)
  // Both legs are lofted from chamfered sections: the broad faces (west and
  // east) glass, the ends and the chamfers pale concrete.
  const C = 1.3 // the chamfer at every vertical edge
  const vIn = v1 - LEG_E // the eastern leg's west face
  const outer = (z: number) => {
    if (z >= JOIN) return vIn - (DEPTH_TOP - LEG_E)
    const t = z / JOIN, e = 1 - (1 - t) * (1 - t) // eases in, steepest at the foot
    return v0 + (vIn - (DEPTH_TOP - LEG_E) - v0) * e
  }
  /** A chamfered section between va (west) and vb (east) at height z, counter-clockwise in the map. */
  const sect = (va: number, vb: number, z: number): V3[] => {
    const c = Math.min(C, (vb - va) / 3)
    const uv: XY[] = [[u0 + c, va], [u1 - c, va], [u1, va + c], [u1, vb - c], [u1 - c, vb], [u0 + c, vb], [u0, vb - c], [u0, va + c]]
    const pts = uv.map(([u, v]) => [...toXY(u, v), z] as V3)
    return area(pts.map((q) => [q[0], q[1]] as XY)) > 0 ? pts : [...pts].reverse()
  }
  const sectParts = (pts: V3[], va: number): Part[] => {
    // The edge from point i to i+1 is glass when both lie on a broad face.
    return pts.map((p, i) => {
      const q = pts[(i + 1) % pts.length]
      const vp = vOf([p[0], p[1]]), vq = vOf([q[0], q[1]])
      return Math.abs(vp - vq) < 1e-6 ? glass : concrete
    })
  }
  const loftLeg = (levels: number[], vaOf: (z: number) => number, vbOf: (z: number) => number) => {
    const rings = levels.map((z) => sect(vaOf(z), vbOf(z), z))
    for (let k = 0; k < rings.length - 1; k++) {
      const parts = sectParts(rings[k], vaOf(levels[k]))
      for (let i = 0; i < rings[k].length; i++) {
        const j = (i + 1) % rings[k].length
        parts[i].quad(rings[k][i], rings[k][j], rings[k + 1][j], rings[k + 1][i])
      }
    }
    const t = rings[rings.length - 1]
    for (let i = 1; i < t.length - 1; i++) deck.tri(t[0], t[i], t[i + 1])
  }
  const legLevels: number[] = []
  for (let z = 0; z < JOIN; z += 5) legLevels.push(z)
  legLevels.push(JOIN, 120, 160, TOP)
  // The eastern leg: straight, full height.
  loftLeg([0, 60, 120, TOP], () => vIn, () => v1)
  // The western leg: from the outline's west edge at the foot, curving in to
  // meet the eastern leg by JOIN, then straight to the top (it overlaps the
  // eastern leg by a metre there, so no seam shows).
  loftLeg(legLevels, outer, (z) => Math.min(vIn + 1, outer(z) + LEG_W + (DEPTH_TOP - LEG_E - LEG_W) * Math.min(1, z / JOIN)))
  // The atrium between the legs at the foot: dark glass wall at the ends.
  for (const u of [u0 + 0.6, u1 - 0.6]) {
    const P = (v: number, z: number): V3 => [...toXY(u, v), z] as V3
    const a = P(outer(0) + LEG_W, 0), b = P(vIn, 0), c = P(vIn, 40), d = P(outer(40) + LEG_W, 40)
    podGlass.quad(a, b, c, d); podGlass.quad(d, c, b, a)
  }
  // Mullion lines on the broad faces: a pale frame at each end and a line
  // every ~10 m, following the western leg's curve.
  const vLevels = [...legLevels]
  const nLines = Math.round((u1 - u0) / 10)
  for (let i = 0; i <= nLines; i++) {
    const u = u0 + C + ((u1 - u0 - 2 * C) * i) / nLines, w = i === 0 || i === nLines ? 1.2 : 0.35
    const uc = i === 0 ? u + w / 2 : i === nLines ? u - w / 2 : u
    for (const face of ['w', 'e'] as const) {
      for (let k = 0; k < vLevels.length - 1; k++) {
        const za = vLevels[k], zb = vLevels[k + 1]
        const va = face === 'w' ? outer(za) - 0.07 : v1 + 0.07, vb = face === 'w' ? outer(zb) - 0.07 : v1 + 0.07
        const q: V3[] = [[...toXY(uc - w / 2, va), za] as V3, [...toXY(uc + w / 2, va), za] as V3, [...toXY(uc + w / 2, vb), zb] as V3, [...toXY(uc - w / 2, vb), zb] as V3]
        // Face the strip outward (west or east).
        const out = face === 'w' ? [-AV[0], -AV[1]] : AV
        const n = [(q[1][1] - q[0][1]) * (q[3][2] - q[0][2]) - (q[1][2] - q[0][2]) * (q[3][1] - q[0][1]), (q[1][2] - q[0][2]) * (q[3][0] - q[0][0]) - (q[1][0] - q[0][0]) * (q[3][2] - q[0][2])]
        if (n[0] * out[0] + n[1] * out[1] >= 0) concrete.quad(q[0], q[1], q[2], q[3]); else concrete.quad(q[3], q[2], q[1], q[0])
      }
    }
  }
  // The glazed slot down each end, where the two legs meet.
  for (const [u, sgn] of [[u0 - 0.07, -1], [u1 + 0.07, 1]] as [number, number][]) {
    const P = (v: number, z: number): V3 => [...toXY(u, v), z] as V3
    const q = [P(vIn - 2.2, 24), P(vIn + 2.2, 24), P(vIn + 2.2, 186), P(vIn - 2.2, 186)]
    const n = [(q[1][1] - q[0][1]) * (q[3][2] - q[0][2]) - (q[1][2] - q[0][2]) * (q[3][1] - q[0][1]), (q[1][2] - q[0][2]) * (q[3][0] - q[0][0]) - (q[1][0] - q[0][0]) * (q[3][2] - q[0][2])]
    if ((n[0] * AU[0] + n[1] * AU[1]) * sgn >= 0) glass.quad(q[0], q[1], q[2], q[3]); else glass.quad(q[3], q[2], q[1], q[0])
  }
  // Trim bands on the broad faces, every eighteen floors.
  for (const z of bands) {
    const vw = outer(z) - 0.06, ve = v1 + 0.06
    for (const [v, s] of [[vw, -1], [ve, 1]] as [number, number][]) {
      const a = toXY(u0 + C, v), b = toXY(u1 - C, v)
      const q: V3[] = [[a[0], a[1], z], [b[0], b[1], z], [b[0], b[1], z + 0.45], [a[0], a[1], z + 0.45]]
      if (s > 0) concrete.quad(q[0], q[1], q[2], q[3]); else concrete.quad(q[3], q[2], q[1], q[0])
      concrete.quad(q[0], q[3], q[2], q[1]); concrete.quad(q[0], q[1], q[2], q[3])
    }
  }
}

// --------------------------------------------------------------- SkyPark ---
// The hull: OSM's outline, a belly inset 3 m at the underside, the deck on top.
{
  const ring = ccw(OSM['way/116800998'])
  const Z1 = 198
  // The hull's section: a rounded belly. Rings from the deck's edge down to
  // the flat underside, each inset and lowered; the whole hull sweeps up
  // toward the cantilevered north end (lift(p)), as the photos show.
  const uN = Math.max(...ring.map(uOf)), uTowerN = Math.max(...OSM['way/172307471'].map(uOf))
  const lift = (p: XY) => { const t = Math.max(0, (uOf(p) - uTowerN) / (uN - uTowerN)); return 2.2 * t * t }
  const prof: [number, number][] = [[0, 0], [0.25, -1.6], [0.9, -3.4], [2.0, -5.2], [3.5, -6.7], [5.2, -8.0], [7.0, -10.0]] // [inset, drop below the deck]
  const rings = prof.map(([d, dz]) => (d === 0 ? ring : offset(ring, -d)).map((p) => [p[0], p[1], Z1 + dz + lift(p)] as V3))
  for (let k = 0; k < rings.length - 1; k++)
    for (let i = 0; i < ring.length; i++) {
      const j = (i + 1) % ring.length
      hull.quad(rings[k + 1][i], rings[k + 1][j], rings[k][j], rings[k][i])
    }
  const bel = rings[rings.length - 1]
  for (const [i, j, k] of earcut(bel.map((q) => [q[0], q[1]] as XY))) hull.tri(bel[k], bel[j], bel[i])
  const top = ring.map((p) => [p[0], p[1], Z1 + lift(p)] as V3)
  for (const [i, j, k] of earcut(ring)) deck.tri(top[i], top[j], top[k])
  // The deck in the towers' axes: its west and east edges at a given u.
  const ruv = ring.map((p) => [uOf(p), vOf(p)] as XY)
  const vRange = (u: number): [number, number] => {
    const hits: number[] = []
    for (let i = 0; i < ruv.length; i++) {
      const a = ruv[i], b = ruv[(i + 1) % ruv.length]
      if ((a[0] - u) * (b[0] - u) <= 0 && a[0] !== b[0]) hits.push(a[1] + ((b[1] - a[1]) * (u - a[0])) / (b[0] - a[0]))
    }
    return [Math.min(...hits), Math.max(...hits)]
  }
  const us = ruv.map((p) => p[0]), uMin = Math.min(...us), uMax = Math.max(...us)
  const quadUV = (p: Part, pts: [number, number][], z: number) => {
    const q = pts.map(([u, v]) => [...toXY(u, v), z] as V3)
    const a = area(q.map((x) => [x[0], x[1]] as XY))
    if (a > 0) p.quad(q[0], q[1], q[2], q[3]); else p.quad(q[3], q[2], q[1], q[0])
  }
  // The parapet round the deck's edge: a pale rim standing proud.
  {
    const outerR = offset(ring, 0.35)
    for (let i = 0; i < ring.length; i++) {
      const j = (i + 1) % ring.length
      const li = lift(ring[i]), lj = lift(ring[j])
      concrete.quad([outerR[i][0], outerR[i][1], Z1 - 1.2 + li], [outerR[j][0], outerR[j][1], Z1 - 1.2 + lj], [outerR[j][0], outerR[j][1], Z1 + 1.1 + lj], [outerR[i][0], outerR[i][1], Z1 + 1.1 + li])
      concrete.quad([outerR[i][0], outerR[i][1], Z1 + 1.1 + li], [outerR[j][0], outerR[j][1], Z1 + 1.1 + lj], [ring[j][0], ring[j][1], Z1 + 1.1 + lj], [ring[i][0], ring[i][1], Z1 + 1.1 + li])
      concrete.quad([ring[j][0], ring[j][1], Z1 + lj], [ring[i][0], ring[i][1], Z1 + li], [ring[i][0], ring[i][1], Z1 + 1.1 + li], [ring[j][0], ring[j][1], Z1 + 1.1 + lj])
    }
  }
  // The infinity pool along the deck's west (bay) edge, over the two
  // northern towers; rows of trees down the east side; low pavilions
  // between them.
  const T2 = OSM['way/172307472'].map(uOf), T3 = OSM['way/172307471'].map(uOf)
  const pu0 = Math.min(...T2) - 10, pu1 = Math.max(...T3) + 5
  for (let u = pu0; u < pu1 - 0.01; u += 12) {
    const ub = Math.min(pu1, u + 12), [va] = vRange((u + ub) / 2)
    quadUV(podGlass, [[u, va + 1.5], [ub, va + 1.5], [ub, va + 11], [u, va + 11]], Z1 + 0.25)
  }
  for (let u = uMin + 20; u < uMax - 20; u += 11) {
    const [, vb] = vRange(u)
    if (vb - 7 < vRange(u)[0] + 14) continue
    boxUV(u - 2.2, u + 2.2, vb - 9.4, vb - 5, Z1, Z1 + 3.2, garden, garden, garden)
  }
  for (let u = uMin + 45; u < uMax - 30; u += 42) {
    const [va, vb] = vRange(u), vc = (va + vb) / 2 + 2
    if (vb - va < 30) continue
    boxUV(u - 8, u + 8, vc - 4, vc + 4, Z1, Z1 + 4, concrete, concrete, concrete)
  }
  // A white block on the deck over each end tower.
  for (const id of ['way/116801004', 'way/172307471']) {
    const pts = OSM[id], us = pts.map(uOf), vs = pts.map(vOf)
    const uc = (Math.min(...us) + Math.max(...us)) / 2, vc = Math.max(...vs) - 14
    boxUV(uc - 9, uc + 9, vc - 7, vc + 7, Z1, Z1 + 6.5, concrete, concrete, concrete)
  }
}

// ----------------------------------------------------------------- podia ---
for (const [id, h] of [['way/827847308', 18], ['way/827847309', 13]] as [string, number][]) {
  const ring = ccw(OSM[id])
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    podWin.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], h], [a[0], a[1], h])
  }
  for (const [i, j, k] of earcut(ring)) concrete.tri([...ring[i], h], [...ring[j], h], [...ring[k], h])
  // Ridged glass skylights across the atrium roof: rows of low gabled
  // glass ridges running between the towers.
  const ruv = ring.map((p) => [uOf(p), vOf(p)] as XY)
  const us = ruv.map((q) => q[0]), vs = ruv.map((q) => q[1])
  const ua = Math.min(...us) + 4, ub = Math.max(...us) - 4, va = Math.min(...vs) + 4, vb = Math.max(...vs) - 4
  const inside = (u: number, v: number) => {
    let c = false
    for (let i = 0; i < ruv.length; i++) {
      const [x1, y1] = ruv[i], [x2, y2] = ruv[(i + 1) % ruv.length]
      if ((y1 > v) !== (y2 > v) && u < ((x2 - x1) * (v - y1)) / (y2 - y1) + x1) c = !c
    }
    return c
  }
  for (let v = va; v < vb - 3; v += 6) {
    if (!inside((ua + ub) / 2, v + 3)) continue
    let u = ua; while (u < ub && !inside(u, v + 3)) u += 2
    let w = ub; while (w > ua && !inside(w, v + 3)) w -= 2
    if (w - u < 8) continue
    const P = (uu: number, vv: number, z: number): V3 => [...toXY(uu, vv), z] as V3
    const a = P(u, v + 0.6, h), b = P(w, v + 0.6, h), c = P(w, v + 3, h + 2), d = P(u, v + 3, h + 2), e = P(w, v + 5.4, h), f = P(u, v + 5.4, h)
    for (const [q0, q1, q2, q3] of [[a, b, c, d], [d, c, e, f]] as V3[][]) { podGlass.quad(q0, q1, q2, q3); podGlass.quad(q3, q2, q1, q0) }
  }
}

// ---------------------------------------------------------------- output ---
// Colours from daylight photos: the glass a light blue-grey that reflects
// the sky; the legs' ends and the hull pale grey; the deck a grey roof.
const lit = (_p: V3, n: V3) => (n[2] < -0.3 ? 1 : n[2] > 0.8 ? 0.2 : 0.7)
const parts: Array<{ part: Part; material: MaterialSpec }> = [
  { part: glass, material: windowVariant(2, 0x93a7b6) },
  { part: concrete, material: { ...finish('mbs-concrete', 0xe2e0db), floodlight: lit } },
  { part: hull, material: { ...finish('mbs-hull', 0xd5d8da), floodlight: lit } },
  { part: deck, material: PALETTE.roof },
  { part: podGlass, material: PALETTE.glass },
  { part: garden, material: finish('mbs-garden', 0x8fa982) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Marina Bay Sands', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: 0, elevation: 0, height: 204.5,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/singapore-marina-bay-sands.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
