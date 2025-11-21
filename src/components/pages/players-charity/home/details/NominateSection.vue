<script lang="ts" setup>
import { AUTH } from '~/constants'
import { CHARITY_SETTINGS_QUERY, CREATE_INDICATED_INSTITUTION } from '~/graphql'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

const { me, isLoggedIn }: any = inject(AUTH)!
const { t } = useI18n()

const rules = {
  name: {
    required,
  },
  countryId: {
    required,
  },
  username: {
    required,
  },
  description: {
    required,
  }
}

const formData = reactive({
  name: '',
  countryId: undefined,
  username: me.value?.username,
  description: '',
})

const v$ = useVuelidate(rules, formData)
const validationForm = async () => {
  return await v$.value.$validate()
}

const {
  result: charitySettingResult,
} = useQuery(
  CHARITY_SETTINGS_QUERY,
  {}
)

const {
  mutate: nominateMutate,
  loading: loadingNominateMutate,
  onDone: nominateOnDone,
  onError: nominateOnError,
} = useMutation(CREATE_INDICATED_INSTITUTION)

const countries = computed(() => {
  return charitySettingResult.value?.charitySettings?.countries?.map(item => ({ label: item.name, value: item.id }))
})

const onClickNominate = async () => {
  if (!(await validationForm()) || loadingNominateMutate.value) {
    return
  }

  const payload: any = formData
  if (isLoggedIn.value) {
    payload.email = me.value?.email
  }

  nominateMutate(payload)
}

nominateOnDone(() => {
  useGeneralNotify({
    type: 'success',
    title: t('notifications.success'),
    description: t('notifications.nominate-thank')
  })
  v$.value.$reset()
  useTimeoutFn(() => {
  }, 200)
})

nominateOnError((error) => {
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: parsedError.message
  })
})
</script>

<template>
  <div
    class="bg-green-950 flex flex-col lg:flex-row rounded-3xl p-2 pt-4 sm:p-6 gap-x-3 align-center lg:align-baseline gap-y-7 lg:gap-y-0"
  >
    <div class="flex items-center">
      <div class="w-full flex flex-col sm:flex-row gap-x-7 gap-y-6">
        <NuxtImg
          alt="Vote Box"
          class="h-auto w-32 sm:w-48 mx-auto"
          loading="lazy"
          provider="cloudflare"
          src="28dbac93-fff7-4d76-1496-65f7ab02d100/sm"
        />
        <div class="flex flex-col text-center sm:text-left gap-y-3 items-center w-full justify-center">
          <div class="grid gap-y-2 sm:gap-y-1">
            <h3
              class="text-sm sm:text-base leading-6 font-extrabold uppercase tracking-wider sm:tracking-primary text-primary"
            >
              {{ t('charity.suggest-charity') }}
            </h3>
            <h1 class="max-w-80 sm:max-w-full text-2xl sm:text-xxl font-bold leading-6 sm:leading-7 ">
              {{ t('charity.nominate-cause') }}
            </h1>
          </div>
          <p class="max-w-96 sm:max-w-full text-sm sm:text-lg font-semibold leading-5 sm:leading-6">
            {{
              t('charity.make-difference')
            }}
          </p>
        </div>
      </div>
    </div>
    <div class="flex flex-col w-full p-6 gap-y-6 bg-brand rounded-3xl lg:rounded-lg">
      <div class="grid gap-y-3">
        <div class="grid gap-y-1">
          <span class="text-sm font-bold text-white">{{ t('charity.charity-organization') }}</span>
          <UInput
            v-model="formData.name"
            :placeholder="t('charity.charity-name')"
            class="w-full h-11"
            color="primary"
            size="xl"
            type="text"
            :ui="{
              base: 'border-none! text-sm! h-11 bg-green-950!'
            }"
          />
          <JbInputMessage
            v-if="v$.name.$error"
            class="h-4"
          >
            <UIcon
              class="w-4 h-4 min-w-4 min-h-4 text-red-600"
              name="i-heroicons-exclamation-circle-20-solid"
            />
            {{ t('errors.FIELD_REQUIRED') }}
          </JbInputMessage>
        </div>
        <div class="grid gap-y-1">
          <span class="text-sm font-bold text-white">{{ t('charity.charity-country') }}</span>
          <USelect
            v-model="formData.countryId"
            :items="countries || []"
            :placeholder="t('base.select')"
            :popper="{ arrow: true }"
            :class="{
              'text-paragraph!': formData.countryId
            }"
            :arrow="true"
            class="w-full bg-green-950! text-sm! border-none! h-11 ring-0!"
            label-key="label"
            size="lg"
            value-key="value"
          />
        </div>
        <div class="grid gap-y-1">
          <span class="text-sm font-bold text-white">{{ t('charity.your-username') }}</span>
          <UInput
            v-model="formData.username"
            :disabled="true"
            class="w-full h-11"
            color="primary"
            size="xl"
            type="text"
            :ui="{
              base: 'border-none! text-sm! h-11 bg-green-950!'
            }"
          />
        </div>
        <div class="grid gap-y-1">
          <span class="text-sm font-bold text-white">{{ t('charity.leave-message') }}</span>
          <UInput
            v-model="formData.description"
            :placeholder="t('charity.nominate-charity')"
            class="w-full h-11"
            color="primary"
            size="xl"
            type="text"
            :ui="{
              base: 'border-none! text-sm! h-11 bg-green-950!'
            }"
          />
          <JbInputMessage
            v-if="v$.description.$error"
            class="h-4"
          >
            <UIcon
              class="w-4 h-4 min-w-4 min-h-4 text-red-600"
              name="i-heroicons-exclamation-circle-20-solid"
            />
            {{ t('errors.FIELD_REQUIRED') }}
          </JbInputMessage>
        </div>
      </div>
      <div>
        <JButton
          :loading="loadingNominateMutate"
          class="w-full"
          @click="onClickNominate"
        >
          <span class="text-sm">{{ t('charity.nominate') }}</span>
        </JButton>
      </div>
    </div>
  </div>
</template>
