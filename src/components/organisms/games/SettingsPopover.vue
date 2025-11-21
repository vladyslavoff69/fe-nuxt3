<script lang="ts" setup>
import SettingsControls from '~/components/organisms/games/SettingsControls.vue'
import { THEME } from '~/constants'

const { t } = useI18n()
const { screen } = inject(THEME)!
const openPopover = ref(false)
</script>

<template>
  <UPopover
    v-model:open="openPopover"
    :content="{ side: 'top' }"
    :arrow="screen.md"
    class="h-5 w-5 lg:h-6 lg:w-6 min-w-5 min-h-5 lg:min-w-6 lg:min-h-6 p-0"
    @click.stop
  >
    <UTooltip
      :content="{ side: 'left' }"
      arrow
      :text="t('games.tool-settings')"
    >
      <UIcon
        class="h-5 w-5 lg:h-6 lg:w-6 min-w-5 min-h-5 lg:min-w-6 lg:min-h-6 hover:text-white"
        name="heroicons:cog-8-tooth-20-solid"
        @click.stop
      />
    </UTooltip>

    <template #content>
      <SettingsControls
        :open="openPopover"
        @close="openPopover = false"
      />
    </template>
  </UPopover>
</template>
