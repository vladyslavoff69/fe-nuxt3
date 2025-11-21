<script lang="ts" setup>
import { LOADING_ICON } from '~/components/symbols'

const {
  variant = 'primary',
  size = 'md',
  shape = 'square',
  align = 'center',
  loading = false,
  disabled = false,
  buttonClass = '',
  labelClass = 'justify-center gap-x-2 text-center',
} = defineProps<{
  variant?: 'primary' | 'alternative' | 'outline' | 'transparent' | 'accent-gradient' | 'bet-gradient' | 'tab' | any,
  size?: 'lg' | 'md' | 'sm' | 'xs',
  shape?: 'square' | 'circle',
  align?: 'center' | 'left',
  loading?: boolean,
  disabled?: boolean,
  labelClass?: string,
  buttonClass?: string,
  buttonSizeClass?: string,
  alignClass?: string,
}>()

const emits = defineEmits<{
  (e: 'mouseup'): void;
  (e: 'pointerup'): void;
}>()

const handleUp = () => {
  emits('mouseup')
  emits('pointerup')
}

const isHovered = ref(false)

const buttonCls = computed(() => {
  const variantToClassMap = {
    tab: 'bg-primary text-white hover:bg-highlights focus:bg-highlights active:bg-highlights',
    primary: 'bg-primary text-brand before:absolute before:inset-0 before:border-0 before:border-brand before:duration-100 before:ease-linear hover:bg-brand hover:text-primary hover:before:border-25 ring-1 ring-primary',
    'accent-gradient': 'before:ease bg-accent-gradient text-brand before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-full before:rotate-6 before:bg-white before:opacity-20 before:duration-700 hover:before:-translate-x-96',
    'bet-gradient': 'before:ease bg-bet-gradient text-brand active:text-white before:absolute before:right-0 before:top-0 before:h-12 before:w-12 before:translate-x-full before:rotate-6 before:bg-white before:opacity-20 before:duration-700 hover:before:-translate-x-96 active:before:-translate-x-96',
    alternative: 'bg-green-950 text-paragraph hover:text-white hover:bg-border focus:bg-border active:bg-border disabled:red',
    'alternative-light': 'bg-[#1D391D] text-paragraph hover:text-white hover:bg-border focus:bg-border active:bg-border disabled:red',
    outline: 'border border-primary text-primary before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:m-auto before:h-0 before:w-0 before:rounded-md before:bg-primary before:duration-200 before:ease-out hover:text-brand hover:before:h-40 hover:before:w-full',
    transparent: 'bg-transparent',
  }

  return [
    variantToClassMap[variant],
    {
      'hover:text-white': variant === 'transparent',
    },
    {
      'ring-0 hover:ring-0 focus:ring-0 active:ring-0': ['accent-gradient', 'bet-gradient', 'alternative', 'transparent'].includes(variant),
    },
    buttonClass
  ]
})

const buttonSizeClass = computed(() => {
  const sizeToClassMap = {
    lg: shape === 'square' ? 'px-3 py-3 text-sm rounded-md' : 'p-3 text-sm rounded-full',
    md: shape === 'square' ? 'px-2 py-2 text-sm rounded-md' : 'p-2 text-sm rounded-full',
    sm: shape === 'square' ? 'px-2 py-2 text-xs rounded-md' : 'p-1 text-xs rounded-full',
    xs: shape === 'square' ? 'px-1 py-1 text-xxs rounded-md' : 'p-1 text-xxs rounded-full',
  }
  return sizeToClassMap[size]
})

const alignClass = computed(() => {
  const alignToClassMap = {
    center: 'justify-center',
    left: '',
  }
  return alignToClassMap[align]
})

const buttonRef = ref<HTMLElement>()
defineExpose<{
  buttonRef: Ref<HTMLElement | undefined>;
}>({
  buttonRef,
})
</script>

<template>
  <button
    ref="buttonRef"
    class="
      relative overflow-hidden flex justify-center items-center transition-all
      ease-in duration-150 outline-hidden focus:outline-hidden active:outline-hidden disabled:opacity-50
      disabled:cursor-not-allowed disabled:text-disabled-paragraph text-center font-bold
    "
    :class="[
      buttonCls,
      buttonSizeClass,
      alignClass
    ]"
    :disabled="disabled || loading"
    type="button"
    @mouseout="isHovered = false"
    @mouseover="isHovered = true"
    @mouseup="handleUp"
    @pointerup="handleUp"
  >
    <span
      class="flex items-center w-full z-1 relative h-full"
      :class="[
        { 'hidden': loading }
      ]"
    >
      <span
        class="flex items-center w-full font-bold"
        :class="[
          labelClass
        ]"
      >
        <slot name="startIcon" />
        <slot />
      </span>
      <slot name="endIcon" />
    </span>
    <span
      v-if="loading"
      class="w-full flex items-center justify-center min-w-5 min-h-5"
      @click.prevent
    >
      <svg
        :class="{
          'text-paragraph': ['outline', 'alternative', 'transparent'].includes(variant),
          'text-border': !['outline', 'alternative', 'transparent'].includes(variant),
        }"
        class="animate-spin w-4 h-4"
      >
        <use :href="LOADING_ICON" />
      </svg>
    </span>
  </button>
</template>
