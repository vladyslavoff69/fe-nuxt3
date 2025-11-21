<script lang="ts" setup>
import { BET_DETAIL } from '~/constants'
import type { Bet, Game, GameProvider } from '~/types'
import BetDetailsBanner from '~/components/organisms/bet-details/modal-content/BetDetailsBanner.vue'
import BetDetailsSummary from '~/components/organisms/bet-details/modal-content/BetDetailsSummary.vue'

const { t } = useI18n()
const { betDetail } = inject(BET_DETAIL)!
const localePath = useLocalePath()
const betGame = computed<Game>(() => betDetail.value.game)
const betData = computed<Bet>(() => betDetail.value.bet)
const betGameProvider = computed<GameProvider>(() => betDetail.value.provider)

const openPlayGame = () => {
  navigateTo(localePath(`/casino/games/${betGameProvider.value.slug}/${betGame.value.slug}`))
}
</script>

<template>
  <div class="w-full flex flex-col gap-y-3 lg:gap-y-4">
    <BetDetailsBanner />

    <BetDetailsSummary
      v-if="betData"
      :bet-data="betData"
    />

    <div class="w-full flex flex-col gap-y-3 lg:gap-y-4 text-sm">
      <div
        v-if="betGame?.image"
        class="flex flex-col gap-y-2 w-full h-full items-center justify-center"
      >
        <NuxtImg
          :src="betGame.image"
          class="w-28 h-36 rounded-md"
          loading="lazy"
          alt="Junglebet.com"
        />

        <UBadge
          class="w-28 py-1 text-center flex justify-center uppercase leading-normal text-xxs sm:text-xs"
          color="primary"
          size="md"
          variant="solid"
        >
          <span class="text-white">{{ t('games.edge') }}: {{ betGame.house_edge }}%</span>
        </UBadge>
      </div>

      <JButton
        class="min-w-24 h-10 w-full block"
        @click="openPlayGame"
      >
        {{ t('games.play') }} {{ betGame.title }}
      </JButton>
    </div>
  </div>
</template>
