<script lang="ts" setup>
import { useMutation } from '@vue/apollo-composable'
import { CLAIM_RAKEBACK_MUTATION, VIP_RAKEBACK_QUERY } from '~/graphql'
import { cryptoCurrencyMap, CURRENCY, PREFERENCE } from '~/constants'
import type { RakebackRank } from '~/types'
import RakeBackHelpModal from '~/apps/vip-program/components/dashboard/RakeBackHelpModal.vue'

const {
  hideHead = false,
  hideZeroValue = false
} = defineProps<{
  hideZeroValue?: boolean;
  hideHead?: boolean;
}>()

const { t } = useI18n()
const { loading, result, refetch } = useQuery<{
  vipRakeback: RakebackRank;
}>(
  VIP_RAKEBACK_QUERY,
  {}
)

const rakeback = computed(() => (result.value?.vipRakeback))
const isHelpModalVisible = ref<boolean>(false)
const { displayInfiatEnabled } = inject(PREFERENCE)!
const { cryptoToUsd, displayFiatAmount } = inject(CURRENCY)!
const claim_percentages = [5, 6, 7, 8, 9, 10]
const rakebackValues = computed(() => {
  if (!hideZeroValue) {
    return rakeback.value?.values
  } else {
    const pValues = Object.assign({}, rakeback.value?.values)
    if (pValues) {
      Object.entries(pValues).forEach(([k, v]) => {
        if (v === 0) {
          delete pValues[k]
        }
      })
    }

    return pValues
  }
})

const {
  loading: claimRakeBackLoading,
  mutate: claimRakeBackMutate,
  onDone: onClaimRakeBackDone,
  onError: onClaimRakeBackError,
  error: claimRakeBackError,
} = useMutation(CLAIM_RAKEBACK_MUTATION)

const fiatAmountByCode = (code: string) => {
  return displayFiatAmount(
    cryptoToUsd.value[code] * (rakeback.value?.values[code] || 0),
  )
}

const claimRakeBack = () => {
  if (claimRakeBackLoading.value) {
    return
  }
  claimRakeBackMutate()
}

onClaimRakeBackDone(() => {
  useGeneralNotify({
    type: 'success',
    title: t('vip.rakeback-claimed'),
    description: t('vip.rakeback-claimed-txt'),
  })
})

onClaimRakeBackError(() => {
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: claimRakeBackError.value?.message
  })
})

const toggleHelpModal = () => {
  isHelpModalVisible.value = !isHelpModalVisible.value
}

