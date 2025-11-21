<script lang="ts" setup>
import type { CategoryRow, CurrencyRow, ProvidersRow } from '~/apps/casino/types'
import CategoryRows from '~/apps/casino/components/CategoryRows.vue'
import CurrencySliderComponent from '~/components/pages/home/CurrencySlider.vue'
import {
  HOME_JUNGLEBET_ORIGINAL_ICON,
  HOME_LIVE_CASINO_ICON,
  HOME_PROVIDERS_ICON,
  HOME_SLOTS_ICON
} from '~/components/symbols/casino-home'
import ProviderRows from '~/apps/casino/components/ProviderRows.vue'
import { NEWEST_ICON } from '~/components/symbols'
import { CASINO_HOME } from '~/apps/casino/constants';

const runtimeConfig = useRuntimeConfig()
const casinoOriginal = runtimeConfig.public?.casinoOriginal || 'junglebet'
const { t } = useI18n()
const { gameCategories } = inject(CASINO_HOME)!

const initialCategoryProviderRows = computed<
  Array<CategoryRow | ProvidersRow | CurrencyRow>
>(
  () => {
    const defaultEnabledCategorySlugs: {
      slug: string,
      categorySlug: string,
      name: string,
      icon: string
      iconType: string
    }[] = [
      {
        slug: String(casinoOriginal),
        categorySlug: String(casinoOriginal),
        name: t('casino.originals'),
        icon: HOME_JUNGLEBET_ORIGINAL_ICON,
        iconType: 'symbol'
      },
      { slug: 'new-releases', categorySlug: 'new-releases', name: t('casino.new-releases'), icon: NEWEST_ICON, iconType: 'symbol' },
      { slug: 'slots', categorySlug: 'slots', name: t('casino.slots'), icon: HOME_SLOTS_ICON, iconType: 'symbol' },
      {
        slug: 'live-casino',
        categorySlug: 'live-casino',
        name: t('casino.live-casino'),
        icon: HOME_LIVE_CASINO_ICON,
        iconType: 'symbol'
      }
    ]

    const providersGroup: ProvidersRow = {
      id: 'game-providers-row',
      type: 'providers',
      title: t('casino.providers'),
      icon: HOME_PROVIDERS_ICON,
      iconType: 'symbol',
      enabled: true,
    }

    const categoryGroups: CategoryRow[] = [
      ...defaultEnabledCategorySlugs,
      ...(
        (gameCategories.value || []).filter(
          category => category.enabled &&
            !!category.name &&
            category.display_in_frontend &&
            !['new-releases', 'new', 'slots', 'live', 'live-casino'].includes(category.slug)
        )
      )
    ]
      .map((s, sI) => {
        return {
          id: `category_non_${sI}`,
          type: 'category',
          title: s.name,
          icon: s.icon || HOME_JUNGLEBET_ORIGINAL_ICON,
          iconType: s.iconType || 'symbol',
          categorySlug: s.slug,
          enabled: true,
        }
      })
      .filter(category => category !== null) as CategoryRow[]

    const currencyGroup: CurrencyRow = {
      type: 'currencies'
    }

    return [
      ...categoryGroups.slice(0, 2),
      currencyGroup,
      ...categoryGroups.slice(2, 4),
      providersGroup,
      ...categoryGroups.slice(4),
    ]
  })
</script>

<template>
  <ClientOnly>
    <div class="flex flex-col gap-y-6 sm:gap-y-7 md:gap-y-8 min-h-[calc(100vh-var(--header-height)*2.05)]">
      <div
        v-for="(groupRow, idx) of initialCategoryProviderRows"
        :key="`key-${idx}-${groupRow?.type}`"
        class="w-full"
      >
        <template
          v-if="groupRow.type === 'category'"
        >
          <CategoryRows
            :category-row="groupRow"
          />
        </template>
        <template
          v-else-if="groupRow.type === 'providers'"
        >
          <ProviderRows
            :provider-row="groupRow"
          />
        </template>
        <template
          v-else-if="groupRow.type === 'currencies'"
        >
          <CurrencySliderComponent />
        </template>
        <template v-else>
          <div>Games</div>
        </template>
      </div>
    </div>
  </ClientOnly>
</template>
