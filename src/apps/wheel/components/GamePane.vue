<script lang="ts" setup>
import { WHEEL_GAME } from '~/apps/wheel/constants'
import GameMain from '~/apps/wheel/components/GameMain.vue'
import PlayPane from '~/apps/game/components/in-house/PlayPane.vue'

const { history } = inject(WHEEL_GAME)!
</script>
<template>
  <PlayPane :history="history">
    <GameMain />
  </PlayPane>
</template>
