/**
 * 40 Wall Street (the Trump Building, former Bank of Manhattan Trust
 * Building) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-40-wall-street.ts
 *
 * Map frame: x = model east, y = model north (Pine Street; Wall Street is
 * the south front), z up, metres. Placed at bearing 37°, the axis of the
 * tower's walls. Anchor: area centroid of the OSM outline way/278042253.
 *
 * Evidence
 * - OSM way/278042253 (outline) and its 29 building:part ways, which map the
 *   Wall Street wings, the light court on the west side, the stepped north
 *   block on Pine Street, the tower's three top stages (212/225/230 m) and the
 *   pyramid (way/286057109) and its lantern; plans used as drawn, squared to
 *   the 37° axis.
 * - Lidar: USGS 3DEP NY_NewYorkCity, flown 2017, resampled into the model
 *   frame (heights above the lowest ground by the outline, on Wall Street).
 *   Shaft top 206–216 m, a 224–229 m stage, the pyramid's eaves ~230 m and
 *   its lantern to ~275 m; the Wall Street wings 73–80 m either side of a
 *   34 m entrance block; the main base 96–98 m and a 122–130 m ring round
 *   the tower; the Pine Street block stepping 109/100/87/74/47 m; a 30 m
 *   light court on the west side. These replace OSM's heights where they
 *   differ (the lidar sits ~3 m north-east of OSM here, so heights were read
 *   by matching edges).
 * - Published: 283 m to the spire, 71 floors, H. Craig Severance with Yasuo
 *   Matsui, 1930 (Wikipedia; NYC LPC 1995). Buff limestone and brick; a
 *   steep green copper pyramid with dormers, stone gables rising into it at
 *   the middle of each face, a lantern and a spire.
 * - Photos (Wikimedia Commons): /tmp/city/nyc/work/nyc-40-wall-street/photos/credits.txt
 *
 * Estimated: the gables' width and height and the dormer count (photos);
 * the lantern's size (lidar peak, photos); the panel rhythm.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Facade, massing, prism, chamferRect, finishModel, quadN, unit } from './nyc-570-lexington'
import { type Box, centred, mast } from './nyc-70-pine'

const stone = new Part(), win = new Part(), roof = new Part(), copper = new Part()

const fac: Facade = { bay: 3.2, ratio: 0.46, floor: 3.6, group: 2, spandrel: 2.0, sill: 1.6, head: 1.8, ground: 8, minLength: 3.2, margin: 0.4 }

// Tower centre (OSM parts 286057124/091/073/109 share it within 0.2 m).
const cx = 6.9, cy = -2.65
const C = (a: number, h: number) => centred(cx, cy, a, a, h)
const boxes: Box[] = [
  // Wall Street front: wings either side of the low entrance block.
  [-15.2, -32.5, 0.5, -26.0, 77], [0.5, -32.5, 15.0, -26.0, 34], [15.0, -32.5, 30.0, -26.0, 77],
  // The main base and the ring round the tower.
  [-15.2, -26.0, 30.0, -13.1, 97], [-12.4, -20.6, 27.0, -18.8, 122],
  [-12.4, -18.9, 27.0, -13.1, 130], [20.9, -18.9, 27.3, 11.8, 130], [24.7, -13.1, 30.0, -10.1, 97],
  // The light court on the west side and the tower's west wing beside it.
  [-15.1, -13.1, -7.4, 5.5, 30], [-12.2, 5.5, -7.4, 11.5, 126],
  // Pine Street block, stepping down to the north.
  [-39.4, 5.2, 24.7, 17.0, 100], [-39.4, 5.2, -12.2, 14.1, 108], [-7.6, 11.5, 15.5, 16.8, 109],
  [-39.4, 16.3, 24.7, 20.2, 87], [-39.4, 19.1, 24.7, 22.6, 74],
  [-39.5, 21.9, -5.0, 27.6, 47], [-5.0, 22.2, 11.4, 27.0, 33], [11.4, 22.4, 24.5, 26.6, 47],
  // Tower shaft and its top stage.
  C(14.2, 212), C(13.2, 226),
]
massing({ wall: stone, win, roof, boxes, facade: fac, bevel: 0.45 })

// The attic below the pyramid: chamfered corners carrying pinnacles.
const A = 12.4, EAVE = 231
prism({ wall: stone, win, roof: copper, ring: chamferRect(cx - A, cy - A, cx + A, cy + A, 2.2), z0: 226, z1: EAVE, facade: { ...fac, group: 1, sill: 1.0, head: 1.0 }, bevel: 0.35 })
for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
  const px = cx + sx * (A - 1.0), py = cy + sy * (A - 1.0)
  prism({ wall: stone, win: null, roof: stone, ring: chamferRect(px - 0.9, py - 0.9, px + 0.9, py + 0.9, 0.3), z0: EAVE, z1: EAVE + 4, facade: null, bevel: 0.2 })
  mast(stone, px, py, EAVE + 4, EAVE + 6.5, 0.7, 4)
}

// The copper pyramid: from the eaves (half-width 10.9 m, inside the
// parapet) to a lantern at 265 m; steep (about 75°), as tall as it is wide
// and a quarter more, measured on the Governors Island photo.
const P0 = 10.9, PTOP = 265, P1 = 2.3
const ring = (a: number, z: number): V3[] => [[cx - a, cy - a, z], [cx + a, cy - a, z], [cx + a, cy + a, z], [cx - a, cy + a, z]]
copper.loft([ring(P0, EAVE), ring(P1, PTOP)])
copper.cap(ring(P1, PTOP), true)
const slope = (P0 - P1) / (PTOP - EAVE) // horizontal in per metre up
const half = (z: number) => P0 - (z - EAVE) * slope

// Stone gables rising into the pyramid at the middle of each face, as in the
// photos: a wall 8 m wide flush with the attic, with a pointed top and a
// window panel pair, and the roof's own pitch behind.
for (let f = 0; f < 4; f++) {
  const ang = (f * Math.PI) / 2
  const ox = Math.cos(ang), oy = Math.sin(ang) // outward normal
  const tx = -oy, ty = ox // along the face
  const at = (s: number, d: number, z: number): V3 => [cx + ox * d + tx * s, cy + oy * d + ty * s, z]
  const w = 4.2, z1 = EAVE + 9, z2 = EAVE + 13
  const d0 = A, d1 = half(z1) - 1.2
  // Front face (flush with the attic wall), a pentagon.
  const front = [at(-w, d0, EAVE), at(w, d0, EAVE), at(w, d0, z1), at(0, d0, z2), at(-w, d0, z1)]
  const n: V3 = [ox, oy, 0]
  quadN(stone, front[0], front[1], front[2], front[4], [n, n, n, n])
  stone.tri(front[4], front[2], front[3])
  // Sides back into the roof.
  for (const s of [-w, w]) {
    const a = at(s, d0, EAVE), b = at(s, d1, EAVE), c = at(s, d1, z1), d = at(s, d0, z1)
    if (s < 0) quadN(stone, b, a, d, c); else quadN(stone, a, b, c, d)
  }
  // Its own pitched stone cap, running back into the pyramid.
  const r0 = at(-w - 0.2, d0 + 0.2, z1 - 0.2), r1 = at(w + 0.2, d0 + 0.2, z1 - 0.2), r2 = at(0, d0 + 0.2, z2 + 0.1)
  const b0 = at(-w - 0.2, d1, z1 - 0.2), b1 = at(w + 0.2, d1, z1 - 0.2), b2 = at(0, d1, z2 + 0.1)
  quadN(stone, r2, r0, b0, b2); quadN(stone, r1, r2, b2, b1)
  // Windows on the gable.
  for (const s of [-1.6, 1.6]) {
    const v = (ss: number, z: number) => at(ss, d0 + 0.05, z)
    win.quad(v(s - 0.9, EAVE + 1.2), v(s + 0.9, EAVE + 1.2), v(s + 0.9, EAVE + 7.4), v(s - 0.9, EAVE + 7.4))
  }
  // Dormers on the pyramid face either side of the gable, two tiers.
  for (const [z, offs] of [[EAVE + 8, [-7.0, 7.0]], [EAVE + 17, [-3.4, 3.4]], [EAVE + 24, [0]]] as [number, number[]][]) {
    for (const s of offs) dormer(at, s, z)
  }
}

/** A small copper dormer standing on the pyramid face: a box with a window and a pitched cap. */
function dormer(at: (s: number, d: number, z: number) => V3, s: number, z: number) {
  const w = 0.9, h = 2.2, dz = 1.6
  const d0 = half(z) + 0.6, dBack = half(z + h) - 0.4
  const n = unit([at(0, 1, 0)[0] - at(0, 0, 0)[0], at(0, 1, 0)[1] - at(0, 0, 0)[1], 0])
  quadN(copper, at(s - w, d0, z), at(s + w, d0, z), at(s + w, d0, z + h), at(s - w, d0, z + h), [n, n, n, n])
  win.quad(at(s - w * 0.55, d0 + 0.05, z + 0.3), at(s + w * 0.55, d0 + 0.05, z + 0.3), at(s + w * 0.55, d0 + 0.05, z + h - 0.3), at(s - w * 0.55, d0 + 0.05, z + h - 0.3))
  for (const e of [-w, w]) {
    const a = at(s + e, d0, z), b = at(s + e, dBack, z), c = at(s + e, dBack, z + h), d = at(s + e, d0, z + h)
    if (e < 0) quadN(copper, b, a, d, c); else quadN(copper, a, b, c, d)
  }
  const t = at(s, d0 + 0.15, z + h + dz * 0.6), tb = at(s, dBack, z + h + dz * 0.6)
  quadN(copper, at(s - w - 0.15, d0 + 0.15, z + h), at(s - w - 0.15, dBack, z + h), tb, t)
  quadN(copper, at(s + w + 0.15, dBack, z + h), at(s + w + 0.15, d0 + 0.15, z + h), t, tb)
  copper.tri(at(s - w, d0, z + h), at(s + w, d0, z + h), at(s, d0, z + h + dz * 0.6 - 0.1))
}

