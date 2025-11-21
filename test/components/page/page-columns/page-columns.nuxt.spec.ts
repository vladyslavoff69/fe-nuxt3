import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UPageColumns } from '@@/.nuxt/components'

describe('PageColumns', () => {
  it.each([
    ['basic case', { }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UPageColumns.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UPageColumns)
    expect(html).toMatchSnapshot()
  })
})
