/**
 * FKI Tower (전경련회관, Federation of Korean Industries), Yeouido, Seoul —
 * original procedural geometry, CC0-1.0.
 * bun generators/seoul-fki-tower.ts
 *
 * Map frame turned to the tower: +y runs along the 66 m sides to compass 52
 * (north-east), +x to compass 142 (south-east), z up, metres. BEARING 52.
 * Origin = centroid of the OSM outline way/681805210.
 *
 * Evidence
 * - OSM way/681805210 "전경련회관" (building=office, height 246, 50 levels):
 *   a 66.1 x 39.0 m rectangle, sides at compass 52 / 142. The low oval
 *   conference centre beside it (way/681805214, 16 m) is a separate building
 *   and is left to the map.
 * - Nominatim: the tower stands at 126.91993, 37.52217 (the coordinate in the
 *   brief, 126.9233 37.5265, is 560 m off, in the IFC block).
 * - Published: 245 m, 50 storeys, Adrian Smith + Gordon Gill Architecture,
 *   2013; the spandrels of the faceted facade are tilted up toward the sky
 *   and carry photovoltaic panels (Wikipedia "FKI Tower", CTBUH Skyscraper
 *   Center).
 * - Commons photos (daylight):
 *   "FKI타워(에프케이아이타워) 2025.jpg" (Narubaru7, CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:FKI%ED%83%80%EC%9B%8C(%EC%97%90%ED%94%84%EC%BC%80%EC%9D%B4%EC%95%84%EC%9D%B4%ED%83%80%EC%9B%8C)_2025.jpg):
 *     from the foot: a plain rectangular prism of pale grey-blue glass; both
 *     visible edges serrated by the floor-by-floor facets; the lower third
 *     reads darker (clear glass, no reflective spandrels); flat top.
 *   "Yeouido Park Lawn 201604.jpg" (Wpcpey, CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:Yeouido_Park_Lawn_201604.jpg):
 *     from the park: a straight-sided tower with fine horizontal banding.
 *   "Korea Bamseom Island 11 (14893525272).jpg" (Republic of Korea / KOCIS,
 *     CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:Korea_Bamseom_Island_11_(14893525272).jpg):
 *     from the river: the same straight banded prism, flat-topped.
 *   Colours sampled (overcast): upper glass #94a2ac-#9eaab6, lower #727b83;
 *   drawn #a6b5c2 and #7f8d99.
 *
 * Doubt: the brief describes faces that taper inward at the top; none of
 * the licensed photos shows a taper beyond perspective (the silhouette is a
 * straight prism in the Bamseom and park views), so the model keeps
 * straight sides and draws the faceting as the floor-band sawtooth.
 * Estimated: the facet depth (1.0 m, a little bolder than real), grouped
 * three storeys to a facet (12.6 m) rather than one, each with one dark
 * photovoltaic spandrel at its foot (2.4 m); the darker lower glass to ~46 m;
 * the roof plant and its screen; the mullion grouping (6 bays on the long
 * faces, 4 on the short), standing for the fine vertical mullions in the photos. No lidar exists for Korea and the map's terrain
 * (Mapterhorn) has no tiles over Seoul; Yeouido is flat.
 *
 * Night: office floors lit (window-2, window-3).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, windowVariant } from './palette'

const BEARING = 52
const ANCHOR = { lng: 126.919929, lat: 37.522173 }

const upper = new Part(), lower = new Part(), soffit = new Part(), roof = new Part(), trim = new Part(), mull = new Part()

const HX = 19.5, HY = 33.05 // half-sizes of the OSM rectangle
const H = 245
const LOBBY = 8.4
const T = 12.6 // one facet = three storeys
const S = 1.0 // facet depth
const LOWER = 46
const B = 0.6 // corner bevel

/** Rectangle ring, inset by `i`, with bevelled corners, counter-clockwise. */
function ring(i: number, z: number): V3[] {
  const x = HX - i, y = HY - i
  return [
    [x - B, -y, z], [x, -y + B, z], [x, y - B, z], [x - B, y, z],
    [-x + B, y, z], [-x, y - B, z], [-x, -y + B, z], [-x + B, -y, z],
  ]
}
function band(p: Part, a: V3[], b: V3[]) {
  const n = a.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    p.quad(a[i], a[j], b[j], b[i])
  }
}

