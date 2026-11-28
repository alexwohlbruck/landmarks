/**
 * Emirates Stadium, Holloway, London: original procedural geometry,
 * CC0-1.0, no textures.  bun generators/london-emirates-stadium.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/london-emirates-stadium.glb, the low model (<= 6,500 triangles);
 * - models/london-emirates-stadium.detail.glb, drawn from zoom 16
 *   (<= 40,000): the two primary trusses as triangular space trusses, the
 *   secondary trusses at twice the density, the tripods' bracing.
 * Uses the stadium kit exported by manchester-old-trafford.ts (merge that
 * generator first).
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 1.1: model
 * +y runs along the pitch (north, the North Bank), +x across it (the East
 * Stand). Anchor = area centroid of the leisure=stadium outline
 * way/25651711, lng -0.1084002, lat 51.5550424. Bearing 1.1 = the pitch's
 * long edges (OSM way/50868890). y = 0 is the pitch.
 *
 * Identity, in order: the white tubular roof structure, two great primary
 * trusses running the length of the ground over the sides, arched, ending
 * on four white tripods at the corners, and the secondary trusses fanning
 * from them and from the inner edge to the outer ring; the bowl's roof
 * edge undulating, higher over the sides than over the ends; the glass
 * curtain wall under a deep silver eave, over the band of red murals of
 * players and the dark podium; three tiers of red seats with two rows of
 * boxes between them; the ring of floodlights under the roof's inner edge.
 *
 * Evidence
 *  - OSM (measured in this frame): outline way/25651711 (leisure=stadium,
 *    Q163995), a superellipse x -98.8..98.8, y -121.6..122.1, taken as the
 *    roof's outer edge; the four stands (building=stadium, height=41.5):
 *    East Stand way/193811136, North Bank way/193811138, Clock End
 *    way/193811140, West Stand way/193811141, whose inner edges give the
 *    seats' front: x +-41.2 on the sides, y -63..63 at the ends, the
 *    corners rounded over about 10 m; pitch way/50868890 x -39.5..41.2,
 *    y -58.3..58.7.
 *  - Published (Wikipedia, "Emirates Stadium"): opened 2006, HOK Sport
 *    (Populous), 60,704 seats in three tiers with a ring of boxes between
 *    them; the bowl's roof on two primary trusses carried by four tripods.
 *    OSM height 41.5 m taken as the primary trusses' crown.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - "London Emirates Stadium arsenal.jpg", Arne Müseler, CC BY-SA 3.0
 *      de: aerial from the south-west: the whole roof structure, the
 *      primary trusses, the tripods, the murals, the glass;
 *    - "Emirates Stadium aerial 2020-07.jpg", Ed g2s, CC BY-SA 4.0: the
 *      roof's trusses from above, the seats and the inner edge;
 *    - "Emirates Stadium - geograph.org.uk - 4006374", Russel Wills,
 *      CC BY-SA 2.0: the facade from the street: the murals, the glass,
 *      the tripods' V legs and the deep eave falling toward the end;
 *    - "Emirates Stadium, Holloway - geograph.org.uk - 4780925", Jim
 *      Osley, CC BY-SA 2.0: by night: the lit glass and sign, the eave;
 *    - "Emirates Stadium 2009.jpg", Wonker, CC BY 2.0: inside: the
 *      three tiers, the boxes, the arched primary truss over the far side.
 *  - Terrain (Mapterhorn): checked with `terrain.ts check`.
 *
 * Measured (OSM): the plan. Published: tiers, structure. Estimated from
 * the photos: the eave (33 m over the middle of the sides falling to 30 m
 * over the ends), the inner edge (35 m on the sides, 31 m at the ends), the
 * primary trusses' arch (41.5 m crown, 33 m at the tripods, which stand
 * on the facade line at y +-103.5), the
 * facade's bands (podium to 4 m, murals to 17 m, glass to 29 m, set 4 m
 * in under the eave), the tier profile, the number of secondary trusses
 * (one per 10 degrees in the low model, 5 in the detail).
 * Look-only: none.
 * Doubts: the murals are drawn as plain red panels at about their real
 * places; the real roof has more secondary members than drawn. The map's
 * terrain shows the pitch 4-5 m below the podium round the bowl; no
 * drawing or published level confirms a sunk pitch, so elevation stays 0
 * and the model stands on the lowest ground (`terrain.ts check` passes).
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import {
  bead, oq, prism, rayOutline, rod, rods, sample, spaceTruss, sweep, truss, writeLods, lerp, add,
  type PP, type St,
} from './manchester-old-trafford'

const ID = 'london-emirates-stadium'

/** OSM way/25651711 in this frame. */
const OUTLINE: [number, number][] = [[80.0,72.7],[84.1,64.3],[88.4,55.4],[93.3,39.2],[96.9,23.0],[98.1,15.0],[98.8,7.2],[98.7,-8.8],[97.0,-24.9],[93.1,-40.7],[90.7,-48.9],[87.4,-57.0],[83.9,-64.7],[78.9,-72.5],[71.8,-83.6],[69.3,-86.3],[61.6,-94.8],[50.0,-105.0],[44.8,-108.7],[37.6,-112.3],[30.8,-115.1],[22.3,-118.3],[15.6,-120.0],[6.9,-121.1],[-0.6,-121.6],[-8.4,-121.0],[-16.6,-120.0],[-23.6,-118.1],[-32.1,-115.1],[-39.2,-111.8],[-45.9,-108.0],[-51.3,-104.5],[-61.3,-95.7],[-68.3,-87.7],[-72.3,-83.2],[-80.5,-71.2],[-88.3,-55.5],[-93.9,-39.3],[-97.3,-23.7],[-98.8,-7.7],[-98.6,8.5],[-97.1,24.9],[-93.1,40.7],[-87.9,55.9],[-79.4,72.1],[-71.3,84.4],[-65.1,91.5],[-57.1,99.5],[-48.3,105.6],[-36.2,112.5],[-27.0,116.4],[-15.4,120.3],[-7.0,121.3],[0.1,122.1],[8.2,121.2],[16.4,119.9],[25.3,117.9],[31.1,115.6],[39.0,111.7],[44.9,108.6],[51.2,104.3],[62.6,94.6],[70.4,86.2],[73.9,80.8]]
const C: [number, number] = [0.8, 0.3] // the pitch's centre
const FA = 41.5, FB = 62.5, FP = 7 // the seats' front: a superellipse

