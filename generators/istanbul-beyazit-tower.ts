/**
 * Beyazıt Tower (Beyazıt Kulesi, Seraskerat fire-watch tower), Istanbul
 * University, Istanbul (1828, Senekerim Balyan, for Mahmud II; three upper
 * storeys added 1849; iron mast 1889) — original procedural geometry,
 * CC0-1.0.
 * bun generators/istanbul-beyazit-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Bearing 0. Anchor = centroid of the OSM outline way/639302102
 * (building=yes, man_made=tower, height 85, tower:construction=stone,
 * wikidata Q853029), 28.964896, 41.012786: a 19-sided circle 12.9 m
 * across, which is the octagonal plinth. The plinth's facets are turned
 * to the axes here; OSM's circle does not record their turn (doubt).
 *
 * Identity (from the photos below):
 *  1. A slender, tall white stone column on a battered octagonal plinth.
 *                                                  (ceegee01, kilicoglu)
 *  2. The swelling fluted "lotus" foot above the plinth and the flared,
 *     fluted capital under the watch room — the tower is shaped like a
 *     column, almost a minaret.                (ceegee01, delso, misterno)
 *  3. The round watch room with its ring of arched windows under a broad
 *     projecting cornice.                          (delso, danbury, misterno)
 *  4. Three diminishing octagonal storeys with round windows, then the
 *     flat top and its tall mast.                    (delso, danbury, akbiyik2)
 *  There is no conical cap today: the 1849 storeys end in a flat stone
 *  roof carrying the 1889 iron mast and a cluster of antennas.
 *
 * Heights. Published: 85 m (en/tr Wikipedia, Emporis via Wikipedia), and
 * the watch floor "about 50 m up" (TDV İslâm Ansiklopedisi, "Beyazıt
 * Yangın Kulesi"); a 13 m iron pole on the roof since 1889 (en Wikipedia).
 * The photos do not support 85 m for the stone tower: scaled from the
 * plinth (12.4 m across its flats, from OSM) in ceegee01, otansev and
 * kilicoglu (perspective-corrected by eye), and from the watch-room
 * cornice (9.5 m across) in danbury, a distant level view, the cornice
 * stands about 51 m up — matching the published watch floor at ~50 m
 * (room 45.5–50.5 m) — the three storeys reach 62.3 m and the mast tip
 * about 72 m. The 85 m figure is taken to include the mast's antennas or
 * the street below the campus; this model is 72 m to the mast tip.
 * Estimated profile: plinth 12.0 → 10.0 m across flats, 0–6.4 m, cornice
 * to 7.0 m; lotus foot 8.2–13.6 m, up to 8.9 m across; fluted shaft
 * 14.4–35 m, 6.9 → 6.5 m; capital flare 36–44.5 m to 8.6 m; watch room
 * 8.4 m across, 45.5–50.5 m, twelve arched windows; cornice 9.5 m;
 * storeys 5.6, 4.6 and 4.0 m across flats (danbury), 51.5–62.3 m.
 *
 * Photos (Wikimedia Commons, evidence):
 *  - delso: Torre de Beyazıt, Estambul, Turquía, 2024-09-29, DD 20.jpg
 *    (Diego Delso, CC BY-SA 4.0)
 *  - misterno: Beyazıt Kulesi - panoramio.jpg (Mister No, CC BY 3.0)
 *  - ceegee01: BeyazıtTower01.JPG (CeeGee, CC BY-SA 4.0)
 *  - kilicoglu: Watchtower Istanbul University.jpg (İhsan Deniz Kılıçoğlu,
 *    CC BY-SA 3.0)
 *  - otansev: Beyazit Kule by OTANSEV - panoramio.jpg (otansev, CC BY-SA 3.0)
 *  - danbury: İstanbul Üniversitesi.JPG (Danbury, CC BY-SA 3.0)
 *  - akbiyik2: Beyazıt Kulesi - panoramio (2).jpg (Aziz Akbiyik, CC BY-SA 3.0)
 *  - karakoy: Beyazıt Kulesi Karaköy vapurundan.jpg (Çokiyi, CC BY-SA 4.0)
 * No look-only sources. No commercial imagery.
 *
 * Ground: the campus is level round the tower; no terrain check (no
 * lidar, no Mapterhorn z15 tiles in Istanbul).
 *
 * Left out: the flutes and petals as separate ribs (the 16-sided shaft
 * carries them), the antenna cluster, the coloured weather lamps on the
 * top, the inscription plaque on the plinth, the red ornaments on the
 * first storey.
 *
 * Night: the tower is floodlit; the watch-room windows glow.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), metal = new Part()

/** A regular n-gon ring with apothem a (flats facing the axes for n % 4 = 0). */
const ngon = (n: number, a: number, z: number): V3[] => {
  const R = a / Math.cos(Math.PI / n)
  return Array.from({ length: n }, (_, i) => {
    const t = Math.PI / n + i * 2 * Math.PI / n
    return [R * Math.cos(t), R * Math.sin(t), z]
  })
}
/** A lofted section through (z, apothem) stations, capped on top. */
function section(p: Part, n: number, prof: [number, number][], top: Part | null = p) {
  p.loft(prof.map(([z, a]) => ngon(n, a, z)))
  if (top) top.cap(ngon(n, prof[prof.length - 1][1], prof[prof.length - 1][0]), true)
}
/** A flat panel on facet i of an n-gon of apothem a. */
function onFacet(n: number, a: number, i: number) {
  const th = Math.PI / n + (i + 0.5) * 2 * Math.PI / n
  const nx = Math.cos(th), ny = Math.sin(th)
  return { n: [nx, ny, 0] as V3, at: (s: number, z: number, d = 0.04): V3 => [nx * (a + d) - ny * s, ny * (a + d) + nx * s, z] }
}
function arched(p: Part, n: number, a: number, i: number, w: number, z0: number, spring: number) {
  const f = onFacet(n, a, i)
  const pts: V3[] = [f.at(-w, z0), f.at(w, z0)]
  for (let k = 0; k <= 6; k++) { const t = Math.PI * k / 6; pts.push(f.at(w * Math.cos(t), spring + w * Math.sin(t))) }
  for (let k = 1; k + 1 < pts.length; k++) p.tri(pts[0], pts[k], pts[k + 1], undefined, undefined, undefined, [f.n, f.n, f.n])
}
function oculus(p: Part, n: number, a: number, i: number, r: number, z: number) {
  const f = onFacet(n, a, i), c = f.at(0, z)
  const ring = Array.from({ length: 8 }, (_, k) => f.at(r * Math.cos(k * Math.PI / 4), z + r * Math.sin(k * Math.PI / 4)))
  for (let k = 0; k < 8; k++) p.tri(c, ring[k], ring[(k + 1) % 8], undefined, undefined, undefined, [f.n, f.n, f.n])
}

