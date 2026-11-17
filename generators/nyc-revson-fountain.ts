/**
 * Revson Fountain, Josie Robertson Plaza, Lincoln Center, Manhattan (Philip
 * Johnson, 1964; rebuilt 2009 by WET Design) — procedural, CC0-1.0, no
 * textures.
 * bun generators/nyc-revson-fountain.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. The fountain is
 * round, so the bearing is only the Manhattan grid's 29°, as for the three
 * halls round the plaza. Anchor: the fountain's centre as the lidar's water
 * ring shows it, 0.5 m south of the centroid of OSM way/329988120
 * (amenity=fountain, the 6 m jet field in the middle; not a building, so
 * `replaces` is empty). y = 0 is the plaza paving. Nearest neighbours: the
 * three halls (nyc-david-geffen-hall, nyc-met-opera, nyc-koch-theater) stand
 * 20 m or more from the rim; nothing overlaps.
 *
 * Evidence
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 0.5 m. The water returns
 *   nothing, so the pool shows as an empty ring from r = 3 m out to
 *   r = 6.5 m round a centre field of returns ~0.2 m above the plaza: the
 *   whole fountain is ~13 m across (measured).
 * - Photos (Wikimedia Commons):
 *   - "Lincoln Center grassy plaza 2021 (2) jeh.jpg", Jim.henderson,
 *     CC BY 4.0 (jets off: the raised black disc on short legs over a
 *     sunken moat, its thin dark rim at knee height);
 *   - "Fountain Lincoln Centre (6213944577).jpg", Tony Hisgett, CC BY 2.0
 *     (the rim's fascia, the moat, the jets as a crowned wall ~4-5 m high);
 *   - "LincolnCenter-2 (35750405034).jpg", Ajay Suresh, CC BY 2.0 (from
 *     Columbus Avenue: the low rim, central jets to ~12 m);
 *   - "150919 003 Lincoln Center - Revson Fountain...(21223352214).jpg",
 *     cultivar413, CC BY 2.0 (dusk, lit jets);
 *   - "Lincoln Center fountain (15612711600).jpg", Peter Burka,
 *     CC BY-SA 2.0 (night, the crown of jets lit white).
 *
 * Estimated from the photos against the 13 m lidar ring: the disc 11.9 m
 * across, its rim top 0.5 m above the plaza with a 0.3 m dark fascia, the
 * legs, the water level in the disc. The jets play a changing show; they
 * are drawn as one sparse static pose (STYLE.md doesn't model water
 * surfaces, but the jets are not a surface the map draws, and without them
 * the fountain is a black disc at ankle height): a ring of 12 thin jets to
 * 1.9 m on the 6 m OSM jet field and one slender centre jet to 5 m (the
 * display is usually low and flat; the tall show is occasional). Solid and pale, not translucent (translucency is for
 * glass only). The sunken moat round the disc and its flush coping are the
 * map's paving and are not drawn. Night: the jets are lit from below
 * (_FLOODLIGHT); the black granite stays dark.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { TAU, smooth, lathe } from './nyc-columbus-monument'

const granite = new Part(), water = new Part(), spray = new Part()
const N = 40

// --- The raised black granite disc: soffit, fascia, rounded rim, inner lip. ---
smooth(granite, q => lathe(q, [[5.0, 0.2], [5.85, 0.22], [5.95, 0.3], [5.95, 0.47], [5.85, 0.52], [5.6, 0.52], [5.55, 0.44]], N, 0, 0, false), 40)
{
  const ring = (r: number, z: number): V3[] => Array.from({ length: N }, (_, i) => [r * Math.cos(i * TAU / N), r * Math.sin(i * TAU / N), z])
  granite.cap(ring(5.0, 0.2), false)
  // The water held in the disc, just under the lip.
  water.cap(ring(5.55, 0.44), true)
}
// Short legs standing in the moat, under the disc's edge.
for (let k = 0; k < 10; k++) {
  const a = k * TAU / 10
  lathe(granite, [[0.16, 0], [0.13, 0.21]], 6, 4.6 * Math.cos(a), 4.6 * Math.sin(a), false)
}
// The nozzle ring in the jet field: a low dark kerb the jets rise from.
lathe(granite, [[3.0, 0.44], [3.0, 0.5], [2.75, 0.5], [2.75, 0.44]], N, 0, 0, false)

// --- The jets: thin tapering spouts, a ring of short ones and one slender
// centre jet, so the dark disc reads first. ---
function jet(cx: number, cy: number, r: number, top: number) {
  const z0 = 0.44
  smooth(spray, q => lathe(q, [[r, z0], [r * 0.8, z0 + (top - z0) * 0.6], [r * 0.55, top - r], [r * 0.15, top]], 6, cx, cy, true), 70)
}
for (let k = 0; k < 12; k++) {
  const a = k * TAU / 12
  jet(2.85 * Math.cos(a), 2.85 * Math.sin(a), 0.16, 1.9)
}
jet(0, 0, 0.24, 5.0)

finishModel('Revson Fountain', 'nyc-revson-fountain', [
  { part: granite, material: { name: 'granite-black', color: 0x4a4f57, roughness: 0.4 } },
  { part: water, material: { name: 'basin-water', color: 0x5f6d75, roughness: 0.2 } },
  { part: spray, material: { name: 'spray', color: 0xe4ecef, roughness: 0.6, floodlight: (p: V3, n: V3) => (n[2] > 0.8 ? 0.6 : 1) } },
], { bearing: 29, osm: 'way/329988120', height: 5.0 }, 5000)
