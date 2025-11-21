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
  isDice = false,
  toFixed = 4,
  rollOver = false
} = defineProps<{
  modelValue: number | string;
  lock?: boolean;
  min?: number;
  max?: number;
  readonly?: boolean;
  toFixed?: number;
  className?: string;
  endIcon?: string;
  isDice?: boolean;
  rollOver?: boolean;
}>()

const emits =
  defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
    (e: 'handle:blur'): void;
  }>()

const { t } = useI18n()
const { screen } = inject(THEME)!
const focused = ref<boolean>(true)
const blurred = ref<boolean>(false)
const mouseEnterShow = ref<boolean>(false)
const store = useGameSettingStore()
const localValue = ref<number>(Number(modelValue))
const isPlayable = () => {
  if (v$.value.localValue.$error) {
    store.setGamePlayable({ multiplier: false })
  } else {
    store.setGamePlayable({ multiplier: true })
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

const houseEdge = 1
const handleUpdateValue = async (value: string | number) => {
  localValue.value = Number(value)
  await v$.value.localValue.$validate()
  isPlayable()
  if (!focused.value) {
    if (isDice) {
      let target: number
      if (rollOver) {
        target = 100 - (100 - houseEdge) / Number(value)
      } else {
        target = (100 - houseEdge) / Number(value)
      }
      target = Math.round(target * 100) / 100
      const winChance = (rollOver ? 100 - target : target)
      localValue.value = Number(((100 - houseEdge) / winChance).toFixed(4))
    }

    emits('update:modelValue', localValue.value)
  }
}

const handleBlur = async () => {
  blurred.value = true
  focused.value = false
  mouseEnterShow.value = false
  localValue.value = Number(localValue.value)
  await v$.value.localValue.$validate()

  if (localValue.value || localValue.value === 0) {
    if (v$.value.localValue.minValue.$invalid) {
      localValue.value = Number(min)
    } else if (v$.value.localValue.maxValue.$invalid) {
      localValue.value = Number(max)
    }

    await handleUpdateValue(localValue.value)
  }

  emits('handle:blur')
}

const handleFocus = () => {
  blurred.value = false
  focused.value = true
  mouseEnterShow.value = true
}

const handleMouseEnter = () => {
  focused.value = true
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
  (val) => {
    if (Number(Number(val).toFixed(fixedLength.value)) !== localValue.value) {
      localValue.value = Number(val)
    }

    v$.value.localValue.$validate()
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
        :step="0.0001"
        :to-fixed="toFixed"
        placeholder="0.0000"
        variant="none"
        @blur="handleBlur"
        @focus="handleFocus"
        @update:model-value="handleUpdateValue"
      >
        <template #endIcon>
          <div
            class="flex h-full items-center"
          >
            <UIcon
              class="w-3.5 h-3.5 md:w-4 md:h-4 text-white"
              name="heroicons:x-mark-20-solid"
            />
          </div>
        </template>
      </JInputNumber>
      <template #content>
        <div
          class="font-bold text-red-600 text-xs md:text-sm px-1.5 py-1"
        >
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
