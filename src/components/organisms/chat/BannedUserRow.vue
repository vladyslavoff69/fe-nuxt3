<script lang="ts" setup>
import { useCountDown } from './hooks'
import type { Ban } from '~/types'
import { BANNED_USERS_QUERY, TOGGLE_CHAT_TIMEOUT_USER_MUTATION } from '~/graphql'

const props = defineProps<{
  ban: Ban;
}>()
const emits = defineEmits<{
  (e: 'endTimeout'): void;
}>()

const { t } = useI18n()
const confirmVisible = ref(false)
const { mutate, loading } = useMutation(
  TOGGLE_CHAT_TIMEOUT_USER_MUTATION,
  {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: BANNED_USERS_QUERY, variables: { first: 100 } }],
  }
)
const {
  timeLeft,
  timeLeftFormatted,
  onEndTimeout
} = useCountDown(String(props.ban?.banned?.active_timeout?.due_datetime))

const unmute = () => {
  mutate({
    input: {
      username: props.ban?.banned?.username,
      remove: true,
    },
  })
}

onEndTimeout(() => {
  emits('endTimeout')
})
</script>
<template>
  <div class="">
    <div class="flex items-center">
      <div class="w-1/2 text-left">
        {{ ban?.banned?.username }}
      </div>
      <div
        v-if="timeLeft"
        class="flex-1 text-white"
      >
        {{ timeLeftFormatted }}
      </div>
      <div
        v-if="timeLeft"
        class="flex-none"
      >
        <button
          class="group"
          @click.stop="confirmVisible = true"
        >
          <UIcon
            class="group-active:scale-95 w-4 h-5 min-w-4 min-h-5"
            name="octicon:unmute-16"
          />
        </button>
      </div>
      <div
        v-if="timeLeft === 0"
        class="flex-1"
      >
        {{ t('chat.a-few-mins') }}...
      </div>
    </div>
    <ClientOnly>
      <UModal
        v-model:open="confirmVisible"
        class="w-11/12 sm:max-w-lg py-3 sm:py-7"
        :default-open="confirmVisible"
        @update:open="(v) => {
        if (!v) {
          confirmVisible = false
        }
      }"
      >
        <template #content>
          <div class="flex flex-col w-full relative md:gap-y-3">
            <div class="flex items-center gap-2.5">
              <h4 class="text-white">
                {{ t('chat.muted-user-management') }}
              </h4>
            </div>
            <div class="">
              <p class="g-mb-md">
                {{ t('chat.you-unmute') }}, {{ ban?.banned?.username }}
              </p>
              <div class="flex gap-4">
                <JButton
                  :loading="loading"
                  @click="unmute"
                >
                  {{ t('base.confirm') }}
                </JButton>
              </div>
            </div>
          </div>
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>
