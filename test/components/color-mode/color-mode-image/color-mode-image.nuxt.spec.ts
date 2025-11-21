import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UColorModeImage } from '@@/.nuxt/components'

describe('ColorModeImage', () => {
  const light = 'https://source.unsplash.com/random/200x200?sky'
  const dark = 'https://source.unsplash.com/random/200x200?stars'

  it.each([
    ['basic case', { }],
    ['with props', {
      props: {
        light,
        dark
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UColorModeImage.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UColorModeImage)
    expect(html).toMatchSnapshot()
  })
})
