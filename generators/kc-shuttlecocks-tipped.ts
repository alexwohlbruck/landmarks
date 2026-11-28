/**
 * Shuttlecocks (Claes Oldenburg and Coosje van Bruggen, 1994): the one that
 * lies on its side on the far south lawn of the Nelson-Atkins Museum of
 * Art, Kansas City — original procedural geometry, CC0-1.0.
 * bun generators/kc-shuttlecocks-tipped.ts
 *
 * The same shuttlecock as `kc-shuttlecocks.ts` (whose header records every
 * source and measurement), tipped over: it leans on its nose with the crown
 * raised, 50 degrees from upright (estimated from the photos below).
 * Map frame: x east, y north, z up, metres; the nose points to +y, so the
 * placement's bearing is the compass heading of the nose. Origin under the
 * middle of its footprint, z = 0 on the grass.
 *
 * Evidence for the pose: Debbie_Long, "Nelson-Atkins", CC BY 2.0,
 * https://www.flickr.com/photos/98602044@N05/11957247344 (from the south,
 * the tipped one in front, an upright one and the museum behind); danxoneil,
 * "Shuttlecocks @ Nelson-Atkins Museum of Art", CC BY 2.0 (the openverse
 * set, https://www.flickr.com/photos/36521980095@N01/), and USGS NAIP for
 * the nose's heading (south-south-west).
 */
import { shuttlecock, transform, minZ, maxZ, build, type V3 } from './kc-shuttlecocks'

const { white, orange } = shuttlecock()

// Tip the axis from +z toward -y (the nose swings to +y). It is not lying
// flat: it leans on its nose with the crown held high, its axis about 40
// degrees above the grass in danxoneil's side-on photo and Debbie_Long's
// view from the south. So 50 degrees from upright, standing on its nose.
const rotX = (t: number) => (v: V3): V3 => [v[0], v[1] * Math.cos(t) - v[2] * Math.sin(t), v[1] * Math.sin(t) + v[2] * Math.cos(t)]
const theta = 50 * Math.PI / 180
const r = rotX(theta)
transform(white, r, r)
transform(orange, r, r)
// Centre the footprint on the origin and stand it on z = 0.
let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity
for (const p of [white, orange])
  for (let i = 0; i < p.pos.length; i += 3) {
    x0 = Math.min(x0, p.pos[i]); x1 = Math.max(x1, p.pos[i])
    y0 = Math.min(y0, -p.pos[i + 2]); y1 = Math.max(y1, -p.pos[i + 2])
  }
const z0 = Math.min(minZ(white), minZ(orange))
const shift = (p: V3): V3 => [p[0] - (x0 + x1) / 2, p[1] - (y0 + y1) / 2, p[2] - z0]
transform(white, shift, (v) => v)
transform(orange, shift, (v) => v)
console.log(`tipped ${(theta * 180 / Math.PI).toFixed(1)} deg from upright; ${(x1 - x0).toFixed(2)} x ${(y1 - y0).toFixed(2)} m`)
await build('kc-shuttlecocks-tipped', 'Shuttlecocks (tipped)', white, orange, { height: Math.max(maxZ(white), maxZ(orange)) })
