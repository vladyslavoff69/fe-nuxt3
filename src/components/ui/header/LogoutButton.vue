<script lang="ts" setup>
const { loading: logoutLoading, logout } = useLogout()

const { t } = useI18n()
</script>

<template>
  <JbBlankButton
    :loading="logoutLoading"
    class="items-center py-2 pl-4 gap-x-2 text-sm font-bold text-white"
    @click="logout"
  >
    <UIcon
      class="h-5 w-5 min-w-5 min-h-5"
      name="heroicons:arrow-right-on-rectangle-20-solid"
    />
    <span>{{ t('auth.logout') }}</span>
  </JbBlankButton>
</template>
