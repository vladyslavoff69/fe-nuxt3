import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../../component-render'
import { UAuthForm } from '@@/.nuxt/components'

describe('AuthForm', () => {
  it.each([
    ['basic case', { }],
    ['with props', {
      props: {
        fields: [{
          name: 'email',
          type: 'text',
          label: 'Email',
          placeholder: 'Enter your email'
        }, {
          name: 'password',
          label: 'Password',
          type: 'password',
          placeholder: 'Enter your password'
        }],
        providers: [{
          label: 'Continue with GitHub',
          icon: 'i-simple-icons-github',
          color: 'white'
        }],
        title: 'Welcome back!',
        description: 'Enter your credentials to access your account',
        align: 'top',
        icon: 'i-heroicons-lock-closed'
      }
    }],
    ['with slots', {
      slots: {
        icon: () => 'Icon slot',
        title: () => 'Title slot',
        description: () => 'Description slot',
        footer: () => 'Footer slot'
      }
    }]
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UAuthForm.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UAuthForm)
    expect(html).toMatchSnapshot()
  })
})
