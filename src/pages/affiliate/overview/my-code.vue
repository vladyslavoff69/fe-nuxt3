<script lang="ts" setup>
import ReferralCodeForm from '~/apps/affiliate/components/my-code/ReferralCodeForm.vue'
import ReferralCodeTable from '~/apps/affiliate/components/my-code/ReferralCodeTable.vue'
import { useUsdToFiatAmount } from '~/apps/affiliate/hooks'
import ReferralCodesSlider from '~/apps/affiliate/components/my-code/ReferralCodesSlider.vue'
import type { SponsorCommissionsTotals } from '~/types'
import { SPONSOR_COMMISSIONS_TOTALS_QUERY } from '~/graphql'
import { AUTH } from '~/constants'

const { t } = useI18n()
const { me, loading: sponsorCodeLoading, refetch } = inject(AUTH)!
const { usdToFiatAmount } = useUsdToFiatAmount()
const codes = computed(() => me.value?.sponsorCodes || [])
const { result: sponsorTotalsResult, loading: sponsorTotalsLoading } =
  useQuery<{
    sponsorCommissionsTotals: SponsorCommissionsTotals;
  }>(
    SPONSOR_COMMISSIONS_TOTALS_QUERY, {}
  )
const sponsorTotals = computed(() => sponsorTotalsResult.value?.sponsorCommissionsTotals)
const slideData = computed(() => ([
  {
    text: 'affiliate.commission-tier',
    value: `${sponsorTotals.value?.sponsor_commission_tier_percentage}%`,
    modal: 'commission-tiers',
  },
  {
    text: 'affiliate.total-refs',
    value: sponsorTotals.value?.total_affiliates,
  },
  {
    text: 'affiliate.total-wagered',
    value: `${usdToFiatAmount(
      sponsorTotals.value?.total_wagered_by_affiliates
    )}`,
  },
  {
    text: 'affiliate.total-claimed',
    value: `${usdToFiatAmount(
      sponsorTotals.value?.total_sponsor_commission_claimed
    )}`,
  },
  {
    text: 'affiliate.total-claimable',
    value: `${usdToFiatAmount(
      sponsorTotals.value?.total_sponsor_commission_claimable
    )}`,
  },
  {
    text: 'affiliate.total-comm',
    value: `${usdToFiatAmount(
      sponsorTotals.value?.total_commission
    )}`,
  },
]))

const openDropAsset = () => {
  navigateTo('https://www.dropbox.com/scl/fo/s66mtgtyupwbtb87fiaxp/h?rlkey=x970dnp39ztqo5y1hd0wrd3s0&e=1&dl=0', {
    external: true,
    open: {
      target: '_blank',
    }
  })
}
</script>

<template>
  <div v-if="!!me">
    <section class="flex flex-col gap-2.5 mb-7">
      <ReferralCodeForm @refetch-codes="refetch" />
    </section>
    <section class="flex flex-col gap-2.5 mb-7">
      <ReferralCodesSlider
        :data="codes"
        :loading="sponsorTotalsLoading"
        :slides="slideData"
      />
    </section>

    <section class="flex flex-col gap-2.5 mb-7">
      <ClientOnly>
        <ReferralCodeTable
          :data="codes"
          :loading="sponsorCodeLoading"
        />
      </ClientOnly>
    </section>

    <section class="flex flex-col gap-2.5 border-t border-border pt-4">
      <h2 class="text-lg font-bold">
        {{ t("affiliate.social-kit") }}
      </h2>
      <p class="text-sm">
        {{ t("affiliate.social-kit-text") }}
      </p>
      <div>
        <JButton
          class="block px-4 text-white w-full md:w-auto"
          shape="circle"
          @click="openDropAsset"
        >
          {{ t("affiliate.download-graphics") }}
        </JButton>
      </div>
    </section>
  </div>
</template>
