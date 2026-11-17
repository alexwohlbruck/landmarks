/**
 * Monumento a la Revolución, Plaza de la República, Mexico City (Carlos
 * Obregón Santacilia, 1933-38, on the steel frame of the unfinished
 * Palacio Legislativo's dome): procedural, CC0-1.0.
 * bun generators/mexico-city-monumento-a-la-revolucion.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 9.5 (the
 * square's sides in OSM run 9.5 degrees east of north). Origin: the area
 * centroid of OSM way/158032450 (lng -99.1546220, lat 19.4361714). The
 * monument is symmetric about both axes and is modelled that way.
 *
 * Form: a 35.6 m square of grey-brown stone. Four massive corner piers,
 * each with a black-stone re-entrant notch at its outer corner and a black
 * stone plinth, carry four great semicircular arches (real openings: the
 * monument is open right through, with a flat ceiling over the crossing
 * at the arches' crown). Over the arches a cross-shaped attic; its four
 * corners are cut down and capped in black stone, and each carries one of
 * the four sculpture groups (Oliverio Martínez) as bold stacked blocks.
 * On the attic: the mirador, a round colonnade of tall slits (four bays
 * of five openings between four diagonal pylons with sloping Art Deco
 * tops), a stone ring, then the ribbed copper dome with the lantern
 * gallery, a glazed lantern and a small copper cap.
 *
 * Sources
 * - OSM (ODbL): outline way/158032450 (height=67) and its 23 parts. Plan
 *   measured from them in this frame: 35.6 x 35.6 m; corner piers
 *   8.2 m square (way/1420337637-40, the four named for the men buried in
 *   them); pylons on the attic about 6 m square on the diagonals
 *   (way/1420337633-36); dome part 26 m across (way/1084964141), lantern
 *   10 m (way/1084964142). OSM part heights (piers 41, attic 27-41, stage
 *   41-53, dome 52-64, lantern to 67) are all about 6.5 m higher than the
 *   photos give, consistently; not used.
 * - Published: total height 67 m and arches carrying the dome "a una altura
 *   de 26 m", 8 m high slit openings in the mirador, 10 m sculpture groups
 *   (es.wikipedia, "Monumento a la Revolución (México)").
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 Carlos Valenzuela, "Monumento a la revolución2017.jpg", CC BY-SA 4.0
 *     (corner view: piers, black notches, corner groups, pylons, dome);
 *     https://commons.wikimedia.org/wiki/File:Monumento_a_la_revoluci%C3%B3n2017.jpg
 *   2 Haakon S. Krohn, "Monumento a la Revolución 1.jpg", CC BY-SA 3.0
 *     (square on, level, from the plaza: the main calibration photo);
 *     https://commons.wikimedia.org/wiki/File:Monumento_a_la_Revoluci%C3%B3n_1.jpg
 *   3 ismael villafranco, "Monumento a la Revolución Mexico.jpg", CC BY 2.0
 *     (square on, second calibration);
 *     https://commons.wikimedia.org/wiki/File:Monumento_a_la_Revoluci%C3%B3n_Mexico.jpg
 *   4 Nviascan, "Monumento a la Revolución 2012.JPG", CC BY-SA 3.0 (corner
 *     group and colonnade from below);
 *     https://commons.wikimedia.org/wiki/File:Monumento_a_la_Revoluci%C3%B3n_2012.JPG
 *   5 Luis Alvaz, "Monumento a la Revolución CDMX 1.jpg", CC BY-SA 4.0
 *     (telephoto of the attic, colonnade, pylons and lantern);
 *     https://commons.wikimedia.org/wiki/File:Monumento_a_la_Revoluci%C3%B3n_CDMX_1.jpg
 * - Heights (estimated, from photos 2 and 3 with perspective solved from
 *   the near and far arch openings, camera about 78 m off, calibrated on
 *   the published 26 m arch crown and OSM's 35.6 m width): arch span 19.5 m
 *   (springing 16.25, crown 26.0); plinth 2.4; corner cut-down 28.5 with a
 *   black cap to 29.3; sculpture groups 29.3-41.6 (the published 10 m plus their plinth and heads); pylons stepping 38.6, 42.0, 45.2; attic 34.6; colonnade 35.4-43.4 (the published
 *   8 m slits); stone ring to 45.6; dome r 10.3 springing at 45.6; lantern
 *   gallery 55.0; lantern to 57.4; cap and finial to 60.3. The photos give
 *   59-62 m for the top above the plaza, not the published 67 m, and OSM's
 *   parts are offset by the same ~6.5 m throughout, so the 67 m most
 *   likely counts from the sunken museum level below the plaza. The model
 *   follows the photos (60.3 m above the plaza).
 * - Terrain: Mapterhorn has no z15 terrain here; the plaza is on the flat
 *   lake-bed basin (~2,240 m). The plaza itself is not modelled.
 * - Look-only: none.
 * - Simplified: the sculpture groups are stacked blocks with heads; the
 *   groups are drawn in a greyer stone, as the weathered figures read in the photos; the lantern railing is one ring; the stone coursing and the glass lift
 *   inside the arches are left out. The inner dome is not modelled: under
 *   the crossing there is a flat ceiling at the arches' crown.
 * - Night: the stone is floodlit (the monument is lit, often in colours),
 *   the copper dome and lantern carry full floodlight, and the mirador's
 *   interior and the lantern glazing are `window` so they glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { qf, tf } from './dc-white-house'
import { slab, lathe, save, cap, walls, type XY } from './dc-nmaahc'

const sculpt = new Part(), stone = new Part(), black = new Part(), copper = new Part(), win = new Part(), metal = new Part()

const H = 17.8 // half side
const R = 9.75 // arch radius (span 19.5)
const SPRING = 16.25 // springing; crown at 26.0
const CROWN = SPRING + R
const PLINTH = 2.4
const CUT = 28.5 // corner cut-down
const CUTCAP = 29.3
const ATTIC = 34.0
const ATTIC_TOP = 34.6
const NOTCH = 1.5 // black re-entrant corner notch
const CORNER = 12.3 // corner zones |x|,|y| > CORNER are cut down
const SEG = 12 // segments per semicircle

// Symmetry helpers: rotate a point by k quarter turns about the centre.
const rot = (p: V3, k: number): V3 => {
  let [x, y, z] = p
  for (let i = 0; i < ((k % 4) + 4) % 4; i++) [x, y] = [-y, x]
  return [x, y, z]
}
const rotXY = (p: XY, k: number): XY => { const r = rot([p[0], p[1], 0], k); return [r[0], r[1]] }

// ---------------------------------------------------------------------------
// Piers. The SW pier is drawn, then turned for the others.
const pierLow: XY[] = [[-H + NOTCH, -H], [-R, -H], [-R, -R], [-H, -R], [-H, -H + NOTCH], [-H + NOTCH, -H + NOTCH]]
const pierHigh: XY[] = [[-CORNER, -H], [-R, -H], [-R, -R], [-H, -R], [-H, -CORNER], [-CORNER, -CORNER]]
const cornerSq: XY[] = [[-H + NOTCH, -H], [-CORNER, -H], [-CORNER, -CORNER], [-H, -CORNER], [-H, -H + NOTCH], [-H + NOTCH, -H + NOTCH]]
const grow = (r: XY[], d: number): XY[] => {
  // offset an axis-aligned orthogonal ring by d outward (centre of ring = pier centre)
  const cx = r.reduce((s, p) => s + p[0], 0) / r.length, cy = r.reduce((s, p) => s + p[1], 0) / r.length
  return r.map(([x, y]) => [x + Math.sign(x - cx) * d, y + Math.sign(y - cy) * d] as XY)
}

for (let k = 0; k < 4; k++) {
  const T = (r: XY[]) => r.map((p) => rotXY(p, k))
  // black plinth, a little proud
  slab(black, T(grow(pierLow, 0.15)), 0, PLINTH, 0.12)
  slab(stone, T(pierLow), PLINTH, CUT, 0, true)
  slab(stone, T(pierHigh), CUT, ATTIC, 0, false)
  slab(black, T(cornerSq), CUT, CUTCAP, 0.3)
  // black column in the notch, recessed 0.4 m from both faces
  const c = -H + 0.4, d = -H + NOTCH + 0.05
  slab(black, T([[c, c], [d, c], [d, d], [c, d]]), PLINTH, CUT, 0, false)
}

// ---------------------------------------------------------------------------
// The four arch bridges, their soffits, and a raised archivolt band.
const arc = (r: number, n = SEG): [number, number][] =>
  Array.from({ length: n + 1 }, (_, i) => { const t = Math.PI - (Math.PI * i) / n; return [r * Math.cos(t), SPRING + r * Math.sin(t)] })

for (let k = 0; k < 4; k++) {
  const P = (x: number, y: number, z: number) => rot([x, y, z], k)
  const a = arc(R)
  // outer face (y = -H, facing -y) and inner face (y = -R, facing +y), strips arc -> attic top
  for (const [y, n] of [[-H, [0, -1, 0]], [-R, [0, 1, 0]]] as [number, V3][]) {
    const nn = rot(n, k)
    for (let i = 0; i < a.length - 1; i++) {
      const [x0, z0] = a[i], [x1, z1] = a[i + 1]
      const top = y === -H ? ATTIC : CROWN + 0.01
      if (y === -R && Math.max(z0, z1) >= top) continue
      qf(stone, P(x0, y, z0), P(x1, y, z1), P(x1, y, top), P(x0, y, top), nn)
    }
  }
  // soffit: half cylinder through the bridge, facing the axis
  for (let i = 0; i < a.length - 1; i++) {
    const [x0, z0] = a[i], [x1, z1] = a[i + 1]
    const tm = Math.PI - (Math.PI * (i + 0.5)) / SEG
    qf(stone, P(x0, -H, z0), P(x1, -H, z1), P(x1, -R, z1), P(x0, -R, z0), rot([-Math.cos(tm), 0, -Math.sin(tm)], k))
  }
  // archivolt: a band 1.0 m wide, 0.25 proud, round the arch and down both jambs
  const o = arc(R + 1.0), w = 0.25, y0 = -H - w
  for (let i = 0; i < a.length - 1; i++) {
    const A0 = a[i], A1 = a[i + 1], B0 = o[i], B1 = o[i + 1]
    qf(stone, P(A0[0], y0, A0[1]), P(A1[0], y0, A1[1]), P(B1[0], y0, B1[1]), P(B0[0], y0, B0[1]), rot([0, -1, 0], k))
    const tm = Math.PI - (Math.PI * (i + 0.5)) / SEG
    qf(stone, P(B0[0], y0, B0[1]), P(B1[0], y0, B1[1]), P(B1[0], -H, B1[1]), P(B0[0], -H, B0[1]), rot([Math.cos(tm), 0, Math.sin(tm)], k))
    qf(stone, P(A0[0], y0, A0[1]), P(A1[0], y0, A1[1]), P(A1[0], -H, A1[1]), P(A0[0], -H, A0[1]), rot([-Math.cos(tm), 0, -Math.sin(tm)], k))
  }
  for (const s of [-1, 1]) {
    const xa = s * R, xb = s * (R + 1.0)
    qf(stone, P(xa, y0, PLINTH), P(xb, y0, PLINTH), P(xb, y0, SPRING), P(xa, y0, SPRING), rot([0, -1, 0], k))
    qf(stone, P(xb, y0, PLINTH), P(xb, -H, PLINTH), P(xb, -H, SPRING), P(xb, y0, SPRING), rot([s, 0, 0], k))
    qf(stone, P(xa, y0, PLINTH), P(xa, -H, PLINTH), P(xa, -H, SPRING), P(xa, y0, SPRING), rot([-s, 0, 0], k))
  }
}
// flat ceiling over the crossing, at the crown
stone.quad([-R, R, CROWN], [R, R, CROWN], [R, -R, CROWN], [-R, -R, CROWN])

// ---------------------------------------------------------------------------
// Attic cap over the cross-shaped plan, chamfered.


// the ring above runs S edge, then turns; insert the inner corners
const crossRing: XY[] = []
for (let k = 0; k < 4; k++) {
  crossRing.push(rotXY([-CORNER, -H], k), rotXY([CORNER, -H], k), rotXY([CORNER, -CORNER], k))
}
slab(stone, crossRing, ATTIC, ATTIC_TOP, 0.35)

// ---------------------------------------------------------------------------
// Corner sculpture groups: a base of two seated figures, the standing
// figure above, heads. 10 m tall from the black cap.
const box = (p: Part, cx: number, cy: number, hw: number, z0: number, z1: number, b = 0.3, top = 0) => {
  const r: XY[] = [[cx - hw, cy - hw], [cx + hw, cy - hw], [cx + hw, cy + hw], [cx - hw, cy + hw]]
  if (top > 0) {
    const q = (h: number, z: number): V3[] => [[cx - h, cy - h, z], [cx + h, cy - h, z], [cx + h, cy + h, z], [cx - h, cy + h, z]]
    p.loft([q(hw, z0), q(top, z1)])
    p.cap(q(top, z1), true)
  } else slab(p, r, z0, z1, b)
}
const head = (p: Part, x: number, y: number, z: number, r: number) =>
  lathe(p, x, y, [[0.001, z], [r * 0.8, z + r * 0.25], [r, z + r], [r * 0.8, z + r * 1.75], [0, z + r * 2]], 8, false)
for (let k = 0; k < 4; k++) {
  const c = rotXY([-15.05, -15.05], k)
  const out = rotXY([-1, -1], k) // diagonal outward
  const at = (d: number): [number, number] => [c[0] - out[0] * d, c[1] - out[1] * d]
  // plinth block, then the two seated figures as one broad mass
  box(stone, c[0], c[1], 2.6, CUTCAP, CUTCAP + 1.0, 0.3)
  box(sculpt, c[0], c[1], 2.5, CUTCAP + 1.0, CUTCAP + 4.4, 0.4, 2.1)
  // their heads, one on each outer face
  for (const f of [rotXY([0, -1], k), rotXY([-1, 0], k)]) {
    const g = [f[0] === 0 ? -out[0] : f[0], f[1] === 0 ? -out[1] : f[1]]
    head(sculpt, c[0] + f[0] * 1.2 + (f[0] === 0 ? g[0] * 0.9 : 0), c[1] + f[1] * 1.2 + (f[1] === 0 ? g[1] * 0.9 : 0), CUTCAP + 4.4, 0.85)
  }
  // the upper figure, set back toward the attic, broad shoulders, head
  const [sx, sy] = at(1.7)
  box(sculpt, sx, sy, 2.35, CUTCAP + 3.2, 39.0, 0.4, 1.85)
  box(sculpt, sx, sy, 2.05, 37.6, 39.6, 0.4)
  head(sculpt, sx + out[0] * 0.3, sy + out[1] * 0.3, 39.6, 1.2)
}

// ---------------------------------------------------------------------------
// The mirador stage: a base ring, the colonnade, the stone ring above.
const RD = 10.4 // drum outer radius
const C0 = 35.4, C1 = 43.4, RING1 = 45.6
const N = 16
lathe(stone, 0, 0, [[RD + 0.6, ATTIC_TOP], [RD + 0.6, C0 - 0.3], [RD + 0.3, C0]], N, false)
cap(stone, Array.from({ length: N }, (_, i) => [(RD + 0.3) * Math.cos((i * 2 * Math.PI) / N), (RD + 0.3) * Math.sin((i * 2 * Math.PI) / N)] as XY), C0, true)
// the dark interior behind the slits (window: lit at night)
lathe(win, 0, 0, [[RD - 1.9, C0], [RD - 1.9, C1]], N, false)
// posts: in each cardinal bay, six posts make five openings; bays span +-30 deg
for (let k = 0; k < 4; k++) {
  const base = (k * Math.PI) / 2 - Math.PI / 2 // k=0: south
  for (let i = 0; i <= 5; i++) {
    const t = base + ((i - 2.5) / 2.5) * (Math.PI / 4.6)
    const w = i === 0 || i === 5 ? 1.3 : 0.8
    const cx = (RD - 0.35) * Math.cos(t), cy = (RD - 0.35) * Math.sin(t)
    const ux = Math.cos(t), uy = Math.sin(t), vx = -uy, vy = ux
    const corner = (a: number, b: number): XY => [cx + ux * a + vx * b, cy + uy * a + vy * b]
    slab(stone, [corner(-0.45, -w / 2), corner(0.45, -w / 2), corner(0.45, w / 2), corner(-0.45, w / 2)], C0, C1, 0)
  }
}
// ring above the colonnade, with a soffit
lathe(stone, 0, 0, [[RD - 1.9, C1], [RD + 0.1, C1], [RD + 0.1, RING1 - 0.4], [RD + 0.5, RING1 - 0.4], [RD + 0.5, RING1]], N, false)

// The four diagonal pylons: tall square masses up to the dome's foot,
// stepping down outward in two stages (photos 1 and 5).
for (let k = 0; k < 4; k++) {
  const out = rotXY([-1, -1], k)
  const sq = (d: number, hw: number): XY[] => {
    const cx = out[0] * d, cy = out[1] * d
    return [[cx - hw, cy - hw], [cx + hw, cy - hw], [cx + hw, cy + hw], [cx - hw, cy + hw]]
  }
  slab(stone, sq(8.6, 2.3), ATTIC_TOP, 45.2, 0.4)
  slab(stone, sq(10.4, 2.0), ATTIC_TOP, 42.0, 0.4)
  slab(stone, sq(11.6, 1.7), ATTIC_TOP, 38.6, 0.35)
}

// ---------------------------------------------------------------------------
// Dome: copper, near hemispherical, with raised ribs; lantern on top.
const DR = 10.3, DZ = RING1
const prof: [number, number][] = []
const domeTop = 4.3 // radius at the gallery
const tTop = Math.acos(domeTop / DR)
for (let i = 0; i <= 7; i++) {
  const t = (tTop * i) / 7
  prof.push([DR * Math.cos(t), DZ + DR * Math.sin(t)])
}
lathe(copper, 0, 0, prof, 24, false)
const GAL = prof[prof.length - 1][1] // ~55.7
// ribs: 16 meridian ribs, square section 0.35 m
for (let r = 0; r < 16; r++) {
  const a = ((r + 0.5) * 2 * Math.PI) / 16
  const ux = Math.cos(a), uy = Math.sin(a), vx = -uy, vy = ux
  const secs: V3[][] = []
  for (let i = 0; i <= 7; i++) {
    const t = (tTop * i) / 7
    const rr = DR * Math.cos(t), zz = DZ + DR * Math.sin(t)
    const nr = Math.cos(t), nz = Math.sin(t), h = 0.3, hw = 0.2
    const P = (o: number, s: number): V3 => [ux * (rr + nr * o) + vx * s, uy * (rr + nr * o) + vy * s, zz + nz * o]
    secs.push([P(-0.05, -hw), P(-0.05, hw), P(h, hw), P(h, -hw)])
  }
  for (let i = 0; i < secs.length - 1; i++) {
    const a0 = secs[i], a1 = secs[i + 1]
    // top and the two sides (the bottom is buried in the dome)
    for (const [p, q] of [[3, 2], [2, 1], [0, 3]] as [number, number][]) metal.quad(a0[p], a1[p], a1[q], a0[q])
  }
}
// one horizontal band at mid height
{
  const t = tTop * 0.42, rr = DR * Math.cos(t) + 0.12, zz = DZ + DR * Math.sin(t)
  lathe(metal, 0, 0, [[rr, zz - 0.25], [rr + 0.18, zz - 0.2], [rr + 0.18, zz + 0.2], [rr - 0.1, zz + 0.3]], 24, false)
}
// gallery floor and railing
lathe(copper, 0, 0, [[domeTop + 0.3, GAL - 0.3], [domeTop + 0.6, GAL], [0.01, GAL]], 16, false)
lathe(metal, 0, 0, [[domeTop + 0.5, GAL], [domeTop + 0.5, GAL + 1.1], [domeTop + 0.35, GAL + 1.1], [domeTop + 0.35, GAL]], 16, false)
// glazed lantern drum, ring, cap, finial
lathe(win, 0, 0, [[3.0, GAL], [3.0, GAL + 2.4]], 16, false)
lathe(copper, 0, 0, [[3.0, GAL + 2.4], [3.35, GAL + 2.5], [3.35, GAL + 2.9], [3.0, GAL + 3.0], [2.4, GAL + 4.0], [1.3, GAL + 4.6], [0.45, GAL + 4.85], [0.45, GAL + 5.1], [0.01, GAL + 5.3]], 16, false)

// ---------------------------------------------------------------------------
const lit = (p: V3, n: V3) => {
  if (n[2] > 0.7) return 0.35
  return p[2] > 28 ? 1 : 0.85
}
await save('mexico-city-monumento-a-la-revolucion', 'Monumento a la Revolución', [
  { part: stone, material: { ...finish('mdlr-cantera', 0xd3c8b4), floodlight: lit } as any },
  { part: black, material: { ...finish('mdlr-black-stone', 0x4c4f55), floodlight: (_p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.6) } as any },
  { part: copper, material: { ...finish('mdlr-copper', 0xc27f5c, 0.6), floodlight: () => 1 } as any },
  { part: metal, material: { ...finish('mdlr-copper-dark', 0x8c5a43, 0.7), floodlight: () => 0.8 } as any },
  { part: win, material: PALETTE.window },
  { part: sculpt, material: { ...finish('mdlr-sculpture', 0xaba596), floodlight: lit } as any },
], { name: 'Monumento a la Revolución' }, 6500)
