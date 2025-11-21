<script lang="ts" setup>
import CloseButton from '~/components/molecules/button/CloseButton.vue'
import { BETS_TICKET_ICON } from '~/components/symbols'

const {
  title = 'BET DETAILS',
  icon = BETS_TICKET_ICON,
  iconType = 'symbol',
} = defineProps<{
  title?: string;
  icon?: string;
  iconType?: string;
}>()

const emits = defineEmits(['close:detailsModal', 'click:icon'])

const onCloseModal = () => {
  emits('close:detailsModal')
}

const onClickIcon = () => {
  emits('click:icon')
}
</script>

<template>
  <div class="flex justify-between items-center w-full">
    <div class="text-white font-bold text-xl leading-none! flex items-center gap-x-1 capitalize">
      <svg
        v-if="iconType === 'symbol'"
        class="w-6 h-6 min-w-6 min-h-6 cursor-pointer"
        @click="onClickIcon"
      >
        <use :href="icon" />
      </svg>
      <UIcon
        v-else
        :name="icon"
        class="w-6 h-6 min-w-6 min-h-6 cursor-pointer"
        @click="onClickIcon"
      />

      {{ title }}
    </div>

    <CloseButton
      class="w-3 h-3 min-w-3 min-h-3"
      @click="onCloseModal"
    />
  </div>
</template>
