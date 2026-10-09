/**
 * Federal Hall National Memorial, 26 Wall Street — procedural, CC0-1.0, no textures.
 * bun generators/nyc-federal-hall.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. The Wall Street
 * front faces model south (true bearing ~217°), Pine Street model north.
 * Placed at bearing 36.6°, the long axis of the outline. Anchor: area
 * centroid of the OSM outline way/109337830. Kit from nyc-city-hall.ts.
 *
 * Evidence
 * - OSM way/109337830 (outline, 28.4 × 55.6 m; tagged marble, roof gabled
 *   along the long axis, roof colour #56514a), the cella part 276177619
 *   (28.4 × 46.5 m) and sixteen 1.8 m column circles (276177584–616), eight
 *   at each end on a 3.7 m pitch.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017) in the model frame: eaves 17 m,
 *   ridge 21 m above Wall Street's low corner (6.9 m NAVD88); Pine Street
 *   stands ~3 m higher; a raised round skylight over the rotunda reaches
 *   ~24 m at (−0.5, −7); the statue of Washington stands on the Wall Street
 *   steps (not modelled; it is not part of the building).
 * - Published: 1842 (Town & Davis, John Frazee, Samuel Thomson), Greek
 *   Revival on the Parthenon's plan, Tuckahoe marble, eight Doric columns
 *   front and back, a rotunda under a coffered dome hidden inside the roof
 *   (Wikipedia; NPS; NRHP 66000095).
 * - Photos (Wikimedia Commons): /tmp/city/nyc/work/nyc-federal-hall/photos/credits.txt.
 *   Wall Street front (Ajay Suresh; NPS FEHA3187), south-west corner with
 *   the long side (Arild Vågen), from up Broad Street (NPS FEHA1054/1055),
 *   the Pine Street rear and east side (Jim.henderson).
 * - NAIP orthophoto (USGS, public domain): a grey roof.
 *
 * Estimated: the stylobate's height (4 m over Wall Street, a 16-riser flight
 * in the photos), column 9.3 m and entablature 3.3 m (photo against the
 * 3.7 m column pitch), the pediment 4.2 m, the pilaster count on the long
 * sides (13), the side and frieze windows (from the rear photo), the
 * skylight's size.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, type XY } from './nyc-570-lexington'
import { block, column, rectPanel, spread } from './nyc-city-hall'

const marble = new Part(), win = new Part(), roof = new Part(), dark = new Part(), porch = new Part()

const X = 14.2, Y0 = -27.7, Y1 = 27.7 // outline
const CY0 = -24.0, CY1 = 22.6 // cella walls (OSM 276177619)
const ST = 4.0 // stylobate (top of the podium / column bases)
const COL = 9.3, ENT = 3.3, PED = 4.2
const ZC = ST + COL, ZE = ZC + ENT, ZR = ZE + PED // 13.3, 16.6, 20.8

// --- Podium, with the Wall Street flight and its cheek blocks ---
block(marble, -X, Y0, X, Y1, 0, ST)
const steps = 8, run = 0.6
for (let k = 0; k < steps; k++) {
  const top = ST - (ST / steps) * (k + 1) + ST / steps
  block(marble, -X + 2.2, Y0 - (k + 1) * run, X - 2.2, Y0 - k * run + 0.01, 0, top - ST / steps)
}
for (const sx of [-1, 1]) block(marble, sx > 0 ? X - 2.2 : -X, Y0 - steps * run, sx > 0 ? X : -X + 2.2, Y0, 0, ST + 0.4)
// Pine Street: a short flight, the street standing ~3 m higher.
for (let k = 0; k < 3; k++) block(marble, -X + 1, Y1 + k * 0.5, X - 1, Y1 + (k + 1) * 0.5, 0, ST - 0.35 * (k + 1))

// --- Cella: the solid marble box behind the columns ---
const cella: XY[] = [[-X + 1.0, CY0], [X - 1.0, CY0], [X - 1.0, CY1], [-X + 1.0, CY1]]
prism({ wall: marble, win: null, roof: null, ring: cella, z0: ST, z1: ZC, facade: null, bevel: 0.2 })

// Long sides: thirteen square pilasters (antae) with tall windows between.
const pil = 1.6
for (const sx of [-1, 1]) {
  const xs = sx * (X - 1.0)
  const ys = spread(CY0 + 0.2, CY1 - 0.2, 13).map((y, i, a) => CY0 + 0.7 + ((CY1 - CY0 - 1.4) * i) / (a.length - 1))
  for (const y of ys) block(marble, sx > 0 ? xs - 0.1 : xs - 0.9, y - pil / 2, sx > 0 ? xs + 0.9 : xs + 0.1, y + pil / 2, ST, ZC)
  // Windows in every other bay.
  const a: XY = sx > 0 ? [xs, CY0] : [xs, CY1], b: XY = sx > 0 ? [xs, CY1] : [xs, CY0]
  for (let i = 0; i < ys.length - 1; i++) {
    if (i % 2 === 0) continue
    const yc = (ys[i] + ys[i + 1]) / 2, s = sx > 0 ? yc - CY0 : CY1 - yc
    rectPanel(win, a, b, s, 1.2, ST + 2.0, ZC - 2.4)
  }
}

// --- Porticoes: eight Doric columns at each end, entablature, pediment ---
const colX = [-12.95, -9.25, -5.55, -1.85, 1.85, 5.55, 9.25, 12.95]
for (const yc of [-26.4, 26.4]) {
  for (const x of colX) column(marble, x, yc, 0.86, ST, ZC, { n: 12, base: 0.01, cap: 0.55, taper: 0.8 })
  // End walls of the porch, in the portico's shade: the door and two windows.
  const front = yc < 0
  const wy = front ? CY0 : CY1
  const a: XY = front ? [-X, wy] : [X, wy], b: XY = front ? [X, wy] : [-X, wy]
  rectPanel(porch, a, b, X, 2 * X - 1.4, ST, ZC, 0.02)
  rectPanel(dark, a, b, X, 2.6, ST, ST + 6.2)
  for (const s of [X - 8.2, X + 8.2]) rectPanel(dark, a, b, s, 1.6, ST + 1.2, ST + 4.8)
  // Porch ceiling: the entablature is solid back to the cella.
}
// Entablature ring round the whole temple, the frieze a little set back.
block(marble, -X, Y0, X, Y1, ZC, ZC + 1.2)
block(marble, -X + 0.15, Y0 + 0.15, X - 0.15, Y1 - 0.15, ZC + 1.2, ZE - 0.7)
block(marble, -X - 0.35, Y0 - 0.35, X + 0.35, Y1 + 0.35, ZE - 0.7, ZE)
// Gable roof along y, and the pediments at both ends (a raking cornice proud of the tympanum).
{
  const e = X + 0.35, y0 = Y0 - 0.35, y1 = Y1 + 0.35
  roof.quad([e, y0, ZE], [e, y1, ZE], [0, y1, ZR], [0, y0, ZR])
  roof.quad([-e, y1, ZE], [-e, y0, ZE], [0, y0, ZR], [0, y1, ZR])
  for (const [y, f] of [[y0, -1], [y1, 1]] as [number, number][]) {
    // Raking cornice slab and the tympanum set 0.35 m back.
    const t = y - f * 0.35
    const A: V3 = [-e, y, ZE], B: V3 = [e, y, ZE], C: V3 = [0, y, ZR]
    const At: V3 = [-X, t, ZE], Bt: V3 = [X, t, ZE], Ct: V3 = [0, t, ZR - 0.45]
    if (f < 0) { marble.tri(At, Bt, Ct) } else { marble.tri(Bt, At, Ct) }
    // The raking cornice: a band 0.45 m deep along both slopes, with its soffit (both windings).
    const k = 0.45
    for (const [p, q] of [[A, C], [C, B]] as [V3, V3][]) {
      const pb: V3 = [p[0], y, p[2] - k], qb: V3 = [q[0], y, q[2] - k]
      if (f < 0) marble.quad(pb, qb, q, p); else marble.quad(qb, pb, p, q)
      const pi: V3 = [p[0], t, p[2] - k], qi: V3 = [q[0], t, q[2] - k]
      marble.quad(pi, qi, qb, pb); marble.quad(pb, qb, qi, pi)
    }
  }
}
// The rotunda's dome, a low round crown just breaking the roof line (lidar 23–24 m;
// hidden from the street behind the pediments).
{
  const cx = -0.5, cy = -7.2
  prism({ wall: roof, win: null, roof: null, ring: Array.from({ length: 14 }, (_, i) => [cx + 3.6 * Math.cos((i * 2 * Math.PI) / 14), cy + 3.6 * Math.sin((i * 2 * Math.PI) / 14)] as XY), z0: ZE, z1: ZR + 0.5, facade: null, bevel: 0.15 })
  const rings: V3[][] = [[3.7, 0], [3.3, 0.7], [2.4, 1.3], [1.2, 1.6], [0.01, 1.7]].map(([r, z]) => Array.from({ length: 14 }, (_, i) => [cx + r * Math.cos((i * 2 * Math.PI) / 14), cy + r * Math.sin((i * 2 * Math.PI) / 14), ZR + 0.5 + z] as V3))
  roof.loft(rings)
}

finishModel('Federal Hall National Memorial', 'nyc-federal-hall', [
  { part: marble, material: finish('federal-marble', 0xe4dac6) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: dark, material: { ...PALETTE.window, name: 'window-2', color: 0x5d6c78 } },
  { part: porch, material: finish('federal-marble-shade', 0xcdc2ad) },
], { bearing: 36.6, osm: 'way/109337830', height: ZR + 3.0 }, 5000)
