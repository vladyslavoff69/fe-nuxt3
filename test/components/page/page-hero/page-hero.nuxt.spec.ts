import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UPageHero } from '@@/.nuxt/components'

describe('PageHero', () => {
  it.each([
    ['basic case', { }],
    ['with props', {
      props: {
        title: 'Title',
        description: 'Description',
        icon: 'i-heroicons-map',
        links: [{ label: 'Get started', color: 'black', size: 'lg' }, { label: 'Learn more', color: 'gray', size: 'lg', trailingIcon: 'i-heroicons-arrow-right-20-solid' }],
        align: 'Center'
      }
    }],
    ['with slots', {
      slots: {
        title: () => 'Title slot',
        description: () => 'Description slot',
        links: () => 'Links slot'
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UPageHero.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UPageHero)
    expect(html).toMatchSnapshot()
  })
})
