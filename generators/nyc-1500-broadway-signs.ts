/**
 * 1500 Broadway signs, Times Square, Manhattan: ABC's Times Square Studios
 * (Good Morning America) corner and the screens on the building's base.
 * Signage only; the building stays the map's OSM extrusion. Procedural,
 * CC0-1.0.
 *   bun generators/nyc-1500-broadway-signs.ts
 *
 * THIS IS THE 2021 STATE. Good Morning America has since moved out of Times
 * Square Studios: by May 2026 (p4) the GMA corner's banded shell is dark,
 * the base is under a sidewalk shed and the mid-block screens are covered
 * by a printed wrap. The lit 2021 layout is kept on purpose, as the dressed
 * Times Square the batch asks for.
 *
 * What it draws, north to south along the Broadway front (east side of
 * Broadway, 43rd to 44th Street), as in the November 2021 photos:
 * - the GMA corner at 44th Street: a banded LED wall 13-20 m up, wrapping
 *   round the corner into 44th Street, green bars on its Broadway end and
 *   blue round the corner (e37, e42); under it the green upper ticker, the
 *   projecting bay of studio windows, and the double ticker (a blue line
 *   over a red-amber line) at 4.6-7.4 m (p2, p3, p7, e42);
 * - the mid-block screen (blue, "Increase your peace" in e42), 11.5-20 m;
 * - the big screen toward 43rd Street with its black caption band (e37,
 *   e41), 12.5-24.8 m, amber (the orange Netflix content of e41);
 * - the billboard on the base roof, its north end curving round the
 *   tower's corner (the Van Gogh / Gucci board, e37, p4), 31-44 m. It is
 *   printed vinyl lit by the row of floodlights on the rail under it (p4,
 *   e37), not a screen: a plain `billboard-vinyl` finish in a mid warm
 *   grey (the boards change; Van Gogh's was multicoloured, Gucci's black),
 *   carrying `_FLOODLIGHT` brightest at the bottom by the lamps;
 * - the small rooftop LED screen at 43rd Street (Carrera's red-pink in p5,
 *   "End the Iran War" in black, white and orange in p4), drawn as an
 *   amber block with an amber side to 43rd Street.
 * Screens are bold colour blocks (STYLE.md, Times Square brief): no ad
 * imagery and no lettering, as all of it is rotating content.
 *
 * Night: every screen and ticker is `neon-*` in its dominant colour, the
 * studio windows are `window` (lit in p1, p7), the rooftop billboard is
 * floodlit vinyl, and the cabinets, frames and supports are one dark
 * `sign-frame`. Night references: p1, p3, p7.
 *
 * Frame: x east', y north', z up (mesh.ts), turned by bearing 16.51 so +y
 * runs north along the Broadway front of OSM way/163629929 (1500 Broadway,
 * building=office, height 25; parts way/260183841 tower 125.6 m and
 * way/260183839 48 m). The origin is the middle of that front on the
 * ground: the front is the line x = 0 from y = -30.64 (43rd St corner) to
 * y = 30.64 (44th St corner), then a 3.1 m chamfer to (3.05, 31.43) and
 * 44th Street heading (0.978, -0.210); 43rd Street heads (0.976, -0.219)
 * from (0, -30.64). Every wall-hung cabinet's back plane is 0.3 m outside
 * that outline (checked below: the build fails if anything under the host's
 * 25 m comes nearer than 0.2 m or inside). The rooftop billboard and corner
 * screen stand on the base roof (their supports start at the OSM 25 m),
 * as the real ones do.
 *
 * Measured (USGS 3DEP lidar, NYC 2017 flight, 1 m grid, read in this
 * frame with tools/lidar_frame.py): base roof 27 m (OSM says 25: the model
 * keeps the 25 m host height for everything wall-hung); GMA wall top 20 m
 * from y = 6 to the corner; the studio bay's top ~13 m, projecting ~2 m;
 * rooftop billboard top 44 m along x ~ 7 from y ~ 0 to 18, curving east to
 * (18, 24); rooftop corner screen top 38 m at x 6-10, y -28 to -32.
 * Estimated from photos (people ~1.7 m, the base's 27 m, storey heights):
 * ticker heights 4.6-7.4 m, bay 7.4-11.6 m, upper ticker 11.6-13 m, the GMA
 * wall's five bands, the mid-block screen's 16 m width (y -11 to 5) and the big screen's
 * extent (y -30.2 to -13), the billboard's 31 m bottom, the corner screen's
 * 8 x 10 m. Cabinet depths (1 m screens, 2 m tickers) are invented to read
 * as LED cabinets.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - p1 "ABC, Times Square - panoramio.jpg", JavierDo, CC BY-SA 3.0, Dec 2008
 *   (night): https://commons.wikimedia.org/wiki/File:ABC,_Times_Square_-_panoramio.jpg
 * - p2 "ABC - Good Morning America.jpg", Tjeerd from Amsterdam, CC BY 2.0,
 *   2007: https://commons.wikimedia.org/wiki/File:ABC_-_Good_Morning_America.jpg
 * - p3 "New York - Times Square & Broadway (2948666414).jpg", David Ohmer,
 *   CC BY 2.0, 2008: https://commons.wikimedia.org/wiki/File:New_York_-_Times_Square_%26_Broadway_(2948666414).jpg
 * - p7 "Times Square Studios.jpg", History127, CC BY-SA 3.0, 2009 (night):
 *   https://commons.wikimedia.org/wiki/File:Times_Square_Studios.jpg
 * - e37, e41, e42 "Times Sq Nov 2021 37/41/42.jpg", Epicgenius, CC BY-SA
 *   4.0: https://commons.wikimedia.org/wiki/File:Times_Sq_Nov_2021_37.jpg
 *   (and _41, _42): the layout modelled.
 * - p5 "Times Sq Nov 2021 33.jpg", Epicgenius, CC BY-SA 4.0: the corner
 *   screen at 43rd Street.
 * - p4 "1500 Broadway (55282696232).jpg", Ajay Suresh, CC BY 4.0, 18 May
 *   2026: https://commons.wikimedia.org/wiki/File:1500_Broadway_(55282696232).jpg
 *
 * Doubts:
 * - The 2021 state, kept on purpose (see the top). If the screens are not
 *   relit after the works, the GMA wall, tickers and the two Broadway
 *   screens could become plain `sign-frame`.
 * - The real GMA corner is rounded inside OSM's sharp corner (lidar shows
 *   no wall at the outline's corner below 20 m). The model wraps the corner
 *   outside the outline instead, so it doesn't vanish into the extrusion:
 *   at the corner it stands up to ~2.5 m proud of the real one.
 * - The original wall's bands undulate (p1, p3, p7); they are drawn level.
 * - No licensed photo shows the 44th Street return squarely; its 10 m
 *   length is estimated.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish, PALETTE } from './palette'

type P2 = [number, number]

const frame = new Part(), blue = new Part(), green = new Part(), amber = new Part(), vinyl = new Part(), win = new Part()

const HOST_H = 25 // OSM height of way/163629929
/** The host outline in this frame (way/163629929), counter-clockwise. */
const HOST: P2[] = [[40.91, 23.32], [3.05, 31.43], [0, 30.64], [0, -30.64], [36.29, -38.8], [41.3, -17.26], [32.17, -15.25]]

