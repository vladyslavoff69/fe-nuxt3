import { defineTransformer } from '@nuxt/content'

export default defineTransformer({
  name: 'title-suffix',
  extensions: ['.md'],
  transform (file) {
    return {
      ...file,
      title: file.title + ' (suffix)',
    }
  },
})
