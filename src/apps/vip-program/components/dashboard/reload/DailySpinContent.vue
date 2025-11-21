<script lang="ts" setup>
import { AUTH, DAILY_FREE_SPIN, FREE_SPIN, FS_COLOR_MAP, FS_VALUES, PREFERENCE, UNRANKED_VIP, VIP } from '~/constants'
import CountDown from '~/components/molecules/common/CountDown.vue'
import { FREE_SPIN_PIN_ICON } from '~/icons'
import {
  CLAIM_DAILY_SPIN_MUTATION,
  DAILY_FREE_SPIN_MUTATION,
  DAILY_SPIN_GAMES_QUERY,
  SAVE_USER_PREFERENCES_MUTATION
} from '~/graphql'
import CryptoPopover from '~/components/organisms/wallets/popovers/CryptoPopover.vue'
import type { Game } from '~/types'

const { hideHead = false } = defineProps<{
  hideHead?: boolean;
}>()

const emits = defineEmits<{
  (e: 'close:modal', value: boolean): void;
}>()

const { loading: spinGamesLoading, result: spinGamesResult } = useQuery(
  DAILY_SPIN_GAMES_QUERY, { input: { type: 'in_house' } }
)

const { vip } = inject(VIP)!
const { dailyFreeSpin, refetch: refetchDailySpin } = inject(DAILY_FREE_SPIN)!
const { isLoggedIn, me, refetch, openAuthModal }: any = inject(AUTH)!
const { isDailySpinning, updateIsDailySpinning } = inject(FREE_SPIN)!
const { activeCryptoCode } = inject(PREFERENCE)!
const { t } = useI18n()
const router = useRouter()
const localePath = useLocalePath()
const spinGames = computed(() => spinGamesResult.value?.dailySpinGames)
const selGame = ref(spinGames.value?.[0])
const openPopover = ref(false)
const buttonRef = ref()
const lastPayoutValue = ref(5)

watch(() => spinGames.value, (v) => {
  if (v) {
    selGame.value = v?.[0]
  }
}, { immediate: true })

const rotation = ref(0)
const sectionAngle = 360 / FS_VALUES.length
const isSpinDone = ref(false)

const claimToken = ref(dailyFreeSpin.value?.daily_spin_currency?.code || activeCryptoCode.value)
const canClaimDailySpins = computed(() => dailyFreeSpin.value?.canClaimDailySpins)
const canDailySpin = computed(() => vip.value?.dualRank?.vipLevel !== UNRANKED_VIP && vip.value?.vipLevel?.order >= 2)
const isNotExpired = computed(() => Math.max(
  Math.floor((new Date(dailyFreeSpin.value?.daily_spin_next_claim).getTime() - Date.now()) / 1000),
  0
))

const { mutate, loading, onDone, onError } = useMutation(DAILY_FREE_SPIN_MUTATION, { fetchPolicy: 'no-cache' })
const {
  mutate: claimMutate,
  loading: claimLoading,
  onDone: onClaimDone,
  onError: onClaimError
} = useMutation(CLAIM_DAILY_SPIN_MUTATION)
const {
  mutate: saveUserPreferences,
  loading: savePrefLoading,
} = useMutation(SAVE_USER_PREFERENCES_MUTATION)

onDone((result) => {
  const spinResult = result.data!.useDailyFreeSpin?.spin_results
  lastPayoutValue.value = spinResult.at((spinResult.length - 1))?.payout ?? 0
  const targetIndex = FS_VALUES.indexOf(lastPayoutValue.value)
  if (targetIndex === -1) {
    updateIsDailySpinning(false)
    isDailySpinning.value = false
    return
  }

  const targetAngle = 360 - targetIndex * sectionAngle - sectionAngle / 2
  rotation.value += 5 * 360 + (360 - (rotation.value % 360)) + targetAngle

  setTimeout(async () => {
    if (isDailySpinning.value && result.data!.useDailyFreeSpin?.promo_spin < 1) {
      await refetch()
      refetchDailySpin()
      isSpinDone.value = true
    }
  }, 3100)
})

onError((error) => {
  updateIsDailySpinning(false)
  isDailySpinning.value = false
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: parsedError.message,
  })
})

const onSpinWheel = async () => {
  if (loading.value || isDailySpinning.value || !canDailySpin.value) {
    return
  }

  if (!isLoggedIn.value) {
    openAuthModal()

    return
  }

  updateIsDailySpinning(true)
  isDailySpinning.value = true
  await mutate({})
}

