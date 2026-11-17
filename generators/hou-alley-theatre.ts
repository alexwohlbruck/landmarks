/**
 * Alley Theatre (615 Texas Avenue, 1968, Ulrich Franzen; Hubbard Theatre
 * rebuilt 2014-15), Houston — original procedural geometry, CC0-1.0.
 * bun generators/hou-alley-theatre.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Built turned to the downtown grid: catalog bearing 34.8 (the
 * block's walls run at 34.8° / 124.8°), so model +y points north-east, to
 * the Alley's garage, and -y is the Texas Avenue front. +x is Louisiana
 * Street, -x Smith Street. Anchor = the centroid of the OSM outline
 * (way/54369011), 29.7620688,-95.3653416, which sits on the lidar roof to
 * within half a metre.
 *
 * Identity, in order: the brutalist board-formed concrete "castle": nine
 * tall turrets (stair towers), each a rounded shaft under a wider round
 * head with a deep undercut, rising ~5 m over the curved concrete walls;
 * the curved entrance balcony between two turrets on Texas Avenue, with the
 * glazed lobby band over it; the curved planted balconies between the
 * turrets on Texas and Louisiana; and since 2015 the grey metal fly tower of
 * the Hubbard Theatre over the Smith Street end.
 *
 * Evidence:
 *  - plan and heights: USGS 3DEP lidar TX_Coastal_B1_2018 (flown 2018, so
 *    after the 2015 rebuild), 0.5 m grid, read in the turned frame; street
 *    ground 0.5 m above the grid minimum. Measured above the street: main
 *    roof 16.1 m; turret heads 20.8 m, ~8.5-9 m across, at (±34.5, -19),
 *    (±34.5, 20), (34, 1), (-12, ±20), (11, ±11.5); fly tower x -37.5..-23,
 *    y -13.5..14.5, 29.4 m, its long sides bowed ~1 m; planted terraces
 *    12.7 m (Texas x 15..30; Louisiana x 33..38); entrance balcony 7.8 m,
 *    the curved band over the lobby glazing 12.4 m; a triangular roof
 *    light 18.9 m at x 14..28.
 *  - OSM: outline way/54369011 (height 19, 3 levels), traced round the
 *    turrets; the walls between them bow out 1-2 m (followed here).
 *  - turret profile: scaled on Feller's 2017 front photo (tower beside the
 *    entrance, 445 px for 20.8 m): head ~5 m tall (15.8-20.8 m) over a
 *    0.8 m undercut, head ~15% wider than its shaft; near-round shafts.
 *    Lidar profiles: along the Texas front the walls between turrets are
 *    16.2 m and the heads 20.6-20.9 m, with slots to the street (0-2 m)
 *    1-2 m wide beside the turrets (x -29..-28, -16) and on the Smith side
 *    (y -14..-10, 10..14); the body is cut back there so the turrets stand
 *    clear. Kimpel's corner turret looks ~1.4x the wall only through
 *    perspective; the lidar ratio is 20.8 / 16.2.
 *  - the undercut under each turret head is a recessed neck in a darker
 *    concrete, standing for the deep shadow line every photo shows.
 *  - colour: board-formed concrete, a warm light grey: #b6a79d-#d9d0c7 in
 *    Feller's overcast photos, #bcb9b8 in Praefcke's, #929392 in Kimpel's
 *    shade; drawn #cdc7bd. Fly tower grey metal #a3a2a5 (Feller), drawn
 *    #9ea2a8. Roofs pale grey (NAIP near white), drawn #b5b9ba, a step darker so the
 *    concrete turret caps read against them at phone size.
 *
 * Photos (all evidence):
 *  - Houston_Texas_Alley_Theater_2003.jpg, Andreas Praefcke, CC BY 3.0
 *    (entrance between two turrets, before the 2015 rebuild)
 *    https://commons.wikimedia.org/wiki/File:Houston_Texas_Alley_Theater_2003.jpg
 *  - AlleyHouston.jpg, Rick Kimpel, CC BY-SA 2.0 (Texas Ave front from Smith)
 *    https://commons.wikimedia.org/wiki/File:AlleyHouston.jpg
 *    and its Flickr original https://www.flickr.com/photos/18606128@N00/219693213
 *  - "Alley Theater, Houston, Texas 1704011333", Patrick Feller, CC BY 2.0
 *    (Texas Ave front and Louisiana side from the south corner, 2017)
 *    https://www.flickr.com/photos/32345848@N07/33082040033
 *  - "Former Republic Bank Center and Alley Theater", Patrick Feller,
 *    CC BY 2.0 (Louisiana side, looking south-west)
 *    https://www.flickr.com/photos/32345848@N07/33051659934
 *  USGS NAIP for the plan. Published: 1968, Ulrich Franzen; Hubbard Theatre
 *  rebuilt 2014-15 (Wikipedia, "Alley Theatre"). No commercial imagery.
 *
 * Left out: the board-form texture, banners and posters, the planting on
 * the balconies, the entrance steps (ground), the slit windows in some
 * turrets, the sloped tops of some turret heads.
 *
 * Doubts: the back (against the garage) and the Smith Street side are not
 * in any licensed photo after 2015 and are drawn plain; the turret shafts'
 * exact plan (photos show flat faces with rounded corners, some with a
 * smaller round tower attached) is simplified to one rounded square each;
 * the fly tower's colour comes from one photo.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { cap, inset, panel, save, walls, type XY } from './chi-aon-center'

// ---------------------------------------------------------------------------
// Small kit, shared by the G5a Houston theatre models (exported).

/** Points along a circular arc from a to b bulging `sag` to the right of a→b (outward on a CCW ring); includes a, not b. */
export function arc(a: XY, b: XY, sag: number, n = 6): XY[] {
  const dx = b[0] - a[0], dy = b[1] - a[1], c = Math.hypot(dx, dy)
  if (Math.abs(sag) < 1e-6) return [a]
  const nx = dy / c, ny = -dx / c // right-hand normal
  const R = (c * c / 4 + sag * sag) / (2 * sag)
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
  const cx = mx - nx * (R - sag), cy = my - ny * (R - sag) // centre
  const a0 = Math.atan2(a[1] - cy, a[0] - cx), a1 = Math.atan2(b[1] - cy, b[0] - cx)
  let d = a1 - a0
  // go the short way round through the bulge
  while (d > Math.PI) d -= 2 * Math.PI
  while (d < -Math.PI) d += 2 * Math.PI
  const out: XY[] = []
  for (let i = 0; i < n; i++) {
    const t = a0 + d * (i / n)
    out.push([cx + Math.abs(R) * Math.cos(t), cy + Math.abs(R) * Math.sin(t)])
  }
  return out
}

