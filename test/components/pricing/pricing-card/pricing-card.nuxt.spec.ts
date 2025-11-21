import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UPricingCard } from '@@/.nuxt/components'

describe('PricingCard', () => {
  it.each([
    ['basic case', { }],
    ['with props', {
      props: {
        title: 'Title',
        description: 'Description',
        align: 'Bottom',
        highlight: true,
        scale: true,
        features: ['One developer', 'Unlimited projects', 'Unlimited minor & patch updates', 'Lifetime access'],
        badge: { label: 'Most popular' },
        price: 'Price',
        discount: 'Discount',
        cycle: 'Cycle'
      }
    }],
    ['with slots', {
      slots: {
        title: () => 'Title slot',
        header: () => 'Header slot',
        description: () => 'Description slot',
        footer: () => 'Footer slot',
        features: () => 'Features slot'
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UPricingCard.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UPricingCard)
    expect(html).toMatchSnapshot()
  })
})
