import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { ULandingTestimonial } from '@@/.nuxt/components'

describe('LandingTestimonial', () => {
  it.each([
    ['basic case', {}],
    ['with props', {
      props: {
        icon: 'i-simple-icons-google',
        quote: 'Aliquip irure laboris deserunt in dolore in consectetur ex duis. Mollit ad esse ipsum irure id veniam irure culpa dolore labore.',
        card: true,
        author: {
          name: 'Rose Roberson',
          description: 'CEO at Google',
          to: 'https://google.com',
          target: '_blank',
          avatar: {
            src: 'https://i.pravatar.cc/120?img=1',
            loading: 'lazy'
          }
        }
      }
    }],
    ['with slots', {
      slots: {
        icon: () => 'Icon slot',
        quote: () => 'Quote slot'
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof ULandingTestimonial.props>) => {
    const html = await ComponentRender(nameOrHtml, options, ULandingTestimonial)
    expect(html).toMatchSnapshot()
  })
})
