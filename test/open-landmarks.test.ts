import { describe, expect, test } from 'bun:test'
import { Part, type V3 } from '../generators/mesh'
import { parseGlb } from '../src/glb'
import { convert } from '../src/open-landmarks/convert'
import { fitBudget, resolveMaterials, type Library } from '../src/open-landmarks/materials'
import { clipBelowGround, type Triangle } from '../src/open-landmarks/mesh'
import { attachWindows } from '../src/open-landmarks/windows'
import { box, worldVertices, writeGlb } from './helpers'

const library: Library = {
  materials: {
    stone: { color: '#efe4d3', roughness: 0.85, metalness: 0 },
    roof: { color: '#9da6ad', roughness: 0.85, metalness: 0 },
    window: { color: '#64798a', roughness: 0.35, metalness: 0 },
  },
  windowSupportMaterials: ['stone'],
}

/** A vertical quad in the plane z = `z` (glTF axes), facing +Z, as two triangles. */
function panel(material: number, x0: number, x1: number, y0: number, y1: number, z: number): Triangle[] {
  const n: V3 = [0, 0, 1]
  const a: V3 = [x0, y0, z], b: V3 = [x1, y0, z], c: V3 = [x1, y1, z], d: V3 = [x0, y1, z]
  return [{ material, p: [a, b, c], n: [n, n, n] }, { material, p: [a, c, d], n: [n, n, n] }]
}

const area = (ts: Triangle[]) =>
  ts.reduce((s, t) => {
    const [a, b, c] = t.p
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    return s + Math.hypot(u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]) / 2
  }, 0)

describe('attachWindows', () => {
  const roles = { window: 1, glazing: 2, supports: new Set([0]) }

  test('clips a panel to its wall and keeps the overhang as glazing', () => {
    const wall = panel(0, 0, 10, 0, 10, 0)
    const win = panel(1, 8, 12, 2, 4, 0.04)
    const { triangles } = attachWindows([...wall, ...win], roles)
    expect(area(triangles.filter((t) => t.material === 1))).toBeCloseTo(4, 5)
    expect(area(triangles.filter((t) => t.material === 2))).toBeCloseTo(4, 5)
  })

  test('sets a proud panel 2 cm off its wall', () => {
    const { triangles } = attachWindows([...panel(0, 0, 10, 0, 10, 0), ...panel(1, 2, 4, 2, 4, 0.2)], roles)
    for (const t of triangles.filter((t) => t.material === 1)) for (const p of t.p) expect(p[2]).toBeCloseTo(0.02, 6)
  })

  test('a window with no wall behind it becomes glazing whole', () => {
    const { triangles } = attachWindows(panel(1, 0, 2, 0, 2, 0), roles)
    expect(triangles.every((t) => t.material === 2)).toBe(true)
  })
})

test('clipBelowGround cuts at y = 0 and keeps the area above', () => {
  const n: V3 = [0, 0, 1]
  const t: Triangle = { material: 0, p: [[0, -1, 0], [2, -1, 0], [0, 1, 0]], n: [n, n, n] }
  const out = clipBelowGround([t])
  expect(Math.min(...out.flatMap((t) => t.p.map((p) => p[1])))).toBe(0)
  expect(area(out)).toBeCloseTo(0.5, 6)
})

describe('materials', () => {
  const source = (name: string, hex: number, roughness = 0.85) => ({ name, hex, roughness, metalness: 0, textured: false, masked: false, doubleSided: false })

  test('a library colour keeps its name; any other becomes a finish named after the model', () => {
    const r = resolveMaterials('tower', [source('stone', 0xefe4d3), source('stone', 0xd9cbc1), source('granite', 0xd9cbc1)], library)
    expect(r.names).toEqual(['stone', 'tower-stone', 'tower-granite'])
    expect(r.finishes['tower-granite']).toEqual({ color: '#d9cbc1', roughness: 0.85, metalness: 0 })
    expect(r.supports).toEqual(['tower-stone', 'tower-granite'])
  })

  test('a tinted window keeps its tint and is not a wall', () => {
    const r = resolveMaterials('tower', [source('window', 0x64798a, 0.35), source('window-2', 0x93a8bb, 0.35)], library)
    expect(r.names).toEqual(['window', 'tower-window-2'])
    expect(r.supports).toEqual([])
  })

  test('fitBudget folds the closest colours first, never window', () => {
    const colors: Record<string, string> = { window: '#64798a', a: '#ffffff', b: '#fefefe', c: '#ff0000', d: '#00ff00', e: '#0000ff', f: '#000000' }
    const folds = fitBudget(new Map(Object.keys(colors).map((k) => [k, 1])), (n) => colors[n])
    expect(folds).toHaveLength(1)
    expect([folds[0].from, folds[0].into].sort()).toEqual(['a', 'b'])
  })
})

test('convert writes one flat static node at the library colours, standing on y = 0, keeping double sides', () => {
  const walls = box([-5, -5, -1], [5, 5, 20])
  const glazing = new Part()
  glazing.quad([-2, -5.04, 2], [2, -5.04, 2], [2, -5.04, 6], [-2, -5.04, 6])
  const glb = writeGlb('t', [
    { part: walls, material: { name: 'stone', color: 0xefe4d3, doubleSided: true } },
    { part: glazing, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
  ])
  const out = convert('t', 't', glb, { bearing: 30 }, library)
  const { json } = parseGlb(out.detail.glb)
  expect(json.nodes).toEqual([{ name: 't', mesh: 0 }])
  expect(json.materials.map((m: any) => m.name).sort()).toEqual(['stone', 'window'])
  expect(json.materials.find((m: any) => m.name === 'stone').doubleSided).toBe(true)
  expect(json.materials.find((m: any) => m.name === 'window').doubleSided).toBeUndefined()
  const stone = json.materials.find((m: any) => m.name === 'stone').pbrMetallicRoughness.baseColorFactor
  expect(stone[0]).toBeCloseTo(((0xef / 255 + 0.055) / 1.055) ** 2.4, 6)
  const [{ positions }] = worldVertices(out.detail.glb)
  expect(Math.min(...positions.map((p) => p[1]))).toBe(0)
})
