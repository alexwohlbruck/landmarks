/**
 * Chapultepec Castle (Castillo de Chapultepec, Museo Nacional de Historia)
 * on the summit of the Cerro del Chapulín — procedural, CC0-1.0, no
 * textures. bun generators/mexico-city-chapultepec-castle.ts
 *
 * Map frame: x east, y north, z up, metres, turned to the castle's axis.
 * The long walls of the OSM outline run at 69.7° (ENE–WSW), so the model is
 * built with x along them and the placement bearing is 339.7. The anchor is
 * the area centroid of the OSM multipolygon relation/17314437 (outer
 * way/30373701 less the garden, inner way/1191952511): lng -99.1818705,
 * lat 19.4204881. Geometry is written in the outline's own axes about a
 * working origin (lng -99.18209, lat 19.42046) and shifted to the anchor at
 * the end (ANCHOR_U/V).
 *
 * What it is: the hilltop palace-fortress. At the east end the Alcázar
 * (Maximilian and Carlota's palace, remodelled for Porfirio Díaz): a
 * two-storey quadrangle of pale stone and render round the Jardín del
 * Alcázar, which lies on the roof of its ground storey; its east front
 * towards Reforma has a five-bay ground-floor arcade under five great glass
 * windows, a set-back attic, a slim full-height turret at the south-east
 * corner and a smaller one on the roof at the north-east; the north and
 * south ranges carry open glazed galleries (columns, glass behind) over
 * arched doors, and the garden is ringed by iron-and-glass corridors. In the
 * garden stands the Torre del Caballero Alto: a square grey-stone base with
 * a balustrade and corner finials, a round tower above with a balcony band,
 * an arcaded belvedere, a crown balustrade and the flag mast. To the west,
 * the long range of the former Colegio Militar with two-storey arcades on
 * the plaza front, white barrel vaults over its halls, a round rubble-stone
 * tower on the north front and the west-end block with its arcade. The
 * whole sits on the summit terrace: battered rubble retaining walls with
 * oval windows (ojos de buey) on the north and east, a balustrade along the
 * terrace edge, the terrace rounded at the north-east.
 *
 * Covers and replaces relation/17314437 (the castle outline; its outer
 * way carries no tags, its inner way is the garden) and way/1191952512
 * (building=yes, man_made=tower: the Caballero Alto). Left alone (not
 * modelled): way/1191952513 and way/1191952514 (lower buildings on the
 * southern slope), way/1265024352 (a roof west of the castle), the guard
 * house way/1365142195, the Museo del Caracol and the small buildings
 * round the hill.
 *
 * Evidence
 * - OSM (measured, turned 20.3°): outline u −57…117, v −39…22 (u east
 *   along the axis, v north); Alcázar u 56…117 with the east block
 *   u 101/104…117, v −27…12; garden u 61…101, v −31…10 with the corner
 *   rooms at u 91…101; Caballero Alto base u 76…86, v −16…−5 (drawn as a
 *   10.4 m square on its centre); central frontispieces of the north and
 *   south ranges at u 76…86; the round bump at u 3…22 on the north front
 *   fitted by a circle r 9.5 m centred v 13; west-end block u −57…−44 to
 *   v −31; plaza front frontispiece u 6…20 to v −29. The plaza is OSM's
 *   pedestrian area way/1191952510, south of the range: ground, not drawn.
 * - Heights: no lidar here (US only), no OSM heights. Photo-scaled
 *   (estimated) from aerial 2 below, the most level and distant view of the
 *   east front, scaled by the front's OSM length (39 m): ground storey
 *   6.6 m, upper storey to the cornice 13.0 m, balustrade 14.3, attic 16.0,
 *   north-east turret 20.6 m, south-east corner turret (full height from
 *   the terrace, r 2.3) 22.9 m, Caballero Alto belvedere top 28.6 m, crown
 *   balustrade 30.3 m and mast to about 38 m above the terrace (review
 *   round 1: re-measured on aerials 2 and 5 against the east block's
 *   balustrade; the belvedere top is about twice its height). The tower's square base (7 m + cornice and
 *   balustrade) and drum (diameter 9 m, plain lower stage 8.8 m, band,
 *   belvedere 4 m) from aerials 2, 5, 6 and 8 and photo 9. The west range is drawn at the
 *   Alcázar's storey heights (aerial 5 shows its roof level with the
 *   Alcázar's). The round tower to 15.6 m (aerial 5).
 * - The summit terrace T = 9 m (estimated): the retaining walls under the
 *   north-east terrace are about 10–12 m at the corner and lower to the
 *   west (aerials 3, 4, 5, 7). y = 0 is the foot of those walls, the
 *   lowest ground under the model, so the castle stands on a 9 m battered
 *   rubble platform; elsewhere the platform is buried by the hill (the
 *   plaza and the west end stand at terrace level). Terraces: east 7 m
 *   deep, north 8 m (to v 24), north-east corner rounded r 12 m, from
 *   aerials 4–8 against the facades.
 * - Terrain: Mapterhorn has no z15 tile here (404) so `tools/terrain.ts`
 *   cannot run; z12 (about 18 m a pixel) exists and shows the hill
 *   smoothed: the ground under the footprint rises about 20 m from the
 *   north-east corner to the west end. A z12 run of the check (a scratch
 *   copy of terrain.ts with Z = 12) printed `ok`. Do not model the hill:
 *   the castle is level and the hill is the map's.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 "Vista aérea del Castillo de Chapultepec 1.jpg", ProtoplasmaKid,
 *     CC BY 4.0 — the east and north fronts from the north-east, high.
 *   2 "Vista aérea del Castillo de Chapultepec 2.jpg", ProtoplasmaKid,
 *     CC BY 4.0 — the east front level from the east: storey heights,
 *     turrets, Caballero Alto, south gallery.
 *   3 "Vista aérea del Castillo de Chapultepec 3.jpg", ProtoplasmaKid,
 *     CC BY-SA 4.0 — east and north fronts, retaining walls.
 *   4 "Vista aérea del Castillo de Chapultepec 4.jpg", ProtoplasmaKid,
 *     CC BY-SA 4.0 — the same from further off.
 *   5 "Vista aérea del Castillo de Chapultepec 5.jpg", ProtoplasmaKid,
 *     CC BY-SA 4.0 — the north front: gallery, terrace, ojos de buey, the
 *     round tower and the west range.
 *   6 "Vista aérea del Castillo de Chapultepec 6.jpg", ProtoplasmaKid,
 *     CC BY-SA 4.0 — high from the east: the plan, garden, galleries,
 *     roofs, white vaults, plaza.
 *   7 "Vista aérea del Castillo de Chapultepec 7.jpg", ProtoplasmaKid,
 *     CC BY-SA 4.0 — the north front.
 *   8 "Vista aérea del Castillo de Chapultepec 8.jpg", ProtoplasmaKid,
 *     CC BY-SA 4.0 — the east front close: the arcade, glass windows,
 *     attic and turrets; colours.
 *   9 "Castillo de Chapultepec T.jpg", Olivier Bruchez, CC BY-SA 2.0 — the
 *     Caballero Alto's square base, niches, balustrade and finials.
 *   10 "Jardín del Alcazar - Chapultepec Castle - Mexico 2024 (6).jpg",
 *     Jbribeiro1, CC BY-SA 4.0 — the garden, the galleries round it.
 *   11 "Catillo de chapultepec III.jpg", OliAzor, CC BY 4.0 — the plaza
 *     front's two-storey arcades.
 *   12 "Southwest facade - Chapultepec Castle - Mexico 2024.jpg", José
 *     Luiz, CC BY-SA 4.0 — grey-stone front on the plaza (frontispiece).
 *   13 "Sobrevuelos CDMX HJ2A6114 (40386199871).jpg", Gobierno CDMX, CC0 —
 *     at night: lit windows and the lit belvedere; walls mostly dark.
 * - Look-only: none used.
 * - Colours (from photos 2, 5, 6, 8, pulled to the palette's lightness):
 *   greyer beige render (#d9cebb, photo about #cfc4b0; also the terrace
 *   paving, black-and-white chequer in reality), darker brown-grey stone
 *   (#ab9886) for the trim, the Caballero Alto, the retaining walls and the
 *   round tower (one material: the walls' pinker tone is lost), the orange
 *   waterproofed flat roofs, white (#f1eee8) for the barrel vaults, the
 *   flat court roof and the balustrades, muted green parterres.
 * - Drawn as real geometry: the east arcade (round arches 3 m deep with a
 *   glazed back), the north and south galleries (columns on the face, glass
 *   1.5 m behind, entablature and soffit), the garden corridors (glass with
 *   columns standing 0.55 m in front), the balustrades as solid parapets.
 * - Simplified or left out: balusters, urns and statues; the stained-glass
 *   and the interior; the flag; window rhythm on the west range is
 *   regularised (its north and west fronts are only seen from far off in
 *   the photos: doubt); the plaza fountain and the lower ramp buildings.
 * - Doubts: the drone photos are wide-angle and close, and the long range
 *   looks more oblique to the Alcázar in them than OSM's square plan; the
 *   plan follows OSM. The terrace height (9 m) and the retaining walls'
 *   extent are estimates. With the z12 terrain the west end of the castle
 *   would sit in the smoothed hill (see Terrain).
 * - Review round 1 (lead): Caballero Alto raised and widened (crown from
 *   26.6 to 30.3 m, drum 8.2 to 9 m), the south-east turret raised to
 *   22.9 m and thickened, walls greyer, trim darker, vaults white. To stay
 *   within six materials the rubble walls now share the stone trim colour.
 * - Report (the builder's report.md could not be written): 4,554
 *   triangles, about 215 KB, six materials; placement lng -99.1818705,
 *   lat 19.4204881, bearing 339.7, elevation 0, minzoom 14, replaces
 *   relation/17314437 and way/1191952512. How it reads: the two-turreted
 *   east front with its glass gallery over the arcade, the garden with
 *   the Caballero Alto as the clear vertical, the long range with white
 *   vaults and the round stone tower, all on battered terraces with ojos
 *   de buey. At 80 px it is a long cream-and-orange palace with a
 *   courtyard and a dark tower dot. Main risk: the map's z12 terrain.
 * - Night: windows and gallery glass glow (`window`); the Caballero Alto's
 *   belvedere carries most of the `floodlight`, the walls a little.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, annulus, cap, ccw, circle, lathe, offset, slab, walls } from './dc-nmaahc'
import { cbox, qf, tf, type Side } from './dc-white-house'
import { ngon, ngonPrism, spire } from './dc-smithsonian-castle'
import { roundArch } from './dc-national-cathedral'

// ---------------------------------------------------------------------------
// Frame. Geometry is authored in the OSM outline's own axes ("u" along the
// long walls, at 69.7° from north, "v" across them), about a working origin
// at lng -99.18209 lat 19.42046, then shifted so the anchor (the outline's
// area centroid) is the origin.
const ANCHOR_U = 22.69, ANCHOR_V = -5.08

/** The summit platform (terraces, plaza, castle ground floor) above y = 0. */
const T = 9
/** Alcázar storeys, above T. */
const G1 = 6.6 // ground storey; the Jardín del Alcázar is on top of it
const G2 = 13 // upper storey roof

