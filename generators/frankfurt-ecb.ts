/**
 * European Central Bank, Ostend, Frankfurt am Main: procedural, CC0-1.0.
 * bun generators/frankfurt-ecb.ts
 *
 * The ECB seat (Coop Himmelb(l)au, 2010-14) as one complex: the twin glass
 * tower (north tower 185 m, south tower 165 m) with the glazed atrium slot
 * between them, the restored Großmarkthalle (Martin Elsaesser, 1928) with
 * its fifteen concrete shell barrel vaults and brick head buildings, the
 * diagonal entrance building (Eingangsbauwerk) through the hall's western
 * third with the press centre cantilevered off its north end, and the low
 * blocks joining hall and tower.
 *
 * Map frame: x along the hall (east-north-east), y across it (north-north-
 * west), z up, metres; bearing -10.4 (the hall's long sides in OSM). Origin:
 * the assigned anchor 8.70292 50.10963 (on the hall, west of its middle);
 * y = 0 is the ground.
 *
 * OSM: the hall way/300429302 (with its head buildings), the entrance
 * building way/300429304 and the press centre way/786057242 in it, the
 * tower way/156432555, the connecting blocks way/300429306 and
 * way/910256771. The site outline way/112658569 is a landuse/office area,
 * not a building. The visitor centre way/317520354 (60 m north-west, a
 * separate pavilion) is not modelled. Plans used as drawn (0.1 m).
 *
 * Published (German Wikipedia, "Sitz der Europäischen Zentralbank" and
 * "Großmarkthalle (Frankfurt am Main)"):
 * - north tower 185 m, 45 storeys; south tower 165 m, 43 storeys; joined by
 *   an atrium; 201 m with the antenna on the north tower; slanted roofs.
 * - the hall 220 m long, 50 m wide, 17 to 23 m high; fifteen barrel vaults,
 *   each spanning 14.1 m between girders 36.9 m apart, 7 cm Zeiss-Dywidag
 *   shells, a half-ellipse 6 m high.
 * - the entrance building cuts diagonally through the western third of the
 *   hall roof (rebuilt after the war).
 *
 * The tower's form. Each tower's faces are ruled (hyperbolic-paraboloid)
 * surfaces between a ground plan and a different roof plan, so the vertex
 * tracks run on the slant and the faces twist; the slant line on the north
 * face (Thomas Wolf's photo) is the track of the north face's fold vertex.
 * Ground plans: the OSM outline split at its notches into the north tower
 * (west notch way vertex (-22.7,-57.1) to (52.8,-85.9)), the south tower
 * (from (-40.2,-66.2) to (11.2,-88.7)) and the atrium slot between.
 * Roof plans (estimated, from the photos from east, west, north-west and
 * south-east): the north tower's north face leans 5 m north over its
 * height (west and east photos), its fold vertex moves 18 m east (north-
 * west photo); the south tower's south face leans 12 m north, its fold moving 14 m west; the roofs
 * slope, the north tower's from 172 m at its south-west to 185 m at the
 * fold on the north face, the south tower's 158-165 m.
 * The atrium slot between them to 158 m, its east end glazed in the
 * towers' own glass (a crease in the east photo), its west end in darker
 * glass (the dark slot in the west photos); the low glazed lobby east
 * of the slot to 40 m (south-east construction photo).
 *
 * The hall, measured off Falkenreich's south photo (scaled from the 14.1 m
 * vault spacing): cornice 17.3 m, vaults to 23.6 m; the head buildings
 * 28 m with stair towers to 31 m; the entrance building to 28 m (it rises
 * just over the vaults in Prinz eisenherz's south-west photo); the press
 * centre box 7-18 m over a glazed lobby (Wolf, north-west).
 *
 * Estimated: the hall's facade bays (each 14.1 m between concrete
 * pilasters, glazed as 3 x 2 panels), the head buildings' window bands
 * (three storeys each), the connecting blocks at 12 m, the tower's trim
 * lines (one every ten storeys or so) and corner strips.
 * Left out: the antenna (a thin mast), the atrium's bridges and bracing,
 * the vaults' skylights, the memorial, the ramps and the fence.
 *
 * Colours (daylight photos, pulled to the palette): the towers' saturated
 * mid blue / blue-teal glass (Wolf, Epizentrum; a `window` variant), the
 * atrium's darker glass (`glass`, stays dark at night), pale grey hall
 * concrete, the head buildings' red-brown brick, the entrance building's
 * white panels, grey roofs.
 *
 * Photos (evidence, Wikimedia Commons):
 * - "Europäische Zentralbank Frankfurt.jpg", Thomas Wolf (www.foto-tw.de), CC BY-SA 3.0 de (north-west)
 *   https://commons.wikimedia.org/wiki/File:Europ%C3%A4ische_Zentralbank_Frankfurt.jpg
 * - "Frankfurt EZB.Nordwest-2.20141228.jpg", Epizentrum, CC BY-SA 3.0 (north-west)
 *   https://commons.wikimedia.org/wiki/File:Frankfurt_EZB.Nordwest-2.20141228.jpg
 * - "Frankfurt EZB-Neubau.Osten.20140209.jpg", Epizentrum, CC BY-SA 3.0 (east)
 *   https://commons.wikimedia.org/wiki/File:Frankfurt_EZB-Neubau.Osten.20140209.jpg
 * - "Frankfurt-Main ECB-Headquarters seen from CBT, 46th floor 2013-02-05.jpg", #Reaper, CC BY-SA 3.0 (west)
 *   https://commons.wikimedia.org/wiki/File:Frankfurt-Main_ECB-Headquarters_seen_from_CBT,_46th_floor_2013-02-05.jpg
 * - "Frankfurt am Main, Seat of the European Central Bank (Skytower (ECB)).jpg", Dr. Thomas Liptak, CC BY-SA 4.0 (south-east)
 *   https://commons.wikimedia.org/wiki/File:Frankfurt_am_Main,_Seat_of_the_European_Central_Bank_(Skytower_(ECB)).jpg
 * - "European Central Bank on seventh of April 2013 from south-east.jpg", Jürgen Matern, CC BY-SA 3.0
 *   https://commons.wikimedia.org/wiki/File:European_Central_Bank_on_seventh_of_April_2013_from_south-east.jpg
 * - "EZB Großmarkthalle.jpg", Prinz eisenherz, CC BY-SA 4.0 (south-west, hall and tower)
 *   https://commons.wikimedia.org/wiki/File:EZB_Gro%C3%9Fmarkthalle.jpg
 * - "Grossmarkthalle Frankfurt.jpg", Falkenreich, CC BY 2.5 (the hall's south side before conversion)
 *   https://commons.wikimedia.org/wiki/File:Grossmarkthalle_Frankfurt.jpg
 * - "Frankfurt - New headquarters for the European Central Bank (ECB) (16334894341).jpg", Fred Romero, CC BY 2.0 (west)
 *   https://commons.wikimedia.org/wiki/File:Frankfurt_-_New_headquarters_for_the_European_Central_Bank_(ECB)_(16334894341).jpg
 * Look-only: none.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { save, ccw, capPoly, edgePanels, type XY } from './atl-flatiron-building'

const ID = 'frankfurt-ecb'
const NAME = 'European Central Bank'
export const BEARING = -10.4

const lerp2 = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

if (import.meta.main) {
  await build(true)
  await build(false)
}

async function build(low: boolean) {
  const glassT = new Part() // tower curtain walls (lit offices)
  const atrium = new Part() // atrium and lobby glazing (stays dark)
  const trim = new Part()   // tower trim lines, entrance building's white panels
  const conc = new Part()   // hall concrete
  const brick = new Part()  // head buildings
  const roof = new Part()   // flat roofs
  const win = glassT        // hall and head windows share the lit window material

  // ───────────────────────────── the towers ─────────────────────────────
  type Tower = { base: XY[]; top: XY[]; zt: number[] }
  // Ground and roof plans (see the header): counter-clockwise from the
  // inner (atrium-side) west corner.
  const N: Tower = {
    base: [[-22, -66], [40, -66], [42, -44], [-4, -39.5], [-24, -44]],
    top: [[-23, -61.5], [39, -61.5], [41, -39.5], [14, -35.5], [-25, -39.5]],
    zt: [172, 175, 180, 185, 180],
  }
  const S: Tower = {
    base: [[-29, -82], [-31, -104], [8, -109], [34, -104], [35, -82]],
    top: [[-30, -77.5], [-32, -92], [-6, -97], [33, -92], [34, -77.5]],
    zt: [158, 161, 165, 163, 160],
  }
  const L = low ? 6 : 15 // levels up the faces
  /** A tower vertex at height z (linear along its track to its own roof height). */
  const at = (T: Tower, i: number, z: number): V3 => {
    const t = Math.min(1, z / T.zt[i])
    const p = lerp2(T.base[i], T.top[i], t)
    return [p[0], p[1], Math.min(z, T.zt[i])]
  }
  function tower(T: Tower) {
    // Make the plans counter-clockwise together.
    const area = T.base.reduce((s, a, i) => { const b = T.base[(i + 1) % T.base.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
    if (area < 0) { T.base.reverse(); T.top.reverse(); T.zt.reverse() }
    const n = T.base.length, zmin = Math.min(...T.zt)
    const zs = Array.from({ length: L }, (_, k) => (k * zmin) / L)
    // Faces: rings at uniform heights to the lowest roof corner, then up to each corner's own roof height.
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      for (let k = 0; k < L; k++) {
        const z0 = zs[k], z1 = k + 1 < L ? zs[k + 1] : Infinity
        const a0 = at(T, i, z0), b0 = at(T, j, z0), a1 = at(T, i, z1), b1 = at(T, j, z1)
        glassT.tri(a0, b0, b1)
        glassT.tri(a0, b1, a1)
      }
      // Trim: floor lines at each level and a strip up each corner.
      for (let k = 1; k < L; k++) band(T, i, j, zs[k], 0.45)
      band(T, i, j, Math.min(T.zt[i], T.zt[j]) - 0.6, 0.6)
      corner(T, i, zmin)
    }
    // Sloping glass roof.
    const tri = new Part()
    capPoly(tri, T.top, 0, true)
    for (let q = 0; q < tri.pos.length; q += 9) {
      const pts = [0, 3, 6].map((o) => [tri.pos[q + o], -tri.pos[q + o + 2]] as XY)
      const zOf = (p: XY) => {
        let best = 0, d = 1e9
        T.top.forEach((v, i) => { const e = Math.hypot(v[0] - p[0], v[1] - p[1]); if (e < d) { d = e; best = T.zt[i] } })
        return best
      }
      roof.tri([pts[0][0], pts[0][1], zOf(pts[0])], [pts[1][0], pts[1][1], zOf(pts[1])], [pts[2][0], pts[2][1], zOf(pts[2])])
    }
  }
  /** A thin trim band round face i→j at height z, standing 0.08 m off it. */
  function band(T: Tower, i: number, j: number, z: number, h: number) {
    const a0 = at(T, i, z - h / 2), b0 = at(T, j, z - h / 2), a1 = at(T, i, z + h / 2), b1 = at(T, j, z + h / 2)
    const e: XY = [b0[0] - a0[0], b0[1] - a0[1]], l = Math.hypot(e[0], e[1]), nn: V3 = [e[1] / l * 0.08, -e[0] / l * 0.08, 0]
    const o = (p: V3): V3 => [p[0] + nn[0], p[1] + nn[1], p[2]]
    trim.quad(o(a0), o(b0), o(b1), o(a1))
  }
  /** A pale strip up corner i, 0.5 m each side, standing 0.1 m out: the folds read at map scale. */
  function corner(T: Tower, i: number, zmin: number) {
    const n = T.base.length, h = (i - 1 + n) % n, j = (i + 1) % n
    const steps = [...Array.from({ length: L }, (_, k) => (k * zmin) / L), T.zt[i]]
    for (let k = 0; k < steps.length - 1; k++) {
      const P = (z: number) => {
        const c = at(T, i, z), p = at(T, h, z), q = at(T, j, z)
        const u = (a: V3): XY => { const d: XY = [a[0] - c[0], a[1] - c[1]], l = Math.hypot(d[0], d[1]); return [d[0] / l, d[1] / l] }
        const up = u(p), uq = u(q), out: XY = [-(up[0] + uq[0]), -(up[1] + uq[1])], lo = Math.hypot(out[0], out[1]) || 1
        const o: XY = [(out[0] / lo) * 0.1, (out[1] / lo) * 0.1]
        return { L: [c[0] + up[0] * 0.5 + o[0], c[1] + up[1] * 0.5 + o[1], c[2]] as V3, R: [c[0] + uq[0] * 0.5 + o[0], c[1] + uq[1] * 0.5 + o[1], c[2]] as V3, C: [c[0] + o[0] * 1.5, c[1] + o[1] * 1.5, c[2]] as V3 }
      }
      const A = P(steps[k]), B = P(Math.min(steps[k + 1], T.zt[i] - 0.05))
      trim.quad(A.L, A.C, B.C, B.L)
      trim.quad(A.C, A.R, B.R, B.C)
    }
  }
  tower(N)
  tower(S)

  // The atrium slot between the towers, glazed at both ends to the south
  // tower's lowest roof corner and roofed in glass; and the north tower's
  // antenna mast (to 201 m).
  {
    const find = (T: Tower, p: XY) => T.base.findIndex((v) => Math.hypot(v[0] - p[0], v[1] - p[1]) < 0.01)
    const nW = find(N, [-22, -66]), nE = find(N, [40, -66]), sW = find(S, [-29, -82]), sE = find(S, [35, -82])
    const ZA = 158
    const levels = Array.from({ length: L + 1 }, (_, k) => (k * ZA) / L)
    for (let k = 0; k < L; k++) {
      const z0 = levels[k], z1 = levels[k + 1]
      // West end (south tower → north tower), east end (north → south), both facing out.
      const a0 = at(S, sW, z0), a1 = at(S, sW, z1), b0 = at(N, nW, z0), b1 = at(N, nW, z1)
      atrium.tri(b0, a0, a1); atrium.tri(b0, a1, b1) // the west end reads as a dark slot (Romero, Reaper)
      const c0 = at(N, nE, z0), c1 = at(N, nE, z1), d0 = at(S, sE, z0), d1 = at(S, sE, z1)
      glassT.tri(d0, c0, c1); glassT.tri(d0, c1, d1)
    }
    const r: XY[] = [at(S, sW, ZA), at(S, sE, ZA), at(N, nE, ZA), at(N, nW, ZA)].map((p) => [p[0], p[1]] as XY)
    capPoly(atrium, ccw(r), ZA, true)
    // Mast on the north tower's high corner.
    const top = N.top[find(N, [-4, -39.5])] ?? N.top[3]
    const m: XY = [top[0] - 1, top[1] - 3], w = 0.45
    const mr: XY[] = [[m[0] - w, m[1] - w], [m[0] + w, m[1] - w], [m[0] + w, m[1] + w], [m[0] - w, m[1] + w]]
    for (let i = 0; i < 4; i++) {
      const p = mr[i], q = mr[(i + 1) % 4]
      trim.quad([p[0], p[1], 182], [q[0], q[1], 182], [q[0], q[1], 201], [p[0], p[1], 201])
    }
  }

  // ───────────────────────────── the hall ─────────────────────────────
  const X0 = -106.7, X1 = 112.9, Y0 = -27.05, Y1 = 27.9, ZC = 17.3
  // Body walls.
  const body: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
  for (let i = 0; i < 4; i++) {
    const a = body[i], b = body[(i + 1) % 4]
    if (i === 1 || i === 3) continue // the ends are inside the head buildings
    conc.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], ZC], [a[0], a[1], ZC])
  }
  // Cornice: a band projecting 0.4 m, 0.9 m deep, on both long sides.
  for (const [y, s] of [[Y0, -1], [Y1, 1]] as [number, number][]) {
    const yo = y + s * 0.4
    const A: V3 = [X0, yo, ZC - 0.9], B: V3 = [X1, yo, ZC - 0.9], C: V3 = [X1, yo, ZC + 0.3], D: V3 = [X0, yo, ZC + 0.3]
    if (s < 0) { conc.quad(A, B, C, D); conc.quad([X1, y, ZC - 0.9], [X0, y, ZC - 0.9], A, B) }
    else { conc.quad(B, A, D, C); conc.quad([X0, y, ZC - 0.9], [X1, y, ZC - 0.9], B, A) }
    // its top
    if (s < 0) conc.quad(D, C, [X1, y, ZC + 0.3], [X0, y, ZC + 0.3])
    else conc.quad(C, D, [X0, y, ZC + 0.3], [X1, y, ZC + 0.3])
  }
  // Facade bays: 15 bays of 14.1 m between pilasters, each glazed as 3 × 2 panels.
  const NB = 15, BW = 14.1, xs0 = (X0 + X1) / 2 - (NB * BW) / 2
  for (const side of [-1, 1]) {
    const y = side < 0 ? Y0 : Y1
    for (let b = 0; b <= NB; b++) {
      const x = xs0 + b * BW
      // Pilaster: 1.0 m wide, 0.5 m out, ground to cornice.
      const yo = y + side * 0.5, w = 0.5
      const P = (xx: number, yy: number, z: number): V3 => [xx, yy, z]
      if (side < 0) {
        conc.quad(P(x - w, yo, 0), P(x + w, yo, 0), P(x + w, yo, ZC - 0.9), P(x - w, yo, ZC - 0.9))
        conc.quad(P(x + w, yo, 0), P(x + w, y, 0), P(x + w, y, ZC - 0.9), P(x + w, yo, ZC - 0.9))
        conc.quad(P(x - w, y, 0), P(x - w, yo, 0), P(x - w, yo, ZC - 0.9), P(x - w, y, ZC - 0.9))
      } else {
        conc.quad(P(x + w, yo, 0), P(x - w, yo, 0), P(x - w, yo, ZC - 0.9), P(x + w, yo, ZC - 0.9))
        conc.quad(P(x - w, yo, 0), P(x - w, y, 0), P(x - w, y, ZC - 0.9), P(x - w, yo, ZC - 0.9))
        conc.quad(P(x + w, y, 0), P(x + w, yo, 0), P(x + w, yo, ZC - 0.9), P(x + w, y, ZC - 0.9))
      }
      if (b === NB) break
      // Panels.
      for (let c = 0; c < 3; c++) {
        for (const [z0, z1] of [[1.2, 8.0], [8.8, 15.8]]) {
          const xa = x + 0.9 + c * ((BW - 1.8) / 3) + 0.3, xb = x + 0.9 + (c + 1) * ((BW - 1.8) / 3) - 0.3
          const yy = y + side * 0.05
          if (side < 0) win.quad([xa, yy, z0], [xb, yy, z0], [xb, yy, z1], [xa, yy, z1])
          else win.quad([xb, yy, z0], [xa, yy, z0], [xa, yy, z1], [xb, yy, z1])
        }
      }
    }
  }
  // Roof: flat side strips, the barrel vaults over the middle 36.9 m.
  const YV = 36.9 / 2, YM = (Y0 + Y1) / 2, ZR = ZC + 0.3
  capPoly(roof, [[X0, Y0], [X1, Y0], [X1, YM - YV], [X0, YM - YV]], ZR, true)
  capPoly(roof, [[X0, YM + YV], [X1, YM + YV], [X1, Y1], [X0, Y1]], ZR, true)
  const SEG = low ? 8 : 12, HV = 6.0
  for (let b = 0; b < NB; b++) {
    const xc = xs0 + (b + 0.5) * BW, hw = BW / 2
    const prof: XY[] = Array.from({ length: SEG + 1 }, (_, s) => {
      const a = Math.PI - (s / SEG) * Math.PI
      return [xc + hw * Math.cos(a), ZR + HV * Math.sin(a)] as XY
    })
    for (let s = 0; s < SEG; s++) {
      const [xa, za] = prof[s], [xb, zb] = prof[s + 1]
      conc.quad([xa, YM - YV, za], [xb, YM - YV, zb], [xb, YM + YV, zb], [xa, YM + YV, za].map((v) => v) as V3)
    }
    // End walls (half-ellipses), with a glazed lunette.
    for (const [y, s] of [[YM - YV, -1], [YM + YV, 1]] as [number, number][]) {
      for (let k = 0; k < SEG; k++) {
        const [xa, za] = prof[k], [xb, zb] = prof[k + 1]
        if (s < 0) conc.tri([xc, y, ZR], [xb, y, zb], [xa, y, za])
        else conc.tri([xc, y, ZR], [xa, y, za], [xb, y, zb])
      }
      const lun: XY[] = Array.from({ length: SEG + 1 }, (_, k) => {
        const a = Math.PI - (k / SEG) * Math.PI
        return [xc + (hw - 1.6) * Math.cos(a), ZR + 0.4 + (HV - 1.8) * Math.sin(a)] as XY
      })
      const yy = y + s * 0.05
      for (let k = 0; k < SEG; k++) {
        const [xa, za] = lun[k], [xb, zb] = lun[k + 1]
        if (s < 0) win.tri([xc, yy, ZR + 0.4], [xb, yy, zb], [xa, yy, za])
        else win.tri([xc, yy, ZR + 0.4], [xa, yy, za], [xb, yy, zb])
      }
    }
  }

  // Head buildings: brick, 28 m, window bands three storeys each, stair towers to 31 m.
  const heads: XY[][] = [
    [[-121.7, -31.0], [-106.7, -31.0], [-106.7, 27.8], [-121.7, 27.8]],
    [[112.9, -31.0], [127.9, -31.0], [127.9, 27.9], [112.9, 27.9]],
  ]
  const ZH = 28
  for (const h of heads) {
    const r = ccw(h)
    for (let i = 0; i < 4; i++) {
      const a = r[i], b = r[(i + 1) % 4]
      brick.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], ZH], [a[0], a[1], ZH])
      edgePanels(win, a, b, 1.5, 26.5, { group: 8.33, gap: 1.6, bay: 3.2, pier: 1.1, margin: 1.5, out: 0.05, min: 8 })
    }
    capPoly(roof, r, ZH, true)
    // Parapet coping.
    for (let i = 0; i < 4; i++) {
      const a = r[i], b = r[(i + 1) % 4], L2 = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L2, -(b[0] - a[0]) / L2]
      brick.quad([a[0], a[1], ZH], [b[0], b[1], ZH], [b[0] - n[0] * 0.5, b[1] - n[1] * 0.5, ZH + 0.8], [a[0] - n[0] * 0.5, a[1] - n[1] * 0.5, ZH + 0.8])
    }
  }
  // Stair towers on the long sides of each head building (OSM's projections).
  for (const [x0, x1] of [[-116.2, -112.2], [118.4, 122.4]]) {
    for (const [ya, yb] of [[-33.1, -31.0], [27.8, 29.9]]) {
      const r: XY[] = ccw([[x0, ya], [x1, ya], [x1, yb], [x0, yb]])
      for (let i = 0; i < 4; i++) {
        const a = r[i], b = r[(i + 1) % 4]
        brick.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], 31], [a[0], a[1], 31])
        const L2 = Math.hypot(b[0] - a[0], b[1] - a[1])
        if (L2 > 3.5) edgePanels(win, a, b, 2, 30, { group: 28, gap: 0, bay: 3, pier: 0, margin: 0.8, out: 0.05, min: 3 })
      }
      capPoly(roof, r, 31, true)
    }
  }

  // ─────────────────── the entrance building and press centre ───────────────────
  {
    // The slab through the hall (way/300429304 without its north end).
    const slab: XY[] = ccw([[-49.4, 23.9], [-34.7, -27.1], [-33.5, -31.2], [-56.3, -37.7], [-59.2, -26.7], [-75.5, 23.8]])
    const ZE = 28
    for (let i = 0; i < slab.length; i++) {
      const a = slab[i], b = slab[(i + 1) % slab.length]
      trim.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], ZE], [a[0], a[1], ZE])
      edgePanels(win, a, b, 2.0, 26.5, { group: 12.25, gap: 2.2, bay: 6, pier: 1.0, margin: 1.2, out: 0.05, min: 6 })
    }
    capPoly(roof, slab, ZE, true)
    // The press centre (way/786057242, simplified): a white box 7-18 m with
    // its north front glazed, over a recessed glass lobby.
    const box: XY[] = ccw([[-80.4, 40.7], [-75.5, 23.8], [-49.4, 23.9], [-55.7, 45.7]])
    const Z0 = 7, Z1 = 18
    for (let i = 0; i < box.length; i++) {
      const a = box[i], b = box[(i + 1) % box.length]
      const front = Math.min(a[1], b[1]) > 35 // the north front
      if (front) {
        trim.quad([a[0], a[1], Z0], [b[0], b[1], Z0], [b[0], b[1], Z0 + 1.2], [a[0], a[1], Z0 + 1.2])
        win.quad([a[0], a[1], Z0 + 1.2], [b[0], b[1], Z0 + 1.2], [b[0], b[1], Z1 - 1.5], [a[0], a[1], Z1 - 1.5])
        trim.quad([a[0], a[1], Z1 - 1.5], [b[0], b[1], Z1 - 1.5], [b[0], b[1], Z1], [a[0], a[1], Z1])
      } else trim.quad([a[0], a[1], Z0], [b[0], b[1], Z0], [b[0], b[1], Z1], [a[0], a[1], Z1])
    }
    capPoly(roof, box, Z1, true)
    capPoly(trim, box, Z0, false)
    // Lobby under it, set 3 m in from the north front.
    const lob: XY[] = ccw([[-77.6, 31.0], [-75.5, 23.8], [-49.4, 23.9], [-51.6, 31.5]])
    for (let i = 0; i < lob.length; i++) {
      const a = lob[i], b = lob[(i + 1) % lob.length]
      if (Math.max(a[1], b[1]) < 24.5) continue
      atrium.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], Z0], [a[0], a[1], Z0])
    }
  }

  // ─────────────── the low blocks between hall and tower ───────────────
  for (const ring of [
    [[-25.5, -27.1], [-30.0, -27.1], [-34.7, -27.1], [-33.5, -31.2], [-56.3, -37.7], [-58.4, -38.7], [-42.7, -61.0], [-40.2, -66.2], [-25.0, -58.3], [-26.1, -53.9], [-25.4, -48.4]], // way/300429306
    [[-91.7, -27.1], [-92.4, -43.2], [-88.9, -43.4], [-88.5, -31.8], [-84.2, -46.4], [-60.3, -40.0], [-58.4, -38.7], [-56.3, -37.7], [-59.2, -26.7]], // way/910256771
  ] as XY[][]) {
    const r = ccw(ring)
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      conc.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], 12], [a[0], a[1], 12])
      edgePanels(win, a, b, 1.5, 11, { group: 9.5, gap: 0, bay: 4, pier: 1.0, margin: 1.0, out: 0.05, min: 6 })
    }
    capPoly(roof, r, 12, true)
  }

  // ── Output ──
  const parts = [
    { part: glassT, material: windowVariant(2, 0x76a3c4) },
    { part: atrium, material: { ...PALETTE.glass, color: 0x7f95a6 } },
    { part: trim, material: PALETTE.trim },
    { part: conc, material: finish('ecb-hall-concrete', 0xdcd8ce) },
    { part: brick, material: finish('ecb-brick', 0xb3735c) },
    { part: roof, material: PALETTE.roof },
  ]
  const extras = { bearing: BEARING, elevation: 0, height: 185 }
  if (low) return save(ID, NAME, parts, extras, 6500)
  const used = parts.filter((p) => p.part.triangles > 0)
  const tris = used.reduce((n, p) => n + p.part.triangles, 0)
  const glb = writeGlb(NAME, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east; metres; origin at the ground anchor', ...extras })
  if (tris > 40000 || glb.length > 1_500_000) throw new Error(`detail over budget: ${tris} triangles, ${glb.length} bytes`)
  const out = new URL(`../models/${ID}.detail.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(used.map((p) => `${p.material.name}: ${p.part.triangles}`).join(', '))
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}
