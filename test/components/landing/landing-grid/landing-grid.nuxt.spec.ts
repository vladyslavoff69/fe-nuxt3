import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { ULandingGrid } from '@@/.nuxt/components'

describe('LandingGrid', () => {
  it.each([
    ['basic case', { }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof ULandingGrid.props>) => {
    const html = await ComponentRender(nameOrHtml, options, ULandingGrid)
    expect(html).toMatchSnapshot()
  })
})
