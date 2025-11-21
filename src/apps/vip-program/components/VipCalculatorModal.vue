<script lang="ts" setup>
import { AUTH } from '~/constants'
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import { USER_STATISTICS_QUERY } from '~/graphql'
import { Filter as DateFilter } from '~/types/statistics'
import { numberWithCommas } from '~/utils'

const props = defineProps<{
  selTab: string
}>()

const { isLoggedIn, me } = inject(AUTH)!
const { t } = useI18n()
const tabs = computed(() => [
  {
    label: t('vip.weekly'),
    value: 'weekly',
  },
  {
    label: t('vip.drip'),
    value: 'drip',
  },
  {
    label: t('vip.monthly'),
    value: 'monthly',
  },
])

const requestParams = reactive({
  username: me.value?.username,
  dateFilter: DateFilter.WEEK
})

const { result: statisticResult, loading, options, refetch } = useQuery(
  USER_STATISTICS_QUERY,
  { ...requestParams },
  { enabled: isLoggedIn.value }
)
const statisticData = computed(() => statisticResult.value?.userStatistics || {})

watch(() => isLoggedIn.value, (v) => {
  if (v) {
    // @ts-ignore
    options.enabled = true
  }
}, { immediate: isLoggedIn.value })

const currentTab = ref(props.selTab)
const wageredAmount = ref(statisticData.value?.total_wagered || 0)
const profitOrLossAmount = ref(0)
const estimateBonusAmount = computed(
  () => currentTab.value === 'drip'
    ? (wageredAmount.value * 0.003 + profitOrLossAmount.value * 0.025)
    : (
      currentTab.value === 'weekly'
        ? (wageredAmount.value * 0.001 + profitOrLossAmount.value * 0.02)
        : (wageredAmount.value * 0.001 + profitOrLossAmount.value * 0.1)
    )
)

watch(() => statisticData.value, (v) => {
  if (!loading.value && v && v.total_wagered !== 0 && v.total_wagered) {
    wageredAmount.value = v.total_wagered
  }
}, { immediate: true })

watch(() => currentTab.value, (v) => {
  if (isLoggedIn.value) {
    if (v !== 'monthly') {
      requestParams.dateFilter = DateFilter.WEEK
    } else {
      requestParams.dateFilter = DateFilter.MONTH
    }
    // @ts-ignore
    options.enabled = true
    refetch({ ...requestParams })
  }
}, { immediate: isLoggedIn.value })

const [tabParent] = useAutoAnimate({
  duration: 100,
})

onMounted(() => {
  if (isLoggedIn.value) {
    refetch({ ...requestParams })
  }
})
</script>

