/**
 * Incheon International Airport Terminal 2 (Heerim Architects with Gensler,
 * opened 2018; its two 750 m wing concourses opened in the 2024 expansion) —
 * procedural, CC0-1.0, no textures.
 * bun generators/incheon-airport-terminal-2.ts
 *
 * Writes models/incheon-airport-terminal-2.glb (low) and
 * models/incheon-airport-terminal-2.detail.glb (detail: the whole landmark
 * again with the landside V-columns, more of the white roof masts, mullion
 * groups and the jet bridges).
 *
 * Map frame: x along the main building (model east = compass 59.3°), y
 * across it towards the landside (model north = compass −30.7°), z up,
 * metres. Placed at bearing −30.7°: the main building's long axis, measured
 * from the outline. Anchor: area centroid of OSM relation/9310847
 * (126.4341534, 37.4681526).
 *
 * Plan (OSM, in this frame): the main building is a slab about 650 m along x
 * and 250 m deep, its landside face (y ≈ 40…110) a gentle curve facing the
 * transportation centre and the station; from its four corners four
 * concourse wings run out along y: two towards the airside (south-west
 * x ≈ −200…−400, south-east x ≈ 360…620 in OSM's unturned frame) from the
 * 2018 building, and two towards the landside flanks (west and north) from
 * the 2024 expansion, which wrap round the transportation centre.
 *
 * Identifying features (photos): the main building's flowing silver roof,
 * built of long shingle-like shells, each a shallow barrel, that step up from the landside eave to a
 * crest and down again towards the airside, with glazed clerestories between
 * them, overhanging the departures curb on white branching V-columns, the
 * eave sweeping up towards both ends; the
 * long, low concourse wings with flat pale-teal roofs lined along both edges
 * by rows of white mast frames; everywhere a green-tinted curtain wall over
 * a pale gate level, as at Terminal 1.
 *
 * Evidence
 * - OSM: relation/9310847 (outers 1293569225, 669365557, 462025720; inners
 *   1547559604, 1547559889 at the two landside wing tips, area=yes — filled
 *   here, see doubts; building:levels 4, roof:shape round,
 *   start_date 2018-01-18; no height).
 * - Published: main building 620 m × 205 m (Korean press on the opening,
 *   e.g. Kyeongin Ilbo); floor area 388,000 m² + 347,000 m² for the
 *   expansion, the expansion being two 750 m wing buildings, one on each side
 *   (airport.kr; NewDaily 2024-10-21).
 * - Photos (Wikimedia Commons):
 *   • "02-NOV-2023 - KC910 ICN-ALA (EI-KEB - B767-300) (03).jpg", Simply
 *     Aviation, CC BY-SA 4.0 — from the air just after take-off: the stepped
 *     silver roof shells, the teal wing roofs with their white masts, the
 *     curtain walls; roof colours sampled from it.
 *   • "2025-10-14 17.32.53 Incheon International Airport.jpg" and
 *     "… 17.34.10 …", Choikwangmo25, CC0 — the landside eave over the curb and
 *     the white branching columns.
 *   • "인천공항T2 풍경 오후 2024.jpg", "인천공항T2 주차장측 2024.jpg",
 *     "인천공항T2 입구 2024.jpg", Narubaru7, CC BY 4.0 — the eave, the columns,
 *     the glazing.
 *   • "Incheon International Airport Air Traffic Control tower and terminal 2.jpg",
 *     Christophe95, CC BY-SA 4.0 — the airside skyline from Terminal 1.
 *   • "Incheon Morning departures (51121781050).jpg", Tony, CC BY 2.0.
 *
 * Numbers (estimated from the photos against aircraft and the published
 * plan size): wings: gate level 0–7 m, curtain wall to 17.5 m, roof 20 m,
 * masts 7 m over it. Main building: lower block 20 m; four roof shells from
 * an 18 m landside eave (about 15 m in front of the glass) to a 40 m crest,
 * each a barrel rising 3–4 m across its band, with glazed steps of 4–5 m
 * between them (exaggerated a little over the aerial so they read); the
 * eave rises 6 m towards the hall's ends (estimated from the curb photos);
 * the shells fall about 7 m towards both ends.
 *
 * Doubts
 * - No licensed photo shows the whole main roof at an angle from which its
 *   section can be measured; the shells' number (four) and heights are
 *   read from the aerial at an oblique angle.
 * - OSM's two small inner rings at the landside wing tips (probably light
 *   wells or rotunda voids) are filled.
 * - The hall roof is drawn from the west notch in the landside face to the
 *   north-east wing (≈ 515 m of the published 620 m); the main building's
 *   west end, beyond the notch, is drawn at the lower block's height.
 * - Jet bridges at an even pitch, not gate by gate.
 */