// ------------------------------------------------------------ helpers
const norm2 = (v: P2): P2 => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

/** A quad wound so its face points along `want`. */
function quadOut(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}

type Face = { z0: number; z1: number; part: Part }
/**
 * A cabinet between a back path and a front path (same point count, same
 * direction) from z0 to z1. The front face carries `faces` (screens) and is
 * `body` elsewhere; back, top, bottom and ends are `body`.
 */
function cabinet(back: P2[], front: P2[], z0: number, z1: number, faces: Face[], body = frame) {
  const n = back.length
  const cuts = [...new Set([z0, z1, ...faces.flatMap((f) => [f.z0, f.z1])])].sort((a, b) => a - b)
  for (let i = 0; i < n - 1; i++) {
    const out: V3 = [front[i][0] + front[i + 1][0] - back[i][0] - back[i + 1][0], front[i][1] + front[i + 1][1] - back[i][1] - back[i + 1][1], 0]
    for (let k = 0; k < cuts.length - 1; k++) {
      const a = cuts[k], b = cuts[k + 1]
      const part = faces.find((f) => f.z0 <= a + 1e-6 && f.z1 >= b - 1e-6)?.part ?? body
      quadOut(part, [front[i][0], front[i][1], a], [front[i + 1][0], front[i + 1][1], a], [front[i + 1][0], front[i + 1][1], b], [front[i][0], front[i][1], b], out)
    }
    const inn: V3 = [-out[0], -out[1], 0]
    quadOut(body, [back[i][0], back[i][1], z0], [back[i + 1][0], back[i + 1][1], z0], [back[i + 1][0], back[i + 1][1], z1], [back[i][0], back[i][1], z1], inn)
    quadOut(body, [back[i][0], back[i][1], z1], [back[i + 1][0], back[i + 1][1], z1], [front[i + 1][0], front[i + 1][1], z1], [front[i][0], front[i][1], z1], [0, 0, 1])
    quadOut(body, [back[i][0], back[i][1], z0], [back[i + 1][0], back[i + 1][1], z0], [front[i + 1][0], front[i + 1][1], z0], [front[i][0], front[i][1], z0], [0, 0, -1])
  }
  for (const [i, j] of [[0, 1], [n - 1, n - 2]]) {
    const d = norm2([back[i][0] - back[j][0], back[i][1] - back[j][1]])
    quadOut(body, [back[i][0], back[i][1], z0], [front[i][0], front[i][1], z0], [front[i][0], front[i][1], z1], [back[i][0], back[i][1], z1], [d[0], d[1], 0])
  }
}

