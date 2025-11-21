<script lang="ts" setup>
const {
  dayHidden = false,
  labelHidden = false,
  fontSize = 'text-[28px]',
  remainTimeString
} = defineProps<{
  dayHidden?: boolean;
  remainTimeString: string;
  labelHidden?: boolean;
  fontSize?: string;
}>()

const emits = defineEmits<{
  (e: 'timer:end'): void;
}>()

const { t } = useI18n()
const remainTime = ref(remainTimeString)
const { onEndTimeout, timeLeftItems } = useCountDown(remainTime)
onEndTimeout(() => emits('timer:end'))
</script>
<template>
  <div
    :class="dayHidden? 'grid-cols-3' : 'grid-cols-4'"
    class="CountDown bg-brand rounded-md grid text-center divide-x-0 sm:divide-x-2 py-4 divide-border max-w-full w-auto"
  >
    <div
      v-if="!dayHidden"
      class="flex flex-col gap-0.5 sm:gap-1.5 md:gap-2.5 items-center px-0.5 sm:px-1.5 md:px-2.5"
    >
      <span
        class="font-bold text-white"
        :class="[fontSize]"
      >
        {{ timeLeftItems.days }}
      </span>
      <span
        v-if="!labelHidden"
        class="text-paragraph font-semibold text-center text-xs md:text-sm"
      >
        {{ t('vip.days') }}
      </span>
    </div>
    <div class="flex flex-col gap-0.5 sm:gap-1.5 md:gap-2.5 items-center px-0.5 sm:px-1.5 md:px-2.5">
      <div class="flex flex-row gap-0.5 sm:gap-1 w-[28%] justify-center">
        <span
          class="font-bold text-white"
          :class="[fontSize]"
        >
          {{ Math.floor(timeLeftItems.hours / 10) }}
        </span>
        <span
          class="font-bold text-white"
          :class="[fontSize]"
        >
          {{ timeLeftItems.hours % 10 }}
        </span>
      </div>
      <span
        v-if="!labelHidden"
        class="text-paragraph font-semibold text-center text-xs md:text-sm"
      >
        {{ t('vip.hours') }}
      </span>
    </div>
    <div class="flex flex-col gap-0.5 sm:gap-1.5 md:gap-2.5 items-center px-0.5 sm:px-1.5 md:px-2.5">
      <div class="flex flex-row gap-0.5 sm:gap-1 w-[28%] justify-center">
        <span
          class="font-bold text-white"
          :class="[fontSize]"
        >
          {{ Math.floor(timeLeftItems.minutes / 10) }}
        </span>
        <span
          class="font-bold text-white"
          :class="[fontSize]"
        >
          {{ timeLeftItems.minutes % 10 }}
        </span>
      </div>
      <span
        v-if="!labelHidden"
        class="text-paragraph font-semibold text-center text-xs md:text-sm"
      >
        {{ t('vip.minutes') }}
      </span>
    </div>
    <div class="flex flex-col gap-0.5 sm:gap-1.5 md:gap-2.5 items-center px-0.5 sm:px-1.5 md:px-2.5">
      <div class="flex flex-row gap-0.5 sm:gap-1 w-[28%] justify-center">
        <span
          class="font-bold text-white"
          :class="[fontSize]"
        >
          {{ Math.floor(timeLeftItems.seconds / 10) }}
        </span>
        <span
          class="font-bold text-white"
          :class="[fontSize]"
        >
          {{ timeLeftItems.seconds % 10 }}
        </span>
      </div>
      <span
        v-if="!labelHidden"
        class="text-paragraph font-semibold text-center text-xs md:text-sm"
      >
        {{ t('vip.seconds') }}
      </span>
    </div>
  </div>
</template>
