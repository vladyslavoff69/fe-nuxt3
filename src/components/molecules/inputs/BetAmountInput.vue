<script lang="ts" setup>
import { maxValue, minValue, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { useGameSettingStore } from '~/store/games/settings'
import { CURRENCY, PREFERENCE } from '~/constants'

const { modelValue, lock = false } = defineProps<{
  modelValue: number | bigint | any;
  lock?: boolean;
  className?: string;
  endIcon?: string;
}>()

const emits = defineEmits<{
    (e: 'update:modelValue', value: number): void;
  }>()

const { t } = useI18n()
const store = useGameSettingStore()
const { activeCryptoCode, displayInfiatEnabled } = inject(PREFERENCE)!
const {
  currentCryptoToFiat,
  currentCryptoBalance,
  currentFiatCurrency,
  currentBalance,
  currentCryptoCurrency,
  displayFiatAmount,
  displayCurrentCryptoAmount
} = inject(CURRENCY)!

const fiatAmount = computed(() => parseFloat((modelValue * currentCryptoToFiat.value).toFixed(10)))
const amountDisplayed = computed(() => displayInfiatEnabled.value ? fiatAmount.value : modelValue)

const rules = computed(() => ({
  modelValue: {
    required,
    minValue: minValue(0),
    maxValue: maxValue(currentCryptoBalance.value),
  },
}))

const v$ = useVuelidate(rules, { modelValue: computed(() => modelValue) })
const maxClicked = ref<boolean>(false)
const blurred = ref<boolean>(true)
const mouseEnterShow = ref<boolean>(false)
const inputRef = ref()

const handleMaxClick = () => {
  maxClicked.value = true
}

const isPlayable = () => {
  if (v$.value.modelValue.$error) {
    store.setGamePlayable({ amount: false })
  } else {
    store.setGamePlayable({ amount: true })
  }
}

const handleBlur = async () => {
  blurred.value = true
  mouseEnterShow.value = false
}

const handleFocus = () => {
  blurred.value = false
  mouseEnterShow.value = true
}

const handleMouseEnter = () => {
  if (blurred.value) {
    mouseEnterShow.value = true
  }
}

const handleMouseLeave = () => {
  if (blurred.value) {
    mouseEnterShow.value = false
  }
}

const toCrypto = (amount: number): number => {
  if (displayInfiatEnabled.value) {
    return amount / currentCryptoToFiat.value
  }
  return amount
}

const doHalfAmount = async () => {
  if (Number(modelValue) / 2 < 0) {
    useGeneralNotify({
      type: 'error',
      title: 'Invalid Bet Amount!',
      description: 'The minimum bet amount is 0'
    })

    return
  }

  emits('update:modelValue', Number(modelValue) / 2)
  maxClicked.value = false
}

const doDoubleAmount = async () => {
  let localAmount = modelValue
  if (localAmount <= 0) {
    localAmount = 0.00000001
  }

  if (Number(localAmount) * 2 > Number(currentCryptoBalance.value)) {
    useGeneralNotify({
      type: 'error',
      title: 'Invalid Bet Amount!',
      description: 'The bet amount cannot exceed the available balance.'
    })

    emits('update:modelValue', Number(currentCryptoBalance.value))
  } else {
    emits('update:modelValue', Number(localAmount) * 2)
  }

  maxClicked.value = false
}

const doMaxAmount = () => {
  emits('update:modelValue', Number(currentCryptoBalance.value))

  maxClicked.value = false
}

const updateAmount = async (val: number | string) => {
  if (Number(val) < 0) {
    val = 0
  }

  if (toCrypto(Number(val)) > Number(currentCryptoBalance.value)) {
    useGeneralNotify({
      type: 'error',
      title: 'Invalid Bet Amount!',
      description: 'The bet amount cannot exceed the available balance.'
    })

    emits('update:modelValue', Number(currentCryptoBalance.value))
  } else {
    emits('update:modelValue', toCrypto(Number(val)))
  }

  maxClicked.value = false
}

watch(
  () => modelValue,
  async () => {
    await v$.value.modelValue.$validate()
    isPlayable()
  }
)

watch(
  () => activeCryptoCode.value,
  async () => {
    emits('update:modelValue', 0)
  }
)

onMounted(async () => {
  blurred.value = true
  await v$.value.modelValue.$validate()
  isPlayable()
})
</script>

<template>
  <div class="BetGameInput w-full flex flex-col gap-y-1">
    <div
      class="flex flex-row items-center justify-between text-sm font-bold leading-none"
    >
      <span>
        {{ t('games.bet-amount') }}
      </span>
      <span>
        {{ displayInfiatEnabled ? displayCurrentCryptoAmount(modelValue) : displayFiatAmount(fiatAmount) }}
      </span>
    </div>
    <div
      class="BetAmountInput"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <UTooltip
        :content="{ side: 'top' }"
        arrow
        :prevent="!(v$.modelValue.$error && (!blurred || mouseEnterShow))"
      >
        <template #content>
          <div
            class="font-bold text-red-600 text-xs md:text-sm px-1.5 py-1"
          >
            {{
              v$.modelValue.minValue.$invalid
                ? t('errors.MIN_AMOUNT')
                : t('errors.BET_MAX_AMOUNT')
            }}
          </div>
        </template>
        <JInputNumber
          ref="inputRef"
          :class-name="className"
          :end-icon="endIcon"
          :error="v$.modelValue.$error && blurred"
          :max="Number(currentBalance)"
          :min="0"
          :model-value="amountDisplayed"
          :placeholder="displayInfiatEnabled ? '0.00' : '0.00000000'"
          :lock="lock"
          :step="displayInfiatEnabled ? 0.01 : 0.00000001"
          :to-fixed="modelValue === 0 ? 0 : (displayInfiatEnabled ? 2 : 8)"
          variant="none"
          @blur="handleBlur"
          @focus="handleFocus"
          @update:model-value="updateAmount"
        >
          <template #startIcon>
            <div
              v-if="displayInfiatEnabled"
              class="flex items-center"
            >
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
            </div>
            <div
              v-else-if="!displayInfiatEnabled"
              class="flex items-center"
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
            </div>
          </template>

          <template #endIcon>
            <div class="flex gap-x-1 items-center">
              <JButton
                :disabled="lock"
                class="z-10 py-1! px-0! w-7! mr-1 scale-125 leading-none rounded-[5px]!"
                size="sm"
                type="button"
                variant="alternative"
                @click="doHalfAmount"
              >
                ½
              </JButton>
              <JButton
                :disabled="lock"
                class="z-10 h-6! py-0! w-9!"
                size="sm"
                type="button"
                variant="alternative"
                @click="doDoubleAmount"
              >
                <span class="relative -ml-1">2<span class="absolute -bottom-px text-sm">×</span></span>
              </JButton>
              <JButton
                v-if="!maxClicked"
                :disabled="lock"
                class="z-10 h-6! py-0.5! w-9!"
                size="sm"
                type="button"
                variant="alternative"
                @click="handleMaxClick"
              >
                {{ t('base.max') }}
              </JButton>
              <JButton
                v-else
                :disabled="lock"
                class="z-10 duration-150 min-h-5! py-0.5! min-w-9"
                size="sm"
                type="button"
                variant="alternative"
                @click="doMaxAmount"
              >
                <span class="group-active:scale-95 text-white">
                  {{ t('base.sure') }}?
                </span>
              </JButton>
            </div>
          </template>
        </JInputNumber>
      </UTooltip>
    </div>
  </div>
</template>
