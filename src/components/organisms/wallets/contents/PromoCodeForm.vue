<script lang="ts" setup>
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import type { Couponable, PaginatorInfo } from '~/types'
import { AUTH, CouponTypes } from '~/constants'
import { PROMO_CODE_BY_USER } from '~/graphql'
import { APPLY_PROMO_CODE_MUTATION } from '~/graphql/promo'
import SocialShareLink from '~/components/organisms/SocialShareLink.vue'
import { useTransactionDataTableFilters } from '~/composables/modules/transactions'

const { t } = useI18n()
const { me, refetch } = inject(AUTH)!
const { requestParams } = useTransactionDataTableFilters()
const localePath = useLocalePath()
const runtimeConfig = useRuntimeConfig()
const redirectHome = runtimeConfig.public.redirectHome!
const router = useRouter()

const formattedRequestParams = reactive({
  filters: {
    startDate: computed(() => requestParams.starts_at),
    endDate: computed(() => requestParams.ends_at),
    username: me.value?.username,
    type: CouponTypes.CRYPTO_BALANCE,
  },
  first: computed(() => requestParams.limit),
  orderBy: [{ column: 'REDEEMED_AT', order: 'DESC' }],
  page: 1,
})

type promoResults = {
  data: Couponable[];
  paginatorInfo: PaginatorInfo;
};

const { result: transactionsResult, loading: transactionsLoading, refetch: promoRefetch } = useQuery<{
  promocodeByUser: promoResults;
}>(
  PROMO_CODE_BY_USER,
  formattedRequestParams
)

const {
  mutate: applyCodeMutate,
  onDone,
  onError,
  loading,
} = useMutation(APPLY_PROMO_CODE_MUTATION)

const transactions = computed(
  () => transactionsResult.value?.promocodeByUser?.data || []
)

const form = reactive({ redeemCode: '' })
const rules = { redeemCode: { required } }
const v$ = useVuelidate(rules, form)

const applyPromo = async () => {
  if (!(await v$.value.$validate()) || loading.value) {
    return
  }
  await applyCodeMutate({
    code: form.redeemCode,
  })
}

onDone(({ data }) => {
  refetch()
  promoRefetch()

  router.push(localePath(redirectHome))
})

onError(() => {
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: t('notifications.code-unusable-message'),
  })
})
</script>

<template>
  <div class="flex flex-col justify-between h-full leading-none text-sm gap-y-1">
    <div class="w-full grid grid-cols-3 gap-x-3 gap-y-4 lg:gap-y-5 text-white">
      <div class="col-span-3 grid grid-cols-3 gap-2">
        <div class="col-span-3 sm:col-span-2 font-bold flex flex-col">
          {{ t('promotions.promo-code') }}
        </div>
        <div class="col-span-3 sm:col-span-2 font-bold">
          <div class="w-full">
            <UInput
              v-model="form.redeemCode"
              :placeholder="t('promotions.enter-code')"
              class="ring-transparent! hover:ring-highlights! text-sm w-full"
              color="secondary"
              size="xl"
              type="text"
            />
            <JbInputMessage v-if="v$.redeemCode.$error">
              {{ t('errors.PROMO_CODE_REQUIRED') }}
            </JbInputMessage>
          </div>
        </div>
        <div class="col-span-3 sm:col-span-1 flex flex-col gap-y-1">
          <JButton
            :disabled="loading"
            :loading="loading"
            class="w-full h-10"
            size="md"
            variant="primary"
            @click="applyPromo"
          >
            {{ t('base.claim') }}
          </JButton>
        </div>
      </div>

      <hr class="col-span-3 h-px bg-border border-0">

      <div class="col-span-3 font-bold flex flex-col gap-y-2">
        {{ t('base.active-code') }}
        <div class="w-full grid gap-y-2">
          <div
            class="
              flex items-center justify-between py-1 px-2
              text-paragraph font-bold text-xs lg:text-sm
              border-b border-border
            "
          >
            <div>{{ t('base.code') }}</div>
            <div class="text-right">
              {{ t('base.expiry') }}
            </div>
          </div>
          <div
            v-if="transactionsLoading"
            class="flex items-center justify-between py-2 px-2 text-xs text-paragraph rounded-md"
          >
            <USkeleton
              :ui="{ rounded: 'rounded-md' }"
              class="h-4"
            />
            <USkeleton
              :ui="{ rounded: 'rounded-md' }"
              class="h-4"
            />
          </div>
          <template v-else-if="!!transactions && transactions.length">
            <div
              v-for="(tItem, tInd) in transactions"
              :key="`key-${tInd}-hey-17`"
              :class="{
                'bg-green-950': tInd % 2 !== 0
              }"
              class="flex items-center justify-between py-2 px-2 text-xs text-paragraph rounded-md"
            >
              <div>{{ tItem?.coupon?.code }}</div>
              <div class="text-right">
                {{ tItem?.coupon?.code }}
              </div>
            </div>
          </template>
          <span
            v-else
            class="text-xs text-paragraph"
          >
            {{ t('currency.no-promo-code') }}
          </span>
        </div>
      </div>
    </div>

    <div
      class="
        flex flex-col items-center gap-y-1 sm:gap-y-2
        w-full mt-4 lg:mt-auto text-xs sm:text-sm pb-2 sm:pb-5 text-paragraph
      "
    >
      {{ t('promotions.follow-us-social-media-post-codes') }}
      <SocialShareLink
        :show-google-fill="false"
        :show-np="false"
        class="justify-center"
      />
    </div>
  </div>
</template>
