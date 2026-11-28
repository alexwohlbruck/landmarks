/**
 * Incheon International Airport Concourse A (탑승동, the midfield concourse,
 * opened 2008, gates 101–132), with the apron control tower on its centre —
 * procedural, CC0-1.0, no textures.
 * bun generators/incheon-airport-concourse.ts
 *
 * Writes models/incheon-airport-concourse.glb (low) and
 * models/incheon-airport-concourse.detail.glb (detail: mullion groups,
 * rooftop plant, finer jet bridges with their cabs and posts).
 *
 * Map frame: x along the concourse (model east = compass 54.7°), y across
 * it, z up, metres. Placed at bearing −35.3° (the outline's principal axis,
 * measured). Anchor: area centroid of OSM relation/6309696
 * (126.4449697, 37.4559138).
 *
 * Identifying features (photos): a very long, low, straight glass bar with
 * rounded ends, all of it green-tinted curtain wall over a pale gate level,
 * under a pale grey-green roof that curves down to a thick rounded edge; in
 * the middle a wider, taller hall whose roof is a barrel arching over the
 * length of the bar, and rising out of it the round apron control tower:
 * a plain cylinder, a glazed cab drum and a white radome; jet bridges all
 * along both sides.
 *
 * Evidence
 * - OSM: relation/6309696 (outer ways 222146406 + 424584621; aeroway=terminal,
 *   building=yes, start_date 2008-06-20; no height or levels). In this frame:
 *   x −463.4…465.7, the bar y −25.5…26.5 (52 m), the centre hall
 *   x −89…91, y −42.6…41.6 (84 m). OSM node/14418350840 "계류장 관제탑"
 *   (apron control tower) marks the tower; it lies ~27 m off the building's
 *   edge, so the tower is put on the hall's same (north-west) side, inside it.
 * - Published: floor area 166,000–167,000 m², 30 gates (Incheon International
 *   Airport Corporation, airport.kr; Korean Wikipedia).
 * - Photos (Wikimedia Commons):
 *   • "ICN 02.jpg", "ICN 08.jpg", "ICN 09.jpg", "ICN 10.jpg", Andrzej Otrębski,
 *     CC BY-SA 4.0 — the concourse from the apron and taxiways: the bar, the
 *     centre hall, the tower (heights scaled from these).
 *   • "02-NOV-2023 - KC910 ICN-ALA (EI-KEB - B767-300) (03).jpg", Simply
 *     Aviation, CC BY-SA 4.0 — from the air: the whole bar, the curved roof,
 *     the barrel over the centre, the tower, roof colour.
 *   • "Korea-Incheon-International-Airport-New-Satellite-buildingA-under-construction.JPG",
 *     Kanchi1979, CC BY 2.5 — the bar and tower in 2006.
 *   • "Incheon International Airport, South Korea, September 27, 2014 019.jpg"
 *     and "… 021.jpg", 최광모, CC BY-SA 4.0 — the glazing from inside.
 *
 * Numbers (estimated from the photos, scaled from aircraft and the bar's
 * known 52 m width unless noted)
 * - Bar: gate level 0–6.5 m, curtain wall to 16.5 m, roof edge 17.5 m,
 *   roof crown 20 m.
 * - Centre hall: walls to 21 m, barrel crown 30 m.
 * - Tower: shaft Ø 9 m, cab drum Ø 15–16 m 36.4–43.2 m, radome top 50.4 m.
 * - Colours: roof sampled from the aerial (#9fb4b3, pulled light), glass as
 *   Terminal 1 (green-tinted, sampled #5b5f60…#767677 overcast).
 *
 * Doubts
 * - Heights are photo estimates; no section drawing was found.
 * - The tower's exact spot on the hall (OSM's node sits off the outline).
 * - Jet bridges at an even pitch, 15 a side, not placed gate by gate.
 */
import { type V3 } from './mesh'
import { type XY, quadN, unit, capPoly } from './nyc-570-lexington'
import { writeLod, drum, beam, prismRing, newMats } from './tokyo-haneda-terminal-1'
import { ICN, UP, DOWN, gridSurf, panelsAlong, bar, jetBridge, type Mats } from './incheon-airport-terminal-1'
import { finish } from './palette'

