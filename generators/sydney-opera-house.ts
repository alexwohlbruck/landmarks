/**
 * Sydney Opera House, Bennelong Point, Sydney: procedural, CC0-1.0.
 * bun generators/sydney-opera-house.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built in true
 * orientation from OSM. The origin is the podium outline's area centroid;
 * y = 0 is the promenade round the podium (about 4 m above the harbour).
 *
 * Opened 1973 (Jørn Utzon). A granite-clad podium on Bennelong Point
 * carrying three groups of white tiled shells: the Concert Hall (west), the
 * Joan Sutherland Theatre (east) and the small Bennelong restaurant
 * (south-west). Each hall's shells nest along its axis: a run of shells
 * facing north to the harbour, rising to the tallest, one facing back south
 * over the Monumental Steps, and a small shell to each side where they meet.
 * Their open ends are closed by bronze-tinted glass walls.
 *
 * Published (Wikipedia, "Sydney Opera House"): the highest shell 67 m above
 * sea level; every shell surface is cut from one sphere ("the spherical
 * solution", radius ~75 m); the tiles are white and cream "Sydney" tiles.
 *
 * OSM: relation/9596872 (the podium outline, 15,800 m²) and its eleven
 * building:part=roof relations, which map the shells in plan: their
 * outlines, the ridge lines along each hall's axis and where the shells
 * meet. All are inside the outline and all are replaced.
 * From OSM (measured in plan): each hall's axis from its ridge strips
 * (Concert Hall: south tip to north tip 123.7 m, bearing 2; Joan Sutherland:
 * 97.2 m, bearing 24.6), the point where each hall's shells meet (the
 * "convergence", at podium level), each shell's tip and the spread of its
 * feet, and the restaurant's two shells.
 *
 * From photos. "Sydney opera house side view.jpg" (Matthew Field, CC BY-SA
 * 3.0) is a level view of the Concert Hall square to its axis from the west,
 * scaled from OSM's 123.7 m between its end tips (5.66 px/m): shell tips at
 * 47.7, 56.9 and 67 m above the water (the last matches the published 67 m),
 * the south shell's tip at 41 m, the side shells' at ~33 m, the podium's top
 * at ~18.5 m, the promenade ~4 m; the restaurant's tips at ~30 m.
 * Each shell's front podium feet stand close under its tip (7, 8, 13 and
 * 6 m back for S1-S4, the shells leaning only slightly forward), and its
 * back corner on the axis 33-43 m behind.
 *
 * Shells: each is two mirrored halves, each a sail between three corners:
 * its tip, the ridge's foot on the axis and a foot on the podium. Its
 * ridge, mouth and foot edges are curves bulging outward (the spherical
 * surfaces at map scale), and every shell has thickness and a ribbed
 * underside where its mouth opens.
 * Estimated: the Joan Sutherland Theatre's heights (the Concert Hall's
 * above the podium, scaled by 0.85, as photos show it lower); the back
 * corners of the lower shells, which the real ones tuck under the next
 * shell, are brought down to the podium (s 50 and 22 m) so their sides sweep
 * to the podium along a long base, as every photo shows; the curve bulges, the side shells' feet,
 * the glass walls' set-back, the Monumental Steps (eight steps over 32 m on
 * the south side, east of the restaurant).
 * Podium (from the photos from the west, north-west and the bridge): a
 * plinth course at its foot, a band of bronze foyer windows high on its long
 * walls (~6 m bays, nearly continuous as in the photos), a bevelled pale coping, and two terraces stepping down
 * to the northern Broadwalk (7 and 10.8 m, each ~4 m deep; estimated).
 * Left out: the tile chevrons (no textures), the glass walls' mullions, the
 * Broadwalk's railings and stairs, and the forecourt.
 * Terrain: tools/terrain.ts could not check the site (Mapterhorn has no z15
 * tile here); the promenade is level in every photo, so elevation is 0.
 *
 * Night: the shells are floodlit white; the glass walls glow (`window`);
 * the podium is softly lit.
 *
 * Photos (Wikimedia Commons):
 * - "Sydney opera house side view.jpg", Matthew Field, CC BY-SA 3.0 (level, from the west: heights)
 * - "Sydney Opera House - Dec 2008.jpg", Diliff, CC BY-SA 3.0 (night, from the north-west)
 * - "MC Sydney Opera House.jpg", Christian Mehlführer, CC BY 2.5 (from the Harbour Bridge)
 * - "Sydney Opera House 01.jpg", Bernard Gagnon, CC BY-SA 3.0
 * - "Sydney Opera House in 2011.jpg", Bernard Spragg, public domain
 */