// Plinth: battered octagon with a cornice.
section(stone, 8, [[0, 6.0], [6.4, 5.0]], null)
section(trim, 8, [[6.4, 5.0], [6.4, 5.35], [7.0, 5.35]])
// Drum and the swelling lotus foot (16 facets), its moulded rings.
section(stone, 16, [[7.0, 4.3], [8.2, 4.3], [8.2, 4.2], [9.0, 4.45], [10.2, 4.45], [11.2, 4.2], [12.2, 3.85], [13.0, 3.6], [13.6, 3.5]], null)
section(trim, 16, [[13.6, 3.5], [13.6, 3.75], [14.4, 3.75], [14.4, 3.45]], null)
// Shaft, with two rings below the capital.
section(stone, 16, [[14.4, 3.45], [33.6, 3.27]], null)
section(trim, 16, [[33.6, 3.27], [33.6, 3.5], [34.2, 3.5], [34.2, 3.26], [35.0, 3.26], [35.0, 3.55], [35.8, 3.55], [35.8, 3.3]], null)
// Capital: the flared fluted bell under the watch room.
section(stone, 16, [[35.8, 3.3], [38.0, 3.4], [40.0, 3.7], [42.0, 4.1], [43.6, 4.3], [44.5, 4.3]], null)
section(trim, 16, [[44.5, 4.3], [44.5, 4.45], [45.5, 4.45], [45.5, 4.2]], null)
// Watch room: twelve facets, an arched window on each.
section(stone, 12, [[45.5, 4.2], [50.4, 4.2]], null)
for (let i = 0; i < 12; i++) arched(win, 12, 4.2, i, 0.5, 46.6, 48.7)
// Broad cornice.
section(trim, 12, [[50.4, 4.2], [50.6, 4.75], [51.3, 4.75], [51.5, 3.3]], trim)
// Three diminishing octagonal storeys, each with a cornice and oculi.
const storeys: [number, number, number, number][] = [[51.5, 55.0, 2.8, 3.15], [55.6, 58.6, 2.3, 2.6], [59.1, 61.8, 2.0, 2.25]]
for (const [z0, z1, a, ac] of storeys) {
  section(stone, 8, [[z0, a], [z1, a]], null)
  section(trim, 8, [[z1, a], [z1, ac], [z1 + 0.5, ac]], z1 > 61 ? roof : trim)
  for (let i = 0; i < 8; i++) oculus(win, 8, a, i, 0.42 * a / 2.8 + 0.12, (z0 + z1) / 2)
}
// The 1889 mast: drawn twice its real thickness, with a small weathervane.
section(metal, 8, [[62.3, 0.4], [63.4, 0.4], [63.4, 0.22], [71.0, 0.14]])
section(metal, 4, [[71.0, 0.05], [71.4, 0.35], [72.0, 0.02]])

const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : p[2] < 52 ? 0.9 : 0.7)
const parts = [
  { part: stone, material: { ...finish('beyazit-stone', 0xe9e5dc), floodlight: lit } },
  { part: trim, material: { ...finish('beyazit-trim', 0xf4f1ea), floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: metal, material: finish('beyazit-mast', 0x7d8288, 0.6) },
]
const triangles = parts.reduce((s, p) => s + p.part.triangles, 0)
const glb = writeGlb('Beyazıt Tower', parts, {
  frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [41.012786, 28.964896], bearing: 0,
})
if (triangles > 5000 || glb.length > 250000) throw new Error(`Budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
const out = process.argv[2] ?? new URL('../models/istanbul-beyazit-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
