<script lang="ts" setup>
import { CURRENCY, PREFERENCE, THEME } from '~/constants'
import BalancesPopover from '~/components/organisms/wallets/popovers/BalancesPopover.vue'
import type { CurrencyItem } from '~/types'

const {
  isVault = false,
  contentHeight = 0,
  buttonClass = 'w-full pl-3 lg:pl-4 pr-2 lg:pr-3 py-3 rounded-md bg-green-950!'
} = defineProps<{
  isVault?: boolean;
  contentHeight?: number;
  buttonClass?: string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
}>()

const { screen } = inject(THEME)!
const { cryptoCurrencies } = inject(CURRENCY)!
const { activeCryptoCode } = inject(PREFERENCE)!
const openPopover = ref(false)
const router = useRouter()
const route = useRoute()

const selectedCurrency = computed({
  get () {
    return (route.query.currency ? String(route.query.currency) : activeCryptoCode.value)
  },
  set (v) {
    router.replace({ query: { ...route.query, currency: v } })
  }
})

const onSelect = (code: string) => {
  selectedCurrency.value = code
  openPopover.value = false
}

const cryptoItem = computed(() => cryptoCurrencies.value.find((cItem: CurrencyItem) => cItem.code === selectedCurrency.value))
</script>

<template>
  <ClientOnly>
    <UPopover
      v-model:open="openPopover"
      :content="{
      side: !!placement ? placement : 'bottom'
    }"
      :arrow="screen.md"
      class="w-[calc(100%-56px)]"
    >
      <JButton
        :class="[buttonClass]"
        label-class="justify-between gap-x-2 sm:gap-x-3"
        variant="alternative"
      >
        <span class="inline-flex gap-x-1.5 sm:gap-x-2 items-center w-full">
          <UIcon
            v-if="cryptoItem?.iconType === 'ui'"
            :name="cryptoItem?.icon"
            class="h-6 w-6 min-w-6 min-h-6"
          />
          <svg
            v-else-if="cryptoItem?.iconType === 'symbol'"
            class="h-6 w-6 min-h-6 min-w-6"
          >
            <use :href="cryptoItem.icon || ''" />
          </svg>
          <UAvatar
            v-else
            :alt="cryptoItem?.name"
            :src="cryptoItem?.logo"
            class="h-6 w-6 min-w-6 min-h-6"
            img-class="w-6 h-6"
            size="sm"
          />
          <span
            class="text-sm text-white font-bold"
          >{{ selectedCurrency }}</span>
        </span>

        <template #endIcon>
        <span class="w-6 h-6 min-w-6 min-h-6 text-paragraph hover:text-white p-0 flex items-center">
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

      <template #content>
        <BalancesPopover
          :content-height="contentHeight"
          :is-vault="isVault"
          @selected:token="onSelect($event)"
        />
      </template>
    </UPopover>
  </ClientOnly>
</template>
