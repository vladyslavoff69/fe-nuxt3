<script lang="ts" setup>
import { GAME } from '@/constants'
import { SEGMENTS, WHEEL_GAME } from '~/apps/wheel/constants'
import WheelResult from '~/apps/wheel/components/WheelResult.vue'
import WheelPayout from '~/apps/wheel/components/WheelPayout.vue'

const { instantMode } = inject(GAME)!
const {
  segment,
  risk,
  initialRotationDegree,
  segmentResultAngle,
  selectedMultiplicationFactor,
  selectedDistribution,
  betCryptoAmount,
  isSpinning
} = inject(WHEEL_GAME)!

const selectedSegment = computed(() => SEGMENTS[segment.value])
const selectedRisk = computed(() => selectedSegment.value.risks[risk.value])
const distribution = computed(() => selectedRisk.value.distribution)
const canvas = ref(null)
let ctx = null
const segments = ref([])

const drawSegment = (startAngle, endAngle, color, centerX, centerY, radius) => {
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
  order.forEach((segInd, index) => {
    const color = distribution.value[segInd].color
    const start = index * interval
    const end = start + interval

    // Add border per segment to prevent confusing for the same colors
    if (risk.value !== 'medium' && (index > 0 && segInd === order[index - 1])) {
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

watch(() => [segment.value, risk.value], () => {
  if (canvas.value) {
    ctx = canvas.value.getContext('2d')
    drawWheel()
  }
}, { immediate: true })

onMounted(() => {
  if (canvas.value) {
    ctx = canvas.value.getContext('2d')
    drawWheel()
  }
})
</script>

<template>
  <div class="relative w-full h-full flex-1 flex flex-col items-center justify-center gap-2 lg:gap-6">
    <div class="flex w-full min-h-[180px] justify-center lg:min-h-[300px]">
      <div class="relative z-100 mx-auto w-[85%] h-[85%] md:w-[50%] md:h-[50%] px-0 lg:mx-0 lg:w-full lg:max-w-[530px] lg:h-full lg:max-h-[530px]">
        <div
          class="relative flex aspect-square w-full h-full justify-center rounded-full shadow-[0_.5rem_0_0_rgb(2_25_2/20%)]"
        >
          <NuxtImg
            src="1395fd79-e91f-4b3b-b1f8-99305cf71400/sm"
            provider="cloudflare"
            loading="lazy"
            alt="Wheel Indicator"
            class="absolute w-[9%] top-[-7.5%] z-100 h-auto object-contain transition-all duration-75 ease-in"
            :class="{
              '-rotate-45': isSpinning
            }"
            :style="{
              'transform-origin': isSpinning ? '48% 35%' : 'center center'
            }"
          />
          <div class="relative z-99 flex w-full h-full items-center justify-center">
            <div
              class="absolute inset-[9%] z-50 flex aspect-square items-center bg-brand justify-center rounded-full"
            >
              <WheelResult
                v-if="selectedDistribution"
                :value="selectedMultiplicationFactor"
              />
            </div>

            <i class="absolute inset-[8%] z-20 aspect-square rounded-full bg-green-950" />

            <div
              class="absolute inset-y-0 aspect-square origin-center w-full h-full"
              :style="`transform: rotate(${initialRotationDegree}deg)`"
            >
              <div
                class="absolute inset-0 w-full h-full z-10 rounded-full"
                :class="{
                  'transform-gpu transition-transform duration-900 ease-[cubic-bezier(0,.4,0,1)]': !instantMode,
                }"
                :style="`transform: rotate(${segmentResultAngle}deg); image-rendering: auto;`"
              >
                <i class="absolute -inset-[1%] z-1 rounded-full bg-green-950" />
                <canvas
                  ref="canvas"
                  class="wheel-canvas absolute inset-0 z-20"
                  width="400px"
                  height="400px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full h-12 flex items-center justify-center">
      <ClientOnly>
        <WheelPayout
          :segment="segment"
          :risk="risk"
          :distribution="distribution"
          :selected-multiplication-factor="selectedMultiplicationFactor"
          :segments-count="selectedRisk.order.length"
          :bet-amount="betCryptoAmount"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
.wheel-canvas {
  width: 100%;
  height: 100%;
}
</style>
