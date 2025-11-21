import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UHeaderPopoverLinks } from '@@/.nuxt/components'

describe('HeaderPopoverLinks', () => {
  const links = [{
    label: 'Pricing',
    to: '/pro/pricing',
    icon: 'i-heroicons-credit-card',
    description: 'A simple pricing, for solo developers or teams.'
  }, {
    label: 'Templates',
    to: '/pro/templates',
    icon: 'i-heroicons-computer-desktop',
    description: 'Get started with one of our official templates.'
  }, {
    label: 'Getting Started',
    to: '/pro/getting-started',
    icon: 'i-heroicons-book-open',
    description: 'Learn how to use Nuxt UI Pro in your app.'
  }, {
    label: 'Components',
    to: '/pro/components',
    icon: 'i-heroicons-cube',
    description: 'Discover all the components available in Nuxt UI Pro.'
  }]

  it.each([
    ['basic case', { }],
    ['with props', {
      props: {
        links
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UHeaderPopoverLinks.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UHeaderPopoverLinks)
    expect(html).toMatchSnapshot()
  })
})
