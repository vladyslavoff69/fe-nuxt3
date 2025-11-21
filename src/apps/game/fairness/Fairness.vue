<script lang="ts" setup>
import { FAIRNESS } from '~/apps/game/fairness/constants'
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import Seeds from '~/apps/game/fairness/Seeds.vue'
import Verify from '~/apps/game/fairness/Verify.vue'
import type { RiskShort, Row, Segment } from '~/apps/game/types'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const tabs = computed(() => [
  {
    label: 'Seed Manager',
    value: 'seeds',
  },
  {
    label: t('bets.verify'),
    value: 'verify',
  },
])

const currentTab = computed({
  get() {
    const index = tabs.value?.findIndex((item: any) => item.value === String(route.query.tab))
    if (index === -1) {
      return 'seeds'
    }

    return String(route.query.tab)
  },
  set(value) {
    router.push({
      path: router.currentRoute.value.path,
      query: {
        ...route.query,
        tab: value,
      },
    })
  },
})

const gameSlug = computed<string>({
  get() {
    return route.query.game ? String(route.query.game) : ''
  },
  set(v) {
    router.push({
      path: router.currentRoute.value.path,
      query: {
        ...route.query,
        game: v,
      },
    })
  },
})

const clientSeed = ref(route.query.client_seed ? String(route.query.client_seed) : '')
const serverSeed = ref(route.query.server_seed ? String(route.query.server_seed) : '')
const nonce = ref(route.query.nonce ? Number(route.query.nonce) : 1)

const mines = {
  minesCount: ref(route.query.mines ? Number(route.query.mines) : 1),
  minesOptions: [...Array(24).keys()].map((i: number) => ({
    label: (i + 1).toString(),
    value: i + 1,
  })),
}

const dragonTower = {
  dragonTowerDifficulty: ref(route.query.risk ? String(route.query.risk) : 'medium'),
  dragonTowerDifficultyOptions: [
    {
      label: 'Easy',
      value: 'easy',
    },
    {
      label: 'Medium',
      value: 'medium',
    },
    {
      label: 'Hard',
      value: 'hard',
    },
    {
      label: 'Expert',
      value: 'expert',
    },
    {
      label: 'Master',
      value: 'master',
    },
  ],
}

type PlinkoBooster = 'default' | 'left' | 'right'

const plinko = {
  maxBooster: ref<PlinkoBooster>(route.query.maxBooster ? (String(route.query.maxBooster) as PlinkoBooster) : 'default'),
  selectedRisk: ref<RiskShort>(route.query.risk ? (String(route.query.risk) as RiskShort) : 'low'),
  selectedRows: ref<Row>(route.query.rows ? (Number(route.query.rows) as Row) : 16),
}

const wheel = {
  wheelRisk: ref<RiskShort>(route.query.risk ? (String(route.query.risk) as RiskShort) : 'low'),
  selectedSegment: ref<Segment>(route.query.segment ? (Number(route.query.segment) as Segment) : 0),
}

provide(FAIRNESS, {
  gameSlug,
  serverSeed,
  clientSeed,
  nonce,
  mines,
  dragonTower,
  plinko,
  wheel,
})

const [tabParent] = useAutoAnimate({
  duration: 100,
})

const moveToFairnessPage = () => {
  window.open('https://junglebet.crisp.help/en/article/provably-fair-gaming-at-junglebet-how-to-verify-game-fairness-1bpc5ev/', '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <UTabs
      v-model="currentTab"
      :items="tabs"
      size="xl"
      :ui="{
        list: 'bg-green-950'
      }"
    >
      <template #default="{ item }">
        <span
          :class="{
            'text-white': item.value === currentTab
          }"
          class="text-center w-full z-1"
        >
          {{ item?.label || '' }}
        </span>
      </template>
    </UTabs>

    <div
      ref="tabParent"
      class="w-full"
    >
      <Seeds v-if="currentTab === 'seeds'" />
      <Verify v-else />
      <div class="mt-4 md:mt-6 flex items-center justify-center w-full pb-2">
        <span
          class="font-bold hover:text-white cursor-pointer duration-150 text-sm leading-none"
          @click="moveToFairnessPage"
        >
          {{ t('bets.how-are-result-generated') }}
        </span>
      </div>
    </div>
  </div>
</template>
