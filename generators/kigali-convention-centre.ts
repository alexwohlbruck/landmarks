/**
 * Kigali Convention Centre, Kigali (Roland Dieterle, 2009-16):
 * procedural, CC0-1.0.
 * bun generators/kigali-convention-centre.ts
 *
 * Writes two levels of detail in the same frame and materials:
 * - models/kigali-convention-centre.glb (low): the spiral dome, its podium
 *   and the convention hall east of it;
 * - models/kigali-convention-centre.detail.glb: the same with the spiral
 *   drawn at three times the angular steps, the crown's mast and stays,
 *   and the podium deck's parapet.
 *
 * The dome's identity is its spiral: the cladding is one continuous band,
 * six turns from the podium to the crown, each turn overlapping the one
 * below as a shingle with a dark edge fin, so the fins are not level rings
 * but run uphill round the dome (they visibly converge on one side in p5
 * and tilt in p1). It is built as a helical strip: at each angle the
 * profile steps out under the fin (soffit, fascia), then the band slopes in
 * and up to the next turn. Where the spiral starts and ends the fin's
 * section is closed with a flat cap.
 *
 * Frame: origin at the area centroid of the OSM multipolygon
 * relation/13200013's outer ring (way/473423695; 30.094251, -1.954710);
 * bearing 13: the ring's long sides run at 102.9 / 282.9 degrees, so model
 * +x runs along them. The dome is OSM's inner ring way/454634582
 * (building=government, roof:shape=round), 63 m across, centred at
 * (-39.0, -2.1) in this frame.
 *
 * Heights (no published dome height was found): measured from the near-level
 * telephoto p1 scaled by the OSM dome's 63 m (17.3 px/m): the podium
 * deck 12 m (the entrance canopy edge, 12-15 m in p1 with the forecourt in
 * front); seven fins (one per turn of the spiral, the top one ringing the
 * crown) at 4.3, 8.7, 13.3, 17.9, 22.3, 26.7 and 30.9 m above the deck, at
 * radii 31.5, 31.5, 29.3, 26.4, 22.6, 17.8 and 12.3 m (read on the fins'
 * left ends in p1); the crown ring at 33.4 m (45.4 m) and the mast to
 * about 52 m. The fins are drawn 1.3 m deep and 0.9 m thick, a little bolder
 * than the real ones (about 1 m and 0.5 m in p1, p5) so they read on a phone. The convention hall east of the dome (white roof in the aerial
 * p4) stands about 6 m over the deck (estimated from p4). The ring's
 * crude outline (OSM traces the podium and hall as one 197 x 84 m
 * quadrilateral) is followed as it is.
 *
 * Ground: the map's terrain (Mapterhorn z12 only; z13-15 404) rises about
 * 6.5 m from the ring's south-west corner to its east end. The podium is
 * built from y = 0 at the lowest corner, so the hall end sits into the
 * slope, as the real hall sits against the hill east of the dome. Elevation
 * 0.
 *
 * Colours, from daylight photos: the dome cladding is a cool silver
 * aluminium (#9c9e99 in p5, #888c9f bluish in the aerial p4, the glazed
 * turns #9d9f9a to #f8f6e9 in sun in p1; p1's upper metal panels read
 * warmer, #aca38d, under its overcast), pulled to #c6cacd so the dome
 * reads as metal; the fins are dark grey steel (#4f5257); the podium glass
 * `window`, its walls and soffits a pale grey concrete, the deck `roof`
 * grey; the hall roof white (#e6dbda in p4).
 *
 * Night: the dome is lit from within in changing colours, most often the
 * blue, yellow and green of the Rwandan flag in bands (p7 "Kigali
 * Convention Center.jpg", night) and white. One colour has to be chosen
 * for a static model: the dome cladding carries `_FLOODLIGHT` (washed in
 * warm white, its own silver), the fins stay dark, the podium glass glows
 * (`window`). The flag-colour scheme is not modelled.
 *
 * Simplified or left out: the dome's lower glazed turns are drawn in the
 * same material as its metal-clad upper turns; the entrance canopy's
 * curved arches, the podium's pavilions, terraces and railings; the hall's
 * clerestories; the Radisson Blu hotel (a separate building) and the IT
 * park.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - p1 "Kigali convention centre.jpg", Schlawgclart, CC0 (main ruler)
 *   https://commons.wikimedia.org/wiki/File:Kigali_convention_centre.jpg
 * - p4 "An aerial of Kigali Convention Center on June 19, 2019. Photo by Emmanuel Kwizera.jpg", Emmanuelkwizera, CC BY-SA 4.0 (aerial: plan, hall, podium)
 *   https://commons.wikimedia.org/wiki/File:An_aerial_of_Kigali_Convention_Center_on_June_19,_2019._Photo_by_Emmanuel_Kwizera.jpg
 * - p5 "Kigali Convention Centre.jpg", Igiraneza Divine, CC0 (the spiral seen from the garden)
 *   https://commons.wikimedia.org/wiki/File:Kigali_Convention_Centre.jpg
 * - p3 "Kigali Convention Centre dome under construction.jpg", leesean, CC BY-SA 2.0
 *   https://commons.wikimedia.org/wiki/File:Kigali_Convention_Centre_dome_under_construction.jpg
 * - p7 "Kigali Convention Center.jpg", IGANZE, CC0 (night)
 *   https://commons.wikimedia.org/wiki/File:Kigali_Convention_Center.jpg
 * - p9 "Umusozi wa Jali.jpg", Endikuemmy, CC BY-SA 4.0 (distant)
 *   https://commons.wikimedia.org/wiki/File:Umusozi_wa_Jali.jpg
 * Look-only: none.
 *
 * Doubts: the dome's heights are photo-scaled (no published figure); the
 * spiral's hand (it rises anticlockwise seen from above here) and where it
 * starts are read from two photos at unknown positions; the hall's height
 * and extent and the podium's height follow a crude OSM ring and one aerial.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { lathe, save, TAU, type Mat } from './cairo-cairo-tower'
import { ccw, offsetRing, fquad, type XY } from './casablanca-hassan-ii-mosque'
import { polyTris } from './berlin-oberbaum-bridge'

// ───────────────────────────── plan (model frame) ─────────────────────────────

/** The outer ring of relation/13200013 in the model frame (colinear points dropped). */
const RING: XY[] = ccw([[-99.0, 43.0], [97.7, 41.7], [99.2, -42.4], [-96.7, -42.6], [-97.9, 0.2]])
const DX = -39.0, DY = -2.1 // dome axis
const DECK = 12 // podium deck
const HALL: XY[] = ccw([[8, 39.5], [95.5, 38.6], [96.9, -40.2], [8, -40.4]])
const HALL_H = 18

