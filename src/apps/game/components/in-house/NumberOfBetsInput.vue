<script lang="ts" setup>
const props = defineProps<{
  numberOfBets: string | number
  isIdle: boolean
}>()

const emits = defineEmits<{ (e: 'update:modelValue', value: string | number): void }>()

const { t } = useI18n()
const onUpdateModel = (v: string | number) => {
  if (Number(v) < 0) {
    v = 0
  }

  emits('update:modelValue', Number(v))
}

const handleInfinity = () => {
  if (props.isIdle) {
    onUpdateModel(0)
  }
}
</script>

<template>
  <div class="w-full flex flex-col gap-y-1">
    <label
      class="block text-sm font-bold text-paragraph leading-none"
      for="bets-count-input"
    >
      {{ t('games.number-of-bets') }}
    </label>

    <JInputNumber
      id="bets-count-input"
      :lock="!props.isIdle"
      :min="0"
      :model-value="props.numberOfBets"
      :step="1"
      :to-fixed="0"
      class-name="pr-6! h-10! hover:ring-1 hover:ring-highlights focus:ring-1 focus:ring-highlights pl-2 lg:pl-3"
      end-icon="right-2! lg:right-3!"
      @update:model-value="onUpdateModel"
    >
      <template #endIcon>
        <div
          :class="{
            'opacity-75 text-paragraph': !props.isIdle
          }"
          class="flex items-center cursor-pointer hover:text-white"
        >
          <UIcon
            class="w-3.5 h-3.5 lg:w-4 lg:h-4"
            name="ph:infinity-bold"
            @click="handleInfinity"
          />
        </div>
      </template>
    </JInputNumber>
  </div>
</template>
