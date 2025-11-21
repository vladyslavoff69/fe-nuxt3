import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UNavigationAccordion } from '@@/.nuxt/components'

describe('NavigationAccordion', () => {
  const links = [{
    label: 'Getting Started',
    icon: 'i-heroicons-book-open',
    children: [{
      label: 'Introduction',
      to: '/getting-started'
    }, {
      label: 'Installation',
      to: '/pro/getting-started/installation'
    }, {
      label: 'Theming',
      to: '/pro/getting-started/theming'
    }, {
      label: 'Structure',
      to: '/pro/getting-started/structure'
    }, {
      label: 'Content',
      to: '/pro/getting-started/content'
    }]
  }]

  it.each([
    ['basic case', { }],
    ['with props', {
      props: {
        links
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UNavigationAccordion.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UNavigationAccordion)
    expect(html).toMatchSnapshot()
  })
})
