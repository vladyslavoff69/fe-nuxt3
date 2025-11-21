import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UPricingGrid } from '@@/.nuxt/components'

describe('PricingGrid', () => {
  it.each([
    ['basic case', { }],
    ['with props', {
      props: {
        compact: true
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UPricingGrid.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UPricingGrid)
    expect(html).toMatchSnapshot()
  })
})
