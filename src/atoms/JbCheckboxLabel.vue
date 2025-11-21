<script lang="ts" setup>
const {
  modelValue = false
} = defineProps<{
  modelValue: boolean;
}>()

const emit =
  defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
  }>()

const handleToggleCheck = () => {
  emit('update:modelValue', !modelValue)
}
</script>
<template>
  <label
    class="flex justify-start items-center select-none cursor-pointer hover:border-primary gap-2"
    @click="handleToggleCheck"
  >
    <slot name="checkbox" />
    <slot />
  </label>
</template>
