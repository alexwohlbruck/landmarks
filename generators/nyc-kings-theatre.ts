/**
 * Kings Theatre (Loew's Kings), 1027 Flatbush Avenue — procedural,
 * CC0-1.0, no textures.
 * bun generators/nyc-kings-theatre.ts
 *
 * Map frame: x east, y north, z up, metres, turned to the street grid.
 * Anchor: area centroid of the OSM outline way/250132955 (-73.9573208,
 * 40.6459848). Flatbush Avenue and the outline's walls run 2.9° anticlockwise
 * of north, so the model is placed at bearing 357.1 and built square; the
 * OSM coordinates are turned into that frame below.
 *
 * What it is: Rapp & Rapp's 1929 Loew's movie palace, restored in 2015. A
 * narrow lobby wing runs in from Flatbush Avenue behind a cream terracotta
 * front: plain piers with urn finials either side of a tall round-headed
 * panel of gilt-orange terracotta ornament, the top stepping up to an arched
 * crest, with a big projecting marquee over the doors. Behind it, the huge
 * auditorium: plain brick walls round a fan-shaped plan, and a low roof
 * whose ridges run up to the stage house in the north-east corner.
 *
 * Covers and replaces: way/250132955, the only building there.
 *
 * Evidence
 * - OSM (measured): the outline: the lobby wing 21 × 14 m on Flatbush
 *   Avenue, the auditorium's fan behind it, about 65 × 70 m; height=25.2;
 *   wikidata Q6413028.
 * - USGS lidar NY_NewYorkCity (2017). y = 0 is the lowest ground, 11.0 m;
 *   Flatbush Avenue is at about the same level. Measured above it: the
 *   front's arched crest 20.5–21 m, its side piers about 19 m; the lobby
 *   wing roof 14.0–15.0 m; the auditorium eaves 12–17 m (lowest to the
 *   south), its roof rising to 24.8 m near the middle; the stage house
 *   25.5–26 m over x 10–32, y 12–36; a 12 m service block east of it.
 * - USGS NAIP orthophoto (public domain): the auditorium's rounded plan,
 *   its light grey roof with ridges running to the stage house.
 * - Photos (Wikimedia Commons): "Lowes Kings Flatbush front jeh.JPG"
 *   (Jim.henderson, public domain) and "Kings Theatre Flatbush finished
 *   jeh.jpg" (Jim.henderson, CC BY 3.0), the front square on before and
 *   after the restoration; "Loew's Kings Theater 1027 Flatbush Avenue.jpg"
 *   (Beyond My Ken, CC BY-SA 4.0), the front and the brick lobby wing from
 *   the south-west; "Kings Theatre Exterior 01.jpg" (Alexandra Silversmith,
 *   CC BY-SA 4.0) and "Kings Brooklyn Oct2014.jpg" (Keith, CC BY 3.0), the
 *   crest and marquee; "Kings Theater (16318457690).jpg" (Maxim Pierre,
 *   CC BY 2.0), the marquee.
 * - From the photos, scaled to the lidar: the frontispiece across the whole
 *   15 m frontage, its pylons 2.6 m wide to 19 m with urn finials, the wide
 *   segmental crest springing at 18 m and rising to the lidar's 20.6 m; the
 *   recessed round-headed ornament panel about 7.6 m wide (half the front),
 *   7.4–17.4 m, in orange terracotta; the marquee 4.0–6.5 m, 3 m deep, dark
 *   with gilt rims (drawn in the entrance material so it glows at night),
 *   with a blade sign at each end to 10.4 m; the cream terracotta front and
 *   the darker red-brown brick of the lobby wing and auditorium.
 *
 * Estimated: the auditorium roof as a low tent from the eaves to a peak
 * over (4, 6), where the lidar is highest; the eaves height (15 m) where
 * the lidar varies; the stage house's exact outline.
 *
 * Doubts: the outline's small dent at the south-east corner (around
 * x 18–34, y -11 to -20) is closed over, so the walls run straight across a
 * 6 m high service yard there. No licensed photo shows the auditorium's walls or roof from the
 * side or above other than NAIP; they are drawn plain. The marquee's
 * lettering is left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, rect } from './dc-white-house'
import { pslab, pwalls, saveModel, type XY } from './nyc-dime-savings-bank'

const terra = new Part(), orn = new Part(), brick = new Part(), roof = new Part(), win = new Part(), door = new Part()

// OSM way/250132955 (metres from the anchor, north-up), turned 2.9° into the frame.
const B = (-2.9 * Math.PI) / 180
const turn = ([x, y]: XY): XY => [x * Math.cos(B) - y * Math.sin(B), x * Math.sin(B) + y * Math.cos(B)]
const OSM: XY[] = ([
  [-29.14, -32.09], [-30.10, -13.10], [-51.29, -14.16], [-52.00, -0.26], [-36.44, 0.52], [-36.66, 5.11], [-27.89, 5.55],
  [-22.70, 5.82], [-22.97, 11.22], [-11.60, 23.69], [-1.34, 28.60], [4.58, 30.00], [9.63, 33.92], [9.41, 38.24],
  [25.52, 39.05], [34.67, 31.31], [35.79, 9.30], [31.04, 5.68], [30.36, 0.28], [26.49, -11.10], [18.54, -19.51],
  [33.53, -18.35], [34.22, -27.21], [15.26, -28.67], [-11.89, -30.76], [-14.89, -30.99],
] as XY[]).map(turn)

// Heights above the lowest ground (lidar).
const LOBBY = 14.3, EAVES = 15.0, PEAK = 24.8, STAGE = 25.8, CREST = 20.6, PIER = 19.0
const XF = OSM[2][0] // the Flatbush Avenue front, about -51.9
const YF0 = OSM[2][1], YF1 = OSM[3][1] // its ends, about -12.8 and 2.4
const FW = YF1 - YF0

// ---- The lobby wing: brick, from the front back to the auditorium.
const lobby: XY[] = [OSM[1], OSM[2], OSM[3], OSM[4], OSM[5], OSM[6]]
pslab(brick, lobby, 0, LOBBY, 0.25, roof)

// ---- The auditorium: brick walls round the rest of the outline, under a
// low tent roof whose ridges run to a peak near the stage house.
// The outline's 9 m dent at (18.5, -19.5) on the south-east is closed over:
// the tent roof needs a ring every point of which the peak can see.
const aud: XY[] = [OSM[0], OSM[1], OSM[6], ...OSM.slice(7, 20), ...OSM.slice(21)]
pwalls(brick, aud, 0, EAVES)
{
  const apex: V3 = [4, 6, PEAK]
  // counter-clockwise ring for upward-facing fan triangles
  let area = 0
  for (let i = 0; i < aud.length; i++) { const a = aud[i], b = aud[(i + 1) % aud.length]; area += a[0] * b[1] - b[0] * a[1] }
  const ring = area > 0 ? aud : [...aud].reverse()
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    roof.tri([a[0], a[1], EAVES], [b[0], b[1], EAVES], apex)
  }
  // a parapet lip round the eaves
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy)
    if (L < 0.5) continue
    const nx = dy / L * 0.3, ny = -dx / L * 0.3
    brick.quad([a[0], a[1], EAVES], [b[0], b[1], EAVES], [b[0] - nx, b[1] - ny, EAVES + 0.8], [a[0] - nx, a[1] - ny, EAVES + 0.8])
  }
}
// The stage house in the north-east.
cbox(brick, rect(10, 31, 13, 36), 0, STAGE, { b: 0.3, top: roof })
// ---- The Flatbush Avenue front: a cream terracotta frontispiece across the
// whole frontage, facing west (-x).
{
  const x0 = XF - 0.6, x1 = XF + 1.6 // its face stands a little out from the lobby wall
  const yc = (YF0 + YF1) / 2, PIERW = 2.6
  const SHOULDER = 18.0 // where the crest springs, at the piers' inner edges
  // the wall of the frontispiece
  cbox(terra, rect(x0, x1, YF0, YF1), 0, SHOULDER, { b: 0.2 })
  // the flanking pylons, standing proud, carrying the urn finials
  for (const [y0, y1] of [[YF0 - 0.2, YF0 + PIERW], [YF1 - PIERW, YF1 + 0.2]]) {
    cbox(terra, rect(x0 - 0.6, x1, y0, y1), 0, PIER, { b: 0.25 })
    const c = (y0 + y1) / 2
    // urn: a plinth, a body, a lid
    cbox(terra, rect(x0 - 0.3, x0 + 1.3, c - 0.8, c + 0.8), PIER, PIER + 0.5, { b: 0.1 })
    cbox(terra, rect(x0 - 0.1, x0 + 1.1, c - 0.6, c + 0.6), PIER + 0.5, PIER + 1.9, { b: 0.3 })
    cbox(terra, rect(x0 + 0.2, x0 + 0.8, c - 0.3, c + 0.3), PIER + 1.9, PIER + 2.5, { b: 0.15 })
  }
  // the crest: a wide segmental arch between the pylons, from the shoulders up to the lidar's 20.6 m
  const half = (YF1 - YF0) / 2 - PIERW + 0.2, rise = CREST - SHOULDER
  const rr = (half * half + rise * rise) / (2 * rise), zc0 = CREST - rr, amax = Math.asin(half / rr)
  const segs = 10
  const at = (k: number): [number, number] => { const a = -amax + (2 * amax * k) / segs; return [yc + rr * Math.sin(a), zc0 + rr * Math.cos(a)] }
  for (let k = 0; k < segs; k++) {
    const [ya, za] = at(k), [yb, zb] = at(k + 1)
    terra.quad([x0, yb, SHOULDER], [x0, ya, SHOULDER], [x0, ya, za], [x0, yb, zb]) // front
    terra.quad([x1, ya, SHOULDER], [x1, yb, SHOULDER], [x1, yb, zb], [x1, ya, za]) // back
    terra.quad([x0, ya, za], [x1, ya, za], [x1, yb, zb], [x0, yb, zb]) // top
  }
  // the great arched panel of orange terracotta ornament, about half the width
  const pw = 3.8, pz0 = 7.4, pz1 = 13.6, xp = x0 - 0.05
  orn.quad([xp, yc + pw, pz0], [xp, yc - pw, pz0], [xp, yc - pw, pz1], [xp, yc + pw, pz1])
  for (let k = 0; k < 12; k++) {
    const t0 = (k / 12) * Math.PI, t1 = ((k + 1) / 12) * Math.PI
    orn.tri([xp, yc, pz1], [xp, yc + pw * Math.cos(t1), pz1 + pw * Math.sin(t1)], [xp, yc + pw * Math.cos(t0), pz1 + pw * Math.sin(t0)])
  }
  // its frame: a raised terracotta band round the arch, so the panel reads recessed
  const fw = 0.55, fo = 0.35
  for (const sg of [-1, 1]) cbox(terra, rect(x0 - fo, x0, sg < 0 ? yc - pw - fw : yc + pw, sg < 0 ? yc - pw : yc + pw + fw), pz0 - 0.6, pz1, { b: 0.08 })
  for (let k = 0; k < 12; k++) {
    const t0 = (k / 12) * Math.PI, t1 = ((k + 1) / 12) * Math.PI
    const r0 = pw, r1 = pw + fw
    const Q = (t: number, r: number, x: number): V3 => [x, yc + r * Math.cos(t), pz1 + r * Math.sin(t)]
    terra.quad(Q(t1, r0, x0 - fo), Q(t0, r0, x0 - fo), Q(t0, r1, x0 - fo), Q(t1, r1, x0 - fo))
    terra.quad(Q(t0, r1, x0 - fo), Q(t0, r1, x0), Q(t1, r1, x0), Q(t1, r1, x0 - fo))
  }
  // small windows in the pylons
  for (const y of [YF0 + 1.2, YF1 - 1.2]) {
    win.quad([x0 - 0.66, y + 0.45, 9.5], [x0 - 0.66, y - 0.45, 9.5], [x0 - 0.66, y - 0.45, 13.0], [x0 - 0.66, y + 0.45, 13.0])
  }
  // doors under the marquee
  door.quad([x0 - 0.05, YF1 - 1.5, 0.2], [x0 - 0.05, YF0 + 1.5, 0.2], [x0 - 0.05, YF0 + 1.5, 3.6], [x0 - 0.05, YF1 - 1.5, 3.6])
  // the marquee: a dark lit box 3 m deep and 2.5 m tall across most of the
  // front, gilt-rimmed top and bottom, with a blade sign standing at each end
  const MZ0 = 4.0, MZ1 = 6.5, MX = x0 - 0.6 - 3.0, my0 = YF0 + 0.6, my1 = YF1 - 0.6
  cbox(door, rect(MX, x0 - 0.6, my0, my1), MZ0, MZ1, { bottom: true, top: false })
  cbox(orn, rect(MX - 0.15, x0 - 0.6, my0 - 0.15, my1 + 0.15), MZ1, MZ1 + 0.35, { b: 0.1, bottom: true })
  cbox(orn, rect(MX - 0.15, x0 - 0.6, my0 - 0.15, my1 + 0.15), MZ0 - 0.3, MZ0, { b: 0.05, bottom: true })
  for (const y of [my0 + 0.4, my1 - 0.4]) {
    cbox(door, rect(MX - 0.4, MX + 1.6, y - 0.3, y + 0.3), MZ1 + 0.35, 10.0, { b: 0.1, top: false })
    cbox(orn, rect(MX - 0.5, MX + 1.7, y - 0.4, y + 0.4), 10.0, 10.4, { b: 0.1, bottom: true })
  }
}

await saveModel('nyc-kings-theatre', 'Kings Theatre', [
  { part: terra, material: finish('kings-terracotta', 0xeadcc2) },
  { part: orn, material: finish('kings-ornament', 0xd8a465) },
  { part: brick, material: finish('kings-brick', 0xa9765f) },
  { part: roof, material: finish('kings-roof', 0xc4c7c6) },
  { part: win, material: PALETTE.window },
  { part: door, material: { ...PALETTE.entrance, color: 0x4e4540 } },
], { source: 'generators/nyc-kings-theatre.ts', bearing: 357.1, osm: 'way/250132955', height: STAGE }, 5000)
