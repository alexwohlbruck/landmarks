/**
 * Parroquia de San Juan Bautista and its former Dominican convent (church
 * rebuilt 1582-1592, facade and tower 17th-18th c.), Jardín Hidalgo,
 * Coyoacán, Mexico City: procedural, CC0-1.0.
 * bun generators/mexico-city-san-juan-bautista-coyoacan.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 15 (the
 * relation's walls run at 15 and 105 degrees; in this frame they are
 * axis-aligned). Origin: the area centroid of the outer way/148255378 of
 * OSM relation/2168347 (lng -99.162375, lat 19.3487889).
 *
 * Layout (from OSM in this frame, and the photos): the church's facade
 * faces west onto the Jardín Hidalgo atrium at x = -34.3; its nave runs
 * east along y = 15.6 to an apse ending at x = 37.4. The single tower
 * stands at the north end of the facade (OSM's round roof part
 * way/1373754346 is its cupola). The main dome over the crossing near
 * x = 18.5 (OSM roof part way/1373754347, r 4.5) is tiled yellow-ochre
 * with stone ribs and a lantern; a smaller red dome (way/1373754345, r 3.2)
 * crowns a chapel on the north side. South of the church, the former
 * convent: two plastered storeys round the cloister (the relation's inner
 * way/161930337, left open), with the arcaded portería on the atrium.
 *
 * Form, from the photos: grey cantera facade in two bodies with a central
 * arched door, a choir window and a crest with finials, between two
 * stepped buttresses of dark volcanic stone that end in pinnacles; nave
 * and chapel walls of dark grey rubble (basalt) with buttresses; the tower
 * plastered cream with grey stone trim, a tall plain body, two belfry
 * stages with arched openings, a ribbed cupola and lantern with a cross;
 * the convent cream-ochre with seven round arches on stone piers.
 *
 * Sources
 * - OSM (ODbL): relation/2168347 (building church, wikidata Q5910431):
 *   outer way/148255378 (the church and convent), inner way/161930337
 *   (the cloister, ~18 m square), roof parts way/1373754345/6/7 (measured).
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 Omar Ulises Ruiz Casas, "Iglesia de San Juan Bautista (Centro de
 *     Coyoacán).jpg", CC BY-SA 4.0 (facade, tower and portería from the
 *     west, level; heights scaled on people at the door);
 *     https://commons.wikimedia.org/wiki/File:Iglesia_de_San_Juan_Bautista_(Centro_de_Coyoac%C3%A1n).jpg
 *   2 José Luiz, "Main Facade - San Juan Bautista de Coyoacan - Mexico
 *     2024.jpg", CC BY-SA 4.0 (facade and arcade, wide);
 *     https://commons.wikimedia.org/wiki/File:Main_Facade_-_San_Juan_Bautista_de_Coyoacan_-_Mexico_2024.jpg
 *   3 Ines Suarez R., "Iglesia San Juan Bautista de costado.jpg", CC BY-SA
 *     4.0 (the north flank: basalt walls, the tiled dome and the red dome);
 *     https://commons.wikimedia.org/wiki/File:Iglesia_San_Juan_Bautista_de_costado.jpg
 *   4 Vicmunz, "Iglesia y ex Convento de San Juan Bautista in
 *     Coyoacan.jpg", CC BY-SA 4.0 (facade and tower from the south-west);
 *     https://commons.wikimedia.org/wiki/File:Iglesia_y_ex_Convento_de_San_Juan_Bautista_in_Coyoacan.jpg
 *   5 Raymundo Perera, "Iglesia de San Juan Bautista, Centro de
 *     Coyoacán.jpg", CC BY-SA 3.0 (dusk, facade and convent from the
 *     north-west); Diana Paola Milla Perdomo, "Iglesia de San Juan Bautista
 *     por la parte de atrás.jpg", CC BY-SA 4.0 (domes from the east);
 *     https://commons.wikimedia.org/wiki/File:Iglesia_de_San_Juan_Bautista,_Centro_de_Coyoac%C3%A1n.jpg
 *     https://commons.wikimedia.org/wiki/File:Iglesia_de_San_Juan_Bautista_por_la_parte_de_atr%C3%A1s.jpg
 *   6 A01650377, "Church tower and former convent of San Juan
 *     Bautista.jpg", CC BY-SA 4.0 (the tower's stages).
 *     https://commons.wikimedia.org/wiki/File:Church_tower_and_former_convent_of_San_Juan_Bautista.jpg
 * - Heights (estimated from photo 1, people at the door for scale; none
 *   published): facade cornice 16.5, crest 19.2 (finial 20.5), pinnacles 18.6;
 *   nave walls 14; tower body to 17.7, belfry stages to 21.9 and 24.3,
 *   cupola to 26.4, lantern 27.4, cross to 28.6 (belfries and cupola drawn
 *   ~15% wider than measured, for phone size); dome drum 14-18, dome to 22.5, lantern 25.5;
 *   red dome 11-15.5; convent 9.5 (two storeys), arcade springing 3.4.
 * - Doubts: the plan of the church's east half is inferred from the
 *   outline (no aerial photo); the main dome is put on the nave axis
 *   (OSM's part sits 2.7 m south of it); the transept is not drawn; the
 *   convent's courtyard ranges are plain.
 * - Terrain: Mapterhorn has no z15 terrain here (tools/terrain.ts 404s);
 *   Coyoacán is on the flat basin floor. Elevation 0.
 * - Look-only: none.
 * - Night: the facade and tower are floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { slab, lathe, panel, save, orient, earcut, walls, type XY } from './dc-nmaahc'

const cantera = new Part(), basalt = new Part(), cream = new Part(), tile = new Part(), red = new Part(), win = new Part()

const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const AY = 15.6 // nave axis
const FX = -34.3 // facade plane

// --- Convent: the outline with the cloister open -----------------------------
const OUTLINE: XY[] = [[-34.2, 34.6], [-18.1, 34.7], [-18.0, 39.5], [-7.8, 39.5], [-7.8, 28.1], [5.8, 28.2], [5.8, 38.2], [16.1, 38.3], [16.1, 40.2], [19.7, 40.3], [19.7, 46.9], [26.4, 46.9], [26.4, 40.6], [33.3, 40.6], [33.4, 38.9], [33.4, 33.5], [26.0, 33.5], [25.9, 25.7], [29.8, 25.7], [29.8, 20.7], [37.4, 20.7], [37.4, 10.6], [42.0, 10.6], [41.9, -2.3], [15.2, -2.3], [15.2, -41.9], [6.8, -41.9], [6.7, -33.2], [-10.7, -33.2], [-10.6, -42.2], [0.3, -42.2], [0.3, -49.4], [-29.3, -49.5], [-29.3, -42.2], [-18.0, -42.2], [-18.0, -33.2], [-32.0, -33.2], [-32.0, -44.8], [-39.2, -44.8], [-39.2, -27.2], [-34.3, -27.2], [-34.3, 17.3]]
const CLOISTER: XY[] = [[-17.3, -1.2], [-17.6, -19.5], [0.8, -19.7], [0.7, -1.1]]
const CONV = 9.5, ARC0 = -25.5, ARC1 = 5.6, PORCH = 3.5

/** A flat ring with a hole, as a keyhole polygon, capped at z. */
function capWithHole(p: Part, outer: XY[], hole: XY[], z: number) {
  // bridge from the outer vertex nearest the hole's first vertex
  let bi = 0, bd = 1e9
  outer.forEach((q, i) => { const d = Math.hypot(q[0] - hole[0][0], q[1] - hole[0][1]); if (d < bd) { bd = d; bi = i } })
  const area = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
  const o = area(outer) > 0 ? outer : [...outer].reverse()
  const h = area(hole) > 0 ? [...hole].reverse() : hole
  const oi = o.indexOf(outer[bi])
  const ring: XY[] = [...o.slice(0, oi + 1), ...h, h[0], o[oi], ...o.slice(oi + 1)]
  // nudge the duplicated bridge ends apart a hair so the clipper sees a slit
  ring[oi + 1 + h.length] = [h[0][0] + 0.01, h[0][1] + 0.01]
  ring[oi + 2 + h.length] = [o[oi][0] + 0.01, o[oi][1] + 0.01]
  for (const [a, b, c] of earcut(ring)) orient(p, [[...ring[a], z], [...ring[b], z], [...ring[c], z]] as V3[], [0, 0, 1])
}
{
  // ground storey: the portería's front set back behind the arcade
  const ground: XY[] = []
  for (const q of OUTLINE) {
    ground.push(q)
    if (q[0] === -39.2 && q[1] === -27.2) ground.push([-34.3, -27.2], [-34.3, ARC0], [FX + PORCH, ARC0], [FX + PORCH, ARC1], [FX, ARC1])
  }
  // drop the original (-34.3, -27.2) duplicate
  const g = ground.filter((q, i) => !(q[0] === -34.3 && q[1] === -27.2 && ground.findIndex((r) => r[0] === -34.3 && r[1] === -27.2) !== i))
  walls(cream, g, 0, 6.2)
  walls(cream, OUTLINE, 6.2, CONV)
  // cloister walls face the court
  capWithHole(cream, OUTLINE, CLOISTER, CONV)
  // the porch ceiling under the arcade's upper floor
  orient(cream, [[FX, ARC0, 6.2], [FX + PORCH, ARC0, 6.2], [FX + PORCH, ARC1, 6.2], [FX, ARC1, 6.2]] as V3[], [0, 0, -1])
  // convent windows: upper storey along the west front and around
  for (let y = ARC0 + 2.2; y < ARC1 - 1; y += 4.44) panel(win, [FX, y + 1.0], [FX, y - 1.0], 0, 1, 7.0, 8.8, 0.05)
}

