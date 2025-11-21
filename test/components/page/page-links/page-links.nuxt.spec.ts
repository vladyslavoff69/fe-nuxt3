import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UPageLinks } from '@@/.nuxt/components'

describe('PageLinks', () => {
  const links = [
    { icon: 'i-heroicons-pencil-square', label: 'Edit this page' },
    { icon: 'i-heroicons-star', label: 'Star on GitHub', to: 'https://github.com/nuxt/ui', target: '_blank' },
    { icon: 'i-heroicons-book-open', label: 'Nuxt documentation', to: 'https://nuxt.com', target: '_blank' }
  ]

  it.each([
    ['basic case', { }],
    ['with props', {
      props: {
        title: 'Title',
        links
      }
    }],
    ['with slots', {
      slots: {
        title: () => 'Title slot',
        default: () => 'Default slot'
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UPageLinks.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UPageLinks)
    expect(html).toMatchSnapshot()
  })
})
