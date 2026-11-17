/**
 * Kimbell Art Museum, 3333 Camp Bowie Boulevard, Fort Worth, 1972, Louis I.
 * Kahn — original procedural geometry, CC0-1.0.
 * bun generators/dal-kimbell-art-museum.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM multipolygon relation/7301044
 * ("Kimbell Art Museum": outer way 141506525, inner courts 497510732,
 * 497510733, 1432318444), 32.748579, -97.365149. The vaults run 0.6° east
 * of north (OSM edges and lidar), so the bearing is 0.6.
 *
 * Identity, in order: sixteen long cycloid vaults side by side, running
 * north-south, in lead-clad silver-grey with a skylight slot along every
 * crown and low flat channels between them; the vault ends on the north and
 * south fronts as cycloid concrete arches over travertine, with the thin
 * glazed lunette under each arch and a concrete column at each foot; the two
 * open portico vaults at the west front, one in each outer wing, standing on
 * their four corner columns either side of the recessed entrance court; the
 * buff concrete lower level under the travertine where the ground drops to
 * the north, east and south.
 *
 * Plan (lidar frame; the generator adds the anchor offset):
 *  - vaults: 9.2 m module, crowns at x = -3.25 + 9.2k (k = -3..2), each
 *    7.6 m wide over its edge beams with a 1.6 m flat channel between.
 *    Measured from the USGS 3DEP lidar TX_Pecos_Dallas_B3_2018 (2018 flight,
 *    0.5 m grid): channels at x -26, -17, -7.75, 1.25, 10.5; crowns -30.75,
 *    -21.5, -12.5, -3.25, 6, 15; outer edges -35.2 and 19.3 (OSM -34.6 and
 *    18.0..18.5). Published: 16 vaults, each 100 ft long (Wikipedia).
 *  - three rows of vaults end to end: north wing y 17.3..47.75, middle
 *    -16.4..17.3, south -50.4..-16.4 (lidar crown profiles; joints from OSM
 *    and the NAIP joint lines). North and south wings are six vaults wide
 *    (x -34.65..18.95), the middle four (x -17.85..18.95, west channel
 *    included), leaving the entrance court between the porticoes (lidar,
 *    OSM, NAIP). The westernmost vault of each outer wing is the open
 *    portico (photos, Highsmith, Praefcke).
 *  - courts cut through one vault each: north court in vault k=0,
 *    y 26.6..37.4; south-west in vault k=-1, y -36.3..-30.2; south-east in
 *    vault k=1, y -33.1..-27.6 (OSM inner ways, lidar gaps in the crowns).
 *  - y = 0 is the parking lot on the north (lidar ground 0.2 m above the
 *    box minimum, Mapterhorn the lowest under the footprint).
 *    Heights, measured (lidar less 0.2): channel roofs and vault springing
 *    9.0, crowns 11.4; the entrance court and gallery floor 4.3 (court
 *    ground 4.5 between the porticoes, lawn 4.0 west of them, against 1.1
 *    east and 0.2 north).
 *  - the vault section is an exact cycloid: span 7.6 m = 2πr, rise
 *    2r = 2.42 m, against a measured rise of 2.4..2.5 m (Kahn's cycloid,
 *    published). Ten segments across, smooth-shaded.
 *  - estimated from the photos: end-arch rims 0.85 m deep and proud of the
 *    wall by 0.3 m, standing 0.15 m above the lead; columns 0.85 m square;
 *    lunette slot 0.4 m; the crown skylight strip 0.9 m wide and 0.2 m
 *    proud (it is a 2.5 ft slot, published); floor band 0.6 m; edge beams
 *    0.7 m; the lower level concrete below the gallery floor on the north,
 *    south and court sides (Praefcke 03, 05; Highsmith), travertine down to
 *    the ground on the east front (Praefcke 01) with the glazed lower-level
 *    entrance under the middle wing.
 *  - colours from daylight photos, pulled to the palette's lightness:
 *    travertine #ebe4d6 (Highsmith, Praefcke 03), the warm grey concrete
 *    #bdb8ad, lead #aab0b4 (Praefcke 01, 03; silver in sun, Highsmith),
 *    channel roofs darker #80888e (they read as dark lines in NAIP).
 *  - ground: Mapterhorn is 0.2..1.2 m inside the footprint and 3.4..3.6 m
 *    on the west lawn. The portico terraces are built to the gallery floor
 *    (4.3, lidar and photos); everything else is walls to the ground.
 *    `bun tools/terrain.ts check dal-kimbell-art-museum` prints ok (see the
 *    report).
 *
 * Night: the lunettes, court glazing and the lower-level and west entrance
 * glass are `window` and glow; the crown skylights stay dark `glass`; the
 * portico soffits carry a floodlight (Kimbell Art Museum Dusk Highsmith.jpg).
 *
 * Photos (all EVIDENCE):
 *  - Kimbell Art Museum Highsmith.jpg, Carol M. Highsmith, public domain
 *    (south portico and the south front from the south-west)
 *  - Kimbell Art Museum Fort Worth 01..05.jpg, Andreas Praefcke, public
 *    domain (east front, south portico, south front from the west, west
 *    walk, north front from the north-west)
 *  - Fort Worth Cultural District June 2016 12, 13, 14, 16 (Kimbell Art
 *    Museum).jpg, Michael Barera, CC BY-SA 4.0 (sunken south garden,
 *    portico and pool, court grove, west lawn)
 *  - Kimbell Art Museum with Moore sculpture.jpg, Kevin Muncie, CC BY-SA
 *    2.0 (west front in evening sun)
 *  - Kimbell Art Museum Dusk Highsmith.jpg, Carol M. Highsmith, public
 *    domain (night look)
 *  - Kimbell Art Museum.jpg, DBinfo, public domain (west front)
 * Aerial: USGS NAIP (public domain): vault stripes, crown lines, joints,
 * courts; it sits ~3 m east of the lidar, which was followed.
 * Published: Wikipedia "Kimbell Art Museum" (16 cycloid vaults, 100 ft
 * long, 1972, Louis Kahn).
 * No look-only sources. No commercial imagery or 3D tiles.
 *
 * Renzo Piano's 2013 pavilion stands 65 m to the west as its own OSM way
 * (way/497510777), not part of relation/7301044, so it is not modelled.
 *
 * Doubts: the vault-to-vault joints are drawn as a shared concrete rim, the
 * real ends are two rims back to back; the courts' glazing is simplified to
 * panels; the middle wing's west entrance wall is drawn from the court
 * photos through the trees; the east lower-level porch is drawn as a plain
 * 3.5 m recess with two columns (Praefcke 01 shows its front only).
 * Left out: the reflecting pools, the yaupon grove, lawns and gravel, the
 * steps, the crown reflectors inside, rooftop plant.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save } from './chi-merchandise-mart'

const ANCHOR: [number, number] = [32.748579, -97.365149]
const BEARING = 0.6

// Lidar frame → model frame (the lidar grid was centred 6.44 m east and
// 1.21 m north of the outline's centroid).
const OX = 6.44, OY = 1.21
const P = (x: number, y: number, z: number): V3 => [x + OX, y + OY, z]

// Plan and heights (lidar frame, see the header).
const MOD = 9.2, HW = 3.8
const CX = (k: number) => -3.25 + MOD * k
const SPRING = 9.0
const R = HW / Math.PI // cycloid generating radius: span 2πR = 2·HW
const FLOOR = 4.3
const YN = 47.75, YS = -50.4, J1 = 17.3, J2 = -16.4
const XW = CX(-3) - HW // -34.65, portico outer edge
const XE = CX(2) + HW // 18.95, east front
const XG = -26.25 // gallery wall behind each portico
const XM = CX(-1) - HW - 1.6 // -17.85, middle wing's west front
const RIM_OUT = 0.15, RIM_IN = 0.7, RIM_FRONT = 0.3, RIM_BACK = 0.55
const SEG = 10

/** The cycloid across a vault: offset `d` along the outward normal. */
function arc(cx: number, d = 0): { x: number; z: number; nx: number; nz: number }[] {
  return Array.from({ length: SEG + 1 }, (_, i) => {
    const t = (2 * Math.PI * i) / SEG
    let nx = -Math.sin(t), nz = 1 - Math.cos(t)
    const l = Math.hypot(nx, nz)
    if (l < 1e-9) { nx = i === 0 ? -1 : 1; nz = 0 } else { nx /= l; nz /= l }
    return { x: cx - HW + R * (t - Math.sin(t)) + nx * d, z: SPRING + R * (1 - Math.cos(t)) + nz * d, nx, nz }
  })
}

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
/** A convex polygon, wound to face `n`. */
function face(p: Part, pts: V3[], n: V3) {
  const g = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))
  const s = dot(g, n) < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < s.length - 1; i++) p.tri(s[0], s[i], s[i + 1])
}
/** A vertical wall from (ax, ay) to (bx, by) facing `n`, split every 5 m near the ground. */
function wall(p: Part, ax: number, ay: number, bx: number, by: number, z0: number, z1: number, n: [number, number], out = 0) {
  const L = Math.hypot(bx - ax, by - ay)
  const k = z0 < 4.5 ? Math.max(1, Math.ceil(L / 5)) : 1
  for (let i = 0; i < k; i++) {
    const t0 = i / k, t1 = (i + 1) / k
    const x0 = ax + (bx - ax) * t0 + n[0] * out, y0 = ay + (by - ay) * t0 + n[1] * out
    const x1 = ax + (bx - ax) * t1 + n[0] * out, y1 = ay + (by - ay) * t1 + n[1] * out
    face(p, [P(x0, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y0, z1)], [n[0], n[1], 0])
  }
}
/** A horizontal rectangle at z facing up or down, split into ≤5 m cells near the ground. */
function flat(p: Part, x0: number, y0: number, x1: number, y1: number, z: number, up = true) {
  const nx = z < 4.5 ? Math.max(1, Math.ceil((x1 - x0) / 5)) : 1, ny = z < 4.5 ? Math.max(1, Math.ceil((y1 - y0) / 5)) : 1
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
    const a = x0 + ((x1 - x0) * i) / nx, b = x0 + ((x1 - x0) * (i + 1)) / nx
    const c = y0 + ((y1 - y0) * j) / ny, d = y0 + ((y1 - y0) * (j + 1)) / ny
    face(p, [P(a, c, z), P(b, c, z), P(b, d, z), P(a, d, z)], [0, 0, up ? 1 : -1])
  }
}
/** A box; `top` takes the upper face, no bottom. */
function box(side: Part, top: Part | null, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, faces = 'nsew') {
  if (faces.includes('s')) wall(side, x0, y0, x1, y0, z0, z1, [0, -1])
  if (faces.includes('n')) wall(side, x1, y1, x0, y1, z0, z1, [0, 1])
  if (faces.includes('w')) wall(side, x0, y1, x0, y0, z0, z1, [-1, 0])
  if (faces.includes('e')) wall(side, x1, y0, x1, y1, z0, z1, [1, 0])
  if (top) flat(top, x0, y0, x1, y1, z1)
}

