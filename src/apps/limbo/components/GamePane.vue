<script lang="ts" setup>
import { LIMBO_GAME } from '~/apps/limbo/constants'
import GameMain from '~/apps/limbo/components/GameMain.vue'
import PlayPane from '~/apps/game/components/in-house/PlayPane.vue'

const { history } = inject(LIMBO_GAME)!
</script>
<template>
  <PlayPane :history="history">
    <GameMain />
  </PlayPane>
</template>
