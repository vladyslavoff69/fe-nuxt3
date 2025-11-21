<script lang="ts" setup>
import { THEME } from '~/constants'

const {
  modelValue = 0,
  lock = false,
} = defineProps<{
  modelValue: number | string;
  lock?: boolean;
  className?: string;
  endIcon?: string;
}>()
const emits = defineEmits<{ (e: 'update:modelValue', value: number): void }>()

const { t } = useI18n()
const { screen } = inject(THEME)!
const switchRoll = () => {
  if (lock) {
    return
  }
  const value = (100 - Number(modelValue)).toFixed(2)
  emits('update:modelValue', Number(value))
}
</script>

<template>
  <div
    class="cursor-pointer disable-focus focus:ring-transparent"
    @click="switchRoll"
  >
    <JInputNumber
      :class-name="className"
      :end-icon="endIcon"
      :max="98"
      :min="0.01"
      :model-value="modelValue"
      :lock="lock"
      readonly
      variant="none"
    >
      <template #endIcon>
        <div class="flex h-full items-center">
          <UTooltip
            :content="{ side: 'top' }"
            :arrow="screen.md"
          >
            <template #content>
              <div class="font-bold text-xs md:text-sm px-1.5 py-1">
                {{ t('bets.flip-the-rollover-under') }}
              </div>
            </template>

            <JbBlankButton>
              <UIcon
                class="w-3.5 h-3.5 md:w-4 md:h-4 text-white"
                name="jam:refresh"
              />
            </JbBlankButton>
          </UTooltip>
        </div>
      </template>
    </JInputNumber>
  </div>
</template>
<style scoped>
.disable-focus:focus-within div .disable-focus div:focus {
  outline: none;
}
</style>
