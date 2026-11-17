/**
 * The TKTS booth and its red steps (2008; Perkins Eastman from the
 * competition design by Choi Ropiha, glass by Dewhurst Macfarlane), Father
 * Duffy Square, Times Square, Manhattan. Procedural, CC0-1.0.
 *   bun generators/nyc-tkts-red-steps.ts
 *
 * What it is: a glass wedge at the north end of Duffy Square, between
 * Broadway and Seventh Avenue at 47th Street. Its roof is a flight of 27
 * wide red bleacher steps rising north from the plaza to a viewing platform
 * about 4.8 m up; under the high end is the ticket booth, a white capsule
 * with "tkts" in red, behind full-height glass. The treads and risers are
 * red glass lit from inside, so at night the whole flight glows red: the
 * steps are `neon-tkts-red`, as are the red lettering, the platform's red
 * front edge and the two red "tkts" pylons at the north corners. The
 * booth's window strip is `entrance`, lit at night.
 *
 * Correction to the brief: the booth is under the high (north) end of the
 * steps, facing 47th Street, not at the south end. Every photo below shows
 * the steps rising north from Father Duffy's statue to the booth's twelve
 * windows on the north face.
 *
 * Map frame: x east, y north, z up, metres, built turned to bearing 29 (the
 * Manhattan grid; Seventh Avenue and the wedge's east side run at 28.5 deg
 * in OSM), so +y is "uptown". Origin: the centroid of OSM way/258619240
 * ("TKTS", building=yes, building:part=steps, height 5, roof:shape
 * skillion, roof:direction 208), which the model replaces. No other
 * building or part overlaps it. Ground is flat (lidar ground varies 0.1 m
 * over the plaza); y = 0 is the plaza.
 *
 * Measured (USGS 3DEP NY_NewYorkCity lidar, 2017 flight, 0.5 m grid,
 * read in this frame): the first riser at y = -10.4; the flight rising
 * evenly (0.75 m at y = -9, 1.8 at -5, 3.1 at 0, 4.4 at +5) to the platform
 * at ~4.8 m (people on it read 4.7-5.0) from y = 5.2 to the north edge at
 * y = 9.8; the east side straight at x = 6.2 along the frame's y; the west
 * side splayed, from x = -4.1 at the foot to -7.4 at the north edge (OSM's
 * west edge splays the same way, a little more). OSM's outline is 17.7 m
 * long; the lidar wedge is 20.2 m, and the model follows the lidar. Two
 * 4.5-4.9 m returns, about a metre wide across x, at (11.0, 8.0) and
 * (-12.0, 7.8) are taken as the red pylons that photos t2 and t3 show
 * off the north corners.
 * Published: 27 steps (the brief); twelve sales windows; glass the sole
 * structure of the steps; opened 16 October 2008 (Wikipedia, "TKTS").
 * Riser = 4.8 / 27 = 0.178 m, tread = 15.6 / 26 = 0.60 m, both checked
 * against the lidar profile above.
 * Estimated from photos: the white stringer band along each side (0.6 m
 * deep, t1, t4), the platform slab (0.6 m) and its red front edge (t5),
 * the 1.1 m frameless glass balustrades along the sides and round the
 * platform (t1, t5), the booth set 0.5-0.7 m inside the side glass, 3.0 m
 * tall with its two ends rounded over the top (radius 0.9 m), from y = 1.8
 * to 8.6 (t2, t4, t5); the twelve ticket windows as one lit frosted strip
 * 0.95-2.0 m up with dark mullions and a dark counter (t5); the outer
 * north glass wall 0.8 m in from the canopy edge (t5); the side lettering
 * about 2.0 m tall and 3.7 m long on the booth's east face (t4, scaled by
 * the people walking past); the pylons 1.3 x 0.4 x 4.5 m.
 *
 * Lettering (STYLE.md "Famous signs"): the TDF "tkts" logotype, a heavy
 * condensed lowercase sans with the letters set tight, traced from the
 * close straight view of the booth's east face in t4: t with a short
 * right-turned foot, k with arm and leg meeting the stem, a second t, and
 * a narrow s. Drawn twice: large on the booth's east face (where t4 shows
 * it) and repeated eight times, 0.47 m tall, in the frieze over the
 * windows, grey with the second from the east red, as in t3 and t5 (the
 * photo's repeats run on round the rounded ends; here they stop short of
 * the curves). The west
 * face isn't photographed squarely in any licensed photo, so it has none.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - t1 "TKTS red stairs jeh.JPG", Jim.henderson, public domain: the flight
 *   from the south-east with Father Duffy, the white stringer, the glass.
 *   https://commons.wikimedia.org/wiki/File:TKTS_red_stairs_jeh.JPG
 * - t2 "TKTS 47 st jeh.JPG", Jim.henderson, public domain: the north face
 *   and booth from 47th St, the NE pylon, the red canopy edge (2008).
 *   https://commons.wikimedia.org/wiki/File:TKTS_47_st_jeh.JPG
 * - t3 "Time Square - TKTS Stand (48193461362).jpg", Ajay Suresh, CC BY 2.0:
 *   straight on from the north, both pylons, platform rail (2019).
 *   https://commons.wikimedia.org/wiki/File:Time_Square_-_TKTS_Stand_(48193461362).jpg
 * - t4 "TKTS Booth @ Times Square (3619286756).jpg", Rob Young, CC BY 2.0:
 *   from the south-east; the east face, its red "tkts", the stringer.
 *   https://commons.wikimedia.org/wiki/File:TKTS_Booth_@_Times_Square_(3619286756).jpg
 * - t5 "TKTS - Times Square, New York, NY, USA - August 19, 2015 01.jpg",
 *   Giorgio Galeotti, CC BY 4.0: the north face at night, the red-edged
 *   canopy, the lit booth and frieze. Night reference.
 *   https://commons.wikimedia.org/wiki/File:TKTS_-_Times_Square,_New_York,_NY,_USA_-_August_19,_2015_01.jpg
 * - t9 "Father Duffy statue and TKTS booth risers.jpg", Beyond My Ken,
 *   CC BY-SA 3.0: the flight straight on from the south.
 *   https://commons.wikimedia.org/wiki/File:Father_Duffy_statue_and_TKTS_booth_risers.jpg
 * - t8 "TKTS Times Square.JPG", Hisland7, CC BY-SA 3.0: from the top step
 *   looking south over the cross.
 *   https://commons.wikimedia.org/wiki/File:TKTS_Times_Square.JPG
 *
 * Doubts: the flight is drawn as one even run of 27 bleacher steps; the
 * narrower walking stairs at the edges that some photos suggest are not
 * separated. The west splay rests on lidar and OSM; photos from the south
 * don't show it clearly. The pylons' positions come from lidar returns
 * matched to photos, and their number has varied over the years (2009
 * photos show a pair midway along the flight as well); only the north pair
 * is drawn. The booth's plan inside the glass is estimated. The tickers,
 * the window numbers and the small "a service of Theatre Development
 * Fund" line are left out. Night: the booth shell is plain `trim` and
 * stays unlit; the window strip is `entrance` and glows; the glass stays
 * dark.
 */
