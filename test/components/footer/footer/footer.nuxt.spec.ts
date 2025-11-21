import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UFooter } from '@@/.nuxt/components'

describe('Footer', () => {
  const links = [{
    label: 'Nuxt UI',
    to: 'https://ui.nuxt.com/'
  }, {
    label: 'Nuxt Docs',
    to: 'https://nuxt.com'
  }, {
    label: 'Nuxt Studio',
    to: 'https://nuxt.studio'
  }]

  it.each([
    ['basic case', { }],
    ['with props', {
      props: {
        links
      }
    }],
    ['with slots', {
      slots: {
        right: () => 'Right slot',
        left: () => 'Left slot'
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UFooter.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UFooter)
    expect(html).toMatchSnapshot()
  })
})
