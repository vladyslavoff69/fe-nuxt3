<script lang="ts" setup>
import ViewCommissionModal from '~/apps/vip-program/components/dashboard/ViewCommissionModal.vue'
import { AUTH } from '~/constants'

const { me } = inject(AUTH)!
</script>

<template>
  <ClientOnly>
    <ViewCommissionModal
      v-if="!!me"
      :has-head="false"
      :user="me"
    />
  </ClientOnly>
</template>
