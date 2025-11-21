<script lang="ts" setup>
import type { Row } from '~/apps/game/types'

const props = defineProps<{
  row: number;
  disabled: boolean;
  labelText?: string;
}>()

const emits = defineEmits<{ (e: 'update:modelValue', value: Row): void }>()

const { t } = useI18n()
const RowItems = computed(() => {
  return [...Array(9)].map((v, r) => {
    return {
      value: r + 8,
      label: `${r + 8}`
    }
  })
})

const onUpdateModel = (v: number) => {
  emits('update:modelValue', v as Row)
}
</script>

<template>
  <div class="w-full flex flex-col gap-y-1 hover:text-white">
    <label
      :class="[labelText ? labelText : '']"
      class="block text-sm font-bold hover:text-white leading-none"
    >
      {{ t('bets.row') }}
    </label>

    <USelect
      :disabled="disabled"
      :model-value="props.row"
      :items="RowItems"
      class="w-full text-sm h-10 text-white bg-brand! leading-none"
      label-key="label"
      size="lg"
      value-key="value"
      @update:model-value="onUpdateModel"
    />
  </div>
</template>
