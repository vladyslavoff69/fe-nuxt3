<script lang="ts" setup>
import CloseButton from '~/components/molecules/button/CloseButton.vue'

const { modalVisible } = defineProps<{
  modalVisible: boolean;
}>()

const emits = defineEmits<{
  (e: 'close:registerModal'): void;
}>()

const isRegisterKeyModalVisible = ref(modalVisible)
const deviceName = ref()
const { registerKey, loading } = usePasskeyRegister()
const { t } = useI18n()

const closeRegisterKeyModal = () => {
  isRegisterKeyModalVisible.value = false
  emits('close:registerModal')
}

const submitKey = async () => {
  const re = await registerKey(deviceName.value)

  if (re) {
    useGeneralNotify({
      type: 'success',
      title: t('notifications.success'),
      description: t('account.registered-success')
    })

    closeRegisterKeyModal()
  } else {
    useGeneralNotify({
      type: 'error',
      title: t('notifications.error'),
      description: t('errors.SOMETHING_WENT_WRONG')
    })
  }
}
</script>

<template>
  <ClientOnly>
    <UModal
      v-model:open="isRegisterKeyModalVisible"
      class="w-11/12 sm:max-w-sm p-2 sm:p-4"
      :default-open="isRegisterKeyModalVisible"
      @update:open="(v) => {
      if (!v) {
        closeRegisterKeyModal()
      }
    }"
    >
      <template #content>
        <div class="flex flex-col w-full gap-3 md:gap-4">
          <div class="flex justify-between items-center w-full">
            <div class="text-white font-bold text-xl leading-none!">
              {{ t('account.register-key') }}
            </div>
            <CloseButton
              class="w-3 h-3 min-w-3 min-h-3"
              @click="closeRegisterKeyModal"
            />
          </div>
          <hr class="h-px w-full border border-border -mt-1 lg:-mt-2">
          <UInput
            v-model="deviceName"
            class="flex-1"
            color="neutral"
            placeholder="Device Name(Optional)"
            size="lg"
            type="text"
          />
          <JButton
            :loading="loading"
            class="h-10 py-1"
            @click="submitKey"
          >
            {{ t('base.submit') }}
          </JButton>
        </div>
      </template>
    </UModal>
  </ClientOnly>
</template>
