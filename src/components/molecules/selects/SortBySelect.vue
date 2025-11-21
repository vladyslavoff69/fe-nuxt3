<script lang="ts" setup>
import type { SortBy } from '~/types'

type SortItem = {
  label: string
  value: string | number
  icon: string
  iconType: string
}

defineProps<{
  modelValue: SortBy;
  options?: SortItem[]
}>()

defineEmits<{
  (e: 'update:modelValue', v: SortBy): void;
}>()

</script>
<template>
  <JSelect
    :classes="{
      ListboxButton: `min-w-[100px] ml-auto rounded-md text-xs font-bold px-3 pr-1 py-2 lg:py-2`,
      Placeholder: 'text-xs',
      LabelOptLabel: 'text-xs font-bold leading-3'
    }"
    :has-check-box="false"
    :model-value="modelValue"
    :options="options || []"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
