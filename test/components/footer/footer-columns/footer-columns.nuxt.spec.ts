import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UFooterColumns } from '@@/.nuxt/components'

describe('FooterColumns', () => {
  const links = [{
    label: 'Community',
    children: [{
      label: 'Nuxters',
      to: 'https://nuxters.nuxt.com',
      target: '_blank'
    }, {
      label: 'Video Courses',
      to: 'https://masteringnuxt.com/nuxt3?ref=nuxt',
      target: '_blank'
    }, {
      label: 'Nuxt on GitHub',
      to: 'https://github.com/nuxt',
      target: '_blank'
    }]
  }, {
    label: 'Solutions',
    children: [{
      label: 'Nuxt Content',
      to: 'https://content.nuxt.com/',
      target: '_blank'
    }, {
      label: 'Nuxt DevTools',
      to: 'https://devtools.nuxt.com/',
      target: '_blank'
    }, {
      label: 'Nuxt Image',
      to: 'https://image.nuxt.com/',
      target: '_blank'
    }, {
      label: 'Nuxt UI',
      to: 'https://ui.nuxt.com/',
      target: '_blank'
    }]
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
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UFooterColumns.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UFooterColumns)
    expect(html).toMatchSnapshot()
  })
})
