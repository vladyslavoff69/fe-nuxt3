<script lang="ts" setup>
import { LIMBO_RESULT_QUERY } from '~/apps/game/graphql'
import type { ID } from '~/types'
import type { LimboGameMatch } from '~/apps/game/types'
import StaticSkeleton from '~/apps/game/components/in-house/StaticSkeleton.vue'

const props = defineProps<{
  id: ID
  name: string
}>()

const { t } = useI18n()
const { data } = useAsyncQuery<{ limboResult: LimboGameMatch }>(LIMBO_RESULT_QUERY, { id: props.id })
const v = {
  get gameMatch () {
    return data.value?.limboResult
  },
}

const localePath = useLocalePath()
const openLimboGame = () => {
  navigateTo(localePath('/casino/games/junglebet/limbo'))
}
</script>

<template>
  <div class="w-full flex flex-col gap-y-3 lg:gap-y-4 text-sm">
    <div class="flex items-center justify-center w-full">
      <StaticSkeleton v-if="!data" />
      <div
        v-else
        class="flex items-center justify-center w-2/3 lg:w-1/2"
      >
        <div class="w-1/2 flex items-center justify-center flex-col">
          <span class="font-bold">{{ t('games.target') }}</span>
          <span class="text-white font-semibold">{{ v.gameMatch?.target.toFixed(4) }}×</span>
        </div>
        <div class="w-1/2 flex items-center justify-center flex-col">
          <span class="font-bold">{{ t('games.result') }}</span>
          <div
            :class="{
              'text-border': v.gameMatch?.payoutMultiplier === 0,
              'text-primary': (v.gameMatch?.payoutMultiplier || 0) > 0
            }"
            class="font-semibold"
          >
            {{ v.gameMatch?.result.toFixed(4) }}×
          </div>
        </div>
      </div>
    </div>
    <JButton
      class="min-w-24 h-10 w-full block"
      @click="openLimboGame"
    >
      {{ t('games.play') }} {{ props.name }}
    </JButton>
  </div>
</template>