function build() {
  const trav = new Part(), conc = new Part(), lead = new Part(), chan = new Part(), win = new Part(), glass = new Part()

  // --- Vault shells -------------------------------------------------------
  /** The lead skin of vault k from y0 to y1, with its crown skylight. */
  function shell(k: number, y0: number, y1: number) {
    const a = arc(CX(k))
    for (let i = 0; i < SEG; i++) {
      const p = a[i], q = a[i + 1]
      const n0: V3 = [p.nx, 0, p.nz], n1: V3 = [q.nx, 0, q.nz]
      lead.tri(P(p.x, y0, p.z), P(q.x, y0, q.z), P(q.x, y1, q.z), undefined, undefined, undefined, [n0, n1, n1])
      lead.tri(P(p.x, y0, p.z), P(q.x, y1, q.z), P(p.x, y1, p.z), undefined, undefined, undefined, [n0, n1, n0])
    }
    // The skylight slot along the crown, a little proud.
    const c = CX(k), zc = SPRING + 2 * R
    box(glass, glass, c - 0.45, y0 + 0.5, zc - 0.1, c + 0.45, y1 - 0.5, zc + 0.2, 'ns')
    wall(glass, c - 0.45, y1 - 0.5, c - 0.45, y0 + 0.5, zc - 0.25, zc + 0.2, [-1, 0])
    wall(glass, c + 0.45, y0 + 0.5, c + 0.45, y1 - 0.5, zc - 0.25, zc + 0.2, [1, 0])
  }
  /** The portico's concrete soffit under its lead skin. */
  function soffit(k: number, y0: number, y1: number) {
    const a = arc(CX(k), -0.3)
    for (let i = 0; i < SEG; i++) {
      const p = a[i], q = a[i + 1]
      const n0: V3 = [-p.nx, 0, -p.nz], n1: V3 = [-q.nx, 0, -q.nz]
      conc.tri(P(p.x, y0, p.z), P(q.x, y1, q.z), P(q.x, y0, q.z), undefined, undefined, undefined, [n0, n1, n1])
      conc.tri(P(p.x, y0, p.z), P(p.x, y1, p.z), P(q.x, y1, q.z), undefined, undefined, undefined, [n0, n0, n1])
    }
  }

  /**
   * A vault end at y = ye, the end wall facing s (+1 north, -1 south).
   * `kind`: 'front' a gallery end (rim, lunette, travertine infill, columns
   * from `colBase`), 'court' the same without columns, 'open' a portico end
   * (rim only, all its faces), 'joint' the shared rim where two vaults meet.
   */
  function end(k: number, ye: number, s: 1 | -1, kind: 'front' | 'court' | 'open' | 'joint', colBase = FLOOR) {
    const cx = CX(k)
    const outer = arc(cx, RIM_OUT), skin = arc(cx), inner = arc(cx, -RIM_IN), slot = arc(cx, -RIM_IN - 0.4)
    const yf = kind === 'joint' ? ye + 0.5 : ye + s * RIM_FRONT, yb = kind === 'joint' ? ye - 0.5 : ye - s * RIM_BACK
    const sf: 1 | -1 = kind === 'joint' ? 1 : s
    const lower = kind === 'joint' ? skin : inner
    for (let i = 0; i < SEG; i++) {
      const o0 = outer[i], o1 = outer[i + 1], l0 = lower[i], l1 = lower[i + 1]
      // front face
      face(conc, [P(l0.x, yf, l0.z), P(l1.x, yf, l1.z), P(o1.x, yf, o1.z), P(o0.x, yf, o0.z)], [0, sf, 0])
      // the outer (upper) face of the rim
      const m: V3 = [(o0.nx + o1.nx) / 2, 0, (o0.nz + o1.nz) / 2]
      face(conc, [P(o0.x, yb, o0.z), P(o1.x, yb, o1.z), P(o1.x, yf, o1.z), P(o0.x, yf, o0.z)], m)
      // the back face: where it shows above the lead, or all of it at an open end
      const b0 = kind === 'open' ? inner[i] : skin[i], b1 = kind === 'open' ? inner[i + 1] : skin[i + 1]
      face(conc, [P(b0.x, yb, b0.z), P(b1.x, yb, b1.z), P(o1.x, yb, o1.z), P(o0.x, yb, o0.z)], [0, -sf, 0])
      if (kind !== 'joint') {
        // the soffit of the rim
        face(conc, [P(l0.x, yb, l0.z), P(l1.x, yb, l1.z), P(l1.x, yf, l1.z), P(l0.x, yf, l0.z)], [-m[0], 0, -m[2]])
      }
      if (kind === 'front' || kind === 'court') {
        // the glazed lunette under the rim, and the travertine infill under that
        const w0 = slot[i], w1 = slot[i + 1]
        face(win, [P(w0.x, ye + s * 0.03, w0.z), P(w1.x, ye + s * 0.03, w1.z), P(l1.x, ye + s * 0.03, l1.z), P(l0.x, ye + s * 0.03, l0.z)], [0, s, 0])
        face(trav, [P(cx, ye, SPRING), P(w0.x, ye, w0.z), P(w1.x, ye, w1.z)], [0, s, 0])
      }
    }
    if (kind === 'front') {
      // a column under each foot of the arch, proud of the wall like the rim
      for (const [x0, x1] of [[cx - HW - RIM_OUT, cx - HW + RIM_IN], [cx + HW - RIM_IN, cx + HW + RIM_OUT]])
        box(conc, null, x0, Math.min(ye + s * RIM_FRONT, ye), colBase, x1, Math.max(ye + s * RIM_FRONT, ye), SPRING, s > 0 ? 'new' : 'sew')
    }
  }

  // --- The vault rows ---------------------------------------------------------
  type Row = { ks: number[]; y0: number; y1: number }
  const rows: Row[] = [
    { ks: [-3, -2, -1, 0, 1, 2], y0: J1, y1: YN }, // north wing
    { ks: [-1, 0, 1, 2], y0: J2, y1: J1 }, // middle wing
    { ks: [-3, -2, -1, 0, 1, 2], y0: YS, y1: J2 }, // south wing
  ]
  const courts: Record<number, [number, number][]> = { 0: [[26.6, 37.4]], [-1]: [[-36.3, -30.2]], 1: [[-33.1, -27.6]] }
  for (const row of rows) for (const k of row.ks) {
    // cut the row's span by any court in this vault
    const cuts = (courts[k] ?? []).filter(([a, b]) => a > row.y0 && b < row.y1)
    const spans: [number, number][] = []
    let at = row.y0
    for (const [a, b] of cuts) { spans.push([at, a]); at = b }
    spans.push([at, row.y1])
    for (const [y0, y1] of spans) {
      shell(k, y0, y1)
      if (k === -3) soffit(k, y0, y1)
    }
    for (const [a, b] of cuts) { end(k, a, 1, 'court'); end(k, b, -1, 'court') }
    // the row's own ends
    const kind = (y: number, s: 1 | -1) => {
      if (k === -3) return null
      if (y === YN || y === YS) return 'front' as const
      // the inner ends at the joints: a shared rim where a vault continues,
      // a court front where the entrance court is (vault -2)
      return k === -2 ? ('front' as const) : null
    }
    const kn = kind(row.y1, 1), ks = kind(row.y0, -1)
    if (kn) end(k, row.y1, 1, kn)
    if (ks) end(k, row.y0, -1, ks)
    if (k === -3) { end(k, row.y1, 1, 'open'); end(k, row.y0, -1, 'open') }
  }
  // the joints between the rows, over the four vaults that run through
  for (const k of [-1, 0, 1, 2]) { end(k, J1, 1, 'joint'); end(k, J2, 1, 'joint') }

  // --- Channels: flat roofs between the vaults --------------------------------
  const chans: [number, number, number, number][] = [] // x0, x1, y0, y1
  for (let k = -2; k < 2; k++) chans.push([CX(k) + HW, CX(k + 1) - HW, YS, YN])
  chans.push([CX(-3) + HW, CX(-2) - HW, J1, YN], [CX(-3) + HW, CX(-2) - HW, YS, J2]) // behind the porticoes
  for (const [x0, x1, y0, y1] of chans) {
    flat(chan, x0, y0, x1, y1, SPRING)
    // channel ends on the fronts: travertine up to the roof
  }

  // --- The body under the vaults ----------------------------------------------
  // Fronts (north, south) between the columns: concrete lower level, floor band, travertine.
  const band = (side: Part, ax: number, ay: number, bx: number, by: number, n: [number, number], low: Part, z0 = 0) => {
    if (FLOOR > z0) wall(low, ax, ay, bx, by, z0, FLOOR, n)
    wall(conc, ax, ay, bx, by, Math.max(FLOOR, z0), FLOOR + 0.6, n)
    wall(side, ax, ay, bx, by, FLOOR + 0.6, SPRING - 0.7, n)
    wall(conc, ax, ay, bx, by, SPRING - 0.7, SPRING, n)
  }
  const front = (ax: number, bx: number, y: number, s: 1 | -1) => {
    // wall at y from ax to bx, travertine to the springing (no beam under the arches)
    const n: [number, number] = [0, s]
    const [a, b] = s > 0 ? [bx, ax] : [ax, bx]
    wall(conc, a, y, b, y, 0, FLOOR + 0.6, n)
    wall(trav, a, y, b, y, FLOOR + 0.6, SPRING, n)
  }
  // north and south fronts, gallery wall to the east front
  front(XG, XE, YN, 1)
  front(XG, XE, YS, -1)
  // the court-side fronts of the outer wings (vault -2 and its channel)
  front(XG, XM, J1, -1)
  front(XG, XM, J2, 1)
  // east front: travertine to the ground, floor band, edge beam; the middle
  // wing's lower-level entrance glazed
  {
    const n: [number, number] = [1, 0]
    wall(trav, XE, YS, XE, J2 + 2, 0, FLOOR, n)
    wall(trav, XE, J1 - 2, XE, YN, 0, FLOOR, n)
    // the lower-level entrance porch under the middle wing, recessed 3.5 m
    const ra = J2 + 2, rb = J1 - 2, XR = XE - 3.5
    wall(conc, XR, ra, XR, rb, 0, FLOOR, n)
    for (let y = ra + 1.5; y < rb - 2; y += 5.2) wall(win, XR, y, XR, Math.min(y + 4.2, rb - 1.5), 0, FLOOR - 0.6, n, 0.05)
    wall(conc, XR, ra, XE, ra, 0, FLOOR, [0, 1])
    wall(conc, XE, rb, XR, rb, 0, FLOOR, [0, -1])
    flat(conc, XR, ra, XE, rb, FLOOR, false)
    for (const y of [ra + (rb - ra) / 3, ra + (2 * (rb - ra)) / 3]) box(conc, null, XE - 0.8, y - 0.4, 0, XE, y + 0.4, FLOOR)
    wall(conc, XE, YS, XE, YN, FLOOR, FLOOR + 0.6, n)
    wall(trav, XE, YS, XE, YN, FLOOR + 0.6, SPRING - 0.7, n)
    wall(conc, XE, YS, XE, YN, SPRING - 0.7, SPRING, n)
  }
  // gallery walls behind the porticoes (west faces of the outer wings)
  band(trav, XG, YN, XG, J1, [-1, 0], conc, FLOOR)
  band(trav, XG, J2, XG, YS, [-1, 0], conc, FLOOR)
  // the middle wing's west front on the entrance court: glazed bays between concrete piers
  {
    const n: [number, number] = [-1, 0]
    wall(conc, XM, J1, XM, J2, 0, FLOOR + 0.6, n)
    wall(conc, XM, J1, XM, J2, SPRING - 0.9, SPRING, n)
    const bays = 6, w = (J1 - J2) / bays
    for (let i = 0; i < bays; i++) {
      const ya = J1 - i * w, yb = ya - w
      wall(conc, XM, ya, XM, ya - 0.6, FLOOR + 0.6, SPRING - 0.9, n)
      wall(win, XM, ya - 0.6, XM, yb, FLOOR + 0.6, SPRING - 0.9, n)
    }
  }
  // courts: glazed walls round each, concrete below the gallery floor
  for (const [k, list] of Object.entries(courts)) for (const [y0, y1] of list) {
    const x0 = CX(+k) - HW, x1 = CX(+k) + HW
    const sides: [number, number, number, number, [number, number]][] = [
      [x0, y0, x1, y0, [0, 1]], [x1, y1, x0, y1, [0, -1]], [x0, y1, x0, y0, [1, 0]], [x1, y0, x1, y1, [-1, 0]],
    ]
    for (const [ax, ay, bx, by, n] of sides) {
      wall(conc, ax, ay, bx, by, 0, FLOOR + 0.6, n)
      wall(win, ax, ay, bx, by, FLOOR + 0.6, SPRING - 0.5, n)
      wall(conc, ax, ay, bx, by, SPRING - 0.5, SPRING, n)
    }
  }

  // --- The porticoes ----------------------------------------------------------
  for (const [y0, y1] of [[J1, YN], [YS, J2]]) {
    const c = CX(-3)
    // terrace at the gallery floor
    box(conc, trav, XW - 0.4, y0 - 0.4, 0, XG, y1 + 0.4, FLOOR, 'nsw')
    // four corner columns
    for (const yy of [y0, y1]) for (const [xa, xb] of [[c - HW - RIM_OUT, c - HW + RIM_IN], [c + HW - RIM_IN, c + HW + RIM_OUT]]) {
      const ya = yy === y0 ? y0 : y1 - 0.85, yb = ya + 0.85
      box(conc, null, xa, ya, FLOOR, xb, yb, SPRING)
    }
    // edge beams along both long sides under the springing
    box(conc, null, c - HW - RIM_OUT, y0, SPRING - 0.7, c - HW + 0.45, y1, SPRING, 'we')
    flat(conc, c - HW - RIM_OUT, y0, c - HW + 0.45, y1, SPRING - 0.7, false)
    box(conc, null, c + HW - 0.45, y0, SPRING - 0.7, c + HW + RIM_OUT, y1, SPRING, 'w')
    flat(conc, c + HW - 0.45, y0, XG, y1, SPRING - 0.7, false)
  }

  return [
    { part: trav, material: finish('kimbell-travertine', 0xebe4d6) },
    {
      part: conc,
      // At night the portico soffits are lit from below (Highsmith, dusk).
      material: {
        ...finish('kimbell-concrete', 0xbdb8ad),
        floodlight: (p: V3, n: V3) => (n[2] < -0.2 && p[2] > SPRING - 1 && p[0] > XW - 1 + OX && p[0] < CX(-3) + HW + 1 + OX ? 0.8 : 0),
      },
    },
    { part: lead, material: finish('kimbell-lead', 0xaab0b4, 0.5) },
    { part: chan, material: finish('kimbell-channel-roof', 0x80888e) },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
  ]
}

if (import.meta.main) await save('dal-kimbell-art-museum', 'Kimbell Art Museum', ANCHOR, BEARING, build(), 6500)
