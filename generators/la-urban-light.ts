/**
 * Urban Light (Chris Burden, 2008), LACMA, Wilshire Boulevard, Los Angeles —
 * original procedural geometry, CC0-1.0.
 * bun generators/la-urban-light.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the centre of the OSM
 * area way/164285051 (-118.35921, 34.06305), on the ground (flat plaza).
 * Placed at bearing 7.8°, the square's rotation in OSM.
 *
 * 202 restored cast-iron street lamps of 16 models, painted one grey, in a
 * near grid. Drawn as a sculpture (STYLE.md "Small, famous objects"): every
 * lamp is there, each a chunky tapered post (plinth and shaft in one) and a globe head,
 * so the grid of posts reads at phone size. Lamp detail (fluting, scrolls,
 * twin arms) is left out.
 *
 * Sources:
 * - Plan: OSM way/164285051, a 17.6 × 17.8 m square.
 * - Published (Wikipedia "Urban Light"; LACMA): 202 lamps, 16 models,
 *   overall 8.14 × 17.44 × 17.89 m; grey paint (repainted 2015).
 * - Photos: u1 "Giant white pillars (Unsplash)" (Chris Brignola, CC0; an
 *   aisle between rows: square plinths ~0.7 m, shafts, globes);
 *   u3 "BCAM & Urban Light LACMA." (feculent_fugue, Flickr, CC BY 2.0; the
 *   south side from across Wilshire, lamps taller toward the middle);
 *   u5 "urban lights" (quan ha, Flickr, CC BY 2.0; heads against the sky);
 *   g1/g2 "LACMA-Exterior-View-ROLM-ArchEyes" (ArchEyes Magazine, CC BY 4.0;
 *   from Wilshire & Fairfax, south-west, the block silhouette).
 *
 * Estimated: the grid (15 × 14 = 210 positions, two missing at each corner
 * = 202; the real "near grid" is irregular), the height profile (6.6 m at
 * the edge rising to the published 8.14 m in the middle, with a small
 * per-lamp variation standing in for the 16 models), post and plinth sizes
 * (drawn chunkier than real so they don't vanish into hairlines).
 *
 * Copyright note: the sculpture is a 2008 artwork; this is a coarse massing
 * of its grid, not a reproduction of the lamps' design.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const iron = new Part(), globe = new Part()
const NX = 15, NY = 14, W = 17.44, D = 17.89
const SX = W / NX, SY = D / NY

/** A tapered square shaft, rb at the bottom and rt at the top, no caps. */
function shaft(p: Part, x: number, y: number, z0: number, z1: number, rb: number, rt: number) {
  const r = (h: number, z: number): V3[] => [[x - h, y - h, z], [x + h, y - h, z], [x + h, y + h, z], [x - h, y + h, z]]
  p.loft([r(rb, z0), r(rt, z1)])
}

/** A globe head as an octahedron, radius r, centred at z. */
function head(p: Part, x: number, y: number, z: number, r: number, h: number) {
  const top: V3 = [x, y, z + h], bot: V3 = [x, y, z - h * 0.8]
  const ring: V3[] = [[x + r, y, z], [x, y + r, z], [x - r, y, z], [x, y - r, z]]
  for (let i = 0; i < 4; i++) {
    const a = ring[i], b = ring[(i + 1) % 4]
    p.tri(a, b, top)
    p.tri(b, a, bot)
  }
}

// a deterministic per-lamp jitter for the 16 models' different heights
const jitter = (i: number, j: number) => { const s = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453; return s - Math.floor(s) - 0.5 }

let lamps = 0
for (let i = 0; i < NX; i++) {
  for (let j = 0; j < NY; j++) {
    const ei = Math.min(i, NX - 1 - i), ej = Math.min(j, NY - 1 - j)
    // two lamps missing at each corner: the corner and the one beside it
    if (ei === 0 && ej <= 1) continue
    lamps++
    const x = -W / 2 + SX * (i + 0.5), y = -D / 2 + SY * (j + 0.5)
    // edge lamps are the short ones, the middle rises to the published 8.14 m
    const t = Math.min(ei / ((NX - 1) / 2), ej / ((NY - 1) / 2))
    const H = 6.6 + 1.3 * Math.sqrt(Math.max(0, t)) + 0.4 * jitter(i, j)
    // one strongly tapered post stands in for the plinth and the shaft (the
    // file budget allows ~16 triangles a lamp)
    shaft(iron, x, y, 0, H - 0.8, 0.32, 0.17)
    head(globe, x, y, H - 0.4, 0.4, 0.45)
  }
}
if (lamps !== 202) throw new Error(`expected 202 lamps, got ${lamps}`)

const parts = [
  { part: iron, material: finish('urban-light-iron', 0xbfc3c2) },
  // frosted globes; named window so they glow at night as the real ones do
  { part: globe, material: { ...PALETTE.window, color: 0xf4f1e8 } },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Urban Light', parts, {
  license: 'CC0-1.0', bearing: 7.8, elevation: 0, height: 8.14,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: [],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/la-urban-light.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${lamps} lamps, ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
