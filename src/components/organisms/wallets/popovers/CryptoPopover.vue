<script lang="ts" setup>
import { CURRENCY, THEME } from '~/constants'
import CroptoCurrencyPopover from '~/components/organisms/wallets/popovers/CroptoCurrencyPopover.vue'
import type { CurrencyItem } from '~/types'

const {
  showLabel = true,
  autoPlace = false,
  contentHeight = 0,
  buttonClass = 'w-full pl-3 lg:pl-4 pr-2 lg:pr-3 py-2.5 rounded-md bg-brand!',
  initSelectedCurrency
} = defineProps<{
  showLabel?: boolean;
  autoPlace?: boolean;
  contentHeight?: number;
  buttonClass?: string;
  initSelectedCurrency?: string;
  excludeInit?: string;
}>()
const emit = defineEmits<{ (e: 'update:initSelectedCrypto', value: string): void }>()

const { screen } = inject(THEME)!
const { cryptoCurrencies } = inject(CURRENCY)!
const openPopover = ref(false)
const router = useRouter()
const route = useRoute()

const selectedCurrency = computed({
  get () {
    return initSelectedCurrency || (route.query.currency ? String(route.query.currency) : '')
  },
  set (v) {
    if (initSelectedCurrency || initSelectedCurrency === '') {
      emit('update:initSelectedCrypto', v)
    } else {
      router.replace({ query: { ...route.query, currency: v } })
    }
  }
})

const onSelect = (code: string) => {
  selectedCurrency.value = code
  openPopover.value = false
}

const cryptoItem = computed(() => cryptoCurrencies.value.find((cItem: CurrencyItem) => cItem.code === selectedCurrency.value))

watch(() => initSelectedCurrency, (v) => {
  if (v && v !== '') {
    selectedCurrency.value = v
  }
}, { immediate: true })
</script>

<template>
  <ClientOnly>
    <UPopover
      v-model:open="openPopover"
      :arrow="screen.md && !autoPlace"
      class="w-[calc(100%-56px)]"
    >
      <JButton
        :class="[buttonClass]"
        label-class="justify-between gap-x-2 sm:gap-x-3"
        variant="transparent"
      >
      <span
        v-if="cryptoItem"
        class="inline-flex gap-x-1.5 sm:gap-x-2 items-center w-full"
      >
        <UIcon
          v-if="cryptoItem?.iconType === 'ui'"
          :name="cryptoItem?.icon"
          class="h-7 w-7 min-w-7 min-h-7"
        />
        <svg
          v-else-if="cryptoItem?.iconType === 'symbol'"
          class="h-7 w-7 min-w-7 min-h-7"
        >
          <use :href="cryptoItem?.icon" />
        </svg>
        <UAvatar
          v-else
          :alt="cryptoItem?.name"
          :src="cryptoItem?.logo"
          class="h-7 w-7 min-w-7 min-h-7"
          img-class="w-7 h-7"
          size="sm"
        />
        <span
          class="text-sm text-white flex flex-col text-left justify-center"
        >
          <span
            v-if="showLabel"
            class="font-bold text-xxs leading-none block text-white truncate"
          >
            {{ cryptoItem?.name }}
          </span>
          <span
            :class="{
              'text-white font-bold text-sm block truncate': showLabel,
              'font-bold': !showLabel,
            }"
            class="text-paragraph leading-none"
          >
            {{ selectedCurrency }}
          </span>
        </span>
      </span>
        <span v-else>Select a Token</span>

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
        <CroptoCurrencyPopover
          :content-height="contentHeight"
          :exclude-init="excludeInit"
          @selected:token="onSelect($event)"
        />
      </template>
    </UPopover>
  </ClientOnly>
</template>