onClaimDone(async () => {
  await refetch()
  refetchDailySpin()

  useGeneralNotify({
    type: 'success',
    title: t('notifications.success'),
    description: `You've claimed the daily spin for ${claimToken.value} and ${selGame.value?.title}`,
  })

  if (isLoggedIn.value && !savePrefLoading.value) {
    await saveUserPreferences({
      ...me.value?.preferences,
      activeCryptoCode: claimToken.value?.toUpperCase()
    }, {
      optimisticResponse: {
        saveUserPreferences: {
          __typename: me.value?.__typename || 'User',
          id: me.value?.id || 0,
          preferences: {
            ...me.value?.preferences,
            activeCryptoCode: claimToken.value?.toUpperCase()
          }
        }
      }
    })
  }

  await router.push({
    path: localePath(`/casino/games/junglebet/${selGame.value?.slug}`)
  })

  updateIsDailySpinning(false)
  isDailySpinning.value = false

  emits('close:modal', true)
})

onClaimError((error) => {
  updateIsDailySpinning(false)
  isDailySpinning.value = false
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: parsedError.message,
  })
})

const claimDaily = () => {
  if (claimLoading.value || loading.value) {
    return
  }

  claimMutate({
    input: {
      currencyCode: claimToken.value,
      gameId: selGame.value?.id
    }
  })
}

onMounted(() => {
  refetch()
  refetchDailySpin()
})