// Materials.
const render = new Part() // cream/ochre rendered walls, white barrel roofs
const trim = new Part() // brown-grey cantera: pilasters, cornices, the Caballero Alto, retaining walls
const roof = new Part() // orange flat roofs
const win = new Part() // windows, glass galleries, loggia backs
const rubble = trim // the retaining walls and the round tower: the same brown-grey stone
const white = new Part() // white vaults, balustrades, terrace paving
const garden = new Part() // the Jardín del Alcázar parterres

const NRM: Record<Side, V3> = { n: [0, 1, 0], s: [0, -1, 0], e: [1, 0, 0], w: [-1, 0, 0] }
const TAN: Record<Side, V3> = { n: [1, 0, 0], s: [1, 0, 0], e: [0, 1, 0], w: [0, 1, 0] }
/** A point on the wall plane `at` facing `side`: a along the wall, z up, d into the building. */
const W = (side: Side, at: number, a: number, z: number, d = 0): V3 => {
  switch (side) {
    case 'e': return [at - d, a, z]
    case 'w': return [at + d, a, z]
    case 'n': return [a, at - d, z]
    default: return [a, at + d, z]
  }
}
const neg = (v: V3): V3 => [-v[0], -v[1], -v[2]]

/** A flat rectangle on a wall, `d` proud of it (negative d = proud). */
function wpanel(p: Part, side: Side, at: number, a0: number, a1: number, z0: number, z1: number, proud = 0.06) {
  qf(p, W(side, at, a0, z0, -proud), W(side, at, a1, z0, -proud), W(side, at, a1, z1, -proud), W(side, at, a0, z1, -proud), NRM[side])
}
/** A round-headed window panel. */
function warch(p: Part, side: Side, at: number, a0: number, a1: number, z0: number, z1: number, seg = 6) {
  roundArch(p, side, at, a0, a1, z0, z1, 0.06, seg)
}
/** A box standing on a wall: a pilaster or a column, a0..a1 along it, `t` proud. */
function wbox(p: Part, side: Side, at: number, a0: number, a1: number, z0: number, z1: number, t: number, top = true) {
  const n = NRM[side], T_ = TAN[side]
  qf(p, W(side, at, a0, z0, -t), W(side, at, a1, z0, -t), W(side, at, a1, z1, -t), W(side, at, a0, z1, -t), n)
  qf(p, W(side, at, a0, z0, 0), W(side, at, a0, z0, -t), W(side, at, a0, z1, -t), W(side, at, a0, z1, 0), neg(T_))
  qf(p, W(side, at, a1, z0, -t), W(side, at, a1, z0, 0), W(side, at, a1, z1, 0), W(side, at, a1, z1, -t), T_)
  if (top) qf(p, W(side, at, a0, z1, -t), W(side, at, a1, z1, -t), W(side, at, a1, z1, 0), W(side, at, a0, z1, 0), [0, 0, 1])
}

