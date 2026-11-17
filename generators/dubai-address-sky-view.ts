/**
 * Address Sky View, Dubai — original procedural geometry, CC0-1.0.
 * bun generators/dubai-address-sky-view.ts   (imports the kit from dubai-address-downtown.ts)
 *
 * Twin towers (SOM, completed 2019) joined near the top by the cantilevered
 * Sky Views bridge, on a shared podium. One model covers both towers, the
 * bridge, the deck beyond Tower 2 and the podium.
 *
 * Frame: map frame, x east, y north, z up, metres, turned to BEARING 54 (the
 * line through both towers), origin at the centroid of the site outline
 * way/1041684723.
 *
 * Evidence
 * - OSM: way/723558047 "The Address - Sky View Tower 1" (264 m, 60 levels);
 *   way/723558400 "Tower 2" (236 m, 55 levels); bridge part way/723558399
 *   (195-220 m, levels 49-54); deck part way/934665040 (212-220 m) wrapping
 *   Tower 2's NE end and cantilevering ~22 m past it; Tower 1's crown parts
 *   way/946921563-570 (264, 257, 251, 246, 241, 236, 231, 226 m, stepping down
 *   from the far SW end towards the bridge); Tower 2's crown parts
 *   way/934420757 (221), 934420755 (228 ring), 934420756 (236 core); podium
 *   parts way/1099630420 (10 m), 1099630421 (15 m drum), 1099630422 (20 m
 *   glass link between the towers' feet), 1099630423/424 (thin canopies at
 *   19.7-19.9 m, not drawn); site outline way/1041684723 (height tag 264).
 * - Published (as given in the batch assignment): Tower 2 236 m; OSM tags
 *   SOM as architect and 2019 as the start date. Tower 1's 264 m is OSM's.
 * - Photos (all CC BY-SA 4.0, Leon petrosyan, 2020, from the Burj Khalifa, SE
 *   of the towers, high; shared in SCRATCH/work/views by another builder):
 *   v4 "Burdg el Khalifa 20.jpg", https://commons.wikimedia.org/wiki/File:Burdg_el_Khalifa_20.jpg
 *     (both towers, the bridge and pool deck, the cantilever, both crowns);
 *   v5 "Burg ek Khalifa 23.jpg", https://commons.wikimedia.org/wiki/File:Burg_ek_Khalifa_23.jpg
 *     (whole complex with the podium; the shafts swell from a slimmer foot);
 *   v8 "Burg el Khalifa 25.jpg", https://commons.wikimedia.org/wiki/File:Burg_el_Khalifa_25.jpg
 *     (Tower 2's banded shaft and ringed crown, close).
 * - No lidar or aerial imagery covers the UAE in the allowed sources; the map
 *   terrain (Mapterhorn) has no tiles here, so the ground could not be
 *   checked. The site is flat; elevation 0.
 *
 * Numbers
 * - All heights: OSM tags (above), matching the published 264/236 m.
 * - Plans: superellipses (power 2.6) fitted to the OSM outlines' extents; the
 *   crown steps of Tower 1 are that plan shortened from the bridge end to the
 *   OSM step lengths (48.2 m for the 264 m part, interpolated between).
 *   Tower 2's ring and core are ovals fitted to OSM 934420755/756.
 * - Bridge plan: the towers' width (x -14.6..11.6, OSM 723558399), run 13 m
 *   into each tower so it meets their round ends.
 * - The foot: the shafts are 0.9 of their OSM width at the podium, swelling
 *   to full width by ~80 m - estimated from v4/v5.
 * - Facade: glass in three-floor groups (13.2 m) between 2.6 m silver bands,
 *   standing for the towers' horizontal fins.
 * - Bevels 0.5-0.8 m on the podium, tops, crown steps, bridge and deck.
 * Look-only references: none.
 * Doubts: every licensed photo is from the Burj Khalifa side (SE); no licensed
 * photo shows the NW faces or the towers from street level (the UAE has no
 * freedom of panorama, and the CC0 Commons file "Address Sky View Hotel 1.jpg"
 * found by Openverse has been deleted). The pool on the bridge roof, the glass
 * slide and the podium's pools and gardens are not drawn. The two canopy
 * parts are replaced but not drawn (thin).
 */
import { Part } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { type V2, block, ccw, chamfer, fill, oval, walls, writeModel } from './dubai-address-downtown'

const ID = 'dubai-address-sky-view'
const ANCHOR = { lng: 55.2706598, lat: 25.2014355 } // centroid of the site outline way/1041684723
const BEARING = 54 // the line through both towers (Tower 1 SW, Tower 2 NE)

