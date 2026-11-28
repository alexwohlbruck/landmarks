/**
 * Sorihashi (反橋, the "taiko-bashi") of Sumiyoshi Taisha, Sumiyoshi-ku,
 * Osaka: the steep vermilion arched footbridge over the shrine's pond —
 * procedural, CC0-1.0.
 * bun generators/osaka-sumiyoshi-sorihashi.ts
 *
 * Built with tube from osaka-castle.ts.
 *
 * Map frame: x east, y north, z up, metres; bearing 8, so the bridge runs
 * along the frame's x axis (OSM way/185396181, the footway over it, runs
 * at 98° / 278°). Origin: the middle of that way (135.4922437, 34.6125094).
 *
 * Identity: the high semicircle-like vermilion arch, steep at both ends,
 * with vermilion railings and bronze giboshi on the end posts; the grey
 * stone piers and beams under it, standing in the water in rows.
 *
 * Evidence:
 *  - OSM way/185396181 (反橋, footway, bridge=yes, bridge:structure=humpback,
 *    21.0 m between its ends). No bridge outline in OSM; the footway is in
 *    `replaces`, so the map's line does not draw over the arch.
 *  - published (Sumiyoshi Taisha, sumiyoshitaisha.net "grounds/highlights"):
 *    about 20 m long, 3.6 m high, 5.5 m wide, steepest about 48°; stone
 *    piers. ja.wikipedia 住吉大社: 4.4 m high; rebuilt 1981 on Keichō-era
 *    (1596-1615) stone piers and beams. The arch is a circular arc of 20 m
 *    chord meeting the banks at 48°: radius 13.5 m, rise 4.45 m (agreeing
 *    with the 4.4 m; the shrine's 3.6 m is read as the deck's height above
 *    the water's edge less the abutments).
 *  - structure (そらみみ's views from below, "Sorihashi Bridge 6"): eight rows
 *    of three stone posts with stone cross beams and pale tie beams along, the deck on them; railings
 *    ~1.0 m, posts ~1.7 m apart.
 *  - terrain (Mapterhorn z14): the DEM does not show the pond; it slopes
 *    ~0.9 m up eastward across the bridge. The arch is built with its west
 *    foot at y = 0 and its east foot 1.15 m higher (a 3.3° tilt, not
 *    visible), the piers down to y = 0. Elevation 0.
 *  - colours: vermilion #cc5a3c railings (as the halls); the arch's
 *    girders and underside near-black in the photos, drawn charcoal #4a4f57; the deck's grey-brown wood
 *    #8a7d6e, granite piers #b8b2a6, bronze giboshi #8c7a52.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Sorihashi Bridge in Sumiyoshi Grand Shrine.jpg, 3.jpg, 6.jpg, そらみみ, CC BY-SA 4.0
 *  - Sorihashi Bridge, Sumiyoshi-taisha Shrine - Oct 15, 2015.jpg, chiron3636, CC BY 2.0
 * No commercial imagery. No look-only references.
 *
 * Doubts: the deck's steps are drawn as a smooth arc; the pier rows are
 * counted from one oblique view.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { save, quadOut, type Mat } from './tokyo-meiji-jingu'
import { box } from './seoul-geunjeongjeon'
import { tube } from './osaka-castle'

function build() {
  const red = new Part(), deck = new Part(), stone = new Part(), bronze = new Part(), dark = new Part()
  const H = 10, R = H / Math.sin((48 * Math.PI) / 180), C = Math.sqrt(R * R - H * H) // chord half, radius, centre depth
  const tilt = 1.15 / 20
  const zA = (x: number) => Math.sqrt(R * R - x * x) - C + tilt * (x + H) // the deck top at x
  const W = 2.75, N = 16
  const xs = Array.from({ length: N + 1 }, (_, i) => -H + (2 * H * i) / N)
  // the deck: top surface, the vermilion side girders, the underside
  for (let i = 0; i < N; i++) {
    const a = xs[i], b = xs[i + 1], za = zA(a), zb = zA(b)
    quadOut(deck, [a, -W, za], [b, -W, zb], [b, W, zb], [a, W, za], [0, 0, 1])
    quadOut(dark, [a, -W, za - 0.7], [b, -W, zb - 0.7], [b, W, zb - 0.7], [a, W, za - 0.7], [0, 0, -1])
    for (const s of [-1, 1]) quadOut(dark, [a, s * W, za - 0.7], [b, s * W, zb - 0.7], [b, s * W, zb + 0.15], [a, s * W, za + 0.15], [0, s, 0])
  }
  for (const [x, s] of [[-H, -1], [H, 1]] as [number, number][]) quadOut(dark, [x, -W, zA(x) - 0.7], [x, W, zA(x) - 0.7], [x, W, zA(x) + 0.15], [x, -W, zA(x) + 0.15], [s, 0, 0])
  // railings: posts, a top rail and a mid rail following the arch; giboshi on the end posts
  for (const s of [-1, 1]) {
    const y = s * (W - 0.12)
    const top: V3[] = xs.map((x) => [x, y, zA(x) + 1.05]), mid: V3[] = xs.map((x) => [x, y, zA(x) + 0.55])
    tube(red, top, top.map(() => [0.09, 0.09] as [number, number]), 4)
    tube(red, mid, mid.map(() => [0.06, 0.06] as [number, number]), 4)
    for (let i = 0; i <= N; i += 2) {
      const x = xs[i]
      box(red, x - 0.11, y - 0.11, zA(x), x + 0.11, y + 0.11, zA(x) + (i === 0 || i === N ? 1.35 : 1.15), 'b')
      if (i === 0 || i === N) tube(bronze, [[x, y, zA(x) + 1.35], [x, y, zA(x) + 1.55], [x, y, zA(x) + 1.75]], [0.16, 0.18, 0.02], 8)
    }
  }
  // stone piers: rows of three posts with a beam under the deck
  const rows = [-8.1, -5.8, -3.5, -1.15, 1.15, 3.5, 5.8, 8.1]
  for (const x of rows) {
    const z = zA(x) - 0.7
    for (const y of [-1.9, 0, 1.9]) box(stone, x - 0.22, y - 0.22, 0, x + 0.22, y + 0.22, z - 0.35, 'b')
    box(stone, x - 0.25, -2.6, z - 0.35, x + 0.25, 2.6, z, '')
  }
  // the pale stone tie beams running along under the deck, at the waterline and halfway up
  for (const y of [-1.9, 1.9]) for (const z of [0.6, 1.9]) {
    const inside = rows.filter((x) => zA(x) - 1.05 > z + 0.3)
    if (inside.length > 1) box(stone, inside[0] - 0.3, y - 0.16, z, inside[inside.length - 1] + 0.3, y + 0.16, z + 0.3, '')
  }
  // abutments at the banks
  for (const x of [-H, H]) box(stone, x - (x < 0 ? 0.6 : 0), -W - 0.3, 0, x + (x > 0 ? 0.6 : 0), W + 0.3, zA(x) - 0.05, 'b')

  const parts: Mat[] = [
    { part: red, material: finish('vermilion', 0xcc5a3c) },
    { part: deck, material: finish('deck-wood', 0x8a7d6e) },
    { part: stone, material: finish('granite', 0xb8b2a6) },
    { part: bronze, material: finish('bronze', 0x8c7a52) },
    { part: dark, material: finish('charcoal', 0x4a4f57) },
  ]
  return parts
}

if (import.meta.main) {
  await save('Sorihashi, Sumiyoshi Taisha', build(), 'osaka-sumiyoshi-sorihashi.glb', 5000, 250_000, { bearing: 8, elevation: 0, height: 6.3, osm: 'way/185396181' })
}
