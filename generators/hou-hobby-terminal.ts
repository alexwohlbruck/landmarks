/**
 * William P. Hobby Airport (HOU), Houston: the passenger terminal, one OSM
 * outline from the landside headhouse to the south concourse. Procedural,
 * CC0-1.0.
 *
 *   bun generators/hou-hobby-terminal.ts
 *
 * What reads from above, west to east and north to south:
 * - the international concourse (2015), a long block running west-south-
 *   west, flat roof with a taller spine along its north side;
 * - the headhouse's west arm, a 51 m wide band set diagonally, whose roof
 *   rises in one long mono-pitch towards the curb, flanked by low flat
 *   strips;
 * - the central hall, a fan-shaped roof over a curved airside wall: a
 *   high flat crown, ringed by a pale band of skylight, sloping down to
 *   the curved edge;
 * - the east arm and its low block, to the north-east;
 * - a narrow stem south to the concourse;
 * - the south concourse, a shallow V 430 m tip to tip, its roof a single
 *   pitch from the inner (north) edge down to a lower lean-to along the
 *   gate side, crossed by white linear skylights, with a glazed hipped
 *   skylight over the hall at the apex.
 * Walls are white with green-tinted window bands and a dark grey fascia
 * on the airside; the landside curb faces are tan stone over glazing.
 *
 * Frame: x east, y north, z up, metres, bearing 0. Origin at the centroid
 * of OSM way/137050139 (aeroway=terminal), the only building it replaces.
 * way/1557778517 (a building added to OSM in September 2026 west of the
 * international concourse, not in the 2018 lidar or the NAIP) is not
 * modelled or replaced. Aprons, jet bridges and the roadways are not drawn.
 *
 * Sources:
 * - OSM way/137050139: outline (measured). The zones inside it are cut
 *   with straight lines between its own vertices, placed on the roof
 *   breaks seen in lidar and NAIP.
 * - USGS 3DEP lidar TX_Coastal_B1_2018 (flight 2018), 1 m grid, heights
 *   above the apron (measured): international concourse 12.6 m, spine
 *   16.0 m (14 m wide); west arm outer strip 10.0 m (16 m wide), pitch
 *   13.8 to 18.6 m (22 m wide), curb strip 11.0 m; central hall crown
 *   21.6 m out to 36 m from the centre of its curved edge, falling to
 *   14.5 m at the edge (radius 65 m); front strip 13.5 m; east arm 10.4 m,
 *   its north-east head 13.9 m, the block 7.8 m; stem 10.0 m; concourse
 *   14.0 m at the inner edge to 12.4 m, lean-to 9.8 m (about 5 m wide);
 *   apex hall 16.0 m, its skylight 17.7 m.
 * - USGS NAIP (tools/usgs.py naip, 0.38-1 m): plan, roof colours (light
 *   grey; the west arm's pitch darker), the pale skylight arc on the
 *   central hall, the apex skylight (about 13.5 m square), the concourse
 *   roof's cross bands. The south-west half of the east arm reads low
 *   (4.7 m) in the 2018 lidar but roofed in NAIP; drawn at the arm's
 *   height.
 * - Photo ae2 "HoustonHobbyAirportAerial02.JPG", LoneStarMike, CC BY 3.0,
 *   2010, aerial from the south-west: the concourse's pitched grey roof
 *   with white cross skylights, green-glazed clerestory, the lower glazed
 *   lean-to, white walls and green window bands of the headhouse.
 *   https://commons.wikimedia.org/wiki/File:HoustonHobbyAirportAerial02.JPG
 * - Photo f1 "Houston Hobby Airport - Southwest N429WN - January 2016",
 *   formulanone, CC BY-SA 2.0: the concourse from the airfield: dark grey
 *   fascia, green glass band, white lower level, the pale hipped skylight.
 *   https://commons.wikimedia.org/wiki/File:Houston_Hobby_Airport_-_Southwest_N429WN_-_January_2016_(43373620285).jpg
 * - Photos k1, k2, k3 "William P. Hobby Airport, Houston, Texas
 *   (16074237460, 16075471949, 16261603485)", Ken Lund, CC BY-SA 2.0, 2015:
 *   the concourses from the taxiway, same treatment.
 *   https://commons.wikimedia.org/wiki/File:William_P._Hobby_Airport,_Houston,_Texas_(16074237460).jpg
 * - Photos t1-t4 "HobbyAirportTerminal.JPG", "HobbyAirportterminal.JPG",
 *   "HobbyAirportnewent.JPG", "HobbyAirportHoustonTX.JPG", WhisperToMe,
 *   public domain / CC0: the landside front, tan stone panels over the
 *   glazed entrances under the curb canopy.
 *   https://commons.wikimedia.org/wiki/File:HobbyAirportterminal.JPG
 * - Photo s1 "SWAirlinesramp.jpg", AuburnPilot, public domain, 2007: gate
 *   side of the concourse.
 *   https://commons.wikimedia.org/wiki/File:SWAirlinesramp.jpg
 *
 * Estimated: window band heights (from f1, k1, ae2 against a 3.5 m jet
 * bridge); skylight stripe spacing (12 m) and width (2.2 m) from ae2 and
 * NAIP; fascia depth 1.5 m.
 *
 * Doubts: the international concourse's facades are seen only far off
 * (k1-k3); the east arm is uncertain (see above); the central hall's roof
 * is a smooth cone fitted to lidar, not its real framing; the curb canopy
 * over the roadway is left to the map.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { clip, clean, triangulate, area, walls, cap, edgeTo, panels, type XY } from './clt-terminal'

// OSM way/137050139 in the model frame (metres from the centroid), CCW.
const R: XY[] = [[84.4, 65.7], [74.4, 65.5], [48.6, 64.9], [29.8, 64.5], [28.2, 64.5], [23.1, 64.3], [6.3, 80.6], [-0.5, 87.1], [-22.3, 108.0], [-41.3, 126.5], [-55.3, 140.0], [-59.1, 133.3], [-64.2, 141.1], [-69.1, 151.7], [-72.9, 159.9], [-95.7, 150.7], [-91.7, 144.5], [-93.1, 143.8], [-105.8, 157.9], [-141.5, 144.4], [-138.9, 137.0], [-282.1, 80.5], [-267.0, 44.1], [-266.3, 42.3], [-259.5, 44.9], [-252.4, 47.7], [-215.1, 62.2], [-174.9, 77.9], [-132.6, 94.4], [-95.2, 109.0], [-9.6, 23.3], [21.1, -3.0], [33.5, -9.7], [42.3, -13.8], [42.3, -69.0], [0.8, -86.0], [-19.1, -94.1], [-54.2, -108.5], [-96.9, -126.1], [-132.9, -140.8], [-154.6, -149.6], [-176.2, -158.4], [-152.8, -171.6], [-139.7, -179.0], [-127.0, -174.2], [-90.6, -159.9], [-70.0, -151.8], [-47.1, -143.6], [-20.9, -134.2], [-10.2, -130.4], [8.9, -125.4], [14.4, -124.8], [38.8, -122.1], [64.6, -122.1], [90.5, -126.0], [97.8, -127.1], [128.1, -136.6], [129.3, -137.0], [168.5, -148.2], [185.7, -153.1], [223.7, -164.5], [231.1, -159.3], [254.2, -143.3], [256.5, -141.7], [235.8, -134.0], [220.2, -128.2], [197.5, -119.8], [169.9, -109.5], [133.9, -96.1], [92.6, -80.8], [60.4, -68.8], [57.7, -13.3], [77.6, -3.2], [95.8, 11.4], [108.8, 26.9], [96.8, 40.8], [119.4, 66.7], [129.3, 57.7], [159.2, 89.7], [172.9, 76.7], [167.4, 60.3], [209.6, 45.8], [220.2, 77.4], [177.2, 92.2], [174.1, 84.1], [156.9, 100.7], [172.6, 117.9], [168.4, 121.9], [164.3, 125.8], [163.0, 124.6], [161.8, 123.4], [159.9, 121.5], [148.1, 132.1], [139.0, 122.6], [129.1, 112.4], [90.6, 72.2]]

const white = new Part(), tan = new Part(), roof = new Part(), dark = new Part(), win = new Part(), sky = new Part()

// ------------------------------------------------------------ plan helpers
type H = (x: number, y: number) => number
const flat = (h: number): H => () => h
/** Keep the part of a ring left of the line p→q, shifted `off` metres further left. */
function left(r: XY[], p: XY, q: XY, off = 0): XY[] {
  const L = Math.hypot(q[0] - p[0], q[1] - p[1]), nl: XY = [-(q[1] - p[1]) / L, (q[0] - p[0]) / L]
  const P: XY = [p[0] + nl[0] * off, p[1] + nl[1] * off], Q: XY = [q[0] + nl[0] * off, q[1] + nl[1] * off]
  const a = Q[1] - P[1], b = -(Q[0] - P[0])
  return clip(r, a, b, a * P[0] + b * P[1])
}
const right = (r: XY[], p: XY, q: XY, off = 0) => left(r, q, p, -off)
const sub = (i: number, j: number): XY[] => (i <= j ? R.slice(i, j + 1) : [...R.slice(i), ...R.slice(0, j + 1)])
function inside(q: XY, r: XY[]) {
  let c = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j]
    if ((yi > q[1]) !== (yj > q[1]) && q[0] < ((xj - xi) * (q[1] - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
function segDist(q: XY, a: XY, b: XY) {
  const dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / (dx * dx + dy * dy)))
  return Math.hypot(q[0] - a[0] - t * dx, q[1] - a[1] - t * dy)
}
const lineDist = (q: XY, pts: XY[]) => Math.min(...pts.slice(1).map((b, i) => segDist(q, pts[i], b)))

/** A roof over a ring, cut on a square grid so it follows a height function. */
function roofGrid(p: Part, ring: XY[], h: H, cell: number, lift = 0) {
  const xs = ring.map((q) => q[0]), ys = ring.map((q) => q[1])
  for (let x = Math.floor(Math.min(...xs) / cell) * cell; x < Math.max(...xs); x += cell)
    for (let y = Math.floor(Math.min(...ys) / cell) * cell; y < Math.max(...ys); y += cell) {
      let piece = clip(clip(clip(clip(ring, 1, 0, x + cell), -1, 0, -x), 0, 1, y + cell), 0, -1, -y)
      if (piece.length < 3) continue
      piece = clean(piece, 0.05)
      if (piece.length < 3 || Math.abs(area(piece)) < 0.05) continue
      for (const [a, b, c] of triangulate(piece)) {
        const V = (q: XY): V3 => [q[0], q[1], h(q[0], q[1]) + lift]
        p.tri(V(piece[a]), V(piece[b]), V(piece[c]))
      }
    }
}

type Face = (a: XY, b: XY) => 'land' | 'air'
/**
 * A zone: walls up to its roof (white below a dark fascia on the airside,
 * tan stone on the landside), the roof itself, and window bands.
 */
function zone(ring0: XY[], h: H, o: { cell?: number; roofPart?: Part; fascia?: number; face?: Face; bands?: [number, number][]; landBand?: [number, number]; bay?: number }) {
  const ring = clean(ring0, 0.2)
  if (ring.length < 3) return ring
  const fascia = o.fascia ?? 1.5, face = o.face ?? (() => 'air')
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const step = o.cell ? 8 : 1e9
    if (face(a, b) === 'land') edgeTo(tan, a, b, 0, h, step)
    else {
      edgeTo(white, a, b, 0, (x, y) => h(x, y) - fascia, step)
      edgeTo(dark, a, b, (x, y) => h(x, y) - fascia, h, step)
    }
  }
  const rp = o.roofPart ?? roof
  if (o.cell) roofGrid(rp, ring, h, o.cell)
  else cap(rp, ring, h(0, 0))
  const minTop = Math.min(...ring.map(([x, y]) => h(x, y)))
  for (const [z0, z1] of o.bands ?? []) if (z1 < minTop - fascia) panels(win, ring, z0, z1, { bay: o.bay ?? 14, gap: 1.6, end: 2, minLen: 9, keep: (a, b) => face(a, b) === 'air' })
  if (o.landBand) panels(win, ring, o.landBand[0], o.landBand[1], { bay: 12, gap: 1.2, end: 2, minLen: 9, keep: (a, b) => face(a, b) === 'land' })
  return ring
}

