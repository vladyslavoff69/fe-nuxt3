<script lang="ts" setup>
import { AUTH, FREE_SPIN, GAME } from '~/constants'
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import { FREE_BET } from '~/apps/plinko/constants'
import { FREE_SPIN_ICON } from '~/icons'

const props = defineProps<{
  betMode: 'manual' | 'auto' | 'free'
  isIdle: boolean
}>()

const emits = defineEmits(['update:betMode'])

const { me, isLoggedIn } = inject(AUTH)!
const { cancelFreeBets, myFreeBets } = inject(FREE_SPIN)!
const { freeBetsRemaining } = inject(FREE_BET)!
const { paneCss } = inject(GAME)!
const { t } = useI18n()
const disabledTab = computed<boolean>(() => !props.isIdle)
const disabledFreeTab = computed<boolean>(() => (!isLoggedIn.value || !me.value || !myFreeBets.value || !freeBetsRemaining.value))
const enabledFreeTab = computed<boolean>(() => (freeBetsRemaining.value > 0 && !cancelFreeBets.value))
const tabs = computed(() => [
  {
    label: t('games.manual'),
    value: 'manual',
    disabled: disabledTab.value || enabledFreeTab.value,
  },
  {
    label: t('games.auto'),
    value: 'auto',
    disabled: disabledTab.value || enabledFreeTab.value,
  },
  {
    label: 'FS',
    value: 'free',
    disabled: disabledTab.value || disabledFreeTab.value,
  }
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
    class="h-full bg-green-950 bet-form-container"
    :class="[paneCss]"
  >
    <div
      class="flex flex-col-reverse lg:flex-col gap-3 lg:gap-4 p-3 lg:p-4 relative"
    >
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
            <UTooltip
              v-if="item?.value === 'free'"
              :content="{ side: 'top' }"
              arrow
              text="Win up to 100 Free Drops"
            >
              <span
                v-if="!!me && freeBetsRemaining > 0"
                class="flex items-center justify-center rounded-full bg-green-950 text-gold w-8 h-8 min-w-8 min-h-8 text-sm font-bold"
              >
                {{ freeBetsRemaining }}
              </span>
              <svg
                v-else
                class="w-6 h-6 min-w-6 min-h-6 text-white"
              >
                <use :href="FREE_SPIN_ICON" />
              </svg>
            </UTooltip>
            <span v-else>{{ item?.label || '' }}</span>
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