import { type V3 } from './mesh'
import { type XY, quadN, unit, capPoly } from './nyc-570-lexington'
import { writeLod, beam, prismRing, newMats } from './tokyo-haneda-terminal-1'
import { ICN, UP, DOWN, gridSurf, ribbonPrism, piFrame, rod, bar, jetBridge, type Mats } from './incheon-airport-terminal-1'
import { finish } from './palette'

/** OSM relation/9310847's joined outer ring, in this frame. */
const RING: XY[] = [[-332.7, -94.8], [-372.2, 110.9], [-403.4, 313.6], [-411.7, 373.8], [-424.8, 440.0], [-431.5, 476.3], [-432.2, 484.4], [-430.7, 489.2], [-428.7, 495.0], [-425.5, 499.5], [-421.5, 503.5], [-413.9, 510.5], [-405.1, 516.1], [-385.7, 515.8], [-320.6, 504.4], [-306.5, 485.8], [-297.6, 473.5], [-327.8, 434.4], [-357.1, 394.7], [-360.1, 388.6], [-362.4, 382.6], [-362.9, 377.8], [-359.9, 343.7], [-352.9, 276.2], [-336.0, 155.9], [-310.3, 39.4], [-196.1, 24.5], [-187.5, 74.4], [-131.4, 68.0], [-100.0, 66.4], [-53.3, 66.9], [-27.8, 67.7], [6.9, 70.5], [33.5, 73.3], [64.0, 77.3], [130.8, 89.6], [181.7, 102.0], [211.7, 58.0], [275.8, 84.1], [309.9, 109.8], [302.5, 265.4], [297.8, 365.7], [295.4, 415.3], [293.3, 426.2], [288.3, 435.7], [283.5, 442.1], [251.1, 472.6], [206.6, 514.6], [213.8, 528.6], [224.3, 545.5], [229.3, 550.4], [272.4, 565.1], [311.8, 577.5], [322.2, 573.2], [337.7, 564.3], [346.1, 555.9], [346.9, 547.5], [347.4, 535.3], [346.2, 447.1], [344.1, 357.3], [347.8, 266.1], [354.5, 97.4], [360.3, 23.4], [359.6, -3.9], [355.5, -21.6], [349.1, -38.3], [339.0, -63.4], [360.9, -185.3], [380.0, -205.3], [395.4, -231.4], [427.1, -319.7], [445.7, -370.8], [459.9, -411.2], [467.5, -435.5], [470.0, -446.4], [467.8, -455.7], [462.0, -465.9], [451.8, -473.0], [438.7, -477.5], [430.9, -477.9], [421.3, -476.1], [411.9, -473.4], [402.7, -468.0], [398.7, -464.0], [395.6, -459.8], [391.9, -454.2], [390.7, -448.8], [392.0, -439.7], [396.0, -428.0], [401.8, -403.3], [401.7, -381.4], [401.4, -361.0], [380.6, -308.7], [362.3, -254.1], [350.2, -230.4], [341.1, -215.7], [329.4, -199.8], [322.1, -192.4], [309.9, -182.3], [300.0, -175.5], [289.0, -169.3], [274.5, -162.9], [258.7, -158.1], [233.4, -153.4], [165.2, -151.4], [128.4, -150.4], [-2.9, -167.9], [-117.8, -170.3], [-162.1, -179.0], [-200.3, -186.1], [-214.0, -188.9], [-231.0, -194.4], [-246.5, -200.7], [-261.3, -209.4], [-275.7, -219.6], [-293.2, -235.5], [-305.2, -252.8], [-314.4, -268.7], [-321.4, -284.5], [-328.6, -305.8], [-333.4, -326.6], [-347.2, -400.4], [-350.5, -418.5], [-352.5, -430.6], [-353.0, -446.8], [-352.2, -460.9], [-347.8, -479.4], [-342.4, -493.0], [-336.1, -505.3], [-333.3, -511.1], [-331.1, -516.9], [-330.4, -522.2], [-331.7, -529.1], [-335.1, -537.8], [-340.1, -543.8], [-347.3, -550.0], [-351.4, -552.5], [-357.3, -556.1], [-366.5, -557.7], [-375.3, -559.2], [-384.2, -558.7], [-397.0, -555.7], [-403.6, -551.5], [-408.4, -545.3], [-411.4, -539.1], [-411.6, -527.9], [-407.1, -502.3], [-386.1, -386.3], [-372.1, -309.2], [-366.3, -290.3], [-360.3, -275.3], [-354.6, -263.8], [-348.2, -254.2], [-342.0, -218.3]]

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i)
/** The main building, and the four wings, as vertex index lists of RING. */
const CORE = [0, ...range(25, 39), ...range(61, 67), ...range(93, 110), 153]
const WINGS = [range(0, 25), range(39, 61), range(67, 93), range(110, 153)]
/** The landside face under the hall: OSM's edge east of the west notch (27…39). */
const LAND = range(27, 39).filter((i) => i !== 37).map((i) => RING[i]) // 37: a small notch, bridged