import { Part, writeGlb, cross, sub, type V3, type MaterialSpec } from './mesh'
import { finish, PALETTE } from './palette'
import { Pen, strokes } from './lettering'

const red = new Part(), tread = new Part(), glass = new Part(), white = new Part(), booth = new Part(), grey = new Part()

// ------------------------------------------------------------ the wedge
const Y0 = -10.4 // the first riser
const YT = 5.2 // the top of the flight, where the platform starts
const YN = 9.8 // the platform's north edge
const H = 4.8 // platform level
const N = 27 // risers
const R = H / N, T = (YT - Y0) / (N - 1)
const XE = 6.2
const xW = (y: number) => -4.1 - ((y - Y0) * 3.3) / (YN - Y0)
const DEEP = 0.6 // stringer and slab depth below the nosing line
/** The underside of the steps and the platform. */
const soffit = (y: number) => Math.max(0, Math.min(H, R + ((y - Y0) * R) / T) - DEEP)

/** A planar quad given counter-clockwise from the side it faces. */
const q = (p: Part, a: V3, b: V3, c: V3, d: V3) => p.quad(a, b, c, d)

// The steps: riser k rises at y_k to height k*R, then its tread runs on.
for (let k = 1; k <= N; k++) {
  const y = Y0 + (k - 1) * T, z0 = (k - 1) * R, z1 = k * R
  const y2 = k === N ? YN : y + T
  q(red, [xW(y), y, z0], [XE, y, z0], [XE, y, z1], [xW(y), y, z1]) // riser, facing south
  q(tread, [xW(y), y, z1], [XE, y, z1], [XE, y2, z1], [xW(y2), y2, z1]) // tread, facing up
  // The sides of this step: white stringer from the step's top down to the soffit.
  const ya = y, yb = y2
  q(white, [XE, ya, soffit(ya)], [XE, yb, soffit(yb)], [XE, yb, z1], [XE, ya, z1])
  q(white, [xW(yb), yb, soffit(yb)], [xW(ya), ya, soffit(ya)], [xW(ya), ya, z1], [xW(yb), yb, z1])
}
// The soffit: the white underside of the flight and the platform, seen through the glass.
{
  const ys = Y0 + (DEEP / R - 1) * T // where the soffit meets the ground
  const pts = [ys, YT, YN - 0.8]
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1]
    q(white, [xW(a), a, soffit(a)], [xW(b), b, soffit(b)], [XE, b, soffit(b)], [XE, a, soffit(a)])
  }
  // The canopy's overhang beyond the north glass, and its red front edge.
  const a = YN - 0.8, z = H - DEEP
  q(white, [xW(a), a, z], [xW(YN), YN, z], [XE, YN, z], [XE, a, z])
  const zr = H - 0.3 // a red band along the top of the fascia, white glass fins below (t5)
  q(white, [XE, YN, z], [xW(YN), YN, z], [xW(YN), YN, zr], [XE, YN, zr])
  q(red, [XE, YN, zr], [xW(YN), YN, zr], [xW(YN), YN, H], [XE, YN, H])
}

