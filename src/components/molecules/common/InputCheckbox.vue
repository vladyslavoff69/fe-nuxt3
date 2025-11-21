<script lang="ts" setup>
const {
  modelValue = false,
  rect = '16px',
  disabled = false,
  isRadio = false
} = defineProps<{
  modelValue: boolean;
  rect?: string;
  disabled?: boolean;
  isRadio?: boolean
}>()
const emit =
  defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
  }>()

const handleToggleCheck = () => {
  if (disabled) {
    return
  }

  emit('update:modelValue', !modelValue)
}
</script>
<template>
  <JbCheckboxLabel
    :class="{'cursor-not-allowed opacity-60': disabled}"
    :model-value="modelValue"
    @update:model-value="handleToggleCheck"
  >
    <template #checkbox>
      <div class="flex items-start">
        <JbCheckbox
          :model-value="modelValue"
          :rect="rect"
          :disabled="disabled"
        />
      </div>
    </template>
    <slot />
  </JbCheckboxLabel>
</template>