const Y0 = 0.5, HW = 26 // the bar's centre line and half width
const XL = -463.4, XR = 465.7 // tips
const HX0 = -89, HX1 = 91, HY0 = -42.6, HY1 = 41.6 // the centre hall
const Z_GATE = 6.5, Z_GLASS = 16.5, Z_EDGE = 17.5, Z_CROWN = 20
const Z_HALL = 21, Z_HALL_CROWN = 30
const TOWER: XY = [14, 26]

/** The bar's roof profile: height at distance d from the centre line. */
const barZ = (d: number) => {
  const u = Math.min(1, d / HW)
  // flat-arched top, then a rounded edge falling to the eave
  return Z_EDGE + (Z_CROWN - Z_EDGE) * (1 - Math.pow(u, 2.4))
}

/**
 * One wing of the bar, from the hall (xRoot) to a round tip (xTip). Its
 * outline runs up one side, round the tip and back; the roof is built from
 * that outline in to the spine, so the vault turns into a half dome at the tip.
 */
function wing(M: Mats, xRoot: number, xTip: number, detail: boolean) {
  const s = Math.sign(xTip - xRoot), xc = xTip - s * HW // tip centre
  const nSide = Math.max(4, Math.round(Math.abs(xc - xRoot) / (detail ? 24 : 48)))
  const nTip = detail ? 14 : 8
  const edge: XY[] = [], spine: XY[] = []
  for (let i = 0; i <= nSide; i++) { const x = xRoot + ((xc - xRoot) * i) / nSide; edge.push([x, Y0 - s * HW]); spine.push([x, Y0]) }
  for (let k = 1; k < nTip; k++) { const a = -Math.PI / 2 + (Math.PI * k) / nTip; edge.push([xc + s * HW * Math.cos(a), Y0 + s * HW * Math.sin(a)]); spine.push([xc, Y0]) }
  for (let i = nSide; i >= 0; i--) { const x = xRoot + ((xc - xRoot) * i) / nSide; edge.push([x, Y0 + s * HW]); spine.push([x, Y0]) }
  const out = (k: number): XY => { const e = edge[k], c = spine[k]; const l = Math.hypot(e[0] - c[0], e[1] - c[1]) || 1; return [(e[0] - c[0]) / l, (e[1] - c[1]) / l] }
  const P = (q: XY, z: number): V3 => [q[0], q[1], z]
  // walls: gate level, curtain wall, roof edge — smooth round the tip
  const strip = (part: keyof Mats, z0: number, z1: number) =>
    gridSurf(M[part], edge.map((q) => [P(q, z0), P(q, z1)]), (m) => { let best = 0, bd = 1e9; edge.forEach((q, k) => { const d = Math.hypot(q[0] - m[0], q[1] - m[1]); if (d < bd) { bd = d; best = k } }); const o = out(best); return [o[0], o[1], 0] })
  strip('panel', 0, Z_GATE)
  strip('win', Z_GATE, Z_GLASS)
  // roof: from the outline (at the eave) in to the spine
  const J = detail ? 6 : 4
  const rows = edge.map((q, k) => {
    const c = spine[k]
    const pts: V3[] = [P(q, Z_GLASS)] // the rounded edge starts at the glass head
    for (let j = 0; j <= J; j++) {
      const t = j / J, d = HW * (1 - t)
      pts.push([c[0] + (q[0] - c[0]) * (1 - t), c[1] + (q[1] - c[1]) * (1 - t), barZ(d)])
    }
    return pts
  })
  // the edge from the glass head bulges out 0.8 m: the thick rounded fascia
  rows.forEach((r, k) => { const o = out(k); r.splice(1, 0, [r[0][0] + o[0] * 0.8, r[0][1] + o[1] * 0.8, (Z_GLASS + Z_EDGE) / 2 + 0.2]) })
  gridSurf(M.roof, rows, (m) => [0, 0, 1])
  // the fascia rows face out more than up: redo them in their own strip so they shade as a band
  // window bands on the gate level and mullions on the curtain wall
  const sides = [edge.slice(0, nSide + 1), edge.slice(nSide + nTip - 1)]
  for (const side of sides) {
    const o = out(edge.indexOf(side[0]))
    const dense: XY[] = []
    for (let i = 0; i < side.length - 1; i++) {
      const a = side[i], b = side[i + 1], n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 12))
      for (let j = 0; j < n; j++) dense.push([a[0] + ((b[0] - a[0]) * j) / n, a[1] + ((b[1] - a[1]) * j) / n])
    }
    dense.push(side[side.length - 1])
    panelsAlong(M.win, dense, 1.6, 5.2, () => o, 1.2)
    const nn: V3 = [o[0], o[1], 0]
    dense.forEach((q, i) => { if (i % (detail ? 1 : 2) === 0 && i) bar(M.white, P(q, Z_GATE), P(q, Z_GLASS), detail ? 0.4 : 0.6, nn, 0.08) })
    bar(M.white, P(dense[0], 11.5), P(dense[dense.length - 1], 11.5), detail ? 0.35 : 0.6, nn, 0.08)
  }
  // jet bridges on both sides
  for (const sg of [-1, 1]) for (let x = xRoot + s * 30; s * (xc - x) > 10; x += s * 52) {
    const root: XY = [x, Y0 + sg * HW]
    if (detail) jetBridge(M, root, [0, sg], 20)
    else beam(M.bridge, root, [x, Y0 + sg * (HW + 20)], 3.8, 4.4, 7.8, true)
  }
  // rooftop plant (detail)
  if (detail) for (let x = xRoot + s * 60; s * (xc - x) > 40; x += s * 110) prismRing(M.panel, [[x - 8, Y0 - 6], [x + 8, Y0 - 6], [x + 8, Y0 + 6], [x - 8, Y0 + 6]], Z_CROWN - 0.4, Z_CROWN + 2.4)
}

