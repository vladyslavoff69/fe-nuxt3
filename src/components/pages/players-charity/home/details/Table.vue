<script lang="ts" setup>
import { HOME_CROWN_ICON, PLAYERS_CHARITY_ICON } from '~/components/symbols'
import CharitiesRankTable from './table/CharitiesTable.vue'
import PlayersRankTable from './table/PlayersTable.vue'
import { AUTH } from '~/constants'

const { t } = useI18n()
const { isLoggedIn } = inject(AUTH)!

const tabs = [
  { label: t('charity.charity-rank'), value: 'CHARITY_RANK', icon: PLAYERS_CHARITY_ICON },
  { label: t('charity.players-rank'), value: 'PLAYERS_RANK', icon: HOME_CROWN_ICON, iconClass: 'relative bottom-px' }
]

const currentTab = ref('CHARITY_RANK')
const countPerPage = ref(10)
</script>

<template>
  <div class="bg-brand grid gap-y-4">
    <div class="w-full flex sm:justify-between gap-x-2">
      <JTabs
        v-model="currentTab"
        :tabs="tabs"
        class="max-w-[calc(100vw-110px)]"
      />

      <div class="w-full sm:max-w-16">
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
          class="mr-2"
        />
      </div>
    </div>

    <CharitiesRankTable
      v-if="currentTab === 'CHARITY_RANK'"
      :count-per-page="countPerPage"
    />
    <PlayersRankTable
      v-else-if="currentTab === 'PLAYERS_RANK'"
      :count-per-page="countPerPage"
    />
  </div>
</template>
