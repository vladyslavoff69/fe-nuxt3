<script lang="ts" setup>
import { FREE_SPIN_ICON } from '~/icons'
import CloseButton from '~/components/molecules/button/CloseButton.vue'

const props = defineProps<{ modalVisible: boolean }>()
const emits = defineEmits<{ (e: 'close:modal'): void }>()

const isModalVisible = ref(props.modalVisible)

const onCloseModal = async () => {
  emits('close:modal')
  isModalVisible.value = false
}
</script>

<template>
  <ClientOnly>
    <UModal
      v-model:open="isModalVisible"
      class="w-11/12 md:w-[450px] bg-green-950 p-6! overflow-visible"
      :dismissible="false"
      :default-open="isModalVisible"
      @update:open="(v) => {
      if (!v) {
        isModalVisible = false
      }
    }"
    >
      <template #content>
        <div class="flex justify-between items-center w-full">
          <div class="text-white font-bold text-xl leading-none! flex items-center gap-x-1.5">
            <svg class="w-6 h-6 min-w-6 min-h-6 text-white">
              <use :href="FREE_SPIN_ICON" />
            </svg>
            <span>Fairness Verify</span>
          </div>
          <CloseButton
            class="w-4 h-4 min-w-4 min-h-4"
            @click="onCloseModal"
          />
        </div>
        <div class="flex flex-col justify-center gap-4 w-full items-center md:items-start font-bold p-0 md:p-4">
          Verify
        </div>
      </template>
    </UModal>
  </ClientOnly>
</template>