import clipping from 'polygon-clipping'
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { earcut, offset, type XY } from './sf-de-young'

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const len = (a: V3) => Math.hypot(...a)
const unit = (a: V3): V3 => mul(a, 1 / (len(a) || 1))
const lerp = (a: V3, b: V3, t: number) => add(a, mul(sub(b, a), t))
const quad = (a: V3, c: V3, b: V3, t: number): V3 => add(add(mul(a, (1 - t) * (1 - t)), mul(c, 2 * t * (1 - t))), mul(b, t * t))
const area = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
const ccw = (r: XY[]) => (area(r) > 0 ? r : [...r].reverse())

/** The OSM survey frame (metres about the Nominatim point) to this model's frame. */
const C: XY = [0.09, 9.44]
const at = (x: number, y: number): XY => [x - C[0], y - C[1]]

const OUTLINE: XY[] = [[19.32,-90.42],[-20.25,-81.08],[-29.17,-78.97],[-60.67,-71.62],[-64.45,-70.7],[-62.81,-64.19],[-58.38,-45.72],[-55.43,-33.76],[-53.55,-25.95],[-52.39,-20.82],[-46.98,1.93],[-43.14,18.16],[-42.23,21.84],[-39.93,31.55],[-40.2,32.94],[-40.66,35.34],[-41.12,37.68],[-42.97,47.25],[-39.84,58.96],[-38.13,65.54],[-43.33,66.65],[-41.51,74.51],[-41.25,75.68],[-41.01,76.73],[-39.06,85.12],[-34.9,86.59],[-28.09,87.89],[-22.45,88.82],[-15.88,89.3],[-9.12,89.06],[-2.86,88.44],[7.31,86.04],[15.49,83.14],[16.17,79.4],[17.34,72.62],[18.03,64.18],[14.56,63.69],[15.53,56.59],[16.48,49.72],[20.94,48.48],[35.88,68.06],[39.17,67.63],[43.63,67.44],[50.01,66.03],[54.85,64.12],[59.75,61.85],[63.9,59.26],[67.38,56.92],[70.72,53.16],[63.96,24.65],[54.53,11.48],[40.29,-47.71],[37.23,-59.21],[36.27,-62.84],[34.46,-70.15],[25.03,-67.96],[21.54,-82.71]] as XY[]
const PODIUM = 14.5

const shellTop = new Part(), shellUnder = new Part(), podium = new Part(), glass = new Part()

/** A hall's frame: s along its axis (north end positive), t to the right, z up. */
type Hall = { o: XY; axis: XY }
const hallPt = (h: Hall, s: number, t: number, z: number): V3 => {
  const a = h.axis, r: XY = [a[1], -a[0]]
  return [h.o[0] + a[0] * s + r[0] * t, h.o[1] + a[1] * s + r[1] * t, z]
}

/**
 * One half-shell: a sail between its tip T, the ridge's foot F and a podium
 * foot B. `side` is the half's outward horizontal direction (unit). Rows run
 * from the tip (a = 0) to the foot edge (a = 1); each row is a curve from the
 * ridge to the mouth edge, bulging outward and up.
 */
