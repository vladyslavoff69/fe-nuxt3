<script lang="ts" setup>
import RegisterForm from '~/components/organisms/auth/form/RegisterForm.vue'
import AuthFooter from '~/components/organisms/auth/form/AuthFooter.vue'
import { AUTH } from '~/constants'
import { useLocalStorage } from '@vueuse/core'

const { affiliateCode, isLoggedIn } = inject(AUTH)!
const { logout } = useLogout()
const route = useRoute()
const code = computed(() => route.params.code ? String(route.params.code) : '')
const isOpenRegister = computed({
  get() {
    return !!code.value && code.value !== ''
  },
  set(v) {

  }
})
const storageCode = useLocalStorage('JUNGLEBET_AFFILIATE_CODE', affiliateCode.value)

watch(() => code.value, (v) => {
  if (v && v !== '') {
    affiliateCode.value = v
    storageCode.value = v
  }
}, { immediate: true })

watch(() => isLoggedIn.value, (v) => {
  if (v) {
    logout()
  }
}, { immediate: true })
</script>

<template>
  <ClientOnly>
    <UModal
      v-model:open="isOpenRegister"
      class="bg-green-950 w-full"
      :default-open="isOpenRegister"
      :dismissible="false"
      :ui="{
        content: 'md:w-[768px] lg:w-[832px] md:min-h-[636px] lg:min-h-[690px] md:gap-y-4 p-6 sm:px-10 md:py-16 overflow-visible'
      }"
    >
      <template #content>
        <div class="w-full md:grid md:grid-cols-11 h-full md:gap-x-5">
          <div class="md:col-span-5 w-full hidden md:block h-full md:min-h-[580px] lg:min-h-[633px]">
            <div
              class="
                md:w-[45%] lg:w-[43%] h-full absolute top-0 left-0 rounded-tl-[11.4px] rounded-bl-[11.4px]
                bg-no-repeat bg-cover hidden md:flex justify-center pt-10 md:bg-auth-modal
              "
            >
              <JbLogo class="h-10" />
            </div>
          </div>

          <div class="w-full md:col-span-6 md:min-h-[580px] lg:min-h-[633px]">
            <div class="flex flex-col gap-y-3 h-full">
              <div class="flex flex-col gap-y-3 md:gap-y-2.5 h-full">
                <div class="w-full">
                  <RegisterForm :static-affiliate="true" />
                </div>

                <AuthFooter class="mt-auto" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </ClientOnly>
</template>
