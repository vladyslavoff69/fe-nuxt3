import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { ULandingLogos } from '@@/.nuxt/components'

describe('LandingLogos', () => {
  it.each([
    ['basic case', { }],
    ['with props', {
      props: {
        align: 'Align',
        title: 'Title'
      }
    }],
    ['with slots', {
      slots: {
        title: () => 'Title slot'
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof ULandingLogos.props>) => {
    const html = await ComponentRender(nameOrHtml, options, ULandingLogos)
    expect(html).toMatchSnapshot()
  })
})
