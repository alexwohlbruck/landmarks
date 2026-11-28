/**
 * Denver International Airport (DEN): the FAA air traffic control tower
 * (1995, 327 ft), beside the core of Concourse C, with the low base building
 * at its foot. Procedural, CC0-1.0, no textures.
 *
 *   bun generators/den-airport-control-tower.ts
 *
 * Frame: x east, y north, z up, metres, bearing 0. Anchor (-104.673697,
 * 39.862493): the centroid of OSM way/1121488193 (man_made=tower,
 * tower:type=aircraft_control, height=99). The lidar puts the shaft's
 * centre 1.5 m east and 3.5 m south of that small mapped circle; the model
 * follows the lidar.
 *
 * Why this tower: DEN has several airfield towers; this is the main FAA
 * tower in the middle of the concourses, the tallest (OSM height 99, lidar
 * 102.4 m to the radome), the one in nearly every photo of the airport. The
 * ramp towers on Concourses A and B belong to those models.
 *
 * Identifying features (photos): a slender octagonal concrete shaft, near
 * straight, flaring in a concave trumpet into a wide octagonal service
 * deck with a dark window band; above it a narrower octagonal cab of dark,
 * slightly outward-leaning glass under a white roof, and a white radome with
 * antennas. At its foot, south of it, a plain box with a window band.
 *
 * Evidence
 * - OSM: way/1121488193 (the tower, height 99), way/1121488192 (the base
 *   building, building=yes).
 * - Lidar: USGS 3DEP CO_DRCOG_2_2020 (flown 2020), 0.5 m grid, half 45 m.
 *   Above the apron (1635.4 m): the deck's rim 90-91 m at radius 9; the cab
 *   roof 97.7-98 m at radius about 6.5; the radome 101.2-102.4 m; the base
 *   building 13.1 m (rim 13.9) over x -13..17, y -36..-11.
 * - Published: 327 ft (99.7 m), opened 1995 (FAA; Wikipedia "Denver
 *   International Airport").
 * - Photos (Wikimedia Commons):
 *   - "DEN Air Traffic Control Tower.jpg", Bmurphy380, CC BY-SA 4.0: from the
 *     south, above: the whole profile, the base building, light grey
 *     concrete.
 *   - "Denver International Airport zsdfgb.jpg", Luciof, CC BY-SA 3.0: from
 *     the south-south-east, the flare and deck in warm light.
 *   - "Denver A Terminal.jpg", TastyPoutine, CC BY-SA 3.0: from the south-
 *     west in daylight.
 *   - "Southwest 737s in Denver (7921580338).jpg", DearEdward, CC BY 2.0: from
 *     the south-east.
 *   - "Denver International Airport - Colorado (54124034645).jpg", Tony
 *     Webster, CC BY 2.0: from the east at dusk.
 *   - "Denver Airport Control Tower (53910491201).jpg", Tony Webster, CC BY-SA
 *     2.0: silhouette at sunset (proportions).
 *
 * Estimated (photo, scaled to the lidar heights): the shaft's width (9.8 m
 * across the flats, widening to 10.4 m under the flare), the flare's start
 * (72 m), the deck's window band (85.5-88 m) under a white fascia (88-90.9 m), the cab (90.6-96.6 m,
 * 12.6 m across), the base building's window band.
 * Colours: the concrete light warm grey (daylight photos) with slightly
 * darker recessed grooves at the eight corners; the cab glass and the deck's
 * window band near-black (charcoal #4a4f57, as both read in the photos),
 * lit at night (`window`, `window-2`); white bands, roof and radome.
 * Doubts: the shaft's exact plan (octagonal in the photos, read as regular).
 */
import { Part, type V3 } from './mesh'
import { finish, windowVariant } from './palette'
import { lathe } from './clt-terminal'
import { box, panelRow, rect, type XY } from './atl-hartsfield-jackson-domestic-terminal'
import { DEN, writeModel } from './den-airport-concourse-a'

const CX = 1.5, CY = -3.5 // the shaft's centre (lidar)
const OCT = Math.PI / 8 // flats facing the cardinal directions