function halfShell(T: V3, F: V3, B: V3, side: V3, n = 6, m = 6) {
  const up: V3 = [0, 0, 1]
  // Ridge F->T bulges up, perpendicular to it in its vertical plane.
  const rDir = unit(sub(T, F)), rN = unit(cross(cross(rDir, up), rDir))
  const rC = add(mul(add(F, T), 0.5), mul(rN[2] < 0 ? mul(rN, -1) : rN, len(sub(T, F)) * 0.14))
  // Mouth B->T bulges outward (sideways) and a little up.
  const mC = add(mul(add(B, T), 0.5), mul(unit(add(mul(side, 0.8), [0, 0, 0.3])), len(sub(T, B)) * 0.16))
  // Foot F->B bulges outward in plan.
  const fC = add(mul(add(F, B), 0.5), mul(side, len(sub(B, F)) * 0.12))
  const grid: V3[][] = []
  for (let i = 0; i <= n; i++) {
    const a = i / n
    const L = quad(F, rC, T, 1 - a), R = quad(B, mC, T, 1 - a)
    const w = len(sub(R, L))
    const bulge = unit(add(mul(side, 0.6), [0, 0, 0.8 * (1 - a * a * a)]))
    const ctl = i === n ? fC : add(mul(add(L, R), 0.5), mul(bulge, w * 0.16))
    const row: V3[] = []
    for (let j = 0; j <= m; j++) row.push(quad(L, ctl, R, j / m))
    grid.push(row)
  }
  // Per-vertex normals, oriented away from the shell's inside (outward and up).
  const out = unit(add(side, [0, 0, 1]))
  const nrm = grid.map((row, i) => row.map((p, j) => {
    const du = sub(grid[i][Math.min(m, j + 1)], grid[i][Math.max(0, j - 1)])
    const dv = sub(grid[Math.min(n, i + 1)][j], grid[Math.max(0, i - 1)][j])
    let nn = unit(cross(du, dv))
    if (len(nn) < 0.5) nn = out
    return nn[0] * out[0] + nn[1] * out[1] + nn[2] * out[2] < 0 ? mul(nn, -1) : nn
  }))
  const TH = 0.9
  const under = grid.map((row, i) => row.map((p, j) => sub(p, mul(nrm[i][j], TH))))
  const tri = (part: Part, a: V3, b: V3, c: V3, na: V3, nb: V3, nc: V3, flip: boolean) => {
    if (flip) part.tri(a, c, b, undefined, undefined, undefined, [mul(na, -1), mul(nc, -1), mul(nb, -1)])
    else part.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
  }
  for (let i = 0; i < n; i++)
    for (let j = 0; j < m; j++) {
      const p = [grid[i][j], grid[i][j + 1], grid[i + 1][j + 1], grid[i + 1][j]]
      const q = [nrm[i][j], nrm[i][j + 1], nrm[i + 1][j + 1], nrm[i + 1][j]]
      const u = [under[i][j], under[i][j + 1], under[i + 1][j + 1], under[i + 1][j]]
      for (const [x, y, z] of [[0, 1, 2], [0, 2, 3]]) {
        tri(shellTop, p[x], p[y], p[z], q[x], q[y], q[z], false)
        tri(shellUnder, u[x], u[y], u[z], q[x], q[y], q[z], true)
      }
    }
  // The lip along the mouth edge (column m), joining top and underside.
  for (let i = 0; i < n; i++) {
    const a = grid[i][m], b = grid[i + 1][m], c = under[i + 1][m], d = under[i][m]
    const ln = unit(cross(sub(b, a), sub(d, a)))
    const s = ln[0] * side[0] + ln[1] * side[1] + ln[2] * side[2] < 0 ? -1 : 1
    shellTop.quad(...((s > 0 ? [a, b, c, d] : [a, d, c, b]) as [V3, V3, V3, V3]))
  }
  return grid.map((row) => row[m]) // the mouth edge, tip first
}

/** A whole shell: two halves either side of its ridge, and the glass wall closing its mouth. */
function shell(h: Hall, T: [number, number, number], F: [number, number, number], B: [number, number], spread: number, glassWall = true) {
  const Tw = hallPt(h, T[0], T[1], T[2]), Fw = hallPt(h, F[0], F[1], F[2])
  // The ridge's horizontal direction, and the halves' outward sides.
  const dir = unit([Tw[0] - Fw[0], Tw[1] - Fw[1], 0])
  const right: V3 = [dir[1], -dir[0], 0]
  // B is given in the shell's own frame: along its ridge from F, and across it.
  const foot = (sgn: number): V3 => {
    const base = add(Fw, mul(dir, B[0]))
    return [base[0] + right[0] * sgn * B[1], base[1] + right[1] * sgn * B[1], PODIUM]
  }
  const edges = [1, -1].map((sgn) => halfShell(Tw, Fw, foot(sgn), mul(right, sgn)))
  if (!glassWall) return
  // Glass: a fan from the mouth's base, set back into the shell.
  const back = mul(dir, -spread)
  const L = edges[0].map((p) => add(p, back)), R = edges[1].map((p) => add(p, back))
  const base = mul(add(L[L.length - 1], R[R.length - 1]), 0.5)
  base[2] = PODIUM
  const arch = [...L.slice().reverse(), ...R.slice(1)]
  const g: V3 = dir
  for (let i = 0; i < arch.length - 1; i++) {
    glass.tri(base, arch[i], arch[i + 1], undefined, undefined, undefined, [g, g, g])
    glass.tri(base, arch[i + 1], arch[i], undefined, undefined, undefined, [mul(g, -1), mul(g, -1), mul(g, -1)])
  }
}

