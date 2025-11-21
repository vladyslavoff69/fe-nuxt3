<script setup lang="ts">
import TermsOfServiceBody from '~/components/pages/policies/TermsOfServiceBody.vue'
import AuthFooter from '~/components/organisms/auth/form/AuthFooter.vue'
import { LOGIN } from '~/constants'

const emit = defineEmits<{ close: [boolean] }>()

const { t } = useI18n()
const router = useRouter()
const open = ref(true)
const closeTermsModal = () => {
  emit('close', false)
}

const goToLogin = () => {
  router.push({
    query: {
      type: LOGIN,
      modal: 'auth'
    }
  })

  closeTermsModal()
  open.value = false
}
</script>

<template>
  <ClientOnly>
    <UModal
      v-model:open="open"
      class="w-11/12 md:max-w-(--breakpoint-xl) bg-brand"
      :title="t('auth.terms-and-conditions')"
      :close="{
      onClick: () => closeTermsModal()
    }"
      :default-open="open"
      :dismissible="false"
    >
      <template #body>
        <div class="w-full h-full p-0 m-0 flex flex-col gap-2 md:gap-4">
          <TermsOfServiceBody :show-header="false" />

          <div class="block text-sm text-center text-paragraph">
            {{ t('auth.already_have_account') }}
            <JbBlankButton
              class="font-bold"
              @click="goToLogin"
            >
              {{ t('auth.sign_in') }}
            </JbBlankButton>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex items-center justify-center w-full">
          <AuthFooter />
        </div>
      </template>
    </UModal>
  </ClientOnly>
</template>
