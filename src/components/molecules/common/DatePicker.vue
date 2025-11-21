<script lang="ts" setup>
import { DatePicker as VCalendarDatePicker } from 'v-calendar'
import type { DatePickerDate, DatePickerRangeObject } from 'v-calendar/dist/types/src/use/datePicker'
import 'v-calendar/dist/style.css'
import { THEME } from '~/constants'

const props = defineProps({
  modelValue: {
    type: [Date, Object, String] as PropType<DatePickerDate | DatePickerRangeObject | null | string>,
    default: null
  }
})

const emit = defineEmits(['update:model-value', 'close'])
const { screen } = inject(THEME)!
const date = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:model-value', value)
    emit('close')
  }
})

const attrs = {
  transparent: true,
  borderless: true,
  mode: 'date',
  color: 'primary',
  'is-dark': { selector: 'html', darkClass: 'dark' },
  'first-day-of-week': 2,
}
</script>

<template>
  <UPopover
    :content="{ side: screen.md ? 'bottom' : 'top' }"
  >
    <slot name="trigger" />
    <template #content>
      <VCalendarDatePicker
        v-model="date"
        v-bind="{ ...attrs, ...$attrs }"
      />
    </template>
  </UPopover>
</template>

<style lang="scss" src="~/assets/css/components/datepicker.scss"></style>
