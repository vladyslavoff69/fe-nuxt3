<script lang="ts" setup>
import { AUTH, CURRENCY, CUSTOM_CRYPTO_ORDER, PREFERENCE } from '~/constants'
import { SAVE_USER_PREFERENCES_MUTATION } from '~/graphql'
import { numberWithCommas } from '~/utils'

const {
  isVault = false,
  contentHeight = 0,
} = defineProps<{
  isVault?: boolean;
  contentHeight?: number;
}>()

const emits =
  defineEmits<{
    (e: 'selected:token', code: string): void;
  }>()

const { t } = useI18n()
const { me } = inject(AUTH)!
const { activeFiatCode, displayInfiatEnabled, hideZeroBalance, changedActiveCode } = inject(PREFERENCE)!
const { cryptoCurrencies, userBalances, cryptoToFiat, currentFiatCurrency, userBalancesByCode } = inject(CURRENCY)!
const { mutate, onDone } = useMutation(SAVE_USER_PREFERENCES_MUTATION)
const v = {
  get userBalanceCodes () {
    return userBalances.value.map(b => b.currencyCode)
  }
}

onDone(() => {
  changedActiveCode.value = true
})

const searchWord = ref<string>('')
const onSelect = (code: string) => {
  emits('selected:token', code)
  searchWord.value = ''
}

const cryptoItems = computed(() => cryptoCurrencies.value
  .filter(cc => v.userBalanceCodes.includes(cc.code))
  .map((cryptoCurrency) => {
    const userBalance = userBalances.value.find(ub => ub.currencyCode === cryptoCurrency.code)
    const cryptoBalance = userBalance?.availableBalance || 0
    const vaultedBalance = userBalance?.vaultedBalance || 0

    return {
      ...cryptoCurrency,
      cryptoBalance,
      vaultedBalance,
      fiatBalance: cryptoToFiat(cryptoBalance, cryptoCurrency.code, activeFiatCode.value),
      vaultedFiatBalance: cryptoToFiat(vaultedBalance, cryptoCurrency.code, activeFiatCode.value),
    }
  }))

const orderedCryptoItems = computed(() => cryptoItems.value
  .filter(oc => v.userBalanceCodes.includes(oc.code))
  .filter(
    c => hideZeroBalance.value
      ? (
        isVault ? userBalancesByCode.value[c.code]?.vaultedBalance > 0 : userBalancesByCode.value[c.code]?.availableBalance > 0
      )
      : true
  )
)

const searchedCryptoItems = computed(
  () => orderedCryptoItems.value.filter(
    cryptoItem => cryptoItem.code.includes(searchWord.value.toUpperCase())
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

const toggleZeroSwitch = (value: boolean) => {
  mutate({
    ...me.value?.preferences,
    hideZeroBalance: value,
    showVaultBalance: !value,
  }, {
    optimisticResponse: {
      saveUserPreferences: {
        __typename: me.value?.__typename || 'User',
        id: me.value?.id || 0,
        preferences: {
          ...me.value?.preferences,
          showVaultBalance: !value,
          hideZeroBalance: value
        }
      }
    }
  })
}
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
        :key="`key-${c}-hey-21`"
        class="
          flex items-center w-full p-2.5 rounded-md text-sm font-semibold
          cursor-pointer hover:bg-border duration-150
        "
        @click="onSelect(cryptoItem.code)"
      >
        <div class="flex items-center gap-x-2 cursor-pointer w-full">
          <UIcon
            v-if="cryptoItem?.iconType === 'ui'"
            :name="cryptoItem?.icon"
            class="w-4 h-4 min-h-4 min-w-4"
          />
          <svg
            v-else-if="cryptoItem?.iconType === 'symbol'"
            class="w-4 h-4 min-h-4 min-w-4"
          >
            <use :href="cryptoItem.icon || ''" />
          </svg>
          <UAvatar
            v-else
            :alt="cryptoItem?.name"
            :src="cryptoItem?.logo"
            class="w-4 h-4 min-h-4 min-w-4"
            img-class="w-5 h-5"
            size="sm"
          />

          <div
            class="flex flex-auto items-center text-white text-sm font-semibold leading-none"
          >
            <div class="w-full">
              {{ cryptoItem.code }}
            </div>
            <div
              v-if="!displayInfiatEnabled"
              class="ml-auto font-normal"
            >
              {{
                !isVault
                  ? parseInt(cryptoItem.cryptoBalance.toFixed(8))
                  : parseInt(cryptoItem.vaultedBalance.toFixed(8))
              }}.{{
                !isVault
                  ? (cryptoItem.cryptoBalance - Math.floor(cryptoItem.cryptoBalance))
                    .toFixed(8).slice(2)
                  : (cryptoItem.vaultedBalance - Math.floor(cryptoItem.vaultedBalance))
                    .toFixed(8).slice(2)
              }}
            </div>
            <div
              v-else
              class="ml-auto font-normal"
            >
              {{
                currentFiatCurrency.symbol
              }}{{
                numberWithCommas(Number(isVault ? cryptoItem.vaultedFiatBalance : cryptoItem.fiatBalance))
              }}
            </div>
          </div>
        </div>
      </div>
    </JbScrollbar>

    <div
      class="flex justify-between items-center -mx-2 -mb-2 p-3 bg-border rounded-md"
    >
      <div class="text-sm text-white font-bold">
        {{ t('currency.hide-zero-balances') }}
      </div>
      <JSwitch
        :classes="{
          Inner: 'gap-x-0!',
          SwitchButton: 'w-9! min-w-9 h-[18px]!',
          SwitchInner: 'w-3.5! h-3.5!',
        }"
        :model-value="hideZeroBalance"
        translate="translate-x-5"
        @update:model-value="toggleZeroSwitch"
      />
    </div>
  </div>
</template>
