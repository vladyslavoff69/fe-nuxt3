<script lang="ts" setup>
import type { DiceGameMatch } from '~/apps/game/types'
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import DiceIcon from '~/components/molecules/game/DiceIcon.vue'
import { THEME } from '~/constants'

const props = defineProps<{
  result: DiceGameMatch;
  instantMode: boolean
}>()

const gameMatch = computed<DiceGameMatch>(() => props.result)
const { screen } = inject(THEME)!
const { play: playWinSound } = useAudio('/assets/audio/game/win.mp3', 100)
const { play: playMovSound, onEnd } = useAudio('/assets/audio/game/tick.mp3')

const v = {
  get hasResult () {
    return !!props.result
  }
}

watch(
  () => gameMatch.value,
  () => {
    if (v.hasResult) {
      playMovSound()
    }
  }
)

onEnd(() => {
  if (gameMatch.value?.status === 'won') {
    playWinSound()
  }
})

const instantMode = computed(() => props.instantMode)

const [diceParent] = useAutoAnimate({
  duration: !instantMode.value ? 100 : 0,
})
</script>

<template>
  <div
    ref="diceParent"
    class="random-dice relative w-full h-16 lg:h-20"
  >
    <div
      :class="{
        'transition-all ease-in-out': !instantMode
      }"
      :style="{
        left: `calc(${gameMatch.result}% - ${screen.md ? '56px' : '48px'})`,
      }"
      class="absolute bottom-0 h-full flex flex-col justify-center items-center gap-y-2 lg:gap-y-3 w-20 lg:w-28"
    >
      <div class="w-20 lg:w-28 relative flex items-center justify-center">
        <DiceIcon />

        <NuxtImg
          v-if="gameMatch.status === 'won'"
          alt="Ray"
          class="absolute w-20 h-20 lg:w-28 lg:h-28 z-1"
          loading="lazy"
          src="/assets/img/games/casino/Rays-animated.svg"
        />
      </div>

      <p
        :class="{
          'text-primary': gameMatch.status === 'won' || gameMatch.transactionId === '0',
          'text-red-600': !(gameMatch.status === 'won' || gameMatch.transactionId === '0'),
        }"
        class="
          flex items-baseline shadow-dark-box py-1 w-16 lg:w-20 bg-green-950 rounded-md
          justify-center flex-row item-center text-sm lg:text-base font-bold
        "
      >
        {{ gameMatch.result }}
      </p>
    </div>
  </div>
</template>