// the cloister's walls, facing the court, with its arcade as dark panels
{
  const r = CLOISTER
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const c: XY = [-8.4, -10.4]
    const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    orient(cream, [[...a, 0], [...b, 0], [...b, CONV], [...a, CONV]] as V3[], [c[0] - m[0], c[1] - m[1], 0])
    // a band of cloister arches on the court side, as dark panels
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.round(L / 3.6)
    const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = (c[0] - m[0]), ny = (c[1] - m[1]), nl = Math.hypot(nx, ny)
    for (let k = 0; k < n; k++) {
      const s0 = (k + 0.2) * (L / n), s1 = (k + 0.8) * (L / n)
      const o = 0.05
      const P = (s: number, z: number): V3 => [a[0] + ux * s + (nx / nl) * o, a[1] + uy * s + (ny / nl) * o, z]
      orient(win, [P(s0, 0.3), P(s1, 0.3), P(s1, 3.4), P(s0, 3.4)], [nx, ny, 0])
    }
  }
}

// --- Portería arcade: seven round arches on piers ---------------------------
{
  const n = 7, pitch = (ARC1 - ARC0) / n, pier = 0.9, spring = 3.4, top = 6.2
  for (let k = 0; k <= n; k++) {
    const y = ARC0 + k * pitch
    const y0 = k === 0 ? y : y - pier / 2, y1 = k === n ? y : y + pier / 2
    slab(cantera, rect(FX, FX + 1.0, k === 0 ? y : y0, k === n ? y : y1), 0, spring, 0, false)
  }
  // the spandrel wall with semicircular cut-outs, front and back faces
  const r = (pitch - pier) / 2
  for (const [x, dir] of [[FX, -1], [FX + 1.0, 1]] as [number, number][]) {
    for (let k = 0; k < n; k++) {
      const yc = ARC0 + (k + 0.5) * pitch
      const pts: XY[] = [] // (y, z) in the wall plane
      pts.push([yc - pitch / 2, top], [yc - pitch / 2, spring], [yc - r, spring])
      for (let i = 1; i < 10; i++) { const t = Math.PI - (Math.PI * i) / 10; pts.push([yc + r * Math.cos(t), spring + r * Math.sin(t)]) }
      pts.push([yc + r, spring], [yc + pitch / 2, spring], [yc + pitch / 2, top])
      for (const [a, b, c] of earcut(pts)) orient(cream, [[x, ...pts[a]], [x, ...pts[b]], [x, ...pts[c]]] as V3[], [dir, 0, 0])
      // the arch soffit
      for (let i = 0; i < 10; i++) {
        const t0 = Math.PI - (Math.PI * i) / 10, t1 = Math.PI - (Math.PI * (i + 1)) / 10
        const q0: [number, number] = [yc + r * Math.cos(t0), spring + r * Math.sin(t0)], q1: [number, number] = [yc + r * Math.cos(t1), spring + r * Math.sin(t1)]
        orient(cream, [[FX, ...q0], [FX, ...q1], [FX + 1.0, ...q1], [FX + 1.0, ...q0]] as V3[], [0, yc - (q0[0] + q1[0]) / 2, spring - (q0[1] + q1[1]) / 2])
      }
    }
  }
  // doorways and windows on the porch's back wall, one per bay, so the arches read
  for (let k = 0; k < n; k++) {
    const yc = ARC0 + (k + 0.5) * pitch
    panel(win, [FX + PORCH, yc + (pitch - pier) / 2], [FX + PORCH, yc - (pitch - pier) / 2], 0, 1, 0, 5.4, 0.05)
  }
  // the parapet cap over the arcade's front wall
  slab(cream, rect(FX - 0.15, FX + 1.0, ARC0, ARC1), top, top + 0.4, 0.15)
}

