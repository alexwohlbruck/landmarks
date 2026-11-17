/**
 * The Opus, Dubai — original procedural geometry, CC0-1.0.
 * bun generators/dubai-opus.ts   (imports the kit from dubai-address-downtown.ts)
 *
 * Zaha Hadid Architects, completed 2020 (ME Dubai hotel, offices, residences):
 * a glass block split into two towers by a free-form void, joined by a
 * four-storey bridge at the top and a three-storey podium below.
 *
 * Frame: map frame, x east, y north, z up, metres, turned to BEARING 337, so
 * the long faces run along x; origin at the centroid of way/723560004.
 *
 * Evidence
 * - OSM way/723560004 (building=office, 21 levels, 2020; Al A'amal Street
 *   5-7): a 101 x 66 m parallelogram, its short sides leaning 10 degrees.
 *   Parts: way/1528428014 (podium, 21 m, glass), way/1528428015 and
 *   way/1528428016 (the two towers, 93 m, 21 levels), way/1528428013 (the
 *   bridge, 81-93 m, levels 18-21), which spans only the south ~26 m of the
 *   void: north of y = -7 the void is open to the sky (a U from the north).
 *   Nominatim's hit for "The Opus" is the landuse, not the building.
 * - Published (as given in the batch assignment; not re-checked): ~93 m,
 *   Zaha Hadid Architects, 2020; mirrored glass with a dotted frit. OSM's
 *   21 levels and 93 m agree.
 * - Photos:
 *   o1 "A view from the Parking", Gabby Canonizado, CC BY 2.0,
 *     https://www.flickr.com/photos/58227652@N02/41570854404 (2018, from the NNE
 *     across a car park: the two towers, the black glass of the void's inner
 *     face swelling between them);
 *   o3 "Dubai Skyline from Business Bay - Dubai, UAE", Lxs, CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:Dubai_Skyline_from_Business_Bay_-_Dubai,_UAE.jpg
 *     (one tower's corner, close: the dark gridded glass).
 * - No lidar or aerial imagery covers the UAE in the allowed sources; the map
 *   terrain (Mapterhorn) has no tiles here, so the ground could not be
 *   checked. The site is flat; elevation 0.
 *
 * Numbers
 * - Heights 21 / 81 / 93 m and every plan edge: OSM. The void runs between
 *   u = -20.4 and 18.8 m (u = x - 0.17 y, the outline's lean).
 * - Invented within that frame, from o1 and the look-only views: the fillets
 *   where the void meets the podium (10 m) and the bridge (9 m); each inner
 *   face carved back up to 7.5 m (west) / 6 m (east) in the middle, so the
 *   void is wider there, plus a wave along its height (4 m / 3.4 m, 36 m /
 *   31 m long) that twists with depth, the two faces out of step (lead review,
 *   round 1: the melted, amorphous hole of o1). The real outline is freer.
 * - Facade: light silver-blue mirrored glass (o1) with a pale line every
 *   three floors; the void's inner faces in charcoal, the darkest surface
 *   (window-2, lit at night: the hotel's glazing).
 * - Bevels: 0.7 m on every vertical corner and on the roof edges.
 * Look-only references (CC BY-NC, looked at, not copied):
 *   lo2 "Dubai", G Travels, https://www.flickr.com/photos/89646254@N00/51693246534
 *     (from the north: the void open to the sky above the bridge, which sits
 *     deeper; the west face swelling into the void);
 *   lo1 "Opus, Dubai, UEA", escdotdot, https://www.flickr.com/photos/83457804@N00/885727139
 *     (the 2007 design model).
 * Doubts: no licensed photo shows the south face or the void squarely; the
 * void's exact outline is invented within OSM's frame. The OSM parallelogram
 * is kept, though the building is usually described as a cube.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant, type Swatch } from './palette'
import { type V2, area, block, chamfer, fill, inset, walls, writeModel } from './dubai-address-downtown'

const ID = 'dubai-opus'
const ANCHOR = { lng: 55.2668518, lat: 25.1886276 } // centroid of the building outline way/723560004
const BEARING = 337 // +y: the short sides' direction; +x: along Al A'amal Street's long faces

// The OSM outline is a parallelogram: its short sides lean 0.17 m in x per metre
// of y. Everything is laid out in (u, y), u = x - K*y, then sheared back.
const K = 0.17
const U0 = -50.5, U1 = 50.8, Y0 = -33.2, Y1 = 33.3 // outline way/723560004 (6,710 m2)
const VW = -20.4, VE = 18.8 // the void between the towers: OSM parts 1528428015 / 1528428016
const YB = -7 // the bridge's north edge (OSM part 1528428013 covers y < -7 between the towers)
const H = {
  top: 93, // OSM parts (21 levels)
  bridge: 81, // OSM min_height of the bridge part
  podium: 21, // OSM part 1528428014 (3 levels)
  pitch: 12, // facade groups: three floors to a pale line
}
const RB = 10 // fillet where the void meets the podium (estimated, photos o1 and the look-only lo2)
const RT = 9 // fillet under the bridge

const shear = (u: number, y: number): V2 => [u + K * y, y]
const sm = (a: number, b: number, t: number) => { const s = Math.max(0, Math.min(1, (t - a) / (b - a))); return s * s * (3 - 2 * s) }

/**
 * How far the void's west (side -1) or east (+1) face stands into the void at
 * height z and depth y (negative: carved back into the tower). Lead review,
 * round 1: the void reads in o1 as a melted, amorphous cut, wider in the
 * middle with edges that wave in and out; so each face is carved back in the
 * middle, waves along its height, and the waves twist with depth, the two
 * faces out of step.
 */
