/**
 * Bank of America Tower (Legacy Union, 620 S Tryon St, 2019, Goldman Sachs /
 * Lincoln Harris; Gensler with LS3P), Charlotte — original procedural
 * geometry, CC0-1.0.
 * bun generators/clt-bank-of-america-tower.ts
 *
 * Not the 1992 Bank of America Corporate Center (bank-of-america-corporate-
 * center.ts); this is the 33-storey tower of 2019 at the head of Legacy Union.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the
 * centroid of the OSM outline way/715062087) on the lowest ground. Placed at
 * bearing 49.7, so the tower's faces, square to Uptown's grid, are square to
 * this frame: +x faces South Tryon Street (south-east), +y faces north-east.
 *
 * Identity, in order:
 *  - the glass pyramid on top, pale and lit, on a stepped cream parapet;
 *  - the tiered cream tower: a punched-window base with a heavy cornice, a
 *    tall shaft of cream piers and blue glass strips, a big cornice and
 *    setback about two thirds up, a band of square windows, then a narrower
 *    top tier under the crown;
 *  - the deep blue glass notches at every corner, stepping in twice, running
 *    from the base to the parapet;
 *  - the warm cream precast and saturated blue glass, against the plain
 *    glass towers around it.
 *
 * Evidence:
 *  - OSM: outline way/715062087 (height 193, 33 levels), parts
 *    way/1351689077 (the shaft, 160 m: its plan gives the stepped corners),
 *    way/1351689080 (the pyramid on a 34 m square, tagged 160-190 m),
 *    way/1409111132 (the Tryon side's wider lower shaft, 124 m),
 *    way/1409111131, 1413181399, 1413181400 (the 20 m podium round the
 *    foot). Plan dimensions are measured from these, symmetrised where the
 *    OSM corners differ by under a metre.
 *  - Published: 632 ft / 192.6 m, 33 floors, completed 2019 (CTBUH, via
 *    Wikipedia "List of tallest buildings in Charlotte"; Wikipedia "Legacy
 *    Union" for the dates).
 *  - Lidar: USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17) shows the
 *    demolished Charlotte Observer building on the site, so it gives no
 *    tower heights; it shows the ground falling ~3-4 m to the west.
 *  - Heights scaled from Bruce Emmerling's distant, near-orthographic
 *    morning skyline photo (below), set to the published 192.6 m tip:
 *    base cornice ~48 m, the main setback cornice ~132 m, the square-window
 *    band's cornice ~140 m (one row of square windows over the setback), the parapet ~180 m and so a low pyramid of
 *    ~12.6 m. OSM's 160 m shaft and 30 m pyramid disagree with every photo
 *    (the pyramid is plainly about a third of that) and are not used.
 *  - Photos (Wikimedia Commons, all daylight unless noted):
 *    "Bank of America Tower December 2023.jpg" (City Dweller 2, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Bank_of_America_Tower_December_2023.jpg);
 *    "Legacy Union September 2023.jpg" (City Dweller 2, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Legacy_Union_September_2023.jpg);
 *    "Legacy Union April 2023.jpg" (City Dweller 2, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Legacy_Union_April_2023.jpg);
 *    "Legacy Union November 2022.jpg" (City Dweller 2, CC BY-SA 4.0, night,
 *    https://commons.wikimedia.org/wiki/File:Legacy_Union_November_2022.jpg);
 *    "Bank of America Tower South Tryon plaza December 2023.jpg" (City
 *    Dweller 2, CC BY-SA 4.0, the Tryon entrance face,
 *    https://commons.wikimedia.org/wiki/File:Bank_of_America_Tower_South_Tryon_plaza_December_2023.jpg);
 *    "Bank of America Tower Charlotte.jpg" (Jt12081988, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Bank_of_America_Tower_Charlotte.jpg);
 *    "Bank of America Tower May 2021.jpg" (City Dweller 2, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Bank_of_America_Tower_May_2021.jpg);
 *    "Legacy Union.jpg" (Cmett003, CC BY-SA 4.0, under construction,
 *    https://commons.wikimedia.org/wiki/File:Legacy_Union.jpg);
 *    "Charlotte Skyline during the morning.jpg" (Bruce Emmerling, CC BY-SA
 *    4.0, https://commons.wikimedia.org/wiki/File:Charlotte_Skyline_during_the_morning.jpg).
 *    No commercial imagery. No look-only sources were used.
 *
 * Estimated: every tier height above (photo-scaled, ±4 m); the upper tier's
 * inset (1.5-2 m a side, from the cornice's projection in the photos); the
 * bay counts (five strips on the long faces, three on the short, counted on
 * the photos and spaced evenly); the three-storey window groups (an
 * abstraction of the real continuous strips); the podium's height (OSM's
 * 20 m); the pyramid's 28 m base (OSM's 34 m square less the parapet).
 * Invented: nothing beyond the abstraction.
 *
 * Doubts: the north-west (back) face is only seen obliquely; OSM gives the
 * Tryon side a wider lower shaft (to 124 m) and that is kept, though no
 * photo shows that face square on. Left out: the "BANK OF AMERICA" signs,
 * mullions, the glazed pyramid's lattice, the skybridge to the garage.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, panel, save, walls, type XY } from './chi-aon-center'

const BEARING = 49.7
const ANCHOR: [number, number] = [35.2236852, -80.8499841]
/** The tower's centre, from the anchor (OSM's shaft is centred here). */
const C: XY = [2.9, 0.95]

