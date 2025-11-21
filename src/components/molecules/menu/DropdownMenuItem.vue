<script lang="ts" setup>
import { MenuItem } from '@headlessui/vue'

defineProps<{
  loading?: boolean,
  disabled?: boolean,
  classes?: {
    ButtonClass?: string,
  }
}>()
</script>

<template>
  <MenuItem v-slot="{ active }">
    <button
      :class="[
        classes?.ButtonClass,
        active ? 'bg-border text-white' : 'text-paragraph',
      ]"
      :disabled="disabled || loading"
      class="
        group flex w-full items-center rounded-md px-2 py-2 text-sm gap-x-2
        outline-hidden ring-0 hover:ring-0 focus:outline-hidden focus:ring-0 active:outline-hidden active:ring-0
        disabled:opacity-50 disabled:cursor-not-allowed disabled:text-disabled-paragraph
      "
    >
      <slot name="startIcon" />
      <span class="flex flex-col justify-center gap-y-0.5">
        <span
          class="text-xs leading-none"
        >
          <slot name="labelCap" />
        </span>
        <span
          class="text-sm font-bold text-left leading-none"
        >
          <slot name="label" />
        </span>
      </span>
    </button>
  </MenuItem>
</template>
