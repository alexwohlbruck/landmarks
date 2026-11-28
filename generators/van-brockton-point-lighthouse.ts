/**
 * Brockton Point Lighthouse, Stanley Park, Vancouver (1914; William P.
 * Anderson) — procedural, CC0-1.0.
 * bun generators/van-brockton-point-lighthouse.ts
 *
 * The square white tower with its red band, standing on a black-painted
 * base pierced by a round-arched passage that carries the seawall path
 * through it; the corbelled cornice, the parapet round the gallery, and the
 * red octagonal lantern with its domed cap.
 *
 * Frame: x across (east'), y along (north'), z up, metres, turned to
 * bearing 13.7 (the OSM outline's sides run at 13.7° and 103.7°). Origin at
 * the outline's centre on the seawall path. The passage runs along x
 * (east–west), as the OSM tunnel footway way/731790214 under the tower does.
 *
 * Evidence
 *  - OSM: way/363578417 (building=yes, layer=1), 4.3 x 4.3 m in this frame;
 *    node/1309734989 (man_made=lighthouse, Q19460680); the tunnel footway
 *    way/731790214 through it; the retaining wall way/363578419 and the
 *    terrace to the south.
 *  - Published (Wikipedia "Brockton Point Lighthouse"): square tower built
 *    1914, white with a red horizontal stripe, red lantern, arched base with
 *    a walkway underneath; inactive since 2008, lit for decoration.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    1. "Vancouver (BC, Canada), Brockton Point Lighthouse -- 2022 -- 2050.jpg",
 *       Dietmar Rabich, CC BY-SA 4.0: the west and south faces from the path;
 *       every height below is scaled from it against the 4.3 m face (about
 *       60 px a metre).
 *    2. "Portal - Brockton Point Lighthouse - Stanley Park.jpg", Enoch Leung,
 *       CC BY-SA 2.0: the passage, a semicircular arch on straight jambs.
 *    3. "Brockton Point Lighthouse and North Vancouver.jpg", Ymblanter,
 *       CC BY-SA 4.0: the north side from the west, on the seawall.
 *    4. "Brockton Point Lighthouse - Vancouver BC.jpg", Kenny Louie, CC BY
 *       2.0 (night): the south face from the terrace (door under the band),
 *       the lantern lit, the tower floodlit.
 *  - Heights (ESTIMATED from photo 1, ±0.3 m): black base 0–4.8 with the
 *    arch 2.3 m wide, crown 3.8; a pale ledge 4.8–5.0; white shaft to 12.3,
 *    red band 7.9–9.6; corbelled cornice 12.3–12.9; parapet to 14.0; lantern
 *    13.0–15.6, its red roof to 16.2 and the cap and ventilator to 17.0. No
 *    lidar here (Stanley Park is outside the City's 2009 footprints).
 *  - Mapterhorn: the drawn ground under the 4 m footprint ramps 1.7–4.3 m up
 *    toward the terrace on the south (a smoothed step: the real path is flat
 *    and the terrace wall vertical). Model base at the path; the south face
 *    sinks into the drawn slope, as the terrace really abuts it there.
 *  Elevation 0.
 *
 * Doubts: the east face isn't photographed close up; the slit windows on the
 * west, north and east faces copy the west one. The south face's red door
 * opens onto the terrace about 6.1 m above the path (photos 1 and 4); the
 * terrace isn't part of the model, so the door is left out rather than
 * drawn hanging on the wall. The parapet's balustrade is drawn as a plain
 * white parapet. The base is dark charcoal, the passage's jambs and vault a
 * shade darker, so the arch reads at three-quarter views. The shaft narrows
 * from 4.3 m to 3.86 m (photo 1: the west face 260 px at its foot, 235 px
 * under the cornice).
 *
 * Night: the lantern's glazing is `window` (it glows) and a `lamp` bead
 * inside it; the white shaft is floodlit (`_FLOODLIGHT`).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { box, beam, loftSolid, type Skin } from './sf-golden-gate-bridge'
import { bead } from './bridge-kit'
import { PALETTE, finish } from './palette'

const H = 2.15                     // half the tower's side at the base
const BASE = 4.8, LEDGE = 5.0, SHAFT = 12.3, TAPER = 0.22
const half = (z: number) => H - (TAPER * (z - LEDGE)) / (SHAFT - LEDGE)
const BAND = [7.9, 9.6]
const ARCH_W = 2.3, CROWN = 3.8

const white = new Part(), red = new Part(), black = new Part(), passage = new Part(), glass = new Part(), lamp = new Part()
const one = (p: Part): Skin => () => p
const sq = (h: number, z: number, r = 0): V3[] => r
  ? [[-h + r, -h, z], [h - r, -h, z], [h, -h + r, z], [h, h - r, z], [h - r, h, z], [-h + r, h, z], [-h, h - r, z], [-h, -h + r, z]]
  : [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]]

// ---- The base: a black block with the arched passage along x --------------------
{
  const a = ARCH_W / 2, spring = CROWN - a, n = 10, B = one(black)
  /** A quad wound to face n (Part.tri winds to agree with explicit normals). */
  const quadN = (p: V3[], nn: V3, part = black) => {
    part.tri(p[0], p[1], p[2], undefined, undefined, undefined, [nn, nn, nn])
    part.tri(p[0], p[2], p[3], undefined, undefined, undefined, [nn, nn, nn])
  }
  // The two walls beside the passage (their jambs in the darker passage
  // colour, as the shadow inside the arch reads in photo 1) and the block over it.
  box((nn) => (nn[1] > 0.5 ? passage : black), -H, H, -H, -a, 0, BASE, { r: 0, bottom: false })
  box((nn) => (nn[1] < -0.5 ? passage : black), -H, H, a, H, 0, BASE, { r: 0, bottom: false })
  box(B, -H, H, -a, a, CROWN, BASE, { r: 0, bottom: false })
  // The spandrels between the semicircle and the crown's level, on both
  // faces, and the passage's vault, facing in and down.
  const arc = Array.from({ length: n + 1 }, (_, i) => [a * Math.cos((Math.PI * i) / n), spring + a * Math.sin((Math.PI * i) / n)] as [number, number])
  for (let i = 0; i < n; i++) {
    const [u0, z0] = arc[i], [u1, z1] = arc[i + 1]
    for (const sx of [-1, 1]) quadN([[sx * H, u0, z0], [sx * H, u1, z1], [sx * H, u1, CROWN], [sx * H, u0, CROWN]], [sx, 0, 0])
    const um = (u0 + u1) / 2, zm = (z0 + z1) / 2 - spring, l = Math.hypot(um, zm)
    quadN([[-H, u0, z0], [H, u0, z0], [H, u1, z1], [-H, u1, z1]], [0, -um / l, -zm / l], passage)
  }
}

