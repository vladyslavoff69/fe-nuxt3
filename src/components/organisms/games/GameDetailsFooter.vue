<script lang="ts" setup>
import type { Tab } from '~/atoms/types/tabs'
import { GAME } from '~/constants'
import Footerbar from '~/components/organisms/games/Footerbar.vue'
import { TOP_CROWN_ICON, TOP_FIVE_CUP_ICON } from '~/components/symbols'
import BiggestWinsTable from '~/components/organisms/games/BiggestWinsTable.vue'
import { TopFiveResultType } from '~/types/game'
import GameDescription from '~/components/organisms/games/GameDescription.vue'

const { t } = useI18n()
const { game } = inject(GAME)!

const tabs: Tab[] = [
  {
    label: 'Top 5 Wins',
    value: 'BIGGEST_WINS',
    icon: TOP_CROWN_ICON
  },
  {
    label: 'Top 5 Multipliers',
    value: 'HIGHEST_MULTIPLIERS',
    icon: TOP_FIVE_CUP_ICON
  },
  {
    label: t('base.description'),
    value: 'GAME_DESCRIPTION',
    icon: 'heroicons:document-text-solid',
    iconType: 'ui'
  },
]

const feedTabs = ref<Tab[]>(tabs)

const currentTab = ref('BIGGEST_WINS')
</script>

<template>
  <div class="w-full">
    <Footerbar :game="game">
      <div class="flex flex-col gap-y-3 w-full h-full px-3.5">
        <JTabs
          v-model="currentTab"
          :tabs="feedTabs"
          tab-container-class="bg-brand!"
        />

        <BiggestWinsTable
          v-if="currentTab === 'BIGGEST_WINS'"
          :type="TopFiveResultType.biggestwinners"
        />

        <BiggestWinsTable
          v-if="currentTab === 'HIGHEST_MULTIPLIERS'"
          :type="TopFiveResultType.highestpayouts"
        />

        <GameDescription
          v-if="currentTab === 'GAME_DESCRIPTION'"
          :provider="game?.gameProvider?.display_name"
          :slug="game?.slug"
        />
      </div>
    </Footerbar>
  </div>
</template>
