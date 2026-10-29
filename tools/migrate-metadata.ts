/** One-time migration from the former demo regions to explicit catalog places.
 * New contributions choose a place explicitly; no runtime nearest-city guesses. */
import type { Catalog, ModelType, Place } from '../src/catalog'
const file = new URL('../catalog.json', import.meta.url)
const catalog: Catalog = await Bun.file(file).json()
if (catalog.places) throw new Error('Catalog already has places; edit those records directly.')
const places: Place[] = [
  { id: 'paris', name: 'Paris', kind: 'city', wikidata: 'Q90' },
  { id: 'new-york-area', name: 'New York metropolitan area', kind: 'region' },
  { id: 'chicago-area', name: 'Chicago area', kind: 'region' },
  { id: 'charlotte-area', name: 'Charlotte area', kind: 'region' },
  { id: 'washington-area', name: 'Washington, DC area', kind: 'region' },
  { id: 'los-angeles-area', name: 'Los Angeles area', kind: 'region' },
  { id: 'san-francisco-bay-area', name: 'San Francisco Bay Area', kind: 'region' },
  { id: 'las-vegas-area', name: 'Las Vegas area', kind: 'region' },
  { id: 'seattle-area', name: 'Seattle area', kind: 'region' },
  { id: 'walt-disney-world', name: 'Walt Disney World', kind: 'site' },
  { id: 'disneyland', name: 'Disneyland Resort', kind: 'site', parent: 'los-angeles-area' },
  { id: 'carowinds', name: 'Carowinds', kind: 'site', parent: 'charlotte-area' },
  { id: 'camp-north-end', name: 'Camp North End', kind: 'site', parent: 'charlotte-area' },
]
const coasters = new Set(`carowinds-fury-325 carowinds-thunder-striker carowinds-carolina-goldrusher carowinds-hurler carowinds-carolina-cyclone carowinds-flying-cobras carowinds-ricochet carowinds-kiddy-hawk carowinds-wilderness-run carowinds-woodstock-express carowinds-snoopys-racing-railway carowinds-copperhead-strike carowinds-afterburn carowinds-vortex coney-island-cyclone dlr-incredicoaster dlr-matterhorn dlr-space-mountain dlr-big-thunder-mountain wdw-big-thunder-mountain wdw-epcot-cosmic-rewind wdw-expedition-everest wdw-rock-n-roller-coaster wdw-slinky-dog-dash wdw-space-mountain wdw-tron-lightcycle-run wdw-seven-dwarfs-mine-train wdw-barnstormer lv-big-apple-coaster`.split(' '))
const sculptures = new Set('statue-of-liberty vessel unisphere independence-square-statues metalmorphosis il-grande-disco ascendus chi-cloud-gate chi-picasso chi-flamingo lv-seven-magic-mountains'.split(' '))
for (const m of catalog.models) {
  let type: ModelType = 'building'
  if (/bridge/.test(m.id)) type = 'bridge'
  else if (coasters.has(m.id)) type = 'coaster'
  else if (/fountain/.test(m.id)) type = 'fountain'
  else if (sculptures.has(m.id) || /statue|sculpture/.test(m.id)) type = 'sculpture'
  else if (/memorial|monument|arch$/.test(m.id)) type = 'monument'
  else if (/stadium|coliseum|arena|truist-field|soldier-field|wrigley-field|rate-field|united-center|spectrum-center|nationals-park|audi-field|rose-bowl|t-mobile-park/.test(m.id)) type = 'stadium'
  else if (/wheel|windseeker|skytower|high-roller|guardians-mission|tower-of-terror|golden-zephyr|slotzilla/.test(m.id)) type = 'ride'
  else if (/eiffel-tower|water-tower|control-tower|space-needle/.test(m.id)) type = 'tower'
  // A broad landmark category is honest for scenic and themed structures.
  else if (/batuu-spires|floating-mountains|tree-of-life|millennium-falcon|hollywood-sign/.test(m.id)) type = 'landmark'
  m.type = type
  m.collection = 'landmarks'
  if (!m.author || m.author === 'Barrelman') {
    m.author = 'Alex Wohlbruck'
    m.credits = [
      { name: 'Alex Wohlbruck', kind: 'person', role: 'creator', github: 'alexwohlbruck' },
      { name: 'Claude', kind: 'ai', role: 'procedural modeling', model: 'Claude Opus 5.5', url: 'https://claude.ai/' },
    ]
  } else m.credits = [{ name: m.author, kind: 'person', role: 'creator' }]
  m.tags = []
  if (/^(wdw|dlr|carowinds)-/.test(m.id)) m.tags.push('theme-park')
  if (/museum/.test(m.id)) m.tags.push('museum')
  if (/cathedral|church|presbyterian|temple|shrine/.test(m.id)) m.tags.push('religious')
  if (/water-tower/.test(m.id)) m.tags.push('water-tower')
  if (/theater|theatre/.test(m.id)) m.tags.push('theatre')
  m.reviewStatus = 'unreviewed'
}
for (const l of catalog.landmarks) {
  const { id, lng, lat } = l
  if (id.startsWith('wdw-')) l.place = 'walt-disney-world'
  else if (id.startsWith('dlr-')) l.place = 'disneyland'
  else if (id.startsWith('carowinds-')) l.place = 'carowinds'
  else if (id.startsWith('clt-cne-')) l.place = 'camp-north-end'
  else if (lng > 2 && lng < 3 && lat > 48 && lat < 49) l.place = 'paris'
  else if (lng > -75 && lng < -73 && lat > 40 && lat < 42) l.place = 'new-york-area'
  else if (lng > -89 && lng < -87 && lat > 41 && lat < 43) l.place = 'chicago-area'
  else if (lng > -82 && lng < -80 && lat > 34 && lat < 36) l.place = 'charlotte-area'
  else if (lng > -78 && lng < -76 && lat > 38 && lat < 40) l.place = 'washington-area'
  else if (lng > -120 && lng < -117 && lat > 33 && lat < 35) l.place = 'los-angeles-area'
  else if (lng > -124 && lng < -121 && lat > 37 && lat < 39) l.place = 'san-francisco-bay-area'
  else if (lng > -116 && lng < -114 && lat > 35 && lat < 37) l.place = 'las-vegas-area'
  else if (lng > -123 && lng < -121 && lat > 47 && lat < 49) l.place = 'seattle-area'
  else throw new Error(`Choose a place for ${id}`)
}
catalog.places = places
await Bun.write(file, JSON.stringify(catalog, null, 2) + '\n')
