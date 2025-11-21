import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { ULandingCTA } from '@@/.nuxt/components'

describe('LandingCTA', () => {
  it.each([
    ['basic case', { }],
    ['with props', {
      props: {
        title: 'title',
        description: 'description',
        card: true,
        links: [
          { label: 'Get started', color: 'gray', size: 'md' },
          { label: 'Learn more', variant: 'link', color: 'gray', size: 'md', trailingIcon: 'i-heroicons-arrow-right-20-solid' }
        ],
        align: 'center'
      }
    }],
    ['with slots', {
      slots: {
        title: () => 'Title slot',
        description: () => 'Description slot',
        links: () => 'Links slot',
        default: () => 'default'
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof ULandingCTA.props>) => {
    const html = await ComponentRender(nameOrHtml, options, ULandingCTA)
    expect(html).toMatchSnapshot()
  })
})
