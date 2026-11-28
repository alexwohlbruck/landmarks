import { expect, test } from 'bun:test'
import type { Catalog } from '../src/catalog'
import { landmarksTouchedBy, scopeCatalog } from '../src/scope'

const catalog = {
  places: [{ id: 'city' }, { id: 'town' }],
  models: [
    { id: 'tower', file: 'models/tower.glb', detail: 'models/tower.detail.glb', source: 'generators/tower.ts' },
    { id: 'hall', file: 'models/hall.glb', source: 'generators/campus.ts' },
    { id: 'gym', file: 'models/gym.glb', source: 'generators/campus.ts' },
  ],
  landmarks: [
    { id: 'tower', model: 'tower', place: 'city' },
    { id: 'tower-copy', model: 'tower', place: 'town' },
    { id: 'hall', model: 'hall', place: 'city' },
    { id: 'gym', model: 'gym', place: 'town' },
  ],
} as unknown as Catalog

const touched = (...paths: string[]) => [...landmarksTouchedBy(paths, catalog)].sort()

test('a changed placement is in scope, and only it', () => {
  expect(touched('catalog/landmarks/hall.json')).toEqual(['hall'])
})

test('a changed model, GLB or generator brings in every placement of it', () => {
  expect(touched('catalog/models/tower.json')).toEqual(['tower', 'tower-copy'])
  expect(touched('models/tower.detail.glb')).toEqual(['tower', 'tower-copy'])
  expect(touched('generators/campus.ts')).toEqual(['gym', 'hall'])
})

test('a changed place brings in the landmarks in it', () => {
  expect(touched('catalog/places/town.json')).toEqual(['gym', 'tower-copy'])
})

test('deleted landmarks and unrelated files add nothing', () => {
  expect(touched('catalog/landmarks/gone.json', 'README.md', 'generators/mesh.ts')).toEqual([])
})

test('the cut-down catalog keeps the models its landmarks place and every place', () => {
  const c = scopeCatalog(catalog, new Set(['hall']))
  expect(c.landmarks.map(l => l.id)).toEqual(['hall'])
  expect(c.models.map(m => m.id)).toEqual(['hall'])
  expect(c.places).toHaveLength(2)
})
