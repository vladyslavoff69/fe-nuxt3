<script lang="ts" setup>
import WalletSetting from '~/components/organisms/wallets/WalletSetting.vue'

const { modalVisible } = defineProps<{
  modalVisible: boolean;
}>()

const emits = defineEmits<{
  (e: 'close:settingModal'): void;
}>()

const { t } = useI18n()
const isSettingModalVisible = ref(modalVisible)

const closeSettingsModal = () => {
  isSettingModalVisible.value = false
  emits('close:settingModal')
}
</script>

<template>
  <ClientOnly>
    <UModal
      v-model:open="isSettingModalVisible"
      class="w-11/12 sm:max-w-lg"
      :default-open="isSettingModalVisible"
      :title="t('currency.choose-currency-code')"
      :close="{
      onClick: () => closeSettingsModal()
    }"
    >
      <template #body>
        <WalletSetting />
      </template>
    </UModal>
  </ClientOnly>
</template>