/** A rounded square (superellipse) ring about (cx, cy), CCW, `seg` points at even angles. */
export function squircle(cx: number, cy: number, rx: number, ry: number, p = 3.5, seg = 16, a0 = Math.PI / 16): XY[] {
  return Array.from({ length: seg }, (_, i) => {
    const t = a0 + (i / seg) * 2 * Math.PI, c = Math.cos(t), s = Math.sin(t)
    return [cx + rx * Math.sign(c) * Math.abs(c) ** (2 / p), cy + ry * Math.sign(s) * Math.abs(s) ** (2 / p)] as XY
  })
}

/** Walls between rings at successive heights (same vertex count), smooth-shaded around. */
export function loftRings(p: Part, rings: XY[][], zs: number[], smooth = true) {
  for (let k = 0; k < rings.length - 1; k++) {
    const r0 = rings[k], r1 = rings[k + 1], n = r0.length
    const nrm = (r: XY[], i: number): V3 => {
      const a = r[(i - 1 + n) % n], b = r[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1
      return [dy / l, -dx / l, 0]
    }
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const A: V3 = [r0[i][0], r0[i][1], zs[k]], B: V3 = [r0[j][0], r0[j][1], zs[k]]
      const C: V3 = [r1[j][0], r1[j][1], zs[k + 1]], D: V3 = [r1[i][0], r1[i][1], zs[k + 1]]
      if (!smooth) { p.quad(A, B, C, D); continue }
      // the horizontal normal, tilted for a band that flares in or out
      const slope = (i: number) => {
        const dz = zs[k + 1] - zs[k], h = nrm(r0, i)
        const out = (r1[i][0] - r0[i][0]) * h[0] + (r1[i][1] - r0[i][1]) * h[1], l = Math.hypot(dz, out) || 1
        return [h[0] * dz / l, h[1] * dz / l, -out / l] as V3
      }
      p.tri(A, B, C, undefined, undefined, undefined, [slope(i), slope(j), slope(j)])
      p.tri(A, C, D, undefined, undefined, undefined, [slope(i), slope(j), slope(i)])
    }
  }
}

