<script lang="ts" setup>
import CryptoPopover from '~/components/organisms/wallets/popovers/CryptoPopover.vue'
import { useVuelidate } from '@vuelidate/core'
import CloseButton from '~/components/molecules/button/CloseButton.vue'
import { cryptoCurrencyMap, CURRENCY, PREFERENCE, THEME } from '~/constants'
import { CREATE_WATCH_LIST, DELETE_WATCH_LIST } from '~/graphql'
import { required } from '@vuelidate/validators'
import type { CurrencyItem } from '~/types'

const { modalVisible } = defineProps<{
  modalVisible: boolean;
}>()

const emits = defineEmits<{
  (e: 'close:alertModal'): void;
}>()

const route = useRoute()
const { t } = useI18n()
const { watchCryptoCodesList, watchCryptoCodesReFetch } = inject(PREFERENCE)!
const { screen } = inject(THEME)!
const { cryptoCurrencies } = inject(CURRENCY)!
const selectedCurrency = computed(() => route.query.currency ? String(route.query.currency) : 'BTC')
const cryptoItem = computed(() => cryptoCurrencies.value.find((cItem: CurrencyItem) => cItem.code === selectedCurrency.value))
const isSettingModalVisible = ref(modalVisible)
const formData = reactive({
  higherPrice: undefined,
  lowerPrice: undefined,
})

const validateWatchAmount = (value: number): boolean => {
  return value > 0
}

const rules = {
  higherPrice: {
    required,
    mustBigger: validateWatchAmount
  },
  lowerPrice: {
    required,
    mustBigger: validateWatchAmount
  }
}

const v$ = useVuelidate(rules, formData)
const validationForm = async () => {
  return await v$.value.$validate()
}

const {
  mutate: addWatchMutate,
  loading: loadingAddWatchMutate,
  onDone: addWatchOnDone,
} = useMutation(CREATE_WATCH_LIST)
const {
  mutate: deleteWatchMutate,
  loading: loadingDeleteWatchMutate,
  onDone: deleteWatchOnDone,
} = useMutation(DELETE_WATCH_LIST)

const addWatchList = async () => {
  if (!(await validationForm()) || loadingAddWatchMutate.value) {
    return
  }

  await addWatchMutate({
    currencyid: Number(cryptoItem.value?.id),
    lowerPrice: formData.lowerPrice,
    higherPrice: formData.higherPrice
  })
}

addWatchOnDone(() => {
  useGeneralNotify({
    type: 'success',
    title: t('notifications.crypto-watchlist-updated'),
    description: t('notifications.added-crypto-to-watchlist')
  })
  formData.lowerPrice = undefined
  formData.higherPrice = undefined
  v$.value.$reset()
  useTimeoutFn(() => {
    watchCryptoCodesReFetch()
  }, 200)
})

const deleteCryptoWatch = async (watchlistId: number) => {
  if (loadingDeleteWatchMutate.value) {
    return
  }
  await deleteWatchMutate({
    watchlistId: Number(watchlistId)
  })
}

deleteWatchOnDone(() => {
  useGeneralNotify({
    type: 'success',
    title: t('notifications.crypto-watchlist-updated'),
    description: t('notifications.removed-crypto-from-watchlist')
  })

  useTimeoutFn(() => {
    watchCryptoCodesReFetch()
  }, 200)
})

const closeAlertModal = () => {
  isSettingModalVisible.value = false
  emits('close:alertModal')
}
</script>

