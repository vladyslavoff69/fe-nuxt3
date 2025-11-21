<script lang="ts" setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'

const {
  modelValue = '',
  options = [],
  placeholder = '',
  hasCheckBox = true,
  optIconPlacement = 'left',
  optionAttribute = 'label',
  valueAttribute = 'value',
  variant = 'fill',
  endSlotAttribute = '',
  classes
} = defineProps<{
  modelValue: string | number,
  options?: any;
  placeholder?: string;
  optIconPlacement?: 'left' | 'right' | 'none'
  optionAttribute?: string;
  valueAttribute?: string;
  endSlotAttribute?: string;
  variant?: 'fill' | 'none';
  hasCheckBox?: boolean;
  classes?: {
    ListboxButton?: string,
    ListboxOptions?: string,
    StartIcon?: string,
    EndIcon?: string,
    LabelStartIcon?: string,
    Placeholder?: string,
    LabelOptLabel?: string,
    Option?: string,
    ChevronDownIcon?: string,
  } | undefined;
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()
const $slots = useSlots()

const startIconExists = computed(() => !!$slots.startIcon)

const selectedVal = ref(modelValue)

const selectedOpt = computed(() => {
  return options.filter(item => item[valueAttribute] === modelValue)[0] || {}
})

const putStartIcon = computed(() => {
  return (startIconExists.value || selectedOpt.value.icon) && optIconPlacement === 'left'
})
const putEndIcon = computed(() => {
  return (startIconExists.value || selectedOpt.value.icon) && optIconPlacement === 'right'
})

const bgClass = computed(() => {
  if (variant === 'fill') {
    return 'bg-green-950 hover:bg-border focus:bg-border active:bg-border'
  }
  return 'bg-transparent'
})

watch(
  () => selectedVal.value,
  (_selectedVal) => {
    emits('update:modelValue', _selectedVal)
  },
  {
    immediate: true,
  },
)

</script>
<template>
  <div class="w-full">
    <ClientOnly>
      <Listbox v-model="selectedVal">
        <div class="relative w-full">
          <ListboxButton
            class="
              w-full min-h-9 relative flex justify-between items-center leading-none! cursor-pointer rounded-md
              shadow-md p-2 pr-0.5 focus:outline-hidden focus-visible:border-indigo-500 focus-visible:ring-2
              focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300
              text-left md:text-sm hover:text-white
            "
            :class="[bgClass, classes?.ListboxButton || '']"
          >
            <div class="flex-1 flex items-center overflow-hidden truncate">
              <template v-if="putStartIcon">
                <div
                  :class="classes?.StartIcon"
                  class="flex items-center h-full box-border min-w-4 mr-1"
                >
                  <template v-if="selectedOpt.icon">
                    <UIcon
                      v-if="selectedOpt?.iconType && selectedOpt.iconType === 'ui'"
                      :name="selectedOpt.icon || ''"
                    />
                    <svg
                      v-else-if="selectedOpt?.iconType && selectedOpt.iconType === 'symbol'"
                      :class="classes?.LabelStartIcon"
                      class="w-4 h-4"
                    >
                      <use :href="selectedOpt.icon" />
                    </svg>
                  </template>
                  <slot
                    v-else
                    name="startIcon"
                  />
                </div>
              </template>
              <slot name="placeholder">
                <div
                  :class="[
                    classes?.Placeholder || ''
                  ]"
                  class="w-full flex items-center truncate text-sm leading-none"
                >
                  <span>{{ selectedOpt[optionAttribute] || placeholder }}</span>
                </div>
              </slot>
            </div>
            <div
              :class="[ classes?.ChevronDownIcon ]"
              class="flex items-center"
            >
              <UIcon
                class="
                  h-6 w-6 text-paragraph hover:text-white focus:text-white
                  relative bottom-px pointer-events-none
                "
                name="i-heroicons-chevron-down-20-solid"
              />
              <template v-if="putEndIcon">
                <div
                  :class="classes?.EndIcon"
                  class="flex items-center h-full right-2.5 box-border min-w-4 top-0"
                >
                  <slot name="endIcon" />
                </div>
              </template>
            </div>
          </ListboxButton>

          <Transition
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ListboxOptions
              class="
                listbox absolute z-1001 mt-1 py-1 max-h-60 w-full overflow-auto rounded-md bg-green-950
                shadow-lg ring-1 ring-brand/5 focus:outline-hidden text-base md:text-sm
              "
              :class="[classes?.ListboxOptions || '']"
            >
              <ListboxOption
                v-for="(opt, idx) in options"
                :key="`js-2-${idx}`"
                v-slot="{ active, selected }"
                :value="opt[valueAttribute]"
                as="template"
              >
                <li
                  :class="[
                    active ? 'bg-border' : '',
                    {'text-white': selected},
                    classes?.Option,
                  ]"
                  class="flex items-center justify-between relative cursor-pointer select-none py-1.5 md:py-2.5 px-3 hover:text-white pr-1"
                >
                  <div class="flex-1 flex items-center w-full gap-x-1">
                    <span v-if="opt.icon && opt.icon !== ''">
                      <svg
                        v-if="opt.iconType === 'symbol'"
                        :class="classes?.LabelStartIcon"
                        class="w-4 h-4"
                      >
                        <use :href="opt.icon" />
                      </svg>
                      <UIcon
                        v-else-if="opt.iconType === 'ui'"
                        :name="opt.icon || ''"
                      />
                    </span>
                    <span
                      :class="[
                        classes?.LabelOptLabel || ''
                      ]"
                      class="block text-xs font-bold leading-[14px] capitalize"
                    >{{ opt[optionAttribute] }}</span>
                  </div>
                  <div
                    v-if="endSlotAttribute !== ''"
                    class="text-xxs"
                  >
                    {{ opt[endSlotAttribute] }}
                  </div>
                  <UIcon
                    v-if="selected && hasCheckBox"
                    class="h-5 w-5 min-h-5 min-w-5 text-white"
                    name="i-heroicons-check-16-solid"
                  />
                </li>
              </ListboxOption>
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </ClientOnly>
  </div>
</template>
