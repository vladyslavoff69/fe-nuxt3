<script lang="ts" setup>
import { HOME_CROWN_ICON } from '~/components/symbols'
import BetsTable from '~/components/pages/home/table/BetsTable.vue'
import { HOME_CASINO_CARD_ICON } from '~/components/symbols/casino-home'
import HighRollersTable from '~/components/pages/home/table/HighRollersTable.vue'

const { t } = useI18n()
const tabs = [
  { label: t('games.casino'), value: 'CASINO', icon: HOME_CASINO_CARD_ICON },
  { label: t('games.high-rollers'), value: 'highRollers', icon: HOME_CROWN_ICON, iconClass: 'relative bottom-px' },
]

const currentTab = ref('CASINO')
const countPerPage = ref(10)
</script>

<template>
  <div class="bg-brand grid gap-y-4">
    <div class="w-full flex flex-row justify-between sm:items-center gap-x-2 sm:gap-x-0 gap-y-1">
      <JTabs
        v-model="currentTab"
        :tabs="tabs"
        class="flex-1"
      />
      <div class="sm:max-w-16">
        <JSelect
          v-model="countPerPage"
          :classes="{
            ListboxButton: 'bg-green-950 w-full h-10 py-2 px-2.5 pr-1! font-bold text-paragraph',
            Placeholder: 'text-xs',
            LabelOptLabel: 'text-xs'
          }"
          :has-check-box="false"
          :options="[
            { label: '10', value: 10 },
            { label: '20', value: 20 },
            { label: '50', value: 50 },
          ]"
        />
      </div>
    </div>

    <BetsTable
      v-if="currentTab === 'CASINO'"
      :count-per-page="countPerPage"
    />

    <HighRollersTable
      v-else
      :count-per-page="countPerPage"
    />
  </div>
</template>
