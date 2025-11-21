<script lang="ts" setup>
import VaultDepositForm from '~/components/organisms/wallets/contents/VaultDepositForm.vue'
import VaultWithdrawForm from '~/components/organisms/wallets/contents/VaultWithdrawForm.vue'

const { t } = useI18n()
const tabs = [
  { label: t('currency.deposit'), value: 'deposit' },
  { label: t('currency.withdraw'), value: 'withdraw' },
]
const currentTab = ref('deposit')
</script>

<template>
  <div class="flex flex-col justify-between h-full leading-none text-sm gap-y-1">
    <div class="w-full grid grid-cols-3 gap-x-3 gap-y-4 lg:gap-y-5 text-white">
      <div class="col-span-3 h-full bg-brand">
        <UTabs
          v-model="currentTab"
          :items="tabs"
          orientation="horizontal"
          size="xl"
          class="w-full"
          :ui="{
            trigger: 'w-full min-w-40 h-10',
            list: 'bg-green-950'
          }"
        >
          <template #default="{ item }">
            <div class="flex items-center gap-x-2 relative cursor-pointer">
              {{ item.label }}
            </div>
          </template>
        </UTabs>
      </div>

      <VaultDepositForm v-if="currentTab === 'deposit'" />
      <VaultWithdrawForm v-else />
    </div>
  </div>
</template>
