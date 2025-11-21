import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UColorModeAvatar } from '@@/.nuxt/components'

describe('ColorModeAvatar', () => {
  const light = 'https://avatars.githubusercontent.com/u/739984?v=4'
  const dark = 'https://avatars.githubusercontent.com/u/904724?v=4'

  it.each([
    ['basic case', { }],
    ['with props', {
      props: {
        light,
        dark
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UColorModeAvatar.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UColorModeAvatar)
    expect(html).toMatchSnapshot()
  })
})