// Lantern: two stacked octagonal copper drums with tall openings, a cone,
// and the needle spire (283 m).
const oct = (r: number): XY[] => Array.from({ length: 8 }, (_, i) => [cx + r * Math.cos((i + 0.5) * Math.PI / 4), cy + r * Math.sin((i + 0.5) * Math.PI / 4)])
function drum(r: number, z0: number, z1: number, open: number) {
  prism({ wall: copper, win: null, roof: copper, ring: oct(r), z0, z1, facade: null, bevel: 0.15 })
  const o = oct(r)
  for (let i = 0; i < 8; i++) {
    const a = o[i], b = o[(i + 1) % 8], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
    const n = unit([mx - cx, my - cy, 0]), L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const tx = (b[0] - a[0]) / L, ty = (b[1] - a[1]) / L, wv = L * open / 2
    const v = (s: number, z: number): V3 => [mx + tx * s + n[0] * 0.05, my + ty * s + n[1] * 0.05, z]
    win.quad(v(-wv, z0 + 1), v(wv, z0 + 1), v(wv, z1 - 1), v(-wv, z1 - 1))
  }
}
drum(2.2, PTOP, 270, 0.4)
drum(1.6, 270, 274, 0.35)
{
  const o = oct(1.4).map(([x, y]) => [x, y, 274] as V3)
  for (let i = 0; i < 8; i++) copper.tri(o[i], o[(i + 1) % 8], [cx, cy, 280])
}
mast(copper, cx, cy, 279, 283, 0.35)

// Verdigris cornice round the eaves.
prism({ wall: copper, win: null, roof: copper, ring: chamferRect(cx - A - 0.3, cy - A - 0.3, cx + A + 0.3, cy + A + 0.3, 2.3), z0: EAVE - 1.4, z1: EAVE + 0.2, facade: null, bevel: 0.25 })

finishModel('40 Wall Street', 'nyc-40-wall-street', [
  { part: stone, material: finish('wall-limestone', 0xe6dccb) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: copper, material: finish('wall-copper', 0x86b6a4) },
], { bearing: 37, osm: 'way/278042253', height: 283 }, 6500)