// ------------------------------------------------------------ the zones
const NORTH = sub(71, 33), SOUTH = sub(34, 70), STEM: XY[] = [R[33], R[34], R[70], R[71]]

// International concourse (west of the line r29-r18) and its north spine.
const INTL = left(NORTH, R[29], R[18])
const spineLine: [XY, XY] = [R[20], R[21]]
const INTL_LOW = left(INTL, spineLine[0], spineLine[1], 14)
const SPINE = right(INTL, spineLine[0], spineLine[1], 14)
zone(INTL_LOW, flat(12.6), { bands: [[5.0, 10.0]] })
zone(SPINE, flat(16.0), { bands: [[5.0, 10.0], [11.6, 14.0]] })

// East of r75-r95: the east arm, its block and its head.
const REST = right(NORTH, R[29], R[18])
const EAST = right(REST, R[75], R[95])
const MID = left(REST, R[75], R[95])
const BLOCK = left(EAST, R[83], R[79])
const EARM0 = right(EAST, R[83], R[79])
const HEAD = left(EARM0, R[93], R[85])
const EARM = right(EARM0, R[93], R[85])
zone(EARM, flat(10.4), { bands: [[3.5, 8.0]] })
zone(HEAD, flat(13.9), { bands: [[3.5, 8.0]] })
zone(BLOCK, flat(7.8), { fascia: 1.0, bands: [[2.5, 5.6]] })

