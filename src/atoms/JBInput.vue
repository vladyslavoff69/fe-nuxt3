<script lang="ts" setup>
const {
  modelValue,
  type = 'text',
  placeholder = '',
  step = 0.00000001,
  error = false,
  readonly = false,
  disabled = false,
  variant = 'outline',
  notAllowed = ['e', '-', '+'],
  max,
  min,
} = defineProps<{
  type?: string,
  modelValue: string | number | null,
  placeholder?: string,
  variant?: string,
  classes?: {
    Input?: string | string[],
    EndIcon?: string,
    StartIcon?: string,
  } | undefined,
  error?: boolean,
  readonly?: boolean,
  step?: number,
  disabled?: boolean,
  max?: number;
  min?: number;
  notAllowed?: any;
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'focus'): void;
  (e: 'blur'): void;
}>()

const inputRef = ref<HTMLElement | null>(null)
const isFocused = ref<boolean>(false)

const handleWheel = (e: Event) => {
  if (
    !(type === 'number' && isFocused.value) ||
    disabled || readonly) {
    return
  }

  e.preventDefault()
  e.stopPropagation()
  let value = Number(modelValue)
  // @ts-ignore
  if (e.deltaY < 0) {
    value++
    if (max && value > max) {
      value = max
    }
  } else {
    value--
    if (min && value < min) {
      value = min
    }
  }

  emits('update:modelValue', value)
}

const onInput = (e: Event) => {
  emits('update:modelValue', (e.target as HTMLInputElement).value)
}

const preventSpecialCharacters = (event: any) => {
  if (type === 'number') {
    if (notAllowed.includes(event.key)) {
      event.preventDefault()
    }
  }
}

const $slots = useSlots()

const startIconExists = computed(() => !!$slots.startIcon)
const endIconExists = computed(() => !!$slots.endIcon)

defineExpose<{
  inputRef: Ref<HTMLElement | null>;
}>({
  inputRef,
})

const onBlurInput = () => {
  isFocused.value = false
  emits('blur')
}

const onFocusInput = () => {
  isFocused.value = true
  emits('focus')
}
</script>

<template>
  <div
    class="relative w-full transition duration-150 ease-in-out text-paragraph"
  >
    <div
      :class="[{
        'text-red-600!': error,
        'hidden': !(startIconExists),
      }, classes?.StartIcon || '']"
      class="
        flex items-center absolute
        min-w-10 h-full left-0 top-0 w-auto
        box-border
      "
    >
      <div class="w-full flex items-center justify-center">
        <slot name="startIcon" />
      </div>
    </div>
    <input
      ref="inputRef"
      class="
        block w-full h-9 px-2 py-3
        text-white font-inter bg-brand
        rounded-md outline-hidden border-none
        transition duration-150 ease-in-out
        focus:outline-hidden focus:shadow-none
        disabled:cursor-not-allowed disabled:text-paragraph
      "
      :class="[{
        'ring-1 ring-inset ring-border focus:ring-1 focus:ring-highlights hover:ring-highlights': variant === 'outline',
        'ring-1 ring-red-600! text-red-600! focus:ring-red-600 hover:ring-red-600': error,
        'pl-10': startIconExists,
        'pr-10': endIconExists,
      }, classes?.Input || '']"
      :disabled="disabled"
      :max="max"
      :min="min"
      :placeholder="placeholder"
      :readonly="readonly"
      :step="step"
      :type="type"
      :value="modelValue"
      @blur="onBlurInput"
      @focus="onFocusInput"
      @input="onInput"
      @keydown="preventSpecialCharacters"
      @wheel="handleWheel"
    >
    <div
      :class="[{
        'text-red-600!': error,
        'hidden': !(endIconExists),
      }, classes?.EndIcon || '']"
      class="
        flex items-center
        absolute right-3 md:right-4 top-0 bottom-0 h-full
        box-border min-w-4
      "
    >
      <slot name="endIcon" />
    </div>
  </div>
</template>

<style scoped>
::placeholder {
  opacity: 1; /* Firefox */
  color: #ACCCAC;
}

::-ms-input-placeholder { /* Edge 12 -18 */
  color: #ACCCAC;
}
</style>
