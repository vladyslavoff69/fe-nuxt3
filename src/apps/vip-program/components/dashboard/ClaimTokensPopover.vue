<script lang="ts" setup>
import { cryptoCurrencyMap, CURRENCY, PREFERENCE } from '~/constants'
import type { CurrencyItem } from '~/types'

const {
  modelValue = 'BTC',
  fiatUsdValue = 0,
} = defineProps<{
  modelValue: string;
  fiatUsdValue: number;
  width?: number;
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>()

const { cryptoToUsd, usdToFiat, displayFiatAmount, userBalances, cryptoCurrencies } = inject(CURRENCY)!
const cryptoItem = computed(() => cryptoCurrencies.value.find((cItem: CurrencyItem) => cItem.code === modelValue))

const openPopover = ref(false)
const buttonRef = ref()
const v = {
  get userBalanceCodes () {
    return userBalances.value.map(b => b.currencyCode)
  },
}
const { activeFiatCode, displayInfiatEnabled } = inject(PREFERENCE)!
const fiatBonusValue = computed(() => displayFiatAmount(usdToFiat.value[activeFiatCode.value] * fiatUsdValue))
const cryptoAmountByCode = (code: string) => {
  return Number(fiatUsdValue / cryptoToUsd.value[code]).toFixed(8)
}

const onSelect = (code: string) => {
  emit('update:modelValue', code)

  openPopover.value = false
}

const { width: popupWidth } = useElementRect(buttonRef)
</script>
<template>
  <UPopover
    v-model:open="openPopover"
    :arrow="false"
    class="max-h-[250px] md:max-h-full overflow-y-auto w-full"
  >
    <div
      ref="buttonRef"
      class="w-full"
    >
      <JButton
        class="w-full pl-3 lg:pl-4 pr-2 lg:pr-3 py-3 rounded-md bg-brand!"
        label-class="justify-between gap-x-2 sm:gap-x-3"
        variant="alternative"
      >
        <span
          class="flex gap-x-1.5 sm:gap-x-2 items-center justify-between w-full"
        >
          <span
            :class="openPopover ? 'text-white' : 'text-paragraph'"
            class="text-sm group-hover:text-white duration-200"
          >
            {{
              displayInfiatEnabled
                ? fiatBonusValue
                : cryptoAmountByCode(modelValue)
            }}
          </span>
          <UIcon
            v-if="cryptoItem?.iconType === 'ui'"
            :name="cryptoItem.icon || ''"
            class="h-4 w-4 min-w-4 min-h-4"
          />
          <svg
            v-else-if="cryptoItem?.iconType === 'symbol'"
            class="h-4 w-4 min-w-4 min-h-4"
          >
            <use :href="cryptoItem.icon || ''" />
          </svg>
          <UAvatar
            v-else-if="cryptoItem?.iconType === 'logo'"
            :src="cryptoItem?.icon || ''"
            :alt="cryptoItem.code"
            class="w-4 h-4 min-w-4 min-h-4 rounded-full"
            img-class="w-4 h-4"
            size="sm"
          />
        </span>

        <template #endIcon>
          <span
            class="w-6 h-6 min-w-6 min-h-6 text-paragraph hover:text-white p-0 flex items-center"
          >
            <UIcon
              v-if="openPopover"
              class="h-6 w-6 min-w-6 min-h-6"
              name="i-heroicons-chevron-up-20-solid"
            />
            <UIcon
              v-else
              class="h-6 w-6 min-w-6 min-h-6"
              name="i-heroicons-chevron-down-20-solid"
            />
          </span>
        </template>
      </JButton>
    </div>
    <template #content>
      <div
        v-for="code in v.userBalanceCodes"
        :key="code"
        :class="code === modelValue ? 'bg-divider-dark' : 'hover:bg-border'"
        :style="{
          width: `${Number(popupWidth)}px`,
        }"
        class="py-2 cursor-pointer group z-20 px-[27px] duration-200"
        @click="onSelect(code as string)"
      >
        <div
          class="flex gap-1.5 items-center text-paragraph group-hover:text-white justify-between duration-200"
        >
          <label class="text-sm font-bold cursor-pointer">
            {{
              displayInfiatEnabled
                ? fiatBonusValue
                : cryptoAmountByCode(code as string)
            }}
          </label>
          <UIcon
            v-if="cryptoCurrencyMap[code]?.iconType === 'ui'"
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
            v-else-if="cryptoCurrencyMap[code]?.iconType === 'logo'"
            :src="cryptoCurrencyMap[code]?.icon || ''"
            :alt="code"
            class="w-4 h-4 min-w-4 min-h-4 rounded-full"
            img-class="w-4 h-4"
            size="sm"
          />
          <span
            v-else
            class="text-sm"
          >
            {{ code }}
          </span>
        </div>
      </div>
    </template>
  </UPopover>
</template>