/** The flat ring between two rings of the same count, facing up or down. */
export function annulus(p: Part, inner: XY[], outer: XY[], z: number, up = true) {
  const n = inner.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a: V3 = [inner[i][0], inner[i][1], z], b: V3 = [inner[j][0], inner[j][1], z]
    const c: V3 = [outer[j][0], outer[j][1], z], d: V3 = [outer[i][0], outer[i][1], z]
    if (up) p.quad(d, c, b, a); else p.quad(a, b, c, d)
  }
}

// ---------------------------------------------------------------------------
// Alley Theatre

const ROOF = 16.1, HEAD = 20.8, FLY = 29.4, TERR = 12.7

function build() {
  const conc = new Part(), roof = new Part(), win = new Part(), plant = new Part(), fly = new Part()
  const door = win, shade = new Part()

  /** A block with a 0.4 m bevelled concrete top edge and a roof cap. */
  const slab = (r: XY[], z0: number, z1: number, wall = conc, bev = 0.4) => {
    walls(wall, r, z0, z1 - bev)
    const i = inset(r, bev)
    walls(wall, r, z1 - bev, z1, i)
    cap(roof, i, z1)
  }

  // ---- main body at 16.1 m: the walls between the turrets bow out ----
  // Lidar shows narrow slots down to the street beside the turrets on the
  // Texas front and the Smith side, so each turret stands clear: the body
  // stops short of them.
  const body: XY[] = [
    [-33, -16], [-28.8, -16], [-28.8, -21.0],
    ...arc([-28.8, -21.0], [-16.6, -21.0], 1.3, 6),
    [-16.6, -21.0], [-16.6, -16.5], [-7.5, -16.5], [-7.5, -16.2],
    [30, -15.2], [33, -15.2],
    [33, 21.4],
    ...arc([30, 21.4], [16, 21.4], 1.8, 6),
    [16, 21.4], [8, 21.0], [-8, 21.0], [-9, 21.4],
    ...arc([-16, 21.4], [-30, 21.4], 1.0, 6),
    [-30, 21.4], [-33, 21.4],
  ]
  slab(body, 0, ROOF)

  // ---- fly tower (2015), grey metal, long sides bowed ----
  const flyR: XY[] = [
    ...arc([-23.2, -13.6], [-23.2, 14.6], 1.0, 6), [-23.2, 14.6],
    ...arc([-37.4, 14.6], [-37.4, -13.6], 1.0, 6), [-37.4, -13.6],
  ]
  walls(fly, flyR, 0, FLY - 0.4) // its Smith Street face runs to the ground (lidar)
  walls(fly, flyR, FLY - 0.4, FLY, inset(flyR, 0.4))
  cap(roof, inset(flyR, 0.4), FLY)
  // two pale seams round it, as the panel joints in Feller's photo read
  for (const z of [21.0, 25.4]) walls(conc, inset(flyR, -0.06), z, z + 0.35)

  // ---- triangular roof light ----
  slab([[14, -5], [28, 1.5], [14, 8]], ROOF - 0.3, 18.9, conc, 0.3)

  // ---- planted balconies: a curved concrete planter slab over a deep,
  // dark recess (Feller's photos), on Texas x 15..30 and on Louisiana ----
  const planter = (r: XY[], back: XY[], edge: XY[]) => {
    walls(win, back, 0, 9.2) // the shadowed recess behind the slab
    walls(conc, r, 9.2, 11.1)
    walls(conc, r, 11.1, 11.4, inset(r, 0.3))
    cap(plant, inset(r, 0.3), 11.4)
    cap(conc, r, 9.2, false)
    // the wall above, from the balcony back to the terrace roof
    const [a, b] = edge
    conc.quad([a[0], a[1], 9.2], [b[0], b[1], 9.2], [b[0], b[1], TERR], [a[0], a[1], TERR])
  }
  planter([[15, -19.6], ...arc([16, -20.0], [29.5, -20.0], 1.6, 6), [29.5, -20.0], [30.2, -15.4], [15, -15.4]],
    [[15.5, -17.4], [29.5, -17.4], [29.5, -15.4], [15.5, -15.4]], [[15.5, -17.4], [29.5, -17.4]])
  for (const [y0, y1] of [[-15.2, -3.2], [5.2, 15.6]]) {
    planter([[33, y0], ...arc([37.6, y0], [37.6, y1], 1.0, 5), [37.6, y1], [33, y1]],
      [[33, y0], [35.4, y0], [35.4, y1], [33, y1]], [[35.4, y0], [35.4, y1]])
  }

  // ---- entrance: glazed lobby, curved balcony, glass band, curved band ----
  panel(door, [-7.5, -16.2], [30, -15.2], 0.3, 14.8, 0, 4.4, 0.05)
  const ring: XY[] = [...arc([-6.8, -16.4], [9.2, -16.4], 7.4, 10), [9.2, -16.4]]
  walls(conc, ring, 4.6, 7.8 - 0.3)
  walls(conc, ring, 7.4, 7.8, inset(ring, 0.3))
  cap(plant, inset(ring, 0.3), 7.8)
  cap(conc, ring, 4.6, false)
  // the lobby glass band over the balcony, then the upper curved band
  panel(win, [-7.5, -16.2], [30, -15.2], 0.6, 16.8, 7.8, 11.0, 0.05)
  const up: XY[] = [...arc([-4.2, -16.3], [7.4, -16.3], 3.4, 8), [7.4, -16.3]]
  walls(conc, up, 11.0, 12.4 - 0.3)
  walls(conc, up, 12.1, 12.4, inset(up, 0.3))
  cap(roof, inset(up, 0.3), 12.4)
  cap(conc, up, 11.0, false)

  // ---- turrets ----
  const turrets: [number, number, number][] = [
    // cx, cy, base
    [-34.3, -18.8, 0], [-12, -19.2, 0], [34, -19, 0],
    [-34.3, 19.6, 0], [-12, 19.8, 0], [34, 19.8, 0],
    [34, 1, 0], [11, -11.4, 0], [11, 12, ROOF - 1],
  ]
  for (const [cx, cy, z0] of turrets) {
    // shaft, a flat dark undercut 0.8 m wide, the head, a bevelled top
    // a near-round shaft from the ground, a recessed dark neck, and a 5 m
    // head (photo-scaled; its top is the lidar's 20.8 m)
    const shaft = squircle(cx, cy, 3.6, 3.6, 3)
    const head = squircle(cx, cy, 4.45, 4.45, 2.4)
    const top = squircle(cx, cy, 4.1, 4.1, 2.4)
    const neck = squircle(cx, cy, 3.0, 3.0, 3)
    loftRings(conc, [shaft, shaft], [z0, HEAD - 5.8])
    annulus(conc, neck, shaft, HEAD - 5.8, true)
    loftRings(shade, [neck, neck], [HEAD - 5.8, HEAD - 5.0])
    annulus(shade, neck, head, HEAD - 5.0, false)
    loftRings(conc, [head, head, top], [HEAD - 5.0, HEAD - 0.35, HEAD])
    cap(conc, top, HEAD) // concrete caps, so the turrets read against the roof
  }

  return [
    { part: conc, material: finish('alley-concrete', 0xcdc7bd) },
    { part: roof, material: finish('alley-roof', 0xb5b9ba) },
    { part: fly, material: finish('alley-fly-tower', 0x9ea2a8) },
    { part: win, material: PALETTE.window },
    { part: shade, material: finish('alley-concrete-shade', 0x8a8780) },
    { part: plant, material: finish('alley-planting', 0x8c9a72) },
  ]
}

if (import.meta.main) await save('hou-alley-theatre', 'Alley Theatre', [29.7620688, -95.3653416], 34.8, build())
