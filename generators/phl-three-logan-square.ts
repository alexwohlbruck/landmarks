/**
 * Three Logan Square (former Bell Atlantic Tower, Verizon Tower), 1717 Arch
 * Street, Philadelphia (The Kling Lindquist Partnership, 1991) — original
 * procedural geometry, CC0-1.0.
 * bun generators/phl-three-logan-square.ts
 * (uses the shared kit exported by generators/phl-comcast-center.ts)
 *
 * Not BNY Mellon Center (1735 Market St), a different tower two blocks south.
 *
 * Map frame, turned to the building: +x east along Arch Street (which runs past
 * the south face), +y north toward Cherry Street,
 * z up, metres. BEARING 9.0, the Center City grid. Origin = area centroid of
 * the OSM outline way/42785098 (-75.169029, 39.955415), on the ground.
 *
 * Form (Wobbanight series, the public-domain Werd678 photo): a long slab of
 * red granite, 69 m east-west by 36 m, whose plan steps in at each end in
 * three notches, so the ends are a stack of narrowing faces; at the top the
 * same steps climb as setbacks, each wider-and-thinner tier rising above the
 * one before, a ziggurat crown in both plan and section. Punched windows in a
 * regular grid all over; the topmost two tiers are a dark glass and metal
 * mechanical screen with vertical fins. A tall granite-framed entrance portal
 * in the middle of the Arch Street (south) face.
 *
 * Evidence
 * - OSM way/42785098 (outline, Three Logan Square, alt_name Bell Atlantic
 *   Tower, wikidata Q2894593) and parts way/343340487 to way/343340496,
 *   way/343374515 and way/343374518 (granite tiers "#836B61" and two black
 *   glass top tiers, 170-225 m). All are replaced.
 * - USGS 3DEP lidar USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown 2015),
 *   0.5 m grid in this frame, heights above the lowest ground under the
 *   footprint (the west end, 3.6 m above the box minimum). The tiers, as
 *   nested boxes (x half-width, y half-depth, height): 20.4 x 18.1 to 166.0;
 *   12.1 x 18.1 to 172.5; 25.1 x 15.3 to 176.3; 16.0 x 14.5 to 185.0;
 *   29.7 x 12.1 to 188.0; 20.0 x 11.0 to 195.3; 34.4 x 9.4 to 199.0;
 *   26.0 x 8.0 to 208.0; dark screen 29.7 x 7.4 to 214.3; dark screen
 *   25.1 x 5.5 to 221.9 (the top). The plan steps match the OSM outline to
 *   within half a metre. Published height 739 ft (225 m) to the screen top.
 * - Mapterhorn terrain: under a metre of slope; ordinary site, elevation 0.
 * - Published: 739 ft, 55 storeys, 1991 (Wikipedia, "Three Logan Square").
 *
 * Photos (EVIDENCE):
 * - "Three Logan Square a.jpg", Wobbanight, CC0 (the long face from below:
 *   the granite colour, the window grid, the stepped crown and dark screen)
 *   https://commons.wikimedia.org/wiki/File:Three_Logan_Square_a.jpg
 * - "Bell atlantic tower.jpg", Werd678 (English Wikipedia), public domain
 *   (the long face in sun, the entrance portal, the end steps)
 *   https://commons.wikimedia.org/wiki/File:Bell_atlantic_tower.jpg
 * - Also seen in "Comcast Centers in Philadelphia.jpg", Chapsam, CC BY-SA 4.0
 *   (the ziggurat crown in silhouette from the north-west).
 *
 * Estimated: the window grid drawn as grouped blocks, each two bays (6.4 m)
 * by two storeys (7.4 m), 4.4 x 4.6 m of glass with granite piers and
 * spandrels showing both ways (the real grid is one window per bay per floor); the portal (11 m wide, 15 m
 * tall) from the Werd678 photo; the screen's fins (every 3.5 m).
 *
 * Colours (daylight photos, pulled to the palette's lightness): red granite
 * #9e8a80, a mauve-brown (sunlit it reads pinkish brown, in shade a deeper
 * brown; pulled toward the shade colour so it doesn't read salmon); the
 * windows a dark neutral grey-blue (window #5f6f7c); the screen a dark
 * graphite #5c6166, as in every photo.
 *
 * Night: the office windows glow (window). The screen and granite are unlit.
 *
 * Doubts: the exact height of each crown step between 166 and 199 m is
 * lidar-exact, but the tiers' faces below are assumed plumb; the portal is
 * only seen on the Arch Street (south, sunlit) face in one photo.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { box, band, facePanel, saveTower, type P2 } from './phl-comcast-center'

const BEARING = 9.0
const ANCHOR = { lng: -75.169029, lat: 39.955415 }

const granite = new Part()
const win = new Part()
const screen = new Part()
const fin = new Part()    // the screen's lighter vertical fins
const roof = new Part()

type Tier = { x: number; y: number; h: number; dark?: boolean }
const tiers: Tier[] = [
  { x: 20.4, y: 18.1, h: 166.0 },
  { x: 12.1, y: 18.1, h: 172.5 },
  { x: 25.1, y: 15.3, h: 176.3 },
  { x: 16.0, y: 14.5, h: 185.0 },
  { x: 29.7, y: 12.1, h: 188.0 },
  { x: 20.0, y: 11.0, h: 195.3 },
  { x: 34.4, y: 9.4, h: 199.0 },
  { x: 26.0, y: 8.0, h: 208.0 },
  { x: 29.7, y: 7.4, h: 214.3, dark: true },
  { x: 25.1, y: 5.5, h: 221.9, dark: true },
]
const TOP = 221.9

for (const t of tiers) {
  // A dark tier stands on the granite below it: start it at the highest granite tier it overlaps.
  const z0 = t.dark ? 199.0 : 0
  box(t.dark ? screen : granite, -t.x, t.x, -t.y, t.y, z0, t.h, roof, 0.4)
  if (!t.dark) band(granite, -t.x, t.x, -t.y, t.y, t.h - 0.6, 1.2, 0.2, 0.4) // coping
}

/** Height up to which a point on a tier's face is hidden by a wider/deeper neighbour. */
function hiddenTo(t: Tier, axis: 'x' | 'y', along: number): number {
  let z = 0
  for (const o of tiers) {
    if (o === t || o.dark) continue
    // a coplanar, taller neighbour carries the panels itself
    if (axis === 'x' && o.x === t.x && o.h > t.h && o.y > Math.abs(along)) return Infinity
    if (axis === 'y' && o.y === t.y && o.h > t.h && o.x > Math.abs(along)) return Infinity
    if (axis === 'x' && o.x > t.x && o.y > Math.abs(along)) z = Math.max(z, o.h)
    if (axis === 'y' && o.y > t.y && o.x > Math.abs(along)) z = Math.max(z, o.h)
  }
  return z
}