/** A plain box. */
function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
  cabinet([[x0, y0], [x0, y1]], [[x1, y0], [x1, y1]], z0, z1, [], p)
}

/**
 * The outline polyline `pts` (walked with the building on its right)
 * offset `d` outward, each joint rounded with radius `r` in `k` steps.
 * Paths with the same pts and k have matching points.
 */
function offsetPath(pts: P2[], d: number, r: number, k = 6): P2[] {
  const dirs = pts.slice(1).map((p, i) => norm2([p[0] - pts[i][0], p[1] - pts[i][1]]))
  const nrm = dirs.map(([x, y]): P2 => [-y, x]) // left = outside
  const line = (i: number, p: P2): P2 => [p[0] + nrm[i][0] * d, p[1] + nrm[i][1] * d]
  const out: P2[] = [line(0, pts[0])]
  for (let j = 1; j < pts.length - 1; j++) {
    const a = dirs[j - 1], b = dirs[j]
    const phi = Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1])))
    // the mitre point of the two offset lines
    const m: P2 = [pts[j][0] + (nrm[j - 1][0] + nrm[j][0]) / (1 + Math.cos(phi)) * d, pts[j][1] + (nrm[j - 1][1] + nrm[j][1]) / (1 + Math.cos(phi)) * d]
    const t = r * Math.tan(phi / 2)
    const t1: P2 = [m[0] - a[0] * t, m[1] - a[1] * t]
    const c: P2 = [t1[0] - nrm[j - 1][0] * r, t1[1] - nrm[j - 1][1] * r]
    const s0 = Math.atan2(t1[1] - c[1], t1[0] - c[0])
    for (let i = 0; i <= k; i++) {
      const s = s0 - (phi * i) / k // a right turn runs clockwise
      out.push([c[0] + r * Math.cos(s), c[1] + r * Math.sin(s)])
    }
  }
  out.push(line(pts.length - 2, pts[pts.length - 1]))
  return out
}

// ------------------------------------------------------------ the GMA corner
const U44: P2 = [0.9778, -0.2095]
const V1: P2 = [0, 30.64], V2: P2 = [3.05, 31.43]
const corner = (y0: number, len44: number): P2[] => [[0, y0], V1, V2, [V2[0] + U44[0] * len44, V2[1] + U44[1] * len44]]
const BACK = 0.3

