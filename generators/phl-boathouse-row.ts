/**
 * Boathouse Row, Philadelphia — procedural, CC0-1.0, no textures.
 * bun generators/phl-boathouse-row.ts
 *
 * Map frame: x east, y north, z up, metres; one placement for the whole row
 * at bearing 0. The anchor is the area centroid of the twelve boathouse
 * outlines it replaces (lng -75.187806, lat 39.969496). Each house is built
 * in its own frame, turned with its OSM outline (u along the river front,
 * v inland, the river face at the low-v side) and z = 0 on its own ground;
 * the map lifts each house onto the bank under it. The water and the docks
 * are the map's.
 *
 * What it is: the row of Victorian boathouses of the Schuylkill Navy on the
 * east bank of the Schuylkill above the Fairmount Dam (National Historic
 * Landmark, 1987), from the north: #15 Sedgeley Club (1902, white
 * clapboard, with the Turtle Rock Light), #14 Philadelphia Girls' Rowing
 * Club (1860, stone Italianate villa with a belvedere), #13 Undine Barge
 * Club (1883, Furness: steep gable and a round turret), #12 Penn AC (1878),
 * #11 College Boat Club (1874), #10-9 Vesper and Malta (1873 double, Tudor
 * gables), #7-8 University and Philadelphia Barge Clubs (1871 double,
 * shingled, low hipped roof with a centre gable), #6 Bachelors Barge Club
 * (1894, brick and stucco, arcaded), #5-4 Crescent and Pennsylvania Barge
 * Clubs (1869-71 / 1892, stone below half-timber), #2-3 Fairmount Rowing
 * Association (1904, brick, hipped). Since 1979 (LEDs since 2005) every
 * house is outlined at night in lines of white lights along its eaves,
 * gables, hips and corners and around its boat-bay arches: that outline is
 * the row's identity and is drawn here as `neon-bhr-lights`.
 *
 * Covers and replaces (OSM): way/60945644 (#15), way/60945643 (#14),
 * way/60945642 (#13), way/60945641 (#12), way/60945640 (#11),
 * way/60945645 (#10), way/664678411 (#9), way/60945636 (#7-8),
 * way/60945635 (#6), way/60945611 (#5), way/664678412 (#4),
 * way/60945610 (#2-3). Left off: #1 Lloyd Hall (way/60945606, the 1998
 * public recreation centre, not outlined in lights), the small shed
 * way/1160479295 and the Lemon Hill gazebos. relation/15693769 is the
 * locality outline of the row (place=locality), not a building.
 *
 * Evidence
 * - OSM outlines (measured): each house's position, size and turn
 *   (min-area rectangle of its outline: -8 to -18 degrees for #14 to #2,
 *   -52 for #15 where the bank turns).
 * - USGS 3DEP lidar, USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown
 *   2015), 0.5 m, read in each house's frame, heights above the house's
 *   own ground (the bank, about 2.5 m above the pool): ridges, eaves and
 *   which way each ridge runs. #15 eaves 7.3, ridge 9.5, porch 4.5-5.2,
 *   lighthouse 13.6; #14 roof 6-7, belvedere 10; #13 ridge 11 along v,
 *   eaves 7-8, turret 13; #12 ridge 9 along v, deck 3, rear 6; #11 front
 *   ridge 9.2 along u, centre gable 10.7, rear blocks 7.3 and 3.7; #10
 *   front gables 12-14; #9 ridge 14 along v, eaves 10; #7-8 ridge 10, eaves
 *   4, rear 8-9; #6 ridge 12 along v, eaves 8, terrace 4.5; #5 twin ridges
 *   11 along v, eaves 8.5; #4 ridge 13 along v, eaves 8-9, porch 5.5; #2
 *   hip 11, eaves 7, wing 4-6. Tree canopy over the backs of #6, #12, #13
 *   (15-19) is ignored.
 * - USGS NAIP orthophoto (public domain): plan, grey slate roofs (the red
 *   roof of #14).
 * - Photos (Wikimedia Commons): HABS PA-1650 by Jack E. Boucher and others
 *   (public domain): "Closer view of boathouses, looking southeast from
 *   west bank" (561-3), aerial views looking north and northeast (561-14,
 *   561-15), and the 1972 house views Sedgeley72, University72 (Jack
 *   Boucher, public domain); Ciricula's 2010 house views (public domain):
 *   Philadelphia Girls RC 2010, Undine2010, PennAC2010, CollegeBC2010,
 *   Vesper-Malta2010, Crescent-Pennsylvania2010, Crescent2010,
 *   FairmountRA2010; "'Bachelors' boathouse.jpg" (Antigng, CC BY-SA 4.0);
 *   "Boathouse Row - panoramio (long).jpg" (michaelwm25, CC BY 3.0: the
 *   whole row in daylight); "Boathouse Row-wide.JPG" (Jeffrey M. Vinocur,
 *   CC BY 2.5). Night: "Boathouse Row Panorama.jpg" (Ryan Linton, CC BY-SA
 *   3.0: the whole row outlined), "Boathouse Row.JPG" (Ryan Linton, CC
 *   BY-SA 3.0), "Twilight on Boathouse Row - panoramio.jpg" (michaelwm25,
 *   CC BY 3.0): which edges are lit (eaves, rakes, hips, corners, a belt at
 *   the first floor, the boat-bay arches; not the gable ridges).
 * - Published: Wikipedia "Boathouse Row" and the NHL nomination (dates,
 *   clubs, the 1979 Grenald lighting, LEDs from 2005).
 * - Estimated from the photos: wall colours (warm brown stone and brick
 *   below, cream stucco and half-timber above, pulled to the palette's
 *   lightness), the boat-bay doors, window rows, dormers and chimneys, the
 *   storey split at about 3.6 m, the light lines' thickness (0.3 m, drawn
 *   thicker than the real LED strings so they read).
 *
 * Doubts
 * - The backs (Kelly Drive side) are drawn plain; few photos show them, and
 *   the lights are drawn on every side although only the river and end
 *   faces are confirmed lit.
 * - Half-timbering, balconies, decks' railings, flagpoles and the white tent
 *   on #12's deck are left out; #14's red roof is drawn in the shared slate.
 * - #11's and #10's rear blocks follow the 2015 lidar; the house fronts
 *   follow the photos where the two disagree in detail.
 * - The lights are often colour-washed for events; they are drawn white.
 *
 * Night: only the light lines glow (`neon-bhr-lights`, white). The windows
 * are mostly dark in the night photos, so they are a non-glowing slate
 * (`bhr-window-dark`) and the outline carries the row, as it does in life.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { cbox, cylinder, grow, hip, panel, qf, rect, tf, type Rect } from './dc-white-house'
import { saveModel } from './dc-nga-west'

// Global parts (model frame).
const G = { light: new Part(), dark: new Part(), roof: new Part(), win: new Part(), bay: new Part(), neon: new Part() }
type Parts = typeof G
const fresh = (): Parts => ({ light: new Part(), dark: new Part(), roof: new Part(), win: new Part(), bay: new Part(), neon: new Part() })

/** Copy a house's parts into the model, turned `deg` (counter-clockwise) and moved to (cx, cy). */
function place(src: Parts, cx: number, cy: number, deg: number) {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a)
  for (const k of Object.keys(G) as (keyof Parts)[]) {
    const S = src[k], D = G[k]
    for (let i = 0; i < S.pos.length; i += 3) {
      const x = S.pos[i], y = -S.pos[i + 2], z = S.pos[i + 1]
      const nx = S.nrm[i], ny = -S.nrm[i + 2], nz = S.nrm[i + 1]
      D.pos.push(cx + x * c - y * s, z, -(cy + x * s + y * c))
      D.nrm.push(nx * c - ny * s, nz, -(nx * s + ny * c))
    }
    D.uv.push(...S.uv)
  }
}