const Z_GATE = 7, Z_GLASS = 17.5, Z_WING = 20, MAST = 7
const HX0 = -184, HX1 = 332 // the hall's ends: from the west notch to the north-east wing's root
const Y_AIR = -95 // the hall's airside clerestory line

/** The landside wall's y at x (OSM edge, linearly between its vertices). */
const yWall = (x: number) => {
  for (let i = 0; i < LAND.length - 1; i++) {
    const a = LAND[i], b = LAND[i + 1]
    if (x >= a[0] && x <= b[0]) return a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0])
  }
  return x < LAND[0][0] ? LAND[0][1] : LAND[LAND.length - 1][1]
}

/** The airside edge of the main building (OSM 110…93, west to east). */
const AIR = range(93, 110).reverse().map((i) => RING[i])
const yAirEdge = (x: number) => {
  for (let i = 0; i < AIR.length - 1; i++) {
    const a = AIR[i], b = AIR[i + 1]
    if (x >= a[0] && x <= b[0]) return a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0])
  }
  return x < AIR[0][0] ? AIR[0][1] : AIR[AIR.length - 1][1]
}
/** The hall's airside clerestory line: 55 m in from the airside edge (the gate concourse band). */
const yClere = (x: number) => yAirEdge(x) + 55

/**
 * The roof shells, as bands of t: 0 at the landside wall, 1 at the airside
 * clerestory, negative over the eave. Every shell follows both edges, so at
 * the east end, where the airside edge bends round into the south-east wing,
 * the shells bend with it as in the aerial.
 */