// --- Church: nave, apse, north chapels (dark basalt rubble) ---------------
const NW = 8.0 // nave half-width
// (each grown 0.12 m past the outline so it covers the convent's walls there)
const G = 0.12
const rg = (x0: number, x1: number, y0: number, y1: number) => rect(x0 - G, x1 + G, y0 - G, y1 + G)
slab(basalt, rg(FX, 30.0, AY - NW, AY + NW), 0, 14.0, 0.3, roofTop())
slab(basalt, rg(29.5, 37.4, 10.6, 20.7), 0, 12.5, 0.3, roofTop())
slab(basalt, rg(-18.0, -7.8, AY + NW - 0.5, 39.5), 0, 10.0, 0.3, roofTop())
slab(basalt, rg(5.8, 26.0, AY + NW - 0.5, 38.3), 0, 10.5, 0.3, roofTop())
slab(basalt, rg(19.7, 26.4, 38.0, 46.9), 0, 9.6, 0.3, roofTop())
slab(basalt, rg(26.0, 33.4, 25.7, 40.6), 0, 9.8, 0.3, roofTop())
// the church's flat roofs read as the dark stone (no open aerial shows them)
function roofTop() { return basalt }
// buttresses along the nave's north and south flanks
for (const x of [-26, -16, -6, 4, 14]) {
  slab(basalt, rect(x - 0.8, x + 0.8, AY + NW - 0.1, AY + NW + 1.4), 0, 12.0, 0.3)
  slab(basalt, rect(x - 0.8, x + 0.8, AY - NW - 1.4, AY - NW + 0.1), 0, 12.0, 0.3)
}
// high windows in the nave flanks (south side above the convent roof)
for (const x of [-21, -11, -1, 9]) panel(win, [x - 1.0, AY - NW], [x + 1.0, AY - NW], 0, 1, 10.6, 12.8, 0.05)
for (const x of [-21, 9]) panel(win, [x + 1.0, AY + NW], [x - 1.0, AY + NW], 0, 1, 10.6, 12.8, 0.05)

