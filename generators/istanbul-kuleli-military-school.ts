/**
 * Kuleli Military High School, Istanbul: procedural, CC0-1.0.
 *   bun generators/istanbul-kuleli-military-school.ts
 *
 * Garabet Balyan's Kuleli cavalry barracks of 1843 on the Asian shore at
 * Çengelköy, a military high school from 1845 to 2016: the long white
 * waterfront range, a courtyard block and the north wing with its three
 * pavilions, under hipped red-tile roofs; the columned sea-gate pavilion with
 * its pediment in the middle of the courtyard block; and the two tall square
 * towers on the sea front (one at the south end, one where the two parts
 * meet), each with a round drum, a flared lead collar and a slender lead
 * spire.
 *
 * Uses the kit exported by istanbul-maidens-tower.ts.
 *
 * Frame: x east, y north, z up in the turned frame (bearing 351: the sea
 * front runs along the model's y axis, the water to the west), metres.
 * Origin at the centroid of both outlines, on the quay.
 *
 * Sources
 * - OSM (ODbL): relation/4465498 (building=school, "Kuleli Askerî Lisesi",
 *   wikidata Q6442920): outer way/307338673, courtyard way/1086211305; the
 *   north wing way/1086211304 (building, same image tag: the same range).
 * - Published: en.wikipedia "Kuleli Military High School": designed by
 *   Garabet Balyan, completed 1843. No published heights.
 * - Photos (EVIDENCE):
 *   Giorgio Galeotti, "Kuleli Military High School - Istanbul, Turkey - October 11, 2025 01.jpg",
 *     "02", "03", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Kuleli_Military_High_School_-_Istanbul,_Turkey_-_October_11,_2025_03.jpg
 *     (square-on from the water: the main ruler).
 *   flowcomm, "Kuleli Military High School in 2024.jpg", CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Kuleli_Military_High_School_in_2024.jpg (from the south-west).
 *   Eusebius, "Kuleli Askeri Lisesi.jpg", CC BY 3.0,
 *     https://commons.wikimedia.org/wiki/File:Kuleli_Askeri_Lisesi.jpg
 *   Canercangul, "Kuleli Askeri Lisesi Denizden Görünümü.jpg", CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:Kuleli_Askeri_Lisesi_Denizden_G%C3%B6r%C3%BCn%C3%BCm%C3%BC.jpg
 *
 * Numbers
 * - Plan: OSM, measured (courtyard block 151 x 109 m, wings 15.5 m deep;
 *   north wing 96 x 20 m with 3 m recesses between its pavilions).
 * - Heights photo-scaled from Galeotti 03 with the 109 m sea front as ruler:
 *   cornice 14.7 m, ridge 17; towers 12 m square, body 24 m, drum to 27.8,
 *   collar to 30.3, spire to 42.8, finial 45. Sea-gate pavilion 17 m wide,
 *   pediment to 17.5 m.
 * - Ground: the quay, level along the front; the hill behind is left to the
 *   map (no terrain service here).
 * - Colours: white render, a grey stone basement, red-brown tile, lead grey.
 *
 * Doubts
 * - The east (hill) side and the court are seen in no licensed photo; their
 *   windows are a plain repeat of the sea front's rhythm.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type P2, box, hipRoof, lathe, norm, panel, quad, tri } from './istanbul-maidens-tower'

const A0: P2 = [55.6, -1.6] // anchor in the turned frame: area centroid of both buildings (court excluded)
const X = (x: number) => x - A0[0], Y = (y: number) => y - A0[1]

const wall = new Part(), base = new Part(), tile = new Part(), lead = new Part(), glaze = new Part(), gilt = new Part()
const CORN = 14.7, PL = 2.6 // cornice, top of the stone basement

type Face = { a: P2; b: P2; n: V3 }
/** Windows along a facade from a to b: a lower arched row and an upper row. */
function windows(f: Face, pitch: number, o: { arch?: boolean; skip?: (s: number) => boolean; basement?: boolean } = {}) {
  const L = Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1]), u: P2 = [(f.b[0] - f.a[0]) / L, (f.b[1] - f.a[1]) / L]
  const k = Math.max(1, Math.floor((L - 2) / pitch)), s0 = (L - (k - 1) * pitch) / 2
  for (let i = 0; i < k; i++) {
    const s = s0 + i * pitch
    if (o.skip?.(s)) continue
    const at = (z: number): V3 => [f.a[0] + u[0] * s, f.a[1] + u[1] * s, z]
    if (o.basement !== false) panel(glaze, at(0.6), f.n, 1.3, 1.6, true, 4) // basement arches
    panel(glaze, at(PL + 0.8), f.n, 1.45, 3.6, o.arch ?? true, 4)
    panel(glaze, at(PL + 6.2), f.n, 1.45, 3.4, false)
  }
}
/** A block with a stone basement band, render above, cornice and hipped roof. */
function block(x0: number, x1: number, y0: number, y1: number, rise = 2.3, roof = true) {
  box(base, null, x0, x1, y0, y1, 0, PL, 0.3)
  box(wall, null, x0 + 0.05, x1 - 0.05, y0 + 0.05, y1 - 0.05, PL, CORN - 0.6, 0.3)
  box(wall, wall, x0 - 0.3, x1 + 0.3, y0 - 0.3, y1 + 0.3, CORN - 0.6, CORN, 0.2)
  if (roof) hipRoof(tile, x0, x1, y0, y1, CORN, rise)
}

