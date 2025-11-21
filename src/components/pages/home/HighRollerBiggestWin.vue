<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import { JUNGLEBET_ORIGINALS_ICON, ON_AIR_ICON, } from '~/components/symbols'
import { GAME_SEARCH_QUERY, GET_WAGERED_BY_GAMES_AND_PERIOD } from '~/graphql'
import SkeletonWageredGame from '~/components/molecules/skeletons/SkeletonWageredGame.vue'
import { GAME_MATH_ICONS } from '~/constants'
import { CASINO_SUB_PAGE_GAMES_LIMIT } from '~/apps/casino/constants'
import { numberWithCommas } from '~/utils'

const { t } = useI18n()
const runtimeConfig = useRuntimeConfig()
const casinoOriginal = runtimeConfig.public?.casinoOriginal

const gameParams = computed(() => ({
  categorySlug: casinoOriginal,
  first: CASINO_SUB_PAGE_GAMES_LIMIT,
  page: 1,
}))
const { result: gamesResult, loading: gamesLoading, load: loadGames } = useLazyQuery(GAME_SEARCH_QUERY, gameParams)

const last24HoursDate = computed(() => {
  const last24Hours = new Date().getTime() - 24 * 60 * 60 * 1000
  return useDateFormat(last24Hours, 'YYYY-M-D').value
})
const currentDate = computed(() => {
  return useDateFormat(new Date(), 'YYYY-M-D').value
})
const gameIds = computed(() => gamesResult.value?.gameSearch?.data?.map(item => item.id).join(','))
const params = computed(() => ({
  gameIds: gameIds.value,
  start: last24HoursDate.value,
  end: currentDate.value,
}))
const { result, loading, load } = useLazyQuery(GET_WAGERED_BY_GAMES_AND_PERIOD, params)
onMounted(async () => {
  loadGames()
})

watch(
  () => gamesResult.value?.gameSearch?.data,
  () => {
    load()
  }
)

const wageredGames = computed(() => {
  return result.value?.getWageredByGamesAndPeriod || []
})
const totalAmount = computed(() => {
  return wageredGames.value?.reduce((total, item) => total + item.amount, 0)
})

const biggestWin = computed(() => {
  const _games = result.value?.getWageredByGamesAndPeriod || []
  return _games.reduce((max, record) => {
    return record.amount > max.amount ? record : max
  }, _games[0])
})
</script>

<template>
  <div class="flex items-center">
    <JbBlankButton
      class="flex bg-warn-gradient items-center text-black py-2.5 px-2 rounded-lg gap-x-1"
    >
      <svg
        class="w-5 h-5 min-w-5 min-h-5"
      >
        <use :href="ON_AIR_ICON" />
      </svg>
      <h5 class="text-md text-black leading-none font-bold text-xs uppercase">
        {{ t("home.last") }}<br> 24 Hrs
      </h5>
    </JbBlankButton>
    <div class="flex-1 overflow-hidden relative px-1">
      <div
        v-if="gamesLoading || loading"
        class="flex items-center"
      >
        <SkeletonWageredGame />
      </div>
      <div
        v-else-if="biggestWin"
        class="flex items-center"
      >
        <div
          class="px-3"
        >
          <h5 class="text-lg sm:text-xl text-white font-bold">
            ${{ biggestWin.amount ? numberWithCommas(biggestWin.amount, 2) : 0 }}
          </h5>
          <div class="flex items-center gap-x-0.5">
            <template v-if="GAME_MATH_ICONS[biggestWin.game.slug]?.type === 'ui'">
              <UIcon
                :name="GAME_MATH_ICONS[biggestWin.game.slug]?.icon || ''"
                class="w-2 h-2 min-w-2 min-h-2"
              />
            </template>
            <template v-else-if="GAME_MATH_ICONS[biggestWin.game.slug]?.icon">
              <svg
                v-if="GAME_MATH_ICONS[biggestWin.game.slug]?.icon"
                class="w-2 h-2 min-w-2 min-h-2"
              >
                <use :href="GAME_MATH_ICONS[biggestWin.game.slug]?.icon" />
              </svg>
            </template>
            <template v-else>
              <svg
                class="w-2 h-2 min-w-2 min-h-2"
              >
                <use :href="JUNGLEBET_ORIGINALS_ICON" />
              </svg>
            </template>
            <span class="font-bold text-xxs text-nowrap leading-1">{{ biggestWin?.game?.title }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
