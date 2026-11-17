/**
 * George Bush Intercontinental Airport (IAH) air traffic control tower,
 * Houston — procedural, CC0-1.0, no textures.
 *   bun generators/hou-iah-control-tower.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 350: OSM way/639097416 is a regular octagon with a corner pointing
 * 10° west of north, and the model's octagons have a corner on +y. Anchor:
 * that octagon's centroid (-95.32812, 29.98419).
 *
 * Identifying features (photos): a tall, plain shaft of tan precast
 * concrete, a regular octagon in plan, which flares out like a trumpet in
 * its top fifth; on it a glazed junction storey with a railing, a pale
 * octagonal overhang with sloped edges, and the cab: eight panes of dark
 * glass leaning outward under a dark roof band, with a white radome on a
 * small drum on top. A low tan one-storey base building stands at its west
 * foot; OSM doesn't map it and it is not modelled.
 *
 * Evidence
 * - OSM way/639097416 (aeroway=tower, building=control_tower,
 *   height=102.4 m): the outline is the overhang, a regular octagon of
 *   circumradius 10.5 m (19.4 m across flats).
 * - Lidar: USGS 3DEP TX_Coastal_B1_2018 (flown 2018), 0.5 m grid
 *   (work/hou-iah-control-tower/lidar.json): overhang edge 90–92 m over a
 *   21 m octagon, cab roof 98–99 m, radome top 102.4 m above the ground
 *   (25.6 m NAVD88), matching the OSM height. Base building 5 m high to the
 *   west. The shaft is hidden from the lidar under the cab.
 * - Photos:
 *   t1 https://commons.wikimedia.org/wiki/File:KIAH_Tower.jpg
 *      (PSE02 at en.wikipedia, public domain, 2007): the top 40 m face on;
 *      the octagon, the flare, junction storey, overhang, cab and radome.
 *   t2 https://commons.wikimedia.org/wiki/File:Patio_de_operaciones_y_torre_del_control_del_IAH.jpg
 *      (Oficial K, CC BY-SA 4.0, 2026): the whole tower from the apron.
 *   t3 https://www.flickr.com/photos/12734746@N00/398750162
 *      (hyku, CC BY 2.0): the whole tower, the colour of the concrete.
 *   t5 https://www.flickr.com/photos/32345848@N07/31899271857
 *      (Patrick Feller, CC BY 2.0, 2019): the whole tower and its base
 *      building from a terminal roof; the shaft is straight to the ground.
 *
 * Numbers
 * - Measured (lidar, OSM): overhang 19.4 m across flats, top at 92 m;
 *   cab roof 98.5 m; total 102.4 m.
 * - Estimated from t1, scaled by the overhang (190 px = 21 m, so about
 *   0.113 m/px) and the lidar heights: shaft 14.7 m across flats; flare
 *   from 71 m to 85.2 m, out to 19 m; junction storey 85.2–88.6 m;
 *   overhang 88.6–92 m; overhang top sloping up to the cab; cab glass
 *   92.8–98.2 m, 12.4 m across flats at the sill and 13.8 m at the head;
 *   roof band to 99.6 m; radome 5.2 m across.
 * - Colours from t1/t3: tan concrete pulled to the palette's lightness;
 *   pale overhang; dark cab glass (`window`, lit at night as cabs are).
 *
 * Doubts: no published height breakdown; the junction storey's glazing and
 * the cab's mullions are left out. Antennas and railings are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel } from './nyc-570-lexington'

const conc = new Part(), win = new Part(), pale = new Part(), dark = new Part(), dome = new Part()

/** A regular octagon, `flats` across flats, a corner on +y, counter-clockwise from above. */
const oct = (flats: number, z: number): V3[] => {
  const R = flats / 2 / Math.cos(Math.PI / 8)
  return Array.from({ length: 8 }, (_, k) => {
    const t = Math.PI / 2 + (k * Math.PI) / 4
    return [R * Math.cos(t), R * Math.sin(t), z] as V3
  })
}
const ring = (p: Part, f0: number, z0: number, f1: number, z1: number) => p.loft([oct(f0, z0), oct(f1, z1)])

// ---------------------------------------------------------------- the shaft and its flare
const SHAFT = 14.7, FLARE0 = 71, FLARE1 = 85.2, FLARE_W = 19.2
const prof: [number, number][] = []
for (let i = 0; i <= 6; i++) {
  const t = i / 6
  // concave trumpet: slow at first, widening fast near the top
  prof.push([SHAFT + (FLARE_W - SHAFT) * t * t, FLARE0 + (FLARE1 - FLARE0) * t])
}
conc.loft([oct(SHAFT, 0), ...prof.map(([f, z]) => oct(f, z))])
// a thin pale lip on top of the flare
ring(pale, FLARE_W, FLARE1, FLARE_W + 0.4, FLARE1 + 0.3)
pale.loft([oct(FLARE_W + 0.4, FLARE1 + 0.3), oct(FLARE_W - 0.8, FLARE1 + 0.3)])

// ---------------------------------------------------------------- junction storey
ring(win, 18.2, FLARE1 + 0.3, 18.2, 88.6)

// ---------------------------------------------------------------- overhang
ring(pale, 18.0, 88.6, 19.4, 89.4)
ring(pale, 19.4, 89.4, 19.4, 90.8)
ring(pale, 19.4, 90.8, 15.6, 92.3) // the sloped top of the overhang
dark.cap(oct(18.0, 88.6), false)
pale.cap(oct(15.6, 92.3), true)

// ---------------------------------------------------------------- the cab
ring(dark, 12.4, 92.3, 12.4, 92.8) // sill
ring(win, 12.4, 92.8, 13.8, 98.2) // glass leaning out
ring(dark, 13.8, 98.2, 14.0, 99.6) // roof band
dark.cap(oct(14.0, 99.6), true)
// radome on a small drum
ring(dark, 4.4, 99.6, 4.4, 100.3)
{
  const segs = 12, R = 2.6, z0 = 100.3, h = 2.1
  const dr = (s: number, z: number): V3[] => Array.from({ length: segs }, (_, k) => {
    const t = (k / segs) * 2 * Math.PI
    return [s * Math.cos(t), s * Math.sin(t), z] as V3
  })
  const rings: V3[][] = [dr(R, z0)]
  for (let i = 1; i <= 4; i++) {
    const a = (i / 4) * (Math.PI / 2) * 0.92
    rings.push(dr(R * Math.cos(a), z0 + h * Math.sin(a) / Math.sin(Math.PI / 2 * 0.92)))
  }
  dome.loft(rings)
  dome.cap(rings[rings.length - 1], true)
  dome.cap(rings[0], false)
}

finishModel('George Bush Intercontinental Airport Control Tower', 'hou-iah-control-tower', [
  { part: conc, material: finish('iah-tower-concrete', 0xd9bea2) },
  { part: win, material: PALETTE.window },
  { part: pale, material: PALETTE.trim },
  { part: dark, material: finish('iah-cab-dark', 0x4a4f57) },
  { part: dome, material: finish('iah-radome', 0xf4f1ea) },
], { bearing: 350, elevation: 0, height: 102.4, replaces: ['way/639097416'] })
