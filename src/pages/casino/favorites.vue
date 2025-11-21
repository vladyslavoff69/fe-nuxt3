<script lang="ts" setup>
import FavoritesComponent from '~/apps/casino/components/Favorites.vue'
import CasinoPage from '~/apps/casino/components/CasinoPage.vue'
import { AUTH } from '~/constants'

const { me } = inject(AUTH)!
</script>

<template>
  <UPage
    class="w-full pt-4 md:pt-5 pl-1.5 pr-2.5 md:pl-0 md:pr-0"
  >
    <CasinoPage>
      <FavoritesComponent v-if="!!me" />
    </CasinoPage>
  </UPage>
</template>