// --- Facade (grey cantera) between two stepped basalt buttresses -----------
{
  const y0 = AY - NW, y1 = AY + NW
  slab(cantera, rect(FX - 0.6, FX + 0.5, y0 + 0.2, y1 - 0.2), 0, 16.5, 0.25)
  // cornice between the bodies and at the top
  slab(cantera, rect(FX - 1.0, FX + 0.5, y0 + 0.2, y1 - 0.2), 9.0, 9.7, 0.2)
  slab(cantera, rect(FX - 1.0, FX + 0.5, y0 + 0.2, y1 - 0.2), 16.0, 16.7, 0.2)
  // the crest: a stepped gable with a niche and a finial
  slab(cantera, rect(FX - 0.6, FX + 0.4, AY - 3.2, AY + 3.2), 16.7, 18.0, 0.2)
  slab(cantera, rect(FX - 0.6, FX + 0.4, AY - 1.8, AY + 1.8), 18.0, 19.2, 0.2)
  lathe(cantera, FX - 0.1, AY, [[0.4, 19.2], [0.5, 19.6], [0.22, 20.2], [0.01, 20.5]], 6, false)
  // finials along the top
  for (const y of [y0 + 2.6, AY - 4.6, AY + 4.6, y1 - 2.6]) lathe(cantera, FX - 0.3, y, [[0.45, 16.7], [0.5, 17.1], [0.28, 17.9], [0.01, 18.4]], 6, false)
  // pilasters framing the door (paired, both bodies)
  for (const s of [-1, 1]) for (const d of [2.6, 4.2]) slab(cantera, rect(FX - 1.0, FX - 0.5, AY + s * d - 0.35, AY + s * d + 0.35), 0, 16.0, 0.12)
  // arched door, choir window, side windows
  const fx = FX - 1.0
  const arch = (y0: number, y1: number, z0: number, z1: number, x: number) => {
    const r = (y1 - y0) / 2, zs = z1 - r, yc = (y0 + y1) / 2
    const pts: XY[] = [[y1, z0], [y1, zs]]
    for (let i = 1; i < 10; i++) { const t = (Math.PI * i) / 10; pts.push([yc + r * Math.cos(t), zs + r * Math.sin(t)]) }
    pts.push([y0, zs], [y0, z0])
    for (const [a, b, c] of earcut(pts)) orient(win, [[x, ...pts[a]], [x, ...pts[b]], [x, ...pts[c]]] as V3[], [-1, 0, 0])
  }
  arch(AY - 1.8, AY + 1.8, 0.1, 6.8, fx - 0.04)
  panel(win, [FX - 0.6, AY + 0.9], [FX - 0.6, AY - 0.9], 0, 1, 11.2, 13.8, 0.05)
  for (const s of [-1, 1]) panel(win, [FX - 0.6, AY + s * 6.0 + 0.7], [FX - 0.6, AY + s * 6.0 - 0.7], 0, 1, 11.6, 13.6, 0.05)
  // the buttresses: stepped, each ending in a pinnacle
  for (const yc of [y0 - 0.6, y1 + 0.6]) {
    slab(basalt, rect(FX - 2.4, FX + 0.5, yc - 1.2, yc + 1.2), 0, 8.0, 0.25)
    slab(basalt, rect(FX - 1.6, FX + 0.5, yc - 0.95, yc + 0.95), 8.0, 15.5, 0.25)
    lathe(basalt, FX - 0.6, yc, [[0.9, 15.5], [0.75, 16.6], [0.35, 18.0], [0.01, 18.6]], 6, false)
  }
}

