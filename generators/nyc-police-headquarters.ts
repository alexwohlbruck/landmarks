/**
 * The old New York City Police Headquarters (the Police Building),
 * 240 Centre Street, Manhattan — procedural, CC0-1.0, no textures.
 * bun generators/nyc-police-headquarters.ts
 *
 * Map frame: x across the building (east-south-east), y along it
 * (north-north-east), z up, metres. The model is placed at bearing 29.6,
 * the mean of its two long walls (Centre Street 33.6°, Centre Market Place
 * 25.6°), which taper symmetrically about that axis. Anchor: the central
 * dome on the axis, -73.9979263, 40.7201229. y = 0 is the lowest ground
 * under the footprint, Grand Street at the south (wide) end; Broome Street
 * at the north end is about 1.7 m higher (lidar).
 *
 * What it is: Hoppin & Koen's Beaux-Arts police headquarters of 1905–09,
 * now the Police Building apartments. A long wedge-shaped block, 27 m wide
 * at Grand Street and 14 m at Broome Street, between Centre Street (west)
 * and Centre Market Place (east): a rusticated ground storey with round-
 * arched windows, a giant order over the second and third storeys under a
 * balustraded cornice, and a two-storey attic behind it, set back from
 * Centre Street. A Corinthian portico in the middle of the Centre Street
 * front carries the four-stage cupola: a square base, a ring of paired
 * columns, a clock stage and a green copper dome with an open lantern. Each
 * end is a pavilion with a columned, pedimented front and a low copper
 * dome: a hexastyle portico over the Grand Street end, and on Broome Street
 * a porte-cochère carrying two pairs of columns round one arched window.
 *
 * Covers and replaces: the outline way/247867323 and its 80 building:part
 * ways (381426585–381426679 inside it). Not way/381428126 or
 * way/1149264538, which are other buildings in the query box.
 *
 * Evidence
 * - OSM (measured): the outline; the parts give the portico columns
 *   (centre: six at x ≈ -hw-0.95, y = -5.7…6.9; Grand St: six at y -48.3;
 *   Broome St: four at y 49.4), the porte-cochère (8 m tall, 11 m wide,
 *   projecting 8 m), the Grand St podium (projecting 1.5 m), the 3 m
 *   setback terrace before the attic on Centre St, the end-pavilion domes
 *   (an oval 21 × 7.7 m at Grand St, a circle 10 m across at Broome St) and
 *   the copper wing roofs (roof:colour #8DA08D). OSM's dome height (46.6 m)
 *   is too low against the lidar; Wikipedia's 200 ft lantern is too high.
 * - USGS lidar NY_NewYorkCity (2017), above y = 0 (7.5 m NAVD88): the
 *   Centre St terrace and balustrade 19–21 m; the attic eaves 26.7–27.2 m
 *   on both long walls (the Centre Market Place attic is flush, within
 *   about a metre); the wing roofs rising to a flat 29.0–29.3 m; the end
 *   pavilions' cornices 23–24.5 m and their domes 27.5–29.7 m; the
 *   pediments 21.5–22.7 m; the porte-cochère 8.0–8.2 m; the cupola: base
 *   29.5–30 m, the colonnade's cornice a flat ring at 37.7 m about 7 m out,
 *   the clock stage's cornice 41.5 m, the dome 47.4 m, the lantern 54.2 m
 *   and the finial 55.6 m.
 * - USGS NAIP: pale green copper roof slopes and domes, grey flat roofs.
 * - Wikipedia "240 Centre Street": frontages (Centre St 300 ft, Centre
 *   Market Pl 311 ft, Grand St 88 ft, Broome St 46 ft); five storeys;
 *   limestone over a granite base; the arrangement of the porticos and the
 *   cupola, the clocks in oeils-de-boeuf.
 * - Photos (Wikimedia Commons, all evidence):
 *   "Old Police Headquarters - NYPD (51623900396).jpg" (ajay_suresh,
 *   CC BY 2.0), from the south-west: the Grand St portico and the Centre St
 *   front; "240 Centre Street (4692089276).jpg" (Tony Hisgett, CC BY 2.0),
 *   from the north-west along Centre St; "240 Centre Street 012.jpg",
 *   "…011.jpg", "…016.jpg", "…018.jpg", "…001.jpg" (Kidfly182,
 *   CC BY-SA 4.0): the central portico and cupola, the wings, the Broome St
 *   end; "Old police headqtrs.jpg" and "Former Police Headquarters NYC.JPG"
 *   (Fredverillo, CC BY-SA 3.0): the cupola close up; "Broome St NYPD HQ
 *   2008 jeh.jpg" (Jim.henderson, public domain); "Looking down Cleveland
 *   Place towards 240 Centre Street, New York, 2007.jpg" (DimiTalen, CC0).
 * - From the cupola photo, scaled to the lidar: colonnade 30.0–36.6 m with
 *   paired columns, the clock stage 37.7–41 m, a dome about as tall as its
 *   radius (5.6 m), the lantern about 1.4 times the dome's height.
 *
 * Estimated: the window sizes and bay counts (seven a wing, three on each
 * pavilion's long side); the column radius (0.55 m; OSM's 0.7 m includes
 * the bases); the storey heights inside the walls (string course 8 m,
 * main cornice 19.8 m) from the photos; the east (Centre Market Place)
 * front is drawn like the west without its portico, from the north-east
 * photos only.
 *
 * Simplified: the rustication, window hoods and pediments, the sculpture,
 * urns, chimneys and the small baroque turrets beside the cupola are left
 * out; capitals are blocks; the balustrades are solid parapets; the
 * lantern's columns are a dark core under a cap.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, column, cylinder, rect, tf } from './dc-white-house'
import { edgeBox, edgeFrame, edgePanel, lathe, pediment, pslab, poffset, saveModel, type XY } from './nyc-dime-savings-bank'

const stone = new Part(), shade = new Part(), roof = new Part(), win = new Part(), copper = new Part(), lit = new Part()

// ---- Plan: two long walls tapering symmetrically about x = 0.
const hw = (y: number) => 10.15 - 0.07 * y
const YS = -47.5, YN = 47.8 // Grand St and Broome St faces
const PS = -35.2, PN = 35.5 // the pavilions' inner ends
const CS = -11.0, CN = 11.6, YC = 0.3 // the central block and its axis
const SET = 3.2 // attic setback on Centre St
// ---- Heights (lidar, photos).
const PLINTH = 1.6, STRING = 8.0, CORN = 18.8, TERRACE = 19.8, BAL = 20.9
const ATTIC = 26.2, EAVE = 27.0, ROOF = 29.0, PAV = 23.6, PAVTOP = 24.4

const W = (y: number): XY => [-hw(y), y], E = (y: number): XY => [hw(y), y]
const body = (y0: number, y1: number, d = 0): XY[] => [[-hw(y0) - d, y0 - d], [hw(y0) + d, y0 - d], [hw(y1) + d, y1 + d], [-hw(y1) - d, y1 + d]]

// ---- The body: granite plinth, rusticated ground storey, the main storeys.
pslab(stone, body(YS, YN, 0.15), 0, PLINTH, 0.1, false)
pslab(stone, body(YS, YN), PLINTH, STRING, 0, false)
pslab(stone, body(YS, YN, 0.25), STRING, STRING + 0.5, 0.15, false, true)
pslab(stone, body(YS, YN), STRING + 0.5, CORN, 0, false)
pslab(stone, body(YS, YN, 0.55), CORN, TERRACE, 0.35, roof, true)

// ---- The attic over the wings and the centre, set back from Centre St,
// flush with Centre Market Place; the pavilions stop lower.
const atticRing: XY[] = [[-hw(PS) + SET, PS], [hw(PS), PS], [hw(PN), PN], [-hw(PN) + SET, PN]]
pslab(stone, atticRing, TERRACE, ATTIC, 0, false)
pslab(stone, poffset(atticRing, 0.4), ATTIC, EAVE, 0.3, false, true)
{
  // copper roof slopes up to a flat grey top
  const lo = poffset(atticRing, 0.1), hi = poffset(atticRing, -3.6)
  copper.loft([lo.map(([x, y]) => [x, y, EAVE] as V3), hi.map(([x, y]) => [x, y, ROOF] as V3)])
  roof.cap(hi.map(([x, y]) => [x, y, ROOF] as V3), true)
}
// the balustrade along the Centre St terrace (solid), broken by the portico
for (const [y0, y1] of [[PS, YC - 7.2], [YC + 7.2, PN]]) {
  edgeBox(stone, W(YN), W(YS), (YN - y1) * 1.0025, (YN - y0) * 1.0025, -0.6, -0.15, TERRACE, BAL, 0.12)
}

// ---- The end pavilions: full-height fronts, a cornice, a low copper dome.
for (const [y0, y1] of [[YS, PS], [PN, YN]] as [number, number][]) {
  pslab(stone, body(y0, y1), TERRACE, PAV, 0, false)
  pslab(stone, body(y0, y1, 0.45), PAV, PAVTOP, 0.3, roof, true)
  // a solid parapet (the urn pedestals and balustrade) round the top
  const o = body(y0, y1, -0.1)
  for (let k = 0; k < 4; k++) {
    const a = o[k], b = o[(k + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    edgeBox(stone, a, b, 0, L, -0.5, 0, PAVTOP, PAVTOP + 1.2, 0.12)
  }
}
/** A smooth half-ellipsoid dome, semi-axes a (x) and b (y), height h. */
function ovalDome(p: Part, cx: number, cy: number, a: number, b: number, z0: number, h: number, seg = 16, rings = 5) {
  const P = (phi: number, th: number): V3 => [cx + a * Math.cos(phi) * Math.cos(th), cy + b * Math.cos(phi) * Math.sin(th), z0 + h * Math.sin(phi)]
  const N = (phi: number, th: number): V3 => {
    const v: V3 = [Math.cos(phi) * Math.cos(th) / a, Math.cos(phi) * Math.sin(th) / b, Math.sin(phi) / h]
    const l = Math.hypot(...v)
    return [v[0] / l, v[1] / l, v[2] / l]
  }
  for (let k = 0; k < rings; k++) {
    const f0 = (k / rings) * Math.PI / 2, f1 = ((k + 1) / rings) * Math.PI / 2
    for (let i = 0; i < seg; i++) {
      const t0 = (i / seg) * 2 * Math.PI, t1 = ((i + 1) / seg) * 2 * Math.PI
      if (k === rings - 1) p.tri(P(f0, t0), P(f0, t1), P(f1, 0), undefined, undefined, undefined, [N(f0, t0), N(f0, t1), [0, 0, 1]])
      else {
        p.tri(P(f0, t0), P(f0, t1), P(f1, t1), undefined, undefined, undefined, [N(f0, t0), N(f0, t1), N(f1, t1)])
        p.tri(P(f0, t0), P(f1, t1), P(f1, t0), undefined, undefined, undefined, [N(f0, t0), N(f1, t1), N(f1, t0)])
      }
    }
  }
}
// Grand St: a long oval dome over a low drum; Broome St: a round dome and lantern.
cbox(stone, rect(-10.2, 10.2, -44.0, -36.6), PAVTOP, PAVTOP + 0.6, { c: 2.5, top: false })
ovalDome(copper, 0, -40.3, 10.2, 3.7, PAVTOP + 0.6, 3.2)
cylinder(stone, 0, 41.8, 5.0, PAVTOP, PAVTOP + 0.6, 16)
ovalDome(copper, 0, 41.8, 5.0, 5.0, PAVTOP + 0.6, 2.9)
cylinder(stone, 0, 41.8, 0.8, 27.6, 29.0, 8)
lathe(copper, 0, 41.8, [[1.1, 29.0], [0.9, 29.4], [0.4, 29.7], [0, 29.8]], 8)

