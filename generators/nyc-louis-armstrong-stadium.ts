/**
 * Louis Armstrong Stadium (2018, Rossetti), USTA Billie Jean King National
 * Tennis Center, Flushing Meadows–Corona Park, Queens. A plain rectangular
 * box: a glass and terracotta-panel base, above it a deep screen of
 * terracotta louvers on a pale steel frame, and a flat white roof with a
 * rectangular opening over the court, its two fabric panels parked open over
 * the sideline stands. Inside, two tiers of navy seats. Original procedural
 * geometry, CC0-1.0.
 * bun generators/nyc-louis-armstrong-stadium.ts
 *
 * Stadium rule (STYLE.md "Ground"): the court and the plazas are the map's.
 * Arthur Ashe Stadium and the other buildings round it are not touched.
 *
 * Frame: BEARING 0, x east, y north, z up, metres. Origin = area centroid of
 * the OSM outline way/840573223 (-73.8454091, 40.7509981). The plan is drawn
 * in (u, v): u along the long sides, 24 degrees north of east; v square to it,
 * 24 degrees west of north, along the court. z = 0 is the plaza; the court is
 * at grade, so elevation is 0.
 *
 * Evidence
 * - OSM way/840573223 (building=yes, "Louis Armstrong Stadium", capacity
 *   14,053, Q47487977), no height and no building:parts. In (u, v) it is a
 *   rectangle u -54.7..55.8, v -46.4..43.6 (110.5 by 90 m), plus an 8 by 7 m
 *   annex on the east side (u 55.7..63.8, v 15.1..21.9). OSM way/840573222 is
 *   the court (leisure=pitch, 22 by 38 m incl. run-off), centred at
 *   (u 0.4, v 0.6) and running along v.
 * - USGS NAIP orthophotos (public domain, roof closed): the outline matches
 *   OSM within a metre; the roof is one white rectangle crossed by two lines
 *   along v about 50 m apart (the retractable panels' edges); a lower strip
 *   about 10 m deep runs along the south-south-east (plaza) face, with the
 *   terracotta screen's top edge at its back. Height from the roof's shadow
 *   on the north side (about 11 m, against Arthur Ashe's 46 m roof edge
 *   casting about 20 m in the same image): roof edge about 25-27 m.
 * - Published: Geiger Engineers (geigerengineers.com, project page): fixed
 *   roof canopies on trusses 14 ft (4.3 m) deep spanning 240 ft (73 m) along
 *   the east and west (sideline) stands; a retractable roof of two tension-
 *   membrane panels of 20,800 sq ft (1,932 m2) each, i.e. about 26.5 m by
 *   73 m. Wikipedia: Rossetti, opened 2018, 14,053 seats in two tiers (6,400
 *   lower, 7,000 upper, cantilevered); terra cotta chosen to match the site's
 *   brick. Press (archpaper, arch2o): 14,250 terra cotta louvers.
 * - Photos (Wikimedia Commons): "2021 US Open, Day 12.jpg" and "2021 US
 *   Open, Day 13.jpg" (Curlyrnd, CC BY-SA 4.0: the plaza face, glass shops,
 *   the terracotta-panel band with the lettering, the louver screen on its
 *   steel grid above, white canopies on the podium); "New Louis Armstrong
 *   Stadium.jpg" (G. Capo, CC BY-SA 4.0: the roof trusses and the louvered
 *   end wall lit warm at night); "2021 US Open Armstrong Stadium
 *   practice.jpg" (Beyond My Ken, CC BY-SA 4.0: two tiers of navy seats,
 *   louvers above the end stand); "AEW Double or Nothing at Louis Armstrong
 *   Stadium ... 2026.jpg" (Jrinnyc, CC BY-SA 4.0: the steel roof structure
 *   and fabric from inside).
 *
 * Estimated: every height (glass 0-5 m, terracotta band 5-10 m, louver
 * screen 10-25 m, roof 26.5 m, parked panels to 29.3 m) from the photos'
 * storey proportions and the NAIP shadow; the opening (53 by 69 m) from the
 * published panel area and the NAIP panel lines; the bowl's rake and tiers
 * from the interior photos; the annex's height (10 m). No open photo shows
 * the north (rail-yard) or the west faces from outside, so they repeat the
 * plaza face's louver screen over a plain base. Lettering, the louvers'
 * individual blades, the diagonal bracing behind them and the podium's tent
 * canopies are left out. No lidar covers the stadium (NYC's 2017 flight
 * predates it).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, v3, walls, capPoly, beam, save } from './nyc-yankee-stadium'

const brick = new Part(), louver = new Part(), win = new Part(), white = new Part(), steel = new Part(), seats = new Part()

const TH = (24 * Math.PI) / 180, CU = Math.cos(TH), SU = Math.sin(TH)
const W = (u: number, v: number): XY => [u * CU - v * SU, u * SU + v * CU]
/** A (u, v) rectangle, counter-clockwise, with its corners cut by c. */
const rectUV = (u0: number, u1: number, v0: number, v1: number, c = 0): XY[] =>
  (c > 0
    ? [[u0 + c, v0], [u1 - c, v0], [u1, v0 + c], [u1, v1 - c], [u1 - c, v1], [u0 + c, v1], [u0, v1 - c], [u0, v0 + c]]
    : [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]
  ).map(([u, v]) => W(u, v))

