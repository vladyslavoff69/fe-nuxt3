import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UColorModeSelect } from '@@/.nuxt/components'

describe('ColorModeSelect', () => {
  it.each([
    ['basic case', { }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UColorModeSelect.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UColorModeSelect)
    expect(html).toMatchSnapshot()
  })
})