const { width: popupWidth } = useElementRect(buttonRef)
const onSelect = (game: Game) => {
  selGame.value = game
}
</script>
<template>
  <div
    v-if="isLoggedIn && !!me && !!vip"
    class="h-full text-sm flex flex-col gap-2 sm:gap-4"
  >
    <div
      v-if="!isSpinDone"
      class="flex flex-col items-center justify-center bg-green-950 rounded-lg w-full sm:px-4 sm:pt-4"
    >
      <div
        class="w-full mx-auto flex flex-col gap-2 md:gap-4 items-center justify-center bg-green-950"
        :class="{
          'sm:w-4/5': hideHead
        }"
      >
        <div class="w-full flex items-end gap-1.5 uppercase text-2xl justify-center font-extrabold">
          <span class="bet-gradient-text text-nowrap">Win up to</span>
          <span class="text-4xl text-red-600 italic">100</span>
          <span class="bet-gradient-text text-nowrap">Free bets</span>
        </div>
        <div class="wheel-pin w-full">
          <svg
            class="absolute sm:-top-[18%] left-1/2 -translate-x-1/2 w-[12%] object-contain z-10"
            :class="{
              '-top-[19.8%]': hideHead,
              '-top-[18%]': !hideHead,
            }"
          >
            <use :href="FREE_SPIN_PIN_ICON" />
          </svg>
          <div
            class="wheel-container border-20 border-border w-full shadow-spin-wheel relative"
          >
            <div
              class="wheel easing-ease w-full aspect-square"
              :style="{transitionDuration: '3s', transform: `rotate(${rotation}deg)` }"
            >
              <div
                v-for="(value, index) in FS_VALUES"
                :key="`wheel-${value}-${index}`"
                class="wheel-item"
                :style="{
                  transform: `rotate(${index * sectionAngle}deg) skewY(-38.5714deg)`,
                  background: FS_COLOR_MAP[value]
                }"
              >
                <div
                  class="content horizontal-content"
                  :style="{ transform: 'skewY(38.5714deg) rotate(25.7143deg)' }"
                >
                  <span
                    class="text-white text-3xl font-bold pl-4"
                    :class="{
                      'sm:text-4xl sm:pl-7': hideHead
                    }"
                  >
                    {{ value }}
                  </span>
                </div>
              </div>
              <div class="absolute inset-0 w-full h-full aspect-square rounded-full border-[6px] border-green-950/25" />
            </div>

            <div class="absolute w-24 h-24 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square rounded-full border-8 border-white/25">
              <div
                class="w-full h-full aspect-square bg-white/25 rounded-full ease-[cubic-bezier(0,.4,0,1)] transition-all duration-75"
                :class="!isNotExpired && !(loading || isDailySpinning) ? 'animate-cash-center' : 'opacity-0'"
              />
            </div>

            <JButton
              :disabled="loading || isDailySpinning || !canClaimDailySpins || !!isNotExpired || vip?.vipLevel?.order < 2"
              :loading="loading || isDailySpinning"
              class="absolute! top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 rounded-full uppercase"
              :button-class="`h-20! w-20! rounded-full! ${(!isNotExpired && !(loading || isDailySpinning) ? 'animate-button' : 'opacity-0')}`"
              label-class="text-2xl! font-extrabold leading-none! block! text-center flex! flex-col!"
              size="lg"
              variant="bet-gradient"
              @click="onSpinWheel"
            >
              Spin
            </JButton>
          </div>

          <div
            class="absolute w-full aspect-square rounded-full inset-0 border-4 border-transparent bg-transparent"
            :style="{transitionDuration: '3s', transform: `rotate(${rotation}deg)` }"
          >
            <div
              v-for="(value, index) in FS_VALUES"
              :key="`${value}-${index}`"
              class="wheel-item"
              :style="{
                transform: `rotate(${index * sectionAngle - 0.55 * sectionAngle}deg)`,
              }"
            >
              <div
                class="content horizontal-content"
              >
                <div class="w-3 h-3 rounded-full bg-white" />
              </div>
            </div>
          </div>

          <div
            v-if="!!isNotExpired || vip?.vipLevel?.order < 2"
            class="absolute top-1/4 sm:top-1/3 bg-brand/80 w-full flex flex-col items-center justify-center gap-4 sm:gap-0 p-4 rounded-md z-100"
          >
            <UIcon
              class="w-8 h-8 min-w-8 min-h-8 text-paragraph"
              name="material-symbols:lock"
            />

            <span class="text-white font-bold text-2xl">
              {{ t('vip.locked') }}
            </span>

            <span
              v-if="vip?.vipLevel?.order < 2"
              class="text-white font-bold"
            >
              {{ t('vip.drip-req1') }}
            </span>

            <span
              v-else
              class="text-white font-bold"
            >
              1 spin every 24 hrs
            </span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="w-full flex flex-col justify-center gap-2 sm:gap-4"
    >
      <div class="w-full flex items-center justify-between gap-1 sm:gap-3 animate-right-to-left">
        <div class="w-1/2 flex flex-col gap-1.5">
          <div class="flex items-center justify-between font-bold w-full text-sm text-paragraph">
            {{ t('vip.claim') }} {{ t('games.game') }}
          </div>
          <div
            v-if="!!spinGames"
            class="w-full"
          >
            <UPopover
              v-model:open="openPopover"
              class="w-[calc(100%-56px)] max-h-[250px] sm:max-h-full overflow-y-auto"
            >
              <div
                ref="buttonRef"
                class="w-full"
              >
                <JButton
                  class="w-full pl-3 lg:pl-4 pr-2 lg:pr-3 py-3 rounded-md bg-brand!"
                  label-class="justify-between gap-x-2 sm:gap-x-3"
                  variant="alternative"
                >
                  <span
                    class="flex gap-x-1.5 sm:gap-x-2 items-center justify-between w-full"
                  >
                    <span
                      :class="openPopover ? 'text-white' : 'text-paragraph'"
                      class="text-sm group-hover:text-white duration-200"
                    >
                      {{ selGame?.title }}
                    </span>
                  </span>

                  <template #endIcon>
                    <span
                      class="w-6 h-6 min-w-6 min-h-6 text-paragraph hover:text-white p-0 flex items-center"
                    >
                      <UIcon
                        v-if="openPopover"
                        class="h-6 w-6 min-w-6 min-h-6"
                        name="i-heroicons-chevron-up-20-solid"
                      />
                      <UIcon
                        v-else
                        class="h-6 w-6 min-w-6 min-h-6"
                        name="i-heroicons-chevron-down-20-solid"
                      />
                    </span>
                  </template>
                </JButton>
              </div>
              <template #content>
                <div
                  v-for="game in spinGames"
                  :key="game.id"
                  :class="game.id === selGame?.id ? 'bg-divider-dark' : 'hover:bg-border'"
                  :style="{
                    width: `${Number(popupWidth)}px`,
                  }"
                  class="py-2 cursor-pointer group z-20 px-[27px] duration-200"
                  @click="onSelect(game)"
                >
                  <div
                    class="flex gap-1.5 items-center text-paragraph group-hover:text-white justify-between duration-200 text-sm"
                  >
                    {{ game.title }}
                  </div>
                </div>
              </template>
            </UPopover>
          </div>
        </div>
        <div class="w-1/2 flex flex-col gap-1.5">
          <div class="flex items-center font-bold w-full">
            <span class="text-sm text-paragraph">
              {{ t('vip.claim-curr') }}
            </span>
          </div>
          <div class="w-full">
            <CryptoPopover
              :show-label="false"
              :init-selected-currency="claimToken"
              :auto-place="true"
              @update:init-selected-crypto="code => claimToken = code"
            />
          </div>
        </div>
      </div>

      <div
        class="flex flex-col justify-center gap-2 md:gap-3 w-full uppercase items-center md:items-start font-bold animate-right-to-left"
      >
        <div
          class="flex flex-col justify-center w-full uppercase items-center md:items-start font-bold"
        >
          <div class="text-white text-2xl md:text-3xl leading-none">
            You've won
          </div>
          <div class="text-4xl md:text-5xl bet-gradient-text text-nowrap leading-none font-extrabold">
            {{ lastPayoutValue }} Free Bets
          </div>
          <div class="text-3xl md:text-4xl bet-gradient-text leading-none font-extrabold">
            on {{ selGame.title }}
          </div>
        </div>

        <JButton
          class="w-full py-2.5 uppercase"
          button-class="h-11"
          variant="bet-gradient"
          :loading="spinGamesLoading || claimLoading"
          @click="claimDaily"
        >
          Claim Prize & Play
        </JButton>
      </div>
    </div>

    <div class="w-full flex items-center justify-center">
      <JbBlankButton class="underline font-bold text-white z-100">
        <!--        Fairness-->
      </JbBlankButton>
    </div>

    <div
      v-if="!isSpinDone"
      class="w-full flex flex-col justify-center items-end gap-2 md:gap-3"
    >
      <div
        v-if="!isNotExpired"
        class="bg-brand w-full text-white p-2 md:p-4 rounded-md flex items-center justify-start"
      >
        <span class="w-full text-left">
          Spin the lucky wheel every 24 hrs and win up to 100 FREEPLAY BETS on our in-house
          <span class="capitalize">{{ dailyFreeSpin?.daily_spin_game?.slug || 'Game' }}</span>. Amount per drop
          increases as your wagering increases from the day prior.
        </span>
      </div>
      <CountDown
        v-else
        :remain-time-string="dailyFreeSpin?.daily_spin_next_claim || ''"
        :day-hidden="true"
        class="w-full bg-brand!"
        @timer:end="isSpinDone = false"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wheel-pin {
  position: relative;

  @keyframes cashCenter {
    0% {
      transform: scale(1);
      opacity: 1;
    }

    50% {
      transform: scale(1.5);
      opacity: 0;
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes gradientButton {
    0% {
      transform: translateX(100%);
    }

    50% {
      transform: translateX(-100%);
    }

    100% {
      transform: translateX(100%);
    }
  }

  .animate-cash-center {
    animation: cashCenter ease-in-out 1.8s infinite;
  }

  .animate-button {
    &:before {
      background: #FFFFFF;
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      width: 100%;
      rotate: 6deg;
      opacity: 0.3;
      animation-duration: 700ms;
      animation: gradientButton ease-in-out 3s infinite;
    }
  }
}

.wheel-container {
  display: inline-block;
  overflow: hidden;
  border-radius: 100%;
  cursor: pointer;
  transition-property: transform;
  transition-timing-function: ease-in-out;
  transition-duration: 1s;
}

.wheel {
  position: relative;
  margin: 0 auto;
  border-radius: 100%;
  overflow: hidden;

  &.easing-ease {
    transition: transform cubic-bezier(0.65, 0, 0.35, 1);
  }
}

.wheel-item {
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 50%;
  transform-origin: bottom left;
}

.wheel .content {
  position: absolute;
  left: -100%;
  width: 200%;
  height: 200%;
  text-align: center;
  padding-top: 20px;
  transform: skewY(30deg) rotate(0);

  &.horizontal-content span {
    display: block;
    transform: rotate(90deg);
  }
}

.bet-gradient-text {
  background: linear-gradient(33deg, rgba(250, 242, 61, 1) 0%, rgba(252, 190, 32, 1) 100%);
  -webkit-background-clip: text !important;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
