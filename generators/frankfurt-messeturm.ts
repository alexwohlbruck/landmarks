/**
 * Messeturm, Frankfurt am Main: procedural, CC0-1.0.
 * bun generators/frankfurt-messeturm.ts
 *
 * Helmut Jahn (Murphy/Jahn), 1988-1991: 257 m, 63 storeys. A square shaft
 * of red granite wrapped round a glass cylinder: the cylinder shows as a
 * glazed strip down the middle of every face, the granite steps down
 * towards the corners at the top so the cylinder comes out whole, and a
 * slimmer glass drum carries the "pencil" pyramid.
 *
 * Identity, in order: the slim square red shaft; the granite stepping
 * 200/194/188 m from the face centres to the corners; the glass cylinder
 * emerging over it; the three-tier dark glass pyramid with its louvre
 * bands; the glazed notch at each corner and the glass strip in each face.
 *
 * Map frame: built turned, bearing 35.1: local +y faces bearing 35.1
 * (north-east), local +x bearing 125.1 (south-east). Origin: the area
 * centroid of OSM way/23916129 (50.112377, 8.652718), the centre of the
 * square. y = 0 is the lowest ground under the footprint.
 *
 * Evidence:
 * - p1 https://commons.wikimedia.org/wiki/File:01-01-2014_-_Messeturm_-_trade_fair_tower_-_Frankfurt-_Germany_-_01.jpg
 *   Norbert Nagel, CC BY-SA 3.0: the whole tower over the fair halls.
 * - p2 https://commons.wikimedia.org/wiki/File:Messeturm,_Frankfurt,_South_view_20170325_1.jpg
 *   DXR, CC BY-SA 4.0: from the south, the whole height, the face strips.
 * - p3 https://commons.wikimedia.org/wiki/File:Messeturm,_Frankfurt,_Southwest_detail_view_20170325_1.jpg
 *   DXR, CC BY-SA 4.0: the top from the south-west: the granite steps, the
 *   cylinder, the drum and the pyramid's three tiers and louvre bands.
 * - p4 https://commons.wikimedia.org/wiki/File:Kiefer_Bleistift,_Messeturm_Frankfurt_(13632505905).jpg
 *   Kiefer. from Darmstadt, CC BY-SA 2.0: on the diagonal, the glazed
 *   corner notch and the face strips.
 * - p5 https://commons.wikimedia.org/wiki/File:Messeturm,_Frankfurt,_North_view_20200612_1.jpg
 *   DXR, CC BY-SA 4.0: from the north.
 * - p6 https://commons.wikimedia.org/wiki/File:Messeturm_Frankfurt_bei_Nacht.jpg
 *   Atelier Ralf Majewska, CC BY 3.0: at night, lit windows, the tip lit.
 * - OSM (API, 2026-11): outline way/23916129 (257 m), a 41 m square (all
 *   plan numbers here measured from its nodes, turned to the frame);
 *   parts 930215227 (base, 30 m), 927655688/87/86 (the shaft, 30-188, -194,
 *   -200 m, each a cross that narrows by a step at the corners),
 *   183063659 (the cylinder, radius 20.4, 30-210), 183063661 (the drum,
 *   radius 16.2, to 220), 183063660 (the pyramid, to 257, roof height 35),
 *   927655685 (17 m).
 * - Published: 256.5 m, 63 storeys (Wikipedia "Messeturm").
 * - No lidar (none in Germany). Look-only: none.
 *
 * Numbers. Heights: OSM and published (above). The pyramid is drawn square
 * to the shaft, not turned 45° as OSM 183063660
 * has it: p3 shows one broad face and one narrow one from the south-west,
 * which only a square-on pyramid gives. It is 22 m across at its foot
 * (p2). Its tiers (to 233.5, 246, 257 m)
 * and louvre bands are measured on p3 against the 35 m roof height. The
 * corner notches (4 m each way, glazed at their back) are from p4; OSM
 * leaves the corners open above 30 m, which p2 and p4 do not show (the
 * silhouette stays square). The face strips (the cylinder seen
 * between the granite; p2, p4: 4.6 m wide). Windows: two-storey panels (3.55 m
 * storeys) in 2.4 m bays with granite piers between: estimated.
 * Colours: granite #9c6a5e (p1-p3: a darker brown-red than OSM's
 * building:colour #af7969); cylinder, drum and cylinder-top glass #93a8b8
 * (p3); the pyramid's glass #5b6570 (p3: dark grey glass, kept above
 * charcoal); louvres, ledges and the railing line a pale metal #c9ccce.
 *
 * Night: the office windows and the cylinder are `window*`; the pyramid is
 * `window-3`, so the crown glows as it does when lit (p6 shows the tip
 * lit; the lit pyramid is the tower's night mark).
 *
 * Doubts: the base (0-30 m) has no open close-up photo; OSM draws it as
 * the full square, and it is drawn as the shaft continued to the ground,
 * strips and notches included (p1 shows the strips running down behind the
 * fair halls). The corner notch (2.6 m each way) is read from one diagonal
 * photo. The pyramid's foot (22 m across) and the drum (radius 15 m) are
 * measured on p2 against the 41 m square; OSM has radius 16.2 for the drum.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { prism, capRing, face, saveLods, type XY, type Layer } from './frankfurt-commerzbank-tower'
import { lathe } from './chi-aon-center'

const ID = 'frankfurt-messeturm'
const H = 20.5 // half the square
const STRIP = 2.3 // half the face strip where the cylinder shows
const NOTCH = 2.6 // corner notch, each way
const R_CYL = 20.3, CYL_TOP = 210
const R_DRUM = 15, DRUM_TOP = 222
const STOREY = 3.55

const granite = new Part(), win = new Part(), cyl = new Part(), pyr = new Part(), metal = new Part()

/** Rotate a ring by k quarter turns. */
const rot = (r: XY[], k: number): XY[] => r.map(([x, y]) => {
  let p: XY = [x, y]
  for (let i = 0; i < k; i++) p = [-p[1], p[0]]
  return p
})
const rot3 = (p: V3, k: number): V3 => { const [x, y] = rot([[p[0], p[1]]], k)[0]; return [x, y, p[2]] }
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]