// The west arm and the central hall, split along r30-r5.
const ARM = left(MID, R[30], R[5])
const CENTRE = right(MID, R[30], R[5])
// faces on the curb side (outward normal pointing north-east to north) are landside
const landside: Face = (a, b) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
  return n[1] > 0.55 && n[0] > -0.2 ? 'land' : 'air'
}
{
  const p = R[29], q = R[30]
  const L = Math.hypot(q[0] - p[0], q[1] - p[1]), nl: XY = [-(q[1] - p[1]) / L, (q[0] - p[0]) / L]
  const s = (x: number, y: number) => (x - p[0]) * nl[0] + (y - p[1]) * nl[1]
  zone(right(ARM, p, q, 16), flat(10.0), { bands: [[3.0, 7.8]], face: landside })
  zone(left(right(ARM, p, q, 38), p, q, 16), (x, y) => 13.8 + ((s(x, y) - 16) / 22) * 4.8, { cell: 1000, roofPart: dark, fascia: 1.2, face: landside })
  zone(left(ARM, p, q, 38), flat(11.0), { face: landside, landBand: [0.6, 5.2] })
}

// The central hall: a cone about the centre of its curved airside wall.
const C0: XY = [48, 53]
const rho = (x: number, y: number) => Math.hypot(x - C0[0], y - C0[1])
const hall = (x: number, y: number) => { const r = rho(x, y); return r < 36 ? 21.6 : 21.6 - ((r - 36) / 29) * 7.1 }
const FRONT_Y = 41
const DOME = clip(CENTRE, 0, 1, FRONT_Y)
const FRONT = clip(CENTRE, 0, -1, -FRONT_Y)
const dome = zone(DOME, hall, { cell: 6, face: landside, bands: [[3.0, 9.5]] })
zone(FRONT, flat(13.5), { face: landside, landBand: [0.6, 5.2] })
// the pale skylight ring at the crown's edge (NAIP), on the slope 36-43 m out
for (let a = -180; a < 0; a += 6) {
  const t0 = (a * Math.PI) / 180, t1 = ((a + 6) * Math.PI) / 180
  const P = (r: number, t: number): V3 => { const x = C0[0] + r * Math.cos(t), y = C0[1] + r * Math.sin(t); return [x, y, hall(x, y) + 0.15] }
  const corners = [P(36, t0), P(43, t0), P(43, t1), P(36, t1)]
  if (corners.every((v) => inside([v[0], v[1]], dome) && v[1] < FRONT_Y - 0.5)) sky.quad(corners[1], corners[2], corners[3], corners[0])
}

