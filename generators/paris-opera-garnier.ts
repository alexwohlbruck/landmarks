/**
 * Opéra Garnier (Palais Garnier) — procedural, CC0-1.0, no textures.
 * bun generators/paris-opera-garnier.ts
 *
 * Frame: y along the building's axis, from the main façade (south, on the
 * Place de l'Opéra) to the back; bearing 344° (the outline's long walls run
 * at 163.8–164.3°). Anchor: the area centroid of way/54667456, lng
 * 2.3317167, lat 48.8720167. Symmetrical about x = 0, as the building is.
 * Uses the kit exported by paris-sacre-coeur.ts.
 *
 * Covers and replaces: the outline way/54667456 and its building:parts
 * 822290986–822290993 and 822291000–822291002 (body, auditorium drum, dome,
 * crown, stage house, side rotundas and their domes, central spine). The
 * 4755954xx parts 35–80 m south are on the Place de l'Opéra, not the Opéra.
 *
 * Evidence
 * - OSM (measured): outline 101 × 148 m (cadastre); tagged heights used
 *   above the street G: body 26; central spine 35 (roof 4); auditorium drum
 *   31–44, copper dome 44–51, crown 50–58 (copper); stage house 31–58,
 *   gabled, roof 10; side rotundas 29 with copper domes 29–36.5; total 70
 *   (the top of Apollo's lyre on the stage-house gable).
 * - Published: Charles Garnier, 1861–1875; Apollo, Poetry and Music by Aimé
 *   Millet on the stage-house gable, the Pegasi by Eugène-Louis Lequesne on
 *   its back corners, the gilded groups Harmony and Poetry by Charles Gumery
 *   on the façade's end attics (fr.wikipedia "Opéra Garnier").
 * - Drawing: "Nouvel Opéra. Élévation de la façade latérale ouest et du
 *   pavillon de l'Empereur", Charles Garnier, public domain (BnF): the
 *   pavilion's 30 m front, cornice ~26 m, dome top ~36 m, its width 14.6 m.
 *   https://commons.wikimedia.org/wiki/File:Nouvel_Op%C3%A9ra._%C3%89l%C3%A9vation_de_la_fa%C3%A7ade_lat%C3%A9rale_ouest_et_du_pavillon_de_l%27Empereur_-_dessin_-_Charles_Garnier_-_btv1b52524263x.jpg
 * - Photos (Wikimedia Commons):
 *   · "Façade principale Palais Garnier Paris 4.jpg", Chabe01, CC BY-SA 4.0
 *     — the main front: seven arches, the loggia of paired columns, oculi,
 *     end avant-corps with segmental pediments, gilt cresting and groups.
 *     https://commons.wikimedia.org/wiki/File:Fa%C3%A7ade_principale_Palais_Garnier_Paris_4.jpg
 *   · "West facade of Palais Garnier, Paris 2017.jpg", Peter Menzel, CC BY-SA
 *     2.0 — the west side: the Pavillon de l'Empereur, the stage house's flat
 *     side with oculi, the dome and the statues on the stage house.
 *     https://commons.wikimedia.org/wiki/File:West_facade_of_Palais_Garnier,_Paris_2017.jpg
 *   · "Paris Palais Garnier @AEMohr.jpg", AEMohr58, CC BY-SA 4.0 — the
 *     front at night: floodlit stone, gilt glowing, the loggia and arcade lit.
 *     https://commons.wikimedia.org/wiki/File:Paris_Palais_Garnier_@AEMohr.jpg
 * - Estimated from the photos (façade 57 m wide = 1035 px): arcade to 8.4 m,
 *   loggia floor 9.8, the loggia 2.4 m deep, columns to 19, attic frieze
 *   with medallions at 22, the front's cornice 28.6 (the photo is foreshortened
 *   looking up; raised from 26 at review so the attic meets the drum's base
 *   seen over it), end avant-corps 1.2 m proud, attics to 30.8 with the gilt
 *   groups ~7.8 m tall to ~38.6; window bays ~6.2 m on the
 *   sides; the stage house's walls to 48 under its 10 m copper gable roof.
 * - Ground: Mapterhorn reads the side streets 3.7–3.9 m above the lowest
 *   point under the footprint (a 2 m dip inside the back half, building
 *   removal), the Place de l'Opéra 4.9–5.7, the back street 2.1–2.5. Heights
 *   are above G = 3.8; the walls run down to y = 0. terrain.ts check: ok.
 * - Simplified: polychrome marbles and busts are left out; the columns are
 *   pale trim; the statues are bold gilt or bronze masses; the stage-house
 *   roof and the foyer roof are drawn green copper, the side wings' roofs
 *   zinc; the Pavillon de l'Empereur's carriage ramps (ground) are not drawn.
 * - Doubts: the stage-house roof colour and the foyer roof's form are read
 *   from street photos only (no open aerial found); the back façades and
 *   the east pavilion are mirrored from the west, not photographed here.
 * - Night: stone and trim carry _FLOODLIGHT; the gilt is fully floodlit;
 *   the arcade, loggia and windows glow.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { qf, save } from './dc-white-house'
import { box, prism, revolve, domeProf, gable, arch, rose, drumArch, type Side, type XY } from './paris-sacre-coeur'

/** The streets beside the building, above y = 0 (see the header: Ground). */
const G = 3.8