/** Quads between two rings of the same length (counter-clockwise): faces out/down, or in/up if flip. */
function loft(p: Part, A: XY[], za: number, B: XY[], zb: number, flip = false) {
  for (let i = 0; i < A.length; i++) {
    const j = (i + 1) % A.length
    const q: V3[] = [v3(A[i], za), v3(A[j], za), v3(B[j], zb), v3(B[i], zb)]
    if (flip) p.quad(q[3], q[2], q[1], q[0])
    else p.quad(q[0], q[1], q[2], q[3])
  }
}

// The box (OSM way/840573223 in u, v). The plaza (south-south-east) face
// carries a 9 m podium; the louvered box stands back from it.
const U0 = -54.7, U1 = 55.8, V0 = -46.4, V1 = 43.6, VS = -36.4
const Z_GLASS = 4.5, Z_BASE = 8.5, Z_SCREEN = 26, Z_ROOF = 27.5
const IN = 0.6 // the louver screen's set-back from the base

// ---------------------------------------------------------------------------
// The base: glass shopfronts under a band of terracotta panels, all round,
// the podium on the plaza side included. The north side faces the rail yard:
// brick to the ground there.
{
  const base = rectUV(U0, U1, V0, V1)
  // ground floor: glass on the plaza and the two ends, brick on the north;
  // split into 5 m pieces so the map can follow the ground under them
  const ring: [number, number][] = [[U0, V0], [U1, V0], [U1, V1], [U0, V1]]
  for (let i = 0; i < 4; i++) {
    const [a, b] = [ring[i], ring[(i + 1) % 4]]
    const A = W(a[0], a[1]), B = W(b[0], b[1]), n = Math.ceil(Math.hypot(B[0] - A[0], B[1] - A[1]) / 5)
    for (let k = 0; k < n; k++) {
      const P = (t: number): XY => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t]
      const p0 = P(k / n), p1 = P((k + 1) / n)
      ;(i === 2 ? brick : win).quad(v3(p0, 0), v3(p1, 0), v3(p1, Z_GLASS), v3(p0, Z_GLASS))
    }
  }
  walls(brick, base, Z_GLASS, Z_BASE)
  // the podium's roof in front of the screen, with a low parapet lip
  const pod = rectUV(U0, U1, V0, VS + IN)
  capPoly(white, pod, Z_BASE + 0.6)
  walls(white, base, Z_BASE, Z_BASE + 0.6)
  // the annex on the east side
  const ann = rectUV(U1 - 0.1, 63.8, 15.1, 21.9)
  walls(brick, ann, 0, Z_BASE - 0.5)
  capPoly(white, ann, Z_BASE - 0.5)
  // the base's top behind the screen (a narrow ledge on the other three sides)
  const top = rectUV(U0, U1, VS + IN, V1)
  const scr = rectUV(U0 + IN, U1 - IN, VS + IN, V1 - IN)
  loft(white, [top[0], top[1], top[2], top[3]], Z_BASE + 0.6, [scr[0], scr[1], scr[2], scr[3]], Z_BASE + 0.6)
}

// ---------------------------------------------------------------------------
// The louver screen: terracotta from the base to the roof, set back a little,
// with pale steel posts in its frame (the bays in the plaza photos, about
// 6 m) and a white roof fascia with a chamfered lip.
const SU0 = U0 + IN, SU1 = U1 - IN, SV0 = VS + IN, SV1 = V1 - IN
{
  const scr = rectUV(SU0, SU1, SV0, SV1)
  walls(louver, scr, Z_BASE + 0.6, Z_SCREEN)
  walls(white, scr, Z_SCREEN, Z_ROOF - 0.4)
  const lip = rectUV(SU0 + 0.4, SU1 - 0.4, SV0 + 0.4, SV1 - 0.4)
  loft(white, scr, Z_ROOF - 0.4, lip, Z_ROOF)

  // posts: thin bevelled boxes standing proud of the screen by 0.3 m
  const side = (a: XY, b: XY, n: number) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(2, Math.round(L / 6))
    for (let i = 0; i <= k; i++) {
      const t = i / k, m: XY = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
      if (i === 0 || i === k) continue // the corners get their own
      post(m, n)
    }
  }
  const post = (m: XY, n: number) => {
    // n: outward direction angle (radians)
    const o: XY = [Math.cos(n), Math.sin(n)], t: XY = [-o[1], o[0]]
    const w = 0.35, d = 0.3
    const r: XY[] = [
      [m[0] - t[0] * w, m[1] - t[1] * w], [m[0] + t[0] * w, m[1] + t[1] * w],
      [m[0] + t[0] * w + o[0] * d, m[1] + t[1] * w + o[1] * d], [m[0] - t[0] * w + o[0] * d, m[1] - t[1] * w + o[1] * d],
    ]
    walls(white, r, Z_BASE + 0.6, Z_SCREEN)
  }
  const C = [[SU0, SV0], [SU1, SV0], [SU1, SV1], [SU0, SV1]].map(([u, v]) => W(u, v))
  const outAng = [TH - Math.PI / 2, TH, TH + Math.PI / 2, TH + Math.PI]
  for (let i = 0; i < 4; i++) side(C[i], C[(i + 1) % 4], outAng[i])
  // horizontal rails across the screen at a third and two-thirds height
  const rail0 = rectUV(SU0 - 0.25, SU1 + 0.25, SV0 - 0.25, SV1 + 0.25)
  for (const z of [14.2, 20.1]) {
    walls(white, rail0, z - 0.6, z)
    loft(white, rail0, z, scr, z)
    loft(white, scr, z - 0.6, rail0, z - 0.6)
  }
}