/**
 * An arcade: real round-arched openings `depth` deep, between piers, in a
 * wall plane `at` from a0 to a1 (the ends are closed by the masses beside
 * it). The back of each opening is a dark glazed wall.
 */
function arcade(side: Side, at: number, a0: number, a1: number, n: number, pier: number, zb: number, zs: number, zt: number, depth: number, wall: Part, back: Part, seg = 6) {
  const w = (a1 - a0 - (n - 1) * pier) / n, r = w / 2
  const N = NRM[side], Tn = TAN[side]
  for (let i = 0; i < n; i++) {
    const o0 = a0 + i * (w + pier), o1 = o0 + w, c = (o0 + o1) / 2
    // pier to the right of this opening
    if (i < n - 1) {
      const p0 = o1, p1 = o1 + pier
      qf(wall, W(side, at, p0, zb), W(side, at, p1, zb), W(side, at, p1, zt), W(side, at, p0, zt), N)
      qf(wall, W(side, at, p0, zb), W(side, at, p0, zb, depth), W(side, at, p0, zs, depth), W(side, at, p0, zs), neg(Tn))
      qf(wall, W(side, at, p1, zb, depth), W(side, at, p1, zb), W(side, at, p1, zs), W(side, at, p1, zs, depth), Tn)
    }
    // the spandrel over the opening, with the arch's soffit
    const A = (k: number): [number, number] => [c + r * Math.cos((Math.PI * k) / seg), zs + r * Math.sin((Math.PI * k) / seg)]
    for (let k = 0; k < seg; k++) {
      const [a, za] = A(k), [b, zb2] = A(k + 1)
      const corner: [number, number] = k < seg / 2 ? [o1, zt] : [o0, zt]
      tf(wall, W(side, at, corner[0], corner[1]), W(side, at, a, za), W(side, at, b, zb2), N)
      const tm = (Math.PI * (k + 0.5)) / seg
      const inward: V3 = [-Math.cos(tm) * Tn[0], -Math.cos(tm) * Tn[1], -Math.sin(tm)]
      qf(wall, W(side, at, a, za), W(side, at, b, zb2), W(side, at, b, zb2, depth), W(side, at, a, za, depth), inward)
    }
    tf(wall, W(side, at, o0, zt), W(side, at, o1, zt), W(side, at, c, zs + r), N)
    // the glazed back of the bay
    qf(back, W(side, at, o0, zb, depth - 0.02), W(side, at, o1, zb, depth - 0.02), W(side, at, o1, zs + r, depth - 0.02), W(side, at, o0, zs + r, depth - 0.02), N)
  }
}

/**
 * A colonnade: square columns on the wall plane `at`, an entablature over
 * them, and the glazed gallery wall `depth` behind — a real open loggia.
 */
function loggia(side: Side, at: number, a0: number, a1: number, n: number, col: number, zb: number, zc: number, zt: number, depth: number, wall: Part, colP: Part, back: Part) {
  const N = NRM[side], Tn = TAN[side]
  // entablature: face and soffit
  qf(wall, W(side, at, a0, zc), W(side, at, a1, zc), W(side, at, a1, zt), W(side, at, a0, zt), N)
  qf(wall, W(side, at, a0, zc, depth), W(side, at, a1, zc, depth), W(side, at, a1, zc), W(side, at, a0, zc), [0, 0, -1])
  qf(roof, W(side, at, a0, zt), W(side, at, a1, zt), W(side, at, a1, zt, depth), W(side, at, a0, zt, depth), [0, 0, 1])
  // end returns
  qf(wall, W(side, at, a0, zb, depth), W(side, at, a0, zb), W(side, at, a0, zc), W(side, at, a0, zc, depth), Tn)
  qf(wall, W(side, at, a1, zb), W(side, at, a1, zb, depth), W(side, at, a1, zc, depth), W(side, at, a1, zc), neg(Tn))
  // columns, evenly spaced between the ends
  const step = (a1 - a0) / n
  for (let i = 1; i < n; i++) {
    const c = a0 + i * step
    const p0 = c - col / 2, p1 = c + col / 2
    qf(colP, W(side, at, p0, zb, 0.05), W(side, at, p1, zb, 0.05), W(side, at, p1, zc, 0.05), W(side, at, p0, zc, 0.05), N)
    qf(colP, W(side, at, p0, zb, 0.05 + col), W(side, at, p0, zb, 0.05), W(side, at, p0, zc, 0.05), W(side, at, p0, zc, 0.05 + col), neg(Tn))
    qf(colP, W(side, at, p1, zb, 0.05), W(side, at, p1, zb, 0.05 + col), W(side, at, p1, zc, 0.05 + col), W(side, at, p1, zc, 0.05), Tn)
    qf(colP, W(side, at, p1, zb, 0.05 + col), W(side, at, p0, zb, 0.05 + col), W(side, at, p0, zc, 0.05 + col), W(side, at, p1, zc, 0.05 + col), neg(N))
  }
  // the glazed gallery wall behind, mullioned by the column rhythm
  qf(back, W(side, at, a0, zb, depth - 0.02), W(side, at, a1, zb, depth - 0.02), W(side, at, a1, zc, depth - 0.02), W(side, at, a0, zc, depth - 0.02), N)
}

/** A garden-side iron-and-glass gallery: glass wall with slim columns standing in front of it. */
function gallery(side: Side, at: number, a0: number, a1: number, n: number, zb: number, zt: number) {
  wpanel(win, side, at, a0, a1, zb + 0.3, zt - 0.9, 0.04)
  const step = (a1 - a0) / n
  for (let i = 0; i <= n; i++) {
    const c = a0 + i * step
    wbox(trim, side, at, c - 0.22, c + 0.22, zb, zt - 0.9, 0.55, false)
  }
  // the iron beam over the glass
  wbox(trim, side, at, a0 - 0.25, a1 + 0.25, zt - 0.9, zt - 0.5, 0.6, true)
}

