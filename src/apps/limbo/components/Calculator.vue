<script lang="ts" setup>
import MultiplierInput from '~/components/molecules/inputs/MultiplierInput.vue'
import ChanceInput from '~/components/molecules/inputs/ChanceInput.vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 2,
  },
  lock: {
    type: Boolean,
    default: false,
  },
})

const emits =
  defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
  }>()

const { t } = useI18n()
const winChance = computed<number>(() => 99 / props.modelValue)

const handleTargetChange = (value: string | number) => {
  emits('update:modelValue', Number(Number(value).toFixed(4)))
}

const handleWinChance = (value: string | number) => {
  emits('update:modelValue', 99 / Number(value))
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
      >{{ t('bets.target-multiplier') }}</label>
      <MultiplierInput
        id="calculator-multiplier"
        :max="1000000"
        :min="1.01"
        :model-value="Number(modelValue.toFixed(2))"
        :lock="lock"
        :to-fixed="2"
        class-name="pr-6! hover:ring-1 hover:ring-highlights focus:ring-1 focus:ring-highlights pl-2 lg:pl-3"
        end-icon="right-2! lg:right-3!"
        @update:model-value="handleTargetChange"
      />
    </div>
    <div class="flex-1">
      <label
        class="block mb-1 text-sm font-bold leading-none"
        for="calculator-chance"
      >{{ t('games.win-chance') }}</label>
      <ChanceInput
        id="calculator-chance"
        :max="98.01980198"
        :min="0.000099"
        :model-value="winChance ? Number(winChance.toFixed(8)) : ''"
        :lock="lock"
        :to-fixed="8"
        class-name="pr-6! hover:ring-1 hover:ring-highlights focus:ring-1 focus:ring-highlights pl-2 lg:pl-3"
        end-icon="right-2! lg:right-3!"
        @update:model-value="handleWinChance"
      />
    </div>
  </div>
</template>
