/**
 * The Seaholm Power Plant (1950-51, Art Moderne, City of Austin; converted
 * to offices and shops 2015), 800 West Cesar Chavez Street, Austin —
 * procedural, CC0-1.0, no textures.
 *   bun generators/atx-seaholm-power-plant.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 18, the plant's own
 * axis, so +x runs along the turbine hall to the east-south-east, -x is the
 * west end with the entrance and the "CITY of AUSTIN POWER PLANT" sign, -y
 * the long south face over Cesar Chavez Street. Anchor = area centroid of
 * OSM way/352112927, -97.752625, 30.266572. z = 0 is the lowest ground
 * under the footprint, the sidewalk at the west entrance (lidar ground
 * 4.4 m over the box's minimum; the map's terrain agrees). The ground
 * round the other sides is higher: +3.6 on the south, +4.9 on the north
 * and east (lidar), so those walls run down into it.
 *
 * Identity: a long, flat-topped hall of pale board-formed concrete with a
 * plain parapet; a lower wing along its south side and a broader one on
 * its north; at the west end the hall's tall blank end wall carrying the
 * big maroon Art Deco letters CITY of AUSTIN / POWER PLANT (lit red at
 * night) over a low podium with the glazed entrance and steps; rows of
 * punched windows high on the long walls.
 *
 * Famous-sign exception (STYLE.md): the lettering is the landmark's best
 * known feature, so it is drawn, traced from "sign" (square on): heavy
 * geometric Deco capitals, the A a solid triangle without a crossbar, the
 * "of" small, the strokes about 0.3 of the cap height; built with
 * generators/lettering.ts.
 *
 * Numbers (lidar = USGS 3DEP USGS_LPC_TX_Central_B1_2017_LAS_2019, flown
 * 2017, 1 m grid read in this frame; heights over the base):
 *  - the hall x -40.3..41.6 (OSM), y -18..4.5: roof 20.0, parapet 21.2
 *    (lidar 24.1-24.8 and 25.7 at the edges, less 4.4);
 *  - the south wing y -25.6..-18: roof 15.0, parapet 15.8 (lidar 19.3-20.2);
 *  - the north wing y 4.5..24.5, x -35.7..37.4: 16.6 (lidar 19.2-21.6;
 *    one roof for the two levels it shows);
 *  - the north-west corner pieces x -41.2..-23.5, y 12..32.3: 9.3 (lidar
 *    13.4-13.9); the white steel frame of the chilled-water plant standing
 *    on them to 27 m (lidar 31.4; "patterson", "vue");
 *  - the east annex x 41.6..47, y -9.6..4.2: 10.3 (lidar 14.5-15.1);
 *  - the entrance podium x -44.5..-40.3, y -18..9: 6.1 (lidar 10.5), with
 *    its glazed entrance and steps ("vue");
 *  - the letters: cap height 1.31 m, lines at 2.35 m pitch, the top line
 *    16.6 m long, centred on the end wall, 2.3 m under the parapet: scaled
 *    from "sign" and "vue" (20 px a metre on the 22.5 m end wall);
 *  - window rows: on the hall's south face at 16.5-18.5, 1.4 m wide at
 *    3.4 m centres; on the south wing in pairs at 9.4-12.6 ("moore13");
 *    the north and east faces are not photographed and repeat the south
 *    pattern;
 *  - colours from "moore13" (sun): concrete #cbc1a3 -> #ddd3bc, letters
 *    #5b1f1b -> #8a3530 (pulled lighter; dark red is the sign's identity).
 *  - Night: the letters glow red (`neon-seaholm`, "night", "spawn2"); the
 *    west end is floodlit.
 *
 * Photos (Wikimedia Commons and Flickr, EVIDENCE):
 *  moore13   "Seaholm power plant austin 2013.jpg", Larry D. Moore, CC BY 4.0
 *            https://commons.wikimedia.org/wiki/File:Seaholm_power_plant_austin_2013.jpg
 *  vue       "City of Austin TX Power Plant.jpg", Vuemobi Media, CC BY-SA 4.0
 *            https://commons.wikimedia.org/wiki/File:City_of_Austin_TX_Power_Plant.jpg
 *  sign      "Seaholm plant sign.jpg", robzand, CC BY-SA 2.0
 *            https://commons.wikimedia.org/wiki/File:Seaholm_plant_sign.jpg
 *  patterson "Old Austin Power Plant", Tim Patterson, CC BY-SA 2.0 (Flickr)
 *            https://www.flickr.com/photos/72248790@N00/2056189776
 *  spawn2    "Seaholm Power Plant 20160904211410.jpg", Spawnzilla, CC BY-SA 4.0
 *            https://commons.wikimedia.org/wiki/File:Seaholm_Power_Plant_20160904211410.jpg
 *  night     "Red. The Seaholm Power Plant in Austin, Texas. - Flickr - Night
 *            Photo.jpg", Maxx@night, CC BY 2.0
 *            https://commons.wikimedia.org/wiki/File:Red._The_Seaholm_Power_Plant_in_Austin,_Texas._-_Flickr_-_Night_Photo.jpg
 * Look-only (CC BY-NC-ND, not used to shape anything): atmtx "Seaholm
 * Windows" and others on Flickr. Also OSM (ODbL) and the lidar. No
 * commercial imagery.
 *
 * Replaces way/352112927.
 *
 * Doubts: no licensed photo of the north side or the east end, so their
 * windows repeat the south pattern. The brief mentions tall glass strips
 * between fluted piers; no licensed photo shows them (the south face in
 * "moore13" has punched windows only), so they are not drawn. The steel
 * frame is simplified to posts and three decks; the white stacks north of
 * the building (outside the outline) are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, save, type XY } from './atl-flatiron-building'
import { flush } from './atx-governors-mansion'
import { Pen, strokes } from './lettering'

const conc = new Part(), trim = new Part(), roof = new Part(), win = new Part(), neon = new Part(), door = new Part()

const XW = -40.3, XE = 41.6
const GS = 3.6, GN = 4.9 // the ground on the south and on the north and east, over the base

// ── the masses: walls, a bevelled parapet, the roof inside it ──
function block(x0: number, x1: number, y0: number, y1: number, top: number, para = 0.8) {
  box(conc, x0, x1, y0, y1, 0, top - para, null, 0)
  box(conc, x0, x1, y0, y1, top - para, top, null, 0.2)
  box(roof, x0 + 0.35, x1 - 0.35, y0 + 0.35, y1 - 0.35, top - para, top - para + 0.25, roof, 0)
}
block(XW, XE, -18, 4.5, 21.2, 1.2) // the hall
block(XW, XE, -25.6, -18, 15.8) // the south wing
block(-35.7, 37.4, 4.5, 24.5, 17.2) // the north wing
block(-41.2, -35.7, 12, 31.1, 9.3, 0.6) // the north-west pieces
block(-36.8, -23.5, 24.5, 32.3, 9.3, 0.6)
block(XE, 47.0, -9.6, 4.2, 10.3, 0.6) // the east annex
// the entrance podium on the west, its ledge over the doors
box(conc, -44.5, XW, -18, 9, 0, 6.1, roof, 0.2)
box(conc, -45.4, -44.5, -12.5, -1.0, 4.0, 4.6, conc, 0.1, true) // the canopy over the doors

// ── the white steel frame of the chilled-water plant on the north-west corner ──
{
  const X0 = -36, X1 = -24, Y0 = 13, Y1 = 31, B = 9.3, T = 27.0
  for (const x of [X0, (X0 + X1) / 2, X1]) for (const y of [Y0, (Y0 + Y1) / 2, Y1]) box(trim, x - 0.35, x + 0.35, y - 0.35, y + 0.35, B, T, trim, 0.08)
  for (const z of [15.5, 21.0, T]) box(trim, X0 - 0.4, X1 + 0.4, Y0 - 0.4, Y1 + 0.4, z - 0.45, z, trim, 0.08, true)
  // the plant inside it: a grey tank
  box(roof, X0 + 1.5, X1 - 1.5, Y0 + 2, Y1 - 2, B, 19.5, roof, 0.6)
}

// ── the windows ──
/** A row of windows on face a→b (outside to the right), `w` wide at `pitch` centres, from z0 to z1. */
function row(a: XY, b: XY, z0: number, z1: number, w: number, pitch: number, margin = 2.5, pair = 0) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.floor((L - 2 * margin) / pitch)
  const s0 = (L - n * pitch) / 2 + pitch / 2
  for (let k = 0; k < n; k++) {
    const s = s0 + k * pitch
    if (pair) for (const d of [-pair / 2, pair / 2]) flush(win, a, b, s + d - w / 2, s + d + w / 2, z0, z1, 0.06)
    else flush(win, a, b, s - w / 2, s + w / 2, z0, z1, 0.06)
  }
}
// south ("moore13"): the hall's high row over the wing, the wing's pairs
row([XW, -18], [XE, -18], 16.5, 18.5, 1.4, 3.4)
row([XW, -25.6], [XE, -25.6], GS + 5.8, GS + 9.0, 0.9, 6.8, 3, 1.6)
// north (not photographed: the same pattern)
row([XE, 4.5], [37.4, 4.5], 17.6, 19.4, 1.4, 3.4, 0.8)
row([-35.7, 4.5], [XW, 4.5], 17.6, 19.4, 1.4, 3.4, 0.8)
row([37.4, 24.5], [-23.5, 24.5], GN + 5.6, GN + 9.4, 0.9, 6.8, 3, 1.6)
// the hall's long walls over the north wing, and the east end
row([XE, 4.5], [XE, -18], 14.0, 18.5, 1.4, 4.0, 3)
row([XE, -18], [XE, -25.6], GS + 5.8, GS + 9.0, 0.9, 3.2, 1.5)
// the west end ("vue"): two big glazed panels either side of the entrance over the podium, and the doors
flush(win, [XW, 4.5], [XW, -18], 1.5, 6.0, 6.8, 9.6, 0.06)
flush(win, [XW, 4.5], [XW, -18], 16.5, 21.0, 6.8, 9.6, 0.06)
flush(door, [-44.5, -1.0], [-44.5, -12.5], 0.6, 10.9, 1.7, 4.0, 0.06)
for (const y of [-16.5, 6.5]) flush(win, [-44.5, y + 1.5], [-44.5, y - 1.5], 0, 3, 1.7, 4.0, 0.06)
// the steps up to the doors (the lowest is in the sidewalk the map draws)
for (let k = 1; k < 5; k++) box(conc, -44.5 - 0.4 * (5 - k), -44.5, -15 + k * 0.2, 1.5 - k * 0.2, 0, 0.34 * (k + 1), conc, 0)