/** A solid parapet (balustrade) of thickness t along an open polyline, z0..z1, bevelled top. */
function parapetLine(p: Part, pts: XY[], z0: number, z1: number, t: number) {
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1]
    const L = Math.hypot(bx - ax, by - ay)
    const nx = (by - ay) / L, ny = -(bx - ax) / L // right-hand normal
    const h = t / 2
    const a0: XY = [ax + nx * h, ay + ny * h], b0: XY = [bx + nx * h, by + ny * h]
    const a1: XY = [ax - nx * h, ay - ny * h], b1: XY = [bx - nx * h, by - ny * h]
    const bev = 0.12
    qf(p, [...a0, z0], [...b0, z0], [...b0, z1 - bev], [...a0, z1 - bev], [nx, ny, 0])
    qf(p, [...b1, z0], [...a1, z0], [...a1, z1 - bev], [...b1, z1 - bev], [-nx, -ny, 0])
    const ai0: XY = [ax + nx * (h - bev), ay + ny * (h - bev)], bi0: XY = [bx + nx * (h - bev), by + ny * (h - bev)]
    const ai1: XY = [ax - nx * (h - bev), ay - ny * (h - bev)], bi1: XY = [bx - nx * (h - bev), by - ny * (h - bev)]
    qf(p, [...a0, z1 - bev], [...b0, z1 - bev], [...bi0, z1], [...ai0, z1], [nx, ny, 1])
    qf(p, [...b1, z1 - bev], [...a1, z1 - bev], [...ai1, z1], [...bi1, z1], [-nx, -ny, 1])
    qf(p, [...ai0, z1], [...bi0, z1], [...bi1, z1], [...ai1, z1], [0, 0, 1])
    if (i === 0) qf(p, [...a1, z0], [...a0, z0], [...a0, z1], [...a1, z1], [-(bx - ax), -(by - ay), 0])
    if (i === pts.length - 2) qf(p, [...b0, z0], [...b1, z0], [...b1, z1], [...b0, z1], [bx - ax, by - ay, 0])
  }
}

/** A closed parapet just inside a ring's edge. */
function parapetRing(p: Part, ring: XY[], z0: number, z1: number, t: number) {
  const R = ccw(ring), inner = offset(R, -t)
  walls(p, R, z0, z1)
  for (let i = 0; i < inner.length; i++) {
    const a = inner[i], b = inner[(i + 1) % inner.length]
    qf(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [-(b[1] - a[1]), b[0] - a[0], 0])
  }
  annulus(p, R, inner, z1, true)
}

/** A cornice band round a ring: projects `o`, `h` tall, its top at z. */
function cornice(p: Part, ring: XY[], z: number, o: number, h: number) {
  const R = ccw(ring), O = offset(R, o)
  walls(p, O, z - h, z)
  annulus(p, O, R, z, true)
  annulus(p, O, R, z - h, false)
}

/** A block over a ring: walls in `wallP`, chamfered top edge, roof cap in `top`. */
function block(ring: XY[], z0: number, z1: number, wallP: Part, top: Part | false, b = 0.35) {
  slab(wallP, ring, z0, z1, b, top)
}

const rectR = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const arcPts = (cx: number, cy: number, r: number, a0: number, a1: number, n: number): XY[] =>
  Array.from({ length: n + 1 }, (_, k) => {
    const t = ((a0 + ((a1 - a0) * k) / n) * Math.PI) / 180
    return [cx + r * Math.cos(t), cy + r * Math.sin(t)] as XY
  })

// ---------------------------------------------------------------------------
// The platform: retaining walls round the summit terrace, battered.

const ROUND_C: XY = [12.5, 13], ROUND_R = 9.5 // the round tower on the north front
// The round tower meets the north wall (v = 16) at u = 12.5 ± 9.0.
const roundArc: XY[] = [22.5, 45, 67.5, 90, 112.5, 135, 157.5].map((d) => [ROUND_C[0] + ROUND_R * Math.cos((d * Math.PI) / 180), ROUND_C[1] + ROUND_R * Math.sin((d * Math.PI) / 180)] as XY)
const NE_C: XY = [112, 12], NE_R = 12 // the rounded north-east end of the terrace

const PLATFORM: XY[] = [
  [-57, -31], [-44, -31], [-44, -20], [-20, -20], [-20, -23], [6, -23], [6, -29], [20, -29], [20, -22], [40, -22], [40, -16],
  [56, -16], [56, -37], [76, -37], [78, -39], [84, -39], [86, -37], [105, -37], [105, -41], [124, -41],
  ...arcPts(NE_C[0], NE_C[1], NE_R, 0, 90, 6),
  [48, 24], [44, 16], [21.5, 16],
  ...roundArc, // round the round tower, east to west
  [3.5, 16], [-57, 16],
]

function platform() {
  const top = ccw(PLATFORM)
  const base = offset(top, 0.8)
  // Battered walls in segments no longer than ~5 m low down (the terrain lifts
  // each vertex), straight above.
  for (let i = 0; i < top.length; i++) {
    const j = (i + 1) % top.length
    const L = Math.hypot(top[j][0] - top[i][0], top[j][1] - top[i][1])
    const n = Math.max(1, Math.ceil(L / 5))
    for (let k = 0; k < n; k++) {
      const t0 = k / n, t1 = (k + 1) / n
      const B = (t: number): V3 => [base[i][0] + (base[j][0] - base[i][0]) * t, base[i][1] + (base[j][1] - base[i][1]) * t, 0]
      const U = (t: number): V3 => [top[i][0] + (top[j][0] - top[i][0]) * t, top[i][1] + (top[j][1] - top[i][1]) * t, T]
      rubble.quad(B(t0), B(t1), U(t1), U(t0))
    }
  }
  // the terrace paving: drawn as the platform's top (it is a podium, not ground)
  cap(render, top, T, true)
  // A plinth course under the balustrade.
  // Oval windows (ojos de buey) in the north and east retaining walls.
  const batter = (z: number) => 0.8 * (1 - z / T)
  const oval = (x: number, y: number, nx: number, ny: number, z: number) => {
    const rx = 1.45, rz = 0.95, n = 12
    const tx = -ny, ty = nx
    const pts = Array.from({ length: n }, (_, k) => {
      const t = (2 * Math.PI * k) / n, zz = z + rz * Math.sin(t), d = batter(zz) + 0.06
      return [x + nx * d + tx * rx * Math.cos(t), y + ny * d + ty * rx * Math.cos(t), zz] as V3
    })
    for (let k = 1; k < n - 1; k++) tf(win, pts[0], pts[k], pts[k + 1], [nx, ny, 0])
  }
  for (let u = 52; u <= 108; u += 6.2) oval(u, 24, 0, 1, T - 3.3)
  for (const deg of [30, 60]) {
    const t = (deg * Math.PI) / 180
    oval(NE_C[0] + NE_R * Math.cos(t), NE_C[1] + NE_R * Math.sin(t), Math.cos(t), Math.sin(t), T - 3.3)
  }
  for (let v = -34; v <= 6; v += 6.6) oval(124, v, 1, 0, T - 3.3)
  // The terrace balustrade: east, round the north-east, along the north.
  const bal: XY[] = [[105.2, -40.8], [123.8, -40.8], ...arcPts(NE_C[0], NE_C[1], NE_R - 0.2, 0, 90, 6), [48.2, 23.8], [44.3, 16.2]]
  parapetLine(white, bal, T, T + 1.1, 0.45)
}

