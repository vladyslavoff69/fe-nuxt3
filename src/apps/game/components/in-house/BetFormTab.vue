<script lang="ts" setup>
import { GAME } from '~/constants'
import { useAutoAnimate } from '@formkit/auto-animate/vue'

const props = defineProps<{
  betMode: 'manual' | 'auto'
  isIdle: boolean
}>()

const emits = defineEmits(['update:betMode'])

const { paneCss } = inject(GAME)!
const { t } = useI18n()
const disabledTab = computed<boolean>(() => !props.isIdle)
const tabs = computed(() => [
  {
    label: t('games.manual'),
    value: 'manual',
    disabled: disabledTab.value,
  },
  {
    label: t('games.auto'),
    value: 'auto',
    disabled: disabledTab.value,
  },
])

const currentTab = computed({
  get () {
    const index = tabs.value?.findIndex((item: any) => item.value === props.betMode)
    if (index === -1) {
      return 'manual'
    }

    return props.betMode
  },
  set (v) {
    if (disabledTab.value) {
      return
    }

    emits('update:betMode', v)
  },
})

const [tabParent] = useAutoAnimate({
  duration: 150,
})
</script>

<template>
  <div
    :class="[paneCss]"
    class="h-full bg-green-950 bet-form-container"
  >
    <div class="flex flex-col-reverse lg:flex-col gap-3 lg:gap-4 p-3 lg:p-4 relative">
      <UTabs
        v-model="currentTab"
        :items="tabs"
        size="xl"
      >
        <template #default="{ item }">
          <span
            :class="{
              'text-white': item.value === currentTab
            }"
            class="text-center w-full z-1 font-bold text-sm leading-none!"
          >
            {{ item?.label || '' }}
          </span>
        </template>
      </UTabs>

      <div
        v-if="disabledTab"
        class="w-full h-16 absolute z-5 cursor-not-allowed bottom-0 lg:top-0"
      />

      <div
        ref="tabParent"
        class="flex flex-col-reverse lg:flex-col gap-3 lg:gap-4"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
