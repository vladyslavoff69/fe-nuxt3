<script lang="ts" setup>
import { AUTH, CURRENCY, GAME_POPUP, PREFERENCE, THEME, VIP } from '~/constants'
import { DraggableResizable } from '~/services/libs/draggable-resizable'
import { STATISTICS_BAR_ICON } from '~/components/symbols'
import { LIVE_FEED_USER_SUBSCRIPTION } from '~/graphql';

const VueApexCharts = defineAsyncComponent({
  loader: () => import('vue3-apexcharts'),
})

const { me, isLoggedIn } = inject(AUTH)!
const { vip } = inject(VIP)!
const { t } = useI18n()
const { screen } = inject(THEME)!
const { activeFiatCode, activeCryptoCode, displayInfiatEnabled } = inject(PREFERENCE)!
const {
  cryptoToFiat,
  displayFiatAmount,
  displayCryptoAmount,
  currentCryptoCurrency,
  currentFiatCurrency
} = inject(CURRENCY)!
const {
  betResults,
  isResizingPopup,
  topPopupGameSlug,
  setTopPopupGameSlug,
  toggleGameStatsPopup,
  resetBetsResult,
} = inject(GAME_POPUP)!
const modalSlug = 'junglebet-game-live-stats-popup'
const gameStatsContainer = ref<HTMLDivElement>()
const gameFilter = ref<string>('ALL')
const width = ref<number>(screen.value.md ? 320 : 265)
const height = ref<number>(600)
const left = ref<number>(screen.value.width - width.value - 20)
const top = ref<number>(screen.value.height - height.value - 20)

// @ts-ignore
const gameOptions = computed<{label: string, value: string}[]>(() => ([
  {
    value: 'ALL',
    label: t('base.all'),
  },
  ...(
    Object.values(
      betResults.value
        .map(r => ({ label: r.game, value: r.game }))
        .reduce((acc, obj) => ({ ...acc, [obj.label]: obj }), {})
    )
  )
]))
const filteredResult = computed(() => gameFilter.value !== 'ALL' ? betResults.value.filter(r => r.game === gameFilter.value) : betResults.value)
const plCryptoValue = computed(() => filteredResult.value.reduce(function (a, b) {
  return a + (b.payout - b.amount) * (cryptoToFiat(1, b.currency_code, activeFiatCode.value) / cryptoToFiat(1, activeCryptoCode.value, activeFiatCode.value))
}, 0))
const plValue = computed(() => filteredResult.value.reduce(function (a, b) {
  return a + (b.payout - b.amount) * (displayInfiatEnabled.value ? cryptoToFiat(1, b.currency_code, activeFiatCode.value) : cryptoToFiat(1, b.currency_code, activeFiatCode.value) / cryptoToFiat(1, activeCryptoCode.value, activeFiatCode.value))
}, 0))
const payoutValue = computed(() => filteredResult.value.reduce(function (a, b) {
  return a + b.payout * (displayInfiatEnabled.value ? cryptoToFiat(1, b.currency_code, activeFiatCode.value) : cryptoToFiat(1, b.currency_code, activeFiatCode.value) / cryptoToFiat(1, activeCryptoCode.value, activeFiatCode.value))
}, 0))
const wageredCryptoValue = computed(() => filteredResult.value.reduce(function (a, b) {
  return a + b.amount * (cryptoToFiat(1, b.currency_code, activeFiatCode.value) / cryptoToFiat(1, activeCryptoCode.value, activeFiatCode.value))
}, 0))
const wageredValue = computed(() => filteredResult.value.reduce(function (a, b) {
  return a + b.amount * (displayInfiatEnabled.value ? cryptoToFiat(1, b.currency_code, activeFiatCode.value) : cryptoToFiat(1, b.currency_code, activeFiatCode.value) / cryptoToFiat(1, activeCryptoCode.value, activeFiatCode.value))
}, 0))
const rtpValue = computed(() => payoutValue.value * 100 / (wageredValue.value ? wageredValue.value : 1))
const winsValue = computed(() => filteredResult.value.filter(r => r.multiplier > 0).length)
const lossesValue = computed(() => filteredResult.value.filter(r => r.multiplier < 1).length)