// ---- Windows. Rows: basement, the arched ground floor, second, third,
// and the attic's two storeys in one panel.
const R2: [number, number] = [9.4, 12.8], R3: [number, number] = [14.0, 17.4], RA: [number, number] = [21.6, 25.3], RP: [number, number] = [19.9, 22.6]
/** An arched window panel on the face a→b at s, half-width w, from z0 to the springing zs. */
function archPanel(p: Part, a: XY, b: XY, s: number, w: number, z0: number, zs: number, d = 0.05) {
  const f = edgeFrame(a, b)
  edgePanel(p, a, b, s - w, s + w, z0, zs, d)
  const n: V3 = [f.n[0], f.n[1], 0]
  for (let k = 0; k < 6; k++) {
    const t0 = (k / 6) * Math.PI, t1 = ((k + 1) / 6) * Math.PI
    tf(p, f.at(s, d, zs), f.at(s + w * Math.cos(t0), d, zs + w * Math.sin(t0)), f.at(s + w * Math.cos(t1), d, zs + w * Math.sin(t1)), n)
  }
}
/** Bays along a face a→b between s0 and s1 (metres from a). */
function bays(a: XY, b: XY, s0: number, s1: number, n: number, opt: { attic?: number; pav?: boolean; ground?: boolean; pilasters?: boolean } = {}) {
  const step = (s1 - s0) / n
  for (let k = 0; k < n; k++) {
    const s = s0 + step * (k + 0.5)
    if (opt.ground !== false) {
      edgePanel(win, a, b, s - 0.5, s + 0.5, 0.5, 1.3)
      archPanel(win, a, b, s, 0.8, 2.5, 5.9)
    }
    edgePanel(win, a, b, s - 0.7, s + 0.7, R2[0], R2[1])
    edgePanel(win, a, b, s - 0.7, s + 0.7, R3[0], R3[1])
    if (opt.attic !== undefined) edgePanel(win, a, b, s - 0.65, s + 0.65, RA[0], RA[1], -opt.attic + 0.05)
    if (opt.pav) edgePanel(win, a, b, s - 0.6, s + 0.6, RP[0], RP[1])
    if (opt.pilasters && k > 0) edgeBox(stone, a, b, s - step / 2 - 0.35, s - step / 2 + 0.35, 0, 0.3, STRING + 0.5, CORN, 0, true)
  }
}
{
  // the long faces: a→b runs so the face looks outward
  const wa = W(YN), wb = W(YS), ea = E(YS), eb = E(YN)
  const k = Math.hypot(hw(YN) - hw(YS), YN - YS) / (YN - YS) // s per metre of y
  const sw = (y: number) => (YN - y) * k, se = (y: number) => (y - YS) * k
  // Centre St
  bays(wa, wb, sw(YN), sw(PN), 3, { pav: true })
  bays(wa, wb, sw(PN), sw(CN), 7, { attic: SET, pilasters: true })
  bays(wa, wb, sw(CN), sw(YC + 7.2), 1, { attic: SET })
  bays(wa, wb, sw(YC - 7.2), sw(CS), 1, { attic: SET })
  bays(wa, wb, sw(CS), sw(PS), 7, { attic: SET, pilasters: true })
  bays(wa, wb, sw(PS), sw(YS), 3, { pav: true })
  // Centre Market Place
  bays(ea, eb, se(YS), se(PS), 3, { pav: true })
  bays(ea, eb, se(PS), se(CS), 7, { attic: 0, pilasters: true })
  bays(ea, eb, se(CS), se(CN), 6, { attic: 0, pilasters: true })
  bays(ea, eb, se(CN), se(PN), 7, { attic: 0, pilasters: true })
  bays(ea, eb, se(PN), se(YN), 3, { pav: true })
  // east centre pediment against the attic
  {
    const a = E(CS), b = E(CN), f = edgeFrame(a, b)
    pediment(stone, shade, roof, f.xy(-0.3, 0.6), f.xy(f.L + 0.3, 0.6), TERRACE, 22.6, 1.2)
  }
}

