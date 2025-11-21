<script lang="ts" setup>
import { SEGMENTS } from '~/apps/wheel/constants'

const {
  risk = 'low',
  segment = 0,
  selSegment = 1,
  segmentResultAngle = 0,
  selectedMultiplicationFactor = 0,
} = defineProps<{
  risk: string
  segment: number
  selSegment: number
  segmentResultAngle: number
  selectedMultiplicationFactor: number
}>()

const selectedSegment = computed(() => SEGMENTS[segment])
const selectedRisk = computed(() => selectedSegment.value?.risks[risk])
const distribution = computed(() => selectedRisk.value?.distribution)
const selectedValue = computed(() => selectedRisk.value?.order[(selSegment - 1)])
const selectedDistribution = computed(() => distribution.value?.[selectedValue])
const canvas = ref()
let ctx: any
const segments = ref()

const drawSegment = (
  startAngle: number,
  endAngle: number,
  color: string,
  centerX: number,
  centerY: number,
  radius: number
) => {
  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.arc(
    centerX,
    centerY,
    radius,
    (startAngle * Math.PI) / 180,
    (endAngle * Math.PI) / 180
  )
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
}

const drawWheel = () => {
  if (!canvas.value) {
    return
  }
  segments.value = []

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  const centerX = canvas.value.width / 2
  const centerY = canvas.value.height / 2
  const radius = Math.min(centerX, centerY)

  const order = selectedRisk.value.order
  // Calculate the percentage interval between each segment
  const interval = 360 / selectedSegment.value.number
  // Iterate through the order and pick colors accordingly
  order.forEach((segInd, index: number) => {
    const color = distribution.value[segInd].color
    const start = index * interval
    const end = start + interval

    // Add border per segment to prevent confusing for the same colors
    if (risk !== 'medium' && (index > 0 && segInd === order[index - 1])) {
      segments.value?.push({
        startAngle: start, endAngle: (start + 0.1), color: '#259F4F'
      })

      segments.value?.push({
        startAngle: start + 0.15, endAngle: end, color
      })
    } else {
      segments.value?.push({
        startAngle: start, endAngle: end, color
      })
    }
  })

  segments.value.forEach((segment) => {
    drawSegment(
      segment.startAngle - 90,
      segment.endAngle - 90,
      segment.color,
      centerX,
      centerY,
      radius
    )
  })
}

watch(() => [segment, risk], (v) => {
  if (v && v[0]) {
    if (canvas.value) {
      ctx = canvas.value.getContext('2d')
      drawWheel()
    }
  }
}, { immediate: true })

onMounted(() => {
  if (canvas.value && selectedSegment.value) {
    ctx = canvas.value.getContext('2d')
    drawWheel()
  }
})
</script>

<template>
  <div class="relative w-full h-full flex-1 flex flex-col items-center justify-center gap-2 lg:gap-6 bg-brand py-4">
    <div class="flex w-full h-[180px] justify-center">
      <div class="relative z-100 mx-auto w-full h-full px-0 max-w-[180px] max-h-[180px]">
        <div
          class="relative flex aspect-square w-full h-full justify-center rounded-full shadow-[0_.5rem_0_0_rgb(2_25_2/20%)]"
        >
          <NuxtImg
            src="1395fd79-e91f-4b3b-b1f8-99305cf71400/sm"
            provider="cloudflare"
            loading="lazy"
            alt="Wheel Indicator"
            class="absolute w-[9%] top-[-7.5%] z-100 h-auto object-contain transition-all duration-75 ease-in"
          />
          <div class="relative z-99 flex w-full h-full items-center justify-center">
            <div
              class="absolute inset-[13%] z-50 flex aspect-square items-center bg-brand justify-center rounded-full"
            >
              <div class="ResultNumber relative mx-2.5 flex h-14 items-center justify-center md:mx-5">
                <h5
                  class="text-2xl font-bold"
                  :class="{
                    'animate-scale-down text-ash': selectedMultiplicationFactor < 1,
                    'animate-scale-center': selectedMultiplicationFactor >= 1,
                  }"
                  :style="selectedMultiplicationFactor >= 1 ? { color: selectedDistribution?.color } : {}"
                >
                  {{ selectedMultiplicationFactor?.toFixed(2) }}×
                </h5>
              </div>
            </div>

            <i class="absolute inset-[12%] z-20 aspect-square rounded-full bg-green-950" />

            <div
              class="absolute inset-y-0 aspect-square origin-center w-full h-full"
              :style="`transform: rotate(0deg)`"
            >
              <div
                class="absolute inset-0 w-full h-full z-10 rounded-full"
                :style="`transform: rotate(${(360 - segmentResultAngle)}deg); image-rendering: auto;`"
              >
                <i class="absolute -inset-[1%] z-1 rounded-full bg-green-950" />
                <canvas
                  ref="canvas"
                  class="wheel-canvas absolute inset-0 z-20"
                  width="180px"
                  height="180px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wheel-canvas {
  width: 100%;
  height: 100%;
}
</style>