{
  // the double ticker, 4.6-7.4 m, and the green upper ticker, 11.6-13 m
  const pts = corner(8, 10)
  const b = offsetPath(pts, BACK, 0.2), f = offsetPath(pts, 2.4, 3.2)
  cabinet(b, f, 4.6, 7.4, [{ z0: 6.1, z1: 7.25, part: blue }, { z0: 4.75, z1: 5.95, part: amber }])
  cabinet(b, f, 11.6, 13.0, [{ z0: 11.72, z1: 12.88, part: green }])
  // the studio bay between them: glazing on a slightly shallower front
  const fb = offsetPath(pts, 2.0, 2.8)
  cabinet(b, fb, 7.4, 11.6, [{ z0: 8.1, z1: 11.0, part: win }])
  // the shopfront fascia under the tickers, and the dark clad piers that
  // carry the corner down to the pavement (p3): at each end and the chamfer
  cabinet(b, offsetPath(pts, 1.0, 1.0), 4.0, 4.6, [])
  const pier = (a: P2, c: P2) => cabinet(offsetPath([a, c], BACK, 0), offsetPath([a, c], 0.9, 0), 0, 4.0, [])
  pier([0, 8], [0, 9])
  pier([V2[0] + U44[0] * 9, V2[1] + U44[1] * 9], [V2[0] + U44[0] * 10, V2[1] + U44[1] * 10])
  pier(V1, V2)
}
{
  // the banded LED wall, 13-20 m: five 1.2 m bands with recessed grooves.
  // Green bars on the Broadway end (y 6-16), blue round the corner.
  const pts = corner(16, 10)
  const b = offsetPath(pts, BACK, 0.2), f = offsetPath(pts, 1.4, 2.6), g = offsetPath(pts, 1.1, 2.3)
  const bs: P2[] = [[-BACK, 6], [-BACK, 16]], fs: P2[] = [[-1.4, 6], [-1.4, 16]], gs: P2[] = [[-1.1, 6], [-1.1, 16]]
  for (let i = 0; i < 5; i++) {
    const z0 = 13.0 + i * 1.45
    cabinet(b, f, z0, z0 + 1.2, [{ z0, z1: z0 + 1.2, part: blue }])
    cabinet(bs, fs, z0, z0 + 1.2, [{ z0, z1: z0 + 1.2, part: green }])
    if (i < 4) {
      cabinet(b, g, z0 + 1.2, z0 + 1.45, [])
      cabinet(bs, gs, z0 + 1.2, z0 + 1.45, [])
    }
  }
  // the cap over the wall
  cabinet(offsetPath(pts, BACK, 0.2), offsetPath(pts, 1.5, 2.7), 20.0, 20.3, [])
  cabinet([[-BACK, 6], [-BACK, 16]], [[-1.5, 6], [-1.5, 16]], 20.0, 20.3, [])
}

// ------------------------------------------------------------ Broadway screens
/** A flat screen hung on the Broadway front, y0 (south) to y1 (north). */
function broadwayScreen(y0: number, y1: number, z0: number, z1: number, faces: Face[]) {
  cabinet([[-BACK, y0], [-BACK, y1]], [[-BACK - 0.8, y0], [-BACK - 0.8, y1]], z0, z1, faces)
}
// mid-block screen (blue in e42)
broadwayScreen(-11, 5, 11.5, 20, [{ z0: 11.8, z1: 19.7, part: blue }])
// the big screen toward 43rd Street, its caption band black
broadwayScreen(-30.2, -13, 12.5, 24.8, [{ z0: 14.4, z1: 24.5, part: amber }])

