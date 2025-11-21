<script lang="ts" setup>
import { PREFERENCE } from '~/constants'
import { FAVORITES_ICON } from '~/components/symbols'
import GameRows from '~/apps/casino/components/GameRows.vue'

const { t } = useI18n()
const { favoriteGames, favGameLoading } = inject(PREFERENCE)!
</script>

<template>
  <div class="flex flex-col gap-y-2 md:gap-y-6">
    <div class="flex flex-1 items-center">
      <div class="flex-1 flex items-center text-white gap-x-2 xs:gap-x-3 md:gap-x-4 h-full">
        <svg class="w-5 h-5 min-w-5 min-h-5 xs:w-6 xs:h-6 text-white">
          <use :href="FAVORITES_ICON" />
        </svg>
        <span class="text-white text-lg font-bold leading-normal">
          {{ t('menu.my-favorites') }}
        </span>
      </div>
    </div>
    <GameRows
      :games="favoriteGames"
      :loading="favGameLoading"
      :no-data-placeholder="t('errors.NO_DATA_TO_DISPLAY')"
    />
  </div>
</template>
