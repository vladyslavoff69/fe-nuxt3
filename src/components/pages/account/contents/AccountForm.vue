<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import { minLength, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import DatePicker from '~/components/molecules/common/DatePicker.vue'
import { AUTH } from '~/constants'
import { UPDATE_USER_PROFILE_MUTATION } from '~/graphql'
import AddressInput from '~/components/molecules/inputs/AddressInput.vue'
import VipRankImg from '~/components/molecules/table/details/VipRankImg.vue'

const { t } = useI18n()
const genderOptions = [
  { label: t('account.male'), value: 1 },
  { label: t('account.female'), value: 2 },
  { label: t('account.other'), value: 3 }
]

const validateAge = (value: Date | string): boolean => {
  const dateOfBirth = typeof value === 'string' ? new Date(value) : value

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
  username: {
    required,
    minLength: minLength(3),
  },
  dateOfBirth: {
    required,
    mustOver18: validateAge
  }
}

const { me }: any = inject(AUTH)!
const formData = reactive({
  name: me.value?.name || '',
  username: me.value?.username || '',
  lastname: me.value?.lastname || '',
  gender_id: me.value?.gender_id,
  email: me.value?.email,
  profileUrlHost: 'junglebet.com',
  profileUrlSlug: me.value?.username || 'username',
  dateOfBirth: me.value?.date_of_birth,
  address: me.value?.address?.formatted_address || '',
  telegram_id: me.value?.telegram_id || '',
})

const v$ = useVuelidate(rules, formData)

watch(
  () => me.value?.name,
  (_loggedUserName) => {
    if (_loggedUserName) {
      formData.name = me.value?.name || ''
      formData.username = me.value?.username
      formData.lastname = me.value?.lastname || ''
      formData.gender_id = me.value?.gender_id
      formData.email = me.value?.email
      formData.profileUrlHost = 'junglebet.com'
      formData.profileUrlSlug = me.value?.username || 'username'
      formData.dateOfBirth = me.value?.date_of_birth
      formData.address = me.value?.address?.formatted_address || ''
      formData.telegram_id = me.value?.telegram_id || ''
    }
  }
)

const isCustomUrlEditable = ref<boolean>(false)
const customUrlInput = ref<HTMLElement | null>(null)
const editLocked = ref<boolean>(true)
const editRequired = ref<boolean>(false)

const { mutate, loading, onDone } = useMutation(UPDATE_USER_PROFILE_MUTATION)

const validationForm = async () => {
  return await v$.value.$validate()
}

const onSubmit = async () => {
  if (editLocked.value) {
    return
  }
  if (!(await validationForm()) || loading.value) {
    return
  }

  const requestParams: any = {
    name: formData.name,
    username: formData.username,
    date_of_birth: formData.dateOfBirth
  }
  if (formData.gender_id) {
    requestParams.gender_id = formData.gender_id
  }
  if (formData.lastname) {
    requestParams.lastname = formData.lastname
  }

  await mutate({ input: requestParams }, {
    optimisticResponse: {
      updateProfile: {
        __typename: me.value?.__typename || 'User',
        ...me.value,
        id: me.value!.id,
        ...requestParams
      }
    }
  })
}

onDone(async () => {
  try {
    useGeneralNotify({
      type: 'success',
      title: t('notifications.success'),
      description: t('notifications.your-changes-updated')
    })
  } catch (e) {
    useGeneralNotify({
      type: 'error',
      title: t('notifications.failed-modification'),
      description: t('errors.SOMETHING_WENT_WRONG_RELOAD')
    })
  }
})

const formattedDate = computed(() => {
  return formData.dateOfBirth ? useDateFormat(new Date(formData.dateOfBirth), 'DD MMM, YYYY').value : ''
})

const onToggleEditLock = () => {
  editLocked.value = !editLocked.value
  editRequired.value = false
}

const toggleCustomUrlEdit = () => {
  if (editLocked.value) {
    editRequired.value = true
    return
  }
  if (!isCustomUrlEditable.value) {
    isCustomUrlEditable.value = true
  }
  if (customUrlInput.value) {
    nextTick(() => {
      // @ts-ignore
      customUrlInput.value?.input?.focus()
    })
  }
}
const onBlurProfileUrlInput = async () => {
  isCustomUrlEditable.value = false
}

const pingEditRequire = () => {
  if (editLocked.value && !editRequired.value) {
    editRequired.value = true
  }
}
</script>

<template>
  <div class="flex flex-col gap-y-8">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-x-3">
        <div class="w-12 h-12 sm:h-14 sm:w-14 rounded-full">
          <VipRankImg
            :vip-level-name="me?.vip_level_name"
            class="rounded-full w-full h-full"
          />
        </div>
        <div>
          <h2 class="text-xl sm:text-[22px] font-bold leading-7 sm:leading-8">
            {{ me?.username }}
          </h2>
        </div>
      </div>
      <JButton
        class="rounded-md flex items-center h-11 py-2 sm:py-3 px-4"
        variant="alternative"
        @click="onToggleEditLock"
      >
        <UIcon
          v-if="editLocked"
          class="h-4 w-4 min-w-4 min-h-4"
          name="mdi:pencil-lock-outline"
        />
        <UIcon
          v-else
          class="h-4 w-4 min-w-4 min-h-4"
          name="mdi:pencil-outline"
        />
        <span class="font-bold text-sm">Edit</span>
      </JButton>
    </div>
    <div class="flex flex-col gap-y-7">
      <div class="flex flex-col">
        <div class="flex flex-col sm:flex-row gap-x-3">
          <div class="flex-1 flex flex-col">
            <div class="flex flex-col gap-y-2">
              <div>
                <span class="text-sm font-bold text-white">
                  {{ t('account.first-name') }}
                </span>
                <span class="text-red-600">*</span>
              </div>
              <div
                class="relative min-h-14 sm:min-h-16"
              >
                <div
                  v-if="editLocked"
                  class="absolute w-full h-full z-1 cursor-not-allowed"
                  @click="pingEditRequire"
                />
                <UInput
                  v-model="formData.name"
                  :disabled="editLocked"
                  :placeholder="t('account.enter-first-name')"
                  class="w-full h-11"
                  color="primary"
                  size="xl"
                  type="text"
                  :ui="{
                    base: 'border-none! bg-green-950! text-sm! h-11'
                  }"
                />
                <JbInputMessage
                  :class="{
                    'opacity-0 max-h-2 sm:max-h-4': !v$?.name?.$error,
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
              <div>
                <span class="text-sm font-bold text-white">
                  {{ t('account.last-name') }}
                </span>
              </div>
              <div
                class="relative min-h-14 sm:min-h-16"
              >
                <div
                  v-if="editLocked"
                  class="absolute w-full h-full z-1 cursor-not-allowed"
                  @click="pingEditRequire"
                />
                <UInput
                  v-model="formData.lastname"
                  :disabled="editLocked"
                  :placeholder="t('account.enter-last-name')"
                  class="w-full h-11"
                  color="primary"
                  size="xl"
                  type="text"
                  :ui="{
                    base: 'border-none! bg-green-950! text-sm! h-11'
                  }"
                />
              </div>
            </div>
          </div>
          <div class="flex-1 flex flex-col-reverse sm:flex-col">
            <div class="flex flex-col gap-y-2">
              <div>
                <span class="text-sm font-bold text-white">
                  {{ t('account.gender') }}
                </span>
              </div>
              <div
                class="relative min-h-14 sm:min-h-16"
              >
                <div
                  v-if="editLocked"
                  class="absolute w-full h-full z-1 cursor-not-allowed"
                  @click="pingEditRequire"
                />
                <USelect
                  v-model="formData.gender_id"
                  :disabled="editLocked"
                  :items="genderOptions"
                  :placeholder="t('account.select-gender')"
                  :arrow="true"
                  class="w-full bg-green-950! text-sm! border-none! ring-0! leading-[21px]! h-11"
                  label-key="label"
                  size="lg"
                  value-key="value"
                />
              </div>
            </div>
            <div class="flex flex-col gap-y-2">
              <div>
                <span class="text-sm font-bold text-white">
                  {{ t('account.date-of-birth') }}
                </span>
                <span class="text-red-600">*</span>
              </div>
              <ClientOnly>
                <div class="relative min-h-14 sm:min-h-16">
                  <div
                    v-if="editLocked"
                    class="absolute w-full h-full z-1 cursor-not-allowed"
                    @click="pingEditRequire"
                  />
                  <DatePicker v-model="formData.dateOfBirth">
                    <template #trigger>
                      <UInput
                        v-model="formattedDate"
                        :disabled="editLocked"
                        :placeholder="t('account.date-of-birth')"
                        class="w-full h-11"
                        color="primary"
                        size="xl"
                        type="text"
                        :ui="{
                          base: 'border-none! bg-green-950! text-sm! h-11'
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
        </div>
        <div class="flex flex-col sm:flex-row gap-x-3">
          <div class="flex-1  flex flex-col gap-y-2">
            <div>
              <span class="text-sm font-bold text-white">
                {{ t('account.email') }}
              </span>
              <span class="text-red-600">*</span>
            </div>
            <div
              class="relative min-h-14 sm:min-h-16"
            >
              <div
                class="absolute w-full h-full z-1 cursor-not-allowed"
              />
              <UInput
                v-model="formData.email"
                :placeholder="t('account.enter-email')"
                class="w-full h-11"
                color="primary"
                size="xl"
                type="text"
                :ui="{
                  base: 'border-none! bg-green-950! text-sm! h-11 text-paragraph!'
                }"
              />
            </div>
          </div>
          <div class="flex-1 flex flex-col gap-y-2">
            <div>
              <span class="text-sm font-bold text-white">
                {{ t('account.username') }}
              </span>
              <span class="text-red-600">*</span>
            </div>
            <div
              class="relative min-h-14 sm:min-h-16"
            >
              <div
                class="absolute w-full h-full z-1 cursor-not-allowed"
              />
              <UInput
                v-model="formData.username"
                :placeholder="t('account.enter-username')"
                class="w-full h-11"
                color="primary"
                size="xl"
                type="text"
                :ui="{
                  base: 'border-none! bg-green-950! text-sm! h-11 text-paragraph!'
                }"
              />
            </div>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-x-3">
          <div class="flex-1 flex flex-col gap-y-2">
            <div>
              <span class="text-sm font-bold text-white">{{ t('account.address') }}</span>
            </div>
            <div class="flex-1 sm:flex-none">
              <div
                class="min-h-14 sm:min-h-16"
              >
                <div
                  v-if="editLocked"
                  class="absolute w-full h-full z-1 cursor-not-allowed"
                  @click="pingEditRequire"
                />
                <AddressInput
                  :disabled="editLocked"
                  :model-value="formData.address"
                  @update:model-value="(val: string) => {
                    formData.address = val
                  }"
                />
              </div>
            </div>
          </div>
          <div class="flex-1 flex flex-col gap-y-2">
            <div>
              <span class="text-sm font-bold text-white">
                {{ t('account.custom-url') }}
              </span>
            </div>
            <div class="flex items-center bg-green-950 rounded-md px-4 h-11">
              <div
                :class="{
                  'hidden': !isCustomUrlEditable
                }"
                class="flex items-center"
              >
                <div class="text-paragraph text-sm">
                  <span>{{ formData.profileUrlHost }}/</span>
                </div>
                <UInput
                  ref="customUrlInput"
                  v-model="formData.profileUrlSlug"
                  :autofocus="true"
                  class="w-full h-11"
                  color="primary"
                  size="xl"
                  type="text"
                  :ui="{
                    base: 'border-none! bg-green-950! text-sm! h-11'
                  }"
                  @blur="onBlurProfileUrlInput"
                />
              </div>
              <div
                :class="{
                  'hidden': isCustomUrlEditable
                }"
                class="block text-paragraph text-sm"
              >
                <span>{{ formData.profileUrlHost }}/{{ formData.profileUrlSlug }}</span>
              </div>
              <JbBlankButton
                class="ml-auto"
                @click="toggleCustomUrlEdit"
              >
                <UIcon
                  class="h-4 w-4 min-w-4 min-h-4"
                  name="heroicons:pencil-20-solid"
                />
              </JbBlankButton>
            </div>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-x-3">
          <div class="flex flex-col gap-y-2">
            <div>
              <span class="text-sm font-bold text-white">
                Telegram ID
              </span>
            </div>
            <div
              class="relative min-h-14 sm:min-h-16"
            >
              <UInput
                v-model="formData.telegram_id"
                :disabled="editLocked"
                placeholder="Enter Telegram ID"
                class="w-full h-11"
                color="primary"
                size="xl"
                type="text"
                :ui="{
                  base: 'border-none! bg-green-950! text-sm! h-11'
                }"
              />
            </div>
          </div>
        </div>
      </div>
      <JButton
        :disabled="editLocked"
        :loading="loading"
        class="sm:max-w-[300px] w-full h-11"
        variant="primary"
        @click="onSubmit"
      >
        {{ t('base.save-change') }}
      </JButton>
    </div>
  </div>
</template>