const M = {
  red: { ...finish('afc-red', 0xc7413c), floodlight: (q: V3, n: V3) => (Math.abs(n[2]) < 0.4 && q[2] > 3 && q[2] < 18 ? 0.45 : 0) } as MaterialSpec,
  white: finish('truss-white', 0xf2f2ee, 0.5),
  roof: { ...finish('roof-grey', 0xd3d7da, 0.7), doubleSided: true } as MaterialSpec,
  steel: finish('cladding-silver', 0xa9b0b6, 0.55),
  window: { ...PALETTE.window, color: 0x7f97a6 } as MaterialSpec,
  lamp: finish('lamp-floodlight', 0xd9dad6, 0.5),
}

function build(detail: boolean) {
  const red = new Part(), white = new Part(), roof = new Part(), steel = new Part(), win = new Part(), lamp = new Part()
  const RS = detail ? 6 : 4
  const r = detail ? 0.6 : 0.85
  const N = detail ? 144 : 72
  const tFront = (u: V3) => 1 / Math.pow(Math.pow(Math.abs(u[0]) / FA, FP) + Math.pow(Math.abs(u[1]) / FB, FP), 1 / FP)
  const dirOf = (th: number): V3 => [Math.sin(th), Math.cos(th), 0]
  const sts: St[] = [], Ds: number[] = [], ths: number[] = []
  for (let i = 0; i <= N; i++) {
    const th = (2 * Math.PI * i) / N, u = dirOf(th)
    const tf = tFront(u), to = rayOutline(OUTLINE, C, u)
    sts.push({ o: [C[0] + u[0] * tf, C[1] + u[1] * tf, 0], n: u })
    Ds.push(to - tf); ths.push(th)
  }
  const side = (th: number) => Math.pow(Math.sin(th), 2) // 1 over the sides, 0 over the ends
  const zIn = (th: number) => 31 + 4 * side(th)
  const zOut = (th: number) => 30 + 3 * Math.pow(Math.abs(Math.sin(th)), 3)
  const D0 = 1.5 // the roof's inner edge, past the seats' front
  const TH = 1.0
  const roofZ = (i: number, d: number) => lerp(zIn(ths[i]), zOut(ths[i]), (d - D0) / (Ds[i] - D0))
  const roofZxy = (x: number, y: number) => {
    const v: V3 = [x - C[0], y - C[1], 0], t = Math.hypot(v[0], v[1]), th = Math.atan2(v[0], v[1])
    const u = dirOf(th), d = t - tFront(u), D = rayOutline(OUTLINE, C, u) - tFront(u)
    return lerp(zIn(th), zOut(th), Math.min(1, Math.max(0, (d - D0) / (D - D0))))
  }

  // seats: three tiers, two rows of boxes, scaled to each station's depth
  sweep(sts, (i) => {
    const s = Math.min(1.05, Ds[i] / 58)
    const pr: PP[] = [[0, 0, red], [0, 1.2, red], [20 * s, 8.5, win], [20 * s, 12, red], [27 * s, 15.5, win], [27 * s, 19, red], [46 * s, 28.5, steel], [46 * s, 0, null]]
    pr[pr.length - 1][1] = roofZ(i, 46 * s) - TH
    return pr
  })
  // roof: inner fascia, top, underside, the eave's edge
  sweep(sts, (i) => [[D0, zIn(ths[i]) - 2.2, steel], [D0, zIn(ths[i]) + 0.2, roof], [Ds[i], zOut(ths[i]), white], [Ds[i], zOut(ths[i]) - 1.4, null]])
  sweep(sts, (i) => [[D0, zIn(ths[i]) - 2.2, roof], [Ds[i], zOut(ths[i]) - 1.4, null]], true)
  // facade, 4 m in under the eave: dark podium, murals and glass, glass curtain, the silver soffit band
  const mural = (th: number) => {
    const deg = ((th * 180) / Math.PI + 360) % 360
    // eight murals, two on each side and end, clear of the tripods
    return [25, 65, 115, 155, 205, 245, 295, 335].some((m) => Math.abs(deg - m) < 9)
  }
  for (let i = 0; i < N; i++) {
    const a = sts[i], b = sts[i + 1], Da = Ds[i] - 4, Db = Ds[i + 1] - 4
    const Q = (p: Part, z0: number, z1: number, off = 0) => {
      const P = (s: St, D: number, z: number): V3 => [s.o[0] + s.n[0] * (D + off), s.o[1] + s.n[1] * (D + off), z]
      oq(p, P(a, Da, z0), P(b, Db, z0), P(b, Db, z1), P(a, Da, z1), add(a.n, b.n))
    }
    Q(steel, 0, 4)
    Q(mural((ths[i] + ths[i + 1]) / 2) ? red : win, 4, 17)
    Q(steel, 17, 18)
    Q(win, 18, 29)
    // a silver band from the glass top up to the roof's underside
    const und = (j: number, d: number) => lerp(zIn(ths[j]) - 2.2, zOut(ths[j]) - 1.4, (d - D0) / (Ds[j] - D0)) + 0.05
    const P = (s: St, D: number, z: number): V3 => [s.o[0] + s.n[0] * D, s.o[1] + s.n[1] * D, z]
    oq(steel, P(a, Da, 29), P(b, Db, 29), P(b, Db, und(i + 1, Db)), P(a, Da, und(i, Da)), add(a.n, b.n))
  }
  // floodlights under the inner edge
  for (let i = 0; i < N; i += detail ? 1 : 2) {
    const s = sts[i]
    bead(lamp, [s.o[0] + s.n[0] * (D0 + 0.8), s.o[1] + s.n[1] * (D0 + 0.8), zIn(ths[i]) - 2.8], detail ? 0.6 : 0.9)
  }

  // ------------------------------------------------- the roof structure
  // the primary trusses: over the sides at x = +-45 from tripod to tripod, arched
  const YE = 103.5
  for (const sx of [-1, 1]) {
    const x = C[0] + sx * 45
    const n = detail ? 24 : 12
    const top: V3[] = [], bot: V3[] = []
    for (let k = 0; k <= n; k++) {
      const y = lerp(-YE, YE, k / n), f = y / YE
      const zt = 33 + 8.5 * (1 - f * f)
      const zr = roofZxy(x, y) + 0.4
      top.push([x, y, zt]); bot.push([x, y, Math.max(zr, zt - 7.5)])
    }
    if (detail) spaceTruss(white, top, bot, [1, 0, 0], 4, r * 1.2, RS)
    else truss(white, top, bot, r * 1.3, RS)
    // the tripods at both ends: three legs from a grey core at 9 m up to the truss's end
    for (const sy of [-1, 1]) {
      const apex: V3 = [x, sy * YE, 33]
      const out: V3 = [sx * 0.55, sy * 0.83, 0]
      const core: [number, number] = [x, sy * YE]
      const oct = Array.from({ length: 8 }, (_, k) => [core[0] + 3.5 * Math.cos((k * Math.PI) / 4), core[1] + 3.5 * Math.sin((k * Math.PI) / 4)] as [number, number])
      prism(steel, oct, 0, 9)
      const feet: V3[] = [[core[0] + out[0] * 2.5, core[1] + out[1] * 2.5, 9], [core[0] - out[1] * 3.5, core[1] + out[0] * 3.5, 9], [core[0] + out[1] * 3.5, core[1] - out[0] * 3.5, 9]]
      for (const f of feet) rod(white, f, apex, r * 1.8, RS)
      if (detail) for (let k = 0; k < 3; k++) rod(white, sample(feet[k], apex, 3)[1], sample(feet[(k + 1) % 3], apex, 3)[1], r, RS)
    }
  }
  // secondary trusses: from the outer ring in to the primary trusses (sides) or the inner edge (ends)
  const step = detail ? 2 : 2
  const ring: V3[] = []
  for (let i = 0; i < N; i += step) {
    const s = sts[i], th = ths[i], u = s.n
    const tf = tFront(u)
    const tP = Math.abs(u[0]) > 1e-3 ? 45 / Math.abs(u[0]) : Infinity
    const tIn = tP < tf + Ds[i] - 6 ? Math.max(tf + D0, tP) : tf + D0
    const tOut = tf + Ds[i] - 1
    const P = (t: number, dz: number): V3 => [C[0] + u[0] * t, C[1] + u[1] * t, roofZxy(C[0] + u[0] * t, C[1] + u[1] * t) + dz]
    const k = detail ? 5 : 3
    const bot = sample(P(tIn, 0.3), P(tOut, 0.3), k).map((p) => [p[0], p[1], roofZxy(p[0], p[1]) + 0.3] as V3)
    const top = bot.map((p, j) => [p[0], p[1], p[2] + (j === k ? 0.8 : 2.8)] as V3)
    truss(white, top, bot, r * 0.8, RS, { posts: detail })
    ring.push(top[k])
    void th
  }
  // the outer ring along the eave
  rods(white, [...ring, ring[0]], r * 0.9, RS)

  return [
    { part: red, material: M.red },
    { part: white, material: M.white },
    { part: roof, material: M.roof },
    { part: steel, material: M.steel },
    { part: win, material: M.window },
    { part: lamp, material: M.lamp },
  ]
}

if (import.meta.main) {
  writeLods('Emirates Stadium', [
    { file: `${ID}.glb`, parts: build(false) },
    { file: `${ID}.detail.glb`, parts: build(true) },
  ])
}
