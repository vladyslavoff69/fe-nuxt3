import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UPageBody } from '@@/.nuxt/components'

describe('PageBody', () => {
  it.each([
    ['basic case', { }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UPageBody.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UPageBody)
    expect(html).toMatchSnapshot()
  })
})
