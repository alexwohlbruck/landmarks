/**
 * Bosingak (보신각), the bell pavilion on Jongno, Seoul (rebuilt 1979 in
 * reinforced concrete in the traditional form) — original procedural
 * geometry, CC0-1.0.
 * bun generators/seoul-bosingak.ts
 *
 * Built with the hanok kit in seoul-geunjeongjeon.ts.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/708772637, 37.5697883,
 * 126.9836789. Its long sides run at 39.1°, so the catalog bearing is 129.1:
 * the frame's -y is 309°, the front with the name board and the stair,
 * towards the Jonggak crossing; Jongno Tower stands 100 m north, behind its
 * north-east corner (it shows behind the south-east side in Mortel's photo).
 *
 * Identity: a two-storey open pavilion, 5 × 4 bays, under one big
 * hipped-and-gabled (paljak) roof with upswept corners: tall red columns
 * through an open ground storey; the upper floor's red beam band and the
 * red railing of its balcony all round; the upper storey open, the great
 * bronze bell hanging in it; dense green dancheong brackets and the
 * gold-on-dark name board 普信閣; a low granite platform with a stone
 * balustrade and the front stair. At night the pavilion is floodlit: the
 * red, the soffit and the brackets carry `floodlight`.
 *
 * Evidence:
 *  - plan: OSM way/708772637, 25.2 × 19.4 m (the eaves); tags height 13,
 *    building:levels 2, roof tile. Published (ko.wikipedia, 보신각): 5 × 4
 *    bays, two storeys, rebuilt 1979. The bell: 3.18 m high, 2.28 m across
 *    (the 1985 bell, ko.wikipedia 보신각 종 summary, rounded).
 *  - proportions: measured on the level front view 20240413 Bosingak
 *    (Bosingak(20240413).jpg) at ~49 px/m (the eaves at OSM's 25.2 m): the
 *    columns on a 5-bay grid ±8.9 m, the bays nearly equal; the side 4 bays
 *    ±6.0 m (OSM depth less the same overhang); platform 1.1 m with a 0.75 m
 *    balustrade; the upper floor's beam band 4.6–5.7 m, railing to 6.4 m;
 *    upper lintel ~7.8, bracket band to 9.4, eave's lower edge ~9.0 m at the
 *    middle (tile top 9.75); ridge top ~13.5 m (photo, corrected for the ridge standing back; OSM says 13);
 *    ridge ~15 m between its ornaments, the gables ~7 m wide at the foot.
 *  - colours: daylight photos: column and beam red #a0403a, green
 *    brackets, dark blue-grey tile, granite platform; the bell bronze, dark.
 *  - terrain: Mapterhorn has no z15 tiles over Seoul, so `terrain.ts` could
 *    not check the site; the plaza is flat. Elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Bosingak(20240413).jpg, YellowTurtle9, CC BY-SA 4.0 (front, level)
 *  - Bosingak_Bell_Pavilion,_Seoul_(1)_(26259311707).jpg, Richard Mortel, CC BY 2.0 (south-east, Jongno Tower behind)
 *  - Bosingak_Bell_Pavilion,_Seoul_(2)_(40419747494).jpg and (3)_(27257575928).jpg, Richard Mortel, CC BY 2.0
 *  - 20240413_Bosingak_01.jpg, Jjw, CC BY 4.0 (front)
 *  - Bosingak,_Seoul.jpg, Tristan Surtel, CC BY-SA 4.0 (west, gable)
 *  - Boshingak.jpg, Bcody80, public domain
 * No commercial imagery. No look-only references.
 *
 * Left out: the inner ring of lower columns (drawn as the open grid's
 * perimeter only), the gourd-shaped balusters (the rail stands on posts),
 * the tile courses, the board's lettering, the japsang figures.
 */
import { Part, type V3 } from './mesh'
import { bar, box, brackets, columns, hanokMaterials, hanokParts, hyeonpan, platform, prism, roof, saveHanok, storey, tally } from './seoul-geunjeongjeon'

