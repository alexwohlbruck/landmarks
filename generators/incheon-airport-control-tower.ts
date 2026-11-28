/**
 * Incheon International Airport control tower (the main air traffic control
 * tower, 100.4 m, opened 2001), between Terminal 1, the concourse and
 * Terminal 2 — procedural, CC0-1.0, no textures.
 * bun generators/incheon-airport-control-tower.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Anchor: OSM
 * node/3955261484 ("ICN tower 2", aeroway=tower, service=aircraft_control;
 * 126.4405567, 37.4609978). OSM maps no building here, so the model replaces
 * nothing.
 *
 * Identifying features (photos): a tall, plain, pale concrete shaft that
 * tapers as it rises, square with chamfered corners; near the top two glazed
 * stages, each an upturned (inverted) frustum leaning outwards — a larger
 * lower one, a narrow neck, then the cab — under a flat roof with a white
 * radome on a tall plinth; the shaft is warm beige-tan concrete and the
 * glazed stages read as darker grey glass in a bold white mullion grid
 * (colours from the calflier001 photo: slate `window`, concrete #d6c9b4); a low glazed pavilion at the foot.
 *
 * Evidence
 * - OSM: node/3955261484 (position only).
 * - Published: height 100.4 m, 22 storeys (English Wikipedia, "Incheon
 *   International Airport"; airport.kr).
 * - Photos (Wikimedia Commons):
 *   • "ATC TOWER AT SEOUL INCHEON AIRPORT SOUTH KOREA OCT 2012 (8178456597).jpg",
 *     calflier001, CC BY-SA 2.0 — the whole tower from near its foot; every
 *     stage's height and width is scaled from it along the shaft's axis
 *     (the photo is tilted), with the published 100.4 m as the scale.
 *   • "Incheon International Airport Air Traffic Control tower and terminal 2.jpg",
 *     Christophe95, CC BY-SA 4.0 — the tower from Terminal 1's gates, ~760 m off.
 *   • "02-NOV-2023 - KC910 ICN-ALA (EI-KEB - B767-300) (03).jpg", Simply
 *     Aviation, CC BY-SA 4.0, and "202403 Aerial View of Incheon International
 *     Airport.jpg", MNXANL, CC BY-SA 4.0 — from the air, position check.
 *
 * Numbers (fractions of 100.4 m measured along the shaft in the calflier001
 * photo, rotated upright; 0.12 m a pixel): shaft 0–62 m, 12.6 m wide at the
 * foot to 9.6 m (the photo is taken near the foot, so its taper is read with
 * the far view from Terminal 1 too); lower glazed stage 62–79 m, 14.6 m wide at its foot to
 * 19 m; neck 79–81.5 m; cab 81.5–88 m, 19 to 21.6 m; the flared hood to
 * 92 m, 24 m across; radome plinth to 97.6 m; dome Ø 5.8 m to 100.4 m.
 * Plan: a square with chamfered corners at every stage (the photo shows two
 * broad faces and a narrow chamfer).
 * Pavilion at the foot 24 × 16 m, 6 m (estimated).
 *
 * Doubts
 * - OSM names this node "ICN tower 2" with tower:type=radar; its position
 *   matches the main tower in both photos (bearing and distance from the
 *   Terminal 1 gate where Christophe95's photo was taken), so it is taken as
 *   the main control tower. The node is a point: the tower may stand a few
 *   metres off it.
 * - The plan's turn (square to the compass here) and the pavilion's plan
 *   are estimated; no photo shows the tower from above.
 */
import { type V3 } from './mesh'
import { type XY, quadN, unit, capPoly } from './nyc-570-lexington'
import { writeLod, prismRing, newMats } from './tokyo-haneda-terminal-1'
import { ICN, UP, gridSurf, bar } from './incheon-airport-terminal-1'
import { PALETTE, finish } from './palette'

/**
 * A square of width w with its corners chamfered (k = the chamfer's share of
 * the width), at height z: the tower's plan at every stage.
 */
const ring = (w: number, z: number, k = 0.22): V3[] => {
  const h = w / 2, c = w * k
  return ([[h, -h + c], [h, h - c], [h - c, h], [-h + c, h], [-h, h - c], [-h, -h + c], [-h + c, -h], [h - c, -h]] as XY[]).map(([x, y]) => [x, y, z] as V3)
}

/** A frustum between two chamfered squares, flat faces, with optional caps. */
function frustum(p: any, w0: number, z0: number, w1: number, z1: number, top: any = null, bottom: any = null, k0 = 0.22, k1 = k0) {
  const lo = ring(w0, z0, k0), hi = ring(w1, z1, k1)
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8
    const a = lo[i], b = lo[j], c = hi[j], d = hi[i]
    const h = unit([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0])
    const n = unit([h[0] * (z1 - z0), h[1] * (z1 - z0), (Math.hypot((a[0] + b[0]) / 2, (a[1] + b[1]) / 2) - Math.hypot((c[0] + d[0]) / 2, (c[1] + d[1]) / 2))])
    quadN(p, a, b, c, d, [n, n, n, n])
  }
  if (top) top.cap(hi, true)
  if (bottom) bottom.cap(lo, false)
}

const Z_SHAFT = 62, Z_LOW1 = 79, Z_CAB0 = 81.5, Z_CAB1 = 88, Z_HOOD = 92, Z_PLINTH = 97.6, H = 100.4

