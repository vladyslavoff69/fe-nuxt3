<script lang="ts" setup>
import { ref } from 'vue'
import { AUTH } from '~/constants'
import type { SponsorCode } from '@/types'
import { APPLY_SPONSOR_CODE_MUTATION, GET_SPONSOR_CODE_QUERY } from '~/graphql'
import AffiliateCodeHelpModal from '~/apps/vip-program/components/dashboard/AffiliateCodeHelpModal.vue'

const { t } = useI18n()
const isAffModalVisible = ref<boolean>(false)
const referralCode = ref<string>('')
const verifiedAffiliateCode = ref<SponsorCode | null>()
const isInvalidReferralCode = ref<boolean>(false)
const isRequiredReferralCode = ref<boolean>(false)
const prevLoadedReferralCode = ref<string>('')

const { refetch } = inject(AUTH)!

const {
  loading: refCodeLoading,
  load: loadRefCode,
  onResult: onCodeResult,
  refetch: reloadCode,
} = useLazyQuery<{
  getSponsorCode: SponsorCode;
}>(
  GET_SPONSOR_CODE_QUERY,
  { code: referralCode.value }
)

onCodeResult(({ data }) => {
  verifiedAffiliateCode.value = data?.getSponsorCode || null
  isRequiredReferralCode.value = false
  if (!data?.getSponsorCode) {
    isInvalidReferralCode.value = true
  }
})

const hasVerifiedAffiliateCode = computed(() => !!verifiedAffiliateCode.value)

const inputReferralCode = () => {
  isInvalidReferralCode.value = false
  isRequiredReferralCode.value = false
  verifiedAffiliateCode.value = null
}

const handleReferralCode = () => {
  isInvalidReferralCode.value = false
  if (!referralCode.value) {
    isRequiredReferralCode.value = true
    return
  }
  isRequiredReferralCode.value = false
  if (hasVerifiedAffiliateCode.value) {
    verifiedAffiliateCode.value = null
  } else if (prevLoadedReferralCode.value === referralCode.value) {
    reloadCode()
  } else {
    prevLoadedReferralCode.value = referralCode.value
    loadRefCode(
      GET_SPONSOR_CODE_QUERY,
      { code: referralCode.value }
    )
  }
}

const {
  loading: applyReferralCodeLoading,
  onDone: onApplyReferralCodeDone,
  mutate: applyCodeMutate,
  error,
  onError,
} = useMutation(APPLY_SPONSOR_CODE_MUTATION)

const applyReferralCode = () => {
  if (applyReferralCodeLoading.value) {
    return
  }
  applyCodeMutate({
    code: referralCode.value,
  })
}

onApplyReferralCodeDone(() => {
  refetch()
})

onError(() => {
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: error.value?.message,
  })
})
const openHelpModal = () => {
  isAffModalVisible.value = true
}
const onCloseModal = () => {
  isAffModalVisible.value = false
}
</script>

<template>
  <div>
    <div
      class="text-sm md:text-base mb-2.5 flex items-center group cursor-pointer gap-2"
      @click="openHelpModal()"
    >
      <UIcon
        class="w-4 h-4 min-w-4 min-h-4 text-paragraph cursor-help hover:text-white"
        name="material-symbols:help-outline"
      />
      <span class="font-bold">{{ t("vip.aff-code") }}</span>
    </div>
    <p class="text-xs md:text-sm mb-2.5">
      <span
        v-if="verifiedAffiliateCode"
        class="text-sm text-white"
      >
        <i18n-t keypath="vip.aff-code-share">
          <template #percent>
            <span class="text-primary">{{ verifiedAffiliateCode.percent_back }}%</span>
          </template>
        </i18n-t>
      </span>
      <span
        v-else
        class="text-paragraph"
      >{{ t("vip.aff-code-apply") }}</span>
    </p>
    <div class="flex items-center text-sm justify-between w-full">
      <UInput
        v-model="referralCode"
        :disabled="hasVerifiedAffiliateCode"
        class="text-sm! h-10 w-full"
        @update:model-value="inputReferralCode"
      >
        <template #trailing>
          <div class="flex! items-center relative -mr-2.5">
            <JButton
              v-if="hasVerifiedAffiliateCode"
              :disabled="
                  refCodeLoading || !referralCode || applyReferralCodeLoading
                "
              :loading="refCodeLoading || applyReferralCodeLoading"
              class="rounded-md! rounded-r-none! border-r-0! text-white"
              type="button"
              @click="applyReferralCode"
            >
              {{ t("base.confirm") }}
            </JButton>
            <div
              v-if="hasVerifiedAffiliateCode"
              class="w-[2px] md:h-[30px] h-6 bg-green-950 z-10 shrink-0 absolute left-[calc(50%+3px)] md:top-[6.5px] top-2"
            />
            <JButton
              :class="{
                  'rounded-l-none! border-l-0!': hasVerifiedAffiliateCode,
                  'w-[87.56px] md:w-[103px]!': !hasVerifiedAffiliateCode,
                }"
              :loading="refCodeLoading"
              :style-type="hasVerifiedAffiliateCode ? 'secondary' : 'primary'"
              class="rounded-l-none! text-white"
              type="button"
              @click="handleReferralCode"
            >
              {{
                hasVerifiedAffiliateCode ? t("base.cancel") : t("vip.apply")
              }}
            </JButton>
          </div>
        </template>
      </UInput>
      <JbInputMessage v-if="isRequiredReferralCode">
        {{ t("vip.code-required") }}
      </JbInputMessage>
      <JbInputMessage v-else-if="isInvalidReferralCode">
        {{ t("vip.code-no-exist") }}
      </JbInputMessage>
    </div>
    <ClientOnly>
      <UModal
        v-model:open="isAffModalVisible"
        :default-open="isAffModalVisible"
        class="w-11/12 sm:w-[400px] bg-brand p-2 sm:p-4"
        @update:open="(v) => {
        if (!v) {
          onCloseModal()
        }
      }"
      >
        <template #content>
          <AffiliateCodeHelpModal @close:modal="onCloseModal" />
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>
