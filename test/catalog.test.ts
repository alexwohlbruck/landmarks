import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { validateCatalog, type Catalog } from '../src/catalog'
import { glbBounds } from '../src/glb'
import { checkCatalog } from '../src/release'
import { box, material, writeGlb } from './helpers'
import { axisAngle } from '../generators/mesh'

const ROOT = join(import.meta.dir, '..')
const model = (id: string) => new Uint8Array(readFileSync(join(ROOT, 'models', `${id}.glb`)))

describe('the catalog', () => {
  test('is valid, and every model it lists exists and stands on its origin', () => {
    const catalog = JSON.parse(readFileSync(join(ROOT, 'catalog.json'), 'utf8')) as Catalog
    expect(checkCatalog(ROOT, catalog)).toEqual([])
  })
})

describe('validateCatalog', () => {
  const ok: Catalog = {
    models: [{ id: 'tower', file: 'models/tower.glb', license: 'CC0-1.0', author: 'me' }],
    landmarks: [{ id: 'the-tower', name: 'Tower', model: 'tower', lng: 2.29, lat: 48.86, replaces: ['way/1'] }],
  }

  test('passes a well-formed catalog', () => {
    expect(validateCatalog(ok)).toEqual([])
  })

  test('reports every problem at once', () => {
    const problems = validateCatalog({
      models: [{ id: 'Tower', file: '../tower.obj', license: '', author: 'me' }],
      landmarks: [{ id: 'a', name: 'A', model: 'missing', lng: 200, lat: 0, scale: 0, replaces: ['5013364'] }],
    })
    expect(problems.length).toBeGreaterThanOrEqual(8)
  })

  test('refuses a CC-BY model with no credit to show', () => {
    expect(validateCatalog({ ...ok, models: [{ ...ok.models[0], license: 'CC-BY-3.0' }] })).toEqual([
      'model "tower": a CC-BY-3.0 model needs an attribution',
    ])
  })

  test('requires OSM refs with their type, since a bare number is ambiguous', () => {
    expect(validateCatalog({ ...ok, landmarks: [{ ...ok.landmarks[0], replaces: ['5013364'] }] })[0]).toContain('not an OSM ref')
  })

  test('flags a model nothing places', () => {
    const problems = validateCatalog({ ...ok, models: [...ok.models, { ...ok.models[0], id: 'spare' }] })
    expect(problems).toEqual(['model "spare": not placed anywhere'])
  })
})

describe('glbBounds', () => {
  test('reads the Eiffel Tower as 330 m tall on a 125 m base', () => {
    const { height, radius } = glbBounds(model('eiffel-tower'))
    expect(height).toBeCloseTo(330, 0)
    expect(radius).toBeCloseTo(62.5 * Math.SQRT2, 0)
  })

  test('carries a child node’s box through its translation', () => {
    const glb = writeGlb('test', [{ part: box([-1, -1, 0], [1, 1, 2]), material }], {}, {
      nodes: [{ name: 'lamp', translation: [10, 0, 20], parts: [{ part: box([-1, -1, -1], [1, 1, 1]), material }] }],
    })
    const { height, radius } = glbBounds(glb)
    expect(height).toBeCloseTo(21, 5)
    expect(radius).toBeCloseTo(Math.hypot(11, 1), 5)
  })

  test('bounds an animated node by a sphere about its pivot', () => {
    const glb = writeGlb('test', [{ part: box([-1, -1, 0], [1, 1, 2]), material }], {}, {
      nodes: [{ name: 'arm', translation: [0, 0, 20], parts: [{ part: box([0, -0.5, -0.5], [10, 0.5, 0.5]), material }] }],
      animation: {
        name: 'turn',
        times: [0, 1, 2, 3, 4],
        channels: [{ node: 0, path: 'rotation', values: [0, 1, 2, 3, 4].map((i) => axisAngle([0, 1, 0], (i / 4) * Math.PI * 2)) }],
      },
    })
    const tip = Math.hypot(10, 0.5, 0.5)
    const { height, radius } = glbBounds(glb)
    expect(height).toBeCloseTo(20 + tip, 5)
    expect(radius).toBeCloseTo(tip, 5)
  })

  test('keeps the moving Skytower cabin within the tower’s reach', () => {
    const { height, radius } = glbBounds(model('carowinds-skytower'))
    expect(height).toBeCloseTo(87, 0)
    expect(radius).toBeLessThan(10)
  })

  test('keeps the turning Wonder Wheel at its full height', () => {
    const { height, radius } = glbBounds(model('wonder-wheel'))
    expect(height).toBeGreaterThanOrEqual(46)
    expect(height).toBeLessThan(50)
    expect(radius).toBeGreaterThanOrEqual(22.4)
    expect(radius).toBeLessThan(26)
  })
})
