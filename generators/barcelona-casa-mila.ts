/**
 * Casa Milà, "La Pedrera" (Passeig de Gràcia 92 / Provença 261–265,
 * Barcelona; Antoni Gaudí, 1906–1912) — original procedural geometry,
 * CC0-1.0.
 * bun generators/barcelona-casa-mila.ts
 *
 * Uses the kit in barcelona-casa-batllo.ts (merge that first).
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM multipolygon relation/8974896,
 * 41.395377, 2.161881; bearing 0, so the frame is the compass. The
 * building fills the corner of Passeig de Gràcia (its 21 m facade faces
 * south-west) and Carrer de Provença (43 m, south-east), with the 20 m
 * chamfer facing south between them; party walls to the north-west and
 * north-east; its back faces the block's interior to the north.
 *
 * Identity, in order: the cream limestone facade that waves in and out and
 * up and down, floor by floor, round the corner, its bands of ledges
 * between deep window rows; the dark tangled wrought-iron balconies on the
 * ledges; the white undulating attic above it with its rows of small
 * windows; the roof's stair towers and helmeted "warrior" chimneys; the two
 * open courtyards; the heavy stone piers of the ground floor.
 *
 * Evidence:
 *  - plan: the OSM outline (relation/8974896, two inner rings for the
 *    courtyards) and its parts: relation/8974885 (8 levels, the body),
 *    relation/8974893 (7 levels, the outer strip under the attic),
 *    relation/8974887 and relation/8974890 (9 levels, round the courtyards),
 *    relation/8974894, way/646020507, way/646020740 (7 levels),
 *    way/646020528, way/646020560, way/646020649, way/646020710,
 *    way/646020720, way/646020803, way/646020806, way/646020814 (2 levels:
 *    the stair exits and chimney groups on the roof), way/646020439,
 *    way/646020670, way/646020768 (roof parts). The street line is
 *    smoothed over ±1.5 m (OSM traces each pier's bump); its big waves stay.
 *    Facade lengths published: Passeig de Gràcia 21.15 m, chamfer 20.10 m,
 *    Provença 43.35 m (es.wikipedia, "Casa Milà"); OSM agrees.
 *  - heights: facades 30 m high (published, es.wikipedia), OSM height 26
 *    for the stone. Measured on Thomas Ledl's frontal view of the chamfer
 *    (25.7 px/m, scaled by the stone top): ground floor and entresol to
 *    the first ledge 6.0 m, ledges at 10.0, 13.9, 17.8 and 21.7 m, stone
 *    top 25.5 m ±0.9 m (it waves), attic top 28.3–31 m, the tallest stair
 *    tower 36.5 m. The waves' amplitude (±0.35 m per ledge, ±0.9 m at the
 *    top) and their ~10 m wavelength are read off the same photo and
 *    Diliff's corner view.
 *  - roof: the stair towers and chimneys stand on OSM's roof parts listed
 *    above; their sizes and shapes are estimates from Suicasmo's and Ben's
 *    roof photos and the street views (heights 2.5–8 m over the terrace).
 *  - colour: the limestone reads cream-grey (#e6dccb here); the attic white
 *    (trim); the chimneys' render warm sand; the iron charcoal.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Casa_Milà,_general_view.jpg (Thomas Ledl, CC BY-SA 4.0), the chamfer;
 *  - Casa_Milà_-_Barcelona,_Spain_-_Jan_2007.jpg (Diliff, CC BY 2.5), the
 *    corner at dusk (night look);
 *  - Casa_Milà_2877.jpg (C messier, CC BY-SA 4.0);
 *  - Roof_of_Casa_Milà_20171227.jpg (Suicasmo, CC BY-SA 4.0), chimneys;
 *  - La_Pedrera_(Casa_Milà)_des-de_l'Hotel_Condes_de_Barcelona.jpg
 *    (PepPepet, CC BY-SA 3.0), from above along Passeig de Gràcia;
 *  - Milà_planta_3.jpg (Antoni Gaudí, 1906, public domain), the plan.
 * No look-only sources. No commercial imagery. No lidar.
 *
 * Left out: the sculpted texture of the stone, the window frames and
 * shutters, the iron's tangle (drawn as dark strips), the corner's
 * entrance gates, most of the roof's 28 chimneys (grouped), the stairs and
 * arches of the roof walkway, the courtyards' painted walls.
 *
 * Ground: Mapterhorn shows the block's interior just behind the back facade
 * about 3 m below the streets (the map's y = 0 lands there), so the design
 * stands on a plain 3 m plinth that the streets bury; the street fronts'
 * detail starts at the streets' level. If that dip is not real, the
 * ground floor's piers show 3 m too high; check on the map.
 *
 * Doubts: the back facade (block interior) is drawn like a plain version
 * of the front; the roof is simplified to one terrace level at 28.3 m; the
 * chimney positions are on OSM's roof parts, not checked against an aerial.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { save, triangulate, walls, type XY } from './chi-aon-center'
import { grid, lathe, ringArea } from './barcelona-casa-batllo'

const OUTER_OSM: XY[] = [[-26.39,-1.33],[-24.2,0.79],[-23.87,1.09],[-21.05,3.7],[-18.22,6.32],[-17.98,6.56],[-16.92,7.54],[-9.68,14.25],[-9.18,14.73],[-8.7,14.06],[-8.49,13.43],[-8.38,12.1],[-8.22,11.37],[-7.93,11.0],[-7.45,10.72],[-7.09,10.72],[-6.68,10.81],[-6.38,11.06],[-5.68,11.83],[-5.02,12.41],[-4.12,13.07],[-3.25,13.59],[-2.44,13.93],[-1.6,14.52],[-0.92,15.29],[-0.56,15.87],[-0.41,16.24],[0.15,17.29],[0.66,18.04],[1.31,18.7],[2.51,19.64],[6.07,22.17],[8.7,24.87],[10.08,27.33],[11.52,28.57],[14.67,25.44],[17.72,22.4],[19.02,21.11],[20.3,19.84],[22.89,17.24],[23.34,16.78],[24.81,15.34],[25.1,15.05],[27.85,12.31],[30.83,9.32],[31.95,8.19],[31.82,8.07],[31.39,8.07],[30.85,7.53],[30.9,7.19],[30.79,6.88],[30.66,6.77],[30.53,6.73],[30.06,6.72],[29.93,6.79],[29.05,6.24],[28.96,5.97],[28.97,5.85],[28.89,5.57],[28.65,5.38],[28.37,5.36],[28.34,5.31],[28.23,5.3],[28.05,5.06],[28.15,4.88],[28.23,4.53],[28.2,4.32],[27.98,4.07],[27.8,3.98],[27.6,3.99],[27.29,4.16],[26.59,3.76],[26.59,3.45],[26.55,3.35],[26.37,3.11],[26.28,3.05],[25.63,2.91],[24.66,2.02],[24.71,1.83],[24.76,1.22],[24.72,1.05],[24.5,0.72],[24.1,0.42],[23.9,0.42],[23.59,0.35],[23.44,0.36],[23.24,0.29],[23.14,0.31],[22.11,-0.65],[22.17,-0.94],[22.17,-1.21],[22.08,-1.44],[21.94,-1.6],[21.31,-1.68],[21.02,-2.33],[20.71,-2.89],[20.86,-3.36],[20.87,-3.54],[20.65,-3.89],[20.45,-4.04],[20.26,-4.11],[19.86,-4.13],[19.65,-4.07],[19.37,-3.89],[18.13,-4.9],[18.07,-5.28],[17.33,-6.03],[17.49,-6.78],[17.21,-7.01],[17.08,-7.06],[16.79,-6.95],[16.69,-6.85],[16.64,-6.72],[16.63,-6.54],[16.67,-6.4],[16.67,-6.25],[16.62,-6.09],[16.49,-6.01],[16.36,-5.99],[15.99,-6.07],[15.76,-6.05],[15.6,-5.93],[15.52,-5.75],[14.21,-7.09],[13.06,-8.26],[13.21,-8.53],[13.25,-8.77],[13.17,-8.89],[12.96,-9.11],[13.0,-9.29],[13.87,-9.38],[14.06,-9.52],[14.11,-9.63],[14.09,-9.83],[13.98,-9.94],[13.57,-10.09],[13.12,-10.06],[12.46,-10.66],[12.25,-10.64],[11.39,-11.49],[11.42,-11.71],[11.49,-11.83],[11.49,-12.01],[11.39,-12.19],[11.17,-12.4],[10.43,-12.52],[9.23,-13.76],[9.36,-14.18],[9.31,-14.5],[8.96,-14.73],[8.46,-14.73],[8.27,-14.59],[7.02,-15.6],[7.12,-15.89],[7.05,-16.15],[6.87,-16.26],[6.59,-16.26],[6.31,-16.16],[4.8,-17.41],[4.87,-17.83],[4.83,-18.05],[4.98,-18.11],[5.21,-18.38],[5.29,-18.58],[5.29,-18.73],[5.1,-19.09],[4.93,-19.21],[4.76,-19.25],[4.56,-19.25],[4.32,-19.3],[3.89,-19.77],[3.15,-20.39],[3.22,-20.51],[3.25,-20.92],[3.24,-21.05],[3.13,-21.21],[2.98,-21.32],[2.83,-21.38],[2.69,-21.33],[2.58,-21.36],[2.43,-21.34],[2.27,-21.55],[1.93,-21.85],[1.67,-22.16],[1.79,-22.6],[1.67,-22.88],[1.55,-22.97],[1.33,-23.02],[1.17,-23.0],[0.88,-22.83],[0.83,-22.75],[0.55,-22.67],[0.35,-22.8],[-0.0,-22.88],[-0.49,-22.79],[-0.56,-22.85],[-0.74,-23.29],[-0.93,-23.45],[-1.12,-23.51],[-1.39,-23.47],[-1.55,-23.27],[-1.71,-22.88],[-1.98,-22.76],[-3.91,-22.4],[-4.36,-22.7],[-5.23,-22.62],[-5.65,-23.11],[-5.87,-23.2],[-6.05,-23.19],[-6.37,-23.03],[-6.48,-22.92],[-6.59,-22.57],[-6.57,-22.3],[-6.36,-21.93],[-6.13,-21.64],[-6.13,-21.43],[-6.23,-21.28],[-6.52,-21.1],[-6.64,-20.97],[-6.77,-20.7],[-6.73,-20.28],[-8.24,-20.36],[-10.54,-20.47],[-10.61,-20.91],[-11.02,-21.18],[-11.11,-21.3],[-11.14,-21.59],[-11.01,-21.94],[-11.0,-22.06],[-10.8,-22.27],[-10.64,-22.61],[-10.64,-22.79],[-10.69,-22.93],[-10.8,-23.11],[-10.94,-23.25],[-11.12,-23.34],[-11.36,-23.34],[-11.55,-23.3],[-11.66,-23.2],[-11.76,-22.9],[-11.76,-22.75],[-11.64,-22.39],[-11.65,-22.24],[-11.76,-22.14],[-11.89,-22.1],[-14.97,-22.01],[-15.45,-22.44],[-15.61,-22.48],[-15.9,-22.44],[-16.3,-22.08],[-16.34,-21.99],[-17.88,-22.24],[-17.94,-22.28],[-18.06,-22.47],[-18.29,-22.62],[-18.63,-22.62],[-18.91,-22.43],[-19.02,-22.1],[-19.02,-21.92],[-18.85,-21.62],[-19.47,-20.48],[-19.92,-20.51],[-20.11,-20.46],[-20.23,-20.29],[-20.19,-20.13],[-20.11,-19.99],[-20.14,-19.81],[-20.85,-19.11],[-21.05,-19.11],[-21.27,-19.19],[-21.54,-19.09],[-21.63,-18.99],[-21.68,-18.77],[-21.58,-18.53],[-21.58,-18.36],[-23.2,-16.71],[-23.43,-16.59],[-23.69,-16.63],[-23.96,-16.49],[-24.01,-16.36],[-24.01,-16.03],[-24.05,-15.86],[-25.8,-13.28],[-28.36,-10.66],[-28.72,-10.63],[-29.23,-10.09],[-29.35,-10.07],[-29.58,-10.21],[-29.81,-10.25],[-30.02,-10.05],[-30.04,-9.94],[-29.88,-9.5],[-30.64,-8.71],[-30.92,-8.86],[-31.1,-8.83],[-31.2,-8.76],[-31.26,-8.57],[-31.16,-8.34],[-31.18,-8.15],[-31.33,-8.03],[-31.51,-7.81],[-31.99,-7.84],[-32.09,-7.68],[-32.09,-7.52],[-32.06,-7.37],[-32.08,-7.25],[-32.18,-7.18],[-32.46,-7.1],[-32.6,-6.96],[-29.5,-4.1]]
const PATIO_A: XY[] = [[-17.38,-7.81],[-13.43,-8.46],[-11.9,-8.71],[-10.28,-9.47],[-9.37,-9.64],[-6.63,-7.72],[-6.54,-7.02],[-6.73,-6.33],[-6.89,-5.52],[-7.09,-4.94],[-7.6,-3.83],[-8.05,-3.22],[-8.64,-2.66],[-9.74,-2.08],[-10.31,-1.7],[-10.79,-1.48],[-11.45,-1.44],[-13.12,-1.75],[-13.93,-2.02],[-14.64,-2.33],[-15.5,-2.91],[-16.16,-3.52],[-16.94,-4.97],[-17.24,-5.83],[-17.42,-6.47],[-17.48,-6.99],[-17.49,-7.44]]
const PATIO_B: XY[] = [[10.41,0.21],[10.39,2.0],[11.68,3.02],[12.62,3.88],[13.55,4.95],[14.25,6.09],[16.1,6.09],[16.64,6.82],[16.78,7.6],[17.15,8.65],[17.27,9.62],[17.23,10.29],[17.11,10.87],[15.71,12.46],[14.62,13.33],[14.02,13.67],[13.55,13.63],[12.5,13.4],[11.65,13.25],[10.93,13.04],[9.88,12.35],[9.35,11.71],[6.35,8.81],[5.79,8.04],[5.2,7.39],[4.2,6.58],[3.49,5.65],[2.93,4.57],[2.58,3.55],[2.31,2.19],[2.41,1.49],[2.68,0.72],[3.13,-0.11],[3.61,-0.42],[4.6,-0.82],[6.49,-1.39],[6.98,-1.42],[7.52,-1.39],[8.73,-0.96],[9.39,-0.59]]

// --- small plan helpers ----------------------------------------------------
const len2 = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])
function resample(path: XY[], step: number): XY[] {
  const L = [0]; for (let i = 1; i < path.length; i++) L.push(L[i - 1] + len2(path[i - 1], path[i]))
  const tot = L[L.length - 1], n = Math.max(2, Math.round(tot / step)), out: XY[] = []
  for (let k = 0; k <= n; k++) {
    const s = tot * k / n; let i = 1; while (i < L.length - 1 && L[i] < s) i++
    const t = (s - L[i - 1]) / ((L[i] - L[i - 1]) || 1)
    out.push([path[i - 1][0] + (path[i][0] - path[i - 1][0]) * t, path[i - 1][1] + (path[i][1] - path[i - 1][1]) * t])
  }
  return out
}
function smooth(path: XY[], halfWin: number, fine = 0.25): XY[] {
  const p = resample(path, fine), k = Math.round(halfWin / fine)
  return p.map((q, i) => {
    if (i === 0 || i === p.length - 1) return q
    const a = Math.max(0, i - k), b = Math.min(p.length - 1, i + k)
    let sx = 0, sy = 0; for (let j = a; j <= b; j++) { sx += p[j][0]; sy += p[j][1] }
    return [sx / (b - a + 1), sy / (b - a + 1)] as XY
  })
}
/** Outward normals (to the right of the direction of travel) and arc lengths. */
function frame(path: XY[]) {
  const S = [0]; for (let i = 1; i < path.length; i++) S.push(S[i - 1] + len2(path[i - 1], path[i]))
  const N = path.map((_, i) => {
    const a = path[Math.max(0, i - 1)], b = path[Math.min(path.length - 1, i + 1)]
    const l = len2(a, b) || 1; return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l] as XY
  })
  return { S, N }
}

