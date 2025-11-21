<script lang="ts" setup>
const { t } = useI18n()
</script>
<template>
  <span class="cursor-pointer m-0 text-xs text-paragraph hover:text-white">
    {{ t('auth.confirm-18plus-and-read') }}
    <NuxtLinkLocale
      class="font-bold"
      to="/"
    >
      {{ t('auth.terms-of-service') }}
    </NuxtLinkLocale>
  </span>
</template>
