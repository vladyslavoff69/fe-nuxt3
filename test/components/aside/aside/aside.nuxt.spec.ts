import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UAside } from '@@/.nuxt/components';

describe('Aside', () => {
  const links = [{
    label: 'Documentation',
    icon: 'i-heroicons-book-open-solid',
    to: '/getting-started'
  }, {
    label: 'Playground',
    icon: 'i-simple-icons-stackblitz',
    to: '/playground'
  }, {
    label: 'Roadmap',
    icon: 'i-heroicons-beaker',
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
    }],
    ['with slots', {
      slots: {
        top: () => 'topSlot',
        links: () => 'linksSlot',
        default: () => 'Default Slot',
        bottom: () => 'bottomSlot'
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UAside.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UAside)
    expect(html).toMatchSnapshot()
  })
})
