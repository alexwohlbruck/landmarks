/**
 * 875 North Michigan Avenue (John Hancock Center, 1969, SOM: Bruce Graham,
 * Fazlur Khan), Chicago — original procedural geometry, CC0-1.0.
 * bun generators/chi-875-north-michigan.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/31064573,
 * 41.898818,-87.623095. The outline's long edges run at 89.0° / 179.0°, so
 * the catalog bearing is 359 and the tower is square to this frame.
 *
 * Identity, in order: the tapering obelisk; the stacked X braces on every
 * face, with the horizontal ties where the diagonals meet the corners; the
 * pale louvred band of the top mechanical floors; the two antennas, the
 * west one shorter.
 *
 * Evidence:
 *  - plan at the base 82.4 × 52.6 m: OSM outline (published 265 × 165 ft,
 *    80.8 × 50.3 m). Plan at the roof 48.8 × 31.0 m: OSM flat roof part
 *    way/232905283 (published 160 × 100 ft, 48.8 × 30.5 m). The four sloped
 *    OSM parts (way/232905278, -280, -397, 232914185) are the tapering faces.
 *  - main roof 337 m: OSM parts; penthouse to 343.7 m: OSM way/1282265474,
 *    footprint simplified to its bounding box. Published roof 344 m.
 *  - antennas: positions from OSM (way/279951771 west, way/279951772 east);
 *    east tip 457 m (1,500 ft, published); west tip 442 m, measured from the
 *    James Willamor telephoto (scaled by the 48.8 m top width), which agrees
 *    with the commonly quoted 1,449 ft. White lower drums ~20 m and the
 *    slimmer mast above: measured from the same photo and Roman Boed's.
 *  - X bracing: counted on the north face (Roman Boed, full resolution) and
 *    the south face (James Willamor): five full X's stacked from the ground,
 *    then a Λ from the top tie to the middle of the top band. The ties lie
 *    at the same floors on the broad and narrow faces (Joe Ravi's corner
 *    view), so the narrow faces carry steeper X's of the same height. Tie
 *    spacing 60 m (~18 floors) is from the photos' ratio of the top
 *    partial X (0.45 of a full one) to the braced height; the Λ's apex
 *    meets the top band ~10 m below the roof (dark mechanical floors under
 *    a pale glazed strip at the very top, north photo).
 *  - bays: the broad faces read as four bays between strong columns (north
 *    photo), the narrow faces as three (estimated, foreshortened in every
 *    photo).
 *  - colour: black anodised aluminium and bronze glass, pulled to charcoal
 *    #4a4f57 with a warm slate window a step lighter, as Willis is drawn.
 *    The braces are a lighter grey so they read as they do in sun (Joe Ravi,
 *    TheFrog001): the bracing is the identity.
 *
 * Ground: the sunken plaza lies along Michigan Avenue outside the outline;
 * y = 0 is the lowest ground under the tower and the map finds it.
 *
 * Photos (Wikimedia Commons): 875_North_Michigan_Avenue,_Chicago,_IL.jpg
 * (James Willamor, CC BY-SA 2.0); Chicago_John_Hancock_Center_(28386228340)
 * (Roman Boed, CC BY 2.0); John_Hancock_Center_2.jpg (Joe Ravi, CC BY-SA
 * 3.0); John_Hancock_Center,_July_2017.jpg (TheFrog001, CC0);
 * Hancock_tower_day.jpg (David Salz, CC BY-SA 3.0). No commercial imagery.
 *
 * Left out: the floor-by-floor window grid, the antennas' dishes, the
 * observatory's tilt windows, the low podium and garage ramps.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const frame = new Part(), win = new Part(), brace = new Part(), roof = new Part(), white = new Part()

const H = 337, BASE: [number, number] = [41.2, 26.3], TOP: [number, number] = [24.4, 15.5]
const PENT = { x0: -22.2, x1: 15.4, y0: -10.4, y1: 8.8, z: 343.7 }
const TIE = 60.0, NX = 5, APEX = 327, BAND0 = 332.6, BAND1 = 336.4
const COL = 2.4, BW = 3.0, PROUD = .32, WIN = .06

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const sc = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const unit = (a: V3): V3 => sc(a, 1 / Math.hypot(...a))
const lerpV = (a: V3, b: V3, t: number): V3 => add(a, sc(sub(b, a), t))
const half = (z: number): [number, number] => [BASE[0] + (TOP[0] - BASE[0]) * z / H, BASE[1] + (TOP[1] - BASE[1]) * z / H]

/** Plan corner k (0 SW, 1 SE, 2 NE, 3 NW) at height z. */
function corner(k: number, z: number): V3 {
  const [hx, hy] = half(z)
  return [[-hx, -hy], [hx, -hy], [hx, hy], [-hx, hy]][k].concat(z) as V3
}

