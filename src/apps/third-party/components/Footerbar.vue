<script lang="ts" setup>
import {
  AUTH,
  FUN_PLAY,
  GAME_MATH_ICONS,
  GAME_POPUP,
  REAL_PLAY,
  THEME,
  WAITING_PLAY
} from '~/constants'
import { MONITOR_ICON, STATISTICS_BAR_ICON } from '~/components/symbols'
import { IS_GAME_IN_FAVORITES_QUERY, TOGGLE_FAVORITE_MUTATION } from '~/graphql'
import { THIRD_PARTY_GAME } from '~/apps/third-party/constants'
import FiatPopover from '~/components/organisms/wallets/popovers/FiatPopover.vue'

const { isLoggedIn, openAuthModal } = inject(AUTH)!
const { game, currentPlay, currency, fullScreen, theatreMode, pictureMode, hasOnlyRealPlay } = inject(THIRD_PARTY_GAME)!
const { setPictureMode, toggleGameStatsPopup, setActiveGameOption } = inject(GAME_POPUP)!

const { options, result: isGameInFavoritesResult, onResult: resultIsGameInFavorites } =
  useQuery(IS_GAME_IN_FAVORITES_QUERY, { gameId: +game.id }, {
    fetchPolicy: 'no-cache',
    enabled: isLoggedIn.value
  })

const { screen } = inject(THEME)!
const { t } = useI18n()
const showTools = ref<boolean>(true)
const isFavorite = ref<boolean>(false)
resultIsGameInFavorites(() => {
  isFavorite.value = isGameInFavoritesResult.value?.isGameInFavorites || false
})

const {
  mutate: toggleFavoriteMutate,
  onDone: toggleFavoriteDone
} = useMutation(TOGGLE_FAVORITE_MUTATION)

const items = [
  {
    label: game.gameProvider?.display_name,
    game: game.title,
    slot: 'details-table'
  }
]

toggleFavoriteDone(() => {
  useGeneralNotify({
    type: 'success',
    title: isFavorite.value ? t('games.tool-favorites') : t('games.tool-favorites-remove'),
    description: isFavorite.value
      ? t('notifications.added-game-to-favorites')
      : t('notifications.removed-game-from-favorites'),
  })
})

const isSwitchOn = computed(() => {
  if (isLoggedIn.value) {
    // @ts-ignore
    return [REAL_PLAY, WAITING_PLAY].includes(currentPlay.value)
  }

  return currentPlay.value === REAL_PLAY
})

const onClickRealPlay = () => {
  if (!isLoggedIn.value) {
    currentPlay.value = REAL_PLAY
    return
  }
  if (currentPlay.value === WAITING_PLAY) {
    currentPlay.value = REAL_PLAY
  } else {
    currentPlay.value = WAITING_PLAY
  }
}

const onClickFunPlay = () => {
  if (isLoggedIn.value) {
    currentPlay.value = FUN_PLAY
  } else {
    togglePlayType()
  }
}

const togglePlayType = () => {
  if (isLoggedIn.value) {
    if (currentPlay.value === FUN_PLAY) {
      currentPlay.value = WAITING_PLAY
    } else {
      currentPlay.value = FUN_PLAY
    }
  } else if (currentPlay.value === FUN_PLAY) {
    currentPlay.value = REAL_PLAY
  } else if (currentPlay.value === WAITING_PLAY) {
    currentPlay.value = REAL_PLAY
  }
}

const handleLiveStats = () => {
  toggleGameStatsPopup()
}

