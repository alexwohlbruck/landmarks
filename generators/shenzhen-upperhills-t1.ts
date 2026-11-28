/**
 * Shum Yip Upperhills Tower 1 (深业上城大厦1), Futian, Shenzhen — original
 * procedural geometry, CC0-1.0.
 * bun generators/shenzhen-upperhills-t1.ts   (writes the low model and the detail LOD)
 *
 * Frame: bearing 0 (the OSM outline is square to north). Origin = the
 * centroid of the outline way/684494961 (114.0667574 E, 22.5595427 N), on the
 * ground; y = 0 is the street; elevation 0.
 *
 * Form, as read from OSM and the photos:
 * - a plain square glass prism, 55.5 m a side, straight to the top, with a
 *   re-entrant notch (3 m) down each corner, the notches stopping ~3 m short
 *   of the faces' parapets so the four faces read as separate slabs at the top;
 * - dark louvred plant openings, ~20 m wide and ~12 m tall, divided by vertical
 *   bars: three on the north face (~191, 261, 320 m), two on the east face
 *   (~193, 320 m), and the same pairs assumed on the south and west faces;
 * - a red Shum Yip sign high on the south face (lit at night);
 * - the roof: flat, behind a parapet, at 388.1 m.
 * T2 (way/684494959, 299 m) and the mall (way/684494957) are separate OSM
 * buildings on separate plots, so they are left to the map.
 *
 * Evidence
 * - OSM (API map call, fetched 2026-11-27): outline way/684494961
 *   (building=commercial, height 388.1, 80 levels, name 深业上城大厦1). No
 *   Wikidata tag on it; the Commons photos and CTBUH name it Shum Yip
 *   Upperhills Tower 1.
 * - Published: 388.1 m, 80 floors, completed 2020 (CTBUH; Wikipedia "Shum Yip
 *   Upperhills").
 * - Photos (Wikimedia Commons, daylight, finished tower):
 *   "SZ 深圳 Shenzhen 福田 Futian 筍崗西路 Sungang West Road 筆架山公園 Bijiashan Park
 *   Passover footbridge view UpperHills November 2023 R12S 06.jpg", Husyewl
 *   Lmsiuyu RAUOM, CC0, camera 455 m east-south-east (Commons camera
 *   location): the east and south faces, the corner notches, the louvres, the
 *   parapet, the sign, colour;
 *   https://commons.wikimedia.org/wiki/File:SZ_%E6%B7%B1%E5%9C%B3_Shenzhen_%E7%A6%8F%E7%94%B0_Futian_%E7%AD%8D%E5%B4%97%E8%A5%BF%E8%B7%AF_Sungang_West_Road_%E7%AD%86%E6%9E%B6%E5%B1%B1%E5%85%AC%E5%9C%92_Bijiashan_Park_Passover_footbridge_view_UpperHills_November_2023_R12S_06.jpg
 *   "Shum Yip Upperhills Towers2020.jpg", K3liu, CC BY-SA 4.0, camera 1.45 km
 *   north-north-west (small): the north face with three louvres, proportions;
 *   https://commons.wikimedia.org/wiki/File:Shum_Yip_Upperhills_Towers2020.jpg
 * - No lidar, NAIP or Mapillary here (batch notes).
 * - Look-only references: none.
 *
 * Numbers
 * - Published: 388.1 m. Measured (OSM): the 55.5 m square.
 * - Measured (photos, scaled by the face width and the height): louvre heights
 *   as above (±10 m), louvre size.
 * - Estimated: notch 3 m; parapet 3 m; sign size; colours sampled from the
 *   Husyewl photo (#4e6082–#5d7394 glass, pulled to #5b7393; louvres #485b7d,
 *   drawn #4b5562).
 *
 * Doubts
 * - Only two licensed photos of the finished tower; the west face is unseen
 *   (louvres assumed like the east face), and the south face only obliquely.
 * - The louvre heights carry ±10 m.
 * - The real curtain wall has a fine grid, left to colour; this is a plain box
 *   and is drawn as one, without padding.
 *
 * Night: the curtain wall glows as windows; the sign glows red.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { face, saveLods, type Layer } from './auckland-sky-tower'
import { capRing, type XY } from './wuhan-greenland-center'

const TOP = 388.1
const H = 27.75 // half side
const NOTCH = 3
const NOTCH_TOP = TOP - 3 // the corner notches stop under the faces' parapets
const ROOF = TOP - 2.4

type Set = { glass: Part; louvre: Part; frame: Part; roof: Part; sign: Part }
const mk = (): Set => ({ glass: new Part(), louvre: new Part(), frame: new Part(), roof: new Part(), sign: new Part() })

// faces: outward normal, louvre heights (north/east/south/west)
const FACES: { n: XY; louvres: number[] }[] = [
  { n: [0, 1], louvres: [191, 261, 320] },
  { n: [1, 0], louvres: [193, 320] },
  { n: [0, -1], louvres: [193, 320] },
  { n: [-1, 0], louvres: [193, 320] },
]

function build(s: Set, d: boolean) {
  // each face: a slab from corner notch to corner notch, the full height
  for (const f of FACES) {
    const n = f.n, t: XY = [-n[1], n[0]] // CCW along the face
    const P = (u: number, o: number, z: number): V3 => [n[0] * (H + o) + t[0] * u, n[1] * (H + o) + t[1] * u, z]
    const a = -(H - NOTCH), b = H - NOTCH
    face(s.glass, [P(a, 0, 0), P(b, 0, 0), P(b, 0, TOP), P(a, 0, TOP)], [n[0], n[1], 0])
    // the notch: two inner walls, from the face's edge in to the core, up to NOTCH_TOP; above, the
    // face slabs' ends close the gap
    const Q = (u: number, o: number, z: number) => P(u, o, z)
    // notch side wall at u = b (facing +t), from o = 0 back to o = -NOTCH
    face(s.louvre, [Q(b, -NOTCH, 0), Q(b, 0, 0), Q(b, 0, NOTCH_TOP), Q(b, -NOTCH, NOTCH_TOP)], [t[0], t[1], 0])
    // the slab's end above the notch
    face(s.glass, [Q(b, -NOTCH, NOTCH_TOP), Q(b, 0, NOTCH_TOP), Q(b, 0, TOP), Q(b, -NOTCH, TOP)], [t[0], t[1], 0])
    // the notch's other wall is the neighbouring face's slab end, drawn in its own loop:
    face(s.louvre, [Q(a, 0, 0), Q(a, -NOTCH, 0), Q(a, -NOTCH, NOTCH_TOP), Q(a, 0, NOTCH_TOP)], [-t[0], -t[1], 0])
    face(s.glass, [Q(a, 0, NOTCH_TOP), Q(a, -NOTCH, NOTCH_TOP), Q(a, -NOTCH, TOP), Q(a, 0, TOP)], [-t[0], -t[1], 0])
    // the notch's roof (a small cap at NOTCH_TOP over the corner square)
    face(s.roof, [Q(b, -NOTCH, NOTCH_TOP), Q(H, -NOTCH, NOTCH_TOP), Q(H, 0, NOTCH_TOP), Q(b, 0, NOTCH_TOP)], [0, 0, 1])
    // parapet top and inner face
    face(s.frame, [P(a, 0, TOP), P(b, 0, TOP), P(b, -0.8, TOP), P(a, -0.8, TOP)], [0, 0, 1])
    face(s.frame, [P(a, -0.8, TOP), P(b, -0.8, TOP), P(b, -0.8, ROOF), P(a, -0.8, ROOF)], [-n[0], -n[1], 0])

    // louvres: a dark panel recessed 0.8 m behind a frame of vertical bars
    for (const z of f.louvres) {
      const w = 10, z0 = z - 6, z1 = z + 6
      const off = 0.05
      face(s.louvre, [P(-w, off, z0), P(w, off, z0), P(w, off, z1), P(-w, off, z1)], [n[0], n[1], 0])
      // sill and head ledges
      for (const [zz, up] of [[z0 - 0.5, true], [z1, false]] as [number, boolean][]) {
        face(s.frame, [P(-w - 0.3, 0.5, zz), P(w + 0.3, 0.5, zz), P(w + 0.3, 0.5, zz + 0.5), P(-w - 0.3, 0.5, zz + 0.5)], [n[0], n[1], 0])
        face(s.frame, up ? [P(-w - 0.3, 0, zz + 0.5), P(-w - 0.3, 0.5, zz + 0.5), P(w + 0.3, 0.5, zz + 0.5), P(w + 0.3, 0, zz + 0.5)] : [P(-w - 0.3, 0, zz + 0.5), P(-w - 0.3, 0.5, zz + 0.5), P(w + 0.3, 0.5, zz + 0.5), P(w + 0.3, 0, zz + 0.5)], [0, 0, 1])
      }
      // vertical bars: 8 in the detail LOD (as the photo), 4 in the low model
      const nb = d ? 8 : 4
      for (let k = 0; k <= nb; k++) {
        const u = -w + (2 * w * k) / nb, bw = d ? 0.35 : 0.6
        face(s.frame, [P(u - bw, 0.45, z0), P(u + bw, 0.45, z0), P(u + bw, 0.45, z1), P(u - bw, 0.45, z1)], [n[0], n[1], 0])
        face(s.frame, [P(u - bw, 0.05, z0), P(u - bw, 0.45, z0), P(u - bw, 0.45, z1), P(u - bw, 0.05, z1)], [-t[0], -t[1], 0])
        face(s.frame, [P(u + bw, 0.45, z0), P(u + bw, 0.05, z0), P(u + bw, 0.05, z1), P(u + bw, 0.45, z1)], [t[0], t[1], 0])
      }
    }
    // the sign: on the south face, near the top, left of centre (as seen from the south)
    if (n[1] === -1) {
      const u0 = -(H - NOTCH) + 3, u1 = u0 + 4.5, z0 = TOP - 40, z1 = TOP - 12
      face(s.sign, [P(u0, 0.25, z0), P(u1, 0.25, z0), P(u1, 0.25, z1), P(u0, 0.25, z1)], [n[0], n[1], 0])
      face(s.sign, [P(u0, 0, z0), P(u0, 0.25, z0), P(u0, 0.25, z1), P(u0, 0, z1)], [-t[0], -t[1], 0])
      face(s.sign, [P(u1, 0.25, z0), P(u1, 0, z0), P(u1, 0, z1), P(u1, 0.25, z1)], [t[0], t[1], 0])
    }
  }
  // roof inside the parapet (a cross-shaped plan: the square less the corner notches)
  const r = H - 0.8, c = H - NOTCH
  const plan: XY[] = [[r, -c], [r, c], [c, c], [c, r], [-c, r], [-c, c], [-r, c], [-r, -c], [-c, -c], [-c, -r], [c, -r], [c, -c]]
  capRing(s.roof, plan.map((p) => [p[0], p[1], ROOF] as V3), true)
}

// ---- Materials and output ----------------------------------------------------------------------

const GLASS: MaterialSpec = { ...PALETTE.window, color: 0x5b7393 }
const LOUVRE: MaterialSpec = finish('upperhills-louvre', 0x4b5562, 0.7)
const FRAME: MaterialSpec = finish('upperhills-frame', 0xbcc6d0, 0.45)
const ROOFM: MaterialSpec = PALETTE.roof
const SIGN: MaterialSpec = finish('neon-upperhills-red', 0xc8463c, 0.5)

const low = mk(), det = mk()
build(low, false)
build(det, true)
const layers = (s: Set): Layer[] => [
  { part: s.glass, material: GLASS },
  { part: s.louvre, material: LOUVRE },
  { part: s.frame, material: FRAME },
  { part: s.roof, material: ROOFM },
  { part: s.sign, material: SIGN },
]

if (import.meta.main) {
  await saveLods('shenzhen-upperhills-t1', 'Shum Yip Upperhills Tower 1', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres, bearing 0; origin at the centroid of the OSM outline, on the street',
    bearing: 0, height: TOP,
  }, 5000)
}
