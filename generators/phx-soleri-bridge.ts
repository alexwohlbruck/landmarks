/**
 * Soleri Bridge and Plaza, Scottsdale Waterfront, Arizona (Paolo Soleri,
 * 2010) — original procedural geometry, CC0-1.0.
 * bun generators/phx-soleri-bridge.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin on the
 * ground at -111.92665, 33.50125, within 1.1 m of the centroid of the
 * bridge outline OSM way/1564814339 (man_made=bridge), which it replaces.
 * The walkway OSM way/288249761 (highway=cycleway, bridge=yes) runs along
 * the deck; the deck and its surface are the model's (docs/reference.md,
 * Bridges).
 *
 * Identity (photos below):
 *  1. The two tall stainless-steel pylons standing side by side on the
 *     south plaza, a narrow slot between them (the solar-calendar slot:
 *     the sun shines through it at solar noon on the solstices and
 *     equinoxes).                                   (xing, dru1, dru2)
 *  2. Two stays from the pylon tops fanning out to the deck's sides.  (xing)
 *  3. The low deck with solid stainless side walls over the Arizona Canal,
 *     its grey walking surface with a red line down the middle.      (xing)
 *  4. The bell assembly on the plaza: a curved stainless shell, red inside,
 *     with Soleri's bronze bells hung from a frame stayed to the pylons.
 *                                                       (dru1, dru2, dru3)
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020), 0.5 m grid
 * centred on the origin, above ground_min 388.15. z = lidar - 1.0, where
 * 1.0 is the canal under the deck as the map's terrain draws it (Mapterhorn
 * reads the canal about 0.3 m under the lidar's banks), so the model's base
 * is the water under the span. Measured: the deck surface 2.1 (z 1.1); the
 * side walls' tops 3.2 (z 2.2); the south plaza 1.8–2.0, the north bank
 * 1.2; the pylon tops 22.1 (z 21.1, about 20.3 m over the plaza; published
 * 64 ft, 19.5 m), each about 2 m across, centred at x 0.0 and 2.1, y -37;
 * the stays: the west one at x -1 (11.6 at y -14, 17.2 at y -30), the east
 * one at x 3–4 (8.0 at y -4, 18.4 at y -32), both landing on the side walls
 * near y +8; the bell shell about 6 m tall at x -8..-2, y -42..-38.
 * Deck ends: the south end meets the plaza at the deck's own level (y -17);
 * the north end stops at y +23 where steps go down to the bank (the steps
 * are outside the outline and left to the map); a short abutment carries it
 * to the ground there.
 * Estimated: the deck girder's depth (down to the canal), the slot width
 * (0.25 m), the shell's radius and opening, the bell frame.
 *
 * Photos (evidence):
 *  xing "Soleri bridge Scottsdale 003.JPG", Pedro Xing, CC0 (from the north
 *       end, looking south along the deck to the pylons)
 *       https://commons.wikimedia.org/wiki/File:Soleri_bridge_Scottsdale_003.JPG
 *  dru1, dru2, dru3 "Soleri Bridge", Dru Bloomfield - At Home, CC BY 2.0
 *       https://www.flickr.com/photos/14544437@N07/5688673845
 *       https://www.flickr.com/photos/14544437@N07/5689245438
 *       https://www.flickr.com/photos/14544437@N07/5688673561
 * USGS NAIP orthophoto (public domain) for the plan. No look-only sources.
 * No commercial imagery.
 *
 * Doubts: any back-stays south of the pylons are not clear in the lidar or
 * the photos and are not drawn; the canal is drawn by the map's terrain
 * only 0.3 m under the banks, so the girder is shallower than the real one.
 *
 * Night: the pylons are floodlit (_FLOODLIGHT, strongest low down).
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { prism, save, type XY } from './atl-flatiron-building'

const steel = new Part(), deck = new Part(), red = new Part(), pyl = new Part()
const Z = (H: number) => H - 1.0

function face(p: Part, q: V3[], want: V3) {
  const b = [q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]], c = [q[2][0] - q[0][0], q[2][1] - q[0][1], q[2][2] - q[0][2]]
  const g = [b[1] * c[2] - b[2] * c[1], b[2] * c[0] - b[0] * c[2], b[0] * c[1] - b[1] * c[0]]
  const r = g[0] * want[0] + g[1] * want[1] + g[2] * want[2] < 0 ? [...q].reverse() : q
  if (r.length === 3) p.tri(r[0], r[1], r[2])
  else p.quad(r[0], r[1], r[2], r[3])
}
const circ = (c: XY, r: number, n: number, a0 = 0): XY[] => Array.from({ length: n }, (_, i) => [c[0] + r * Math.cos(a0 + (i / n) * 2 * Math.PI), c[1] + r * Math.sin(a0 + (i / n) * 2 * Math.PI)] as XY)

/** A round rod between two points (a cable drawn thicker than it is). */
function rod(p: Part, a: V3, b: V3, r: number, n = 6) {
  const t: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...t)
  const u: V3 = [t[0] / L, t[1] / L, t[2] / L]
  let s: V3 = Math.abs(u[2]) < 0.9 ? [-u[1], u[0], 0] : [1, 0, 0]
  const sl = Math.hypot(...s); s = [s[0] / sl, s[1] / sl, s[2] / sl]
  const w: V3 = [u[1] * s[2] - u[2] * s[1], u[2] * s[0] - u[0] * s[2], u[0] * s[1] - u[1] * s[0]]
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * 2 * Math.PI, a1 = ((i + 1) / n) * 2 * Math.PI, am = (a0 + a1) / 2
    const o = (q: V3, ang: number): V3 => [q[0] + r * (Math.cos(ang) * s[0] + Math.sin(ang) * w[0]), q[1] + r * (Math.cos(ang) * s[1] + Math.sin(ang) * w[1]), q[2] + r * (Math.cos(ang) * s[2] + Math.sin(ang) * w[2])]
    const nm: V3 = [Math.cos(am) * s[0] + Math.sin(am) * w[0], Math.cos(am) * s[1] + Math.sin(am) * w[1], Math.cos(am) * s[2] + Math.sin(am) * w[2]]
    face(p, [o(a, a0), o(a, a1), o(b, a1), o(b, a0)], nm)
  }
}

