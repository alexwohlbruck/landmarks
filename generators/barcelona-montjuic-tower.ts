/**
 * Torre de Comunicacions de Montjuïc (Torre Calatrava), Barcelona —
 * original procedural geometry, CC0-1.0.
 * bun generators/barcelona-montjuic-tower.ts
 * (uses the shared kit in barcelona-venetian-towers.ts)
 *
 * Map frame: +x east, +y north, z up, metres. BEARING 330: the model's +y
 * points to compass 330° (north-north-west) and -y to 150°, the way the
 * trunk leans. Origin = area centroid of OSM way/163393541 (the round base,
 * radius 17 m), lng 2.150607, lat 41.364279.
 *
 * Evidence
 * - OSM way/163393541: man_made=communications_tower, height 136, colour
 *   white, architect Santiago Calatrava, 1992, wikidata Q202530 (checked:
 *   "Montjuïc Communications Tower", 41.3642 2.1506, height 136). No
 *   building ways under it.
 * - Published (Wikipedia en): 136 m; built 1989–1992 for Telefónica for
 *   the Olympic broadcasts; it represents an athlete holding the flame; the
 *   base is covered with trencadís; it works as a sundial on Plaça
 *   d'Europa.
 * - Commons photos (daylight, EVIDENCE):
 *   "Torre de comunicacions de Montjuïc 2010.jpg" (Gabriel GG., CC BY 2.0,
 *   looking WSW at the trunk side-on: the main source for the profile);
 *   "Barcelona - Montjuïc - Anella Olímpica - 1992 Summer Olympics site -
 *   View West on Torre de comunicacions de Montjuïc 1992 by Santiago
 *   Calatrava.jpg" and "... - View SW on Palau Sant Jordi & Torre de
 *   comunicacions de Montjuïc ...jpg" (Txllxt TxllxT, CC BY-SA 4.0, from
 *   the east and north-east);
 *   "204 Torre de comunicacions de Montjuïc, Esplanada Olímpica
 *   (Barcelona).jpg" (Enric, CC BY-SA 4.0, 2023, looking up at the ring).
 * - Mapterhorn terrain (terrain.ts grid, bearing 320): the esplanade is
 *   flat to within 0.6 m across the base.
 *
 * Measured on the Gabriel photo, scaled to the published 136 m (needle
 * tip): the ring at 81–95 m, about 33 m across (the same from the
 * Txllxt view from the east); the trunk meets the ring at about 88 m, some
 * 10 m to the south of the needle; the needle's lower tip at 67 m,
 * widest (about 2.8 m) at the ring. The lean: the trunk's top stands about
 * 17 m from its foot towards compass 150° (11.5° on average), solved from
 * the apparent lean in the two Txllxt photos with bearings in their titles
 * (10° seen from the east, 11° from the north-east); the needle stands
 * about 5 m south of the foot (photo from the east). The foot spreads to about
 * 7 m south-east and 10 m north-west of the axis (Gabriel photo), as the
 * flared trencadís base.
 *
 * Shapes: the trunk is a tapering lens-section tube along a gentle curve;
 * the ring is a 300° C-shaped band (a shallow conical rim, 3 m deep), open
 * towards the trunk, joined to the trunk by two arms; a brace runs from the
 * trunk's top to the needle; the needle is a spindle. All white (`trim`),
 * floodlit at night (the tower is lit all night, OSM lit=24/7).
 *
 * Doubts: the ring's tilt (drawn 10° from level, high side to the
 * north-north-west) and the exact position of the gap; the lean direction is
 * from photo bearings, not a survey. Antennas on the ring are left out.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE } from './palette'
import { tube, smoothLoft, emit, lathe } from './barcelona-venetian-towers'

const BEARING = 330
const ANCHOR = { lng: 2.150607, lat: 41.364279 }

const white: MaterialSpec = { ...PALETTE.trim, floodlight: (q, n) => (n[2] > 0.8 ? 0.4 : 0.85) }
const base: MaterialSpec = { ...PALETTE.stone, floodlight: () => 0.6 }
const body = new Part(), foot = new Part()

// Trunk: a curve from the foot to the ring, leaning to -y.
const trunk: V3[] = []
const rx: number[] = [], ry: number[] = []
const N = 16
for (let k = 0; k <= N; k++) {
  const t = k / N
  const z = 88 * t
  // gentle S: steeper at the foot, leaning more above
  const y = 2 - 17 * Math.pow(t, 1.6)
  trunk.push([0, y, z])
  rx.push(1.25 + 2.2 * Math.pow(1 - t, 3) + 0.35 * (1 - t))
  ry.push(1.9 + 6.5 * Math.pow(1 - t, 4) + 0.8 * (1 - t))
}
// tube() puts the first radius across the path's side (here y) and the second across x
tube(body, trunk, ry, 12, rx)

// The tail of the foot, sweeping to the north-west.
tube(body, [[0, 2.5, 16], [0, 6, 9], [0, 10, 4], [0, 14, 1.2], [0, 16.5, 0]], [2.2, 1.9, 1.5, 1.0, 0.6], 8, [1.8, 1.6, 1.4, 1.1, 0.7])

// Trencadís base: a low round mound under the foot (radius 9 m, 1.6 m).
lathe(foot, [[9, 0], [8.6, 0.8], [7.4, 1.4], [5.5, 1.7], [0, 1.8]], 16, 0, 1.5)

// Needle (vertical spindle) through the ring's centre.
const C: V3 = [0, -5, 88]
{
  const prof: [number, number][] = [[0.05, 67], [0.6, 72], [1.15, 80], [1.4, 88], [1.25, 96], [0.95, 106], [0.55, 118], [0.25, 128], [0.04, 136]]
  lathe(body, prof, 10, C[0], C[1])
  // close the lower tip
  lathe(body, [[0.0, 66.5], [0.05, 67]], 10, C[0], C[1])
}

// Ring: a C-shaped conical band, tilted 10° (north-west side high).
const tilt = (10 * Math.PI) / 180
const ringPt = (ang: number, r: number, dz: number): V3 => {
  const x = r * Math.cos(ang), y = r * Math.sin(ang)
  // rotate about the x axis by tilt: points at +y rise
  return [C[0] + x, C[1] + y * Math.cos(tilt), C[2] + dz + y * Math.sin(tilt)]
}
const GAP = (50 * Math.PI) / 180 // total opening, centred on -90°
const a0 = -Math.PI / 2 + GAP / 2, a1 = a0 + (2 * Math.PI - GAP)
const SEG = 30
{
  // section: outer top lip, outer bottom, inner bottom, inner top (closed loop) — swept along the C
  const sect: [number, number][] = [[16.4, 1.1], [16.6, 0.3], [16.2, -0.4], [13.4, -2.2], [13.0, -1.6], [15.6, 0.4]]
  const rings: V3[][] = []
  for (let i = 0; i <= SEG; i++) {
    const ang = a0 + ((a1 - a0) * i) / SEG
    rings.push(sect.map(([r, dz]) => ringPt(ang, r, dz)))
  }
  // loft across the section (each "ring" here is a section; treat sections as the loft rings)
  smoothLoft(body, rings)
  // end caps
  for (const [k, flip] of [[0, true], [SEG, false]] as [number, boolean][]) {
    const s = rings[k], c = s.reduce((a, b) => [a[0] + b[0] / s.length, a[1] + b[1] / s.length, a[2] + b[2] / s.length] as V3, [0, 0, 0] as V3)
    for (let i = 0; i < s.length; i++) {
      const j = (i + 1) % s.length
      if (flip) body.tri(c, s[i], s[j])
      else body.tri(c, s[j], s[i])
    }
  }
}

// Arms from the trunk's top to both ends of the C, and the brace to the needle.
const T = trunk[trunk.length - 1]
const e0 = ringPt(a0, 14.8, -0.4), e1 = ringPt(a1, 14.8, -0.4)
tube(body, [T, [(T[0] + e0[0]) / 2, (T[1] + e0[1]) / 2, (T[2] + e0[2]) / 2 + 0.6], e0], [1.2, 1.0, 0.8], 8)
tube(body, [T, [(T[0] + e1[0]) / 2, (T[1] + e1[1]) / 2, (T[2] + e1[2]) / 2 + 0.6], e1], [1.2, 1.0, 0.8], 8)
tube(body, [[T[0], T[1], T[2] - 0.5], [0, (T[1] + C[1]) / 2, 92.5], [C[0], C[1] - 0.8, 97]], [1.0, 0.8, 0.6], 8)
// a short cap over the trunk's top joint
tube(body, [[T[0], T[1] + 0.5, T[2] - 3], [T[0], T[1] - 0.4, T[2] + 1.2]], [1.5, 1.2], 10, [2.0, 1.4])

// The foot's tilted end rings dip a little below the ground: flatten them onto y = 0 (glTF y is index 1).
for (const part of [body, foot]) for (let i = 1; i < part.pos.length; i += 3) part.pos[i] = Math.max(0, part.pos[i])

await emit('barcelona-montjuic-tower', 'Torre de Comunicacions de Montjuïc', [
  { part: body, material: white },
  { part: foot, material: base },
], { bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 136, replaces: ['way/163393541'] })
