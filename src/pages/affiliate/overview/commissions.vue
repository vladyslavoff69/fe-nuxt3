<script lang="ts" setup>
import type { SponsorCommissionsByCurrency, SponsorCommissionsByCurrencyPaginator, } from '~/types'
import { CLAIM_SPONSOR_COMMISSIONS_MUTATION, SPONSOR_COMMISSIONS_BY_CURRENCY_QUERY, } from '~/graphql'
import CommissionsTable from '~/apps/affiliate/components/commission/CommissionsTable.vue'
import { AUTH } from '~/constants'

const { t } = useI18n()
const { me } = inject(AUTH)!
const {
  result: commissionsResult,
  loading: commissionsLoading,
  refetch,
} = useQuery<{
  sponsorCommissionsByCurrency: SponsorCommissionsByCurrencyPaginator;
}>(
  SPONSOR_COMMISSIONS_BY_CURRENCY_QUERY, {}
)

const commissions = computed(
  () => commissionsResult.value?.sponsorCommissionsByCurrency.data ?? [],
)

const {
  loading: claimLoading,
  onDone: onClaimDone,
  onError: onClaimError,
  error: claimRError,
  mutate: claimMutate,
} = useMutation(CLAIM_SPONSOR_COMMISSIONS_MUTATION)

onClaimDone(() => {
  refetch()
})

onClaimError(() => {
  useGeneralNotify({
    type: 'error',
    title: 'Server Error!',
    description:
      claimRError.value?.message,
  })
})

const claimCommissions = () => {
  claimMutate()
}

const hasClaimableCommission = computed(() => {
  const index = commissions.value.findIndex(
    (item: SponsorCommissionsByCurrency) =>
      item.sponsor_commission_claimable > 0,
  )
  return index > -1
})
</script>

<template>
  <div v-if="!!me">
    <ClientOnly>
      <CommissionsTable
        :commissions="commissions"
        :loading="commissionsLoading"
      />
    </ClientOnly>
    <div class="flex flex-col gap-[15px] mt-[15px] md:mt-[30px]">
      <JButton
        :disabled="
          claimLoading || commissionsLoading || !hasClaimableCommission
        "
        :loading="claimLoading || commissionsLoading"
        :style-type="hasClaimableCommission ? 'primary' : 'secondary'"
        class="md:max-w-[330px] max-w-full mx-auto w-full text-white"
        @click="claimCommissions"
      >
        {{ t("affiliate.claim-avail") }}
      </JButton>
    </div>
  </div>
</template>
