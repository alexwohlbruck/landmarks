import { expect, test } from 'bun:test'
import { creditPresentation } from '../web/credits'
import { validateCatalog, type Catalog, type Credit } from '../src/catalog'
import { buildRelease } from '../src/release'
import { box, material, writeGlb } from './helpers'

const alex: Credit = { name: 'Alex Wohlbruck', kind: 'person', github: 'alexwohlbruck', role: 'creator' }
const claude: Credit = { name: 'Claude', kind: 'ai', model: 'Claude Opus 5.5', role: 'procedural modeling' }
const catalog = (credits: Credit[]): Catalog => ({ models: [{ id: 'tower', file: 'models/tower.glb', credits }], landmarks: [{ id: 'tower', name: 'Tower', model: 'tower', lng: 0, lat: 0 }] })

test('GitHub authors use their profile avatar and accept an optional @ prefix', () => {
  expect(creditPresentation(alex)).toMatchObject({ initials: 'AW', avatarUrl: 'https://github.com/alexwohlbruck.png?size=80', profileUrl: 'https://github.com/alexwohlbruck' })
  expect(creditPresentation({ ...alex, github: '@alexwohlbruck' })).toEqual(creditPresentation(alex))
})
test('Claude uses its icon and displays the model separately from the author name', () => {
  const profile = creditPresentation(claude)
  expect(profile.avatarUrl).toBe('claude.ico')
  expect(profile.detail).toContain('Claude Opus 5.5')
  expect(claude.name).toBe('Claude')
})
test('authors without a GitHub username use initials without a guessed photo', () => {
  expect(creditPresentation({ name: 'Ada Lovelace', kind: 'person' })).toMatchObject({ initials: 'AL', avatarUrl: undefined })
  expect(creditPresentation({ name: 'Ada', kind: 'person' }).initials).toBe('AD')
})
test('AI credits require the model used, and GitHub usernames must be valid', () => {
  expect(validateCatalog(catalog([alex, claude]))).toEqual([])
  expect(validateCatalog(catalog([{ name: 'Claude', kind: 'ai' }])).join()).toContain('AI credit needs the model used')
  expect(validateCatalog(catalog([{ ...alex, github: 'https://github.com/alexwohlbruck' }])).join()).toContain('invalid GitHub username')
  expect(validateCatalog(catalog([{ ...alex, github: 'bad--login' }])).join()).toContain('invalid GitHub username')
  expect(validateCatalog(catalog([{ ...alex, model: 'Claude Opus 5.5' }])).join()).toContain('model used belongs on an AI credit')
})
test('published metadata retains GitHub identity and LLM provenance', () => {
  const bytes = writeGlb('test', [{ part: box([-1, -1, 0], [1, 1, 2]), material }])
  const asset = buildRelease('', catalog([alex, claude]), () => bytes).assets[0]
  expect(asset.authors).toEqual(['Alex Wohlbruck', 'Claude'])
  expect(asset.credits).toEqual([alex, claude])
})
