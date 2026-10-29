import type { Credit } from '../src/catalog'

export function creditPresentation(credit: Credit) {
  const github = credit.github?.replace(/^@/, '')
  const words = credit.name.trim().split(/\s+/).filter(Boolean)
  const initials = (words.length > 1 ? words[0][0] + words.at(-1)![0] : words[0]?.slice(0, 2) ?? '?').toLocaleUpperCase()
  const claude = credit.kind === 'ai' && /^claude\b/i.test(credit.name)
  return {
    initials,
    github,
    profileUrl: github ? `https://github.com/${github}` : credit.url,
    avatarUrl: github ? `https://github.com/${github}.png?size=80` : claude ? 'claude.ico' : undefined,
    detail: [github ? `@${github}` : '', credit.role, credit.kind === 'ai' ? credit.model ?? 'AI' : ''].filter(Boolean).join(' · '),
  }
}

export function renderCredit(credit: Credit, assetUrl: (path: string) => string): HTMLLIElement {
  const presentation = creditPresentation(credit)
  const item = document.createElement('li')
  item.className = 'author-credit'
  const identity = document.createElement(presentation.profileUrl ? 'a' : 'span')
  identity.className = 'credit-identity'
  if (identity instanceof HTMLAnchorElement) identity.href = presentation.profileUrl!
  const avatar = document.createElement('span')
  avatar.className = 'author-avatar'
  avatar.setAttribute('aria-hidden', 'true')
  avatar.textContent = presentation.initials
  if (presentation.avatarUrl) {
    const image = document.createElement('img')
    image.alt = ''
    image.width = image.height = 32
    image.referrerPolicy = 'no-referrer'
    image.addEventListener('error', () => image.remove())
    image.src = assetUrl(presentation.avatarUrl)
    avatar.append(image)
  }
  const text = document.createElement('span')
  text.className = 'author-text'
  const name = document.createElement('span')
  name.className = 'author-name'
  name.textContent = credit.name
  text.append(name)
  if (presentation.detail) {
    const detail = document.createElement('small')
    detail.textContent = presentation.detail
    text.append(detail)
  }
  identity.append(avatar, text)
  item.append(identity)
  return item
}
