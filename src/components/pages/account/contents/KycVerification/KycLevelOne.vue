<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import { email as validEmail, minLength, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import DatePicker from '~/components/molecules/common/DatePicker.vue'
import AddressInput from '~/components/molecules/inputs/AddressInput.vue'
import { AUTH } from '~/constants'
import { APPLY_KYC_LEVEL_ONE } from '~/graphql'

const { t } = useI18n()
const { isLoggedIn, me, userKyc } = inject(AUTH)!

const validateAge = (v: Date | string): boolean => {
  const dateOfBirth = typeof v === 'string' ? new Date(v) : v

  const ageDiffMs = Date.now() - dateOfBirth.getTime()
  const ageDate = new Date(ageDiffMs)
  const age = Math.abs(ageDate.getUTCFullYear() - 1970)

  return age >= 18
}

const rules = {
  name: {
    required,
    minLength: minLength(3),
  },
  lastname: {
    required,
    minLength: minLength(3),
  },
  dateOfBirth: {
    required,
    mustOver18: validateAge
  },
  email: {
    validEmail,
    required,
    checkAtLetter,
    checkDotLetter,
    minLength: minLength(3),
  },
  address: {
    required
  },
}

const formData = reactive({
  name: userKyc.value?.name || me.value?.name || '',
  lastname: userKyc.value?.lastname || me.value?.lastname || '',
  email: me.value?.email,
  phone: userKyc.value?.contact || '',
  dateOfBirth: userKyc.value?.date_of_birth || me.value?.date_of_birth,
  address: userKyc.value?.address || me.value?.address?.formatted_address || '',
})

const v$ = useVuelidate(rules, formData)

const {
  mutate, loading, onDone, onError
} = useMutation(APPLY_KYC_LEVEL_ONE)

const validationForm = async () => {
  return await v$.value.$validate()
}

const onSubmit = async () => {
  if (!(await validationForm()) || loading.value) {
    return
  }

  const requestParams: any = {
    name: formData.name,
    lastname: formData.lastname,
    email: formData.email,
    date_of_birth: formData.dateOfBirth,
    address: formData.address
  }

  if (formData.phone) {
    requestParams.phone = formData.phone
  }

  await mutate({ input: requestParams })
}

onDone(async () => {
  try {
    useGeneralNotify({
      type: 'success',
      title: t('notifications.success'),
      description: t('notifications.apply-kyc-level-one-sucess')
    })
  } catch (e) {
    useGeneralNotify({
      type: 'error',
      title: t('notifications.failed-modification'),
      description: t('errors.SOMETHING_WENT_WRONG_RELOAD')
    })
  }
})

onError((error) => {
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: parsedError.message,
  })
})

const formattedDate = computed(() => {
  return formData.dateOfBirth ? useDateFormat(new Date(formData.dateOfBirth), 'DD MMM, YYYY').value : ''
})
</script>

