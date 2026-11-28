/**
 * PGE Narodowy (Stadion Narodowy im. Kazimierza Górskiego), Warsaw:
 * original procedural geometry, CC0-1.0, no textures.
 *   bun generators/warsaw-pge-narodowy.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/warsaw-pge-narodowy.glb, the low model (<= 6,500 triangles);
 * - models/warsaw-pge-narodowy.detail.glb, drawn from zoom 16 (<= 40,000):
 *   the woven facade at two panels a bay and ten rows, stepped tiers, the
 *   roof's cushions in rows, every cable of the spoked wheel and of the
 *   spire, tapered masts.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 328.2: model
 * +y runs along the long axis of the drum (and the pitch), +x across it.
 * Anchor = the centre of the ring of 72 masts (OSM building:parts, both
 * their feet and their tips), lng 21.0457160, lat 52.2394714, which is
 * also the centre of the roof hub (way/311294454) and the spire
 * (way/311295079). The bearing is the principal axis of the mast ring
 * (148.2 deg, turned half round so +y points north-north-west).
 *
 * Identity, in order: the "wicker basket" drum, a facade of tilted
 * expanded-mesh panels woven in red and silver (the Polish colours), red
 * thickest low down and silver at the top, over a dark glazed base; the
 * 72 slim silver masts leaning outward round it and rising well above the
 * roof; the cable-net "spoked wheel" from the mast tops to the inner ring;
 * the white cushioned fixed roof, the grey retractable centre rising to
 * the hub, and the central spire 100 m above the pitch, red-banded, hung
 * with cables; the two tiers inside (red low, silver above) with the box
 * band between.
 *
 * Evidence
 *  - OSM (measured in this frame; heights over the pitch):
 *    - 72 mast feet (building:part, height 50, #dddddd) on a superellipse
 *      a 121.5, b 141.3; 72 mast tips (44-60 m) on a 131.2, b 150.8, 9.5 m
 *      further out: read as the middle of the part above the roof (52 m),
 *      the masts lean out 11.1 m by their tips at 60 m (about 11 deg). Drawn at their OSM angles (4.5-5.5 deg
 *      apart, measured); the mesh bays run between them.
 *    - lower tier ('steps', 0-10 m): x 46.7-70.7 on the x axis, y 71.2-95.5
 *      on the y axis; box levels (10-14 m, #3399cc glass); upper tier
 *      ('steps', 19-38.5 m): x 74.7-110.9, y 99.9-131.0; hub way/311294454
 *      (37-43 m, black), hub top way/311294463 (55-63 m, white, pyramidal),
 *      spire way/311295079 (30-100 m, roof:colour #cc3300), roof ring
 *      way/311294184 (43.5-44 m); podium parts at 5 m (relation/4166742
 *      "przyziemie", relation/4166743 slab 14-15 m, relation/4166741 level
 *      24.5-25 m).
 *  - Published (en.wikipedia "Stadion Narodowy"): spire "100 metres ...
 *    above the pitch"; stands' highest point 41 m and the roof steel's
 *    highest point 70 m above the old pitch; roof structure 240 x 270 m,
 *    a retractable "partially transparent" fibreglass/PTFE membrane;
 *    facade "painted mesh ... silver and red, referring to the Polish
 *    flag"; two-level stands; seats "in red and silver".
 *  - Heights: mast tips 60 (OSM), not the published 70 m "highest point
 *    of the roof steel" (measured from the old, lower pitch): in pano the
 *    masts rise about 0.4 of the facade's height over the roof edge;
 *    facade top and roof edge 44 (OSM); roof inner ring 41, hub 50-60 and
 *    the retractable centre rising to it ESTIMATED from pano and aerialc;
 *    the inner ring's size (a 52, b 68) ESTIMATED from aerialc (0.42 of
 *    the roof's width).
 *  - Elevation 0: the map's Mapterhorn z15 terrain puts the pitch about
 *    4 m below the podium (the old Stadion Dziesięciolecia's embankment),
 *    and that pitch is the lowest ground under the footprint; the facade
 *    stands on the podium at 4.5 m.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - aerialc: Arne Müseler, "National Stadium Warsaw aerial view
 *      (cropped).jpg", CC BY-SA 3.0 de: roof cushions, inner ring, hub,
 *      the weave and its colours from the south-west.
 *      https://commons.wikimedia.org/wiki/File:National_Stadium_Warsaw_aerial_view_(cropped).jpg
 *    - aerial2: Arne Müseler, "National Stadium Warsaw aerial view 2.jpg",
 *      CC BY-SA 3.0 de. https://commons.wikimedia.org/wiki/File:National_Stadium_Warsaw_aerial_view_2.jpg
 *    - pano: XEvansGambitx, "Stadion narodowy panorama.jpg", CC BY-SA 4.0:
 *      the facade square on from a drone, the dark base, the colour
 *      gradient, the hub and spire.
 *      https://commons.wikimedia.org/wiki/File:Stadion_narodowy_panorama.jpg
 *    - igor1, igor2: Igor123121, "Kazimierz Górski National Stadium, 2026,
 *      Warsaw, Poland.jpg" and "... Warsaw Poland.jpg", CC BY 4.0: the
 *      masts' lean and height, the weave from the street, 2026.
 *      https://commons.wikimedia.org/wiki/File:Kazimierz_G%C3%B3rski_National_Stadium,_2026,_Warsaw,_Poland.jpg
 *    - roof: Joern Fehrmann, "Warsaw National Stadium roof.jpg", CC BY-SA
 *      3.0: the hub, its louvres, the red-banded spire, the cables.
 *      https://commons.wikimedia.org/wiki/File:Warsaw_National_Stadium_roof.jpg
 *    - vist5: Artur am1974, "National Stadium in Warsaw from the Vistula
 *      (5).jpg", CC BY 2.0: from the river (west).
 *      https://commons.wikimedia.org/wiki/File:National_Stadium_in_Warsaw_from_the_Vistula_(5).jpg
 *  No lidar or NAIP exists here (outside the US); no commercial imagery.
 *
 * Invented or simplified, and doubts:
 *  - The weave: each panel is a flat quad turned a few degrees about the
 *    vertical, alternately, so the rows read as basketwork; red or silver
 *    per panel by a fixed pseudo-random draw whose share of red falls with
 *    height (as pano shows), not the real panel map.
 *  - The cushions are drawn as one row of pillows per bay (low) or four
 *    rows (detail); the cable net as one radial cable per mast (every third mast in the low model); the spire
 *    cables 16 (low) or 48 (detail), all straight.
 *  - Seats: lower tier red, upper tier silver (published "red and silver";
 *    the real seats make a mosaic of both).
 *  - The podium's green banks, stairs and entrance pavilions round the
 *    drum are left to the map (OSM parts outside the facade line).
 *  - Night: the glazed base and box band are `window`; the mesh is
 *    floodlit red and white in reality, drawn with a floodlight attribute.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { band, bar, rod3, writeLods, RAD } from './milan-san-siro'
import { se, face, vadd, vsub, vmul, vlerp } from './seoul-world-cup-stadium'

const BEARING = 328.2

type SE = [number, number, number]
const COL: SE = [121.5, 141.3, 2.4] // mast feet, the facade line
const LEAN = 11.1 // how far a mast's tip at 60 m stands out from its foot
const T1F: SE = [46.7, 71.2, 2.7]
const T1B: SE = [70.7, 95.5, 3.0]
const T2F: SE = [74.7, 99.9, 2.6]
const T2B: SE = [110.9, 131.0, 2.8]
const INNER: SE = [52, 68, 2.5] // the roof's inner (tension) ring

/** The 72 mast feet, degrees anticlockwise from +x (OSM, this frame); the tips stand at the same angles to 0.6 deg. */
const FEET = [0.6, 5.8, 10.8, 15.9, 20.8, 25.7, 31.0, 36.4, 41.6, 46.8, 51.9, 57.1, 62.2, 67.3, 72.2, 76.8, 81.5, 86.1, 90.6, 95.2, 99.8, 104.4, 109.2, 114.4, 119.4, 124.5, 129.6, 134.7, 139.9, 145.2, 150.4, 155.3, 160.2, 165.2, 170.3, 175.4, 180.6, 185.7, 190.8, 195.8, 200.8, 205.7, 210.9, 216.4, 221.6, 226.8, 231.9, 237.1, 242.2, 247.4, 252.3, 256.9, 261.5, 266.1, 270.7, 275.3, 279.9, 284.4, 289.3, 294.4, 299.5, 304.6, 309.7, 314.8, 319.9, 325.3, 330.5, 335.4, 340.3, 345.3, 350.4, 355.5]

