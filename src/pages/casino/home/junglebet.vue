<script lang="ts" setup>
import GameSections from '~/apps/casino/components/game-section/index.vue'
import { HOME_JUNGLEBET_ORIGINAL_ICON } from '~/components/symbols/casino-home'

const { t } = useI18n()
</script>

<template>
  <UPage class="w-full">
    <GameSections
      :category-row="{
        categorySlug: 'junglebet',
        title: t('casino.originals'),
        icon: HOME_JUNGLEBET_ORIGINAL_ICON
      }"
    />
  </UPage>
</template>
