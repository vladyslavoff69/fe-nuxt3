<script lang="ts" setup>
const {
  border = true,
  modelValue = '',
  placeholder = '',
  background = 'bg-form-input',
  className = ''
} = defineProps<{
  border?: boolean;
  modelValue: string | number;
  background?: string;
  placeholder?: string;
  className?: string;
}>()

const emits = defineEmits<{
    (e: 'update:modelValue', value: string): void;
  }>()

const { t } = useI18n()
const searchWord = ref(modelValue)
</script>

<template>
  <JInput
    v-model="searchWord"
    :classes="{
      Input: [
        'rounded-full! px-3 py-2! h-10! text-sm font-semibold',
        className,
        border ? 'border-border' : '',
        background
      ]
    }"
    :placeholder="placeholder !== '' ? placeholder : t('base.search')"
    @update:model-value="(value) => emits('update:modelValue', value.toLocaleString())"
  >
    <template #startIcon>
      <UIcon
        class="w-5 h-4"
        name="heroicons:magnifying-glass-20-solid"
      />
    </template>
  </JInput>
</template>
