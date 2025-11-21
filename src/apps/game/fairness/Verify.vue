<script lang="ts" setup>
import { FAIRNESS } from '~/apps/game/fairness/constants'
import type { RiskShort, Row, Segment } from '~/apps/game/types'
import RiskShortSelect from '~/apps/game/components/in-house/RiskShortSelect.vue'
import RowsSelect from '~/apps/plinko/components/RowsSelect.vue'
import SegSelect from '~/apps/game/components/in-house/SegSelect.vue'
import VerifyLimbo from '~/apps/limbo/VerifyLimbo.vue'
import VerifyDice from '~/apps/dice/VerifyDice.vue'
import VerifyKeno from '~/apps/keno/VerifyKeno.vue'
import VerifyPlinko from '~/apps/plinko/VerifyPlinko.vue'
import VerifyWheel from '~/apps/wheel/VerifyWheel.vue'

const {
  clientSeed,
  serverSeed,
  nonce,
  gameSlug,
  plinko: { maxBooster, selectedRisk, selectedRows },
  wheel: { wheelRisk, selectedSegment },
} = inject(FAIRNESS)!

const { t } = useI18n()
const options = computed(() => [
  { label: t('casino.limbo'), value: 'limbo' },
  { label: t('casino.dice'), value: 'dice' },
  { label: t('casino.keno'), value: 'keno' },
  { label: t('casino.plinko'), value: 'plinko' },
  { label: t('casino.wheel'), value: 'wheel' },
])

const decreaseNonce = () => {
  if (nonce.value > 0) {
    nonce.value--
  }
}

const clickBoostButton = (side: 'default' | 'left' | 'right') => {
  maxBooster.value = maxBooster.value === side ? 'default' : side
}

const gameSlugOption = computed({
  get () {
    return gameSlug.value
  },
  set (v) {
    gameSlug.value = v
  }
})
</script>

