import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { ULandingSection } from '@@/.nuxt/components'

describe('LandingSection', () => {
  it.each([
    ['basic case', { }],
    ['with props links', {
      props: {
        title: 'Title',
        description: 'Description',
        align: 'center',
        links: [{ label: 'Explore components', color: 'gray', trailingIcon: 'i-heroicons-arrow-right', size: 'lg' }],
        headline: 'Headline',
        icon: 'i-heroicons-map'
      }
    }],
    ['with props features', {
      props: {
        title: 'Title',
        description: 'Description',
        align: 'center',
        features: [{ name: 'Fully customizable', description: 'Like Nuxt UI, change the style of any component from your App Config or customize them specifically through the ui prop.', icon: 'i-heroicons-wrench-screwdriver' },
          { name: 'Slots for everything', description: 'Each component leverages the power of Vue\'s slots to give you the flexibility to build anything.', icon: 'i-heroicons-square-3-stack-3d' }],
        headline: 'Headline',
        icon: 'i-heroicons-map'
      }
    }],
    ['with slots', {
      slots: {
        title: () => 'Title slot',
        description: () => 'Description slot',
        top: () => 'Top slot',
        headline: () => 'Headline slot',
        bottom: () => 'Bottom slot',
        links: () => 'Links slot',
        default: () => 'Default slot'
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof ULandingSection.props>) => {
    const html = await ComponentRender(nameOrHtml, options, ULandingSection)
    expect(html).toMatchSnapshot()
  })
})
