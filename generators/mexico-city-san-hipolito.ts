/**
 * Templo de San Hipólito (y San Casiano), Avenida Hidalgo at Paseo de la
 * Reforma, Mexico City (rebuilt 1599-1740): procedural, CC0-1.0.
 * bun generators/mexico-city-san-hipolito.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 9.5 (the
 * church's walls in OSM run 9.5 degrees east of north). Origin: the area
 * centroid of OSM way/1427820319 (lng -99.1468432, lat 19.4379866). The
 * church is a Latin cross oriented south to north: the facade and its two
 * towers face south (model -y) onto the atrium on Avenida Hidalgo; the
 * dome stands over the crossing near the north end. It is modelled
 * symmetric about its axis x = AX.
 *
 * Form: walls of dark red-grey tezontle rubble (opus incertum), flat
 * roofs with low saucer vaults over the nave bays; between the towers a
 * grey cantera frontispiece in three bodies with an arched door, a choir
 * window and a scrolled crest with a finial; the two towers are set at
 * 45 degrees to the church (es.wikipedia: "Las torres fueron construidas
 * giradas 45 grados respecto al alineamiento del resto del templo"), each a
 * tall lower body faced in red with pale ajaraca pattern (drawn plain
 * red), then two grey belfry stages with open arches between corner piers
 * and a small ribbed cupola with a cross; over the crossing an octagonal
 * drum with arched windows, the red tiled dome with grey ribs, and a grey
 * lantern.
 *
 * Sources
 * - OSM (ODbL): outline way/1427820319 (building=yes, no height), read in
 *   this frame (measured): front 21.5 m wide at y -37, nave block x -8.5 to
 *   12 (20.5 m) from y -15 to 12, the transept to y 26 with a west arm to
 *   x -14.9, the apse to y 38 (14 m wide). Symmetrised about AX = 1.2;
 *   the west sacristy (x -16.7 to -9.2, y 26-34) is kept as a low block.
 * - Published: plan and orientation, materials, the turned towers, the
 *   octagonal dome (es.wikipedia, "Templo de San Hipólito"). No published
 *   heights.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 ProtoplasmaKid, "Templo de San Hipólito.jpg", CC BY-SA 3.0 (square on
 *     from the south across Hidalgo, level: tower and facade heights,
 *     scaled on OSM's 21.5 m front);
 *     https://commons.wikimedia.org/wiki/File:Templo_de_San_Hip%C3%B3lito.jpg
 *   2 José Luiz, "Exterior - San Hipolito (Mexico City) - Mexico 2024.jpg",
 *     CC BY-SA 4.0 (from the south-east: tower stages, nave wall, dome);
 *     https://commons.wikimedia.org/wiki/File:Exterior_-_San_Hipolito_(Mexico_City)_-_Mexico_2024.jpg
 *   3 Juan Carlos Fonseca Mata, "Templo de San Hipólito y Casiano, Ciudad
 *     de México.jpg", CC BY-SA 4.0 (the frontispiece and the red tower
 *     bodies close up);
 *     https://commons.wikimedia.org/wiki/File:Templo_de_San_Hip%C3%B3lito_y_Casiano,_Ciudad_de_M%C3%A9xico.jpg
 *   4 B.jars, "Vista del Templo San Hipólito y Casiano en la Ciudad de
 *     México.jpg", CC BY-SA 4.0 (the east flank, dome and red roofs);
 *     https://commons.wikimedia.org/wiki/File:Vista_del_Templo_San_Hip%C3%B3lito_y_Casiano_en_la_Ciudad_de_M%C3%A9xico.jpg
 *   5 Diego Delso, "Iglesia de San Hipólito, Ciudad de México, México,
 *     2015-07-20, DD 01.jpg", CC BY-SA 4.0, and Luis Alvaz, "Torres del
 *     Templo de San Hipólito 01.jpg", CC BY-SA 4.0 (a belfry close up);
 *     https://commons.wikimedia.org/wiki/File:Iglesia_de_San_Hip%C3%B3lito,_Ciudad_de_M%C3%A9xico,_M%C3%A9xico,_2015-07-20,_DD_01.jpg
 *     https://commons.wikimedia.org/wiki/File:Torres_del_Templo_de_San_Hip%C3%B3lito_01.jpg
 *   6 Bohao Zhao, "Templo de San Hipólito - panoramio.jpg", CC BY 3.0 (the
 *     west flank and dome from the Reforma side);
 *     https://commons.wikimedia.org/wiki/File:Templo_de_San_Hip%C3%B3lito_-_panoramio.jpg
 * - Heights (estimated from photos 1 and 2): towers 4.6 m square (drawn 5.0), red
 *   body to 14.5 m, first belfry stage to 22.6, second to 27.8, cupola to
 *   30.6, cross to 32.4; frontispiece cornice 16, crest to 21.5 and finial
 *   23; nave and transept walls 13; drum 13-17.8 (octagon r 5.6), dome to
 *   22.6, lantern to 26.1, cross 27.6 (lowered after comparing with photo 4).
 * - Doubts: the north end (apse) and the roofs are seen only obliquely
 *   (photo 4); OSM's apse sits ~3 m west of the nave axis and is drawn on
 *   the axis. way/1427820322, an unnamed building overlapping the apse to
 *   the north, is not replaced.
 * - Terrain: Mapterhorn has no z15 terrain here; flat lake-bed basin
 *   (~2,240 m). The church has settled; modelled level.
 * - Look-only: none.
 * - Simplified: the ajaraca pattern of the tower bodies, the
 *   frontispiece's columns and reliefs, pinnacles and urns are left out.
 * - Night: the facade and towers are floodlit, the dome softly.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { slab, lathe, panel, save, type XY } from './dc-nmaahc'
import { tf } from './dc-white-house'

const tez = new Part(), red = new Part(), grey = new Part(), tile = new Part(), roof = new Part(), win = new Part()

const AX = 1.2
const WALL = 13.0
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const diamond = (cx: number, cy: number, s: number): XY[] => { const h = (s * Math.SQRT2) / 2; return [[cx, cy - h], [cx + h, cy], [cx, cy + h], [cx - h, cy]] }

// --- Body: nave, transept, apse, sacristy (tezontle) ------------------------
const NH = 10.25
slab(tez, rect(AX - NH, AX + NH, -35.0, 25.5), 0, WALL, 0.35, roof)
slab(tez, rect(AX - 14.6, AX + 14.6, 12.5, 25.5), 0, WALL, 0.35, roof)
slab(tez, rect(AX - 7.0, AX + 7.0, 25.5, 38.0), 0, WALL - 1.0, 0.35, roof)
slab(tez, rect(-16.7, AX - 7.0, 26.0, 34.0), 0, 8.0, 0.3, roof)
// low saucer vaults over the nave bays
for (const y of [-26.5, -15.5, -4.5, 6.0]) lathe(tile, AX, y, [[4.0, WALL], [3.5, WALL + 0.6], [2.2, WALL + 1.1], [0.01, WALL + 1.3]], 12, false)
// transept arms and apse vaults
for (const x of [AX - 10.5, AX + 10.5]) lathe(tile, x, 19.0, [[3.6, WALL], [3.0, WALL + 0.9], [1.8, WALL + 1.5], [0.01, WALL + 1.7]], 12, false)
lathe(tile, AX, 31.5, [[4.4, WALL - 1.0], [3.8, WALL], [2.4, WALL + 0.8], [0.01, WALL + 1.1]], 12, false)
// buttresses along the flanks, between the bays
for (const y of [-32.0, -21.0, -10.0, 0.5, 11.0]) {
  slab(tez, rect(AX + NH - 0.1, AX + NH + 0.9, y - 0.7, y + 0.7), 0, WALL - 1.2, 0.3)
  slab(tez, rect(AX - NH - 0.9, AX - NH + 0.1, y - 0.7, y + 0.7), 0, WALL - 1.2, 0.3)
}
// a few windows high in the flanks (lunettes), one per bay
for (const y of [-26.5, -15.5, -4.5, 6.0]) {
  panel(win, [AX + NH, y - 1.1], [AX + NH, y + 1.1], 0, 1, 8.6, 11.0, 0.05)
  panel(win, [AX - NH, y + 1.1], [AX - NH, y - 1.1], 0, 1, 8.6, 11.0, 0.05)
}

// --- Frontispiece between the towers (grey cantera) -------------------------
{
  const y = -35.0, h = 3.9
  slab(grey, rect(AX - h, AX + h, y - 0.5, y + 0.4), 0, 16.0, 0.25, grey)
  // cornices of the three bodies
  slab(grey, rect(AX - h - 0.2, AX + h + 0.2, y - 0.9, y + 0.4), 6.6, 7.3, 0.2, grey)
  slab(grey, rect(AX - h - 0.2, AX + h + 0.2, y - 0.9, y + 0.4), 15.6, 16.4, 0.25, grey)
  // the crest: a stepped, tapering scroll gable with a finial
  const crest: [number, number, number][] = [[3.4, 16.4, 18.0], [2.4, 18.0, 19.8], [1.5, 19.8, 21.5]]
  for (const [w, z0, z1] of crest) slab(grey, rect(AX - w, AX + w, y - 0.4, y + 0.4), z0, z1, 0.25, grey)
  lathe(grey, AX, y, [[0.6, 21.5], [0.8, 22.0], [0.5, 22.6], [0.01, 23.0]], 8, false)
  // side volutes (urns) on the cornice
  for (const s of [-1, 1]) lathe(grey, AX + s * 3.6, y - 0.2, [[0.45, 16.4], [0.55, 17.0], [0.3, 17.6], [0.01, 17.9]], 8, false)
  // the arched door and the choir window
  const fy = y - 0.5
  const arch = (x0: number, x1: number, z0: number, z1: number, d: number) => {
    const r = (x1 - x0) / 2, zs = z1 - r, cx = (x0 + x1) / 2
    const pts: XY[] = [[x0, z0], [x1, z0]]
    for (let i = 0; i <= 8; i++) { const t = (Math.PI * i) / 8; pts.push([cx + r * Math.cos(t), zs + r * Math.sin(t)]) }
    for (let i = 1; i < pts.length - 1; i++) tf(win, [pts[0][0], fy - d, pts[0][1]], [pts[i][0], fy - d, pts[i][1]], [pts[i + 1][0], fy - d, pts[i + 1][1]], [0, -1, 0])
  }
  arch(AX - 1.7, AX + 1.7, 0.2, 6.0, 0.05)
  arch(AX - 1.0, AX + 1.0, 9.0, 12.4, 0.05)
  // a niche in the second body for the saint (dark recess look)
  arch(AX - 0.6, AX + 0.6, 17.0, 19.2, 0.45)
}

// --- Towers, turned 45 degrees ----------------------------------------------
const S = 5.0 // side of the lower body (photos give 4.4-4.8; drawn bolder for phone size)
function belfryStage(cx: number, cy: number, side: number, z0: number, z1: number) {
  // corner piers with open arches between them, a dark core inside,
  // bands at foot and head; all on a diamond (turned 45 degrees).
  const pier = 1.05
  const h = side / 2
  // corner piers: little squares at the four corners of the turned square
  const corners: [number, number][] = [[-h + pier / 2, -h + pier / 2], [h - pier / 2, -h + pier / 2], [h - pier / 2, h - pier / 2], [-h + pier / 2, h - pier / 2]]
  const rot = ([u, v]: [number, number]): XY => [cx + (u - v) * Math.SQRT1_2, cy + (u + v) * Math.SQRT1_2]
  const sq = (u: number, v: number, w: number): XY[] => [[u - w, v - w], [u + w, v - w], [u + w, v + w], [u - w, v + w]].map((p) => rot(p as [number, number]))
  for (const [u, v] of corners) slab(grey, sq(u, v, pier / 2), z0, z1, 0, false)
  // a dark core, set well back
  slab(tez, sq(0, 0, h - 1.3), z0, z1, 0, false)
  // arch heads: a band across each face over the openings, with a round
  // soffit drawn as a stepped spandrel
  const head = z1 - 0.75
  slab(grey, sq(0, 0, h), head, z1, 0, false)
  slab(grey, sq(0, 0, h + 0.05), head - 0.35, head, 0, false)
  // parapet / sill band at the foot
  slab(grey, sq(0, 0, h), z0, z0 + 0.6, 0, false)
}
for (const s of [-1, 1]) {
  const cx = AX + s * 7.5, cy = -33.75
  // red lower body with a grey plinth and cornice
  slab(grey, diamond(cx, cy, S + 0.3), 0, 1.0, 0.15, grey)
  slab(red, diamond(cx, cy, S), 1.0, 14.0, 0, false)
  slab(grey, diamond(cx, cy, S + 0.6), 14.0, 14.8, 0.25, grey)
  // first belfry stage
  belfryStage(cx, cy, S - 0.2, 14.8, 22.6)
  slab(grey, diamond(cx, cy, S + 0.4), 22.6, 23.3, 0.25, grey)
  // second, smaller stage
  belfryStage(cx, cy, S - 1.0, 23.3, 27.8)
  slab(grey, diamond(cx, cy, S - 0.4), 27.8, 28.4, 0.2, grey)
  // ribbed cupola, ball and cross
  lathe(grey, cx, cy, [[1.8, 28.4], [1.75, 29.1], [1.45, 29.8], [0.9, 30.3], [0.35, 30.6], [0.01, 30.65]], 8, false)
  lathe(grey, cx, cy, [[0.15, 30.6], [0.32, 30.9], [0.15, 31.2], [0.01, 31.25]], 6, false)
  slab(grey, rect(cx - 0.09, cx + 0.09, cy - 0.09, cy + 0.09), 31.2, 32.4, 0, true)
  slab(grey, rect(cx - 0.45, cx + 0.45, cy - 0.09, cy + 0.09), 31.85, 32.05, 0, true)
}

// --- Dome over the crossing -------------------------------------------------
{
  const cx = AX, cy = 19.0, R = 5.6, N = 8
  const oct = (r: number): XY[] => Array.from({ length: N }, (_, i) => { const t = ((i + 0.5) * 2 * Math.PI) / N; return [cx + r * Math.cos(t), cy + r * Math.sin(t)] as XY })
  slab(grey, oct(R + 0.4), WALL, WALL + 0.6, 0.15, grey)
  slab(grey, oct(R), WALL + 0.6, 17.2, 0, false)
  slab(grey, oct(R + 0.35), 17.2, 17.8, 0.2, false)
  // arched windows on the drum faces
  const ring = oct(R)
  for (let i = 0; i < N; i++) {
    const a = ring[i], b = ring[(i + 1) % N]
    panel(win, a, b, 0.32, 0.68, 14.2, 16.5, 0.05)
  }
  // the tiled dome: octagonal, slightly raised profile
  const prof: [number, number][] = []
  for (let k = 0; k <= 6; k++) { const t = (Math.PI / 2) * (k / 6) * 0.86; prof.push([(R + 0.1) * Math.cos(t), 17.8 + 4.9 * Math.sin(t)]) }
  const ringAt = (r: number, z: number): V3[] => Array.from({ length: N }, (_, i) => { const t = ((i + 0.5) * 2 * Math.PI) / N; return [cx + r * Math.cos(t), cy + r * Math.sin(t), z] })
  tile.loft(prof.map(([r, z]) => ringAt(r, z)))
  const [rt, zt] = prof[prof.length - 1]
  tile.cap(ringAt(rt, zt), true)
  // grey ribs on the eight arrises
  for (let i = 0; i < N; i++) {
    const t = ((i + 0.5) * 2 * Math.PI) / N, ux = Math.cos(t), uy = Math.sin(t), vx = -uy, vy = ux
    for (let k = 0; k < prof.length - 1; k++) {
      const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
      const P = (r: number, z: number, o: number, s: number): V3 => [cx + ux * (r + o) + vx * s, cy + uy * (r + o) + vy * s, z + o * 0.3]
      const w = 0.28
      grey.quad(P(r0, z0, 0.22, -w), P(r0, z0, 0.22, w), P(r1, z1, 0.22, w), P(r1, z1, 0.22, -w))
      grey.quad(P(r0, z0, 0, -w), P(r0, z0, 0.22, -w), P(r1, z1, 0.22, -w), P(r1, z1, 0, -w))
      grey.quad(P(r0, z0, 0.22, w), P(r0, z0, 0, w), P(r1, z1, 0, w), P(r1, z1, 0.22, w))
    }
  }
  // lantern: octagonal, windows, cupola, cross
  const L0 = zt
  slab(grey, oct(1.5), L0 - 0.3, L0 + 2.2, 0, false)
  const lr = oct(1.5)
  for (let i = 0; i < N; i += 2) panel(win, lr[i], lr[(i + 1) % N], 0.2, 0.8, L0 + 0.4, L0 + 1.8, 0.04)
  lathe(grey, cx, cy, [[1.75, L0 + 2.2], [1.6, L0 + 2.6], [1.0, L0 + 3.1], [0.3, L0 + 3.4], [0.01, L0 + 3.45]], 8, false)
  slab(grey, rect(cx - 0.09, cx + 0.09, cy - 0.09, cy + 0.09), L0 + 3.4, L0 + 5.0, 0, true)
  slab(grey, rect(cx - 0.4, cx + 0.4, cy - 0.09, cy + 0.09), L0 + 4.4, L0 + 4.6, 0, true)
}

// ---------------------------------------------------------------------------
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : p[1] < -28 ? 1 : 0.4)
await save('mexico-city-san-hipolito', 'Templo de San Hipólito', [
  { part: tez, material: { ...finish('sanhip-tezontle', 0x84706a), floodlight: lit } as any },
  { part: red, material: { ...finish('sanhip-tower-red', 0xbf8577), floodlight: lit } as any },
  { part: grey, material: { ...finish('sanhip-cantera', 0xaba397), floodlight: lit } as any },
  { part: tile, material: { ...finish('sanhip-dome-tile', 0xc06a52), floodlight: (_p: V3, n: V3) => (n[2] > 0.9 ? 0.3 : 0.6) } as any },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
], { name: 'Templo de San Hipólito' }, 6500)