// ---------------------------------------------------------------------------
// The Alcázar (east): two storeys round the Jardín del Alcázar, the
// Caballero Alto in the garden.

function alcazar() {
  const z1 = T + G1, z2 = T + G2
  // Ground storey, with the east loggia notched 3 m into it.
  const L0 = -14.5, L1 = 5.5 // the east loggia, v (five 4 m bays)
  const ground: XY[] = [
    [56, -37], [76, -37], [78, -39], [84, -39], [86, -37], [105, -37], [105, -27], [117, -27], [117, L0], [114, L0], [114, L1], [117, L1],
    [117, 12], [104, 12], [104, 16], [86, 16], [83, 19], [78, 19], [76, 16], [56, 16],
  ]
  block(ground, T, z1, render, trim, 0)
  arcade('e', 117, L0, L1, 5, 1.0, T, T + 3.6, z1, 3, trim, win)
  // Upper storey: east block, north and south ranges (each with an open
  // gallery to the outside), west range round the garden.
  const east: XY[] = rectR(101, 117, -27, 12)
  const NL0 = 57.6, NL1 = 75.2, NL2 = 86.8, NL3 = 102.4 // north loggia spans (u)
  const SL3 = 103.4
  const north: XY[] = [[56, 5], [91, 5], [91, 0], [101, 0], [101, 12], [104, 12], [104, 16], [NL3, 16], [NL3, 14.5], [NL2, 14.5], [NL2, 16], [83, 19], [78, 19], [NL1, 16], [NL1, 14.5], [NL0, 14.5], [NL0, 16], [56, 16]]
  const south: XY[] = [[56, -37], [NL0, -37], [NL0, -35.5], [NL1, -35.5], [NL1, -37], [78, -39], [84, -39], [NL2, -37], [NL2, -35.5], [SL3, -35.5], [SL3, -37], [105, -37], [105, -27], [101, -27], [101, -22], [91, -22], [91, -26], [56, -26]]
  const west: XY[] = rectR(56, 66, -26, 5)
  for (const r of [north, south, west, east]) block(r, z1, z2, render, roof, 0)
  loggia('n', 16, NL0, NL1, 6, 0.7, z1, z2 - 1.4, z2, 1.5, render, trim, win)
  loggia('n', 16, NL2, NL3, 5, 0.7, z1, z2 - 1.4, z2, 1.5, render, trim, win)
  loggia('s', -37, NL0, NL1, 6, 0.7, z1, z2 - 1.4, z2, 1.5, render, trim, win)
  loggia('s', -37, NL2, SL3, 5, 0.7, z1, z2 - 1.4, z2, 1.5, render, trim, win)
  // Main cornice and balustrade round the whole Alcázar roof (outer edge),
  // and the stringcourse at the garden level.
  const outer: XY[] = [
    [56, -37], [76, -37], [78, -39], [84, -39], [86, -37], [105, -37], [105, -27], [117, -27], [117, 12], [104, 12], [104, 16], [86, 16], [83, 19], [78, 19], [76, 16], [56, 16],
  ]
  cornice(trim, outer, z2 + 0.35, 0.35, 0.65)
  parapetLine(white, [[56.2, -36.8], [76, -36.8], [78, -38.8], [84, -38.8], [86, -36.8], [104.8, -36.8], [104.8, -26.8], [116.8, -26.8], [116.8, 11.8], [104.2, 11.8], [104.2, 15.8], [86.1, 15.8], [83, 18.8], [78, 18.8], [75.9, 15.8], [56.2, 15.8]], z2, z2 + 1.3, 0.4)
  cornice(trim, outer, z1 + 0.3, 0.2, 0.5)
  // balustrades round the garden's edge on the gallery roofs
  parapetLine(white, [[66.2, -25.8], [90.8, -25.8], [90.8, -21.8], [100.8, -21.8], [100.8, -0.2], [90.8, -0.2], [90.8, 4.8], [66.2, 4.8], [66.2, -25.8]], z2, z2 + 1.0, 0.35)

  // --- The garden: parterres on the roof of the ground storey, iron-and-glass
  // galleries on its north, south and west sides.
  gallery('s', 5, 66.3, 90.7, 8, z1, z2)
  gallery('n', -26, 66.3, 90.7, 8, z1, z2)
  gallery('e', 66, -25.7, 4.7, 9, z1, z2)
  // The east block's back wall, facing the garden.
  for (const v of [-19, -14, -7, -2]) warch(win, 'w', 101, v - 1, v + 1, z1 + 0.6, z1 + 4.4)
  for (const [x0, x1, y0, y1] of [[68, 75, -24, -15], [87, 99, -20, -14], [68, 75, -6, 3], [87, 99, -7, -2], [77.5, 84.5, -3, 3], [77.5, 84.5, -24.5, -18.5]] as [number, number, number, number][])
    cbox(garden, { x0, x1, y0, y1 }, z1, z1 + 0.45, { b: 0.15 })

  // --- The east front (u = 117), towards Reforma.
  const E = 117
  const bw = (L1 - L0) / 5
  // the five great glass windows of the upper gallery, stone piers between
  for (let i = 0; i < 5; i++) wpanel(win, 'e', E, L0 + i * bw + 0.5, L0 + (i + 1) * bw - 0.5, z1 + 0.7, z2 - 1.1)
  for (let i = 0; i <= 5; i++) wbox(trim, 'e', E, L0 + i * bw - 0.45, L0 + i * bw + 0.45, z1, z2, 0.22, false)
  // side bays: arched windows over arched doors
  for (const v of [-21.3, -17.6, 8.8]) {
    warch(win, 'e', E, v - 0.95, v + 0.95, z1 + 0.9, z2 - 1.3)
    warch(win, 'e', E, v - 0.95, v + 0.95, T + 0.2, T + 4.3)
  }
  for (const v of [-19.45, 10.9]) wbox(trim, 'e', E, v - 0.4, v + 0.4, T, z2, 0.2, false)
  // The south-east turret: a slim full-height cylinder at the corner.
  const SE: XY = [116.4, -25.6], rS = 2.3
  lathe(render, SE[0], SE[1], [[rS, T], [rS, T + 21.8]], 14, false)
  for (const z of [z1 + 0.3, z2 + 0.35]) lathe(trim, SE[0], SE[1], [[rS + 0.2, z - 0.5], [rS + 0.2, z]], 14, false)
  lathe(trim, SE[0], SE[1], [[rS, T + 21.8], [rS + 0.4, T + 22.2], [rS + 0.4, T + 22.9]], 14, true)
  for (const z of [T + 0.5, z1 + 1.3, z2 + 2, z2 + 5.6]) qf(win, [SE[0] + rS + 0.04, SE[1] - 0.4, z], [SE[0] + rS + 0.04, SE[1] + 0.4, z], [SE[0] + rS + 0.04, SE[1] + 0.4, z + 2.2], [SE[0] + rS + 0.04, SE[1] - 0.4, z + 2.2], [1, 0, 0])
  // Attic over the east block, set back behind the balustrade.
  const attic = rectR(104, 115.3, -23.5, 8)
  block(attic, z2, z2 + 3, render, roof, 0.3)
  cornice(trim, attic, z2 + 3.2, 0.25, 0.45)
  // The north-east turret, rising from the roof.
  const NE: XY = [113, 9.2], rN = 2.1
  lathe(render, NE[0], NE[1], [[rN, z2], [rN, z2 + 6.6]], 14, false)
  lathe(trim, NE[0], NE[1], [[rN, z2 + 6.6], [rN + 0.35, z2 + 7.0], [rN + 0.35, z2 + 7.6]], 14, true)
  qf(win, [NE[0] + rN + 0.04, NE[1] - 0.4, z2 + 2.4], [NE[0] + rN + 0.04, NE[1] + 0.4, z2 + 2.4], [NE[0] + rN + 0.04, NE[1] + 0.4, z2 + 4.8], [NE[0] + rN + 0.04, NE[1] - 0.4, z2 + 4.8], [1, 0, 0])

  // --- North front (v = 16): arched doors below the gallery, the central frontispiece.
  for (let u = 59.6; u < 101; u += 4.4) {
    if (u > 74.5 && u < 87.5) continue
    warch(win, 'n', 16, u - 0.95, u + 0.95, T + 0.3, T + 4.4)
  }
  warch(win, 'n', 19, 79.6, 81.4, T + 0.3, T + 4.6)
  warch(win, 'n', 19, 79.7, 81.3, z1 + 0.8, z2 - 1.4)
  for (const u of [78.4, 82.6]) wbox(trim, 'n', 19, u - 0.35, u + 0.35, T, z2, 0.2, false)
  // East block's north end (v = 12).
  for (const u of [107.5, 112.5]) {
    warch(win, 'n', 12, u - 0.95, u + 0.95, T + 0.3, T + 4.4)
    warch(win, 'n', 12, u - 0.95, u + 0.95, z1 + 0.9, z2 - 1.3)
  }

  // --- South front (v = -37), to the plaza: arched windows below the gallery.
  for (let u = 59.6; u < 104; u += 4.4) {
    if (u > 74.5 && u < 87.5) continue
    warch(win, 's', -37, u - 0.95, u + 0.95, T + 0.5, T + 4.6)
  }
  warch(win, 's', -39, 79.6, 82.4, T + 0.3, T + 4.8)
  warch(win, 's', -39, 79.9, 82.1, z1 + 0.8, z2 - 1.4)
  for (const u of [78.4, 83.6]) wbox(trim, 's', -39, u - 0.35, u + 0.35, T, z2, 0.2, false)
  warch(win, 'e', 105, -33, -31, T + 0.5, T + 4.6)
  warch(win, 'e', 105, -33, -31, z1 + 1, z2 - 1.4)

  caballeroAlto(z1)
}