// ---- The shaft ---------------------------------------------------------------------
box(one(white), -H - 0.1, H + 0.1, -H - 0.1, H + 0.1, BASE, LEDGE, { r: 0.05, bottom: true })
const ring = (z0: number, z1: number, p: Part) => loftSolid(one(p), [sq(half(z0), z0, 0.12), sq(half(z1), z1, 0.12)], [false, false])
ring(LEDGE, BAND[0], white)
ring(BAND[0], BAND[1], red)
ring(BAND[1], SHAFT, white)

/** A flush panel on face f (0 +x, 1 +y, 2 -x, 3 -y), centred at u across, z0–z1, w wide. */
function panel(p: Part, f: number, u: number, w: number, z0: number, z1: number) {
  const zm = (z0 + z1) / 2, d = half(zm) + 0.03
  const [nx, ny] = [[1, 0], [0, 1], [-1, 0], [0, -1]][f]
  const at = (s: number, z: number): V3 => [nx * d - ny * s, ny * d + nx * s, z]
  p.quad(at(u - w / 2, z0), at(u + w / 2, z0), at(u + w / 2, z1), at(u - w / 2, z1))
}
// Slit windows on the west, north and east faces, crossing the band's top (photo 1).
for (const f of [0, 1, 2]) panel(passage, f, 0, 0.32, 8.7, 9.9)

