/**
 * National Monument on the Dam (Nationaal Monument op de Dam), Amsterdam —
 * procedural, CC0-1.0, no textures.
 * bun generators/amsterdam-national-monument.ts
 *
 * The 1956 war memorial by J.J.P. Oud (architect) and John Rädecker
 * (sculpture): a 22 m white travertine pylon with relief figures, standing
 * on circular steps with a curved wall behind it and two lions in front.
 *
 * Map frame: x = model east, y = model north, z up, metres. The front with
 * the reliefs faces −x, west across the Dam to the palace; the curved wall
 * stands behind it on the east. Placed at bearing 1.5° (square to the
 * palace front). Anchor: the centre of the OSM outline way/168680619, a
 * circle of radius 18.4 m (the stepped platform), which is also the
 * pylon's centre in OSM (1320477257–261).
 *
 * Evidence
 * - OSM way/168680619 (historic=monument, the 36.8 m stepped circle), the
 *   pylon and its base 1320477257–261 (height 22 m, tapering "dome" roof
 *   from 5.76 m), the curved wall way/940729263 (radius about 8 m, east of
 *   the pylon; OSM maps only part of it).
 * - Published: 22 m pylon of travertine, unveiled 4 May 1956; reliefs and
 *   statues by Rädecker (OSM tags, nl.wikipedia "Nationaal Monument op de
 *   Dam"); the wall holds urns with soil from the provinces and the former
 *   Dutch East Indies.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   - Danbu14, "Nationaal Monument Dam Amsterdam.jpg", CC BY-SA 3.0 — the
 *     front from the west: pylon, relief block, ledge statues, wall, steps.
 *     https://commons.wikimedia.org/wiki/File:Nationaal_Monument_Dam_Amsterdam.jpg
 *   - Steven Lek, "Nationaal Monument Dam Amsterdam 2018.jpg", CC BY-SA 4.0.
 *     https://commons.wikimedia.org/wiki/File:Nationaal_Monument_Dam_Amsterdam_2018.jpg
 *   - Txllxt TxllxT, "Amsterdam - Dam - View on Nationaal Monument 1956 John
 *     Rädecker (Sculptor).jpg", CC BY-SA 4.0 — the pylon from the side.
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_-_Dam_-_View_on_Nationaal_Monument_1956_John_R%C3%A4decker_(Sculptor).jpg
 *   - Radosław Botev, "Nationaal Monument (Amsterdam) 2005.jpg", CC BY 3.0 PL
 *     — from a distance, with the steps. https://commons.wikimedia.org/wiki/File:Nationaal_Monument_(Amsterdam)_2005.jpg
 *   - Rob Croes / Anefo, "Jonge toeristen nog in herfst in Amsterdam,
 *     overzicht Nationaal Monument Dam, Bestanddeelnr 924-9996.jpg", CC0 —
 *     from above: the concentric steps, the wall, a lion on its round
 *     pedestal. https://commons.wikimedia.org/wiki/File:Jonge_toeristen_nog_in_herfst_in_Amsterdam,_overzicht_Nationaal_Monument_Dam,_Bestanddeelnr_924-9996.jpg
 *
 * Estimated (Danbu14's front scaled to the published 22 m): the pylon 3.9 m
 * across at the top of the relief block tapering to 2.2 m under its round
 * head; the relief block 4.6 m wide and 7.6 m high; the ledge with the two
 * standing men at 3.5 m, 7.5 m wide; the front figure group at 9.6–13.6 m;
 * the wall 3.6 m high and 1.8 m thick on an 8.3 m radius; four steps 0.3 m
 * each (Anefo). The lions' places and pedestals from the Anefo view.
 *
 * Doubts: the sculpture is drawn as bold simple figures, not the real
 * groups; the pylon's section is drawn as a slightly flattened oval; the
 * wall's extent (about 160° round the back) is from the photos, since OSM
 * maps only part of it.
 *
 * Night: floodlit; the travertine carries a floodlight wash.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { finishModel, prism, circle, type XY } from './nyc-570-lexington'
import { block, figure } from './nyc-city-hall'

const trav = new Part(), relief = new Part(), steps = new Part()
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }

// ---------------------------------------------------------------- steps
// Four concentric rings of steps up to the platform (OSM circle r 18.4).
const STEP = 0.3
const radii = [18.4, 16.4, 14.4, 12.4]
radii.forEach((r, k) => {
  const ring = circle(0, 0, r, 40)
  prism({ wall: steps, win: null, roof: steps, ring, z0: 0, z1: STEP * (k + 1), facade: null, bevel: 0.05 })
})
const P = STEP * radii.length // platform

// ---------------------------------------------------------------- the curved wall
{
  const R0 = 7.4, R1 = 9.2, H = P + 3.6, n = 16, a0 = -80, a1 = 80
  const pt = (r: number, a: number, z: number): V3 => [r * Math.cos((a * Math.PI) / 180), r * Math.sin((a * Math.PI) / 180), z]
  for (let i = 0; i < n; i++) {
    const a = a0 + ((a1 - a0) * i) / n, b = a0 + ((a1 - a0) * (i + 1)) / n
    const no = (x: number): V3 => [Math.cos((x * Math.PI) / 180), Math.sin((x * Math.PI) / 180), 0]
    const ni = (x: number): V3 => [-Math.cos((x * Math.PI) / 180), -Math.sin((x * Math.PI) / 180), 0]
    // outer face
    trav.tri(pt(R1, a, P), pt(R1, b, P), pt(R1, b, H), undefined, undefined, undefined, [no(a), no(b), no(b)])
    trav.tri(pt(R1, a, P), pt(R1, b, H), pt(R1, a, H), undefined, undefined, undefined, [no(a), no(b), no(a)])
    // inner face
    trav.tri(pt(R0, b, P), pt(R0, a, P), pt(R0, a, H), undefined, undefined, undefined, [ni(b), ni(a), ni(a)])
    trav.tri(pt(R0, b, P), pt(R0, a, H), pt(R0, b, H), undefined, undefined, undefined, [ni(b), ni(a), ni(b)])
    // coping
    trav.quad(pt(R0, a, H), pt(R1, a, H), pt(R1, b, H), pt(R0, b, H))
  }
  // flat end faces
  for (const [a, s] of [[a0, -1], [a1, 1]] as [number, number][]) {
    const q = [pt(R0, a, P), pt(R1, a, P), pt(R1, a, H), pt(R0, a, H)]
    if (s > 0) trav.quad(q[0], q[1], q[2], q[3]); else trav.quad(q[1], q[0], q[3], q[2])
  }
}

// ---------------------------------------------------------------- the relief block and ledge
const BX0 = -2.6, BX1 = 2.1, BY = 2.3, BH = P + 7.6
prism({ wall: trav, win: null, roof: trav, ring: [[BX0, -BY], [BX1, -BY], [BX1, BY], [BX0, BY]], z0: P, z1: BH, facade: null, bevel: 0.25 })
// a low plinth course
prism({ wall: trav, win: null, roof: trav, ring: [[BX0 - 0.3, -BY - 0.3], [BX1 + 0.3, -BY - 0.3], [BX1 + 0.3, BY + 0.3], [BX0 - 0.3, BY + 0.3]], z0: P, z1: P + 0.6, facade: null, bevel: 0.1 })
// the ledge across the front, carrying the two standing men at its ends
const LZ = P + 3.4
prism({ wall: trav, win: null, roof: trav, ring: [[BX0 - 1.1, -3.8], [BX0 + 1.6, -3.8], [BX0 + 1.6, 3.8], [BX0 - 1.1, 3.8]], z0: LZ, z1: LZ + 0.55, facade: null, bevel: 0.12 })
for (const sy of [1, -1]) {
  block(trav, BX0 - 0.6, sy * 3.1 - 0.5, BX0 + 0.6, sy * 3.1 + 0.5, LZ - 0.6, LZ)
  figure(relief, BX0 - 0.1, sy * 3.15, LZ + 0.55, 2.8, { raise: 0 })
}
// The relief on the block's front: the chained man between two groups of
// figures, drawn as three bold half-figures set into the face.
for (const [y, h] of [[0, 3.4], [-1.25, 2.9], [1.25, 2.9]] as [number, number][]) figure(relief, BX0 - 0.15, y, LZ + 0.6, h, { raise: y === 0 ? 1 : 0 })
block(relief, BX0 - 0.35, -1.9, BX0 + 0.05, 1.9, LZ + 0.55, LZ + 1.1)
block(relief, BX0 - 0.12, -2.0, BX0 + 0.05, 2.0, LZ + 0.55, BH - 0.5)

// ---------------------------------------------------------------- the pylon
// An oval shaft tapering from 4.2 m to 1.6 m with a round head (22 m).
{
  const TOP = 22.0, Z0 = P, ZH = 20.9
  const prof: [number, number][] = [[Z0, 2.05], [BH, 1.92], [14, 1.6], [18, 1.32], [ZH, 1.08]]
  const head = 6
  for (let k = 1; k <= head; k++) { const t = (k / head) * (Math.PI / 2); prof.push([ZH + (TOP - ZH) * Math.sin(t), Math.max(0.02, 1.08 * Math.cos(t))]) }
  const n = 16, ex = 0.82 // depth (x) over width (y)
  const rings: V3[][] = prof.map(([z, r]) => circle(0.2, 0, 1, n).map(([x, y]) => [0.2 + (x - 0.2) * r * ex, y * r, z] as V3))
  for (let k = 0; k < rings.length - 1; k++) for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const nm = (p: V3, kk: number): V3 => { const r = prof[kk][1]; const dz = kk < 4 ? 0.12 : (p[2] - ZH) / Math.max(0.3, TOP - ZH) * 2; return unit([(p[0] - 0.2) / (ex * ex * Math.max(r, 0.05)), p[1] / Math.max(r, 0.05), dz]) }
    const a = rings[k][i], b = rings[k][j], c = rings[k + 1][j], d = rings[k + 1][i]
    trav.tri(a, b, c, undefined, undefined, undefined, [nm(a, k), nm(b, k), nm(c, k + 1)])
    trav.tri(a, c, d, undefined, undefined, undefined, [nm(a, k), nm(c, k + 1), nm(d, k + 1)])
  }
  // The figure group on the front (a woman and child, doves) on a small bracket.
  const fx = -1.55
  block(trav, fx - 0.5, -0.8, fx + 0.6, 0.8, 9.1, 9.7)
  figure(relief, fx + 0.05, 0, 9.7, 3.9, { raise: 1 })
  figure(relief, fx + 0.15, 0.55, 9.7, 2.2, { raise: 0 })
}

// ---------------------------------------------------------------- the lions
// Two seated lions on round pedestals at the front of the steps.
function lion(cx: number, cy: number, face: number) {
  const ped = circle(cx, cy, 1.35, 14)
  prism({ wall: trav, win: null, roof: trav, ring: ped, z0: 0, z1: 1.4, facade: null, bevel: 0.1 })
  const c = Math.cos(face), s = Math.sin(face)
  const at = (u: number, v: number): XY => [cx + u * c - v * s, cy + u * s + v * c]
  const box = (u0: number, v0: number, u1: number, v1: number, z0: number, z1: number) => {
    const r: XY[] = [at(u0, v0), at(u1, v0), at(u1, v1), at(u0, v1)]
    prism({ wall: relief, win: null, roof: relief, ring: r, z0, z1, facade: null, bevel: 0.12 })
  }
  box(-0.9, -0.45, 0.2, 0.45, 1.4, 2.2) // haunches
  box(-0.2, -0.38, 0.55, 0.38, 1.4, 3.0) // chest
  box(0.35, -0.42, 0.75, -0.18, 1.4, 2.0); box(0.35, 0.18, 0.75, 0.42, 1.4, 2.0) // forelegs
  box(0.0, -0.5, 0.75, 0.5, 2.8, 3.5) // mane and head
  box(0.6, -0.25, 0.95, 0.25, 2.85, 3.3) // muzzle
}
for (const sy of [1, -1]) {
  const a = Math.PI + sy * 0.62
  lion(15.6 * Math.cos(a), 15.6 * Math.sin(a), a)
}

// ---------------------------------------------------------------- write
const lit = (p: V3, n: V3): number => (n[2] > 0.7 ? 0.35 : p[2] > 1.3 ? 1 : 0.5)
finishModel('National Monument', 'amsterdam-national-monument', [
  { part: trav, material: { ...finish('monument-travertine', 0xf0ebdf), floodlight: lit } },
  { part: relief, material: { ...finish('monument-relief', 0xd8d1c2), floodlight: lit } },
  { part: steps, material: finish('monument-steps', 0xb8b2a8) },
], { bearing: 1.5, osm: 'way/168680619', height: 22 }, 5000)
