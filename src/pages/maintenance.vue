<script lang="ts" setup>
import MaintenanceBlock from '~/components/pages/maintenance/index.vue'

const isOpenBlock = ref(true)
</script>

<template>
  <ClientOnly>
    <UModal
      :default-open="isOpenBlock"
      class="p-0! m-0! flex items-center justify-center bg-brand w-screen h-screen"
      :dismissible="false"
    >
      <template #content>
        <div class="p-0! m-0! flex items-center justify-center bg-brand w-screen h-screen">
          <MaintenanceBlock />
        </div>
      </template>
    </UModal>
  </ClientOnly>
</template>
