<script lang="ts" setup>
import { CASINO_GAME, META } from '~/constants'
import { GAMES_QUERY } from '~/graphql'
import type { Game } from '~/types'

const inGamePage = ref(false)
const searchVisible = ref(false)

const { result, loading } = useQuery(GAMES_QUERY, {
  type: 'in_house',
  first: 100,
  orderBy: [{ column: 'TITLE', order: 'ASC' }]
})
const houseGames = computed<Game[]>(() => result.value?.games.data || [])

provide(
  META,
  {
    inGamePage,
    searchVisible,
  }
)

provide(CASINO_GAME, {
  houseGames,
  loading,
  ready: computed(() => !!result.value),
})
</script>
<template>
  <slot />
</template>
