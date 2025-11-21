<script lang="ts" setup>
import { AUTH, CREATE_USER, LOGIN } from '~/constants'

const { t } = useI18n()
const { openAuthModal } = inject(AUTH)!
</script>

<template>
  <div class="flex items-center gap-x-3">
    <JButton
      class="py-1! px-3 md:px-6 text-xs md:text-sm md:h-9! bg-brand"
      variant="outline"
      @click="openAuthModal(LOGIN)"
    >
      {{ t('auth.login') }}
    </JButton>
    <JButton
      class="py-1! px-3 md:px-6 text-xs md:text-sm md:h-9!"
      variant="primary"
      @click="openAuthModal(CREATE_USER)"
    >
      {{ t('auth.register') }}
    </JButton>
  </div>
</template>
