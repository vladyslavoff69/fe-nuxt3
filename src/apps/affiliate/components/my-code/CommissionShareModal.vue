<script lang="ts" setup>
import CloseButton from '~/components/molecules/button/CloseButton.vue'

const emits = defineEmits<{
  (e: 'close:modal', value: boolean): void;
}>()

const { t } = useI18n()
const onCloseModal = () => {
  emits('close:modal', true)
}
</script>

<template>
  <div class="text-left">
    <div
      class="flex justify-between items-center w-full pb-4"
    >
      <div
        class="text-white font-bold text-xl leading-none! flex items-center gap-x-1"
      >
        <span>{{ t("affiliate.setting-comm-rate") }}</span>
      </div>
      <CloseButton
        class="w-3 h-3 min-w-3 min-h-3"
        @click="onCloseModal"
      />
    </div>
    <div>
      <NuxtImg
        class="mx-auto max-w-48 mb-4"
        loading="lazy"
        provider="cloudflare"
        src="/9fd879a3-3ab3-4db8-33e9-040f9c55b900/sm"
        alt="Commission Share"
      />
      <div
        v-for="i in 6"
        :key="i"
        class="mb-2 text-sm"
      >
        <div class="flex gap-2.5 text-white">
          <span>{{ t(`affiliate.comm-${i}`) }}</span>
        </div>
        <div class="flex gap-2.5">
          <span>{{ t(`affiliate.comm-${i}-answer`) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
