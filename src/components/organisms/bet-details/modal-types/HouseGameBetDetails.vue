<script lang="ts" setup>
import { AUTH, BET_DETAIL } from '~/constants'
import type { Bet } from '~/types'
import BetDetailsBanner from '~/components/organisms/bet-details/modal-content/BetDetailsBanner.vue'
import BetDetailsSummary from '~/components/organisms/bet-details/modal-content/BetDetailsSummary.vue'
import { FAIRNESS_ICON } from '~/components/symbols'
import CopyInput from '~/components/molecules/inputs/CopyInput.vue'
import LimboBetDetails from '~/apps/limbo/components/LimboBetDetails.vue'
import DiceBetDetails from '~/apps/dice/components/DiceBetDetails.vue'
import KenoBetDetails from '~/apps/keno/components/KenoBetDetails.vue'
import PlinkoBetDetails from '~/apps/plinko/components/PlinkoBetDetails.vue'
import WheelBetDetails from '~/apps/wheel/components/WheelBetDetails.vue'

const { t } = useI18n()
const router = useRouter()
const { me } = inject(AUTH)!
const { betDetail } = inject(BET_DETAIL)!

const betData = computed<Bet>(() => betDetail.value.bet)
const openFairnessModal = () => {
  router.push({
    path: router.currentRoute.value.path,
    query: {
      game: betData.value?.game_slug,
      modal: 'fairness',
      tab: 'seeds',
    },
  })
}

const openVerifyModal = () => {
  router.push({
    path: router.currentRoute.value.path,
    query: {
      betID: betData.value?.transaction_id,
      modal: 'fairness',
      tab: 'verify',
      // @ts-ignore
      client_seed: betData.value?.seed_pair?.clientSeed?.client_seed,
      server_seed: betData.value?.seed_pair?.serverSeedUnhashed || null,
      nonce: betData.value?.nonce,
      userId: betData.value?.user_id,
      game: betData.value?.game_slug,
      ...(betData.value?.game_slug === 'plinko'
        ? {
          risk: betData.value?.bet_conditions.risk,
          rows: betData.value?.bet_conditions.rows,
          maxBooster: betData.value?.bet_conditions.maxBooster,
        }
        : {}
      ),
      ...(betData.value?.game_slug === 'wheel'
        ? {
          risk: betData.value?.bet_conditions.risk,
          segment: betData.value?.bet_conditions.segments,
        }
        : {}
      )
    },
  })
}

const moveToFairnessPage = () => {
  window.open('https://junglebet.crisp.help/en/article/provably-fair-gaming-at-junglebet-how-to-verify-game-fairness-1bpc5ev/', '_blank', 'noopener,noreferrer')
}

const items = [
  {
    label: 'props.game.gameProvider?.display_name',
    slot: 'fairness-content'
  }
]
</script>

<template>
  <div class="w-full flex flex-col gap-y-3 lg:gap-y-4">
    <BetDetailsBanner />

    <template v-if="betData && betDetail && betDetail.match?.id">
      <BetDetailsSummary
        :bet-data="betData"
      />

      <LimboBetDetails
        v-if="betDetail.game?.slug === 'limbo'"
        :id="betDetail.match.id"
        :name="betData.game"
      />

      <DiceBetDetails
        v-else-if="betDetail.match?.id && betDetail.game?.slug === 'dice'"
        :id="betDetail.match?.id"
        :name="betData.game"
      />

      <KenoBetDetails
        v-else-if="betDetail.game?.slug === 'keno'"
        :id="betDetail.match?.id"
        :name="betData.game"
      />

      <PlinkoBetDetails
        v-else-if="betDetail.game?.slug === 'plinko'"
        :bet-data="betData"
        :match="betDetail.match"
        :name="betData.game"
      />

      <WheelBetDetails
        v-else-if="betDetail.game?.slug === 'wheel'"
        :bet-data="betData"
        :name="betData.game"
      />
    </template>

    <UAccordion
      class="bg-green-950 rounded-md"
      :items="items"
      :ui="{
        trailingIcon: 'hidden ms-0',
        label: 'w-full flex items-center'
      }"
    >
      <template #default="{ open }">
        <UButton
          class="py-0! flex items-center w-full hover:bg-green-950"
          color="neutral"
          size="lg"
          variant="ghost"
        >
          <template #leading>
            <svg
              class="h-5 w-5 min-w-5 min-h-5"
            >
              <use :href="FAIRNESS_ICON" />
            </svg>
          </template>
          <div
            class="text-sm text-white font-bold text-left leading-none w-full"
          >
            {{ t('bets.provable-fairness') }}
          </div>
          <template #trailing>
            <span
              class="p-0 rounded-full bg-border w-4 h-4 min-w-4 min-h-4 flex items-center"
              :class="[
                {'bg-primary text-white': open}
              ]"
            >
              <UIcon
                :class="[open && '-rotate-180']"
                class="w-4 h-4 transform transition-transform duration-150"
                name="i-heroicons-chevron-down-20-solid"
              />
            </span>
          </template>
        </UButton>
      </template>

      <template #fairness-content="{ open }">
        <div
          v-if="open"
          class="w-full flex flex-col gap-y-2 lg:gap-y-3 px-3 lg:px-4"
        >
          <div class="w-full text-sm">
            <label class="font-bold">
              {{ t('bets.server-seed') }}
            </label>
            <CopyInput
              :model-value="betData?.seed_pair?.serverSeedUnhashed || t('bets.server-seed-not')"
              background-class="bg-brand"
            />
          </div>
          <div class="w-full text-sm">
            <div class="font-bold flex items-center justify-between">
              {{ t('bets.server-seed-hashed') }}
              <div
                v-if="me && me?.id === betData.user_id"
                class="cursor-pointer text-paragraph hover:text-white"
                @click="openFairnessModal"
              >
                {{ t('bets.view-seed-settings') }}
              </div>
            </div>
            <CopyInput
              :model-value="String(betData?.seed_pair?.serverSeed?.server_seed_hashed)"
              background-class="bg-brand"
            />
          </div>
          <div class="flex w-full flex-nowrap gap-3">
            <div class="w-2/3">
              <label class="font-bold">
                {{ t('bets.client-seed') }}
              </label>
              <CopyInput
                :model-value="String((betData?.seed_pair?.clientSeed?.client_seed || ''))"
                background-class="bg-brand"
              />
            </div>
            <div class="w-1/3">
              <label class="font-bold">
                {{ t('bets.nonce') }}
              </label>
              <CopyInput
                :model-value="betData.nonce"
                background-class="bg-brand"
              />
            </div>
          </div>
          <div class="flex w-full items-center justify-center pb-2">
            <span
              v-if="betData?.seed_pair?.serverSeedUnhashed !== null"
              class="font-bold hover:text-white cursor-pointer duration-150"
              @click="openVerifyModal"
            >{{ t('bets.verify-this-bet') }}</span>
            <span
              v-else
              class="font-bold hover:text-white cursor-pointer duration-150 text-sm leading-none"
              @click="moveToFairnessPage"
            >
              {{ t('bets.how-are-result-generated') }}
            </span>
          </div>
        </div>
      </template>
    </UAccordion>
  </div>
</template>
