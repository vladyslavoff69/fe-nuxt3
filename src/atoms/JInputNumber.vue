<script lang="ts" setup>
const {
  modelValue,
  error = false,
  readonly = false,
  lock = false,
  toCut = null,
  toFixed = 2,
  type = 'number',
  notAllowed = ['e', '-', '+'],
  min
} = defineProps<{
  modelValue: string | number;
  error?: boolean;
  readonly?: boolean;
  toFixed?: number | undefined;
  toCut?: number | undefined;
  lock?: boolean;
  className?: string;
  endIcon?: string;
  startIcon?: string;
  min?: number;
  type?: string;
  notAllowed?: any;
}>()

const emits =
  defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
    (e: 'focus'): void;
    (e: 'blur'): void;
  }>()

const elRef = ref()
const blurred = ref<boolean>(true)
const localValue = ref<number | string>(
  toFixed && modelValue !== ''
    ? Number(modelValue).toFixed(toFixed)
    : modelValue,
)

const handleUpdateValue = (value: string | number) => {
  if (min && Number(value) < min) {
    value = min
  }

  localValue.value = value
  emits('update:modelValue', value)
}

const handleFocus = () => {
  blurred.value = false
  elRef.value.inputRef.select()
  emits('focus')
}

const handleBlur = () => {
  blurred.value = true
  if (toFixed) {
    if (localValue.value !== '') {
      if (toCut) {
        localValue.value = Number(Number(localValue.value).toFixed(toCut)).toFixed(toFixed)
      } else {
        localValue.value = Number(localValue.value).toFixed(toFixed)
      }
    } else {
      localValue.value = 0.00
    }
  }

  emits('blur')
}

watch(
  () => modelValue,
  (v) => {
    if (toFixed) {
      if (Number(localValue.value) !== Number(v)) {
        if (toCut) {
          localValue.value = Number(Number(v).toFixed(toCut)).toFixed(toFixed)
        } else {
          localValue.value = Number(v).toFixed(toFixed)
        }
      }
    } else if (Number(localValue.value) !== Number(v)) {
      localValue.value = v
    }
  }
)

defineExpose<{
  el: Ref<HTMLElement | undefined>;
}>({
  el: elRef,
})

const $slots = useSlots()
const startIconExists = computed(() => !!$slots.startIcon)
const endIconExists = computed(() => !!$slots.endIcon)
</script>

<template>
  <JBInput
    ref="elRef"
    :classes="{
      Input: `peer focus:ring-1 focus:ring-highlights disabled:ring-0! font-bold! ${className}`,
      EndIcon: endIcon,
      StartIcon: startIcon,
    }"
    :disabled="lock"
    :error="error"
    :model-value="localValue"
    :readonly="readonly"
    :type="type"
    :min="min"
    :not-allowed="notAllowed"
    variant="none"
    @blur="handleBlur"
    @focus="handleFocus"
    @update:model-value="handleUpdateValue"
  >
    <template
      v-if="startIconExists"
      #startIcon
    >
      <slot name="startIcon" />
    </template>
    <slot />
    <template
      v-if="endIconExists"
      #endIcon
    >
      <slot name="endIcon" />
    </template>
  </JBInput>
</template>
