<script lang="ts" setup>
import HouseGameLayout from '~/components/organisms/games/HouseGameLayout.vue'
import BetFormContainer from '~/apps/plinko/components/BetFormContainer.vue'
import GamePane from '~/apps/plinko/components/GamePane.vue'
</script>

<template>
  <HouseGameLayout>
    <template #sidebar>
      <BetFormContainer />
    </template>
    <template #default>
      <GamePane />
    </template>
  </HouseGameLayout>
</template>