<template>
  <ClientOnly>
    <UModal
      class="w-11/12 sm:max-w-sm bg-green-950"
      :default-open="isSettingModalVisible"
      @update:open="(v) => {
      if (!v) {
        closeAlertModal()
      }
    }"
    >
      <template #header>
        <div class="flex flex-col w-full">
          <div class="flex justify-between items-center w-full">
            <div class="text-white font-bold text-xl flex gap-x-2 items-center leading-none!">
              <UIcon
                class="w-6 h-6 min-w-6 min-h-6"
                name="heroicons:bell-alert-20-solid"
              />
              {{ t('home.watchlist') }}
            </div>
            <CloseButton
              class="w-4 h-4 min-w-4 min-h-4 text-paragraph"
              @click="closeAlertModal"
            />
          </div>
          <span class="text-paragraph text-xs lg:text-sm leading-none">
          {{ t('home.email-and-push-notifications') }}
        </span>
        </div>
      </template>
      <template #body>
        <div class="w-full flex flex-col gap-y-3">
          <div class="flex flex-col gap-y-3 w-full text-sm">
            <div class="text-white font-bold flex flex-col gap-y-1">
              {{ t('home.select-crypto-currency') }}
              <CryptoPopover
                :content-height="screen.md ? 300 : 150"
                :show-label="true"
              />
            </div>
            <div class="flex gap-2">
              <div class="text-white font-bold flex flex-col gap-y-1 w-full">
                {{ t('home.higher-than') }}
                <UInput
                  v-model="formData.higherPrice"
                  :placeholder="t('home.enter-amount')"
                  :ui="{
                  base: 'px-2 lg:px-3 py-2.5 lg:py-3 text-xs font-normal'
                }"
                  color="neutral"
                  type="number"
                />
                <JbInputMessage
                  v-if="v$.higherPrice.$error"
                  class="h-4"
                >
                  <UIcon
                    class="w-4 h-4 min-w-4 min-h-4 text-red-600"
                    name="i-heroicons-exclamation-circle-20-solid"
                  />
                  {{
                    v$.higherPrice.required.$invalid ? t('errors.FIELD_REQUIRED') : t('errors.POSITIVE_AMOUNT')
                  }}
                </JbInputMessage>
              </div>
              <div class="text-white font-bold flex flex-col gap-y-1 w-full">
                {{ t('home.lower-than') }}
                <UInput
                  v-model="formData.lowerPrice"
                  :placeholder="t('home.enter-amount')"
                  :ui="{
                  base: 'px-2 lg:px-3 py-2.5 lg:py-3 text-xs font-normal'
                }"
                  color="neutral"
                  type="number"
                />
                <JbInputMessage
                  v-if="v$.lowerPrice.$error"
                  class="h-4"
                >
                  <UIcon
                    class="w-4 h-4 min-w-4 min-h-4 text-red-600"
                    name="i-heroicons-exclamation-circle-20-solid"
                  />
                  {{
                    v$.lowerPrice.required.$invalid ? t('errors.FIELD_REQUIRED') : t('errors.POSITIVE_AMOUNT')
                  }}
                </JbInputMessage>
              </div>
            </div>
            <JButton
              :loading="loadingAddWatchMutate"
              class="w-20"
              size="md"
              variant="primary"
              @click="addWatchList"
            >
              {{ t('base.save') }}
            </JButton>
          </div>

          <hr class="h-px w-full border border-border">

          <div class="text-white font-bold w-full text-md">
            {{ t('home.my-alerts') }}
          </div>
          <div
            v-if="watchCryptoCodesList && watchCryptoCodesList.length"
            class="flex flex-col gap-y-3"
          >
            <div
              v-for="(item, cInd) in watchCryptoCodesList"
              :key="`alert_${cInd}_crypto-hey-8`"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-x-2">
                <UIcon
                  v-if="item?.currency?.iconType === 'ui'"
                  :name="item?.currency?.icon"
                  class="h-6 w-6 min-w-6 min-h-6"
                />
                <svg
                  v-else-if="item?.currency?.iconType === 'symbol'"
                  class="h-6 w-6 min-w-6 min-h-6"
                >
                  <use :href="item?.currency.icon || ''" />
                </svg>
                <UAvatar
                  v-else
                  :alt="item?.currency?.name"
                  :src="item?.currency?.logo"
                  class="h-6 w-6 min-w-6 min-h-6"
                  img-class="w-6 h-6"
                  size="sm"
                />
                <span class="text-sm">{{ item?.currency?.code }}</span>
              </div>
              <JbBlankButton
                @click="deleteCryptoWatch(Number(item.id))"
              >
                <UIcon
                  class="w-5 h-5 min-w-5 min-h-5"
                  name="heroicons:x-mark-20-solid"
                />
              </JbBlankButton>
            </div>
          </div>
          <div
            v-else
            class="text-xs leading-4 italic"
          >
            {{ t('home.no-alert-items-exist') }}
          </div>

          <hr class="h-px w-full border border-border">

          <div class="text-xs text-paragraph leading-none">
            {{ t('home.prices-in-usd') }}
          </div>
        </div>
      </template>
    </UModal>
  </ClientOnly>
</template>