// --- Courtyard block: four wings round the court.
const B = { x0: X(-7.5), x1: X(143.9), y0: Y(-75.6), y1: Y(33.6) }, CT = { x0: X(8.0), x1: X(128.4), y0: Y(-60.0), y1: Y(18.0) }
block(B.x0, CT.x0, B.y0, B.y1) // west (sea) wing
block(CT.x1, B.x1, B.y0, B.y1) // east wing
block(CT.x0 - 2, CT.x1 + 2, B.y0, CT.y0) // south wing
block(CT.x0 - 2, CT.x1 + 2, CT.y1, B.y1) // north wing of the block
block(X(115), X(133.4), Y(-85.8), B.y0 + 0.5, 2.0) // the south-east projection
// --- North wing: three pavilions and two narrower links.
const NW = { x0: X(-7.5), x1: X(12.5) }
for (const [y0, y1] of [[33.6, 53.5], [76.4, 88.4], [110.8, 129.5]]) block(NW.x0, NW.x1, Y(y0), Y(y1), 2.6)
for (const [y0, y1] of [[53.5, 76.4], [88.4, 110.8]]) block(NW.x0 + 2.8, NW.x1 - 3.0, Y(y0) - 0.4, Y(y1) + 0.4, 2.0)

// --- Windows: the sea front with arched lower windows, the rest plain.
const towerY = [Y(33.6), Y(-69.6)] // tower centres along the front
const nearTower = (y: number) => towerY.some((t) => Math.abs(y - t) < 7.6)
const gateY = Y(-18.5)
windows({ a: [B.x0, B.y0], b: [B.x0, B.y1], n: [-1, 0, 0] }, 3.25, { skip: (s) => nearTower(B.y0 + s) || Math.abs(B.y0 + s - gateY) < 9 })
for (const [y0, y1, d] of [[33.6, 53.5, 0], [53.5, 76.4, 2.8], [76.4, 88.4, 0], [88.4, 110.8, 2.8], [110.8, 129.5, 0]]) {
  windows({ a: [NW.x0 + d, Y(y0)], b: [NW.x0 + d, Y(y1)], n: [-1, 0, 0] }, 3.25, { skip: (s) => nearTower(Y(y0) + s) })
  windows({ a: [NW.x1 - d, Y(y1)], b: [NW.x1 - d, Y(y0)], n: [1, 0, 0] }, 3.25, { arch: false })
}
windows({ a: [NW.x1, Y(129.5)], b: [NW.x0, Y(129.5)], n: [0, 1, 0] }, 3.25, { arch: false })
windows({ a: [B.x1, B.y1], b: [B.x1, B.y0], n: [1, 0, 0] }, 3.25, { arch: false })
windows({ a: [B.x0 + 8, B.y0], b: [X(115), B.y0], n: [0, -1, 0] }, 3.25, { arch: false })
windows({ a: [B.x1, B.y1], b: [NW.x1 + 1, B.y1], n: [0, 1, 0] }, 3.25, { arch: false })

// The court's own facades.
windows({ a: [CT.x0, CT.y1], b: [CT.x0, CT.y0], n: [1, 0, 0] }, 3.25, { arch: false, basement: false })
windows({ a: [CT.x0, CT.y0], b: [CT.x1, CT.y0], n: [0, 1, 0] }, 3.25, { arch: false, basement: false })
windows({ a: [CT.x1, CT.y0], b: [CT.x1, CT.y1], n: [-1, 0, 0] }, 3.25, { arch: false, basement: false })
windows({ a: [CT.x1, CT.y1], b: [CT.x0, CT.y1], n: [0, -1, 0] }, 3.25, { arch: false, basement: false })

