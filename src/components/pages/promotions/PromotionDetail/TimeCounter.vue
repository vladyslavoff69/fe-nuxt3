<script lang="ts" setup>
const { promoEndDate } = defineProps<{
  promoEndDate: string | null
}>()

const { t } = useI18n()
const timerId = ref()
const now = ref(new Date())
const countDownDateObj: any = computed(() => {
  const currentDate = new Date(now.value)
  if (!promoEndDate) {
    return {}
  }

  const endDate = new Date(promoEndDate)

  const differenceMs = endDate.getTime() - currentDate.getTime()
  if (differenceMs > 0) {
    const days = Math.floor(differenceMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((differenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((differenceMs % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((differenceMs % (1000 * 60)) / 1000)
    return {
      days,
      hours,
      minutes,
      seconds
    }
  } else {
    clearInterval(timerId.value)
  }
})

onMounted(() => {
  timerId.value = setInterval(() => {
    now.value = new Date()
  }, 1000)

  return () => clearInterval(timerId.value)
})
</script>

<template>
  <div
    class="flex w-full max-w-none md:max-w-sm bg-green-950 rounded-md px-4 py-1 justify-between items-center h-16"
  >
    <div class="w-16 text-center">
      <h2 class="text-lg font-bold text-white">
        {{ countDownDateObj?.days || '00' }}
      </h2>
      <p class="text-xxs uppercase font-semibold leading-4 tracking-[0.635px]">
        {{ t('charity.days') }}
      </p>
    </div>
    <div class="w-px h-12 bg-border" />
    <div class="w-16 text-center">
      <h2 class="text-lg font-bold text-white">
        {{ countDownDateObj?.hours || '00' }}
      </h2>
      <p class="text-xxs uppercase font-semibold leading-4 tracking-[0.635px]">
        {{ t('charity.hours') }}
      </p>
    </div>
    <div class="w-px h-12 bg-border" />
    <div class="w-16 text-center">
      <h2 class="text-lg font-bold text-white">
        {{ countDownDateObj?.minutes || '00' }}
      </h2>
      <p class="text-xxs uppercase font-semibold leading-4 tracking-[0.635px]">
        {{ t('charity.minutes') }}
      </p>
    </div>
    <div class="w-px h-12 bg-border" />
    <div class="w-16 text-center">
      <h2 class="text-lg  font-bold text-white">
        {{ countDownDateObj?.seconds || '00' }}
      </h2>
      <p class="text-xxs uppercase font-semibold leading-4 tracking-[0.635px]">
        {{ t('base.seconds') }}
      </p>
    </div>
  </div>
</template>
