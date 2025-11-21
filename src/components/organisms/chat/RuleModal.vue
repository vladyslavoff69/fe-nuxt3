<script lang="ts" setup>
import CloseButton from '~/components/molecules/button/CloseButton.vue'
import { MESSENGER_ICON } from '~/components/symbols'

const { modalVisible } = defineProps<{
  modalVisible: boolean;
}>()

const emits = defineEmits<{
  (e: 'close:ruleModal'): void;
}>()

const { t } = useI18n()
const rules = [
  { title: t('chat.respect-everyone'), guideline: t('chat.respect-guideline') },
  { title: t('chat.avoid-spam_caps'), guideline: t('chat.avoid-spam_caps-guideline') },
  { title: t('chat.no-begging-or-soliciting'), guideline: t('chat.no-begging-or-soliciting-guideline') },
  { title: t('chat.avoid-suspicious-activities'), guideline: t('chat.avoid-suspicious-activities-guideline') },
  { title: t('chat.no-trading-advertising-referrals'), guideline: t('chat.no-trading-advertising-referrals-guideline') },
  { title: t('chat.protect-personal-info'), guideline: t('chat.protect-personal-info-guideline') },
  { title: t('chat.chat-languages'), guideline: t('chat.chat-languages-guideline') },
  { title: t('chat.language-respect'), guideline: t('chat.language-respect-guideline') },
  { title: t('chat.avoid-sensitive-topics'), guideline: t('chat.avoid-sensitive-topics-guideline') },
  { title: t('chat.follow-moderator-instructions'), guideline: t('chat.follow-moderator-instructions-guideline') },
]

const isOpen = ref(modalVisible)

const closeRuleModal = () => {
  isOpen.value = false
  emits('close:ruleModal')
}

</script>

<template>
  <ClientOnly>
    <UModal
      v-model:open="isOpen"
      class="w-11/12 sm:max-w-lg p-4 bg-green-950"
      :default-open="isOpen"
      @update:open="(v) => {
      if (!v) {
        closeRuleModal()
      }
    }"
    >
      <template #content>
        <div class="w-full h-full flex flex-col gap-y-4">
          <div class="flex items-center justify-between bg-green-950">
            <div class="flex gap-4 items-center justify-between w-full border-b border-b-green-950">
              <div class="flex-1 flex gap-x-2 items-center text-white">
                <svg
                  class="w-6 h-6 min-w-6 min-h-6"
                >
                  <use :href="MESSENGER_ICON" />
                </svg>
                <span class="text-lg font-bold">{{ t('chat.chat-rules') }}</span>
              </div>
              <div class="flex items-center gap-x-2">
                <CloseButton
                  class="w-4 h-4 min-w-4 min-h-4 text-paragraph"
                  @click="closeRuleModal"
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col items-center">
            <div class="pr-10">
              <NuxtImg
                alt="Messenger1"
                class="max-w-28"
                loading="lazy"
                provider="cloudflare"
                src="b37af274-10a2-4277-475e-2f6be9db2000/md"
              />
            </div>
            <div class="pl-10 relative bottom-2">
              <NuxtImg
                alt="Messenger12"
                class="max-w-28"
                loading="lazy"
                provider="cloudflare"
                src="41d21a23-a00a-46c9-1231-f18629fcf500/md"
              />
            </div>
          </div>
          <div class="flex-1 grid gap-y-2 min-h-0 pb-1">
            <div
              v-for="(rule, idx) in rules"
              :key="idx"
              class="flex gap-x-2"
            >
              <span class="text-white text-sm font-semibold leading-5">{{ idx + 1 }}.</span>
              <div>
                <h3 class="text-sm font-bold leading-5 capitalize">
                  <span>{{ rule.title }}:</span>
                </h3>
                <p class="text-sm leading-4">
                  {{ rule.guideline }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </ClientOnly>
</template>
