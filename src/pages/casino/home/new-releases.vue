<script lang="ts" setup>
import GameSections from '~/apps/casino/components/game-section/index.vue'
import { NEWEST_ICON } from '~/components/symbols'

const { t } = useI18n()
</script>

<template>
  <UPage class="w-full">
    <GameSections
      :category-row="{
        categorySlug: 'new',
        title: t('casino.new-releases'),
        icon: NEWEST_ICON
      }"
    />
  </UPage>
</template>
