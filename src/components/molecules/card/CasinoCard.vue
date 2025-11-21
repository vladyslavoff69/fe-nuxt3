<script lang="ts" setup>
import LikeButton from '~/components/molecules/button/LikeButton.vue'
import type { Game, ID, xpBoost } from '~/types'
import { useGameFavorite } from '~/composables/game/useGameFavorite'
import { SITE_SETTINGS, THEME } from '~/constants'

const {
  height = '',
  sizeClass = 'w-[104px] md:w-[130px] lg:w-[150px]',
  classes = () => ({}),
  game = null,
  searchId = false
} = defineProps<{
  height?: string;
  classes?: any;
  isHoverable?: boolean;
  sizeClass?: string;
  game?: Game | null;
  searchId?: boolean;
}>()

const emits = defineEmits<{
  (e: 'searchGame', value: ID): void;
}>()

const router = useRouter()
const localePath = useLocalePath()
const { isMobileSidebarOpen } = inject(SITE_SETTINGS)!
const { screen } = inject(THEME)!
const boostedXp = computed(() => game?.xpBoosts?.find((item: xpBoost) => item?.active && item?.enabled))

const {
  isInFavorites,
  toggleFavorite
} = useGameFavorite((game ? Number(game?.id) : 1))

const searchResult = (id: ID) => {
  emits('searchGame', id)
}

const onClickCard = () => {
  if (game) {
    if (!screen.value.md && isMobileSidebarOpen.value) {
      isMobileSidebarOpen.value = false
    }

    if (searchId) {
      searchResult(game.id)
    } else {
      router.push({ path: localePath(`/casino/games/${game.gameProvider.slug}/${game.slug}`) })
    }
  }
}
</script>

<template>
  <div
    class="group max-w-full w-full h-full cursor-pointer"
    :class="[classes.root || '', sizeClass]"
    @click="onClickCard"
  >
    <div
      class="relative"
      :class="[
        height === '' ? 'aspect-3/4' : '',
        isHoverable ? 'transition-all duration-200 hover:-translate-y-2' : ''
      ]"
      :style="{
        height: height
      }"
    >
      <div
        v-if="boostedXp"
        class="absolute w-full h-[calc(100%+10px)] rounded-md border-4 z-10"
        :class="{
          'border-white': boostedXp.xp_multiplier === 2,
          'border-booster': boostedXp.xp_multiplier > 2,
        }"
      >
          <span class="uppercase absolute w-[80%] bg-brand leading-none -bottom-[12px] left-[10%] text-center font-bold text-sm text-primary">
            <span class="text-white">
              {{
                boostedXp.xp_multiplier === 2 ?
                  'DOUBLE' :
                  boostedXp.xp_multiplier === 3 ?
                    'TRIPLE' :
                    `${boostedXp.xp_multiplier}&#x0078;`
              }}
            </span> XP
          </span>
      </div>
      <div class="absolute inset-0 w-full h-full overflow-hidden rounded-md ease-out duration-1000 z-5 min-h-[150px]">
        <slot
          name="img"
        />
        <div class="flex absolute left-3 sm:left-2 top-3 sm:top-2.5 z-10">
          <slot name="top-addons" />
        </div>
        <div
          v-if="isHoverable"
          :class="{
            'group-hover:opacity-100 group-hover:h-full': isHoverable
          }"
          class="absolute top-0 w-full h-full opacity-0 ease-out duration-100 bg-transparent back"
        >
          <div class="absolute left-0 top-3 sm:top-1 right-3 z-10 w-full px-2">
            <div class="w-full flex items-center gap-x-1/2 justify-between">
              <LikeButton
                :is-active="isInFavorites"
                class="ml-auto"
                @click.prevent="toggleFavorite"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.back {
  transform: rotateY(180deg)
}
</style>
