<script lang="ts" setup>
import { AUTH, CURRENCY, PREFERENCE } from '~/constants'
import { SAVE_USER_PREFERENCES_MUTATION } from '~/graphql'
import InputCheckbox from '~/components/molecules/common/InputCheckbox.vue'

const { isLoggedIn, me } = inject(AUTH)!
const { t } = useI18n()
const { activeFiatCode, changedActiveCode } = inject(PREFERENCE)!
const { fiatCurrencies } = inject(CURRENCY)!
const { mutate, onDone, onError, loading } = useMutation(SAVE_USER_PREFERENCES_MUTATION)

const router = useRouter()
const form = reactive({
  activeFiatCode: activeFiatCode.value || 'USD',
})

const checkActiveFiatCode = (value: string) => {
  form.activeFiatCode = value

  mutate({
    ...me.value?.preferences,
    activeFiatCode: form.activeFiatCode,
  }, {
    optimisticResponse: {
      saveUserPreferences: {
        __typename: me.value?.__typename || 'User',
        id: me.value?.id || 0,
        preferences: {
          ...me.value?.preferences,
          activeFiatCode: form.activeFiatCode
        }
      }
    }
  })
}

onDone(() => {
  useGeneralNotify({
    type: 'success',
    title: t('notifications.wallet-settings-updated'),
    description: t('notifications.your-changes-updated')
  })

  changedActiveCode.value = true

  router.push({
    path: router.currentRoute.value.path,
  })
})

onError((error) => {
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
    v-if="isLoggedIn && !!me"
    class="w-full grid grid-cols-3 lg:grid-cols-4"
  >
    <div
      v-for="(cItem, c) in fiatCurrencies"
      :key="`${c}_dollar-hey-16`"
      class="col-span-1"
    >
      <InputCheckbox
        :model-value="form.activeFiatCode === cItem?.code"
        @update:model-value="checkActiveFiatCode(cItem?.code)"
      >
        <div
          class="
            flex justify-between items-center gap-x-1.5
            w-14 font-semibold
          "
        >
          <span class="text-white">{{ cItem?.name }}</span>
          <UIcon
            v-if="cItem?.iconType === 'ui'"
            :name="cItem?.icon"
            class="w-4 h-4 min-w-4 min-h-4"
          />
          <svg
            v-else-if="cItem?.iconType === 'symbol'"
            class="w-4 h-4 min-w-4 min-h-4"
          >
            <use :href="cItem?.icon" />
          </svg>
          <UAvatar
            v-else
            :alt="cItem?.name"
            :src="cItem?.logo"
            class="w-4 h-4 min-w-4 min-h-4"
            img-class="w-4 h-4"
            size="sm"
          />
        </div>
      </InputCheckbox>
    </div>
  </div>
</template>
