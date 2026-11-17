/**
 * Auditorio Nacional, Paseo de la Reforma 50, Bosque de Chapultepec,
 * Mexico City (1952; rebuilt 1991 by Teodoro González de León and Abraham
 * Zabludovsky): procedural, CC0-1.0.
 *   bun generators/mexico-city-auditorio-nacional.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 352.1, so
 * the model's +x runs along the Reforma front (the outline's north edge,
 * bearing 82.1) and +y faces Reforma. Origin: the centroid of the OSM
 * outline (way/30373468), at street level.
 *
 * Form: the 1991 portico, a giant concrete frame: one immense deep beam,
 * its face carved with "AUDITORIO NACIONAL", spanning the whole Reforma
 * front level at 32 m; at the east end a deep pylon wall whose top climbs
 * back towards the hall like a wedge, at the west end a leg down to the
 * plaza; two huge round columns carry it between. Behind it a raised
 * plaza, a round drum beside the pylon and the dark glazed lobby, roofed
 * by a glazed space frame of sawtooth ridges that climbs back from the
 * beam to the hall. The hall is the fan-shaped bowl, its curved front
 * clad above the lobby roof in grey glass and metal panels. All in
 * concrete with a pink-brown granite-chip finish. The
 * front is a broad flight of steps up to the plaza.
 *
 * Sources
 * - OSM (ODbL): way/30373468 (the outline, building=yes, no height) and
 *   way/1279187823 (building:part, the fan-shaped hall). Both replaced.
 *   The north edge is the Reforma front; the hall's axis (bearing 10) is
 *   turned 18 degrees from it, as the 1991 front was set square to
 *   Reforma, not to the old hall.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 Pierre-Selim Huard, "Ciudad de Mexico - 1194 - Auditorio
 *     Nacional.jpg", CC BY 4.0 (from the north-east: the pylon, the raking
 *     beam and its height against the people on the steps, the drum, the glass roof climbing to the hall, the steps);
 *     https://commons.wikimedia.org/wiki/File:Ciudad_de_Mexico_-_1194_-_Auditorio_Nacional.jpg
 *   2 Sarumo74, "AUDITORIO NACIONAL CDMEXICO.JPG", CC BY 3.0 (the same
 *     side: the pylon's top continuing the beam's slope, the columns);
 *     https://commons.wikimedia.org/wiki/File:AUDITORIO_NACIONAL_CDMEXICO.JPG
 *   3 ProtoplasmaKid, "Auditorio Nacional (México) - Fachada.JPG",
 *     CC BY-SA 4.0, and Nacho Facello, "Auditorio Nacional México
 *     2011.jpg", CC BY-SA 2.0 (the beam's depth against the columns, the
 *     east end);
 *     https://commons.wikimedia.org/wiki/File:Auditorio_Nacional_(M%C3%A9xico)_-_Fachada.JPG
 *     https://commons.wikimedia.org/wiki/File:Auditorio_Nacional_M%C3%A9xico_2011.jpg
 *   4 JavierDo, "Auditorio nacional - panoramio.jpg", CC BY-SA 3.0 (front:
 *     the clad hall wall above the beam);
 *     https://commons.wikimedia.org/wiki/File:Auditorio_nacional_-_panoramio.jpg
 *   5 Daniel Lobo, "VistaAereaAuditorioNacional.jpg", CC BY 2.0 (from a
 *     tower across Reforma: the sawtooth glass ridges, the clad hall, the
 *     column scale against people);
 *     https://commons.wikimedia.org/wiki/File:VistaAereaAuditorioNacional.jpg
 *   6 ProtoplasmaKid, "Vista aérea de la Ciudad de México desde el
 *     Auditorio Nacional 01.jpg", CC BY 4.0 (drone, night: the whole
 *     portico, both drums, the hall's curved clad wall);
 *     https://commons.wikimedia.org/wiki/File:Vista_a%C3%A9rea_de_la_Ciudad_de_M%C3%A9xico_desde_el_Auditorio_Nacional_01.jpg
 *   7 Wiper México, "Auditorio Nacional - panoramio.jpg", CC BY-SA 3.0, and
 *     ProtoplasmaKid, "Auditorio Nacional de México por la noche.jpg",
 *     CC BY-SA 4.0 (the west end; the front lit at night).
 *     https://commons.wikimedia.org/wiki/File:Auditorio_Nacional_-_panoramio.jpg
 *     https://commons.wikimedia.org/wiki/File:Auditorio_Nacional_de_M%C3%A9xico_por_la_noche.jpg
 * - Terrain: Mapterhorn has no z15 terrain here (tools/terrain.ts 404s);
 *   the site is on the flat floor of the basin at the foot of Chapultepec.
 * - Heights (review round 2), no published figures found: from a pinhole
 *   fit of photo 1 using its EXIF focal length (Canon EOS 7D, 12 mm),
 *   11 image points on the pylon, beam, columns and west end, 11.6 px rms:
 *   the beam is level (its top, its underside and the plaza edge share a
 *   vanishing point on the horizon; the apparent rake is the 12 mm lens),
 *   18 m clear above the 4 m plaza and 10 m deep, top 32 m; the east
 *   pylon is a deep end wall (the lit face in photo 1 is its east side)
 *   whose front edge leans forward and whose top climbs from the beam's
 *   top to about 50 m at its back, 21 m behind the front (the fit gives
 *   54 m). Columns 7.6 m across; the drum beside the pylon 18 m across and
 *   16 m high, about as tall as the columns. The camera the fit finds is
 *   about 46 m north of the front and 37 m east of the pylon, 0.5 m above
 *   the plaza; a perspective render from it (work folder,
 *   persp-photo1.png) lines up with the photo's pylon, beam ends, columns
 *   and drum.
 * - The hall, where photos 1 and 4 pull apart: from photo 1's camera the
 *   hall must stay below about 38 m at its front to stay hidden behind the
 *   beam, as it does in the photo, while photo 4 and the high photos 5-6
 *   show its grey clad wall standing over the beam from farther away. It
 *   is drawn at 40 m, clad from 28 m: a sliver shows over the middle of
 *   the beam from photo 1's camera, and the clad band stands clear above
 *   the beam from the north and from the air.
 * - Corrected in review round 1: the pylon is at the east end, not the
 *   west (photo 5, taken looking south across Reforma, has the sculpture
 *   and the water cascade at the west and the taller-looking column at the
 *   east).
 * - Doubts: whether the outline's north edge is the beam line or the foot
 *   of the steps (taken as the foot of the steps, with the beam's face 3 m
 *   back and four broad steps up to the plaza); the stage house and the
 *   back of the hall are not photographed and are a plain block; the
 *   hall's height and whether its back is as tall as its front; the
 *   steel-truss posts under the hall's corners, the water cascade and the
 *   beam's lettering are left out.
 *
 * Night: the lobby glazing is `window` and glows; the portico's concrete
 *   is floodlit (photo 7); the sawtooth glass roof is `glass`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { extrude, prism, rect, save, tube, type XY } from './dc-wwii-memorial'

const conc = new Part(), clad = new Part(), roof = new Part(), win = new Part(), sky = new Part()

const OUT: XY[] = [[-46.0, 64.6], [-54.7, 37.2], [-65.6, 30.9], [-61.0, 17.7], [-68.6, -6.0], [-78.1, -35.3], [-83.0, -50.4], [-52.9, -60.1], [-35.2, -65.8], [4.2, -78.4], [5.1, -75.4], [10.0, -59.7], [42.2, -69.6], [45.0, -61.2], [58.0, -20.9], [65.3, 1.5], [85.5, 64.5]]
const FAN: XY[] = [[-65.6, 30.9], [-61.0, 17.7], [-34.8, -58.9], [-4.4, -68.3], [58.0, -20.9], [70.8, -11.5], [65.3, 1.5], [60.0, 9.8], [52.0, 19.7], [43.5, 27.6], [33.5, 34.6], [23.7, 39.5], [11.4, 43.6], [0.9, 46.3], [-10.7, 47.6], [-21.9, 46.9], [-34.5, 44.7], [-45.6, 41.3], [-54.7, 37.2]]
const ARC = FAN.slice(6) // the hall's curved front, east to west

/** Keep the part of a polygon with y <= y0 (Sutherland-Hodgman). */
function clipBelow(poly: XY[], y0: number): XY[] {
  const out: XY[] = []
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    const ain = a[1] <= y0, bin = b[1] <= y0
    if (ain) out.push(a)
    if (ain !== bin) { const t = (y0 - a[1]) / (b[1] - a[1]); out.push([a[0] + (b[0] - a[0]) * t, y0]) }
  }
  return out
}
/** y of the hall's curved front at x (clamped to its ends). */
function arcY(x: number) {
  for (let i = 0; i < ARC.length - 1; i++) {
    const [x0, y0] = ARC[i], [x1, y1] = ARC[i + 1]
    if ((x <= x0 && x >= x1) || (x >= x0 && x <= x1)) return y0 + (y1 - y0) * (x - x0) / (x1 - x0)
  }
  return x > ARC[0][0] ? ARC[0][1] : ARC[ARC.length - 1][1]
}

