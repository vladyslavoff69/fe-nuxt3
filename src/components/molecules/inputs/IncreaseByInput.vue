<script lang="ts" setup>
const { lock = false, reset = true } = defineProps<{
  modelValue: number | '';
  lock?: boolean;
  reset?: boolean;
  className?: string;
  endIcon?: string;
}>()

const emits =
  defineEmits<{
    (e: 'update:modelValue', value: number | ''): void;
    (e: 'update:reset', value: boolean | ''): void;
  }>()

const { t } = useI18n()
const handleOption = (value: boolean) => {
  emits('update:reset', value)
}

const handleAmount = (val: number | string) => {
  if (Number(val) < 0) {
    val = 0
  }

  emits('update:modelValue', Number(val))
}

const handleReset = () => {
  handleOption(true)
  emits('update:modelValue', 0)
}
</script>

<template>
  <div class="w-full flex items-center gap-2">
    <div class="flex items-center gap-x-1 bg-brand px-2 md:px-3 h-10 rounded-md flex-1 w-1/2">
      <JButton
        class="z-10 duration-150 min-h-5! py-0.5! min-w-9"
        size="sm"
        type="button"
        variant="alternative"
        @click="handleReset"
      >
        {{ t('base.reset') }}
      </JButton>

      <JbBlankButton
        :class="{
          'text-white': !reset && !lock
        }"
        class="z-10 duration-150 min-h-5! py-0.5! min-w-9 hover:text-white font-bold text-xs text-nowrap"
        type="button"
        @click="handleOption(false)"
      >
        {{ t('bets.increase-by') }}
      </JbBlankButton>
    </div>
    <JInputNumber
      :class-name="className"
      :end-icon="endIcon"
      :model-value="modelValue"
      :lock="lock || reset"
      :min="0"
      variant="none"
      @update:model-value="handleAmount"
    >
      <template #endIcon>
        <div
          :class="{
            'text-white': !lock && !reset,
            'text-paragraph': lock || reset
          }"
          class="flex h-full items-center"
        >
          <UIcon
            class="w-3.5 h-3.5 md:w-4 md:h-4"
            name="ic:baseline-percent"
          />
        </div>
      </template>
    </JInputNumber>
  </div>
</template>