/** The fins: radius and height above the deck of each turn's lower edge. */
const FIN_R = [31.5, 31.5, 29.3, 26.4, 22.6, 17.8, 12.3, 6.0]
const FIN_Z = [4.3, 8.7, 13.3, 17.9, 22.3, 26.7, 30.9, 33.0] // the last entry is the crown's foot
const D_FIN = 1.3, H_FIN = 0.9 // fin projection and depth
const CROWN_Z = 33.4, CROWN_R = 4.2

// ───────────────────────────── materials ─────────────────────────────

const M = {
  dome: { ...finish('kcc-dome', 0xc6cacd), floodlight: (_p: V3, n: V3) => (n[1] < -0.5 ? 0.3 : 0.9) } as MaterialSpec,
  fin: finish('kcc-fin', 0x4f5257) as MaterialSpec,
  window: PALETTE.window as MaterialSpec,
  wall: finish('kcc-concrete', 0xcdcac1) as MaterialSpec,
  roof: PALETTE.roof as MaterialSpec,
  hall: finish('kcc-hall-roof', 0xebe5de) as MaterialSpec,
}

// ───────────────────────────── helpers ─────────────────────────────

function capRing(p: Part, ring: XY[], z: number, up: boolean) {
  for (const [a, b, c] of polyTris(ring)) {
    if (up) p.tri([a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z])
    else p.tri([a[0], a[1], z], [c[0], c[1], z], [b[0], b[1], z])
  }
}
function walls(p: Part, ring: XY[], z0: number, z1: number) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}
/** Window bays along every edge of a ring: panels about `bay` wide with `pier` between. */
function bays(p: Part, ring: XY[], z0: number, z1: number, e: number, bay: number, pier: number, off = 0.05) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 2 * e + 1) continue
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * off, a[1] + u[1] * s + n[1] * off, z]
    const nb = Math.max(1, Math.round((L - 2 * e + pier) / (bay + pier)))
    const w = (L - 2 * e - (nb - 1) * pier) / nb
    for (let k = 0; k < nb; k++) {
      const s0 = e + k * (w + pier)
      fquad(p, P(s0, z0), P(s0 + w, z0), P(s0 + w, z1), P(s0, z1), [n[0], n[1], 0])
    }
  }
}
/** Both windings of a planar polygon (for the spiral's end sections). */
function twoSided(p: Part, pts: V3[], plane: (q: V3) => XY) {
  for (const [a, b, c] of polyTris(pts.map(plane))) {
    const f = (q: XY) => pts[pts.findIndex((r) => { const s = plane(r); return s[0] === q[0] && s[1] === q[1] })]
    const A = f(a), B = f(b), C = f(c)
    p.tri(A, B, C)
    p.tri(A, C, B)
  }
}

