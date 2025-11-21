import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UFooterLinks } from '@@/.nuxt/components'

describe('FooterLinks', () => {
  const links = [{
    label: 'Documentation',
    icon: 'i-heroicons-book-open',
    to: '/getting-started'
  }, {
    label: 'Playground',
    icon: 'i-simple-icons-stackblitz',
    to: '/playground'
  }, {
    label: 'Roadmap',
    icon: 'i-heroicons-map',
    to: '/roadmap'
  }, {
    label: 'Pro',
    icon: 'i-heroicons-square-3-stack-3d',
    to: '/pro'
  }, {
    label: 'Releases',
    icon: 'i-heroicons-rocket-launch',
    to: 'https://github.com/nuxt/ui/releases',
    target: '_blank'
  }]

  it.each([
    ['basic case', { }],
    ['with props', {
      props: {
        links
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UFooterLinks.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UFooterLinks)
    expect(html).toMatchSnapshot()
  })
})
