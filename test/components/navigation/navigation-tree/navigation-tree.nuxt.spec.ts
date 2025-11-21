import type { NavItem } from '@nuxt/content/dist/runtime/types'
import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UNavigationTree } from '@@/.nuxt/components'

describe('NavigationTree', () => {
  it.each([
    ['basic case', { }],
    ['with props', {
      props: {
        links: inject<Ref<NavItem[]>>('navigation'),
        defaultOpen: true,
        multiple: true
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UNavigationTree.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UNavigationTree)
    expect(html).toMatchSnapshot()
  })
})