function swell(side: number, z: number, y: number) {
  let off = 0
  if (z < H.podium + RB) { const t = (H.podium + RB - z) / RB; off += RB * (1 - Math.sqrt(Math.max(0, 1 - t * t))) }
  const wTop = 1 - sm(YB - 5, YB, y) // under the bridge only
  if (z > H.bridge - RT) { const t = Math.min(1, (z - (H.bridge - RT)) / RT); off += wTop * RT * (1 - Math.sqrt(Math.max(0, 1 - t * t))) }
  // the void's own top: under the bridge in the south, the roof in the north
  const zTop = H.bridge + (H.top - H.bridge) * (1 - wTop)
  const t = Math.max(0, Math.min(1, (z - H.podium) / (zTop - H.podium)))
  const d = (y - Y0) / (Y1 - Y0) // 0 at the south face, 1 at the north
  const fade = sm(H.podium, H.podium + 8, z) * (1 - wTop * sm(H.bridge - 10, H.bridge - 2, z))
  if (side < 0) {
    off -= 7.5 * Math.pow(Math.sin(Math.PI * t), 1.3) * (0.75 + 0.25 * Math.cos(Math.PI * d)) * fade
    off += 4.0 * Math.sin((2 * Math.PI * (z - H.podium)) / 36 + 0.4 + 2.2 * d) * fade
  } else {
    off -= 6.0 * Math.pow(Math.sin(Math.PI * t), 1.1) * (0.75 + 0.25 * Math.cos(Math.PI * (1 - d))) * fade
    off += 3.4 * Math.sin((2 * Math.PI * (z - H.podium)) / 31 + 2.1 - 1.8 * d) * fade
  }
  return off
}

const YS = [Y0, -29, -24, -19, -14, -10.5, -8.5, YB, -4.5, 0, 6, 12, 18, 24, 29, Y1]