// ---- Cornice, parapet, lantern ---------------------------------------------------------
const C = half(SHAFT)
box(one(white), -C - 0.35, C + 0.35, -C - 0.35, C + 0.35, SHAFT + 0.3, SHAFT + 0.6, { r: 0.1, bottom: true })
// Corbels under the cornice, five a face.
for (const f of [0, 1, 2, 3]) for (let i = 0; i < 5; i++) {
  const u = -C + 0.35 + (i * (2 * C - 0.7)) / 4
  const [nx, ny] = [[1, 0], [0, 1], [-1, 0], [0, -1]][f]
  const cx = nx * (C + 0.15) - ny * u, cy = ny * (C + 0.15) + nx * u
  box(one(white), cx - 0.18, cx + 0.18, cy - 0.18, cy + 0.18, SHAFT, SHAFT + 0.3, { r: 0, bottom: true })
}
// The parapet: a low wall round the gallery (its balusters drawn solid).
const P0 = SHAFT + 0.6, P1 = 14.0, PO = C + 0.3, PI = PO - 0.25
loftSolid(one(white), [sq(PO, P0), sq(PO, P1)], [false, false])
loftSolid(one(white), [sq(PI, P1).reverse(), sq(PI, P0 + 0.1).reverse()], [false, false])
for (let k = 0; k < 4; k++) {
  const o = sq(PO, P1), i = sq(PI, P1), l = (k + 1) % 4
  white.quad(i[k], o[k], o[l], i[l])
}
white.cap(sq(PI, P0 + 0.1), true)
// The lantern: a red octagonal base, glazing between red posts, a red roof and cap.
const oct = (r: number, z: number): V3[] => Array.from({ length: 8 }, (_, i) => {
  const a = (Math.PI / 8) * (2 * i + 1)
  return [r * Math.cos(a), r * Math.sin(a), z] as V3
})
const LR = 1.35, L0 = P0 + 0.1, L1 = 13.6, L2 = 15.6, L3 = 16.2
loftSolid(one(red), [oct(LR, L0), oct(LR, L1)], [false, false])
loftSolid(one(glass), [oct(LR - 0.05, L1), oct(LR - 0.05, L2)], [false, false])
for (const p of oct(LR, 0)) beam(one(red), [p[0], p[1], L1], [p[0], p[1], L2], 0.16, 0.16, [p[0], p[1], 0])
loftSolid(one(red), [oct(LR + 0.15, L2), oct(LR + 0.15, L2 + 0.15), oct(0.35, L3)], [true, false])
loftSolid(one(red), [oct(0.3, L3), oct(0.3, 16.6), oct(0.42, 16.7), oct(0.15, 17.0)], [false, true])
bead(lamp, [0, 0, 14.6], 0.45)

const WHITE = { ...finish('lighthouse-white', 0xf4f1ea), floodlight: (p: V3, n: V3) => (p[2] > LEDGE && p[2] < 14.1 && n[2] < 0.7 ? 0.8 : 0) }
const RED = finish('lighthouse-red', 0xc85a4e)
const BLACK = finish('lighthouse-base', 0x5e636a)
const PASSAGE = finish('lighthouse-passage', 0x4a4f57)
const LAMP = { name: 'lamp', color: 0xd8d4c8 }
const parts = [
  { part: white, material: WHITE },
  { part: red, material: RED },
  { part: black, material: BLACK },
  { part: passage, material: PASSAGE },
  { part: glass, material: PALETTE.window },
  { part: lamp, material: LAMP },
]
const tris = parts.reduce((s, p) => s + p.part.triangles, 0)
const glb = writeGlb('Brockton Point Lighthouse', parts, { license: 'CC0-1.0', bearing: 13.7, elevation: 0 })
await Bun.write(new URL('../models/van-brockton-point-lighthouse.glb', import.meta.url), glb)
console.log(`van-brockton-point-lighthouse.glb: ${tris} triangles, ${glb.length} bytes`)