/** The Torre del Caballero Alto: a square stone base in the garden, a round tower over it. */
function caballeroAlto(z1: number) {
  const cx = 81, cy = -10.5, h = 5.2 // half the base
  const zb = z1, zB = z1 + 7 // the square base
  cbox(trim, { x0: cx - h, x1: cx + h, y0: cy - h, y1: cy + h }, zb, zB, { c: 0.3 })
  cbox(trim, { x0: cx - h - 0.35, x1: cx + h + 0.35, y0: cy - h - 0.35, y1: cy + h + 0.35 }, zB, zB + 0.6, { b: 0.2, bottom: true, top: roof })
  parapetRing(white, rectR(cx - h - 0.2, cx + h + 0.2, cy - h - 0.2, cy + h + 0.2), zB + 0.6, zB + 1.5, 0.35)
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const px = cx + sx * (h - 0.05), py = cy + sy * (h - 0.05)
    ngonPrism(trim, px, py, 0.45, 4, zB + 1.5, zB + 2.3, { top: false })
    spire(trim, ngon(px, py, 0.45, 4, zB + 2.3), [px, py, zB + 3.7])
  }
  // a door and two statue niches on each face of the base, quoins at the corners
  for (const side of ['n', 's', 'e', 'w'] as Side[]) {
    const at = side === 'n' ? cy + h : side === 's' ? cy - h : side === 'e' ? cx + h : cx - h
    const c = side === 'n' || side === 's' ? cx : cy
    warch(win, side, at, c - 0.95, c + 0.95, zb + 0.2, zb + 4.4)
    for (const d of [-3, 3]) warch(win, side, at, c + d - 0.55, c + d + 0.55, zb + 1.4, zb + 3.8, 4)
    wbox(trim, side, at, c - h + 0.3, c - h + 1.1, zb, zB, 0.15, false)
    wbox(trim, side, at, c + h - 1.1, c + h - 0.3, zb, zB, 0.15, false)
  }
  // the round tower: plain lower drum, a balcony band, the arcaded belvedere, crown
  const R = 4.5, n = 16
  const z0 = zB + 0.6, a = 8.8 // a: the plain lower drum
  lathe(trim, cx, cy, [[R, z0], [R, z0 + a]], n, false)
  lathe(trim, cx, cy, [[R, z0 + a], [R + 0.45, z0 + a + 0.3], [R + 0.45, z0 + a + 0.8], [R, z0 + a + 0.9]], n, false)
  lathe(trim, cx, cy, [[R, z0 + a + 0.9], [R, z0 + a + 4.9]], n, false)
  lathe(trim, cx, cy, [[R, z0 + a + 4.9], [R + 0.5, z0 + a + 5.3], [R + 0.5, z0 + a + 5.7], [R + 0.3, z0 + a + 5.7]], n, false)
  const zc = z0 + a + 5.7
  lathe(white, cx, cy, [[R + 0.3, zc], [R + 0.3, zc + 1.0]], n, false)
  const ringO = Array.from({ length: n }, (_, k) => [cx + (R + 0.3) * Math.cos((2 * Math.PI * k) / n), cy + (R + 0.3) * Math.sin((2 * Math.PI * k) / n)] as XY)
  const ringI = Array.from({ length: n }, (_, k) => [cx + (R - 0.05) * Math.cos((2 * Math.PI * k) / n), cy + (R - 0.05) * Math.sin((2 * Math.PI * k) / n)] as XY)
  annulus(white, ringO, ringI, zc + 1.0, true)
  for (let k = 0; k < n; k++) {
    const p = ringI[k], q = ringI[(k + 1) % n]
    qf(white, [p[0], p[1], zc], [q[0], q[1], zc], [q[0], q[1], zc + 1.0], [p[0], p[1], zc + 1.0], [cx - (p[0] + q[0]) / 2, cy - (p[1] + q[1]) / 2, 0])
  }
  cap(roof, ringI, zc, true)
  // the belvedere's arched openings and the drum's windows, on alternate faces
  for (let k = 0; k < n; k++) {
    const t = (2 * Math.PI * (k + 0.5)) / n
    const ox = Math.cos(t), oy = Math.sin(t)
    const d = R * Math.cos(Math.PI / n) + 0.05
    const P = (u: number, z: number): V3 => [cx + ox * d - oy * u, cy + oy * d + ox * u, z]
    const w = 0.75, zs = z0 + a + 1.3, zt = z0 + a + 4.5
    if (k % 2 === 0) {
      const pts: [number, number][] = [[-w, zs], [w, zs]]
      for (let s = 0; s <= 6; s++) pts.push([w * Math.cos((Math.PI * s) / 6), zt - w + w * Math.sin((Math.PI * s) / 6)])
      for (let s = 1; s < pts.length - 1; s++) tf(win, P(...pts[0]), P(...pts[s]), P(...pts[s + 1]), [ox, oy, 0])
    }
    if (k % 4 === 1) for (const zw of [z0 + 1.8, z0 + 5.4]) qf(win, P(-0.5, zw), P(0.5, zw), P(0.5, zw + 1.9), P(-0.5, zw + 1.9), [ox, oy, 0])
  }
  // the flag mast
  cbox(trim, { x0: cx - 0.17, x1: cx + 0.17, y0: cy - 0.17, y1: cy + 0.17 }, zc, zc + 7.5)
}