function build() {
  const glass = new Part(), trim = new Part(), roof = new Part(), voidG = new Part()

  // z levels: the void's fillets, the pale lines, the top bevel.
  const zs = new Set<number>([H.podium, H.podium + 1.5, H.podium + 3.5, H.podium + 6, H.podium + 9.5, H.bridge - 6, H.bridge - 3, H.bridge - 1, H.bridge])
  for (let z = H.podium + H.pitch; z < H.top - 2; z += H.pitch) { zs.add(z - 0.9); zs.add(z) }
  for (let z = H.podium + 12; z < H.top - 2; z += 2.6) zs.add(Math.round(z * 10) / 10)
  zs.add(H.top - 0.7)
  const levels = [...zs].filter((z) => z <= H.top - 0.7).sort((a, b) => a - b)
  const isLine = (z0: number) => { const r = (z0 - H.podium) % H.pitch; return Math.abs(r - (H.pitch - 0.9)) < 0.01 }

  for (const side of [-1, 1]) {
    // ring in (u, y), CCW in sheared space too (the shear keeps orientation)
    const ringAt = (z: number) => {
      const pts: V2[] = [], inner: boolean[] = []
      const uo = side < 0 ? U0 : U1
      const ui = (y: number) => (side < 0 ? VW + swell(-1, z, y) : VE - swell(1, z, y))
      const c = 0.7
      if (side < 0) {
        pts.push(shear(uo, Y0 + c), shear(uo + c, Y0)); inner.push(false, false)
        for (const y of YS) { pts.push(shear(ui(y), y)); inner.push(true) }
        pts.push(shear(uo + c, Y1), shear(uo, Y1 - c)); inner.push(false, false)
      } else {
        pts.push(shear(uo, Y1 - c), shear(uo - c, Y1)); inner.push(false, false)
        for (const y of [...YS].reverse()) { pts.push(shear(ui(y), y)); inner.push(true) }
        pts.push(shear(uo - c, Y0), shear(uo, Y0 + c)); inner.push(false, false)
      }
      if (area(pts) < 0) { pts.reverse(); inner.reverse() }
      return { pts, inner }
    }
    for (let k = 0; k < levels.length - 1; k++) {
      const z0 = levels[k], z1 = levels[k + 1]
      const A = ringAt(z0), B = ringAt(z1)
      const n = A.pts.length
      const line = isLine(z0)
      walls(glass, A.pts, z0, B.pts, z1, 35, (i) => {
        const inn = A.inner[i] && A.inner[(i + 1) % n]
        if (inn) return voidG
        return line ? trim : glass
      })
    }
    // the top: a bevel and the roof
    const T = ringAt(H.top - 0.7).pts, Ti = inset(T, 0.7)
    walls(trim, T, H.top - 0.7, Ti, H.top, 35, undefined, 0.9)
    fill(roof, Ti, H.top, true)
  }

  // --- Podium: three storeys over the whole footprint; its roof is the void's floor. ---
  const foot = chamfer([shear(U0, Y0), shear(U1, Y0), shear(U1, Y1), shear(U0, Y1)], 0.7)
  block(glass, foot, 0, H.podium - 1, { bev: 0, top: false })
  block(trim, foot, H.podium - 1, H.podium, { bev: 0, topPart: roof })

  // --- The bridge: four storeys across the void's south half, dark glass facing the void. ---
  const br: V2[] = [shear(VW - 2, Y0), shear(VE + 2, Y0), shear(VE + 2, YB), shear(VW - 2, YB)]
  const brC = chamfer(br, 0.6, 20)
  block(glass, brC, H.bridge, H.top - 0.7, {
    bev: 0, top: false, bottom: true,
    pick: (i) => { const a = brC[i], b = brC[(i + 1) % brC.length]; return a[1] > YB - 1 && b[1] > YB - 1 ? voidG : glass },
  })
  const bT = inset(brC, 0.7)
  walls(trim, brC, H.top - 0.7, bT, H.top, 35, undefined, 0.9)
  fill(roof, bT, H.top, true)

  const mats: Swatch[] = [
    { name: 'window', color: 0x9fb4c5, roughness: 0.2 }, // silver-blue mirrored glass (o1)
    finish('mullion-silver', 0xdde2e6, 0.5),
    PALETTE.roof,
    windowVariant(2, 0x4a4f57),
  ]
  return [glass, trim, roof, voidG].map((part, i) => ({ part, material: mats[i] }))
}

if (import.meta.main) {
  await writeModel(ID, 'The Opus', build(), {
    bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: H.top,
    replaces: ['way/723560004', 'way/1528428013', 'way/1528428014', 'way/1528428015', 'way/1528428016'],
  })
}
