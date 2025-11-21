<script lang="ts" setup>
import copy from 'copy-to-clipboard'
import QrcodeVue from 'qrcode.vue'
import TokenPopover from '~/components/organisms/wallets/popovers/TokenPopover.vue'
import { CURRENCY, THEME, WALLET, } from '~/constants'
import type { CurrencyItem } from '~/types'
import { LOADING_ICON } from '~/components/symbols'
import { RECENT_DEPOSITS_QUERY } from '~/graphql'
import RecentWalletTable from '~/components/organisms/wallets/contents/RecentWalletTable.vue'

const { screen } = inject(THEME)!
const { wallets } = inject(WALLET)!
const { cryptoCurrencies } = inject(CURRENCY)!
const route = useRoute()
const { t } = useI18n()
const selectedCryptoCode = computed(() => route.query.currency ? String(route.query.currency) : 'BTC')
const selectedCrypto = computed(() => cryptoCurrencies.value.find((cItem: CurrencyItem) => cItem.code === selectedCryptoCode.value))
const selectedNetwork = ref((selectedCrypto.value?.networks && selectedCrypto.value.networks.length) ? selectedCrypto.value.networks[0]?.id : 0)
const { result, loading, refetch, onError } = useWalletAddress({
  currencyCode: selectedCryptoCode.value,
  networkId: Number(selectedNetwork.value),
})
const wallet = computed(() => wallets.value.find(wallet => wallet.currency_code === selectedCryptoCode.value)!)
const address = computed(() => wallet.value?.activeAddress?.address || '')
const walletAddress = computed(() => result.value?.depositAddress?.walletAddress)
const addressQr = computed(() => result.value?.depositAddress?.addressQr)
const tagAddress = computed(() => result.value?.depositAddress?.tag)
const isTooltipVisible = ref<boolean>(false)
const { result: depositResult, loading: depositLoading } = useQuery(
  RECENT_DEPOSITS_QUERY, { filter: { limit: 10 } }
)
const depositTransactions = computed(() => (depositResult.value?.depositsByUser?.results || []).slice(0, 5))

const copyToClipboard = () => {
  if (!walletAddress.value && !address.value) {
    return
  }

  copy(walletAddress.value || address.value)
  isTooltipVisible.value = true
  setTimeout(() => {
    isTooltipVisible.value = false
  }, 1000)
}

const copyTagToClipboard = () => {
  if (!tagAddress.value) {
    return
  }

  copy(tagAddress.value)
  isTooltipVisible.value = true
  setTimeout(() => {
    isTooltipVisible.value = false
  }, 1000)
}

watch(() => selectedCryptoCode.value, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    selectedNetwork.value = (selectedCrypto.value?.networks && selectedCrypto.value?.networks.length)
      ? selectedCrypto.value.networks[0]?.id
      : 0
    refetch({
      currencyCode: newValue,
      networkId: Number(selectedNetwork.value),
    })
  }
})

onError((error) => {
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: t('notifications.failed-get-wallet-address'),
    description: parsedError.message,
  })
})

watch(() => selectedNetwork.value, (newValue) => {
  if (newValue !== 0) {
    refetch({
      currencyCode: selectedCryptoCode.value,
      networkId: Number(selectedNetwork.value),
    })
  }
})
</script>

