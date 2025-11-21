<script lang="ts" setup>
import { PLINKO_GAME } from '~/apps/plinko/constants'

defineProps<{
  disabled: boolean;
}>()

const { t } = useI18n()
const { maxBooster } = inject(PLINKO_GAME)!

const clickBoostButton = (side: 'default' | 'left' | 'right') => {
  maxBooster.value = maxBooster.value === side ? 'default' : side
}
</script>

<template>
  <div class="w-auto flex flex-col gap-2">
    <div class="flex items-center gap-x-1 hover:text-white">
      <div class="w-auto">
        {{ t('bets.max-booster') }}
      </div>
      <UTooltip
        :content="{ side: 'top' }"
        arrow
        class="w-4 h-4"
        text="Boost your multiplier on the left or right side"
      >
        <UIcon
          class="w-4 h-4 min-h-4 min-w-4 -mt-1 text-paragraph hover:text-white cursor-help"
          name="i-heroicons-information-circle-20-solid"
        />
      </UTooltip>
    </div>
    <div class="flex items-center w-full gap-x-2">
      <JButton
        :button-class="maxBooster !== 'left' ? 'bg-green-1000' : 'bg-primary hover:bg-primary focus:bg-primary active:bg-primary text-white'"
        :disabled="disabled"
        class="min-w-24 h-10 w-full block"
        variant="alternative"
        @click="clickBoostButton('left')"
      >
        <template #startIcon>
          <UIcon
            v-if="maxBooster !== 'left'"
            class="w-4 h-4 min-h-4 min-w-4 cursor-pointer"
            name="ion:flash-off-sharp"
          />
          <UIcon
            v-else
            class="w-4 h-4 min-h-4 min-w-4 cursor-pointer text-white"
            name="ion:flash-sharp"
          />
        </template>
        {{ t('base.left') }}
      </JButton>
      <JButton
        :button-class="maxBooster !== 'right' ? 'bg-green-1000' : 'bg-primary hover:bg-primary focus:bg-primary active:bg-primary text-white'"
        :disabled="disabled"
        class="min-w-24 h-10 w-full block"
        variant="alternative"
        @click="clickBoostButton('right')"
      >
        <template #startIcon>
          <UIcon
            v-if="maxBooster !== 'right'"
            class="w-4 h-4 min-h-4 min-w-4 cursor-pointer"
            name="ion:flash-off-sharp"
          />
          <UIcon
            v-else
            class="w-4 h-4 min-h-4 min-w-4 cursor-pointer text-white"
            name="ion:flash-sharp"
          />
        </template>
        {{ t('base.right') }}
      </JButton>
    </div>
  </div>
</template>