// --- The sea-gate pavilion: a projecting portico with paired columns and a
// pediment, centred on the sea front.
{
  const x0 = B.x0 - 1.6, x1 = B.x0 + 0.5, y0 = gateY - 8.5, y1 = gateY + 8.5
  box(base, null, x0, x1, y0, y1, 0, PL, 0.2)
  box(wall, null, x0, x1, y0, y1, PL, CORN + 0.6, 0.25)
  // Columns: paired pilasters as proud strips.
  for (const s of [-7.6, -6.6, -2.9, -1.9, 1.9, 2.9, 6.6, 7.6]) box(wall, wall, x0 - 0.45, x0, gateY + s - 0.3, gateY + s + 0.3, PL, CORN - 0.2)
  for (const s of [-5.0, 0, 5.0]) {
    panel(glaze, [x0, gateY + s, PL + 0.4], [-1, 0, 0], 2.4, 4.6, true, 6)
    panel(glaze, [x0, gateY + s, PL + 6.3], [-1, 0, 0], 2.2, 3.9, true, 6)
  }
  // Pediment: a triangle in front of a short gable roof.
  const zp = CORN + 0.6, zr = CORN + 3.0
  tri(wall, [x0 - 0.1, y0, zp], [x0 - 0.1, y1, zp], [x0 - 0.1, gateY, zr], [-1, 0, 0])
  quad(tile, [x0 - 0.3, y0 - 0.3, zp], [x0 - 0.3, gateY, zr + 0.15], [B.x0 + 6, gateY, zr + 0.15], [B.x0 + 6, y0 - 0.3, zp], norm([0, -2.6, 8.8]))
  quad(tile, [B.x0 + 6, y1 + 0.3, zp], [B.x0 + 6, gateY, zr + 0.15], [x0 - 0.3, gateY, zr + 0.15], [x0 - 0.3, y1 + 0.3, zp], norm([0, 2.6, 8.8]))
}

// --- Towers: square body with paired arched windows on four storeys, a
// cornice, a round drum with oculi, a flared lead collar and a slender spire.
for (const ty of towerY) {
  const cx = B.x0 + 4.9, h = 6.0, z1 = 24.0
  box(base, null, cx - h - 0.3, cx + h, ty - h, ty + h, 0, PL, 0.3)
  box(wall, null, cx - h - 0.3, cx + h, ty - h, ty + h, PL, z1 - 0.7, 0.35)
  box(wall, wall, cx - h - 0.75, cx + h + 0.45, ty - h - 0.45, ty + h + 0.45, z1 - 0.7, z1, 0.25)
  for (const [n, at] of [[[-1, 0, 0], (s: number, z: number): V3 => [cx - h - 0.3, ty - s, z]], [[0, -1, 0], (s: number, z: number): V3 => [cx + s, ty - h, z]], [[0, 1, 0], (s: number, z: number): V3 => [cx - s, ty + h, z]], [[1, 0, 0], (s: number, z: number): V3 => [cx + h, ty + s, z]]] as [V3, (s: number, z: number) => V3][]) {
    for (const z of [PL + 6.4, PL + 11.0, PL + 15.6]) for (const s of [-1.3, 1.3]) panel(glaze, at(s, z), n, 1.2, 2.9, true, 4)
    panel(glaze, at(0, PL + 0.9), n, 1.6, 3.2, true, 4)
  }
  const dr = 3.3
  lathe(wall, cx, ty, [[dr, z1], [dr, z1 + 3.6], [dr + 0.35, z1 + 3.8]], 16)
  for (let i = 0; i < 4; i++) {
    const a = (Math.PI / 2) * i, n: V3 = [Math.cos(a), Math.sin(a), 0]
    panel(glaze, [cx + n[0] * dr, ty + n[1] * dr, z1 + 1.1], n, 1.0, 1.4, true, 4)
  }
  lathe(lead, cx, ty, [[dr + 0.4, z1 + 3.8], [dr + 0.4, z1 + 4.3], [dr - 0.2, z1 + 5.3], [dr - 0.4, z1 + 5.9], [dr - 0.9, z1 + 6.3]], 16, { smooth: true })
  lathe(lead, cx, ty, [[dr - 0.9, z1 + 6.3], [0.35, 42.4], [0, 42.8]], 16)
  lathe(gilt, cx, ty, [[0.2, 42.5], [0.38, 43.3], [0.12, 44.2], [0, 45.0]], 6, { smooth: true })
}

const lit = (p: V3, n: V3): number => (n[2] > 0.85 ? 0.3 : 0.9)
const parts = [
  { part: wall, material: { ...PALETTE.trim, color: 0xf5efe4, floodlight: lit } },
  { part: base, material: { ...PALETTE.stone, color: 0xd9d2c6, floodlight: lit } },
  { part: tile, material: { ...PALETTE.terracotta, color: 0xa8634f } },
  { part: lead, material: { ...PALETTE.roof, color: 0x939da6 } },
  { part: glaze, material: PALETTE.window },
  { part: gilt, material: finish('gilt', 0xcaa452, 0.5) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name, part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Kuleli Military High School', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 351, osm: 'relation/4465498', height: 45,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/istanbul-kuleli-military-school.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
