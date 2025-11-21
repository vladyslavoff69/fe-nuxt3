<script lang="ts" setup>
import { CURRENCY, PREFERENCE } from '~/constants'
import type { CurrencyItem } from '~/types'

const {
  isTimer = false,
  error = false,
  isMax = true,
  showIcon = true,
  isFiat = false,
  forceCrypto = false,
  cryptoCode
} = defineProps<{
  modelValue: number | string;
  isTimer?: boolean;
  isMax?: boolean;
  error?: boolean;
  className?: string;
  showIcon?: boolean;
  isFiat?: boolean;
  cryptoCode?: string;
  forceCrypto?: boolean;
  lock?: boolean;
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: number | ''): void;
  (e: 'set:maxAmount'): void;
}>()

const { t } = useI18n()
const route = useRoute()
const { cryptoCurrencies, currentFiatCurrency, refetchCryptos: refetch } = inject(CURRENCY)!
const { displayInfiatEnabled } = inject(PREFERENCE)!
const totalTime = ref<number>(30)
const progressbarWidth = ref<number>(100)

let timer: NodeJS.Timeout
const startCountdown = () => {
  timer = setInterval(() => {
    totalTime.value--
    progressbarWidth.value = (totalTime.value / 30) * 100
    if (totalTime.value <= 0) {
      totalTime.value = 30
      refetch()
    }
  }, 1000)
}

const handleInput = (v: number | string) => {
  if (v === '') {
    emits('update:modelValue', '')
  } else {
    emits('update:modelValue', Number(v))
  }
}

watch(() => isTimer, (v) => {
  if (v) {
    startCountdown()
  } else {
    clearInterval(timer)
  }
}, { immediate: true })

onUnmounted(() => {
  if (isTimer) {
    clearInterval(timer)
  }
})

const cryptoItem = computed(() => cryptoCurrencies.value.find((cItem: CurrencyItem) => cItem.code === (cryptoCode || route.query.currency)))
</script>
<template>
  <div class="relative">
    <JInputNumber
      :class-name="className"
      :error="error"
      :model-value="modelValue"
      :step="(!forceCrypto && (displayInfiatEnabled || isFiat)) ? 0.01 : 0.00000001"
      :to-fixed="modelValue === 0 ? 0 : (!forceCrypto && (displayInfiatEnabled || isFiat)) ? 2 : 8"
      :lock="lock"
      class="z-10"
      placeholder="0.000000000"
      variant="none"
      @update:model-value="handleInput"
    >
      <template #endIcon>
        <div class="flex gap-x-2 md:gap-x-3 items-center">
          <template
            v-if="(!forceCrypto && (displayInfiatEnabled || isFiat))"
          >
            <div class="flex h-full items-center pl-[15px]">
              <span class="text-paragraph text-base">
                {{ currentFiatCurrency?.name }}
              </span>
            </div>
          </template>

          <template v-if="showIcon">
            <UIcon
              v-if="cryptoItem?.iconType === 'ui'"
              :name="cryptoItem?.icon"
              class="w-5 h-5 min-h-5 min-w-5"
            />
            <svg
              v-else-if="cryptoItem?.iconType === 'symbol'"
              class="w-5 h-5 min-h-5 min-w-5"
            >
              <use :href="cryptoItem.icon || ''" />
            </svg>
            <UAvatar
              v-else
              :alt="cryptoItem?.name"
              :src="cryptoItem?.logo"
              class="w-5 h-5 min-h-5 min-w-5"
              img-class="w-5 h-5"
              size="sm"
            />
          </template>

          <JButton
            v-if="isMax"
            class="z-10 duration-150 min-h-6! py-1!"
            size="sm"
            type="button"
            variant="primary"
            :disabled="lock"
            @click="$emit('set:maxAmount')"
          >
            {{ t('base.max') }}
          </JButton>
        </div>
      </template>
    </JInputNumber>
    <div
      v-if="isTimer"
      class="
        bg-brand shadow-[0_3.04545px_8.375px_0px_rgba(0,0,0,0.27)]
        progress-moved rounded-md w-[calc(100%-50px)] md:w-[calc(100%-70px)]
        h-2 absolute left-0.5 -bottom-3
      "
    >
      <div
        class="
          progressbar h-2 absolute
          rounded-md w-[calc(100%-50px)] md:w-[calc(100%-70px)]
          shadow-[0_3.04545px_8.375px_0px_rgba(0,0,0,0.27)]
        "
      />
    </div>
  </div>
</template>
<style scoped>
.progressbar {
  transition: 0.4s linear;
  transition-property: width, background-color;
}

.progress-moved .progressbar {
  background-image: linear-gradient(
    180deg,
    #343a47 0%,
    rgba(44, 49, 64, 0) 100%
  );
  animation: progress 30s infinite;
}

@keyframes progress {
  0% {
    width: 100%;
  }
  100% {
    width: 0;
  }
}
</style>