const stone = new Part(), trim = new Part(), copper = new Part(), gilt = new Part(), win = new Part(), zinc = new Part()

/** Windows along a wall: one panel per bay, in the given rows; `arched` rows get round heads. */
function bays(side: Side, at: number, a0: number, a1: number, pitch: number, rows: [number, number, boolean][], w = 2.0) {
  const n = Math.max(1, Math.round((a1 - a0) / pitch)), step = (a1 - a0) / n
  for (let k = 0; k < n; k++) {
    const c = a0 + step * (k + 0.5)
    for (const [z0, z1, round] of rows) {
      if (round) arch(win, side, at, c, w, G + z0, G + z1)
      else pane(side, at, c, w, G + z0, G + z1)
    }
  }
}
/** A flat rectangular window panel (no head). */
function pane(side: Side, at: number, a: number, w: number, z0: number, z1: number) {
  const n: V3 = side === 'n' ? [0, 1, 0] : side === 's' ? [0, -1, 0] : side === 'e' ? [1, 0, 0] : [-1, 0, 0]
  const ns = side === 'n' || side === 's', off = at + (ns ? n[1] : n[0]) * 0.05
  const Q = (s: number, z: number): V3 => (ns ? [s, off, z] : [off, s, z])
  qf(win, Q(a - w / 2, z0), Q(a + w / 2, z0), Q(a + w / 2, z1), Q(a - w / 2, z1), n)
}
/** A cornice band round a box: projecting, bevelled lip. */
function cornice(x0: number, x1: number, y0: number, y1: number, z: number, h = 1.1, o = 0.6) {
  box(trim, x0 - o, x1 + o, y0 - o, y1 + o, z - h, z, trim, true)
}

// ---------------------------------------------------------------------------
// Plan, from OSM way/54667456 in the frame (y from the façade, south, to the
// back, north). Heights above the street, G.

// ---- Side wings and the back (822290986, h 26), with the main cornice.
box(stone, -33.5, 33.6, -62.0, 57.5, 0, G + 25)
box(stone, -27.7, 28.0, 57.5, 66.9, 0, G + 25)
prism(stone, [[-27.4, 65.5], [-9.0, 65.5], [-9.0, 76.5], [-19.9, 76.5]], 0, G + 25)
prism(stone, [[9.5, 65.5], [27.9, 65.5], [21.0, 76.2], [9.5, 76.2]], 0, G + 25)
cornice(-33.5, 33.6, -62.0, 57.5, G + 26)
// Zinc roofs over the side wings: a low slope up to the central spine.
for (const sx of [-1, 1]) {
  const xo = sx * 33.9, xi = sx * 29.4
  qf(zinc, [xo, -62.4, G + 26], [xo, 57.9, G + 26], [xi, 57.9, G + 29.5], [xi, -62.4, G + 29.5], [sx * 3.5, 0, 4.5])
}

// ---- The central spine (822291002, h 35, roof 4): the grand foyer and
// staircase in front of the auditorium, the backstage behind the stage.
box(stone, -29.4, 29.4, -62.0, 55.8, G + 25, G + 31, false)
cornice(-29.4, 29.4, -62.0, 55.8, G + 31, 0.9, 0.4)
{
  // The grand foyer's roof: a low copper hip.
  const r0: V3[] = [[-28.8, -61.4, G + 31], [28.8, -61.4, G + 31], [28.8, -26.0, G + 31], [-28.8, -26.0, G + 31]]
  const r1: V3[] = [[-25.0, -58.4, G + 34.0], [25.0, -58.4, G + 34.0], [25.0, -26.0, G + 34.0], [-25.0, -26.0, G + 34.0]]
  zinc.loft([r0, r1])
  copper.cap(r1, true)
}
box(zinc, -28.8, 28.8, 42.7, 55.2, G + 31, G + 33.5)