function buildConcourse(detail: boolean) {
  const M = newMats(['roof', 'win', 'panel', 'white', 'glass', 'bridge'])
  wing(M, HX0 + 2, XL, detail)
  wing(M, HX1 - 2, XR, detail)

  // --- The centre hall: glazed walls under a barrel arching along x
  const nX = detail ? 24 : 12
  const xs = Array.from({ length: nX + 1 }, (_, i) => HX0 + ((HX1 - HX0) * i) / nX)
  const hz = (x: number) => { const u = (2 * (x - (HX0 + HX1) / 2)) / (HX1 - HX0); return Z_HALL + (Z_HALL_CROWN - Z_HALL) * Math.sqrt(Math.max(0, 1 - u * u)) }
  const ys = [HY0 - 0.8, HY0, HY0 + 5, -20, 0, 20, HY1 - 5, HY1, HY1 + 0.8]
  const yz = (y: number) => (y < HY0 + 0.1 || y > HY1 - 0.1 ? -1.6 : 0) // eaves turn down at the long edges
  gridSurf(M.roof, xs.map((x) => ys.map((y) => [x, y, hz(x) + (y <= HY0 - 0.5 || y >= HY1 + 0.5 ? -1.8 : yz(y))] as V3)), () => UP)
  // the arched end walls (the hall's long sides face ±y): glass under the barrel, panel gate level
  for (const [y, sg] of [[HY0, -1], [HY1, 1]] as [number, number][]) {
    const n: V3 = [0, sg, 0]
    gridSurf(M.panel, [xs.map((x) => [x, y, 0] as V3), xs.map((x) => [x, y, Z_GATE] as V3)], () => n)
    gridSurf(M.win, [xs.map((x) => [x, y, Z_GATE] as V3), xs.map((x) => [x, y, hz(x) - 1.7] as V3)], () => n)
    for (let i = 1; i < nX; i += detail ? 1 : 2) bar(M.white, [xs[i], y, Z_GATE], [xs[i], y, hz(xs[i]) - 1.7], detail ? 0.5 : 0.8, n, 0.08)
    bar(M.white, [HX0, y, 12], [HX1, y, 12], 0.7, n, 0.08)
    panelsAlong(M.win, xs.map((x) => [x, y] as XY), 1.6, 5.2, () => [0, sg], 1.2)
  }
  // the ends of the hall (facing ±x), where the bar does not cover them
  for (const [x, sg] of [[HX0, -1], [HX1, 1]] as [number, number][]) {
    const n: V3 = [sg, 0, 0]
    for (const [ya, yb] of [[HY0, Y0 - HW], [Y0 + HW, HY1]]) {
      quadN(M.panel, [x, ya, 0], [x, yb, 0], [x, yb, Z_GATE], [x, ya, Z_GATE], [n, n, n, n])
      quadN(M.win, [x, ya, Z_GATE], [x, yb, Z_GATE], [x, yb, Z_HALL - 1.6], [x, ya, Z_HALL - 1.6], [n, n, n, n])
    }
    // above the bar's roof, up to the hall roof's edge
    quadN(M.win, [x, Y0 - HW, Z_EDGE], [x, Y0 + HW, Z_EDGE], [x, Y0 + HW, Z_HALL - 1.6], [x, Y0 - HW, Z_HALL - 1.6], [n, n, n, n])
  }
  // skylight band along the barrel's crown line (detail) / a glass strip (low)
  gridSurf(M.glass, xs.slice(2, -2).map((x) => [[x, -4, hz(x) + 0.2], [x, 4, hz(x) + 0.2]] as V3[]), () => UP)

  // --- The apron control tower, rising out of the hall
  const [tx, ty] = TOWER, n = detail ? 24 : 14
  drum(M.panel, tx, ty, 4.6, 4.6, Z_HALL, 35.6, n, null)
  drum(M.panel, tx, ty, 4.6, 7.4, 35, 36.4, n, M.panel) // flared collar under the cab
  drum(M.win, tx, ty, 7.4, 8.0, 36.4, 43.2, n, null) // the glazed cab, leaning out a little
  drum(M.roof, tx, ty, 8.3, 7.0, 43.2, 44.6, n, M.roof) // its roof
  drum(M.white, tx, ty, 1.6, 1.6, 44.6, 46.4, 8, M.white) // radome base
  // the radome: a sphere on its base
  {
    const R = 3.0, cz = 47.4, NA = detail ? 8 : 5
    const G: V3[][] = []
    for (let i = 0; i <= n; i++) {
      const a = (2 * Math.PI * i) / n, row: V3[] = []
      for (let j = 0; j <= NA; j++) { const b = -Math.PI / 2 + (Math.PI * j) / NA * 0.999 + 0.0005; row.push([tx + R * Math.cos(b) * Math.cos(a), ty + R * Math.cos(b) * Math.sin(a), cz + R * Math.sin(b)]) }
      G.push(row)
    }
    gridSurf(M.white, G, (m) => [m[0] - tx, m[1] - ty, m[2] - cz])
  }
  if (detail) for (let k = 0; k < 12; k++) { // cab mullions
    const a = (2 * Math.PI * (k + 0.5)) / 12, o: V3 = [Math.cos(a), Math.sin(a), 0]
    bar(M.white, [tx + 7.45 * o[0], ty + 7.45 * o[1], 36.4], [tx + 8.05 * o[0], ty + 8.05 * o[1], 43.2], 0.3, o, 0.05)
  }

  // --- Jet bridges at the hall's long sides
  for (const sg of [-1, 1]) for (const x of [-60, 60]) {
    const root: XY = [x, sg > 0 ? HY1 : HY0]
    if (detail) jetBridge(M, root, [0, sg], 18)
    else beam(M.bridge, root, [x, root[1] + sg * 18], 3.8, 4.4, 7.8, true)
  }

  return [
    { part: M.roof, material: finish('icn-concourse-roof', 0xb8c6c3) },
    { part: M.win, material: ICN.window },
    { part: M.panel, material: ICN.panel },
    { part: M.white, material: ICN.white },
    { part: M.glass, material: ICN.glass },
    { part: M.bridge, material: ICN.bridge },
  ]
}

if (import.meta.main) {
  const extras = { bearing: -35.3, osm: 'relation/6309696', height: 50.4 }
  writeLod('Incheon International Airport Concourse', 'incheon-airport-concourse.glb', buildConcourse(false), extras, 8000, 250_000)
  writeLod('Incheon International Airport Concourse', 'incheon-airport-concourse.detail.glb', buildConcourse(true), extras, 40_000, 1_500_000)
}