export function buildTower(detail: boolean) {
  const conc = new Part(), groove = new Part(), win = new Part(), deck = new Part(), white = new Part(), base = new Part()
  const seg = 8
  // An octagon's circumradius from its half-width across the flats.
  const R = (flat: number) => flat / Math.cos(Math.PI / 8)

  // ── the shaft and its concave flare: eight flat faces, each corner cut back
  // into a recessed vertical groove (photos), flat-shaded so the facets read
  const G = 0.55, IN = 0.3 // groove half-width along each face, and its depth
  const ring16 = (flat: number, z: number): V3[] => {
    const pts: V3[] = []
    for (let k = 0; k < seg; k++) {
      const a = OCT + (k / seg) * 2 * Math.PI, c: XY = [CX + R(flat) * Math.cos(a), CY + R(flat) * Math.sin(a)]
      const toward = (m: number): XY => { // a point G along the edge from corner k towards corner m
        const b = OCT + (m / seg) * 2 * Math.PI, d: XY = [CX + R(flat) * Math.cos(b) - c[0], CY + R(flat) * Math.sin(b) - c[1]]
        const l = Math.hypot(d[0], d[1]), g = Math.min(G * (flat / 4.9), 0.9)
        return [c[0] + (d[0] / l) * g, c[1] + (d[1] / l) * g]
      }
      const p0 = toward(k - 1), p1 = toward(k + 1)
      const ax = Math.cos(a), ay = Math.sin(a) // pull the groove's face in towards the axis
      pts.push([p0[0] - ax * IN, p0[1] - ay * IN, z], [p1[0] - ax * IN, p1[1] - ay * IN, z])
      void pts
    }
    return pts
  }
  const levels: [number, number][] = [[4.9, 0], [4.9, 30], [5.2, 72]]
  for (let i = 1; i <= 6; i++) { const t = i / 6; levels.push([5.2 + 4.2 * Math.pow(t, 2.2), 72 + 13.5 * t]) }
  const rings = levels.map(([fl, z]) => ring16(fl, z))
  for (let k = 0; k < rings.length - 1; k++) {
    const A = rings[k], B = rings[k + 1], n = A.length
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      // even i: the groove across a corner (pts 2k, 2k+1); odd i: a flat face
      ;(i % 2 === 0 ? groove : conc).quad(A[i], A[j], B[j], B[i])
    }
  }
  // the deck: a near-black window band under a thick white fascia, its roof
  const D = R(9.6)
  lathe(deck, CX, CY, [[R(9.4), 85.5], [R(9.4), 88.0], [D, 88.0]], seg, OCT)
  lathe(white, CX, CY, [[D, 88.0], [D, 90.9], [R(6.6), 90.9]], seg, OCT)
  // the cab: outward-leaning near-black glass, white roof band, roof
  lathe(win, CX, CY, [[R(6.0), 90.9], [R(6.4), 96.6]], seg, OCT)
  lathe(white, CX, CY, [[R(6.6), 96.6], [R(6.6), 97.8], [R(2.6), 97.8]], seg, OCT)
  // the top room and the radome
  lathe(white, CX, CY, [[R(2.6), 97.8], [R(2.6), 99.6], [2.0, 99.6]], seg, OCT)
  const dome: XY[] = []
  for (let i = 0; i <= 4; i++) {
    const a = (i / 4) * (Math.PI / 2)
    dome.push([2.0 * Math.cos(a) + 0.01, 100.4 + 2.0 * Math.sin(a)])
  }
  lathe(white, CX, CY, [[2.0, 99.6], ...dome], 10)
  if (detail) {
    for (let k = 0; k < 4; k++) {
      const a = OCT + (k / 4) * 2 * Math.PI + Math.PI / 4
      const x = CX + 5.6 * Math.cos(a), y = CY + 5.6 * Math.sin(a)
      box(white, white, rect(x - 0.12, y - 0.12, x + 0.12, y + 0.12), 97.8, 101.5, 0)
    }
  }
  // ── the base building (lidar footprint): its glazed upper storey at the top of the walls
  const Bq = rect(-13, -36, 17, -11)
  box(base, white, Bq, 0, 13.1, 0.4)
  for (let i = 0; i < 4; i++) {
    const a = Bq[i], b = Bq[(i + 1) % 4]
    panelRow(win, a, b, 9.6, 12.5, { bay: 7, gap: 0.6, end: 0.8 })
  }
  box(white, white, rect(-6, -30, 6, -22), 13.1, 15.0, 0.2) // rooftop plant
  return { conc, groove, win, deck, white, base }
}

if (import.meta.main) {
  const t = buildTower(false)
  await writeModel('den-airport-control-tower.glb', 'Denver International Airport, FAA Control Tower', [
    { part: t.conc, material: finish('den-tower-concrete', 0xd9d4ca) },
    { part: t.groove, material: finish('den-tower-groove', 0xb3ada3) },
    { part: t.white, material: finish('den-tower-white', 0xf0eee8) },
    { part: t.win, material: { name: 'window', color: 0x4a4f57, roughness: 0.35 } },
    { part: t.deck, material: windowVariant(2, 0x4a4f57) },
    { part: t.base, material: DEN.wall },
  ], { height: 102.4, maxTris: 5000, maxBytes: 250_000 })
}
