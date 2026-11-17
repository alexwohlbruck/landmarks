/**
 * Gyeonghoeru (경회루), the royal banquet pavilion of Gyeongbokgung, Seoul
 * (rebuilt 1867) — original procedural geometry, CC0-1.0.
 * bun generators/seoul-gyeonghoeru.ts
 *
 * Built with the hanok kit in seoul-geunjeongjeon.ts.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/170199469, 37.5797502,
 * 126.9759667. The pavilion's long (7-bay) front faces east; it is built
 * with that front to -y and its ridge along x, so the catalog bearing is
 * 272.0 (the outline's long sides run at 2.0°): the ridge runs north–south
 * and the front faces 92°.
 *
 * Identity: one huge hipped-and-gabled roof, far taller than the storeys
 * under it, with a long white ridge and small gables; the open upper hall
 * ringed by red posts and a red railing; and under it the forest of 48
 * pale stone pillars — square on the outside, round within — standing in
 * the pond on its island. The red stairs climb in the end bays of the
 * front. At night the pavilion is floodlit and its hall lit from inside:
 * the red frame, the soffits and the stone pillars carry `floodlight`; the
 * hall's dark inner screens are `window-2` (#55524f by day) and glow.
 *
 * Evidence:
 *  - plan: OSM outline way/170199469 (37.8 m N–S × 36.1 m E–W; no parts).
 *    Published (ko.wikipedia; namu/thewiki): 7 × 5 bays, 34.4 × 28.5 m,
 *    21.5 m high, 48 stone pillars (outer square, inner round); upper floor
 *    in three zones (outer ring of 24 posts, inner ring of 12 bays, core of
 *    3). The 34.4 m front is taken on the pillar lines; with ~3.3 m eaves
 *    the roof is longer than OSM's 37.8 m by ~1.5 m at each end (OSM looks
 *    traced short; the published figure wins).
 *  - heights: measured on kallerna's distant south-east view (little
 *    perspective), scaled by the 4.9 m bays (16.7 px/m): pillars 4.7 m,
 *    floor beams to 5.3 m, upper lintel 8.9–9.4 m, brackets to 10.1 m, the
 *    eave ~9.9 m mid-front (the upper storey about as tall as the pillars,
 *    as on AnbyG's east view), ridge top ~18 m. AnbyG's closer east view
 *    agrees once its perspective is allowed for. The published 21.5 m is
 *    ~2–4 m more; it may be taken from the pond bed or water (~1.5–2 m
 *    below the island) to the top of the ornaments; the photos win here
 *    and the gap is a doubt. The model's ridge top is 18.3 m above y = 0.
 *  - gable ~10 m wide at its foot; ridge ~27 m between the ornaments, half
 *    the eave length as on the east view (estimates).
 *  - the pond and the island's stone embankment are not modelled; the
 *    pillars stand on y = 0, the island's paving (as asked).
 *  - colours from the daylight photos: pale granite pillars, red frame and
 *    railing, green dancheong, dark grey tile, white ridges.
 *  - terrain: Mapterhorn has no z15 tiles over Seoul; terrain.ts could not
 *    check the site. Elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Gyeonghoeru_(Royal_Banquet_Hall).jpg, AnbyG, CC BY-SA 4.0 (east front)
 *  - Gyeonghoeru_(Royal_Banquet_Hall)_at_Gyeongbokgung_Palace,_Seoul.jpg, Frank Schulenburg, CC BY-SA 4.0
 *  - Gyeonghoeru_Seoul.jpg, kallerna, CC BY-SA 4.0
 *  - Gyeonghoeru_1.jpg, Kim Dae Jeung, CC0
 *  - Gyeonghoeru_bridge.jpg, Tristan Surtel, CC BY-SA 4.0
 *  - Eastern_Side_of_the_Gyeonghoeru_Pavilion_in_Gyeongbokgung_Palace.jpg, Ethan Doyle White, CC BY-SA 4.0
 *  - Gyeongbokgung_Gyeonghoeru_Front.jpg and _Lake_Side.jpg, Tungdangthanh, CC BY-SA 4.0
 *  - Gyeonghoeru_with_Blue_Sky.jpg, Smin630, CC BY-SA 4.0
 * No commercial imagery. No look-only references.
 *
 * Left out: the pond, the island, its balustrade and the three bridges; the
 * raised partition doors inside the upper hall (drawn as screens).
 */
import { hyeonpan, bar, box, brackets, columns, hanokMaterials, hanokParts, perimeter, prism, roof, saveHanok, storey, tally } from './seoul-geunjeongjeon'

