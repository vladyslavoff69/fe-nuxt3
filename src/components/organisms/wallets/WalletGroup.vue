<script lang="ts" setup>
import { AUTH, CURRENCY, PREFERENCE, WALLET } from '~/constants'
import WalletPopover from '~/components/organisms/wallets/WalletPopover.vue'
import { WALLET_TRANSACTION_ICON } from '~/components/symbols'

const { openVerifyModal, isNotVerifiedEmail } = inject(AUTH)!
const { activeCryptoCode } = inject(PREFERENCE)!
const { ready: currencyReady } = inject(CURRENCY)!
const { ready: walletReady } = inject(WALLET)!

const openWalletModal = () => {
  if (isNotVerifiedEmail.value) {
    openVerifyModal()
  } else {
    navigateRoute({
      newQueries: {
        tab: 'deposit',
        currency: activeCryptoCode.value,
        modal: 'wallet',
      }
    })
  }
}
</script>

<template>
  <div
    v-if="walletReady && currencyReady"
    class="flex items-center relative"
  >
    <WalletPopover />

    <JButton
      class="lg:min-h-10! h-9 -ml-1.5 z-10 py-2.5 px-2.5 lg:px-3"
      button-class="text-white"
      size="sm"
      variant="primary"
      @click="openWalletModal"
    >
      <template #startIcon>
        <svg
          class="w-4 h-4 -mt-0.5"
        >
          <use :href="WALLET_TRANSACTION_ICON" />
        </svg>
      </template>
    </JButton>
  </div>

  <div
    v-else
    class="flex items-center justify-center relative w-full max-w-[40%] lg:max-w-full"
  >
    <UIcon
      class="w-10 h-5 min-w-5 min-h-5 text-paragraph"
      name="svg-spinners:bars-scale-fade"
    />
  </div>
</template>
