<script lang="ts" setup>
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import { AUTH, CURRENCY, CUSTOM_CRYPTO_ORDER, PREFERENCE, THEME } from '~/constants'
import { SAVE_USER_PREFERENCES_MUTATION } from '~/graphql'
import FiatPopover from '~/components/organisms/wallets/popovers/FiatPopover.vue'
import { DEPOSIT_ICON } from '~/components/symbols'
import VerifyEmail from '~/components/pages/verify-email/index.vue'
import { numberWithCommas } from '~/utils'

const {
  isVault = false,
  contentHeight = 0,
  open = false
} = defineProps<{
  isVault?: boolean;
  contentHeight?: number;
  open?: boolean;
}>()

const emits =
  defineEmits<{
    (e: 'selected:token', code: string): void;
    (e: 'toggle:fiat'): void;
  }>()

const { t } = useI18n()
const { me, isNotVerifiedEmail } = inject(AUTH)!
const { screen } = inject(THEME)!
const {
  activeCryptoCode,
  activeFiatCode,
  displayInfiatEnabled,
  hideZeroBalance,
  changedActiveCode
} = inject(PREFERENCE)!
const { cryptoCurrencies, userBalances, cryptoToFiat, currentFiatCurrency, userBalancesByCode } = inject(CURRENCY)!
const { mutate, onDone } = useMutation(SAVE_USER_PREFERENCES_MUTATION)
const v = {
  get userBalanceCodes() {
    return userBalances.value.map(b => b.currencyCode)
  }
}

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
  })
)

const orderedCryptoItems = computed(() => cryptoItems.value
  .filter(oc => v.userBalanceCodes.includes(oc.code))
  .filter(c => hideZeroBalance.value ? userBalancesByCode.value[c.code]?.availableBalance > 0 : true)
  .sort((a, b) => {
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

const totalValue = computed(() =>
  orderedCryptoItems.value.reduce((sum, item) => sum + (isVault ? item.vaultedFiatBalance : item.fiatBalance), 0)
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

const toggleFiatSwitch = (value: boolean) => {
  mutate({
    ...me.value?.preferences,
    displayInfiatEnabled: value,
  }, {
    optimisticResponse: {
      saveUserPreferences: {
        __typename: me.value?.__typename || 'User',
        id: me.value?.id || 0,
        preferences: {
          ...me.value?.preferences,
          displayInfiatEnabled: value
        }
      }
    }
  })
}

onDone(() => {
  changedActiveCode.value = true
})

const [popoverParent] = useAutoAnimate({
  duration: 150
})

const openWalletModal = () => {
  navigateRoute({
    newQueries: {
      tab: 'deposit',
      currency: activeCryptoCode.value,
      modal: 'wallet',
    }
  })
}

</script>

<template>
  <div
    ref="popoverParent"
    class="w-full h-full p-0 m-0"
  >
    <div
      v-if="open"
      class="flex flex-col gap-y-1.5 w-full lg:w-[250px] relative pt-2 lg:pt-4"
    >
      <div class="flex flex-col gap-y-1.5 relative w-full px-2 lg:px-4">
        <div class="font-semibold text-center w-full text-xs md:text-sm">
          <div class="uppercase">
            {{ t('missing.estimated-balance') }}
          </div>
          <div class="text-white">
            {{ currentFiatCurrency.symbol }}{{ numberWithCommas(totalValue) }}
          </div>
        </div>
        <JButton
          class="flex items-center"
          button-class="text-white"
          variant="primary"
          @click="openWalletModal"
        >
          <svg class="w-4 h-4 min-w-4 min-h-4">
            <use :href="DEPOSIT_ICON" />
          </svg>
          <span class="text-sm">{{ t('currency.deposit') }}</span>
        </JButton>

        <JbScrollbar
          :height="contentHeight ? contentHeight + 'px' : '350px'"
          :scroll-x="false"
          style-type="invisible"
        >
          <div
            v-for="(cryptoItem, c) in orderedCryptoItems"
            :key="`key-${c}-hey-20`"
            class="
              flex items-center justify-between py-2 px-1 sm:px-2.5 rounded-md text-sm
              cursor-pointer hover:bg-border duration-150 leading-none text-white
            "
            @click="onSelect(cryptoItem.code)"
          >
            <div class="flex items-center gap-x-2 cursor-pointer">
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
                img-class="w-4 h-4 min-h-4 min-w-4"
                size="sm"
              />

              <div
                v-if="!displayInfiatEnabled"
                class="flex items-center tracking-[0.02em]"
              >
                {{
                  !isVault
                    ? parseInt(cryptoItem.cryptoBalance.toFixed(8))
                    : parseInt(cryptoItem.vaultedBalance.toFixed(8))
                }}.{{
                  !isVault
                    ? (cryptoItem.cryptoBalance - Math.floor(cryptoItem.cryptoBalance))
                    .toFixed(8)
                    .slice(2)
                    : (cryptoItem.vaultedBalance - Math.floor(cryptoItem.vaultedBalance))
                    .toFixed(8)
                    .slice(2)
                }}
              </div>

              <div
                v-else
                class="flex items-center tracking-[0.02em]"
              >
                {{ currentFiatCurrency.symbol }}{{
                  numberWithCommas(Number(isVault ? cryptoItem.vaultedFiatBalance : cryptoItem.fiatBalance))
                }}
              </div>
            </div>
            <div class="text-paragraph font-semibold text-xs">
              {{ cryptoItem.code }}
            </div>
          </div>
        </JbScrollbar>
      </div>

      <div
        class="flex items-center justify-between relative w-full px-2 lg:px-4"
        :class="{
          'pb-4': !displayInfiatEnabled
        }"
      >
        <JSwitch
          :classes="{
            Inner: 'gap-x-1!',
            SwitchButton: 'w-9! min-w-9 h-[18px]!',
            SwitchInner: 'w-3.5! h-3.5!',
          }"
          :model-value="hideZeroBalance"
          translate="translate-x-5"
          @update:model-value="toggleZeroSwitch"
        >
          <template #SwitchLabel>
            <span class="text-heading text-xs font-semibold leading-none">
              Hide 0
            </span>
          </template>
        </JSwitch>

        <JSwitch
          :classes="{
            Inner: 'gap-x-1!',
            SwitchButton: 'w-9! min-w-9 h-[18px]!',
            SwitchInner: 'w-3.5! h-3.5!',
          }"
          :model-value="displayInfiatEnabled"
          translate="translate-x-5"
          @update:model-value="toggleFiatSwitch"
        >
          <template #SwitchLabel>
            <span class="text-heading text-xs font-semibold leading-none">
              {{ t('currency.display-in-fiat') }}
            </span>
          </template>
        </JSwitch>
      </div>

      <div
        v-if="displayInfiatEnabled"
        class="w-full pb-4 px-2 lg:px-4 flex items-center justify-end"
      >
        <FiatPopover
          :content-height="screen.md ? 300 : 150"
          button-class="pl-1 pr-0.5 py-0.5 border border-border hover:shadow-none rounded-md bg-brand! h-9!"
        />
      </div>

      <div
        v-if="isNotVerifiedEmail"
        class="relative"
      >
        <div class="z-9999 w-full bottom-0 left-0 absolute bg-brand px-2 py-4 backdrop-blur-sm">
          <VerifyEmail :show-social="false" />
        </div>
      </div>
    </div>
  </div>
</template>
