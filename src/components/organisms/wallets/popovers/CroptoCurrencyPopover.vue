<script lang="ts" setup>
import { CURRENCY, CUSTOM_CRYPTO_ORDER, PREFERENCE } from '~/constants'
import type { CurrencyItem } from '~/types'

const {
  contentHeight = 0,
  excludeInit
} = defineProps<{
  contentHeight?: number;
  excludeInit?: string;
}>()

const emits =
  defineEmits<{
    (e: 'selected:token', code: string): void;
  }>()

const { orderedCryptoCodes, favoriteCryptoCodes } = inject(PREFERENCE)!
const { cryptoCurrencies } = inject(CURRENCY)!

const searchWord = ref<string>('')
const onSelect = (code: string) => {
  emits('selected:token', code)
  searchWord.value = ''
}

// eslint-disable-next-line vue/no-side-effects-in-computed-properties
const orderedCryptoItems = computed(() => cryptoCurrencies.value
  .sort((a: CurrencyItem, b: CurrencyItem) => {
    const hasFavoriteA =
      favoriteCryptoCodes.value && favoriteCryptoCodes.value.length > 0
        ? favoriteCryptoCodes.value.filter((fCode: CurrencyItem) => fCode.code === a.code)?.length > 0
        : false
    const hasFavoriteB = favoriteCryptoCodes.value && favoriteCryptoCodes.value.length > 0
      ? favoriteCryptoCodes.value.filter((fCode: CurrencyItem) => fCode.code === b.code)?.length > 0
      : false
    if (hasFavoriteA && !hasFavoriteB) {
      return -1
    } else if (!hasFavoriteA && hasFavoriteB) {
      return 1
    }

    const hasChildrenA = (orderedCryptoCodes.value && orderedCryptoCodes.value.length) ? orderedCryptoCodes.value.includes(a.code) : false
    const hasChildrenB = (orderedCryptoCodes.value && orderedCryptoCodes.value.length) ? orderedCryptoCodes.value.includes(b.code) : false

    if (hasChildrenA && !hasChildrenB) {
      return -1
    } else if (!hasChildrenA && hasChildrenB) {
      return 1
    } else {
      return 0
    }
  })
)

const initCode = computed(() => excludeInit || '')

const searchedCryptoItems = computed(
  () => orderedCryptoItems.value.filter(
    cryptoItem => cryptoItem.code !== initCode.value && cryptoItem.code.includes(searchWord.value.toUpperCase())
  ).sort((a, b) => {
    const indexA = CUSTOM_CRYPTO_ORDER.indexOf(a.code?.toUpperCase());
    const indexB = CUSTOM_CRYPTO_ORDER.indexOf(b.code?.toUpperCase());

    // If both items are in the custom order, sort by order
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // If only one item is in the custom order, it should come first
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    // If neither item is in the custom order, sort alphabetically
    return a.code.localeCompare(b.code);
  })
)
</script>

<template>
  <div
    class="px-2 pt-2 flex flex-col gap-y-2.5 w-full lg:w-[250px] pb-2 lg:p-2"
  >
    <UInput
      v-model="searchWord"
      color="neutral"
      icon="i-heroicons-magnifying-glass-20-solid"
      placeholder="Search currencies"
      size="md"
      type="text"
    />

    <JbScrollbar
      :height="contentHeight ? contentHeight + 'px' : '300px'"
      :scroll-x="false"
      style-type="invisible"
    >
      <div
        v-for="(cryptoItem, c) in searchedCryptoItems"
        :key="`key-${c}-hey-22`"
        class="
          flex items-center w-full
          p-2.5 rounded-md text-sm font-semibold
          cursor-pointer hover:bg-border duration-150
        "
        @click="onSelect(cryptoItem.code)"
      >
        <div class="flex items-center gap-x-2 cursor-pointer w-full">
          <UIcon
            v-if="cryptoItem?.iconType === 'ui'"
            :name="cryptoItem?.icon"
            class="w-5 h-5 min-h-5 min-w-5"
          />
          <svg
            v-else-if="cryptoItem?.iconType === 'symbol'"
            class="w-5 h-5 min-h-5 min-w-5"
          >
            <use :href="cryptoItem.icon || ''" />
          </svg>
          <UAvatar
            v-else
            :alt="cryptoItem?.name"
            :src="cryptoItem?.logo"
            class="w-5 h-5 min-h-5 min-w-5"
            img-class="w-5 h-5 min-h-5 min-w-5"
            size="sm"
          />

          <div
            class="flex flex-auto items-center justify-between text-white text-sm font-semibold leading-none"
          >
            <span class="font-bold">
              {{ cryptoItem?.name }}
            </span>
            <span class="text-paragraph text-xs">
              {{ cryptoItem.code }}
            </span>
          </div>
        </div>
      </div>
    </JbScrollbar>
  </div>
</template>
