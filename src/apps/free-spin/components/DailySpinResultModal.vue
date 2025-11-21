<script lang="ts" setup>
import { AUTH, CURRENCY, FREE_SPIN, PREFERENCE } from '~/constants'
import { FREE_BET } from '~/apps/plinko/constants'

const props = defineProps<{modalVisible: boolean}>()
const emits = defineEmits<{(e: 'close:modal'): void}>()

const { me } = inject(AUTH)!
const { currentCryptoCurrency } = inject(CURRENCY)!
const { activeCryptoCode } = inject(PREFERENCE)!
const { freeBetsAmount } = inject(FREE_BET)!
const { isDailySpin } = inject(FREE_SPIN)!
const isModalVisible = ref(props.modalVisible)
const freeTotalWon = computed(() =>
  !!me.value && me.value.remaining_free_spins && me.value.remaining_free_spins.length
    ? me.value.remaining_free_spins[(me.value.remaining_free_spins.length - 1)].total_won
    : 0
)
const spinResults = computed(() =>
  !!me.value && me.value.remaining_free_spins && me.value.remaining_free_spins.length
    ? me.value.remaining_free_spins[(me.value.remaining_free_spins.length - 1)].spin_results
    : []
)

const onCloseModal = async () => {
  emits('close:modal')
  isModalVisible.value = false
}
</script>

<template>
  <ClientOnly>
    <UModal
      v-model:open="isModalVisible"
      class="w-11/12 md:w-[450px] bg-green-950 p-6! overflow-visible"
      :dismissible="false"
      :default-open="isModalVisible"
      @update:open="(v) => {
        if (!v) {
          isModalVisible = false
        }
      }"
    >
      <template #content>
        <div class="flex flex-col justify-center gap-4 w-full items-center md:items-start font-bold p-0 md:p-4">
          <div class="text-3xl md:text-4xl bet-gradient-text leading-none font-extrabold uppercase text-center w-full">
            Congratulations
          </div>
          <div class="text-white text-2xl md:text-3xl leading-none text-center w-full">
            You've Won
          </div>
          <div
            class="
              text-3xl md:text-4xl text-nowrap leading-none bg-brand rounded
              font-extrabold w-full flex items-center justify-center gap-x-2 p-2 md:p-4
            "
          >
            <UIcon
              v-if="!isDailySpin"
              class="w-7 h-7 min-h-7 min-w-7"
              name="i-cryptocurrency-color:doge"
            />
            <div
              v-else
              class="flex items-center"
            >
              <UIcon
                v-if="currentCryptoCurrency?.iconType === 'ui'"
                :name="currentCryptoCurrency?.icon"
                class="w-7 h-7 min-h-7 min-w-7"
              />
              <svg
                v-else-if="currentCryptoCurrency?.iconType === 'symbol'"
                class="h-7 w-7 min-w-7 min-h-7"
              >
                <use :href="currentCryptoCurrency?.icon" />
              </svg>
              <UAvatar
                v-else
                :alt="currentCryptoCurrency?.name"
                :src="currentCryptoCurrency?.logo"
                class="w-7 h-7 min-h-7 min-w-7"
                img-class="w-7 h-7"
                size="sm"
              />
            </div>
            <span class="bet-gradient-text">
              {{ freeTotalWon.toFixed(8) }}
              <span class="font-semibold text-2xl md:text-3xl">
                {{ isDailySpin ? activeCryptoCode : 'DOGE' }}
              </span>
            </span>
          </div>
          <div class="text-white text-2xl md:text-3xl leading-none text-center w-full">
            From
            <span class="bet-gradient-text text-3xl md:text-4xl">
            {{ spinResults && spinResults.length ? spinResults[spinResults.length - 1].payout : freeBetsAmount }}
          </span>
            Free Plinko Drops
          </div>

          <JButton
            button-class="h-11"
            class="w-full py-2.5 uppercase"
            variant="bet-gradient"
            @click="onCloseModal"
          >
            Continue
          </JButton>
        </div>
      </template>
    </UModal>
  </ClientOnly>
</template>

<style lang="scss" scoped>
.bet-gradient-text {
  background: linear-gradient(33deg, rgba(250, 242, 61, 1) 0%, rgba(252, 190, 32, 1) 100%);
  background-clip: text;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent;
}
</style>