<template>
  <div class="flex flex-col gap-2 md:gap-3">
    <div class="text-white font-bold text-sm leading-none">
      Calculate My:
    </div>
    <UTabs
      v-model="currentTab"
      :items="tabs"
      size="xl"
    >
      <template #default="{ item }">
        <span class="text-center w-full z-1 font-bold text-nowrap">
          {{ item?.label || '' }}
        </span>
      </template>
    </UTabs>

    <div
      ref="tabParent"
      class="w-full flex flex-col gap-2 md:gap-3"
    >
      <div class="w-full p-2 md:p-4 text-center bg-border rounded-md">
        {{ isLoggedIn ? 'Autofill' : 'Please enter' }} last {{ currentTab !== 'monthly' ? 7 : 30 }} days wagered {{ isLoggedIn ? '' : '& profit/loss' }}
      </div>
      <hr class="border border-border">
      <div
        v-if="loading"
        class="w-full grid grid-cols-2 gap-2 md:gap-3"
      >
        <div class="col-span-2 md:col-span-1 flex flex-col gap-2 md:gap-3 relative">
          <USkeleton
            class="w-2/3 h-5 bg-brand"
          />
          <USkeleton
            class="w-full h-10 bg-brand"
          />
        </div>
        <div class="col-span-2 md:col-span-1 flex flex-col gap-2 md:gap-3">
          <USkeleton
            class="w-2/3 h-5 bg-brand"
          />
          <USkeleton
            class="w-full h-10 bg-brand"
          />
        </div>
      </div>
      <div
        v-else
        class="w-full grid grid-cols-2 gap-2 md:gap-3"
      >
        <div class="col-span-2 md:col-span-1 flex flex-col gap-2 md:gap-3 relative">
          <div class="font-bold text-white text-sm">
            {{ t('base.wagered') }} {{ t('base.amount') }}
          </div>
          <div class="relative w-full">
            <div
              class="absolute z-20 top-3 left-2"
              :class="{
                'text-white': wageredAmount !== 0,
                'text-paragraph': wageredAmount === 0,
              }"
            >
              $
            </div>
            <JInputNumber
              :model-value="wageredAmount"
              :step="0.01"
              :to-fixed="2"
              :lock="loading"
              :class-name="`focus:ring-0 h-11! focus:ring-none pl-5 ${ wageredAmount === 0 ? 'text-paragraph!' : '' }`"
              class="w-full h-11 bg-brand flex items-center rounded-md"
              placeholder="0.00"
              variant="none"
              @update:model-value="v => wageredAmount = Number(v)"
            />
          </div>
        </div>
        <div class="col-span-2 md:col-span-1 flex flex-col gap-2 md:gap-3">
          <div class="font-bold text-white text-sm">
            {{ t('games.profit') }}/{{ t('base.loss') }} {{ t('base.amount') }}
          </div>
          <div class="relative w-full">
            <div
              class="absolute z-20 top-3 left-2"
              :class="{
                'text-white': profitOrLossAmount > 0,
                'text-paragraph': profitOrLossAmount === 0,
                'text-red-600': profitOrLossAmount < 0,
              }"
            >
              $
            </div>
            <JInputNumber
              :model-value="profitOrLossAmount"
              :step="0.01"
              :to-fixed="2"
              :not-allowed="['e', '+']"
              :class-name="`focus:ring-0 h-11! focus:ring-none pl-5 ${ profitOrLossAmount === 0 ? 'text-paragraph!' : (profitOrLossAmount < 0 ? 'text-red-600!' : 'text-white!') }`"
              class="w-full h-11 bg-brand flex items-center rounded-md"
              placeholder="0.00"
              variant="none"
              @update:model-value="v => profitOrLossAmount = Number(v)"
            />
          </div>
        </div>
      </div>
      <hr class="border border-border">
      <div class="w-full flex flex-col">
        <div class="w-full flex flex-col">
          <div class="font-bold text-white text-sm">
            Your Estimated Bonus Total
          </div>
          <div
            class="w-full font-bold flex items-center"
            :class="{
              'text-white': estimateBonusAmount > 0,
              'text-paragraph': estimateBonusAmount === 0,
              'text-red-600': estimateBonusAmount < 0,
            }"
          >
            {{ estimateBonusAmount < 0 ? '-' : '' }}${{ numberWithCommas(Math.abs(estimateBonusAmount)) }}
          </div>
        </div>
        <div
          v-if="currentTab === 'drip'"
          class="w-full flex flex-col"
        >
          <div class="w-full font-bold text-sm text-white">
            Estimated For Inclaim Style:
          </div>
          <div class="w-full font-bold text-sm flex items-center gap-0.5">
            <span>For 10 minutes option:</span>
            <span
              class="flex items-center"
              :class="{
                'text-white': estimateBonusAmount > 0,
                'text-paragraph': estimateBonusAmount === 0,
                'text-red-600': estimateBonusAmount < 0,
              }"
            >
              {{ estimateBonusAmount < 0 ? '-' : '' }}${{ numberWithCommas(Math.abs((estimateBonusAmount / 1008)), 8) }}
            </span>
          </div>
          <div class="w-full font-bold text-sm flex items-center gap-0.5">
            <span>For hourly option:</span>
            <span
              class="flex items-center"
              :class="{
                'text-white': estimateBonusAmount > 0,
                'text-paragraph': estimateBonusAmount === 0,
                'text-red-600': estimateBonusAmount < 0,
              }"
            >
              {{ estimateBonusAmount < 0 ? '-' : '' }}${{ numberWithCommas(Math.abs((estimateBonusAmount / 168)), 8) }}
            </span>
          </div>
          <div class="w-full font-bold text-sm flex items-center gap-0.5">
            <span>For daily option:</span>
            <span
              class="flex items-center"
              :class="{
                'text-white': estimateBonusAmount > 0,
                'text-paragraph': estimateBonusAmount === 0,
                'text-red-600': estimateBonusAmount < 0,
              }"
            >
              {{ estimateBonusAmount < 0 ? '-' : '' }}${{ numberWithCommas(Math.abs((estimateBonusAmount / 7)), 8) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
