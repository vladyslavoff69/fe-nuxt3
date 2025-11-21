import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UPageGrid } from '@@/.nuxt/components'

describe('PageGrid', () => {
  it.each([
    ['basic case', { }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UPageGrid.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UPageGrid)
    expect(html).toMatchSnapshot()
  })
})
