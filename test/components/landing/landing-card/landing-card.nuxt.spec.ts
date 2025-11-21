import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { ULandingCard } from '@@/.nuxt/components'

describe('LandingCard', () => {
  it.each([
    ['basic case', { }],
    ['with props', {
      props: {
        title: 'Title',
        description: 'Description',
        icon: 'i-heroicons-map',
        color: 'red',
        orientation: 'vertical'
      }
    }],
    ['with slots', {
      slots: {
        title: () => 'Title slot',
        description: () => 'Description slot',
        icon: () => 'Icon slot',
        color: () => 'Color slot',
        orientation: () => 'Orientation slot'
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof ULandingCard.props>) => {
    const html = await ComponentRender(nameOrHtml, options, ULandingCard)
    expect(html).toMatchSnapshot()
  })
})