// ---- The Centre St portico: a rusticated base, six columns (pairs at the
// ends), a pediment, under the cupola.
{
  const y0 = YC - 7.2, y1 = YC + 7.2, P = 2.1
  const base: XY[] = [[-hw(y0) - P, y0], [-hw(y0), y0], [-hw(y1), y1], [-hw(y1) - P, y1]]
  pslab(stone, base, 0, STRING + 0.5, 0.2, roof)
  const a: XY = [-hw(y1) - P, y1], b: XY = [-hw(y0) - P, y0], f = edgeFrame(a, b)
  for (const s of [3.0, 7.2, 11.4]) archPanel(lit, a, b, s * f.L / 14.4, 1.0, 1.0, 5.6)
  // shaded wall behind the columns, with its windows
  const wa = W(y1), wb = W(y0), g = edgeFrame(wa, wb)
  edgePanel(shade, wa, wb, 0.3, g.L - 0.3, STRING + 0.5, CORN, 0.03)
  for (const s of [3.0, 7.2, 11.4]) {
    archPanel(win, wa, wb, s * g.L / 14.4, 0.9, STRING + 1.2, 14.4, 0.07)
    edgePanel(win, wa, wb, s * g.L / 14.4 - 0.8, s * g.L / 14.4 + 0.8, 15.8, 17.8, 0.07)
  }
  for (const dy of [-6.0, -4.4, -1.85, 1.85, 4.4, 6.0]) {
    const y = YC + dy
    column(stone, -hw(y) - 1.0, y, 0.55, STRING + 0.5, CORN, 10)
  }
  // entablature to the attic face, then the pediment on the front
  edgeBox(stone, a, b, -0.2, f.L + 0.2, -0.2, 0, CORN, TERRACE + 0.3, 0.15)
  pslab(stone, [[-hw(y0) - P - 0.2, y0 - 0.2], [-hw(y0) + SET, y0 - 0.2], [-hw(y1) + SET, y1 + 0.2], [-hw(y1) - P - 0.2, y1 + 0.2]], CORN, TERRACE + 0.3, 0.2, roof)
  pediment(stone, shade, roof, f.xy(-0.2, 0.2), f.xy(f.L + 0.2, 0.2), TERRACE + 0.3, 23.2, P + SET + 0.2)
}

