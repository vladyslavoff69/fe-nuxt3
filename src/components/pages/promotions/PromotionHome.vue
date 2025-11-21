<script lang="ts" setup>
import PromotionCard from '~/components/molecules/card/PromotionCard.vue'
import { useVuelidate } from '@vuelidate/core'
import SkeletonPromotionCard from '~/components/molecules/skeletons/SkeletonPromotionCard.vue'
import { required } from '@vuelidate/validators'
import { PROMOTIONS_ICON } from '~/components/symbols'
import { APPLY_PROMO_CODE_MUTATION } from '~/graphql/promo'
import { usePromotions } from '~/composables/promos'

const { t } = useI18n()
const category = ref('all')
const {
  loading: loadingPromotions,
  refetchPromotions,
  promotions: promotionsData,
} = usePromotions({ promoId: null, category: category.value, enabled: true })

const form = reactive({ redeemCode: '' })
const rules = { redeemCode: { required } }
const v$ = useVuelidate(rules, form)

const reFetchData = () => {
  if (category.value !== 'all') {
    refetchPromotions({
      active: category.value === 'active',
      enabled: true
    })
  } else {
    refetchPromotions({
      active: null,
      enabled: true
    })
  }
}

const {
  mutate: applyCodeMutate,
  onDone,
  onError,
  loading,
} = useMutation(APPLY_PROMO_CODE_MUTATION)

const applyPromo = async () => {
  if (!(await v$.value.$validate()) || loading.value) {
    return
  }

  await applyCodeMutate({
    code: form.redeemCode,
  })
}

onDone(({ data }) => {
  useConfetti()
})

onError(() => {
  useGeneralNotify({
    type: 'error',
    title: 'Server Error!',
    description: t('notifications.code-unusable-message'),
  })
})

const promotions = computed(() => (promotionsData.value?.filter(item => item.valid_for !== 'sports')))

const { sendFingerprint } = useSendFingerprint()
onMounted(async () => {
  await sendFingerprint()
})
</script>

<template>
  <div class="flex flex-col gap-y-4 cursor-pointer">
    <div class="flex flex-col sm:flex-row justify-between">
      <div class="flex-1 flex items-center text-white gap-x-2 xs:gap-x-3 sm:gap-x-4">
        <svg class="lg:w-8 lg:h-8 w-6 h-6 min-w-6 min-h-6 text-white">
          <use :href="PROMOTIONS_ICON" />
        </svg>
        <span class="h-10 text-white text-lg lg:text-2xl font-bold leading-10!">
          {{ t('menu.promotions') }}
        </span>
      </div>
      <div class="flex flex-col gap-0.5">
        <div class="flex items-center gap-x-2">
          <JInput
            v-model="form.redeemCode"
            :classes="{
              Input: 'border bg-green-950 border-border rounded-md px-3 py-2! h-10! text-sm'
            }"
            :placeholder="t('promotions.enter-code')"
            class="w-auto mt-2 xs:mt-0 sm:max-w-48"
          >
            <template #startIcon>
              <UIcon
                class="w-5 h-4"
                name="heroicons:tag-20-solid"
              />
            </template>
          </JInput>
          <JButton
            class="h-10 px-6"
            variant="outline"
            @click="applyPromo"
          >
            {{ t('base.claim') }}
          </JButton>
        </div>
        <JbInputMessage v-if="v$.redeemCode.$error">
          {{ t('errors.PROMO_CODE_REQUIRED') }}
        </JbInputMessage>
      </div>
    </div>
    <div class="flex flex-col gap-y-7">
      <div class="flex items-center max-w-24">
        <JSelect
          v-model="category"
          :classes="{
            ListboxButton: 'min-w-20 ml-auto h-9 sm:h-10 rounded-md text-xs font-bold px-3 pr-1',
            Placeholder: 'text-xs',
            LabelOptLabel: 'text-xs font-bold leading-3'
          }"
          :has-check-box="false"
          :options="[
            { label: 'All', value: 'all' },
            { label: 'Active', value: 'active' },
            { label: 'Expired', value: 'expired' }
          ]"
          @update:model-value="reFetchData"
        />
      </div>

      <div class="w-full flex flex-wrap gap-x-4 gap-y-8">
        <template v-if="loadingPromotions">
          <SkeletonPromotionCard
            v-for="idx in 3"
            :key="`key-${idx}-hey-a-4`"
          />
        </template>
        <template v-else-if="promotions && promotions.length">
          <PromotionCard
            v-for="(promotion, idx) in promotions"
            :key="`key-${idx}-hey-a-5`"
            :promo-data="promotion"
          />
        </template>
      </div>
    </div>
  </div>
</template>