// ---------------------------------------------------------------------------
// The roof: a flat white deck with the opening over the court, its edges
// the deep steel trusses (14 ft) along the sidelines and a shallower fascia
// across the ends; the underside steel.
const OU = 26.5, OV0 = -33, OV1 = 36
{
  const outer = rectUV(SU0 + 0.4, SU1 - 0.4, SV0 + 0.4, SV1 - 0.4)
  const hole = rectUV(-OU, OU, OV0, OV1)
  loft(white, outer, Z_ROOF, hole, Z_ROOF) // top, facing up
  loft(steel, hole, 23.2, outer, 23.2) // underside, facing down (reverse order)
  // the opening's edge, facing in
  loft(steel, hole, 23.2, hole, Z_ROOF, true)
  // the sideline trusses: a bottom chord and diagonals under the edge
  for (const s of [-1, 1]) {
    const u = s * (OU + 0.6)
    beam(steel, v3(W(u, OV0 - 2), 22.6), v3(W(u, OV1 + 2), 22.6), 0.9)
  }
}

// The two retractable panels, parked open over the sideline canopies: each
// 26.5 m across by 69 m along the court, a low gable along its middle.
for (const s of [-1, 1]) {
  const ua = s * (OU + 0.3), ub = s * (OU + 26.5)
  const [u0, u1] = s > 0 ? [ua, ub] : [ub, ua]
  const r = rectUV(u0, u1, OV0 - 1, OV1 + 1)
  walls(white, r, Z_ROOF, 29.1)
  // gable: ridge along v at the panel's middle
  const um = (u0 + u1) / 2
  const R0 = v3(W(um, OV0 - 1), 29.9), R1 = v3(W(um, OV1 + 1), 29.9)
  const a = v3(W(u0, OV0 - 1), 29.1), b = v3(W(u1, OV0 - 1), 29.1), c = v3(W(u1, OV1 + 1), 29.1), d = v3(W(u0, OV1 + 1), 29.1)
  white.quad(b, c, R1, R0) // east-facing slope
  white.quad(d, a, R0, R1) // west-facing slope
  white.tri(a, b, R0) // south gable end
  white.tri(c, d, R1) // north gable end
  // the rails the panels run on
  for (const v of [OV0 - 1.8, OV1 + 1.8]) beam(steel, v3(W(-53, v), Z_ROOF + 0.4), v3(W(53, v), Z_ROOF + 0.4), 0.8)
}

// ---------------------------------------------------------------------------
// The bowl, seen through the opening: court wall, lower tier, the suites
// walkway, the cantilevered upper tier up to the roof. Rings round the court
// (OSM way/840573222), corners cut.
{
  const cu = 0.4, cv = 0.6
  const R = (hu: number, hv0: number, hv1: number, c: number) => rectUV(cu - hu, cu + hu, cv - hv0, cv + hv1, c)
  const r0 = R(13, 21, 21, 3)
  const r1 = R(30, 30, 31, 8)
  const r2 = R(32, 31.5, 32.5, 8.5)
  const r3 = R(52, 35, 40, 10)
  loft(steel, r0, 0, r0, 1.2, true) // the court wall, facing the court
  loft(white, r0, 1.2, R(13.6, 21.6, 21.6, 3.2), 1.2, true) // its cap
  loft(seats, R(13.6, 21.6, 21.6, 3.2), 1.2, r1, 11, true) // lower tier
  loft(white, r1, 11, r2, 11, true) // the walkway
  loft(white, r2, 11, r2, 13.5, true) // the upper tier's front
  loft(seats, r2, 13.5, r3, 23.4, true) // upper tier, up under the roof
}

const glow = (p: V3, n: V3) => (Math.abs(n[2]) < 0.3 && p[2] > 9 ? 0.6 : 0)

await save('nyc-louis-armstrong-stadium', 'Louis Armstrong Stadium', [
  { part: louver, material: { ...finish('armstrong-terracotta', 0xc98f78), floodlight: glow } },
  { part: brick, material: finish('armstrong-brick', 0xb27f6d) },
  { part: win, material: PALETTE.window },
  { part: white, material: PALETTE.trim },
  { part: steel, material: finish('armstrong-steel', 0x6e767f) },
  { part: seats, material: finish('armstrong-seat-blue', 0x566c91) },
], {
  bearing: 0, elevation: 0, anchor: [40.7509981, -73.8454091], height: 29.9,
  replaces: ['way/840573223'],
})