// OSM outlines in the model frame (metres; +y runs from Tower 1 to Tower 2).
const PODIUM: V2[] = [[69.5, -45.8], [68.5, -43.4], [63.9, -32.4], [52.7, -22.3], [43.4, -11.3], [36.5, -0.4], [30.6, 13.1], [26.6, 26.8], [24.1, 33.7], [22.6, 41.4], [21.2, 48.1], [19.3, 55.1], [16.1, 64.4], [13.0, 73.7], [10.9, 78.5], [8.9, 83.1], [5.4, 87.0], [-0.0, 91.7], [-3.1, 93.2], [-7.0, 95.1], [-9.4, 95.5], [-13.1, 96.3], [-22.9, 95.0], [-31.2, 90.9], [-38.8, 84.8], [-47.8, 74.9], [-54.1, 61.7], [-54.3, 45.5], [-26.8, -50.0], [-10.8, -97.9], [-3.8, -95.0], [8.5, -86.3], [30.0, -74.5], [42.9, -69.6], [52.6, -67.5], [63.9, -61.1], [68.8, -54.4]] // way/1099630420, 10 m
const DRUM: V2[] = [[58.1, -43.1], [58.2, -38.7], [56.1, -34.2], [52.7, -31.3], [49.0, -29.9], [45.7, -29.6], [42.5, -29.9], [39.5, -30.7], [36.5, -32.7], [34.6, -35.5], [33.1, -39.9], [33.6, -43.7], [35.4, -46.5], [38.3, -49.1], [41.6, -50.5], [44.5, -51.2], [47.7, -51.5], [51.5, -50.4], [55.7, -47.7]] // way/1099630421, 15 m
const LINK: V2[] = [[6.4, -17.0], [5.5, -11.2], [4.9, -5.6], [4.6, 0.2], [4.7, 7.8], [5.0, 15.0], [5.5, 23.2], [3.1, 19.4], [-0.1, 17.5], [-4.3, 17.0], [-7.8, 18.4], [-11.2, 21.0], [-9.9, 15.4], [-9.2, 8.0], [-9.0, -0.0], [-9.5, -7.0], [-10.2, -13.5], [-11.0, -18.9], [-9.1, -16.6], [-6.9, -14.8], [-3.7, -13.4], [-1.2, -13.3], [1.2, -13.7], [3.8, -15.0]] // way/1099630422, 20 m glass
const DECK: V2[] = [[9.1, 68.2], [7.1, 80.5], [5.4, 87.0], [4.4, 91.0], [1.7, 98.6], [-1.8, 102.1], [-4.6, 103.0], [-7.1, 101.1], [-9.0, 96.9], [-9.4, 95.5], [-11.5, 88.4], [-13.1, 78.0], [-13.7, 68.3], [-12.1, 72.3], [-10.2, 75.6], [-8.2, 78.1], [-7.6, 84.1], [-6.4, 91.0], [-5.8, 92.1], [-4.9, 93.1], [-3.3, 93.1], [-2.1, 92.6], [-1.2, 91.7], [0.2, 89.1], [1.5, 84.4], [3.2, 78.1], [4.9, 76.7], [7.0, 73.9]] // way/934665040, 212-220 m

// Tower plans: superellipses fitted to the OSM outlines (way/723558047 30.6 x 65.2 m; way/723558400 26.9 x 63.4 m).
const T1 = { c: [-2.2, -45.9] as V2, a: 15.3, b: 32.6 }
const T2 = { c: [-2.75, 48.7] as V2, a: 13.45, b: 31.7 }
const SE = 2.6 // superellipse power: flat long sides, round ends
const N = 24

const H = {
  t1: 264, // OSM way/723558047 and part 946921563 (published 264 m)
  t1Steps: [264, 257, 251, 246, 241, 236, 231, 226], // OSM parts 946921563..946921570, far end to bridge end
  t2Body: 221, // OSM part 934420757
  t2Ring: 228, // OSM part 934420755
  t2Core: 236, // OSM parts 934420756 / way/723558400 (published 236 m)
  bridge0: 195, bridge1: 220, // OSM part 723558399
  deck0: 212, deck1: 220, // OSM part 934665040: the cantilever beyond Tower 2
  podium: 10, drum: 15, link: 20, // OSM parts 1099630420-422
  pitch: 13.2, band: 2.6, // three floors to a facade group
}

