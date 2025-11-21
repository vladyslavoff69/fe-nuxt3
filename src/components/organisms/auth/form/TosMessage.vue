<script lang="ts" setup>
const { t } = useI18n()
</script>

<template>
  <JbInputMessage>
    <UIcon
      class="w-5 h-5 min-w-5 min-h-5 text-red-600"
      name="i-heroicons-information-circle-20-solid"
    />

    {{ t('auth.must-agree-to-terms-to-register') }}
  </JbInputMessage>
</template>
