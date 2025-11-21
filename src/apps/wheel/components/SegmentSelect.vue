<script lang="ts" setup>
import { SEGMENT_NUMBERS } from '~/apps/game/constants'
import type { Segment } from '~/apps/game/types'

const { segment, disabled } = defineProps<{
  disabled: boolean;
  segment: Segment;
}>()

const emits = defineEmits<{ (e: 'update:modelValue', value: Segment): void }>()

const { t } = useI18n()

const onUpdateModel = (v: number) => {
  emits('update:modelValue', v as Segment)
}
</script>

<template>
  <div class="w-full flex flex-col gap-y-1">
    <label class="block text-sm font-bold text-paragraph leading-none">
      {{ t('casino.segments') }}
    </label>

    <USelect
      :model-value="segment"
      :disabled="disabled"
      :items="SEGMENT_NUMBERS"
      class="w-full text-sm h-10 text-white bg-brand! leading-none"
      label-key="label"
      value-key="value"
      size="lg"
      @update:model-value="onUpdateModel"
    />
  </div>
</template>
