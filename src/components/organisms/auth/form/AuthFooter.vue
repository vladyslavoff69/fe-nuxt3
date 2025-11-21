<template>
  <div class="text-xs text-center block text-paragraph leading-4">
    {{ t('auth.junglebet-protected-by-captcha') }}
    <br>
    <NuxtLinkLocale
      class="font-bold hover:text-white"
      to="/privacy-policy"
    >
      {{ t('auth.privacy-policy') }}
    </NuxtLinkLocale>
    {{ t('base.and') }}
    <NuxtLinkLocale
      class="font-bold hover:text-white"
      to="/tos"
    >
      {{ t('auth.terms-of-service-apply') }}
    </NuxtLinkLocale>
  </div>
</template>
<script setup lang="ts">
const { t } = useI18n()
</script>
