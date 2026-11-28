/**
 * Osaka Station: the great roof (大屋根) of Osaka Station City, Umeda,
 * Osaka: procedural, CC0-1.0.
 * bun generators/osaka-station.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/osaka-station.glb, the low model: the roof's shell with its
 *   skylight strips, deep solid ribs, open edge trusses at both ends and the
 *   support columns;
 * - models/osaka-station.detail.glb, drawn from zoom 16: every rib and both
 *   edge trusses as open Warren trusses, with purlins.
 *
 * Map frame: x east, y north, z up, metres. Built square to the roof, its
 * long side (along the tracks) along x; the placement's bearing (328.5)
 * turns it to OSM's outline, whose long sides run at 58.5 degrees. The
 * origin is the centre of the roof's outline (way/332292140); y = 0 is the
 * ground at track level (flat).
 *
 * The roof (2011, JR West; Osaka Station City) spans the platforms between
 * the North Gate Building and the South Gate Building. Only the roof, its
 * supports and its trusses are modelled: the tracks, platforms and their
 * canopies, the concourse bridges and both towers are the map's. The North
 * Gate Building's stepped atrium edge is left out too: OSM maps it as its
 * own 13-level part (way/588689775) starting 1 m north of the roof, so the
 * map draws it and the roof meets its face, as the real one does.
 *
 * OSM: way/332292140, building:part, layer 1, roof:shape=skillion,
 * roof:direction=146.9 (falling to the south-south-east): in this frame
 * x -91.7..91.7, y -49.8..49.8 (measured): 183 m by 100 m.
 * Published: "約180m×約100m" (Osaka City, "OSAKA STATION CITY" panel;
 * newswitch.jp). Its height is not published in what was found.
 *
 * From photos (the roof's end profile, scaled to its 100 m span and to the
 * North Gate Building's 13 storeys behind it):
 * - the roof's top: ~31 m at the south edge, nearly flat to a low point of
 *   ~30.5 m a fifth of the way across, then rising in a convex sweep to
 *   ~50 m at the north edge, where it meets the North Gate Building
 *   ("JR大阪駅 Osaka Sta. - panoramio", iloverjoa, from the east; "JR Osaka
 *   station - Jul 30, 2011", Toshiyuki IMAI, from the west; "Osaka Station
 *   City.JPG", from the east above): estimated, +-3 m;
 * - an open edge truss ~4 m deep along both ends, following the profile,
 *   white, triangulated (all three);
 * - deep transverse ribs under the roof every ~11.5 m with skylight strips
 *   between them ("Osaka station (13383026434)", Guilhem Vellut, from
 *   below; the Toki-no-Hiroba photos);
 * - the roof carried on the North Gate Building at its high edge and on a
 *   row of white columns with V struts under its low part, ~22 m in from
 *   the south edge ("Osaka station (13382816253)", Vellut; IMAI): the
 *   number and spacing of the columns (six, ~37 m apart) are estimated;
 * - colours: the roof's top a silver grey (#c4c9ce-#d6dadd), drawn #c9ced3,
 *   with the skylights #a4c4d9 (glass); the steel white (#eef0f0).
 * Left out: the concourse bridges and the Toki-no-Hiroba deck under the roof,
 *   platform canopies, the North and South Gate Buildings.
 * Terrain: see the report; elevation 0.
 *
 * Night: the roof is unlit from outside and its skylights are `glass`
 * (dark); the trusses carry a faint white floodlight wash from the
 * concourse lighting below (Mc681, "Toki-no-Hiroba at Night in 201411").
 *
 * Photos (Wikimedia Commons, evidence):
 * - "JR大阪駅 Osaka Sta. - panoramio.jpg", iloverjoa, CC BY 3.0 (from the east)
 * - "JR Osaka station - Jul 30, 2011.jpg", Toshiyuki IMAI, CC BY-SA 2.0 (from the west)
 * - "Osaka Station City.JPG", CC BY-SA 3.0 (from the east, above)
 * - "Osaka station (13382816253).jpg", Guilhem Vellut, CC BY 2.0 (east end, supports)
 * - "Osaka station (13383026434).jpg", Guilhem Vellut, CC BY 2.0 (underside)
 * - "Osaka Station City buildings 2022-04-23.jpg", Dick Thomas Johnson, CC BY 2.0
 * - "Toki-no-hiroba Plaza, Osaka Station 時空の広場 - Feb 17, 2014.jpg", yagi-s, CC BY 2.0 (underside)
 * - "Toki-no-Hiroba at Night in 201411.JPG", Mc681, CC BY-SA 4.0 (night)
 * Look-only: none.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { beam, fquad, warren, writeLods, type Mat, type XY } from './osaka-umeda-sky-building'

const X0 = -91.7, X1 = 91.7, Y0 = -49.8, Y1 = 49.8
// The roof's top along y (south to north), estimated from the end views.
const PROFILE: XY[] = [[0, 31], [10, 30.6], [21, 30.5], [33, 33.0], [46, 37.2], [60, 41.6], [74, 45.6], [87, 48.6], [99.6, 50.4]]

/** Monotone cubic (Fritsch-Carlson) interpolation of the profile at v (0..99.6). */
function zTop(y: number): number {
  const v = Math.max(0, Math.min(99.6, y - Y0)), P = PROFILE, n = P.length
  const d = P.slice(0, -1).map((p, i) => (P[i + 1][1] - p[1]) / (P[i + 1][0] - p[0]))
  const m = P.map((_, i) => (i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2))
  let i = 0
  while (i < n - 2 && v > P[i + 1][0]) i++
  const h = P[i + 1][0] - P[i][0], t = (v - P[i][0]) / h
  const h00 = 2 * t ** 3 - 3 * t ** 2 + 1, h10 = t ** 3 - 2 * t ** 2 + t, h01 = -2 * t ** 3 + 3 * t ** 2, h11 = t ** 3 - t ** 2
  return h00 * P[i][1] + h10 * h * m[i] + h01 * P[i + 1][1] + h11 * h * m[i + 1]
}

