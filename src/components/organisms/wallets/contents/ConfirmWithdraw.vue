<script lang="ts" setup>
import { maxLength, minLength, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import VerificationCode from '~/components/molecules/inputs/VerificationCode.vue'
import { AUTH, THEME } from '~/constants'

const props = defineProps({
  loading: Boolean,
  enable2fa: Boolean
})

const emit = defineEmits<{
  (e: 'close:modal'): void;
  (e: 'confirm:withdrawConfirm', value: any): void;
}>()

const { t } = useI18n()
const { me } = inject(AUTH)!
const { screen } = inject(THEME)!
const verifyCode = ref<string>('')
const enabledGoogle2fa = computed(() => (props.enable2fa || me.value?.enable2fa))
const rules = computed(() => ({
  verifyCode: {
    required,
    minLength: minLength(6),
    maxLength: maxLength(6)
  },
}))

const updateVerifyCode = async (value: string) => {
  verifyCode.value = value
  await v$.value.$validate()
}

const v$ = useVuelidate(rules, { verifyCode })

watch(() => verifyCode.value, (v) => {
  if (v && v.length === 6) {
    emit('confirm:withdrawConfirm', v)
  }
}, { immediate: true })
</script>

<template>
  <div class="w-full flex flex-col gap-y-3 lg:gap-y-4 font-semibold text-sm">
    <div class="w-full flex flex-col gap-y-3 lg:gap-y-4">
      <p
        v-if="!enabledGoogle2fa"
        class="text-white"
      >
        {{ t('currency.enter-6-digit-code-confirm-process-email-15-minutes') }}
      </p>
      <p
        v-else
        class="text-white"
      >
        {{ t('currency.enter-6-digit-code-confirm-process-google-authenticator') }}
      </p>

      <div class="w-full flex flex-col gap-y-1">
        <div class="flex justify-between items-center">
          <span class="text-white font-bold">
            {{ t('base.verification-code') }}
          </span>
        </div>
        <div v-if="screen.lg">
          <VerificationCode
            width="w-full h-auto min-h-12"
            @update:code="updateVerifyCode"
          />
        </div>
        <div v-else>
          <JInput
            v-model="verifyCode"
            :classes="{
              Input: 'w-full bg-divider-dark! px-4 text-sm! border-none! h-11! rounded! text-center'
            }"
            type="text"
          />
        </div>
      </div>

      <JbInputMessage v-if="v$.verifyCode.$error">
        <UIcon
          class="w-4 h-4 min-w-4 min-h-4 text-red-600"
          name="i-heroicons-information-circle-20-solid"
        />
        {{ v$.verifyCode.$errors[0].$message }}
      </JbInputMessage>

      <div class="text-paragraph flex items-center gap-x-1">
        {{ t('currency.didnt-receive-code') }}
        <JbBlankButton class="text-white font-semibold">
          {{ t('base.resend-code') }}
        </JbBlankButton>
      </div>
    </div>

    <div class="flex flex-row justify-end gap-4">
      <JButton
        :loading="loading"
        class="py-1 px-3 min-h-9!"
        size="md"
        variant="primary"
        @click="$emit('confirm:withdrawConfirm', verifyCode)"
      >
        {{ t('base.submit') }}
      </JButton>
    </div>
  </div>
</template>