// ---- The main façade block (y −71.3 to −62): ground-floor arcade of seven
// arches, the deep loggia of eight pairs of monolithic columns before a dark
// recessed wall, the attic frieze with the composers' medallions, and the
// end avant-corps, projecting, with their segmental pediments and the
// gilded groups on their attics.
const YF = -71.3, YL = YF + 2.4 // the loggia's back wall
const bayW = 40.4 / 7
const TOP = G + 28.6 // the front's main cornice (attic top), about the dome's drum base seen over it
// Body behind the loggia, full height; the arcade storey and the attic in front of it.
box(stone, -28.0, 28.0, YL, -62.0, 0, TOP - 1.1, false)
box(stone, -20.2, 20.2, YF, YL, 0, G + 9.0, false)
box(stone, -20.2, 20.2, YF, YL, G + 19.0, TOP - 1.1, false, true)
cornice(-28.0, 28.0, YF, -62.0, TOP)
box(trim, -27.6, 27.6, YF + 0.4, -62.4, TOP, TOP + 0.7) // the balustrade line
box(gilt, -27.0, 27.0, YF + 0.2, YF + 0.8, TOP + 0.7, TOP + 1.4) // the gilt cresting
// Arcade: seven round arches (window: dark by day, lit at night).
for (let k = 0; k < 7; k++) arch(win, 's', YF, -20.2 + bayW * (k + 0.5), 3.8, G + 1.4, G + 8.4)
// The loggia floor (balustraded terrace) and its dark back wall.
box(trim, -20.2, 20.2, YF - 0.4, YL, G + 9.0, G + 9.8, trim, true)
for (let k = 0; k < 7; k++) pane('s', YL, -20.2 + bayW * (k + 0.5), bayW - 0.5, G + 9.8, G + 18.6)
// Eight pairs of big columns standing in the loggia's front plane.
for (let k = 0; k <= 7; k++) {
  const x = -20.2 + bayW * k + (k === 0 ? 0.9 : k === 7 ? -0.9 : 0)
  for (const d of [-0.8, 0.8]) revolve(trim, x + d, YF + 0.7, [[0.68, G + 9.8], [0.6, G + 19.0]], 10, false, true)
}
box(trim, -20.4, 20.4, YF - 0.3, YL, G + 19.0, G + 20.2, trim, true) // entablature
// The attic frieze: a medallion (oculus with a bust) over each bay.
for (let k = 0; k < 7; k++) rose(win, 's', YF, -20.2 + bayW * (k + 0.5), G + 22.4, 1.0)
// End avant-corps: 1.2 m proud, a big arch, a tall window between paired
// columns, the segmental pediment over the bust medallion, the attic and the
// gilded group (Gumery's Harmony west, Poetry east), ~7 m tall.
for (const sx of [-1, 1]) {
  const x0 = sx < 0 ? -28.0 : 20.2, x1 = sx < 0 ? -20.2 : 28.0, xc = (x0 + x1) / 2, yf = YF - 1.2
  box(stone, x0, x1, yf, YF, 0, TOP - 1.1, false)
  arch(win, 's', yf, xc, 4.2, G + 1.4, G + 9.2)
  pane('s', yf, xc, 2.6, G + 10.2, G + 17.4)
  for (const x of [x0 + 0.9, x1 - 0.9]) revolve(trim, x, yf - 0.7, [[0.68, G + 9.8], [0.6, G + 19.0]], 10, false, true)
  box(trim, x0, x1, yf - 1.5, yf, G + 19.0, G + 20.2, trim, true)
  rose(win, 's', yf, xc, G + 22.0, 1.1)
  // Segmental pediment: a solid arc-topped slab with a bold trim rim.
  const r = 5.6, zb = G + 20.6, cz = zb + 2.4 - r, t0 = Math.asin(Math.min(1, (x1 - x0 - 0.6) / 2 / r))
  const seg = 8, yp0 = yf - 1.4, yp1 = yf + 0.4
  for (let k = 0; k < seg; k++) {
    const a0 = Math.PI / 2 - t0 + (2 * t0 * k) / seg, a1 = Math.PI / 2 - t0 + (2 * t0 * (k + 1)) / seg
    const p = (a: number, rr: number, y: number): V3 => [xc + rr * Math.cos(a), y, cz + rr * Math.sin(a)]
    // Rim: front face, top face.
    qf(trim, p(a0, r - 0.8, yp0), p(a1, r - 0.8, yp0), p(a1, r, yp0), p(a0, r, yp0), [0, -1, 0])
    qf(trim, p(a0, r, yp0), p(a1, r, yp0), p(a1, r, yp1), p(a0, r, yp1), [Math.cos((a0 + a1) / 2), 0, Math.sin((a0 + a1) / 2)])
    // Tympanum under the rim.
    qf(stone, [p(a0, r - 0.8, 0)[0], yp0 + 0.3, zb], [p(a1, r - 0.8, 0)[0], yp0 + 0.3, zb], p(a1, r - 0.8, yp0 + 0.3), p(a0, r - 0.8, yp0 + 0.3), [0, -1, 0])
  }
  // Attic over the pavilion and the gilded group on it.
  box(stone, x0 + 0.4, x1 - 0.4, yf + 0.2, YF + 6.0, TOP, TOP + 2.2, trim)
  const zg = TOP + 2.2
  box(gilt, xc - 2.0, xc + 2.0, yf + 1.4, yf + 5.4, zg, zg + 1.8, gilt) // the figures' base and the seated muses
  box(gilt, xc - 1.3, xc + 1.3, yf + 2.0, yf + 4.6, zg + 1.8, zg + 6.0, gilt) // the standing winged figure
  box(gilt, xc - 2.9, xc + 2.9, yf + 2.9, yf + 3.8, zg + 4.0, zg + 7.4, gilt) // her spread wings
  box(gilt, xc - 0.6, xc + 0.6, yf + 2.9, yf + 3.7, zg + 6.0, zg + 7.8, gilt) // raised arms and head
}

