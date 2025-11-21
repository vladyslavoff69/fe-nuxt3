<script lang="ts" setup>
import CloseButton from '~/components/molecules/button/CloseButton.vue'
import type { AffiliateCommission, User } from '~/types'
import { cryptoCurrencyMap, CURRENCY, PREFERENCE } from '~/constants'
import { AFFILIATE_CURRENCY_BREAKDOWN_QUERY, CLAIM_PERCENT_BACK_COMMISSIONS_MUTATION } from '~/graphql'
import { numberWithCommas } from '~/utils'

const { t } = useI18n()
const {
  user = null,
  hasHead = true,
} = defineProps<{
  user: User;
  hasHead?: boolean;
}>()

const { activeFiatCode, displayInfiatEnabled } = inject(PREFERENCE)!
const { cryptoToFiat, currentFiatCurrency } = inject(CURRENCY)!
const commissionType = ref('claimable')
const commissionModalTabs = [
  {
    value: 'claimable',
    label: t('vip.claimable'),
  },
  {
    value: 'total_earned',
    label: t('vip.total-earned'),
  }
]

const calcFiatPrice = (currency: string) => {
  return cryptoToFiat(1, currency, activeFiatCode.value)
}

const {
  result: currencyBreakDownsResult,
  loading: currencyBreakDownsLoading,
  refetch,
} = useQuery<{
  affiliateCurrencyBreakdown: AffiliateCommission[];
}>(
  AFFILIATE_CURRENCY_BREAKDOWN_QUERY,
  { username: user?.username }
)

const currencyBreakDowns = computed(
  () => currencyBreakDownsResult.value?.affiliateCurrencyBreakdown ?? [],
)

const {
  loading: claimLoading,
  onDone: onClaimDone,
  onError: onClaimError,
  error: claimRError,
  mutate: claimMutate,
} = useMutation(CLAIM_PERCENT_BACK_COMMISSIONS_MUTATION)

onClaimDone(() => {
  if (hasHead) {
    onCloseModal()
  } else {
    refetch()
  }
})

onClaimError(() => {
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: claimRError.value?.message,
  })
})

const claimCommissions = () => {
  if (claimLoading.value) {
    return
  }

  claimMutate()
}

const hasClaimableCommission = computed(() => {
  const index = currencyBreakDowns.value.findIndex(
    (item: AffiliateCommission) => item.affiliate_commission_claimable > 0,
  )
  return index > -1
})

const emits = defineEmits<{
  (e: 'close:modal', value: boolean): void;
}>()

const onCloseModal = () => {
  emits('close:modal', true)
}
</script>