// ── the deck: a girder from the canal up to the walking surface, with
// solid stainless side walls ──
const X0 = -2.2, X1 = 4.2, YS = -17, YN = 23, DT = Z(2.1), WT = Z(3.2), WW = 0.35
prism(steel, [[X0, YS], [X1, YS], [X1, YN], [X0, YN]], 0, DT, deck, 0.1)
prism(steel, [[X0, YS], [X0 + WW, YS], [X0 + WW, YN], [X0, YN]], DT, WT, steel, 0.12)
prism(steel, [[X1 - WW, YS], [X1, YS], [X1, YN], [X1 - WW, YN]], DT, WT, steel, 0.12)
// the red line down the deck
face(red, [[0.85, YS + 0.5, DT + 0.03], [1.15, YS + 0.5, DT + 0.03], [1.15, YN - 0.5, DT + 0.03], [0.85, YN - 0.5, DT + 0.03]], [0, 0, 1])

// ── the pylons: two 2 m stainless tubes with a slot between ──
const PT = Z(22.1), PY = -37
for (const cx of [0.0, 2.2]) prism(pyl, circ([cx, PY], 1.0, 16), 0, PT, pyl, 0.15)

// ── the stays, pylon tops to the side walls near y +8 ──
rod(steel, [-0.3, PY + 0.6, PT - 0.6], [X0 + 0.2, 8, WT], 0.09)
rod(steel, [2.5, PY + 0.6, PT - 0.6], [X1 - 0.2, 7, WT], 0.09)

// ── the bell shell: a curved stainless wall, red inside, open to the west ──
{
  const c: XY = [-4.8, -40], R = 2.6, T = 0.3, top = Z(7.8), n = 10
  const a0 = -0.55 * Math.PI, a1 = 0.55 * Math.PI // the back of the shell faces east
  for (let i = 0; i < n; i++) {
    const t0 = a0 + ((a1 - a0) * i) / n, t1 = a0 + ((a1 - a0) * (i + 1)) / n, tm = (t0 + t1) / 2
    const P = (r: number, t: number, z: number): V3 => [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t), z]
    face(steel, [P(R, t0, 0), P(R, t1, 0), P(R, t1, top), P(R, t0, top)], [Math.cos(tm), Math.sin(tm), 0])
    face(red, [P(R - T, t0, 0), P(R - T, t1, 0), P(R - T, t1, top), P(R - T, t0, top)], [-Math.cos(tm), -Math.sin(tm), 0])
    face(steel, [P(R - T, t0, top), P(R - T, t1, top), P(R, t1, top), P(R, t0, top)], [0, 0, 1])
  }
  for (const t of [a0, a1]) {
    const P = (r: number, z: number): V3 => [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t), z]
    const nn: V3 = t < 0 ? [Math.sin(t), -Math.cos(t), 0] : [-Math.sin(t), Math.cos(t), 0]
    face(steel, [P(R - T, 0), P(R, 0), P(R, top), P(R - T, top)], nn)
  }
  // the bell frame over the shell, stayed to the pylons
  const apex: V3 = [c[0] - 0.4, c[1], top + 1.4]
  for (const t of [a0, a1, Math.PI]) rod(steel, [c[0] + R * Math.cos(t), c[1] + R * Math.sin(t), top], apex, 0.07, 5)
  rod(steel, apex, [0.0, PY, PT - 3], 0.06, 5)
  rod(steel, apex, [2.2, PY, PT - 1.5], 0.06, 5)
}

await save('phx-soleri-bridge', 'Soleri Bridge', [
  { part: steel, material: finish('soleri-steel', 0xc4c9ce, 0.4) },
  { part: pyl, material: { ...finish('soleri-pylon', 0xc9ced3, 0.4), floodlight: (p) => Math.max(0, 0.7 - p[2] / 30) } },
  { part: deck, material: PALETTE.roof },
  { part: red, material: finish('soleri-red', 0xb8493c) },
], { height: Z(22.1), anchor: [33.50125, -111.92665], bearing: 0 }, 5000)
