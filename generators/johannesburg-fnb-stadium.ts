/**
 * FNB Stadium (Soccer City; Boogertman + Partners with Populous, rebuilt
 * 2006-2009 for the 2010 FIFA World Cup), Nasrec, Johannesburg: original
 * procedural geometry, CC0-1.0, no textures.
 *   bun generators/johannesburg-fnb-stadium.ts
 *
 * Map frame: x east, y north, z up, metres; y = 0 is the pitch. Anchor =
 * the centre of the OSM roof ring (relation/1639587, building=roof; outer
 * way/119208352, inner way/119208354), which the pitch opening of relation/
 * 952173 shares, lng 27.9826420, lat -26.2347326. Bearing 2: the long axes
 * of the roof ring (3.2), the roof opening (2.9) and the pitch opening
 * (-1.6), averaged.
 *
 * Identity, in order: the calabash, a bulging pot-shaped shell clad in a
 * mosaic of earth-toned fibre-cement panels with small glazed openings; the
 * vertical glazed lines through the mosaic; the pale ring roof over the
 * stands with its oval opening; the orange seats of the bowl inside.
 *
 * Evidence
 *  - Plan (superellipses fitted to the OSM nodes, in this frame): the
 *    roof ring's outer edge 117.8 x 133.0 m half-axes, exponent 2.8, drawn
 *    as the calabash at its widest; the roof opening 87.7 x 103.1,
 *    exponent 3.1; the stadium's inner ring (the pitch surround) 48.1 x
 *    63.4, exponent 4.7. The stadium's outer way (way/48848017, a 300 m
 *    circle) is the podium round the calabash: paved ground, not drawn.
 *  - Sunken bowl: the map's terrain (Mapterhorn, z12 only here; z13-z15
 *    404) shows the pitch in a pit 13-14 m below the podium round it. The
 *    model is built on that: y = 0 the pitch, the calabash rising from the
 *    podium at +13.5 m (its walls run down to the pitch level, out of
 *    sight). Elevation 0: the terrain already puts the pitch at its
 *    lowest point. No section drawing was found to confirm the 13.5 m.
 *  - Heights ESTIMATED from f3 (level, from the north-east across the
 *    showground): the shell stands about 0.2 of its seen width above the
 *    podium, so its rim is drawn at 64 m over the pitch (50.5 m over the
 *    podium); widest at 45 m; drawn tucked in to 0.88 of its width at the
 *    podium and curving in to 0.93 at the rim (f1, f3).
 *  - The mosaic: f1 (sunlit, close) shows square panels in about eight
 *    earth tones, reds, oranges, tans and browns, with dark (glazed)
 *    openings, and f8 (night) the openings lit. Drawn as facets of three
 *    tones (red, ochre, tan) plus the openings, 96 round by 9 high,
 *    assigned by a fixed hash so neighbouring facets differ; the real
 *    panels are much smaller. The ten vertical glazed lines (f3, f8; the
 *    published story is that they point to the other World Cup venues) are
 *    drawn evenly spaced: their real positions are unknown.
 *  - Photos (EVIDENCE):
 *    - f1 Kabelo Serutle, "FNB Stadium (The Calabash).jpg", CC BY-SA 4.0
 *      — the mosaic, its colours, the shell's curve.
 *      https://commons.wikimedia.org/wiki/File:FNB_Stadium_(The_Calabash).jpg
 *    - f2 fading, "FNB Stadium and mooifontein Arrial View - panoramio.jpg",
 *      CC BY-SA 3.0 — aerial: the ring roof, the opening, the podium.
 *      https://commons.wikimedia.org/wiki/File:FNB_Stadium_and_mooifontein_Arrial_View_-_panoramio.jpg
 *    - f3 Hendrik van den Berg, "Toy Run Bikers with Soccercity in the
 *      background - panoramio.jpg", CC BY 3.0 — level: the shell's
 *      profile, a glazed line.
 *      https://commons.wikimedia.org/wiki/File:Toy_Run_Bikers_with_Soccercity_in_the_background_-_panoramio.jpg
 *    - f7, f8 Celso Flores, "Soccer City - Johannesburg" (Flickr), CC BY
 *      2.0 — the orange seats and the roof underside; night, the lit
 *      openings. https://www.flickr.com/photos/17509603@N00/4719161222
 *      https://www.flickr.com/photos/17509603@N00/4719159322
 *  No look-only sources. No commercial imagery. No lidar here.
 *
 * Invented or simplified: the stands are plain surfaces, the wall at the
 * pitch drawn 5.5 m and the lower tier steepened at its foot so they clear
 * the sides of the map's (coarse) pit (they are seen only
 * through the opening); the roof is one smooth sheet without its ribs; the
 * podium, its stairs and the entrance canopies are left out (relation/
 * 952173's outer way is that podium; replacing it leaves the paving round
 * the calabash to the map's ground).
 * Colours: red #c4604a, ochre #cf9a6a, tan #dcc6a4 (f1, pulled to the
 * palette's lightness), seats #c8683f (f7), roof #dcdcd6 (f2).
 * Doubts: the pit's depth; the shell's height; the glazed lines' places.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { writeModel, type Slot } from './pretoria-union-buildings'

const ID = 'johannesburg-fnb-stadium'
const NAME = 'FNB Stadium'
const ANCHOR: [number, number] = [27.982642, -26.2347326]
const BEARING = 2

/** Polar radius of a superellipse. */
const se = (t: number, a: number, b: number, e: number) => Math.pow(Math.pow(Math.abs(Math.cos(t) / a), e) + Math.pow(Math.abs(Math.sin(t) / b), e), -1 / e)
const SHELL = (t: number) => se(t, 117.8, 133.0, 2.8)
const OPEN = (t: number) => se(t, 87.7, 103.1, 3.1)
const PITCH = (t: number) => se(t, 48.1, 63.4, 4.7)

