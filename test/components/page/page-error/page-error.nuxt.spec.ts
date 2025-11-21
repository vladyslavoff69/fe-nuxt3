import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UPageError } from '@@/.nuxt/components'

describe.skip('PageError', () => {
  it.each([
    ['basic case', { }],
    ['with props', {
      props: {
        status: 404,
        message: 'Mesage',
        name: 'Name',
        clearButton: {
          label: 'Go back home',
          color: 'primary',
          size: 'lg'
        }
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UPageError.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UPageError)
    expect(html).toMatchSnapshot()
  })
})
