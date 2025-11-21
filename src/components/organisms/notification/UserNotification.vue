<script lang="ts" setup>
import { useTimeAgo } from '@vueuse/core'
import type { Notification } from '~/types/notification'

const { data } = defineProps<{
  data: Notification
}>()

const runtimeConfig = useRuntimeConfig()
const chatRainConf = computed(() => (runtimeConfig.public?.chatRain || 'Rain'))
const { t } = useI18n()

const urlRegex = /(https?:\/\/\S+)/g
const formattedMessage = computed(() => {
  return data?.message?.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
  })?.replace(
    'rain', chatRainConf.value
  )?.replace(
    'Rain', chatRainConf.value
  )
})
</script>
<template>
  <div
    class="
      w-full flex gap-x-1 md:max-w-md overflow-hidden bg-green-950 rounded
      pointer-events-auto ring-1 ring-brand ring-opacity-5 group px-2 py-3
    "
  >
    <div class="flex items-start justify-center rounded">
      <UIcon
        :class="[data?.read_at ? 'h-4' : 'text-primary h-[14px]']"
        :name="data.read_at ? 'heroicons:check-badge-20-solid' : 'heroicons-outline:clipboard'"
        class="w-5"
      />
    </div>
    <div class="flex flex-col flex-1">
      <div class="flex flex-col">
        <p
          class="text-sm md:text-base md:leading-none font-semibold text-white leading-4 capitalize"
        >
          <template v-if="data?.title === 'WEEKLY_BONUS'">
            {{ t('missing.weekly-bonus-title') }}
          </template>
          <template v-else>
            {{ data?.title?.replace('rain', chatRainConf)?.replace('Rain', chatRainConf) }}
          </template>
        </p>
        <div class="flex items-center gap-[5px]">
          <div
            :class="data?.read_at ? 'bg-green-950': 'bg-primary'"
            class="rounded-full flex items-center justify-center size-2 border border-slate-color shadow-radio-box"
          />
          <p class="text-xs">
            {{ data.created_at ? useTimeAgo(new Date(data.created_at)).value : '' }}
          </p>
        </div>
      </div>
      <p class="text-xs md:text-sm font-semibold">
        <template v-if="data?.title === 'WEEKLY_BONUS'">
          {{ t('missing.weekly-bonus-message') }}
        </template>
        <template v-else>
          <span v-html="formattedMessage"/>
        </template>
      </p>
    </div>
  </div>
</template>
