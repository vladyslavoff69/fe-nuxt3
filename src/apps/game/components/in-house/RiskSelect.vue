<script lang="ts" setup>
import { RISKS } from '~/apps/game/constants'
import type { Risk } from '~/apps/game/types'

const props = defineProps<{
  risk: string;
  disabled: boolean;
}>()

const emits = defineEmits<{ (e: 'update:modelValue', value: Risk): void }>()

const { t } = useI18n()
const RiskItems = computed(() => {
  return RISKS.map((rItem) => {
    return {
      ...rItem,
      label: rItem?.label ? t(rItem.label) : ''
    }
  })
})

const onUpdateModel = (v: string) => {
  emits('update:modelValue', v as Risk)
}
</script>

<template>
  <div class="w-full flex flex-col gap-y-1">
    <label class="block text-sm font-bold text-paragraph leading-none">
      {{ t('bets.risk') }}
    </label>

    <USelect
      :disabled="disabled"
      :items="RiskItems"
      :model-value="props.risk"
      class="w-full text-sm h-10 text-white bg-brand! leading-none"
      label-key="label"
      size="lg"
      value-key="value"
      @update:model-value="onUpdateModel"
    />
  </div>
</template>