<template>
  <div
    v-if="isLoggedIn && !!me"
    class="flex flex-col gap-y-1 bg-green-950 p-5 rounded-md"
  >
    <div class="flex flex-col">
      <div class="flex flex-col sm:flex-row gap-x-3">
        <div class="flex-1 flex flex-col">
          <div class="flex flex-col gap-y-2">
            <div class="">
              <span class="text-sm font-bold text-white">
                {{ t('account.first-name') }}
              </span>
              <span class="text-red-600">*</span>
            </div>
            <div
              class="relative min-h-14 sm:min-h-16"
            >
              <UInput
                v-model="formData.name"
                :placeholder="t('account.enter-first-name')"
                class="w-full h-11"
                color="primary"
                size="xl"
                type="text"
                :ui="{
                  base: 'border-none! text-sm! h-11'
                }"
              />
              <JbInputMessage
                :class="{
                  'opacity-0 max-h-2 sm:max-h-4': !v$.name.$error,
                }"
              >
                <UIcon
                  class="w-4 h-4 min-w-4 min-h-4 text-red-600"
                  name="i-heroicons-information-circle-20-solid"
                />
                {{
                  v$?.name?.required?.$invalid ? t('errors.FIELD_REQUIRED') : t('errors.USERNAME_MIN_LENGTH')
                }}
              </JbInputMessage>
            </div>
          </div>
          <div class="flex flex-col gap-y-2">
            <div class="">
              <span class="text-sm font-bold text-white">
                {{ t('account.date-of-birth') }}
              </span>
              <span class="text-red-600">*</span>
            </div>
            <ClientOnly>
              <div
                class="relative min-h-14 sm:min-h-16"
              >
                <DatePicker v-model="formData.dateOfBirth">
                  <template #trigger>
                    <UInput
                      v-model="formattedDate"
                      :placeholder="t('account.date-of-birth')"
                      class="w-full h-11"
                      color="primary"
                      size="xl"
                      type="text"
                      :ui="{
                        base: 'border-none! text-sm! h-11'
                      }"
                    />
                  </template>
                </DatePicker>
                <JbInputMessage
                  :class="{
                    'opacity-0 max-h-2 sm:max-h-4': !v$.dateOfBirth.$error,
                    'h-4': v$.dateOfBirth.$error
                  }"
                >
                  <UIcon
                    class="w-4 h-4 min-w-4 min-h-4 text-red-600"
                    name="i-heroicons-information-circle-20-solid"
                  />
                  {{ v$.dateOfBirth.required.$invalid ? t('errors.FIELD_REQUIRED') : t('errors.AGE_WARNING') }}
                </JbInputMessage>
              </div>
            </ClientOnly>
          </div>
        </div>
        <div class="flex-1 flex flex-col-reverse sm:flex-col">
          <div class="flex flex-col gap-y-2">
            <div class="">
              <span class="text-sm font-bold text-white">
                {{ t('account.last-name') }}
              </span>
              <span class="text-red-600">*</span>
            </div>
            <div
              class="relative min-h-14 sm:min-h-16"
            >
              <UInput
                v-model="formData.lastname"
                :placeholder="t('account.enter-last-name')"
                class="w-full h-11"
                color="primary"
                size="xl"
                type="text"
                :ui="{
                  base: 'border-none! text-sm! h-11'
                }"
              />
              <JbInputMessage
                :class="{
                  'opacity-0 max-h-2 sm:max-h-4': !v$.lastname?.$error,
                }"
              >
                <UIcon
                  class="w-4 h-4 min-w-4 min-h-4 text-red-600"
                  name="i-heroicons-information-circle-20-solid"
                />
                {{
                  v$?.lastname?.required?.$invalid ? t('errors.FIELD_REQUIRED') : t('errors.USERNAME_MIN_LENGTH')
                }}
              </JbInputMessage>
            </div>
          </div>
          <div class="flex flex-col gap-y-2">
            <div class="">
              <span class="text-sm font-bold text-white">
                {{ t('account.contact-number') }}
              </span>
            </div>
            <div
              class="relative min-h-14 sm:min-h-16"
            >
              <UInput
                v-model="formData.phone"
                :placeholder="t('account.enter-contact-number')"
                class="w-full h-11"
                color="primary"
                size="xl"
                type="text"
                :ui="{
                  base: 'border-none! text-sm! h-11'
                }"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row gap-x-3">
        <div class="flex-1  flex flex-col gap-y-2">
          <div class="">
            <span class="text-sm font-bold text-white">
              {{ t('account.email') }}
            </span>
            <span class="text-red-600">*</span>
          </div>
          <div
            class="relative min-h-14 sm:min-h-16"
          >
            <UInput
              v-model="formData.email"
              :placeholder="t('account.enter-email')"
              class="w-full h-11"
              color="primary"
              size="xl"
              type="text"
              :ui="{
                base: 'border-none! text-sm! h-11 text-paragraph!'
              }"
              disabled
            />

            <JbInputMessage
              :class="{
                'opacity-0 max-h-2 sm:max-h-4': !v$.email.$error,
              }"
            >
              {{
                v$.email.checkAtLetter.$invalid
                  ? 'Must include @ symbol'
                  : v$.email.required.$invalid
                    ? t('errors.EMAIL_REQUIRED')
                    : t('errors.EMAIL_INVALID')
              }}
            </JbInputMessage>
          </div>
        </div>
        <div class="flex-1 flex flex-col gap-y-2">
          <div class="">
            <span class="text-sm font-bold text-white">{{ t('account.address') }}</span>
            <span class="text-red-600">*</span>
          </div>
          <div class="flex-1 sm:flex-none">
            <div
              class="min-h-14 sm:min-h-16"
            >
              <AddressInput
                :model-value="formData.address"
                input-class="bg-brand"
                @update:model-value="(val: string) => {
                  formData.address = val
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <JButton
        :disabled="userKyc?.kyc_level >= 1"
        :loading="loading"
        class="px-6 py-3"
        variant="primary"
        @click="onSubmit"
      >
        {{ userKyc?.kyc_level >= 1 ? t('base.completed') : t('base.submit') }}
      </JButton>
    </div>
  </div>
</template>
