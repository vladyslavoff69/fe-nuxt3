import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UColorModeToggle } from '@@/.nuxt/components'

describe('ColorModeToggle', () => {
  it.each([
    ['basic case', { }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UColorModeToggle.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UColorModeToggle)
    expect(html).toMatchSnapshot()
  })
})
