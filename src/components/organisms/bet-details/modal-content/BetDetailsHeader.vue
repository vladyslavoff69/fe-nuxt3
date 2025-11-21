<script lang="ts" setup>
import { BETS_TICKET_ICON } from '~/components/symbols'

const {
  title = 'BET DETAILS',
  icon = BETS_TICKET_ICON,
  iconType = 'symbol'
} = defineProps<{
  title: string;
  icon?: string;
  iconType?: string;
}>()

const emits = defineEmits(['close:detailsModal'])

const onCloseModal = () => {
  emits('close:detailsModal')
}
</script>

<template>
  <div class="flex justify-between items-center w-full">
    <div class="text-white font-bold text-xl leading-none! flex items-center gap-x-1">
      <svg
        v-if="iconType === 'symbol'"
        class="w-6 h-6 min-w-6 min-h-6"
      >
        <use :href="icon" />
      </svg>
      <UIcon
        v-else
        :name="icon"
        class="w-6 h-6 min-w-6 min-h-6"
      />

      {{ title }}
    </div>

    <UIcon
      class="w-5 h-5 min-w-5 min-h-5 cursor-pointer text-white"
      name="i-heroicons-x-mark-20-solid"
      @click="onCloseModal"
    />
  </div>
</template>
