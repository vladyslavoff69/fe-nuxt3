<script lang="ts" setup>
import { INITIAL, PLAYING } from '~/apps/game/constants'
import { LOADING_ICON } from '~/components/symbols'

const props = defineProps<{
  playStatus: string
  invalid: boolean
}>()

const emits = defineEmits(['stop:autoBetManually'])

const { t } = useI18n()
const stopAutoBetManually = () => {
  emits('stop:autoBetManually')
}
</script>

<template>
  <div class="w-full">
    <JButton
      v-if="props.playStatus === INITIAL"
      :disabled="props.invalid"
      button-class="h-11!"
      class="w-full min-w-full"
      size="lg"
      type="submit"
      variant="bet-gradient"
    >
      {{ t('base.start') }} {{ t('games.auto') }} {{ t('games.bet') }}
    </JButton>

    <JButton
      v-else-if="props.playStatus === PLAYING"
      button-class="h-11!"
      class="w-full min-w-full"
      size="lg"
      type="button"
      variant="bet-gradient"
      @click="stopAutoBetManually"
    >
      <div class="flex items-center gap-2 justify-center">
        <svg
          class="animate-spin w-4 h-4 text-border"
        >
          <use :href="LOADING_ICON" />
        </svg>
        <span>{{ t('base.stop') }} {{ t('games.auto') }} {{ t('games.bet') }}</span>
      </div>
    </JButton>

    <JButton
      v-else
      button-class="h-11!"
      class="w-full min-w-full"
      size="lg"
      type="button"
      variant="bet-gradient"
    >
      <div class="flex items-center gap-2 justify-center">
        <svg
          class="animate-spin w-4 h-4 text-border"
        >
          <use :href="LOADING_ICON" />
        </svg>
        <span>{{ t('games.finishing-bet') }}</span>
      </div>
    </JButton>
  </div>
</template>
