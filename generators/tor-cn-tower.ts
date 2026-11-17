/**
 * CN Tower, Toronto (1976, John Andrews Architects / WZMH; structural
 * engineers NCK) — original procedural geometry, CC0-1.0.
 * bun generators/tor-cn-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Bearing 0, built in true orientation. Anchor = the centre of the
 * main pod's OSM parts (way/288273793 etc.), 0.5 m east and 0.9 m south of
 * the outline's vertex mean: -79.3870828, 43.6425876.
 *
 * Identity (from the photos below):
 *  1. A Y-plan concrete shaft: a hexagonal core with three buttress legs on
 *     alternate faces, the legs' blunt ends drawing in in a straight taper
 *     from 21 m out at the ground to a few metres off the core under the
 *     pod.                                      (harbour, delso, base)
 *  2. The glazed elevator runs, a dark strip in each of the three crotches
 *     between the legs, from the base to the pod.    (jarvis, shaft, base)
 *  3. The main pod: a white "doughnut" ring at the bottom, a dark soffit
 *     flaring out over it, two dark window bands between white rims, a
 *     grey sloping roof with the red stripe at its top, a grey drum.
 *                                                  (pod, antenna, harbour)
 *  4. The plain hexagonal shaft above the pod, the small SkyPod ring with
 *     its white ribbed cap, and the white antenna mast stepping in three
 *     times, with red bands and a red tip.         (antenna, harbour)
 *
 * No lidar (Canada; USGS 3DEP does not cover it). Heights:
 *  - published (Wikipedia, CN Tower facts): 553.3 m to the antenna tip;
 *    SkyPod 447 m; main pod levels 342 m (glass floor), 346 m (LookOut),
 *    351 m (360 Restaurant); antenna 102 m.
 *  - OSM parts (way/288273793 white 330-338, way/288273795 glass 338-360,
 *    way/288273794 metal 360-370; SkyPod way/288273454 440-457; antenna
 *    parts 457-553). Used for the pod's levels and the mast's steps.
 *  - photo-scaled (harbour, delso: far, near-orthographic views from the
 *    lake, scale 0.345 m/px from the pod and the mast): the pod's band
 *    heights and radii (window bands r 21.5, OSM says 23; the photos read
 *    41-43 m across in both, so the photo value is used), the shaft's
 *    projected width at every height (17 m under the pod, 27 m at 190 m,
 *    37 m at the ground in heli: a straight taper of the leg tips), the SkyPod
 *    (r 9.2), the mast's radii and the heights of its red bands.
 *  - plan: OSM way/32742038 (outline) and the three leg parts
 *    way/288273458/459/460: leg tips 28-29.5 m from the pod centre at
 *    bearings 46.6, 166.6 and 286.6, 5.9 m wide; the core way/288273461.
 *    The bearings are used; the tips' 28-29.5 m reach is not (see tipR):
 *    the photos put the legs' ends 21 m out at the ground, so the model
 *    leaves the outer 8 m of OSM's leg outlines empty. A doubt.
 * Estimated: the core's taper (9.5 m circumradius at the ground to 6.4 m
 * under the pod, 5.6 m under the SkyPod), the legs' tip width at the top
 * (3.5 m), the elevator strips' width, the equipment boxes above the pod,
 * the soffit's depth.
 * Left out: the base entrance pavilion and the EdgeWalk rail (separate OSM
 * buildings, not replaced), the soffit struts, the antennas on the drum.
 *
 * Night: the shaft and pod are lit by the coloured LED system; drawn as a
 * warm `_FLOODLIGHT` wash on the concrete and the pod's white rings. The
 * pod's window bands and the elevator runs are `window`.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  harbour  "Toronto - ON - Toronto Harbourfront7.jpg", Taxiarchos228
 *           (Wladyslaw), CC BY-SA 3.0, 2008 — from the south, the lake.
 *  pod      "Toronto - ON - CN Tower Turmkorb.jpg", Taxiarchos228, CC BY 3.0.
 *  antenna  "Toronto - ON - CN Tower - Antennenspitze.jpg", Taxiarchos228,
 *           CC BY-SA 3.0 — the pod's roof, SkyPod and mast from a helicopter.
 *  shaft    "Toronto - ON - Schaft des CN Tower.jpg", Taxiarchos228, CC BY-SA 3.0.
 *  delso    "CN Tower, Toronto, Canada9.jpg", Diego Delso, CC BY-SA 3.0.
 *  jarvis   "DSC08940 - CN Tower (37078782931).jpg", Dennis G. Jarvis, CC BY-SA 2.0.
 *  base     "Base of the CN Tower Toronto Canada 2025-09-07 16-20-13 1.jpg",
 *           G. Edward Johnson, CC BY 4.0; "CN Tower Base (20111603654).jpg",
 *           Evan Delshaw, CC BY 2.0.
 *  heli     "Toronto - ON - CN Tower from Heli.jpg", Taxiarchos228, CC BY-SA 3.0.
 *  night    "CN Tower by night.jpg", Christophe Krief, CC BY-SA 4.0.
 *  section  "CN Tower Turmkorb-Modell.png", Niabot, CC BY-SA 3.0 (a cut-away
 *           rendering of the pod: its levels and the doughnut's section).
 * No look-only sources. No commercial imagery.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, revolve, save, type XY } from './atl-tech-tower'

const concrete = new Part(), white = new Part(), grey = new Part(), win = new Part(), red = new Part()
const D2R = Math.PI / 180

/** A quad wound to face `want`. */
function face(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const n = cross(sub(b, a), sub(c, a))
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}
const pol = (r: number, a: number): XY => [r * Math.cos(a), r * Math.sin(a)]