/**
 * Vertical mullion piers grouping each face into broad panels (4 bays on the
 * short faces, 6 on the long ones), each a 1.2 m strip leaning with its facet
 * and standing 0.2 m off the glass.
 */
function mullions(za: number, zb: number, inset: (z: number) => number) {
  const W = 0.6, O = 0.2
  for (const [axis, half, other, n] of [['x', HX, HY, 6], ['y', HY, HX, 4]] as const) {
    for (let k = 1; k < n; k++) {
      const u = -other + (2 * other * k) / n
      for (const sgn of [1, -1]) {
        const at = (zz: number, du: number): V3 => {
          const f = sgn * (half - inset(zz) + O)
          return axis === 'x' ? [f, u + du, zz] : [u + du, f, zz]
        }
        let q = [at(za, -W), at(za, W), at(zb, W), at(zb, -W)]
        // wind so the strip faces outward
        const outward = axis === 'x' ? sgn : -sgn
        if (outward < 0) q = [q[1], q[0], q[3], q[2]]
        mull.quad(q[0], q[1], q[2], q[3])
      }
    }
  }
}

// Lobby: recessed dark glazing under the first facet.
band(lower, ring(S + 0.8, 0), ring(S + 0.8, LOBBY))
band(soffit, ring(S + 0.8, LOBBY), ring(0, LOBBY)) // soffit over the lobby (faces down)

// Facets: each leans back from full width at its foot to S inset at its head,
// then a soffit steps out to the next facet's foot.
let z = LOBBY
while (z < H - 1) {
  const z1 = Math.min(H, z + T)
  const p = z < LOWER ? lower : upper
  // the facet's foot is the tilted photovoltaic spandrel (grouped: one per facet), then glass
  const zs = z + 2.4, inset = (zz: number) => S * ((zz - z) / T)
  band(soffit, ring(0, z), ring(inset(zs), zs))
  band(p, ring(inset(zs), zs), ring(inset(z1), z1))
  if (z1 < H) band(soffit, ring(S, z1), ring(0, z1))
  mullions(zs, z1, inset)
  z = z1
}

// Roof: parapet, deck, plant.
{
  const top = ring(S * ((H - (LOBBY + T * Math.floor((H - LOBBY) / T))) / T), H)
  const inner = ring(S + 1.0, H), deck = ring(S + 1.0, H - 1.0)
  band(trim, top, inner) // parapet top (top ring outward → inner: faces up)
  for (let i = 0; i < 8; i++) { const j = (i + 1) % 8; trim.quad(deck[j], deck[i], inner[i], inner[j]) } // inner face
  roof.cap(deck, true)
  const r = (a: number, b: number, z: number): V3[] => [[-a, -b, z], [a, -b, z], [a, b, z], [-a, b, z]]
  // crown: a louvred plant screen set in from the parapet, in the mullion
  // metal, with the plant and lift overrun above it
  mull.loft([r(15.5, 29, H - 1), r(15.5, 29, H + 5.5)]); mull.cap(r(15.5, 29, H + 5.5), true)
  roof.loft([r(11, 22, H + 5.5), r(11, 22, H + 8)]); roof.cap(r(11, 22, H + 8), true)
  roof.loft([r(6, 12, H + 8), r(6, 12, H + 11)]); roof.cap(r(6, 12, H + 11), true)
}

const parts = [
  { part: upper, material: windowVariant(2, 0xa6b5c2) },
  { part: lower, material: windowVariant(3, 0x6c7a87) },
  { part: mull, material: { name: 'mullion', color: 0xc9d1d7, roughness: 0.5 } },
  { part: soffit, material: finish0() },
  { part: roof, material: PALETTE.roof },
  { part: trim, material: PALETTE.trim },
]
function finish0() { return { name: 'spandrel-pv', color: 0x627384, roughness: 0.5 } }
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('FKI Tower', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: H + 11,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/681805210'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/seoul-fki-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
