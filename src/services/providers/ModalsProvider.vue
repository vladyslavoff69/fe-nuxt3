<script lang="ts" setup>
import { AUTH, MODALS, THEME } from '~/constants'
import UserMiniProfile from '~/apps/user/components/UserMiniProfile.vue'
import CasinoCard from '~/components/molecules/card/CasinoCard.vue'
import GameImage from '~/components/molecules/game/GameImage.vue'
import CloseButton from '~/components/molecules/button/CloseButton.vue'
import InputCheckbox from '~/components/molecules/common/InputCheckbox.vue'
import type { Game } from '~/types'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const { screen } = inject(THEME)!
const token = getAuthCookie()
const { me, isLoggedIn } = inject(AUTH)!
const loadingCache = ref(false)
const showRecentModal = ref(false)
const dontShowRecent = ref(false)
const recentGamesLoading = ref(false)
const gameList = ref<Game[]>([])
const myRecentGames = computed(() => (gameList.value || []))

const onModalVisibleChange = (show: boolean) => {
  if (!show) {
    const queryWithoutModal = { ...route.query }

    delete queryWithoutModal.modal
    delete queryWithoutModal.name
    delete queryWithoutModal.slug
    delete queryWithoutModal.currency
    delete queryWithoutModal.type
    delete queryWithoutModal.refId
    delete queryWithoutModal.tab
    delete queryWithoutModal.id

    router.push({
      ...router.currentRoute,
      query: { ...queryWithoutModal },
    })
  }
}

const userModal = computed({
  get () {
    return route.query.modal === 'user'
  },
  set (v) {
    if (!v) {
      onModalVisibleChange(false)
    }
  }
})

const chatLockedModalVisible = computed<boolean>({
  get () {
    return route.query.modal === 'chat-locked'
  },
  set (v) {
    if (v) {
      router.push({
        ...router.currentRoute,
        query: {
          modal: 'chat-locked'
        }
      })
    } else {
      router.push({
        ...router.currentRoute,
        query: {}
      })
    }
  }
})

const getGameList = async () => {
  if (recentGamesLoading.value) {
    return
  }

  recentGamesLoading.value = true
  const { data } = await useFetch(
    `/api/kv/game/${me.value?.id}`,
    {
      // @ts-ignore
      headers: { Authorization: `Bearer ${token.value}` },
    }
  )
  recentGamesLoading.value = false

  // @ts-ignore
  if (data.value && data.value?.key) {
    // @ts-ignore
    if (data.value?.value && data.value?.value !== '') {
      // @ts-ignore
      gameList.value = JSON.parse(data.value?.value)
    }
  }
}

const getCacheKv = async () => {
  if (loadingCache.value || recentGamesLoading.value) {
    return
  }

  loadingCache.value = true
  const { data } = await useFetch(
    `/api/kv/cache/${me.value?.id}`,
    {
      // @ts-ignore
      headers: { Authorization: `Bearer ${token.value}` },
    }
  )
  loadingCache.value = false

  // @ts-ignore
  if (data.value && data.value?.key) {
    // @ts-ignore
    if (!data.value?.value && myRecentGames.value && myRecentGames.value.length) {
      showRecentModal.value = true
    }
  }
}

const updateCacheKv = async () => {
  if (loadingCache.value) {
    return
  }
  loadingCache.value = true
  await useFetch(
    `/api/kv/cache/${me.value?.id}`,
    {
      method: 'POST',
      // @ts-ignore
      body: { value: true },
      headers: {
        Authorization: `Bearer ${token.value}`,
      }
    }
  )
  loadingCache.value = false
  showRecentModal.value = false
}

watch(() => dontShowRecent.value, (v) => {
  if (v) {
    if (me.value?.id && !!token.value) {
      updateCacheKv()
    }
  }
}, { immediate: true })

watch(() => isLoggedIn.value, (v) => {
  if (v) {
    if (me.value?.id && !!token.value) {
      getGameList()
      getCacheKv()
    }
  }
}, { immediate: true })

watch(() => recentGamesLoading.value, (v) => {
  if (!v && me.value?.id && !!token.value && isLoggedIn.value) {
    getCacheKv()
  }
}, { immediate: true })

provide(MODALS, {
  chatLockedModalVisible,
  myRecentGames,
  recentGamesLoading,
  gameList
})

onMounted(() => {
  if (!!me.value?.id && !!token.value && isLoggedIn.value) {
    getGameList()
  }
})
</script>

<template>
  <div class="w-full h-full p-0 m-0">
    <slot />

    <ClientOnly>
      <UModal
        v-model:open="userModal"
        :default-open="userModal"
        class="w-11/12 sm:max-w-sm p-2 md:p-4 bg-brand"
        @update:open="(v) => {
        if (!v) {
          onModalVisibleChange(false)
        }
      }"
      >
        <template #content>
          <UserMiniProfile
            @close:details-modal="onModalVisibleChange"
          />
        </template>
      </UModal>
    </ClientOnly>

    <ClientOnly>
      <UModal
        v-model:open="showRecentModal"
        :default-open="showRecentModal"
        class="px-0 py-0 md:px-0 md:py-0 overflow-hidden bg-green-950 max-w-xs"
        @update:open="(v) => {
        if (!v) {
          showRecentModal = false
        }
      }"
      >
        <template #header>
          <div
            class="flex justify-between items-center w-full"
          >
            <div
              class="text-base text-white gap-2 font-bold flex items-center"
            >
              <UIcon
                class="w-5 h-5 min-w-5 min-h-5 text-white"
                name="pajamas:history"
              />
              <span
                class="text-white text-base font-bold leading-normal"
              >
              My {{ t('menu.my-recents') }} Game
            </span>
            </div>
            <CloseButton
              class="w-3 h-3 min-w-3 min-h-3"
              @click="showRecentModal = false"
            />
          </div>
        </template>
        <template #body>
          <div class="w-full flex flex-col gap-4">
            <div class="grid w-full grid-cols-5">
              <div class="col-span-1" />
              <div class="col-span-3">
                <CasinoCard
                  v-if="myRecentGames && myRecentGames.length"
                  :game="myRecentGames[(myRecentGames.length - 1)]"
                  :title="myRecentGames?.[(myRecentGames.length - 1)]?.title"
                  :is-hoverable="screen.lg"
                  size-class="w-full"
                >
                  <template #img>
                    <GameImage :game="myRecentGames[(myRecentGames.length - 1)]" />
                  </template>
                </CasinoCard>
              </div>
              <div class="col-span-1" />
            </div>
            <div class="grid w-full grid-cols-5">
              <div class="col-span-1" />
              <div class="col-span-3 flex items-center justify-center">
                <NuxtLinkLocale
                  v-if="myRecentGames && myRecentGames.length"
                  :to="`/casino/games/${myRecentGames?.[(myRecentGames.length - 1)]?.gameProvider?.slug}/${myRecentGames?.[(myRecentGames.length - 1)]?.slug}`"
                >
                  <JButton
                    class="px-6"
                    variant="bet-gradient"
                  >
                    Play Game
                  </JButton>
                </NuxtLinkLocale>
              </div>
              <div class="col-span-1" />
            </div>
            <div class="w-full flex items-center justify-center">
              <InputCheckbox
                v-model="dontShowRecent"
              >
              <span
                class="cursor-pointer m-0 text-xs font-semibold text-paragraph hover:text-white"
              >
                Don't show this again
              </span>
              </InputCheckbox>
            </div>
          </div>
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>
