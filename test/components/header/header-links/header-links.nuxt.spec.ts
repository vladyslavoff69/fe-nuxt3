import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UHeaderLinks } from '@@/.nuxt/components'

describe('HeaderLinks', () => {
  const links = [{
    label: 'Docs',
    icon: 'i-heroicons-book-open',
    to: '/getting-started'
  }, {
    label: 'Pro',
    icon: 'i-heroicons-square-3-stack-3d',
    to: '/pro',
    children: [{
      label: 'Pricing',
      to: '/pro/pricing',
      icon: 'i-heroicons-credit-card',
      description: 'A simple pricing, for solo developers or teams.'
    }, {
      label: 'Templates',
      to: '/pro/templates',
      icon: 'i-heroicons-computer-desktop',
      description: 'Get started with one of our official templates.'
    }]
  }, {
    label: 'Releases',
    icon: 'i-heroicons-rocket-launch',
    to: '/releases'
  }]

  it.each([
    ['basic case', { }],
    ['with props', {
      props: {
        links
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UHeaderLinks.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UHeaderLinks)
    expect(html).toMatchSnapshot()
  })
})
