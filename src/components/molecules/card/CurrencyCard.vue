<script lang="ts" setup>
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import dayjs from 'dayjs'
import type { Currency, CurrencyItem } from '~/types'
import { AUTH, cryptoCurrencyMap, CURRENCY, PREFERENCE } from '~/constants'
import { useCurrencyFavorite } from '~/composables/currency/useCurrencyFavorite'
import { numberWithCommas } from '~/utils'

const { currency } = defineProps<{
  currency: CurrencyItem
}>()

const { isLoggedIn, openAuthModal } = inject(AUTH)!
const { activeCryptoCode } = inject(PREFERENCE)!
const { cryptoCurrencies } = inject(CURRENCY)!

const router = useRouter()
const route = useRoute()

const currencyItem = computed(() => cryptoCurrencies.value?.find(
  (item: Currency) => item.code === currency?.code)
)

const lastPrice = computed(() => {
  return (currencyItem.value?.current_price || currency?.last_price)?.toFixed(8)
})

const {
  isInFavorites,
  toggleFavorite
} = useCurrencyFavorite(Number(currency.id) || 0)

const changedKline = computed(() => {
  const tCloseDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

  if (currency?.klines && currency?.klines.length) {
    return (
      currency.klines.find((item) => {
        return tCloseDate === dayjs(item.closeDateTime).format('YYYY-MM-DD')
      })
    ) || (currency.klines.length > 1
      ? currency.klines[currency.klines.length - 2]
      : currency.klines[0])
  } else {
    return {
      closeDateTime: '',
      closePrice: 0,
      interval: '1d',
      __typename: 'Kline'
    }
  }
})

const priceChange = computed(() => {
  const tKline: any = changedKline.value

  if (tKline) {
    return (lastPrice.value || tKline.closePrice) - tKline.closePrice
  }

  return 0
})

const percentageChange = computed(() => {
  const tKline: any = changedKline.value

  if (tKline && tKline.closePrice !== 0) {
    const percentPrice = ((priceChange.value / tKline.closePrice) * 100)

    return parseFloat(percentPrice.toFixed(2))
  }

  return 0
})

const openAlertModal = (code: string) => {
  if (!isLoggedIn.value) {
    openAuthModal()
  } else {
    router.push({
      path: router.currentRoute.value.path,
      query: {
        ...route.query,
        modal: 'crypto-alert',
        currency: code
      }
    })
  }
}

const openExchangeModal = (code: string) => {
  if (!isLoggedIn.value) {
    openAuthModal()
  } else {
    router.push({
      path: router.currentRoute.value.path,
      query: {
        ...route.query,
        modal: 'crypto-exchange',
        currency: activeCryptoCode.value,
        code,
      }
    })
  }
}

const changeColor = ref(false)
const setColorInterval = ref()
watch(() => lastPrice.value, () => {
  changeColor.value = true

  useTimeoutFn(() => {
    changeColor.value = false
  }, 600)
})

const [priceParent] = useAutoAnimate({
  duration: 200,
})

onBeforeUnmount(() => {
  if (setColorInterval.value) {
    clearInterval(setColorInterval.value)
  }
})

onMounted(() => {
  if (setColorInterval.value) {
    clearInterval(setColorInterval.value)
  }

  setColorInterval.value = setInterval(() => {
    changeColor.value = true

    useTimeoutFn(() => {
      changeColor.value = false
    }, 600)
  }, 15000)
})
</script>

<template>
  <div class="w-[241px]">
    <div class="w-full h-full">
      <div
        class="
          flex items-center justify-between gap-x-1.5 bg-green-950
          px-3 rounded-md overflow-hidden h-full py-4
        "
      >
        <UIcon
          v-if="currency.iconType === 'ui'"
          :name="currency.icon"
          class="w-8 h-8 min-w-8 min-h-8"
        />
        <svg
          v-else-if="currency?.iconType === 'symbol'"
          class="w-8 h-8 min-w-8 min-h-8"
        >
          <use :href="currency.icon || ''" />
        </svg>
        <UAvatar
          v-else
          :alt="currency.name"
          :src="currency?.logo"
          class="w-8 h-8 p-0 m-0 min-w-8 min-h-8"
          img-class="w-8 h-8"
          size="sm"
        />
        <div class="flex flex-col w-full gap-y-1">
          <div
            ref="priceParent"
            class="flex items-center gap-x-1.5 w-full text-white"
          >
            <div
              v-if="priceChange >= 0"
              class="text-base font-bold leading-none transition-all duration-200"
              :class="{
                'text-highlights': changeColor
              }"
            >
              {{ numberWithCommas(Number(lastPrice), 5) }}
            </div>
            <div
              v-else
              class="text-base font-bold leading-none transition-all duration-200"
              :class="{
                'text-red-600': changeColor
              }"
            >
              {{ numberWithCommas(Number(lastPrice), 5) }}
            </div>
            <div class="text-xxs leading-none mt-0.5 font-bold text-paragraph">
              USD
            </div>
          </div>

          <div class="flex font-semibold">
            <span
              v-if="priceChange >= 0"
              class="text-highlights text-sm flex items-center leading-none"
            >
              <UIcon
                class="font-bold w-4 h-4 min-h-4 min-w-4"
                name="heroicons:arrow-trending-up-16-solid"
              />
              <span class="flex items-center gap-x-1">
                +{{ numberWithCommas(priceChange, 4) }}
                <span class="text-paragraph">|</span>
                {{ numberWithCommas(percentageChange, 2) }}%
              </span>
            </span>
            <span
              v-else
              class="text-red-600 text-sm flex items-center leading-none"
            >
              <UIcon
                class="font-bold w-4 h-4 min-h-4 min-w-4"
                name="heroicons:arrow-trending-down-16-solid"
              />
              <span class="flex items-center gap-x-1">
                {{ numberWithCommas(priceChange, 4) }}
                <span class="text-paragraph">|</span>
                {{ numberWithCommas(Math.abs(percentageChange), 2) }}%
              </span>
            </span>
          </div>
        </div>
        <div
          class="
            flex flex-col items-end justify-center
            gap-y-2 w-6 min-w-6 cursor-pointer
          "
        >
          <UIcon
            :class="{
              'text-disabled-icon': (!isLoggedIn || (isLoggedIn && !isInFavorites)),
              'text-highlights': isLoggedIn && isInFavorites,
              'hover:text-white': !isInFavorites
            }"
            class="w-4 h-4 min-w-4 min-h-4"
            name="heroicons:star-20-solid"
            @click="toggleFavorite"
          />
          <UIcon
            :class="{
              'text-disabled-icon': !isLoggedIn,
            }"
            class="w-4 h-4 min-w-4 min-h-4 text-disabled-icon hover:text-white"
            name="heroicons:bell-alert-20-solid"
            @click="openAlertModal(currency.code)"
          />
          <UIcon
            :class="{
              'text-disabled-icon': !isLoggedIn,
            }"
            class="w-4 h-4 min-w-4 min-h-4 text-disabled-icon -mt-0.5 hover:text-white"
            name="tabler:arrows-exchange"
            @click="openExchangeModal(currency.code)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