function build(detail: boolean): Mat[] {
  const metal = new Part(), sky = new Part(), steel = new Part(), under = new Part()
  const NY = detail ? 28 : 14
  const ys = Array.from({ length: NY + 1 }, (_, k) => Y0 + ((Y1 - Y0) * k) / NY)
  const T = 0.9 // shell thickness
  const DEPTH = 4.5 // truss depth below the shell

  // Ribs every ~11.5 m: 17 across the 183 m; skylight strips between them.
  const NR = 16, pitch = (X1 - X0) / NR
  const ribX = Array.from({ length: NR + 1 }, (_, i) => X0 + i * pitch)
  // The shell: per bay, metal near the ribs and a glass strip in the middle.
  for (let i = 0; i < NR; i++) {
    const xa = ribX[i], xb = ribX[i + 1], g0 = xa + pitch * 0.36, g1 = xb - pitch * 0.36
    for (const [u0, u1, part] of [[xa, g0, metal], [g0, g1, sky], [g1, xb, metal]] as [number, number, Part][]) {
      for (let k = 0; k < NY; k++) {
        const ya = ys[k], yb = ys[k + 1], za = zTop(ya), zb = zTop(yb)
        const nrm: V3 = [0, -(zb - za), yb - ya]
        fquad(part, [u0, ya, za], [u1, ya, za], [u1, yb, zb], [u0, yb, zb], nrm)
        fquad(under, [u1, ya, za - T], [u0, ya, za - T], [u0, yb, zb - T], [u1, yb, zb - T], [0, zb - za, -(yb - ya)])
      }
    }
  }
  // The shell's edges: the two ends, the south lip and the north edge.
  for (const [x, s] of [[X0, -1], [X1, 1]] as [number, number][]) {
    for (let k = 0; k < NY; k++) {
      const ya = ys[k], yb = ys[k + 1]
      fquad(metal, [x, ya, zTop(ya) - T], [x, yb, zTop(yb) - T], [x, yb, zTop(yb)], [x, ya, zTop(ya)], [s, 0, 0])
    }
  }
  for (const [y, s] of [[Y0, -1], [Y1, 1]] as [number, number][]) {
    const z = zTop(y)
    fquad(metal, [X0, y, z - T], [X1, y, z - T], [X1, y, z], [X0, y, z], [0, s, 0])
  }

  // Ribs: under every rib line, following the profile, DEPTH deep.
  const top = (x: number) => (t: number): V3 => { const y = Y0 + (Y1 - Y0) * t; return [x, y, zTop(y) - T] }
  const bot = (x: number, d = DEPTH) => (t: number): V3 => { const y = Y0 + (Y1 - Y0) * t; return [x, y, zTop(y) - T - d * Math.min(1, t * 12, (1 - t) * 12 + 0.15)] }
  for (const x of ribX) {
    const end = x === X0 || x === X1
    const xx = end ? x + (x < 0 ? 1.2 : -1.2) : x
    if (detail || end) {
      // open trusses: the edge trusses at both ends always; every rib in the detail model
      warren(steel, top(xx), bot(xx), detail ? 20 : 14, end ? (detail ? 0.75 : 1.0) : 0.45, end ? (detail ? 0.5 : 0.7) : 0.3, detail)
      if (end && detail) {
        // a second plane for the end trusses (a space truss 2.4 m wide), and ties
        const x2 = xx + (x < 0 ? 2.4 : -2.4)
        warren(steel, top(x2), bot(xx), 20, 0.5, 0.35)
        for (let k = 0; k <= 20; k += 2) { const t = k / 20; beam(steel, top(xx)(t), top(x2)(t), 0.3) }
      }
    } else {
      // solid deep ribs in the low model: a plate DEPTH deep, 0.7 m wide
      for (let k = 0; k < 14; k++) {
        const t0 = k / 14, t1 = (k + 1) / 14
        const a = top(x)(t0), b = top(x)(t1), c = bot(x)(t1), d = bot(x)(t0)
        for (const s of [-1, 1]) {
          const o = (p: V3): V3 => [p[0] + s * 0.35, p[1], p[2]]
          fquad(under, o(a), o(b), o(c), o(d), [s, 0, 0])
        }
        fquad(under, [d[0] - 0.35, d[1], d[2]], [d[0] + 0.35, d[1], d[2]], [c[0] + 0.35, c[1], c[2]], [c[0] - 0.35, c[1], c[2]], [0, c[2] - d[2], -(c[1] - d[1])])
      }
    }
  }
  // Purlins (detail) and a longitudinal girder over the columns (both).
  const COLY = Y0 + 22
  for (const y of [COLY]) {
    const z = zTop(y) - T - DEPTH
    beam(steel, [X0, y, z], [X1, y, z], detail ? 1.2 : 1.5, detail ? 1.6 : 2.0, [0, 0, 1], true)
  }
  if (detail) for (let k = 2; k < NY; k += 3) {
    const y = ys[k], z = zTop(y) - T - 0.3
    for (let i = 0; i < NR; i++) beam(steel, [ribX[i], y, z], [ribX[i + 1], y, z], 0.3)
  }

  // Columns with V struts under the low part (six, ~37 m apart).
  const zg = zTop(COLY) - T - DEPTH - 1
  for (let i = 0; i < 6; i++) {
    const x = X0 + 10 + (i * (X1 - X0 - 20)) / 5
    beam(steel, [x, COLY, 0], [x, COLY, zg - 6], 2.0, 2.0, [0, 0, 1], true)
    for (const s of [-1, 1]) {
      beam(steel, [x, COLY, zg - 6], [x + s * 7, COLY, zg + 0.5], 0.8, 0.8, [0, 0, 1], true)
      beam(steel, [x, COLY, zg - 6], [x, COLY + s * 6, zTop(COLY + s * 6) - T - DEPTH + 0.3], 0.7, 0.7, [0, 0, 1], true)
    }
  }

  const white = (_p: V3, n: V3) => (n[2] > 0.5 ? 0.2 : 0.5)
  return [
    { part: metal, material: finish('osaka-roof-metal', 0xc9ced3) },
    { part: sky, material: { ...PALETTE.glass, color: 0xb4c9d8 } },
    { part: under, material: finish('osaka-roof-soffit', 0xdcdfe1) },
    { part: steel, material: { ...finish('osaka-steel-white', 0xeef0f0), floodlight: white } },
  ]
}

if (import.meta.main) {
  await writeLods('osaka-station', 'Osaka Station', { bearing: 328.5, elevation: 0, height: 50.4 }, [
    { file: 'osaka-station.glb', parts: build(false), maxTris: 6500, maxBytes: 250_000 },
    { file: 'osaka-station.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1536 * 1024 },
  ])
}