// ───────────────────────────── the spiral dome ─────────────────────────────

/** Fin radius and height at continuous turn index u (linear between turns). */
function fin(u: number): [number, number] {
  const k = Math.min(FIN_R.length - 2, Math.max(0, Math.floor(u)))
  const t = u - k
  return [FIN_R[k] + (FIN_R[k + 1] - FIN_R[k]) * t, FIN_Z[k] + (FIN_Z[k + 1] - FIN_Z[k]) * t]
}

function dome(shell: Part, fins: Part, steps: number, detail: boolean) {
  const turns = FIN_R.length - 2 // the strip runs u = 0 .. turns; its top edge reaches the crown's foot
  const z0 = DECK
  const at = (u: number, r: number, z: number): V3 => {
    const th = TAU * u
    return [DX + r * Math.cos(th), DY + r * Math.sin(th), z0 + z]
  }
  /** The profile at u: Q0 under the fin (top of the turn below), Q1, Q2 the fin's edge, Q3 the top of this turn. */
  const prof = (u: number): [number, number][] => {
    const [r, z] = fin(u), [r1, z1] = fin(u + 1)
    return [[r - D_FIN, z - H_FIN], [r, z - H_FIN], [r, z], [r1 - D_FIN, z1 - H_FIN]]
  }
  const N = Math.round(turns * steps)
  const du = turns / N
  const RB = FIN_R[0] - D_FIN - 0.6 // the glazed foot under the first turn
  for (let i = 0; i < N; i++) {
    const ua = i * du, ub = (i + 1) * du
    const pa = prof(ua), pb = prof(ub)
    // soffit and fascia in the fin colour, the band in the cladding
    const strip = (k: number, part: Part) => {
      const A = at(ua, pa[k][0], pa[k][1]), B = at(ub, pb[k][0], pb[k][1])
      const C = at(ub, pb[k + 1][0], pb[k + 1][1]), D = at(ua, pa[k + 1][0], pa[k + 1][1])
      part.quad(A, B, C, D)
    }
    strip(0, fins)
    strip(1, fins)
    strip(2, shell)
    // the foot under the first turn
    if (ua < 1 - 1e-9) {
      const A = at(ua, RB, 0), B = at(ub, RB, 0)
      shell.quad(A, B, at(ub, pb[0][0], pb[0][1]), at(ua, pa[0][0], pa[0][1]))
    }
  }
  // the foot's second half: under the last part of the first turn the foot
  // must reach the turn above it, which at u in [0,1) is band 0's own top edge
  // only after a full turn, so the foot ends at Q0(u) as built; the end
  // sections close the spiral's start and end.
  const section = (u: number, from: [number, number][]) => {
    const pts = from.map(([r, z]) => at(u, r, z))
    const th = TAU * u, c = Math.cos(th), s = Math.sin(th)
    twoSided(fins, pts, (q) => [(q[0] - DX) * c + (q[1] - DY) * s, q[2]])
  }
  // start: the fin's section plus the wedge of foot between the two turns
  const p0 = prof(0)
  section(0, [[RB, 0], p0[0], p0[1], p0[2], p0[3]])
  // end: the last turn's profile
  const pe = prof(turns)
  section(turns, pe)

  // crown: a cone from the last turn's top edge to the crown ring, fanned
  const top = (u: number): V3 => { const p = prof(u)[3]; return at(u, p[0], p[1]) }
  for (let i = 0; i < steps; i++) {
    const ua = turns - 1 + i / steps, ub = turns - 1 + (i + 1) / steps
    const ca = at(ua, CROWN_R, CROWN_Z), cb = at(ub, CROWN_R, CROWN_Z)
    shell.quad(top(ua), top(ub), cb, ca)
  }
  // the seam where the crown cone meets the spiral's end
  const seamA = top(turns - 1), seamB = top(turns), seamC = at(turns, CROWN_R, CROWN_Z)
  shell.tri(seamA, seamB, seamC)
  shell.tri(seamA, seamC, seamB)
  // the crown ring and cap
  lathe(fins, DX, DY, [[CROWN_R, z0 + CROWN_Z], [CROWN_R, z0 + CROWN_Z + 0.9]], 16)
  lathe(shell, DX, DY, [[CROWN_R, z0 + CROWN_Z + 0.9], [0, z0 + CROWN_Z + 1.6]], 16)
  if (detail) {
    // the mast and its four stays
    lathe(fins, DX, DY, [[0.35, z0 + CROWN_Z + 0.9], [0.12, z0 + CROWN_Z + 7], [0, z0 + CROWN_Z + 7.1]], 8)
    lathe(fins, DX, DY, [[2.2, z0 + CROWN_Z + 0.9], [0.4, z0 + CROWN_Z + 3.2], [0, z0 + CROWN_Z + 3.3]], 4, { facet: true })
  }
}