// ── The Y shaft ──
const LEG_BEARING = [46.6, 166.6, 286.6]
const LEG_A = LEG_BEARING.map((b) => (90 - b) * D2R) // math angles, CCW from east
const POD_Z = 331
/**
 * Leg tip radius: a straight taper from 21 m at the ground to 8.5 m under
 * the pod, fitted to the shaft's projected width in harbour (17.3 m at
 * 325 m, 20.7 at 263, 26.6 at 190), delso (24.8 at 188) and heli (about
 * 37 m at the ground against the pod's 41). OSM's leg parts reach 28-29.5 m
 * at the ground; no photo shows the legs that wide, so they are not used.
 */
const tipR = (z: number) => 21 - (12.5 * z) / POD_Z
/** Hexagonal core circumradius. */
const coreR = (z: number) => (z <= POD_Z ? 9.5 - (3.1 * z) / POD_Z : 6.4 - ((z - POD_Z) * 0.8) / 107)
const tipW = (z: number) => 5.9 - (2.4 * Math.min(z, POD_Z)) / POD_Z

/** The shaft's plan at height z, counter-clockwise: per leg its root corners and chamfered tip. */
function section(z: number): XY[] {
  const rc = coreR(z), R = tipR(z), w = tipW(z) / 2, ch = Math.min(0.8, w * 0.3)
  const out: XY[] = []
  for (const a of LEG_A) {
    const d: XY = [Math.cos(a), Math.sin(a)], e: XY = [-Math.sin(a), Math.cos(a)]
    const L = (u: number, v: number): XY => [d[0] * u + e[0] * v, d[1] * u + e[1] * v]
    out.push(pol(rc, a - 30 * D2R), L(R - ch, -w), L(R, -w + ch), L(R, w - ch), L(R - ch, w), pol(rc, a + 30 * D2R))
  }
  return out
}
const LEVELS = [0, 6, 15, 28, 45, 65, 90, 120, 150, 185, 220, 255, 290, 315, POD_Z]
const rings = LEVELS.map((z) => section(z).map(([x, y]) => [x, y, z] as V3))
concrete.loft(rings)

// The elevator runs: a glazed strip on each crotch face of the core.
for (let k = 0; k < 3; k++) {
  const a0 = LEG_A[k] + 30 * D2R, a1 = LEG_A[k] + 90 * D2R, mid = (a0 + a1) / 2
  const n: V3 = [Math.cos(mid), Math.sin(mid), 0]
  const pt = (z: number, s: number): V3 => {
    const A = pol(coreR(z), a0), B = pol(coreR(z), a1)
    return [A[0] + (B[0] - A[0]) * s + n[0] * 0.06, A[1] + (B[1] - A[1]) * s + n[1] * 0.06, z]
  }
  const zs = [4, ...LEVELS.slice(1, -1), 326]
  for (let i = 0; i < zs.length - 1; i++) {
    face(win, pt(zs[i], 0.25), pt(zs[i], 0.75), pt(zs[i + 1], 0.75), pt(zs[i + 1], 0.25), n)
  }
}

