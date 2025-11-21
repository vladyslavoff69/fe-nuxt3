<script lang="ts" setup>
import MultiplierInput from '~/components/molecules/inputs/MultiplierInput.vue'
import ChanceInput from '~/components/molecules/inputs/ChanceInput.vue'
import RollInput from '~/components/molecules/inputs/RollInput.vue'

const {
  modelValue = 50,
  max = 9900,
  min = 1.0102,
  lock = false,
  readonly = false,
  rollOver = false,
} = defineProps<{
  modelValue: number;
  max?: number;
  min?: number;
  rollOver: boolean;
  lock?: boolean;
  readonly?: boolean;
}>()

const emits =
  defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
    (e: 'update:rollOver', value: boolean): void;
  }>()

const { t } = useI18n()
const houseEdge = 1
const rollValue = computed<number>(() => Number(modelValue || 50))
const winChance = computed<number>(() => (rollOver ? 100 - rollValue.value : rollValue.value))
const multiplier = computed<number>(() => Number(((100 - houseEdge) / winChance.value).toFixed(4)))

const handleMultiplierChange = (v: string | number) => {
  let target: number
  if (rollOver) {
    target = 100 - (100 - houseEdge) / Number(v)
  } else {
    target = (100 - houseEdge) / Number(v)
  }

  console.log('target', target)
  emits('update:modelValue', target)
}

const handleRollOverChange = (v: number) => {
  emits('update:modelValue', Number(v))
  emits('update:rollOver', !rollOver)
}

const handleWinChanceChange = (v: string | number) => {
  let target: number
  if (rollOver) {
    target = 100 - Number(v)
  } else {
    target = Number(v)
  }

  emits('update:modelValue', target)
}

const handleInputBlur = () => {
  handleWinChanceChange(Number(winChance.value?.toFixed(2)))
}
</script>

<template>
  <div
    class="
      w-full p-3 lg:p-4 flex items-center justify-center flex-wrap gap-3 lg:gap-4 bg-green-950 rounded
    "
  >
    <div class="flex-1">
      <label
        class="block mb-1 text-sm font-bold leading-none"
        for="calculator_multiplier"
      >
        {{ t('bets.target-multiplier') }}
      </label>
      <MultiplierInput
        id="calculator-multiplier"
        :is-dice="true"
        :lock="lock"
        :max="max"
        :min="min"
        :model-value="multiplier"
        :readonly="readonly"
        :roll-over="rollOver"
        class-name="pr-6! hover:ring-1 hover:ring-highlights focus:ring-1 focus:ring-highlights pl-2 lg:pl-3"
        end-icon="right-2! lg:right-3!"
        @update:model-value="handleMultiplierChange"
        @handle:blur="handleInputBlur"
      />
    </div>
    <div class="flex-1">
      <label
        class="block mb-1 text-sm font-bold leading-none"
        for="calculator-roll-over"
      >{{ rollOver ? t('bets.rollover') : t('bets.rollunder') }}</label>
      <RollInput
        id="calculator-roll-over"
        :lock="lock"
        :model-value="rollValue.toFixed(2)"
        class-name="pr-6! hover:ring-1 hover:ring-highlights focus:ring-1 focus:ring-highlights pl-2 lg:pl-3"
        end-icon="right-2! lg:right-3!"
        @update:model-value="handleRollOverChange"
      />
    </div>
    <div class="flex-1">
      <label
        class="block mb-1 text-sm font-bold leading-none"
        for="calculator-chance"
      >{{ t('games.win-chance') }}</label>
      <ChanceInput
        id="calculator-chance"
        :lock="lock"
        :max="98"
        :min="0.01"
        :model-value="Number(winChance).toFixed(2)"
        :readonly="readonly"
        :to-cut="2"
        :to-fixed="4"
        class-name="pr-6! hover:ring-1 hover:ring-highlights focus:ring-1 focus:ring-highlights pl-2 lg:pl-3"
        end-icon="right-2! lg:right-3!"
        @update:model-value="handleWinChanceChange"
      />
    </div>
  </div>
</template>
