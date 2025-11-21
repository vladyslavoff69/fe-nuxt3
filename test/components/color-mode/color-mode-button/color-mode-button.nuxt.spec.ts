import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UColorModeButton } from '@@/.nuxt/components'

describe('ColorModeButton', () => {
  it.each([
    ['basic case', { }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UColorModeButton.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UColorModeButton)
    expect(html).toMatchSnapshot()
  })
})