// The plain hexagonal shaft above the pod, to the SkyPod.
{
  const hex = (z: number) => LEG_A.flatMap((a) => [pol(coreR(z), a - 30 * D2R), pol(coreR(z), a + 30 * D2R)]).map(([x, y]) => [x, y, z] as V3)
  concrete.loft([hex(368), hex(400), hex(441)])
  // Equipment boxes on the leg faces just above the pod's roof.
  for (const a of LEG_A) {
    const d: XY = [Math.cos(a), Math.sin(a)], e: XY = [-Math.sin(a), Math.cos(a)], r0 = coreR(372) * 0.8
    const L = (u: number, v: number): XY => [d[0] * u + e[0] * v, d[1] * u + e[1] * v]
    prism(grey, [L(r0, -2.2), L(r0 + 2.6, -2.2), L(r0 + 2.6, 2.2), L(r0, 2.2)], 370.4, 377, grey, 0.3)
  }
}

// ── The main pod ──
const K = 40
const ring = (p: Part, prof: [number, number][], n = K) => revolve(p, [0, 0], prof, n, 0, false, false)
ring(grey, [[6.0, 323.5], [16.8, 331.4]]) // underside, into the doughnut
ring(white, [[16.8, 331.4], [18.6, 331.6], [19.8, 332.6], [20.3, 334.5], [20.4, 337], [20.1, 339.6], [19.2, 341.6], [17.9, 342.6], [17.4, 342.8]]) // the doughnut
ring(grey, [[17.4, 342.8], [21.0, 346.3]]) // the soffit flaring out over it
ring(white, [[21.0, 346.3], [21.2, 346.5], [21.2, 347.3]])
ring(win, [[21.2, 347.3], [21.5, 351.0]])
ring(white, [[21.5, 351.0], [21.7, 351.2], [21.7, 352.2], [21.5, 352.4]])
ring(win, [[21.5, 352.4], [21.0, 356.4]])
ring(white, [[21.0, 356.4], [21.0, 357.4], [20.7, 357.6]])
ring(grey, [[20.7, 357.6], [16.6, 363.0]]) // the sloping roof
ring(red, [[16.6, 363.0], [16.6, 364.2]]) // the red stripe
ring(grey, [[16.6, 364.2], [16.6, 370.0], [16.3, 370.4]]) // the drum
ring(grey, [[16.3, 370.4], [0, 370.4]])

// ── SkyPod and the mast ──
ring(white, [[5.0, 437.0], [9.2, 440.6]], 24)
ring(win, [[9.2, 440.6], [9.2, 443.4]], 24)
ring(white, [[9.2, 443.4], [9.5, 443.8], [9.3, 446.6], [7.4, 449.6], [4.4, 452.0]], 24)
const M = 16
ring(white, [[4.4, 452.0], [4.3, 492.0]], M)
ring(red, [[4.3, 492.0], [4.3, 494.4]], M)
ring(white, [[4.3, 494.4], [3.1, 495.0], [3.0, 513.0]], M)
ring(red, [[3.0, 513.0], [3.0, 515.0]], M)
ring(white, [[3.0, 515.0], [1.6, 515.4], [1.5, 532.0]], M)
ring(red, [[1.5, 532.0], [1.5, 534.0]], M)
ring(white, [[1.5, 534.0], [1.2, 534.2], [1.1, 546.0]], M)
ring(red, [[1.1, 546.0], [0.9, 553.3], [0, 553.3]], M)

// Night: the LED system washes the shaft, strongest low; the pod's white rings catch it.
const shaftLit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : 0.45 - 0.2 * Math.min(1, p[2] / 330))
const podLit = (p: V3, n: V3) => (p[2] > 330 && p[2] < 360 ? (n[2] > 0.7 ? 0.3 : 0.75) : 0.35)
await save('tor-cn-tower', 'CN Tower', [
  { part: concrete, material: { ...finish('cn-concrete', 0xd6cdbd), floodlight: shaftLit } },
  { part: white, material: { ...PALETTE.trim, floodlight: podLit } },
  { part: grey, material: finish('cn-grey', 0xbcbfc1) },
  { part: win, material: PALETTE.window },
  { part: red, material: finish('cn-red', 0xc4473d) },
], { height: 553.3, anchor: [43.6425876, -79.3870828], bearing: 0 }, 5000)
