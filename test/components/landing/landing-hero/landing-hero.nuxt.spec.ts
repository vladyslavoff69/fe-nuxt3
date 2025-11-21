import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { ULandingHero } from '@@/.nuxt/components'

describe('LandingHero', () => {
  it.each([
    ['basic case', { }],
    ['with props', {
      props: {
        title: 'Title',
        description: 'Description',
        orientation: 'Vertical',
        links: [
          { label: 'Get Started', icon: 'i-heroicons-rocket-launch', size: 'lg' },
          { label: 'Learn more', trailingIcon: 'i-heroicons-arrow-small-right', color: 'gray', size: 'lg' }
        ]
      }
    }],
    ['with slots', {
      slots: {
        title: () => 'Title slot',
        description: () => 'Description slot',
        top: () => 'Top slot',
        headline: () => 'Headline slot',
        bottom: () => 'Bottom slot',
        default: () => 'Default slot'
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof ULandingHero.props>) => {
    const html = await ComponentRender(nameOrHtml, options, ULandingHero)
    expect(html).toMatchSnapshot()
  })
})
