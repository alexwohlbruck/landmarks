/**
 * Singapore Changi Airport Terminal 1 (1981; refaced and extended towards
 * Jewel in 2019): the long main hall, its two gate piers (C to the east, D to
 * the west) running north to the apron and bending outwards, the 2019 arrival
 * hall facing Jewel, and the covered Skytrain links running south — procedural,
 * CC0-1.0, no textures.
 *   bun generators/singapore-changi-terminal-1.ts
 *
 * Also the shared kit for the Changi terminals of this batch
 * (singapore-changi-terminal-2, -3 and -4 import `CHANGI`, `ellipse`,
 * `screen`, `skylights`, `canopy`, `gateStubs`, `toFrame` and friends from
 * here). The model itself is only written when this file is run directly.
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at bearing
 * 23.1°, the airport grid (every terminal wall runs 23.1° / 113.1°), so model
 * +y points to the apron and runway 02L/20R side's north, model −y to Jewel.
 * Anchor: the area centroid of OSM way/26561741, 103.9906428, 1.3623697.
 *
 * Identifying features (photos): a long, plain, pale grey panelled block,
 * four storeys, with horizontal glazed bands and, set back on top, a long
 * metal louvre screen hiding the plant; the deep landside canopy over the
 * departure drive; two long gate piers with glazed lounges; the newer glass
 * arrival hall between the terminal and Jewel.
 *
 * Evidence
 * - OSM (© OpenStreetMap contributors, ODbL): way/26561741 (Changi Airport
 *   Terminal 1, building=yes, height 30, building:levels 3, start_date 1981;
 *   the outline includes both piers, the hall facing Jewel and the two covered
 *   Skytrain links south of the hall); way/744653030 (an unnamed second
 *   aeroway=terminal outline over the hall and piers only, the same building
 *   mapped twice). Neither carries part heights.
 * - Photos (evidence):
 *   https://commons.wikimedia.org/wiki/File:Changi_Airport,_Terminal_1,_Departure_Driveway.JPG
 *     (Terence Ong, CC BY 2.5) the grey panel fascia over the departure drive;
 *   https://commons.wikimedia.org/wiki/File:Changi_Airport,_Terminal_1.JPG
 *     (Terence Ong, CC BY 2.5) the landside front at dusk, planters on the canopy;
 *   https://commons.wikimedia.org/wiki/File:Changi_Airport_Terminal_1.jpg
 *     (Nigos, CC BY-SA 4.0) the hall and the louvre screen from the car park;
 *   https://commons.wikimedia.org/wiki/File:Vu_d%E2%80%99ext%C3%A9rieur_de_Jewel_Changi.jpg
 *     (ArnoBOUJIKA, CC0) the grey panelled wall with the blue band and the
 *     louvre screen on top, from Jewel's side;
 *   https://commons.wikimedia.org/wiki/File:Jewel_Mall_-_Near.Singapore.Terminal_1.jpg
 *     (Samyamlpradhan, CC BY-SA 4.0) the glass canopy on white posts at the
 *     Jewel / Terminal 1 drop-off.
 * - No lidar and no open aerials for Singapore; heights are estimated.
 *
 * Numbers (estimated): the main hall's wall 22 m and the louvre screen to
 * 27 m (OSM's 30 m height read as the top of the screen's plant), storeys of
 * about 5 m; the piers 14 m; the 2019 hall 15 m; the Skytrain links 11 m;
 * the landside canopy 9 m deep at 10 m. Doubts: no licensed photo shows the
 * piers or the airside; the 2019 hall's roof shape; the departure canopy's
 * depth; the outline's lobe is clipped where it runs into Jewel's dome (Jewel
 * is its own model), and the links' south ends stop where OSM's way does.
 */
import polygonClipping from 'polygon-clipping'
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Facade, capPoly, insetRing, area } from './nyc-570-lexington'
import { zoneMass, prismRing, beam, simplify, clipRect, inside, ccw, writeLod, newMats, type Zone, type Mats } from './tokyo-haneda-terminal-1'

export type { XY, Facade, Zone, Mats }
export { zoneMass, prismRing, beam, simplify, clipRect, inside, ccw, writeLod, newMats, capPoly, insetRing, area }

// ===========================================================================
// Kit
// ===========================================================================

/** The airport's grid and the frame conversion every Changi terminal uses. */
export const CHANGI = { bearing: 23.1 }