// A face, counter-clockwise from outside: left edge corner k, right edge k+1.
type Face = { k: number; n: V3; width: (z: number) => number }
const faces: Face[] = [0, 1, 2, 3].map(k => {
  const a = corner(k, 0), b = corner((k + 1) % 4, 0), c = corner(k, H)
  const n = unit(crs(sub(b, a), sub(c, a)))
  return { k, n, width: z => Math.hypot(...sub(corner((k + 1) % 4, z), corner(k, z))) }
})
/** Point on face f: s metres from the left edge at height z, d out from the wall. */
function at(f: Face, s: number, z: number, d = 0): V3 {
  const l = corner(f.k, z), r = corner((f.k + 1) % 4, z)
  return add(lerpV(l, r, s / Math.hypot(...sub(r, l))), sc(f.n, d))
}
/** Same, with s as a fraction 0..1 of the width at that height. */
const atf = (f: Face, t: number, z: number, d = 0) => at(f, t * f.width(z), z, d)

/** A proud band between two points on a face, with its end walls. */
function band(p: Part, f: Face, a: V3, b: V3, w: number, d = PROUD) {
  const side = sc(unit(crs(f.n, sub(b, a))), w / 2)
  const o = sc(f.n, d)
  const a0 = sub(a, side), a1 = add(a, side), b0 = sub(b, side), b1 = add(b, side)
  p.quad(add(a0, o), add(b0, o), add(b1, o), add(a1, o))
  p.quad(a0, b0, add(b0, o), add(a0, o))
  p.quad(b1, a1, add(a1, o), add(b1, o))
  p.quad(b0, b1, add(b1, o), add(b0, o))
  p.quad(a1, a0, add(a0, o), add(a1, o))
}

// Body: a chamfered tapering prism, faces flat.
const CH = .6
function ring(z: number): V3[] {
  const [hx, hy] = half(z)
  return [[-hx + CH, -hy], [hx - CH, -hy], [hx, -hy + CH], [hx, hy - CH], [hx - CH, hy], [-hx + CH, hy], [-hx, hy - CH], [-hx, -hy + CH]]
    .map(([x, y]) => [x, y, z] as V3)
}
frame.loft([ring(0), ring(BAND0)])
white.loft([ring(BAND0), ring(BAND1)])
frame.loft([ring(BAND1), ring(H)])
// Parapet lip and roof.
{
  const top = ring(H), inner = top.map(([x, y, z]) => [x * .97, y * .95, z] as V3)
  for (let i = 0; i < 8; i++) { const j = (i + 1) % 8; frame.quad(top[i], top[j], inner[j], inner[i]) }
  const low = inner.map(([x, y]) => [x, y, H - .8] as V3)
  for (let i = 0; i < 8; i++) { const j = (i + 1) % 8; frame.quad(inner[j], inner[i], low[i], low[j]) }
  roof.cap(low, true)
}
// Penthouse.
{
  const { x0, x1, y0, y1, z } = PENT, zb = H - .8
  const r = (zz: number): V3[] => [[x0, y0, zz], [x1, y0, zz], [x1, y1, zz], [x0, y1, zz]]
  frame.loft([r(zb), r(z)]); roof.cap(r(z), true)
}