const maxWidth = ref<number>(320) // popup max width
const maxHeight = ref<number>(height.value) // popup max height
const options = ref({
  chart: {
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: false,
    },
    animations: {
      enabled: true,
    },
    zoom: {
      enabled: true,
      type: 'x',
      resetIcon: {
        offsetX: -10,
        offsetY: 0,
        fillColor: '#fff',
        strokeColor: '#112811',
      },
      selection: {
        background: '#ACCCAC',
        border: '#259F4F',
      },
    },
  },
  markers: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    type: 'line',
    width: 2,
  },
  fill: {
    opacity: 0,
  },
  colors: ['#22974A', '#FF512F'],
  xaxis: {
    type: 'datetime',
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
    },
    tooltip: {
      enabled: false
    }
  },
  yaxis: {
    show: false,
  },
  tooltip: {
    enabled: true,
    custom: (data: any) => {
      return `<div
        class="py-2 px-3 bg-brand text-white text-center text-xs rounded-md"
      >
        <div class="font-bold">
          ${displayInfiatEnabled.value
    ? displayFiatAmount(
      data.series[data.seriesIndex][data.dataPointIndex]
    )
    : displayCryptoAmount(data.series[data.seriesIndex][data.dataPointIndex], activeCryptoCode.value)}
        </div>
      </div>`
    },
  },
  legend: {
    show: false,
  },
  grid: {
    show: true,
    borderColor: 'rgba(133,141,160,0.15)',
  },
})

let tempSum = 0
const data = computed(() => filteredResult.value.map((r, index) => {
  if (index === 0) {
    tempSum = 0
  }
  const yValue = tempSum + (r.payout - r.amount) * (displayInfiatEnabled.value ? cryptoToFiat(1, r.currency_code, activeFiatCode.value) : cryptoToFiat(1, r.currency_code, activeFiatCode.value) / cryptoToFiat(1, activeCryptoCode.value, activeFiatCode.value))
  tempSum = yValue
  return ({ x: index, y: yValue })
}))

const series = computed(() => [
  {
    name: 'series-1',
    data: [...data.value],
  },
])

const handleClose = () => {
  toggleGameStatsPopup()
}
// Set the current game popup to top priority popup
const handleWindowClick = () => {
  setTopPopupGameSlug(modalSlug)
}

// To check popup position when user resize window
watch(
  () => screen.value.width,
  (v) => {
    const currentRightPosition = width.value + left.value
    if (currentRightPosition >= v) {
      left.value = screen.value.width - width.value - 20
    }
  }
)

// Popup event handlers
const onResizing = () => {
  isResizingPopup.value = true
}
const onResizeStop = () => {
  isResizingPopup.value = false
}
const onDeactivated = () => {
}

const handleReset = () => {
  resetBetsResult()
}

const meXp = computed(() => (Math.round((vip.value?.dualRank?.percentage || 0) * 10) / 10))

const route = useRoute()
let previousSubscriptionOff: (() => void) | null = null
const subscriptionLiveBet = () => {
  if (!isLoggedIn.value || !me.value?.id) {
    return () => {
    }
  }

  const { result, onResult } = useSubscription(LIVE_FEED_USER_SUBSCRIPTION, {})

  const { off } = onResult(() => {
    if (
      isLoggedIn.value &&
      me.value?.id &&
      result.value.liveFeedUser?.user_id &&
      Number(me.value?.id) === Number(result.value.liveFeedUser?.user_id) &&
      Number(result.value.liveFeedUser?.amount) > 0
    ) {
      betResults.value.push(result.value.liveFeedUser)
    }
  })

  return off
}

watch(() => isLoggedIn.value, (v) => {
  if (v) {
    if (previousSubscriptionOff) {
      previousSubscriptionOff()
    }

    previousSubscriptionOff = subscriptionLiveBet()
  }
}, { immediate: isLoggedIn.value })

watch(() => route.fullPath, (v) => {
  if (v) {
    if (previousSubscriptionOff) {
      previousSubscriptionOff()
    }

    previousSubscriptionOff = subscriptionLiveBet()
  }
}, { immediate: true })

onMounted(() => {
  if (previousSubscriptionOff) {
    previousSubscriptionOff()
  }

  previousSubscriptionOff = subscriptionLiveBet()
})
</script>

