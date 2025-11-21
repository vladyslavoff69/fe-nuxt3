<script lang="ts" setup>
import { GAME_MATH_ICONS, THEME } from '~/constants'
import { JUNGLEBET_ORIGINALS_ICON } from '~/components/symbols'
import type { GameTransaction } from '~/types'

const { slug = '', game = '', bet } = defineProps<{
  slug?: string;
  game?: string;
  bet: GameTransaction;
}>()

const mapIconClasses: any = {
  upcoming: 'w-3 h-3',
  myBets: 'w-[7.25px] h-3'
}

const { screen } = inject(THEME)!
const { openBetDetails } = useOpenBetDetailsModal()
</script>

<template>
  <JbBlankButton
    class="flex items-center gap-x-1.5 sm:gap-x-2 p-0 w-full font-semibold"
    @click="openBetDetails(bet)"
  >
    <svg
      v-if="GAME_MATH_ICONS[slug]?.type === 'symbol'"
      class="w-4 h-4 min-w-4 min-h-4"
      :class="[
        mapIconClasses[slug] || ''
      ]"
    >
      <use :href="GAME_MATH_ICONS[slug]?.icon" />
    </svg>
    <UIcon
      v-else-if="GAME_MATH_ICONS[slug]?.type === 'ui'"
      class="w-4 h-4 min-w-4 min-h-4"
      :class="[
        mapIconClasses[slug] || ''
      ]"
      :name="GAME_MATH_ICONS[slug].icon"
    />
    <svg
      v-else
      class="w-4 h-4 min-w-4 min-h-4"
    >
      <use :href="JUNGLEBET_ORIGINALS_ICON" />
    </svg>
    <span class="leading-none! xs:w-auto truncate">
      {{ game }}
    </span>
    <UIcon
      v-if="!screen.md"
      class="w-3 h-3 min-h-3 min-w-3 cursor-pointer"
      name="charm:link-external"
    />
  </JbBlankButton>
</template>
