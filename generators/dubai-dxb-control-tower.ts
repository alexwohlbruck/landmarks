/**
 * Dubai International Airport (DXB), air traffic control tower and the
 * Concourse B-C connector it stands in: procedural, CC0-1.0, no textures.
 *
 *   bun generators/dubai-dxb-control-tower.ts
 *
 * Writes models/dubai-dxb-control-tower.glb (low) and
 * models/dubai-dxb-control-tower.detail.glb (detail: the frame's diagonal
 * braces and more rings, rounder sections, the antenna's lattice).
 *
 * What makes it the DXB tower
 * - A round shaft between two big curved fins on opposite sides of it, in
 *   the plane of the concourses: each fin a pointed lens that springs from
 *   the foot, bows out to its widest a little under half way up and closes
 *   in under the cab, tied to the shaft by horizontal struts and X braces.
 *   Seen across the concourses the pair reads as a dhow's sail (crucially
 *   2007 and Ahmedn97 2012, both from the apron side); seen along them the
 *   fins are edge-on.
 * - The cab, white and pale grey in two tiers: a flared underside and a
 *   wide lower ring, then the cab's white base band, the dark glass and the
 *   roof disc, with the antenna mast on top.
 * - At its foot, the Concourse B-C connector (way/385965965, tagged
 *   man_made=tower): a teal-glazed block 55 m square under a white top
 *   band, joining Concourse C's barrel and Concourse B's vault.
 *
 * Frame: x along the concourses (to bearing 120.65 deg), y to the
 * north-east, z up, metres; placed at bearing 30.65, the same as
 * dubai-dxb-terminal-3. Anchor: the area centroid of way/385965965, lng
 * 55.3575999, lat 25.250642. The tower stands on OSM's "ATC Tower" node
 * (node/4481230343), 1.9 m west and 6.8 m north of the anchor in this frame.
 *
 * Numbers
 * - Height: Wikipedia gives an "87-metre-tall" tower; the batch notes say
 *   about 92 m. Drawn with the cab roof at 80 m and the antenna to 92 m,
 *   which puts the cab, frame and mast in the proportions of Simon_sees'
 *   photos. Measured from crucially's and Ahmedn97's photos, scaled by
 *   that height: shaft 8.4 m across; fins 17 m apart (outer edges) at the
 *   foot, 29 m at their widest at about 42% of the height, 16 m where
 *   they close under the cab at 70 m, members about 2.6 m deep; the wide
 *   ring 18.4 m across at 70-72 m, the glass from 74.6 to 78.2 m, the roof
 *   disc 17.6 m across.
 * - Connector block 15 m, a grey base, a teal-grey glass band and a white
 *   top band: from crucially's photo; its 55 m square plan is OSM's.
 * - Footprint: OSM way/385965965 (ODbL).
 *
 * Colours: the fins and braces pale grey, the cab white; the shaft grey (it
 * has carried painted advertising wraps, navy and gold in 2022, which are
 * not drawn); the cab glass and the connector's glass as in the photos.
 * Night: the cab glass is `window` and glows; the connector's teal glass
 * glows too.
 *
 * Sources (evidence)
 * - OSM way/385965965, node/4481230343.
 * - Wikipedia, "Dubai International Airport", Control tower.
 * - "Dubai Airport Control Tower", Simon_sees, CC BY 2.0, 2022:
 *   https://www.flickr.com/photos/39551170@N02/52060264803
 * - "Dubai Airport control tower", crucially, CC BY-SA 2.0, 2007:
 *   https://www.flickr.com/photos/47737664@N00/732252495
 * - "Emirates Terminal 3.jpg", Ahmedn97, CC BY-SA 3.0, 2012:
 *   https://commons.wikimedia.org/wiki/File:Emirates_Terminal_3.jpg
 * - "Dubai Airport Trip 2009 215.jpg", MoHasanie, CC BY 3.0:
 *   https://commons.wikimedia.org/wiki/File:Dubai_Airport_Trip_2009_215.jpg
 * - "1 Dubai International Airport Terminal 3.jpg", EditQ, CC0, 2023:
 *   https://commons.wikimedia.org/wiki/File:1_Dubai_International_Airport_Terminal_3.jpg
 *
 * Look-only: Elmar Bajora's "DXB Tower" and GothPhil's "ATC Tower, Dubai"
 * (Flickr, NC/ND).
 *
 * Doubts
 * - The 87 m against ~92 m; whether 87 m is to the cab roof or the mast.
 * - Only two fins: every photo shows the pair side-on or close to it; no
 *   photo looks along the concourses to show them edge-on.
 */
