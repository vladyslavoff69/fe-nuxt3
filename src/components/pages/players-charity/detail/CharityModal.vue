<script lang="ts" setup>
import { CHARITY_INSTITUTION_SUBSCRIBE } from '~/graphql'
import { PREFERENCE, SITE_SETTINGS } from '~/constants'

const { t } = useI18n()
const { modalVisible } = defineProps<{
  modalVisible: boolean
}>()
const emits = defineEmits<{
  (e: 'close:charityModal'): void;
}>()

const { currentCharityRefetch } = inject(PREFERENCE)!
const { charities } = inject(SITE_SETTINGS)!

const isSettingModalVisible = ref(modalVisible)

const closeModal = () => {
  isSettingModalVisible.value = false
  emits('close:charityModal')
}

const {
  mutate: subscribeMutate,
  loading: subscribeLoading,
  onDone: subscribeDone,
  onError: subscribeError,
} = useMutation(CHARITY_INSTITUTION_SUBSCRIBE)

const formData = reactive<{
  region: string,
  charityId: number
}>({
  region: '',
  charityId: 0
})

const onSubmit = () => {
  if (!formData.charityId) {
    return false
  }
  subscribeMutate({
    charityInstitutionId: Number(formData.charityId)
  })
}
subscribeDone(() => {
  currentCharityRefetch()
  closeModal()
  useGeneralNotify({
    type: 'success',
    title: t('notifications.success'),
    description: t('notifications.subscription-success')
  })
})
subscribeError((error) => {
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: parsedError.message
  })
})

const charityModalTxt = computed(() => {
  const _txt = t('charity.charity-modal-txt')

  return _txt.replace('no cost to you', '<span class="text-primary">NO COST TO YOU</span>')
})

</script>

<template>
  <ClientOnly>
    <UModal
      class="p-6! overflow-visible w-11/12 sm:max-w-sm bg-brand!"
      :default-open="isSettingModalVisible"
      :dismissible="false"
    >
      <template #content>
        <div class="flex flex-col w-full gap-y-2 md:gap-y-4">
          <div class="flex flex-col gap-y-3 w-full items-center justify-center pt-3">
            <div class="flex flex-col w-full">
              <JbLogo class="h-9" />
            </div>
            <NuxtImg
              alt="Vote Box"
              class="w-full max-w-36"
              loading="lazy"
              provider="cloudflare"
              src="e8051718-94ac-40d7-043f-2c9732048600/sm"
            />
          </div>
          <div
            class="flex flex-col text-center break-words gap-y-1"
            style="line-break: anywhere"
          >
            <h3 class="uppercase font-extrabold leading-4 tracking-wide text-primary">
              {{ t('charity.charity-modal-header') }}
            </h3>
            <p
              class="leading-5 tracking-tight"
              v-html="charityModalTxt"
            />
          </div>
          <div class="flex flex-col gap-y-3">
            <JSelect
              v-model="formData.charityId"
              :classes="{
              ListboxButton: 'bg-green-950! w-full h-10 py-2 px-3 pr-2 font-bold text-paragraph',
              Placeholder: 'text-sm font-normal',
              LabelOptLabel: 'text-xs'
            }"
              :has-check-box="false"
              :options="charities"
              :placeholder="t('charity.select-the-charity')"
              end-slot-attribute="short_description"
              option-attribute="name"
              value-attribute="id"
            />
          </div>
          <JButton
            :disabled="!formData.charityId"
            :loading="subscribeLoading"
            class="w-full"
            @click="onSubmit"
          >
            Submit
          </JButton>
          <div class="text-xxs flex flex-col gap-y-1/2 leading-3 text-center">
            <div>
              <span>{{ t('charity.charity-modal-footer-desc1') }}</span>
              <NuxtLinkLocale
                class="font-bold capitalize underline mx-1"
                to="/players-charity"
              >
                {{ t('charity.player-s-charity') }}
              </NuxtLinkLocale>
            </div>
            <div>
              <span>{{ t('charity.charity-modal-footer-desc2') }}</span>
              <JbBlankButton class="font-bold capitalize underline ml-1">
                {{ t('base.faq') }}
              </JbBlankButton>
              <span>.</span>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </ClientOnly>
</template>
