<script lang="ts" setup>
import { HOME_LIVE_CASINO_ICON } from '~/components/symbols/casino-home'
import GameSections from '~/apps/casino/components/game-section/index.vue'

const { t } = useI18n()
</script>

<template>
  <UPage class="w-full">
    <GameSections
      :category-row="{
        categorySlug: 'live-casino',
        title: t('casino.live-casino'),
        icon: HOME_LIVE_CASINO_ICON
      }"
    />
  </UPage>
</template>