/** lon/lat → model frame (bearing `b`, anchor lon0/lat0). */
export function toFrame(lon: number, lat: number, lon0: number, lat0: number, b = CHANGI.bearing): XY {
  const kx = 111320 * Math.cos((lat0 * Math.PI) / 180), ky = 110574, r = (b * Math.PI) / 180
  const e = (lon - lon0) * kx, n = (lat - lat0) * ky
  return [e * Math.cos(r) - n * Math.sin(r), e * Math.sin(r) + n * Math.cos(r)]
}

/** An axis-aligned ellipse, counter-clockwise. */
export const ellipse = (cx: number, cy: number, a: number, b: number, n = 48): XY[] =>
  Array.from({ length: n }, (_, i) => [cx + a * Math.cos((2 * Math.PI * i) / n), cy + b * Math.sin((2 * Math.PI * i) / n)] as XY)

/**
 * A rooftop louvre screen: a band of metal standing `inset` inside the roof
 * edge, z0…z1, drawn both sides with a top, over the clipped ring.
 */
export function screen(p: Part, ring: XY[], inset: number, z0: number, z1: number, t = 0.5) {
  const outer = insetRing(ccw(ring), inset), inner = insetRing(ccw(ring), inset + t)
  for (let i = 0; i < outer.length; i++) {
    const j = (i + 1) % outer.length
    const a = outer[i], b = outer[j], c = inner[i], d = inner[j]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
    p.quad([d[0], d[1], z0], [c[0], c[1], z0], [c[0], c[1], z1], [d[0], d[1], z1])
    p.quad([a[0], a[1], z1], [b[0], b[1], z1], [d[0], d[1], z1], [c[0], c[1], z1])
  }
}

/**
 * Skylight strips on a flat roof: raised glass bands `w` wide every `pitch`
 * metres, running along `axis`, clipped to `ring` (and a rectangle).
 */
export function skylights(p: Part, ring: XY[], rect: [number, number, number, number], z: number, o: { axis: 'x' | 'y'; pitch: number; w: number; h?: number; margin?: number }) {
  const [x0, y0, x1, y1] = rect, m = o.margin ?? 6, h = o.h ?? 1.2
  const lo = o.axis === 'x' ? y0 + m : x0 + m, hi = o.axis === 'x' ? y1 - m : x1 - m
  for (let c = lo + o.pitch / 2; c < hi; c += o.pitch) {
    const r: [number, number, number, number] = o.axis === 'x' ? [x0 + m, c - o.w / 2, x1 - m, c + o.w / 2] : [c - o.w / 2, y0 + m, c + o.w / 2, y1 - m]
    const piece = clipRect(insetRing(ccw(ring), m), ...r)
    if (piece.length >= 3 && Math.abs(area(piece)) > 4) prismRing(p, piece, z - 0.2, z + h)
  }
}

/** A flat canopy slab on a ring at z (thickness t), on round-ish posts at the given points. */
export function canopy(slab: Part, post: Part, ring: XY[], z: number, t: number, posts: XY[], postW = 0.9) {
  prismRing(slab, ring, z - t, z, slab, slab)
  for (const [x, y] of posts) beam(post, [x, y - postW / 2], [x, y + postW / 2], postW, 0, z - 0.02, false)
}

/**
 * Fixed jet-bridge stubs along an apron wall: a glazed link `len` long out
 * from the wall at gate level, on a post, at each position along it.
 */
export function gateStubs(p: Part, from: XY, dir: XY, along: XY, at: number[], len: number, z0 = 4.5, z1 = 7.5, w = 3.4) {
  for (const s of at) {
    const a: XY = [from[0] + along[0] * s, from[1] + along[1] * s]
    const b: XY = [a[0] + dir[0] * len, a[1] + dir[1] * len]
    beam(p, a, b, w, z0, z1, true)
    beam(p, [b[0] - dir[0] * 1.2, b[1] - dir[1] * 1.2], [b[0] - dir[0] * 0.2, b[1] - dir[1] * 0.2], 1.0, 0, z1 - 0.02, false)
  }
}

/** `ring` minus the polygons in `cut`: the largest piece's outer ring, counter-clockwise. */
export function cutRing(ring: XY[], cut: XY[][]): XY[] {
  const close = (r: XY[]) => [...r, r[0]]
  const res = polygonClipping.difference([close(ring)] as any, ...cut.map((c) => [close(c)] as any))
  let best: XY[] = [], bestA = 0
  for (const poly of res) { const r = (poly[0] as XY[]).slice(0, -1); const a = Math.abs(area(r)); if (a > bestA) { bestA = a; best = r } }
  return ccw(best)
}