const ZP = 4, ZH = 40, ZC = 28 // plaza; hall top; where the hall's cladding starts
const YF = 61.5, YB = 55.0 // the beam's front and back faces
// The frame (review round 2), from a pinhole fit of photo 1 with the
// camera's own focal length (EXIF: Canon EOS 7D at 12 mm): the beam is
// level (its top, its underside and the plaza edge run to one vanishing
// point on the horizon; the "rake" in the photo is the wide lens), 18 m
// clear above the plaza and 10 m deep, so its top is at 32 m. The east
// pylon is a deep end wall (its lit face in photo 1 is its east side),
// whose front edge leans forward and whose top climbs from the beam's top
// at the front to about 50 m at the back (the fit gives 54 m; held a
// little lower), carrying the lobby roof's slope.
const CLEAR = (_x: number) => 18
const ZPY = 50, YPB = 40 // the pylon's back-top corner
const BOT = (x: number) => ZP + CLEAR(x), TOP = (x: number) => BOT(x) + 10
/** A box whose underside and top follow functions of x (both may slope). */
function sbox(p: Part, x0: number, x1: number, y0: number, y1: number, bot: (x: number) => number, top: (x: number) => number) {
  const b = (x: number, y: number): V3 => [x, y, bot(x)], t = (x: number, y: number): V3 => [x, y, top(x)]
  p.quad(b(x0, y0), b(x1, y0), t(x1, y0), t(x0, y0))
  p.quad(b(x1, y1), b(x0, y1), t(x0, y1), t(x1, y1))
  p.quad(b(x0, y1), b(x0, y0), t(x0, y0), t(x0, y1))
  p.quad(b(x1, y0), b(x1, y1), t(x1, y1), t(x1, y0))
  p.quad(t(x0, y0), t(x1, y0), t(x1, y1), t(x0, y1))
  p.quad(b(x0, y1), b(x1, y1), b(x1, y0), b(x0, y0))
}