// --- The tower (cream plaster with grey cantera trim) ------------------------
// Belfry stages and cupola drawn ~15% wider than measured so the tower holds
// at phone size; heights stay with the photo.
{
  const cx = FX + 3.5, cy = AY + NW + 1.2 + 3.6, h = 3.6
  const sq = (s: number): XY[] => rect(cx - s, cx + s, cy - s, cy + s)
  slab(cantera, sq(h + 0.2), 0, 1.2, 0.15)
  slab(cream, sq(h), 1.2, 17.7, 0, false)
  for (const [u, v] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) slab(cantera, rect(cx + u * h - 0.5, cx + u * h + 0.5, cy + v * h - 0.5, cy + v * h + 0.5).map(([x, y]) => [x - u * 0.45, y - v * 0.45] as XY), 1.2, 17.7, 0, false)
  slab(cantera, sq(h + 0.5), 17.7, 18.3, 0.2)
  // two belfry stages: corner piers, a dark core behind open arches, bands
  const stage = (s: number, z0: number, z1: number) => {
    const p = 1.0
    for (const [u, v] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) slab(cream, rect(cx + u * (s - p / 2) - p / 2, cx + u * (s - p / 2) + p / 2, cy + v * (s - p / 2) - p / 2, cy + v * (s - p / 2) + p / 2), z0, z1, 0, false)
    slab(win, sq(s - 1.1), z0, z1, 0, false)
    slab(cantera, sq(s + 0.05), z1 - 0.9, z1, 0, false)
    // round arch heads: the band dips over each opening as a stepped soffit
    slab(cream, sq(s), z1 - 1.5, z1 - 0.9, 0, false)
  }
  stage(3.75, 18.3, 21.9)
  slab(cantera, sq(4.0), 21.9, 22.4, 0.2)
  stage(3.0, 22.4, 24.3)
  slab(cantera, sq(3.35), 24.3, 24.7, 0.15)
  // ribbed cupola, lantern, cross
  lathe(cream, cx, cy, [[2.9, 24.7], [2.8, 25.3], [2.2, 25.9], [1.15, 26.3], [0.6, 26.4]], 8, false)
  lathe(cantera, cx, cy, [[0.65, 26.3], [0.65, 27.0], [0.8, 27.1], [0.01, 27.4]], 8, false)
  slab(cantera, rect(cx - 0.1, cx + 0.1, cy - 0.1, cy + 0.1), 27.3, 28.6, 0, true)
  slab(cantera, rect(cx - 0.1, cx + 0.1, cy - 0.45, cy + 0.45), 28.0, 28.25, 0, true)
  // a few windows in the tower body facing the atrium
  panel(win, [cx - h, cy + 0.6], [cx - h, cy - 0.6], 0, 1, 6.0, 7.8, 0.05)
  panel(win, [cx - h, cy + 0.6], [cx - h, cy - 0.6], 0, 1, 11.5, 13.2, 0.05)
}