<template>
  <div class="text-left">
    <div
      v-if="hasHead"
      class="flex justify-between items-center w-full border-b border-border pb-4 mb-4"
    >
      <div class="text-base text-white gap-2 font-bold flex items-center">
        <UIcon
          class="w-5 h-5 cursor-pointer text-white"
          name="streamline:discount-percent-badge-solid"
        />
        <span>{{ t("vip.comm-shr") }}</span>
      </div>
      <CloseButton
        class="w-3 h-3 min-w-3 min-h-3"
        @click="onCloseModal"
      />
    </div>
    <div class="text-white flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-green-950 rounded-md px-1 py-3 text-center text-white">
          <p class="text-sm md:text-base mb-1.5 font-bold">
            {{ user?.sponsorAffiliates?.sponsorCode?.code || '' }}
          </p>
          <p class="text-xs md:text-sm text-paragraph">
            {{ t("vip.code-acc") }}
          </p>
        </div>
        <div class="bg-green-950 rounded-md px-1 py-3 text-center text-white">
          <p class="text-sm md:text-base mb-1.5 font-bold">
            {{ user?.sponsorAffiliates?.sponsorCode?.percent_back || 0 }}%
          </p>
          <p class="text-xs md:text-sm text-paragraph">
            {{ t("vip.comm-back") }}
          </p>
        </div>
      </div>
      <UTabs
        v-model="commissionType"
        :items="commissionModalTabs"
        size="xl"
        :ui="{
          list: 'bg-green-950'
        }"
      >
        <template #default="{ item }">
          <span class="text-center w-full z-1">
            {{ item?.label }}
          </span>
        </template>
      </UTabs>
      <JbScrollbar
        :scrollup-on-page="true"
        class="flex-col w-full h-full pr-0 pl-1.5 md:pl-0 pb-8 md:pb-0 px-0 mx-auto flex"
        height="400px"
        style-type="content"
      >
        <div
          v-if="currencyBreakDownsLoading"
          class="px-3 my-3"
        >
          <div
            v-for="i in 5"
            :key="i"
            class="flex justify-between py-1.5"
          >
            <div class="flex gap-2 w-full">
              <USkeleton
                class="bg-green-950 w-[14px] md:w-4 aspect-square rounded-full shrink-0"
              />
              <USkeleton
                class="w-full h-[14px] md:h-4 bg-green-950"
              />
            </div>
          </div>
        </div>
        <div
          v-if="!currencyBreakDownsLoading && !currencyBreakDowns?.length"
          class="text-center py-2.5 flex flex-col justify-center px-[13px] rounded-md bg-green-950 text-white md:my-5 my-2.5 md:mx-5 mx-2.5 text-sm"
        >
          {{ t("vip.start-betting") }}
        </div>
        <div
          v-else-if="currencyBreakDowns?.length"
          class="bg-green-950 rounded-md px-3"
        >
          <div
            v-for="(item, index) in currencyBreakDowns"
            :key="index"
            class="flex items-center gap-[5px] justify-between py-1.5"
          >
            <template v-if="commissionType === 'total_earned'">
              <div class="flex flex-row font-bold items-center">
                <UIcon
                  v-if="cryptoCurrencyMap[item.currency.code]?.icon && cryptoCurrencyMap[item.currency.code]?.iconType === 'ui'"
                  :name="cryptoCurrencyMap[item.currency.code].icon || ''"
                  class="h-4 w-4 min-w-4 min-h-4"
                />
                <svg
                  v-else-if="cryptoCurrencyMap[item.currency.code]?.iconType === 'symbol'"
                  class="h-4 w-4 min-w-4 min-h-4"
                >
                  <use :href="cryptoCurrencyMap[item.currency.code].icon || ''" />
                </svg>
                <UAvatar
                  v-else-if="(cryptoCurrencyMap[item.currency.code]?.icon && cryptoCurrencyMap[item.currency.code]?.iconType === 'logo')"
                  :src="cryptoCurrencyMap[item.currency.code]?.icon || ''"
                  :alt="item.currency.code"
                  class="w-4 h-4 min-w-4 min-h-4 rounded-full"
                  img-class="w-4 h-4"
                  size="sm"
                />
                <label class="ml-2 text-white cursor-pointer">
                  {{ item?.currency.code }}
                </label>
              </div>
              <span class="text-white font-bold">
                {{
                  !displayInfiatEnabled
                    ? numberWithCommas(item?.total_affiliate_commission, 8)
                    : `${currentFiatCurrency.symbol} ${numberWithCommas(
                      item?.total_affiliate_commission *
                        Number(calcFiatPrice(item?.currency.code)),
                      2,
                    )}`
                }}
              </span>
            </template>
            <template v-else>
              <div class="flex flex-row font-bold items-center">
                <UIcon
                  :name="cryptoCurrencyMap[item.currency.code]?.icon || ''"
                  class="w-4 h-4 min-h-4 min-w-4"
                />
                <label class="ml-2 text-white cursor-pointer">
                  {{ item.currency?.code }}
                </label>
              </div>
              <span class="text-white font-bold">
                {{
                  !displayInfiatEnabled
                    ? numberWithCommas(item.affiliate_commission_claimable, 8)
                    : `${currentFiatCurrency.symbol} ${numberWithCommas(
                      item.affiliate_commission_claimable *
                        Number(calcFiatPrice(item.currency?.code)),
                      2,
                    )}`
                }}
              </span>
            </template>
          </div>
        </div>
      </JbScrollbar>
      <JButton
        :disabled="
          claimLoading || currencyBreakDownsLoading || !hasClaimableCommission
        "
        :loading="claimLoading || currencyBreakDownsLoading"
        :variant="hasClaimableCommission ? 'primary' : 'alternative'"
        @click="claimCommissions"
      >
        {{ t("vip.claim") }}
      </JButton>
    </div>
  </div>
</template>