// ---- Grand St (south): a podium and six columns under a pediment.
{
  pslab(stone, [[-7.4, -49.0], [7.4, -49.0], [7.4, YS], [-7.4, YS]], 0, STRING + 0.5, 0.2, roof)
  for (const x of [-6.6, -5.0, -1.7, 1.7, 5.0, 6.6]) column(stone, x, -48.3, 0.55, STRING + 0.5, 17.6, 10)
  // the face of the main storeys behind the columns, in shade, with windows
  edgePanel(shade, [-8.0, YS], [8.0, YS], 0, 16, STRING + 0.5, 17.6, 0.03)
  for (const x of [-3.35, 0, 3.35]) {
    edgePanel(win, [-8.0, YS], [8.0, YS], x + 8 - 0.75, x + 8 + 0.75, R2[0], R2[1], 0.07)
    edgePanel(win, [-8.0, YS], [8.0, YS], x + 8 - 0.75, x + 8 + 0.75, R3[0], R3[1], 0.07)
  }
  // ground floor arches on the podium and the corners
  for (const x of [-3.6, 0, 3.6]) archPanel(x === 0 ? lit : win, [-7.4, -49.0], [7.4, -49.0], x + 7.4, 0.85, 2.0, 5.8)
  // a→b runs east, so the panels face south
  const fa: XY = [-hw(YS), YS], fb: XY = [hw(YS), YS]
  for (const x of [-11.0, 11.0]) {
    const s = x + hw(YS)
    archPanel(win, fa, fb, s, 0.8, 2.5, 5.9)
    edgePanel(win, fa, fb, s - 0.7, s + 0.7, R2[0], R2[1])
    edgePanel(win, fa, fb, s - 0.7, s + 0.7, R3[0], R3[1])
    edgePanel(win, fa, fb, s - 0.6, s + 0.6, RP[0], RP[1])
  }
  pslab(stone, [[-8.4, -49.2], [8.4, -49.2], [8.4, YS], [-8.4, YS]], 17.6, 19.3, 0.2, roof)
  pediment(stone, shade, roof, [-8.4, -49.2], [8.4, -49.2], 19.3, 22.4, 1.8)
}