type Shell = { t0: number; t1: number; z: (t: number) => number }
const T_EAVE = -0.09
/** Each shell is a shallow barrel across its band, lifted in steps towards a crest. */
const barrel = (t0: number, t1: number, zA: number, zB: number, bulge: number) => (t: number) => {
  const u = (t - t0) / (t1 - t0)
  return zA + (zB - zA) * u + bulge * Math.sin(Math.PI * u)
}
const SHELLS: Shell[] = [
  { t0: T_EAVE, t1: 0.27, z: (t) => (t < 0 ? 18 + 3.4 * Math.pow((t - T_EAVE) / -T_EAVE, 0.8) : barrel(0, 0.27, 21.4, 24.6, 3.4)(t)) },
  { t0: 0.27, t1: 0.52, z: barrel(0.27, 0.52, 29.2, 31.4, 4) },
  { t0: 0.52, t1: 0.77, z: barrel(0.52, 0.77, 35.6, 36.2, 4) },
  { t0: 0.77, t1: 1, z: barrel(0.77, 1, 31, 24.6, 3.2) },
]
/** A point of the hall at x and band position t. */
const hallXY = (x: number, t: number): XY => { const yw = yWall(x), yc = yClere(x); return [x, yw + (yc - yw) * t] }
/** The shells fall towards both ends of the hall (never below the eave). */
const endDrop = (x: number, z: number) => {
  const xc = (HX0 + HX1) / 2, h = (HX1 - HX0) / 2, u = Math.abs(x - xc) / h
  const t = Math.max(0, (u - 0.72) / 0.28)
  return z - 7 * t * t * Math.min(1, Math.max(0, (z - 20) / 12))
}

/** The landside eave sweeps up towards both ends of the hall (photos from the curb). */
const eaveLift = (x: number, t: number) => {
  const xc = (HX0 + HX1) / 2, h = (HX1 - HX0) / 2, u = Math.min(1, Math.abs(x - xc) / h)
  const w = Math.max(0, 1 - (t - T_EAVE) / (0.14 - T_EAVE))
  return 6 * Math.pow(u, 3) * w * w
}