/** Ear clipping of a ring with holes, by bridging each hole to the outer ring. */
function capHoles(p: Part, outer: XY[], holes: XY[][], z: number) {
  let ring = ringArea(outer) < 0 ? [...outer].reverse() : [...outer]
  const hs = holes.map(h => (ringArea(h) > 0 ? [...h].reverse() : [...h])).sort((a, b) => Math.max(...b.map(q => q[0])) - Math.max(...a.map(q => q[0])))
  for (const h of hs) {
    const j = h.reduce((m, q, i) => (q[0] > h[m][0] ? i : m), 0), hp = h[j]
    let best = -1, bd = Infinity
    ring.forEach((q, i) => { if (q[0] >= hp[0] - 1e-6) { const d = len2(q, hp); if (d < bd) { bd = d; best = i } } })
    if (best < 0) ring.forEach((q, i) => { const d = len2(q, hp); if (d < bd) { bd = d; best = i } })
    const hr = [...h.slice(j), ...h.slice(0, j), h[j]]
    ring = [...ring.slice(0, best + 1), ...hr, ring[best], ...ring.slice(best + 1)]
  }
  for (const [a, b, c] of triangulate(ring)) p.tri([ring[a][0], ring[a][1], z], [ring[b][0], ring[b][1], z], [ring[c][0], ring[c][1], z])
}