// ---- The raised plaza, and the broad steps down to Reforma. ----
extrude(conc, clipBelow(OUT, 52), 0, ZP)
for (let k = 0; k < 4; k++) {
  const y1 = 52 + (4 - k) * 3.1
  prism(conc, [[-49.5, 52], [82.5, 52], [82.5, y1], [-49.5, y1]], 0, k + 1, 0.05)
}

// ---- The back of house: everything behind the lobby, a plain block. ----
extrude(conc, clipBelow(OUT, 30), ZP, 18)

// ---- The hall: a tall drum, clad in grey glass and metal panels above the
// lobby roof, rising well above the portico (photos 4-6). ----
extrude(conc, FAN, ZP, ZC)
extrude(clad, FAN, ZC, ZH - 0.6, undefined, { caps: [false, false] })
// Two slim horizontal joints in the cladding, so the drum reads as panels.
for (const z of [31.5, 35.5]) extrude(roof, FAN.map(([x, y]) => [x, y] as XY), z, z + 0.5, undefined, { caps: [false, false] })
prism(roof, FAN, ZH - 0.6, ZH, 0.4)

// ---- The portico: the great frame. ----
// The beam, level along the whole front.
sbox(conc, -46, 78, YB, YF, BOT, TOP)
// The east pylon: a deep end wall, its front edge leaning forward, its top
// climbing back from the beam's top to the hall.
extrude(conc, [[57, 0], [YF + 0.5, TOP(80)], [YPB, ZPY], [YPB, 0]], 78, 84.5, (u, v, w) => [w, u, v])
// The west leg, from the plaza up to the beam's end.
sbox(conc, -46, -40, YB - 0.3, YF + 0.3, () => ZP, BOT)
// The two round columns.
for (const x of [-3, 44]) tube(conc, [[x, 58.2, ZP], [x, 58.2, BOT(x) + 0.2]], [3.8, 3.8], undefined, 16)
// The drum beside the pylon, about as tall as the columns (photo 1).
tube(conc, [[56, 50, ZP], [56, 50, ZP + 16]], [9, 9], undefined, 16)

