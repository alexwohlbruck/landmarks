/**
 * JFK Airport Terminal 1 (1998), Queens — procedural, CC0-1.0, no textures.
 * bun generators/nyc-jfk-terminal-1.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 59.9°: the headhouse's landside front (OSM's long straight edge)
 * runs along x at y = 100.9, facing model north. Anchor: area centroid of
 * the OSM outline way/284907685 (headhouse, its west wing and the pier).
 *
 * Status: still in use; to be demolished once the New Terminal One's later
 * phases open (2028–30, Wikipedia). OSM maps it, so it is drawn.
 *
 * Identifying features (photos): the long glazed landside front under a
 * butterfly roof, high at both ends and dipping to the centre, where a white
 * arch spans the entrance; the roof rising behind the front to a long crest;
 * lower glazed halls behind, and a long plain pier to the airside.
 *
 * Evidence
 * - OSM way/284907685 "Terminal 1" (tagged 23.1 m).
 * - Lidar: USGS 3DEP NY_NewYorkCity, flown 2017, 1 m, heights above the
 *   apron (ground_min 0.56 m + 2.15 m): the hall roof's crest at 23.3 m
 *   (y ≤ 45, its back edge an arc through (−100, 50), (5, 40), (110, 50));
 *   in front of it the roof falls to the glass front, steeply at the centre
 *   (13.6 m at y 90, x 5) and gently at the ends (19.5 m at x −85 and 95),
 *   fitted as z = 23.3 − (y − 45)·(0.216 − 0.00147·|x − 5|), residual
 *   ≲ 1 m; the spine behind the centre 23.1 m; the halls behind 19.3 m
 *   (west) and 18.4 m (east); the pier 12.8 m; low wings 7.2 m and 10 m.
 * - Published: opened May 1998, William Nicholas Bodouva + Associates
 *   (Wikipedia, "JFK Airport Terminal 1").
 * - Photos (Wikimedia Commons):
 *   https://commons.wikimedia.org/wiki/File:At_New_York_City_2024_150.jpg
 *     (Mike Peel, CC BY-SA 4.0) the landside front: butterfly roof, arch, glass;
 *   https://commons.wikimedia.org/wiki/File:JFK-Terminal1-VariousAirlinesAerial_(36914267725).jpg
 *     (formulanone, CC BY-SA 2.0) aerial from the airside: dark glazed halls, pier;
 *   https://commons.wikimedia.org/wiki/File:John_F._Kennedy_Airport_2021a.jpg
 *     (Antony-22, CC BY-SA 4.0) aerial;
 *   https://commons.wikimedia.org/wiki/File:JFK_Airport_td_(2021-10-11)_050_-_Van_Wyck_Expressway,_Terminal_1.jpg
 *     (Tdorante10, CC BY-SA 4.0) the front from the Van Wyck;
 *   https://commons.wikimedia.org/wiki/File:Terminal_1_JFK_Departures.jpg
 *     (Mybirthday647, CC0) the departures curb.
 *
 * Estimated: the arch over the entrance (span 50 m, rising to 22 m, from
 * the front photo against the lidar's roof heights); window bands; the
 * glazing of the halls behind. Rooftop plant is left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, clip, ccw, rect, zones, slopedZone, circleRing, type Facade } from './nyc-jfk-terminal-5'
import { inside, finishModel } from './nyc-570-lexington'

const OUTLINE: XY[] = ccw([[-108.3, 53.8], [-84.9, 91.4], [-84.7, 98.2], [-84.6, 100.9], [-79.9, 100.9], [-74.6, 100.9], [-60.3, 100.9], [-41.1, 100.9], [-20.4, 100.8], [0.5, 100.8], [1.8, 100.9], [4.0, 100.9], [5.6, 100.9], [8.8, 100.9], [35.1, 100.9], [46.0, 100.9], [73.2, 100.9], [82.2, 100.8], [93.6, 100.8], [93.6, 91.4], [102.0, 77.8], [116.5, 54.3], [105.9, 49.2], [96.7, 45.6], [97.7, 42.6], [99.2, 43.1], [108.3, 27.2], [100.1, 23.6], [91.5, 20.8], [82.8, 18.3], [74.1, 16.1], [65.2, 14.1], [64.4, 13.9], [56.4, 12.4], [47.5, 10.9], [38.5, 9.7], [42.2, -21.0], [34.0, -22.7], [37.5, -35.8], [44.2, -34.3], [46.9, -43.1], [40.3, -45.0], [40.8, -46.7], [41.6, -49.8], [40.4, -50.1], [64.6, -135.1], [65.1, -137.0], [69.2, -135.9], [71.5, -144.4], [67.5, -145.8], [75.2, -173.2], [81.3, -196.3], [84.4, -195.2], [84.2, -194.5], [86.0, -193.9], [88.9, -206.3], [91.7, -218.6], [92.7, -223.1], [84.2, -225.5], [86.8, -235.9], [80.4, -237.6], [74.0, -215.2], [72.6, -215.4], [70.1, -206.6], [60.9, -209.0], [65.5, -225.4], [58.7, -227.4], [63.2, -242.5], [59.9, -243.3], [56.4, -244.3], [44.6, -201.8], [47.6, -201.0], [38.3, -167.7], [30.6, -169.8], [27.7, -168.0], [27.2, -167.7], [25.2, -166.4], [24.2, -162.8], [22.5, -156.4], [34.2, -152.9], [23.1, -113.6], [15.4, -116.0], [12.3, -113.8], [10.0, -112.4], [8.1, -105.5], [6.9, -101.2], [17.4, -98.2], [17.9, -100.3], [19.2, -99.7], [14.7, -83.7], [6.4, -54.5], [2.1, -55.4], [-0.4, -47.1], [3.9, -45.7], [0.7, -33.9], [-7.7, -32.6], [-7.5, -30.5], [-21.9, -29.5], [-37.6, -28.1], [-59.0, -24.9], [-59.4, -27.2], [-56.5, -27.7], [-58.1, -37.4], [-70.2, -35.0], [-68.8, -27.6], [-83.1, -24.4], [-75.4, 6.0], [-83.8, 8.2], [-92.1, 10.8], [-96.2, 12.1], [-104.4, 15.0], [-108.4, 16.6], [-117.3, 19.9], [-122.0, 9.3], [-119.5, 8.2], [-124.3, -2.5], [-126.8, -1.4], [-127.6, -3.3], [-128.2, -4.9], [-131.4, -3.4], [-153.7, 6.2], [-160.5, -8.9], [-161.2, -10.4], [-165.8, -8.4], [-167.6, -7.6], [-157.4, 15.4], [-141.4, 8.4], [-137.7, 16.1], [-132.7, 14.0], [-127.9, 24.8], [-138.7, 29.9], [-149.8, 36.0], [-122.0, 59.8]])

const XV = 5 // the butterfly's valley
const hallZ = (q: XY) => 23.3 - Math.max(0, q[1] - 45) * (0.216 - 0.00147 * Math.abs(q[0] - XV))
const ARC_C: XY = [5, 596], ARC_R = 556 // the hall's curved back edge

function build() {
  const panel = new Part(), win = new Part(), roof = new Part(), metal = new Part(), white = new Part()
  const ext = [OUTLINE]
  const STEP = (1 * Math.PI) / 180
  const disc = circleRing(ARC_C, ARC_R, STEP / 4)
  const hall = clip('intersection', [OUTLINE], [disc])
  const halves = [...clip('intersection', hall, [rect(-300, -300, XV, 300)]), ...clip('intersection', hall, [rect(XV, -300, 300, 300)])]
  const notHall = (rs: XY[][]) => clip('difference', rs, [disc])
  const spine = notHall(clip('intersection', [OUTLINE], [rect(-20, -5, 30, 60)]))
  const minus = (rs: XY[][], ...cut: XY[][]) => cut.length ? clip('difference', rs, ...cut.map((c) => [c])) : rs
  const bandW = minus(notHall(clip('intersection', [OUTLINE], [rect(-160, 5, -20, 70)])))
  const bandE = minus(notHall(clip('intersection', [OUTLINE], [rect(30, 5, 130, 70)])))
  const lowW = clip('intersection', [OUTLINE], [rect(-200, -60, -120, 5)])
  const lowC = clip('intersection', [OUTLINE], [rect(-55, -60, -5, -5)])
  const pier = clip('difference', [OUTLINE], [disc], [rect(-20, -5, 30, 60)], [rect(-160, 5, -20, 70)], [rect(30, 5, 130, 70)], [rect(-200, -60, -120, 5)], [rect(-55, -60, -5, -5)])
  const band: Facade = { bay: 8, ratio: 0.85, floor: 4, group: 1, spandrel: 0, sill: 3.5, head: 1.6, ground: 3.5, minLength: 6 }
  const tallGlass: Facade = { bay: 7, ratio: 0.9, floor: 6, group: 2, spandrel: 0.8, sill: 4.5, head: 1.2, ground: 4.5, minLength: 6 }
  const list = [
    { rings: spine, z: 23.1, facade: tallGlass },
    { rings: bandW, z: 19.3, facade: tallGlass },
    { rings: bandE, z: 18.4, facade: tallGlass },
    { rings: lowW, z: 10, facade: band },
    { rings: lowC, z: 7.2, facade: band },
    { rings: pier, z: 12.8, facade: band },
  ]
  const inHall = (q: XY) => halves.some((r) => inside(q, r))
  const zoneAt = (q: XY) => { let h = 0; for (const z of list) for (const r of z.rings) if (inside(q, r)) h = Math.max(h, z.z); return Math.max(h, inHall(q) ? hallZ(q) : 0) }
  zones({ wall: panel, win, roof, coping: white, exterior: ext, list, heightAt: (q) => (inHall(q) ? hallZ(q) : 0) })

  // The hall: butterfly roof, glass front (deck-level doors to the roof).
  const front: Facade = { bay: 6.5, ratio: 0.9, floor: 5, group: 1, spandrel: 0.6, sill: 0.4, head: 0.9, ground: 0.4, minLength: 3 }
  for (const h of halves) {
    slopedZone({
      roof: metal, wall: panel, win, fascia: white, ring: h, z: hallZ, axis: 1, step: 6, exterior: ext,
      heightAt: (q) => (inHall(q) ? hallZ(q) : zoneAt(q)),
      facade: (a, b) => (Math.abs(a[1] - b[1]) < 0.3 && a[1] > 95 ? front : tallGlass),
    })
  }

  // The white arch over the entrance: a segmental arc in the plane of the front.
  {
    const y0 = 99.2, y1 = 101.2, xa = -20, xb = 30, zs = hallZ([xa, 100]) - 0.5, top = 22
    const half = (xb - xa) / 2, R = (half * half + (top - zs) ** 2) / (2 * (top - zs)), zc = top - R, xc = (xa + xb) / 2
    const a0 = Math.asin(half / R), n = 12, w = 1.2
    const pt = (t: number, r: number): [number, number] => [xc + r * Math.sin(t), zc + r * Math.cos(t)]
    for (let k = 0; k < n; k++) {
      const t0 = -a0 + (2 * a0 * k) / n, t1 = -a0 + (2 * a0 * (k + 1)) / n
      const [ox0, oz0] = pt(t0, R), [ox1, oz1] = pt(t1, R), [ix0, iz0] = pt(t0, R - w), [ix1, iz1] = pt(t1, R - w)
      const P = (x: number, y: number, z: number): V3 => [x, y, z]
      white.quad(P(ox0, y1, oz0), P(ox0, y0, oz0), P(ox1, y0, oz1), P(ox1, y1, oz1)) // extrados (up/out)
      white.quad(P(ix0, y0, iz0), P(ix0, y1, iz0), P(ix1, y1, iz1), P(ix1, y0, iz1)) // intrados (down/in)
      white.quad(P(ix0, y1, iz0), P(ox0, y1, oz0), P(ox1, y1, oz1), P(ix1, y1, iz1)) // north face (+y)
      white.quad(P(ox0, y0, oz0), P(ix0, y0, iz0), P(ix1, y0, iz1), P(ox1, y0, oz1)) // south face (−y)
    }
  }

  finishModel('JFK Airport Terminal 1', 'nyc-jfk-terminal-1', [
    { part: panel, material: finish('t1-panel', 0xc9cdd0) },
    { part: win, material: PALETTE.window },
    { part: roof, material: finish('t1-flat-roof', 0xdcddda) },
    { part: metal, material: finish('t1-metal-roof', 0xb3b8bc) },
    { part: white, material: PALETTE.trim },
  ], { bearing: 59.9, osm: 'way/284907685', height: 23.3 }, 6500)
}

if (import.meta.main) build()