const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), crown = new Part(), metal = new Part()

// ---------------------------------------------------------------------------
// Plans. One quadrant's stepped corner, mirrored; the +x half may differ.

type Corner = { X: number; Y: number; a: number; x2: number; y2: number; y3: number }
type Kind = 'face' | 'glass' | 'return'
type Edge = { a: XY; b: XY; kind: Kind }

/** A counter-clockwise ring with its edges tagged, from the +x and -x corners. */
function plan(e: Corner, w: Corner): Edge[] {
  const q1: XY[] = [[e.X, e.y3], [e.x2, e.y3], [e.x2, e.y2], [e.a, e.y2], [e.a, e.Y]]
  const q2: XY[] = [[-w.a, w.Y], [-w.a, w.y2], [-w.x2, w.y2], [-w.x2, w.y3], [-w.X, w.y3]]
  const q3: XY[] = q2.map(([x, y]) => [x, -y] as XY).reverse()
  const q4: XY[] = q1.map(([x, y]) => [x, -y] as XY).reverse()
  const pts = [...q1, ...q2, ...q3, ...q4].map(([x, y]) => [x + C[0], y + C[1]] as XY)
  // Per quadrant the edges run: return, glass, glass, return, then a face.
  const k1: Kind[] = ['return', 'glass', 'glass', 'return', 'face']
  const k2: Kind[] = ['return', 'glass', 'glass', 'return', 'face']
  const kinds = [...k1, ...k2, ...k1, ...k2]
  return pts.map((a, i) => ({ a, b: pts[(i + 1) % pts.length], kind: kinds[i] }))
}
const ring = (E: Edge[]) => E.map((e) => e.a)

const LOW_W: Corner = { X: 23.2, Y: 26.85, a: 10.2, x2: 17.3, y2: 24.0, y3: 17.5 }
// OSM's 124 m part widens the Tryon side and shallows its notches.
const LOW_E: Corner = { X: 25.8, Y: 26.85, a: 15.4, x2: 24.2, y2: 25.05, y3: 17.5 }
const UP: Corner = { X: 21.4, Y: 25.3, a: 7.6, x2: 13.8, y2: 20.6, y3: 13.4 }

const LOW = plan(LOW_E, LOW_W)
const HIGH = plan(UP, UP)

// Heights (photo-scaled to the published tip; see header).
const PODIUM = 20, BASE = 48, SETBACK = 132, BAND = 140, PARAPET = 176, ROOF = 180, TIP = 192.6

// ---------------------------------------------------------------------------
// Facade.

const len = (e: Edge) => Math.hypot(e.b[0] - e.a[0], e.b[1] - e.a[1])