// ------------------------------------------------------------ glass
// Outer walls: the two sides under the stringers, and the north wall under the canopy.
const YG = YN - 0.8
{
  const ys = Y0 + (DEEP / R - 1) * T
  const ys2 = [ys, -5, 0, YT, YG] // split into short pieces so they follow the ground
  for (let i = 0; i < ys2.length - 1; i++) {
    const a = ys2[i], b = ys2[i + 1]
    const xa = xW(a) + 0.05, xb = xW(b) + 0.05
    q(glass, [XE - 0.05, a, 0], [XE - 0.05, b, 0], [XE - 0.05, b, soffit(b)], [XE - 0.05, a, soffit(a)])
    q(glass, [xb, b, 0], [xa, a, 0], [xa, a, soffit(a)], [xb, b, soffit(b)])
  }
  const xa = xW(YG) + 0.05
  q(glass, [XE - 0.05, YG, 0], [xa, YG, 0], [xa, YG, H - DEEP], [XE - 0.05, YG, H - DEEP])
}
// Frameless balustrades, 1.1 m, along both sides of the flight and round the platform.
{
  const RAIL = 1.1
  const nose = (y: number) => Math.min(H, R + ((y - Y0) * R) / T)
  const side = (x: (y: number) => number, a: number, b: number) =>
    q(glass, [x(a), a, nose(a)], [x(b), b, nose(b)], [x(b), b, nose(b) + RAIL], [x(a), a, nose(a) + RAIL])
  const e = () => XE - 0.08, w = (y: number) => xW(y) + 0.08
  side(e, Y0, YT); side(e, YT, YN - 0.08)
  side(w, YT, Y0); side(w, YN - 0.08, YT)
  const y = YN - 0.08
  q(glass, [w(y), y, H], [e(), y, H], [e(), y, H + RAIL], [w(y), y, H + RAIL])
}

// ------------------------------------------------------------ the booth
// A white shell with its two ends rounded over the top (the frieze wraps
// round them in t5, and t4 shows the rounded end from the side): one
// profile in x-z, quarter-circle corners of radius BR, run from BY0 to BY1.
const BY0 = 1.8, BY1 = 8.6, BH = 3.0, BR = 0.9
const BXE = XE - 0.55, BXW = xW(BY0) + 0.75 // straight, inside the splayed west glass
/** A quad wound to face `want`. */
function facing(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const n = cross(sub(b, a), sub(c, a))
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}
{
  const prof: [number, number][] = [[BXW, 0], [BXE, 0]]
  for (let i = 0; i <= 4; i++) {
    const t = (i / 4) * (Math.PI / 2)
    prof.push([BXE - BR + BR * Math.cos(t), BH - BR + BR * Math.sin(t)])
  }
  for (let i = 0; i <= 4; i++) {
    const t = Math.PI / 2 + (i / 4) * (Math.PI / 2)
    prof.push([BXW + BR + BR * Math.cos(t), BH - BR + BR * Math.sin(t)])
  }
  const cx = (BXW + BXE) / 2, cz = BH / 2
  for (let i = 0; i < prof.length; i++) {
    const [x0, z0] = prof[i], [x1, z1] = prof[(i + 1) % prof.length]
    if (z0 === 0 && z1 === 0) continue // no floor
    const mx = (x0 + x1) / 2 - cx, mz = (z0 + z1) / 2 - cz
    facing(white, [x0, BY0, z0], [x1, BY0, z1], [x1, BY1, z1], [x0, BY1, z0], [mx, 0, mz])
    // The flat ends: fans from the profile's middle.
    // Profile runs counter-clockwise seen from the north (+y), so these face +y and -y.
    white.tri([cx, BY1, cz], [x1, BY1, z1], [x0, BY1, z0])
    white.tri([cx, BY0, cz], [x0, BY0, z0], [x1, BY0, z1])
  }
}
// The twelve ticket windows (t5): one lit frosted strip with eleven dark
// mullions and a dark sill, under the frieze. `entrance`: pale by day,
// lit at night.
{
  const y = BY1 + 0.02, x0 = BXW + 0.35, x1 = BXE - 0.35, z0 = 0.95, z1 = 2.0
  facing(booth, [x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1], [0, 1, 0])
  const bar = (xa: number, xb: number, za: number, zb: number) => {
    const yb = y + 0.04
    facing(grey, [xa, yb, za], [xb, yb, za], [xb, yb, zb], [xa, yb, zb], [0, 1, 0])
    facing(grey, [xa, y, zb], [xb, y, zb], [xb, yb, zb], [xa, yb, zb], [0, 0, 1])
    facing(grey, [xa, y, za], [xa, y, zb], [xa, yb, zb], [xa, yb, za], [-1, 0, 0])
    facing(grey, [xb, y, za], [xb, y, zb], [xb, yb, zb], [xb, yb, za], [1, 0, 0])
  }
  for (let k = 0; k <= 12; k++) {
    const x = x0 + ((x1 - x0) * k) / 12
    bar(x - 0.05, x + 0.05, z0, z1)
  }
  bar(x0 - 0.05, x1 + 0.05, z0 - 0.12, z0) // the counter
}