<template>
  <div class="grid grid-cols-2 gap-x-3 gap-y-5 text-white text-sm">
    <div class="col-span-2 sm:col-span-1 font-bold flex flex-col gap-y-2">
      <span class="leading-none">{{ t('base.currency') }}</span>
      <TokenPopover :content-height="screen.md ? 300 : 150" />
    </div>

    <div
      v-if="selectedCrypto && selectedCrypto.networks && selectedCrypto.networks.length"
      class="col-span-2 sm:col-span-1 font-bold flex flex-col gap-y-2"
    >
      <span class="leading-none">{{ t('base.network') }}</span>
      <USelect
        v-model="selectedNetwork"
        :items="selectedCrypto.networks"
        :arrow="true"
        class="w-full bg-green-950! text-sm! border-none! leading-[17px]! h-12! ring-0!"
        label-key="name"
        size="lg"
        value-key="id"
      >
        <template #leading>
          <UIcon
            v-if="selectedCrypto?.iconType === 'ui'"
            :name="selectedCrypto?.icon"
            class="h-6 w-6 min-w-6 min-h-6"
          />
          <svg
            v-else-if="selectedCrypto?.iconType === 'symbol'"
            class="h-6 w-6 min-w-6 min-h-6"
          >
            <use :href="selectedCrypto.icon || ''" />
          </svg>
          <UAvatar
            v-else
            :alt="selectedCrypto?.name"
            :src="selectedCrypto?.logo"
            class="h-6 w-6 min-w-6 min-h-6"
            img-class="w-6 h-6"
            size="sm"
          />
        </template>
      </USelect>
    </div>

    <div
      v-if="!loading"
      class="col-span-2 font-bold flex flex-col gap-y-2"
    >
      <span class="leading-none">
        {{ t('currency.btc-deposit-address') }}
      </span>
      <div
        class="
          w-full h-12 flex items-center gap-x-2 px-3 lg:px-4 py-3.5
          border border-primary rounded
        "
      >
        <div class="w-full overflow-hidden">
          {{ walletAddress || address }}
        </div>
        <div class="flex h-full items-center gap-x-1">
          <UTooltip
            :content="{ side: 'top' }"
            arrow
            :text="isTooltipVisible ? `${t('base.copied')}!` : t('base.copy')"
          >
            <div
              :class="{
                  'cursor-copy bg-green-950 text-paragraph hover:text-white': !!address,
                  'pointer-events-none cursor-not-allowed text-disabled-paragraph': !address,
                }"
              class="px-3 py-1 rounded-md flex items-center"
              @click="copyToClipboard"
            >
              <UIcon
                class="w-4 h-4 min-h-4"
                name="icon-park-solid:copy"
              />
            </div>
          </UTooltip>
        </div>
      </div>
      <span
        v-if="selectedCryptoCode === 'XRP'"
        class="leading-none"
      >
        Deposit Tag
      </span>
      <div
        v-if="selectedCryptoCode === 'XRP'"
        class="
          w-full h-12 flex items-center gap-x-2 px-3 lg:px-4 py-3.5
          border border-primary rounded
        "
      >
        <div class="w-full overflow-hidden">
          {{ tagAddress }}
        </div>
        <div class="flex h-full items-center gap-x-1">
          <UTooltip
            :content="{ side: 'top' }"
            arrow
            :text="isTooltipVisible ? `${t('base.copied')}!` : t('base.copy')"
          >
            <div
              :class="{
                'cursor-copy bg-green-950 text-paragraph hover:text-white': !!address,
                'pointer-events-none cursor-not-allowed text-disabled-paragraph': !address,
              }"
              class="px-3 py-1 rounded-md flex items-center"
              @click="copyTagToClipboard"
            >
              <UIcon
                class="w-4 h-4 min-h-4"
                name="icon-park-solid:copy"
              />
            </div>
          </UTooltip>
        </div>
      </div>
      <!--      <span class="text-paragraph text-xs leading-none">-->
      <!--        {{ t('currency.min-deposit-is') }} $10.00-->
      <!--      </span>-->
    </div>

    <div
      v-if="!loading"
      class="col-span-2 sm:col-span-1 font-bold flex flex-col gap-y-2"
    >
      <span class="leading-none">{{ t('currency.confirmation-time') }}</span>
      <div class="py-3.5 h-12 px-3 lg:px-4 border border-border rounded-md">
        {{ selectedCrypto?.min_confirmtime }}
        ~
        {{ selectedCrypto?.max_confirmtime }}
        {{ selectedCrypto?.confirmtime_unit }}
      </div>
    </div>

    <div
      v-if="!loading"
      class="col-span-2 sm:col-span-1 flex justify-start sm:justify-end"
    >
      <div
        class="
          w-[170px] h-[170px] bg-white
          rounded
          flex items-center justify-center
        "
      >
        <div
          v-if="addressQr"
          class="
            w-[170px] h-[170px] bg-white
            rounded-md p-3
            flex items-center justify-center
          "
          v-html="addressQr"
        />
        <qrcode-vue
          v-else
          :size="154"
          :value="address"
          foreground="black"
          level="H"
          render-as="svg"
        />
      </div>
    </div>

    <div
      v-if="loading"
      class="w-full col-span-2 flex items-center justify-center py-10"
      @click.prevent
    >
      <svg class="text-paragraph animate-spin w-8 h-8">
        <use :href="LOADING_ICON" />
      </svg>
    </div>

    <div
      v-if="!loading"
      class="w-full col-span-2 flex flex-col"
    >
      <div class="font-bold text-white">
        My Recent Deposits
      </div>
      <RecentWalletTable
        :loading="depositLoading"
        :rows="depositTransactions"
        table-name="deposits"
      />
    </div>
  </div>
</template>