const ZP = 13.5, ZW = 45, ZR = 64
/** The calabash's width factor at height z. */
const prof = (z: number) => (z <= ZP ? 0.88 : z <= ZW ? 0.88 + 0.12 * Math.sin((Math.PI / 2) * (z - ZP) / (ZW - ZP)) : 1 - 0.07 * ((z - ZW) / (ZR - ZW)) ** 2)

/** A smooth quad strip between two point functions over angle. */
function quadCell(p: Part, a0: V3, a1: V3, b1: V3, b0: V3, outward: (q: V3) => V3) {
  const g = (q: V3) => outward(q)
  p.tri(a0, a1, b1, undefined, undefined, undefined, [g(a0), g(a1), g(b1)])
  p.tri(a0, b1, b0, undefined, undefined, undefined, [g(a0), g(b1), g(b0)])
}

function build() {
  const red = new Part(), ochre = new Part(), tan = new Part(), win = new Part(), roof = new Part(), seats = new Part()
  const NA = 96, NZ = 9
  const at = (t: number, r: number, z: number): V3 => [r * Math.cos(t), r * Math.sin(t), z]
  const P = (k: number, z: number) => { const t = (k / NA) * 2 * Math.PI; return at(t, SHELL(t) * prof(z), z) }
  // outward normal of the shell: horizontal from the plan, tilted by the profile's slope
  const nrm = (q: V3): V3 => {
    const t = Math.atan2(q[1], q[0]), z = q[2], dz = 0.5
    const dr = (SHELL(t) * (prof(z + dz) - prof(Math.max(0, z - dz)))) / (2 * dz)
    const n: V3 = [Math.cos(t), Math.sin(t) * (117.8 / 133.0) ** 0.3, -dr]
    const l = Math.hypot(...n)
    return [n[0] / l, n[1] / l, n[2] / l]
  }
  const hash = (i: number, j: number) => { const h = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return h - Math.floor(h) }
  const zs = Array.from({ length: NZ + 1 }, (_, j) => ZP + ((ZR - ZP) * j) / NZ)
  const lines = new Set(Array.from({ length: 10 }, (_, i) => Math.round((i * NA) / 10 + 3) % NA))
  // the hidden wall from the pitch level to the podium
  for (let k = 0; k < NA; k++) quadCell(tan, P(k, 0), P(k + 1, 0), P(k + 1, ZP), P(k, ZP), nrm)
  let prev: number[] = []
  for (let j = 0; j < NZ; j++) {
    const row: number[] = []
    for (let k = 0; k < NA; k++) {
      let tone = Math.floor(hash(k, j) * 3)
      if (tone === prev[k] || (k > 0 && tone === row[k - 1])) tone = (tone + 1 + Math.floor(hash(j, k) * 2)) % 3
      if (k === NA - 1 && tone === row[0]) tone = (tone + 1) % 3
      row.push(tone)
      const open = lines.has(k) || hash(k + 7, j + 3) < 0.045
      const part = open ? win : [red, ochre, tan][tone]
      quadCell(part, P(k, zs[j]), P(k + 1, zs[j]), P(k + 1, zs[j + 1]), P(k, zs[j + 1]), nrm)
    }
    prev = row
  }
  // the roof: from the shell's rim over to the opening, falling a little,
  // with its underside; a thin fascia at the opening
  const ZO = 58.5
  for (let k = 0; k < NA; k++) {
    const t0 = (k / NA) * 2 * Math.PI, t1 = ((k + 1) / NA) * 2 * Math.PI
    const rim = (t: number, z: number) => at(t, SHELL(t) * prof(ZR), z)
    const opn = (t: number, z: number) => at(t, OPEN(t), z)
    const mid = (t: number, z: number) => at(t, (SHELL(t) * prof(ZR) + OPEN(t)) / 2, z)
    const up = (): V3 => [0, 0, 1], dn = (): V3 => [0, 0, -1]
    quadCell(roof, rim(t0, ZR), rim(t1, ZR), mid(t1, ZR - 1.2), mid(t0, ZR - 1.2), up)
    quadCell(roof, mid(t0, ZR - 1.2), mid(t1, ZR - 1.2), opn(t1, ZO), opn(t0, ZO), up)
    quadCell(seats, opn(t0, ZO - 1.8), opn(t1, ZO - 1.8), mid(t1, ZR - 3.4), mid(t0, ZR - 3.4), dn)
    quadCell(seats, mid(t0, ZR - 3.4), mid(t1, ZR - 3.4), rim(t1, ZR - 2.4), rim(t0, ZR - 2.4), dn)
    quadCell(roof, opn(t0, ZO - 1.8), opn(t1, ZO - 1.8), opn(t1, ZO), opn(t0, ZO), (q) => { const t = Math.atan2(q[1], q[0]); return [-Math.cos(t), -Math.sin(t), 0] })
    // the stands: a low wall at the pitch, the lower tier, a band, the upper tier
    const inw = (q: V3): V3 => { const t = Math.atan2(q[1], q[0]); return [-Math.cos(t), -Math.sin(t), 1.2] }
    const R = (t: number, f: number) => PITCH(t) + (SHELL(t) * 0.9 - PITCH(t)) * f
    const S = (t: number, f: number, z: number) => at(t, R(t, f), z)
    quadCell(seats, S(t0, 0, 0), S(t1, 0, 0), S(t1, 0, 5.5), S(t0, 0, 5.5), (q) => { const t = Math.atan2(q[1], q[0]); return [-Math.cos(t), -Math.sin(t), 0] })
    // the lower tier rises steeply at first: the pit's sides (map terrain) stand there
    quadCell(seats, S(t0, 0, 5.5), S(t1, 0, 5.5), S(t1, 0.14, 12), S(t0, 0.14, 12), inw)
    quadCell(seats, S(t0, 0.14, 12), S(t1, 0.14, 12), S(t1, 0.42, 22), S(t0, 0.42, 22), inw)
    quadCell(tan, S(t0, 0.42, 22), S(t1, 0.42, 22), S(t1, 0.44, 26), S(t0, 0.44, 26), (q) => { const t = Math.atan2(q[1], q[0]); return [-Math.cos(t), -Math.sin(t), 0] })
    quadCell(seats, S(t0, 0.44, 26), S(t1, 0.44, 26), S(t1, 0.97, ZR - 3.0), S(t0, 0.97, ZR - 3.0), inw)
  }
  return [
    { part: red, material: finish('fnb-panel-red', 0xc4604a) },
    { part: ochre, material: finish('fnb-panel-ochre', 0xcf9a6a) },
    { part: tan, material: finish('fnb-panel-tan', 0xdcc6a4) },
    { part: win, material: PALETTE.window },
    { part: roof, material: finish('fnb-roof', 0xdcdcd6) },
    { part: seats, material: finish('fnb-seats', 0xc8683f) },
  ] as Slot[]
}

if (import.meta.main) await writeModel(`${ID}.glb`, NAME, build(), { anchor: ANCHOR, bearing: BEARING }, 6500, 250_000)
