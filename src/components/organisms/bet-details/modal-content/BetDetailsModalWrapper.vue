<script lang="ts" setup>
import { BET_DETAIL } from '~/constants'
import HouseGameBetDetails from '~/components/organisms/bet-details/modal-types/HouseGameBetDetails.vue'
import CasinoBetDetails from '~/components/organisms/bet-details/modal-types/CasinoBetDetails.vue'

const { modalType } = inject(BET_DETAIL)!
</script>

<template>
  <div
    v-if="modalType"
    class="bet-details-modal-wrapper w-full"
  >
    <HouseGameBetDetails v-if="modalType === 'inhouse'" />
    <CasinoBetDetails v-else-if="modalType === 'casino'" />
  </div>
</template>
