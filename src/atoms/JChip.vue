<script lang="ts" setup>

const {
  variant = 'primary',
  size = 'md',
} = defineProps<{
  variant?: 'primary' | 'alternative' | 'dark' | 'transparent' | 'warn-gradient' | 'accent-gradient',
  size?: 'lg' | 'md' | 'sm' | 'xs',
}>()

const buttonClass = computed(() => {
  const variantToClassMap = {
    primary: 'bg-primary text-white',
    'accent-gradient': 'bg-accent-gradient text-white',
    'warn-gradient': 'bg-warn-gradient text-black',
    alternative: 'bg-border text-white',
    dark: 'bg-brand text-white',
    secondary: 'bg-highlights text-white',
    transparent: 'bg-transparent',
  }
  return [
    variantToClassMap[variant],
  ]
})
const buttonSizeClass = computed(() => {
  const sizeToClassMap = {
    lg: 'p-3 rounded-full',
    md: 'p-2 rounded-full',
    sm: 'px-2 py-1 rounded-full',
    xs: 'px-3 py-1.5 sm:px-2 sm:py-1 rounded-full',
  }
  return sizeToClassMap[size]
})
</script>

<template>
  <div
    :class="[
      buttonClass,
      buttonSizeClass,
    ]"
    class="
      uppercase flex items-center relative
      transition-all ease-in duration-150
      text-center text-xs font-bold tracking-tight
    "
    style="box-shadow: 0.779px 0.779px 10.126px 0 rgba(28, 207, 89, 0.50);"
  >
    <div
      class="flex items-center leading-none"
    >
      <slot name="startIcon" />
      <slot />
    </div>
  </div>
</template>
