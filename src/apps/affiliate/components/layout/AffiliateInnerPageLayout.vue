<script lang="ts" setup>
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import { AFFILIATE_ICON } from '~/components/symbols'
import { AUTH, THEME } from '~/constants'

const { me } = inject(AUTH)!
const { screen } = inject(THEME)!
const { t } = useI18n()
const localePath = useLocalePath()
const sponsorCode = computed(() => me.value?.sponsorAffiliates?.sponsorCode)

const tabs = computed(() => {
  const arr = [
    {
      label: t('affiliate.overview'),
      value: localePath('/affiliate/overview'),
      icon: 'material-symbols:menu-book',
      iconType: 'ui',
    },
    {
      label: t('affiliate.my-code'),
      value: localePath('/affiliate/overview/my-code'),
      icon: 'material-symbols:settings-account-box',
      iconType: 'ui',
    },
    {
      label: t('affiliate.commissions'),
      value: localePath('/affiliate/overview/commissions'),
      icon: 'iconoir:percentage-circle-solid',
      iconType: 'ui',
    },
  ]

  if (sponsorCode.value) {
    return [
      ...arr,
      {
        label: t('affiliate.claim-and-earned'),
        value: localePath('/affiliate/overview/claims'),
        icon: 'streamline:discount-percent-badge-solid',
        iconType: 'ui',
      },
      {
        label: t('affiliate.statistics'),
        value: localePath('/affiliate/overview/statistics'),
        icon: 'material-symbols:bar-chart',
        iconType: 'ui',
      }
    ]
  }

  return [
    ...arr,
    {
      label: t('affiliate.statistics'),
      value: localePath('/affiliate/overview/statistics'),
      icon: 'material-symbols:bar-chart',
      iconType: 'ui',
    }
  ]
})

const router = useRouter()
const selectedTab = computed({
  get () {
    return router.currentRoute.value.path
  },
  set (v) {
    const path = router.currentRoute.value.path
    if (v !== path) {
      router.push({ path: v })
    }
  },
})

const currentTab = computed({
  get () {
    const path = router.currentRoute.value.path
    const index = tabs.value?.findIndex((item: any) => item.value === path)

    if (index === -1) {
      return localePath('/affiliate/overview')
    }

    return path
  },
  set (v) {
    const path = router.currentRoute.value.path
    if (v !== path) {
      router.push({ path: v })
    }
  },
})

const [tabParent] = useAutoAnimate({
  duration: 150,
})

const { sendFingerprint } = useSendFingerprint()

onMounted(async () => {
  await sendFingerprint()
})
</script>

<template>
  <div
    v-if="!!me"
    class="flex flex-col gap-y-2 md:gap-y-6"
  >
    <h1 class="flex text-xl md:text-xxl font-bold items-center gap-2">
      <svg
        class="h-5 w-5 min-w-5 min-h-5 lg:h-7 lg:w-7"
      >
        <use :href="AFFILIATE_ICON" />
      </svg>
      {{ t("affiliate.affiliate-program") }}
    </h1>
    <div class="grid grid-cols-12 h-full w-full lg:min-h-[560px]">
      <div
        v-if="screen.lg"
        class="col-span-2 h-full pr-4 border-r border-border"
      >
        <UTabs
          v-model="currentTab"
          :items="tabs"
          orientation="vertical"
          size="xl"
          class="w-full"
          :ui="{
            trigger: 'w-full min-w-40 h-10',
            leadingIcon: 'size-5'
          }"
        >
          <template #default="{ item }">
            <div class="flex items-center gap-x-2 relative cursor-pointer">
              <svg
                v-if="item.iconType === 'symbol'"
                class="block text-current w-5 h-5 min-w-5 min-h-5"
              >
                <use :href="item.icon" />
              </svg>
              {{ item?.label || '' }}
            </div>
          </template>
        </UTabs>
      </div>
      <div
        class="col-span-12 lg:col-span-10 w-full pl-0 md:px-4 md:pb-4 flex flex-col gap-y-3 lg:min-h-[calc(100vh-200px)]"
      >
        <div v-if="!screen.lg">
          <JTabs
            v-model="selectedTab"
            :tabs="tabs"
            class="w-full md:w-auto mr-2"
            width="auto"
          />
        </div>

        <div ref="tabParent">
          <NuxtPage />
        </div>
      </div>
    </div>
  </div>
</template>
