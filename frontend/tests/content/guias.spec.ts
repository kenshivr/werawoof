import { describe, expect, it } from 'vitest'
import { getGuia, guiaAuthor, guias } from '~/content/guias'

/* Invariants of the typed guide content. These are the rules the pages,
   the sitemap and the llms files rely on, so a broken entry fails here
   instead of in production. */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const REQUIRED_SLUGS = [
  'como-organizar-un-playdate-seguro-para-tu-perro',
  'parques-pet-friendly-cdmx-para-pasear-y-socializar-a-tu-perro',
  'como-socializar-a-un-perro-adulto-o-timido',
  'tinder-para-perros-que-es-y-como-funciona',
  'como-presentar-dos-perros-por-primera-vez',
  'que-raza-es-mi-perro-como-saberlo',
  'como-encontrar-amigos-para-tu-perro',
]

describe('guias content', () => {
  it('has unique kebab-case slugs', () => {
    const slugs = guias.map((g) => g.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) expect(slug).toMatch(KEBAB)
  })

  it('includes every published guide', () => {
    const slugs = guias.map((g) => g.slug)
    for (const slug of REQUIRED_SLUGS) expect(slugs).toContain(slug)
  })

  it.each(guias.map((g) => [g.slug, g] as const))('%s is well formed', (_slug, guia) => {
    expect(guia.title.trim().length).toBeGreaterThan(10)
    expect(guia.metaTitle.trim().length).toBeGreaterThan(10)
    expect(guia.metaTitle.length).toBeLessThanOrEqual(60)
    expect(guia.description.length).toBeGreaterThanOrEqual(85)
    expect(guia.description.length).toBeLessThanOrEqual(155)
    expect(guia.datePublished).toMatch(ISO_DATE)
    expect(guia.dateModified).toMatch(ISO_DATE)
    expect(guia.dateModified >= guia.datePublished).toBe(true)
    expect(Number.isInteger(guia.readingMinutes)).toBe(true)
    expect(guia.readingMinutes).toBeGreaterThan(0)
    expect(guia.intro.trim().length).toBeGreaterThan(40)
    expect(guia.sections.length).toBeGreaterThanOrEqual(3)
    for (const section of guia.sections) {
      expect(section.heading.trim().length).toBeGreaterThan(0)
      expect(section.blocks.length).toBeGreaterThan(0)
      for (const block of section.blocks) {
        if (block.type === 'ul' || block.type === 'ol')
          expect(block.items.length).toBeGreaterThan(0)
        else expect(block.text.trim().length).toBeGreaterThan(0)
      }
    }
  })

  it('looks guides up by slug', () => {
    expect(getGuia(REQUIRED_SLUGS[0])?.slug).toBe(REQUIRED_SLUGS[0])
    expect(getGuia('no-existe')).toBeUndefined()
  })
})

describe('guiaAuthor', () => {
  it('is the same person entity as the about page', () => {
    expect(guiaAuthor['@type']).toBe('Person')
    expect(guiaAuthor['@id']).toBe('https://werawoof.com/#brayan')
    expect(guiaAuthor.name).toBe('Brayan Vidal Romero')
    expect(guiaAuthor.url).toBe('https://werawoof.com/quienes-somos')
  })
})
