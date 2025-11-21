import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UBlogPost } from '@@/.nuxt/components'

describe('BlogPost', () => {
  it.each([
    ['basic case', { }],
    ['with props', {
      props: {
        title: 'Title',
        description: 'Description',
        date: 'Dec 25, 2023',
        image: {
          src: 'https://picsum.photos/640/360',
          alt: 'Image alt'
        },
        badge: { label: 'Badge' },
        authors: [{
          name: 'Author name',
          avatar: {
            src: 'https://i.pravatar.cc/120?img=1',
            loading: 'lazy'
          }
        }]
      }
    }],
    ['with slots', {
      slots: {
        image: () => 'Image slot',
        badge: () => 'Badge slot',
        title: () => 'Title slot',
        description: () => 'Description slot',
        authors: () => 'Authors slot',
        date: () => 'Date slot'
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UBlogPost.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UBlogPost)
    expect(html).toMatchSnapshot()
  })
})