// ---- The lobby: glazed front, sawtooth glass roof climbing to the hall. ----
{
  const x0 = -40, x1 = 78, yg = 46.5
  const n = 16, w = (x1 - x0) / n, ridge = 1.4
  for (let k = 0; k < n; k++) {
    const a = x0 + k * w, b = a + w, m = (a + b) / 2
    const back = Math.max(arcY(m), 30) + 1
    // From just under the beam's top at the front, climbing at the pylon's
    // slope towards the hall.
    const zf = TOP(m) - 1.5, zr = Math.min(ZH - 1.5, zf + (YB - back) * (ZPY - TOP(80)) / (YF - YPB))
    const z = (y: number) => zf + (YB - y) / (YB - back) * (zr - zf)
    // Two sloped glass faces from the beam's back to the hall wall.
    const f: V3[] = [[a, YB, z(YB)], [m, YB, z(YB) + ridge], [b, YB, z(YB)]]
    const r: V3[] = [[a, back, z(back)], [m, back, z(back) + ridge], [b, back, z(back)]]
    sky.quad(r[0], r[1], f[1], f[0])
    sky.quad(r[1], r[2], f[2], f[1])
    // The space frame under it, a flat soffit seen from the plaza.
    roof.quad([a, YB, z(YB) - 0.05], [b, YB, z(YB) - 0.05], [b, back, z(back) - 0.05], [a, back, z(back) - 0.05])
    // The lobby's glazed front, up to the roof.
    win.quad([b, yg, ZP], [a, yg, ZP], [a, yg, z(yg) - 0.1], [b, yg, z(yg) - 0.1])
  }
}

const lit = (p: V3, n: V3) => (p[1] > 44 && n[1] > 0.3 ? 0.85 : n[2] > 0.7 ? 0.15 : 0.35)
await save('mexico-city-auditorio-nacional', 'Auditorio Nacional', [
  { part: conc, material: { ...finish('granite-chip-concrete', 0xccb6a6), floodlight: lit } },
  // Grey glass and metal panels, as the drum reads in photos 4-6.
  { part: clad, material: finish('hall-cladding', 0xaeb9c0, 0.4) },
  { part: roof, material: finish('hall-roof', 0xc4c9cb) },
  { part: win, material: PALETTE.window },
  { part: sky, material: PALETTE.glass },
], { bearing: 352.1 }, 5000)