// --- The main dome over the crossing: drum, tiled dome, ribs, lantern ------
{
  const cx = 18.5, cy = AY, R = 4.6, N = 8
  const oct = (r: number): XY[] => Array.from({ length: N }, (_, i) => { const t = ((i + 0.5) * 2 * Math.PI) / N; return [cx + r * Math.cos(t), cy + r * Math.sin(t)] as XY })
  slab(basalt, rect(cx - 6.2, cx + 6.2, cy - 6.2, cy + 6.2), 0, 15.0, 0.3, cream)
  slab(cantera, oct(R), 15.0, 18.4, 0, false)
  slab(cantera, oct(R + 0.35), 18.4, 18.9, 0.15, false)
  const ring = oct(R)
  for (let i = 0; i < N; i++) panel(win, ring[i], ring[(i + 1) % N], 0.3, 0.7, 15.8, 17.9, 0.05)
  const prof: [number, number][] = []
  for (let k = 0; k <= 6; k++) { const t = (Math.PI / 2) * (k / 6) * 0.86; prof.push([(R + 0.1) * Math.cos(t), 18.9 + 4.4 * Math.sin(t)]) }
  const ringAt = (r: number, z: number): V3[] => Array.from({ length: N }, (_, i) => { const t = ((i + 0.5) * 2 * Math.PI) / N; return [cx + r * Math.cos(t), cy + r * Math.sin(t), z] })
  tile.loft(prof.map(([r, z]) => ringAt(r, z)))
  const [rt, zt] = prof[prof.length - 1]
  tile.cap(ringAt(rt, zt), true)
  for (let i = 0; i < N; i++) {
    const t = ((i + 0.5) * 2 * Math.PI) / N, ux = Math.cos(t), uy = Math.sin(t), vx = -uy, vy = ux
    for (let k = 0; k < prof.length - 1; k++) {
      const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
      const P = (r: number, z: number, o: number, s: number): V3 => [cx + ux * (r + o) + vx * s, cy + uy * (r + o) + vy * s, z + o * 0.3]
      const w = 0.3
      orient(cantera, [P(r0, z0, 0.22, -w), P(r0, z0, 0.22, w), P(r1, z1, 0.22, w), P(r1, z1, 0.22, -w)], [ux, uy, 0.5])
      orient(cantera, [P(r0, z0, 0, -w), P(r0, z0, 0.22, -w), P(r1, z1, 0.22, -w), P(r1, z1, 0, -w)], [-vx, -vy, 0])
      orient(cantera, [P(r0, z0, 0.22, w), P(r0, z0, 0, w), P(r1, z1, 0, w), P(r1, z1, 0.22, w)], [vx, vy, 0])
    }
  }
  slab(cantera, oct(1.3), zt - 0.3, zt + 1.9, 0, false)
  const lr = oct(1.3)
  for (let i = 0; i < N; i += 2) panel(win, lr[i], lr[(i + 1) % N], 0.2, 0.8, zt + 0.3, zt + 1.5, 0.04)
  lathe(cantera, cx, cy, [[1.5, zt + 1.9], [1.35, zt + 2.3], [0.8, zt + 2.7], [0.01, zt + 2.95]], 8, false)
  slab(cantera, rect(cx - 0.08, cx + 0.08, cy - 0.08, cy + 0.08), zt + 2.9, zt + 4.2, 0, true)
  slab(cantera, rect(cx - 0.08, cx + 0.08, cy - 0.38, cy + 0.38), zt + 3.6, zt + 3.8, 0, true)
}

