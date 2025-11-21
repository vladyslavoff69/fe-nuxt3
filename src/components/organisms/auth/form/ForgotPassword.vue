<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import { email as validEmail, minLength, required } from '@vuelidate/validators'
import { SEND_RESET_LINK_MUTATION } from '~/graphql'
import { CIRCLE_CHECK_ICON } from '~/icons'

const { t } = useI18n()
const form = reactive({
  email: '',
})

const rules = {
  email: {
    validEmail,
    required,
    checkAtLetter,
    checkDotLetter,
    minLength: minLength(3),
  }
}

const v$ = useVuelidate(rules, form)

const sentLink = ref<boolean>(false)
const countdownResend = ref<number>(60)

const {
  mutate,
  loading: sendLoading,
  onDone,
  onError
} = useMutation(SEND_RESET_LINK_MUTATION)

const onSubmit = async () => {
  if (!(await v$.value.$validate()) || sendLoading.value) {
    return
  }

  await mutate({
    email: form.email,
  })
}

const { pause, resume } = useIntervalFn(() => {
  if (countdownResend.value < 1) {
    sentLink.value = false
    pause()
    countdownResend.value = 60
  }

  countdownResend.value -= 1
}, 1000)

onDone((response) => {
  useGeneralNotify({
    type: 'success',
    title: t('notifications.success'),
    description: response?.data?.sendResetLink[0]
  })

  sentLink.value = true
  countdownResend.value = 60
  resume()
})

onError((error) => {
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: parsedError.message
  })
})

const inputClass = 'bg-form-input ring-transparent rounded-md px-3 h-auto text-sm'
</script>

<template>
  <div class="flex flex-col gap-y-3 px-0.5 w-full">
    <p class="text-xl font-bold text-left">
      {{ t('auth.send-email-instruction') }}
    </p>
    <div class="w-full">
      <JInput
        v-model="form.email"
        :classes="{
          Input: inputClass
        }"
        :error="v$.email.$error"
        :placeholder="t('auth.enter-email-address')"
      >
        <template #startIcon>
          <UIcon
            class="w-4 h-4 min-w-4 min-h-4"
            name="i-heroicons-envelope-20-solid"
          />
        </template>
      </JInput>
      <JbInputMessage v-if="v$.email.$error">
        <UIcon
          class="w-4 h-4 min-w-4 min-h-4 text-red-600"
          name="i-heroicons-information-circle-20-solid"
        />
        {{
          v$.email.checkAtLetter.$invalid
            ? 'Must include @ symbol'
            : v$.email.required.$invalid
              ? t('errors.EMAIL_REQUIRED')
              : t('errors.EMAIL_INVALID')
        }}
      </JbInputMessage>
    </div>

    <div class="w-full">
      <div
        v-if="sentLink"
        class="
          text-white text-base font-weight-bold
          inline-flex items-center justify-center gap-x-2
          h-[54px] w-full
        "
      >
        <span>{{ t('auth.reset-instructions-sent') }}</span>
        <svg
          class="w-5 h-5 text-green-600"
        >
          <use :href="CIRCLE_CHECK_ICON" />
        </svg>
      </div>

      <div class="w-full px-0.5">
        <div
          v-if="sentLink"
          class="
          text-white text-sm font-weight-bold w-full
        "
        >
          {{ t('auth.resend-instructions-prompt') }} {{ countdownResend }} {{ t('base.seconds') }}.
        </div>
        <JButton
          v-else
          :disabled="!form.email || v$.email.$error || sendLoading"
          :loading="sendLoading"
          class="w-full py-2.5"
          variant="primary"
          @click="onSubmit"
        >
          {{ t('base.submit') }}
        </JButton>
      </div>
    </div>
  </div>
</template>