// Grouped window blocks: each spans two bays (6.4 m) and two storeys (7.4 m),
// 4.4 m wide and 4.6 m tall, so granite piers (2 m) and spandrels (2.8 m)
// show clearly both ways: a coarse punched grid, never a full-height stripe.
const FLOOR = 3.7, GROUP = 2 * FLOOR, BAY = 6.4, PW = 4.4, PH = 4.6
for (const t of tiers) {
  if (t.dark) continue
  const faces: Array<[P2, P2, 'x' | 'y', number]> = [
    [[-t.x, -t.y], [t.x, -t.y], 'y', 2 * t.x],
    [[t.x, -t.y], [t.x, t.y], 'x', 2 * t.y],
    [[t.x, t.y], [-t.x, t.y], 'y', 2 * t.x],
    [[-t.x, t.y], [-t.x, -t.y], 'x', 2 * t.y],
  ]
  for (const [a, b, axis, L] of faces) {
    const n = Math.floor((L - 1.6) / BAY)
    if (n < 1) continue
    const m = (L - n * BAY) / 2
    for (let i = 0; i < n; i++) {
      const c = m + (i + 0.5) * BAY, s0 = (c - PW / 2) / L, s1 = (c + PW / 2) / L
      // the bay's ends must both be exposed
      const pos = (u: number) => axis === 'x' ? a[1] + (b[1] - a[1]) * (u / L) : a[0] + (b[0] - a[0]) * (u / L)
      const zh = Math.max(hiddenTo(t, axis, pos(c - PW / 2)), hiddenTo(t, axis, pos(c + PW / 2)))
      if (!isFinite(zh)) continue
      const zTop = t.h - 2.4
      let z = zh === 0 ? 5.0 : Math.ceil((zh + 1.6 - 5.0) / GROUP) * GROUP + 5.0
      for (; z + PH <= zTop; z += GROUP) facePanel(win, a, b, s0, s1, z, z + PH, 0.05)
    }
  }
}

// The dark screen's fins: shallow vertical strips every 3.5 m on its faces.
for (const t of tiers.filter((q) => q.dark)) {
  const faces: Array<[P2, P2, number]> = [
    [[-t.x, -t.y], [t.x, -t.y], 2 * t.x], [[t.x, -t.y], [t.x, t.y], 2 * t.y],
    [[t.x, t.y], [-t.x, t.y], 2 * t.x], [[-t.x, t.y], [-t.x, -t.y], 2 * t.y],
  ]
  for (const [a, b, L] of faces) {
    const n = Math.round(L / 3.5)
    for (let i = 1; i < n; i++) facePanel(fin, a, b, i / n - 0.3 / L, i / n + 0.3 / L, t === tiers[8] ? 199.6 : 214.3, t.h - 0.3, 0.06)
  }
}

// Entrance portal in the middle of the Arch Street (south) face: a granite
// frame proud of the wall around a tall glazed recess.
{
  const y = -18.1
  box(granite, -6.8, 6.8, y - 1.0, y + 0.2, 0, 16.5, roof, 0.3)
  facePanel(win, [-5.4, y - 1.0], [5.4, y - 1.0], 0, 1, 0.0, 15.0, 0.05)
}

await saveTower('phl-three-logan-square', 'Three Logan Square', [
  { part: granite, material: finish('tls-red-granite', 0x9e8a80) },
  { part: win, material: { name: 'window', color: 0x5f6f7c, roughness: 0.35 } },
  { part: screen, material: finish('tls-screen', 0x5c6166) },
  { part: fin, material: finish('tls-fin', 0x7b8086) },
  { part: roof, material: PALETTE.roof },
], {
  bearing: BEARING, anchor: ANCHOR, height: TOP,
  replaces: ['way/42785098', 'way/343340487', 'way/343340488', 'way/343340489', 'way/343340490', 'way/343340491', 'way/343340492', 'way/343340493', 'way/343340494', 'way/343340495', 'way/343340496', 'way/343374515', 'way/343374518'],
})