// ---- Side pavilions: the Pavillon de l'Empereur (west) and the Pavillon des
// Abonnés (east), each a block with a rotunda in front (822290990/991, 29)
// and a copper dome (822290988/989, 29–36.5).
for (const sx of [-1, 1]) {
  const cx = sx * 42.4, cy = -3.3
  const xa = sx < 0 ? -44.0 : 33.5, xb = sx < 0 ? -33.5 : 44.0
  box(stone, xa, xb, -18.6, 12.3, 0, G + 25, false)
  cornice(xa, xb, -18.6, 12.3, G + 26)
  box(zinc, xa + 0.3, xb - 0.3, -18.3, 12.0, G + 26, G + 27.0)
  revolve(stone, cx, cy, [[8.5, 0], [8.5, G + 25.0], [9.0, G + 25.0], [9.0, G + 26.2], [8.3, G + 26.2], [8.3, G + 29.0], [8.6, G + 29.0], [8.6, G + 29.6]], 20, false, true)
  // Windows round the rotunda's outer half: tall arched lights and the attic's oculi.
  for (let k = -2; k <= 2; k++) {
    const t = (sx < 0 ? Math.PI : 0) + k * 0.5
    drumArch(win, cx, cy, 8.5, t, 2.2, G + 11.0, G + 20.0)
    drumArch(win, cx, cy, 8.5, t, 2.6, G + 2.0, G + 8.0)
  }
  revolve(copper, cx, cy, domeProf(7.6, G + 29.6, 6.4, 1.2, 5, 1.0), 16)
  revolve(gilt, cx, cy, [[1.2, G + 36.0], [1.2, G + 36.8], [0.5, G + 37.6], [0, G + 38.6]], 8)
  // Side façade windows either side of the pavilion: three storeys of bays.
  const side: Side = sx < 0 ? 'w' : 'e', at = sx * (sx < 0 ? 33.5 : 33.6)
  for (const [a0, a1] of [[-62.0, -18.6], [12.3, 57.5]]) bays(side, at, a0, a1, 6.2, [[2.0, 8.4, true], [11.0, 18.0, false], [19.6, 22.6, false]], 2.2)
}
// The back front and the façade-block's side returns.
bays('n', 57.5, -27.7, 28.0, 6.2, [[11.0, 18.0, false], [19.6, 22.6, false]], 2.2)
bays('n', 76.5, -19.9, -9.0, 5.4, [[2.0, 8.4, true], [11.0, 18.0, false]], 2.0)
bays('n', 76.2, 9.5, 21.0, 5.4, [[2.0, 8.4, true], [11.0, 18.0, false]], 2.0)