// ── the shaft: per quarter turn, the +y face's pieces ──
// face pieces along x on the +y face, from the strip out to the corner:
// [3.5, 10.4] to 200, [10.4, 13.1] to 194, the corner block to 188.
const pieces: [number, number, number][] = [[STRIP, 10.4, 200], [10.4, 13.1, 194]]
for (let k = 0; k < 4; k++) {
  for (const [a, b, top] of pieces) for (const sgn of [1, -1]) {
    const x0 = sgn > 0 ? a : -b, x1 = sgn > 0 ? b : -a
    prism(granite, rot(rect(x0, 13.1, x1, H), k), 0, top)
  }
  // the corner block (x, y in 13.1-20.5) less the glazed notch at the corner
  const c: XY[] = [[13.1, 13.1], [H, 13.1], [H, H - NOTCH], [H - NOTCH, H - NOTCH], [H - NOTCH, H], [13.1, H]]
  prism(granite, rot(c, k), 0, 188)
  // glass at the back of the notch
  const n0: V3 = [H, H - NOTCH, 0], n1: V3 = [H - NOTCH, H - NOTCH, 0], n2: V3 = [H - NOTCH, H, 0]
  for (const [p, q, nrm] of [[n0, n1, [0, 1, 0]], [n1, n2, [1, 0, 0]]] as [V3, V3, V3][]) {
    const z0 = 4, z1 = 187
    face(cyl, [rot3([p[0] + 0.04 * nrm[0], p[1] + 0.04 * nrm[1], z0], k), rot3([q[0] + 0.04 * nrm[0], q[1] + 0.04 * nrm[1], z0], k), rot3([q[0] + 0.04 * nrm[0], q[1] + 0.04 * nrm[1], z1], k), rot3([p[0] + 0.04 * nrm[0], p[1] + 0.04 * nrm[1], z1], k)], rot3(nrm, k))
  }
}
// the inner core under the cylinder top (hidden but closes the steps)
prism(granite, rect(-13.1, -13.1, 13.1, 13.1), 0, 199.9, { top: null })

