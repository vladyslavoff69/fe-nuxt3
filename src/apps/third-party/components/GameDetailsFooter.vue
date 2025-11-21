<script lang="ts" setup>
import type { Tab } from '~/atoms/types/tabs'
import { TopFiveResultType } from '~/types/game'
import { TOP_CROWN_ICON, TOP_FIVE_CUP_ICON } from '~/components/symbols'
import FooterBar from '~/apps/third-party/components/Footerbar.vue'
import GameDescription from '~/apps/third-party/components/GameDescription.vue'
import BiggestWinsTable from '~/components/organisms/games/BiggestWinsTable.vue'

const { t } = useI18n()
const feedTabs = ref<Tab[]>([
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
])

const currentTab = ref('BIGGEST_WINS')
</script>

<template>
  <div class="w-full">
    <FooterBar>
      <div class="flex flex-col gap-y-3 w-full h-full px-3.5">
        <JTabs
          v-model="currentTab"
          :tabs="feedTabs"
          tab-container-class="bg-brand!"
        />

        <ClientOnly>
          <BiggestWinsTable
            v-if="currentTab === 'BIGGEST_WINS'"
            :type="TopFiveResultType.biggestwinners"
          />
        </ClientOnly>

        <ClientOnly>
          <BiggestWinsTable
            v-if="currentTab === 'HIGHEST_MULTIPLIERS'"
            :type="TopFiveResultType.highestpayouts"
          />
        </ClientOnly>

        <GameDescription
          v-if="currentTab === 'GAME_DESCRIPTION'"
        />
      </div>
    </FooterBar>
  </div>
</template>
