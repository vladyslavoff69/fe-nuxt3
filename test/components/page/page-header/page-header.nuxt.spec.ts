import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UPageHeader } from '@@/.nuxt/components'

describe('PageHeader', () => {
  it.each([
    ['basic case', { }],
    ['with props', {
      props: {
        headline: 'Headline',
        title: 'Title',
        description: 'Description',
        icon: 'i-heroicons-map',
        links: [{ label: 'GitHub', color: 'white', to: 'https://github.com/nuxt/ui-pro/blob/dev/components/page/PageHeader.vue', target: '_blank', icon: 'i-simple-icons-github' }]
      }
    }],
    ['with slots', {
      slots: {
        headline: () => 'Headline slot',
        title: () => 'Title slot',
        description: () => 'Description slot',
        icon: () => 'Icon slot',
        links: () => 'Link slot',
        default: () => 'Default slot'
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UPageHeader.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UPageHeader)
    expect(html).toMatchSnapshot()
  })
})