// ---- The auditorium: drum (822290987, 31–44) ringed with oculi, the
// flattened green copper dome (822291001, 44–51) with gilt ribs, and the
// gilt crown on its top (822291000, 822290993, to 58).
const DY = -8.3
revolve(stone, 0, DY, [[18.4, G + 25], [18.4, G + 42.6], [18.9, G + 42.6], [18.9, G + 44.0]], 28, false, true)
for (let k = 0; k < 16; k++) drumArch(win, 0, DY, 18.4, (k * Math.PI) / 8 + Math.PI / 16, 1.6, G + 36.2, G + 39.8)
const domeP = domeProf(18.0, G + 44.0, 7.6, 4.6, 6, 1.0)
revolve(copper, 0, DY, domeP, 28)
// Eight gilt ribs following the dome's curve.
for (let k = 0; k < 8; k++) {
  const t = (k * Math.PI) / 4, c = Math.cos(t), s = Math.sin(t), w = 0.35
  for (let i = 0; i < domeP.length - 1; i++) {
    const [r0, z0] = domeP[i], [r1, z1] = domeP[i + 1]
    const P = (r: number, z: number, u: number): V3 => [(r + 0.12) * c - u * s, DY + (r + 0.12) * s + u * c, z + 0.08]
    qf(gilt, P(r0, z0, -w), P(r0, z0, w), P(r1, z1, w), P(r1, z1, -w), [c * (z1 - z0), s * (z1 - z0), r0 - r1])
  }
}
revolve(gilt, 0, DY, [[4.8, domeP[domeP.length - 1][1]], [4.8, G + 52.4], [3.6, G + 54.6], [1.8, G + 55.4], [1.8, G + 56.6], [0.8, G + 57.4], [0, G + 58.0]], 12, false, true)

// ---- The stage house (822290992, 31–58, gabled, roof 10): a tall stone
// block with its copper roof ridged along the axis, the gables front and
// back; Apollo with his lyre on the front apex, the Pegasi on the back.
box(stone, -29.0, 29.0, 4.6, 42.7, G + 31, G + 47.2, false)
cornice(-29.0, 29.0, 4.6, 42.7, G + 48.0, 1.0, 0.5)
gable(copper, stone, -29.3, 29.3, 4.3, 43.0, G + 48.0, G + 58.0, true)
for (const [side, at] of [['e', 29.0], ['w', -29.0]] as [Side, number][]) {
  for (let k = 0; k < 7; k++) rose(win, side, at, 7.6 + k * 5.0, G + 44.6, 0.9)
  for (let k = 0; k < 7; k++) pane(side, at, 7.6 + k * 5.0, 1.0, G + 34.0, G + 41.0)
}
box(stone, -1.3, 1.3, 3.6, 6.2, G + 57.0, G + 60.0, stone)
box(copper, -0.8, 0.8, 4.2, 5.6, G + 60.0, G + 66.5, copper) // Apollo
box(copper, -2.2, 2.2, 4.6, 5.2, G + 62.0, G + 64.5, copper) // Poetry and Music either side
box(gilt, -0.9, 0.9, 4.6, 5.2, G + 66.5, G + 70.0, gilt) // the lyre raised overhead
for (const sx of [-1, 1]) {
  box(stone, sx * 28.0 - 1.0, sx * 28.0 + 1.0, 41.0, 43.0, G + 48.0, G + 50.0, stone)
  box(copper, sx * 28.0 - 0.5, sx * 28.0 + 0.5, 40.6, 43.4, G + 50.0, G + 52.0, copper) // Pegasus
  box(copper, sx * 28.0 - 1.4, sx * 28.0 + 1.4, 41.8, 42.4, G + 51.2, G + 53.4, copper) // its wings
}

const lit = (_p: V3, n: V3) => (n[2] > 0.8 ? 0.25 : 0.9)
console.log({ stone: stone.triangles, trim: trim.triangles, copper: copper.triangles, gilt: gilt.triangles, win: win.triangles, zinc: zinc.triangles })
await save('paris-opera-garnier', 'Opéra Garnier', [
  { part: stone, material: { ...finish('garnier-stone', 0xe8dcc1), floodlight: lit } },
  { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
  { part: copper, material: { ...PALETTE.patina, floodlight: () => 0.35 } },
  { part: gilt, material: { ...finish('garnier-gilt', 0xd6b45a, 0.5), floodlight: () => 1 } },
  { part: win, material: PALETTE.window },
  { part: zinc, material: PALETTE.roof },
], { bearing: 344, osm: 'way/54667456', footprint: [100.7, 147.8], height: G + 70 }, 6500)
