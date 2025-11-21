<script lang="ts" setup>
import { AUTH, THEME } from '~/constants'
import { SAVE_USER_PREFERENCES_MUTATION, VERIFY_EMAIL_MUTATION } from '~/graphql'

const { me }: any = inject(AUTH)!
const { t } = useI18n()
const { screen } = inject(THEME)!
const inputClass = 'bg-green-950 ring-transparent rounded-md px-3 h-auto text-sm'
const { mutate, loading: saveLoading, onError } = useMutation(SAVE_USER_PREFERENCES_MUTATION)
const { mutate: verifyMutate, loading, onError: verifyError } = useMutation(VERIFY_EMAIL_MUTATION)

const form = reactive({
  email: me.value?.email || '',
  receiveNewsletter: me.value?.preferences?.receive_newsletter || false
})

onError((error) => {
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: parsedError.message
  })
})

verifyError((error) => {
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: parsedError.message
  })
})

const sendVerifyEmail = async () => {
  await verifyMutate({})
}

const saveNewsletter = () => {
  mutate({
    ...me.value?.preferences,
    receive_newsletter: form.receiveNewsletter,
  }, {
    optimisticResponse: {
      saveUserPreferences: {
        __typename: me.value?.__typename || 'User',
        id: me.value?.id || 0,
        preferences: {
          ...me.value?.preferences,
          receive_newsletter: form.receiveNewsletter
        }
      }
    }
  })
}
</script>

<template>
  <div class="grid gap-y-4">
    <div class="flex flex-col gap-y-4">
      <div class="flex items-center gap-x-2">
        <h3 class="text-xl sm:text-lg font-bold">
          {{ t('account.email') }}
        </h3>
        <UBadge
          :size="screen.md ? 'xs' : 'sm'"
          :ui="{
            base: 'rounded-full'
          }"
          class="w-auto text-center text-xxs font-bold uppercase tracking-[0.5px] bg-disabled-paragraph py-0 px-3 h-5"
          color="primary"
          variant="solid"
        >
          <span class="text-black">
            {{ !!me?.email_verified_at ? 'Verified' : 'Unverified' }}
          </span>
        </UBadge>
      </div>
      <div class="py-4 border-b border-b-alternative-hover">
        <div class="mb-2">
          <span class="font-semibold">{{ t('account.email') }}* </span>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-y-2">
          <JInput
            v-model="form.email"
            :classes="{
              Input: inputClass
            }"
            :placeholder="t('account.email')"
            class="w-full sm:max-w-80"
            color="white"
            disabled
          />
          <div
            v-if="!me?.email_verified_at"
            class="flex justify-end gap-x-2"
          >
            <JButton
              class="px-4! py-3!"
              :loading="loading"
              @click="sendVerifyEmail"
            >
              {{ t('account.resend-email') }}
            </JButton>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-y-4">
      <div class="flex items-center gap-x-2">
        <h3 class="text-xl sm:text-lg font-bold">
          {{ t('account.marketing') }}
        </h3>
      </div>
      <div class="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-y-2">
        <JSwitch
          :classes="{
            Inner: 'gap-x-2.5 items-start!',
            SwitchButton: 'w-9! min-w-9 h-[18px]! mt-0.5',
            SwitchInner: 'w-3.5! h-3.5!'
          }"
          :model-value="form.receiveNewsletter"
          translate="translate-x-5"
          @update:model-value="form.receiveNewsletter = !form.receiveNewsletter"
        >
          <template #SwitchLabel>
            <span class="flex flex-col gap-y-0.5">
              <span class="text-white text-sm font-bold leading-none">{{ t('account.receive-email-marketing') }}</span>
              <span class="text-paragraph text-xs leading-none font-medium">
                {{ t('account.receive-email-marketing-desc') }}
              </span>
            </span>
          </template>
        </JSwitch>
        <div class="flex justify-end gap-x-2">
          <JButton
            class="px-4! py-3!"
            :loading="saveLoading"
            @click="saveNewsletter"
          >
            {{ t('base.save') }}
          </JButton>
        </div>
      </div>
    </div>
  </div>
</template>
