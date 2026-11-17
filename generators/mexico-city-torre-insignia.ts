/**
 * Torre Insignia (Torre Banobras; OSM name "Torre Independencia"),
 * Insurgentes Norte 423, Nonoalco-Tlatelolco, Mexico City — procedural,
 * CC0-1.0, no textures. bun generators/mexico-city-torre-insignia.ts
 *
 * Mario Pani, 1959–62, for Banobras. A triangular prism lying on its
 * side: seen from the north or south it is a tall isosceles triangle of
 * blue glass, 45 m across the base and 127 m high; seen from the east or
 * west it is a tall, nearly upright slab of weathered concrete, because
 * the two long concrete faces lean in to meet in a short ridge at the top.
 * Each concrete face is folded on a shallow vertical crease (the plan's
 * ends bulge 2 m). The top quarter of each glass triangle is open: the
 * steel X-trusses of the belfry that houses the 47-bell carillon given by
 * Belgium. A white service core rises against the north face to 84 m. The
 * east face carries a large painted figure in orange, blue and green
 * blocks around the belfry opening.
 *
 * Identity: OSM way/217662117 is tagged name "Torre Independencia",
 * old_name "Torre Insignia;Corporativo Tlatelolco", alt_name "Torre
 * Banobras", architect Mario Pani Darqui, addr Avenida Insurgentes Norte
 * 423, start_date 1962, height 127. The address, architect, date, height
 * and the triangular form all match Torre Insignia (es/en.wikipedia,
 * "Torre Insignia"), and the photos below confirm the outline is this
 * building. Wikipedia does not mention the name "Torre Independencia"; the
 * display name here is the established one, Torre Insignia.
 *
 * Map frame: x east, y north, z up, metres, turned so x runs along the
 * long walls (101.8°): placement bearing 11.8. Anchor: the area centroid
 * of way/217662117 (lng −99.15099, lat 19.454566).
 *
 * Covers and replaces way/217662117 (building=public) and its parts
 * way/1152230372 (the prism, 127 m, roof:shape gabled) and way/1152230371
 * (the core, 84 m).
 *
 * Evidence
 * - OSM (measured, turned 11.8°): the prism x −22.7…22.7 at the corners,
 *   the ends bulging to ±24.8 at y −1; y −13.5…11.5; the core x −5.5…5.9,
 *   y 11.5…18.4.
 * - Published: 127 m, 25 floors (es/en.wikipedia "Torre Insignia"); the
 *   core's 84 m from OSM (way/1152230371), matching photo 8.
 * - Photo-scaled (estimated): the glass ends glazed up to ~93 m and open
 *   above (photos 6, 7, 8); the ridge ~3 m wide (photos 1, 3); the
 *   mural's blocks and the belfry opening from photo 3 (drone, straight at
 *   the east face) scaled on the 25 m face width; a two-storey podium band
 *   on the glass ends (photo 7).
 * - Terrain: Mapterhorn has no z15 terrain here (tools/terrain.ts 404s);
 *   Tlatelolco is on the flat lake bed (~2,240 m). Elevation 0.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1–4 "Torre Insignia desde el aire 1/2/3/4.jpg", ProtoplasmaKid,
 *     CC BY-SA 4.0
 *   5 "Torre Insignia fachada norte.JPG", Felipe Alfonso Castillo Vazquez,
 *     CC BY 3.0
 *   6 "Torre Insignia, desde la Torre Latinoamericana.JPG", Luis Alvaz,
 *     CC BY-SA 4.0
 *   7 "Vista de la cara sur de la Torre Insignia desde la av. Ricardo
 *     Flores Magón 01.jpg", Luis Alvaz, CC BY-SA 4.0
 *   8 "Vista de la cara norte de la Torre Insignia desde un puente
 *     peatonal en Insurgentes Nte. 01.jpg", Luis Alvaz, CC BY-SA 4.0
 *   10 "Banobras desde el edif 10 - panoramio.jpg", Arturinho10,
 *     CC BY-SA 3.0
 * - Look-only: none. No commercial imagery.
 * - Colours: the concrete a weathered brown-grey (#7b736a, pulled light
 *   from the near-charcoal of the photos); the glass a light blue
 *   (#8fb2cc, it reads light and reflective); the core and mullion lines
 *   white; the belfry trusses pale grey steel; the mural orange-brown.
 * - Simplified: the curtain wall's mullions are grouped to one line per
 *   three floors and every ~8.4 m; the mural's green blocks are folded into
 *   the orange ones; the bells are left out.
 * - Doubts: the west concrete face is assumed plain (photo 10 shows it
 *   only in shadow); the crease depth follows OSM's plan.
 * - Night: the glass glows as office windows; the belfry stays dark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { save } from './dc-nmaahc'
import { cbox, qf } from './dc-white-house'
import { beam } from './dc-national-cathedral'

const XC = 22.7, XB = 24.8, YB = -1.0 // corners, crease bulge
const YS = -13.5, YN = 11.5
const H = 127, RW = 1.5 // ridge half-width at the top
const ZG = 93 // top of the glazing
const T = 1.4 // concrete face thickness (horizontal)

/** The outer half-width of the prism at height z (the concrete faces' line at the corners). */
const hw = (z: number) => XC + (RW - XC) * (z / H)