// ── CITY of AUSTIN / POWER PLANT ──
// Letter boxes in px from "sign" (cap height 70 px): [char, left, right, small].
type Glyph = [string, number, number, boolean?]
const LINE1: Glyph[] = [['C', 25, 85], ['I', 118, 140], ['T', 168, 228], ['Y', 252, 320], ['o', 362, 412, true], ['F', 428, 462, true], ['A', 512, 568], ['U', 585, 640], ['S', 660, 718], ['T', 745, 795], ['I', 815, 840], ['N', 860, 915]]
const LINE2: Glyph[] = [['P', 72, 130], ['O', 152, 222], ['W', 240, 330], ['E', 352, 397], ['R', 423, 482], ['P', 548, 600], ['L', 620, 665], ['A', 680, 735], ['N', 755, 810], ['T', 830, 880]]
const CAP = 70, SW = 0.3 // stroke width in cap units
function glyph(ch: string, l: number, r: number, small = false): Pen {
  const p = new Pen(), h = SW / 2
  const x0 = l / CAP + h, x1 = r / CAP - h, xm = (x0 + x1) / 2, top = (small ? 0.72 : 1) - h, bot = h
  const H = top - bot
  switch (ch) {
    case 'C': {
      const rx = (x1 - x0) / 2, ry = H / 2, cy = bot + ry
      p.moveTo([xm + rx * Math.cos(0.75), cy + ry * Math.sin(0.75)])
      for (let k = 1; k <= 12; k++) { const t = 0.75 + (k / 12) * (2 * Math.PI - 1.5); p.lineTo([xm + rx * Math.cos(t), cy + ry * Math.sin(t)]) }
      break
    }
    case 'O': case 'o': p.circle([xm, bot + H / 2], (x1 - x0) / 2, H / 2, 14); break
    case 'I': p.moveTo([xm, bot]).lineTo([xm, top]); break
    case 'T': p.moveTo([x0 - h * 0.5, top]).lineTo([x1 + h * 0.5, top]); p.moveTo([xm, top]).lineTo([xm, bot]); break
    case 'Y': p.moveTo([x0, top]).lineTo([xm, bot + H * 0.45]).lineTo([x1, top]); p.moveTo([xm, bot + H * 0.45]).lineTo([xm, bot]); break
    case 'F': p.moveTo([x1, top]).lineTo([x0, top]).lineTo([x0, bot]); p.moveTo([x0, bot + H * 0.5]).lineTo([x1 - 0.05, bot + H * 0.5]); break
    case 'A': // a solid triangle: its outline, and a stroke up the middle to fill it
      p.moveTo([x0 - h * 0.6, bot]).lineTo([xm, top + h * 0.6]).lineTo([x1 + h * 0.6, bot]).lineTo([x0 - h * 0.6, bot])
      p.moveTo([xm, bot]).lineTo([xm, top - 0.2])
      break
    case 'U': p.moveTo([x0, top]).lineTo([x0, bot + (x1 - x0) / 2]).arc([xm, bot + (x1 - x0) / 2], Math.PI, 6).lineTo([x1, top]); break
    case 'S': {
      const ry = H / 4
      p.moveTo([x1, top - ry * 0.4]).cubicTo([x1, top + 0.05], [x0, top + 0.05], [x0, top - ry])
        .cubicTo([x0, bot + 2 * ry + 0.02], [x1, bot + 2 * ry - 0.02], [x1, bot + ry])
        .cubicTo([x1, bot - 0.05], [x0, bot - 0.05], [x0, bot + ry * 0.4])
      break
    }
    case 'N': p.moveTo([x0, bot]).lineTo([x0, top]).lineTo([x1, bot]).lineTo([x1, top]); break
    case 'P': {
      const r = H * 0.27
      p.moveTo([x0, bot]).lineTo([x0, top]).lineTo([x1 - r, top]).arc([x1 - r, top - r], -Math.PI, 6).lineTo([x0, top - 2 * r])
      break
    }
    case 'R': {
      const r = H * 0.27
      p.moveTo([x0, bot]).lineTo([x0, top]).lineTo([x1 - r, top]).arc([x1 - r, top - r], -Math.PI, 6).lineTo([x0, top - 2 * r])
      p.moveTo([xm, top - 2 * r]).lineTo([x1, bot])
      break
    }
    case 'W': p.moveTo([x0, top]).lineTo([x0 + (x1 - x0) * 0.25, bot]).lineTo([xm, top - H * 0.3]).lineTo([x0 + (x1 - x0) * 0.75, bot]).lineTo([x1, top]); break
    case 'E': p.moveTo([x1, top]).lineTo([x0, top]).lineTo([x0, bot]).lineTo([x1, bot]); p.moveTo([x0, bot + H / 2]).lineTo([x1 - 0.08, bot + H / 2]); break
    case 'L': p.moveTo([x0, top]).lineTo([x0, bot]).lineTo([x1, bot]); break
  }
  return p
}
{
  const M = 16.6 / (890 / CAP) // metres per cap unit (the top line, 890 px, is 16.6 m)
  const YC = -6.75, UC = 470 / CAP
  const lines: [Glyph[], number][] = [[LINE1, 17.6], [LINE2, 15.25]]
  for (const [glyphs, base] of lines) {
    // the reader faces east, so their right is -y
    const place = (u: number, v: number, w: number): V3 => [XW - w, YC - (u - UC) * M, base + v * M]
    for (const [ch, l, r, small] of glyphs) strokes(neon, glyph(ch, l, r, small).paths, { width: SW, depth: 0.3, place })
  }
}

const lit = (p: V3, n: V3) => (n[0] < -0.5 && p[0] < XW + 0.5 && p[2] > 6 ? 0.5 : 0)
if (import.meta.main) {
  await save('atx-seaholm-power-plant', 'Seaholm Power Plant', [
    { part: conc, material: { ...finish('seaholm-concrete', 0xddd3bc), floodlight: lit } },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: neon, material: finish('neon-seaholm', 0x8a3530) },
    { part: door, material: PALETTE.entrance },
  ], { bearing: 18, replaces: ['way/352112927'] }, 5000)
}