/** A ring from OSM coordinates in this frame, cleaned. */
export const clean = (r: XY[], tol = 0.5) => simplify(ccw(r), tol)

// ===========================================================================
// Terminal 1 — OSM way/26561741 in this frame (bearing 23.1, anchor 103.9906428, 1.3623697)
// ===========================================================================

export const T1_ANCHOR: [number, number] = [103.9906428, 1.3623697]
/** Jewel's dome in this frame: the ellipse fitted to OSM way/744520551 (see singapore-changi-jewel.ts). */
const JEWEL = { cx: 1.7, cy: -257.5, a: 102.0, b: 76.3 }

const T1_OUTLINE: XY[] = [[265.7,416.1],[259.4,419.7],[257.9,417.1],[230.5,369.2],[229.2,366.4],[228.1,364.6],[201.9,319.5],[199.8,315.4],[198.7,313.4],[176.3,274.8],[172.7,268.6],[177.0,260.4],[170.8,256.5],[166.3,252.0],[164.7,249.0],[163.5,247.3],[160.7,238.5],[160.7,219.3],[160.0,187.6],[159.4,158.0],[159.2,156.4],[159.2,140.9],[159.1,113.1],[159.1,98.2],[159.1,87.7],[159.0,65.5],[159.0,62.7],[159.1,28.8],[159.1,18.8],[162.0,18.9],[161.9,9.0],[139.1,8.9],[137.9,8.9],[108.9,8.9],[109.0,18.4],[104.2,18.4],[101.3,18.4],[84.3,18.4],[48.8,18.4],[34.8,18.4],[29.3,18.4],[26.0,18.4],[25.9,18.4],[17.6,18.4],[-20.0,18.5],[-25.0,18.5],[-30.4,18.5],[-44.3,18.5],[-68.5,18.5],[-78.6,18.5],[-104.5,18.6],[-104.6,9.3],[-133.8,9.3],[-133.7,8.0],[-134.8,8.0],[-156.3,8.0],[-157.9,8.0],[-157.9,15.7],[-157.9,21.2],[-155.8,92.9],[-155.8,96.7],[-155.7,98.4],[-155.4,155.2],[-155.4,167.1],[-155.1,172.0],[-148.4,172.1],[-148.5,174.4],[-148.8,207.8],[-149.0,212.2],[-149.2,214.7],[-149.8,240.7],[-152.3,246.9],[-154.4,252.2],[-156.0,255.0],[-162.1,260.1],[-167.9,262.4],[-173.5,264.6],[-175.5,267.7],[-175.3,270.3],[-169.8,272.8],[-194.3,315.8],[-195.3,317.6],[-216.2,354.0],[-217.7,356.5],[-223.7,366.7],[-231.5,380.0],[-253.0,417.3],[-256.6,415.5],[-259.1,419.5],[-269.5,416.2],[-276.5,412.9],[-282.5,409.8],[-286.3,406.5],[-289.1,403.5],[-287.2,399.8],[-297.5,394.9],[-296.2,392.9],[-266.4,341.8],[-256.9,325.9],[-256.1,324.4],[-232.5,283.8],[-228.6,286.0],[-215.4,261.9],[-198.4,230.7],[-198.2,224.1],[-198.2,219.4],[-198.5,144.2],[-198.4,139.4],[-198.4,138.8],[-198.3,79.8],[-198.2,68.5],[-198.3,65.5],[-201.6,65.5],[-201.5,62.9],[-201.4,23.0],[-201.3,20.0],[-201.3,2.6],[-201.5,-4.4],[-201.5,-12.4],[-201.9,-12.6],[-205.0,-12.5],[-207.8,-12.6],[-207.8,-17.3],[-204.9,-17.3],[-205.1,-54.6],[-205.1,-65.9],[-205.1,-75.7],[-205.2,-83.3],[-205.2,-92.2],[-205.6,-116.4],[-206.5,-365.2],[-180.7,-363.9],[-182.7,-124.4],[-171.5,-124.2],[-169.1,-124.1],[-168.9,-92.1],[-168.9,-85.6],[-170.7,-85.5],[-170.8,-69.0],[-169.4,-68.6],[-168.2,-70.0],[-166.4,-70.0],[-166.4,-73.8],[-165.9,-74.5],[-163.5,-74.5],[-162.9,-74.0],[-162.8,-69.5],[-158.6,-69.5],[-156.7,-69.5],[-113.7,-69.5],[-111.1,-69.5],[-108.1,-69.5],[-107.9,-81.5],[-116.1,-81.5],[-123.1,-81.5],[-123.1,-93.9],[-123.1,-108.0],[-123.1,-115.3],[-123.1,-124.1],[-124.9,-124.1],[-142.3,-123.3],[-142.5,-86.0],[-152.7,-85.7],[-153.0,-130.9],[-150.2,-130.9],[-147.9,-130.9],[-123.1,-131.0],[-123.2,-137.1],[-108.1,-137.1],[-108.2,-148.5],[-113.1,-152.4],[-117.0,-157.0],[-120.6,-162.3],[-120.6,-193.1],[-114.3,-193.1],[-112.8,-187.2],[-109.0,-181.8],[-103.8,-178.0],[-97.6,-175.9],[-94.4,-179.9],[-94.2,-183.3],[-93.8,-196.4],[-69.1,-196.5],[-69.1,-197.5],[-69.0,-201.4],[-66.5,-201.3],[-64.5,-202.6],[-62.1,-202.5],[-62.4,-206.5],[-60.0,-209.2],[-47.7,-202.6],[-42.4,-212.6],[-37.8,-210.5],[-29.6,-207.3],[-19.7,-204.8],[-11.1,-203.2],[-7.8,-204.7],[-2.6,-206.0],[3.7,-206.3],[9.8,-205.2],[15.6,-203.2],[22.1,-204.5],[25.9,-205.2],[37.8,-208.9],[46.6,-212.6],[49.6,-206.7],[51.6,-207.6],[52.1,-206.7],[58.4,-209.9],[64.8,-213.2],[69.2,-205.3],[75.8,-205.2],[82.0,-205.1],[82.1,-202.7],[82.0,-199.0],[79.2,-199.0],[76.6,-199.0],[76.7,-196.9],[76.7,-192.6],[88.2,-192.9],[102.5,-176.4],[108.1,-178.3],[113.0,-182.3],[116.6,-187.5],[118.1,-193.4],[124.5,-193.4],[124.5,-163.0],[121.0,-157.4],[117.2,-152.7],[112.4,-149.0],[112.3,-132.1],[139.3,-132.0],[139.3,-124.6],[127.4,-124.4],[127.5,-81.9],[112.2,-82.0],[112.3,-69.5],[113.5,-69.5],[117.5,-69.5],[118.3,-69.5],[160.5,-69.6],[162.8,-69.6],[162.8,-68.7],[166.0,-68.9],[171.1,-68.9],[171.1,-98.9],[178.7,-98.9],[178.7,-68.9],[180.0,-68.9],[179.9,-101.3],[185.8,-101.3],[185.7,-128.5],[190.2,-358.2],[215.1,-358.1],[211.8,-128.3],[211.9,-83.1],[211.9,-73.8],[211.9,-61.3],[212.0,-48.6],[213.9,-48.6],[213.9,-17.7],[212.1,-17.8],[208.6,-17.8],[208.4,-17.8],[206.9,-17.8],[206.8,-12.8],[206.5,18.0],[202.3,17.9],[202.3,23.0],[202.4,55.8],[202.5,123.5],[202.5,171.8],[202.7,178.3],[203.8,225.0],[204.4,236.2],[210.1,245.3],[213.4,250.7],[231.4,281.3],[233.4,284.2],[234.3,285.7],[260.0,331.0],[261.5,334.1],[269.1,347.4],[274.7,357.1],[295.4,393.3],[297.6,397.3],[287.8,402.8],[292.8,411.4],[270.3,424.1]]