function build() {
  const stone = new Part(), white = new Part(), sand = new Part(), win = new Part(), iron = new Part(), roof = new Part()
  // OSM's ring runs clockwise; turn it round.
  const R = [...OUTER_OSM].reverse() // CCW
  const idx = (q: XY) => R.findIndex(p => Math.abs(p[0] - q[0]) < 1e-6 && Math.abs(p[1] - q[1]) < 1e-6)
  const cNW: XY = [-32.6, -6.96], cNE: XY = [31.95, 8.19], cRW: XY = [-9.68, 14.25], cRE: XY = [11.52, 28.57]
  const iNW = idx(cNW), iNE = idx(cNE), iRE = idx(cRE), iRW = idx(cRW)
  const between = (i0: number, i1: number) => { const out: XY[] = []; for (let i = i0; i !== i1; i = (i + 1) % R.length) out.push(R[i]); out.push(R[i1]); return out }
  const streetRaw = between(iNW, iNE), partyNE = between(iNE, iRE), rearRaw = between(iRE, iRW), partyNW = between(iRW, iNW)
  const street = resample(smooth(streetRaw, 1.5), 2.3)
  const rear = resample(smooth(rearRaw, 1.2), 3.0)

  // --- Facade ------------------------------------------------------------
  const LEDGES = [6.0, 10.0, 13.9, 17.8, 21.7]
  const TOP = 25.5, TERRACE = 28.3
  const wave = (s: number, k: number, a: number) => a * Math.sin(2 * Math.PI * s / 10.5 + k * 1.7)
  function facade(path: XY[], o: { ledge: number; ironEvery: number; piers: boolean; dormers: boolean; seed: number }) {
    const { S, N } = frame(path)
    const at = (i: number, z: number, off: number): V3 => [path[i][0] + N[i][0] * off, path[i][1] + N[i][1] * off, z]
    const topZ = (s: number) => TOP + 0.9 * Math.sin(2 * Math.PI * s / 13 + o.seed) + 0.3 * Math.sin(2 * Math.PI * s / 5.3)
    const attZ = (s: number) => 29.6 + 1.3 * Math.sin(2 * Math.PI * s / 13 + o.seed + 0.6)
    // section rows (z, offset) at each station
    const rows: ((i: number) => [number, number])[] = []
    const base = o.piers ? 4.6 : 0
    rows.push(() => [0, o.piers ? -0.9 : 0])
    rows.push(() => [base, o.piers ? -0.9 : 0])
    LEDGES.forEach((z, k) => {
      rows.push(i => [z + wave(S[i], k, 0.35) - 0.55, o.ledge * 0.55])
      rows.push(i => [z + wave(S[i], k, 0.35), o.ledge])
      rows.push(i => [z + wave(S[i], k, 0.35) + 0.75, 0])
    })
    rows.push(i => [topZ(S[i]) - 0.6, 0.05])
    rows.push(i => [topZ(S[i]), o.ledge * 0.9])
    // the attic hood: up and back to its crest, then down inside to the terrace
    rows.push(i => [topZ(S[i]) + 0.35, -0.2])
    rows.push(i => [(topZ(S[i]) + attZ(S[i])) / 2 + 0.3, -0.75])
    rows.push(i => [attZ(S[i]) - 0.35, -1.6])
    rows.push(i => [attZ(S[i]), -2.3])
    rows.push(i => [TERRACE + 0.2, -3.0])
    const P: V3[][] = rows.map(f => path.map((_, i) => { const [z, off] = f(i); return at(i, z, off) }))
    const nStone = rows.length - 4 // rows up to the stone top
    grid(stone, P.slice(0, nStone))
    grid(white, P.slice(nStone - 1))
    // ground floor: the recess's soffit under the first ledge, and the piers
    if (o.piers) {
      for (let i = 1; i < path.length - 1; i += 2) {
        lathe(stone, ...(at(i, 0, -0.35).slice(0, 2) as [number, number]), [[0.9, 0], [0.72, 2.2], [0.95, 4.2], [1.2, 5.0]], 6, { a0: Math.PI / 6 })
      }
      for (let i = 0; i < path.length - 1; i++) {
        const a = at(i, 0.3, -0.85), b = at(i + 1, 0.3, -0.85)
        win.quad(a, b, [b[0], b[1], 4.3], [a[0], a[1], 4.3])
      }
    }
    // window rows between the ledges: a panel every other station
    const bands = [...LEDGES, TOP]
    for (let k = 0; k < bands.length - 1; k++) {
      for (let i = 0; i < path.length - 1; i++) {
        if ((i + k + o.seed) % 3 === 0) continue
        const za = (j: number) => bands[k] + wave(S[j], k, 0.35) + 0.85, zb = (j: number) => (k + 1 < LEDGES.length ? bands[k + 1] + wave(S[j], k + 1, 0.35) : topZ(S[j])) - 0.7
        // the wall leans out under the next ledge: follow it
        const lean = k + 1 < LEDGES.length ? o.ledge * 0.55 * 0.94 : 0.05
        const a0 = at(i, za(i), 0.07), b0 = at(i + 1, za(i + 1), 0.07), b1 = at(i + 1, zb(i + 1), 0.07 + lean), a1 = at(i, zb(i), 0.07 + lean)
        // pull in the panel's ends a little so the stone shows between
        const lerp3 = (p: V3, q: V3, t: number): V3 => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t]
        win.quad(lerp3(a0, b0, 0.1), lerp3(a0, b0, 0.9), lerp3(a1, b1, 0.9), lerp3(a1, b1, 0.1))
      }
    }
    // the iron balconies: dark strips standing on some ledges
    if (o.ironEvery > 0) LEDGES.forEach((z, k) => {
      for (let i = 1 + ((k * 2 + o.seed) % o.ironEvery); i < path.length - 2; i += o.ironEvery) {
        const pts = [i, i + 1, i + 2].map(j => ({ p: at(j, z + wave(S[j], k, 0.35), o.ledge - 0.08), n: N[j] }))
        for (let q = 0; q < 2; q++) {
          const A = pts[q].p, B = pts[q + 1].p, h = 1.0
          const up = (v: V3): V3 => [v[0], v[1], v[2] + h]
          const inn = (v: V3, n: XY): V3 => [v[0] - n[0] * 0.25, v[1] - n[1] * 0.25, v[2]]
          iron.quad(A, B, up(B), up(A))
          iron.quad(inn(B, pts[q + 1].n), inn(A, pts[q].n), up(inn(A, pts[q].n)), up(inn(B, pts[q + 1].n)))
          iron.quad(up(A), up(B), up(inn(B, pts[q + 1].n)), up(inn(A, pts[q].n)))
        }
      }
    })
    // the attic's small windows
    if (o.dormers) for (let i = 1; i < path.length - 1; i += 2) {
      const z0 = topZ(S[i]) + 0.75, z1 = z0 + 0.8, h = 0.5
      const a = at(i, z0, 0), dx = (path[i + 1][0] - path[i - 1][0]) / len2(path[i - 1], path[i + 1]) * h, dy = (path[i + 1][1] - path[i - 1][1]) / len2(path[i - 1], path[i + 1]) * h
      const n = N[i]
      const p = (u: number, z: number, o2: number): V3 => [a[0] + dx * u + n[0] * o2, a[1] + dy * u + n[1] * o2, z]
      // the hood's offset at z: from (top + 0.35, -0.2) to (mid + 0.3, -0.75)
      const zt = topZ(S[i]), zm = (zt + 29.6 + 1.3 * Math.sin(2 * Math.PI * S[i] / 13 + o.seed + 0.6)) / 2 + 0.3
      const off = (z: number) => -0.2 - 0.55 * Math.max(0, Math.min(1, (z - zt - 0.35) / (zm - zt - 0.35))) + 0.08
      win.quad(p(-1, z0, off(z0)), p(1, z0, off(z0)), p(1, z1, off(z1)), p(-1, z1, off(z1)))
    }
    return { P, S, N, at }
  }
  const F = facade(street, { ledge: 0.75, ironEvery: 4, piers: true, dormers: true, seed: 0 })
  const B = facade(rear, { ledge: 0.35, ironEvery: 0, piers: false, dormers: true, seed: 1 })

  // --- Party walls, plain, up to the attic -------------------------------
  const pw = (path: XY[]) => { for (let i = 0; i < path.length - 1; i++) stone.quad([path[i][0], path[i][1], 0], [path[i + 1][0], path[i + 1][1], 0], [path[i + 1][0], path[i + 1][1], TERRACE], [path[i][0], path[i][1], TERRACE]) }
  pw(partyNE); pw(partyNW)
  // close the hoods' ends against the party walls
  for (const [P, end] of [[F.P, 0], [F.P, -1], [B.P, 0], [B.P, -1]] as [V3[][], number][]) {
    const col = P.map(r => r[end < 0 ? r.length - 1 : 0])
    const k0 = col.length - 6
    for (let k = k0; k < col.length - 1; k++) {
      const a = col[k], b = col[k + 1]
      // a vertical fan down to the terrace level
      const ta: V3 = [a[0], a[1], Math.min(a[2], TERRACE)], tb: V3 = [b[0], b[1], Math.min(b[2], TERRACE)]
      if (end < 0) white.quad(ta, tb, b, a); else white.quad(tb, ta, a, b)
    }
  }

  // --- The roof terrace, with the two courtyards open --------------------
  const inset = (P: V3[][]) => P[P.length - 1].map(q => [q[0], q[1]] as XY)
  const terrace: XY[] = [...inset(F.P), ...partyNE.slice(1, -1), ...inset(B.P), ...partyNW.slice(1, -1)]
  capHoles(roof, terrace, [PATIO_A, PATIO_B], TERRACE + 0.2)
  for (const h of [PATIO_A, PATIO_B]) {
    const cw = ringArea(h) > 0 ? [...h].reverse() : h
    walls(stone, cw, 0, TERRACE + 0.2)
    // a low rounded parapet round the courtyard
    walls(white, cw.map(q => q), TERRACE + 0.2, TERRACE + 1.1)
  }

  // --- Stair towers and chimneys on the roof ------------------------------
  const T = TERRACE + 0.2
  // the tall stair tower near the corner, with its four-armed finial
  const tower = (x: number, y: number, h: number, r: number, p: Part) => {
    lathe(p, x, y, [[r, T - 0.2], [r * 1.05, T + h * 0.25], [r * 0.95, T + h * 0.5], [r * 0.7, T + h * 0.75], [r * 0.45, T + h * 0.88], [r * 0.25, T + h * 0.95], [0, T + h]], 10)
  }
  tower(6.7, -7.4, 6.6, 1.9, white)
  lathe(white, 6.7, -7.4, [[0.15, T + 6.4], [0.55, T + 6.9], [0.6, T + 7.4], [0.35, T + 7.8], [0, T + 8.2]], 6)
  tower(23.0, 8.5, 5.0, 1.8, white)
  tower(-6.0, -15.5, 4.6, 1.7, sand)
  // helmeted warrior chimneys: a flaring trunk, a bulbous helmet with a crest
  const warrior = (x: number, y: number, h: number, r: number, turn: number) => {
    lathe(sand, x, y, [[r * 0.9, T - 0.2], [r * 0.72, T + h * 0.4], [r * 1.1, T + h * 0.7], [r * 0.8, T + h * 0.88], [0, T + h]], 7, { sx: 1, sy: 0.8, a0: turn })
  }
  for (const [x, y, h, r] of [[-16.2, -9.2, 4.0, 1.4], [-24.4, -1.0, 3.2, 1.1], [-17.0, 6.2, 3.0, 1.0], [-3.2, 0.0, 3.4, 1.2], [-8.5, -9.6, 3.0, 1.0], [-0.6, -11.4, 3.2, 1.1], [18.0, 20.8, 3.0, 1.0], [23.5, 15.8, 3.2, 1.1], [14.0, -1.5, 2.8, 0.9], [-12.0, 8.5, 2.6, 0.9], [2.5, 14.0, 2.8, 1.0]] as [number, number, number, number][])
    warrior(x, y, h, r, x * 0.3)

  // At night the stone and the attic are floodlit from the street; the
  // windows glow (Diliff's dusk photo).
  // The map stands the model on the lowest ground of its plan's extent: a
  // dip in the block's interior behind the back facade, about 3 m below the
  // streets (Mapterhorn; terrain.ts grid and check). So the whole design
  // stands on a plain plinth DZ tall, which the streets' ground covers.
  const DZ = 3.0
  for (const part of [stone, white, sand, win, iron, roof]) for (let i = 1; i < part.pos.length; i += 3) part.pos[i] += DZ
  const baseRing: XY[] = [...street, ...partyNE.slice(1, -1), ...rear, ...partyNW.slice(1, -1)]
  walls(stone, ringArea(baseRing) < 0 ? [...baseRing].reverse() : baseRing, 0, DZ)
  for (const h of [PATIO_A, PATIO_B]) walls(stone, ringArea(h) > 0 ? [...h].reverse() : h, 0, DZ)
  const lit = (p: V3, n: V3) => (n[1] < 0.2 && p[1] < 12 ? 0.5 + 0.5 * Math.min(1, p[2] / 30) : 0.15) * (n[2] > 0.8 ? 0.5 : 1)
  return [
    { part: stone, material: { ...finish('mila-limestone', 0xe6dccb), floodlight: lit } },
    { part: white, material: { ...PALETTE.trim, floodlight: lit } },
    { part: sand, material: finish('mila-render', 0xe0cfb5) },
    { part: win, material: PALETTE.window },
    { part: iron, material: finish('mila-iron', 0x5a5856) },
    { part: roof, material: finish('mila-terrace', 0xd8cdbd) },
  ] as { part: Part; material: Swatch }[]
}

if (import.meta.main) await save('barcelona-casa-mila', 'Casa Milà', [41.395377, 2.161881], 0, build(), 6500)
