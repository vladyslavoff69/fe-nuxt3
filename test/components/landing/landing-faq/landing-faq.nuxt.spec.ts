import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { ULandingFAQ } from '@@/.nuxt/components'

describe('LandingFAQ', () => {
  const items = [{
    label: 'Do you have a free trial?',
    content: 'Ea est ex aliqua exercitation quis et cillum adipisicing sit tempor veniam incididunt labore.'
  }, {
    label: 'Can I use Nuxt UI Pro for Open Source projects?',
    content: 'Et adipisicing do do do sunt irure proident consequat fugiat tempor occaecat commodo fugiat in proident.'
  }, {
    label: 'What does “Unlimited minor & patch updates” include?',
    content: 'Dolor dolor consectetur tempor consectetur sint ut id ex quis voluptate dolore incididunt qui mollit.'
  }, {
    label: 'Do you offer technical support?',
    content: 'Sint id sint incididunt culpa.'
  }]

  it.each([
    ['basic case', { }],
    ['with props', {
      props: {
        items,
        multiple: true
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof ULandingFAQ.props>) => {
    const html = await ComponentRender(nameOrHtml, options, ULandingFAQ)
    expect(html).toMatchSnapshot()
  })
})
