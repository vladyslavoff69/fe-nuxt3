<script lang="ts" setup>
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'

const {
  modelValue = false,
  disabled = false,
  translate = 'translate-x-6',
  switchOffBg = 'bg-brand'
} = defineProps<{
  modelValue: boolean,
  disabled?: boolean,
  translate?: string,
  classes?: {
    SwitchLabel?: string,
    SwitchButton?: string,
    SwitchInner?: string,
    Inner?: string,
  },
  switchOffBg?: string
}>()
const emit = defineEmits(['update:modelValue'])

const enabled = computed({
  get () {
    return modelValue
  },
  set (newVal) {
    emit('update:modelValue', newVal)
  },
})

</script>

<template>
  <SwitchGroup>
    <div
      class="flex items-center relative gap-x-2"
      :class="[classes?.Inner]"
    >
      <Switch
        v-model="enabled"
        :class="[
          enabled ? 'bg-highlights' : ['ring-1 ring-alternative-hover', switchOffBg],
          classes?.SwitchButton
        ]"
        :disabled="disabled"
        class="relative flex h-6 w-11 items-center rounded-full"
      >
        <span
          :class="[
            enabled ? translate : 'translate-x-[3px]',
            classes?.SwitchInner
          ]"
          class="inline-block h-4 w-4 transform rounded-full bg-white transition"
        />
      </Switch>
      <SwitchLabel
        :class="[classes?.SwitchLabel]"
        class="text-sm font-bold"
      >
        <slot name="SwitchLabel" />
      </SwitchLabel>
    </div>
  </SwitchGroup>
</template>
