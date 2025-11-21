import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'
import { UMain } from '@@/.nuxt/components'

describe('Main', () => {
  it.each([
    ['basic case', { }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UMain.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UMain)
    expect(html).toMatchSnapshot()
  })
})