// ---------------------------------------------------------------------------
// Light lines: a slim triangular tube along an edge, nudged outward.
const LR = 0.15
function line(p: Part, a: V3, b: V3, out: V3 = [0, 0, 0]) {
  const A: V3 = [a[0] + out[0], a[1] + out[1], a[2] + out[2]], B: V3 = [b[0] + out[0], b[1] + out[1], b[2] + out[2]]
  const d: V3 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]]
  const l = Math.hypot(...d)
  if (l < 0.05) return
  const t: V3 = [d[0] / l, d[1] / l, d[2] / l]
  const ref: V3 = Math.abs(t[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  let e1: V3 = [t[1] * ref[2] - t[2] * ref[1], t[2] * ref[0] - t[0] * ref[2], t[0] * ref[1] - t[1] * ref[0]]
  const l1 = Math.hypot(...e1); e1 = [e1[0] / l1, e1[1] / l1, e1[2] / l1]
  const e2: V3 = [t[1] * e1[2] - t[2] * e1[1], t[2] * e1[0] - t[0] * e1[2], t[0] * e1[1] - t[1] * e1[0]]
  const ring = [0, 1, 2].map((k) => {
    const ang = (k * 2 * Math.PI) / 3 + Math.PI / 2
    return [Math.cos(ang) * LR, Math.sin(ang) * LR]
  })
  for (let k = 0; k < 3; k++) {
    const [c0, s0] = ring[k], [c1, s1] = ring[(k + 1) % 3]
    const o0: V3 = [e1[0] * c0 + e2[0] * s0, e1[1] * c0 + e2[1] * s0, e1[2] * c0 + e2[2] * s0]
    const o1: V3 = [e1[0] * c1 + e2[0] * s1, e1[1] * c1 + e2[1] * s1, e1[2] * c1 + e2[2] * s1]
    // smooth (radial) normals, so the corners are shared and the file stays small
    const n0: V3 = [o0[0] / LR, o0[1] / LR, o0[2] / LR], n1: V3 = [o1[0] / LR, o1[1] / LR, o1[2] / LR]
    const a0: V3 = [A[0] + o0[0], A[1] + o0[1], A[2] + o0[2]], b0: V3 = [B[0] + o0[0], B[1] + o0[1], B[2] + o0[2]]
    const a1: V3 = [A[0] + o1[0], A[1] + o1[1], A[2] + o1[2]], b1: V3 = [B[0] + o1[0], B[1] + o1[1], B[2] + o1[2]]
    p.tri(a0, b0, b1, undefined, undefined, undefined, [n0, n0, n1])
    p.tri(a0, b1, a1, undefined, undefined, undefined, [n0, n1, n1])
  }
}

// ---------------------------------------------------------------------------
// A house block: walls (dark below `split`, light above), then its roof.
type Roof =
  | { t: 'flat' }
  | { t: 'gu' | 'gv'; ridge: number; o?: number } // gable, ridge along u or v
  | { t: 'hip'; ridge: number; along: 'u' | 'v'; inset: number; o?: number }
type Block = {
  r: Rect; z: number; roof: Roof; split?: number; wall?: 'light' | 'dark'; gableWall?: 'light' | 'dark'
  belt?: number
}

function block(P: Parts, b: Block) {
  const { r, z } = b
  const lowMat = P[b.wall ?? 'dark'], upMat = P[b.split !== undefined ? 'light' : b.wall ?? 'dark']
  if (b.split !== undefined && b.split < z) {
    cbox(lowMat, r, 0, b.split, { top: false })
    cbox(upMat, r, b.split, z, { top: false })
  } else cbox(lowMat, r, 0, z, { top: false })
  const N = P.neon, o = 0.06
  // vertical corners
  for (const [x, y, dx, dy] of [[r.x0, r.y0, -1, -1], [r.x1, r.y0, 1, -1], [r.x1, r.y1, 1, 1], [r.x0, r.y1, -1, 1]] as const) {
    line(N, [x, y, 0.3], [x, y, z], [dx * o, dy * o, 0])
  }
  if (b.belt) line(N, [r.x0, r.y0, b.belt], [r.x1, r.y0, b.belt], [0, -o, 0])
  const R = b.roof, gw = P[b.gableWall ?? (b.split !== undefined ? 'light' : b.wall ?? 'dark')]
  if (R.t === 'flat') {
    cbox(P.roof, grow(r, 0.15), z, z + 0.35, { b: 0.1 })
    const g = grow(r, 0.2), zz = z + 0.35
    line(N, [g.x0, g.y0, zz], [g.x1, g.y0, zz]); line(N, [g.x1, g.y0, zz], [g.x1, g.y1, zz])
    line(N, [g.x1, g.y1, zz], [g.x0, g.y1, zz]); line(N, [g.x0, g.y1, zz], [g.x0, g.y0, zz])
    return
  }
  const ov = R.o ?? 0.45, g = grow(r, ov)
  // the eaves drop a little with the overhang
  const ze = z - 0.2
  if (R.t === 'gu' || R.t === 'gv') {
    const A = R.ridge
    if (R.t === 'gv') {
      const xm = (r.x0 + r.x1) / 2
      qf(P.roof, [g.x0, g.y0, ze], [g.x0, g.y1, ze], [xm, g.y1, A], [xm, g.y0, A], [-(A - ze), 0, xm - g.x0])
      qf(P.roof, [g.x1, g.y0, ze], [g.x1, g.y1, ze], [xm, g.y1, A], [xm, g.y0, A], [A - ze, 0, g.x1 - xm])
      // gable ends on the wall planes
      for (const [y, s] of [[r.y0, -1], [r.y1, 1]] as const) {
        tf(gw, [r.x0, y, z], [r.x1, y, z], [xm, y, A], [0, s, 0])
      }
      line(N, [g.x0, g.y0, ze], [g.x0, g.y1, ze]); line(N, [g.x1, g.y0, ze], [g.x1, g.y1, ze])
      line(N, [g.x0, g.y0, ze], [xm, g.y0, A]); line(N, [g.x1, g.y0, ze], [xm, g.y0, A])
      line(N, [g.x0, g.y1, ze], [xm, g.y1, A]); line(N, [g.x1, g.y1, ze], [xm, g.y1, A])
    } else {
      const ym = (r.y0 + r.y1) / 2
      qf(P.roof, [g.x0, g.y0, ze], [g.x1, g.y0, ze], [g.x1, ym, A], [g.x0, ym, A], [0, -(A - ze), ym - g.y0])
      qf(P.roof, [g.x0, g.y1, ze], [g.x1, g.y1, ze], [g.x1, ym, A], [g.x0, ym, A], [0, A - ze, g.y1 - ym])
      for (const [x, s] of [[r.x0, -1], [r.x1, 1]] as const) tf(gw, [x, r.y0, z], [x, r.y1, z], [x, ym, A], [s, 0, 0])
      line(N, [g.x0, g.y0, ze], [g.x1, g.y0, ze]); line(N, [g.x0, g.y1, ze], [g.x1, g.y1, ze])
      line(N, [g.x0, g.y0, ze], [g.x0, ym, A]); line(N, [g.x0, g.y1, ze], [g.x0, ym, A])
      line(N, [g.x1, g.y0, ze], [g.x1, ym, A]); line(N, [g.x1, g.y1, ze], [g.x1, ym, A])
    }
    return
  }
  // hip: ridge along u or v, hips inset `inset` at the ends
  const H = R as Extract<Roof, { t: 'hip' }>
  const w = g.x1 - g.x0, d = g.y1 - g.y0
  const ix = H.along === 'u' ? Math.min(H.inset, w / 2 - 0.05) : w / 2 - 0.05
  const iy = H.along === 'v' ? Math.min(H.inset, d / 2 - 0.05) : d / 2 - 0.05
  hip(P.roof, g, ze, H.ridge, ix, P.roof, iy)
  const t = grow(g, -ix, -iy), A = H.ridge
  const lo: V3[] = [[g.x0, g.y0, ze], [g.x1, g.y0, ze], [g.x1, g.y1, ze], [g.x0, g.y1, ze]]
  const hi: V3[] = [[t.x0, t.y0, A], [t.x1, t.y0, A], [t.x1, t.y1, A], [t.x0, t.y1, A]]
  for (let k = 0; k < 4; k++) {
    line(N, lo[k], lo[(k + 1) % 4])
    line(N, lo[k], hi[k])
  }
  line(N, H.along === 'u' ? hi[0] : hi[1], H.along === 'u' ? hi[1] : hi[2])
}

/** Boat-bay doors on the river face (low v): arched or square, outlined in light if `lit`. */
function bays(P: Parts, y: number, us: number[], w: number, h: number, arch: boolean, lit = true, z0 = 0) {
  for (const u of us) {
    const r = w / 2
    if (arch) {
      const spring = z0 + h - r, seg = 8
      panel(P.bay, 's', y, u - r, u + r, z0, spring, 0.05)
      const pts: [number, number][] = []
      for (let k = 0; k <= seg; k++) { const t = (Math.PI * k) / seg; pts.push([u + r * Math.cos(t), spring + r * Math.sin(t)]) }
      for (let k = 0; k < seg; k++) tf(P.bay, [u, y - 0.05, spring], [pts[k][0], y - 0.05, pts[k][1]], [pts[k + 1][0], y - 0.05, pts[k + 1][1]], [0, -1, 0])
      if (lit) {
        const o: V3 = [0, -0.12, 0]
        line(P.neon, [u - r - 0.15, y, z0 + 0.2], [u - r - 0.15, y, spring], o)
        line(P.neon, [u + r + 0.15, y, z0 + 0.2], [u + r + 0.15, y, spring], o)
        for (let k = 0; k < 4; k++) {
          const t0 = (Math.PI * k) / 4, t1 = (Math.PI * (k + 1)) / 4, R2 = r + 0.15
          line(P.neon, [u + R2 * Math.cos(t0), y, spring + R2 * Math.sin(t0)], [u + R2 * Math.cos(t1), y, spring + R2 * Math.sin(t1)], o)
        }
      }
    } else {
      panel(P.bay, 's', y, u - w / 2, u + w / 2, z0, z0 + h, 0.05)
      if (lit) {
        const o: V3 = [0, -0.12, 0]
        line(P.neon, [u - w / 2 - 0.15, y, z0 + 0.2], [u - w / 2 - 0.15, y, z0 + h + 0.15], o)
        line(P.neon, [u + w / 2 + 0.15, y, z0 + 0.2], [u + w / 2 + 0.15, y, z0 + h + 0.15], o)
        line(P.neon, [u - w / 2 - 0.15, y, z0 + h + 0.15], [u + w / 2 + 0.15, y, z0 + h + 0.15], o)
      }
    }
  }
}

/** A row of window panels on a face. side 's' = river face at y, 'e'/'w' at x. */
function windows(P: Parts, side: 's' | 'n' | 'e' | 'w', at: number, cs: number[], w: number, z0: number, z1: number) {
  for (const c of cs) panel(P.win, side, at, c - w / 2, c + w / 2, z0, z1, 0.05)
}

/** A gable-end window centred at u = c on the river face. */
function gableWindow(P: Parts, y: number, c: number, w: number, z0: number, z1: number) {
  panel(P.win, 's', y, c - w / 2, c + w / 2, z0, z1, 0.05)
}

/** A front dormer on a roof sloping down to the river face at y = yf: box with a little gable, lit. */
function dormer(P: Parts, c: number, w: number, yf: number, yb: number, z0: number, z1: number, mat: 'light' | 'dark' = 'light') {
  const r = rect(c - w / 2, c + w / 2, yf, yb)
  cbox(P[mat], r, z0, z1, { top: false })
  const A = z1 + w * 0.45, g = grow(r, 0.2)
  qf(P.roof, [g.x0, g.y0, z1], [g.x0, g.y1, z1], [c, g.y1, A], [c, g.y0, A], [-(A - z1), 0, w / 2])
  qf(P.roof, [g.x1, g.y0, z1], [g.x1, g.y1, z1], [c, g.y1, A], [c, g.y0, A], [A - z1, 0, w / 2])
  tf(P[mat], [r.x0, yf, z1], [r.x1, yf, z1], [c, yf, A], [0, -1, 0])
  panel(P.win, 's', yf, c - w * 0.3, c + w * 0.3, z0 + 0.3, z1 - 0.15, 0.05)
  line(P.neon, [g.x0, g.y0, z1], [c, g.y0, A]); line(P.neon, [g.x1, g.y0, z1], [c, g.y0, A])
}

/** A round turret: walls to z, a cone to `top`, a light ring at the eaves. */
function turret(P: Parts, cx: number, cy: number, r: number, z: number, top: number, mat: 'light' | 'dark', seg = 12) {
  cylinder(P[mat], cx, cy, r, 0, z, seg)
  const ro = r + 0.35
  for (let k = 0; k < seg; k++) {
    const a0 = (2 * Math.PI * k) / seg, a1 = (2 * Math.PI * (k + 1)) / seg
    const p0: V3 = [cx + ro * Math.cos(a0), cy + ro * Math.sin(a0), z - 0.1], p1: V3 = [cx + ro * Math.cos(a1), cy + ro * Math.sin(a1), z - 0.1]
    tf(P.roof, p0, p1, [cx, cy, top], [Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2), (ro / (top - z))])
    // underside of the brim
    tf(P.roof, p0, [cx + r * Math.cos(a1), cy + r * Math.sin(a1), z - 0.1], p1, [0, 0, -1])
    tf(P.roof, p0, [cx + r * Math.cos(a0), cy + r * Math.sin(a0), z - 0.1], [cx + r * Math.cos(a1), cy + r * Math.sin(a1), z - 0.1], [0, 0, -1])
    if (k % 2 === 0) {
      const a2 = (2 * Math.PI * (k + 2)) / seg
      line(P.neon, p0, [cx + ro * Math.cos(a2), cy + ro * Math.sin(a2), z - 0.1])
    }
  }
}