// ---------------------------------------------------------------------------
// The west range (the former Colegio Militar), the round tower, the plaza fronts.

function westRange() {
  const z1 = T + G1, z2 = T + G2
  // Ground storey, notched for the plaza arcades.
  const A0 = -19.3, A1 = 5.3, B0 = 20.7, B1 = 39.3, D = 3 // arcade spans on the south front
  const ground: XY[] = [
    [-57, -31], [-44, -31], [-44, -20], [-20, -20], [-20, -23], [A0, -23], [A0, -23 + D], [A1, -23 + D], [A1, -23], [6, -23], [6, -29], [20, -29], [20, -22],
    [B0, -22], [B0, -22 + D], [B1, -22 + D], [B1, -22], [40, -22], [40, -16], [56, -16], [56, 16], [22, 16], [3, 16], [-57, 16],
  ]
  block(ground, T, z1, render, false, 0)
  arcade('s', -23, A0, A1, 6, 1.1, T, T + 4.3, z1, D, render, win)
  arcade('s', -22, B0, B1, 4, 1.1, T, T + 4.3, z1, D, render, win)
  // West end's east face (u = -44) to the plaza: three arches, not notched (shallow reveals).
  for (const v of [-29, -25.5, -22]) warch(win, 'e', -44, v - 1.3, v + 1.3, T + 0.3, T + 5.4)
  // Upper storey, full plan.
  const upper: XY[] = [
    [-57, -31], [-44, -31], [-44, -20], [-20, -20], [-20, -23], [6, -23], [6, -29], [20, -29], [20, -22], [40, -22], [40, -16], [56, -16], [56, 16], [22, 16], [3, 16], [-57, 16],
  ]
  block(upper, z1, z2, render, roof, 0)
  cornice(trim, upper, z1 + 0.35, 0.18, 0.5)
  cornice(trim, upper, z2 + 0.4, 0.35, 0.7)
  parapetLine(white, [[-56.8, 15.8], [-56.8, -30.8], [-44.2, -30.8], [-44.2, -20.2], [-20.2, -20.2], [-20.2, -22.8], [6.2, -22.8], [6.2, -28.8], [19.8, -28.8], [19.8, -21.8], [40.2, -21.8], [40.2, -15.8], [55.8, -15.8]], z2, z2 + 1.4, 0.4)
  parapetLine(white, [[55.8, 15.8], [22, 15.8]], z2, z2 + 1.4, 0.4)
  parapetLine(white, [[3, 15.8], [-56.8, 15.8]], z2, z2 + 1.4, 0.4)
  // Upper windows over the arcades and along the fronts, grouped per bay.
  const wA = (A1 - A0 - 5 * 1.1) / 6
  for (let i = 0; i < 6; i++) { const c = A0 + wA / 2 + i * (wA + 1.1); wpanel(win, 's', -23, c - 1.05, c + 1.05, z1 + 1, z2 - 1.5) }
  const wB = (B1 - B0 - 3 * 1.1) / 4
  for (let i = 0; i < 4; i++) { const c = B0 + wB / 2 + i * (wB + 1.1); wpanel(win, 's', -22, c - 1.05, c + 1.05, z1 + 1, z2 - 1.5) }
  // The grey-stone frontispiece (u 6..20) with the museum entrance.
  wbox(trim, 's', -29, 6.3, 19.7, T, z2, 0.15, false)
  warch(win, 's', -29.15, 11.6, 14.4, T + 0.3, T + 5.6)
  for (const u of [8.5, 17.5]) warch(win, 's', -29.15, u - 1, u + 1, T + 0.8, T + 4.8)
  for (const u of [8.5, 13, 17.5]) wpanel(win, 's', -29.15, u - 1, u + 1, z1 + 1, z2 - 1.5)
  // Connector to the Alcázar (u 40..56): windows.
  for (const u of [44, 48, 52]) {
    warch(win, 's', -16, u - 1, u + 1, T + 0.5, T + 5)
    wpanel(win, 's', -16, u - 1, u + 1, z1 + 1, z2 - 1.5)
  }
  // West end: plaza face upper windows, west front.
  for (const v of [-29, -25.5, -22]) wpanel(win, 'e', -44, v - 1, v + 1, z1 + 1, z2 - 1.5)
  for (let v = -27; v < 14; v += 5) {
    warch(win, 'w', -57, v - 1, v + 1, T + 0.6, T + 5)
    wpanel(win, 'w', -57, v - 1, v + 1, z1 + 1, z2 - 1.5)
  }
  // North front (v = 16): windows in both storeys, grouped by bays.
  for (const [u0, u1] of [[-54, 1], [24, 54]] as [number, number][]) {
    for (let u = u0 + 2; u < u1 - 1; u += 4.6) {
      warch(win, 'n', 16, u - 0.9, u + 0.9, T + 0.8, T + 5)
      wpanel(win, 'n', 16, u - 0.9, u + 0.9, z1 + 1, z2 - 1.5)
    }
  }
  // South front of the main block west of the arcade.
  for (let u = -41; u < -21; u += 4.6) {
    warch(win, 's', -20, u - 0.9, u + 0.9, T + 0.8, T + 5)
    wpanel(win, 's', -20, u - 0.9, u + 0.9, z1 + 1, z2 - 1.5)
  }

  // The white barrel-vaulted roofs over the halls, running along the range.
  const barrel = (u0: number, u1: number, v0: number, v1: number, rise: number) => {
    const n = 8, half = (v1 - v0) / 2, vc = (v0 + v1) / 2
    const R = (half * half + rise * rise) / (2 * rise), zc = z2 + rise - R
    const a = Math.asin(half / R)
    const prof = Array.from({ length: n + 1 }, (_, k) => {
      const t = -a + (2 * a * k) / n
      return [vc + R * Math.sin(t), zc + R * Math.cos(t)] as [number, number]
    })
    for (let k = 0; k < n; k++) {
      const [y0, za] = prof[k], [y1, zb] = prof[k + 1]
      const tm = -a + (2 * a * (k + 0.5)) / n
      qf(white, [u0, y0, za], [u1, y0, za], [u1, y1, zb], [u0, y1, zb], [0, Math.sin(tm), Math.cos(tm)])
    }
    for (const [u, s] of [[u0, -1], [u1, 1]] as [number, number][]) {
      for (let k = 1; k < n - 1; k++) tf(white, [u, prof[0][0], prof[0][1]], [u, prof[k][0], prof[k][1]], [u, prof[k + 1][0], prof[k + 1][1]], [s, 0, 0])
    }
  }
  barrel(20.5, 47.5, -11, 9, 4.6)
  barrel(-32, 13, -10.5, 8.5, 4.2)
  // The white flat roof over the court between the range and the Alcázar.
  cbox(white, { x0: 40.5, x1: 55.5, y0: -13.5, y1: 12.5 }, z2, z2 + 0.9, { b: 0.25 })

  // The round tower on the north front: rubble stone, three tiers of windows.
  const [rx, ry] = ROUND_C
  lathe(rubble, rx, ry, [[ROUND_R, T], [ROUND_R, z2 + 1.6]], 16, false)
  lathe(trim, rx, ry, [[ROUND_R, z2 + 1.6], [ROUND_R + 0.35, z2 + 1.9], [ROUND_R + 0.35, z2 + 2.6]], 16, false)
  const ringO = circle(rx, ry, ROUND_R + 0.35, 16, 0), ringI = circle(rx, ry, ROUND_R - 0.15, 16, 0)
  annulus(trim, ringO, ringI, z2 + 2.6, true)
  for (let k = 0; k < 16; k++) {
    const a = ringI[k], b = ringI[(k + 1) % 16]
    qf(trim, [a[0], a[1], z2 + 1.6], [b[0], b[1], z2 + 1.6], [b[0], b[1], z2 + 2.6], [a[0], a[1], z2 + 2.6], [rx - (a[0] + b[0]) / 2, ry - (a[1] + b[1]) / 2, 0])
  }
  cap(roof, ringI, z2 + 1.6, true)
  for (let k = 0; k < 16; k++) {
    const t = (2 * Math.PI * (k + 0.5)) / 16
    if (Math.sin(t) < 0.35) continue // only the faces outside the range
    const ox = Math.cos(t), oy = Math.sin(t), d = ROUND_R * Math.cos(Math.PI / 16) + 0.05
    const P = (a: number, z: number): V3 => [rx + ox * d - oy * a, ry + oy * d + ox * a, z]
    for (const [zA, zB] of [[T + 0.8, T + 4.4], [z1 + 0.6, z1 + 4.2], [z2 - 2.2, z2 + 0.8]] as [number, number][]) {
      const w = 0.6
      const pts: [number, number][] = [[-w, zA], [w, zA]]
      for (let s = 0; s <= 4; s++) pts.push([w * Math.cos((Math.PI * s) / 4), zB - w + w * Math.sin((Math.PI * s) / 4)])
      for (let s = 1; s < pts.length - 1; s++) tf(win, P(...pts[0]), P(...pts[s]), P(...pts[s + 1]), [ox, oy, 0])
    }
  }
}

