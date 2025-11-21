import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UNavigationLinks } from '@@/.nuxt/components'

describe('NavigationLinks', () => {
  const links = [{
    label: 'DocsSearch',
    to: '/pro/components/docs-search',
    icon: 'i-heroicons-document-magnifying-glass'
  }, {
    label: 'DocsSearchButton',
    to: '/pro/components/docs-search-button',
    icon: 'i-heroicons-magnifying-glass',
    badge: 'New'
  }, {
    label: 'DocsSurround',
    to: '/pro/components/docs-surround',
    icon: 'i-heroicons-arrows-right-left'
  }, {
    label: 'DocsToc',
    to: '/pro/components/docs-toc',
    icon: 'i-heroicons-list-bullet'
  }]

  it.each([
    ['basic case', { }],
    ['with props', {
      props: {
        links
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UNavigationLinks.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UNavigationLinks)
    expect(html).toMatchSnapshot()
  })
})
