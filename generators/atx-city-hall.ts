/**
 * Austin City Hall, 301 West 2nd Street, Austin (2004, Antoine Predock with
 * Cotera + Reed) — original procedural geometry, CC0-1.0.
 * bun generators/atx-city-hall.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 17.9: Austin's street grid (2nd Street along the
 * north side, Cesar Chavez along the south). Anchor = area centroid of OSM
 * way/204413180 ("Austin City Hall", 4 levels), -97.7473118, 30.2648316.
 *
 * Identity (from the photos): the "armadillo" — a broad upper body of
 * copper-clad (brown) storeys in staggered, cantilevered bands with long
 * dark ribbon windows, under a thin copper lid that overhangs it and runs
 * out north in a sharp pointed canopy over 2nd Street; a Texas limestone
 * base; on the south, toward Cesar Chavez and the lake, limestone
 * terraces stepping down to the plaza, the entrance under a steel canopy,
 * and a tilted dark grid (photovoltaic/glass) canopy over the stairs.
 *
 * Evidence and numbers:
 *  - lidar: USGS 3DEP USGS_LPC_TX_Central_B1_2017 (2017 flight), 1 m grid
 *    read in the frame. The ground falls from ~7 m (2nd Street) to ~5.7 m
 *    (Cesar Chavez) over the grid's ground_min; y = 0 is the south side;
 *    every height here = lidar - 5.7. Measured: the lid 21.6 at the west,
 *    falling east to 17.5 (drawn as one tilted plane); the north canopy's
 *    spike ~14.5-15 out to its tip at y 42; the south-west terrace 11 m,
 *    the middle terrace 9, the entrance block 10-12, the south-east wing 7.
 *  - OSM: the outline way/204413180 (the limestone base); the roof ways
 *    way/1039387743 and way/1039387745 (the lid, west and east), and
 *    way/1039387744 (the pointed north canopy, a triangle to y 42.4); the
 *    small roofs way/1039387746, 747, 750, 756, 757 and 764 (the south
 *    canopies and terraces).
 *  - published: completed 2004, Antoine Predock; limestone and copper
 *    cladding (Wikipedia, "Austin City Hall").
 *  - estimated from the photos: the base 6 m; the copper bands' stagger
 *    (1.5 m) and ribbon windows; the lid's 1.5 m overhang; the tilted grid
 *    canopy's slope.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  bar31 "Austin August 2019 31 (Austin City Hall).jpg", Michael Barera,
 *        CC BY-SA 4.0 (from the south, Cesar Chavez)
 *        https://commons.wikimedia.org/wiki/File:Austin_August_2019_31_(Austin_City_Hall).jpg
 *  bar30 "Austin August 2019 30 (Austin City Hall).jpg", Michael Barera,
 *        CC BY-SA 4.0 https://commons.wikimedia.org/wiki/File:Austin_August_2019_30_(Austin_City_Hall).jpg
 *  wtm   "AustinTXCityHall.JPG", WhisperToMe, public domain (the copper
 *        bands from the north-east) https://commons.wikimedia.org/wiki/File:AustinTXCityHall.JPG
 *  fitz  "Austin City Hall Front.JPG", M.Fitzsimmons, CC BY-SA 3.0 (the
 *        south entrance and the grid canopy) https://commons.wikimedia.org/wiki/File:Austin_City_Hall_Front.JPG
 *  fitz2 "Austin City Hall Aug2010.JPG", M.Fitzsimmons, CC BY-SA 3.0 (the
 *        pointed canopy) https://commons.wikimedia.org/wiki/File:Austin_City_Hall_Aug2010.JPG
 *  ajay  "Austin City Hall (54987519110).jpg", ajay_suresh, CC BY 4.0 (the
 *        south entrance) https://commons.wikimedia.org/wiki/File:Austin_City_Hall_(54987519110).jpg
 *  kuhn  "Austintexascityhall 3715x2651.JPG", Kevinkuhn, CC BY-SA 3.0
 *        https://commons.wikimedia.org/wiki/File:Austintexascityhall_3715x2651.JPG
 * No look-only sources. No commercial imagery.
 *
 * The lid is drawn as two tilted halves with grey tops (NAIP, USGS: two
 * grey roof planes split by a dark diagonal valley, roof way/1039387744),
 * and the valley as dark glass; the body follows the base's north part,
 * since the lidar's upper storeys reach its north-east corner.
 *
 * Doubts: the copper bands' stagger is drawn regular; each lid half is one
 * plane (the real roof folds); the south's dark glass shard and the folded
 * grid shell are simplified to one tilted grid canopy over the stairs; the
 * west (Guadalupe) side has no close photo.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, ccw, offset, box, edgePanels, capPoly, at, save, type XY } from './atl-flatiron-building'

// OSM way/204413180, the limestone base.
const BASE: XY[] = ccw([[-35.06, 25.35], [-33.5, 17.72], [-29.52, -1.86], [-26.91, -14.44], [-25.29, -22.34], [-23.24, -32.33], [-22.82, -34.34], [-6.42, -33.95], [-2.64, -22.57], [12.99, -22.76], [12.77, -39.52], [22.27, -39.69], [26.94, -22.97], [28.56, -17.2], [42.1, -16.72], [43.07, -14.55], [46.16, -3.12], [47.49, 29.08], [16.62, 25.94], [12.22, 25.75]])
// The copper upper body: the lid's outline (roof ways 1039387743/745) less the overhang.
const SPIKE: XY[] = ccw([[10.5, 24.5], [15.2, 24.5], [14.22, 42.42]])

const lidZ = (x: number) => 19.9 - 0.05 * x // the lid's top (lidar 21.6 west, 17.5 east)
const BASE_TOP = 6

const stone = new Part(), copper = new Part(), win = new Part(), glass = new Part(), roof = new Part(), steel = new Part()

// ── The limestone base and the south terraces ──
prism(stone, BASE, 0, BASE_TOP, roof, 0.4)
edgePanels(win, [47.49, 29.08], [16.62, 25.94], 1.2, 4.6, { group: 3.4, gap: 0.2, bay: 5, pier: 0.8, margin: 2 })
edgePanels(win, [12.22, 25.75], [-35.06, 25.35], 1.2, 4.6, { group: 3.4, gap: 0.2, bay: 5, pier: 0.8, margin: 2 })
prism(stone, ccw([[-26.9, -14.4], [-25.3, -22.3], [-23.2, -32.3], [-22.8, -34.3], [-6.4, -33.95], [-6, -10], [-27.5, -10]]), 0, 11, stone, 0.45)
box(stone, -6, 12.9, -22.6, -10, 0, 9, stone, 0.4)
box(stone, 13, 21, -24, -9, 0, 7, roof, 0.4) // the stairs' block under the grid canopy
box(stone, 21, 42.5, -17, -6, 0, 7, stone, 0.4)
// entrance glazing on the terrace fronts
edgePanels(win, [-2.64, -22.57], [12.99, -22.76], 1, 5, { group: 4, gap: 0.2, bay: 4, pier: 0.5, margin: 1 })
edgePanels(win, [-22.8, -34.3], [-6.4, -33.95], 1, 5, { group: 4, gap: 0.2, bay: 4, pier: 0.6, margin: 1.5 })
edgePanels(win, [21, -17], [42.5, -17], 1.2, 5.2, { group: 4, gap: 0.2, bay: 5, pier: 0.8, margin: 1.5 })

// ── The copper upper body: staggered bands with ribbon windows ──
// the body follows the base's north part (the lidar's upper storeys reach its north-east corner)
const body: XY[] = ccw([[-27.8, -10], [44.3, -10], [46.16, -3.12], [47.49, 29.08], [16.62, 25.94], [12.22, 25.75], [-35.06, 25.35], [-33.5, 17.72], [-29.52, -1.86]])
const BANDS: [number, number, number][] = [[BASE_TOP, 9.8, 0.6], [9.8, 13.4, -0.8], [13.4, 99, 0.2]] // z0, z1, extra inset
for (const [z0, z1, ins] of BANDS) {
  const ring = offset(body, -ins)
  const top = Math.min(z1, 16.5)
  prism(copper, ring, z0, top, copper, 0)
  // a ribbon window round each band
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    edgePanels(win, a, b, z0 + 0.9, z0 + 2.9, { group: 2.0, gap: 0, bay: 12, pier: 0.6, margin: 1.2, min: 5 })
  }
}
// the top band runs up to the lid
{
  const ring = offset(body, -0.2)
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n]
    copper.quad([a[0], a[1], 16.5], [b[0], b[1], 16.5], [b[0], b[1], lidZ(b[0]) - 1.2], [a[0], a[1], lidZ(a[0]) - 1.2])
  }
}

// ── The copper lid: a thin tilted slab overhanging the body ──
function tiltedSlab(p: Part, ring: XY[], zt: (x: number) => number, th: number, topPart: Part) {
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n]
    p.quad([a[0], a[1], zt(a[0]) - th], [b[0], b[1], zt(b[0]) - th], [b[0], b[1], zt(b[0])], [a[0], a[1], zt(a[0])])
  }
  // top and underside via a flat cap lifted onto the plane
  const up = new Part(), dn = new Part()
  capPoly(up, ring, 0, true)
  capPoly(dn, ring, 0, false)
  const lift = (src: Part, dst: Part, dz: number) => {
    for (let k = 0; k < src.pos.length; k += 9) {
      const v: V3[] = [0, 1, 2].map((j) => {
        const x = src.pos[k + 3 * j], z = -src.pos[k + 3 * j + 2]
        return [x, z, zt(x) + dz] as V3
      })
      dst.tri(v[0], v[1], v[2])
    }
  }
  lift(up, topPart, 0)
  lift(dn, p, -th)
}
// two lid halves (NAIP: two grey roof planes), split by the dark glass
// valley of roof way/1039387744 that runs out north as the spike
const LID_W: XY[] = ccw([[-33.85, 27.4], [-34.15, 23.81], [-27.12, -10.32], [-0.37, -10.3], [11.75, 28.21]])
const LID_E: XY[] = ccw([[13.08, 26.34], [13.16, -7.85], [21.26, -6.88], [48.11, -3.62], [47.49, 29.08], [16.62, 25.94]])
tiltedSlab(copper, offset(LID_W, 1.2), lidZ, 1.3, roof)
tiltedSlab(copper, offset(LID_E, 1.2), lidZ, 1.3, roof)
capPoly(glass, offset(body, -0.2), 16.7, true) // the valley's glass, seen between the lid halves
// the pointed north canopy, lower than the lid, out over 2nd Street
tiltedSlab(copper, SPIKE, (x) => 15 + 0 * x, 0.9, copper)

// ── The tilted grid canopy over the south stairs ──
{
  const x0 = 13, x1 = 22.5, y0 = -39, y1 = -8.5, z0 = 3, z1 = 16
  const zt = (y: number) => z0 + ((y - y0) / (y1 - y0)) * (z1 - z0)
  const nrm: V3 = [0, -(z1 - z0), y1 - y0]
  const l = Math.hypot(nrm[1], nrm[2]), n: V3 = [0, nrm[1] / l, nrm[2] / l], nd: V3 = [0, -n[1], -n[2]]
  const q = (p: Part, a: V3, b: V3, c: V3, d: V3, nn: V3) => { p.tri(a, b, c, undefined, undefined, undefined, [nn, nn, nn]); p.tri(a, c, d, undefined, undefined, undefined, [nn, nn, nn]) }
  q(glass, [x0, y0, zt(y0)], [x1, y0, zt(y0)], [x1, y1, zt(y1)], [x0, y1, zt(y1)], n)
  q(glass, [x0, y0, zt(y0) - 0.3], [x1, y0, zt(y0) - 0.3], [x1, y1, zt(y1) - 0.3], [x0, y1, zt(y1) - 0.3], nd)
  // its steel frame: edge beams and posts
  for (const x of [x0, x1]) {
    for (let k = 0; k < 12; k++) {
      const ya = y0 + (k / 12) * (y1 - y0), yb = y0 + ((k + 1) / 12) * (y1 - y0)
      box(steel, x - 0.25, x + 0.25, ya, yb + 0.01, zt(ya) - 0.6, zt(yb) + 0.1, steel, 0)
    }
  }
  for (const [x, y] of [[x0, y0 + 1], [x1, y0 + 1]]) box(steel, x - 0.25, x + 0.25, y - 0.25, y + 0.25, 0, zt(y) - 0.3, steel, 0)
  // the entrance canopy: a thin steel slab on the south face of the middle terrace
  box(steel, -4, 12.5, -26, -22.6, 5.2, 5.6, steel, 0, true)
}
void at

if (import.meta.main) {
  await save('atx-city-hall', 'Austin City Hall', [
    { part: stone, material: finish('limestone', 0xdcc9a4) },
    { part: copper, material: finish('copper-brown', 0x957b6c) },
    { part: win, material: PALETTE.window },
    { part: glass, material: { ...PALETTE.glass, color: 0x6f7c88 } },
    { part: steel, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
  ], {
    bearing: 17.9, height: lidZ(-35),
    replaces: ['way/204413180', 'way/1039387743', 'way/1039387744', 'way/1039387745', 'way/1039387746', 'way/1039387747', 'way/1039387750', 'way/1039387756', 'way/1039387757', 'way/1039387764'],
  }, 5000)
}
