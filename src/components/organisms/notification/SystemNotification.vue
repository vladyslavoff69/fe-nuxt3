<script lang="ts" setup>
import { useTimeAgo } from '@vueuse/core'
import type { Notification } from '~/types/notification'

const { data } = defineProps<{
  data: Notification
}>()

const { t } = useI18n()
const urlRegex = /(https?:\/\/\S+)/g
const formattedMessage = computed(() => {
  return data?.message?.replace(urlRegex, (url) => {
    return `<a class="text-highlights hover:text-white" href="${url?.replace(/<\/p>/g, '')}" target="_blank" rel="noopener noreferrer">${url}</a>`
  })
})
</script>
<template>
  <div
    class="w-full rounded-lg bg-green-950 flex flex-col font-medium"
  >
    <div class="flex flex-col gap-2.5 p-4">
      <div class="flex flex-row gap-2 justify-start items-center">
        <UIcon
          :class="data?.read_at ? 'text-paragraph' : 'text-primary'"
          class="w-3.5 md:w-4 h-3.5 md:h-4 mt-0.5"
          name="heroicons:bell-20-solid"
        />
        <span class="text-white text-base">{{ data?.title }}</span>
      </div>
    </div>
    <div
      class="flex flex-row justify-between items-center bg-green-950 px-4 py-1.5 border-t border-border"
    >
      <div class="text-sm">
        {{ t('base.junglebet') }}
      </div>
      <span class="text-sm">
        {{ data.created_at ? useTimeAgo(new Date(data.created_at)).value : '' }}
      </span>
    </div>
    <div
      class="text-left bg-green-950 border-t border-border px-4 py-3"
    >
      <div
        class="text-xs md:text-sm flex flex-col gap-2 leading-none! break-words"
        v-html="formattedMessage"
      />
    </div>
  </div>
</template>