function buildT2(detail: boolean) {
  const M = newMats(['roof', 'teal', 'win', 'panel', 'white', 'glass'])
  M.bridge = M.panel

  // --- The four wings and the main building's lower block (OSM rings, cut edges skipped)
  const cutEdges = new Set(['0-25', '39-61', '67-93', '110-153', '25-0', '61-39', '93-67', '153-110'])
  const isCut = (a: XY, b: XY) => {
    const ia = RING.findIndex((p) => p[0] === a[0] && p[1] === a[1]), ib = RING.findIndex((p) => p[0] === b[0] && p[1] === b[1])
    return cutEdges.has(`${ia}-${ib}`)
  }
  for (const w of WINGS) ribbonPrism(M, w.map((i) => RING[i]), { zGate: Z_GATE, zGlass: Z_GLASS, zRoof: Z_WING, roof: 'teal', mullion: detail ? 6 : 0, winBand: [2.2, 5.6], skipEdge: isCut })
  // the lower block: its landside edges are the hall's own glass wall
  const landIdx = new Set(range(27, 39)) // walls under the hall (37 included: the hall wall bridges it)
  ribbonPrism(M, CORE.map((i) => RING[i]), {
    zGate: Z_GATE, zGlass: Z_GLASS, zRoof: Z_WING - 0.05, roof: 'teal', mullion: detail ? 6 : 0, winBand: [2.2, 5.6],
    skipEdge: (a, b) => {
      if (isCut(a, b)) return true
      const ia = RING.findIndex((p) => p[0] === a[0] && p[1] === a[1]), ib = RING.findIndex((p) => p[0] === b[0] && p[1] === b[1])
      return landIdx.has(ia) && landIdx.has(ib)
    },
  })
  // the bit of lower block wall in front of the hall's west and east ends, under the eave line
  // (none: the hall wall runs the full landside face)

  // --- The hall: four roof shells over glass
  const nX = detail ? 64 : 24
  const xs = Array.from({ length: nX + 1 }, (_, i) => HX0 + ((HX1 - HX0) * i) / nX)
  const T = 1.8 // shell thickness: its edge reads as a white band
  const P = (sh: Shell, x: number, t: number, dz = 0): V3 => { const q = hallXY(x, t); return [q[0], q[1], endDrop(x, sh.z(t)) + dz + (sh === SHELLS[0] ? eaveLift(x, t) : 0)] }
  const tOut = (x: number, t: number): V3 => { const a = hallXY(x, t), b = hallXY(x, t + 0.01); return unit([a[0] - b[0], a[1] - b[1], 0]) }
  SHELLS.forEach((sh, k) => {
    const J = detail ? 10 : 4
    const ts = Array.from({ length: J + 1 }, (_, j) => sh.t0 + ((sh.t1 - sh.t0) * j) / J)
    gridSurf(M.roof, xs.map((x) => ts.map((t) => P(sh, x, t))), () => UP)
    if (k === 0) { // the eave's soffit, out to the glass wall
      const tsE = ts.filter((t) => t <= 0.001).concat([0])
      gridSurf(M.white, xs.map((x) => tsE.map((t) => P(sh, x, t, -T))), () => DOWN)
    }
    // the white edges: landside and airside of the shell, and its ends
    gridSurf(M.white, xs.map((x) => [P(sh, x, sh.t0, -T), P(sh, x, sh.t0)]), (m) => tOut(m[0], sh.t0))
    gridSurf(M.white, xs.map((x) => [P(sh, x, sh.t1, -T), P(sh, x, sh.t1)]), (m) => { const o = tOut(m[0], sh.t1); return [-o[0], -o[1], 0] })
    for (const [x, sg] of [[HX0, -1], [HX1, 1]] as [number, number][]) gridSurf(M.white, [ts.map((t) => P(sh, x, t, -T)), ts.map((t) => P(sh, x, t))], () => [sg, 0, 0])
    // the glazed riser between this shell and the next (glass, sunlit by day): from the lower edge
    // up under the higher one, facing the lower side; after the last, down to the lower block's roof
    const next = SHELLS[k + 1]
    gridSurf(M.glass, xs.map((x) => {
      const q = hallXY(x, sh.t1 - 0.004), a = endDrop(x, sh.z(sh.t1)), b = next ? endDrop(x, next.z(next.t0)) : Z_WING
      return [[q[0], q[1], Math.min(a, b) - (b > a ? 0.05 : 0)], [q[0], q[1], Math.max(a, b) - T]] as V3[]
    }), (m) => { const o = tOut(m[0], sh.t1), up = next ? next.z(next.t0) > sh.z(sh.t1) : false; return up ? [o[0], o[1], 0] : [-o[0], -o[1], 0] })
    // the hall's end walls under this shell (glass, down to the ground in front, the lower block behind)
    for (const [x, sg] of [[HX0, -1], [HX1, 1]] as [number, number][]) {
      const t0 = Math.max(0, sh.t0), t1 = sh.t1
      const pts = Array.from({ length: 6 }, (_, j) => t0 + ((t1 - t0) * j) / 5)
      gridSurf(M.win, [pts.map((t) => { const q = hallXY(x, t); return [q[0], q[1], k === 0 && t < 0.05 ? 0 : Z_WING - 0.1] as V3 }), pts.map((t) => P(sh, x, t, -T))], () => [sg, 0, 0])
    }
  })
  // the landside glass wall, from the ground up under the first shell
  const w0 = SHELLS[0]
  const wallTop = (x: number) => endDrop(x, w0.z(0)) + eaveLift(x, 0) - T
  gridSurf(M.win, xs.map((x) => [[x, yWall(x), 0], [x, yWall(x), wallTop(x)]] as V3[]), () => [0, 1, 0])
  for (let i = 1; i < nX; i += detail ? 1 : 2) { const x = xs[i]; bar(M.white, [x, yWall(x), 0], [x, yWall(x), wallTop(x)], detail ? 0.6 : 1.0, unit([-(yWall(x + 1) - yWall(x - 1)) / 2, 1, 0]), 0.1) }
  for (const z of [7, 14]) for (let i = 0; i < nX; i++) { const a = xs[i], b = xs[i + 1]; bar(M.white, [a, yWall(a), z], [b, yWall(b), z], 0.7, unit([-(yWall(b) - yWall(a)) / (b - a), 1, 0]), 0.1) }
  // the white columns under the eave: branching V pairs (detail) or plain posts (low)
  for (let x = HX0 + 18; x < HX1 - 10; x += detail ? 36 : 72) {
    const q = hallXY(x, T_EAVE * 0.8), y = q[1], zt = endDrop(x, w0.z(T_EAVE * 0.8)) + eaveLift(x, T_EAVE * 0.8) - T
    if (detail) {
      rod(M.white, [x, y, 0], [x, y, 6], 1.5)
      rod(M.white, [x, y, 6], [x - 7, y, zt], 1.1)
      rod(M.white, [x, y, 6], [x + 7, y, zt], 1.1)
      rod(M.white, [x, y, 6], [x, y - 8, zt + 1.5], 0.8)
    } else {
      rod(M.white, [x, y, 0], [x - 5, y, zt], 1.4)
      rod(M.white, [x, y, 0], [x + 5, y, zt], 1.4)
    }
  }
  // a skylight along the crest
  gridSurf(M.glass, xs.slice(3, -3).map((x) => [P(SHELLS[2], x, 0.62, 0.25), P(SHELLS[2], x, 0.67, 0.25)]), () => UP)

  // --- White mast frames along the wings' and the lower block's roof edges
  const spacing = detail ? 30 : 64
  for (const ring of [...WINGS.map((w) => w.map((i) => RING[i])), CORE.map((i) => RING[i])]) {
    const r = unit([0, 0, 0]) && ring
    let area2 = 0
    for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; area2 += a[0] * b[1] - b[0] * a[1] }
    const ccw = area2 > 0
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      if (isCut(a, b)) continue
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 30) continue
      const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], inn: XY = ccw ? [-u[1], u[0]] : [u[1], -u[0]]
      // the lower block's landside edges are under the hall: no masts
      if (ring.length === CORE.length) {
        const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
        if (m[1] > yWall(m[0]) - 135) continue
      }
      for (let s = spacing / 2; s < L - 8; s += spacing) {
        const q: XY = [a[0] + u[0] * s + inn[0] * 3.5, a[1] + u[1] * s + inn[1] * 3.5]
        const q2: XY = [q[0] + u[0] * 7, q[1] + u[1] * 7]
        piFrame(M.white, q, q2, Z_WING - 0.2, Z_WING + MAST, detail ? 0.6 : 1.0)
      }
    }
  }

  // --- Jet bridges (detail): along the airside edges of the wings and the lower block
  if (detail) {
    for (const ring of [...WINGS.map((w) => w.map((i) => RING[i])), CORE.map((i) => RING[i])]) {
      let area2 = 0
      for (let i = 0; i < ring.length; i++) { const a = ring[i], b = ring[(i + 1) % ring.length]; area2 += a[0] * b[1] - b[0] * a[1] }
      for (let i = 0; i < ring.length; i++) {
        const a = ring[i], b = ring[(i + 1) % ring.length]
        if (isCut(a, b)) continue
        const L = Math.hypot(b[0] - a[0], b[1] - a[1])
        if (L < 45) continue
        const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
        if (ring.length === CORE.length && m[1] > -60) continue // landside of the main building
        if (ring.length !== CORE.length && m[1] > 20 && m[1] < 140 && Math.abs(m[0]) < 330) continue
        const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], out: XY = area2 > 0 ? [u[1], -u[0]] : [-u[1], u[0]]
        for (let s = 25; s < L - 15; s += 55) jetBridge(M, [a[0] + u[0] * s, a[1] + u[1] * s], out, 20)
      }
    }
  }

  return [
    { part: M.roof, material: finish('icn-t2-shell-roof', 0xaab3b8) },
    { part: M.teal, material: finish('icn-t2-teal-roof', 0xa9cdc6) },
    { part: M.win, material: ICN.window },
    { part: M.panel, material: ICN.panel },
    { part: M.white, material: ICN.white },
    { part: M.glass, material: ICN.glass },
  ]
}

if (import.meta.main) {
  const extras = { bearing: -30.7, osm: 'relation/9310847', height: 40.2 }
  writeLod('Incheon International Airport Terminal 2', 'incheon-airport-terminal-2.glb', buildT2(false), extras, 8000, 250_000)
  writeLod('Incheon International Airport Terminal 2', 'incheon-airport-terminal-2.detail.glb', buildT2(true), extras, 40_000, 1_500_000)
}
