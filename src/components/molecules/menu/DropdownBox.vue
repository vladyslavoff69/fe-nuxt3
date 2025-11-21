<script lang="ts" setup>
const {
  classes = {
    root: '',
    chevronDownIcon: '',
    dropdownLabel: ''
  }
} = defineProps<{
  classes: {
    root: string,
    chevronDownIcon?: string,
    dropdownLabel?: string
  }
}>()
</script>
<template>
  <JHeightTransition
    v-slot="{ state, setState }"
    :initial-state="false"
  >
    <div
      :class="[
        classes.root,
        classes.dropdownLabel,
        {
          // 'bg-green-950': state
        }
      ]"
      class="text-lg relative cursor-pointer rounded-md py-2 px-3 group flex items-center justify-between"
      @click="setState(!state)"
    >
      <div
        class="flex items-center"
      >
        <div
          :class="[
            classes.dropdownLabel,
            !state &&
              'md:group-hover:text-white transition-all duration-150 ease-in-out'
          ]"
        >
          <slot name="dropdownLabel" />
        </div>
      </div>
      <div
        class="flex items-center"
      >
        <span
          :class="
            [
              state ? 'text-white' : 'text-paragraph group-hover:text-white',
              classes?.chevronDownIcon || ''
            ]
          "
          class="inline-block w-4 h-4 transition-all duration-150"
        >
          <UIcon
            v-if="state"
            class="w-4 h-4"
            name="i-heroicons-chevron-up-20-solid"
          />
          <UIcon
            v-else
            class="w-4 h-4"
            name="i-heroicons-chevron-down-20-solid"
          />
        </span>
      </div>
    </div>
    <template v-if="state">
      <slot name="dropdownContent" />
    </template>
  </JHeightTransition>
</template>
