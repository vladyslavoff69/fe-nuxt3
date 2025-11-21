<script lang="ts" setup>
import useVuelidate from '@vuelidate/core'
import { minValue, required } from '@vuelidate/validators'
import { CHAT, THEME } from '~/constants'
import { BANNED_USERS_QUERY, TOGGLE_CHAT_TIMEOUT_USER_MUTATION, } from '~/graphql'

const { t } = useI18n()
const { screen } = inject(THEME)!
const { muteConfirmationVisible, muteConfirmationUsername } = inject(CHAT)!
const form = reactive({
  username: muteConfirmationUsername.value,
  reason: '',
  muteLength: 1,
  unit: 1,
})
const rules = {
  username: { required },
  reason: { required },
  muteLength: { required, min: minValue(1) },
  unit: { required },
}
const v$ = useVuelidate(rules, form)
const openPopover = ref(false)

const { mutate, loading, onDone } = useMutation(
  TOGGLE_CHAT_TIMEOUT_USER_MUTATION,
  {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: BANNED_USERS_QUERY, variables: { first: 100 } }],
  }
)

const close = () => {
  openPopover.value = false
}

const reasons = [
  {
    value: 'banned_word',
    text: 'Sending messages containing banned words. There are not many.',
  },
  {
    value: 'racist_messages',
    text: 'No racist or defamatory messages regarding religion.',
  },
  {
    value: 'scam_accusations',
    text: 'Making false accusations about the casino and disrupting the community.',
  },
  { value: 'message_spam', text: 'Sending spam messages and other nonsense in chat.' },
  { value: 'self_promotion', text: 'Self promoting (insert your crap here) - This is not the place, you will be muted.' },
  {
    value: 'violence_threats',
    text: 'Threatening/encouraging violence towards other community members or staff.',
  },
  {
    value: 'scam_attempt',
    text: 'Attempting to scam others or making unwanted contact with community members outside of the platform.',
  },
  {
    value: 'advertising',
    text: 'Soliciting/selling/buying/trading any services and/or items. Nobody wants your crap.',
  },
]
const presetReason = computed<string>(
  () => reasons.find(r => r.text === form.reason)?.value || ''
)
const unitOptions = [
  {
    value: 1,
    label: 'Min',
  },
  {
    value: 60,
    label: 'Hour',
  },
  {
    value: 60 * 24,
    label: 'Day',
  },
  {
    value: 60 * 24 * 7,
    label: 'Week',
  },
]
onDone(() => {
  muteConfirmationVisible.value = false
})

const onSubmit = async () => {
  if (!(await v$.value.$validate())) {
    return
  }

  await mutate({
    input: {
      username: form.username,
      ...(presetReason.value
        ? { timeout_reason: presetReason.value }
        : { custom_timeout_reason: form.reason }),
      timeout_minutes: form.muteLength * form.unit,
    },
  })
}
</script>
<template>
  <div class="MuteConfirmation pb-1">
    <form
      class="grid grid-cols-1 gap-y-2"
      @submit.prevent="onSubmit"
    >
      <div class="">
        <span class="text-sm mb-2.5">{{ t('account.username') }}</span>
        <JInput
          v-model="form.username"
          :status="v$.username.$error ? 'error' : 'normal'"
        />
        <JbInputMessage v-if="v$.username.$error">
          {{ t('account.INVALID_USERNAME') }}
        </JbInputMessage>
      </div>
      <div class="">
        <span class="text-sm mb-2.5">{{ t('chat.mute-reason') }}</span>
        <div class="relative">
          <div class="flex gap-x-1">
            <textarea
              v-model="form.reason"
              :class="{ 'border-error!': v$.reason.$error }"
              :placeholder="t('chat.mute-reason-placeholder')"
              class="
                w-full bg-brand max-h-20 px-1.5 py-2.5 text-sm text-white ring-0 focus:outline-hidden
                placeholder:text-paragraph overflow-y-auto resize-none rounded-md hover:ring-1 focus:ring-1
                ring-inset ring-border hover:ring-primary
              "
              rows="2"
            />
            <ClientOnly>
              <UPopover
                v-model:open="openPopover"
                :arrow="screen.md"
                class="w-[calc(100%-56px)]"
              >
                <JButton
                  class="w-10 md:w-[45px] px-0!"
                  style-type="secondary"
                  type="button"
                >
                  <UIcon
                    class="w-4 h-4"
                    name="i-heroicons-chevron-down-20-solid"
                  />
                </JButton>
                <template #content>
                  <div class="max-w-[397px] max-h-[350px] overflow-y-auto">
                    <ul class="list-decimal list-outside pl-7 marker:text-white overflow-y-auto">
                      <li
                        v-for="reason in reasons"
                        :key="reason.value"
                        :class="{
                          'bg-menu-active': presetReason === reason.value,
                        }"
                        class="py-1 cursor-pointer group px-4 duration-150 hover:bg-border text-sm"
                        @click="
                          form.reason = reason.text;
                          close();
                        "
                      >
                        {{ reason.text }}
                      </li>
                    </ul>
                  </div>
                </template>
              </UPopover>
            </ClientOnly>
          </div>
          <JbInputMessage v-if="v$.reason.$error">
            {{ t('errors.FIELD_REQUIRED') }}
          </JbInputMessage>
        </div>
      </div>
      <div class="g-form-item">
        <span class="text-sm mb-2.5">{{ t('chat.mute-length') }}</span>
        <div class="flex items-center w-full gap-x-1">
          <JInputNumber
            v-model="form.muteLength"
            class-name="flex-1"
          />
          <div>
            <JSelect
              v-model="form.unit"
              :classes="{
                ListboxButton: 'w-full max-w-16 h-10 py-2 px-2.5 pr-1! font-bold text-paragraph ring-1 ring-inset ring-border',
                ListboxOptions: '',
                Placeholder: 'text-xs',
                LabelOptLabel: 'text-xs'
              }"
              :has-check-box="false"
              :options="unitOptions"
              class="right-0!"
            />
          </div>
        </div>
        <JbInputMessage v-if="v$.muteLength.$error">
          <UIcon
            class="w-4 h-4 min-w-4 min-h-4 text-red-600"
            name="i-heroicons-information-circle-20-solid"
          />
          {{
            t('errors.POSITIVE_AMOUNT')
          }}
        </JbInputMessage>
      </div>
      <div class="flex gap-4">
        <JButton
          :loading="loading"
          @click="onSubmit"
        >
          {{ t('base.confirm') }}
        </JButton>
      </div>
    </form>
  </div>
</template>