// ───────────────────────────── the model ─────────────────────────────

function build(detail: boolean): Mat[] {
  const shell = new Part(), fins = new Part(), win = new Part(), wall = new Part(), roof = new Part(), hall = new Part()

  // ── Podium: a glazed storey set back under a
  // deck whose edge overhangs it (no ledge at the base: the ground rises
  // 6.5 m along the ring and would bury one).
  const glass = offsetRing(RING, -1.8)
  walls(wall, glass, 0, DECK - 1.2)
  bays(win, glass, 4.6, DECK - 1.6, 1.5, 7, 1.2)
  walls(wall, RING, DECK - 1.2, DECK)
  capRing(wall, RING, DECK - 1.2, false)
  capRing(roof, RING, DECK, true)
  if (detail) {
    const lip = offsetRing(RING, -0.3)
    walls(wall, RING, DECK, DECK + 1.1)
    walls(wall, [...lip].reverse(), DECK, DECK + 1.1)
    for (let i = 0; i < RING.length; i++) {
      const a = RING[i], b = RING[(i + 1) % RING.length], c = lip[(i + 1) % RING.length], d = lip[i]
      wall.quad([a[0], a[1], DECK + 1.1], [b[0], b[1], DECK + 1.1], [c[0], c[1], DECK + 1.1], [d[0], d[1], DECK + 1.1])
    }
  }

  // ── The convention hall east of the dome: a raised block with a glazed
  // clerestory band and a white roof.
  walls(wall, HALL, DECK, HALL_H)
  bays(win, HALL, DECK + 1.2, HALL_H - 1.5, 2, 9, 2.5)
  capRing(hall, HALL, HALL_H, true)

  // ── The dome.
  dome(shell, fins, detail ? 72 : 24, detail)

  return [
    { part: shell, material: M.dome },
    { part: fins, material: M.fin },
    { part: win, material: M.window },
    { part: wall, material: M.wall },
    { part: roof, material: M.roof },
    { part: hall, material: M.hall },
  ]
}

if (import.meta.main) {
  const extras = { landmark: 'Kigali Convention Centre', source: 'generators/kigali-convention-centre.ts' }
  await save('kigali-convention-centre.glb', 'kigali-convention-centre', build(false), 5000, 250_000, extras)
  await save('kigali-convention-centre.detail.glb', 'kigali-convention-centre', build(true), 40_000, 1_500_000, extras)
}