// ------------------------------------------------------------ lettering
// The "tkts" logotype in letter units: baseline v = 0, ascender ~1, traced from t4.
const logo = new Pen()
logo.moveTo([0.43, 0.96]).lineTo([0.43, 0.14]).quadTo([0.43, 0.0], [0.62, 0.0], 3)
logo.moveTo([0.25, 0.72]).lineTo([0.64, 0.72])
logo.moveTo([0.75, 1.01]).lineTo([0.75, 0.0])
logo.moveTo([0.78, 0.34]).lineTo([1.11, 0.79])
logo.moveTo([0.88, 0.46]).lineTo([1.18, 0.0])
logo.moveTo([1.37, 0.99]).lineTo([1.37, 0.14]).quadTo([1.37, 0.0], [1.56, 0.0], 3)
logo.moveTo([1.15, 0.72]).lineTo([1.57, 0.72])
logo.moveTo([2.06, 0.66]).cubicTo([2.0, 0.8], [1.68, 0.82], [1.68, 0.6], 5)
  .cubicTo([1.68, 0.42], [2.08, 0.42], [2.08, 0.2], 5).cubicTo([2.08, -0.02], [1.72, -0.02], [1.62, 0.12], 5)
const LOGO_W = 2.17
// Large, on the booth's east face: read from the east, so u runs north.
{
  const s = 1.85, yc = 5.0, zb = 0.35
  strokes(red, logo.paths, {
    width: 0.2, depth: 0.08,
    place: (u, v, w) => [BXE + w * s, yc + (u - LOGO_W / 2) * s, zb + v * s],
  })
}
// The frieze over the windows (t5): "tkts" repeated eight times across the
// north face, grey, the second from the east end red. Read from the north,
// so u runs west. The repeats run on round the rounded ends in the photo;
// here they stop short of the curves.
{
  const s = 0.47, word = LOGO_W * s + 0.02, n = 8
  const x0 = (BXE + BXW) / 2 + (n * word) / 2, zb = 2.15
  for (let k = 0; k < n; k++) {
    const xs = x0 - k * word
    strokes(k === 1 ? red : grey, logo.paths, {
      width: 0.22, depth: 0.08,
      place: (u, v, w) => [xs - u * s, BY1 + w * s, zb + v * s],
    })
  }
}

// ------------------------------------------------------------ pylons
function box(p: Part, cx: number, cy: number, hx: number, hy: number, z0: number, z1: number) {
  const r = (z: number): V3[] => [[cx - hx, cy - hy, z], [cx + hx, cy - hy, z], [cx + hx, cy + hy, z], [cx - hx, cy + hy, z]]
  p.loft([r(z0), r(z1)])
  p.cap(r(z1), true)
}
box(red, 11.0, 8.0, 0.65, 0.2, 0, 4.5)
box(red, -12.0, 7.8, 0.65, 0.2, 0, 4.5)

// ------------------------------------------------------------ write
const parts: Array<{ part: Part; material: MaterialSpec }> = [
  { part: red, material: finish('neon-tkts-red', 0xd8343a, 0.4) },
  { part: tread, material: finish('neon-tkts-tread', 0xb02a33, 0.3) },
  { part: white, material: PALETTE.trim },
  { part: booth, material: PALETTE.entrance },
  { part: grey, material: finish('tkts-grey', 0x6f747a) },
  { part: glass, material: { name: 'glass', color: 0x8cc6dd, roughness: 0.2, opacity: 0.22, doubleSided: true } },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
let top = 0
for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) top = Math.max(top, part.pos[i])
const glb = writeGlb('TKTS booth and red steps', parts, {
  license: 'CC0-1.0', bearing: 29, elevation: 0, height: top,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/258619240'],
})
if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-tkts-red-steps.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${top.toFixed(1)} m`)
