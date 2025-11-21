<script lang="ts" setup>
const props =
  defineProps<{
    remainTimeString: string;
  }>()
const emits =
  defineEmits<{
    (e: 'timer:end'): void;
  }>()

const { t } = useI18n()
const { onEndTimeout, timeLeftItems } = useCountDown(toRef(props, 'remainTimeString'))
onEndTimeout(() => emits('timer:end'))
</script>
<template>
  <div class="CountDownInterval bg-brand rounded-md grid text-center divide-x-2 py-4 divide-border max-w-full w-auto grid-cols-3">
    <div class="flex flex-col gap-2.5 items-center px-2.5">
      <div class="flex flex-row gap-[5px] w-[28%] justify-center">
        <span class="text-[28px] font-bold text-white">
          {{ Math.floor(timeLeftItems.hours / 10) }}
        </span>
        <span class="text-[28px] font-bold text-white">
          {{ timeLeftItems.hours % 10 }}
        </span>
      </div>
      <span class="text-paragraph font-semibold text-center text-xs md:text-sm">{{ t('vip.hours') }}</span>
    </div>

    <div class="flex flex-col gap-2.5 items-center px-2.5">
      <div class="flex flex-row gap-[5px] w-[28%] justify-center">
        <span class="text-[28px] font-bold text-white">
          {{ Math.floor(timeLeftItems.minutes / 10) }}
        </span>
        <span class="text-[28px] font-bold text-white">
          {{ timeLeftItems.minutes % 10 }}
        </span>
      </div>
      <span class="text-paragraph font-semibold text-center text-xs md:text-sm">{{ t('vip.minutes') }}</span>
    </div>

    <div class="flex flex-col gap-2.5 items-center px-2.5">
      <div class="flex flex-row gap-[5px] w-[28%] justify-center">
        <span class="text-[28px] font-bold text-white">
          {{ Math.floor(timeLeftItems.seconds / 10) }}
        </span>
        <span class="text-[28px] font-bold text-white">
          {{ timeLeftItems.seconds % 10 }}
        </span>
      </div>
      <span class="text-paragraph font-semibold text-center text-xs md:text-sm">
        {{ t('vip.seconds') }}
      </span>
    </div>
  </div>
</template>