import { Part, type V3 } from './mesh'
import { cap, clean, walls, type XY } from './clt-terminal'
import { finish, windowVariant } from './palette'
import { DXB, bar, oquad, writeModel } from './dubai-dxb-terminal-3'

const ID = 'dubai-dxb-control-tower'
const BEARING = 30.65
const CONNECTOR: XY[] = [[-27.88, -26.97], [27.01, -27.52], [27.88, 27.02], [4.91, 27.17], [-6.64, 27.29], [-27.01, 27.56]]
const TX = -1.93, TY = 6.83

/** A smooth round frustum band about the tower's axis. */
function drum(p: Part, r0: number, r1: number, z0: number, z1: number, seg: number, top = false, bottom = false) {
  const slope = Math.atan2(r0 - r1, z1 - z0)
  for (let i = 0; i < seg; i++) {
    const a = (i / seg) * 2 * Math.PI, b = ((i + 1) / seg) * 2 * Math.PI
    const P = (r: number, t: number, z: number): V3 => [TX + r * Math.cos(t), TY + r * Math.sin(t), z]
    const N = (t: number): V3 => [Math.cos(t) * Math.cos(slope), Math.sin(t) * Math.cos(slope), Math.sin(slope)]
    p.tri(P(r0, a, z0), P(r0, b, z0), P(r1, b, z1), undefined, undefined, undefined, [N(a), N(b), N(b)])
    p.tri(P(r0, a, z0), P(r1, b, z1), P(r1, a, z1), undefined, undefined, undefined, [N(a), N(b), N(a)])
    if (top) p.tri([TX, TY, z1], P(r1, a, z1), P(r1, b, z1))
    if (bottom) p.tri([TX, TY, z0], P(r0, b, z0), P(r0, a, z0))
  }
}

/** The fins' outer edge, its distance from the axis at height z: a pointed lens, widest at ~42%. */
const finR = (z: number) => {
  const t = Math.min(1, Math.max(0, z / 70))
  return 8.6 + (8.0 - 8.6) * t + 6.0 * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.85)), 1.1)
}
const SHAFT = 4.2

/**
 * One fin: a curved member of real section (w across the fin's plane, d
 * radially) following finR on side `sx` (+1 or -1 along x), from the foot
 * to under the cab.
 */
function fin(p: Part, sx: number, n: number, w = 2.8, d = 2.6) {
  const z0 = 0, z1 = 70
  const pts = Array.from({ length: n + 1 }, (_, i) => z0 + ((z1 - z0) * i) / n)
  const C = (z: number, dr: number, dy: number): V3 => [TX + sx * (finR(z) + dr), TY + dy, z]
  for (let i = 0; i < n; i++) {
    const za = pts[i], zb = pts[i + 1]
    const outer = [C(za, d / 2, -w / 2), C(za, d / 2, w / 2), C(zb, d / 2, w / 2), C(zb, d / 2, -w / 2)]
    const inner = [C(za, -d / 2, -w / 2), C(za, -d / 2, w / 2), C(zb, -d / 2, w / 2), C(zb, -d / 2, -w / 2)]
    oquad(p, outer[0], outer[1], outer[2], outer[3], [sx, 0, 0])
    oquad(p, inner[0], inner[1], inner[2], inner[3], [-sx, 0, 0])
    oquad(p, outer[0], outer[3], inner[3], inner[0], [0, -1, 0])
    oquad(p, outer[1], outer[2], inner[2], inner[1], [0, 1, 0])
  }
  // the foot
  oquad(p, C(0, d / 2, -w / 2), C(0, d / 2, w / 2), C(0, -d / 2, w / 2), C(0, -d / 2, -w / 2), [0, 0, -1])
}