<template>
  <div class="FairnessVerify w-full flex flex-col gap-y-3 lg:gap-y-4">
    <VerifyLimbo
      v-if="gameSlug === 'limbo'"
      :client-seed="clientSeed"
      :nonce="nonce"
      :server-seed="serverSeed"
    />
    <VerifyDice
      v-else-if="gameSlug === 'dice'"
      :client-seed="clientSeed"
      :nonce="nonce"
      :server-seed="serverSeed"
    />
    <VerifyKeno
      v-else-if="gameSlug === 'keno'"
      :client-seed="clientSeed"
      :nonce="nonce"
      :server-seed="serverSeed"
    />
    <VerifyPlinko
      v-else-if="gameSlug === 'plinko'"
      :client-seed="clientSeed"
      :max-booster="maxBooster"
      :nonce="nonce"
      :risk="selectedRisk"
      :rows-count="selectedRows"
      :server-seed="serverSeed"
    />
    <VerifyWheel
      v-else-if="gameSlug === 'wheel'"
      :client-seed="clientSeed"
      :nonce="nonce"
      :risk="wheelRisk"
      :segment="selectedSegment"
      :server-seed="serverSeed"
    />

    <div class="w-full text-sm">
      <label class="font-bold text-white w-full">
        {{ t('games.game') }}
      </label>
      <USelect
        v-model="gameSlugOption"
        :items="options"
        :arrow="true"
        class="w-full bg-green-950! text-sm h-12 text-white"
        label-key="label"
        size="lg"
        value-key="value"
      />
    </div>

    <div
      v-if="gameSlug === 'plinko'"
      class="text-xs md:text-sm leading-none! bg-green-950 p-2 rounded-md flex flex-col gap-2"
    >
      <div class="flex items-center gap-x-2">
        <RiskShortSelect
          :disabled="false"
          :risk="selectedRisk"
          label-text="text-white"
          @update:model-value="(v: RiskShort) => selectedRisk = v"
        />

        <RowsSelect
          :disabled="false"
          :row="selectedRows"
          label-text="text-white"
          @update:model-value="(v: Row) => selectedRows = v"
        />
      </div>

      <div class="w-auto flex flex-col gap-2">
        <div class="flex items-center gap-x-1 text-white font-bold">
          {{ t('bets.max-booster') }}
        </div>
        <div class="flex items-center w-full gap-x-2">
          <JButton
            :button-class="maxBooster !== 'left' ? 'bg-green-1000' : 'bg-primary hover:bg-primary focus:bg-primary active:bg-primary text-white'"
            class="min-w-24 h-10 w-full block"
            variant="alternative"
            @click="clickBoostButton('left')"
          >
            <template #startIcon>
              <UIcon
                v-if="maxBooster !== 'left'"
                class="w-4 h-4 min-h-4 min-w-4 cursor-pointer"
                name="ion:flash-off-sharp"
              />
              <UIcon
                v-else
                class="w-4 h-4 min-h-4 min-w-4 cursor-pointer text-white"
                name="ion:flash-sharp"
              />
            </template>
            {{ t('base.left') }}
          </JButton>
          <JButton
            :button-class="maxBooster !== 'right' ? 'bg-green-1000' : 'bg-primary hover:bg-primary focus:bg-primary active:bg-primary text-white'"
            class="min-w-24 h-10 w-full block"
            variant="alternative"
            @click="clickBoostButton('right')"
          >
            <template #startIcon>
              <UIcon
                v-if="maxBooster !== 'right'"
                class="w-4 h-4 min-h-4 min-w-4 cursor-pointer"
                name="ion:flash-off-sharp"
              />
              <UIcon
                v-else
                class="w-4 h-4 min-h-4 min-w-4 cursor-pointer text-white"
                name="ion:flash-sharp"
              />
            </template>
            {{ t('base.right') }}
          </JButton>
        </div>
      </div>
    </div>

    <div
      v-if="gameSlug === 'wheel'"
      class="text-xs md:text-sm leading-none! bg-green-950 p-2 rounded-md flex flex-col gap-2"
    >
      <div class="flex items-center gap-x-2">
        <RiskShortSelect
          :disabled="false"
          :risk="wheelRisk"
          label-text="text-white"
          @update:model-value="(v: RiskShort) => wheelRisk = v"
        />

        <SegSelect
          :disabled="false"
          :segment="selectedSegment"
          @update:model-value="(v: Segment) => selectedSegment = v"
        />
      </div>
    </div>

    <div class="w-full text-sm">
      <label class="font-bold text-white w-full">
        {{ t('bets.server-seed') }}
      </label>
      <UInput
        v-model="serverSeed"
        class="w-full"
        size="xl"
        :ui="{
          base: 'h-12! bg-green-950 border-0 ring-0 hover:ring-1 hover:ring-primary focus:ring-1! focus:bg-brand focus:ring-primary!'
        }"
      />
    </div>

    <div class="w-full text-sm">
      <label class="font-bold text-white w-full">
        {{ t('bets.client-seed') }}
      </label>
      <UInput
        v-model="clientSeed"
        class="w-full"
        size="xl"
        :ui="{
          base: 'h-12! bg-green-950 border-0 ring-0 hover:ring-1 hover:ring-primary focus:ring-1! focus:bg-brand focus:ring-primary!'
        }"
      />
    </div>

    <div class="w-full text-sm">
      <label class="font-bold text-white w-full">
        {{ t('bets.nonce') }}
      </label>
      <JInputNumber
        :min="0"
        :model-value="nonce"
        :step="1"
        :to-fixed="0"
        class="w-full bg-green-950 rounded-md"
        class-name="h-12! px-3 lg:px-4 bg-green-950 focus:bg-brand hover:ring-1 hover:ring-primary"
        @update:model-value="(v) => nonce = Number(v)"
      >
        <template #endIcon>
          <span class="flex items-center gap-x-1">
            <JbBlankButton
              class="bg-brand rounded-md flex items-center justify-center w-5 h-5 text-paragraph hover:text-white"
              @click="decreaseNonce"
            >
              <UIcon
                class="w-4 h-4 min-w-4 min-h-4"
                name="i-heroicons-chevron-down-20-solid"
              />
            </JbBlankButton>
            <JbBlankButton
              class="bg-brand rounded-md flex items-center justify-center w-5 h-5 text-paragraph hover:text-white"
              @click="nonce++"
            >
              <UIcon
                class="w-4 h-4 min-w-4 min-h-4"
                name="i-heroicons-chevron-up-20-solid"
              />
            </JbBlankButton>
          </span>
        </template>
      </JInputNumber>
    </div>
  </div>
</template>