// Facade per face: window panels per bay per three-floor group, the frame
// showing between as columns and spandrels; then corner columns, ties and
// the X braces over them.
const ties = Array.from({ length: NX + 1 }, (_, i) => i * TIE)
for (const f of faces) {
  const broad = f.k % 2 === 0
  const bays = broad ? 4 : 3
  const groups = Math.round(APEX / 10.2)
  const gh = (APEX - 4) / groups
  for (let g = 0; g < groups; g++) {
    const z0 = 4 + g * gh + .7, z1 = 4 + (g + 1) * gh - .7
    for (let b = 0; b < bays; b++) {
      // Fractions across the face between the corner columns.
      const m = .9 // half a column between bays, metres
      const pt = (s: number, z: number, e: number) => at(f, COL + (f.width(z) - 2 * COL) * s + e, z, WIN)
      win.quad(pt(b / bays, z0, b ? m : 0), pt((b + 1) / bays, z0, b < bays - 1 ? -m : 0),
        pt((b + 1) / bays, z1, b < bays - 1 ? -m : 0), pt(b / bays, z1, b ? m : 0))
    }
  }
  // Corner columns, inside the face so nothing passes the corner; each has
  // its inner side wall so it reads as a band, not a painted stripe.
  for (const left of [true, false]) {
    const zA = 0, zB = BAND0
    const e = (z: number) => left ? 0 : f.width(z), i = (z: number) => left ? COL : f.width(z) - COL
    const [s0, s1] = left ? [e, i] : [i, e]
    brace.quad(at(f, s0(zA), zA, PROUD), at(f, s1(zA), zA, PROUD), at(f, s1(zB), zB, PROUD), at(f, s0(zB), zB, PROUD))
    const q = (z: number, d: number) => at(f, i(z), z, d)
    if (left) brace.quad(q(zA, 0), q(zA, PROUD), q(zB, PROUD), q(zB, 0))
    else brace.quad(q(zA, PROUD), q(zA, 0), q(zB, 0), q(zB, PROUD))
  }
  // Ties across the face between the corner columns.
  for (const z of ties.slice(1)) band(brace, f, at(f, COL, z), at(f, f.width(z) - COL, z), BW * .9)
  band(brace, f, at(f, COL, 1.2), at(f, f.width(1.2) - COL, 1.2), 2.4)
  // The X's, corner column to corner column, tie to tie.
  const L = (z: number) => at(f, COL * .5, z), R = (z: number) => at(f, f.width(z) - COL * .5, z)
  for (let i = 0; i < NX; i++) {
    const za = Math.max(ties[i], 1.2), zb = ties[i + 1]
    band(brace, f, L(za), R(zb), BW)
    band(brace, f, R(za), L(zb), BW)
  }
  // The Λ from the top tie to the middle of the top band.
  const apex = atf(f, .5, APEX)
  band(brace, f, L(ties[NX]), apex, BW)
  band(brace, f, R(ties[NX]), apex, BW)
}

// Antennas: a white drum, then a slimmer pale mast tapering to the tip.
function mast(cx: number, cy: number, tip: number) {
  const N = 10
  const rings = (sections: [number, number][]) => sections.map(([z, r]) =>
    Array.from({ length: N }, (_, i): V3 => [cx + r * Math.cos(2 * Math.PI * i / N), cy + r * Math.sin(2 * Math.PI * i / N), z]))
  const drum = rings([[H - .8, 2.6], [PENT.z + 18, 2.4], [PENT.z + 19.5, 2.9], [PENT.z + 21, 1.4]])
  white.loft(drum)
  const m = rings([[PENT.z + 21, 1.4], [PENT.z + 21 + (tip - PENT.z - 21) * .55, .95], [tip - 3, .35]])
  roof.loft(m)
  const last = m[m.length - 1]
  for (let i = 0; i < N; i++) roof.tri(last[i], last[(i + 1) % N], [cx, cy, tip])
}
mast(-15.9, 0, 442)
mast(15.3, .3, 457)

const parts = [
  { part: frame, material: finish('black-aluminium', 0x4a4f57, .6) },
  { part: win, material: { ...PALETTE.window, color: 0x5b636d } },
  { part: brace, material: finish('brace-aluminium', 0x8a919a, .55) },
  { part: roof, material: PALETTE.roof },
  { part: white, material: finish('louvre-white', 0xd9dcdc, .7) },
]
const triangles = parts.reduce((s, p) => s + p.part.triangles, 0)
const glb = writeGlb('875 North Michigan Avenue', parts, {
  frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [41.898818, -87.623095], bearing: 359,
})
if (triangles > 5000 || glb.length > 250000) throw new Error(`Budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
const out = process.argv[2] ?? new URL('../models/chi-875-north-michigan.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
