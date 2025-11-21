<script lang="ts" setup>
import WalletContent from '~/components/organisms/wallets/contents/WalletContent.vue'

const { modalVisible, modalType } = defineProps<{
  modalVisible: boolean;
  modalType?: string;
  tab?: string;
}>()

const emits = defineEmits<{
  (e: 'close:walletModal'): void;
}>()

const closeWalletModal = () => {
  isSettingModalVisible.value = false
  emits('close:walletModal')
}

const isSettingModalVisible = computed({
  get: () => modalVisible && modalType === 'wallet',
  set: () => {
    // closeWalletModal()
  }
})
</script>

<template>
  <ClientOnly>
    <UModal
      v-model:open="isSettingModalVisible"
      class="w-11/12 sm:max-w-[768px] sm:w-[768px] bg-brand"
      :default-open="isSettingModalVisible"
      @update:open="(v) => {
        if (!v) {
          closeWalletModal()
        }
      }"
    >
      <template #content>
        <WalletContent
          @close:wallet-modal="closeWalletModal"
        />
      </template>
    </UModal>
  </ClientOnly>
</template>