const H_HALL = 22, H_SCREEN = 29, H_PIER = 14, H_FRONT = 15, H_LINK = 11

function buildT1() {
  const M = newMats(['wall', 'win', 'roof', 'trim', 'glass', 'dark'])
  const jewel = ellipse(JEWEL.cx, JEWEL.cy, JEWEL.a + 1.5, JEWEL.b + 1.5, 64)
  const body = clean(cutRing(T1_OUTLINE, [jewel]), 0.6)

  // The hall: four storeys over the drive, windows two storeys a panel.
  const HALL: Facade = { bay: 14, ratio: 0.86, floor: 4.6, group: 2, spandrel: 2.6, sill: 1.2, head: 2.4, ground: 5.5, minLength: 8 }
  // The piers: a service floor and one glazed lounge storey.
  const PIER: Facade = { bay: 10, ratio: 0.88, floor: 4.4, group: 1, spandrel: 0, sill: 1.0, head: 2.0, ground: 6.0, minLength: 8 }
  // The 2019 hall facing Jewel: a glass front, one tall panel per bay.
  const FRONT: Facade = { bay: 9, ratio: 0.92, floor: 11, group: 1, spandrel: 0, sill: 0.8, head: 2.2, ground: 1.0, minLength: 6 }
  const LINK: Facade = { bay: 9, ratio: 0.9, floor: 3.2, group: 1, spandrel: 0, sill: 1.2, head: 1.6, ground: 6.2, minLength: 6 }
  const zones: Zone[] = [
    { rect: [-320, 18.6, 320, 440], z: H_PIER, facade: PIER },
    { rect: [-210, -138, 216, 18.6], z: H_HALL, facade: HALL },
    { rect: [-130, -220, 130, -137], z: H_FRONT, facade: FRONT, win: 'glass' },
    { rect: [-210, -370, -175, -125], z: H_LINK, facade: LINK },
    { rect: [180, -370, 220, -128], z: H_LINK, facade: LINK },
  ]
  zoneMass(M, body, zones)

  // The louvre screen round the hall's roof, hiding the plant; plant blocks behind it.
  const hall = clipRect(body, -210, -138, 216, 18.6)
  const plant: XY[] = [[-192, -128], [198, -128], [198, 6], [-192, 6]]
  screen(M.trim, plant, 0, H_HALL - 0.3, H_SCREEN, 0.6)
  capPoly(M.dark, insetRing(plant, 0.6), H_SCREEN - 2.5)
  // A glazed lantern strip down the hall's middle.
  skylights(M.glass, hall, [-170, -95, 170, -25], H_SCREEN - 2.5, { axis: 'x', pitch: 35, w: 7, margin: 2 })

  // The departure drive canopy along the hall's landside face (model −y), between the links.
  {
    const y0 = -137.2, y1 = y0 - 9
    for (const [xa, xb] of [[-168, -125], [127, 184]] as [number, number][]) {
      canopy(M.trim, M.trim, [[xa, y1], [xb, y1], [xb, y0], [xa, y0]], 10.5, 1.2, Array.from({ length: Math.floor((xb - xa) / 12) }, (_, k) => [xa + 6 + 12 * k, y1 + 1] as XY))
    }
  }
  // The 2019 hall's glazed roof lights.
  const front = clipRect(body, -130, -220, 130, -137)
  skylights(M.glass, front.length ? front : [[0, 0], [1, 0], [1, 1]], [-110, -205, 110, -140], H_FRONT, { axis: 'y', pitch: 22, w: 6, margin: 3 })

  // Jet-bridge stubs off the piers' apron faces (estimated spacing, about 50 m).
  gateStubs(M.wall, [202.5, 60], [1, 0], [0, 1], [0, 55, 110, 165], 14)
  gateStubs(M.wall, [-198.3, 60], [-1, 0], [0, 1], [0, 55, 110, 165], 14)
  gateStubs(M.wall, [159.1, 60], [-1, 0], [0, 1], [0, 55, 110, 165], 14)
  gateStubs(M.wall, [-155.6, 60], [1, 0], [0, 1], [0, 55, 110, 165], 14)

  return [
    { part: M.wall, material: finish('changi-t1-panel', 0xbcc3c9) as MaterialSpec },
    { part: M.win, material: { name: 'window', color: 0x8ea6b8, roughness: 0.35 } as MaterialSpec },
    { part: M.roof, material: PALETTE.roof as MaterialSpec },
    { part: M.trim, material: finish('changi-t1-louvre', 0xaab2b8) as MaterialSpec },
    { part: M.glass, material: { name: 'glass', color: 0xa4c4d9, roughness: 0.24 } as MaterialSpec },
    { part: M.dark, material: finish('changi-t1-plant', 0x949ca3) as MaterialSpec },
  ]
}

if (import.meta.main) {
  writeLod('Changi Airport Terminal 1', 'singapore-changi-terminal-1.glb', buildT1(), { bearing: CHANGI.bearing, osm: 'way/26561741', height: H_SCREEN }, 8000, 250_000)
}