function build() {
  const glass = new Part(), silver = new Part(), roof = new Part(), stone = new Part(), link = new Part()

  // The shafts swell from a slimmer foot over the first ~70 m (photos v4, v5).
  const foot = (z: number) => { const t = Math.max(0, Math.min(1, (z - H.podium) / 70)); return 0.9 + 0.1 * (1 - (1 - t) * (1 - t)) }
  const scaled = (p: V2[], c: V2, z: number): V2[] => p.map(([x, y]) => [c[0] + (x - c[0]) * foot(z), c[1] + (y - c[1]) * (0.5 + 0.5 * foot(z))] as V2)
  const banded = (p: V2[], c: V2, z0: number, z1: number) => {
    let z = z0
    const seg = (part: Part, a: number, b: number) => {
      // split long glass runs where the foot is still swelling
      const cuts = [a]; for (let q = a + 9; q < b - 1 && q < H.podium + 70; q += 9) cuts.push(q); cuts.push(b)
      for (let k = 0; k < cuts.length - 1; k++) walls(part, scaled(p, c, cuts[k]), cuts[k], scaled(p, c, cuts[k + 1]), cuts[k + 1])
    }
    while (z + H.pitch <= z1 + 0.1) {
      seg(glass, z, z + H.pitch - H.band)
      seg(silver, z + H.pitch - H.band, z + H.pitch)
      z += H.pitch
    }
    if (z < z1 - 0.1) seg(glass, z, z1)
  }

  // --- Podium, drum and the glass link between the towers' feet. ---
  block(stone, ccw(PODIUM), 0, H.podium, { bev: 0.6, topPart: roof })
  block(stone, ccw(DRUM), 0, H.drum, { bev: 0.6, topPart: roof, smooth: 50 })
  block(link, ccw(LINK), 0, H.link, { bev: 0.5, bevPart: silver, topPart: roof })

  // --- Tower 1: banded shaft, then the crown stepping down towards the bridge. ---
  const p1 = oval(T1.c, T1.a, T1.b, N, SE)
  const y1Far = T1.c[1] - T1.b // the far (SW) end, where the crown is highest
  const steps = [...H.t1Steps].reverse() // 226 .. 264
  const zTop1 = steps[0]
  banded(p1, T1.c, H.podium, zTop1 - 2)
  block(silver, p1, zTop1 - 2, zTop1, { bev: 0.6, topPart: roof })
  // Each step: the plan pulled back from the bridge end towards the far end.
  const L1 = 2 * T1.b, L264 = 48.2 // OSM: the 264 m part runs 48.2 m from the far end
  for (let k = 1; k < steps.length; k++) {
    const len = L1 - ((L1 - L264) * k) / (steps.length - 1)
    const s = len / L1
    const p = oval([T1.c[0], y1Far + len / 2], T1.a * (1 - 0.012 * k), T1.b * s, N, SE)
    const z0 = steps[k - 1], z1 = steps[k]
    block(k % 2 ? glass : silver, p, z0, z1, { bev: 0.7, bevPart: silver, topPart: roof })
  }

  // --- Tower 2: banded shaft, a ring to 228 and the core to 236. ---
  const p2 = oval(T2.c, T2.a, T2.b, N, SE)
  banded(p2, T2.c, H.podium, H.t2Body - 2)
  block(silver, p2, H.t2Body - 2, H.t2Body, { bev: 0.6, topPart: roof })
  block(glass, oval([-4.0, 49.6], 10.2, 25.6, N, SE), H.t2Body, H.t2Ring, { bev: 0.6, bevPart: silver, topPart: roof })
  block(silver, oval([-6.0, 50.3], 7.6, 16.5, 20, SE), H.t2Ring, H.t2Core, { bev: 0.7, topPart: roof })

  // --- The sky bridge between them, and the cantilevered deck beyond Tower 2. ---
  const br = chamfer([[-14.6, -26], [11.6, -26], [11.6, 27], [-14.6, 27]], 1.2)
  block(glass, br, H.bridge0 + 3, H.bridge1 - 3.2, { bev: 0, top: false })
  block(silver, br, H.bridge0, H.bridge0 + 3, { bev: 0, botBev: 0.8, top: false, bottom: true })
  block(silver, br, H.bridge1 - 3.2, H.bridge1, { bev: 0.7, topPart: roof })
  block(silver, ccw(DECK), H.deck0, H.deck1, { bev: 0.5, botBev: 0.5, bottom: true, topPart: roof })

  const mats: Swatch[] = [
    { name: 'window', color: 0x8a99a4, roughness: 0.3 },
    finish('silver-fins', 0xc3cacf, 0.5),
    PALETTE.roof,
    PALETTE.stone,
    PALETTE.glass,
  ]
  return [glass, silver, roof, stone, link].map((part, i) => ({ part, material: mats[i] }))
}

if (import.meta.main) {
  await writeModel(ID, 'Address Sky View', build(), {
    bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: H.t1,
    replaces: [
      'way/1041684723', 'way/723558047', 'way/723558400', 'way/723558399', 'way/934665040',
      'way/934420755', 'way/934420756', 'way/934420757',
      'way/946921563', 'way/946921564', 'way/946921565', 'way/946921566', 'way/946921567', 'way/946921568', 'way/946921569', 'way/946921570',
      'way/1099630420', 'way/1099630421', 'way/1099630422', 'way/1099630423', 'way/1099630424',
    ],
  }, 6500)
}