// ---------------------------------------------------------------------------

function build() {
  platform()
  alcazar()
  westRange()
  // Shift to the anchor.
  for (const p of [render, trim, roof, win, white, garden]) {
    for (let i = 0; i < p.pos.length; i += 3) {
      p.pos[i] -= ANCHOR_U
      p.pos[i + 2] += ANCHOR_V // glTF z = -map y
    }
  }
  // At night the Caballero Alto's belvedere is lit; the walls only softly.
  const TX = 81 - ANCHOR_U, TY = -10.5 - ANCHOR_V
  const floodlight = (p: V3, n: V3) => {
    const tower = Math.hypot(p[0] - TX, p[1] - TY) < 6 && p[2] > T + G1 + 7
    return (tower ? 0.85 : 0.2) * (n[2] > 0.7 ? 0.4 : 1)
  }
  return [
    { part: render, material: { ...finish('chapultepec-render', 0xd9cebb), floodlight } },
    { part: trim, material: { ...finish('chapultepec-stone', 0xab9886), floodlight } },
    { part: roof, material: finish('chapultepec-terrace-roof', 0xd49a76) },
    { part: win, material: PALETTE.window },
    { part: white, material: { ...finish('chapultepec-white', 0xf1eee8), floodlight } },
    { part: garden, material: finish('chapultepec-garden', 0x93a57e) },
  ]
}

if (import.meta.main) {
  const id = 'mexico-city-chapultepec-castle'
  const parts = build().filter(({ part }) => part.triangles)
  const tris = parts.reduce((s, { part }) => s + part.triangles, 0)
  for (const { part, material } of parts) console.log(`  ${material.name}: ${part.triangles}`)
  const glb = writeGlb('Chapultepec Castle', parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', source: `generators/${id}.ts` })
  if (tris > 6500) throw new Error(`${id}: ${tris} triangles`)
  if (glb.length > 250 * 1024) throw new Error(`${id}: ${glb.length} bytes`)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}