onMounted(() => {
  if (!loading.value) {
    refetch()
  }
})
</script>
<template>
  <div class="bg-green-950 p-4 rounded-md flex flex-col gap-2.5 md:gap-4">
    <div
      v-if="!hideHead"
      class="flex items-center gap-2.5 font-bold text-lg text-white"
    >
      {{ t("vip.rake") }}
    </div>
    <div class="flex flex-col gap-3">
      <div
        class="mr-2.5 cursor-pointer group"
        @click="toggleHelpModal"
      >
        <div class="flex flex-row gap-2 items-center group-active:scale-95">
          <UIcon
            class="w-4 h-4 min-w-4 min-h-4 text-paragraph cursor-help hover:text-white"
            name="material-symbols:help-outline"
          />
          <span class="text-white text-sm">{{ t("vip.rake-percent") }}</span>
        </div>
      </div>
      <div v-if="!loading">
        <div class="w-full flex flex-col gap-2">
          <JProgressBar
            :max="100"
            :value="(Number(rakeback?.percentage) - 5) * 16 + 22"
            class="bg-brand!"
            color="bg-primary-gradient"
          >
            <span
              class="w-full leading-5 font-bold block text-xs text-right pr-3 text-white"
            >{{ Number(rakeback?.percentage).toFixed(0) }}%</span>
          </JProgressBar>
          <div class="flex flex-row justify-between">
            <div
              v-for="(percentage, index) in claim_percentages"
              :key="index"
              :class="{
                'pl-[20%]': index === 0,
              }"
              class="flex flex-col gap-1 items-center"
            >
              <div class="w-1 h-2.5 bg-paragraph rounded-md" />
              <div class="text-sm">
                {{ percentage }}%
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="flex flex-col gap-4"
      >
        <USkeleton
          v-for="i in 5"
          :key="i"
          class="w-full h-4 bg-brand"
        />
      </div>
    </div>
    <div
      v-if="!loading && rakeback"
      class="flex-1 w-full flex flex-col gap-2 md:gap-4"
    >
      <div class="flex items-center text-sm text-white font-bold leading-none">
        {{ t('vip.avail-rakeback') }}
      </div>
      <div
        v-if="rakebackValues && Object.keys(rakebackValues).length > 0"
        class="grid md:grid-cols-2 grid-cols-1 justify-between gap-2 md:gap-4"
      >
        <template v-if="rakeback?.canClaimRakeback">
          <div
            v-for="(code, idx) of Object.keys(rakebackValues)"
            :key="`${code}_${idx}`"
            class="flex flex-row justify-between"
          >
            <div class="flex flex-row gap-2.5 items-center text-sm">
              <UIcon
                v-if="cryptoCurrencyMap[code]?.icon && cryptoCurrencyMap[code]?.iconType === 'ui'"
                :name="cryptoCurrencyMap[code].icon || ''"
                class="h-4 w-4 min-w-4 min-h-4"
              />
              <svg
                v-else-if="cryptoCurrencyMap[code]?.iconType === 'symbol'"
                class="h-4 w-4 min-w-4 min-h-4"
              >
                <use :href="cryptoCurrencyMap[code].icon || ''" />
              </svg>
              <UAvatar
                v-else-if="(cryptoCurrencyMap[code]?.icon && cryptoCurrencyMap[code]?.iconType === 'logo')"
                :src="cryptoCurrencyMap[code]?.icon || ''"
                :alt="code"
                class="w-4 h-4 min-w-4 min-h-4 rounded-full"
                img-class="w-4 h-4"
                size="sm"
              />
              <span class="text-white">{{ code }}</span>
            </div>
            <div
              v-if="!displayInfiatEnabled"
              class="text-sm text-white font-bold"
            >
              {{ rakeback?.values[code].toFixed(8) }}
            </div>
            <div
              v-else
              class="text-sm text-white font-bold"
            >
              {{ fiatAmountByCode(code) }}
            </div>
          </div>
        </template>
        <div
          v-else
          class="text-sm font-bold flex items-center w-full"
        >
          ...
        </div>
      </div>
      <div
        v-else
        class="text-sm font-bold flex items-center w-full"
      >
        N/A
      </div>
    </div>
    <JButton
      v-if="!(claimRakeBackLoading || !rakeback?.canClaimRakeback || loading || !(rakebackValues && Object.keys(rakebackValues).length > 0))"
      :style-type="rakeback?.canClaimRakeback ? 'primary' : 'secondary'"
      class="text-white"
      @click="claimRakeBack"
    >
      {{ t("vip.claim") }}
    </JButton>
    <JButton
      v-else
      :disabled="claimRakeBackLoading || !rakeback?.canClaimRakeback || loading || !(rakebackValues && Object.keys(rakebackValues).length > 0)"
      :loading="claimRakeBackLoading || loading"
      style-type="secondary"
      class="text-paragraph"
    >
      {{ t("vip.claim") }}
    </JButton>
    <ClientOnly>
      <UModal
        v-model:open="isHelpModalVisible"
        :default-open="isHelpModalVisible"
        class="w-11/12 sm:max-w-sm bg-brand p-2 sm:p-4"
        @update:open="(v) => {
        if (!v) {
          isHelpModalVisible = false
        }
      }"
      >
        <template #content>
          <RakeBackHelpModal @close:modal="toggleHelpModal" />
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>