function chimney(P: Parts, u: number, v: number, w: number, z0: number, z1: number) {
  cbox(P.dark, rect(u - w / 2, u + w / 2, v - w / 2, v + w / 2), z0, z1, { b: 0.08 })
}

// ===========================================================================
// The houses, north to south. Centres and turns from the OSM outlines; all
// numbers in each house's own frame (u along the front, v inland).
type House = { n: string; cx: number; cy: number; deg: number; build: (P: Parts) => void }
const houses: House[] = [
  {
    // #15 Sedgeley Club: two-and-a-half storeys of white clapboard under a
    // side-gabled roof with three dormers, a glazed two-storey porch on the
    // river, a flat-roofed wing to the north and the Turtle Rock Light.
    n: '15', cx: -168.7, cy: 50.5, deg: -52,
    build(P) {
      const main = rect(-1.0, 12.2, -7.0, 3.6)
      block(P, { r: main, z: 7.1, wall: 'light', roof: { t: 'gu', ridge: 9.7 } })
      block(P, { r: rect(-1.0, 12.2, -10.2, -7.0), z: 4.9, wall: 'light', roof: { t: 'flat' }, belt: 2.5 })
      windows(P, 's', -10.2, [0.6, 2.6, 4.6, 6.6, 8.6, 10.6], 1.6, 2.9, 4.4)
      windows(P, 's', -10.2, [1.6, 5.6, 9.6], 1.6, 0.9, 2.2)
      for (const c of [1.8, 5.6, 9.4]) dormer(P, c, 1.8, -7.0, -4.5, 6.6, 8.2)
      block(P, { r: rect(-9.3, -1.0, -6.0, 1.5), z: 5.3, wall: 'light', roof: { t: 'flat' } })
      windows(P, 's', -6.0, [-7.3, -3.3], 1.2, 1.2, 2.6)
      windows(P, 's', -6.0, [-7.3, -3.3], 1.2, 3.3, 4.6)
      // the Turtle Rock Light: a slim round tower and its lantern
      turret(P, -5.5, -0.5, 1.15, 11.6, 13.7, 'light', 10)
      chimney(P, 7.5, 0.6, 1.0, 8.5, 10.6)
    },
  },
  {
    // #14 Philadelphia Girls' Rowing Club: stone villa under a low hipped
    // roof with a square belvedere; a low boat-bay wing on the river.
    n: '14', cx: -121.2, cy: 25.8, deg: -15,
    build(P) {
      block(P, { r: rect(-5.6, 5.5, -7.0, 7.9), z: 5.9, wall: 'dark', roof: { t: 'hip', ridge: 7.3, along: 'v', inset: 3 } })
      windows(P, 's', -7.0, [-3.5, -1.2, 1.2, 3.5], 0.9, 3.5, 5.0)
      windows(P, 'w', -5.6, [-4, -1, 2, 5], 0.9, 3.5, 5.0)
      windows(P, 'e', 5.5, [-4, -1, 2, 5], 0.9, 3.5, 5.0)
      block(P, { r: rect(-2.1, 2.1, -4.6, -0.6), z: 9.1, wall: 'dark', roof: { t: 'hip', ridge: 10.3, along: 'v', inset: 2 } })
      windows(P, 's', -4.6, [-0.9, 0.9], 0.8, 7.9, 8.8)
      block(P, { r: rect(-6.7, 6.8, -11.7, -7.0), z: 3.8, wall: 'dark', roof: { t: 'flat' } })
      bays(P, -11.7, [-3.8, 0.2, 4.2], 3.0, 2.8, false)
    },
  },
  {
    // #13 Undine Barge Club (Furness, 1883): a steep stone gable to the river
    // over two great boat doors and a gallery, the round turret beside it.
    n: '13', cx: -90.7, cy: 14.6, deg: -9,
    build(P) {
      block(P, { r: rect(-11.7, 1.7, -9.8, 9.0), z: 7.4, wall: 'dark', gableWall: 'dark', roof: { t: 'gv', ridge: 11.3 }, belt: 3.6 })
      bays(P, -9.8, [-8.2, -1.6], 3.4, 3.2, false)
      windows(P, 's', -9.8, [-7.6, -5.0, -2.4], 1.6, 4.4, 6.6)
      gableWindow(P, -9.8, -5.0, 2.4, 8.0, 9.4)
      block(P, { r: rect(-11.7, 2.8, 9.0, 14.0), z: 6.8, wall: 'dark', roof: { t: 'flat' } })
      turret(P, 2.3, -0.4, 2.1, 9.6, 13.6, 'dark', 12)
      windows(P, 'e', 4.3, [-0.4], 0.9, 5.2, 7.6)
      chimney(P, -11.0, -5.0, 1.2, 7.0, 12.8)
    },
  },
  {
    // #12 Penn AC (West Philadelphia Boat Club, 1878): cream stucco, a front
    // gable on the east and a two-storey block to the west behind a deck.
    n: '12', cx: -69.0, cy: 10.8, deg: -9,
    build(P) {
      block(P, { r: rect(-4.0, 5.3, -3.9, 14.0), z: 6.6, wall: 'light', roof: { t: 'gv', ridge: 9.4 } })
      block(P, { r: rect(-4.0, 7.5, -10.2, -3.9), z: 3.6, wall: 'light', roof: { t: 'flat' } })
      block(P, { r: rect(-12.8, -4.0, -10.2, -2.0), z: 3.0, wall: 'light', roof: { t: 'flat' } })
      block(P, { r: rect(-12.8, -4.0, -2.0, 14.0), z: 6.2, wall: 'light', roof: { t: 'hip', ridge: 7.2, along: 'v', inset: 3 } })
      bays(P, -10.2, [-10.2, -5.8, 0.0, 5.2], 3.2, 2.6, false)
      windows(P, 's', -3.9, [-2.0, 3.6], 1.6, 4.4, 5.8)
      windows(P, 's', -2.0, [-11.0, -7.6], 1.4, 3.8, 5.2)
      gableWindow(P, -3.9, 0.65, 1.6, 7.0, 8.2)
    },
  },
  {
    // #11 College Boat Club (1874): a long roof to the river with the stone
    // centre gable and its tall arched window, four arched boat doors.
    n: '11', cx: -44.7, cy: 12.6, deg: -8,
    build(P) {
      block(P, { r: rect(-14.1, 15.5, -18.8, -11.0), z: 5.6, wall: 'light', roof: { t: 'hip', ridge: 9.3, along: 'u', inset: 3.0 }, belt: 3.9 })
      block(P, { r: rect(-6.6, 0.4, -19.3, 4.0), z: 6.4, wall: 'dark', gableWall: 'dark', roof: { t: 'gv', ridge: 10.9 } })
      block(P, { r: rect(-14.0, -6.6, -11.0, 4.0), z: 7.3, wall: 'light', roof: { t: 'flat' } })
      block(P, { r: rect(0.4, 15.6, -11.0, 6.4), z: 3.7, wall: 'light', roof: { t: 'flat' } })
      bays(P, -18.8, [-11.0, 3.8, 9.6], 3.6, 3.2, true)
      bays(P, -19.3, [-3.1], 3.6, 3.2, true)
      gableWindow(P, -19.3, -3.1, 1.6, 4.5, 8.4)
      for (const c of [5.0, 8.4, 11.8]) dormer(P, c, 2.6, -18.8, -16.5, 5.2, 6.8)
      dormer(P, -10.4, 2.8, -18.8, -16.5, 5.2, 7.0)
    },
  },
  {
    // #10 Vesper Boat Club: stone below, two half-timbered gables to the river.
    n: '10', cx: -17.7, cy: 8.2, deg: -9,
    build(P) {
      block(P, { r: rect(-5.6, 9.2, -19.8, -9.0), z: 8.6, split: 3.8, roof: { t: 'gu', ridge: 12.0 }, belt: 3.8 })
      block(P, { r: rect(-5.4, 1.4, -19.8, -14.0), z: 8.6, split: 3.8, roof: { t: 'gv', ridge: 12.6, o: 0.35 } })
      block(P, { r: rect(2.2, 9.0, -19.8, -14.0), z: 8.6, split: 3.8, roof: { t: 'gv', ridge: 13.2, o: 0.35 } })
      block(P, { r: rect(-0.6, 9.2, -9.0, 8.6), z: 6.6, wall: 'dark', roof: { t: 'hip', ridge: 8.2, along: 'v', inset: 3 } })
      bays(P, -19.8, [-3.0, 1.8, 6.6], 3.2, 2.9, true)
      windows(P, 's', -19.8, [-3.6, -1.0], 1.0, 4.6, 7.4)
      windows(P, 's', -19.8, [4.2, 7.0], 1.2, 4.6, 7.4)
      gableWindow(P, -19.8, -2.0, 1.4, 9.2, 10.6)
      gableWindow(P, -19.8, 5.6, 1.6, 9.2, 11.0)
    },
  },
  {
    // #9 Malta Boat Club: the big half-timbered gable to the river.
    n: '9', cx: -0.3, cy: -0.3, deg: -9,
    build(P) {
      block(P, { r: rect(-9.3, 2.2, -14.0, 11.3), z: 9.6, split: 3.8, roof: { t: 'gv', ridge: 14.2 }, belt: 3.8 })
      block(P, { r: rect(2.2, 5.4, -1.8, 4.5), z: 10.6, wall: 'dark', roof: { t: 'flat' } })
      bays(P, -14.0, [-6.4, -0.8], 3.4, 2.9, true)
      windows(P, 's', -14.0, [-7.4, -5.2, -3.0, -0.8], 1.4, 4.8, 6.4)
      windows(P, 's', -14.0, [-5.8, -1.6], 2.4, 7.2, 8.8)
      gableWindow(P, -14.0, -3.55, 2.0, 10.2, 12.0)
      chimney(P, -9.0, -6.0, 1.1, 9.0, 15.0)
      chimney(P, 1.8, -4.0, 1.1, 9.0, 15.0)
    },
  },
  {
    // #7-8 University and Philadelphia Barge Clubs (1871): a broad shingled
    // roof sweeping low over four boat bays, the centre gable, two chimneys.
    n: '7', cx: 36.2, cy: -1.5, deg: -9,
    build(P) {
      block(P, { r: rect(-12.5, 12.5, -16.9, -4.0), z: 4.4, wall: 'dark', roof: { t: 'hip', ridge: 10.0, along: 'u', inset: 4.5 } })
      block(P, { r: rect(-4.0, 4.0, -16.9, -6.0), z: 5.6, wall: 'dark', gableWall: 'dark', roof: { t: 'gv', ridge: 10.3 } })
      block(P, { r: rect(-12.5, 12.5, -4.0, 2.0), z: 7.0, wall: 'dark', roof: { t: 'hip', ridge: 8.9, along: 'u', inset: 2 } })
      block(P, { r: rect(-12.3, -5.7, 2.0, 5.4), z: 3.0, wall: 'dark', roof: { t: 'flat' } })
      block(P, { r: rect(5.4, 12.7, 2.0, 6.0), z: 3.0, wall: 'dark', roof: { t: 'flat' } })
      bays(P, -16.9, [-9.6, -4.8, 4.8, 9.6], 3.4, 2.8, false)
      windows(P, 's', -16.9, [-2.5, -0.85, 0.85, 2.5], 1.4, 3.2, 5.0)
      gableWindow(P, -16.9, 0, 2.6, 6.0, 7.6)
      dormer(P, -9.0, 2.6, -16.9, -13.0, 4.0, 5.8, 'dark')
      dormer(P, 9.0, 2.6, -16.9, -13.0, 4.0, 5.8, 'dark')
      chimney(P, -5.0, -1.5, 1.0, 7.5, 11.2)
      chimney(P, 3.0, -1.5, 1.0, 7.5, 11.2)
    },
  },
  {
    // #6 Bachelors Barge Club (1894): brick, a hipped roof, a row of arched
    // windows over two arched boat doors; a low terrace block on the river.
    n: '6', cx: 78.6, cy: -13.9, deg: -10,
    build(P) {
      block(P, { r: rect(-9.3, 5.7, -8.7, 14.4), z: 8.0, wall: 'dark', roof: { t: 'hip', ridge: 12.2, along: 'v', inset: 6 }, belt: 4.2 })
      block(P, { r: rect(-7.3, 4.1, -12.2, -8.7), z: 4.2, wall: 'dark', roof: { t: 'flat' } })
      bays(P, -12.2, [-4.4, 1.4], 3.0, 3.0, true)
      // the loggia: five arches across the upper river face
      bays(P, -8.7, [-6.8, -4.1, -1.8, 0.5, 3.2], 1.9, 3.0, true, true, 4.6)
      chimney(P, 4.2, 6.0, 1.0, 9.0, 13.0)
    },
  },
  {
    // #5 Crescent Boat Club: stone below, half-timber above, two hipped
    // gables to the river.
    n: '5', cx: 106.0, cy: -19.2, deg: -11,
    build(P) {
      block(P, { r: rect(-5.9, 2.3, -11.5, 5.0), z: 8.3, split: 4.4, roof: { t: 'hip', ridge: 11.0, along: 'v', inset: 2.2 }, belt: 4.4 })
      block(P, { r: rect(2.3, 10.5, -11.5, 5.0), z: 8.3, split: 4.4, roof: { t: 'hip', ridge: 11.3, along: 'v', inset: 2.2 }, belt: 4.4 })
      block(P, { r: rect(-5.7, 0.4, 5.0, 10.0), z: 7.6, wall: 'dark', roof: { t: 'hip', ridge: 9.6, along: 'v', inset: 2 } })
      bays(P, -11.5, [-3.6, 0.6], 2.6, 3.0, true)
      bays(P, -11.5, [5.2, 8.6], 2.8, 3.2, false)
      windows(P, 's', -11.5, [-4.4, -2.2, 0.0], 1.2, 5.2, 7.4)
      windows(P, 's', -11.5, [3.8, 6.4, 9.0], 1.4, 5.2, 7.4)
    },
  },
  {
    // #4 Pennsylvania Barge Club (1892): a tall half-timbered gable to the
    // river over stone, a two-storey porch in front.
    n: '4', cx: 124.4, cy: -23.2, deg: -12,
    build(P) {
      block(P, { r: rect(-8.2, 4.8, -9.5, 6.7), z: 8.6, split: 4.2, roof: { t: 'gv', ridge: 13.3 }, belt: 4.2 })
      block(P, { r: rect(-8.1, 3.7, -11.4, -9.5), z: 5.4, wall: 'light', roof: { t: 'flat' } })
      block(P, { r: rect(-8.1, 3.7, 6.7, 10.5), z: 4.0, wall: 'dark', roof: { t: 'flat' } })
      bays(P, -11.4, [-5.6, -1.6, 2.0], 2.8, 2.9, false)
      windows(P, 's', -9.5, [-6.2, -3.6, -1.0, 1.6], 1.6, 6.0, 8.0)
      gableWindow(P, -9.5, -1.7, 2.6, 9.2, 10.8)
    },
  },
  {
    // #2-3 Fairmount Rowing Association (1904): a brick block under a hipped
    // roof with dormers, a lower wing with a deck to the north.
    n: '2', cx: 154.8, cy: -30.4, deg: -18,
    build(P) {
      block(P, { r: rect(3.0, 13.6, -9.4, 9.4), z: 7.2, wall: 'dark', roof: { t: 'hip', ridge: 11.0, along: 'v', inset: 4.5 }, belt: 3.6 })
      block(P, { r: rect(-9.1, 3.0, -5.3, 5.4), z: 4.6, wall: 'dark', roof: { t: 'flat' } })
      block(P, { r: rect(-1.6, 3.0, -9.5, -5.3), z: 5.6, wall: 'dark', roof: { t: 'flat' } })
      bays(P, -9.4, [5.6, 8.5], 2.4, 2.8, false)
      bays(P, -9.4, [11.3], 2.2, 2.8, true)
      windows(P, 's', -9.4, [5.3, 8.3, 11.3], 1.4, 4.4, 6.2)
      bays(P, -5.3, [-6.8, -3.0], 2.8, 2.8, false, false)
      dormer(P, 8.3, 2.6, -9.4, -7.0, 6.8, 8.4, 'dark')
      chimney(P, 6.2, 3.0, 1.1, 9.0, 12.6)
    },
  },
]

for (const h of houses) {
  const P = fresh()
  h.build(P)
  place(P, h.cx, h.cy, h.deg)
}

if (import.meta.main) {
  await saveModel('phl-boathouse-row', 'Boathouse Row', [
    { part: G.light, material: finish('bhr-cream', 0xeee4cf) },
    { part: G.dark, material: finish('bhr-stone', 0xb39a84) },
    { part: G.roof, material: finish('bhr-slate', 0x80868c) },
    { part: G.win, material: finish('bhr-window-dark', 0x64798a, 0.35) },
    { part: G.bay, material: finish('bhr-bay', 0x5c6167) },
    { part: G.neon, material: finish('neon-bhr-lights', 0xf7f5ec, 0.5) },
  ], { source: 'generators/phl-boathouse-row.ts', bearing: 0, osm: 'way/60945640', footprint: [345, 110], height: 15 }, 6500)
}