// ── windows on the granite: two-storey panels in 2.4 m bays ──
{
  const bay = 2.4, pier = 1.2
  /** Panels on the +y face (turned by k) between x0 and x1, z0 to z1. */
  const run = (k: number, x0: number, x1: number, y: number, z0: number, z1: number, nx = 0) => {
    const L = x1 - x0, n = Math.max(1, Math.round((L - pier) / (bay + pier)))
    const w = (L - (n + 1) * pier) / n
    if (w < 0.8) return
    const rows = Math.round((z1 - z0) / (2 * STOREY)), h = (z1 - z0) / rows
    for (let r = 0; r < rows; r++) {
      const za = z0 + r * h + 1.1, zb = z0 + (r + 1) * h - 0.5
      for (let i = 0; i < n; i++) {
        const xa = x0 + pier + i * (w + pier), xb = xa + w
        const P = (x: number, z: number): V3 => nx ? rot3([y + 0.04, x, z], k) : rot3([x, y + 0.04, z], k)
        face(win, [P(xa, za), P(xb, za), P(xb, zb), P(xa, zb)], rot3(nx ? [1, 0, 0] : [0, 1, 0], k))
      }
    }
  }
  for (let k = 0; k < 4; k++) {
    for (const sgn of [1, -1]) {
      const span = (a: number, b: number) => (sgn > 0 ? [a, b] : [-b, -a]) as [number, number]
      // face strip neighbours to 200 (stop under the top), the 194 piece, the corner to 188
      const [a1, b1] = span(STRIP, 10.4), [a2, b2] = span(10.4, 13.1), [a3, b3] = span(13.1, H - NOTCH)
      run(k, a1, b1, H, 4, 197)
      run(k, a2, b2, H, 4, 190)
      run(k, a3, b3, H, 4, 184)
    }
    // the notch's side walls (granite) on the +x side of the corner: none (narrow)

  }
}

// ── the cylinder, 30-210, with a ledge at its top; the drum; the pyramid ──
const SEG = 32
lathe(cyl, 0, 0, [[R_CYL, 0], [R_CYL, CYL_TOP - 0.5]], SEG)
// a thin pale railing line at the cylinder's top; its roof ring and the drum are glass-toned
lathe(metal, 0, 0, [[R_CYL, CYL_TOP - 0.5], [R_CYL + 0.15, CYL_TOP - 0.5], [R_CYL + 0.15, CYL_TOP]], SEG)
lathe(cyl, 0, 0, [[R_CYL + 0.15, CYL_TOP], [R_DRUM, CYL_TOP], [R_DRUM, DRUM_TOP], [0, DRUM_TOP]], 24)
// mullion lines on the cylinder: a pale floor ring every three storeys above the granite

// pyramid: three tiers with vertical louvre bands between, square to the shaft
{
  const tiers: [number, number, number, number][] = [
    // z0, half0, z1 (top of the sloped part), louvre band height
    [DRUM_TOP, 11, 233.5, 2.2],
    [235.7, 7.3, 246.0, 1.8],
    [247.8, 3.9, 256.9, 0],
  ]
  const slope = 11 / (257 - DRUM_TOP) // half-width lost per metre: 0.44
  for (const [z0, h0, z1, band] of tiers) {
    const h1 = band ? h0 - (z1 - z0) * slope : 0.05
    const sq = (h: number, z: number): V3[] => [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]]
    const b = sq(h0, z0), t = sq(h1, z1)
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      if (band) pyr.quad(b[i], b[j], t[j], t[i])
      else pyr.tri(b[i], b[j], [0, 0, 257])
    }
    // the tier's foot ledge: a flat ring out to the louvre band below
    if (band) {
      const hb = h1 - 0.3 // the louvre band is set back from the tier's top edge
      const bt = sq(hb, z1), bb = sq(hb, z1 + band)
      for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4
        metal.quad(t[i], t[j], bt[j], bt[i]) // ledge (flat)
        metal.quad(bt[i], bt[j], bb[j], bb[i]) // louvre band
      }
    }
  }
  // the pyramid's corner frames: pale ribs along the hips
  void capRing
}
// the tip rod
lathe(metal, 0, 0, [[0.25, 256.5], [0.12, 259], [0, 259.2]], 6)

const parts: Layer[] = [
  { part: granite, material: finish('messeturm-granite', 0x9c6a5e) },
  { part: win, material: PALETTE.window },
  { part: cyl, material: windowVariant(2, 0x93a8b8) },
  { part: pyr, material: windowVariant(3, 0x5b6570) },
  { part: metal, material: finish('messeturm-metal', 0xc9ccce, 0.5) },
]
await saveLods(ID, 'Messeturm', parts, null, { anchor: [50.112377, 8.652718], bearing: 35.1, elevation: 0, height: 259 })