function build() {
  const conc = new Part(), glass = new Part(), white = new Part(), steel = new Part(), mural = new Part(), blue = new Part()

  // ---- The two leaning concrete faces, each folded on its crease, with
  // an inner face T in, a ridge cap, and end edges.
  for (const s of [-1, 1]) {
    const o: V3[] = [[s * XC, YS, 0], [s * XB, YB, 0], [s * XC, YN, 0]]
    const t: V3[] = [[s * RW, YS, H], [s * RW, YB, H], [s * RW, YN, H]]
    const nOut: V3 = [s * H, 0, XC - RW]
    for (const k of [0, 1]) qf(conc, o[k], o[k + 1], t[k + 1], t[k], nOut)
    // the inner face (seen through the open belfry)
    const iz = ZG - 1
    const ii = (z: number) => s * (hw(z) - T)
    const inn: V3[] = [[ii(iz), YS + 0.9, iz], [ii(iz), YN - 0.9, iz], [ii(H - 0.5), YN - 0.9, H - 0.5], [ii(H - 0.5), YS + 0.9, H - 0.5]]
    qf(conc, inn[0], inn[1], inn[2], inn[3], [-s, 0, 0])
  }
  // ridge cap
  qf(conc, [-RW, YS, H], [RW, YS, H], [RW, YN, H], [-RW, YN, H], [0, 0, 1])
  // the concrete edge strips that frame each glass end (the faces' thickness)
  for (const [y, ny] of [[YS, -1], [YN, 1]] as Array<[number, number]>) {
    for (const s of [-1, 1]) {
      const a: V3 = [s * XC, y, 0], b: V3 = [s * RW, y, H], c: V3 = [s * (RW - T * 0.6), y, H], d: V3 = [s * (XC - T), y, 0]
      qf(conc, a, b, c, d, [0, ny, 0])
    }
    qf(conc, [-RW, y, H], [RW, y, H], [RW, y, H - 1.0], [-RW, y, H - 1.0], [0, ny, 0])
  }

  // ---- The glass ends: a triangle (cut at ZG) set 0.6 m in, with
  // grouped mullion lines; a two-storey podium band.
  const gin = 0.6
  for (const [y0, ny] of [[YS, -1], [YN, 1]] as Array<[number, number]>) {
    const y = y0 - ny * gin
    const w = (z: number) => hw(z) - T
    qf(glass, [-w(0), y, 0], [w(0), y, 0], [w(ZG), y, ZG], [-w(ZG), y, ZG], [0, ny, 0])
    // reveals between the concrete edge and the recessed glass
    for (const s of [-1, 1]) qf(conc, [s * w(0), y0, 0], [s * w(ZG), y0, ZG], [s * w(ZG), y, ZG], [s * w(0), y, 0], [-s, 0, 0])
    const yl = y + ny * 0.08
    // floor lines every three storeys (~11.1 m)
    for (let z = 7.4; z < ZG - 2; z += 11.1) {
      const a = w(z) - 0.1, b = w(z + 0.45) - 0.1
      qf(white, [-a, yl, z], [a, yl, z], [b, yl, z + 0.45], [-b, yl, z + 0.45], [0, ny, 0])
    }
    // vertical lines every 5.6 m, clipped to the triangle
    for (let x = -16.8; x <= 16.9; x += 8.4) {
      const ztop = Math.min(ZG, (H * (XC - T - Math.abs(x) - 0.4)) / (XC - RW))
      if (ztop < 4) continue
      qf(white, [x - 0.2, yl, 0], [x + 0.2, yl, 0], [x + 0.2, yl, ztop], [x - 0.2, yl, ztop], [0, ny, 0])
    }
    // podium band (pale) at the base, 0–7 m
    qf(white, [-w(0) + 0.1, yl + ny * 0.02, 6.4], [w(0) - 0.1, yl + ny * 0.02, 6.4], [w(7.2) - 0.1, yl + ny * 0.02, 7.2], [-w(7.2) + 0.1, yl + ny * 0.02, 7.2], [0, ny, 0])
    // the belfry: X-trusses in the open triangle above ZG
    const zl = [ZG, 104, 115]
    for (let i = 0; i < zl.length - 1; i++) {
      const za = zl[i], zb = zl[i + 1], wa = w(za) - 0.3, wb = w(zb) - 0.3
      beam(steel, [-wa, y, za + 0.3], [wb, y, zb - 0.3], 0.5, 0.5)
      beam(steel, [wa, y, za + 0.3], [-wb, y, zb - 0.3], 0.5, 0.5)
      beam(steel, [-wb, y, zb], [wb, y, zb], 0.5, 0.6)
    }
    cbox(steel, { x0: -0.3, x1: 0.3, y0: y - 0.3, y1: y + 0.3 }, ZG, 120, { top: true })
  }
  // the belfry floor (top of the offices), dark
  qf(steel, [-(hw(ZG) - T), YS - gin * -1, ZG], [hw(ZG) - T, YS + gin, ZG], [hw(ZG) - T, YN - gin, ZG], [-(hw(ZG) - T), YN - gin, ZG], [0, 0, 1])
  // a horizontal tie through the belfry
  for (const z of [104, 115]) beam(steel, [0, YS + gin, z], [0, YN - gin, z], 0.5, 0.5)

  // ---- The white service core on the north face, to 84 m.
  cbox(white, { x0: -5.5, x1: 5.9, y0: YN - 0.4, y1: 18.4 }, 0, 84, { c: 0.3, b: 0.3 })
  for (let z = 6; z < 80; z += 7.4) qf(glass, [-0.6, 18.45, z], [1.0, 18.45, z], [1.0, 18.45, z + 2.4], [-0.6, 18.45, z + 2.4], [0, 1, 0])

  // ---- The mural on the east face: orange blocks round the belfry
  // opening, as photo 3 shows (in the face's own plane).
  {
    const along = (u: number, z: number, d = 0.08): V3 => {
      // u across the face (−y…+y), z up; on the plane through the crease line
      const yy = u
      const fx = (zz: number) => hw(zz) + (XB - XC) * (1 - zz / H) * (1 - Math.abs(yy - YB) / 12.5)
      const n = [H, 0, XC - RW], l = Math.hypot(n[0], n[2])
      return [fx(z) + (d * n[0]) / l, yy, z + (d * n[2]) / l]
    }
    const blk = (u0: number, u1: number, z0: number, z1: number, p = mural, d = 0.15) =>
      qf(p, along(u0, z0, d), along(u1, z0, d), along(u1, z1, d), along(u0, z1, d), [H, 0, XC - RW])
    blk(-5.2, 3.6, 99, 114) // the frame round the opening
    blk(-3.0, 1.6, 90, 99)
    blk(-4.8, -0.6, 116, 123, blue) // the blue hand
    blk(-1.6, 1.8, 76, 86, blue)
    blk(-6.4, 1.8, 66, 76)
    blk(2.6, 6.0, 70, 78)
    blk(-1.6, 1.6, 58, 66)
    blk(-2.6, 1.0, 104, 111, steel, 0.22) // the belfry opening (dark)
    blk(-2.6, 1.0, 87, 90, steel, 0.22)
  }

  return [
    { part: conc, material: finish('weathered-concrete', 0x7b736a) },
    { part: glass, material: windowVariant(2, 0x8fb2cc) },
    { part: white, material: PALETTE.trim },
    { part: steel, material: finish('belfry-steel', 0x5f646b) },
    { part: mural, material: finish('mural-orange', 0xb0673f) },
    { part: blue, material: finish('mural-blue', 0x86b3cf) },
  ]
}

if (import.meta.main) await save('mexico-city-torre-insignia', 'Torre Insignia', build(), { generator: 'generators/mexico-city-torre-insignia.ts' }, 5000)
