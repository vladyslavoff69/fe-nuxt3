<script lang="ts" setup>
import DailySpinContent from '~/apps/vip-program/components/dashboard/reload/DailySpinContent.vue'

const { hideHead = false } = defineProps<{
  hideHead?: boolean;
}>()

const emits = defineEmits<{
  (e: 'close:modal', value: boolean): void;
}>()

const onCloseModal = () => {
  emits('close:modal', true)
}
</script>
<template>
  <div class="bg-green-950 p-4 rounded-md flex flex-col gap-y-2 sm:gap-y-4">
    <div
      v-if="!hideHead"
      class="text-lg text-white font-bold"
    >
      Daily Free Spin
    </div>
    <div class="CashbackLoader flex-1 w-full">
      <DailySpinContent
        :hide-head="hideHead"
        @close:modal="onCloseModal"
      />
    </div>
  </div>
</template>
