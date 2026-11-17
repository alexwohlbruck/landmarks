/** Lucide icons, inlined at build time so the page needs no icon font or extra requests. */
import bridge from 'lucide-static/icons/bridge.svg' with { type: 'text' }
import building from 'lucide-static/icons/building-2.svg' with { type: 'text' }
import chevronDown from 'lucide-static/icons/chevron-down.svg' with { type: 'text' }
import coaster from 'lucide-static/icons/roller-coaster.svg' with { type: 'text' }
import download from 'lucide-static/icons/download.svg' with { type: 'text' }
import droplets from 'lucide-static/icons/droplets.svg' with { type: 'text' }
import externalLink from 'lucide-static/icons/external-link.svg' with { type: 'text' }
import ferrisWheel from 'lucide-static/icons/ferris-wheel.svg' with { type: 'text' }
import gem from 'lucide-static/icons/gem.svg' with { type: 'text' }
import goal from 'lucide-static/icons/goal.svg' with { type: 'text' }
import history from 'lucide-static/icons/history.svg' with { type: 'text' }
import landmark from 'lucide-static/icons/landmark.svg' with { type: 'text' }
import link from 'lucide-static/icons/link.svg' with { type: 'text' }
import list from 'lucide-static/icons/list.svg' with { type: 'text' }
import mapPin from 'lucide-static/icons/map-pin.svg' with { type: 'text' }
import moon from 'lucide-static/icons/moon.svg' with { type: 'text' }
import panelRight from 'lucide-static/icons/panel-right-close.svg' with { type: 'text' }
import search from 'lucide-static/icons/search.svg' with { type: 'text' }
import shapes from 'lucide-static/icons/shapes.svg' with { type: 'text' }
import sun from 'lucide-static/icons/sun.svg' with { type: 'text' }
import tower from 'lucide-static/icons/tower-control.svg' with { type: 'text' }
import x from 'lucide-static/icons/x.svg' with { type: 'text' }

// Lucide no longer ships brand marks.
const github = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.3-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>'

const icons: Record<string, string> = {
  bridge, building, 'chevron-down': chevronDown, coaster, download, droplets, 'external-link': externalLink,
  'ferris-wheel': ferrisWheel, gem, github, goal, history, landmark, link, list, 'map-pin': mapPin, moon,
  'panel-right': panelRight, search, shapes, sun, tower, x,
}

const typeIcons: Record<string, string> = {
  bridge: 'bridge', building: 'building', coaster: 'coaster', fountain: 'droplets', landmark: 'landmark',
  monument: 'landmark', ride: 'ferris-wheel', sculpture: 'gem', stadium: 'goal', tower: 'tower',
}

/** An inline SVG element for a named icon; unknown names fall back to a neutral shape. */
export function icon(name: string): SVGElement {
  const template = document.createElement('template')
  template.innerHTML = (icons[name] ?? shapes).replace(/<!--[\s\S]*?-->/, '').trim()
  const svg = template.content.firstElementChild as SVGElement
  svg.removeAttribute('class')
  svg.removeAttribute('width')
  svg.removeAttribute('height')
  svg.setAttribute('class', 'icon')
  svg.setAttribute('aria-hidden', 'true')
  return svg
}

export const typeIcon = (type?: string) => icon(typeIcons[type ?? 'landmark'] ?? 'shapes')

/** Fill every `<i data-icon="name">` placeholder in the static page. */
export function hydrateIcons(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('i[data-icon]').forEach(el => el.replaceWith(icon(el.dataset.icon!)))
}
