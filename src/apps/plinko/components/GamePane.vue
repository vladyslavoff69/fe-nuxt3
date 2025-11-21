<script lang="ts" setup>
import { PLINKO_GAME } from '~/apps/plinko/constants'
import GameMain from '~/apps/plinko/components/GameMain.vue'
import PlayPane from '~/apps/game/components/in-house/PlayPane.vue'

const { history } = inject(PLINKO_GAME)!
</script>
<template>
  <PlayPane :history="history">
    <GameMain />
  </PlayPane>
</template>
