import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UPricingToggle } from '@@/.nuxt/components'

describe('PricingToggle', () => {
  it.each([
    ['basic case', { }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UPricingToggle.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UPricingToggle)
    expect(html).toMatchSnapshot()
  })
})