function build(detail: boolean) {
  const frame = new Part(), white = new Part(), shaft = new Part(), cab = new Part(), glassBlock = new Part(), roof = new Part()
  const SEG = detail ? 24 : 16

  // --- the connector block at the foot: grey base, teal-grey glass band, white top
  {
    const r = clean(CONNECTOR, 0.3)
    walls(roof, r, 0, 4)
    walls(glassBlock, r, 4, 12.5)
    walls(white, r, 12.5, 15)
    cap(roof, r, 15)
  }
  // --- the shaft
  drum(shaft, SHAFT, SHAFT, 0, 66, SEG)
  // --- the cab, in two tiers: a wide lower ring, then the glazed cab under its roof disc
  drum(white, SHAFT, 7.6, 64, 69, SEG)              // the underside flaring out where the fins close in
  drum(white, 7.6, 7.6, 69, 70.4, SEG)              // the lower tier
  drum(white, 9.2, 9.2, 70.4, 72.2, SEG, true, true) // its wide ring
  drum(white, 7.0, 7.0, 72.2, 74.6, SEG)            // the cab's white base band
  drum(cab, 7.6, 7.3, 74.6, 78.2, SEG)              // the glass, leaning in a little
  drum(white, 8.8, 8.8, 78.2, 80, SEG, true, true)  // the roof disc
  drum(white, 3.2, 3.0, 80, 81.6, detail ? 12 : 8, true) // plant drum
  // --- the antenna mast
  if (detail) {
    for (const [dx, dy] of [[-0.6, -0.6], [0.6, -0.6], [0.6, 0.6], [-0.6, 0.6]]) bar(roof, [TX + dx, TY + dy, 81.6], [TX + dx * 0.4, TY + dy * 0.4, 92], 0.18, 0.18)
    for (let z = 83; z < 92; z += 1.8) {
      const k = 1 - ((z - 81.6) / 10.4) * 0.6
      const q = [[-0.6, -0.6], [0.6, -0.6], [0.6, 0.6], [-0.6, 0.6]].map(([dx, dy]) => [TX + dx * k, TY + dy * k, z] as V3)
      for (let i = 0; i < 4; i++) bar(roof, q[i], q[(i + 1) % 4], 0.12, 0.12)
    }
  } else bar(roof, [TX, TY, 81.6], [TX, TY, 92], 0.9, 0.9)

  // --- the two fins along the concourse axis, with horizontal ties and X braces to the shaft
  const levels = detail ? [9, 18, 27, 36, 45, 54, 62] : [14, 28, 42, 56]
  for (const sx of [1, -1]) {
    fin(frame, sx, detail ? 28 : 14)
    const at = (z: number, r: number): V3 => [TX + sx * r, TY, z]
    for (const z of levels) bar(frame, at(z, SHAFT - 0.2), at(z, finR(z) - 1.2), 1.0, 1.0)
    const lv = [2, ...levels, 66]
    for (let j = 0; j < lv.length - 1; j++) {
      const za = lv[j], zb = lv[j + 1]
      const w = detail ? 0.6 : 0.8
      bar(frame, at(za, SHAFT - 0.2), at(zb, finR(zb) - 1.2), w, w)
      bar(frame, at(za, finR(za) - 1.2), at(zb, SHAFT - 0.2), w, w)
    }
  }

  return [
    { part: white, material: finish('dxb-white', 0xeceeee) },
    { part: frame, material: DXB.silver },
    { part: shaft, material: finish('dxb-shaft', 0xbcc3c8) },
    { part: cab, material: DXB.window },
    { part: glassBlock, material: windowVariant(2, 0x7a9ea4) },
    { part: roof, material: DXB.roof },
  ]
}

if (import.meta.main) {
  const extras = { bearing: BEARING, elevation: 0 }
  await writeModel(`${ID}.glb`, 'Dubai International Airport control tower', build(false), extras, 5000, 250_000)
  await writeModel(`${ID}.detail.glb`, 'Dubai International Airport control tower', build(true), extras, 40_000, 1_500_000)
}
