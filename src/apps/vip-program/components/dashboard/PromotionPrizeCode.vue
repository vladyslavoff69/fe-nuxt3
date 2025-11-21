<script lang="ts" setup>
import { useMutation } from '@vue/apollo-composable'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { APPLY_PROMO_CODE_MUTATION } from '~/graphql/promo'
import PromotionCodeHelpModal from '~/apps/vip-program/components/dashboard/PromotionCodeHelpModal.vue'

const { t } = useI18n()
const isHelpModalVisible = ref<boolean>(false)
const {
  mutate: applyCodeMutate,
  onDone,
  onError,
  loading,
} = useMutation(APPLY_PROMO_CODE_MUTATION)

const form = reactive({ redeemCode: '' })
const rules = { redeemCode: { required } }
const v$ = useVuelidate(rules, form)

const applyPromo = async () => {
  if (!(await v$.value.$validate()) || loading.value) {
    return
  }

  await applyCodeMutate({
    code: form.redeemCode,
  })
}

onDone(({ data }) => {
  useGeneralNotify({
    type: 'success',
    title: t('vip.promo-claimed'),
    description: t('vip.promo-claimed-txt', { code: data?.applyPromoCode?.code }),
  })
})

onError(() => {
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: t('vip.promo-failed'),
  })
})

const openHelpModal = () => {
  isHelpModalVisible.value = true
}
const onCloseModal = () => {
  isHelpModalVisible.value = false
}
</script>

<template>
  <div class="bg-green-950 p-4 rounded-md z-10">
    <div class="flex flex-col gap-2.5 h-full">
      <div
        class="flex items-center group cursor-pointer gap-2"
        @click="openHelpModal"
      >
        <UIcon
          class="w-4 h-4 min-w-4 min-h-4 text-paragraph cursor-help hover:text-white"
          name="material-symbols:help-outline"
        />
        <p class="text-sm md:text-base group-active:scale-95 font-bold">
          {{ t('vip.promo-code') }}
        </p>
      </div>
      <p class="text-xs md:text-sm text-paragraph">
        {{ t('vip.promo-code-txt') }}
      </p>
      <form
        class="mt-auto"
        @submit.prevent="applyPromo"
      >
        <UInput
          v-model="form.redeemCode"
          class="w-full relative text-sm! h-10"
          color="neutral"
          placeholder="Input promotion code"
        >
          <template #trailing>
            <JButton
              :disabled="loading"
              class="rounded-l-none! -mr-2.5 text-white"
              type="submit"
            >
              {{ t('vip.redeem') }}
            </JButton>
          </template>
        </UInput>
        <JbInputMessage v-if="v$.redeemCode.$error">
          {{ t('vip.promo-required') }}
        </JbInputMessage>
      </form>
    </div>
    <ClientOnly>
      <UModal
        v-model:open="isHelpModalVisible"
        class="w-11/12 sm:w-[400px] bg-brand p-2 sm:p-4"
        :default-open="isHelpModalVisible"
        @update:open="(v) => {
        if (!v) {
          onCloseModal()
        }
      }"
      >
        <template #content>
          <PromotionCodeHelpModal @close:modal="onCloseModal" />
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>