/** Window panels in `n` bays across an edge, with `pier` of stone between, over the given rows. */
function bays(e: Edge, n: number, pier: number, rows: [number, number][], end = pier) {
  const L = len(e), w = (L - 2 * end - (n - 1) * pier) / n
  if (w < 1) return
  for (let k = 0; k < n; k++) {
    const s0 = end + k * (w + pier)
    for (const [z0, z1] of rows) panel(win, e.a, e.b, s0, s0 + w, z0, z1, 0.05)
  }
}
/** Storey groups of about `h` from z0 to z1, `gap` of spandrel between. */
function groups(z0: number, z1: number, h: number, gap: number): [number, number][] {
  const n = Math.max(1, Math.round((z1 - z0) / h)), g = (z1 - z0) / n
  return Array.from({ length: n }, (_, i) => [z0 + i * g + gap / 2, z0 + (i + 1) * g - gap / 2] as [number, number])
}
const faceBays = (e: Edge) => Math.max(2, Math.round(len(e) / 7))

/** Walls and windows of one tier: stone faces with strips, glass corner notches. */
function tier(E: Edge[], z0: number, z1: number, rows: [number, number][]) {
  walls(stone, ring(E), z0, z1)
  // The corner notches read as near-continuous glass: thinner spandrels.
  const notch = rows.map(([a, b]) => [a - 0.35, b + 0.35] as [number, number])
  for (const e of E) {
    if (e.kind === 'face') bays(e, faceBays(e), 2.6, rows, 2.2)
    else if (e.kind === 'glass') bays(e, 1, 0, notch, 0.2)
  }
}

/** A projecting band round a ring: `out` proud, from z0 to z1, bevelled on top. */
function cornice(r: XY[], z0: number, z1: number, out: number, part = trim) {
  const o = inset(r, -out), t = inset(r, -out * 0.3)
  walls(part, o, z0, z1 - 0.4)
  walls(part, o, z1 - 0.4, z1, t)
  cap(part, o, z0, false)
  // The top is a ring, so it never fights a roof capped at the same height.
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    part.quad([t[i][0], t[i][1], z1], [t[j][0], t[j][1], z1], [r[j][0], r[j][1], z1], [r[i][0], r[i][1], z1])
  }
}

// --- Base, 0-48 m: a full stone block (the notches start above its
// cornice), with the 20 m podium wings either side. Punched windows in bays,
// two storeys a panel.
{
  const R = (x0: number, y0: number, x1: number, y1: number, ch: number): XY[] =>
    ([[x0 + ch, y0], [x1 - ch, y0], [x1, y0 + ch], [x1, y1 - ch], [x1 - ch, y1], [x0 + ch, y1], [x0, y1 - ch], [x0, y0 + ch]] as XY[])
      .map(([x, y]) => [x + C[0], y + C[1]] as XY)
  const base = R(-LOW_W.X, -LOW_W.Y, LOW_E.X, LOW_W.Y, 0.6)
  const wings = [R(-28.6, -25.4, -LOW_W.X + 0.5, 25.4, 0.5), R(LOW_E.X - 0.5, -25.4, 28.9, 25.4, 0.5)]
  const rows: [number, number][] = [[1.5, 8.5], [10.5, 18.0], [22.6, 32.4], [34.4, 44.6]]
  const windows = (P: XY[], rows: [number, number][]) => {
    for (let i = 0; i < P.length; i++) {
      const a = P[i], b = P[(i + 1) % P.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 9) continue
      bays({ a, b, kind: 'face' }, Math.round(L / 6.2), 2.4, rows, 2.6)
    }
  }
  walls(stone, base, 0, BASE)
  windows(base, rows)
  cornice(base, PODIUM - 1.4, PODIUM, 0.5)
  cornice(base, BASE - 2.4, BASE, 1.1)
  cap(roof, base, BASE)
  for (const w of wings) {
    walls(stone, w, 0, PODIUM)
    windows(w, rows.slice(0, 2))
    cornice(w, PODIUM - 1.4, PODIUM, 0.5)
    cap(roof, inset(w, -0.15), PODIUM)
  }
}

// --- Shaft: cream piers and blue glass strips, three storeys a panel.
tier(LOW, BASE, SETBACK, groups(BASE, SETBACK - 1.5, 12.5, 1.3))
cornice(ring(LOW), SETBACK - 2.8, SETBACK, 1.3)
cap(roof, ring(LOW), SETBACK)