// ---- Broome St (north): the porte-cochère, two pairs of columns round
// the arched window, a pediment.
{
  const y0 = YN, y1 = 55.5, X = 5.4
  pslab(stone, [[-X, y0 - 0.1], [X, y0 - 0.1], [X, y1], [-X, y1]], 0, STRING, 0.2, roof)
  // the carriage arch through it, and side arches
  archPanel(shade, [X, y1], [-X, y1], X, 2.4, 0, 4.6, 0.04)
  archPanel(shade, [X, y0], [X, y1], (y1 - y0) / 2, 2.2, 0, 4.4, 0.04)
  archPanel(shade, [-X, y1], [-X, y0], (y1 - y0) / 2, 2.2, 0, 4.4, 0.04)
  // balustrade round the terrace
  for (const [a, b] of [[[X, y0], [X, y1]], [[X, y1], [-X, y1]], [[-X, y1], [-X, y0]]] as [XY, XY][]) {
    const f = edgeFrame(a, b)
    edgeBox(stone, a, b, 0, f.L, -0.45, 0, STRING, STRING + 1.1, 0.1)
  }
  for (const x of [-4.5, -3.0, 3.0, 4.5]) column(stone, x, 49.4, 0.5, STRING, 17.6, 10)
  // the great arched window between the pairs
  const fa: XY = [hw(YN), YN], fb: XY = [-hw(YN), YN]
  archPanel(win, fa, fb, hw(YN), 1.4, STRING + 0.6, 15.0, 0.06)
  for (const s of [hw(YN) - 5.7, hw(YN) + 5.7]) {
    edgePanel(win, fa, fb, s - 0.45, s + 0.45, R2[0], R2[1])
    edgePanel(win, fa, fb, s - 0.45, s + 0.45, R3[0], R3[1])
    edgePanel(win, fa, fb, s - 0.45, s + 0.45, RP[0], RP[1])
    archPanel(win, fa, fb, s, 0.6, 2.5, 5.9)
  }
  pslab(stone, [[-5.6, YN], [5.6, YN], [5.6, 50.2], [-5.6, 50.2]], 17.6, 19.3, 0.2, roof)
  pediment(stone, shade, roof, [5.6, 50.2], [-5.6, 50.2], 19.3, 22.4, 2.4)
}

