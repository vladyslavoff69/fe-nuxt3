<script lang="ts" setup>
import { RangeSlider } from '~/services/libs/range-slider'

const {
  modelValue = 50,
  rollOver = true,
  result = false
} = defineProps<{
  modelValue?: number,
  rollOver?: boolean,
  result?: boolean,
}>()
const emits = defineEmits<{ (e: 'update:modelValue', value: string | number): void }>()

const { play: playAudio } = useAudio('/assets/audio/game/tick.mp3')
watch(() => modelValue, () => {
  playAudio()
})
const marks = [0, 25, 50, 75, 100]
const handleRangeValue = (value: number) => {
  emits('update:modelValue', value)
}
</script>

<template>
  <div class="dice-range-slider w-full">
    <div class="px-4">
      <div class="flex justify-between">
        <div
          v-for="mark of marks"
          :key="`dice-mark-${mark}`"
          class="w-8 flex flex-col items-center"
        >
          <div class="text-sm lg:text-base text-white font-bold">
            {{ mark }}
          </div>
          <div
            class="overflow-hidden lg:w-4 lg:h-2.5 w-2.5 h-2 flex justify-center items-end -mb-0.5"
          >
            <div class="flex-none h-0 w-0 border-x-8 border-x-transparent border-b-8 lg:border-b-11 border-b-border" />
          </div>
        </div>
      </div>
    </div>

    <div
      :class="{ 'border-[6px] p-1': result, 'p-1 lg:p-2.5 border-8 lg:border-16': !result }"
      class="rounded-full bg-brand border-border relative w-full"
    >
      <RangeSlider
        :max="98"
        :min="2"
        :model-value="modelValue"
        @update:model-value="handleRangeValue"
      >
        <div
          :class="[
            rollOver ? 'bg-primary' : 'bg-accent-gradient',
            { 'h-2.5': result, 'h-2.5 lg:h-4': !result }
          ]"
          class="rounded-full relative z-0"
        >
          <div class="absolute -inset-2.5" />
        </div>
        <template #process>
          <div
            :class="[
              rollOver ? 'bg-accent-gradient' : 'bg-primary',
              { 'h-2.5': result, 'h-2.5 lg:h-4': !result }
            ]"
            class="rounded-full z-10"
          />
        </template>
        <template #dot>
          <div
            :class="{ 'w-6 h-6': result, 'w-6 h-6 lg:w-10 lg:h-10': !result }"
            class="cursor-grab active:cursor-grabbing p-1 bg-brand rounded-md flex items-center justify-center"
          >
            <div
              :class="{ 'w-4 h-4': result, 'w-4 h-4 lg:w-6 lg:h-6': !result }"
              class="bg-white"
            />
          </div>
        </template>
      </RangeSlider>
    </div>
  </div>
</template>
