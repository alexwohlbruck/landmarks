/**
 * 70 Pine Street (former Cities Service / AIG Building) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-70-pine.ts
 *
 * Also a small kit for the downtown group of the New York batch
 * (nyc-40-wall-street, nyc-8-spruce, nyc-municipal-building import
 * `SplitPart` and `Box` helpers from here). The model itself is only written
 * when this file is run directly.
 *
 * Map frame: x = model east (Pearl Street side), y = model north (Pine
 * Street), z up, metres. Placed at bearing 38°, the axis of the tower's
 * walls. Anchor: area centroid of the OSM outline way/278069587.
 *
 * Evidence
 * - OSM way/278069587 (outline, 77 × 38 m) and its 58 building:part ways
 *   286032699…286032756, which map every setback of the base and the
 *   cruciform tower; their plans are used, squared to the 38° axis and
 *   mirrored about the tower's centre (x 5.5, y −0.6), where they are already
 *   symmetric to within half a metre.
 * - Lidar: USGS 3DEP NY_NewYorkCity, flown 2017, resampled into the model
 *   frame. OSM's stage heights are low on the west wing: lidar gives
 *   56/71/79/96/107/117/126 m for OSM's 45/50/70/75/90/100/112 m stages,
 *   and the tower's main roof at 237 m (OSM 242), its E/W wings 232 m, the
 *   corner ledges 216 m and the outer wing tips 200–212 m; the crown steps
 *   at 245–247, ~253, ~258–261 m and the lantern to 267 m.
 * - Published: 290 m to the spire tip, 67 floors, Clinton & Russell with
 *   Holton & George, 1932 (Wikipedia; NYC LPC designation 2011). Limestone
 *   and buff brick shading lighter towards the top; a glass-enclosed
 *   observation solarium under the spire.
 * - Photos (Wikimedia Commons): /tmp/city/nyc/work/nyc-70-pine/photos/credits.txt
 *
 * Estimated: the crown tiers' exact plans (OSM's, rounded); the glass
 * lantern's height (~6 m); the spire's taper. The base's darker shade is a
 * simplification of the graded brick into two tones (below and above the
 * 126 m west wing roof).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Facade, massing, prism, chamferRect, finishModel, spire } from './nyc-570-lexington'

// ===========================================================================
// Downtown kit
// ===========================================================================

/** Sends each triangle to `lo` when it lies wholly at or below `z`, else to `hi`. */
export class SplitPart extends Part {
  constructor(public lo: Part, public hi: Part, public z: number) { super() }
  override tri(a: V3, b: V3, c: V3, ua?: number[], ub?: number[], uc?: number[], n?: V3[]) {
    const m = Math.max(a[2], b[2], c[2])
    ;(m <= this.z + 1e-6 ? this.lo : this.hi).tri(a, b, c, ua, ub, uc, n)
  }
}

export type Box = [number, number, number, number, number]
/** A box centred on (cx, cy) with half-sizes (ax, ay). */
export const centred = (cx: number, cy: number, ax: number, ay: number, h: number): Box => [cx - ax, cy - ay, cx + ax, cy + ay, h]

/** A thin tapering mast of `n` sides from z0 (radius r0) to a point at z1. */
export function mast(p: Part, cx: number, cy: number, z0: number, z1: number, r0: number, n = 6) {
  const ring: XY[] = Array.from({ length: n }, (_, i) => [cx + r0 * Math.cos((i * 2 * Math.PI) / n), cy + r0 * Math.sin((i * 2 * Math.PI) / n)])
  spire(p, ring, z0, [cx, cy, z1], true)
}

// ===========================================================================
// 70 Pine Street
// ===========================================================================

