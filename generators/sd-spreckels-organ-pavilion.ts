/**
 * Spreckels Organ Pavilion, Balboa Park, San Diego. Harrison Albright,
 * 1914–15, for the Panama-California Exposition: the organ house, a tall
 * cream box with a low ornate gable and a great pierced arch closed by a
 * roll-up door, and a curved double peristyle that runs out from either
 * side of it round the seating, ending in two small domed-arch pavilions.
 *
 * Frame: bearing 0 (the organ house faces due north over the seats). +x
 * east, +y north, z up, metres; origin at the anchor -117.15043, 32.72945
 * (0.5 m from the outline's area centroid). z = 0 is the lowest ground
 * under the footprint, behind the organ house (lidar 7.8 m above the box's
 * ground_min); the seating plaza is 0.9 m higher, the stage 2.0.
 *
 * Replaces: the outline way/31240523 and its parts way/1511054492 (organ
 * house, h=23), way/1574361364 (stage), way/1574361371 and way/1574361373
 * (end pavilions). The seats, the stage apron (outside the outline) and the
 * plaza are the map's.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): outline and parts. The peristyle's
 *   inner and outer edges fit circles about (0.5, 33.8) of r 42.2 and 48
 *   (measured from the outline's vertices).
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014), 0.5 m grid: peristyle
 *   top 6.6–6.7, end pavilions 6.6–7.9, organ house roof 17–21.3 (measured).
 * - Published: Wikipedia "Spreckels Organ Pavilion": 1914, Harrison
 *   Albright; the organ house faces north.
 * Photos (evidence, Wikimedia Commons):
 * - "Balboa Park, San Diego, CA, USA - panoramio (193).jpg", Roman
 *   Eugeniusz, CC BY-SA 3.0 (the organ house from the seats):
 *   https://commons.wikimedia.org/wiki/File:Balboa_Park,_San_Diego,_CA,_USA_-_panoramio_(193).jpg
 * - "Spreckels Organ Pavilion 2 2016-05-14.jpg", FASTILY, CC BY-SA 4.0 (the
 *   peristyle and an end pavilion): https://commons.wikimedia.org/wiki/File:Spreckels_Organ_Pavilion_2_2016-05-14.jpg
 * - "Spreckels Organ Pavilion wide front view.JPG", Captain-tucker,
 *   CC BY-SA 3.0: https://commons.wikimedia.org/wiki/File:Spreckels_Organ_Pavilion_wide_front_view.JPG
 * - "Spreckels Pavilion WideShot.jpg", ChemicalBear, CC0 (the whole curve):
 *   https://commons.wikimedia.org/wiki/File:Spreckels_Pavilion_WideShot.jpg
 * - "Spreckels Organ Pavalion.jpg", Dan Anderson, CC BY-SA 3.0 (side and
 *   back): https://commons.wikimedia.org/wiki/File:Spreckels_Organ_Pavalion.jpg
 * - "Spreckels Organ Pavilion Detail.jpg", Visitor7, CC BY-SA 3.0 (columns,
 *   cornice): https://commons.wikimedia.org/wiki/File:Spreckels_Organ_Pavilion_Detail.jpg
 * - "Spreckels at new years.jpg", Jon Sullivan, public domain (night: strings
 *   of bulbs along the gable, the arch and the peristyle's cornice):
 *   https://commons.wikimedia.org/wiki/File:Spreckels_at_new_years.jpg
 *
 * Numbers (z above the ground behind the house)
 * - Organ house: 23 × 12.8 m (OSM); eaves 17.3, gable peak 19.9, finials to
 *   22 — scaled from Eugeniusz 193 using the 23 m width (estimated), within
 *   the lidar's 21.3 m top.
 * - Great arch: door r 4.8 springing 7.7 (top 12.5); pierced archivolt to r
 *   7.8 — same photo (estimated).
 * - Peristyle: podium to 1.9, columns 1.9–5.3, entablature to 6.1,
 *   balustrade to 6.8 (lidar top 6.6–6.7; split estimated from FASTILY 2);
 *   nine bays a side, two rows of columns (counted).
 * - End pavilions 8 × 7.4 m (OSM), cornice 6.4, crest 7.9 (lidar).
 *
 * Simplified / doubts
 * - The carving (cartouches, capitals) is left out.
 * - The open peristyle's two rows of columns stand against a dark screen set
 *   at the podium's outer edge, facing the seats only: the shade and trees
 *   seen through it from the seats. From outside it is culled.
 * - The great arch: a broad cream archivolt pierced by two rings of dark
 *   slots for its fretwork; the roll-up door a darker beige plane set
 *   0.7 m back.
 * - The back of the organ house is plain: Anderson's photo shows only its
 *   side.
 * - Night: the bulbs are `lamp` beads at about 2.5 m spacing (the real
 *   strings are much denser); the coloured wash on the house is not drawn.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { cbox, rect, cylinder } from './dc-white-house'
import { bead } from './bridge-kit'
import {
  BP_STUCCO, BP_CAST_STONE, BP_SHADE, archPoly, faceAt, facePoly, faceSlab, orientTo, patternDome, rectPoly, saveModel, southFace, type XY,
} from './sd-california-tower'

function build() {
  const stucco = new Part(), stone = new Part(), shade = new Part(), door = new Part(), roof = new Part(), lamp = new Part()
  const lamps: V3[] = []

  // ---- The peristyle: two arcs about C, from the organ house to the end pavilions.
  const C: XY = [0.5, 33.8]
  const RI = 42.2, RO = 48.0, RCI = 42.9, RCO = 47.3
  const PODIUM = 1.9, CAP = 5.3, ENT = 6.1, BAL = 6.8
  const deg = Math.PI / 180
  const P = (r: number, a: number, z: number): V3 => [C[0] + r * Math.cos(a), C[1] + r * Math.sin(a), z]
  /** An annular sector slab r0..r1, angles a0..a1, z0..z1, in n segments. */
  const sector = (top: Part | null, side: Part, bottom: Part | null, r0: number, r1: number, a0: number, a1: number, z0: number, z1: number, n: number) => {
    for (let k = 0; k < n; k++) {
      const t0 = a0 + ((a1 - a0) * k) / n, t1 = a0 + ((a1 - a0) * (k + 1)) / n
      const tm = (t0 + t1) / 2
      const out: V3 = [Math.cos(tm), Math.sin(tm), 0], inn: V3 = [-out[0], -out[1], 0]
      orientTo(side, [P(r1, t0, z0), P(r1, t1, z0), P(r1, t1, z1), P(r1, t0, z1)], out)
      orientTo(side, [P(r0, t0, z0), P(r0, t1, z0), P(r0, t1, z1), P(r0, t0, z1)], inn)
      if (top) orientTo(top, [P(r0, t0, z1), P(r1, t0, z1), P(r1, t1, z1), P(r0, t1, z1)], [0, 0, 1])
      if (bottom) orientTo(bottom, [P(r0, t0, z0), P(r1, t0, z0), P(r1, t1, z0), P(r0, t1, z0)], [0, 0, -1])
    }
    for (const [t, s] of [[a0, -1], [a1, 1]] as [number, number][]) {
      const tang: V3 = [-Math.sin(t) * s * Math.sign(a1 - a0), Math.cos(t) * s * Math.sign(a1 - a0), 0]
      orientTo(side, [P(r0, t, z0), P(r1, t, z0), P(r1, t, z1), P(r0, t, z1)], tang)
    }
  }
  for (const side of [-1, 1]) {
    // angles measured from +x; the left (west) wing runs from the house's wall (-105.5°) into the pavilion (-154°)
    const A0 = (side < 0 ? -105.5 : -74.5) * deg, A1 = (side < 0 ? -154 : -26) * deg
    const N = 8
    sector(stone, stone, null, RI, RO, A0, A1, 0, PODIUM, N)
    sector(roof, stone, shade, RI - 0.3, RO + 0.3, A0, A1, CAP, ENT, N)
    // balustrade walls on both edges
    sector(stucco, stucco, null, RI - 0.3, RI + 0.15, A0, A1, ENT, BAL, N)
    sector(stucco, stucco, null, RO - 0.15, RO + 0.3, A0, A1, ENT, BAL, N)
    // a dark back screen set well behind the outer row, facing the seats only: from the
    // seats both rows stand against shade; from outside it is culled and the columns
    // stand open against the seats beyond
    for (let k = 0; k < 2 * N; k++) {
      const t0 = A0 + ((A1 - A0) * k) / (2 * N), t1 = A0 + ((A1 - A0) * (k + 1)) / (2 * N), tm = (t0 + t1) / 2
      orientTo(shade, [P(RO - 0.05, t0, PODIUM), P(RO - 0.05, t1, PODIUM), P(RO - 0.05, t1, CAP), P(RO - 0.05, t0, CAP)], [-Math.cos(tm), -Math.sin(tm), 0])
    }
    // columns: ten in each row, the last at the pavilion
    for (let i = 0; i <= 9; i++) {
      const a = A0 + ((A1 - A0) * (i + 0.5)) / 10.2
      for (const r of [RCI, RCO]) {
        const [x, y] = P(r, a, 0)
        cbox(stucco, rect(x - 0.4, x + 0.4, y - 0.4, y + 0.4), PODIUM, PODIUM + 0.25, { top: true })
        cylinder(stucco, x, y, 0.33, PODIUM + 0.25, CAP - 0.3, 8, 0.3)
        cbox(stucco, rect(x - 0.42, x + 0.42, y - 0.42, y + 0.42), CAP - 0.3, CAP, { bottom: true, top: false })
      }
    }
    // bulbs along the inner cornice
    for (let i = 0; i <= 14; i++) lamps.push(P(RI - 0.45, A0 + ((A1 - A0) * i) / 14, ENT - 0.1))
  }

  // ---- End pavilions: a square on a podium, an arch on each face, a curved crest.
  for (const [x0, x1, y0, y1] of [[-41.6, -33.6, 13.3, 20.7], [34.4, 42.4, 14.0, 21.4]]) {
    const r = rect(x0, x1, y0, y1)
    cbox(stone, r, 0, PODIUM, { top: true })
    cbox(stucco, rect(x0 + 0.3, x1 - 0.3, y0 + 0.3, y1 - 0.3), PODIUM, 6.0, { c: 0.2, top: false })
    cbox(stone, rect(x0, x1, y0, y1), 6.0, 6.5, { b: 0.15, bottom: true, top: roof })
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
    for (const d of [0, 90, 180, 270]) {
      const s = Math.sin(d * deg), c = Math.cos(d * deg)
      const hw = d % 180 === 0 ? (x1 - x0) / 2 - 0.3 : (y1 - y0) / 2 - 0.3
      const F = faceAt(cx + s * ((x1 - x0) / 2 - 0.3), cy + c * ((y1 - y0) / 2 - 0.3), d)
      const u0 = 0 // the face's origin is its middle
      facePoly(shade, F, archPoly(u0, 3.4, PODIUM, 4.1, 8), 0.04)
      faceSlab(stone, F, rectPoly(u0 - hw, u0 + hw, 5.5, 6.0), 0, 0.12)
      // crest over the north and south faces
      if (d === 0 || d === 180) faceSlab(stucco, F, [[u0 - 2.6, 6.5], [u0 + 2.6, 6.5], [u0 + 2.0, 7.2], [u0 + 0.8, 7.7], [u0, 7.9], [u0 - 0.8, 7.7], [u0 - 2.0, 7.2]], -0.4, 0.1)
    }
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) patternDome(cx + sx * ((x1 - x0) / 2 - 0.4), cy + sy * ((y1 - y0) / 2 - 0.4), [[0.3, 6.5], [0.3, 7.0], [0.15, 7.5], [0.01, 7.8]], 6, () => stone)
  }

  // ---- The organ house.
  const H = rect(-10.8, 12.2, -13.1, -0.3)
  const XC = (H.x0 + H.x1) / 2
  const EAVES = 17.3, PEAK = 19.9
  cbox(stucco, H, 0, EAVES, { c: 0.2, top: false })
  // roof: a low gable, ridge running north–south
  const hw = (H.x1 - H.x0) / 2
  orientTo(roof, [[H.x0, H.y0, EAVES], [H.x0, H.y1, EAVES], [XC, H.y1, PEAK - 0.4], [XC, H.y0, PEAK - 0.4]], [-(PEAK - EAVES), 0, hw])
  orientTo(roof, [[H.x1, H.y0, EAVES], [H.x1, H.y1, EAVES], [XC, H.y1, PEAK - 0.4], [XC, H.y0, PEAK - 0.4]], [PEAK - EAVES, 0, hw])
  orientTo(stucco, [[H.x0, H.y0, EAVES], [H.x1, H.y0, EAVES], [XC, H.y0, PEAK - 0.4]], [0, -1, 0])
  // north front: the ornate gable (a raised parapet with a curved outline) and cornice
  const NF = faceAt(0, H.y1, 0) // u runs -x
  const U = (x: number) => -x
  const gable: XY[] = [[U(H.x1) , EAVES - 1.0], [U(H.x0), EAVES - 1.0], [U(H.x0), EAVES + 0.2]]
  for (let k = 1; k < 10; k++) {
    const t = k / 10, x = H.x0 + (H.x1 - H.x0) * t
    const s = Math.abs(2 * t - 1)
    gable.push([U(x), EAVES + 0.2 + (PEAK - EAVES - 0.2) * (1 - s * s)])
  }
  gable.push([U(H.x1), EAVES + 0.2])
  faceSlab(stone, NF, gable, -0.3, 0.45)
  faceSlab(stucco, NF, rectPoly(U(H.x1) + 0.3, U(H.x0) - 0.3, EAVES - 2.2, EAVES - 1.0), 0, 0.25)
  // finials at the corners and the peak
  for (const [x, z] of [[H.x0 + 0.5, EAVES + 0.2], [H.x1 - 0.5, EAVES + 0.2], [XC, PEAK]] as [number, number][])
    patternDome(x, H.y1 + 0.1, [[0.45, z], [0.45, z + 0.6], [0.25, z + 1.2], [0.08, z + 1.9], [0.01, z + 2.1]], 6, () => stone)
  // the great arch: door, pierced archivolt, mouldings
  const AS = 7.7, RD = 4.8, RA = 7.8
  const annulus = (r0: number, r1: number, t0 = 0, t1 = Math.PI, n = 14): XY[] => {
    const a = Array.from({ length: n + 1 }, (_, k) => t0 + ((t1 - t0) * k) / n)
    return [...a.map((t) => [U(XC) + r1 * Math.cos(t), AS + r1 * Math.sin(t)] as XY), ...a.slice().reverse().map((t) => [U(XC) + r0 * Math.cos(t), AS + r0 * Math.sin(t)] as XY)]
  }
  faceSlab(door, NF, archPoly(U(XC), 2 * RD, 2.0, AS, 14), -0.7, -0.6)
  // reveal of the arch opening
  facePoly(shade, NF, archPoly(U(XC), 2 * RD, 2.0, AS, 14).map(([u, z]) => [u, z] as XY), -0.65)
  // jambs: arch soffit from the face back to the door
  for (let k = 0; k < 14; k++) {
    const t0 = (Math.PI * k) / 14, t1 = (Math.PI * (k + 1)) / 14
    const pa = (t: number, d: number): V3 => [XC - RD * Math.cos(t), H.y1 + d, AS + RD * Math.sin(t)]
    orientTo(stucco, [pa(t0, 0.02), pa(t1, 0.02), pa(t1, -0.65), pa(t0, -0.65)], [Math.cos((t0 + t1) / 2), 0, -Math.sin((t0 + t1) / 2)])
  }
  for (const sx of [-1, 1]) orientTo(stucco, [[XC + sx * RD, H.y1 + 0.02, 2.0], [XC + sx * RD, H.y1 + 0.02, AS], [XC + sx * RD, H.y1 - 0.65, AS], [XC + sx * RD, H.y1 - 0.65, 2.0]], [-sx, 0, 0])
  // the archivolt: a broad cream band pierced by dark fretwork (two rings of slots), with mouldings
  facePoly(stucco, NF, annulus(RD + 0.5, RA - 0.6), 0.06)
  facePoly(stone, NF, annulus(RD, RD + 0.5), 0.15)
  facePoly(stone, NF, annulus(RA - 0.6, RA), 0.15)
  for (const [r0, r1, n, off] of [[RD + 0.75, RD + 1.45, 13, 0], [RD + 1.7, RA - 0.85, 15, 0.5]] as [number, number, number, number][])
    for (let k = 0; k < n; k++) {
      const t = (Math.PI * (k + 0.5 + off * 0)) / n, w = (Math.PI / n) * 0.3
      facePoly(shade, NF, annulus(r0, r1, t - w, t + w, 1), 0.1)
    }
  // flanking bays: engaged columns, a door and a window each side, imposts
  for (const sx of [-1, 1]) {
    const xi = XC + sx * (RA + 0.4), xo = XC + sx * (hw - 0.9)
    for (const x of [xi, xi + sx * 1.1, xo]) {
      cylinder(stone, x, H.y1 + 0.15, 0.32, 2.0, AS - 0.3, 8)
    }
    faceSlab(stone, NF, rectPoly(U(XC + sx * (hw - 0.2)), U(XC + sx * RA), AS - 0.4, AS + 0.3), 0, 0.5)
    const xm = (xi + sx * 1.1 + xo) / 2
    facePoly(shade, NF, rectPoly(U(xm) - 0.6, U(xm) + 0.6, 2.0, 4.6), 0.05)
    facePoly(shade, NF, rectPoly(U(xm) - 0.55, U(xm) + 0.55, 9.6, 11.4), 0.05)
    facePoly(stone, NF, rectPoly(U(xm) - 0.9, U(xm) + 0.9, 12.5, 14.2), 0.08)
  }
  // a stage-level plinth band across the front
  faceSlab(stone, NF, rectPoly(U(H.x1), U(H.x0), 0, 2.0), 0, 0.35)
  // bulbs on the gable and round the arch
  for (let k = 0; k <= 12; k++) {
    const t = k / 12, x = H.x0 + (H.x1 - H.x0) * t, s = Math.abs(2 * t - 1)
    lamps.push([x, H.y1 + 0.6, EAVES + 0.35 + (PEAK - EAVES - 0.2) * (1 - s * s)])
  }
  for (let k = 0; k <= 12; k++) { const t = (Math.PI * k) / 12; lamps.push([XC - (RA + 0.15) * Math.cos(t), H.y1 + 0.3, AS + (RA + 0.15) * Math.sin(t)]) }
  for (const q of lamps) bead(lamp, q, 0.22, true)

  // back and sides: a few dark windows high up
  const SF = southFace(H.y0)
  for (const x of [-4, 5.4]) facePoly(shade, SF, rectPoly(x - 0.8, x + 0.8, 9.5, 12.0), 0.04)

  const lit = (q: V3, n: V3) => (n[2] > 0.7 ? 0.2 : q[1] > -1 && n[1] > 0.3 ? 0.8 : 0.35)
  return [
    { part: stucco, material: { ...BP_STUCCO, floodlight: lit } },
    { part: stone, material: { ...BP_CAST_STONE, floodlight: lit } },
    { part: shade, material: BP_SHADE },
    { part: door, material: finish('spreckels-door', 0x968a79) },
    { part: roof, material: finish('spreckels-roof', 0xcfcac0) },
    { part: lamp, material: finish('lamp', 0xd9d2c4) },
  ]
}

if (import.meta.main) await saveModel('sd-spreckels-organ-pavilion', 'Spreckels Organ Pavilion', build())
