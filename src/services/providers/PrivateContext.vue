<script lang="ts" setup>
import { APP_QUERIES, AUTH, PREFERENCE, WALLET } from '~/constants'
import type { Vault } from '~/types'
import AlertModal from '~/components/organisms/crypto/AlertModal.vue'
import ExchangeModal from '~/components/organisms/crypto/ExchangeModal.vue'

const { isLoggedIn, me } = inject(AUTH)!
const { activeCryptoCode } = inject(PREFERENCE)!
const { userWalletsQueryReturn } = inject(APP_QUERIES)!
const {
  result,
  refetch: refetchWallets,
  loading,
  options
} = userWalletsQueryReturn

const wallets = computed(() => result.value?.userWallets.data || [])
const currentWallet = computed(() => wallets.value.find(w => w.currency_code === activeCryptoCode.value)!)
const fee = ref<number>(0.25)
const selectedAddress = ref<string>('')
const vaults = computed<Vault[]>(() => [])
const route = useRoute()
const router = useRouter()
const isAlertModalVisible = computed(() => route.query.modal === 'crypto-alert')
const isExchangeModalVisible = computed(() => route.query.modal === 'crypto-exchange')

provide(WALLET, {
  loading,
  ready: computed(() => !loading.value && !!result.value),
  currentWallet,
  wallets,
  selectedAddress,
  vaults,
  fee,
  refetchWallets
})

watch(
  () => isLoggedIn.value,
  (v: boolean) => {
    if (v) {
      // @ts-ignore
      options.enabled = true
    }
  },
  { immediate: isLoggedIn.value }
)

const onCloseModal = () => {
  router.push({
    path: router.currentRoute.value.path,
  })
}
</script>
<template>
  <slot />

  <template v-if="!loading && isLoggedIn && !!me">
    <AlertModal
      v-if="isAlertModalVisible"
      :modal-visible="isAlertModalVisible"
      @close:alert-modal="onCloseModal"
    />
    <ExchangeModal
      v-if="isExchangeModalVisible"
      :modal-visible="isExchangeModalVisible"
      @close:exchange-modal="onCloseModal"
    />
  </template>
</template>