function build() {
  const base = new Part(), tower = new Part(), win = new Part(), roof = new Part(), glass = new Part(), metal = new Part()
  const wall = new SplitPart(base, tower, 127)

  // Windows: the shaft is pier-and-spandrel brick, a narrow window pair per
  // bay; two storeys (3.7 m) per panel.
  const fac: Facade = { bay: 3.3, ratio: 0.46, floor: 3.7, group: 2, spandrel: 2.0, sill: 1.6, head: 1.6, ground: 9, minLength: 3.2, margin: 0.4 }

  const N = 19.0, S = -19.3, E = 39.5, W = -37.8
  const cx = 5.5, cy = -0.6
  const C = (ax: number, ay: number, h: number) => centred(cx, cy, ax, ay, h)
  const boxes: Box[] = [
    // Base: street walls to 45–56 m, then the stepped wings.
    [W, S, -1.2, N, 56], [-1.2, S, 12.2, N, 56], [12.2, S, E, N, 45],
    // West wing (lidar heights), stepping in towards the tower.
    [W, -17.7, -1.2, 16.8, 71], [W, -15.3, -1.2, 13.9, 79], [W, -13.0, -5.6, 11.7, 96],
    [W, -10.6, -12.2, 9.5, 107], [W, -8.4, -13.5, 7.3, 117], [W, -6.0, -13.6, 4.6, 126],
    // The middle bays on Pine and Cedar Streets.
    [-1.2, -16.9, 12.2, 15.7, 71], [-1.2, -15.1, 12.2, 13.9, 85],
    // East wing.
    [12.2, -16.8, 37.0, 15.7, 52], [12.2, -14.1, 34.6, 13.3, 63], [12.2, -11.9, 32.1, 11.1, 71],
    [12.2, -9.5, 29.9, 8.6, 89], [12.2, -4.8, 27.2, 3.9, 100],
    // Tower: a cross of wings round a 237 m core, each corner stepped back
    // in ledges (OSM parts; lidar heights).
    C(20.0, 3.9, 212), C(19.1, 8.9, 200), C(12.8, 11.3, 216),
    C(16.5, 6.5, 228), C(17.2, 4.7, 232),
    C(6.8, 12.6, 228), C(3.6, 12.6, 232),
    C(11.1, 10.0, 237),
  ]
  massing({ wall, win, roof, boxes, facade: fac, bevel: 0.45 })

  // Crown: stepped tiers with chamfered corners, the glass solarium lantern,
  // and the spire (290 m).
  const tier = (ax: number, ay: number, c: number, z0: number, z1: number, f: Facade | null) =>
    prism({ wall: tower, win: f ? win : null, roof, ring: chamferRect(cx - ax, cy - ay, cx + ax, cy + ay, c), z0, z1, facade: f, bevel: 0.4 })
  const crownFac: Facade = { ...fac, group: 2, sill: 1.0, head: 1.2, minLength: 3 }
  tier(7.3, 5.9, 1.3, 237, 245, crownFac)
  tier(6.1, 4.7, 1.0, 245, 250.5, null)
  tier(4.9, 3.7, 0.8, 250.5, 254.5, null)
  // The solarium: tall glazed bays in a stone frame.
  prism({ wall: tower, win: glass, roof: tower, ring: chamferRect(cx - 3.7, cy - 2.7, cx + 3.7, cy + 2.7, 0.7), z0: 254.5, z1: 261, facade: { bay: 1.9, ratio: 0.62, floor: 4.6, group: 1, spandrel: 0, sill: 0.6, head: 0.7, minLength: 1.4, margin: 0.2 }, bevel: 0.3 })
  tier(2.6, 1.8, 0.5, 261, 264.5, null)
  prism({ wall: metal, win: null, roof: metal, ring: chamferRect(cx - 1.5, cy - 1.1, cx + 1.5, cy + 1.1, 0.3), z0: 264.5, z1: 267, facade: null, bevel: 0.2 })
  mast(metal, cx, cy, 267, 290, 0.45)

  finishModel('70 Pine Street', 'nyc-70-pine', [
    { part: base, material: finish('pine-brick-base', 0xcdbfad) },
    { part: tower, material: finish('pine-brick', 0xe7dcc9) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: glass, material: PALETTE.glass },
    { part: metal, material: finish('pine-spire', 0xc8c8c2) },
  ], { bearing: 38, osm: 'way/278069587', height: 290 }, 6500)
}

if (import.meta.main) build()
