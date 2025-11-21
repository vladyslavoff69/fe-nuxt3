<script lang="ts" setup>
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import DepositsData from '~/components/pages/transactions/contents/histories/DepositsData.vue'
import WithdrawalsData from '~/components/pages/transactions/contents/histories/WithdrawalsData.vue'
import { DEPOSIT_ICON, SEND_TIP_ICON, WALLET_TRANSACTION_ICON, WITHDRAWAL_ICON } from '~/components/symbols'
import TipData from '~/components/pages/transactions/contents/histories/TipData.vue'
import OthersData from '~/components/pages/transactions/contents/histories/OthersData.vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const tabs = [
  { label: t('currency.deposit'), value: 'deposit', icon: DEPOSIT_ICON },
  { label: t('currency.withdrawals'), value: 'withdrawals', icon: WITHDRAWAL_ICON },
  { label: t('transaction.tip'), value: 'tip', icon: SEND_TIP_ICON },
  { label: t('account.other'), value: 'other', icon: WALLET_TRANSACTION_ICON },
]

const selectedTab = computed({
  get () {
    return route.query.transaction ? String(route.query.transaction) : 'deposit'
  },
  set (v) {
    router.push({ path: router.currentRoute.value.path, query: { ...route.query, transaction: v } })
  }
})

const countPerPage = ref(10)

const [tabParent] = useAutoAnimate({
  duration: 150
})
</script>

<template>
  <div
    class="h-full w-full lg:min-h-[560px] pb-16 lg:pb-0"
  >
    <div
      ref="tabParent"
      class="w-full flex flex-col gap-y-3"
    >
      <slot name="header" />
      <div class="flex justify-between items-center w-full flex-wrap sm:flex-nowrap gap-2">
        <JTabs
          v-model="selectedTab"
          :tabs="tabs"
          class="w-full"
          width="100%"
        />

        <div class="w-full flex items-center justify-end">
          <div class="max-w-[100px]">
            <JSelect
              v-model="countPerPage"
              :classes="{
                ListboxButton: 'bg-green-950 w-full h-[40px] py-2 px-2.5 pr-1! font-bold text-paragraph',
                Placeholder: 'text-xs',
                LabelOptLabel: 'text-xs'
              }"
              :has-check-box="false"
              :options="[
                { label: '10', value: 10 },
                { label: '20', value: 20 },
                { label: '50', value: 50 },
                { label: '100', value: 100 },
              ]"
              class="mr-2"
            />
          </div>
        </div>
      </div>
      <WithdrawalsData
        v-if="selectedTab === 'withdrawals'"
        :count-per-page="countPerPage"
      />
      <TipData
        v-else-if="selectedTab === 'tip'"
        :count-per-page="countPerPage"
      />
      <OthersData
        v-else-if="selectedTab === 'other'"
        :count-per-page="countPerPage"
      />
      <DepositsData
        v-else
        :count-per-page="countPerPage"
      />
    </div>
  </div>
</template>
