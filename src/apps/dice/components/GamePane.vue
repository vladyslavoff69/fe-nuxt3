<script lang="ts" setup>
import { DICE_GAME } from '~/apps/dice/constants'
import GameMain from '~/apps/dice/components/GameMain.vue'
import PlayPane from '~/apps/game/components/in-house/PlayPane.vue'

const { history } = inject(DICE_GAME)!
</script>
<template>
  <PlayPane :history="history">
    <GameMain />
  </PlayPane>
</template>
