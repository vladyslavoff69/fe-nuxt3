import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UBlogList } from '@@/.nuxt/components'

describe('BlogList', () => {
  it.each([
    ['basic case', { }],
    ['with props', {
      props: {
        orientation: 'vertical'
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UBlogList.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UBlogList)
    expect(html).toMatchSnapshot()
  })
})
