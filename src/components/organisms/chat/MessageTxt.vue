<script lang="ts" setup>
import { AUTH } from '~/constants'

const props = defineProps<{
  content: string | null;
}>()

const { me }: any = inject(AUTH)!
const highlightTags = (text: string) => {
  return text?.replace(/@\w+/g, (match: string) => {
    if (match?.substring(1)) {
      const href = getModalLinkForUser(match?.substring(1))
      const classes = match?.substring(1) === me.value?.username
        ? 'text-gold'
        : 'text-booster'

      return `<a class="tag font-semibold ${classes}" href="${href}">${match}</a>`
    }

    return match
  })
}

const formattedContent = computed(() => {
  return props.content ? highlightTags(props.content) : ''
})
</script>

<template>
  <span
    class="leading-4 inline-block"
    v-html="formattedContent"
  />
</template>