<template>
  <DraggableResizable
    v-model:h="height"
    v-model:w="width"
    v-model:x="left"
    v-model:y="top"
    :active="true"
    :lock-aspect-ratio="false"
    :max-height="maxHeight"
    :max-width="maxWidth"
    :min-width="width"
    :style="[topPopupGameSlug === modalSlug ? 'z-index: 1006 !important;' : '']"
    class-name="GamePopupRoot"
    handles-type="borders"
    parent="#parent_stats_container"
    @deactivated="onDeactivated"
    @resizestop="onResizeStop"
    @resizing="onResizing"
  >
    <div
      class="GameStatsPopup bg-brand rounded-md h-full border border-green-950"
      @mousedown="handleWindowClick"
    >
      <div
        id="game_popup_header"
        class="
          GamePopupHeader px-4 py-2.5 flex justify-between
          drag-el cursor-move bg-green-950 rounded-t-sm shadow-md items-center
        "
      >
        <div class="GamePopupTitle text-base text-white flex items-center gap-2 font-bold">
          <svg class="w-4 h-4 md:w-5 md:h-5 min-w-4 min-h-4 md:min-w-5 md:min-h-5">
            <use :href="STATISTICS_BAR_ICON" />
          </svg>
          {{ t('games.tool-live-stats') }}
        </div>
        <div class="GamePopupAction flex gap-2.5 cursor-pointer">
          <UTooltip
            :content="{ side: 'top' }"
            arrow
            text="Close"
          >
            <UIcon
              class="h-5 w-5 min-w-5 min-h-5 text-paragraph hover:text-white"
              name="i-heroicons-x-mark-20-solid"
              @click="handleClose"
              @click.stop
            />
          </UTooltip>
        </div>
      </div>

      <div class="w-full h-[calc(100%-45px)] relative">
        <div
          id="game_stats_popup_content_container"
          ref="gameStatsContainer"
          class="GameStatsPopupContent w-full h-full md:p-4 p-2.5 flex flex-col gap-2.5 md:gap-4"
        >
          <div class="flex justify-between items-center w-full gap-2">
            <div class="w-full">
              <USelect
                v-model="gameFilter"
                :items="gameOptions"
                :arrow="true"
                class="w-full text-sm h-10 text-white bg-green-950! font-bold leading-none"
                label-key="label"
                size="lg"
                value-key="value"
              />
            </div>
            <JButton
              class="px-7"
              button-class="bg-brand"
              variant="outline"
              @click="handleReset"
            >
              Reset
            </JButton>
          </div>
          <div class="bg-green-950 rounded-md p-4">
            <div class="flex h-full">
              <div class="flex-[1.5] flex flex-col gap-1">
                <div>
                  <div class="text-white text-xs font-bold">
                    {{ t('games.profit') }}/{{ t('games.loss') }}
                  </div>
                  <div
                    v-if="!displayInfiatEnabled"
                    class="flex items-center gap-1"
                  >
                    <UIcon
                      v-if="currentCryptoCurrency?.iconType === 'ui'"
                      :name="currentCryptoCurrency?.icon"
                      class="w-5 h-5 min-h-5 min-w-5"
                    />
                    <svg
                      v-else-if="currentCryptoCurrency?.iconType === 'symbol'"
                      class="h-7 w-7 min-w-7 min-h-7"
                    >
                      <use :href="currentCryptoCurrency.icon || ''" />
                    </svg>
                    <UAvatar
                      v-else
                      :alt="currentCryptoCurrency?.name"
                      :src="currentCryptoCurrency?.logo"
                      class="w-5 h-5 min-h-5 min-w-5"
                      img-class="w-5 h-5"
                      size="sm"
                    />
                    <span
                      :class="{
                        'text-red-600': plValue < 0,
                        'text-primary': plValue > 0,
                        'text-white': plValue === 0,
                      }"
                      class="text-xs font-bold overflow-hidden text-ellipsis max-w-[140px]"
                    >{{ plValue.toFixed(8) }}</span>
                  </div>
                  <div
                    v-else
                    class="mr-auto"
                  >
                    <UTooltip
                      :content="{ side: 'top' }"
                      arrow
                      :text="plCryptoValue.toFixed(8)"
                    >
                      <div class="flex items-center gap-1">
                        <UIcon
                          v-if="currentFiatCurrency?.iconType === 'ui'"
                          :name="currentFiatCurrency?.icon"
                          class="w-5 h-5 min-h-5 min-w-5"
                        />
                        <svg
                          v-else-if="currentFiatCurrency?.iconType === 'symbol'"
                          class="w-5 h-5 min-h-5 min-w-5"
                        >
                          <use :href="currentFiatCurrency?.icon" />
                        </svg>
                        <UAvatar
                          v-else
                          :alt="currentFiatCurrency?.name"
                          :src="currentFiatCurrency?.logo"
                          class="w-5 h-5 min-h-5 min-w-5"
                          img-class="w-5 h-5"
                          size="sm"
                        />
                        <span
                          :class="{
                            'text-red-600': plValue < 0,
                            'text-primary': plValue > 0,
                            'text-white': plValue === 0,
                          }"
                          class="text-xs font-bold overflow-hidden text-ellipsis max-w-[140px]"
                        >{{ displayFiatAmount(plValue) }}</span>
                      </div>
                    </UTooltip>
                  </div>
                </div>
                <div class="flex flex-col gap-1.5">
                  <span class="text-white text-xs font-bold">
                    {{ t('base.wagered') }}
                  </span>
                  <div
                    v-if="!displayInfiatEnabled"
                    class="flex items-center gap-1"
                  >
                    <UIcon
                      v-if="currentCryptoCurrency?.iconType === 'ui'"
                      :name="currentCryptoCurrency?.icon"
                      class="w-5 h-5 min-h-5 min-w-5"
                    />
                    <svg
                      v-else-if="currentCryptoCurrency?.iconType === 'symbol'"
                      class="w-5 h-5 min-h-5 min-w-5"
                    >
                      <use :href="currentCryptoCurrency.icon || ''" />
                    </svg>
                    <UAvatar
                      v-else
                      :alt="currentCryptoCurrency?.name"
                      :src="currentCryptoCurrency?.logo"
                      class="w-5 h-5 min-h-5 min-w-5"
                      img-class="w-5 h-5"
                      size="sm"
                    />
                    <span class="text-white text-xs font-bold overflow-hidden text-ellipsis max-w-[140px]">
                      {{ wageredValue.toFixed(8) }}
                    </span>
                  </div>
                  <div
                    v-else
                    class="mr-auto"
                  >
                    <UTooltip
                      :content="{ side: 'top' }"
                      arrow
                      :text="wageredCryptoValue.toFixed(8)"
                    >
                      <div class="flex items-center gap-1">
                        <UIcon
                          v-if="currentFiatCurrency?.iconType === 'ui'"
                          :name="currentFiatCurrency?.icon"
                          class="w-5 h-5 min-h-5 min-w-5"
                        />
                        <svg
                          v-else-if="currentFiatCurrency?.iconType === 'symbol'"
                          class="w-5 h-5 min-h-5 min-w-5"
                        >
                          <use :href="currentFiatCurrency?.icon" />
                        </svg>
                        <UAvatar
                          v-else
                          :alt="currentFiatCurrency?.name"
                          :src="currentFiatCurrency?.logo"
                          class="w-5 h-5 min-h-5 min-w-5"
                          img-class="w-5 h-5"
                          size="sm"
                        />
                        <span class="text-white text-xs font-bold overflow-hidden text-ellipsis max-w-[140px]">
                            {{ displayFiatAmount(wageredValue) }}
                          </span>
                      </div>
                    </UTooltip>
                  </div>
                </div>
              </div>
              <div class="w-0.5 h-full bg-border" />
              <div class="flex-1 text-right flex flex-col gap-1">
                <div>
                  <div class="text-white text-xs font-bold">
                    {{ t('bets.wins') }}/{{ t('bets.losses') }}
                  </div>
                  <div class="flex gap-1 justify-end">
                    <span class="text-primary text-xs font-bold">{{ winsValue }}</span>
                    <span class="text-white text-xs font-bold">-</span>
                    <span class="text-red-600 text-xs font-bold">{{ lossesValue }}</span>
                  </div>
                </div>
                <div>
                  <div class="text-white text-xs font-bold">
                    {{ t('vip.rtp') }}
                  </div>
                  <div>
                    <span
                      :class="{
                        'text-red-600': rtpValue > 0 && rtpValue < 100,
                        'text-primary': rtpValue >= 100,
                        'text-white': rtpValue === 0,
                      }"
                      class="text-xs font-bold"
                    >{{ rtpValue.toFixed(2) }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-green-950 rounded-md">
            <div class="flex flex-col h-full relative">
              <div class="h-[157px] md:h-[171px]">
                <vue-apex-charts
                  :options="options"
                  :series="series"
                  height="171px"
                  type="area"
                  width="100%"
                />
              </div>
            </div>
          </div>
          <div class="bg-green-950 rounded-md p-4">
            <div class="flex justify-center flex-col gap-1 w-full">
              <div class="flex justify-between">
                <div class="text-xs font-bold text-white">
                  {{ vip.dualRank?.vipLevel }}
                </div>
                <div class="text-white text-xs font-bold">
                  {{ meXp }}%
                </div>
              </div>
              <div class="w-full">
                <JProgressBar
                  :max="100"
                  :value="meXp"
                  class="flex-1 bg-brand!"
                  color="bg-primary-gradient"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="isResizingPopup"
          class="absolute inset-0 flex justify-center items-center font-bold"
        />
      </div>
    </div>
  </DraggableResizable>
</template>
<style lang="scss">
.GamePopupRoot {
  position: absolute !important;
  z-index: 1005 !important;
  pointer-events: fill;
  border: none !important;
  height: auto !important;
  max-height: calc(100% - 150px) !important;

  .GameStatsPopup {
    overflow: visible;

    .GameStatsPopupContent {
      .apexcharts-gridline {
        stroke-dasharray: 17;
        opacity: 0;
      }

      .apexcharts-tooltip.apexcharts-theme-light {
        background: transparent !important;
        border: 1px solid #021902 !important;
      }

      .apexcharts-xaxistooltip {
        background: #021902 !important;
        color: white !important;
        margin-top: 4px;
        padding-bottom: 0;
        font-weight: bold;
        border: 1px solid #021902 !important;
      }

      .apexcharts-xaxistooltip-bottom:before {
        border-bottom-color: #021902 !important;
      }

      .apexcharts-xaxistooltip-bottom:after {
        border-bottom-color: #021902 !important;
      }
    }
  }
}
</style>
