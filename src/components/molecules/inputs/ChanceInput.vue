<script lang="ts" setup>
import { maxValue, minValue, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { useGameSettingStore } from '~/store/games/settings'
import { THEME } from '~/constants'

const {
  modelValue = 0,
  lock = false,
  min = 0,
  max = 0,
  readonly = false,
  toFixed = 4,
} = defineProps<{
  modelValue: number | string;
  lock?: boolean;
  min?: number;
  max?: number;
  readonly?: boolean;
  toFixed?: number;
  toCut?: number;
  className?: string;
  endIcon?: string;
}>()

const emits =
  defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
  }>()

const { t } = useI18n()
const { screen } = inject(THEME)!
const blurred = ref<boolean>(true)
const mouseEnterShow = ref<boolean>(false)
const store = useGameSettingStore()
const localValue = ref<number>(Number(modelValue))
const isPlayable = () => {
  if (v$.value.localValue.$error) {
    store.setGamePlayable({ chance: false })
  } else {
    store.setGamePlayable({ chance: true })
  }
}
const rules = computed(() => {
  return {
    localValue: {
      required,
      minValue: minValue(min),
      maxValue: maxValue(max),
    },
  }
})
const v$ = useVuelidate(rules, { localValue })
const isConstraint = computed(() => {
  return !(max === 0 && min === 0)
})

const fixedLength = computed<number>(() =>
  localValue.value?.toString()?.split('.')[1]
    ? localValue.value?.toString()?.split('.')[1].length
    : 0
)

const handleUpdateValue = async (value: string | number) => {
  localValue.value = Number(value)
  await v$.value.localValue.$validate()
  isPlayable()
  emits('update:modelValue', value)
}

const handleBlur = async () => {
  blurred.value = true
  mouseEnterShow.value = false
  localValue.value = Number(localValue.value)
  await v$.value.localValue.$validate()

  if (localValue.value || localValue.value === 0) {
    if (v$.value.localValue.minValue.$invalid) {
      localValue.value = Number(min)
    } else if (v$.value.localValue.maxValue.$invalid) {
      localValue.value = Number(max)
    }

    emits('update:modelValue', localValue.value)
  }
}

const handleFocus = () => {
  blurred.value = false
  mouseEnterShow.value = true
}

const handleMouseEnter = () => {
  if (blurred.value) {
    mouseEnterShow.value = true
  }
}

const handleMouseLeave = () => {
  if (blurred.value) {
    mouseEnterShow.value = false
  }
}

watch(
  () => modelValue,
  async (val) => {
    if (Number(Number(val).toFixed(fixedLength.value)) !== localValue.value) {
      localValue.value = Number(val)
    }
    await v$.value.localValue.$validate()
    isPlayable()
  }
)
</script>

<template>
  <div
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <UTooltip
      :content="{ side: 'top' }"
      :arrow="screen.md"
      :prevent="!(v$.localValue.$error && isConstraint && (!blurred || mouseEnterShow))"
    >

      <JInputNumber
        :class-name="className"
        :end-icon="endIcon"
        :error="v$.localValue.$error && isConstraint && blurred"
        :model-value="localValue"
        :readonly="readonly"
        :lock="lock"
        :step="0.01"
        :to-fixed="toFixed"
        :to-cut="toCut"
        placeholder="0.00"
        variant="none"
        @blur="handleBlur"
        @focus="handleFocus"
        @update:model-value="handleUpdateValue"
      >
        <template #endIcon>
          <div class="flex h-full items-center">
            <UIcon
              class="w-3.5 h-3.5 md:w-4 md:h-4 text-white"
              name="ic:baseline-percent"
            />
          </div>
        </template>
      </JInputNumber>
      <template #content>
        <div class="font-bold text-red-600 text-xs md:text-sm px-1.5 py-1">
          {{
            v$.localValue.minValue.$invalid
              ? `${t('errors.MIN_IS')} ${min}`
              : `${t('errors.MAX_IS')} ${max}`
          }}
        </div>
      </template>
    </UTooltip>
  </div>
</template>
