/**
 * One Commerce Square, 2005 Market Street, Philadelphia (Pei Cobb Freed &
 * Partners, 1987) — original procedural geometry, CC0-1.0.
 * bun generators/phl-one-commerce-square.ts
 * (uses the shared kit exported by generators/phl-comcast-center.ts)
 *
 * Also exports `buildCommerceTower`, the tower both Commerce Square twins are
 * built from; generators/phl-two-commerce-square.ts calls it with its own
 * plan. This file's own build runs only under `import.meta.main`.
 *
 * Map frame, turned to the building: +x east along Market Street, +y north,
 * z up, metres. BEARING 9.0, the Center City grid. Origin = area centroid of
 * the OSM outline way/333939821 (-75.174604, 39.954272), on the ground.
 *
 * Form (the GardenStreetBridge skyline crop, Wobbanight series): a granite
 * tower of horizontal window bands, 47 x 29 m in plan, that steps down to the
 * north and south in a ziggurat: wings to 108 m, then 66 m and 31 m steps
 * that occupy only the outer (west) half, so the twins mirror each other
 * across their plaza. Each setback has a raised parapet with a frieze. On the
 * roof a narrow dark attic runs east-west between two small lanterns, square
 * boxes turned 45 degrees with pyramid caps and a square opening, standing on
 * the east and west faces: the twins' signature "ears". Low granite podium
 * wings fill the rest of the lot.
 *
 * Twins: One and Two Commerce Square share every height (lidar agrees within
 * 0.7 m) and form; they differ only in being mirrored east-west (One's lower
 * steps are on its west side, Two's on its east) and in small plan
 * differences taken from OSM for each.
 *
 * Evidence
 * - OSM way/333939821 (outline, One Commerce Square) and its parts
 *   way/333316060 (main block, 160.9 m, 41 levels), way/333434760 (attic,
 *   172.2 m), way/333316061 and way/333316062 (wings, 113 m, 28 levels),
 *   way/333316063 and way/333316068 (steps, 72 m, 17 levels), way/335570957
 *   and way/333434758 (steps, 35 m), way/333316064 and way/344020956 (podium,
 *   15 m). All are replaced.
 * - USGS 3DEP lidar USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown 2015),
 *   0.5 m grid in this frame, above the Market Street ground (the lowest the
 *   tower stands on; the driveway west of the tower dips 3 m lower and is
 *   outside the outline): main roof 157.6 m with a 2.3 m parapet; attic
 *   166.0 m, x -20..20, y -4.6..6.4; lantern peaks 170.7 m at the east and west
 *   faces; wings 108.0 m (+2.4 m parapet); steps 66.0 m (+2.5) and 31.8 m (+2.4);
 *   podium 12.7 m. Published 565 ft (172 m) is to the lantern tops above the
 *   sidewalk on the low side.
 * - Mapterhorn terrain: about 3 m of rise from Market St to the north side;
 *   ordinary sloped site, elevation 0.
 * - Published: 565 ft (172 m), 41 storeys, 1987, Pei Cobb Freed (Wikipedia,
 *   "Commerce Square").
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 * - "Commerce Square cropped.jpg", GardenStreetBridgeSchuylkillRiverSkyline,
 *   CC BY 3.0 (both towers from the north-west: steps, attic, lanterns, banding)
 *   https://commons.wikimedia.org/wiki/File:Commerce_Square_cropped.jpg
 * - "Commerce Square Philadelphia a.jpg", Wobbanight, CC0 (from
 *   below: setback parapets with the diamond frieze, granite colour)
 *   https://commons.wikimedia.org/wiki/File:Commerce_Square_Philadelphia_a.jpg
 *
 * Estimated: the window bands (two storeys a band, 4.9 m of glass over a
 * 3 m granite spandrel, broken by piers every 16 m or so; the photos show a
 * horizontal band per floor, which would shimmer at map distance); the lanterns' size (a 7.1 m square turned
 * 45 degrees, centred on the face line where the lidar peaks are, body to the
 * attic top, cap to the lidar peak, its lower part a pier down the face to
 * 146 m; scaled from the skyline crop) and their dark openings; the attic's louvre band.
 *
 * Colours (daylight photos, pulled to the palette's lightness): a warm
 * grey-beige granite #aea294; the windows a dark grey-blue (window #5f6c78);
 * the attic louvres dark graphite #6a6a6c; the parapet bands a paler granite.
 *
 * Night: the office windows glow (window). Granite, attic and lanterns are
 * unlit (no licensed night photo shows them lit).
 *
 * Doubts: the lanterns' exact form at the top (a pyramid cap over an open
 * box, seen only from far away); the podium's plaza side is simplified.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { box, band, facePanel, saveTower, type P2 } from './phl-comcast-center'

export type Rect = [number, number, number, number] // x0, x1, y0, y1
export type CommercePlan = {
  main: Rect
  wings: Rect[]   // 108 m
  steps72: Rect[] // 66 m
  steps35: Rect[] // 31.8 m
  podium: Rect[]  // 12.7 m
  attic: Rect
  lanterns: P2[]  // centres
  h: { main: number; wing: number; s72: number; s35: number; podium: number; attic: number; lantern: number }
}

export function buildCommerceTower(plan: CommercePlan) {
  const granite = new Part(), trim = new Part(), win = new Part(), louvre = new Part(), roof = new Part()
  const H = plan.h
  const PAR = 2.4 // parapet
  type B = { r: Rect; h: number; glazed: boolean }
  const boxes: B[] = [
    { r: plan.main, h: H.main, glazed: true },
    ...plan.wings.map((r) => ({ r, h: H.wing, glazed: true })),
    ...plan.steps72.map((r) => ({ r, h: H.s72, glazed: true })),
    ...plan.steps35.map((r) => ({ r, h: H.s35, glazed: true })),
    ...plan.podium.map((r) => ({ r, h: H.podium, glazed: true })),
  ]
  for (const b of boxes) {
    const [x0, x1, y0, y1] = b.r
    box(granite, x0, x1, y0, y1, 0, b.h + PAR, null, 0.4)
    // parapet: a roof at h inside a 0.8 m wall
    box(roof, x0 + 0.8, x1 - 0.8, y0 + 0.8, y1 - 0.8, b.h, b.h + 0.01, roof, 0.2)
    // the pale frieze band on the parapet
    band(trim, x0, x1, y0, y1, b.h + PAR - 1.0, 1.4, 0.12, 0.4)
    // parapet top and inner walls
    const r0: P2[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
    const r1: P2[] = [[x0 + 0.8, y0 + 0.8], [x1 - 0.8, y0 + 0.8], [x1 - 0.8, y1 - 0.8], [x0 + 0.8, y1 - 0.8]]
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4, z = b.h + PAR
      trim.quad([...r1[i], z], [...r0[i], z], [...r0[j], z], [...r1[j], z])
      // inner wall faces inward (toward the roof)
      granite.quad([...r1[j], b.h], [...r1[i], b.h], [...r1[i], z], [...r1[j], z])
    }
  }

  /** Height to which a point just outside a face is buried in another box. */
  const buried = (px: number, py: number, self: B) => {
    let z = 0
    for (const o of boxes) {
      if (o === self) continue
      const [x0, x1, y0, y1] = o.r
      if (px > x0 && px < x1 && py > y0 && py < y1) z = Math.max(z, o.h + PAR)
    }
    return z
  }

  // Window bands: two storeys a band, each face split by a few granite piers
  // into segments about 12 m long, so the faces read as the photos' horizontal
  // banding without per-floor stripes.
  const FLOOR = 3.95, GROUP = 2 * FLOOR, SEG = 16, PIER = 1.0, EDGE = 1.6, Z0 = 6.0
  for (const b of boxes) {
    const [x0, x1, y0, y1] = b.r
    const faces: Array<[P2, P2, P2]> = [ // a, b, outward normal
      [[x0, y0], [x1, y0], [0, -1]], [[x1, y0], [x1, y1], [1, 0]],
      [[x1, y1], [x0, y1], [0, 1]], [[x0, y1], [x0, y0], [-1, 0]],
    ]
    for (const [a, c, n] of faces) {
      const L = Math.hypot(c[0] - a[0], c[1] - a[1])
      if (L < 2 * EDGE + 2) continue
      const ns = Math.max(1, Math.round((L - 2 * EDGE) / SEG)), w = (L - 2 * EDGE) / ns
      const at = (t: number): [number, number] => [a[0] + ((c[0] - a[0]) * t) / L + n[0] * 0.3, a[1] + ((c[1] - a[1]) * t) / L + n[1] * 0.3]
      for (let i = 0; i < ns; i++) {
        const t0 = EDGE + i * w + PIER / 2, t1 = EDGE + (i + 1) * w - PIER / 2
        const zb = Math.max(...[t0 + 0.1, (t0 + t1) / 2, t1 - 0.1].map((t) => buried(...at(t), b)))
        let z = Z0
        if (zb > 0) z = Z0 + Math.ceil((zb + 1.0 - Z0) / GROUP) * GROUP
        for (; z + GROUP - 2.4 <= b.h - 0.8; z += GROUP) facePanel(win, a, c, t0 / L, t1 / L, z, z + GROUP - 3.0, 0.05)
      }
    }
  }

  // Ground-floor glazing between the podium piers is part of the window grid above (Z0 = 6 m).

  // ---------- the attic: a narrow dark louvred block ----------
  {
    const [x0, x1, y0, y1] = plan.attic
    box(granite, x0, x1, y0, y1, H.main, H.attic, roof, 0.3)
    const faces: Array<[P2, P2]> = [[[x0, y0], [x1, y0]], [[x1, y1], [x0, y1]]]
    for (const [a, c] of faces) {
      const L = Math.abs(c[0] - a[0]), n = Math.round(L / 3)
      for (let i = 0; i < n; i++) {
        const s0 = (i + 0.15) / n, s1 = (i + 0.85) / n
        facePanel(louvre, a, c, s0, s1, H.main + PAR + 0.6, H.attic - 1.0, 0.05)
      }
    }
  }

  // ---------- the lanterns: 45-degree boxes with pyramid caps ----------
  for (const [cx, cy] of plan.lanterns) {
    const r = 5.0 // centre to corner (a 7.1 m square turned 45 degrees; a little bolder than measured for phone size)
    const pts: P2[] = [[cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy]]
    // The lantern straddles the face; its body runs down the face as a pier,
    // so the part past the edge stands on the wall rather than hanging.
    const z0 = H.main - 12, z1 = H.attic + 0.5, zt = H.lantern
    for (let i = 0; i < 4; i++) {
      const p = pts[i], q = pts[(i + 1) % 4]
      granite.quad([...p, z0], [...q, z0], [...q, z1], [...p, z1])
      granite.tri([...p, z1], [...q, z1], [cx, cy, zt])
      // a square opening high on each face
      facePanel(louvre, p, q, 0.28, 0.72, z1 - 5.0, z1 - 1.2, 0.06)
    }
    // eaves band
    const e = r + 0.5
    const ep: P2[] = [[cx, cy - e], [cx + e, cy], [cx, cy + e], [cx - e, cy]]
    for (let i = 0; i < 4; i++) {
      const p = ep[i], q = ep[(i + 1) % 4]
      trim.quad([...p, z1 - 0.8], [...q, z1 - 0.8], [...q, z1], [...p, z1])
      trim.quad([...pts[i], z1], [...p, z1], [...q, z1], [...pts[(i + 1) % 4], z1])
    }
  }

  return [
    { part: granite, material: finish('csq-granite', 0xaea294) },
    { part: trim, material: finish('csq-trim', 0xd6cdc1) },
    { part: win, material: { name: 'window', color: 0x5f6c78, roughness: 0.35 } },
    { part: louvre, material: finish('csq-louvre', 0x6a6a6c) },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) {
  const parts = buildCommerceTower({
    main: [-24.3, 22.5, -13.4, 16.0],
    wings: [[-24.5, 18.2, -22.5, -13.0], [-23.9, 18.4, 15.6, 24.6]],
    steps72: [[-24.6, 9.2, -31.5, -22.1], [-23.8, 9.9, 24.2, 34.0]],
    steps35: [[-24.7, -5.4, -40.9, -31.1], [-23.7, -4.1, 33.6, 43.1]],
    podium: [[-5.4, 22.4, -41.2, -13.0], [22.0, 26.9, -36.0, -21.5], [26.5, 36.6, -26.4, -21.5], [-4.1, 22.7, 15.6, 42.9]],
    attic: [-20.0, 20.0, -4.6, 6.4],
    lanterns: [[-23.3, 0.9], [21.6, 0.9]],
    h: { main: 157.6, wing: 108.0, s72: 66.0, s35: 31.8, podium: 12.7, attic: 166.0, lantern: 170.7 },
  })
  await saveTower('phl-one-commerce-square', 'One Commerce Square', parts, {
    bearing: 9.0, anchor: { lng: -75.174604, lat: 39.954272 }, height: 170.7,
    replaces: ['way/333939821', 'way/333316060', 'way/333434760', 'way/333316061', 'way/333316062', 'way/333316063', 'way/333316068', 'way/335570957', 'way/333434758', 'way/333316064', 'way/344020956'],
  })
}
