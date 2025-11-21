import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UPage } from '@@/.nuxt/components'

describe('Page', () => {
  it.each([
    ['basic case', { }],
    ['with slots', {
      slots: {
        left: () => 'Left slot',
        right: () => 'Right slot',
        default: () => 'Default slot'
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UPage.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UPage)
    expect(html).toMatchSnapshot()
  })
})
