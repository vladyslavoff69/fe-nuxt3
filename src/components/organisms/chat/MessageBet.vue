<script lang="ts" setup>
import type { Bet, BetDetail, Game, GameProvider } from '~/types'
import BetDetailsSummary from '~/components/organisms/bet-details/modal-content/BetDetailsSummary.vue'
import { BET_DETAIL_QUERY } from '~/graphql'

const props = defineProps<{
  betId: string;
}>()

const { result, loading } = useQuery<{
  betDetail: BetDetail
}>(BET_DETAIL_QUERY, { transactionId: props.betId })

const betDetail = computed(() => result.value?.betDetail)
const betData = computed<Bet | undefined>(() => betDetail.value?.bet)
const betGame = computed<Game | undefined>(() => betDetail.value?.game)
const betGameProvider = computed<GameProvider | undefined>(() => betDetail.value?.provider)

const { openBetDetails } = useOpenBetDetailsModal()
</script>

<template>
  <div
    v-if="!loading && betData"
    class="w-full flex flex-col gap-y-1 cursor-pointer"
    @click="openBetDetails(betData)"
  >
    <template v-if="betData && betGameProvider">
      <div class="w-full flex flex-col justify-center items-center">
        <div class="flex items-center gap-x-0.5">
          <NuxtLinkLocale
            :to="`/casino/games/${betGameProvider?.slug}/${betGame?.slug}`"
            class="text-white font-bold text-base"
            @click.stop
          >
            {{ betData.game }}
          </NuxtLinkLocale>
          <NuxtLinkLocale
            :to="`/casino/provider/${betGameProvider?.slug}`"
            class="font-bold hover:text-white"
            @click.stop
          >
            ({{ betGameProvider.display_name }})
          </NuxtLinkLocale>
        </div>
      </div>
    </template>

    <BetDetailsSummary
      v-if="betData"
      :bet-data="betData"
      abs-font-size="text-xs"
    />
  </div>
</template>