// ------------------------------------------------------------ on the roof
{
  // the billboard: straight along x = 6.7, then curving east round the
  // tower's north-west corner (lidar), face 31-44 m, toward Broadway
  const R = 7, cx = 6.7 + R, cy = 15
  const facePath: P2[] = [[6.7, -1]]
  for (let i = 0; i <= 6; i++) {
    const s = Math.PI - (Math.PI * 0.45 * i) / 6
    facePath.push([cx + R * Math.cos(s), cy + R * Math.sin(s)])
  }
  const backPath = facePath.map(([x, y], i): P2 => {
    if (i === 0) return [x + 0.8, y]
    const s = Math.atan2(y - cy, x - cx)
    return [cx + (R - 0.8) * Math.cos(s), cy + (R - 0.8) * Math.sin(s)]
  })
  cabinet(backPath, facePath, 31, 44, [{ z0: 31.3, z1: 43.7, part: vinyl }])
  // legs and the catwalk under it
  for (const [x, y] of [backPath[0], [7.5, 6], [7.5, 13], backPath[4], backPath[7]] as P2[]) box(frame, x - 0.25, y - 0.25, HOST_H, x + 0.25, y + 0.25, 31)
  box(frame, 5.2, -1, 30.4, 7.5, 15, 30.8)
  box(frame, 4.9, -1, 30.8, 5.1, 15, 31.6) // the floodlight rail
}
{
  // the small corner screen at 43rd Street: its face to Broadway, a red
  // side to 43rd Street, standing on the base roof
  const x0 = 5.5, y0 = -31.2, y1 = -23.4
  cabinet([[x0 + 1, y0 + 1], [x0 + 1, y1]], [[x0, y0 + 1], [x0, y1]], 28, 38, [{ z0: 28.3, z1: 37.7, part: amber }])
  cabinet([[x0, y0 + 1], [x0 + 4, y0 + 1]], [[x0, y0], [x0 + 4, y0]], 28, 38, [{ z0: 28.3, z1: 37.7, part: amber }])
  for (const y of [y0 + 0.5, y1 - 0.5]) box(frame, x0 + 0.2, y - 0.25, HOST_H, x0 + 0.8, y + 0.25, 28)
  box(frame, x0 + 3.2, y0 + 0.2, HOST_H, x0 + 3.8, y0 + 0.8, 28)
}

// ------------------------------------------------------------ checks and output
const parts = [
  { part: frame, material: finish('sign-frame', 0x4a4f57) },
  { part: blue, material: finish('neon-gma-blue', 0x2f72d8) },
  { part: green, material: finish('neon-gma-green', 0x5fce4a) },
  { part: amber, material: finish('neon-ticker-amber', 0xf08c2a) },
  {
    part: vinyl,
    // printed vinyl, not a screen: unlit by name, washed warm at night by
    // the floodlights on the rail under it, brightest near the lamps
    material: {
      ...finish('billboard-vinyl', 0xcfc6b6),
      floodlight: (p: V3, n: V3) => (Math.hypot(n[0], n[1]) > 0.5 ? 1 - 0.45 * Math.min(1, Math.max(0, (p[2] - 31.3) / 12.4)) : 0),
    },
  },
  { part: win, material: PALETTE.window },
]

/** Distance from p to the host outline, negative inside it. */
function outlineDistance(p: P2): number {
  let inside = false, best = Infinity
  for (let i = 0, j = HOST.length - 1; i < HOST.length; j = i++) {
    const [ax, ay] = HOST[j], [bx, by] = HOST[i]
    if ((ay > p[1]) !== (by > p[1]) && p[0] < ((bx - ax) * (p[1] - ay)) / (by - ay) + ax) inside = !inside
    const dx = bx - ax, dy = by - ay, t = Math.max(0, Math.min(1, ((p[0] - ax) * dx + (p[1] - ay) * dy) / (dx * dx + dy * dy)))
    best = Math.min(best, Math.hypot(p[0] - ax - t * dx, p[1] - ay - t * dy))
  }
  return inside ? -best : best
}
let nearest = Infinity
for (const { part } of parts)
  for (let i = 0; i < part.pos.length; i += 3) {
    const [x, h, yNeg] = [part.pos[i], part.pos[i + 1], part.pos[i + 2]]
    if (h < HOST_H - 1e-6) nearest = Math.min(nearest, outlineDistance([x, -yNeg]))
  }
if (nearest < 0.2 - 1e-6) throw new Error(`a sign under the host's height is ${nearest.toFixed(2)} m from its outline`)

const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
let top = 0
for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) top = Math.max(top, part.pos[i])
const glb = writeGlb('1500 Broadway signs', parts, {
  license: 'CC0-1.0', bearing: 16.51, elevation: 0, height: top,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: [],
})
if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-1500-broadway-signs.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${top.toFixed(1)} m; nearest sign under ${HOST_H} m is ${nearest.toFixed(2)} m outside the host outline`)