function buildTower(detail: boolean) {
  const M = newMats(['shaft', 'win', 'roof', 'white', 'base'])
  // --- The shaft: a tapering chamfered square, in two lifts so the taper eases
  frustum(M.shaft, 12.6, 0, 11, 30, null, null, 0.12)
  frustum(M.shaft, 11, 30, 9.6, Z_SHAFT, null, null, 0.12)
  // panel joints: pale horizontal lines every ~6 m (detail)
  if (detail) for (let z = 6; z < Z_SHAFT - 2; z += 6) {
    const w = z < 30 ? 12.6 - (1.6 * z) / 30 : 11 - (1.4 * (z - 30)) / 32
    const r = ring(w + 0.06, z, 0.12)
    for (let i = 0; i < 8; i++) { const a = r[i], b = r[(i + 1) % 8], n = unit([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0]); bar(M.white, a, b, 0.22, n, 0.02) }
  }
  // --- Lower glazed stage: an inverted frustum on a solid foot, with a white head band
  frustum(M.white, 9.6, Z_SHAFT - 0.6, 14.6, Z_SHAFT + 0.8, null, M.white, 0.12, 0.22)
  frustum(M.win, 14.6, Z_SHAFT + 0.8, 18.6, Z_LOW1 - 0.8)
  frustum(M.white, 18.6, Z_LOW1 - 0.8, 19, Z_LOW1, M.roof)
  // --- Neck: a pale solid band
  frustum(M.shaft, 16, Z_LOW1, 16.4, Z_CAB0, null)
  // --- Cab, and the flared hood over it
  frustum(M.white, 16.4, Z_CAB0, 19, Z_CAB0 + 0.6, null, M.white)
  frustum(M.win, 19, Z_CAB0 + 0.6, 21.6, Z_CAB1)
  frustum(M.white, 21.6, Z_CAB1, 24.2, Z_HOOD - 0.8)
  frustum(M.white, 24.2, Z_HOOD - 0.8, 24.2, Z_HOOD, M.roof)
  // mullions on both glazed stages
  for (const [w0, z0, w1, z1] of [[14.6, Z_SHAFT + 0.8, 18.6, Z_LOW1 - 0.8], [19, Z_CAB0 + 0.6, 21.6, Z_CAB1]] as [number, number, number, number][]) {
    const lo = ring(w0 + 0.1, z0), hi = ring(w1 + 0.1, z1)
    for (let i = 0; i < 8; i++) {
      bar(M.white, lo[i], hi[i], detail ? 0.6 : 0.9, unit([lo[i][0], lo[i][1], 0.15]), 0.04)
      if (i % 2 === 0) { // a middle mullion on each broad face
        const j = (i + 1) % 8, a: V3 = [(lo[i][0] + lo[j][0]) / 2, (lo[i][1] + lo[j][1]) / 2, z0], b: V3 = [(hi[i][0] + hi[j][0]) / 2, (hi[i][1] + hi[j][1]) / 2, z1]
        bar(M.white, a, b, detail ? 0.5 : 0.7, unit([a[0], a[1], 0.15]), 0.04)
      }
      // a bold transom round the stage at mid-height
      const zm = (z0 + z1) / 2, wm = (w0 + w1) / 2 + 0.1, mr = ring(wm, zm), j = (i + 1) % 8
      bar(M.white, mr[i], mr[j], 0.6, unit([(mr[i][0] + mr[j][0]) / 2, (mr[i][1] + mr[j][1]) / 2, 0.15]), 0.05)
    }
  }
  // --- The radome's tall plinth, the radome, a railing frame (detail)
  frustum(M.white, 7.4, Z_HOOD, 7.0, Z_PLINTH, M.white, null, 0.15)
  {
    const R = 2.9, cz = H - R, NA = detail ? 8 : 5, NB = detail ? 16 : 10
    const G: V3[][] = []
    for (let i = 0; i <= NB; i++) {
      const a = (2 * Math.PI * i) / NB, row: V3[] = []
      for (let j = 0; j <= NA; j++) { const b = -0.35 + ((Math.PI / 2 + 0.35) * j) / NA; row.push([R * Math.cos(b) * Math.cos(a), R * Math.cos(b) * Math.sin(a), cz + R * Math.sin(b)]) }
      G.push(row)
    }
    gridSurf(M.white, G, (m) => [m[0], m[1], m[2] - cz])
  }
  if (detail) prismRing(M.white, [[-11, -0.15], [-5, -0.15], [-5, 0.15], [-11, 0.15]], Z_HOOD, Z_HOOD + 3)

  // --- The glazed pavilion at the foot
  const pav: XY[] = [[-12, -15], [12, -15], [12, 1], [-12, 1]]
  prismRing(M.base, pav, 0, 1.2, null)
  prismRing(M.win, pav.map(([x, y]) => [x * 0.98, y < 0 ? y + 0.3 : y - 0.3] as XY), 1.2, 5.4, null)
  prismRing(M.white, pav.map(([x, y]) => [x * 1.02, y < 0 ? y - 0.3 : y + 0.3] as XY), 5.4, 6.2, M.roof)

  return [
    { part: M.shaft, material: finish('icn-tower-concrete', 0xd6c9b4) },
    { part: M.win, material: PALETTE.window },
    { part: M.roof, material: ICN.roof },
    { part: M.white, material: ICN.white },
    { part: M.base, material: ICN.panel },
  ]
}

if (import.meta.main) {
  const extras = { bearing: 0, osm: 'node/3955261484', height: 100.4 }
  writeLod('Incheon International Airport Control Tower', 'incheon-airport-control-tower.glb', buildTower(false), extras, 5000, 250_000)
}