const toolboxItems = computed(() => ([
  {
    fill: false,
    icon: fullScreen.value ? 'gridicons:fullscreen-exit' : 'gridicons:fullscreen',
    iconFill: fullScreen.value ? 'gridicons:fullscreen-exit' : 'gridicons:fullscreen',
    iconType: 'ui',
    label: fullScreen.value ? t('games.tool-fullscreen-disable') : t('games.tool-fullscreen'),
    mobile: false,
    action: () => (fullScreen.value = !fullScreen.value)
  },
  {
    fill: false,
    icon: MONITOR_ICON,
    iconFill: MONITOR_ICON,
    iconType: 'symbol',
    label: theatreMode.value ? t('games.tool-theatre-disable') : t('games.tool-theatre'),
    mobile: false,
    action: () => (theatreMode.value = !theatreMode.value)
  },
  {
    fill: false,
    icon: pictureMode.value ? 'ri:picture-in-picture-exit-line' : 'ri:picture-in-picture-2-line',
    iconFill: pictureMode.value ? 'ri:picture-in-picture-exit-line' : 'ri:picture-in-picture-2-line',
    iconType: 'ui',
    label: pictureMode.value ? t('games.tool-picture-in-disable') : t('games.tool-picture-in'),
    mobile: false,
    action: () => setPictureMode(game.slug)
  },
  {
    fill: isFavorite.value,
    icon: 'ph:heart-straight-bold',
    iconFill: 'ph:heart-straight-fill',
    iconType: 'ui',
    label: isFavorite.value ? t('games.tool-favorites-remove') : t('games.tool-favorites'),
    mobile: true,
    action: () => {
      if (!isLoggedIn.value) {
        openAuthModal()
      } else {
        isFavorite.value = !isFavorite.value
        toggleFavoriteMutate({ gameId: +game.id })
      }
    }
  },
  {
    fill: false,
    icon: STATISTICS_BAR_ICON,
    iconFill: STATISTICS_BAR_ICON,
    iconType: 'symbol',
    label: t('games.tool-stats'),
    mobile: false,
    action: () => {
      if (!isLoggedIn.value) {
        openAuthModal()
      } else {
        handleLiveStats()
      }
    }
  }
]))

watch(
  () => currentPlay.value,
  (currentPlayValue) => {
    if (!isLoggedIn.value && currentPlayValue === REAL_PLAY) {
      openAuthModal()
      useTimeoutFn(() => {
        currentPlay.value = WAITING_PLAY
      }, 300)
    }
  }
)

watch(() => isLoggedIn.value, (v) => {
  if (v) {
    // @ts-ignore
    options.enabled = true
  }
})

watch(() => [
  theatreMode.value, fullScreen.value, pictureMode.value, isLoggedIn.value, isFavorite.value
], () => {
  showTools.value = false
  useTimeoutFn(() => (showTools.value = true), 20)
}, { immediate: true })

const handleUpdateCurrency = (v: string) => {
  currency.value = v
  setActiveGameOption(game.slug, {
    currency: v,
  })
}
</script>