// ---------------------------------------------------------------- halls ---
// Positions along each axis are measured from the convergence (s = 0).
const unitXY = (v: XY): XY => { const l = Math.hypot(v[0], v[1]); return [v[0] / l, v[1] / l] }
const concert: Hall = { o: at(-14.05, 10.65), axis: unitXY([4.45, 123.6]) }
const joan: Hall = { o: at(27.3, 10.1), axis: unitXY([40.35, 88.4]) }
type ShellDef = { T: [number, number, number]; F: [number, number, number]; B: [number, number]; glass?: boolean }
/** The Concert Hall's shells (photo heights above the promenade, OSM plan). */
const CONCERT: ShellDef[] = [
  // B: how far back from the tip its podium feet stand, and their half-spread.
  { T: [85.0, 0, 43.7], F: [50.0, 0, PODIUM], B: [7.0, 25.0] },  // S1, lowest, the north end
  { T: [58.5, 0, 52.9], F: [22.0, 0, PODIUM], B: [8.0, 27.5] },  // S2
  { T: [40.0, 0, 63.0], F: [0, 0, PODIUM], B: [13.0, 25.5] },   // S3, the tallest
  { T: [-38.7, 0, 37.2], F: [0, 0, PODIUM], B: [6.0, 15.0] },   // S4, facing south over the steps
  { T: [0, 21.5, 29.0], F: [0, 0, PODIUM], B: [4.0, 12.0] },    // side shells
  { T: [0, -21.5, 29.0], F: [0, 0, PODIUM], B: [4.0, 12.0] },
]
/** The Joan Sutherland Theatre: the Concert Hall's plan scaled to its axis, heights above the podium x 0.85. */
const sAlong = 97.2 / 123.7, sAcross = 0.74, sUp = 0.85
const JOAN: ShellDef[] = CONCERT.map((d) => ({
  T: [d.T[0] * sAlong, d.T[1] * sAcross, PODIUM + (d.T[2] - PODIUM) * sUp],
  F: [d.F[0] * sAlong, d.F[1] * sAcross, PODIUM + (d.F[2] - PODIUM) * sUp],
  B: [d.B[0] * sAlong, d.B[1] * sAcross],
}))
for (const [h, defs] of [[concert, CONCERT], [joan, JOAN]] as [Hall, ShellDef[]][]) {
  for (const d of defs) {
    // B is along the ridge from F: convert the photo's foot positions (given
    // as the distance back from the tip) into that frame.
    const ridgeLen = Math.hypot(d.T[0] - d.F[0], d.T[1] - d.F[1])
    shell(h, d.T, d.F, [ridgeLen - d.B[0], d.B[1]], 1.6, d.glass !== false)
  }
}
// The Bennelong restaurant: two shells, north and south, meeting at its convergence.
const bennelong: Hall = { o: at(-39.0, -30.8), axis: unitXY([-35.6 - -39.0, -15.6 - -30.8]) }
shell(bennelong, [15.6, 0, 26.0], [0, 0, PODIUM], [15.6 - 7.0, 9.0], 1.2)
const southLen = Math.hypot(-45.35 - -39.0, -56.95 - -30.8)
const bS: Hall = { o: bennelong.o, axis: unitXY([-45.35 - -39.0, -56.95 - -30.8]) }
shell(bS, [southLen, 0, 26.5], [0, 0, PODIUM], [southLen - 9.0, 10.0], 1.2)