function build() {
  const P = hanokParts()
  // Pillar grid: 7 bays along x (the front), 5 across.
  const HX = 34.4 / 2, HY = 28.5 / 2
  const xs = Array.from({ length: 8 }, (_, i) => -HX + i * (2 * HX) / 7)
  const ys = Array.from({ length: 6 }, (_, i) => -HY + i * (2 * HY) / 5)
  const PT = 4.7, FL = 5.3

  // Ground storey: 24 square outer pillars, 24 round inner ones.
  for (const [x, y] of perimeter(xs, ys)) box(P.stone, x - 0.5, y - 0.5, 0, x + 0.5, y + 0.5, PT, 'tb')
  const ixs = xs.slice(1, -1), iys = ys.slice(1, -1)
  for (const [x, y] of perimeter(ixs, iys)) prism(P.stone, x, y, 0, PT, 0.45, 0.42, 8)
  for (const [x, y] of perimeter(xs.slice(2, -2), ys.slice(2, -2))) prism(P.stone, x, y, 0, PT, 0.45, 0.42, 8)
  tally(P, 'pillars')

  // The floor: red beams on the pillars, the deck a little proud of them.
  const D = 0.7
  box(P.red, -HX - D, -HY - D, PT, HX + D, HY + D, FL, 't')
  // Red stairs in the two end bays of the front, climbing from the ends.
  for (const s of [-1, 1]) {
    const x0 = s * (HX - 0.6), x1 = s * (HX - 4.2), y0 = -HY + 0.7, y1 = -HY + 2.3
    const lo = Math.min(x0, x1), hi = Math.max(x0, x1)
    // A wedge: the stringer sides and the stepped slope as one plane.
    const top = s > 0 ? lo : hi, bot = s > 0 ? hi : lo
    // Written for the west stair (climbing east); the east one is its
    // mirror, so its windings flip.
    const f = <T,>(v: T[]) => (s < 0 ? v : [...v].reverse())
    const [qa, qb, qc, qd] = f([[bot, y0, 0], [top, y0, PT], [top, y1, PT], [bot, y1, 0]] as [number, number, number][])
    P.red.quad(qa, qb, qc, qd)
    const [ta, tb, tc] = f([[bot, y0, 0], [top, y0, 0], [top, y0, PT]] as [number, number, number][])
    P.red.tri(ta, tb, tc)
    const [ua, ub, uc] = f([[top, y1, 0], [bot, y1, 0], [top, y1, PT]] as [number, number, number][])
    P.red.tri(ua, ub, uc)
  }
  tally(P, 'floor')

  // Upper storey: the outer ring of posts with the railing at the deck edge,
  // and the inner hall's screens one bay in.
  const UL1 = 8.9, UL2 = 9.4, UB1 = 10.1
  columns(P, xs, ys, FL, UL2, 0.3)
  storey(P, xs, ys, FL, UL1, UL2, () => 'open')
  // The hall inside reads dark between the posts by day and glows at
  // night: a dark screen (window-2) on the inner ring, under its lintel.
  box(P.lattice, ixs[0], iys[0], FL, ixs[ixs.length - 1], iys[iys.length - 1], UL1, 'tb')
  storey(P, ixs, iys, FL, UL1, UL2, () => 'open')
  // Railing: top rail and sill all round, with a post at each bay's thirds.
  const R0 = FL, RT = FL + 0.95, rx = HX + D - 0.15, ry = HY + D - 0.15
  const ring: [number, number][] = [[-rx, -ry], [rx, -ry], [rx, ry], [-rx, ry]]
  for (let k = 0; k < 4; k++) {
    const [ax, ay] = ring[k], [bx, by] = ring[(k + 1) % 4]
    bar(P.red, [[ax, ay, RT - 0.16], [bx, by, RT - 0.16]], 0.2, 0.16, 0)
    bar(P.red, [[ax, ay, R0], [bx, by, R0]], 0.22, 0.28, 0, true)
    const L = Math.hypot(bx - ax, by - ay), n = Math.round(L / 1.65)
    for (let i = 1; i < n; i++) {
      const x = ax + (bx - ax) * i / n, y = ay + (by - ay) * i / n
      box(P.red, x - 0.08, y - 0.08, R0 + 0.28, x + 0.08, y + 0.08, RT - 0.16, 'tb')
    }
  }
  brackets(P, xs, ys, UL2, UB1, { per: 1, depth: 1.0, width: 0.5 })
  tally(P, 'upper storey')

  const O = 3.4
  roof(P, {
    kind: 'paljak', ex: HX + O, ey: HY + O, ze: 9.9, gx: 13.5, gy: 5.0, zg: 14.4, zr: 16.9,
    lift: 1.5, flare: 1.0, sag: 0.4, th: 0.8,
    soffit: { bx: HX + 1.0, by: HY + 1.0, zb: UB1 },
    ridge: { h: 1.1, w: 1.0, ornament: 1.6 }, ridgeSag: 0.3,
  })
  hyeonpan(P, 0, -HY - 1.0, UL2 + 0.1, 3.2, 1.2)
  // The ceiling over the hall, under the roof (closes the view up into it).
  box(P.teal, -HX, -HY, UB1, HX, HY, UB1 + 0.05, 'nsewt')
  tally(P, 'roof')

  return hanokMaterials(P, { red: 0.7, teal: 0.7, stone: 0.6 }, { lattice: 0x55524f })
}

if (import.meta.main) await saveHanok('seoul-gyeonghoeru', 'Gyeonghoeru', [37.5797502, 126.9759667], 272.0, build(), 6500)