function build() {
  const P = hanokParts()
  const PH = 1.1 // the platform
  platform(P, [{
    x0: -12.4, x1: 12.4, y0: -9.6, y1: 9.6, z0: 0, z1: PH,
    stairs: [{ side: 's', at: 0, width: 4.2 }],
  }], { post: 2.6, railH: 0.75 })
  tally(P, 'platform')

  // Ground storey: tall red columns, open; a second ring of columns inside.
  const xs = [-8.9, -5.35, -1.8, 1.8, 5.35, 8.9]
  const ys = [-6.0, -3.0, 0, 3.0, 6.0]
  const F0 = 4.6, F1 = 5.7 // the upper floor's beam band
  columns(P, xs, ys, PH, F0, 0.42, { n: 10 })
  columns(P, [-5.35, -1.8, 1.8, 5.35], [-3.0, 0, 3.0], PH, F0, 0.38, { n: 8 })
  // The upper floor: a red beam band that runs out past the columns, its
  // painted underside over the open ground storey.
  const O = 1.15
  box(P.red, xs[0] - O, ys[0] - O, F0, xs[5] + O, ys[4] + O, F1, 't')
  tally(P, 'ground storey')

  // Balcony railing at the band's edge: rail and kerb on posts.
  const R0 = F1, RT = F1 + 0.75, rx = xs[5] + O - 0.15, ry = ys[4] + O - 0.15
  const ring: [number, number][] = [[-rx, -ry], [rx, -ry], [rx, ry], [-rx, ry]]
  for (let k = 0; k < 4; k++) {
    const [ax, ay] = ring[k], [bx, by] = ring[(k + 1) % 4]
    bar(P.red, [[ax, ay, RT - 0.16], [bx, by, RT - 0.16]], 0.22, 0.16, 0)
    bar(P.green, [[ax, ay, R0], [bx, by, R0]], 0.24, 0.2, 0, true)
    const L = Math.hypot(bx - ax, by - ay), n = Math.round(L / 1.2)
    for (let i = 1; i < n; i++) {
      const x = ax + (bx - ax) * i / n, y = ay + (by - ay) * i / n
      box(P.red, x - 0.09, y - 0.09, R0 + 0.2, x + 0.09, y + 0.09, RT - 0.16, 'tb')
    }
  }

  // Upper storey: open between the columns; lintel and the dense brackets.
  const UL1 = 7.6, UL2 = 8.1, UB1 = 9.4
  storey(P, xs, ys, F1, UL1, UL2, () => 'open')
  columns(P, xs, ys, F1, UL2, 0.36, { n: 10 })
  brackets(P, xs, ys, UL2, UB1, { per: 2, depth: 1.25, width: 0.5 })
  // The ceiling over the bell.
  box(P.teal, xs[0], ys[0], UB1, xs[5], ys[4], UB1 + 0.05, 'nsewt')
  tally(P, 'upper storey')

  // The bell: a bronze body flaring to the lip, hung from a beam.
  bell(P.roof, 0, 0, F1 + 0.6, 3.2, 1.15)
  box(P.red, -2.0, -0.25, UL1 - 0.3, 2.0, 0.25, UL1, '')
  box(P.roof, -0.15, -0.15, F1 + 0.6 + 3.2, 0.15, 0.15, UL1 - 0.3, 'tb')
  tally(P, 'bell')

  roof(P, {
    kind: 'paljak', ex: 11.6, ey: 8.7, ze: 9.75, gx: 7.3, gy: 3.4, zg: 11.7, zr: 12.85,
    lift: 1.4, flare: 1.0, sag: 0.4, th: 0.75,
    soffit: { bx: xs[5] + 1.0, by: ys[4] + 1.0, zb: UB1 },
    ridge: { h: 0.65, w: 0.8, ornament: 1.0 }, ridgeSag: 0.25,
  })
  hyeonpan(P, 0, ys[0] - 0.75, UL2 + 0.4, 3.4, 1.1, 0.2)
  tally(P, 'roof')

  return hanokMaterials(P, { red: 0.75, teal: 0.7, green: 0.4, stone: 0.4 })
}

/** A bell, `h` tall from its lip at z0, radius r at the lip, smooth-shaded. */
function bell(p: Part, x: number, y: number, z0: number, h: number, r: number) {
  // Profile from the lip up: (height fraction, radius fraction).
  const prof: [number, number][] = [[0, 1], [0.08, 0.97], [0.35, 0.86], [0.7, 0.8], [0.93, 0.74], [1, 0.55]]
  for (let k = 0; k < prof.length - 1; k++) {
    prism(p, x, y, z0 + prof[k][0] * h, z0 + prof[k + 1][0] * h, prof[k][1] * r, prof[k + 1][1] * r, 12)
  }
  // The crown cap.
  const top = z0 + h, rt = prof[prof.length - 1][1] * r
  for (let i = 0; i < 12; i++) {
    const a = (i + 0.5) / 12 * 2 * Math.PI, b = (i + 1.5) / 12 * 2 * Math.PI
    const A: V3 = [x + rt * Math.cos(a), y + rt * Math.sin(a), top], B: V3 = [x + rt * Math.cos(b), y + rt * Math.sin(b), top]
    p.tri(A, B, [x, y, top + 0.15])
  }
}

if (import.meta.main) await saveHanok('seoul-bosingak', 'Bosingak', [37.5697883, 126.9836789], 129.1, build(), 6500)
