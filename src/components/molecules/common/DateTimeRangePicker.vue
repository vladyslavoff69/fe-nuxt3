<script lang="ts" setup>
import { DatePicker as VCalendarDatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'
import { THEME } from '~/constants'
import type { DatePickerModel } from 'v-calendar/dist/types/src/use/datePicker'

const props = defineProps({
  modelValue: [Date, Object, String] as PropType<DatePickerModel | null>
})

const emit = defineEmits(['update:model-value', 'close'])
const { screen } = inject(THEME)!
const range = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:model-value', value)
    emit('close')
  }
})

const attrs = {
  transparent: true,
  borderless: true,
  mode: 'datetime',
  color: 'primary',
  'is-dark': { selector: 'html', darkClass: 'dark' },
  'first-day-of-week': 2,
  is24hr: false,
  hideTimeHeader: true
}
</script>

<template>
  <UPopover
    :content="{ side: screen.md ? 'bottom' : 'top' }"
  >
    <slot name="trigger" />
    <template #content>
      <VCalendarDatePicker
        v-model.range="range"
        v-bind="{ ...attrs, ...$attrs }"
      />
    </template>
  </UPopover>
</template>

<style lang="scss" src="~/assets/css/components/datepicker.scss"></style>
