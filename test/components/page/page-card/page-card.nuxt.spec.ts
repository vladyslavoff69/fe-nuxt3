import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UPageCard } from '@@/.nuxt/components'

describe('PageCard', () => {
  it.each([
    ['basic case', { }],
    ['with props', {
      props: {
        title: 'Title',
        description: 'Description',
        icon: 'i-heroicons-map'
      }
    }],
    ['with slots', {
      slots: {
        header: () => 'Header slot',
        title: () => 'Title slot',
        description: () => 'Description slot',
        icon: () => 'Icon slot',
        footer: () => 'Footer slot',
        default: () => 'Default slot'
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UPageCard.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UPageCard)
    expect(html).toMatchSnapshot()
  })
})