// The stem to the concourse.
zone(STEM, flat(10.0), { bands: [[4.0, 8.0]] })

// ------------------------------------------------------------ the south concourse
const IN_W = sub(34, 40), IN_E = sub(64, 70)
const dIn = (x: number, y: number) => Math.min(lineDist([x, y], IN_W), lineDist([x, y], IN_E))
const conc = (x: number, y: number) => 14.0 - 1.6 * Math.min(1, dIn(x, y) / 36)
// main body: the outer (gate-side) vertices pulled in 5 m, leaving the lean-to
const MAIN: XY[] = SOUTH.map((q, i) => {
  const k = i + 34
  if (k < 42 || k > 62) return q
  const a = R[k - 1], b = R[k + 1]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  return [q[0] - ((b[1] - a[1]) / L) * 5, q[1] + ((b[0] - a[0]) / L) * 5] as XY
})
const isOuter = (a: XY, b: XY) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
  return n[1] < -0.2
}
zone(SOUTH, flat(9.8), { fascia: 1.0, bands: [[3.5, 8.4]], face: (a, b) => (isOuter(a, b) ? 'air' : 'land'), bay: 16 })
zone(MAIN, conc, { cell: 12, fascia: 1.6, bands: [[6.0, 11.8]], bay: 16 })
// the hall at the apex, and its glazed hipped skylight
const APEX = clip(clip(clip(SOUTH, 1, 0, 76), -1, 0, -24), 0, -1, 117)
zone(APEX, flat(16.0), { bands: [[7.0, 12.0]] })
{
  const cx = 49, cy = -89, w = 7, d = 6.5, z0 = 16.0, z1 = 17.7, r = 2
  const lo: XY[] = [[cx - w, cy - d], [cx + w, cy - d], [cx + w, cy + d], [cx - w, cy + d]]
  const hi: XY[] = [[cx - w + r, cy - d + r], [cx + w - r, cy - d + r], [cx + w - r, cy + d - r], [cx - w + r, cy + d - r]]
  walls(sky, lo, z0, z1, hi)
  cap(sky, hi, z1)
}
// white cross skylights on the main roof, every 12 m along each arm (ae2)
for (const line of [IN_W, IN_E.slice().reverse()]) {
  const a = line[0], b = line.at(-1)!
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  // the side of the line the concourse lies on
  const n0: XY = [u[1], -u[0]], probe: XY = [a[0] + u[0] * L / 2 + n0[0] * 10, a[1] + u[1] * L / 2 + n0[1] * 10]
  const n: XY = inside(probe, MAIN) ? n0 : [-n0[0], -n0[1]]
  for (let s = 36; s < L + 20; s += 12) {
    const Q = (t: number, d: number): V3 => { const x = a[0] + u[0] * t + n[0] * d, y = a[1] + u[1] * t + n[1] * d; return [x, y, conc(x, y) + 0.12] }
    let far = 31
    const ok = (d: number) => [Q(s, 3), Q(s + 2.2, 3), Q(s + 2.2, d), Q(s, d)].every((v) => inside([v[0], v[1]], MAIN))
    while (far > 14 && !ok(far)) far -= 1
    if (!ok(far)) continue
    const c = [Q(s, 3), Q(s + 2.2, 3), Q(s + 2.2, far - 3), Q(s, far - 3)]
    if (c.some((v) => v[0] > 22 && v[0] < 78 && v[1] > -119)) continue
    const up = (c[1][0] - c[0][0]) * (c[3][1] - c[0][1]) - (c[1][1] - c[0][1]) * (c[3][0] - c[0][0]) > 0
    if (up) sky.quad(c[0], c[1], c[2], c[3])
    else sky.quad(c[0], c[3], c[2], c[1])
  }
}

// ------------------------------------------------------------ output
const parts = [
  { part: white, material: finish('panel-white', 0xe9e9e3) },
  { part: tan, material: finish('stone-tan', 0xdcc6a2) },
  { part: roof, material: finish('terminal-roof', 0xb3b9bd) },
  { part: dark, material: finish('roof-dark', 0x7f878e) },
  { part: win, material: { ...PALETTE.window, color: 0x67857f } },
  { part: sky, material: { ...PALETTE.glass, color: 0xdbe6e6 } },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('William P. Hobby Airport terminal', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, height: 21.8,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/137050139'],
})
if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/hou-hobby-terminal.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
void walls