// --- Upper tiers: the square-window band, then the top tier under the crown.
{
  const sq: [number, number][] = [[SETBACK + 1.8, BAND - 2.6]]
  walls(stone, ring(HIGH), SETBACK, BAND)
  for (const e of HIGH) {
    if (e.kind === 'face') bays(e, Math.round(len(e) / 4.4), 2.0, sq, 1.6)
    else if (e.kind === 'glass') bays(e, 1, 0, [[SETBACK + 1.5, BAND - 1.5]], 0.35)
  }
  cornice(ring(HIGH), BAND - 1.8, BAND, 0.9)
  tier(HIGH, BAND, PARAPET, groups(BAND, PARAPET - 0.5, 12.5, 1.3))
  // Crown parapet: a solid cream band with a cornice, the roof sunk inside it.
  const top = ring(HIGH)
  walls(stone, top, PARAPET, ROOF - 0.6)
  cornice(top, PARAPET - 0.8, PARAPET + 0.6, 0.6)
  walls(trim, top, ROOF - 0.6, ROOF, inset(top, 0.6))
  const inner = inset(top, 0.6)
  walls(trim, inner.slice().reverse(), ROOF - 1.4, ROOF)
  cap(roof, inner, ROOF - 1.4)
}

// --- The glass pyramid, framed in silver: hips and a rib up each face.
{
  const H = 14, [cx, cy] = C, z0 = ROOF - 1.4
  // A low plinth carries it clear of the parapet.
  const plinth: XY[] = [[cx - H - 0.6, cy - H - 0.6], [cx + H + 0.6, cy - H - 0.6], [cx + H + 0.6, cy + H + 0.6], [cx - H - 0.6, cy + H + 0.6]]
  walls(metal, plinth, z0, ROOF + 0.4)
  cap(metal, plinth, ROOF + 0.4)
  const zb = ROOF + 0.4
  const base: V3[] = [[cx - H, cy - H, zb], [cx + H, cy - H, zb], [cx + H, cy + H, zb], [cx - H, cy + H, zb]]
  const apex: V3 = [cx, cy, TIP]
  for (let i = 0; i < 4; i++) crown.tri(base[i], base[(i + 1) % 4], apex)
  // Ribs: strips laid on each face, along both hips and up the middle.
  const lift = 0.08
  const onFace = (i: number, s: number, t: number): V3 => {
    // s across the face (0..1 at the base), t up it (0 base, 1 apex).
    const a = base[i], b = base[(i + 1) % 4]
    const p: V3 = [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, zb]
    const q: V3 = [p[0] + (apex[0] - p[0]) * t, p[1] + (apex[1] - p[1]) * t, p[2] + (apex[2] - p[2]) * t]
    // outward face normal, roughly: away from the centre, tilted up
    const o: V3 = [((a[0] + b[0]) / 2 - cx) / H, ((a[1] + b[1]) / 2 - cy) / H, 1.1]
    const l = Math.hypot(...o)
    return [q[0] + o[0] / l * lift, q[1] + o[1] / l * lift, q[2] + o[2] / l * lift]
  }
  const rib = (i: number, s: number, w: number) => {
    // a strip w wide (as a fraction of the base edge) from base to apex
    metal.quad(onFace(i, s - w, 0), onFace(i, s + w, 0), onFace(i, s + w * 0.15, 0.97), onFace(i, s - w * 0.15, 0.97))
  }
  for (let i = 0; i < 4; i++) {
    rib(i, 0.5, 0.018)
    rib(i, 0.025, 0.025)
    rib(i, 0.975, 0.025)
  }
}

if (import.meta.main) {
  await save('clt-bank-of-america-tower', 'Bank of America Tower', ANCHOR, BEARING, [
    { part: stone, material: finish('boat-precast', 0xe6dccb) },
    { part: trim, material: PALETTE.trim },
    { part: win, material: { ...PALETTE.window, color: 0x5f84b0 } },
    { part: roof, material: PALETTE.roof },
    { part: crown, material: { ...PALETTE.glass, color: 0xd3e2ec } },
    { part: metal, material: finish('boat-silver', 0xf2f4f5, 0.45) },
  ])
}
