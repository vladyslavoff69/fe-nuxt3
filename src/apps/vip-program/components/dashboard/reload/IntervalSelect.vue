<script lang="ts" setup>
import { CHANGE_RELOAD_MUTATION } from '~/graphql'
import type { ReloadRank } from '@/types'
import { VIP_DRIP } from '~/constants'

const { t } = useI18n()
const props = defineProps<{
  vipReload: ReloadRank;
}>()

const TYPE_OPTIONS = [
  { value: 'TEN_MIN', label: t('vip.drip-interval-min') },
  { value: 'ONE_HOUR', label: t('vip.drip-interval-hour') },
  { value: 'ONE_DAY', label: t('vip.drip-interval-day') }
]

const {
  loading: changeReloadLoading,
  onDone: onChangeReloadDone,
  onError: onChangeReloadError,
  error: changeReloadError,
  mutate: changeReloadMutate,
} = useMutation(CHANGE_RELOAD_MUTATION)

const { refetch } = inject<{ refetch: Function }>(VIP_DRIP)!
const nextInterval = computed<string>({
  get () {
    return props.vipReload.nextInterval
  },
  set (v) {
    if (!changeReloadLoading.value) {
      changeReloadMutate({
        interval: v,
      })
    }
  }
})

const FORMATTED_INTERVAL: {
  [key in string]: string;
} = {
  TEN_MIN: t('vip.10-minutes'),
  ONE_HOUR: t('vip.1-hour'),
  ONE_DAY: t('vip.1-day'),
}

onChangeReloadDone(({ data }) => {
  useGeneralNotify({
    type: 'success',
    title: t('vip.drip-claim-updated'),
    description: t('vip.drip-claim-updated-txt', {
      nextInterval: FORMATTED_INTERVAL[data.changeReload.nextInterval],
    }),
  })

  refetch()
})

onChangeReloadError(() => {
  useGeneralNotify(
    {
      type: 'error',
      title: t('notifications.error'),
      description: changeReloadError.value?.message,
    }
  )
})
</script>
<template>
  <div class="flex flex-col gap-1 md:gap-2 w-full">
    <span class="text-white font-bold w-full text-left">
      {{ t('vip.interval-claim-style') }}
    </span>

    <USelect
      v-model="nextInterval"
      :disabled="changeReloadLoading"
      :items="TYPE_OPTIONS"
      class="w-full text-sm h-12 text-white bg-brand! leading-none"
      label-key="label"
      size="lg"
      value-key="value"
    />
  </div>
</template>