const PODIUM = 4.5
const TOPZ = 44
const MASTZ = 60

/** Deterministic hash in [0, 1). */
const hash = (a: number, b: number) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453
  return s - Math.floor(s)
}

function build(detail: boolean) {
  const red = new Part(), silver = new Part(), roof = new Part(), membrane = new Part(), win = new Part(), concrete = new Part()
  const N = detail ? 144 : 72
  const phis = Array.from({ length: N }, (_, k) => (k / N) * 2 * Math.PI)
  const P = (s: SE, f: number, z: number, grow = 0): V3 => {
    const r = se(f, s[0], s[1], s[2]) + grow
    return [r * Math.cos(f), r * Math.sin(f), z]
  }
  const R = (s: SE, z: number, grow = 0, ph = phis) => ph.map((f) => P(s, f, z, grow))
  const IN = (q: V3): V3 => [-q[0], -q[1], 0]
  const OUT = (q: V3): V3 => [q[0], q[1], 0]
  const UP = (): V3 => [0, 0, 1]
  const DOWN = (): V3 => [0, 0, -1]
  const SEAT = (q: V3): V3 => [-q[0], -q[1], 150]

  // The facade surface flares out from the foot to the roof edge.
  const fgrow = (z: number) => -1.5 + (4.5 * (z - PODIUM)) / (TOPZ - PODIUM)

  // --- Stands.
  const rake = (p: Part, A: SE, za: number, B: SE, zb: number, steps: number) => {
    if (!detail) { band(p, R(A, za), R(B, zb), SEAT); return }
    for (let s = 0; s < steps; s++) {
      const t0 = s / steps, t1 = (s + 1) / steps
      const a = phis.map((f) => vlerp(P(A, f, za), P(B, f, zb), t0))
      const b = phis.map((f) => vlerp(P(A, f, za), P(B, f, zb), t1))
      const ar = a.map((q, k) => [q[0], q[1], b[k][2]] as V3)
      band(p, a, ar, IN)
      band(p, ar, b, UP)
    }
  }
  band(concrete, R(T1F, 0), R(T1F, 1.2), IN)
  rake(red, T1F, 1.2, T1B, 10, 8)
  if (detail) band(concrete, R(T1B, 10), R(T1B, 10, 1.5), UP)
  band(win, R(T1B, 10, detail ? 1.5 : 0), R(T1B, 18, 1.5), IN) // two box levels
  if (detail) band(concrete, R(T1B, 18, 1.5), R(T1B, 19, 1.5), IN)
  band(concrete, R(T1B, detail ? 19 : 18, 1.5), R(T2F, 19), UP)
  rake(silver, T2F, 19, T2B, 38.5, 9)
  band(concrete, R(T2B, 38.5), R(T2B, 40), IN)
  band(concrete, R(T2B, 40), R(COL, 40, fgrow(40) - 1), UP)
  // glazed base under the mesh and the dark elevation behind it
  if (detail) band(concrete, R(COL, 0, -1.5), R(COL, PODIUM, -1.5), OUT) // plinth to the podium (under the map's podium terrain)
  band(win, R(COL, PODIUM, -2.5), R(COL, TOPZ - 1, fgrow(TOPZ - 1) - 1.2), OUT)

  // --- The woven facade: tilted mesh panels in red and silver.
  {
    const NB = 72 * (detail ? 2 : 1)
    const z0 = 12.5, z1 = TOPZ - 0.5
    const rows = detail ? 10 : 6
    const share = (t: number) => 0.92 - 0.8 * t // red share, bottom to top
    for (let j = 0; j < rows; j++) {
      const za = z0 + ((z1 - z0) * j) / rows + 0.25, zb = z0 + ((z1 - z0) * (j + 1)) / rows - 0.25
      for (let k = 0; k < NB; k++) {
        const per = NB / 72, m0 = Math.floor(k / per), sub = k % per
        const g0 = FEET[m0] * RAD, g1 = (m0 === 71 ? FEET[0] + 360 : FEET[m0 + 1]) * RAD
        const fa = g0 + ((g1 - g0) * sub) / per + 0.004, fb = g0 + ((g1 - g0) * (sub + 1)) / per - 0.004
        const s = (k + j) % 2 ? 1 : -1
        const oa = 0.7 + 0.6 * s, ob = 0.7 - 0.6 * s
        const a = P(COL, fa, za, fgrow(za) + oa), b = P(COL, fb, za, fgrow(za) + ob)
        const c = P(COL, fb, zb, fgrow(zb) + ob), d = P(COL, fa, zb, fgrow(zb) + oa)
        const isRed = hash(k + 0.5 * (j % 3), j) < share((j + 0.5) / rows)
        const fm = (fa + fb) / 2
        face(isRed ? red : silver, [a, b, c, d], [Math.cos(fm), Math.sin(fm), 0])
      }
    }
    // a silver band at the top, under the roof edge
    band(silver, R(COL, TOPZ - 0.5, fgrow(TOPZ) + 0.2), R(COL, TOPZ + 0.8, fgrow(TOPZ) + 0.2), OUT)
  }

  // --- The roof: fixed cushions from the edge to the inner ring.
  {
    const NR = detail ? 288 : 144 // two samples a bay: valley on the cable, crown between
    const ph = Array.from({ length: NR }, (_, k) => (k / NR) * 2 * Math.PI)
    const edge = R(COL, TOPZ + 0.8, fgrow(TOPZ) + 0.2, ph)
    const inner = R(INNER, 41, 0, ph)
    const rowsR = detail ? 4 : 1
    for (let r = 0; r < rowsR; r++) {
      const A = ph.map((_, i) => vlerp(edge[i], inner[i], r / rowsR))
      const B = ph.map((_, i) => vlerp(edge[i], inner[i], (r + 0.5) / rowsR))
      const C = ph.map((_, i) => vlerp(edge[i], inner[i], (r + 1) / rowsR))
      const lift = (q: V3[], h: number) => q.map((p, i) => (i % 2 ? vadd(p, [0, 0, h]) : vadd(p, [0, 0, h * 0.45])))
      band(roof, A, lift(B, detail ? 1.4 : 2.2), UP, true, false)
      band(roof, lift(B, detail ? 1.4 : 2.2), C, UP, true, false)
    }
    if (detail) band(roof, R(COL, TOPZ - 1.5, fgrow(TOPZ) + 0.6, ph), edge, OUT) // white rim
    else band(roof, R(COL, TOPZ - 1.5, fgrow(TOPZ) + 0.6), R(COL, TOPZ + 0.8, fgrow(TOPZ) + 0.2), OUT)
    if (detail) band(roof, R(COL, TOPZ - 1.5, fgrow(TOPZ) + 0.6, ph), R(INNER, 40.2, 0, ph), DOWN)
    // the inner ring beam
    band(concrete, R(INNER, 40, 0), R(INNER, 41.6, 0), IN)
    band(concrete, R(INNER, 41.6, 0), R(INNER, 41.6, 1.5), UP)
    // the retractable centre, rising to the hub
    const hub = (z: number, r: number) => phis.map((f) => [r * Math.cos(f), r * Math.sin(f), z] as V3)
    const mid = phis.map((f, i) => vlerp(P(INNER, f, 41.2), hub(48, 13)[i], 0.5))
    mid.forEach((q) => (q[2] = 45.5))
    band(membrane, R(INNER, 41.2), mid, UP)
    band(membrane, mid, hub(48, 13), UP)
    // hub: drum, louvre band, dome
    band(roof, hub(48, 13), hub(53, 11.5), OUT)
    band(concrete, hub(53, 11.5), hub(56, 12), OUT)
    band(roof, hub(56, 12), hub(59, 8), UP)
    face(roof, hub(59, 8), [0, 0, 1])
  }

  // --- The spire: white, red-banded above the hub, to 100 m.
  {
    const sq = (z: number, w: number): V3[] => [[w, w, z], [-w, w, z], [-w, -w, z], [w, -w, z]]
    const seg = (p: Part, z0: number, z1: number, w0: number, w1: number) => {
      const A = sq(z0, w0), B = sq(z1, w1)
      for (let k = 0; k < 4; k++) face(p, [A[k], A[(k + 1) % 4], B[(k + 1) % 4], B[k]], vsub(vlerp(A[k], A[(k + 1) % 4], 0.5), [0, 0, z0]))
    }
    seg(roof, 58, 61, 1.5, 1.45)
    seg(red, 61, 72, 1.45, 1.3)
    seg(roof, 72, 99, 1.3, 0.6)
    const t = sq(99, 0.6)
    for (let k = 0; k < 4; k++) face(roof, [t[k], t[(k + 1) % 4], [0, 0, 100]], vsub(vlerp(t[k], t[(k + 1) % 4], 0.5), [0, 0, 99]))
    // cables from the spire to the inner ring
    const NC = detail ? 48 : 16
    for (let c = 0; c < NC; c++) {
      const f = (c / NC) * 2 * Math.PI + 2.5 * RAD
      const to = P(INNER, f, 41.6)
      if (detail) bar(silver, [0, 0, 92], to, 0.35, 0.35, [0, 0, 1], false)
      else rod3(silver, [0, 0, 92], to, 0.35)
    }
  }

  // --- The 72 masts, leaning out, and their radial cables to the inner ring.
  for (let m = 0; m < 72; m++) {
    const f = FEET[m] * RAD
    const foot = P(COL, f, PODIUM, 1.0), tip = P(COL, f, MASTZ, 1.0 + LEAN)
    if (detail) {
      // tapered: a bar to the roof edge, a slimmer one to the tip
      const mid = vlerp(foot, tip, (TOPZ - PODIUM) / (MASTZ - PODIUM))
      bar(silver, foot, mid, 1.5, 1.5, [Math.cos(f), Math.sin(f), 0], true)
      bar(silver, mid, tip, 1.3, 1.0, [Math.cos(f), Math.sin(f), 0], true)
      bar(silver, tip, P(INNER, f, 41.6), 0.35, 0.35, [0, 0, 1], false)
      bar(silver, vlerp(foot, tip, 0.86), P(COL, f, TOPZ + 1, fgrow(TOPZ)), 0.35, 0.35, [0, 0, 1], false)
    } else {
      rod3(silver, foot, tip, 1.0, [Math.cos(f), Math.sin(f), 0])
      if (m % 3 === 0) rod3(silver, tip, P(INNER, f, 41.6), 0.4)
    }
  }

  const flood = (_p: V3, n: V3) => (Math.abs(n[2]) < 0.5 ? 0.75 : 0.2)
  return [
    { part: red, material: { ...finish('pge-red', 0xbf3f45), floodlight: flood } },
    { part: silver, material: { ...finish('pge-silver', 0xd6d8da), floodlight: flood } },
    { part: roof, material: finish('pge-membrane', 0xeeece6) },
    { part: membrane, material: finish('pge-retractable', 0xcbcecf) },
    { part: win, material: { ...PALETTE.window, color: 0x5c6670 } },
    { part: concrete, material: finish('pge-concrete', 0x9a9c9c) },
  ]
}

if (import.meta.main)
  await writeLods('PGE Narodowy', { bearing: BEARING, elevation: 0, height: 100 }, [
    { file: 'warsaw-pge-narodowy.glb', parts: build(false), maxTris: 6500, maxBytes: 250_000 },
    { file: 'warsaw-pge-narodowy.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1_500_000 },
  ])
