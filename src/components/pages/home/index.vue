<script lang="ts" setup>
import LazyCasinoComponent from '~/components/pages/home/CasinoSection.vue'
import TableComponent from '~/components/pages/home/Table.vue'
import CurrencySliderComponent from '~/components/pages/home/CurrencySlider.vue'
import LazyTopBannerComponent from '~/components/pages/home/TopBanner.vue'
import { FEATURED_SLOTS_ICON, JUNGLEBET_ORIGINALS_ICON, LIVE_CASINO_ICON, NEWEST_ICON } from '~/components/symbols'

const { t } = useI18n()
const runtimeConfig = useRuntimeConfig()
const casinoOriginal = runtimeConfig.public?.casinoOriginal
</script>

<template>
  <div class="bg-brand w-full flex flex-col gap-y-4 sm:gap-y-8">
    <DelayHydration>
      <LazyTopBannerComponent hydrate-on-visible />
    </DelayHydration>

    <DelayHydration>
      <LazyCasinoComponent
        hydrate-on-visible
        :tabs="[
          { label: t('casino.new-releases'), value: 'new', icon: NEWEST_ICON },
        ]"
        selected="new"
      />
    </DelayHydration>

    <DelayHydration>
      <LazyCasinoComponent
        hydrate-on-visible
        :tabs="[
          { label: t('casino.originals'), value: casinoOriginal, icon: JUNGLEBET_ORIGINALS_ICON },
          { label: t('casino.slots'), value: 'slots', icon: FEATURED_SLOTS_ICON },
          { label: t('casino.live-casino'), value: 'live', icon: LIVE_CASINO_ICON, iconClass: 'relative bottom-px' },
        ]"
        :selected="casinoOriginal"
      />
    </DelayHydration>

    <CurrencySliderComponent />

    <ClientOnly>
      <TableComponent />
    </ClientOnly>
  </div>
</template>