// ---- The cupola: a square base, the colonnade of paired columns, the
// clock stage, the copper dome and the open lantern.
{
  const cx = 0, cy = YC
  cbox(stone, rect(cx - 8.0, cx + 8.0, cy - 8.0, cy + 8.0), EAVE - 0.5, 29.6, { c: 2.6, top: false })
  cbox(stone, rect(cx - 8.3, cx + 8.3, cy - 8.3, cy + 8.3), 29.6, 30.0, { c: 2.7, b: 0.2, top: roof })
  // the colonnade: a drum with tall arched openings, eight pairs of columns
  cylinder(shade, cx, cy, 5.0, 30.0, 36.6, 16)
  for (let k = 0; k < 8; k++) {
    const t = (k * Math.PI) / 4
    const d: XY = [Math.cos(t), Math.sin(t)]
    const a: XY = [cx + d[0] * 5.02 - d[1], cy + d[1] * 5.02 + d[0]], b: XY = [cx + d[0] * 5.02 + d[1], cy + d[1] * 5.02 - d[0]]
    archPanel(win, b, a, 1.0, 0.7, 30.8, 34.6, 0.02)
    for (const dt of [-0.17, 0.17]) {
      const u = t + Math.PI / 8 + dt
      column(stone, cx + 6.1 * Math.cos(u), cy + 6.1 * Math.sin(u), 0.38, 30.0, 36.6, 8)
    }
  }
  lathe(stone, cx, cy, [[5.0, 36.6], [6.95, 36.65], [6.95, 37.3], [6.7, 37.7]], 16, false)
  lathe(roof, cx, cy, [[6.7, 37.7], [5.9, 37.75]], 16, false)
  // clock stage with four clocks in oeils-de-boeuf
  cylinder(stone, cx, cy, 5.9, 37.7, 41.0, 16)
  for (let k = 0; k < 4; k++) {
    const t = (k * Math.PI) / 2 + Math.PI / 2
    const d: V3 = [Math.cos(t), Math.sin(t), 0], tg: V3 = [-d[1], d[0], 0]
    const c: V3 = [cx + d[0] * 5.97, cy + d[1] * 5.97, 39.3]
    const Q = (ang: number, r: number): V3 => [c[0] + tg[0] * Math.cos(ang) * r, c[1] + tg[1] * Math.cos(ang) * r, c[2] + Math.sin(ang) * r]
    for (let j = 0; j < 12; j++) {
      const a0 = (j / 12) * 2 * Math.PI, a1 = ((j + 1) / 12) * 2 * Math.PI
      tf(lit, c, Q(a0, 1.05), Q(a1, 1.05), d)
    }
  }
  lathe(stone, cx, cy, [[6.3, 41.0], [6.3, 41.6], [5.8, 41.65]], 16, false)
  // the dome
  const Rd = 5.6, z0 = 41.65, H = 5.8
  const prof: [number, number][] = []
  for (let k = 0; k <= 6; k++) {
    const f = (k / 6) * Math.PI / 2
    prof.push([Rd * Math.cos(f) + (k === 6 ? 0 : 0), z0 + H * Math.sin(f)])
  }
  prof[6] = [1.1, z0 + H * 0.99]
  lathe(copper, cx, cy, prof, 16, true)
  // the lantern: a dark core in a ring of columns, a cap, a small dome, a finial
  cylinder(win, cx, cy, 0.85, 47.3, 51.6, 8)
  for (let k = 0; k < 8; k++) {
    const t = (k * Math.PI) / 4 + Math.PI / 8
    cylinder(stone, cx + 1.25 * Math.cos(t), cy + 1.25 * Math.sin(t), 0.2, 47.3, 51.6, 6)
  }
  lathe(stone, cx, cy, [[1.6, 47.3], [1.6, 47.6]], 12, true)
  lathe(stone, cx, cy, [[1.65, 51.6], [1.65, 52.1]], 12, true)
  lathe(copper, cx, cy, [[1.3, 52.1], [1.1, 52.8], [0.6, 53.4], [0.25, 53.7]], 12, false)
  lathe(stone, cx, cy, [[0.25, 53.7], [0.3, 54.2], [0.15, 55.0], [0, 55.6]], 8, false)
}

await saveModel('nyc-police-headquarters', 'Police Building (old NYPD Headquarters)', [
  { part: stone, material: finish('nypd-limestone', 0xddd3c0) },
  { part: shade, material: finish('nypd-limestone-shade', 0xc6bba7) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: copper, material: finish('nypd-copper', 0x7aa79a) },
  { part: lit, material: PALETTE.entrance },
], { source: 'generators/nyc-police-headquarters.ts', bearing: 29.6, osm: 'way/247867323', height: 55.6 }, 6500)
