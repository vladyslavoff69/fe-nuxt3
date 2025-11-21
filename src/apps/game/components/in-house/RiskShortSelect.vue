<script lang="ts" setup>
import { SHORT_RISKS } from '~/apps/game/constants'
import type { RiskShort } from '~/apps/game/types'

const { risk, disabled, labelText } = defineProps<{
  risk: string;
  disabled: boolean;
  labelText?: string;
}>()

const emits = defineEmits<{ (e: 'update:modelValue', value: RiskShort): void }>()

const { t } = useI18n()
const RiskShortItems = computed(() => {
  return SHORT_RISKS.map((rItem) => {
    return {
      ...rItem,
      label: rItem?.label ? t(rItem.label) : ''
    }
  })
})

const onUpdateModel = (v: string) => {
  emits('update:modelValue', v as RiskShort)
}
</script>

<template>
  <div class="w-full flex flex-col gap-y-1 hover:text-white">
    <label
      :class="[labelText ? labelText : '']"
      class="block text-sm font-bold hover:text-white leading-none"
    >
      {{ t('bets.risk') }}
    </label>

    <USelect
      :disabled="disabled"
      :items="RiskShortItems"
      :model-value="risk"
      class="w-full text-sm h-10 text-white bg-brand! leading-none"
      label-key="label"
      size="lg"
      value-key="value"
      @update:model-value="onUpdateModel"
    />
  </div>
</template>
