<script lang="ts" setup>
import { KENO_GAME } from '~/apps/keno/constants'
import Calculator from '~/apps/keno/components/Calculator.vue'
import { COLOR_KENO_HITS } from '~/icons'
import { useAutoAnimate } from '@formkit/auto-animate/vue'

const { openedTiles, selectedTiles, risk, resultNumbers } = inject(KENO_GAME)!
const el = ref()
const { width } = useElementSize(el)
const histArray = [
  {
    risk: 'classic',
    hitsValues: [
      [0, 3.96],
      [0, 1.9, 4.5],
      [0, 1, 3.1, 10.4],
      [0, 0.8, 1.8, 5, 22.5],
      [0, 0.25, 1.4, 4.1, 16.5, 36],
      [0, 0, 1, 3.68, 7, 16.5, 40],
      [0, 0, 0.47, 3, 4.5, 14, 31, 60],
      [0, 0, 0, 2.2, 4, 13, 22, 55, 70],
      [0, 0, 0, 1.55, 3, 8, 15, 44, 60, 85],
      [0, 0, 0, 1.4, 2.25, 4.5, 8, 17, 50, 80, 100],
    ],
  },
  {
    risk: 'low',
    hitsValues: [
      [0.7, 1.85],
      [0, 2, 3.8],
      [0, 1.1, 1.38, 26],
      [0, 0, 2.2, 7.9, 90],
      [0, 0, 1.5, 4.2, 13, 300],
      [0, 0, 1.1, 2, 6.2, 100, 700],
      [0, 0, 1.1, 1.6, 3.5, 15, 225, 700],
      [0, 0, 1.1, 1.5, 2, 5.5, 39, 100, 800],
      [0, 0, 1.1, 1.3, 1.7, 2.5, 7.5, 50, 250, 1000],
      [0, 0, 1.1, 1.2, 1.3, 1.8, 3.5, 13, 50, 250, 1000],
    ],
  },
  {
    risk: 'medium',
    hitsValues: [
      [0.4, 2.75],
      [0, 1.8, 5.1],
      [0, 0, 2.8, 50],
      [0, 0, 1.7, 10, 100],
      [0, 0, 1.4, 4, 14, 390],
      [0, 0, 0, 3, 9, 180, 710],
      [0, 0, 0, 2, 7, 30, 400, 800],
      [0, 0, 0, 2, 4, 11, 67, 400, 900],
      [0, 0, 0, 2, 2.5, 5, 15, 100, 500, 1000],
      [0, 0, 0, 1.6, 2, 4, 7, 26, 100, 500, 1000],
    ],
  },
  {
    risk: 'high',
    hitsValues: [
      [0, 3.96],
      [0, 0, 17.1],
      [0, 0, 0, 81.5],
      [0, 0, 0, 10, 259],
      [0, 0, 0, 4.5, 48, 450],
      [0, 0, 0, 0, 11, 350, 710],
      [0, 0, 0, 0, 7, 90, 400, 800],
      [0, 0, 0, 0, 5, 20, 270, 600, 900],
      [0, 0, 0, 0, 4, 11, 56, 500, 800, 1000],
      [0, 0, 0, 0, 3.5, 8, 13, 63, 500, 800, 1000],
    ],
  },
]
const hits = computed(() => [
  {
    count: 0,
    multiplier: histArray.find((hit) => {
      return hit.risk === risk.value
    })!.hitsValues[selectedTiles.value?.length - 1]?.[0] ?? 0,
  },
  ...selectedTiles.value?.map((_tile, index) => ({
    count: index + 1,
    multiplier: histArray.find((hit) => {
      return hit.risk === risk.value
    })!.hitsValues[selectedTiles.value?.length - 1][index + 1],
  })),
])
const hitItemWidth = computed(() => width.value / hits.value?.length - 4)
const isTight = computed(() => hitItemWidth.value < 70)
const chanceArray = [
  [75, 25],
  [55.7692077, 38.46153846, 5.76923077],
  [41.09311741, 44.02834008, 13.66396761, 1.2145749],
  [29.98686946, 44.42499179, 21.41919247, 3.93916183, 0.22978444],
  [21.6571835, 41.64842981, 27.76561987, 7.93303425, 0.95743517, 0.03829741],
  [15.46941679, 37.12660028, 32.12878871, 12.6928548, 2.37991027, 0.19695809, 0.00547106],
  [
    10.91958832, 31.84879926, 34.3967032, 17.63933498, 4.57316092, 0.58797783, 0.03379183,
    0.00064365,
  ],
  [
    7.61062216, 26.47172926, 34.74414465, 22.23625258, 7.48335423, 1.33037409, 0.1187834,
    0.00468112, 0.00005851,
  ],
  [
    5.23230274, 21.40487483, 33.50328234, 26.05810849, 10.94440557, 2.52563205, 0.31180643,
    0.01909019, 0.00049371, 0.00000366,
  ],
  [
    3.54446314, 16.87839592, 31.07159249, 28.82002782, 14.71022253, 4.23654409, 0.67893335,
    0.05747584, 0.0023093, 0.00003539, 0.00000012,
  ],
]
const hitTilesCount = computed(() => selectedTiles.value?.filter(t => openedTiles.value?.includes(t)).length)
const [hitsParent] = useAutoAnimate({
  duration: 50,
})
</script>

<template>
  <div
    ref="el"
  >
    <div
      class="w-full flex flex-col items-center justify-center gap-1 lg:gap-2 font-bold leading-none"
    >
      <div
        ref="hitsParent"
        :class="{
          'gap-2': !isTight,
          'gap-1': isTight,
        }"
        class="w-full flex items-center justify-center rounded-md"
      >
        <div
          v-for="(hit, index) in hits"
          :key="hit.count"
          class="cursor-help min-w-0 grow flex-auto max-w-20"
        >
          <UTooltip
            :content="{ side: 'top' }"
            arrow
          >
            <template #content>
              <Calculator
                :chance="chanceArray[selectedTiles.length - 1][index]"
                :multiplier="hit.multiplier"
              />
            </template>
            <div
              :class="{
                'text-highlights': hit.count === hitTilesCount && resultNumbers.length,
              }"
              class="
                flex flex-col items-center justify-center gap-2 text-xxs xs:text-xs lg:text-sm
                w-full max-w-20 text-white leading-none
              "
            >
              <span class="py-2 bg-green-950 rounded-md w-full flex items-center justify-center">
                {{ hit.multiplier }}×
              </span>
              <span class="py-2 bg-green-950 rounded-md w-full flex items-center justify-center gap-0.5 lg:gap-1">
                <span>{{ index }}×</span>
                <svg class="w-3 h-3 min-w-3 min-h-3">
                  <use :href="COLOR_KENO_HITS" />
                </svg>
              </span>
            </div>
          </UTooltip>
        </div>
      </div>
    </div>
  </div>
</template>
