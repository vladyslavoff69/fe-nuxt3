<script lang="ts" setup>
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import MainSidebar from '~/components/organisms/sidebar/index.vue'
import ContainerProvider from '~/services/providers/ContainerProvider.vue'
import GameModalProvider from '~/services/providers/GameModalProvider.vue'
import ChatContainer from '~/components/organisms/chat/ChatContainer.vue'
import NotificationContainer from '~/components/organisms/notification/index.vue'
import { AUTH, CHAT, GEO_ARRAY, NOTIFICATION } from '~/constants'

const token = getAuthCookie()
const router = useRouter()
const route = useRoute()
const localePath = useLocalePath()
const runtimeConfig = useRuntimeConfig()
const { ipAddress, me, isLoggedIn, loading } = inject(AUTH)!
const { isOpen, closeChat } = inject(CHAT)!
const { isOpen: isOpenNotification } = inject(NOTIFICATION)!
const { getRegionData } = useRegionBlock()
const { getStatusCheck } = useMaintenanceMode()
const sendLoading = ref(false)
const isReady = ref(false)
const { sendFingerprint } = useSendFingerprint()

const updateUserIp = async () => {
  if (sendLoading.value) {
    return
  }

  sendLoading.value = true
  await $fetch(
    `/api/kv/ip/${me.value?.id}`,
    {
      method: 'POST',
      body: { value: ipAddress.value },
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }
  )
  sendLoading.value = false
}

watch(() => isLoggedIn.value, (v) => {
  if (v && me.value?.id && ipAddress.value && ipAddress.value !== '' && token.value) {
    updateUserIp()
  }
}, { immediate: true })

watch(() => ipAddress.value, (v) => {
  if (v && v !== '' && me.value?.id && token.value) {
    updateUserIp()
  }
}, { immediate: true })

onMounted(async () => {
  const check = await getStatusCheck()
  // @ts-ignore
  if (!check?.timestamp) {
    await router.push({ path: localePath('/maintenance') })
  }

  const data = await getRegionData()
  // @ts-ignore
  ipAddress.value = data?.ip || null

  if (
    // @ts-ignore
    GEO_ARRAY.includes(data?.loc) && !runtimeConfig.public?.whitelistIPs?.includes(data?.ip) &&
    runtimeConfig.public?.checkRegion
  ) {
    await router.push({
      ...router.currentRoute,
      query: {
        ...route.query,
        modal: 'region',
      },
    })
  } else if (route.query.modal && route.query.modal === 'region') {
    delete route.query.modal

    if (route.query) {
      // @ts-ignore
      const queryVal = Object.keys(route.query).map(key => `${key}=${encodeURIComponent(route.query[key])}`).join('&')
      window.location.href = `${router.currentRoute.value.path}?${queryVal}`
    } else {
      window.location.href = router.currentRoute.value.path
    }
  }

  isReady.value = true

  await sendFingerprint()
})

const [pageParent] = useAutoAnimate({ duration: 100 })
</script>
<template>
  <div class="flex flex-col relative h-screen w-full p-0 m-0 overflow-hidden">
    <ClientOnly>
      <DelayHydration>
        <LazyJUHeader :hydrate-when="isReady && !loading" />
      </DelayHydration>
    </ClientOnly>

    <UMain class="flex w-full h-[calc(100vh-var(--header-height))] md:h-full mt-(--header-height)">
      <div
        class="hidden md:block flex-1 w-full h-full bg-navbar shadow-sidebar shadow-brand"
      >
        <ClientOnly>
          <MainSidebar />
        </ClientOnly>
      </div>

      <JbScrollbar
        :scroll-x="false"
        :scrollup-on-page="true"
        class="flex-auto w-full h-full pr-0 pl-1.5 md:pl-0 pb-8 md:pb-0 px-0 mx-auto flex"
        height="calc(100vh-var(--header-height))"
        style-type="content"
      >
        <ContainerProvider>
          <div class="w-full pb-0 px-0">
            <UContainer
              class="px-0! md:px-4! w-full"
            >
              <GameModalProvider>
                <div
                  ref="pageParent"
                  class="w-full mx-auto xl:max-w-(--breakpoint-xl) h-full"
                >
                  <slot />
                </div>
              </GameModalProvider>
            </UContainer>

            <JUFooter />
          </div>
        </ContainerProvider>
      </JbScrollbar>

      <div
        :class="[
          {
            'min-w-80': isOpen,
            'overflow-hidden': !isOpen
          }
        ]"
        class="hidden md:block w-0 h-full border-l border-l-green-950"
      >
        <ClientOnly>
          <ChatContainer
            v-if="isOpen"
            @update:close-chat="closeChat"
          />
        </ClientOnly>
      </div>

      <div
        :class="[
          {
            'min-w-80': isOpenNotification,
            'overflow-hidden': !isOpenNotification
          }
        ]"
        class="hidden md:block w-0 h-full border-l border-l-green-950"
      >
        <ClientOnly>
          <NotificationContainer v-if="isOpenNotification" />
        </ClientOnly>
      </div>
    </UMain>

    <DelayHydration>
      <LazyJUNavbar hydrate-on-media-query="(max-width: 768px)" />
    </DelayHydration>

    <img
      id="1000525822_cpa_testing"
      src="https://ads.trafficjunky.net/ct?a=1000525822&member_id=1007039572&cb=[RANDOM_NUMBER]&cti=[TRANSACTION_UNIQ_ID]&ctv=&ctd=[TRANSACTION_DESCRIPTION]"
      width="1"
      height="1"
      border="0"
      style="border: 0; width: 1px; height: 1px;"
      alt="Junglebet"
    >
  </div>
</template>