// --------------------------------------------------------------- podium ---
// The podium at full height, but for the Monumental Steps on the south side
// (east of the restaurant), stepping down to the forecourt in eight steps.
{
  const ring = ccw(OUTLINE)
  // The long south edge: the outline's edge whose outward normal points most to the south.
  let best = 0, bestN = -2
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 40) continue
    const ny = -(b[0] - a[0]) / L
    if (-ny > bestN) { bestN = -ny; best = i }
  }
  const A = ring[best], Bp = ring[(best + 1) % ring.length]
  const ux = (Bp[0] - A[0]), uy = (Bp[1] - A[1]), ul = Math.hypot(ux, uy)
  const u: XY = [ux / ul, uy / ul], inward: XY = [-u[1], u[0]]
  const band = (d0: number, d1: number, x0: number): XY[] => {
    const big = 400
    const p = (s: number, d: number): XY => [A[0] + u[0] * s + inward[0] * d, A[1] + u[1] * s + inward[1] * d]
    return [p(x0, d0), p(big, d0), p(big, d1), p(x0, d1)]
  }
  // Steps start east of the restaurant: 32 m along the edge from its west end.
  const STEPS = 8, DEPTH = 32, START = 33
  const prisms: Array<[XY[][][], number]> = [] // the steps
  let rest: any = [[ring]]
  for (let k = 0; k < STEPS; k++) {
    const piece = clipping.intersection(rest, [band((k * DEPTH) / STEPS - 1, ((k + 1) * DEPTH) / STEPS, START)] as any)
    rest = clipping.difference(rest, [band((k * DEPTH) / STEPS - 1, ((k + 1) * DEPTH) / STEPS, START)] as any)
    prisms.push([piece as any, (PODIUM * (k + 1)) / (STEPS + 1)])
  }
  // The northern Broadwalk: towards the harbour the podium steps down in
  // two terraces (photos from the north-west and the bridge), each a band
  // round the north end of the outline.
  const NORTH_Y = 62
  const northHalf: any = [[[[-500, NORTH_Y], [500, NORTH_Y], [500, 500], [-500, 500]]]]
  const in1 = ccw(offset(ring, -4)), in2 = ccw(offset(ring, -8))
  const outerBand = clipping.intersection(rest, northHalf, clipping.difference([[ring]] as any, [[in1]] as any))
  const innerBand = clipping.intersection(rest, northHalf, clipping.difference([[in1]] as any, [[in2]] as any))
  rest = clipping.difference(rest, outerBand, innerBand)
  const terraces: Array<[XY[][][], number]> = [[outerBand as any, 7.0], [innerBand as any, 10.8], [rest, PODIUM]]

  /** Walls of a ring from z0 to z1. */
  const walls = (r: XY[], z0: number, z1: number) => {
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      podium.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
    }
  }
  /** A flat band between two rings with the same corners, facing up. */
  const ringBand = (part: Part, outerR: XY[], innerR: XY[], z0: number, z1: number) => {
    for (let i = 0; i < outerR.length; i++) {
      const j = (i + 1) % outerR.length
      part.quad([...outerR[i], z0], [...outerR[j], z0], [...innerR[j], z1], [...innerR[i], z1])
    }
  }
  for (const [polys, z] of prisms)
    for (const poly of polys) {
      const outer = ccw(poly[0].slice(0, -1) as XY[])
      walls(outer, 0, z)
      for (const [i, j, k] of earcut(outer)) podium.tri([...outer[i], z], [...outer[j], z], [...outer[k], z])
    }
  for (const [polys, z] of terraces)
    for (const poly of polys) {
      const outer = ccw(poly[0].slice(0, -1) as XY[])
      if (Math.abs(area(outer)) < 8) continue
      // A plinth course, a little proud of the wall, at its foot.
      const plinth = offset(outer, 0.35)
      walls(plinth, 0, 1.2)
      ringBand(podium, plinth, outer, 1.2, 1.2)
      // The wall, then a bevelled coping in the paler granite round its top edge.
      const lid = offset(outer, -0.5)
      walls(outer, 1.2, z - 0.5)
      ringBand(shellUnder, outer, lid, z - 0.5, z)
      for (const [i, j, k] of earcut(lid)) podium.tri([...lid[i], z], [...lid[j], z], [...lid[k], z])
      // Foyer windows high on every long wall that isn't the steps' side:
      // broad bronze panels on a ~6 m bay, narrow granite piers between them.
      for (let i = 0; i < outer.length; i++) {
        const a = outer[i], b = outer[(i + 1) % outer.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
        if (L < 5) continue
        const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: V3 = [t[1], -t[0], 0]
        if (n[1] < -0.75) continue
        const bays = Math.max(1, Math.round(L / 6)), pitch = L / bays, w = pitch * 0.8
        const z0 = z - 3.6, z1 = z - 1.1
        for (let k = 0; k < bays; k++) {
          const u = (k + 0.5) * pitch
          const P = (d: number, zz: number): V3 => [a[0] + t[0] * (u + d) + n[0] * 0.06, a[1] + t[1] * (u + d) + n[1] * 0.06, zz]
          glass.quad(P(-w / 2, z0), P(w / 2, z0), P(w / 2, z1), P(-w / 2, z1))
        }
      }
    }
}

// ---------------------------------------------------------------- output ---
// Colours from daylight photos: the shells' tiles a warm white; the ribbed
// undersides cream; the podium's pink-brown granite; the glass bronze.
const lit = (_p: V3, n: V3) => (n[2] > 0.95 ? 0.6 : 1)
const podiumLit = (_p: V3, n: V3) => (n[2] > 0.8 ? 0.2 : 0.5)
const parts: Array<{ part: Part; material: MaterialSpec }> = [
  { part: shellTop, material: { ...finish('opera-tile', 0xf4f1ea, 0.5), floodlight: lit } },
  { part: shellUnder, material: { ...finish('opera-rib', 0xe2d5c1), floodlight: lit } },
  { part: podium, material: { ...finish('opera-granite', 0xcdb29a), floodlight: podiumLit } },
  { part: glass, material: { ...PALETTE.window, color: 0x6f6458 } },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Sydney Opera House', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 63,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/sydney-opera-house.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
