<script lang="ts" setup>
import { KENO_GAME } from '~/apps/keno/constants'
import GameMain from '~/apps/keno/components/GameMain.vue'
import PlayPane from '~/apps/game/components/in-house/PlayPane.vue'

const { history } = inject(KENO_GAME)!
</script>
<template>
  <PlayPane :history="history">
    <GameMain />
  </PlayPane>
</template>