// --- The red dome on the north chapel --------------------------------------
{
  const cx = 16.3, cy = 34.2, R = 3.2
  lathe(cream, cx, cy, [[R, 10.5], [R, 12.0]], 12, false)
  lathe(red, cx, cy, [[R + 0.1, 12.0], [R * 0.95, 13.2], [R * 0.75, 14.3], [R * 0.4, 15.0], [0.6, 15.15]], 12, false)
  lathe(cream, cx, cy, [[0.6, 15.1], [0.6, 15.9], [0.75, 16.0], [0.01, 16.4]], 8, false)
}

const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : p[0] < FX + 4 && p[1] > AY - NW - 3 ? 1 : 0.25)
await save('mexico-city-san-juan-bautista-coyoacan', 'Parroquia de San Juan Bautista', [
  { part: cantera, material: { ...finish('sjb-cantera', 0xb3ada2), floodlight: lit } as any },
  { part: basalt, material: { ...finish('sjb-basalt', 0x857f78), floodlight: lit } as any },
  { part: cream, material: { ...finish('sjb-plaster', 0xe5cc9c), floodlight: lit } as any },
  { part: tile, material: finish('sjb-dome-tile', 0xcda960) },
  { part: red, material: finish('sjb-red-dome', 0xb85a48) },
  { part: win, material: PALETTE.window },
], { name: 'Parroquia de San Juan Bautista, Coyoacán' }, 6500)
