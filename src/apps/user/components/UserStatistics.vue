<script lang="ts" setup>
import { USER_STATISTICS_QUERY } from '~/graphql'
import { cryptoCurrencyMap, CURRENCY, PREFERENCE } from '~/constants'
import { Filter as DateFilter } from '~/types/statistics'
import StatisticsSkeleton from '~/apps/user/components/StatisticsSkeleton.vue'
import { numberWithCommas } from '~/utils'

const route = useRoute()
const username = route.query?.name
const { openHelpModal } = useHelpModal()
const { t } = useI18n()
const { activeFiatCode, displayInfiatEnabled, orderedCryptoCodes } = inject(PREFERENCE)!
const { usdToFiat, currentFiatCurrency, displayFiatAmount, cryptoToFiat } = inject(CURRENCY)!
const currentCurrencyCode = computed(() => currentFiatCurrency.value?.code)
const currencyRate = computed(() => usdToFiat.value[currentCurrencyCode.value])

const calcFiatPrice = (currency: string) => {
  return cryptoToFiat(1, currency, activeFiatCode.value)
}

const { result: statisticResult, refetch: refetchStatistics, loading } = useQuery(
  USER_STATISTICS_QUERY,
  { username, dateFilter: DateFilter.LIFETIME }
)
const statisticData = computed(() => statisticResult.value?.userStatistics || {})
const statisticByCurrency = computed(() => statisticData.value?.currency_breakdown || [])
const v = {
  get statisticCurrencyCodes () {
    return statisticByCurrency.value.map((b: any) => b.currency_code)
  },
}

const orderedStatisticItems = computed(() => orderedCryptoCodes.value.length
  ? orderedCryptoCodes.value
    .filter(oc => v.statisticCurrencyCodes.includes(oc))
    .map(oc => statisticByCurrency.value.find((cc: any) => cc.currency_code === oc)!)
  : Object.keys(cryptoCurrencyMap).filter((oc: any) => v.statisticCurrencyCodes.includes(oc)).map(
    c => statisticByCurrency.value.find((cc: any) => cc.currency_code === c)!
  )
)

const { table, thead, th, td } = useTable()
const columns = ['1 0 60px', '1 0 10px', '1 0 120px']

const period = ref(DateFilter.LIFETIME)
const periodOptions = computed(() => [
  {
    label: t('transaction.last-24-hours'),
    value: DateFilter.DAY,
  },
  {
    label: t('transaction.last-7-days'),
    value: DateFilter.WEEK,
  },
  {
    label: t('transaction.last-30-days'),
    value: DateFilter.MONTH,
  },
  {
    label: t('transaction.lifetime'),
    value: DateFilter.LIFETIME,
  },
])

const handleChangePeriod = () => {
  refetchStatistics({
    username,
    dateFilter: period.value,
  })
}

const handleRTPHelp = () => {
  openHelpModal('rtp')
}
</script>

<template>
  <div class="w-full h-full pt-4">
    <StatisticsSkeleton v-if="loading" />

    <div
      v-else
      class="grid grid-cols-1 gap-y-3 lg:gap-y-4"
    >
      <div class="w-full col-span-1">
        <USelect
          v-model="period"
          :items="periodOptions"
          :arrow="true"
          class="w-full bg-green-950! text-sm h-12 text-white"
          label-key="label"
          size="lg"
          value-key="value"
          @change="handleChangePeriod"
        />
      </div>

      <div class="grid grid-cols-2 gap-4 text-sm font-bold">
        <div class="col-span-1 bg-green-950 rounded-md p-3 lg:p-4">
          <label class="text-center">
            {{ t('vip.total-wagered') }}
          </label>
          <label class="text-white truncate">
            {{ displayFiatAmount(statisticData?.total_wagered * currencyRate) }}
          </label>
        </div>

        <div class="col-span-1 bg-green-950 rounded-md p-3 lg:p-4">
          <label
            class="flex items-center gap-x-0.5"
            @click="handleRTPHelp"
          >
            {{ t('vip.rtp') }}
            <UIcon
              class="w-4 h-4 min-h-4 min-w-4 text-paragraph cursor-help hover:text-white"
              name="i-heroicons-information-circle-20-solid"
              @click="handleRTPHelp"
            />
          </label>
          <label class="text-white truncate">
            {{ statisticData?.rtp?.toFixed(2) }}%
          </label>
        </div>
      </div>

      <div class="bg-green-950 rounded-md px-3 pb-3 lg:px-4 lg:pb-4 w-full">
        <div :class="table">
          <div
            class="pb-0 rounded-md"
            :class="[thead]"
          >
            <div class="flex items-center text-center w-full">
              <div
                class="text-left pl-2 xs:pl-2"
                :class="[th]"
                :style="{ flex: columns[0] }"
              >
                {{ t('base.currency') }}
              </div>
              <div
                :class="th"
                :style="{ flex: columns[1] }"
              >
                {{ t('vip.rtp') }}
              </div>
              <div
                class="text-right pr-2"
                :class="[th]"
                :style="{ flex: columns[2] }"
              >
                {{ t('base.wagered') }}
              </div>
            </div>
          </div>
          <JbScrollbar
            class="flex flex-col"
            height="318px"
            style-type="content"
          >
            <div
              v-for="(row, index) in orderedStatisticItems"
              :id="index.toString()"
              :key="`us-1-${index}`"
              class="flex items-center text-center w-full rounded-md hover:bg-border"
              :class="[
                {
                  'bg-brand': index % 2 === 0
                }
              ]"
            >
              <div
                class="pl-2 xs:pl-2"
                :class="[td]"
                :style="{ flex: columns[0] }"
              >
                <div class="flex gap-1.5 lg:gap-2 items-center">
                  <UIcon
                    v-if="cryptoCurrencyMap[row.currency_code]?.iconType === 'ui'"
                    :name="cryptoCurrencyMap[row.currency_code].icon || ''"
                    class="h-4 w-4 min-w-4 min-h-4"
                  />
                  <svg
                    v-else-if="cryptoCurrencyMap[row.currency_code]?.iconType === 'symbol'"
                    class="w-4 h-4 min-h-4 min-w-4"
                  >
                    <use :href="cryptoCurrencyMap[row.currency_code]?.icon" />
                  </svg>
                  <UAvatar
                    v-else-if="cryptoCurrencyMap[row.currency_code]?.iconType === 'logo'"
                    :src="cryptoCurrencyMap[row.currency_code]?.icon || ''"
                    :alt="row.currency_code"
                    class="w-4 h-4 min-w-4 min-h-4 rounded-full"
                    img-class="w-4 h-4"
                    size="sm"
                  />
                  {{ row.currency_code }}
                </div>
              </div>
              <div
                class="justify-center"
                :class="[td]"
                :style="{ flex: columns[1] }"
              >
                <div class="text-center">
                  {{ row.rtp.toFixed(2) }}%
                </div>
              </div>
              <div
                class="pr-2 xs:pr-2"
                :class="[td]"
                :style="{ flex: columns[2] }"
              >
                <div class="text-right text-base">
                  {{
                    !displayInfiatEnabled ? numberWithCommas(row.crypto_value, 8)
                    : `${currentFiatCurrency.symbol} ${numberWithCommas(
                      row.crypto_value * Number(calcFiatPrice(row.currency_code)), 2
                    )}`
                  }}
                </div>
              </div>
            </div>
          </JbScrollbar>
        </div>
      </div>
    </div>
  </div>
</template>
