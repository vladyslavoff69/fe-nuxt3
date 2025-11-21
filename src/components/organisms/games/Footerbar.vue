<script lang="ts" setup>
import type { Game } from '~/types'
import { AUTH, GAME, GAME_MATH_ICONS, GAME_POPUP } from '~/constants'
import { FAIRNESS_ICON, MONITOR_ICON, STATISTICS_BAR_ICON } from '~/components/symbols'
import { IS_GAME_IN_FAVORITES_QUERY, TOGGLE_FAVORITE_MUTATION } from '~/graphql'
import SettingsPopover from '~/components/organisms/games/SettingsPopover.vue'

const props = defineProps<{
  game: Game;
  showAction?: Boolean
}>()

const router = useRouter()
const { isLoggedIn, openAuthModal } = inject(AUTH)!
const { theatreMode } = inject(GAME)!
const { isSpinSharing, toggleGameStatsPopup, toggleGameSharePopup } = inject(GAME_POPUP)!

const { result: isGameInFavoritesResult, onResult: resultIsGameInFavorites } =
  useQuery(
    IS_GAME_IN_FAVORITES_QUERY,
    { gameId: +props.game.id }
  )

const { t } = useI18n()
const showTools = ref<boolean>(true)
const isFavorite = ref<boolean>(false)
resultIsGameInFavorites(() => {
  isFavorite.value = isGameInFavoritesResult.value?.isGameInFavorites || false
})

const { mutate: toggleFavoriteMutate, onDone: toggleFavoriteDone } =
  useMutation(TOGGLE_FAVORITE_MUTATION)

const items = [
  {
    label: props.game.gameProvider?.display_name,
    game: props.game.title,
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

const toolboxItems = computed(() => ([
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
    fill: isSpinSharing.value,
    icon: 'material-symbols:screen-share-outline-rounded',
    iconFill: 'material-symbols:stop-screen-share-outline-rounded',
    iconType: 'ui',
    label: isSpinSharing.value ? 'Stop Screen Share' : 'Screen Share',
    mobile: false,
    action: () => {
      if (!isLoggedIn.value) {
        openAuthModal()
      } else {
        isSpinSharing.value = !isSpinSharing.value
        toggleGameSharePopup()
      }
    }
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
        toggleFavoriteMutate({ gameId: +props.game.id })
      }
    }
  },
  {
    fill: false,
    icon: STATISTICS_BAR_ICON,
    iconFill: STATISTICS_BAR_ICON,
    iconType: 'symbol',
    label: t('games.tool-stats'),
    mobile: true,
    action: () => {
      if (!isLoggedIn.value) {
        openAuthModal()
      } else {
        toggleGameStatsPopup()
      }
    }
  },
  {
    fill: false,
    icon: FAIRNESS_ICON,
    iconFill: FAIRNESS_ICON,
    iconType: 'symbol',
    label: t('games.tool-fairness'),
    mobile: true,
    action: () => {
      if (!isLoggedIn.value) {
        openAuthModal()
      } else {
        router.push({
          path: router.currentRoute.value.path,
          query: {
            modal: 'fairness',
            game: props.game.slug
          },
        })
      }
    }
  }
]))

watch(() => [
  theatreMode.value, isLoggedIn.value, isFavorite.value, isSpinSharing.value
], (v) => {
  showTools.value = false
  useTimeoutFn(() => (showTools.value = true), 20)
}, { immediate: true })
</script>

<template>
  <UAccordion
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
              :name="GAME_MATH_ICONS[game.slug].icon"
              class="w-7 h-7 min-w-7 min-h-7"
            />
            <NuxtImg
              v-else
              :src="game.image"
              class="w-7 h-7 min-w-7 min-h-7 rounded-full"
              loading="lazy"
              alt="Junglebet.com"
            />
          </NuxtLinkLocale>
        </template>

        <div
          class="text-sm font-bold flex items-center gap-x-1.5 leading-none w-full"
        >
          <NuxtLinkLocale
            :to="`/casino/provider/${game.gameProvider.slug}`"
            class="font-bold text-paragraph hover:text-white leading-none hidden sm:block"
            @click.stop
          >
            {{ item?.label || '' }}
          </NuxtLinkLocale>

          <span class="text-white font-bold leading-none">{{ item.game }}</span>

          <span
            class="p-0 rounded-full w-4 h-4 min-w-4 min-h-4 flex items-center"
            :class="{
              'bg-primary text-white': open,
              'bg-border': !open,
            }"
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
            class="flex items-center gap-x-1 lg:gap-x-1.5 text-paragraph"
            @click.stop
          >
            <SettingsPopover
              @click.stop
            />
            <template
              v-for="(tItem, tInd) in toolboxItems"
              :key="`${tInd}_game_tools-hey-9`"
            >
              <UTooltip
                :class="{
                  'hidden sm:flex': !tItem.mobile
                }"
                :content="{ side: 'top' }"
                arrow
                :text="tItem?.label"
              >
                <svg
                  v-if="tItem.iconType === 'symbol'"
                  class="h-5 w-5 lg:h-6 lg:w-6 min-w-5 min-h-5 lg:min-w-6 lg:min-h-6 hover:text-white"
                  @click="tItem.action"
                  @click.stop
                >
                  <use
                    :href="tItem.icon"
                  />
                </svg>
                <UIcon
                  v-else
                  :name="tItem.fill ? tItem.iconFill : tItem.icon"
                  class="h-5 w-5 lg:h-6 lg:w-6 min-w-5 min-h-5 lg:min-w-6 lg:min-h-6 hover:text-white"
                  @click="tItem.action"
                  @click.stop
                />
              </UTooltip>
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