<template>
  <UAccordion
    v-if="showTools"
    class="bg-green-950 rounded-md"
    :items="items"
    :ui="{
      trailingIcon: 'hidden ms-0',
      label: 'w-full flex items-center'
    }"
  >
    <template #default="{ item, open }">
      <UButton
        class="py-0! flex items-center w-full hover:bg-green-950"
        color="neutral"
        size="lg"
        variant="ghost"
      >
        <template #leading>
          <NuxtLinkLocale
            :to="`/casino/provider/${game.gameProvider.slug}`"
            class="flex items-center"
            @click.stop
          >
            <svg
              v-if="GAME_MATH_ICONS[game.slug]?.type === 'symbol'"
              class="w-7 h-7 min-w-7 min-h-7"
            >
              <use :href="GAME_MATH_ICONS[game.slug]?.icon" />
            </svg>
            <UIcon
              v-else-if="GAME_MATH_ICONS[game.slug]?.type === 'ui' && GAME_MATH_ICONS[game.slug]?.icon"
              :name="GAME_MATH_ICONS[game.slug].icon || ''"
              class="w-7 h-7 min-w-7 min-h-7"
            />
            <NuxtImg
              v-else
              :src="game.image"
              class="w-7 h-7 min-w-7 min-h-7 rounded-md"
              loading="lazy"
              :alt="`Junglebet.com ${game.slug}`"
            />
          </NuxtLinkLocale>
        </template>

        <div
          class="text-sm font-bold flex items-center gap-x-1.5 leading-none"
        >
          <NuxtLinkLocale
            :to="`/casino/provider/${game.gameProvider.slug}`"
            class="font-bold text-paragraph hover:text-white leading-none hidden md:block"
            @click.stop
          >
            {{ item?.label || '' }}
          </NuxtLinkLocale>

          <span class="text-white font-bold leading-none">
            {{ item.game }}
          </span>

          <span
            class="p-0 rounded-full bg-border w-4 h-4 min-w-4 min-h-4 flex items-center"
            :class="{'bg-primary text-white': open}"
          >
            <UIcon
              :class="[open && '-rotate-180']"
              class="w-4 h-4 transform transition-transform duration-150"
              name="i-heroicons-chevron-down-20-solid"
            />
          </span>
        </div>

        <template #trailing>
          <div
            v-if="showTools"
            class="flex items-center gap-x-1 lg:gap-x-1.5 ms-auto text-paragraph"
          >
            <template
              v-for="(tItem, tInd) in toolboxItems"
              :key="`${tInd}_game_tools`"
            >
              <UTooltip
                :class="{
                  'hidden md:block h-5': !tItem.mobile
                }"
                :content="{ side: 'top' }"
                arrow
                :text="(tItem?.label || '')"
              >
                <svg
                  v-if="tItem.iconType === 'symbol'"
                  class="h-5 w-5 min-w-5 min-h-5 hover:text-white"
                  @click="tItem.action"
                  @click.stop
                >
                  <use :href="tItem.icon" />
                </svg>
                <UIcon
                  v-else
                  :name="tItem.fill ? tItem.iconFill : (tItem.icon || '')"
                  class="h-5 w-5 min-w-5 min-h-5 hover:text-white"
                  @click="tItem.action"
                  @click.stop
                />
              </UTooltip>
            </template>
            <div
              v-if="currentPlay === REAL_PLAY"
              class="flex-none hidden md:block"
            >
              <FiatPopover
                :content-height="screen.md ? 300 : 150"
                button-class="w-full pl-3 pr-1.5 py-1 hover:shadow-none rounded-md bg-brand!"
                position="top"
                @update:fiat-value="handleUpdateCurrency"
              />
            </div>
            <template
              v-if="!hasOnlyRealPlay"
            >
              <div class="w-0.5 h-7 bg-border" />
              <div
                class="flex items-center gap-x-1 md:gap-x-2"
              >
                <button
                  v-if="currentPlay !== REAL_PLAY"
                  :class="{ 'text-white': currentPlay === FUN_PLAY }"
                  class="text-xs md:text-sm font-bold text-white"
                  @click="onClickFunPlay"
                >
                  <span
                    class="group-active:scale-95"
                  >
                    {{ t('games.fun-play') }}
                  </span>
                </button>
                <button
                  v-if="currentPlay === REAL_PLAY"
                  class="text-xs md:text-sm font-bold text-white"
                  @click="onClickFunPlay"
                >
                  <span class="group-active:scale-95">
                    {{ t('games.fun-play') }}
                  </span>
                </button>
                <JSwitch
                  :class="{ 'opacity-50': currentPlay === WAITING_PLAY }"
                  :classes="{
                    Inner: 'gap-x-0!',
                    SwitchButton: 'w-9! min-w-9 h-[18px]!',
                    SwitchInner: 'w-3.5! h-3.5!',
                  }"
                  :model-value="isSwitchOn"
                  translate="translate-x-5"
                  @update:model-value="togglePlayType"
                />
                <button
                  :class="{ 'text-white': currentPlay === REAL_PLAY }"
                  class="hidden md:block text-xs md:text-sm font-bold"
                  @click="onClickRealPlay"
                >
                  <span class="group-active:scale-95">
                    {{ t('games.real-play') }}
                  </span>
                </button>
              </div>
            </template>
          </div>
        </template>
      </UButton>
    </template>

    <template #details-table="{ open }">
      <div
        v-if="open"
        class="w-full pb-4"
      >
        <slot />
      </div>
    </template>
  </UAccordion>
</template>
